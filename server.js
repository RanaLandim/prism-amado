const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./database.db');

// Configurações do servidor
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST']
}));
app.use(bodyParser.json());

// Ajuste o caminho para a pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Criação das tabelas 
db.serialize(() => {
  // Criação garantida das duas tabelas
  db.run(`CREATE TABLE IF NOT EXISTS Inscricoes (
    cpf TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    nome_social TEXT,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    evento TEXT,
    oficina TEXT,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Denuncias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    tipo_denuncia TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Rotas da API
app.post('/api/inscricao', (req, res) => {
  // Extrai os dados do corpo da requisição (POST)
  const { nome, cpf, email, telefone } = req.body;

  // Define o array "valores" na ordem das colunas do INSERT
  const valores = [nome, cpf, email, telefone]; // Adapte conforme suas colunas

  db.run(
    `INSERT INTO Inscricoes (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)`,
    valores, // Agora "valores" está definido
    function(err) {
      
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: "CPF já cadastrado" });
      }
      return res.status(500).json({ error: err.message });
    }
      // Busca o registro inserido (usando rowid)
      db.get(`
        SELECT *, rowid as registro_id 
        FROM Inscricoes 
        WHERE rowid = ?`, 
        [this.lastID],
        (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          
          console.log("Registro salvo:", row);
          res.json({ 
            success: true,
            registro_id: row.registro_id,
            cpf: row.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4") // Mascara o CPF
          });
        }
      );
    }
  );
});

app.post('/api/denunciar', (req, res) => {
  console.log("Dados recebidos:", req.body);

  const { nome, email, tipoDenuncia } = req.body;
  
 
  db.run(
    `INSERT INTO Denuncias (nome, email, tipo_denuncia) VALUES (?, ?, ?)`,
    [nome, email, tipoDenuncia],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Busca o registro recém-inserido
      db.get("SELECT * FROM Denuncias WHERE id = ?", [this.lastID], (err, row) => {
        if (err) console.error("Erro ao verificar inserção:", err);
        else console.log("Registro inserido:", row);
        
        res.json({ success: true, inserted: row });
      });
    }
  );
});

// Rota para servir o HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});