import { Cpu, ImagePlus, SpellCheck, LayoutGrid, Languages, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "AI-Powered Recognition",
    description: "Utilizes TrOCR models fine-tuned specifically for Tamil script recognition, achieving high accuracy even with historical variations.",
    technologies: ["TrOCR", "IndicBERT"]
  },
  {
    icon: <ImagePlus className="w-6 h-6" />,
    title: "Image Enhancement",
    description: "Advanced preprocessing techniques to improve document quality before OCR, including denoising, deskewing, and contrast enhancement.",
    techniques: ["Denoising", "Deskewing"]
  },
  {
    icon: <SpellCheck className="w-6 h-6" />,
    title: "NLP-Based Correction",
    description: "Automated post-processing with language models to correct OCR errors based on contextual understanding of Tamil language.",
    components: ["Context Analysis", "Spell Check"]
  },
  {
    icon: <LayoutGrid className="w-6 h-6" />,
    title: "Layout Analysis",
    description: "Intelligent detection of document structure including text blocks, columns, and paragraphs in traditional Tamil documents.",
    capabilities: ["Structure Detection", "Region Analysis"]
  },
  {
    icon: <Languages className="w-6 h-6" />,
    title: "Character Recognition",
    description: "Specialized recognition for Tamil script including complex character combinations and historical variations not found in modern texts.",
    features: ["Ligature Support", "Historic Variants"]
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Export Options",
    description: "Multiple export formats including searchable PDF, plain text, and structured formats for integration with research databases.",
    formats: ["PDF", "TXT", "JSON"]
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Features</h2>
          <p className="text-dark-600 dark:text-gray-300">
            Our AI-powered OCR system offers several key capabilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card bg-white dark:bg-dark-800 rounded-xl p-6 shadow-md dark:shadow-dark-950/20 hover:shadow-lg dark:hover:shadow-dark-950/30 transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full mb-6">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-dark-600 dark:text-gray-400 mb-4">
                {feature.description}
              </p>
              
              <div className="mt-auto pt-4">
                <div className="flex items-center gap-2 text-sm text-dark-500 dark:text-gray-400 flex-wrap">
                  {feature.technologies && (
                    <>
                      <span className="font-medium">Technologies:</span>
                      {feature.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-xs">
                          {tech}
                        </span>
                      ))}
                    </>
                  )}
                  
                  {feature.techniques && (
                    <>
                      <span className="font-medium">Techniques:</span>
                      {feature.techniques.map((technique, i) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-xs">
                          {technique}
                        </span>
                      ))}
                    </>
                  )}
                  
                  {feature.components && (
                    <>
                      <span className="font-medium">Components:</span>
                      {feature.components.map((component, i) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-xs">
                          {component}
                        </span>
                      ))}
                    </>
                  )}
                  
                  {feature.capabilities && (
                    <>
                      <span className="font-medium">Capabilities:</span>
                      {feature.capabilities.map((capability, i) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-xs">
                          {capability}
                        </span>
                      ))}
                    </>
                  )}
                  
                  {feature.features && (
                    <>
                      <span className="font-medium">Features:</span>
                      {feature.features.map((feat, i) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-xs">
                          {feat}
                        </span>
                      ))}
                    </>
                  )}
                  
                  {feature.formats && (
                    <>
                      <span className="font-medium">Formats:</span>
                      {feature.formats.map((format, i) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-xs">
                          {format}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            size="lg" 
            className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-lg shadow-primary-600/20 dark:shadow-primary-500/20"
            asChild
          >
            <a href="#process">
              <Upload className="mr-2 h-5 w-5" /> Try the OCR System
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
