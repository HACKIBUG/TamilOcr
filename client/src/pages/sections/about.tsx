import { BookOpen, Search, Cpu, ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-dark-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Our Project</h2>
          <p className="text-dark-600 dark:text-gray-300">
            Preserving and digitizing Tamil's rich literary heritage for future generations
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571867424488-4565932edb41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Ancient Tamil palm leaf manuscript" 
                className="rounded-xl shadow-lg w-full object-cover h-[400px]"
              />
              <div className="absolute -right-4 -bottom-4 bg-white dark:bg-dark-800 p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex-shrink-0">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Preserving Heritage</p>
                    <p className="text-sm text-dark-500 dark:text-gray-400">1000+ manuscripts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Why Digitize Tamil Historical Documents?</h3>
            <p className="text-dark-600 dark:text-gray-300 leading-relaxed">
              Tamil is one of the world's oldest classical languages with a rich literary tradition spanning thousands of years. 
              However, many historical manuscripts and documents are deteriorating or difficult to access.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12h18" />
                    <path d="M3 6h18" />
                    <path d="M3 18h18" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-lg">Preservation</h4>
                  <p className="text-dark-600 dark:text-gray-400">
                    Digitizing fragile manuscripts ensures they survive for future generations.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex-shrink-0 mt-1">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-lg">Accessibility</h4>
                  <p className="text-dark-600 dark:text-gray-400">
                    Creating searchable text allows scholars worldwide to study these materials.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex-shrink-0 mt-1">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-lg">AI-Powered Processing</h4>
                  <p className="text-dark-600 dark:text-gray-400">
                    Our system utilizes TrOCR and IndicBERT models specifically fine-tuned for Tamil script recognition.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <a 
                href="#features" 
                className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Explore our technology
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
