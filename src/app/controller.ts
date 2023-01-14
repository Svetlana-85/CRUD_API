import { IncomingMessage, ServerResponse } from "http";
import { getUsers, findPosUser, getOneUser, deleteUser, updateUser, addUser, isvalidUser } from "../users/user.js";
import { validate as uuidValidate } from "uuid";
import { User } from "../users/type.js";

export const controllerGet = (res: ServerResponse, query: string) => {
  try {
    if(!query) {
      res.writeHead(200);
      res.end(JSON.stringify(getUsers()));
      return;
    }
    if (!uuidValidate(query)) {
      res.writeHead(400);
      res.end(JSON.stringify({code: 400, message: "userId is invalid"}));
      return;
    }
    const pos: number = findPosUser(query);
    if (pos === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({code: 404, message: "User not found"}));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify(getOneUser(pos)));
  } catch {
      res.writeHead(500);
      res.end(JSON.stringify({code: 500, message: "Server error"}));
  }
}

export const controllerDelUser = (res: ServerResponse, query: string) => {
  try{
    if(!query) {
      res.writeHead(404);
      res.end(JSON.stringify({code: 404, message: "UserId not found"}));
      return;
    }
    const pos: number = findPosUser(query);
    if (pos === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({code: 404, message:"User not found"}));
        return
    }
    deleteUser(pos);
    res.writeHead(204);
    res.end(JSON.stringify({code: 204, message: "User deleted"}));
  } catch {
    res.writeHead(500);
    res.end(JSON.stringify({code: 500, message: "Server error"}));
  }
}

export const controllerPut = (req: IncomingMessage, res: ServerResponse, query: string) => {
  try {
        if(!query) {
        res.writeHead(404);
        res.end(JSON.stringify({code: 404, message: "UserId not found"}));
        return;
    }
    if (!uuidValidate(query)) {
        res.writeHead(400);
        res.end(JSON.stringify({code: 400, message: "userId is invalid"}));
        return;
    }
    const pos: number = findPosUser(query);
    if (pos === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({code: 404, message: "User not found"}));
        return;
    }
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    })
    req.on('end', () => {
        const user: User = JSON.parse(body);
        if (isvalidUser(user) === 0) {
        res.writeHead(400);
        res.end(JSON.stringify({code: 400, message: "User is invalid"}));
        return;
        }
        res.writeHead(200);
        updateUser(pos, user);
        res.end(JSON.stringify({code: 200, message: "User update"}));
    });
  } catch {
    res.writeHead(500);
    res.end(JSON.stringify({code: 500, message: "Server error"}));
  }
}

export const controllerPost = (req: IncomingMessage, res: ServerResponse): void => {
  try {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        if (isvalidUser(JSON.parse(body)) === 0) {
        res.writeHead(400);
        res.end(JSON.stringify({code: 400, message: "User is invalid"}));
        return;
        }
        res.writeHead(201);
        res.end(JSON.stringify(addUser(body)));
    });
  } catch {
    res.writeHead(500);
    res.end(JSON.stringify({code: 500, message: "Server error"}));
  }
}
