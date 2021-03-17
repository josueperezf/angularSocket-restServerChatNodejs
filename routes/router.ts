
import { Router, Request, Response } from 'express';
import Server from '../classes/server';

const router = Router();



router.get('/mensajes', ( req: Request, res: Response  ) => {

    res.json({
        ok: true,
        mensaje: 'Todo esta bien!!'
    });

});

router.post('/mensajes', ( req: Request, res: Response  ) => {
    // esta seccion es por si queremos un enpoint donde desde otra fuente, enviemos un mensajes a todos los usuarios conectados, el mensaje llegara a la sala
    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    // al llamanar a la clase server el y el metodo instance, nos esta retornando la misma instancia de la clase
    const server = Server.instance;
    const payload = {
        de,
        cuerpo
    };
    server.io.emit('mensaje-nuevo',payload);
    res.json({
        ok: true,
        cuerpo,
        de
    });

});


router.post('/mensajes/:id', ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;
    // al llamanar a la clase server el y el metodo instance, nos esta retornando la misma instancia de la clase
    const server = Server.instance;
    // cada persona tiene una sala asignada, la cual tiene como nombre su id de socket
    const payload = {
        de,
        cuerpo
    };
    console.log({id});
    // con in envia el mensaje solo a una persona, el id es el de la persona que recibira el mensaje
    server.io.in(id).emit('mensaje-privado',payload);

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });

});



export default router;


