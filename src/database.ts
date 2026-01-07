import { Pool } from 'pg';

// Justificativa do Pool: Criamos uma "piscina" de conexões. 
// Em vez de abrir uma conexão nova toda vez (o que é lento), 
// o código pega uma que já existe na piscina, usa e devolve.


const pool = new Pool({
  user: 'postgres',          // O usuário "dono" do banco no Linux
  host: 'localhost',         // Onde o banco está (na sua própria máquina)
  database: 'tarefas_crud',  // O "livro" que você criou no psql
  password: '1234',     // A senha que você definiu (se houver)
  port: 5432,                // A porta padrão onde o Postgres "escuta"
});

pool.query('SELECT NOW()', (err, res) => {
    // o SELECT NOW() pede às horas ao BD e caso ele responda ja nos garante que ele está ativo, caso não responda ja sabemos que ele tá desativado.
  if (err) {
    console.error('❌ Erro crítico: Não foi possível conectar ao banco de dados!', err.message);
  } else {
    console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso!');
  }
});

export default pool;