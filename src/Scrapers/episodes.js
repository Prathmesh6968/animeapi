import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

const BASE_SERIES_URL = "https://animedekho.app/series/";
const BASE_EPISODE_URL = "https://animedekho.app/epi/";
const CACHE_DIR = "./cache";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://animedekho.app/",
};

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

const normalizeUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) return "https://animedekho.app" + url;
  return url;
};

const readCache = (slug) => {
  const file = path.join(CACHE_DIR, `${slug}.json`);
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  }
  return null;
};

const writeCache = (slug, data) => {
  const file = path.join(CACHE_DIR, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

const scrapeSeasons = async (slug) => {
  const url = `${BASE_SERIES_URL}${slug}/`;

  try {
    const res = await axios.get(url, {
      headers: HEADERS,
      timeout: 20000,
      validateStatus: (s) => s < 500,
    });

    const $ = cheerio.load(res.data);
    const seasons = [];

    $(".seasons-bx").each((_, seasonEl) => {
      const season = parseInt(
        $(seasonEl).find("p span").first().text().trim()
      );

      const episodes = [];

      $(seasonEl)
        .find("ul.seasons-lst li")
        .each((__, epEl) => {
          const code = $(epEl).find("h3 span").text().trim();
          const title = $(epEl)
            .find("h3")
            .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim();

          const raw = $(epEl).find("a.btn").attr("href");

          episodes.push({
            code,
            title,
            episodeId: raw
              ? raw.replace(BASE_EPISODE_URL, "").replaceAll("/", "")
              : null,
          });
        });

      seasons.push({ season, episodes });
    });

    // 🔥 SUCCESS → cache update
    if (seasons.length) {
      const data = { slug, seasons };
      writeCache(slug, data);
      return data;
    }

    throw new Error("Blocked HTML");
  } catch (err) {
    // 🔁 FALLBACK
    const cached = readCache(slug);
    if (cached) {
      return {
        ...cached,
        note: "served from cache (cloud blocked)",
      };
    }

    return {
      slug,
      seasons: [],
      error: "Source blocked & no cache available",
    };
  }
};

export default scrapeSeasons;
