import { AREAS, STATUS_META, UNMARKED_COLOR, type AreaId, type Records } from "./data";
import bodyImage from "./assets/health/reference-body.png";
import { AreaIcon } from "./icons";

// Stage coordinate system shared by the SVG and the absolutely positioned labels.
const VW = 370;
const VH = 540;
const BODY_W = 218;
const BODY_H = 487;
const OX = 0;
const OY = 20;
const LX = 254; // extra clearance keeps the right hand visible
const LABEL_Y = [44, 114, 184, 254, 334, 408, 482];

const toStage = ([x, y]: [number, number]): [number, number] => [
  OX + (x / 218) * BODY_W,
  OY + (y / 462) * BODY_H,
];
const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export function BodyMap({
  records,
  onSelect,
}: {
  records: Records;
  onSelect: (id: AreaId) => void;
}) {
  return (
    <div className="@container relative w-full" style={{ aspectRatio: `${VW} / ${VH}` }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="absolute inset-0 size-full overflow-visible"
        aria-hidden
      >
        <defs>
          <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Extracted directly from the supplied reference; screen blending removes its dark rectangular field. */}
        <image
          href={bodyImage}
          x={OX}
          y={OY}
          width={BODY_W}
          height={BODY_H}
          preserveAspectRatio="none"
        />

        {/* leader lines */}
        {AREAS.map((a, i) => {
          const ly = LABEL_Y[i];
          const pts = a.spots.map(toStage);
          // multi-spot areas (e.g. both knees) chain through each spot before heading to the label
          const d =
            `M${pts.map(([x, y]) => `${x} ${y}`).join(" L")}` +
            ` L${LX - 12} ${ly} L${LX - 2} ${ly}`;
          const status = records[a.id]?.status;
          const color = status ? STATUS_META[status].color : "#a7243f";
          const isIssue = status === "issue";
          return (
            <g key={a.id}>
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeOpacity={isIssue ? "0.9" : "0.55"}
                strokeWidth={isIssue ? "1.5" : "0.85"}
              />
              <circle cx={LX - 2} cy={ly} r={isIssue ? "2.5" : "1.6"} fill={color} />
            </g>
          );
        })}

        {/* hotspots */}
        {AREAS.flatMap((a, ai) =>
          a.spots.map((spot, si) => {
            const [x, y] = toStage(spot);
            const status = records[a.id]?.status;
            const color = status ? STATUS_META[status].color : UNMARKED_COLOR;
            const isIssue = status === "issue";
            return (
              <g key={`${a.id}-${si}`}>
                {isIssue && (
                  <circle cx={x} cy={y} r="11" fill={`${color}22`} stroke={color} strokeWidth="2" />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="none"
                  stroke={color}
                  strokeWidth="1.2"
                  className="pulse-ring"
                  style={{ animationDelay: `${ai * 0.3}s` }}
                />
                <circle cx={x} cy={y} r="7" fill={color} filter="url(#dotGlow)" opacity="0.9" />
                <circle cx={x} cy={y} r="3" fill="#fff" />
              </g>
            );
          }),
        )}
      </svg>

      {/* tap targets on the body */}
      {AREAS.flatMap((a) =>
        a.spots.map((spot, si) => {
          const [x, y] = toStage(spot);
          return (
            <button
              key={`${a.id}-hit-${si}`}
              onClick={() => onSelect(a.id)}
              aria-label={a.zh}
              className="absolute size-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: pct(x, VW), top: pct(y, VH) }}
            />
          );
        }),
      )}

      {/* labels */}
      {AREAS.map((a, i) => {
        const status = records[a.id]?.status;
        const m = status ? STATUS_META[status] : null;
        const count = records[a.id]?.problems.length ?? 0;
        const isIssue = status === "issue";
        const isUnrecorded = !status;
        return (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className={`fade-up group absolute flex -translate-y-1/2 items-center gap-[1.8cqw] rounded-[3cqw] py-[1cqw] pr-[1cqw] text-left transition active:scale-[0.97] ${
              isIssue
                ? "bg-[#fff0f2] ring-1 ring-[#b32c47]/25 shadow-[0_3px_12px_rgba(179,44,71,.12)]"
                : "active:bg-[#fbf0f2]"
            }`}
            style={{
              left: pct(LX, VW),
              top: pct(LABEL_Y[i], VH),
              width: pct(VW - LX, VW),
              animationDelay: `${120 + i * 60}ms`,
            }}
          >
            <span
              className={`grid size-[9.5cqw] shrink-0 place-items-center rounded-full border bg-white ${
                isIssue
                  ? "border-[#b32c47] shadow-[0_0_0_2px_rgba(179,44,71,.12),0_3px_12px_rgba(179,44,71,.22)]"
                  : isUnrecorded
                    ? "border-[#dfb7c0] shadow-[0_3px_10px_rgba(167,36,63,.08)]"
                    : "border-[#dcd6d1] shadow-[0_3px_10px_rgba(49,39,32,.08)]"
              }`}
            >
              <AreaIcon id={a.id} className="size-[8.2cqw]" />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className="block truncate text-[3.7cqw] font-semibold leading-tight"
                style={{ color: isIssue ? "#b32c47" : isUnrecorded ? "#a7243f" : "#4a4440" }}
              >
                {a.zh}
              </span>
              <span className="block truncate text-[2.3cqw] leading-tight text-[#918a84]">
                {a.en.replace(" Health", "").replace(" and ", " & ")}
              </span>
              <span className="mt-[0.7cqw] flex items-center gap-[1cqw] text-[2.7cqw] leading-none">
                {isUnrecorded ? (
                  <span className="rounded-full bg-[#fbecf0] px-[1.5cqw] py-[0.8cqw] font-medium text-[#a7243f]">
                    ＋ 点击录入
                  </span>
                ) : isIssue ? (
                  <span className="rounded-full bg-[#b32c47] px-[1.5cqw] py-[0.8cqw] font-medium text-white">
                    ! 有问题{count > 0 ? ` · ${count}` : ""}
                  </span>
                ) : (
                  <>
                    <span
                      className="size-[1.6cqw] shrink-0 rounded-full"
                      style={{ background: m?.color }}
                    />
                    <span style={{ color: m?.color }}>{m?.label}</span>
                    {count > 0 && <span className="text-[#99918c]">· {count}项</span>}
                  </>
                )}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
