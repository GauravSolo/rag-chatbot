const fs = require("fs");
const axios = require("axios");
const { ChromaClient } = require("chromadb");

require("dotenv").config();
const JINA_API_KEY = process.env.JINA_API_KEY;
const CHROMA_HOST = process.env.CHROMA_HOST;

const client = new ChromaClient({
  host: CHROMA_HOST
});

async function embedArticles() {
  const articles = JSON.parse(fs.readFileSync("articles.json"));

  const collection = await client.getOrCreateCollection({
    name: "news",
    embeddingFunction: null,
  });

  for (let i = 0; i < articles.length; i++) {
    const text = articles[i].title + " " + articles[i].content;

    const response = await axios.post(
      "https://api.jina.ai/v1/embeddings",
      {
        model: "jina-embeddings-v3",
        input: [text],
      },
      {
        headers: {
          Authorization: `Bearer ${JINA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const embedding = response.data.data[0].embedding;

    await collection.add({
      ids: [`article-${i}`],
      documents: [text],
      embeddings: [embedding],
      metadatas: [{ link: articles[i].link }],
    });
  }
  console.log("Embedded", articles.length);
}

module.exports = embedArticles;
