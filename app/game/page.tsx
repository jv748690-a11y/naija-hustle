"use client";
import { useEffect, useState } from "react";

type Ev = { text: string; money: number; hours: number };

const ACTIONS = [
  { label: "Work your job", hours: 4, money: 3000 },
  { label: "Side hustle", hours: 2, money: 1500 },
  { label: "Chop (eat)", hours: 1, money: -800 },
  { label: "Hang with friends", hours: 2, money: -1000 },
];

const EVENTS: Ev[] = [
  { text: "NEPA took light. You bought fuel for the generator.", money: -1000, hours: 0 },
  { text: "Fuel scarcity! Transport cost you extra.", money: -1500, hours: 0 },
  { text: "Heavy rain flooded the road. You lost 2 hours.", money: 0, hours: -2 },
  { text: "A friend sent you a gig. Easy cash!", money: 2500, hours: 0 },
  { text: "Police checkpoint. You settled small to move on.", money: -500, hours: 0 },
];

const STATE_EVENTS: Record<string, Ev[]> = {
  Lagos: [
    { text: "Third Mainland Bridge traffic ate 3 hours of your day.", money: 0, hours: -3 },
    { text: "Danfo conductor said no change, so you lost small money.", money: -300, hours: 0 },
  ],
  "FCT Abuja": [
    { text: "Abuja taxi fare doubled after the rain.", money: -1200, hours: 0 },
    { text: "A Wuse 2 client paid you well for a quick job.", money: 3000, hours: 0 },
  ],
  Rivers: [
    { text: "Port Harcourt flood blocked your route. You lost 2 hours.", money: 0, hours: -2 },
    { text: "Your PH plug hooked you up with a good deal.", money: 2000, hours: 0 },
  ],
  Kano: [
    { text: "Kano market day brought plenty customers to you.", money: 2500, hours: 0 },
    { text: "Harmattan dust slowed everything down. You lost 1 hour.", money: 0, hours: -1 },
  ],
};

export default function Game() {
  const [goal, setGoal] = useState("");
  const [city, setCity] = useState("");
  const [day, setDay] = useState(1);
  const [balance, setBalance] = useState(20000);
  const [hours, setHours] = useState(8);
  const [msg, setMsg] = useState("Your Naija hustle starts now.");
  const [card, setCard] = useState<{ day: number; balance: number; text: string } | null>(null);
  const [broke, setBroke] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setGoal(localStorage.getItem("goal") || "");
    setCity(localStorage.getItem("city") || "");
  }, []);

  function act(a: (typeof ACTIONS)[number]) {
    setHours(hours - a.hours);
    setBalance(balance + a.money);
    setMsg(`${a.label}: ${a.money >= 0 ? "+" : "-"}₦${Math.abs(a.money).toLocaleString()}`);
  }

  function endDay() {
    let newBalance = balance - 1500;
    let newHours = 8;
    let text = "Transport and bills took ₦1,500.";

    if (Math.random() < 0.7) {
      const pool = [...EVENTS, ...(STATE_EVENTS[city] || [])];
      const ev = pool[Math.floor(Math.random() * pool.length)];
      newBalance += ev.money;
      newHours += ev.hours;
      text += " " + ev.text;
    }

    setCard({ day, balance: newBalance, text });
    setBalance(newBalance);
    setHours(newHours);
    setDay(day + 1);
    setMsg(text);
    setCopied(false);

    if (newBalance <= 0) setBroke(true);
  }

  function restart() {
    setDay(1);
    setBalance(20000);
    setHours(8);
    setMsg("Fresh start. Your Naija hustle begins again.");
    setCard(null);
    setBroke(false);
  }

  function cardMessage() {
    if (!card) return "";
    return `Naija Hustle (${city}), Day ${card.day}: ${card.text} I have ₦${card.balance.toLocaleString()} left. Still hustling!`;
  }

  async function shareText(message: string) {
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
      } catch {}
      return;
    }
    window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank");
  }

  function shareX() {
    window.open("https://x.com/intent/post?text=" + encodeURIComponent(cardMessage()), "_blank");
  }

  async function copyText() {
    await navigator.clipboard.writeText(cardMessage());
    setCopied(true);
  }

  if (broke) {
    return (
      <main className="min-h-screen bg-red-50 p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-red-700">You are broke!</h1>
        <p className="mt-2 text-gray-700 text-center">
          You lasted {day - 1} {day - 1 === 1 ? "day" : "days"} in {city}.
        </p>
        <p className="mt-1 text-gray-500 text-center">{msg}</p>
        <button
          onClick={() =>
            shareText(`I went broke on Day ${day - 1} in Naija Hustle (${city}). Can you last longer than me?`)
          }
          className="mt-6 w-full max-w-md py-3 rounded-2xl bg-white border-2 border-red-300 text-red-700 font-bold"
        >
          Challenge a friend
        </button>
        <button
          onClick={restart}
          className="mt-3 w-full max-w-md py-3 rounded-2xl bg-green-600 text-white font-bold"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-8">Day {day}</h1>
      <p className="text-gray-600 capitalize">
        {city} | {goal}
      </p>

      <div className="mt-6 p-6 rounded-2xl bg-white border-2 border-gray-300 w-full max-w-md text-center">
        <p className="text-gray-500">Your balance</p>
        <p className="text-4xl font-bold text-green-600">₦{balance.toLocaleString()}</p>
        <p className="text-gray-500 mt-2">Hours left today: {hours}</p>
      </div>

      <p className="mt-4 text-center text-gray-700">{msg}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 w-full max-w-md">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            disabled={hours < a.hours}
            onClick={() => act(a)}
            className="p-4 rounded-2xl border-2 border-gray-300 bg-white text-left disabled:opacity-40"
          >
            <span className="font-semibold">{a.label}</span>
            <span className="text-gray-500 text-sm"> ({a.hours}h)</span>
          </button>
        ))}
      </div>

      <button
        onClick={endDay}
        className="mt-6 w-full max-w-md py-3 rounded-2xl bg-green-600 text-white font-bold"
      >
        End day
      </button>

      {card && (
        <div className="mt-6 w-full max-w-md rounded-2xl bg-green-700 text-white p-5">
          <p className="text-sm opacity-80">Naija Hustle | {city}</p>
          <p className="text-xl font-bold mt-1">Day {card.day}</p>
          <p className="mt-2">{card.text}</p>
          <p className="mt-3 text-2xl font-bold">₦{card.balance.toLocaleString()} left</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => shareText(cardMessage())}
              className="py-2 rounded-xl bg-white text-green-700 font-bold"
            >
              Share
            </button>
            <button
              onClick={shareX}
              className="py-2 rounded-xl bg-white text-green-700 font-bold"
            >
              X
            </button>
            <button
              onClick={copyText}
              className="py-2 rounded-xl bg-white text-green-700 font-bold"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}