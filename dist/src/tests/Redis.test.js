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
Object.defineProperty(exports, "__esModule", { value: true });
const RedisConnexion_1 = require("../config/RedisConnexion");
function connexion() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, RedisConnexion_1.connect)();
        }
        catch (err) {
            console.error('Erreur lors de la connexion:', err);
        }
        finally {
            yield (0, RedisConnexion_1.disconnect)();
        }
    });
}
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, RedisConnexion_1.connect)();
            const userSession = yield (0, RedisConnexion_1.testData)("session123", { id: "abc123", name: "jane", age: "12" });
            console.log('User session data:', userSession);
        }
        catch (err) {
            console.error('Error during getDataTest:', err);
        }
    });
}
//
// connexion();
// storeData();
getData();
//# sourceMappingURL=Redis.test.js.map