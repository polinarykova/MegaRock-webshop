import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "data", "inventory.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { item, size } = req.body;
    let inventory = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!inventory[item] || inventory[item][size] === undefined) {
      return res.status(400).json({ error: "Invalid item or size" });
    }

    if (inventory[item][size] > 0) {
      inventory[item][size] -= 1;
      fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));
      return res.status(200).json({ inventory });
    } else {
      return res.status(400).json({ error: "Out of stock" });
    }
  }
}
