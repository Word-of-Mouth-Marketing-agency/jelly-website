import ProductCard, { type Product } from "./ProductCard";

const PRODUCTS: Product[] = [
  {
    name: "Fiwstment Sock",
    price: "$25.00",
    image:
      "https://lh3.googleusercontent.com/aida/ADBb0uicyrnk7OIRliABbGOIgZDHBdY-Qu-aBxtfe6ux19mSgOi9-u6T0NYZFMriblRPiaMRMuqcq040nl7CUcvY9KlvxDIAfD23UHpTupqFo2iS1bnf5DfKjGgXpbB4RA0ShDV-08cr6M3T8h7cNKXlgFQcvK8RpHyhd9Mg1lb_Z7BoYmc5MX3jyJHDYq-Xdhws9D05IN3PxhtUYCi9W3wS7qjAAdIbLJUqnnCv2V3V5WIWikixpJ60zNut8R8",
  },
  {
    name: "Firashment Sock",
    price: "$25.00",
    image:
      "https://lh3.googleusercontent.com/aida/ADBb0uiyKT7KntdWhBh8xkUOeshpMiVakXYlDmToBuDVU3QllGUMSsCYdS9Hmu63bUluCa_6iNwX81ekCfrjkoAuWJixGQR8Vjrk8UYOkhfTkaNc0HVR9klXzZSdok1TiMJXF9LZ20jehQaSKAPKYSEOdQdtnBNCmssd2gb7QcatnW6xJlp-ENGWjec3kFd0VyyARMTuOfOpdYETGqd58iLi4w31h_rlLavxTSK6u4TFh0TTQ3VCaY2vwBTDChI",
  },
  {
    name: "Memming Sock",
    price: "$25.00",
    image:
      "https://lh3.googleusercontent.com/aida/ADBb0ui2tUFGxc4zFeo4MZP8PN5ftFxC_CdU3syorhwMKg-hCOqKgkehnhFEvSuyXvvd4IKcL1zTB44c-PW2X1RFue8YL9fqUth1Qvs7XNvl04I0YayLkSapn-U9sj8VOakmy46QqrBbUi2w0b-zu_n1DLckEm87JfMHvr45VEXt7a-7poweL7-VB3WIH7RbE0Rf7l5F7HjaL-W6Pg1ruOQcUqfQTuLUKCNoY2l8vPMOx0uFckLGhjt5mSbwq6U",
  },
  {
    name: "Fiomhment Sock",
    price: "$25.00",
    image:
      "https://lh3.googleusercontent.com/aida/ADBb0uh2Wd4VA9J9I6bbQgDSK0Hhk0wX6DNIy8-EJMvVMRQBfSh--IyVdoEQeFKgWV0jn36h51NJmgM8FiXiePLLvqEFUDUyF1WxIgyCerrHA88uy90r5jybePJWDN74zADhACB9POvJ8PxjgjitnTJWS5be131p5rMKhAl-alvpkuXZsRbZvVJRyQZag7xB9cUvOW8rQ9hiOsqNH1iaeILINNJmTeE8tSugVeYBjV9t1Ryt467YFAEVh_3Fp2c",
  },
];

export default function MensCollection() {
  return (
    <section className="max-w-container-max mx-auto px-margin-desktop mb-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-gutter">
        {/* Heading column */}
        <div className="md:pt-12">
          <h2 className="font-headline-lg text-headline-lg mb-6">
            Men&apos;s Collection
          </h2>
          <button className="bg-primary-container text-black px-6 py-3 rounded-full font-label-lg text-label-lg sticker-border hover:scale-105 transition-all">
            Shop Men&apos;s
          </button>
        </div>

        {/* 4 product cards spanning the remaining 4 columns */}
        <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-gutter">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
