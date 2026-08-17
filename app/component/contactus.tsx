"use client"
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { submitContact } from "../lib/api";

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

const contactItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" }
  })
} as any;

const socialIconVariants = {
  hidden: { scale: 0, opacity: 0, rotate: -180 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut", type: "spring", stiffness: 200 }
  }),
  hover: {
    scale: 1.2,
    rotate: 10,
    transition: { duration: 0.2 }
  }
} as any;

const formCardVariants = {
  hidden: { y: 60, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: 0.3, ease: "easeOut" }
  }
} as any;

const formFieldVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: (custom: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" }
  })
} as any;

const buttonVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.6, ease: "easeOut" }
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
} as any;

const mapVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: 0.4, ease: "easeOut" }
  }
} as any;

export default function ContactUs() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const contactItems = [
    { label: "Call Center", value: "(234) 905-5908-354" },
    { label: "Our Location", value: "279, Herbert Macaulay Way,\nAlagomeji, Lagos,\nNigeria 100001" },
    { label: "Email", value: "seanimayi@gmail.com", isLink: true },
  ];

  const socialIcons = [
    { 
      name: "Facebook", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      )
    },
    { 
      name: "Twitter", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    { 
      name: "Instagram", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      )
    },
    { 
      name: "LinkedIn", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);

    try {
      await submitContact({
        name: String(data.get('user_name') || '').trim(),
        email: String(data.get('user_email') || '').trim(),
        subject: String(data.get('subject') || '').trim(),
        message: String(data.get('message') || '').trim(),
      });

      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! We\'ll get back to you soon.'
      });
      form.reset();
    } catch (error) {
      console.error('Contact submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or email us directly at seanimayi@gmail.com'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section 
      id="contact" 
      className="section-anchor bg-surface py-20 px-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      variants={containerVariants}
    >
      <div>
        {/* Top section — two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <motion.div variants={leftContentVariants}>
            <motion.span 
              className="rounded-full border border-dark px-4 py-1 text-sm text-dark"
              variants={badgeVariants}
            >
              Contact Us
            </motion.span>

            <motion.h2
              className="mt-5 text-5xl font-bold leading-[1.1] text-[var(--dark)]"
              style={{ fontFamily: "var(--font-heading)" }}
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
              style={{ fontFamily: "var(--font-body)" }}
              variants={paragraphVariants}
            >
              Connect with Soulvalley for innovative tech solutions. Tell us
              about your goals and we'll identify the best way to help your
              business grow.
            </motion.p>

            {/* Contact details grid */}
            <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-8 bg-white py-[2rem] px-[1.2rem] rounded-[15px] border border-[#ccc]/15">
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  custom={index}
                  variants={contactItemVariants}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--light)] mb-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.label}
                  </p>
                  {item.isLink ? (
                    <a
                      href={`mailto:${item.value}`}
                      className="text-sm text-[var(--dark)] hover:text-[var(--mid)] transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      className="text-sm text-[var(--dark)] leading-6"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.value.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < item.value.split('\n').length - 1 && <br />}
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
                  style={{ fontFamily: "var(--font-body)" }}
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

          {/* Right column — form card */}
          <motion.div 
            className="bg-white rounded-[20px] p-8 border border-[#ccc]/20"
            variants={formCardVariants}
          >
            <h3
              className="text-xl font-bold text-[var(--dark)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get In Touch
            </h3>
            <p
              className="mt-2 text-sm text-[var(--mid)] leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Define your goals and identify areas where we can add
              value to your business.
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <motion.input
                type="text"
                name="user_name"
                placeholder="Full Name"
                required
                className="w-full border border-[#ccc]/30 rounded-[10px] px-4 py-3 text-sm text-[var(--dark)] bg-[var(--surface)] placeholder:text-[var(--light)] focus:outline-none focus:border-[var(--dark)] transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
                custom={0}
                variants={formFieldVariants}
              />
              <motion.input
                type="email"
                name="user_email"
                placeholder="Email"
                required
                className="w-full border border-[#ccc]/30 rounded-[10px] px-4 py-3 text-sm text-[var(--dark)] bg-[var(--surface)] placeholder:text-[var(--light)] focus:outline-none focus:border-[var(--dark)] transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
                custom={1}
                variants={formFieldVariants}
              />
              <motion.input
                type="text"
                name="subject"
                placeholder="Subject"
                required
                className="w-full border border-[#ccc]/30 rounded-[10px] px-4 py-3 text-sm text-[var(--dark)] bg-[var(--surface)] placeholder:text-[var(--light)] focus:outline-none focus:border-[var(--dark)] transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
                custom={2}
                variants={formFieldVariants}
              />
              <motion.textarea
                name="message"
                placeholder="Message"
                rows={4}
                required
                className="w-full border border-[#ccc]/30 rounded-[10px] px-4 py-3 text-sm text-[var(--dark)] bg-[var(--surface)] placeholder:text-[var(--light)] focus:outline-none focus:border-[var(--dark)] transition-colors resize-none"
                style={{ fontFamily: "var(--font-body)" }}
                custom={3}
                variants={formFieldVariants}
              />
              
              {/* Status Message */}
              {submitStatus.type && (
                <div className={`p-3 rounded-[10px] text-sm ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-dark text-white py-3 rounded-[10px] text-sm font-semibold uppercase tracking-widest transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--dark-sec)]'
                }`}
                style={{ fontFamily: "var(--font-body)" }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {isSubmitting ? 'Sending...' : 'Send a message'}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div 
          className="mt-16 rounded-[20px] overflow-hidden h-[400px] w-full"
          variants={mapVariants}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.3692!3d6.5038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sHerbert%20Macaulay%20Way%2C%20Lagos!5e0!3m2!1sen!2sng!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Soulvalley Location"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}