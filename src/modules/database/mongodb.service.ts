import { MongoClient } from 'mongodb';

export class MongoDBService {
	client: MongoClient;
	constructor(private connectionString: string) {
		this.client = new MongoClient(this.connectionString);
	}

	public async connect(): Promise<boolean> {
		try {
			await this.client.connect()
			console.log("Connected to MongoDB")
			return true;
		} catch (err) {
			console.error("Error connecting to MongoDB:", err)
			return false;
		}
	}
	public async insertOne(database: string, collection: string, document: any): Promise<boolean> {
		try {
			await this.client.db(database).collection(collection).insertOne(document)
			console.log("Inserted document into " + collection)
			return true;
		} catch (err) {
			console.error("Error inserting document into " + collection + ":", err)
			return false;
		}
	}
	public async findOne<T>(database: string, collection: string, query: any): Promise<T | null> {
		try {
			const result = await this.client.db(database).collection(collection).findOne(query);
			console.log("Found document in " + collection)
			return result as T;
		} catch (err) {
			console.error("Error finding document in " + collection + ":", err)
			return null;
		}
	}
	public async find<T>(database: string, collection: string, query: any): Promise<T[]> {
		try {
			const result = await this.client.db(database).collection(collection).find(query).toArray();
			console.log("Found documents in " + collection)
			return result as T[];
		} catch (err) {
			console.error("Error finding documents in " + collection + ":", err)
			return [];
		}
	}
	public async updateOne(database: string, collection: string, query: any, update: any): Promise<boolean> {
		try {
			await this.client.db(database).collection(collection).updateOne(query, update)
			console.log("Updated document in " + collection)
			return true;
		} catch (err) {
			console.error("Error updating document in " + collection + ":", err)
			return false;
		}
	}
	public async deleteOne(database: string, collection: string, query: any): Promise<boolean> {
		try {
			await this.client.db(database).collection(collection).deleteOne(query)
			console.log("Deleted document in " + collection)
			return true;
		} catch (err) {
			console.error("Error deleting document in " + collection + ":", err)
			return false;
		}
	}
	public async close(): Promise<void> {
		await this.client.close()
		console.log("Closed connection to MongoDB")
	}
}