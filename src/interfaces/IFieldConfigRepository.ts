import { FieldConfig } from "../@types/models";

export interface IFieldConfigRepository {
    getConfigsByUserId(userId: string): Promise<FieldConfig[]>;
    saveConfigs(userId: string, configs: FieldConfig[]): Promise<void>;
    deleteConfig(id: string): Promise<boolean>;
}
