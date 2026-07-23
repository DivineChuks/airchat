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
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  language: string | null;
  sentiment: SentimentType | null;
  // Free text: the live "Akwa Ibom Mock Data" table stores channel names
  // (e.g. "Web Chat", "SMS") that don't match the `reports` table's closed
  // SourceChannel union, and this field is display-only (never filtered on).
  source_channel: string;
  n8n_execution_id: string | null;
  created_at: string;
  updated_at: string;
}

// Row shape of the "Akwa Ibom Mock Data" table, created by hand in the
// Supabase dashboard (not via a tracked migration) as the live citizen
// reports dataset the dashboard reads from. Column names/casing (e.g.
// "channel_chatID", "Location") match exactly what's in Postgres.
export interface AkwaIbomMockDataRow {
  id: number;
  source_channel: string | null;
  channel_chatID: number | null;
  ticket_id: number | null;
  citizen_name: string | null;
  message: string | null;
  sentiment: string | null;
  category: string | null;
  subcategory: string | null;
  priority: string | null;
  status: string | null;
  mda: string | null;
  community: string | null;
  Location: string | null;
  lga: string | null;
  ward: string | null;
  n8n_execution_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// NOTE on Insert/Update below: supabase-js's `.insert()`/`.update()` type
// checking only resolves correctly when these are written as object-literal
// types directly inline here — a reference to a named type/interface (even
// `Partial<Row>`) makes the whole Schema resolve to `never` and every
// `.update()`/`.insert()` call gets rejected with a bogus "not assignable to
// never" error. Keep these spelled out in full rather than deriving them.
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13";
  };
  public: {
    Tables: {
      constituents: {
        Row: {
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
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          telegram_user_id?: string | null;
          lga?: string | null;
          ward?: string | null;
          community?: string | null;
          language?: string | null;
          opt_in_campaign_broadcasts?: boolean;
          opt_in_issue_updates?: boolean;
          source_channel?: SourceChannel;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          telegram_user_id?: string | null;
          lga?: string | null;
          ward?: string | null;
          community?: string | null;
          language?: string | null;
          opt_in_campaign_broadcasts?: boolean;
          opt_in_issue_updates?: boolean;
          source_channel?: SourceChannel;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
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
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          language: string | null;
          sentiment: SentimentType | null;
          source_channel: string;
          n8n_execution_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_number?: string;
          constituent_id?: string | null;
          citizen_name?: string | null;
          phone?: string | null;
          telegram_user_id?: string | null;
          message: string;
          summary?: string | null;
          category?: string | null;
          subcategory?: string | null;
          priority?: PriorityLevel;
          status?: ReportStatus;
          department?: string | null;
          lga?: string | null;
          ward?: string | null;
          community?: string | null;
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          language?: string | null;
          sentiment?: SentimentType | null;
          source_channel?: string;
          n8n_execution_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference_number?: string;
          constituent_id?: string | null;
          citizen_name?: string | null;
          phone?: string | null;
          telegram_user_id?: string | null;
          message?: string;
          summary?: string | null;
          category?: string | null;
          subcategory?: string | null;
          priority?: PriorityLevel;
          status?: ReportStatus;
          department?: string | null;
          lga?: string | null;
          ward?: string | null;
          community?: string | null;
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          language?: string | null;
          sentiment?: SentimentType | null;
          source_channel?: string;
          n8n_execution_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      "Akwa Ibom Mock Data": {
        Row: {
          id: number;
          source_channel: string | null;
          channel_chatID: number | null;
          ticket_id: number | null;
          citizen_name: string | null;
          message: string | null;
          sentiment: string | null;
          category: string | null;
          subcategory: string | null;
          priority: string | null;
          status: string | null;
          mda: string | null;
          community: string | null;
          Location: string | null;
          lga: string | null;
          ward: string | null;
          n8n_execution_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          source_channel?: string | null;
          channel_chatID?: number | null;
          ticket_id?: number | null;
          citizen_name?: string | null;
          message?: string | null;
          sentiment?: string | null;
          category?: string | null;
          subcategory?: string | null;
          priority?: string | null;
          status?: string | null;
          mda?: string | null;
          community?: string | null;
          Location?: string | null;
          lga?: string | null;
          ward?: string | null;
          n8n_execution_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          source_channel?: string | null;
          channel_chatID?: number | null;
          ticket_id?: number | null;
          citizen_name?: string | null;
          message?: string | null;
          sentiment?: string | null;
          category?: string | null;
          subcategory?: string | null;
          priority?: string | null;
          status?: string | null;
          mda?: string | null;
          community?: string | null;
          Location?: string | null;
          lga?: string | null;
          ward?: string | null;
          n8n_execution_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    // Required by supabase-js's GenericSchema constraint; this app has no
    // views or Postgres functions exposed through PostgREST.
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
