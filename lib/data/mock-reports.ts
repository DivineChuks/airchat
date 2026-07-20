import type {
  Report,
  ReportStatus,
  PriorityLevel,
  SentimentType,
  SourceChannel,
} from "@/lib/supabase/types";

// Deterministic pseudo-random generator so mock data is stable across renders
// instead of reshuffling on every request (Math.random() would do that).
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];

const LOCATIONS = [
  { lga: "Uyo", ward: "Ward 1", community: "Osongama", lat: 5.0501, lng: 7.9256 },
  { lga: "Uyo", ward: "Ward 2", community: "Shelter Afrique", lat: 5.0421, lng: 7.9033 },
  { lga: "Uyo", ward: "Ward 3", community: "Idu Uruan", lat: 5.0198, lng: 7.9411 },
  { lga: "Uyo", ward: "Ward 4", community: "Ewet Housing", lat: 5.0342, lng: 7.9128 },
  { lga: "Etinan", ward: "Ward 1", community: "Central Etinan", lat: 4.9302, lng: 7.8452 },
  { lga: "Etinan", ward: "Ward 2", community: "Nditia", lat: 4.9187, lng: 7.8601 },
  { lga: "Etinan", ward: "Ward 3", community: "Ikot Obio Tom", lat: 4.9256, lng: 7.8398 },
  { lga: "Ikot Ekpene", ward: "Ward 1", community: "Itu Road", lat: 5.1822, lng: 7.7203 },
  { lga: "Ikot Ekpene", ward: "Ward 3", community: "Aka Road", lat: 5.1783, lng: 7.7114 },
  { lga: "Eket", ward: "Ward 1", community: "Marina Road", lat: 4.6465, lng: 7.9296 },
  { lga: "Eket", ward: "Ward 2", community: "Ndon Eyo", lat: 4.635, lng: 7.918 },
  { lga: "Oron", ward: "Ward 1", community: "Beach Road", lat: 4.8167, lng: 8.2333 },
] as const;

const ISSUES: {
  category: string;
  subcategory: string | null;
  department: string;
  messages: string[];
  priority: PriorityLevel[];
  sentiment: SentimentType[];
}[] = [
  {
    category: "Infrastructure",
    subcategory: "Electricity",
    department: "Ministry of Power",
    messages: [
      "I haven't had electricity for two weeks.",
      "Transformer in our area blew up three days ago, no update from the utility company.",
      "Frequent power outages are affecting small businesses here.",
    ],
    priority: ["high", "medium", "critical"],
    sentiment: ["negative", "negative", "neutral"],
  },
  {
    category: "Infrastructure",
    subcategory: "Water",
    department: "Ministry of Water Resources",
    messages: [
      "There is flooding in my community.",
      "We have no access to clean water, the borehole has been broken for a month.",
      "Thank you for fixing the borehole, it works well now.",
    ],
    priority: ["critical", "high", "low"],
    sentiment: ["negative", "negative", "positive"],
  },
  {
    category: "Infrastructure",
    subcategory: "Roads",
    department: "Ministry of Works",
    messages: [
      "The road on Aka Road is badly damaged and causing accidents.",
      "Potholes on the main road are getting worse after the rains.",
    ],
    priority: ["high", "medium"],
    sentiment: ["negative", "negative"],
  },
  {
    category: "Healthcare",
    subcategory: null,
    department: "Ministry of Health",
    messages: [
      "The health centre has no drugs.",
      "Only one nurse is on duty at the primary health centre, patients are turned away.",
      "Thank you for the free medical outreach last week, it really helped my family.",
    ],
    priority: ["critical", "high", "low"],
    sentiment: ["negative", "negative", "positive"],
  },
  {
    category: "Education",
    subcategory: null,
    department: "Ministry of Education",
    messages: [
      "The primary school in our area has no teachers for maths and science.",
      "Classrooms are overcrowded, some children sit on the floor.",
    ],
    priority: ["high", "medium"],
    sentiment: ["negative", "negative"],
  },
  {
    category: "Security",
    subcategory: null,
    department: "Ministry of Security",
    messages: [
      "There has been a rise in cases of theft at night, we need more security patrols.",
      "Armed robbers attacked shops on our street last night.",
    ],
    priority: ["critical", "high"],
    sentiment: ["negative", "negative"],
  },
  {
    category: "Agriculture",
    subcategory: null,
    department: "Ministry of Agriculture",
    messages: [
      "Farmers in our community need fertilizer support this planting season.",
      "Flood destroyed most of our farmland, we need support to replant.",
    ],
    priority: ["medium", "high"],
    sentiment: ["neutral", "negative"],
  },
  {
    category: "Youth",
    subcategory: null,
    department: "Ministry of Youth",
    messages: [
      "No jobs for youths in our area, please help.",
      "We would like the youth empowerment program to be extended to our ward.",
    ],
    priority: ["medium", "low"],
    sentiment: ["negative", "neutral"],
  },
  {
    category: "Employment",
    subcategory: null,
    department: "Ministry of Labour",
    messages: [
      "Many graduates in our community are unemployed, can the government help with skills training?",
    ],
    priority: ["medium"],
    sentiment: ["neutral"],
  },
  {
    category: "Environment",
    subcategory: null,
    department: "Ministry of Environment",
    messages: [
      "Erosion is threatening homes near the river.",
      "Refuse has not been collected in our area for over two weeks.",
    ],
    priority: ["critical", "medium"],
    sentiment: ["negative", "negative"],
  },
];

