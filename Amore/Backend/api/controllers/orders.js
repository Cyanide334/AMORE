const orderModel = require('../models/orders');	
const menuItemModel = require('../models/menuItems');					
let ordersEnabled=true;
module.exports = {
    toggleOrders:(req,res,next)=>{
        ordersEnabled=!ordersEnabled;
        res.send(ordersEnabled);
   
    },
    orderingStatus:(req,res,next)=>{
        res.send(ordersEnabled);
    },
    getById: function (req, res, next) {
        orderModel
            .findById(req.params.id, function (err, data) {
                if (err) {
                    next(err);
                } else {
                    res.status(200).json(data);
                }
            })
            .populate(['user', 'menuItems.item']);
    },
    getAll: function (req, res, next) {
        let limit = req.query.limit;
        let offset = req.query.offset;
        let status = req.query.status;
        
        let query={};
        if(status!=='undefined'){
            query.status=status;
        
        }
        if(!req.body.isAdmin){
            query.user=req.body.userId;
        }
        if (!limit) {
            limit = 100;
        }
        if (!offset) {
            offset = 0;
        }
        orderModel
            .find(query, function (err, data) {
                if (err) {
                    next(err);
                } else {
                    
                    res.status(200).json({ orders: data });
                }
            })
            .limit(limit)
            .skip(offset)
            .populate(['user','menuItems.item' ]);
    },
    getCount: function (req, res, next) {
        
        orderModel.estimatedDocumentCount(function (err, data) {
            if (err) {
                next(err);
            } else {
                res.status(200).json({ count: data });
            }
        });
    },
    updateById: function (req, res, next) {
        update = {
            status: req.body.status,
        };
        orderModel.findByIdAndUpdate(
            req.params.id,
            update,
            function (err, data) {
                if (err) next(err);
                else {
                    res.status(204).json({
                        message: 'Order updated successfully',
                    });
                }
            }
        );
    },
    AddMenuItemById: function (req, res, next) {
        orderModel.findById(req.params.id, function (err, data) {
            if (err) next(err);
            else {
                menuItemModel.findById(
                    req.body.menuItemId,
                    function (err, menuItem) {
                        if (err) {
                            next(err);
                        } else {
                            if (!data) {
                                res.status(204).json({
                                    message: 'Menu Item not found',
                                });
                            } else {
                                data.menuItems.push(menuItem);
                                res.status(204).json({
                                    message: 'Order updated successfully',
                                });
                            }
                        }
                    }
                );
            }
        });
    },

    deleteById: function (req, res, next) {
        orderModel.findByIdAndRemove(req.params.id, function (err, data) {
            if (err) next(err);
            res.status(204).json({
                message: 'Order deleted successfully',
            });
        });
    },

    create: function (req, res, next) {
        menuItem = {
            menuItems: req.body.menuItem,
            status: req.body.status,
            date: req.body.date,
            user: req.body.user,
            price: req.body.price,
        };
        orderModel.create(menuItem, function (err, data) {
            if (err) next(err);
            else
                res.status(201).json(data);
            console.log(data);
        });
    },
};					
