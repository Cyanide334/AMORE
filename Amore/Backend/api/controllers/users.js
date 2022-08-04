const User = require("../models/users");
const menuItemModel = require("../models/menuItems");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const crypto=require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
function validateUser(req, res, next) {
  jwt.verify(
      req.headers['x-access-token'],
      ACCESS_TOKEN_SECRET,
      function (err, decoded) {
          console.log(req.headers['x-access-token'])
          if (err) {
              console.log(err)
              res.status(400).json({ status: 'error', message: err.message, data: null });
          } else {

              // add user id to request
              req.body.email = decoded.user.email;
              return decoded.user.email;
              
        }
      }
  );
}



function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "3600m" });
}
ACCESS_TOKEN_SECRET = "Custy Crew";
module.exports = {
    forgotPassword: function (req, res, next) {
        if (req.body.email === '') {
            res.status(400).send('email required');
        }
        console.error(req.body.email);
        User.findOne({
            where: {
                email: req.body.email,
            },
        }).then((user) => {
            if (user === null) {
                console.error('email not in database');
                res.status(403).send('email not in db');
            } else {
                const token = crypto.randomBytes(20).toString('hex');
                user.resetPasswordToken=token;
                user.resetPasswordExpires= Date.now() + 3600000;
                user.save();

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: `${process.env.EMAIL_ADDRESS}`,
                        pass: `${process.env.EMAIL_PASSWORD}`,
                    },
                });
              
                const mailOptions = {
                    from: 'thisisuseless402@gmail.com',
                    to: `${user.email}`,
                    subject: 'Link To Reset Password',
                    text:
                        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
                        `http://localhost:8080/users/reset?resetPasswordToken=${token}\n\n` +
                        'Please note that clicking on this link will reset your password to "password" and we recommend changing it to something more secure since we are too lazy to implemnt another UI screen for this. If this token expires, you will be redirected to the forgot password screen, otherwise you will be redirected to the login page.If you did not request this, please ignore this email and your password will remain unchanged.\n',
                };

                console.log('sending mail');

                transporter.sendMail(mailOptions, (err, response) => {
                    if (err) {
                        console.error('there was an error: ', err);
                    } else {
                        console.log('here is the res: ', response);
                        res.status(200).json('recovery email sent');
                    }
                });
            }
        });
    },
    resetPassword: (req, res) => {
        User.findOne({}).where('resetPasswordToken').eq(req.query.resetPasswordToken).where('resetPasswordExpires').gte(Date.now()).then(async (user) => {
            if (user == null) {
                console.error('password reset link is invalid or has expired');
                res.redirect('http://localhost:3000/forgot-password');
            } else {
              const password = await bcrypt.hash('password', 10);
              user.password= password;
              user.save();
              res.redirect('http://localhost:3000/login');
            }
        });
    },

    LikeMenuItem: function (req, res, next) {
        User.findById(req.params.id, function (err, data) {
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
                                data.likedMeals.push(menuItem);
                                menuItem.likes = menuItem.likes + 1;
                                menuItem.save();
                                res.status(204).json({
                                    message: 'Menu Item Liked successfully',
                                });
                            }
                        }
                    }
                );
            }
        });
    },
    signup: async function (req, res, next) {
        const email = req.body.email;
        const name = req.body.name;
        const phone = req.body.phone;
        const password = await bcrypt.hash(req.body.password, 10);
        // any problem with body, return 400
        if (!name || !email || !password) {
            res.status(400).send('Incorrect or empty feilds');
        }
        // if email and password are not empty
        else {
            try {
                User.findOne({ email: email }, (err, user) => {
                    if (err) res.status(500).send(err);
                    // check if already exists
                    if (user) {
                        // if already exists then return this message
                        res.status(409).send('Username already exists!');
                    } else {
                        // store it into the database
                        try {
                            const user = new User({
                                name: name,
                                email: email,
                                phone: phone,
                                password: password,
                                isAdmin: false,
                                image: '',
                            });
                            user.save((err) => {
                                if (err) res.status(500).send(err);
                                else {
                                    // 201 if stored
                                   const accessToken = generateAccessToken({ user });
                                    res.status(201).json({
                                        accessToken: accessToken,
                                        ...user._doc,
                                    });
                                }
                            });
                        } catch (error) {
                            res.status(500).send(error);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                res.status(500).send('Internal Server Error');
            }
        }
    },

    login: async function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;
        var encrptedPassword = '';

        try {
            //find user from db using email
            User.findOne({ email: email }, (err, user) => {
                if (err) res.status(500).send(err);
                if (user) {
                    encrptedPassword = user.password;

                    bcrypt.compare(password, encrptedPassword, (err, cmp) => {
                        console.log(cmp);
                        if (err) res.status(401).send('Wrong Username or Password');
                        if (cmp) {
                            const accessToken = generateAccessToken({ user });
                            res.status(200).json({
                                accessToken: accessToken,
                                ...user._doc,
                            });
                        } else {
                            res.status(401).send('Wrong Username or Password');
                        }
                    });
                } else {
                    res.status(401).send('Wrong Username or Password');
                }
            });
        } catch (e) {
            console.log(e);
            res.status(500).send('Internal Server Error');
        }
    },
    edit: async function (req, res, next) {
        validateUser(req, res, next);
        const name = req.body.name;
        const password = await bcrypt.hash(req.body.password, 10);
        const phone = req.body.phone;
        const id = req.body.id;
        const email = req.body.email;
        const image = req.body.image;
        let user;
        if(req.body.password!==""){
            user = {
                name: name,
                password: password,
                phone: phone,
                email: email,
                image: image,
            }
        }else{
            user = {
                name: name,
                phone: phone,
                email: email,
                image: image,
            }
        }
        if (!id) {
            res.status(400).send('Incorrect or empty fields');
        } else if (!name && !password && !phone && !email) {
            res.status(400).send('Incorrect or empty fields');
        } else {
            try {
                 User.findOneAndUpdate(
                    { _id: id },
                    user,
                    {new: true},
                    (err,updated_user) => {

                        if (err) res.status(500).send(err);
                        // 204 if updated
                        else {
                            console.log(updated_user)
                            const accessToken = generateAccessToken({ updated_user });
                            res.status(200).json({
                                accessToken: req.headers['x-access-token'],
                                ...updated_user._doc,
                            });
                        }
                    }
                );
            } catch (e) {
                console.log(e);
                res.status(500).send('Internal Server Error');
            }
        }
    },
    view: async function (req, res, next) {
        validateUser(req, res, next);
        const id = req.params.id;
        const email = req.body.email;
        if (!id) {
            res.status(400).send('Incorrect or empty fields');
        } else {
            try {
                let response = await User.findOne({ _id: id });
                res.status(200).json(response);
            } catch (e) {
                console.log(e);
                res.status(500).send('Internal Server Error');
            }
        }
    },
};
