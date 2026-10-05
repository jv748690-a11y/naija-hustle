"use client";
import { useState } from "react";
import { AvatarBuilder, AvatarData, DEFAULT_AVATAR } from "./Avatar";

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

function resizeToSquare(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject();
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject();
      img.onload = () => {
        const size = 200;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject();
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [goal, setGoal] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [avatar, setAvatar] = useState<AvatarData>(DEFAULT_AVATAR);
  const [mode, setMode] = useState<"avatar" | "photo">("avatar");
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhoto(await resizeToSquare(file));
      setPhotoError("");
    } catch {
      setPhotoError("That file could not be read. Try a different photo.");
    }
  }

  return (
    <main className="min-h-screen bg-yellow-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-8">Naija Hustle</h1>

      <p className="text-gray-600 mt-2 mb-3">Who are you in the game?</p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-4">
        <button
          onClick={() => setMode("avatar")}
          className={`py-3 rounded-2xl border-2 font-semibold ${
            mode === "avatar" ? "border-green-600 bg-green-100" : "border-gray-300 bg-white"
          }`}
        >
          Build a character
        </button>
        <button
          onClick={() => setMode("photo")}
          className={`py-3 rounded-2xl border-2 font-semibold ${
            mode === "photo" ? "border-green-600 bg-green-100" : "border-gray-300 bg-white"
          }`}
        >
          Use my photo
        </button>
      </div>

      {mode === "avatar" && <AvatarBuilder value={avatar} onChange={setAvatar} />}

      {mode === "photo" && (
        <div className="w-full max-w-md rounded-2xl border-2 border-gray-300 bg-white p-4 flex flex-col items-center gap-3">
          {photo ? (
            <img
              src={photo}
              alt="Your photo"
              className="h-40 w-40 rounded-full object-cover border-4 border-green-600"
            />
          ) : (
            <div className="h-40 w-40 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-center text-sm p-4">
              No photo yet
            </div>
          )}

          <label className="w-full py-2 rounded-xl bg-green-600 text-white font-bold text-center cursor-pointer">
            {photo ? "Change photo" : "Choose a photo"}
            <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
          </label>

          {photo && (
            <button
              onClick={() => setPhoto("")}
              className="text-sm text-gray-500 underline"
            >
              Remove photo
            </button>
          )}

          {photoError && <p className="text-sm text-red-700 text-center">{photoError}</p>}

          <p className="text-xs text-gray-500 text-center">
            Your photo stays on this device for now. It is not uploaded anywhere.
          </p>
        </div>
      )}

      <p className="text-gray-600 mt-8 mb-3">What are you hustling for?</p>
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
        disabled={!goal || !city || (mode === "photo" && !photo)}
        onClick={() => {
          localStorage.setItem("goal", goal!);
          localStorage.setItem("city", city);
          localStorage.setItem("avatar", JSON.stringify(avatar));
          localStorage.setItem("avatarMode", mode);
          if (mode === "photo") localStorage.setItem("photo", photo);
          else localStorage.removeItem("photo");
          window.location.href = "/game";
        }}
        className="mt-8 w-full max-w-md py-3 rounded-2xl bg-green-600 text-white font-bold disabled:opacity-40"
      >
        Start hustling
      </button>
    </main>
  );
}
