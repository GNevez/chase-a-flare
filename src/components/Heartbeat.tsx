"use client";
import { useEffect } from "react";
import { apiRequest } from "@/lib/api";

function getOrCreateClientId() {
  try {
    const key = "caf_client_id";
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `${Date.now()}-${Math.random()}`;
  }
}

export default function Heartbeat() {
  useEffect(() => {
    const clientId = getOrCreateClientId();

    const send = async () => {
      try {
        await apiRequest.post("/api/Dashboard/heartbeat", { clientId });
      } catch (e) {
        // silent
      }
    };

    // initial ping and interval
    send();
    const id = setInterval(send, 30000); // 30s
    const disconnect = () => {
      try {
        const body = JSON.stringify({ clientId });
        const url = `${(window as any).API_BASE_URL ?? ""}/api/Dashboard/disconnect`;
        // Use sendBeacon if available
        if (navigator.sendBeacon) {
          const blob = new Blob([body], { type: "application/json" });
          navigator.sendBeacon("/api/Dashboard/disconnect", blob);
        } else {
          // Fallback to fetch keepalive
          fetch("/api/Dashboard/disconnect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
    };

    window.addEventListener("beforeunload", disconnect);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") disconnect();
    });

    return () => {
      clearInterval(id);
      window.removeEventListener("beforeunload", disconnect);
    };
  }, []);

  return null;
}
