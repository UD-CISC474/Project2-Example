import express from "express";
import {SecurityController} from "./security.controller";

export class SecurityRouter {
    private router: express.Router = express.Router();
    private controller: SecurityController = new SecurityController();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.post("/login", this.controller.postLogin);
        this.router.post("/register", this.controller.postRegister);
        this.router.get("/test", [this.controller.securityMiddleware],this.controller.getTest);
        return this.router;
    }
}