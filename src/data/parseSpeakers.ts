import fs from "node:fs";
import path from "node:path";

export interface Speaker {
    name: string;
    photoPath: string;
    title: string;
    description: string;
    website?: string;
}

function parseTsvValue(value: string): string {
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }
    return value;
}

function toSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-/, "")
        .replace(/-$/, "");
}

function getExtension(url: string): string {
    const match = url.match(/\.(\w+)$/);
    return match ? match[1] : "jpg";
}

export function loadSpeakers(): Speaker[] {
    const tsvPath = path.join(process.cwd(), "src/data/speakers.tsv");
    const tsvContent = fs.readFileSync(tsvPath, "utf-8");
    const lines = tsvContent.split("\n");
    const dataLines = lines.slice(3).filter((line) => line.trim() !== "");

    return dataLines
        .map((line) => {
            const parts = line.split("\t");
            const name = parseTsvValue(parts[0] || "");
            const photoUrl = parseTsvValue(parts[2] || "");
            const extension = getExtension(photoUrl);
            return {
                name,
                photoPath: `/speakers/${toSlug(name)}.${extension}`,
                title: parseTsvValue(parts[4] || ""),
                description: parseTsvValue(parts[5] || ""),
                website: parseTsvValue(parts[6] || ""),
            };
        })
        .filter((s) => s.name && s.title);
}
