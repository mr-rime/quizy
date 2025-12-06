import { NextRequest, NextResponse } from 'next/server';

interface PixabayHit {
    id: number;
    largeImageURL: string;
    webformatURL: string;
    previewURL: string;
    user: string;
    tags: string;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query');
        const page = searchParams.get('page') || '1';
        const perPage = searchParams.get('per_page') || '15';

        if (!query) {
            return NextResponse.json(
                { error: 'Query parameter is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.PIXABAY_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Pixabay API key not configured' },
                { status: 500 }
            );
        }

        const pixabayUrl = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=illustration&page=${page}&per_page=${perPage}&safesearch=true`;

        const response = await fetch(pixabayUrl);

        if (!response.ok) {
            throw new Error(`Pixabay API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            photos: data.hits.map((hit: PixabayHit) => ({
                id: hit.id,
                url: hit.largeImageURL,
                thumbnail: hit.webformatURL,
                small: hit.previewURL,
                photographer: hit.user,
                alt: hit.tags || query,
            })),
            page: parseInt(page),
            perPage: parseInt(perPage),
            totalResults: data.totalHits,
            nextPage: parseInt(page) * parseInt(perPage) < data.totalHits ? `${parseInt(page) + 1}` : null,
        });
    } catch (error) {
        console.error('Error fetching from Pixabay:', error);
        return NextResponse.json(
            { error: 'Failed to fetch images from Pixabay' },
            { status: 500 }
        );
    }
}
