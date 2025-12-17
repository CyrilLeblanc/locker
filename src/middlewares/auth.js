import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { JWT_SECRET } from "../core/config.js";

/**
 * Helper function to verify JWT token and get user
 * @param {string} token - JWT token
 * @returns {Promise<{user: object|null, error: string|null}>}
 */
const verifyTokenAndGetUser = async (token) => {
    if (!token) {
        return { user: null, error: "No token provided" };
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findUserByEmail(decoded.email);

        if (!user) {
            return { user: null, error: "User not found" };
        }

        return { user, error: null };
    } catch (err) {
        return { user: null, error: "Invalid token" };
    }
};

/**
 * Middleware to verify JWT token from cookie (for API routes)
 */
export const authenticate = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res
            .status(401)
            .json({ error: "Access denied. No token provided." });
    }

    const { user, error } = await verifyTokenAndGetUser(token);

    if (error) {
        return res
            .status(401)
            .json({
                error:
                    error === "User not found"
                        ? "Invalid token. User not found."
                        : "Invalid token.",
            });
    }

    req.user = user;
    next();
};

/**
 * Middleware to verify JWT token from cookie (for page routes)
 */
export const authenticatePage = async (req, res, next) => {
    const token = req.cookies?.token;
    const { user, error } = await verifyTokenAndGetUser(token);

    if (error) {
        return res.redirect("/login");
    }

    req.user = user;
    next();
};

/**
 * Middleware to check if user is admin (for page routes)
 */
export const isAdminPage = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).render("pages/login", {
            title: "Access Denied",
            error: "Admin privileges required.",
        });
    }
    next();
};

/**
 * Middleware to check if user is admin (for API routes)
 */
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res
            .status(403)
            .json({ error: "Access denied. Admin privileges required." });
    }
    next();
};

/**
 * Helper to check if user owns a resource or is admin
 * @param {object} user - Current user from request
 * @param {string} resourceUserId - User ID associated with the resource
 * @returns {boolean} - True if user owns resource or is admin
 */
export const canAccessResource = (user, resourceUserId) => {
    return (
        user._id.toString() === resourceUserId.toString() ||
        user.role === "admin"
    );
};
