"use client";
import consultant from "@/public/images/souly_consultant.png";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { FiX, FiInfo, FiCheck } from "react-icons/fi";
import Typed from "typed.js";
import {
  API_URL,
  TERMS_AND_CONDITIONS,
  extractDiscoveryData,
  submitDiscovery as apiSubmitDiscovery,
  DiscoveryExtraction,
} from "../../lib/api";

// ✅ Simple markdown to HTML converter
// ✅ IMPROVED: Markdown to HTML converter with proper lists, paragraphs, and headers
// ✅ FIXED: Properly handle null values for olMatch and ulMatch
// ✅ COMPLETELY FIXED: Markdown to HTML converter with proper list support
// ✅ COMPLETELY FIXED: Markdown to HTML converter with proper null handling
const markdownToHtml = (text: string): string => {
  if (!text) return "";

  let html = text;
  
  // Remove any [object Object] or function tags
  html = html.replace(/\[object Object\]/g, '');
  html = html.replace(/<function[^>]*>/g, '');
  html = html.replace(/<\/function>/g, '');

  // Code blocks (```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-black/20 p-3 rounded-lg overflow-x-auto my-2"><code class="text-sm">${code.trim()}</code></pre>`;
  });

  // Inline code (`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-black/20 px-1.5 py-0.5 rounded text-sm">$1</code>');

  // Bold (**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic (*)
  html = html.replace(/(?<!\S)\*([^*]+)\*(?!\S)/g, '<em>$1</em>');

  // Headers (#)
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold my-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold my-4">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline hover:opacity-80">$1</a>'
  );

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-white/30 pl-4 my-2 italic">$1</blockquote>');

  // ✅ Process line by line with proper null handling
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let inParagraph = false;
  let paragraphLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed === '') {
      // Close any open list
      if (inList && listItems.length > 0) {
        const tag = listType === 'ul' ? 'ul' : 'ol';
        const cls = listType === 'ul' ? 'list-disc' : 'list-decimal';
        result.push(`<${tag} class="${cls} my-2 pl-6">${listItems.join('')}</${tag}>`);
        listItems = [];
        inList = false;
        listType = null;
      }
      // Close any open paragraph
      if (inParagraph && paragraphLines.length > 0) {
        result.push(`<p class="my-2">${paragraphLines.join(' ')}</p>`);
        paragraphLines = [];
        inParagraph = false;
      }
      result.push('');
      continue;
    }

    // Check if it's a header (already converted)
    if (/^<h[1-3]/.test(trimmed)) {
      // Close any open list
      if (inList && listItems.length > 0) {
        const tag = listType === 'ul' ? 'ul' : 'ol';
        const cls = listType === 'ul' ? 'list-disc' : 'list-decimal';
        result.push(`<${tag} class="${cls} my-2 pl-6">${listItems.join('')}</${tag}>`);
        listItems = [];
        inList = false;
        listType = null;
      }
      // Close any open paragraph
      if (inParagraph && paragraphLines.length > 0) {
        result.push(`<p class="my-2">${paragraphLines.join(' ')}</p>`);
        paragraphLines = [];
        inParagraph = false;
      }
      result.push(line);
      continue;
    }

    // ✅ Check for list items with proper null handling
    const ulMatch: RegExpMatchArray | null = trimmed.match(/^[-*]\s+(.+)/);
    const olMatch: RegExpMatchArray | null = trimmed.match(/^\d+\.\s+(.+)/);
    
    const isBlockquote = /^<blockquote/.test(trimmed);
    const isCode = /^<pre/.test(trimmed);

    // ✅ Proper null checks
    const isUlItem = ulMatch !== null;
    const isOlItem = olMatch !== null;

    if (isUlItem || isOlItem) {
      // Close any open paragraph
      if (inParagraph && paragraphLines.length > 0) {
        result.push(`<p class="my-2">${paragraphLines.join(' ')}</p>`);
        paragraphLines = [];
        inParagraph = false;
      }

      // ✅ Safely get content with null checks
      let content: string = '';
      let currentListType: 'ul' | 'ol' = 'ul';
      
      if (isUlItem && ulMatch) {
        content = ulMatch[1];
        currentListType = 'ul';
      } else if (isOlItem && olMatch) {
        content = olMatch[1];
        currentListType = 'ol';
      }

      if (content) {
        if (!inList || listType !== currentListType) {
          // Close previous list
          if (inList && listItems.length > 0) {
            const tag = listType === 'ul' ? 'ul' : 'ol';
            const cls = listType === 'ul' ? 'list-disc' : 'list-decimal';
            result.push(`<${tag} class="${cls} my-2 pl-6">${listItems.join('')}</${tag}>`);
            listItems = [];
          }
          inList = true;
          listType = currentListType;
        }
        listItems.push(`<li class="my-1">${content}</li>`);
      }
    } else if (isBlockquote || isCode) {
      // Close any open list
      if (inList && listItems.length > 0) {
        const tag = listType === 'ul' ? 'ul' : 'ol';
        const cls = listType === 'ul' ? 'list-disc' : 'list-decimal';
        result.push(`<${tag} class="${cls} my-2 pl-6">${listItems.join('')}</${tag}>`);
        listItems = [];
        inList = false;
        listType = null;
      }
      // Close any open paragraph
      if (inParagraph && paragraphLines.length > 0) {
        result.push(`<p class="my-2">${paragraphLines.join(' ')}</p>`);
        paragraphLines = [];
        inParagraph = false;
      }
      result.push(line);
    } else {
      // Regular text - add to paragraph
      if (inList && listItems.length > 0) {
        const tag = listType === 'ul' ? 'ul' : 'ol';
        const cls = listType === 'ul' ? 'list-disc' : 'list-decimal';
        result.push(`<${tag} class="${cls} my-2 pl-6">${listItems.join('')}</${tag}>`);
        listItems = [];
        inList = false;
        listType = null;
      }
      
      if (!inParagraph) {
        inParagraph = true;
        paragraphLines = [];
      }
      paragraphLines.push(trimmed);
    }
  }

  // Flush any remaining list
  if (inList && listItems.length > 0) {
    const tag = listType === 'ul' ? 'ul' : 'ol';
    const cls = listType === 'ul' ? 'list-disc' : 'list-decimal';
    result.push(`<${tag} class="${cls} my-2 pl-6">${listItems.join('')}</${tag}>`);
    listItems = [];
    inList = false;
    listType = null;
  }

  // Flush any remaining paragraph
  if (inParagraph && paragraphLines.length > 0) {
    result.push(`<p class="my-2">${paragraphLines.join(' ')}</p>`);
    paragraphLines = [];
    inParagraph = false;
  }

  html = result.join('\n');

  return html;
};

