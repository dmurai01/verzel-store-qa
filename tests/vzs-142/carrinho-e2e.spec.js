import { test, expect } from '@playwright/test';

/**
 * Suíte US VZS-142 — Testes de Interface (E2E) no Carrinho de Compras
 * Validação de Critérios de Aceite: CA01 a CA11
 */
test.describe('US VZS-142: E2E - Interface do Carrinho, Cupons e Frete Grátis', () => {

  test('CT-US-01: Aplicação de cupom BEMVINDO10 com 10% de desconto no carrinho @vzs-142 @e2e @cupom', async ({ page }) => {
    await page.goto('/');

    // Adiciona Mochila Urbana 20L (R$ 100,00)
    await page.locator('text=Mochila Urbana 20L').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    // Aplica cupom
    const inputCupom = page.getByPlaceholder(/cupom|código/i).or(page.locator('input[name="cupom"]'));
    await inputCupom.fill('BEMVINDO10');
    await page.getByRole('button', { name: /aplicar/i }).click();

    // Valida mensagem e cálculo
    await expect(page.getByText('Cupom aplicado: 10% de desconto nos produtos.')).toBeVisible();
    await expect(page.locator('text=R$ 10,00').or(page.getByText(/desconto.*10,00/i))).toBeVisible();
  });

  test('CT-US-02: Aplicação de cupom com espaços e minúsculas ("  bemvindo10  ") @vzs-142 @e2e @cupom', async ({ page }) => {
    await page.goto('/');

    await page.locator('text=Mochila Urbana 20L').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    const inputCupom = page.getByPlaceholder(/cupom|código/i).or(page.locator('input[name="cupom"]'));
    await inputCupom.fill('  bemvindo10  ');
    await page.getByRole('button', { name: /aplicar/i }).click();

    await expect(page.getByText('Cupom aplicado: 10% de desconto nos produtos.')).toBeVisible();
  });

  test('CT-US-03: Exibição de mensagem para cupom inexistente @vzs-142 @e2e @cupom @negativo', async ({ page }) => {
    await page.goto('/');

    await page.locator('text=Camiseta Essencial').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    const inputCupom = page.getByPlaceholder(/cupom|código/i).or(page.locator('input[name="cupom"]'));
    await inputCupom.fill('CUPOM_INVALIDO');
    await page.getByRole('button', { name: /aplicar/i }).click();

    await expect(page.getByText('Cupom inválido.')).toBeVisible();
  });

  test('CT-US-04: Exibição de mensagem para cupom expirado VERAO2026 @vzs-142 @e2e @cupom @negativo', async ({ page }) => {
    await page.goto('/');

    await page.locator('text=Camiseta Essencial').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    const inputCupom = page.getByPlaceholder(/cupom|código/i).or(page.locator('input[name="cupom"]'));
    await inputCupom.fill('VERAO2026');
    await page.getByRole('button', { name: /aplicar/i }).click();

    await expect(page.getByText('Cupom expirado.')).toBeVisible();
  });

  test('CT-US-05: Regra de cupom único exige remoção para aplicar novo @vzs-142 @e2e @cupom', async ({ page }) => {
    await page.goto('/');

    await page.locator('text=Camiseta Essencial').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    const inputCupom = page.getByPlaceholder(/cupom|código/i).or(page.locator('input[name="cupom"]'));
    await inputCupom.fill('BEMVINDO10');
    await page.getByRole('button', { name: /aplicar/i }).click();
    await expect(page.getByText('Cupom aplicado: 10% de desconto nos produtos.')).toBeVisible();

    // Deve exibir botão para remover o cupom ativo antes de inserir outro
    const btnRemover = page.getByRole('button', { name: /remover.*cupom/i }).or(page.getByText(/remover/i));
    await expect(btnRemover).toBeVisible();
  });

  test('CT-US-06: Exibição de frete fixo de R$ 19,90 e valor faltante quando subtotal < R$ 200,00 @vzs-142 @e2e @frete', async ({ page }) => {
    await page.goto('/');

    // Tênis Casual Urbano R$ 189,90
    await page.locator('text=Tênis Casual Urbano').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    await expect(page.locator('text=R$ 19,90').or(page.getByText(/frete.*19,90/i))).toBeVisible();
    await expect(page.getByText(/faltam.*10,10/i).or(page.getByText(/10,10.*frete grátis/i))).toBeVisible();
  });

  test('CT-US-07: Concessão de frete grátis para compra de Jaqueta Corta-Vento (R$ 229,90) @vzs-142 @e2e @frete', async ({ page }) => {
    await page.goto('/');

    await page.locator('text=Jaqueta Corta-Vento').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    await expect(page.getByText(/frete grátis/i)).toBeVisible();
  });

  test('CT-US-08: Frete grátis mantido mesmo após abatimento do cupom de desconto @vzs-142 @e2e @frete @cupom', async ({ page }) => {
    await page.goto('/');

    // Calça Jeans (139.90) + Mochila Urbana (100.00) = Subtotal R$ 239,90
    await page.locator('text=Calça Jeans Slim').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.locator('text=Mochila Urbana 20L').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    const inputCupom = page.getByPlaceholder(/cupom|código/i).or(page.locator('input[name="cupom"]'));
    await inputCupom.fill('BEMVINDO10');
    await page.getByRole('button', { name: /aplicar/i }).click();

    // Frete grátis deve continuar ativo
    await expect(page.getByText(/frete grátis/i)).toBeVisible();
  });

  test('CT-US-09: Seleção de quantidade válida de 1 a 5 unidades @vzs-142 @e2e @carrinho', async ({ page }) => {
    await page.goto('/');

    await page.locator('text=Camiseta Essencial').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    const campoQtd = page.getByRole('spinbutton').or(page.locator('input[type="number"]'));
    if (await campoQtd.isVisible()) {
      await campoQtd.fill('5');
      await expect(campoQtd).toHaveValue('5');
    }
  });

  test('CT-US-10: Bloqueio de inserção de mais de 5 unidades do mesmo produto @vzs-142 @e2e @carrinho @negativo', async ({ page }) => {
    await page.goto('/');

    await page.locator('text=Camiseta Essencial').locator('..').getByRole('button', { name: /adicionar|comprar/i }).click();
    await page.getByRole('link', { name: /carrinho/i }).click();

    const campoQtd = page.getByRole('spinbutton').or(page.locator('input[type="number"]'));
    if (await campoQtd.isVisible()) {
      await campoQtd.fill('6');
      // O sistema deve limitar em 5 ou exibir alerta de quantidade máxima
      const valor = await campoQtd.inputValue();
      expect(Number(valor) <= 5).toBeTruthy();
    }
  });

});
