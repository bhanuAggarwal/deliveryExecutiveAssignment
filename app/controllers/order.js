import co from 'co';
import Order from '../models/order/order';
import ORDER_STATUS from '../models/order/order-status';
import DeliveryExecutive from '../models/delivery/delivery-executive';

exports.create = co.wrap(function*(req, res, next){
    try{
        const order = req.body ? req.body.order : null;
        if(order){
            const newOrder = new Order(order);
            const createdOrder = yield newOrder.save();
            return res.status(200).send(createdOrder);

        }
        return res.status(404).send('Order Not Found');
    }catch(err){
        console.log('Error in create : ', err);
        return res.status(500).send('Internal Server Error');
    }
});

const findPendingOrders = function*(){
    try{
        const query = {
            status : ORDER_STATUS.NEW
        };
        const sortOption = {
            orderTime : -1
        };
        const orderList = yield Order.find(query).sort(sortOption);
        return orderList;
    }catch(err){
        console.log('Error in findPendingOrders : ', err);
        return null;
    }
}

const findNearestDeliveryExecutive = function*(order){
    try{
        const query  = {
            area : order.resturant.area,
            currentLocation : {
                $near : order.resturant.location,
                $maxDistance : 5/111.2
            }
        }
        const deliveryExecutive = yield DeliveryExecutive.findOne(query).exec();
        return deliveryExecutive;
    }catch(err){
        console.log('Error in findNearestDeliveryExecutive : ', err);
        return null;
    }
}

const updateProcessedOrders = function*(processedOrders){
    try{
        const updatedOrderList = [];
        for(const order of processedOrders){
            const query = {
                _id : order._id
            };
            const update = {
                deliveryExecutiveId : order.deliveryExecutiveId,
                status : order.status
            };
            const updateOption  = {
                new : true
            };
            const updatedOrder = yield Order.findOneAndUpdate(query, update, updateOption).exec();
            updatedOrderList.push(updatedOrder);
        }
        return updatedOrderList;
    }catch(err){
        console.log('Error in updateProcessedOrders :', err);
        return null;
    }
}

exports.assignDeliveryExecutive = co.wrap(function*(req, res, next){
    try{
        const processedOrders = [];
        const pendingOrderList = yield findPendingOrders();
        if(pendingOrderList && pendingOrderList.size() > 0){
            for(const order of pendingOrderList){
                const deliveryExecutive = yield findNearestDeliveryExecutive(order);
                if(deliveryExecutive){
                    order.deliveryExecutiveId = deliveryExecutive._id;
                    order.status = ORDER_STATUS.ASSIGNED;
                    processedOrders.push(order);
                }
                console.log('DeliveryExecutive not found for order : ', order._id);
            }
            yield updateProcessedOrders(processedOrders);
        }
        return res.status(404).send('Order List Not Found');
    }catch(err){
        console.log('Error in assignDeliveryExecutive : ', err);
        return res.status(500).send('Internal Server Error');
    }
});