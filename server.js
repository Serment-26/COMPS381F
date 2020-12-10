const express = require('express');
const app = express();
const Mongocilent = require('mongodb').Mongocilent;
const assert = require('assert');
const session = require('cookie-session');
const dbName='test';
const mongourl = '';
const formidable = require('express-formidable');
app.set('view engine','ejs');

/* this will be the redirect user if not login
app.get('/',(req,res)=>{
    if(req.params){}else{}
})
*/
app.get('/login',(req,res) => {
    console.log('going login');
});
app.get('/restaurant',(req,res) => {
    console.log('going restaurant');
});
//Q8 api 
app.get('/api/restaurant/:para/:crit',(req,res)=>{
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
