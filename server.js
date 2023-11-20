const express = require("express");
// import { engine } from 'express-handlebars';
const { engine } = require('express-handlebars');
const fileUpload = require('express-fileupload');
const app = express();


const PORT = 5000;

app.use(fileUpload());
// インポートしたメソッドを呼び出し。
app.use(express.static(`upload`));
// 静的ファイルの参照先を指定

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.get("/" , (req , res) =>{ //これがルートディレクトリ
    res.render("home");
})


app.post("/",(req,res)=>{
    if(!req.files){
        return res.status(400).send("何も画像がっぷロードされていません");
    }
    console.log(req.files);
    let imageFile = req.files.imageFile;
    let uploadPath = __dirname + `/upload/`+imageFile.name;

    // サーバーに画像ファイルを置く場所の指定
    imageFile.mv(uploadPath , function(err){
        if(err)return res.status(500).send(err);
        res.send(`画像アップロードに成功しました。`)
    });
});


app.listen(PORT , () =>console.log("サーバ起動中"))