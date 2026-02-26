import {createApp} from "./src/app";
import {config} from 'dotenv';
import { startBrandsScheduler } from "./src/schedulers/brandsScheduler";

config();

const app = createApp();
const PORT = process.env.PORT || 3000;

startBrandsScheduler();

app.listen(PORT, () => {
    console.log(`Server is running on port 'http://localhost:${PORT}/`);
});
