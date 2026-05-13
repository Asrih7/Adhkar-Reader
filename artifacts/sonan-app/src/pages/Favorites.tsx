import { motion } from "framer-motion";
import { Star, Download, Share2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export default function Favorites() {
  const favorites = [
    { id: 1, title: "دعاء من أدعية الصباح", category: "أدعية" },
    { id: 2, title: "سنة تنظيف الأسنان", category: "سنن يومية" },
    { id: 3, title: "نصيحة عن الصبر", category: "نصائح" },
  ];

  return (
    <PageLayout title="المفضلة" subtitle="Favorites">
      <div className="pb-20 md:pb-8 mt-6">
        <div className="space-y-4">
          {favorites.length > 0 ? (
            favorites.map((fav, idx) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/20 hover:border-amber-400/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium gold-text">{fav.title}</p>
                    <p className="text-xs text-amber-200/50 mt-1">{fav.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-yellow-600/20 transition-colors">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-amber-600/20 transition-colors">
                      <Share2 className="w-5 h-5 text-amber-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-amber-200/50">لا توجد عناصر مفضلة حتى الآن</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
