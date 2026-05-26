import Image from "next/image";
import Link from "next/link";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" width="24" height="24">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" width="24" height="24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" width="24" height="24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-6.3a8.15 8.15 0 004.77 1.52V6.69z" />
    </svg>
  );
}

export default function Footer({ locale }: { locale: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-section-gap px-margin-desktop">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {/* Brand */}
        <div className="space-y-6">
          <Link href={`/${locale}`} className="block w-[110px] sm:w-[140px]">
            <Image
              src="/brand/jelly-logo-white.png"
              alt="Jelly logo"
              width={140}
              height={50}
              className="w-full h-auto"
            />
          </Link>
          <p className="font-body-md text-body-md opacity-80">
            Spreading happiness one step at a time with premium materials and
            playful designs.
          </p>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-fixed transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-fixed transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-fixed transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li>
              <Link href={`/${locale}/search`} className="text-white/80 hover:text-primary-fixed transition-colors">
                Shop All
              </Link>
            </li>
            <li>
              <Link href={`/${locale}`} className="text-white/80 hover:text-primary-fixed transition-colors">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link href={`/${locale}`} className="text-white/80 hover:text-primary-fixed transition-colors">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link href="#" className="text-white/80 hover:text-primary-fixed transition-colors">
                Gifting
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold mb-6">Support</h4>
          <ul className="space-y-4">
            <li>
              <Link href="#" className="text-white/80 hover:text-primary-fixed transition-colors">
                Size Guide
              </Link>
            </li>
            <li>
              <Link href="#" className="text-white/80 hover:text-primary-fixed transition-colors">
                Returns
              </Link>
            </li>
            <li>
              <Link href="#" className="text-white/80 hover:text-primary-fixed transition-colors">
                Custom Orders
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/contact`} className="text-white/80 hover:text-primary-fixed transition-colors">
                Contact Us
              </Link>
            </li>
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
          &copy; {year} Jelly. Powered by{" "}
          <a
            href="https://wordofmoutheg.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-fixed transition-colors underline"
          >
            WORD OF MOUTH
          </a>
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
