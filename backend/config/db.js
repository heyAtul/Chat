import dns from "node:dns";
import mongoose from "mongoose";

// Some routers return broken replies for the SRV lookup that "mongodb+srv://" URIs need,
// so resolve it through public DNS instead.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = () => mongoose.connect(process.env.MONGODB_URI);