const NAMES = [
  "Aniekan Udo",
  "Grace Etim",
  "Ime Bassey",
  "Ubong Akpan",
  "Mfon Effiong",
  "Emem Okon",
  "Uduak Umoh",
  "Idorenyin Sunday",
  "Nse Ekong",
  "Edidiong Peter",
  null,
  null,
];

const CHANNELS: SourceChannel[] = ["telegram", "web_chat"];
const STATUSES: ReportStatus[] = ["new", "assigned", "in_progress", "resolved", "closed"];
const STATUS_WEIGHTS = [0.32, 0.2, 0.18, 0.2, 0.1];

function weightedStatus(): ReportStatus {
  const r = rand();
  let acc = 0;
  for (let i = 0; i < STATUSES.length; i++) {
    acc += STATUS_WEIGHTS[i];
    if (r <= acc) return STATUSES[i];
  }
  return "new";
}

function daysAgo(days: number, hours = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function generateMockReports(count: number): Report[] {
  const reports: Report[] = [];
  for (let i = 0; i < count; i++) {
    const issue = pick(ISSUES);
    const location = pick(LOCATIONS);
    const message = pick(issue.messages);
    const variantIndex = issue.messages.indexOf(message);
    const priority = issue.priority[variantIndex] ?? pick(issue.priority);
    const sentiment = issue.sentiment[variantIndex] ?? pick(issue.sentiment);
    const name = pick(NAMES);
    const channel = pick(CHANNELS);
    const dayOffset = Math.floor(rand() * 21);
    const hourOffset = Math.floor(rand() * 23);

    reports.push({
      id: `mock-${i + 1}`,
      reference_number: `AC-${String(100 + i).padStart(6, "0")}`,
      constituent_id: name ? `mock-constituent-${(i % 10) + 1}` : null,
      citizen_name: name,
      phone: name ? `+23480300000${(i % 9) + 1}` : null,
      telegram_user_id: channel === "telegram" ? `tg_${1000 + i}` : null,
      message,
      summary: message.length > 60 ? message.slice(0, 57) + "..." : message,
      category: issue.category,
      subcategory: issue.subcategory,
      priority,
      status: weightedStatus(),
      department: issue.department,
      lga: location.lga,
      ward: location.ward,
      community: location.community,
      latitude: location.lat,
      longitude: location.lng,
      language: "English",
      sentiment,
      source_channel: channel,
      n8n_execution_id: `exec_${1000 + i}`,
      created_at: daysAgo(dayOffset, hourOffset),
      updated_at: daysAgo(Math.max(dayOffset - 1, 0), hourOffset),
    });
  }
  return reports.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export const MOCK_REPORTS: Report[] = generateMockReports(70);
