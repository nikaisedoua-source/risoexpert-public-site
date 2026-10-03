"use client";

import { ReactNode, useEffect, useState } from "react";

type FolderSectionProps = {
  id: string;
  index: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function FolderSection({ id, index, title, description, children }: FolderSectionProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const revealFolder = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };
    revealFolder();
    window.addEventListener("hashchange", revealFolder);
    return () => window.removeEventListener("hashchange", revealFolder);
  }, [id]);

  return (
    <section className="folderSection shell" id={id}>
      <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
        <summary>
          <span className="folderTab" aria-hidden="true"><i /> <b>{index}</b></span>
          <span className="folderTitle"><strong>{title}</strong><small>{description}</small></span>
          <span className="folderState" aria-hidden="true">{open ? "Refermer" : "Ouvrir"}<i /></span>
        </summary>
        <div className="folderContent">{children}</div>
      </details>
    </section>
  );
}
