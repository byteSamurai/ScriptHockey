var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('techdemo', { title: 'Just a techdemo' });
});

module.exports = router;









