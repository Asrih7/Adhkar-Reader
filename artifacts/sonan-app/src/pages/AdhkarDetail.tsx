import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";

interface DhikrItem {
  id: number;
  text: string;
  source: string | null;
}

interface AdhkarMeta {
  adkharId: string;
  text: string;
}

export default function AdhkarDetail() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<DhikrItem[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Load category name
    fetch(`${import.meta.env.BASE_URL}data/adhkar-data.json`)
      .then((r) => r.json())
      .then((data: AdhkarMeta[]) => {
        const found = data.find((d) => d.adkharId === id);
        if (found) setTitle(found.text);
      });

    // Load dhikr items — files are named adkar-{id}.json (1-indexed)
    const fileIndex = parseInt(id, 10);
    fetch(`${import.meta.env.BASE_URL}data/adkar-${fileIndex}.json`)
      .then((r) => r.json())
      .then((d) => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const increment = (itemId: number) => {
    setCounts((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const reset = (itemId: number) => {
    setCounts((prev) => ({ ...prev, [itemId]: 0 }));
  };

  return (
    <PageLayout title={title || "..."} subtitle="اضغط على الذكر للعد" backHref="/adhkar">
      <div className="pt-6 pb-10 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: "rgba(26,71,42,0.3)" }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-amber-200/40">
            <p className="text-lg">لا يوجد محتوى متاح</p>
          </div>
        ) : (
          items.map((dhikr, index) => (
            <motion.div
              key={dhikr.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(13,35,24,0.8)",
                  border: "1px solid rgba(212,175,55,0.15)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                {/* Dhikr number badge */}
                <div
                  className="px-4 pt-3 pb-0 flex items-center justify-between"
                >
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      color: "#d4af37",
                      border: "1px solid rgba(212,175,55,0.25)",
                    }}
                  >
                    ذكر {index + 1}
                  </span>

                  {/* Count badge */}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={counts[dhikr.id] || 0}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: counts[dhikr.id] ? "rgba(64,145,108,0.3)" : "rgba(255,255,255,0.05)",
                        color: counts[dhikr.id] ? "#40916c" : "rgba(255,255,255,0.3)",
                        border: `1px solid ${counts[dhikr.id] ? "rgba(64,145,108,0.4)" : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      {counts[dhikr.id] || 0} مرة
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Dhikr text */}
                <button
                  onClick={() => increment(dhikr.id)}
                  className="w-full p-4 text-right active:opacity-80 transition-opacity"
                >
                  <p
                    className="amiri leading-loose text-amber-50/95"
                    style={{ fontSize: "1.1rem", lineHeight: "2.2" }}
                  >
                    {dhikr.text}
                  </p>
                </button>

                {/* Source & reset */}
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
                >
                  {dhikr.source ? (
                    <span className="text-xs text-amber-400/60 flex items-center gap-1.5">
                      <span>📚</span>
                      <span>{dhikr.source}</span>
                    </span>
                  ) : (
                    <span />
                  )}

                  {(counts[dhikr.id] || 0) > 0 && (
                    <button
                      onClick={() => reset(dhikr.id)}
                      className="text-xs text-red-400/60 hover:text-red-400/90 transition-colors px-2 py-1 rounded-lg"
                      style={{ background: "rgba(239,68,68,0.07)" }}
                    >
                      إعادة
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}

        {items.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-amber-200/30 text-xs pt-2"
          >
            اضغط على الذكر للعدّ
          </motion.p>
        )}
      </div>
    </PageLayout>
  );
}
