import { useState } from "react";
import {
  STATUS_META,
  emptyRecord,
  formatDate,
  type Area,
  type AreaRecord,
  type Status,
} from "./data";
import { AreaIcon, PlusIcon, XIcon } from "./icons";
import { MiniProgramHeader } from "./MiniProgramChrome";

export function AreaDetail({
  area,
  memberName,
  record,
  onBack,
  onSave,
}: {
  area: Area;
  memberName?: string;
  record?: AreaRecord;
  onBack: () => void;
  onSave: (r: AreaRecord) => void;
}) {
  const base = record ?? emptyRecord();
  const [status, setStatus] = useState<Status | undefined>(base.status);
  const [problems, setProblems] = useState<string[]>(base.problems);
  const [custom, setCustom] = useState<string[]>(base.custom);
  const [note, setNote] = useState(base.note);
  const [draft, setDraft] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const allProblems = [...area.problems, ...custom];
  const toggle = (p: string) =>
    setProblems((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const addCustom = () => {
    const v = draft.trim();
    if (!v) return;
    if (!allProblems.includes(v)) setCustom((c) => [...c, v]);
    setProblems((cur) => (cur.includes(v) ? cur : [...cur, v]));
    setDraft("");
  };

  const removeCustom = (p: string) => {
    setCustom((c) => c.filter((x) => x !== p));
    setProblems((cur) => cur.filter((x) => x !== p));
  };

  const save = () => {
    if (!status) return;
    const at = Date.now();
    onSave({
      status,
      problems,
      custom,
      note,
      updatedAt: at,
      history: [{ at, status, problems, note }, ...base.history].slice(0, 30),
    });
    setSavedAt(at);
    setTimeout(() => setSavedAt(null), 1800);
  };

  const accent = status ? STATUS_META[status].color : "#a7243f";

  return (
    <div className="slide-in flex min-h-dvh flex-col">
      <MiniProgramHeader title={area.zh} onBack={onBack} />

      <main className="flex-1 space-y-5 px-4 pb-28">
        {/* hero */}
        <section className="fade-up relative overflow-hidden rounded-2xl border border-[#e3ded9] bg-white p-5 shadow-[0_7px_24px_rgba(49,39,32,.045)]">
          <div
            className="absolute -right-10 -top-10 size-40 rounded-full opacity-40 blur-3xl transition-colors"
            style={{ background: accent }}
          />
          <div className="relative flex items-start gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-full border border-[#e3ded9] bg-[#faf8f6] shadow-sm">
              <AreaIcon id={area.id} className="size-14" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-[#292522]">{area.zh}</h1>
              <p className="text-sm text-[#8f8882]">{area.en}</p>
            </div>
          </div>
          <p className="relative mt-4 text-[13px] leading-relaxed text-[#625d58]">{area.desc}</p>
          {base.updatedAt && (
            <p className="relative mt-3 text-[11px] text-[#aaa39e]">
              上次记录 {formatDate(base.updatedAt)}
            </p>
          )}
          <p className="relative mt-1 text-[11px] text-[#a7243f]">
            {memberName ? `${memberName}的健康档案` : "会员健康档案"}
          </p>
        </section>

        {/* status */}
        <section
          className="fade-up rounded-2xl border border-[#e3ded9] bg-white p-4 shadow-[0_5px_18px_rgba(49,39,32,.035)]"
          style={{ animationDelay: "60ms" }}
        >
          <SectionTitle title="当前状况" sub="选择该部位的整体健康情况" />
          <div className="grid grid-cols-3 gap-2.5">
            {(Object.keys(STATUS_META) as Status[]).map((s) => {
              const m = STATUS_META[s];
              const active = status === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="rounded-2xl border px-2 py-3 text-center transition active:scale-[0.97]"
                  style={{
                    borderColor: active ? m.color : "#e3ded9",
                    background: active ? `${m.color}14` : "#fff",
                  }}
                  aria-pressed={active}
                >
                  <span
                    className="mx-auto mb-1.5 block size-2.5 rounded-full"
                    style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }}
                  />
                  <span
                    className="block text-sm font-medium"
                    style={{ color: active ? m.color : "#3f3a36" }}
                  >
                    {m.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-tight text-[#99918c]">
                    {m.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* problems */}
        <section
          className="fade-up rounded-2xl border border-[#e3ded9] bg-white p-4 shadow-[0_5px_18px_rgba(49,39,32,.035)]"
          style={{ animationDelay: "120ms" }}
        >
          <SectionTitle title="问题标记" sub={`已选择 ${problems.length} 项`} />
          <div className="flex flex-wrap gap-2">
            {allProblems.map((p) => {
              const active = problems.includes(p);
              const isCustom = custom.includes(p);
              return (
                <span
                  key={p}
                  className={`inline-flex items-center rounded-full border text-[13px] transition ${
                    active
                      ? "border-[#c98694] bg-[#fbf0f2] text-[#a7243f]"
                      : "border-[#e3ded9] bg-white text-[#625d58]"
                  }`}
                >
                  <button
                    onClick={() => toggle(p)}
                    className="py-1.5 pl-3.5 pr-3.5"
                    aria-pressed={active}
                  >
                    {p}
                  </button>
                  {isCustom && (
                    <button
                      onClick={() => removeCustom(p)}
                      className="-ml-2 mr-1.5 grid size-5 place-items-center rounded-full text-[#99918c] active:bg-black/5"
                      aria-label={`删除 ${p}`}
                    >
                      <XIcon />
                    </button>
                  )}
                </span>
              );
            })}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder="添加其他问题"
              className="min-w-0 flex-1 rounded-xl border border-[#e3ded9] bg-white px-3.5 py-2.5 text-sm text-[#292522] outline-none placeholder:text-[#aaa39e] focus:border-[#b75b6e]"
            />
            <button
              onClick={addCustom}
              disabled={!draft.trim()}
              className="grid size-[42px] place-items-center rounded-xl border border-[#d9b7bf] bg-[#fbf0f2] text-[#a7243f] disabled:opacity-40"
              aria-label="添加"
            >
              <PlusIcon />
            </button>
          </div>
        </section>

        {/* note */}
        <section
          className="fade-up rounded-2xl border border-[#e3ded9] bg-white p-4 shadow-[0_5px_18px_rgba(49,39,32,.035)]"
          style={{ animationDelay: "180ms" }}
        >
          <SectionTitle title="备注" sub="症状描述、持续时间、用药或就诊情况" />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="例如：最近两周晚上入睡困难，约 1 小时才能睡着……"
            className="w-full resize-none rounded-2xl border border-[#e3ded9] bg-white px-4 py-3 text-sm leading-relaxed text-[#292522] outline-none placeholder:text-[#aaa39e] focus:border-[#b75b6e]"
          />
        </section>

        {/* history */}
        {base.history.length > 0 && (
          <section
            className="fade-up rounded-2xl border border-[#e3ded9] bg-white p-4 shadow-[0_5px_18px_rgba(49,39,32,.035)]"
            style={{ animationDelay: "240ms" }}
          >
            <SectionTitle title="历史记录" sub={`共 ${base.history.length} 条`} />
            <ol className="relative space-y-3 border-l border-[#ddd6d0] pl-4">
              {base.history.map((h) => {
                const m = STATUS_META[h.status];
                return (
                  <li key={h.at} className="relative">
                    <span
                      className="absolute -left-[21px] top-1.5 size-2.5 rounded-full ring-4 ring-[#f7f5f2]"
                      style={{ background: m.color }}
                    />
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#99918c]">{formatDate(h.at)}</span>
                      <span style={{ color: m.color }}>{m.label}</span>
                    </div>
                    {h.problems.length > 0 && (
                      <p className="mt-1 text-[13px] text-[#3f3a36]">{h.problems.join("、")}</p>
                    )}
                    {h.note && <p className="mt-0.5 text-xs text-[#8f8882]">{h.note}</p>}
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </main>

      {/* save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-[#e3ded9] bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur-xl">
        <button
          onClick={save}
          disabled={!status}
          className="h-12 w-full rounded-md bg-[#a7243f] font-medium text-white shadow-[0_6px_18px_rgba(167,36,63,.2)] transition active:scale-[0.98] disabled:bg-[#c8c1bb] disabled:shadow-none"
        >
          {savedAt ? "已保存" : status ? "保存记录" : "请先选择当前状况"}
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-base font-semibold text-[#292522]">{title}</h2>
      {sub && <span className="text-[11px] text-[#99918c]">{sub}</span>}
    </div>
  );
}
