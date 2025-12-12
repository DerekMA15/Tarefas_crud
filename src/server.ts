
import { Tarefa } from './entities/Tarefa';
import express, { Request, Response } from 'express';

const app = express();

const PORT = process.env.PORT || 3000; // definir a porta de leitura de valores como a rota 3000;

/*Endpoints de Leitura: Criar rotas simples para buscar dados estáticos ou 
personalizar respostas. Simula a criação de um endpoint básico. */

app.use(express.json())
// criar um midleware, que é basicamente um tradutor, o signficado real é intermediador, porque as respostas irão vim em .json]
// e precisamos transformalas em dados apropriados e serve para o contrario também


// Manipulação de Rota Simples
app.get('/', (req:Request, res:Response) => {

    // retornando um obj json
    res.json({
        message: 'Servidor vai cairrr'
    })
});

app.get('/task', (req:Request, res:Response) => {

    // retornando um obj json
    res.json({
        message: 'olá mundo'
    })
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});



