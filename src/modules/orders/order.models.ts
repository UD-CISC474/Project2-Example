/* This file contains the models for the inventory module */

/* AddressModel
	* @interface: AddressModel
*/
export interface AddressModel{
	street: string;
	city: string;
	state: string;
	zip: string;
	country: string;
}

/* LineItemModel
	* @interface: LineItemModel
*/
export interface LineItemModel{
	partid: string;
	partno: string;
	description: string;
	quantity: number;
	price: number;
}

/* InventoryOrderModel
	* @interface: InventoryOrderModel
*/
export interface OrderModel{
	orderNumber: string;
	orderDate: Date;
	lineItems: LineItemModel[];
	user:string; //database id of user
	email:string;
	shippingAddress:AddressModel;
	billingAddress:AddressModel;
	_id?:string;
}