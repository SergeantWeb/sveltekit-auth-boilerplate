import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';

export type User = {
	id: ObjectId;
	email: string;
	username: string;
	password: string;
	sessionToken: string;
	activationToken: string;
	validationToken: string;
	sessionExpire: Date;
	role: string;
	optin: boolean;

	terms?: boolean;
	confirmation?: string;
};

const modelName = 'User';
export default mongoose.models[modelName] ||
	mongoose.model(
		modelName,
		new mongoose.Schema({
			id: mongoose.Schema.ObjectId,
			email: String,
			username: String,
			password: String,
			sessionToken: String,
			activationToken: String,
			validationToken: String,
			sessionExpire: Date,
			role: String,
			optin: Boolean
		}),
		modelName
	);
