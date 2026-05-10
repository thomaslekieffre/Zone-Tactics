import { cn } from "@/lib/utils";

export function BasketballIcon({
  className,
  spinning = false,
  style,
}: {
  className?: string;
  spinning?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={cn(
        "shrink-0",
        spinning && "animate-[spin_4s_linear_infinite]",
        className,
      )}
    >
      <circle cx="12" cy="12" r="10" fill="#f97316" />
      <path
        d="M2 12h20"
        stroke="#0a0a0a"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 2v20"
        stroke="#0a0a0a"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M4.93 4.93C7.5 7.5 9 9.5 9 12s-1.5 4.5-4.07 7.07"
        stroke="#0a0a0a"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19.07 4.93C16.5 7.5 15 9.5 15 12s1.5 4.5 4.07 7.07"
        stroke="#0a0a0a"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="#0a0a0a"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
