// Importa o Express, Body-Parser e FS
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = 'data.json';

// Permite receber JSON
app.use(bodyParser.json());

// Libera acesso externo (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Função para ler arquivo
function readNotes() {
  try {
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Função para salvar arquivo
function saveNotes(notes) {
  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

// ====================
// GET - Listar notas
// ====================
app.get('/api/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// ====================
// GET - Obter nota por ID
// ====================
app.get('/api/notes/:id', (req, res) => {
  const notes = readNotes();
  const note = notes.find(n => n.id === req.params.id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ erro: 'Nota não encontrada' });
  }
});

// ====================
// POST - Criar nota
// ====================
app.post('/api/notes', (req, res) => {
  const { titulo, texto } = req.body;
  if (!titulo || !texto) {
    return res.status(400).json({ erro: 'Os campos titulo e texto são obrigatórios' });
  }
  const notes = readNotes();
  const novaNota = {
    id: Date.now().toString(),
    titulo,
    texto,
    criadoEm: new Date().toISOString()
  };
  notes.push(novaNota);
  saveNotes(notes);
  res.status(201).json(novaNota);
});

// ====================
// PUT - Editar nota
// ====================
app.put('/api/notes/:id', (req, res) => {
  const { titulo, texto } = req.body;
  if (!titulo || !texto) {
    return res.status(400).json({ erro: 'Os campos titulo e texto são obrigatórios' });
  }
  const notes = readNotes();
  const index = notes.findIndex(n => n.id === req.params.id);
  if (index >= 0) {
    notes[index].titulo = titulo;
    notes[index].texto = texto;
    notes[index].atualizadoEm = new Date().toISOString();
    saveNotes(notes);
    res.json(notes[index]);
  } else {
    res.status(404).json({ erro: 'Nota não encontrada' });
  }
});

// ====================
// DELETE - Excluir nota
// ====================
app.delete('/api/notes/:id', (req, res) => {
  const notes = readNotes();
  const existe = notes.find(n => n.id === req.params.id);
  if (!existe) {
    return res.status(404).json({ erro: 'Nota não encontrada' });
  }
  const novasNotas = notes.filter(n => n.id !== req.params.id);
  saveNotes(novasNotas);
  res.status(204).send();
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
