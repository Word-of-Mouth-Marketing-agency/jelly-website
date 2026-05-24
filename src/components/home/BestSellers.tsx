import Image from "next/image";

const ITEMS = [
  {
    name: "Hamen Sock",
    price: "$25.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnb6h19I_lgD4dh2Fwk-8xYl8ZaEifaTOY629bMfYZh---ssggbn0sL8PSjXtvHyyvAV-0kBN39xx5JgjeUhupX7TclgkUGwJr2YqLfytaDETkFNq1lhInYYFjjo3E0jIuWBuj5DX1WFoNKdvsfsUoTKid_O28Fe3Y5Pt8rVV1nBGYx6cH9c3lF2I8zJWe4HXLhijhuWuKYBIrM5ILEhH0gDIXTNzGo_U-qZeyM8tLGldNTdnPvLPejwpXMMyn6K2xXCOK6g2UHg7NpA",
    alt: "Hamen Sock product photo",
  },
  {
    name: "Vano Sock",
    price: "$25.00",
    image:
      "https://lh3.googleusercontent.com/aida/ADBb0ugypeoAvuh7Sy4YVmlzBvpbNR_Pr5R6MO9luEHILTStVHhmRurpyK8Bdjtws7m3in29HK7s4yXKfW079gf5HCAnJQzLmyIfYDlnbu2BPbcKJrEmXhRwBqdnNMOMqNp-cwgFGl21wO_-qN5TS91m79LweojtIfVIUkMTSCE40pDVAkxs3w3aT9wWh2y--34eIFWV3gHq8v1z3IQEX_H0jBKIPBZ5c9JOLPLo5SIQbw8vooc5NpygR9GmkFs",
    alt: "Vano Sock product photo",
  },
];

export default function BestSellers() {
  return (
    <section className="max-w-container-max mx-auto px-margin-desktop mb-section-gap">
      <h2 className="font-headline-lg text-headline-lg mb-8">Best Sellers</h2>
      <div className="flex flex-col md:flex-row gap-6">
        {ITEMS.map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-2xl sticker-border group cursor-pointer relative overflow-hidden flex flex-col md:flex-row items-stretch md:w-1/2"
          >
            <div className="w-full md:w-[40%] relative min-h-[200px] overflow-hidden">
              <Image
                src={item.image}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                alt={item.alt}
                sizes="(max-width: 768px) 100vw, 20vw"
              />
            </div>
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-start z-10">
              <h3 className="font-headline-md text-headline-md mb-2 font-bold">
                {item.name}
              </h3>
              <p className="font-headline-md text-headline-md text-on-surface-variant mb-6 font-bold">
                {item.price}
              </p>
              <button className="bg-primary-container text-black border-2 border-black px-10 py-3 rounded-full font-label-lg text-label-lg hover:scale-105 transition-all">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
