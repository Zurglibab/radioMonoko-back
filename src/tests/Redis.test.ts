import {connect, disconnect, storeDataTest, deleteData, getDataTest} from "../config/RedisConnexion";
import {getBrandTest} from "./API.test";
import {getBrandsFromRedis, storeBrandsInRedis} from "../database/Redis/dataStockage";
import {Brand} from "../interface/brandInterface";


async function connexion() {
    try {
        await connect();
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
    } finally {
        await disconnect();
    }
}

async function getData(){
    try {
        await connect();
        const userSession = await getDataTest("session123");
        console.log('User session data:', userSession);
    }
    catch (err) {
        console.error('Error during getDataTest:', err);
    }
}

async function storeData(){
    try {
        await connect();
        const userSession = await storeDataTest("session123", { id: "abc123", name: "jane", age: "12" });
        console.log('User session data:', userSession);
    }
    catch (err) {
        console.error('Error during getDataTest:', err);
    }
}

async function deleteRedisData(){
    try {
        await connect();
        await deleteData("session123");
    }
    catch (err) {
        console.error('Error during deleteDataTest:', err);
    }
}

async function storeBrands(){
    try {
        await connect();
        const allBrands = await getBrandTest();
        await storeBrandsInRedis(allBrands);
    }
    catch (err) {
        console.error('Error during storeBrands:', err);
    }
}


//Affiche toutes les brandes dans Redis (affiche les ids stockés dans le set "brands:ids")
async function getBrands(){
    try {
        const brandIds = await getBrandsFromRedis();
        if (brandIds) {
            brandIds.forEach((id) => {
                console.log('Brand ID:', id);
            })
        }
        await disconnect();
    }
    catch (err) {
        console.error('Error during getBrands:', err);
    }
}

async function deleteBrands(){
    try {
        await connect();
        await deleteData("brands:all");
        await disconnect()
    }
    catch (err) {
        console.error('Error during deleteBrands:', err);
    }
}


// connexion();
// storeData();
// getData();
// deleteRedisData();

// storeBrands();
getBrands();
// deleteBrands();


