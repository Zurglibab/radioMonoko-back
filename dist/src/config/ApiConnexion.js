"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.radioFrance = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.RADIOFRANCE_TOKEN) {
    throw new Error("RADIOFRANCE_TOKEN manquant dans le fichier .env");
}
const endpoint = process.env.RADIOFRANCE_ENDPOINT;
const token = process.env.RADIOFRANCE_TOKEN;
// Connexion API
class RadioFranceClient {
    constructor() {
        this.client = axios_1.default.create({
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
    query(query, variables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Sending Variables:", JSON.stringify(variables));
                const response = yield this.client.post("", {
                    query,
                    variables
                });
                if (response.data.errors) {
                    console.error("Détails des erreurs GraphQL:", JSON.stringify(response.data.errors, null, 2));
                    throw new Error("Erreur GraphQL Radio France");
                }
                return response.data.data;
            }
            catch (error) {
                if (error.response) {
                    console.error("Server Error Data:", error.response.data);
                }
                throw error;
            }
        });
    }
}
exports.radioFrance = new RadioFranceClient();
//# sourceMappingURL=ApiConnexion.js.map