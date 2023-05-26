const express = require('express');
var config = require('./db.config');
const sql = require('mssql');
const yetkili = require('./yetkililer');
const { request, response } = require('express');
const { password } = require('./db.config');
const app = express();


//Login
async function login(email,password) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('email', sql.VarChar(50), email)
            .input('password', sql.VarChar(50), password)
            .query('SELECT email,password, adsoyad,id  FROM Kullanıcılar WHERE email = @email and password = @password UNION SELECT email,password,adsoyad,id FROM Yetkililer WHERE email = @email and password = @password')
        if(result.recordset.length > 0){
            return { 
                adsoyad: result.recordset[0].adsoyad,
                id: result.recordset[0].id,
            };
        }
        else{
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}


async function insertYetkili(adsoyad,email,password,unvan,gsm){
    try{
        let pool=await sql.connect(config);
        let Yetkili=await pool.request()
        .input('adsoyad', sql.VarChar(50), adsoyad)
        .input('email', sql.VarChar(50), email)
        .input('password', sql.VarChar(50), password)
        .input('unvan', sql.VarChar(50), unvan)
        .input('gsm', sql.Numeric, gsm)
        .query("INSERT INTO Yetkililer (adsoyad,email,password,unvan,gsm) values(@adsoyad,@email,@password,@unvan,@gsm);")
        return Yetkili.recordset;
    }
    catch(error){
        console.log(error);

    }
}
async function insertIsletme(unvan){
    try{
        let pool=await sql.connect(config);
        let Yetkili=await pool.request()
        .input('unvan', sql.NVarChar, unvan)
        .query("INSERT INTO İsletmeler (unvan) values (@unvan);")
        return Yetkili.recordset;
    }
    catch(error){
        console.log(error);

    }
}


async function insertRegister(adsoyad,email,password,approved){
    try{
        let pool=await sql.connect(config);
        let Yetkili=await pool.request()
        .input('adsoyad', sql.VarChar(50), adsoyad)
        .input('email', sql.NVarChar, email)
        .input('password', sql.VarChar(50), password)
        .input('approved', sql.VarChar(50), approved)
        .query("INSERT INTO Kullanıcılar (adsoyad,email,password,approved) values(@adsoyad,@email,@password,@approved);")
        return Yetkili.recordset;
    }
    catch(error){
        console.log(error);

    }
}
async function insertPosition(unvan,yetkiliId,isletmeId,deneyim_yili,min_yas,max_yas,seyehat_engeli,cinsiyet,askerlik,ehliyet,sehir,bolge,mezuniyet){
    try{
        let pool=await sql.connect(config);
        let pozisyonAc=await pool.request()
        .input('unvan', sql.VarChar(50), unvan)
        .input('isletmeId', sql.Int, isletmeId)
        .input('yetkiliId', sql.Int, yetkiliId)
        .input('deneyim_yili', sql.Int, deneyim_yili)
        .input('min_yas', sql.Int, min_yas)
        .input('max_yas', sql.Int, max_yas)
        .input('seyehat_engeli', sql.Bit, seyehat_engeli)
        .input('cinsiyet', sql.NVarChar(50), cinsiyet)
        .input('askerlik', sql.Bit, askerlik)
        .input('ehliyet', sql.Bit, ehliyet)
        .input('sehir', sql.VarChar(50), sehir)
        .input('bolge', sql.VarChar(50), bolge)
        .input('mezuniyet', sql.VarChar(50), mezuniyet)

        .query("INSERT INTO Pozisyonlar (unvan,yetkiliId,isletmeId,deneyim_yili,min_yas,max_yas,seyehat_engeli,cinsiyet,askerlik,ehliyet,sehir,bolge,mezuniyet) values(@unvan,@yetkiliId,@isletmeId,@deneyim_yili,@min_yas,@max_yas,@seyehat_engeli,@cinsiyet,@askerlik,@ehliyet,@sehir,@bolge,@mezuniyet);")
        return pozisyonAc.recordset;
    }
    catch(error){
        console.log(error);

    }
}

