import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    languageOptions: {
      globals: {
        React: "readonly",
        NodeJS: "readonly",
        JSX: "readonly"
      }
    },
    rules: {
      // Permitir variables no usadas (común en desarrollo)
      "@typescript-eslint/no-unused-vars": "warn",

      // Permitir any temporalmente para release
      "@typescript-eslint/no-explicit-any": "warn",

      // Permitir prefer-const como warning
      "prefer-const": "warn",

      // Permitir img elements (se puede optimizar después)
      "@next/next/no-img-element": "warn",

      // Permitir entidades no escapadas
      "react/no-unescaped-entities": "warn",

      // Permitir componentes sin display name
      "react/display-name": "warn",

      // Permitir dependencias faltantes en hooks (se puede revisar después)
      "react-hooks/exhaustive-deps": "warn",

      // Mantener como errores solo los críticos
      "no-undef": "error",
      "no-unused-expressions": "error",
      "no-unreachable": "error"
    }
  }
];

export default eslintConfig;
