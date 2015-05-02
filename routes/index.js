var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('techdemo', { title: 'Just a techdemo' });
});

/* Field dev. */
router.get('/field', function (req, res, next) {
    res.render('field', { title: 'Field under construction' });
});

module.exports = router;









