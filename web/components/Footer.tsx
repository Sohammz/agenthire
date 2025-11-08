export default function Footer() {
  return (
    <footer className="w-full border-t mt-16">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} AgentHire. All rights reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="https://github.com/Sohammz/agenthire" target="_blank" className="hover:underline">
            GitHub
          </a>
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/about" className="hover:underline">About</a>
        </div>
      </div>
    </footer>
  );
}
