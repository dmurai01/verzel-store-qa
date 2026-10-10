import { test, expect } from '@playwright/test';

/**
 * Suíte Regressão: Criação de Pedidos e Validações Cadastrais Preexistentes (/api/pedidos)
 */
test.describe('Regressão: API - Pedidos e Dados Cadastrais', () => {

  test('CT-REG-01: Criação de pedido com status 201 e máscara VZ-000000 @regressao @api @pedidos', async ({ request }) => {
    const payload = {
      cliente: {
        nome: 'Maria Silva',
        email: 'maria@exemplo.com',
        cep: '01310-100'
      },
      itens: [{ produtoId: 'P005', quantidade: 1 }],
      cupom: 'BEMVINDO10'
    };

    const response = await request.post('/api/pedidos', { data: payload });
    expect(response.status()).toBe(201);

    const pedido = await response.json();
    expect(pedido.numero).toMatch(/^VZ-\d{6}$/);
    expect(pedido).toHaveProperty('criadoEm');
    expect(pedido.total).toBe(109.9); // 100 - 10 + 19.9
  });

  test('CT-REG-02: Rejeição com 422 DADOS_INVALIDOS para cliente sem sobrenome @regressao @api @pedidos @negativo', async ({ request }) => {
    const payload = {
      cliente: { nome: 'Maria', email: 'maria@exemplo.com', cep: '01310-100' },
      itens: [{ produtoId: 'P001', quantidade: 1 }]
    };

    const response = await request.post('/api/pedidos', { data: payload });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('DADOS_INVALIDOS');
    expect(body.erro.campos).toHaveProperty('nome');
  });

  test('CT-REG-03: Rejeição com 422 DADOS_INVALIDOS para email inválido @regressao @api @pedidos @negativo', async ({ request }) => {
    const payload = {
      cliente: { nome: 'Maria Silva', email: 'email_invalido', cep: '01310-100' },
      itens: [{ produtoId: 'P001', quantidade: 1 }]
    };

    const response = await request.post('/api/pedidos', { data: payload });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('DADOS_INVALIDOS');
    expect(body.erro.campos).toHaveProperty('email');
  });

  test('CT-REG-04: Rejeição com 422 DADOS_INVALIDOS para CEP diferente de 8 dígitos @regressao @api @pedidos @negativo', async ({ request }) => {
    const payload = {
      cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '123' },
      itens: [{ produtoId: 'P001', quantidade: 1 }]
    };

    const response = await request.post('/api/pedidos', { data: payload });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('DADOS_INVALIDOS');
    expect(body.erro.campos).toHaveProperty('cep');
  });

});
