import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";

interface SonanContent {
  sonaId?: string;
  title?: string;
  text?: string;
  hadith?: string;
  source?: string;
  explanation?: string;
  narrator?: string;
  evidence?: string | string[];
  note?: string;
  [key: string]: unknown;
}

interface SonanMeta {
  sonaId: string;
  text: string;
}

export default function SonanDetail() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<SonanContent | SonanContent[] | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`${import.meta.env.BASE_URL}data/sonan-data.json`)
      .then((r) => r.json())
      .then((data: SonanMeta[]) => {
        const found = data.find((d) => d.sonaId === id);
        if (found) setTitle(found.text);
      });

    fetch(`${import.meta.env.BASE_URL}data/sonan-${id}.json`)
      .then((r) => r.json())
      .then((d) => { setContent(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const renderContent = (c: SonanContent) => {
    const fields: { label: string; value: string | undefined; icon: string }[] = [
      { label: "الراوي", value: c.narrator, icon: "👤" },
      { label: "الحديث", value: c.hadith || c.text, icon: "📜" },
      { label: "المصدر", value: c.source, icon: "📚" },
      { label: "الشرح", value: c.explanation, icon: "💡" },
      { label: "الدليل", value: Array.isArray(c.evidence) ? c.evidence.join(" — ") : c.evidence, icon: "🔖" },
      { label: "ملاحظة", value: c.note, icon: "📝" },
    ];

    const visibleFields = fields.filter((f) => f.value);

    // If no known fields, show raw text keys
    if (visibleFields.length === 0) {
      return (
        <div className="p-5">
          {Object.entries(c).map(([key, val]) =>
            typeof val === "string" && val ? (
              <p key={key} className="amiri text-amber-50/90 leading-loose mb-4" style={{ fontSize: "1.05rem", lineHeight: "2.1" }}>
                {val}
              </p>
            ) : null
          )}
        </div>
      );
    }

    return (
      <div className="divide-y" style={{ borderColor: "rgba(212,175,55,0.08)" }}>
        {visibleFields.map((f) => (
          <div key={f.label} className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{f.icon}</span>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "#d4af37" }}
              >
                {f.label}
              </span>
            </div>
            <p
              className={`text-amber-50/90 leading-loose ${f.label === "الحديث" || f.label === "الدليل" ? "amiri" : ""}`}
              style={{ fontSize: f.label === "الحديث" ? "1.05rem" : "0.9rem", lineHeight: "2" }}
            >
              {f.value}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <PageLayout title={title || `السنة ${id}`} backHref="/sonan">
      <div className="pt-6 pb-10">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: "rgba(26,71,42,0.3)" }} />
            ))}
          </div>
        ) : !content ? (
          <div className="text-center py-16 text-amber-200/40">
            <p>لا يوجد محتوى متاح</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(13,35,24,0.85)",
              border: "1px solid rgba(212,175,55,0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            }}
          >
            {/* Badge */}
            <div className="p-4 pb-0 flex items-center gap-2">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))",
                  color: "#d4af37",
                  border: "1px solid rgba(212,175,55,0.25)",
                }}
              >
                ☀️ السنة رقم {id}
              </span>
            </div>

            {Array.isArray(content)
              ? content.map((c, i) => (
                <div key={i} className={i > 0 ? "border-t border-amber-400/10 mt-2 pt-2" : ""}>
                  {renderContent(c)}
                </div>
              ))
              : renderContent(content)
            }
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
