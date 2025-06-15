import { Request, Response } from "express";
import Packages from "../entity/Packages"; // adjust the path as needed
import Banner from "../entity/Banner";

export const getAllPackages = async (req: Request, res: Response): Promise<any> => {
    try {
        const packages = await Packages.findAll();
        return res.status(200).json(packages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getPackageById = async (req: Request, res: Response): Promise<any> => {
    try {
        const packages = await Packages.findByPk(req.params.id);
        if (!packages) {
            return res.status(200).json({ message: "Service not found" });
        }

        const serviceDetails = await Packages.findOne({ where: { serviceId: packages.id } });

        return res.status(200).json({
            serviceDetails
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getHomeBanner = async (req: Request, res: Response): Promise<any> => {
    try {
        const myPackages = await Packages.findAll({
            attributes: ['id', 'title', 'description', 'icon']
        });
        const  myBanner = await Banner.findAll({
           attributes: ['id', 'imageUrl', 'action', 'type','ctaText']
        });

        return res.status(200).json({
            banners:myBanner,
            packages:myPackages

        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const getPopularServices = async (req: Request, res: Response): Promise<any> => {
    try {
        const packages = await Packages.findAll({where: {isPopular: true}, attributes: ['id', 'title', 'description', 'icon']});
        if (!packages) {
            return res.status(200).json({ message: "packages not found" });
        }

        return res.status(200).json({
            packages
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const createPackages = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, icon } = req.body;
        const newPackage = await Packages.create({ title, icon });
        return res.status(201).json(newPackage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create service" });
    }
};

export const updatePackages = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, icon } = req.body;
        const updatePackage = await Packages.findByPk(req.params.id);

        if (!updatePackage) {
            return res.status(200).json({ message: "updatePackage not found" });
        }

        await updatePackage.update({ title, icon });
        return res.status(200).json(updatePackage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update service" });
    }
};

export const deletePackages = async (req: Request, res: Response): Promise<any> => {
    try {
        const packages = await Packages.findByPk(req.params.id);

        if (!packages) {
            return res.status(200).json({ message: "packages not found" });
        }

        await packages.destroy();
        return res.status(200).json({ message: "packages deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete service" });
    }
};
