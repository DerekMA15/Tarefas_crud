
import { Tarefa } from './entities/Tarefa';
import express, {Request, Response } from 'express';

const app = express();

const PORT = process.env.PORT || 3000; // definir a porta de leitura de valores como a rota 3000;

app.use(express.json())

// endpoint responsavel por listar todas as tasks
// app.get('/', (req:Request, res:Response) => {
     // retornando um obj json
//     res.json({tarefa})
// });

let tarefas:Tarefa[] = [
    { id: 1, titulo: "Configurar Ambiente", concluida: true },
    { id: 2, titulo: "Criar Rota GET", concluida: false }
];


app.get('/tarefas', (req: Request, res: Response) => {
    // Sua Lógica: Retornar a lista completa de tarefas
    return res.json(tarefas);
});
    

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});



