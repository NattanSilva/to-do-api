import { DataSource } from "typeorm"
import path from "path"
import "dotenv/config"

const AppDataSource = new DataSource(
  process.env.NODE_ENV === "test" ?
    {
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      entities: ["src/entities/*.ts"]
    } :
    {
      type: "postgres",
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT!),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      logging: true,
      synchronize: false,
      entities: [path.join(__dirname, "./entities/**.{js,ts}")],
      migrations: [path.join(__dirname, "./migrations/**.{js,ts}")]
    }
)

export default AppDataSource;