import type { AreaId } from "./data";
import bone from "./assets/health/bone.png";
import brain from "./assets/health/brain.png";
import eye from "./assets/health/eye.png";
import gut from "./assets/health/gut.png";
import heart from "./assets/health/heart.png";
import repro from "./assets/health/repro.png";
import skin from "./assets/health/skin.png";

const icons: Record<AreaId, string> = { brain, eye, skin, heart, gut, repro, bone };

export function AreaIcon({ id, className = "size-6" }: { id: AreaId; className?: string }) {
  return (
    <img
      src={icons[id]}
      alt=""
      className={`${className} rounded-full object-contain`}
      aria-hidden
    />
  );
}

export function ChevronLeft({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function ChevronRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function PlusIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function XIcon({ className = "size-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
