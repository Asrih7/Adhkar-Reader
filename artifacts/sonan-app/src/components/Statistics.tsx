import { motion } from "framer-motion";
import { Trophy, Zap, Target, TrendingUp } from "lucide-react";

interface StatsData {
  daily: number;
  weekly: number;
  monthly: number;
  streak: number;
  level: number;
  achievements: string[];
}

export default function Statistics({ data = {
  daily: 250,
  weekly: 1500,
  monthly: 5000,
  streak: 15,
  level: 5,
  achievements: ["First Step", "Week Warrior", "Monthly Master"]
} }: { data?: StatsData }) {
  const stats = [
    { label: "اليوم", value: data.daily, unit: "ذكر", icon: Zap, color: "from-yellow-500 to-orange-500" },
    { label: "الأسبوع", value: data.weekly, unit: "ذكر", icon: Target, color: "from-blue-500 to-cyan-500" },
    { label: "الشهر", value: data.monthly, unit: "ذكر", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
    { label: "السلسلة", value: data.streak, unit: "يوم", icon: Zap, color: "from-red-500 to-pink-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Level & XP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-lg bg-gradient-to-r from-yellow-900/30 to-teal-900/20 border border-yellow-600/30 dark:border-yellow-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            <h3 className="text-xl font-bold gold-text">المستوى {data.level}</h3>
          </div>
          <span className="text-2xl font-bold text-yellow-400 dark:text-yellow-300">2500 XP</span>
        </div>
        <div className="w-full h-2 bg-yellow-900/50 dark:bg-yellow-900/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-600 to-teal-500 dark:from-yellow-500 dark:to-teal-400 rounded-full"
            animate={{ width: "65%" }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="text-sm text-yellow-200/50 dark:text-yellow-100/50 mt-2">625 / 1000 نقطة إلى المستوى التالي</p>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20 border border-current border-opacity-30`}
            >
              <Icon className="w-5 h-5 mb-2 opacity-70" />
              <p className="text-sm text-white/60">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-xs text-white/50">{stat.unit}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-bold gold-text mb-4">الإنجازات</h3>
        <div className="grid grid-cols-3 gap-3">
          {data.achievements.map((achievement, idx) => (
            <motion.div
              key={achievement}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="p-3 rounded-lg bg-yellow-900/30 dark:bg-yellow-900/20 border border-yellow-600/30 dark:border-yellow-500/30 text-center hover:border-yellow-500/60 dark:hover:border-yellow-400/60 transition-colors cursor-pointer"
            >
              <span className="text-2xl mb-2 block">🏆</span>
              <p className="text-xs font-medium text-yellow-400 dark:text-yellow-300 truncate">{achievement}</p>
            </motion.div>
          ))}
          <div className="p-3 rounded-lg bg-yellow-900/10 dark:bg-yellow-900/10 border border-dashed border-yellow-600/20 dark:border-yellow-500/20 text-center opacity-50">
            <span className="text-2xl mb-2 block">🔒</span>
            <p className="text-xs text-yellow-400/50 dark:text-yellow-300/50">قادم</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
