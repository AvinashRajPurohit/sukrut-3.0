import menuData from "@/components/data/menu.json";
import MenuAction from "./MenuAction";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header
      className="w-full border-b bg-white"
      role="banner"
    >
      <div className="mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left Section: Logo + Menu */}
        <div className="flex items-center md:gap-44">
          
          {/* Logo (Image) */}
          <Link
            href="/"
            aria-label="Go to homepage"
            className="flex items-center"
          >
            <Image
              src="/sukrut_light_mode_logo.png"   
              alt="Sukrut logo"
              width={115}               
              height={30}
              priority                
            />
          </Link>

          {/* Menu */}
          <MenuAction data={menuData} />
        </div>

        {/* Right Section: CTA */}
        <div>
          <Link
            href="/contact"
            className="rounded-lg border border-gray-500 px-6 py-2 text-sm font-semibold hover:text-[#E39A2E] hover:border-[#E39A2E] text-gray-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>

      </div>
    </header>
  );
}
