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
	private settings = new InventorySettings();

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
			let items = this.mongoDBService.find<InventoryItemModel>(this.settings.database, this.settings.collection, {});
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
			let items = this.mongoDBService.findOne<InventoryItemModel>(this.settings.database, this.settings.collection, { _id: req.params.id });
			res.send(items);
		} catch (error) {
			res.status(500).send({ error: error });
		}
	}

	/* postAddItem(req: express.Request, res: express.Response): Promise<void>
		@param {express.Request} req: The request object
			expects the id of the item to be in the params array of the request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the add item request
		@async
	*/
	postAddItem = async (req: express.Request, res: express.Response): Promise<void> => {
		try {
			const result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			let item: InventoryItemModel = {
				name: req.body.name,
				description: req.body.description,
				quantity: req.body.quantity,
				price: req.body.price,
				partno: req.body.partno
			};
			const success = await this.mongoDBService.insertOne(this.settings.database, this.settings.collection, item);
			if (success)
				res.send({ success: true });
			else
				res.status(500).send({ error: "Failed to add item" });

		} catch (error) {
			res.status(500).send({ error: error });
		}
	}

	/* putUpdateItem(req: express.Request, res: express.Response): Promise<void>
		@param {express.Request} req: The request object
		expects the id of the item to be in the params array of the request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the update item request
		@async
	*/
	putUpdateItem = async (req: express.Request, res: express.Response): Promise<void> => {
		try {
			const result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			let item: InventoryItemModel = {
				name: req.body.name,
				description: req.body.description,
				quantity: req.body.quantity,
				price: req.body.price,
				partno: req.body.partno
			};
			const success = await this.mongoDBService.updateOne(this.settings.database, this.settings.collection, { _id: req.params.id }, item);
			if (success)
				res.send({ success: true });
			else
				res.status(500).send({ error: "Failed to update item" });

		} catch (error) {
			res.status(500).send({ error: error });
		}
	}

	/* deleteItem(req: express.Request, res: express.Response): Promise<void>
			@param {express.Request} req: The request object
			expects the id of the item to be in the params array of the request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the delete item request and archives the item
		@async
	*/
	deleteItem = async (req: express.Request, res: express.Response): Promise<void> => {
		try {
			const result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			const item = await this.mongoDBService.findOne<InventoryItemModel>(this.settings.database, this.settings.collection, { _id: req.params.id });
			if (!item) {
				res.status(404).send({ error: "Item not found" });
				return;
			}
			item._id = undefined;
			let success = await this.mongoDBService.insertOne(this.settings.database, this.settings.archiveCollection, item);
			if (!success) {
				console.log("Failed to archive item");
				return;
			}
			success = await this.mongoDBService.deleteOne(this.settings.database, this.settings.collection, { _id: req.params.id });
			if (!success) {
				res.status(500).send({ error: "Failed to delete item" });
				return;
			}
		} catch (error) {
			res.status(500).send({ error: error });
		}
	}
}