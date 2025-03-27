import { ScanLine, Github, Twitter, Linkedin, Facebook } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-primary-600 dark:text-primary-400 text-3xl">
                <ScanLine />
              </span>
              <span className="font-bold text-xl">
                Tamil<span className="text-primary-600 dark:text-primary-400">OCR</span>
              </span>
            </div>
            <p className="text-dark-600 dark:text-gray-400 text-sm mb-6">
              Preserving Tamil's rich literary heritage through advanced AI-powered document digitization.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-dark-700 text-dark-600 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-dark-700 text-dark-600 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-dark-700 text-dark-600 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</a>
              </li>
              <li>
                <a href="#features" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
              </li>
              <li>
                <a href="#process" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Upload & Process</a>
              </li>
              <li>
                <a href="#demo" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Demo</a>
              </li>
              <li>
                <a href="#contact" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">API Access</a>
              </li>
              <li>
                <a href="#" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Research Papers</a>
              </li>
              <li>
                <a href="#" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-dark-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Corpus Dataset</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Newsletter</h4>
            <p className="text-dark-600 dark:text-gray-400 text-sm mb-4">
              Subscribe to get updates on our latest research and features.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full rounded-l-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 focus:border-primary-500 focus:ring-primary-500 text-sm" 
                />
                <button 
                  type="submit" 
                  className="px-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium rounded-r-md transition-colors text-sm"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="text-dark-500 dark:text-gray-400 text-xs">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-dark-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 dark:text-gray-400 text-sm">
            &copy; {currentYear} Tamil OCR Project. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-dark-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-dark-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-dark-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
