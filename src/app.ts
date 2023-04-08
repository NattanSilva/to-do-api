import "reflect-metadata"
import "express-async-errors"
import express from "express"

const app = express();
app.use(express.json());

export default app;