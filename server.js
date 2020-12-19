const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const dbName='project';
const mongourl = 'mongodb+srv://s1253745:ccgss123@cluster0.diyj2.mongodb.net/test?retryWrites=true&w=majority';
const formidable = require('express-formidable');
const fs = require('fs');
var objID= require('mongodb').ObjectID;
const secretkey1="this is just too new for me to learn";
const secretkey2="why so many bug";
app.set('view engine','ejs');
/*start login session
    username:string
    authenticated:boolean
*/
const users = new Array(
	{name: 'demo', password: 'demo'},
	{name: 'student', password: 'student'}
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    name: 'loginSession',
    keys: [secretkey1,secretkey2]
}));
// support parsing of application/json type post data

// all the function related to database
//not yet finish (maybe finished?)
const handle_Find = (ac,res,crit) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server(handle_find)");
        const db = client.db(dbName);
        if(crit==null||crit==""){
            var cursor = db.collection("restaurant").find();
        }else{
            var cursor = db.collection("restaurant").find(crit);
        }
        cursor.toArray((err,docs) => {
            assert.equal(err,null);
            client.close();
            console.log(`findDocument: ${docs.length}`);
            res.render('search',{user:ac,numofr:docs.length,crit:crit,c:docs})
        });     
    });
}
//-------------------- login (100%)----------------------
const login_user = (res,crit,callback) =>{
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server(login_user)");
        const db = client.db(dbName);
        db.collection('account').findOne(crit,(err,result)=>{
            if (result==null){
                client.close();           
                res.render('info',{tname:"login failure!",reason:"No such user(wrong password or username?)"});
            }else{
                client.close();
                callback();
            }
        });
    });
}

//---------------------register (100%) maybe discard-------------------------------
const reg_user = (res,crit) =>{
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server(reg_user)");
        const db = client.db(dbName);
        db.collection('account').findOne(crit,(err,result)=>{
            if (result==null){
                db.collection('account').insertOne(crit,(err,result)=>{
                    if (err) {console.log(err);}
                    else{
                        client.close();
                        console.log("Closed DB connection\nregister success!");
                        res.render('info',{tname:"register success!",reason:"you have register a new ac successfully!"})
                    }            
                });               
            }else{
                client.close();
                console.log("Closed DB connection");
                res.render('info',{tname:"register fail!",reason:"you have fail to register a new ac!(properly have the same account)"})
            }
        })
         
    });
}
//create restaurant
const create_restaurant=(req, res,ac)=>{
    var doc={};
    doc['owner'] = ac;
    doc['name'] = req.fields.name;
    doc['borough'] = req.fields.borough;
    doc['cuisine'] = req.fields.cuisine;
    doc['address'] = {
        'street': req.fields.street,
        'zipcode': req.fields.zipcode,
        'building': req.fields.building,
        'coord': { 'lat': req.fields.lat, 
                   'lon': req.fields.lon }
    };
    var filename=req.files.sampleFile;
    if (filename.size > 0) {
        fs.readFile(filename.path, (err, data) => {
            if(err){console.log(err);}
            doc['photo'] = new Buffer.from(data).toString('base64');
        });
    }
    const client = new MongoClient(mongourl);
    client.connect((err)=>{
        assert.equal(null,err);
        console.log("Connected successfully to server(Create restarant)");
        const db = client.db(dbName);
        db.collection("restaurant").insertOne(doc,(err, results)=>{
                client.close();
                if(err){console.log(err);}
                res.render('info',{tname:"Create success!",reason:"you have create a new restaurant successfully!"})
            }
        );
    });
}
//restaurant detail
const restarant_detail=(ac,res,crit)=>{
    var restID=objID(crit._id);
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server(restarant_detail)");
        const db = client.db(dbName);
        var cursor = db.collection("restaurant").find(restID);
        cursor.toArray((err,docs) => {
            assert.equal(err,null);
            client.close();
            res.render('restaurant',{c:docs,user:ac})
        });    
    }); 
}
//remove restaurant
const del_restaurant=(req,res)=>{
    var user=req.session.username;
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server(del_restaurant)");
        const db = client.db(dbName);
        db.collection("restaurant").findOne(req.params,(err,result)=>{
            if(user==result.owner){
                db.collection("restaurant").deleteOne(req.params,(err,result)=>{
                    if (err) {console.log(err);}
                    client.close();
                    console.log("delete successfully!");
                    res.render('info',{tname:"Delete success!",reason:"you have delete a restaurant successfully!"})
                });
            }else{
                client.close();
                res.render('info',{tname:"You faker!",reason:"Delete unsuccessful!"})
            }
        });
    }); 
}
//end of functions

//default routing
app.get('/',(req,res)=>{
    if(!req.session.authenticated){
        res.redirect('/login');
    }else{
        res.redirect('/search')
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
    login_user(res,req.body,()=>{
        req.session.authenticated=true;
        req.session.username=req.body.acc;
        console.log("inside: "+req.session.username);
        res.redirect('/');  
    });
/*  maybe change to this on9 login
    users.forEach((user) => {
		if (user.name == req.body.name) {
			req.session.authenticated = true;        
			req.session.username = req.body.acc;	 		
		}else{
            res.render('info',{tname:"login failure!",reason:"No such user(wrong password or username?)"})
        }
	});
    res.redirect('/');
*/
});
// search function?
app.get('/search',(req,res) => {
    console.log('going search');
    var crit=JSON.stringify(req.query);
    if(crit==""||crit==null){
        handle_Find(req.session.username,res,"")
    }else{
        handle_Find(req.session.username,res,crit);
    }  
});
// logout
app.get('/logout', function(req,res) {
    req.session = null;
    res.redirect('/');
});
//create new restaurant
app.get('/create',(req,res) => {
    res.status(200).render('create',{});
});
// receive restaurant info
app.post('/create', formidable(), (req,res) => {
    console.log(req.session.username);
    create_restaurant(req,res,req.session.username);
})
//restaurant detail
app.get('/restaurant',(req,res) => {
    console.log('going restaurant');
    restarant_detail(req.session.username,res,req.query);
});
app.get('/remove',(req,res) => {
    del_restaurant(req,res);
});
//Q8 api 
app.get('/api/restaurant/:para/:crit',(req,res)=>{
    //res.type('json');
    var crit = req.params.crit;
    switch(req.params.para){
        case "name":
        
        break;
        case "borough":

        break;
        case "cuisine":
            
        break;
        default:0
            res.render('info',{tname:"nothing input?",reason:"you have not input a single thing?"});
            console.log('there is nothing inputed?');
        break;
    }
})

app.listen(process.env.PORT || 8099);
//res.render('info',{tname:"",reason:""})