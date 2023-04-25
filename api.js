var Db = require ("./dboperations");
const dboperations=require("./dboperations")
var Yetkililer=require("./yetkililer"); 
var express=require ("express");
var bodyParser=require ("body-parser");
var cors=require ("cors");
const { response } = require("express");
const { request } = require("http");
var app =express();
var router=express.Router();


app.use(bodyParser.urlencoded({extended :true}));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router); 


router.use((request,response,next)=>{
    console.log("middleware");
    next();

})



//giriş yap 
router.route('/login').post((request,response)=>{
    dboperations.login(request.body.email,request.body.password).then(result=>
    {
        if(result==true){
            const token = dboperations.generateToken(); 
            response.status(200).json({ statusCode: 200 , token ,message:"login succesful" });
        }
        else{
            response.status(401).json({ error: 'login failed' }); 
        }
      
    }).catch(error => {
        response.status(401).json({ error: 'login failed' }); 
    });
})



//pozisyonlar getirme
router.route('/position').get((request,response)=>
{
    console.log(request.body);
    dboperations.getPosition(response).then(result=>
    {
        response.json(result);
       
    })
})

//yetkili getirme
router.route('/yetkili').get((request,response)=>{
    console.log(request.body);
    dboperations.getYetkililer(response).then(result=>
        {
            response.json(result);
        })
})
//users onaylama 
router.route('/users/:id').post((request,response)=>{
    const id = parseInt(request.params.id);
    const {  approved  } = request.body;

    dboperations.approvedUsers(id,approved).then(result=>
        {
            console.log(result)
            response.status(200).json({message:"Kullanıcı onaylandı"});
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ success: false, message: 'Kullanıcı onaylanırken bir hata oluştu.' });
          });
})

//users pasife alma 
router.route('/userss/:id').post((request,response)=>{
    const id = parseInt(request.params.id);
    const {  approved  } = request.body;

    dboperations.passiveUser(id,approved).then(result=>
        {
            console.log(result)
            response.status(200).json({message:"Kullanıcı pasife alındııı"});
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ success: false, message: 'Kullanıcı pasife alınırken bir hata oluştu.' });
          });
})

//users getirme
router.route('/users').get((request,response)=>{
    console.log(request.body);
    dboperations.getUsers(response).then(result=>
        {
            response.json(result);
        })
})


//Adaylar getirme
router.route('/adaylar').get((request,response)=>{
    console.log(request.body);
    dboperations.getAdaylar(response).then(result=>
        {
            response.json(result);
        })
})


//İşletmeler getirme
router.route('/isletmeler').get((request,response)=>{
    console.log(request.body);
    dboperations.getIsletmeler(response).then(result=>
        {
            response.json(result);
        })
})

//yetkili ekleme
router.route('/insertyetkili').post((request,response)=>{
    dboperations.insertYetkili(request.body.adsoyad,request.body.email,request.body.password,request.body.unvan,request.body.gsm,).then(result=>
        {
            console.log(result)
            response.status(201).json({message:"Kayit başarili"});
    })
})

//users kayıt olma
router.route('/register').post((request,response)=>{
    dboperations.insertRegister(request.body.adsoyad,request.body.email,request.body.password).then(result=>
        {
            console.log(result)
            response.status(200).json({message:"Kayit başarili şekilde eklendi"});
    })
})

//yetkili silme
router.route('/delete/:id').delete((request,response)=>{
    dboperations.deleteYetkili(request.params.id).then(result=>
        {
            console.log(result)
            response.status(201).json({message:"Kayıt silindi"});
    })
})

// //yetkili silme
// router.route('/edit/:id').post((request,response)=>{
//     dboperations.editYetkili(request.params.id,request.params.unvan).then(result=>
//         {
//             console.log(result)
//             response.status(201).json({message:"Kayıt güncellendi"});
//     })
// })
router.route('/edit/:id').post((request, response) => {
    const id = parseInt(request.params.id);
    const {  unvan  } = request.body;

    dboperations.editYetkili(id, unvan )
      .then(result => {
        console.log(result);
        response.status(201).json({ message: 'Sipariş başariyla güncellendi.'  });
      })

      .catch(error => {
        console.error(error);
        response.status(500).json({ success: false, message: 'Sipariş güncellenirken bir hata oluştu.' });
      });
  });


var port =process.env.PORT || 1000; //localhosta bağlanma portu 
app.listen(port);
console.log("SDS api çalisiyor " + port);


