import MarqueeStrip    from "./MarqueeStrip";
import FeaturedProducts from "./FeaturedProducts";
import EditorialBanner  from "./EditorialBanner";
import CollectionsGrid  from "./CollectionsGrid";
import BrandPromises    from "./BrandPromises";
import NewArrivals      from "./NewArrivals";
import Newsletter       from "./Newsletter";
import { Divider }      from "./utils";
import PressQuote from "./PressQuote";

const HomeContent = () => (
  <div className="bg-white font-dm">

    {/* 01 — Scrolling marquee strip */}
    <MarqueeStrip />

    {/* 02 — Featured products grid */}
    <FeaturedProducts />
    <PressQuote/>
    <Divider className="mx-5 sm:mx-10 lg:mx-16 xl:mx-[72px]" />

    {/* 03 — Editorial dark banner */}
    <EditorialBanner />

    {/* 04 — Collections grid */}
    <CollectionsGrid />

    <Divider className="mx-5 sm:mx-10 lg:mx-16 xl:mx-[72px]" />

    {/* 05 — Brand promises */}
    <BrandPromises />

    <Divider className="mx-5 sm:mx-10 lg:mx-16 xl:mx-[72px]" />

    {/* 06 — New arrivals horizontal scroll */}
    <NewArrivals />

    <Divider className="mx-5 sm:mx-10 lg:mx-16 xl:mx-[72px]" />

    {/* 07 — Newsletter signup */}
    <Newsletter />

  </div>
);

export default HomeContent;