"use client";

export type AvatarData = {
  gender: string;
  style: string;
  skin: string;
  hair: string;
  hairColor: string;
  outfit: string;
  glasses: boolean;
  build: string;
};

export const DEFAULT_AVATAR: AvatarData = {
  gender: "male",
  style: "tee",
  skin: "#8d5524",
  hair: "short",
  hairColor: "#111111",
  outfit: "#16a34a",
  glasses: false,
  build: "average",
};

const SKINS = ["#f3d2b3", "#e0ac7e", "#c68642", "#8d5524", "#5c3a21", "#3b2416"];
const HAIRS = ["short", "afro", "braids", "long", "bald"];
const HAIR_COLORS = ["#111111", "#4a2c17", "#a0522d", "#d4a017", "#7c3aed"];
const OUTFITS = ["#16a34a", "#2563eb", "#dc2626", "#f59e0b", "#111827", "#ec4899", "#7c3aed", "#f8fafc"];
const BUILDS = [
  { id: "slim", label: "Slim", base: 17 },
  { id: "average", label: "Average", base: 21 },
  { id: "broad", label: "Broad", base: 26 },
  { id: "plus", label: "Plus size", base: 31 },
];

const STYLES: Record<string, { id: string; label: string }[]> = {
  male: [
    { id: "tee", label: "T-shirt and trousers" },
    { id: "hoodie", label: "Hoodie" },
    { id: "suit", label: "Suit" },
    { id: "native", label: "Native wear" },
  ],
  female: [
    { id: "dress", label: "Dress" },
    { id: "skirt", label: "Top and skirt" },
    { id: "tee", label: "T-shirt and trousers" },
    { id: "native", label: "Native wear" },
  ],
};

