"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15,
      ease: "easeOut",
    },
  },
} as any;

const leftContentVariants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
} as any;

const rightContentVariants = {
  hidden: { x: 60, opacity: 0, scale: 0.95 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
} as any;

const badgeVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as any;

const headingVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
} as any;

const paragraphVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, delay: 0.2, ease: "easeOut" },
  },
} as any;

const contactItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
} as any;

const socialIconVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
    rotate: -180,
  },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 200,
    },
  }),
  hover: {
    scale: 1.2,
    rotate: 10,
    transition: { duration: 0.2 },
  },
} as any;

const contactCardVariants = {
  hidden: {
    y: 60,
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 0.3,
      ease: "easeOut",
    },
  },
} as any;

const optionVariants = {
  hidden: {
    y: 25,
    opacity: 0,
  },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: custom * 0.12,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
} as any;

const mapVariants = {
  hidden: {
    y: 40,
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 0.4,
      ease: "easeOut",
    },
  },
} as any;

export default function ContactUs() {
  const router = useRouter();

  const contactItems = [
    {
      label: "Call Center",
      value: "(234) 802-313-4756",
      href: "tel:+2348023134756",
    },
    {
      label: "Our Location",
      value: "279, Herbert Macaulay Way,\nAlagomeji, Lagos,\nNigeria 100001",
    },
    {
      label: "Email",
      value: "seanimayi@soulvalley.tech",
      isLink: true,
      href: "mailto:seanimayi@soulvalley.tech",
    },
  ];

  const socialIcons = [
    {
      name: "Facebook",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.5"
            cy="6.5"
            r="0.5"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <motion.section
        id="contact"
        className="section-anchor bg-surface py-20 lg:px-[3rem] px-[1.5rem]"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: false,
          amount: 0.1,
        }}
        variants={containerVariants}
      >
        <div>
          {/* Top section — two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* LEFT COLUMN */}
            <motion.div variants={leftContentVariants}>
              <motion.span
                className="rounded-full border border-dark px-4 py-1 text-sm text-dark"
                variants={badgeVariants}
              >
                Contact Us
              </motion.span>

              <motion.h2
                className="mt-5 lg:text-[4rem] text-[2.5rem] font-bold leading-[1.1] text-[var(--dark)]"
                style={{
                  fontFamily: "var(--font-heading)",
                }}
                variants={headingVariants}
              >
                We are always ready
                <br />
                to help you and
                <br />
                answer your questions
              </motion.h2>

              <motion.p
                className="mt-6 text-[var(--mid)] text-base leading-relaxed"
                style={{
                  fontFamily: "var(--font-body)",
                }}
                variants={paragraphVariants}
              >
                Connect with Soulvalley for innovative tech solutions. Tell us
                about your goals and we'll identify the best way to help your
                business grow.
              </motion.p>

              {/* Contact details */}
              <div className="mt-10 grid lg:grid-cols-2 gap-x-10 gap-y-8 bg-white py-[2rem] px-[1.2rem] rounded-[15px] border border-[#ccc]/15">
                {contactItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    custom={index}
                    variants={contactItemVariants}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--light)] mb-2"
                      style={{
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {item.label}
                    </p>

                    {item.isLink ? (
                      <a
                        href={item.href}
                        className="text-sm text-[var(--dark)] hover:text-[var(--mid)] transition-colors"
                        style={{
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.value}
                      </a>
                    ) : item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-[var(--dark)] hover:text-[var(--mid)] transition-colors"
                        style={{
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p
                        className="text-sm text-[var(--dark)] leading-6"
                        style={{
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.value.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < item.value.split("\n").length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    )}
                  </motion.div>
                ))}

                {/* Social */}
                <motion.div
                  custom={3}
                  variants={contactItemVariants}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--light)] mb-2"
                    style={{
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Social Network
                  </p>

                  <div className="flex items-center gap-4 mt-1">
                    {socialIcons.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href="#"
                        className="text-[var(--dark)] hover:text-[var(--mid)] transition-colors"
                        aria-label={social.name}
                        custom={index}
                        variants={socialIconVariants}
                        whileHover="hover"
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN — DISCOVERY EXPERIENCE */}
            <motion.div
              className="relative overflow-hidden bg-white rounded-[20px] p-8 border border-[#ccc]/20"
              variants={rightContentVariants}
            >
              {/* Decorative animated glow */}
              <motion.div
                className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-gradient-to-br from-orange-400/20 via-yellow-400/20 to-green-500/20 blur-3xl pointer-events-none"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.35, 0.6, 0.35],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10">
                <motion.div
                  className="inline-flex items-center gap-2 rounded-full border border-[#ccc]/30 px-3 py-1.5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <motion.span
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.6, 1],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                    }}
                  />

                  <span
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--mid)]"
                    style={{
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Real-time communication
                  </span>
                </motion.div>

                <motion.h3
                  className="mt-5 text-2xl lg:text-3xl font-bold text-[var(--dark)]"
                  style={{
                    fontFamily: "var(--font-heading)",
                  }}
                  variants={headingVariants}
                >
                  How can we help?
                </motion.h3>

                <motion.p
                  className="mt-3 text-sm text-[var(--mid)] leading-relaxed"
                  style={{
                    fontFamily: "var(--font-body)",
                  }}
                  variants={paragraphVariants}
                >
                  Whether you have an idea, a business challenge, or a project
                  ready to build, start a conversation with Soul Valley.
                </motion.p>

                {/* OPTIONS */}
                <div className="mt-8 space-y-4">
                  {/* AI DISCOVERY */}
                  <motion.button
                    type="button"
                    custom={0}
                    variants={optionVariants}
                    whileHover={{
                      y: -4,
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    onClick={() => router.push("/discovery")}
                    className="group relative w-full overflow-hidden rounded-[16px] bg-[var(--dark)] p-6 text-left text-dark"
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-orange-400/30 via-yellow-400/30 to-green-500/30 blur-3xl"
                      animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.35, 0.65, 0.35],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="relative z-10 flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 via-yellow-400 to-green-500">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3a9 9 0 0 0-9 9c0 2.1.72 4.03 1.93 5.57L4 21l3.43-1.1A8.96 8.96 0 0 0 12 21a9 9 0 1 0 0-18Z" />
                          <path d="M8 12h.01" />
                          <path d="M12 12h.01" />
                          <path d="M16 12h.01" />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <h4
                          className="text-base font-semibold"
                          style={{
                            fontFamily: "var(--font-heading)",
                          }}
                        >
                          Chat with our assistant
                        </h4>

                        <p
                          className="mt-1.5 text-sm leading-6 text-dark/65"
                          style={{
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          Tell us what you're trying to solve. Our discovery
                          assistant will ask the right questions.
                        </p>

                        <div
                          className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-400"
                          style={{
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          Start discovery
                          <motion.span
                            animate={{
                              x: [0, 5, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            →
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </div>

                {/* Bottom note */}
                <motion.div
                  className="mt-7 flex items-center gap-2 text-xs text-[var(--light)]"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.8,
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>

                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Your information is handled securely.
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* MAP */}
          <motion.div
            className="mt-16 rounded-[20px] overflow-hidden h-[400px] w-full"
            variants={mapVariants}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.3692!3d6.5038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sHerbert%20Macaulay%20Way%2C%20Lagos!5e0!3m2!1sen!2sng!4v1234567890"
              width="100%"
              height="100%"
              style={{
                border: 0,
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Soulvalley Location"
            />
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}