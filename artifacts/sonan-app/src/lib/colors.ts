/**
 * Unified Color System
 * Modern Islamic App Design
 * Deep Navy + Gold + Teal
 */

// Primary Colors
export const colors = {
  // Dark Mode (Primary)
  dark: {
    // Backgrounds
    bg: {
      primary: "#0f1419", // Very dark navy
      secondary: "#1a1f35", // Dark navy
      tertiary: "#252d4a", // Navy blue
      hover: "#31394d", // Slightly lighter for hover
    },
    
    // Text & Content
    text: {
      primary: "#f5f1e8", // Cream white
      secondary: "#d4c8b8", // Muted cream
      tertiary: "#a89888", // Dim cream
      muted: "#7a7368", // Very dim
    },
    
    // Accents
    accent: {
      gold: "#d4af37", // Traditional gold
      teal: "#20c997", // Modern teal
      coral: "#ff7043", // Warm accent
    },
    
    // Borders & UI
    border: {
      dark: "rgba(212, 175, 55, 0.2)", // Gold with transparency
      light: "rgba(32, 201, 151, 0.15)", // Teal with transparency
    },
  },

  // Light Mode (Secondary)
  light: {
    // Backgrounds
    bg: {
      primary: "#faf9f7", // Off-white
      secondary: "#f5f1e8", // Cream
      tertiary: "#e8dcc8", // Warm beige
      hover: "#e0d0bc", // Slightly darker
    },
    
    // Text & Content
    text: {
      primary: "#1a1f35", // Dark navy
      secondary: "#31394d", // Medium navy
      tertiary: "#5a6a8a", // Light navy
      muted: "#8a92a8", // Muted
    },
    
    // Accents
    accent: {
      gold: "#c9a961", // Muted gold
      teal: "#0f8a70", // Deep teal
      coral: "#d84315", // Deep coral
    },
    
    // Borders & UI
    border: {
      dark: "rgba(201, 169, 97, 0.3)", // Gold with transparency
      light: "rgba(15, 138, 112, 0.2)", // Teal with transparency
    },
  },
};

// Tailwind class mappings for seamless integration
export const colorClasses = {
  // Primary backgrounds
  bgPrimary: "bg-slate-950 dark:bg-slate-900",
  bgSecondary: "bg-slate-900 dark:bg-slate-800",
  
  // Text colors
  textPrimary: "text-slate-100 dark:text-slate-50",
  textSecondary: "text-slate-300 dark:text-slate-200",
  
  // Gold accents
  gold: "text-yellow-600 dark:text-yellow-400",
  goldBg: "bg-yellow-600/10 dark:bg-yellow-600/20",
  goldBorder: "border-yellow-600/30 dark:border-yellow-500/40",
  goldText: "text-yellow-500 dark:text-yellow-300",
  
  // Teal accents
  teal: "text-teal-500 dark:text-teal-400",
  tealBg: "bg-teal-600/10 dark:bg-teal-600/20",
  tealBorder: "border-teal-600/30 dark:border-teal-500/40",
  tealText: "text-teal-500 dark:text-teal-400",
  
  // Shared button/card styles
  card: "bg-slate-800 dark:bg-slate-900 border border-slate-700 dark:border-slate-800 rounded-xl",
  button: "bg-gradient-to-r from-yellow-600 to-yellow-700 dark:from-yellow-600 dark:to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 dark:hover:from-yellow-500 dark:hover:to-yellow-600",
  
  // Gradients
  gradientGold: "from-yellow-600 via-yellow-500 to-yellow-400 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-400",
  gradientTeal: "from-teal-500 to-teal-600 dark:from-teal-500 dark:to-teal-600",
};

export default colors;
