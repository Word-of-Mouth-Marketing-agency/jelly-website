import type { ComponentProps, ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
} & Omit<ComponentProps<"section">, "className" | "children" | "as">;

export default function StorefrontContainer({
  children,
  className = "",
  as: Component = "section",
  ...rest
}: Props) {
  return (
    <Component className={`px-margin-mobile md:px-margin-desktop ${className}`} {...rest}>
      <div className="max-w-container-max mx-auto w-full">
        {children}
      </div>
    </Component>
  );
}
