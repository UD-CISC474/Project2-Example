import express from "express";
import {SecurityRouter} from "./modules/security/security.router";

export class ApiRouter {
    private router: express.Router = express.Router();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.use("/security", new SecurityRouter().getRouter());
        return this.router;
    }
}