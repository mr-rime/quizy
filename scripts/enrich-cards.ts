import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { cards } from '../db/schema';
import { eq, or, isNull, sql } from 'drizzle-orm';

config({ path: '.env' });

const BATCH_SIZE = 1;
const RATE_LIMIT_MS = 5000;
const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT_ARG = process.argv.find(arg => arg.startsWith('--limit='));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1]) : undefined;

const API_URL = 'https://router.huggingface.co/v1/chat/completions';
const MODEL_ID = 'Qwen/Qwen2.5-72B-Instruct';

console.log(`🌐 Using Hugging Face API: ${API_URL}`);
console.log(`🧠 Model: ${MODEL_ID}`);
console.log(process.env.HUGGINGFACE_API_KEY ? '🔑 API Key detected' : '⚠️  No API Key found - Rate limits will be strict');
console.log('\n');

const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle(queryClient);



interface BilingualExample {
    english: string;
    arabic: string;
}

interface EnrichmentResult {
    isValid?: boolean;
    examples?: BilingualExample[];
    wordType?: string;
}

async function queryHuggingFace(prompt: string, retries = 5): Promise<string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (process.env.HUGGINGFACE_API_KEY) headers['Authorization'] = `Bearer ${process.env.HUGGINGFACE_API_KEY}`;

    const messages = [
        {
            role: "system",
            content: "You are an expert Arabic linguist and translator specializing in educational content."
        },
        {
            role: "user",
            content: prompt
        }
    ];

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: MODEL_ID, // Use Llama 3.1
                messages: messages,
                max_tokens: 1000,
                temperature: 0.1, // Very low for strict JSON adherence
                top_p: 0.9,
                stream: false
            }),
        });

        if (response.status === 503) {
            if (retries > 0) {
                const waitTime = 20000;
                console.warn(`⏳ Model is loading (503). Waiting ${waitTime / 1000}s... (${retries} retries left)`);
                await sleep(waitTime);
                return queryHuggingFace(prompt, retries - 1);
            } else {
                throw new Error('Model failed to load after multiple retries.');
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HF API request failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error: Error | unknown) {
        throw new Error(`HF API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function enrichCardWithAI(term: string, definition: string | null): Promise<EnrichmentResult> {
    const prompt = `
You are an expert Arabic linguist and translator specializing in educational content.

TASK:
Analyze the term "${term}"${definition ? ` (Context/Meaning: ${definition})` : ''}.
First, determine if this is a valid English word or phrase that has a meaningful definition.

If it is NOT a valid/meaningless word (e.g. nonsense, random characters, typos, or not English), return:
{ "isValid": false }

If it IS a valid word, create 3 high-quality bilingual English-Arabic examples and identify the word type.

STRICT REQUIREMENTS:
1. **English Examples**: Must be natural, complete sentences containing the exact word "${term}". Do NOT use synonyms.
2. **Arabic Examples**: Must be natural, grammatically correct Modern Standard Arabic (MSA). Do NOT use literal translations if they sound unnatural.
3. **Word Type**: Identify the grammatical category of "${term}" (e.g., Noun, Verb, Adjective, Phrasal Verb, Idiom).
4. **Output Format**: Return ONLY valid JSON. No markdown, no conversational text.

JSON FORMAT:
{
  "isValid": true,
  "wordType": "Type (e.g., Noun)",
  "examples": [
    { "english": "English sentence 1", "arabic": "Arabic translation 1" },
    { "english": "English sentence 2", "arabic": "Arabic translation 2" },
    { "english": "English sentence 3", "arabic": "Arabic translation 3" }
  ]
}
`;

    try {
        const outputText = await queryHuggingFace(prompt);

        const jsonMatch = outputText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.warn(`⚠️ Could not find JSON in response for "${term}"`);
            return {};
        }

        try {
            const parsed = JSON.parse(jsonMatch[0]);

            if (parsed.isValid === false) {
                console.warn(`⚠️ Invalid word for "${term}"`);
                return { isValid: false };
            }

            if (!parsed.examples || !Array.isArray(parsed.examples) || parsed.examples.length === 0) {
                console.warn(`⚠️ Invalid JSON structure for "${term}"`);
                return {};
            }

            return {
                isValid: true,
                examples: parsed.examples,
                wordType: parsed.wordType || null,
            };
        } catch {
            console.warn(`⚠️ JSON parse error for "${term}"`);
            return {};
        }

    } catch (err) {
        console.error(`❌ Error enriching "${term}":`, err instanceof Error ? err.message : String(err));
        return {};
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function enrichCards() {
    console.log(`🚀 Starting card enrichment process with ${MODEL_ID}...\n`);

    if (DRY_RUN) console.log('📋 DRY RUN MODE - No changes will be made to the database\n');
    if (LIMIT) console.log(`📊 Processing limit: ${LIMIT} cards\n`);

    const query = db.select({
        id: cards.id,
        term: cards.term,
        definition: cards.definition,
        examples: cards.examples,
        wordType: cards.wordType,
    })
        .from(cards)
        .where(
            or(
                isNull(cards.examples),
                sql`json_array_length(${cards.examples}) = 0`,
                isNull(cards.wordType)
            )
        );

    const allCards = await query;

    const cardsNeedingEnrichmentRaw = allCards.filter(c => {
        const hasExamples = c.examples && Array.isArray(c.examples) && c.examples.length > 0;
        const hasWordType = !!c.wordType;
        return !hasExamples || !hasWordType;
    });

    const cardsNeedingEnrichment = LIMIT ? cardsNeedingEnrichmentRaw.slice(0, LIMIT) : cardsNeedingEnrichmentRaw;

    console.log(`✅ Found ${cardsNeedingEnrichment.length} cards needing enrichment (Total eligible: ${cardsNeedingEnrichmentRaw.length})\n`);

    if (cardsNeedingEnrichment.length === 0) {
        console.log('🎉 All cards are already enriched! Nothing to do.');
        await queryClient.end();
        return;
    }

    let processedCount = 0;
    let enrichedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < cardsNeedingEnrichment.length; i += BATCH_SIZE) {
        const batch = cardsNeedingEnrichment.slice(i, i + BATCH_SIZE);

        console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(cardsNeedingEnrichment.length / BATCH_SIZE)}...`);

        for (const card of batch) {
            processedCount++;

            console.log(`🔄 [${processedCount}/${cardsNeedingEnrichment.length}] ID: ${card.id} | Term: "${card.term}"`);
            if (card.definition) {
                console.log(`      Context: ${card.definition.substring(0, 100).replace(/\n/g, ' ')}${card.definition.length > 100 ? '...' : ''}`);
            }

            let enrichment: EnrichmentResult = {};
            let retry = 0;
            const MAX_RETRIES = 2;

            while (retry <= MAX_RETRIES) {
                enrichment = await enrichCardWithAI(card.term, card.definition);

                if (enrichment.isValid === false) {
                    break;
                }

                if (enrichment.examples && enrichment.examples.length > 0 && enrichment.wordType) {
                    break;
                }

                if (retry < MAX_RETRIES) {
                    console.warn(`   ⚠️ Incomplete result, retrying (${retry + 1}/${MAX_RETRIES})...`);
                    await sleep(3000);
                }
                retry++;
            }

            if (enrichment.isValid === false) {
                console.log(`   🚫 Invalid/Meaningless word. Skipping.`);
                skippedCount++;
                continue;
            }

            if (!enrichment.examples?.length || !enrichment.wordType) {
                console.error(`   ❌ Failed to enrich "${card.term}" after retries.`);
                errorCount++;
                continue;
            }

            const updateData: Partial<typeof cards.$inferInsert> = {};
            if (!card.examples || (Array.isArray(card.examples) && card.examples.length === 0)) {
                updateData.examples = enrichment.examples;
            }
            if (!card.wordType) {
                updateData.wordType = enrichment.wordType;
            }

            if (!DRY_RUN && Object.keys(updateData).length > 0) {
                try {
                    await db.update(cards).set(updateData).where(eq(cards.id, card.id));
                    console.log(`   ✅ Saved! Word Type: ${enrichment.wordType}`);
                    console.log(`      Ex: ${enrichment.examples[0].english} -> ${enrichment.examples[0].arabic}`);
                    enrichedCount++;
                } catch (err) {
                    console.error(`   ❌ Database error:`, err instanceof Error ? err.message : String(err));
                    errorCount++;
                }
            } else if (DRY_RUN) {
                console.log(`   📝 [DRY RUN] Would save:`);
                console.log(`      Word Type: ${enrichment.wordType}`);
                console.log(`      Ex 1: ${enrichment.examples[0].english} -> ${enrichment.examples[0].arabic}`);
                enrichedCount++;
            } else {
                console.log(`   ⏭️  Nothing to update (fields already present).`);
                skippedCount++;
            }

            await sleep(RATE_LIMIT_MS);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('ENRICHMENT SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully enriched: ${enrichedCount}`);
    console.log(`⏭ Skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`Total processed: ${processedCount}`);
    console.log('='.repeat(50));

    await queryClient.end();
}

enrichCards().catch(err => {
    console.error('❌ Fatal error:', err instanceof Error ? err.message : String(err));
    process.exit(1);
});
