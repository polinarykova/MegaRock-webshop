import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "data", "inventory.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    if (!fileContent) {
      return res.status(500).json({ error: "File is empty or invalid." });
    }

    const inventory = JSON.parse(fileContent);
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error reading or parsing file:", error);
    res.status(500).json({ error: "Failed to read or parse the inventory file." });
  }
}