interface AIBodyProps {
  onChatStart?: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type DiscoveryData = DiscoveryExtraction;

export default function AIBody({ onChatStart }: AIBodyProps) {
  const titles = [
    "What Solutions can we build for you?",
    "What problem can we solve for you today?",
    "What's the next big thing you're building?",
    "What idea are we bringing to life today?",
    "What can we build for your business?",
    "What's on your mind — let's build it.",
    "Got an idea? Let's turn it into solution.",
    "What should we build together?",
    "What does your business need next?",
    "Ready to build something businesses actually need?",
  ];

  const el = useRef<HTMLLabelElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Terms Modal State
  const [showTermsModal, setShowTermsModal] = useState(true);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem("sv_terms_accepted");
    if (accepted === "true") {
      setHasAcceptedTerms(true);
      setShowTermsModal(false);
    } else {
      setShowTermsModal(true);
    }
  }, []);

  useEffect(() => {
    if (el.current) {
      const typed = new Typed(el.current, {
        strings: titles,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 2000,
        loop: true,
        showCursor: false,
      });
      return () => typed.destroy();
    }
  }, [titles]);

  const [message, setMessage] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [extractedContact, setExtractedContact] = useState<DiscoveryData | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, isLoading, typingMessage]);

  const getLineCount = (text: string) => text.split("\n").length;

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    const textarea = textareaRef.current;
    if (textarea) {
      const lineCount = getLineCount(value);
      if (lineCount <= 4) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.style.overflowY = "hidden";
      } else {
        textarea.style.overflowY = "auto";
        textarea.style.height = `${24 * 4 + 32}px`;
      }
    }
  };

  // Accept Terms
  const acceptTerms = () => {
    window.localStorage.setItem("sv_terms_accepted", "true");
    setHasAcceptedTerms(true);
    setShowTermsModal(false);
  };

  // Decline Terms
  const declineTerms = () => {
    setIsDeclining(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  // ✅ Clean AI response
  const cleanAIResponse = (text: string): string => {
    let cleaned = text;
    cleaned = cleaned.replace(/\[object Object\]/g, '');
    cleaned = cleaned.replace(/<function[^>]*>/g, '');
    cleaned = cleaned.replace(/<\/function>/g, '');
    cleaned = cleaned.replace(/function\s*\([^)]*\)\s*\{[^}]*\}/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
  };

  // Submit the confirmed discovery report to the backend.
  const submitDiscovery = async (discoveryData: DiscoveryData) => {
    if (isSubmitting || hasSubmitted) return false;

    setIsSubmitting(true);
    try {
      await apiSubmitDiscovery(discoveryData);

      setHasSubmitted(true);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "✅ **Your discovery report has been successfully submitted!** The Soul Valley team will review it and reach out to you soon.",
        },
      ]);

      return true;
    } catch (error) {
      console.error("Error submitting discovery:", error);
      setError("Failed to submit discovery. Please check your connection.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Typewriter effect for streaming messages
  const typeMessage = async (fullText: string, messageIndex: number) => {
    setIsTyping(true);
    setTypingMessage("");
    setStreamingMessageId(messageIndex);

    const cleanText = cleanAIResponse(fullText);
    const words = cleanText.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? "" : " ") + words[i];
      setTypingMessage(currentText);

      const delay = Math.floor(Math.random() * 50) + 30;
      await new Promise((resolve) => setTimeout(resolve, delay));

      setChatMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[messageIndex] && newMessages[messageIndex].role === "assistant") {
          newMessages[messageIndex].content = currentText;
        }
        return newMessages;
      });
    }

    setIsTyping(false);
    setStreamingMessageId(null);
    setTypingMessage("");
    
    // ✅ After typing, check for contact info and auto-submit
    console.log("📝 Typing complete. Checking for contact info...");
    
    if (hasSubmitted) return;

    const fullHistory = [...chatMessages, { role: "assistant" as const, content: cleanText }];

    // Ask a separate, silent Groq call (JSON mode) to read the transcript
    // and tell us whether discovery is actually done — never parse this out
    // of Souly's own reply, since she's instructed to never show the JSON.
    const extraction = await extractDiscoveryData(fullHistory);
    if (!extraction) return;

    if (extraction.ready_for_submission && extraction.contact_name && extraction.email) {
      setExtractedContact(extraction);
      await submitDiscovery(extraction);
      return;
    }

    if (!extraction.contact_name || !extraction.email) {
      const hasAskedForInfo = chatMessages.some(msg =>
        msg.content.includes("name and email") ||
        msg.content.includes("provide your name") ||
        msg.content.includes("contact information")
      );

      if (!hasAskedForInfo && chatMessages.length > 4) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I've gathered a lot of useful information about your needs! To connect you with the Soul Valley team, could you please provide your **name** and **email** address?",
          },
        ]);
      }
    }
  };

  const handleSendMessage = async () => {
    const trimmed = message.trim();
    if (trimmed === "" || isLoading) return;

    setError(null);

    if (!isChatting) {
      setIsChatting(true);
      onChatStart?.();
    }

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const updatedHistory = [...chatMessages, userMessage];
    setChatMessages(updatedHistory);
    setMessage("");
    setIsLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      console.log("📤 Sending to backend:", { messages: updatedHistory });
      
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedHistory }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("📥 Response from backend:", data);

      if (!data.success) {
        throw new Error(data.error || "API returned unsuccessful response");
      }

      if (!data.data || !data.data.response) {
        throw new Error("Invalid response format from server");
      }

      const responseText = data.data.response;
      const newMessageIndex = updatedHistory.length;

      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      await typeMessage(responseText, newMessageIndex);
      
    } catch (err) {
      console.error("❌ Error in handleSendMessage:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Error: ${err instanceof Error ? err.message : "Failed to connect to the server. Please check if the backend is running."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setMessage(text);
    textareaRef.current?.focus();
  };

  // Render message with proper word breaking
  const renderMessage = (msg: ChatMessage, index: number) => {
    const isStreaming = isTyping && streamingMessageId === index;
    const displayContent = isStreaming ? typingMessage : msg.content;
    const isUser = msg.role === "user";

    if (isUser) {
      return (
        <div key={index} className="flex justify-end">
          <div className="min-w-0 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%] rounded-[15px] p-3 text-sm sm:text-base break-words wrap-anywhere whitespace-pre-wrap bg-[#f1f5f9] text-[#0f172a]">
            {displayContent}
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="flex justify-start">
        <div className="min-w-0 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%] rounded-[15px] p-3 text-sm sm:text-base break-words wrap-anywhere whitespace-pre-wrap bg-gradient-to-r from-[#eaa600] via-[#dcac00] to-[#a5c200] text-white">
          <div
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(displayContent || ""),
            }}
            className="markdown-content"
          />
          {isStreaming && <span className="inline-block w-0.5 h-4 ml-0.5 bg-white animate-pulse" />}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ✅ Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-[95%] sm:w-[90%] md:w-[600px] lg:w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiInfo className="text-[#eaa600]" size={24} />
                Terms & Conditions
              </h2>
              <button
                onClick={declineTerms}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="prose prose-sm dark:prose-invert w-full">
              <div className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300 font-body leading-relaxed">
                {TERMS_AND_CONDITIONS.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h2 key={i} className="text-lg font-bold text-[#0f172a] dark:text-white mt-4 mb-2">{line.replace('# ', '')}</h2>;
                  } else if (line.startsWith('## ')) {
                    return <h3 key={i} className="text-md font-semibold text-[#0f172a] dark:text-white mt-3 mb-1">{line.replace('## ', '')}</h3>;
                  } else if (line.startsWith('- ❌') || line.startsWith('- ✅')) {
                    return <div key={i} className="flex items-start gap-2 my-1 text-slate-700 dark:text-slate-300">{line}</div>;
                  } else if (line.trim() === '') {
                    return <br key={i} />;
                  } else {
                    return <p key={i} className="text-slate-600 dark:text-slate-300 my-1">{line}</p>;
                  }
                })}
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end border-t border-slate-200 dark:border-slate-700 pt-4">
              {isDeclining ? (
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="animate-spin">⏳</span>
                  Redirecting...
                </div>
              ) : (
                <>
                  <button
                    onClick={declineTerms}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    Decline
                  </button>
                  <button
                    onClick={acceptTerms}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#eaa600] via-[#dcac00] to-[#a5c200] rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FiCheck size={16} />
                    Accept & Continue
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat UI */}
      {hasAcceptedTerms && (
        <div className="px-4 sm:px-6 h-full w-full flex flex-col overflow-hidden">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2">
              <span className="block sm:inline">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                ×
              </button>
            </div>
          )}

          {!isChatting && (
            <div className="flex-1 min-h-0 flex flex-col justify-center items-center gap-4 px-2">
              <div className="h-[100px] bg-[#f1f5f9] w-[100px] rounded-full flex justify-center items-center shrink-0">
                <Image src={consultant} alt="Consultant" className="object-cover" />
              </div>
              <h1 className="text-center text-[#0f172a] font-heading text-[1.75rem] sm:text-[2.2rem] lg:text-[2.8rem] w-full sm:w-[85%] lg:w-[75%]">
                Hi, I'm{" "}
                <i className="not-italic text-transparent bg-clip-text bg-linear-to-r from-[#eaa600] via-[#dcac00] to-[#a5c200]">
                  Souly
                </i>
                . Tell me what you need — I'll take it from there.
              </h1>
            </div>
          )}

          {isChatting && (
            <div
              ref={chatContainerRef}
              className="w-full lg:w-[65%] sm:w-[80%] mx-auto flex-1 min-h-0 overflow-y-auto py-4 space-y-3 scrollbar-none scroll-smooth"
            >
              {chatMessages.map((msg, index) => renderMessage(msg, index))}

              {isLoading && !isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-[15px] p-3 bg-gradient-to-r from-[#eaa600] via-[#dcac00] to-[#a5c200] flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-full lg:w-[65%] sm:w-[80%] mx-auto flex flex-col gap-3 sm:gap-4 shrink-0 pb-3 sm:pb-4 pt-2">
            <div
              className={`flex w-full scrollbar-none p-3 sm:p-4 bg-[#f1f5f9] border-dashed border-2 border-[#636e7e]/10 rounded-[15px] ${
                getLineCount(message) > 1 ? "items-end" : "items-center"
              }`}
            >
              <div className="relative w-full">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={message}
                  onChange={handleTextArea}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || isSubmitting}
                  placeholder=""
                  className="hidey w-full rounded-lg p-2 sm:p-4 text-[#0f172a] text-[0.95rem] sm:text-[1rem] font-body border-none outline-none resize-none z-10 relative bg-transparent min-h-[44px] sm:min-h-[60px] scrollbar-none disabled:opacity-60"
                  style={{ height: "auto", maxHeight: "128px", overflowY: "hidden" }}
                />
                <label
                  className={`absolute top-2 sm:top-4 left-2 sm:left-4 text-[#636e7e] font-body pointer-events-none text-sm sm:text-base ${
                    isChatting || message.trim() ? "hidden" : ""
                  }`}
                  ref={el}
                />
              </div>
              <div
                className={`flex justify-end items-end ${
                  getLineCount(message) > 1 ? "mt-2" : "ml-2"
                } flex-shrink-0`}
              >
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || isSubmitting || message.trim() === ""}
                  className="flex h-9 w-9 sm:h-[40px] sm:w-[40px] justify-center bg-gradient-to-r from-[#eaa600] via-[#dcac00] to-[#a5c200] text-white items-center rounded-[5px] cursor-pointer hover:opacity-80 transition-opacity shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <BiSend size={18} />
                  )}
                </button>
              </div>
            </div>

            {!isChatting && (
              <div className="grid justify-center items-center lg:grid-cols-3 grid-cols-1 gap-3 w-full">
                <div
                  onClick={() => handleSuggestionClick("I have a problem to solve")}
                  className="flex lg:justify-center items-center lg:py-[0.3rem] py-[0.9rem] px-4 bg-[#f1f5f9] rounded-[15px] border border-[#636e7e]/10 font-body w-full cursor-pointer hover:border-[#eaa600] transition-colors text-sm sm:text-base"
                >
                  I have a problem to solve
                </div>
                <div
                  onClick={() => handleSuggestionClick("I have something to build")}
                  className="flex lg:justify-center items-center lg:py-[0.3rem] py-[0.9rem] px-4 bg-[#f1f5f9] rounded-[15px] border border-[#636e7e]/10 font-body w-full cursor-pointer hover:border-[#eaa600] transition-colors text-sm sm:text-base"
                >
                  I have something to build
                </div>
                <div
                  onClick={() => handleSuggestionClick("I want to make something better")}
                  className="flex lg:justify-center items-center lg:py-[0.3rem] py-[0.9rem] px-4 bg-[#f1f5f9] rounded-[15px] border border-[#636e7e]/10 font-body w-full cursor-pointer hover:border-[#eaa600] transition-colors text-sm sm:text-base"
                >
                  I want to make something better
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}