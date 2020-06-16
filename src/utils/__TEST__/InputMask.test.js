
import InputMask from '../InputMask';

test('input masks work correctly for phone numbers', () => {
  const i1 = new InputMask({ mask: '[1 ](000) 000-0000' });
  expect(i1.mask('19999999999')).toEqual('1 (999) 999-9999');

  const i2 = new InputMask({ mask: '[1 ](000)-000-0000' });
  expect(i2.mask('7775553333')).toEqual('(777)-555-3333');

  // handle max length
  const i3 = new InputMask({ mask: '[1 ](000)-000-0000', maxLength: 11 });
  expect(i3.mask('7775553333124564654654')).toEqual('(777)-555-3333');

  // handle extra chars
  const i4 = new InputMask({ mask: '[1 ](000)-000-0000' });
  expect(i4.mask('(777) 555-3333')).toEqual('(777)-555-3333');
  expect(i4.mask('777 555-3333')).toEqual('(777)-555-3333');

  // handle partials
  const i5 = new InputMask({ mask: '[1 ](000) 000-0000' });
  expect(i5.mask('777')).toEqual('(777');
  expect(i5.mask('7775')).toEqual('(777) 5');
  expect(i5.mask('777555')).toEqual('(777) 555');
  expect(i5.mask('77755560')).toEqual('(777) 555-60');

  // handle guide mode
  const i6 = new InputMask({ mask: '[1 ](000) 000-0000', guide: true });
  expect(i6.mask('777')).toEqual('(777) ___-____');
  expect(i6.mask('7775')).toEqual('(777) 5__-____');
  expect(i6.mask('777555')).toEqual('(777) 555-____');
  expect(i6.mask('77755560')).toEqual('(777) 555-60__');
  expect(i6.mask('777555601')).toEqual('(777) 555-601_');
  expect(i6.mask('7775556010')).toEqual('(777) 555-6010');
  expect(i6.mask('')).toEqual('(___) ___-____');
});

test('input mask resolve works as expected', () => {
  const i1 = new InputMask({ mask: '[1 ](000) 000-0000' });
  i1.resolve('1-999-999-9999');
  expect(i1.value).toEqual('1 (999) 999-9999');
  expect(i1.unmaskedValue).toEqual('19999999999');
});

test('input masks work correctly for credit cards', () => {
  const inputMaskCC = new InputMask({ mask: '0000 0000 0000 0000', maxLength: 16 });

  expect(inputMaskCC.mask('1234123412341234')).toEqual('1234 1234 1234 1234');
  expect(inputMaskCC.mask('12341234')).toEqual('1234 1234');
});

test('input mask constructed with correct default delimeter', () => {
  const i1 = new InputMask({ mask: Number });
  expect(i1._delimiter).toEqual(',');
  const i2 = new InputMask({ mask: Date });
  expect(i2._delimiter).toEqual('/');
  const i3 = new InputMask({ mask: Number, delimiter: '|' });
  expect(i3._delimiter).toEqual('|');
  const i4 = new InputMask({ mask: "0000 0000" });
  expect(i4._delimiter).toEqual('-');
});

test('input mask works for number type', () => {
  const i1 = new InputMask({ mask: Number });
  expect(i1.mask()).toEqual('');
  expect(i1.mask(0)).toEqual('0');
  expect(i1.mask(1)).toEqual('1');
  expect(i1.mask(15)).toEqual('15');
  expect(i1.mask(150)).toEqual('150');
  expect(i1.mask(1500)).toEqual('1,500');
  expect(i1.mask(15000)).toEqual('15,000');
  expect(i1.mask(15000.1)).toEqual('15,000.1');
  expect(i1.mask(15000.11)).toEqual('15,000.11');
  expect(i1.mask('15000.0')).toEqual('15,000.0');
  expect(i1.mask('15000.00')).toEqual('15,000.00');
  expect(i1.mask('15000000.00')).toEqual('15,000,000.00');

  // handle different number formats
  const i2 = new InputMask({ mask: Number, delimiter: '.', decimalChar: ',' });
  expect(i2.mask('15000.00')).toEqual('15.000,00');
  expect(i2.mask('150000.00')).toEqual('150.000,00');
  expect(i2.mask('1500000.00')).toEqual('1.500.000,00');
});
