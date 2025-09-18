const axios = require("axios");
const { CloudClient } = require("chromadb");
const redis = require("./redis.js");
require("dotenv").config();

const JINA_API_KEY = process.env.JINA_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CHROMA_HOST = process.env.CHROMA_HOST;
const CHROMA_API_KEY = process.env.CHROMA_API_KEY;
const CHROMA_TENANT = process.env.CHROMA_TENANT;
const CHROMA_DATABASE = process.env.CHROMA_DATABASE;

const client = new CloudClient({
  host: CHROMA_HOST,
  apiKey: CHROMA_API_KEY,
  tenant: CHROMA_TENANT,
  database: CHROMA_DATABASE
});

async function getAnswer(question, sessionId) {
  const embedres = await axios.post(
    "https://api.jina.ai/v1/embeddings",
    {
      model: "jina-embeddings-v3",
      input: [question],
    },
    {
      headers: {
        Authorization: `Bearer ${JINA_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const embedding = embedres.data.data[0].embedding;

  const collection = await client.getCollection({
    name: "news",
  });
  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: 3,
  });

  const docs = results.documents[0];
  const context = docs.join("\n\n");

  const geminiRes = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      contents: [
        {
          parts: [
            {
              text: `Answer the following question using only the context. 
                    Do NOT use bullet points, asterisks, or Markdown. Give plain text only:\n\n
                    Context:\n${context}\n\nQuestion: ${question}`,
            },
          ],
        },
      ],
    },
    {
      headers: {
        "X-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const answer =
    geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer";
  let formattedAnswer = answer.replace(/\* /g, "\n* ");

  redis.rpush(
    `chat:${sessionId}`,
    JSON.stringify({ role: "user", text: question }),
  );
  redis.rpush(
    `chat:${sessionId}`,
    JSON.stringify({ role: "bot", text: formattedAnswer }),
  );

  await redis.expire(`chat:${sessionId}`, 600);

  console.log("Q: ", question);
  console.log("A: ", formattedAnswer);

  return formattedAnswer;
}

module.exports = getAnswer;
