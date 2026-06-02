import hasClass from '../../../website/common/script/libs/hasClass';

// PTOSS-2 — Função B1: hasClass(member)
// Estratégia: projeto iniciado por CAIXA-BRANCA (MC/DC da decisão com 3 condições)
// e complementado por CAIXA-PRETA (valor-limite no nível + robustez a campos
// ausentes).
//
// Decisão (única): A && B && C, onde
//   A = member.stats.lvl >= 10
//   B = !member.preferences.disableClasses
//   C = member.flags.classSelected
//
// Tabela-verdade (8 combinações) e identificação do conjunto MC/DC:
//   #  | A B C | resultado | no conjunto MC/DC?
//   ---+-------+-----------+--------------------
//   1  | T T T |   true    | sim (base)
//   2  | T T F |   false   | sim (independência de C: par {1,2})
//   3  | T F T |   false   | sim (independência de B: par {1,3})
//   4  | T F F |   false   |
//   5  | F T T |   false   | sim (independência de A: par {1,5})
//   6  | F T F |   false   |
//   7  | F F T |   false   |
//   8  | F F F |   false   |
// Conjunto MC/DC mínimo = {1, 2, 3, 5}. Pares de independência:
//   A: {1,5}   B: {1,3}   C: {1,2}
//
// Nota de autoria: o teste pré-existente (test/common/libs/hasClass.test.js)
// cobre exatamente os 4 casos MC/DC. Esta suíte vai ALÉM: exercita as 8
// combinações (cobertura completa da decisão), marca o subconjunto MC/DC e
// acrescenta valor-limite e robustez.

// member(lvl, disableClasses, classSelected)
const member = (lvl, disableClasses, classSelected) => ({
  stats: { lvl },
  preferences: { disableClasses },
  flags: { classSelected },
});

describe('hasClass', () => {
  // ---------------------------------------------------------------------------
  // CAIXA-BRANCA — tabela-verdade completa (8 combinações), MC/DC destacado
  // ---------------------------------------------------------------------------
  describe('tabela-verdade da decisão A && B && C', () => {
    const cases = [
      { id: '#1 A=T B=T C=T', lvl: 10, disable: false, selected: true, expected: true, mcdc: 'base' },
      { id: '#2 A=T B=T C=F', lvl: 10, disable: false, selected: false, expected: false, mcdc: 'C {1,2}' },
      { id: '#3 A=T B=F C=T', lvl: 10, disable: true, selected: true, expected: false, mcdc: 'B {1,3}' },
      { id: '#4 A=T B=F C=F', lvl: 10, disable: true, selected: false, expected: false },
      { id: '#5 A=F B=T C=T', lvl: 9, disable: false, selected: true, expected: false, mcdc: 'A {1,5}' },
      { id: '#6 A=F B=T C=F', lvl: 9, disable: false, selected: false, expected: false },
      { id: '#7 A=F B=F C=T', lvl: 9, disable: true, selected: true, expected: false },
      { id: '#8 A=F B=F C=F', lvl: 9, disable: true, selected: false, expected: false },
    ];

    cases.forEach(c => {
      const tag = c.mcdc ? ` [MC/DC ${c.mcdc}]` : '';
      it(`${c.id} -> ${c.expected}${tag}`, () => {
        const result = hasClass(member(c.lvl, c.disable, c.selected));

        expect(result).to.equal(c.expected);
      });
    });
  });

  // ---------------------------------------------------------------------------
  // CAIXA-PRETA (complemento) — valor-limite no nível (fronteira da condição A)
  // ---------------------------------------------------------------------------
  describe('valor-limite do nível na fronteira lvl >= 10 (B e C verdadeiros)', () => {
    it('lvl = 9 (abaixo da fronteira) -> false', () => {
      expect(hasClass(member(9, false, true))).to.equal(false);
    });

    it('lvl = 10 (na fronteira) -> true', () => {
      expect(hasClass(member(10, false, true))).to.equal(true);
    });

    it('lvl = 11 (acima da fronteira) -> true', () => {
      expect(hasClass(member(11, false, true))).to.equal(true);
    });
  });

  // ---------------------------------------------------------------------------
  // CAIXA-PRETA (complemento) — robustez a campos ausentes (undefined)
  // ---------------------------------------------------------------------------
  describe('robustez a campos ausentes', () => {
    it('disableClasses ausente equivale a classes habilitadas (B verdadeiro)', () => {
      const m = { stats: { lvl: 10 }, preferences: {}, flags: { classSelected: true } };

      expect(hasClass(m)).to.equal(true);
    });

    it('classSelected ausente é tratado como falso (C falso) -> false', () => {
      const m = { stats: { lvl: 10 }, preferences: { disableClasses: false }, flags: {} };

      // A função retorna o valor (undefined) da última condição; comparamos por
      // veracidade para refletir o comportamento "não tem classe".
      expect(Boolean(hasClass(m))).to.equal(false);
    });
  });
});
