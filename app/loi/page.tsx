import LOIForm from "@/components/LOIForm";
import Link from "next/link";

export default function LOIPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="flex-1 w-full px-6 py-8">
        <LOIForm />
      </div>

      {/* Minimal Footer */}
      <div className="w-full px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Legal AI Factories · All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
