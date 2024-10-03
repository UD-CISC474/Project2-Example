import express from "express";
import { UserLoginModel } from "./security.models";
import { MongoDBService } from "../database/mongodb.service";


export class SecurityController {

    private mongoDBService: MongoDBService = new MongoDBService(process.env.mongoConnectionString||"localhost:27017");
    private database="474";
    private collection="users";

    private makeToken(user:UserLoginModel): string {
        return "test";
    }
    private encryptPassword(password:string): string {
        return password;
    }
    //returns whatever you post to it.  You can use the contents of req.body to extract information being sent to the server
    public postLogin(req: express.Request, res: express.Response): void {
        //check body for username and password

        //lookup in database
        //if found, return token
        res.send({ body: req.body });
    }
    public async postRegister(req: express.Request, res: express.Response): void {
        const user: UserLoginModel = { username: req.body.username, password: req.body.password };
        if (user.username == null || user.password == null || user.username.trim().length == 0 || user.password.trim().length == 0) {
            res.status(400).send({ error: "Username and password are required" });
        } else {
            let result=this.mongoDBService.connect();
            if (!result) {
                res.status(500).send({ error: "Database connection failed" });
                return;
            }
            let dbUser:UserLoginModel|null=await this.mongoDBService.findOne(this.database,this.collection,{username:user.username});
            if (dbUser) {
                res.status(400).send({ error: "User already exists" });
                return;
            }
            user.password=this.encryptPassword(user.password);
            result=this.mongoDBService.insertOne(this.database,this.collection,user);
            if (!result) {
                res.status(500).send({ error: "Database insert failed" });
                return;
            }
            dbUser=await this.mongoDBService.findOne(this.database,this.collection,{username:user.username});
            if (!dbUser) {
                res.status(500).send({ error: "Database insert failed" });
                return;
            }
            dbUser.password="****";
            res.send({ token: this.makeToken(dbUser) });

            
        }
    }
}