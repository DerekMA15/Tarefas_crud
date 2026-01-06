import router from './entities/Tarefa.router';
import { Tarefa } from './entities/Tarefa';
import express, {Request, Response } from 'express';

const app = express();

const PORT = process.env.PORT || 3000; // definir a porta de leitura de valores como a rota 3000;

app.use('/tarefas', router)

app.post('/tarefas', router);
app.get('/tarefas',router);
app.delete('/tarefas/', router);
app.put('/tarefas/', router);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Servidor rodando em http://localhost:${PORT}/tarefas`);
});




