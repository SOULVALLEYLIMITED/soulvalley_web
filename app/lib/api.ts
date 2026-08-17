export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | string;
  createdAt: string;
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

export async function submitContact(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const res = await fetch(`${API_URL}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new ApiRequestError(res.status, await parseError(res));
  }
}

export async function login(password: string): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    throw new ApiRequestError(res.status, await parseError(res));
  }
  const data = (await res.json()) as { token: string };
  return data.token;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchContacts(): Promise<Contact[]> {
  const res = await fetch(`${API_URL}/contacts`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    throw new ApiRequestError(res.status, await parseError(res));
  }
  return (await res.json()) as Contact[];
}

export async function updateContactStatus(
  id: string,
  status: "new" | "read" | "replied"
): Promise<Contact> {
  const res = await fetch(`${API_URL}/contacts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new ApiRequestError(res.status, await parseError(res));
  }
  return (await res.json()) as Contact;
}

export async function deleteContact(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/contacts/${id}`, {
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
