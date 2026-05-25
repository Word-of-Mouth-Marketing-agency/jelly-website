const ITEMS = [
  "SHOP THE COLLECTION",
  "LIMITED EDITION DROPS",
  "BEST SELLERS",
  "JELLY CLUB",
  "FREE SHIPPING",
];

function MarqueeContent() {
  return (
    <>
      {ITEMS.map((item) => (
        <span key={item}>{item}</span>
      ))}
      <span className="wom-marquee__icon">&#10022;</span>
      {ITEMS.map((item) => (
        <span key={`dup-${item}`}>{item}</span>
      ))}
      <span className="wom-marquee__icon">&#10022;</span>
    </>
  );
}

function MarqueeBand({
  reverse = false,
  background,
}: {
  reverse?: boolean;
  background: string;
}) {
  return (
    <div
      className="wom-marquee"
      style={{ background, width: "150%" }}
    >
      <div
        className="wom-marquee__track"
        style={{ animationDirection: reverse ? undefined : "normal" }}
      >
        <div className="wom-marquee__content">
          <MarqueeContent />
        </div>
        <div className="wom-marquee__content" aria-hidden="true">
          <MarqueeContent />
        </div>
      </div>
    </div>
  );
}

export default function CrossingMarquees() {
  return (
    <section className="relative w-full overflow-hidden py-32 my-[-60px] h-[300px] flex items-center justify-center">
      {/* Blue band — rotated -3deg, scrolls right to left */}
      <div className="absolute inset-0 flex items-center justify-center -rotate-3 z-10">
        <MarqueeBand background="#0066EE" />
      </div>

      {/* Yellow band — rotated +3deg, scrolls left to right */}
      <div className="absolute inset-0 flex items-center justify-center rotate-3 z-20">
        <MarqueeBand background="#FBE902" reverse />
      </div>
    </section>
  );
}
