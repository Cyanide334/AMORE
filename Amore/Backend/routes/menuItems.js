const express = require('express');
const router = express.Router();
const menuItemsController = require('../api/controllers/menuItems');


router.get('/', menuItemsController.getAll);
router.post('/', menuItemsController.create);
router.get('/viewItem/:id', menuItemsController.getById);
router.get('/count', menuItemsController.getCount);
router.put('/like/:id', menuItemsController.likeById);
router.put('/unlike/:id', menuItemsController.unlikeById);
router.put('/:id', menuItemsController.updateById);
router.delete('/:id', menuItemsController.deleteById);


module.exports = router;