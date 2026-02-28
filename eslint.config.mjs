// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  {
    ignores: ['eslint.config.mjs', 'dist/', 'node_modules/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      '@stylistic': stylistic,
      "import": importPlugin,
      "unused-imports": unusedImports,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // --- Логические правила --- 
    
      // Запрещает явное использование 'any'.
      "@typescript-eslint/no-explicit-any": "error",
      // Выдает ошибку, если промис не обрабатывается
      "@typescript-eslint/no-floating-promises": "error",
      // Запрещает передавать в функции аргументы с небезопасными типами.
      "@typescript-eslint/no-unsafe-argument": "error",

      // --- ИМПОРТЫ И ПЕРЕМЕННЫЕ ---
  
      // Сортировка импортов по алфавиту (все типы в одной группе)
      "import/order": ["error", {
        groups: [["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"]],
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "never",
      }],
      "import/export": "error",
      // Ровно 2 пустые строки после блока импортов
      "import/newline-after-import": ["error", { count: 2, exactCount: true }],
      // Автоматическое удаление неиспользуемых импортов
      "unused-imports/no-unused-imports": "error",
      // Настройка неиспользуемых переменных (игнорирует те, что начинаются с _)
      "unused-imports/no-unused-vars": ["warn", { 
        vars: "all", 
        varsIgnorePattern: "^_", 
        args: "after-used", 
        argsIgnorePattern: "^_" 
      }],

      // --- ПРАВИЛА ФОРМАТИРОВАНИЯ --- 

      // Размер отступа — 2 пробела
      "@stylistic/indent": ["error", 2], 
      // Использовать двойные кавычки для строк
      "@stylistic/quotes": ["error", "double"], 
      // Всегда ставить точку с запятой в конце строки
      "@stylistic/semi": ["error", "always"], 
      // Максимальная длина строки кода — 100 символов
      "@stylistic/max-len": ["error", { "code": 100 }], 
      // Запятая в конце последней строки в многострочных объектах/массивах
      "@stylistic/comma-dangle": ["error", "always-multiline"], 
      // Запрет пробелов внутри круглых скобок: (args) вместо ( args )
      "@stylistic/space-in-parens": ["error", "never"],
      // Пробел перед открывающей фигурной скобкой: () {
      "@stylistic/space-before-blocks": ["error", "always"],
      // Пробелы вокруг ключевых слов: } else {
      "@stylistic/keyword-spacing": ["error", { "before": true, "after": true }],
      // Пробелы внутри фигурных скобок объектов: { key: value }
      "@stylistic/object-curly-spacing": ["error", "always"],

      // --- ПРОВЕРКИ И ОГРАНИЧЕНИЯ ---

      // Запрещает однострочные блоки без фигурных скобок {}
      "curly": ["error", "all"],
      // Запрещает console.log, но разрешает .info, .warn, .error
      "no-console": ["error", { allow: ["info", "error", "warn"] }],
      // Запрещает невидимые спец-пробелы везде, включая строки и шаблоны
      "no-irregular-whitespace": ["error", { skipStrings: false, skipTemplates: false }],
      // Требует пустую строку в начале и в конце класса
      "@stylistic/padded-blocks": ["error", {"classes": "always", "blocks": "never",}],
    },
  },
]);
