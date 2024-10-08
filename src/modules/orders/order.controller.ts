import express from "express";
import { MongoDBService } from "../database/mongodb.service";
import { OrderSettings } from "./order.settings";
import { OrderModel } from "./order.models";

/* InventoryController
	* @class: InventoryController
	* @remarks: A class that contains the controller functions for the inventory module
	* 			  getInventory: a function that handles the get inventory request
	* 			  getItem: a function that handles the get item request
	*/
export class OrderController {

    private mongoDBService: MongoDBService = new MongoDBService(process.env.mongoConnectionString || "mongodb://localhost:27017");
	private settings=new OrderSettings();

	/* generateOrderNumber():string
		@returns {string}: A string that represents the next order number
		@remarks: Generates the next order number
		@throws: {Error}: Throws an error if the order number cannot be generated
	*/
	private generateOrderNumber= async ():Promise<string>=>{
		//.findOneAndUpdate({_id: ObjectId('5ed7f23789bcd51e9c6a82e0')}, {$inc: {nextTicket: 1}}, {returnOriginal: false})
		//see if orderNumber collection exists and if not seed it
		const result = await this.mongoDBService.connect();
		if (!result) {
			throw("Database connection failed");
		}
		let collection=await this.mongoDBService.find(this.settings.database, this.settings.orderNumberCollection,{});
		if (collection.length===0){
			await this.mongoDBService.insertOne(this.settings.database, this.settings.orderNumberCollection,{nextOrder:1000});
		}
		//get the last order number
		let ordernumber=await this.mongoDBService.findOneAndUpdate<{nextOrder:number}>(this.settings.database,this.settings.collection,{}, {$inc: {nextTicket: 1}});
		if (!ordernumber){
			throw("Failed to generate order number");
		}
		return (ordernumber.nextOrder+1).toString();
	}

	/* getAllOrders(req: express.Request, res: express.Response): Promise<void>
		@param {express.Request} req: The request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the get orders request
		@async
	*/
	getAllOrders = async (req: express.Request, res: express.Response): Promise<void> => {
		try {
			let result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			let orders = this.mongoDBService.find<OrderModel>(this.settings.database, this.settings.collection,{});
			res.send(orders);
		} catch (error) {
			res.status(500).send({ error: error });
		}
	}

	/* getOrders(req: express.Request, res: express.Response): Promise<void>
		@param {express.Request} req: The request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the get orders request
		@async
	*/
	getOrders = async (req: express.Request, res: express.Response): Promise<void> => {
		try {
			let result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			let orders = this.mongoDBService.find<OrderModel>(this.settings.database, this.settings.collection,{user:req.body.user._id});
			res.send(orders);
		} catch (error) {
			res.status(500).send({ error: error });
		}
	}
	/* getOrder(req: express.Request, res: express.Response): Promise<void>
		@param {express.Request} req: The request object
			expects the order number of the order to be in the params array of the request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the get order request
		@async
	*/
	getOrder = async (req: express.Request, res: express.Response): Promise<void> => {
		try {
			let result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			let items = this.mongoDBService.findOne<OrderModel>(this.settings.database, this.settings.collection,{OrderNumber:req.params.orderno,user:req.body.user._id});
			res.send(items);
		} catch (error) {
			res.status(500).send({ error: error });
		}
	}

	/* postAddOrder(req: express.Request, res: express.Response): Promise<void>
		@param {express.Request} req: The request object
			expects the order to be in the body of the request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the add order request
		@async
	*/
	postAddOrder = async (req: express.Request, res: express.Response): Promise<void> => {
		try{
			const result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			let order: OrderModel = {
				orderNumber: await this.generateOrderNumber(),
				orderDate: new Date(),
				billingAddress: req.body.BillingAddress,
				shippingAddress: req.body.ShippingAddress,
				email: req.body.user.email,
				lineItems: req.body.LineItems,
				user:req.body.user._id
			};
			const success = await this.mongoDBService.insertOne(this.settings.database, this.settings.collection, order);
			if (success)
				res.send({ success: true });
			else
				res.status(500).send({ error: "Failed to add order" });

		}catch(error){
			res.status(500).send({ error: error });
		}
	}
	/* putUpdateOrder(req: express.Request, res: express.Response): Promise<void>
		@param {express.Request} req: The request object
			expects the order to be in the body of the request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the update order request
		@async
	*/
	putUpdateOrder = async (req: express.Request, res: express.Response): Promise<void> => {
		try{
			const result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			let order: OrderModel = {
				orderNumber: req.body.OrderNumber,
				orderDate: req.body.OrderDate,
				billingAddress: req.body.BillingAddress,
				shippingAddress: req.body.ShippingAddress,
				email: req.body.user.email,
				lineItems: req.body.LineItems,
				user:req.body.user._id
			};
			const success = await this.mongoDBService.updateOne(this.settings.database, this.settings.collection,{OrderNumber:req.params.orderno},order);
			if (success)
				res.send({ success: true });
			else
				res.status(500).send({ error: "Failed to update order" });

		}catch(error){
			res.status(500).send({ error: error });
		}
	}
	/* deleteOrder(req: express.Request, res: express.Response): Promise<void>
		@param {express.Request} req: The request object
			expects the order number of the order to be in the params array of the request object
		@param {express.Response} res: The response object
		@returns {Promise<void>}:
		@remarks: Handles the delete order request
		@async
	*/
	deleteOrder = async (req: express.Request, res: express.Response): Promise<void> => {
		try{
			const result = await this.mongoDBService.connect();
			if (!result) {
				res.status(500).send({ error: "Database connection failed" });
				return;
			}
			const item=await this.mongoDBService.findOne<OrderModel>(this.settings.database, this.settings.collection,{_id:req.params.id});
			if (!item){
				res.status(404).send({ error: "Item not found" });
				return;
			}
			item._id=undefined;
			let success=await this.mongoDBService.insertOne(this.settings.database, this.settings.archiveCollection, item);
			if (!success){
				console.log("Failed to archive item");
				return;
			}
			success = await this.mongoDBService.deleteOne(this.settings.database, this.settings.collection,{_id:req.params.id});
			if (!success){
				res.status(500).send({ error: "Failed to delete item" });
				return;
			}
		}catch(error){
			res.status(500).send({ error: error });
		}
	}
}