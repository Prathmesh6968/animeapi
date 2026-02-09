import search from "../Scrapers/search.js";

const searchController = async(req,res)=>{
    const q = req.query.q;
    const data = await search(q);
    res.send(data)
}

export default searchController
