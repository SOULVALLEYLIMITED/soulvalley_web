"use client"
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/images/soul_valley_logo.png"

const sections = [
  {
    title: "Introduction",
    content: `This Privacy Policy explains how Soulvalley ("we", "us", or "our") collects, uses, and protects information when you visit our website at soulvalley.tech or contact us about our services. By using our website, you agree to the practices described in this policy. If you do not agree, please do not use our site.`,
  },
  {
    title: "Information We Collect",
    content: `We only collect information you voluntarily provide to us. This includes your full name, email address, and the content of any message you send through our contact form. We do not collect payment information, create user accounts, or store sensitive personal data. We may also collect basic analytics data such as pages visited, time spent on the site, and general location (country level) through standard web analytics tools.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information you provide solely to respond to your inquiry, assess your project requirements, and communicate with you about working together. We do not sell, rent, or share your personal information with third parties for marketing purposes. We may reference your business name and project outcome as a case study only if you provide explicit written consent.`,
  },
  {
    title: "Data Storage & Security",
    content: `Your contact form submissions are stored securely and accessible only to the Soulvalley team. We take reasonable technical and organizational measures to protect your data from unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure. If you have concerns about a specific data interaction, contact us directly at info@soulvalley.com.`,
  },
  {
    title: "Third-Party Services",
    content: `Our website uses Google Maps to display our office location. Google Maps operates under its own privacy policy available at google.com/policies/privacy. We may also use standard analytics tools to understand site traffic. These tools may set cookies or collect anonymized usage data. We do not share personally identifiable information with these services.`,
  },
  {
    title: "Cookies",
    content: `Our website uses minimal cookies — primarily for analytics and to ensure the site functions correctly. These cookies do not store personally identifiable information. You can disable cookies in your browser settings at any time, though some parts of the site may not function as intended as a result.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to request access to any personal data we hold about you, ask us to correct inaccurate information, request deletion of your data, or withdraw consent for us to contact you. To exercise any of these rights, email us at info@soulvalley.com with the subject line "Data Request" and we will respond within 7 business days.`,
  },
  {
    title: "Children's Privacy",
    content: `Our website and services are not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. When we do, we will update the "Last Updated" date at the bottom of this page. We encourage you to review this policy periodically. Continued use of our website after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy or how we handle your data, please reach out to us directly. We're happy to clarify anything.\n\nEmail: info@soulvalley.com\nPhone: (234) 905-5908-354\nAddress: 279, Herbert Macaulay Way, Alagomeji, Lagos, Nigeria 100001`,
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="bg-[var(--color-bg)] min-h-screen">

      {/* Top bar */}
      <div className="border-b border-[var(--color-border)] px-6 lg:px-[3rem] py-5 flex items-center justify-between">
        <Link href="/">
          <Image src={logo} alt="Soulvalley" width={120} height={36} className="object-contain" />
        </Link>
        <Link
          href="/"
          className="text-sm text-dark/50 hover:text-dark transition-colors flex items-center gap-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          ← Back to site
        </Link>
      </div>

      <div className="px-6 lg:px-[3rem] py-16 lg:py-24">

        {/* Header */}
        <div className="border-b border-[var(--color-border)] pb-12 mb-12">
          <span
            className="rounded-full border border-dark/30 px-4 py-1 text-sm text-dark/50"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Legal
          </span>
          <h1
            className="mt-6 text-4xl lg:text-6xl font-bold text-dark leading-[1.05]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Privacy Policy
          </h1>
          <p
            className="mt-4 text-dark/50 text-base"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Last updated: January 2025
          </p>
          <p
            className="mt-4 text-dark/60 text-base leading-relaxed lg:w-[55%]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            At Soulvalley, we take your privacy seriously. This document explains
            clearly and plainly what information we collect, why we collect it,
            and how we protect it.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Sticky sidebar — table of contents */}
          <aside className="hidden lg:block w-[220px] flex-shrink-0">
            <div className="sticky top-24">
              <p
                className="text-xs font-semibold uppercase tracking-[0.14em] text-dark/40 mb-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Contents
              </p>
              <nav className="flex flex-col gap-2">
                {sections.map((s, i) => (
                     <a
                    key={i}
                    href={`#section-${i}`}
                    className="text-sm text-dark/50 hover:text-dark transition-colors py-1 border-l-2 border-transparent hover:border-dark pl-3"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col gap-12">
            {sections.map((section, i) => (
              <div
                key={i}
                id={`section-${i}`}
                className="border-b border-[var(--color-border)] pb-12 last:border-none"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span
                    className="text-xs font-semibold text-dark/30 mt-1 flex-shrink-0"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className="text-xl lg:text-2xl font-bold text-dark"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {section.title}
                  </h2>
                </div>
                <div className="pl-8">
                  {section.content.split("\n\n").map((para, j) => (
                    <p
                      key={j}
                      className="text-dark/60 text-base leading-relaxed mb-3 last:mb-0"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-20 pt-10 border-t border-[var(--color-border)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <p
            className="text-sm text-dark/40"
            style={{ fontFamily: "var(--font-body)" }}
          >
            © {new Date().getFullYear()} Soulvalley. All rights reserved.
          </p>
          <Link
            href="/"
            className="text-sm text-dark underline underline-offset-4 hover:text-dark/60 transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Back to Soulvalley
          </Link>
        </div>

      </div>
    </div>
  )
}