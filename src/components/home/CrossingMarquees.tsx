const ITEMS = [
  "SHOP THE COLLECTION",
  "LIMITED EDITION DROPS",
  "BEST SELLERS",
  "JELLY CLUB",
  "FREE SHIPPING",
];

function MarqueeContent({ textColor = "#000000" }: { textColor?: string }) {
  return (
    <>
      {ITEMS.map((item) => (
        <span key={item} style={{ color: textColor }}>{item}</span>
      ))}
      <span className="wom-marquee__icon" style={{ color: textColor }}>&#10022;</span>
      {ITEMS.map((item) => (
        <span key={`dup-${item}`} style={{ color: textColor }}>{item}</span>
      ))}
      <span className="wom-marquee__icon" style={{ color: textColor }}>&#10022;</span>
    </>
  );
}

function MarqueeBand({
  reverse = false,
  background,
  whiteText = false,
}: {
  reverse?: boolean;
  background: string;
  whiteText?: boolean;
}) {
  const textColor = whiteText ? "#ffffff" : "#000000";
  return (
    <div
      className="wom-marquee"
      style={{ background }}
    >
      <div
        className="wom-marquee__track"
        style={{ animationDirection: reverse ? undefined : "normal" }}
      >
        <div className="wom-marquee__content">
          <MarqueeContent textColor={textColor} />
        </div>
        <div className="wom-marquee__content" aria-hidden="true">
          <MarqueeContent textColor={textColor} />
        </div>
      </div>
    </div>
  );
}

export default function CrossingMarquees() {
  return (
    <section className="relative w-full py-32 my-[-60px] h-[300px] flex items-center justify-center">
      {/* Blue band — rotated -3deg, scrolls right to left */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130vw] flex items-center justify-center -rotate-3 z-10">
        <MarqueeBand background="#0066EE" whiteText />
      </div>

      {/* Yellow band — rotated +3deg, scrolls left to right */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130vw] flex items-center justify-center rotate-3 z-20">
        <MarqueeBand background="#FBE902" reverse />
      </div>
    </section>
  );
}
