import percent from '../../../website/common/script/libs/percent';

// PTOSS-2 — TDD: correção de percent(x, y, dir) para divisão por zero (y = 0).
// Antes da correção: percent(5, 0) === Infinity e percent(0, 0) === NaN.
// Comportamento desejado: quando y = 0, a porcentagem é indefinida e a função
// deve retornar 0 (consistente com o clamp Math.max(0, ...) já existente).
//
// Desenvolvido por ciclos Red-Green-Refactor.

describe('percent — correção de divisão por zero (TDD)', () => {
  // Ciclo 1
  it('percent(5, 0) deve retornar 0 (em vez de Infinity)', () => {
    expect(percent(5, 0)).to.equal(0);
  });
});
