import { routes } from "./routes.js";
import http from "http";
import * as dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 4000;

export const server = http.createServer(routes);

export const runServer = () => {
  server.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
}

process.on('SIGINT', () => {
  server.close(() => process.exit());
});