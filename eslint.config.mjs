// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  {
    ignores: ['eslint.config.mjs', 'dist/', 'node_modules/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      '@stylistic': stylistic,
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
    },
  },
]);
