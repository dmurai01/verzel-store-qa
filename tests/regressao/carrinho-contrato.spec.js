import { test, expect } from '@playwright/test';

/**
 * Suíte Regressão / Contrato de API: Validação de Payload em /api/carrinho/calcular
 */
test.describe('Contrato de API: Validações de Payload do Carrinho', () => {

  test('CT-REG-05: Rejeição com 422 ITENS_OBRIGATORIOS para lista de itens vazia @contrato-api @api @carrinho @negativo', async ({ request }) => {
    const response = await request.post('/api/carrinho/calcular', {
      data: { itens: [] }
    });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('ITENS_OBRIGATORIOS');
  });

  test('CT-REG-06: Rejeição com 422 ITEM_INVALIDO quando item não tem produtoId ou quantidade @contrato-api @api @carrinho @negativo', async ({ request }) => {
    const response = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001' }] }
    });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('ITEM_INVALIDO');
  });

  test('CT-REG-07: Rejeição com 422 PRODUTO_NAO_ENCONTRADO para produto inexistente no item @contrato-api @api @carrinho @negativo', async ({ request }) => {
    const response = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P999', quantidade: 1 }] }
    });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('PRODUTO_NAO_ENCONTRADO');
  });

  test('CT-REG-08: Rejeição com 422 ITEM_DUPLICADO para produto repetido no array @contrato-api @api @carrinho @negativo', async ({ request }) => {
    const response = await request.post('/api/carrinho/calcular', {
      data: {
        itens: [
          { produtoId: 'P001', quantidade: 1 },
          { produtoId: 'P001', quantidade: 2 }
        ]
      }
    });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('ITEM_DUPLICADO');
  });

  test('CT-REG-09: Rejeição com 422 QUANTIDADE_INVALIDA para quantidade 0 ou negativa @contrato-api @api @carrinho @negativo', async ({ request }) => {
    const response = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P001', quantidade: 0 }] }
    });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('QUANTIDADE_INVALIDA');
  });

});
