import { ServerResponse } from "http";

export const showMessage404 = (res: ServerResponse): void => {
    res.writeHead(404);
    res.end(JSON.stringify({error:"Resource not found"}));
}