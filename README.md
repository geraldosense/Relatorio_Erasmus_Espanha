# Relatório Erasmus — Espanha 2026

Site do relatório de estágio de Geraldo Sense (Escola Profissional do Fundão).

## Ver o site localmente (Go Live)

### Opção 1 — Live Server (Cursor / VS Code)

1. Instala a extensão **Live Server** (`ritwickdey.liveserver`) se ainda não tiveres.
2. Abre a pasta do projeto no Cursor (não apenas o ficheiro `index.html`).
3. Clica em **Go Live** na barra inferior direita.
4. O site abre em: [http://127.0.0.1:5500](http://127.0.0.1:5500)

> **Nota:** O porto **5501** costuma estar ocupado pelo Cursor. Por isso o projeto usa o **5500**.

### Opção 2 — Terminal

```bash
npm start
```

Ou:

```bash
python3 -m http.server 5500
```

Depois abre [http://127.0.0.1:5500/index.html](http://127.0.0.1:5500/index.html)

### Opção 3 — Task do Cursor

1. `Cmd + Shift + P` → **Tasks: Run Task**
2. Escolhe **Go Live: abrir no browser**
