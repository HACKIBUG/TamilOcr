import HeroSection from "./sections/hero";
import AboutSection from "./sections/about";
import FeaturesSection from "./sections/features";
import UploadProcessSection from "./sections/upload-process";
import DemoSection from "./sections/demo";
import ContactSection from "./sections/contact";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <UploadProcessSection />
      <DemoSection />
      <ContactSection />
    </div>
  );
}
