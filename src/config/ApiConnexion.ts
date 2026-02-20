import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";
import {StationsEnum} from "../enums/stationsEnum";

dotenv.config();

if (!process.env.RADIOFRANCE_TOKEN) {
    throw new Error("RADIOFRANCE_TOKEN manquant dans le fichier .env");
}

const endpoint = process.env.RADIOFRANCE_ENDPOINT;
const token = process.env.RADIOFRANCE_TOKEN;

// Connexion API
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

// Envoie de la requête GraphQL avec des variables optionnelles
    async query<T = any>(query: string, variables?: { station: StationsEnum; first: number }): Promise<T> {
        try {
            console.log("Sending Variables:", JSON.stringify(variables));
            const response = await this.client.post("", {
                query,
                variables
            });
            if (response.data.errors) {
                console.error("Détails des erreurs GraphQL:", JSON.stringify(response.data.errors, null, 2));
                throw new Error("Erreur GraphQL Radio France");
            }

            return response.data.data;
        } catch (error: any) {
            if (error.response) {
                console.error("Server Error Data:", error.response.data);
            }
            throw error;
        }
    }
}

export const radioFrance = new RadioFranceClient();
