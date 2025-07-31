import { runMigrations } from "@/db/migrate";

const direction = process.argv[2] === "down" ? "down" : "up";

runMigrations(direction)
  .then(() => {
    console.log("✅ Banco principal migrado com sucesso!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Falha ao migrar banco principal:", err);
    process.exit(1);
  });
