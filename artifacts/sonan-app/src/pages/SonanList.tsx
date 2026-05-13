import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";

interface SonanItem {
  sonaId: string;
  text: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

export default function SonanList() {
  const [data, setData] = useState<SonanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/sonan-data.json`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageLayout title="السنن اليومية" subtitle="مئة سنة نبوية" backHref="/">
      <div className="pt-6 pb-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: "rgba(26,71,42,0.3)" }} />
            ))}
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
            {data.map((sona, idx) => (
              <motion.button
                key={sona.sonaId}
                variants={item}
                onClick={() => navigate(`/sonan/${sona.sonaId}`)}
                className="w-full text-right"
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="flex items-center gap-4 p-4 rounded-2xl card-hover"
                  style={{
                    background: "rgba(13,35,24,0.7)",
                    border: "1px solid rgba(212,175,55,0.1)",
                  }}
                >
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.04))",
                      border: "1px solid rgba(212,175,55,0.2)",
                      color: "#d4af37",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span className="flex-1 text-amber-100/90 font-medium text-sm leading-relaxed">{sona.text}</span>
                  <svg className="w-4 h-4 text-amber-400/40 rotate-180 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
