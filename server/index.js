const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

function e2() {
    var u='',m='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',i=0,rb=Math.random()*0xffffffff|0;
    while(i++<36) {
        var c=m[i-1],r=rb&0xf,v=c=='x'?r:(r&0x3|0x8);
        u+=(c=='-'||c=='4')?c:v.toString(16);rb=i%8==0?Math.random()*0xffffffff|0:rb>>4
    }
    return u
}

var CLIENTS=[]
io.on('connection',(ws)=>{
    ws.id = e2()
    CLIENTS.push(ws)

    ws.emit('newqrdata', ws.id)

    ws.on('qrcodedetected',(id)=>{
        const user = CLIENTS.filter((item) => item.id == id)[0]
        user.emit('redirect')
    })
})


app.use(express.static('public'))
app.set('view engine','ejs')

app.get('/qrcode',(req,res)=>{
    res.render('qrcode/index')
})

server.listen(8555,'192.168.1.3',()=>{
    console.log('server listen on http://192.168.1.3:8555')
})