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

// GET =======================================

router.get('/', (req: Request, res: Response) => {
    // Sua Lógica: Retornar a lista completa de tarefas
    return res.json(tarefas);
});

// POST =======================================

router.post('/', (req: Request, res: Response) => {
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

// DELETE =======================================
router.delete('/:id',  (req: Request, res: Response) => {
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

    // caso encontrado, ele apenas precisa retornar 200 - HTTP 200: Sem Conteúdo (No Content) - Usado para exclusões bem-sucedidas

    /*Para enviar mensagem: use res.status(200).json({ ... }).

    Para não enviar mensagem (apenas o OK): use res.status(204).send(). */
    return res.status(200).json({correct: `Id ${idParaExcluir} locallizado e excluido com Sucesso.`})
})

// PUT =======================================
router.put('/:id',  (req: Request, res: Response) => {
    const idParaEditar = parseInt(req.params.id);
    const { titulo } = req.body;
    const concluida = req.body; 

    console.log(`Tentando editar a tarefa ${idParaEditar} para o novo título: ${titulo}`);
    console.log("ID que chegou na URL:", req.params.id);

    if (isNaN(idParaEditar)) {
        return res.status(400).json({ error: "ID inválido. Use um número na URL." });
    }
   const indiceTarefa =  tarefas.findIndex(t => t.id === idParaEditar)
  

    // caso não encontre o id
    if ( indiceTarefa === -1){
        return res.status(404).json({ error: `Tarefa com ID ${idParaEditar} não encontrada.` });
    }
    // Validação título
    if (!titulo || titulo.trim().length === 0) {
        return res.status(400).json({ error: "O novo título deve ser preenchido." });
    }

// validação do que foi alterado, caso seja undefined, apenas manter os antigos. 
    const task = tarefas[indiceTarefa];

    if(titulo !== undefined){
        task.titulo = titulo.trim();
    }
    else{
        task.titulo = tarefas[indiceTarefa].titulo;
    }

    if(concluida !== undefined){
        task.concluida = concluida;
    }
    else{
        task.concluida = tarefas[indiceTarefa].concluida;
    }
    return res.status(200).json({correct: `Id ${idParaEditar} locallizado e excluido com Sucesso.`})
})

export default router; // para importar é: import router from "./..", pois definimos esse modulo como router 