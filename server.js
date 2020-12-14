const express = require('express');
const app = express();
const Mongocilent = require('mongodb').Mongocilent;
const assert = require('assert');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const dbName='project';
const mongourl = 'mongodb+srv://s1253745:ccgss123@cluster0.diyj2.mongodb.net/test?retryWrites=true&w=majority';
const formidable = require('express-formidable');
const secretkey="this is just too new for me to learn";

// all the function related to database
//not yetfinish
const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('bookings').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}
const handle_Find = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        findDocument(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('restaurant',{nBookings: docs.length, bookings: docs});
        });
    });
}
//--------------------not yet finish(50%?)----------------------
const finduser=(db, crit, callback)=>{
    let cursor = db.collection('account').find({crit});
    console.log(`finduser: `+crit);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        callback(docs);
    });
}
const login_user = (req,res,crit) =>{
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        finduser(db, crit, (docs) => {
            console.log("this is docs: "+docs);
            if(docs==null){
                console.log('login fail?');
                res.redirect('/login');
            }else{
                req.session.logined = true;
                req.session.userac = req.body.acc;
                res.end("none match:(");
                //res.status(200).render('restaurant',{nBookings: docs.length, bookings: docs});
            }        
        });
    });
}
//---------------------register user not yet finish(50%?)-------------------------------
const reguser=(db,crit,callback)=>{
    db.collection('account').insert(crit);
    console.log(`register user: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`registerd user: ${docs}`);
        callback(docs);
    });
}
const reg_user = (res,crit) =>{
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        reguser(db,crit, (docs) => {
            client.close();
            console.log("Closed DB connection\nregister success!");
            res.redirect('/login');
        });
    });
}
//end of functions
app.set('view engine','ejs');

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//start login session
app.use(session({
    name: 'loginsession',
    keys: secretkey,
}));

//default routing
app.get('/',(req,res)=>{
    if(!req.session.logined){
        res.redirect('/login');
    }else{
        res.redirect('/restaurant')
    }
})

// register new user on the system
app.get('/register',(req,res)=>{
    res.status(200).render('register',{});
})
app.post(('/register'),(req,res)=>{
    reg_user(res,req.body)
})


//login user
app.get('/login',(req,res) => {
    res.status(200).render('login',{});
});
// receive user logined action
app.post('/login', (req,res) => {+
    login_user(req,res,req.body)  
})
//restaurant detail
app.get('/restaurant',(req,res) => {
    console.log('going restaurant');
    res.end('in progress!');
    //res.status(200).render('restaurant',{});
    
});

// search function?
app.get('/search',(req,res) => {
    console.log('going restaurant');
    res.end('in progress!');
    //res.render('restaurant',{condit:""});
});

// logout
app.get('/logout', function(req,res) {
    console.log("logout: this is before "+req.session);
    req.session = null;
    console.log("logout: this is after "+req.session);
    res.redirect('/');
});

//Q8 api 
app.get('/api/restaurant/:para/:crit',(req,res)=>{
    //res.type('json');
    switch(req.params.para){
        case "name":
        
        break;
        case "borough":

        break;
        case "cuisine":
            
        break;
        default:
            console.log('there is nothing inputed?');
            res.send('there is nothing inputed?');
        break;
    }
})

app.listen(process.env.PORT || 8099);
