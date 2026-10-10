import { test, expect } from '@playwright/test';

/**
 * Suíte US VZS-142 — Fechamento de Pedidos (/api/pedidos)
 * Validação de Comportamento Estrito de Cupons e Limite de Itens (CA03, CA04, CA10)
 */
test.describe('US VZS-142: API - Validações Estritas na Criação do Pedido', () => {

  test('CT-US-API-08: Rejeição estrita com 422 CUPOM_INVALIDO para cupom inexistente @vzs-142 @api @pedidos @negativo', async ({ request }) => {
    const payload = {
      cliente: {
        nome: 'Maria Silva',
        email: 'maria@exemplo.com',
        cep: '01310-100'
      },
      itens: [{ produtoId: 'P001', quantidade: 1 }],
      cupom: 'CUPOM_NAO_EXISTE'
    };

    const response = await request.post('/api/pedidos', { data: payload });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('CUPOM_INVALIDO');
  });

  test('CT-US-API-09: Rejeição estrita com 422 CUPOM_EXPIRADO para cupom VERAO2026 @vzs-142 @api @pedidos @negativo', async ({ request }) => {
    const payload = {
      cliente: {
        nome: 'Maria Silva',
        email: 'maria@exemplo.com',
        cep: '01310-100'
      },
      itens: [{ produtoId: 'P001', quantidade: 1 }],
      cupom: 'VERAO2026'
    };

    const response = await request.post('/api/pedidos', { data: payload });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('CUPOM_EXPIRADO');
  });

  test('CT-US-API-10: Rejeição com 422 QUANTIDADE_MAXIMA_EXCEDIDA para item com 6 unidades @vzs-142 @api @pedidos @negativo', async ({ request }) => {
    const payload = {
      cliente: {
        nome: 'Maria Silva',
        email: 'maria@exemplo.com',
        cep: '01310-100'
      },
      itens: [{ produtoId: 'P001', quantidade: 6 }]
    };

    const response = await request.post('/api/pedidos', { data: payload });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });

});
