import bcrypt from "bcrypt";
import User from "../modules/user/user.model.js";

export const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPhone = process.env.ADMIN_PHONE;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn("⚠️ Admin seeder skipped: env not configured");
      return;
    }

    const exists = await User.findOne({
      role: "admin",
      $or: [{ email: adminEmail }, { phone: adminPhone }],
    });

    if (exists) {
      console.log("✅ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Super Admin",
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("🚀 Admin user created successfully");
  } catch (err) {
    console.error("❌ Admin seeder failed:", err.message);
  }
};
