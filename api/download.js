const instagramGetUrl = require("instagram-url-direct");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const result = await instagramGetUrl(url);

    // Log result to debug if needed (Vercel logs)
    console.log("Instagram result:", JSON.stringify(result, null, 2));

    // result typically looks like { results_number: 1, url_list: [ '...' ] }
    if (result && result.url_list && result.url_list.length > 0) {
      return res.status(200).json({
        download_url: result.url_list[0]
      });
    } else {
      return res.status(404).json({ error: "No download link found for this URL. Result: " + JSON.stringify(result) });
    }
  } catch (err) {
    console.error("Error fetching Instagram URL:", err);
    return res.status(500).json({ error: "Failed to process request: " + err.message });
  }
};
