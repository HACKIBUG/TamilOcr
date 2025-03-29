import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Upload, Info } from "lucide-react";

// Demo data
const demoTypes = [
  { id: "historical", name: "Historical Manuscript" },
  { id: "palm", name: "Palm Leaf" },
];

const demoSteps = [
  { step: 1, text: "Image preprocessing to enhance contrast and remove noise" },
  { step: 2, text: "Text region detection and segmentation" },
  { step: 3, text: "Character recognition with TrOCR model trained on historical Tamil documents" },
  { step: 4, text: "Post-processing with context-aware spell checking and correction" }
];

export default function DemoSection() {
  const [activeDemo, setActiveDemo] = useState("historical");
  
  return (
    <section id="demo" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-dark-600 dark:text-gray-300">
            Watch how our OCR system processes different types of Tamil documents
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden">
            <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
              <div className="border-b border-gray-200 dark:border-dark-700 overflow-x-auto">
                <TabsList className="bg-transparent border-b-0">
                  {demoTypes.map((type) => (
                    <TabsTrigger 
                      key={type.id}
                      value={type.id} 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none px-6 py-4 font-medium whitespace-nowrap"
                    >
                      {type.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {demoTypes.map((type) => (
                <TabsContent key={type.id} value={type.id} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1580981354890-ebb03e74a473?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                          alt={`${type.name} Tamil document`}
                          className="w-full h-[400px] object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="p-4 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors h-16 w-16"
                          >
                            <Play className="h-8 w-8" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="font-medium text-lg mb-2">Processing Steps</h3>
                        <ol className="space-y-2 text-sm text-dark-600 dark:text-gray-400">
                          {demoSteps.map((step) => (
                            <li key={step.step} className="flex items-start gap-2">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs">
                                {step.step}
                              </span>
                              <span>{step.text}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Results Demonstration</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <p className="text-sm font-medium">Original Image Section</p>
                            <span className="text-xs bg-gray-100 dark:bg-dark-700 px-2 py-0.5 rounded-full">Zoomed view</span>
                          </div>
                          <div className="border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1580981354890-ebb03e74a473?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                              alt="Zoomed Tamil text section" 
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <p className="text-sm font-medium">Enhanced Image</p>
                            <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">Pre-processed</span>
                          </div>
                          <div className="border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden bg-white dark:bg-black p-2">
                            <img 
                              src="https://images.unsplash.com/photo-1580981354890-ebb03e74a473?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sat=-100&contrast=1.2&sharp=10" 
                              alt="Enhanced Tamil text" 
                              className="w-full h-40 object-cover"
                              style={{ filter: "contrast(1.5) brightness(1.1) grayscale(1)" }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <p className="text-sm font-medium">Extracted Text</p>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">92% accuracy</span>
                              <Info className="h-3.5 w-3.5 text-dark-500 dark:text-gray-400 cursor-help" />
                            </div>
                          </div>
                          <div className="border border-gray-200 dark:border-dark-700 rounded-lg p-4 bg-white dark:bg-dark-800 h-40 overflow-y-auto tamil-text">
                            <p className="text-dark-800 dark:text-gray-300 leading-relaxed">
                              பாண்டிய மன்னர்கள் வரலாறு தமிழகத்தின் தென்பகுதியில் சிறப்புற்று விளங்கியது. இவர்கள் ஆட்சியில் இலக்கியம், கலை, கட்டிடம் என பல துறைகள் வளர்ந்தன. குறிப்பாக சங்க இலக்கியங்கள் பெருமளவில் தோன்றின.
                              
                              மதுரை நகரை தலைநகராகக் கொண்ட பாண்டியர்கள் வணிகத்திலும் சிறந்து விளங்கினர். அரபு நாடுகள், ரோமானியப் பேரரசு ஆகியவற்றுடன் வணிகத் தொடர்புகளை கொண்டிருந்தனர்.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-dark-600 dark:text-gray-300 mb-6">Ready to try the system with your own documents?</p>
            <Button 
              size="lg" 
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-lg shadow-primary-600/20 dark:shadow-primary-500/20"
              asChild
            >
              <a href="#process">
                <Upload className="mr-2 h-5 w-5" /> Process Your Documents
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
