const Parser = require("rss-parser");
const fs = require("fs");

const parser = new Parser();

async function fetchArticles(){
    const feed = await parser.parseURL("http://feeds.bbci.co.uk/news/rss.xml");

    const articles = feed.items.slice(0,50).map(item => ({
        title: item.title,
        link: item.link,
        content: item.contentSnippet || "",
    }));

    fs.writeFileSync("articles.json", JSON.stringify(articles, null, 2));
    console.log("Saved articles", articles.length);
}

fetchArticles();