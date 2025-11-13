import LOIForm from "@/components/LOIForm";
import Footer from "@/components/Footer";

export default function LOIPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="flex-1 w-full px-6 py-8">
        <LOIForm />
      </div>
      <Footer />
    </main>
  );
}
