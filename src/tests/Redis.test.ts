import { connect, disconnect, testData } from "../config/RedisConnexion";

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
        const userSession = await testData("session123", { id: "abc123", name: "jane", age: "12" });
        console.log('User session data:', userSession);
    }
    catch (err) {
        console.error('Error during getDataTest:', err);
    }
}


//
// connexion();
// storeData();
getData();
