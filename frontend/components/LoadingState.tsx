"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { icon: "👗", text: "Scanning your wardrobe..." },
  { icon: "🌤️", text: "Checking the forecast..." },
  { icon: "✨", text: "Consulting your style profile..." },
  { icon: "🎨", text: "Curating the perfect look..." },
];

export default function LoadingState() {
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 900);

    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);

    return () => {
      clearInterval(stepTimer);
      clearInterval(dotTimer);
    };
  }, []);

  return (
    <div className="loading-state">
      <div className="loading-icon-ring">
        <span className="loading-emoji">{STEPS[step].icon}</span>
      </div>
      <p className="loading-text">
        {STEPS[step].text}
        <span className="loading-dots">{dots}</span>
      </p>
      <div className="loading-bar-track">
        <div
          className="loading-bar-fill"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
