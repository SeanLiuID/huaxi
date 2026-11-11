import { useState, type ReactNode } from "react";
import guideBody from "./assets/health/reference-body.png";
import { AreaDetail } from "./AreaDetail";
import { BodyMap } from "./BodyMap";
import { MemberCard, MemberEditor, MemberList, ProfileView } from "./MemberViews";
import { MiniProgramHeader } from "./MiniProgramChrome";
import { AREAS, type AreaId, type AreaRecord, type Records } from "./data";
import { loadArchiveState, saveArchiveState, type ArchiveState, type Member } from "./members";

type View = "guide" | "health" | "profile" | "members" | "editor" | "area";

export default function App() {
  const [archive, setArchive] = useState<ArchiveState>(loadArchiveState);
  const [navigation, setNavigation] = useState<View[]>(["guide"]);
  const [activeArea, setActiveArea] = useState<AreaId | null>(null);
  const [editing, setEditing] = useState<Member | undefined>();
  const [isNew, setIsNew] = useState(false);

  const view = navigation[navigation.length - 1];
  const member = archive.members.find((m) => m.id === archive.selectedId) ?? archive.members[0];
  const records = archive.recordsByMember[member.id] ?? {};
  const area = AREAS.find((a) => a.id === activeArea);

  const navigate = (next: View) => {
    setNavigation((current) => [...current, next]);
    window.scrollTo(0, 0);
  };

  const replaceCurrent = (next: View) => {
    setNavigation((current) => [...current.slice(0, -1), next]);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setNavigation((current) => (current.length > 1 ? current.slice(0, -1) : current));
    window.scrollTo(0, 0);
  };

  const goToMemberRoot = () => {
    setActiveArea(null);
    setEditing(undefined);
    setNavigation(["guide"]);
    window.scrollTo(0, 0);
  };

  const commit = (updater: (current: ArchiveState) => ArchiveState) => {
    setArchive((current) => {
      const next = updater(current);
      saveArchiveState(next);
      return next;
    });
  };

  const updateHealth = (id: AreaId, record: AreaRecord) => {
    commit((current) => ({
      ...current,
      recordsByMember: {
        ...current.recordsByMember,
        [member.id]: { ...(current.recordsByMember[member.id] ?? {}), [id]: record },
      },
      members: current.members.map((m) =>
        m.id === member.id ? { ...m, updatedAt: Date.now() } : m,
      ),
    }));
  };

  const saveMember = (saved: Member) => {
    commit((current) => {
      const exists = current.members.some((m) => m.id === saved.id);
      return {
        ...current,
        selectedId: saved.id,
        members: exists
          ? current.members.map((m) => (m.id === saved.id ? saved : m))
          : [saved, ...current.members],
        recordsByMember: exists
          ? current.recordsByMember
          : { ...current.recordsByMember, [saved.id]: {} },
      };
    });
    setEditing(undefined);
    if (isNew) replaceCurrent("health");
    else goBack();
  };

  const selectMember = (selected: Member) => {
    commit((current) => ({ ...current, selectedId: selected.id }));
    navigate("profile");
  };

  const startCreate = () => {
    setEditing(undefined);
    setIsNew(true);
    navigate("editor");
  };

  const startEdit = () => {
    setEditing(member);
    setIsNew(false);
    navigate("editor");
  };

  return (
    <div className="relative mx-auto min-h-dvh max-w-[480px] overflow-x-hidden bg-[#f7f5f2] text-[#282421]">
      <div>
        {view === "area" && area ? (
          <AreaDetail
            key={`${member.id}-${area.id}`}
            area={area}
            memberName={member.name}
            record={records[area.id]}
            onBack={() => {
              setActiveArea(null);
              goBack();
            }}
            onSave={(record) => updateHealth(area.id, record)}
          />
        ) : view === "guide" ? (
          <GuideHome
            member={member}
            memberCount={archive.members.length}
            onStart={startCreate}
            onOpenMembers={() => navigate("members")}
            onContinue={() => navigate("health")}
          />
        ) : view === "health" ? (
          <HealthHome
            member={member}
            records={records}
            onBack={goBack}
            onOpenArea={(id) => {
              setActiveArea(id);
              navigate("area");
            }}
            onOpenProfile={() => navigate("profile")}
          />
        ) : view === "profile" ? (
          <ProfileView
            member={member}
            records={records}
            onBack={goBack}
            onEdit={startEdit}
            onHealth={() => navigate("health")}
          />
        ) : view === "members" ? (
          <MemberList
            members={[...archive.members].sort((a, b) => b.updatedAt - a.updatedAt)}
            selectedId={member.id}
            recordsByMember={archive.recordsByMember}
            onBack={goBack}
            onSelect={selectMember}
            onCreate={startCreate}
          />
        ) : (
          <MemberEditor member={editing} isNew={isNew} onCancel={goBack} onSave={saveMember} />
        )}
      </div>
      {view !== "editor" && view !== "area" && <MemberManagementTab onSelect={goToMemberRoot} />}
    </div>
  );
}

