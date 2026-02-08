import streamInfo from "../Scrapers/streaminfo.js";

const iframe = async(req,res)=>{
    const {episodeId} = req.params;
    const data = await streamInfo(episodeId);
    res.send(data)
}

export default iframe