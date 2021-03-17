
import express from 'express';
import socketIO from 'socket.io';
import { SERVER_PORT } from '../global/environment';
import http from 'http';
import * as miSocket from '../sockets/socket';
import cors from 'cors';

export default class Server {
    // la siguiente linea es por que fernando creo el contructor privado para que no se puede crear multiples instancia de la clase servidor
    // por ende,  creo la variable _instance, y el metodo instance, el cual retorna una instancia de la clase, sino existe crea la instancia
    private static _instance: Server;
    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    private httpServer : http.Server;


    private constructor() {

        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.io = new socketIO.Server(this.httpServer, 
            { 
                cors: { 
                    origin: "http://localhost:4200",
                    methods: ["GET", "POST"],
                    credentials: true
                } 
            })
        this.esucharSockets();
    }
    public static get instance() {
        return this._instance || (this._instance = new this() );
    }
    private esucharSockets() {
        console.log('escuchando conexiones');
        this.io.on('connect', cliente=>{
            // Conectar cliente
            miSocket.conectarCliente(cliente );
            
            miSocket.configurarUsuario(cliente , this.io );
            // console.log('cliente conectado');
            // console.log('cliente conectado: '+ cliente.id);
            miSocket.mensaje(cliente, this.io);
            //evento que escucha cuando un frontend en especifico me pregunta quienes estan conectados
            miSocket.obtenerUsuarios(cliente, this.io);
            miSocket.desconectar(cliente, this.io);
        });

        
    }
    start( callback: Function | any ) {

        this.httpServer.listen( this.port, callback );

    }

}