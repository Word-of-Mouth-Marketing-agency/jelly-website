// Phase 0 placeholder — Homepage implementation in Phase 1

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8e600]">
      <div className="text-center space-y-4">
        <h1 className="text-[48px] font-black text-[#1e1c10]">Jelly</h1>
        <p className="text-[18px] text-[#4a4732]">
          Socks that make you smile — coming in Phase 1
        </p>
        <p className="text-[14px] text-[#7c785f]">Locale: {locale}</p>
      </div>
    </main>
  );
}
