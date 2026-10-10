import { test, expect } from '@playwright/test';

/**
 * Suíte Regressão / Catálogo: /api/produtos
 */
test.describe('Regressão: API - Catálogo de Produtos', () => {

  test('CT-REG-10: Listagem completa do catálogo com status 200 @regressao @api @produtos', async ({ request }) => {
    const response = await request.get('/api/produtos');
    expect(response.status()).toBe(200);

    const produtos = await response.json();
    expect(Array.isArray(produtos)).toBe(true);
    expect(produtos.length).toBeGreaterThan(0);

    const primeiro = produtos[0];
    expect(primeiro).toHaveProperty('id');
    expect(primeiro).toHaveProperty('nome');
    expect(primeiro).toHaveProperty('preco');
  });

  test('CT-REG-11: Consulta de produto existente (P001) com status 200 @regressao @api @produtos', async ({ request }) => {
    const response = await request.get('/api/produtos/P001');
    expect(response.status()).toBe(200);

    const produto = await response.json();
    expect(produto.id).toBe('P001');
    expect(produto.nome).toBe('Camiseta Essencial');
    expect(produto.preco).toBe(59.9);
  });

  test('CT-REG-12: Consulta de produto inexistente (P999) retorna 404 PRODUTO_NAO_ENCONTRADO @contrato-api @api @produtos @negativo', async ({ request }) => {
    const response = await request.get('/api/produtos/P999');
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.erro.codigo).toBe('PRODUTO_NAO_ENCONTRADO');
  });

});
