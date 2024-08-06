import * as dotenv from "dotenv";

dotenv.config({ path: "./env/config.env" });

const RequiredEnv = [
    "NODE_ENV"
]

for(const env of RequiredEnv) {
    if(!process.env[env]) {
        throw new Error(`${env} is required`)
    }
}
