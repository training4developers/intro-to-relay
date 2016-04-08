"use strict";

import WidgetModel from "./mongoose/widget";
import User from "./models/user";
import Widget from "./models/widget";

export const getUser = (id) => new User({ id: id });

export const getWidget = (id) => {
	return new Promise(function(resolve, reject) {
		WidgetModel.findById(id, function(err, result) {
			if (err) {
				reject(err);
				return;
			}
			resolve(new Widget(result));
		});
	});

};

export const getWidgets = (args) => {
	return new Promise(function(resolve, reject) {
		WidgetModel.find({}, function(err, results) {
			if (err) {
				reject(err);
				return;
			}
			resolve(results.map((result) => {
				return new Widget(result);
			}));
		});
	});
};

export const updateWidget = (widget) => {
	return new Promise(function(resolve, reject) {
		WidgetModel.findByIdAndUpdate(widget._id,
			widget,
			function(err) {
				if (err) { reject(err); return; }
				resolve(widget);
			});
	});
}
