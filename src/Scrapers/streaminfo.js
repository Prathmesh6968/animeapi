import axios from "axios";
import * as cheerio from "cheerio";
import v1_base_url from "../utils/v1_base_url.js";
import { DEFAULT_HEADERS } from "../configs/header.js";

async function streamInfo(episodeId) {
  try {
    if (!episodeId) {
      return {
        success: false,
        message: "episodeId is required",
        data: []
      };
    }

    const url = `${v1_base_url}/episode/${episodeId}`;

    const { data: html } = await axios.get(url, {
      headers: DEFAULT_HEADERS
    });

    const $ = cheerio.load(html);

    const iframe = $("iframe").attr("src");

    const data = [];

    if (iframe) {
      data.push({
        iframe: iframe.startsWith("//") ? "https:" + iframe : iframe
      });
    }
    console.log(data)
    return {
      success: true,
      message: "Stream info fetched successfully",
      data
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
}


export default streamInfo;
