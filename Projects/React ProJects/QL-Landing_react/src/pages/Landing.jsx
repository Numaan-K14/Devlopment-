import { NavBar } from "../components/NavBar.jsx";
import { HeroPage } from "../components/HeroPage.jsx";
import { Blog } from "../components/Blog.jsx";
import { Features } from "../components/features.jsx";
import { Supplychain } from "../components/Supplychain.jsx";
import { Efficiency } from "../components/Efficiency.jsx";
import Blogs from "../api/Blogs.json";
import services from "../api/services.json";
import {Branding} from "./Branding.jsx";
import { OurSolutions } from "./OurSolutions.jsx";
import { Footer } from "../components/Footer.jsx";

export const Landing = () => {
  return (
    <>
      <NavBar />
      <HeroPage
        title="Innovative IT Across Supply Chain,Logistics & More"
        description="Delivering innovative tech solutions for 5+ years across logistics, manufacturing,healthcare, and more."
        image="../images/Demo.jpeg"
      />
      <Blog
        label="Services"
        heading="Specialized solutions for evolving logistics and supply chain needs"
        description="Our solutions are designed to streamline operations, enhance system performance, and drive digital transformation"
      />
      {Blogs.map((item) => (
        <Features key={item.id} data={item} />
      ))}
      <Blog
        label="Features"
        heading="Helping organizations with their Operations"
        description="Our solutions are designed to streamline supply chain processes, enhance visibility, improve data accuracy, and drive operational efficiency."
      />
      <Supplychain />

      <Efficiency services={services} />
      <Branding />
      <OurSolutions />
      <Footer/>



    </>
  );
};

export default Landing;
