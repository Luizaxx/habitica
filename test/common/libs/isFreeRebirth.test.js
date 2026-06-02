import moment from 'moment';
import isFreeRebirth from '../../../website/common/script/libs/isFreeRebirth';

// PTOSS-2 — Função B2: isFreeRebirth(user)
// Estratégia: projeto iniciado por CAIXA-BRANCA (MC/DC da decisão de retorno, com
// 2 condições, + cobertura dos dois ramos do if interno) complementado por
// CAIXA-PRETA (análise de valor-limite em nível e em dias).
//
// Estrutura:
//   D1 (if):   se user.flags.lastFreeRebirth é "truthy" -> dias = diff até hoje;
//              senão -> dias = 999.
//   D2 (return): A && B, onde
//                A = user.stats.lvl >= MAX_LEVEL (100)
//                B = dias >= 45
//
// Tabela-verdade de D2 (A && B) e conjunto MC/DC:
//   # | A B | resultado | MC/DC
//   --+-----+-----------+---------------------------
//   1 | T T |   true    | base
//   2 | T F |   false   | independência de B: par {1,2}
//   3 | F T |   false   | independência de A: par {1,3}
//   4 | F F |   false   |
//   Conjunto MC/DC = {1, 2, 3}. Pares: A {1,3}, B {1,2}.
//
// O tempo é controlado com fake timers (sinon, global) para tornar o cálculo de
// dias determinístico — em especial nas fronteiras 44/45/46.

const user = (lvl, lastFreeRebirth) => ({ stats: { lvl }, flags: { lastFreeRebirth } });
const daysAgo = n => moment().subtract(n, 'days').toISOString();

describe('isFreeRebirth', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date('2026-06-01T12:00:00Z').getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  // ---------------------------------------------------------------------------
  // CAIXA-BRANCA — MC/DC da decisão de retorno A && B (com lastFreeRebirth real)
  // ---------------------------------------------------------------------------
  describe('MC/DC da decisão de retorno (A && B)', () => {
    it('#1 A=T B=T -> true (nível máximo e >= 45 dias)', () => {
      expect(isFreeRebirth(user(100, daysAgo(50)))).to.equal(true);
    });

    it('#2 A=T B=F -> false (nível máximo, mas < 45 dias) [indep. B]', () => {
      expect(isFreeRebirth(user(100, daysAgo(10)))).to.equal(false);
    });

    it('#3 A=F B=T -> false (>= 45 dias, mas nível abaixo do máximo) [indep. A]', () => {
      expect(isFreeRebirth(user(99, daysAgo(50)))).to.equal(false);
    });
  });

  // ---------------------------------------------------------------------------
  // CAIXA-BRANCA — cobertura do ramo "else" do if (lastFreeRebirth ausente -> 999)
  // ---------------------------------------------------------------------------
  describe('ramo sem data anterior de rebirth (dias = 999)', () => {
    it('nível máximo e sem lastFreeRebirth -> true', () => {
      expect(isFreeRebirth(user(100, null))).to.equal(true);
    });

    it('nível abaixo do máximo e sem lastFreeRebirth -> false', () => {
      expect(isFreeRebirth(user(99, null))).to.equal(false);
    });
  });

  // ---------------------------------------------------------------------------
  // CAIXA-PRETA (complemento) — valor-limite em DIAS na fronteira 45 (lvl = 100)
  // ---------------------------------------------------------------------------
  describe('valor-limite de dias na fronteira >= 45 (nível máximo)', () => {
    it('44 dias -> false', () => {
      expect(isFreeRebirth(user(100, daysAgo(44)))).to.equal(false);
    });

    it('45 dias (na fronteira) -> true', () => {
      expect(isFreeRebirth(user(100, daysAgo(45)))).to.equal(true);
    });

    it('46 dias -> true', () => {
      expect(isFreeRebirth(user(100, daysAgo(46)))).to.equal(true);
    });
  });

  // ---------------------------------------------------------------------------
  // CAIXA-PRETA (complemento) — valor-limite em NÍVEL na fronteira 100
  // (dias = 999 via lastFreeRebirth ausente, garantindo B verdadeiro)
  // ---------------------------------------------------------------------------
  describe('valor-limite de nível na fronteira >= 100 (dias suficientes)', () => {
    it('lvl 99 -> false', () => {
      expect(isFreeRebirth(user(99, null))).to.equal(false);
    });

    it('lvl 100 (na fronteira) -> true', () => {
      expect(isFreeRebirth(user(100, null))).to.equal(true);
    });

    it('lvl 101 -> true', () => {
      expect(isFreeRebirth(user(101, null))).to.equal(true);
    });
  });
});
