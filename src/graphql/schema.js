"use strict";

import {
	GraphQLSchema, GraphQLObjectType, GraphQLString,
	GraphQLInt, GraphQLList, GraphQLInputObjectType, GraphQLInterfaceType
} from 'graphql';

import {
	globalIdField, nodeDefinitions, fromGlobalId, // enable node querying
	connectionDefinitions, connectionArgs, connectionFromPromisedArray, // enables child schemas
	mutationWithClientMutationId // enable mutations
}
from "graphql-relay";

import { getUser, getWidget, getWidgets, updateWidget } from "../database";

import User from "../models/user";
import Widget from "../models/widget";

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
		var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Widget') {
      return getWidget(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Widget)  {
      return widgetType;
    } else {
      return null;
    }
  }
);

let widgetType = new GraphQLObjectType({
	name: "Widget",
	fields: () => ({
		id: globalIdField('User'),
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		color: { type: GraphQLString },
		size: { type: GraphQLString },
		quantity: { type: GraphQLInt }
	}),
	interfaces: [nodeInterface]
});

// Define our user type, with two string fields; `id` and `name`
var userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    name: { type: GraphQLString },
		widgets: {
			type: widgetConnection,
			description: 'A user\'s widgets',
			args: connectionArgs,
			resolve: (_, args) => connectionFromPromisedArray(getWidgets(args), args)
		}
  }),
	interfaces: [nodeInterface]
});

var { connectionType: widgetConnection } =
	connectionDefinitions({name: 'Widget', nodeType: widgetType});

let query = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		node: nodeField,
		// some demos call it viewer
		user: {
			type: userType,
			resolve: () => getUser(1)
		}
	})
});

let userTypeInput = new GraphQLInputObjectType({
	name: "UserInput",
	description: "Type for user input",
	fields: () => ({
    name: { type: GraphQLString }
	})
});

let mutation = new GraphQLObjectType({
	name: "Mutation",
	description: "Mutates user and widget objects",
	fields: () => ({

	})
});

export const Schema = new GraphQLSchema({ query });
