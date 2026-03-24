import { lazy, Suspense, useEffect, useRef, useState } from "react";
import BrandPromises from "./BrandPromises";
import CollectionsGrid from "./CollectionsGrid";
import EditorialBanner from "./EditorialBanner";
import FeaturedProducts from "./FeaturedProducts";
import MarqueeStrip from "./MarqueeStrip";
import PressQuote from "./PressQuote";
import { Divider } from "./utils";

const NewArrivals = lazy(() => import("./NewArrivals"));
const Newsletter = lazy(() => import("./Newsletter"));

function SectionPlaceholder({ minHeight = 320 }) {
  return (
    <div
      className="mx-5 animate-pulse rounded-[28px] bg-neutral-100 sm:mx-10 lg:mx-16 xl:mx-[72px]"
      style={{ minHeight }}
    />
  );
}

function DeferredSection({ children, fallback, rootMargin = "320px 0px", once = true }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setVisible(true);
        if (once) {
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, visible]);

  return <div ref={ref}>{visible ? children : fallback}</div>;
}

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

    <DeferredSection fallback={<SectionPlaceholder minHeight={420} />}>
      <Suspense fallback={<SectionPlaceholder minHeight={420} />}>
        <NewArrivals />
      </Suspense>
    </DeferredSection>

    <Divider className="mx-5 sm:mx-10 lg:mx-16 xl:mx-[72px]" />

    <DeferredSection fallback={<SectionPlaceholder minHeight={280} />}>
      <Suspense fallback={<SectionPlaceholder minHeight={280} />}>
        <Newsletter />
      </Suspense>
    </DeferredSection>
  </div>
);

export default HomeContent;
