import { IncomingMessage, ServerResponse } from "http";
import { controllerGet, controllerDelUser, controllerPut, controllerPost } from "./controller.js";
import { showMessage404 } from "./message.js";

export const routes = (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Content-Type", "application/json");
  
  const urlArr = req.url?.split('/').filter(Boolean) as string[];
  if (urlArr[0] !== 'api' || urlArr[1] !== 'users' || urlArr[3]) {
    showMessage404(res);
    return;
  }
  switch (req.method) {
    case 'GET': 
      controllerGet(res, urlArr[2]);
      break;
    case 'POST':
      if (urlArr[2]) showMessage404(res);
      else controllerPost(req, res);
      break;
    case 'PUT':
      if (!urlArr[2]) showMessage404(res);
      else controllerPut(req, res, urlArr[2]);
      break;
    case 'DELETE':
      if (!urlArr[2]) showMessage404(res);
      else controllerDelUser(res, urlArr[2]);
      break;
    default:
      showMessage404(res);
  }
}
  