import getItemByPathAndType from '../../../website/common/script/libs/getItemByPathAndType';
import content from '../../../website/common/script/content/index';

// PTOSS-2 — Função A2: getItemByPathAndType(type, path)
// Estratégia: projeto iniciado por CAIXA-PRETA (particionamento de equivalência
// + análise de valor-limite sobre o domínio de `type`) e complementado por
// CAIXA-BRANCA (cobertura das decisões D1 (linha 6) e D2 (linha 19), incluindo a
// interação estrutural em que o ramo timeTravelersStable sobrescreve o resultado
// da busca genérica).

describe('getItemByPathAndType', () => {
  // ---------------------------------------------------------------------------
  // CAIXA-PRETA — Particionamento de equivalência do parâmetro `type`
  // ---------------------------------------------------------------------------

  describe('tipos de aparência -> busca em content.appearances (D1 verdadeira)', () => {
    it('CT1: retorna o item de aparência quando type=skin e path existe', () => {
      const result = getItemByPathAndType('skin', 'skin.915533');

      expect(result).to.eql(content.appearances.skin['915533']);
      expect(result).to.have.property('key', '915533');
    });

    it('CT2: retorna o item de aparência para outro membro do conjunto (type=shirt)', () => {
      const result = getItemByPathAndType('shirt', 'shirt.black');

      expect(result).to.eql(content.appearances.shirt.black);
    });

    it('CT5: retorna undefined quando type é de aparência mas o path não existe', () => {
      const result = getItemByPathAndType('skin', 'skin.zzzzzz');

      expect(result).to.equal(undefined);
    });
  });

  describe('tipos genéricos -> busca direta em content (D1 falsa)', () => {
    it('CT3: retorna o item quando type genérico (eggs) e path existe', () => {
      const result = getItemByPathAndType('eggs', 'eggs.Wolf');

      expect(result).to.eql(content.eggs.Wolf);
    });

    it('CT4: retorna undefined quando type genérico e path não existe', () => {
      const result = getItemByPathAndType('eggs', 'eggs.NaoExiste');

      expect(result).to.equal(undefined);
    });
  });

  describe('type=timeTravelersStable -> objeto construído a partir do path (D2 verdadeira)', () => {
    it('CT6: monta { key, type } a partir de <prefixo>.<animalType>.<key>', () => {
      const result = getItemByPathAndType('timeTravelersStable', 'timeTravelStable.pets.Wolf-Base');

      expect(result).to.eql({ key: 'Wolf-Base', type: 'pets' });
    });

    it('CT7: usa o segundo segmento como animalType (mounts) e o terceiro como key', () => {
      const result = getItemByPathAndType('timeTravelersStable', 'timeTravelStable.mounts.Gryphon-Base');

      expect(result).to.eql({ key: 'Gryphon-Base', type: 'mounts' });
    });
  });

  // ---------------------------------------------------------------------------
  // CAIXA-BRANCA (complemento) — interação estrutural entre D1/else e D2
  // ---------------------------------------------------------------------------

  describe('complemento estrutural: D2 sobrescreve o resultado da busca genérica', () => {
    it('CW1: para timeTravelersStable, retorna o objeto construído mesmo que o path não exista em content', () => {
      // A busca genérica (linha 16) retornaria undefined, mas as linhas 20-22
      // reconstroem o item a partir do path -> o override deve prevalecer.
      const result = getItemByPathAndType('timeTravelersStable', 'naoexiste.pets.Wolf-Base');

      expect(result).to.eql({ key: 'Wolf-Base', type: 'pets' });
      expect(result).to.not.equal(undefined);
    });
  });
});
