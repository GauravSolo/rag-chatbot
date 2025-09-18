const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const getAnswer = require("./query.js");
const redis = require("./redis.js");
const embedArticles = require("./embed.js");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("RAG Running");
});

app.get("/history/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const history = await redis.lrange(`chat:${sessionId}`, 0, -1);
  res.json(history.map((h) => JSON.parse(h)));
});

app.post("/reset", async (req, res) => {
  const { sessionId } = req.body;
  await redis.del(`chat:${sessionId}`);
  res.json({ message: "Session reset" });
});

app.post("/chat", async (req, res) => {
  const { sessionId, question } = req.body;
  if (!sessionId || !question)
    return res.status(400).send("Missing sessionId or question");

  try {
    const answer = await getAnswer(question, sessionId);
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request");
  }
});

app.listen(PORT, async () => {
  console.log(`Server start at : ${PORT}`);
  await embedArticles();
});
