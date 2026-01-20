import { pool } from "../../config/db";
import { TimeEntry } from "../../@types/models";
import { v4 as uuidv4 } from "uuid";
import { ITimeEntryRepository } from "../../interfaces/ITimeEntryRepository";

export class MySQLTimeEntryRepository implements ITimeEntryRepository {
    updateEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null> {
        throw new Error("Method not implemented.");
    }
    async getEntries(userId: string, date: string): Promise<TimeEntry[]> {
        const [rows] = await pool.query(
            "SELECT * FROM time_entries WHERE user_id = ? AND date = ? ORDER BY created_at DESC",
            [userId, date]
        );
        return rows as TimeEntry[];
    }

    async addEntry(entry: Omit<TimeEntry, "id">): Promise<TimeEntry> {
        const id = uuidv4();
        const sql = `INSERT INTO time_entries 
            (id, user_id, date, start_time, end_time, reporter, status, field_data, files) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await pool.execute(sql, [
            id,
            entry.userId,
            entry.date,
            entry.startTime || null,
            entry.endTime || null,
            entry.reporter || null,
            entry.status || 'pending',
            JSON.stringify(entry.fieldData || {}),
            JSON.stringify(entry.files || [])
        ]);

        return { id, ...entry } as TimeEntry;
    }
}