import { readFile } from "fs/promises";
import { Pool } from "pg";


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASS,
    port: 5432,
  });



export const query = (text: string, params?: any[]) => pool.query(text, params);



export const populateBooks = async () => {
  try {
    const populateBooksSql = await readFile('./src/migrations/populate-books.sql', { encoding: 'utf-8' });
    await query(populateBooksSql);
    console.log("Book population ran successfully");
  } catch (error) {
    console.error("Book population failed", error);
  }
}; 

export const migrate = async () => {
  try {
    const initialMigrationSql = await readFile('./src/migrations/init-db.sql', { encoding: 'utf-8' });
    await query(initialMigrationSql);
    console.log("Initial migration ran successfully");
  } catch (error) {
    console.error("Initial migration failed", error);
  }
};