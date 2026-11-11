export type AreaId = "brain" | "eye" | "skin" | "heart" | "gut" | "repro" | "bone";
export type Status = "good" | "watch" | "issue";

export interface Area {
  id: AreaId;
  zh: string;
  en: string;
  desc: string;
  problems: string[];
  /** hotspot positions measured on the extracted reference body (218 x 462) */
  spots: [number, number][];
}

export const AREAS: Area[] = [
  {
    id: "brain",
    zh: "大脑健康",
    en: "Brain Health",
    desc: "关注情绪、睡眠与认知，探索脑衰老与神经退行性疾病的早期干预。",
    problems: ["失眠多梦", "记忆力下降", "注意力不集中", "情绪低落", "焦虑紧张", "头痛头晕"],
    spots: [[149, 27]],
  },
  {
    id: "eye",
    zh: "眼部健康",
    en: "Eye Health",
    desc: "关注老花、干眼等年龄相关问题，守护清晰视觉。",
    problems: ["视疲劳", "干眼", "老花", "视物模糊", "眼睛红痒", "飞蚊症"],
    spots: [[153, 44]],
  },
  {
    id: "skin",
    zh: "皮肤健康",
    en: "Skin Health",
    desc: "融合医美、医疗器械与日常护理，从单点改善走向系统养护。",
    problems: ["干燥脱屑", "痤疮", "色斑", "敏感泛红", "皱纹松弛", "湿疹瘙痒"],
    spots: [[202, 181]],
  },
  {
    id: "heart",
    zh: "心血管健康",
    en: "Cardiovascular Health",
    desc: "关注代谢平衡与免疫稳态，支持心脏功能与血管健康。",
    problems: ["血压偏高", "心悸胸闷", "血脂异常", "运动后气短", "下肢水肿", "手脚冰凉"],
    spots: [[137, 115]],
  },
  {
    id: "gut",
    zh: "肠道健康",
    en: "Gut Health",
    desc: "聚焦肠道微生态、代谢调节与免疫健康，维护内在平衡。",
    problems: ["腹胀", "便秘", "腹泻", "胃酸反流", "食欲不振", "消化不良"],
    spots: [[132, 195]],
  },
  {
    id: "repro",
    zh: "生殖健康",
    en: "Reproductive Health",
    desc: "关注不同生命阶段的生殖健康需求，探索科学维护与干预。",
    problems: ["月经不调", "激素波动", "性功能减退", "备孕困扰", "更年期症状", "泌尿不适"],
    spots: [[131, 259]],
  },
  {
    id: "bone",
    zh: "骨关节健康",
    en: "Bone and Joint Health",
    desc: "关注关节磨损、疼痛与功能退化，维护行动能力与生活质量。",
    problems: ["关节疼痛", "晨僵", "腰背酸痛", "骨密度下降", "活动受限", "肌肉无力"],
    spots: [
      [102, 349],
      [161, 349],
    ],
  },
];

export const STATUS_META: Record<Status, { label: string; color: string; hint: string }> = {
  good: { label: "良好", color: "#4f9277", hint: "状态稳定，无明显不适" },
  watch: { label: "需关注", color: "#c28a35", hint: "偶有不适，建议观察" },
  issue: { label: "有问题", color: "#b32c47", hint: "持续不适，建议就医" },
};

export const UNMARKED_COLOR = "#a7243f";

export interface HistoryEntry {
  at: number;
  status: Status;
  problems: string[];
  note: string;
}

export interface AreaRecord {
  status?: Status;
  problems: string[];
  custom: string[];
  note: string;
  updatedAt?: number;
  history: HistoryEntry[];
}

export type Records = Partial<Record<AreaId, AreaRecord>>;

const KEY = "body-health-records-v1";

export function loadRecords(): Records {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveRecords(r: Records) {
  localStorage.setItem(KEY, JSON.stringify(r));
}

export const emptyRecord = (): AreaRecord => ({ problems: [], custom: [], note: "", history: [] });

export function formatDate(t: number) {
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
