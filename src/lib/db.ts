import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL as string, {
  idle_timeout: 30,
});

export default sql;
