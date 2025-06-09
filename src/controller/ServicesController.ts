import { Request, Response } from "express";
import Packages from "../entity/Packages"; // adjust the path as needed
import ServicesDetails from '../entity/ServiceDetails';

export const getAllServices = async (req: Request, res: Response): Promise<any> => {
    try {
        const services = await Packages.findAll();
        return res.status(200).json(services);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getServiceById = async (req: Request, res: Response): Promise<any> => {
    try {
        const service = await Packages.findByPk(req.params.id);
        if (!service) {
            return res.status(200).json({ message: "Service not found" });
        }

        const serviceDetails = await ServicesDetails.findOne({ where: { serviceId: service.id } });

        return res.status(200).json({
            serviceDetails
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getPopularServices = async (req: Request, res: Response): Promise<any> => {
    try {
        const service = await Packages.findAll({where: {isPopular: true}});
        if (!service) {
            return res.status(200).json({ message: "Service not found" });
        }

        return res.status(200).json({
            service
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const createService = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, icon } = req.body;
        const newService = await Packages.create({ title, icon });
        return res.status(201).json(newService);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create service" });
    }
};

export const updateService = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, icon } = req.body;
        const service = await Packages.findByPk(req.params.id);

        if (!service) {
            return res.status(200).json({ message: "Service not found" });
        }

        await service.update({ title, icon });
        return res.status(200).json(service);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update service" });
    }
};

export const deleteService = async (req: Request, res: Response): Promise<any> => {
    try {
        const service = await Packages.findByPk(req.params.id);

        if (!service) {
            return res.status(200).json({ message: "Service not found" });
        }

        await service.destroy();
        return res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete service" });
    }
};
