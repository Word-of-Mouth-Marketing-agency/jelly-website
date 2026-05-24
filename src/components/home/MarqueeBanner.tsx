export default function MarqueeBanner() {
  const text =
    "SOCKS THAT MAKE YOU SMILE ★ STEP INTO JOY ★ COMFORT IN EVERY COLOR ★ SOCKS THAT MAKE YOU SMILE ★ STEP INTO JOY ★ COMFORT IN EVERY COLOR ★ SOCKS THAT MAKE YOU SMILE ★ STEP INTO JOY ★ COMFORT IN EVERY COLOR ★ ";

  return (
    <section className="w-full bg-primary-fixed overflow-hidden whitespace-nowrap py-4 border-y-2 border-black">
      <div className="inline-block animate-[scroll_20s_linear_infinite] px-4 font-display-lg text-headline-md font-black text-black uppercase">
        {text}
      </div>
    </section>
  );
}
