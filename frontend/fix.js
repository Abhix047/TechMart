const fs = require('fs');
const file = 'c:\\\\projects\\\\techmart\\\\frontend\\\\src\\\\components\\\\home\\\\BrandPromises.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. the component signature
content = content.replace(
  'const PromiseCard = ({ item, index, isInView }) => {\\n  const [hov, setHov] = useState(false);',
  'const PromiseCard = ({ item, index, isInView, isActive }) => {\\n  const [hovHover, setHovHover] = useState(false);\\n  const active = hovHover || isActive;'
);

// 2. handleMouseEnter
content = content.replace(
  'setHov(true);',
  'setHovHover(true);'
);

// 3. handleMouseLeave
content = content.replace(
  'onMouseLeave={() => setHov(false)}',
  'onMouseLeave={() => setHovHover(false)}'
);

// 4. Global replace hov with active using string split and join
content = content.split('hov ?').join('active ?');

// 5. Add states and slider effect
const bpMainOld = `const BrandPromises = () => {
  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section`;

const bpMainNew = `const BrandPromises = () => {
  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-60px" });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const t = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROMISES.length);
    }, 2800);
    return () => clearInterval(t);
  }, [isInView]);

  useEffect(() => {
    const slider = document.getElementById("bp-slider");
    if (!slider || window.innerWidth >= 768) return;
    const cards = slider.children;
    if (cards[activeIndex + 1]) {
      cards[activeIndex + 1].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  return (
    <section`;
content = content.replace(bpMainOld, bpMainNew);

// 6. Replace PromiseCard usages:
content = content.split('<PromiseCard key={i} item={item} index={i} isInView={isInView} />').join('<PromiseCard key={i} item={item} index={i} isInView={isInView} isActive={activeIndex === i} />');

// 7. Remove slider arrows using exact string match
const bpArrowsOld = `<div className="absolute top-[45%] -translate-y-[45%] left-3 right-3 flex justify-between pointer-events-none z-20 opacity-80">
          <button onClick={() => document.getElementById('bp-slider')?.scrollBy({ left: -320, behavior: 'smooth' })} className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white/95 rounded-full border border-black/10 backdrop-blur-sm shadow-md active:scale-95 transition-transform"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1108" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <button onClick={() => document.getElementById('bp-slider')?.scrollBy({ left: 320, behavior: 'smooth' })} className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white/95 rounded-full border border-black/10 backdrop-blur-sm shadow-md active:scale-95 transition-transform"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1108" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>`;
content = content.replace(bpArrowsOld, '');

fs.writeFileSync(file, content);
console.log('Update Success');
