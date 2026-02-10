"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /users - example endpoint
router.get('/', (req, res) => {
    res.json({ message: 'Users route is working' });
});
// POST /users - example create endpoint
router.post('/', (req, res) => {
    const user = req.body;
    // ici on renverra simplement l'objet reçu pour l'exemple
    res.status(201).json({ message: 'User created', user });
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map