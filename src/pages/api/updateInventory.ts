import { NextApiRequest, NextApiResponse } from "next";

export default async function updateInventory(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.API_KEY;
  const binId = process.env.BIN_ID;

  if (!apiKey || !binId) {
    return res.status(500).json({ error: "API key or bin ID not set in environment variables." });
  }

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": apiKey,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Failed to update data in JSONBin. Status: ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
