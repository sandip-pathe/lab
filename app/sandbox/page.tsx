import HeroNew from "@/components/HeroNew";
import FeaturesNew from "@/components/FeaturesNew";
import LabSection from "@/components/LabSection";
import CaseStudies from "@/components/CaseStudies";
import BlogArticles from "@/components/BlogArticles";
import Footer from "@/components/Footer";

export default function SandboxPage() {
  return (
    <main className="min-h-screen">
      <HeroNew />
      <FeaturesNew />
      <LabSection />
      <CaseStudies />
      <BlogArticles />
      <Footer />
    </main>
  );
}
