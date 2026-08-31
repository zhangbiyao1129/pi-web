"use client";

import { useState } from "react";
import { AnsiText } from "./AnsiText";
import { sanitizeExtensionStatusText } from "./ExtensionStatusBar";
import { ExtensionWidgets } from "./ExtensionWidgets";
import type { ExtensionStatusItem, ExtensionWidgetItem } from "@/lib/types";

/**
 * Collapsed status shelf for extension statuses (e.g. "cbm", "todo").
 * Renders one small chip per status key at the top of the chat area;
 * clicking a chip expands it to show the full status text.
 */
export function ExtensionStatusCollapse({
  statuses,
  widgets = [],
}: {
  statuses: ExtensionStatusItem[];
  widgets?: ExtensionWidgetItem[];
}) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set());

  if (statuses.length === 0 && widgets.length === 0) return null;

  const toggle = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div
      className="extension-status-collapse"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        padding: "6px 12px",
        alignItems: "flex-start",
      }}
    >
      {widgets.length > 0 && (
        <div className="extension-status-collapse-widgets">
          <ExtensionWidgets widgets={widgets} />
        </div>
      )}
      {statuses.map((s) => {
        const expanded = expandedKeys.has(s.key);
        return (
          <div key={s.key} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <button
              type="button"
              onClick={() => toggle(s.key)}
              aria-expanded={expanded}
              title={expanded ? `${s.key}: collapse` : `${s.key}: expand`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                minWidth: 72,
                height: 30,
                padding: "2px 8px",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                lineHeight: 1.2,
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: expanded ? "var(--bg-selected)" : "none",
                color: expanded ? "var(--text)" : "var(--text-muted)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(event) => {
                if (!expanded) event.currentTarget.style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = expanded ? "var(--bg-selected)" : "none";
              }}
            >
              <span>{s.key}</span>
              <span style={{ fontSize: 8, opacity: 0.7 }}>{expanded ? "▾" : "▸"}</span>
            </button>
            {expanded && (
              <div
                className="extension-status-collapse-detail"
                style={{
                  padding: "5px 9px",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  background: "var(--bg-panel)",
                  maxWidth: "min(560px, calc(100vw - 40px))",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                <AnsiText text={sanitizeExtensionStatusText(s.text)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
