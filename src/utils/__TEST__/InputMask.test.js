
import InputMask from '../InputMask';

test('input masks work correctly for phone numbers', () => {
  const i1 = new InputMask({ pattern: '[1 ](000) 000-0000' });
  expect(i1.mask('19999999999')).toEqual('1 (999) 999-9999');

  const i2 = new InputMask({ pattern: '[1 ](000)-000-0000' });
  expect(i2.mask('7775553333')).toEqual('(777)-555-3333');

  // handle max length
  const i3 = new InputMask({ pattern: '[1 ](000)-000-0000', maxLength: 11 });
  expect(i3.mask('7775553333124564654654')).toEqual('(777)-555-3333');

  // handle extra chars
  const i4 = new InputMask({ pattern: '[1 ](000)-000-0000' });
  expect(i4.mask('(777) 555-3333')).toEqual('(777)-555-3333');
  expect(i4.mask('777 555-3333')).toEqual('(777)-555-3333');

  // handle partials
  const i5 = new InputMask({ pattern: '[1 ](000) 000-0000' });
  expect(i5.mask('777')).toEqual('(777');
  expect(i5.mask('7775')).toEqual('(777) 5');
  expect(i5.mask('777555')).toEqual('(777) 555');
  expect(i5.mask('77755560')).toEqual('(777) 555-60');

  // handle filling remaining / guide mode
  const i6 = new InputMask({ pattern: '[1 ](000) 000-0000', guide: true });
  expect(i6.mask('777')).toEqual('(777) ___-____');
  expect(i6.mask('7775')).toEqual('(777) 5__-____');
  expect(i6.mask('777555')).toEqual('(777) 555-____');
  expect(i6.mask('77755560')).toEqual('(777) 555-60__');
  expect(i6.mask('')).toEqual('(___) ___-____');
});

test('input mask resolve works as expected', () => {
  const i1 = new InputMask({ pattern: '[1 ](000) 000-0000' });
  i1.resolve('1-999-999-9999');
  expect(i1.value).toEqual('1 (999) 999-9999');
  expect(i1.unmaskedValue).toEqual('19999999999');
});

test('input masks work correctly for credit cards', () => {
  const inputMaskCC = new InputMask({ pattern: '0000 0000 0000 0000', maxLength: 16 });

  expect(inputMaskCC.mask('1234123412341234')).toEqual('1234 1234 1234 1234');
  expect(inputMaskCC.mask('12341234')).toEqual('1234 1234');
});
