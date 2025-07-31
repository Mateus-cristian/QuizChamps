import { runMigrations } from "@/db/migrate";

// Força o uso da variável de ambiente DATABASE_URL_TEST
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;

runMigrations("up")
  .then(() => {
    console.log("✅ Banco de testes migrado com sucesso!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Falha ao migrar banco de testes:", err);
    process.exit(1);
  });
