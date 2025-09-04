import { Request, Response } from "express";
import AppVersion from "../../entity/apps/AppVersion";

export const checkAppVersion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { platform, version } = req.query;

        if (!platform || !version) {
            return res.status(400).json({
                message: "Missing platform or version parameter"
            });
        }

        const appVersion = await AppVersion.findOne({
            where: {
                platform: platform as string,
                appVersion: version as string,
                isActive: true,
            },
        });

        if (!appVersion) {
            return res.status(404).json({
                message: "Version configuration not found for this platform and version"
            });
        }

        // Determine message based on status
        let message = appVersion.forceUpdateMessage;
        if (appVersion.status === "optional_update") {
            message = appVersion.optionalUpdateMessage;
        } else if (appVersion.status === "ok") {
            message = "Your app is up to date.";
        }

        return res.status(200).json({
            status: appVersion.status,
            latest_version: appVersion.latestVersion,
            min_supported_version: appVersion.minSupportedVersion,
            update_url: appVersion.updateUrl,
            message,
        });

    } catch (error) {
        console.error("Error checking app version:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Admin endpoints for managing app versions
export const createOrUpdateAppVersion = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            platform,
            appVersion,
            latestVersion,
            minSupportedVersion,
            updateUrl,
            forceUpdateMessage,
            optionalUpdateMessage,
            status
        } = req.body;

        if (!platform || !appVersion || !latestVersion || !minSupportedVersion || !updateUrl) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const [versionConfig, created] = await AppVersion.upsert({
            platform,
            appVersion,
            latestVersion,
            minSupportedVersion,
            updateUrl,
            forceUpdateMessage,
            optionalUpdateMessage,
            status: status || "force_update",
            isActive: true,
        });

        return res.status(created ? 201 : 200).json({
            message: created ? "App version created" : "App version updated",
            data: versionConfig,
        });

    } catch (error) {
        console.error("Error creating/updating app version:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getAllAppVersions = async (req: Request, res: Response): Promise<any> => {
    try {
        const appVersions = await AppVersion.findAll({
            where: { isActive: true },
        });

        return res.status(200).json({
            data: appVersions,
        });

    } catch (error) {
        console.error("Error fetching app versions:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};