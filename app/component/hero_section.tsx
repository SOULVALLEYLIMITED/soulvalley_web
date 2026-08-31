"use client";
import { FaArrowRight } from "react-icons/fa";
import HeaderComponent from "./header_component";
import Image from "next/image";
import man from "@/public/images/loveday_leonardo.png";
import manMobile from "@/public/images/loveday_leonardo2.png";
import person1 from "@/public/images/person1.jpg";
import person2 from "@/public/images/person2.jpg";
import person3 from "@/public/images/person3.jpg";
import person4 from "@/public/images/person4.jpg";
import { PiPlus } from "react-icons/pi";
import Link from "next/link";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
      ease: "easeOut",
    },
  },
} as any;

const leftContentVariants = {
  hidden: { x: -80, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
} as any;

const rightContentVariants = {
  hidden: { x: 80, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
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

const buttonVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3, ease: "easeOut" },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
} as any;

const imageVariants = {
  hidden: { scale: 0.9, opacity: 0, rotate: -5 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
} as any;

const floatingCardVariants = {
  hidden: { y: 50, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0.4, ease: "easeOut" },
  },
  float: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
} as any;

const personVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: custom * 0.1, duration: 0.4, ease: "easeOut" },
  }),
} as any;

const bottomBadgeVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, delay: 0.6, ease: "easeOut" },
  },
} as any;

export default function HeroSection() {
  return (
    <motion.div
      className="pb-[3rem]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="lg:px-[3rem] px-[1.5rem] flex justify-between items-center lg:flex-row flex-col mt-[2rem]">
        {/* Left Content */}
        <motion.div
          className="flex flex-col gap-3"
          variants={leftContentVariants}
        >
          <motion.span
            className="border py-2 px-3 w-[200px] border-dark/50 rounded-full text-dark/50"
            variants={badgeVariants}
          >
            Welcome to Soulvalley
          </motion.span>

          <motion.h1
            className="font-heading font-semibold lg:text-[4rem] text-[2.5rem]"
            variants={headingVariants}
          >
            Digital infrastructure for organizations that are ready to
            grow.{" "}
          </motion.h1>

          <motion.p
            className="text-dark/50 lg:w-[55%] w-[85%]"
            variants={paragraphVariants}
          >
            We design and build websites, portals, applications and intelligent
            systems that help organizations operate, communicate and serve their
            people better.
          </motion.p>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              href="#contact"
              className="btn1 w-[150px] flex items-center justify-between"
            >
              Let Talk{" "}
              <span className="-rotate-45 h-[40px] w-[40px] rounded-full text-dark flex justify-center items-center bg-white">
                <FaArrowRight />
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Content */}
        <div className="w-[80%] lg:w-auto overflow-hidden  flex lg:block justify-center items-center">
          <motion.div
            className="relative lg:mx-0 lg:w-auto w-full bg-linear-to-r from-dark/20 to-dark-ter/10 rounded-[25px] mt-[5.5rem] lg:mt-0"
            variants={rightContentVariants}
          >
            {/* Floating Card */}
            {/** <motion.div 
            className="absolute bg-white lg:block hidden drop-shadow-2xl lg:-left-10 lg:-top-10 bottom-50  rounded-[15px] px-[1.5rem] py-[1.8rem] border border-[#ccc]/30"
            variants={floatingCardVariants}
            animate="float"
          >
            <span className="font-bold font-heading text-dark/60">
              600+ Satisfied Client
            </span>
            <div className="flex">
              {[person1, person2, person3, person4].map((person, index) => (
                <motion.div
                  key={index}
                  className="h-[50px] w-[50px] rounded-full overflow-hidden border border-[#ccc]/50 -ml-3 first:ml-0"
                  custom={index}
                  variants={personVariants}
                >
                  <Image
                    src={person}
                    alt={`person${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              ))}
              <motion.div 
                className="h-[50px] w-[50px] rounded-full overflow-hidden border border-[#ccc]/50 bg-black -ml-3 text-white flex justify-center items-center"
                custom={4}
                variants={personVariants}
              >
                <PiPlus size={20} />
              </motion.div>
            </div>
          </motion.div> */}

            {/* Main Image */}
            <motion.div variants={imageVariants}>
              <Image src={man} alt="ceo" className="lg:block hidden" />
              <Image src={manMobile} alt="ceo" className="lg:hidden block" />
            </motion.div>

            {/* Bottom Badge */}
            <motion.div
              className="w-full flex justify-center"
              variants={bottomBadgeVariants}
            >
              <span className="bg-black py-3 w-[450px] rounded-full flex justify-center items-center text-white drop-shadow-2xl">
                Solutions for Brand Identity
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
