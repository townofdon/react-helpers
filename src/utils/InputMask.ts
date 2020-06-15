
const regexNonAlphaNumeric = /[\(\)\[\]\-\.\s]/gi;
const regexNumeric = /[0-9]/i;
const regexAlpha = /[a-zA-Z]/i;

const CHAR_DIGIT = "0";
const CHAR_ALPHA = "a";
const CHAR_ANY = "*";

interface InputMaskConstructorOptions {
  pattern: string;
  maxLength?: number;
  guide?: boolean;
}

class InputMask {
  _pattern = "";
  _patternParts = [];
  _maxLength = Infinity;
  _guide = false;
  value = "";
  unmaskedValue = "";

  constructor(
    options: InputMaskConstructorOptions = {
      pattern: "",
    }
  ) {
    InputMask._checkOptions(options);
    this._pattern = options.pattern;
    this._maxLength = options.maxLength;
    this._guide = options.guide;
    this._patternParts = InputMask._preparePatternParts(options.pattern);
    return this;
  }

  static _checkOptions(options: InputMaskConstructorOptions) {
    if (!options.pattern) {
      throw new Error(
        "constructor `options.pattern` param required and cannot be empty"
      );
    }
    if (typeof options.pattern !== "string") {
      throw new Error("constructor `options.pattern` param must be a string");
    }
  }

  static _preparePatternParts(pattern) {
    if (!pattern) return [];
    if (typeof pattern !== "string" && typeof pattern !== "number") return [];
    const _pattern = (pattern || "").toString();
    let parts = [];
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

  mask(val) {
    const _val = (val || "").toString().replace(regexNonAlphaNumeric, "");
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
    const _val = (val || "").toString().replace(regexNonAlphaNumeric, "");
    return _val;
  }

  resolve(val) {
    this.value = this.mask(val);
    this.unmaskedValue = this.unmask(val);
    return this;
  }
}

export default InputMask;
