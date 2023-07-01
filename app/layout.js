import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Convert YouTube Usernames to Channel IDs | Channel ID Finder",
  description:
    "Easily convert YouTube usernames to channel IDs with our free online tool. Find the unique identification code for any YouTube channel, enabling you to access valuable insights and data. Discover the Channel ID Finder and streamline your YouTube analytics today!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <footer className="py-6 text-sm text-center text-gray-500">
          <p>
            Built by{" "}
            <a
              href="https://www.ovsepyan.com.ua/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-blue-500 hover:underline"
            >
              Bahdasar Ovsepian
            </a>{" "}
            &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </body>
    </html>
  );
}
