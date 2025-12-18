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

router.get('/tarefas', (req: Request, res: Response) => {
    // Sua Lógica: Retornar a lista completa de tarefas
    return res.json(tarefas);
});

router.post('/tarefas', (req: Request, res: Response) => {
    const { titulo } = req.body; 

    if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
        // HTTP 400: Requisição Inválida (Bad Request)
        // O req.body contém os dados que o cliente enviou (ex: via Postman)
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

router.delete('/tarefas',  (req: Request, res: Response) => {
    const idParaExcluir = parseInt(req.params.id);

    console.log("ID que chegou na URL:", req.params.id);
    // encontrar dentro do array
    const tamanhoArray = tarefas.length;
    
    if (isNaN(idParaExcluir)) {
        return res.status(400).json({ error: "ID inválido. Use um número na URL." });
    }
    // via excluir todos os ids exceto os não selecionados 
    tarefas = tarefas.filter(t => t.id !== idParaExcluir); 

    // caso não encontre o id
    if (tamanhoArray === tarefas.length){
        // significa que o id não existia
        return res.status(404).json({ error: `Tarefa com ID ${idParaExcluir} não encontrada.` });
    }

    // caso encontrado, ele apenas precisa retornar 204 - HTTP 204: Sem Conteúdo (No Content) - Usado para exclusões bem-sucedidas

    return res.status(204).json({correct: `Id ${idParaExcluir} locallizado e excluido com Sucesso.`})
})


export default router; // para importar é: import router from "./..", pois definimos esse modulo como router 