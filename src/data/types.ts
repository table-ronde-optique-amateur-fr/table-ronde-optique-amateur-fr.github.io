import type { Speaker } from "./parseSpeakers";

export interface TalkResources {
    slides?: string;
    video?: string;
}

export interface TalkSlot {
    type: "talk";
    start: string;
    end: string;
    speakerName: string;
    speaker?: Speaker;
}

export interface MarkerSlot {
    type: "intro" | "pause" | "cloture";
    time: string;
    label: string;
}

export type Slot = TalkSlot | MarkerSlot;

export interface DaySchedule {
    date: string;
    slots: Slot[];
}
