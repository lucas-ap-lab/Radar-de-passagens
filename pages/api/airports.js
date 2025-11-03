// pages/api/airports.js
import { searchAirports } from "../../src/lib/amadeus.js";

export default async function handler(req, res) {
  try {
    const q = String(req.query.q || "").trim();
    if (!q || q.length < 2) {
      return res.status(200).json({ data: [] });
    }
    const data = await searchAirports(q);
    return res.status(200).json({ data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
