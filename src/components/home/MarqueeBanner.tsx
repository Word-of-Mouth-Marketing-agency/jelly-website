export default function MarqueeBanner() {
  const content = (
    <>
      <span>Comfort in Every Color</span>
      <span className="wom-marquee__icon">&#10022;</span>
      <span>Socks That Make You Smile</span>
      <span className="wom-marquee__icon">&#10022;</span>
      <span>Step Into Joy</span>
      <span className="wom-marquee__icon">&#10022;</span>
      <span>Comfort in Every Color</span>
      <span className="wom-marquee__icon">&#10022;</span>
      <span>Socks That Make You Smile</span>
      <span className="wom-marquee__icon">&#10022;</span>
      <span>Step Into Joy</span>
      <span className="wom-marquee__icon">&#10022;</span>
    </>
  );

  return (
    <div className="wom-marquee">
      <div className="wom-marquee__track">
        <div className="wom-marquee__content">{content}</div>
        <div className="wom-marquee__content" aria-hidden="true">{content}</div>
      </div>
    </div>
  );
}
