var Db = require ("./dboperations");
const dboperations=require("./dboperations")
var Yetkililer=require("./yetkililer"); 
var express=require ("express");
var bodyParser=require ("body-parser");
var cors=require ("cors");
const { response } = require("express");
const { request } = require("http");
const path = require('path');
const multer = require('multer');
var fileupload=require('express-fileupload');

var app =express();
var router=express.Router();


app.use(bodyParser.urlencoded({extended :true}));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router); 

app.use(fileupload());


router.use((request,response,next)=>{
    console.log("middleware");
    next();

})


// Multer disk storage tanımlanıyor.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Dosya yüklemesi yapılacak klasör belirleniyor.
        const destinationPath = path.join(__dirname, '../cvler');
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        // Yükleme yapılan her dosyaya benzersiz bir isim veriliyor.
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf')
    }
});

// Multer middleware'i tanımlanıyor.
const upload = multer({
    storage: storage,
    // Sadece PDF dosyalarının yüklenmesine izin veriliyor.
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'))
        }
        cb(null, true)
    }
});

// Dosya yükleme endpoint'i tanımlanıyor.
router.post('/upload',upload.single('pdf'),(request,response)=>{
    console.log(request.file);
    if (!request.file) {
        return response.status(400).json({ message: 'Dosya yüklenemedi.' });
    }
    response.status(200).json({ file: request.file.filename });
});


/*
const upload = multer({
    dest: 'C:/Users/gamzenur.demir/Desktop/cvler',
    fileFilter: (request, file, cb) => {
      if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/vnd.ms-excel'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type.'));
      }
    },
  });
  
  router.post('/upload', upload.single('file'), (request, response) => {
    response.status(200).send('Dosya başarıyla yüklendi');
  });
*/


