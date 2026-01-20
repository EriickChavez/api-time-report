import { pool } from "../../config/db";
import { Profile } from "../../@types/models";
import { v4 as uuidv4 } from "uuid";
import { IUserRepository } from "../../interfaces/IUserRepository";

export class MySQLUserRepository implements IUserRepository {

    async findById(id: string): Promise<Profile | null> {
        const [rows]: any = await pool.query("SELECT * FROM profiles WHERE id = ?", [id]);
        return rows[0] || null;
    }
    async findByEmail(email: string): Promise<Profile | null> {
        const [rows]: any = await pool.query("SELECT * FROM profiles WHERE email = ?", [email]);
        return rows[0] || null;
    }

    async create(user: Partial<Profile>): Promise<Profile> {
        const id = uuidv4();
        await pool.execute(
            "INSERT INTO profiles (id, email, password, full_name) VALUES (?, ?, ?, ?)",
            [id, user.email, user.password, user.fullName]
        );
        return { id, ...user } as Profile;
    }
}