const express = require("express");
// import { engine } from 'express-handlebars';
const { engine } = require('express-handlebars');
const fileUpload = require('express-fileupload');
const app = express();
const mysql = require(`mysql`); //ドライバを使用するための記述


const PORT = 5000;

app.use(fileUpload());
// インポートしたメソッドを呼び出し。
app.use(express.static(`upload`));
// 静的ファイルの参照先を指定

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');






app.get("/" , (req , res) =>{ //これがルートディレクトリ
    // res.render("home");
    // poolではサーバーとDB間の連携を行っている。
    pool.getConnection((err, connection) => { //左記についてはmysql.npmを参照する
        if(err) throw err;

        console.log(`mysqlと接続中`) 
        
        // 次はデータ取得から
        connection.query("SELECT * FROM images" , (_err , rows)=>{ //imageテーブルから全て取得する命令
            connection.release();
            // console.log(rows);
            if(!err){
                res.render("home" , {rows}) //波カッコ内にrowsを入れてあげることでテンプレートエンジンにデータを渡す
            }
        })

    })

})

// ファイル名を追加
app.post("/",(req,res)=>{
    if(!req.files){
        return res.status(400).send("何も画像がアップロードされていません");
    }
    console.log(req.files);
    let imageFile = req.files.imageFile;
    let uploadPath = __dirname + `/upload/`+imageFile.name;

    // サーバーに画像ファイルを置く場所の指定
    imageFile.mv(uploadPath , function(err){
        if(err)return res.status(500).send(err);
        // res.send(`画像アップロードに成功しました。`)
    });

    pool.getConnection((err, connection) => { //左記についてはmysql.npmを参照する
    if(err) throw err;

    // MySQLに画像ファイルの名前を追加取得して保存する
    connection.query(`INSERT INTO images values ("1","${imageFile.name}")` ,
     (err , rows)=>{
        connection.release();

        if(!err){
            res.redirect("/") //ページをリフレッシュ
        }else{
            console.log(err);
        }
    });
    });
});


app.listen(PORT , () =>console.log("サーバ起動中"))