async function deleteYetkili(id){
    try{
        let pool=await sql.connect(config);
        let deleteyetkili=await pool.request()
        .input("inputparameter",sql.Int ,id)
        .query("Delete from Yetkililer where id=@inputparameter")
        return deleteYetkili.recordset;
    }
    catch(error){
        console.log(error)
    }
}
//deleteişletme
async function deleteİsletme(id){
    try{
        let pool=await sql.connect(config);
        let deleteisletme=await pool.request()
        .input("inputparameter",sql.Int ,id)
        .query("Delete from İsletmeler where id=@inputparameter")
        return deleteisletme.recordset;
    }
    catch(error){
        console.log(error)
    }
}
//deleteişletme
async function deleteAday(id){
    try{
        let pool=await sql.connect(config);
        let deleteaday=await pool.request()
        .input("inputparameter",sql.Int ,id)
        .query("Delete from Adaylar where id=@inputparameter")
        return deleteaday.recordset;
    }
    catch(error){
        console.log(error)
    }
}
//edit yetkili
async function editYetkili(id,unvan,password){
    try{
        let pool=await sql.connect(config);
        let edityetkili=await pool.request()
        .input("id",sql.Int ,id)
        .input("unvan",sql.NVarChar ,unvan)
        .input("password",sql.NVarChar ,password)
        .query("UPDATE Yetkililer SET unvan=@unvan, password=@password WHERE id=@id")
        return edityetkili.recordset;
    }
    catch(error){
        console.log(error)
    }
}
//edit işletme 
async function editİsletme(id,unvan){
    try{
        
        let pool=await sql.connect(config);
        let editisletme=await pool.request()
        .input("id",sql.Int ,id)
        .input("unvan",sql.NVarChar ,unvan)
    
        .query("UPDATE İsletmeler SET unvan=@unvan where id=@id")
        return editisletme.recordset;
    }
    catch(error){
        console.log(error)
    }
}

//edit aday 
async function editAday(id,ad,soyad,gsm,email,yas,dogum_tarihi,yasadigi_sehir,dogdugu_sehir,toplam_deneyim,son_isyeri,son_isyeri_suresi,cv_url,mezuniyet,cinsiyet,askerlik,ehliyet,sigara,alkol,evlilik,cocuk_sayisi){
    try{
    
        let pool=await sql.connect(config);
        let editaday=await pool.request()
        .input("id",sql.Int ,id)
        .input('ad', sql.NVarChar(50), ad)
        .input('soyad', sql.NVarChar(50), soyad)
        .input('gsm', sql.Numeric, gsm)
        .input('email', sql.NVarChar(100), email)
        .input('yas', sql.Int, yas)
        .input('dogum_tarihi', sql.DateTime, dogum_tarihi)
        .input('yasadigi_sehir',sql.NVarChar(100), yasadigi_sehir)
        .input('dogdugu_Sehir', sql.NVarChar(100), dogdugu_sehir)
        .input('toplam_deneyim', sql.Int, toplam_deneyim)
        .input('son_isyeri', sql.VarChar(50), son_isyeri)
        .input('son_isyeri_suresi', sql.VarChar(50), son_isyeri_suresi)
        .input('cv_url', sql.NVarChar(500), cv_url)
        .input('mezuniyet', sql.NVarChar(30), mezuniyet)
        .input('cinsiyet', sql.VarChar, cinsiyet)
        .input('askerlik', sql.Bit, askerlik)
        .input('ehliyet', sql.Bit, ehliyet)
        .input('sigara', sql.Bit, sigara)
        .input('alkol', sql.Bit, alkol)
        .input('evlilik', sql.Bit, evlilik)
        .input('cocuk_sayisi', sql.Int, cocuk_sayisi)
        .query("UPDATE Adaylar SET ad=@ad,soyad=@soyad ,gsm=@gsm,email=@email ,yas=@yas ,dogum_tarihi=@dogum_tarihi ,yasadigi_sehir=@yasadigi_sehir,dogdugu_sehir=@dogdugu_sehir,son_isyeri=@son_isyeri,toplam_deneyim=@toplam_deneyim ,son_isyeri_suresi=@son_isyeri_suresi ,cv_url=@cv_url, mezuniyet=@mezuniyet,cinsiyet=@cinsiyet,askerlik=@askerlik ,ehliyet=@ehliyet,sigara=@sigara ,alkol=@alkol ,evlilik=@evlilik ,cocuk_sayisi=@cocuk_sayisi  where id=@id")
        return [true, 'Aday bilgileri başarıyla güncellendi.'];
    } 
       catch (error) {
        console.log(error);
        return [false, 'Aday bilgileri güncellenirken bir hata oluştu.'];
        }}


