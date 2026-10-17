/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // تفعيل الوضع الداكن عبر الـ classes لكي يتحكم به التطبيق يدوياً أو تلقائياً
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // تخصيص ألوان تناسب طابع الـ Fintech المظلم والفاتح
        dark: {
          bg: '#0f172a',      // خلفية داكنة فخمة (Slate 900)
          card: '#1e293b',    // لون البطاقات الداكنة (Slate 800)
          border: '#334155',  // الحدود الفاصلة الهادئة
        },
        light: {
          bg: '#f8fafc',      // خلفية فاتحة ناعمة (Slate 50)
          card: '#ffffff',    // لون البطاقات البيضاء الصافية
          border: '#e2e8f0',  // الحدود الفاصلة الفاتحة
        }
      },
    },
  },
  plugins: [],
};