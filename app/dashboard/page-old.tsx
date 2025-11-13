import FunnelDashboard from "@/components/FunnelDashboard";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Legal AI Lab Pilot Funnel
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Live view of firms joining our Legal AI Factory initiative. Each
            stage represents deeper collaboration and pilot commitment.
          </p>
        </div>

        {/* Dashboard Component */}
        <FunnelDashboard />

        {/* Bottom Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">
            The Legal AI Factory is already in motion.
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Each pilot firm adds structured data, real-world feedback, and
            domain expertise that trains the factory. This isn’t a product demo
            — it’s the start of a legal infrastructure revolution.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
