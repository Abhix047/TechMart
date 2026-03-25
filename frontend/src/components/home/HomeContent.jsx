import Newsletter from "./Newsletter";
import BrandPromises from "./BrandPromises";
import CollectionsGrid from "./CollectionsGrid";
import EditorialBanner from "./EditorialBanner";
import FeaturedProducts from "./FeaturedProducts";
import MarqueeStrip from "./MarqueeStrip";
import NewArrivals from "./NewArrivals";
import PressQuote from "./PressQuote";
import { Divider } from "./utils";

const HomeContent = () => (
  <div className="bg-white font-dm">
    <MarqueeStrip />

    <FeaturedProducts />
    <PressQuote />
    <Divider className="mx-5 sm:mx-10 lg:mx-16 xl:mx-[72px]" />

    <EditorialBanner />
    <CollectionsGrid />

    <Divider className="mx-5 sm:mx-10 lg:mx-16 xl:mx-[72px]" />
    <BrandPromises />
    <Divider className="mx-5 sm:mx-10 lg:mx-16 xl:mx-[72px]" />

    <NewArrivals />

    <Divider className="mx-5 sm:mx-10 lg:mx-16 xl:mx-[72px]" />
    <Newsletter />
  </div>
);

export default HomeContent;
