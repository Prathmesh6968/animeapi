import scrapeSeasons from "../Scrapers/episodes.js";

const episodeController = async (req, res) => {
  try {
    const { episodeId } = req.params; // ✅ destructure

    const data = await scrapeSeasons(episodeId);

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

export default episodeController;
