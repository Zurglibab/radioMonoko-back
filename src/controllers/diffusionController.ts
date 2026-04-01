import { Request, Response } from "express";
import { StationsEnum } from "../enums/stationsEnum";
import { diffusionApiService } from "../services/diffusionServices";

export async function getDiffusionsByStation(req: Request, res: Response) {
    try {
        const { station } = req.params;
        const { first, themes, theme } = req.query as {
            first?: string;
            themes?: string;
            theme?: string;
        };

        if (!Object.values(StationsEnum).includes(station as StationsEnum)) {
            return res.status(400).json({
                success: false,
                error: `Invalid station. Valid stations: ${Object.values(StationsEnum).join(", ")}`
            });
        }

        const parsedFirstRaw = typeof first === "string" ? parseInt(first, 10) : NaN;
        const parsedFirst = Number.isFinite(parsedFirstRaw) && parsedFirstRaw > 0
            ? parsedFirstRaw
            : 20;

        // Supporte ?theme=id et ?themes=id1,id2
        const rawThemes = typeof themes === "string"
            ? themes
            : typeof theme === "string"
                ? theme
                : "";

        const parsedThemes = rawThemes
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        if (parsedThemes.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Missing required query param: theme (or themes). Example: ?theme=<id> or ?themes=<id1>,<id2>"
            });
        }

        const diffusions = await diffusionApiService.getDiffusions(
            station as StationsEnum,
            parsedThemes,
            parsedFirst
        );

        return res.status(200).json({
            success: true,
            station,
            themes: parsedThemes,
            count: diffusions.length,
            data: diffusions
        });
    } catch (error: any) {
        console.error("[diffusionController] getDiffusionsByStation failed:", error);
        return res.status(error?.response?.status ?? 500).json({
            success: false,
            error: error?.message ?? "Failed to fetch diffusions",
            details: error?.response?.data ?? null
        });
    }
}
