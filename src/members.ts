import { loadRecords, type Records } from "./data";

export interface Member {
  id: string;
  name: string;
  gender: "女" | "男" | "其他";
  birthday: string;
  phone: string;
  region: string;
  address: string;
  occupation: string;
  height: string;
  weight: string;
  bloodType: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  notes: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ArchiveState {
  members: Member[];
  selectedId: string;
  recordsByMember: Record<string, Records>;
}

const KEY = "member-health-archives-v1";

const now = Date.now();

const DEMO_MEMBERS: Member[] = [
  {
    id: "member-chen",
    name: "陈婉清",
    gender: "女",
    birthday: "1963-08-16",
    phone: "138 0571 2806",
    region: "浙江省 · 杭州市",
    address: "西湖区文三路",
    occupation: "退休教师",
    height: "160",
    weight: "56",
    bloodType: "A",
    emergencyName: "陈晓",
    emergencyRelation: "女儿",
    emergencyPhone: "139 5712 6038",
    notes: "有高血压家族史，日常保持轻量运动。",
    tags: ["重点关注", "定期随访"],
    createdAt: now - 1000 * 60 * 60 * 24 * 160,
    updatedAt: now - 1000 * 60 * 35,
  },
  {
    id: "member-lin",
    name: "林海峰",
    gender: "男",
    birthday: "1972-03-24",
    phone: "136 0210 8915",
    region: "上海市 · 徐汇区",
    address: "徐汇区漕溪北路",
    occupation: "企业管理",
    height: "176",
    weight: "72",
    bloodType: "O",
    emergencyName: "林欣",
    emergencyRelation: "配偶",
    emergencyPhone: "137 0183 2120",
    notes: "工作节奏较快，需关注睡眠和心血管状态。",
    tags: ["年度体检"],
    createdAt: now - 1000 * 60 * 60 * 24 * 90,
    updatedAt: now - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "member-zhou",
    name: "周雅琴",
    gender: "女",
    birthday: "1984-11-08",
    phone: "135 7551 4027",
    region: "广东省 · 深圳市",
    address: "南山区科技园",
    occupation: "产品设计",
    height: "165",
    weight: "53",
    bloodType: "B",
    emergencyName: "周正",
    emergencyRelation: "兄长",
    emergencyPhone: "138 2652 1190",
    notes: "",
    tags: ["新会员"],
    createdAt: now - 1000 * 60 * 60 * 24 * 12,
    updatedAt: now - 1000 * 60 * 60 * 24 * 5,
  },
];

export function emptyMember(): Member {
  const stamp = Date.now();
  return {
    id: `member-${stamp}`,
    name: "",
    gender: "女",
    birthday: "",
    phone: "",
    region: "",
    address: "",
    occupation: "",
    height: "",
    weight: "",
    bloodType: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    notes: "",
    tags: [],
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export function loadArchiveState(): ArchiveState {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Fall through to the local prototype data.
  }
  return {
    members: DEMO_MEMBERS,
    selectedId: DEMO_MEMBERS[0].id,
    recordsByMember: { [DEMO_MEMBERS[0].id]: loadRecords() },
  };
}

export function saveArchiveState(state: ArchiveState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function ageOf(birthday: string) {
  if (!birthday) return "—";
  const birth = new Date(`${birthday}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return "—";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age--;
  return Math.max(0, age);
}

export function initials(name: string) {
  return name.trim().slice(-2) || "会员";
}

export function formatUpdated(at: number) {
  const diff = Date.now() - at;
  if (diff < 60 * 60 * 1000) return `${Math.max(1, Math.floor(diff / 60000))} 分钟前更新`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} 小时前更新`;
  if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / 86400000)} 天前更新`;
  return new Date(at).toLocaleDateString("zh-CN");
}
