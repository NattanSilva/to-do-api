import "reflect-metadata"
import "express-async-errors"
import express from "express"
import handleError from "./errors/handleError";
import userRoutes from "./routes/user.routes";
import sessionRoutes from "./routes/session.routes";
import taskRoutes from "./routes/task.routes";

const app = express();
app.use(express.json());
app.use("/users", userRoutes)
app.use("/login", sessionRoutes)
app.use("/tasks", taskRoutes)

app.use(handleError);

export default app;