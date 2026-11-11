import { useMemo, useState, type ReactNode } from "react";
import { AREAS, STATUS_META, type Records } from "./data";
import { ageOf, emptyMember, formatUpdated, initials, type Member } from "./members";
import { PlusIcon } from "./icons";
import { MiniProgramHeader } from "./MiniProgramChrome";

export function MemberCard({
  member,
  records,
  onOpen,
  compact = false,
}: {
  member: Member;
  records: Records;
  onOpen: () => void;
  compact?: boolean;
}) {
  const marked = AREAS.filter((a) => records[a.id]?.status);
  const issues = marked.filter((a) => records[a.id]?.status === "issue").length;
  const watch = marked.filter((a) => records[a.id]?.status === "watch").length;
  return (
    <button
      onClick={onOpen}
      className={`relative flex w-full items-center gap-3 overflow-hidden border border-[#e3ded9] bg-white text-left shadow-[0_7px_22px_rgba(49,39,32,.05)] transition active:scale-[.99] ${
        compact ? "rounded-2xl px-3 py-2.5" : "rounded-3xl p-4"
      }`}
    >
      <div className="absolute -right-8 -top-10 size-28 rounded-full bg-[#f6e5e9] blur-2xl" />
      <Avatar member={member} small={compact} />
      <div className="relative min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <strong className={`${compact ? "text-base" : "text-lg"} font-semibold text-[#2d2926]`}>
            {member.name}
          </strong>
          {member.tags[0] && (
            <span className="rounded-full border border-[#d9b7bf] bg-[#fbf0f2] px-2 py-0.5 text-[9px] text-[#a7243f]">
              {member.tags[0]}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[11px] text-[#77716c]">
          {member.gender} · {ageOf(member.birthday)} 岁 · {member.region || "地区未填写"}
        </p>
        {!compact && (
          <p className="mt-1 text-[10px] text-[#aaa39e]">{formatUpdated(member.updatedAt)}</p>
        )}
      </div>
      <div className="relative shrink-0 text-right">
        <div className="text-base font-semibold text-[#a7243f]">
          {marked.length}
          <span className="text-[10px] font-normal text-[#aaa39e]">/{AREAS.length}</span>
        </div>
        <div className="text-[9px] text-[#8f8882]">健康部位</div>
        {(issues > 0 || watch > 0) && (
          <div className="mt-1 flex justify-end gap-1">
            {issues > 0 && <StatusCount value={issues} color={STATUS_META.issue.color} />}
            {watch > 0 && <StatusCount value={watch} color={STATUS_META.watch.color} />}
          </div>
        )}
      </div>
    </button>
  );
}

function StatusCount({ value, color }: { value: number; color: string }) {
  return (
    <span className="flex items-center gap-1 text-[9px]" style={{ color }}>
      <span className="size-1.5 rounded-full" style={{ background: color }} />
      {value}
    </span>
  );
}

export function ProfileView({
  member,
  records,
  onBack,
  onEdit,
  onHealth,
}: {
  member: Member;
  records: Records;
  onBack: () => void;
  onEdit: () => void;
  onHealth: () => void;
}) {
  const marked = AREAS.filter((a) => records[a.id]?.status).length;
  const bmi =
    member.height && member.weight
      ? (Number(member.weight) / (Number(member.height) / 100) ** 2).toFixed(1)
      : "—";
  return (
    <div className="min-h-dvh pb-[calc(max(env(safe-area-inset-bottom),12px)+78px)]">
      <MiniProgramHeader title="个人资料" onBack={onBack} />
      <main className="space-y-4 px-4">
        <section className="fade-up relative overflow-hidden rounded-3xl border border-[#e3ded9] bg-white p-5 shadow-[0_8px_26px_rgba(49,39,32,.05)]">
          <div className="absolute -right-14 -top-16 size-48 rounded-full bg-[#f6e5e9] blur-3xl" />
          <button
            onClick={onEdit}
            className="absolute right-4 top-4 z-10 rounded-full border border-[#d9b7bf] bg-white px-3 py-1.5 text-xs text-[#a7243f]"
          >
            编辑资料
          </button>
          <div className="relative flex items-center gap-4">
            <Avatar member={member} />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-[#292522]">{member.name}</h1>
              <p className="mt-1 text-xs text-[#77716c]">
                {member.gender} · {ageOf(member.birthday)} 岁 ·{" "}
                {member.bloodType ? `${member.bloodType} 型血` : "血型未填"}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {member.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#fbf0f2] px-2 py-1 text-[10px] text-[#a7243f]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative mt-5 grid grid-cols-4 divide-x divide-[#e7e1dc] rounded-2xl bg-[#faf8f6] py-3 text-center">
            <Metric value={member.height ? `${member.height}` : "—"} unit="cm" label="身高" />
            <Metric value={member.weight || "—"} unit="kg" label="体重" />
            <Metric value={bmi} label="BMI" />
            <Metric value={marked} unit={`/${AREAS.length}`} label="健康记录" />
          </div>
        </section>

        <button
          onClick={onHealth}
          className="flex w-full items-center gap-3 rounded-2xl border border-[#e3ded9] bg-white p-4 text-left shadow-[0_5px_18px_rgba(49,39,32,.035)] active:bg-[#fcfaf8]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f8e8eb] text-[#a7243f]">
            <HealthMapIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-[#292522]">查看全身健康地图</span>
            <span className="mt-0.5 block text-[11px] text-[#8f8882]">
              已记录 {marked}/{AREAS.length} 个健康部位
            </span>
          </span>
          <RightIcon />
        </button>

        <InfoSection title="基本信息">
          <InfoRow icon={<PhoneIcon />} label="联系电话" value={member.phone || "未填写"} />
          <InfoRow icon={<LocationIcon />} label="所在地区" value={member.region || "未填写"} />
          <InfoRow icon={<HomeIcon />} label="详细地址" value={member.address || "未填写"} />
          <InfoRow icon={<BriefcaseIcon />} label="职业" value={member.occupation || "未填写"} />
        </InfoSection>
        <InfoSection title="紧急联系人">
          <InfoRow
            icon={<ContactIcon />}
            label={member.emergencyRelation || "联系人"}
            value={member.emergencyName || "未填写"}
          />
          <InfoRow
            icon={<PhoneIcon />}
            label="紧急电话"
            value={member.emergencyPhone || "未填写"}
          />
        </InfoSection>
        <InfoSection title="档案备注">
          <p className="min-h-12 text-sm leading-relaxed text-[#625d58]">
            {member.notes || "暂无备注"}
          </p>
        </InfoSection>
        <p className="pb-3 text-center text-[10px] text-[#aaa39e]">
          创建于 {new Date(member.createdAt).toLocaleDateString("zh-CN")}
        </p>
      </main>
    </div>
  );
}

export function MemberList({
  members,
  selectedId,
  recordsByMember,
  onBack,
  onSelect,
  onCreate,
}: {
  members: Member[];
  selectedId: string;
  recordsByMember: Record<string, Records>;
  onBack: () => void;
  onSelect: (member: Member) => void;
  onCreate: () => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      members.filter((m) =>
        `${m.name}${m.phone}${m.region}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [members, query],
  );
  return (
    <div className="min-h-dvh pb-[calc(max(env(safe-area-inset-bottom),12px)+86px)]">
      <MiniProgramHeader title="会员列表" onBack={onBack} />
      <header className="px-5 pb-4 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] text-[#8f8882]">Member Archives</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#292522]">会员健康档案</h1>
          </div>
          <button
            onClick={onCreate}
            className="flex h-10 items-center gap-1.5 rounded-md bg-[#a7243f] px-4 text-sm font-medium text-white shadow-[0_5px_15px_rgba(167,36,63,.18)] active:scale-95"
          >
            <PlusIcon /> 新建
          </button>
        </div>
        <label className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-[#e3ded9] bg-white px-3.5 shadow-sm">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索姓名、手机或地区"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#292522] outline-none placeholder:text-[#aaa39e]"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-xs text-[#99918c]">
              清除
            </button>
          )}
        </label>
      </header>
      <main className="px-4">
        <div className="mb-3 flex items-center justify-between px-1 text-xs text-[#8f8882]">
          <span>共 {filtered.length} 位会员</span>
          <span>按最近更新</span>
        </div>
        <div className="space-y-3">
          {filtered.map((member) => (
            <div key={member.id} className="relative">
              {member.id === selectedId && (
                <span className="absolute right-3 top-3 z-10 rounded-full bg-[#e8f2ed] px-2 py-1 text-[9px] text-[#4f9277]">
                  当前档案
                </span>
              )}
              <MemberCard
                member={member}
                records={recordsByMember[member.id] ?? {}}
                onOpen={() => onSelect(member)}
              />
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <SearchIcon className="mx-auto size-8 text-[#c2bbb5]" />
            <p className="mt-3 text-sm text-[#8f8882]">没有找到相关会员</p>
          </div>
        )}
      </main>
    </div>
  );
}

export function MemberEditor({
  member,
  isNew,
  onCancel,
  onSave,
}: {
  member?: Member;
  isNew: boolean;
  onCancel: () => void;
  onSave: (member: Member) => void;
}) {
  const [form, setForm] = useState<Member>(member ?? emptyMember());
  const [tagDraft, setTagDraft] = useState("");
  const update = (key: keyof Member, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const valid = form.name.trim() && form.birthday;
  const save = () => {
    if (!valid) return;
    onSave({ ...form, name: form.name.trim(), updatedAt: Date.now() });
  };
  const addTag = () => {
    const tag = tagDraft.trim();
    if (!tag || form.tags.includes(tag)) return;
    setForm((f) => ({ ...f, tags: [...f.tags, tag].slice(0, 4) }));
    setTagDraft("");
  };
  return (
    <div className="min-h-dvh pb-28">
      <MiniProgramHeader title={isNew ? "新建会员档案" : "编辑会员档案"} onBack={onCancel} />
      <main className="space-y-5 px-4">
        <FormSection title="个人信息" hint="姓名和出生日期为必填项">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="姓名 *"
              value={form.name}
              onChange={(v) => update("name", v)}
              placeholder="会员姓名"
            />
            <SelectField
              label="性别"
              value={form.gender}
              onChange={(v) => update("gender", v)}
              options={["女", "男", "其他"]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="出生日期 *"
              value={form.birthday}
              onChange={(v) => update("birthday", v)}
              type="date"
            />
            <div>
              <label className="mb-1.5 block text-[11px] text-[#77716c]">年龄</label>
              <div className="flex h-11 items-center rounded-xl border border-[#e3ded9] bg-[#faf8f6] px-3.5 text-sm text-[#77716c]">
                {ageOf(form.birthday)} {form.birthday && "岁"}
              </div>
            </div>
          </div>
          <Field
            label="联系电话"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            placeholder="手机号码"
            type="tel"
          />
          <div className="grid grid-cols-3 gap-3">
            <Field
              label="身高 (cm)"
              value={form.height}
              onChange={(v) => update("height", v)}
              type="number"
            />
            <Field
              label="体重 (kg)"
              value={form.weight}
              onChange={(v) => update("weight", v)}
              type="number"
            />
            <SelectField
              label="血型"
              value={form.bloodType}
              onChange={(v) => update("bloodType", v)}
              options={["", "A", "B", "AB", "O"]}
            />
          </div>
        </FormSection>
        <FormSection title="地区与职业">
          <Field
            label="所在地区"
            value={form.region}
            onChange={(v) => update("region", v)}
            placeholder="例如：浙江省 · 杭州市"
          />
          <Field
            label="详细地址"
            value={form.address}
            onChange={(v) => update("address", v)}
            placeholder="街道、小区或门牌号"
          />
          <Field
            label="职业"
            value={form.occupation}
            onChange={(v) => update("occupation", v)}
            placeholder="当前或退休前职业"
          />
        </FormSection>
        <FormSection title="紧急联系人">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="联系人"
              value={form.emergencyName}
              onChange={(v) => update("emergencyName", v)}
            />
            <Field
              label="关系"
              value={form.emergencyRelation}
              onChange={(v) => update("emergencyRelation", v)}
              placeholder="如：女儿"
            />
          </div>
          <Field
            label="紧急联系电话"
            value={form.emergencyPhone}
            onChange={(v) => update("emergencyPhone", v)}
            type="tel"
          />
        </FormSection>
        <FormSection title="档案标签与备注">
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))}
                className="rounded-full border border-[#d9b7bf] bg-[#fbf0f2] px-3 py-1.5 text-xs text-[#a7243f]"
              >
                {tag} ×
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              placeholder="添加标签"
              className="h-11 min-w-0 flex-1 rounded-xl border border-[#e3ded9] bg-white px-3.5 text-sm text-[#292522] outline-none placeholder:text-[#aaa39e] focus:border-[#b75b6e]"
            />
            <button
              onClick={addTag}
              className="grid size-11 place-items-center rounded-xl bg-[#fbf0f2] text-[#a7243f]"
            >
              <PlusIcon />
            </button>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] text-[#77716c]">备注</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              placeholder="家族史、慢性病、生活习惯或需要特别关注的情况"
              className="w-full resize-none rounded-xl border border-[#e3ded9] bg-white px-3.5 py-3 text-sm leading-relaxed text-[#292522] outline-none placeholder:text-[#aaa39e] focus:border-[#b75b6e]"
            />
          </div>
        </FormSection>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-[#e3ded9] bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur-xl">
        <button
          onClick={save}
          disabled={!valid}
          className="h-12 w-full rounded-md bg-[#a7243f] font-medium text-white shadow-[0_6px_18px_rgba(167,36,63,.2)] active:scale-[.99] disabled:cursor-not-allowed disabled:bg-[#c8c1bb] disabled:text-white disabled:shadow-none"
        >
          {isNew ? "创建会员档案" : "保存档案信息"}
        </button>
      </div>
    </div>
  );
}

function Avatar({ member, small = false }: { member: Member; small?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full border border-[#e3c9cf] bg-[#f8e8eb] font-bold text-[#a7243f] ${
        small ? "size-11 text-sm" : "size-16 text-lg"
      }`}
    >
      {initials(member.name)}
    </span>
  );
}

function Metric({ value, unit, label }: { value: string | number; unit?: string; label: string }) {
  return (
    <div>
      <div className="text-base font-semibold text-[#a7243f]">
        {value}
        <span className="ml-0.5 text-[9px] font-normal text-[#99918c]">{unit}</span>
      </div>
      <div className="mt-0.5 text-[9px] text-[#8f8882]">{label}</div>
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e3ded9] bg-white px-4 py-4 shadow-[0_5px_18px_rgba(49,39,32,.035)]">
      <h2 className="mb-3 text-sm font-semibold text-[#292522]">{title}</h2>
      <div className="divide-y divide-[#eee9e5]">{children}</div>
    </section>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="text-[#a7243f]">{icon}</span>
      <span className="text-xs text-[#8f8882]">{label}</span>
      <span className="min-w-0 flex-1 truncate text-right text-sm text-[#3f3a36]">{value}</span>
    </div>
  );
}

function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-[#e3ded9] bg-white p-4 shadow-[0_5px_18px_rgba(49,39,32,.035)]">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-[#292522]">{title}</h2>
        {hint && <span className="text-[10px] text-[#aaa39e]">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] text-[#77716c]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full min-w-0 rounded-xl border border-[#e3ded9] bg-white px-3.5 text-sm text-[#292522] outline-none placeholder:text-[#aaa39e] focus:border-[#b75b6e]"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] text-[#77716c]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-[#e3ded9] bg-white px-3 text-sm text-[#292522] outline-none focus:border-[#b75b6e]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "未填写"}
          </option>
        ))}
      </select>
    </label>
  );
}

const Icon = ({ children, className = "size-4" }: { children: ReactNode; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    {children}
  </svg>
);
export const SearchIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <circle cx="11" cy="11" r="6" />
    <path d="m16 16 4 4" />
  </Icon>
);
const PhoneIcon = () => (
  <Icon>
    <path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1-1.5 2a15 15 0 0 1-9.5-9.5L8 7z" />
  </Icon>
);
const LocationIcon = () => (
  <Icon>
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);
const HomeIcon = () => (
  <Icon>
    <path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6" />
  </Icon>
);
const BriefcaseIcon = () => (
  <Icon>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V4h8v3M3 12h18" />
  </Icon>
);
const ContactIcon = () => (
  <Icon>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c.8-5 3.5-7 8-7s7.2 2 8 7" />
  </Icon>
);
const HealthMapIcon = () => (
  <Icon className="size-5">
    <circle cx="12" cy="4.5" r="2.5" />
    <path d="M8 9c1-1.5 2.2-2 4-2s3 .5 4 2l2 5M8 9l-2 5M10 8v6l-2 7M14 8v6l2 7" />
  </Icon>
);
const RightIcon = () => (
  <Icon className="size-5 text-[#aaa39e]">
    <path d="m9 5 7 7-7 7" />
  </Icon>
);
