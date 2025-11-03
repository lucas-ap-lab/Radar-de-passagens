// components/AirportInput.jsx
import { useEffect, useMemo, useRef, useState } from "react";

export default function AirportInput({
  label,
  value,
  onChange,
  placeholder = "Digite aeroporto, cidade ou IATA",
}) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const controller = useRef(null);

  const debounce = useMemo(() => {
    let t;
    return (fn) => { clearTimeout(t); t = setTimeout(fn, 300); };
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setOptions([]); setOpen(false); return;
    }
    debounce(async () => {
      try {
        controller.current?.abort?.();
        controller.current = new AbortController();
        const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}`, {
          signal: controller.current.signal,
        });
        const json = await res.json();
        setOptions(json.data || []); setOpen(true);
      } catch { /* ignora cancelamentos */ }
    });
  }, [query, debounce]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
        {label}
      </label>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => options.length && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        style={{ width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: "10px 12px" }}
      />
      {open && options.length > 0 && (
        <div
          style={{
            position: "absolute", zIndex: 20, top: "100%", left: 0, right: 0, marginTop: 6,
            maxHeight: 240, overflow: "auto", background: "#fff", border: "1px solid #eee",
            borderRadius: 10, boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
          }}
        >
          {options.map((o) => {
            const line1 = `${o.iata} — ${o.name}`;
            const line2 = [o.city, o.country].filter(Boolean).join(", ");
            return (
              <button
                key={o.iata + line1}
                type="button"
                onMouseDown={(e) => e.preventDefault()} // evita blur do input
                onClick={() => {
                  onChange(o.iata);       // devolve o IATA selecionado
                  setQuery(`${o.iata} — ${o.city || o.name}`);
                  setOpen(false);
                }}
                style={{
                  width: "100%", textAlign: "left", padding: "10px 12px",
                  border: "none", background: "transparent", cursor: "pointer"
                }}
              >
                <div style={{ fontWeight: 600 }}>{line1}</div>
                <div style={{ fontSize: 12, color: "#667" }}>{line2}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
