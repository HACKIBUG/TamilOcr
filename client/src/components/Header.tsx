import { Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-dark-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Tamil OCR
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Button variant="link" asChild>
              <Link href="/#about">About</Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="/#features">Features</Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="/#demo">Demo</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="default" asChild>
            <Link href="/#upload">Upload Document</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}