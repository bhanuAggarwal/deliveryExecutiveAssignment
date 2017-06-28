import mongoose from 'mongoose';
import BaseModel from '../base-model';
import { options as STATUS, default as STATUS_TYPES } from './order-status';

class Order extends BaseModel {
	constructor(){
		super();
		this.setSchema({
			restaurant : {
				type : {
					location : {
						type : [Number],
						index : '2dsphere'
					},
					area : String
				}
			},
			orderTime : {
				type : Date,
				required : true
			},
			deliveryExecutiveId : String,
			status : {
				type : String,
				enum : STATUS,
				required : true
			}
		})
	};
}

Order._collection = 'Order';

const self = new Order();

self.schema.pre('validate', function setStatus(next) {
  if (!this.status) {
    this.status = STATUS_TYPES.NEW;
  }
  next();
});

export default self.mongoose.model(Order._collection, self.schema);