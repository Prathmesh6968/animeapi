import express from "express";
import freshDrop from "../Scrapers/freash-drop.js";

const freshdrop = async(req,res)=>{
    const data = await freshDrop()
    res.send(data)
}

export default freshdrop