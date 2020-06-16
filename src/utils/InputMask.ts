
/**
 * INPUT MASK
 *
 * https://jsperf.com/inputmask-comparison
 *
 * Heavily modelled after imask.js; this aims to be a lean, minimalistic, functional, implementation-agnostic library
 */

const regexNonAlphaNumeric = /[|()[\]/\\\-+_.\s]/gi;
const regexNotNumeric = /[|()[\]/\\\-+_\sa-zA-Z]/gi;
const regexDateDelimiter = /[|()[\]/\\\-+_.\sa-zA-Z]/gi;
const regexNumeric = /[0-9]/i;
const regexAlpha = /[a-zA-Z]/i;

const CHAR_DIGIT = "0";
const CHAR_ALPHA = "a";
const CHAR_ANY = "*";
const DEFAULT_MASK = "";
const DEFAULT_MASK_DELIMITER = "-";
const DEFAULT_MASK_VALUE = "";
const DEFAULT_DECIMAL_CHAR = ".";
const DEFAULT_DATE_PATTERN = "YYYY-mm-dd";

const padWithZeros = (str, numFill = 0) => {
  return (str || "")
    .toString()
    .padStart(numFill, "0");
};

type Mask = any;

interface InputMaskConstructorOptions {
  mask: Mask;
  delimiter?: string;
  maxLength?: number;
  guide?: boolean;
  decimalChar?: string;
  datePattern?: string;
}

interface PatternPart {
  value: string;
  optional: true;
}

class InputMask {
  _mask: Mask = DEFAULT_MASK;
  _maskParts: any[] = [];
  _maxLength: number = Infinity;
  _guide: boolean = false;
  _delimiter: string = DEFAULT_MASK_DELIMITER;
  _decimalChar: string = DEFAULT_DECIMAL_CHAR;
  _datePattern: string = DEFAULT_DATE_PATTERN;
  value: string = DEFAULT_MASK_VALUE;
  unmaskedValue: any = DEFAULT_MASK_VALUE;

  constructor(
    options: InputMaskConstructorOptions = {
      mask: DEFAULT_MASK_VALUE,
    }
  ) {
    this._checkOptions(options);
    this._mask = options.mask || DEFAULT_MASK;
    this._maxLength = options.maxLength || Infinity;
    this._guide = options.guide || false;
    this._delimiter = options.delimiter || this._getDefaultDelimiter();
    this._decimalChar = options.decimalChar || DEFAULT_DECIMAL_CHAR;
    this._datePattern = options.datePattern || DEFAULT_DATE_PATTERN;
    this._maskParts = InputMask._preparePatternParts(options.mask);
    return this;
  }

  _checkOptions(options: InputMaskConstructorOptions) {
    if (!options.mask) {
      throw new Error(
        "constructor `options.mask` param required and cannot be empty"
      );
    }
  }

  static _preparePatternParts(mask: Mask): PatternPart[] {
    if (!mask) return [];
    if (typeof mask !== "string" && typeof mask !== "number") return [];
    const _mask = (mask || "").toString();
    let parts: PatternPart[] = [];
    let buffer = "";
    let optionalFlag = false;
    const addPart = (value, optional) => {
      parts.push({
        value,
        optional,
      });
    };
    for (let i = 0; i < _mask.length; i += 1) {
      const char = _mask[i];
      if (char === "[") {
        optionalFlag = true;
        continue;
      }
      if (char === "]") {
        addPart(buffer, true);
        optionalFlag = false;
        buffer = "";
        continue;
      }
      if (optionalFlag) {
        buffer += char;
        continue;
      }
      addPart(char, false);
    }
    return parts;
  }

  _isTypeNumber() {
    return false ||
      this._mask === "Number" ||
      this._mask === "number" ||
      this._mask === Number ||
      this._mask instanceof Number;
  }

  _isTypeDate() {
    return false ||
      this._mask === "Date" ||
      this._mask === "date" ||
      this._mask === Date ||
      this._mask instanceof Date;
  }

  _getDefaultDelimiter() {
    if (this._isTypeNumber()) {
      return ',';
    }
    if (this._isTypeDate()) {
      return '/';
    }
    return DEFAULT_MASK_DELIMITER;
  }

  _sanitizeInput(val): string {
    const formatVal = (regexCharsToStrip: RegExp) => {
      const _val = (!val && val !== 0) ? "" : val;
      return _val.toString().replace(regexCharsToStrip, "");
    };
    if (this._isTypeNumber()) {
      return formatVal(regexNotNumeric);
    }
    if (this._isTypeDate()) {
      return formatVal(regexDateDelimiter);
    }
    return (val || "").toString().replace(regexNonAlphaNumeric, "");
  }

