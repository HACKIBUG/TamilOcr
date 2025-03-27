import { ArrowDown, Play, Upload, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroBackgroundUrl = "https://images.unsplash.com/photo-1595426496987-37c7105de1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 clip-hero overflow-hidden"
      style={{ 
        backgroundImage: `url('${heroBackgroundUrl}')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 gradient-overlay bg-gradient-to-b from-[rgba(18,18,18,0.85)] to-[rgba(18,18,18,0.95)] dark:from-[rgba(18,18,18,0.85)] dark:to-[rgba(18,18,18,0.95)] light:from-[rgba(250,250,250,0.85)] light:to-[rgba(250,250,250,0.95)]"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                Preserving Tamil Heritage Through <span className="text-primary-600 dark:text-primary-400">AI-Powered OCR</span>
              </h1>
              <p className="text-lg md:text-xl text-dark-600 dark:text-gray-300 max-w-xl">
                Transform historical Tamil manuscripts and documents into searchable, editable digital text with our advanced AI recognition system.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-lg shadow-primary-600/20 dark:shadow-primary-500/20"
                asChild
              >
                <a href="#process">
                  <Upload className="mr-2 h-5 w-5" /> Upload Document
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white dark:bg-dark-800 text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-700 border-gray-200 dark:border-dark-700"
                asChild
              >
                <a href="#demo">
                  <Play className="mr-2 h-4 w-4" /> View Demo
                </a>
              </Button>
            </div>
            
            <div className="pt-4">
              <p className="text-dark-500 dark:text-gray-400 text-sm flex items-center gap-2">
                <ShieldCheck className="text-emerald-500 h-4 w-4" /> 
                Advanced AI with 98% accuracy for Tamil script recognition
              </p>
            </div>
          </div>
          
          <div className="image-container hidden lg:block">
            <div className="image-card bg-white dark:bg-dark-800 rounded-xl overflow-hidden custom-shadow transform rotate-y-[-15deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-y-0 hover:rotate-x-0">
              <div className="bg-gray-100 dark:bg-dark-700 p-3 flex justify-between items-center border-b border-gray-200 dark:border-dark-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-dark-500 dark:text-gray-400">Tamil OCR in action</div>
                <div className="w-12"></div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-dark-500 dark:text-gray-400">Original Document</p>
                    <img 
                      className="rounded-lg w-full object-cover h-64" 
                      src="https://images.unsplash.com/photo-1604344929197-e971d8f8f975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Tamil manuscript" 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-dark-500 dark:text-gray-400">Extracted Text</p>
                    <div className="bg-gray-50 dark:bg-dark-900 p-3 rounded-lg h-64 overflow-y-auto tamil-text">
                      <p className="text-dark-800 dark:text-gray-300 leading-relaxed">
                        பழந்தமிழ் இலக்கியங்களில் ஒன்றான சிலப்பதிகாரம் கண்ணகி மற்றும் கோவலன் கதையை விவரிக்கிறது. இது இளங்கோவடிகளால் எழுதப்பட்டது.
                        
                        இந்த இலக்கியம் தமிழ் மக்களின் வாழ்க்கை முறை, பண்பாடு, மற்றும் கலாச்சாரத்தை காட்டுகிறது. மேலும், அரசியல் மற்றும் சமூக உறவுகளை விளக்குகிறது.
                        
                        தமிழ் மொழியின் செழுமையும் வளமும் இந்த இலக்கியத்தில் வெளிப்படுகிறது.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-dark-700 dark:text-gray-300 h-8"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    </svg>
                    Copy Text
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 h-8"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block animate-bounce">
          <a 
            href="#about" 
            className="text-dark-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowDown className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
