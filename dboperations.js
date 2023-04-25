const express = require('express');
var config = require('./db.config');
const sql = require('mssql');
const yetkili = require('./yetkililer');
const { request, response } = require('express');
const app = express();



//Login
async function login(email,password) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('email', sql.VarChar(50), email)
            .input('password', sql.VarChar(50), password)
            .query('SELECT email,password FROM Kullanıcılar WHERE email = @email and password = @password UNION SELECT email,password FROM Yetkililer WHERE email = @email and password = @password')
            if(result.recordset.length > 0){
                return true; // kullanıcı var
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

async function insertRegister(adsoyad,email,password){
    try{
        let pool=await sql.connect(config);
        let Yetkili=await pool.request()
        .input('adsoyad', sql.VarChar(50), adsoyad)
        .input('email', sql.NVarChar, email)
        .input('password', sql.VarChar(50), password)
        .query("INSERT INTO Kullanıcılar (adsoyad,email,password) values(@adsoyad,@email,@password);")
        return Yetkili.recordset;
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

async function editYetkili(id,unvan){
    try{
        let pool=await sql.connect(config);
        let edityetkili=await pool.request()
        .input("id",sql.Int ,id)
        .input("unvan",sql.NVarChar ,unvan)
        .query("UPDATE Yetkililer SET unvan=@unvan WHERE id=@id")
        return edityetkili.recordset;
    }
    catch(error){
        console.log(error)
    }
}

//approved users
async function approvedUsers(id,approved){
    try{
        let pool=await sql.connect(config);
        let approveUser=await pool.request()
        .input("id",sql.Int ,id)
        .input("approved",sql.Bit ,approved)
        .query("UPDATE Kullanıcılar SET approved=@approved WHERE id=@id")
        return approveUser.recordset;
       
      } catch (err) {
        console.log(err);
      }
    }

    //passiveUser users
async function passiveUser(id,approved){
    try{
        let pool=await sql.connect(config);
        let passiveuser=await pool.request()
        .input("id",sql.Int ,id)
        .input("approved",sql.Bit ,approved)
        .query("UPDATE Kullanıcılar SET approved=@approved WHERE id=@id")
        return passiveuser.recordset;
       
      } catch (err) {
        console.log(err);
      }
    }


//pozisyonları getir
async function getPosition(){
    try{
        let pool=await sql.connect(config);
        let tümdata=await pool.request().query("Select * from Pozisyonlar");
        const data={data:tümdata.recordset}
        return data;
    }

    catch(error){
        console.log(error);
    }
}
//adayları getir
async function getAdaylar(){
    try{
        let pool=await sql.connect(config);
        let tümdata=await pool.request().query("Select * from Adaylar");
        const data={data:tümdata.recordset}
        return data;
    }

    catch(error){
        console.log(error);
    }
}

// İşletmeler
async function getIsletmeler(){
    try{
        let pool=await sql.connect(config);
        let tümdata=await pool.request().query("Select * from İsletmeler");
        const data={data:tümdata.recordset}
        return data;
    }

    catch(error){
        console.log(error);
    }
}

async function getUsers(){
    try{
        let pool=await sql.connect(config);
        let tümPosition=await pool.request().query("Select * from Kullanıcılar");
        const data={data:tümPosition.recordset}
        return data;
    }

    catch(error){
        console.log(error);
    }
}



async function getYetkililer(){
    try{
        let pool=await sql.connect(config);
        let tümYetkili=await pool.request().query("Select * from Yetkililer");
        const data={data:tümYetkili.recordset}
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
    getAdaylar:getAdaylar,
    approvedUsers:approvedUsers,
    passiveUser:passiveUser,

}