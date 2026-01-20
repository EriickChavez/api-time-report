import { Profile } from "../@types/models";

export interface IUserRepository {
    findByEmail(email: string): Promise<Profile | null>;
    findById(id: string): Promise<Profile | null>;
    create(user: Partial<Profile>): Promise<Profile>;
}