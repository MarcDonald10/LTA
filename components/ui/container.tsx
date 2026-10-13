import type { ComponentProps } from "react";

type ContainerProps = ComponentProps<"div"> & { width?: "page" | "read" };

/** Largeur de page 1 200 px (ou lecture 720 px), marges 16 / 24 / 32 px. */
export function Container({ width = "page", className = "", ...props }: ContainerProps) {
  const max = width === "page" ? "max-w-page" : "max-w-read";
  return <div className={`mx-auto w-full ${max} px-4 md:px-6 lg:px-8 ${className}`} {...props} />;
}
