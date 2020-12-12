const express = require('express');
const app = express();
const Mongocilent = require('mongodb').Mongocilent;
const assert = require('assert');
const session = require('cookie-session');
const bodyparser = require('body-parser');
const dbName='project';
const mongourl = '';
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
//--------------------not yet finish----------------------
const finduser=(db, criteria, callback)=>{
    let cursor = db.collection('account').find(criteria);
    console.log(`finduser: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}
const login_user = (res, criteria) =>{
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        finduser(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection\nlogin success!");
            res.status(200).render('restaurant',{nBookings: docs.length, bookings: docs});
        });
    });
}
//---------------------not yet finish-------------------------------
const reguser=(db, criteria, callback)=>{
    let cursor = db.collection('account').insert(criteria);
    console.log(`register user: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`registerd user: ${docs.length}`);
        callback(docs);
    });
}
const reg_user = (res, criteria) =>{
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        reguser(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection\nregister success!");
            res.redirect('/login');
        });
    });
}

//end of functions

app.set('view engine','ejs');

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
app.post('/login', (req,res) => {
    login_user(res,req.body)
})
// list all the restaurant
app.get('/restaurant',(req,res) => {
    console.log('going restaurant');
    
});

// search function?
app.get('/search',(req,res) => {
    console.log('going restaurant');
    res.render('restaurant',{condit:""});
});

// logout
app.get('/logout', function(req,res) {
    console.log("this is before "+req.session);
    req.session = null;
    console.log("this is after "+req.session);
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
