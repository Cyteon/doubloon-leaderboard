import dotenv from "dotenv";
import postgres from "postgres";
import { PG_URI } from "$env/static/private";

dotenv.config();

const sql = postgres(PG_URI);

export async function GET({ url }) {
    const id = url.searchParams.get("id");

    if (!id) {
        return Response.json({ error: "ID is required." }, { status: 400 });
    }

    const data = await sql`SELECT * FROM doubloons WHERE id = ${id}`;

    if (!data.length) {
        return Response.json({ error: "User not found." }, { status: 404 });
    }

    return Response.json(data);
}