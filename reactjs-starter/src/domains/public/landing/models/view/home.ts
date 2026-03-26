export type IconName = "users" | "heart" | "calendar" | "rupee";

export interface ImpactStatItemView {
  label: string;
  value: string;
  iconName: IconName;
}

export interface ImpactStatsView {
  stats: ImpactStatItemView[];
}
