import axios from "axios";
import * as cheerio from "cheerio";
import v1_base_url from "../utils/v1_base_url.js";
import { DEFAULT_HEADERS } from "../configs/header.js";

const freshDrop = async () => {
  const url = `${v1_base_url}`;
  const { data } = await axios.get(url, DEFAULT_HEADERS);

  const $ = cheerio.load(data);
  const freshdropData = [];

  $("div.swiper-slide.latest-ep-swiper-slide").each((_, el) => {
    const href = $(el).find("a.lnk-blk").attr("href");

    freshdropData.push({
      title: $(el).find("h2.entry-title").text().trim(),
      season: $(el).find("span.post-ql").text().trim(),
      episode: $(el).find("span.year").text().trim(),
      episodeId: href
        ? href.replace("https://animesalt.top/series/", "")
        : null,
      image: $(el).find("img").attr("data-src"),
      imageAlt: $(el).find("img").attr("alt")?.trim(),
    });
  });

  console.log(freshdropData);
  return freshdropData;
};




export default freshDrop