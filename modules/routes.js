const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

module.exports = {
    home:(req,res)=>{
        res.writeHead(200,{
            'Content-Type':'text/html;charset=utf-8'
        });
        var data = fs.readFileSync(path.resolve(__dirname,'../views/home.html'));
        res.write(data);
        res.end()
    },
    login:(req,res)=>{
        res.writeHead(200,{
            'Content-Type':'text/html;charset=utf-8'
        });
        var data = fs.readFileSync(path.resolve(__dirname,'../views/login.html'));
        res.write(data);
        res.end()
    },
    register:(req,res)=>{
        res.writeHead(200,{
            'Content-Type':'text/html;charset=utf-8'
        });
        var data = fs.readFileSync(path.resolve(__dirname,'../views/register.html'));
        res.write(data);
        res.end()
    },
    img:(req,res)=>{
        res.writeHead(200,{
            'Content-Type':'image/jpeg'
        });
        var data = fs.readFileSync(path.resolve(__dirname,'../images/1.jpg'));
        res.write(data,'binary');
        res.end()
    },
    registerfn:(req,res)=>{
        res.writeHead(200,{
            'Content-Type':'text/html;charset=utf-8'
        })
        var rawData = '';
        req.on('data',(chunk)=>{
            rawData += chunk;
        });
        req.on('end',()=>{
            var param = qs.parse(rawData);
            MongoClient.connect(url,{useNewUrlParser:true},(err,client)=>{
              if(err){
                  console.log("数据库连接失败")
              }else{
                  console.log("数据库连接成功");
                  var db = client.db('1811a');
                  db.collection('users').insertOne({
                      name:param.username,
                      pwd:param.password
                  },(err)=>{
                      if(err){
                          console.log("注册失败");
                          res.write("注册失败")
                      }else{
                        console.log("注册成功");
                        res.write("注册成功")
                      }
                      client.close();
                      res.end();
                  })
              }

            });

        })
    },
    loginfn:(req,res)=>{
        res.writeHead(200,{
            'Content-Type':'text/html;charset=utf-8'
        });
        var rawData ='';
        req.on('data',(chunk)=>{
            rawData += chunk;
        });
        req.on('end',()=>{
            var param = qs.parse(rawData);
            MongoClient.connect(url,{useNewUrlParser:true},(err,client)=>{
                if(err){
                    console.log("数据库连接失败")
                }else{
                    console.log("数据库连接成功")
                    var db = client.db('1811a');
                    db.collection('users').find({
                        name:param.username,
                        pwd:param.password
                    }).count((err,num)=>{
                        if(err){
                            console.log("查询失败");
                        }else{
                            console.log("查询成功");
                            if(num === 1){
                                console.log("登录成功");
                                res.write('登录成功')
                            }else{
                                console.log("登录失败");
                                res.write('用户名或密码不正确')
                            }
                        }
                        client.close();
                        res.end();
                    })
                }
                
            })
        })
    }
}