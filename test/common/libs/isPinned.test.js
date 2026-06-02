import isPinned from '../../../website/common/script/libs/isPinned';

// PTOSS-2 — Função B3: isPinned(user, item, checkOfficialPinnedItems)
// Estratégia: projeto iniciado por CAIXA-BRANCA (MC/DC da decisão final, com 2
// condições, + cobertura das sub-condições compostas e do early-return) e
// complementado por CAIXA-PRETA (partições de "item oficial / despinado /
// pinado").
//
// Decisão final (linha 11): X && Y, onde
//   X = isPinnedOfficial  = checkOfficialPinnedItems !== undefined
//                           && contém item.path
//   Y = !isItemUnpinned   (isItemUnpinned = user.unpinnedItems !== undefined
//                           && contém item.path)
// Se X && Y -> retorna true; caso contrário -> retorna isItemPinned.
//
// Tabela-verdade da decisão final (mantendo isItemPinned = false) e MC/DC:
//   # | X Y | resultado | MC/DC
//   --+-----+-----------+---------------------------
//   1 | T T |   true    | base
//   2 | T F |   false   | independência de Y: par {1,2}
//   3 | F T |   false   | independência de X: par {1,3}
//   4 | F F |   false   |
//   Conjunto MC/DC = {1, 2, 3}. Pares: X {1,3}, Y {1,2}.

const item = { path: 'p' };

describe('isPinned', () => {
  // ---------------------------------------------------------------------------
  // CAIXA-BRANCA — early-return (guarda de user nulo)
  // ---------------------------------------------------------------------------
  describe('guarda de entrada', () => {
    it('retorna false quando user é null', () => {
      expect(isPinned(null, item, undefined)).to.equal(false);
    });
  });

  // ---------------------------------------------------------------------------
  // CAIXA-BRANCA — MC/DC da decisão final X && Y (isItemPinned = false)
  // ---------------------------------------------------------------------------
  describe('MC/DC da decisão final (isPinnedOfficial && !isItemUnpinned)', () => {
    it('#1 X=T Y=T -> true (oficial e não despinado)', () => {
      const user = { unpinnedItems: [], pinnedItems: [] };

      expect(isPinned(user, item, [{ path: 'p' }])).to.equal(true);
    });

    it('#2 X=T Y=F -> false (oficial, porém despinado) [indep. Y]', () => {
      const user = { unpinnedItems: [{ path: 'p' }], pinnedItems: [] };

      expect(isPinned(user, item, [{ path: 'p' }])).to.equal(false);
    });

    it('#3 X=F Y=T -> false (não está na lista oficial) [indep. X]', () => {
      const user = { unpinnedItems: [], pinnedItems: [] };

      expect(isPinned(user, item, [{ path: 'outro' }])).to.equal(false);
    });
  });

  // ---------------------------------------------------------------------------
  // CAIXA-PRETA (complemento) — retorno por isItemPinned e sub-condições compostas
  // ---------------------------------------------------------------------------
  describe('retorno por isItemPinned quando não é pin oficial', () => {
    it('item presente em pinnedItems -> true', () => {
      const user = { unpinnedItems: [], pinnedItems: [{ path: 'p' }] };

      expect(isPinned(user, item, undefined)).to.equal(true);
    });

    it('item ausente de pinnedItems -> false', () => {
      const user = { unpinnedItems: [], pinnedItems: [{ path: 'outro' }] };

      expect(isPinned(user, item, undefined)).to.equal(false);
    });

    it('pinnedItems ausente (undefined) -> false', () => {
      const user = { unpinnedItems: [] };

      expect(isPinned(user, item, undefined)).to.equal(false);
    });
  });

  describe('sub-condições compostas (cobertura das condições !== undefined)', () => {
    it('unpinnedItems ausente equivale a não despinado (Y verdadeiro) -> true', () => {
      const user = { pinnedItems: [] }; // sem unpinnedItems

      expect(isPinned(user, item, [{ path: 'p' }])).to.equal(true);
    });

    it('checkOfficialPinnedItems ausente -> isPinnedOfficial falso, cai em isItemPinned', () => {
      const user = { unpinnedItems: [], pinnedItems: [{ path: 'p' }] };

      expect(isPinned(user, item, undefined)).to.equal(true);
    });
  });
});
