var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('techdemo', { title: 'Express' });
    require("./server_lib/mouseSync")(io);
});

module.exports = router;









