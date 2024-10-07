import express from "express";
import { OrderController } from "./order.controller";
import { SecurityMiddleware } from "../security/security.middleware";


/* OrderRouter
    * @class: OrderRouter
    * @remarks: A class that contains the routes for the order module
    * 			  getRouter: a function that returns a router object
    */
export class OrderRouter {
    private router: express.Router = express.Router();
    private controller: OrderController = new OrderController

    // Creates the routes for this router and returns a populated router object
    /* getRouter(): express.Router
        @returns {express.Router}
        @remarks: creates the routes for this router
    */
    public getRouter(): express.Router {
        this.router.get("/all", [SecurityMiddleware.validateUser], this.controller.getAllOrders);
        this.router.get("/user", [SecurityMiddleware.validateUser], this.controller.getOrders);
        this.router.get("/user/:orderno", [SecurityMiddleware.validateUser], this.controller.getOrder);
        this.router.post("/", [SecurityMiddleware.validateUser], this.controller.postAddOrder);
        this.router.put("/:orderno", [SecurityMiddleware.validateUser, SecurityMiddleware.hasRole("admin")], this.controller.putUpdateOrder);
        this.router.delete("/:orderno", [SecurityMiddleware.validateUser, SecurityMiddleware.hasRole("admin")], this.controller.deleteOrder);
        return this.router;
    }
}