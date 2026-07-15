"use client"
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import education from '@/public/images/education.png'
import agric from '@/public/images/agric.png'
import ai from '@/public/images/ai.png'
import telehealth from '@/public/images/telehealth.png'
import startup from '@/public/images/startup.png'
import commerce from '@/public/images/commerce.png'
import christianTech from '@/public/images/christianTech.png'

// Service data
const services = [
  {
    id: 1,
    title: "Christian Tech",
    description: "Developing faith-based digital tools and platforms that connect communities, spread the gospel, and empower ministries with technology.",
    image: christianTech,
  },
  {
    id: 2,
    title: "Agric",
    description: "Transforming agriculture with smart farming solutions that increase yield and reduce waste.",
    image: agric,
  },
  {
    id: 3,
    title: "AI",
    description: "Leveraging artificial intelligence to automate processes and unlock new possibilities.",
    image: ai,
  },
  {
    id: 4,
    title: "Telehealth",
    description: "Connecting patients with healthcare providers through secure and intuitive digital platforms.",
    image: telehealth,
  },
  {
    id: 5,
    title: "StartUp",
    description: "Helping startups build scalable MVPs and digital products that attract investors and users.",
    image: startup,
  },
  {
    id: 6,
    title: "Commerce",
    description: "Creating powerful e-commerce solutions that drive sales and deliver seamless shopping experiences.",
    image: commerce,
  },
  {
    id: 7,
    title: "Education",
    description: "Building digital learning platforms that make education accessible and engaging for everyone.",
    image: education,
  },
];

// Duplicate services for seamless looping
const duplicatedServices = [...services, ...services, ...services];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
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

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0, y: 30 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.05, duration: 0.5, ease: "easeOut" }
  }),
  hover: {
    y: -8,
    transition: { duration: 0.3 }
  }
} as any;

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.4, ease: "easeOut" }
  },
  hover: {
    scale: 1.03,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1 }
  }
} as any;

export default function Project() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const container = containerRef.current;
  const scrollContainer = scrollRef.current;

  if (!container || !scrollContainer) return;

  const handleScroll = () => {
    const rect = container.getBoundingClientRect();
    const scrollY = window.scrollY;
    const containerTop = rect.top + scrollY;
    const containerHeight = rect.height;
    const windowHeight = window.innerHeight;
    
    // Calculate progress (0 to 1)
    const progress = Math.max(0, Math.min(1, 
      (scrollY - containerTop + windowHeight) / (containerHeight + windowHeight)
    ));
    
    // REDUCE SPEED HERE - multiply by a factor less than 1
    const speedFactor = 0.3; // Adjust this value (0.3 = slower, 0.8 = faster)
    const slowedProgress = progress * speedFactor;
    
    // Calculate horizontal scroll based on vertical scroll progress
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    scrollContainer.scrollLeft = slowedProgress * maxScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  return () => window.removeEventListener('scroll', handleScroll);
}, []);
  return (
    <motion.div
      id="portfolio"
      className="section-anchor py-[3rem] bg-surface overflow-hidden"
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="px-6 lg:px-[3rem]">
        {/* Header */}
        <div className="flex justify-between lg:items-end lg:flex-row flex-col-reverse">
          <motion.p
            className="mt-5 text-lg text-dark lg:w-[55%]"
            variants={paragraphVariants}
          >
            We don't just build software — we solve real problems. From education 
            to agriculture, AI to telehealth, we create solutions that make a 
            difference in people's lives and businesses. <br /><br />
            <strong>We also build our own products</strong> — innovative tools 
            and platforms designed to tackle challenges head-on and create 
            lasting impact across industries.
          </motion.p>

          <motion.div variants={headerVariants}>
            <motion.span
              className="rounded-full border border-dark px-4 py-1 text-sm text-dark"
              variants={badgeVariants}
            >
              What We Build
            </motion.span>
            <motion.h2
              className="mt-6 text-5xl font-bold leading-tight text-dark"
              variants={headingVariants}
            >
              Solving Problems
              <br />
              Across Industries
            </motion.h2>
          </motion.div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="mt-[4rem] flex flex-nowrap gap-6 overflow-x-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: "auto",
          }}
        >
          {duplicatedServices.map((service, index) => (
            <motion.div
              key={`${service.id}-${index}`}
              className="min-w-[380px]  bg-white rounded-[30px] overflow-hidden border border-[#ccc]/20 "
              custom={index}
              variants={cardVariants}
              whileHover="hover"
            >
              {/* Image */}
              <div className="h-[200px] w-full relative overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-dark font-heading text-2xl font-semibold">
                  {service.title}
                </h3>
                <p className="text-dark/60 font-body text-sm mt-2 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div 
          className="mt-12 text-center"
          variants={ctaVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link
            href="#contact"
            className="inline-block border-2 border-dark bg-dark text-white px-10 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-transparent hover:text-dark rounded-full transition-all duration-200"
          >
            Let's Build Together
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        /* Hide scrollbar */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
}