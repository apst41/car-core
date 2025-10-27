import NodeCache from "node-cache";
import User from "../../entity/apps/User";
import Address from "../../entity/apps/UserAddress"
import Packages from "../../entity/apps/Packages";

const addressPartnerCache = new NodeCache();

const packagePartnerCache = new NodeCache();
const userPartnerCache = new NodeCache();


export const getCachedAddressById = async (id:any) => {
    if (!id) return null;

    const cached = addressPartnerCache.get(id);
    if (cached) return cached;

    const address = await Address.findByPk(id);

    if (address) {
        addressPartnerCache.set(id, address);
    }

    return address;
};

export const getPackagePartnerById = async (id:any) => {
    if (!id) return null;

    const cached = packagePartnerCache.get(id);
    if (cached) return cached;

    const packages = await Packages.findByPk(id, {
        attributes: ['id','name','title']
    });
    if (packages) {
        packagePartnerCache.set(id, packages);
    }

    return packages;
};


export const getUser = async (id:any) => {
    if (!id) return null;
    const cached = userPartnerCache.get(id);
    if (cached) return cached;

    const user = await User.findByPk(id, {
        attributes: ['id', 'mobileNo','name']
    });

    if (user){
        userPartnerCache.set(id, user);
    }

    return user;
}

