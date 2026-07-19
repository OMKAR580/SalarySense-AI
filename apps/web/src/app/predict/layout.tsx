"use client";

import React from "react";

import { DashboardShell } from "@/features/prediction";

export default function PredictLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
