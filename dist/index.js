"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, app_1.createApp)();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port 'http://localhost:${PORT}/`);
});
//# sourceMappingURL=index.js.map