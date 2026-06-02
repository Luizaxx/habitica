import percent from '../../../website/common/script/libs/percent';

// PTOSS-2 — Função A3: percent(x, y, dir)
// Estratégia: caixa-preta (particionamento de `dir` + análise de valor-limite no
// ponto de arredondamento .5) complementada por caixa-branca (cobertura dos 3
// ramos do switch e do clamp Math.max(0, ...)).
//
// Complementaridade: os testes já existentes (test/common/libs/percent.test.js)
// cobrem up/down/sem-direção, mas NÃO exercitam (a) a fronteira de arredondamento
// em .5, nem (b) o clamp de valores negativos -> 0. Estes casos são novos.
//
// Obs.: o caso y = 0 (divisão por zero) é tratado separadamente via TDD (Fase 4),
// pois envolve uma CORREÇÃO da função, não apenas teste do comportamento atual.

describe('percent — casos complementares (PTOSS-2)', () => {
  // -------------------------------------------------------------------------
  // Caixa-preta: valor-limite no ponto de arredondamento (x=1, y=8 -> 12.5%)
  // Isola o efeito de cada direção exatamente no meio do intervalo.
  // -------------------------------------------------------------------------
  describe('fronteira de arredondamento .5 (12.5%)', () => {
    it('CT1: dir "up" arredonda para cima -> 13', () => {
      expect(percent(1, 8, 'up')).to.eql(13);
    });

    it('CT2: dir "down" trunca -> 12', () => {
      expect(percent(1, 8, 'down')).to.eql(12);
    });

    it('CT3: sem direção (default) arredonda meio para cima -> 13', () => {
      expect(percent(1, 8)).to.eql(13);
    });

    it('CT4: direção desconhecida cai no default (round) -> 13', () => {
      expect(percent(1, 8, 'lateral')).to.eql(13);
    });
  });

  // -------------------------------------------------------------------------
  // Caixa-branca/preta: clamp Math.max(0, ...) -> resultado nunca negativo.
  // Partição "resultado negativo" (não coberta pelos testes existentes).
  // -------------------------------------------------------------------------
  describe('clamp de valores negativos para 0', () => {
    it('CT5: numerador negativo com "up" -> 0', () => {
      expect(percent(-1, 5, 'up')).to.eql(0);
    });

    it('CT6: numerador negativo com "down" -> 0', () => {
      expect(percent(-1, 5, 'down')).to.eql(0);
    });

    it('CT7: numerador negativo sem direção -> 0', () => {
      expect(percent(-3, 4)).to.eql(0);
    });
  });

  // -------------------------------------------------------------------------
  // Valores-limite adicionais: zero no numerador e resultado acima de 100%.
  // -------------------------------------------------------------------------
  describe('outros valores-limite', () => {
    it('CT8: numerador zero -> 0', () => {
      expect(percent(0, 5)).to.eql(0);
    });

    it('CT9: não há limite superior (pode passar de 100%) -> 150', () => {
      expect(percent(3, 2)).to.eql(150);
    });
  });
});