//aktif-pasif users
async function updateUserActivity(id, isActive){
    try{
        let isActiveValue = isActive ? 'true' : 'false'; // isActive true ise 'true', false ise 'false' değerini ata
        let pool = await sql.connect(config);
        let approveUser = await pool.request()
            .input("id", sql.Int, id)
            .input("isActive", sql.NVarChar, isActiveValue)
            .query("UPDATE Kullanıcılar SET isActive=@isActive WHERE id=@id")
        return approveUser.recordset;
    } catch (err) {
        console.log(err);
    }
}


//pozisyonları getir
async function getPosition(){
    try{

        let pool=await sql.connect(config);
        let tümdata=await pool.request().query("Select id,yetkiliId,isletmeId,(select adsoyad from Yetkililer where id=yetkiliId)yetkili,(select unvan from İsletmeler where id=isletmeId)isletme,unvan,deneyim_yili,min_yas,max_yas,seyehat_engeli,cinsiyet,askerlik,ehliyet,sehir,bolge,mezuniyet from Pozisyonlar");
        const data={data:tümdata.recordset}
        return data;
    }

    catch(error){
        console.log(error);
    }
}


async function adaycvurlguncelle(cvUrl,adayId){
    try{
        let pool=await sql.connect(config);
        const updateQuery = `UPDATE Adaylar SET cv_url = '${cvUrl}' WHERE id = '${adayId}'`;
        await pool.request().query(updateQuery);
    }

    catch(error){
        console.log(error);
    }
}


//adayları getir
async function getAdaylar(){
    try{
        let pool=await sql.connect(config);
        let tümdata=await pool.request().query("SELECT * FROM Adaylar");
        const data={data:tümdata.recordset}
        return data;
    }

    catch(error){
        console.log(error);
    }
}


async function insertAday(ad,soyad,gsm,email,yas,dogum_tarihi,yasadigi_sehir,dogdugu_sehir,toplam_deneyim,son_isyeri,son_isyeri_suresi,cv_url,mezuniyet,cinsiyet,askerlik,ehliyet,sigara,alkol,evlilik,cocuk_sayisi){
    try{
        let pool=await sql.connect(config);
        let adayEkle=await pool.request()
        .input('ad', sql.NVarChar(50), ad)
        .input('soyad', sql.NVarChar(50), soyad)
        .input('gsm', sql.Numeric, gsm)
        .input('email', sql.NVarChar(100), email)
        .input('yas', sql.Int, yas)
        .input('dogum_tarihi', sql.DateTime, dogum_tarihi)
        .input('yasadigi_sehir',sql.NVarChar(100), yasadigi_sehir)
        .input('dogdugu_sehir', sql.NVarChar(100), dogdugu_sehir)
        .input('toplam_deneyim', sql.Int, toplam_deneyim)
        .input('son_isyeri', sql.VarChar(50), son_isyeri)
        .input('son_isyeri_suresi', sql.VarChar(50), son_isyeri_suresi)
        .input('cv_url', sql.NVarChar(500), cv_url)
        .input('mezuniyet', sql.NVarChar(30), mezuniyet)
        .input('cinsiyet', sql.VarChar,cinsiyet)
        .input('askerlik', sql.Bit, askerlik)
        .input('ehliyet', sql.Bit, ehliyet)
        .input('sigara', sql.Bit, sigara)
        .input('alkol', sql.Bit, alkol)
        .input('evlilik', sql.Bit, evlilik)
        .input('cocuk_sayisi', sql.Int, cocuk_sayisi)
        .query("INSERT INTO Adaylar (ad,soyad,gsm,email,yas,dogum_tarihi,yasadigi_sehir,dogdugu_sehir,toplam_deneyim,son_isyeri,son_isyeri_suresi,cv_url,mezuniyet,cinsiyet,askerlik,ehliyet,sigara,alkol,evlilik,cocuk_sayisi) values(@ad,@soyad,@gsm,@email,@yas,@dogum_tarihi,@yasadigi_sehir,@dogdugu_sehir,@toplam_deneyim,@son_isyeri,@son_isyeri_suresi,@cv_url,@mezuniyet,@cinsiyet,@askerlik,@ehliyet,@sigara,@alkol,@evlilik,@cocuk_sayisi);")
        return adayEkle.recordset;
    }
    catch(error){
        console.log(error); 

    }
}



