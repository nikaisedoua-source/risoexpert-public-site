"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type User = { name: string; email: string; picture?: string };
type GoogleCredential = { credential: string };

declare global {
  interface Window {
    google?: { accounts: { id: {
      initialize(options: { client_id: string; callback: (result: GoogleCredential) => void }): void;
      renderButton(element: HTMLElement, options: Record<string, unknown>): void;
    } } };
  }
}

export default function GoogleSignIn() {
  const target = useRef<HTMLDivElement>(null);
  const [clientId, setClientId] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((data) => setUser(data.user));
    fetch("/api/auth/google/config").then((r) => r.json()).then((data) => setClientId(data.clientId || ""));
  }, []);

  useEffect(() => {
    if (!ready || !clientId || !target.current || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        const response = await fetch("/api/auth/google", {
          method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ credential }),
        });
        const data = await response.json();
        if (response.ok) setUser(data.user);
      },
    });
    target.current.replaceChildren();
    window.google.accounts.id.renderButton(target.current, { theme: "outline", size: "medium", text: "signin_with", shape: "pill" });
  }, [ready, clientId]);

  async function signOut() {
    await fetch("/api/auth/session", { method: "DELETE" });
    setUser(null);
  }

  return <>
    <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setReady(true)} />
    {user ? <button className="userChip" type="button" onClick={signOut} title="Cliquer pour se déconnecter">
      {user.picture && <img src={user.picture} alt="" referrerPolicy="no-referrer" />}<span>{user.name}</span>
    </button> : <div className="googleSignIn" ref={target} aria-label="Connexion avec Google" />}
  </>;
}
