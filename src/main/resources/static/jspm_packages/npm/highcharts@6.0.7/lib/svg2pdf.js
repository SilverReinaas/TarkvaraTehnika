/* */ 
"format cjs";
(function(process) {
  !function(t) {
    if ("object" == typeof exports && "undefined" != typeof module)
      module.exports = t();
    else if ("function" == typeof define && define.amd)
      define([], t);
    else {
      var e;
      e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, e.svg2pdf = t();
    }
  }(function() {
    var t;
    return function t(e, r, a) {
      function i(s, o) {
        if (!r[s]) {
          if (!e[s]) {
            var c = "function" == typeof require && require;
            if (!o && c)
              return c(s, !0);
            if (n)
              return n(s, !0);
            var h = new Error("Cannot find module '" + s + "'");
            throw h.code = "MODULE_NOT_FOUND", h;
          }
          var u = r[s] = {exports: {}};
          e[s][0].call(u.exports, function(t) {
            var r = e[s][1][t];
            return i(r || t);
          }, u, u.exports, t, e, r, a);
        }
        return r[s].exports;
      }
      for (var n = "function" == typeof require && require,
          s = 0; s < a.length; s++)
        i(a[s]);
      return i;
    }({
      1: [function(t, e, r) {
        "use strict";
        e.exports = t("./lib/svgpath");
      }, {"./lib/svgpath": 6}],
      2: [function(t, e, r) {
        "use strict";
        function a(t, e, r, a) {
          var i = t * a - e * r < 0 ? -1 : 1,
              n = Math.sqrt(t * t + e * e),
              s = Math.sqrt(t * t + e * e),
              o = t * r + e * a,
              c = o / (n * s);
          return c > 1 && (c = 1), c < -1 && (c = -1), i * Math.acos(c);
        }
        function i(t, e, r, i, n, o, c, h, u, f) {
          var l = f * (t - r) / 2 + u * (e - i) / 2,
              d = -u * (t - r) / 2 + f * (e - i) / 2,
              g = c * c,
              p = h * h,
              x = l * l,
              b = d * d,
              m = g * p - g * b - p * x;
          m < 0 && (m = 0), m /= g * b + p * x, m = Math.sqrt(m) * (n === o ? -1 : 1);
          var v = m * c / h * d,
              y = m * -h / c * l,
              k = f * v - u * y + (t + r) / 2,
              M = u * v + f * y + (e + i) / 2,
              w = (l - v) / c,
              A = (d - y) / h,
              F = (-l - v) / c,
              S = (-d - y) / h,
              C = a(1, 0, w, A),
              I = a(w, A, F, S);
          return 0 === o && I > 0 && (I -= s), 1 === o && I < 0 && (I += s), [k, M, C, I];
        }
        function n(t, e) {
          var r = 4 / 3 * Math.tan(e / 4),
              a = Math.cos(t),
              i = Math.sin(t),
              n = Math.cos(t + e),
              s = Math.sin(t + e);
          return [a, i, a - i * r, i + a * r, n + s * r, s - n * r, n, s];
        }
        var s = 2 * Math.PI;
        e.exports = function(t, e, r, a, o, c, h, u, f) {
          var l = Math.sin(f * s / 360),
              d = Math.cos(f * s / 360),
              g = d * (t - r) / 2 + l * (e - a) / 2,
              p = -l * (t - r) / 2 + d * (e - a) / 2;
          if (0 === g && 0 === p)
            return [];
          if (0 === h || 0 === u)
            return [];
          h = Math.abs(h), u = Math.abs(u);
          var x = g * g / (h * h) + p * p / (u * u);
          x > 1 && (h *= Math.sqrt(x), u *= Math.sqrt(x));
          var b = i(t, e, r, a, o, c, h, u, l, d),
              m = [],
              v = b[2],
              y = b[3],
              k = Math.max(Math.ceil(Math.abs(y) / (s / 4)), 1);
          y /= k;
          for (var M = 0; M < k; M++)
            m.push(n(v, y)), v += y;
          return m.map(function(t) {
            for (var e = 0; e < t.length; e += 2) {
              var r = t[e + 0],
                  a = t[e + 1];
              r *= h, a *= u;
              var i = d * r - l * a,
                  n = l * r + d * a;
              t[e + 0] = i + b[0], t[e + 1] = n + b[1];
            }
            return t;
          });
        };
      }, {}],
      3: [function(t, e, r) {
        "use strict";
        function a(t, e, r) {
          if (!(this instanceof a))
            return new a(t, e, r);
          this.rx = t, this.ry = e, this.ax = r;
        }
        var i = Math.PI / 180;
        a.prototype.transform = function(t) {
          var e = Math.cos(this.ax * i),
              r = Math.sin(this.ax * i),
              a = [this.rx * (t[0] * e + t[2] * r), this.rx * (t[1] * e + t[3] * r), this.ry * (-t[0] * r + t[2] * e), this.ry * (-t[1] * r + t[3] * e)],
              n = a[0] * a[0] + a[2] * a[2],
              s = a[1] * a[1] + a[3] * a[3],
              o = ((a[0] - a[3]) * (a[0] - a[3]) + (a[2] + a[1]) * (a[2] + a[1])) * ((a[0] + a[3]) * (a[0] + a[3]) + (a[2] - a[1]) * (a[2] - a[1])),
              c = (n + s) / 2;
          if (o < 1e-10 * c)
            return this.rx = this.ry = Math.sqrt(c), this.ax = 0, this;
          var h = a[0] * a[1] + a[2] * a[3];
          o = Math.sqrt(o);
          var u = c + o / 2,
              f = c - o / 2;
          return this.ax = Math.abs(h) < 1e-10 && Math.abs(u - s) < 1e-10 ? 90 : 180 * Math.atan(Math.abs(h) > Math.abs(u - s) ? (u - n) / h : h / (u - s)) / Math.PI, this.ax >= 0 ? (this.rx = Math.sqrt(u), this.ry = Math.sqrt(f)) : (this.ax += 90, this.rx = Math.sqrt(f), this.ry = Math.sqrt(u)), this;
        }, a.prototype.isDegenerate = function() {
          return this.rx < 1e-10 * this.ry || this.ry < 1e-10 * this.rx;
        }, e.exports = a;
      }, {}],
      4: [function(t, e, r) {
        "use strict";
        function a(t, e) {
          return [t[0] * e[0] + t[2] * e[1], t[1] * e[0] + t[3] * e[1], t[0] * e[2] + t[2] * e[3], t[1] * e[2] + t[3] * e[3], t[0] * e[4] + t[2] * e[5] + t[4], t[1] * e[4] + t[3] * e[5] + t[5]];
        }
        function i() {
          if (!(this instanceof i))
            return new i;
          this.queue = [], this.cache = null;
        }
        i.prototype.matrix = function(t) {
          return 1 === t[0] && 0 === t[1] && 0 === t[2] && 1 === t[3] && 0 === t[4] && 0 === t[5] ? this : (this.cache = null, this.queue.push(t), this);
        }, i.prototype.translate = function(t, e) {
          return 0 === t && 0 === e || (this.cache = null, this.queue.push([1, 0, 0, 1, t, e])), this;
        }, i.prototype.scale = function(t, e) {
          return 1 === t && 1 === e || (this.cache = null, this.queue.push([t, 0, 0, e, 0, 0])), this;
        }, i.prototype.rotate = function(t, e, r) {
          var a,
              i,
              n;
          return 0 !== t && (this.translate(e, r), a = t * Math.PI / 180, i = Math.cos(a), n = Math.sin(a), this.queue.push([i, n, -n, i, 0, 0]), this.cache = null, this.translate(-e, -r)), this;
        }, i.prototype.skewX = function(t) {
          return 0 !== t && (this.cache = null, this.queue.push([1, 0, Math.tan(t * Math.PI / 180), 1, 0, 0])), this;
        }, i.prototype.skewY = function(t) {
          return 0 !== t && (this.cache = null, this.queue.push([1, Math.tan(t * Math.PI / 180), 0, 1, 0, 0])), this;
        }, i.prototype.toArray = function() {
          if (this.cache)
            return this.cache;
          if (!this.queue.length)
            return this.cache = [1, 0, 0, 1, 0, 0], this.cache;
          if (this.cache = this.queue[0], 1 === this.queue.length)
            return this.cache;
          for (var t = 1; t < this.queue.length; t++)
            this.cache = a(this.cache, this.queue[t]);
          return this.cache;
        }, i.prototype.calc = function(t, e, r) {
          var a;
          return this.queue.length ? (this.cache || (this.cache = this.toArray()), a = this.cache, [t * a[0] + e * a[2] + (r ? 0 : a[4]), t * a[1] + e * a[3] + (r ? 0 : a[5])]) : [t, e];
        }, e.exports = i;
      }, {}],
      5: [function(t, e, r) {
        "use strict";
        function a(t) {
          return 10 === t || 13 === t || 8232 === t || 8233 === t || 32 === t || 9 === t || 11 === t || 12 === t || 160 === t || t >= 5760 && d.indexOf(t) >= 0;
        }
        function i(t) {
          switch (32 | t) {
            case 109:
            case 122:
            case 108:
            case 104:
            case 118:
            case 99:
            case 115:
            case 113:
            case 116:
            case 97:
            case 114:
              return !0;
          }
          return !1;
        }
        function n(t) {
          return t >= 48 && t <= 57;
        }
        function s(t) {
          return t >= 48 && t <= 57 || 43 === t || 45 === t || 46 === t;
        }
        function o(t) {
          this.index = 0, this.path = t, this.max = t.length, this.result = [], this.param = 0, this.err = "", this.segmentStart = 0, this.data = [];
        }
        function c(t) {
          for (; t.index < t.max && a(t.path.charCodeAt(t.index)); )
            t.index++;
        }
        function h(t) {
          var e,
              r = t.index,
              a = r,
              i = t.max,
              s = !1,
              o = !1,
              c = !1,
              h = !1;
          if (a >= i)
            return void(t.err = "SvgPath: missed param (at pos " + a + ")");
          if (e = t.path.charCodeAt(a), 43 !== e && 45 !== e || (a++, e = a < i ? t.path.charCodeAt(a) : 0), !n(e) && 46 !== e)
            return void(t.err = "SvgPath: param should start with 0..9 or `.` (at pos " + a + ")");
          if (46 !== e) {
            if (s = 48 === e, a++, e = a < i ? t.path.charCodeAt(a) : 0, s && a < i && e && n(e))
              return void(t.err = "SvgPath: numbers started with `0` such as `09` are ilegal (at pos " + r + ")");
            for (; a < i && n(t.path.charCodeAt(a)); )
              a++, o = !0;
            e = a < i ? t.path.charCodeAt(a) : 0;
          }
          if (46 === e) {
            for (h = !0, a++; n(t.path.charCodeAt(a)); )
              a++, c = !0;
            e = a < i ? t.path.charCodeAt(a) : 0;
          }
          if (101 === e || 69 === e) {
            if (h && !o && !c)
              return void(t.err = "SvgPath: invalid float exponent (at pos " + a + ")");
            if (a++, e = a < i ? t.path.charCodeAt(a) : 0, 43 !== e && 45 !== e || a++, !(a < i && n(t.path.charCodeAt(a))))
              return void(t.err = "SvgPath: invalid float exponent (at pos " + a + ")");
            for (; a < i && n(t.path.charCodeAt(a)); )
              a++;
          }
          t.index = a, t.param = parseFloat(t.path.slice(r, a)) + 0;
        }
        function u(t) {
          var e,
              r;
          e = t.path[t.segmentStart], r = e.toLowerCase();
          var a = t.data;
          if ("m" === r && a.length > 2 && (t.result.push([e, a[0], a[1]]), a = a.slice(2), r = "l", e = "m" === e ? "l" : "L"), "r" === r)
            t.result.push([e].concat(a));
          else
            for (; a.length >= l[r] && (t.result.push([e].concat(a.splice(0, l[r]))), l[r]); )
              ;
        }
        function f(t) {
          var e,
              r,
              a,
              n,
              o = t.max;
          if (t.segmentStart = t.index, e = t.path.charCodeAt(t.index), !i(e))
            return void(t.err = "SvgPath: bad command " + t.path[t.index] + " (at pos " + t.index + ")");
          if (a = l[t.path[t.index].toLowerCase()], t.index++, c(t), t.data = [], !a)
            return void u(t);
          for (r = !1; ; ) {
            for (n = a; n > 0; n--) {
              if (h(t), t.err.length)
                return;
              t.data.push(t.param), c(t), r = !1, t.index < o && 44 === t.path.charCodeAt(t.index) && (t.index++, c(t), r = !0);
            }
            if (!r) {
              if (t.index >= t.max)
                break;
              if (!s(t.path.charCodeAt(t.index)))
                break;
            }
          }
          u(t);
        }
        var l = {
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
        },
            d = [5760, 6158, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288, 65279];
        e.exports = function(t) {
          var e = new o(t),
              r = e.max;
          for (c(e); e.index < r && !e.err.length; )
            f(e);
          return e.err.length ? e.result = [] : e.result.length && ("mM".indexOf(e.result[0][0]) < 0 ? (e.err = "SvgPath: string should start with `M` or `m`", e.result = []) : e.result[0][0] = "M"), {
            err: e.err,
            segments: e.result
          };
        };
      }, {}],
      6: [function(t, e, r) {
        "use strict";
        function a(t) {
          if (!(this instanceof a))
            return new a(t);
          var e = i(t);
          this.segments = e.segments, this.err = e.err, this.__stack = [];
        }
        var i = t("./path_parse"),
            n = t("./transform_parse"),
            s = t("./matrix"),
            o = t("./a2c"),
            c = t("./ellipse");
        a.prototype.__matrix = function(t) {
          var e,
              r = this;
          t.queue.length && this.iterate(function(a, i, n, s) {
            var o,
                h,
                u,
                f;
            switch (a[0]) {
              case "v":
                o = t.calc(0, a[1], !0), h = 0 === o[0] ? ["v", o[1]] : ["l", o[0], o[1]];
                break;
              case "V":
                o = t.calc(n, a[1], !1), h = o[0] === t.calc(n, s, !1)[0] ? ["V", o[1]] : ["L", o[0], o[1]];
                break;
              case "h":
                o = t.calc(a[1], 0, !0), h = 0 === o[1] ? ["h", o[0]] : ["l", o[0], o[1]];
                break;
              case "H":
                o = t.calc(a[1], s, !1), h = o[1] === t.calc(n, s, !1)[1] ? ["H", o[0]] : ["L", o[0], o[1]];
                break;
              case "a":
              case "A":
                var l = t.toArray(),
                    d = c(a[1], a[2], a[3]).transform(l);
                if (l[0] * l[3] - l[1] * l[2] < 0 && (a[5] = a[5] ? "0" : "1"), o = t.calc(a[6], a[7], "a" === a[0]), "A" === a[0] && a[6] === n && a[7] === s || "a" === a[0] && 0 === a[6] && 0 === a[7]) {
                  h = ["a" === a[0] ? "l" : "L", o[0], o[1]];
                  break;
                }
                h = d.isDegenerate() ? ["a" === a[0] ? "l" : "L", o[0], o[1]] : [a[0], d.rx, d.ry, d.ax, a[4], a[5], o[0], o[1]];
                break;
              case "m":
                f = i > 0, o = t.calc(a[1], a[2], f), h = ["m", o[0], o[1]];
                break;
              default:
                for (u = a[0], h = [u], f = u.toLowerCase() === u, e = 1; e < a.length; e += 2)
                  o = t.calc(a[e], a[e + 1], f), h.push(o[0], o[1]);
            }
            r.segments[i] = h;
          }, !0);
        }, a.prototype.__evaluateStack = function() {
          var t,
              e;
          if (this.__stack.length) {
            if (1 === this.__stack.length)
              return this.__matrix(this.__stack[0]), void(this.__stack = []);
            for (t = s(), e = this.__stack.length; --e >= 0; )
              t.matrix(this.__stack[e].toArray());
            this.__matrix(t), this.__stack = [];
          }
        }, a.prototype.toString = function() {
          var t,
              e,
              r = [];
          this.__evaluateStack();
          for (var a = 0; a < this.segments.length; a++)
            e = this.segments[a][0], t = a > 0 && "m" !== e && "M" !== e && e === this.segments[a - 1][0], r = r.concat(t ? this.segments[a].slice(1) : this.segments[a]);
          return r.join(" ").replace(/ ?([achlmqrstvz]) ?/gi, "$1").replace(/ \-/g, "-").replace(/zm/g, "z m");
        }, a.prototype.translate = function(t, e) {
          return this.__stack.push(s().translate(t, e || 0)), this;
        }, a.prototype.scale = function(t, e) {
          return this.__stack.push(s().scale(t, e || 0 === e ? e : t)), this;
        }, a.prototype.rotate = function(t, e, r) {
          return this.__stack.push(s().rotate(t, e || 0, r || 0)), this;
        }, a.prototype.skewX = function(t) {
          return this.__stack.push(s().skewX(t)), this;
        }, a.prototype.skewY = function(t) {
          return this.__stack.push(s().skewY(t)), this;
        }, a.prototype.matrix = function(t) {
          return this.__stack.push(s().matrix(t)), this;
        }, a.prototype.transform = function(t) {
          return t.trim() ? (this.__stack.push(n(t)), this) : this;
        }, a.prototype.round = function(t) {
          var e,
              r = 0,
              a = 0,
              i = 0,
              n = 0;
          return t = t || 0, this.__evaluateStack(), this.segments.forEach(function(s) {
            var o = s[0].toLowerCase() === s[0];
            switch (s[0]) {
              case "H":
              case "h":
                return o && (s[1] += i), i = s[1] - s[1].toFixed(t), void(s[1] = +s[1].toFixed(t));
              case "V":
              case "v":
                return o && (s[1] += n), n = s[1] - s[1].toFixed(t), void(s[1] = +s[1].toFixed(t));
              case "Z":
              case "z":
                return i = r, void(n = a);
              case "M":
              case "m":
                return o && (s[1] += i, s[2] += n), i = s[1] - s[1].toFixed(t), n = s[2] - s[2].toFixed(t), r = i, a = n, s[1] = +s[1].toFixed(t), void(s[2] = +s[2].toFixed(t));
              case "A":
              case "a":
                return o && (s[6] += i, s[7] += n), i = s[6] - s[6].toFixed(t), n = s[7] - s[7].toFixed(t), s[1] = +s[1].toFixed(t), s[2] = +s[2].toFixed(t), s[3] = +s[3].toFixed(t + 2), s[6] = +s[6].toFixed(t), void(s[7] = +s[7].toFixed(t));
              default:
                return e = s.length, o && (s[e - 2] += i, s[e - 1] += n), i = s[e - 2] - s[e - 2].toFixed(t), n = s[e - 1] - s[e - 1].toFixed(t), void s.forEach(function(e, r) {
                  r && (s[r] = +s[r].toFixed(t));
                });
            }
          }), this;
        }, a.prototype.iterate = function(t, e) {
          var r,
              a,
              i,
              n = this.segments,
              s = {},
              o = !1,
              c = 0,
              h = 0,
              u = 0,
              f = 0;
          if (e || this.__evaluateStack(), n.forEach(function(e, r) {
            var a = t(e, r, c, h);
            Array.isArray(a) && (s[r] = a, o = !0);
            var i = e[0] === e[0].toLowerCase();
            switch (e[0]) {
              case "m":
              case "M":
                return c = e[1] + (i ? c : 0), h = e[2] + (i ? h : 0), u = c, void(f = h);
              case "h":
              case "H":
                return void(c = e[1] + (i ? c : 0));
              case "v":
              case "V":
                return void(h = e[1] + (i ? h : 0));
              case "z":
              case "Z":
                return c = u, void(h = f);
              default:
                c = e[e.length - 2] + (i ? c : 0), h = e[e.length - 1] + (i ? h : 0);
            }
          }), !o)
            return this;
          for (i = [], r = 0; r < n.length; r++)
            if (void 0 !== s[r])
              for (a = 0; a < s[r].length; a++)
                i.push(s[r][a]);
            else
              i.push(n[r]);
          return this.segments = i, this;
        }, a.prototype.abs = function() {
          return this.iterate(function(t, e, r, a) {
            var i,
                n = t[0],
                s = n.toUpperCase();
            if (n !== s)
              switch (t[0] = s, n) {
                case "v":
                  return void(t[1] += a);
                case "a":
                  return t[6] += r, void(t[7] += a);
                default:
                  for (i = 1; i < t.length; i++)
                    t[i] += i % 2 ? r : a;
              }
          }, !0), this;
        }, a.prototype.rel = function() {
          return this.iterate(function(t, e, r, a) {
            var i,
                n = t[0],
                s = n.toLowerCase();
            if (n !== s && (0 !== e || "M" !== n))
              switch (t[0] = s, n) {
                case "V":
                  return void(t[1] -= a);
                case "A":
                  return t[6] -= r, void(t[7] -= a);
                default:
                  for (i = 1; i < t.length; i++)
                    t[i] -= i % 2 ? r : a;
              }
          }, !0), this;
        }, a.prototype.unarc = function() {
          return this.iterate(function(t, e, r, a) {
            var i,
                n,
                s,
                c = [],
                h = t[0];
            return "A" !== h && "a" !== h ? null : ("a" === h ? (n = r + t[6], s = a + t[7]) : (n = t[6], s = t[7]), i = o(r, a, n, s, t[4], t[5], t[1], t[2], t[3]), 0 === i.length ? [["a" === t[0] ? "l" : "L", t[6], t[7]]] : (i.forEach(function(t) {
              c.push(["C", t[2], t[3], t[4], t[5], t[6], t[7]]);
            }), c));
          }), this;
        }, a.prototype.unshort = function() {
          var t,
              e,
              r,
              a,
              i,
              n = this.segments;
          return this.iterate(function(s, o, c, h) {
            var u,
                f = s[0],
                l = f.toUpperCase();
            o && ("T" === l ? (u = "t" === f, r = n[o - 1], "Q" === r[0] ? (t = r[1] - c, e = r[2] - h) : "q" === r[0] ? (t = r[1] - r[3], e = r[2] - r[4]) : (t = 0, e = 0), a = -t, i = -e, u || (a += c, i += h), n[o] = [u ? "q" : "Q", a, i, s[1], s[2]]) : "S" === l && (u = "s" === f, r = n[o - 1], "C" === r[0] ? (t = r[3] - c, e = r[4] - h) : "c" === r[0] ? (t = r[3] - r[5], e = r[4] - r[6]) : (t = 0, e = 0), a = -t, i = -e, u || (a += c, i += h), n[o] = [u ? "c" : "C", a, i, s[1], s[2], s[3], s[4]]));
          }), this;
        }, e.exports = a;
      }, {
        "./a2c": 2,
        "./ellipse": 3,
        "./matrix": 4,
        "./path_parse": 5,
        "./transform_parse": 7
      }],
      7: [function(t, e, r) {
        "use strict";
        var a = t("./matrix"),
            i = {
              matrix: !0,
              scale: !0,
              rotate: !0,
              translate: !0,
              skewX: !0,
              skewY: !0
            },
            n = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/,
            s = /[\s,]+/;
        e.exports = function(t) {
          var e,
              r,
              o = new a;
          return t.split(n).forEach(function(t) {
            if (t.length) {
              if (void 0 !== i[t])
                return void(e = t);
              switch (r = t.split(s).map(function(t) {
                return +t || 0;
              }), e) {
                case "matrix":
                  return void(6 === r.length && o.matrix(r));
                case "scale":
                  return void(1 === r.length ? o.scale(r[0], r[0]) : 2 === r.length && o.scale(r[0], r[1]));
                case "rotate":
                  return void(1 === r.length ? o.rotate(r[0], 0, 0) : 3 === r.length && o.rotate(r[0], r[1], r[2]));
                case "translate":
                  return void(1 === r.length ? o.translate(r[0], 0) : 2 === r.length && o.translate(r[0], r[1]));
                case "skewX":
                  return void(1 === r.length && o.skewX(r[0]));
                case "skewY":
                  return void(1 === r.length && o.skewY(r[0]));
              }
            }
          }), o;
        };
      }, {"./matrix": 4}],
      8: [function(e, r, a) {
        !function(e) {
          function a(t) {
            this.ok = !1, "#" == t.charAt(0) && (t = t.substr(1, 6)), t = t.replace(/ /g, ""), t = t.toLowerCase();
            var e = {
              aliceblue: "f0f8ff",
              antiquewhite: "faebd7",
              aqua: "00ffff",
              aquamarine: "7fffd4",
              azure: "f0ffff",
              beige: "f5f5dc",
              bisque: "ffe4c4",
              black: "000000",
              blanchedalmond: "ffebcd",
              blue: "0000ff",
              blueviolet: "8a2be2",
              brown: "a52a2a",
              burlywood: "deb887",
              cadetblue: "5f9ea0",
              chartreuse: "7fff00",
              chocolate: "d2691e",
              coral: "ff7f50",
              cornflowerblue: "6495ed",
              cornsilk: "fff8dc",
              crimson: "dc143c",
              cyan: "00ffff",
              darkblue: "00008b",
              darkcyan: "008b8b",
              darkgoldenrod: "b8860b",
              darkgray: "a9a9a9",
              darkgreen: "006400",
              darkkhaki: "bdb76b",
              darkmagenta: "8b008b",
              darkolivegreen: "556b2f",
              darkorange: "ff8c00",
              darkorchid: "9932cc",
              darkred: "8b0000",
              darksalmon: "e9967a",
              darkseagreen: "8fbc8f",
              darkslateblue: "483d8b",
              darkslategray: "2f4f4f",
              darkturquoise: "00ced1",
              darkviolet: "9400d3",
              deeppink: "ff1493",
              deepskyblue: "00bfff",
              dimgray: "696969",
              dodgerblue: "1e90ff",
              feldspar: "d19275",
              firebrick: "b22222",
              floralwhite: "fffaf0",
              forestgreen: "228b22",
              fuchsia: "ff00ff",
              gainsboro: "dcdcdc",
              ghostwhite: "f8f8ff",
              gold: "ffd700",
              goldenrod: "daa520",
              gray: "808080",
              green: "008000",
              greenyellow: "adff2f",
              honeydew: "f0fff0",
              hotpink: "ff69b4",
              indianred: "cd5c5c",
              indigo: "4b0082",
              ivory: "fffff0",
              khaki: "f0e68c",
              lavender: "e6e6fa",
              lavenderblush: "fff0f5",
              lawngreen: "7cfc00",
              lemonchiffon: "fffacd",
              lightblue: "add8e6",
              lightcoral: "f08080",
              lightcyan: "e0ffff",
              lightgoldenrodyellow: "fafad2",
              lightgrey: "d3d3d3",
              lightgreen: "90ee90",
              lightpink: "ffb6c1",
              lightsalmon: "ffa07a",
              lightseagreen: "20b2aa",
              lightskyblue: "87cefa",
              lightslateblue: "8470ff",
              lightslategray: "778899",
              lightsteelblue: "b0c4de",
              lightyellow: "ffffe0",
              lime: "00ff00",
              limegreen: "32cd32",
              linen: "faf0e6",
              magenta: "ff00ff",
              maroon: "800000",
              mediumaquamarine: "66cdaa",
              mediumblue: "0000cd",
              mediumorchid: "ba55d3",
              mediumpurple: "9370d8",
              mediumseagreen: "3cb371",
              mediumslateblue: "7b68ee",
              mediumspringgreen: "00fa9a",
              mediumturquoise: "48d1cc",
              mediumvioletred: "c71585",
              midnightblue: "191970",
              mintcream: "f5fffa",
              mistyrose: "ffe4e1",
              moccasin: "ffe4b5",
              navajowhite: "ffdead",
              navy: "000080",
              oldlace: "fdf5e6",
              olive: "808000",
              olivedrab: "6b8e23",
              orange: "ffa500",
              orangered: "ff4500",
              orchid: "da70d6",
              palegoldenrod: "eee8aa",
              palegreen: "98fb98",
              paleturquoise: "afeeee",
              palevioletred: "d87093",
              papayawhip: "ffefd5",
              peachpuff: "ffdab9",
              peru: "cd853f",
              pink: "ffc0cb",
              plum: "dda0dd",
              powderblue: "b0e0e6",
              purple: "800080",
              red: "ff0000",
              rosybrown: "bc8f8f",
              royalblue: "4169e1",
              saddlebrown: "8b4513",
              salmon: "fa8072",
              sandybrown: "f4a460",
              seagreen: "2e8b57",
              seashell: "fff5ee",
              sienna: "a0522d",
              silver: "c0c0c0",
              skyblue: "87ceeb",
              slateblue: "6a5acd",
              slategray: "708090",
              snow: "fffafa",
              springgreen: "00ff7f",
              steelblue: "4682b4",
              tan: "d2b48c",
              teal: "008080",
              thistle: "d8bfd8",
              tomato: "ff6347",
              turquoise: "40e0d0",
              violet: "ee82ee",
              violetred: "d02090",
              wheat: "f5deb3",
              white: "ffffff",
              whitesmoke: "f5f5f5",
              yellow: "ffff00",
              yellowgreen: "9acd32"
            };
            for (var r in e)
              t == r && (t = e[r]);
            for (var i = [{
              re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
              example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
              process: function(t) {
                return [parseInt(t[1]), parseInt(t[2]), parseInt(t[3])];
              }
            }, {
              re: /^(\w{2})(\w{2})(\w{2})$/,
              example: ["#00ff00", "336699"],
              process: function(t) {
                return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)];
              }
            }, {
              re: /^(\w{1})(\w{1})(\w{1})$/,
              example: ["#fb0", "f0f"],
              process: function(t) {
                return [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16)];
              }
            }],
                n = 0; n < i.length; n++) {
              var s = i[n].re,
                  o = i[n].process,
                  c = s.exec(t);
              if (c) {
                var h = o(c);
                this.r = h[0], this.g = h[1], this.b = h[2], this.ok = !0;
              }
            }
            this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r, this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g, this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b, this.toRGB = function() {
              return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
            }, this.toHex = function() {
              var t = this.r.toString(16),
                  e = this.g.toString(16),
                  r = this.b.toString(16);
              return 1 == t.length && (t = "0" + t), 1 == e.length && (e = "0" + e), 1 == r.length && (r = "0" + r), "#" + t + e + r;
            }, this.getHelpXML = function() {
              for (var t = new Array,
                  r = 0; r < i.length; r++)
                for (var n = i[r].example,
                    s = 0; s < n.length; s++)
                  t[t.length] = n[s];
              for (var o in e)
                t[t.length] = o;
              var c = document.createElement("ul");
              c.setAttribute("id", "rgbcolor-examples");
              for (var r = 0; r < t.length; r++)
                try {
                  var h = document.createElement("li"),
                      u = new a(t[r]),
                      f = document.createElement("div");
                  f.style.cssText = "margin: 3px; border: 1px solid black; background:" + u.toHex() + "; color:" + u.toHex(), f.appendChild(document.createTextNode("test"));
                  var l = document.createTextNode(" " + t[r] + " -> " + u.toRGB() + " -> " + u.toHex());
                  h.appendChild(f), h.appendChild(l), c.appendChild(h);
                } catch (t) {}
              return c;
            };
          }
          "function" == typeof t && t.amd ? t(function() {
            return a;
          }) : void 0 !== r && r.exports ? r.exports = a : e.RGBColor = a;
        }("undefined" != typeof self && self || "undefined" != typeof window && window || this);
      }, {}],
      9: [function(e, r, a) {
        !function(a) {
          function i(t) {
            var e = Math.sqrt(t[0] * t[0] + t[1] * t[1]);
            return [t[0] / e, t[1] / e];
          }
          function n(t, e) {
            return i([e[0] - t[0], e[1] - t[1]]);
          }
          function s(t, e) {
            return [t[0] + e[0], t[1] + e[1]];
          }
          function o() {
            this.markers = [];
          }
          function c(t, e, r) {
            this.id = t, this.anchor = e, this.angle = r;
          }
          function h(t, e, r, a, i, n) {
            var s,
                o,
                c = e[0],
                h = e[1],
                u = e[2],
                f = e[3],
                l = i / u,
                g = n / f,
                p = t.getAttribute("preserveAspectRatio");
            if (p) {
              var x = p.split(" ");
              s = x[0], o = x[1] || "meet";
            } else
              s = "xMidYMid", o = "meet";
            "none" !== s && ("meet" === o ? l = g = Math.min(l, g) : "slice" === o && (l = g = Math.max(l, g)));
            var b = r - c * l,
                m = a - h * g;
            s.indexOf("xMid") >= 0 ? b += (i - u * l) / 2 : s.indexOf("xMax") >= 0 && (b += i - u * l), s.indexOf("yMid") >= 0 ? m += (n - f * g) / 2 : s.indexOf("yMax") >= 0 && (m += n - f * g);
            var v = new d.Matrix(1, 0, 0, 1, b, m),
                y = new d.Matrix(l, 0, 0, g, 0, 0);
            return d.matrixMult(y, v);
          }
          function u(t, e) {
            var r = x(t, "font-family");
            r && d.setFont(r), e && e.ok && d.setTextColor(e.r, e.g, e.b);
            var a,
                i = x(t, "font-weight");
            i && "bold" === i && (a = "bold");
            var n = x(t, "font-style");
            n && "italic" === n && (a += "italic"), d.setFontType(a);
            var s = 16,
                o = x(t, "font-size");
            o && (s = parseFloat(o), d.setFontSize(s));
          }
          var f,
              l,
              d,
              g = /url\(#([^)]+)\)/,
              p = function(t) {
                var e = t.getAttribute("d");
                l && (e = l(e).unshort().unarc().abs().toString(), t.setAttribute("d", e));
                var r = t.pathSegList;
                if (r)
                  return r;
                r = [];
                for (var a,
                    i = /([a-df-zA-DF-Z])([^a-df-zA-DF-Z]*)/g; a = i.exec(e); ) {
                  var n = O(a[2]),
                      s = a[1],
                      o = "zZ".indexOf(s) >= 0 ? 0 : "hHvV".indexOf(s) >= 0 ? 1 : "mMlLtT".indexOf(s) >= 0 ? 2 : "sSqQ".indexOf(s) >= 0 ? 4 : "aA".indexOf(s) >= 0 ? 7 : "cC".indexOf(s) >= 0 ? 6 : -1,
                      c = 0;
                  do {
                    var h = {pathSegTypeAsLetter: s};
                    switch (s) {
                      case "h":
                      case "H":
                        h.x = n[c];
                        break;
                      case "v":
                      case "V":
                        h.y = n[c];
                        break;
                      case "c":
                      case "C":
                        h.x1 = n[c + o - 6], h.y1 = n[c + o - 5];
                      case "s":
                      case "S":
                        h.x2 = n[c + o - 4], h.y2 = n[c + o - 3];
                      case "t":
                      case "T":
                      case "l":
                      case "L":
                      case "m":
                      case "M":
                        h.x = n[c + o - 2], h.y = n[c + o - 1];
                        break;
                      case "q":
                      case "Q":
                        h.x1 = n[c], h.y1 = n[c + 1], h.x = n[c + 2], h.y = n[c + 3];
                        break;
                      case "a":
                      case "A":
                        throw new Error("Cannot convert Arcs without SvgPath package");
                    }
                    r.push(h), "m" === s ? s = "l" : "M" === s && (s = "L"), c += o;
                  } while (c < n.length);
                }
                return r.getItem = function(t) {
                  return this[t];
                }, r.numberOfItems = r.length, r;
              },
              x = function(t, e, r) {
                return r = r || e, t.getAttribute(e) || t.style[r];
              },
              b = function(t, e) {
                return e.split(",").indexOf(t.tagName.toLowerCase()) >= 0;
              },
              m = function(t, e) {
                for (var r = [],
                    a = 0; a < t.childNodes.length; a++) {
                  var i = t.childNodes[a];
                  "#" !== i.nodeName.charAt(0) && r.push(i);
                }
                for (a = 0; a < r.length; a++)
                  e(a, r[a]);
              },
              v = function(t, e) {
                return Math.atan2(e[1] - t[1], e[0] - t[0]);
              },
              y = function(t, e) {
                var r = e[0] - t[0],
                    a = e[1] - t[1];
                return [t[0] + 2 * r, t[1] + 2 * a];
              },
              k = function(t, e) {
                return [2 / 3 * (e[0] - t[0]) + t[0], 2 / 3 * (e[1] - t[1]) + t[1]];
              },
              M = function(t, e, r, a, i) {
                var n = r.getItem(t - 1);
                return t > 0 && ("C" === n.pathSegTypeAsLetter || "S" === n.pathSegTypeAsLetter) ? y([n.x2, n.y2], e) : t > 0 && ("c" === n.pathSegTypeAsLetter || "s" === n.pathSegTypeAsLetter) ? y([n.x2 + a, n.y2 + i], e) : [e[0], e[1]];
              },
              w = function(t) {
                this.prefix = t, this.id = 0, this.nextChild = function() {
                  return new w("_" + this.id++ + "_" + this.get());
                }, this.get = function() {
                  return this.prefix;
                };
              },
              A = function() {
                this.fillMode = "F", this.strokeMode = "", this.color = new f("rgb(0, 0, 0)"), this.fill = new f("rgb(0, 0, 0)"), this.fillOpacity = 1, this.fontFamily = "times", this.fontSize = 16, this.opacity = 1, this.stroke = null, this.strokeDasharray = null, this.strokeDashoffset = null, this.strokeLinecap = "butt", this.strokeLinejoin = "miter", this.strokeMiterlimit = 4, this.strokeOpacity = 1, this.strokeWidth = 1, this.textAnchor = "start", this.visibility = "visible";
              };
          A.prototype.clone = function() {
            var t = new A;
            return Object.getOwnPropertyNames(this).forEach(function(e) {
              t[e] = this[e];
            }, this), t;
          }, o.prototype.addMarker = function(t) {
            this.markers.push(t);
          }, o.prototype.draw = function(t, e) {
            for (var r = 0; r < this.markers.length; r++) {
              var a,
                  i = this.markers[r],
                  n = i.angle,
                  s = i.anchor,
                  o = Math.cos(n),
                  c = Math.sin(n);
              a = new d.Matrix(o, c, -c, o, s[0], s[1]), a = d.matrixMult(new d.Matrix(e.strokeWidth, 0, 0, e.strokeWidth, 0, 0), a), a = d.matrixMult(a, t), d.saveGraphicsState(), d.setLineWidth(1), d.doFormObject(i.id, a), d.restoreGraphicsState();
            }
          };
          var F = function(t, e) {
            for (var r = /_\d+_/; !e[t] && r.exec(t); )
              t = t.replace(r, "");
            return e[t];
          },
              S = function(t) {
                return t.replace(/[\n\s\r]+/, " ").trim();
              },
              C = function(t) {
                var e = {};
                for (var r in t)
                  t.hasOwnProperty(r) && (e[r] = t[r]);
                return e;
              },
              I = function(t) {
                var e,
                    r,
                    a,
                    i = d.unitMatrix;
                if (b(t, "svg,g"))
                  if (r = parseFloat(t.getAttribute("x")) || 0, a = parseFloat(t.getAttribute("y")) || 0, e = t.getAttribute("viewBox")) {
                    var n = parseFloat(t.getAttribute("width")),
                        s = parseFloat(t.getAttribute("height"));
                    i = h(t, O(e), r, a, n, s);
                  } else
                    i = new d.Matrix(1, 0, 0, 1, r, a);
                else if (b(t, "marker"))
                  if (r = parseFloat(t.getAttribute("refX")) || 0, a = parseFloat(t.getAttribute("refY")) || 0, e = t.getAttribute("viewBox")) {
                    var o = O(e);
                    o[0] = o[1] = 0, i = h(t, o, 0, 0, t.getAttribute("markerWidth"), t.getAttribute("markerHeight")), i = d.matrixMult(new d.Matrix(1, 0, 0, 1, -r, -a), i);
                  } else
                    i = new d.Matrix(1, 0, 0, 1, -r, -a);
                var c = t.getAttribute("transform");
                return c ? d.matrixMult(i, L(c)) : i;
              },
              _ = function(t) {
                for (var e = O(t),
                    r = [],
                    a = 0; a < e.length - 1; a += 2) {
                  var i = e[a],
                      n = e[a + 1];
                  r.push([i, n]);
                }
                return r;
              },
              L = function(t) {
                if (!t)
                  return d.unitMatrix;
                for (var e,
                    r = /^\s*matrix\(([^\)]+)\)\s*/,
                    a = /^\s*translate\(([^\)]+)\)\s*/,
                    i = /^\s*rotate\(([^\)]+)\)\s*/,
                    n = /^\s*scale\(([^\)]+)\)\s*/,
                    s = /^\s*skewX\(([^\)]+)\)\s*/,
                    o = /^\s*skewY\(([^\)]+)\)\s*/,
                    c = d.unitMatrix; t.length > 0; ) {
                  var h = r.exec(t);
                  if (h && (e = O(h[1]), c = d.matrixMult(new d.Matrix(e[0], e[1], e[2], e[3], e[4], e[5]), c), t = t.substr(h[0].length)), h = i.exec(t)) {
                    e = O(h[1]);
                    var u = Math.PI * e[0] / 180;
                    if (c = d.matrixMult(new d.Matrix(Math.cos(u), Math.sin(u), -Math.sin(u), Math.cos(u), 0, 0), c), e[1] && e[2]) {
                      var f = new d.Matrix(1, 0, 0, 1, e[1], e[2]),
                          l = new d.Matrix(1, 0, 0, 1, -e[1], -e[2]);
                      c = d.matrixMult(l, d.matrixMult(c, f));
                    }
                    t = t.substr(h[0].length);
                  }
                  h = a.exec(t), h && (e = O(h[1]), c = d.matrixMult(new d.Matrix(1, 0, 0, 1, e[0], e[1] || 0), c), t = t.substr(h[0].length)), h = n.exec(t), h && (e = O(h[1]), e[1] || (e[1] = e[0]), c = d.matrixMult(new d.Matrix(e[0], 0, 0, e[1], 0, 0), c), t = t.substr(h[0].length)), h = s.exec(t), h && (e = parseFloat(h[1]), c = d.matrixMult(new d.Matrix(1, 0, Math.tan(e), 1, 0, 0), c), t = t.substr(h[0].length)), h = o.exec(t), h && (e = parseFloat(h[1]), c = d.matrixMult(new d.Matrix(1, Math.tan(e), 0, 1, 0, 0), c), t = t.substr(h[0].length));
                }
                return c;
              },
              O = function(t) {
                for (var e,
                    r = [],
                    a = /[+-]?(?:(?:\d+\.?\d*)|(?:\d*\.?\d+))(?:[eE][+-]?\d+)?/g; e = a.exec(t); )
                  r.push(parseFloat(e[0]));
                return r;
              },
              T = function(t) {
                var e = /\s*rgba\(((?:[^,\)]*,){3}[^,\)]*)\)\s*/.exec(t);
                if (e) {
                  var r = O(e[1]),
                      a = new f("rgb(" + r.slice(0, 3).join(",") + ")");
                  return a.a = r[3], a;
                }
                return new f(t);
              },
              q = function(t, e) {
                var r = t[0],
                    a = t[1];
                return [e.a * r + e.c * a + e.e, e.b * r + e.d * a + e.f];
              },
              N = function(t) {
                if ("none" === x(t, "display"))
                  return [0, 0, 0, 0];
                var e,
                    r,
                    a,
                    i,
                    n,
                    s,
                    o,
                    c,
                    h = parseFloat;
                if (b(t, "polygon")) {
                  var u = _(t.getAttribute("points"));
                  for (r = Number.POSITIVE_INFINITY, a = Number.POSITIVE_INFINITY, i = Number.NEGATIVE_INFINITY, n = Number.NEGATIVE_INFINITY, e = 0; e < u.length; e++) {
                    var f = u[e];
                    r = Math.min(r, f[0]), i = Math.max(i, f[0]), a = Math.min(a, f[1]), n = Math.max(n, f[1]);
                  }
                  c = [r, a, i - r, n - a];
                } else if (b(t, "path")) {
                  var l = p(t);
                  r = Number.POSITIVE_INFINITY, a = Number.POSITIVE_INFINITY, i = Number.NEGATIVE_INFINITY, n = Number.NEGATIVE_INFINITY;
                  var d,
                      g,
                      v,
                      y,
                      w,
                      A,
                      F,
                      S = 0,
                      C = 0;
                  for (e = 0; e < l.numberOfItems; e++) {
                    var I = l.getItem(e),
                        L = I.pathSegTypeAsLetter;
                    switch (L) {
                      case "H":
                        v = I.x, y = C;
                        break;
                      case "h":
                        v = I.x + S, y = C;
                        break;
                      case "V":
                        v = S, y = I.y;
                        break;
                      case "v":
                        v = S, y = I.y + C;
                        break;
                      case "C":
                        w = [I.x1, I.y1], A = [I.x2, I.y2], F = [I.x, I.y];
                        break;
                      case "c":
                        w = [I.x1 + S, I.y1 + C], A = [I.x2 + S, I.y2 + C], F = [I.x + S, I.y + C];
                        break;
                      case "S":
                        w = M(e, [S, C], l, d, g), A = [I.x2, I.y2], F = [I.x, I.y];
                        break;
                      case "s":
                        w = M(e, [S, C], l, d, g), A = [I.x2 + S, I.y2 + C], F = [I.x + S, I.y + C];
                        break;
                      case "Q":
                        h = [I.x1, I.y1], w = k([S, C], h), A = k([I.x, I.y], h), F = [I.x, I.y];
                        break;
                      case "q":
                        h = [I.x1 + S, I.y1 + C], w = k([S, C], h), A = k([S + I.x, C + I.y], h), F = [I.x + S, I.y + C];
                        break;
                      case "T":
                        w = M(e, [S, C], l, d, g), w = k([S, C], h), A = k([I.x, I.y], h), F = [I.x, I.y];
                        break;
                      case "t":
                        h = M(e, [S, C], l, d, g), w = k([S, C], h), A = k([S + I.x, C + I.y], h), F = [I.x + S, I.y + C];
                    }
                    "sScCqQtT".indexOf(L) >= 0 && (d = S, g = C), "MLCSQT".indexOf(L) >= 0 ? (S = I.x, C = I.y) : "mlcsqt".indexOf(L) >= 0 ? (S = I.x + S, C = I.y + C) : "zZ".indexOf(L) < 0 && (S = v, C = y), "CSQTcsqt".indexOf(L) >= 0 ? (r = Math.min(r, S, w[0], A[0], F[0]), i = Math.max(i, S, w[0], A[0], F[0]), a = Math.min(a, C, w[1], A[1], F[1]), n = Math.max(n, C, w[1], A[1], F[1])) : (r = Math.min(r, S), i = Math.max(i, S), a = Math.min(a, C), n = Math.max(n, C));
                  }
                  c = [r, a, i - r, n - a];
                } else {
                  if (b(t, "svg"))
                    return s = t.getAttribute("viewBox"), s && (o = O(s)), [h(t.getAttribute("x")) || o && o[0] || 0, h(t.getAttribute("y")) || o && o[1] || 0, h(t.getAttribute("width")) || o && o[2] || 0, h(t.getAttribute("height")) || o && o[3] || 0];
                  if (b(t, "g"))
                    c = [0, 0, 0, 0], m(t, function(t, e) {
                      var r = N(e);
                      c = [Math.min(c[0], r[0]), Math.min(c[1], r[1]), Math.max(c[0] + c[2], r[0] + r[2]) - Math.min(c[0], r[0]), Math.max(c[1] + c[3], r[1] + r[3]) - Math.min(c[1], r[1])];
                    });
                  else {
                    if (b(t, "marker"))
                      return s = t.getAttribute("viewBox"), s && (o = O(s)), [o && o[0] || 0, o && o[1] || 0, o && o[2] || h(t.getAttribute("marker-width")) || 0, o && o[3] || h(t.getAttribute("marker-height")) || 0];
                    if (b(t, "pattern"))
                      return [h(t.getAttribute("x")) || 0, h(t.getAttribute("y")) || 0, h(t.getAttribute("width")) || 0, h(t.getAttribute("height")) || 0];
                    var T = h(t.getAttribute("x1")) || h(t.getAttribute("x")) || h(t.getAttribute("cx") - h(t.getAttribute("r"))) || 0,
                        q = h(t.getAttribute("x2")) || T + h(t.getAttribute("width")) || h(t.getAttribute("cx")) + h(t.getAttribute("r")) || 0,
                        P = h(t.getAttribute("y1")) || h(t.getAttribute("y")) || h(t.getAttribute("cy")) - h(t.getAttribute("r")) || 0,
                        E = h(t.getAttribute("y2")) || P + h(t.getAttribute("height")) || h(t.getAttribute("cy")) + h(t.getAttribute("r")) || 0;
                    c = [Math.min(T, q), Math.min(P, E), Math.max(T, q) - Math.min(T, q), Math.max(P, E) - Math.min(P, E)];
                  }
                }
                if (!b(t, "marker,svg,g")) {
                  var j = x(t, "stroke-width") || 1;
                  return x(t, "stroke-miterlimit") && (j *= .5 / Math.sin(Math.PI / 12)), [c[0] - j, c[1] - j, c[2] + 2 * j, c[3] + 2 * j];
                }
                return c;
              },
              P = function(t, e, r, a, i, h, u) {
                var f,
                    l,
                    p = _(t.getAttribute("points")),
                    x = [{
                      op: "m",
                      c: q(p[0], e)
                    }];
                for (f = 1; f < p.length; f++) {
                  var b = p[f],
                      m = q(b, e);
                  x.push({
                    op: "l",
                    c: m
                  });
                }
                x.push({op: "h"}), d.path(x, r, a, i);
                var v = t.getAttribute("marker-end"),
                    y = t.getAttribute("marker-start"),
                    k = t.getAttribute("marker-mid");
                if (y || k || v) {
                  var M = x.length,
                      w = new o;
                  if (y && (y = h.get() + g.exec(y)[1], l = s(n(x[0].c, x[1].c), n(x[M - 2].c, x[0].c)), w.addMarker(new c(y, x[0].c, Math.atan2(l[1], l[0])))), k) {
                    k = h.get() + g.exec(k)[1];
                    var A,
                        F = n(x[0].c, x[1].c);
                    for (f = 1; f < x.length - 2; f++)
                      A = n(x[f].c, x[f + 1].c), l = s(F, A), w.addMarker(new c(k, x[f].c, Math.atan2(l[1], l[0]))), F = A;
                    A = n(x[M - 2].c, x[0].c), l = s(F, A), w.addMarker(new c(k, x[M - 2].c, Math.atan2(l[1], l[0])));
                  }
                  v && (v = h.get() + g.exec(v)[1], l = s(n(x[0].c, x[1].c), n(x[M - 2].c, x[0].c)), w.addMarker(new c(v, x[0].c, Math.atan2(l[1], l[0])))), w.draw(d.unitMatrix, u);
                }
              },
              E = function(t) {
                var e = t.getAttribute("xlink:href") || t.getAttribute("href"),
                    r = new Image;
                r.src = e;
                var a = document.createElement("canvas"),
                    i = parseFloat(t.getAttribute("width")),
                    n = parseFloat(t.getAttribute("height")),
                    s = parseFloat(t.getAttribute("x") || 0),
                    o = parseFloat(t.getAttribute("y") || 0);
                a.width = i, a.height = n;
                var c = a.getContext("2d");
                c.fillStyle = "#fff", c.fillRect(0, 0, i, n), c.drawImage(r, 0, 0, i, n);
                try {
                  var h = a.toDataURL("image/jpeg");
                  d.addImage(h, "jpeg", s, o, i, n);
                } catch (t) {
                  "object" == typeof console && console.warn && console.warn('svg2pdfjs: Images with external resource link are not supported! ("' + e + '")');
                }
              },
              j = function(t, e, r, a, h, u, f) {
                var l = p(t),
                    x = t.getAttribute("marker-end"),
                    b = t.getAttribute("marker-start"),
                    m = t.getAttribute("marker-mid");
                x && (x = r.get() + g.exec(x)[1]), b && (b = r.get() + g.exec(b)[1]), m && (m = r.get() + g.exec(m)[1]);
                var y = function(t, e) {
                  for (var r,
                      a,
                      h,
                      u,
                      f,
                      d,
                      g,
                      p,
                      y,
                      w,
                      A = 0,
                      F = 0,
                      S = A,
                      C = F,
                      I = [],
                      _ = new o,
                      L = [0, 0],
                      O = 0; O < l.numberOfItems; O++) {
                    var T = l.getItem(O),
                        N = T.pathSegTypeAsLetter;
                    switch (N) {
                      case "M":
                        S = A, C = F, f = [T.x, T.y], y = "m";
                        break;
                      case "m":
                        S = A, C = F, f = [T.x + A, T.y + F], y = "m";
                        break;
                      case "L":
                        f = [T.x, T.y], y = "l";
                        break;
                      case "l":
                        f = [T.x + A, T.y + F], y = "l";
                        break;
                      case "H":
                        f = [T.x, F], y = "l", h = T.x, u = F;
                        break;
                      case "h":
                        f = [T.x + A, F], y = "l", h = T.x + A, u = F;
                        break;
                      case "V":
                        f = [A, T.y], y = "l", h = A, u = T.y;
                        break;
                      case "v":
                        f = [A, T.y + F], y = "l", h = A, u = T.y + F;
                        break;
                      case "C":
                        g = [T.x1, T.y1], p = [T.x2, T.y2], f = [T.x, T.y];
                        break;
                      case "c":
                        g = [T.x1 + A, T.y1 + F], p = [T.x2 + A, T.y2 + F], f = [T.x + A, T.y + F];
                        break;
                      case "S":
                        g = M(O, [A, F], l, r, a), p = [T.x2, T.y2], f = [T.x, T.y];
                        break;
                      case "s":
                        g = M(O, [A, F], l, r, a), p = [T.x2 + A, T.y2 + F], f = [T.x + A, T.y + F];
                        break;
                      case "Q":
                        d = [T.x1, T.y1], g = k([A, F], d), p = k([T.x, T.y], d), f = [T.x, T.y];
                        break;
                      case "q":
                        d = [T.x1 + A, T.y1 + F], g = k([A, F], d), p = k([A + T.x, F + T.y], d), f = [T.x + A, T.y + F];
                        break;
                      case "T":
                        g = M(O, [A, F], l, r, a), g = k([A, F], d), p = k([T.x, T.y], d), f = [T.x, T.y];
                        break;
                      case "t":
                        d = M(O, [A, F], l, r, a), g = k([A, F], d), p = k([A + T.x, F + T.y], d), f = [T.x + A, T.y + F];
                        break;
                      case "Z":
                      case "z":
                        A = S, F = C, I.push({op: "h"});
                    }
                    var P = b && (1 === O || "mM".indexOf(N) < 0 && "mM".indexOf(l.getItem(O - 1).pathSegTypeAsLetter) >= 0),
                        E = x && (O === l.numberOfItems - 1 || "mM".indexOf(N) < 0 && "mM".indexOf(l.getItem(O + 1).pathSegTypeAsLetter) >= 0),
                        j = m && O > 0 && !(1 === O && "mM".indexOf(l.getItem(O - 1).pathSegTypeAsLetter) >= 0);
                    if ("sScCqQtT".indexOf(N) >= 0)
                      P && _.addMarker(new c(b, [A, F], v([A, F], g))), E && _.addMarker(new c(x, f, v(p, f))), j && (w = n([A, F], g), w = "mM".indexOf(l.getItem(O - 1).pathSegTypeAsLetter) >= 0 ? w : i(s(L, w)), _.addMarker(new c(m, [A, F], Math.atan2(w[1], w[0])))), L = n(p, f), r = A, a = F, g = q(g, e), p = q(p, e), d = q(f, e), I.push({
                        op: "c",
                        c: [g[0], g[1], p[0], p[1], d[0], d[1]]
                      });
                    else if ("lLhHvVmM".indexOf(N) >= 0) {
                      if (w = n([A, F], f), P && _.addMarker(new c(b, [A, F], Math.atan2(w[1], w[0]))), E && _.addMarker(new c(x, f, Math.atan2(w[1], w[0]))), j) {
                        var G = "mM".indexOf(N) >= 0 ? L : "mM".indexOf(l.getItem(O - 1).pathSegTypeAsLetter) >= 0 ? w : i(s(L, w));
                        _.addMarker(new c(m, [A, F], Math.atan2(G[1], G[0])));
                      }
                      L = w, d = q(f, e), I.push({
                        op: y,
                        c: d
                      });
                    }
                    "MLCSQT".indexOf(N) >= 0 ? (A = T.x, F = T.y) : "mlcsqt".indexOf(N) >= 0 ? (A = T.x + A, F = T.y + F) : "zZ".indexOf(N) < 0 && (A = h, F = u);
                  }
                  return {
                    lines: I,
                    markers: _
                  };
                }(0, e);
                y.lines.length > 0 && d.path(y.lines, a, h, u), (x || b || m) && y.markers.draw(e, f);
              },
              G = function(t, e, r) {
                var a = t.getAttribute("href") || t.getAttribute("xlink:href");
                if (a) {
                  var i = d.getFormObject(r.get() + a.substring(1)),
                      n = t.getAttribute("x") || 0,
                      s = t.getAttribute("y") || 0,
                      o = t.getAttribute("width") || i.width,
                      c = t.getAttribute("height") || i.height,
                      h = new d.Matrix(o / i.width || 0, 0, 0, c / i.height || 0, n, s);
                  h = d.matrixMult(h, e), d.doFormObject(r.get() + a.substring(1), h);
                }
              },
              z = function(t, e, r, a) {
                var i = q([parseFloat(t.getAttribute("x1")), parseFloat(t.getAttribute("y1"))], e),
                    n = q([parseFloat(t.getAttribute("x2")), parseFloat(t.getAttribute("y2"))], e);
                "D" === a.strokeMode && d.line(i[0], i[1], n[0], n[1]);
                var s = t.getAttribute("marker-start"),
                    h = t.getAttribute("marker-end");
                if (s || h) {
                  var u = new o,
                      f = v(i, n);
                  s && u.addMarker(new c(r.get() + g.exec(s)[1], i, f)), h && u.addMarker(new c(r.get() + g.exec(h)[1], n, f)), u.draw(d.unitMatrix, a);
                }
              },
              V = function(t, e, r, a) {
                d.roundedRect(parseFloat(t.getAttribute("x")) || 0, parseFloat(t.getAttribute("y")) || 0, parseFloat(t.getAttribute("width")), parseFloat(t.getAttribute("height")), parseFloat(t.getAttribute("rx")) || 0, parseFloat(t.getAttribute("ry")) || 0, e, r, a);
              },
              Y = function(t, e, r, a) {
                d.ellipse(parseFloat(t.getAttribute("cx")) || 0, parseFloat(t.getAttribute("cy")) || 0, parseFloat(t.getAttribute("rx")), parseFloat(t.getAttribute("ry")), e, r, a);
              },
              D = function(t, e, r, a) {
                var i = parseFloat(t.getAttribute("r")) || 0;
                d.ellipse(parseFloat(t.getAttribute("cx")) || 0, parseFloat(t.getAttribute("cy")) || 0, i, i, e, r, a);
              },
              H = function(t, e) {
                switch (x(t, "text-transform")) {
                  case "uppercase":
                    return e.toUpperCase();
                  case "lowercase":
                    return e.toLowerCase();
                  default:
                    return e;
                }
              },
              B = function(t, e, r, a, i) {
                d.saveGraphicsState(), u(t, a);
                var n = function(t, e) {
                  var r;
                  return (r = t && t.toString().match(/^([\-0-9.]+)em$/)) ? parseFloat(r[1]) * e : (r = t && t.toString().match(/^([\-0-9.]+)(px|)$/), r ? parseFloat(r[1]) : 0);
                },
                    s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                s.appendChild(t), s.setAttribute("visibility", "hidden"), document.body.appendChild(s);
                var o,
                    c,
                    h = t.getBBox(),
                    l = 0,
                    g = x(t, "text-anchor");
                g && (l = function(t, e) {
                  var r = 0;
                  switch (t) {
                    case "end":
                      r = e;
                      break;
                    case "middle":
                      r = e / 2;
                  }
                  return r;
                }(g, h.width));
                var p = d.getFontSize(),
                    v = n(t.getAttribute("x"), p),
                    y = n(t.getAttribute("y"), p),
                    k = d.matrixMult(new d.Matrix(1, 0, 0, 1, v, y), e);
                o = n(t.getAttribute("dx"), p), c = n(t.getAttribute("dy"), p);
                var M = x(t, "visibility") || i.visibility;
                0 === t.childElementCount ? "visible" === M && d.text(o - l, c, H(t, S(t.textContent)), void 0, k) : m(t, function(e, r) {
                  if (r.textContent && !b(r, "title,desc,metadata")) {
                    d.saveGraphicsState();
                    var a = x(r, "fill");
                    u(r, a && new f(a));
                    var i = r.getExtentOfChar(0);
                    "visible" === (x(r, "visibility") || M) && d.text(i.x - v, i.y + .7 * i.height - y, H(t, S(r.textContent)), void 0, k), d.restoreGraphicsState();
                  }
                }), document.body.removeChild(s), d.restoreGraphicsState();
              },
              U = function(t, e, r, a, i, n) {
                m(t, function(t, s) {
                  "defs" === s.tagName.toLowerCase() && (Z(s, e, r, a, i, n), s.parentNode.removeChild(s));
                });
              },
              Q = function(t, e, r, a, i, n) {
                var s = a.nextChild(),
                    o = C(r);
                U(t, e, o, s, i, n), X(t, e, o, s, i, n);
              },
              X = function(t, e, r, a, i, n) {
                m(t, function(t, s) {
                  Z(s, e, r, a, i, n);
                });
              },
              W = function(t, e, r, a, i) {
                var n,
                    s = [],
                    o = 0,
                    c = !1;
                m(t, function(t, e) {
                  if ("stop" === e.tagName.toLowerCase()) {
                    var r = new f(x(e, "stop-color"));
                    s.push({
                      offset: parseFloat(e.getAttribute("offset")),
                      color: [r.r, r.g, r.b]
                    });
                    var a = x(e, "stop-opacity");
                    a && 1 != a && (o += parseFloat(a), c = !0);
                  }
                }), c && (n = new d.GState({opacity: o / r.length}));
                var h = new d.ShadingPattern(e, r, s, n),
                    u = i.get() + t.getAttribute("id");
                d.addShadingPattern(u, h), a[u] = t;
              },
              R = function(t, e, r, a) {
                var i = r.get() + t.getAttribute("id");
                e[i] = t;
                var n = N(t),
                    s = new d.TilingPattern([n[0], n[1], n[0] + n[2], n[1] + n[3]], n[2], n[3], null, I(t));
                d.beginTilingPattern(s), X(t, d.unitMatrix, e, r, !1, a), d.endTilingPattern(i, s);
              },
              Z = function(t, e, r, a, i, n) {
                if (n = n.clone(), "none" !== x(t, "display")) {
                  if ("hidden" !== (n.visibility = x(t, "visibility") || n.visibility) || b(t, "svg,g,marker,a,pattern,defs,text")) {
                    var s,
                        o,
                        c = !1,
                        h = null,
                        l = "inherit",
                        p = "inherit",
                        m = null,
                        v = null,
                        y = i && !b(t, "lineargradient,radialgradient,pattern");
                    if (y ? (s = I(t), o = N(t), d.beginFormObject(o[0], o[1], o[2], o[3], s), s = d.unitMatrix, i = !1) : (s = d.matrixMult(I(t), e), d.saveGraphicsState()), b(t, "g,path,rect,text,ellipse,line,circle,polygon")) {
                      var k = x(t, "fill");
                      if (k) {
                        var M = g.exec(k);
                        if (M) {
                          m = a.get() + M[1];
                          var w = F(m, r);
                          if (w && b(w, "lineargradient,radialgradient")) {
                            var A = s;
                            if (!w.hasAttribute("gradientUnits") || "objectboundingbox" === w.getAttribute("gradientUnits").toLowerCase()) {
                              o || (o = N(t)), A = new d.Matrix(o[2], 0, 0, o[3], o[0], o[1]);
                              var S = I(t);
                              A = d.matrixMult(A, S);
                            }
                            var C = L(w.getAttribute("gradientTransform"));
                            v = d.matrixMult(C, A), l = "";
                          } else if (w && b(w, "pattern")) {
                            var _,
                                q,
                                H,
                                Z,
                                $;
                            v = {};
                            var J = d.unitMatrix;
                            w.hasAttribute("patternUnits") && "objectboundingbox" !== w.getAttribute("patternUnits").toLowerCase() || (o || (o = N(t)), J = new d.Matrix(1, 0, 0, 1, o[0], o[1]), _ = N(w), $ = _[0] * o[0], q = _[1] * o[1], H = _[2] * o[2], Z = _[3] * o[3], v.boundingBox = [$, q, $ + H, q + Z], v.xStep = H, v.yStep = Z);
                            var K = d.unitMatrix;
                            w.hasAttribute("patternContentUnits") && "objectboundingbox" === w.getAttribute("patternContentUnits").toLowerCase() && (o || (o = N(t)), K = new d.Matrix(o[2], 0, 0, o[3], 0, 0), _ = v.boundingBox || N(w), $ = _[0] / o[0], q = _[1] / o[1], H = _[2] / o[2], Z = _[3] / o[3], v.boundingBox = [$, q, $ + H, q + Z], v.xStep = H, v.yStep = Z), v.matrix = d.matrixMult(d.matrixMult(K, J), s), l = "F";
                          } else
                            m = w = null, function() {
                              h = new f("rgb(0, 0, 0)"), c = !0, l = "F";
                            }();
                        } else
                          h = T(k), h.ok ? (c = !0, l = "F") : l = "";
                      }
                      var tt = 1,
                          et = x(t, "opacity") || x(t, "fill-opacity") || x(t, "stroke-opacity");
                      et && (tt *= parseFloat(et)), h && "number" == typeof h.a && (tt *= h.a), d.setGState(new d.GState({opacity: tt}));
                    }
                    if (b(t, "g,path,rect,ellipse,line,circle,polygon")) {
                      c && (n.fill = h, d.setFillColor(h.r, h.g, h.b));
                      var rt = x(t, "stroke");
                      if (rt) {
                        var at = x(t, "stroke-width");
                        void 0 !== at && "" !== at && (at = Math.abs(parseFloat(at)), n.strokeWidth = at, d.setLineWidth(at));
                        var it = new f(rt);
                        it.ok && (n.color = it, d.setDrawColor(it.r, it.g, it.b), p = 0 !== at ? "D" : "");
                        var nt = x(t, "stroke-linecap");
                        nt && d.setLineCap(n.strokeLinecap = nt);
                        var st = x(t, "stroke-linejoin");
                        st && d.setLineJoin(n.strokeLinejoin = st);
                        var ot = x(t, "stroke-dasharray");
                        if (ot) {
                          ot = O(ot);
                          var ct = parseInt(x(t, "stroke-dashoffset")) || 0;
                          n.strokeDasharray = ot, n.strokeDashoffset = ct, d.setLineDashPattern(ot, ct);
                        }
                        var ht = x(t, "stroke-miterlimit");
                        void 0 !== ht && "" !== ht && d.setLineMiterLimit(n.strokeMiterlimit = parseFloat(ht));
                      }
                    }
                    l = n.fillMode = "inherit" === l ? n.fillMode : l, p = n.strokeMode = "inherit" === p ? n.strokeMode : p;
                    var ut = l + p;
                    switch (u(t, h), t.tagName.toLowerCase()) {
                      case "svg":
                        Q(t, s, r, a, i, n);
                        break;
                      case "g":
                        U(t, s, r, a, i, n);
                      case "a":
                      case "marker":
                        X(t, s, r, a, i, n);
                        break;
                      case "defs":
                        X(t, s, r, a, !0, n);
                        break;
                      case "use":
                        G(t, s, a);
                        break;
                      case "line":
                        z(t, s, a, n);
                        break;
                      case "rect":
                        d.setCurrentTransformationMatrix(s), V(t, ut, m, v);
                        break;
                      case "ellipse":
                        d.setCurrentTransformationMatrix(s), Y(t, ut, m, v);
                        break;
                      case "circle":
                        d.setCurrentTransformationMatrix(s), D(t, ut, m, v);
                        break;
                      case "text":
                        B(t, s, 0, h, n);
                        break;
                      case "path":
                        j(t, s, a, ut, m, v, n);
                        break;
                      case "polygon":
                        P(t, s, ut, m, v, a, n);
                        break;
                      case "image":
                        d.setCurrentTransformationMatrix(s), E(t);
                        break;
                      case "lineargradient":
                        W(t, "axial", [t.getAttribute("x1"), t.getAttribute("y1"), t.getAttribute("x2"), t.getAttribute("y2")], r, a);
                        break;
                      case "radialgradient":
                        W(t, "radial", [t.getAttribute("fx") || t.getAttribute("cx"), t.getAttribute("fy") || t.getAttribute("cy"), 0, t.getAttribute("cx") || 0, t.getAttribute("cy") || 0, t.getAttribute("r") || 0], r, a);
                        break;
                      case "pattern":
                        R(t, r, a, n);
                    }
                    y ? d.endFormObject(a.get() + t.getAttribute("id")) : d.restoreGraphicsState();
                  }
                }
              },
              $ = function(t, e, r) {
                d = e;
                var a = r.scale || 1,
                    i = r.xOffset || 0,
                    n = r.yOffset || 0;
                d.saveGraphicsState(), d.setCurrentTransformationMatrix(new d.Matrix(a, 0, 0, a, i, n));
                var s = new A;
                d.setLineWidth(s.strokeWidth);
                var o = s.fill;
                return d.setFillColor(o.r, o.g, o.b), d.setFont(s.fontFamily), d.setFontSize(s.fontSize), Z(t.cloneNode(!0), d.unitMatrix, {}, new w(""), !1, s), d.restoreGraphicsState(), d;
              };
          "function" == typeof t && t.amd ? t(["./rgbcolor", "SvgPath"], function(t, e) {
            return f = t, l = e, $;
          }) : void 0 !== r && r.exports ? (f = e("./rgbcolor.js"), l = e("SvgPath"), r.exports = $) : (l = a.SvgPath, f = a.RGBColor, a.svg2pdf = $, a.svgElementToPdf = $);
        }("undefined" != typeof self && self || "undefined" != typeof window && window || this);
      }, {
        "./rgbcolor.js": 8,
        SvgPath: 1
      }]
    }, {}, [9])(9);
  });
})(require('process'));
