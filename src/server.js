"use strict";

import graphqlHTTP from 'express-graphql';
import express from 'express';
import mongoose from 'mongoose';
import { Schema as schema } from './graphql/schema';

export default function(config) {

	mongoose
		.connect(`mongodb://${config.mongoServer.host}:${config.mongoServer.port}/${config.mongoServer.dbName}`);

	express()
	  .use('/graphql', graphqlHTTP({
			schema: schema, pretty: true, graphiql: true }))
		.use(express.static(config.webServer.folder))
	  .listen(config.webServer.port, function() {
			console.log('Server online!');
		});
}
