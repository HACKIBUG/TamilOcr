import { useState } from "react";
import { Link } from "wouter";
// import { ThemeToggle } from "@/components/ThemeToggle"; //Removed import
import { Button } from "@/components/ui/button";
import { ScanLine, Menu } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Features", href: "#features" },
  { name: "Upload & Process", href: "#process" },
  { name: "Demo", href: "#demo" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 10);
    });
  }

  const headerClasses = `fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 border-b backdrop-blur-md 
    ${isScrolled 
      ? "bg-white/80 dark:bg-dark-900/80 border-gray-200 dark:border-dark-700" 
      : "bg-transparent border-transparent"
    }`;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href = '/'}>
          <span className="text-primary-600 dark:text-primary-400 text-3xl">
            <ScanLine />
          </span>
          <span className="font-bold text-xl">
            Tamil<span className="text-primary-600 dark:text-primary-400">OCR</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              className="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/*ThemeToggle removed*/}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-primary-600 dark:text-primary-400 text-2xl">
                      <ScanLine />
                    </span>
                    <span className="font-bold text-lg">
                      Tamil<span className="text-primary-600 dark:text-primary-400">OCR</span>
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-6 text-lg mt-8">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a 
                      href={link.href} 
                      className="py-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}