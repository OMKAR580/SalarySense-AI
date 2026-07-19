import { LucideIcon } from "lucide-react";

export interface StoryCardData {
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  align: "left" | "right";
}

export interface DashboardProps {
  isActive: boolean;
  isMobile: boolean;
  shouldReduceMotion: boolean;
}
