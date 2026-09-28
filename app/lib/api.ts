// lib/api.ts
// lib/api.ts

// ... existing code ...

// ============================================
// TERMS & CONDITIONS
// ============================================

export const TERMS_AND_CONDITIONS = {
  version: "1.0.0",
  lastUpdated: "2026-09-02",
  content: `
# Soul Valley AI Discovery Terms

## 1. Purpose of This Service
Soul Valley's AI assistant ("Souly") is designed **exclusively** for business discovery and solution exploration. It helps identify problems, gather requirements, and prepare information for the Soul Valley team.

## 2. What This AI Is NOT For
- ❌ **Not a general-purpose chat**: This is not a social chatbot or entertainment tool
- ❌ **Not for casual conversation**: Use is limited to business-related discovery
- ❌ **Not for inappropriate content**: No offensive, harmful, or illegal content
- ❌ **Not for spam**: No bulk messaging or automated abuse
- ❌ **Not for data harvesting**: No scraping or extracting data for external use

## 3. How Your Data Is Used
- Your name and email are collected **only** for follow-up by the Soul Valley team
- Discovery information is shared **only** with the Soul Valley team
- Your data is not sold, rented, or shared with third parties

## 4. Acceptance
By continuing to chat with Souly, you agree to:
- Use this service for legitimate business discovery purposes
- Provide accurate information
- Respect the Soul Valley team's time and expertise
- Not misuse the AI service

## 5. Limitations
- Soul Valley reserves the right to end any chat at any time
- The AI is not a substitute for professional advice
- All discovery reports are reviewed by humans before action is taken

## 6. Contact
For questions about these terms, contact the Soul Valley team directly.
`
};

// ... rest of existing code ...
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | string;
  source: string; // ✅ Add this property
  discoveryDetails?: unknown; // ✅ Optional discovery details
  createdAt: string;
  updatedAt?: string; // ✅ Optional updatedAt

}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data?: {
    response: string;
    model: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
  error?: string;
}

export interface StreamChunk {
  content: string;
  isComplete: boolean;
  error?: string;
}

const TOKEN_KEY = "sv_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

/** Thrown when the API responds with a non-2xx status. */
export class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.message || data?.details || res.statusText;
  } catch {
    return res.statusText;
  }
}

// ============================================
// CONTACT ENDPOINTS
// ============================================

export async function submitContact(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const res = await fetch(`${API_URL}/api/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new ApiRequestError(res.status, await parseError(res));
  }
}

export async function login(password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/contacts/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) {
    throw new ApiRequestError(res.status, data?.error || res.statusText);
  }
  return data.token as string;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchContacts(): Promise<Contact[]> {
  const res = await fetch(`${API_URL}/api/contacts`, {
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) {
    throw new ApiRequestError(res.status, data?.error || res.statusText);
  }
  return (data.data ?? []) as Contact[];
}

export async function updateContactStatus(
  id: string,
  status: "new" | "read" | "replied"
): Promise<void> {
  const res = await fetch(`${API_URL}/api/contacts/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) {
    throw new ApiRequestError(res.status, data?.error || res.statusText);
  }
}

export async function deleteContact(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/contacts/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    throw new ApiRequestError(res.status, await parseError(res));
  }
}

/** Build a Gmail compose URL pre-filled to reply to a contact. */
export function gmailComposeUrl(c: Contact): string {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: c.email,
    su: `Re: ${c.subject}`,
    body: `Hi ${c.name},\n\n`,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

// ============================================
// AI CHAT ENDPOINTS
// ============================================

/**
 * Send a chat message to the AI (non-streaming)
 */
export async function sendChatMessage(params: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new ApiRequestError(
      res.status,
      errorData?.error || errorData?.message || "Failed to get AI response"
    );
  }

  return (await res.json()) as ChatResponse;
}

/**
 * Send a chat message to the AI with streaming support
 */
export async function streamChatMessage(
  params: {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  },
  onChunk: (content: string) => void,
  onComplete?: (fullText: string) => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/api/ai/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new ApiRequestError(
        res.status,
        errorData?.error || errorData?.message || "Failed to stream AI response"
      );
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No reader available");
    }

    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            if (onComplete) onComplete(fullText);
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullText += parsed.content;
              onChunk(parsed.content);
            }
            if (parsed.error) {
              if (onError) onError(parsed.error);
              throw new Error(parsed.error);
            }
            if (parsed.isComplete && onComplete) {
              onComplete(fullText);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error.message : "Unknown error occurred");
    }
    throw error;
  }
}

