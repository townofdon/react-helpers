
const regexNonAlphaNumeric = /[\(\)\[\]\-\.\s]/gi;
const regexNotNumeric = /(?![0-9.])/gi;
const regexNumeric = /[0-9]/i;
const regexAlpha = /[a-zA-Z]/i;

const CHAR_DIGIT = "0";
const CHAR_ALPHA = "a";
const CHAR_ANY = "*";
const DEFAULT_MASK_TYPE = "_NORMAL_";
const DEFAULT_MASK_DELIMITER = "-";

interface InputMaskConstructorOptions {
  type?: any;
  pattern?: string;
  delimiter?: string;
  maxLength?: number;
  guide?: boolean;
}

interface PatternPart {
  value: string;
  optional: true;
}

class InputMask {
  _pattern: string = "";
  _patternParts: any[] = [];
  _maxLength: number = Infinity;
  _guide: boolean = false;
  _delimiter: string = DEFAULT_MASK_DELIMITER;
  _type: any = DEFAULT_MASK_TYPE;
  value: string = "";
  unmaskedValue: any = "";

  constructor(
    options: InputMaskConstructorOptions = {
      pattern: "",
    }
  ) {
    this._type = options.type;
    this._checkOptions(options);
    this._pattern = options.pattern;
    this._maxLength = options.maxLength;
    this._guide = options.guide;
    this._delimiter = options.delimiter || this._getDefaultDelimiter();
    this._patternParts = InputMask._preparePatternParts(options.pattern);
    return this;
  }

  _checkOptions(options: InputMaskConstructorOptions) {
    if (this._type === DEFAULT_MASK_TYPE) {
      if (!options.pattern) {
        throw new Error(
          "constructor `options.pattern` param required and cannot be empty"
        );
      }
      if (typeof options.pattern !== "string") {
        throw new Error("constructor `options.pattern` param must be a string");
      }
    }
  }

  static _preparePatternParts(pattern: string): PatternPart[] {
    if (!pattern) return [];
    if (typeof pattern !== "string" && typeof pattern !== "number") return [];
    const _pattern = (pattern || "").toString();
    let parts: PatternPart[] = [];
    let buffer = "";
    let optionalFlag = false;
    const addPart = (value, optional) => {
      parts.push({
        value,
        optional,
      });
    };
    for (let i = 0; i < _pattern.length; i += 1) {
      const char = _pattern[i];
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
      this._type === "Number" ||
      this._type === "number" ||
      this._type === Number ||
      this._type instanceof Number;
  }

  _isTypeDate() {
    return false ||
      this._type === "Date" ||
      this._type === "date" ||
      this._type === Date ||
      this._type instanceof Date;
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
    if (this._isTypeNumber()) {
      const _val = (!val && val !== 0) ? "" : val;
      return _val.toString().replace(regexNotNumeric, "");
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
    return composed + (numPartDecimal ? `.${numPartDecimal}` : "")
  }

  mask(val) {
    if (this._isTypeNumber()) return this._maskNumber(val);

    const _val: string = this._sanitizeInput(val);
    const maxCursor = _val.length;
    let composed = "";
    let cursor = 0;
    const pushChar = (char) => {
      composed += char;
      cursor++;
    };
    for (let i = 0; i < this._patternParts.length; i++) {
      if (cursor >= this._maxLength) break;

      const char = _val[cursor];
      const part = this._patternParts[i];
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
