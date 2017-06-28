import mongoose from 'mongoose';
import BaseModel from '../base-model';
import { options as STATUS, default as STATUS_TYPES } from './delivery-executive-status';

class DeliveryExecutive extends BaseModel {
	constructor(){
		super();
		this.setSchema({
			name : {
				type : String,
				required : true
			},
			currentLocation : {
				type : [Number],
				index : '2dsphere',
				required : true
			},
			lastOrderDeliveryTime : {
				type : Date
			},
			city  : {
				type : String,
				required : true
			},
			area : {
				type : String,
				required : true
			},
			status : {
				type : String,
				enum : STATUS,
				required : true
			}
		});
	}
}

DeliveryExecutive._collection = 'DeliveryExecutive';

const self = new DeliveryExecutive();

export default self.mongoose.model(DeliveryExecutive._collection, self.schema);
