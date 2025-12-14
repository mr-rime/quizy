import { CTASection } from "@/features/landing/components/cta-section"
import { FAQSection } from "@/features/landing/components/faq-section"
import { FeaturesSection } from "@/features/landing/components/features-section"
import { HeroSection } from "@/features/landing/components/hero-section"
import { LandingFooter } from "@/features/landing/components/landing-footer"
import { LandingHeader } from "@/features/landing/components/landing-header"
import { PricingSection } from "@/features/landing/components/pricing-section"
import { TestimonialsSection } from "@/features/landing/components/testimonials-section"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            <LandingHeader />
            <main className="pt-24 pb-16">
                <HeroSection />
                <FeaturesSection />
                <TestimonialsSection />
                <PricingSection />
                <FAQSection />
                <CTASection />
            </main>
            <LandingFooter />
        </div>
    )
}
