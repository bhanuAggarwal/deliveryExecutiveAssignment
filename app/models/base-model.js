import mongoose from 'mongoose';
import moment from 'moment';

class baseModel {
  constructor() {
    this.mongoose = mongoose;
  }
  setSchema(schemaObj) {
    const schema = Object.assign({}, schemaObj);
    this.schema = new this.mongoose.Schema(schema || {}, {
      timestamps: 1
    });
    this.schema.virtual('created').get(() => {
      return moment(this.createdAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ')
        .format('dddd, MMMM Do YYYY, h:mm:ss a');
    });

    this.schema.virtual('updated').get(() => {
      return moment(this.updatedAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ')
        .format('dddd, MMMM Do YYYY, h:mm:ss a');
    });
  }

  setIndexes(indexes) {
    this.schema.index(indexes);
  }
}

export default baseModel;