/**
 * Get available AI models
 */
export async function getAIModels(): Promise<{
  success: boolean;
  data: { models: Array<{ id: string; name: string; description: string }> };
}> {
  const res = await fetch(`${API_URL}/api/ai/models`);
  if (!res.ok) {
    throw new ApiRequestError(res.status, await parseError(res));
  }
  return (await res.json()) as {
    success: boolean;
    data: { models: Array<{ id: string; name: string; description: string }> };
  };
}

/**
 * Check AI service health
 */
export async function checkAIHealth(): Promise<{
  success: boolean;
  status: string;
  message: string;
  timestamp: string;
}> {
  const res = await fetch(`${API_URL}/api/ai/health`);
  if (!res.ok) {
    throw new ApiRequestError(res.status, await parseError(res));
  }
  return (await res.json()) as {
    success: boolean;
    status: string;
    message: string;
    timestamp: string;
  };
}

/**
 * Send a chat message with automatic contact extraction
 * This will send the message to the AI and automatically extract contact info if present
 */
export async function sendChatWithContactExtraction(params: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<{
  response: string;
  contactExtracted: boolean;
  contactId?: string;
}> {
  const res = await fetch(`${API_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...params,
      extractContact: true, // Tell backend to extract contact info
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new ApiRequestError(
      res.status,
      errorData?.error || errorData?.message || "Failed to get AI response"
    );
  }

  const data = await res.json();

  return {
    response: data.data?.response || "",
    contactExtracted: data.data?.contactExtracted || false,
    contactId: data.data?.contactId,
  };
}

// ============================================
// AI DISCOVERY EXTRACTION
// ============================================

export interface DiscoveryExtraction {
  organization: string;
  contact_name: string;
  email: string;
  problem: string;
  idea: string;
  current_process: string;
  target_users: string[];
  desired_outcome: string;
  requirements: string[];
  existing_systems: string[];
  constraints: string[];
  timeline: string;
  budget: string;
  open_questions: string[];
  additional_context: string;
  ready_for_submission: boolean;
}

/**
 * Runs a dedicated extraction pass over the conversation so far (separate
 * Groq call, JSON mode) and returns the structured discovery fields plus a
 * ready_for_submission flag. Call this after each assistant reply instead
 * of parsing Souly's visible text — it never shows the JSON to the user.
 */
export async function extractDiscoveryData(
  messages: ChatMessage[]
): Promise<DiscoveryExtraction | null> {
  const res = await fetch(`${API_URL}/api/ai/extract`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) return null;
  return data.data as DiscoveryExtraction;
}

export async function submitDiscovery(payload: DiscoveryExtraction): Promise<void> {
  const res = await fetch(`${API_URL}/api/ai/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) {
    throw new ApiRequestError(res.status, data?.error || res.statusText);
  }
}

// ============================================
// COMMUNITY ENDPOINTS
// ============================================

export interface CommunityUpdate {
  id: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Public — used by the site's community page. */
export async function fetchCommunityUpdates(): Promise<CommunityUpdate[]> {
  const res = await fetch(`${API_URL}/api/community/updates`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) {
    throw new ApiRequestError(res.status, data?.error || res.statusText);
  }
  return (data.data ?? []) as CommunityUpdate[];
}

export async function createCommunityUpdate(input: {
  title: string;
  body: string;
  imageUrl?: string;
}): Promise<CommunityUpdate> {
  const res = await fetch(`${API_URL}/api/community/updates`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) {
    throw new ApiRequestError(res.status, data?.error || res.statusText);
  }
  return data.data as CommunityUpdate;
}

export async function deleteCommunityUpdate(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/community/updates/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) {
    throw new ApiRequestError(res.status, data?.error || res.statusText);
  }
}

/** Uploads an image to Cloudinary via the backend and returns its hosted URL. */
export async function uploadCommunityImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/api/community/upload-image`, {
    method: "POST",
    headers: { ...authHeaders() }, // no Content-Type — browser sets the multipart boundary
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) {
    throw new ApiRequestError(res.status, data?.error || res.statusText);
  }
  return data.url as string;
}