import BlogSection from "@/pages/frontend/components/blog-section"
import ProductsSection from "@/pages/frontend/components/products-section"
import VacanciesSection from "@/pages/frontend/components/vacancies-section"
import { HeroSection } from "@/pages/frontend/components/hero-section"
import { SiteHeader } from "@/pages/frontend/components/site-header"
import { SiteFooter } from "@/pages/frontend/components/site-footer"

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <HeroSection />
                <BlogSection />
                <ProductsSection />
                <VacanciesSection />
            </main>
            <SiteFooter />
        </div>
    )
}
