var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var Cart = require('../models/Cart');

router.get('/', function (req, res, next) {
  Product.find((err, products) => {
    var productChunk = [];
    var chunkSize = 3;
    for (let index = 0; index < products.length; index += chunkSize) {
      productChunk.push(products.slice(index, index + chunkSize));

    }
    res.render('store/store', { products: productChunk });

  })
});


router.get('/checkout', isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/');
  }

  var cart = new Cart(req.session.cart);
  var total = parseFloat(cart.totalPrice).toFixed(2);
  var errMsg = req.flash('error')[0];
  res.render('store/checkout', { total, errMsg, noError: !errMsg });

});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}
