var express = require('express');
var router = express.Router();

/* GET chatroom */
router.get('/', function(req, res, next) {
    res.redirect(req.baseUrl + '/join?room=1');
});

router.get('/join', function(req, res, next) {
    if (typeof req.query.room === 'undefined') {
        return res.redirect(req.baseUrl + '/join?room=1');
    }
    var reg = /^\d+$/;
    if (!reg.test(req.query.room)) {
        res.status(400);
        res.end('Room number must be integer!');
    }

    res.sendFile('chatroom.html', {
        root: './public'
    });
});

module.exports = router;
