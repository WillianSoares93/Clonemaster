const axios = require('axios');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { supabase } = require('../db/supabase'); // Importa a configuração do Supabase

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Middleware de autenticação (verifica se o usuário está logado)
const authMiddleware = async (req, res, next) => {
  const { user_id } = req.body; // Supondo que user_id vem do frontend

  // Verifica se o usuário tem uma assinatura ativa
  const { data: user, error } = await supabase
    .from('users')
    .select('hotmart_subscription_status')
    .eq('id', user_id)
    .single();

  if (error || user.hotmart_subscription_status !== 'active') {
    return res.status(403).send('Acesso negado: assinatura inativa');
  }

  next();
};

// Rota para clonar páginas (somente para usuários autenticados)
app.post('/api/clone', authMiddleware, async (req, res) => {
  const { url, user_id } = req.body;

  try {
    // Clonar a página
    const response = await axios.get(url);
    const fileName = `${new URL(url).hostname}.html`;

    // Salva o conteúdo da página clonada em uma pasta específica do usuário
    const userFolder = path.join(__dirname, '..', 'public', 'users', user_id);
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    const filePath = path.join(userFolder, fileName);
    fs.writeFileSync(filePath, response.data);

    // Armazena a página clonada no Supabase, vinculando ao usuário
    const { error } = await supabase
      .from('cloned_pages')
      .insert([{ user_id, page_url: fileName }]);

    if (error) throw error;

    res.status(200).send(`Página clonada com sucesso: <a href="/users/${user_id}/${fileName}" target="_blank">${fileName}</a>`);
  } catch (error) {
    res.status(500).send('Erro ao clonar a página: ' + error.message);
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
