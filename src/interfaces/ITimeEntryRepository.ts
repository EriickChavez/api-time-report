import { TimeEntry } from "../@types/models";

export interface ITimeEntryRepository {
    getEntries(userId: string, from: string, to: string): Promise<TimeEntry[]>;
    addEntry(entry: Omit<TimeEntry, "id">): Promise<TimeEntry>;
    updateEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null>;
}