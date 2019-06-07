const should = require('should')
const request = require('request')
const expect = require("chai").expect;
let baseUrl = "http://localhost:3000/"
let util = require("util")


describe('return customers', function () {
    it('returns customers', function (done) {
        request.get({ url: baseUrl + 'customers' }, function (err, res, body) {
            expect(res.statusCode).to.equal(200)
            console.log(body)
            done();
        })
    })
})

describe('add new customer', function () {
    it('adds new customers', function (done) {
        request.post(baseUrl + 'customers', { name: "irakli", email: "kukua@gmail.com" }, function (err, res, body) {
            expect(res.statusCode).to.equal(201)
            console.log(body)
            done();
        })
    })
})