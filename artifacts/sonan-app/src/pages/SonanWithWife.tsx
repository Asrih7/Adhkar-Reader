import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";

const TOTAL = 30;

export default function SonanWithWife() {
  const [current, setCurrent] = useState(1);
  const [direction, setDirection] = useState(0);

  const goTo = (next: number) => {
    if (next < 1 || next > TOTAL) return;
    setDirection(next > current ? -1 : 1);
    setCurrent(next);
  };

  return (
    <PageLayout title="سنن مع الزوجة" subtitle={`${current} من ${TOTAL}`} backHref="/">
      <div className="pt-6 pb-10">
        {/* Image viewer */}
        <div className="relative rounded-2xl overflow-hidden mb-6" style={{ background: "rgba(13,35,24,0.8)", border: "1px solid rgba(212,175,55,0.15)", minHeight: "70vw", maxHeight: "70vh" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={current}
              src={`${import.meta.env.BASE_URL}img/${current}.jpg`}
              alt={`سنة مع الزوجة ${current}`}
              className="w-full h-full object-contain"
              style={{ maxHeight: "70vh" }}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 60 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => goTo(current + 1)}
            disabled={current >= TOTAL}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-30"
            style={{
              background: current < TOTAL ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,175,55,0.2)",
              color: "#d4af37",
            }}
          >
            التالي →
          </button>

          {/* Dots */}
          <div className="flex gap-1 flex-wrap justify-center" style={{ maxWidth: "120px" }}>
            {[...Array(TOTAL)].map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i + 1)}
                className="rounded-full transition-all"
                style={{
                  width: i + 1 === current ? "16px" : "5px",
                  height: "5px",
                  background: i + 1 === current ? "#d4af37" : "rgba(212,175,55,0.25)",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(current - 1)}
            disabled={current <= 1}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-30"
            style={{
              background: current > 1 ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,175,55,0.2)",
              color: "#d4af37",
            }}
          >
            ← السابق
          </button>
        </div>

        {/* Page indicator */}
        <p className="text-center text-amber-200/30 text-xs mt-4">
          {current} / {TOTAL}
        </p>
      </div>
    </PageLayout>
  );
}
