const express = require('express')
const app = express()
const {engine} = require('express-handlebars')
const {Server:HttpServer}=require('http');
const {Server:IOServer}=require('socket.io');
const httpServer=new HttpServer(app);
const io=new IOServer(httpServer);
// NOTA : OTRA FORMA DE LLAMARLOS
// const server = require('http').Server(app)
// const io = require('socket.io')(server)
let messages = [];
let products = [];

app.use(express.static('public'));
app.engine("handlebars",engine())
app.set("view engine","handlebars")

io.on('connection',socket=> {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', messages);
    socket.emit('products',products);
    socket.on('new-message',data=> {
        messages.push(data); 
        io.sockets.emit('messages', messages); 
    });
    socket.on('new-product',data2=> {
        products.push(data2);
        io.sockets.emit('products', products);
    })    
});


const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => { 
    console.log(`Servidor Http con Websockets escuchando en el puerto ${server.address().port}`);
})
server.on('error', error => console.log(`Error en servidor ${error}`))
