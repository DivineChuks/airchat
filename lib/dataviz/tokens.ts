// Chart color tokens — light-surface values from the dataviz skill's validated
// reference palette (this app is light-mode by design). Never used for text;
// marks (bars/lines/dots) carry these, labels stay on text tokens.

export const chart = {
  surface: "#ffffff",
  textPrimary: "#0b0b0b",
  textSecondary: "#52514e",
  textMuted: "#898781",
  gridline: "#e1e0d9",
  baseline: "#c3c2b7",
  // Sequential default hue (categorical slot 1), used for single-series
  // magnitude charts (ranked bars, trend line) where the axis labels already
  // carry identity — no need for a distinct hue per category.
  seriesBlue: "#2a78d6",
  seriesBlueWash: "rgba(42, 120, 214, 0.1)",
} as const;

// Status palette — fixed, reserved for state (never reused as a categorical
// series color). Same four steps in both light and dark per the reference palette.
export const status = {
  good: "#0ca30c",
  warning: "#c98500",
  serious: "#ec835a",
  critical: "#d03b3b",
  muted: "#898781",
} as const;

export const sentimentColor: Record<string, string> = {
  positive: status.good,
  neutral: status.muted,
  negative: status.critical,
};

export const priorityColor: Record<string, string> = {
  low: status.muted,
  medium: status.warning,
  high: status.serious,
  critical: status.critical,
};

export const reportStatusColor: Record<string, string> = {
  new: chart.seriesBlue,
  assigned: status.warning,
  in_progress: status.serious,
  resolved: status.good,
  closed: status.muted,
};
