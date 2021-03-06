'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');
const orderController = require('../app/controllers/order');
const deliveryExecutive  = require('../app/controllers/delivery-executive');
/**
 * Expose
 */

module.exports = function (app) {

  app.get('/', home.index);

  app.get('/order/deliveryExecutive/!assign',orderController.assignDeliveryExecutive);

  app.post('/order', orderController.create);

  app.post('/delivery/deliveryExecutive', deliveryExecutive.create);

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
