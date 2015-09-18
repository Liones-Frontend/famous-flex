export default class Margins {

  static apply(margins, rect) {
    rect.x += margins[3][0] + (margins[3][1] * rect.width);
    rect.y += margins[0][0] + (margins[0][1] * rect.height);
    rect.width -= (margins[3][0] + (margins[3][1] * rect.width)) + (margins[1][0] + (margins[1][1] * rect.width));
    rect.height -= (margins[0][0] + (margins[0][1] * rect.height)) + (margins[2][0] + (margins[2][1] * rect.height));
  }

  /**
   * Parses a single margin/padding value into a computational representation.
   *
   * Examples:
   * ```
   * Margins.parseComponent(10); // => `[10]`
   * Margins.parseComponent('10.5%'); // => `[0, 0.105]`
   * Margins.parseComponent('20%+10'); // => `[10, 0.2]`
   * Margins.parseComponent([20, 0.4]); // => `[20, 0.4]`
   * ```
   *
   * @param {Number|String|Array} value
   * @return {Number|Array}
   */
  static parseComponent(value) {
    if (value === undefined) {
      return undefined;
    } else if (typeof value === 'number') {
      return [value, 0];
    } else if (Array.isArray(value)) {
      return value;
    }
    // must be string...
    const vals = value.match(/^(\d+(\.\d+)?)%([\+\-]\d+)?$/);
    if (vals) {
      const mul = parseFloat(vals[1]) / 100;
      if (vals[3]) {
        const px = parseInt(vals[vals.length - 1].substring(1));
        return [(vals[3] === '-') ? -px : px, mul];
      } else {
        return [0, mul];
      }
    }
    return 0;
  }

  /**
   * Parses a margins/padding value into a computational representation.
   *
   * Padding can be specified in both short-hand and full form:
   * ```
   * Margins.parse(10); // 10px padding for all sides
   * Margins.parse([20, 30]); // 20px padding for top/bottom, 30px for left/right
   * Margins.parse([1,2,3,4]); // 1px top, 2px right, 3px bottom, 4px left (clock-wise)
   * Margins.parse('10%'); // 10% padding for all sides
   * Margins.parse(['10%', '50%']); // 10% padding for top/bottom, 50% for left/right
   * Margins.parse(['10%+5', '50%-10']); // 10% + 5px padding for top/bottom, 50% - 10px for left/right
   * Margins.parse([[0.1]]); // 10% padding for all sides
   * Margins.parse([[0.05,10]]); // 5% + 10px padding for all sides
   * ...
   * ```
   *
   * @param {String|Number|Array} value
   * @return {Array}
   */
  static parse(value) {
    if (!value) {
      return Margins.identity;
    } else if (!Array.isArray(value)) {
      const component = Margins.parseComponent(value);
      return [component, component, component, component];
    } else if (value.length === 0) {
      return Margins.identity;
    } else if (value.length === 1) {
      const component = Margins.parseComponent(value[0]);
      return [component, component, component, component];
    } else if (value.length === 2) {
      const component1 = Margins.parseComponent(value[0]);
      const component2 = Margins.parseComponent(value[1]);
      return [component1, component2, component1, component2];
    } else {
      return [
        Margins.parseComponent(value[0]),
        Margins.parseComponent(value[1]),
        Margins.parseComponent(value[2]),
        Margins.parseComponent(value[3])
      ];
    }
  }
}

Margins.identity = [[0, 0], [0, 0], [0, 0], [0, 0]];