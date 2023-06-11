import express from "express";
import cors from "cors";
import { askQuestion } from "./server.js";

// Initialize Express
const app = express();
const router = express.Router();

app.use(cors());

//Enable preflight
app.options("*", cors()); // include before other routes

// Parse JSON bodies for this app. Make sure you put
// `app.use(express.json())` **before** your route handlers!
app.use(express.json());
app.use(router);

// ask a question
router.post("/ask-question", async (req, res) => {
  try {
    data = await askQuestion(req.body.question);
    res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

 // Initialize server
app.listen(5500, () => {
  console.log("Running on port 5500.");
});

// Export the Express API
export default app;