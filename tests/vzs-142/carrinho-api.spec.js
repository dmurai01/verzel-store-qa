import { test, expect } from '@playwright/test';

/**
 * Suíte US VZS-142 — Cálculos do Carrinho (/api/carrinho/calcular)
 * Validação de Critérios de Aceite: CA01, CA02, CA03, CA04, CA06, CA07, CA08, CA09, CA10, CA11
 */
test.describe('US VZS-142: API - Cálculos de Cupons e Frete Grátis', () => {

  test('CT-US-API-01: Frete fixo de R$ 19,90 e valor faltante quando subtotal < R$ 200,00 @vzs-142 @api @frete', async ({ request }) => {
    // P003: Tênis Casual Urbano (R$ 189,90)
    const payload = {
      itens: [{ produtoId: 'P003', quantidade: 1 }]
    };

    const response = await request.post('/api/carrinho/calcular', { data: payload });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.subtotal).toBe(189.9);
    expect(body.desconto).toBe(0);
    expect(body.freteGratis).toBe(false);
    expect(body.valorFaltanteFreteGratis).toBe(10.1);
    expect(body.total).toBe(209.8); // 189.9 + 19.9
  });

  test('CT-US-API-02: Concessão de frete grátis (R$ 0,00) para subtotal >= R$ 200,00 @vzs-142 @api @frete', async ({ request }) => {
    // P007: Jaqueta Corta-Vento (R$ 229,90)
    const payload = {
      itens: [{ produtoId: 'P007', quantidade: 1 }]
    };

    const response = await request.post('/api/carrinho/calcular', { data: payload });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.subtotal).toBe(229.9);
    expect(body.freteGratis).toBe(true);
    expect(body.valorFaltanteFreteGratis).toBe(0);
    expect(body.total).toBe(229.9);
  });

  test('CT-US-API-03: Cupom BEMVINDO10 aplica 10% e frete grátis considera subtotal bruto @vzs-142 @api @cupom @frete', async ({ request }) => {
    // P002 (139.9) + 2x P004 (49.9 cada) = Subtotal 239.7
    // Subtotal antes do desconto: R$ 239,70 >= 200 (Frete Grátis)
    // Desconto 10%: R$ 23,97
    // Total: 239.70 - 23.97 + 0 = R$ 215,73
    const payload = {
      itens: [
        { produtoId: 'P002', quantidade: 1 },
        { produtoId: 'P004', quantidade: 2 }
      ],
      cupom: 'BEMVINDO10'
    };

    const response = await request.post('/api/carrinho/calcular', { data: payload });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.subtotal).toBe(239.7);
    expect(body.desconto).toBe(23.97);
    expect(body.freteGratis).toBe(true);
    expect(body.total).toBe(215.73);
    expect(body.cupom.aplicado).toBe(true);
    expect(body.cupom.mensagem).toBe('Cupom aplicado: 10% de desconto nos produtos.');
  });

  test('CT-US-API-04: Tratamento de case-insensitive e espaços em branco no cupom @vzs-142 @api @cupom', async ({ request }) => {
    const payload = {
      itens: [{ produtoId: 'P005', quantidade: 1 }], // Mochila R$ 100,00
      cupom: '  bemvindo10  '
    };

    const response = await request.post('/api/carrinho/calcular', { data: payload });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.subtotal).toBe(100);
    expect(body.desconto).toBe(10);
    expect(body.cupom.aplicado).toBe(true);
  });

  test('CT-US-API-05: Tolerância para cupom inexistente no cálculo do carrinho @vzs-142 @api @cupom @tolerancia', async ({ request }) => {
    const payload = {
      itens: [{ produtoId: 'P001', quantidade: 1 }],
      cupom: 'CUPOM_INEXISTENTE'
    };

    const response = await request.post('/api/carrinho/calcular', { data: payload });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.desconto).toBe(0);
    expect(body.cupom.aplicado).toBe(false);
    expect(body.cupom.mensagem).toBe('Cupom inválido.');
  });

  test('CT-US-API-06: Tolerância para cupom expirado (VERAO2026) no cálculo do carrinho @vzs-142 @api @cupom @tolerancia', async ({ request }) => {
    const payload = {
      itens: [{ produtoId: 'P001', quantidade: 1 }],
      cupom: 'VERAO2026'
    };

    const response = await request.post('/api/carrinho/calcular', { data: payload });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.desconto).toBe(0);
    expect(body.cupom.aplicado).toBe(false);
    expect(body.cupom.mensagem).toBe('Cupom expirado.');
  });

  test('CT-US-API-07: Bloqueio e erro 422 ao exceder limite de 5 unidades do mesmo produto @vzs-142 @api @carrinho @negativo', async ({ request }) => {
    const payload = {
      itens: [{ produtoId: 'P001', quantidade: 6 }]
    };

    const response = await request.post('/api/carrinho/calcular', { data: payload });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });

});
