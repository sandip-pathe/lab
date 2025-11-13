export default function Footer() {
  return (
    <footer className="py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          © 2025 Legal AI Factories · Co-building the infrastructure of law.
        </p>

        <div className="flex gap-6">
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
