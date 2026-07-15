"use client";
import Image from "next/image";
import logo from "@/public/images/soul_valley_logo.png";
import { motion } from "framer-motion";
import Link from "next/link";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      ease: "easeOut",
    },
  },
} as any;

const footerVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
} as any;

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0, x: -30 },
  visible: {
    scale: 1,
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
} as any;

const textVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as any;

const socialIconVariants = {
  hidden: { scale: 0, opacity: 0, rotate: -180 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      delay: custom * 0.08,
      duration: 0.4,
      type: "spring",
      stiffness: 200,
    },
  }),
  hover: {
    scale: 1.2,
    y: -3,
    transition: { duration: 0.2 },
  },
} as any;

const linkGroupVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" },
  }),
} as any;

const linkItemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: (custom: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: custom * 0.05, duration: 0.3, ease: "easeOut" },
  }),
  hover: {
    x: 5,
    transition: { duration: 0.2 },
  },
} as any;

const dividerVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.6, delay: 0.4, ease: "easeOut" },
  },
} as any;

const bottomRowVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.5, ease: "easeOut" },
  },
} as any;

// Link mapping for navigation
const linkHrefs: { [key: string]: string } = {
  About: "#aboutus",
  Features: "#features",
  Portfolio: "#portfolio",
  Testimonials: "#testimonials",
  "Web Applications": "#portfolio",
  "Mobile Apps": "#portfolio",
  "AI Integration": "#portfolio",
  "E-Commerce": "#portfolio",
  "Contact Us": "#contact",
  "Privacy Policy": "/privacy",
  "Terms of Use": "#",
  FAQ: "#faq",
};

const links = {
  Company: ["About", "Features", "Portfolio", "Testimonials"],
  Porfolio: ["Web Applications", "Mobile Apps", "AI Integration", "E-Commerce"],
  Support: ["Contact Us", "Privacy Policy", "Terms of Use", "FAQ"],
};

export default function Footer() {
  const socialLinks = [
    {
      label: "Facebook",
      path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
      fill: true,
    },
    {
      label: "Twitter",
      path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      fill: true,
    },
    {
      label: "Instagram",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
      fill: true,
    },
    {
      label: "LinkedIn",
      path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z",
      fill: true,
    },
  ];

  return (
    <motion.footer
      className="bg-[var(--dark)] px-12 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={containerVariants}
    >
      <motion.div variants={footerVariants}>
        {/* Top row — logo + links */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-4">
            <motion.div variants={logoVariants}>
              <Link href="#">
                {" "}
                <Image
                  src={logo}
                  alt="Soulvalley"
                  width={140}
                  height={40}
                  className="object-contain"
                />
              </Link>
            </motion.div>

            <motion.p
              className="text-sm text-[var(--light)] leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
              variants={textVariants}
            >
              Building digital products
              <br />
              Nigerian businesses are proud of.
            </motion.p>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map((s, index) => (
                <motion.a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="text-[var(--light)] hover:text-[#333]/20 transition-all"
                  custom={index}
                  variants={socialIconVariants}
                  whileHover="hover"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={s.fill ? "currentColor" : "none"}
                  >
                    <path d={s.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items], groupIndex) => (
            <motion.div
              key={group}
              custom={groupIndex}
              variants={linkGroupVariants}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--light)] mb-5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {group}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item, itemIndex) => (
                  <motion.li
                    key={item}
                    custom={itemIndex}
                    variants={linkItemVariants}
                  >
                    <a
                      href={linkHrefs[item] || "#"}
                      className="text-sm text-[#333] hover:text-[#333]/20 transition-all duration-200"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className="mt-14 border-t border-[#ccc]/20"
          variants={dividerVariants}
        />

        {/* Bottom row */}
        <motion.div
          className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-4"
          variants={bottomRowVariants}
        >
          <p
            className="text-xs text-[#555555]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            © {new Date().getFullYear()} Soulvalley. All rights reserved.
          </p>
          <p
            className="text-xs text-[#555555]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Lagos, Nigeria · info@soulvalley.com · (234) 905-5908-354
          </p>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}
