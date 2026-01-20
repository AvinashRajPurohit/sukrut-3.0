import Image from "next/image";
import Link from "next/link";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

export default function ContactFooterSection() {
  return (
    <section className="relative py-16 text-white">
      {/* LINEAR GRADIENT (IMAGE MATCH) */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B0B0B_0%,#0F0E0C_45%,#E39A2E_140%)]" />

      <div className="relative mx-auto max-w-[90%] grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-4xl font-semibold mb-4">Contact Us</h2>

          <p className="text-gray-400 max-w-sm mb-12 leading-relaxed text-md">
            Does your project need our help?
            <br />
            Fill out the form and contact us directly.
          </p>

          <div className="space-y-6 text-sm">
            <div className="flex items-center gap-4 text-gray-300">
              <HiOutlineMail className="text-[#E39A2E] text-lg h-8 w-8" />
              <span>SukrutAssociates@gmail.com</span>
            </div>

            <div className="flex items-center gap-4 text-gray-300">
              <HiOutlinePhone className="text-[#E39A2E] text-lg h-8 w-8" />
              <span>+91 12345 67890</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <form className="rounded-2xl bg-white/10 backdrop-blur-md p-8 space-y-6">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-md bg-white/20 px-4 py-3 text-sm outline-none placeholder:text-gray-300"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              className="rounded-md bg-white/20 px-4 py-3 text-sm outline-none placeholder:text-gray-300"
            />
            <input
              type="text"
              placeholder="+91"
              className="rounded-md bg-white/20 px-4 py-3 text-sm outline-none placeholder:text-gray-300"
            />
          </div>

          <textarea
            rows={4}
            placeholder="Your message..."
            className="w-full rounded-md bg-white/20 px-4 py-3 text-sm outline-none placeholder:text-gray-300"
          />

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" className="accent-[#E39A2E] h-4 w-4" />
            I agree with your terms & conditions
          </label>

          <button
            type="submit"
            className="mt-4 inline-flex items-center justify-center rounded-md border border-[#E39A2E] px-10 py-3 text-sm font-medium text-[#E39A2E] transition hover:bg-[#E39A2E] hover:text-black"
          >
            SUBMIT
          </button>
        </form>
      </div>

      {/* FOOTER */}
      <div className="relative mt-16 border-t border-white/20 pt-8 text-center">
        <div className="flex justify-center items-center gap-3">
          <Image
            src="/sukrut_dark_mode_logo.png" // replace with your logo path
            alt="Sukrut Logo"
            width={200}
            height={50}
          />
        </div>

       <div className="mt-8 flex justify-center gap-16 text-md text-gray-200">
  <Link
    href="/about"
    className="cursor-pointer transition hover:text-black"
  >
    About Us
  </Link>

  <Link
    href="/blog"
    className="cursor-pointer transition hover:text-black"
  >
    Blog
  </Link>

  <Link
    href="/contact"
    className="cursor-pointer transition hover:text-black"
  >
    Contact
  </Link>

   <Link
    href="/faq"
    className="cursor-pointer transition hover:text-black"
  >
    FAQ
  </Link>
</div>

        <p className="mt-6 text-sm text-gray-100/70">
          © Sukrut. All rights reserved
        </p>
      </div>
    </section>
  );
}
