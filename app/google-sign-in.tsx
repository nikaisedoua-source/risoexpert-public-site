"use client";

import Script from "next/script";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "./supabase-browser";

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
  const [useSupabase, setUseSupabase] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    getSupabaseBrowserClient().then(async (client) => {
      if (!client) {
        fetch("/api/auth/session").then((r) => r.json()).then((data) => setUser(data.user));
        fetch("/api/auth/google/config").then((r) => r.json()).then((data) => setClientId(data.clientId || ""));
        return;
      }
      setUseSupabase(true);
      const { data } = await client.auth.getUser();
      if (data.user) {
        setUser({
          name: data.user.user_metadata.full_name || data.user.email || "Client",
          email: data.user.email || "",
          picture: data.user.user_metadata.avatar_url,
        });
      }
      const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
        const account = session?.user;
        setUser(account ? {
          name: account.user_metadata.full_name || account.email || "Client",
          email: account.email || "",
          picture: account.user_metadata.avatar_url,
        } : null);
      });
      unsubscribe = () => listener.subscription.unsubscribe();
    });
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (useSupabase || !ready || !clientId || !target.current || !window.google) return;
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
  }, [ready, clientId, useSupabase]);

  async function signOut() {
    const client = await getSupabaseBrowserClient();
    if (client) await client.auth.signOut();
    await fetch("/api/auth/session", { method: "DELETE" });
    setUser(null);
  }

  async function signInWithSupabase() {
    const client = await getSupabaseBrowserClient();
    if (!client) return;
    await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  return <>
    {!useSupabase && <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setReady(true)} />}
    {user ? <button className="userChip" type="button" onClick={signOut} title="Cliquer pour se déconnecter">
      {user.picture && <Image
        src={user.picture}
        alt=""
        width={32}
        height={32}
        unoptimized
        referrerPolicy="no-referrer"
      />}<span>{user.name}</span>
    </button> : useSupabase
      ? <button className="navAction" type="button" onClick={signInWithSupabase}>Connexion Google</button>
      : <div className="googleSignIn" ref={target} aria-label="Connexion avec Google" />}
  </>;
}
