"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { ChatMessage } from "@/lib/types";

const RESPONSES: Record<string, string> = {
  dark: "Switching to dark mode — night mode activated. 🌙 Moody, sophisticated, and easy on the eyes.",
  light: "Switching to light mode — clean & editorial. ☀️ Let the beige breathe.",
  toggle: "There you go! Theme switched.",
  hello: "Hey! I'm your StyleHub stylist. Ask me about outfits, request a theme change, or just chat fashion. 👗",
  hi: "Hi there! Ready to build the perfect look today? Tell me what you need.",
  outfit: "Head over to 'Get Dressed' and I'll curate the perfect outfit for your day. I'll have something ready in seconds. ✨",
  closet: "Your closet is where the magic starts. Every piece in there is a building block for your next outfit.",
  help: "I can: switch themes (say 'dark' or 'light'), talk fashion, or guide you to the right feature. What do you need?",
  weather: "Weather really sets the tone. Layering in cool weather? Go Camel coat + beige knit. Hot day? Linen and loose cuts all the way.",
  style: "Your personal style is your visual signature. Minimal, streetwear, or formal — all roads lead to a great look.",
  minimal: "Minimalism is power through restraint. Neutral palette, clean cuts, no clutter. The most timeless aesthetic.",
  streetwear: "Streetwear = comfort meets culture. Oversized shapes, statement sneakers, and pieces with a story.",
  formal: "Formal doesn't have to be boring. A well-tailored fit with subtle details is always the loudest thing in the room.",
};

function getReply(msg: string, setTheme: (t: "light" | "dark") => void): string {
  const lower = msg.toLowerCase();

  if (lower.includes("dark")) {
    setTheme("dark");
    return RESPONSES.dark;
  }
  if (lower.includes("light")) {
    setTheme("light");
    return RESPONSES.light;
  }

  for (const [key, reply] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) return reply;
  }

  return "Great question! Style is all about intention — knowing what you want to say before you say it with clothes. What else can I help you with? 🎯";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "0",
      role: "assistant",
      content: "Hey! I'm your StyleHub stylist assistant. Ask me anything — outfits, style advice, or say 'dark' / 'light' to switch themes. 👗",
      timestamp: new Date(),
    },
  ]);
  const { setTheme } = useTheme();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    const reply = getReply(input, setTheme);
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: reply,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`chatbot-fab ${open ? "chatbot-fab-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Open stylist chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">✨</div>
              <div>
                <p className="chatbot-name">StyleHub AI</p>
                <p className="chatbot-status">● Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="chatbot-close">
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input-row">
            <div className="chatbot-theme-hints">
              <button onClick={() => { setTheme("light"); }} className="hint-btn"><Sun size={13}/> Light</button>
              <button onClick={() => { setTheme("dark"); }} className="hint-btn"><Moon size={13}/> Dark</button>
            </div>
            <div className="chatbot-input-wrap">
              <input
                className="chatbot-input"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button onClick={send} className="chatbot-send">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
