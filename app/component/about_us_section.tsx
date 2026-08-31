"use client"
import Image from "next/image";
import groupImage from "@/public/images/group_pic.jpg";
import groupImage2 from "@/public/images/about_us_image_2.jpg";
import { motion } from "framer-motion";

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

const sectionVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
} as any;

const leftContentVariants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" }
  }
} as any;

const rightContentVariants = {
  hidden: { x: 60, opacity: 0, scale: 0.95 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" }
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
    transition: { duration: 0.6, ease: "easeOut" }
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

const statsVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3, ease: "easeOut" }
  }
} as any;

const chipContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.08,
      delayChildren: 0.3
    }
  }
} as any;

const chipVariants = {
  hidden: { scale: 0.8, opacity: 0, rotate: 0 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    rotate: custom % 2 === 0 ? -5 : 5,
    transition: { duration: 0.4, ease: "easeOut" }
  }),
  hover: {
    scale: 1.1,
    rotate: 0,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    transition: { duration: 0.2 }
  }
} as any;

const imageBoxVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, delay: 0.4, ease: "easeOut" }
  }
} as any;

export default function AboutUs() {
  const chips = [
    "Business Dashboards",
    "EdTech Solutions",
    "E-Commerce",
    "AI Integration",
    "Mobile Apps",
    "Web Applications"
  ];

  return (
    <motion.div 
      id="aboutus" 
      className="section-anchor lg:px-[3rem] px-[1.5rem] py-[3rem] bg-surface flex justify-center items-center flex-col"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={containerVariants}
    >
      <motion.div 
        className="flex items-center justify-between lg:flex-row flex-col"
        variants={sectionVariants}
      >
        {/* Left Content */}
        <motion.div 
          className="flex flex-col gap-3"
          variants={leftContentVariants}
        >
          <motion.span 
            className="border py-2 px-3 w-[180px] border-dark/50 rounded-full text-dark/50 flex justify-center items-center"
            variants={badgeVariants}
          >
            About Soul Valley
          </motion.span>
          
          <motion.h2 
            className="font-heading font-semibold lg:text-[3rem] text-[2.5rem]"
            variants={headingVariants}
          >
            We're not just developers. We're your technology partners.
          </motion.h2>
          
          <motion.p 
            className="text-dark/50 lg:w-[55%] w-[85%]"
            variants={paragraphVariants}
          >
            Most agencies build what you ask for. We build what your business
            actually needs.
            <br />
            <br />
            Soul Valley is a Lagos-based digital product studio with 15+
            engineers, designers, and strategists who understand the Nigerian
            market — and know how to build technology that thrives in it. We've
            spent years turning business problems into digital solutions. Every
            project we take on is treated like our own product.
          </motion.p>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          className="my-4"
          variants={rightContentVariants}
        >
          <Image
            src={groupImage}
            alt="Group Image took"
            className="rounded-[15px] border border-black/50"
          />
        </motion.div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div 
        className="bg-black py-[2rem] px-[1rem] w-full my-[2rem] rounded-[20px] about_image relative"
        variants={sectionVariants}
      >
        {/* Stats */}
        <motion.div variants={statsVariants}>
          <motion.h1 
            className="text-white font-heading text-[2.5rem]"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            viewport={{ once: false }}
          >
            79%
          </motion.h1>
          <p className="text-white font-body">Increased growth increase</p>
        </motion.div>

        {/* Chips */}
        <motion.div 
          className="lg:mt-[5.5rem] mt-[2rem] flex flex-wrap lg:w-[400px] gap-2"
          variants={chipContainerVariants}
        >
          {chips.map((chip, index) => (
            <motion.div
              key={index}
              className={`bg-white py-2 px-3 rounded-full drop-shadow-2xl cursor-pointer ${
                index % 2 === 0 ? '-rotate-[5deg]' : 'rotate-[5deg]'
              }`}
              custom={index}
              variants={chipVariants}
              whileHover="hover"
            >
              {chip}
            </motion.div>
          ))}
        </motion.div>

        {/* Image Box */}
        <motion.div 
          className="lg:absolute bottom-0 right-0 h-[300px] lg:bg-surface bg-transparent lg:w-[550px] rounded-tl-[20px] lg:border-l-[25px] lg:border-t-[25px] lg:border-surface about_us_box"
          variants={imageBoxVariants}
        >
          <div className="h-full w-full overflow-hidden rounded-[20px]">
            <Image
              src={groupImage2}
              alt="About us section"
              className="rounded-[20px] h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}