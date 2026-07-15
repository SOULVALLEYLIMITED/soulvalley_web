"use client"
import person1 from '@/public/images/person1.jpg'
import person2 from '@/public/images/person2.jpg'
import person3 from '@/public/images/person3.jpg'
import person4 from '@/public/images/person4.jpg'
import Image from 'next/image'
import { useState } from 'react'
import type { StaticImageData } from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

type Testimonial = {
  id: number
  name: string
  role: string
  image: StaticImageData
  highlight: string
  stars: number
}

const testimonials: Testimonial[] = [
  {
    id: 0,
    name: "Engr. Peter Akpelu",
    role: "CEO of Ribiax Engineering",
    image: person1,
    highlight: "Soulvalley surpassed our expectations with their cutting-edge tech solutions.",
    stars: 5,
  },
  {
    id: 1,
    name: "David Echegwisi",
    role: "CEO of Inspire Center",
    image: person2,
    highlight: "The solutions provided by Soulvalley revolutionized our business processes.",
    stars: 5,
  },
  {
    id: 2,
    name: "Dr. Ihuoma Onyearugha",
    role: "Director at iBelieve Foundation",
    image: person3,
    highlight: "Impressed by Soulvalley's professionalism and commitment to quality tech solutions.",
    stars: 5,
  },
  {
    id: 3,
    name: "Olusola Bankole",
    role: "Director of Bankys Private Sch. Abuja",
    image: person4,
    highlight: "Soulvalley truly understands our goals and delivers outstanding results.",
    stars: 5,
  },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15,
      ease: "easeOut"
    }
  }
} as any;

const headerVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
} as any;

const badgeVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
} as any;

const headingVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, delay: 0.1, ease: "easeOut" }
  }
} as any;

const paragraphVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, delay: 0.2, ease: "easeOut" }
  }
} as any;

const portraitContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
} as any;

const portraitVariants = {
  hidden: { scale: 0.8, opacity: 0, y: 20 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" }
  }),
  hover: {
    scale: 1.05,
    brightness: 0.8,
    transition: { duration: 0.2 }
  },
  active: {
    scale: 1.04,
    brightness: 1,
    ring: "3px solid var(--dark)",
    transition: { duration: 0.3 }
  }
} as any;

const quoteCardVariants = {
  hidden: { scale: 0.95, opacity: 0, y: 30 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3, ease: "easeOut" }
  }
} as any;

const quoteTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" }
  }
} as any;

const quoteMarkVariants = {
  hidden: { scale: 0.5, opacity: 0, rotate: -10 },
  visible: {
    scale: 1,
    opacity: 0.1,
    rotate: 0,
    transition: { duration: 0.6, delay: 0.4, ease: "easeOut" }
  }
} as any;

const dividerVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.5, ease: "easeOut" }
  }
} as any;

const ctaVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, delay: 0.4, ease: "easeOut" }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
} as any;

const starVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: custom * 0.05 + 0.6, duration: 0.3, type: "spring", stiffness: 300 }
  })
} as any;

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.svg
          key={i}
          className="h-5 w-5 fill-[var(--dark)]"
          viewBox="0 0 24 24"
          custom={i}
          variants={starVariants}
          initial="hidden"
          animate="visible"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </motion.svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [activeId, setActiveId] = useState(0)
  const active = testimonials.find((t) => t.id === activeId)!

  return (
    <motion.section 
      id="testimonials" 
      className="section-anchor bg-[var(--surface)] py-20 px-[3rem]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={containerVariants}
    >
      <div>
        {/* Header */}
        <motion.div 
          className="text-center mb-14 flex flex-col justify-center items-center"
          variants={headerVariants}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[var(--dark)] rounded-full" />
            <motion.span 
              className="rounded-full border border-dark px-4 py-1 text-sm text-dark"
              variants={badgeVariants}
            >
              What Our Client Say
            </motion.span>
          </div>

          <motion.h2
            className="text-5xl font-bold text-[var(--dark)] leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
            variants={headingVariants}
          >
            Honest Feedback
            <br />
            From Valued People
          </motion.h2>

          <motion.p
            className="mt-5 text-[var(--mid)] text-base leading-relaxed w-[50%]"
            style={{ fontFamily: "var(--font-body)" }}
            variants={paragraphVariants}
          >
            Real feedback from businesses and individuals who trusted us to
            build their digital products. Their words reflect the impact of our
            work.
          </motion.p>
        </motion.div>

        {/* Main testimonial block */}
        <div className="flex flex-col-reverse gap-8 items-center">
          {/* Left — portrait stack */}
          <motion.div 
            className="flex flex-row gap-4 lg:w-[180px] justify-center"
            variants={portraitContainerVariants}
          >
            {testimonials.map((t) => (
              <motion.button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`relative lg:h-[160px] lg:w-[160px] w-[80px] h-[80px] overflow-hidden rounded-2xl transition-all duration-300 focus:outline-none flex-shrink-0
                  ${activeId === t.id
                    ? "ring-[3px] ring-[var(--dark)] scale-[1.04] brightness-100"
                    : "brightness-50 hover:brightness-75 hover:scale-[1.02]"
                  }`}
                aria-label={`View ${t.name}'s testimonial`}
                custom={t.id}
                variants={portraitVariants}
                whileHover="hover"
                animate={activeId === t.id ? "active" : "visible"}
              >
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </motion.div>

          {/* Right — quote card */}
          <motion.div 
            className="flex-1 bg-surface rounded-[28px] p-10 relative overflow-hidden min-h-[360px]"
            variants={quoteCardVariants}
          >
            {/* Large decorative quote mark */}
            <motion.div
              className="absolute top-6 right-8 text-[120px] leading-none text-[var(--border)] select-none pointer-events-none"
              style={{ fontFamily: "var(--font-heading)" }}
              aria-hidden
              variants={quoteMarkVariants}
            >
              "
            </motion.div>

            {/* Highlight quote with animation */}
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={`highlight-${activeId}`}
                className="text-3xl font-bold text-[var(--dark)] leading-snug relative z-10"
                style={{ fontFamily: "var(--font-heading)" }}
                variants={quoteTextVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {active.highlight}
              </motion.blockquote>
            </AnimatePresence>

            {/* Divider + name + stars */}
            <motion.div 
              className="mt-8 pt-6 border-t border-dashed border-[var(--border)] flex items-center justify-between"
              variants={dividerVariants}
            >
              <div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`name-${activeId}`}
                    className="font-bold text-[var(--dark)] text-base"
                    style={{ fontFamily: "var(--font-heading)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {active.name}
                  </motion.p>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`role-${activeId}`}
                    className="text-sm text-[var(--light)] mt-0.5"
                    style={{ fontFamily: "var(--font-body)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {active.role}
                  </motion.p>
                </AnimatePresence>
              </div>
              <Stars count={active.stars} />
            </motion.div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div 
          className="mt-16 text-center"
          variants={ctaVariants}
        >
          <motion.p
            className="text-sm font-semibold text-[var(--dark)] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Ready to see results like these?
          </motion.p>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={ctaVariants}
          >
            <Link href="#contact"
              className="border-2 border-dark bg-dark text-white px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-transparent hover:text-dark rounded-full transition-all duration-200 inline-block"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Schedule a call
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}