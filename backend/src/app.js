import Fastify from "fastify";
import multipart from "@fastify/multipart";
import routes from "./routes.js";
import { connectDB } from "./config/db.js";
import jwtPlugin from "./plugins/jwt.js";
import "./config/env.js";
import { errorHandler } from "./utils/errorHandler.js";
import { seedAdmin } from "./seeders/admin.seeder.js";
import registerCors from "./plugins/cors.js";

const app = Fastify({ logger: true });

await connectDB();
await seedAdmin();
await registerCors(app)
await app.register(multipart);
await app.register(jwtPlugin);
errorHandler(app);
await app.register(routes, { prefix: '/api' });

export default app;
