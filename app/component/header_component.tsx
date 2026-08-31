"use client";
import Image from "next/image";
import soulvalley from "@/public/images/soul_valley_logo.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#aboutus", label: "About Us" },
  { href: "#features", label: "Features" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#testimonials", label: "Testimonials" },
];

// Animation variants
const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
} as any;

const logoVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as any;

const navItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} as any;

const ctaVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as any;

const mobileMenuVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
} as any;

const mobileItemVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: (custom: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: custom * 0.05, duration: 0.3, ease: "easeOut" },
  }),
} as any;

export default function HeaderComponent() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for header background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 left-0 z-30 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/35 backdrop-blur-md "
          : "bg-white/15 backdrop-blur-md"
      }`}
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      viewport={{ once: true }}
    >
      {/* Main bar */}
      <div className="flex items-center justify-between w-full px-6 lg:px-12 py-4">
        {/* Logo */}
        <motion.div variants={logoVariants}>
          <Link href="#">
            {" "}
            <Image
              src={soulvalley}
              alt="Soulvalley"
              width={130}
              height={40}
              className="object-contain"
            />
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-14">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              variants={navItemVariants}
              custom={index}
            >
              <Link href={link.href} className="nav_link">
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <motion.div variants={ctaVariants}>
          <Link href="#contact" className="btn1 hidden lg:inline-flex">
            Contact Us
          </Link>
        </motion.div>

        {/* Mobile hamburger */}
        <motion.button
          onClick={() => setOpen(!open)}
          className="lg:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 focus:outline-none"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.1 }}
        >
          <motion.span
            className={`block h-[1.5px] w-6 bg-[var(--color-dark)] transition-all duration-300 origin-center`}
            animate={{
              rotate: open ? 45 : 0,
              translateY: open ? 6.5 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className={`block h-[1.5px] w-6 bg-[var(--color-dark)] transition-all duration-300`}
            animate={{
              opacity: open ? 0 : 1,
              scaleX: open ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className={`block h-[1.5px] w-6 bg-[var(--color-dark)] transition-all duration-300 origin-center`}
            animate={{
              rotate: open ? -45 : 0,
              translateY: open ? -6.5 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            <nav className="flex flex-col px-6 py-6 gap-5 bg-white border-t border-[var(--color-border)]">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  custom={index}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="nav_link py-5 px-3 border-b border-[var(--color-border)] last:border-none"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                custom={navLinks.length}
                variants={mobileItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Link
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn1 mt-10 text-center"
                >
                  Contact Us
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
