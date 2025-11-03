import { getEnv } from "../../lib/env";

export default function handler(req, res) {
  try {
    const env = getEnv();
    res.status(200).json({ ok: true, have: Object.keys(env) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
