export default function MarqueeBanner() {
  const items = [
    "Comfort in Every Color",
    "Socks That Make You Smile",
    "Step Into Joy",
  ];

  const content = (
    <>
      {items.map((item, i) => (
        <span key={i} className="wom-marquee__content">
          {item}
          <span className="wom-marquee__icon" aria-hidden="true">&#10022;</span>
        </span>
      ))}
    </>
  );

  return (
    <section className="wom-marquee">
      <div className="wom-marquee__track">
        <div className="wom-marquee__group">{content}</div>
        <div className="wom-marquee__group">{content}</div>
      </div>
    </section>
  );
}
