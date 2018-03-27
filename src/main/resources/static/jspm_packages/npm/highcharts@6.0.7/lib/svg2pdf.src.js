/* */ 
"format cjs";
(function(process) {
  (function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = f();
    } else if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;
      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }
      g.svg2pdf = f();
    }
  })(function() {
    var define,
        module,
        exports;
    return (function e(t, n, r) {
      function s(o, u) {
        if (!n[o]) {
          if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a)
              return a(o, !0);
            if (i)
              return i(o, !0);
            var f = new Error("Cannot find module '" + o + "'");
            throw f.code = "MODULE_NOT_FOUND", f;
          }
          var l = n[o] = {exports: {}};
          t[o][0].call(l.exports, function(e) {
            var n = t[o][1][e];
            return s(n ? n : e);
          }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
      }
      var i = typeof require == "function" && require;
      for (var o = 0; o < r.length; o++)
        s(r[o]);
      return s;
    })({
      1: [function(require, module, exports) {
        'use strict';
        module.exports = require('./lib/svgpath');
      }, {"./lib/svgpath": 6}],
      2: [function(require, module, exports) {
        'use strict';
        var TAU = Math.PI * 2;
        function vector_angle(ux, uy, vx, vy) {
          var sign = (ux * vy - uy * vx < 0) ? -1 : 1;
          var umag = Math.sqrt(ux * ux + uy * uy);
          var vmag = Math.sqrt(ux * ux + uy * uy);
          var dot = ux * vx + uy * vy;
          var div = dot / (umag * vmag);
          if (div > 1.0) {
            div = 1.0;
          }
          if (div < -1.0) {
            div = -1.0;
          }
          return sign * Math.acos(div);
        }
        function get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi) {
          var x1p = cos_phi * (x1 - x2) / 2 + sin_phi * (y1 - y2) / 2;
          var y1p = -sin_phi * (x1 - x2) / 2 + cos_phi * (y1 - y2) / 2;
          var rx_sq = rx * rx;
          var ry_sq = ry * ry;
          var x1p_sq = x1p * x1p;
          var y1p_sq = y1p * y1p;
          var radicant = (rx_sq * ry_sq) - (rx_sq * y1p_sq) - (ry_sq * x1p_sq);
          if (radicant < 0) {
            radicant = 0;
          }
          radicant /= (rx_sq * y1p_sq) + (ry_sq * x1p_sq);
          radicant = Math.sqrt(radicant) * (fa === fs ? -1 : 1);
          var cxp = radicant * rx / ry * y1p;
          var cyp = radicant * -ry / rx * x1p;
          var cx = cos_phi * cxp - sin_phi * cyp + (x1 + x2) / 2;
          var cy = sin_phi * cxp + cos_phi * cyp + (y1 + y2) / 2;
          var v1x = (x1p - cxp) / rx;
          var v1y = (y1p - cyp) / ry;
          var v2x = (-x1p - cxp) / rx;
          var v2y = (-y1p - cyp) / ry;
          var theta1 = vector_angle(1, 0, v1x, v1y);
          var delta_theta = vector_angle(v1x, v1y, v2x, v2y);
          if (fs === 0 && delta_theta > 0) {
            delta_theta -= TAU;
          }
          if (fs === 1 && delta_theta < 0) {
            delta_theta += TAU;
          }
          return [cx, cy, theta1, delta_theta];
        }
        function approximate_unit_arc(theta1, delta_theta) {
          var alpha = 4 / 3 * Math.tan(delta_theta / 4);
          var x1 = Math.cos(theta1);
          var y1 = Math.sin(theta1);
          var x2 = Math.cos(theta1 + delta_theta);
          var y2 = Math.sin(theta1 + delta_theta);
          return [x1, y1, x1 - y1 * alpha, y1 + x1 * alpha, x2 + y2 * alpha, y2 - x2 * alpha, x2, y2];
        }
        module.exports = function a2c(x1, y1, x2, y2, fa, fs, rx, ry, phi) {
          var sin_phi = Math.sin(phi * TAU / 360);
          var cos_phi = Math.cos(phi * TAU / 360);
          var x1p = cos_phi * (x1 - x2) / 2 + sin_phi * (y1 - y2) / 2;
          var y1p = -sin_phi * (x1 - x2) / 2 + cos_phi * (y1 - y2) / 2;
          if (x1p === 0 && y1p === 0) {
            return [];
          }
          if (rx === 0 || ry === 0) {
            return [];
          }
          rx = Math.abs(rx);
          ry = Math.abs(ry);
          var lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
          if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
          }
          var cc = get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi);
          var result = [];
          var theta1 = cc[2];
          var delta_theta = cc[3];
          var segments = Math.max(Math.ceil(Math.abs(delta_theta) / (TAU / 4)), 1);
          delta_theta /= segments;
          for (var i = 0; i < segments; i++) {
            result.push(approximate_unit_arc(theta1, delta_theta));
            theta1 += delta_theta;
          }
          return result.map(function(curve) {
            for (var i = 0; i < curve.length; i += 2) {
              var x = curve[i + 0];
              var y = curve[i + 1];
              x *= rx;
              y *= ry;
              var xp = cos_phi * x - sin_phi * y;
              var yp = sin_phi * x + cos_phi * y;
              curve[i + 0] = xp + cc[0];
              curve[i + 1] = yp + cc[1];
            }
            return curve;
          });
        };
      }, {}],
      3: [function(require, module, exports) {
        'use strict';
        var epsilon = 0.0000000001;
        var torad = Math.PI / 180;
        function Ellipse(rx, ry, ax) {
          if (!(this instanceof Ellipse)) {
            return new Ellipse(rx, ry, ax);
          }
          this.rx = rx;
          this.ry = ry;
          this.ax = ax;
        }
        Ellipse.prototype.transform = function(m) {
          var c = Math.cos(this.ax * torad),
              s = Math.sin(this.ax * torad);
          var ma = [this.rx * (m[0] * c + m[2] * s), this.rx * (m[1] * c + m[3] * s), this.ry * (-m[0] * s + m[2] * c), this.ry * (-m[1] * s + m[3] * c)];
          var J = ma[0] * ma[0] + ma[2] * ma[2],
              K = ma[1] * ma[1] + ma[3] * ma[3];
          var D = ((ma[0] - ma[3]) * (ma[0] - ma[3]) + (ma[2] + ma[1]) * (ma[2] + ma[1])) * ((ma[0] + ma[3]) * (ma[0] + ma[3]) + (ma[2] - ma[1]) * (ma[2] - ma[1]));
          var JK = (J + K) / 2;
          if (D < epsilon * JK) {
            this.rx = this.ry = Math.sqrt(JK);
            this.ax = 0;
            return this;
          }
          var L = ma[0] * ma[1] + ma[2] * ma[3];
          D = Math.sqrt(D);
          var l1 = JK + D / 2,
              l2 = JK - D / 2;
          this.ax = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon) ? 90 : Math.atan(Math.abs(L) > Math.abs(l1 - K) ? (l1 - J) / L : L / (l1 - K)) * 180 / Math.PI;
          if (this.ax >= 0) {
            this.rx = Math.sqrt(l1);
            this.ry = Math.sqrt(l2);
          } else {
            this.ax += 90;
            this.rx = Math.sqrt(l2);
            this.ry = Math.sqrt(l1);
          }
          return this;
        };
        Ellipse.prototype.isDegenerate = function() {
          return (this.rx < epsilon * this.ry || this.ry < epsilon * this.rx);
        };
        module.exports = Ellipse;
      }, {}],
      4: [function(require, module, exports) {
        'use strict';
        function combine(m1, m2) {
          return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
        }
        function Matrix() {
          if (!(this instanceof Matrix)) {
            return new Matrix();
          }
          this.queue = [];
          this.cache = null;
        }
        Matrix.prototype.matrix = function(m) {
          if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0) {
            return this;
          }
          this.cache = null;
          this.queue.push(m);
          return this;
        };
        Matrix.prototype.translate = function(tx, ty) {
          if (tx !== 0 || ty !== 0) {
            this.cache = null;
            this.queue.push([1, 0, 0, 1, tx, ty]);
          }
          return this;
        };
        Matrix.prototype.scale = function(sx, sy) {
          if (sx !== 1 || sy !== 1) {
            this.cache = null;
            this.queue.push([sx, 0, 0, sy, 0, 0]);
          }
          return this;
        };
        Matrix.prototype.rotate = function(angle, rx, ry) {
          var rad,
              cos,
              sin;
          if (angle !== 0) {
            this.translate(rx, ry);
            rad = angle * Math.PI / 180;
            cos = Math.cos(rad);
            sin = Math.sin(rad);
            this.queue.push([cos, sin, -sin, cos, 0, 0]);
            this.cache = null;
            this.translate(-rx, -ry);
          }
          return this;
        };
        Matrix.prototype.skewX = function(angle) {
          if (angle !== 0) {
            this.cache = null;
            this.queue.push([1, 0, Math.tan(angle * Math.PI / 180), 1, 0, 0]);
          }
          return this;
        };
        Matrix.prototype.skewY = function(angle) {
          if (angle !== 0) {
            this.cache = null;
            this.queue.push([1, Math.tan(angle * Math.PI / 180), 0, 1, 0, 0]);
          }
          return this;
        };
        Matrix.prototype.toArray = function() {
          if (this.cache) {
            return this.cache;
          }
          if (!this.queue.length) {
            this.cache = [1, 0, 0, 1, 0, 0];
            return this.cache;
          }
          this.cache = this.queue[0];
          if (this.queue.length === 1) {
            return this.cache;
          }
          for (var i = 1; i < this.queue.length; i++) {
            this.cache = combine(this.cache, this.queue[i]);
          }
          return this.cache;
        };
        Matrix.prototype.calc = function(x, y, isRelative) {
          var m;
          if (!this.queue.length) {
            return [x, y];
          }
          if (!this.cache) {
            this.cache = this.toArray();
          }
          m = this.cache;
          return [x * m[0] + y * m[2] + (isRelative ? 0 : m[4]), x * m[1] + y * m[3] + (isRelative ? 0 : m[5])];
        };
        module.exports = Matrix;
      }, {}],
      5: [function(require, module, exports) {
        'use strict';
        var paramCounts = {
          a: 7,
          c: 6,
          h: 1,
          l: 2,
          m: 2,
          r: 4,
          q: 4,
          s: 4,
          t: 2,
          v: 1,
          z: 0
        };
        var SPECIAL_SPACES = [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF];
        function isSpace(ch) {
          return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) || (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) || (ch >= 0x1680 && SPECIAL_SPACES.indexOf(ch) >= 0);
        }
        function isCommand(code) {
          switch (code | 0x20) {
            case 0x6D:
            case 0x7A:
            case 0x6C:
            case 0x68:
            case 0x76:
            case 0x63:
            case 0x73:
            case 0x71:
            case 0x74:
            case 0x61:
            case 0x72:
              return true;
          }
          return false;
        }
        function isDigit(code) {
          return (code >= 48 && code <= 57);
        }
        function isDigitStart(code) {
          return (code >= 48 && code <= 57) || code === 0x2B || code === 0x2D || code === 0x2E;
        }
        function State(path) {
          this.index = 0;
          this.path = path;
          this.max = path.length;
          this.result = [];
          this.param = 0.0;
          this.err = '';
          this.segmentStart = 0;
          this.data = [];
        }
        function skipSpaces(state) {
          while (state.index < state.max && isSpace(state.path.charCodeAt(state.index))) {
            state.index++;
          }
        }
        function scanParam(state) {
          var start = state.index,
              index = start,
              max = state.max,
              zeroFirst = false,
              hasCeiling = false,
              hasDecimal = false,
              hasDot = false,
              ch;
          if (index >= max) {
            state.err = 'SvgPath: missed param (at pos ' + index + ')';
            return;
          }
          ch = state.path.charCodeAt(index);
          if (ch === 0x2B || ch === 0x2D) {
            index++;
            ch = (index < max) ? state.path.charCodeAt(index) : 0;
          }
          if (!isDigit(ch) && ch !== 0x2E) {
            state.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
            return;
          }
          if (ch !== 0x2E) {
            zeroFirst = (ch === 0x30);
            index++;
            ch = (index < max) ? state.path.charCodeAt(index) : 0;
            if (zeroFirst && index < max) {
              if (ch && isDigit(ch)) {
                state.err = 'SvgPath: numbers started with `0` such as `09` are ilegal (at pos ' + start + ')';
                return;
              }
            }
            while (index < max && isDigit(state.path.charCodeAt(index))) {
              index++;
              hasCeiling = true;
            }
            ch = (index < max) ? state.path.charCodeAt(index) : 0;
          }
          if (ch === 0x2E) {
            hasDot = true;
            index++;
            while (isDigit(state.path.charCodeAt(index))) {
              index++;
              hasDecimal = true;
            }
            ch = (index < max) ? state.path.charCodeAt(index) : 0;
          }
          if (ch === 0x65 || ch === 0x45) {
            if (hasDot && !hasCeiling && !hasDecimal) {
              state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
              return;
            }
            index++;
            ch = (index < max) ? state.path.charCodeAt(index) : 0;
            if (ch === 0x2B || ch === 0x2D) {
              index++;
            }
            if (index < max && isDigit(state.path.charCodeAt(index))) {
              while (index < max && isDigit(state.path.charCodeAt(index))) {
                index++;
              }
            } else {
              state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
              return;
            }
          }
          state.index = index;
          state.param = parseFloat(state.path.slice(start, index)) + 0.0;
        }
        function finalizeSegment(state) {
          var cmd,
              cmdLC;
          cmd = state.path[state.segmentStart];
          cmdLC = cmd.toLowerCase();
          var params = state.data;
          if (cmdLC === 'm' && params.length > 2) {
            state.result.push([cmd, params[0], params[1]]);
            params = params.slice(2);
            cmdLC = 'l';
            cmd = (cmd === 'm') ? 'l' : 'L';
          }
          if (cmdLC === 'r') {
            state.result.push([cmd].concat(params));
          } else {
            while (params.length >= paramCounts[cmdLC]) {
              state.result.push([cmd].concat(params.splice(0, paramCounts[cmdLC])));
              if (!paramCounts[cmdLC]) {
                break;
              }
            }
          }
        }
        function scanSegment(state) {
          var max = state.max,
              cmdCode,
              comma_found,
              need_params,
              i;
          state.segmentStart = state.index;
          cmdCode = state.path.charCodeAt(state.index);
          if (!isCommand(cmdCode)) {
            state.err = 'SvgPath: bad command ' + state.path[state.index] + ' (at pos ' + state.index + ')';
            return;
          }
          need_params = paramCounts[state.path[state.index].toLowerCase()];
          state.index++;
          skipSpaces(state);
          state.data = [];
          if (!need_params) {
            finalizeSegment(state);
            return;
          }
          comma_found = false;
          for (; ; ) {
            for (i = need_params; i > 0; i--) {
              scanParam(state);
              if (state.err.length) {
                return;
              }
              state.data.push(state.param);
              skipSpaces(state);
              comma_found = false;
              if (state.index < max && state.path.charCodeAt(state.index) === 0x2C) {
                state.index++;
                skipSpaces(state);
                comma_found = true;
              }
            }
            if (comma_found) {
              continue;
            }
            if (state.index >= state.max) {
              break;
            }
            if (!isDigitStart(state.path.charCodeAt(state.index))) {
              break;
            }
          }
          finalizeSegment(state);
        }
        module.exports = function pathParse(svgPath) {
          var state = new State(svgPath);
          var max = state.max;
          skipSpaces(state);
          while (state.index < max && !state.err.length) {
            scanSegment(state);
          }
          if (state.err.length) {
            state.result = [];
          } else if (state.result.length) {
            if ('mM'.indexOf(state.result[0][0]) < 0) {
              state.err = 'SvgPath: string should start with `M` or `m`';
              state.result = [];
            } else {
              state.result[0][0] = 'M';
            }
          }
          return {
            err: state.err,
            segments: state.result
          };
        };
      }, {}],
      6: [function(require, module, exports) {
        'use strict';
        var pathParse = require('./path_parse');
        var transformParse = require('./transform_parse');
        var matrix = require('./matrix');
        var a2c = require('./a2c');
        var ellipse = require('./ellipse');
        function SvgPath(path) {
          if (!(this instanceof SvgPath)) {
            return new SvgPath(path);
          }
          var pstate = pathParse(path);
          this.segments = pstate.segments;
          this.err = pstate.err;
          this.__stack = [];
        }
        SvgPath.prototype.__matrix = function(m) {
          var self = this,
              i;
          if (!m.queue.length) {
            return;
          }
          this.iterate(function(s, index, x, y) {
            var p,
                result,
                name,
                isRelative;
            switch (s[0]) {
              case 'v':
                p = m.calc(0, s[1], true);
                result = (p[0] === 0) ? ['v', p[1]] : ['l', p[0], p[1]];
                break;
              case 'V':
                p = m.calc(x, s[1], false);
                result = (p[0] === m.calc(x, y, false)[0]) ? ['V', p[1]] : ['L', p[0], p[1]];
                break;
              case 'h':
                p = m.calc(s[1], 0, true);
                result = (p[1] === 0) ? ['h', p[0]] : ['l', p[0], p[1]];
                break;
              case 'H':
                p = m.calc(s[1], y, false);
                result = (p[1] === m.calc(x, y, false)[1]) ? ['H', p[0]] : ['L', p[0], p[1]];
                break;
              case 'a':
              case 'A':
                var ma = m.toArray();
                var e = ellipse(s[1], s[2], s[3]).transform(ma);
                if (ma[0] * ma[3] - ma[1] * ma[2] < 0) {
                  s[5] = s[5] ? '0' : '1';
                }
                p = m.calc(s[6], s[7], s[0] === 'a');
                if ((s[0] === 'A' && s[6] === x && s[7] === y) || (s[0] === 'a' && s[6] === 0 && s[7] === 0)) {
                  result = [s[0] === 'a' ? 'l' : 'L', p[0], p[1]];
                  break;
                }
                if (e.isDegenerate()) {
                  result = [s[0] === 'a' ? 'l' : 'L', p[0], p[1]];
                } else {
                  result = [s[0], e.rx, e.ry, e.ax, s[4], s[5], p[0], p[1]];
                }
                break;
              case 'm':
                isRelative = index > 0;
                p = m.calc(s[1], s[2], isRelative);
                result = ['m', p[0], p[1]];
                break;
              default:
                name = s[0];
                result = [name];
                isRelative = (name.toLowerCase() === name);
                for (i = 1; i < s.length; i += 2) {
                  p = m.calc(s[i], s[i + 1], isRelative);
                  result.push(p[0], p[1]);
                }
            }
            self.segments[index] = result;
          }, true);
        };
        SvgPath.prototype.__evaluateStack = function() {
          var m,
              i;
          if (!this.__stack.length) {
            return;
          }
          if (this.__stack.length === 1) {
            this.__matrix(this.__stack[0]);
            this.__stack = [];
            return;
          }
          m = matrix();
          i = this.__stack.length;
          while (--i >= 0) {
            m.matrix(this.__stack[i].toArray());
          }
          this.__matrix(m);
          this.__stack = [];
        };
        SvgPath.prototype.toString = function() {
          var elements = [],
              skipCmd,
              cmd;
          this.__evaluateStack();
          for (var i = 0; i < this.segments.length; i++) {
            cmd = this.segments[i][0];
            skipCmd = i > 0 && cmd !== 'm' && cmd !== 'M' && cmd === this.segments[i - 1][0];
            elements = elements.concat(skipCmd ? this.segments[i].slice(1) : this.segments[i]);
          }
          return elements.join(' ').replace(/ ?([achlmqrstvz]) ?/gi, '$1').replace(/ \-/g, '-').replace(/zm/g, 'z m');
        };
        SvgPath.prototype.translate = function(x, y) {
          this.__stack.push(matrix().translate(x, y || 0));
          return this;
        };
        SvgPath.prototype.scale = function(sx, sy) {
          this.__stack.push(matrix().scale(sx, (!sy && (sy !== 0)) ? sx : sy));
          return this;
        };
        SvgPath.prototype.rotate = function(angle, rx, ry) {
          this.__stack.push(matrix().rotate(angle, rx || 0, ry || 0));
          return this;
        };
        SvgPath.prototype.skewX = function(degrees) {
          this.__stack.push(matrix().skewX(degrees));
          return this;
        };
        SvgPath.prototype.skewY = function(degrees) {
          this.__stack.push(matrix().skewY(degrees));
          return this;
        };
        SvgPath.prototype.matrix = function(m) {
          this.__stack.push(matrix().matrix(m));
          return this;
        };
        SvgPath.prototype.transform = function(transformString) {
          if (!transformString.trim()) {
            return this;
          }
          this.__stack.push(transformParse(transformString));
          return this;
        };
        SvgPath.prototype.round = function(d) {
          var contourStartDeltaX = 0,
              contourStartDeltaY = 0,
              deltaX = 0,
              deltaY = 0,
              l;
          d = d || 0;
          this.__evaluateStack();
          this.segments.forEach(function(s) {
            var isRelative = (s[0].toLowerCase() === s[0]);
            switch (s[0]) {
              case 'H':
              case 'h':
                if (isRelative) {
                  s[1] += deltaX;
                }
                deltaX = s[1] - s[1].toFixed(d);
                s[1] = +s[1].toFixed(d);
                return;
              case 'V':
              case 'v':
                if (isRelative) {
                  s[1] += deltaY;
                }
                deltaY = s[1] - s[1].toFixed(d);
                s[1] = +s[1].toFixed(d);
                return;
              case 'Z':
              case 'z':
                deltaX = contourStartDeltaX;
                deltaY = contourStartDeltaY;
                return;
              case 'M':
              case 'm':
                if (isRelative) {
                  s[1] += deltaX;
                  s[2] += deltaY;
                }
                deltaX = s[1] - s[1].toFixed(d);
                deltaY = s[2] - s[2].toFixed(d);
                contourStartDeltaX = deltaX;
                contourStartDeltaY = deltaY;
                s[1] = +s[1].toFixed(d);
                s[2] = +s[2].toFixed(d);
                return;
              case 'A':
              case 'a':
                if (isRelative) {
                  s[6] += deltaX;
                  s[7] += deltaY;
                }
                deltaX = s[6] - s[6].toFixed(d);
                deltaY = s[7] - s[7].toFixed(d);
                s[1] = +s[1].toFixed(d);
                s[2] = +s[2].toFixed(d);
                s[3] = +s[3].toFixed(d + 2);
                s[6] = +s[6].toFixed(d);
                s[7] = +s[7].toFixed(d);
                return;
              default:
                l = s.length;
                if (isRelative) {
                  s[l - 2] += deltaX;
                  s[l - 1] += deltaY;
                }
                deltaX = s[l - 2] - s[l - 2].toFixed(d);
                deltaY = s[l - 1] - s[l - 1].toFixed(d);
                s.forEach(function(val, i) {
                  if (!i) {
                    return;
                  }
                  s[i] = +s[i].toFixed(d);
                });
                return;
            }
          });
          return this;
        };
        SvgPath.prototype.iterate = function(iterator, keepLazyStack) {
          var segments = this.segments,
              replacements = {},
              needReplace = false,
              lastX = 0,
              lastY = 0,
              countourStartX = 0,
              countourStartY = 0;
          var i,
              j,
              newSegments;
          if (!keepLazyStack) {
            this.__evaluateStack();
          }
          segments.forEach(function(s, index) {
            var res = iterator(s, index, lastX, lastY);
            if (Array.isArray(res)) {
              replacements[index] = res;
              needReplace = true;
            }
            var isRelative = (s[0] === s[0].toLowerCase());
            switch (s[0]) {
              case 'm':
              case 'M':
                lastX = s[1] + (isRelative ? lastX : 0);
                lastY = s[2] + (isRelative ? lastY : 0);
                countourStartX = lastX;
                countourStartY = lastY;
                return;
              case 'h':
              case 'H':
                lastX = s[1] + (isRelative ? lastX : 0);
                return;
              case 'v':
              case 'V':
                lastY = s[1] + (isRelative ? lastY : 0);
                return;
              case 'z':
              case 'Z':
                lastX = countourStartX;
                lastY = countourStartY;
                return;
              default:
                lastX = s[s.length - 2] + (isRelative ? lastX : 0);
                lastY = s[s.length - 1] + (isRelative ? lastY : 0);
            }
          });
          if (!needReplace) {
            return this;
          }
          newSegments = [];
          for (i = 0; i < segments.length; i++) {
            if (typeof replacements[i] !== 'undefined') {
              for (j = 0; j < replacements[i].length; j++) {
                newSegments.push(replacements[i][j]);
              }
            } else {
              newSegments.push(segments[i]);
            }
          }
          this.segments = newSegments;
          return this;
        };
        SvgPath.prototype.abs = function() {
          this.iterate(function(s, index, x, y) {
            var name = s[0],
                nameUC = name.toUpperCase(),
                i;
            if (name === nameUC) {
              return;
            }
            s[0] = nameUC;
            switch (name) {
              case 'v':
                s[1] += y;
                return;
              case 'a':
                s[6] += x;
                s[7] += y;
                return;
              default:
                for (i = 1; i < s.length; i++) {
                  s[i] += i % 2 ? x : y;
                }
            }
          }, true);
          return this;
        };
        SvgPath.prototype.rel = function() {
          this.iterate(function(s, index, x, y) {
            var name = s[0],
                nameLC = name.toLowerCase(),
                i;
            if (name === nameLC) {
              return;
            }
            if (index === 0 && name === 'M') {
              return;
            }
            s[0] = nameLC;
            switch (name) {
              case 'V':
                s[1] -= y;
                return;
              case 'A':
                s[6] -= x;
                s[7] -= y;
                return;
              default:
                for (i = 1; i < s.length; i++) {
                  s[i] -= i % 2 ? x : y;
                }
            }
          }, true);
          return this;
        };
        SvgPath.prototype.unarc = function() {
          this.iterate(function(s, index, x, y) {
            var new_segments,
                nextX,
                nextY,
                result = [],
                name = s[0];
            if (name !== 'A' && name !== 'a') {
              return null;
            }
            if (name === 'a') {
              nextX = x + s[6];
              nextY = y + s[7];
            } else {
              nextX = s[6];
              nextY = s[7];
            }
            new_segments = a2c(x, y, nextX, nextY, s[4], s[5], s[1], s[2], s[3]);
            if (new_segments.length === 0) {
              return [[s[0] === 'a' ? 'l' : 'L', s[6], s[7]]];
            }
            new_segments.forEach(function(s) {
              result.push(['C', s[2], s[3], s[4], s[5], s[6], s[7]]);
            });
            return result;
          });
          return this;
        };
        SvgPath.prototype.unshort = function() {
          var segments = this.segments;
          var prevControlX,
              prevControlY,
              prevSegment;
          var curControlX,
              curControlY;
          this.iterate(function(s, idx, x, y) {
            var name = s[0],
                nameUC = name.toUpperCase(),
                isRelative;
            if (!idx) {
              return;
            }
            if (nameUC === 'T') {
              isRelative = (name === 't');
              prevSegment = segments[idx - 1];
              if (prevSegment[0] === 'Q') {
                prevControlX = prevSegment[1] - x;
                prevControlY = prevSegment[2] - y;
              } else if (prevSegment[0] === 'q') {
                prevControlX = prevSegment[1] - prevSegment[3];
                prevControlY = prevSegment[2] - prevSegment[4];
              } else {
                prevControlX = 0;
                prevControlY = 0;
              }
              curControlX = -prevControlX;
              curControlY = -prevControlY;
              if (!isRelative) {
                curControlX += x;
                curControlY += y;
              }
              segments[idx] = [isRelative ? 'q' : 'Q', curControlX, curControlY, s[1], s[2]];
            } else if (nameUC === 'S') {
              isRelative = (name === 's');
              prevSegment = segments[idx - 1];
              if (prevSegment[0] === 'C') {
                prevControlX = prevSegment[3] - x;
                prevControlY = prevSegment[4] - y;
              } else if (prevSegment[0] === 'c') {
                prevControlX = prevSegment[3] - prevSegment[5];
                prevControlY = prevSegment[4] - prevSegment[6];
              } else {
                prevControlX = 0;
                prevControlY = 0;
              }
              curControlX = -prevControlX;
              curControlY = -prevControlY;
              if (!isRelative) {
                curControlX += x;
                curControlY += y;
              }
              segments[idx] = [isRelative ? 'c' : 'C', curControlX, curControlY, s[1], s[2], s[3], s[4]];
            }
          });
          return this;
        };
        module.exports = SvgPath;
      }, {
        "./a2c": 2,
        "./ellipse": 3,
        "./matrix": 4,
        "./path_parse": 5,
        "./transform_parse": 7
      }],
      7: [function(require, module, exports) {
        'use strict';
        var Matrix = require('./matrix');
        var operations = {
          matrix: true,
          scale: true,
          rotate: true,
          translate: true,
          skewX: true,
          skewY: true
        };
        var CMD_SPLIT_RE = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/;
        var PARAMS_SPLIT_RE = /[\s,]+/;
        module.exports = function transformParse(transformString) {
          var matrix = new Matrix();
          var cmd,
              params;
          transformString.split(CMD_SPLIT_RE).forEach(function(item) {
            if (!item.length) {
              return;
            }
            if (typeof operations[item] !== 'undefined') {
              cmd = item;
              return;
            }
            params = item.split(PARAMS_SPLIT_RE).map(function(i) {
              return +i || 0;
            });
            switch (cmd) {
              case 'matrix':
                if (params.length === 6) {
                  matrix.matrix(params);
                }
                return;
              case 'scale':
                if (params.length === 1) {
                  matrix.scale(params[0], params[0]);
                } else if (params.length === 2) {
                  matrix.scale(params[0], params[1]);
                }
                return;
              case 'rotate':
                if (params.length === 1) {
                  matrix.rotate(params[0], 0, 0);
                } else if (params.length === 3) {
                  matrix.rotate(params[0], params[1], params[2]);
                }
                return;
              case 'translate':
                if (params.length === 1) {
                  matrix.translate(params[0], 0);
                } else if (params.length === 2) {
                  matrix.translate(params[0], params[1]);
                }
                return;
              case 'skewX':
                if (params.length === 1) {
                  matrix.skewX(params[0]);
                }
                return;
              case 'skewY':
                if (params.length === 1) {
                  matrix.skewY(params[0]);
                }
                return;
            }
          });
          return matrix;
        };
      }, {"./matrix": 4}],
      8: [function(require, module, exports) {
        (function(global) {
          function RGBColor(color_string) {
            this.ok = false;
            if (color_string.charAt(0) == '#') {
              color_string = color_string.substr(1, 6);
            }
            color_string = color_string.replace(/ /g, '');
            color_string = color_string.toLowerCase();
            var simple_colors = {
              aliceblue: 'f0f8ff',
              antiquewhite: 'faebd7',
              aqua: '00ffff',
              aquamarine: '7fffd4',
              azure: 'f0ffff',
              beige: 'f5f5dc',
              bisque: 'ffe4c4',
              black: '000000',
              blanchedalmond: 'ffebcd',
              blue: '0000ff',
              blueviolet: '8a2be2',
              brown: 'a52a2a',
              burlywood: 'deb887',
              cadetblue: '5f9ea0',
              chartreuse: '7fff00',
              chocolate: 'd2691e',
              coral: 'ff7f50',
              cornflowerblue: '6495ed',
              cornsilk: 'fff8dc',
              crimson: 'dc143c',
              cyan: '00ffff',
              darkblue: '00008b',
              darkcyan: '008b8b',
              darkgoldenrod: 'b8860b',
              darkgray: 'a9a9a9',
              darkgreen: '006400',
              darkkhaki: 'bdb76b',
              darkmagenta: '8b008b',
              darkolivegreen: '556b2f',
              darkorange: 'ff8c00',
              darkorchid: '9932cc',
              darkred: '8b0000',
              darksalmon: 'e9967a',
              darkseagreen: '8fbc8f',
              darkslateblue: '483d8b',
              darkslategray: '2f4f4f',
              darkturquoise: '00ced1',
              darkviolet: '9400d3',
              deeppink: 'ff1493',
              deepskyblue: '00bfff',
              dimgray: '696969',
              dodgerblue: '1e90ff',
              feldspar: 'd19275',
              firebrick: 'b22222',
              floralwhite: 'fffaf0',
              forestgreen: '228b22',
              fuchsia: 'ff00ff',
              gainsboro: 'dcdcdc',
              ghostwhite: 'f8f8ff',
              gold: 'ffd700',
              goldenrod: 'daa520',
              gray: '808080',
              green: '008000',
              greenyellow: 'adff2f',
              honeydew: 'f0fff0',
              hotpink: 'ff69b4',
              indianred: 'cd5c5c',
              indigo: '4b0082',
              ivory: 'fffff0',
              khaki: 'f0e68c',
              lavender: 'e6e6fa',
              lavenderblush: 'fff0f5',
              lawngreen: '7cfc00',
              lemonchiffon: 'fffacd',
              lightblue: 'add8e6',
              lightcoral: 'f08080',
              lightcyan: 'e0ffff',
              lightgoldenrodyellow: 'fafad2',
              lightgrey: 'd3d3d3',
              lightgreen: '90ee90',
              lightpink: 'ffb6c1',
              lightsalmon: 'ffa07a',
              lightseagreen: '20b2aa',
              lightskyblue: '87cefa',
              lightslateblue: '8470ff',
              lightslategray: '778899',
              lightsteelblue: 'b0c4de',
              lightyellow: 'ffffe0',
              lime: '00ff00',
              limegreen: '32cd32',
              linen: 'faf0e6',
              magenta: 'ff00ff',
              maroon: '800000',
              mediumaquamarine: '66cdaa',
              mediumblue: '0000cd',
              mediumorchid: 'ba55d3',
              mediumpurple: '9370d8',
              mediumseagreen: '3cb371',
              mediumslateblue: '7b68ee',
              mediumspringgreen: '00fa9a',
              mediumturquoise: '48d1cc',
              mediumvioletred: 'c71585',
              midnightblue: '191970',
              mintcream: 'f5fffa',
              mistyrose: 'ffe4e1',
              moccasin: 'ffe4b5',
              navajowhite: 'ffdead',
              navy: '000080',
              oldlace: 'fdf5e6',
              olive: '808000',
              olivedrab: '6b8e23',
              orange: 'ffa500',
              orangered: 'ff4500',
              orchid: 'da70d6',
              palegoldenrod: 'eee8aa',
              palegreen: '98fb98',
              paleturquoise: 'afeeee',
              palevioletred: 'd87093',
              papayawhip: 'ffefd5',
              peachpuff: 'ffdab9',
              peru: 'cd853f',
              pink: 'ffc0cb',
              plum: 'dda0dd',
              powderblue: 'b0e0e6',
              purple: '800080',
              red: 'ff0000',
              rosybrown: 'bc8f8f',
              royalblue: '4169e1',
              saddlebrown: '8b4513',
              salmon: 'fa8072',
              sandybrown: 'f4a460',
              seagreen: '2e8b57',
              seashell: 'fff5ee',
              sienna: 'a0522d',
              silver: 'c0c0c0',
              skyblue: '87ceeb',
              slateblue: '6a5acd',
              slategray: '708090',
              snow: 'fffafa',
              springgreen: '00ff7f',
              steelblue: '4682b4',
              tan: 'd2b48c',
              teal: '008080',
              thistle: 'd8bfd8',
              tomato: 'ff6347',
              turquoise: '40e0d0',
              violet: 'ee82ee',
              violetred: 'd02090',
              wheat: 'f5deb3',
              white: 'ffffff',
              whitesmoke: 'f5f5f5',
              yellow: 'ffff00',
              yellowgreen: '9acd32'
            };
            for (var key in simple_colors) {
              if (color_string == key) {
                color_string = simple_colors[key];
              }
            }
            var color_defs = [{
              re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
              example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
              process: function(bits) {
                return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])];
              }
            }, {
              re: /^(\w{2})(\w{2})(\w{2})$/,
              example: ['#00ff00', '336699'],
              process: function(bits) {
                return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)];
              }
            }, {
              re: /^(\w{1})(\w{1})(\w{1})$/,
              example: ['#fb0', 'f0f'],
              process: function(bits) {
                return [parseInt(bits[1] + bits[1], 16), parseInt(bits[2] + bits[2], 16), parseInt(bits[3] + bits[3], 16)];
              }
            }];
            for (var i = 0; i < color_defs.length; i++) {
              var re = color_defs[i].re;
              var processor = color_defs[i].process;
              var bits = re.exec(color_string);
              if (bits) {
                var channels = processor(bits);
                this.r = channels[0];
                this.g = channels[1];
                this.b = channels[2];
                this.ok = true;
              }
            }
            this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
            this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
            this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
            this.toRGB = function() {
              return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
            };
            this.toHex = function() {
              var r = this.r.toString(16);
              var g = this.g.toString(16);
              var b = this.b.toString(16);
              if (r.length == 1)
                r = '0' + r;
              if (g.length == 1)
                g = '0' + g;
              if (b.length == 1)
                b = '0' + b;
              return '#' + r + g + b;
            };
            this.getHelpXML = function() {
              var examples = new Array();
              for (var i = 0; i < color_defs.length; i++) {
                var example = color_defs[i].example;
                for (var j = 0; j < example.length; j++) {
                  examples[examples.length] = example[j];
                }
              }
              for (var sc in simple_colors) {
                examples[examples.length] = sc;
              }
              var xml = document.createElement('ul');
              xml.setAttribute('id', 'rgbcolor-examples');
              for (var i = 0; i < examples.length; i++) {
                try {
                  var list_item = document.createElement('li');
                  var list_color = new RGBColor(examples[i]);
                  var example_div = document.createElement('div');
                  example_div.style.cssText = 'margin: 3px; ' + 'border: 1px solid black; ' + 'background:' + list_color.toHex() + '; ' + 'color:' + list_color.toHex();
                  ;
                  example_div.appendChild(document.createTextNode('test'));
                  var list_item_value = document.createTextNode(' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex());
                  list_item.appendChild(example_div);
                  list_item.appendChild(list_item_value);
                  xml.appendChild(list_item);
                } catch (e) {}
              }
              return xml;
            };
          }
          if (typeof define === "function" && define.amd) {
            define(function() {
              return RGBColor;
            });
          } else if (typeof module !== "undefined" && module.exports) {
            module.exports = RGBColor;
          } else {
            global.RGBColor = RGBColor;
          }
          return RGBColor;
        })(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this);
      }, {}],
      9: [function(require, module, exports) {
        (function(global) {
          var RGBColor;
          var SvgPath;
          var _pdf;
          var cToQ = 2 / 3;
          var iriReference = /url\(#([^)]+)\)/;
          var getPathSegList = function(node) {
            var d = node.getAttribute("d");
            if (SvgPath) {
              d = SvgPath(d).unshort().unarc().abs().toString();
              node.setAttribute('d', d);
            }
            var pathSegList = node.pathSegList;
            if (pathSegList) {
              return pathSegList;
            }
            pathSegList = [];
            var regex = /([a-df-zA-DF-Z])([^a-df-zA-DF-Z]*)/g,
                match;
            while (match = regex.exec(d)) {
              var coords = parseFloats(match[2]);
              var type = match[1];
              var length = "zZ".indexOf(type) >= 0 ? 0 : "hHvV".indexOf(type) >= 0 ? 1 : "mMlLtT".indexOf(type) >= 0 ? 2 : "sSqQ".indexOf(type) >= 0 ? 4 : "aA".indexOf(type) >= 0 ? 7 : "cC".indexOf(type) >= 0 ? 6 : -1;
              var i = 0;
              do {
                var pathSeg = {pathSegTypeAsLetter: type};
                switch (type) {
                  case "h":
                  case "H":
                    pathSeg.x = coords[i];
                    break;
                  case "v":
                  case "V":
                    pathSeg.y = coords[i];
                    break;
                  case "c":
                  case "C":
                    pathSeg.x1 = coords[i + length - 6];
                    pathSeg.y1 = coords[i + length - 5];
                  case "s":
                  case "S":
                    pathSeg.x2 = coords[i + length - 4];
                    pathSeg.y2 = coords[i + length - 3];
                  case "t":
                  case "T":
                  case "l":
                  case "L":
                  case "m":
                  case "M":
                    pathSeg.x = coords[i + length - 2];
                    pathSeg.y = coords[i + length - 1];
                    break;
                  case "q":
                  case "Q":
                    pathSeg.x1 = coords[i];
                    pathSeg.y1 = coords[i + 1];
                    pathSeg.x = coords[i + 2];
                    pathSeg.y = coords[i + 3];
                    break;
                  case "a":
                  case "A":
                    throw new Error("Cannot convert Arcs without SvgPath package");
                }
                pathSegList.push(pathSeg);
                if (type === "m") {
                  type = "l";
                } else if (type === "M") {
                  type = "L";
                }
                i += length;
              } while (i < coords.length);
            }
            pathSegList.getItem = function(i) {
              return this[i];
            };
            pathSegList.numberOfItems = pathSegList.length;
            return pathSegList;
          };
          var getAttribute = function(node, propertyNode, propertyCss) {
            propertyCss = propertyCss || propertyNode;
            return node.getAttribute(propertyNode) || node.style[propertyCss];
          };
          var nodeIs = function(node, tagsString) {
            return tagsString.split(",").indexOf(node.tagName.toLowerCase()) >= 0;
          };
          var forEachChild = function(node, fn) {
            var children = [];
            for (var i = 0; i < node.childNodes.length; i++) {
              var childNode = node.childNodes[i];
              if (childNode.nodeName.charAt(0) !== "#")
                children.push(childNode);
            }
            for (i = 0; i < children.length; i++) {
              fn(i, children[i]);
            }
          };
          var getAngle = function(from, to) {
            return Math.atan2(to[1] - from[1], to[0] - from[0]);
          };
          function normalize(v) {
            var length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
            return [v[0] / length, v[1] / length];
          }
          function getDirectionVector(from, to) {
            var v = [to[0] - from[0], to[1] - from[1]];
            return normalize(v);
          }
          function addVectors(v1, v2) {
            return [v1[0] + v2[0], v1[1] + v2[1]];
          }
          var mirrorPoint = function(p1, p2) {
            var dx = p2[0] - p1[0];
            var dy = p2[1] - p1[1];
            return [p1[0] + 2 * dx, p1[1] + 2 * dy];
          };
          var toCubic = function(from, to) {
            return [cToQ * (to[0] - from[0]) + from[0], cToQ * (to[1] - from[1]) + from[1]];
          };
          var getControlPointFromPrevious = function(i, from, list, prevX, prevY) {
            var prev = list.getItem(i - 1);
            var p2;
            if (i > 0 && (prev.pathSegTypeAsLetter === "C" || prev.pathSegTypeAsLetter === "S")) {
              p2 = mirrorPoint([prev.x2, prev.y2], from);
            } else if (i > 0 && (prev.pathSegTypeAsLetter === "c" || prev.pathSegTypeAsLetter === "s")) {
              p2 = mirrorPoint([prev.x2 + prevX, prev.y2 + prevY], from);
            } else {
              p2 = [from[0], from[1]];
            }
            return p2;
          };
          var SvgPrefix = function(prefix) {
            this.prefix = prefix;
            this.id = 0;
            this.nextChild = function() {
              return new SvgPrefix("_" + this.id++ + "_" + this.get());
            };
            this.get = function() {
              return this.prefix;
            };
          };
          var AttributeState = function() {
            this.fillMode = "F";
            this.strokeMode = "";
            this.color = new RGBColor("rgb(0, 0, 0)");
            this.fill = new RGBColor("rgb(0, 0, 0)");
            this.fillOpacity = 1.0;
            this.fontFamily = "times";
            this.fontSize = 16;
            this.opacity = 1.0;
            this.stroke = null;
            this.strokeDasharray = null;
            this.strokeDashoffset = null;
            this.strokeLinecap = "butt";
            this.strokeLinejoin = "miter";
            this.strokeMiterlimit = 4.0;
            this.strokeOpacity = 1.0;
            this.strokeWidth = 1.0;
            this.textAnchor = "start";
            this.visibility = "visible";
          };
          AttributeState.prototype.clone = function() {
            var clone = new AttributeState();
            Object.getOwnPropertyNames(this).forEach(function(name) {
              clone[name] = this[name];
            }, this);
            return clone;
          };
          function MarkerList() {
            this.markers = [];
          }
          MarkerList.prototype.addMarker = function addMarker(marker) {
            this.markers.push(marker);
          };
          MarkerList.prototype.draw = function(tfMatrix, attributeState) {
            for (var i = 0; i < this.markers.length; i++) {
              var marker = this.markers[i];
              var tf;
              var angle = marker.angle,
                  anchor = marker.anchor;
              var cos = Math.cos(angle);
              var sin = Math.sin(angle);
              tf = new _pdf.Matrix(cos, sin, -sin, cos, anchor[0], anchor[1]);
              tf = _pdf.matrixMult(new _pdf.Matrix(attributeState.strokeWidth, 0, 0, attributeState.strokeWidth, 0, 0), tf);
              tf = _pdf.matrixMult(tf, tfMatrix);
              _pdf.saveGraphicsState();
              _pdf.setLineWidth(1.0);
              _pdf.doFormObject(marker.id, tf);
              _pdf.restoreGraphicsState();
            }
          };
          function Marker(id, anchor, angle) {
            this.id = id;
            this.anchor = anchor;
            this.angle = angle;
          }
          var getFromDefs = function(id, defs) {
            var regExp = /_\d+_/;
            while (!defs[id] && regExp.exec(id)) {
              id = id.replace(regExp, "");
            }
            return defs[id];
          };
          var removeNewlinesAndTrim = function(str) {
            return str.replace(/[\n\s\r]+/, " ").trim();
          };
          var cloneDefs = function(defs) {
            var clone = {};
            for (var key in defs) {
              if (defs.hasOwnProperty(key)) {
                clone[key] = defs[key];
              }
            }
            return clone;
          };
          function computeViewBoxTransform(node, bounds, eX, eY, eWidth, eHeight) {
            var vbX = bounds[0];
            var vbY = bounds[1];
            var vbWidth = bounds[2];
            var vbHeight = bounds[3];
            var scaleX = eWidth / vbWidth;
            var scaleY = eHeight / vbHeight;
            var align,
                meetOrSlice;
            var preserveAspectRatio = node.getAttribute("preserveAspectRatio");
            if (preserveAspectRatio) {
              var alignAndMeetOrSlice = preserveAspectRatio.split(" ");
              align = alignAndMeetOrSlice[0];
              meetOrSlice = alignAndMeetOrSlice[1] || "meet";
            } else {
              align = "xMidYMid";
              meetOrSlice = "meet";
            }
            if (align !== "none") {
              if (meetOrSlice === "meet") {
                scaleX = scaleY = Math.min(scaleX, scaleY);
              } else if (meetOrSlice === "slice") {
                scaleX = scaleY = Math.max(scaleX, scaleY);
              }
            }
            var translateX = eX - (vbX * scaleX);
            var translateY = eY - (vbY * scaleY);
            if (align.indexOf("xMid") >= 0) {
              translateX += (eWidth - vbWidth * scaleX) / 2;
            } else if (align.indexOf("xMax") >= 0) {
              translateX += eWidth - vbWidth * scaleX;
            }
            if (align.indexOf("yMid") >= 0) {
              translateY += (eHeight - vbHeight * scaleY) / 2;
            } else if (align.indexOf("yMax") >= 0) {
              translateY += (eHeight - vbHeight * scaleY);
            }
            var translate = new _pdf.Matrix(1, 0, 0, 1, translateX, translateY);
            var scale = new _pdf.Matrix(scaleX, 0, 0, scaleY, 0, 0);
            return _pdf.matrixMult(scale, translate);
          }
          var computeNodeTransform = function(node) {
            var viewBox,
                x,
                y;
            var nodeTransform = _pdf.unitMatrix;
            if (nodeIs(node, "svg,g")) {
              x = parseFloat(node.getAttribute("x")) || 0;
              y = parseFloat(node.getAttribute("y")) || 0;
              viewBox = node.getAttribute("viewBox");
              if (viewBox) {
                var width = parseFloat(node.getAttribute("width"));
                var height = parseFloat(node.getAttribute("height"));
                nodeTransform = computeViewBoxTransform(node, parseFloats(viewBox), x, y, width, height);
              } else {
                nodeTransform = new _pdf.Matrix(1, 0, 0, 1, x, y);
              }
            } else if (nodeIs(node, "marker")) {
              x = parseFloat(node.getAttribute("refX")) || 0;
              y = parseFloat(node.getAttribute("refY")) || 0;
              viewBox = node.getAttribute("viewBox");
              if (viewBox) {
                var bounds = parseFloats(viewBox);
                bounds[0] = bounds[1] = 0;
                nodeTransform = computeViewBoxTransform(node, bounds, 0, 0, node.getAttribute("markerWidth"), node.getAttribute("markerHeight"));
                nodeTransform = _pdf.matrixMult(new _pdf.Matrix(1, 0, 0, 1, -x, -y), nodeTransform);
              } else {
                nodeTransform = new _pdf.Matrix(1, 0, 0, 1, -x, -y);
              }
            }
            var transformString = node.getAttribute("transform");
            if (!transformString)
              return nodeTransform;
            else
              return _pdf.matrixMult(nodeTransform, parseTransform(transformString));
          };
          var parsePointsString = function(string) {
            var floats = parseFloats(string);
            var result = [];
            for (var i = 0; i < floats.length - 1; i += 2) {
              var x = floats[i];
              var y = floats[i + 1];
              result.push([x, y]);
            }
            return result;
          };
          var parseTransform = function(transformString) {
            if (!transformString)
              return _pdf.unitMatrix;
            var mRegex = /^\s*matrix\(([^\)]+)\)\s*/,
                tRegex = /^\s*translate\(([^\)]+)\)\s*/,
                rRegex = /^\s*rotate\(([^\)]+)\)\s*/,
                sRegex = /^\s*scale\(([^\)]+)\)\s*/,
                sXRegex = /^\s*skewX\(([^\)]+)\)\s*/,
                sYRegex = /^\s*skewY\(([^\)]+)\)\s*/;
            var resultMatrix = _pdf.unitMatrix,
                m;
            while (transformString.length > 0) {
              var match = mRegex.exec(transformString);
              if (match) {
                m = parseFloats(match[1]);
                resultMatrix = _pdf.matrixMult(new _pdf.Matrix(m[0], m[1], m[2], m[3], m[4], m[5]), resultMatrix);
                transformString = transformString.substr(match[0].length);
              }
              match = rRegex.exec(transformString);
              if (match) {
                m = parseFloats(match[1]);
                var a = Math.PI * m[0] / 180;
                resultMatrix = _pdf.matrixMult(new _pdf.Matrix(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0), resultMatrix);
                if (m[1] && m[2]) {
                  var t1 = new _pdf.Matrix(1, 0, 0, 1, m[1], m[2]);
                  var t2 = new _pdf.Matrix(1, 0, 0, 1, -m[1], -m[2]);
                  resultMatrix = _pdf.matrixMult(t2, _pdf.matrixMult(resultMatrix, t1));
                }
                transformString = transformString.substr(match[0].length);
              }
              match = tRegex.exec(transformString);
              if (match) {
                m = parseFloats(match[1]);
                resultMatrix = _pdf.matrixMult(new _pdf.Matrix(1, 0, 0, 1, m[0], m[1] || 0), resultMatrix);
                transformString = transformString.substr(match[0].length);
              }
              match = sRegex.exec(transformString);
              if (match) {
                m = parseFloats(match[1]);
                if (!m[1])
                  m[1] = m[0];
                resultMatrix = _pdf.matrixMult(new _pdf.Matrix(m[0], 0, 0, m[1], 0, 0), resultMatrix);
                transformString = transformString.substr(match[0].length);
              }
              match = sXRegex.exec(transformString);
              if (match) {
                m = parseFloat(match[1]);
                resultMatrix = _pdf.matrixMult(new _pdf.Matrix(1, 0, Math.tan(m), 1, 0, 0), resultMatrix);
                transformString = transformString.substr(match[0].length);
              }
              match = sYRegex.exec(transformString);
              if (match) {
                m = parseFloat(match[1]);
                resultMatrix = _pdf.matrixMult(new _pdf.Matrix(1, Math.tan(m), 0, 1, 0, 0), resultMatrix);
                transformString = transformString.substr(match[0].length);
              }
            }
            return resultMatrix;
          };
          var parseFloats = function(str) {
            var floats = [],
                match,
                regex = /[+-]?(?:(?:\d+\.?\d*)|(?:\d*\.?\d+))(?:[eE][+-]?\d+)?/g;
            while (match = regex.exec(str)) {
              floats.push(parseFloat(match[0]));
            }
            return floats;
          };
          var parseColor = function(colorString) {
            var match = /\s*rgba\(((?:[^,\)]*,){3}[^,\)]*)\)\s*/.exec(colorString);
            if (match) {
              var floats = parseFloats(match[1]);
              var color = new RGBColor("rgb(" + floats.slice(0, 3).join(",") + ")");
              color.a = floats[3];
              return color;
            } else {
              return new RGBColor(colorString);
            }
          };
          var multVecMatrix = function(vec, matrix) {
            var x = vec[0];
            var y = vec[1];
            return [matrix.a * x + matrix.c * y + matrix.e, matrix.b * x + matrix.d * y + matrix.f];
          };
          var getUntransformedBBox = function(node) {
            if (getAttribute(node, "display") === "none") {
              return [0, 0, 0, 0];
            }
            var i,
                minX,
                minY,
                maxX,
                maxY,
                viewBox,
                vb,
                boundingBox;
            var pf = parseFloat;
            if (nodeIs(node, "polygon")) {
              var points = parsePointsString(node.getAttribute("points"));
              minX = Number.POSITIVE_INFINITY;
              minY = Number.POSITIVE_INFINITY;
              maxX = Number.NEGATIVE_INFINITY;
              maxY = Number.NEGATIVE_INFINITY;
              for (i = 0; i < points.length; i++) {
                var point = points[i];
                minX = Math.min(minX, point[0]);
                maxX = Math.max(maxX, point[0]);
                minY = Math.min(minY, point[1]);
                maxY = Math.max(maxY, point[1]);
              }
              boundingBox = [minX, minY, maxX - minX, maxY - minY];
            } else if (nodeIs(node, "path")) {
              var list = getPathSegList(node);
              minX = Number.POSITIVE_INFINITY;
              minY = Number.POSITIVE_INFINITY;
              maxX = Number.NEGATIVE_INFINITY;
              maxY = Number.NEGATIVE_INFINITY;
              var x = 0,
                  y = 0;
              var prevX,
                  prevY,
                  newX,
                  newY;
              var p2,
                  p3,
                  to;
              for (i = 0; i < list.numberOfItems; i++) {
                var seg = list.getItem(i);
                var cmd = seg.pathSegTypeAsLetter;
                switch (cmd) {
                  case "H":
                    newX = seg.x;
                    newY = y;
                    break;
                  case "h":
                    newX = seg.x + x;
                    newY = y;
                    break;
                  case "V":
                    newX = x;
                    newY = seg.y;
                    break;
                  case "v":
                    newX = x;
                    newY = seg.y + y;
                    break;
                  case "C":
                    p2 = [seg.x1, seg.y1];
                    p3 = [seg.x2, seg.y2];
                    to = [seg.x, seg.y];
                    break;
                  case "c":
                    p2 = [seg.x1 + x, seg.y1 + y];
                    p3 = [seg.x2 + x, seg.y2 + y];
                    to = [seg.x + x, seg.y + y];
                    break;
                  case "S":
                    p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
                    p3 = [seg.x2, seg.y2];
                    to = [seg.x, seg.y];
                    break;
                  case "s":
                    p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
                    p3 = [seg.x2 + x, seg.y2 + y];
                    to = [seg.x + x, seg.y + y];
                    break;
                  case "Q":
                    pf = [seg.x1, seg.y1];
                    p2 = toCubic([x, y], pf);
                    p3 = toCubic([seg.x, seg.y], pf);
                    to = [seg.x, seg.y];
                    break;
                  case "q":
                    pf = [seg.x1 + x, seg.y1 + y];
                    p2 = toCubic([x, y], pf);
                    p3 = toCubic([x + seg.x, y + seg.y], pf);
                    to = [seg.x + x, seg.y + y];
                    break;
                  case "T":
                    p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
                    p2 = toCubic([x, y], pf);
                    p3 = toCubic([seg.x, seg.y], pf);
                    to = [seg.x, seg.y];
                    break;
                  case "t":
                    pf = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
                    p2 = toCubic([x, y], pf);
                    p3 = toCubic([x + seg.x, y + seg.y], pf);
                    to = [seg.x + x, seg.y + y];
                    break;
                }
                if ("sScCqQtT".indexOf(cmd) >= 0) {
                  prevX = x;
                  prevY = y;
                }
                if ("MLCSQT".indexOf(cmd) >= 0) {
                  x = seg.x;
                  y = seg.y;
                } else if ("mlcsqt".indexOf(cmd) >= 0) {
                  x = seg.x + x;
                  y = seg.y + y;
                } else if ("zZ".indexOf(cmd) < 0) {
                  x = newX;
                  y = newY;
                }
                if ("CSQTcsqt".indexOf(cmd) >= 0) {
                  minX = Math.min(minX, x, p2[0], p3[0], to[0]);
                  maxX = Math.max(maxX, x, p2[0], p3[0], to[0]);
                  minY = Math.min(minY, y, p2[1], p3[1], to[1]);
                  maxY = Math.max(maxY, y, p2[1], p3[1], to[1]);
                } else {
                  minX = Math.min(minX, x);
                  maxX = Math.max(maxX, x);
                  minY = Math.min(minY, y);
                  maxY = Math.max(maxY, y);
                }
              }
              boundingBox = [minX, minY, maxX - minX, maxY - minY];
            } else if (nodeIs(node, "svg")) {
              viewBox = node.getAttribute("viewBox");
              if (viewBox) {
                vb = parseFloats(viewBox);
              }
              return [pf(node.getAttribute("x")) || (vb && vb[0]) || 0, pf(node.getAttribute("y")) || (vb && vb[1]) || 0, pf(node.getAttribute("width")) || (vb && vb[2]) || 0, pf(node.getAttribute("height")) || (vb && vb[3]) || 0];
            } else if (nodeIs(node, "g")) {
              boundingBox = [0, 0, 0, 0];
              forEachChild(node, function(i, node) {
                var nodeBox = getUntransformedBBox(node);
                boundingBox = [Math.min(boundingBox[0], nodeBox[0]), Math.min(boundingBox[1], nodeBox[1]), Math.max(boundingBox[0] + boundingBox[2], nodeBox[0] + nodeBox[2]) - Math.min(boundingBox[0], nodeBox[0]), Math.max(boundingBox[1] + boundingBox[3], nodeBox[1] + nodeBox[3]) - Math.min(boundingBox[1], nodeBox[1])];
              });
            } else if (nodeIs(node, "marker")) {
              viewBox = node.getAttribute("viewBox");
              if (viewBox) {
                vb = parseFloats(viewBox);
              }
              return [(vb && vb[0]) || 0, (vb && vb[1]) || 0, (vb && vb[2]) || pf(node.getAttribute("marker-width")) || 0, (vb && vb[3]) || pf(node.getAttribute("marker-height")) || 0];
            } else if (nodeIs(node, "pattern")) {
              return [pf(node.getAttribute("x")) || 0, pf(node.getAttribute("y")) || 0, pf(node.getAttribute("width")) || 0, pf(node.getAttribute("height")) || 0];
            } else {
              var x1 = pf(node.getAttribute("x1")) || pf(node.getAttribute("x")) || pf((node.getAttribute("cx")) - pf(node.getAttribute("r"))) || 0;
              var x2 = pf(node.getAttribute("x2")) || (x1 + pf(node.getAttribute("width"))) || (pf(node.getAttribute("cx")) + pf(node.getAttribute("r"))) || 0;
              var y1 = pf(node.getAttribute("y1")) || pf(node.getAttribute("y")) || (pf(node.getAttribute("cy")) - pf(node.getAttribute("r"))) || 0;
              var y2 = pf(node.getAttribute("y2")) || (y1 + pf(node.getAttribute("height"))) || (pf(node.getAttribute("cy")) + pf(node.getAttribute("r"))) || 0;
              boundingBox = [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2) - Math.min(x1, x2), Math.max(y1, y2) - Math.min(y1, y2)];
            }
            if (!nodeIs(node, "marker,svg,g")) {
              var lineWidth = getAttribute(node, "stroke-width") || 1;
              var miterLimit = getAttribute(node, "stroke-miterlimit");
              miterLimit && (lineWidth *= 0.5 / (Math.sin(Math.PI / 12)));
              return [boundingBox[0] - lineWidth, boundingBox[1] - lineWidth, boundingBox[2] + 2 * lineWidth, boundingBox[3] + 2 * lineWidth];
            }
            return boundingBox;
          };
          var transformBBox = function(box, matrix) {
            var bl = multVecMatrix([box[0], box[1]], matrix);
            var br = multVecMatrix([box[0] + box[2], box[1]], matrix);
            var tl = multVecMatrix([box[0], box[1] + box[3]], matrix);
            var tr = multVecMatrix([box[0] + box[2], box[1] + box[3]], matrix);
            var bottom = Math.min(bl[1], br[1], tl[1], tr[1]);
            var left = Math.min(bl[0], br[0], tl[0], tr[0]);
            var top = Math.max(bl[1], br[1], tl[1], tr[1]);
            var right = Math.max(bl[0], br[0], tl[0], tr[0]);
            return [left, bottom, right - left, top - bottom];
          };
          var polygon = function(node, tfMatrix, colorMode, gradient, gradientMatrix, svgIdPrefix, attributeState) {
            var points = parsePointsString(node.getAttribute("points"));
            var lines = [{
              op: "m",
              c: multVecMatrix(points[0], tfMatrix)
            }];
            var i,
                angle;
            for (i = 1; i < points.length; i++) {
              var p = points[i];
              var to = multVecMatrix(p, tfMatrix);
              lines.push({
                op: "l",
                c: to
              });
            }
            lines.push({op: "h"});
            _pdf.path(lines, colorMode, gradient, gradientMatrix);
            var markerEnd = node.getAttribute("marker-end"),
                markerStart = node.getAttribute("marker-start"),
                markerMid = node.getAttribute("marker-mid");
            if (markerStart || markerMid || markerEnd) {
              var length = lines.length;
              var markers = new MarkerList();
              if (markerStart) {
                markerStart = svgIdPrefix.get() + iriReference.exec(markerStart)[1];
                angle = addVectors(getDirectionVector(lines[0].c, lines[1].c), getDirectionVector(lines[length - 2].c, lines[0].c));
                markers.addMarker(new Marker(markerStart, lines[0].c, Math.atan2(angle[1], angle[0])));
              }
              if (markerMid) {
                markerMid = svgIdPrefix.get() + iriReference.exec(markerMid)[1];
                var prevAngle = getDirectionVector(lines[0].c, lines[1].c),
                    curAngle;
                for (i = 1; i < lines.length - 2; i++) {
                  curAngle = getDirectionVector(lines[i].c, lines[i + 1].c);
                  angle = addVectors(prevAngle, curAngle);
                  markers.addMarker(new Marker(markerMid, lines[i].c, Math.atan2(angle[1], angle[0])));
                  prevAngle = curAngle;
                }
                curAngle = getDirectionVector(lines[length - 2].c, lines[0].c);
                angle = addVectors(prevAngle, curAngle);
                markers.addMarker(new Marker(markerMid, lines[length - 2].c, Math.atan2(angle[1], angle[0])));
              }
              if (markerEnd) {
                markerEnd = svgIdPrefix.get() + iriReference.exec(markerEnd)[1];
                angle = addVectors(getDirectionVector(lines[0].c, lines[1].c), getDirectionVector(lines[length - 2].c, lines[0].c));
                markers.addMarker(new Marker(markerEnd, lines[0].c, Math.atan2(angle[1], angle[0])));
              }
              markers.draw(_pdf.unitMatrix, attributeState);
            }
          };
          var image = function(node) {
            var imageUrl = node.getAttribute("xlink:href") || node.getAttribute("href");
            var image = new Image();
            image.src = imageUrl;
            var canvas = document.createElement("canvas");
            var width = parseFloat(node.getAttribute("width")),
                height = parseFloat(node.getAttribute("height")),
                x = parseFloat(node.getAttribute("x") || 0),
                y = parseFloat(node.getAttribute("y") || 0);
            canvas.width = width;
            canvas.height = height;
            var context = canvas.getContext("2d");
            context.fillStyle = "#fff";
            context.fillRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);
            try {
              var jpegUrl = canvas.toDataURL("image/jpeg");
              _pdf.addImage(jpegUrl, "jpeg", x, y, width, height);
            } catch (e) {
              (typeof console === "object" && console.warn && console.warn('svg2pdfjs: Images with external resource link are not supported! ("' + imageUrl + '")'));
            }
          };
          var path = function(node, tfMatrix, svgIdPrefix, colorMode, gradient, gradientMatrix, attributeState) {
            var list = getPathSegList(node);
            var markerEnd = node.getAttribute("marker-end"),
                markerStart = node.getAttribute("marker-start"),
                markerMid = node.getAttribute("marker-mid");
            markerEnd && (markerEnd = svgIdPrefix.get() + iriReference.exec(markerEnd)[1]);
            markerStart && (markerStart = svgIdPrefix.get() + iriReference.exec(markerStart)[1]);
            markerMid && (markerMid = svgIdPrefix.get() + iriReference.exec(markerMid)[1]);
            var getLinesFromPath = function(pathSegList, tfMatrix) {
              var x = 0,
                  y = 0;
              var x0 = x,
                  y0 = y;
              var prevX,
                  prevY,
                  newX,
                  newY;
              var to,
                  p,
                  p2,
                  p3;
              var lines = [];
              var markers = new MarkerList();
              var op;
              var prevAngle = [0, 0],
                  curAngle;
              for (var i = 0; i < list.numberOfItems; i++) {
                var seg = list.getItem(i);
                var cmd = seg.pathSegTypeAsLetter;
                switch (cmd) {
                  case "M":
                    x0 = x;
                    y0 = y;
                    to = [seg.x, seg.y];
                    op = "m";
                    break;
                  case "m":
                    x0 = x;
                    y0 = y;
                    to = [seg.x + x, seg.y + y];
                    op = "m";
                    break;
                  case "L":
                    to = [seg.x, seg.y];
                    op = "l";
                    break;
                  case "l":
                    to = [seg.x + x, seg.y + y];
                    op = "l";
                    break;
                  case "H":
                    to = [seg.x, y];
                    op = "l";
                    newX = seg.x;
                    newY = y;
                    break;
                  case "h":
                    to = [seg.x + x, y];
                    op = "l";
                    newX = seg.x + x;
                    newY = y;
                    break;
                  case "V":
                    to = [x, seg.y];
                    op = "l";
                    newX = x;
                    newY = seg.y;
                    break;
                  case "v":
                    to = [x, seg.y + y];
                    op = "l";
                    newX = x;
                    newY = seg.y + y;
                    break;
                  case "C":
                    p2 = [seg.x1, seg.y1];
                    p3 = [seg.x2, seg.y2];
                    to = [seg.x, seg.y];
                    break;
                  case "c":
                    p2 = [seg.x1 + x, seg.y1 + y];
                    p3 = [seg.x2 + x, seg.y2 + y];
                    to = [seg.x + x, seg.y + y];
                    break;
                  case "S":
                    p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
                    p3 = [seg.x2, seg.y2];
                    to = [seg.x, seg.y];
                    break;
                  case "s":
                    p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
                    p3 = [seg.x2 + x, seg.y2 + y];
                    to = [seg.x + x, seg.y + y];
                    break;
                  case "Q":
                    p = [seg.x1, seg.y1];
                    p2 = toCubic([x, y], p);
                    p3 = toCubic([seg.x, seg.y], p);
                    to = [seg.x, seg.y];
                    break;
                  case "q":
                    p = [seg.x1 + x, seg.y1 + y];
                    p2 = toCubic([x, y], p);
                    p3 = toCubic([x + seg.x, y + seg.y], p);
                    to = [seg.x + x, seg.y + y];
                    break;
                  case "T":
                    p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
                    p2 = toCubic([x, y], p);
                    p3 = toCubic([seg.x, seg.y], p);
                    to = [seg.x, seg.y];
                    break;
                  case "t":
                    p = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
                    p2 = toCubic([x, y], p);
                    p3 = toCubic([x + seg.x, y + seg.y], p);
                    to = [seg.x + x, seg.y + y];
                    break;
                  case "Z":
                  case "z":
                    x = x0;
                    y = y0;
                    lines.push({op: "h"});
                    break;
                }
                var hasStartMarker = markerStart && (i === 1 || ("mM".indexOf(cmd) < 0 && "mM".indexOf(list.getItem(i - 1).pathSegTypeAsLetter) >= 0));
                var hasEndMarker = markerEnd && (i === list.numberOfItems - 1 || ("mM".indexOf(cmd) < 0 && "mM".indexOf(list.getItem(i + 1).pathSegTypeAsLetter) >= 0));
                var hasMidMarker = markerMid && i > 0 && !(i === 1 && "mM".indexOf(list.getItem(i - 1).pathSegTypeAsLetter) >= 0);
                if ("sScCqQtT".indexOf(cmd) >= 0) {
                  hasStartMarker && markers.addMarker(new Marker(markerStart, [x, y], getAngle([x, y], p2)));
                  hasEndMarker && markers.addMarker(new Marker(markerEnd, to, getAngle(p3, to)));
                  if (hasMidMarker) {
                    curAngle = getDirectionVector([x, y], p2);
                    curAngle = "mM".indexOf(list.getItem(i - 1).pathSegTypeAsLetter) >= 0 ? curAngle : normalize(addVectors(prevAngle, curAngle));
                    markers.addMarker(new Marker(markerMid, [x, y], Math.atan2(curAngle[1], curAngle[0])));
                  }
                  prevAngle = getDirectionVector(p3, to);
                  prevX = x;
                  prevY = y;
                  p2 = multVecMatrix(p2, tfMatrix);
                  p3 = multVecMatrix(p3, tfMatrix);
                  p = multVecMatrix(to, tfMatrix);
                  lines.push({
                    op: "c",
                    c: [p2[0], p2[1], p3[0], p3[1], p[0], p[1]]
                  });
                } else if ("lLhHvVmM".indexOf(cmd) >= 0) {
                  curAngle = getDirectionVector([x, y], to);
                  hasStartMarker && markers.addMarker(new Marker(markerStart, [x, y], Math.atan2(curAngle[1], curAngle[0])));
                  hasEndMarker && markers.addMarker(new Marker(markerEnd, to, Math.atan2(curAngle[1], curAngle[0])));
                  if (hasMidMarker) {
                    var angle = "mM".indexOf(cmd) >= 0 ? prevAngle : "mM".indexOf(list.getItem(i - 1).pathSegTypeAsLetter) >= 0 ? curAngle : normalize(addVectors(prevAngle, curAngle));
                    markers.addMarker(new Marker(markerMid, [x, y], Math.atan2(angle[1], angle[0])));
                  }
                  prevAngle = curAngle;
                  p = multVecMatrix(to, tfMatrix);
                  lines.push({
                    op: op,
                    c: p
                  });
                }
                if ("MLCSQT".indexOf(cmd) >= 0) {
                  x = seg.x;
                  y = seg.y;
                } else if ("mlcsqt".indexOf(cmd) >= 0) {
                  x = seg.x + x;
                  y = seg.y + y;
                } else if ("zZ".indexOf(cmd) < 0) {
                  x = newX;
                  y = newY;
                }
              }
              return {
                lines: lines,
                markers: markers
              };
            };
            var lines = getLinesFromPath(list, tfMatrix);
            if (lines.lines.length > 0) {
              _pdf.path(lines.lines, colorMode, gradient, gradientMatrix);
            }
            if (markerEnd || markerStart || markerMid) {
              lines.markers.draw(tfMatrix, attributeState);
            }
          };
          var use = function(node, tfMatrix, svgIdPrefix) {
            var url = (node.getAttribute("href") || node.getAttribute("xlink:href"));
            if (!url)
              return;
            var formObject = _pdf.getFormObject(svgIdPrefix.get() + url.substring(1));
            var x = node.getAttribute("x") || 0;
            var y = node.getAttribute("y") || 0;
            var width = node.getAttribute("width") || formObject.width;
            var height = node.getAttribute("height") || formObject.height;
            var t = new _pdf.Matrix(width / formObject.width || 0, 0, 0, height / formObject.height || 0, x, y);
            t = _pdf.matrixMult(t, tfMatrix);
            _pdf.doFormObject(svgIdPrefix.get() + url.substring(1), t);
          };
          var line = function(node, tfMatrix, svgIdPrefix, attributeState) {
            var p1 = multVecMatrix([parseFloat(node.getAttribute('x1')), parseFloat(node.getAttribute('y1'))], tfMatrix);
            var p2 = multVecMatrix([parseFloat(node.getAttribute('x2')), parseFloat(node.getAttribute('y2'))], tfMatrix);
            if (attributeState.strokeMode === "D") {
              _pdf.line(p1[0], p1[1], p2[0], p2[1]);
            }
            var markerStart = node.getAttribute("marker-start"),
                markerEnd = node.getAttribute("marker-end");
            if (markerStart || markerEnd) {
              var markers = new MarkerList();
              var angle = getAngle(p1, p2);
              if (markerStart) {
                markers.addMarker(new Marker(svgIdPrefix.get() + iriReference.exec(markerStart)[1], p1, angle));
              }
              if (markerEnd) {
                markers.addMarker(new Marker(svgIdPrefix.get() + iriReference.exec(markerEnd)[1], p2, angle));
              }
              markers.draw(_pdf.unitMatrix, attributeState);
            }
          };
          var rect = function(node, colorMode, gradient, gradientMatrix) {
            _pdf.roundedRect(parseFloat(node.getAttribute('x')) || 0, parseFloat(node.getAttribute('y')) || 0, parseFloat(node.getAttribute('width')), parseFloat(node.getAttribute('height')), parseFloat(node.getAttribute('rx')) || 0, parseFloat(node.getAttribute('ry')) || 0, colorMode, gradient, gradientMatrix);
          };
          var ellipse = function(node, colorMode, gradient, gradientMatrix) {
            _pdf.ellipse(parseFloat(node.getAttribute('cx')) || 0, parseFloat(node.getAttribute('cy')) || 0, parseFloat(node.getAttribute('rx')), parseFloat(node.getAttribute('ry')), colorMode, gradient, gradientMatrix);
          };
          var circle = function(node, colorMode, gradient, gradientMatrix) {
            var radius = parseFloat(node.getAttribute('r')) || 0;
            _pdf.ellipse(parseFloat(node.getAttribute('cx')) || 0, parseFloat(node.getAttribute('cy')) || 0, radius, radius, colorMode, gradient, gradientMatrix);
          };
          var transformText = function(node, text) {
            var textTransform = getAttribute(node, "text-transform");
            switch (textTransform) {
              case "uppercase":
                return text.toUpperCase();
              case "lowercase":
                return text.toLowerCase();
              default:
                return text;
            }
          };
          var text = function(node, tfMatrix, hasFillColor, fillRGB, attributeState) {
            _pdf.saveGraphicsState();
            setTextProperties(node, fillRGB);
            var getTextOffset = function(textAnchor, width) {
              var xOffset = 0;
              switch (textAnchor) {
                case 'end':
                  xOffset = width;
                  break;
                case 'middle':
                  xOffset = width / 2;
                  break;
                case 'start':
                  break;
              }
              return xOffset;
            };
            var toPixels = function(value, pdfFontSize) {
              var match;
              match = value && value.toString().match(/^([\-0-9.]+)em$/);
              if (match) {
                return parseFloat(match[1]) * pdfFontSize;
              }
              match = value && value.toString().match(/^([\-0-9.]+)(px|)$/);
              if (match) {
                return parseFloat(match[1]);
              }
              return 0;
            };
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.appendChild(node);
            svg.setAttribute("visibility", "hidden");
            document.body.appendChild(svg);
            var box = node.getBBox();
            var x,
                y,
                xOffset = 0;
            var textAnchor = getAttribute(node, "text-anchor");
            if (textAnchor) {
              xOffset = getTextOffset(textAnchor, box.width);
            }
            var pdfFontSize = _pdf.getFontSize();
            var textX = toPixels(node.getAttribute('x'), pdfFontSize);
            var textY = toPixels(node.getAttribute('y'), pdfFontSize);
            var m = _pdf.matrixMult(new _pdf.Matrix(1, 0, 0, 1, textX, textY), tfMatrix);
            x = toPixels(node.getAttribute("dx"), pdfFontSize);
            y = toPixels(node.getAttribute("dy"), pdfFontSize);
            var visibility = getAttribute(node, "visibility") || attributeState.visibility;
            if (node.childElementCount === 0) {
              if (visibility === "visible") {
                _pdf.text((x - xOffset), y, transformText(node, removeNewlinesAndTrim(node.textContent)), void 0, m);
              }
            } else {
              forEachChild(node, function(i, tSpan) {
                if (!tSpan.textContent || nodeIs(tSpan, 'title,desc,metadata')) {
                  return;
                }
                _pdf.saveGraphicsState();
                var tSpanColor = getAttribute(tSpan, "fill");
                setTextProperties(tSpan, tSpanColor && new RGBColor(tSpanColor));
                var extent = tSpan.getExtentOfChar(0);
                var tSpanVisibility = getAttribute(tSpan, "visibility") || visibility;
                if (tSpanVisibility === "visible") {
                  _pdf.text(extent.x - textX, extent.y + extent.height * 0.7 - textY, transformText(node, removeNewlinesAndTrim(tSpan.textContent)), void 0, m);
                }
                _pdf.restoreGraphicsState();
              });
            }
            document.body.removeChild(svg);
            _pdf.restoreGraphicsState();
          };
          var findAndRenderDefs = function(node, tfMatrix, defs, svgIdPrefix, withinDefs, attributeState) {
            forEachChild(node, function(i, child) {
              if (child.tagName.toLowerCase() === "defs") {
                renderNode(child, tfMatrix, defs, svgIdPrefix, withinDefs, attributeState);
                child.parentNode.removeChild(child);
              }
            });
          };
          var svg = function(node, tfMatrix, defs, svgIdPrefix, withinDefs, attributeState) {
            var newSvgIdPrefix = svgIdPrefix.nextChild();
            var newDefs = cloneDefs(defs);
            findAndRenderDefs(node, tfMatrix, newDefs, newSvgIdPrefix, withinDefs, attributeState);
            renderChildren(node, tfMatrix, newDefs, newSvgIdPrefix, withinDefs, attributeState);
          };
          var renderChildren = function(node, tfMatrix, defs, svgIdPrefix, withinDefs, attributeState) {
            forEachChild(node, function(i, node) {
              renderNode(node, tfMatrix, defs, svgIdPrefix, withinDefs, attributeState);
            });
          };
          var putGradient = function(node, type, coords, defs, svgIdPrefix) {
            var colors = [];
            var opacitySum = 0;
            var hasOpacity = false;
            var gState;
            forEachChild(node, function(i, element) {
              if (element.tagName.toLowerCase() === "stop") {
                var color = new RGBColor(getAttribute(element, "stop-color"));
                colors.push({
                  offset: parseFloat(element.getAttribute("offset")),
                  color: [color.r, color.g, color.b]
                });
                var opacity = getAttribute(element, "stop-opacity");
                if (opacity && opacity != 1) {
                  opacitySum += parseFloat(opacity);
                  hasOpacity = true;
                }
              }
            });
            if (hasOpacity) {
              gState = new _pdf.GState({opacity: opacitySum / coords.length});
            }
            var pattern = new _pdf.ShadingPattern(type, coords, colors, gState);
            var id = svgIdPrefix.get() + node.getAttribute("id");
            _pdf.addShadingPattern(id, pattern);
            defs[id] = node;
          };
          var pattern = function(node, defs, svgIdPrefix, attributeState) {
            var id = svgIdPrefix.get() + node.getAttribute("id");
            defs[id] = node;
            var bBox = getUntransformedBBox(node);
            var pattern = new _pdf.TilingPattern([bBox[0], bBox[1], bBox[0] + bBox[2], bBox[1] + bBox[3]], bBox[2], bBox[3], null, computeNodeTransform(node));
            _pdf.beginTilingPattern(pattern);
            renderChildren(node, _pdf.unitMatrix, defs, svgIdPrefix, false, attributeState);
            _pdf.endTilingPattern(id, pattern);
          };
          function setTextProperties(node, fillRGB) {
            var fontFamily = getAttribute(node, "font-family");
            if (fontFamily) {
              _pdf.setFont(fontFamily);
            }
            if (fillRGB && fillRGB.ok) {
              _pdf.setTextColor(fillRGB.r, fillRGB.g, fillRGB.b);
            }
            var fontType;
            var fontWeight = getAttribute(node, "font-weight");
            if (fontWeight) {
              if (fontWeight === "bold") {
                fontType = "bold";
              }
            }
            var fontStyle = getAttribute(node, "font-style");
            if (fontStyle) {
              if (fontStyle === "italic") {
                fontType += "italic";
              }
            }
            _pdf.setFontType(fontType);
            var pdfFontSize = 16;
            var fontSize = getAttribute(node, "font-size");
            if (fontSize) {
              pdfFontSize = parseFloat(fontSize);
              _pdf.setFontSize(pdfFontSize);
            }
          }
          var renderNode = function(node, contextTransform, defs, svgIdPrefix, withinDefs, attributeState) {
            attributeState = attributeState.clone();
            if (getAttribute(node, "display") === "none") {
              return;
            }
            var visibility = attributeState.visibility = getAttribute(node, "visibility") || attributeState.visibility;
            if (visibility === "hidden" && !nodeIs(node, "svg,g,marker,a,pattern,defs,text")) {
              return;
            }
            var tfMatrix,
                hasFillColor = false,
                fillRGB = null,
                fillMode = "inherit",
                strokeMode = "inherit",
                fillUrl = null,
                fillData = null,
                bBox;
            var targetIsFormObject = withinDefs && !nodeIs(node, "lineargradient,radialgradient,pattern");
            if (targetIsFormObject) {
              tfMatrix = computeNodeTransform(node);
              bBox = getUntransformedBBox(node);
              _pdf.beginFormObject(bBox[0], bBox[1], bBox[2], bBox[3], tfMatrix);
              tfMatrix = _pdf.unitMatrix;
              withinDefs = false;
            } else {
              tfMatrix = _pdf.matrixMult(computeNodeTransform(node), contextTransform);
              _pdf.saveGraphicsState();
            }
            if (nodeIs(node, "g,path,rect,text,ellipse,line,circle,polygon")) {
              function setDefaultColor() {
                fillRGB = new RGBColor("rgb(0, 0, 0)");
                hasFillColor = true;
                fillMode = "F";
              }
              var fillColor = getAttribute(node, "fill");
              if (fillColor) {
                var url = iriReference.exec(fillColor);
                if (url) {
                  fillUrl = svgIdPrefix.get() + url[1];
                  var fill = getFromDefs(fillUrl, defs);
                  if (fill && nodeIs(fill, "lineargradient,radialgradient")) {
                    var gradientUnitsMatrix = tfMatrix;
                    if (!fill.hasAttribute("gradientUnits") || fill.getAttribute("gradientUnits").toLowerCase() === "objectboundingbox") {
                      bBox || (bBox = getUntransformedBBox(node));
                      gradientUnitsMatrix = new _pdf.Matrix(bBox[2], 0, 0, bBox[3], bBox[0], bBox[1]);
                      var nodeTransform = computeNodeTransform(node);
                      gradientUnitsMatrix = _pdf.matrixMult(gradientUnitsMatrix, nodeTransform);
                    }
                    var gradientTransform = parseTransform(fill.getAttribute("gradientTransform"));
                    fillData = _pdf.matrixMult(gradientTransform, gradientUnitsMatrix);
                    fillMode = "";
                  } else if (fill && nodeIs(fill, "pattern")) {
                    var fillBBox,
                        y,
                        width,
                        height,
                        x;
                    fillData = {};
                    var patternUnitsMatrix = _pdf.unitMatrix;
                    if (!fill.hasAttribute("patternUnits") || fill.getAttribute("patternUnits").toLowerCase() === "objectboundingbox") {
                      bBox || (bBox = getUntransformedBBox(node));
                      patternUnitsMatrix = new _pdf.Matrix(1, 0, 0, 1, bBox[0], bBox[1]);
                      fillBBox = getUntransformedBBox(fill);
                      x = fillBBox[0] * bBox[0];
                      y = fillBBox[1] * bBox[1];
                      width = fillBBox[2] * bBox[2];
                      height = fillBBox[3] * bBox[3];
                      fillData.boundingBox = [x, y, x + width, y + height];
                      fillData.xStep = width;
                      fillData.yStep = height;
                    }
                    var patternContentUnitsMatrix = _pdf.unitMatrix;
                    if (fill.hasAttribute("patternContentUnits") && fill.getAttribute("patternContentUnits").toLowerCase() === "objectboundingbox") {
                      bBox || (bBox = getUntransformedBBox(node));
                      patternContentUnitsMatrix = new _pdf.Matrix(bBox[2], 0, 0, bBox[3], 0, 0);
                      fillBBox = fillData.boundingBox || getUntransformedBBox(fill);
                      x = fillBBox[0] / bBox[0];
                      y = fillBBox[1] / bBox[1];
                      width = fillBBox[2] / bBox[2];
                      height = fillBBox[3] / bBox[3];
                      fillData.boundingBox = [x, y, x + width, y + height];
                      fillData.xStep = width;
                      fillData.yStep = height;
                    }
                    fillData.matrix = _pdf.matrixMult(_pdf.matrixMult(patternContentUnitsMatrix, patternUnitsMatrix), tfMatrix);
                    fillMode = "F";
                  } else {
                    fillUrl = fill = null;
                    setDefaultColor();
                  }
                } else {
                  fillRGB = parseColor(fillColor);
                  if (fillRGB.ok) {
                    hasFillColor = true;
                    fillMode = "F";
                  } else {
                    fillMode = "";
                  }
                }
              }
              var opacity = 1.0;
              var nodeOpacity = getAttribute(node, "opacity") || getAttribute(node, "fill-opacity") || getAttribute(node, "stroke-opacity");
              if (nodeOpacity) {
                opacity *= parseFloat(nodeOpacity);
              }
              if (fillRGB && typeof fillRGB.a === "number") {
                opacity *= fillRGB.a;
              }
              _pdf.setGState(new _pdf.GState({opacity: opacity}));
            }
            if (nodeIs(node, "g,path,rect,ellipse,line,circle,polygon")) {
              if (hasFillColor) {
                attributeState.fill = fillRGB;
                _pdf.setFillColor(fillRGB.r, fillRGB.g, fillRGB.b);
              }
              var strokeColor = getAttribute(node, "stroke");
              if (strokeColor) {
                var strokeWidth = getAttribute(node, "stroke-width");
                if (strokeWidth !== void 0 && strokeWidth !== "") {
                  strokeWidth = Math.abs(parseFloat(strokeWidth));
                  attributeState.strokeWidth = strokeWidth;
                  _pdf.setLineWidth(strokeWidth);
                }
                var strokeRGB = new RGBColor(strokeColor);
                if (strokeRGB.ok) {
                  attributeState.color = strokeRGB;
                  _pdf.setDrawColor(strokeRGB.r, strokeRGB.g, strokeRGB.b);
                  if (strokeWidth !== 0) {
                    strokeMode = "D";
                  } else {
                    strokeMode = "";
                  }
                }
                var lineCap = getAttribute(node, "stroke-linecap");
                if (lineCap) {
                  _pdf.setLineCap(attributeState.strokeLinecap = lineCap);
                }
                var lineJoin = getAttribute(node, "stroke-linejoin");
                if (lineJoin) {
                  _pdf.setLineJoin(attributeState.strokeLinejoin = lineJoin);
                }
                var dashArray = getAttribute(node, "stroke-dasharray");
                if (dashArray) {
                  dashArray = parseFloats(dashArray);
                  var dashOffset = parseInt(getAttribute(node, "stroke-dashoffset")) || 0;
                  attributeState.strokeDasharray = dashArray;
                  attributeState.strokeDashoffset = dashOffset;
                  _pdf.setLineDashPattern(dashArray, dashOffset);
                }
                var miterLimit = getAttribute(node, "stroke-miterlimit");
                if (miterLimit !== void 0 && miterLimit !== "") {
                  _pdf.setLineMiterLimit(attributeState.strokeMiterlimit = parseFloat(miterLimit));
                }
              }
            }
            fillMode = attributeState.fillMode = fillMode === "inherit" ? attributeState.fillMode : fillMode;
            strokeMode = attributeState.strokeMode = strokeMode === "inherit" ? attributeState.strokeMode : strokeMode;
            var colorMode = fillMode + strokeMode;
            setTextProperties(node, fillRGB);
            switch (node.tagName.toLowerCase()) {
              case 'svg':
                svg(node, tfMatrix, defs, svgIdPrefix, withinDefs, attributeState);
                break;
              case 'g':
                findAndRenderDefs(node, tfMatrix, defs, svgIdPrefix, withinDefs, attributeState);
              case 'a':
              case "marker":
                renderChildren(node, tfMatrix, defs, svgIdPrefix, withinDefs, attributeState);
                break;
              case 'defs':
                renderChildren(node, tfMatrix, defs, svgIdPrefix, true, attributeState);
                break;
              case 'use':
                use(node, tfMatrix, svgIdPrefix);
                break;
              case 'line':
                line(node, tfMatrix, svgIdPrefix, attributeState);
                break;
              case 'rect':
                _pdf.setCurrentTransformationMatrix(tfMatrix);
                rect(node, colorMode, fillUrl, fillData);
                break;
              case 'ellipse':
                _pdf.setCurrentTransformationMatrix(tfMatrix);
                ellipse(node, colorMode, fillUrl, fillData);
                break;
              case 'circle':
                _pdf.setCurrentTransformationMatrix(tfMatrix);
                circle(node, colorMode, fillUrl, fillData);
                break;
              case 'text':
                text(node, tfMatrix, hasFillColor, fillRGB, attributeState);
                break;
              case 'path':
                path(node, tfMatrix, svgIdPrefix, colorMode, fillUrl, fillData, attributeState);
                break;
              case 'polygon':
                polygon(node, tfMatrix, colorMode, fillUrl, fillData, svgIdPrefix, attributeState);
                break;
              case 'image':
                _pdf.setCurrentTransformationMatrix(tfMatrix);
                image(node);
                break;
              case "lineargradient":
                putGradient(node, "axial", [node.getAttribute("x1"), node.getAttribute("y1"), node.getAttribute("x2"), node.getAttribute("y2")], defs, svgIdPrefix);
                break;
              case "radialgradient":
                putGradient(node, "radial", [node.getAttribute("fx") || node.getAttribute("cx"), node.getAttribute("fy") || node.getAttribute("cy"), 0, node.getAttribute("cx") || 0, node.getAttribute("cy") || 0, node.getAttribute("r") || 0], defs, svgIdPrefix);
                break;
              case "pattern":
                pattern(node, defs, svgIdPrefix, attributeState);
                break;
            }
            if (targetIsFormObject) {
              _pdf.endFormObject(svgIdPrefix.get() + node.getAttribute("id"));
            } else {
              _pdf.restoreGraphicsState();
            }
          };
          var svg2pdf = function(element, pdf, options) {
            _pdf = pdf;
            var k = options.scale || 1.0,
                xOffset = options.xOffset || 0.0,
                yOffset = options.yOffset || 0.0;
            _pdf.saveGraphicsState();
            _pdf.setCurrentTransformationMatrix(new _pdf.Matrix(k, 0, 0, k, xOffset, yOffset));
            var attributeState = new AttributeState();
            _pdf.setLineWidth(attributeState.strokeWidth);
            var fill = attributeState.fill;
            _pdf.setFillColor(fill.r, fill.g, fill.b);
            _pdf.setFont(attributeState.fontFamily);
            _pdf.setFontSize(attributeState.fontSize);
            renderNode(element.cloneNode(true), _pdf.unitMatrix, {}, new SvgPrefix(""), false, attributeState);
            _pdf.restoreGraphicsState();
            return _pdf;
          };
          if (typeof define === "function" && define.amd) {
            define(["./rgbcolor", "SvgPath"], function(rgbcolor, svgpath) {
              RGBColor = rgbcolor;
              SvgPath = svgpath;
              return svg2pdf;
            });
          } else if (typeof module !== "undefined" && module.exports) {
            RGBColor = require('./rgbcolor');
            SvgPath = require('SvgPath');
            module.exports = svg2pdf;
          } else {
            SvgPath = global.SvgPath;
            RGBColor = global.RGBColor;
            global.svg2pdf = svg2pdf;
            global.svgElementToPdf = svg2pdf;
          }
          return svg2pdf;
        }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this));
      }, {
        "./rgbcolor.js": 8,
        "SvgPath": 1
      }]
    }, {}, [9])(9);
  });
})(require('process'));
