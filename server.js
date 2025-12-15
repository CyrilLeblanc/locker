import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger-output.json');
import mainRouter from './src/routes/index.js';
import mongoose from "mongoose";
import { seedDatabase } from './src/core/seed.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve Bootstrap CSS and JS from node_modules
app.use('/vendor/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));

const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const HOST = process.env.MONGO_HOST;
const PORT = process.env.MONGO_PORT;
const DB_NAME = process.env.MONGO_DB_NAME;

mongoose.connect(`mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("Connected to MongoDB");
  await seedDatabase();
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies (for HTML form POSTs)
app.use(express.urlencoded({ extended: true }));
// Parse cookies
app.use(cookieParser());

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount main router (for pages, API, etc.)
app.use('/', mainRouter);

app.listen(port, () => {
  console.log(`Locker web app listening at http://localhost:${port}`);
});