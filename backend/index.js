import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import logger from './src/utils/logger.js';
import connectDB from './src/startup/db.js';
import loggerConfig from './src/middleware/loggerConfig.js';
import corsPrefs from './src/middleware/corsPrefs.js';
import algorithmRoutes from "./src/routes/algorithmRoutes.js";
dotenv.config();
connectDB();

const app = express();


app.use(corsPrefs);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(loggerConfig);
app.use("/api/algorithms", algorithmRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
})

