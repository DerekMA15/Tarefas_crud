import express, {Router, Request, Response } from 'express';
import { Tarefa } from './Tarefa';
import pool from '../database'; // agora iremos usar a nossa pool- o nosso banco de dados
// nota: ainda n entendi muito bem sobre a pool, mas estou seguindo uma sequência de passsos e conforme for entendendo faço as melhorias qwue achar melhor.

const router = Router(); 
// é que nem um this, mas para APIs, vejoo dessa forma e tem diversas semelhanças

// remove do nextid porque o nosso banco de dados tem a opção de SERIAL que irá criar os IDs conforme a adição de tarefas.

// agora como vamos mexer com um banco de dados, ou seja, com comunicação serial de 'locais' diferentes, existe e vai ocorrer a questão do delay, para isso temos que usar os assync/await.
// assync : carregue de maneira assincrona enquanto outras coisas acontece, geralmente são coisas que não desecadeiam uma quebra de outros passos. 
// await : faz todo o processo parar até que essa etapa seja concluida, algo providencial no código. 

// GET ======================================
router.get ('/', async (req: Request, res: Response) => {
    //tente: buscar as informações no nosso database, espere elas carregarem e as retornem.
    try{
        const result = await pool.query('SELECT * FROM tarefas ORDER BY id ASC');
        return res.json((result.rows));// Retornamos apenas as linhas (rows) da tabela
    }
    //error: caso nossa tentativa seja fracassada, retorne error. 
    catch(error){
        console.error("Erro ao conectar no banco:", error);
        return res.status(500).json({ error: "Erro ao buscar tarefas no banco de dados." });
    }
});

// POST =======================================
router.post('/', async(req: Request, res: Response) => {
    const { titulo } = req.body; 

    // verifiação de titulo
    if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
        // HTTP 400: Requisição Inválida (Bad Request)
        // O req.body contém os dados que o cliente enviou (ex: via Postman)
        return res.status(400).json({ error: 'O título da tarefa é obrigatório.' });
    }

    /*ATENÇÃO: Nunca devemos colocar variáveis diretamente dentro da string SQL, 
    como: ...VALUES ('${titulo}') (Isso permite que hackers apaguem seu banco enviando textos maliciosos).*/

    /* 'INSERT INTO tarefas (titulo) VALUES  ($1) -> dessa forma a gente seleciona qual parte da tabela 
    a gente preenche que é conforme escolhemos na hora que definimos a tabela;
    a nossa tabela que criamos: 
    tarefas_crud=# CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY, <- ($1)
    titulo VARCHAR(255) NOT NULL,  <- ($2)
    concluida BOOLEAN DEFAULT false );  <- ($3)
    */
    try {
        const querySQL = 'INSERT INTO tarefas (titulo) VALUES ($1) RETURNING *'
        const valores = [titulo.trim()];

        const result = await pool.query(querySQL, valores); 
       
        return res.status(201).json();
    }
    catch(error:any){
        console.log("--- ERRO NO POST ---");
        console.log("Mensagem:", error.message);
        console.log("Código:", error.code);
        console.log("--------------------");
        return res.status(500).json({ error: "Erro ao inserir nova tarefa" });
    }
})

// DELETE =======================================
router.delete('/:id', async  (req: Request, res: Response) => {
    const IDParaExcluir = parseInt(req.params.id);
    console.log("ID que chegou na URL:", req.params.id);
    // teste se é vallido para excluir
    if (isNaN(IDParaExcluir)) {
        return res.status(400).json({ error: "ID inválido. Use um número na URL." });
    }
    try {
        const deleteID = 'DELETE FROM tarefas WHERE  id = $1 ';
        const result = await pool.query(deleteID,[IDParaExcluir]);    
        
        if (result.rowCount === 0){
            // comparação entre o tamanho antes do delete e depois do delete - caso seja igual é porque o ID n existe.
            return res.status(404).json({ error: `Tarefa com ID ${IDParaExcluir} não encontrada.` });
        
        }
        // caso encontrado, ele apenas precisa retornar 200 - HTTP 200: Sem Conteúdo (No Content) - Usado para exclusões bem-sucedidas

        /*Para enviar mensagem: use res.status(200).json({ ... }).

        Para não enviar mensagem (apenas o OK): use res.status(204).send(). */    
        return res.status(200).json({correct: `Id ${IDParaExcluir} locallizado e excluido com Sucesso.`})
    }

    // caso não encontre o id
    catch(error:any){
        console.log("--- ERRO NO POST ---");
        console.log("Mensagem:", error.message);
        console.log("Código:", error.code);
        console.log("--------------------");
        return res.status(500).json({ error: "Erro ao inserir nova tarefa" });
    }
})

// // PUT =======================================
// router.put('/:id',  (req: Request, res: Response) => {
//     const idParaEditar = parseInt(req.params.id);
//     const { titulo } = req.body;
//     const concluida = req.body; 

//     console.log(`Tentando editar a tarefa ${idParaEditar} para o novo título: ${titulo}`);
//     console.log("ID que chegou na URL:", req.params.id);

//     if (isNaN(idParaEditar)) {
//         return res.status(400).json({ error: "ID inválido. Use um número na URL." });
//     }
//    const indiceTarefa =  tarefas.findIndex(t => t.id === idParaEditar)
  

//     // caso não encontre o id
//     if ( indiceTarefa === -1){
//         return res.status(404).json({ error: `Tarefa com ID ${idParaEditar} não encontrada.` });
//     }
//     // Validação título
//     if (!titulo || titulo.trim().length === 0) {
//         return res.status(400).json({ error: "O novo título deve ser preenchido." });
//     }

// // validação do que foi alterado, caso seja undefined, apenas manter os antigos. 
//     const task = tarefas[indiceTarefa];

//     if(titulo !== undefined){
//         task.titulo = titulo.trim();
//     }
//     else{
//         task.titulo = tarefas[indiceTarefa].titulo;
//     }

//     if(concluida !== undefined){
//         task.concluida = concluida;
//     }
//     else{
//         task.concluida = tarefas[indiceTarefa].concluida;
//     }
//     return res.status(200).json({correct: `Id ${idParaEditar} locallizado e excluido com Sucesso.`})
// })

export default router; // para importar é: import router from "./..", pois definimos esse modulo como router 