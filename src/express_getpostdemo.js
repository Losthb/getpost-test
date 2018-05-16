require('tingyun');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const cookie = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookie());

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
});

app.get('/test_get/url', function (req, res, next) {
    console.log(req.query);
    req.headers['headers1'] = 'lovezdy1';
    req.body['body1'] = 'lovezdy1';
    res.cookie('resc', 'cookie', {
        expires: new Date(Date.now() + 900000), httpOnly: true
    });
    next();
    res.send("get请求成功");
});

app.get('/test_get/url/express', function (req, res, next) {
    console.log(req.query);
    req.headers['headers'] = 'headers2';
    req.body['body'] = 'body2';
    next();
    res.send("get请求成功");
});


app.get('/test_httpclient', function (req, res, next) {
    const response2 = {
        "httpclient": req.body.httpclient
    };
    res.end('httpclient sucess');
    const httpurl = "http://127.0.0.1:8081/test_get/url?nodejs=hello";
    request(httpurl, function (error, res, body, req) {
        if (!error && res.statusCode == 200) {
            console.log(body);
        }
    });
});

app.post('/test_post', function (req, res, next) {
    const response = {
        "nodejs": req.body.nodejs
    };
    req.headers['headers1'] = 'headers1';
    req.body['body1'] = 'body1';
    next();
    console.log(response, "POST 请求");
    res.end(JSON.stringify(response));
});

app.put('/user', function (req, res) {
    console.log(req.query);
    res.send(JSON.stringify(req.query));
});

const server = app.listen('8081', '127.0.0.1', function () {

    const host = server.address().address;
    const port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s/index.html", host, port)

});