//giriş yap 
router.route('/login').post((request,response)=>{
    dboperations.login(request.body.email,request.body.password).then(result=>
    {
        if(result){
            const token = dboperations.generateToken(); 
            response.status(200).json({ 
              statusCode: 200 , token ,message:"login succesful",adsoyad: result.adsoyad, id:result.id,
            });
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


//users aktif-pasif 
router.route('/users/:id').post((request,response)=>{
    const id = request.params.id;
    const { isActive } = request.body;

    dboperations.updateUserActivity(id, isActive).then(result => {
        let message = isActive ? "Kullanıcı aktifleştirildi" : "Kullanıcı pasifleştirildi";
        console.log(result)
        response.status(200).json({ message });
    })
    .catch(error => {
        console.error(error);
        response.status(500).json({ success: false, message: 'Kullanıcı aktifleştirilirken bir hata oluştu.' });
    });
});



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
  
                                                                                                                                                                                                                                                                 
router.route('/insertaday').post((request,response)=>{
    console.log();
 
    dboperations.insertAday( 
        request.body.ad,request.body.soyad,request.body.gsm,request.body.email,request.body.yas,request.body.dogum_tarihi,
        request.body.yasadigi_sehir,request.body.dogdugu_sehir,request.body.toplam_deneyim,request.body.son_isyeri,
        request.body.son_isyeri_suresi,request.body.cv_url,request.body.mezuniyet,request.body.cinsiyet,
        request.body.askerlik,request.body.ehliyet,request.body.sigara,request.body.alkol,request.body.evlilik,request.body.cocuk_sayisi).then(result=>
        { 
            //console.log(result);
            response.status(201).json({message:"Aday eklendi"});
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

//görüşmeler getirme
router.route('/gorusmeler').get((request,response)=>{
    console.log(request.body);
    dboperations.getGorusmeler(response).then(result=>
        {
            response.json(result);
        })
})

//isletme ekleme 
router.route('/insertisletme').post((request,response)=>{
    dboperations.insertIsletme(request.body.unvan).then(result=>
        {
            console.log(result)+
            response.status(201).json({message:"İsletme başarılı şekilde eklendi."});
    })
}) 

//Not ekleme 
router.route('/insertnot/:id').post((request,response)=>{
    const id = parseInt(request.params.id);
    dboperations.insertNot(id,request.body.degerlendirme).then(result=>
        {
            console.log(result)+
            response.status(201).json({message:"Değerlendirme başarılı şekilde eklendi."});
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
    dboperations.insertRegister(request.body.adsoyad,request.body.email,request.body.password,request.body.approved).then(result=>
        {
            console.log(result)
            response.status(201).json({message:"Kayit başarili şekilde eklendi"});
    })

})

//pozisyon acma 
router.route('/insertposition').post((request,response)=>{
    dboperations.insertPosition(request.body.unvan,request.body.yetkiliId,request.body.isletmeId,request.body.deneyim_yili,request.body.min_yas,request.body.max_yas,request.body.seyehat_engeli,request.body.cinsiyet,request.body.askerlik,request.body.ehliyet,request.body.sehir,request.body.bolge,request.body.mezuniyet).then(result=>
        {
            console.log(result)
            response.status(201).json({message:"Pozisyon başarılı şekilde açıldı."});
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

//isletme silme
router.route('/deleteisletme/:id').delete((request,response)=>{
    dboperations.deleteİsletme(request.params.id).then(result=>
        {
            console.log(result)
            response.status(201).json({message:"Kayıt silindi"});
    })
})
//aday silme
router.route('/deleteaday/:id').delete((request,response)=>{
    dboperations.deleteAday(request.params.id).then(result=>
        {
            console.log(result)
            response.status(201).json({message:"Aday silindi"});
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

//yetkiliedit
router.route('/edit/:id').post((request, response) => {
    const id = parseInt(request.params.id);
    const {  unvan  } = request.body;
    const {  password  } = request.body;

    dboperations.editYetkili(id,unvan,password)
      .then(result => {
        console.log(result);
        response.status(201).json({ message: 'Yetkili başarıyla güncellendi.'  });
      })

      .catch(error => {
        console.error(error);
        response.status(500).json({ success: false, message: 'Yetkili güncellenirken bir hata oluştu.' });
      });
  });
//isletmeedit
  router.route('/isletmeedit/:id').post((request, response) => {
    const id = parseInt(request.params.id);
    const {  unvan  } = request.body;
    dboperations.editİsletme(id,unvan)
      .then(result => {
        console.log(result);
        response.status(201).json({ message: 'İsletme unvanı başarıyla güncellendi.'  });})
      .catch(error => {
        console.error(error);
        response.status(500).json({ success: false, message: 'İsletme unvanı  güncellenirken bir hata oluştu.' });
      });
  });

//adayedit

router.route('/adayedit/:id').post((request, response) => {
    
    const id = parseInt(request.params.id);
    const { ad,soyad,gsm,email,yas,dogum_tarihi,yasadigi_sehir,dogdugu_sehir,toplam_deneyim,son_isyeri,son_isyeri_suresi,cv_url,mezuniyet,cinsiyet,askerlik,ehliyet,sigara,alkol,evlilik,cocuk_sayisi  } = request.body;
  
    dboperations.editAday(id,ad,soyad,gsm,email,yas,dogum_tarihi,yasadigi_sehir,dogdugu_sehir,toplam_deneyim,son_isyeri,son_isyeri_suresi,cv_url,mezuniyet,cinsiyet,askerlik,ehliyet,sigara,alkol,evlilik,cocuk_sayisi)
    
    .then(result => {
        console.log(result);

    if (result[0]) {
      response.status(201).json({ success: true, message: result[1] });
    } else {
    response.status(400).json({ success: false, message: result[1] });
       }
     })
.catch(error => {
    console.error(error);
     response.status(500).json({ success: false, message: 'Aday bilgileri güncellenirken bir hata oluştu.' });
  });
});


var port =process.env.PORT || 1000; //localhosta bağlanma portu 
app.listen(port);
console.log("SDS api çalisiyor " + port);


