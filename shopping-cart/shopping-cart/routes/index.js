var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
/* GET home page. */
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

module.exports = router;
