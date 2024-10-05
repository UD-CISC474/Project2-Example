import express from "express";
import { UserLoginModel } from "./security.models";
import { MongoDBService } from "../database/mongodb.service";
import bcrypt from 'bcryptjs';


export class SecurityController {

    private mongoDBService: MongoDBService = new MongoDBService(process.env.mongoConnectionString || "mongodb://localhost:27017");
    private database = "474";
    private collection = "users";

    private makeToken(user: UserLoginModel): string {
        return "test";
    }
    private encryptPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            let hashval: string = "";
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    resolve(hash);
                });
            });
        });
    }

    //returns whatever you post to it.  You can use the contents of req.body to extract information being sent to the server
    public async postLogin(req: express.Request, res: express.Response): Promise<void> {
        //check body for username and password
        return new Promise(async (resolve, reject) => {
            const user: UserLoginModel = { username: req.body.username, password: req.body.password };
            if (user.username == null || user.password == null || user.username.trim().length == 0 || user.password.trim().length == 0) {
                res.status(400).send({ error: "Username and password are required" });
            } else {
                try {
                    let result = await this.mongoDBService.connect();
                    if (!result) {
                        res.status(500).send({ error: "Database connection failed" });
                        return;
                    }
                    let dbUser: UserLoginModel | null = await this.mongoDBService.findOne(this.database, this.collection, { username: user.username });
                    if (!dbUser) {
                        throw { error: "User not found" };
                    }
                    bcrypt.compare(user.password, dbUser.password, (err, result) => {
                        if (err) {
                            throw { error: "Password comparison failed" };
                        } else if (result) {
                            dbUser.password = "****";
                            res.send({ token: this.makeToken(dbUser) });
                        } else {
                            throw { error: "Password does not match" };
                        }
                    });
                } catch (err) {
                    console.error(err);
                    res.status(500).send(err);
                } finally {
                    this.mongoDBService.close();
                }
            }
        });
        //lookup in database
        //if found, return token
        res.send({ body: req.body });
    }
    public postRegister = async (req: express.Request, res: express.Response): Promise<void> => {
        const user: UserLoginModel = { username: req.body.username, password: req.body.password };
        if (user.username == null || user.password == null || user.username.trim().length == 0 || user.password.trim().length == 0) {
            res.status(400).send({ error: "Username and password are required" });
        } else {
            try {
                let result = await this.mongoDBService.connect();
                if (!result) {
                    res.status(500).send({ error: "Database connection failed" });
                    return;
                }
                let dbUser: UserLoginModel | null = await this.mongoDBService.findOne(this.database, this.collection, { username: user.username });
                if (dbUser) {
                    throw { error: "User already exists" };
                }
                user.password = await this.encryptPassword(user.password);
                result = await this.mongoDBService.insertOne(this.database, this.collection, user);
                if (!result) {
                    throw { error: "Database insert failed" };
                }
                dbUser = await this.mongoDBService.findOne(this.database, this.collection, { username: user.username });
                if (!dbUser) {
                    throw { error: "Database insert failed" };
                }
                dbUser.password = "****";
                res.send({ token: this.makeToken(dbUser) });
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            } finally {
                this.mongoDBService.close();
            }
        }
    }
}