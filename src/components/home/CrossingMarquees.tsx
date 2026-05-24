const TEXT =
  "SHOP THE COLLECTION • LIMITED EDITION DROPS • BEST SELLERS • JELLY CLUB • FREE SHIPPING • SHOP THE COLLECTION • LIMITED EDITION DROPS • BEST SELLERS • JELLY CLUB • FREE SHIPPING • SHOP THE COLLECTION • LIMITED EDITION DROPS • BEST SELLERS • JELLY CLUB • FREE SHIPPING • ";

export default function CrossingMarquees() {
  return (
    <section className="relative w-full overflow-hidden py-32 my-[-60px] h-[300px] flex items-center justify-center">
      {/* Blue band — rotated -3deg */}
      <div className="absolute inset-0 flex items-center justify-center -rotate-3 z-10">
        <div className="w-[150%] bg-brand-blue py-6 border-y-2 border-black whitespace-nowrap overflow-hidden">
          <div className="inline-block animate-scroll px-4 font-display-lg text-headline-md font-black text-white uppercase">
            {TEXT}
          </div>
        </div>
      </div>

      {/* Yellow band — rotated +3deg */}
      <div className="absolute inset-0 flex items-center justify-center rotate-3 z-20">
        <div className="w-[150%] bg-primary-container py-6 border-y-2 border-black whitespace-nowrap overflow-hidden">
          <div className="inline-block animate-scroll-reverse px-4 font-display-lg text-headline-md font-black text-black uppercase">
            {TEXT}
          </div>
        </div>
      </div>
    </section>
  );
}
