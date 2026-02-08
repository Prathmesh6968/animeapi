import axios from "axios";
import * as cheerio from "cheerio";

const BASE_SERIES_URL = "https://animedekho.app/series/";
const BASE_EPISODE_URL = "https://animedekho.app/epi/";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://animedekho.app/",
  "Connection": "keep-alive",
};

const normalizeUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) return "https://animedekho.app" + url;
  return url;
};

const scrapeSeasons = async (slug) => {
  const initialUrl = `${BASE_SERIES_URL}${slug}/`;

  try {
    console.log("SCRAPING:", initialUrl);

    const response = await axios.get(initialUrl, {
      headers: HEADERS,
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const seasons = [];

    $(".seasons-bx").each((_, seasonEl) => {
      const seasonNumber = parseInt(
        $(seasonEl).find("p span").first().text().trim()
      );

      const totalEpisodes = parseInt(
        $(seasonEl).find(".date").text().replace(/\D/g, "")
      );

      const poster = normalizeUrl(
        $(seasonEl).find("figure img").attr("src")
      );

      const episodes = [];

      $(seasonEl)
        .find("ul.seasons-lst li")
        .each((__, epEl) => {
          const code = $(epEl).find("h3 span").text().trim(); // S1-E1

          const title = $(epEl)
            .find("h3")
            .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim();

          const episode = parseInt(code.split("-E")[1]);

          const image = normalizeUrl(
            $(epEl).find("figure img").attr("src")
          );

          const rawEpisodeUrl = $(epEl).find("a.btn").attr("href");

          const episodeId = rawEpisodeUrl
            ? rawEpisodeUrl
                .replace(BASE_EPISODE_URL, "")
                .replaceAll("/", "")
            : null;

          episodes.push({
            episode,
            code,
            title,
            image,
            episodeId,
          });
        });

      seasons.push({
        season: seasonNumber,
        totalEpisodes,
        poster,
        episodes,
      });
    });

    // ⚠️ fallback if blocked / DOM changed
    if (!seasons.length) {
      return {
        slug,
        seasons: [],
        warning: "Source blocked or DOM changed",
      };
    }

    return {
      slug,
      seasons,
    };
  } catch (err) {
    console.error("SCRAPER ERROR:", err.message);

    return {
      slug,
      seasons: [],
      error: "Failed to scrape (blocked or timeout)",
    };
  }
};

export default scrapeSeasons;
