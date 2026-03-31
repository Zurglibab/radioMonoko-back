import { connect, disconnect, testData } from "../config/RedisConnexion";

describe('Redis Connection', () => {
    beforeAll(async () => {
        try {
            await connect();
        } catch (err) {
            console.error('Erreur lors de la connexion:', err);
        }
    });

    afterAll(async () => {
        await disconnect();
    });

    it('devrait stocker et récupérer des données de la session asynchrone', async () => {
        const userSession = await testData("session123", { id: "abc123", name: "jane", age: "12" });
        expect(userSession).toBeDefined();
        expect(userSession.id).toBe("abc123");
        expect(userSession.name).toBe("jane");
    });
});
