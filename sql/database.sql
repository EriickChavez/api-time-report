SET GLOBAL tidb_enable_check_constraint = ON;

SELECT * FROM profiles;
SELECT* FROM field_configs;
SELECT * FROM time_entries;

DROP TABLE field_configs;
DROP TABLE profiles;
DROP TABLE time_entries;

CREATE TABLE profiles (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password VARCHAR(255) NOT NULL
);

CREATE TABLE field_configs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    field_id VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'textarea', 'date', 'time', 'timerange', 'select', 'file')),
    required BOOLEAN DEFAULT FALSE,
    enabled BOOLEAN DEFAULT TRUE,
    allow_files BOOLEAN DEFAULT FALSE,
    options JSON,
    `order` INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_config FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_field (user_id, field_id)
);

CREATE TABLE time_entries (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    `date` DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    reporter VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    field_data JSON, -- MySQL usa JSON en lugar de JSONB
    files JSON,      -- MySQL usa JSON en lugar de JSONB
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relación con la tabla de perfiles
    CONSTRAINT fk_user_time_entries FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);
