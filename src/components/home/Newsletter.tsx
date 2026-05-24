export default function Newsletter() {
  return (
    <section className="bg-brand-blue py-section-gap w-full text-white text-center px-margin-mobile">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="font-display-lg text-display-lg">Join the Joy Club</h2>
        <p className="font-body-lg text-body-lg text-white/90">
          Sign up for our newsletter to the Jelly Club and get 15% off your
          first order!
        </p>
        <form className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="email"
            placeholder="Enter your address"
            className="w-full sm:w-96 rounded-full px-8 py-4 text-on-surface border-2 border-transparent focus:border-primary-fixed focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
