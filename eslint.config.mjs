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
      globals: {...globals.node, ...globals.jest,},
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // --- Логические правила --- 
    
      "@typescript-eslint/no-explicit-any": "error",   // Запрещает явное использование 'any'.
      "@typescript-eslint/no-floating-promises": "error",   // Выдает ошибку, если промис не обрабатывается
      "@typescript-eslint/no-unsafe-argument": "error",   // Запрещает передавать в функции аргументы с небезопасными типами.

      // --- ИМПОРТЫ И ПЕРЕМЕННЫЕ ---
  
      "import/order": ["error", {   // Сортировка импортов по алфавиту (все типы в одной группе)
        groups: [["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"]],
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "never",
      }],
      "import/export": "error",
      "import/newline-after-import": ["error", { count: 2, exactCount: true }], // Ровно 2 пустые строки после блока импортов
      "unused-imports/no-unused-imports": "error", // Автоматическое удаление неиспользуемых импортов
      "unused-imports/no-unused-vars": ["warn", {  // Настройка неиспользуемых переменных (игнорирует те, что начинаются с _)
        vars: "all", 
        varsIgnorePattern: "^_", 
        args: "after-used", 
        argsIgnorePattern: "^_" 
      }],

      // --- ПРАВИЛА ФОРМАТИРОВАНИЯ --- 

      "@stylistic/indent": ["error", 2],   // Размер отступа — 2 пробела
      "@stylistic/quotes": ["error", "double"],   // Использовать двойные кавычки для строк
      "@stylistic/semi": ["error", "always"],   // Всегда ставить точку с запятой в конце строки
      "@stylistic/max-len": ["error", { "code": 100 }],   // Максимальная длина строки кода — 100 символов
      "@stylistic/comma-dangle": ["error", "always-multiline"],   // Запятая в конце последней строки в многострочных объектах/массивах
      "@stylistic/space-in-parens": ["error", "never"],  // Запрет пробелов внутри круглых скобок: (args) вместо ( args )
      "@stylistic/space-before-blocks": ["error", "always"],  // Пробел перед открывающей фигурной скобкой: () {
      "@stylistic/keyword-spacing": ["error", { "before": true, "after": true }],  // Пробелы вокруг ключевых слов: } else {
      "@stylistic/object-curly-spacing": ["error", "always"],  // Пробелы внутри фигурных скобок объектов: { key: value }

      // --- ПРОВЕРКИ И ОГРАНИЧЕНИЯ ---

      "curly": ["error", "all"],   // Запрещает однострочные блоки без фигурных скобок {}
      "no-console": ["error", { allow: ["info", "error", "warn"] }],   // Запрещает console.log, но разрешает .info, .warn, .error
      "no-irregular-whitespace": ["error", { skipStrings: false, skipTemplates: false }],   // Запрещает невидимые спец-пробелы везде, включая строки и шаблоны
      "@stylistic/padded-blocks": ["error", {"classes": "always", "blocks": "never",}],   // Требует пустую строку в начале и в конце класса
    },
  },
]);
