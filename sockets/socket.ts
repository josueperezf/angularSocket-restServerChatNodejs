import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente  = (cliente:Socket )=> {
    const usuario =  new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
}

export const desconectar = (cliente:Socket, io:socketIO.Server)=> {
    cliente.on('disconnect', () => {         
        console.log('cliente desconectado desde folder socket');
        usuariosConectados.borrarUsuario(cliente.id);

        // cuando alguien se desconecta, le informamos a todos los usuarios que ese usuario se fue
        io.emit('usuarios-activos', usuariosConectados.getLista());

    });
}
// escuchar mensajes
export const mensaje = (cliente:Socket, io:socketIO.Server)=> {
    cliente.on('mensaje',(payload: { de:string, cuerpo:string })=>{
        console.log(payload);
        io.emit('mensaje-nuevo',payload);
    });
}

// login 
export const configurarUsuario = (cliente:Socket, io:socketIO.Server )=> {
    cliente.on('configurar-usuario',(payload: { nombre:string }, callback: Function )=>{
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        // informamos a todas las personas que estan conectadas que llego alguien nuevo y que ya tiene el nombre y demas
        io.emit('usuarios-activos', usuariosConectados.getLista());
        callback({
            ok:true,
            mensaje:`Usuario ${payload.nombre}, configurado`
        });
    });
}

// obtenerUsuarios solo al cliente que lo pida
export const obtenerUsuarios = (cliente:Socket, io:socketIO.Server )=> {
    cliente.on('obtener-usuarios',( )=>{
        // informamos a todas las personas que estan conectadas que llego alguien nuevo y que ya tiene el nombre y demas
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
    });
}