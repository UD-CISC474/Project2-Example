import express from "express";
import { MongoDBService } from "../database/mongodb.service";
import { InventorySettings } from "./inventory.settings";
import { InventoryItemModel } from "./inventory.models";

/* InventoryController
	* @class: InventoryController
	* @remarks: A class that contains the controller functions for the inventory module
	* 			  getInventory: a function that handles the get inventory request
	* 			  getItem: a function that handles the get item request
	*/
export class InventoryController {

    private mongoDBService: MongoDBService = new MongoDBService(process.env.mongoConnectionString || "mongodb://localhost:27017");
	private settings=new InventorySettings();

	/* getInventory(req: express.Request, res: express.Response): Promise<void>
		@param {express.Request} req: The request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the get inventory request
		@async
	*/
	getInventory = async (req: express.Request, res: express.Response): Promise<void> => {
		try {
			let result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			let items = this.mongoDBService.find<InventoryItemModel>(this.settings.database, this.settings.collection,{});
			res.send(items);
		} catch (error) {
			res.status(500).send({ error: error });
		}
	}
	/* getItem(req: express.Request, res: express.Response): Promise<void>
		@param {express.Request} req: The request object
			expects the id of the item to be in the params array of the request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the get item request
		@async
	*/
	getItem = async (req: express.Request, res: express.Response): Promise<void> => {
		try {
			let result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			let items = this.mongoDBService.findOne<InventoryItemModel>(this.settings.database, this.settings.collection,{_id:req.params.id});
			res.send(items);
		} catch (error) {
			res.status(500).send({ error: error });
		}
	}

	postAddItem = async (req: express.Request, res: express.Response): Promise<void> => {
	}
	putUpdateItem = async (req: express.Request, res: express.Response): Promise<void> => {
	}
	deleteItem = async (req: express.Request, res: express.Response): Promise<void> => {
	}
}