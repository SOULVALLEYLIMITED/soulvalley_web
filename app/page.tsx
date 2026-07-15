import Image from "next/image";
import HeroSection from "./component/hero_section";
import HeaderComponent from "./component/header_component";
import AboutUs from "./component/about_us_section";
import Features from "./component/features";
import Project from "./component/project";
import Testimonials from "./component/testimonials";
import ContactUs from "./component/contactus";
import Foooter from "./component/footer";
import FAQ from "./component/faq";

export default function Home() {
  return (
    <div id="home" className="">
      <HeaderComponent />

      <div className="">
        <HeroSection />
      </div>
      <div className="">
        <AboutUs />
      </div>
      <div className="">
        <Features />
      </div>
      <div className="">
        <Project />
      </div>
      <div className="">
        <Testimonials />
      </div>
        <div className="">
        <FAQ />
      </div>
      <div className="">
        <ContactUs />
      </div>
    
      <div className="">
        <Foooter />
      </div>
    </div>
  );
}
