import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.postgres_host,
  port: Number(process.env.postgres_port) || 5432,
  user: process.env.postgres_user,
  password: process.env.postgres_password,
  database: process.env.postgres_database,
});
