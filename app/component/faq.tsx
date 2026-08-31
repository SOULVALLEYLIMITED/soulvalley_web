"use client"
const faqs = [
  {
    question: "What does Soul Valley do?",
    answer:
      "We identify important problems and engineer technology solutions to solve them. This can involve custom software, AI, automation, data systems, mobile applications, web platforms, or connected technologies. We choose the technology based on the problem — not the other way around.",
  },

  {
    question: "Do you only build websites and mobile apps?",
    answer:
      "No. Websites and mobile applications are only some of the tools we use. Depending on the problem, a solution may involve AI agents, automation, data systems, APIs, cloud infrastructure, IoT, computer vision, or other emerging technologies.",
  },

  {
    question: "How do you approach a new project?",
    answer:
      "We start with the problem, not the technology. We learn how the organization currently operates, identify the underlying challenge, understand the desired outcome, and then design the most appropriate solution. Once the solution is defined, we engineer, deploy, measure, and improve it.",
  },

  {
    question: "What if I know the solution I want but I'm not sure it's the right one?",
    answer:
      "That's completely fine. You don't need to arrive with a technical specification. If you can explain the problem you're experiencing or the outcome you want, we can help investigate the situation and determine what should be built.",
  },

  {
    question: "Who does Soul Valley work with?",
    answer:
      "We work with organizations, businesses, startups, and teams that have meaningful problems that technology can help solve. We are particularly interested in challenges where better systems, automation, intelligence, or digital infrastructure can create measurable improvement.",
  },

  {
    question: "What does your solution-engineering process look like?",
    answer:
      "Our process is built around seven stages: Discover, Investigate, Architect, Engineer, Deploy, Measure, and Evolve. We first understand the problem, then design and build the solution, introduce it into the real environment, measure its impact, and continue improving it.",
  },

  {
    question: "Can Soul Valley improve an existing system?",
    answer:
      "Yes. We can work with existing software, workflows, and digital infrastructure. Sometimes the best solution is not to build something completely new, but to improve, connect, automate, or modernize what already exists.",
  },

  {
    question: "Can you integrate AI into an existing product or organization?",
    answer:
      "Yes. AI can be integrated where it provides real value. Depending on the problem, this could include AI agents, intelligent search, document processing, recommendations, automation, computer vision, voice interfaces, or decision-support systems. We focus on useful applications rather than adding AI simply for the sake of using it.",
  },

  {
    question: "Do humans remain involved in AI-powered solutions?",
    answer:
      "Yes. We use automation where it improves efficiency while preserving human judgment where context, responsibility, creativity, or important decisions matter. The goal is not to replace people unnecessarily, but to help them work more effectively.",
  },

  {
    question: "How do you determine what technology a project needs?",
    answer:
      "We don't begin with a predetermined technology stack. We evaluate the problem, requirements, environment, users, constraints, security needs, and desired outcomes before deciding what technologies are appropriate.",
  },

  {
    question: "How long does a solution take to build?",
    answer:
      "Every solution is different. The timeline depends on the complexity of the problem, the scope of the system, integrations, testing, and deployment requirements. After understanding the problem, we define the scope and establish a realistic development plan.",
  },

  {
    question: "What happens if the project changes during development?",
    answer:
      "We understand that requirements can evolve as a solution takes shape. Significant changes are discussed with the client before implementation so that their impact on scope, timeline, and resources is clear. This keeps the project transparent for everyone involved.",
  },

  {
    question: "What happens after the solution is launched?",
    answer:
      "Launch is not necessarily the end of the relationship. We can continue monitoring, maintaining, improving, and expanding the solution based on real-world feedback and changing organizational needs.",
  },

];

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