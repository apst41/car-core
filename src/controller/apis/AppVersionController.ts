import { Request, Response } from "express";
import AppVersion from "../../entity/apps/AppVersion";

export const checkAppVersion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { platform, version } = req.query;

        if (!platform || !version) {
            return res.status(400).json({
                message: "Missing platform or version parameter",
            });
        }

        const appVersion = await AppVersion.findOne({
            where: {
                platform: platform as string,
                isActive: true,
            },
        });

        if (!appVersion) {
            return res.status(404).json({
                message: "No active configuration found for this platform",
            });
        }

        // Default values
        let status: "ok" | "optional_update" | "force_update" = "ok";
        let message = "Your app is up to date.";
        let versionInfo: any = null;

        // ✅ Helper: check if version exists in JSON column
        const checkVersion = (field: any, v: string): boolean => {
            if (!field) return false;

            if (field.version && typeof field.version === "string") {
                return field.version === v;
            }

            if (field.versions && Array.isArray(field.versions)) {
                return field.versions.includes(v);
            }

            return false;
        };

        // ✅ Decide status + message + return only matched object
        if (checkVersion(appVersion.latestVersion, version as string)) {
            status = "ok";
            message = appVersion.latestVersion.message || "Your app is on the latest version.";
            versionInfo = appVersion.latestVersion;
        } else if (checkVersion(appVersion.optionalVersion, version as string)) {
            status = "optional_update";
            message = appVersion.optionalVersion.message || "A new version is available. Update now for latest features.";
            versionInfo = appVersion.optionalVersion;
        } else if (checkVersion(appVersion.forceUpdateVersion, version as string)) {
            status = "force_update";
            message = appVersion.forceUpdateVersion.message || "A new version is available. Please update to continue.";
            versionInfo = appVersion.forceUpdateVersion;
        }

        return res.status(200).json({
            status,
            update_url: appVersion.updateUrl,
            message,
        });
    } catch (error) {
        console.error("Error checking app version:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
