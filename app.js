var express       = require('express');
var ejs           = require('ejs');
var db            = require('./db');
var app           = express();
var server        = require('http').Server(app);
var io            = require('socket.io')(server);
var bodyParser    = require('body-parser');
var schedule      = require('./schedule').weather();
var session       = require("express-session");
var sharedsession = require("express-socket.io-session");

var session = session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: true
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(session);
io.use(sharedsession(session, {
    autoSave:true
}));

app.use(express.static('angular'));
app.use(express.static('themes'));
app.use(express.static('socket'));
app.use(express.static('themes/statics/css'));

// io.set('close timeout', 0.5);
// io.set('heartbeat timeout', 0.5);

app.set('views', __dirname + '/');
app.engine('.html', ejs.__express);
app.set('view engine', 'html'); //替换文件扩展名ejs为html

//评论模块[S];

app.get('/comment', function (req, res){
	res.render('comment');
});

app.post('/get_comment', urlencodedParser, function (req, res){
    var data = db.select("comment","","date DESC");
    res.send(data);
});

app.post('/in_comment', urlencodedParser, function (req, res){
    res.send(db.add("comment",req.body));
});

//评论模块[E];


Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

var userlist = [];
var saylist = [];

io.on("connection", function(socket){

    //console.log(io.sockets);
    socket.emit('news', { hello: 'world' });

    if(socket.handshake.session.online == undefined){
        socket.handshake.session.online = "none";
    };

    socket.on("login", function(data){

        if(data !== {}){

            close_list_bool = true;

            socket.name   = {};
            socket.name.a = data;
            socket.name.b = data.username;

            if(socket.handshake.session.online == "none"){
                console.log("欢迎 "+socket.name.b+" 登录 多人聊天室");
                socket.handshake.session.online = socket.name.b;
                userlist.push(socket.name.a);
            };

            io.emit("login",userlist);
        }

    });
    //登录

    socket.on("disconnect",function(){
        if(socket.name !== undefined){
            close_list_bool = false;
            clearInterval(t);
            t = setTimeout(function(){
                if(close_list_bool == false){
                    console.log(socket.name.b + " 离开了 多人聊天室");
                    userlist.remove(socket.name.a);
                    io.emit("login", userlist);
                    delete socket.handshake.session.online;
                    socket.handshake.session.destroy();
                };
            },5000);
        }
    });
    //断开

    socket.on("othersay",function(data){
        if(data !==""){
            saylist.push({"username":socket.name.b,"say":data});
        }
        io.emit("othersay",saylist);
        console.log(saylist);
    });

});

app.get('/chat', urlencodedParser, function (req, res){
    //req.session.online = "aaaa";
    res.render('chat');
});

server.listen(81,'192.168.2.167',function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});