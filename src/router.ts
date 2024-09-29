import express from "express";
import {Controller} from "./controller";
import {SecurityRouter} from "./modules/security/security.router";

export class ApiRouter {
    private router: express.Router = express.Router();
    private controller: Controller = new Controller();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.use("/security", new SecurityRouter().getRouter());
        return this.router;
    }
}