const express = require('express');
const app = express();
const Mongocilent = require('mongodb').Mongocilent;
const assert = require('assert');
const session = require('cookie-session');
const bodyparser = require('body-parser');
const dbName='test';
const mongourl = '';
const formidable = require('express-formidable');
const secretkey="this is just too new for me to learn";

//fake data in lesson will modify into connect mongo db
//1.fetch user data in to json?
//2. use for in loop to find user?
const users = new Array(
	{name: 'developer', password: 'developer'},
	{name: 'guest', password: 'guest'}
);

app.set('view engine','ejs');

app.get('/',(req,res)=>{
    if(!req.session.logined){
        res.redirect('/login');
    }else{
        res.redirect()
    }
})

//start login session
app.use(session({
    name: 'loginsession',
    keys: secretkey,
}));

//login restuarant
app.get('/login',(req,res) => {
    res.status(200).render('login',{});
});
// receive user logined action
app.post('/login', (req,res) => {
	users.forEach((user) => {
		if (user.name == req.body.name && user.password == req.body.password) {
			// correct user name + password
			// store the following name/value pairs in cookie session
			req.session.logined = true;       
			req.session.username = req.body.name;	
		}
	});
	res.redirect('/');
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
    console.log(req.session);
    req.session = null;
    console.log(req.session);
    res.redirect('/');
});

//Q8 api 
app.get('/api/restaurant/:para/:crit',(req,res)=>{
    res.type('json');
    switch(req.params.para){
        case "name":break;
        case "borough":break;
        case "cuisine":break;
        default:
            console.log('there is nothing inputed?');
            res.send('there is nothing inputed?');
        break;
    }
})

app.listen(process.env.PORT || 8099);
