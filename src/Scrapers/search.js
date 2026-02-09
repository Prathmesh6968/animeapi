import axios from "axios";
import * as cheerio from "cheerio"
import v1_base_url from "../utils/v1_base_url.js";
import { DEFAULT_HEADERS } from "../configs/header.js";

async function search(q){
    const url = `${v1_base_url}/?s=${q}`;
    const {data} = await axios.get(url,{headers:DEFAULT_HEADERS});
    const $ = await cheerio.load(data);
    const anime = []
    $("li.series").each((_,el)=>{
        anime.push({
            title: $(el).find("h2.entry-title").text().trim(),
            animeId: $(el).find("a.lnk-blk").attr("href").replace(`${v1_base_url}/series/`,"").replace("/",""),
            image: $(el).find("img.lazyload").attr("data-src")
        })
    })
    console.log(anime)
    return anime
}

search("op")

export default search