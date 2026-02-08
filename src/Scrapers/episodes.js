import axios from "axios";
import * as cheerio from "cheerio";

const BASE_SERIES_URL = "https://animedekho.app/series/";
const BASE_EPISODE_URL = "https://animedekho.app/epi/";

const normalizeUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("//")) return "https:" + url;
  return url;
};

const scrapeSeasons = async (slug) => {
  // 🔥 no -hindi here
  const initialUrl = `${BASE_SERIES_URL}${slug}/`;

  const response = await axios.get(initialUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    maxRedirects: 5, // default hota hai, clarity ke liye
  });

  // 🔥 final redirected URL (e.g. .../jujutsu-kaisen-hindi/)
  const finalSeriesUrl = response.request.res.responseUrl;

  const $ = cheerio.load(response.data);
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
          ? rawEpisodeUrl.replace(BASE_EPISODE_URL, "").replaceAll("/", "")
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

  return {
    slug, // 🔥 actual redirected link
    seasons,
  };
};

export default scrapeSeasons;
