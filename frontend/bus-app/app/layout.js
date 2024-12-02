/**
 * Imports a local font from the specified path.
 * @module localFont
 */

import localFont from "next/font/local";

/**
 * Imports global CSS styles.
 * @module globals.css
 */

import "./globals.css";

/**
 * Defines the Geist Sans font with specified source, variable, and weight.
 * @constant {Object} geistSans
 * @property {string} src - The path to the font file.
 * @property {string} variable - The CSS variable name for the font.
 * @property {string} weight - The weight range for the font.
 */

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

/**
 * Defines the Geist Mono font with specified source, variable, and weight.
 * @constant {Object} geistMono
 * @property {string} src - The path to the font file.
 * @property {string} variable - The CSS variable name for the font.
 * @property {string} weight - The weight range for the font.
 */

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/**
 * Metadata for the application.
 * @constant {Object} metadata
 * @property {string} title - The title of the application.
 * @property {string} description - The description of the application.
 */

export const metadata = {
  title: "UGAthens Bus Stops",
  description: "UGAthens Bus Stop App for CSCI 4050 SWE Project"
};

/**
 * Root layout component for the application.
 * @function RootLayout
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 * @returns {JSX.Element} The root layout component.
 */

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}