export type SourceChannel =
  | "telegram"
  | "web_chat"
  | "referral"
  | "event"
  | "import"
  | "other";

export type PriorityLevel = "low" | "medium" | "high" | "critical";

export type SentimentType = "positive" | "neutral" | "negative";

export type ReportStatus =
  | "new"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed";

export interface Constituent {
  id: string;
  full_name: string | null;
  phone: string | null;
  telegram_user_id: string | null;
  lga: string | null;
  ward: string | null;
  community: string | null;
  language: string | null;
  opt_in_campaign_broadcasts: boolean;
  opt_in_issue_updates: boolean;
  source_channel: SourceChannel;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  reference_number: string;
  constituent_id: string | null;
  citizen_name: string | null;
  phone: string | null;
  telegram_user_id: string | null;
  message: string;
  summary: string | null;
  category: string | null;
  subcategory: string | null;
  priority: PriorityLevel;
  status: ReportStatus;
  department: string | null;
  lga: string | null;
  ward: string | null;
  community: string | null;
  latitude: number | null;
  longitude: number | null;
  language: string | null;
  sentiment: SentimentType | null;
  source_channel: SourceChannel;
  n8n_execution_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      constituents: {
        Row: Constituent;
        Insert: Partial<Constituent>;
        Update: Partial<Constituent>;
      };
      reports: {
        Row: Report;
        Insert: Partial<Report> & { message: string };
        Update: Partial<Report>;
      };
    };
  };
}
