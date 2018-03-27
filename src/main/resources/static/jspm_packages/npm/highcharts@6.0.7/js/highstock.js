/* */ 
(function(process) {
  (function(R, K) {
    "object" === typeof module && module.exports ? module.exports = R.document ? K(R) : K : R.Highcharts = K(R);
  })("undefined" !== typeof window ? window : this, function(R) {
    var K = function() {
      var a = "undefined" === typeof R ? window : R,
          D = a.document,
          F = a.navigator && a.navigator.userAgent || "",
          G = D && D.createElementNS && !!D.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
          v = /(edge|msie|trident)/i.test(F) && !a.opera,
          m = -1 !== F.indexOf("Firefox"),
          g = -1 !== F.indexOf("Chrome"),
          t = m && 4 > parseInt(F.split("Firefox/")[1], 10);
      return a.Highcharts ? a.Highcharts.error(16, !0) : {
        product: "Highstock",
        version: "6.0.7",
        deg2rad: 2 * Math.PI / 360,
        doc: D,
        hasBidiBug: t,
        hasTouch: D && void 0 !== D.documentElement.ontouchstart,
        isMS: v,
        isWebKit: -1 !== F.indexOf("AppleWebKit"),
        isFirefox: m,
        isChrome: g,
        isSafari: !g && -1 !== F.indexOf("Safari"),
        isTouchDevice: /(Mobile|Android|Windows Phone)/.test(F),
        SVG_NS: "http://www.w3.org/2000/svg",
        chartCount: 0,
        seriesTypes: {},
        symbolSizes: {},
        svg: G,
        win: a,
        marginNames: ["plotTop", "marginRight", "marginBottom", "plotLeft"],
        noop: function() {},
        charts: []
      };
    }();
    (function(a) {
      a.timers = [];
      var D = a.charts,
          F = a.doc,
          G = a.win;
      a.error = function(v, m) {
        v = a.isNumber(v) ? "Highcharts error #" + v + ": www.highcharts.com/errors/" + v : v;
        if (m)
          throw Error(v);
        G.console && console.log(v);
      };
      a.Fx = function(a, m, g) {
        this.options = m;
        this.elem = a;
        this.prop = g;
      };
      a.Fx.prototype = {
        dSetter: function() {
          var a = this.paths[0],
              m = this.paths[1],
              g = [],
              t = this.now,
              y = a.length,
              w;
          if (1 === t)
            g = this.toD;
          else if (y === m.length && 1 > t)
            for (; y--; )
              w = parseFloat(a[y]), g[y] = isNaN(w) ? m[y] : t * parseFloat(m[y] - w) + w;
          else
            g = m;
          this.elem.attr("d", g, null, !0);
        },
        update: function() {
          var a = this.elem,
              m = this.prop,
              g = this.now,
              t = this.options.step;
          if (this[m + "Setter"])
            this[m + "Setter"]();
          else
            a.attr ? a.element && a.attr(m, g, null, !0) : a.style[m] = g + this.unit;
          t && t.call(a, g, this);
        },
        run: function(v, m, g) {
          var t = this,
              y = t.options,
              w = function(a) {
                return w.stopped ? !1 : t.step(a);
              },
              r = G.requestAnimationFrame || function(a) {
                setTimeout(a, 13);
              },
              f = function() {
                for (var c = 0; c < a.timers.length; c++)
                  a.timers[c]() || a.timers.splice(c--, 1);
                a.timers.length && r(f);
              };
          v === m ? (delete y.curAnim[this.prop], y.complete && 0 === a.keys(y.curAnim).length && y.complete.call(this.elem)) : (this.startTime = +new Date, this.start = v, this.end = m, this.unit = g, this.now = this.start, this.pos = 0, w.elem = this.elem, w.prop = this.prop, w() && 1 === a.timers.push(w) && r(f));
        },
        step: function(v) {
          var m = +new Date,
              g,
              t = this.options,
              y = this.elem,
              w = t.complete,
              r = t.duration,
              f = t.curAnim;
          y.attr && !y.element ? v = !1 : v || m >= r + this.startTime ? (this.now = this.end, this.pos = 1, this.update(), g = f[this.prop] = !0, a.objectEach(f, function(a) {
            !0 !== a && (g = !1);
          }), g && w && w.call(y), v = !1) : (this.pos = t.easing((m - this.startTime) / r), this.now = this.start + (this.end - this.start) * this.pos, this.update(), v = !0);
          return v;
        },
        initPath: function(v, m, g) {
          function t(a) {
            var b,
                n;
            for (B = a.length; B--; )
              b = "M" === a[B] || "L" === a[B], n = /[a-zA-Z]/.test(a[B + 3]), b && n && a.splice(B + 1, 0, a[B + 1], a[B + 2], a[B + 1], a[B + 2]);
          }
          function y(a, n) {
            for (; a.length < h; ) {
              a[0] = n[h - a.length];
              var u = a.slice(0, b);
              [].splice.apply(a, [0, 0].concat(u));
              d && (u = a.slice(a.length - b), [].splice.apply(a, [a.length, 0].concat(u)), B--);
            }
            a[0] = "M";
          }
          function w(a, u) {
            for (var c = (h - a.length) / b; 0 < c && c--; )
              n = a.slice().splice(a.length / C - b, b * C), n[0] = u[h - b - c * b], A && (n[b - 6] = n[b - 2], n[b - 5] = n[b - 1]), [].splice.apply(a, [a.length / C, 0].concat(n)), d && c--;
          }
          m = m || "";
          var r,
              f = v.startX,
              c = v.endX,
              A = -1 < m.indexOf("C"),
              b = A ? 7 : 3,
              h,
              n,
              B;
          m = m.split(" ");
          g = g.slice();
          var d = v.isArea,
              C = d ? 2 : 1,
              I;
          A && (t(m), t(g));
          if (f && c) {
            for (B = 0; B < f.length; B++)
              if (f[B] === c[0]) {
                r = B;
                break;
              } else if (f[0] === c[c.length - f.length + B]) {
                r = B;
                I = !0;
                break;
              }
            void 0 === r && (m = []);
          }
          m.length && a.isNumber(r) && (h = g.length + r * C * b, I ? (y(m, g), w(g, m)) : (y(g, m), w(m, g)));
          return [m, g];
        }
      };
      a.Fx.prototype.fillSetter = a.Fx.prototype.strokeSetter = function() {
        this.elem.attr(this.prop, a.color(this.start).tweenTo(a.color(this.end), this.pos), null, !0);
      };
      a.merge = function() {
        var v,
            m = arguments,
            g,
            t = {},
            y = function(g, r) {
              "object" !== typeof g && (g = {});
              a.objectEach(r, function(f, c) {
                !a.isObject(f, !0) || a.isClass(f) || a.isDOMElement(f) ? g[c] = r[c] : g[c] = y(g[c] || {}, f);
              });
              return g;
            };
        !0 === m[0] && (t = m[1], m = Array.prototype.slice.call(m, 2));
        g = m.length;
        for (v = 0; v < g; v++)
          t = y(t, m[v]);
        return t;
      };
      a.pInt = function(a, m) {
        return parseInt(a, m || 10);
      };
      a.isString = function(a) {
        return "string" === typeof a;
      };
      a.isArray = function(a) {
        a = Object.prototype.toString.call(a);
        return "[object Array]" === a || "[object Array Iterator]" === a;
      };
      a.isObject = function(v, m) {
        return !!v && "object" === typeof v && (!m || !a.isArray(v));
      };
      a.isDOMElement = function(v) {
        return a.isObject(v) && "number" === typeof v.nodeType;
      };
      a.isClass = function(v) {
        var m = v && v.constructor;
        return !(!a.isObject(v, !0) || a.isDOMElement(v) || !m || !m.name || "Object" === m.name);
      };
      a.isNumber = function(a) {
        return "number" === typeof a && !isNaN(a) && Infinity > a && -Infinity < a;
      };
      a.erase = function(a, m) {
        for (var g = a.length; g--; )
          if (a[g] === m) {
            a.splice(g, 1);
            break;
          }
      };
      a.defined = function(a) {
        return void 0 !== a && null !== a;
      };
      a.attr = function(v, m, g) {
        var t;
        a.isString(m) ? a.defined(g) ? v.setAttribute(m, g) : v && v.getAttribute && (t = v.getAttribute(m)) : a.defined(m) && a.isObject(m) && a.objectEach(m, function(a, g) {
          v.setAttribute(g, a);
        });
        return t;
      };
      a.splat = function(v) {
        return a.isArray(v) ? v : [v];
      };
      a.syncTimeout = function(a, m, g) {
        if (m)
          return setTimeout(a, m, g);
        a.call(0, g);
      };
      a.extend = function(a, m) {
        var g;
        a || (a = {});
        for (g in m)
          a[g] = m[g];
        return a;
      };
      a.pick = function() {
        var a = arguments,
            m,
            g,
            t = a.length;
        for (m = 0; m < t; m++)
          if (g = a[m], void 0 !== g && null !== g)
            return g;
      };
      a.css = function(v, m) {
        a.isMS && !a.svg && m && void 0 !== m.opacity && (m.filter = "alpha(opacity\x3d" + 100 * m.opacity + ")");
        a.extend(v.style, m);
      };
      a.createElement = function(v, m, g, t, y) {
        v = F.createElement(v);
        var w = a.css;
        m && a.extend(v, m);
        y && w(v, {
          padding: 0,
          border: "none",
          margin: 0
        });
        g && w(v, g);
        t && t.appendChild(v);
        return v;
      };
      a.extendClass = function(v, m) {
        var g = function() {};
        g.prototype = new v;
        a.extend(g.prototype, m);
        return g;
      };
      a.pad = function(a, m, g) {
        return Array((m || 2) + 1 - String(a).length).join(g || 0) + a;
      };
      a.relativeLength = function(a, m, g) {
        return /%$/.test(a) ? m * parseFloat(a) / 100 + (g || 0) : parseFloat(a);
      };
      a.wrap = function(a, m, g) {
        var t = a[m];
        a[m] = function() {
          var a = Array.prototype.slice.call(arguments),
              w = arguments,
              r = this;
          r.proceed = function() {
            t.apply(r, arguments.length ? arguments : w);
          };
          a.unshift(t);
          a = g.apply(this, a);
          r.proceed = null;
          return a;
        };
      };
      a.formatSingle = function(v, m, g) {
        var t = /\.([0-9])/,
            y = a.defaultOptions.lang;
        /f$/.test(v) ? (g = (g = v.match(t)) ? g[1] : -1, null !== m && (m = a.numberFormat(m, g, y.decimalPoint, -1 < v.indexOf(",") ? y.thousandsSep : ""))) : m = (g || a.time).dateFormat(v, m);
        return m;
      };
      a.format = function(v, m, g) {
        for (var t = "{",
            y = !1,
            w,
            r,
            f,
            c,
            A = [],
            b; v; ) {
          t = v.indexOf(t);
          if (-1 === t)
            break;
          w = v.slice(0, t);
          if (y) {
            w = w.split(":");
            r = w.shift().split(".");
            c = r.length;
            b = m;
            for (f = 0; f < c; f++)
              b && (b = b[r[f]]);
            w.length && (b = a.formatSingle(w.join(":"), b, g));
            A.push(b);
          } else
            A.push(w);
          v = v.slice(t + 1);
          t = (y = !y) ? "}" : "{";
        }
        A.push(v);
        return A.join("");
      };
      a.getMagnitude = function(a) {
        return Math.pow(10, Math.floor(Math.log(a) / Math.LN10));
      };
      a.normalizeTickInterval = function(v, m, g, t, y) {
        var w,
            r = v;
        g = a.pick(g, 1);
        w = v / g;
        m || (m = y ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === t && (1 === g ? m = a.grep(m, function(a) {
          return 0 === a % 1;
        }) : .1 >= g && (m = [1 / g])));
        for (t = 0; t < m.length && !(r = m[t], y && r * g >= v || !y && w <= (m[t] + (m[t + 1] || m[t])) / 2); t++)
          ;
        return r = a.correctFloat(r * g, -Math.round(Math.log(.001) / Math.LN10));
      };
      a.stableSort = function(a, m) {
        var g = a.length,
            t,
            y;
        for (y = 0; y < g; y++)
          a[y].safeI = y;
        a.sort(function(a, r) {
          t = m(a, r);
          return 0 === t ? a.safeI - r.safeI : t;
        });
        for (y = 0; y < g; y++)
          delete a[y].safeI;
      };
      a.arrayMin = function(a) {
        for (var m = a.length,
            g = a[0]; m--; )
          a[m] < g && (g = a[m]);
        return g;
      };
      a.arrayMax = function(a) {
        for (var m = a.length,
            g = a[0]; m--; )
          a[m] > g && (g = a[m]);
        return g;
      };
      a.destroyObjectProperties = function(v, m) {
        a.objectEach(v, function(a, t) {
          a && a !== m && a.destroy && a.destroy();
          delete v[t];
        });
      };
      a.discardElement = function(v) {
        var m = a.garbageBin;
        m || (m = a.createElement("div"));
        v && m.appendChild(v);
        m.innerHTML = "";
      };
      a.correctFloat = function(a, m) {
        return parseFloat(a.toPrecision(m || 14));
      };
      a.setAnimation = function(v, m) {
        m.renderer.globalAnimation = a.pick(v, m.options.chart.animation, !0);
      };
      a.animObject = function(v) {
        return a.isObject(v) ? a.merge(v) : {duration: v ? 500 : 0};
      };
      a.timeUnits = {
        millisecond: 1,
        second: 1E3,
        minute: 6E4,
        hour: 36E5,
        day: 864E5,
        week: 6048E5,
        month: 24192E5,
        year: 314496E5
      };
      a.numberFormat = function(v, m, g, t) {
        v = +v || 0;
        m = +m;
        var y = a.defaultOptions.lang,
            w = (v.toString().split(".")[1] || "").split("e")[0].length,
            r,
            f,
            c = v.toString().split("e");
        -1 === m ? m = Math.min(w, 20) : a.isNumber(m) ? m && c[1] && 0 > c[1] && (r = m + +c[1], 0 <= r ? (c[0] = (+c[0]).toExponential(r).split("e")[0], m = r) : (c[0] = c[0].split(".")[0] || 0, v = 20 > m ? (c[0] * Math.pow(10, c[1])).toFixed(m) : 0, c[1] = 0)) : m = 2;
        f = (Math.abs(c[1] ? c[0] : v) + Math.pow(10, -Math.max(m, w) - 1)).toFixed(m);
        w = String(a.pInt(f));
        r = 3 < w.length ? w.length % 3 : 0;
        g = a.pick(g, y.decimalPoint);
        t = a.pick(t, y.thousandsSep);
        v = (0 > v ? "-" : "") + (r ? w.substr(0, r) + t : "");
        v += w.substr(r).replace(/(\d{3})(?=\d)/g, "$1" + t);
        m && (v += g + f.slice(-m));
        c[1] && 0 !== +v && (v += "e" + c[1]);
        return v;
      };
      Math.easeInOutSine = function(a) {
        return -.5 * (Math.cos(Math.PI * a) - 1);
      };
      a.getStyle = function(v, m, g) {
        if ("width" === m)
          return Math.min(v.offsetWidth, v.scrollWidth) - a.getStyle(v, "padding-left") - a.getStyle(v, "padding-right");
        if ("height" === m)
          return Math.min(v.offsetHeight, v.scrollHeight) - a.getStyle(v, "padding-top") - a.getStyle(v, "padding-bottom");
        G.getComputedStyle || a.error(27, !0);
        if (v = G.getComputedStyle(v, void 0))
          v = v.getPropertyValue(m), a.pick(g, "opacity" !== m) && (v = a.pInt(v));
        return v;
      };
      a.inArray = function(v, m) {
        return (a.indexOfPolyfill || Array.prototype.indexOf).call(m, v);
      };
      a.grep = function(v, m) {
        return (a.filterPolyfill || Array.prototype.filter).call(v, m);
      };
      a.find = Array.prototype.find ? function(a, m) {
        return a.find(m);
      } : function(a, m) {
        var g,
            t = a.length;
        for (g = 0; g < t; g++)
          if (m(a[g], g))
            return a[g];
      };
      a.map = function(a, m) {
        for (var g = [],
            t = 0,
            y = a.length; t < y; t++)
          g[t] = m.call(a[t], a[t], t, a);
        return g;
      };
      a.keys = function(v) {
        return (a.keysPolyfill || Object.keys).call(void 0, v);
      };
      a.reduce = function(v, m, g) {
        return (a.reducePolyfill || Array.prototype.reduce).call(v, m, g);
      };
      a.offset = function(a) {
        var m = F.documentElement;
        a = a.parentElement ? a.getBoundingClientRect() : {
          top: 0,
          left: 0
        };
        return {
          top: a.top + (G.pageYOffset || m.scrollTop) - (m.clientTop || 0),
          left: a.left + (G.pageXOffset || m.scrollLeft) - (m.clientLeft || 0)
        };
      };
      a.stop = function(v, m) {
        for (var g = a.timers.length; g--; )
          a.timers[g].elem !== v || m && m !== a.timers[g].prop || (a.timers[g].stopped = !0);
      };
      a.each = function(v, m, g) {
        return (a.forEachPolyfill || Array.prototype.forEach).call(v, m, g);
      };
      a.objectEach = function(a, m, g) {
        for (var t in a)
          a.hasOwnProperty(t) && m.call(g, a[t], t, a);
      };
      a.isPrototype = function(v) {
        return v === a.Axis.prototype || v === a.Chart.prototype || v === a.Point.prototype || v === a.Series.prototype || v === a.Tick.prototype;
      };
      a.addEvent = function(v, m, g) {
        var t,
            y = v.addEventListener || a.addEventListenerPolyfill;
        t = a.isPrototype(v) ? "protoEvents" : "hcEvents";
        t = v[t] = v[t] || {};
        y && y.call(v, m, g, !1);
        t[m] || (t[m] = []);
        t[m].push(g);
        return function() {
          a.removeEvent(v, m, g);
        };
      };
      a.removeEvent = function(v, m, g) {
        function t(f, c) {
          var r = v.removeEventListener || a.removeEventListenerPolyfill;
          r && r.call(v, f, c, !1);
        }
        function y(f) {
          var c,
              r;
          v.nodeName && (m ? (c = {}, c[m] = !0) : c = f, a.objectEach(c, function(a, h) {
            if (f[h])
              for (r = f[h].length; r--; )
                t(h, f[h][r]);
          }));
        }
        var w,
            r;
        a.each(["protoEvents", "hcEvents"], function(f) {
          var c = v[f];
          c && (m ? (w = c[m] || [], g ? (r = a.inArray(g, w), -1 < r && (w.splice(r, 1), c[m] = w), t(m, g)) : (y(c), c[m] = [])) : (y(c), v[f] = {}));
        });
      };
      a.fireEvent = function(v, m, g, t) {
        var y,
            w,
            r,
            f,
            c;
        g = g || {};
        F.createEvent && (v.dispatchEvent || v.fireEvent) ? (y = F.createEvent("Events"), y.initEvent(m, !0, !0), a.extend(y, g), v.dispatchEvent ? v.dispatchEvent(y) : v.fireEvent(m, y)) : a.each(["protoEvents", "hcEvents"], function(A) {
          if (v[A])
            for (w = v[A][m] || [], r = w.length, g.target || a.extend(g, {
              preventDefault: function() {
                g.defaultPrevented = !0;
              },
              target: v,
              type: m
            }), f = 0; f < r; f++)
              (c = w[f]) && !1 === c.call(v, g) && g.preventDefault();
        });
        t && !g.defaultPrevented && t(g);
      };
      a.animate = function(v, m, g) {
        var t,
            y = "",
            w,
            r,
            f;
        a.isObject(g) || (f = arguments, g = {
          duration: f[2],
          easing: f[3],
          complete: f[4]
        });
        a.isNumber(g.duration) || (g.duration = 400);
        g.easing = "function" === typeof g.easing ? g.easing : Math[g.easing] || Math.easeInOutSine;
        g.curAnim = a.merge(m);
        a.objectEach(m, function(c, f) {
          a.stop(v, f);
          r = new a.Fx(v, g, f);
          w = null;
          "d" === f ? (r.paths = r.initPath(v, v.d, m.d), r.toD = m.d, t = 0, w = 1) : v.attr ? t = v.attr(f) : (t = parseFloat(a.getStyle(v, f)) || 0, "opacity" !== f && (y = "px"));
          w || (w = c);
          w && w.match && w.match("px") && (w = w.replace(/px/g, ""));
          r.run(t, w, y);
        });
      };
      a.seriesType = function(v, m, g, t, y) {
        var w = a.getOptions(),
            r = a.seriesTypes;
        w.plotOptions[v] = a.merge(w.plotOptions[m], g);
        r[v] = a.extendClass(r[m] || function() {}, t);
        r[v].prototype.type = v;
        y && (r[v].prototype.pointClass = a.extendClass(a.Point, y));
        return r[v];
      };
      a.uniqueKey = function() {
        var a = Math.random().toString(36).substring(2, 9),
            m = 0;
        return function() {
          return "highcharts-" + a + "-" + m++;
        };
      }();
      G.jQuery && (G.jQuery.fn.highcharts = function() {
        var v = [].slice.call(arguments);
        if (this[0])
          return v[0] ? (new (a[a.isString(v[0]) ? v.shift() : "Chart"])(this[0], v[0], v[1]), this) : D[a.attr(this[0], "data-highcharts-chart")];
      });
    })(K);
    (function(a) {
      var D = a.each,
          F = a.isNumber,
          G = a.map,
          v = a.merge,
          m = a.pInt;
      a.Color = function(g) {
        if (!(this instanceof a.Color))
          return new a.Color(g);
        this.init(g);
      };
      a.Color.prototype = {
        parsers: [{
          regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
          parse: function(a) {
            return [m(a[1]), m(a[2]), m(a[3]), parseFloat(a[4], 10)];
          }
        }, {
          regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
          parse: function(a) {
            return [m(a[1]), m(a[2]), m(a[3]), 1];
          }
        }],
        names: {
          none: "rgba(255,255,255,0)",
          white: "#ffffff",
          black: "#000000"
        },
        init: function(g) {
          var t,
              y,
              w,
              r;
          if ((this.input = g = this.names[g && g.toLowerCase ? g.toLowerCase() : ""] || g) && g.stops)
            this.stops = G(g.stops, function(f) {
              return new a.Color(f[1]);
            });
          else if (g && g.charAt && "#" === g.charAt() && (t = g.length, g = parseInt(g.substr(1), 16), 7 === t ? y = [(g & 16711680) >> 16, (g & 65280) >> 8, g & 255, 1] : 4 === t && (y = [(g & 3840) >> 4 | (g & 3840) >> 8, (g & 240) >> 4 | g & 240, (g & 15) << 4 | g & 15, 1])), !y)
            for (w = this.parsers.length; w-- && !y; )
              r = this.parsers[w], (t = r.regex.exec(g)) && (y = r.parse(t));
          this.rgba = y || [];
        },
        get: function(a) {
          var g = this.input,
              y = this.rgba,
              w;
          this.stops ? (w = v(g), w.stops = [].concat(w.stops), D(this.stops, function(r, f) {
            w.stops[f] = [w.stops[f][0], r.get(a)];
          })) : w = y && F(y[0]) ? "rgb" === a || !a && 1 === y[3] ? "rgb(" + y[0] + "," + y[1] + "," + y[2] + ")" : "a" === a ? y[3] : "rgba(" + y.join(",") + ")" : g;
          return w;
        },
        brighten: function(a) {
          var g,
              y = this.rgba;
          if (this.stops)
            D(this.stops, function(g) {
              g.brighten(a);
            });
          else if (F(a) && 0 !== a)
            for (g = 0; 3 > g; g++)
              y[g] += m(255 * a), 0 > y[g] && (y[g] = 0), 255 < y[g] && (y[g] = 255);
          return this;
        },
        setOpacity: function(a) {
          this.rgba[3] = a;
          return this;
        },
        tweenTo: function(a, t) {
          var g = this.rgba,
              w = a.rgba;
          w.length && g && g.length ? (a = 1 !== w[3] || 1 !== g[3], t = (a ? "rgba(" : "rgb(") + Math.round(w[0] + (g[0] - w[0]) * (1 - t)) + "," + Math.round(w[1] + (g[1] - w[1]) * (1 - t)) + "," + Math.round(w[2] + (g[2] - w[2]) * (1 - t)) + (a ? "," + (w[3] + (g[3] - w[3]) * (1 - t)) : "") + ")") : t = a.input || "none";
          return t;
        }
      };
      a.color = function(g) {
        return new a.Color(g);
      };
    })(K);
    (function(a) {
      var D,
          F,
          G = a.addEvent,
          v = a.animate,
          m = a.attr,
          g = a.charts,
          t = a.color,
          y = a.css,
          w = a.createElement,
          r = a.defined,
          f = a.deg2rad,
          c = a.destroyObjectProperties,
          A = a.doc,
          b = a.each,
          h = a.extend,
          n = a.erase,
          B = a.grep,
          d = a.hasTouch,
          C = a.inArray,
          I = a.isArray,
          z = a.isFirefox,
          u = a.isMS,
          x = a.isObject,
          p = a.isString,
          H = a.isWebKit,
          k = a.merge,
          E = a.noop,
          J = a.objectEach,
          e = a.pick,
          l = a.pInt,
          N = a.removeEvent,
          q = a.splat,
          L = a.stop,
          V = a.svg,
          P = a.SVG_NS,
          O = a.symbolSizes,
          M = a.win;
      D = a.SVGElement = function() {
        return this;
      };
      h(D.prototype, {
        opacity: 1,
        SVG_NS: P,
        textProps: "direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline".split(" "),
        init: function(a, e) {
          this.element = "span" === e ? w(e) : A.createElementNS(this.SVG_NS, e);
          this.renderer = a;
        },
        animate: function(l, q, k) {
          q = a.animObject(e(q, this.renderer.globalAnimation, !0));
          0 !== q.duration ? (k && (q.complete = k), v(this, l, q)) : (this.attr(l, null, k), q.step && q.step.call(this));
          return this;
        },
        colorGradient: function(e, l, q) {
          var p = this.renderer,
              n,
              d,
              h,
              u,
              c,
              f,
              E,
              Q,
              H,
              x,
              z = [],
              B;
          e.radialGradient ? d = "radialGradient" : e.linearGradient && (d = "linearGradient");
          d && (h = e[d], c = p.gradients, E = e.stops, x = q.radialReference, I(h) && (e[d] = h = {
            x1: h[0],
            y1: h[1],
            x2: h[2],
            y2: h[3],
            gradientUnits: "userSpaceOnUse"
          }), "radialGradient" === d && x && !r(h.gradientUnits) && (u = h, h = k(h, p.getRadialAttr(x, u), {gradientUnits: "userSpaceOnUse"})), J(h, function(a, e) {
            "id" !== e && z.push(e, a);
          }), J(E, function(a) {
            z.push(a);
          }), z = z.join(","), c[z] ? x = c[z].attr("id") : (h.id = x = a.uniqueKey(), c[z] = f = p.createElement(d).attr(h).add(p.defs), f.radAttr = u, f.stops = [], b(E, function(e) {
            0 === e[1].indexOf("rgba") ? (n = a.color(e[1]), Q = n.get("rgb"), H = n.get("a")) : (Q = e[1], H = 1);
            e = p.createElement("stop").attr({
              offset: e[0],
              "stop-color": Q,
              "stop-opacity": H
            }).add(f);
            f.stops.push(e);
          })), B = "url(" + p.url + "#" + x + ")", q.setAttribute(l, B), q.gradient = z, e.toString = function() {
            return B;
          });
        },
        applyTextOutline: function(e) {
          var l = this.element,
              q,
              k,
              p,
              d,
              h;
          -1 !== e.indexOf("contrast") && (e = e.replace(/contrast/g, this.renderer.getContrast(l.style.fill)));
          e = e.split(" ");
          k = e[e.length - 1];
          if ((p = e[0]) && "none" !== p && a.svg) {
            this.fakeTS = !0;
            e = [].slice.call(l.getElementsByTagName("tspan"));
            this.ySetter = this.xSetter;
            p = p.replace(/(^[\d\.]+)(.*?)$/g, function(a, e, l) {
              return 2 * e + l;
            });
            for (h = e.length; h--; )
              q = e[h], "highcharts-text-outline" === q.getAttribute("class") && n(e, l.removeChild(q));
            d = l.firstChild;
            b(e, function(a, e) {
              0 === e && (a.setAttribute("x", l.getAttribute("x")), e = l.getAttribute("y"), a.setAttribute("y", e || 0), null === e && l.setAttribute("y", 0));
              a = a.cloneNode(1);
              m(a, {
                "class": "highcharts-text-outline",
                fill: k,
                stroke: k,
                "stroke-width": p,
                "stroke-linejoin": "round"
              });
              l.insertBefore(a, d);
            });
          }
        },
        attr: function(a, e, l, q) {
          var k,
              p = this.element,
              d,
              n = this,
              b,
              h;
          "string" === typeof a && void 0 !== e && (k = a, a = {}, a[k] = e);
          "string" === typeof a ? n = (this[a + "Getter"] || this._defaultGetter).call(this, a, p) : (J(a, function(e, l) {
            b = !1;
            q || L(this, l);
            this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)$/.test(l) && (d || (this.symbolAttr(a), d = !0), b = !0);
            !this.rotation || "x" !== l && "y" !== l || (this.doTransform = !0);
            b || (h = this[l + "Setter"] || this._defaultSetter, h.call(this, e, l, p));
          }, this), this.afterSetters());
          l && l.call(this);
          return n;
        },
        afterSetters: function() {
          this.doTransform && (this.updateTransform(), this.doTransform = !1);
        },
        addClass: function(a, e) {
          var l = this.attr("class") || "";
          -1 === l.indexOf(a) && (e || (a = (l + (l ? " " : "") + a).replace("  ", " ")), this.attr("class", a));
          return this;
        },
        hasClass: function(a) {
          return -1 !== C(a, (this.attr("class") || "").split(" "));
        },
        removeClass: function(a) {
          return this.attr("class", (this.attr("class") || "").replace(a, ""));
        },
        symbolAttr: function(a) {
          var l = this;
          b("x y r start end width height innerR anchorX anchorY".split(" "), function(q) {
            l[q] = e(a[q], l[q]);
          });
          l.attr({d: l.renderer.symbols[l.symbolName](l.x, l.y, l.width, l.height, l)});
        },
        clip: function(a) {
          return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : "none");
        },
        crisp: function(a, e) {
          var l;
          e = e || a.strokeWidth || 0;
          l = Math.round(e) % 2 / 2;
          a.x = Math.floor(a.x || this.x || 0) + l;
          a.y = Math.floor(a.y || this.y || 0) + l;
          a.width = Math.floor((a.width || this.width || 0) - 2 * l);
          a.height = Math.floor((a.height || this.height || 0) - 2 * l);
          r(a.strokeWidth) && (a.strokeWidth = e);
          return a;
        },
        css: function(a) {
          var e = this.styles,
              q = {},
              k = this.element,
              p,
              d = "",
              n,
              b = !e,
              u = ["textOutline", "textOverflow", "width"];
          a && a.color && (a.fill = a.color);
          e && J(a, function(a, l) {
            a !== e[l] && (q[l] = a, b = !0);
          });
          b && (e && (a = h(e, q)), p = this.textWidth = a && a.width && "auto" !== a.width && "text" === k.nodeName.toLowerCase() && l(a.width), this.styles = a, p && !V && this.renderer.forExport && delete a.width, k.namespaceURI === this.SVG_NS ? (n = function(a, e) {
            return "-" + e.toLowerCase();
          }, J(a, function(a, e) {
            -1 === C(e, u) && (d += e.replace(/([A-Z])/g, n) + ":" + a + ";");
          }), d && m(k, "style", d)) : y(k, a), this.added && ("text" === this.element.nodeName && this.renderer.buildText(this), a && a.textOutline && this.applyTextOutline(a.textOutline)));
          return this;
        },
        getStyle: function(a) {
          return M.getComputedStyle(this.element || this, "").getPropertyValue(a);
        },
        strokeWidth: function() {
          var a = this.getStyle("stroke-width"),
              e;
          a.indexOf("px") === a.length - 2 ? a = l(a) : (e = A.createElementNS(P, "rect"), m(e, {
            width: a,
            "stroke-width": 0
          }), this.element.parentNode.appendChild(e), a = e.getBBox().width, e.parentNode.removeChild(e));
          return a;
        },
        on: function(a, e) {
          var l = this,
              q = l.element;
          d && "click" === a ? (q.ontouchstart = function(a) {
            l.touchEventFired = Date.now();
            a.preventDefault();
            e.call(q, a);
          }, q.onclick = function(a) {
            (-1 === M.navigator.userAgent.indexOf("Android") || 1100 < Date.now() - (l.touchEventFired || 0)) && e.call(q, a);
          }) : q["on" + a] = e;
          return this;
        },
        setRadialReference: function(a) {
          var e = this.renderer.gradients[this.element.gradient];
          this.element.radialReference = a;
          e && e.radAttr && e.animate(this.renderer.getRadialAttr(a, e.radAttr));
          return this;
        },
        translate: function(a, e) {
          return this.attr({
            translateX: a,
            translateY: e
          });
        },
        invert: function(a) {
          this.inverted = a;
          this.updateTransform();
          return this;
        },
        updateTransform: function() {
          var a = this.translateX || 0,
              l = this.translateY || 0,
              q = this.scaleX,
              k = this.scaleY,
              p = this.inverted,
              d = this.rotation,
              n = this.matrix,
              b = this.element;
          p && (a += this.width, l += this.height);
          a = ["translate(" + a + "," + l + ")"];
          r(n) && a.push("matrix(" + n.join(",") + ")");
          p ? a.push("rotate(90) scale(-1,1)") : d && a.push("rotate(" + d + " " + e(this.rotationOriginX, b.getAttribute("x"), 0) + " " + e(this.rotationOriginY, b.getAttribute("y") || 0) + ")");
          (r(q) || r(k)) && a.push("scale(" + e(q, 1) + " " + e(k, 1) + ")");
          a.length && b.setAttribute("transform", a.join(" "));
        },
        toFront: function() {
          var a = this.element;
          a.parentNode.appendChild(a);
          return this;
        },
        align: function(a, l, q) {
          var k,
              d,
              b,
              h,
              u = {};
          d = this.renderer;
          b = d.alignedObjects;
          var c,
              f;
          if (a) {
            if (this.alignOptions = a, this.alignByTranslate = l, !q || p(q))
              this.alignTo = k = q || "renderer", n(b, this), b.push(this), q = null;
          } else
            a = this.alignOptions, l = this.alignByTranslate, k = this.alignTo;
          q = e(q, d[k], d);
          k = a.align;
          d = a.verticalAlign;
          b = (q.x || 0) + (a.x || 0);
          h = (q.y || 0) + (a.y || 0);
          "right" === k ? c = 1 : "center" === k && (c = 2);
          c && (b += (q.width - (a.width || 0)) / c);
          u[l ? "translateX" : "x"] = Math.round(b);
          "bottom" === d ? f = 1 : "middle" === d && (f = 2);
          f && (h += (q.height - (a.height || 0)) / f);
          u[l ? "translateY" : "y"] = Math.round(h);
          this[this.placed ? "animate" : "attr"](u);
          this.placed = !0;
          this.alignAttr = u;
          return this;
        },
        getBBox: function(a, l) {
          var q,
              k = this.renderer,
              p,
              d = this.element,
              n = this.styles,
              u,
              c = this.textStr,
              E,
              x = k.cache,
              H = k.cacheKeys,
              z;
          l = e(l, this.rotation);
          p = l * f;
          u = d && D.prototype.getStyle.call(d, "font-size");
          r(c) && (z = c.toString(), -1 === z.indexOf("\x3c") && (z = z.replace(/[0-9]/g, "0")), z += ["", l || 0, u, n && n.width, n && n.textOverflow].join());
          z && !a && (q = x[z]);
          if (!q) {
            if (d.namespaceURI === this.SVG_NS || k.forExport) {
              try {
                (E = this.fakeTS && function(a) {
                  b(d.querySelectorAll(".highcharts-text-outline"), function(e) {
                    e.style.display = a;
                  });
                }) && E("none"), q = d.getBBox ? h({}, d.getBBox()) : {
                  width: d.offsetWidth,
                  height: d.offsetHeight
                }, E && E("");
              } catch (aa) {}
              if (!q || 0 > q.width)
                q = {
                  width: 0,
                  height: 0
                };
            } else
              q = this.htmlGetBBox();
            k.isSVG && (a = q.width, k = q.height, n && "11px" === n.fontSize && 17 === Math.round(k) && (q.height = k = 14), l && (q.width = Math.abs(k * Math.sin(p)) + Math.abs(a * Math.cos(p)), q.height = Math.abs(k * Math.cos(p)) + Math.abs(a * Math.sin(p))));
            if (z && 0 < q.height) {
              for (; 250 < H.length; )
                delete x[H.shift()];
              x[z] || H.push(z);
              x[z] = q;
            }
          }
          return q;
        },
        show: function(a) {
          return this.attr({visibility: a ? "inherit" : "visible"});
        },
        hide: function() {
          return this.attr({visibility: "hidden"});
        },
        fadeOut: function(a) {
          var e = this;
          e.animate({opacity: 0}, {
            duration: a || 150,
            complete: function() {
              e.attr({y: -9999});
            }
          });
        },
        add: function(a) {
          var e = this.renderer,
              l = this.element,
              q;
          a && (this.parentGroup = a);
          this.parentInverted = a && a.inverted;
          void 0 !== this.textStr && e.buildText(this);
          this.added = !0;
          if (!a || a.handleZ || this.zIndex)
            q = this.zIndexSetter();
          q || (a ? a.element : e.box).appendChild(l);
          if (this.onAdd)
            this.onAdd();
          return this;
        },
        safeRemoveChild: function(a) {
          var e = a.parentNode;
          e && e.removeChild(a);
        },
        destroy: function() {
          var a = this,
              e = a.element || {},
              l = a.renderer.isSVG && "SPAN" === e.nodeName && a.parentGroup,
              q = e.ownerSVGElement,
              k = a.clipPath;
          e.onclick = e.onmouseout = e.onmouseover = e.onmousemove = e.point = null;
          L(a);
          k && q && (b(q.querySelectorAll("[clip-path],[CLIP-PATH]"), function(a) {
            var e = a.getAttribute("clip-path"),
                l = k.element.id;
            (-1 < e.indexOf("(#" + l + ")") || -1 < e.indexOf('("#' + l + '")')) && a.removeAttribute("clip-path");
          }), a.clipPath = k.destroy());
          if (a.stops) {
            for (q = 0; q < a.stops.length; q++)
              a.stops[q] = a.stops[q].destroy();
            a.stops = null;
          }
          for (a.safeRemoveChild(e); l && l.div && 0 === l.div.childNodes.length; )
            e = l.parentGroup, a.safeRemoveChild(l.div), delete l.div, l = e;
          a.alignTo && n(a.renderer.alignedObjects, a);
          J(a, function(e, l) {
            delete a[l];
          });
          return null;
        },
        xGetter: function(a) {
          "circle" === this.element.nodeName && ("x" === a ? a = "cx" : "y" === a && (a = "cy"));
          return this._defaultGetter(a);
        },
        _defaultGetter: function(a) {
          a = e(this[a + "Value"], this[a], this.element ? this.element.getAttribute(a) : null, 0);
          /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a));
          return a;
        },
        dSetter: function(a, e, l) {
          a && a.join && (a = a.join(" "));
          /(NaN| {2}|^$)/.test(a) && (a = "M 0 0");
          this[e] !== a && (l.setAttribute(e, a), this[e] = a);
        },
        alignSetter: function(a) {
          this.alignValue = a;
          this.element.setAttribute("text-anchor", {
            left: "start",
            center: "middle",
            right: "end"
          }[a]);
        },
        opacitySetter: function(a, e, l) {
          this[e] = a;
          l.setAttribute(e, a);
        },
        titleSetter: function(a) {
          var l = this.element.getElementsByTagName("title")[0];
          l || (l = A.createElementNS(this.SVG_NS, "title"), this.element.appendChild(l));
          l.firstChild && l.removeChild(l.firstChild);
          l.appendChild(A.createTextNode(String(e(a), "").replace(/<[^>]*>/g, "").replace(/&lt;/g, "\x3c").replace(/&gt;/g, "\x3e")));
        },
        textSetter: function(a) {
          a !== this.textStr && (delete this.bBox, this.textStr = a, this.added && this.renderer.buildText(this));
        },
        fillSetter: function(a, e, l) {
          "string" === typeof a ? l.setAttribute(e, a) : a && this.colorGradient(a, e, l);
        },
        visibilitySetter: function(a, e, l) {
          "inherit" === a ? l.removeAttribute(e) : this[e] !== a && l.setAttribute(e, a);
          this[e] = a;
        },
        zIndexSetter: function(a, e) {
          var q = this.renderer,
              k = this.parentGroup,
              p = (k || q).element || q.box,
              d,
              n = this.element,
              b,
              h,
              q = p === q.box;
          d = this.added;
          var u;
          r(a) && (n.zIndex = a, a = +a, this[e] === a && (d = !1), this[e] = a);
          if (d) {
            (a = this.zIndex) && k && (k.handleZ = !0);
            e = p.childNodes;
            for (u = e.length - 1; 0 <= u && !b; u--)
              if (k = e[u], d = k.zIndex, h = !r(d), k !== n)
                if (0 > a && h && !q && !u)
                  p.insertBefore(n, e[u]), b = !0;
                else if (l(d) <= a || h && (!r(a) || 0 <= a))
                  p.insertBefore(n, e[u + 1] || null), b = !0;
            b || (p.insertBefore(n, e[q ? 3 : 0] || null), b = !0);
          }
          return b;
        },
        _defaultSetter: function(a, e, l) {
          l.setAttribute(e, a);
        }
      });
      D.prototype.yGetter = D.prototype.xGetter;
      D.prototype.translateXSetter = D.prototype.translateYSetter = D.prototype.rotationSetter = D.prototype.verticalAlignSetter = D.prototype.rotationOriginXSetter = D.prototype.rotationOriginYSetter = D.prototype.scaleXSetter = D.prototype.scaleYSetter = D.prototype.matrixSetter = function(a, e) {
        this[e] = a;
        this.doTransform = !0;
      };
      F = a.SVGRenderer = function() {
        this.init.apply(this, arguments);
      };
      h(F.prototype, {
        Element: D,
        SVG_NS: P,
        init: function(a, e, l, q, k, p) {
          var d;
          q = this.createElement("svg").attr({
            version: "1.1",
            "class": "highcharts-root"
          });
          d = q.element;
          a.appendChild(d);
          m(a, "dir", "ltr");
          -1 === a.innerHTML.indexOf("xmlns") && m(d, "xmlns", this.SVG_NS);
          this.isSVG = !0;
          this.box = d;
          this.boxWrapper = q;
          this.alignedObjects = [];
          this.url = (z || H) && A.getElementsByTagName("base").length ? M.location.href.replace(/#.*?$/, "").replace(/<[^>]*>/g, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "";
          this.createElement("desc").add().element.appendChild(A.createTextNode("Created with Highstock 6.0.7"));
          this.defs = this.createElement("defs").add();
          this.allowHTML = p;
          this.forExport = k;
          this.gradients = {};
          this.cache = {};
          this.cacheKeys = [];
          this.imgCount = 0;
          this.setSize(e, l, !1);
          var b;
          z && a.getBoundingClientRect && (e = function() {
            y(a, {
              left: 0,
              top: 0
            });
            b = a.getBoundingClientRect();
            y(a, {
              left: Math.ceil(b.left) - b.left + "px",
              top: Math.ceil(b.top) - b.top + "px"
            });
          }, e(), this.unSubPixelFix = G(M, "resize", e));
        },
        definition: function(a) {
          function e(a, k) {
            var p;
            b(q(a), function(a) {
              var q = l.createElement(a.tagName),
                  d = {};
              J(a, function(a, e) {
                "tagName" !== e && "children" !== e && "textContent" !== e && (d[e] = a);
              });
              q.attr(d);
              q.add(k || l.defs);
              a.textContent && q.element.appendChild(A.createTextNode(a.textContent));
              e(a.children || [], q);
              p = q;
            });
            return p;
          }
          var l = this;
          return e(a);
        },
        isHidden: function() {
          return !this.boxWrapper.getBBox().width;
        },
        destroy: function() {
          var a = this.defs;
          this.box = null;
          this.boxWrapper = this.boxWrapper.destroy();
          c(this.gradients || {});
          this.gradients = null;
          a && (this.defs = a.destroy());
          this.unSubPixelFix && this.unSubPixelFix();
          return this.alignedObjects = null;
        },
        createElement: function(a) {
          var e = new this.Element;
          e.init(this, a);
          return e;
        },
        draw: E,
        getRadialAttr: function(a, e) {
          return {
            cx: a[0] - a[2] / 2 + e.cx * a[2],
            cy: a[1] - a[2] / 2 + e.cy * a[2],
            r: e.r * a[2]
          };
        },
        getSpanWidth: function(a) {
          return a.getBBox(!0).width;
        },
        applyEllipsis: function(a, e, l, q) {
          var k = a.rotation,
              p = l,
              d,
              b = 0,
              n = l.length,
              h = function(a) {
                e.removeChild(e.firstChild);
                a && e.appendChild(A.createTextNode(a));
              },
              u;
          a.rotation = 0;
          p = this.getSpanWidth(a, e);
          if (u = p > q) {
            for (; b <= n; )
              d = Math.ceil((b + n) / 2), p = l.substring(0, d) + "\u2026", h(p), p = this.getSpanWidth(a, e), b === n ? b = n + 1 : p > q ? n = d - 1 : b = d;
            0 === n && h("");
          }
          a.rotation = k;
          return u;
        },
        escapes: {
          "\x26": "\x26amp;",
          "\x3c": "\x26lt;",
          "\x3e": "\x26gt;",
          "'": "\x26#39;",
          '"': "\x26quot;"
        },
        buildText: function(a) {
          var q = a.element,
              k = this,
              p = k.forExport,
              d = e(a.textStr, "").toString(),
              n = -1 !== d.indexOf("\x3c"),
              h = q.childNodes,
              u,
              c,
              f,
              E,
              z = m(q, "x"),
              x = a.styles,
              H = a.textWidth,
              N = x && x.lineHeight,
              L = x && x.textOutline,
              r = x && "ellipsis" === x.textOverflow,
              I = x && "nowrap" === x.whiteSpace,
              g,
              t = h.length,
              w = H && !a.added && this.box,
              Q = function(a) {
                return N ? l(N) : k.fontMetrics(void 0, a.getAttribute("style") ? a : q).h;
              },
              v = function(a, e) {
                J(k.escapes, function(l, q) {
                  e && -1 !== C(l, e) || (a = a.toString().replace(new RegExp(l, "g"), q));
                });
                return a;
              },
              x = [d, r, I, N, L, x && x.fontSize, H].join();
          if (x !== a.textCache) {
            for (a.textCache = x; t--; )
              q.removeChild(h[t]);
            n || L || r || H || -1 !== d.indexOf(" ") ? (u = /<.*class="([^"]+)".*>/, c = /<.*style="([^"]+)".*>/, f = /<.*href="([^"]+)".*>/, w && w.appendChild(q), d = n ? d.replace(/<(b|strong)>/g, '\x3cspan class\x3d"highcharts-strong"\x3e').replace(/<(i|em)>/g, '\x3cspan class\x3d"highcharts-emphasized"\x3e').replace(/<a/g, "\x3cspan").replace(/<\/(b|strong|i|em|a)>/g, "\x3c/span\x3e").split(/<br.*?>/g) : [d], d = B(d, function(a) {
              return "" !== a;
            }), b(d, function(e, l) {
              var d,
                  n = 0;
              e = e.replace(/^\s+|\s+$/g, "").replace(/<span/g, "|||\x3cspan").replace(/<\/span>/g, "\x3c/span\x3e|||");
              d = e.split("|||");
              b(d, function(e) {
                if ("" !== e || 1 === d.length) {
                  var b = {},
                      h = A.createElementNS(k.SVG_NS, "tspan"),
                      x,
                      B;
                  u.test(e) && (x = e.match(u)[1], m(h, "class", x));
                  c.test(e) && (B = e.match(c)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), m(h, "style", B));
                  f.test(e) && !p && (m(h, "onclick", 'location.href\x3d"' + e.match(f)[1] + '"'), m(h, "class", "highcharts-anchor"));
                  e = v(e.replace(/<[a-zA-Z\/](.|\n)*?>/g, "") || " ");
                  if (" " !== e) {
                    h.appendChild(A.createTextNode(e));
                    n ? b.dx = 0 : l && null !== z && (b.x = z);
                    m(h, b);
                    q.appendChild(h);
                    !n && g && (!V && p && y(h, {display: "block"}), m(h, "dy", Q(h)));
                    if (H) {
                      b = e.replace(/([^\^])-/g, "$1- ").split(" ");
                      x = 1 < d.length || l || 1 < b.length && !I;
                      var C = [],
                          N,
                          L = Q(h),
                          J = a.rotation;
                      for (r && (E = k.applyEllipsis(a, h, e, H)); !r && x && (b.length || C.length); )
                        a.rotation = 0, N = k.getSpanWidth(a, h), e = N > H, void 0 === E && (E = e), e && 1 !== b.length ? (h.removeChild(h.firstChild), C.unshift(b.pop())) : (b = C, C = [], b.length && !I && (h = A.createElementNS(P, "tspan"), m(h, {
                          dy: L,
                          x: z
                        }), B && m(h, "style", B), q.appendChild(h)), N > H && (H = N)), b.length && h.appendChild(A.createTextNode(b.join(" ").replace(/- /g, "-")));
                      a.rotation = J;
                    }
                    n++;
                  }
                }
              });
              g = g || q.childNodes.length;
            }), E && a.attr("title", v(a.textStr, ["\x26lt;", "\x26gt;"])), w && w.removeChild(q), L && a.applyTextOutline && a.applyTextOutline(L)) : q.appendChild(A.createTextNode(v(d)));
          }
        },
        getContrast: function(a) {
          a = t(a).rgba;
          return 510 < a[0] + a[1] + a[2] ? "#000000" : "#FFFFFF";
        },
        button: function(a, e, l, q, d, p, b, n, h) {
          var c = this.label(a, e, l, h, null, null, null, null, "button"),
              f = 0;
          c.attr(k({
            padding: 8,
            r: 2
          }, d));
          G(c.element, u ? "mouseover" : "mouseenter", function() {
            3 !== f && c.setState(1);
          });
          G(c.element, u ? "mouseout" : "mouseleave", function() {
            3 !== f && c.setState(f);
          });
          c.setState = function(a) {
            1 !== a && (c.state = f = a);
            c.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][a || 0]);
          };
          return c.on("click", function(a) {
            3 !== f && q.call(c, a);
          });
        },
        crispLine: function(a, e) {
          a[1] === a[4] && (a[1] = a[4] = Math.round(a[1]) - e % 2 / 2);
          a[2] === a[5] && (a[2] = a[5] = Math.round(a[2]) + e % 2 / 2);
          return a;
        },
        path: function(a) {
          var e = {};
          I(a) ? e.d = a : x(a) && h(e, a);
          return this.createElement("path").attr(e);
        },
        circle: function(a, e, l) {
          a = x(a) ? a : {
            x: a,
            y: e,
            r: l
          };
          e = this.createElement("circle");
          e.xSetter = e.ySetter = function(a, e, l) {
            l.setAttribute("c" + e, a);
          };
          return e.attr(a);
        },
        arc: function(a, e, l, q, k, d) {
          x(a) ? (q = a, e = q.y, l = q.r, a = q.x) : q = {
            innerR: q,
            start: k,
            end: d
          };
          a = this.symbol("arc", a, e, l, l, q);
          a.r = l;
          return a;
        },
        rect: function(a, e, l, q, k, d) {
          k = x(a) ? a.r : k;
          d = this.createElement("rect");
          a = x(a) ? a : void 0 === a ? {} : {
            x: a,
            y: e,
            width: Math.max(l, 0),
            height: Math.max(q, 0)
          };
          k && (a.r = k);
          d.rSetter = function(a, e, l) {
            m(l, {
              rx: a,
              ry: a
            });
          };
          return d.attr(a);
        },
        setSize: function(a, l, q) {
          var k = this.alignedObjects,
              d = k.length;
          this.width = a;
          this.height = l;
          for (this.boxWrapper.animate({
            width: a,
            height: l
          }, {
            step: function() {
              this.attr({viewBox: "0 0 " + this.attr("width") + " " + this.attr("height")});
            },
            duration: e(q, !0) ? void 0 : 0
          }); d--; )
            k[d].align();
        },
        g: function(a) {
          var e = this.createElement("g");
          return a ? e.attr({"class": "highcharts-" + a}) : e;
        },
        image: function(a, e, l, q, k) {
          var d = {preserveAspectRatio: "none"};
          1 < arguments.length && h(d, {
            x: e,
            y: l,
            width: q,
            height: k
          });
          d = this.createElement("image").attr(d);
          d.element.setAttributeNS ? d.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", a) : d.element.setAttribute("hc-svg-href", a);
          return d;
        },
        symbol: function(a, l, q, k, d, p) {
          var n = this,
              u,
              c = /^url\((.*?)\)$/,
              f = c.test(a),
              E = !f && (this.symbols[a] ? a : "circle"),
              x = E && this.symbols[E],
              z = r(l) && x && x.call(this.symbols, Math.round(l), Math.round(q), k, d, p),
              H,
              B;
          x ? (u = this.path(z), h(u, {
            symbolName: E,
            x: l,
            y: q,
            width: k,
            height: d
          }), p && h(u, p)) : f && (H = a.match(c)[1], u = this.image(H), u.imgwidth = e(O[H] && O[H].width, p && p.width), u.imgheight = e(O[H] && O[H].height, p && p.height), B = function() {
            u.attr({
              width: u.width,
              height: u.height
            });
          }, b(["width", "height"], function(a) {
            u[a + "Setter"] = function(a, e) {
              var l = {},
                  q = this["img" + e],
                  k = "width" === e ? "translateX" : "translateY";
              this[e] = a;
              r(q) && (this.element && this.element.setAttribute(e, q), this.alignByTranslate || (l[k] = ((this[e] || 0) - q) / 2, this.attr(l)));
            };
          }), r(l) && u.attr({
            x: l,
            y: q
          }), u.isImg = !0, r(u.imgwidth) && r(u.imgheight) ? B() : (u.attr({
            width: 0,
            height: 0
          }), w("img", {
            onload: function() {
              var a = g[n.chartIndex];
              0 === this.width && (y(this, {
                position: "absolute",
                top: "-999em"
              }), A.body.appendChild(this));
              O[H] = {
                width: this.width,
                height: this.height
              };
              u.imgwidth = this.width;
              u.imgheight = this.height;
              u.element && B();
              this.parentNode && this.parentNode.removeChild(this);
              n.imgCount--;
              if (!n.imgCount && a && a.onload)
                a.onload();
            },
            src: H
          }), this.imgCount++));
          return u;
        },
        symbols: {
          circle: function(a, e, l, q) {
            return this.arc(a + l / 2, e + q / 2, l / 2, q / 2, {
              start: 0,
              end: 2 * Math.PI,
              open: !1
            });
          },
          square: function(a, e, l, q) {
            return ["M", a, e, "L", a + l, e, a + l, e + q, a, e + q, "Z"];
          },
          triangle: function(a, e, l, q) {
            return ["M", a + l / 2, e, "L", a + l, e + q, a, e + q, "Z"];
          },
          "triangle-down": function(a, e, l, q) {
            return ["M", a, e, "L", a + l, e, a + l / 2, e + q, "Z"];
          },
          diamond: function(a, e, l, q) {
            return ["M", a + l / 2, e, "L", a + l, e + q / 2, a + l / 2, e + q, a, e + q / 2, "Z"];
          },
          arc: function(a, l, q, k, d) {
            var p = d.start,
                b = d.r || q,
                n = d.r || k || q,
                h = d.end - .001;
            q = d.innerR;
            k = e(d.open, .001 > Math.abs(d.end - d.start - 2 * Math.PI));
            var u = Math.cos(p),
                c = Math.sin(p),
                f = Math.cos(h),
                h = Math.sin(h);
            d = .001 > d.end - p - Math.PI ? 0 : 1;
            b = ["M", a + b * u, l + n * c, "A", b, n, 0, d, 1, a + b * f, l + n * h];
            r(q) && b.push(k ? "M" : "L", a + q * f, l + q * h, "A", q, q, 0, d, 0, a + q * u, l + q * c);
            b.push(k ? "" : "Z");
            return b;
          },
          callout: function(a, e, l, q, k) {
            var d = Math.min(k && k.r || 0, l, q),
                p = d + 6,
                b = k && k.anchorX;
            k = k && k.anchorY;
            var n;
            n = ["M", a + d, e, "L", a + l - d, e, "C", a + l, e, a + l, e, a + l, e + d, "L", a + l, e + q - d, "C", a + l, e + q, a + l, e + q, a + l - d, e + q, "L", a + d, e + q, "C", a, e + q, a, e + q, a, e + q - d, "L", a, e + d, "C", a, e, a, e, a + d, e];
            b && b > l ? k > e + p && k < e + q - p ? n.splice(13, 3, "L", a + l, k - 6, a + l + 6, k, a + l, k + 6, a + l, e + q - d) : n.splice(13, 3, "L", a + l, q / 2, b, k, a + l, q / 2, a + l, e + q - d) : b && 0 > b ? k > e + p && k < e + q - p ? n.splice(33, 3, "L", a, k + 6, a - 6, k, a, k - 6, a, e + d) : n.splice(33, 3, "L", a, q / 2, b, k, a, q / 2, a, e + d) : k && k > q && b > a + p && b < a + l - p ? n.splice(23, 3, "L", b + 6, e + q, b, e + q + 6, b - 6, e + q, a + d, e + q) : k && 0 > k && b > a + p && b < a + l - p && n.splice(3, 3, "L", b - 6, e, b, e - 6, b + 6, e, l - d, e);
            return n;
          }
        },
        clipRect: function(e, l, q, k) {
          var d = a.uniqueKey(),
              p = this.createElement("clipPath").attr({id: d}).add(this.defs);
          e = this.rect(e, l, q, k, 0).add(p);
          e.id = d;
          e.clipPath = p;
          e.count = 0;
          return e;
        },
        text: function(a, e, l, q) {
          var k = {};
          if (q && (this.allowHTML || !this.forExport))
            return this.html(a, e, l);
          k.x = Math.round(e || 0);
          l && (k.y = Math.round(l));
          if (a || 0 === a)
            k.text = a;
          a = this.createElement("text").attr(k);
          q || (a.xSetter = function(a, e, l) {
            var q = l.getElementsByTagName("tspan"),
                k,
                d = l.getAttribute(e),
                p;
            for (p = 0; p < q.length; p++)
              k = q[p], k.getAttribute(e) === d && k.setAttribute(e, a);
            l.setAttribute(e, a);
          });
          return a;
        },
        fontMetrics: function(a, e) {
          a = e && D.prototype.getStyle.call(e, "font-size");
          a = /px/.test(a) ? l(a) : /em/.test(a) ? parseFloat(a) * (e ? this.fontMetrics(null, e.parentNode).f : 16) : 12;
          e = 24 > a ? a + 3 : Math.round(1.2 * a);
          return {
            h: e,
            b: Math.round(.8 * e),
            f: a
          };
        },
        rotCorr: function(a, e, l) {
          var q = a;
          e && l && (q = Math.max(q * Math.cos(e * f), 4));
          return {
            x: -a / 3 * Math.sin(e * f),
            y: q
          };
        },
        label: function(e, l, q, d, p, n, u, c, f) {
          var E = this,
              x = E.g("button" !== f && "label"),
              H = x.text = E.text("", 0, 0, u).attr({zIndex: 1}),
              z,
              B,
              C = 0,
              L = 3,
              J = 0,
              I,
              A,
              g,
              V,
              t,
              w = {},
              y,
              P = /^url\((.*?)\)$/.test(d),
              m = P,
              v,
              O,
              M,
              Q;
          f && x.addClass("highcharts-" + f);
          m = !0;
          v = function() {
            return z.strokeWidth() % 2 / 2;
          };
          O = function() {
            var a = H.element.style,
                e = {};
            B = (void 0 === I || void 0 === A || t) && r(H.textStr) && H.getBBox();
            x.width = (I || B.width || 0) + 2 * L + J;
            x.height = (A || B.height || 0) + 2 * L;
            y = L + E.fontMetrics(a && a.fontSize, H).b;
            m && (z || (x.box = z = E.symbols[d] || P ? E.symbol(d) : E.rect(), z.addClass(("button" === f ? "" : "highcharts-label-box") + (f ? " highcharts-" + f + "-box" : "")), z.add(x), a = v(), e.x = a, e.y = (c ? -y : 0) + a), e.width = Math.round(x.width), e.height = Math.round(x.height), z.attr(h(e, w)), w = {});
          };
          M = function() {
            var a = J + L,
                e;
            e = c ? 0 : y;
            r(I) && B && ("center" === t || "right" === t) && (a += {
              center: .5,
              right: 1
            }[t] * (I - B.width));
            if (a !== H.x || e !== H.y)
              H.attr("x", a), void 0 !== e && H.attr("y", e);
            H.x = a;
            H.y = e;
          };
          Q = function(a, e) {
            z ? z.attr(a, e) : w[a] = e;
          };
          x.onAdd = function() {
            H.add(x);
            x.attr({
              text: e || 0 === e ? e : "",
              x: l,
              y: q
            });
            z && r(p) && x.attr({
              anchorX: p,
              anchorY: n
            });
          };
          x.widthSetter = function(e) {
            I = a.isNumber(e) ? e : null;
          };
          x.heightSetter = function(a) {
            A = a;
          };
          x["text-alignSetter"] = function(a) {
            t = a;
          };
          x.paddingSetter = function(a) {
            r(a) && a !== L && (L = x.padding = a, M());
          };
          x.paddingLeftSetter = function(a) {
            r(a) && a !== J && (J = a, M());
          };
          x.alignSetter = function(a) {
            a = {
              left: 0,
              center: .5,
              right: 1
            }[a];
            a !== C && (C = a, B && x.attr({x: g}));
          };
          x.textSetter = function(a) {
            void 0 !== a && H.textSetter(a);
            O();
            M();
          };
          x["stroke-widthSetter"] = function(a, e) {
            a && (m = !0);
            this["stroke-width"] = a;
            Q(e, a);
          };
          x.rSetter = function(a, e) {
            Q(e, a);
          };
          x.anchorXSetter = function(a, e) {
            p = x.anchorX = a;
            Q(e, Math.round(a) - v() - g);
          };
          x.anchorYSetter = function(a, e) {
            n = x.anchorY = a;
            Q(e, a - V);
          };
          x.xSetter = function(a) {
            x.x = a;
            C && (a -= C * ((I || B.width) + 2 * L));
            g = Math.round(a);
            x.attr("translateX", g);
          };
          x.ySetter = function(a) {
            V = x.y = Math.round(a);
            x.attr("translateY", V);
          };
          var F = x.css;
          return h(x, {
            css: function(a) {
              if (a) {
                var e = {};
                a = k(a);
                b(x.textProps, function(l) {
                  void 0 !== a[l] && (e[l] = a[l], delete a[l]);
                });
                H.css(e);
              }
              return F.call(x, a);
            },
            getBBox: function() {
              return {
                width: B.width + 2 * L,
                height: B.height + 2 * L,
                x: B.x - L,
                y: B.y - L
              };
            },
            destroy: function() {
              N(x.element, "mouseenter");
              N(x.element, "mouseleave");
              H && (H = H.destroy());
              z && (z = z.destroy());
              D.prototype.destroy.call(x);
              x = E = O = M = Q = null;
            }
          });
        }
      });
      a.Renderer = F;
    })(K);
    (function(a) {
      var D = a.attr,
          F = a.createElement,
          G = a.css,
          v = a.defined,
          m = a.each,
          g = a.extend,
          t = a.isFirefox,
          y = a.isMS,
          w = a.isWebKit,
          r = a.pick,
          f = a.pInt,
          c = a.SVGRenderer,
          A = a.win,
          b = a.wrap;
      g(a.SVGElement.prototype, {
        htmlCss: function(a) {
          var b = this.element;
          if (b = a && "SPAN" === b.tagName && a.width)
            delete a.width, this.textWidth = b, this.updateTransform();
          a && "ellipsis" === a.textOverflow && (a.whiteSpace = "nowrap", a.overflow = "hidden");
          this.styles = g(this.styles, a);
          G(this.element, a);
          return this;
        },
        htmlGetBBox: function() {
          var a = this.element;
          return {
            x: a.offsetLeft,
            y: a.offsetTop,
            width: a.offsetWidth,
            height: a.offsetHeight
          };
        },
        htmlUpdateTransform: function() {
          if (this.added) {
            var a = this.renderer,
                b = this.element,
                c = this.x || 0,
                d = this.y || 0,
                C = this.textAlign || "left",
                r = {
                  left: 0,
                  center: .5,
                  right: 1
                }[C],
                z = this.styles,
                u = z && z.whiteSpace;
            G(b, {
              marginLeft: this.translateX || 0,
              marginTop: this.translateY || 0
            });
            this.inverted && m(b.childNodes, function(k) {
              a.invertChild(k, b);
            });
            if ("SPAN" === b.tagName) {
              var z = this.rotation,
                  x = this.textWidth && f(this.textWidth),
                  p = [z, C, b.innerHTML, this.textWidth, this.textAlign].join(),
                  H;
              (H = x !== this.oldTextWidth) && !(H = x > this.oldTextWidth) && ((H = this.textPxLength) || (G(b, {
                width: "",
                whiteSpace: u || "nowrap"
              }), H = b.offsetWidth), H = H > x);
              H && /[ \-]/.test(b.textContent || b.innerText) && (G(b, {
                width: x + "px",
                display: "block",
                whiteSpace: u || "normal"
              }), this.oldTextWidth = x);
              p !== this.cTT && (u = a.fontMetrics(b.style.fontSize).b, v(z) && z !== (this.oldRotation || 0) && this.setSpanRotation(z, r, u), this.getSpanCorrection(this.textPxLength || b.offsetWidth, u, r, z, C));
              G(b, {
                left: c + (this.xCorr || 0) + "px",
                top: d + (this.yCorr || 0) + "px"
              });
              this.cTT = p;
              this.oldRotation = z;
            }
          } else
            this.alignOnAdd = !0;
        },
        setSpanRotation: function(a, b, c) {
          var d = {},
              n = this.renderer.getTransformKey();
          d[n] = d.transform = "rotate(" + a + "deg)";
          d[n + (t ? "Origin" : "-origin")] = d.transformOrigin = 100 * b + "% " + c + "px";
          G(this.element, d);
        },
        getSpanCorrection: function(a, b, c) {
          this.xCorr = -a * c;
          this.yCorr = -b;
        }
      });
      g(c.prototype, {
        getTransformKey: function() {
          return y && !/Edge/.test(A.navigator.userAgent) ? "-ms-transform" : w ? "-webkit-transform" : t ? "MozTransform" : A.opera ? "-o-transform" : "";
        },
        html: function(a, n, c) {
          var d = this.createElement("span"),
              h = d.element,
              f = d.renderer,
              z = f.isSVG,
              u = function(a, d) {
                m(["opacity", "visibility"], function(p) {
                  b(a, p + "Setter", function(a, b, p, e) {
                    a.call(this, b, p, e);
                    d[p] = b;
                  });
                });
              };
          d.textSetter = function(a) {
            a !== h.innerHTML && delete this.bBox;
            this.textStr = a;
            h.innerHTML = r(a, "");
            d.doTransform = !0;
          };
          z && u(d, d.element.style);
          d.xSetter = d.ySetter = d.alignSetter = d.rotationSetter = function(a, b) {
            "align" === b && (b = "textAlign");
            d[b] = a;
            d.doTransform = !0;
          };
          d.afterSetters = function() {
            this.doTransform && (this.htmlUpdateTransform(), this.doTransform = !1);
          };
          d.attr({
            text: a,
            x: Math.round(n),
            y: Math.round(c)
          }).css({position: "absolute"});
          h.style.whiteSpace = "nowrap";
          d.css = d.htmlCss;
          z && (d.add = function(a) {
            var b,
                n = f.box.parentNode,
                k = [];
            if (this.parentGroup = a) {
              if (b = a.div, !b) {
                for (; a; )
                  k.push(a), a = a.parentGroup;
                m(k.reverse(), function(a) {
                  function p(l, q) {
                    a[q] = l;
                    "translateX" === q ? e.left = l + "px" : e.top = l + "px";
                    a.doTransform = !0;
                  }
                  var e,
                      l = D(a.element, "class");
                  l && (l = {className: l});
                  b = a.div = a.div || F("div", l, {
                    position: "absolute",
                    left: (a.translateX || 0) + "px",
                    top: (a.translateY || 0) + "px",
                    display: a.display,
                    opacity: a.opacity,
                    pointerEvents: a.styles && a.styles.pointerEvents
                  }, b || n);
                  e = b.style;
                  g(a, {
                    classSetter: function(a) {
                      return function(e) {
                        this.element.setAttribute("class", e);
                        a.className = e;
                      };
                    }(b),
                    on: function() {
                      k[0].div && d.on.apply({element: k[0].div}, arguments);
                      return a;
                    },
                    translateXSetter: p,
                    translateYSetter: p
                  });
                  u(a, e);
                });
              }
            } else
              b = n;
            b.appendChild(h);
            d.added = !0;
            d.alignOnAdd && d.htmlUpdateTransform();
            return d;
          });
          return d;
        }
      });
    })(K);
    (function(a) {
      var D = a.defined,
          F = a.each,
          G = a.extend,
          v = a.merge,
          m = a.pick,
          g = a.timeUnits,
          t = a.win;
      a.Time = function(a) {
        this.update(a, !1);
      };
      a.Time.prototype = {
        defaultOptions: {},
        update: function(g) {
          var w = m(g && g.useUTC, !0),
              r = this;
          this.options = g = v(!0, this.options || {}, g);
          this.Date = g.Date || t.Date;
          this.timezoneOffset = (this.useUTC = w) && g.timezoneOffset;
          this.getTimezoneOffset = this.timezoneOffsetFunction();
          (this.variableTimezone = !(w && !g.getTimezoneOffset && !g.timezone)) || this.timezoneOffset ? (this.get = function(a, c) {
            var f = c.getTime(),
                b = f - r.getTimezoneOffset(c);
            c.setTime(b);
            a = c["getUTC" + a]();
            c.setTime(f);
            return a;
          }, this.set = function(f, c, A) {
            var b;
            if (-1 !== a.inArray(f, ["Milliseconds", "Seconds", "Minutes"]))
              c["set" + f](A);
            else
              b = r.getTimezoneOffset(c), b = c.getTime() - b, c.setTime(b), c["setUTC" + f](A), f = r.getTimezoneOffset(c), b = c.getTime() + f, c.setTime(b);
          }) : w ? (this.get = function(a, c) {
            return c["getUTC" + a]();
          }, this.set = function(a, c, r) {
            return c["setUTC" + a](r);
          }) : (this.get = function(a, c) {
            return c["get" + a]();
          }, this.set = function(a, c, r) {
            return c["set" + a](r);
          });
        },
        makeTime: function(g, t, r, f, c, A) {
          var b,
              h,
              n;
          this.useUTC ? (b = this.Date.UTC.apply(0, arguments), h = this.getTimezoneOffset(b), b += h, n = this.getTimezoneOffset(b), h !== n ? b += n - h : h - 36E5 !== this.getTimezoneOffset(b - 36E5) || a.isSafari || (b -= 36E5)) : b = (new this.Date(g, t, m(r, 1), m(f, 0), m(c, 0), m(A, 0))).getTime();
          return b;
        },
        timezoneOffsetFunction: function() {
          var g = this,
              w = this.options,
              r = t.moment;
          if (!this.useUTC)
            return function(a) {
              return 6E4 * (new Date(a)).getTimezoneOffset();
            };
          if (w.timezone) {
            if (r)
              return function(a) {
                return 6E4 * -r.tz(a, w.timezone).utcOffset();
              };
            a.error(25);
          }
          return this.useUTC && w.getTimezoneOffset ? function(a) {
            return 6E4 * w.getTimezoneOffset(a);
          } : function() {
            return 6E4 * (g.timezoneOffset || 0);
          };
        },
        dateFormat: function(g, t, r) {
          if (!a.defined(t) || isNaN(t))
            return a.defaultOptions.lang.invalidDate || "";
          g = a.pick(g, "%Y-%m-%d %H:%M:%S");
          var f = this,
              c = new this.Date(t),
              A = this.get("Hours", c),
              b = this.get("Day", c),
              h = this.get("Date", c),
              n = this.get("Month", c),
              B = this.get("FullYear", c),
              d = a.defaultOptions.lang,
              C = d.weekdays,
              I = d.shortWeekdays,
              z = a.pad,
              c = a.extend({
                a: I ? I[b] : C[b].substr(0, 3),
                A: C[b],
                d: z(h),
                e: z(h, 2, " "),
                w: b,
                b: d.shortMonths[n],
                B: d.months[n],
                m: z(n + 1),
                y: B.toString().substr(2, 2),
                Y: B,
                H: z(A),
                k: A,
                I: z(A % 12 || 12),
                l: A % 12 || 12,
                M: z(f.get("Minutes", c)),
                p: 12 > A ? "AM" : "PM",
                P: 12 > A ? "am" : "pm",
                S: z(c.getSeconds()),
                L: z(Math.round(t % 1E3), 3)
              }, a.dateFormats);
          a.objectEach(c, function(a, d) {
            for (; -1 !== g.indexOf("%" + d); )
              g = g.replace("%" + d, "function" === typeof a ? a.call(f, t) : a);
          });
          return r ? g.substr(0, 1).toUpperCase() + g.substr(1) : g;
        },
        getTimeTicks: function(a, t, r, f) {
          var c = this,
              A = [],
              b = {},
              h,
              n = new c.Date(t),
              B = a.unitRange,
              d = a.count || 1,
              C;
          if (D(t)) {
            c.set("Milliseconds", n, B >= g.second ? 0 : d * Math.floor(c.get("Milliseconds", n) / d));
            B >= g.second && c.set("Seconds", n, B >= g.minute ? 0 : d * Math.floor(c.get("Seconds", n) / d));
            B >= g.minute && c.set("Minutes", n, B >= g.hour ? 0 : d * Math.floor(c.get("Minutes", n) / d));
            B >= g.hour && c.set("Hours", n, B >= g.day ? 0 : d * Math.floor(c.get("Hours", n) / d));
            B >= g.day && c.set("Date", n, B >= g.month ? 1 : d * Math.floor(c.get("Date", n) / d));
            B >= g.month && (c.set("Month", n, B >= g.year ? 0 : d * Math.floor(c.get("Month", n) / d)), h = c.get("FullYear", n));
            B >= g.year && c.set("FullYear", n, h - h % d);
            B === g.week && c.set("Date", n, c.get("Date", n) - c.get("Day", n) + m(f, 1));
            h = c.get("FullYear", n);
            f = c.get("Month", n);
            var I = c.get("Date", n),
                z = c.get("Hours", n);
            t = n.getTime();
            c.variableTimezone && (C = r - t > 4 * g.month || c.getTimezoneOffset(t) !== c.getTimezoneOffset(r));
            n = n.getTime();
            for (t = 1; n < r; )
              A.push(n), n = B === g.year ? c.makeTime(h + t * d, 0) : B === g.month ? c.makeTime(h, f + t * d) : !C || B !== g.day && B !== g.week ? C && B === g.hour && 1 < d ? c.makeTime(h, f, I, z + t * d) : n + B * d : c.makeTime(h, f, I + t * d * (B === g.day ? 1 : 7)), t++;
            A.push(n);
            B <= g.hour && 1E4 > A.length && F(A, function(a) {
              0 === a % 18E5 && "000000000" === c.dateFormat("%H%M%S%L", a) && (b[a] = "day");
            });
          }
          A.info = G(a, {
            higherRanks: b,
            totalRange: B * d
          });
          return A;
        }
      };
    })(K);
    (function(a) {
      var D = a.merge;
      a.defaultOptions = {
        symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
        lang: {
          loading: "Loading...",
          months: "January February March April May June July August September October November December".split(" "),
          shortMonths: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
          weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
          decimalPoint: ".",
          numericSymbols: "kMGTPE".split(""),
          resetZoom: "Reset zoom",
          resetZoomTitle: "Reset zoom level 1:1",
          thousandsSep: " "
        },
        global: {},
        time: a.Time.prototype.defaultOptions,
        chart: {
          borderRadius: 0,
          colorCount: 10,
          defaultSeriesType: "line",
          ignoreHiddenSeries: !0,
          spacing: [10, 10, 15, 10],
          resetZoomButton: {
            theme: {zIndex: 6},
            position: {
              align: "right",
              x: -10,
              y: 10
            }
          },
          width: null,
          height: null
        },
        title: {
          text: "Chart title",
          align: "center",
          margin: 15,
          widthAdjust: -44
        },
        subtitle: {
          text: "",
          align: "center",
          widthAdjust: -44
        },
        plotOptions: {},
        labels: {style: {
            position: "absolute",
            color: "#333333"
          }},
        legend: {
          enabled: !0,
          align: "center",
          layout: "horizontal",
          labelFormatter: function() {
            return this.name;
          },
          borderColor: "#999999",
          borderRadius: 0,
          navigation: {},
          itemCheckboxStyle: {
            position: "absolute",
            width: "13px",
            height: "13px"
          },
          squareSymbol: !0,
          symbolPadding: 5,
          verticalAlign: "bottom",
          x: 0,
          y: 0,
          title: {}
        },
        loading: {},
        tooltip: {
          enabled: !0,
          animation: a.svg,
          borderRadius: 3,
          dateTimeLabelFormats: {
            millisecond: "%A, %b %e, %H:%M:%S.%L",
            second: "%A, %b %e, %H:%M:%S",
            minute: "%A, %b %e, %H:%M",
            hour: "%A, %b %e, %H:%M",
            day: "%A, %b %e, %Y",
            week: "Week from %A, %b %e, %Y",
            month: "%B %Y",
            year: "%Y"
          },
          footerFormat: "",
          padding: 8,
          snap: a.isTouchDevice ? 25 : 10,
          headerFormat: '\x3cspan class\x3d"highcharts-header"\x3e{point.key}\x3c/span\x3e\x3cbr/\x3e',
          pointFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cspan class\x3d"highcharts-strong"\x3e{point.y}\x3c/span\x3e\x3cbr/\x3e'
        },
        credits: {
          enabled: !0,
          href: "http://www.highcharts.com",
          position: {
            align: "right",
            x: -10,
            verticalAlign: "bottom",
            y: -5
          },
          text: "Highcharts.com"
        }
      };
      a.setOptions = function(F) {
        a.defaultOptions = D(!0, a.defaultOptions, F);
        a.time.update(D(a.defaultOptions.global, a.defaultOptions.time), !1);
        return a.defaultOptions;
      };
      a.getOptions = function() {
        return a.defaultOptions;
      };
      a.defaultPlotOptions = a.defaultOptions.plotOptions;
      a.time = new a.Time(D(a.defaultOptions.global, a.defaultOptions.time));
      a.dateFormat = function(D, G, v) {
        return a.time.dateFormat(D, G, v);
      };
    })(K);
    (function(a) {
      var D = a.correctFloat,
          F = a.defined,
          G = a.destroyObjectProperties,
          v = a.isNumber,
          m = a.pick,
          g = a.deg2rad;
      a.Tick = function(a, g, w, r) {
        this.axis = a;
        this.pos = g;
        this.type = w || "";
        this.isNewLabel = this.isNew = !0;
        w || r || this.addLabel();
      };
      a.Tick.prototype = {
        addLabel: function() {
          var a = this.axis,
              g = a.options,
              w = a.chart,
              r = a.categories,
              f = a.names,
              c = this.pos,
              A = g.labels,
              b = a.tickPositions,
              h = c === b[0],
              n = c === b[b.length - 1],
              f = r ? m(r[c], f[c], c) : c,
              r = this.label,
              b = b.info,
              B;
          a.isDatetimeAxis && b && (B = g.dateTimeLabelFormats[b.higherRanks[c] || b.unitName]);
          this.isFirst = h;
          this.isLast = n;
          g = a.labelFormatter.call({
            axis: a,
            chart: w,
            isFirst: h,
            isLast: n,
            dateTimeLabelFormat: B,
            value: a.isLog ? D(a.lin2log(f)) : f,
            pos: c
          });
          if (F(r))
            r && r.attr({text: g});
          else {
            if (this.label = r = F(g) && A.enabled ? w.renderer.text(g, 0, 0, A.useHTML).add(a.labelGroup) : null)
              r.textPxLength = r.getBBox().width;
            this.rotation = 0;
          }
        },
        getLabelSize: function() {
          return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0;
        },
        handleOverflow: function(a) {
          var t = this.axis,
              w = t.options.labels,
              r = a.x,
              f = t.chart.chartWidth,
              c = t.chart.spacing,
              A = m(t.labelLeft, Math.min(t.pos, c[3])),
              c = m(t.labelRight, Math.max(t.isRadial ? 0 : t.pos + t.len, f - c[1])),
              b = this.label,
              h = this.rotation,
              n = {
                left: 0,
                center: .5,
                right: 1
              }[t.labelAlign || b.attr("align")],
              B = b.getBBox().width,
              d = t.getSlotWidth(),
              C = d,
              I = 1,
              z,
              u = {};
          if (h || !1 === w.overflow)
            0 > h && r - n * B < A ? z = Math.round(r / Math.cos(h * g) - A) : 0 < h && r + n * B > c && (z = Math.round((f - r) / Math.cos(h * g)));
          else if (f = r + (1 - n) * B, r - n * B < A ? C = a.x + C * (1 - n) - A : f > c && (C = c - a.x + C * n, I = -1), C = Math.min(d, C), C < d && "center" === t.labelAlign && (a.x += I * (d - C - n * (d - Math.min(B, C)))), B > C || t.autoRotation && (b.styles || {}).width)
            z = C;
          z && (u.width = z, (w.style || {}).textOverflow || (u.textOverflow = "ellipsis"), b.css(u));
        },
        getPosition: function(g, m, w, r) {
          var f = this.axis,
              c = f.chart,
              A = r && c.oldChartHeight || c.chartHeight;
          return {
            x: g ? a.correctFloat(f.translate(m + w, null, null, r) + f.transB) : f.left + f.offset + (f.opposite ? (r && c.oldChartWidth || c.chartWidth) - f.right - f.left : 0),
            y: g ? A - f.bottom + f.offset - (f.opposite ? f.height : 0) : a.correctFloat(A - f.translate(m + w, null, null, r) - f.transB)
          };
        },
        getLabelPosition: function(a, m, w, r, f, c, A, b) {
          var h = this.axis,
              n = h.transA,
              B = h.reversed,
              d = h.staggerLines,
              C = h.tickRotCorr || {
                x: 0,
                y: 0
              },
              I = f.y,
              z = r || h.reserveSpaceDefault ? 0 : -h.labelOffset * ("center" === h.labelAlign ? .5 : 1);
          F(I) || (I = 0 === h.side ? w.rotation ? -8 : -w.getBBox().height : 2 === h.side ? C.y + 8 : Math.cos(w.rotation * g) * (C.y - w.getBBox(!1, 0).height / 2));
          a = a + f.x + z + C.x - (c && r ? c * n * (B ? -1 : 1) : 0);
          m = m + I - (c && !r ? c * n * (B ? 1 : -1) : 0);
          d && (w = A / (b || 1) % d, h.opposite && (w = d - w - 1), m += h.labelOffset / d * w);
          return {
            x: a,
            y: Math.round(m)
          };
        },
        getMarkPath: function(a, g, m, r, f, c) {
          return c.crispLine(["M", a, g, "L", a + (f ? 0 : -m), g + (f ? m : 0)], r);
        },
        renderGridLine: function(a, g, m) {
          var r = this.axis,
              f = this.gridLine,
              c = {},
              A = this.pos,
              b = this.type,
              h = r.tickmarkOffset,
              n = r.chart.renderer;
          f || (b || (c.zIndex = 1), a && (c.opacity = 0), this.gridLine = f = n.path().attr(c).addClass("highcharts-" + (b ? b + "-" : "") + "grid-line").add(r.gridGroup));
          if (!a && f && (a = r.getPlotLinePath(A + h, f.strokeWidth() * m, a, !0)))
            f[this.isNew ? "attr" : "animate"]({
              d: a,
              opacity: g
            });
        },
        renderMark: function(a, g, m) {
          var r = this.axis,
              f = r.chart.renderer,
              c = this.type,
              A = r.tickSize(c ? c + "Tick" : "tick"),
              b = this.mark,
              h = !b,
              n = a.x;
          a = a.y;
          A && (r.opposite && (A[0] = -A[0]), h && (this.mark = b = f.path().addClass("highcharts-" + (c ? c + "-" : "") + "tick").add(r.axisGroup)), b[h ? "attr" : "animate"]({
            d: this.getMarkPath(n, a, A[0], b.strokeWidth() * m, r.horiz, f),
            opacity: g
          }));
        },
        renderLabel: function(a, g, w, r) {
          var f = this.axis,
              c = f.horiz,
              A = f.options,
              b = this.label,
              h = A.labels,
              n = h.step,
              f = f.tickmarkOffset,
              B = !0,
              d = a.x;
          a = a.y;
          b && v(d) && (b.xy = a = this.getLabelPosition(d, a, b, c, h, f, r, n), this.isFirst && !this.isLast && !m(A.showFirstLabel, 1) || this.isLast && !this.isFirst && !m(A.showLastLabel, 1) ? B = !1 : !c || h.step || h.rotation || g || 0 === w || this.handleOverflow(a), n && r % n && (B = !1), B && v(a.y) ? (a.opacity = w, b[this.isNewLabel ? "attr" : "animate"](a), this.isNewLabel = !1) : (b.attr("y", -9999), this.isNewLabel = !0));
        },
        render: function(g, y, w) {
          var r = this.axis,
              f = r.horiz,
              c = this.getPosition(f, this.pos, r.tickmarkOffset, y),
              A = c.x,
              b = c.y,
              r = f && A === r.pos + r.len || !f && b === r.pos ? -1 : 1;
          w = m(w, 1);
          this.isActive = !0;
          this.renderGridLine(y, w, r);
          this.renderMark(c, w, r);
          this.renderLabel(c, y, w, g);
          this.isNew = !1;
          a.fireEvent(this, "afterRender");
        },
        destroy: function() {
          G(this, this.axis);
        }
      };
    })(K);
    var Z = function(a) {
      var D = a.addEvent,
          F = a.animObject,
          G = a.arrayMax,
          v = a.arrayMin,
          m = a.correctFloat,
          g = a.defaultOptions,
          t = a.defined,
          y = a.deg2rad,
          w = a.destroyObjectProperties,
          r = a.each,
          f = a.extend,
          c = a.fireEvent,
          A = a.format,
          b = a.getMagnitude,
          h = a.grep,
          n = a.inArray,
          B = a.isArray,
          d = a.isNumber,
          C = a.isString,
          I = a.merge,
          z = a.normalizeTickInterval,
          u = a.objectEach,
          x = a.pick,
          p = a.removeEvent,
          H = a.splat,
          k = a.syncTimeout,
          E = a.Tick,
          J = function() {
            this.init.apply(this, arguments);
          };
      a.extend(J.prototype, {
        defaultOptions: {
          dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L",
            second: "%H:%M:%S",
            minute: "%H:%M",
            hour: "%H:%M",
            day: "%e. %b",
            week: "%e. %b",
            month: "%b '%y",
            year: "%Y"
          },
          endOnTick: !1,
          labels: {
            enabled: !0,
            x: 0
          },
          maxPadding: .01,
          minorTickLength: 2,
          minorTickPosition: "outside",
          minPadding: .01,
          startOfWeek: 1,
          startOnTick: !1,
          tickLength: 10,
          tickmarkPlacement: "between",
          tickPixelInterval: 100,
          tickPosition: "outside",
          title: {align: "middle"},
          type: "linear"
        },
        defaultYAxisOptions: {
          endOnTick: !0,
          tickPixelInterval: 72,
          showLastLabel: !0,
          labels: {x: -8},
          maxPadding: .05,
          minPadding: .05,
          startOnTick: !0,
          title: {
            rotation: 270,
            text: "Values"
          },
          stackLabels: {
            allowOverlap: !1,
            enabled: !1,
            formatter: function() {
              return a.numberFormat(this.total, -1);
            }
          }
        },
        defaultLeftAxisOptions: {
          labels: {x: -15},
          title: {rotation: 270}
        },
        defaultRightAxisOptions: {
          labels: {x: 15},
          title: {rotation: 90}
        },
        defaultBottomAxisOptions: {
          labels: {
            autoRotation: [-45],
            x: 0
          },
          title: {rotation: 0}
        },
        defaultTopAxisOptions: {
          labels: {
            autoRotation: [-45],
            x: 0
          },
          title: {rotation: 0}
        },
        init: function(a, l) {
          var e = l.isX,
              q = this;
          q.chart = a;
          q.horiz = a.inverted && !q.isZAxis ? !e : e;
          q.isXAxis = e;
          q.coll = q.coll || (e ? "xAxis" : "yAxis");
          q.opposite = l.opposite;
          q.side = l.side || (q.horiz ? q.opposite ? 0 : 2 : q.opposite ? 1 : 3);
          q.setOptions(l);
          var k = this.options,
              d = k.type;
          q.labelFormatter = k.labels.formatter || q.defaultLabelFormatter;
          q.userOptions = l;
          q.minPixelPadding = 0;
          q.reversed = k.reversed;
          q.visible = !1 !== k.visible;
          q.zoomEnabled = !1 !== k.zoomEnabled;
          q.hasNames = "category" === d || !0 === k.categories;
          q.categories = k.categories || q.hasNames;
          q.names || (q.names = [], q.names.keys = {});
          q.plotLinesAndBandsGroups = {};
          q.isLog = "logarithmic" === d;
          q.isDatetimeAxis = "datetime" === d;
          q.positiveValuesOnly = q.isLog && !q.allowNegativeLog;
          q.isLinked = t(k.linkedTo);
          q.ticks = {};
          q.labelEdge = [];
          q.minorTicks = {};
          q.plotLinesAndBands = [];
          q.alternateBands = {};
          q.len = 0;
          q.minRange = q.userMinRange = k.minRange || k.maxZoom;
          q.range = k.range;
          q.offset = k.offset || 0;
          q.stacks = {};
          q.oldStacks = {};
          q.stacksTouched = 0;
          q.max = null;
          q.min = null;
          q.crosshair = x(k.crosshair, H(a.options.tooltip.crosshairs)[e ? 0 : 1], !1);
          l = q.options.events;
          -1 === n(q, a.axes) && (e ? a.axes.splice(a.xAxis.length, 0, q) : a.axes.push(q), a[q.coll].push(q));
          q.series = q.series || [];
          a.inverted && !q.isZAxis && e && void 0 === q.reversed && (q.reversed = !0);
          u(l, function(a, e) {
            D(q, e, a);
          });
          q.lin2log = k.linearToLogConverter || q.lin2log;
          q.isLog && (q.val2lin = q.log2lin, q.lin2val = q.lin2log);
        },
        setOptions: function(a) {
          this.options = I(this.defaultOptions, "yAxis" === this.coll && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], I(g[this.coll], a));
        },
        defaultLabelFormatter: function() {
          var e = this.axis,
              l = this.value,
              k = e.chart.time,
              q = e.categories,
              d = this.dateTimeLabelFormat,
              b = g.lang,
              p = b.numericSymbols,
              b = b.numericSymbolMagnitude || 1E3,
              n = p && p.length,
              h,
              u = e.options.labels.format,
              e = e.isLog ? Math.abs(l) : e.tickInterval;
          if (u)
            h = A(u, this, k);
          else if (q)
            h = l;
          else if (d)
            h = k.dateFormat(d, l);
          else if (n && 1E3 <= e)
            for (; n-- && void 0 === h; )
              k = Math.pow(b, n + 1), e >= k && 0 === 10 * l % k && null !== p[n] && 0 !== l && (h = a.numberFormat(l / k, -1) + p[n]);
          void 0 === h && (h = 1E4 <= Math.abs(l) ? a.numberFormat(l, -1) : a.numberFormat(l, -1, void 0, ""));
          return h;
        },
        getSeriesExtremes: function() {
          var a = this,
              l = a.chart;
          a.hasVisibleSeries = !1;
          a.dataMin = a.dataMax = a.threshold = null;
          a.softThreshold = !a.isXAxis;
          a.buildStacks && a.buildStacks();
          r(a.series, function(e) {
            if (e.visible || !l.options.chart.ignoreHiddenSeries) {
              var q = e.options,
                  k = q.threshold,
                  b;
              a.hasVisibleSeries = !0;
              a.positiveValuesOnly && 0 >= k && (k = null);
              if (a.isXAxis)
                q = e.xData, q.length && (e = v(q), b = G(q), d(e) || e instanceof Date || (q = h(q, d), e = v(q), b = G(q)), q.length && (a.dataMin = Math.min(x(a.dataMin, q[0], e), e), a.dataMax = Math.max(x(a.dataMax, q[0], b), b)));
              else if (e.getExtremes(), b = e.dataMax, e = e.dataMin, t(e) && t(b) && (a.dataMin = Math.min(x(a.dataMin, e), e), a.dataMax = Math.max(x(a.dataMax, b), b)), t(k) && (a.threshold = k), !q.softThreshold || a.positiveValuesOnly)
                a.softThreshold = !1;
            }
          });
        },
        translate: function(a, l, k, q, b, p) {
          var e = this.linkedParent || this,
              n = 1,
              h = 0,
              u = q ? e.oldTransA : e.transA;
          q = q ? e.oldMin : e.min;
          var c = e.minPixelPadding;
          b = (e.isOrdinal || e.isBroken || e.isLog && b) && e.lin2val;
          u || (u = e.transA);
          k && (n *= -1, h = e.len);
          e.reversed && (n *= -1, h -= n * (e.sector || e.len));
          l ? (a = (a * n + h - c) / u + q, b && (a = e.lin2val(a))) : (b && (a = e.val2lin(a)), a = d(q) ? n * (a - q) * u + h + n * c + (d(p) ? u * p : 0) : void 0);
          return a;
        },
        toPixels: function(a, l) {
          return this.translate(a, !1, !this.horiz, null, !0) + (l ? 0 : this.pos);
        },
        toValue: function(a, l) {
          return this.translate(a - (l ? 0 : this.pos), !0, !this.horiz, null, !0);
        },
        getPlotLinePath: function(a, l, k, q, b) {
          var e = this.chart,
              p = this.left,
              n = this.top,
              h,
              u,
              c = k && e.oldChartHeight || e.chartHeight,
              f = k && e.oldChartWidth || e.chartWidth,
              E;
          h = this.transB;
          var H = function(a, e, l) {
            if (a < e || a > l)
              q ? a = Math.min(Math.max(e, a), l) : E = !0;
            return a;
          };
          b = x(b, this.translate(a, null, null, k));
          b = Math.min(Math.max(-1E5, b), 1E5);
          a = k = Math.round(b + h);
          h = u = Math.round(c - b - h);
          d(b) ? this.horiz ? (h = n, u = c - this.bottom, a = k = H(a, p, p + this.width)) : (a = p, k = f - this.right, h = u = H(h, n, n + this.height)) : (E = !0, q = !1);
          return E && !q ? null : e.renderer.crispLine(["M", a, h, "L", k, u], l || 1);
        },
        getLinearTickPositions: function(a, l, k) {
          var e,
              b = m(Math.floor(l / a) * a);
          k = m(Math.ceil(k / a) * a);
          var d = [],
              p;
          m(b + a) === b && (p = 20);
          if (this.single)
            return [l];
          for (l = b; l <= k; ) {
            d.push(l);
            l = m(l + a, p);
            if (l === e)
              break;
            e = l;
          }
          return d;
        },
        getMinorTickInterval: function() {
          var a = this.options;
          return !0 === a.minorTicks ? x(a.minorTickInterval, "auto") : !1 === a.minorTicks ? null : a.minorTickInterval;
        },
        getMinorTickPositions: function() {
          var a = this,
              l = a.options,
              k = a.tickPositions,
              q = a.minorTickInterval,
              b = [],
              d = a.pointRangePadding || 0,
              p = a.min - d,
              d = a.max + d,
              n = d - p;
          if (n && n / q < a.len / 3)
            if (a.isLog)
              r(this.paddedTicks, function(e, l, k) {
                l && b.push.apply(b, a.getLogTickPositions(q, k[l - 1], k[l], !0));
              });
            else if (a.isDatetimeAxis && "auto" === this.getMinorTickInterval())
              b = b.concat(a.getTimeTicks(a.normalizeTimeTickInterval(q), p, d, l.startOfWeek));
            else
              for (l = p + (k[0] - p) % q; l <= d && l !== b[0]; l += q)
                b.push(l);
          0 !== b.length && a.trimTicks(b);
          return b;
        },
        adjustForMinRange: function() {
          var a = this.options,
              l = this.min,
              k = this.max,
              q,
              b,
              d,
              p,
              n,
              h,
              u,
              c;
          this.isXAxis && void 0 === this.minRange && !this.isLog && (t(a.min) || t(a.max) ? this.minRange = null : (r(this.series, function(a) {
            h = a.xData;
            for (p = u = a.xIncrement ? 1 : h.length - 1; 0 < p; p--)
              if (n = h[p] - h[p - 1], void 0 === d || n < d)
                d = n;
          }), this.minRange = Math.min(5 * d, this.dataMax - this.dataMin)));
          k - l < this.minRange && (b = this.dataMax - this.dataMin >= this.minRange, c = this.minRange, q = (c - k + l) / 2, q = [l - q, x(a.min, l - q)], b && (q[2] = this.isLog ? this.log2lin(this.dataMin) : this.dataMin), l = G(q), k = [l + c, x(a.max, l + c)], b && (k[2] = this.isLog ? this.log2lin(this.dataMax) : this.dataMax), k = v(k), k - l < c && (q[0] = k - c, q[1] = x(a.min, k - c), l = G(q)));
          this.min = l;
          this.max = k;
        },
        getClosest: function() {
          var a;
          this.categories ? a = 1 : r(this.series, function(e) {
            var l = e.closestPointRange,
                q = e.visible || !e.chart.options.chart.ignoreHiddenSeries;
            !e.noSharedTooltip && t(l) && q && (a = t(a) ? Math.min(a, l) : l);
          });
          return a;
        },
        nameToX: function(a) {
          var e = B(this.categories),
              k = e ? this.categories : this.names,
              q = a.options.x,
              b;
          a.series.requireSorting = !1;
          t(q) || (q = !1 === this.options.uniqueNames ? a.series.autoIncrement() : e ? n(a.name, k) : x(k.keys[a.name], -1));
          -1 === q ? e || (b = k.length) : b = q;
          void 0 !== b && (this.names[b] = a.name, this.names.keys[a.name] = b);
          return b;
        },
        updateNames: function() {
          var e = this,
              l = this.names;
          0 < l.length && (r(a.keys(l.keys), function(a) {
            delete l.keys[a];
          }), l.length = 0, this.minRange = this.userMinRange, r(this.series || [], function(a) {
            a.xIncrement = null;
            if (!a.points || a.isDirtyData)
              a.processData(), a.generatePoints();
            r(a.points, function(l, k) {
              var q;
              l.options && (q = e.nameToX(l), void 0 !== q && q !== l.x && (l.x = q, a.xData[k] = q));
            });
          }));
        },
        setAxisTranslation: function(a) {
          var e = this,
              k = e.max - e.min,
              q = e.axisPointRange || 0,
              b,
              d = 0,
              p = 0,
              n = e.linkedParent,
              h = !!e.categories,
              u = e.transA,
              c = e.isXAxis;
          if (c || h || q)
            b = e.getClosest(), n ? (d = n.minPointOffset, p = n.pointRangePadding) : r(e.series, function(a) {
              var l = h ? 1 : c ? x(a.options.pointRange, b, 0) : e.axisPointRange || 0;
              a = a.options.pointPlacement;
              q = Math.max(q, l);
              e.single || (d = Math.max(d, C(a) ? 0 : l / 2), p = Math.max(p, "on" === a ? 0 : l));
            }), n = e.ordinalSlope && b ? e.ordinalSlope / b : 1, e.minPointOffset = d *= n, e.pointRangePadding = p *= n, e.pointRange = Math.min(q, k), c && (e.closestPointRange = b);
          a && (e.oldTransA = u);
          e.translationSlope = e.transA = u = e.options.staticScale || e.len / (k + p || 1);
          e.transB = e.horiz ? e.left : e.bottom;
          e.minPixelPadding = u * d;
        },
        minFromRange: function() {
          return this.max - this.range;
        },
        setTickInterval: function(e) {
          var l = this,
              k = l.chart,
              q = l.options,
              p = l.isLog,
              n = l.log2lin,
              h = l.isDatetimeAxis,
              u = l.isXAxis,
              f = l.isLinked,
              E = q.maxPadding,
              H = q.minPadding,
              B = q.tickInterval,
              C = q.tickPixelInterval,
              g = l.categories,
              J = l.threshold,
              I = l.softThreshold,
              A,
              w,
              y,
              v;
          h || g || f || this.getTickAmount();
          y = x(l.userMin, q.min);
          v = x(l.userMax, q.max);
          f ? (l.linkedParent = k[l.coll][q.linkedTo], k = l.linkedParent.getExtremes(), l.min = x(k.min, k.dataMin), l.max = x(k.max, k.dataMax), q.type !== l.linkedParent.options.type && a.error(11, 1)) : (!I && t(J) && (l.dataMin >= J ? (A = J, H = 0) : l.dataMax <= J && (w = J, E = 0)), l.min = x(y, A, l.dataMin), l.max = x(v, w, l.dataMax));
          p && (l.positiveValuesOnly && !e && 0 >= Math.min(l.min, x(l.dataMin, l.min)) && a.error(10, 1), l.min = m(n(l.min), 15), l.max = m(n(l.max), 15));
          l.range && t(l.max) && (l.userMin = l.min = y = Math.max(l.dataMin, l.minFromRange()), l.userMax = v = l.max, l.range = null);
          c(l, "foundExtremes");
          l.beforePadding && l.beforePadding();
          l.adjustForMinRange();
          !(g || l.axisPointRange || l.usePercentage || f) && t(l.min) && t(l.max) && (n = l.max - l.min) && (!t(y) && H && (l.min -= n * H), !t(v) && E && (l.max += n * E));
          d(q.softMin) && !d(l.userMin) && (l.min = Math.min(l.min, q.softMin));
          d(q.softMax) && !d(l.userMax) && (l.max = Math.max(l.max, q.softMax));
          d(q.floor) && (l.min = Math.max(l.min, q.floor));
          d(q.ceiling) && (l.max = Math.min(l.max, q.ceiling));
          I && t(l.dataMin) && (J = J || 0, !t(y) && l.min < J && l.dataMin >= J ? l.min = J : !t(v) && l.max > J && l.dataMax <= J && (l.max = J));
          l.tickInterval = l.min === l.max || void 0 === l.min || void 0 === l.max ? 1 : f && !B && C === l.linkedParent.options.tickPixelInterval ? B = l.linkedParent.tickInterval : x(B, this.tickAmount ? (l.max - l.min) / Math.max(this.tickAmount - 1, 1) : void 0, g ? 1 : (l.max - l.min) * C / Math.max(l.len, C));
          u && !e && r(l.series, function(a) {
            a.processData(l.min !== l.oldMin || l.max !== l.oldMax);
          });
          l.setAxisTranslation(!0);
          l.beforeSetTickPositions && l.beforeSetTickPositions();
          l.postProcessTickInterval && (l.tickInterval = l.postProcessTickInterval(l.tickInterval));
          l.pointRange && !B && (l.tickInterval = Math.max(l.pointRange, l.tickInterval));
          e = x(q.minTickInterval, l.isDatetimeAxis && l.closestPointRange);
          !B && l.tickInterval < e && (l.tickInterval = e);
          h || p || B || (l.tickInterval = z(l.tickInterval, null, b(l.tickInterval), x(q.allowDecimals, !(.5 < l.tickInterval && 5 > l.tickInterval && 1E3 < l.max && 9999 > l.max)), !!this.tickAmount));
          this.tickAmount || (l.tickInterval = l.unsquish());
          this.setTickPositions();
        },
        setTickPositions: function() {
          var a = this.options,
              l,
              k = a.tickPositions;
          l = this.getMinorTickInterval();
          var q = a.tickPositioner,
              b = a.startOnTick,
              d = a.endOnTick;
          this.tickmarkOffset = this.categories && "between" === a.tickmarkPlacement && 1 === this.tickInterval ? .5 : 0;
          this.minorTickInterval = "auto" === l && this.tickInterval ? this.tickInterval / 5 : l;
          this.single = this.min === this.max && t(this.min) && !this.tickAmount && (parseInt(this.min, 10) === this.min || !1 !== a.allowDecimals);
          this.tickPositions = l = k && k.slice();
          !l && (l = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, a.units), this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), l.length > this.len && (l = [l[0], l.pop()], l[0] === l[1] && (l.length = 1)), this.tickPositions = l, q && (q = q.apply(this, [this.min, this.max]))) && (this.tickPositions = l = q);
          this.paddedTicks = l.slice(0);
          this.trimTicks(l, b, d);
          this.isLinked || (this.single && 2 > l.length && (this.min -= .5, this.max += .5), k || q || this.adjustTickAmount());
        },
        trimTicks: function(a, l, k) {
          var e = a[0],
              b = a[a.length - 1],
              d = this.minPointOffset || 0;
          if (!this.isLinked) {
            if (l && -Infinity !== e)
              this.min = e;
            else
              for (; this.min - d > a[0]; )
                a.shift();
            if (k)
              this.max = b;
            else
              for (; this.max + d < a[a.length - 1]; )
                a.pop();
            0 === a.length && t(e) && !this.options.tickPositions && a.push((b + e) / 2);
          }
        },
        alignToOthers: function() {
          var a = {},
              l,
              k = this.options;
          !1 === this.chart.options.chart.alignTicks || !1 === k.alignTicks || this.isLog || r(this.chart[this.coll], function(e) {
            var q = e.options,
                q = [e.horiz ? q.left : q.top, q.width, q.height, q.pane].join();
            e.series.length && (a[q] ? l = !0 : a[q] = 1);
          });
          return l;
        },
        getTickAmount: function() {
          var a = this.options,
              l = a.tickAmount,
              k = a.tickPixelInterval;
          !t(a.tickInterval) && this.len < k && !this.isRadial && !this.isLog && a.startOnTick && a.endOnTick && (l = 2);
          !l && this.alignToOthers() && (l = Math.ceil(this.len / k) + 1);
          4 > l && (this.finalTickAmt = l, l = 5);
          this.tickAmount = l;
        },
        adjustTickAmount: function() {
          var a = this.tickInterval,
              l = this.tickPositions,
              k = this.tickAmount,
              q = this.finalTickAmt,
              b = l && l.length,
              d = x(this.threshold, this.softThreshold ? 0 : null);
          if (this.hasData()) {
            if (b < k) {
              for (; l.length < k; )
                l.length % 2 || this.min === d ? l.push(m(l[l.length - 1] + a)) : l.unshift(m(l[0] - a));
              this.transA *= (b - 1) / (k - 1);
              this.min = l[0];
              this.max = l[l.length - 1];
            } else
              b > k && (this.tickInterval *= 2, this.setTickPositions());
            if (t(q)) {
              for (a = k = l.length; a--; )
                (3 === q && 1 === a % 2 || 2 >= q && 0 < a && a < k - 1) && l.splice(a, 1);
              this.finalTickAmt = void 0;
            }
          }
        },
        setScale: function() {
          var a,
              l;
          this.oldMin = this.min;
          this.oldMax = this.max;
          this.oldAxisLength = this.len;
          this.setAxisSize();
          l = this.len !== this.oldAxisLength;
          r(this.series, function(e) {
            if (e.isDirtyData || e.isDirty || e.xAxis.isDirty)
              a = !0;
          });
          l || a || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax || this.alignToOthers() ? (this.resetStacks && this.resetStacks(), this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickInterval(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, this.isDirty || (this.isDirty = l || this.min !== this.oldMin || this.max !== this.oldMax)) : this.cleanStacks && this.cleanStacks();
          c(this, "afterSetScale");
        },
        setExtremes: function(a, l, k, q, b) {
          var e = this,
              d = e.chart;
          k = x(k, !0);
          r(e.series, function(a) {
            delete a.kdTree;
          });
          b = f(b, {
            min: a,
            max: l
          });
          c(e, "setExtremes", b, function() {
            e.userMin = a;
            e.userMax = l;
            e.eventArgs = b;
            k && d.redraw(q);
          });
        },
        zoom: function(a, l) {
          var e = this.dataMin,
              k = this.dataMax,
              b = this.options,
              d = Math.min(e, x(b.min, e)),
              b = Math.max(k, x(b.max, k));
          if (a !== this.min || l !== this.max)
            this.allowZoomOutside || (t(e) && (a < d && (a = d), a > b && (a = b)), t(k) && (l < d && (l = d), l > b && (l = b))), this.displayBtn = void 0 !== a || void 0 !== l, this.setExtremes(a, l, !1, void 0, {trigger: "zoom"});
          return !0;
        },
        setAxisSize: function() {
          var e = this.chart,
              l = this.options,
              k = l.offsets || [0, 0, 0, 0],
              q = this.horiz,
              b = this.width = Math.round(a.relativeLength(x(l.width, e.plotWidth - k[3] + k[1]), e.plotWidth)),
              d = this.height = Math.round(a.relativeLength(x(l.height, e.plotHeight - k[0] + k[2]), e.plotHeight)),
              p = this.top = Math.round(a.relativeLength(x(l.top, e.plotTop + k[0]), e.plotHeight, e.plotTop)),
              l = this.left = Math.round(a.relativeLength(x(l.left, e.plotLeft + k[3]), e.plotWidth, e.plotLeft));
          this.bottom = e.chartHeight - d - p;
          this.right = e.chartWidth - b - l;
          this.len = Math.max(q ? b : d, 0);
          this.pos = q ? l : p;
        },
        getExtremes: function() {
          var a = this.isLog,
              l = this.lin2log;
          return {
            min: a ? m(l(this.min)) : this.min,
            max: a ? m(l(this.max)) : this.max,
            dataMin: this.dataMin,
            dataMax: this.dataMax,
            userMin: this.userMin,
            userMax: this.userMax
          };
        },
        getThreshold: function(a) {
          var e = this.isLog,
              k = this.lin2log,
              q = e ? k(this.min) : this.min,
              e = e ? k(this.max) : this.max;
          null === a ? a = q : q > a ? a = q : e < a && (a = e);
          return this.translate(a, 0, 1, 0, 1);
        },
        autoLabelAlign: function(a) {
          a = (x(a, 0) - 90 * this.side + 720) % 360;
          return 15 < a && 165 > a ? "right" : 195 < a && 345 > a ? "left" : "center";
        },
        tickSize: function(a) {
          var e = this.options,
              k = e[a + "Length"],
              q = x(e[a + "Width"], "tick" === a && this.isXAxis ? 1 : 0);
          if (q && k)
            return "inside" === e[a + "Position"] && (k = -k), [k, q];
        },
        labelMetrics: function() {
          var a = this.tickPositions && this.tickPositions[0] || 0;
          return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[a] && this.ticks[a].label);
        },
        unsquish: function() {
          var a = this.options.labels,
              k = this.horiz,
              b = this.tickInterval,
              q = b,
              d = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / b),
              p,
              n = a.rotation,
              h = this.labelMetrics(),
              u,
              c = Number.MAX_VALUE,
              f,
              E = function(a) {
                a /= d || 1;
                a = 1 < a ? Math.ceil(a) : 1;
                return a * b;
              };
          k ? (f = !a.staggerLines && !a.step && (t(n) ? [n] : d < x(a.autoRotationLimit, 80) && a.autoRotation)) && r(f, function(a) {
            var e;
            if (a === n || a && -90 <= a && 90 >= a)
              u = E(Math.abs(h.h / Math.sin(y * a))), e = u + Math.abs(a / 360), e < c && (c = e, p = a, q = u);
          }) : a.step || (q = E(h.h));
          this.autoRotation = f;
          this.labelRotation = x(p, n);
          return q;
        },
        getSlotWidth: function() {
          var a = this.chart,
              k = this.horiz,
              b = this.options.labels,
              q = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1),
              d = a.margin[3];
          return k && 2 > (b.step || 0) && !b.rotation && (this.staggerLines || 1) * this.len / q || !k && (b.style && parseInt(b.style.width, 10) || d && d - a.spacing[3] || .33 * a.chartWidth);
        },
        renderUnsquish: function() {
          var a = this.chart,
              k = a.renderer,
              b = this.tickPositions,
              q = this.ticks,
              d = this.options.labels,
              p = this.horiz,
              n = this.getSlotWidth(),
              h = Math.max(1, Math.round(n - 2 * (d.padding || 5))),
              u = {},
              c = this.labelMetrics(),
              f = d.style && d.style.textOverflow,
              E,
              x,
              H = 0,
              z;
          C(d.rotation) || (u.rotation = d.rotation || 0);
          r(b, function(a) {
            (a = q[a]) && a.label && a.label.textPxLength > H && (H = a.label.textPxLength);
          });
          this.maxLabelLength = H;
          if (this.autoRotation)
            H > h && H > c.h ? u.rotation = this.labelRotation : this.labelRotation = 0;
          else if (n && (E = h, !f))
            for (x = "clip", h = b.length; !p && h--; )
              if (z = b[h], z = q[z].label)
                z.styles && "ellipsis" === z.styles.textOverflow ? z.css({textOverflow: "clip"}) : z.textPxLength > n && z.css({width: n + "px"}), z.getBBox().height > this.len / b.length - (c.h - c.f) && (z.specificTextOverflow = "ellipsis");
          u.rotation && (E = H > .5 * a.chartHeight ? .33 * a.chartHeight : a.chartHeight, f || (x = "ellipsis"));
          if (this.labelAlign = d.align || this.autoLabelAlign(this.labelRotation))
            u.align = this.labelAlign;
          r(b, function(a) {
            var e = (a = q[a]) && a.label;
            e && (e.attr(u), !E || d.style && d.style.width || !(E < e.textPxLength || "SPAN" === e.element.tagName) || e.css({
              width: E,
              textOverflow: e.specificTextOverflow || x
            }), delete e.specificTextOverflow, a.rotation = u.rotation);
          });
          this.tickRotCorr = k.rotCorr(c.b, this.labelRotation || 0, 0 !== this.side);
        },
        hasData: function() {
          return this.hasVisibleSeries || t(this.min) && t(this.max) && this.tickPositions && 0 < this.tickPositions.length;
        },
        addTitle: function(a) {
          var e = this.chart.renderer,
              k = this.horiz,
              q = this.opposite,
              b = this.options.title,
              d;
          this.axisTitle || ((d = b.textAlign) || (d = (k ? {
            low: "left",
            middle: "center",
            high: "right"
          } : {
            low: q ? "right" : "left",
            middle: "center",
            high: q ? "left" : "right"
          })[b.align]), this.axisTitle = e.text(b.text, 0, 0, b.useHTML).attr({
            zIndex: 7,
            rotation: b.rotation || 0,
            align: d
          }).addClass("highcharts-axis-title").add(this.axisGroup), this.axisTitle.isNew = !0);
          this.axisTitle.css({width: this.len});
          this.axisTitle[a ? "show" : "hide"](!0);
        },
        generateTick: function(a) {
          var e = this.ticks;
          e[a] ? e[a].addLabel() : e[a] = new E(this, a);
        },
        getOffset: function() {
          var a = this,
              k = a.chart,
              b = k.renderer,
              q = a.options,
              d = a.tickPositions,
              p = a.ticks,
              n = a.horiz,
              h = a.side,
              c = k.inverted && !a.isZAxis ? [1, 0, 3, 2][h] : h,
              f,
              E,
              H = 0,
              z,
              B = 0,
              C = q.title,
              J = q.labels,
              g = 0,
              I = k.axisOffset,
              k = k.clipOffset,
              A = [-1, 1, 1, -1][h],
              m = q.className,
              w = a.axisParent,
              y = this.tickSize("tick");
          f = a.hasData();
          a.showAxis = E = f || x(q.showEmpty, !0);
          a.staggerLines = a.horiz && J.staggerLines;
          a.axisGroup || (a.gridGroup = b.g("grid").attr({zIndex: q.gridZIndex || 1}).addClass("highcharts-" + this.coll.toLowerCase() + "-grid " + (m || "")).add(w), a.axisGroup = b.g("axis").attr({zIndex: q.zIndex || 2}).addClass("highcharts-" + this.coll.toLowerCase() + " " + (m || "")).add(w), a.labelGroup = b.g("axis-labels").attr({zIndex: J.zIndex || 7}).addClass("highcharts-" + a.coll.toLowerCase() + "-labels " + (m || "")).add(w));
          f || a.isLinked ? (r(d, function(e, k) {
            a.generateTick(e, k);
          }), a.renderUnsquish(), a.reserveSpaceDefault = 0 === h || 2 === h || {
            1: "left",
            3: "right"
          }[h] === a.labelAlign, x(J.reserveSpace, "center" === a.labelAlign ? !0 : null, a.reserveSpaceDefault) && r(d, function(a) {
            g = Math.max(p[a].getLabelSize(), g);
          }), a.staggerLines && (g *= a.staggerLines), a.labelOffset = g * (a.opposite ? -1 : 1)) : u(p, function(a, e) {
            a.destroy();
            delete p[e];
          });
          C && C.text && !1 !== C.enabled && (a.addTitle(E), E && !1 !== C.reserveSpace && (a.titleOffset = H = a.axisTitle.getBBox()[n ? "height" : "width"], z = C.offset, B = t(z) ? 0 : x(C.margin, n ? 5 : 10)));
          a.renderLine();
          a.offset = A * x(q.offset, I[h]);
          a.tickRotCorr = a.tickRotCorr || {
            x: 0,
            y: 0
          };
          b = 0 === h ? -a.labelMetrics().h : 2 === h ? a.tickRotCorr.y : 0;
          B = Math.abs(g) + B;
          g && (B = B - b + A * (n ? x(J.y, a.tickRotCorr.y + 8 * A) : J.x));
          a.axisTitleMargin = x(z, B);
          I[h] = Math.max(I[h], a.axisTitleMargin + H + A * a.offset, B, f && d.length && y ? y[0] + A * a.offset : 0);
          q = q.offset ? 0 : 2 * Math.floor(a.axisLine.strokeWidth() / 2);
          k[c] = Math.max(k[c], q);
        },
        getLinePath: function(a) {
          var e = this.chart,
              k = this.opposite,
              q = this.offset,
              b = this.horiz,
              d = this.left + (k ? this.width : 0) + q,
              q = e.chartHeight - this.bottom - (k ? this.height : 0) + q;
          k && (a *= -1);
          return e.renderer.crispLine(["M", b ? this.left : d, b ? q : this.top, "L", b ? e.chartWidth - this.right : d, b ? q : e.chartHeight - this.bottom], a);
        },
        renderLine: function() {
          this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup));
        },
        getTitlePosition: function() {
          var a = this.horiz,
              k = this.left,
              b = this.top,
              q = this.len,
              d = this.options.title,
              p = a ? k : b,
              n = this.opposite,
              h = this.offset,
              u = d.x || 0,
              c = d.y || 0,
              f = this.axisTitle,
              E = this.chart.renderer.fontMetrics(d.style && d.style.fontSize, f),
              f = Math.max(f.getBBox(null, 0).height - E.h - 1, 0),
              q = {
                low: p + (a ? 0 : q),
                middle: p + q / 2,
                high: p + (a ? q : 0)
              }[d.align],
              k = (a ? b + this.height : k) + (a ? 1 : -1) * (n ? -1 : 1) * this.axisTitleMargin + [-f, f, E.f, -f][this.side];
          return {
            x: a ? q + u : k + (n ? this.width : 0) + h + u,
            y: a ? k + c - (n ? this.height : 0) + h : q + c
          };
        },
        renderMinorTick: function(a) {
          var e = this.chart.hasRendered && d(this.oldMin),
              k = this.minorTicks;
          k[a] || (k[a] = new E(this, a, "minor"));
          e && k[a].isNew && k[a].render(null, !0);
          k[a].render(null, !1, 1);
        },
        renderTick: function(a, k) {
          var e = this.isLinked,
              b = this.ticks,
              l = this.chart.hasRendered && d(this.oldMin);
          if (!e || a >= this.min && a <= this.max)
            b[a] || (b[a] = new E(this, a)), l && b[a].isNew && b[a].render(k, !0, .1), b[a].render(k);
        },
        render: function() {
          var e = this,
              b = e.chart,
              p = e.options,
              q = e.isLog,
              n = e.lin2log,
              h = e.isLinked,
              c = e.tickPositions,
              f = e.axisTitle,
              x = e.ticks,
              H = e.minorTicks,
              z = e.alternateBands,
              B = p.stackLabels,
              C = p.alternateGridColor,
              J = e.tickmarkOffset,
              g = e.axisLine,
              I = e.showAxis,
              A = F(b.renderer.globalAnimation),
              m,
              t;
          e.labelEdge.length = 0;
          e.overlap = !1;
          r([x, H, z], function(a) {
            u(a, function(a) {
              a.isActive = !1;
            });
          });
          if (e.hasData() || h)
            e.minorTickInterval && !e.categories && r(e.getMinorTickPositions(), function(a) {
              e.renderMinorTick(a);
            }), c.length && (r(c, function(a, k) {
              e.renderTick(a, k);
            }), J && (0 === e.min || e.single) && (x[-1] || (x[-1] = new E(e, -1, null, !0)), x[-1].render(-1))), C && r(c, function(k, d) {
              t = void 0 !== c[d + 1] ? c[d + 1] + J : e.max - J;
              0 === d % 2 && k < e.max && t <= e.max + (b.polar ? -J : J) && (z[k] || (z[k] = new a.PlotLineOrBand(e)), m = k + J, z[k].options = {
                from: q ? n(m) : m,
                to: q ? n(t) : t,
                color: C
              }, z[k].render(), z[k].isActive = !0);
            }), e._addedPlotLB || (r((p.plotLines || []).concat(p.plotBands || []), function(a) {
              e.addPlotBandOrLine(a);
            }), e._addedPlotLB = !0);
          r([x, H, z], function(a) {
            var e,
                q = [],
                d = A.duration;
            u(a, function(a, e) {
              a.isActive || (a.render(e, !1, 0), a.isActive = !1, q.push(e));
            });
            k(function() {
              for (e = q.length; e--; )
                a[q[e]] && !a[q[e]].isActive && (a[q[e]].destroy(), delete a[q[e]]);
            }, a !== z && b.hasRendered && d ? d : 0);
          });
          g && (g[g.isPlaced ? "animate" : "attr"]({d: this.getLinePath(g.strokeWidth())}), g.isPlaced = !0, g[I ? "show" : "hide"](!0));
          f && I && (p = e.getTitlePosition(), d(p.y) ? (f[f.isNew ? "attr" : "animate"](p), f.isNew = !1) : (f.attr("y", -9999), f.isNew = !0));
          B && B.enabled && e.renderStackTotals();
          e.isDirty = !1;
        },
        redraw: function() {
          this.visible && (this.render(), r(this.plotLinesAndBands, function(a) {
            a.render();
          }));
          r(this.series, function(a) {
            a.isDirty = !0;
          });
        },
        keepProps: "extKey hcEvents names series userMax userMin".split(" "),
        destroy: function(a) {
          var e = this,
              k = e.stacks,
              b = e.plotLinesAndBands,
              d;
          a || p(e);
          u(k, function(a, e) {
            w(a);
            k[e] = null;
          });
          r([e.ticks, e.minorTicks, e.alternateBands], function(a) {
            w(a);
          });
          if (b)
            for (a = b.length; a--; )
              b[a].destroy();
          r("stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross".split(" "), function(a) {
            e[a] && (e[a] = e[a].destroy());
          });
          for (d in e.plotLinesAndBandsGroups)
            e.plotLinesAndBandsGroups[d] = e.plotLinesAndBandsGroups[d].destroy();
          u(e, function(a, k) {
            -1 === n(k, e.keepProps) && delete e[k];
          });
        },
        drawCrosshair: function(a, k) {
          var e,
              b = this.crosshair,
              d = x(b.snap, !0),
              l,
              p = this.cross;
          a || (a = this.cross && this.cross.e);
          this.crosshair && !1 !== (t(k) || !d) ? (d ? t(k) && (l = this.isXAxis ? k.plotX : this.len - k.plotY) : l = a && (this.horiz ? a.chartX - this.pos : this.len - a.chartY + this.pos), t(l) && (e = this.getPlotLinePath(k && (this.isXAxis ? k.x : x(k.stackY, k.y)), null, null, null, l) || null), t(e) ? (k = this.categories && !this.isRadial, p || (this.cross = p = this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" + (k ? "category " : "thin ") + b.className).attr({zIndex: x(b.zIndex, 2)}).add()), p.show().attr({d: e}), k && !b.width && p.attr({"stroke-width": this.transA}), this.cross.e = a) : this.hideCrosshair()) : this.hideCrosshair();
        },
        hideCrosshair: function() {
          this.cross && this.cross.hide();
        }
      });
      return a.Axis = J;
    }(K);
    (function(a) {
      var D = a.Axis,
          F = a.getMagnitude,
          G = a.normalizeTickInterval,
          v = a.timeUnits;
      D.prototype.getTimeTicks = function() {
        return this.chart.time.getTimeTicks.apply(this.chart.time, arguments);
      };
      D.prototype.normalizeTimeTickInterval = function(a, g) {
        var m = g || [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second", [1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1, 2]], ["week", [1, 2]], ["month", [1, 2, 3, 4, 6]], ["year", null]];
        g = m[m.length - 1];
        var y = v[g[0]],
            w = g[1],
            r;
        for (r = 0; r < m.length && !(g = m[r], y = v[g[0]], w = g[1], m[r + 1] && a <= (y * w[w.length - 1] + v[m[r + 1][0]]) / 2); r++)
          ;
        y === v.year && a < 5 * y && (w = [1, 2, 5]);
        a = G(a / y, w, "year" === g[0] ? Math.max(F(a / y), 1) : 1);
        return {
          unitRange: y,
          count: a,
          unitName: g[0]
        };
      };
    })(K);
    (function(a) {
      var D = a.Axis,
          F = a.getMagnitude,
          G = a.map,
          v = a.normalizeTickInterval,
          m = a.pick;
      D.prototype.getLogTickPositions = function(a, t, y, w) {
        var r = this.options,
            f = this.len,
            c = this.lin2log,
            g = this.log2lin,
            b = [];
        w || (this._minorAutoInterval = null);
        if (.5 <= a)
          a = Math.round(a), b = this.getLinearTickPositions(a, t, y);
        else if (.08 <= a)
          for (var f = Math.floor(t),
              h,
              n,
              B,
              d,
              C,
              r = .3 < a ? [1, 2, 4] : .15 < a ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; f < y + 1 && !C; f++)
            for (n = r.length, h = 0; h < n && !C; h++)
              B = g(c(f) * r[h]), B > t && (!w || d <= y) && void 0 !== d && b.push(d), d > y && (C = !0), d = B;
        else
          t = c(t), y = c(y), a = w ? this.getMinorTickInterval() : r.tickInterval, a = m("auto" === a ? null : a, this._minorAutoInterval, r.tickPixelInterval / (w ? 5 : 1) * (y - t) / ((w ? f / this.tickPositions.length : f) || 1)), a = v(a, null, F(a)), b = G(this.getLinearTickPositions(a, t, y), g), w || (this._minorAutoInterval = a / 5);
        w || (this.tickInterval = a);
        return b;
      };
      D.prototype.log2lin = function(a) {
        return Math.log(a) / Math.LN10;
      };
      D.prototype.lin2log = function(a) {
        return Math.pow(10, a);
      };
    })(K);
    (function(a, D) {
      var F = a.arrayMax,
          G = a.arrayMin,
          v = a.defined,
          m = a.destroyObjectProperties,
          g = a.each,
          t = a.erase,
          y = a.merge,
          w = a.pick;
      a.PlotLineOrBand = function(a, f) {
        this.axis = a;
        f && (this.options = f, this.id = f.id);
      };
      a.PlotLineOrBand.prototype = {
        render: function() {
          var r = this,
              f = r.axis,
              c = f.horiz,
              g = r.options,
              b = g.label,
              h = r.label,
              n = g.to,
              B = g.from,
              d = g.value,
              C = v(B) && v(n),
              I = v(d),
              z = r.svgElem,
              u = !z,
              x = [],
              p = w(g.zIndex, 0),
              H = g.events,
              x = {"class": "highcharts-plot-" + (C ? "band " : "line ") + (g.className || "")},
              k = {},
              E = f.chart.renderer,
              J = C ? "bands" : "lines",
              e;
          e = f.log2lin;
          f.isLog && (B = e(B), n = e(n), d = e(d));
          k.zIndex = p;
          J += "-" + p;
          (e = f.plotLinesAndBandsGroups[J]) || (f.plotLinesAndBandsGroups[J] = e = E.g("plot-" + J).attr(k).add());
          u && (r.svgElem = z = E.path().attr(x).add(e));
          if (I)
            x = f.getPlotLinePath(d, z.strokeWidth());
          else if (C)
            x = f.getPlotBandPath(B, n, g);
          else
            return;
          u && x && x.length ? (z.attr({d: x}), H && a.objectEach(H, function(a, e) {
            z.on(e, function(a) {
              H[e].apply(r, [a]);
            });
          })) : z && (x ? (z.show(), z.animate({d: x})) : (z.hide(), h && (r.label = h = h.destroy())));
          b && v(b.text) && x && x.length && 0 < f.width && 0 < f.height && !x.flat ? (b = y({
            align: c && C && "center",
            x: c ? !C && 4 : 10,
            verticalAlign: !c && C && "middle",
            y: c ? C ? 16 : 10 : C ? 6 : -4,
            rotation: c && !C && 90
          }, b), this.renderLabel(b, x, C, p)) : h && h.hide();
          return r;
        },
        renderLabel: function(a, f, c, g) {
          var b = this.label,
              h = this.axis.chart.renderer;
          b || (b = {
            align: a.textAlign || a.align,
            rotation: a.rotation,
            "class": "highcharts-plot-" + (c ? "band" : "line") + "-label " + (a.className || "")
          }, b.zIndex = g, this.label = b = h.text(a.text, 0, 0, a.useHTML).attr(b).add());
          g = f.xBounds || [f[1], f[4], c ? f[6] : f[1]];
          f = f.yBounds || [f[2], f[5], c ? f[7] : f[2]];
          c = G(g);
          h = G(f);
          b.align(a, !1, {
            x: c,
            y: h,
            width: F(g) - c,
            height: F(f) - h
          });
          b.show();
        },
        destroy: function() {
          t(this.axis.plotLinesAndBands, this);
          delete this.axis;
          m(this);
        }
      };
      a.extend(D.prototype, {
        getPlotBandPath: function(a, f) {
          var c = this.getPlotLinePath(f, null, null, !0),
              g = this.getPlotLinePath(a, null, null, !0),
              b = [],
              h = this.horiz,
              n = 1,
              B;
          a = a < this.min && f < this.min || a > this.max && f > this.max;
          if (g && c)
            for (a && (B = g.toString() === c.toString(), n = 0), a = 0; a < g.length; a += 6)
              h && c[a + 1] === g[a + 1] ? (c[a + 1] += n, c[a + 4] += n) : h || c[a + 2] !== g[a + 2] || (c[a + 2] += n, c[a + 5] += n), b.push("M", g[a + 1], g[a + 2], "L", g[a + 4], g[a + 5], c[a + 4], c[a + 5], c[a + 1], c[a + 2], "z"), b.flat = B;
          return b;
        },
        addPlotBand: function(a) {
          return this.addPlotBandOrLine(a, "plotBands");
        },
        addPlotLine: function(a) {
          return this.addPlotBandOrLine(a, "plotLines");
        },
        addPlotBandOrLine: function(g, f) {
          var c = (new a.PlotLineOrBand(this, g)).render(),
              r = this.userOptions;
          c && (f && (r[f] = r[f] || [], r[f].push(g)), this.plotLinesAndBands.push(c));
          return c;
        },
        removePlotBandOrLine: function(a) {
          for (var f = this.plotLinesAndBands,
              c = this.options,
              r = this.userOptions,
              b = f.length; b--; )
            f[b].id === a && f[b].destroy();
          g([c.plotLines || [], r.plotLines || [], c.plotBands || [], r.plotBands || []], function(h) {
            for (b = h.length; b--; )
              h[b].id === a && t(h, h[b]);
          });
        },
        removePlotBand: function(a) {
          this.removePlotBandOrLine(a);
        },
        removePlotLine: function(a) {
          this.removePlotBandOrLine(a);
        }
      });
    })(K, Z);
    (function(a) {
      var D = a.each,
          F = a.extend,
          G = a.format,
          v = a.isNumber,
          m = a.map,
          g = a.merge,
          t = a.pick,
          y = a.splat,
          w = a.syncTimeout,
          r = a.timeUnits;
      a.Tooltip = function() {
        this.init.apply(this, arguments);
      };
      a.Tooltip.prototype = {
        init: function(a, c) {
          this.chart = a;
          this.options = c;
          this.crosshairs = [];
          this.now = {
            x: 0,
            y: 0
          };
          this.isHidden = !0;
          this.split = c.split && !a.inverted;
          this.shared = c.shared || this.split;
        },
        cleanSplit: function(a) {
          D(this.chart.series, function(c) {
            var f = c && c.tt;
            f && (!f.isActive || a ? c.tt = f.destroy() : f.isActive = !1);
          });
        },
        applyFilter: function() {
          var a = this.chart;
          a.renderer.definition({
            tagName: "filter",
            id: "drop-shadow-" + a.index,
            opacity: .5,
            children: [{
              tagName: "feGaussianBlur",
              in: "SourceAlpha",
              stdDeviation: 1
            }, {
              tagName: "feOffset",
              dx: 1,
              dy: 1
            }, {
              tagName: "feComponentTransfer",
              children: [{
                tagName: "feFuncA",
                type: "linear",
                slope: .3
              }]
            }, {
              tagName: "feMerge",
              children: [{tagName: "feMergeNode"}, {
                tagName: "feMergeNode",
                in: "SourceGraphic"
              }]
            }]
          });
          a.renderer.definition({
            tagName: "style",
            textContent: ".highcharts-tooltip-" + a.index + "{filter:url(#drop-shadow-" + a.index + ")}"
          });
        },
        getLabel: function() {
          var a = this.chart.renderer,
              c = this.options;
          this.label || (this.label = this.split ? a.g("tooltip") : a.label("", 0, 0, c.shape || "callout", null, null, c.useHTML, null, "tooltip").attr({
            padding: c.padding,
            r: c.borderRadius
          }), this.applyFilter(), this.label.addClass("highcharts-tooltip-" + this.chart.index), this.label.attr({zIndex: 8}).add());
          return this.label;
        },
        update: function(a) {
          this.destroy();
          g(!0, this.chart.options.tooltip.userOptions, a);
          this.init(this.chart, g(!0, this.options, a));
        },
        destroy: function() {
          this.label && (this.label = this.label.destroy());
          this.split && this.tt && (this.cleanSplit(this.chart, !0), this.tt = this.tt.destroy());
          clearTimeout(this.hideTimer);
          clearTimeout(this.tooltipTimeout);
        },
        move: function(a, c, g, b) {
          var h = this,
              n = h.now,
              f = !1 !== h.options.animation && !h.isHidden && (1 < Math.abs(a - n.x) || 1 < Math.abs(c - n.y)),
              d = h.followPointer || 1 < h.len;
          F(n, {
            x: f ? (2 * n.x + a) / 3 : a,
            y: f ? (n.y + c) / 2 : c,
            anchorX: d ? void 0 : f ? (2 * n.anchorX + g) / 3 : g,
            anchorY: d ? void 0 : f ? (n.anchorY + b) / 2 : b
          });
          h.getLabel().attr(n);
          f && (clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function() {
            h && h.move(a, c, g, b);
          }, 32));
        },
        hide: function(a) {
          var c = this;
          clearTimeout(this.hideTimer);
          a = t(a, this.options.hideDelay, 500);
          this.isHidden || (this.hideTimer = w(function() {
            c.getLabel()[a ? "fadeOut" : "hide"]();
            c.isHidden = !0;
          }, a));
        },
        getAnchor: function(a, c) {
          var f,
              b = this.chart,
              h = b.inverted,
              n = b.plotTop,
              B = b.plotLeft,
              d = 0,
              C = 0,
              g,
              z;
          a = y(a);
          f = a[0].tooltipPos;
          this.followPointer && c && (void 0 === c.chartX && (c = b.pointer.normalize(c)), f = [c.chartX - b.plotLeft, c.chartY - n]);
          f || (D(a, function(a) {
            g = a.series.yAxis;
            z = a.series.xAxis;
            d += a.plotX + (!h && z ? z.left - B : 0);
            C += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!h && g ? g.top - n : 0);
          }), d /= a.length, C /= a.length, f = [h ? b.plotWidth - C : d, this.shared && !h && 1 < a.length && c ? c.chartY - n : h ? b.plotHeight - d : C]);
          return m(f, Math.round);
        },
        getPosition: function(a, c, g) {
          var b = this.chart,
              h = this.distance,
              n = {},
              f = b.inverted && g.h || 0,
              d,
              C = ["y", b.chartHeight, c, g.plotY + b.plotTop, b.plotTop, b.plotTop + b.plotHeight],
              I = ["x", b.chartWidth, a, g.plotX + b.plotLeft, b.plotLeft, b.plotLeft + b.plotWidth],
              z = !this.followPointer && t(g.ttBelow, !b.inverted === !!g.negative),
              u = function(a, b, d, e, l, p) {
                var k = d < e - h,
                    c = e + h + d < b,
                    u = e - h - d;
                e += h;
                if (z && c)
                  n[a] = e;
                else if (!z && k)
                  n[a] = u;
                else if (k)
                  n[a] = Math.min(p - d, 0 > u - f ? u : u - f);
                else if (c)
                  n[a] = Math.max(l, e + f + d > b ? e : e + f);
                else
                  return !1;
              },
              x = function(a, b, d, e) {
                var k;
                e < h || e > b - h ? k = !1 : n[a] = e < d / 2 ? 1 : e > b - d / 2 ? b - d - 2 : e - d / 2;
                return k;
              },
              p = function(a) {
                var k = C;
                C = I;
                I = k;
                d = a;
              },
              H = function() {
                !1 !== u.apply(0, C) ? !1 !== x.apply(0, I) || d || (p(!0), H()) : d ? n.x = n.y = 0 : (p(!0), H());
              };
          (b.inverted || 1 < this.len) && p();
          H();
          return n;
        },
        defaultFormatter: function(a) {
          var c = this.points || y(this),
              f;
          f = [a.tooltipFooterHeaderFormatter(c[0])];
          f = f.concat(a.bodyFormatter(c));
          f.push(a.tooltipFooterHeaderFormatter(c[0], !0));
          return f;
        },
        refresh: function(a, c) {
          var f,
              b = this.options,
              h = a,
              n,
              B = {},
              d = [];
          f = b.formatter || this.defaultFormatter;
          var B = this.shared,
              g;
          b.enabled && (clearTimeout(this.hideTimer), this.followPointer = y(h)[0].series.tooltipOptions.followPointer, n = this.getAnchor(h, c), c = n[0], b = n[1], !B || h.series && h.series.noSharedTooltip ? B = h.getLabelConfig() : (D(h, function(a) {
            a.setState("hover");
            d.push(a.getLabelConfig());
          }), B = {
            x: h[0].category,
            y: h[0].y
          }, B.points = d, h = h[0]), this.len = d.length, B = f.call(B, this), g = h.series, this.distance = t(g.tooltipOptions.distance, 16), !1 === B ? this.hide() : (f = this.getLabel(), this.isHidden && f.attr({opacity: 1}).show(), this.split ? this.renderSplit(B, y(a)) : (f.css({width: this.chart.spacingBox.width}), f.attr({text: B && B.join ? B.join("") : B}), f.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-" + t(h.colorIndex, g.colorIndex)), this.updatePosition({
            plotX: c,
            plotY: b,
            negative: h.negative,
            ttBelow: h.ttBelow,
            h: n[2] || 0
          })), this.isHidden = !1));
        },
        renderSplit: function(f, c) {
          var g = this,
              b = [],
              h = this.chart,
              n = h.renderer,
              B = !0,
              d = this.options,
              C = 0,
              I = this.getLabel();
          a.isString(f) && (f = [!1, f]);
          D(f.slice(0, c.length + 1), function(a, u) {
            if (!1 !== a) {
              u = c[u - 1] || {
                isHeader: !0,
                plotX: c[0].plotX
              };
              var f = u.series || g,
                  p = f.tt,
                  H = "highcharts-color-" + t(u.colorIndex, (u.series || {}).colorIndex, "none");
              p || (f.tt = p = n.label(null, null, null, "callout", null, null, d.useHTML).addClass("highcharts-tooltip-box " + H).attr({
                padding: d.padding,
                r: d.borderRadius
              }).add(I));
              p.isActive = !0;
              p.attr({text: a});
              a = p.getBBox();
              H = a.width + p.strokeWidth();
              u.isHeader ? (C = a.height, H = Math.max(0, Math.min(u.plotX + h.plotLeft - H / 2, h.chartWidth - H))) : H = u.plotX + h.plotLeft - t(d.distance, 16) - H;
              0 > H && (B = !1);
              a = (u.series && u.series.yAxis && u.series.yAxis.pos) + (u.plotY || 0);
              a -= h.plotTop;
              b.push({
                target: u.isHeader ? h.plotHeight + C : a,
                rank: u.isHeader ? 1 : 0,
                size: f.tt.getBBox().height + 1,
                point: u,
                x: H,
                tt: p
              });
            }
          });
          this.cleanSplit();
          a.distribute(b, h.plotHeight + C);
          D(b, function(a) {
            var b = a.point,
                n = b.series;
            a.tt.attr({
              visibility: void 0 === a.pos ? "hidden" : "inherit",
              x: B || b.isHeader ? a.x : b.plotX + h.plotLeft + t(d.distance, 16),
              y: a.pos + h.plotTop,
              anchorX: b.isHeader ? b.plotX + h.plotLeft : b.plotX + n.xAxis.pos,
              anchorY: b.isHeader ? a.pos + h.plotTop - 15 : b.plotY + n.yAxis.pos
            });
          });
        },
        updatePosition: function(a) {
          var c = this.chart,
              f = this.getLabel(),
              f = (this.options.positioner || this.getPosition).call(this, f.width, f.height, a);
          this.move(Math.round(f.x), Math.round(f.y || 0), a.plotX + c.plotLeft, a.plotY + c.plotTop);
        },
        getDateFormat: function(a, c, g, b) {
          var h = this.chart.time,
              n = h.dateFormat("%m-%d %H:%M:%S.%L", c),
              f,
              d,
              C = {
                millisecond: 15,
                second: 12,
                minute: 9,
                hour: 6,
                day: 3
              },
              I = "millisecond";
          for (d in r) {
            if (a === r.week && +h.dateFormat("%w", c) === g && "00:00:00.000" === n.substr(6)) {
              d = "week";
              break;
            }
            if (r[d] > a) {
              d = I;
              break;
            }
            if (C[d] && n.substr(C[d]) !== "01-01 00:00:00.000".substr(C[d]))
              break;
            "week" !== d && (I = d);
          }
          d && (f = b[d]);
          return f;
        },
        getXDateFormat: function(a, c, g) {
          c = c.dateTimeLabelFormats;
          var b = g && g.closestPointRange;
          return (b ? this.getDateFormat(b, a.x, g.options.startOfWeek, c) : c.day) || c.year;
        },
        tooltipFooterHeaderFormatter: function(a, c) {
          c = c ? "footer" : "header";
          var f = a.series,
              b = f.tooltipOptions,
              h = b.xDateFormat,
              n = f.xAxis,
              g = n && "datetime" === n.options.type && v(a.key),
              d = b[c + "Format"];
          g && !h && (h = this.getXDateFormat(a, b, n));
          g && h && D(a.point && a.point.tooltipDateKeys || ["key"], function(a) {
            d = d.replace("{point." + a + "}", "{point." + a + ":" + h + "}");
          });
          return G(d, {
            point: a,
            series: f
          }, this.chart.time);
        },
        bodyFormatter: function(a) {
          return m(a, function(a) {
            var c = a.series.tooltipOptions;
            return (c[(a.point.formatPrefix || "point") + "Formatter"] || a.point.tooltipFormatter).call(a.point, c[(a.point.formatPrefix || "point") + "Format"]);
          });
        }
      };
    })(K);
    (function(a) {
      var D = a.addEvent,
          F = a.attr,
          G = a.charts,
          v = a.css,
          m = a.defined,
          g = a.each,
          t = a.extend,
          y = a.find,
          w = a.fireEvent,
          r = a.isNumber,
          f = a.isObject,
          c = a.offset,
          A = a.pick,
          b = a.splat,
          h = a.Tooltip;
      a.Pointer = function(a, b) {
        this.init(a, b);
      };
      a.Pointer.prototype = {
        init: function(a, b) {
          this.options = b;
          this.chart = a;
          this.runChartClick = b.chart.events && !!b.chart.events.click;
          this.pinchDown = [];
          this.lastValidTouch = {};
          h && (a.tooltip = new h(a, b.tooltip), this.followTouchMove = A(b.tooltip.followTouchMove, !0));
          this.setDOMEvents();
        },
        zoomOption: function(a) {
          var b = this.chart,
              d = b.options.chart,
              n = d.zoomType || "",
              b = b.inverted;
          /touch/.test(a.type) && (n = A(d.pinchType, n));
          this.zoomX = a = /x/.test(n);
          this.zoomY = n = /y/.test(n);
          this.zoomHor = a && !b || n && b;
          this.zoomVert = n && !b || a && b;
          this.hasZoom = a || n;
        },
        normalize: function(a, b) {
          var d;
          d = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] : a;
          b || (this.chartPosition = b = c(this.chart.container));
          return t(a, {
            chartX: Math.round(d.pageX - b.left),
            chartY: Math.round(d.pageY - b.top)
          });
        },
        getCoordinates: function(a) {
          var b = {
            xAxis: [],
            yAxis: []
          };
          g(this.chart.axes, function(d) {
            b[d.isXAxis ? "xAxis" : "yAxis"].push({
              axis: d,
              value: d.toValue(a[d.horiz ? "chartX" : "chartY"])
            });
          });
          return b;
        },
        findNearestKDPoint: function(a, b, d) {
          var n;
          g(a, function(a) {
            var h = !(a.noSharedTooltip && b) && 0 > a.options.findNearestPointBy.indexOf("y");
            a = a.searchPoint(d, h);
            if ((h = f(a, !0)) && !(h = !f(n, !0)))
              var h = n.distX - a.distX,
                  c = n.dist - a.dist,
                  x = (a.series.group && a.series.group.zIndex) - (n.series.group && n.series.group.zIndex),
                  h = 0 < (0 !== h && b ? h : 0 !== c ? c : 0 !== x ? x : n.series.index > a.series.index ? -1 : 1);
            h && (n = a);
          });
          return n;
        },
        getPointFromEvent: function(a) {
          a = a.target;
          for (var b; a && !b; )
            b = a.point, a = a.parentNode;
          return b;
        },
        getChartCoordinatesFromPoint: function(a, b) {
          var d = a.series,
              n = d.xAxis,
              d = d.yAxis,
              h = A(a.clientX, a.plotX);
          if (n && d)
            return b ? {
              chartX: n.len + n.pos - h,
              chartY: d.len + d.pos - a.plotY
            } : {
              chartX: h + n.pos,
              chartY: a.plotY + d.pos
            };
        },
        getHoverData: function(b, h, d, c, I, z, u) {
          var n,
              p = [],
              H = u && u.isBoosting;
          c = !(!c || !b);
          u = h && !h.stickyTracking ? [h] : a.grep(d, function(a) {
            return a.visible && !(!I && a.directTouch) && A(a.options.enableMouseTracking, !0) && a.stickyTracking;
          });
          h = (n = c ? b : this.findNearestKDPoint(u, I, z)) && n.series;
          n && (I && !h.noSharedTooltip ? (u = a.grep(d, function(a) {
            return a.visible && !(!I && a.directTouch) && A(a.options.enableMouseTracking, !0) && !a.noSharedTooltip;
          }), g(u, function(a) {
            var k = y(a.points, function(a) {
              return a.x === n.x && !a.isNull;
            });
            f(k) && (H && (k = a.getPoint(k)), p.push(k));
          })) : p.push(n));
          return {
            hoverPoint: n,
            hoverSeries: h,
            hoverPoints: p
          };
        },
        runPointActions: function(b, h) {
          var d = this.chart,
              n = d.tooltip && d.tooltip.options.enabled ? d.tooltip : void 0,
              c = n ? n.shared : !1,
              f = h || d.hoverPoint,
              u = f && f.series || d.hoverSeries,
              u = this.getHoverData(f, u, d.series, !!h || u && u.directTouch && this.isDirectTouch, c, b, {isBoosting: d.isBoosting}),
              x,
              f = u.hoverPoint;
          x = u.hoverPoints;
          h = (u = u.hoverSeries) && u.tooltipOptions.followPointer;
          c = c && u && !u.noSharedTooltip;
          if (f && (f !== d.hoverPoint || n && n.isHidden)) {
            g(d.hoverPoints || [], function(b) {
              -1 === a.inArray(b, x) && b.setState();
            });
            g(x || [], function(a) {
              a.setState("hover");
            });
            if (d.hoverSeries !== u)
              u.onMouseOver();
            d.hoverPoint && d.hoverPoint.firePointEvent("mouseOut");
            if (!f.series)
              return;
            f.firePointEvent("mouseOver");
            d.hoverPoints = x;
            d.hoverPoint = f;
            n && n.refresh(c ? x : f, b);
          } else
            h && n && !n.isHidden && (f = n.getAnchor([{}], b), n.updatePosition({
              plotX: f[0],
              plotY: f[1]
            }));
          this.unDocMouseMove || (this.unDocMouseMove = D(d.container.ownerDocument, "mousemove", function(b) {
            var d = G[a.hoverChartIndex];
            if (d)
              d.pointer.onDocumentMouseMove(b);
          }));
          g(d.axes, function(d) {
            var p = A(d.crosshair.snap, !0),
                k = p ? a.find(x, function(a) {
                  return a.series[d.coll] === d;
                }) : void 0;
            k || !p ? d.drawCrosshair(b, k) : d.hideCrosshair();
          });
        },
        reset: function(a, h) {
          var d = this.chart,
              n = d.hoverSeries,
              c = d.hoverPoint,
              f = d.hoverPoints,
              u = d.tooltip,
              x = u && u.shared ? f : c;
          a && x && g(b(x), function(b) {
            b.series.isCartesian && void 0 === b.plotX && (a = !1);
          });
          if (a)
            u && x && (u.refresh(x), c && (c.setState(c.state, !0), g(d.axes, function(a) {
              a.crosshair && a.drawCrosshair(null, c);
            })));
          else {
            if (c)
              c.onMouseOut();
            f && g(f, function(a) {
              a.setState();
            });
            if (n)
              n.onMouseOut();
            u && u.hide(h);
            this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove());
            g(d.axes, function(a) {
              a.hideCrosshair();
            });
            this.hoverX = d.hoverPoints = d.hoverPoint = null;
          }
        },
        scaleGroups: function(a, b) {
          var d = this.chart,
              n;
          g(d.series, function(h) {
            n = a || h.getPlotBox();
            h.xAxis && h.xAxis.zoomEnabled && h.group && (h.group.attr(n), h.markerGroup && (h.markerGroup.attr(n), h.markerGroup.clip(b ? d.clipRect : null)), h.dataLabelsGroup && h.dataLabelsGroup.attr(n));
          });
          d.clipRect.attr(b || d.clipBox);
        },
        dragStart: function(a) {
          var b = this.chart;
          b.mouseIsDown = a.type;
          b.cancelClick = !1;
          b.mouseDownX = this.mouseDownX = a.chartX;
          b.mouseDownY = this.mouseDownY = a.chartY;
        },
        drag: function(a) {
          var b = this.chart,
              d = b.options.chart,
              h = a.chartX,
              n = a.chartY,
              c = this.zoomHor,
              u = this.zoomVert,
              f = b.plotLeft,
              p = b.plotTop,
              H = b.plotWidth,
              k = b.plotHeight,
              E,
              g = this.selectionMarker,
              e = this.mouseDownX,
              l = this.mouseDownY,
              r = d.panKey && a[d.panKey + "Key"];
          g && g.touch || (h < f ? h = f : h > f + H && (h = f + H), n < p ? n = p : n > p + k && (n = p + k), this.hasDragged = Math.sqrt(Math.pow(e - h, 2) + Math.pow(l - n, 2)), 10 < this.hasDragged && (E = b.isInsidePlot(e - f, l - p), b.hasCartesianSeries && (this.zoomX || this.zoomY) && E && !r && !g && (this.selectionMarker = g = b.renderer.rect(f, p, c ? 1 : H, u ? 1 : k, 0).attr({
            "class": "highcharts-selection-marker",
            zIndex: 7
          }).add()), g && c && (h -= e, g.attr({
            width: Math.abs(h),
            x: (0 < h ? 0 : h) + e
          })), g && u && (h = n - l, g.attr({
            height: Math.abs(h),
            y: (0 < h ? 0 : h) + l
          })), E && !g && d.panning && b.pan(a, d.panning)));
        },
        drop: function(a) {
          var b = this,
              d = this.chart,
              h = this.hasPinched;
          if (this.selectionMarker) {
            var n = {
              originalEvent: a,
              xAxis: [],
              yAxis: []
            },
                c = this.selectionMarker,
                f = c.attr ? c.attr("x") : c.x,
                x = c.attr ? c.attr("y") : c.y,
                p = c.attr ? c.attr("width") : c.width,
                H = c.attr ? c.attr("height") : c.height,
                k;
            if (this.hasDragged || h)
              g(d.axes, function(d) {
                if (d.zoomEnabled && m(d.min) && (h || b[{
                  xAxis: "zoomX",
                  yAxis: "zoomY"
                }[d.coll]])) {
                  var c = d.horiz,
                      e = "touchend" === a.type ? d.minPixelPadding : 0,
                      l = d.toValue((c ? f : x) + e),
                      c = d.toValue((c ? f + p : x + H) - e);
                  n[d.coll].push({
                    axis: d,
                    min: Math.min(l, c),
                    max: Math.max(l, c)
                  });
                  k = !0;
                }
              }), k && w(d, "selection", n, function(a) {
                d.zoom(t(a, h ? {animation: !1} : null));
              });
            r(d.index) && (this.selectionMarker = this.selectionMarker.destroy());
            h && this.scaleGroups();
          }
          d && r(d.index) && (v(d.container, {cursor: d._cursor}), d.cancelClick = 10 < this.hasDragged, d.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = []);
        },
        onContainerMouseDown: function(a) {
          a = this.normalize(a);
          2 !== a.button && (this.zoomOption(a), a.preventDefault && a.preventDefault(), this.dragStart(a));
        },
        onDocumentMouseUp: function(b) {
          G[a.hoverChartIndex] && G[a.hoverChartIndex].pointer.drop(b);
        },
        onDocumentMouseMove: function(a) {
          var b = this.chart,
              d = this.chartPosition;
          a = this.normalize(a, d);
          !d || this.inClass(a.target, "highcharts-tracker") || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) || this.reset();
        },
        onContainerMouseLeave: function(b) {
          var h = G[a.hoverChartIndex];
          h && (b.relatedTarget || b.toElement) && (h.pointer.reset(), h.pointer.chartPosition = null);
        },
        onContainerMouseMove: function(b) {
          var h = this.chart;
          m(a.hoverChartIndex) && G[a.hoverChartIndex] && G[a.hoverChartIndex].mouseIsDown || (a.hoverChartIndex = h.index);
          b = this.normalize(b);
          b.returnValue = !1;
          "mousedown" === h.mouseIsDown && this.drag(b);
          !this.inClass(b.target, "highcharts-tracker") && !h.isInsidePlot(b.chartX - h.plotLeft, b.chartY - h.plotTop) || h.openMenu || this.runPointActions(b);
        },
        inClass: function(a, b) {
          for (var d; a; ) {
            if (d = F(a, "class")) {
              if (-1 !== d.indexOf(b))
                return !0;
              if (-1 !== d.indexOf("highcharts-container"))
                return !1;
            }
            a = a.parentNode;
          }
        },
        onTrackerMouseOut: function(a) {
          var b = this.chart.hoverSeries;
          a = a.relatedTarget || a.toElement;
          this.isDirectTouch = !1;
          if (!(!b || !a || b.stickyTracking || this.inClass(a, "highcharts-tooltip") || this.inClass(a, "highcharts-series-" + b.index) && this.inClass(a, "highcharts-tracker")))
            b.onMouseOut();
        },
        onContainerClick: function(a) {
          var b = this.chart,
              d = b.hoverPoint,
              h = b.plotLeft,
              n = b.plotTop;
          a = this.normalize(a);
          b.cancelClick || (d && this.inClass(a.target, "highcharts-tracker") ? (w(d.series, "click", t(a, {point: d})), b.hoverPoint && d.firePointEvent("click", a)) : (t(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - h, a.chartY - n) && w(b, "click", a)));
        },
        setDOMEvents: function() {
          var b = this,
              h = b.chart.container,
              d = h.ownerDocument;
          h.onmousedown = function(a) {
            b.onContainerMouseDown(a);
          };
          h.onmousemove = function(a) {
            b.onContainerMouseMove(a);
          };
          h.onclick = function(a) {
            b.onContainerClick(a);
          };
          this.unbindContainerMouseLeave = D(h, "mouseleave", b.onContainerMouseLeave);
          a.unbindDocumentMouseUp || (a.unbindDocumentMouseUp = D(d, "mouseup", b.onDocumentMouseUp));
          a.hasTouch && (h.ontouchstart = function(a) {
            b.onContainerTouchStart(a);
          }, h.ontouchmove = function(a) {
            b.onContainerTouchMove(a);
          }, a.unbindDocumentTouchEnd || (a.unbindDocumentTouchEnd = D(d, "touchend", b.onDocumentTouchEnd)));
        },
        destroy: function() {
          var b = this;
          b.unDocMouseMove && b.unDocMouseMove();
          this.unbindContainerMouseLeave();
          a.chartCount || (a.unbindDocumentMouseUp && (a.unbindDocumentMouseUp = a.unbindDocumentMouseUp()), a.unbindDocumentTouchEnd && (a.unbindDocumentTouchEnd = a.unbindDocumentTouchEnd()));
          clearInterval(b.tooltipTimeout);
          a.objectEach(b, function(a, d) {
            b[d] = null;
          });
        }
      };
    })(K);
    (function(a) {
      var D = a.charts,
          F = a.each,
          G = a.extend,
          v = a.map,
          m = a.noop,
          g = a.pick;
      G(a.Pointer.prototype, {
        pinchTranslate: function(a, g, m, r, f, c) {
          this.zoomHor && this.pinchTranslateDirection(!0, a, g, m, r, f, c);
          this.zoomVert && this.pinchTranslateDirection(!1, a, g, m, r, f, c);
        },
        pinchTranslateDirection: function(a, g, m, r, f, c, A, b) {
          var h = this.chart,
              n = a ? "x" : "y",
              B = a ? "X" : "Y",
              d = "chart" + B,
              C = a ? "width" : "height",
              I = h["plot" + (a ? "Left" : "Top")],
              z,
              u,
              x = b || 1,
              p = h.inverted,
              H = h.bounds[a ? "h" : "v"],
              k = 1 === g.length,
              E = g[0][d],
              J = m[0][d],
              e = !k && g[1][d],
              l = !k && m[1][d],
              t;
          m = function() {
            !k && 20 < Math.abs(E - e) && (x = b || Math.abs(J - l) / Math.abs(E - e));
            u = (I - J) / x + E;
            z = h["plot" + (a ? "Width" : "Height")] / x;
          };
          m();
          g = u;
          g < H.min ? (g = H.min, t = !0) : g + z > H.max && (g = H.max - z, t = !0);
          t ? (J -= .8 * (J - A[n][0]), k || (l -= .8 * (l - A[n][1])), m()) : A[n] = [J, l];
          p || (c[n] = u - I, c[C] = z);
          c = p ? 1 / x : x;
          f[C] = z;
          f[n] = g;
          r[p ? a ? "scaleY" : "scaleX" : "scale" + B] = x;
          r["translate" + B] = c * I + (J - c * E);
        },
        pinch: function(a) {
          var t = this,
              w = t.chart,
              r = t.pinchDown,
              f = a.touches,
              c = f.length,
              A = t.lastValidTouch,
              b = t.hasZoom,
              h = t.selectionMarker,
              n = {},
              B = 1 === c && (t.inClass(a.target, "highcharts-tracker") && w.runTrackerClick || t.runChartClick),
              d = {};
          1 < c && (t.initiated = !0);
          b && t.initiated && !B && a.preventDefault();
          v(f, function(a) {
            return t.normalize(a);
          });
          "touchstart" === a.type ? (F(f, function(a, b) {
            r[b] = {
              chartX: a.chartX,
              chartY: a.chartY
            };
          }), A.x = [r[0].chartX, r[1] && r[1].chartX], A.y = [r[0].chartY, r[1] && r[1].chartY], F(w.axes, function(a) {
            if (a.zoomEnabled) {
              var b = w.bounds[a.horiz ? "h" : "v"],
                  d = a.minPixelPadding,
                  h = a.toPixels(g(a.options.min, a.dataMin)),
                  c = a.toPixels(g(a.options.max, a.dataMax)),
                  p = Math.max(h, c);
              b.min = Math.min(a.pos, Math.min(h, c) - d);
              b.max = Math.max(a.pos + a.len, p + d);
            }
          }), t.res = !0) : t.followTouchMove && 1 === c ? this.runPointActions(t.normalize(a)) : r.length && (h || (t.selectionMarker = h = G({
            destroy: m,
            touch: !0
          }, w.plotBox)), t.pinchTranslate(r, f, n, h, d, A), t.hasPinched = b, t.scaleGroups(n, d), t.res && (t.res = !1, this.reset(!1, 0)));
        },
        touch: function(m, v) {
          var t = this.chart,
              r,
              f;
          if (t.index !== a.hoverChartIndex)
            this.onContainerMouseLeave({relatedTarget: !0});
          a.hoverChartIndex = t.index;
          1 === m.touches.length ? (m = this.normalize(m), (f = t.isInsidePlot(m.chartX - t.plotLeft, m.chartY - t.plotTop)) && !t.openMenu ? (v && this.runPointActions(m), "touchmove" === m.type && (v = this.pinchDown, r = v[0] ? 4 <= Math.sqrt(Math.pow(v[0].chartX - m.chartX, 2) + Math.pow(v[0].chartY - m.chartY, 2)) : !1), g(r, !0) && this.pinch(m)) : v && this.reset()) : 2 === m.touches.length && this.pinch(m);
        },
        onContainerTouchStart: function(a) {
          this.zoomOption(a);
          this.touch(a, !0);
        },
        onContainerTouchMove: function(a) {
          this.touch(a);
        },
        onDocumentTouchEnd: function(g) {
          D[a.hoverChartIndex] && D[a.hoverChartIndex].pointer.drop(g);
        }
      });
    })(K);
    (function(a) {
      var D = a.addEvent,
          F = a.charts,
          G = a.css,
          v = a.doc,
          m = a.extend,
          g = a.noop,
          t = a.Pointer,
          y = a.removeEvent,
          w = a.win,
          r = a.wrap;
      if (!a.hasTouch && (w.PointerEvent || w.MSPointerEvent)) {
        var f = {},
            c = !!w.PointerEvent,
            A = function() {
              var b = [];
              b.item = function(a) {
                return this[a];
              };
              a.objectEach(f, function(a) {
                b.push({
                  pageX: a.pageX,
                  pageY: a.pageY,
                  target: a.target
                });
              });
              return b;
            },
            b = function(b, c, f, d) {
              "touch" !== b.pointerType && b.pointerType !== b.MSPOINTER_TYPE_TOUCH || !F[a.hoverChartIndex] || (d(b), d = F[a.hoverChartIndex].pointer, d[c]({
                type: f,
                target: b.currentTarget,
                preventDefault: g,
                touches: A()
              }));
            };
        m(t.prototype, {
          onContainerPointerDown: function(a) {
            b(a, "onContainerTouchStart", "touchstart", function(a) {
              f[a.pointerId] = {
                pageX: a.pageX,
                pageY: a.pageY,
                target: a.currentTarget
              };
            });
          },
          onContainerPointerMove: function(a) {
            b(a, "onContainerTouchMove", "touchmove", function(a) {
              f[a.pointerId] = {
                pageX: a.pageX,
                pageY: a.pageY
              };
              f[a.pointerId].target || (f[a.pointerId].target = a.currentTarget);
            });
          },
          onDocumentPointerUp: function(a) {
            b(a, "onDocumentTouchEnd", "touchend", function(a) {
              delete f[a.pointerId];
            });
          },
          batchMSEvents: function(a) {
            a(this.chart.container, c ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown);
            a(this.chart.container, c ? "pointermove" : "MSPointerMove", this.onContainerPointerMove);
            a(v, c ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp);
          }
        });
        r(t.prototype, "init", function(a, b, c) {
          a.call(this, b, c);
          this.hasZoom && G(b.container, {
            "-ms-touch-action": "none",
            "touch-action": "none"
          });
        });
        r(t.prototype, "setDOMEvents", function(a) {
          a.apply(this);
          (this.hasZoom || this.followTouchMove) && this.batchMSEvents(D);
        });
        r(t.prototype, "destroy", function(a) {
          this.batchMSEvents(y);
          a.call(this);
        });
      }
    })(K);
    (function(a) {
      var D = a.addEvent,
          F = a.css,
          G = a.discardElement,
          v = a.defined,
          m = a.each,
          g = a.isFirefox,
          t = a.marginNames,
          y = a.merge,
          w = a.pick,
          r = a.setAnimation,
          f = a.stableSort,
          c = a.win,
          A = a.wrap;
      a.Legend = function(a, h) {
        this.init(a, h);
      };
      a.Legend.prototype = {
        init: function(a, h) {
          this.chart = a;
          this.setOptions(h);
          h.enabled && (this.render(), D(this.chart, "endResize", function() {
            this.legend.positionCheckboxes();
          }));
        },
        setOptions: function(a) {
          var b = w(a.padding, 8);
          this.options = a;
          this.itemMarginTop = a.itemMarginTop || 0;
          this.padding = b;
          this.initialItemY = b - 5;
          this.itemHeight = this.maxItemWidth = 0;
          this.symbolWidth = w(a.symbolWidth, 16);
          this.pages = [];
        },
        update: function(a, h) {
          var b = this.chart;
          this.setOptions(y(!0, this.options, a));
          this.destroy();
          b.isDirtyLegend = b.isDirtyBox = !0;
          w(h, !0) && b.redraw();
        },
        colorizeItem: function(a, h) {
          a.legendGroup[h ? "removeClass" : "addClass"]("highcharts-legend-item-hidden");
        },
        positionItem: function(a) {
          var b = this.options,
              c = b.symbolPadding,
              b = !b.rtl,
              f = a._legendItemPos,
              d = f[0],
              f = f[1],
              g = a.checkbox;
          (a = a.legendGroup) && a.element && a.translate(b ? d : this.legendWidth - d - 2 * c - 4, f);
          g && (g.x = d, g.y = f);
        },
        destroyItem: function(a) {
          var b = a.checkbox;
          m(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function(b) {
            a[b] && (a[b] = a[b].destroy());
          });
          b && G(a.checkbox);
        },
        destroy: function() {
          function a(a) {
            this[a] && (this[a] = this[a].destroy());
          }
          m(this.getAllItems(), function(b) {
            m(["legendItem", "legendGroup"], a, b);
          });
          m("clipRect up down pager nav box title group".split(" "), a, this);
          this.display = null;
        },
        positionCheckboxes: function() {
          var a = this.group && this.group.alignAttr,
              h,
              c = this.clipHeight || this.legendHeight,
              f = this.titleHeight;
          a && (h = a.translateY, m(this.allItems, function(b) {
            var d = b.checkbox,
                n;
            d && (n = h + f + d.y + (this.scrollOffset || 0) + 3, F(d, {
              left: a.translateX + b.checkboxOffset + d.x - 20 + "px",
              top: n + "px",
              display: n > h - 6 && n < h + c - 6 ? "" : "none"
            }));
          }, this));
        },
        renderTitle: function() {
          var a = this.options,
              h = this.padding,
              c = a.title,
              f = 0;
          c.text && (this.title || (this.title = this.chart.renderer.label(c.text, h - 3, h - 4, null, null, null, a.useHTML, null, "legend-title").attr({zIndex: 1}).add(this.group)), a = this.title.getBBox(), f = a.height, this.offsetWidth = a.width, this.contentGroup.attr({translateY: f}));
          this.titleHeight = f;
        },
        setText: function(b) {
          var h = this.options;
          b.legendItem.attr({text: h.labelFormat ? a.format(h.labelFormat, b, this.chart.time) : h.labelFormatter.call(b)});
        },
        renderItem: function(a) {
          var b = this.chart,
              c = b.renderer,
              f = this.options,
              d = "horizontal" === f.layout,
              g = this.symbolWidth,
              r = f.symbolPadding,
              z = this.padding,
              u = d ? w(f.itemDistance, 20) : 0,
              x = !f.rtl,
              p = f.width,
              H = f.itemMarginBottom || 0,
              k = this.itemMarginTop,
              E = a.legendItem,
              J = !a.series,
              e = !J && a.series.drawLegendSymbol ? a.series : a,
              l = e.options,
              m = this.createCheckboxForItem && l && l.showCheckbox,
              l = g + r + u + (m ? 20 : 0),
              q = f.useHTML,
              A = a.options.className;
          E || (a.legendGroup = c.g("legend-item").addClass("highcharts-" + e.type + "-series highcharts-color-" + a.colorIndex + (A ? " " + A : "") + (J ? " highcharts-series-" + a.index : "")).attr({zIndex: 1}).add(this.scrollGroup), a.legendItem = E = c.text("", x ? g + r : -r, this.baseline || 0, q).attr({
            align: x ? "left" : "right",
            zIndex: 2
          }).add(a.legendGroup), this.baseline || (this.fontMetrics = c.fontMetrics(12, E), this.baseline = this.fontMetrics.f + 3 + k, E.attr("y", this.baseline)), this.symbolHeight = f.symbolHeight || this.fontMetrics.f, e.drawLegendSymbol(this, a), this.setItemEvents && this.setItemEvents(a, E, q), m && this.createCheckboxForItem(a));
          this.colorizeItem(a, a.visible);
          E.css({width: (f.itemWidth || f.width || b.spacingBox.width) - l});
          this.setText(a);
          c = E.getBBox();
          g = a.checkboxOffset = f.itemWidth || a.legendItemWidth || c.width + l;
          this.itemHeight = c = Math.round(a.legendItemHeight || c.height || this.symbolHeight);
          d && this.itemX - z + g > (p || b.spacingBox.width - 2 * z - f.x) && (this.itemX = z, this.itemY += k + this.lastLineHeight + H, this.lastLineHeight = 0);
          this.maxItemWidth = Math.max(this.maxItemWidth, g);
          this.lastItemY = k + this.itemY + H;
          this.lastLineHeight = Math.max(c, this.lastLineHeight);
          a._legendItemPos = [this.itemX, this.itemY];
          d ? this.itemX += g : (this.itemY += k + c + H, this.lastLineHeight = c);
          this.offsetWidth = p || Math.max((d ? this.itemX - z - (a.checkbox ? 0 : u) : g) + z, this.offsetWidth);
        },
        getAllItems: function() {
          var a = [];
          m(this.chart.series, function(b) {
            var h = b && b.options;
            b && w(h.showInLegend, v(h.linkedTo) ? !1 : void 0, !0) && (a = a.concat(b.legendItems || ("point" === h.legendType ? b.data : b)));
          });
          return a;
        },
        getAlignment: function() {
          var a = this.options;
          return a.floating ? "" : a.align.charAt(0) + a.verticalAlign.charAt(0) + a.layout.charAt(0);
        },
        adjustMargins: function(a, h) {
          var b = this.chart,
              c = this.options,
              d = this.getAlignment();
          d && m([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function(f, n) {
            f.test(d) && !v(a[n]) && (b[t[n]] = Math.max(b[t[n]], b.legend[(n + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][n] * c[n % 2 ? "x" : "y"] + w(c.margin, 12) + h[n] + (0 === n ? b.titleOffset + b.options.title.margin : 0)));
          });
        },
        render: function() {
          var a = this,
              h = a.chart,
              c = h.renderer,
              g = a.group,
              d,
              r,
              I,
              z,
              u = a.box,
              x = a.options,
              p = a.padding;
          a.itemX = p;
          a.itemY = a.initialItemY;
          a.offsetWidth = 0;
          a.lastItemY = 0;
          g || (a.group = g = c.g("legend").attr({zIndex: 7}).add(), a.contentGroup = c.g().attr({zIndex: 1}).add(g), a.scrollGroup = c.g().add(a.contentGroup));
          a.renderTitle();
          d = a.getAllItems();
          f(d, function(a, b) {
            return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0);
          });
          x.reversed && d.reverse();
          a.allItems = d;
          a.display = r = !!d.length;
          a.lastLineHeight = 0;
          m(d, function(b) {
            a.renderItem(b);
          });
          I = (x.width || a.offsetWidth) + p;
          z = a.lastItemY + a.lastLineHeight + a.titleHeight;
          z = a.handleOverflow(z);
          z += p;
          u || (a.box = u = c.rect().addClass("highcharts-legend-box").attr({r: x.borderRadius}).add(g), u.isNew = !0);
          0 < I && 0 < z && (u[u.isNew ? "attr" : "animate"](u.crisp.call({}, {
            x: 0,
            y: 0,
            width: I,
            height: z
          }, u.strokeWidth())), u.isNew = !1);
          u[r ? "show" : "hide"]();
          "none" === g.getStyle("display") && (I = z = 0);
          a.legendWidth = I;
          a.legendHeight = z;
          m(d, function(b) {
            a.positionItem(b);
          });
          r && (c = h.spacingBox, /(lth|ct|rth)/.test(a.getAlignment()) && (c = y(c, {y: c.y + h.titleOffset + h.options.title.margin})), g.align(y(x, {
            width: I,
            height: z
          }), !0, c));
          h.isResizing || this.positionCheckboxes();
        },
        handleOverflow: function(a) {
          var b = this,
              c = this.chart,
              f = c.renderer,
              d = this.options,
              g = d.y,
              r = this.padding,
              c = c.spacingBox.height + ("top" === d.verticalAlign ? -g : g) - r,
              g = d.maxHeight,
              z,
              u = this.clipRect,
              x = d.navigation,
              p = w(x.animation, !0),
              H = x.arrowSize || 12,
              k = this.nav,
              E = this.pages,
              J,
              e = this.allItems,
              l = function(a) {
                "number" === typeof a ? u.attr({height: a}) : u && (b.clipRect = u.destroy(), b.contentGroup.clip());
                b.contentGroup.div && (b.contentGroup.div.style.clip = a ? "rect(" + r + "px,9999px," + (r + a) + "px,0)" : "auto");
              };
          "horizontal" !== d.layout || "middle" === d.verticalAlign || d.floating || (c /= 2);
          g && (c = Math.min(c, g));
          E.length = 0;
          a > c && !1 !== x.enabled ? (this.clipHeight = z = Math.max(c - 20 - this.titleHeight - r, 0), this.currentPage = w(this.currentPage, 1), this.fullHeight = a, m(e, function(a, b) {
            var k = a._legendItemPos[1],
                d = Math.round(a.legendItem.getBBox().height),
                q = E.length;
            if (!q || k - E[q - 1] > z && (J || k) !== E[q - 1])
              E.push(J || k), q++;
            a.pageIx = q - 1;
            J && (e[b - 1].pageIx = q - 1);
            b === e.length - 1 && k + d - E[q - 1] > z && (E.push(k), a.pageIx = q);
            k !== J && (J = k);
          }), u || (u = b.clipRect = f.clipRect(0, r, 9999, 0), b.contentGroup.clip(u)), l(z), k || (this.nav = k = f.g().attr({zIndex: 1}).add(this.group), this.up = f.symbol("triangle", 0, 0, H, H).on("click", function() {
            b.scroll(-1, p);
          }).add(k), this.pager = f.text("", 15, 10).addClass("highcharts-legend-navigation").add(k), this.down = f.symbol("triangle-down", 0, 0, H, H).on("click", function() {
            b.scroll(1, p);
          }).add(k)), b.scroll(0), a = c) : k && (l(), this.nav = k.destroy(), this.scrollGroup.attr({translateY: 1}), this.clipHeight = 0);
          return a;
        },
        scroll: function(a, c) {
          var b = this.pages,
              h = b.length;
          a = this.currentPage + a;
          var d = this.clipHeight,
              f = this.pager,
              g = this.padding;
          a > h && (a = h);
          0 < a && (void 0 !== c && r(c, this.chart), this.nav.attr({
            translateX: g,
            translateY: d + this.padding + 7 + this.titleHeight,
            visibility: "visible"
          }), this.up.attr({"class": 1 === a ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"}), f.attr({text: a + "/" + h}), this.down.attr({
            x: 18 + this.pager.getBBox().width,
            "class": a === h ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
          }), this.scrollOffset = -b[a - 1] + this.initialItemY, this.scrollGroup.animate({translateY: this.scrollOffset}), this.currentPage = a, this.positionCheckboxes());
        }
      };
      a.LegendSymbolMixin = {
        drawRectangle: function(a, c) {
          var b = a.symbolHeight,
              h = a.options.squareSymbol;
          c.legendSymbol = this.chart.renderer.rect(h ? (a.symbolWidth - b) / 2 : 0, a.baseline - b + 1, h ? b : a.symbolWidth, b, w(a.options.symbolRadius, b / 2)).addClass("highcharts-point").attr({zIndex: 3}).add(c.legendGroup);
        },
        drawLineMarker: function(a) {
          var b = this.options.marker,
              c,
              f = a.symbolWidth,
              d = a.symbolHeight;
          c = d / 2;
          var g = this.chart.renderer,
              r = this.legendGroup;
          a = a.baseline - Math.round(.3 * a.fontMetrics.b);
          this.legendLine = g.path(["M", 0, a, "L", f, a]).addClass("highcharts-graph").attr({}).add(r);
          b && !1 !== b.enabled && (c = Math.min(w(b.radius, c), c), 0 === this.symbol.indexOf("url") && (b = y(b, {
            width: d,
            height: d
          }), c = 0), this.legendSymbol = b = g.symbol(this.symbol, f / 2 - c, a - c, 2 * c, 2 * c, b).addClass("highcharts-point").add(r), b.isMarker = !0);
        }
      };
      (/Trident\/7\.0/.test(c.navigator.userAgent) || g) && A(a.Legend.prototype, "positionItem", function(a, c) {
        var b = this,
            h = function() {
              c._legendItemPos && a.call(b, c);
            };
        h();
        setTimeout(h);
      });
    })(K);
    (function(a) {
      var D = a.addEvent,
          F = a.animObject,
          G = a.attr,
          v = a.doc,
          m = a.Axis,
          g = a.createElement,
          t = a.defaultOptions,
          y = a.discardElement,
          w = a.charts,
          r = a.defined,
          f = a.each,
          c = a.extend,
          A = a.find,
          b = a.fireEvent,
          h = a.grep,
          n = a.isNumber,
          B = a.isObject,
          d = a.isString,
          C = a.Legend,
          I = a.marginNames,
          z = a.merge,
          u = a.objectEach,
          x = a.Pointer,
          p = a.pick,
          H = a.pInt,
          k = a.removeEvent,
          E = a.seriesTypes,
          J = a.splat,
          e = a.syncTimeout,
          l = a.win,
          N = a.Chart = function() {
            this.getArgs.apply(this, arguments);
          };
      a.chart = function(a, b, e) {
        return new N(a, b, e);
      };
      c(N.prototype, {
        callbacks: [],
        getArgs: function() {
          var a = [].slice.call(arguments);
          if (d(a[0]) || a[0].nodeName)
            this.renderTo = a.shift();
          this.init(a[0], a[1]);
        },
        init: function(b, e) {
          var k,
              d,
              q = b.series,
              l = b.plotOptions || {};
          b.series = null;
          k = z(t, b);
          for (d in k.plotOptions)
            k.plotOptions[d].tooltip = l[d] && z(l[d].tooltip) || void 0;
          k.tooltip.userOptions = b.chart && b.chart.forExport && b.tooltip.userOptions || b.tooltip;
          k.series = b.series = q;
          this.userOptions = b;
          d = k.chart;
          q = d.events;
          this.margin = [];
          this.spacing = [];
          this.bounds = {
            h: {},
            v: {}
          };
          this.labelCollectors = [];
          this.callback = e;
          this.isResizing = 0;
          this.options = k;
          this.axes = [];
          this.series = [];
          this.time = b.time && a.keys(b.time).length ? new a.Time(b.time) : a.time;
          this.hasCartesianSeries = d.showAxes;
          var p = this;
          p.index = w.length;
          w.push(p);
          a.chartCount++;
          q && u(q, function(a, b) {
            D(p, b, a);
          });
          p.xAxis = [];
          p.yAxis = [];
          p.pointCount = p.colorCounter = p.symbolCounter = 0;
          p.firstRender();
        },
        initSeries: function(b) {
          var e = this.options.chart;
          (e = E[b.type || e.type || e.defaultSeriesType]) || a.error(17, !0);
          e = new e;
          e.init(this, b);
          return e;
        },
        orderSeries: function(a) {
          var b = this.series;
          for (a = a || 0; a < b.length; a++)
            b[a] && (b[a].index = a, b[a].name = b[a].getName());
        },
        isInsidePlot: function(a, b, e) {
          var k = e ? b : a;
          a = e ? a : b;
          return 0 <= k && k <= this.plotWidth && 0 <= a && a <= this.plotHeight;
        },
        redraw: function(e) {
          var k = this.axes,
              d = this.series,
              l = this.pointer,
              q = this.legend,
              p = this.isDirtyLegend,
              h,
              u,
              n = this.hasCartesianSeries,
              E = this.isDirtyBox,
              g,
              H = this.renderer,
              x = H.isHidden(),
              z = [];
          this.setResponsive && this.setResponsive(!1);
          a.setAnimation(e, this);
          x && this.temporaryDisplay();
          this.layOutTitles();
          for (e = d.length; e--; )
            if (g = d[e], g.options.stacking && (h = !0, g.isDirty)) {
              u = !0;
              break;
            }
          if (u)
            for (e = d.length; e--; )
              g = d[e], g.options.stacking && (g.isDirty = !0);
          f(d, function(a) {
            a.isDirty && "point" === a.options.legendType && (a.updateTotals && a.updateTotals(), p = !0);
            a.isDirtyData && b(a, "updatedData");
          });
          p && q.options.enabled && (q.render(), this.isDirtyLegend = !1);
          h && this.getStacks();
          n && f(k, function(a) {
            a.updateNames();
            a.setScale();
          });
          this.getMargins();
          n && (f(k, function(a) {
            a.isDirty && (E = !0);
          }), f(k, function(a) {
            var e = a.min + "," + a.max;
            a.extKey !== e && (a.extKey = e, z.push(function() {
              b(a, "afterSetExtremes", c(a.eventArgs, a.getExtremes()));
              delete a.eventArgs;
            }));
            (E || h) && a.redraw();
          }));
          E && this.drawChartBox();
          b(this, "predraw");
          f(d, function(a) {
            (E || a.isDirty) && a.visible && a.redraw();
            a.isDirtyData = !1;
          });
          l && l.reset(!0);
          H.draw();
          b(this, "redraw");
          b(this, "render");
          x && this.temporaryDisplay(!0);
          f(z, function(a) {
            a.call();
          });
        },
        get: function(a) {
          function b(b) {
            return b.id === a || b.options && b.options.id === a;
          }
          var e,
              k = this.series,
              d;
          e = A(this.axes, b) || A(this.series, b);
          for (d = 0; !e && d < k.length; d++)
            e = A(k[d].points || [], b);
          return e;
        },
        getAxes: function() {
          var a = this,
              e = this.options,
              k = e.xAxis = J(e.xAxis || {}),
              e = e.yAxis = J(e.yAxis || {});
          b(this, "beforeGetAxes");
          f(k, function(a, b) {
            a.index = b;
            a.isX = !0;
          });
          f(e, function(a, b) {
            a.index = b;
          });
          k = k.concat(e);
          f(k, function(b) {
            new m(a, b);
          });
        },
        getSelectedPoints: function() {
          var a = [];
          f(this.series, function(b) {
            a = a.concat(h(b.data || [], function(a) {
              return a.selected;
            }));
          });
          return a;
        },
        getSelectedSeries: function() {
          return h(this.series, function(a) {
            return a.selected;
          });
        },
        setTitle: function(a, b, e) {
          var k = this,
              d = k.options,
              l;
          l = d.title = z(d.title, a);
          d = d.subtitle = z(d.subtitle, b);
          f([["title", a, l], ["subtitle", b, d]], function(a, b) {
            var e = a[0],
                d = k[e],
                l = a[1];
            a = a[2];
            d && l && (k[e] = d = d.destroy());
            a && !d && (k[e] = k.renderer.text(a.text, 0, 0, a.useHTML).attr({
              align: a.align,
              "class": "highcharts-" + e,
              zIndex: a.zIndex || 4
            }).add(), k[e].update = function(a) {
              k.setTitle(!b && a, b && a);
            });
          });
          k.layOutTitles(e);
        },
        layOutTitles: function(a) {
          var b = 0,
              e,
              k = this.renderer,
              d = this.spacingBox;
          f(["title", "subtitle"], function(a) {
            var e = this[a],
                l = this.options[a];
            a = "title" === a ? -3 : l.verticalAlign ? 0 : b + 2;
            var q;
            e && (q = k.fontMetrics(q, e).b, e.css({width: (l.width || d.width + l.widthAdjust) + "px"}).align(c({y: a + q}, l), !1, "spacingBox"), l.floating || l.verticalAlign || (b = Math.ceil(b + e.getBBox(l.useHTML).height)));
          }, this);
          e = this.titleOffset !== b;
          this.titleOffset = b;
          !this.isDirtyBox && e && (this.isDirtyBox = e, this.hasRendered && p(a, !0) && this.isDirtyBox && this.redraw());
        },
        getChartSize: function() {
          var b = this.options.chart,
              e = b.width,
              b = b.height,
              k = this.renderTo;
          r(e) || (this.containerWidth = a.getStyle(k, "width"));
          r(b) || (this.containerHeight = a.getStyle(k, "height"));
          this.chartWidth = Math.max(0, e || this.containerWidth || 600);
          this.chartHeight = Math.max(0, a.relativeLength(b, this.chartWidth) || (1 < this.containerHeight ? this.containerHeight : 400));
        },
        temporaryDisplay: function(b) {
          var e = this.renderTo;
          if (b)
            for (; e && e.style; )
              e.hcOrigStyle && (a.css(e, e.hcOrigStyle), delete e.hcOrigStyle), e.hcOrigDetached && (v.body.removeChild(e), e.hcOrigDetached = !1), e = e.parentNode;
          else
            for (; e && e.style; ) {
              v.body.contains(e) || e.parentNode || (e.hcOrigDetached = !0, v.body.appendChild(e));
              if ("none" === a.getStyle(e, "display", !1) || e.hcOricDetached)
                e.hcOrigStyle = {
                  display: e.style.display,
                  height: e.style.height,
                  overflow: e.style.overflow
                }, b = {
                  display: "block",
                  overflow: "hidden"
                }, e !== this.renderTo && (b.height = 0), a.css(e, b), e.offsetWidth || e.style.setProperty("display", "block", "important");
              e = e.parentNode;
              if (e === v.body)
                break;
            }
        },
        setClassName: function(a) {
          this.container.className = "highcharts-container " + (a || "");
        },
        getContainer: function() {
          var e,
              b = this.options,
              k = b.chart,
              l,
              p;
          e = this.renderTo;
          var c = a.uniqueKey(),
              h;
          e || (this.renderTo = e = k.renderTo);
          d(e) && (this.renderTo = e = v.getElementById(e));
          e || a.error(13, !0);
          l = H(G(e, "data-highcharts-chart"));
          n(l) && w[l] && w[l].hasRendered && w[l].destroy();
          G(e, "data-highcharts-chart", this.index);
          e.innerHTML = "";
          k.skipClone || e.offsetWidth || this.temporaryDisplay();
          this.getChartSize();
          l = this.chartWidth;
          p = this.chartHeight;
          this.container = e = g("div", {id: c}, void 0, e);
          this._cursor = e.style.cursor;
          this.renderer = new (a[k.renderer] || a.Renderer)(e, l, p, null, k.forExport, b.exporting && b.exporting.allowHTML);
          this.setClassName(k.className);
          for (h in b.defs)
            this.renderer.definition(b.defs[h]);
          this.renderer.chartIndex = this.index;
        },
        getMargins: function(a) {
          var e = this.spacing,
              b = this.margin,
              k = this.titleOffset;
          this.resetMargins();
          k && !r(b[0]) && (this.plotTop = Math.max(this.plotTop, k + this.options.title.margin + e[0]));
          this.legend && this.legend.display && this.legend.adjustMargins(b, e);
          this.extraMargin && (this[this.extraMargin.type] = (this[this.extraMargin.type] || 0) + this.extraMargin.value);
          this.adjustPlotArea && this.adjustPlotArea();
          a || this.getAxisMargins();
        },
        getAxisMargins: function() {
          var a = this,
              e = a.axisOffset = [0, 0, 0, 0],
              b = a.margin;
          a.hasCartesianSeries && f(a.axes, function(a) {
            a.visible && a.getOffset();
          });
          f(I, function(k, d) {
            r(b[d]) || (a[k] += e[d]);
          });
          a.setChartSize();
        },
        reflow: function(b) {
          var k = this,
              d = k.options.chart,
              p = k.renderTo,
              q = r(d.width) && r(d.height),
              c = d.width || a.getStyle(p, "width"),
              d = d.height || a.getStyle(p, "height"),
              p = b ? b.target : l;
          if (!q && !k.isPrinting && c && d && (p === l || p === v)) {
            if (c !== k.containerWidth || d !== k.containerHeight)
              clearTimeout(k.reflowTimeout), k.reflowTimeout = e(function() {
                k.container && k.setSize(void 0, void 0, !1);
              }, b ? 100 : 0);
            k.containerWidth = c;
            k.containerHeight = d;
          }
        },
        initReflow: function() {
          var a = this,
              e;
          e = D(l, "resize", function(e) {
            a.reflow(e);
          });
          D(a, "destroy", e);
        },
        setSize: function(k, d, l) {
          var p = this,
              c = p.renderer;
          p.isResizing += 1;
          a.setAnimation(l, p);
          p.oldChartHeight = p.chartHeight;
          p.oldChartWidth = p.chartWidth;
          void 0 !== k && (p.options.chart.width = k);
          void 0 !== d && (p.options.chart.height = d);
          p.getChartSize();
          p.setChartSize(!0);
          c.setSize(p.chartWidth, p.chartHeight, l);
          f(p.axes, function(a) {
            a.isDirty = !0;
            a.setScale();
          });
          p.isDirtyLegend = !0;
          p.isDirtyBox = !0;
          p.layOutTitles();
          p.getMargins();
          p.redraw(l);
          p.oldChartHeight = null;
          b(p, "resize");
          e(function() {
            p && b(p, "endResize", null, function() {
              --p.isResizing;
            });
          }, F(void 0).duration);
        },
        setChartSize: function(a) {
          var e = this.inverted,
              b = this.renderer,
              k = this.chartWidth,
              d = this.chartHeight,
              l = this.options.chart,
              p = this.spacing,
              c = this.clipOffset,
              q,
              h,
              u,
              n;
          this.plotLeft = q = Math.round(this.plotLeft);
          this.plotTop = h = Math.round(this.plotTop);
          this.plotWidth = u = Math.max(0, Math.round(k - q - this.marginRight));
          this.plotHeight = n = Math.max(0, Math.round(d - h - this.marginBottom));
          this.plotSizeX = e ? n : u;
          this.plotSizeY = e ? u : n;
          this.plotBorderWidth = l.plotBorderWidth || 0;
          this.spacingBox = b.spacingBox = {
            x: p[3],
            y: p[0],
            width: k - p[3] - p[1],
            height: d - p[0] - p[2]
          };
          this.plotBox = b.plotBox = {
            x: q,
            y: h,
            width: u,
            height: n
          };
          k = 2 * Math.floor(this.plotBorderWidth / 2);
          e = Math.ceil(Math.max(k, c[3]) / 2);
          b = Math.ceil(Math.max(k, c[0]) / 2);
          this.clipBox = {
            x: e,
            y: b,
            width: Math.floor(this.plotSizeX - Math.max(k, c[1]) / 2 - e),
            height: Math.max(0, Math.floor(this.plotSizeY - Math.max(k, c[2]) / 2 - b))
          };
          a || f(this.axes, function(a) {
            a.setAxisSize();
            a.setAxisTranslation();
          });
        },
        resetMargins: function() {
          var a = this,
              e = a.options.chart;
          f(["margin", "spacing"], function(b) {
            var k = e[b],
                d = B(k) ? k : [k, k, k, k];
            f(["Top", "Right", "Bottom", "Left"], function(k, l) {
              a[b][l] = p(e[b + k], d[l]);
            });
          });
          f(I, function(e, b) {
            a[e] = p(a.margin[b], a.spacing[b]);
          });
          a.axisOffset = [0, 0, 0, 0];
          a.clipOffset = [0, 0, 0, 0];
        },
        drawChartBox: function() {
          var a = this.options.chart,
              e = this.renderer,
              k = this.chartWidth,
              d = this.chartHeight,
              l = this.chartBackground,
              p = this.plotBackground,
              c = this.plotBorder,
              h,
              f,
              u = this.plotLeft,
              n = this.plotTop,
              E = this.plotWidth,
              g = this.plotHeight,
              H = this.plotBox,
              x = this.clipRect,
              z = this.clipBox,
              J = "animate";
          l || (this.chartBackground = l = e.rect().addClass("highcharts-background").add(), J = "attr");
          h = f = l.strokeWidth();
          l[J]({
            x: f / 2,
            y: f / 2,
            width: k - f - h % 2,
            height: d - f - h % 2,
            r: a.borderRadius
          });
          J = "animate";
          p || (J = "attr", this.plotBackground = p = e.rect().addClass("highcharts-plot-background").add());
          p[J](H);
          x ? x.animate({
            width: z.width,
            height: z.height
          }) : this.clipRect = e.clipRect(z);
          J = "animate";
          c || (J = "attr", this.plotBorder = c = e.rect().addClass("highcharts-plot-border").attr({zIndex: 1}).add());
          c[J](c.crisp({
            x: u,
            y: n,
            width: E,
            height: g
          }, -c.strokeWidth()));
          this.isDirtyBox = !1;
          b(this, "afterDrawChartBox");
        },
        propFromSeries: function() {
          var a = this,
              e = a.options.chart,
              b,
              k = a.options.series,
              d,
              l;
          f(["inverted", "angular", "polar"], function(p) {
            b = E[e.type || e.defaultSeriesType];
            l = e[p] || b && b.prototype[p];
            for (d = k && k.length; !l && d--; )
              (b = E[k[d].type]) && b.prototype[p] && (l = !0);
            a[p] = l;
          });
        },
        linkSeries: function() {
          var a = this,
              e = a.series;
          f(e, function(a) {
            a.linkedSeries.length = 0;
          });
          f(e, function(e) {
            var b = e.options.linkedTo;
            d(b) && (b = ":previous" === b ? a.series[e.index - 1] : a.get(b)) && b.linkedParent !== e && (b.linkedSeries.push(e), e.linkedParent = b, e.visible = p(e.options.visible, b.options.visible, e.visible));
          });
        },
        renderSeries: function() {
          f(this.series, function(a) {
            a.translate();
            a.render();
          });
        },
        renderLabels: function() {
          var a = this,
              e = a.options.labels;
          e.items && f(e.items, function(b) {
            var k = c(e.style, b.style),
                d = H(k.left) + a.plotLeft,
                l = H(k.top) + a.plotTop + 12;
            delete k.left;
            delete k.top;
            a.renderer.text(b.html, d, l).attr({zIndex: 2}).css(k).add();
          });
        },
        render: function() {
          var a = this.axes,
              e = this.renderer,
              b = this.options,
              k,
              d,
              l;
          this.setTitle();
          this.legend = new C(this, b.legend);
          this.getStacks && this.getStacks();
          this.getMargins(!0);
          this.setChartSize();
          b = this.plotWidth;
          k = this.plotHeight = Math.max(this.plotHeight - 21, 0);
          f(a, function(a) {
            a.setScale();
          });
          this.getAxisMargins();
          d = 1.1 < b / this.plotWidth;
          l = 1.05 < k / this.plotHeight;
          if (d || l)
            f(a, function(a) {
              (a.horiz && d || !a.horiz && l) && a.setTickInterval(!0);
            }), this.getMargins();
          this.drawChartBox();
          this.hasCartesianSeries && f(a, function(a) {
            a.visible && a.render();
          });
          this.seriesGroup || (this.seriesGroup = e.g("series-group").attr({zIndex: 3}).add());
          this.renderSeries();
          this.renderLabels();
          this.addCredits();
          this.setResponsive && this.setResponsive();
          this.hasRendered = !0;
        },
        addCredits: function(a) {
          var e = this;
          a = z(!0, this.options.credits, a);
          a.enabled && !this.credits && (this.credits = this.renderer.text(a.text + (this.mapCredits || ""), 0, 0).addClass("highcharts-credits").on("click", function() {
            a.href && (l.location.href = a.href);
          }).attr({
            align: a.position.align,
            zIndex: 8
          }).add().align(a.position), this.credits.update = function(a) {
            e.credits = e.credits.destroy();
            e.addCredits(a);
          });
        },
        destroy: function() {
          var e = this,
              d = e.axes,
              l = e.series,
              p = e.container,
              c,
              h = p && p.parentNode;
          b(e, "destroy");
          e.renderer.forExport ? a.erase(w, e) : w[e.index] = void 0;
          a.chartCount--;
          e.renderTo.removeAttribute("data-highcharts-chart");
          k(e);
          for (c = d.length; c--; )
            d[c] = d[c].destroy();
          this.scroller && this.scroller.destroy && this.scroller.destroy();
          for (c = l.length; c--; )
            l[c] = l[c].destroy();
          f("title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" "), function(a) {
            var b = e[a];
            b && b.destroy && (e[a] = b.destroy());
          });
          p && (p.innerHTML = "", k(p), h && y(p));
          u(e, function(a, b) {
            delete e[b];
          });
        },
        firstRender: function() {
          var a = this,
              e = a.options;
          if (!a.isReadyToRender || a.isReadyToRender()) {
            a.getContainer();
            b(a, "init");
            a.resetMargins();
            a.setChartSize();
            a.propFromSeries();
            a.getAxes();
            f(e.series || [], function(e) {
              a.initSeries(e);
            });
            a.linkSeries();
            b(a, "beforeRender");
            x && (a.pointer = new x(a, e));
            a.render();
            if (!a.renderer.imgCount && a.onload)
              a.onload();
            a.temporaryDisplay(!0);
          }
        },
        onload: function() {
          f([this.callback].concat(this.callbacks), function(a) {
            a && void 0 !== this.index && a.apply(this, [this]);
          }, this);
          b(this, "load");
          b(this, "render");
          r(this.index) && !1 !== this.options.chart.reflow && this.initReflow();
          this.onload = null;
        }
      });
    })(K);
    (function(a) {
      var D,
          F = a.each,
          G = a.extend,
          v = a.erase,
          m = a.fireEvent,
          g = a.format,
          t = a.isArray,
          y = a.isNumber,
          w = a.pick,
          r = a.removeEvent;
      a.Point = D = function() {};
      a.Point.prototype = {
        init: function(a, c, g) {
          var b = a.chart.options.chart.colorCount;
          this.series = a;
          this.applyOptions(c, g);
          a.options.colorByPoint ? (c = a.colorCounter, a.colorCounter++, a.colorCounter === b && (a.colorCounter = 0)) : c = a.colorIndex;
          this.colorIndex = w(this.colorIndex, c);
          a.chart.pointCount++;
          m(this, "afterInit");
          return this;
        },
        applyOptions: function(a, c) {
          var f = this.series,
              b = f.options.pointValKey || f.pointValKey;
          a = D.prototype.optionsToObject.call(this, a);
          G(this, a);
          this.options = this.options ? G(this.options, a) : a;
          a.group && delete this.group;
          b && (this.y = this[b]);
          this.isNull = w(this.isValid && !this.isValid(), null === this.x || !y(this.y, !0));
          this.selected && (this.state = "select");
          "name" in this && void 0 === c && f.xAxis && f.xAxis.hasNames && (this.x = f.xAxis.nameToX(this));
          void 0 === this.x && f && (this.x = void 0 === c ? f.autoIncrement(this) : c);
          return this;
        },
        optionsToObject: function(a) {
          var c = {},
              f = this.series,
              b = f.options.keys,
              h = b || f.pointArrayMap || ["y"],
              n = h.length,
              g = 0,
              d = 0;
          if (y(a) || null === a)
            c[h[0]] = a;
          else if (t(a))
            for (!b && a.length > n && (f = typeof a[0], "string" === f ? c.name = a[0] : "number" === f && (c.x = a[0]), g++); d < n; )
              b && void 0 === a[g] || (c[h[d]] = a[g]), g++, d++;
          else
            "object" === typeof a && (c = a, a.dataLabels && (f._hasPointLabels = !0), a.marker && (f._hasPointMarkers = !0));
          return c;
        },
        getClassName: function() {
          return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" : "") + (this.isNull ? " highcharts-null-point" : "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "") + (this.zone && this.zone.className ? " " + this.zone.className.replace("highcharts-negative", "") : "");
        },
        getZone: function() {
          var a = this.series,
              c = a.zones,
              a = a.zoneAxis || "y",
              g = 0,
              b;
          for (b = c[g]; this[a] >= b.value; )
            b = c[++g];
          b && b.color && !this.options.color && (this.color = b.color);
          return b;
        },
        destroy: function() {
          var a = this.series.chart,
              c = a.hoverPoints,
              g;
          a.pointCount--;
          c && (this.setState(), v(c, this), c.length || (a.hoverPoints = null));
          if (this === a.hoverPoint)
            this.onMouseOut();
          if (this.graphic || this.dataLabel)
            r(this), this.destroyElements();
          this.legendItem && a.legend.destroyItem(this);
          for (g in this)
            this[g] = null;
        },
        destroyElements: function() {
          for (var a = ["graphic", "dataLabel", "dataLabelUpper", "connector", "shadowGroup"],
              c,
              g = 6; g--; )
            c = a[g], this[c] && (this[c] = this[c].destroy());
        },
        getLabelConfig: function() {
          return {
            x: this.category,
            y: this.y,
            color: this.color,
            colorIndex: this.colorIndex,
            key: this.name || this.category,
            series: this.series,
            point: this,
            percentage: this.percentage,
            total: this.total || this.stackTotal
          };
        },
        tooltipFormatter: function(a) {
          var c = this.series,
              f = c.tooltipOptions,
              b = w(f.valueDecimals, ""),
              h = f.valuePrefix || "",
              n = f.valueSuffix || "";
          F(c.pointArrayMap || ["y"], function(c) {
            c = "{point." + c;
            if (h || n)
              a = a.replace(c + "}", h + c + "}" + n);
            a = a.replace(c + "}", c + ":,." + b + "f}");
          });
          return g(a, {
            point: this,
            series: this.series
          }, c.chart.time);
        },
        firePointEvent: function(a, c, g) {
          var b = this,
              h = this.series.options;
          (h.point.events[a] || b.options && b.options.events && b.options.events[a]) && this.importEvents();
          "click" === a && h.allowPointSelect && (g = function(a) {
            b.select && b.select(null, a.ctrlKey || a.metaKey || a.shiftKey);
          });
          m(this, a, c, g);
        },
        visible: !0
      };
    })(K);
    (function(a) {
      var D = a.addEvent,
          F = a.animObject,
          G = a.arrayMax,
          v = a.arrayMin,
          m = a.correctFloat,
          g = a.defaultOptions,
          t = a.defined,
          y = a.each,
          w = a.erase,
          r = a.extend,
          f = a.fireEvent,
          c = a.grep,
          A = a.isArray,
          b = a.isNumber,
          h = a.isString,
          n = a.merge,
          B = a.objectEach,
          d = a.pick,
          C = a.removeEvent,
          I = a.splat,
          z = a.SVGElement,
          u = a.syncTimeout,
          x = a.win;
      a.Series = a.seriesType("line", null, {
        allowPointSelect: !1,
        showCheckbox: !1,
        animation: {duration: 1E3},
        events: {},
        marker: {
          enabledThreshold: 2,
          radius: 4,
          states: {
            normal: {animation: !0},
            hover: {
              animation: {duration: 50},
              enabled: !0,
              radiusPlus: 2
            }
          }
        },
        point: {events: {}},
        dataLabels: {
          align: "center",
          formatter: function() {
            return null === this.y ? "" : a.numberFormat(this.y, -1);
          },
          verticalAlign: "bottom",
          x: 0,
          y: 0,
          padding: 5
        },
        cropThreshold: 300,
        pointRange: 0,
        softThreshold: !0,
        states: {
          normal: {animation: !0},
          hover: {
            animation: {duration: 50},
            lineWidthPlus: 1,
            marker: {},
            halo: {size: 10}
          },
          select: {marker: {}}
        },
        stickyTracking: !0,
        turboThreshold: 1E3,
        findNearestPointBy: "x"
      }, {
        isCartesian: !0,
        pointClass: a.Point,
        sorted: !0,
        requireSorting: !0,
        directTouch: !1,
        axisTypes: ["xAxis", "yAxis"],
        colorCounter: 0,
        parallelArrays: ["x", "y"],
        coll: "series",
        init: function(a, b) {
          var k = this,
              p,
              c = a.series,
              e;
          k.chart = a;
          k.options = b = k.setOptions(b);
          k.linkedSeries = [];
          k.bindAxes();
          r(k, {
            name: b.name,
            state: "",
            visible: !1 !== b.visible,
            selected: !0 === b.selected
          });
          p = b.events;
          B(p, function(a, e) {
            D(k, e, a);
          });
          if (p && p.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect)
            a.runTrackerClick = !0;
          k.getColor();
          k.getSymbol();
          y(k.parallelArrays, function(a) {
            k[a + "Data"] = [];
          });
          k.setData(b.data, !1);
          k.isCartesian && (a.hasCartesianSeries = !0);
          c.length && (e = c[c.length - 1]);
          k._i = d(e && e._i, -1) + 1;
          a.orderSeries(this.insert(c));
        },
        insert: function(a) {
          var p = this.options.index,
              k;
          if (b(p)) {
            for (k = a.length; k--; )
              if (p >= d(a[k].options.index, a[k]._i)) {
                a.splice(k + 1, 0, this);
                break;
              }
            -1 === k && a.unshift(this);
            k += 1;
          } else
            a.push(this);
          return d(k, a.length - 1);
        },
        bindAxes: function() {
          var b = this,
              d = b.options,
              k = b.chart,
              c;
          y(b.axisTypes || [], function(p) {
            y(k[p], function(a) {
              c = a.options;
              if (d[p] === c.index || void 0 !== d[p] && d[p] === c.id || void 0 === d[p] && 0 === c.index)
                b.insert(a.series), b[p] = a, a.isDirty = !0;
            });
            b[p] || b.optionalAxis === p || a.error(18, !0);
          });
        },
        updateParallelArrays: function(a, d) {
          var k = a.series,
              p = arguments,
              c = b(d) ? function(e) {
                var b = "y" === e && k.toYData ? k.toYData(a) : a[e];
                k[e + "Data"][d] = b;
              } : function(a) {
                Array.prototype[d].apply(k[a + "Data"], Array.prototype.slice.call(p, 2));
              };
          y(k.parallelArrays, c);
        },
        autoIncrement: function() {
          var a = this.options,
              b = this.xIncrement,
              k,
              c = a.pointIntervalUnit,
              h = this.chart.time,
              b = d(b, a.pointStart, 0);
          this.pointInterval = k = d(this.pointInterval, a.pointInterval, 1);
          c && (a = new h.Date(b), "day" === c ? h.set("Date", a, h.get("Date", a) + k) : "month" === c ? h.set("Month", a, h.get("Month", a) + k) : "year" === c && h.set("FullYear", a, h.get("FullYear", a) + k), k = a.getTime() - b);
          this.xIncrement = b + k;
          return b;
        },
        setOptions: function(a) {
          var b = this.chart,
              k = b.options,
              p = k.plotOptions,
              c = (b.userOptions || {}).plotOptions || {},
              e = p[this.type];
          this.userOptions = a;
          b = n(e, p.series, a);
          this.tooltipOptions = n(g.tooltip, g.plotOptions.series && g.plotOptions.series.tooltip, g.plotOptions[this.type].tooltip, k.tooltip.userOptions, p.series && p.series.tooltip, p[this.type].tooltip, a.tooltip);
          this.stickyTracking = d(a.stickyTracking, c[this.type] && c[this.type].stickyTracking, c.series && c.series.stickyTracking, this.tooltipOptions.shared && !this.noSharedTooltip ? !0 : b.stickyTracking);
          null === e.marker && delete b.marker;
          this.zoneAxis = b.zoneAxis;
          a = this.zones = (b.zones || []).slice();
          !b.negativeColor && !b.negativeFillColor || b.zones || a.push({
            value: b[this.zoneAxis + "Threshold"] || b.threshold || 0,
            className: "highcharts-negative"
          });
          a.length && t(a[a.length - 1].value) && a.push({});
          return b;
        },
        getName: function() {
          return this.name || "Series " + (this.index + 1);
        },
        getCyclic: function(a, b, k) {
          var p,
              c = this.chart,
              e = this.userOptions,
              l = a + "Index",
              h = a + "Counter",
              q = k ? k.length : d(c.options.chart[a + "Count"], c[a + "Count"]);
          b || (p = d(e[l], e["_" + l]), t(p) || (c.series.length || (c[h] = 0), e["_" + l] = p = c[h] % q, c[h] += 1), k && (b = k[p]));
          void 0 !== p && (this[l] = p);
          this[a] = b;
        },
        getColor: function() {
          this.getCyclic("color");
        },
        getSymbol: function() {
          this.getCyclic("symbol", this.options.marker.symbol, this.chart.options.symbols);
        },
        drawLegendSymbol: a.LegendSymbolMixin.drawLineMarker,
        setData: function(c, f, k, u) {
          var p = this,
              e = p.points,
              l = e && e.length || 0,
              n,
              q = p.options,
              g = p.chart,
              x = null,
              E = p.xAxis,
              z = q.turboThreshold,
              H = this.xData,
              r = this.yData,
              m = (n = p.pointArrayMap) && n.length;
          c = c || [];
          n = c.length;
          f = d(f, !0);
          if (!1 !== u && n && l === n && !p.cropped && !p.hasGroupedData && p.visible)
            y(c, function(a, b) {
              e[b].update && a !== q.data[b] && e[b].update(a, !1, null, !1);
            });
          else {
            p.xIncrement = null;
            p.colorCounter = 0;
            y(this.parallelArrays, function(a) {
              p[a + "Data"].length = 0;
            });
            if (z && n > z) {
              for (k = 0; null === x && k < n; )
                x = c[k], k++;
              if (b(x))
                for (k = 0; k < n; k++)
                  H[k] = this.autoIncrement(), r[k] = c[k];
              else if (A(x))
                if (m)
                  for (k = 0; k < n; k++)
                    x = c[k], H[k] = x[0], r[k] = x.slice(1, m + 1);
                else
                  for (k = 0; k < n; k++)
                    x = c[k], H[k] = x[0], r[k] = x[1];
              else
                a.error(12);
            } else
              for (k = 0; k < n; k++)
                void 0 !== c[k] && (x = {series: p}, p.pointClass.prototype.applyOptions.apply(x, [c[k]]), p.updateParallelArrays(x, k));
            r && h(r[0]) && a.error(14, !0);
            p.data = [];
            p.options.data = p.userOptions.data = c;
            for (k = l; k--; )
              e[k] && e[k].destroy && e[k].destroy();
            E && (E.minRange = E.userMinRange);
            p.isDirty = g.isDirtyBox = !0;
            p.isDirtyData = !!e;
            k = !1;
          }
          "point" === q.legendType && (this.processData(), this.generatePoints());
          f && g.redraw(k);
        },
        processData: function(b) {
          var d = this.xData,
              k = this.yData,
              c = d.length,
              p;
          p = 0;
          var e,
              l,
              h = this.xAxis,
              q,
              f = this.options;
          q = f.cropThreshold;
          var u = this.getExtremesFromAll || f.getExtremesFromAll,
              n = this.isCartesian,
              f = h && h.val2lin,
              g = h && h.isLog,
              x = this.requireSorting,
              z,
              r;
          if (n && !this.isDirty && !h.isDirty && !this.yAxis.isDirty && !b)
            return !1;
          h && (b = h.getExtremes(), z = b.min, r = b.max);
          if (n && this.sorted && !u && (!q || c > q || this.forceCrop))
            if (d[c - 1] < z || d[0] > r)
              d = [], k = [];
            else if (d[0] < z || d[c - 1] > r)
              p = this.cropData(this.xData, this.yData, z, r), d = p.xData, k = p.yData, p = p.start, e = !0;
          for (q = d.length || 1; --q; )
            c = g ? f(d[q]) - f(d[q - 1]) : d[q] - d[q - 1], 0 < c && (void 0 === l || c < l) ? l = c : 0 > c && x && (a.error(15), x = !1);
          this.cropped = e;
          this.cropStart = p;
          this.processedXData = d;
          this.processedYData = k;
          this.closestPointRange = l;
        },
        cropData: function(a, b, k, c) {
          var p = a.length,
              e = 0,
              l = p,
              h = d(this.cropShoulder, 1),
              q;
          for (q = 0; q < p; q++)
            if (a[q] >= k) {
              e = Math.max(0, q - h);
              break;
            }
          for (k = q; k < p; k++)
            if (a[k] > c) {
              l = k + h;
              break;
            }
          return {
            xData: a.slice(e, l),
            yData: b.slice(e, l),
            start: e,
            end: l
          };
        },
        generatePoints: function() {
          var a = this.options,
              b = a.data,
              k = this.data,
              d,
              c = this.processedXData,
              e = this.processedYData,
              l = this.pointClass,
              h = c.length,
              q = this.cropStart || 0,
              f,
              u = this.hasGroupedData,
              a = a.keys,
              n,
              g = [],
              x;
          k || u || (k = [], k.length = b.length, k = this.data = k);
          a && u && (this.options.keys = !1);
          for (x = 0; x < h; x++)
            f = q + x, u ? (n = (new l).init(this, [c[x]].concat(I(e[x]))), n.dataGroup = this.groupMap[x]) : (n = k[f]) || void 0 === b[f] || (k[f] = n = (new l).init(this, b[f], c[x])), n && (n.index = f, g[x] = n);
          this.options.keys = a;
          if (k && (h !== (d = k.length) || u))
            for (x = 0; x < d; x++)
              x !== q || u || (x += h), k[x] && (k[x].destroyElements(), k[x].plotX = void 0);
          this.data = k;
          this.points = g;
        },
        getExtremes: function(a) {
          var d = this.yAxis,
              k = this.processedXData,
              c,
              p = [],
              e = 0;
          c = this.xAxis.getExtremes();
          var l = c.min,
              h = c.max,
              q,
              f,
              u,
              n;
          a = a || this.stackedYData || this.processedYData || [];
          c = a.length;
          for (n = 0; n < c; n++)
            if (f = k[n], u = a[n], q = (b(u, !0) || A(u)) && (!d.positiveValuesOnly || u.length || 0 < u), f = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || (k[n + 1] || f) >= l && (k[n - 1] || f) <= h, q && f)
              if (q = u.length)
                for (; q--; )
                  "number" === typeof u[q] && (p[e++] = u[q]);
              else
                p[e++] = u;
          this.dataMin = v(p);
          this.dataMax = G(p);
        },
        translate: function() {
          this.processedXData || this.processData();
          this.generatePoints();
          var a = this.options,
              c = a.stacking,
              k = this.xAxis,
              h = k.categories,
              u = this.yAxis,
              e = this.points,
              l = e.length,
              n = !!this.modifyValue,
              q = a.pointPlacement,
              g = "between" === q || b(q),
              x = a.threshold,
              z = a.startFromThreshold ? x : 0,
              r,
              C,
              I,
              B,
              w = Number.MAX_VALUE;
          "between" === q && (q = .5);
          b(q) && (q *= d(a.pointRange || k.pointRange));
          for (a = 0; a < l; a++) {
            var A = e[a],
                v = A.x,
                y = A.y;
            C = A.low;
            var D = c && u.stacks[(this.negStacks && y < (z ? 0 : x) ? "-" : "") + this.stackKey],
                F;
            u.positiveValuesOnly && null !== y && 0 >= y && (A.isNull = !0);
            A.plotX = r = m(Math.min(Math.max(-1E5, k.translate(v, 0, 0, 0, 1, q, "flags" === this.type)), 1E5));
            c && this.visible && !A.isNull && D && D[v] && (B = this.getStackIndicator(B, v, this.index), F = D[v], y = F.points[B.key], C = y[0], y = y[1], C === z && B.key === D[v].base && (C = d(x, u.min)), u.positiveValuesOnly && 0 >= C && (C = null), A.total = A.stackTotal = F.total, A.percentage = F.total && A.y / F.total * 100, A.stackY = y, F.setOffset(this.pointXOffset || 0, this.barW || 0));
            A.yBottom = t(C) ? Math.min(Math.max(-1E5, u.translate(C, 0, 1, 0, 1)), 1E5) : null;
            n && (y = this.modifyValue(y, A));
            A.plotY = C = "number" === typeof y && Infinity !== y ? Math.min(Math.max(-1E5, u.translate(y, 0, 1, 0, 1)), 1E5) : void 0;
            A.isInside = void 0 !== C && 0 <= C && C <= u.len && 0 <= r && r <= k.len;
            A.clientX = g ? m(k.translate(v, 0, 0, 0, 1, q)) : r;
            A.negative = A.y < (x || 0);
            A.category = h && void 0 !== h[A.x] ? h[A.x] : A.x;
            A.isNull || (void 0 !== I && (w = Math.min(w, Math.abs(r - I))), I = r);
            A.zone = this.zones.length && A.getZone();
          }
          this.closestPointRangePx = w;
          f(this, "afterTranslate");
        },
        getValidPoints: function(a, b) {
          var k = this.chart;
          return c(a || this.points || [], function(a) {
            return b && !k.isInsidePlot(a.plotX, a.plotY, k.inverted) ? !1 : !a.isNull;
          });
        },
        setClip: function(a) {
          var b = this.chart,
              k = this.options,
              d = b.renderer,
              c = b.inverted,
              e = this.clipBox,
              l = e || b.clipBox,
              p = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, l.height, k.xAxis, k.yAxis].join(),
              h = b[p],
              f = b[p + "m"];
          h || (a && (l.width = 0, c && (l.x = b.plotSizeX), b[p + "m"] = f = d.clipRect(c ? b.plotSizeX + 99 : -99, c ? -b.plotLeft : -b.plotTop, 99, c ? b.chartWidth : b.chartHeight)), b[p] = h = d.clipRect(l), h.count = {length: 0});
          a && !h.count[this.index] && (h.count[this.index] = !0, h.count.length += 1);
          !1 !== k.clip && (this.group.clip(a || e ? h : b.clipRect), this.markerGroup.clip(f), this.sharedClipKey = p);
          a || (h.count[this.index] && (delete h.count[this.index], --h.count.length), 0 === h.count.length && p && b[p] && (e || (b[p] = b[p].destroy()), b[p + "m"] && (b[p + "m"] = b[p + "m"].destroy())));
        },
        animate: function(a) {
          var b = this.chart,
              k = F(this.options.animation),
              d;
          a ? this.setClip(k) : (d = this.sharedClipKey, (a = b[d]) && a.animate({
            width: b.plotSizeX,
            x: 0
          }, k), b[d + "m"] && b[d + "m"].animate({
            width: b.plotSizeX + 99,
            x: 0
          }, k), this.animate = null);
        },
        afterAnimate: function() {
          this.setClip();
          f(this, "afterAnimate");
          this.finishedAnimating = !0;
        },
        drawPoints: function() {
          var a = this.points,
              b = this.chart,
              k,
              c,
              h,
              e,
              l = this.options.marker,
              f,
              q,
              u,
              n = this[this.specialGroup] || this.markerGroup,
              g,
              x = d(l.enabled, this.xAxis.isRadial ? !0 : null, this.closestPointRangePx >= l.enabledThreshold * l.radius);
          if (!1 !== l.enabled || this._hasPointMarkers)
            for (k = 0; k < a.length; k++)
              c = a[k], e = c.graphic, f = c.marker || {}, q = !!c.marker, h = x && void 0 === f.enabled || f.enabled, u = c.isInside, h && !c.isNull ? (h = d(f.symbol, this.symbol), g = this.markerAttribs(c, c.selected && "select"), e ? e[u ? "show" : "hide"](!0).animate(g) : u && (0 < g.width || c.hasImage) && (c.graphic = e = b.renderer.symbol(h, g.x, g.y, g.width, g.height, q ? f : l).add(n)), e && e.addClass(c.getClassName(), !0)) : e && (c.graphic = e.destroy());
        },
        markerAttribs: function(a, b) {
          var k = this.options.marker,
              c = a.marker || {},
              p = c.symbol || k.symbol,
              e = d(c.radius, k.radius);
          b && (k = k.states[b], b = c.states && c.states[b], e = d(b && b.radius, k && k.radius, e + (k && k.radiusPlus || 0)));
          a.hasImage = p && 0 === p.indexOf("url");
          a.hasImage && (e = 0);
          a = {
            x: Math.floor(a.plotX) - e,
            y: a.plotY - e
          };
          e && (a.width = a.height = 2 * e);
          return a;
        },
        destroy: function() {
          var a = this,
              b = a.chart,
              k = /AppleWebKit\/533/.test(x.navigator.userAgent),
              d,
              c,
              e = a.data || [],
              l,
              h;
          f(a, "destroy");
          C(a);
          y(a.axisTypes || [], function(b) {
            (h = a[b]) && h.series && (w(h.series, a), h.isDirty = h.forceRedraw = !0);
          });
          a.legendItem && a.chart.legend.destroyItem(a);
          for (c = e.length; c--; )
            (l = e[c]) && l.destroy && l.destroy();
          a.points = null;
          clearTimeout(a.animationTimeout);
          B(a, function(a, b) {
            a instanceof z && !a.survive && (d = k && "group" === b ? "hide" : "destroy", a[d]());
          });
          b.hoverSeries === a && (b.hoverSeries = null);
          w(b.series, a);
          b.orderSeries();
          B(a, function(b, e) {
            delete a[e];
          });
        },
        getGraphPath: function(a, b, k) {
          var d = this,
              c = d.options,
              e = c.step,
              l,
              h = [],
              p = [],
              f;
          a = a || d.points;
          (l = a.reversed) && a.reverse();
          (e = {
            right: 1,
            center: 2
          }[e] || e && 3) && l && (e = 4 - e);
          !c.connectNulls || b || k || (a = this.getValidPoints(a));
          y(a, function(l, u) {
            var q = l.plotX,
                n = l.plotY,
                g = a[u - 1];
            (l.leftCliff || g && g.rightCliff) && !k && (f = !0);
            l.isNull && !t(b) && 0 < u ? f = !c.connectNulls : l.isNull && !b ? f = !0 : (0 === u || f ? u = ["M", l.plotX, l.plotY] : d.getPointSpline ? u = d.getPointSpline(a, l, u) : e ? (u = 1 === e ? ["L", g.plotX, n] : 2 === e ? ["L", (g.plotX + q) / 2, g.plotY, "L", (g.plotX + q) / 2, n] : ["L", q, g.plotY], u.push("L", q, n)) : u = ["L", q, n], p.push(l.x), e && p.push(l.x), h.push.apply(h, u), f = !1);
          });
          h.xMap = p;
          return d.graphPath = h;
        },
        drawGraph: function() {
          var a = this,
              b = (this.gappedPath || this.getGraphPath).call(this),
              k = [["graph", "highcharts-graph"]];
          y(this.zones, function(a, b) {
            k.push(["zone-graph-" + b, "highcharts-graph highcharts-zone-graph-" + b + " " + (a.className || "")]);
          });
          y(k, function(k, d) {
            d = k[0];
            var e = a[d];
            e ? (e.endX = a.preventGraphAnimation ? null : b.xMap, e.animate({d: b})) : b.length && (a[d] = a.chart.renderer.path(b).addClass(k[1]).attr({zIndex: 1}).add(a.group));
            e && (e.startX = b.xMap, e.isArea = b.isArea);
          });
        },
        applyZones: function() {
          var a = this,
              b = this.chart,
              k = b.renderer,
              c = this.zones,
              h,
              e,
              l = this.clips || [],
              f,
              u = this.graph,
              n = this.area,
              g = Math.max(b.chartWidth, b.chartHeight),
              x = this[(this.zoneAxis || "y") + "Axis"],
              z,
              r,
              m = b.inverted,
              C,
              I,
              A,
              B,
              t = !1;
          c.length && (u || n) && x && void 0 !== x.min && (r = x.reversed, C = x.horiz, u && u.hide(), n && n.hide(), z = x.getExtremes(), y(c, function(c, p) {
            h = r ? C ? b.plotWidth : 0 : C ? 0 : x.toPixels(z.min);
            h = Math.min(Math.max(d(e, h), 0), g);
            e = Math.min(Math.max(Math.round(x.toPixels(d(c.value, z.max), !0)), 0), g);
            t && (h = e = x.toPixels(z.max));
            I = Math.abs(h - e);
            A = Math.min(h, e);
            B = Math.max(h, e);
            x.isXAxis ? (f = {
              x: m ? B : A,
              y: 0,
              width: I,
              height: g
            }, C || (f.x = b.plotHeight - f.x)) : (f = {
              x: 0,
              y: m ? B : A,
              width: g,
              height: I
            }, C && (f.y = b.plotWidth - f.y));
            l[p] ? l[p].animate(f) : (l[p] = k.clipRect(f), u && a["zone-graph-" + p].clip(l[p]), n && a["zone-area-" + p].clip(l[p]));
            t = c.value > z.max;
          }), this.clips = l);
        },
        invertGroups: function(a) {
          function b() {
            y(["group", "markerGroup"], function(b) {
              k[b] && (d.renderer.isVML && k[b].attr({
                width: k.yAxis.len,
                height: k.xAxis.len
              }), k[b].width = k.yAxis.len, k[b].height = k.xAxis.len, k[b].invert(a));
            });
          }
          var k = this,
              d = k.chart,
              c;
          k.xAxis && (c = D(d, "resize", b), D(k, "destroy", c), b(a), k.invertGroups = b);
        },
        plotGroup: function(a, b, k, d, c) {
          var e = this[a],
              l = !e;
          l && (this[a] = e = this.chart.renderer.g().attr({zIndex: d || .1}).add(c));
          e.addClass("highcharts-" + b + " highcharts-series-" + this.index + " highcharts-" + this.type + "-series " + (t(this.colorIndex) ? "highcharts-color-" + this.colorIndex + " " : "") + (this.options.className || "") + (e.hasClass("highcharts-tracker") ? " highcharts-tracker" : ""), !0);
          e.attr({visibility: k})[l ? "attr" : "animate"](this.getPlotBox());
          return e;
        },
        getPlotBox: function() {
          var a = this.chart,
              b = this.xAxis,
              k = this.yAxis;
          a.inverted && (b = k, k = this.xAxis);
          return {
            translateX: b ? b.left : a.plotLeft,
            translateY: k ? k.top : a.plotTop,
            scaleX: 1,
            scaleY: 1
          };
        },
        render: function() {
          var a = this,
              b = a.chart,
              k,
              d = a.options,
              c = !!a.animate && b.renderer.isSVG && F(d.animation).duration,
              e = a.visible ? "inherit" : "hidden",
              l = d.zIndex,
              h = a.hasRendered,
              q = b.seriesGroup,
              n = b.inverted;
          k = a.plotGroup("group", "series", e, l, q);
          a.markerGroup = a.plotGroup("markerGroup", "markers", e, l, q);
          c && a.animate(!0);
          k.inverted = a.isCartesian ? n : !1;
          a.drawGraph && (a.drawGraph(), a.applyZones());
          a.drawDataLabels && a.drawDataLabels();
          a.visible && a.drawPoints();
          a.drawTracker && !1 !== a.options.enableMouseTracking && a.drawTracker();
          a.invertGroups(n);
          !1 === d.clip || a.sharedClipKey || h || k.clip(b.clipRect);
          c && a.animate();
          h || (a.animationTimeout = u(function() {
            a.afterAnimate();
          }, c));
          a.isDirty = !1;
          a.hasRendered = !0;
          f(a, "afterRender");
        },
        redraw: function() {
          var a = this.chart,
              b = this.isDirty || this.isDirtyData,
              k = this.group,
              c = this.xAxis,
              h = this.yAxis;
          k && (a.inverted && k.attr({
            width: a.plotWidth,
            height: a.plotHeight
          }), k.animate({
            translateX: d(c && c.left, a.plotLeft),
            translateY: d(h && h.top, a.plotTop)
          }));
          this.translate();
          this.render();
          b && delete this.kdTree;
        },
        kdAxisArray: ["clientX", "plotY"],
        searchPoint: function(a, b) {
          var k = this.xAxis,
              d = this.yAxis,
              c = this.chart.inverted;
          return this.searchKDTree({
            clientX: c ? k.len - a.chartY + k.pos : a.chartX - k.pos,
            plotY: c ? d.len - a.chartX + d.pos : a.chartY - d.pos
          }, b);
        },
        buildKDTree: function() {
          function a(k, d, e) {
            var c,
                h;
            if (h = k && k.length)
              return c = b.kdAxisArray[d % e], k.sort(function(a, b) {
                return a[c] - b[c];
              }), h = Math.floor(h / 2), {
                point: k[h],
                left: a(k.slice(0, h), d + 1, e),
                right: a(k.slice(h + 1), d + 1, e)
              };
          }
          this.buildingKdTree = !0;
          var b = this,
              k = -1 < b.options.findNearestPointBy.indexOf("y") ? 2 : 1;
          delete b.kdTree;
          u(function() {
            b.kdTree = a(b.getValidPoints(null, !b.directTouch), k, k);
            b.buildingKdTree = !1;
          }, b.options.kdNow ? 0 : 1);
        },
        searchKDTree: function(a, b) {
          function k(a, b, h, p) {
            var f = b.point,
                u = d.kdAxisArray[h % p],
                q,
                n,
                g = f;
            n = t(a[c]) && t(f[c]) ? Math.pow(a[c] - f[c], 2) : null;
            q = t(a[e]) && t(f[e]) ? Math.pow(a[e] - f[e], 2) : null;
            q = (n || 0) + (q || 0);
            f.dist = t(q) ? Math.sqrt(q) : Number.MAX_VALUE;
            f.distX = t(n) ? Math.sqrt(n) : Number.MAX_VALUE;
            u = a[u] - f[u];
            q = 0 > u ? "left" : "right";
            n = 0 > u ? "right" : "left";
            b[q] && (q = k(a, b[q], h + 1, p), g = q[l] < g[l] ? q : f);
            b[n] && Math.sqrt(u * u) < g[l] && (a = k(a, b[n], h + 1, p), g = a[l] < g[l] ? a : g);
            return g;
          }
          var d = this,
              c = this.kdAxisArray[0],
              e = this.kdAxisArray[1],
              l = b ? "distX" : "dist";
          b = -1 < d.options.findNearestPointBy.indexOf("y") ? 2 : 1;
          this.kdTree || this.buildingKdTree || this.buildKDTree();
          if (this.kdTree)
            return k(a, this.kdTree, b, b);
        }
      });
    })(K);
    (function(a) {
      var D = a.Axis,
          F = a.Chart,
          G = a.correctFloat,
          v = a.defined,
          m = a.destroyObjectProperties,
          g = a.each,
          t = a.format,
          y = a.objectEach,
          w = a.pick,
          r = a.Series;
      a.StackItem = function(a, c, g, b, h) {
        var f = a.chart.inverted;
        this.axis = a;
        this.isNegative = g;
        this.options = c;
        this.x = b;
        this.total = null;
        this.points = {};
        this.stack = h;
        this.rightCliff = this.leftCliff = 0;
        this.alignOptions = {
          align: c.align || (f ? g ? "left" : "right" : "center"),
          verticalAlign: c.verticalAlign || (f ? "middle" : g ? "bottom" : "top"),
          y: w(c.y, f ? 4 : g ? 14 : -6),
          x: w(c.x, f ? g ? -6 : 6 : 0)
        };
        this.textAlign = c.textAlign || (f ? g ? "right" : "left" : "center");
      };
      a.StackItem.prototype = {
        destroy: function() {
          m(this, this.axis);
        },
        render: function(a) {
          var c = this.axis.chart,
              f = this.options,
              b = f.format,
              b = b ? t(b, this, c.time) : f.formatter.call(this);
          this.label ? this.label.attr({
            text: b,
            visibility: "hidden"
          }) : this.label = c.renderer.text(b, null, null, f.useHTML).css(f.style).attr({
            align: this.textAlign,
            rotation: f.rotation,
            visibility: "hidden"
          }).add(a);
        },
        setOffset: function(a, c) {
          var f = this.axis,
              b = f.chart,
              h = f.translate(f.usePercentage ? 100 : this.total, 0, 0, 0, 1),
              f = f.translate(0),
              f = Math.abs(h - f);
          a = b.xAxis[0].translate(this.x) + a;
          h = this.getStackBox(b, this, a, h, c, f);
          if (c = this.label)
            c.align(this.alignOptions, null, h), h = c.alignAttr, c[!1 === this.options.crop || b.isInsidePlot(h.x, h.y) ? "show" : "hide"](!0);
        },
        getStackBox: function(a, c, g, b, h, n) {
          var f = c.axis.reversed,
              d = a.inverted;
          a = a.plotHeight;
          c = c.isNegative && !f || !c.isNegative && f;
          return {
            x: d ? c ? b : b - n : g,
            y: d ? a - g - h : c ? a - b - n : a - b,
            width: d ? n : h,
            height: d ? h : n
          };
        }
      };
      F.prototype.getStacks = function() {
        var a = this;
        g(a.yAxis, function(a) {
          a.stacks && a.hasVisibleSeries && (a.oldStacks = a.stacks);
        });
        g(a.series, function(c) {
          !c.options.stacking || !0 !== c.visible && !1 !== a.options.chart.ignoreHiddenSeries || (c.stackKey = c.type + w(c.options.stack, ""));
        });
      };
      D.prototype.buildStacks = function() {
        var a = this.series,
            c = w(this.options.reversedStacks, !0),
            g = a.length,
            b;
        if (!this.isXAxis) {
          this.usePercentage = !1;
          for (b = g; b--; )
            a[c ? b : g - b - 1].setStackedPoints();
          for (b = 0; b < g; b++)
            a[b].modifyStacks();
        }
      };
      D.prototype.renderStackTotals = function() {
        var a = this.chart,
            c = a.renderer,
            g = this.stacks,
            b = this.stackTotalGroup;
        b || (this.stackTotalGroup = b = c.g("stack-labels").attr({
          visibility: "visible",
          zIndex: 6
        }).add());
        b.translate(a.plotLeft, a.plotTop);
        y(g, function(a) {
          y(a, function(a) {
            a.render(b);
          });
        });
      };
      D.prototype.resetStacks = function() {
        var a = this,
            c = a.stacks;
        a.isXAxis || y(c, function(c) {
          y(c, function(b, h) {
            b.touched < a.stacksTouched ? (b.destroy(), delete c[h]) : (b.total = null, b.cumulative = null);
          });
        });
      };
      D.prototype.cleanStacks = function() {
        var a;
        this.isXAxis || (this.oldStacks && (a = this.stacks = this.oldStacks), y(a, function(a) {
          y(a, function(a) {
            a.cumulative = a.total;
          });
        }));
      };
      r.prototype.setStackedPoints = function() {
        if (this.options.stacking && (!0 === this.visible || !1 === this.chart.options.chart.ignoreHiddenSeries)) {
          var f = this.processedXData,
              c = this.processedYData,
              g = [],
              b = c.length,
              h = this.options,
              n = h.threshold,
              r = w(h.startFromThreshold && n, 0),
              d = h.stack,
              h = h.stacking,
              m = this.stackKey,
              I = "-" + m,
              z = this.negStacks,
              u = this.yAxis,
              x = u.stacks,
              p = u.oldStacks,
              H,
              k,
              E,
              t,
              e,
              l,
              y;
          u.stacksTouched += 1;
          for (e = 0; e < b; e++)
            l = f[e], y = c[e], H = this.getStackIndicator(H, l, this.index), t = H.key, E = (k = z && y < (r ? 0 : n)) ? I : m, x[E] || (x[E] = {}), x[E][l] || (p[E] && p[E][l] ? (x[E][l] = p[E][l], x[E][l].total = null) : x[E][l] = new a.StackItem(u, u.options.stackLabels, k, l, d)), E = x[E][l], null !== y ? (E.points[t] = E.points[this.index] = [w(E.cumulative, r)], v(E.cumulative) || (E.base = t), E.touched = u.stacksTouched, 0 < H.index && !1 === this.singleStacks && (E.points[t][0] = E.points[this.index + "," + l + ",0"][0])) : E.points[t] = E.points[this.index] = null, "percent" === h ? (k = k ? m : I, z && x[k] && x[k][l] ? (k = x[k][l], E.total = k.total = Math.max(k.total, E.total) + Math.abs(y) || 0) : E.total = G(E.total + (Math.abs(y) || 0))) : E.total = G(E.total + (y || 0)), E.cumulative = w(E.cumulative, r) + (y || 0), null !== y && (E.points[t].push(E.cumulative), g[e] = E.cumulative);
          "percent" === h && (u.usePercentage = !0);
          this.stackedYData = g;
          u.oldStacks = {};
        }
      };
      r.prototype.modifyStacks = function() {
        var a = this,
            c = a.stackKey,
            r = a.yAxis.stacks,
            b = a.processedXData,
            h,
            n = a.options.stacking;
        a[n + "Stacker"] && g([c, "-" + c], function(c) {
          for (var d = b.length,
              f,
              g; d--; )
            if (f = b[d], h = a.getStackIndicator(h, f, a.index, c), g = (f = r[c] && r[c][f]) && f.points[h.key])
              a[n + "Stacker"](g, f, d);
        });
      };
      r.prototype.percentStacker = function(a, c, g) {
        c = c.total ? 100 / c.total : 0;
        a[0] = G(a[0] * c);
        a[1] = G(a[1] * c);
        this.stackedYData[g] = a[1];
      };
      r.prototype.getStackIndicator = function(a, c, g, b) {
        !v(a) || a.x !== c || b && a.key !== b ? a = {
          x: c,
          index: 0,
          key: b
        } : a.index++;
        a.key = [g, c, a.index].join();
        return a;
      };
    })(K);
    (function(a) {
      var D = a.addEvent,
          F = a.Axis,
          G = a.createElement,
          v = a.css,
          m = a.defined,
          g = a.each,
          t = a.erase,
          y = a.extend,
          w = a.fireEvent,
          r = a.inArray,
          f = a.isNumber,
          c = a.isObject,
          A = a.isArray,
          b = a.merge,
          h = a.objectEach,
          n = a.pick,
          B = a.Point,
          d = a.Series,
          C = a.seriesTypes,
          I = a.setAnimation,
          z = a.splat;
      y(a.Chart.prototype, {
        addSeries: function(a, b, d) {
          var c,
              k = this;
          a && (b = n(b, !0), w(k, "addSeries", {options: a}, function() {
            c = k.initSeries(a);
            k.isDirtyLegend = !0;
            k.linkSeries();
            b && k.redraw(d);
          }));
          return c;
        },
        addAxis: function(a, d, c, h) {
          var k = d ? "xAxis" : "yAxis",
              p = this.options;
          a = b(a, {
            index: this[k].length,
            isX: d
          });
          d = new F(this, a);
          p[k] = z(p[k] || {});
          p[k].push(a);
          n(c, !0) && this.redraw(h);
          return d;
        },
        showLoading: function(a) {
          var b = this,
              d = b.options,
              c = b.loadingDiv,
              k = function() {
                c && v(c, {
                  left: b.plotLeft + "px",
                  top: b.plotTop + "px",
                  width: b.plotWidth + "px",
                  height: b.plotHeight + "px"
                });
              };
          c || (b.loadingDiv = c = G("div", {className: "highcharts-loading highcharts-loading-hidden"}, null, b.container), b.loadingSpan = G("span", {className: "highcharts-loading-inner"}, null, c), D(b, "redraw", k));
          c.className = "highcharts-loading";
          b.loadingSpan.innerHTML = a || d.lang.loading;
          b.loadingShown = !0;
          k();
        },
        hideLoading: function() {
          var a = this.loadingDiv;
          a && (a.className = "highcharts-loading highcharts-loading-hidden");
          this.loadingShown = !1;
        },
        propsRequireDirtyBox: "backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
        propsRequireUpdateSeries: "chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" "),
        update: function(a, d, c) {
          var p = this,
              k = {
                credits: "addCredits",
                title: "setTitle",
                subtitle: "setSubtitle"
              },
              u = a.chart,
              x,
              e,
              l = [];
          if (u) {
            b(!0, p.options.chart, u);
            "className" in u && p.setClassName(u.className);
            if ("inverted" in u || "polar" in u)
              p.propFromSeries(), x = !0;
            "alignTicks" in u && (x = !0);
            h(u, function(a, b) {
              -1 !== r("chart." + b, p.propsRequireUpdateSeries) && (e = !0);
              -1 !== r(b, p.propsRequireDirtyBox) && (p.isDirtyBox = !0);
            });
          }
          a.plotOptions && b(!0, this.options.plotOptions, a.plotOptions);
          h(a, function(a, b) {
            if (p[b] && "function" === typeof p[b].update)
              p[b].update(a, !1);
            else if ("function" === typeof p[k[b]])
              p[k[b]](a);
            "chart" !== b && -1 !== r(b, p.propsRequireUpdateSeries) && (e = !0);
          });
          g("xAxis yAxis zAxis series colorAxis pane".split(" "), function(b) {
            a[b] && (g(z(a[b]), function(a, e) {
              (e = m(a.id) && p.get(a.id) || p[b][e]) && e.coll === b && (e.update(a, !1), c && (e.touched = !0));
              if (!e && c)
                if ("series" === b)
                  p.addSeries(a, !1).touched = !0;
                else if ("xAxis" === b || "yAxis" === b)
                  p.addAxis(a, "xAxis" === b, !1).touched = !0;
            }), c && g(p[b], function(a) {
              a.touched ? delete a.touched : l.push(a);
            }));
          });
          g(l, function(a) {
            a.remove(!1);
          });
          x && g(p.axes, function(a) {
            a.update({}, !1);
          });
          e && g(p.series, function(a) {
            a.update({}, !1);
          });
          a.loading && b(!0, p.options.loading, a.loading);
          x = u && u.width;
          u = u && u.height;
          f(x) && x !== p.chartWidth || f(u) && u !== p.chartHeight ? p.setSize(x, u) : n(d, !0) && p.redraw();
        },
        setSubtitle: function(a) {
          this.setTitle(void 0, a);
        }
      });
      y(B.prototype, {
        update: function(a, b, d, h) {
          function k() {
            p.applyOptions(a);
            null === p.y && e && (p.graphic = e.destroy());
            c(a, !0) && (e && e.element && a && a.marker && void 0 !== a.marker.symbol && (p.graphic = e.destroy()), a && a.dataLabels && p.dataLabel && (p.dataLabel = p.dataLabel.destroy()), p.connector && (p.connector = p.connector.destroy()));
            l = p.index;
            f.updateParallelArrays(p, l);
            g.data[l] = c(g.data[l], !0) || c(a, !0) ? p.options : a;
            f.isDirty = f.isDirtyData = !0;
            !f.fixedBox && f.hasCartesianSeries && (u.isDirtyBox = !0);
            "point" === g.legendType && (u.isDirtyLegend = !0);
            b && u.redraw(d);
          }
          var p = this,
              f = p.series,
              e = p.graphic,
              l,
              u = f.chart,
              g = f.options;
          b = n(b, !0);
          !1 === h ? k() : p.firePointEvent("update", {options: a}, k);
        },
        remove: function(a, b) {
          this.series.removePoint(r(this, this.series.data), a, b);
        }
      });
      y(d.prototype, {
        addPoint: function(a, b, d, c) {
          var k = this.options,
              h = this.data,
              p = this.chart,
              e = this.xAxis,
              e = e && e.hasNames && e.names,
              l = k.data,
              f,
              u,
              g = this.xData,
              x,
              z;
          b = n(b, !0);
          f = {series: this};
          this.pointClass.prototype.applyOptions.apply(f, [a]);
          z = f.x;
          x = g.length;
          if (this.requireSorting && z < g[x - 1])
            for (u = !0; x && g[x - 1] > z; )
              x--;
          this.updateParallelArrays(f, "splice", x, 0, 0);
          this.updateParallelArrays(f, x);
          e && f.name && (e[z] = f.name);
          l.splice(x, 0, a);
          u && (this.data.splice(x, 0, null), this.processData());
          "point" === k.legendType && this.generatePoints();
          d && (h[0] && h[0].remove ? h[0].remove(!1) : (h.shift(), this.updateParallelArrays(f, "shift"), l.shift()));
          this.isDirtyData = this.isDirty = !0;
          b && p.redraw(c);
        },
        removePoint: function(a, b, d) {
          var c = this,
              k = c.data,
              h = k[a],
              p = c.points,
              e = c.chart,
              l = function() {
                p && p.length === k.length && p.splice(a, 1);
                k.splice(a, 1);
                c.options.data.splice(a, 1);
                c.updateParallelArrays(h || {series: c}, "splice", a, 1);
                h && h.destroy();
                c.isDirty = !0;
                c.isDirtyData = !0;
                b && e.redraw();
              };
          I(d, e);
          b = n(b, !0);
          h ? h.firePointEvent("remove", null, l) : l();
        },
        remove: function(a, b, d) {
          function c() {
            k.destroy();
            h.isDirtyLegend = h.isDirtyBox = !0;
            h.linkSeries();
            n(a, !0) && h.redraw(b);
          }
          var k = this,
              h = k.chart;
          !1 !== d ? w(k, "remove", null, c) : c();
        },
        update: function(a, d) {
          var c = this,
              h = c.chart,
              k = c.userOptions,
              f = c.oldType || c.type,
              u = a.type || k.type || h.options.chart.type,
              e = C[f].prototype,
              l,
              x = ["group", "markerGroup", "dataLabelsGroup"],
              q = ["navigatorSeries", "baseSeries"],
              z = c.finishedAnimating && {animation: !1};
          if (Object.keys && "data" === Object.keys(a).toString())
            return this.setData(a.data, d);
          q = x.concat(q);
          g(q, function(a) {
            q[a] = c[a];
            delete c[a];
          });
          a = b(k, z, {
            index: c.index,
            pointStart: c.xData[0]
          }, {data: c.options.data}, a);
          c.remove(!1, null, !1);
          for (l in e)
            c[l] = void 0;
          y(c, C[u || f].prototype);
          g(q, function(a) {
            c[a] = q[a];
          });
          c.init(h, a);
          a.zIndex !== k.zIndex && g(x, function(b) {
            c[b] && c[b].attr({zIndex: a.zIndex});
          });
          c.oldType = f;
          h.linkSeries();
          n(d, !0) && h.redraw(!1);
        }
      });
      y(F.prototype, {
        update: function(a, d) {
          var c = this.chart;
          a = c.options[this.coll][this.options.index] = b(this.userOptions, a);
          this.destroy(!0);
          this.init(c, y(a, {events: void 0}));
          c.isDirtyBox = !0;
          n(d, !0) && c.redraw();
        },
        remove: function(a) {
          for (var b = this.chart,
              d = this.coll,
              c = this.series,
              k = c.length; k--; )
            c[k] && c[k].remove(!1);
          t(b.axes, this);
          t(b[d], this);
          A(b.options[d]) ? b.options[d].splice(this.options.index, 1) : delete b.options[d];
          g(b[d], function(a, b) {
            a.options.index = b;
          });
          this.destroy();
          b.isDirtyBox = !0;
          n(a, !0) && b.redraw();
        },
        setTitle: function(a, b) {
          this.update({title: a}, b);
        },
        setCategories: function(a, b) {
          this.update({categories: a}, b);
        }
      });
    })(K);
    (function(a) {
      var D = a.each,
          F = a.map,
          G = a.pick,
          v = a.Series,
          m = a.seriesType;
      m("area", "line", {
        softThreshold: !1,
        threshold: 0
      }, {
        singleStacks: !1,
        getStackPoints: function(g) {
          var m = [],
              v = [],
              w = this.xAxis,
              r = this.yAxis,
              f = r.stacks[this.stackKey],
              c = {},
              A = this.index,
              b = r.series,
              h = b.length,
              n,
              B = G(r.options.reversedStacks, !0) ? 1 : -1,
              d;
          g = g || this.points;
          if (this.options.stacking) {
            for (d = 0; d < g.length; d++)
              g[d].leftNull = g[d].rightNull = null, c[g[d].x] = g[d];
            a.objectEach(f, function(a, b) {
              null !== a.total && v.push(b);
            });
            v.sort(function(a, b) {
              return a - b;
            });
            n = F(b, function() {
              return this.visible;
            });
            D(v, function(a, b) {
              var g = 0,
                  u,
                  x;
              if (c[a] && !c[a].isNull)
                m.push(c[a]), D([-1, 1], function(p) {
                  var g = 1 === p ? "rightNull" : "leftNull",
                      k = 0,
                      z = f[v[b + p]];
                  if (z)
                    for (d = A; 0 <= d && d < h; )
                      u = z.points[d], u || (d === A ? c[a][g] = !0 : n[d] && (x = f[a].points[d]) && (k -= x[1] - x[0])), d += B;
                  c[a][1 === p ? "rightCliff" : "leftCliff"] = k;
                });
              else {
                for (d = A; 0 <= d && d < h; ) {
                  if (u = f[a].points[d]) {
                    g = u[1];
                    break;
                  }
                  d += B;
                }
                g = r.translate(g, 0, 1, 0, 1);
                m.push({
                  isNull: !0,
                  plotX: w.translate(a, 0, 0, 0, 1),
                  x: a,
                  plotY: g,
                  yBottom: g
                });
              }
            });
          }
          return m;
        },
        getGraphPath: function(a) {
          var g = v.prototype.getGraphPath,
              m = this.options,
              w = m.stacking,
              r = this.yAxis,
              f,
              c,
              A = [],
              b = [],
              h = this.index,
              n,
              B = r.stacks[this.stackKey],
              d = m.threshold,
              C = r.getThreshold(m.threshold),
              I,
              m = m.connectNulls || "percent" === w,
              z = function(c, f, p) {
                var g = a[c];
                c = w && B[g.x].points[h];
                var k = g[p + "Null"] || 0;
                p = g[p + "Cliff"] || 0;
                var u,
                    x,
                    g = !0;
                p || k ? (u = (k ? c[0] : c[1]) + p, x = c[0] + p, g = !!k) : !w && a[f] && a[f].isNull && (u = x = d);
                void 0 !== u && (b.push({
                  plotX: n,
                  plotY: null === u ? C : r.getThreshold(u),
                  isNull: g,
                  isCliff: !0
                }), A.push({
                  plotX: n,
                  plotY: null === x ? C : r.getThreshold(x),
                  doCurve: !1
                }));
              };
          a = a || this.points;
          w && (a = this.getStackPoints(a));
          for (f = 0; f < a.length; f++)
            if (c = a[f].isNull, n = G(a[f].rectPlotX, a[f].plotX), I = G(a[f].yBottom, C), !c || m)
              m || z(f, f - 1, "left"), c && !w && m || (b.push(a[f]), A.push({
                x: f,
                plotX: n,
                plotY: I
              })), m || z(f, f + 1, "right");
          f = g.call(this, b, !0, !0);
          A.reversed = !0;
          c = g.call(this, A, !0, !0);
          c.length && (c[0] = "L");
          c = f.concat(c);
          g = g.call(this, b, !1, m);
          c.xMap = f.xMap;
          this.areaPath = c;
          return g;
        },
        drawGraph: function() {
          this.areaPath = [];
          v.prototype.drawGraph.apply(this);
          var a = this,
              m = this.areaPath,
              y = this.options,
              w = [["area", "highcharts-area"]];
          D(this.zones, function(a, f) {
            w.push(["zone-area-" + f, "highcharts-area highcharts-zone-area-" + f + " " + a.className]);
          });
          D(w, function(g) {
            var f = g[0],
                c = a[f];
            c ? (c.endX = a.preventGraphAnimation ? null : m.xMap, c.animate({d: m})) : (c = a[f] = a.chart.renderer.path(m).addClass(g[1]).attr({zIndex: 0}).add(a.group), c.isArea = !0);
            c.startX = m.xMap;
            c.shiftUnit = y.step ? 2 : 1;
          });
        },
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle
      });
    })(K);
    (function(a) {
      var D = a.pick;
      a = a.seriesType;
      a("spline", "line", {}, {getPointSpline: function(a, G, v) {
          var m = G.plotX,
              g = G.plotY,
              t = a[v - 1];
          v = a[v + 1];
          var y,
              w,
              r,
              f;
          if (t && !t.isNull && !1 !== t.doCurve && !G.isCliff && v && !v.isNull && !1 !== v.doCurve && !G.isCliff) {
            a = t.plotY;
            r = v.plotX;
            v = v.plotY;
            var c = 0;
            y = (1.5 * m + t.plotX) / 2.5;
            w = (1.5 * g + a) / 2.5;
            r = (1.5 * m + r) / 2.5;
            f = (1.5 * g + v) / 2.5;
            r !== y && (c = (f - w) * (r - m) / (r - y) + g - f);
            w += c;
            f += c;
            w > a && w > g ? (w = Math.max(a, g), f = 2 * g - w) : w < a && w < g && (w = Math.min(a, g), f = 2 * g - w);
            f > v && f > g ? (f = Math.max(v, g), w = 2 * g - f) : f < v && f < g && (f = Math.min(v, g), w = 2 * g - f);
            G.rightContX = r;
            G.rightContY = f;
          }
          G = ["C", D(t.rightContX, t.plotX), D(t.rightContY, t.plotY), D(y, m), D(w, g), m, g];
          t.rightContX = t.rightContY = null;
          return G;
        }});
    })(K);
    (function(a) {
      var D = a.seriesTypes.area.prototype,
          F = a.seriesType;
      F("areaspline", "spline", a.defaultPlotOptions.area, {
        getStackPoints: D.getStackPoints,
        getGraphPath: D.getGraphPath,
        drawGraph: D.drawGraph,
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle
      });
    })(K);
    (function(a) {
      var D = a.animObject,
          F = a.each,
          G = a.extend,
          v = a.isNumber,
          m = a.merge,
          g = a.pick,
          t = a.Series,
          y = a.seriesType,
          w = a.svg;
      y("column", "line", {
        borderRadius: 0,
        crisp: !0,
        groupPadding: .2,
        marker: null,
        pointPadding: .1,
        minPointLength: 0,
        cropThreshold: 50,
        pointRange: null,
        states: {hover: {halo: !1}},
        dataLabels: {
          align: null,
          verticalAlign: null,
          y: null
        },
        softThreshold: !1,
        startFromThreshold: !0,
        stickyTracking: !1,
        tooltip: {distance: 6},
        threshold: 0
      }, {
        cropShoulder: 0,
        directTouch: !0,
        trackerGroups: ["group", "dataLabelsGroup"],
        negStacks: !0,
        init: function() {
          t.prototype.init.apply(this, arguments);
          var a = this,
              f = a.chart;
          f.hasRendered && F(f.series, function(c) {
            c.type === a.type && (c.isDirty = !0);
          });
        },
        getColumnMetrics: function() {
          var a = this,
              f = a.options,
              c = a.xAxis,
              m = a.yAxis,
              b = c.reversed,
              h,
              n = {},
              B = 0;
          !1 === f.grouping ? B = 1 : F(a.chart.series, function(b) {
            var d = b.options,
                c = b.yAxis,
                p;
            b.type !== a.type || !b.visible && a.chart.options.chart.ignoreHiddenSeries || m.len !== c.len || m.pos !== c.pos || (d.stacking ? (h = b.stackKey, void 0 === n[h] && (n[h] = B++), p = n[h]) : !1 !== d.grouping && (p = B++), b.columnIndex = p);
          });
          var d = Math.min(Math.abs(c.transA) * (c.ordinalSlope || f.pointRange || c.closestPointRange || c.tickInterval || 1), c.len),
              C = d * f.groupPadding,
              I = (d - 2 * C) / (B || 1),
              f = Math.min(f.maxPointWidth || c.len, g(f.pointWidth, I * (1 - 2 * f.pointPadding)));
          a.columnMetrics = {
            width: f,
            offset: (I - f) / 2 + (C + ((a.columnIndex || 0) + (b ? 1 : 0)) * I - d / 2) * (b ? -1 : 1)
          };
          return a.columnMetrics;
        },
        crispCol: function(a, f, c, g) {
          var b = this.chart,
              h = this.borderWidth,
              n = -(h % 2 ? .5 : 0),
              h = h % 2 ? .5 : 1;
          b.inverted && b.renderer.isVML && (h += 1);
          this.options.crisp && (c = Math.round(a + c) + n, a = Math.round(a) + n, c -= a);
          g = Math.round(f + g) + h;
          n = .5 >= Math.abs(f) && .5 < g;
          f = Math.round(f) + h;
          g -= f;
          n && g && (--f, g += 1);
          return {
            x: a,
            y: f,
            width: c,
            height: g
          };
        },
        translate: function() {
          var a = this,
              f = a.chart,
              c = a.options,
              m = a.dense = 2 > a.closestPointRange * a.xAxis.transA,
              m = a.borderWidth = g(c.borderWidth, m ? 0 : 1),
              b = a.yAxis,
              h = c.threshold,
              n = a.translatedThreshold = b.getThreshold(h),
              B = g(c.minPointLength, 5),
              d = a.getColumnMetrics(),
              C = d.width,
              I = a.barW = Math.max(C, 1 + 2 * m),
              z = a.pointXOffset = d.offset;
          f.inverted && (n -= .5);
          c.pointPadding && (I = Math.ceil(I));
          t.prototype.translate.apply(a);
          F(a.points, function(d) {
            var c = g(d.yBottom, n),
                p = 999 + Math.abs(c),
                p = Math.min(Math.max(-p, d.plotY), b.len + p),
                u = d.plotX + z,
                k = I,
                r = Math.min(p, c),
                m,
                e = Math.max(p, c) - r;
            B && Math.abs(e) < B && (e = B, m = !b.reversed && !d.negative || b.reversed && d.negative, d.y === h && a.dataMax <= h && b.min < h && (m = !m), r = Math.abs(r - n) > B ? c - B : n - (m ? B : 0));
            d.barX = u;
            d.pointWidth = C;
            d.tooltipPos = f.inverted ? [b.len + b.pos - f.plotLeft - p, a.xAxis.len - u - k / 2, e] : [u + k / 2, p + b.pos - f.plotTop, e];
            d.shapeType = "rect";
            d.shapeArgs = a.crispCol.apply(a, d.isNull ? [u, n, k, 0] : [u, r, k, e]);
          });
        },
        getSymbol: a.noop,
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
        drawGraph: function() {
          this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data");
        },
        drawPoints: function() {
          var a = this,
              f = this.chart,
              c = a.options,
              g = f.renderer,
              b = c.animationLimit || 250,
              h;
          F(a.points, function(n) {
            var r = n.graphic;
            if (v(n.plotY) && null !== n.y) {
              h = n.shapeArgs;
              if (r)
                r[f.pointCount < b ? "animate" : "attr"](m(h));
              else
                n.graphic = r = g[n.shapeType](h).add(n.group || a.group);
              c.borderRadius && r.attr({r: c.borderRadius});
              r.addClass(n.getClassName(), !0);
            } else
              r && (n.graphic = r.destroy());
          });
        },
        animate: function(a) {
          var f = this,
              c = this.yAxis,
              g = f.options,
              b = this.chart.inverted,
              h = {},
              n = b ? "translateX" : "translateY",
              r;
          w && (a ? (h.scaleY = .001, a = Math.min(c.pos + c.len, Math.max(c.pos, c.toPixels(g.threshold))), b ? h.translateX = a - c.len : h.translateY = a, f.group.attr(h)) : (r = f.group.attr(n), f.group.animate({scaleY: 1}, G(D(f.options.animation), {step: function(a, b) {
              h[n] = r + b.pos * (c.pos - r);
              f.group.attr(h);
            }})), f.animate = null));
        },
        remove: function() {
          var a = this,
              f = a.chart;
          f.hasRendered && F(f.series, function(c) {
            c.type === a.type && (c.isDirty = !0);
          });
          t.prototype.remove.apply(a, arguments);
        }
      });
    })(K);
    (function(a) {
      a = a.seriesType;
      a("bar", "column", null, {inverted: !0});
    })(K);
    (function(a) {
      var D = a.Series;
      a = a.seriesType;
      a("scatter", "line", {
        lineWidth: 0,
        findNearestPointBy: "xy",
        marker: {enabled: !0},
        tooltip: {
          headerFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e \x3cspan class\x3d"highcharts-header"\x3e {series.name}\x3c/span\x3e\x3cbr/\x3e',
          pointFormat: "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e"
        }
      }, {
        sorted: !1,
        requireSorting: !1,
        noSharedTooltip: !0,
        trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
        takeOrdinalPosition: !1,
        drawGraph: function() {
          this.options.lineWidth && D.prototype.drawGraph.call(this);
        }
      });
    })(K);
    (function(a) {
      var D = a.deg2rad,
          F = a.isNumber,
          G = a.pick,
          v = a.relativeLength;
      a.CenteredSeriesMixin = {
        getCenter: function() {
          var a = this.options,
              g = this.chart,
              t = 2 * (a.slicedOffset || 0),
              y = g.plotWidth - 2 * t,
              g = g.plotHeight - 2 * t,
              w = a.center,
              w = [G(w[0], "50%"), G(w[1], "50%"), a.size || "100%", a.innerSize || 0],
              r = Math.min(y, g),
              f,
              c;
          for (f = 0; 4 > f; ++f)
            c = w[f], a = 2 > f || 2 === f && /%$/.test(c), w[f] = v(c, [y, g, r, w[2]][f]) + (a ? t : 0);
          w[3] > w[2] && (w[3] = w[2]);
          return w;
        },
        getStartAndEndRadians: function(a, g) {
          a = F(a) ? a : 0;
          g = F(g) && g > a && 360 > g - a ? g : a + 360;
          return {
            start: D * (a + -90),
            end: D * (g + -90)
          };
        }
      };
    })(K);
    (function(a) {
      var D = a.addEvent,
          F = a.CenteredSeriesMixin,
          G = a.defined,
          v = a.each,
          m = a.extend,
          g = F.getStartAndEndRadians,
          t = a.inArray,
          y = a.noop,
          w = a.pick,
          r = a.Point,
          f = a.Series,
          c = a.seriesType,
          A = a.setAnimation;
      c("pie", "line", {
        center: [null, null],
        clip: !1,
        colorByPoint: !0,
        dataLabels: {
          distance: 30,
          enabled: !0,
          formatter: function() {
            return this.point.isNull ? void 0 : this.point.name;
          },
          x: 0
        },
        ignoreHiddenPoint: !0,
        legendType: "point",
        marker: null,
        size: null,
        showInLegend: !1,
        slicedOffset: 10,
        stickyTracking: !1,
        tooltip: {followPointer: !0}
      }, {
        isCartesian: !1,
        requireSorting: !1,
        directTouch: !0,
        noSharedTooltip: !0,
        trackerGroups: ["group", "dataLabelsGroup"],
        axisTypes: [],
        pointAttribs: a.seriesTypes.column.prototype.pointAttribs,
        animate: function(a) {
          var b = this,
              c = b.points,
              f = b.startAngleRad;
          a || (v(c, function(a) {
            var d = a.graphic,
                c = a.shapeArgs;
            d && (d.attr({
              r: a.startR || b.center[3] / 2,
              start: f,
              end: f
            }), d.animate({
              r: c.r,
              start: c.start,
              end: c.end
            }, b.options.animation));
          }), b.animate = null);
        },
        updateTotals: function() {
          var a,
              c = 0,
              f = this.points,
              g = f.length,
              d,
              r = this.options.ignoreHiddenPoint;
          for (a = 0; a < g; a++)
            d = f[a], c += r && !d.visible ? 0 : d.isNull ? 0 : d.y;
          this.total = c;
          for (a = 0; a < g; a++)
            d = f[a], d.percentage = 0 < c && (d.visible || !r) ? d.y / c * 100 : 0, d.total = c;
        },
        generatePoints: function() {
          f.prototype.generatePoints.call(this);
          this.updateTotals();
        },
        translate: function(a) {
          this.generatePoints();
          var b = 0,
              c = this.options,
              f = c.slicedOffset,
              d = f + (c.borderWidth || 0),
              r,
              m,
              z,
              u = g(c.startAngle, c.endAngle),
              x = this.startAngleRad = u.start,
              u = (this.endAngleRad = u.end) - x,
              p = this.points,
              t,
              k = c.dataLabels.distance,
              c = c.ignoreHiddenPoint,
              E,
              v = p.length,
              e;
          a || (this.center = a = this.getCenter());
          this.getX = function(b, e, d) {
            z = Math.asin(Math.min((b - a[1]) / (a[2] / 2 + d.labelDistance), 1));
            return a[0] + (e ? -1 : 1) * Math.cos(z) * (a[2] / 2 + d.labelDistance);
          };
          for (E = 0; E < v; E++) {
            e = p[E];
            e.labelDistance = w(e.options.dataLabels && e.options.dataLabels.distance, k);
            this.maxLabelDistance = Math.max(this.maxLabelDistance || 0, e.labelDistance);
            r = x + b * u;
            if (!c || e.visible)
              b += e.percentage / 100;
            m = x + b * u;
            e.shapeType = "arc";
            e.shapeArgs = {
              x: a[0],
              y: a[1],
              r: a[2] / 2,
              innerR: a[3] / 2,
              start: Math.round(1E3 * r) / 1E3,
              end: Math.round(1E3 * m) / 1E3
            };
            z = (m + r) / 2;
            z > 1.5 * Math.PI ? z -= 2 * Math.PI : z < -Math.PI / 2 && (z += 2 * Math.PI);
            e.slicedTranslation = {
              translateX: Math.round(Math.cos(z) * f),
              translateY: Math.round(Math.sin(z) * f)
            };
            m = Math.cos(z) * a[2] / 2;
            t = Math.sin(z) * a[2] / 2;
            e.tooltipPos = [a[0] + .7 * m, a[1] + .7 * t];
            e.half = z < -Math.PI / 2 || z > Math.PI / 2 ? 1 : 0;
            e.angle = z;
            r = Math.min(d, e.labelDistance / 5);
            e.labelPos = [a[0] + m + Math.cos(z) * e.labelDistance, a[1] + t + Math.sin(z) * e.labelDistance, a[0] + m + Math.cos(z) * r, a[1] + t + Math.sin(z) * r, a[0] + m, a[1] + t, 0 > e.labelDistance ? "center" : e.half ? "right" : "left", z];
          }
        },
        drawGraph: null,
        drawPoints: function() {
          var a = this,
              c = a.chart.renderer,
              f,
              g,
              d;
          v(a.points, function(b) {
            g = b.graphic;
            b.isNull ? g && (b.graphic = g.destroy()) : (d = b.shapeArgs, f = b.getTranslate(), g ? g.setRadialReference(a.center).animate(m(d, f)) : (b.graphic = g = c[b.shapeType](d).setRadialReference(a.center).attr(f).add(a.group), b.visible || g.attr({visibility: "hidden"})), g.addClass(b.getClassName()));
          });
        },
        searchPoint: y,
        sortByAngle: function(a, c) {
          a.sort(function(a, b) {
            return void 0 !== a.angle && (b.angle - a.angle) * c;
          });
        },
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
        getCenter: F.getCenter,
        getSymbol: y
      }, {
        init: function() {
          r.prototype.init.apply(this, arguments);
          var a = this,
              c;
          a.name = w(a.name, "Slice");
          c = function(b) {
            a.slice("select" === b.type);
          };
          D(a, "select", c);
          D(a, "unselect", c);
          return a;
        },
        isValid: function() {
          return a.isNumber(this.y, !0) && 0 <= this.y;
        },
        setVisible: function(a, c) {
          var b = this,
              h = b.series,
              d = h.chart,
              f = h.options.ignoreHiddenPoint;
          c = w(c, f);
          a !== b.visible && (b.visible = b.options.visible = a = void 0 === a ? !b.visible : a, h.options.data[t(b, h.data)] = b.options, v(["graphic", "dataLabel", "connector", "shadowGroup"], function(d) {
            if (b[d])
              b[d][a ? "show" : "hide"](!0);
          }), b.legendItem && d.legend.colorizeItem(b, a), a || "hover" !== b.state || b.setState(""), f && (h.isDirty = !0), c && d.redraw());
        },
        slice: function(a, c, f) {
          var b = this.series;
          A(f, b.chart);
          w(c, !0);
          this.sliced = this.options.sliced = G(a) ? a : !this.sliced;
          b.options.data[t(this, b.data)] = this.options;
          this.graphic.animate(this.getTranslate());
        },
        getTranslate: function() {
          return this.sliced ? this.slicedTranslation : {
            translateX: 0,
            translateY: 0
          };
        },
        haloPath: function(a) {
          var b = this.shapeArgs;
          return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(b.x, b.y, b.r + a, b.r + a, {
            innerR: this.shapeArgs.r - 1,
            start: b.start,
            end: b.end
          });
        }
      });
    })(K);
    (function(a) {
      var D = a.addEvent,
          F = a.arrayMax,
          G = a.defined,
          v = a.each,
          m = a.extend,
          g = a.format,
          t = a.map,
          y = a.merge,
          w = a.noop,
          r = a.pick,
          f = a.relativeLength,
          c = a.Series,
          A = a.seriesTypes,
          b = a.stableSort;
      a.distribute = function(a, c) {
        function h(a, b) {
          return a.target - b.target;
        }
        var d,
            f = !0,
            g = a,
            n = [],
            u;
        u = 0;
        for (d = a.length; d--; )
          u += a[d].size;
        if (u > c) {
          b(a, function(a, b) {
            return (b.rank || 0) - (a.rank || 0);
          });
          for (u = d = 0; u <= c; )
            u += a[d].size, d++;
          n = a.splice(d - 1, a.length);
        }
        b(a, h);
        for (a = t(a, function(a) {
          return {
            size: a.size,
            targets: [a.target],
            align: r(a.align, .5)
          };
        }); f; ) {
          for (d = a.length; d--; )
            f = a[d], u = (Math.min.apply(0, f.targets) + Math.max.apply(0, f.targets)) / 2, f.pos = Math.min(Math.max(0, u - f.size * f.align), c - f.size);
          d = a.length;
          for (f = !1; d--; )
            0 < d && a[d - 1].pos + a[d - 1].size > a[d].pos && (a[d - 1].size += a[d].size, a[d - 1].targets = a[d - 1].targets.concat(a[d].targets), a[d - 1].align = .5, a[d - 1].pos + a[d - 1].size > c && (a[d - 1].pos = c - a[d - 1].size), a.splice(d, 1), f = !0);
        }
        d = 0;
        v(a, function(a) {
          var b = 0;
          v(a.targets, function() {
            g[d].pos = a.pos + b;
            b += g[d].size;
            d++;
          });
        });
        g.push.apply(g, n);
        b(g, h);
      };
      c.prototype.drawDataLabels = function() {
        function b(a, b) {
          var e = b.filter;
          return e ? (b = e.operator, a = a[e.property], e = e.value, "\x3e" === b && a > e || "\x3c" === b && a < e || "\x3e\x3d" === b && a >= e || "\x3c\x3d" === b && a <= e || "\x3d\x3d" === b && a == e || "\x3d\x3d\x3d" === b && a === e ? !0 : !1) : !0;
        }
        var c = this,
            f = c.chart,
            d = c.options,
            m = d.dataLabels,
            I = c.points,
            z,
            u,
            x = c.hasRendered || 0,
            p,
            t,
            k = r(m.defer, !!d.animation),
            E = f.renderer;
        if (m.enabled || c._hasPointLabels)
          c.dlProcessOptions && c.dlProcessOptions(m), t = c.plotGroup("dataLabelsGroup", "data-labels", k && !x ? "hidden" : "visible", m.zIndex || 6), k && (t.attr({opacity: +x}), x || D(c, "afterAnimate", function() {
            c.visible && t.show(!0);
            t[d.animation ? "animate" : "attr"]({opacity: 1}, {duration: 200});
          })), u = m, v(I, function(d) {
            var e,
                k = d.dataLabel,
                h,
                q,
                n = d.connector,
                x = !k,
                I;
            z = d.dlOptions || d.options && d.options.dataLabels;
            (e = r(z && z.enabled, u.enabled) && !d.isNull) && (e = !0 === b(d, z || m));
            e && (m = y(u, z), h = d.getLabelConfig(), I = m[d.formatPrefix + "Format"] || m.format, p = G(I) ? g(I, h, f.time) : (m[d.formatPrefix + "Formatter"] || m.formatter).call(h, m), h = m.rotation, q = {
              r: m.borderRadius || 0,
              rotation: h,
              padding: m.padding,
              zIndex: 1
            }, a.objectEach(q, function(a, b) {
              void 0 === a && delete q[b];
            }));
            !k || e && G(p) ? e && G(p) && (k ? q.text = p : (k = d.dataLabel = h ? E.text(p, 0, -9999).addClass("highcharts-data-label") : E.label(p, 0, -9999, m.shape, null, null, m.useHTML, null, "data-label"), k.addClass(" highcharts-data-label-color-" + d.colorIndex + " " + (m.className || "") + (m.useHTML ? "highcharts-tracker" : ""))), k.attr(q), k.added || k.add(t), c.alignDataLabel(d, k, m, null, x)) : (d.dataLabel = k = k.destroy(), n && (d.connector = n.destroy()));
          });
        a.fireEvent(this, "afterDrawDataLabels");
      };
      c.prototype.alignDataLabel = function(a, b, c, d, f) {
        var h = this.chart,
            g = h.inverted,
            u = r(a.dlBox && a.dlBox.centerX, a.plotX, -9999),
            n = r(a.plotY, -9999),
            p = b.getBBox(),
            t,
            k = c.rotation,
            E = c.align,
            w = this.visible && (a.series.forceDL || h.isInsidePlot(u, Math.round(n), g) || d && h.isInsidePlot(u, g ? d.x + 1 : d.y + d.height - 1, g)),
            e = "justify" === r(c.overflow, "justify");
        if (w && (t = h.renderer.fontMetrics(void 0, b).b, d = m({
          x: g ? this.yAxis.len - n : u,
          y: Math.round(g ? this.xAxis.len - u : n),
          width: 0,
          height: 0
        }, d), m(c, {
          width: p.width,
          height: p.height
        }), k ? (e = !1, u = h.renderer.rotCorr(t, k), u = {
          x: d.x + c.x + d.width / 2 + u.x,
          y: d.y + c.y + {
            top: 0,
            middle: .5,
            bottom: 1
          }[c.verticalAlign] * d.height
        }, b[f ? "attr" : "animate"](u).attr({align: E}), n = (k + 720) % 360, n = 180 < n && 360 > n, "left" === E ? u.y -= n ? p.height : 0 : "center" === E ? (u.x -= p.width / 2, u.y -= p.height / 2) : "right" === E && (u.x -= p.width, u.y -= n ? 0 : p.height)) : (b.align(c, null, d), u = b.alignAttr), e ? a.isLabelJustified = this.justifyDataLabel(b, c, u, p, d, f) : r(c.crop, !0) && (w = h.isInsidePlot(u.x, u.y) && h.isInsidePlot(u.x + p.width, u.y + p.height)), c.shape && !k))
          b[f ? "attr" : "animate"]({
            anchorX: g ? h.plotWidth - a.plotY : a.plotX,
            anchorY: g ? h.plotHeight - a.plotX : a.plotY
          });
        w || (b.attr({y: -9999}), b.placed = !1);
      };
      c.prototype.justifyDataLabel = function(a, b, c, d, f, g) {
        var h = this.chart,
            u = b.align,
            n = b.verticalAlign,
            p,
            m,
            k = a.box ? 0 : a.padding || 0;
        p = c.x + k;
        0 > p && ("right" === u ? b.align = "left" : b.x = -p, m = !0);
        p = c.x + d.width - k;
        p > h.plotWidth && ("left" === u ? b.align = "right" : b.x = h.plotWidth - p, m = !0);
        p = c.y + k;
        0 > p && ("bottom" === n ? b.verticalAlign = "top" : b.y = -p, m = !0);
        p = c.y + d.height - k;
        p > h.plotHeight && ("top" === n ? b.verticalAlign = "bottom" : b.y = h.plotHeight - p, m = !0);
        m && (a.placed = !g, a.align(b, null, f));
        return m;
      };
      A.pie && (A.pie.prototype.drawDataLabels = function() {
        var b = this,
            f = b.data,
            g,
            d = b.chart,
            m = b.options.dataLabels,
            t = r(m.connectorPadding, 10),
            z = r(m.connectorWidth, 1),
            u = d.plotWidth,
            x = d.plotHeight,
            p,
            w = b.center,
            k = w[2] / 2,
            E = w[1],
            A,
            e,
            l,
            y,
            q = [[], []],
            L,
            D,
            P,
            O,
            M = [0, 0, 0, 0];
        b.visible && (m.enabled || b._hasPointLabels) && (v(f, function(a) {
          a.dataLabel && a.visible && a.dataLabel.shortened && (a.dataLabel.attr({width: "auto"}).css({
            width: "auto",
            textOverflow: "clip"
          }), a.dataLabel.shortened = !1);
        }), c.prototype.drawDataLabels.apply(b), v(f, function(a) {
          a.dataLabel && a.visible && (q[a.half].push(a), a.dataLabel._pos = null);
        }), v(q, function(c, h) {
          var f,
              p,
              q = c.length,
              n = [],
              z;
          if (q)
            for (b.sortByAngle(c, h - .5), 0 < b.maxLabelDistance && (f = Math.max(0, E - k - b.maxLabelDistance), p = Math.min(E + k + b.maxLabelDistance, d.plotHeight), v(c, function(a) {
              0 < a.labelDistance && a.dataLabel && (a.top = Math.max(0, E - k - a.labelDistance), a.bottom = Math.min(E + k + a.labelDistance, d.plotHeight), z = a.dataLabel.getBBox().height || 21, a.positionsIndex = n.push({
                target: a.labelPos[1] - a.top + z / 2,
                size: z,
                rank: a.y
              }) - 1);
            }), a.distribute(n, p + z - f)), O = 0; O < q; O++)
              g = c[O], p = g.positionsIndex, l = g.labelPos, A = g.dataLabel, P = !1 === g.visible ? "hidden" : "inherit", D = f = l[1], n && G(n[p]) && (void 0 === n[p].pos ? P = "hidden" : (y = n[p].size, D = g.top + n[p].pos)), delete g.positionIndex, L = m.justify ? w[0] + (h ? -1 : 1) * (k + g.labelDistance) : b.getX(D < g.top + 2 || D > g.bottom - 2 ? f : D, h, g), A._attr = {
                visibility: P,
                align: l[6]
              }, A._pos = {
                x: L + m.x + ({
                  left: t,
                  right: -t
                }[l[6]] || 0),
                y: D + m.y - 10
              }, l.x = L, l.y = D, r(m.crop, !0) && (e = A.getBBox().width, f = null, L - e < t ? (f = Math.round(e - L + t), M[3] = Math.max(f, M[3])) : L + e > u - t && (f = Math.round(L + e - u + t), M[1] = Math.max(f, M[1])), 0 > D - y / 2 ? M[0] = Math.max(Math.round(-D + y / 2), M[0]) : D + y / 2 > x && (M[2] = Math.max(Math.round(D + y / 2 - x), M[2])), A.sideOverflow = f);
        }), 0 === F(M) || this.verifyDataLabelOverflow(M)) && (this.placeDataLabels(), z && v(this.points, function(a) {
          var e;
          p = a.connector;
          if ((A = a.dataLabel) && A._pos && a.visible && 0 < a.labelDistance) {
            P = A._attr.visibility;
            if (e = !p)
              a.connector = p = d.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-" + a.colorIndex).add(b.dataLabelsGroup);
            p[e ? "attr" : "animate"]({d: b.connectorPath(a.labelPos)});
            p.attr("visibility", P);
          } else
            p && (a.connector = p.destroy());
        }));
      }, A.pie.prototype.connectorPath = function(a) {
        var b = a.x,
            c = a.y;
        return r(this.options.dataLabels.softConnector, !0) ? ["M", b + ("left" === a[6] ? 5 : -5), c, "C", b, c, 2 * a[2] - a[4], 2 * a[3] - a[5], a[2], a[3], "L", a[4], a[5]] : ["M", b + ("left" === a[6] ? 5 : -5), c, "L", a[2], a[3], "L", a[4], a[5]];
      }, A.pie.prototype.placeDataLabels = function() {
        v(this.points, function(a) {
          var b = a.dataLabel;
          b && a.visible && ((a = b._pos) ? (b.sideOverflow && (b._attr.width = b.getBBox().width - b.sideOverflow, b.css({
            width: b._attr.width + "px",
            textOverflow: "ellipsis"
          }), b.shortened = !0), b.attr(b._attr), b[b.moved ? "animate" : "attr"](a), b.moved = !0) : b && b.attr({y: -9999}));
        }, this);
      }, A.pie.prototype.alignDataLabel = w, A.pie.prototype.verifyDataLabelOverflow = function(a) {
        var b = this.center,
            c = this.options,
            d = c.center,
            h = c.minSize || 80,
            g,
            z = null !== c.size;
        z || (null !== d[0] ? g = Math.max(b[2] - Math.max(a[1], a[3]), h) : (g = Math.max(b[2] - a[1] - a[3], h), b[0] += (a[3] - a[1]) / 2), null !== d[1] ? g = Math.max(Math.min(g, b[2] - Math.max(a[0], a[2])), h) : (g = Math.max(Math.min(g, b[2] - a[0] - a[2]), h), b[1] += (a[0] - a[2]) / 2), g < b[2] ? (b[2] = g, b[3] = Math.min(f(c.innerSize || 0, g), g), this.translate(b), this.drawDataLabels && this.drawDataLabels()) : z = !0);
        return z;
      });
      A.column && (A.column.prototype.alignDataLabel = function(a, b, f, d, g) {
        var h = this.chart.inverted,
            n = a.series,
            u = a.dlBox || a.shapeArgs,
            x = r(a.below, a.plotY > r(this.translatedThreshold, n.yAxis.len)),
            p = r(f.inside, !!this.options.stacking);
        u && (d = y(u), 0 > d.y && (d.height += d.y, d.y = 0), u = d.y + d.height - n.yAxis.len, 0 < u && (d.height -= u), h && (d = {
          x: n.yAxis.len - d.y - d.height,
          y: n.xAxis.len - d.x - d.width,
          width: d.height,
          height: d.width
        }), p || (h ? (d.x += x ? 0 : d.width, d.width = 0) : (d.y += x ? d.height : 0, d.height = 0)));
        f.align = r(f.align, !h || p ? "center" : x ? "right" : "left");
        f.verticalAlign = r(f.verticalAlign, h || p ? "middle" : x ? "top" : "bottom");
        c.prototype.alignDataLabel.call(this, a, b, f, d, g);
        a.isLabelJustified && a.contrastColor && a.dataLabel.css({color: a.contrastColor});
      });
    })(K);
    (function(a) {
      var D = a.Chart,
          F = a.each,
          G = a.objectEach,
          v = a.pick;
      a = a.addEvent;
      a(D.prototype, "render", function() {
        var a = [];
        F(this.labelCollectors || [], function(g) {
          a = a.concat(g());
        });
        F(this.yAxis || [], function(g) {
          g.options.stackLabels && !g.options.stackLabels.allowOverlap && G(g.stacks, function(g) {
            G(g, function(g) {
              a.push(g.label);
            });
          });
        });
        F(this.series || [], function(g) {
          var m = g.options.dataLabels,
              y = g.dataLabelCollections || ["dataLabel"];
          (m.enabled || g._hasPointLabels) && !m.allowOverlap && g.visible && F(y, function(m) {
            F(g.points, function(g) {
              g[m] && (g[m].labelrank = v(g.labelrank, g.shapeArgs && g.shapeArgs.height), a.push(g[m]));
            });
          });
        });
        this.hideOverlappingLabels(a);
      });
      D.prototype.hideOverlappingLabels = function(a) {
        var g = a.length,
            m,
            v,
            w,
            r,
            f,
            c,
            A,
            b,
            h,
            n = function(a, b, c, f, h, g, n, p) {
              return !(h > a + c || h + n < a || g > b + f || g + p < b);
            };
        for (v = 0; v < g; v++)
          if (m = a[v])
            m.oldOpacity = m.opacity, m.newOpacity = 1, m.width || (w = m.getBBox(), m.width = w.width, m.height = w.height);
        a.sort(function(a, b) {
          return (b.labelrank || 0) - (a.labelrank || 0);
        });
        for (v = 0; v < g; v++)
          for (w = a[v], m = v + 1; m < g; ++m)
            if (r = a[m], w && r && w !== r && w.placed && r.placed && 0 !== w.newOpacity && 0 !== r.newOpacity && (f = w.alignAttr, c = r.alignAttr, A = w.parentGroup, b = r.parentGroup, h = 2 * (w.box ? 0 : w.padding || 0), f = n(f.x + A.translateX, f.y + A.translateY, w.width - h, w.height - h, c.x + b.translateX, c.y + b.translateY, r.width - h, r.height - h)))
              (w.labelrank < r.labelrank ? w : r).newOpacity = 0;
        F(a, function(a) {
          var b,
              c;
          a && (c = a.newOpacity, a.oldOpacity !== c && a.placed && (c ? a.show(!0) : b = function() {
            a.hide();
          }, a.alignAttr.opacity = c, a[a.isOld ? "animate" : "attr"](a.alignAttr, null, b)), a.isOld = !0);
        });
      };
    })(K);
    (function(a) {
      var D = a.addEvent,
          F = a.Chart,
          G = a.createElement,
          v = a.css,
          m = a.defaultOptions,
          g = a.defaultPlotOptions,
          t = a.each,
          y = a.extend,
          w = a.fireEvent,
          r = a.hasTouch,
          f = a.inArray,
          c = a.isObject,
          A = a.Legend,
          b = a.merge,
          h = a.pick,
          n = a.Point,
          B = a.Series,
          d = a.seriesTypes,
          C = a.svg,
          I;
      I = a.TrackerMixin = {
        drawTrackerPoint: function() {
          var a = this,
              b = a.chart.pointer,
              d = function(a) {
                var d = b.getPointFromEvent(a);
                void 0 !== d && (b.isDirectTouch = !0, d.onMouseOver(a));
              };
          t(a.points, function(a) {
            a.graphic && (a.graphic.element.point = a);
            a.dataLabel && (a.dataLabel.div ? a.dataLabel.div.point = a : a.dataLabel.element.point = a);
          });
          a._hasTracking || (t(a.trackerGroups, function(c) {
            if (a[c] && (a[c].addClass("highcharts-tracker").on("mouseover", d).on("mouseout", function(a) {
              b.onTrackerMouseOut(a);
            }), r))
              a[c].on("touchstart", d);
          }), a._hasTracking = !0);
          w(this, "afterDrawTracker");
        },
        drawTrackerGraph: function() {
          var a = this,
              b = a.options.trackByArea,
              d = [].concat(b ? a.areaPath : a.graphPath),
              c = d.length,
              f = a.chart,
              k = f.pointer,
              h = f.renderer,
              g = f.options.tooltip.snap,
              e = a.tracker,
              l,
              n = function() {
                if (f.hoverSeries !== a)
                  a.onMouseOver();
              },
              q = "rgba(192,192,192," + (C ? .0001 : .002) + ")";
          if (c && !b)
            for (l = c + 1; l--; )
              "M" === d[l] && d.splice(l + 1, 0, d[l + 1] - g, d[l + 2], "L"), (l && "M" === d[l] || l === c) && d.splice(l, 0, "L", d[l - 2] + g, d[l - 1]);
          e ? e.attr({d: d}) : a.graph && (a.tracker = h.path(d).attr({
            "stroke-linejoin": "round",
            visibility: a.visible ? "visible" : "hidden",
            stroke: q,
            fill: b ? q : "none",
            "stroke-width": a.graph.strokeWidth() + (b ? 0 : 2 * g),
            zIndex: 2
          }).add(a.group), t([a.tracker, a.markerGroup], function(a) {
            a.addClass("highcharts-tracker").on("mouseover", n).on("mouseout", function(a) {
              k.onTrackerMouseOut(a);
            });
            if (r)
              a.on("touchstart", n);
          }));
          w(this, "afterDrawTracker");
        }
      };
      d.column && (d.column.prototype.drawTracker = I.drawTrackerPoint);
      d.pie && (d.pie.prototype.drawTracker = I.drawTrackerPoint);
      d.scatter && (d.scatter.prototype.drawTracker = I.drawTrackerPoint);
      y(A.prototype, {
        setItemEvents: function(a, b, d) {
          var c = this.chart.renderer.boxWrapper,
              f = "highcharts-legend-" + (a instanceof n ? "point" : "series") + "-active";
          (d ? b : a.legendGroup).on("mouseover", function() {
            a.setState("hover");
            c.addClass(f);
          }).on("mouseout", function() {
            c.removeClass(f);
            a.setState();
          }).on("click", function(b) {
            var d = function() {
              a.setVisible && a.setVisible();
            };
            c.removeClass(f);
            b = {browserEvent: b};
            a.firePointEvent ? a.firePointEvent("legendItemClick", b, d) : w(a, "legendItemClick", b, d);
          });
        },
        createCheckboxForItem: function(a) {
          a.checkbox = G("input", {
            type: "checkbox",
            checked: a.selected,
            defaultChecked: a.selected
          }, this.options.itemCheckboxStyle, this.chart.container);
          D(a.checkbox, "click", function(b) {
            w(a.series || a, "checkboxClick", {
              checked: b.target.checked,
              item: a
            }, function() {
              a.select();
            });
          });
        }
      });
      y(F.prototype, {
        showResetZoom: function() {
          function a() {
            b.zoomOut();
          }
          var b = this,
              d = m.lang,
              c = b.options.chart.resetZoomButton,
              f = c.theme,
              k = f.states,
              h = "chart" === c.relativeTo ? null : "plotBox";
          w(this, "beforeShowResetZoom", null, function() {
            b.resetZoomButton = b.renderer.button(d.resetZoom, null, null, a, f, k && k.hover).attr({
              align: c.position.align,
              title: d.resetZoomTitle
            }).addClass("highcharts-reset-zoom").add().align(c.position, !1, h);
          });
        },
        zoomOut: function() {
          var a = this;
          w(a, "selection", {resetSelection: !0}, function() {
            a.zoom();
          });
        },
        zoom: function(a) {
          var b,
              d = this.pointer,
              f = !1,
              g;
          !a || a.resetSelection ? (t(this.axes, function(a) {
            b = a.zoom();
          }), d.initiated = !1) : t(a.xAxis.concat(a.yAxis), function(a) {
            var c = a.axis;
            d[c.isXAxis ? "zoomX" : "zoomY"] && (b = c.zoom(a.min, a.max), c.displayBtn && (f = !0));
          });
          g = this.resetZoomButton;
          f && !g ? this.showResetZoom() : !f && c(g) && (this.resetZoomButton = g.destroy());
          b && this.redraw(h(this.options.chart.animation, a && a.animation, 100 > this.pointCount));
        },
        pan: function(a, b) {
          var d = this,
              c = d.hoverPoints,
              f;
          c && t(c, function(a) {
            a.setState();
          });
          t("xy" === b ? [1, 0] : [1], function(b) {
            b = d[b ? "xAxis" : "yAxis"][0];
            var c = b.horiz,
                k = a[c ? "chartX" : "chartY"],
                c = c ? "mouseDownX" : "mouseDownY",
                e = d[c],
                l = (b.pointRange || 0) / 2,
                h = b.getExtremes(),
                g = b.toValue(e - k, !0) + l,
                p = b.toValue(e + b.len - k, !0) - l,
                u = p < g,
                e = u ? p : g,
                g = u ? g : p,
                p = Math.min(h.dataMin, l ? h.min : b.toValue(b.toPixels(h.min) - b.minPixelPadding)),
                l = Math.max(h.dataMax, l ? h.max : b.toValue(b.toPixels(h.max) + b.minPixelPadding)),
                u = p - e;
            0 < u && (g += u, e = p);
            u = g - l;
            0 < u && (g = l, e -= u);
            b.series.length && e !== h.min && g !== h.max && (b.setExtremes(e, g, !1, !1, {trigger: "pan"}), f = !0);
            d[c] = k;
          });
          f && d.redraw(!1);
          v(d.container, {cursor: "move"});
        }
      });
      y(n.prototype, {
        select: function(a, b) {
          var d = this,
              c = d.series,
              g = c.chart;
          a = h(a, !d.selected);
          d.firePointEvent(a ? "select" : "unselect", {accumulate: b}, function() {
            d.selected = d.options.selected = a;
            c.options.data[f(d, c.data)] = d.options;
            d.setState(a && "select");
            b || t(g.getSelectedPoints(), function(a) {
              a.selected && a !== d && (a.selected = a.options.selected = !1, c.options.data[f(a, c.data)] = a.options, a.setState(""), a.firePointEvent("unselect"));
            });
          });
        },
        onMouseOver: function(a) {
          var b = this.series.chart,
              d = b.pointer;
          a = a ? d.normalize(a) : d.getChartCoordinatesFromPoint(this, b.inverted);
          d.runPointActions(a, this);
        },
        onMouseOut: function() {
          var a = this.series.chart;
          this.firePointEvent("mouseOut");
          t(a.hoverPoints || [], function(a) {
            a.setState();
          });
          a.hoverPoints = a.hoverPoint = null;
        },
        importEvents: function() {
          if (!this.hasImportedEvents) {
            var d = this,
                c = b(d.series.options.point, d.options).events;
            d.events = c;
            a.objectEach(c, function(a, b) {
              D(d, b, a);
            });
            this.hasImportedEvents = !0;
          }
        },
        setState: function(a, b) {
          var d = Math.floor(this.plotX),
              c = this.plotY,
              f = this.series,
              k = f.options.states[a || "normal"] || {},
              u = g[f.type].marker && f.options.marker,
              n = u && !1 === u.enabled,
              e = u && u.states && u.states[a || "normal"] || {},
              l = !1 === e.enabled,
              m = f.stateMarkerGraphic,
              q = this.marker || {},
              r = f.chart,
              z = f.halo,
              t,
              v = u && f.markerAttribs;
          a = a || "";
          if (!(a === this.state && !b || this.selected && "select" !== a || !1 === k.enabled || a && (l || n && !1 === e.enabled) || a && q.states && q.states[a] && !1 === q.states[a].enabled)) {
            v && (t = f.markerAttribs(this, a));
            if (this.graphic)
              this.state && this.graphic.removeClass("highcharts-point-" + this.state), a && this.graphic.addClass("highcharts-point-" + a), t && this.graphic.animate(t, h(r.options.chart.animation, e.animation, u.animation)), m && m.hide();
            else {
              if (a && e)
                if (u = q.symbol || f.symbol, m && m.currentSymbol !== u && (m = m.destroy()), m)
                  m[b ? "animate" : "attr"]({
                    x: t.x,
                    y: t.y
                  });
                else
                  u && (f.stateMarkerGraphic = m = r.renderer.symbol(u, t.x, t.y, t.width, t.height).add(f.markerGroup), m.currentSymbol = u);
              m && (m[a && r.isInsidePlot(d, c, r.inverted) ? "show" : "hide"](), m.element.point = this);
            }
            (d = k.halo) && d.size ? (z || (f.halo = z = r.renderer.path().add((this.graphic || m).parentGroup)), z.show()[b ? "animate" : "attr"]({d: this.haloPath(d.size)}), z.attr({"class": "highcharts-halo highcharts-color-" + h(this.colorIndex, f.colorIndex)}), z.point = this) : z && z.point && z.point.haloPath && z.animate({d: z.point.haloPath(0)}, null, z.hide);
            this.state = a;
            w(this, "afterSetState");
          }
        },
        haloPath: function(a) {
          return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) - a, this.plotY - a, 2 * a, 2 * a);
        }
      });
      y(B.prototype, {
        onMouseOver: function() {
          var a = this.chart,
              b = a.hoverSeries;
          if (b && b !== this)
            b.onMouseOut();
          this.options.events.mouseOver && w(this, "mouseOver");
          this.setState("hover");
          a.hoverSeries = this;
        },
        onMouseOut: function() {
          var a = this.options,
              b = this.chart,
              d = b.tooltip,
              c = b.hoverPoint;
          b.hoverSeries = null;
          if (c)
            c.onMouseOut();
          this && a.events.mouseOut && w(this, "mouseOut");
          !d || this.stickyTracking || d.shared && !this.noSharedTooltip || d.hide();
          this.setState();
        },
        setState: function(a) {
          var b = this;
          a = a || "";
          b.state !== a && (t([b.group, b.markerGroup, b.dataLabelsGroup], function(d) {
            d && (b.state && d.removeClass("highcharts-series-" + b.state), a && d.addClass("highcharts-series-" + a));
          }), b.state = a);
        },
        setVisible: function(a, b) {
          var d = this,
              c = d.chart,
              f = d.legendItem,
              k,
              h = c.options.chart.ignoreHiddenSeries,
              g = d.visible;
          k = (d.visible = a = d.options.visible = d.userOptions.visible = void 0 === a ? !g : a) ? "show" : "hide";
          t(["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"], function(a) {
            if (d[a])
              d[a][k]();
          });
          if (c.hoverSeries === d || (c.hoverPoint && c.hoverPoint.series) === d)
            d.onMouseOut();
          f && c.legend.colorizeItem(d, a);
          d.isDirty = !0;
          d.options.stacking && t(c.series, function(a) {
            a.options.stacking && a.visible && (a.isDirty = !0);
          });
          t(d.linkedSeries, function(b) {
            b.setVisible(a, !1);
          });
          h && (c.isDirtyBox = !0);
          !1 !== b && c.redraw();
          w(d, k);
        },
        show: function() {
          this.setVisible(!0);
        },
        hide: function() {
          this.setVisible(!1);
        },
        select: function(a) {
          this.selected = a = void 0 === a ? !this.selected : a;
          this.checkbox && (this.checkbox.checked = a);
          w(this, a ? "select" : "unselect");
        },
        drawTracker: I.drawTrackerGraph
      });
    })(K);
    (function(a) {
      var D = a.Chart,
          F = a.each,
          G = a.inArray,
          v = a.isArray,
          m = a.isObject,
          g = a.pick,
          t = a.splat;
      D.prototype.setResponsive = function(g) {
        var m = this.options.responsive,
            r = [],
            f = this.currentResponsive;
        m && m.rules && F(m.rules, function(c) {
          void 0 === c._id && (c._id = a.uniqueKey());
          this.matchResponsiveRule(c, r, g);
        }, this);
        var c = a.merge.apply(0, a.map(r, function(c) {
          return a.find(m.rules, function(a) {
            return a._id === c;
          }).chartOptions;
        })),
            r = r.toString() || void 0;
        r !== (f && f.ruleIds) && (f && this.update(f.undoOptions, g), r ? (this.currentResponsive = {
          ruleIds: r,
          mergedOptions: c,
          undoOptions: this.currentOptions(c)
        }, this.update(c, g)) : this.currentResponsive = void 0);
      };
      D.prototype.matchResponsiveRule = function(a, m) {
        var r = a.condition;
        (r.callback || function() {
          return this.chartWidth <= g(r.maxWidth, Number.MAX_VALUE) && this.chartHeight <= g(r.maxHeight, Number.MAX_VALUE) && this.chartWidth >= g(r.minWidth, 0) && this.chartHeight >= g(r.minHeight, 0);
        }).call(this) && m.push(a._id);
      };
      D.prototype.currentOptions = function(g) {
        function w(f, c, g, b) {
          var h;
          a.objectEach(f, function(a, f) {
            if (!b && -1 < G(f, ["series", "xAxis", "yAxis"]))
              for (a = t(a), g[f] = [], h = 0; h < a.length; h++)
                c[f][h] && (g[f][h] = {}, w(a[h], c[f][h], g[f][h], b + 1));
            else
              m(a) ? (g[f] = v(a) ? [] : {}, w(a, c[f] || {}, g[f], b + 1)) : g[f] = c[f] || null;
          });
        }
        var r = {};
        w(g, this.options, r, 0);
        return r;
      };
    })(K);
    (function(a) {
      var D = a.addEvent,
          F = a.Axis,
          G = a.Chart,
          v = a.css,
          m = a.defined,
          g = a.each,
          t = a.extend,
          y = a.noop,
          w = a.pick,
          r = a.timeUnits,
          f = a.wrap;
      f(a.Series.prototype, "init", function(a) {
        var c;
        a.apply(this, Array.prototype.slice.call(arguments, 1));
        (c = this.xAxis) && c.options.ordinal && D(this, "updatedData", function() {
          delete c.ordinalIndex;
        });
      });
      f(F.prototype, "getTimeTicks", function(a, f, b, g, n, t, d, w) {
        var c = 0,
            h,
            u,
            x = {},
            p,
            v,
            k,
            E = [],
            A = -Number.MAX_VALUE,
            e = this.options.tickPixelInterval,
            l = this.chart.time;
        if (!this.options.ordinal && !this.options.breaks || !t || 3 > t.length || void 0 === b)
          return a.call(this, f, b, g, n);
        v = t.length;
        for (h = 0; h < v; h++) {
          k = h && t[h - 1] > g;
          t[h] < b && (c = h);
          if (h === v - 1 || t[h + 1] - t[h] > 5 * d || k) {
            if (t[h] > A) {
              for (u = a.call(this, f, t[c], t[h], n); u.length && u[0] <= A; )
                u.shift();
              u.length && (A = u[u.length - 1]);
              E = E.concat(u);
            }
            c = h + 1;
          }
          if (k)
            break;
        }
        a = u.info;
        if (w && a.unitRange <= r.hour) {
          h = E.length - 1;
          for (c = 1; c < h; c++)
            l.dateFormat("%d", E[c]) !== l.dateFormat("%d", E[c - 1]) && (x[E[c]] = "day", p = !0);
          p && (x[E[0]] = "day");
          a.higherRanks = x;
        }
        E.info = a;
        if (w && m(e)) {
          w = l = E.length;
          h = [];
          var C;
          for (p = []; w--; )
            c = this.translate(E[w]), C && (p[w] = C - c), h[w] = C = c;
          p.sort();
          p = p[Math.floor(p.length / 2)];
          p < .6 * e && (p = null);
          w = E[l - 1] > g ? l - 1 : l;
          for (C = void 0; w--; )
            c = h[w], g = Math.abs(C - c), C && g < .8 * e && (null === p || g < .8 * p) ? (x[E[w]] && !x[E[w + 1]] ? (g = w + 1, C = c) : g = w, E.splice(g, 1)) : C = c;
        }
        return E;
      });
      t(F.prototype, {
        beforeSetTickPositions: function() {
          var a,
              f = [],
              b = !1,
              h,
              n = this.getExtremes(),
              r = n.min,
              d = n.max,
              t,
              v = this.isXAxis && !!this.options.breaks,
              n = this.options.ordinal,
              z = Number.MAX_VALUE,
              u = this.chart.options.chart.ignoreHiddenSeries;
          h = "highcharts-navigator-xaxis" === this.options.className;
          !this.options.overscroll || this.max !== this.dataMax || this.chart.mouseIsDown && !h || this.eventArgs && (!this.eventArgs || "navigator" === this.eventArgs.trigger) || (this.max += this.options.overscroll, !h && m(this.userMin) && (this.min += this.options.overscroll));
          if (n || v) {
            g(this.series, function(b, d) {
              if (!(u && !1 === b.visible || !1 === b.takeOrdinalPosition && !v) && (f = f.concat(b.processedXData), a = f.length, f.sort(function(a, b) {
                return a - b;
              }), z = Math.min(z, w(b.closestPointRange, z)), a))
                for (d = a - 1; d--; )
                  f[d] === f[d + 1] && f.splice(d, 1);
            });
            a = f.length;
            if (2 < a) {
              h = f[1] - f[0];
              for (t = a - 1; t-- && !b; )
                f[t + 1] - f[t] !== h && (b = !0);
              !this.options.keepOrdinalPadding && (f[0] - r > h || d - f[f.length - 1] > h) && (b = !0);
            } else
              this.options.overscroll && (2 === a ? z = f[1] - f[0] : 1 === a ? (z = this.options.overscroll, f = [f[0], f[0] + z]) : z = this.overscrollPointsRange);
            b ? (this.options.overscroll && (this.overscrollPointsRange = z, f = f.concat(this.getOverscrollPositions())), this.ordinalPositions = f, h = this.ordinal2lin(Math.max(r, f[0]), !0), t = Math.max(this.ordinal2lin(Math.min(d, f[f.length - 1]), !0), 1), this.ordinalSlope = d = (d - r) / (t - h), this.ordinalOffset = r - h * d) : (this.overscrollPointsRange = w(this.closestPointRange, this.overscrollPointsRange), this.ordinalPositions = this.ordinalSlope = this.ordinalOffset = void 0);
          }
          this.isOrdinal = n && b;
          this.groupIntervalFactor = null;
        },
        val2lin: function(a, f) {
          var b = this.ordinalPositions;
          if (b) {
            var c = b.length,
                g,
                m;
            for (g = c; g--; )
              if (b[g] === a) {
                m = g;
                break;
              }
            for (g = c - 1; g--; )
              if (a > b[g] || 0 === g) {
                a = (a - b[g]) / (b[g + 1] - b[g]);
                m = g + a;
                break;
              }
            f = f ? m : this.ordinalSlope * (m || 0) + this.ordinalOffset;
          } else
            f = a;
          return f;
        },
        lin2val: function(a, f) {
          var b = this.ordinalPositions;
          if (b) {
            var c = this.ordinalSlope,
                g = this.ordinalOffset,
                m = b.length - 1,
                d;
            if (f)
              0 > a ? a = b[0] : a > m ? a = b[m] : (m = Math.floor(a), d = a - m);
            else
              for (; m--; )
                if (f = c * m + g, a >= f) {
                  c = c * (m + 1) + g;
                  d = (a - f) / (c - f);
                  break;
                }
            return void 0 !== d && void 0 !== b[m] ? b[m] + (d ? d * (b[m + 1] - b[m]) : 0) : a;
          }
          return a;
        },
        getExtendedPositions: function() {
          var a = this,
              f = a.chart,
              b = a.series[0].currentDataGrouping,
              h = a.ordinalIndex,
              n = b ? b.count + b.unitName : "raw",
              m = a.options.overscroll,
              d = a.getExtremes(),
              r,
              t;
          h || (h = a.ordinalIndex = {});
          h[n] || (r = {
            series: [],
            chart: f,
            getExtremes: function() {
              return {
                min: d.dataMin,
                max: d.dataMax + m
              };
            },
            options: {ordinal: !0},
            val2lin: F.prototype.val2lin,
            ordinal2lin: F.prototype.ordinal2lin
          }, g(a.series, function(d) {
            t = {
              xAxis: r,
              xData: d.xData.slice(),
              chart: f,
              destroyGroupedData: y
            };
            t.xData = t.xData.concat(a.getOverscrollPositions());
            t.options = {dataGrouping: b ? {
                enabled: !0,
                forced: !0,
                approximation: "open",
                units: [[b.unitName, [b.count]]]
              } : {enabled: !1}};
            d.processData.apply(t);
            r.series.push(t);
          }), a.beforeSetTickPositions.apply(r), h[n] = r.ordinalPositions);
          return h[n];
        },
        getOverscrollPositions: function() {
          var c = this.options.overscroll,
              f = this.overscrollPointsRange,
              b = [],
              g = this.dataMax;
          if (a.defined(f))
            for (b.push(g); g <= this.dataMax + c; )
              g += f, b.push(g);
          return b;
        },
        getGroupIntervalFactor: function(a, f, b) {
          var c;
          b = b.processedXData;
          var g = b.length,
              m = [];
          c = this.groupIntervalFactor;
          if (!c) {
            for (c = 0; c < g - 1; c++)
              m[c] = b[c + 1] - b[c];
            m.sort(function(a, b) {
              return a - b;
            });
            m = m[Math.floor(g / 2)];
            a = Math.max(a, b[0]);
            f = Math.min(f, b[g - 1]);
            this.groupIntervalFactor = c = g * m / (f - a);
          }
          return c;
        },
        postProcessTickInterval: function(a) {
          var c = this.ordinalSlope;
          return c ? this.options.breaks ? this.closestPointRange || a : a / (c / this.closestPointRange) : a;
        }
      });
      F.prototype.ordinal2lin = F.prototype.val2lin;
      f(G.prototype, "pan", function(a, f) {
        var b = this.xAxis[0],
            c = b.options.overscroll,
            n = f.chartX,
            m = !1;
        if (b.options.ordinal && b.series.length) {
          var d = this.mouseDownX,
              r = b.getExtremes(),
              t = r.dataMax,
              z = r.min,
              u = r.max,
              x = this.hoverPoints,
              p = b.closestPointRange || b.overscrollPointsRange,
              d = (d - n) / (b.translationSlope * (b.ordinalSlope || p)),
              w = {ordinalPositions: b.getExtendedPositions()},
              p = b.lin2val,
              k = b.val2lin,
              E;
          w.ordinalPositions ? 1 < Math.abs(d) && (x && g(x, function(a) {
            a.setState();
          }), 0 > d ? (x = w, E = b.ordinalPositions ? b : w) : (x = b.ordinalPositions ? b : w, E = w), w = E.ordinalPositions, t > w[w.length - 1] && w.push(t), this.fixedRange = u - z, d = b.toFixedRange(null, null, p.apply(x, [k.apply(x, [z, !0]) + d, !0]), p.apply(E, [k.apply(E, [u, !0]) + d, !0])), d.min >= Math.min(r.dataMin, z) && d.max <= Math.max(t, u) + c && b.setExtremes(d.min, d.max, !0, !1, {trigger: "pan"}), this.mouseDownX = n, v(this.container, {cursor: "move"})) : m = !0;
        } else
          m = !0;
        m && (c && (b.max = b.dataMax + c), a.apply(this, Array.prototype.slice.call(arguments, 1)));
      });
    })(K);
    (function(a) {
      function D() {
        return Array.prototype.slice.call(arguments, 1);
      }
      function F(a) {
        a.apply(this);
        this.drawBreaks(this.xAxis, ["x"]);
        this.drawBreaks(this.yAxis, G(this.pointArrayMap, ["y"]));
      }
      var G = a.pick,
          v = a.wrap,
          m = a.each,
          g = a.extend,
          t = a.isArray,
          y = a.fireEvent,
          w = a.Axis,
          r = a.Series;
      g(w.prototype, {
        isInBreak: function(a, c) {
          var f = a.repeat || Infinity,
              b = a.from,
              g = a.to - a.from;
          c = c >= b ? (c - b) % f : f - (b - c) % f;
          return a.inclusive ? c <= g : c < g && 0 !== c;
        },
        isInAnyBreak: function(a, c) {
          var f = this.options.breaks,
              b = f && f.length,
              g,
              n,
              m;
          if (b) {
            for (; b--; )
              this.isInBreak(f[b], a) && (g = !0, n || (n = G(f[b].showPoints, this.isXAxis ? !1 : !0)));
            m = g && c ? g && !n : g;
          }
          return m;
        }
      });
      v(w.prototype, "setTickPositions", function(a) {
        a.apply(this, Array.prototype.slice.call(arguments, 1));
        if (this.options.breaks) {
          var c = this.tickPositions,
              f = this.tickPositions.info,
              b = [],
              g;
          for (g = 0; g < c.length; g++)
            this.isInAnyBreak(c[g]) || b.push(c[g]);
          this.tickPositions = b;
          this.tickPositions.info = f;
        }
      });
      v(w.prototype, "init", function(a, c, g) {
        var b = this;
        g.breaks && g.breaks.length && (g.ordinal = !1);
        a.call(this, c, g);
        a = this.options.breaks;
        b.isBroken = t(a) && !!a.length;
        b.isBroken && (b.val2lin = function(a) {
          var c = a,
              f,
              d;
          for (d = 0; d < b.breakArray.length; d++)
            if (f = b.breakArray[d], f.to <= a)
              c -= f.len;
            else if (f.from >= a)
              break;
            else if (b.isInBreak(f, a)) {
              c -= a - f.from;
              break;
            }
          return c;
        }, b.lin2val = function(a) {
          var c,
              f;
          for (f = 0; f < b.breakArray.length && !(c = b.breakArray[f], c.from >= a); f++)
            c.to < a ? a += c.len : b.isInBreak(c, a) && (a += c.len);
          return a;
        }, b.setExtremes = function(a, b, c, d, f) {
          for (; this.isInAnyBreak(a); )
            a -= this.closestPointRange;
          for (; this.isInAnyBreak(b); )
            b -= this.closestPointRange;
          w.prototype.setExtremes.call(this, a, b, c, d, f);
        }, b.setAxisTranslation = function(a) {
          w.prototype.setAxisTranslation.call(this, a);
          a = b.options.breaks;
          var c = [],
              f = [],
              d = 0,
              g,
              h,
              r = b.userMin || b.min,
              u = b.userMax || b.max,
              x = G(b.pointRangePadding, 0),
              p,
              t;
          m(a, function(a) {
            h = a.repeat || Infinity;
            b.isInBreak(a, r) && (r += a.to % h - r % h);
            b.isInBreak(a, u) && (u -= u % h - a.from % h);
          });
          m(a, function(a) {
            p = a.from;
            for (h = a.repeat || Infinity; p - h > r; )
              p -= h;
            for (; p < r; )
              p += h;
            for (t = p; t < u; t += h)
              c.push({
                value: t,
                move: "in"
              }), c.push({
                value: t + (a.to - a.from),
                move: "out",
                size: a.breakSize
              });
          });
          c.sort(function(a, b) {
            return a.value === b.value ? ("in" === a.move ? 0 : 1) - ("in" === b.move ? 0 : 1) : a.value - b.value;
          });
          g = 0;
          p = r;
          m(c, function(a) {
            g += "in" === a.move ? 1 : -1;
            1 === g && "in" === a.move && (p = a.value);
            0 === g && (f.push({
              from: p,
              to: a.value,
              len: a.value - p - (a.size || 0)
            }), d += a.value - p - (a.size || 0));
          });
          b.breakArray = f;
          b.unitLength = u - r - d + x;
          y(b, "afterBreaks");
          b.options.staticScale ? b.transA = b.options.staticScale : b.unitLength && (b.transA *= (u - b.min + x) / b.unitLength);
          x && (b.minPixelPadding = b.transA * b.minPointOffset);
          b.min = r;
          b.max = u;
        });
      });
      v(r.prototype, "generatePoints", function(a) {
        a.apply(this, D(arguments));
        var c = this.xAxis,
            f = this.yAxis,
            b = this.points,
            g,
            n = b.length,
            m = this.options.connectNulls,
            d;
        if (c && f && (c.options.breaks || f.options.breaks))
          for (; n--; )
            g = b[n], d = null === g.y && !1 === m, d || !c.isInAnyBreak(g.x, !0) && !f.isInAnyBreak(g.y, !0) || (b.splice(n, 1), this.data[n] && this.data[n].destroyElements());
      });
      a.Series.prototype.drawBreaks = function(a, c) {
        var f = this,
            b = f.points,
            g,
            n,
            r,
            d;
        a && m(c, function(c) {
          g = a.breakArray || [];
          n = a.isXAxis ? a.min : G(f.options.threshold, a.min);
          m(b, function(b) {
            d = G(b["stack" + c.toUpperCase()], b[c]);
            m(g, function(c) {
              r = !1;
              if (n < c.from && d > c.to || n > c.from && d < c.from)
                r = "pointBreak";
              else if (n < c.from && d > c.from && d < c.to || n > c.from && d > c.to && d < c.from)
                r = "pointInBreak";
              r && y(a, r, {
                point: b,
                brk: c
              });
            });
          });
        });
      };
      a.Series.prototype.gappedPath = function() {
        var f = this.currentDataGrouping,
            c = f && f.totalRange,
            f = this.options.gapSize,
            g = this.points.slice(),
            b = g.length - 1,
            h = this.yAxis;
        if (f && 0 < b)
          for ("value" !== this.options.gapUnit && (f *= this.closestPointRange), c && c > f && (f = c); b--; )
            g[b + 1].x - g[b].x > f && (c = (g[b].x + g[b + 1].x) / 2, g.splice(b + 1, 0, {
              isNull: !0,
              x: c
            }), this.options.stacking && (c = h.stacks[this.stackKey][c] = new a.StackItem(h, h.options.stackLabels, !1, c, this.stack), c.total = 0));
        return this.getGraphPath(g);
      };
      v(a.seriesTypes.column.prototype, "drawPoints", F);
      v(a.Series.prototype, "drawPoints", F);
    })(K);
    (function(a) {
      var D = a.arrayMax,
          F = a.arrayMin,
          G = a.Axis,
          v = a.defaultPlotOptions,
          m = a.defined,
          g = a.each,
          t = a.extend,
          y = a.format,
          w = a.isNumber,
          r = a.merge,
          f = a.pick,
          c = a.Point,
          A = a.Tooltip,
          b = a.wrap,
          h = a.Series.prototype,
          n = h.processData,
          B = h.generatePoints,
          d = {
            approximation: "average",
            groupPixelWidth: 2,
            dateTimeLabelFormats: {
              millisecond: ["%A, %b %e, %H:%M:%S.%L", "%A, %b %e, %H:%M:%S.%L", "-%H:%M:%S.%L"],
              second: ["%A, %b %e, %H:%M:%S", "%A, %b %e, %H:%M:%S", "-%H:%M:%S"],
              minute: ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"],
              hour: ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"],
              day: ["%A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"],
              week: ["Week from %A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"],
              month: ["%B %Y", "%B", "-%B %Y"],
              year: ["%Y", "%Y", "-%Y"]
            }
          },
          C = {
            line: {},
            spline: {},
            area: {},
            areaspline: {},
            column: {
              approximation: "sum",
              groupPixelWidth: 10
            },
            arearange: {approximation: "range"},
            areasplinerange: {approximation: "range"},
            columnrange: {
              approximation: "range",
              groupPixelWidth: 10
            },
            candlestick: {
              approximation: "ohlc",
              groupPixelWidth: 10
            },
            ohlc: {
              approximation: "ohlc",
              groupPixelWidth: 5
            }
          },
          I = a.defaultDataGroupingUnits = [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second", [1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1]], ["week", [1]], ["month", [1, 3, 6]], ["year", null]],
          z = a.approximations = {
            sum: function(a) {
              var b = a.length,
                  d;
              if (!b && a.hasNulls)
                d = null;
              else if (b)
                for (d = 0; b--; )
                  d += a[b];
              return d;
            },
            average: function(a) {
              var b = a.length;
              a = z.sum(a);
              w(a) && b && (a /= b);
              return a;
            },
            averages: function() {
              var a = [];
              g(arguments, function(b) {
                a.push(z.average(b));
              });
              return void 0 === a[0] ? void 0 : a;
            },
            open: function(a) {
              return a.length ? a[0] : a.hasNulls ? null : void 0;
            },
            high: function(a) {
              return a.length ? D(a) : a.hasNulls ? null : void 0;
            },
            low: function(a) {
              return a.length ? F(a) : a.hasNulls ? null : void 0;
            },
            close: function(a) {
              return a.length ? a[a.length - 1] : a.hasNulls ? null : void 0;
            },
            ohlc: function(a, b, d, c) {
              a = z.open(a);
              b = z.high(b);
              d = z.low(d);
              c = z.close(c);
              if (w(a) || w(b) || w(d) || w(c))
                return [a, b, d, c];
            },
            range: function(a, b) {
              a = z.low(a);
              b = z.high(b);
              if (w(a) || w(b))
                return [a, b];
              if (null === a && null === b)
                return null;
            }
          };
      h.groupData = function(a, b, c, f) {
        var k = this.data,
            h = this.options.data,
            p = [],
            e = [],
            l = [],
            u = a.length,
            q,
            n,
            m = !!b,
            r = [];
        f = "function" === typeof f ? f : z[f] || C[this.type] && z[C[this.type].approximation] || z[d.approximation];
        var x = this.pointArrayMap,
            t = x && x.length,
            v = 0;
        n = 0;
        var I,
            y;
        t ? g(x, function() {
          r.push([]);
        }) : r.push([]);
        I = t || 1;
        for (y = 0; y <= u && !(a[y] >= c[0]); y++)
          ;
        for (y; y <= u; y++) {
          for (; void 0 !== c[v + 1] && a[y] >= c[v + 1] || y === u; ) {
            q = c[v];
            this.dataGroupInfo = {
              start: n,
              length: r[0].length
            };
            n = f.apply(this, r);
            void 0 !== n && (p.push(q), e.push(n), l.push(this.dataGroupInfo));
            n = y;
            for (q = 0; q < I; q++)
              r[q].length = 0, r[q].hasNulls = !1;
            v += 1;
            if (y === u)
              break;
          }
          if (y === u)
            break;
          if (x) {
            q = this.cropStart + y;
            var H = k && k[q] || this.pointClass.prototype.applyOptions.apply({series: this}, [h[q]]),
                A;
            for (q = 0; q < t; q++)
              A = H[x[q]], w(A) ? r[q].push(A) : null === A && (r[q].hasNulls = !0);
          } else
            q = m ? b[y] : null, w(q) ? r[0].push(q) : null === q && (r[0].hasNulls = !0);
        }
        return [p, e, l];
      };
      h.processData = function() {
        var a = this.chart,
            b = this.options.dataGrouping,
            d = !1 !== this.allowDG && b && f(b.enabled, a.options.isStock),
            c = this.visible || !a.options.chart.ignoreHiddenSeries,
            k,
            g = this.currentDataGrouping,
            r;
        this.forceCrop = d;
        this.groupPixelWidth = null;
        this.hasProcessed = !0;
        if (!1 !== n.apply(this, arguments) && d) {
          this.destroyGroupedData();
          var e = this.processedXData,
              l = this.processedYData,
              t = a.plotSizeX,
              a = this.xAxis,
              q = a.options.ordinal,
              z = this.groupPixelWidth = a.getGroupPixelWidth && a.getGroupPixelWidth();
          if (z) {
            this.isDirty = k = !0;
            this.points = null;
            d = a.getExtremes();
            r = d.min;
            d = d.max;
            q = q && a.getGroupIntervalFactor(r, d, this) || 1;
            z = z * (d - r) / t * q;
            t = a.getTimeTicks(a.normalizeTimeTickInterval(z, b.units || I), Math.min(r, e[0]), Math.max(d, e[e.length - 1]), a.options.startOfWeek, e, this.closestPointRange);
            e = h.groupData.apply(this, [e, l, t, b.approximation]);
            l = e[0];
            q = e[1];
            if (b.smoothed && l.length) {
              b = l.length - 1;
              for (l[b] = Math.min(l[b], d); b-- && 0 < b; )
                l[b] += z / 2;
              l[0] = Math.max(l[0], r);
            }
            r = t.info;
            this.closestPointRange = t.info.totalRange;
            this.groupMap = e[2];
            m(l[0]) && l[0] < a.dataMin && c && (a.min === a.dataMin && (a.min = l[0]), a.dataMin = l[0]);
            this.processedXData = l;
            this.processedYData = q;
          } else
            this.groupMap = null;
          this.hasGroupedData = k;
          this.currentDataGrouping = r;
          this.preventGraphAnimation = (g && g.totalRange) !== (r && r.totalRange);
        }
      };
      h.destroyGroupedData = function() {
        var a = this.groupedData;
        g(a || [], function(b, d) {
          b && (a[d] = b.destroy ? b.destroy() : null);
        });
        this.groupedData = null;
      };
      h.generatePoints = function() {
        B.apply(this);
        this.destroyGroupedData();
        this.groupedData = this.hasGroupedData ? this.points : null;
      };
      a.addEvent(c.prototype, "update", function() {
        if (this.dataGroup)
          return a.error(24), !1;
      });
      b(A.prototype, "tooltipFooterHeaderFormatter", function(a, b, d) {
        var c = this.chart.time,
            k = b.series,
            f = k.tooltipOptions,
            g = k.options.dataGrouping,
            e = f.xDateFormat,
            l,
            h = k.xAxis;
        return h && "datetime" === h.options.type && g && w(b.key) ? (a = k.currentDataGrouping, g = g.dateTimeLabelFormats, a ? (h = g[a.unitName], 1 === a.count ? e = h[0] : (e = h[1], l = h[2])) : !e && g && (e = this.getXDateFormat(b, f, h)), e = c.dateFormat(e, b.key), l && (e += c.dateFormat(l, b.key + a.totalRange - 1)), y(f[(d ? "footer" : "header") + "Format"], {
          point: t(b.point, {key: e}),
          series: k
        }, c)) : a.call(this, b, d);
      });
      a.addEvent(h, "destroy", h.destroyGroupedData);
      b(h, "setOptions", function(a, b) {
        a = a.call(this, b);
        var c = this.type,
            f = this.chart.options.plotOptions,
            k = v[c].dataGrouping;
        C[c] && (k || (k = r(d, C[c])), a.dataGrouping = r(k, f.series && f.series.dataGrouping, f[c].dataGrouping, b.dataGrouping));
        this.chart.options.isStock && (this.requireSorting = !0);
        return a;
      });
      a.addEvent(G.prototype, "afterSetScale", function() {
        g(this.series, function(a) {
          a.hasProcessed = !1;
        });
      });
      G.prototype.getGroupPixelWidth = function() {
        var a = this.series,
            b = a.length,
            d,
            c = 0,
            k = !1,
            f;
        for (d = b; d--; )
          (f = a[d].options.dataGrouping) && (c = Math.max(c, f.groupPixelWidth));
        for (d = b; d--; )
          (f = a[d].options.dataGrouping) && a[d].hasProcessed && (b = (a[d].processedXData || a[d].data).length, a[d].groupPixelWidth || b > this.chart.plotSizeX / c || b && f.forced) && (k = !0);
        return k ? c : 0;
      };
      G.prototype.setDataGrouping = function(a, b) {
        var d;
        b = f(b, !0);
        a || (a = {
          forced: !1,
          units: null
        });
        if (this instanceof G)
          for (d = this.series.length; d--; )
            this.series[d].update({dataGrouping: a}, !1);
        else
          g(this.chart.options.series, function(b) {
            b.dataGrouping = a;
          }, !1);
        b && this.chart.redraw();
      };
    })(K);
    (function(a) {
      var D = a.each,
          F = a.Point,
          G = a.seriesType,
          v = a.seriesTypes;
      G("ohlc", "column", {
        lineWidth: 1,
        tooltip: {pointFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eOpen: {point.open}\x3cbr/\x3eHigh: {point.high}\x3cbr/\x3eLow: {point.low}\x3cbr/\x3eClose: {point.close}\x3cbr/\x3e'},
        threshold: null,
        stickyTracking: !0
      }, {
        directTouch: !1,
        pointArrayMap: ["open", "high", "low", "close"],
        toYData: function(a) {
          return [a.open, a.high, a.low, a.close];
        },
        pointValKey: "close",
        translate: function() {
          var a = this,
              g = a.yAxis,
              t = !!a.modifyValue,
              y = ["plotOpen", "plotHigh", "plotLow", "plotClose", "yBottom"];
          v.column.prototype.translate.apply(a);
          D(a.points, function(m) {
            D([m.open, m.high, m.low, m.close, m.low], function(r, f) {
              null !== r && (t && (r = a.modifyValue(r)), m[y[f]] = g.toPixels(r, !0));
            });
            m.tooltipPos[1] = m.plotHigh + g.pos - a.chart.plotTop;
          });
        },
        drawPoints: function() {
          var a = this,
              g = a.chart;
          D(a.points, function(m) {
            var t,
                w,
                r,
                f,
                c = m.graphic,
                v,
                b = !c;
            void 0 !== m.plotY && (c || (m.graphic = c = g.renderer.path().add(a.group)), w = c.strokeWidth() % 2 / 2, v = Math.round(m.plotX) - w, r = Math.round(m.shapeArgs.width / 2), f = ["M", v, Math.round(m.yBottom), "L", v, Math.round(m.plotHigh)], null !== m.open && (t = Math.round(m.plotOpen) + w, f.push("M", v, t, "L", v - r, t)), null !== m.close && (t = Math.round(m.plotClose) + w, f.push("M", v, t, "L", v + r, t)), c[b ? "attr" : "animate"]({d: f}).addClass(m.getClassName(), !0));
          });
        },
        animate: null
      }, {getClassName: function() {
          return F.prototype.getClassName.call(this) + (this.open < this.close ? " highcharts-point-up" : " highcharts-point-down");
        }});
    })(K);
    (function(a) {
      var D = a.defaultPlotOptions,
          F = a.each,
          G = a.merge;
      a = a.seriesType;
      a("candlestick", "ohlc", G(D.column, {
        states: {hover: {lineWidth: 2}},
        tooltip: D.ohlc.tooltip,
        threshold: null,
        stickyTracking: !0
      }), {drawPoints: function() {
          var a = this,
              m = a.chart;
          F(a.points, function(g) {
            var t = g.graphic,
                v,
                w,
                r,
                f,
                c,
                A,
                b,
                h = !t;
            void 0 !== g.plotY && (t || (g.graphic = t = m.renderer.path().add(a.group)), c = t.strokeWidth() % 2 / 2, A = Math.round(g.plotX) - c, v = g.plotOpen, w = g.plotClose, r = Math.min(v, w), v = Math.max(v, w), b = Math.round(g.shapeArgs.width / 2), w = Math.round(r) !== Math.round(g.plotHigh), f = v !== g.yBottom, r = Math.round(r) + c, v = Math.round(v) + c, c = [], c.push("M", A - b, v, "L", A - b, r, "L", A + b, r, "L", A + b, v, "Z", "M", A, r, "L", A, w ? Math.round(g.plotHigh) : r, "M", A, v, "L", A, f ? Math.round(g.yBottom) : v), t[h ? "attr" : "animate"]({d: c}).addClass(g.getClassName(), !0));
          });
        }});
    })(K);
    Z = function(a) {
      var D = a.each,
          F = a.seriesTypes,
          G = a.stableSort;
      return {
        getPlotBox: function() {
          return a.Series.prototype.getPlotBox.call(this.options.onSeries && this.chart.get(this.options.onSeries) || this);
        },
        translate: function() {
          F.column.prototype.translate.apply(this);
          var a = this.options,
              m = this.chart,
              g = this.points,
              t = g.length - 1,
              y,
              w,
              r = a.onSeries;
          y = r && m.get(r);
          var a = a.onKey || "y",
              r = y && y.options.step,
              f = y && y.points,
              c = f && f.length,
              A = this.xAxis,
              b = this.yAxis,
              h = 0,
              n,
              B,
              d,
              C;
          if (y && y.visible && c)
            for (h = (y.pointXOffset || 0) + (y.barW || 0) / 2, y = y.currentDataGrouping, B = f[c - 1].x + (y ? y.totalRange : 0), G(g, function(a, b) {
              return a.x - b.x;
            }), a = "plot" + a[0].toUpperCase() + a.substr(1); c-- && g[t] && !(n = f[c], y = g[t], y.y = n.y, n.x <= y.x && void 0 !== n[a] && (y.x <= B && (y.plotY = n[a], n.x < y.x && !r && (d = f[c + 1]) && void 0 !== d[a] && (C = (y.x - n.x) / (d.x - n.x), y.plotY += C * (d[a] - n[a]), y.y += C * (d.y - n.y))), t--, c++, 0 > t)); )
              ;
          D(g, function(a, d) {
            var c;
            a.plotX += h;
            void 0 === a.plotY && (0 <= a.plotX && a.plotX <= A.len ? a.plotY = m.chartHeight - A.bottom - (A.opposite ? A.height : 0) + A.offset - b.top : a.shapeArgs = {});
            (w = g[d - 1]) && w.plotX === a.plotX && (void 0 === w.stackIndex && (w.stackIndex = 0), c = w.stackIndex + 1);
            a.stackIndex = c;
          });
        }
      };
    }(K);
    (function(a, D) {
      function F(a) {
        y[a + "pin"] = function(g, f, c, m, b) {
          var h = b && b.anchorX;
          b = b && b.anchorY;
          "circle" === a && m > c && (g -= Math.round((m - c) / 2), c = m);
          g = y[a](g, f, c, m);
          h && b && (g.push("M", "circle" === a ? g[1] - g[4] : g[1] + g[4] / 2, f > b ? f : f + m, "L", h, b), g = g.concat(y.circle(h - 1, b - 1, 2, 2)));
          return g;
        };
      }
      var G = a.addEvent,
          v = a.each,
          m = a.noop,
          g = a.seriesType,
          t = a.TrackerMixin,
          y = a.SVGRenderer.prototype.symbols;
      g("flags", "column", {
        pointRange: 0,
        allowOverlapX: !1,
        shape: "flag",
        stackDistance: 12,
        textAlign: "center",
        tooltip: {pointFormat: "{point.text}\x3cbr/\x3e"},
        threshold: null,
        y: -30
      }, {
        sorted: !1,
        noSharedTooltip: !0,
        allowDG: !1,
        takeOrdinalPosition: !1,
        trackerGroups: ["markerGroup"],
        forceCrop: !0,
        init: a.Series.prototype.init,
        translate: D.translate,
        getPlotBox: D.getPlotBox,
        drawPoints: function() {
          var g = this.points,
              m = this.chart,
              f = m.renderer,
              c,
              t,
              b = this.options,
              h = b.y,
              n,
              y,
              d,
              C,
              I,
              z,
              u = this.yAxis,
              x = {},
              p = [];
          for (y = g.length; y--; )
            d = g[y], z = d.plotX > this.xAxis.len, c = d.plotX, C = d.stackIndex, n = d.options.shape || b.shape, t = d.plotY, void 0 !== t && (t = d.plotY + h - (void 0 !== C && C * b.stackDistance)), d.anchorX = C ? void 0 : d.plotX, I = C ? void 0 : d.plotY, C = d.graphic, void 0 !== t && 0 <= c && !z ? (C || (C = d.graphic = f.label("", null, null, n, null, null, b.useHTML).attr({
              align: "flag" === n ? "left" : "center",
              width: b.width,
              height: b.height,
              "text-align": b.textAlign
            }).addClass("highcharts-point").add(this.markerGroup), d.graphic.div && (d.graphic.div.point = d), C.isNew = !0), 0 < c && (c -= C.strokeWidth() % 2), n = {
              y: t,
              anchorY: I
            }, b.allowOverlapX && (n.x = c, n.anchorX = d.anchorX), C.attr({text: d.options.title || b.title || "A"})[C.isNew ? "attr" : "animate"](n), b.allowOverlapX || (x[d.plotX] ? x[d.plotX].size = Math.max(x[d.plotX].size, C.width) : x[d.plotX] = {
              align: 0,
              size: C.width,
              target: c,
              anchorX: c
            }), d.tooltipPos = m.inverted ? [u.len + u.pos - m.plotLeft - t, this.xAxis.len - c] : [c, t + u.pos - m.plotTop]) : C && (d.graphic = C.destroy());
          b.allowOverlapX || (a.objectEach(x, function(a) {
            a.plotX = a.anchorX;
            p.push(a);
          }), a.distribute(p, this.xAxis.len), v(g, function(a) {
            var b = a.graphic && x[a.plotX];
            b && (a.graphic[a.graphic.isNew ? "attr" : "animate"]({
              x: b.pos,
              anchorX: a.anchorX
            }), a.graphic.isNew = !1);
          }));
          b.useHTML && a.wrap(this.markerGroup, "on", function(b) {
            return a.SVGElement.prototype.on.apply(b.apply(this, [].slice.call(arguments, 1)), [].slice.call(arguments, 1));
          });
        },
        drawTracker: function() {
          var a = this.points;
          t.drawTrackerPoint.apply(this);
          v(a, function(g) {
            var f = g.graphic;
            f && G(f.element, "mouseover", function() {
              0 < g.stackIndex && !g.raised && (g._y = f.y, f.attr({y: g._y - 8}), g.raised = !0);
              v(a, function(a) {
                a !== g && a.raised && a.graphic && (a.graphic.attr({y: a._y}), a.raised = !1);
              });
            });
          });
        },
        animate: m,
        buildKDTree: m,
        setClip: m
      });
      y.flag = function(a, g, f, c, m) {
        var b = m && m.anchorX || a;
        m = m && m.anchorY || g;
        return y.circle(b - 1, m - 1, 2, 2).concat(["M", b, m, "L", a, g + c, a, g, a + f, g, a + f, g + c, a, g + c, "Z"]);
      };
      F("circle");
      F("square");
    })(K, Z);
    (function(a) {
      function D(a, b, c) {
        this.init(a, b, c);
      }
      var F = a.addEvent,
          G = a.Axis,
          v = a.correctFloat,
          m = a.defaultOptions,
          g = a.defined,
          t = a.destroyObjectProperties,
          y = a.each,
          w = a.fireEvent,
          r = a.hasTouch,
          f = a.isTouchDevice,
          c = a.merge,
          A = a.pick,
          b = a.removeEvent,
          h = a.wrap,
          n,
          B = {
            height: f ? 20 : 14,
            barBorderRadius: 0,
            buttonBorderRadius: 0,
            liveRedraw: a.svg && !f,
            margin: 10,
            minWidth: 6,
            step: .2,
            zIndex: 3
          };
      m.scrollbar = c(!0, B, m.scrollbar);
      a.swapXY = n = function(a, b) {
        var d = a.length,
            c;
        if (b)
          for (b = 0; b < d; b += 3)
            c = a[b + 1], a[b + 1] = a[b + 2], a[b + 2] = c;
        return a;
      };
      D.prototype = {
        init: function(a, b, g) {
          this.scrollbarButtons = [];
          this.renderer = a;
          this.userOptions = b;
          this.options = c(B, b);
          this.chart = g;
          this.size = A(this.options.size, this.options.height);
          b.enabled && (this.render(), this.initEvents(), this.addEvents());
        },
        render: function() {
          var a = this.renderer,
              b = this.options,
              c = this.size,
              g;
          this.group = g = a.g("scrollbar").attr({
            zIndex: b.zIndex,
            translateY: -99999
          }).add();
          this.track = a.rect().addClass("highcharts-scrollbar-track").attr({
            x: 0,
            r: b.trackBorderRadius || 0,
            height: c,
            width: c
          }).add(g);
          this.trackBorderWidth = this.track.strokeWidth();
          this.track.attr({y: -this.trackBorderWidth % 2 / 2});
          this.scrollbarGroup = a.g().add(g);
          this.scrollbar = a.rect().addClass("highcharts-scrollbar-thumb").attr({
            height: c,
            width: c,
            r: b.barBorderRadius || 0
          }).add(this.scrollbarGroup);
          this.scrollbarRifles = a.path(n(["M", -3, c / 4, "L", -3, 2 * c / 3, "M", 0, c / 4, "L", 0, 2 * c / 3, "M", 3, c / 4, "L", 3, 2 * c / 3], b.vertical)).addClass("highcharts-scrollbar-rifles").add(this.scrollbarGroup);
          this.scrollbarStrokeWidth = this.scrollbar.strokeWidth();
          this.scrollbarGroup.translate(-this.scrollbarStrokeWidth % 2 / 2, -this.scrollbarStrokeWidth % 2 / 2);
          this.drawScrollbarButton(0);
          this.drawScrollbarButton(1);
        },
        position: function(a, b, c, g) {
          var d = this.options.vertical,
              f = 0,
              h = this.rendered ? "animate" : "attr";
          this.x = a;
          this.y = b + this.trackBorderWidth;
          this.width = c;
          this.xOffset = this.height = g;
          this.yOffset = f;
          d ? (this.width = this.yOffset = c = f = this.size, this.xOffset = b = 0, this.barWidth = g - 2 * c, this.x = a += this.options.margin) : (this.height = this.xOffset = g = b = this.size, this.barWidth = c - 2 * g, this.y += this.options.margin);
          this.group[h]({
            translateX: a,
            translateY: this.y
          });
          this.track[h]({
            width: c,
            height: g
          });
          this.scrollbarButtons[1][h]({
            translateX: d ? 0 : c - b,
            translateY: d ? g - f : 0
          });
        },
        drawScrollbarButton: function(a) {
          var b = this.renderer,
              d = this.scrollbarButtons,
              c = this.options,
              g = this.size,
              f;
          f = b.g().add(this.group);
          d.push(f);
          f = b.rect().addClass("highcharts-scrollbar-button").add(f);
          f.attr(f.crisp({
            x: -.5,
            y: -.5,
            width: g + 1,
            height: g + 1,
            r: c.buttonBorderRadius
          }, f.strokeWidth()));
          b.path(n(["M", g / 2 + (a ? -1 : 1), g / 2 - 3, "L", g / 2 + (a ? -1 : 1), g / 2 + 3, "L", g / 2 + (a ? 2 : -2), g / 2], c.vertical)).addClass("highcharts-scrollbar-arrow").add(d[a]);
        },
        setRange: function(a, b) {
          var c = this.options,
              d = c.vertical,
              f = c.minWidth,
              h = this.barWidth,
              p,
              m,
              k = this.rendered && !this.hasDragged ? "animate" : "attr";
          g(h) && (a = Math.max(a, 0), p = Math.ceil(h * a), this.calculatedWidth = m = v(h * Math.min(b, 1) - p), m < f && (p = (h - f + m) * a, m = f), f = Math.floor(p + this.xOffset + this.yOffset), h = m / 2 - .5, this.from = a, this.to = b, d ? (this.scrollbarGroup[k]({translateY: f}), this.scrollbar[k]({height: m}), this.scrollbarRifles[k]({translateY: h}), this.scrollbarTop = f, this.scrollbarLeft = 0) : (this.scrollbarGroup[k]({translateX: f}), this.scrollbar[k]({width: m}), this.scrollbarRifles[k]({translateX: h}), this.scrollbarLeft = f, this.scrollbarTop = 0), 12 >= m ? this.scrollbarRifles.hide() : this.scrollbarRifles.show(!0), !1 === c.showFull && (0 >= a && 1 <= b ? this.group.hide() : this.group.show()), this.rendered = !0);
        },
        initEvents: function() {
          var a = this;
          a.mouseMoveHandler = function(b) {
            var c = a.chart.pointer.normalize(b),
                d = a.options.vertical ? "chartY" : "chartX",
                g = a.initPositions;
            !a.grabbedCenter || b.touches && 0 === b.touches[0][d] || (c = a.cursorToScrollbarPosition(c)[d], d = a[d], d = c - d, a.hasDragged = !0, a.updatePosition(g[0] + d, g[1] + d), a.hasDragged && w(a, "changed", {
              from: a.from,
              to: a.to,
              trigger: "scrollbar",
              DOMType: b.type,
              DOMEvent: b
            }));
          };
          a.mouseUpHandler = function(b) {
            a.hasDragged && w(a, "changed", {
              from: a.from,
              to: a.to,
              trigger: "scrollbar",
              DOMType: b.type,
              DOMEvent: b
            });
            a.grabbedCenter = a.hasDragged = a.chartX = a.chartY = null;
          };
          a.mouseDownHandler = function(b) {
            b = a.chart.pointer.normalize(b);
            b = a.cursorToScrollbarPosition(b);
            a.chartX = b.chartX;
            a.chartY = b.chartY;
            a.initPositions = [a.from, a.to];
            a.grabbedCenter = !0;
          };
          a.buttonToMinClick = function(b) {
            var c = v(a.to - a.from) * a.options.step;
            a.updatePosition(v(a.from - c), v(a.to - c));
            w(a, "changed", {
              from: a.from,
              to: a.to,
              trigger: "scrollbar",
              DOMEvent: b
            });
          };
          a.buttonToMaxClick = function(b) {
            var c = (a.to - a.from) * a.options.step;
            a.updatePosition(a.from + c, a.to + c);
            w(a, "changed", {
              from: a.from,
              to: a.to,
              trigger: "scrollbar",
              DOMEvent: b
            });
          };
          a.trackClick = function(b) {
            var c = a.chart.pointer.normalize(b),
                d = a.to - a.from,
                g = a.y + a.scrollbarTop,
                f = a.x + a.scrollbarLeft;
            a.options.vertical && c.chartY > g || !a.options.vertical && c.chartX > f ? a.updatePosition(a.from + d, a.to + d) : a.updatePosition(a.from - d, a.to - d);
            w(a, "changed", {
              from: a.from,
              to: a.to,
              trigger: "scrollbar",
              DOMEvent: b
            });
          };
        },
        cursorToScrollbarPosition: function(a) {
          var b = this.options,
              b = b.minWidth > this.calculatedWidth ? b.minWidth : 0;
          return {
            chartX: (a.chartX - this.x - this.xOffset) / (this.barWidth - b),
            chartY: (a.chartY - this.y - this.yOffset) / (this.barWidth - b)
          };
        },
        updatePosition: function(a, b) {
          1 < b && (a = v(1 - v(b - a)), b = 1);
          0 > a && (b = v(b - a), a = 0);
          this.from = a;
          this.to = b;
        },
        update: function(a) {
          this.destroy();
          this.init(this.chart.renderer, c(!0, this.options, a), this.chart);
        },
        addEvents: function() {
          var a = this.options.inverted ? [1, 0] : [0, 1],
              b = this.scrollbarButtons,
              c = this.scrollbarGroup.element,
              g = this.mouseDownHandler,
              f = this.mouseMoveHandler,
              h = this.mouseUpHandler,
              a = [[b[a[0]].element, "click", this.buttonToMinClick], [b[a[1]].element, "click", this.buttonToMaxClick], [this.track.element, "click", this.trackClick], [c, "mousedown", g], [c.ownerDocument, "mousemove", f], [c.ownerDocument, "mouseup", h]];
          r && a.push([c, "touchstart", g], [c.ownerDocument, "touchmove", f], [c.ownerDocument, "touchend", h]);
          y(a, function(a) {
            F.apply(null, a);
          });
          this._events = a;
        },
        removeEvents: function() {
          y(this._events, function(a) {
            b.apply(null, a);
          });
          this._events.length = 0;
        },
        destroy: function() {
          var a = this.chart.scroller;
          this.removeEvents();
          y(["track", "scrollbarRifles", "scrollbar", "scrollbarGroup", "group"], function(a) {
            this[a] && this[a].destroy && (this[a] = this[a].destroy());
          }, this);
          a && this === a.scrollbar && (a.scrollbar = null, t(a.scrollbarButtons));
        }
      };
      h(G.prototype, "init", function(a) {
        var b = this;
        a.apply(b, Array.prototype.slice.call(arguments, 1));
        b.options.scrollbar && b.options.scrollbar.enabled && (b.options.scrollbar.vertical = !b.horiz, b.options.startOnTick = b.options.endOnTick = !1, b.scrollbar = new D(b.chart.renderer, b.options.scrollbar, b.chart), F(b.scrollbar, "changed", function(a) {
          var c = Math.min(A(b.options.min, b.min), b.min, b.dataMin),
              d = Math.max(A(b.options.max, b.max), b.max, b.dataMax) - c,
              g;
          b.horiz && !b.reversed || !b.horiz && b.reversed ? (g = c + d * this.to, c += d * this.from) : (g = c + d * (1 - this.from), c += d * (1 - this.to));
          b.setExtremes(c, g, !0, !1, a);
        }));
      });
      h(G.prototype, "render", function(a) {
        var b = Math.min(A(this.options.min, this.min), this.min, A(this.dataMin, this.min)),
            c = Math.max(A(this.options.max, this.max), this.max, A(this.dataMax, this.max)),
            d = this.scrollbar,
            f = this.titleOffset || 0;
        a.apply(this, Array.prototype.slice.call(arguments, 1));
        if (d) {
          this.horiz ? (d.position(this.left, this.top + this.height + 2 + this.chart.scrollbarsOffsets[1] + (this.opposite ? 0 : f + this.axisTitleMargin + this.offset), this.width, this.height), f = 1) : (d.position(this.left + this.width + 2 + this.chart.scrollbarsOffsets[0] + (this.opposite ? f + this.axisTitleMargin + this.offset : 0), this.top, this.width, this.height), f = 0);
          if (!this.opposite && !this.horiz || this.opposite && this.horiz)
            this.chart.scrollbarsOffsets[f] += this.scrollbar.size + this.scrollbar.options.margin;
          isNaN(b) || isNaN(c) || !g(this.min) || !g(this.max) ? d.setRange(0, 0) : (f = (this.min - b) / (c - b), b = (this.max - b) / (c - b), this.horiz && !this.reversed || !this.horiz && this.reversed ? d.setRange(f, b) : d.setRange(1 - b, 1 - f));
        }
      });
      h(G.prototype, "getOffset", function(a) {
        var b = this.horiz ? 2 : 1,
            c = this.scrollbar;
        a.apply(this, Array.prototype.slice.call(arguments, 1));
        c && (this.chart.scrollbarsOffsets = [0, 0], this.chart.axisOffset[b] += c.size + c.options.margin);
      });
      h(G.prototype, "destroy", function(a) {
        this.scrollbar && (this.scrollbar = this.scrollbar.destroy());
        a.apply(this, Array.prototype.slice.call(arguments, 1));
      });
      a.Scrollbar = D;
    })(K);
    (function(a) {
      function D(a) {
        this.init(a);
      }
      var F = a.addEvent,
          G = a.Axis,
          v = a.Chart,
          m = a.defaultOptions,
          g = a.defined,
          t = a.destroyObjectProperties,
          y = a.each,
          w = a.erase,
          r = a.error,
          f = a.extend,
          c = a.grep,
          A = a.hasTouch,
          b = a.isArray,
          h = a.isNumber,
          n = a.isObject,
          B = a.merge,
          d = a.pick,
          C = a.removeEvent,
          I = a.Scrollbar,
          z = a.Series,
          u = a.seriesTypes,
          x = a.wrap,
          p = [].concat(a.defaultDataGroupingUnits),
          H = function(a) {
            var b = c(arguments, h);
            if (b.length)
              return Math[a].apply(0, b);
          };
      p[4] = ["day", [1, 2, 3, 4]];
      p[5] = ["week", [1, 2, 3]];
      f(m, {navigator: {
          height: 40,
          margin: 25,
          maskInside: !0,
          handles: {
            width: 7,
            height: 15,
            symbols: ["navigator-handle", "navigator-handle"],
            enabled: !0
          },
          series: {
            type: void 0 === u.areaspline ? "line" : "areaspline",
            compare: null,
            dataGrouping: {
              approximation: "average",
              enabled: !0,
              groupPixelWidth: 2,
              smoothed: !0,
              units: p
            },
            dataLabels: {
              enabled: !1,
              zIndex: 2
            },
            id: "highcharts-navigator-series",
            className: "highcharts-navigator-series",
            lineColor: null,
            marker: {enabled: !1},
            pointRange: 0,
            threshold: null
          },
          xAxis: {
            overscroll: 0,
            className: "highcharts-navigator-xaxis",
            tickLength: 0,
            tickPixelInterval: 200,
            labels: {
              align: "left",
              x: 3,
              y: -4
            },
            crosshair: !1
          },
          yAxis: {
            className: "highcharts-navigator-yaxis",
            startOnTick: !1,
            endOnTick: !1,
            minPadding: .1,
            maxPadding: .1,
            labels: {enabled: !1},
            crosshair: !1,
            title: {text: null},
            tickLength: 0,
            tickWidth: 0
          }
        }});
      a.Renderer.prototype.symbols["navigator-handle"] = function(a, b, c, e, d) {
        a = d.width / 2;
        b = Math.round(a / 3) + .5;
        d = d.height;
        return ["M", -a - 1, .5, "L", a, .5, "L", a, d + .5, "L", -a - 1, d + .5, "L", -a - 1, .5, "M", -b, 4, "L", -b, d - 3, "M", b - 1, 4, "L", b - 1, d - 3];
      };
      D.prototype = {
        drawHandle: function(a, b, c, e) {
          var d = this.navigatorOptions.handles.height;
          this.handles[b][e](c ? {
            translateX: Math.round(this.left + this.height / 2),
            translateY: Math.round(this.top + parseInt(a, 10) + .5 - d)
          } : {
            translateX: Math.round(this.left + parseInt(a, 10)),
            translateY: Math.round(this.top + this.height / 2 - d / 2 - 1)
          });
        },
        drawOutline: function(a, b, c, d) {
          var e = this.navigatorOptions.maskInside,
              k = this.outline.strokeWidth(),
              g = k / 2,
              k = k % 2 / 2,
              f = this.outlineHeight,
              h = this.scrollbarHeight,
              p = this.size,
              m = this.left - h,
              n = this.top;
          c ? (m -= g, c = n + b + k, b = n + a + k, a = ["M", m + f, n - h - k, "L", m + f, c, "L", m, c, "L", m, b, "L", m + f, b, "L", m + f, n + p + h].concat(e ? ["M", m + f, c - g, "L", m + f, b + g] : [])) : (a += m + h - k, b += m + h - k, n += g, a = ["M", m, n, "L", a, n, "L", a, n + f, "L", b, n + f, "L", b, n, "L", m + p + 2 * h, n].concat(e ? ["M", a - g, n, "L", b + g, n] : []));
          this.outline[d]({d: a});
        },
        drawMasks: function(a, b, c, d) {
          var e = this.left,
              k = this.top,
              g = this.height,
              f,
              h,
              p,
              m;
          c ? (p = [e, e, e], m = [k, k + a, k + b], h = [g, g, g], f = [a, b - a, this.size - b]) : (p = [e, e + a, e + b], m = [k, k, k], h = [a, b - a, this.size - b], f = [g, g, g]);
          y(this.shades, function(a, b) {
            a[d]({
              x: p[b],
              y: m[b],
              width: h[b],
              height: f[b]
            });
          });
        },
        renderElements: function() {
          var a = this,
              b = a.navigatorOptions,
              c = b.maskInside,
              d = a.chart,
              g = d.renderer,
              f;
          a.navigatorGroup = f = g.g("navigator").attr({
            zIndex: 8,
            visibility: "hidden"
          }).add();
          y([!c, c, !c], function(b, c) {
            a.shades[c] = g.rect().addClass("highcharts-navigator-mask" + (1 === c ? "-inside" : "-outside")).add(f);
          });
          a.outline = g.path().addClass("highcharts-navigator-outline").add(f);
          b.handles.enabled && y([0, 1], function(c) {
            b.handles.inverted = d.inverted;
            a.handles[c] = g.symbol(b.handles.symbols[c], -b.handles.width / 2 - 1, 0, b.handles.width, b.handles.height, b.handles);
            a.handles[c].attr({zIndex: 7 - c}).addClass("highcharts-navigator-handle highcharts-navigator-handle-" + ["left", "right"][c]).add(f);
          });
        },
        update: function(a) {
          y(this.series || [], function(a) {
            a.baseSeries && delete a.baseSeries.navigatorSeries;
          });
          this.destroy();
          B(!0, this.chart.options.navigator, this.options, a);
          this.init(this.chart);
        },
        render: function(b, c, f, e) {
          var k = this.chart,
              p,
              q,
              m = this.scrollbarHeight,
              n,
              u = this.xAxis;
          p = u.fake ? k.xAxis[0] : u;
          var r = this.navigatorEnabled,
              t,
              x = this.rendered;
          q = k.inverted;
          var v,
              w = k.xAxis[0].minRange,
              z = k.xAxis[0].options.maxRange;
          if (!this.hasDragged || g(f)) {
            if (!h(b) || !h(c))
              if (x)
                f = 0, e = d(u.width, p.width);
              else
                return;
            this.left = d(u.left, k.plotLeft + m + (q ? k.plotWidth : 0));
            this.size = t = n = d(u.len, (q ? k.plotHeight : k.plotWidth) - 2 * m);
            k = q ? m : n + 2 * m;
            f = d(f, u.toPixels(b, !0));
            e = d(e, u.toPixels(c, !0));
            h(f) && Infinity !== Math.abs(f) || (f = 0, e = k);
            b = u.toValue(f, !0);
            c = u.toValue(e, !0);
            v = Math.abs(a.correctFloat(c - b));
            v < w ? this.grabbedLeft ? f = u.toPixels(c - w, !0) : this.grabbedRight && (e = u.toPixels(b + w, !0)) : g(z) && v > z && (this.grabbedLeft ? f = u.toPixels(c - z, !0) : this.grabbedRight && (e = u.toPixels(b + z, !0)));
            this.zoomedMax = Math.min(Math.max(f, e, 0), t);
            this.zoomedMin = Math.min(Math.max(this.fixedWidth ? this.zoomedMax - this.fixedWidth : Math.min(f, e), 0), t);
            this.range = this.zoomedMax - this.zoomedMin;
            t = Math.round(this.zoomedMax);
            f = Math.round(this.zoomedMin);
            r && (this.navigatorGroup.attr({visibility: "visible"}), x = x && !this.hasDragged ? "animate" : "attr", this.drawMasks(f, t, q, x), this.drawOutline(f, t, q, x), this.navigatorOptions.handles.enabled && (this.drawHandle(f, 0, q, x), this.drawHandle(t, 1, q, x)));
            this.scrollbar && (q ? (q = this.top - m, p = this.left - m + (r || !p.opposite ? 0 : (p.titleOffset || 0) + p.axisTitleMargin), m = n + 2 * m) : (q = this.top + (r ? this.height : -m), p = this.left - m), this.scrollbar.position(p, q, k, m), this.scrollbar.setRange(this.zoomedMin / n, this.zoomedMax / n));
            this.rendered = !0;
          }
        },
        addMouseEvents: function() {
          var a = this,
              b = a.chart,
              c = b.container,
              d = [],
              f,
              g;
          a.mouseMoveHandler = f = function(b) {
            a.onMouseMove(b);
          };
          a.mouseUpHandler = g = function(b) {
            a.onMouseUp(b);
          };
          d = a.getPartsEvents("mousedown");
          d.push(F(c, "mousemove", f), F(c.ownerDocument, "mouseup", g));
          A && (d.push(F(c, "touchmove", f), F(c.ownerDocument, "touchend", g)), d.concat(a.getPartsEvents("touchstart")));
          a.eventsToUnbind = d;
          a.series && a.series[0] && d.push(F(a.series[0].xAxis, "foundExtremes", function() {
            b.navigator.modifyNavigatorAxisExtremes();
          }));
        },
        getPartsEvents: function(a) {
          var b = this,
              c = [];
          y(["shades", "handles"], function(d) {
            y(b[d], function(e, k) {
              c.push(F(e.element, a, function(a) {
                b[d + "Mousedown"](a, k);
              }));
            });
          });
          return c;
        },
        shadesMousedown: function(a, b) {
          a = this.chart.pointer.normalize(a);
          var c = this.chart,
              d = this.xAxis,
              f = this.zoomedMin,
              k = this.left,
              h = this.size,
              p = this.range,
              m = a.chartX,
              n,
              u;
          c.inverted && (m = a.chartY, k = this.top);
          1 === b ? (this.grabbedCenter = m, this.fixedWidth = p, this.dragOffset = m - f) : (a = m - k - p / 2, 0 === b ? a = Math.max(0, a) : 2 === b && a + p >= h && (a = h - p, d.reversed ? (a -= p, u = this.getUnionExtremes().dataMin) : n = this.getUnionExtremes().dataMax), a !== f && (this.fixedWidth = p, b = d.toFixedRange(a, a + p, u, n), g(b.min) && c.xAxis[0].setExtremes(Math.min(b.min, b.max), Math.max(b.min, b.max), !0, null, {trigger: "navigator"})));
        },
        handlesMousedown: function(a, b) {
          this.chart.pointer.normalize(a);
          a = this.chart;
          var c = a.xAxis[0],
              d = a.inverted && !c.reversed || !a.inverted && c.reversed;
          0 === b ? (this.grabbedLeft = !0, this.otherHandlePos = this.zoomedMax, this.fixedExtreme = d ? c.min : c.max) : (this.grabbedRight = !0, this.otherHandlePos = this.zoomedMin, this.fixedExtreme = d ? c.max : c.min);
          a.fixedRange = null;
        },
        onMouseMove: function(a) {
          var b = this,
              c = b.chart,
              d = b.left,
              f = b.navigatorSize,
              g = b.range,
              k = b.dragOffset,
              h = c.inverted;
          a.touches && 0 === a.touches[0].pageX || (a = c.pointer.normalize(a), c = a.chartX, h && (d = b.top, c = a.chartY), b.grabbedLeft ? (b.hasDragged = !0, b.render(0, 0, c - d, b.otherHandlePos)) : b.grabbedRight ? (b.hasDragged = !0, b.render(0, 0, b.otherHandlePos, c - d)) : b.grabbedCenter && (b.hasDragged = !0, c < k ? c = k : c > f + k - g && (c = f + k - g), b.render(0, 0, c - k, c - k + g)), b.hasDragged && b.scrollbar && b.scrollbar.options.liveRedraw && (a.DOMType = a.type, setTimeout(function() {
            b.onMouseUp(a);
          }, 0)));
        },
        onMouseUp: function(a) {
          var b = this.chart,
              c = this.xAxis,
              d = c && c.reversed,
              f = this.scrollbar,
              k,
              h,
              p = a.DOMEvent || a;
          (!this.hasDragged || f && f.hasDragged) && "scrollbar" !== a.trigger || (f = this.getUnionExtremes(), this.zoomedMin === this.otherHandlePos ? k = this.fixedExtreme : this.zoomedMax === this.otherHandlePos && (h = this.fixedExtreme), this.zoomedMax === this.size && (h = d ? f.dataMin : f.dataMax), 0 === this.zoomedMin && (k = d ? f.dataMax : f.dataMin), c = c.toFixedRange(this.zoomedMin, this.zoomedMax, k, h), g(c.min) && b.xAxis[0].setExtremes(Math.min(c.min, c.max), Math.max(c.min, c.max), !0, this.hasDragged ? !1 : null, {
            trigger: "navigator",
            triggerOp: "navigator-drag",
            DOMEvent: p
          }));
          "mousemove" !== a.DOMType && (this.grabbedLeft = this.grabbedRight = this.grabbedCenter = this.fixedWidth = this.fixedExtreme = this.otherHandlePos = this.hasDragged = this.dragOffset = null);
        },
        removeEvents: function() {
          this.eventsToUnbind && (y(this.eventsToUnbind, function(a) {
            a();
          }), this.eventsToUnbind = void 0);
          this.removeBaseSeriesEvents();
        },
        removeBaseSeriesEvents: function() {
          var a = this.baseSeries || [];
          this.navigatorEnabled && a[0] && (!1 !== this.navigatorOptions.adaptToUpdatedData && y(a, function(a) {
            C(a, "updatedData", this.updatedDataHandler);
          }, this), a[0].xAxis && C(a[0].xAxis, "foundExtremes", this.modifyBaseAxisExtremes));
        },
        init: function(a) {
          var b = a.options,
              c = b.navigator,
              e = c.enabled,
              f = b.scrollbar,
              g = f.enabled,
              b = e ? c.height : 0,
              k = g ? f.height : 0;
          this.handles = [];
          this.shades = [];
          this.chart = a;
          this.setBaseSeries();
          this.height = b;
          this.scrollbarHeight = k;
          this.scrollbarEnabled = g;
          this.navigatorEnabled = e;
          this.navigatorOptions = c;
          this.scrollbarOptions = f;
          this.outlineHeight = b + k;
          this.opposite = d(c.opposite, !e && a.inverted);
          var h = this,
              f = h.baseSeries,
              g = a.xAxis.length,
              p = a.yAxis.length,
              m = f && f[0] && f[0].xAxis || a.xAxis[0];
          a.extraMargin = {
            type: h.opposite ? "plotTop" : "marginBottom",
            value: (e || !a.inverted ? h.outlineHeight : 0) + c.margin
          };
          a.inverted && (a.extraMargin.type = h.opposite ? "marginRight" : "plotLeft");
          a.isDirtyBox = !0;
          h.navigatorEnabled ? (h.xAxis = new G(a, B({
            breaks: m.options.breaks,
            ordinal: m.options.ordinal
          }, c.xAxis, {
            id: "navigator-x-axis",
            yAxis: "navigator-y-axis",
            isX: !0,
            type: "datetime",
            index: g,
            offset: 0,
            keepOrdinalPadding: !0,
            startOnTick: !1,
            endOnTick: !1,
            minPadding: 0,
            maxPadding: 0,
            zoomEnabled: !1
          }, a.inverted ? {
            offsets: [k, 0, -k, 0],
            width: b
          } : {
            offsets: [0, -k, 0, k],
            height: b
          })), h.yAxis = new G(a, B(c.yAxis, {
            id: "navigator-y-axis",
            alignTicks: !1,
            offset: 0,
            index: p,
            zoomEnabled: !1
          }, a.inverted ? {width: b} : {height: b})), f || c.series.data ? h.updateNavigatorSeries() : 0 === a.series.length && x(a, "redraw", function(b, c) {
            0 < a.series.length && !h.series && (h.setBaseSeries(), a.redraw = b);
            b.call(a, c);
          }), h.renderElements(), h.addMouseEvents()) : h.xAxis = {
            translate: function(b, c) {
              var d = a.xAxis[0],
                  e = d.getExtremes(),
                  f = d.len - 2 * k,
                  g = H("min", d.options.min, e.dataMin),
                  d = H("max", d.options.max, e.dataMax) - g;
              return c ? b * d / f + g : f * (b - g) / d;
            },
            toPixels: function(a) {
              return this.translate(a);
            },
            toValue: function(a) {
              return this.translate(a, !0);
            },
            toFixedRange: G.prototype.toFixedRange,
            fake: !0
          };
          a.options.scrollbar.enabled && (a.scrollbar = h.scrollbar = new I(a.renderer, B(a.options.scrollbar, {
            margin: h.navigatorEnabled ? 0 : 10,
            vertical: a.inverted
          }), a), F(h.scrollbar, "changed", function(b) {
            var c = h.size,
                d = c * this.to,
                c = c * this.from;
            h.hasDragged = h.scrollbar.hasDragged;
            h.render(0, 0, c, d);
            (a.options.scrollbar.liveRedraw || "mousemove" !== b.DOMType && "touchmove" !== b.DOMType) && setTimeout(function() {
              h.onMouseUp(b);
            });
          }));
          h.addBaseSeriesEvents();
          h.addChartEvents();
        },
        getUnionExtremes: function(a) {
          var b = this.chart.xAxis[0],
              c = this.xAxis,
              e = c.options,
              f = b.options,
              g;
          a && null === b.dataMin || (g = {
            dataMin: d(e && e.min, H("min", f.min, b.dataMin, c.dataMin, c.min)),
            dataMax: d(e && e.max, H("max", f.max, b.dataMax, c.dataMax, c.max))
          });
          return g;
        },
        setBaseSeries: function(a, b) {
          var c = this.chart,
              d = this.baseSeries = [];
          a = a || c.options && c.options.navigator.baseSeries || 0;
          y(c.series || [], function(b, c) {
            b.options.isInternal || !b.options.showInNavigator && (c !== a && b.options.id !== a || !1 === b.options.showInNavigator) || d.push(b);
          });
          this.xAxis && !this.xAxis.fake && this.updateNavigatorSeries(b);
        },
        updateNavigatorSeries: function(c) {
          var d = this,
              g = d.chart,
              e = d.baseSeries,
              k,
              h,
              p = d.navigatorOptions.series,
              n,
              u = {
                enableMouseTracking: !1,
                index: null,
                linkedTo: null,
                group: "nav",
                padXAxis: !1,
                xAxis: "navigator-x-axis",
                yAxis: "navigator-y-axis",
                showInLegend: !1,
                stacking: !1,
                isInternal: !0,
                visible: !0
              },
              r = d.series = a.grep(d.series || [], function(b) {
                var c = b.baseSeries;
                return 0 > a.inArray(c, e) ? (c && (C(c, "updatedData", d.updatedDataHandler), delete c.navigatorSeries), b.destroy(), !1) : !0;
              });
          e && e.length && y(e, function(a) {
            var l = a.navigatorSeries,
                q = f({color: a.color}, b(p) ? m.navigator.series : p);
            l && !1 === d.navigatorOptions.adaptToUpdatedData || (u.name = "Navigator " + e.length, k = a.options || {}, n = k.navigatorOptions || {}, h = B(k, u, q, n), q = n.data || q.data, d.hasNavigatorData = d.hasNavigatorData || !!q, h.data = q || k.data && k.data.slice(0), l && l.options ? l.update(h, c) : (a.navigatorSeries = g.initSeries(h), a.navigatorSeries.baseSeries = a, r.push(a.navigatorSeries)));
          });
          if (p.data && (!e || !e.length) || b(p))
            d.hasNavigatorData = !1, p = a.splat(p), y(p, function(a, b) {
              u.name = "Navigator " + (r.length + 1);
              h = B(m.navigator.series, {color: g.series[b] && !g.series[b].options.isInternal && g.series[b].color || g.options.colors[b] || g.options.colors[0]}, u, a);
              h.data = a.data;
              h.data && (d.hasNavigatorData = !0, r.push(g.initSeries(h)));
            });
          this.addBaseSeriesEvents();
        },
        addBaseSeriesEvents: function() {
          var a = this,
              b = a.baseSeries || [];
          b[0] && b[0].xAxis && F(b[0].xAxis, "foundExtremes", this.modifyBaseAxisExtremes);
          y(b, function(b) {
            F(b, "show", function() {
              this.navigatorSeries && this.navigatorSeries.setVisible(!0, !1);
            });
            F(b, "hide", function() {
              this.navigatorSeries && this.navigatorSeries.setVisible(!1, !1);
            });
            !1 !== this.navigatorOptions.adaptToUpdatedData && b.xAxis && F(b, "updatedData", this.updatedDataHandler);
            F(b, "remove", function() {
              this.navigatorSeries && (w(a.series, this.navigatorSeries), this.navigatorSeries.remove(!1), delete this.navigatorSeries);
            });
          }, this);
        },
        modifyNavigatorAxisExtremes: function() {
          var a = this.xAxis,
              b;
          a.getExtremes && (!(b = this.getUnionExtremes(!0)) || b.dataMin === a.min && b.dataMax === a.max || (a.min = b.dataMin, a.max = b.dataMax));
        },
        modifyBaseAxisExtremes: function() {
          var a = this.chart.navigator,
              b = this.getExtremes(),
              c = b.dataMin,
              d = b.dataMax,
              b = b.max - b.min,
              f = a.stickToMin,
              g = a.stickToMax,
              p = this.options.overscroll,
              m,
              n,
              u = a.series && a.series[0],
              r = !!this.setExtremes;
          this.eventArgs && "rangeSelectorButton" === this.eventArgs.trigger || (f && (n = c, m = n + b), g && (m = d + p, f || (n = Math.max(m - b, u && u.xData ? u.xData[0] : -Number.MAX_VALUE))), r && (f || g) && h(n) && (this.min = this.userMin = n, this.max = this.userMax = m));
          a.stickToMin = a.stickToMax = null;
        },
        updatedDataHandler: function() {
          var a = this.chart.navigator,
              b = this.navigatorSeries;
          a.stickToMax = a.xAxis.reversed ? 0 === Math.round(a.zoomedMin) : Math.round(a.zoomedMax) >= Math.round(a.size);
          a.stickToMin = h(this.xAxis.min) && this.xAxis.min <= this.xData[0] && (!this.chart.fixedRange || !a.stickToMax);
          b && !a.hasNavigatorData && (b.options.pointStart = this.xData[0], b.setData(this.options.data, !1, null, !1));
        },
        addChartEvents: function() {
          F(this.chart, "redraw", function() {
            var a = this.navigator,
                b = a && (a.baseSeries && a.baseSeries[0] && a.baseSeries[0].xAxis || a.scrollbar && this.xAxis[0]);
            b && a.render(b.min, b.max);
          });
        },
        destroy: function() {
          this.removeEvents();
          this.xAxis && (w(this.chart.xAxis, this.xAxis), w(this.chart.axes, this.xAxis));
          this.yAxis && (w(this.chart.yAxis, this.yAxis), w(this.chart.axes, this.yAxis));
          y(this.series || [], function(a) {
            a.destroy && a.destroy();
          });
          y("series xAxis yAxis shades outline scrollbarTrack scrollbarRifles scrollbarGroup scrollbar navigatorGroup rendered".split(" "), function(a) {
            this[a] && this[a].destroy && this[a].destroy();
            this[a] = null;
          }, this);
          y([this.handles], function(a) {
            t(a);
          }, this);
        }
      };
      a.Navigator = D;
      x(G.prototype, "zoom", function(a, b, c) {
        var d = this.chart,
            f = d.options,
            k = f.chart.zoomType,
            h = f.navigator,
            f = f.rangeSelector,
            p;
        this.isXAxis && (h && h.enabled || f && f.enabled) && ("x" === k ? d.resetZoomButton = "blocked" : "y" === k ? p = !1 : "xy" === k && this.options.range && (d = this.previousZoom, g(b) ? this.previousZoom = [this.min, this.max] : d && (b = d[0], c = d[1], delete this.previousZoom)));
        return void 0 !== p ? p : a.call(this, b, c);
      });
      x(v.prototype, "init", function(a, b, c) {
        F(this, "beforeRender", function() {
          var a = this.options;
          if (a.navigator.enabled || a.scrollbar.enabled)
            this.scroller = this.navigator = new D(this);
        });
        a.call(this, b, c);
      });
      x(v.prototype, "setChartSize", function(a) {
        var b = this.legend,
            c = this.navigator,
            e,
            f,
            g,
            k;
        a.apply(this, [].slice.call(arguments, 1));
        c && (f = b && b.options, g = c.xAxis, k = c.yAxis, e = c.scrollbarHeight, this.inverted ? (c.left = c.opposite ? this.chartWidth - e - c.height : this.spacing[3] + e, c.top = this.plotTop + e) : (c.left = this.plotLeft + e, c.top = c.navigatorOptions.top || this.chartHeight - c.height - e - this.spacing[2] - (this.rangeSelector && this.extraBottomMargin ? this.rangeSelector.getHeight() : 0) - (f && "bottom" === f.verticalAlign && f.enabled && !f.floating ? b.legendHeight + d(f.margin, 10) : 0)), g && k && (this.inverted ? g.options.left = k.options.left = c.left : g.options.top = k.options.top = c.top, g.setAxisSize(), k.setAxisSize()));
      });
      x(z.prototype, "addPoint", function(a, b, c, d, f) {
        var e = this.options.turboThreshold;
        e && this.xData.length > e && n(b, !0) && this.chart.navigator && r(20, !0);
        a.call(this, b, c, d, f);
      });
      x(v.prototype, "addSeries", function(a, b, c, e) {
        a = a.call(this, b, !1, e);
        this.navigator && this.navigator.setBaseSeries(null, !1);
        d(c, !0) && this.redraw();
        return a;
      });
      x(z.prototype, "update", function(a, b, c) {
        a.call(this, b, !1);
        this.chart.navigator && !this.options.isInternal && this.chart.navigator.setBaseSeries(null, !1);
        d(c, !0) && this.chart.redraw();
      });
      v.prototype.callbacks.push(function(a) {
        var b = a.navigator;
        b && (a = a.xAxis[0].getExtremes(), b.render(a.min, a.max));
      });
    })(K);
    (function(a) {
      function D(a) {
        this.init(a);
      }
      var F = a.addEvent,
          G = a.Axis,
          v = a.Chart,
          m = a.css,
          g = a.createElement,
          t = a.defaultOptions,
          y = a.defined,
          w = a.destroyObjectProperties,
          r = a.discardElement,
          f = a.each,
          c = a.extend,
          A = a.fireEvent,
          b = a.isNumber,
          h = a.merge,
          n = a.pick,
          B = a.pInt,
          d = a.splat,
          C = a.wrap;
      c(t, {rangeSelector: {
          verticalAlign: "top",
          buttonTheme: {
            "stroke-width": 0,
            width: 28,
            height: 18,
            padding: 2,
            zIndex: 7
          },
          floating: !1,
          x: 0,
          y: 0,
          height: void 0,
          inputPosition: {
            align: "right",
            x: 0,
            y: 0
          },
          buttonPosition: {
            align: "left",
            x: 0,
            y: 0
          }
        }});
      t.lang = h(t.lang, {
        rangeSelectorZoom: "Zoom",
        rangeSelectorFrom: "From",
        rangeSelectorTo: "To"
      });
      D.prototype = {
        clickButton: function(a, c) {
          var g = this,
              h = g.chart,
              p = g.buttonOptions[a],
              m = h.xAxis[0],
              k = h.scroller && h.scroller.getUnionExtremes() || m || {},
              r = k.dataMin,
              t = k.dataMax,
              e,
              l = m && Math.round(Math.min(m.max, n(t, m.max))),
              v = p.type,
              q,
              k = p._range,
              w,
              z,
              y,
              I = p.dataGrouping;
          if (null !== r && null !== t) {
            h.fixedRange = k;
            I && (this.forcedDataGrouping = !0, G.prototype.setDataGrouping.call(m || {chart: this.chart}, I, !1));
            if ("month" === v || "year" === v)
              m ? (v = {
                range: p,
                max: l,
                chart: h,
                dataMin: r,
                dataMax: t
              }, e = m.minFromRange.call(v), b(v.newMax) && (l = v.newMax)) : k = p;
            else if (k)
              e = Math.max(l - k, r), l = Math.min(e + k, t);
            else if ("ytd" === v)
              if (m)
                void 0 === t && (r = Number.MAX_VALUE, t = Number.MIN_VALUE, f(h.series, function(a) {
                  a = a.xData;
                  r = Math.min(a[0], r);
                  t = Math.max(a[a.length - 1], t);
                }), c = !1), l = g.getYTDExtremes(t, r, h.time.useUTC), e = w = l.min, l = l.max;
              else {
                F(h, "beforeRender", function() {
                  g.clickButton(a);
                });
                return;
              }
            else
              "all" === v && m && (e = r, l = t);
            e += p._offsetMin;
            l += p._offsetMax;
            g.setSelected(a);
            m ? m.setExtremes(e, l, n(c, 1), null, {
              trigger: "rangeSelectorButton",
              rangeSelectorButton: p
            }) : (q = d(h.options.xAxis)[0], y = q.range, q.range = k, z = q.min, q.min = w, F(h, "load", function() {
              q.range = y;
              q.min = z;
            }));
          }
        },
        setSelected: function(a) {
          this.selected = this.options.selected = a;
        },
        defaultButtons: [{
          type: "month",
          count: 1,
          text: "1m"
        }, {
          type: "month",
          count: 3,
          text: "3m"
        }, {
          type: "month",
          count: 6,
          text: "6m"
        }, {
          type: "ytd",
          text: "YTD"
        }, {
          type: "year",
          count: 1,
          text: "1y"
        }, {
          type: "all",
          text: "All"
        }],
        init: function(a) {
          var b = this,
              c = a.options.rangeSelector,
              d = c.buttons || [].concat(b.defaultButtons),
              g = c.selected,
              h = function() {
                var a = b.minInput,
                    c = b.maxInput;
                a && a.blur && A(a, "blur");
                c && c.blur && A(c, "blur");
              };
          b.chart = a;
          b.options = c;
          b.buttons = [];
          a.extraTopMargin = c.height;
          b.buttonOptions = d;
          this.unMouseDown = F(a.container, "mousedown", h);
          this.unResize = F(a, "resize", h);
          f(d, b.computeButtonRange);
          void 0 !== g && d[g] && this.clickButton(g, !1);
          F(a, "load", function() {
            a.xAxis && a.xAxis[0] && F(a.xAxis[0], "setExtremes", function(c) {
              this.max - this.min !== a.fixedRange && "rangeSelectorButton" !== c.trigger && "updatedData" !== c.trigger && b.forcedDataGrouping && this.setDataGrouping(!1, !1);
            });
          });
        },
        updateButtonStates: function() {
          var a = this.chart,
              c = a.xAxis[0],
              d = Math.round(c.max - c.min),
              g = !c.hasVisibleSeries,
              h = a.scroller && a.scroller.getUnionExtremes() || c,
              m = h.dataMin,
              k = h.dataMax,
              a = this.getYTDExtremes(k, m, a.time.useUTC),
              n = a.min,
              r = a.max,
              e = this.selected,
              l = b(e),
              t = this.options.allButtonsEnabled,
              q = this.buttons;
          f(this.buttonOptions, function(a, b) {
            var f = a._range,
                h = a.type,
                p = a.count || 1,
                u = q[b],
                x = 0;
            a = a._offsetMax - a._offsetMin;
            b = b === e;
            var v = f > k - m,
                w = f < c.minRange,
                z = !1,
                y = !1,
                f = f === d;
            ("month" === h || "year" === h) && d + 36E5 >= 864E5 * {
              month: 28,
              year: 365
            }[h] * p - a && d - 36E5 <= 864E5 * {
              month: 31,
              year: 366
            }[h] * p + a ? f = !0 : "ytd" === h ? (f = r - n + a === d, z = !b) : "all" === h && (f = c.max - c.min >= k - m, y = !b && l && f);
            h = !t && (v || w || y || g);
            p = b && f || f && !l && !z;
            h ? x = 3 : p && (l = !0, x = 2);
            u.state !== x && u.setState(x);
          });
        },
        computeButtonRange: function(a) {
          var b = a.type,
              c = a.count || 1,
              d = {
                millisecond: 1,
                second: 1E3,
                minute: 6E4,
                hour: 36E5,
                day: 864E5,
                week: 6048E5
              };
          if (d[b])
            a._range = d[b] * c;
          else if ("month" === b || "year" === b)
            a._range = 864E5 * {
              month: 30,
              year: 365
            }[b] * c;
          a._offsetMin = n(a.offsetMin, 0);
          a._offsetMax = n(a.offsetMax, 0);
          a._range += a._offsetMax - a._offsetMin;
        },
        setInputValue: function(a, b) {
          var c = this.chart.options.rangeSelector,
              d = this.chart.time,
              f = this[a + "Input"];
          y(b) && (f.previousValue = f.HCTime, f.HCTime = b);
          f.value = d.dateFormat(c.inputEditDateFormat || "%Y-%m-%d", f.HCTime);
          this[a + "DateBox"].attr({text: d.dateFormat(c.inputDateFormat || "%b %e, %Y", f.HCTime)});
        },
        showInput: function(a) {
          var b = this.inputGroup,
              c = this[a + "DateBox"];
          m(this[a + "Input"], {
            left: b.translateX + c.x + "px",
            top: b.translateY + "px",
            width: c.width - 2 + "px",
            height: c.height - 2 + "px",
            border: "2px solid silver"
          });
        },
        hideInput: function(a) {
          m(this[a + "Input"], {
            border: 0,
            width: "1px",
            height: "1px"
          });
          this.setInputValue(a);
        },
        drawInput: function(a) {
          function c() {
            var a = r.value,
                c = (m.inputDateParser || Date.parse)(a),
                e = f.xAxis[0],
                g = f.scroller && f.scroller.xAxis ? f.scroller.xAxis : e,
                k = g.dataMin,
                g = g.dataMax;
            c !== r.previousValue && (r.previousValue = c, b(c) || (c = a.split("-"), c = Date.UTC(B(c[0]), B(c[1]) - 1, B(c[2]))), b(c) && (f.time.useUTC || (c += 6E4 * (new Date).getTimezoneOffset()), n ? c > d.maxInput.HCTime ? c = void 0 : c < k && (c = k) : c < d.minInput.HCTime ? c = void 0 : c > g && (c = g), void 0 !== c && e.setExtremes(n ? c : e.min, n ? e.max : c, void 0, void 0, {trigger: "rangeSelectorInput"})));
          }
          var d = this,
              f = d.chart,
              h = f.renderer,
              m = f.options.rangeSelector,
              k = d.div,
              n = "min" === a,
              r,
              e,
              l = this.inputGroup;
          this[a + "Label"] = e = h.label(t.lang[n ? "rangeSelectorFrom" : "rangeSelectorTo"], this.inputGroup.offset).addClass("highcharts-range-label").attr({padding: 2}).add(l);
          l.offset += e.width + 5;
          this[a + "DateBox"] = h = h.label("", l.offset).addClass("highcharts-range-input").attr({
            padding: 2,
            width: m.inputBoxWidth || 90,
            height: m.inputBoxHeight || 17,
            stroke: m.inputBoxBorderColor || "#cccccc",
            "stroke-width": 1,
            "text-align": "center"
          }).on("click", function() {
            d.showInput(a);
            d[a + "Input"].focus();
          }).add(l);
          l.offset += h.width + (n ? 10 : 0);
          this[a + "Input"] = r = g("input", {
            name: a,
            className: "highcharts-range-selector",
            type: "text"
          }, {top: f.plotTop + "px"}, k);
          r.onfocus = function() {
            d.showInput(a);
          };
          r.onblur = function() {
            d.hideInput(a);
          };
          r.onchange = c;
          r.onkeypress = function(a) {
            13 === a.keyCode && c();
          };
        },
        getPosition: function() {
          var a = this.chart,
              b = a.options.rangeSelector,
              a = "top" === b.verticalAlign ? a.plotTop - a.axisOffset[0] : 0;
          return {
            buttonTop: a + b.buttonPosition.y,
            inputTop: a + b.inputPosition.y - 10
          };
        },
        getYTDExtremes: function(a, b, c) {
          var d = this.chart.time,
              f = new d.Date(a),
              g = d.get("FullYear", f);
          c = c ? d.Date.UTC(g, 0, 1) : +new d.Date(g, 0, 1);
          b = Math.max(b || 0, c);
          f = f.getTime();
          return {
            max: Math.min(a || f, f),
            min: b
          };
        },
        render: function(a, b) {
          var c = this,
              d = c.chart,
              h = d.renderer,
              m = d.container,
              k = d.options,
              r = k.exporting && !1 !== k.exporting.enabled && k.navigation && k.navigation.buttonOptions,
              v = t.lang,
              e = c.div,
              l = k.rangeSelector,
              k = l.floating,
              w = c.buttons,
              e = c.inputGroup,
              q = l.buttonTheme,
              z = l.buttonPosition,
              y = l.inputPosition,
              A = l.inputEnabled,
              B = q && q.states,
              C = d.plotLeft,
              I,
              D = c.buttonGroup,
              F;
          F = c.rendered;
          var G = c.options.verticalAlign,
              K = d.legend,
              X = K && K.options,
              Y = z.y,
              W = y.y,
              R = F || !1,
              U = 0,
              S = 0,
              T;
          if (!1 !== l.enabled) {
            F || (c.group = F = h.g("range-selector-group").attr({zIndex: 7}).add(), c.buttonGroup = D = h.g("range-selector-buttons").add(F), c.zoomText = h.text(v.rangeSelectorZoom, n(C + z.x, C), 15).css(l.labelStyle).add(D), I = n(C + z.x, C) + c.zoomText.getBBox().width + 5, f(c.buttonOptions, function(a, b) {
              w[b] = h.button(a.text, I, 0, function() {
                var d = a.events && a.events.click,
                    e;
                d && (e = d.call(a));
                !1 !== e && c.clickButton(b);
                c.isActive = !0;
              }, q, B && B.hover, B && B.select, B && B.disabled).attr({"text-align": "center"}).add(D);
              I += w[b].width + n(l.buttonSpacing, 5);
            }), !1 !== A && (c.div = e = g("div", null, {
              position: "relative",
              height: 0,
              zIndex: 1
            }), m.parentNode.insertBefore(e, m), c.inputGroup = e = h.g("input-group").add(F), e.offset = 0, c.drawInput("min"), c.drawInput("max")));
            C = d.plotLeft - d.spacing[3];
            c.updateButtonStates();
            r && this.titleCollision(d) && "top" === G && "right" === z.align && z.y + D.getBBox().height - 12 < (r.y || 0) + r.height && (U = -40);
            "left" === z.align ? T = z.x - d.spacing[3] : "right" === z.align && (T = z.x + U - d.spacing[1]);
            D.align({
              y: z.y,
              width: D.getBBox().width,
              align: z.align,
              x: T
            }, !0, d.spacingBox);
            c.group.placed = R;
            c.buttonGroup.placed = R;
            !1 !== A && (U = r && this.titleCollision(d) && "top" === G && "right" === y.align && y.y - e.getBBox().height - 12 < (r.y || 0) + r.height + d.spacing[0] ? -40 : 0, "left" === y.align ? T = C : "right" === y.align && (T = -Math.max(d.axisOffset[1], -U)), e.align({
              y: y.y,
              width: e.getBBox().width,
              align: y.align,
              x: y.x + T - 2
            }, !0, d.spacingBox), m = e.alignAttr.translateX + e.alignOptions.x - U + e.getBBox().x + 2, r = e.alignOptions.width, v = D.alignAttr.translateX + D.getBBox().x, T = D.getBBox().width + 20, (y.align === z.align || v + T > m && m + r > v && Y < W + e.getBBox().height) && e.attr({
              translateX: e.alignAttr.translateX + (d.axisOffset[1] >= -U ? 0 : -U),
              translateY: e.alignAttr.translateY + D.getBBox().height + 10
            }), c.setInputValue("min", a), c.setInputValue("max", b), c.inputGroup.placed = R);
            c.group.align({verticalAlign: G}, !0, d.spacingBox);
            a = c.group.getBBox().height + 20;
            b = c.group.alignAttr.translateY;
            "bottom" === G && (K = X && "bottom" === X.verticalAlign && X.enabled && !X.floating ? K.legendHeight + n(X.margin, 10) : 0, a = a + K - 20, S = b - a - (k ? 0 : l.y) - 10);
            if ("top" === G)
              k && (S = 0), d.titleOffset && (S = d.titleOffset + d.options.title.margin), S += d.margin[0] - d.spacing[0] || 0;
            else if ("middle" === G)
              if (W === Y)
                S = 0 > W ? b + void 0 : b;
              else if (W || Y)
                S = 0 > W || 0 > Y ? S - Math.min(W, Y) : b - a + NaN;
            c.group.translate(l.x, l.y + Math.floor(S));
            !1 !== A && (c.minInput.style.marginTop = c.group.translateY + "px", c.maxInput.style.marginTop = c.group.translateY + "px");
            c.rendered = !0;
          }
        },
        getHeight: function() {
          var a = this.options,
              b = this.group,
              c = a.y,
              d = a.buttonPosition.y,
              a = a.inputPosition.y,
              b = b ? b.getBBox(!0).height + 13 + c : 0,
              c = Math.min(a, d);
          if (0 > a && 0 > d || 0 < a && 0 < d)
            b += Math.abs(c);
          return b;
        },
        titleCollision: function(a) {
          return !(a.options.title.text || a.options.subtitle.text);
        },
        update: function(a) {
          var b = this.chart;
          h(!0, b.options.rangeSelector, a);
          this.destroy();
          this.init(b);
          b.rangeSelector.render();
        },
        destroy: function() {
          var b = this,
              c = b.minInput,
              d = b.maxInput;
          b.unMouseDown();
          b.unResize();
          w(b.buttons);
          c && (c.onfocus = c.onblur = c.onchange = null);
          d && (d.onfocus = d.onblur = d.onchange = null);
          a.objectEach(b, function(a, c) {
            a && "chart" !== c && (a.destroy ? a.destroy() : a.nodeType && r(this[c]));
            a !== D.prototype[c] && (b[c] = null);
          }, this);
        }
      };
      G.prototype.toFixedRange = function(a, c, d, f) {
        var g = this.chart && this.chart.fixedRange;
        a = n(d, this.translate(a, !0, !this.horiz));
        c = n(f, this.translate(c, !0, !this.horiz));
        d = g && (c - a) / g;
        .7 < d && 1.3 > d && (f ? a = c - g : c = a + g);
        b(a) && b(c) || (a = c = void 0);
        return {
          min: a,
          max: c
        };
      };
      G.prototype.minFromRange = function() {
        var a = this.range,
            c = {
              month: "Month",
              year: "FullYear"
            }[a.type],
            d,
            f = this.max,
            g,
            h,
            k = function(a, b) {
              var d = new Date(a),
                  f = d["get" + c]();
              d["set" + c](f + b);
              f === d["get" + c]() && d.setDate(0);
              return d.getTime() - a;
            };
        b(a) ? (d = f - a, h = a) : (d = f + k(f, -a.count), this.chart && (this.chart.fixedRange = f - d));
        g = n(this.dataMin, Number.MIN_VALUE);
        b(d) || (d = g);
        d <= g && (d = g, void 0 === h && (h = k(d, a.count)), this.newMax = Math.min(d + h, this.dataMax));
        b(f) || (d = void 0);
        return d;
      };
      C(v.prototype, "init", function(a, b, c) {
        F(this, "init", function() {
          this.options.rangeSelector.enabled && (this.rangeSelector = new D(this));
        });
        a.call(this, b, c);
      });
      C(v.prototype, "render", function(a, b, c) {
        var d = this.axes,
            g = this.rangeSelector;
        g && (f(d, function(a) {
          a.updateNames();
          a.setScale();
        }), this.getAxisMargins(), g.render(), d = g.options.verticalAlign, g.options.floating || ("bottom" === d ? this.extraBottomMargin = !0 : "middle" !== d && (this.extraTopMargin = !0)));
        a.call(this, b, c);
      });
      C(v.prototype, "update", function(b, c, d, f) {
        var g = this.rangeSelector,
            h;
        this.extraTopMargin = this.extraBottomMargin = !1;
        g && (g.render(), h = c.rangeSelector && c.rangeSelector.verticalAlign || g.options && g.options.verticalAlign, g.options.floating || ("bottom" === h ? this.extraBottomMargin = !0 : "middle" !== h && (this.extraTopMargin = !0)));
        b.call(this, a.merge(!0, c, {chart: {
            marginBottom: n(c.chart && c.chart.marginBottom, this.margin.bottom),
            spacingBottom: n(c.chart && c.chart.spacingBottom, this.spacing.bottom)
          }}), d, f);
      });
      C(v.prototype, "redraw", function(a, b, c) {
        var d = this.rangeSelector;
        d && !d.options.floating && (d.render(), d = d.options.verticalAlign, "bottom" === d ? this.extraBottomMargin = !0 : "middle" !== d && (this.extraTopMargin = !0));
        a.call(this, b, c);
      });
      v.prototype.adjustPlotArea = function() {
        var a = this.rangeSelector;
        this.rangeSelector && (a = a.getHeight(), this.extraTopMargin && (this.plotTop += a), this.extraBottomMargin && (this.marginBottom += a));
      };
      v.prototype.callbacks.push(function(a) {
        function c() {
          d = a.xAxis[0].getExtremes();
          b(d.min) && f.render(d.min, d.max);
        }
        var d,
            f = a.rangeSelector,
            g,
            h;
        f && (h = F(a.xAxis[0], "afterSetExtremes", function(a) {
          f.render(a.min, a.max);
        }), g = F(a, "redraw", c), c());
        F(a, "destroy", function() {
          f && (g(), h());
        });
      });
      a.RangeSelector = D;
    })(K);
    (function(a) {
      var D = a.arrayMax,
          F = a.arrayMin,
          G = a.Axis,
          v = a.Chart,
          m = a.defined,
          g = a.each,
          t = a.format,
          y = a.grep,
          w = a.inArray,
          r = a.isNumber,
          f = a.isString,
          c = a.map,
          A = a.merge,
          b = a.pick,
          h = a.Point,
          n = a.Series,
          B = a.splat,
          d = a.SVGRenderer,
          C = a.wrap,
          I = n.prototype,
          z = I.init,
          u = I.processData,
          x = h.prototype.tooltipFormatter;
      a.StockChart = a.stockChart = function(d, g, k) {
        var h = f(d) || d.nodeName,
            m = arguments[h ? 1 : 0],
            e = m.series,
            l = a.getOptions(),
            p,
            n = b(m.navigator && m.navigator.enabled, l.navigator.enabled, !0),
            r = n ? {
              startOnTick: !1,
              endOnTick: !1
            } : null,
            t = {marker: {
                enabled: !1,
                radius: 2
              }},
            u = {
              shadow: !1,
              borderWidth: 0
            };
        m.xAxis = c(B(m.xAxis || {}), function(a, b) {
          return A({
            minPadding: 0,
            maxPadding: 0,
            overscroll: 0,
            ordinal: !0,
            title: {text: null},
            labels: {overflow: "justify"},
            showLastLabel: !0
          }, l.xAxis, l.xAxis && l.xAxis[b], a, {
            type: "datetime",
            categories: null
          }, r);
        });
        m.yAxis = c(B(m.yAxis || {}), function(a, c) {
          p = b(a.opposite, !0);
          return A({
            labels: {y: -2},
            opposite: p,
            showLastLabel: !(!a.categories && "category" !== a.type),
            title: {text: null}
          }, l.yAxis, l.yAxis && l.yAxis[c], a);
        });
        m.series = null;
        m = A({
          chart: {
            panning: !0,
            pinchType: "x"
          },
          navigator: {enabled: n},
          scrollbar: {enabled: b(l.scrollbar.enabled, !0)},
          rangeSelector: {enabled: b(l.rangeSelector.enabled, !0)},
          title: {text: null},
          tooltip: {
            split: b(l.tooltip.split, !0),
            crosshairs: !0
          },
          legend: {enabled: !1},
          plotOptions: {
            line: t,
            spline: t,
            area: t,
            areaspline: t,
            arearange: t,
            areasplinerange: t,
            column: u,
            columnrange: u,
            candlestick: u,
            ohlc: u
          }
        }, m, {isStock: !0});
        m.series = e;
        return h ? new v(d, m, k) : new v(m, g);
      };
      C(G.prototype, "autoLabelAlign", function(a) {
        var b = this.chart,
            c = this.options,
            b = b._labelPanes = b._labelPanes || {},
            d = this.options.labels;
        return this.chart.options.isStock && "yAxis" === this.coll && (c = c.top + "," + c.height, !b[c] && d.enabled) ? (15 === d.x && (d.x = 0), void 0 === d.align && (d.align = "right"), b[c] = this, "right") : a.apply(this, [].slice.call(arguments, 1));
      });
      C(G.prototype, "destroy", function(a) {
        var b = this.chart,
            c = this.options && this.options.top + "," + this.options.height;
        c && b._labelPanes && b._labelPanes[c] === this && delete b._labelPanes[c];
        return a.apply(this, Array.prototype.slice.call(arguments, 1));
      });
      C(G.prototype, "getPlotLinePath", function(d, h, k, n, t, e) {
        var l = this,
            p = this.isLinked && !this.series ? this.linkedParent.series : this.series,
            q = l.chart,
            u = q.renderer,
            v = l.left,
            x = l.top,
            y,
            z,
            A,
            B,
            C = [],
            E = [],
            H,
            D;
        if ("xAxis" !== l.coll && "yAxis" !== l.coll)
          return d.apply(this, [].slice.call(arguments, 1));
        E = function(a) {
          var b = "xAxis" === a ? "yAxis" : "xAxis";
          a = l.options[b];
          return r(a) ? [q[b][a]] : f(a) ? [q.get(a)] : c(p, function(a) {
            return a[b];
          });
        }(l.coll);
        g(l.isXAxis ? q.yAxis : q.xAxis, function(a) {
          if (m(a.options.id) ? -1 === a.options.id.indexOf("navigator") : 1) {
            var b = a.isXAxis ? "yAxis" : "xAxis",
                b = m(a.options[b]) ? q[b][a.options[b]] : q[b][0];
            l === b && E.push(a);
          }
        });
        H = E.length ? [] : [l.isXAxis ? q.yAxis[0] : q.xAxis[0]];
        g(E, function(b) {
          -1 !== w(b, H) || a.find(H, function(a) {
            return a.pos === b.pos && a.len && b.len;
          }) || H.push(b);
        });
        D = b(e, l.translate(h, null, null, n));
        r(D) && (l.horiz ? g(H, function(a) {
          var b;
          z = a.pos;
          B = z + a.len;
          y = A = Math.round(D + l.transB);
          if (y < v || y > v + l.width)
            t ? y = A = Math.min(Math.max(v, y), v + l.width) : b = !0;
          b || C.push("M", y, z, "L", A, B);
        }) : g(H, function(a) {
          var b;
          y = a.pos;
          A = y + a.len;
          z = B = Math.round(x + l.height - D);
          if (z < x || z > x + l.height)
            t ? z = B = Math.min(Math.max(x, z), l.top + l.height) : b = !0;
          b || C.push("M", y, z, "L", A, B);
        }));
        return 0 < C.length ? u.crispPolyLine(C, k || 1) : null;
      });
      d.prototype.crispPolyLine = function(a, b) {
        var c;
        for (c = 0; c < a.length; c += 6)
          a[c + 1] === a[c + 4] && (a[c + 1] = a[c + 4] = Math.round(a[c + 1]) - b % 2 / 2), a[c + 2] === a[c + 5] && (a[c + 2] = a[c + 5] = Math.round(a[c + 2]) + b % 2 / 2);
        return a;
      };
      C(G.prototype, "hideCrosshair", function(a, b) {
        a.call(this, b);
        this.crossLabel && (this.crossLabel = this.crossLabel.hide());
      });
      C(G.prototype, "drawCrosshair", function(a, c, d) {
        var f,
            g;
        a.call(this, c, d);
        if (m(this.crosshair.label) && this.crosshair.label.enabled && this.cross) {
          a = this.chart;
          var e = this.options.crosshair.label,
              h = this.horiz;
          f = this.opposite;
          g = this.left;
          var k = this.top,
              p = this.crossLabel,
              n,
              r = e.format,
              u = "",
              v = "inside" === this.options.tickPosition,
              w = !1 !== this.crosshair.snap,
              x = 0;
          c || (c = this.cross && this.cross.e);
          n = h ? "center" : f ? "right" === this.labelAlign ? "right" : "left" : "left" === this.labelAlign ? "left" : "center";
          p || (p = this.crossLabel = a.renderer.label(null, null, null, e.shape || "callout").addClass("highcharts-crosshair-label" + (this.series[0] && " highcharts-color-" + this.series[0].colorIndex)).attr({
            align: e.align || n,
            padding: b(e.padding, 8),
            r: b(e.borderRadius, 3),
            zIndex: 2
          }).add(this.labelGroup));
          h ? (n = w ? d.plotX + g : c.chartX, k += f ? 0 : this.height) : (n = f ? this.width + g : 0, k = w ? d.plotY + k : c.chartY);
          r || e.formatter || (this.isDatetimeAxis && (u = "%b %d, %Y"), r = "{value" + (u ? ":" + u : "") + "}");
          c = w ? d[this.isXAxis ? "x" : "y"] : this.toValue(h ? c.chartX : c.chartY);
          p.attr({
            text: r ? t(r, {value: c}, a.time) : e.formatter.call(this, c),
            x: n,
            y: k,
            visibility: c < this.min || c > this.max ? "hidden" : "visible"
          });
          c = p.getBBox();
          if (h) {
            if (v && !f || !v && f)
              k = p.y - c.height;
          } else
            k = p.y - c.height / 2;
          h ? (f = g - c.x, g = g + this.width - c.x) : (f = "left" === this.labelAlign ? g : 0, g = "right" === this.labelAlign ? g + this.width : a.chartWidth);
          p.translateX < f && (x = f - p.translateX);
          p.translateX + c.width >= g && (x = -(p.translateX + c.width - g));
          p.attr({
            x: n + x,
            y: k,
            anchorX: h ? n : this.opposite ? 0 : a.chartWidth,
            anchorY: h ? this.opposite ? a.chartHeight : 0 : k + c.height / 2
          });
        }
      });
      I.init = function() {
        z.apply(this, arguments);
        this.setCompare(this.options.compare);
      };
      I.setCompare = function(a) {
        this.modifyValue = "value" === a || "percent" === a ? function(b, c) {
          var d = this.compareValue;
          if (void 0 !== b && void 0 !== d)
            return b = "value" === a ? b - d : b / d * 100 - (100 === this.options.compareBase ? 0 : 100), c && (c.change = b), b;
        } : null;
        this.userOptions.compare = a;
        this.chart.hasRendered && (this.isDirty = !0);
      };
      I.processData = function() {
        var a,
            b = -1,
            c,
            d,
            f = !0 === this.options.compareStart ? 0 : 1,
            e,
            g;
        u.apply(this, arguments);
        if (this.xAxis && this.processedYData)
          for (c = this.processedXData, d = this.processedYData, e = d.length, this.pointArrayMap && (b = w("close", this.pointArrayMap), -1 === b && (b = w(this.pointValKey || "y", this.pointArrayMap))), a = 0; a < e - f; a++)
            if (g = d[a] && -1 < b ? d[a][b] : d[a], r(g) && c[a + f] >= this.xAxis.min && 0 !== g) {
              this.compareValue = g;
              break;
            }
      };
      C(I, "getExtremes", function(a) {
        var b;
        a.apply(this, [].slice.call(arguments, 1));
        this.modifyValue && (b = [this.modifyValue(this.dataMin), this.modifyValue(this.dataMax)], this.dataMin = F(b), this.dataMax = D(b));
      });
      G.prototype.setCompare = function(a, c) {
        this.isXAxis || (g(this.series, function(b) {
          b.setCompare(a);
        }), b(c, !0) && this.chart.redraw());
      };
      h.prototype.tooltipFormatter = function(c) {
        c = c.replace("{point.change}", (0 < this.change ? "+" : "") + a.numberFormat(this.change, b(this.series.tooltipOptions.changeDecimals, 2)));
        return x.apply(this, [c]);
      };
      C(n.prototype, "render", function(a) {
        this.chart.is3d && this.chart.is3d() || this.chart.polar || !this.xAxis || this.xAxis.isRadial || (!this.clipBox && this.animate ? (this.clipBox = A(this.chart.clipBox), this.clipBox.width = this.xAxis.len, this.clipBox.height = this.yAxis.len) : this.chart[this.sharedClipKey] ? this.chart[this.sharedClipKey].attr({
          width: this.xAxis.len,
          height: this.yAxis.len
        }) : this.clipBox && (this.clipBox.width = this.xAxis.len, this.clipBox.height = this.yAxis.len));
        a.call(this);
      });
      C(v.prototype, "getSelectedPoints", function(a) {
        var b = a.call(this);
        g(this.series, function(a) {
          a.hasGroupedData && (b = b.concat(y(a.points || [], function(a) {
            return a.selected;
          })));
        });
        return b;
      });
      C(v.prototype, "update", function(a, b) {
        "scrollbar" in b && this.navigator && (A(!0, this.options.scrollbar, b.scrollbar), this.navigator.update({}, !1), delete b.scrollbar);
        return a.apply(this, Array.prototype.slice.call(arguments, 1));
      });
    })(K);
    return K;
  });
})(require('process'));