export function Avatar({ a, size = 96 }: { a: AvatarData; size?: number }) {
  const base = (BUILDS.find((b) => b.id === a.build) || BUILDS[1]).base;
  const female = a.gender === "female";
  const style = a.style || (female ? "dress" : "tee");

  const sw = female ? base * 0.8 : base * 1.05;
  const ww = female ? base * 0.62 : base * 0.9;
  const hw = female ? base * 0.98 : base * 0.9;

  const armW = Math.max(7, sw * 0.3);
  const legW = Math.max(8, hw * 0.46);
  const L = 60 - sw;
  const R = 60 + sw;

  const longSleeve = style === "hoodie" || style === "suit" || style === "native";
  const skinLegs = style === "dress" || style === "skirt" || (style === "native" && female);
  const legColor = skinLegs ? a.skin : style === "suit" ? "#111827" : "#1f2937";
  const topColor = style === "skirt" ? "#f1f5f9" : a.outfit;

  const straight = (bottom: number, wb: number) =>
    `M${L} 54 Q${L} 50 ${L + 6} 50 L${R - 6} 50 Q${R} 50 ${R} 54 L${60 + wb} ${bottom} L${60 - wb} ${bottom} Z`;

  let torso = straight(124, ww);
  if (style === "tee" || style === "hoodie" || style === "suit") {
    torso = female ? straight(120, ww * 1.05) : straight(124, ww);
  }
  if (style === "dress") {
    torso = `M${L} 54 Q${L} 50 ${L + 6} 50 L${R - 6} 50 Q${R} 50 ${R} 54 L${60 + ww} 96 L${60 + hw + 16} 152 L${60 - hw - 16} 152 L${60 - ww} 96 Z`;
  }
  if (style === "skirt") torso = straight(100, ww);
  if (style === "native") {
    torso = female
      ? `M${L} 54 Q${L} 50 ${L + 6} 50 L${R - 6} 50 Q${R} 50 ${R} 54 L${60 + ww} 96 L${60 + hw + 20} 188 L${60 - hw - 20} 188 L${60 - ww} 96 Z`
      : `M${L} 54 Q${L} 50 ${L + 6} 50 L${R - 6} 50 Q${R} 50 ${R} 54 L${60 + ww + 10} 150 L${60 - ww - 10} 150 Z`;
  }

  const top = (
    <path
      d="M30 40 Q30 18 50 18 Q70 18 70 40 Q60 30 50 30 Q40 30 30 40Z"
      fill={a.hairColor}
    />
  );

  const armLeftX = L - armW + 3;
  const armRightX = R - 3;
  const sleeveH = longSleeve ? 56 : 20;

  return (
    <svg viewBox="0 0 120 215" width={size * 0.56} height={size}>
      <rect x={armLeftX} y="53" width={armW} height="58" rx={armW / 2} fill={a.skin} />
      <rect x={armRightX} y="53" width={armW} height="58" rx={armW / 2} fill={a.skin} />
      <circle cx={armLeftX + armW / 2} cy="113" r={armW / 2 + 1} fill={a.skin} />
      <circle cx={armRightX + armW / 2} cy="113" r={armW / 2 + 1} fill={a.skin} />

      <rect x={60 - legW - 1} y="120" width={legW} height="84" rx="4" fill={legColor} />
      <rect x="61" y="120" width={legW} height="84" rx="4" fill={legColor} />
      <rect x={60 - legW - 3} y="199" width={legW + 6} height="10" rx="5" fill="#111111" />
      <rect x="59" y="199" width={legW + 6} height="10" rx="5" fill="#111111" />

      <path d={torso} fill={topColor} stroke={topColor} strokeWidth="5" strokeLinejoin="round" />

      {style === "skirt" && (
        <path
          d={`M${60 - ww - 2} 96 L${60 + ww + 2} 96 L${60 + hw + 14} 142 L${60 - hw - 14} 142 Z`}
          fill={a.outfit}
          stroke={a.outfit}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}

      <rect x={armLeftX} y="53" width={armW} height={sleeveH} rx={armW / 3} fill={topColor} />
      <rect x={armRightX} y="53" width={armW} height={sleeveH} rx={armW / 3} fill={topColor} />

      {style === "hoodie" && (
        <g>
          <ellipse cx="60" cy="52" rx="15" ry="7" fill="rgba(0,0,0,0.3)" />
          <rect x={60 - sw * 0.5} y="96" width={sw} height="14" rx="4" fill="rgba(0,0,0,0.2)" />
        </g>
      )}

      {style === "suit" && (
        <g>
          <polygon points="53,50 67,50 60,86" fill="#ffffff" />
          <polygon points="58,56 62,56 63,82 60,88 57,82" fill="#b91c1c" />
        </g>
      )}

      {style === "native" && !female && (
        <rect x="58" y="50" width="4" height="100" fill="#fbbf24" />
      )}
      {style === "native" && female && (
        <rect x={60 - (hw + 20)} y="182" width={(hw + 20) * 2} height="6" fill="#fbbf24" />
      )}

      <rect x="55" y="42" width="10" height="12" fill={a.skin} />

      <g transform="translate(60 28) scale(0.85) translate(-50 -42)">
        {a.hair === "afro" && <circle cx="50" cy="38" r="27" fill={a.hairColor} />}
        {a.hair === "long" && (
          <path
            d="M28 40 Q28 16 50 16 Q72 16 72 40 L72 72 L62 72 L62 40 L38 40 L38 72 L28 72Z"
            fill={a.hairColor}
          />
        )}
        {a.hair === "braids" && (
          <g fill={a.hairColor}>
            <rect x="28" y="40" width="5" height="34" rx="2" />
            <rect x="35" y="42" width="5" height="30" rx="2" />
            <rect x="60" y="42" width="5" height="30" rx="2" />
            <rect x="67" y="40" width="5" height="34" rx="2" />
          </g>
        )}
        <circle cx="50" cy="42" r="20" fill={a.skin} />
        <circle cx="43" cy="42" r="2" fill="#111" />
        <circle cx="57" cy="42" r="2" fill="#111" />
        <path
          d="M43 51 Q50 57 57 51"
          stroke="#111"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {a.glasses && (
          <g stroke="#111" strokeWidth="1.5" fill="none">
            <circle cx="43" cy="42" r="5.5" />
            <circle cx="57" cy="42" r="5.5" />
            <line x1="48.5" y1="42" x2="51.5" y2="42" />
          </g>
        )}
        {a.hair !== "bald" && a.hair !== "afro" && top}
        {a.hair === "afro" && (
          <path
            d="M31 38 Q34 22 50 22 Q66 22 69 38 Q60 30 50 30 Q40 30 31 38Z"
            fill={a.hairColor}
          />
        )}
      </g>
    </svg>
  );
}

function Swatches({
  colors,
  current,
  onPick,
}: {
  colors: string[];
  current: string;
  onPick: (c: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onPick(c)}
          style={{ background: c }}
          className={`h-9 w-9 rounded-full border-2 ${
            current === c ? "border-green-600 ring-2 ring-green-600" : "border-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export function AvatarBuilder({
  value,
  onChange,
}: {
  value: AvatarData;
  onChange: (a: AvatarData) => void;
}) {
  const styles = STYLES[value.gender] || STYLES.male;

  return (
    <div className="w-full max-w-md rounded-2xl border-2 border-gray-300 bg-white p-4 flex flex-col items-center gap-3">
      <Avatar a={value} size={260} />

      <p className="text-sm text-gray-500">Body type</p>
      <div className="flex gap-2 justify-center">
        {["male", "female"].map((g) => (
          <button
            key={g}
            onClick={() =>
              onChange({ ...value, gender: g, style: g === "female" ? "dress" : "tee" })
            }
            className={`px-4 py-1 rounded-full border-2 text-sm font-semibold capitalize ${
              value.gender === g ? "border-green-600 bg-green-100" : "border-gray-300"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">Body build</p>
      <div className="flex gap-2 flex-wrap justify-center">
        {BUILDS.map((b) => (
          <button
            key={b.id}
            onClick={() => onChange({ ...value, build: b.id })}
            className={`px-3 py-1 rounded-full border-2 text-sm font-semibold ${
              value.build === b.id ? "border-green-600 bg-green-100" : "border-gray-300"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">Clothing</p>
      <div className="flex gap-2 flex-wrap justify-center">
        {styles.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange({ ...value, style: s.id })}
            className={`px-3 py-1 rounded-full border-2 text-sm font-semibold ${
              value.style === s.id ? "border-green-600 bg-green-100" : "border-gray-300"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">Clothing colour</p>
      <Swatches colors={OUTFITS} current={value.outfit} onPick={(c) => onChange({ ...value, outfit: c })} />

      <p className="text-sm text-gray-500">Skin</p>
      <Swatches colors={SKINS} current={value.skin} onPick={(c) => onChange({ ...value, skin: c })} />

      <p className="text-sm text-gray-500">Hair style</p>
      <div className="flex gap-2 flex-wrap justify-center">
        {HAIRS.map((h) => (
          <button
            key={h}
            onClick={() => onChange({ ...value, hair: h })}
            className={`px-3 py-1 rounded-full border-2 text-sm font-semibold capitalize ${
              value.hair === h ? "border-green-600 bg-green-100" : "border-gray-300"
            }`}
          >
            {h}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">Hair colour</p>
      <Swatches
        colors={HAIR_COLORS}
        current={value.hairColor}
        onPick={(c) => onChange({ ...value, hairColor: c })}
      />

      <button
        onClick={() => onChange({ ...value, glasses: !value.glasses })}
        className={`px-4 py-1 rounded-full border-2 text-sm font-semibold ${
          value.glasses ? "border-green-600 bg-green-100" : "border-gray-300"
        }`}
      >
        {value.glasses ? "Glasses on" : "Glasses off"}
      </button>
    </div>
  );
}