/* */ 
(function(process) {
  (function(R, I) {
    "object" === typeof module && module.exports ? module.exports = R.document ? I(R) : I : R.Highcharts = I(R);
  })("undefined" !== typeof window ? window : this, function(R) {
    var I = function() {
      var a = "undefined" === typeof R ? window : R,
          w = a.document,
          B = a.navigator && a.navigator.userAgent || "",
          A = w && w.createElementNS && !!w.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
          f = /(edge|msie|trident)/i.test(B) && !a.opera,
          d = -1 !== B.indexOf("Firefox"),
          t = -1 !== B.indexOf("Chrome"),
          l = d && 4 > parseInt(B.split("Firefox/")[1], 10);
      return a.Highcharts ? a.Highcharts.error(16, !0) : {
        product: "Highmaps",
        version: "6.0.7",
        deg2rad: 2 * Math.PI / 360,
        doc: w,
        hasBidiBug: l,
        hasTouch: w && void 0 !== w.documentElement.ontouchstart,
        isMS: f,
        isWebKit: -1 !== B.indexOf("AppleWebKit"),
        isFirefox: d,
        isChrome: t,
        isSafari: !t && -1 !== B.indexOf("Safari"),
        isTouchDevice: /(Mobile|Android|Windows Phone)/.test(B),
        SVG_NS: "http://www.w3.org/2000/svg",
        chartCount: 0,
        seriesTypes: {},
        symbolSizes: {},
        svg: A,
        win: a,
        marginNames: ["plotTop", "marginRight", "marginBottom", "plotLeft"],
        noop: function() {},
        charts: []
      };
    }();
    (function(a) {
      a.timers = [];
      var w = a.charts,
          B = a.doc,
          A = a.win;
      a.error = function(f, d) {
        f = a.isNumber(f) ? "Highcharts error #" + f + ": www.highcharts.com/errors/" + f : f;
        if (d)
          throw Error(f);
        A.console && console.log(f);
      };
      a.Fx = function(a, d, t) {
        this.options = d;
        this.elem = a;
        this.prop = t;
      };
      a.Fx.prototype = {
        dSetter: function() {
          var a = this.paths[0],
              d = this.paths[1],
              t = [],
              l = this.now,
              v = a.length,
              q;
          if (1 === l)
            t = this.toD;
          else if (v === d.length && 1 > l)
            for (; v--; )
              q = parseFloat(a[v]), t[v] = isNaN(q) ? d[v] : l * parseFloat(d[v] - q) + q;
          else
            t = d;
          this.elem.attr("d", t, null, !0);
        },
        update: function() {
          var a = this.elem,
              d = this.prop,
              t = this.now,
              l = this.options.step;
          if (this[d + "Setter"])
            this[d + "Setter"]();
          else
            a.attr ? a.element && a.attr(d, t, null, !0) : a.style[d] = t + this.unit;
          l && l.call(a, t, this);
        },
        run: function(f, d, t) {
          var l = this,
              v = l.options,
              q = function(a) {
                return q.stopped ? !1 : l.step(a);
              },
              n = A.requestAnimationFrame || function(a) {
                setTimeout(a, 13);
              },
              e = function() {
                for (var k = 0; k < a.timers.length; k++)
                  a.timers[k]() || a.timers.splice(k--, 1);
                a.timers.length && n(e);
              };
          f === d ? (delete v.curAnim[this.prop], v.complete && 0 === a.keys(v.curAnim).length && v.complete.call(this.elem)) : (this.startTime = +new Date, this.start = f, this.end = d, this.unit = t, this.now = this.start, this.pos = 0, q.elem = this.elem, q.prop = this.prop, q() && 1 === a.timers.push(q) && n(e));
        },
        step: function(f) {
          var d = +new Date,
              t,
              l = this.options,
              v = this.elem,
              q = l.complete,
              n = l.duration,
              e = l.curAnim;
          v.attr && !v.element ? f = !1 : f || d >= n + this.startTime ? (this.now = this.end, this.pos = 1, this.update(), t = e[this.prop] = !0, a.objectEach(e, function(a) {
            !0 !== a && (t = !1);
          }), t && q && q.call(v), f = !1) : (this.pos = l.easing((d - this.startTime) / n), this.now = this.start + (this.end - this.start) * this.pos, this.update(), f = !0);
          return f;
        },
        initPath: function(f, d, t) {
          function l(a) {
            var b,
                c;
            for (g = a.length; g--; )
              b = "M" === a[g] || "L" === a[g], c = /[a-zA-Z]/.test(a[g + 3]), b && c && a.splice(g + 1, 0, a[g + 1], a[g + 2], a[g + 1], a[g + 2]);
          }
          function v(a, b) {
            for (; a.length < c; ) {
              a[0] = b[c - a.length];
              var e = a.slice(0, h);
              [].splice.apply(a, [0, 0].concat(e));
              p && (e = a.slice(a.length - h), [].splice.apply(a, [a.length, 0].concat(e)), g--);
            }
            a[0] = "M";
          }
          function q(a, e) {
            for (var g = (c - a.length) / h; 0 < g && g--; )
              b = a.slice().splice(a.length / F - h, h * F), b[0] = e[c - h - g * h], y && (b[h - 6] = b[h - 2], b[h - 5] = b[h - 1]), [].splice.apply(a, [a.length / F, 0].concat(b)), p && g--;
          }
          d = d || "";
          var n,
              e = f.startX,
              k = f.endX,
              y = -1 < d.indexOf("C"),
              h = y ? 7 : 3,
              c,
              b,
              g;
          d = d.split(" ");
          t = t.slice();
          var p = f.isArea,
              F = p ? 2 : 1,
              L;
          y && (l(d), l(t));
          if (e && k) {
            for (g = 0; g < e.length; g++)
              if (e[g] === k[0]) {
                n = g;
                break;
              } else if (e[0] === k[k.length - e.length + g]) {
                n = g;
                L = !0;
                break;
              }
            void 0 === n && (d = []);
          }
          d.length && a.isNumber(n) && (c = t.length + n * F * h, L ? (v(d, t), q(t, d)) : (v(t, d), q(d, t)));
          return [d, t];
        }
      };
      a.Fx.prototype.fillSetter = a.Fx.prototype.strokeSetter = function() {
        this.elem.attr(this.prop, a.color(this.start).tweenTo(a.color(this.end), this.pos), null, !0);
      };
      a.merge = function() {
        var f,
            d = arguments,
            t,
            l = {},
            v = function(f, n) {
              "object" !== typeof f && (f = {});
              a.objectEach(n, function(e, k) {
                !a.isObject(e, !0) || a.isClass(e) || a.isDOMElement(e) ? f[k] = n[k] : f[k] = v(f[k] || {}, e);
              });
              return f;
            };
        !0 === d[0] && (l = d[1], d = Array.prototype.slice.call(d, 2));
        t = d.length;
        for (f = 0; f < t; f++)
          l = v(l, d[f]);
        return l;
      };
      a.pInt = function(a, d) {
        return parseInt(a, d || 10);
      };
      a.isString = function(a) {
        return "string" === typeof a;
      };
      a.isArray = function(a) {
        a = Object.prototype.toString.call(a);
        return "[object Array]" === a || "[object Array Iterator]" === a;
      };
      a.isObject = function(f, d) {
        return !!f && "object" === typeof f && (!d || !a.isArray(f));
      };
      a.isDOMElement = function(f) {
        return a.isObject(f) && "number" === typeof f.nodeType;
      };
      a.isClass = function(f) {
        var d = f && f.constructor;
        return !(!a.isObject(f, !0) || a.isDOMElement(f) || !d || !d.name || "Object" === d.name);
      };
      a.isNumber = function(a) {
        return "number" === typeof a && !isNaN(a) && Infinity > a && -Infinity < a;
      };
      a.erase = function(a, d) {
        for (var f = a.length; f--; )
          if (a[f] === d) {
            a.splice(f, 1);
            break;
          }
      };
      a.defined = function(a) {
        return void 0 !== a && null !== a;
      };
      a.attr = function(f, d, t) {
        var l;
        a.isString(d) ? a.defined(t) ? f.setAttribute(d, t) : f && f.getAttribute && (l = f.getAttribute(d)) : a.defined(d) && a.isObject(d) && a.objectEach(d, function(a, d) {
          f.setAttribute(d, a);
        });
        return l;
      };
      a.splat = function(f) {
        return a.isArray(f) ? f : [f];
      };
      a.syncTimeout = function(a, d, t) {
        if (d)
          return setTimeout(a, d, t);
        a.call(0, t);
      };
      a.extend = function(a, d) {
        var f;
        a || (a = {});
        for (f in d)
          a[f] = d[f];
        return a;
      };
      a.pick = function() {
        var a = arguments,
            d,
            t,
            l = a.length;
        for (d = 0; d < l; d++)
          if (t = a[d], void 0 !== t && null !== t)
            return t;
      };
      a.css = function(f, d) {
        a.isMS && !a.svg && d && void 0 !== d.opacity && (d.filter = "alpha(opacity\x3d" + 100 * d.opacity + ")");
        a.extend(f.style, d);
      };
      a.createElement = function(f, d, t, l, v) {
        f = B.createElement(f);
        var q = a.css;
        d && a.extend(f, d);
        v && q(f, {
          padding: 0,
          border: "none",
          margin: 0
        });
        t && q(f, t);
        l && l.appendChild(f);
        return f;
      };
      a.extendClass = function(f, d) {
        var t = function() {};
        t.prototype = new f;
        a.extend(t.prototype, d);
        return t;
      };
      a.pad = function(a, d, t) {
        return Array((d || 2) + 1 - String(a).length).join(t || 0) + a;
      };
      a.relativeLength = function(a, d, t) {
        return /%$/.test(a) ? d * parseFloat(a) / 100 + (t || 0) : parseFloat(a);
      };
      a.wrap = function(a, d, t) {
        var f = a[d];
        a[d] = function() {
          var a = Array.prototype.slice.call(arguments),
              d = arguments,
              n = this;
          n.proceed = function() {
            f.apply(n, arguments.length ? arguments : d);
          };
          a.unshift(f);
          a = t.apply(this, a);
          n.proceed = null;
          return a;
        };
      };
      a.formatSingle = function(f, d, t) {
        var l = /\.([0-9])/,
            v = a.defaultOptions.lang;
        /f$/.test(f) ? (t = (t = f.match(l)) ? t[1] : -1, null !== d && (d = a.numberFormat(d, t, v.decimalPoint, -1 < f.indexOf(",") ? v.thousandsSep : ""))) : d = (t || a.time).dateFormat(f, d);
        return d;
      };
      a.format = function(f, d, t) {
        for (var l = "{",
            v = !1,
            q,
            n,
            e,
            k,
            y = [],
            h; f; ) {
          l = f.indexOf(l);
          if (-1 === l)
            break;
          q = f.slice(0, l);
          if (v) {
            q = q.split(":");
            n = q.shift().split(".");
            k = n.length;
            h = d;
            for (e = 0; e < k; e++)
              h && (h = h[n[e]]);
            q.length && (h = a.formatSingle(q.join(":"), h, t));
            y.push(h);
          } else
            y.push(q);
          f = f.slice(l + 1);
          l = (v = !v) ? "}" : "{";
        }
        y.push(f);
        return y.join("");
      };
      a.getMagnitude = function(a) {
        return Math.pow(10, Math.floor(Math.log(a) / Math.LN10));
      };
      a.normalizeTickInterval = function(f, d, t, l, v) {
        var q,
            n = f;
        t = a.pick(t, 1);
        q = f / t;
        d || (d = v ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === l && (1 === t ? d = a.grep(d, function(a) {
          return 0 === a % 1;
        }) : .1 >= t && (d = [1 / t])));
        for (l = 0; l < d.length && !(n = d[l], v && n * t >= f || !v && q <= (d[l] + (d[l + 1] || d[l])) / 2); l++)
          ;
        return n = a.correctFloat(n * t, -Math.round(Math.log(.001) / Math.LN10));
      };
      a.stableSort = function(a, d) {
        var f = a.length,
            l,
            v;
        for (v = 0; v < f; v++)
          a[v].safeI = v;
        a.sort(function(a, n) {
          l = d(a, n);
          return 0 === l ? a.safeI - n.safeI : l;
        });
        for (v = 0; v < f; v++)
          delete a[v].safeI;
      };
      a.arrayMin = function(a) {
        for (var d = a.length,
            f = a[0]; d--; )
          a[d] < f && (f = a[d]);
        return f;
      };
      a.arrayMax = function(a) {
        for (var d = a.length,
            f = a[0]; d--; )
          a[d] > f && (f = a[d]);
        return f;
      };
      a.destroyObjectProperties = function(f, d) {
        a.objectEach(f, function(a, l) {
          a && a !== d && a.destroy && a.destroy();
          delete f[l];
        });
      };
      a.discardElement = function(f) {
        var d = a.garbageBin;
        d || (d = a.createElement("div"));
        f && d.appendChild(f);
        d.innerHTML = "";
      };
      a.correctFloat = function(a, d) {
        return parseFloat(a.toPrecision(d || 14));
      };
      a.setAnimation = function(f, d) {
        d.renderer.globalAnimation = a.pick(f, d.options.chart.animation, !0);
      };
      a.animObject = function(f) {
        return a.isObject(f) ? a.merge(f) : {duration: f ? 500 : 0};
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
      a.numberFormat = function(f, d, t, l) {
        f = +f || 0;
        d = +d;
        var v = a.defaultOptions.lang,
            q = (f.toString().split(".")[1] || "").split("e")[0].length,
            n,
            e,
            k = f.toString().split("e");
        -1 === d ? d = Math.min(q, 20) : a.isNumber(d) ? d && k[1] && 0 > k[1] && (n = d + +k[1], 0 <= n ? (k[0] = (+k[0]).toExponential(n).split("e")[0], d = n) : (k[0] = k[0].split(".")[0] || 0, f = 20 > d ? (k[0] * Math.pow(10, k[1])).toFixed(d) : 0, k[1] = 0)) : d = 2;
        e = (Math.abs(k[1] ? k[0] : f) + Math.pow(10, -Math.max(d, q) - 1)).toFixed(d);
        q = String(a.pInt(e));
        n = 3 < q.length ? q.length % 3 : 0;
        t = a.pick(t, v.decimalPoint);
        l = a.pick(l, v.thousandsSep);
        f = (0 > f ? "-" : "") + (n ? q.substr(0, n) + l : "");
        f += q.substr(n).replace(/(\d{3})(?=\d)/g, "$1" + l);
        d && (f += t + e.slice(-d));
        k[1] && 0 !== +f && (f += "e" + k[1]);
        return f;
      };
      Math.easeInOutSine = function(a) {
        return -.5 * (Math.cos(Math.PI * a) - 1);
      };
      a.getStyle = function(f, d, t) {
        if ("width" === d)
          return Math.min(f.offsetWidth, f.scrollWidth) - a.getStyle(f, "padding-left") - a.getStyle(f, "padding-right");
        if ("height" === d)
          return Math.min(f.offsetHeight, f.scrollHeight) - a.getStyle(f, "padding-top") - a.getStyle(f, "padding-bottom");
        A.getComputedStyle || a.error(27, !0);
        if (f = A.getComputedStyle(f, void 0))
          f = f.getPropertyValue(d), a.pick(t, "opacity" !== d) && (f = a.pInt(f));
        return f;
      };
      a.inArray = function(f, d) {
        return (a.indexOfPolyfill || Array.prototype.indexOf).call(d, f);
      };
      a.grep = function(f, d) {
        return (a.filterPolyfill || Array.prototype.filter).call(f, d);
      };
      a.find = Array.prototype.find ? function(a, d) {
        return a.find(d);
      } : function(a, d) {
        var f,
            l = a.length;
        for (f = 0; f < l; f++)
          if (d(a[f], f))
            return a[f];
      };
      a.map = function(a, d) {
        for (var f = [],
            l = 0,
            v = a.length; l < v; l++)
          f[l] = d.call(a[l], a[l], l, a);
        return f;
      };
      a.keys = function(f) {
        return (a.keysPolyfill || Object.keys).call(void 0, f);
      };
      a.reduce = function(f, d, t) {
        return (a.reducePolyfill || Array.prototype.reduce).call(f, d, t);
      };
      a.offset = function(a) {
        var d = B.documentElement;
        a = a.parentElement ? a.getBoundingClientRect() : {
          top: 0,
          left: 0
        };
        return {
          top: a.top + (A.pageYOffset || d.scrollTop) - (d.clientTop || 0),
          left: a.left + (A.pageXOffset || d.scrollLeft) - (d.clientLeft || 0)
        };
      };
      a.stop = function(f, d) {
        for (var t = a.timers.length; t--; )
          a.timers[t].elem !== f || d && d !== a.timers[t].prop || (a.timers[t].stopped = !0);
      };
      a.each = function(f, d, t) {
        return (a.forEachPolyfill || Array.prototype.forEach).call(f, d, t);
      };
      a.objectEach = function(a, d, t) {
        for (var l in a)
          a.hasOwnProperty(l) && d.call(t, a[l], l, a);
      };
      a.isPrototype = function(f) {
        return f === a.Axis.prototype || f === a.Chart.prototype || f === a.Point.prototype || f === a.Series.prototype || f === a.Tick.prototype;
      };
      a.addEvent = function(f, d, t) {
        var l,
            v = f.addEventListener || a.addEventListenerPolyfill;
        l = a.isPrototype(f) ? "protoEvents" : "hcEvents";
        l = f[l] = f[l] || {};
        v && v.call(f, d, t, !1);
        l[d] || (l[d] = []);
        l[d].push(t);
        return function() {
          a.removeEvent(f, d, t);
        };
      };
      a.removeEvent = function(f, d, t) {
        function l(e, n) {
          var k = f.removeEventListener || a.removeEventListenerPolyfill;
          k && k.call(f, e, n, !1);
        }
        function v(e) {
          var n,
              y;
          f.nodeName && (d ? (n = {}, n[d] = !0) : n = e, a.objectEach(n, function(a, c) {
            if (e[c])
              for (y = e[c].length; y--; )
                l(c, e[c][y]);
          }));
        }
        var q,
            n;
        a.each(["protoEvents", "hcEvents"], function(e) {
          var k = f[e];
          k && (d ? (q = k[d] || [], t ? (n = a.inArray(t, q), -1 < n && (q.splice(n, 1), k[d] = q), l(d, t)) : (v(k), k[d] = [])) : (v(k), f[e] = {}));
        });
      };
      a.fireEvent = function(f, d, t, l) {
        var v,
            q,
            n,
            e,
            k;
        t = t || {};
        B.createEvent && (f.dispatchEvent || f.fireEvent) ? (v = B.createEvent("Events"), v.initEvent(d, !0, !0), a.extend(v, t), f.dispatchEvent ? f.dispatchEvent(v) : f.fireEvent(d, v)) : a.each(["protoEvents", "hcEvents"], function(l) {
          if (f[l])
            for (q = f[l][d] || [], n = q.length, t.target || a.extend(t, {
              preventDefault: function() {
                t.defaultPrevented = !0;
              },
              target: f,
              type: d
            }), e = 0; e < n; e++)
              (k = q[e]) && !1 === k.call(f, t) && t.preventDefault();
        });
        l && !t.defaultPrevented && l(t);
      };
      a.animate = function(f, d, t) {
        var l,
            v = "",
            q,
            n,
            e;
        a.isObject(t) || (e = arguments, t = {
          duration: e[2],
          easing: e[3],
          complete: e[4]
        });
        a.isNumber(t.duration) || (t.duration = 400);
        t.easing = "function" === typeof t.easing ? t.easing : Math[t.easing] || Math.easeInOutSine;
        t.curAnim = a.merge(d);
        a.objectEach(d, function(e, y) {
          a.stop(f, y);
          n = new a.Fx(f, t, y);
          q = null;
          "d" === y ? (n.paths = n.initPath(f, f.d, d.d), n.toD = d.d, l = 0, q = 1) : f.attr ? l = f.attr(y) : (l = parseFloat(a.getStyle(f, y)) || 0, "opacity" !== y && (v = "px"));
          q || (q = e);
          q && q.match && q.match("px") && (q = q.replace(/px/g, ""));
          n.run(l, q, v);
        });
      };
      a.seriesType = function(f, d, t, l, v) {
        var q = a.getOptions(),
            n = a.seriesTypes;
        q.plotOptions[f] = a.merge(q.plotOptions[d], t);
        n[f] = a.extendClass(n[d] || function() {}, l);
        n[f].prototype.type = f;
        v && (n[f].prototype.pointClass = a.extendClass(a.Point, v));
        return n[f];
      };
      a.uniqueKey = function() {
        var a = Math.random().toString(36).substring(2, 9),
            d = 0;
        return function() {
          return "highcharts-" + a + "-" + d++;
        };
      }();
      A.jQuery && (A.jQuery.fn.highcharts = function() {
        var f = [].slice.call(arguments);
        if (this[0])
          return f[0] ? (new (a[a.isString(f[0]) ? f.shift() : "Chart"])(this[0], f[0], f[1]), this) : w[a.attr(this[0], "data-highcharts-chart")];
      });
    })(I);
    (function(a) {
      var w = a.each,
          B = a.isNumber,
          A = a.map,
          f = a.merge,
          d = a.pInt;
      a.Color = function(d) {
        if (!(this instanceof a.Color))
          return new a.Color(d);
        this.init(d);
      };
      a.Color.prototype = {
        parsers: [{
          regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
          parse: function(a) {
            return [d(a[1]), d(a[2]), d(a[3]), parseFloat(a[4], 10)];
          }
        }, {
          regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
          parse: function(a) {
            return [d(a[1]), d(a[2]), d(a[3]), 1];
          }
        }],
        names: {
          none: "rgba(255,255,255,0)",
          white: "#ffffff",
          black: "#000000"
        },
        init: function(d) {
          var l,
              f,
              q,
              n;
          if ((this.input = d = this.names[d && d.toLowerCase ? d.toLowerCase() : ""] || d) && d.stops)
            this.stops = A(d.stops, function(e) {
              return new a.Color(e[1]);
            });
          else if (d && d.charAt && "#" === d.charAt() && (l = d.length, d = parseInt(d.substr(1), 16), 7 === l ? f = [(d & 16711680) >> 16, (d & 65280) >> 8, d & 255, 1] : 4 === l && (f = [(d & 3840) >> 4 | (d & 3840) >> 8, (d & 240) >> 4 | d & 240, (d & 15) << 4 | d & 15, 1])), !f)
            for (q = this.parsers.length; q-- && !f; )
              n = this.parsers[q], (l = n.regex.exec(d)) && (f = n.parse(l));
          this.rgba = f || [];
        },
        get: function(a) {
          var d = this.input,
              v = this.rgba,
              q;
          this.stops ? (q = f(d), q.stops = [].concat(q.stops), w(this.stops, function(n, e) {
            q.stops[e] = [q.stops[e][0], n.get(a)];
          })) : q = v && B(v[0]) ? "rgb" === a || !a && 1 === v[3] ? "rgb(" + v[0] + "," + v[1] + "," + v[2] + ")" : "a" === a ? v[3] : "rgba(" + v.join(",") + ")" : d;
          return q;
        },
        brighten: function(a) {
          var f,
              v = this.rgba;
          if (this.stops)
            w(this.stops, function(d) {
              d.brighten(a);
            });
          else if (B(a) && 0 !== a)
            for (f = 0; 3 > f; f++)
              v[f] += d(255 * a), 0 > v[f] && (v[f] = 0), 255 < v[f] && (v[f] = 255);
          return this;
        },
        setOpacity: function(a) {
          this.rgba[3] = a;
          return this;
        },
        tweenTo: function(a, d) {
          var f = this.rgba,
              q = a.rgba;
          q.length && f && f.length ? (a = 1 !== q[3] || 1 !== f[3], d = (a ? "rgba(" : "rgb(") + Math.round(q[0] + (f[0] - q[0]) * (1 - d)) + "," + Math.round(q[1] + (f[1] - q[1]) * (1 - d)) + "," + Math.round(q[2] + (f[2] - q[2]) * (1 - d)) + (a ? "," + (q[3] + (f[3] - q[3]) * (1 - d)) : "") + ")") : d = a.input || "none";
          return d;
        }
      };
      a.color = function(d) {
        return new a.Color(d);
      };
    })(I);
    (function(a) {
      var w = a.defined,
          B = a.each,
          A = a.extend,
          f = a.merge,
          d = a.pick,
          t = a.timeUnits,
          l = a.win;
      a.Time = function(a) {
        this.update(a, !1);
      };
      a.Time.prototype = {
        defaultOptions: {},
        update: function(v) {
          var q = d(v && v.useUTC, !0),
              n = this;
          this.options = v = f(!0, this.options || {}, v);
          this.Date = v.Date || l.Date;
          this.timezoneOffset = (this.useUTC = q) && v.timezoneOffset;
          this.getTimezoneOffset = this.timezoneOffsetFunction();
          (this.variableTimezone = !(q && !v.getTimezoneOffset && !v.timezone)) || this.timezoneOffset ? (this.get = function(a, k) {
            var e = k.getTime(),
                h = e - n.getTimezoneOffset(k);
            k.setTime(h);
            a = k["getUTC" + a]();
            k.setTime(e);
            return a;
          }, this.set = function(e, k, d) {
            var h;
            if (-1 !== a.inArray(e, ["Milliseconds", "Seconds", "Minutes"]))
              k["set" + e](d);
            else
              h = n.getTimezoneOffset(k), h = k.getTime() - h, k.setTime(h), k["setUTC" + e](d), e = n.getTimezoneOffset(k), h = k.getTime() + e, k.setTime(h);
          }) : q ? (this.get = function(a, n) {
            return n["getUTC" + a]();
          }, this.set = function(a, n, d) {
            return n["setUTC" + a](d);
          }) : (this.get = function(a, n) {
            return n["get" + a]();
          }, this.set = function(a, n, d) {
            return n["set" + a](d);
          });
        },
        makeTime: function(f, q, n, e, k, l) {
          var h,
              c,
              b;
          this.useUTC ? (h = this.Date.UTC.apply(0, arguments), c = this.getTimezoneOffset(h), h += c, b = this.getTimezoneOffset(h), c !== b ? h += b - c : c - 36E5 !== this.getTimezoneOffset(h - 36E5) || a.isSafari || (h -= 36E5)) : h = (new this.Date(f, q, d(n, 1), d(e, 0), d(k, 0), d(l, 0))).getTime();
          return h;
        },
        timezoneOffsetFunction: function() {
          var d = this,
              f = this.options,
              n = l.moment;
          if (!this.useUTC)
            return function(a) {
              return 6E4 * (new Date(a)).getTimezoneOffset();
            };
          if (f.timezone) {
            if (n)
              return function(a) {
                return 6E4 * -n.tz(a, f.timezone).utcOffset();
              };
            a.error(25);
          }
          return this.useUTC && f.getTimezoneOffset ? function(a) {
            return 6E4 * f.getTimezoneOffset(a);
          } : function() {
            return 6E4 * (d.timezoneOffset || 0);
          };
        },
        dateFormat: function(d, f, n) {
          if (!a.defined(f) || isNaN(f))
            return a.defaultOptions.lang.invalidDate || "";
          d = a.pick(d, "%Y-%m-%d %H:%M:%S");
          var e = this,
              k = new this.Date(f),
              l = this.get("Hours", k),
              h = this.get("Day", k),
              c = this.get("Date", k),
              b = this.get("Month", k),
              g = this.get("FullYear", k),
              p = a.defaultOptions.lang,
              q = p.weekdays,
              v = p.shortWeekdays,
              D = a.pad,
              k = a.extend({
                a: v ? v[h] : q[h].substr(0, 3),
                A: q[h],
                d: D(c),
                e: D(c, 2, " "),
                w: h,
                b: p.shortMonths[b],
                B: p.months[b],
                m: D(b + 1),
                y: g.toString().substr(2, 2),
                Y: g,
                H: D(l),
                k: l,
                I: D(l % 12 || 12),
                l: l % 12 || 12,
                M: D(e.get("Minutes", k)),
                p: 12 > l ? "AM" : "PM",
                P: 12 > l ? "am" : "pm",
                S: D(k.getSeconds()),
                L: D(Math.round(f % 1E3), 3)
              }, a.dateFormats);
          a.objectEach(k, function(a, b) {
            for (; -1 !== d.indexOf("%" + b); )
              d = d.replace("%" + b, "function" === typeof a ? a.call(e, f) : a);
          });
          return n ? d.substr(0, 1).toUpperCase() + d.substr(1) : d;
        },
        getTimeTicks: function(a, f, n, e) {
          var k = this,
              l = [],
              h = {},
              c,
              b = new k.Date(f),
              g = a.unitRange,
              p = a.count || 1,
              F;
          if (w(f)) {
            k.set("Milliseconds", b, g >= t.second ? 0 : p * Math.floor(k.get("Milliseconds", b) / p));
            g >= t.second && k.set("Seconds", b, g >= t.minute ? 0 : p * Math.floor(k.get("Seconds", b) / p));
            g >= t.minute && k.set("Minutes", b, g >= t.hour ? 0 : p * Math.floor(k.get("Minutes", b) / p));
            g >= t.hour && k.set("Hours", b, g >= t.day ? 0 : p * Math.floor(k.get("Hours", b) / p));
            g >= t.day && k.set("Date", b, g >= t.month ? 1 : p * Math.floor(k.get("Date", b) / p));
            g >= t.month && (k.set("Month", b, g >= t.year ? 0 : p * Math.floor(k.get("Month", b) / p)), c = k.get("FullYear", b));
            g >= t.year && k.set("FullYear", b, c - c % p);
            g === t.week && k.set("Date", b, k.get("Date", b) - k.get("Day", b) + d(e, 1));
            c = k.get("FullYear", b);
            e = k.get("Month", b);
            var q = k.get("Date", b),
                D = k.get("Hours", b);
            f = b.getTime();
            k.variableTimezone && (F = n - f > 4 * t.month || k.getTimezoneOffset(f) !== k.getTimezoneOffset(n));
            b = b.getTime();
            for (f = 1; b < n; )
              l.push(b), b = g === t.year ? k.makeTime(c + f * p, 0) : g === t.month ? k.makeTime(c, e + f * p) : !F || g !== t.day && g !== t.week ? F && g === t.hour && 1 < p ? k.makeTime(c, e, q, D + f * p) : b + g * p : k.makeTime(c, e, q + f * p * (g === t.day ? 1 : 7)), f++;
            l.push(b);
            g <= t.hour && 1E4 > l.length && B(l, function(a) {
              0 === a % 18E5 && "000000000" === k.dateFormat("%H%M%S%L", a) && (h[a] = "day");
            });
          }
          l.info = A(a, {
            higherRanks: h,
            totalRange: g * p
          });
          return l;
        }
      };
    })(I);
    (function(a) {
      var w = a.merge;
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
      a.setOptions = function(B) {
        a.defaultOptions = w(!0, a.defaultOptions, B);
        a.time.update(w(a.defaultOptions.global, a.defaultOptions.time), !1);
        return a.defaultOptions;
      };
      a.getOptions = function() {
        return a.defaultOptions;
      };
      a.defaultPlotOptions = a.defaultOptions.plotOptions;
      a.time = new a.Time(w(a.defaultOptions.global, a.defaultOptions.time));
      a.dateFormat = function(w, A, f) {
        return a.time.dateFormat(w, A, f);
      };
    })(I);
    (function(a) {
      var w,
          B,
          A = a.addEvent,
          f = a.animate,
          d = a.attr,
          t = a.charts,
          l = a.color,
          v = a.css,
          q = a.createElement,
          n = a.defined,
          e = a.deg2rad,
          k = a.destroyObjectProperties,
          y = a.doc,
          h = a.each,
          c = a.extend,
          b = a.erase,
          g = a.grep,
          p = a.hasTouch,
          F = a.inArray,
          L = a.isArray,
          D = a.isFirefox,
          H = a.isMS,
          z = a.isObject,
          u = a.isString,
          C = a.isWebKit,
          E = a.merge,
          J = a.noop,
          K = a.objectEach,
          r = a.pick,
          x = a.pInt,
          M = a.removeEvent,
          m = a.splat,
          G = a.stop,
          S = a.svg,
          Q = a.SVG_NS,
          P = a.symbolSizes,
          O = a.win;
      w = a.SVGElement = function() {
        return this;
      };
      c(w.prototype, {
        opacity: 1,
        SVG_NS: Q,
        textProps: "direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline".split(" "),
        init: function(a, b) {
          this.element = "span" === b ? q(b) : y.createElementNS(this.SVG_NS, b);
          this.renderer = a;
        },
        animate: function(b, c, m) {
          c = a.animObject(r(c, this.renderer.globalAnimation, !0));
          0 !== c.duration ? (m && (c.complete = m), f(this, b, c)) : (this.attr(b, null, m), c.step && c.step.call(this));
          return this;
        },
        colorGradient: function(b, r, c) {
          var m = this.renderer,
              x,
              N,
              g,
              e,
              p,
              u,
              k,
              d,
              f,
              G,
              M = [],
              C;
          b.radialGradient ? N = "radialGradient" : b.linearGradient && (N = "linearGradient");
          N && (g = b[N], p = m.gradients, k = b.stops, G = c.radialReference, L(g) && (b[N] = g = {
            x1: g[0],
            y1: g[1],
            x2: g[2],
            y2: g[3],
            gradientUnits: "userSpaceOnUse"
          }), "radialGradient" === N && G && !n(g.gradientUnits) && (e = g, g = E(g, m.getRadialAttr(G, e), {gradientUnits: "userSpaceOnUse"})), K(g, function(a, b) {
            "id" !== b && M.push(b, a);
          }), K(k, function(a) {
            M.push(a);
          }), M = M.join(","), p[M] ? G = p[M].attr("id") : (g.id = G = a.uniqueKey(), p[M] = u = m.createElement(N).attr(g).add(m.defs), u.radAttr = e, u.stops = [], h(k, function(b) {
            0 === b[1].indexOf("rgba") ? (x = a.color(b[1]), d = x.get("rgb"), f = x.get("a")) : (d = b[1], f = 1);
            b = m.createElement("stop").attr({
              offset: b[0],
              "stop-color": d,
              "stop-opacity": f
            }).add(u);
            u.stops.push(b);
          })), C = "url(" + m.url + "#" + G + ")", c.setAttribute(r, C), c.gradient = M, b.toString = function() {
            return C;
          });
        },
        applyTextOutline: function(r) {
          var c = this.element,
              m,
              x,
              N,
              g,
              e;
          -1 !== r.indexOf("contrast") && (r = r.replace(/contrast/g, this.renderer.getContrast(c.style.fill)));
          r = r.split(" ");
          x = r[r.length - 1];
          if ((N = r[0]) && "none" !== N && a.svg) {
            this.fakeTS = !0;
            r = [].slice.call(c.getElementsByTagName("tspan"));
            this.ySetter = this.xSetter;
            N = N.replace(/(^[\d\.]+)(.*?)$/g, function(a, b, r) {
              return 2 * b + r;
            });
            for (e = r.length; e--; )
              m = r[e], "highcharts-text-outline" === m.getAttribute("class") && b(r, c.removeChild(m));
            g = c.firstChild;
            h(r, function(a, b) {
              0 === b && (a.setAttribute("x", c.getAttribute("x")), b = c.getAttribute("y"), a.setAttribute("y", b || 0), null === b && c.setAttribute("y", 0));
              a = a.cloneNode(1);
              d(a, {
                "class": "highcharts-text-outline",
                fill: x,
                stroke: x,
                "stroke-width": N,
                "stroke-linejoin": "round"
              });
              c.insertBefore(a, g);
            });
          }
        },
        attr: function(a, b, r, c) {
          var m,
              x = this.element,
              g,
              N = this,
              h,
              e;
          "string" === typeof a && void 0 !== b && (m = a, a = {}, a[m] = b);
          "string" === typeof a ? N = (this[a + "Getter"] || this._defaultGetter).call(this, a, x) : (K(a, function(b, r) {
            h = !1;
            c || G(this, r);
            this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)$/.test(r) && (g || (this.symbolAttr(a), g = !0), h = !0);
            !this.rotation || "x" !== r && "y" !== r || (this.doTransform = !0);
            h || (e = this[r + "Setter"] || this._defaultSetter, e.call(this, b, r, x));
          }, this), this.afterSetters());
          r && r.call(this);
          return N;
        },
        afterSetters: function() {
          this.doTransform && (this.updateTransform(), this.doTransform = !1);
        },
        addClass: function(a, b) {
          var r = this.attr("class") || "";
          -1 === r.indexOf(a) && (b || (a = (r + (r ? " " : "") + a).replace("  ", " ")), this.attr("class", a));
          return this;
        },
        hasClass: function(a) {
          return -1 !== F(a, (this.attr("class") || "").split(" "));
        },
        removeClass: function(a) {
          return this.attr("class", (this.attr("class") || "").replace(a, ""));
        },
        symbolAttr: function(a) {
          var b = this;
          h("x y r start end width height innerR anchorX anchorY".split(" "), function(c) {
            b[c] = r(a[c], b[c]);
          });
          b.attr({d: b.renderer.symbols[b.symbolName](b.x, b.y, b.width, b.height, b)});
        },
        clip: function(a) {
          return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : "none");
        },
        crisp: function(a, b) {
          var r;
          b = b || a.strokeWidth || 0;
          r = Math.round(b) % 2 / 2;
          a.x = Math.floor(a.x || this.x || 0) + r;
          a.y = Math.floor(a.y || this.y || 0) + r;
          a.width = Math.floor((a.width || this.width || 0) - 2 * r);
          a.height = Math.floor((a.height || this.height || 0) - 2 * r);
          n(a.strokeWidth) && (a.strokeWidth = b);
          return a;
        },
        css: function(a) {
          var b = this.styles,
              r = {},
              m = this.element,
              g,
              h = "",
              e,
              p = !b,
              n = ["textOutline", "textOverflow", "width"];
          a && a.color && (a.fill = a.color);
          b && K(a, function(a, c) {
            a !== b[c] && (r[c] = a, p = !0);
          });
          p && (b && (a = c(b, r)), g = this.textWidth = a && a.width && "auto" !== a.width && "text" === m.nodeName.toLowerCase() && x(a.width), this.styles = a, g && !S && this.renderer.forExport && delete a.width, m.namespaceURI === this.SVG_NS ? (e = function(a, b) {
            return "-" + b.toLowerCase();
          }, K(a, function(a, b) {
            -1 === F(b, n) && (h += b.replace(/([A-Z])/g, e) + ":" + a + ";");
          }), h && d(m, "style", h)) : v(m, a), this.added && ("text" === this.element.nodeName && this.renderer.buildText(this), a && a.textOutline && this.applyTextOutline(a.textOutline)));
          return this;
        },
        getStyle: function(a) {
          return O.getComputedStyle(this.element || this, "").getPropertyValue(a);
        },
        strokeWidth: function() {
          var a = this.getStyle("stroke-width"),
              b;
          a.indexOf("px") === a.length - 2 ? a = x(a) : (b = y.createElementNS(Q, "rect"), d(b, {
            width: a,
            "stroke-width": 0
          }), this.element.parentNode.appendChild(b), a = b.getBBox().width, b.parentNode.removeChild(b));
          return a;
        },
        on: function(a, b) {
          var r = this,
              c = r.element;
          p && "click" === a ? (c.ontouchstart = function(a) {
            r.touchEventFired = Date.now();
            a.preventDefault();
            b.call(c, a);
          }, c.onclick = function(a) {
            (-1 === O.navigator.userAgent.indexOf("Android") || 1100 < Date.now() - (r.touchEventFired || 0)) && b.call(c, a);
          }) : c["on" + a] = b;
          return this;
        },
        setRadialReference: function(a) {
          var b = this.renderer.gradients[this.element.gradient];
          this.element.radialReference = a;
          b && b.radAttr && b.animate(this.renderer.getRadialAttr(a, b.radAttr));
          return this;
        },
        translate: function(a, b) {
          return this.attr({
            translateX: a,
            translateY: b
          });
        },
        invert: function(a) {
          this.inverted = a;
          this.updateTransform();
          return this;
        },
        updateTransform: function() {
          var a = this.translateX || 0,
              b = this.translateY || 0,
              c = this.scaleX,
              m = this.scaleY,
              x = this.inverted,
              g = this.rotation,
              h = this.matrix,
              e = this.element;
          x && (a += this.width, b += this.height);
          a = ["translate(" + a + "," + b + ")"];
          n(h) && a.push("matrix(" + h.join(",") + ")");
          x ? a.push("rotate(90) scale(-1,1)") : g && a.push("rotate(" + g + " " + r(this.rotationOriginX, e.getAttribute("x"), 0) + " " + r(this.rotationOriginY, e.getAttribute("y") || 0) + ")");
          (n(c) || n(m)) && a.push("scale(" + r(c, 1) + " " + r(m, 1) + ")");
          a.length && e.setAttribute("transform", a.join(" "));
        },
        toFront: function() {
          var a = this.element;
          a.parentNode.appendChild(a);
          return this;
        },
        align: function(a, c, m) {
          var x,
              g,
              h,
              e,
              p = {};
          g = this.renderer;
          h = g.alignedObjects;
          var n,
              k;
          if (a) {
            if (this.alignOptions = a, this.alignByTranslate = c, !m || u(m))
              this.alignTo = x = m || "renderer", b(h, this), h.push(this), m = null;
          } else
            a = this.alignOptions, c = this.alignByTranslate, x = this.alignTo;
          m = r(m, g[x], g);
          x = a.align;
          g = a.verticalAlign;
          h = (m.x || 0) + (a.x || 0);
          e = (m.y || 0) + (a.y || 0);
          "right" === x ? n = 1 : "center" === x && (n = 2);
          n && (h += (m.width - (a.width || 0)) / n);
          p[c ? "translateX" : "x"] = Math.round(h);
          "bottom" === g ? k = 1 : "middle" === g && (k = 2);
          k && (e += (m.height - (a.height || 0)) / k);
          p[c ? "translateY" : "y"] = Math.round(e);
          this[this.placed ? "animate" : "attr"](p);
          this.placed = !0;
          this.alignAttr = p;
          return this;
        },
        getBBox: function(a, b) {
          var m,
              x = this.renderer,
              g,
              p = this.element,
              u = this.styles,
              k,
              N = this.textStr,
              d,
              G = x.cache,
              f = x.cacheKeys,
              E;
          b = r(b, this.rotation);
          g = b * e;
          k = p && w.prototype.getStyle.call(p, "font-size");
          n(N) && (E = N.toString(), -1 === E.indexOf("\x3c") && (E = E.replace(/[0-9]/g, "0")), E += ["", b || 0, k, u && u.width, u && u.textOverflow].join());
          E && !a && (m = G[E]);
          if (!m) {
            if (p.namespaceURI === this.SVG_NS || x.forExport) {
              try {
                (d = this.fakeTS && function(a) {
                  h(p.querySelectorAll(".highcharts-text-outline"), function(b) {
                    b.style.display = a;
                  });
                }) && d("none"), m = p.getBBox ? c({}, p.getBBox()) : {
                  width: p.offsetWidth,
                  height: p.offsetHeight
                }, d && d("");
              } catch (V) {}
              if (!m || 0 > m.width)
                m = {
                  width: 0,
                  height: 0
                };
            } else
              m = this.htmlGetBBox();
            x.isSVG && (a = m.width, x = m.height, u && "11px" === u.fontSize && 17 === Math.round(x) && (m.height = x = 14), b && (m.width = Math.abs(x * Math.sin(g)) + Math.abs(a * Math.cos(g)), m.height = Math.abs(x * Math.cos(g)) + Math.abs(a * Math.sin(g))));
            if (E && 0 < m.height) {
              for (; 250 < f.length; )
                delete G[f.shift()];
              G[E] || f.push(E);
              G[E] = m;
            }
          }
          return m;
        },
        show: function(a) {
          return this.attr({visibility: a ? "inherit" : "visible"});
        },
        hide: function() {
          return this.attr({visibility: "hidden"});
        },
        fadeOut: function(a) {
          var b = this;
          b.animate({opacity: 0}, {
            duration: a || 150,
            complete: function() {
              b.attr({y: -9999});
            }
          });
        },
        add: function(a) {
          var b = this.renderer,
              r = this.element,
              m;
          a && (this.parentGroup = a);
          this.parentInverted = a && a.inverted;
          void 0 !== this.textStr && b.buildText(this);
          this.added = !0;
          if (!a || a.handleZ || this.zIndex)
            m = this.zIndexSetter();
          m || (a ? a.element : b.box).appendChild(r);
          if (this.onAdd)
            this.onAdd();
          return this;
        },
        safeRemoveChild: function(a) {
          var b = a.parentNode;
          b && b.removeChild(a);
        },
        destroy: function() {
          var a = this,
              r = a.element || {},
              m = a.renderer.isSVG && "SPAN" === r.nodeName && a.parentGroup,
              c = r.ownerSVGElement,
              x = a.clipPath;
          r.onclick = r.onmouseout = r.onmouseover = r.onmousemove = r.point = null;
          G(a);
          x && c && (h(c.querySelectorAll("[clip-path],[CLIP-PATH]"), function(a) {
            var b = a.getAttribute("clip-path"),
                r = x.element.id;
            (-1 < b.indexOf("(#" + r + ")") || -1 < b.indexOf('("#' + r + '")')) && a.removeAttribute("clip-path");
          }), a.clipPath = x.destroy());
          if (a.stops) {
            for (c = 0; c < a.stops.length; c++)
              a.stops[c] = a.stops[c].destroy();
            a.stops = null;
          }
          for (a.safeRemoveChild(r); m && m.div && 0 === m.div.childNodes.length; )
            r = m.parentGroup, a.safeRemoveChild(m.div), delete m.div, m = r;
          a.alignTo && b(a.renderer.alignedObjects, a);
          K(a, function(b, r) {
            delete a[r];
          });
          return null;
        },
        xGetter: function(a) {
          "circle" === this.element.nodeName && ("x" === a ? a = "cx" : "y" === a && (a = "cy"));
          return this._defaultGetter(a);
        },
        _defaultGetter: function(a) {
          a = r(this[a + "Value"], this[a], this.element ? this.element.getAttribute(a) : null, 0);
          /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a));
          return a;
        },
        dSetter: function(a, b, r) {
          a && a.join && (a = a.join(" "));
          /(NaN| {2}|^$)/.test(a) && (a = "M 0 0");
          this[b] !== a && (r.setAttribute(b, a), this[b] = a);
        },
        alignSetter: function(a) {
          this.alignValue = a;
          this.element.setAttribute("text-anchor", {
            left: "start",
            center: "middle",
            right: "end"
          }[a]);
        },
        opacitySetter: function(a, b, r) {
          this[b] = a;
          r.setAttribute(b, a);
        },
        titleSetter: function(a) {
          var b = this.element.getElementsByTagName("title")[0];
          b || (b = y.createElementNS(this.SVG_NS, "title"), this.element.appendChild(b));
          b.firstChild && b.removeChild(b.firstChild);
          b.appendChild(y.createTextNode(String(r(a), "").replace(/<[^>]*>/g, "").replace(/&lt;/g, "\x3c").replace(/&gt;/g, "\x3e")));
        },
        textSetter: function(a) {
          a !== this.textStr && (delete this.bBox, this.textStr = a, this.added && this.renderer.buildText(this));
        },
        fillSetter: function(a, b, r) {
          "string" === typeof a ? r.setAttribute(b, a) : a && this.colorGradient(a, b, r);
        },
        visibilitySetter: function(a, b, r) {
          "inherit" === a ? r.removeAttribute(b) : this[b] !== a && r.setAttribute(b, a);
          this[b] = a;
        },
        zIndexSetter: function(a, b) {
          var r = this.renderer,
              m = this.parentGroup,
              c = (m || r).element || r.box,
              g,
              h = this.element,
              e,
              p,
              r = c === r.box;
          g = this.added;
          var u;
          n(a) && (h.zIndex = a, a = +a, this[b] === a && (g = !1), this[b] = a);
          if (g) {
            (a = this.zIndex) && m && (m.handleZ = !0);
            b = c.childNodes;
            for (u = b.length - 1; 0 <= u && !e; u--)
              if (m = b[u], g = m.zIndex, p = !n(g), m !== h)
                if (0 > a && p && !r && !u)
                  c.insertBefore(h, b[u]), e = !0;
                else if (x(g) <= a || p && (!n(a) || 0 <= a))
                  c.insertBefore(h, b[u + 1] || null), e = !0;
            e || (c.insertBefore(h, b[r ? 3 : 0] || null), e = !0);
          }
          return e;
        },
        _defaultSetter: function(a, b, r) {
          r.setAttribute(b, a);
        }
      });
      w.prototype.yGetter = w.prototype.xGetter;
      w.prototype.translateXSetter = w.prototype.translateYSetter = w.prototype.rotationSetter = w.prototype.verticalAlignSetter = w.prototype.rotationOriginXSetter = w.prototype.rotationOriginYSetter = w.prototype.scaleXSetter = w.prototype.scaleYSetter = w.prototype.matrixSetter = function(a, b) {
        this[b] = a;
        this.doTransform = !0;
      };
      B = a.SVGRenderer = function() {
        this.init.apply(this, arguments);
      };
      c(B.prototype, {
        Element: w,
        SVG_NS: Q,
        init: function(a, b, r, m, c, x) {
          var g;
          m = this.createElement("svg").attr({
            version: "1.1",
            "class": "highcharts-root"
          });
          g = m.element;
          a.appendChild(g);
          d(a, "dir", "ltr");
          -1 === a.innerHTML.indexOf("xmlns") && d(g, "xmlns", this.SVG_NS);
          this.isSVG = !0;
          this.box = g;
          this.boxWrapper = m;
          this.alignedObjects = [];
          this.url = (D || C) && y.getElementsByTagName("base").length ? O.location.href.replace(/#.*?$/, "").replace(/<[^>]*>/g, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "";
          this.createElement("desc").add().element.appendChild(y.createTextNode("Created with Highmaps 6.0.7"));
          this.defs = this.createElement("defs").add();
          this.allowHTML = x;
          this.forExport = c;
          this.gradients = {};
          this.cache = {};
          this.cacheKeys = [];
          this.imgCount = 0;
          this.setSize(b, r, !1);
          var h;
          D && a.getBoundingClientRect && (b = function() {
            v(a, {
              left: 0,
              top: 0
            });
            h = a.getBoundingClientRect();
            v(a, {
              left: Math.ceil(h.left) - h.left + "px",
              top: Math.ceil(h.top) - h.top + "px"
            });
          }, b(), this.unSubPixelFix = A(O, "resize", b));
        },
        definition: function(a) {
          function b(a, c) {
            var x;
            h(m(a), function(a) {
              var m = r.createElement(a.tagName),
                  g = {};
              K(a, function(a, b) {
                "tagName" !== b && "children" !== b && "textContent" !== b && (g[b] = a);
              });
              m.attr(g);
              m.add(c || r.defs);
              a.textContent && m.element.appendChild(y.createTextNode(a.textContent));
              b(a.children || [], m);
              x = m;
            });
            return x;
          }
          var r = this;
          return b(a);
        },
        isHidden: function() {
          return !this.boxWrapper.getBBox().width;
        },
        destroy: function() {
          var a = this.defs;
          this.box = null;
          this.boxWrapper = this.boxWrapper.destroy();
          k(this.gradients || {});
          this.gradients = null;
          a && (this.defs = a.destroy());
          this.unSubPixelFix && this.unSubPixelFix();
          return this.alignedObjects = null;
        },
        createElement: function(a) {
          var b = new this.Element;
          b.init(this, a);
          return b;
        },
        draw: J,
        getRadialAttr: function(a, b) {
          return {
            cx: a[0] - a[2] / 2 + b.cx * a[2],
            cy: a[1] - a[2] / 2 + b.cy * a[2],
            r: b.r * a[2]
          };
        },
        getSpanWidth: function(a) {
          return a.getBBox(!0).width;
        },
        applyEllipsis: function(a, b, r, m) {
          var c = a.rotation,
              x = r,
              g,
              h = 0,
              e = r.length,
              p = function(a) {
                b.removeChild(b.firstChild);
                a && b.appendChild(y.createTextNode(a));
              },
              u;
          a.rotation = 0;
          x = this.getSpanWidth(a, b);
          if (u = x > m) {
            for (; h <= e; )
              g = Math.ceil((h + e) / 2), x = r.substring(0, g) + "\u2026", p(x), x = this.getSpanWidth(a, b), h === e ? h = e + 1 : x > m ? e = g - 1 : h = g;
            0 === e && p("");
          }
          a.rotation = c;
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
          var b = a.element,
              m = this,
              c = m.forExport,
              e = r(a.textStr, "").toString(),
              p = -1 !== e.indexOf("\x3c"),
              u = b.childNodes,
              n,
              k,
              G,
              f,
              E = d(b, "x"),
              M = a.styles,
              C = a.textWidth,
              l = M && M.lineHeight,
              D = M && M.textOutline,
              z = M && "ellipsis" === M.textOverflow,
              J = M && "nowrap" === M.whiteSpace,
              H,
              q = u.length,
              N = C && !a.added && this.box,
              t = function(a) {
                return l ? x(l) : m.fontMetrics(void 0, a.getAttribute("style") ? a : b).h;
              },
              L = function(a, b) {
                K(m.escapes, function(r, m) {
                  b && -1 !== F(r, b) || (a = a.toString().replace(new RegExp(r, "g"), m));
                });
                return a;
              },
              M = [e, z, J, l, D, M && M.fontSize, C].join();
          if (M !== a.textCache) {
            for (a.textCache = M; q--; )
              b.removeChild(u[q]);
            p || D || z || C || -1 !== e.indexOf(" ") ? (n = /<.*class="([^"]+)".*>/, k = /<.*style="([^"]+)".*>/, G = /<.*href="([^"]+)".*>/, N && N.appendChild(b), e = p ? e.replace(/<(b|strong)>/g, '\x3cspan class\x3d"highcharts-strong"\x3e').replace(/<(i|em)>/g, '\x3cspan class\x3d"highcharts-emphasized"\x3e').replace(/<a/g, "\x3cspan").replace(/<\/(b|strong|i|em|a)>/g, "\x3c/span\x3e").split(/<br.*?>/g) : [e], e = g(e, function(a) {
              return "" !== a;
            }), h(e, function(r, x) {
              var g,
                  e = 0;
              r = r.replace(/^\s+|\s+$/g, "").replace(/<span/g, "|||\x3cspan").replace(/<\/span>/g, "\x3c/span\x3e|||");
              g = r.split("|||");
              h(g, function(r) {
                if ("" !== r || 1 === g.length) {
                  var h = {},
                      p = y.createElementNS(m.SVG_NS, "tspan"),
                      u,
                      M;
                  n.test(r) && (u = r.match(n)[1], d(p, "class", u));
                  k.test(r) && (M = r.match(k)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), d(p, "style", M));
                  G.test(r) && !c && (d(p, "onclick", 'location.href\x3d"' + r.match(G)[1] + '"'), d(p, "class", "highcharts-anchor"));
                  r = L(r.replace(/<[a-zA-Z\/](.|\n)*?>/g, "") || " ");
                  if (" " !== r) {
                    p.appendChild(y.createTextNode(r));
                    e ? h.dx = 0 : x && null !== E && (h.x = E);
                    d(p, h);
                    b.appendChild(p);
                    !e && H && (!S && c && v(p, {display: "block"}), d(p, "dy", t(p)));
                    if (C) {
                      h = r.replace(/([^\^])-/g, "$1- ").split(" ");
                      u = 1 < g.length || x || 1 < h.length && !J;
                      var l = [],
                          D,
                          q = t(p),
                          N = a.rotation;
                      for (z && (f = m.applyEllipsis(a, p, r, C)); !z && u && (h.length || l.length); )
                        a.rotation = 0, D = m.getSpanWidth(a, p), r = D > C, void 0 === f && (f = r), r && 1 !== h.length ? (p.removeChild(p.firstChild), l.unshift(h.pop())) : (h = l, l = [], h.length && !J && (p = y.createElementNS(Q, "tspan"), d(p, {
                          dy: q,
                          x: E
                        }), M && d(p, "style", M), b.appendChild(p)), D > C && (C = D)), h.length && p.appendChild(y.createTextNode(h.join(" ").replace(/- /g, "-")));
                      a.rotation = N;
                    }
                    e++;
                  }
                }
              });
              H = H || b.childNodes.length;
            }), f && a.attr("title", L(a.textStr, ["\x26lt;", "\x26gt;"])), N && N.removeChild(b), D && a.applyTextOutline && a.applyTextOutline(D)) : b.appendChild(y.createTextNode(L(e)));
          }
        },
        getContrast: function(a) {
          a = l(a).rgba;
          return 510 < a[0] + a[1] + a[2] ? "#000000" : "#FFFFFF";
        },
        button: function(a, b, r, m, c, x, g, h, e) {
          var p = this.label(a, b, r, e, null, null, null, null, "button"),
              u = 0;
          p.attr(E({
            padding: 8,
            r: 2
          }, c));
          A(p.element, H ? "mouseover" : "mouseenter", function() {
            3 !== u && p.setState(1);
          });
          A(p.element, H ? "mouseout" : "mouseleave", function() {
            3 !== u && p.setState(u);
          });
          p.setState = function(a) {
            1 !== a && (p.state = u = a);
            p.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][a || 0]);
          };
          return p.on("click", function(a) {
            3 !== u && m.call(p, a);
          });
        },
        crispLine: function(a, b) {
          a[1] === a[4] && (a[1] = a[4] = Math.round(a[1]) - b % 2 / 2);
          a[2] === a[5] && (a[2] = a[5] = Math.round(a[2]) + b % 2 / 2);
          return a;
        },
        path: function(a) {
          var b = {};
          L(a) ? b.d = a : z(a) && c(b, a);
          return this.createElement("path").attr(b);
        },
        circle: function(a, b, r) {
          a = z(a) ? a : {
            x: a,
            y: b,
            r: r
          };
          b = this.createElement("circle");
          b.xSetter = b.ySetter = function(a, b, r) {
            r.setAttribute("c" + b, a);
          };
          return b.attr(a);
        },
        arc: function(a, b, r, m, c, x) {
          z(a) ? (m = a, b = m.y, r = m.r, a = m.x) : m = {
            innerR: m,
            start: c,
            end: x
          };
          a = this.symbol("arc", a, b, r, r, m);
          a.r = r;
          return a;
        },
        rect: function(a, b, r, m, c, x) {
          c = z(a) ? a.r : c;
          x = this.createElement("rect");
          a = z(a) ? a : void 0 === a ? {} : {
            x: a,
            y: b,
            width: Math.max(r, 0),
            height: Math.max(m, 0)
          };
          c && (a.r = c);
          x.rSetter = function(a, b, r) {
            d(r, {
              rx: a,
              ry: a
            });
          };
          return x.attr(a);
        },
        setSize: function(a, b, m) {
          var c = this.alignedObjects,
              x = c.length;
          this.width = a;
          this.height = b;
          for (this.boxWrapper.animate({
            width: a,
            height: b
          }, {
            step: function() {
              this.attr({viewBox: "0 0 " + this.attr("width") + " " + this.attr("height")});
            },
            duration: r(m, !0) ? void 0 : 0
          }); x--; )
            c[x].align();
        },
        g: function(a) {
          var b = this.createElement("g");
          return a ? b.attr({"class": "highcharts-" + a}) : b;
        },
        image: function(a, b, r, m, x) {
          var g = {preserveAspectRatio: "none"};
          1 < arguments.length && c(g, {
            x: b,
            y: r,
            width: m,
            height: x
          });
          g = this.createElement("image").attr(g);
          g.element.setAttributeNS ? g.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", a) : g.element.setAttribute("hc-svg-href", a);
          return g;
        },
        symbol: function(a, b, m, x, g, p) {
          var e = this,
              u,
              k = /^url\((.*?)\)$/,
              d = k.test(a),
              G = !d && (this.symbols[a] ? a : "circle"),
              f = G && this.symbols[G],
              M = n(b) && f && f.call(this.symbols, Math.round(b), Math.round(m), x, g, p),
              E,
              C;
          f ? (u = this.path(M), c(u, {
            symbolName: G,
            x: b,
            y: m,
            width: x,
            height: g
          }), p && c(u, p)) : d && (E = a.match(k)[1], u = this.image(E), u.imgwidth = r(P[E] && P[E].width, p && p.width), u.imgheight = r(P[E] && P[E].height, p && p.height), C = function() {
            u.attr({
              width: u.width,
              height: u.height
            });
          }, h(["width", "height"], function(a) {
            u[a + "Setter"] = function(a, b) {
              var r = {},
                  m = this["img" + b],
                  c = "width" === b ? "translateX" : "translateY";
              this[b] = a;
              n(m) && (this.element && this.element.setAttribute(b, m), this.alignByTranslate || (r[c] = ((this[b] || 0) - m) / 2, this.attr(r)));
            };
          }), n(b) && u.attr({
            x: b,
            y: m
          }), u.isImg = !0, n(u.imgwidth) && n(u.imgheight) ? C() : (u.attr({
            width: 0,
            height: 0
          }), q("img", {
            onload: function() {
              var a = t[e.chartIndex];
              0 === this.width && (v(this, {
                position: "absolute",
                top: "-999em"
              }), y.body.appendChild(this));
              P[E] = {
                width: this.width,
                height: this.height
              };
              u.imgwidth = this.width;
              u.imgheight = this.height;
              u.element && C();
              this.parentNode && this.parentNode.removeChild(this);
              e.imgCount--;
              if (!e.imgCount && a && a.onload)
                a.onload();
            },
            src: E
          }), this.imgCount++));
          return u;
        },
        symbols: {
          circle: function(a, b, r, m) {
            return this.arc(a + r / 2, b + m / 2, r / 2, m / 2, {
              start: 0,
              end: 2 * Math.PI,
              open: !1
            });
          },
          square: function(a, b, r, m) {
            return ["M", a, b, "L", a + r, b, a + r, b + m, a, b + m, "Z"];
          },
          triangle: function(a, b, r, m) {
            return ["M", a + r / 2, b, "L", a + r, b + m, a, b + m, "Z"];
          },
          "triangle-down": function(a, b, r, m) {
            return ["M", a, b, "L", a + r, b, a + r / 2, b + m, "Z"];
          },
          diamond: function(a, b, r, m) {
            return ["M", a + r / 2, b, "L", a + r, b + m / 2, a + r / 2, b + m, a, b + m / 2, "Z"];
          },
          arc: function(a, b, m, c, x) {
            var g = x.start,
                h = x.r || m,
                p = x.r || c || m,
                e = x.end - .001;
            m = x.innerR;
            c = r(x.open, .001 > Math.abs(x.end - x.start - 2 * Math.PI));
            var u = Math.cos(g),
                k = Math.sin(g),
                d = Math.cos(e),
                e = Math.sin(e);
            x = .001 > x.end - g - Math.PI ? 0 : 1;
            h = ["M", a + h * u, b + p * k, "A", h, p, 0, x, 1, a + h * d, b + p * e];
            n(m) && h.push(c ? "M" : "L", a + m * d, b + m * e, "A", m, m, 0, x, 0, a + m * u, b + m * k);
            h.push(c ? "" : "Z");
            return h;
          },
          callout: function(a, b, r, m, c) {
            var x = Math.min(c && c.r || 0, r, m),
                g = x + 6,
                h = c && c.anchorX;
            c = c && c.anchorY;
            var p;
            p = ["M", a + x, b, "L", a + r - x, b, "C", a + r, b, a + r, b, a + r, b + x, "L", a + r, b + m - x, "C", a + r, b + m, a + r, b + m, a + r - x, b + m, "L", a + x, b + m, "C", a, b + m, a, b + m, a, b + m - x, "L", a, b + x, "C", a, b, a, b, a + x, b];
            h && h > r ? c > b + g && c < b + m - g ? p.splice(13, 3, "L", a + r, c - 6, a + r + 6, c, a + r, c + 6, a + r, b + m - x) : p.splice(13, 3, "L", a + r, m / 2, h, c, a + r, m / 2, a + r, b + m - x) : h && 0 > h ? c > b + g && c < b + m - g ? p.splice(33, 3, "L", a, c + 6, a - 6, c, a, c - 6, a, b + x) : p.splice(33, 3, "L", a, m / 2, h, c, a, m / 2, a, b + x) : c && c > m && h > a + g && h < a + r - g ? p.splice(23, 3, "L", h + 6, b + m, h, b + m + 6, h - 6, b + m, a + x, b + m) : c && 0 > c && h > a + g && h < a + r - g && p.splice(3, 3, "L", h - 6, b, h, b - 6, h + 6, b, r - x, b);
            return p;
          }
        },
        clipRect: function(b, r, m, c) {
          var x = a.uniqueKey(),
              g = this.createElement("clipPath").attr({id: x}).add(this.defs);
          b = this.rect(b, r, m, c, 0).add(g);
          b.id = x;
          b.clipPath = g;
          b.count = 0;
          return b;
        },
        text: function(a, b, r, m) {
          var c = {};
          if (m && (this.allowHTML || !this.forExport))
            return this.html(a, b, r);
          c.x = Math.round(b || 0);
          r && (c.y = Math.round(r));
          if (a || 0 === a)
            c.text = a;
          a = this.createElement("text").attr(c);
          m || (a.xSetter = function(a, b, r) {
            var m = r.getElementsByTagName("tspan"),
                c,
                x = r.getAttribute(b),
                g;
            for (g = 0; g < m.length; g++)
              c = m[g], c.getAttribute(b) === x && c.setAttribute(b, a);
            r.setAttribute(b, a);
          });
          return a;
        },
        fontMetrics: function(a, b) {
          a = b && w.prototype.getStyle.call(b, "font-size");
          a = /px/.test(a) ? x(a) : /em/.test(a) ? parseFloat(a) * (b ? this.fontMetrics(null, b.parentNode).f : 16) : 12;
          b = 24 > a ? a + 3 : Math.round(1.2 * a);
          return {
            h: b,
            b: Math.round(.8 * b),
            f: a
          };
        },
        rotCorr: function(a, b, r) {
          var m = a;
          b && r && (m = Math.max(m * Math.cos(b * e), 4));
          return {
            x: -a / 3 * Math.sin(b * e),
            y: m
          };
        },
        label: function(b, r, m, x, g, p, e, u, k) {
          var d = this,
              G = d.g("button" !== k && "label"),
              f = G.text = d.text("", 0, 0, e).attr({zIndex: 1}),
              C,
              l,
              D = 0,
              z = 3,
              J = 0,
              H,
              q,
              S,
              F,
              y,
              K = {},
              Q,
              v = /^url\((.*?)\)$/.test(x),
              t = v,
              L,
              N,
              P,
              O;
          k && G.addClass("highcharts-" + k);
          t = !0;
          L = function() {
            return C.strokeWidth() % 2 / 2;
          };
          N = function() {
            var a = f.element.style,
                b = {};
            l = (void 0 === H || void 0 === q || y) && n(f.textStr) && f.getBBox();
            G.width = (H || l.width || 0) + 2 * z + J;
            G.height = (q || l.height || 0) + 2 * z;
            Q = z + d.fontMetrics(a && a.fontSize, f).b;
            t && (C || (G.box = C = d.symbols[x] || v ? d.symbol(x) : d.rect(), C.addClass(("button" === k ? "" : "highcharts-label-box") + (k ? " highcharts-" + k + "-box" : "")), C.add(G), a = L(), b.x = a, b.y = (u ? -Q : 0) + a), b.width = Math.round(G.width), b.height = Math.round(G.height), C.attr(c(b, K)), K = {});
          };
          P = function() {
            var a = J + z,
                b;
            b = u ? 0 : Q;
            n(H) && l && ("center" === y || "right" === y) && (a += {
              center: .5,
              right: 1
            }[y] * (H - l.width));
            if (a !== f.x || b !== f.y)
              f.attr("x", a), void 0 !== b && f.attr("y", b);
            f.x = a;
            f.y = b;
          };
          O = function(a, b) {
            C ? C.attr(a, b) : K[a] = b;
          };
          G.onAdd = function() {
            f.add(G);
            G.attr({
              text: b || 0 === b ? b : "",
              x: r,
              y: m
            });
            C && n(g) && G.attr({
              anchorX: g,
              anchorY: p
            });
          };
          G.widthSetter = function(b) {
            H = a.isNumber(b) ? b : null;
          };
          G.heightSetter = function(a) {
            q = a;
          };
          G["text-alignSetter"] = function(a) {
            y = a;
          };
          G.paddingSetter = function(a) {
            n(a) && a !== z && (z = G.padding = a, P());
          };
          G.paddingLeftSetter = function(a) {
            n(a) && a !== J && (J = a, P());
          };
          G.alignSetter = function(a) {
            a = {
              left: 0,
              center: .5,
              right: 1
            }[a];
            a !== D && (D = a, l && G.attr({x: S}));
          };
          G.textSetter = function(a) {
            void 0 !== a && f.textSetter(a);
            N();
            P();
          };
          G["stroke-widthSetter"] = function(a, b) {
            a && (t = !0);
            this["stroke-width"] = a;
            O(b, a);
          };
          G.rSetter = function(a, b) {
            O(b, a);
          };
          G.anchorXSetter = function(a, b) {
            g = G.anchorX = a;
            O(b, Math.round(a) - L() - S);
          };
          G.anchorYSetter = function(a, b) {
            p = G.anchorY = a;
            O(b, a - F);
          };
          G.xSetter = function(a) {
            G.x = a;
            D && (a -= D * ((H || l.width) + 2 * z));
            S = Math.round(a);
            G.attr("translateX", S);
          };
          G.ySetter = function(a) {
            F = G.y = Math.round(a);
            G.attr("translateY", F);
          };
          var A = G.css;
          return c(G, {
            css: function(a) {
              if (a) {
                var b = {};
                a = E(a);
                h(G.textProps, function(r) {
                  void 0 !== a[r] && (b[r] = a[r], delete a[r]);
                });
                f.css(b);
              }
              return A.call(G, a);
            },
            getBBox: function() {
              return {
                width: l.width + 2 * z,
                height: l.height + 2 * z,
                x: l.x - z,
                y: l.y - z
              };
            },
            destroy: function() {
              M(G.element, "mouseenter");
              M(G.element, "mouseleave");
              f && (f = f.destroy());
              C && (C = C.destroy());
              w.prototype.destroy.call(G);
              G = d = N = P = O = null;
            }
          });
        }
      });
      a.Renderer = B;
    })(I);
    (function(a) {
      var w = a.attr,
          B = a.createElement,
          A = a.css,
          f = a.defined,
          d = a.each,
          t = a.extend,
          l = a.isFirefox,
          v = a.isMS,
          q = a.isWebKit,
          n = a.pick,
          e = a.pInt,
          k = a.SVGRenderer,
          y = a.win,
          h = a.wrap;
      t(a.SVGElement.prototype, {
        htmlCss: function(a) {
          var b = this.element;
          if (b = a && "SPAN" === b.tagName && a.width)
            delete a.width, this.textWidth = b, this.updateTransform();
          a && "ellipsis" === a.textOverflow && (a.whiteSpace = "nowrap", a.overflow = "hidden");
          this.styles = t(this.styles, a);
          A(this.element, a);
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
                g = this.x || 0,
                h = this.y || 0,
                n = this.textAlign || "left",
                k = {
                  left: 0,
                  center: .5,
                  right: 1
                }[n],
                l = this.styles,
                H = l && l.whiteSpace;
            A(b, {
              marginLeft: this.translateX || 0,
              marginTop: this.translateY || 0
            });
            this.inverted && d(b.childNodes, function(c) {
              a.invertChild(c, b);
            });
            if ("SPAN" === b.tagName) {
              var l = this.rotation,
                  z = this.textWidth && e(this.textWidth),
                  u = [l, n, b.innerHTML, this.textWidth, this.textAlign].join(),
                  C;
              (C = z !== this.oldTextWidth) && !(C = z > this.oldTextWidth) && ((C = this.textPxLength) || (A(b, {
                width: "",
                whiteSpace: H || "nowrap"
              }), C = b.offsetWidth), C = C > z);
              C && /[ \-]/.test(b.textContent || b.innerText) && (A(b, {
                width: z + "px",
                display: "block",
                whiteSpace: H || "normal"
              }), this.oldTextWidth = z);
              u !== this.cTT && (H = a.fontMetrics(b.style.fontSize).b, f(l) && l !== (this.oldRotation || 0) && this.setSpanRotation(l, k, H), this.getSpanCorrection(this.textPxLength || b.offsetWidth, H, k, l, n));
              A(b, {
                left: g + (this.xCorr || 0) + "px",
                top: h + (this.yCorr || 0) + "px"
              });
              this.cTT = u;
              this.oldRotation = l;
            }
          } else
            this.alignOnAdd = !0;
        },
        setSpanRotation: function(a, b, g) {
          var c = {},
              h = this.renderer.getTransformKey();
          c[h] = c.transform = "rotate(" + a + "deg)";
          c[h + (l ? "Origin" : "-origin")] = c.transformOrigin = 100 * b + "% " + g + "px";
          A(this.element, c);
        },
        getSpanCorrection: function(a, b, g) {
          this.xCorr = -a * g;
          this.yCorr = -b;
        }
      });
      t(k.prototype, {
        getTransformKey: function() {
          return v && !/Edge/.test(y.navigator.userAgent) ? "-ms-transform" : q ? "-webkit-transform" : l ? "MozTransform" : y.opera ? "-o-transform" : "";
        },
        html: function(a, b, g) {
          var c = this.createElement("span"),
              e = c.element,
              k = c.renderer,
              f = k.isSVG,
              l = function(a, b) {
                d(["opacity", "visibility"], function(c) {
                  h(a, c + "Setter", function(a, c, g, r) {
                    a.call(this, c, g, r);
                    b[g] = c;
                  });
                });
              };
          c.textSetter = function(a) {
            a !== e.innerHTML && delete this.bBox;
            this.textStr = a;
            e.innerHTML = n(a, "");
            c.doTransform = !0;
          };
          f && l(c, c.element.style);
          c.xSetter = c.ySetter = c.alignSetter = c.rotationSetter = function(a, b) {
            "align" === b && (b = "textAlign");
            c[b] = a;
            c.doTransform = !0;
          };
          c.afterSetters = function() {
            this.doTransform && (this.htmlUpdateTransform(), this.doTransform = !1);
          };
          c.attr({
            text: a,
            x: Math.round(b),
            y: Math.round(g)
          }).css({position: "absolute"});
          e.style.whiteSpace = "nowrap";
          c.css = c.htmlCss;
          f && (c.add = function(a) {
            var b,
                g = k.box.parentNode,
                h = [];
            if (this.parentGroup = a) {
              if (b = a.div, !b) {
                for (; a; )
                  h.push(a), a = a.parentGroup;
                d(h.reverse(), function(a) {
                  function e(b, m) {
                    a[m] = b;
                    "translateX" === m ? r.left = b + "px" : r.top = b + "px";
                    a.doTransform = !0;
                  }
                  var r,
                      x = w(a.element, "class");
                  x && (x = {className: x});
                  b = a.div = a.div || B("div", x, {
                    position: "absolute",
                    left: (a.translateX || 0) + "px",
                    top: (a.translateY || 0) + "px",
                    display: a.display,
                    opacity: a.opacity,
                    pointerEvents: a.styles && a.styles.pointerEvents
                  }, b || g);
                  r = b.style;
                  t(a, {
                    classSetter: function(a) {
                      return function(b) {
                        this.element.setAttribute("class", b);
                        a.className = b;
                      };
                    }(b),
                    on: function() {
                      h[0].div && c.on.apply({element: h[0].div}, arguments);
                      return a;
                    },
                    translateXSetter: e,
                    translateYSetter: e
                  });
                  l(a, r);
                });
              }
            } else
              b = g;
            b.appendChild(e);
            c.added = !0;
            c.alignOnAdd && c.htmlUpdateTransform();
            return c;
          });
          return c;
        }
      });
    })(I);
    (function(a) {
      var w = a.correctFloat,
          B = a.defined,
          A = a.destroyObjectProperties,
          f = a.isNumber,
          d = a.pick,
          t = a.deg2rad;
      a.Tick = function(a, d, f, n) {
        this.axis = a;
        this.pos = d;
        this.type = f || "";
        this.isNewLabel = this.isNew = !0;
        f || n || this.addLabel();
      };
      a.Tick.prototype = {
        addLabel: function() {
          var a = this.axis,
              f = a.options,
              q = a.chart,
              n = a.categories,
              e = a.names,
              k = this.pos,
              y = f.labels,
              h = a.tickPositions,
              c = k === h[0],
              b = k === h[h.length - 1],
              e = n ? d(n[k], e[k], k) : k,
              n = this.label,
              h = h.info,
              g;
          a.isDatetimeAxis && h && (g = f.dateTimeLabelFormats[h.higherRanks[k] || h.unitName]);
          this.isFirst = c;
          this.isLast = b;
          f = a.labelFormatter.call({
            axis: a,
            chart: q,
            isFirst: c,
            isLast: b,
            dateTimeLabelFormat: g,
            value: a.isLog ? w(a.lin2log(e)) : e,
            pos: k
          });
          if (B(n))
            n && n.attr({text: f});
          else {
            if (this.label = n = B(f) && y.enabled ? q.renderer.text(f, 0, 0, y.useHTML).add(a.labelGroup) : null)
              n.textPxLength = n.getBBox().width;
            this.rotation = 0;
          }
        },
        getLabelSize: function() {
          return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0;
        },
        handleOverflow: function(a) {
          var f = this.axis,
              l = f.options.labels,
              n = a.x,
              e = f.chart.chartWidth,
              k = f.chart.spacing,
              y = d(f.labelLeft, Math.min(f.pos, k[3])),
              k = d(f.labelRight, Math.max(f.isRadial ? 0 : f.pos + f.len, e - k[1])),
              h = this.label,
              c = this.rotation,
              b = {
                left: 0,
                center: .5,
                right: 1
              }[f.labelAlign || h.attr("align")],
              g = h.getBBox().width,
              p = f.getSlotWidth(),
              F = p,
              L = 1,
              D,
              H = {};
          if (c || !1 === l.overflow)
            0 > c && n - b * g < y ? D = Math.round(n / Math.cos(c * t) - y) : 0 < c && n + b * g > k && (D = Math.round((e - n) / Math.cos(c * t)));
          else if (e = n + (1 - b) * g, n - b * g < y ? F = a.x + F * (1 - b) - y : e > k && (F = k - a.x + F * b, L = -1), F = Math.min(p, F), F < p && "center" === f.labelAlign && (a.x += L * (p - F - b * (p - Math.min(g, F)))), g > F || f.autoRotation && (h.styles || {}).width)
            D = F;
          D && (H.width = D, (l.style || {}).textOverflow || (H.textOverflow = "ellipsis"), h.css(H));
        },
        getPosition: function(f, d, q, n) {
          var e = this.axis,
              k = e.chart,
              l = n && k.oldChartHeight || k.chartHeight;
          return {
            x: f ? a.correctFloat(e.translate(d + q, null, null, n) + e.transB) : e.left + e.offset + (e.opposite ? (n && k.oldChartWidth || k.chartWidth) - e.right - e.left : 0),
            y: f ? l - e.bottom + e.offset - (e.opposite ? e.height : 0) : a.correctFloat(l - e.translate(d + q, null, null, n) - e.transB)
          };
        },
        getLabelPosition: function(a, f, d, n, e, k, y, h) {
          var c = this.axis,
              b = c.transA,
              g = c.reversed,
              p = c.staggerLines,
              l = c.tickRotCorr || {
                x: 0,
                y: 0
              },
              q = e.y,
              D = n || c.reserveSpaceDefault ? 0 : -c.labelOffset * ("center" === c.labelAlign ? .5 : 1);
          B(q) || (q = 0 === c.side ? d.rotation ? -8 : -d.getBBox().height : 2 === c.side ? l.y + 8 : Math.cos(d.rotation * t) * (l.y - d.getBBox(!1, 0).height / 2));
          a = a + e.x + D + l.x - (k && n ? k * b * (g ? -1 : 1) : 0);
          f = f + q - (k && !n ? k * b * (g ? 1 : -1) : 0);
          p && (d = y / (h || 1) % p, c.opposite && (d = p - d - 1), f += c.labelOffset / p * d);
          return {
            x: a,
            y: Math.round(f)
          };
        },
        getMarkPath: function(a, f, d, n, e, k) {
          return k.crispLine(["M", a, f, "L", a + (e ? 0 : -d), f + (e ? d : 0)], n);
        },
        renderGridLine: function(a, f, d) {
          var n = this.axis,
              e = this.gridLine,
              k = {},
              l = this.pos,
              h = this.type,
              c = n.tickmarkOffset,
              b = n.chart.renderer;
          e || (h || (k.zIndex = 1), a && (k.opacity = 0), this.gridLine = e = b.path().attr(k).addClass("highcharts-" + (h ? h + "-" : "") + "grid-line").add(n.gridGroup));
          if (!a && e && (a = n.getPlotLinePath(l + c, e.strokeWidth() * d, a, !0)))
            e[this.isNew ? "attr" : "animate"]({
              d: a,
              opacity: f
            });
        },
        renderMark: function(a, f, d) {
          var n = this.axis,
              e = n.chart.renderer,
              k = this.type,
              l = n.tickSize(k ? k + "Tick" : "tick"),
              h = this.mark,
              c = !h,
              b = a.x;
          a = a.y;
          l && (n.opposite && (l[0] = -l[0]), c && (this.mark = h = e.path().addClass("highcharts-" + (k ? k + "-" : "") + "tick").add(n.axisGroup)), h[c ? "attr" : "animate"]({
            d: this.getMarkPath(b, a, l[0], h.strokeWidth() * d, n.horiz, e),
            opacity: f
          }));
        },
        renderLabel: function(a, t, q, n) {
          var e = this.axis,
              k = e.horiz,
              l = e.options,
              h = this.label,
              c = l.labels,
              b = c.step,
              e = e.tickmarkOffset,
              g = !0,
              p = a.x;
          a = a.y;
          h && f(p) && (h.xy = a = this.getLabelPosition(p, a, h, k, c, e, n, b), this.isFirst && !this.isLast && !d(l.showFirstLabel, 1) || this.isLast && !this.isFirst && !d(l.showLastLabel, 1) ? g = !1 : !k || c.step || c.rotation || t || 0 === q || this.handleOverflow(a), b && n % b && (g = !1), g && f(a.y) ? (a.opacity = q, h[this.isNewLabel ? "attr" : "animate"](a), this.isNewLabel = !1) : (h.attr("y", -9999), this.isNewLabel = !0));
        },
        render: function(f, t, q) {
          var n = this.axis,
              e = n.horiz,
              k = this.getPosition(e, this.pos, n.tickmarkOffset, t),
              l = k.x,
              h = k.y,
              n = e && l === n.pos + n.len || !e && h === n.pos ? -1 : 1;
          q = d(q, 1);
          this.isActive = !0;
          this.renderGridLine(t, q, n);
          this.renderMark(k, q, n);
          this.renderLabel(k, t, q, f);
          this.isNew = !1;
          a.fireEvent(this, "afterRender");
        },
        destroy: function() {
          A(this, this.axis);
        }
      };
    })(I);
    var U = function(a) {
      var w = a.addEvent,
          B = a.animObject,
          A = a.arrayMax,
          f = a.arrayMin,
          d = a.correctFloat,
          t = a.defaultOptions,
          l = a.defined,
          v = a.deg2rad,
          q = a.destroyObjectProperties,
          n = a.each,
          e = a.extend,
          k = a.fireEvent,
          y = a.format,
          h = a.getMagnitude,
          c = a.grep,
          b = a.inArray,
          g = a.isArray,
          p = a.isNumber,
          F = a.isString,
          L = a.merge,
          D = a.normalizeTickInterval,
          H = a.objectEach,
          z = a.pick,
          u = a.removeEvent,
          C = a.splat,
          E = a.syncTimeout,
          J = a.Tick,
          K = function() {
            this.init.apply(this, arguments);
          };
      a.extend(K.prototype, {
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
        init: function(a, c) {
          var r = c.isX,
              m = this;
          m.chart = a;
          m.horiz = a.inverted && !m.isZAxis ? !r : r;
          m.isXAxis = r;
          m.coll = m.coll || (r ? "xAxis" : "yAxis");
          m.opposite = c.opposite;
          m.side = c.side || (m.horiz ? m.opposite ? 0 : 2 : m.opposite ? 1 : 3);
          m.setOptions(c);
          var x = this.options,
              g = x.type;
          m.labelFormatter = x.labels.formatter || m.defaultLabelFormatter;
          m.userOptions = c;
          m.minPixelPadding = 0;
          m.reversed = x.reversed;
          m.visible = !1 !== x.visible;
          m.zoomEnabled = !1 !== x.zoomEnabled;
          m.hasNames = "category" === g || !0 === x.categories;
          m.categories = x.categories || m.hasNames;
          m.names || (m.names = [], m.names.keys = {});
          m.plotLinesAndBandsGroups = {};
          m.isLog = "logarithmic" === g;
          m.isDatetimeAxis = "datetime" === g;
          m.positiveValuesOnly = m.isLog && !m.allowNegativeLog;
          m.isLinked = l(x.linkedTo);
          m.ticks = {};
          m.labelEdge = [];
          m.minorTicks = {};
          m.plotLinesAndBands = [];
          m.alternateBands = {};
          m.len = 0;
          m.minRange = m.userMinRange = x.minRange || x.maxZoom;
          m.range = x.range;
          m.offset = x.offset || 0;
          m.stacks = {};
          m.oldStacks = {};
          m.stacksTouched = 0;
          m.max = null;
          m.min = null;
          m.crosshair = z(x.crosshair, C(a.options.tooltip.crosshairs)[r ? 0 : 1], !1);
          c = m.options.events;
          -1 === b(m, a.axes) && (r ? a.axes.splice(a.xAxis.length, 0, m) : a.axes.push(m), a[m.coll].push(m));
          m.series = m.series || [];
          a.inverted && !m.isZAxis && r && void 0 === m.reversed && (m.reversed = !0);
          H(c, function(a, b) {
            w(m, b, a);
          });
          m.lin2log = x.linearToLogConverter || m.lin2log;
          m.isLog && (m.val2lin = m.log2lin, m.lin2val = m.lin2log);
        },
        setOptions: function(a) {
          this.options = L(this.defaultOptions, "yAxis" === this.coll && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], L(t[this.coll], a));
        },
        defaultLabelFormatter: function() {
          var b = this.axis,
              c = this.value,
              g = b.chart.time,
              m = b.categories,
              h = this.dateTimeLabelFormat,
              e = t.lang,
              p = e.numericSymbols,
              e = e.numericSymbolMagnitude || 1E3,
              u = p && p.length,
              n,
              k = b.options.labels.format,
              b = b.isLog ? Math.abs(c) : b.tickInterval;
          if (k)
            n = y(k, this, g);
          else if (m)
            n = c;
          else if (h)
            n = g.dateFormat(h, c);
          else if (u && 1E3 <= b)
            for (; u-- && void 0 === n; )
              g = Math.pow(e, u + 1), b >= g && 0 === 10 * c % g && null !== p[u] && 0 !== c && (n = a.numberFormat(c / g, -1) + p[u]);
          void 0 === n && (n = 1E4 <= Math.abs(c) ? a.numberFormat(c, -1) : a.numberFormat(c, -1, void 0, ""));
          return n;
        },
        getSeriesExtremes: function() {
          var a = this,
              b = a.chart;
          a.hasVisibleSeries = !1;
          a.dataMin = a.dataMax = a.threshold = null;
          a.softThreshold = !a.isXAxis;
          a.buildStacks && a.buildStacks();
          n(a.series, function(r) {
            if (r.visible || !b.options.chart.ignoreHiddenSeries) {
              var m = r.options,
                  x = m.threshold,
                  g;
              a.hasVisibleSeries = !0;
              a.positiveValuesOnly && 0 >= x && (x = null);
              if (a.isXAxis)
                m = r.xData, m.length && (r = f(m), g = A(m), p(r) || r instanceof Date || (m = c(m, p), r = f(m), g = A(m)), m.length && (a.dataMin = Math.min(z(a.dataMin, m[0], r), r), a.dataMax = Math.max(z(a.dataMax, m[0], g), g)));
              else if (r.getExtremes(), g = r.dataMax, r = r.dataMin, l(r) && l(g) && (a.dataMin = Math.min(z(a.dataMin, r), r), a.dataMax = Math.max(z(a.dataMax, g), g)), l(x) && (a.threshold = x), !m.softThreshold || a.positiveValuesOnly)
                a.softThreshold = !1;
            }
          });
        },
        translate: function(a, b, c, m, g, h) {
          var r = this.linkedParent || this,
              x = 1,
              e = 0,
              u = m ? r.oldTransA : r.transA;
          m = m ? r.oldMin : r.min;
          var n = r.minPixelPadding;
          g = (r.isOrdinal || r.isBroken || r.isLog && g) && r.lin2val;
          u || (u = r.transA);
          c && (x *= -1, e = r.len);
          r.reversed && (x *= -1, e -= x * (r.sector || r.len));
          b ? (a = (a * x + e - n) / u + m, g && (a = r.lin2val(a))) : (g && (a = r.val2lin(a)), a = p(m) ? x * (a - m) * u + e + x * n + (p(h) ? u * h : 0) : void 0);
          return a;
        },
        toPixels: function(a, b) {
          return this.translate(a, !1, !this.horiz, null, !0) + (b ? 0 : this.pos);
        },
        toValue: function(a, b) {
          return this.translate(a - (b ? 0 : this.pos), !0, !this.horiz, null, !0);
        },
        getPlotLinePath: function(a, b, c, m, g) {
          var r = this.chart,
              x = this.left,
              h = this.top,
              e,
              u,
              n = c && r.oldChartHeight || r.chartHeight,
              k = c && r.oldChartWidth || r.chartWidth,
              f;
          e = this.transB;
          var d = function(a, b, r) {
            if (a < b || a > r)
              m ? a = Math.min(Math.max(b, a), r) : f = !0;
            return a;
          };
          g = z(g, this.translate(a, null, null, c));
          g = Math.min(Math.max(-1E5, g), 1E5);
          a = c = Math.round(g + e);
          e = u = Math.round(n - g - e);
          p(g) ? this.horiz ? (e = h, u = n - this.bottom, a = c = d(a, x, x + this.width)) : (a = x, c = k - this.right, e = u = d(e, h, h + this.height)) : (f = !0, m = !1);
          return f && !m ? null : r.renderer.crispLine(["M", a, e, "L", c, u], b || 1);
        },
        getLinearTickPositions: function(a, b, c) {
          var r,
              g = d(Math.floor(b / a) * a);
          c = d(Math.ceil(c / a) * a);
          var x = [],
              h;
          d(g + a) === g && (h = 20);
          if (this.single)
            return [b];
          for (b = g; b <= c; ) {
            x.push(b);
            b = d(b + a, h);
            if (b === r)
              break;
            r = b;
          }
          return x;
        },
        getMinorTickInterval: function() {
          var a = this.options;
          return !0 === a.minorTicks ? z(a.minorTickInterval, "auto") : !1 === a.minorTicks ? null : a.minorTickInterval;
        },
        getMinorTickPositions: function() {
          var a = this,
              b = a.options,
              c = a.tickPositions,
              m = a.minorTickInterval,
              g = [],
              h = a.pointRangePadding || 0,
              e = a.min - h,
              h = a.max + h,
              p = h - e;
          if (p && p / m < a.len / 3)
            if (a.isLog)
              n(this.paddedTicks, function(b, r, c) {
                r && g.push.apply(g, a.getLogTickPositions(m, c[r - 1], c[r], !0));
              });
            else if (a.isDatetimeAxis && "auto" === this.getMinorTickInterval())
              g = g.concat(a.getTimeTicks(a.normalizeTimeTickInterval(m), e, h, b.startOfWeek));
            else
              for (b = e + (c[0] - e) % m; b <= h && b !== g[0]; b += m)
                g.push(b);
          0 !== g.length && a.trimTicks(g);
          return g;
        },
        adjustForMinRange: function() {
          var a = this.options,
              b = this.min,
              c = this.max,
              m,
              g,
              h,
              e,
              p,
              u,
              k,
              d;
          this.isXAxis && void 0 === this.minRange && !this.isLog && (l(a.min) || l(a.max) ? this.minRange = null : (n(this.series, function(a) {
            u = a.xData;
            for (e = k = a.xIncrement ? 1 : u.length - 1; 0 < e; e--)
              if (p = u[e] - u[e - 1], void 0 === h || p < h)
                h = p;
          }), this.minRange = Math.min(5 * h, this.dataMax - this.dataMin)));
          c - b < this.minRange && (g = this.dataMax - this.dataMin >= this.minRange, d = this.minRange, m = (d - c + b) / 2, m = [b - m, z(a.min, b - m)], g && (m[2] = this.isLog ? this.log2lin(this.dataMin) : this.dataMin), b = A(m), c = [b + d, z(a.max, b + d)], g && (c[2] = this.isLog ? this.log2lin(this.dataMax) : this.dataMax), c = f(c), c - b < d && (m[0] = c - d, m[1] = z(a.min, c - d), b = A(m)));
          this.min = b;
          this.max = c;
        },
        getClosest: function() {
          var a;
          this.categories ? a = 1 : n(this.series, function(b) {
            var c = b.closestPointRange,
                r = b.visible || !b.chart.options.chart.ignoreHiddenSeries;
            !b.noSharedTooltip && l(c) && r && (a = l(a) ? Math.min(a, c) : c);
          });
          return a;
        },
        nameToX: function(a) {
          var c = g(this.categories),
              r = c ? this.categories : this.names,
              m = a.options.x,
              h;
          a.series.requireSorting = !1;
          l(m) || (m = !1 === this.options.uniqueNames ? a.series.autoIncrement() : c ? b(a.name, r) : z(r.keys[a.name], -1));
          -1 === m ? c || (h = r.length) : h = m;
          void 0 !== h && (this.names[h] = a.name, this.names.keys[a.name] = h);
          return h;
        },
        updateNames: function() {
          var b = this,
              c = this.names;
          0 < c.length && (n(a.keys(c.keys), function(a) {
            delete c.keys[a];
          }), c.length = 0, this.minRange = this.userMinRange, n(this.series || [], function(a) {
            a.xIncrement = null;
            if (!a.points || a.isDirtyData)
              a.processData(), a.generatePoints();
            n(a.points, function(c, r) {
              var m;
              c.options && (m = b.nameToX(c), void 0 !== m && m !== c.x && (c.x = m, a.xData[r] = m));
            });
          }));
        },
        setAxisTranslation: function(a) {
          var b = this,
              c = b.max - b.min,
              m = b.axisPointRange || 0,
              r,
              g = 0,
              h = 0,
              e = b.linkedParent,
              p = !!b.categories,
              u = b.transA,
              k = b.isXAxis;
          if (k || p || m)
            r = b.getClosest(), e ? (g = e.minPointOffset, h = e.pointRangePadding) : n(b.series, function(a) {
              var c = p ? 1 : k ? z(a.options.pointRange, r, 0) : b.axisPointRange || 0;
              a = a.options.pointPlacement;
              m = Math.max(m, c);
              b.single || (g = Math.max(g, F(a) ? 0 : c / 2), h = Math.max(h, "on" === a ? 0 : c));
            }), e = b.ordinalSlope && r ? b.ordinalSlope / r : 1, b.minPointOffset = g *= e, b.pointRangePadding = h *= e, b.pointRange = Math.min(m, c), k && (b.closestPointRange = r);
          a && (b.oldTransA = u);
          b.translationSlope = b.transA = u = b.options.staticScale || b.len / (c + h || 1);
          b.transB = b.horiz ? b.left : b.bottom;
          b.minPixelPadding = u * g;
        },
        minFromRange: function() {
          return this.max - this.range;
        },
        setTickInterval: function(b) {
          var c = this,
              r = c.chart,
              m = c.options,
              g = c.isLog,
              e = c.log2lin,
              u = c.isDatetimeAxis,
              f = c.isXAxis,
              E = c.isLinked,
              C = m.maxPadding,
              H = m.minPadding,
              J = m.tickInterval,
              q = m.tickPixelInterval,
              y = c.categories,
              F = c.threshold,
              K = c.softThreshold,
              t,
              v,
              L,
              w;
          u || y || E || this.getTickAmount();
          L = z(c.userMin, m.min);
          w = z(c.userMax, m.max);
          E ? (c.linkedParent = r[c.coll][m.linkedTo], r = c.linkedParent.getExtremes(), c.min = z(r.min, r.dataMin), c.max = z(r.max, r.dataMax), m.type !== c.linkedParent.options.type && a.error(11, 1)) : (!K && l(F) && (c.dataMin >= F ? (t = F, H = 0) : c.dataMax <= F && (v = F, C = 0)), c.min = z(L, t, c.dataMin), c.max = z(w, v, c.dataMax));
          g && (c.positiveValuesOnly && !b && 0 >= Math.min(c.min, z(c.dataMin, c.min)) && a.error(10, 1), c.min = d(e(c.min), 15), c.max = d(e(c.max), 15));
          c.range && l(c.max) && (c.userMin = c.min = L = Math.max(c.dataMin, c.minFromRange()), c.userMax = w = c.max, c.range = null);
          k(c, "foundExtremes");
          c.beforePadding && c.beforePadding();
          c.adjustForMinRange();
          !(y || c.axisPointRange || c.usePercentage || E) && l(c.min) && l(c.max) && (e = c.max - c.min) && (!l(L) && H && (c.min -= e * H), !l(w) && C && (c.max += e * C));
          p(m.softMin) && !p(c.userMin) && (c.min = Math.min(c.min, m.softMin));
          p(m.softMax) && !p(c.userMax) && (c.max = Math.max(c.max, m.softMax));
          p(m.floor) && (c.min = Math.max(c.min, m.floor));
          p(m.ceiling) && (c.max = Math.min(c.max, m.ceiling));
          K && l(c.dataMin) && (F = F || 0, !l(L) && c.min < F && c.dataMin >= F ? c.min = F : !l(w) && c.max > F && c.dataMax <= F && (c.max = F));
          c.tickInterval = c.min === c.max || void 0 === c.min || void 0 === c.max ? 1 : E && !J && q === c.linkedParent.options.tickPixelInterval ? J = c.linkedParent.tickInterval : z(J, this.tickAmount ? (c.max - c.min) / Math.max(this.tickAmount - 1, 1) : void 0, y ? 1 : (c.max - c.min) * q / Math.max(c.len, q));
          f && !b && n(c.series, function(a) {
            a.processData(c.min !== c.oldMin || c.max !== c.oldMax);
          });
          c.setAxisTranslation(!0);
          c.beforeSetTickPositions && c.beforeSetTickPositions();
          c.postProcessTickInterval && (c.tickInterval = c.postProcessTickInterval(c.tickInterval));
          c.pointRange && !J && (c.tickInterval = Math.max(c.pointRange, c.tickInterval));
          b = z(m.minTickInterval, c.isDatetimeAxis && c.closestPointRange);
          !J && c.tickInterval < b && (c.tickInterval = b);
          u || g || J || (c.tickInterval = D(c.tickInterval, null, h(c.tickInterval), z(m.allowDecimals, !(.5 < c.tickInterval && 5 > c.tickInterval && 1E3 < c.max && 9999 > c.max)), !!this.tickAmount));
          this.tickAmount || (c.tickInterval = c.unsquish());
          this.setTickPositions();
        },
        setTickPositions: function() {
          var a = this.options,
              b,
              c = a.tickPositions;
          b = this.getMinorTickInterval();
          var m = a.tickPositioner,
              g = a.startOnTick,
              h = a.endOnTick;
          this.tickmarkOffset = this.categories && "between" === a.tickmarkPlacement && 1 === this.tickInterval ? .5 : 0;
          this.minorTickInterval = "auto" === b && this.tickInterval ? this.tickInterval / 5 : b;
          this.single = this.min === this.max && l(this.min) && !this.tickAmount && (parseInt(this.min, 10) === this.min || !1 !== a.allowDecimals);
          this.tickPositions = b = c && c.slice();
          !b && (b = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, a.units), this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), b.length > this.len && (b = [b[0], b.pop()], b[0] === b[1] && (b.length = 1)), this.tickPositions = b, m && (m = m.apply(this, [this.min, this.max]))) && (this.tickPositions = b = m);
          this.paddedTicks = b.slice(0);
          this.trimTicks(b, g, h);
          this.isLinked || (this.single && 2 > b.length && (this.min -= .5, this.max += .5), c || m || this.adjustTickAmount());
        },
        trimTicks: function(a, b, c) {
          var m = a[0],
              r = a[a.length - 1],
              g = this.minPointOffset || 0;
          if (!this.isLinked) {
            if (b && -Infinity !== m)
              this.min = m;
            else
              for (; this.min - g > a[0]; )
                a.shift();
            if (c)
              this.max = r;
            else
              for (; this.max + g < a[a.length - 1]; )
                a.pop();
            0 === a.length && l(m) && !this.options.tickPositions && a.push((r + m) / 2);
          }
        },
        alignToOthers: function() {
          var a = {},
              b,
              c = this.options;
          !1 === this.chart.options.chart.alignTicks || !1 === c.alignTicks || this.isLog || n(this.chart[this.coll], function(c) {
            var m = c.options,
                m = [c.horiz ? m.left : m.top, m.width, m.height, m.pane].join();
            c.series.length && (a[m] ? b = !0 : a[m] = 1);
          });
          return b;
        },
        getTickAmount: function() {
          var a = this.options,
              b = a.tickAmount,
              c = a.tickPixelInterval;
          !l(a.tickInterval) && this.len < c && !this.isRadial && !this.isLog && a.startOnTick && a.endOnTick && (b = 2);
          !b && this.alignToOthers() && (b = Math.ceil(this.len / c) + 1);
          4 > b && (this.finalTickAmt = b, b = 5);
          this.tickAmount = b;
        },
        adjustTickAmount: function() {
          var a = this.tickInterval,
              b = this.tickPositions,
              c = this.tickAmount,
              m = this.finalTickAmt,
              g = b && b.length,
              h = z(this.threshold, this.softThreshold ? 0 : null);
          if (this.hasData()) {
            if (g < c) {
              for (; b.length < c; )
                b.length % 2 || this.min === h ? b.push(d(b[b.length - 1] + a)) : b.unshift(d(b[0] - a));
              this.transA *= (g - 1) / (c - 1);
              this.min = b[0];
              this.max = b[b.length - 1];
            } else
              g > c && (this.tickInterval *= 2, this.setTickPositions());
            if (l(m)) {
              for (a = c = b.length; a--; )
                (3 === m && 1 === a % 2 || 2 >= m && 0 < a && a < c - 1) && b.splice(a, 1);
              this.finalTickAmt = void 0;
            }
          }
        },
        setScale: function() {
          var a,
              b;
          this.oldMin = this.min;
          this.oldMax = this.max;
          this.oldAxisLength = this.len;
          this.setAxisSize();
          b = this.len !== this.oldAxisLength;
          n(this.series, function(b) {
            if (b.isDirtyData || b.isDirty || b.xAxis.isDirty)
              a = !0;
          });
          b || a || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax || this.alignToOthers() ? (this.resetStacks && this.resetStacks(), this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickInterval(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, this.isDirty || (this.isDirty = b || this.min !== this.oldMin || this.max !== this.oldMax)) : this.cleanStacks && this.cleanStacks();
          k(this, "afterSetScale");
        },
        setExtremes: function(a, b, c, m, g) {
          var r = this,
              h = r.chart;
          c = z(c, !0);
          n(r.series, function(a) {
            delete a.kdTree;
          });
          g = e(g, {
            min: a,
            max: b
          });
          k(r, "setExtremes", g, function() {
            r.userMin = a;
            r.userMax = b;
            r.eventArgs = g;
            c && h.redraw(m);
          });
        },
        zoom: function(a, b) {
          var c = this.dataMin,
              m = this.dataMax,
              r = this.options,
              g = Math.min(c, z(r.min, c)),
              r = Math.max(m, z(r.max, m));
          if (a !== this.min || b !== this.max)
            this.allowZoomOutside || (l(c) && (a < g && (a = g), a > r && (a = r)), l(m) && (b < g && (b = g), b > r && (b = r))), this.displayBtn = void 0 !== a || void 0 !== b, this.setExtremes(a, b, !1, void 0, {trigger: "zoom"});
          return !0;
        },
        setAxisSize: function() {
          var b = this.chart,
              c = this.options,
              g = c.offsets || [0, 0, 0, 0],
              m = this.horiz,
              h = this.width = Math.round(a.relativeLength(z(c.width, b.plotWidth - g[3] + g[1]), b.plotWidth)),
              e = this.height = Math.round(a.relativeLength(z(c.height, b.plotHeight - g[0] + g[2]), b.plotHeight)),
              p = this.top = Math.round(a.relativeLength(z(c.top, b.plotTop + g[0]), b.plotHeight, b.plotTop)),
              c = this.left = Math.round(a.relativeLength(z(c.left, b.plotLeft + g[3]), b.plotWidth, b.plotLeft));
          this.bottom = b.chartHeight - e - p;
          this.right = b.chartWidth - h - c;
          this.len = Math.max(m ? h : e, 0);
          this.pos = m ? c : p;
        },
        getExtremes: function() {
          var a = this.isLog,
              b = this.lin2log;
          return {
            min: a ? d(b(this.min)) : this.min,
            max: a ? d(b(this.max)) : this.max,
            dataMin: this.dataMin,
            dataMax: this.dataMax,
            userMin: this.userMin,
            userMax: this.userMax
          };
        },
        getThreshold: function(a) {
          var b = this.isLog,
              c = this.lin2log,
              m = b ? c(this.min) : this.min,
              b = b ? c(this.max) : this.max;
          null === a ? a = m : m > a ? a = m : b < a && (a = b);
          return this.translate(a, 0, 1, 0, 1);
        },
        autoLabelAlign: function(a) {
          a = (z(a, 0) - 90 * this.side + 720) % 360;
          return 15 < a && 165 > a ? "right" : 195 < a && 345 > a ? "left" : "center";
        },
        tickSize: function(a) {
          var b = this.options,
              c = b[a + "Length"],
              m = z(b[a + "Width"], "tick" === a && this.isXAxis ? 1 : 0);
          if (m && c)
            return "inside" === b[a + "Position"] && (c = -c), [c, m];
        },
        labelMetrics: function() {
          var a = this.tickPositions && this.tickPositions[0] || 0;
          return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[a] && this.ticks[a].label);
        },
        unsquish: function() {
          var a = this.options.labels,
              b = this.horiz,
              c = this.tickInterval,
              m = c,
              g = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / c),
              h,
              e = a.rotation,
              p = this.labelMetrics(),
              u,
              k = Number.MAX_VALUE,
              f,
              d = function(a) {
                a /= g || 1;
                a = 1 < a ? Math.ceil(a) : 1;
                return a * c;
              };
          b ? (f = !a.staggerLines && !a.step && (l(e) ? [e] : g < z(a.autoRotationLimit, 80) && a.autoRotation)) && n(f, function(a) {
            var b;
            if (a === e || a && -90 <= a && 90 >= a)
              u = d(Math.abs(p.h / Math.sin(v * a))), b = u + Math.abs(a / 360), b < k && (k = b, h = a, m = u);
          }) : a.step || (m = d(p.h));
          this.autoRotation = f;
          this.labelRotation = z(h, e);
          return m;
        },
        getSlotWidth: function() {
          var a = this.chart,
              b = this.horiz,
              c = this.options.labels,
              m = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1),
              g = a.margin[3];
          return b && 2 > (c.step || 0) && !c.rotation && (this.staggerLines || 1) * this.len / m || !b && (c.style && parseInt(c.style.width, 10) || g && g - a.spacing[3] || .33 * a.chartWidth);
        },
        renderUnsquish: function() {
          var a = this.chart,
              b = a.renderer,
              c = this.tickPositions,
              m = this.ticks,
              g = this.options.labels,
              h = this.horiz,
              e = this.getSlotWidth(),
              p = Math.max(1, Math.round(e - 2 * (g.padding || 5))),
              u = {},
              k = this.labelMetrics(),
              f = g.style && g.style.textOverflow,
              d,
              E,
              C = 0,
              l;
          F(g.rotation) || (u.rotation = g.rotation || 0);
          n(c, function(a) {
            (a = m[a]) && a.label && a.label.textPxLength > C && (C = a.label.textPxLength);
          });
          this.maxLabelLength = C;
          if (this.autoRotation)
            C > p && C > k.h ? u.rotation = this.labelRotation : this.labelRotation = 0;
          else if (e && (d = p, !f))
            for (E = "clip", p = c.length; !h && p--; )
              if (l = c[p], l = m[l].label)
                l.styles && "ellipsis" === l.styles.textOverflow ? l.css({textOverflow: "clip"}) : l.textPxLength > e && l.css({width: e + "px"}), l.getBBox().height > this.len / c.length - (k.h - k.f) && (l.specificTextOverflow = "ellipsis");
          u.rotation && (d = C > .5 * a.chartHeight ? .33 * a.chartHeight : a.chartHeight, f || (E = "ellipsis"));
          if (this.labelAlign = g.align || this.autoLabelAlign(this.labelRotation))
            u.align = this.labelAlign;
          n(c, function(a) {
            var b = (a = m[a]) && a.label;
            b && (b.attr(u), !d || g.style && g.style.width || !(d < b.textPxLength || "SPAN" === b.element.tagName) || b.css({
              width: d,
              textOverflow: b.specificTextOverflow || E
            }), delete b.specificTextOverflow, a.rotation = u.rotation);
          });
          this.tickRotCorr = b.rotCorr(k.b, this.labelRotation || 0, 0 !== this.side);
        },
        hasData: function() {
          return this.hasVisibleSeries || l(this.min) && l(this.max) && this.tickPositions && 0 < this.tickPositions.length;
        },
        addTitle: function(a) {
          var b = this.chart.renderer,
              c = this.horiz,
              m = this.opposite,
              g = this.options.title,
              h;
          this.axisTitle || ((h = g.textAlign) || (h = (c ? {
            low: "left",
            middle: "center",
            high: "right"
          } : {
            low: m ? "right" : "left",
            middle: "center",
            high: m ? "left" : "right"
          })[g.align]), this.axisTitle = b.text(g.text, 0, 0, g.useHTML).attr({
            zIndex: 7,
            rotation: g.rotation || 0,
            align: h
          }).addClass("highcharts-axis-title").add(this.axisGroup), this.axisTitle.isNew = !0);
          this.axisTitle.css({width: this.len});
          this.axisTitle[a ? "show" : "hide"](!0);
        },
        generateTick: function(a) {
          var b = this.ticks;
          b[a] ? b[a].addLabel() : b[a] = new J(this, a);
        },
        getOffset: function() {
          var a = this,
              b = a.chart,
              c = b.renderer,
              m = a.options,
              g = a.tickPositions,
              h = a.ticks,
              e = a.horiz,
              p = a.side,
              u = b.inverted && !a.isZAxis ? [1, 0, 3, 2][p] : p,
              k,
              f,
              d = 0,
              E,
              C = 0,
              D = m.title,
              J = m.labels,
              F = 0,
              q = b.axisOffset,
              b = b.clipOffset,
              y = [-1, 1, 1, -1][p],
              K = m.className,
              t = a.axisParent,
              L = this.tickSize("tick");
          k = a.hasData();
          a.showAxis = f = k || z(m.showEmpty, !0);
          a.staggerLines = a.horiz && J.staggerLines;
          a.axisGroup || (a.gridGroup = c.g("grid").attr({zIndex: m.gridZIndex || 1}).addClass("highcharts-" + this.coll.toLowerCase() + "-grid " + (K || "")).add(t), a.axisGroup = c.g("axis").attr({zIndex: m.zIndex || 2}).addClass("highcharts-" + this.coll.toLowerCase() + " " + (K || "")).add(t), a.labelGroup = c.g("axis-labels").attr({zIndex: J.zIndex || 7}).addClass("highcharts-" + a.coll.toLowerCase() + "-labels " + (K || "")).add(t));
          k || a.isLinked ? (n(g, function(b, c) {
            a.generateTick(b, c);
          }), a.renderUnsquish(), a.reserveSpaceDefault = 0 === p || 2 === p || {
            1: "left",
            3: "right"
          }[p] === a.labelAlign, z(J.reserveSpace, "center" === a.labelAlign ? !0 : null, a.reserveSpaceDefault) && n(g, function(a) {
            F = Math.max(h[a].getLabelSize(), F);
          }), a.staggerLines && (F *= a.staggerLines), a.labelOffset = F * (a.opposite ? -1 : 1)) : H(h, function(a, b) {
            a.destroy();
            delete h[b];
          });
          D && D.text && !1 !== D.enabled && (a.addTitle(f), f && !1 !== D.reserveSpace && (a.titleOffset = d = a.axisTitle.getBBox()[e ? "height" : "width"], E = D.offset, C = l(E) ? 0 : z(D.margin, e ? 5 : 10)));
          a.renderLine();
          a.offset = y * z(m.offset, q[p]);
          a.tickRotCorr = a.tickRotCorr || {
            x: 0,
            y: 0
          };
          c = 0 === p ? -a.labelMetrics().h : 2 === p ? a.tickRotCorr.y : 0;
          C = Math.abs(F) + C;
          F && (C = C - c + y * (e ? z(J.y, a.tickRotCorr.y + 8 * y) : J.x));
          a.axisTitleMargin = z(E, C);
          q[p] = Math.max(q[p], a.axisTitleMargin + d + y * a.offset, C, k && g.length && L ? L[0] + y * a.offset : 0);
          m = m.offset ? 0 : 2 * Math.floor(a.axisLine.strokeWidth() / 2);
          b[u] = Math.max(b[u], m);
        },
        getLinePath: function(a) {
          var b = this.chart,
              c = this.opposite,
              m = this.offset,
              g = this.horiz,
              h = this.left + (c ? this.width : 0) + m,
              m = b.chartHeight - this.bottom - (c ? this.height : 0) + m;
          c && (a *= -1);
          return b.renderer.crispLine(["M", g ? this.left : h, g ? m : this.top, "L", g ? b.chartWidth - this.right : h, g ? m : b.chartHeight - this.bottom], a);
        },
        renderLine: function() {
          this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup));
        },
        getTitlePosition: function() {
          var a = this.horiz,
              b = this.left,
              c = this.top,
              m = this.len,
              g = this.options.title,
              h = a ? b : c,
              e = this.opposite,
              p = this.offset,
              u = g.x || 0,
              n = g.y || 0,
              k = this.axisTitle,
              f = this.chart.renderer.fontMetrics(g.style && g.style.fontSize, k),
              k = Math.max(k.getBBox(null, 0).height - f.h - 1, 0),
              m = {
                low: h + (a ? 0 : m),
                middle: h + m / 2,
                high: h + (a ? m : 0)
              }[g.align],
              b = (a ? c + this.height : b) + (a ? 1 : -1) * (e ? -1 : 1) * this.axisTitleMargin + [-k, k, f.f, -k][this.side];
          return {
            x: a ? m + u : b + (e ? this.width : 0) + p + u,
            y: a ? b + n - (e ? this.height : 0) + p : m + n
          };
        },
        renderMinorTick: function(a) {
          var b = this.chart.hasRendered && p(this.oldMin),
              c = this.minorTicks;
          c[a] || (c[a] = new J(this, a, "minor"));
          b && c[a].isNew && c[a].render(null, !0);
          c[a].render(null, !1, 1);
        },
        renderTick: function(a, b) {
          var c = this.isLinked,
              g = this.ticks,
              h = this.chart.hasRendered && p(this.oldMin);
          if (!c || a >= this.min && a <= this.max)
            g[a] || (g[a] = new J(this, a)), h && g[a].isNew && g[a].render(b, !0, .1), g[a].render(b);
        },
        render: function() {
          var b = this,
              c = b.chart,
              g = b.options,
              m = b.isLog,
              h = b.lin2log,
              e = b.isLinked,
              u = b.tickPositions,
              k = b.axisTitle,
              f = b.ticks,
              d = b.minorTicks,
              C = b.alternateBands,
              l = g.stackLabels,
              D = g.alternateGridColor,
              z = b.tickmarkOffset,
              F = b.axisLine,
              q = b.showAxis,
              y = B(c.renderer.globalAnimation),
              K,
              t;
          b.labelEdge.length = 0;
          b.overlap = !1;
          n([f, d, C], function(a) {
            H(a, function(a) {
              a.isActive = !1;
            });
          });
          if (b.hasData() || e)
            b.minorTickInterval && !b.categories && n(b.getMinorTickPositions(), function(a) {
              b.renderMinorTick(a);
            }), u.length && (n(u, function(a, c) {
              b.renderTick(a, c);
            }), z && (0 === b.min || b.single) && (f[-1] || (f[-1] = new J(b, -1, null, !0)), f[-1].render(-1))), D && n(u, function(g, e) {
              t = void 0 !== u[e + 1] ? u[e + 1] + z : b.max - z;
              0 === e % 2 && g < b.max && t <= b.max + (c.polar ? -z : z) && (C[g] || (C[g] = new a.PlotLineOrBand(b)), K = g + z, C[g].options = {
                from: m ? h(K) : K,
                to: m ? h(t) : t,
                color: D
              }, C[g].render(), C[g].isActive = !0);
            }), b._addedPlotLB || (n((g.plotLines || []).concat(g.plotBands || []), function(a) {
              b.addPlotBandOrLine(a);
            }), b._addedPlotLB = !0);
          n([f, d, C], function(a) {
            var b,
                g = [],
                m = y.duration;
            H(a, function(a, b) {
              a.isActive || (a.render(b, !1, 0), a.isActive = !1, g.push(b));
            });
            E(function() {
              for (b = g.length; b--; )
                a[g[b]] && !a[g[b]].isActive && (a[g[b]].destroy(), delete a[g[b]]);
            }, a !== C && c.hasRendered && m ? m : 0);
          });
          F && (F[F.isPlaced ? "animate" : "attr"]({d: this.getLinePath(F.strokeWidth())}), F.isPlaced = !0, F[q ? "show" : "hide"](!0));
          k && q && (g = b.getTitlePosition(), p(g.y) ? (k[k.isNew ? "attr" : "animate"](g), k.isNew = !1) : (k.attr("y", -9999), k.isNew = !0));
          l && l.enabled && b.renderStackTotals();
          b.isDirty = !1;
        },
        redraw: function() {
          this.visible && (this.render(), n(this.plotLinesAndBands, function(a) {
            a.render();
          }));
          n(this.series, function(a) {
            a.isDirty = !0;
          });
        },
        keepProps: "extKey hcEvents names series userMax userMin".split(" "),
        destroy: function(a) {
          var c = this,
              g = c.stacks,
              m = c.plotLinesAndBands,
              h;
          a || u(c);
          H(g, function(a, b) {
            q(a);
            g[b] = null;
          });
          n([c.ticks, c.minorTicks, c.alternateBands], function(a) {
            q(a);
          });
          if (m)
            for (a = m.length; a--; )
              m[a].destroy();
          n("stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross".split(" "), function(a) {
            c[a] && (c[a] = c[a].destroy());
          });
          for (h in c.plotLinesAndBandsGroups)
            c.plotLinesAndBandsGroups[h] = c.plotLinesAndBandsGroups[h].destroy();
          H(c, function(a, g) {
            -1 === b(g, c.keepProps) && delete c[g];
          });
        },
        drawCrosshair: function(a, b) {
          var c,
              g = this.crosshair,
              h = z(g.snap, !0),
              e,
              p = this.cross;
          a || (a = this.cross && this.cross.e);
          this.crosshair && !1 !== (l(b) || !h) ? (h ? l(b) && (e = this.isXAxis ? b.plotX : this.len - b.plotY) : e = a && (this.horiz ? a.chartX - this.pos : this.len - a.chartY + this.pos), l(e) && (c = this.getPlotLinePath(b && (this.isXAxis ? b.x : z(b.stackY, b.y)), null, null, null, e) || null), l(c) ? (b = this.categories && !this.isRadial, p || (this.cross = p = this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" + (b ? "category " : "thin ") + g.className).attr({zIndex: z(g.zIndex, 2)}).add()), p.show().attr({d: c}), b && !g.width && p.attr({"stroke-width": this.transA}), this.cross.e = a) : this.hideCrosshair()) : this.hideCrosshair();
        },
        hideCrosshair: function() {
          this.cross && this.cross.hide();
        }
      });
      return a.Axis = K;
    }(I);
    (function(a) {
      var w = a.Axis,
          B = a.getMagnitude,
          A = a.map,
          f = a.normalizeTickInterval,
          d = a.pick;
      w.prototype.getLogTickPositions = function(a, l, v, q) {
        var n = this.options,
            e = this.len,
            k = this.lin2log,
            y = this.log2lin,
            h = [];
        q || (this._minorAutoInterval = null);
        if (.5 <= a)
          a = Math.round(a), h = this.getLinearTickPositions(a, l, v);
        else if (.08 <= a)
          for (var e = Math.floor(l),
              c,
              b,
              g,
              p,
              F,
              n = .3 < a ? [1, 2, 4] : .15 < a ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; e < v + 1 && !F; e++)
            for (b = n.length, c = 0; c < b && !F; c++)
              g = y(k(e) * n[c]), g > l && (!q || p <= v) && void 0 !== p && h.push(p), p > v && (F = !0), p = g;
        else
          l = k(l), v = k(v), a = q ? this.getMinorTickInterval() : n.tickInterval, a = d("auto" === a ? null : a, this._minorAutoInterval, n.tickPixelInterval / (q ? 5 : 1) * (v - l) / ((q ? e / this.tickPositions.length : e) || 1)), a = f(a, null, B(a)), h = A(this.getLinearTickPositions(a, l, v), y), q || (this._minorAutoInterval = a / 5);
        q || (this.tickInterval = a);
        return h;
      };
      w.prototype.log2lin = function(a) {
        return Math.log(a) / Math.LN10;
      };
      w.prototype.lin2log = function(a) {
        return Math.pow(10, a);
      };
    })(I);
    (function(a, w) {
      var B = a.arrayMax,
          A = a.arrayMin,
          f = a.defined,
          d = a.destroyObjectProperties,
          t = a.each,
          l = a.erase,
          v = a.merge,
          q = a.pick;
      a.PlotLineOrBand = function(a, e) {
        this.axis = a;
        e && (this.options = e, this.id = e.id);
      };
      a.PlotLineOrBand.prototype = {
        render: function() {
          var n = this,
              e = n.axis,
              k = e.horiz,
              d = n.options,
              h = d.label,
              c = n.label,
              b = d.to,
              g = d.from,
              p = d.value,
              l = f(g) && f(b),
              t = f(p),
              D = n.svgElem,
              H = !D,
              z = [],
              u = q(d.zIndex, 0),
              C = d.events,
              z = {"class": "highcharts-plot-" + (l ? "band " : "line ") + (d.className || "")},
              E = {},
              J = e.chart.renderer,
              K = l ? "bands" : "lines",
              r;
          r = e.log2lin;
          e.isLog && (g = r(g), b = r(b), p = r(p));
          E.zIndex = u;
          K += "-" + u;
          (r = e.plotLinesAndBandsGroups[K]) || (e.plotLinesAndBandsGroups[K] = r = J.g("plot-" + K).attr(E).add());
          H && (n.svgElem = D = J.path().attr(z).add(r));
          if (t)
            z = e.getPlotLinePath(p, D.strokeWidth());
          else if (l)
            z = e.getPlotBandPath(g, b, d);
          else
            return;
          H && z && z.length ? (D.attr({d: z}), C && a.objectEach(C, function(a, b) {
            D.on(b, function(a) {
              C[b].apply(n, [a]);
            });
          })) : D && (z ? (D.show(), D.animate({d: z})) : (D.hide(), c && (n.label = c = c.destroy())));
          h && f(h.text) && z && z.length && 0 < e.width && 0 < e.height && !z.flat ? (h = v({
            align: k && l && "center",
            x: k ? !l && 4 : 10,
            verticalAlign: !k && l && "middle",
            y: k ? l ? 16 : 10 : l ? 6 : -4,
            rotation: k && !l && 90
          }, h), this.renderLabel(h, z, l, u)) : c && c.hide();
          return n;
        },
        renderLabel: function(a, e, k, d) {
          var h = this.label,
              c = this.axis.chart.renderer;
          h || (h = {
            align: a.textAlign || a.align,
            rotation: a.rotation,
            "class": "highcharts-plot-" + (k ? "band" : "line") + "-label " + (a.className || "")
          }, h.zIndex = d, this.label = h = c.text(a.text, 0, 0, a.useHTML).attr(h).add());
          d = e.xBounds || [e[1], e[4], k ? e[6] : e[1]];
          e = e.yBounds || [e[2], e[5], k ? e[7] : e[2]];
          k = A(d);
          c = A(e);
          h.align(a, !1, {
            x: k,
            y: c,
            width: B(d) - k,
            height: B(e) - c
          });
          h.show();
        },
        destroy: function() {
          l(this.axis.plotLinesAndBands, this);
          delete this.axis;
          d(this);
        }
      };
      a.extend(w.prototype, {
        getPlotBandPath: function(a, e) {
          var k = this.getPlotLinePath(e, null, null, !0),
              d = this.getPlotLinePath(a, null, null, !0),
              h = [],
              c = this.horiz,
              b = 1,
              g;
          a = a < this.min && e < this.min || a > this.max && e > this.max;
          if (d && k)
            for (a && (g = d.toString() === k.toString(), b = 0), a = 0; a < d.length; a += 6)
              c && k[a + 1] === d[a + 1] ? (k[a + 1] += b, k[a + 4] += b) : c || k[a + 2] !== d[a + 2] || (k[a + 2] += b, k[a + 5] += b), h.push("M", d[a + 1], d[a + 2], "L", d[a + 4], d[a + 5], k[a + 4], k[a + 5], k[a + 1], k[a + 2], "z"), h.flat = g;
          return h;
        },
        addPlotBand: function(a) {
          return this.addPlotBandOrLine(a, "plotBands");
        },
        addPlotLine: function(a) {
          return this.addPlotBandOrLine(a, "plotLines");
        },
        addPlotBandOrLine: function(d, e) {
          var k = (new a.PlotLineOrBand(this, d)).render(),
              f = this.userOptions;
          k && (e && (f[e] = f[e] || [], f[e].push(d)), this.plotLinesAndBands.push(k));
          return k;
        },
        removePlotBandOrLine: function(a) {
          for (var e = this.plotLinesAndBands,
              k = this.options,
              d = this.userOptions,
              h = e.length; h--; )
            e[h].id === a && e[h].destroy();
          t([k.plotLines || [], d.plotLines || [], k.plotBands || [], d.plotBands || []], function(c) {
            for (h = c.length; h--; )
              c[h].id === a && l(c, c[h]);
          });
        },
        removePlotBand: function(a) {
          this.removePlotBandOrLine(a);
        },
        removePlotLine: function(a) {
          this.removePlotBandOrLine(a);
        }
      });
    })(I, U);
    (function(a) {
      var w = a.each,
          B = a.extend,
          A = a.format,
          f = a.isNumber,
          d = a.map,
          t = a.merge,
          l = a.pick,
          v = a.splat,
          q = a.syncTimeout,
          n = a.timeUnits;
      a.Tooltip = function() {
        this.init.apply(this, arguments);
      };
      a.Tooltip.prototype = {
        init: function(a, k) {
          this.chart = a;
          this.options = k;
          this.crosshairs = [];
          this.now = {
            x: 0,
            y: 0
          };
          this.isHidden = !0;
          this.split = k.split && !a.inverted;
          this.shared = k.shared || this.split;
        },
        cleanSplit: function(a) {
          w(this.chart.series, function(e) {
            var k = e && e.tt;
            k && (!k.isActive || a ? e.tt = k.destroy() : k.isActive = !1);
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
              k = this.options;
          this.label || (this.label = this.split ? a.g("tooltip") : a.label("", 0, 0, k.shape || "callout", null, null, k.useHTML, null, "tooltip").attr({
            padding: k.padding,
            r: k.borderRadius
          }), this.applyFilter(), this.label.addClass("highcharts-tooltip-" + this.chart.index), this.label.attr({zIndex: 8}).add());
          return this.label;
        },
        update: function(a) {
          this.destroy();
          t(!0, this.chart.options.tooltip.userOptions, a);
          this.init(this.chart, t(!0, this.options, a));
        },
        destroy: function() {
          this.label && (this.label = this.label.destroy());
          this.split && this.tt && (this.cleanSplit(this.chart, !0), this.tt = this.tt.destroy());
          clearTimeout(this.hideTimer);
          clearTimeout(this.tooltipTimeout);
        },
        move: function(a, k, d, h) {
          var c = this,
              b = c.now,
              g = !1 !== c.options.animation && !c.isHidden && (1 < Math.abs(a - b.x) || 1 < Math.abs(k - b.y)),
              e = c.followPointer || 1 < c.len;
          B(b, {
            x: g ? (2 * b.x + a) / 3 : a,
            y: g ? (b.y + k) / 2 : k,
            anchorX: e ? void 0 : g ? (2 * b.anchorX + d) / 3 : d,
            anchorY: e ? void 0 : g ? (b.anchorY + h) / 2 : h
          });
          c.getLabel().attr(b);
          g && (clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function() {
            c && c.move(a, k, d, h);
          }, 32));
        },
        hide: function(a) {
          var e = this;
          clearTimeout(this.hideTimer);
          a = l(a, this.options.hideDelay, 500);
          this.isHidden || (this.hideTimer = q(function() {
            e.getLabel()[a ? "fadeOut" : "hide"]();
            e.isHidden = !0;
          }, a));
        },
        getAnchor: function(a, k) {
          var e,
              h = this.chart,
              c = h.inverted,
              b = h.plotTop,
              g = h.plotLeft,
              p = 0,
              f = 0,
              n,
              l;
          a = v(a);
          e = a[0].tooltipPos;
          this.followPointer && k && (void 0 === k.chartX && (k = h.pointer.normalize(k)), e = [k.chartX - h.plotLeft, k.chartY - b]);
          e || (w(a, function(a) {
            n = a.series.yAxis;
            l = a.series.xAxis;
            p += a.plotX + (!c && l ? l.left - g : 0);
            f += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!c && n ? n.top - b : 0);
          }), p /= a.length, f /= a.length, e = [c ? h.plotWidth - f : p, this.shared && !c && 1 < a.length && k ? k.chartY - b : c ? h.plotHeight - p : f]);
          return d(e, Math.round);
        },
        getPosition: function(a, k, d) {
          var h = this.chart,
              c = this.distance,
              b = {},
              g = h.inverted && d.h || 0,
              e,
              f = ["y", h.chartHeight, k, d.plotY + h.plotTop, h.plotTop, h.plotTop + h.plotHeight],
              n = ["x", h.chartWidth, a, d.plotX + h.plotLeft, h.plotLeft, h.plotLeft + h.plotWidth],
              D = !this.followPointer && l(d.ttBelow, !h.inverted === !!d.negative),
              H = function(a, h, e, p, u, d) {
                var m = e < p - c,
                    r = p + c + e < h,
                    k = p - c - e;
                p += c;
                if (D && r)
                  b[a] = p;
                else if (!D && m)
                  b[a] = k;
                else if (m)
                  b[a] = Math.min(d - e, 0 > k - g ? k : k - g);
                else if (r)
                  b[a] = Math.max(u, p + g + e > h ? p : p + g);
                else
                  return !1;
              },
              z = function(a, g, h, e) {
                var p;
                e < c || e > g - c ? p = !1 : b[a] = e < h / 2 ? 1 : e > g - h / 2 ? g - h - 2 : e - h / 2;
                return p;
              },
              u = function(a) {
                var b = f;
                f = n;
                n = b;
                e = a;
              },
              C = function() {
                !1 !== H.apply(0, f) ? !1 !== z.apply(0, n) || e || (u(!0), C()) : e ? b.x = b.y = 0 : (u(!0), C());
              };
          (h.inverted || 1 < this.len) && u();
          C();
          return b;
        },
        defaultFormatter: function(a) {
          var e = this.points || v(this),
              d;
          d = [a.tooltipFooterHeaderFormatter(e[0])];
          d = d.concat(a.bodyFormatter(e));
          d.push(a.tooltipFooterHeaderFormatter(e[0], !0));
          return d;
        },
        refresh: function(a, d) {
          var e,
              h = this.options,
              c = a,
              b,
              g = {},
              p = [];
          e = h.formatter || this.defaultFormatter;
          var g = this.shared,
              k;
          h.enabled && (clearTimeout(this.hideTimer), this.followPointer = v(c)[0].series.tooltipOptions.followPointer, b = this.getAnchor(c, d), d = b[0], h = b[1], !g || c.series && c.series.noSharedTooltip ? g = c.getLabelConfig() : (w(c, function(a) {
            a.setState("hover");
            p.push(a.getLabelConfig());
          }), g = {
            x: c[0].category,
            y: c[0].y
          }, g.points = p, c = c[0]), this.len = p.length, g = e.call(g, this), k = c.series, this.distance = l(k.tooltipOptions.distance, 16), !1 === g ? this.hide() : (e = this.getLabel(), this.isHidden && e.attr({opacity: 1}).show(), this.split ? this.renderSplit(g, v(a)) : (e.css({width: this.chart.spacingBox.width}), e.attr({text: g && g.join ? g.join("") : g}), e.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-" + l(c.colorIndex, k.colorIndex)), this.updatePosition({
            plotX: d,
            plotY: h,
            negative: c.negative,
            ttBelow: c.ttBelow,
            h: b[2] || 0
          })), this.isHidden = !1));
        },
        renderSplit: function(e, d) {
          var k = this,
              h = [],
              c = this.chart,
              b = c.renderer,
              g = !0,
              p = this.options,
              f = 0,
              n = this.getLabel();
          a.isString(e) && (e = [!1, e]);
          w(e.slice(0, d.length + 1), function(a, e) {
            if (!1 !== a) {
              e = d[e - 1] || {
                isHeader: !0,
                plotX: d[0].plotX
              };
              var z = e.series || k,
                  u = z.tt,
                  C = "highcharts-color-" + l(e.colorIndex, (e.series || {}).colorIndex, "none");
              u || (z.tt = u = b.label(null, null, null, "callout", null, null, p.useHTML).addClass("highcharts-tooltip-box " + C).attr({
                padding: p.padding,
                r: p.borderRadius
              }).add(n));
              u.isActive = !0;
              u.attr({text: a});
              a = u.getBBox();
              C = a.width + u.strokeWidth();
              e.isHeader ? (f = a.height, C = Math.max(0, Math.min(e.plotX + c.plotLeft - C / 2, c.chartWidth - C))) : C = e.plotX + c.plotLeft - l(p.distance, 16) - C;
              0 > C && (g = !1);
              a = (e.series && e.series.yAxis && e.series.yAxis.pos) + (e.plotY || 0);
              a -= c.plotTop;
              h.push({
                target: e.isHeader ? c.plotHeight + f : a,
                rank: e.isHeader ? 1 : 0,
                size: z.tt.getBBox().height + 1,
                point: e,
                x: C,
                tt: u
              });
            }
          });
          this.cleanSplit();
          a.distribute(h, c.plotHeight + f);
          w(h, function(a) {
            var b = a.point,
                h = b.series;
            a.tt.attr({
              visibility: void 0 === a.pos ? "hidden" : "inherit",
              x: g || b.isHeader ? a.x : b.plotX + c.plotLeft + l(p.distance, 16),
              y: a.pos + c.plotTop,
              anchorX: b.isHeader ? b.plotX + c.plotLeft : b.plotX + h.xAxis.pos,
              anchorY: b.isHeader ? a.pos + c.plotTop - 15 : b.plotY + h.yAxis.pos
            });
          });
        },
        updatePosition: function(a) {
          var e = this.chart,
              d = this.getLabel(),
              d = (this.options.positioner || this.getPosition).call(this, d.width, d.height, a);
          this.move(Math.round(d.x), Math.round(d.y || 0), a.plotX + e.plotLeft, a.plotY + e.plotTop);
        },
        getDateFormat: function(a, d, f, h) {
          var c = this.chart.time,
              b = c.dateFormat("%m-%d %H:%M:%S.%L", d),
              g,
              e,
              k = {
                millisecond: 15,
                second: 12,
                minute: 9,
                hour: 6,
                day: 3
              },
              l = "millisecond";
          for (e in n) {
            if (a === n.week && +c.dateFormat("%w", d) === f && "00:00:00.000" === b.substr(6)) {
              e = "week";
              break;
            }
            if (n[e] > a) {
              e = l;
              break;
            }
            if (k[e] && b.substr(k[e]) !== "01-01 00:00:00.000".substr(k[e]))
              break;
            "week" !== e && (l = e);
          }
          e && (g = h[e]);
          return g;
        },
        getXDateFormat: function(a, d, f) {
          d = d.dateTimeLabelFormats;
          var h = f && f.closestPointRange;
          return (h ? this.getDateFormat(h, a.x, f.options.startOfWeek, d) : d.day) || d.year;
        },
        tooltipFooterHeaderFormatter: function(a, d) {
          d = d ? "footer" : "header";
          var e = a.series,
              h = e.tooltipOptions,
              c = h.xDateFormat,
              b = e.xAxis,
              g = b && "datetime" === b.options.type && f(a.key),
              p = h[d + "Format"];
          g && !c && (c = this.getXDateFormat(a, h, b));
          g && c && w(a.point && a.point.tooltipDateKeys || ["key"], function(a) {
            p = p.replace("{point." + a + "}", "{point." + a + ":" + c + "}");
          });
          return A(p, {
            point: a,
            series: e
          }, this.chart.time);
        },
        bodyFormatter: function(a) {
          return d(a, function(a) {
            var e = a.series.tooltipOptions;
            return (e[(a.point.formatPrefix || "point") + "Formatter"] || a.point.tooltipFormatter).call(a.point, e[(a.point.formatPrefix || "point") + "Format"]);
          });
        }
      };
    })(I);
    (function(a) {
      var w = a.addEvent,
          B = a.attr,
          A = a.charts,
          f = a.css,
          d = a.defined,
          t = a.each,
          l = a.extend,
          v = a.find,
          q = a.fireEvent,
          n = a.isNumber,
          e = a.isObject,
          k = a.offset,
          y = a.pick,
          h = a.splat,
          c = a.Tooltip;
      a.Pointer = function(a, c) {
        this.init(a, c);
      };
      a.Pointer.prototype = {
        init: function(a, g) {
          this.options = g;
          this.chart = a;
          this.runChartClick = g.chart.events && !!g.chart.events.click;
          this.pinchDown = [];
          this.lastValidTouch = {};
          c && (a.tooltip = new c(a, g.tooltip), this.followTouchMove = y(g.tooltip.followTouchMove, !0));
          this.setDOMEvents();
        },
        zoomOption: function(a) {
          var b = this.chart,
              c = b.options.chart,
              h = c.zoomType || "",
              b = b.inverted;
          /touch/.test(a.type) && (h = y(c.pinchType, h));
          this.zoomX = a = /x/.test(h);
          this.zoomY = h = /y/.test(h);
          this.zoomHor = a && !b || h && b;
          this.zoomVert = h && !b || a && b;
          this.hasZoom = a || h;
        },
        normalize: function(a, c) {
          var b;
          b = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] : a;
          c || (this.chartPosition = c = k(this.chart.container));
          return l(a, {
            chartX: Math.round(b.pageX - c.left),
            chartY: Math.round(b.pageY - c.top)
          });
        },
        getCoordinates: function(a) {
          var b = {
            xAxis: [],
            yAxis: []
          };
          t(this.chart.axes, function(c) {
            b[c.isXAxis ? "xAxis" : "yAxis"].push({
              axis: c,
              value: c.toValue(a[c.horiz ? "chartX" : "chartY"])
            });
          });
          return b;
        },
        findNearestKDPoint: function(a, c, h) {
          var b;
          t(a, function(a) {
            var g = !(a.noSharedTooltip && c) && 0 > a.options.findNearestPointBy.indexOf("y");
            a = a.searchPoint(h, g);
            if ((g = e(a, !0)) && !(g = !e(b, !0)))
              var g = b.distX - a.distX,
                  p = b.dist - a.dist,
                  d = (a.series.group && a.series.group.zIndex) - (b.series.group && b.series.group.zIndex),
                  g = 0 < (0 !== g && c ? g : 0 !== p ? p : 0 !== d ? d : b.series.index > a.series.index ? -1 : 1);
            g && (b = a);
          });
          return b;
        },
        getPointFromEvent: function(a) {
          a = a.target;
          for (var b; a && !b; )
            b = a.point, a = a.parentNode;
          return b;
        },
        getChartCoordinatesFromPoint: function(a, c) {
          var b = a.series,
              g = b.xAxis,
              b = b.yAxis,
              h = y(a.clientX, a.plotX);
          if (g && b)
            return c ? {
              chartX: g.len + g.pos - h,
              chartY: b.len + b.pos - a.plotY
            } : {
              chartX: h + g.pos,
              chartY: a.plotY + b.pos
            };
        },
        getHoverData: function(b, c, h, d, f, k, n) {
          var g,
              u = [],
              p = n && n.isBoosting;
          d = !(!d || !b);
          n = c && !c.stickyTracking ? [c] : a.grep(h, function(a) {
            return a.visible && !(!f && a.directTouch) && y(a.options.enableMouseTracking, !0) && a.stickyTracking;
          });
          c = (g = d ? b : this.findNearestKDPoint(n, f, k)) && g.series;
          g && (f && !c.noSharedTooltip ? (n = a.grep(h, function(a) {
            return a.visible && !(!f && a.directTouch) && y(a.options.enableMouseTracking, !0) && !a.noSharedTooltip;
          }), t(n, function(a) {
            var b = v(a.points, function(a) {
              return a.x === g.x && !a.isNull;
            });
            e(b) && (p && (b = a.getPoint(b)), u.push(b));
          })) : u.push(g));
          return {
            hoverPoint: g,
            hoverSeries: c,
            hoverPoints: u
          };
        },
        runPointActions: function(b, c) {
          var g = this.chart,
              h = g.tooltip && g.tooltip.options.enabled ? g.tooltip : void 0,
              e = h ? h.shared : !1,
              d = c || g.hoverPoint,
              f = d && d.series || g.hoverSeries,
              f = this.getHoverData(d, f, g.series, !!c || f && f.directTouch && this.isDirectTouch, e, b, {isBoosting: g.isBoosting}),
              k,
              d = f.hoverPoint;
          k = f.hoverPoints;
          c = (f = f.hoverSeries) && f.tooltipOptions.followPointer;
          e = e && f && !f.noSharedTooltip;
          if (d && (d !== g.hoverPoint || h && h.isHidden)) {
            t(g.hoverPoints || [], function(b) {
              -1 === a.inArray(b, k) && b.setState();
            });
            t(k || [], function(a) {
              a.setState("hover");
            });
            if (g.hoverSeries !== f)
              f.onMouseOver();
            g.hoverPoint && g.hoverPoint.firePointEvent("mouseOut");
            if (!d.series)
              return;
            d.firePointEvent("mouseOver");
            g.hoverPoints = k;
            g.hoverPoint = d;
            h && h.refresh(e ? k : d, b);
          } else
            c && h && !h.isHidden && (d = h.getAnchor([{}], b), h.updatePosition({
              plotX: d[0],
              plotY: d[1]
            }));
          this.unDocMouseMove || (this.unDocMouseMove = w(g.container.ownerDocument, "mousemove", function(b) {
            var c = A[a.hoverChartIndex];
            if (c)
              c.pointer.onDocumentMouseMove(b);
          }));
          t(g.axes, function(c) {
            var g = y(c.crosshair.snap, !0),
                h = g ? a.find(k, function(a) {
                  return a.series[c.coll] === c;
                }) : void 0;
            h || !g ? c.drawCrosshair(b, h) : c.hideCrosshair();
          });
        },
        reset: function(a, c) {
          var b = this.chart,
              g = b.hoverSeries,
              e = b.hoverPoint,
              d = b.hoverPoints,
              f = b.tooltip,
              k = f && f.shared ? d : e;
          a && k && t(h(k), function(b) {
            b.series.isCartesian && void 0 === b.plotX && (a = !1);
          });
          if (a)
            f && k && (f.refresh(k), e && (e.setState(e.state, !0), t(b.axes, function(a) {
              a.crosshair && a.drawCrosshair(null, e);
            })));
          else {
            if (e)
              e.onMouseOut();
            d && t(d, function(a) {
              a.setState();
            });
            if (g)
              g.onMouseOut();
            f && f.hide(c);
            this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove());
            t(b.axes, function(a) {
              a.hideCrosshair();
            });
            this.hoverX = b.hoverPoints = b.hoverPoint = null;
          }
        },
        scaleGroups: function(a, c) {
          var b = this.chart,
              g;
          t(b.series, function(h) {
            g = a || h.getPlotBox();
            h.xAxis && h.xAxis.zoomEnabled && h.group && (h.group.attr(g), h.markerGroup && (h.markerGroup.attr(g), h.markerGroup.clip(c ? b.clipRect : null)), h.dataLabelsGroup && h.dataLabelsGroup.attr(g));
          });
          b.clipRect.attr(c || b.clipBox);
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
              c = b.options.chart,
              h = a.chartX,
              e = a.chartY,
              d = this.zoomHor,
              f = this.zoomVert,
              k = b.plotLeft,
              u = b.plotTop,
              n = b.plotWidth,
              E = b.plotHeight,
              l,
              q = this.selectionMarker,
              r = this.mouseDownX,
              x = this.mouseDownY,
              t = c.panKey && a[c.panKey + "Key"];
          q && q.touch || (h < k ? h = k : h > k + n && (h = k + n), e < u ? e = u : e > u + E && (e = u + E), this.hasDragged = Math.sqrt(Math.pow(r - h, 2) + Math.pow(x - e, 2)), 10 < this.hasDragged && (l = b.isInsidePlot(r - k, x - u), b.hasCartesianSeries && (this.zoomX || this.zoomY) && l && !t && !q && (this.selectionMarker = q = b.renderer.rect(k, u, d ? 1 : n, f ? 1 : E, 0).attr({
            "class": "highcharts-selection-marker",
            zIndex: 7
          }).add()), q && d && (h -= r, q.attr({
            width: Math.abs(h),
            x: (0 < h ? 0 : h) + r
          })), q && f && (h = e - x, q.attr({
            height: Math.abs(h),
            y: (0 < h ? 0 : h) + x
          })), l && !q && c.panning && b.pan(a, c.panning)));
        },
        drop: function(a) {
          var b = this,
              c = this.chart,
              h = this.hasPinched;
          if (this.selectionMarker) {
            var e = {
              originalEvent: a,
              xAxis: [],
              yAxis: []
            },
                k = this.selectionMarker,
                H = k.attr ? k.attr("x") : k.x,
                z = k.attr ? k.attr("y") : k.y,
                u = k.attr ? k.attr("width") : k.width,
                C = k.attr ? k.attr("height") : k.height,
                E;
            if (this.hasDragged || h)
              t(c.axes, function(c) {
                if (c.zoomEnabled && d(c.min) && (h || b[{
                  xAxis: "zoomX",
                  yAxis: "zoomY"
                }[c.coll]])) {
                  var g = c.horiz,
                      f = "touchend" === a.type ? c.minPixelPadding : 0,
                      p = c.toValue((g ? H : z) + f),
                      g = c.toValue((g ? H + u : z + C) - f);
                  e[c.coll].push({
                    axis: c,
                    min: Math.min(p, g),
                    max: Math.max(p, g)
                  });
                  E = !0;
                }
              }), E && q(c, "selection", e, function(a) {
                c.zoom(l(a, h ? {animation: !1} : null));
              });
            n(c.index) && (this.selectionMarker = this.selectionMarker.destroy());
            h && this.scaleGroups();
          }
          c && n(c.index) && (f(c.container, {cursor: c._cursor}), c.cancelClick = 10 < this.hasDragged, c.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = []);
        },
        onContainerMouseDown: function(a) {
          a = this.normalize(a);
          2 !== a.button && (this.zoomOption(a), a.preventDefault && a.preventDefault(), this.dragStart(a));
        },
        onDocumentMouseUp: function(b) {
          A[a.hoverChartIndex] && A[a.hoverChartIndex].pointer.drop(b);
        },
        onDocumentMouseMove: function(a) {
          var b = this.chart,
              c = this.chartPosition;
          a = this.normalize(a, c);
          !c || this.inClass(a.target, "highcharts-tracker") || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) || this.reset();
        },
        onContainerMouseLeave: function(b) {
          var c = A[a.hoverChartIndex];
          c && (b.relatedTarget || b.toElement) && (c.pointer.reset(), c.pointer.chartPosition = null);
        },
        onContainerMouseMove: function(b) {
          var c = this.chart;
          d(a.hoverChartIndex) && A[a.hoverChartIndex] && A[a.hoverChartIndex].mouseIsDown || (a.hoverChartIndex = c.index);
          b = this.normalize(b);
          b.returnValue = !1;
          "mousedown" === c.mouseIsDown && this.drag(b);
          !this.inClass(b.target, "highcharts-tracker") && !c.isInsidePlot(b.chartX - c.plotLeft, b.chartY - c.plotTop) || c.openMenu || this.runPointActions(b);
        },
        inClass: function(a, c) {
          for (var b; a; ) {
            if (b = B(a, "class")) {
              if (-1 !== b.indexOf(c))
                return !0;
              if (-1 !== b.indexOf("highcharts-container"))
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
              c = b.hoverPoint,
              h = b.plotLeft,
              e = b.plotTop;
          a = this.normalize(a);
          b.cancelClick || (c && this.inClass(a.target, "highcharts-tracker") ? (q(c.series, "click", l(a, {point: c})), b.hoverPoint && c.firePointEvent("click", a)) : (l(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - h, a.chartY - e) && q(b, "click", a)));
        },
        setDOMEvents: function() {
          var b = this,
              c = b.chart.container,
              h = c.ownerDocument;
          c.onmousedown = function(a) {
            b.onContainerMouseDown(a);
          };
          c.onmousemove = function(a) {
            b.onContainerMouseMove(a);
          };
          c.onclick = function(a) {
            b.onContainerClick(a);
          };
          this.unbindContainerMouseLeave = w(c, "mouseleave", b.onContainerMouseLeave);
          a.unbindDocumentMouseUp || (a.unbindDocumentMouseUp = w(h, "mouseup", b.onDocumentMouseUp));
          a.hasTouch && (c.ontouchstart = function(a) {
            b.onContainerTouchStart(a);
          }, c.ontouchmove = function(a) {
            b.onContainerTouchMove(a);
          }, a.unbindDocumentTouchEnd || (a.unbindDocumentTouchEnd = w(h, "touchend", b.onDocumentTouchEnd)));
        },
        destroy: function() {
          var b = this;
          b.unDocMouseMove && b.unDocMouseMove();
          this.unbindContainerMouseLeave();
          a.chartCount || (a.unbindDocumentMouseUp && (a.unbindDocumentMouseUp = a.unbindDocumentMouseUp()), a.unbindDocumentTouchEnd && (a.unbindDocumentTouchEnd = a.unbindDocumentTouchEnd()));
          clearInterval(b.tooltipTimeout);
          a.objectEach(b, function(a, c) {
            b[c] = null;
          });
        }
      };
    })(I);
    (function(a) {
      var w = a.charts,
          B = a.each,
          A = a.extend,
          f = a.map,
          d = a.noop,
          t = a.pick;
      A(a.Pointer.prototype, {
        pinchTranslate: function(a, d, f, n, e, k) {
          this.zoomHor && this.pinchTranslateDirection(!0, a, d, f, n, e, k);
          this.zoomVert && this.pinchTranslateDirection(!1, a, d, f, n, e, k);
        },
        pinchTranslateDirection: function(a, d, f, n, e, k, t, h) {
          var c = this.chart,
              b = a ? "x" : "y",
              g = a ? "X" : "Y",
              p = "chart" + g,
              l = a ? "width" : "height",
              q = c["plot" + (a ? "Left" : "Top")],
              D,
              H,
              z = h || 1,
              u = c.inverted,
              C = c.bounds[a ? "h" : "v"],
              E = 1 === d.length,
              J = d[0][p],
              K = f[0][p],
              r = !E && d[1][p],
              x = !E && f[1][p],
              y;
          f = function() {
            !E && 20 < Math.abs(J - r) && (z = h || Math.abs(K - x) / Math.abs(J - r));
            H = (q - K) / z + J;
            D = c["plot" + (a ? "Width" : "Height")] / z;
          };
          f();
          d = H;
          d < C.min ? (d = C.min, y = !0) : d + D > C.max && (d = C.max - D, y = !0);
          y ? (K -= .8 * (K - t[b][0]), E || (x -= .8 * (x - t[b][1])), f()) : t[b] = [K, x];
          u || (k[b] = H - q, k[l] = D);
          k = u ? 1 / z : z;
          e[l] = D;
          e[b] = d;
          n[u ? a ? "scaleY" : "scaleX" : "scale" + g] = z;
          n["translate" + g] = k * q + (K - k * J);
        },
        pinch: function(a) {
          var l = this,
              q = l.chart,
              n = l.pinchDown,
              e = a.touches,
              k = e.length,
              y = l.lastValidTouch,
              h = l.hasZoom,
              c = l.selectionMarker,
              b = {},
              g = 1 === k && (l.inClass(a.target, "highcharts-tracker") && q.runTrackerClick || l.runChartClick),
              p = {};
          1 < k && (l.initiated = !0);
          h && l.initiated && !g && a.preventDefault();
          f(e, function(a) {
            return l.normalize(a);
          });
          "touchstart" === a.type ? (B(e, function(a, b) {
            n[b] = {
              chartX: a.chartX,
              chartY: a.chartY
            };
          }), y.x = [n[0].chartX, n[1] && n[1].chartX], y.y = [n[0].chartY, n[1] && n[1].chartY], B(q.axes, function(a) {
            if (a.zoomEnabled) {
              var b = q.bounds[a.horiz ? "h" : "v"],
                  c = a.minPixelPadding,
                  h = a.toPixels(t(a.options.min, a.dataMin)),
                  g = a.toPixels(t(a.options.max, a.dataMax)),
                  e = Math.max(h, g);
              b.min = Math.min(a.pos, Math.min(h, g) - c);
              b.max = Math.max(a.pos + a.len, e + c);
            }
          }), l.res = !0) : l.followTouchMove && 1 === k ? this.runPointActions(l.normalize(a)) : n.length && (c || (l.selectionMarker = c = A({
            destroy: d,
            touch: !0
          }, q.plotBox)), l.pinchTranslate(n, e, b, c, p, y), l.hasPinched = h, l.scaleGroups(b, p), l.res && (l.res = !1, this.reset(!1, 0)));
        },
        touch: function(d, f) {
          var l = this.chart,
              n,
              e;
          if (l.index !== a.hoverChartIndex)
            this.onContainerMouseLeave({relatedTarget: !0});
          a.hoverChartIndex = l.index;
          1 === d.touches.length ? (d = this.normalize(d), (e = l.isInsidePlot(d.chartX - l.plotLeft, d.chartY - l.plotTop)) && !l.openMenu ? (f && this.runPointActions(d), "touchmove" === d.type && (f = this.pinchDown, n = f[0] ? 4 <= Math.sqrt(Math.pow(f[0].chartX - d.chartX, 2) + Math.pow(f[0].chartY - d.chartY, 2)) : !1), t(n, !0) && this.pinch(d)) : f && this.reset()) : 2 === d.touches.length && this.pinch(d);
        },
        onContainerTouchStart: function(a) {
          this.zoomOption(a);
          this.touch(a, !0);
        },
        onContainerTouchMove: function(a) {
          this.touch(a);
        },
        onDocumentTouchEnd: function(d) {
          w[a.hoverChartIndex] && w[a.hoverChartIndex].pointer.drop(d);
        }
      });
    })(I);
    (function(a) {
      var w = a.addEvent,
          B = a.charts,
          A = a.css,
          f = a.doc,
          d = a.extend,
          t = a.noop,
          l = a.Pointer,
          v = a.removeEvent,
          q = a.win,
          n = a.wrap;
      if (!a.hasTouch && (q.PointerEvent || q.MSPointerEvent)) {
        var e = {},
            k = !!q.PointerEvent,
            y = function() {
              var c = [];
              c.item = function(a) {
                return this[a];
              };
              a.objectEach(e, function(a) {
                c.push({
                  pageX: a.pageX,
                  pageY: a.pageY,
                  target: a.target
                });
              });
              return c;
            },
            h = function(c, b, h, e) {
              "touch" !== c.pointerType && c.pointerType !== c.MSPOINTER_TYPE_TOUCH || !B[a.hoverChartIndex] || (e(c), e = B[a.hoverChartIndex].pointer, e[b]({
                type: h,
                target: c.currentTarget,
                preventDefault: t,
                touches: y()
              }));
            };
        d(l.prototype, {
          onContainerPointerDown: function(a) {
            h(a, "onContainerTouchStart", "touchstart", function(a) {
              e[a.pointerId] = {
                pageX: a.pageX,
                pageY: a.pageY,
                target: a.currentTarget
              };
            });
          },
          onContainerPointerMove: function(a) {
            h(a, "onContainerTouchMove", "touchmove", function(a) {
              e[a.pointerId] = {
                pageX: a.pageX,
                pageY: a.pageY
              };
              e[a.pointerId].target || (e[a.pointerId].target = a.currentTarget);
            });
          },
          onDocumentPointerUp: function(a) {
            h(a, "onDocumentTouchEnd", "touchend", function(a) {
              delete e[a.pointerId];
            });
          },
          batchMSEvents: function(a) {
            a(this.chart.container, k ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown);
            a(this.chart.container, k ? "pointermove" : "MSPointerMove", this.onContainerPointerMove);
            a(f, k ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp);
          }
        });
        n(l.prototype, "init", function(a, b, h) {
          a.call(this, b, h);
          this.hasZoom && A(b.container, {
            "-ms-touch-action": "none",
            "touch-action": "none"
          });
        });
        n(l.prototype, "setDOMEvents", function(a) {
          a.apply(this);
          (this.hasZoom || this.followTouchMove) && this.batchMSEvents(w);
        });
        n(l.prototype, "destroy", function(a) {
          this.batchMSEvents(v);
          a.call(this);
        });
      }
    })(I);
    (function(a) {
      var w = a.addEvent,
          B = a.css,
          A = a.discardElement,
          f = a.defined,
          d = a.each,
          t = a.isFirefox,
          l = a.marginNames,
          v = a.merge,
          q = a.pick,
          n = a.setAnimation,
          e = a.stableSort,
          k = a.win,
          y = a.wrap;
      a.Legend = function(a, c) {
        this.init(a, c);
      };
      a.Legend.prototype = {
        init: function(a, c) {
          this.chart = a;
          this.setOptions(c);
          c.enabled && (this.render(), w(this.chart, "endResize", function() {
            this.legend.positionCheckboxes();
          }));
        },
        setOptions: function(a) {
          var c = q(a.padding, 8);
          this.options = a;
          this.itemMarginTop = a.itemMarginTop || 0;
          this.padding = c;
          this.initialItemY = c - 5;
          this.itemHeight = this.maxItemWidth = 0;
          this.symbolWidth = q(a.symbolWidth, 16);
          this.pages = [];
        },
        update: function(a, c) {
          var b = this.chart;
          this.setOptions(v(!0, this.options, a));
          this.destroy();
          b.isDirtyLegend = b.isDirtyBox = !0;
          q(c, !0) && b.redraw();
        },
        colorizeItem: function(a, c) {
          a.legendGroup[c ? "removeClass" : "addClass"]("highcharts-legend-item-hidden");
        },
        positionItem: function(a) {
          var c = this.options,
              b = c.symbolPadding,
              c = !c.rtl,
              h = a._legendItemPos,
              e = h[0],
              h = h[1],
              d = a.checkbox;
          (a = a.legendGroup) && a.element && a.translate(c ? e : this.legendWidth - e - 2 * b - 4, h);
          d && (d.x = e, d.y = h);
        },
        destroyItem: function(a) {
          var c = a.checkbox;
          d(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function(b) {
            a[b] && (a[b] = a[b].destroy());
          });
          c && A(a.checkbox);
        },
        destroy: function() {
          function a(a) {
            this[a] && (this[a] = this[a].destroy());
          }
          d(this.getAllItems(), function(c) {
            d(["legendItem", "legendGroup"], a, c);
          });
          d("clipRect up down pager nav box title group".split(" "), a, this);
          this.display = null;
        },
        positionCheckboxes: function() {
          var a = this.group && this.group.alignAttr,
              c,
              b = this.clipHeight || this.legendHeight,
              g = this.titleHeight;
          a && (c = a.translateY, d(this.allItems, function(h) {
            var e = h.checkbox,
                d;
            e && (d = c + g + e.y + (this.scrollOffset || 0) + 3, B(e, {
              left: a.translateX + h.checkboxOffset + e.x - 20 + "px",
              top: d + "px",
              display: d > c - 6 && d < c + b - 6 ? "" : "none"
            }));
          }, this));
        },
        renderTitle: function() {
          var a = this.options,
              c = this.padding,
              b = a.title,
              g = 0;
          b.text && (this.title || (this.title = this.chart.renderer.label(b.text, c - 3, c - 4, null, null, null, a.useHTML, null, "legend-title").attr({zIndex: 1}).add(this.group)), a = this.title.getBBox(), g = a.height, this.offsetWidth = a.width, this.contentGroup.attr({translateY: g}));
          this.titleHeight = g;
        },
        setText: function(h) {
          var c = this.options;
          h.legendItem.attr({text: c.labelFormat ? a.format(c.labelFormat, h, this.chart.time) : c.labelFormatter.call(h)});
        },
        renderItem: function(a) {
          var c = this.chart,
              b = c.renderer,
              g = this.options,
              h = "horizontal" === g.layout,
              e = this.symbolWidth,
              d = g.symbolPadding,
              f = this.padding,
              k = h ? q(g.itemDistance, 20) : 0,
              n = !g.rtl,
              u = g.width,
              C = g.itemMarginBottom || 0,
              E = this.itemMarginTop,
              l = a.legendItem,
              t = !a.series,
              r = !t && a.series.drawLegendSymbol ? a.series : a,
              x = r.options,
              y = this.createCheckboxForItem && x && x.showCheckbox,
              x = e + d + k + (y ? 20 : 0),
              m = g.useHTML,
              G = a.options.className;
          l || (a.legendGroup = b.g("legend-item").addClass("highcharts-" + r.type + "-series highcharts-color-" + a.colorIndex + (G ? " " + G : "") + (t ? " highcharts-series-" + a.index : "")).attr({zIndex: 1}).add(this.scrollGroup), a.legendItem = l = b.text("", n ? e + d : -d, this.baseline || 0, m).attr({
            align: n ? "left" : "right",
            zIndex: 2
          }).add(a.legendGroup), this.baseline || (this.fontMetrics = b.fontMetrics(12, l), this.baseline = this.fontMetrics.f + 3 + E, l.attr("y", this.baseline)), this.symbolHeight = g.symbolHeight || this.fontMetrics.f, r.drawLegendSymbol(this, a), this.setItemEvents && this.setItemEvents(a, l, m), y && this.createCheckboxForItem(a));
          this.colorizeItem(a, a.visible);
          l.css({width: (g.itemWidth || g.width || c.spacingBox.width) - x});
          this.setText(a);
          b = l.getBBox();
          e = a.checkboxOffset = g.itemWidth || a.legendItemWidth || b.width + x;
          this.itemHeight = b = Math.round(a.legendItemHeight || b.height || this.symbolHeight);
          h && this.itemX - f + e > (u || c.spacingBox.width - 2 * f - g.x) && (this.itemX = f, this.itemY += E + this.lastLineHeight + C, this.lastLineHeight = 0);
          this.maxItemWidth = Math.max(this.maxItemWidth, e);
          this.lastItemY = E + this.itemY + C;
          this.lastLineHeight = Math.max(b, this.lastLineHeight);
          a._legendItemPos = [this.itemX, this.itemY];
          h ? this.itemX += e : (this.itemY += E + b + C, this.lastLineHeight = b);
          this.offsetWidth = u || Math.max((h ? this.itemX - f - (a.checkbox ? 0 : k) : e) + f, this.offsetWidth);
        },
        getAllItems: function() {
          var a = [];
          d(this.chart.series, function(c) {
            var b = c && c.options;
            c && q(b.showInLegend, f(b.linkedTo) ? !1 : void 0, !0) && (a = a.concat(c.legendItems || ("point" === b.legendType ? c.data : c)));
          });
          return a;
        },
        getAlignment: function() {
          var a = this.options;
          return a.floating ? "" : a.align.charAt(0) + a.verticalAlign.charAt(0) + a.layout.charAt(0);
        },
        adjustMargins: function(a, c) {
          var b = this.chart,
              g = this.options,
              e = this.getAlignment();
          e && d([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function(h, d) {
            h.test(e) && !f(a[d]) && (b[l[d]] = Math.max(b[l[d]], b.legend[(d + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][d] * g[d % 2 ? "x" : "y"] + q(g.margin, 12) + c[d] + (0 === d ? b.titleOffset + b.options.title.margin : 0)));
          });
        },
        render: function() {
          var a = this,
              c = a.chart,
              b = c.renderer,
              g = a.group,
              f,
              k,
              n,
              l,
              q = a.box,
              z = a.options,
              u = a.padding;
          a.itemX = u;
          a.itemY = a.initialItemY;
          a.offsetWidth = 0;
          a.lastItemY = 0;
          g || (a.group = g = b.g("legend").attr({zIndex: 7}).add(), a.contentGroup = b.g().attr({zIndex: 1}).add(g), a.scrollGroup = b.g().add(a.contentGroup));
          a.renderTitle();
          f = a.getAllItems();
          e(f, function(a, b) {
            return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0);
          });
          z.reversed && f.reverse();
          a.allItems = f;
          a.display = k = !!f.length;
          a.lastLineHeight = 0;
          d(f, function(b) {
            a.renderItem(b);
          });
          n = (z.width || a.offsetWidth) + u;
          l = a.lastItemY + a.lastLineHeight + a.titleHeight;
          l = a.handleOverflow(l);
          l += u;
          q || (a.box = q = b.rect().addClass("highcharts-legend-box").attr({r: z.borderRadius}).add(g), q.isNew = !0);
          0 < n && 0 < l && (q[q.isNew ? "attr" : "animate"](q.crisp.call({}, {
            x: 0,
            y: 0,
            width: n,
            height: l
          }, q.strokeWidth())), q.isNew = !1);
          q[k ? "show" : "hide"]();
          "none" === g.getStyle("display") && (n = l = 0);
          a.legendWidth = n;
          a.legendHeight = l;
          d(f, function(b) {
            a.positionItem(b);
          });
          k && (b = c.spacingBox, /(lth|ct|rth)/.test(a.getAlignment()) && (b = v(b, {y: b.y + c.titleOffset + c.options.title.margin})), g.align(v(z, {
            width: n,
            height: l
          }), !0, b));
          c.isResizing || this.positionCheckboxes();
        },
        handleOverflow: function(a) {
          var c = this,
              b = this.chart,
              g = b.renderer,
              e = this.options,
              h = e.y,
              f = this.padding,
              b = b.spacingBox.height + ("top" === e.verticalAlign ? -h : h) - f,
              h = e.maxHeight,
              k,
              n = this.clipRect,
              l = e.navigation,
              u = q(l.animation, !0),
              C = l.arrowSize || 12,
              E = this.nav,
              J = this.pages,
              t,
              r = this.allItems,
              x = function(a) {
                "number" === typeof a ? n.attr({height: a}) : n && (c.clipRect = n.destroy(), c.contentGroup.clip());
                c.contentGroup.div && (c.contentGroup.div.style.clip = a ? "rect(" + f + "px,9999px," + (f + a) + "px,0)" : "auto");
              };
          "horizontal" !== e.layout || "middle" === e.verticalAlign || e.floating || (b /= 2);
          h && (b = Math.min(b, h));
          J.length = 0;
          a > b && !1 !== l.enabled ? (this.clipHeight = k = Math.max(b - 20 - this.titleHeight - f, 0), this.currentPage = q(this.currentPage, 1), this.fullHeight = a, d(r, function(a, b) {
            var c = a._legendItemPos[1],
                g = Math.round(a.legendItem.getBBox().height),
                e = J.length;
            if (!e || c - J[e - 1] > k && (t || c) !== J[e - 1])
              J.push(t || c), e++;
            a.pageIx = e - 1;
            t && (r[b - 1].pageIx = e - 1);
            b === r.length - 1 && c + g - J[e - 1] > k && (J.push(c), a.pageIx = e);
            c !== t && (t = c);
          }), n || (n = c.clipRect = g.clipRect(0, f, 9999, 0), c.contentGroup.clip(n)), x(k), E || (this.nav = E = g.g().attr({zIndex: 1}).add(this.group), this.up = g.symbol("triangle", 0, 0, C, C).on("click", function() {
            c.scroll(-1, u);
          }).add(E), this.pager = g.text("", 15, 10).addClass("highcharts-legend-navigation").add(E), this.down = g.symbol("triangle-down", 0, 0, C, C).on("click", function() {
            c.scroll(1, u);
          }).add(E)), c.scroll(0), a = b) : E && (x(), this.nav = E.destroy(), this.scrollGroup.attr({translateY: 1}), this.clipHeight = 0);
          return a;
        },
        scroll: function(a, c) {
          var b = this.pages,
              e = b.length;
          a = this.currentPage + a;
          var h = this.clipHeight,
              d = this.pager,
              f = this.padding;
          a > e && (a = e);
          0 < a && (void 0 !== c && n(c, this.chart), this.nav.attr({
            translateX: f,
            translateY: h + this.padding + 7 + this.titleHeight,
            visibility: "visible"
          }), this.up.attr({"class": 1 === a ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"}), d.attr({text: a + "/" + e}), this.down.attr({
            x: 18 + this.pager.getBBox().width,
            "class": a === e ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
          }), this.scrollOffset = -b[a - 1] + this.initialItemY, this.scrollGroup.animate({translateY: this.scrollOffset}), this.currentPage = a, this.positionCheckboxes());
        }
      };
      a.LegendSymbolMixin = {
        drawRectangle: function(a, c) {
          var b = a.symbolHeight,
              e = a.options.squareSymbol;
          c.legendSymbol = this.chart.renderer.rect(e ? (a.symbolWidth - b) / 2 : 0, a.baseline - b + 1, e ? b : a.symbolWidth, b, q(a.options.symbolRadius, b / 2)).addClass("highcharts-point").attr({zIndex: 3}).add(c.legendGroup);
        },
        drawLineMarker: function(a) {
          var c = this.options.marker,
              b,
              e = a.symbolWidth,
              h = a.symbolHeight;
          b = h / 2;
          var d = this.chart.renderer,
              f = this.legendGroup;
          a = a.baseline - Math.round(.3 * a.fontMetrics.b);
          this.legendLine = d.path(["M", 0, a, "L", e, a]).addClass("highcharts-graph").attr({}).add(f);
          c && !1 !== c.enabled && (b = Math.min(q(c.radius, b), b), 0 === this.symbol.indexOf("url") && (c = v(c, {
            width: h,
            height: h
          }), b = 0), this.legendSymbol = c = d.symbol(this.symbol, e / 2 - b, a - b, 2 * b, 2 * b, c).addClass("highcharts-point").add(f), c.isMarker = !0);
        }
      };
      (/Trident\/7\.0/.test(k.navigator.userAgent) || t) && y(a.Legend.prototype, "positionItem", function(a, c) {
        var b = this,
            e = function() {
              c._legendItemPos && a.call(b, c);
            };
        e();
        setTimeout(e);
      });
    })(I);
    (function(a) {
      var w = a.addEvent,
          B = a.animObject,
          A = a.attr,
          f = a.doc,
          d = a.Axis,
          t = a.createElement,
          l = a.defaultOptions,
          v = a.discardElement,
          q = a.charts,
          n = a.defined,
          e = a.each,
          k = a.extend,
          y = a.find,
          h = a.fireEvent,
          c = a.grep,
          b = a.isNumber,
          g = a.isObject,
          p = a.isString,
          F = a.Legend,
          L = a.marginNames,
          D = a.merge,
          H = a.objectEach,
          z = a.Pointer,
          u = a.pick,
          C = a.pInt,
          E = a.removeEvent,
          J = a.seriesTypes,
          K = a.splat,
          r = a.syncTimeout,
          x = a.win,
          M = a.Chart = function() {
            this.getArgs.apply(this, arguments);
          };
      a.chart = function(a, b, c) {
        return new M(a, b, c);
      };
      k(M.prototype, {
        callbacks: [],
        getArgs: function() {
          var a = [].slice.call(arguments);
          if (p(a[0]) || a[0].nodeName)
            this.renderTo = a.shift();
          this.init(a[0], a[1]);
        },
        init: function(b, c) {
          var e,
              g,
              m = b.series,
              h = b.plotOptions || {};
          b.series = null;
          e = D(l, b);
          for (g in e.plotOptions)
            e.plotOptions[g].tooltip = h[g] && D(h[g].tooltip) || void 0;
          e.tooltip.userOptions = b.chart && b.chart.forExport && b.tooltip.userOptions || b.tooltip;
          e.series = b.series = m;
          this.userOptions = b;
          g = e.chart;
          m = g.events;
          this.margin = [];
          this.spacing = [];
          this.bounds = {
            h: {},
            v: {}
          };
          this.labelCollectors = [];
          this.callback = c;
          this.isResizing = 0;
          this.options = e;
          this.axes = [];
          this.series = [];
          this.time = b.time && a.keys(b.time).length ? new a.Time(b.time) : a.time;
          this.hasCartesianSeries = g.showAxes;
          var d = this;
          d.index = q.length;
          q.push(d);
          a.chartCount++;
          m && H(m, function(a, b) {
            w(d, b, a);
          });
          d.xAxis = [];
          d.yAxis = [];
          d.pointCount = d.colorCounter = d.symbolCounter = 0;
          d.firstRender();
        },
        initSeries: function(b) {
          var c = this.options.chart;
          (c = J[b.type || c.type || c.defaultSeriesType]) || a.error(17, !0);
          c = new c;
          c.init(this, b);
          return c;
        },
        orderSeries: function(a) {
          var b = this.series;
          for (a = a || 0; a < b.length; a++)
            b[a] && (b[a].index = a, b[a].name = b[a].getName());
        },
        isInsidePlot: function(a, b, c) {
          var e = c ? b : a;
          a = c ? a : b;
          return 0 <= e && e <= this.plotWidth && 0 <= a && a <= this.plotHeight;
        },
        redraw: function(b) {
          var c = this.axes,
              g = this.series,
              m = this.pointer,
              d = this.legend,
              f = this.isDirtyLegend,
              u,
              n,
              r = this.hasCartesianSeries,
              p = this.isDirtyBox,
              l,
              C = this.renderer,
              E = C.isHidden(),
              q = [];
          this.setResponsive && this.setResponsive(!1);
          a.setAnimation(b, this);
          E && this.temporaryDisplay();
          this.layOutTitles();
          for (b = g.length; b--; )
            if (l = g[b], l.options.stacking && (u = !0, l.isDirty)) {
              n = !0;
              break;
            }
          if (n)
            for (b = g.length; b--; )
              l = g[b], l.options.stacking && (l.isDirty = !0);
          e(g, function(a) {
            a.isDirty && "point" === a.options.legendType && (a.updateTotals && a.updateTotals(), f = !0);
            a.isDirtyData && h(a, "updatedData");
          });
          f && d.options.enabled && (d.render(), this.isDirtyLegend = !1);
          u && this.getStacks();
          r && e(c, function(a) {
            a.updateNames();
            a.setScale();
          });
          this.getMargins();
          r && (e(c, function(a) {
            a.isDirty && (p = !0);
          }), e(c, function(a) {
            var b = a.min + "," + a.max;
            a.extKey !== b && (a.extKey = b, q.push(function() {
              h(a, "afterSetExtremes", k(a.eventArgs, a.getExtremes()));
              delete a.eventArgs;
            }));
            (p || u) && a.redraw();
          }));
          p && this.drawChartBox();
          h(this, "predraw");
          e(g, function(a) {
            (p || a.isDirty) && a.visible && a.redraw();
            a.isDirtyData = !1;
          });
          m && m.reset(!0);
          C.draw();
          h(this, "redraw");
          h(this, "render");
          E && this.temporaryDisplay(!0);
          e(q, function(a) {
            a.call();
          });
        },
        get: function(a) {
          function b(b) {
            return b.id === a || b.options && b.options.id === a;
          }
          var c,
              e = this.series,
              g;
          c = y(this.axes, b) || y(this.series, b);
          for (g = 0; !c && g < e.length; g++)
            c = y(e[g].points || [], b);
          return c;
        },
        getAxes: function() {
          var a = this,
              b = this.options,
              c = b.xAxis = K(b.xAxis || {}),
              b = b.yAxis = K(b.yAxis || {});
          h(this, "beforeGetAxes");
          e(c, function(a, b) {
            a.index = b;
            a.isX = !0;
          });
          e(b, function(a, b) {
            a.index = b;
          });
          c = c.concat(b);
          e(c, function(b) {
            new d(a, b);
          });
        },
        getSelectedPoints: function() {
          var a = [];
          e(this.series, function(b) {
            a = a.concat(c(b.data || [], function(a) {
              return a.selected;
            }));
          });
          return a;
        },
        getSelectedSeries: function() {
          return c(this.series, function(a) {
            return a.selected;
          });
        },
        setTitle: function(a, b, c) {
          var g = this,
              m = g.options,
              h;
          h = m.title = D(m.title, a);
          m = m.subtitle = D(m.subtitle, b);
          e([["title", a, h], ["subtitle", b, m]], function(a, b) {
            var c = a[0],
                e = g[c],
                m = a[1];
            a = a[2];
            e && m && (g[c] = e = e.destroy());
            a && !e && (g[c] = g.renderer.text(a.text, 0, 0, a.useHTML).attr({
              align: a.align,
              "class": "highcharts-" + c,
              zIndex: a.zIndex || 4
            }).add(), g[c].update = function(a) {
              g.setTitle(!b && a, b && a);
            });
          });
          g.layOutTitles(c);
        },
        layOutTitles: function(a) {
          var b = 0,
              c,
              g = this.renderer,
              m = this.spacingBox;
          e(["title", "subtitle"], function(a) {
            var c = this[a],
                e = this.options[a];
            a = "title" === a ? -3 : e.verticalAlign ? 0 : b + 2;
            var h;
            c && (h = g.fontMetrics(h, c).b, c.css({width: (e.width || m.width + e.widthAdjust) + "px"}).align(k({y: a + h}, e), !1, "spacingBox"), e.floating || e.verticalAlign || (b = Math.ceil(b + c.getBBox(e.useHTML).height)));
          }, this);
          c = this.titleOffset !== b;
          this.titleOffset = b;
          !this.isDirtyBox && c && (this.isDirtyBox = c, this.hasRendered && u(a, !0) && this.isDirtyBox && this.redraw());
        },
        getChartSize: function() {
          var b = this.options.chart,
              c = b.width,
              b = b.height,
              e = this.renderTo;
          n(c) || (this.containerWidth = a.getStyle(e, "width"));
          n(b) || (this.containerHeight = a.getStyle(e, "height"));
          this.chartWidth = Math.max(0, c || this.containerWidth || 600);
          this.chartHeight = Math.max(0, a.relativeLength(b, this.chartWidth) || (1 < this.containerHeight ? this.containerHeight : 400));
        },
        temporaryDisplay: function(b) {
          var c = this.renderTo;
          if (b)
            for (; c && c.style; )
              c.hcOrigStyle && (a.css(c, c.hcOrigStyle), delete c.hcOrigStyle), c.hcOrigDetached && (f.body.removeChild(c), c.hcOrigDetached = !1), c = c.parentNode;
          else
            for (; c && c.style; ) {
              f.body.contains(c) || c.parentNode || (c.hcOrigDetached = !0, f.body.appendChild(c));
              if ("none" === a.getStyle(c, "display", !1) || c.hcOricDetached)
                c.hcOrigStyle = {
                  display: c.style.display,
                  height: c.style.height,
                  overflow: c.style.overflow
                }, b = {
                  display: "block",
                  overflow: "hidden"
                }, c !== this.renderTo && (b.height = 0), a.css(c, b), c.offsetWidth || c.style.setProperty("display", "block", "important");
              c = c.parentNode;
              if (c === f.body)
                break;
            }
        },
        setClassName: function(a) {
          this.container.className = "highcharts-container " + (a || "");
        },
        getContainer: function() {
          var c,
              e = this.options,
              g = e.chart,
              h,
              d;
          c = this.renderTo;
          var u = a.uniqueKey(),
              k;
          c || (this.renderTo = c = g.renderTo);
          p(c) && (this.renderTo = c = f.getElementById(c));
          c || a.error(13, !0);
          h = C(A(c, "data-highcharts-chart"));
          b(h) && q[h] && q[h].hasRendered && q[h].destroy();
          A(c, "data-highcharts-chart", this.index);
          c.innerHTML = "";
          g.skipClone || c.offsetWidth || this.temporaryDisplay();
          this.getChartSize();
          h = this.chartWidth;
          d = this.chartHeight;
          this.container = c = t("div", {id: u}, void 0, c);
          this._cursor = c.style.cursor;
          this.renderer = new (a[g.renderer] || a.Renderer)(c, h, d, null, g.forExport, e.exporting && e.exporting.allowHTML);
          this.setClassName(g.className);
          for (k in e.defs)
            this.renderer.definition(e.defs[k]);
          this.renderer.chartIndex = this.index;
        },
        getMargins: function(a) {
          var b = this.spacing,
              c = this.margin,
              e = this.titleOffset;
          this.resetMargins();
          e && !n(c[0]) && (this.plotTop = Math.max(this.plotTop, e + this.options.title.margin + b[0]));
          this.legend && this.legend.display && this.legend.adjustMargins(c, b);
          this.extraMargin && (this[this.extraMargin.type] = (this[this.extraMargin.type] || 0) + this.extraMargin.value);
          this.adjustPlotArea && this.adjustPlotArea();
          a || this.getAxisMargins();
        },
        getAxisMargins: function() {
          var a = this,
              b = a.axisOffset = [0, 0, 0, 0],
              c = a.margin;
          a.hasCartesianSeries && e(a.axes, function(a) {
            a.visible && a.getOffset();
          });
          e(L, function(e, g) {
            n(c[g]) || (a[e] += b[g]);
          });
          a.setChartSize();
        },
        reflow: function(b) {
          var c = this,
              e = c.options.chart,
              g = c.renderTo,
              h = n(e.width) && n(e.height),
              d = e.width || a.getStyle(g, "width"),
              e = e.height || a.getStyle(g, "height"),
              g = b ? b.target : x;
          if (!h && !c.isPrinting && d && e && (g === x || g === f)) {
            if (d !== c.containerWidth || e !== c.containerHeight)
              clearTimeout(c.reflowTimeout), c.reflowTimeout = r(function() {
                c.container && c.setSize(void 0, void 0, !1);
              }, b ? 100 : 0);
            c.containerWidth = d;
            c.containerHeight = e;
          }
        },
        initReflow: function() {
          var a = this,
              b;
          b = w(x, "resize", function(b) {
            a.reflow(b);
          });
          w(a, "destroy", b);
        },
        setSize: function(b, c, g) {
          var d = this,
              m = d.renderer;
          d.isResizing += 1;
          a.setAnimation(g, d);
          d.oldChartHeight = d.chartHeight;
          d.oldChartWidth = d.chartWidth;
          void 0 !== b && (d.options.chart.width = b);
          void 0 !== c && (d.options.chart.height = c);
          d.getChartSize();
          d.setChartSize(!0);
          m.setSize(d.chartWidth, d.chartHeight, g);
          e(d.axes, function(a) {
            a.isDirty = !0;
            a.setScale();
          });
          d.isDirtyLegend = !0;
          d.isDirtyBox = !0;
          d.layOutTitles();
          d.getMargins();
          d.redraw(g);
          d.oldChartHeight = null;
          h(d, "resize");
          r(function() {
            d && h(d, "endResize", null, function() {
              --d.isResizing;
            });
          }, B(void 0).duration);
        },
        setChartSize: function(a) {
          var b = this.inverted,
              c = this.renderer,
              g = this.chartWidth,
              h = this.chartHeight,
              d = this.options.chart,
              m = this.spacing,
              f = this.clipOffset,
              u,
              k,
              n,
              r;
          this.plotLeft = u = Math.round(this.plotLeft);
          this.plotTop = k = Math.round(this.plotTop);
          this.plotWidth = n = Math.max(0, Math.round(g - u - this.marginRight));
          this.plotHeight = r = Math.max(0, Math.round(h - k - this.marginBottom));
          this.plotSizeX = b ? r : n;
          this.plotSizeY = b ? n : r;
          this.plotBorderWidth = d.plotBorderWidth || 0;
          this.spacingBox = c.spacingBox = {
            x: m[3],
            y: m[0],
            width: g - m[3] - m[1],
            height: h - m[0] - m[2]
          };
          this.plotBox = c.plotBox = {
            x: u,
            y: k,
            width: n,
            height: r
          };
          g = 2 * Math.floor(this.plotBorderWidth / 2);
          b = Math.ceil(Math.max(g, f[3]) / 2);
          c = Math.ceil(Math.max(g, f[0]) / 2);
          this.clipBox = {
            x: b,
            y: c,
            width: Math.floor(this.plotSizeX - Math.max(g, f[1]) / 2 - b),
            height: Math.max(0, Math.floor(this.plotSizeY - Math.max(g, f[2]) / 2 - c))
          };
          a || e(this.axes, function(a) {
            a.setAxisSize();
            a.setAxisTranslation();
          });
        },
        resetMargins: function() {
          var a = this,
              b = a.options.chart;
          e(["margin", "spacing"], function(c) {
            var h = b[c],
                d = g(h) ? h : [h, h, h, h];
            e(["Top", "Right", "Bottom", "Left"], function(e, g) {
              a[c][g] = u(b[c + e], d[g]);
            });
          });
          e(L, function(b, c) {
            a[b] = u(a.margin[c], a.spacing[c]);
          });
          a.axisOffset = [0, 0, 0, 0];
          a.clipOffset = [0, 0, 0, 0];
        },
        drawChartBox: function() {
          var a = this.options.chart,
              b = this.renderer,
              c = this.chartWidth,
              e = this.chartHeight,
              g = this.chartBackground,
              d = this.plotBackground,
              f = this.plotBorder,
              u,
              k,
              n = this.plotLeft,
              r = this.plotTop,
              p = this.plotWidth,
              l = this.plotHeight,
              C = this.plotBox,
              E = this.clipRect,
              q = this.clipBox,
              x = "animate";
          g || (this.chartBackground = g = b.rect().addClass("highcharts-background").add(), x = "attr");
          u = k = g.strokeWidth();
          g[x]({
            x: k / 2,
            y: k / 2,
            width: c - k - u % 2,
            height: e - k - u % 2,
            r: a.borderRadius
          });
          x = "animate";
          d || (x = "attr", this.plotBackground = d = b.rect().addClass("highcharts-plot-background").add());
          d[x](C);
          E ? E.animate({
            width: q.width,
            height: q.height
          }) : this.clipRect = b.clipRect(q);
          x = "animate";
          f || (x = "attr", this.plotBorder = f = b.rect().addClass("highcharts-plot-border").attr({zIndex: 1}).add());
          f[x](f.crisp({
            x: n,
            y: r,
            width: p,
            height: l
          }, -f.strokeWidth()));
          this.isDirtyBox = !1;
          h(this, "afterDrawChartBox");
        },
        propFromSeries: function() {
          var a = this,
              b = a.options.chart,
              c,
              g = a.options.series,
              h,
              d;
          e(["inverted", "angular", "polar"], function(e) {
            c = J[b.type || b.defaultSeriesType];
            d = b[e] || c && c.prototype[e];
            for (h = g && g.length; !d && h--; )
              (c = J[g[h].type]) && c.prototype[e] && (d = !0);
            a[e] = d;
          });
        },
        linkSeries: function() {
          var a = this,
              b = a.series;
          e(b, function(a) {
            a.linkedSeries.length = 0;
          });
          e(b, function(b) {
            var c = b.options.linkedTo;
            p(c) && (c = ":previous" === c ? a.series[b.index - 1] : a.get(c)) && c.linkedParent !== b && (c.linkedSeries.push(b), b.linkedParent = c, b.visible = u(b.options.visible, c.options.visible, b.visible));
          });
        },
        renderSeries: function() {
          e(this.series, function(a) {
            a.translate();
            a.render();
          });
        },
        renderLabels: function() {
          var a = this,
              b = a.options.labels;
          b.items && e(b.items, function(c) {
            var e = k(b.style, c.style),
                g = C(e.left) + a.plotLeft,
                h = C(e.top) + a.plotTop + 12;
            delete e.left;
            delete e.top;
            a.renderer.text(c.html, g, h).attr({zIndex: 2}).css(e).add();
          });
        },
        render: function() {
          var a = this.axes,
              b = this.renderer,
              c = this.options,
              g,
              h,
              d;
          this.setTitle();
          this.legend = new F(this, c.legend);
          this.getStacks && this.getStacks();
          this.getMargins(!0);
          this.setChartSize();
          c = this.plotWidth;
          g = this.plotHeight = Math.max(this.plotHeight - 21, 0);
          e(a, function(a) {
            a.setScale();
          });
          this.getAxisMargins();
          h = 1.1 < c / this.plotWidth;
          d = 1.05 < g / this.plotHeight;
          if (h || d)
            e(a, function(a) {
              (a.horiz && h || !a.horiz && d) && a.setTickInterval(!0);
            }), this.getMargins();
          this.drawChartBox();
          this.hasCartesianSeries && e(a, function(a) {
            a.visible && a.render();
          });
          this.seriesGroup || (this.seriesGroup = b.g("series-group").attr({zIndex: 3}).add());
          this.renderSeries();
          this.renderLabels();
          this.addCredits();
          this.setResponsive && this.setResponsive();
          this.hasRendered = !0;
        },
        addCredits: function(a) {
          var b = this;
          a = D(!0, this.options.credits, a);
          a.enabled && !this.credits && (this.credits = this.renderer.text(a.text + (this.mapCredits || ""), 0, 0).addClass("highcharts-credits").on("click", function() {
            a.href && (x.location.href = a.href);
          }).attr({
            align: a.position.align,
            zIndex: 8
          }).add().align(a.position), this.credits.update = function(a) {
            b.credits = b.credits.destroy();
            b.addCredits(a);
          });
        },
        destroy: function() {
          var b = this,
              c = b.axes,
              g = b.series,
              d = b.container,
              f,
              u = d && d.parentNode;
          h(b, "destroy");
          b.renderer.forExport ? a.erase(q, b) : q[b.index] = void 0;
          a.chartCount--;
          b.renderTo.removeAttribute("data-highcharts-chart");
          E(b);
          for (f = c.length; f--; )
            c[f] = c[f].destroy();
          this.scroller && this.scroller.destroy && this.scroller.destroy();
          for (f = g.length; f--; )
            g[f] = g[f].destroy();
          e("title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" "), function(a) {
            var c = b[a];
            c && c.destroy && (b[a] = c.destroy());
          });
          d && (d.innerHTML = "", E(d), u && v(d));
          H(b, function(a, c) {
            delete b[c];
          });
        },
        firstRender: function() {
          var a = this,
              b = a.options;
          if (!a.isReadyToRender || a.isReadyToRender()) {
            a.getContainer();
            h(a, "init");
            a.resetMargins();
            a.setChartSize();
            a.propFromSeries();
            a.getAxes();
            e(b.series || [], function(b) {
              a.initSeries(b);
            });
            a.linkSeries();
            h(a, "beforeRender");
            z && (a.pointer = new z(a, b));
            a.render();
            if (!a.renderer.imgCount && a.onload)
              a.onload();
            a.temporaryDisplay(!0);
          }
        },
        onload: function() {
          e([this.callback].concat(this.callbacks), function(a) {
            a && void 0 !== this.index && a.apply(this, [this]);
          }, this);
          h(this, "load");
          h(this, "render");
          n(this.index) && !1 !== this.options.chart.reflow && this.initReflow();
          this.onload = null;
        }
      });
    })(I);
    (function(a) {
      var w,
          B = a.each,
          A = a.extend,
          f = a.erase,
          d = a.fireEvent,
          t = a.format,
          l = a.isArray,
          v = a.isNumber,
          q = a.pick,
          n = a.removeEvent;
      a.Point = w = function() {};
      a.Point.prototype = {
        init: function(a, f, n) {
          var e = a.chart.options.chart.colorCount;
          this.series = a;
          this.applyOptions(f, n);
          a.options.colorByPoint ? (f = a.colorCounter, a.colorCounter++, a.colorCounter === e && (a.colorCounter = 0)) : f = a.colorIndex;
          this.colorIndex = q(this.colorIndex, f);
          a.chart.pointCount++;
          d(this, "afterInit");
          return this;
        },
        applyOptions: function(a, d) {
          var e = this.series,
              h = e.options.pointValKey || e.pointValKey;
          a = w.prototype.optionsToObject.call(this, a);
          A(this, a);
          this.options = this.options ? A(this.options, a) : a;
          a.group && delete this.group;
          h && (this.y = this[h]);
          this.isNull = q(this.isValid && !this.isValid(), null === this.x || !v(this.y, !0));
          this.selected && (this.state = "select");
          "name" in this && void 0 === d && e.xAxis && e.xAxis.hasNames && (this.x = e.xAxis.nameToX(this));
          void 0 === this.x && e && (this.x = void 0 === d ? e.autoIncrement(this) : d);
          return this;
        },
        optionsToObject: function(a) {
          var e = {},
              d = this.series,
              h = d.options.keys,
              c = h || d.pointArrayMap || ["y"],
              b = c.length,
              g = 0,
              f = 0;
          if (v(a) || null === a)
            e[c[0]] = a;
          else if (l(a))
            for (!h && a.length > b && (d = typeof a[0], "string" === d ? e.name = a[0] : "number" === d && (e.x = a[0]), g++); f < b; )
              h && void 0 === a[g] || (e[c[f]] = a[g]), g++, f++;
          else
            "object" === typeof a && (e = a, a.dataLabels && (d._hasPointLabels = !0), a.marker && (d._hasPointMarkers = !0));
          return e;
        },
        getClassName: function() {
          return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" : "") + (this.isNull ? " highcharts-null-point" : "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "") + (this.zone && this.zone.className ? " " + this.zone.className.replace("highcharts-negative", "") : "");
        },
        getZone: function() {
          var a = this.series,
              d = a.zones,
              a = a.zoneAxis || "y",
              f = 0,
              h;
          for (h = d[f]; this[a] >= h.value; )
            h = d[++f];
          h && h.color && !this.options.color && (this.color = h.color);
          return h;
        },
        destroy: function() {
          var a = this.series.chart,
              d = a.hoverPoints,
              l;
          a.pointCount--;
          d && (this.setState(), f(d, this), d.length || (a.hoverPoints = null));
          if (this === a.hoverPoint)
            this.onMouseOut();
          if (this.graphic || this.dataLabel)
            n(this), this.destroyElements();
          this.legendItem && a.legend.destroyItem(this);
          for (l in this)
            this[l] = null;
        },
        destroyElements: function() {
          for (var a = ["graphic", "dataLabel", "dataLabelUpper", "connector", "shadowGroup"],
              d,
              f = 6; f--; )
            d = a[f], this[d] && (this[d] = this[d].destroy());
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
          var e = this.series,
              d = e.tooltipOptions,
              h = q(d.valueDecimals, ""),
              c = d.valuePrefix || "",
              b = d.valueSuffix || "";
          B(e.pointArrayMap || ["y"], function(g) {
            g = "{point." + g;
            if (c || b)
              a = a.replace(g + "}", c + g + "}" + b);
            a = a.replace(g + "}", g + ":,." + h + "f}");
          });
          return t(a, {
            point: this,
            series: this.series
          }, e.chart.time);
        },
        firePointEvent: function(a, f, n) {
          var e = this,
              c = this.series.options;
          (c.point.events[a] || e.options && e.options.events && e.options.events[a]) && this.importEvents();
          "click" === a && c.allowPointSelect && (n = function(a) {
            e.select && e.select(null, a.ctrlKey || a.metaKey || a.shiftKey);
          });
          d(this, a, f, n);
        },
        visible: !0
      };
    })(I);
    (function(a) {
      var w = a.addEvent,
          B = a.animObject,
          A = a.arrayMax,
          f = a.arrayMin,
          d = a.correctFloat,
          t = a.defaultOptions,
          l = a.defined,
          v = a.each,
          q = a.erase,
          n = a.extend,
          e = a.fireEvent,
          k = a.grep,
          y = a.isArray,
          h = a.isNumber,
          c = a.isString,
          b = a.merge,
          g = a.objectEach,
          p = a.pick,
          F = a.removeEvent,
          L = a.splat,
          D = a.SVGElement,
          H = a.syncTimeout,
          z = a.win;
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
          var c = this,
              e,
              d = a.series,
              h;
          c.chart = a;
          c.options = b = c.setOptions(b);
          c.linkedSeries = [];
          c.bindAxes();
          n(c, {
            name: b.name,
            state: "",
            visible: !1 !== b.visible,
            selected: !0 === b.selected
          });
          e = b.events;
          g(e, function(a, b) {
            w(c, b, a);
          });
          if (e && e.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect)
            a.runTrackerClick = !0;
          c.getColor();
          c.getSymbol();
          v(c.parallelArrays, function(a) {
            c[a + "Data"] = [];
          });
          c.setData(b.data, !1);
          c.isCartesian && (a.hasCartesianSeries = !0);
          d.length && (h = d[d.length - 1]);
          c._i = p(h && h._i, -1) + 1;
          a.orderSeries(this.insert(d));
        },
        insert: function(a) {
          var b = this.options.index,
              c;
          if (h(b)) {
            for (c = a.length; c--; )
              if (b >= p(a[c].options.index, a[c]._i)) {
                a.splice(c + 1, 0, this);
                break;
              }
            -1 === c && a.unshift(this);
            c += 1;
          } else
            a.push(this);
          return p(c, a.length - 1);
        },
        bindAxes: function() {
          var b = this,
              c = b.options,
              g = b.chart,
              e;
          v(b.axisTypes || [], function(d) {
            v(g[d], function(a) {
              e = a.options;
              if (c[d] === e.index || void 0 !== c[d] && c[d] === e.id || void 0 === c[d] && 0 === e.index)
                b.insert(a.series), b[d] = a, a.isDirty = !0;
            });
            b[d] || b.optionalAxis === d || a.error(18, !0);
          });
        },
        updateParallelArrays: function(a, b) {
          var c = a.series,
              e = arguments,
              g = h(b) ? function(e) {
                var g = "y" === e && c.toYData ? c.toYData(a) : a[e];
                c[e + "Data"][b] = g;
              } : function(a) {
                Array.prototype[b].apply(c[a + "Data"], Array.prototype.slice.call(e, 2));
              };
          v(c.parallelArrays, g);
        },
        autoIncrement: function() {
          var a = this.options,
              b = this.xIncrement,
              c,
              e = a.pointIntervalUnit,
              g = this.chart.time,
              b = p(b, a.pointStart, 0);
          this.pointInterval = c = p(this.pointInterval, a.pointInterval, 1);
          e && (a = new g.Date(b), "day" === e ? g.set("Date", a, g.get("Date", a) + c) : "month" === e ? g.set("Month", a, g.get("Month", a) + c) : "year" === e && g.set("FullYear", a, g.get("FullYear", a) + c), c = a.getTime() - b);
          this.xIncrement = b + c;
          return b;
        },
        setOptions: function(a) {
          var c = this.chart,
              g = c.options,
              e = g.plotOptions,
              d = (c.userOptions || {}).plotOptions || {},
              h = e[this.type];
          this.userOptions = a;
          c = b(h, e.series, a);
          this.tooltipOptions = b(t.tooltip, t.plotOptions.series && t.plotOptions.series.tooltip, t.plotOptions[this.type].tooltip, g.tooltip.userOptions, e.series && e.series.tooltip, e[this.type].tooltip, a.tooltip);
          this.stickyTracking = p(a.stickyTracking, d[this.type] && d[this.type].stickyTracking, d.series && d.series.stickyTracking, this.tooltipOptions.shared && !this.noSharedTooltip ? !0 : c.stickyTracking);
          null === h.marker && delete c.marker;
          this.zoneAxis = c.zoneAxis;
          a = this.zones = (c.zones || []).slice();
          !c.negativeColor && !c.negativeFillColor || c.zones || a.push({
            value: c[this.zoneAxis + "Threshold"] || c.threshold || 0,
            className: "highcharts-negative"
          });
          a.length && l(a[a.length - 1].value) && a.push({});
          return c;
        },
        getName: function() {
          return this.name || "Series " + (this.index + 1);
        },
        getCyclic: function(a, b, c) {
          var e,
              g = this.chart,
              d = this.userOptions,
              h = a + "Index",
              f = a + "Counter",
              m = c ? c.length : p(g.options.chart[a + "Count"], g[a + "Count"]);
          b || (e = p(d[h], d["_" + h]), l(e) || (g.series.length || (g[f] = 0), d["_" + h] = e = g[f] % m, g[f] += 1), c && (b = c[e]));
          void 0 !== e && (this[h] = e);
          this[a] = b;
        },
        getColor: function() {
          this.getCyclic("color");
        },
        getSymbol: function() {
          this.getCyclic("symbol", this.options.marker.symbol, this.chart.options.symbols);
        },
        drawLegendSymbol: a.LegendSymbolMixin.drawLineMarker,
        setData: function(b, e, g, d) {
          var f = this,
              n = f.points,
              k = n && n.length || 0,
              u,
              m = f.options,
              l = f.chart,
              C = null,
              q = f.xAxis,
              E = m.turboThreshold,
              z = this.xData,
              t = this.yData,
              J = (u = f.pointArrayMap) && u.length;
          b = b || [];
          u = b.length;
          e = p(e, !0);
          if (!1 !== d && u && k === u && !f.cropped && !f.hasGroupedData && f.visible)
            v(b, function(a, b) {
              n[b].update && a !== m.data[b] && n[b].update(a, !1, null, !1);
            });
          else {
            f.xIncrement = null;
            f.colorCounter = 0;
            v(this.parallelArrays, function(a) {
              f[a + "Data"].length = 0;
            });
            if (E && u > E) {
              for (g = 0; null === C && g < u; )
                C = b[g], g++;
              if (h(C))
                for (g = 0; g < u; g++)
                  z[g] = this.autoIncrement(), t[g] = b[g];
              else if (y(C))
                if (J)
                  for (g = 0; g < u; g++)
                    C = b[g], z[g] = C[0], t[g] = C.slice(1, J + 1);
                else
                  for (g = 0; g < u; g++)
                    C = b[g], z[g] = C[0], t[g] = C[1];
              else
                a.error(12);
            } else
              for (g = 0; g < u; g++)
                void 0 !== b[g] && (C = {series: f}, f.pointClass.prototype.applyOptions.apply(C, [b[g]]), f.updateParallelArrays(C, g));
            t && c(t[0]) && a.error(14, !0);
            f.data = [];
            f.options.data = f.userOptions.data = b;
            for (g = k; g--; )
              n[g] && n[g].destroy && n[g].destroy();
            q && (q.minRange = q.userMinRange);
            f.isDirty = l.isDirtyBox = !0;
            f.isDirtyData = !!n;
            g = !1;
          }
          "point" === m.legendType && (this.processData(), this.generatePoints());
          e && l.redraw(g);
        },
        processData: function(b) {
          var c = this.xData,
              g = this.yData,
              e = c.length,
              d;
          d = 0;
          var h,
              f,
              n = this.xAxis,
              m,
              k = this.options;
          m = k.cropThreshold;
          var u = this.getExtremesFromAll || k.getExtremesFromAll,
              p = this.isCartesian,
              k = n && n.val2lin,
              l = n && n.isLog,
              q = this.requireSorting,
              z,
              t;
          if (p && !this.isDirty && !n.isDirty && !this.yAxis.isDirty && !b)
            return !1;
          n && (b = n.getExtremes(), z = b.min, t = b.max);
          if (p && this.sorted && !u && (!m || e > m || this.forceCrop))
            if (c[e - 1] < z || c[0] > t)
              c = [], g = [];
            else if (c[0] < z || c[e - 1] > t)
              d = this.cropData(this.xData, this.yData, z, t), c = d.xData, g = d.yData, d = d.start, h = !0;
          for (m = c.length || 1; --m; )
            e = l ? k(c[m]) - k(c[m - 1]) : c[m] - c[m - 1], 0 < e && (void 0 === f || e < f) ? f = e : 0 > e && q && (a.error(15), q = !1);
          this.cropped = h;
          this.cropStart = d;
          this.processedXData = c;
          this.processedYData = g;
          this.closestPointRange = f;
        },
        cropData: function(a, b, c, g) {
          var e = a.length,
              d = 0,
              h = e,
              f = p(this.cropShoulder, 1),
              m;
          for (m = 0; m < e; m++)
            if (a[m] >= c) {
              d = Math.max(0, m - f);
              break;
            }
          for (c = m; c < e; c++)
            if (a[c] > g) {
              h = c + f;
              break;
            }
          return {
            xData: a.slice(d, h),
            yData: b.slice(d, h),
            start: d,
            end: h
          };
        },
        generatePoints: function() {
          var a = this.options,
              b = a.data,
              c = this.data,
              g,
              e = this.processedXData,
              d = this.processedYData,
              h = this.pointClass,
              f = e.length,
              m = this.cropStart || 0,
              n,
              k = this.hasGroupedData,
              a = a.keys,
              p,
              l = [],
              q;
          c || k || (c = [], c.length = b.length, c = this.data = c);
          a && k && (this.options.keys = !1);
          for (q = 0; q < f; q++)
            n = m + q, k ? (p = (new h).init(this, [e[q]].concat(L(d[q]))), p.dataGroup = this.groupMap[q]) : (p = c[n]) || void 0 === b[n] || (c[n] = p = (new h).init(this, b[n], e[q])), p && (p.index = n, l[q] = p);
          this.options.keys = a;
          if (c && (f !== (g = c.length) || k))
            for (q = 0; q < g; q++)
              q !== m || k || (q += f), c[q] && (c[q].destroyElements(), c[q].plotX = void 0);
          this.data = c;
          this.points = l;
        },
        getExtremes: function(a) {
          var b = this.yAxis,
              c = this.processedXData,
              g,
              e = [],
              d = 0;
          g = this.xAxis.getExtremes();
          var n = g.min,
              k = g.max,
              m,
              u,
              p,
              l;
          a = a || this.stackedYData || this.processedYData || [];
          g = a.length;
          for (l = 0; l < g; l++)
            if (u = c[l], p = a[l], m = (h(p, !0) || y(p)) && (!b.positiveValuesOnly || p.length || 0 < p), u = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || (c[l + 1] || u) >= n && (c[l - 1] || u) <= k, m && u)
              if (m = p.length)
                for (; m--; )
                  "number" === typeof p[m] && (e[d++] = p[m]);
              else
                e[d++] = p;
          this.dataMin = f(e);
          this.dataMax = A(e);
        },
        translate: function() {
          this.processedXData || this.processData();
          this.generatePoints();
          var a = this.options,
              b = a.stacking,
              c = this.xAxis,
              g = c.categories,
              f = this.yAxis,
              n = this.points,
              k = n.length,
              q = !!this.modifyValue,
              m = a.pointPlacement,
              z = "between" === m || h(m),
              t = a.threshold,
              D = a.startFromThreshold ? t : 0,
              H,
              y,
              v,
              F,
              L = Number.MAX_VALUE;
          "between" === m && (m = .5);
          h(m) && (m *= p(a.pointRange || c.pointRange));
          for (a = 0; a < k; a++) {
            var w = n[a],
                A = w.x,
                B = w.y;
            y = w.low;
            var I = b && f.stacks[(this.negStacks && B < (D ? 0 : t) ? "-" : "") + this.stackKey],
                T;
            f.positiveValuesOnly && null !== B && 0 >= B && (w.isNull = !0);
            w.plotX = H = d(Math.min(Math.max(-1E5, c.translate(A, 0, 0, 0, 1, m, "flags" === this.type)), 1E5));
            b && this.visible && !w.isNull && I && I[A] && (F = this.getStackIndicator(F, A, this.index), T = I[A], B = T.points[F.key], y = B[0], B = B[1], y === D && F.key === I[A].base && (y = p(t, f.min)), f.positiveValuesOnly && 0 >= y && (y = null), w.total = w.stackTotal = T.total, w.percentage = T.total && w.y / T.total * 100, w.stackY = B, T.setOffset(this.pointXOffset || 0, this.barW || 0));
            w.yBottom = l(y) ? Math.min(Math.max(-1E5, f.translate(y, 0, 1, 0, 1)), 1E5) : null;
            q && (B = this.modifyValue(B, w));
            w.plotY = y = "number" === typeof B && Infinity !== B ? Math.min(Math.max(-1E5, f.translate(B, 0, 1, 0, 1)), 1E5) : void 0;
            w.isInside = void 0 !== y && 0 <= y && y <= f.len && 0 <= H && H <= c.len;
            w.clientX = z ? d(c.translate(A, 0, 0, 0, 1, m)) : H;
            w.negative = w.y < (t || 0);
            w.category = g && void 0 !== g[w.x] ? g[w.x] : w.x;
            w.isNull || (void 0 !== v && (L = Math.min(L, Math.abs(H - v))), v = H);
            w.zone = this.zones.length && w.getZone();
          }
          this.closestPointRangePx = L;
          e(this, "afterTranslate");
        },
        getValidPoints: function(a, b) {
          var c = this.chart;
          return k(a || this.points || [], function(a) {
            return b && !c.isInsidePlot(a.plotX, a.plotY, c.inverted) ? !1 : !a.isNull;
          });
        },
        setClip: function(a) {
          var b = this.chart,
              c = this.options,
              g = b.renderer,
              e = b.inverted,
              d = this.clipBox,
              h = d || b.clipBox,
              f = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, h.height, c.xAxis, c.yAxis].join(),
              m = b[f],
              n = b[f + "m"];
          m || (a && (h.width = 0, e && (h.x = b.plotSizeX), b[f + "m"] = n = g.clipRect(e ? b.plotSizeX + 99 : -99, e ? -b.plotLeft : -b.plotTop, 99, e ? b.chartWidth : b.chartHeight)), b[f] = m = g.clipRect(h), m.count = {length: 0});
          a && !m.count[this.index] && (m.count[this.index] = !0, m.count.length += 1);
          !1 !== c.clip && (this.group.clip(a || d ? m : b.clipRect), this.markerGroup.clip(n), this.sharedClipKey = f);
          a || (m.count[this.index] && (delete m.count[this.index], --m.count.length), 0 === m.count.length && f && b[f] && (d || (b[f] = b[f].destroy()), b[f + "m"] && (b[f + "m"] = b[f + "m"].destroy())));
        },
        animate: function(a) {
          var b = this.chart,
              c = B(this.options.animation),
              g;
          a ? this.setClip(c) : (g = this.sharedClipKey, (a = b[g]) && a.animate({
            width: b.plotSizeX,
            x: 0
          }, c), b[g + "m"] && b[g + "m"].animate({
            width: b.plotSizeX + 99,
            x: 0
          }, c), this.animate = null);
        },
        afterAnimate: function() {
          this.setClip();
          e(this, "afterAnimate");
          this.finishedAnimating = !0;
        },
        drawPoints: function() {
          var a = this.points,
              b = this.chart,
              c,
              g,
              e,
              d,
              h = this.options.marker,
              f,
              m,
              n,
              k = this[this.specialGroup] || this.markerGroup,
              l,
              q = p(h.enabled, this.xAxis.isRadial ? !0 : null, this.closestPointRangePx >= h.enabledThreshold * h.radius);
          if (!1 !== h.enabled || this._hasPointMarkers)
            for (c = 0; c < a.length; c++)
              g = a[c], d = g.graphic, f = g.marker || {}, m = !!g.marker, e = q && void 0 === f.enabled || f.enabled, n = g.isInside, e && !g.isNull ? (e = p(f.symbol, this.symbol), l = this.markerAttribs(g, g.selected && "select"), d ? d[n ? "show" : "hide"](!0).animate(l) : n && (0 < l.width || g.hasImage) && (g.graphic = d = b.renderer.symbol(e, l.x, l.y, l.width, l.height, m ? f : h).add(k)), d && d.addClass(g.getClassName(), !0)) : d && (g.graphic = d.destroy());
        },
        markerAttribs: function(a, b) {
          var c = this.options.marker,
              g = a.marker || {},
              e = g.symbol || c.symbol,
              d = p(g.radius, c.radius);
          b && (c = c.states[b], b = g.states && g.states[b], d = p(b && b.radius, c && c.radius, d + (c && c.radiusPlus || 0)));
          a.hasImage = e && 0 === e.indexOf("url");
          a.hasImage && (d = 0);
          a = {
            x: Math.floor(a.plotX) - d,
            y: a.plotY - d
          };
          d && (a.width = a.height = 2 * d);
          return a;
        },
        destroy: function() {
          var a = this,
              b = a.chart,
              c = /AppleWebKit\/533/.test(z.navigator.userAgent),
              d,
              h,
              f = a.data || [],
              n,
              k;
          e(a, "destroy");
          F(a);
          v(a.axisTypes || [], function(b) {
            (k = a[b]) && k.series && (q(k.series, a), k.isDirty = k.forceRedraw = !0);
          });
          a.legendItem && a.chart.legend.destroyItem(a);
          for (h = f.length; h--; )
            (n = f[h]) && n.destroy && n.destroy();
          a.points = null;
          clearTimeout(a.animationTimeout);
          g(a, function(a, b) {
            a instanceof D && !a.survive && (d = c && "group" === b ? "hide" : "destroy", a[d]());
          });
          b.hoverSeries === a && (b.hoverSeries = null);
          q(b.series, a);
          b.orderSeries();
          g(a, function(b, c) {
            delete a[c];
          });
        },
        getGraphPath: function(a, b, c) {
          var g = this,
              e = g.options,
              d = e.step,
              h,
              f = [],
              n = [],
              k;
          a = a || g.points;
          (h = a.reversed) && a.reverse();
          (d = {
            right: 1,
            center: 2
          }[d] || d && 3) && h && (d = 4 - d);
          !e.connectNulls || b || c || (a = this.getValidPoints(a));
          v(a, function(h, m) {
            var p = h.plotX,
                u = h.plotY,
                r = a[m - 1];
            (h.leftCliff || r && r.rightCliff) && !c && (k = !0);
            h.isNull && !l(b) && 0 < m ? k = !e.connectNulls : h.isNull && !b ? k = !0 : (0 === m || k ? m = ["M", h.plotX, h.plotY] : g.getPointSpline ? m = g.getPointSpline(a, h, m) : d ? (m = 1 === d ? ["L", r.plotX, u] : 2 === d ? ["L", (r.plotX + p) / 2, r.plotY, "L", (r.plotX + p) / 2, u] : ["L", p, r.plotY], m.push("L", p, u)) : m = ["L", p, u], n.push(h.x), d && n.push(h.x), f.push.apply(f, m), k = !1);
          });
          f.xMap = n;
          return g.graphPath = f;
        },
        drawGraph: function() {
          var a = this,
              b = (this.gappedPath || this.getGraphPath).call(this),
              c = [["graph", "highcharts-graph"]];
          v(this.zones, function(a, b) {
            c.push(["zone-graph-" + b, "highcharts-graph highcharts-zone-graph-" + b + " " + (a.className || "")]);
          });
          v(c, function(c, g) {
            g = c[0];
            var e = a[g];
            e ? (e.endX = a.preventGraphAnimation ? null : b.xMap, e.animate({d: b})) : b.length && (a[g] = a.chart.renderer.path(b).addClass(c[1]).attr({zIndex: 1}).add(a.group));
            e && (e.startX = b.xMap, e.isArea = b.isArea);
          });
        },
        applyZones: function() {
          var a = this,
              b = this.chart,
              c = b.renderer,
              g = this.zones,
              e,
              d,
              h = this.clips || [],
              f,
              n = this.graph,
              k = this.area,
              l = Math.max(b.chartWidth, b.chartHeight),
              q = this[(this.zoneAxis || "y") + "Axis"],
              z,
              t,
              D = b.inverted,
              H,
              y,
              F,
              w,
              L = !1;
          g.length && (n || k) && q && void 0 !== q.min && (t = q.reversed, H = q.horiz, n && n.hide(), k && k.hide(), z = q.getExtremes(), v(g, function(g, m) {
            e = t ? H ? b.plotWidth : 0 : H ? 0 : q.toPixels(z.min);
            e = Math.min(Math.max(p(d, e), 0), l);
            d = Math.min(Math.max(Math.round(q.toPixels(p(g.value, z.max), !0)), 0), l);
            L && (e = d = q.toPixels(z.max));
            y = Math.abs(e - d);
            F = Math.min(e, d);
            w = Math.max(e, d);
            q.isXAxis ? (f = {
              x: D ? w : F,
              y: 0,
              width: y,
              height: l
            }, H || (f.x = b.plotHeight - f.x)) : (f = {
              x: 0,
              y: D ? w : F,
              width: l,
              height: y
            }, H && (f.y = b.plotWidth - f.y));
            h[m] ? h[m].animate(f) : (h[m] = c.clipRect(f), n && a["zone-graph-" + m].clip(h[m]), k && a["zone-area-" + m].clip(h[m]));
            L = g.value > z.max;
          }), this.clips = h);
        },
        invertGroups: function(a) {
          function b() {
            v(["group", "markerGroup"], function(b) {
              c[b] && (g.renderer.isVML && c[b].attr({
                width: c.yAxis.len,
                height: c.xAxis.len
              }), c[b].width = c.yAxis.len, c[b].height = c.xAxis.len, c[b].invert(a));
            });
          }
          var c = this,
              g = c.chart,
              e;
          c.xAxis && (e = w(g, "resize", b), w(c, "destroy", e), b(a), c.invertGroups = b);
        },
        plotGroup: function(a, b, c, g, e) {
          var d = this[a],
              h = !d;
          h && (this[a] = d = this.chart.renderer.g().attr({zIndex: g || .1}).add(e));
          d.addClass("highcharts-" + b + " highcharts-series-" + this.index + " highcharts-" + this.type + "-series " + (l(this.colorIndex) ? "highcharts-color-" + this.colorIndex + " " : "") + (this.options.className || "") + (d.hasClass("highcharts-tracker") ? " highcharts-tracker" : ""), !0);
          d.attr({visibility: c})[h ? "attr" : "animate"](this.getPlotBox());
          return d;
        },
        getPlotBox: function() {
          var a = this.chart,
              b = this.xAxis,
              c = this.yAxis;
          a.inverted && (b = c, c = this.xAxis);
          return {
            translateX: b ? b.left : a.plotLeft,
            translateY: c ? c.top : a.plotTop,
            scaleX: 1,
            scaleY: 1
          };
        },
        render: function() {
          var a = this,
              b = a.chart,
              c,
              g = a.options,
              d = !!a.animate && b.renderer.isSVG && B(g.animation).duration,
              h = a.visible ? "inherit" : "hidden",
              f = g.zIndex,
              n = a.hasRendered,
              m = b.seriesGroup,
              k = b.inverted;
          c = a.plotGroup("group", "series", h, f, m);
          a.markerGroup = a.plotGroup("markerGroup", "markers", h, f, m);
          d && a.animate(!0);
          c.inverted = a.isCartesian ? k : !1;
          a.drawGraph && (a.drawGraph(), a.applyZones());
          a.drawDataLabels && a.drawDataLabels();
          a.visible && a.drawPoints();
          a.drawTracker && !1 !== a.options.enableMouseTracking && a.drawTracker();
          a.invertGroups(k);
          !1 === g.clip || a.sharedClipKey || n || c.clip(b.clipRect);
          d && a.animate();
          n || (a.animationTimeout = H(function() {
            a.afterAnimate();
          }, d));
          a.isDirty = !1;
          a.hasRendered = !0;
          e(a, "afterRender");
        },
        redraw: function() {
          var a = this.chart,
              b = this.isDirty || this.isDirtyData,
              c = this.group,
              g = this.xAxis,
              e = this.yAxis;
          c && (a.inverted && c.attr({
            width: a.plotWidth,
            height: a.plotHeight
          }), c.animate({
            translateX: p(g && g.left, a.plotLeft),
            translateY: p(e && e.top, a.plotTop)
          }));
          this.translate();
          this.render();
          b && delete this.kdTree;
        },
        kdAxisArray: ["clientX", "plotY"],
        searchPoint: function(a, b) {
          var c = this.xAxis,
              g = this.yAxis,
              e = this.chart.inverted;
          return this.searchKDTree({
            clientX: e ? c.len - a.chartY + c.pos : a.chartX - c.pos,
            plotY: e ? g.len - a.chartX + g.pos : a.chartY - g.pos
          }, b);
        },
        buildKDTree: function() {
          function a(c, g, e) {
            var d,
                h;
            if (h = c && c.length)
              return d = b.kdAxisArray[g % e], c.sort(function(a, b) {
                return a[d] - b[d];
              }), h = Math.floor(h / 2), {
                point: c[h],
                left: a(c.slice(0, h), g + 1, e),
                right: a(c.slice(h + 1), g + 1, e)
              };
          }
          this.buildingKdTree = !0;
          var b = this,
              c = -1 < b.options.findNearestPointBy.indexOf("y") ? 2 : 1;
          delete b.kdTree;
          H(function() {
            b.kdTree = a(b.getValidPoints(null, !b.directTouch), c, c);
            b.buildingKdTree = !1;
          }, b.options.kdNow ? 0 : 1);
        },
        searchKDTree: function(a, b) {
          function c(a, b, f, n) {
            var m = b.point,
                k = g.kdAxisArray[f % n],
                p,
                r,
                u = m;
            r = l(a[e]) && l(m[e]) ? Math.pow(a[e] - m[e], 2) : null;
            p = l(a[d]) && l(m[d]) ? Math.pow(a[d] - m[d], 2) : null;
            p = (r || 0) + (p || 0);
            m.dist = l(p) ? Math.sqrt(p) : Number.MAX_VALUE;
            m.distX = l(r) ? Math.sqrt(r) : Number.MAX_VALUE;
            k = a[k] - m[k];
            p = 0 > k ? "left" : "right";
            r = 0 > k ? "right" : "left";
            b[p] && (p = c(a, b[p], f + 1, n), u = p[h] < u[h] ? p : m);
            b[r] && Math.sqrt(k * k) < u[h] && (a = c(a, b[r], f + 1, n), u = a[h] < u[h] ? a : u);
            return u;
          }
          var g = this,
              e = this.kdAxisArray[0],
              d = this.kdAxisArray[1],
              h = b ? "distX" : "dist";
          b = -1 < g.options.findNearestPointBy.indexOf("y") ? 2 : 1;
          this.kdTree || this.buildingKdTree || this.buildKDTree();
          if (this.kdTree)
            return c(a, this.kdTree, b, b);
        }
      });
    })(I);
    (function(a) {
      var w = a.addEvent,
          B = a.Axis,
          A = a.createElement,
          f = a.css,
          d = a.defined,
          t = a.each,
          l = a.erase,
          v = a.extend,
          q = a.fireEvent,
          n = a.inArray,
          e = a.isNumber,
          k = a.isObject,
          y = a.isArray,
          h = a.merge,
          c = a.objectEach,
          b = a.pick,
          g = a.Point,
          p = a.Series,
          F = a.seriesTypes,
          L = a.setAnimation,
          D = a.splat;
      v(a.Chart.prototype, {
        addSeries: function(a, c, g) {
          var e,
              d = this;
          a && (c = b(c, !0), q(d, "addSeries", {options: a}, function() {
            e = d.initSeries(a);
            d.isDirtyLegend = !0;
            d.linkSeries();
            c && d.redraw(g);
          }));
          return e;
        },
        addAxis: function(a, c, g, e) {
          var d = c ? "xAxis" : "yAxis",
              f = this.options;
          a = h(a, {
            index: this[d].length,
            isX: c
          });
          c = new B(this, a);
          f[d] = D(f[d] || {});
          f[d].push(a);
          b(g, !0) && this.redraw(e);
          return c;
        },
        showLoading: function(a) {
          var b = this,
              c = b.options,
              g = b.loadingDiv,
              e = function() {
                g && f(g, {
                  left: b.plotLeft + "px",
                  top: b.plotTop + "px",
                  width: b.plotWidth + "px",
                  height: b.plotHeight + "px"
                });
              };
          g || (b.loadingDiv = g = A("div", {className: "highcharts-loading highcharts-loading-hidden"}, null, b.container), b.loadingSpan = A("span", {className: "highcharts-loading-inner"}, null, g), w(b, "redraw", e));
          g.className = "highcharts-loading";
          b.loadingSpan.innerHTML = a || c.lang.loading;
          b.loadingShown = !0;
          e();
        },
        hideLoading: function() {
          var a = this.loadingDiv;
          a && (a.className = "highcharts-loading highcharts-loading-hidden");
          this.loadingShown = !1;
        },
        propsRequireDirtyBox: "backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
        propsRequireUpdateSeries: "chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" "),
        update: function(a, g, f) {
          var k = this,
              p = {
                credits: "addCredits",
                title: "setTitle",
                subtitle: "setSubtitle"
              },
              l = a.chart,
              u,
              r,
              q = [];
          if (l) {
            h(!0, k.options.chart, l);
            "className" in l && k.setClassName(l.className);
            if ("inverted" in l || "polar" in l)
              k.propFromSeries(), u = !0;
            "alignTicks" in l && (u = !0);
            c(l, function(a, b) {
              -1 !== n("chart." + b, k.propsRequireUpdateSeries) && (r = !0);
              -1 !== n(b, k.propsRequireDirtyBox) && (k.isDirtyBox = !0);
            });
          }
          a.plotOptions && h(!0, this.options.plotOptions, a.plotOptions);
          c(a, function(a, b) {
            if (k[b] && "function" === typeof k[b].update)
              k[b].update(a, !1);
            else if ("function" === typeof k[p[b]])
              k[p[b]](a);
            "chart" !== b && -1 !== n(b, k.propsRequireUpdateSeries) && (r = !0);
          });
          t("xAxis yAxis zAxis series colorAxis pane".split(" "), function(b) {
            a[b] && (t(D(a[b]), function(a, c) {
              (c = d(a.id) && k.get(a.id) || k[b][c]) && c.coll === b && (c.update(a, !1), f && (c.touched = !0));
              if (!c && f)
                if ("series" === b)
                  k.addSeries(a, !1).touched = !0;
                else if ("xAxis" === b || "yAxis" === b)
                  k.addAxis(a, "xAxis" === b, !1).touched = !0;
            }), f && t(k[b], function(a) {
              a.touched ? delete a.touched : q.push(a);
            }));
          });
          t(q, function(a) {
            a.remove(!1);
          });
          u && t(k.axes, function(a) {
            a.update({}, !1);
          });
          r && t(k.series, function(a) {
            a.update({}, !1);
          });
          a.loading && h(!0, k.options.loading, a.loading);
          u = l && l.width;
          l = l && l.height;
          e(u) && u !== k.chartWidth || e(l) && l !== k.chartHeight ? k.setSize(u, l) : b(g, !0) && k.redraw();
        },
        setSubtitle: function(a) {
          this.setTitle(void 0, a);
        }
      });
      v(g.prototype, {
        update: function(a, c, g, e) {
          function d() {
            h.applyOptions(a);
            null === h.y && n && (h.graphic = n.destroy());
            k(a, !0) && (n && n.element && a && a.marker && void 0 !== a.marker.symbol && (h.graphic = n.destroy()), a && a.dataLabels && h.dataLabel && (h.dataLabel = h.dataLabel.destroy()), h.connector && (h.connector = h.connector.destroy()));
            p = h.index;
            f.updateParallelArrays(h, p);
            m.data[p] = k(m.data[p], !0) || k(a, !0) ? h.options : a;
            f.isDirty = f.isDirtyData = !0;
            !f.fixedBox && f.hasCartesianSeries && (l.isDirtyBox = !0);
            "point" === m.legendType && (l.isDirtyLegend = !0);
            c && l.redraw(g);
          }
          var h = this,
              f = h.series,
              n = h.graphic,
              p,
              l = f.chart,
              m = f.options;
          c = b(c, !0);
          !1 === e ? d() : h.firePointEvent("update", {options: a}, d);
        },
        remove: function(a, b) {
          this.series.removePoint(n(this, this.series.data), a, b);
        }
      });
      v(p.prototype, {
        addPoint: function(a, c, g, e) {
          var d = this.options,
              h = this.data,
              f = this.chart,
              k = this.xAxis,
              k = k && k.hasNames && k.names,
              n = d.data,
              p,
              m,
              l = this.xData,
              u,
              q;
          c = b(c, !0);
          p = {series: this};
          this.pointClass.prototype.applyOptions.apply(p, [a]);
          q = p.x;
          u = l.length;
          if (this.requireSorting && q < l[u - 1])
            for (m = !0; u && l[u - 1] > q; )
              u--;
          this.updateParallelArrays(p, "splice", u, 0, 0);
          this.updateParallelArrays(p, u);
          k && p.name && (k[q] = p.name);
          n.splice(u, 0, a);
          m && (this.data.splice(u, 0, null), this.processData());
          "point" === d.legendType && this.generatePoints();
          g && (h[0] && h[0].remove ? h[0].remove(!1) : (h.shift(), this.updateParallelArrays(p, "shift"), n.shift()));
          this.isDirtyData = this.isDirty = !0;
          c && f.redraw(e);
        },
        removePoint: function(a, c, g) {
          var e = this,
              d = e.data,
              h = d[a],
              f = e.points,
              k = e.chart,
              n = function() {
                f && f.length === d.length && f.splice(a, 1);
                d.splice(a, 1);
                e.options.data.splice(a, 1);
                e.updateParallelArrays(h || {series: e}, "splice", a, 1);
                h && h.destroy();
                e.isDirty = !0;
                e.isDirtyData = !0;
                c && k.redraw();
              };
          L(g, k);
          c = b(c, !0);
          h ? h.firePointEvent("remove", null, n) : n();
        },
        remove: function(a, c, g) {
          function e() {
            d.destroy();
            h.isDirtyLegend = h.isDirtyBox = !0;
            h.linkSeries();
            b(a, !0) && h.redraw(c);
          }
          var d = this,
              h = d.chart;
          !1 !== g ? q(d, "remove", null, e) : e();
        },
        update: function(a, c) {
          var g = this,
              e = g.chart,
              d = g.userOptions,
              f = g.oldType || g.type,
              k = a.type || d.type || e.options.chart.type,
              n = F[f].prototype,
              p,
              l = ["group", "markerGroup", "dataLabelsGroup"],
              m = ["navigatorSeries", "baseSeries"],
              q = g.finishedAnimating && {animation: !1};
          if (Object.keys && "data" === Object.keys(a).toString())
            return this.setData(a.data, c);
          m = l.concat(m);
          t(m, function(a) {
            m[a] = g[a];
            delete g[a];
          });
          a = h(d, q, {
            index: g.index,
            pointStart: g.xData[0]
          }, {data: g.options.data}, a);
          g.remove(!1, null, !1);
          for (p in n)
            g[p] = void 0;
          v(g, F[k || f].prototype);
          t(m, function(a) {
            g[a] = m[a];
          });
          g.init(e, a);
          a.zIndex !== d.zIndex && t(l, function(b) {
            g[b] && g[b].attr({zIndex: a.zIndex});
          });
          g.oldType = f;
          e.linkSeries();
          b(c, !0) && e.redraw(!1);
        }
      });
      v(B.prototype, {
        update: function(a, c) {
          var g = this.chart;
          a = g.options[this.coll][this.options.index] = h(this.userOptions, a);
          this.destroy(!0);
          this.init(g, v(a, {events: void 0}));
          g.isDirtyBox = !0;
          b(c, !0) && g.redraw();
        },
        remove: function(a) {
          for (var c = this.chart,
              g = this.coll,
              e = this.series,
              d = e.length; d--; )
            e[d] && e[d].remove(!1);
          l(c.axes, this);
          l(c[g], this);
          y(c.options[g]) ? c.options[g].splice(this.options.index, 1) : delete c.options[g];
          t(c[g], function(a, b) {
            a.options.index = b;
          });
          this.destroy();
          c.isDirtyBox = !0;
          b(a, !0) && c.redraw();
        },
        setTitle: function(a, b) {
          this.update({title: a}, b);
        },
        setCategories: function(a, b) {
          this.update({categories: a}, b);
        }
      });
    })(I);
    (function(a) {
      var w = a.animObject,
          B = a.each,
          A = a.extend,
          f = a.isNumber,
          d = a.merge,
          t = a.pick,
          l = a.Series,
          v = a.seriesType,
          q = a.svg;
      v("column", "line", {
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
          l.prototype.init.apply(this, arguments);
          var a = this,
              e = a.chart;
          e.hasRendered && B(e.series, function(e) {
            e.type === a.type && (e.isDirty = !0);
          });
        },
        getColumnMetrics: function() {
          var a = this,
              e = a.options,
              d = a.xAxis,
              f = a.yAxis,
              h = d.reversed,
              c,
              b = {},
              g = 0;
          !1 === e.grouping ? g = 1 : B(a.chart.series, function(e) {
            var d = e.options,
                h = e.yAxis,
                k;
            e.type !== a.type || !e.visible && a.chart.options.chart.ignoreHiddenSeries || f.len !== h.len || f.pos !== h.pos || (d.stacking ? (c = e.stackKey, void 0 === b[c] && (b[c] = g++), k = b[c]) : !1 !== d.grouping && (k = g++), e.columnIndex = k);
          });
          var p = Math.min(Math.abs(d.transA) * (d.ordinalSlope || e.pointRange || d.closestPointRange || d.tickInterval || 1), d.len),
              l = p * e.groupPadding,
              q = (p - 2 * l) / (g || 1),
              e = Math.min(e.maxPointWidth || d.len, t(e.pointWidth, q * (1 - 2 * e.pointPadding)));
          a.columnMetrics = {
            width: e,
            offset: (q - e) / 2 + (l + ((a.columnIndex || 0) + (h ? 1 : 0)) * q - p / 2) * (h ? -1 : 1)
          };
          return a.columnMetrics;
        },
        crispCol: function(a, e, d, f) {
          var h = this.chart,
              c = this.borderWidth,
              b = -(c % 2 ? .5 : 0),
              c = c % 2 ? .5 : 1;
          h.inverted && h.renderer.isVML && (c += 1);
          this.options.crisp && (d = Math.round(a + d) + b, a = Math.round(a) + b, d -= a);
          f = Math.round(e + f) + c;
          b = .5 >= Math.abs(e) && .5 < f;
          e = Math.round(e) + c;
          f -= e;
          b && f && (--e, f += 1);
          return {
            x: a,
            y: e,
            width: d,
            height: f
          };
        },
        translate: function() {
          var a = this,
              e = a.chart,
              d = a.options,
              f = a.dense = 2 > a.closestPointRange * a.xAxis.transA,
              f = a.borderWidth = t(d.borderWidth, f ? 0 : 1),
              h = a.yAxis,
              c = d.threshold,
              b = a.translatedThreshold = h.getThreshold(c),
              g = t(d.minPointLength, 5),
              p = a.getColumnMetrics(),
              q = p.width,
              v = a.barW = Math.max(q, 1 + 2 * f),
              D = a.pointXOffset = p.offset;
          e.inverted && (b -= .5);
          d.pointPadding && (v = Math.ceil(v));
          l.prototype.translate.apply(a);
          B(a.points, function(d) {
            var f = t(d.yBottom, b),
                k = 999 + Math.abs(f),
                k = Math.min(Math.max(-k, d.plotY), h.len + k),
                n = d.plotX + D,
                p = v,
                l = Math.min(k, f),
                y,
                r = Math.max(k, f) - l;
            g && Math.abs(r) < g && (r = g, y = !h.reversed && !d.negative || h.reversed && d.negative, d.y === c && a.dataMax <= c && h.min < c && (y = !y), l = Math.abs(l - b) > g ? f - g : b - (y ? g : 0));
            d.barX = n;
            d.pointWidth = q;
            d.tooltipPos = e.inverted ? [h.len + h.pos - e.plotLeft - k, a.xAxis.len - n - p / 2, r] : [n + p / 2, k + h.pos - e.plotTop, r];
            d.shapeType = "rect";
            d.shapeArgs = a.crispCol.apply(a, d.isNull ? [n, b, p, 0] : [n, l, p, r]);
          });
        },
        getSymbol: a.noop,
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
        drawGraph: function() {
          this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data");
        },
        drawPoints: function() {
          var a = this,
              e = this.chart,
              k = a.options,
              l = e.renderer,
              h = k.animationLimit || 250,
              c;
          B(a.points, function(b) {
            var g = b.graphic;
            if (f(b.plotY) && null !== b.y) {
              c = b.shapeArgs;
              if (g)
                g[e.pointCount < h ? "animate" : "attr"](d(c));
              else
                b.graphic = g = l[b.shapeType](c).add(b.group || a.group);
              k.borderRadius && g.attr({r: k.borderRadius});
              g.addClass(b.getClassName(), !0);
            } else
              g && (b.graphic = g.destroy());
          });
        },
        animate: function(a) {
          var e = this,
              d = this.yAxis,
              f = e.options,
              h = this.chart.inverted,
              c = {},
              b = h ? "translateX" : "translateY",
              g;
          q && (a ? (c.scaleY = .001, a = Math.min(d.pos + d.len, Math.max(d.pos, d.toPixels(f.threshold))), h ? c.translateX = a - d.len : c.translateY = a, e.group.attr(c)) : (g = e.group.attr(b), e.group.animate({scaleY: 1}, A(w(e.options.animation), {step: function(a, h) {
              c[b] = g + h.pos * (d.pos - g);
              e.group.attr(c);
            }})), e.animate = null));
        },
        remove: function() {
          var a = this,
              e = a.chart;
          e.hasRendered && B(e.series, function(e) {
            e.type === a.type && (e.isDirty = !0);
          });
          l.prototype.remove.apply(a, arguments);
        }
      });
    })(I);
    (function(a) {
      var w = a.Series;
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
          this.options.lineWidth && w.prototype.drawGraph.call(this);
        }
      });
    })(I);
    (function(a) {
      var w = a.addEvent,
          B = a.arrayMax,
          A = a.defined,
          f = a.each,
          d = a.extend,
          t = a.format,
          l = a.map,
          v = a.merge,
          q = a.noop,
          n = a.pick,
          e = a.relativeLength,
          k = a.Series,
          y = a.seriesTypes,
          h = a.stableSort;
      a.distribute = function(a, b) {
        function c(a, b) {
          return a.target - b.target;
        }
        var e,
            d = !0,
            k = a,
            q = [],
            t;
        t = 0;
        for (e = a.length; e--; )
          t += a[e].size;
        if (t > b) {
          h(a, function(a, b) {
            return (b.rank || 0) - (a.rank || 0);
          });
          for (t = e = 0; t <= b; )
            t += a[e].size, e++;
          q = a.splice(e - 1, a.length);
        }
        h(a, c);
        for (a = l(a, function(a) {
          return {
            size: a.size,
            targets: [a.target],
            align: n(a.align, .5)
          };
        }); d; ) {
          for (e = a.length; e--; )
            d = a[e], t = (Math.min.apply(0, d.targets) + Math.max.apply(0, d.targets)) / 2, d.pos = Math.min(Math.max(0, t - d.size * d.align), b - d.size);
          e = a.length;
          for (d = !1; e--; )
            0 < e && a[e - 1].pos + a[e - 1].size > a[e].pos && (a[e - 1].size += a[e].size, a[e - 1].targets = a[e - 1].targets.concat(a[e].targets), a[e - 1].align = .5, a[e - 1].pos + a[e - 1].size > b && (a[e - 1].pos = b - a[e - 1].size), a.splice(e, 1), d = !0);
        }
        e = 0;
        f(a, function(a) {
          var b = 0;
          f(a.targets, function() {
            k[e].pos = a.pos + b;
            b += k[e].size;
            e++;
          });
        });
        k.push.apply(k, q);
        h(k, c);
      };
      k.prototype.drawDataLabels = function() {
        function c(a, b) {
          var c = b.filter;
          return c ? (b = c.operator, a = a[c.property], c = c.value, "\x3e" === b && a > c || "\x3c" === b && a < c || "\x3e\x3d" === b && a >= c || "\x3c\x3d" === b && a <= c || "\x3d\x3d" === b && a == c || "\x3d\x3d\x3d" === b && a === c ? !0 : !1) : !0;
        }
        var b = this,
            g = b.chart,
            e = b.options,
            d = e.dataLabels,
            h = b.points,
            k,
            l,
            q = b.hasRendered || 0,
            u,
            y,
            E = n(d.defer, !!e.animation),
            J = g.renderer;
        if (d.enabled || b._hasPointLabels)
          b.dlProcessOptions && b.dlProcessOptions(d), y = b.plotGroup("dataLabelsGroup", "data-labels", E && !q ? "hidden" : "visible", d.zIndex || 6), E && (y.attr({opacity: +q}), q || w(b, "afterAnimate", function() {
            b.visible && y.show(!0);
            y[e.animation ? "animate" : "attr"]({opacity: 1}, {duration: 200});
          })), l = d, f(h, function(e) {
            var h,
                f = e.dataLabel,
                p,
                m,
                q = e.connector,
                D = !f,
                z;
            k = e.dlOptions || e.options && e.options.dataLabels;
            (h = n(k && k.enabled, l.enabled) && !e.isNull) && (h = !0 === c(e, k || d));
            h && (d = v(l, k), p = e.getLabelConfig(), z = d[e.formatPrefix + "Format"] || d.format, u = A(z) ? t(z, p, g.time) : (d[e.formatPrefix + "Formatter"] || d.formatter).call(p, d), p = d.rotation, m = {
              r: d.borderRadius || 0,
              rotation: p,
              padding: d.padding,
              zIndex: 1
            }, a.objectEach(m, function(a, b) {
              void 0 === a && delete m[b];
            }));
            !f || h && A(u) ? h && A(u) && (f ? m.text = u : (f = e.dataLabel = p ? J.text(u, 0, -9999).addClass("highcharts-data-label") : J.label(u, 0, -9999, d.shape, null, null, d.useHTML, null, "data-label"), f.addClass(" highcharts-data-label-color-" + e.colorIndex + " " + (d.className || "") + (d.useHTML ? "highcharts-tracker" : ""))), f.attr(m), f.added || f.add(y), b.alignDataLabel(e, f, d, null, D)) : (e.dataLabel = f = f.destroy(), q && (e.connector = q.destroy()));
          });
        a.fireEvent(this, "afterDrawDataLabels");
      };
      k.prototype.alignDataLabel = function(a, b, e, h, f) {
        var c = this.chart,
            g = c.inverted,
            k = n(a.dlBox && a.dlBox.centerX, a.plotX, -9999),
            p = n(a.plotY, -9999),
            l = b.getBBox(),
            q,
            t = e.rotation,
            y = e.align,
            v = this.visible && (a.series.forceDL || c.isInsidePlot(k, Math.round(p), g) || h && c.isInsidePlot(k, g ? h.x + 1 : h.y + h.height - 1, g)),
            r = "justify" === n(e.overflow, "justify");
        if (v && (q = c.renderer.fontMetrics(void 0, b).b, h = d({
          x: g ? this.yAxis.len - p : k,
          y: Math.round(g ? this.xAxis.len - k : p),
          width: 0,
          height: 0
        }, h), d(e, {
          width: l.width,
          height: l.height
        }), t ? (r = !1, k = c.renderer.rotCorr(q, t), k = {
          x: h.x + e.x + h.width / 2 + k.x,
          y: h.y + e.y + {
            top: 0,
            middle: .5,
            bottom: 1
          }[e.verticalAlign] * h.height
        }, b[f ? "attr" : "animate"](k).attr({align: y}), p = (t + 720) % 360, p = 180 < p && 360 > p, "left" === y ? k.y -= p ? l.height : 0 : "center" === y ? (k.x -= l.width / 2, k.y -= l.height / 2) : "right" === y && (k.x -= l.width, k.y -= p ? 0 : l.height)) : (b.align(e, null, h), k = b.alignAttr), r ? a.isLabelJustified = this.justifyDataLabel(b, e, k, l, h, f) : n(e.crop, !0) && (v = c.isInsidePlot(k.x, k.y) && c.isInsidePlot(k.x + l.width, k.y + l.height)), e.shape && !t))
          b[f ? "attr" : "animate"]({
            anchorX: g ? c.plotWidth - a.plotY : a.plotX,
            anchorY: g ? c.plotHeight - a.plotX : a.plotY
          });
        v || (b.attr({y: -9999}), b.placed = !1);
      };
      k.prototype.justifyDataLabel = function(a, b, e, d, h, f) {
        var c = this.chart,
            g = b.align,
            k = b.verticalAlign,
            n,
            p,
            l = a.box ? 0 : a.padding || 0;
        n = e.x + l;
        0 > n && ("right" === g ? b.align = "left" : b.x = -n, p = !0);
        n = e.x + d.width - l;
        n > c.plotWidth && ("left" === g ? b.align = "right" : b.x = c.plotWidth - n, p = !0);
        n = e.y + l;
        0 > n && ("bottom" === k ? b.verticalAlign = "top" : b.y = -n, p = !0);
        n = e.y + d.height - l;
        n > c.plotHeight && ("top" === k ? b.verticalAlign = "bottom" : b.y = c.plotHeight - n, p = !0);
        p && (a.placed = !f, a.align(b, null, h));
        return p;
      };
      y.pie && (y.pie.prototype.drawDataLabels = function() {
        var c = this,
            b = c.data,
            e,
            d = c.chart,
            h = c.options.dataLabels,
            l = n(h.connectorPadding, 10),
            q = n(h.connectorWidth, 1),
            t = d.plotWidth,
            z = d.plotHeight,
            u,
            y = c.center,
            v = y[2] / 2,
            w = y[1],
            K,
            r,
            x,
            M,
            m = [[], []],
            G,
            I,
            Q,
            P,
            O = [0, 0, 0, 0];
        c.visible && (h.enabled || c._hasPointLabels) && (f(b, function(a) {
          a.dataLabel && a.visible && a.dataLabel.shortened && (a.dataLabel.attr({width: "auto"}).css({
            width: "auto",
            textOverflow: "clip"
          }), a.dataLabel.shortened = !1);
        }), k.prototype.drawDataLabels.apply(c), f(b, function(a) {
          a.dataLabel && a.visible && (m[a.half].push(a), a.dataLabel._pos = null);
        }), f(m, function(b, g) {
          var k,
              m,
              p = b.length,
              q = [],
              u;
          if (p)
            for (c.sortByAngle(b, g - .5), 0 < c.maxLabelDistance && (k = Math.max(0, w - v - c.maxLabelDistance), m = Math.min(w + v + c.maxLabelDistance, d.plotHeight), f(b, function(a) {
              0 < a.labelDistance && a.dataLabel && (a.top = Math.max(0, w - v - a.labelDistance), a.bottom = Math.min(w + v + a.labelDistance, d.plotHeight), u = a.dataLabel.getBBox().height || 21, a.positionsIndex = q.push({
                target: a.labelPos[1] - a.top + u / 2,
                size: u,
                rank: a.y
              }) - 1);
            }), a.distribute(q, m + u - k)), P = 0; P < p; P++)
              e = b[P], m = e.positionsIndex, x = e.labelPos, K = e.dataLabel, Q = !1 === e.visible ? "hidden" : "inherit", I = k = x[1], q && A(q[m]) && (void 0 === q[m].pos ? Q = "hidden" : (M = q[m].size, I = e.top + q[m].pos)), delete e.positionIndex, G = h.justify ? y[0] + (g ? -1 : 1) * (v + e.labelDistance) : c.getX(I < e.top + 2 || I > e.bottom - 2 ? k : I, g, e), K._attr = {
                visibility: Q,
                align: x[6]
              }, K._pos = {
                x: G + h.x + ({
                  left: l,
                  right: -l
                }[x[6]] || 0),
                y: I + h.y - 10
              }, x.x = G, x.y = I, n(h.crop, !0) && (r = K.getBBox().width, k = null, G - r < l ? (k = Math.round(r - G + l), O[3] = Math.max(k, O[3])) : G + r > t - l && (k = Math.round(G + r - t + l), O[1] = Math.max(k, O[1])), 0 > I - M / 2 ? O[0] = Math.max(Math.round(-I + M / 2), O[0]) : I + M / 2 > z && (O[2] = Math.max(Math.round(I + M / 2 - z), O[2])), K.sideOverflow = k);
        }), 0 === B(O) || this.verifyDataLabelOverflow(O)) && (this.placeDataLabels(), q && f(this.points, function(a) {
          var b;
          u = a.connector;
          if ((K = a.dataLabel) && K._pos && a.visible && 0 < a.labelDistance) {
            Q = K._attr.visibility;
            if (b = !u)
              a.connector = u = d.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-" + a.colorIndex).add(c.dataLabelsGroup);
            u[b ? "attr" : "animate"]({d: c.connectorPath(a.labelPos)});
            u.attr("visibility", Q);
          } else
            u && (a.connector = u.destroy());
        }));
      }, y.pie.prototype.connectorPath = function(a) {
        var b = a.x,
            c = a.y;
        return n(this.options.dataLabels.softConnector, !0) ? ["M", b + ("left" === a[6] ? 5 : -5), c, "C", b, c, 2 * a[2] - a[4], 2 * a[3] - a[5], a[2], a[3], "L", a[4], a[5]] : ["M", b + ("left" === a[6] ? 5 : -5), c, "L", a[2], a[3], "L", a[4], a[5]];
      }, y.pie.prototype.placeDataLabels = function() {
        f(this.points, function(a) {
          var b = a.dataLabel;
          b && a.visible && ((a = b._pos) ? (b.sideOverflow && (b._attr.width = b.getBBox().width - b.sideOverflow, b.css({
            width: b._attr.width + "px",
            textOverflow: "ellipsis"
          }), b.shortened = !0), b.attr(b._attr), b[b.moved ? "animate" : "attr"](a), b.moved = !0) : b && b.attr({y: -9999}));
        }, this);
      }, y.pie.prototype.alignDataLabel = q, y.pie.prototype.verifyDataLabelOverflow = function(a) {
        var b = this.center,
            c = this.options,
            d = c.center,
            h = c.minSize || 80,
            f,
            k = null !== c.size;
        k || (null !== d[0] ? f = Math.max(b[2] - Math.max(a[1], a[3]), h) : (f = Math.max(b[2] - a[1] - a[3], h), b[0] += (a[3] - a[1]) / 2), null !== d[1] ? f = Math.max(Math.min(f, b[2] - Math.max(a[0], a[2])), h) : (f = Math.max(Math.min(f, b[2] - a[0] - a[2]), h), b[1] += (a[0] - a[2]) / 2), f < b[2] ? (b[2] = f, b[3] = Math.min(e(c.innerSize || 0, f), f), this.translate(b), this.drawDataLabels && this.drawDataLabels()) : k = !0);
        return k;
      });
      y.column && (y.column.prototype.alignDataLabel = function(a, b, e, d, h) {
        var c = this.chart.inverted,
            g = a.series,
            f = a.dlBox || a.shapeArgs,
            l = n(a.below, a.plotY > n(this.translatedThreshold, g.yAxis.len)),
            p = n(e.inside, !!this.options.stacking);
        f && (d = v(f), 0 > d.y && (d.height += d.y, d.y = 0), f = d.y + d.height - g.yAxis.len, 0 < f && (d.height -= f), c && (d = {
          x: g.yAxis.len - d.y - d.height,
          y: g.xAxis.len - d.x - d.width,
          width: d.height,
          height: d.width
        }), p || (c ? (d.x += l ? 0 : d.width, d.width = 0) : (d.y += l ? d.height : 0, d.height = 0)));
        e.align = n(e.align, !c || p ? "center" : l ? "right" : "left");
        e.verticalAlign = n(e.verticalAlign, c || p ? "middle" : l ? "top" : "bottom");
        k.prototype.alignDataLabel.call(this, a, b, e, d, h);
        a.isLabelJustified && a.contrastColor && a.dataLabel.css({color: a.contrastColor});
      });
    })(I);
    (function(a) {
      var w = a.Chart,
          B = a.each,
          A = a.objectEach,
          f = a.pick;
      a = a.addEvent;
      a(w.prototype, "render", function() {
        var a = [];
        B(this.labelCollectors || [], function(d) {
          a = a.concat(d());
        });
        B(this.yAxis || [], function(d) {
          d.options.stackLabels && !d.options.stackLabels.allowOverlap && A(d.stacks, function(d) {
            A(d, function(d) {
              a.push(d.label);
            });
          });
        });
        B(this.series || [], function(d) {
          var l = d.options.dataLabels,
              t = d.dataLabelCollections || ["dataLabel"];
          (l.enabled || d._hasPointLabels) && !l.allowOverlap && d.visible && B(t, function(l) {
            B(d.points, function(d) {
              d[l] && (d[l].labelrank = f(d.labelrank, d.shapeArgs && d.shapeArgs.height), a.push(d[l]));
            });
          });
        });
        this.hideOverlappingLabels(a);
      });
      w.prototype.hideOverlappingLabels = function(a) {
        var d = a.length,
            f,
            v,
            q,
            n,
            e,
            k,
            y,
            h,
            c,
            b = function(a, b, c, e, d, h, f, k) {
              return !(d > a + c || d + f < a || h > b + e || h + k < b);
            };
        for (v = 0; v < d; v++)
          if (f = a[v])
            f.oldOpacity = f.opacity, f.newOpacity = 1, f.width || (q = f.getBBox(), f.width = q.width, f.height = q.height);
        a.sort(function(a, b) {
          return (b.labelrank || 0) - (a.labelrank || 0);
        });
        for (v = 0; v < d; v++)
          for (q = a[v], f = v + 1; f < d; ++f)
            if (n = a[f], q && n && q !== n && q.placed && n.placed && 0 !== q.newOpacity && 0 !== n.newOpacity && (e = q.alignAttr, k = n.alignAttr, y = q.parentGroup, h = n.parentGroup, c = 2 * (q.box ? 0 : q.padding || 0), e = b(e.x + y.translateX, e.y + y.translateY, q.width - c, q.height - c, k.x + h.translateX, k.y + h.translateY, n.width - c, n.height - c)))
              (q.labelrank < n.labelrank ? q : n).newOpacity = 0;
        B(a, function(a) {
          var b,
              c;
          a && (c = a.newOpacity, a.oldOpacity !== c && a.placed && (c ? a.show(!0) : b = function() {
            a.hide();
          }, a.alignAttr.opacity = c, a[a.isOld ? "animate" : "attr"](a.alignAttr, null, b)), a.isOld = !0);
        });
      };
    })(I);
    (function(a) {
      var w = a.addEvent,
          B = a.Chart,
          A = a.createElement,
          f = a.css,
          d = a.defaultOptions,
          t = a.defaultPlotOptions,
          l = a.each,
          v = a.extend,
          q = a.fireEvent,
          n = a.hasTouch,
          e = a.inArray,
          k = a.isObject,
          y = a.Legend,
          h = a.merge,
          c = a.pick,
          b = a.Point,
          g = a.Series,
          p = a.seriesTypes,
          F = a.svg,
          L;
      L = a.TrackerMixin = {
        drawTrackerPoint: function() {
          var a = this,
              b = a.chart.pointer,
              c = function(a) {
                var c = b.getPointFromEvent(a);
                void 0 !== c && (b.isDirectTouch = !0, c.onMouseOver(a));
              };
          l(a.points, function(a) {
            a.graphic && (a.graphic.element.point = a);
            a.dataLabel && (a.dataLabel.div ? a.dataLabel.div.point = a : a.dataLabel.element.point = a);
          });
          a._hasTracking || (l(a.trackerGroups, function(e) {
            if (a[e] && (a[e].addClass("highcharts-tracker").on("mouseover", c).on("mouseout", function(a) {
              b.onTrackerMouseOut(a);
            }), n))
              a[e].on("touchstart", c);
          }), a._hasTracking = !0);
          q(this, "afterDrawTracker");
        },
        drawTrackerGraph: function() {
          var a = this,
              b = a.options.trackByArea,
              c = [].concat(b ? a.areaPath : a.graphPath),
              e = c.length,
              d = a.chart,
              g = d.pointer,
              h = d.renderer,
              f = d.options.tooltip.snap,
              k = a.tracker,
              p,
              t = function() {
                if (d.hoverSeries !== a)
                  a.onMouseOver();
              },
              m = "rgba(192,192,192," + (F ? .0001 : .002) + ")";
          if (e && !b)
            for (p = e + 1; p--; )
              "M" === c[p] && c.splice(p + 1, 0, c[p + 1] - f, c[p + 2], "L"), (p && "M" === c[p] || p === e) && c.splice(p, 0, "L", c[p - 2] + f, c[p - 1]);
          k ? k.attr({d: c}) : a.graph && (a.tracker = h.path(c).attr({
            "stroke-linejoin": "round",
            visibility: a.visible ? "visible" : "hidden",
            stroke: m,
            fill: b ? m : "none",
            "stroke-width": a.graph.strokeWidth() + (b ? 0 : 2 * f),
            zIndex: 2
          }).add(a.group), l([a.tracker, a.markerGroup], function(a) {
            a.addClass("highcharts-tracker").on("mouseover", t).on("mouseout", function(a) {
              g.onTrackerMouseOut(a);
            });
            if (n)
              a.on("touchstart", t);
          }));
          q(this, "afterDrawTracker");
        }
      };
      p.column && (p.column.prototype.drawTracker = L.drawTrackerPoint);
      p.pie && (p.pie.prototype.drawTracker = L.drawTrackerPoint);
      p.scatter && (p.scatter.prototype.drawTracker = L.drawTrackerPoint);
      v(y.prototype, {
        setItemEvents: function(a, c, e) {
          var d = this.chart.renderer.boxWrapper,
              g = "highcharts-legend-" + (a instanceof b ? "point" : "series") + "-active";
          (e ? c : a.legendGroup).on("mouseover", function() {
            a.setState("hover");
            d.addClass(g);
          }).on("mouseout", function() {
            d.removeClass(g);
            a.setState();
          }).on("click", function(b) {
            var c = function() {
              a.setVisible && a.setVisible();
            };
            d.removeClass(g);
            b = {browserEvent: b};
            a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : q(a, "legendItemClick", b, c);
          });
        },
        createCheckboxForItem: function(a) {
          a.checkbox = A("input", {
            type: "checkbox",
            checked: a.selected,
            defaultChecked: a.selected
          }, this.options.itemCheckboxStyle, this.chart.container);
          w(a.checkbox, "click", function(b) {
            q(a.series || a, "checkboxClick", {
              checked: b.target.checked,
              item: a
            }, function() {
              a.select();
            });
          });
        }
      });
      v(B.prototype, {
        showResetZoom: function() {
          function a() {
            b.zoomOut();
          }
          var b = this,
              c = d.lang,
              e = b.options.chart.resetZoomButton,
              g = e.theme,
              h = g.states,
              f = "chart" === e.relativeTo ? null : "plotBox";
          q(this, "beforeShowResetZoom", null, function() {
            b.resetZoomButton = b.renderer.button(c.resetZoom, null, null, a, g, h && h.hover).attr({
              align: e.position.align,
              title: c.resetZoomTitle
            }).addClass("highcharts-reset-zoom").add().align(e.position, !1, f);
          });
        },
        zoomOut: function() {
          var a = this;
          q(a, "selection", {resetSelection: !0}, function() {
            a.zoom();
          });
        },
        zoom: function(a) {
          var b,
              e = this.pointer,
              d = !1,
              g;
          !a || a.resetSelection ? (l(this.axes, function(a) {
            b = a.zoom();
          }), e.initiated = !1) : l(a.xAxis.concat(a.yAxis), function(a) {
            var c = a.axis;
            e[c.isXAxis ? "zoomX" : "zoomY"] && (b = c.zoom(a.min, a.max), c.displayBtn && (d = !0));
          });
          g = this.resetZoomButton;
          d && !g ? this.showResetZoom() : !d && k(g) && (this.resetZoomButton = g.destroy());
          b && this.redraw(c(this.options.chart.animation, a && a.animation, 100 > this.pointCount));
        },
        pan: function(a, b) {
          var c = this,
              e = c.hoverPoints,
              d;
          e && l(e, function(a) {
            a.setState();
          });
          l("xy" === b ? [1, 0] : [1], function(b) {
            b = c[b ? "xAxis" : "yAxis"][0];
            var e = b.horiz,
                g = a[e ? "chartX" : "chartY"],
                e = e ? "mouseDownX" : "mouseDownY",
                h = c[e],
                f = (b.pointRange || 0) / 2,
                k = b.getExtremes(),
                n = b.toValue(h - g, !0) + f,
                p = b.toValue(h + b.len - g, !0) - f,
                l = p < n,
                h = l ? p : n,
                n = l ? n : p,
                p = Math.min(k.dataMin, f ? k.min : b.toValue(b.toPixels(k.min) - b.minPixelPadding)),
                f = Math.max(k.dataMax, f ? k.max : b.toValue(b.toPixels(k.max) + b.minPixelPadding)),
                l = p - h;
            0 < l && (n += l, h = p);
            l = n - f;
            0 < l && (n = f, h -= l);
            b.series.length && h !== k.min && n !== k.max && (b.setExtremes(h, n, !1, !1, {trigger: "pan"}), d = !0);
            c[e] = g;
          });
          d && c.redraw(!1);
          f(c.container, {cursor: "move"});
        }
      });
      v(b.prototype, {
        select: function(a, b) {
          var d = this,
              g = d.series,
              h = g.chart;
          a = c(a, !d.selected);
          d.firePointEvent(a ? "select" : "unselect", {accumulate: b}, function() {
            d.selected = d.options.selected = a;
            g.options.data[e(d, g.data)] = d.options;
            d.setState(a && "select");
            b || l(h.getSelectedPoints(), function(a) {
              a.selected && a !== d && (a.selected = a.options.selected = !1, g.options.data[e(a, g.data)] = a.options, a.setState(""), a.firePointEvent("unselect"));
            });
          });
        },
        onMouseOver: function(a) {
          var b = this.series.chart,
              c = b.pointer;
          a = a ? c.normalize(a) : c.getChartCoordinatesFromPoint(this, b.inverted);
          c.runPointActions(a, this);
        },
        onMouseOut: function() {
          var a = this.series.chart;
          this.firePointEvent("mouseOut");
          l(a.hoverPoints || [], function(a) {
            a.setState();
          });
          a.hoverPoints = a.hoverPoint = null;
        },
        importEvents: function() {
          if (!this.hasImportedEvents) {
            var b = this,
                c = h(b.series.options.point, b.options).events;
            b.events = c;
            a.objectEach(c, function(a, c) {
              w(b, c, a);
            });
            this.hasImportedEvents = !0;
          }
        },
        setState: function(a, b) {
          var e = Math.floor(this.plotX),
              d = this.plotY,
              g = this.series,
              h = g.options.states[a || "normal"] || {},
              f = t[g.type].marker && g.options.marker,
              k = f && !1 === f.enabled,
              n = f && f.states && f.states[a || "normal"] || {},
              l = !1 === n.enabled,
              p = g.stateMarkerGraphic,
              m = this.marker || {},
              y = g.chart,
              v = g.halo,
              w,
              D = f && g.markerAttribs;
          a = a || "";
          if (!(a === this.state && !b || this.selected && "select" !== a || !1 === h.enabled || a && (l || k && !1 === n.enabled) || a && m.states && m.states[a] && !1 === m.states[a].enabled)) {
            D && (w = g.markerAttribs(this, a));
            if (this.graphic)
              this.state && this.graphic.removeClass("highcharts-point-" + this.state), a && this.graphic.addClass("highcharts-point-" + a), w && this.graphic.animate(w, c(y.options.chart.animation, n.animation, f.animation)), p && p.hide();
            else {
              if (a && n)
                if (f = m.symbol || g.symbol, p && p.currentSymbol !== f && (p = p.destroy()), p)
                  p[b ? "animate" : "attr"]({
                    x: w.x,
                    y: w.y
                  });
                else
                  f && (g.stateMarkerGraphic = p = y.renderer.symbol(f, w.x, w.y, w.width, w.height).add(g.markerGroup), p.currentSymbol = f);
              p && (p[a && y.isInsidePlot(e, d, y.inverted) ? "show" : "hide"](), p.element.point = this);
            }
            (e = h.halo) && e.size ? (v || (g.halo = v = y.renderer.path().add((this.graphic || p).parentGroup)), v.show()[b ? "animate" : "attr"]({d: this.haloPath(e.size)}), v.attr({"class": "highcharts-halo highcharts-color-" + c(this.colorIndex, g.colorIndex)}), v.point = this) : v && v.point && v.point.haloPath && v.animate({d: v.point.haloPath(0)}, null, v.hide);
            this.state = a;
            q(this, "afterSetState");
          }
        },
        haloPath: function(a) {
          return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) - a, this.plotY - a, 2 * a, 2 * a);
        }
      });
      v(g.prototype, {
        onMouseOver: function() {
          var a = this.chart,
              b = a.hoverSeries;
          if (b && b !== this)
            b.onMouseOut();
          this.options.events.mouseOver && q(this, "mouseOver");
          this.setState("hover");
          a.hoverSeries = this;
        },
        onMouseOut: function() {
          var a = this.options,
              b = this.chart,
              c = b.tooltip,
              e = b.hoverPoint;
          b.hoverSeries = null;
          if (e)
            e.onMouseOut();
          this && a.events.mouseOut && q(this, "mouseOut");
          !c || this.stickyTracking || c.shared && !this.noSharedTooltip || c.hide();
          this.setState();
        },
        setState: function(a) {
          var b = this;
          a = a || "";
          b.state !== a && (l([b.group, b.markerGroup, b.dataLabelsGroup], function(c) {
            c && (b.state && c.removeClass("highcharts-series-" + b.state), a && c.addClass("highcharts-series-" + a));
          }), b.state = a);
        },
        setVisible: function(a, b) {
          var c = this,
              e = c.chart,
              d = c.legendItem,
              g,
              h = e.options.chart.ignoreHiddenSeries,
              f = c.visible;
          g = (c.visible = a = c.options.visible = c.userOptions.visible = void 0 === a ? !f : a) ? "show" : "hide";
          l(["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"], function(a) {
            if (c[a])
              c[a][g]();
          });
          if (e.hoverSeries === c || (e.hoverPoint && e.hoverPoint.series) === c)
            c.onMouseOut();
          d && e.legend.colorizeItem(c, a);
          c.isDirty = !0;
          c.options.stacking && l(e.series, function(a) {
            a.options.stacking && a.visible && (a.isDirty = !0);
          });
          l(c.linkedSeries, function(b) {
            b.setVisible(a, !1);
          });
          h && (e.isDirtyBox = !0);
          !1 !== b && e.redraw();
          q(c, g);
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
          q(this, a ? "select" : "unselect");
        },
        drawTracker: L.drawTrackerGraph
      });
    })(I);
    (function(a) {
      var w = a.Chart,
          B = a.each,
          A = a.inArray,
          f = a.isArray,
          d = a.isObject,
          t = a.pick,
          l = a.splat;
      w.prototype.setResponsive = function(d) {
        var f = this.options.responsive,
            n = [],
            e = this.currentResponsive;
        f && f.rules && B(f.rules, function(e) {
          void 0 === e._id && (e._id = a.uniqueKey());
          this.matchResponsiveRule(e, n, d);
        }, this);
        var k = a.merge.apply(0, a.map(n, function(e) {
          return a.find(f.rules, function(a) {
            return a._id === e;
          }).chartOptions;
        })),
            n = n.toString() || void 0;
        n !== (e && e.ruleIds) && (e && this.update(e.undoOptions, d), n ? (this.currentResponsive = {
          ruleIds: n,
          mergedOptions: k,
          undoOptions: this.currentOptions(k)
        }, this.update(k, d)) : this.currentResponsive = void 0);
      };
      w.prototype.matchResponsiveRule = function(a, d) {
        var f = a.condition;
        (f.callback || function() {
          return this.chartWidth <= t(f.maxWidth, Number.MAX_VALUE) && this.chartHeight <= t(f.maxHeight, Number.MAX_VALUE) && this.chartWidth >= t(f.minWidth, 0) && this.chartHeight >= t(f.minHeight, 0);
        }).call(this) && d.push(a._id);
      };
      w.prototype.currentOptions = function(t) {
        function q(e, k, n, h) {
          var c;
          a.objectEach(e, function(a, e) {
            if (!h && -1 < A(e, ["series", "xAxis", "yAxis"]))
              for (a = l(a), n[e] = [], c = 0; c < a.length; c++)
                k[e][c] && (n[e][c] = {}, q(a[c], k[e][c], n[e][c], h + 1));
            else
              d(a) ? (n[e] = f(a) ? [] : {}, q(a, k[e] || {}, n[e], h + 1)) : n[e] = k[e] || null;
          });
        }
        var n = {};
        q(t, this.options, n, 0);
        return n;
      };
    })(I);
    (function(a) {
      var w = a.Axis,
          B = a.each,
          A = a.pick;
      a = a.wrap;
      a(w.prototype, "getSeriesExtremes", function(a) {
        var d = this.isXAxis,
            f,
            l,
            v = [],
            q;
        d && B(this.series, function(a, e) {
          a.useMapGeometry && (v[e] = a.xData, a.xData = []);
        });
        a.call(this);
        d && (f = A(this.dataMin, Number.MAX_VALUE), l = A(this.dataMax, -Number.MAX_VALUE), B(this.series, function(a, e) {
          a.useMapGeometry && (f = Math.min(f, A(a.minX, f)), l = Math.max(l, A(a.maxX, l)), a.xData = v[e], q = !0);
        }), q && (this.dataMin = f, this.dataMax = l));
      });
      a(w.prototype, "setAxisTranslation", function(a) {
        var d = this.chart,
            f = d.plotWidth / d.plotHeight,
            d = d.xAxis[0],
            l;
        a.call(this);
        "yAxis" === this.coll && void 0 !== d.transA && B(this.series, function(a) {
          a.preserveAspectRatio && (l = !0);
        });
        if (l && (this.transA = d.transA = Math.min(this.transA, d.transA), a = f / ((d.max - d.min) / (this.max - this.min)), a = 1 > a ? this : d, f = (a.max - a.min) * a.transA, a.pixelPadding = a.len - f, a.minPixelPadding = a.pixelPadding / 2, f = a.fixTo)) {
          f = f[1] - a.toValue(f[0], !0);
          f *= a.transA;
          if (Math.abs(f) > a.minPixelPadding || a.min === a.dataMin && a.max === a.dataMax)
            f = 0;
          a.minPixelPadding -= f;
        }
      });
      a(w.prototype, "render", function(a) {
        a.call(this);
        this.fixTo = null;
      });
    })(I);
    (function(a) {
      var w = a.Axis,
          B = a.Chart,
          A = a.color,
          f,
          d = a.each,
          t = a.extend,
          l = a.isNumber,
          v = a.Legend,
          q = a.LegendSymbolMixin,
          n = a.noop,
          e = a.merge,
          k = a.pick,
          y = a.wrap;
      a.ColorAxis || (f = a.ColorAxis = function() {
        this.init.apply(this, arguments);
      }, t(f.prototype, w.prototype), t(f.prototype, {
        defaultColorAxisOptions: {
          lineWidth: 0,
          minPadding: 0,
          maxPadding: 0,
          gridLineWidth: 1,
          tickPixelInterval: 72,
          startOnTick: !0,
          endOnTick: !0,
          offset: 0,
          marker: {
            animation: {duration: 50},
            width: .01
          },
          labels: {
            overflow: "justify",
            rotation: 0
          },
          minColor: "#e6ebf5",
          maxColor: "#003399",
          tickLength: 5,
          showInLegend: !0
        },
        keepProps: ["legendGroup", "legendItemHeight", "legendItemWidth", "legendItem", "legendSymbol"].concat(w.prototype.keepProps),
        init: function(a, c) {
          var b = "vertical" !== a.options.legend.layout,
              d;
          this.coll = "colorAxis";
          d = e(this.defaultColorAxisOptions, {
            side: b ? 2 : 1,
            reversed: !b
          }, c, {
            opposite: !b,
            showEmpty: !1,
            title: null,
            visible: a.options.legend.enabled
          });
          w.prototype.init.call(this, a, d);
          c.dataClasses && this.initDataClasses(c);
          this.initStops();
          this.horiz = b;
          this.zoomEnabled = !1;
          this.defaultLegendLength = 200;
        },
        initDataClasses: function(a) {
          var c,
              b = 0,
              g = this.chart.options.chart.colorCount,
              h = this.options,
              f = a.dataClasses.length;
          this.dataClasses = c = [];
          this.legendItems = [];
          d(a.dataClasses, function(a, d) {
            a = e(a);
            c.push(a);
            "category" === h.dataClassColor ? (a.colorIndex = b, b++, b === g && (b = 0)) : a.color = A(h.minColor).tweenTo(A(h.maxColor), 2 > f ? .5 : d / (f - 1));
          });
        },
        setTickPositions: function() {
          if (!this.dataClasses)
            return w.prototype.setTickPositions.call(this);
        },
        initStops: function() {
          this.stops = this.options.stops || [[0, this.options.minColor], [1, this.options.maxColor]];
          d(this.stops, function(a) {
            a.color = A(a[1]);
          });
        },
        setOptions: function(a) {
          w.prototype.setOptions.call(this, a);
          this.options.crosshair = this.options.marker;
        },
        setAxisSize: function() {
          var a = this.legendSymbol,
              c = this.chart,
              b = c.options.legend || {},
              e,
              d;
          a ? (this.left = b = a.attr("x"), this.top = e = a.attr("y"), this.width = d = a.attr("width"), this.height = a = a.attr("height"), this.right = c.chartWidth - b - d, this.bottom = c.chartHeight - e - a, this.len = this.horiz ? d : a, this.pos = this.horiz ? b : e) : this.len = (this.horiz ? b.symbolWidth : b.symbolHeight) || this.defaultLegendLength;
        },
        normalizedValue: function(a) {
          this.isLog && (a = this.val2lin(a));
          return 1 - (this.max - a) / (this.max - this.min || 1);
        },
        toColor: function(a, c) {
          var b = this.stops,
              e,
              d,
              h = this.dataClasses,
              f,
              k;
          if (h)
            for (k = h.length; k--; ) {
              if (f = h[k], e = f.from, b = f.to, (void 0 === e || a >= e) && (void 0 === b || a <= b)) {
                c && (c.dataClass = k, c.colorIndex = f.colorIndex);
                break;
              }
            }
          else {
            a = this.normalizedValue(a);
            for (k = b.length; k-- && !(a > b[k][0]); )
              ;
            e = b[k] || b[k + 1];
            b = b[k + 1] || e;
            a = 1 - (b[0] - a) / (b[0] - e[0] || 1);
            d = e.color.tweenTo(b.color, a);
          }
          return d;
        },
        getOffset: function() {
          var a = this.legendGroup,
              c = this.chart.axisOffset[this.side];
          a && (this.axisParent = a, w.prototype.getOffset.call(this), this.added || (this.added = !0, this.labelLeft = 0, this.labelRight = this.width), this.chart.axisOffset[this.side] = c);
        },
        setLegendColor: function() {
          var a,
              c = this.reversed;
          a = c ? 1 : 0;
          c = c ? 0 : 1;
          a = this.horiz ? [a, 0, c, 0] : [0, c, 0, a];
          this.legendColor = {
            linearGradient: {
              x1: a[0],
              y1: a[1],
              x2: a[2],
              y2: a[3]
            },
            stops: this.stops
          };
        },
        drawLegendSymbol: function(a, c) {
          var b = a.padding,
              e = a.options,
              d = this.horiz,
              f = k(e.symbolWidth, d ? this.defaultLegendLength : 12),
              h = k(e.symbolHeight, d ? 12 : this.defaultLegendLength),
              n = k(e.labelPadding, d ? 16 : 30),
              e = k(e.itemDistance, 10);
          this.setLegendColor();
          c.legendSymbol = this.chart.renderer.rect(0, a.baseline - 11, f, h).attr({zIndex: 1}).add(c.legendGroup);
          this.legendItemWidth = f + b + (d ? e : n);
          this.legendItemHeight = h + b + (d ? n : 0);
        },
        setState: function(a) {
          d(this.series, function(c) {
            c.setState(a);
          });
        },
        visible: !0,
        setVisible: n,
        getSeriesExtremes: function() {
          var a = this.series,
              c = a.length;
          this.dataMin = Infinity;
          for (this.dataMax = -Infinity; c--; )
            void 0 !== a[c].valueMin && (this.dataMin = Math.min(this.dataMin, a[c].valueMin), this.dataMax = Math.max(this.dataMax, a[c].valueMax));
        },
        drawCrosshair: function(a, c) {
          var b = c && c.plotX,
              e = c && c.plotY,
              d,
              f = this.pos,
              h = this.len;
          c && (d = this.toPixels(c[c.series.colorKey]), d < f ? d = f - 2 : d > f + h && (d = f + h + 2), c.plotX = d, c.plotY = this.len - d, w.prototype.drawCrosshair.call(this, a, c), c.plotX = b, c.plotY = e, this.cross && !this.cross.addedToColorAxis && this.legendGroup && (this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup), this.cross.addedToColorAxis = !0));
        },
        getPlotLinePath: function(a, c, b, e, d) {
          return l(d) ? this.horiz ? ["M", d - 4, this.top - 6, "L", d + 4, this.top - 6, d, this.top, "Z"] : ["M", this.left, d, "L", this.left - 6, d + 6, this.left - 6, d - 6, "Z"] : w.prototype.getPlotLinePath.call(this, a, c, b, e);
        },
        update: function(a, c) {
          var b = this.chart,
              g = b.legend;
          d(this.series, function(a) {
            a.isDirtyData = !0;
          });
          a.dataClasses && g.allItems && (d(g.allItems, function(a) {
            a.isDataClass && a.legendGroup && a.legendGroup.destroy();
          }), b.isDirtyLegend = !0);
          b.options[this.coll] = e(this.userOptions, a);
          w.prototype.update.call(this, a, c);
          this.legendItem && (this.setLegendColor(), g.colorizeItem(this, !0));
        },
        remove: function() {
          this.legendItem && this.chart.legend.destroyItem(this);
          w.prototype.remove.call(this);
        },
        getDataClassLegendSymbols: function() {
          var e = this,
              c = this.chart,
              b = this.legendItems,
              g = c.options.legend,
              f = g.valueDecimals,
              k = g.valueSuffix || "",
              l;
          b.length || d(this.dataClasses, function(g, h) {
            var p = !0,
                u = g.from,
                v = g.to;
            l = "";
            void 0 === u ? l = "\x3c " : void 0 === v && (l = "\x3e ");
            void 0 !== u && (l += a.numberFormat(u, f) + k);
            void 0 !== u && void 0 !== v && (l += " - ");
            void 0 !== v && (l += a.numberFormat(v, f) + k);
            b.push(t({
              chart: c,
              name: l,
              options: {},
              drawLegendSymbol: q.drawRectangle,
              visible: !0,
              setState: n,
              isDataClass: !0,
              setVisible: function() {
                p = this.visible = !p;
                d(e.series, function(a) {
                  d(a.points, function(a) {
                    a.dataClass === h && a.setVisible(p);
                  });
                });
                c.legend.colorizeItem(this, p);
              }
            }, g));
          });
          return b;
        },
        name: ""
      }), d(["fill", "stroke"], function(e) {
        a.Fx.prototype[e + "Setter"] = function() {
          this.elem.attr(e, A(this.start).tweenTo(A(this.end), this.pos), null, !0);
        };
      }), y(B.prototype, "getAxes", function(a) {
        var c = this.options.colorAxis;
        a.call(this);
        this.colorAxis = [];
        c && new f(this, c);
      }), y(v.prototype, "getAllItems", function(a) {
        var c = [],
            b = this.chart.colorAxis[0];
        b && b.options && (b.options.showInLegend && (b.options.dataClasses ? c = c.concat(b.getDataClassLegendSymbols()) : c.push(b)), d(b.series, function(a) {
          a.options.showInLegend = !1;
        }));
        return c.concat(a.call(this));
      }), y(v.prototype, "colorizeItem", function(a, c, b) {
        a.call(this, c, b);
        b && c.legendColor && c.legendSymbol.attr({fill: c.legendColor});
      }), y(v.prototype, "update", function(a) {
        a.apply(this, [].slice.call(arguments, 1));
        this.chart.colorAxis[0] && this.chart.colorAxis[0].update({}, arguments[2]);
      }));
    })(I);
    (function(a) {
      var w = a.defined,
          B = a.each,
          A = a.noop;
      a.colorPointMixin = {
        isValid: function() {
          return null !== this.value && Infinity !== this.value && -Infinity !== this.value;
        },
        setVisible: function(a) {
          var d = this,
              f = a ? "show" : "hide";
          B(["graphic", "dataLabel"], function(a) {
            if (d[a])
              d[a][f]();
          });
        },
        setState: function(f) {
          a.Point.prototype.setState.call(this, f);
          this.graphic && this.graphic.attr({zIndex: "hover" === f ? 1 : 0});
        }
      };
      a.colorSeriesMixin = {
        pointArrayMap: ["value"],
        axisTypes: ["xAxis", "yAxis", "colorAxis"],
        optionalAxis: "colorAxis",
        trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
        getSymbol: A,
        parallelArrays: ["x", "y", "value"],
        colorKey: "value",
        translateColors: function() {
          var a = this,
              d = this.options.nullColor,
              t = this.colorAxis,
              l = this.colorKey;
          B(this.data, function(f) {
            var q = f[l];
            if (q = f.options.color || (f.isNull ? d : t && void 0 !== q ? t.toColor(q, f) : f.color || a.color))
              f.color = q;
          });
        },
        colorAttribs: function(a) {
          var d = {};
          w(a.color) && (d[this.colorProp || "fill"] = a.color);
          return d;
        }
      };
    })(I);
    (function(a) {
      function w(a) {
        a && (a.preventDefault && a.preventDefault(), a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0);
      }
      function B(a) {
        this.init(a);
      }
      var A = a.addEvent,
          f = a.Chart,
          d = a.doc,
          t = a.each,
          l = a.extend,
          v = a.merge,
          q = a.pick,
          n = a.wrap;
      B.prototype.init = function(a) {
        this.chart = a;
        a.mapNavButtons = [];
      };
      B.prototype.update = function(e) {
        var d = this.chart,
            f = d.options.mapNavigation,
            h,
            c = function(a) {
              this.handler.call(d, a);
              w(a);
            },
            b = d.mapNavButtons;
        e && (f = d.options.mapNavigation = v(d.options.mapNavigation, e));
        for (; b.length; )
          b.pop().destroy();
        q(f.enableButtons, f.enabled) && !d.renderer.forExport && a.objectEach(f.buttons, function(a, e) {
          h = v(f.buttonOptions, a);
          a = d.renderer.button(h.text, 0, 0, c, void 0, void 0, void 0, 0, "zoomIn" === e ? "topbutton" : "bottombutton").addClass("highcharts-map-navigation").attr({
            width: h.width,
            height: h.height,
            title: d.options.lang[e],
            padding: h.padding,
            zIndex: 5
          }).add();
          a.handler = h.onclick;
          a.align(l(h, {
            width: a.width,
            height: 2 * a.height
          }), null, h.alignTo);
          A(a.element, "dblclick", w);
          b.push(a);
        });
        this.updateEvents(f);
      };
      B.prototype.updateEvents = function(a) {
        var e = this.chart;
        q(a.enableDoubleClickZoom, a.enabled) || a.enableDoubleClickZoomTo ? this.unbindDblClick = this.unbindDblClick || A(e.container, "dblclick", function(a) {
          e.pointer.onContainerDblClick(a);
        }) : this.unbindDblClick && (this.unbindDblClick = this.unbindDblClick());
        q(a.enableMouseWheelZoom, a.enabled) ? this.unbindMouseWheel = this.unbindMouseWheel || A(e.container, void 0 === d.onmousewheel ? "DOMMouseScroll" : "mousewheel", function(a) {
          e.pointer.onContainerMouseWheel(a);
          w(a);
          return !1;
        }) : this.unbindMouseWheel && (this.unbindMouseWheel = this.unbindMouseWheel());
      };
      l(f.prototype, {
        fitToBox: function(a, d) {
          t([["x", "width"], ["y", "height"]], function(e) {
            var f = e[0];
            e = e[1];
            a[f] + a[e] > d[f] + d[e] && (a[e] > d[e] ? (a[e] = d[e], a[f] = d[f]) : a[f] = d[f] + d[e] - a[e]);
            a[e] > d[e] && (a[e] = d[e]);
            a[f] < d[f] && (a[f] = d[f]);
          });
          return a;
        },
        mapZoom: function(a, d, f, h, c) {
          var b = this.xAxis[0],
              e = b.max - b.min,
              k = q(d, b.min + e / 2),
              n = e * a,
              e = this.yAxis[0],
              l = e.max - e.min,
              t = q(f, e.min + l / 2),
              l = l * a,
              k = this.fitToBox({
                x: k - n * (h ? (h - b.pos) / b.len : .5),
                y: t - l * (c ? (c - e.pos) / e.len : .5),
                width: n,
                height: l
              }, {
                x: b.dataMin,
                y: e.dataMin,
                width: b.dataMax - b.dataMin,
                height: e.dataMax - e.dataMin
              }),
              n = k.x <= b.dataMin && k.width >= b.dataMax - b.dataMin && k.y <= e.dataMin && k.height >= e.dataMax - e.dataMin;
          h && (b.fixTo = [h - b.pos, d]);
          c && (e.fixTo = [c - e.pos, f]);
          void 0 === a || n ? (b.setExtremes(void 0, void 0, !1), e.setExtremes(void 0, void 0, !1)) : (b.setExtremes(k.x, k.x + k.width, !1), e.setExtremes(k.y, k.y + k.height, !1));
          this.redraw();
        }
      });
      n(f.prototype, "render", function(a) {
        this.mapNavigation = new B(this);
        this.mapNavigation.update();
        a.call(this);
      });
    })(I);
    (function(a) {
      var w = a.extend,
          B = a.pick,
          A = a.Pointer;
      a = a.wrap;
      w(A.prototype, {
        onContainerDblClick: function(a) {
          var d = this.chart;
          a = this.normalize(a);
          d.options.mapNavigation.enableDoubleClickZoomTo ? d.pointer.inClass(a.target, "highcharts-tracker") && d.hoverPoint && d.hoverPoint.zoomTo() : d.isInsidePlot(a.chartX - d.plotLeft, a.chartY - d.plotTop) && d.mapZoom(.5, d.xAxis[0].toValue(a.chartX), d.yAxis[0].toValue(a.chartY), a.chartX, a.chartY);
        },
        onContainerMouseWheel: function(a) {
          var d = this.chart,
              f;
          a = this.normalize(a);
          f = a.detail || -(a.wheelDelta / 120);
          d.isInsidePlot(a.chartX - d.plotLeft, a.chartY - d.plotTop) && d.mapZoom(Math.pow(d.options.mapNavigation.mouseWheelSensitivity, f), d.xAxis[0].toValue(a.chartX), d.yAxis[0].toValue(a.chartY), a.chartX, a.chartY);
        }
      });
      a(A.prototype, "zoomOption", function(a) {
        var d = this.chart.options.mapNavigation;
        B(d.enableTouchZoom, d.enabled) && (this.chart.options.chart.pinchType = "xy");
        a.apply(this, [].slice.call(arguments, 1));
      });
      a(A.prototype, "pinchTranslate", function(a, d, t, l, v, q, n) {
        a.call(this, d, t, l, v, q, n);
        "map" === this.chart.options.chart.type && this.hasZoom && (a = l.scaleX > l.scaleY, this.pinchTranslateDirection(!a, d, t, l, v, q, n, a ? l.scaleX : l.scaleY));
      });
    })(I);
    (function(a) {
      var w = a.colorPointMixin,
          B = a.each,
          A = a.extend,
          f = a.isNumber,
          d = a.map,
          t = a.merge,
          l = a.noop,
          v = a.pick,
          q = a.isArray,
          n = a.Point,
          e = a.Series,
          k = a.seriesType,
          y = a.seriesTypes,
          h = a.splat,
          c = void 0 !== a.doc.documentElement.style.vectorEffect;
      k("map", "scatter", {
        allAreas: !0,
        animation: !1,
        nullColor: "#f7f7f7",
        borderColor: "#cccccc",
        borderWidth: 1,
        marker: null,
        stickyTracking: !1,
        joinBy: "hc-key",
        dataLabels: {
          formatter: function() {
            return this.point.value;
          },
          inside: !0,
          verticalAlign: "middle",
          crop: !1,
          overflow: !1,
          padding: 0
        },
        turboThreshold: 0,
        tooltip: {
          followPointer: !0,
          pointFormat: "{point.name}: {point.value}\x3cbr/\x3e"
        },
        states: {
          normal: {animation: !0},
          hover: {
            halo: null,
            brightness: .2
          },
          select: {color: "#cccccc"}
        }
      }, t(a.colorSeriesMixin, {
        type: "map",
        getExtremesFromAll: !0,
        useMapGeometry: !0,
        forceDL: !0,
        searchPoint: l,
        directTouch: !0,
        preserveAspectRatio: !0,
        pointArrayMap: ["value"],
        getBox: function(b) {
          var c = Number.MAX_VALUE,
              e = -c,
              d = c,
              h = -c,
              k = c,
              n = c,
              l = this.xAxis,
              q = this.yAxis,
              t;
          B(b || [], function(b) {
            if (b.path) {
              "string" === typeof b.path && (b.path = a.splitPath(b.path));
              var g = b.path || [],
                  l = g.length,
                  p = !1,
                  q = -c,
                  u = c,
                  m = -c,
                  y = c,
                  w = b.properties;
              if (!b._foundBox) {
                for (; l--; )
                  f(g[l]) && (p ? (q = Math.max(q, g[l]), u = Math.min(u, g[l])) : (m = Math.max(m, g[l]), y = Math.min(y, g[l])), p = !p);
                b._midX = u + (q - u) * v(b.middleX, w && w["hc-middle-x"], .5);
                b._midY = y + (m - y) * v(b.middleY, w && w["hc-middle-y"], .5);
                b._maxX = q;
                b._minX = u;
                b._maxY = m;
                b._minY = y;
                b.labelrank = v(b.labelrank, (q - u) * (m - y));
                b._foundBox = !0;
              }
              e = Math.max(e, b._maxX);
              d = Math.min(d, b._minX);
              h = Math.max(h, b._maxY);
              k = Math.min(k, b._minY);
              n = Math.min(b._maxX - b._minX, b._maxY - b._minY, n);
              t = !0;
            }
          });
          t && (this.minY = Math.min(k, v(this.minY, c)), this.maxY = Math.max(h, v(this.maxY, -c)), this.minX = Math.min(d, v(this.minX, c)), this.maxX = Math.max(e, v(this.maxX, -c)), l && void 0 === l.options.minRange && (l.minRange = Math.min(5 * n, (this.maxX - this.minX) / 5, l.minRange || c)), q && void 0 === q.options.minRange && (q.minRange = Math.min(5 * n, (this.maxY - this.minY) / 5, q.minRange || c)));
        },
        getExtremes: function() {
          e.prototype.getExtremes.call(this, this.valueData);
          this.chart.hasRendered && this.isDirtyData && this.getBox(this.options.data);
          this.valueMin = this.dataMin;
          this.valueMax = this.dataMax;
          this.dataMin = this.minY;
          this.dataMax = this.maxY;
        },
        translatePath: function(a) {
          var b = !1,
              c = this.xAxis,
              e = this.yAxis,
              d = c.min,
              h = c.transA,
              c = c.minPixelPadding,
              k = e.min,
              n = e.transA,
              e = e.minPixelPadding,
              l,
              q = [];
          if (a)
            for (l = a.length; l--; )
              f(a[l]) ? (q[l] = b ? (a[l] - d) * h + c : (a[l] - k) * n + e, b = !b) : q[l] = a[l];
          return q;
        },
        setData: function(b, c, k, n) {
          var g = this.options,
              l = this.chart.options.chart,
              p = l && l.map,
              v = g.mapData,
              u = g.joinBy,
              y = null === u,
              w = g.keys || this.pointArrayMap,
              A = [],
              F = {},
              r = this.chart.mapTransforms;
          !v && p && (v = "string" === typeof p ? a.maps[p] : p);
          y && (u = "_i");
          u = this.joinBy = h(u);
          u[1] || (u[1] = u[0]);
          b && B(b, function(a, c) {
            var e = 0;
            if (f(a))
              b[c] = {value: a};
            else if (q(a)) {
              b[c] = {};
              !g.keys && a.length > w.length && "string" === typeof a[0] && (b[c]["hc-key"] = a[0], ++e);
              for (var d = 0; d < w.length; ++d, ++e)
                w[d] && (b[c][w[d]] = a[e]);
            }
            y && (b[c]._i = c);
          });
          this.getBox(b);
          (this.chart.mapTransforms = r = l && l.mapTransforms || v && v["hc-transform"] || r) && a.objectEach(r, function(a) {
            a.rotation && (a.cosAngle = Math.cos(a.rotation), a.sinAngle = Math.sin(a.rotation));
          });
          if (v) {
            "FeatureCollection" === v.type && (this.mapTitle = v.title, v = a.geojson(v, this.type, this));
            this.mapData = v;
            this.mapMap = {};
            for (r = 0; r < v.length; r++)
              l = v[r], p = l.properties, l._i = r, u[0] && p && p[u[0]] && (l[u[0]] = p[u[0]]), F[l[u[0]]] = l;
            this.mapMap = F;
            b && u[1] && B(b, function(a) {
              F[a[u[1]]] && A.push(F[a[u[1]]]);
            });
            g.allAreas ? (this.getBox(v), b = b || [], u[1] && B(b, function(a) {
              A.push(a[u[1]]);
            }), A = "|" + d(A, function(a) {
              return a && a[u[0]];
            }).join("|") + "|", B(v, function(a) {
              u[0] && -1 !== A.indexOf("|" + a[u[0]] + "|") || (b.push(t(a, {value: null})), n = !1);
            })) : this.getBox(A);
          }
          e.prototype.setData.call(this, b, c, k, n);
        },
        drawGraph: l,
        drawDataLabels: l,
        doFullTranslate: function() {
          return this.isDirtyData || this.chart.isResizing || this.chart.renderer.isVML || !this.baseTrans;
        },
        translate: function() {
          var a = this,
              c = a.xAxis,
              e = a.yAxis,
              d = a.doFullTranslate();
          a.generatePoints();
          B(a.data, function(b) {
            b.plotX = c.toPixels(b._midX, !0);
            b.plotY = e.toPixels(b._midY, !0);
            d && (b.shapeType = "path", b.shapeArgs = {d: a.translatePath(b.path)});
          });
          a.translateColors();
        },
        pointAttribs: function(a, e) {
          a = this.colorAttribs(a);
          c ? a["vector-effect"] = "non-scaling-stroke" : a["stroke-width"] = "inherit";
          return a;
        },
        drawPoints: function() {
          var a = this,
              e = a.xAxis,
              d = a.yAxis,
              f = a.group,
              h = a.chart,
              k = h.renderer,
              n,
              l,
              q,
              t,
              v = this.baseTrans,
              w,
              A,
              r,
              x,
              I;
          a.transformGroup || (a.transformGroup = k.g().attr({
            scaleX: 1,
            scaleY: 1
          }).add(f), a.transformGroup.survive = !0);
          a.doFullTranslate() ? (a.group = a.transformGroup, y.column.prototype.drawPoints.apply(a), a.group = f, B(a.points, function(b) {
            b.graphic && (b.name && b.graphic.addClass("highcharts-name-" + b.name.replace(/ /g, "-").toLowerCase()), b.properties && b.properties["hc-key"] && b.graphic.addClass("highcharts-key-" + b.properties["hc-key"].toLowerCase()), b.graphic.css(a.pointAttribs(b, b.selected && "select")));
          }), this.baseTrans = {
            originX: e.min - e.minPixelPadding / e.transA,
            originY: d.min - d.minPixelPadding / d.transA + (d.reversed ? 0 : d.len / d.transA),
            transAX: e.transA,
            transAY: d.transA
          }, this.transformGroup.animate({
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1
          })) : (n = e.transA / v.transAX, l = d.transA / v.transAY, q = e.toPixels(v.originX, !0), t = d.toPixels(v.originY, !0), .99 < n && 1.01 > n && .99 < l && 1.01 > l && (l = n = 1, q = Math.round(q), t = Math.round(t)), w = this.transformGroup, h.renderer.globalAnimation ? (A = w.attr("translateX"), r = w.attr("translateY"), x = w.attr("scaleX"), I = w.attr("scaleY"), w.attr({animator: 0}).animate({animator: 1}, {step: function(a, b) {
              w.attr({
                translateX: A + (q - A) * b.pos,
                translateY: r + (t - r) * b.pos,
                scaleX: x + (n - x) * b.pos,
                scaleY: I + (l - I) * b.pos
              });
            }})) : w.attr({
            translateX: q,
            translateY: t,
            scaleX: n,
            scaleY: l
          }));
          c || a.group.element.setAttribute("stroke-width", a.options[a.pointAttrToOptions && a.pointAttrToOptions["stroke-width"] || "borderWidth"] / (n || 1));
          this.drawMapDataLabels();
        },
        drawMapDataLabels: function() {
          e.prototype.drawDataLabels.call(this);
          this.dataLabelsGroup && this.dataLabelsGroup.clip(this.chart.clipRect);
        },
        render: function() {
          var a = this,
              c = e.prototype.render;
          a.chart.renderer.isVML && 3E3 < a.data.length ? setTimeout(function() {
            c.call(a);
          }) : c.call(a);
        },
        animate: function(a) {
          var b = this.options.animation,
              c = this.group,
              e = this.xAxis,
              d = this.yAxis,
              f = e.pos,
              h = d.pos;
          this.chart.renderer.isSVG && (!0 === b && (b = {duration: 1E3}), a ? c.attr({
            translateX: f + e.len / 2,
            translateY: h + d.len / 2,
            scaleX: .001,
            scaleY: .001
          }) : (c.animate({
            translateX: f,
            translateY: h,
            scaleX: 1,
            scaleY: 1
          }, b), this.animate = null));
        },
        animateDrilldown: function(a) {
          var b = this.chart.plotBox,
              c = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
              e = c.bBox,
              d = this.chart.options.drilldown.animation;
          a || (a = Math.min(e.width / b.width, e.height / b.height), c.shapeArgs = {
            scaleX: a,
            scaleY: a,
            translateX: e.x,
            translateY: e.y
          }, B(this.points, function(a) {
            a.graphic && a.graphic.attr(c.shapeArgs).animate({
              scaleX: 1,
              scaleY: 1,
              translateX: 0,
              translateY: 0
            }, d);
          }), this.animate = null);
        },
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
        animateDrillupFrom: function(a) {
          y.column.prototype.animateDrillupFrom.call(this, a);
        },
        animateDrillupTo: function(a) {
          y.column.prototype.animateDrillupTo.call(this, a);
        }
      }), A({
        applyOptions: function(a, c) {
          a = n.prototype.applyOptions.call(this, a, c);
          c = this.series;
          var b = c.joinBy;
          c.mapData && ((b = void 0 !== a[b[1]] && c.mapMap[a[b[1]]]) ? (c.xyFromShape && (a.x = b._midX, a.y = b._midY), A(a, b)) : a.value = a.value || null);
          return a;
        },
        onMouseOver: function(a) {
          clearTimeout(this.colorInterval);
          if (null !== this.value || this.series.options.nullInteraction)
            n.prototype.onMouseOver.call(this, a);
          else
            this.series.onMouseOut(a);
        },
        zoomTo: function() {
          var a = this.series;
          a.xAxis.setExtremes(this._minX, this._maxX, !1);
          a.yAxis.setExtremes(this._minY, this._maxY, !1);
          a.chart.redraw();
        }
      }, w));
    })(I);
    (function(a) {
      var w = a.seriesType;
      w("mapline", "map", {}, {
        type: "mapline",
        colorProp: "stroke",
        drawLegendSymbol: a.seriesTypes.line.prototype.drawLegendSymbol
      });
    })(I);
    (function(a) {
      var w = a.merge,
          B = a.Point;
      a = a.seriesType;
      a("mappoint", "scatter", {dataLabels: {
          enabled: !0,
          formatter: function() {
            return this.point.name;
          },
          crop: !1,
          defer: !1,
          overflow: !1,
          style: {color: "#000000"}
        }}, {
        type: "mappoint",
        forceDL: !0
      }, {applyOptions: function(a, f) {
          a = void 0 !== a.lat && void 0 !== a.lon ? w(a, this.series.chart.fromLatLonToPoint(a)) : a;
          return B.prototype.applyOptions.call(this, a, f);
        }});
    })(I);
    (function(a) {
      var w = a.arrayMax,
          B = a.arrayMin,
          A = a.Axis,
          f = a.each,
          d = a.isNumber,
          t = a.noop,
          l = a.pick,
          v = a.pInt,
          q = a.Point,
          n = a.seriesType,
          e = a.seriesTypes;
      n("bubble", "scatter", {
        dataLabels: {
          formatter: function() {
            return this.point.z;
          },
          inside: !0,
          verticalAlign: "middle"
        },
        marker: {
          radius: null,
          states: {hover: {radiusPlus: 0}},
          symbol: "circle"
        },
        minSize: 8,
        maxSize: "20%",
        softThreshold: !1,
        states: {hover: {halo: {size: 5}}},
        tooltip: {pointFormat: "({point.x}, {point.y}), Size: {point.z}"},
        turboThreshold: 0,
        zThreshold: 0,
        zoneAxis: "z"
      }, {
        pointArrayMap: ["y", "z"],
        parallelArrays: ["x", "y", "z"],
        trackerGroups: ["group", "dataLabelsGroup"],
        specialGroup: "group",
        bubblePadding: !0,
        zoneAxis: "z",
        directTouch: !0,
        getRadii: function(a, e, d, c) {
          var b,
              g,
              f,
              h = this.zData,
              k = [],
              n = this.options,
              l = "width" !== n.sizeBy,
              q = n.zThreshold,
              t = e - a;
          g = 0;
          for (b = h.length; g < b; g++)
            f = h[g], n.sizeByAbsoluteValue && null !== f && (f = Math.abs(f - q), e = Math.max(e - q, Math.abs(a - q)), a = 0), null === f ? f = null : f < a ? f = d / 2 - 1 : (f = 0 < t ? (f - a) / t : .5, l && 0 <= f && (f = Math.sqrt(f)), f = Math.ceil(d + f * (c - d)) / 2), k.push(f);
          this.radii = k;
        },
        animate: function(a) {
          var e = this.options.animation;
          a || (f(this.points, function(a) {
            var c = a.graphic,
                b;
            c && c.width && (b = {
              x: c.x,
              y: c.y,
              width: c.width,
              height: c.height
            }, c.attr({
              x: a.plotX,
              y: a.plotY,
              width: 1,
              height: 1
            }), c.animate(b, e));
          }), this.animate = null);
        },
        translate: function() {
          var f,
              n = this.data,
              h,
              c,
              b = this.radii;
          e.scatter.prototype.translate.call(this);
          for (f = n.length; f--; )
            h = n[f], c = b ? b[f] : 0, d(c) && c >= this.minPxSize / 2 ? (h.marker = a.extend(h.marker, {
              radius: c,
              width: 2 * c,
              height: 2 * c
            }), h.dlBox = {
              x: h.plotX - c,
              y: h.plotY - c,
              width: 2 * c,
              height: 2 * c
            }) : h.shapeArgs = h.plotY = h.dlBox = void 0;
        },
        alignDataLabel: e.column.prototype.alignDataLabel,
        buildKDTree: t,
        applyZones: t
      }, {
        haloPath: function(a) {
          return q.prototype.haloPath.call(this, 0 === a ? 0 : (this.marker ? this.marker.radius || 0 : 0) + a);
        },
        ttBelow: !1
      });
      A.prototype.beforePadding = function() {
        var a = this,
            e = this.len,
            h = this.chart,
            c = 0,
            b = e,
            g = this.isXAxis,
            n = g ? "xData" : "yData",
            q = this.min,
            t = {},
            A = Math.min(h.plotWidth, h.plotHeight),
            H = Number.MAX_VALUE,
            z = -Number.MAX_VALUE,
            u = this.max - q,
            C = e / u,
            E = [];
        f(this.series, function(b) {
          var c = b.options;
          !b.bubblePadding || !b.visible && h.options.chart.ignoreHiddenSeries || (a.allowZoomOutside = !0, E.push(b), g && (f(["minSize", "maxSize"], function(a) {
            var b = c[a],
                e = /%$/.test(b),
                b = v(b);
            t[a] = e ? A * b / 100 : b;
          }), b.minPxSize = t.minSize, b.maxPxSize = Math.max(t.maxSize, t.minSize), b = b.zData, b.length && (H = l(c.zMin, Math.min(H, Math.max(B(b), !1 === c.displayNegative ? c.zThreshold : -Number.MAX_VALUE))), z = l(c.zMax, Math.max(z, w(b))))));
        });
        f(E, function(e) {
          var f = e[n],
              h = f.length,
              k;
          g && e.getRadii(H, z, e.minPxSize, e.maxPxSize);
          if (0 < u)
            for (; h--; )
              d(f[h]) && a.dataMin <= f[h] && f[h] <= a.dataMax && (k = e.radii[h], c = Math.min((f[h] - q) * C - k, c), b = Math.max((f[h] - q) * C + k, b));
        });
        E.length && 0 < u && !this.isLog && (b -= e, C *= (e + c - b) / e, f([["min", "userMin", c], ["max", "userMax", b]], function(b) {
          void 0 === l(a.options[b[0]], a[b[1]]) && (a[b[0]] += b[2] / C);
        }));
      };
    })(I);
    (function(a) {
      var w = a.merge,
          B = a.Point,
          A = a.seriesType,
          f = a.seriesTypes;
      f.bubble && A("mapbubble", "bubble", {
        animationLimit: 500,
        tooltip: {pointFormat: "{point.name}: {point.z}"}
      }, {
        xyFromShape: !0,
        type: "mapbubble",
        pointArrayMap: ["z"],
        getMapData: f.map.prototype.getMapData,
        getBox: f.map.prototype.getBox,
        setData: f.map.prototype.setData
      }, {
        applyOptions: function(a, t) {
          return a && void 0 !== a.lat && void 0 !== a.lon ? B.prototype.applyOptions.call(this, w(a, this.series.chart.fromLatLonToPoint(a)), t) : f.map.prototype.pointClass.prototype.applyOptions.call(this, a, t);
        },
        isValid: function() {
          return "number" === typeof this.z;
        },
        ttBelow: !1
      });
    })(I);
    (function(a) {
      var w = a.colorPointMixin,
          B = a.each,
          A = a.merge,
          f = a.noop,
          d = a.pick,
          t = a.Series,
          l = a.seriesType,
          v = a.seriesTypes;
      l("heatmap", "scatter", {
        animation: !1,
        borderWidth: 0,
        dataLabels: {
          formatter: function() {
            return this.point.value;
          },
          inside: !0,
          verticalAlign: "middle",
          crop: !1,
          overflow: !1,
          padding: 0
        },
        marker: null,
        pointRange: null,
        tooltip: {pointFormat: "{point.x}, {point.y}: {point.value}\x3cbr/\x3e"},
        states: {hover: {
            halo: !1,
            brightness: .2
          }}
      }, A(a.colorSeriesMixin, {
        pointArrayMap: ["y", "value"],
        hasPointSpecificOptions: !0,
        getExtremesFromAll: !0,
        directTouch: !0,
        init: function() {
          var a;
          v.scatter.prototype.init.apply(this, arguments);
          a = this.options;
          a.pointRange = d(a.pointRange, a.colsize || 1);
          this.yAxis.axisPointRange = a.rowsize || 1;
        },
        translate: function() {
          var a = this.options,
              f = this.xAxis,
              e = this.yAxis,
              k = a.pointPadding || 0,
              l = function(a, c, b) {
                return Math.min(Math.max(c, a), b);
              };
          this.generatePoints();
          B(this.points, function(h) {
            var c = (a.colsize || 1) / 2,
                b = (a.rowsize || 1) / 2,
                g = l(Math.round(f.len - f.translate(h.x - c, 0, 1, 0, 1)), -f.len, 2 * f.len),
                c = l(Math.round(f.len - f.translate(h.x + c, 0, 1, 0, 1)), -f.len, 2 * f.len),
                n = l(Math.round(e.translate(h.y - b, 0, 1, 0, 1)), -e.len, 2 * e.len),
                b = l(Math.round(e.translate(h.y + b, 0, 1, 0, 1)), -e.len, 2 * e.len),
                q = d(h.pointPadding, k);
            h.plotX = h.clientX = (g + c) / 2;
            h.plotY = (n + b) / 2;
            h.shapeType = "rect";
            h.shapeArgs = {
              x: Math.min(g, c) + q,
              y: Math.min(n, b) + q,
              width: Math.abs(c - g) - 2 * q,
              height: Math.abs(b - n) - 2 * q
            };
          });
          this.translateColors();
        },
        drawPoints: function() {
          v.column.prototype.drawPoints.call(this);
          B(this.points, function(a) {
            a.graphic.css(this.colorAttribs(a));
          }, this);
        },
        animate: f,
        getBox: f,
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
        alignDataLabel: v.column.prototype.alignDataLabel,
        getExtremes: function() {
          t.prototype.getExtremes.call(this, this.valueData);
          this.valueMin = this.dataMin;
          this.valueMax = this.dataMax;
          t.prototype.getExtremes.call(this);
        }
      }), a.extend({haloPath: function(a) {
          if (!a)
            return [];
          var d = this.shapeArgs;
          return ["M", d.x - a, d.y - a, "L", d.x - a, d.y + d.height + a, d.x + d.width + a, d.y + d.height + a, d.x + d.width + a, d.y - a, "Z"];
        }}, w));
    })(I);
    (function(a) {
      function w(a, d) {
        var e,
            f,
            n,
            h = !1,
            c = a.x,
            b = a.y;
        a = 0;
        for (e = d.length - 1; a < d.length; e = a++)
          f = d[a][1] > b, n = d[e][1] > b, f !== n && c < (d[e][0] - d[a][0]) * (b - d[a][1]) / (d[e][1] - d[a][1]) + d[a][0] && (h = !h);
        return h;
      }
      var B = a.Chart,
          A = a.each,
          f = a.extend,
          d = a.format,
          t = a.merge,
          l = a.win,
          v = a.wrap;
      B.prototype.transformFromLatLon = function(d, f) {
        if (void 0 === l.proj4)
          return a.error(21), {
            x: 0,
            y: null
          };
        d = l.proj4(f.crs, [d.lon, d.lat]);
        var e = f.cosAngle || f.rotation && Math.cos(f.rotation),
            k = f.sinAngle || f.rotation && Math.sin(f.rotation);
        d = f.rotation ? [d[0] * e + d[1] * k, -d[0] * k + d[1] * e] : d;
        return {
          x: ((d[0] - (f.xoffset || 0)) * (f.scale || 1) + (f.xpan || 0)) * (f.jsonres || 1) + (f.jsonmarginX || 0),
          y: (((f.yoffset || 0) - d[1]) * (f.scale || 1) + (f.ypan || 0)) * (f.jsonres || 1) - (f.jsonmarginY || 0)
        };
      };
      B.prototype.transformToLatLon = function(d, f) {
        if (void 0 === l.proj4)
          a.error(21);
        else {
          d = {
            x: ((d.x - (f.jsonmarginX || 0)) / (f.jsonres || 1) - (f.xpan || 0)) / (f.scale || 1) + (f.xoffset || 0),
            y: ((-d.y - (f.jsonmarginY || 0)) / (f.jsonres || 1) + (f.ypan || 0)) / (f.scale || 1) + (f.yoffset || 0)
          };
          var e = f.cosAngle || f.rotation && Math.cos(f.rotation),
              k = f.sinAngle || f.rotation && Math.sin(f.rotation);
          f = l.proj4(f.crs, "WGS84", f.rotation ? {
            x: d.x * e + d.y * -k,
            y: d.x * k + d.y * e
          } : d);
          return {
            lat: f.y,
            lon: f.x
          };
        }
      };
      B.prototype.fromPointToLatLon = function(d) {
        var f = this.mapTransforms,
            e;
        if (f) {
          for (e in f)
            if (f.hasOwnProperty(e) && f[e].hitZone && w({
              x: d.x,
              y: -d.y
            }, f[e].hitZone.coordinates[0]))
              return this.transformToLatLon(d, f[e]);
          return this.transformToLatLon(d, f["default"]);
        }
        a.error(22);
      };
      B.prototype.fromLatLonToPoint = function(d) {
        var f = this.mapTransforms,
            e,
            k;
        if (!f)
          return a.error(22), {
            x: 0,
            y: null
          };
        for (e in f)
          if (f.hasOwnProperty(e) && f[e].hitZone && (k = this.transformFromLatLon(d, f[e]), w({
            x: k.x,
            y: -k.y
          }, f[e].hitZone.coordinates[0])))
            return k;
        return this.transformFromLatLon(d, f["default"]);
      };
      a.geojson = function(a, l, e) {
        var k = [],
            n = [],
            h = function(a) {
              var b,
                  c = a.length;
              n.push("M");
              for (b = 0; b < c; b++)
                1 === b && n.push("L"), n.push(a[b][0], -a[b][1]);
            };
        l = l || "map";
        A(a.features, function(a) {
          var b = a.geometry,
              c = b.type,
              b = b.coordinates;
          a = a.properties;
          var e;
          n = [];
          "map" === l || "mapbubble" === l ? ("Polygon" === c ? (A(b, h), n.push("Z")) : "MultiPolygon" === c && (A(b, function(a) {
            A(a, h);
          }), n.push("Z")), n.length && (e = {path: n})) : "mapline" === l ? ("LineString" === c ? h(b) : "MultiLineString" === c && A(b, h), n.length && (e = {path: n})) : "mappoint" === l && "Point" === c && (e = {
            x: b[0],
            y: -b[1]
          });
          e && k.push(f(e, {
            name: a.name || a.NAME,
            properties: a
          }));
        });
        e && a.copyrightShort && (e.chart.mapCredits = d(e.chart.options.credits.mapText, {geojson: a}), e.chart.mapCreditsFull = d(e.chart.options.credits.mapTextFull, {geojson: a}));
        return k;
      };
      v(B.prototype, "addCredits", function(a, d) {
        d = t(!0, this.options.credits, d);
        this.mapCredits && (d.href = null);
        a.call(this, d);
        this.credits && this.mapCreditsFull && this.credits.attr({title: this.mapCreditsFull});
      });
    })(I);
    (function(a) {
      function w(a, d, f, h, c, b, g, l) {
        return ["M", a + c, d, "L", a + f - b, d, "C", a + f - b / 2, d, a + f, d + b / 2, a + f, d + b, "L", a + f, d + h - g, "C", a + f, d + h - g / 2, a + f - g / 2, d + h, a + f - g, d + h, "L", a + l, d + h, "C", a + l / 2, d + h, a, d + h - l / 2, a, d + h - l, "L", a, d + c, "C", a, d + c / 2, a + c / 2, d, a + c, d, "Z"];
      }
      var B = a.Chart,
          A = a.defaultOptions,
          f = a.each,
          d = a.extend,
          t = a.merge,
          l = a.pick,
          v = a.Renderer,
          q = a.SVGRenderer,
          n = a.VMLRenderer;
      d(A.lang, {
        zoomIn: "Zoom in",
        zoomOut: "Zoom out"
      });
      A.mapNavigation = {
        buttonOptions: {
          alignTo: "plotBox",
          align: "left",
          verticalAlign: "top",
          x: 0,
          width: 18,
          height: 18,
          padding: 5
        },
        buttons: {
          zoomIn: {
            onclick: function() {
              this.mapZoom(.5);
            },
            text: "+",
            y: 0
          },
          zoomOut: {
            onclick: function() {
              this.mapZoom(2);
            },
            text: "-",
            y: 28
          }
        },
        mouseWheelSensitivity: 1.1
      };
      a.splitPath = function(a) {
        var d;
        a = a.replace(/([A-Za-z])/g, " $1 ");
        a = a.replace(/^\s*/, "").replace(/\s*$/, "");
        a = a.split(/[ ,]+/);
        for (d = 0; d < a.length; d++)
          /[a-zA-Z]/.test(a[d]) || (a[d] = parseFloat(a[d]));
        return a;
      };
      a.maps = {};
      q.prototype.symbols.topbutton = function(a, d, f, h, c) {
        return w(a - 1, d - 1, f, h, c.r, c.r, 0, 0);
      };
      q.prototype.symbols.bottombutton = function(a, d, f, h, c) {
        return w(a - 1, d - 1, f, h, 0, 0, c.r, c.r);
      };
      v === n && f(["topbutton", "bottombutton"], function(a) {
        n.prototype.symbols[a] = q.prototype.symbols[a];
      });
      a.Map = a.mapChart = function(d, f, n) {
        var e = "string" === typeof d || d.nodeName,
            c = arguments[e ? 1 : 0],
            b = {
              endOnTick: !1,
              visible: !1,
              minPadding: 0,
              maxPadding: 0,
              startOnTick: !1
            },
            g,
            k = a.getOptions().credits;
        g = c.series;
        c.series = null;
        c = t({
          chart: {
            panning: "xy",
            type: "map"
          },
          credits: {
            mapText: l(k.mapText, ' \u00a9 \x3ca href\x3d"{geojson.copyrightUrl}"\x3e{geojson.copyrightShort}\x3c/a\x3e'),
            mapTextFull: l(k.mapTextFull, "{geojson.copyright}")
          },
          tooltip: {followTouchMove: !1},
          xAxis: b,
          yAxis: t(b, {reversed: !0})
        }, c, {chart: {
            inverted: !1,
            alignTicks: !1
          }});
        c.series = g;
        return e ? new B(d, c, n) : new B(c, f);
      };
    })(I);
    return I;
  });
})(require('process'));
