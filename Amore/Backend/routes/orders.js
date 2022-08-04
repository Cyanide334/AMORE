const express = require('express');
const router = express.Router();
const ordersController = require('../api/controllers/orders');


router.get('/', ordersController.getAll);
router.get('/toggleOrders', ordersController.toggleOrders);
router.get('/orderingStatus', ordersController.orderingStatus);
router.get('/count', ordersController.getCount);
router.get('/:id', ordersController.getById);
router.post('/', ordersController.create);
router.put('/:id', ordersController.updateById);
router.put('/addItem/:id', ordersController.AddMenuItemById);
router.delete('/:id', ordersController.deleteById);

module.exports = router;