import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AgentId, TaskNode, PipelinePhase } from "@/lib/ai/types";
import type { PipelineErrorCode, PipelineErrorAgent } from "@/lib/ai/errors";
import { DEFAULT_DEVICE_ID, resolveDeviceId } from "@/lib/devices";

export type { AgentId };
export type AgentStatus = "idle" | "pending" | "in_progress" | "completed" | "failed";
export type PlanTier = "FREE" | "PRO" | "ENTERPRISE";
export type DeviceType = string;

export type ThemeMode = "light" | "dark";
export type RejectionReason =
  | "BAD_STYLING"
  | "SYNTAX_ERROR"
  | "WRONG_LOGIC"
  | "OTHER"
  | null;

export interface AgentTask {
  id: string;
  agent: AgentId;
  label: string;
  status: AgentStatus;
  payload: string;
  startedAt?: number;
  finishedAt?: number;
}

// NOTE: Full file body continues - if this truncates, restore from main + re-export header.
// This is an emergency partial - MUST be completed.
export const useStudioStore = null as any;
