// app/layout.tsx (Server Component — stays clean)
import './globals.css';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ThemeProviderWrapper from '../components/ThemeProviderWrapper';
import ClientAuthSync from '../components/ClientAuthSync';

export const metadata = { title: 'AgentHire' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProviderWrapper>
          {/* <Nav /> */}
          <ClientAuthSync />
          <main className="mx-auto max-w-5xl py-4">{children}</main>
          <Footer />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
