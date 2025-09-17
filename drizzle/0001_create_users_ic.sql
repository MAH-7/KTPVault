-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users_ic table
CREATE TABLE IF NOT EXISTS "users_ic" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
        "hash_ic" text NOT NULL,
        "full_name" text NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "users_ic_hash_ic_unique" UNIQUE("hash_ic")
);