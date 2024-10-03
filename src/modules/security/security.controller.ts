import express from "express";
import { UserLoginModel } from "./security.models";
import { MongoDBService } from "../database/mongodb.service";


export class SecurityController {

    private mongoDBService: MongoDBService = new MongoDBService(process.env.mongoConnectionString||"localhost:27017");

    //returns whatever you post to it.  You can use the contents of req.body to extract information being sent to the server
    public postLogin(req: express.Request, res: express.Response): void {
        //check body for username and password

        //lookup in database
        //if found, return token
        res.send({ body: req.body });
    }
    public postRegister(req: express.Request, res: express.Response): void {
        const user: UserLoginModel = { username: req.body.username, password: req.body.password };
        if (user.username == null || user.password == null || user.username.trim().length == 0 || user.password.trim().length == 0) {
            res.status(400).send({ error: "Username and password are required" });
        } else {
            let result=this.mongoDBService.connect();
            if (!result) {
                res.status(500).send({ error: "Database connection failed" });
                return;
            }
            //lookup in database
            //if found, return error
            //if not found, create new user with password encrypted with bcrypt
            //return token
            res.send({ body: req.body });
        }
    }
}