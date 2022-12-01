import postgres from 'postgres'

const url = process.env.SQL as string;

const sql = postgres(url, { /* options */ });

export default sql