import { routes } from "./routes.js";
import http from "http";

const PORT = process.env.PORT || 4000;

const server = http.createServer(routes);

export const runServer = () => {
  server.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
}