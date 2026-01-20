export interface Profile {
    id: string;
    email: string;
    password?: string;
    fullName?: string;
    avatarUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FieldConfig {
    id: string;
    userId: string;
    fieldId: string;
    label: string;
    type: 'text' | 'textarea' | 'date' | 'time' | 'timerange' | 'select' | 'file';
    required: boolean;
    enabled: boolean;
    allowFiles: boolean;
    options?: any;
    order: number;
}

export interface TimeEntry {
    id: string;
    userId: string;
    date: string;
    startTime?: string;
    endTime?: string;
    reporter?: string;
    status: 'pending' | 'approved' | 'rejected';
    fieldData?: Record<string, any>;
    files?: any;
    evidence?: string;
    observations?: string;
    evidenceFiles?: any;
    observationFiles?: any;
    project?: string;
    task?: string;
    description?: string;
    duration?: number;
}