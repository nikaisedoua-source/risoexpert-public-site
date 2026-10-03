"use client";

import { Children, isValidElement, ReactNode, useEffect, useMemo, useState } from "react";

type FolderPanelProps = {
  id: string;
  number: string;
  title: string;
  summary: string;
  children: ReactNode;
};

export function FolderPanel({ children }: FolderPanelProps) {
  return <>{children}</>;
}

export function FolderDeck({ children }: { children: ReactNode }) {
  const panels = useMemo(() => Children.toArray(children).filter(isValidElement<FolderPanelProps>), [children]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = panels.find((panel) => panel.props.id === activeId) ?? null;

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const aliases: Record<string, string> = { tarifs: "faq", demande: "demande", services: "services", machines: "machines", contact: "contact", partenaires: "partenaires" };
      const next = aliases[hash] ?? hash;
      if (panels.some((panel) => panel.props.id === next)) setActiveId(next);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [panels]);

  useEffect(() => {
    document.body.classList.toggle("rx-modal-open", Boolean(active));
    return () => document.body.classList.remove("rx-modal-open");
  }, [active]);

  return (
    <>
      <div className="rx-folder-grid">
        {panels.map((panel) => (
          <button className="rx-folder" type="button" key={panel.props.id} onClick={() => setActiveId(panel.props.id)} aria-haspopup="dialog">
            <span>{panel.props.number}</span>
            <strong>{panel.props.title}</strong>
            <small>{panel.props.summary}</small>
          </button>
        ))}
      </div>

      {active ? (
        <div className="rx-modal-backdrop" role="presentation" onMouseDown={() => setActiveId(null)}>
          <section className="rx-modal" role="dialog" aria-modal="true" aria-labelledby={`rx-modal-${active.props.id}`} onMouseDown={(event) => event.stopPropagation()}>
            <div className="rx-modal-bar">
              <div><span>Dossier {active.props.number}</span><h2 id={`rx-modal-${active.props.id}`}>{active.props.title}</h2></div>
              <button type="button" onClick={() => setActiveId(null)} aria-label="Fermer le dossier">Fermer</button>
            </div>
            <div className="rx-modal-content">{active.props.children}</div>
          </section>
        </div>
      ) : null}
    </>
  );
}
