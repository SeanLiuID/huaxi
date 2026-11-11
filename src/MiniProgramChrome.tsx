import { ChevronLeft } from "./icons";

/**
 * Compact app header. The safe-area padding is the only status-bar treatment:
 * the host mini program supplies its own time, signal and capsule UI.
 */
export function MiniProgramHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="relative z-30 bg-[#f7f5f2]/95 px-4 pb-2 pt-[max(env(safe-area-inset-top),20px)] backdrop-blur-xl">
      <div className="flex h-11 items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="-ml-2 mr-1 grid size-9 shrink-0 place-items-center rounded-full text-[#423d39] active:bg-black/5"
            aria-label="返回"
          >
            <ChevronLeft />
          </button>
        )}
        <span className="shrink-0 text-[15px] font-bold text-[#a7243f]">华熙再青春</span>
        <span className="mx-2 h-4 w-px shrink-0 bg-[#d8d1cb]" />
        <span className="truncate text-[15px] font-semibold text-[#292522]">{title}</span>
      </div>
    </header>
  );
}
