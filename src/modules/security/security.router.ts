import express from "express";
import {SecurityController} from "./security.controller";

export class SecurityRouter {
    private router: express.Router = express.Router();
    private controller: SecurityController = new SecurityController();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.post("/login", this.controller.postLogin);
        
        return this.router;
    }
}