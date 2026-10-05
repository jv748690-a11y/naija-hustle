"use client";
import { useState } from "react";

const GOALS = [
  { id: "tech", label: "Tech", emoji: "💻" },
  { id: "fashion", label: "Fashion", emoji: "👗" },
  { id: "music", label: "Music", emoji: "🎤" },
  { id: "business", label: "Business", emoji: "💼" },
  { id: "content", label: "Content Creation", emoji: "🎬" },
  { id: "career", label: "Job Hunt", emoji: "📄" },
];

const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function Home() {
  const [goal, setGoal] = useState<string | null>(null);
  const [city, setCity] = useState("");

  return (
    <main className="min-h-screen bg-yellow-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-8">Naija Hustle</h1>
      <p className="text-gray-600 mt-2 mb-6">What are you hustling for?</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {GOALS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGoal(g.id)}
            className={`p-4 rounded-2xl border-2 text-left ${
              goal === g.id
                ? "border-green-600 bg-green-100"
                : "border-gray-300 bg-white"
            }`}
          >
            <div className="text-3xl">{g.emoji}</div>
            <div className="font-semibold mt-1">{g.label}</div>
          </button>
        ))}
      </div>

      <p className="text-gray-600 mt-8 mb-3">Which state are you repping?</p>
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full max-w-md p-3 rounded-2xl border-2 border-gray-300 bg-white font-semibold"
      >
        <option value="">Choose your state</option>
        {STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        disabled={!goal || !city}
        onClick={() => {
          localStorage.setItem("goal", goal!);
          localStorage.setItem("city", city);
          window.location.href = "/game";
        }}
        className="mt-8 w-full max-w-md py-3 rounded-2xl bg-green-600 text-white font-bold disabled:opacity-40"
      >
        Start hustling
      </button>
    </main>
  );
}