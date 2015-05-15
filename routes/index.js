var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Just a techdemo'});
});

/* Field dev. */
router.get('/field', function (req, res, next) {
    // nur per ajax!
    if (req.xhr === true) {
        res.render('field', {layout: "layouts/ajax"});
        return
    }
    res.redirect('/'); // No ajax -> go home!
});

module.exports = router;









