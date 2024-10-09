// api/hotmart-webhook.js

import { supabase } from '../db/supabase'; // Importa a configuração do Supabase

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { event, data } = req.body;  // Dados do webhook recebido do Hotmart

        // Verifique se a estrutura do corpo está correta
        if (!event || !data) {
            return res.status(400).json({ error: 'Evento ou dados ausentes' });
        }

        const email = data.buyer.email; // Email do comprador

        if (!email) {
            return res.status(400).json({ error: 'Email do comprador ausente' });
        }

        // Lógica para gerenciar eventos
        try {
            if (event === 'PURCHASE_APPROVED') {
                // Usuário fez o pagamento
                await supabase
                    .from('users')
                    .update({ hotmart_subscription_status: 'active' })
                    .eq('email', email);
            } else if (event === 'PURCHASE_CANCELLED') {
                // Usuário cancelou a assinatura
                await supabase
                    .from('users')
                    .update({ hotmart_subscription_status: 'inactive' })
                    .eq('email', email);
            }

            return res.status(200).json({ message: 'Webhook processado com sucesso' });
        } catch (error) {
            console.error('Erro ao processar o webhook:', error);
            return res.status(500).json({ error: 'Erro ao processar o webhook' });
        }
    } else {
        return res.status(405).json({ error: 'Método não permitido' });
    }
}
