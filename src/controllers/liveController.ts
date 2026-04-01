import { Request, Response } from "express";
import { StationsEnum } from "../enums/stationsEnum";
import { liveApiService } from "../services/liveServices";

export async function getLiveByStation(req: Request, res: Response) {
    try {
        const { station } = req.params;

        if (!Object.values(StationsEnum).includes(station as StationsEnum)) {
            return res.status(400).json({
                success: false,
                error: `Invalid station. Valid stations: ${Object.values(StationsEnum).join(", ")}`
            });
        }

        const live = await liveApiService.getLive(station as StationsEnum);

        return res.status(200).json({
            success: true,
            station,
            data: live
        });
    } catch (error: any) {
        console.error("[liveController] getLiveByStation failed:", error);
        return res.status(error?.response?.status ?? 500).json({
            success: false,
            error: error?.message ?? "Failed to fetch live",
            details: error?.response?.data ?? null
        });
    }
}

