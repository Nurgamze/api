var Db = require ("./dboperations");
const dboperations=require("./dboperations")
var Yetkililer=require("./yetkililer"); 
var express=require ("express");
var bodyParser=require ("body-parser");
var cors=require ("cors");
const { response } = require("express");
const { request } = require("http");
var fileupload=require('express-fileupload');

var app =express();
var router=express.Router();

app.use(bodyParser.urlencoded({extended :true}));
app.use(bodyParser.json());
app.use(cors());
app.use("/sdsapi", router); 

app.use(fileupload());


router.use((request,response,next)=>{
    console.log("middleware");
    next();

})



//CVLER getirme
const fs = require('fs');

router.route('/cvler').get((request,response)=>{
    fs.readFile(__dirname + 'C:/Users/gamzenur.demir/Desktop/cvler', 'utf8', (err, data) => {
        if (err) throw err;
        const veriler = JSON.parse(data);
        response.json(veriler);
    });
})





var port =process.env.PORT || 80; //localhosta bağlanma portu 
app.listen(port);
console.log("SDS api2 çalisiyor " + port);


