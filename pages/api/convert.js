import axios from "axios";
import NextCors from "nextjs-cors";

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "https://youtube-username-converter.vercel.app/",
    optionsSuccessStatus: 200,
  });

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const URL = "https://www.googleapis.com/youtube/v3/search";
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    res.status(500).json({ error: "API_KEY not found" });
    return;
  }

  try {
    let username = req.query.q;

    const match = username.match(/\/(c|user)\/|@/);
    if (match) {
      username = username.split(match[0])[1];
    }
    if (username.includes("youtube")) {
      const parts = username.split("/");
      username = parts[parts.length - 1];
    }

    if (req.query.q.includes("youtube")) {
      const response = await axios.get(req.query.q);
      if (response.status !== 200) {
        res.status(404).json({ error: "No results found" });
        return;
      }
    } else {
      res.status(404).json({ error: "No results found" });
      return;
    }

    const { data } = await axios.get(URL, {
      params: {
        part: "id",
        maxResults: 1,
        q: username,
        key: API_KEY,
        type: "channel",
      },
    });

    if (data.items.length > 0) {
      const channels = data.items
        .filter((item) => item.id.kind === "youtube#channel")
        .map((item) => item.id.channelId);
      return res.status(200).json({ channels });
    } else {
      res.status(404).json({ error: "No results found" });
      return;
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
