export function MountainScene({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="980" cy="168" r="54" fill="#F6E7B8" opacity="0.9" />
      <path d="M0 420L220 250L390 360L560 180L780 340L980 150L1200 310L1440 200V720H0V420Z" fill="#C5D4E8" />
      <path d="M0 480L180 340L340 430L520 280L740 410L960 250L1180 390L1440 300V720H0V480Z" fill="#7A9BC4" />
      <path d="M0 560L160 430L320 510L500 370L700 500L920 360L1140 490L1440 400V720H0V560Z" fill="#4A6FA5" />
      <path d="M0 620C180 540 320 600 480 520C640 440 780 560 960 500C1140 440 1280 540 1440 500V720H0V620Z" fill="#245240" />
      <path d="M0 660C200 600 360 640 520 590C680 540 860 630 1040 590C1220 550 1320 610 1440 580V720H0V660Z" fill="#1B3A2F" />
      <g fill="#12261D">
        <path d="M120 560L145 490L170 560H120Z" />
        <path d="M210 570L240 480L270 570H210Z" />
        <path d="M1180 540L1215 450L1250 540H1180Z" />
        <path d="M1280 555L1308 475L1336 555H1280Z" />
      </g>
      <rect x="686" y="508" width="78" height="62" rx="3" fill="#6B4423" />
      <path d="M674 508L725 466L776 508H674Z" fill="#3D2914" />
      <rect x="716" y="538" width="16" height="32" fill="#EDE4D4" />
      <rect x="698" y="522" width="14" height="12" fill="#C5D4E8" />
      <rect x="738" y="522" width="14" height="12" fill="#C5D4E8" />
    </svg>
  );
}

export function RoomIllustration({
  variant,
}: {
  variant: "deluxe" | "valley" | "family" | "default";
}) {
  const skies = {
    deluxe: ["#EDE4D4", "#7A9BC4"],
    valley: ["#C5D4E8", "#4A6FA5"],
    family: ["#E8D5B0", "#245240"],
    default: ["#F6F0E6", "#2C3E5A"],
  } as const;
  const [near, far] = skies[variant];

  return (
    <svg viewBox="0 0 640 360" className="h-full w-full" aria-hidden="true">
      <rect width="640" height="360" fill={far} />
      <circle cx="480" cy="80" r="36" fill="#F6E7B8" />
      <path d="M0 160L140 90L250 150L380 60L520 140L640 80V360H0V160Z" fill={near} />
      <path d="M0 230C90 190 180 220 280 180C380 140 470 210 640 170V360H0V230Z" fill="#1B3A2F" />
      <rect x="240" y="190" width="160" height="110" fill="#6B4423" />
      <path d="M220 190L320 130L420 190H220Z" fill="#3D2914" />
      <rect x="300" y="240" width="22" height="60" fill="#EDE4D4" />
      <rect x="258" y="214" width="28" height="22" fill="#C5D4E8" />
      <rect x="354" y="214" width="28" height="22" fill="#C5D4E8" />
    </svg>
  );
}
