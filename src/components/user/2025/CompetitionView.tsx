import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_KEY);

type Entry = {
  id: number;
  titulo: string;
  tipo: string;
  tag: string;
  subtag: string | null;
  html: string;
};

const tags = ["Clasificación", "Rankings", "Fase Final"];
const subtagsMap: Record<string, string[]> = {
  Clasificación: ["Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F", "Grupo G", "Grupo H"],
  Rankings: ["Máx. Goleadores", "Máx. Asistentes", "Más Tarjetas"],
  "Fase Final": [],
};

export default function CompetitionView() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [tag, setTag] = useState("Clasificación");
  const [subtag, setSubtag] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("contenido_competicion").select("*");
      if (error) console.error("Error cargando datos", error);
      else setEntries(data as Entry[]);
    };
    fetchData();
  }, []);

  const filtered = entries.filter((e) => {
    const matchTag = e.tag === tag;
    const matchSubtag = subtag ? e.subtag === subtag : true;
    return matchTag && matchSubtag;
  });

  const subtags = subtagsMap[tag] || [];

  return (
    <div className="p-4">
      <div className="flex gap-4 flex-wrap mb-4">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTag(t);
              setSubtag(null);
            }}
            className={`px-4 py-2 rounded ${tag === t ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {subtags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {subtags.map((s) => (
            <button
              key={s}
              onClick={() => setSubtag(s)}
              className={`px-3 py-1 text-sm rounded ${subtag === s ? "bg-blue-400 text-white" : "bg-gray-100"}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className="p-4 bg-white rounded shadow"
            dangerouslySetInnerHTML={{ __html: entry.html }}
          />
        ))}
      </div>
    </div>
  );
}
