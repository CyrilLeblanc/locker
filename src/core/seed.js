import User from "../models/user.js";
import bcrypt from "bcrypt";

/**
 * Seeds the database with a default admin user if none exists
 */
export async function seedDatabase() {
    try {
        // Check if an admin user already exists
        const existingAdmin = await User.findOne({ role: "admin" });

        if (!existingAdmin) {
            const passwordHash = await bcrypt.hash("admin", 10);

            const adminUser = new User({
                username: "admin",
                email: "admin@admin.com",
                passwordHash: passwordHash,
                role: "admin",
            });

            await adminUser.save();
            console.log(
                "Default admin user created (email: admin@admin.com, password: admin)"
            );
        }
    } catch (err) {
        console.error("Error seeding database:", err.message);
    }
}