// İşletmeler
async function getIsletmeler(){
    try{
        let pool=await sql.connect(config);
        let alldata=await pool.request().query("Select * from İsletmeler");
        const data={data:alldata.recordset}
        return data;
    }
    
    catch(error){
        console.log(error);
    }
} 
async function insertNot(id,degerlendirme){
    try{
        let pool=await sql.connect(config);
        let alldata=await pool.request()
        .input('id', sql.Int, id)
        .input('degerlendirme', sql.NVarChar, degerlendirme)
        .query("UPDATE Görüsmeler SET degerlendirme = @degerlendirme WHERE id = @id;");
        const data={data:alldata.recordset}
        return data;
    }
    catch(error){
        console.log(error);
    }
} 


// Gorusmeler 
async function getGorusmeler(){
    try{
        let pool=await sql.connect(config);
        let alldata=await pool.request().query("Select id, (select adsoyad from Yetkililer where id=yetkili_id) yetkili_ID ,(select unvan from Pozisyonlar where id=pozisyon_id) pozisyon_ID,(select CONCAT (ad,'', soyad) from Adaylar where id=aday_id) aday_ID,  (select İsletmeler.unvan from Pozisyonlar INNER JOIN İsletmeler ON Pozisyonlar.isletmeId=İsletmeler.id where Pozisyonlar.id = Görüsmeler.pozisyon_id)isletmeID ,saat,tarih,degerlendirme from Görüsmeler");
        const data={data:alldata.recordset}
        return data;
    }
    
    catch(error){
        console.log(error);
    }
}

async function getUsers(){
    try{
        let pool=await sql.connect(config);
        let allPosition=await pool.request().query("Select * from Kullanıcılar");
        const data={data:allPosition.recordset}
        return data;
    }

    catch(error){
        console.log(error);
    }
}



async function getYetkililer(){
    try{
        let pool=await sql.connect(config);
        let allYetkili=await pool.request().query("Select * from Yetkililer");
        const data={data:allYetkili.recordset}
        return data;
    }
    catch(error){
        console.log(error);
    }
}





function generateToken() {
    const tokenLength = 20; // Token uzunluğu
    const tokenChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Kullanılacak karakterler
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
        token += tokenChars.charAt(Math.floor(Math.random() * tokenChars.length));
    }
    return token;
}


  

module.exports={
    
    generateToken:generateToken,
    login:login,
    getPosition:getPosition,
    getYetkililer:getYetkililer,
    insertYetkili:insertYetkili,
    insertRegister:insertRegister,
    getUsers:getUsers,
    deleteYetkili:deleteYetkili,
    editYetkili:editYetkili,
    getIsletmeler:getIsletmeler,
    editİsletme:editİsletme,
    deleteİsletme:deleteİsletme,
    insertIsletme:insertIsletme,
    getGorusmeler:getGorusmeler,
    insertNot:insertNot,
    editAday:editAday,
    getAdaylar:getAdaylar,
    insertAday:insertAday,
    deleteAday:deleteAday,
    updateUserActivity:updateUserActivity,
    insertPosition:insertPosition,
    adaycvurlguncelle:adaycvurlguncelle


}