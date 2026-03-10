const instagramGetUrl = require("instagram-url-direct");

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const getUrl = typeof instagramGetUrl === 'function' ? instagramGetUrl : instagramGetUrl.default;

    if (typeof getUrl !== 'function') {
        throw new Error("Instagram Downloader library failed to load correctly.");
    }

    const links = await getUrl(url);

    if (links && links.url_list && links.url_list.length > 0) {
        return res.status(200).json({ download_url: links.url_list[0] });
    } else {
        return res.status(404).json({ error: "Could not find download link. Make sure the post is public." });
    }

  } catch (error) {
    console.error("Error fetching Instagram URL:", error);
    const errorMessage = error.message || (error.error ? error.error : "Unknown error");
    return res.status(500).json({ error: "Internal Server Error", message: errorMessage });
  }
};
