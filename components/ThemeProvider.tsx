"use client";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      themes={["light", "dark", "lunar-new-year", "system"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