  _maskNumber(val) {
    const _val: string = this._sanitizeInput(val);
    if (!_val.length) return "";

    const [numPartWhole, numPartDecimal] = _val.split(".").slice(0, 2);

    if (!numPartWhole) return "";

    let composed = "";
    let placeValue = 0;
    for (let i = numPartWhole.length - 1; i >= 0; i--) {
      if (placeValue && !(placeValue % 3)) {
        composed = this._delimiter + composed;
      }
      composed = numPartWhole[i] + composed;
      placeValue++;
    }
    const suffix = numPartDecimal ? `${this._decimalChar}${numPartDecimal}` : "";
    return composed + suffix;
  }

  _maskDate(val) {
    const _val: string = this._sanitizeInput(val);
    const datePatternParts = this._datePattern
      .split(regexNonAlphaNumeric)
      .filter(v => !!v)
      .map(v => v.toLowerCase());

    let composed = "";
    let cursor = 0;
    let currentDay: number = 0;
    let currentMonth: number = 0;
    let currentYear: number = 0;

    const setTimeFromInput = (currentTimeUnit: "d" | "m" | "y", partial) => {
      const intPartial = parseInt(partial, 10);
      switch (currentTimeUnit) {
        case "d":
          currentDay = intPartial;
          break;
        case "m":
          currentMonth = intPartial;
          break;
        case "y":
          currentYear = intPartial;
          break;
        default:
          break;
      }
    };

    const captureChars = (currentTimeUnit: "d" | "m" | "y", numChars = 4, max = '9999') => {
      if (cursor !== 0) {
        composed += this._delimiter;
      }
      let partial = _val.substring(cursor, cursor + numChars);
      if (partial.length === numChars) {
        const isUnderMin = parseInt(partial, 10) === 0;
        const isOverMax = parseInt(partial, 10) > parseInt(max, 10);
        if (isUnderMin) {
          partial = "01".padStart(numChars, "0");
        } else if (isOverMax) {
          partial = max;
        }
        setTimeFromInput(currentTimeUnit, partial);
      }
      composed += partial
      cursor += partial.length;
    };

    for (let i = 0; i < datePatternParts.length; i++) {
      const part = datePatternParts[i];
      if (part.includes('y')) {
        captureChars('y', 4, '9999');
        continue;
      }
      if (part.includes('m')) {
        captureChars('m', 2, '12');
        continue;
      }
      if (part.includes('d')) {
        captureChars('d', 2, '31');
        continue;
      }
    }

    if (currentDay && currentMonth && currentYear) {
      const d = new Date();
      d.setFullYear(currentYear);
      d.setMonth(currentMonth - 1);
      d.setDate(currentDay);
      const dateParts = [];
      for (let i = 0; i < datePatternParts.length; i++) {
        const part = datePatternParts[i];
        if (part.includes('y')) {
          dateParts.push(padWithZeros(d.getFullYear(), 4));
          continue;
        }
        if (part.includes('m')) {
          dateParts.push(padWithZeros(d.getMonth() + 1, 2));
          continue;
        }
        if (part.includes('d')) {
          dateParts.push(padWithZeros(d.getDate(), 2));
          continue;
        }
      }
      composed = dateParts.join(this._delimiter);
    }
    return composed;
  }

  mask(val) {
    if (this._isTypeNumber()) return this._maskNumber(val);
    if (this._isTypeDate()) return this._maskDate(val);

    const _val: string = this._sanitizeInput(val);
    const maxCursor = _val.length;
    let composed = "";
    let cursor = 0;
    const pushChar = (char) => {
      composed += char;
      cursor++;
    };
    for (let i = 0; i < this._maskParts.length; i++) {
      if (cursor >= this._maxLength) break;

      const char = _val[cursor];
      const part = this._maskParts[i];
      const compareVal = part.value
        .trim()
        .toLowerCase()
        .replace(regexNonAlphaNumeric, "");

      if (cursor >= maxCursor) {
        if (!this._guide) break;
        if (
          compareVal === CHAR_DIGIT ||
          compareVal === CHAR_ALPHA ||
          compareVal === CHAR_ANY
        ) {
          pushChar("_");
          continue;
        }
      }

      if (
        (compareVal === CHAR_DIGIT && regexNumeric.test(char)) ||
        (compareVal === CHAR_ALPHA && regexAlpha.test(char)) ||
        compareVal === CHAR_ANY
      ) {
        pushChar(char);
        continue;
      }

      if (part.optional) {
        if (compareVal === char) {
          pushChar(part.value);
        }
        continue;
      }

      composed += part.value;
    }
    return composed;
  }

  unmask(val) {
    return this._sanitizeInput(val);
  }

  resolve(val) {
    this.value = this.mask(val);
    this.unmaskedValue = this.unmask(val);
    return this;
  }
}

export default InputMask;
