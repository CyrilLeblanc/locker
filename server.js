const require = createRequire(import.meta.url);

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { seedDatabase } from "./src/core/seed.js";
import { startBackgroundJobs } from "./src/core/jobs.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import mainRouter from "./src/routes/index.js";
import mongoose from "mongoose";
import path from "path";
import swaggerAutogen from "swagger-autogen";
import swaggerUi from "swagger-ui-express";

dotenv.config();

// Generate Swagger documentation
const doc = {
    info: {
        version: "1.0.0",
        title: "Locker API",
        description:
            "API for the Locker Reservation System - Reserve lockers online with automatic expiration and email notifications.",
    },
    host: "localhost:3000",
    basePath: "/api",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
            description: "JWT token (format: Bearer <token>)",
        },
    },
};

const outputFile = "./swagger-output.json";
const routes = ["./src/routes/api/index.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);

// MongoDB connection
const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const HOST = process.env.MONGO_HOST;
const PORT = process.env.MONGO_PORT;
const DB_NAME = process.env.MONGO_DB_NAME;

mongoose
    .connect(`mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}`)
    .then(async () => {
        console.log("Connected to MongoDB");
        await seedDatabase(); // Seed the database after successful connection
        startBackgroundJobs(); // Start background jobs after successful DB connection
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// Create Express app

const app = express();
const port = Number(process.env.PORT) || 3000;

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (for HTML form POSTs)
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Swagger API documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(require("./swagger-output.json"))
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Mount main router (for pages, API, etc.)
app.use("/", mainRouter);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve Bootstrap CSS and JS from node_modules
app.use(
    "/vendor/bootstrap",
    express.static(path.join(__dirname, "node_modules", "bootstrap", "dist"))
);

// Serve Bootstrap CSS and JS from node_modules
app.use(
    "/vendor/bootstrap-icons",
    express.static(path.join(__dirname, "node_modules", "bootstrap-icons"))
);

app.listen(port, () => {
    console.log(`Locker web app listening at http://localhost:${port}`);
});
