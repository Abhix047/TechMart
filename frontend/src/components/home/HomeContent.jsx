import Newsletter from "./Newsletter";
import BrandPromises from "./BrandPromises";
import CollectionsGrid from "./CollectionsGrid";
import EditorialBanner from "./EditorialBanner";
import FeaturedProducts from "./FeaturedProducts";
import MarqueeStrip from "./MarqueeStrip";
import NewArrivals from "./NewArrivals";
import PressQuote from "./PressQuote";
import { motion } from "framer-motion";

const StackedCard = ({ children, index, isBase = false, bgClass = "bg-transparent", className = "" }) => {
  if (isBase) {
    return (
      <div 
        className={`relative w-full shadow-inner ${bgClass} ${className}`} 
        style={{ zIndex: index * 10 }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ y: 80, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ margin: "0px 0px -10% 0px", once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full ${bgClass} ${className} will-change-transform`}
      style={{ zIndex: index * 10 }}
    >
      <div className="w-full relative">
         {children}
      </div>
    </motion.section>
  );
};

const HomeContent = () => (
  <div className="bg-white font-dm overflow-hidden">
    
    {/* Base Layer */}
    <StackedCard index={1} isBase={true} bgClass="bg-white">
      <MarqueeStrip />
      <FeaturedProducts />
    </StackedCard>

    <StackedCard index={2} bgClass="bg-[#0e0c0a]">
      <PressQuote />
    </StackedCard>
    
    <StackedCard index={3} bgClass="bg-[#faf9f8]" className="hidden md:block">
      <EditorialBanner />
    </StackedCard>

    <StackedCard index={4} bgClass="bg-white">
      <CollectionsGrid />
    </StackedCard>

    <StackedCard index={5} bgClass="bg-[#ffffff]">
      <BrandPromises />
    </StackedCard>

    <StackedCard index={6} bgClass="bg-[#0a0a0a]">
      <NewArrivals />
    </StackedCard>

    <StackedCard index={7} bgClass="bg-black">
      <Newsletter />
    </StackedCard>
    
  </div>
);

export default HomeContent;
