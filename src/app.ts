import express from "express";
import identifyRoute from "./routes/identify.route";

const app = express();

app.use(express.json());

// ✅ ADD THIS TEST ROUTE
app.get("/", (req, res) => {
  res.send("PROJECT IS RUNNING ✅");
});

app.use("/identify", identifyRoute);

export default app;