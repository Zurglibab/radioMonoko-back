// ...existing code...
import { getBrandAPI } from "../API/APIGetData";

export async function refreshBrandsInRedis() {
    // getBrandAPI already stores brands in Redis as a side effect
    return await getBrandAPI();
}