function GuideHome({
  member,
  memberCount,
  onStart,
  onOpenMembers,
  onContinue,
}: {
  member: Member;
  memberCount: number;
  onStart: () => void;
  onOpenMembers: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="min-h-dvh pb-[calc(max(env(safe-area-inset-bottom),12px)+164px)]">
      <MiniProgramHeader title="会员建档" />
      <main className="px-4">
        <section className="relative min-h-[238px] overflow-hidden rounded-3xl border border-[#eadde0] bg-gradient-to-br from-[#fff] via-[#fcf4f5] to-[#f5e2e6] px-5 py-6 shadow-[0_10px_32px_rgba(80,43,49,.06)]">
          <div className="relative z-10 max-w-[64%]">
            <p className="text-[11px] font-medium uppercase tracking-[.16em] text-[#a7243f]">
              MEMBER PROFILE
            </p>
            <h1 className="mt-3 text-[27px] font-semibold leading-[1.25] text-[#292522]">
              为每位会员
              <br />
              建立健康档案
            </h1>
            <p className="mt-3 text-[13px] leading-relaxed text-[#77716c]">
              从个人资料到全身健康情况，一次完成专属档案。
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[10px] text-[#8b5a64] shadow-sm">
              <ClockIcon />
              预计 3–5 分钟完成
            </span>
          </div>
          <div className="pointer-events-none absolute -bottom-16 right-[-26px] h-[290px] w-[145px] opacity-70">
            <img src={guideBody} alt="" className="size-full object-contain object-bottom" />
          </div>
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/60 blur-3xl" />
        </section>

        <section className="mt-4 rounded-2xl border border-[#e4ded9] bg-white px-4 py-4 shadow-[0_6px_22px_rgba(49,39,32,.04)]">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[.12em] text-[#99918c]">HOW IT WORKS</p>
              <h2 className="mt-0.5 text-base font-semibold text-[#292522]">三步完成建档</h2>
            </div>
            <span className="text-[10px] text-[#aaa39e]">信息可随时修改</span>
          </div>
          <ol className="grid grid-cols-3 gap-2">
            <GuideStep
              number="01"
              title="基本资料"
              desc="姓名、年龄、地区"
              icon={<ProfileIcon />}
            />
            <GuideStep number="02" title="健康标记" desc="逐项记录身体状况" icon={<BodyIcon />} />
            <GuideStep number="03" title="完成档案" desc="统一展示与维护" icon={<FileIcon />} />
          </ol>
        </section>

        <button
          onClick={onContinue}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-[#e4ded9] bg-white p-4 text-left shadow-[0_5px_18px_rgba(49,39,32,.035)] active:bg-[#fcfaf8]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f8e8eb] font-semibold text-[#a7243f]">
            {member.name.slice(-2)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-[#292522]">
              继续维护 {member.name} 的档案
            </span>
            <span className="mt-0.5 block text-[11px] text-[#8f8882]">
              进入健康地图，更新身体各部位记录
            </span>
          </span>
          <ChevronIcon />
        </button>

        <section className="mt-4 grid grid-cols-3 divide-x divide-[#e6e0db] rounded-xl border border-[#e8e3df] bg-white/70 py-3 text-center">
          <GuideBenefit title="一人一档" desc="信息集中管理" />
          <GuideBenefit title="持续维护" desc="健康动态更新" />
          <GuideBenefit title="服务跟进" desc="回访更有依据" />
        </section>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#f1efec] px-3.5 py-3 text-[11px] leading-relaxed text-[#817a75]">
          <ShieldIcon />
          <span>会员资料仅用于健康服务与档案展示。当前为前端原型，数据保存在本设备。</span>
        </div>
      </main>

      <div className="fixed inset-x-0 z-30 mx-auto max-w-[480px] border-t border-[#e3ded9] bg-white/95 px-4 py-3 backdrop-blur-xl bottom-[calc(max(env(safe-area-inset-bottom),8px)+56px)]">
        <div className="flex gap-2.5">
          <button
            onClick={onStart}
            className="h-12 flex-1 rounded-md bg-[#a7243f] text-sm font-medium text-white shadow-[0_6px_18px_rgba(167,36,63,.2)] active:scale-[.99]"
          >
            开始新建档案
          </button>
          <button
            onClick={onOpenMembers}
            className="h-12 rounded-md border border-[#d9b7bf] bg-white px-4 text-sm font-medium text-[#a7243f] active:bg-[#fbf0f2]"
          >
            已有档案 {memberCount}
          </button>
        </div>
      </div>
    </div>
  );
}

function GuideBenefit({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="px-1">
      <strong className="block text-[11px] font-medium text-[#4a4440]">{title}</strong>
      <span className="mt-0.5 block text-[9px] text-[#aaa39e]">{desc}</span>
    </div>
  );
}

function GuideStep({
  number,
  title,
  desc,
  icon,
}: {
  number: string;
  title: string;
  desc: string;
  icon: ReactNode;
}) {
  return (
    <li className="relative rounded-xl bg-[#faf8f6] px-2.5 py-3">
      <span className="absolute right-2 top-2 text-[9px] font-semibold text-[#d4b5bc]">
        {number}
      </span>
      <span className="grid size-8 place-items-center rounded-lg bg-[#f8e8eb] text-[#a7243f]">
        {icon}
      </span>
      <strong className="mt-2 block text-xs font-medium text-[#3c3733]">{title}</strong>
      <span className="mt-1 block text-[9px] leading-tight text-[#99918c]">{desc}</span>
    </li>
  );
}

function HealthHome({
  member,
  records,
  onBack,
  onOpenArea,
  onOpenProfile,
}: {
  member: Member;
  records: Records;
  onBack: () => void;
  onOpenArea: (id: AreaId) => void;
  onOpenProfile: () => void;
}) {
  return (
    <div className="min-h-dvh pb-[calc(max(env(safe-area-inset-bottom),8px)+68px)]">
      <MiniProgramHeader title="会员健康档案" onBack={onBack} />
      <section className="px-4 pt-2">
        <MemberCard member={member} records={records} onOpen={onOpenProfile} compact />
      </section>

      <section className="mx-4 mt-3 overflow-hidden rounded-2xl border border-[#e4ded9] bg-white shadow-[0_8px_28px_rgba(49,39,32,.04)]">
        <div className="flex items-end justify-between px-4 pb-1 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-[.12em] text-[#8c8580]">HEALTH MAP</p>
            <h2 className="mt-0.5 text-base font-semibold text-[#292522]">全身健康地图</h2>
          </div>
          <span className="text-[10px] text-[#99918c]">点击部位更新状态</span>
        </div>
        <div className="relative mx-auto w-full max-w-[390px]">
          <div className="pointer-events-none absolute left-[5%] top-1/2 h-[66%] w-[58%] -translate-y-1/2 rounded-full bg-[#dcecf6]/70 blur-3xl" />
          <BodyMap records={records} onSelect={onOpenArea} />
        </div>
      </section>
      <p className="py-3 text-center text-[10px] text-[#aaa39e]">
        健康记录仅用于会员服务，不替代专业医疗诊断
      </p>
    </div>
  );
}

function MemberManagementTab({ onSelect }: { onSelect: () => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-[#ded9d4] bg-white/95 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur-xl">
      <button
        onClick={onSelect}
        className="relative mx-auto flex h-[50px] w-28 flex-col items-center justify-center gap-0.5 text-[#a7243f]"
      >
        <span className="absolute -top-1.5 h-0.5 w-8 rounded-full bg-[#a7243f]" />
        <MembersIcon />
        <span className="text-[10px] font-medium">会员管理</span>
      </button>
    </nav>
  );
}

const UiIcon = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
    aria-hidden
  >
    {children}
  </svg>
);
const MembersIcon = () => (
  <UiIcon>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.2" />
    <path d="M3.5 20c.5-5 2.5-7 5.5-7s5 2 5.5 7M14.5 14c3.5-.5 5.5 1.2 6 5" />
  </UiIcon>
);
const ProfileIcon = () => (
  <UiIcon>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c.8-5 3.5-7 8-7s7.2 2 8 7" />
  </UiIcon>
);
const BodyIcon = () => (
  <UiIcon>
    <circle cx="12" cy="4.5" r="2.5" />
    <path d="M8 9c1-1.5 2.2-2 4-2s3 .5 4 2l2 5M8 9l-2 5M10 8v6l-2 7M14 8v6l2 7" />
  </UiIcon>
);
const FileIcon = () => (
  <UiIcon>
    <path d="M6 3h9l3 3v15H6zM15 3v4h4M9 12h6M9 16h6" />
  </UiIcon>
);
const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="size-3.5"
    aria-hidden
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5 text-[#aaa39e]"
    aria-hidden
  >
    <path d="m9 5 7 7-7 7" />
  </svg>
);
const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 size-4 shrink-0 text-[#a7243f]"
    aria-hidden
  >
    <path d="M12 3 5 6v5c0 5 2.8 8.2 7 10 4.2-1.8 7-5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
