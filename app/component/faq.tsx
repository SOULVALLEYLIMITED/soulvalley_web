"use client"
const faqs = [
  {
    question: "What services does Soulvalley offer?",
    answer:
      "We build custom web applications, mobile apps, AI-powered tools, e-commerce platforms, EdTech solutions, and business dashboards. Everything is built from scratch — no templates, no shortcuts.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "It depends on the scope. A standard business website takes 2–3 weeks. A full custom web application or mobile app typically takes 6–12 weeks. We give you a clear timeline before we start.",
  },
  {
    question: "Do you work with startups or only established businesses?",
    answer:
      "Both. We work with early-stage founders who have an idea and need a technical partner, and with established businesses that need to upgrade or expand their digital infrastructure.",
  },
  {
    question: "What does your development process look like?",
    answer:
      "We follow four stages — Define, Design, Build, and Launch. You're involved at every step. No radio silence, no surprises. Weekly updates are standard on every project.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer:
      "Yes. We offer monthly maintenance and growth retainers starting from ₦50,000/month. This covers hosting, security, updates, and priority support so your product keeps running smoothly.",
  },
  {
    question: "Can you integrate AI into my existing product?",
    answer:
      "Absolutely. We specialize in adding AI capabilities to existing platforms — chatbots, automation, smart dashboards, recommendation engines, and more. Book a call and we'll assess what's possible.",
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="section-anchor bg-[var(--color-bg)] px-6 lg:px-[3rem] py-20">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
        <div>
          <span
            className="rounded-full border border-dark/30 px-4 py-1 text-sm text-dark/50"
            style={{ fontFamily: "var(--font-body)" }}
          >
            FAQ
          </span>
          <h2
            className="mt-5 text-4xl lg:text-5xl font-bold leading-tight text-dark"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Frequently Asked
            <br />
            Questions
          </h2>
        </div>
        <p
          className="text-dark/50 text-base leading-relaxed lg:w-[38%]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Everything you need to know before working with us.
          Can't find what you're looking for?{" "}
          <a
            href="#contact"
            className="text-dark underline underline-offset-4 hover:text-dark/60 transition-colors"
          >
            Send us a message.
          </a>
        </p>
      </div>

      {/* FAQ grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--color-border)]">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-[var(--color-bg)] px-8 py-8 hover:bg-[var(--color-surface)] transition-colors duration-200"
          >
            <div className="flex items-start gap-5">

              {/* Number */}
              <span
                className="text-xs font-semibold text-dark/30 mt-1 flex-shrink-0"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex flex-col gap-3">
                <h3
                  className="text-lg font-bold text-dark leading-snug"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {faq.question}
                </h3>
                <p
                  className="text-dark/50 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {faq.answer}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 flex flex-col items-center text-center gap-4">
        <p
          className="text-sm font-semibold text-dark"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Still have questions?
        </p>
        <a
          href="#contact"
          className="btn1 px-8 py-3"
        >
          Talk to us
        </a>
      </div>

    </section>
  )
}