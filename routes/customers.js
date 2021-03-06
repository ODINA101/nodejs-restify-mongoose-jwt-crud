const errors = require('restify-errors');
const Customer = require("../models/Customer")
const rjwt = require('restify-jwt-community')
const config = require('../config')


module.exports = server => {
    // Get Customers
    server.get('/customers', async (req, res, next) => {
        //res.send({ msg: 'test' })
        console.log(req.user)
        try {
            const customers = await Customer.find({}).populate("createdBy");
            res.send(customers)
            next();
        } catch (e) {
            //console.error(e)
            return next(new errors.InvalidContentError(err))
        }
    })
    // Get Single Customer
    server.get('/customers/:id', async (req, res, next) => {
        //res.send({ msg: 'test' })
        try {
            const customer = await Customer.findById(req.params.id);
            res.send(customer)
            next();
        } catch (e) {
            //console.error(e)
            return next(new errors.ResourceNotFoundError("There is no customer with the id of " + req.params.id))
        }
    })
    server.post('/customers', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }
        const { name, email, balance } = req.body;
        console.log(req.body)
        const customer = new Customer({
            name,
            email,
            balance,
            createdBy: req.user._id
        })
        try {
            const newCustomer = await customer.save();
            res.send(201);
            next()
        } catch (e) {
            return next(new errors.InternalError(err.message))
        }
    })

    server.put('/customers/:id', async (req, res, next) => {
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }
        try {
            const customer = await Customer.findOneAndUpdate({ _id: req.params.id }, req.body);
            res.send(200);
            next()
        } catch (e) {
            console.log(e)
            return next(new errors.ResourceNotFoundError("There is no customer with the id of " + req.params.id))
        }
    })
    //Delete Customer

    server.del('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findOneAndDelete({ _id: req.params.id });
            res.send(204)
        } catch (err) {
            console.log(e)
            return next(new errors.ResourceNotFoundError("There is no customer with the id of " + req.params.id))
        }
    })
} 