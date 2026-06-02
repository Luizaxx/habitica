import { toNextLevel } from '../../website/common/script/statHelpers';

// PTOSS-2 — Função A1: toNextLevel(lvl)  (alias `tnl`)
// Estratégia: caixa-preta (particionamento de equivalência + análise de
// valor-limite nas fronteiras 4/5/6) complementada por caixa-branca
// (cobertura das 3 decisões: lvl<5, lvl===5, lvl>5).
//
// Observação de complementaridade: o teste já existente
// (test/common/statHelpers.test.js) verifica apenas a MONOTONICIDADE
// (tnl(n+1) > tnl(n)); não valida os VALORES retornados. Estes casos
// adicionam a validação funcional por partição.

describe('toNextLevel (validação por partição de nível)', () => {
  // Partição P1: lvl < 5  -> 25 * lvl
  describe('nível abaixo de 5 (ramo 25 * lvl)', () => {
    it('CT1: tnl(1) = 25', () => {
      expect(toNextLevel(1)).to.eql(25);
    });

    it('CT2: tnl(4) = 100 (valor-limite imediatamente abaixo de 5)', () => {
      expect(toNextLevel(4)).to.eql(100);
    });
  });

  // Partição P2: lvl === 5 -> 150 (valor fixo)
  describe('nível exatamente 5 (ramo do valor fixo)', () => {
    it('CT3: tnl(5) = 150', () => {
      expect(toNextLevel(5)).to.eql(150);
    });
  });

  // Partição P3: lvl > 5 -> fórmula arredondada para múltiplo de 10
  describe('nível acima de 5 (ramo da fórmula)', () => {
    it('CT4: tnl(6) = 210 (valor-limite imediatamente acima de 5)', () => {
      expect(toNextLevel(6)).to.eql(210);
    });

    it('CT5: tnl(10) = 260 (ponto interior da partição)', () => {
      expect(toNextLevel(10)).to.eql(260);
    });

    it('CT6: o resultado da fórmula é sempre múltiplo de 10', () => {
      [6, 7, 23, 57, 100].forEach(lvl => {
        expect(toNextLevel(lvl) % 10).to.eql(0);
      });
    });
  });
});
