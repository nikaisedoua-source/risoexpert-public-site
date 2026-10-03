"use client";

import { Children, isValidElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type FolderPanelProps = { id: string; number: string; title: string; summary: string; children: ReactNode };
export function FolderPanel({ children }: FolderPanelProps) { return <>{children}</>; }

const aliases: Record<string, string> = { tarifs: "faq", services: "services", machines: "machines", demande: "demande", contact: "contact", partenaires: "partenaires", catalogue: "catalogue", avis: "avis" };

export function FolderDeck({ children }: { children: ReactNode }) {
  const panels = useMemo(() => Children.toArray(children).filter(isValidElement<FolderPanelProps>), [children]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const active = panels.find(panel => panel.props.id === activeId) ?? null;

  function close() {
    setActiveId(null);
    if (panels.some(panel => panel.props.id === (aliases[window.location.hash.slice(1)] ?? window.location.hash.slice(1)))) {
      window.history.replaceState(null, "", "#dossiers");
    }
  }

  useEffect(() => {
    const resolve = (hash: string) => {
      const next = aliases[hash] ?? hash;
      return panels.some(panel => panel.props.id === next) ? next : null;
    };
    const onHash = () => setActiveId(resolve(window.location.hash.slice(1)));
    const onLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      const href = anchor?.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const next = resolve(href.slice(1));
      if (!next) return;
      event.preventDefault();
      window.history.pushState(null, "", "#" + next);
      setActiveId(next);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    document.addEventListener("click", onLink);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
      document.removeEventListener("click", onLink);
    };
  }, [panels]);

  useEffect(() => {
    const element = dialog.current;
    if (!element || !activeId) return;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [activeId]);

  return <>
    <div className="rx-folder-grid">
      {panels.map(panel => <button className="rx-folder" type="button" key={panel.props.id}
        onClick={() => { window.history.pushState(null, "", "#" + panel.props.id); setActiveId(panel.props.id); }}
        aria-haspopup="dialog" aria-label={panel.props.number + " " + panel.props.title + " — " + panel.props.summary}>
        <span className="rx-folder-top"><span className="rx-folder-icon" aria-hidden="true"/><span className="rx-folder-number">{panel.props.number}</span></span>
        <strong>{panel.props.title}</strong><small>{panel.props.summary}</small>
      </button>)}
    </div>
    {active ? <dialog className="rx-modal" ref={dialog} aria-labelledby={"rx-modal-" + active.props.id}
      onCancel={event => { event.preventDefault(); close(); }}
      onClick={event => { if (event.target === event.currentTarget) {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
      } }}>
      <div className="rx-modal-bar"><div><span>DOSSIER / {active.props.number}</span><h2 id={"rx-modal-" + active.props.id}>{active.props.title}</h2></div>
        <button type="button" onClick={close} aria-label="Fermer le dossier">Fermer <kbd>ESC</kbd></button>
      </div><div className="rx-modal-content">{active.props.children}</div>
    </dialog> : null}
  </>;
}
