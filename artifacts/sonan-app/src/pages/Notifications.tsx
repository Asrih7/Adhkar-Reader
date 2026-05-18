import { motion } from "framer-motion";
import { Bell, Volume2, Moon, Vibrate } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export default function Notifications() {
  return (
    <PageLayout title="الإشعارات" subtitle="Notifications">
      <div className="pb-20 md:pb-8 mt-6">
        <div className="space-y-6">
          {/* Prayer Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium emerald-text">إشعارات الصلاة</h3>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-2 text-emerald-200/70">
                <input type="checkbox" defaultChecked />
                <span>قبل الصلاة بـ 5 دقائق</span>
              </label>
              <label className="flex items-center gap-2 text-amber-200/70">
                <input type="checkbox" defaultChecked />
                <span>وقت الآذان</span>
              </label>
            </div>
          </motion.div>

          {/* Adhkar Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium emerald-text">أذكار الصباح والمساء</h3>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <input
              type="time"
              defaultValue="06:00"
              className="w-full px-3 py-2 rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-sm"
            />
          </motion.div>

          {/* Sound Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium emerald-text">الصوت</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Quiet Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-emerald-400" />
                <span className="font-medium emerald-text">ساعات الهدوء</span>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2 text-emerald-200/70">
                من:
                <input type="time" defaultValue="22:00" className="px-2 py-1 rounded bg-emerald-900/40 border border-emerald-500/30" />
              </label>
              <label className="flex items-center gap-2 text-amber-200/70">
                إلى:
                <input type="time" defaultValue="06:00" className="px-2 py-1 rounded bg-emerald-900/40 border border-emerald-500/30" />
              </label>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
