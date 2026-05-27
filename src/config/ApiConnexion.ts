import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";
import { StationsEnum } from "../enums/stationsEnum";
dotenv.config();

if (!process.env.RADIOFRANCE_TOKEN) {
  throw new Error("RADIOFRANCE_TOKEN manquant dans le fichier .env");
}

const endpoint = process.env.RADIOFRANCE_ENDPOINT;
const token = process.env.RADIOFRANCE_TOKEN;


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


  async query<T = any, TVariables extends Record<string, unknown> | undefined = Record<string, unknown> | undefined>(
  query: string,
  variables?: TVariables)
  : Promise<T> {
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