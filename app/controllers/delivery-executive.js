import co from 'co';
import DeliveryExecutive from '../models/delivery/delivery-executive';

exports.create = co.wrap(function*(req, res, next) {
	try{
		const deliveryExecutive = req.body.deliveryExecutive;
		if(deliveryExecutive){
			const newDeliveryExecutive = new DeliveryExecutive(deliveryExecutive);
			const createdDeliveryExecutive = yield newDeliveryExecutive.save();
			if(createdDeliveryExecutive){
				return res.status(200).send(createdDeliveryExecutive);
			}
			return res.status(500).send('Internal DB Error');
		}
		return res.status(404).send('DeliveryExecutive not found');
	}catch(err){
		console.log('Error in create : ', err);
		return res.status(500).send('Internal Server Error');
	}
})

