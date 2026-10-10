import { test, expect } from '@playwright/test';

/**
 * Suíte Contrato de API: Tratamento Genérico de Erros HTTP (400, 404, 405)
 */
test.describe('Contrato de API: Erros Genéricos e Roteamento', () => {

  test('CT-REG-13: Rejeição com 400 JSON_INVALIDO para corpo de requisição corrompido @contrato-api @api @erros @negativo', async ({ request }) => {
    const response = await request.post('/api/carrinho/calcular', {
      headers: { 'Content-Type': 'application/json' },
      data: '{ "itens": [ invalid json }'
    });
    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.erro.codigo).toBe('JSON_INVALIDO');
  });

  test('CT-REG-14: Resposta 404 ROTA_NAO_ENCONTRADA para endpoint inexistente @contrato-api @api @erros @negativo', async ({ request }) => {
    const response = await request.get('/api/rota-inexistente-123');
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.erro.codigo).toBe('ROTA_NAO_ENCONTRADA');
  });

  test('CT-REG-15: Resposta 405 METODO_NAO_PERMITIDO para método HTTP não suportado @contrato-api @api @erros @negativo', async ({ request }) => {
    const response = await request.delete('/api/pedidos');
    expect(response.status()).toBe(405);

    const body = await response.json();
    expect(body.erro.codigo).toBe('METODO_NAO_PERMITIDO');
  });

});
