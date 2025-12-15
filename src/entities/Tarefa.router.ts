import express, {Router, Request, Response } from 'express';
import { Tarefa } from './Tarefa';


const router = Router(); 

// é que nem um this, mas para APIs, vejoo dessa forma e tem diversas semelhanças

// nosso 'Banco de dados local' pois esse só irar salvar enquanto o projeto estiver rodando de pé, dps disso ele irar apagar
let tarefas:Tarefa[] = [
    { id: 1, titulo: "Configurar Ambiente", concluida: true },
    { id: 2, titulo: "Criar Rota GET", concluida: false }
];

let nextId = 3;


router.get('/', (req: Request, res: Response) => {
    // Sua Lógica: Retornar a lista completa de tarefas
    return res.json(tarefas);
});

router.post('/', (req: Request, res: Response) => {
    const { titulo } = req.body; 

    if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
        // HTTP 400: Requisição Inválida (Bad Request)
        return res.status(400).json({ error: 'O título da tarefa é obrigatório.' });
    }

    const novaTarefa: Tarefa = {
        id: nextId,
        titulo: titulo.trim(), // Remove espaços extras
        concluida: false
    };

    tarefas.push(novaTarefa);
    nextId++; // Incrementa para garantir que o próximo item terá um ID único

    // HTTP 201: Criado (Created)
    return res.status(201).json(novaTarefa);
})

export default router;