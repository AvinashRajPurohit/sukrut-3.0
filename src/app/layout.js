import "./globals.css";
import Header from "@/layout/Header";

export const metadata = {
  title: "Sukrut",
  description: "Engineering scalable digital systems",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
