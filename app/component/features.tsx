"use client"
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

const timelineVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.8, delay: 0.3, ease: "easeInOut" }
  }
} as any;

const curveVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.5, delay: 0.4, ease: "easeInOut" }
  }
} as any;

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: custom * 0.15 + 0.5, duration: 0.5, type: "spring", stiffness: 200 }
  }),
  pulse: {
    scale: [1, 1.3, 1],
    boxShadow: [
      "0 0 0 0 rgba(0,0,0,0.2)",
      "0 0 0 10px rgba(0,0,0,0)",
      "0 0 0 0 rgba(0,0,0,0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
} as any;

const cardVariants = {
  hidden: (custom: number) => ({
    x: custom % 2 === 0 ? 80 : -80,
    opacity: 0,
    rotate: custom % 2 === 0 ? 5 : -5
  }),
  visible: (custom: number) => ({
    x: 0,
    opacity: 1,
    rotate: custom % 2 === 0 ? 3 : -3,
    transition: { duration: 0.7, delay: custom * 0.15 + 0.3, ease: "easeOut" }
  }),
  hover: {
    y: -10,
    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
    transition: { duration: 0.3 }
  }
} as any;

const numberVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: custom * 0.15 + 0.5, duration: 0.4, type: "spring", stiffness: 300 }
  })
} as any;

const titleVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: custom * 0.15 + 0.6, duration: 0.5, ease: "easeOut" }
  })
} as any;

const descriptionVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: custom * 0.15 + 0.7, duration: 0.5, ease: "easeOut" }
  })
} as any;

export default function Features() {
  const features = [
    {
      number: "01",
      title: "Optimized Business Performance",
      description:
        "Enhance workflows, boost productivity, automate repetitive tasks, and save valuable time through intelligent digital solutions.",
      rotate: "rotate-3",
    },
    {
      number: "02",
      title: "Outstanding Client Support",
      description:
        "Soulvalley provides reliable technical support and expert guidance, ensuring your business grows with confidence.",
      rotate: "-rotate-3",
    },
    {
      number: "03",
      title: "User-Friendly & Seamless Designs",
      description:
        "We craft beautiful websites, mobile apps, and software with intuitive experiences that users love.",
      rotate: "rotate-2",
    },
    {
      number: "04",
      title: "Future-Ready Innovation",
      description:
        "From AI automation to custom software development, we build technology that prepares your business for tomorrow.",
      rotate: "-rotate-2",
    },
  ];

  return (
    <motion.section 
      id="features" 
      className="section-anchor relative overflow-hidden bg-white py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="lg:px-[3rem] px-[1.5rem]">
        {/* Header */}
        <motion.div variants={headerVariants}>
          <motion.span 
            className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600"
            variants={badgeVariants}
          >
            Features
          </motion.span>

          <motion.h2 
            className="mt-6 lg:text-[3rem] text-[2.5rem] font-bold leading-tight text-gray-900"
            variants={headingVariants}
          >
            Pioneering Tech
            <br />
            Solutions for Success
          </motion.h2>

          <motion.p 
            className="mt-5 text-lg text-gray-500 lg:w-[55%] w-[85%]"
            variants={paragraphVariants}
          >
            <strong>Soulvalley</strong> is leading the future of technology,
            creating innovative digital products that empower businesses to
            grow, automate, and thrive.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-24">
          {/* Vertical line */}
          <motion.div 
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed border-gray-300"
            variants={timelineVariants}
          />

          {/* Connecting curve */}
          <motion.svg
            className="absolute left-1/2 top-0 hidden h-full w-full -translate-x-1/2 lg:block"
            viewBox="0 0 1200 900"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M600 40
                 C750 90 760 170 600 240
                 C430 310 430 400 600 470
                 C760 540 760 620 600 700
                 C430 780 430 840 600 880"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeDasharray="8 8"
              variants={curveVariants}
            />
          </motion.svg>

          <div className="space-y-28">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative flex ${
                  index % 2 === 0
                    ? "justify-end lg:pr-28"
                    : "justify-start lg:pl-28"
                }`}
              >
                {/* Timeline Dot */}
                <motion.div 
                  className="absolute left-1/2 top-10 z-20 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-white bg-gray-700 shadow-lg"
                  custom={index}
                  variants={dotVariants}
                  animate={["visible", "pulse"]}
                />

                {/* Card */}
                <motion.div
                  className={`w-full md:max-w-[350px] rounded-[30px] bg-white p-8 shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition duration-300 ${feature.rotate}`}
                  custom={index}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <motion.p 
                    className="text-sm font-semibold text-gray-400"
                    custom={index}
                    variants={numberVariants}
                  >
                    {feature.number}
                  </motion.p>

                  <div className="bg-surface rounded-[10px] px-3 py-2 my-2">
                    <motion.h3 
                      className="mt-3 text-2xl font-bold text-gray-900"
                      custom={index}
                      variants={titleVariants}
                    >
                      {feature.title}
                    </motion.h3>

                    <motion.p 
                      className="mt-4 leading-7 text-gray-500"
                      custom={index}
                      variants={descriptionVariants}
                    >
                      {feature.description}
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}