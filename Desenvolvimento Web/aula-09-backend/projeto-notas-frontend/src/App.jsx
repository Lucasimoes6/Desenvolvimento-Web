import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api/notes";

export default function App() {
  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    buscarNotas();
  }, []);

  async function buscarNotas() {
    setCarregando(true);
    try {
      const res = await fetch(API_URL);
      const dados = await res.json();
      setNotas(dados);
    } catch {
      exibirMensagem("Erro ao carregar notas.", "erro");
    } finally {
      setCarregando(false);
    }
  }

  function exibirMensagem(msg, tipo = "sucesso") {
    setMensagem({ texto: msg, tipo });
    setTimeout(() => setMensagem(""), 3000);
  }

  async function salvarNota() {
    if (!titulo.trim() || !texto.trim()) {
      return exibirMensagem("Preencha título e texto.", "erro");
    }
    try {
      if (editandoId) {
        await fetch(`${API_URL}/${editandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titulo, texto }),
        });
        exibirMensagem("Nota atualizada com sucesso!");
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titulo, texto }),
        });
        exibirMensagem("Nota criada com sucesso!");
      }
      setTitulo("");
      setTexto("");
      setEditandoId(null);
      buscarNotas();
    } catch {
      exibirMensagem("Erro ao salvar nota.", "erro");
    }
  }

  function iniciarEdicao(nota) {
    setEditandoId(nota.id);
    setTitulo(nota.titulo);
    setTexto(nota.texto);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setTitulo("");
    setTexto("");
  }

  async function excluirNota(id) {
    if (!window.confirm("Deseja excluir esta nota?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      exibirMensagem("Nota excluída com sucesso!");
      buscarNotas();
    } catch {
      exibirMensagem("Erro ao excluir nota.", "erro");
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>📝 Gerenciador de Notas</h1>

      {mensagem && (
        <div style={{ ...styles.mensagem, background: mensagem.tipo === "erro" ? "#ffe0e0" : "#e0ffe0", borderColor: mensagem.tipo === "erro" ? "#f00" : "#0a0" }}>
          {mensagem.texto}
        </div>
      )}

      <div style={styles.formulario}>
        <h2>{editandoId ? "✏️ Editar Nota" : "➕ Nova Nota"}</h2>
        <input
          style={styles.input}
          placeholder="Título da nota"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="Conteúdo da nota"
          value={texto}
          onChange={e => setTexto(e.target.value)}
          rows={4}
        />
        <div style={styles.botoes}>
          <button style={styles.btnSalvar} onClick={salvarNota}>
            {editandoId ? "Atualizar" : "Criar Nota"}
          </button>
          {editandoId && (
            <button style={styles.btnCancelar} onClick={cancelarEdicao}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <h2 style={{ marginTop: 32 }}>📋 Notas Salvas</h2>
      {carregando && <p>Carregando...</p>}
      {!carregando && notas.length === 0 && <p>Nenhuma nota encontrada.</p>}
      <div style={styles.listaNotas}>
        {notas.map(nota => (
          <div key={nota.id} style={styles.cartao}>
            <h3 style={styles.tituloNota}>{nota.titulo}</h3>
            <p style={styles.textoNota}>{nota.texto}</p>
            <small style={{ color: "#888" }}>
              Criado em: {new Date(nota.criadoEm).toLocaleString("pt-BR")}
            </small>
            <div style={styles.acoes}>
              <button style={styles.btnEditar} onClick={() => iniciarEdicao(nota)}>Editar</button>
              <button style={styles.btnExcluir} onClick={() => excluirNota(nota.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: "0 auto", padding: "24px 16px", fontFamily: "Arial, sans-serif" },
  titulo: { textAlign: "center", color: "#1a1a2e" },
  mensagem: { padding: "10px 16px", borderRadius: 8, border: "1px solid", marginBottom: 16 },
  formulario: { background: "#f5f7fa", padding: 20, borderRadius: 12, marginBottom: 24 },
  input: { width: "100%", padding: "10px 12px", marginBottom: 12, borderRadius: 8, border: "1px solid #ccc", fontSize: 15, boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", fontSize: 15, boxSizing: "border-box", resize: "vertical" },
  botoes: { display: "flex", gap: 10, marginTop: 12 },
  btnSalvar: { background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontSize: 15 },
  btnCancelar: { background: "#e5e7eb", color: "#333", border: "none", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontSize: 15 },
  listaNotas: { display: "flex", flexDirection: "column", gap: 16 },
  cartao: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  tituloNota: { margin: "0 0 8px", color: "#1a1a2e" },
  textoNota: { margin: "0 0 8px", color: "#444" },
  acoes: { display: "flex", gap: 10, marginTop: 12 },
  btnEditar: { background: "#f59e0b", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer" },
  btnExcluir: { background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer" },
};
