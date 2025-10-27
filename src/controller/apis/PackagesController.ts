import { Request, Response } from "express";
import Packages from "../../entity/apps/Packages"; // adjust the path as needed
import Banner from "../../entity/apps/Banner";
import UserVehicle from "../../entity/apps/UserVehicle";
import CarModel from "../../entity/apps/CarModel";
import PriceMapper from "../../entity/apps/PriceMapper";
import Manufacturer from "../../entity/apps/Manufacturer";
import Services from "../../entity/apps/Services";

export const getAllPackages = async (req: Request, res: Response): Promise<any> => {
    try {
        const packages = await Packages.findAll();
        return res.status(200).json(packages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const calculatePrice = (price: number, discount: number): number => {
    const discountedPrice = price - (price * discount) / 100;
    return Math.round(discountedPrice); // optional: round to nearest integer
};

export const getPackageById = async (req: Request, res: Response): Promise<any> => {
    try {
        const packages = await Packages.findByPk(req.params.id);
        const userVehicle = await UserVehicle.findByPk(req.params.userVehicle);

        const cityId = req.headers["cityid"];

        if (!packages || !userVehicle || !cityId) {
            return res.status(200).json({ message: "Packages or Vehicle or cityId not found" });
        }

        const priceMapper = await PriceMapper.findOne({
            where: {
                packageId: req.params.id,
                carModelId: userVehicle.carModelId,
                cityId: cityId,
            }
        });

        if (!priceMapper) {
            return res.status(200).json({ message: "Cannot find the price" });
        }

        const serviceMap = packages.serviceIds;

        const serviceIds = serviceMap.map(s => s.id);

        console.log("my serviceIds", serviceIds);

        const servicesRaw = await Services.findAll({
            where: {
                id: serviceIds,
            },
        });


        const servicesOrdered = serviceMap
            .sort((a, b) => a.order - b.order)
            .map(item => servicesRaw.find(service => service.id === item.id))
            .filter(Boolean);


        const banner_images = servicesOrdered
            .map(service => service?.imageUrl)
            .filter((url): url is string => !!url);

// ... existing code ...
        // Build price object with all computed values
        const rawPrice = Number(priceMapper.price);
        const discountPercent = Number((priceMapper as any).discount ?? 0);
        const discountAmount =  (rawPrice * (discountPercent / 100))// percentage stored in PriceMapper
        const finalAmount = rawPrice - discountAmount;
        const basePrice = +(finalAmount / 1.18).toFixed(2);
        const taxAmount = +(finalAmount - basePrice).toFixed(2);

        const price = {
            price:rawPrice,
            discountAmount:discountAmount,
            basePrice,
            taxAmount,
            finalAmount
        };

        return res.status(200).json({
            packages: {
                packageId: packages.id,
                title: packages.title,

                one_liner: packages.oneLiner,
                description: packages.description,

            },
            price,
            durationMinutes: packages.durationMinutes,
            banner_images,
            serviceInclusions: servicesOrdered,
        });
// ... existing code ...
    } catch (error) {
        console.error("getPackageById error:", error);
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
