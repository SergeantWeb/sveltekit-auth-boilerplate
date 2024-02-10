import type { FilterQuery, Model, QueryOptions } from 'mongoose';
import serverUtils from '$lib/server/serverUtils';

import UserModel from '$lib/server/models/UserModel';

const models: { [key: string]: Model<any> } = {
	user: UserModel
};

const EntityService = {
	get: async (
		modelName: string,
		filter: FilterQuery<any> = {},
		perPage = 0,
		page = 1,
		options?: QueryOptions
	) => {
		return models[modelName]
			.find(filter, null, {
				limit: perPage,
				skip: (page - 1) * perPage,
				...options
			})
			.then(serverUtils.formatEntries);
	},

	getOne: async (modelName: string, filter: FilterQuery<any> = {}) => {
		return models[modelName].findOne(filter).then(serverUtils.formatEntry);
	},

	delete: async (modelName: string, id: string) => {
		return models[modelName].deleteOne({ _id: id });
	},

	add: async (modelName: string, data: any) => {
		if (data.id) delete data.id;
		const item = new models[modelName](data);
		return item.save().then(serverUtils.formatEntry);
	},

	update: async (modelName: string, id: string, data: any) => {
		if (data.id) delete data.id;
		return models[modelName].findOneAndUpdate({ _id: id }, data).then(serverUtils.formatEntry);
	},

	count: async (modelName: string, options = {}) => {
		return models[modelName].countDocuments(options);
	}
};
export default EntityService;
