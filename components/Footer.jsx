import Link from "next/link";
import React from "react";

export const Menu = [
  { link: "/", name: "Home" },
  { link: "/kuliah", name: "Kuliah" },
  { link: "/articles", name: "Articles" },
  { link: "/about", name: "About" },
  { link: "/faq", name: "FAQ" },
];

export const About = [
  { link: "/about#sejarah", name: "Sejarah" },
  { link: "/about#kepengurusan", name: "Kepengurusan" },
];

export const Kuliah = [
  { link: "/kuliah#pendaftaran", name: "Pendaftaran" },
  { link: "/kuliah#jalur-berkas", name: "Jalur Berkas" },
  { link: "/kuliah#jalur-yos", name: "Jalur YÖS" },
  { link: "/kuliah#list-jurusan", name: "List Jurusan" },
];

export const SocialMedia = [
  { link: "https://wa.me/+905525587501", name: "Whatsapp" },
  { link: "https://www.instagram.com/ppikarabuk/", name: "Instagram" },
  { link: "https://www.youtube.com/@mahasiswakarabuk6988", name: "Youtube" },
];

export default function Footer() {
  return (
    <div className="flex flex-col items-center justify-center w-full pt-8 pb-4 text-white bg-black">
      <div className="flex flex-wrap justify-between w-3/4">
        <div className="_footer_list">
          <h6 className="mb-2 text-2xl font-bold">Menu</h6>
          <ul>
            {Menu.map((m, index) => (
              <li key={index}>
                <Link href={m.link}>{m.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="_footer_list">
          <h6 className="mb-2 text-2xl font-bold">About</h6>
          <ul>
            {About.map((m, index) => (
              <li key={index}>
                <Link href={m.link}>{m.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="_footer_list">
          <h6 className="mb-2 text-2xl font-bold">Kuliah</h6>
          <ul>
            {Kuliah.map((m, index) => (
              <li key={index}>
                <Link href={m.link}>{m.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="_footer_list">
          <h6 className="mb-2 text-2xl font-bold">Social Media</h6>
          <ul>
            {SocialMedia.map((m, index) => (
              <li key={index}>
                <Link href={m.link} target="_blank">
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <span className="w-3/4 h-[1px] bg-white mb-2 mt-6"></span>
      <p className="text-xs">© 2023 PPI Karabük. All rights reserved.</p>
    </div>
  );
}
