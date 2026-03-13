import React from "react";
import { BsWhatsapp } from "react-icons/bs";
import { SiInstagram } from "react-icons/si";
import { FiTwitter } from "react-icons/fi";
import { FooterLinks } from "@/components/custom/Footer/FooterLinks";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#191919] p-10">
      <div className="grid grid-cols-4 px-20">
        <FooterLinks
          Heading="About"
          Link1="Contact us"
          Link2="About us"
          Link3="Corporate"
          Link4="Privacy policy"
          Link5="Our Services"
        />
        <FooterLinks
          Heading="Help Center"
          Link1="FAQs"
          Link2="Support"
          Link3="Help"
          Link4="Payment"
        />
        <FooterLinks
          Heading="Connect with Us"
          Link1="Twitter"
          Link2="Instagram"
          Link3="WhatsApp"
        />

        <div className="border-l border-gray-700 pl-6 space-y-3 text-gray-300 leading-relaxed">
          <p className="text-gray-300 text-lg font-semibold tracking-wide uppercase">
            Registered Office Address:
          </p>

          <span className="block text-sm">
            Flipkart Internet Private Limited, Buildings Alyssa, Begonia & Clove
            Embassy Tech Village, Outer Ring Road, Devarabeesanahalli Village,
            Bengaluru, 560103, Karnataka, India
          </span>

          <span className="block">
            CIN : U51109KA2012PTC066107 <br />
            Telephone:{" "}
            <span className="text-blue-500">91565538381 / 9191919191</span>
          </span>
        </div>
      </div>
      <hr className="border-t border-gray-700 my-8" />

      <div className="flex items-center justify-between">
        <span className="flex gap-5 text-white">
          <Link to="https://web.whatsapp.com/" target="_blank">
            <BsWhatsapp
              size={22}
              className="cursor-pointer hover:text-green-500 transition-colors"
            />
          </Link>
          <Link to="https://www.instagram.com/nk.__014" target="_black">
            <SiInstagram
              size={22}
              className="cursor-pointer hover:bg-gradient-to-r hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 transition"
            />
          </Link>
          <Link to="https://x.com/" target="_blank">
            <FiTwitter
              size={22}
              className="cursor-pointer hover:text-blue-500 transition-colors"
            />
          </Link>
        </span>
        <p className="text-white text-sm font-medium">
          © 2025 Your Company. All rights reserved.
        </p>
        <span className="grid grid-cols-3 gap-3">
          <div className="w-20 h-7 bg-white/95  flex items-center justify-center">
            <p className="text-[#5f259f] font-bold text-sm">PhonePe</p>
          </div>

          <div className="w-20 h-7 bg-white/95  flex items-center justify-center">
            <p className="text-[#00baf2] font-bold text-sm">
              Pay<span className="text-[#002970]">tm</span>
            </p>
          </div>

          <div className="w-20 h-7 bg-white/95  flex items-center justify-center ">
            <p className="text-[#5f6368] font-bold text-sm">Google Pay</p>
          </div>
        </span>
      </div>
    </footer>
  );
}
