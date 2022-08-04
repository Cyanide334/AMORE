const menuItemModel = require('../models/menuItems');					
const userModel = require('../models/users')

const isAdmin = (req) => {
	return req.body.isAdmin;

}


module.exports = {
	getById: function (req, res, next) {
		menuItemModel.findById(req.params.id, function(err, data){
			if (err) {
				next(err);
			} else {
				res.status(200).json(data)
			}
		})
	},
	getAll: function(req, res, next) {
		let limit = req.query.limit
		let offset = req.query.offset
		if (!limit) {
			limit=100
		}
		if (!offset) {
			offset=0
		}
		menuItemModel.find({}, function(err, data){
			if (err) {
				next(err);
			} else {
				
				res.status(200).json({menuItems: data})
			}
		}).limit(limit).skip(offset);
	},

	getCount: function (req, res, next) {
		menuItemModel.estimatedDocumentCount(function(err, data){
			if (err) {
				next(err);
			} else {
				res.status(200).json({count: data})
			}
		})
	},

	updateById: function (req, res, next) {
		if (isAdmin(req)) {
			update = {
				name: req.body.name,
				description: req.body.description,
				price: req.body.price,
				discount: req.body.discount,
				image: req.body.image,
				tags: req.body.tags,
				likes: req.body.likes,
				isDeal: req.body.isDeal
			}
			menuItemModel.findByIdAndUpdate(req.params.id, update, function (err, data) {
				if (err)
					next(err);
				else {
					res.status(204).json({
						message: "Menu Item updated successfully",
					})
				}
			});
		}
		else {
			res.status(403).json({
				message: "You dont have the rights to do that sir, frikk uff",
			})
		}
	},
	likeById: function (req, res, next) {
		update = {
			$inc : {'likes' : 1}
		}
		userModel.findOne({ email: req.body.email }, function (err, user) {
			if (err)
				next(err)
			if (!user)
				res.status(404).json({
					message: "User not found",
				})
			else {
				if (!user.likedMeals.includes(req.params.id)) {
                    user.likedMeals.push(req.params.id);
					user.save();
                    menuItemModel.findByIdAndUpdate(
                        req.params.id,
                        update,
                        function (err, data) {
                            if (err) next(err);
                            else {
                                res.status(200).json({
									message: 'Menu Item liked successfully',
									likedMeals: user.likedMeals
                                });
                            }
                        }
                    );
                } else {
                    res.status(409).json({
						message: 'Menu Item already liked by user',
						likedMeals: user.likedMeals
                    });
                }
			}
						
		})
	},
	unlikeById: function (req, res, next) {
		update = {
			$inc : {'likes' : -1}
		}
		
		userModel.findOne({ email: req.body.email }, function (err, user) {
			if (err)
				next(err)
			if (!user)
				res.status(404).json({
					message: "User not found",
				})
			else {
				if (user.likedMeals.includes(req.params.id)) {
					let index = user.likedMeals.indexOf(req.params.id)
					user.likedMeals.splice(index, 1);
					user.save();
					menuItemModel.findByIdAndUpdate(req.params.id, update, function (err, data) {
						if (err)
							next(err);
						else {
							res.status(200).json({
								message: "Menu Item unliked successfully",
								likedMeals: user.likedMeals
							})
						}
					});
				}
				else {
					res.status(409).json({
						message: "Menu Item already unliked by user",
						likedMeals: user.likedMeals
					})
				}
			}			
		})
		
	},
	deleteById: function (req, res, next) {
		if (isAdmin(req)) {

			menuItemModel.findByIdAndRemove(req.params.id, function (err, data) {
				if (err)
					next(err);
				res.status(204).json({
					message: "Menu Item deleted successfully",
				})
			});
		}
		else {
			res.status(403).json({
				message: "You dont have the rights to do that sir, frikk uff",
			})
		}

	},

	create: function (req, res, next) {
		if (isAdmin(req)) {
			menuItem = {
				name: req.body.name,
				description: req.body.description,
				price: req.body.price,
				discount: req.body.discount,
				image: req.body.image,
				tags: req.body.tags,
				likes: req.body.likes,
				isDeal: req.body.isDeal,
			}
			if (menuItem.image === "") {
				menuItem.image = "https://bitsofco.de/content/images/2018/12/broken-1.png"
			}
			menuItemModel.create(menuItem, function (err, data) {
				if (err)
					next(err);
				else
					res.status(201).json({
						message: "Menu  created successfully",
					})
			});
		}
		else {
			res.status(403).json({
				message: "You dont have the rights to do that sir, frikk uff",
			})
		}
	},
}					
