"use client";

import Image from "next/image";
import { useState } from "react";
import type { ImageProps } from "next/image";

type Props = ImageProps & {
  fallback?: React.ReactNode;
};

export default function ImageWithFallback({
  fallback,
  alt,
  ...rest
}: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return fallback ?? (
      <div className="w-full h-full flex items-center justify-center bg-surface-container" />
    );
  }

  return <Image {...rest} alt={alt} onError={() => setErrored(true)} />;
}
