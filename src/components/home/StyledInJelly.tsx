import Image from "next/image";
import StorefrontContainer from "@/components/layout/StorefrontContainer";

const IMAGES = [
  "https://lh3.googleusercontent.com/aida/ADBb0uicyrnk7OIRliABbGOIgZDHBdY-Qu-aBxtfe6ux19mSgOi9-u6T0NYZFMriblRPiaMRMuqcq040nl7CUcvY9KlvxDIAfD23UHpTupqFo2iS1bnf5DfKjGgXpbB4RA0ShDV-08cr6M3T8h7cNKXlgFQcvK8RpHyhd9Mg1lb_Z7BoYmc5MX3jyJHDYq-Xdhws9D05IN3PxhtUYCi9W3wS7qjAAdIbLJUqnnCv2V3V5WIWikixpJ60zNut8R8",
  "https://lh3.googleusercontent.com/aida/ADBb0ui2tUFGxc4zFeo4MZP8PN5ftFxC_CdU3syorhwMKg-hCOqKgkehnhFEvSuyXvvd4IKcL1zTB44c-PW2X1RFue8YL9fqUth1Qvs7XNvl04I0YayLkSapn-U9sj8VOakmy46QqrBbUi2w0b-zu_n1DLckEm87JfMHvr45VEXt7a-7poweL7-VB3WIH7RbE0Rf7l5F7HjaL-W6Pg1ruOQcUqfQTuLUKCNoY2l8vPMOx0uFckLGhjt5mSbwq6U",
  "https://lh3.googleusercontent.com/aida/ADBb0uh2Wd4VA9J9I6bbQgDSK0Hhk0wX6DNIy8-EJMvVMRQBfSh--IyVdoEQeFKgWV0jn36h51NJmgM8FiXiePLLvqEFUDUyF1WxIgyCerrHA88uy90r5jybePJWDN74zADhACB9POvJ8PxjgjitnTJWS5be131p5rMKhAl-alvpkuXZsRbZvVJRyQZag7xB9cUvOW8rQ9hiOsqNH1iaeILINNJmTeE8tSugVeYBjV9t1Ryt467YFAEVh_3Fp2c",
  "https://lh3.googleusercontent.com/aida/ADBb0uiyKT7KntdWhBh8xkUOeshpMiVakXYlDmToBuDVU3QllGUMSsCYdS9Hmu63bUluCa_6iNwX81ekCfrjkoAuWJixGQR8Vjrk8UYOkhfTkaNc0HVR9klXzZSdok1TiMJXF9LZ20jehQaSKAPKYSEOdQdtnBNCmssd2gb7QcatnW6xJlp-ENGWjec3kFd0VyyARMTuOfOpdYETGqd58iLi4w31h_rlLavxTSK6u4TFh0TTQ3VCaY2vwBTDChI",
];

export default function StyledInJelly() {
  return (
    <StorefrontContainer className="mb-section-gap">
      <h2 className="font-headline-lg text-headline-lg mb-8">
        Styled in Jelly
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        {IMAGES.map((src, i) => (
          <div
            key={i}
            role="presentation"
            className="aspect-square rounded-2xl overflow-hidden sticker-border group"
          >
            <div className="relative w-full h-full">
              <Image
                src={src}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                alt=""
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        ))}
      </div>
    </StorefrontContainer>
  );
}
