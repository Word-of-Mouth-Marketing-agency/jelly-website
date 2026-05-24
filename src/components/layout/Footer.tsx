import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-section-gap px-margin-desktop rounded-t-xl">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {/* Brand */}
        <div className="space-y-6">
          <h2 className="font-headline-lg text-primary-fixed text-headline-lg">
            Jelly
          </h2>
          <p className="font-body-md text-body-md opacity-80">
            Spreading happiness one step at a time with premium materials and
            playful designs.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary-fixed transition-colors">
              <span className="material-symbols-outlined">public</span>
            </Link>
            <Link href="#" className="hover:text-primary-fixed transition-colors">
              <span className="material-symbols-outlined">share</span>
            </Link>
            <Link href="#" className="hover:text-primary-fixed transition-colors">
              <span className="material-symbols-outlined">alternate_email</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            {["Shop All", "New Arrivals", "Best Sellers", "Gifting"].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-white/80 hover:text-primary-fixed transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold mb-6">Support</h4>
          <ul className="space-y-4">
            {["Size Guide", "Returns", "Track Order", "Contact Us"].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-white/80 hover:text-primary-fixed transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sustainability */}
        <div>
          <h4 className="text-white font-bold mb-6">Sustainability</h4>
          <p className="font-body-md text-body-md opacity-80 mb-4">
            We are committed to eco-friendly packaging and ethical sourcing for
            every pair of socks.
          </p>
          <Link href="#" className="text-primary-fixed underline font-label-lg">
            Learn more
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-body-md opacity-60">
          © 2024 Jelly. Spreading happiness one step at a time.
        </p>
        <div className="flex gap-8">
          <Link
            href="#"
            className="text-body-md opacity-60 hover:opacity-100 transition-opacity"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-body-md opacity-60 hover:opacity-100 transition-opacity"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
