import express from "express";


export class SecurityController {


    //returns whatever you post to it.  You can use the contents of req.body to extract information being sent to the server
    public postLogin(req: express.Request, res: express.Response): void {
        //check body for username and password

        //lookup in database
        //if found, return token
        res.send({body: req.body});
    }
    public postRegister(req: express.Request, res: express.Response): void {
        //check body for username and password
        //lookup in database
        //if found, return error
        //if not found, create new user with password encrypted with bcrypt
        //return token
        res.send({body: req.body});
    }
}