import Banner from "../entity/Banner"; // adjust the path as needed

export const getBanners = async (): Promise<any> => {
   return await Banner.findAll({
       attributes: ["id", "imageUrl", "action", "type", "ctaText"],
   });

};
