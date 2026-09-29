"use client";

import { FormEvent, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onResponse: (response: string) => void;
};

export async function sendMessage(message: string) {
  const question = message.toLowerCase();
  if (question.includes("hotel")) return "Yes. I can help find options that match your trip and company policy.";
  if (question.includes("cancel") || question.includes("flight")) return "I can help manage flights and disruptions, and connect you with support when needed.";
  if (question.includes("tavo")) return "TAVO can call restaurants, hotels and service providers on your behalf.";
  if (question.includes("taco") || question.includes("support")) return "TACO helps connect you with human support when you need assistance.";
  return "I can help you plan, book and manage your business trip.";
}

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5c.32 3.4 1.06 5.7 2.22 6.86 1.16 1.16 3.46 1.9 6.86 2.22-3.4.32-5.7 1.06-6.86 2.22-1.16 1.16-1.9 3.46-2.22 6.86-.32-3.4-1.06-5.7-2.22-6.86-1.16-1.16-3.46-1.9-6.86-2.22 3.4-.32 5.7-1.06 6.86-2.22C10.94 8.2 11.68 5.9 12 2.5Z" />
    </svg>
  );
}

export function MiraiInput({ value, onChange, onResponse }: Props) {
  const [listening, setListening] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim()) return;
    const question = value;
    onChange("");
    onResponse(await sendMessage(question));
  }

  return (
    <form
      className="flex items-center gap-2.5 w-full py-2.5 pr-2.5 pl-6 border border-[rgba(29,22,36,.1)] rounded-full bg-white/94 shadow-[0_26px_60px_-16px_rgba(40,29,53,.3)] backdrop-blur-[18px] max-md:pl-4"
      onSubmit={submit}
    >
      <SparkleIcon className="flex-none size-[18px] text-brand max-md:size-4" />
      <label className="sr-only" htmlFor="mirai-question">Ask Miraee about your trip</label>
      <input
        id="mirai-question"
        className="flex-1 min-w-0 border-0 outline-0 bg-transparent text-ink text-[16px] placeholder:text-[#918b95] max-md:text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={listening ? "Listening..." : "Ask Miraee anything about your trip..."}
      />
      <button
        className={`flex-none grid place-items-center w-[46px] h-[46px] border-0 rounded-full cursor-pointer transition-colors max-md:w-[38px] max-md:h-[38px] ${listening ? "bg-lavender text-brand" : "bg-[#f0edf2] text-[#7d7581]"}`}
        type="button"
        aria-pressed={listening}
        onClick={() => setListening(!listening)}
        aria-label={listening ? "Stop listening" : "Start voice input"}
      >
        {listening ? (
          <span className="h-[15px] flex items-center gap-0.5">
            <i className="w-0.5 h-[5px] bg-current rounded animate-waveform" />
            <i className="w-0.5 h-3 bg-current rounded animate-waveform [animation-delay:.15s]" />
            <i className="w-0.5 h-[5px] bg-current rounded animate-waveform [animation-delay:.3s]" />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-[18px]" aria-hidden="true">
            <rect x="9" y="2.5" width="6" height="11" rx="3" />
            <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
            <path d="M12 17.5v3.5M9 21h6" />
          </svg>
        )}
      </button>
      <button
        className="flex-none grid place-items-center w-[46px] h-[46px] border-0 rounded-full cursor-pointer bg-brand text-white shadow-[0_10px_22px_-6px_color-mix(in_srgb,var(--color-brand)_65%,transparent)] max-md:w-[38px] max-md:h-[38px]"
        type="submit"
        aria-label="Send message"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-[18px]" aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </button>
    </form>
  );
}
