import { 
  ArrowLeft,
  BarChart2, 
  FileText, 
  History, 
  Home, 
  PlusCircle, 
  Settings} from "lucide-react";

import { NavGroup } from "../types";

export const PREDICTION_SIDEBAR_NAV: NavGroup[] = [
  {
    id: "main",
    items: [
      {
        id: "home",
        label: "Back to Home",
        href: "/",
        icon: ArrowLeft,
      },
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/predict",
        icon: Home,
      },
      {
        id: "new",
        label: "New Prediction",
        href: "/predict/new",
        icon: PlusCircle,
      },
      {
        id: "history",
        label: "Prediction History",
        href: "/predict/history",
        icon: History,
      },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    items: [
      {
        id: "analytics",
        label: "Analytics",
        href: "/predict/analytics",
        icon: BarChart2,
        disabled: false,
      },
      {
        id: "reports",
        label: "Reports",
        href: "/predict/reports",
        icon: FileText,
        disabled: false,
      },
    ],
  },
];

export const PREDICTION_BOTTOM_NAV: NavGroup = {
  id: "bottom",
  items: [
    {
      id: "settings",
      label: "Settings",
      href: "/predict/settings",
      icon: Settings,
    }
  ]
};
