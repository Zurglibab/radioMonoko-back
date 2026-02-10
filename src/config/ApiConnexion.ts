import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RADIOFRANCE_TOKEN) {
    throw new Error("RADIOFRANCE_TOKEN manquant dans le fichier .env");
}

const endpoint = process.env.RADIOFRANCE_ENDPOINT || "[https://openapi.radiofrance.fr/v1/graphql](https://openapi.radiofrance.fr/v1/graphql)";
const token = process.env.RADIOFRANCE_TOKEN;

/**

 * Client GraphQL Radio France
 */
class RadioFranceClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: endpoint,
            headers: {
                "Content-Type": "application/json",
                "x-token": token,
                "Accept": "application/json"
            },
            timeout: 10000
        });
    }

    /**

     * Envoie une requête GraphQL
     */
    async query<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
        try {
            const response = await this.client.post("", {
                query,
                variables
            });

            if (response.data.errors) {
                console.error("GraphQL errors:", response.data.errors);
                throw new Error("Erreur GraphQL Radio France");
            }

            return response.data.data;
        } catch (error: any) {
            console.error("Radio France API Error:", error.message);
            throw error;
        }
    }
}

export const radioFrance = new RadioFranceClient();
