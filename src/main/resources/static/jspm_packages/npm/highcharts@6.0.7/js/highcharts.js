/* */ 
(function(process) {
  (function(R, K) {
    "object" === typeof module && module.exports ? module.exports = R.document ? K(R) : K : R.Highcharts = K(R);
  })("undefined" !== typeof window ? window : this, function(R) {
    var K = function() {
      var a = "undefined" === typeof R ? window : R,
          x = a.document,
          E = a.navigator && a.navigator.userAgent || "",
          C = x && x.createElementNS && !!x.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
          p = /(edge|msie|trident)/i.test(E) && !a.opera,
          m = -1 !== E.indexOf("Firefox"),
          e = -1 !== E.indexOf("Chrome"),
          k = m && 4 > parseInt(E.split("Firefox/")[1], 10);
      return a.Highcharts ? a.Highcharts.error(16, !0) : {
        product: "Highcharts",
        version: "6.0.7",
        deg2rad: 2 * Math.PI / 360,
        doc: x,
        hasBidiBug: k,
        hasTouch: x && void 0 !== x.documentElement.ontouchstart,
        isMS: p,
        isWebKit: -1 !== E.indexOf("AppleWebKit"),
        isFirefox: m,
        isChrome: e,
        isSafari: !e && -1 !== E.indexOf("Safari"),
        isTouchDevice: /(Mobile|Android|Windows Phone)/.test(E),
        SVG_NS: "http://www.w3.org/2000/svg",
        chartCount: 0,
        seriesTypes: {},
        symbolSizes: {},
        svg: C,
        win: a,
        marginNames: ["plotTop", "marginRight", "marginBottom", "plotLeft"],
        noop: function() {},
        charts: []
      };
    }();
    (function(a) {
      a.timers = [];
      var x = a.charts,
          E = a.doc,
          C = a.win;
      a.error = function(p, m) {
        p = a.isNumber(p) ? "Highcharts error #" + p + ": www.highcharts.com/errors/" + p : p;
        if (m)
          throw Error(p);
        C.console && console.log(p);
      };
      a.Fx = function(a, m, e) {
        this.options = m;
        this.elem = a;
        this.prop = e;
      };
      a.Fx.prototype = {
        dSetter: function() {
          var a = this.paths[0],
              m = this.paths[1],
              e = [],
              k = this.now,
              w = a.length,
              t;
          if (1 === k)
            e = this.toD;
          else if (w === m.length && 1 > k)
            for (; w--; )
              t = parseFloat(a[w]), e[w] = isNaN(t) ? m[w] : k * parseFloat(m[w] - t) + t;
          else
            e = m;
          this.elem.attr("d", e, null, !0);
        },
        update: function() {
          var a = this.elem,
              m = this.prop,
              e = this.now,
              k = this.options.step;
          if (this[m + "Setter"])
            this[m + "Setter"]();
          else
            a.attr ? a.element && a.attr(m, e, null, !0) : a.style[m] = e + this.unit;
          k && k.call(a, e, this);
        },
        run: function(p, m, e) {
          var k = this,
              w = k.options,
              t = function(a) {
                return t.stopped ? !1 : k.step(a);
              },
              n = C.requestAnimationFrame || function(a) {
                setTimeout(a, 13);
              },
              c = function() {
                for (var d = 0; d < a.timers.length; d++)
                  a.timers[d]() || a.timers.splice(d--, 1);
                a.timers.length && n(c);
              };
          p === m ? (delete w.curAnim[this.prop], w.complete && 0 === a.keys(w.curAnim).length && w.complete.call(this.elem)) : (this.startTime = +new Date, this.start = p, this.end = m, this.unit = e, this.now = this.start, this.pos = 0, t.elem = this.elem, t.prop = this.prop, t() && 1 === a.timers.push(t) && n(c));
        },
        step: function(p) {
          var m = +new Date,
              e,
              k = this.options,
              w = this.elem,
              t = k.complete,
              n = k.duration,
              c = k.curAnim;
          w.attr && !w.element ? p = !1 : p || m >= n + this.startTime ? (this.now = this.end, this.pos = 1, this.update(), e = c[this.prop] = !0, a.objectEach(c, function(a) {
            !0 !== a && (e = !1);
          }), e && t && t.call(w), p = !1) : (this.pos = k.easing((m - this.startTime) / n), this.now = this.start + (this.end - this.start) * this.pos, this.update(), p = !0);
          return p;
        },
        initPath: function(p, m, e) {
          function k(a) {
            var b,
                c;
            for (u = a.length; u--; )
              b = "M" === a[u] || "L" === a[u], c = /[a-zA-Z]/.test(a[u + 3]), b && c && a.splice(u + 1, 0, a[u + 1], a[u + 2], a[u + 1], a[u + 2]);
          }
          function w(a, b) {
            for (; a.length < f; ) {
              a[0] = b[f - a.length];
              var c = a.slice(0, h);
              [].splice.apply(a, [0, 0].concat(c));
              q && (c = a.slice(a.length - h), [].splice.apply(a, [a.length, 0].concat(c)), u--);
            }
            a[0] = "M";
          }
          function t(a, c) {
            for (var d = (f - a.length) / h; 0 < d && d--; )
              b = a.slice().splice(a.length / H - h, h * H), b[0] = c[f - h - d * h], A && (b[h - 6] = b[h - 2], b[h - 5] = b[h - 1]), [].splice.apply(a, [a.length / H, 0].concat(b)), q && d--;
          }
          m = m || "";
          var n,
              c = p.startX,
              d = p.endX,
              A = -1 < m.indexOf("C"),
              h = A ? 7 : 3,
              f,
              b,
              u;
          m = m.split(" ");
          e = e.slice();
          var q = p.isArea,
              H = q ? 2 : 1,
              M;
          A && (k(m), k(e));
          if (c && d) {
            for (u = 0; u < c.length; u++)
              if (c[u] === d[0]) {
                n = u;
                break;
              } else if (c[0] === d[d.length - c.length + u]) {
                n = u;
                M = !0;
                break;
              }
            void 0 === n && (m = []);
          }
          m.length && a.isNumber(n) && (f = e.length + n * H * h, M ? (w(m, e), t(e, m)) : (w(e, m), t(m, e)));
          return [m, e];
        }
      };
      a.Fx.prototype.fillSetter = a.Fx.prototype.strokeSetter = function() {
        this.elem.attr(this.prop, a.color(this.start).tweenTo(a.color(this.end), this.pos), null, !0);
      };
      a.merge = function() {
        var p,
            m = arguments,
            e,
            k = {},
            w = function(e, n) {
              "object" !== typeof e && (e = {});
              a.objectEach(n, function(c, d) {
                !a.isObject(c, !0) || a.isClass(c) || a.isDOMElement(c) ? e[d] = n[d] : e[d] = w(e[d] || {}, c);
              });
              return e;
            };
        !0 === m[0] && (k = m[1], m = Array.prototype.slice.call(m, 2));
        e = m.length;
        for (p = 0; p < e; p++)
          k = w(k, m[p]);
        return k;
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
      a.isObject = function(p, m) {
        return !!p && "object" === typeof p && (!m || !a.isArray(p));
      };
      a.isDOMElement = function(p) {
        return a.isObject(p) && "number" === typeof p.nodeType;
      };
      a.isClass = function(p) {
        var m = p && p.constructor;
        return !(!a.isObject(p, !0) || a.isDOMElement(p) || !m || !m.name || "Object" === m.name);
      };
      a.isNumber = function(a) {
        return "number" === typeof a && !isNaN(a) && Infinity > a && -Infinity < a;
      };
      a.erase = function(a, m) {
        for (var e = a.length; e--; )
          if (a[e] === m) {
            a.splice(e, 1);
            break;
          }
      };
      a.defined = function(a) {
        return void 0 !== a && null !== a;
      };
      a.attr = function(p, m, e) {
        var k;
        a.isString(m) ? a.defined(e) ? p.setAttribute(m, e) : p && p.getAttribute && (k = p.getAttribute(m)) : a.defined(m) && a.isObject(m) && a.objectEach(m, function(a, e) {
          p.setAttribute(e, a);
        });
        return k;
      };
      a.splat = function(p) {
        return a.isArray(p) ? p : [p];
      };
      a.syncTimeout = function(a, m, e) {
        if (m)
          return setTimeout(a, m, e);
        a.call(0, e);
      };
      a.extend = function(a, m) {
        var e;
        a || (a = {});
        for (e in m)
          a[e] = m[e];
        return a;
      };
      a.pick = function() {
        var a = arguments,
            m,
            e,
            k = a.length;
        for (m = 0; m < k; m++)
          if (e = a[m], void 0 !== e && null !== e)
            return e;
      };
      a.css = function(p, m) {
        a.isMS && !a.svg && m && void 0 !== m.opacity && (m.filter = "alpha(opacity\x3d" + 100 * m.opacity + ")");
        a.extend(p.style, m);
      };
      a.createElement = function(p, m, e, k, w) {
        p = E.createElement(p);
        var t = a.css;
        m && a.extend(p, m);
        w && t(p, {
          padding: 0,
          border: "none",
          margin: 0
        });
        e && t(p, e);
        k && k.appendChild(p);
        return p;
      };
      a.extendClass = function(p, m) {
        var e = function() {};
        e.prototype = new p;
        a.extend(e.prototype, m);
        return e;
      };
      a.pad = function(a, m, e) {
        return Array((m || 2) + 1 - String(a).length).join(e || 0) + a;
      };
      a.relativeLength = function(a, m, e) {
        return /%$/.test(a) ? m * parseFloat(a) / 100 + (e || 0) : parseFloat(a);
      };
      a.wrap = function(a, m, e) {
        var k = a[m];
        a[m] = function() {
          var a = Array.prototype.slice.call(arguments),
              m = arguments,
              n = this;
          n.proceed = function() {
            k.apply(n, arguments.length ? arguments : m);
          };
          a.unshift(k);
          a = e.apply(this, a);
          n.proceed = null;
          return a;
        };
      };
      a.formatSingle = function(p, m, e) {
        var k = /\.([0-9])/,
            w = a.defaultOptions.lang;
        /f$/.test(p) ? (e = (e = p.match(k)) ? e[1] : -1, null !== m && (m = a.numberFormat(m, e, w.decimalPoint, -1 < p.indexOf(",") ? w.thousandsSep : ""))) : m = (e || a.time).dateFormat(p, m);
        return m;
      };
      a.format = function(p, m, e) {
        for (var k = "{",
            w = !1,
            t,
            n,
            c,
            d,
            A = [],
            h; p; ) {
          k = p.indexOf(k);
          if (-1 === k)
            break;
          t = p.slice(0, k);
          if (w) {
            t = t.split(":");
            n = t.shift().split(".");
            d = n.length;
            h = m;
            for (c = 0; c < d; c++)
              h && (h = h[n[c]]);
            t.length && (h = a.formatSingle(t.join(":"), h, e));
            A.push(h);
          } else
            A.push(t);
          p = p.slice(k + 1);
          k = (w = !w) ? "}" : "{";
        }
        A.push(p);
        return A.join("");
      };
      a.getMagnitude = function(a) {
        return Math.pow(10, Math.floor(Math.log(a) / Math.LN10));
      };
      a.normalizeTickInterval = function(p, m, e, k, w) {
        var t,
            n = p;
        e = a.pick(e, 1);
        t = p / e;
        m || (m = w ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === k && (1 === e ? m = a.grep(m, function(a) {
          return 0 === a % 1;
        }) : .1 >= e && (m = [1 / e])));
        for (k = 0; k < m.length && !(n = m[k], w && n * e >= p || !w && t <= (m[k] + (m[k + 1] || m[k])) / 2); k++)
          ;
        return n = a.correctFloat(n * e, -Math.round(Math.log(.001) / Math.LN10));
      };
      a.stableSort = function(a, m) {
        var e = a.length,
            k,
            w;
        for (w = 0; w < e; w++)
          a[w].safeI = w;
        a.sort(function(a, n) {
          k = m(a, n);
          return 0 === k ? a.safeI - n.safeI : k;
        });
        for (w = 0; w < e; w++)
          delete a[w].safeI;
      };
      a.arrayMin = function(a) {
        for (var m = a.length,
            e = a[0]; m--; )
          a[m] < e && (e = a[m]);
        return e;
      };
      a.arrayMax = function(a) {
        for (var m = a.length,
            e = a[0]; m--; )
          a[m] > e && (e = a[m]);
        return e;
      };
      a.destroyObjectProperties = function(p, m) {
        a.objectEach(p, function(a, k) {
          a && a !== m && a.destroy && a.destroy();
          delete p[k];
        });
      };
      a.discardElement = function(p) {
        var m = a.garbageBin;
        m || (m = a.createElement("div"));
        p && m.appendChild(p);
        m.innerHTML = "";
      };
      a.correctFloat = function(a, m) {
        return parseFloat(a.toPrecision(m || 14));
      };
      a.setAnimation = function(p, m) {
        m.renderer.globalAnimation = a.pick(p, m.options.chart.animation, !0);
      };
      a.animObject = function(p) {
        return a.isObject(p) ? a.merge(p) : {duration: p ? 500 : 0};
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
      a.numberFormat = function(p, m, e, k) {
        p = +p || 0;
        m = +m;
        var w = a.defaultOptions.lang,
            t = (p.toString().split(".")[1] || "").split("e")[0].length,
            n,
            c,
            d = p.toString().split("e");
        -1 === m ? m = Math.min(t, 20) : a.isNumber(m) ? m && d[1] && 0 > d[1] && (n = m + +d[1], 0 <= n ? (d[0] = (+d[0]).toExponential(n).split("e")[0], m = n) : (d[0] = d[0].split(".")[0] || 0, p = 20 > m ? (d[0] * Math.pow(10, d[1])).toFixed(m) : 0, d[1] = 0)) : m = 2;
        c = (Math.abs(d[1] ? d[0] : p) + Math.pow(10, -Math.max(m, t) - 1)).toFixed(m);
        t = String(a.pInt(c));
        n = 3 < t.length ? t.length % 3 : 0;
        e = a.pick(e, w.decimalPoint);
        k = a.pick(k, w.thousandsSep);
        p = (0 > p ? "-" : "") + (n ? t.substr(0, n) + k : "");
        p += t.substr(n).replace(/(\d{3})(?=\d)/g, "$1" + k);
        m && (p += e + c.slice(-m));
        d[1] && 0 !== +p && (p += "e" + d[1]);
        return p;
      };
      Math.easeInOutSine = function(a) {
        return -.5 * (Math.cos(Math.PI * a) - 1);
      };
      a.getStyle = function(p, m, e) {
        if ("width" === m)
          return Math.min(p.offsetWidth, p.scrollWidth) - a.getStyle(p, "padding-left") - a.getStyle(p, "padding-right");
        if ("height" === m)
          return Math.min(p.offsetHeight, p.scrollHeight) - a.getStyle(p, "padding-top") - a.getStyle(p, "padding-bottom");
        C.getComputedStyle || a.error(27, !0);
        if (p = C.getComputedStyle(p, void 0))
          p = p.getPropertyValue(m), a.pick(e, "opacity" !== m) && (p = a.pInt(p));
        return p;
      };
      a.inArray = function(p, m) {
        return (a.indexOfPolyfill || Array.prototype.indexOf).call(m, p);
      };
      a.grep = function(p, m) {
        return (a.filterPolyfill || Array.prototype.filter).call(p, m);
      };
      a.find = Array.prototype.find ? function(a, m) {
        return a.find(m);
      } : function(a, m) {
        var e,
            k = a.length;
        for (e = 0; e < k; e++)
          if (m(a[e], e))
            return a[e];
      };
      a.map = function(a, m) {
        for (var e = [],
            k = 0,
            w = a.length; k < w; k++)
          e[k] = m.call(a[k], a[k], k, a);
        return e;
      };
      a.keys = function(p) {
        return (a.keysPolyfill || Object.keys).call(void 0, p);
      };
      a.reduce = function(p, m, e) {
        return (a.reducePolyfill || Array.prototype.reduce).call(p, m, e);
      };
      a.offset = function(a) {
        var m = E.documentElement;
        a = a.parentElement ? a.getBoundingClientRect() : {
          top: 0,
          left: 0
        };
        return {
          top: a.top + (C.pageYOffset || m.scrollTop) - (m.clientTop || 0),
          left: a.left + (C.pageXOffset || m.scrollLeft) - (m.clientLeft || 0)
        };
      };
      a.stop = function(p, m) {
        for (var e = a.timers.length; e--; )
          a.timers[e].elem !== p || m && m !== a.timers[e].prop || (a.timers[e].stopped = !0);
      };
      a.each = function(p, m, e) {
        return (a.forEachPolyfill || Array.prototype.forEach).call(p, m, e);
      };
      a.objectEach = function(a, m, e) {
        for (var k in a)
          a.hasOwnProperty(k) && m.call(e, a[k], k, a);
      };
      a.isPrototype = function(p) {
        return p === a.Axis.prototype || p === a.Chart.prototype || p === a.Point.prototype || p === a.Series.prototype || p === a.Tick.prototype;
      };
      a.addEvent = function(p, m, e) {
        var k,
            w = p.addEventListener || a.addEventListenerPolyfill;
        k = a.isPrototype(p) ? "protoEvents" : "hcEvents";
        k = p[k] = p[k] || {};
        w && w.call(p, m, e, !1);
        k[m] || (k[m] = []);
        k[m].push(e);
        return function() {
          a.removeEvent(p, m, e);
        };
      };
      a.removeEvent = function(p, m, e) {
        function k(c, d) {
          var n = p.removeEventListener || a.removeEventListenerPolyfill;
          n && n.call(p, c, d, !1);
        }
        function w(c) {
          var d,
              n;
          p.nodeName && (m ? (d = {}, d[m] = !0) : d = c, a.objectEach(d, function(a, f) {
            if (c[f])
              for (n = c[f].length; n--; )
                k(f, c[f][n]);
          }));
        }
        var t,
            n;
        a.each(["protoEvents", "hcEvents"], function(c) {
          var d = p[c];
          d && (m ? (t = d[m] || [], e ? (n = a.inArray(e, t), -1 < n && (t.splice(n, 1), d[m] = t), k(m, e)) : (w(d), d[m] = [])) : (w(d), p[c] = {}));
        });
      };
      a.fireEvent = function(p, m, e, k) {
        var w,
            t,
            n,
            c,
            d;
        e = e || {};
        E.createEvent && (p.dispatchEvent || p.fireEvent) ? (w = E.createEvent("Events"), w.initEvent(m, !0, !0), a.extend(w, e), p.dispatchEvent ? p.dispatchEvent(w) : p.fireEvent(m, w)) : a.each(["protoEvents", "hcEvents"], function(k) {
          if (p[k])
            for (t = p[k][m] || [], n = t.length, e.target || a.extend(e, {
              preventDefault: function() {
                e.defaultPrevented = !0;
              },
              target: p,
              type: m
            }), c = 0; c < n; c++)
              (d = t[c]) && !1 === d.call(p, e) && e.preventDefault();
        });
        k && !e.defaultPrevented && k(e);
      };
      a.animate = function(p, m, e) {
        var k,
            w = "",
            t,
            n,
            c;
        a.isObject(e) || (c = arguments, e = {
          duration: c[2],
          easing: c[3],
          complete: c[4]
        });
        a.isNumber(e.duration) || (e.duration = 400);
        e.easing = "function" === typeof e.easing ? e.easing : Math[e.easing] || Math.easeInOutSine;
        e.curAnim = a.merge(m);
        a.objectEach(m, function(c, A) {
          a.stop(p, A);
          n = new a.Fx(p, e, A);
          t = null;
          "d" === A ? (n.paths = n.initPath(p, p.d, m.d), n.toD = m.d, k = 0, t = 1) : p.attr ? k = p.attr(A) : (k = parseFloat(a.getStyle(p, A)) || 0, "opacity" !== A && (w = "px"));
          t || (t = c);
          t && t.match && t.match("px") && (t = t.replace(/px/g, ""));
          n.run(k, t, w);
        });
      };
      a.seriesType = function(p, m, e, k, w) {
        var t = a.getOptions(),
            n = a.seriesTypes;
        t.plotOptions[p] = a.merge(t.plotOptions[m], e);
        n[p] = a.extendClass(n[m] || function() {}, k);
        n[p].prototype.type = p;
        w && (n[p].prototype.pointClass = a.extendClass(a.Point, w));
        return n[p];
      };
      a.uniqueKey = function() {
        var a = Math.random().toString(36).substring(2, 9),
            m = 0;
        return function() {
          return "highcharts-" + a + "-" + m++;
        };
      }();
      C.jQuery && (C.jQuery.fn.highcharts = function() {
        var p = [].slice.call(arguments);
        if (this[0])
          return p[0] ? (new (a[a.isString(p[0]) ? p.shift() : "Chart"])(this[0], p[0], p[1]), this) : x[a.attr(this[0], "data-highcharts-chart")];
      });
    })(K);
    (function(a) {
      var x = a.each,
          E = a.isNumber,
          C = a.map,
          p = a.merge,
          m = a.pInt;
      a.Color = function(e) {
        if (!(this instanceof a.Color))
          return new a.Color(e);
        this.init(e);
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
        init: function(e) {
          var k,
              m,
              t,
              n;
          if ((this.input = e = this.names[e && e.toLowerCase ? e.toLowerCase() : ""] || e) && e.stops)
            this.stops = C(e.stops, function(c) {
              return new a.Color(c[1]);
            });
          else if (e && e.charAt && "#" === e.charAt() && (k = e.length, e = parseInt(e.substr(1), 16), 7 === k ? m = [(e & 16711680) >> 16, (e & 65280) >> 8, e & 255, 1] : 4 === k && (m = [(e & 3840) >> 4 | (e & 3840) >> 8, (e & 240) >> 4 | e & 240, (e & 15) << 4 | e & 15, 1])), !m)
            for (t = this.parsers.length; t-- && !m; )
              n = this.parsers[t], (k = n.regex.exec(e)) && (m = n.parse(k));
          this.rgba = m || [];
        },
        get: function(a) {
          var e = this.input,
              m = this.rgba,
              t;
          this.stops ? (t = p(e), t.stops = [].concat(t.stops), x(this.stops, function(n, c) {
            t.stops[c] = [t.stops[c][0], n.get(a)];
          })) : t = m && E(m[0]) ? "rgb" === a || !a && 1 === m[3] ? "rgb(" + m[0] + "," + m[1] + "," + m[2] + ")" : "a" === a ? m[3] : "rgba(" + m.join(",") + ")" : e;
          return t;
        },
        brighten: function(a) {
          var e,
              w = this.rgba;
          if (this.stops)
            x(this.stops, function(e) {
              e.brighten(a);
            });
          else if (E(a) && 0 !== a)
            for (e = 0; 3 > e; e++)
              w[e] += m(255 * a), 0 > w[e] && (w[e] = 0), 255 < w[e] && (w[e] = 255);
          return this;
        },
        setOpacity: function(a) {
          this.rgba[3] = a;
          return this;
        },
        tweenTo: function(a, k) {
          var e = this.rgba,
              m = a.rgba;
          m.length && e && e.length ? (a = 1 !== m[3] || 1 !== e[3], k = (a ? "rgba(" : "rgb(") + Math.round(m[0] + (e[0] - m[0]) * (1 - k)) + "," + Math.round(m[1] + (e[1] - m[1]) * (1 - k)) + "," + Math.round(m[2] + (e[2] - m[2]) * (1 - k)) + (a ? "," + (m[3] + (e[3] - m[3]) * (1 - k)) : "") + ")") : k = a.input || "none";
          return k;
        }
      };
      a.color = function(e) {
        return new a.Color(e);
      };
    })(K);
    (function(a) {
      var x,
          E,
          C = a.addEvent,
          p = a.animate,
          m = a.attr,
          e = a.charts,
          k = a.color,
          w = a.css,
          t = a.createElement,
          n = a.defined,
          c = a.deg2rad,
          d = a.destroyObjectProperties,
          A = a.doc,
          h = a.each,
          f = a.extend,
          b = a.erase,
          u = a.grep,
          q = a.hasTouch,
          H = a.inArray,
          M = a.isArray,
          D = a.isFirefox,
          F = a.isMS,
          z = a.isObject,
          r = a.isString,
          y = a.isWebKit,
          G = a.merge,
          B = a.noop,
          I = a.objectEach,
          g = a.pick,
          v = a.pInt,
          L = a.removeEvent,
          l = a.splat,
          J = a.stop,
          S = a.svg,
          Q = a.SVG_NS,
          P = a.symbolSizes,
          O = a.win;
      x = a.SVGElement = function() {
        return this;
      };
      f(x.prototype, {
        opacity: 1,
        SVG_NS: Q,
        textProps: "direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline".split(" "),
        init: function(a, g) {
          this.element = "span" === g ? t(g) : A.createElementNS(this.SVG_NS, g);
          this.renderer = a;
        },
        animate: function(b, l, v) {
          l = a.animObject(g(l, this.renderer.globalAnimation, !0));
          0 !== l.duration ? (v && (l.complete = v), p(this, b, l)) : (this.attr(b, null, v), l.step && l.step.call(this));
          return this;
        },
        colorGradient: function(g, b, l) {
          var N = this.renderer,
              v,
              c,
              f,
              r,
              d,
              q,
              u,
              e,
              J,
              L,
              y = [],
              T;
          g.radialGradient ? c = "radialGradient" : g.linearGradient && (c = "linearGradient");
          c && (f = g[c], d = N.gradients, u = g.stops, L = l.radialReference, M(f) && (g[c] = f = {
            x1: f[0],
            y1: f[1],
            x2: f[2],
            y2: f[3],
            gradientUnits: "userSpaceOnUse"
          }), "radialGradient" === c && L && !n(f.gradientUnits) && (r = f, f = G(f, N.getRadialAttr(L, r), {gradientUnits: "userSpaceOnUse"})), I(f, function(a, g) {
            "id" !== g && y.push(g, a);
          }), I(u, function(a) {
            y.push(a);
          }), y = y.join(","), d[y] ? L = d[y].attr("id") : (f.id = L = a.uniqueKey(), d[y] = q = N.createElement(c).attr(f).add(N.defs), q.radAttr = r, q.stops = [], h(u, function(g) {
            0 === g[1].indexOf("rgba") ? (v = a.color(g[1]), e = v.get("rgb"), J = v.get("a")) : (e = g[1], J = 1);
            g = N.createElement("stop").attr({
              offset: g[0],
              "stop-color": e,
              "stop-opacity": J
            }).add(q);
            q.stops.push(g);
          })), T = "url(" + N.url + "#" + L + ")", l.setAttribute(b, T), l.gradient = y, g.toString = function() {
            return T;
          });
        },
        applyTextOutline: function(g) {
          var l = this.element,
              N,
              v,
              c,
              f,
              r;
          -1 !== g.indexOf("contrast") && (g = g.replace(/contrast/g, this.renderer.getContrast(l.style.fill)));
          g = g.split(" ");
          v = g[g.length - 1];
          if ((c = g[0]) && "none" !== c && a.svg) {
            this.fakeTS = !0;
            g = [].slice.call(l.getElementsByTagName("tspan"));
            this.ySetter = this.xSetter;
            c = c.replace(/(^[\d\.]+)(.*?)$/g, function(a, g, l) {
              return 2 * g + l;
            });
            for (r = g.length; r--; )
              N = g[r], "highcharts-text-outline" === N.getAttribute("class") && b(g, l.removeChild(N));
            f = l.firstChild;
            h(g, function(a, g) {
              0 === g && (a.setAttribute("x", l.getAttribute("x")), g = l.getAttribute("y"), a.setAttribute("y", g || 0), null === g && l.setAttribute("y", 0));
              a = a.cloneNode(1);
              m(a, {
                "class": "highcharts-text-outline",
                fill: v,
                stroke: v,
                "stroke-width": c,
                "stroke-linejoin": "round"
              });
              l.insertBefore(a, f);
            });
          }
        },
        attr: function(a, g, l, b) {
          var v,
              N = this.element,
              c,
              f = this,
              h,
              r;
          "string" === typeof a && void 0 !== g && (v = a, a = {}, a[v] = g);
          "string" === typeof a ? f = (this[a + "Getter"] || this._defaultGetter).call(this, a, N) : (I(a, function(g, l) {
            h = !1;
            b || J(this, l);
            this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)$/.test(l) && (c || (this.symbolAttr(a), c = !0), h = !0);
            !this.rotation || "x" !== l && "y" !== l || (this.doTransform = !0);
            h || (r = this[l + "Setter"] || this._defaultSetter, r.call(this, g, l, N));
          }, this), this.afterSetters());
          l && l.call(this);
          return f;
        },
        afterSetters: function() {
          this.doTransform && (this.updateTransform(), this.doTransform = !1);
        },
        addClass: function(a, g) {
          var l = this.attr("class") || "";
          -1 === l.indexOf(a) && (g || (a = (l + (l ? " " : "") + a).replace("  ", " ")), this.attr("class", a));
          return this;
        },
        hasClass: function(a) {
          return -1 !== H(a, (this.attr("class") || "").split(" "));
        },
        removeClass: function(a) {
          return this.attr("class", (this.attr("class") || "").replace(a, ""));
        },
        symbolAttr: function(a) {
          var l = this;
          h("x y r start end width height innerR anchorX anchorY".split(" "), function(b) {
            l[b] = g(a[b], l[b]);
          });
          l.attr({d: l.renderer.symbols[l.symbolName](l.x, l.y, l.width, l.height, l)});
        },
        clip: function(a) {
          return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : "none");
        },
        crisp: function(a, g) {
          var l;
          g = g || a.strokeWidth || 0;
          l = Math.round(g) % 2 / 2;
          a.x = Math.floor(a.x || this.x || 0) + l;
          a.y = Math.floor(a.y || this.y || 0) + l;
          a.width = Math.floor((a.width || this.width || 0) - 2 * l);
          a.height = Math.floor((a.height || this.height || 0) - 2 * l);
          n(a.strokeWidth) && (a.strokeWidth = g);
          return a;
        },
        css: function(a) {
          var g = this.styles,
              l = {},
              b = this.element,
              c,
              N = "",
              h,
              r = !g,
              d = ["textOutline", "textOverflow", "width"];
          a && a.color && (a.fill = a.color);
          g && I(a, function(a, b) {
            a !== g[b] && (l[b] = a, r = !0);
          });
          r && (g && (a = f(g, l)), c = this.textWidth = a && a.width && "auto" !== a.width && "text" === b.nodeName.toLowerCase() && v(a.width), this.styles = a, c && !S && this.renderer.forExport && delete a.width, b.namespaceURI === this.SVG_NS ? (h = function(a, g) {
            return "-" + g.toLowerCase();
          }, I(a, function(a, g) {
            -1 === H(g, d) && (N += g.replace(/([A-Z])/g, h) + ":" + a + ";");
          }), N && m(b, "style", N)) : w(b, a), this.added && ("text" === this.element.nodeName && this.renderer.buildText(this), a && a.textOutline && this.applyTextOutline(a.textOutline)));
          return this;
        },
        getStyle: function(a) {
          return O.getComputedStyle(this.element || this, "").getPropertyValue(a);
        },
        strokeWidth: function() {
          var a = this.getStyle("stroke-width"),
              g;
          a.indexOf("px") === a.length - 2 ? a = v(a) : (g = A.createElementNS(Q, "rect"), m(g, {
            width: a,
            "stroke-width": 0
          }), this.element.parentNode.appendChild(g), a = g.getBBox().width, g.parentNode.removeChild(g));
          return a;
        },
        on: function(a, g) {
          var l = this,
              b = l.element;
          q && "click" === a ? (b.ontouchstart = function(a) {
            l.touchEventFired = Date.now();
            a.preventDefault();
            g.call(b, a);
          }, b.onclick = function(a) {
            (-1 === O.navigator.userAgent.indexOf("Android") || 1100 < Date.now() - (l.touchEventFired || 0)) && g.call(b, a);
          }) : b["on" + a] = g;
          return this;
        },
        setRadialReference: function(a) {
          var g = this.renderer.gradients[this.element.gradient];
          this.element.radialReference = a;
          g && g.radAttr && g.animate(this.renderer.getRadialAttr(a, g.radAttr));
          return this;
        },
        translate: function(a, g) {
          return this.attr({
            translateX: a,
            translateY: g
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
              b = this.scaleX,
              c = this.scaleY,
              v = this.inverted,
              f = this.rotation,
              h = this.matrix,
              r = this.element;
          v && (a += this.width, l += this.height);
          a = ["translate(" + a + "," + l + ")"];
          n(h) && a.push("matrix(" + h.join(",") + ")");
          v ? a.push("rotate(90) scale(-1,1)") : f && a.push("rotate(" + f + " " + g(this.rotationOriginX, r.getAttribute("x"), 0) + " " + g(this.rotationOriginY, r.getAttribute("y") || 0) + ")");
          (n(b) || n(c)) && a.push("scale(" + g(b, 1) + " " + g(c, 1) + ")");
          a.length && r.setAttribute("transform", a.join(" "));
        },
        toFront: function() {
          var a = this.element;
          a.parentNode.appendChild(a);
          return this;
        },
        align: function(a, l, c) {
          var v,
              f,
              h,
              d,
              N = {};
          f = this.renderer;
          h = f.alignedObjects;
          var q,
              u;
          if (a) {
            if (this.alignOptions = a, this.alignByTranslate = l, !c || r(c))
              this.alignTo = v = c || "renderer", b(h, this), h.push(this), c = null;
          } else
            a = this.alignOptions, l = this.alignByTranslate, v = this.alignTo;
          c = g(c, f[v], f);
          v = a.align;
          f = a.verticalAlign;
          h = (c.x || 0) + (a.x || 0);
          d = (c.y || 0) + (a.y || 0);
          "right" === v ? q = 1 : "center" === v && (q = 2);
          q && (h += (c.width - (a.width || 0)) / q);
          N[l ? "translateX" : "x"] = Math.round(h);
          "bottom" === f ? u = 1 : "middle" === f && (u = 2);
          u && (d += (c.height - (a.height || 0)) / u);
          N[l ? "translateY" : "y"] = Math.round(d);
          this[this.placed ? "animate" : "attr"](N);
          this.placed = !0;
          this.alignAttr = N;
          return this;
        },
        getBBox: function(a, l) {
          var b,
              v = this.renderer,
              r,
              d = this.element,
              N = this.styles,
              q,
              u = this.textStr,
              e,
              J = v.cache,
              L = v.cacheKeys,
              y;
          l = g(l, this.rotation);
          r = l * c;
          q = d && x.prototype.getStyle.call(d, "font-size");
          n(u) && (y = u.toString(), -1 === y.indexOf("\x3c") && (y = y.replace(/[0-9]/g, "0")), y += ["", l || 0, q, N && N.width, N && N.textOverflow].join());
          y && !a && (b = J[y]);
          if (!b) {
            if (d.namespaceURI === this.SVG_NS || v.forExport) {
              try {
                (e = this.fakeTS && function(a) {
                  h(d.querySelectorAll(".highcharts-text-outline"), function(g) {
                    g.style.display = a;
                  });
                }) && e("none"), b = d.getBBox ? f({}, d.getBBox()) : {
                  width: d.offsetWidth,
                  height: d.offsetHeight
                }, e && e("");
              } catch (V) {}
              if (!b || 0 > b.width)
                b = {
                  width: 0,
                  height: 0
                };
            } else
              b = this.htmlGetBBox();
            v.isSVG && (a = b.width, v = b.height, N && "11px" === N.fontSize && 17 === Math.round(v) && (b.height = v = 14), l && (b.width = Math.abs(v * Math.sin(r)) + Math.abs(a * Math.cos(r)), b.height = Math.abs(v * Math.cos(r)) + Math.abs(a * Math.sin(r))));
            if (y && 0 < b.height) {
              for (; 250 < L.length; )
                delete J[L.shift()];
              J[y] || L.push(y);
              J[y] = b;
            }
          }
          return b;
        },
        show: function(a) {
          return this.attr({visibility: a ? "inherit" : "visible"});
        },
        hide: function() {
          return this.attr({visibility: "hidden"});
        },
        fadeOut: function(a) {
          var g = this;
          g.animate({opacity: 0}, {
            duration: a || 150,
            complete: function() {
              g.attr({y: -9999});
            }
          });
        },
        add: function(a) {
          var g = this.renderer,
              l = this.element,
              b;
          a && (this.parentGroup = a);
          this.parentInverted = a && a.inverted;
          void 0 !== this.textStr && g.buildText(this);
          this.added = !0;
          if (!a || a.handleZ || this.zIndex)
            b = this.zIndexSetter();
          b || (a ? a.element : g.box).appendChild(l);
          if (this.onAdd)
            this.onAdd();
          return this;
        },
        safeRemoveChild: function(a) {
          var g = a.parentNode;
          g && g.removeChild(a);
        },
        destroy: function() {
          var a = this,
              g = a.element || {},
              l = a.renderer.isSVG && "SPAN" === g.nodeName && a.parentGroup,
              v = g.ownerSVGElement,
              c = a.clipPath;
          g.onclick = g.onmouseout = g.onmouseover = g.onmousemove = g.point = null;
          J(a);
          c && v && (h(v.querySelectorAll("[clip-path],[CLIP-PATH]"), function(a) {
            var g = a.getAttribute("clip-path"),
                l = c.element.id;
            (-1 < g.indexOf("(#" + l + ")") || -1 < g.indexOf('("#' + l + '")')) && a.removeAttribute("clip-path");
          }), a.clipPath = c.destroy());
          if (a.stops) {
            for (v = 0; v < a.stops.length; v++)
              a.stops[v] = a.stops[v].destroy();
            a.stops = null;
          }
          for (a.safeRemoveChild(g); l && l.div && 0 === l.div.childNodes.length; )
            g = l.parentGroup, a.safeRemoveChild(l.div), delete l.div, l = g;
          a.alignTo && b(a.renderer.alignedObjects, a);
          I(a, function(g, l) {
            delete a[l];
          });
          return null;
        },
        xGetter: function(a) {
          "circle" === this.element.nodeName && ("x" === a ? a = "cx" : "y" === a && (a = "cy"));
          return this._defaultGetter(a);
        },
        _defaultGetter: function(a) {
          a = g(this[a + "Value"], this[a], this.element ? this.element.getAttribute(a) : null, 0);
          /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a));
          return a;
        },
        dSetter: function(a, g, l) {
          a && a.join && (a = a.join(" "));
          /(NaN| {2}|^$)/.test(a) && (a = "M 0 0");
          this[g] !== a && (l.setAttribute(g, a), this[g] = a);
        },
        alignSetter: function(a) {
          this.alignValue = a;
          this.element.setAttribute("text-anchor", {
            left: "start",
            center: "middle",
            right: "end"
          }[a]);
        },
        opacitySetter: function(a, g, l) {
          this[g] = a;
          l.setAttribute(g, a);
        },
        titleSetter: function(a) {
          var l = this.element.getElementsByTagName("title")[0];
          l || (l = A.createElementNS(this.SVG_NS, "title"), this.element.appendChild(l));
          l.firstChild && l.removeChild(l.firstChild);
          l.appendChild(A.createTextNode(String(g(a), "").replace(/<[^>]*>/g, "").replace(/&lt;/g, "\x3c").replace(/&gt;/g, "\x3e")));
        },
        textSetter: function(a) {
          a !== this.textStr && (delete this.bBox, this.textStr = a, this.added && this.renderer.buildText(this));
        },
        fillSetter: function(a, g, l) {
          "string" === typeof a ? l.setAttribute(g, a) : a && this.colorGradient(a, g, l);
        },
        visibilitySetter: function(a, g, l) {
          "inherit" === a ? l.removeAttribute(g) : this[g] !== a && l.setAttribute(g, a);
          this[g] = a;
        },
        zIndexSetter: function(a, g) {
          var l = this.renderer,
              b = this.parentGroup,
              c = (b || l).element || l.box,
              f,
              h = this.element,
              r,
              d,
              l = c === l.box;
          f = this.added;
          var q;
          n(a) && (h.zIndex = a, a = +a, this[g] === a && (f = !1), this[g] = a);
          if (f) {
            (a = this.zIndex) && b && (b.handleZ = !0);
            g = c.childNodes;
            for (q = g.length - 1; 0 <= q && !r; q--)
              if (b = g[q], f = b.zIndex, d = !n(f), b !== h)
                if (0 > a && d && !l && !q)
                  c.insertBefore(h, g[q]), r = !0;
                else if (v(f) <= a || d && (!n(a) || 0 <= a))
                  c.insertBefore(h, g[q + 1] || null), r = !0;
            r || (c.insertBefore(h, g[l ? 3 : 0] || null), r = !0);
          }
          return r;
        },
        _defaultSetter: function(a, g, l) {
          l.setAttribute(g, a);
        }
      });
      x.prototype.yGetter = x.prototype.xGetter;
      x.prototype.translateXSetter = x.prototype.translateYSetter = x.prototype.rotationSetter = x.prototype.verticalAlignSetter = x.prototype.rotationOriginXSetter = x.prototype.rotationOriginYSetter = x.prototype.scaleXSetter = x.prototype.scaleYSetter = x.prototype.matrixSetter = function(a, g) {
        this[g] = a;
        this.doTransform = !0;
      };
      E = a.SVGRenderer = function() {
        this.init.apply(this, arguments);
      };
      f(E.prototype, {
        Element: x,
        SVG_NS: Q,
        init: function(a, g, l, b, v, c) {
          var f;
          b = this.createElement("svg").attr({
            version: "1.1",
            "class": "highcharts-root"
          });
          f = b.element;
          a.appendChild(f);
          m(a, "dir", "ltr");
          -1 === a.innerHTML.indexOf("xmlns") && m(f, "xmlns", this.SVG_NS);
          this.isSVG = !0;
          this.box = f;
          this.boxWrapper = b;
          this.alignedObjects = [];
          this.url = (D || y) && A.getElementsByTagName("base").length ? O.location.href.replace(/#.*?$/, "").replace(/<[^>]*>/g, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "";
          this.createElement("desc").add().element.appendChild(A.createTextNode("Created with Highcharts 6.0.7"));
          this.defs = this.createElement("defs").add();
          this.allowHTML = c;
          this.forExport = v;
          this.gradients = {};
          this.cache = {};
          this.cacheKeys = [];
          this.imgCount = 0;
          this.setSize(g, l, !1);
          var h;
          D && a.getBoundingClientRect && (g = function() {
            w(a, {
              left: 0,
              top: 0
            });
            h = a.getBoundingClientRect();
            w(a, {
              left: Math.ceil(h.left) - h.left + "px",
              top: Math.ceil(h.top) - h.top + "px"
            });
          }, g(), this.unSubPixelFix = C(O, "resize", g));
        },
        definition: function(a) {
          function g(a, v) {
            var c;
            h(l(a), function(a) {
              var l = b.createElement(a.tagName),
                  f = {};
              I(a, function(a, g) {
                "tagName" !== g && "children" !== g && "textContent" !== g && (f[g] = a);
              });
              l.attr(f);
              l.add(v || b.defs);
              a.textContent && l.element.appendChild(A.createTextNode(a.textContent));
              g(a.children || [], l);
              c = l;
            });
            return c;
          }
          var b = this;
          return g(a);
        },
        isHidden: function() {
          return !this.boxWrapper.getBBox().width;
        },
        destroy: function() {
          var a = this.defs;
          this.box = null;
          this.boxWrapper = this.boxWrapper.destroy();
          d(this.gradients || {});
          this.gradients = null;
          a && (this.defs = a.destroy());
          this.unSubPixelFix && this.unSubPixelFix();
          return this.alignedObjects = null;
        },
        createElement: function(a) {
          var g = new this.Element;
          g.init(this, a);
          return g;
        },
        draw: B,
        getRadialAttr: function(a, g) {
          return {
            cx: a[0] - a[2] / 2 + g.cx * a[2],
            cy: a[1] - a[2] / 2 + g.cy * a[2],
            r: g.r * a[2]
          };
        },
        getSpanWidth: function(a) {
          return a.getBBox(!0).width;
        },
        applyEllipsis: function(a, g, l, b) {
          var v = a.rotation,
              c = l,
              f,
              h = 0,
              r = l.length,
              d = function(a) {
                g.removeChild(g.firstChild);
                a && g.appendChild(A.createTextNode(a));
              },
              q;
          a.rotation = 0;
          c = this.getSpanWidth(a, g);
          if (q = c > b) {
            for (; h <= r; )
              f = Math.ceil((h + r) / 2), c = l.substring(0, f) + "\u2026", d(c), c = this.getSpanWidth(a, g), h === r ? h = r + 1 : c > b ? r = f - 1 : h = f;
            0 === r && d("");
          }
          a.rotation = v;
          return q;
        },
        escapes: {
          "\x26": "\x26amp;",
          "\x3c": "\x26lt;",
          "\x3e": "\x26gt;",
          "'": "\x26#39;",
          '"': "\x26quot;"
        },
        buildText: function(a) {
          var l = a.element,
              b = this,
              c = b.forExport,
              f = g(a.textStr, "").toString(),
              r = -1 !== f.indexOf("\x3c"),
              d = l.childNodes,
              q,
              n,
              e,
              J,
              y = m(l, "x"),
              L = a.styles,
              G = a.textWidth,
              k = L && L.lineHeight,
              B = L && L.textOutline,
              N = L && "ellipsis" === L.textOverflow,
              F = L && "nowrap" === L.whiteSpace,
              z,
              D = d.length,
              t = G && !a.added && this.box,
              p = function(a) {
                return k ? v(k) : b.fontMetrics(void 0, a.getAttribute("style") ? a : l).h;
              },
              M = function(a, g) {
                I(b.escapes, function(l, b) {
                  g && -1 !== H(l, g) || (a = a.toString().replace(new RegExp(l, "g"), b));
                });
                return a;
              },
              L = [f, N, F, k, B, L && L.fontSize, G].join();
          if (L !== a.textCache) {
            for (a.textCache = L; D--; )
              l.removeChild(d[D]);
            r || B || N || G || -1 !== f.indexOf(" ") ? (q = /<.*class="([^"]+)".*>/, n = /<.*style="([^"]+)".*>/, e = /<.*href="([^"]+)".*>/, t && t.appendChild(l), f = r ? f.replace(/<(b|strong)>/g, '\x3cspan class\x3d"highcharts-strong"\x3e').replace(/<(i|em)>/g, '\x3cspan class\x3d"highcharts-emphasized"\x3e').replace(/<a/g, "\x3cspan").replace(/<\/(b|strong|i|em|a)>/g, "\x3c/span\x3e").split(/<br.*?>/g) : [f], f = u(f, function(a) {
              return "" !== a;
            }), h(f, function(g, v) {
              var f,
                  r = 0;
              g = g.replace(/^\s+|\s+$/g, "").replace(/<span/g, "|||\x3cspan").replace(/<\/span>/g, "\x3c/span\x3e|||");
              f = g.split("|||");
              h(f, function(g) {
                if ("" !== g || 1 === f.length) {
                  var h = {},
                      d = A.createElementNS(b.SVG_NS, "tspan"),
                      u,
                      L;
                  q.test(g) && (u = g.match(q)[1], m(d, "class", u));
                  n.test(g) && (L = g.match(n)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), m(d, "style", L));
                  e.test(g) && !c && (m(d, "onclick", 'location.href\x3d"' + g.match(e)[1] + '"'), m(d, "class", "highcharts-anchor"));
                  g = M(g.replace(/<[a-zA-Z\/](.|\n)*?>/g, "") || " ");
                  if (" " !== g) {
                    d.appendChild(A.createTextNode(g));
                    r ? h.dx = 0 : v && null !== y && (h.x = y);
                    m(d, h);
                    l.appendChild(d);
                    !r && z && (!S && c && w(d, {display: "block"}), m(d, "dy", p(d)));
                    if (G) {
                      h = g.replace(/([^\^])-/g, "$1- ").split(" ");
                      u = 1 < f.length || v || 1 < h.length && !F;
                      var k = [],
                          B,
                          D = p(d),
                          H = a.rotation;
                      for (N && (J = b.applyEllipsis(a, d, g, G)); !N && u && (h.length || k.length); )
                        a.rotation = 0, B = b.getSpanWidth(a, d), g = B > G, void 0 === J && (J = g), g && 1 !== h.length ? (d.removeChild(d.firstChild), k.unshift(h.pop())) : (h = k, k = [], h.length && !F && (d = A.createElementNS(Q, "tspan"), m(d, {
                          dy: D,
                          x: y
                        }), L && m(d, "style", L), l.appendChild(d)), B > G && (G = B)), h.length && d.appendChild(A.createTextNode(h.join(" ").replace(/- /g, "-")));
                      a.rotation = H;
                    }
                    r++;
                  }
                }
              });
              z = z || l.childNodes.length;
            }), J && a.attr("title", M(a.textStr, ["\x26lt;", "\x26gt;"])), t && t.removeChild(l), B && a.applyTextOutline && a.applyTextOutline(B)) : l.appendChild(A.createTextNode(M(f)));
          }
        },
        getContrast: function(a) {
          a = k(a).rgba;
          return 510 < a[0] + a[1] + a[2] ? "#000000" : "#FFFFFF";
        },
        button: function(a, g, l, b, c, v, f, h, d) {
          var r = this.label(a, g, l, d, null, null, null, null, "button"),
              q = 0;
          r.attr(G({
            padding: 8,
            r: 2
          }, c));
          C(r.element, F ? "mouseover" : "mouseenter", function() {
            3 !== q && r.setState(1);
          });
          C(r.element, F ? "mouseout" : "mouseleave", function() {
            3 !== q && r.setState(q);
          });
          r.setState = function(a) {
            1 !== a && (r.state = q = a);
            r.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][a || 0]);
          };
          return r.on("click", function(a) {
            3 !== q && b.call(r, a);
          });
        },
        crispLine: function(a, g) {
          a[1] === a[4] && (a[1] = a[4] = Math.round(a[1]) - g % 2 / 2);
          a[2] === a[5] && (a[2] = a[5] = Math.round(a[2]) + g % 2 / 2);
          return a;
        },
        path: function(a) {
          var g = {};
          M(a) ? g.d = a : z(a) && f(g, a);
          return this.createElement("path").attr(g);
        },
        circle: function(a, g, l) {
          a = z(a) ? a : {
            x: a,
            y: g,
            r: l
          };
          g = this.createElement("circle");
          g.xSetter = g.ySetter = function(a, g, l) {
            l.setAttribute("c" + g, a);
          };
          return g.attr(a);
        },
        arc: function(a, g, l, b, c, v) {
          z(a) ? (b = a, g = b.y, l = b.r, a = b.x) : b = {
            innerR: b,
            start: c,
            end: v
          };
          a = this.symbol("arc", a, g, l, l, b);
          a.r = l;
          return a;
        },
        rect: function(a, g, l, b, c, v) {
          c = z(a) ? a.r : c;
          v = this.createElement("rect");
          a = z(a) ? a : void 0 === a ? {} : {
            x: a,
            y: g,
            width: Math.max(l, 0),
            height: Math.max(b, 0)
          };
          c && (a.r = c);
          v.rSetter = function(a, g, l) {
            m(l, {
              rx: a,
              ry: a
            });
          };
          return v.attr(a);
        },
        setSize: function(a, l, b) {
          var c = this.alignedObjects,
              v = c.length;
          this.width = a;
          this.height = l;
          for (this.boxWrapper.animate({
            width: a,
            height: l
          }, {
            step: function() {
              this.attr({viewBox: "0 0 " + this.attr("width") + " " + this.attr("height")});
            },
            duration: g(b, !0) ? void 0 : 0
          }); v--; )
            c[v].align();
        },
        g: function(a) {
          var g = this.createElement("g");
          return a ? g.attr({"class": "highcharts-" + a}) : g;
        },
        image: function(a, g, l, b, c) {
          var v = {preserveAspectRatio: "none"};
          1 < arguments.length && f(v, {
            x: g,
            y: l,
            width: b,
            height: c
          });
          v = this.createElement("image").attr(v);
          v.element.setAttributeNS ? v.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", a) : v.element.setAttribute("hc-svg-href", a);
          return v;
        },
        symbol: function(a, l, b, c, v, r) {
          var d = this,
              q,
              u = /^url\((.*?)\)$/,
              L = u.test(a),
              J = !L && (this.symbols[a] ? a : "circle"),
              y = J && this.symbols[J],
              G = n(l) && y && y.call(this.symbols, Math.round(l), Math.round(b), c, v, r),
              k,
              B;
          y ? (q = this.path(G), f(q, {
            symbolName: J,
            x: l,
            y: b,
            width: c,
            height: v
          }), r && f(q, r)) : L && (k = a.match(u)[1], q = this.image(k), q.imgwidth = g(P[k] && P[k].width, r && r.width), q.imgheight = g(P[k] && P[k].height, r && r.height), B = function() {
            q.attr({
              width: q.width,
              height: q.height
            });
          }, h(["width", "height"], function(a) {
            q[a + "Setter"] = function(a, g) {
              var l = {},
                  b = this["img" + g],
                  c = "width" === g ? "translateX" : "translateY";
              this[g] = a;
              n(b) && (this.element && this.element.setAttribute(g, b), this.alignByTranslate || (l[c] = ((this[g] || 0) - b) / 2, this.attr(l)));
            };
          }), n(l) && q.attr({
            x: l,
            y: b
          }), q.isImg = !0, n(q.imgwidth) && n(q.imgheight) ? B() : (q.attr({
            width: 0,
            height: 0
          }), t("img", {
            onload: function() {
              var a = e[d.chartIndex];
              0 === this.width && (w(this, {
                position: "absolute",
                top: "-999em"
              }), A.body.appendChild(this));
              P[k] = {
                width: this.width,
                height: this.height
              };
              q.imgwidth = this.width;
              q.imgheight = this.height;
              q.element && B();
              this.parentNode && this.parentNode.removeChild(this);
              d.imgCount--;
              if (!d.imgCount && a && a.onload)
                a.onload();
            },
            src: k
          }), this.imgCount++));
          return q;
        },
        symbols: {
          circle: function(a, g, l, b) {
            return this.arc(a + l / 2, g + b / 2, l / 2, b / 2, {
              start: 0,
              end: 2 * Math.PI,
              open: !1
            });
          },
          square: function(a, g, l, b) {
            return ["M", a, g, "L", a + l, g, a + l, g + b, a, g + b, "Z"];
          },
          triangle: function(a, g, l, b) {
            return ["M", a + l / 2, g, "L", a + l, g + b, a, g + b, "Z"];
          },
          "triangle-down": function(a, g, l, b) {
            return ["M", a, g, "L", a + l, g, a + l / 2, g + b, "Z"];
          },
          diamond: function(a, g, l, b) {
            return ["M", a + l / 2, g, "L", a + l, g + b / 2, a + l / 2, g + b, a, g + b / 2, "Z"];
          },
          arc: function(a, l, b, c, v) {
            var f = v.start,
                h = v.r || b,
                r = v.r || c || b,
                d = v.end - .001;
            b = v.innerR;
            c = g(v.open, .001 > Math.abs(v.end - v.start - 2 * Math.PI));
            var q = Math.cos(f),
                u = Math.sin(f),
                L = Math.cos(d),
                d = Math.sin(d);
            v = .001 > v.end - f - Math.PI ? 0 : 1;
            h = ["M", a + h * q, l + r * u, "A", h, r, 0, v, 1, a + h * L, l + r * d];
            n(b) && h.push(c ? "M" : "L", a + b * L, l + b * d, "A", b, b, 0, v, 0, a + b * q, l + b * u);
            h.push(c ? "" : "Z");
            return h;
          },
          callout: function(a, g, l, b, v) {
            var c = Math.min(v && v.r || 0, l, b),
                f = c + 6,
                h = v && v.anchorX;
            v = v && v.anchorY;
            var r;
            r = ["M", a + c, g, "L", a + l - c, g, "C", a + l, g, a + l, g, a + l, g + c, "L", a + l, g + b - c, "C", a + l, g + b, a + l, g + b, a + l - c, g + b, "L", a + c, g + b, "C", a, g + b, a, g + b, a, g + b - c, "L", a, g + c, "C", a, g, a, g, a + c, g];
            h && h > l ? v > g + f && v < g + b - f ? r.splice(13, 3, "L", a + l, v - 6, a + l + 6, v, a + l, v + 6, a + l, g + b - c) : r.splice(13, 3, "L", a + l, b / 2, h, v, a + l, b / 2, a + l, g + b - c) : h && 0 > h ? v > g + f && v < g + b - f ? r.splice(33, 3, "L", a, v + 6, a - 6, v, a, v - 6, a, g + c) : r.splice(33, 3, "L", a, b / 2, h, v, a, b / 2, a, g + c) : v && v > b && h > a + f && h < a + l - f ? r.splice(23, 3, "L", h + 6, g + b, h, g + b + 6, h - 6, g + b, a + c, g + b) : v && 0 > v && h > a + f && h < a + l - f && r.splice(3, 3, "L", h - 6, g, h, g - 6, h + 6, g, l - c, g);
            return r;
          }
        },
        clipRect: function(g, l, b, v) {
          var c = a.uniqueKey(),
              f = this.createElement("clipPath").attr({id: c}).add(this.defs);
          g = this.rect(g, l, b, v, 0).add(f);
          g.id = c;
          g.clipPath = f;
          g.count = 0;
          return g;
        },
        text: function(a, g, l, b) {
          var v = {};
          if (b && (this.allowHTML || !this.forExport))
            return this.html(a, g, l);
          v.x = Math.round(g || 0);
          l && (v.y = Math.round(l));
          if (a || 0 === a)
            v.text = a;
          a = this.createElement("text").attr(v);
          b || (a.xSetter = function(a, g, l) {
            var b = l.getElementsByTagName("tspan"),
                v,
                c = l.getAttribute(g),
                f;
            for (f = 0; f < b.length; f++)
              v = b[f], v.getAttribute(g) === c && v.setAttribute(g, a);
            l.setAttribute(g, a);
          });
          return a;
        },
        fontMetrics: function(a, g) {
          a = g && x.prototype.getStyle.call(g, "font-size");
          a = /px/.test(a) ? v(a) : /em/.test(a) ? parseFloat(a) * (g ? this.fontMetrics(null, g.parentNode).f : 16) : 12;
          g = 24 > a ? a + 3 : Math.round(1.2 * a);
          return {
            h: g,
            b: Math.round(.8 * g),
            f: a
          };
        },
        rotCorr: function(a, g, l) {
          var b = a;
          g && l && (b = Math.max(b * Math.cos(g * c), 4));
          return {
            x: -a / 3 * Math.sin(g * c),
            y: b
          };
        },
        label: function(g, l, b, v, c, r, d, q, u) {
          var e = this,
              J = e.g("button" !== u && "label"),
              y = J.text = e.text("", 0, 0, d).attr({zIndex: 1}),
              k,
              B,
              m = 0,
              F = 3,
              z = 0,
              D,
              S,
              H,
              A,
              t,
              Q = {},
              w,
              I = /^url\((.*?)\)$/.test(v),
              p = I,
              M,
              N,
              P,
              O;
          u && J.addClass("highcharts-" + u);
          p = !0;
          M = function() {
            return k.strokeWidth() % 2 / 2;
          };
          N = function() {
            var a = y.element.style,
                g = {};
            B = (void 0 === D || void 0 === S || t) && n(y.textStr) && y.getBBox();
            J.width = (D || B.width || 0) + 2 * F + z;
            J.height = (S || B.height || 0) + 2 * F;
            w = F + e.fontMetrics(a && a.fontSize, y).b;
            p && (k || (J.box = k = e.symbols[v] || I ? e.symbol(v) : e.rect(), k.addClass(("button" === u ? "" : "highcharts-label-box") + (u ? " highcharts-" + u + "-box" : "")), k.add(J), a = M(), g.x = a, g.y = (q ? -w : 0) + a), g.width = Math.round(J.width), g.height = Math.round(J.height), k.attr(f(g, Q)), Q = {});
          };
          P = function() {
            var a = z + F,
                g;
            g = q ? 0 : w;
            n(D) && B && ("center" === t || "right" === t) && (a += {
              center: .5,
              right: 1
            }[t] * (D - B.width));
            if (a !== y.x || g !== y.y)
              y.attr("x", a), void 0 !== g && y.attr("y", g);
            y.x = a;
            y.y = g;
          };
          O = function(a, g) {
            k ? k.attr(a, g) : Q[a] = g;
          };
          J.onAdd = function() {
            y.add(J);
            J.attr({
              text: g || 0 === g ? g : "",
              x: l,
              y: b
            });
            k && n(c) && J.attr({
              anchorX: c,
              anchorY: r
            });
          };
          J.widthSetter = function(g) {
            D = a.isNumber(g) ? g : null;
          };
          J.heightSetter = function(a) {
            S = a;
          };
          J["text-alignSetter"] = function(a) {
            t = a;
          };
          J.paddingSetter = function(a) {
            n(a) && a !== F && (F = J.padding = a, P());
          };
          J.paddingLeftSetter = function(a) {
            n(a) && a !== z && (z = a, P());
          };
          J.alignSetter = function(a) {
            a = {
              left: 0,
              center: .5,
              right: 1
            }[a];
            a !== m && (m = a, B && J.attr({x: H}));
          };
          J.textSetter = function(a) {
            void 0 !== a && y.textSetter(a);
            N();
            P();
          };
          J["stroke-widthSetter"] = function(a, g) {
            a && (p = !0);
            this["stroke-width"] = a;
            O(g, a);
          };
          J.rSetter = function(a, g) {
            O(g, a);
          };
          J.anchorXSetter = function(a, g) {
            c = J.anchorX = a;
            O(g, Math.round(a) - M() - H);
          };
          J.anchorYSetter = function(a, g) {
            r = J.anchorY = a;
            O(g, a - A);
          };
          J.xSetter = function(a) {
            J.x = a;
            m && (a -= m * ((D || B.width) + 2 * F));
            H = Math.round(a);
            J.attr("translateX", H);
          };
          J.ySetter = function(a) {
            A = J.y = Math.round(a);
            J.attr("translateY", A);
          };
          var T = J.css;
          return f(J, {
            css: function(a) {
              if (a) {
                var g = {};
                a = G(a);
                h(J.textProps, function(l) {
                  void 0 !== a[l] && (g[l] = a[l], delete a[l]);
                });
                y.css(g);
              }
              return T.call(J, a);
            },
            getBBox: function() {
              return {
                width: B.width + 2 * F,
                height: B.height + 2 * F,
                x: B.x - F,
                y: B.y - F
              };
            },
            destroy: function() {
              L(J.element, "mouseenter");
              L(J.element, "mouseleave");
              y && (y = y.destroy());
              k && (k = k.destroy());
              x.prototype.destroy.call(J);
              J = e = N = P = O = null;
            }
          });
        }
      });
      a.Renderer = E;
    })(K);
    (function(a) {
      var x = a.attr,
          E = a.createElement,
          C = a.css,
          p = a.defined,
          m = a.each,
          e = a.extend,
          k = a.isFirefox,
          w = a.isMS,
          t = a.isWebKit,
          n = a.pick,
          c = a.pInt,
          d = a.SVGRenderer,
          A = a.win,
          h = a.wrap;
      e(a.SVGElement.prototype, {
        htmlCss: function(a) {
          var b = this.element;
          if (b = a && "SPAN" === b.tagName && a.width)
            delete a.width, this.textWidth = b, this.updateTransform();
          a && "ellipsis" === a.textOverflow && (a.whiteSpace = "nowrap", a.overflow = "hidden");
          this.styles = e(this.styles, a);
          C(this.element, a);
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
                h = this.x || 0,
                d = this.y || 0,
                n = this.textAlign || "left",
                e = {
                  left: 0,
                  center: .5,
                  right: 1
                }[n],
                k = this.styles,
                F = k && k.whiteSpace;
            C(b, {
              marginLeft: this.translateX || 0,
              marginTop: this.translateY || 0
            });
            this.inverted && m(b.childNodes, function(c) {
              a.invertChild(c, b);
            });
            if ("SPAN" === b.tagName) {
              var k = this.rotation,
                  z = this.textWidth && c(this.textWidth),
                  r = [k, n, b.innerHTML, this.textWidth, this.textAlign].join(),
                  y;
              (y = z !== this.oldTextWidth) && !(y = z > this.oldTextWidth) && ((y = this.textPxLength) || (C(b, {
                width: "",
                whiteSpace: F || "nowrap"
              }), y = b.offsetWidth), y = y > z);
              y && /[ \-]/.test(b.textContent || b.innerText) && (C(b, {
                width: z + "px",
                display: "block",
                whiteSpace: F || "normal"
              }), this.oldTextWidth = z);
              r !== this.cTT && (F = a.fontMetrics(b.style.fontSize).b, p(k) && k !== (this.oldRotation || 0) && this.setSpanRotation(k, e, F), this.getSpanCorrection(this.textPxLength || b.offsetWidth, F, e, k, n));
              C(b, {
                left: h + (this.xCorr || 0) + "px",
                top: d + (this.yCorr || 0) + "px"
              });
              this.cTT = r;
              this.oldRotation = k;
            }
          } else
            this.alignOnAdd = !0;
        },
        setSpanRotation: function(a, b, c) {
          var f = {},
              h = this.renderer.getTransformKey();
          f[h] = f.transform = "rotate(" + a + "deg)";
          f[h + (k ? "Origin" : "-origin")] = f.transformOrigin = 100 * b + "% " + c + "px";
          C(this.element, f);
        },
        getSpanCorrection: function(a, b, c) {
          this.xCorr = -a * c;
          this.yCorr = -b;
        }
      });
      e(d.prototype, {
        getTransformKey: function() {
          return w && !/Edge/.test(A.navigator.userAgent) ? "-ms-transform" : t ? "-webkit-transform" : k ? "MozTransform" : A.opera ? "-o-transform" : "";
        },
        html: function(a, b, c) {
          var f = this.createElement("span"),
              d = f.element,
              u = f.renderer,
              k = u.isSVG,
              F = function(a, b) {
                m(["opacity", "visibility"], function(c) {
                  h(a, c + "Setter", function(a, c, f, g) {
                    a.call(this, c, f, g);
                    b[f] = c;
                  });
                });
              };
          f.textSetter = function(a) {
            a !== d.innerHTML && delete this.bBox;
            this.textStr = a;
            d.innerHTML = n(a, "");
            f.doTransform = !0;
          };
          k && F(f, f.element.style);
          f.xSetter = f.ySetter = f.alignSetter = f.rotationSetter = function(a, b) {
            "align" === b && (b = "textAlign");
            f[b] = a;
            f.doTransform = !0;
          };
          f.afterSetters = function() {
            this.doTransform && (this.htmlUpdateTransform(), this.doTransform = !1);
          };
          f.attr({
            text: a,
            x: Math.round(b),
            y: Math.round(c)
          }).css({position: "absolute"});
          d.style.whiteSpace = "nowrap";
          f.css = f.htmlCss;
          k && (f.add = function(a) {
            var b,
                c = u.box.parentNode,
                h = [];
            if (this.parentGroup = a) {
              if (b = a.div, !b) {
                for (; a; )
                  h.push(a), a = a.parentGroup;
                m(h.reverse(), function(a) {
                  function d(b, l) {
                    a[l] = b;
                    "translateX" === l ? g.left = b + "px" : g.top = b + "px";
                    a.doTransform = !0;
                  }
                  var g,
                      v = x(a.element, "class");
                  v && (v = {className: v});
                  b = a.div = a.div || E("div", v, {
                    position: "absolute",
                    left: (a.translateX || 0) + "px",
                    top: (a.translateY || 0) + "px",
                    display: a.display,
                    opacity: a.opacity,
                    pointerEvents: a.styles && a.styles.pointerEvents
                  }, b || c);
                  g = b.style;
                  e(a, {
                    classSetter: function(a) {
                      return function(g) {
                        this.element.setAttribute("class", g);
                        a.className = g;
                      };
                    }(b),
                    on: function() {
                      h[0].div && f.on.apply({element: h[0].div}, arguments);
                      return a;
                    },
                    translateXSetter: d,
                    translateYSetter: d
                  });
                  F(a, g);
                });
              }
            } else
              b = c;
            b.appendChild(d);
            f.added = !0;
            f.alignOnAdd && f.htmlUpdateTransform();
            return f;
          });
          return f;
        }
      });
    })(K);
    (function(a) {
      var x = a.defined,
          E = a.each,
          C = a.extend,
          p = a.merge,
          m = a.pick,
          e = a.timeUnits,
          k = a.win;
      a.Time = function(a) {
        this.update(a, !1);
      };
      a.Time.prototype = {
        defaultOptions: {},
        update: function(e) {
          var t = m(e && e.useUTC, !0),
              n = this;
          this.options = e = p(!0, this.options || {}, e);
          this.Date = e.Date || k.Date;
          this.timezoneOffset = (this.useUTC = t) && e.timezoneOffset;
          this.getTimezoneOffset = this.timezoneOffsetFunction();
          (this.variableTimezone = !(t && !e.getTimezoneOffset && !e.timezone)) || this.timezoneOffset ? (this.get = function(a, d) {
            var c = d.getTime(),
                h = c - n.getTimezoneOffset(d);
            d.setTime(h);
            a = d["getUTC" + a]();
            d.setTime(c);
            return a;
          }, this.set = function(c, d, e) {
            var h;
            if (-1 !== a.inArray(c, ["Milliseconds", "Seconds", "Minutes"]))
              d["set" + c](e);
            else
              h = n.getTimezoneOffset(d), h = d.getTime() - h, d.setTime(h), d["setUTC" + c](e), c = n.getTimezoneOffset(d), h = d.getTime() + c, d.setTime(h);
          }) : t ? (this.get = function(a, d) {
            return d["getUTC" + a]();
          }, this.set = function(a, d, n) {
            return d["setUTC" + a](n);
          }) : (this.get = function(a, d) {
            return d["get" + a]();
          }, this.set = function(a, d, n) {
            return d["set" + a](n);
          });
        },
        makeTime: function(e, k, n, c, d, A) {
          var h,
              f,
              b;
          this.useUTC ? (h = this.Date.UTC.apply(0, arguments), f = this.getTimezoneOffset(h), h += f, b = this.getTimezoneOffset(h), f !== b ? h += b - f : f - 36E5 !== this.getTimezoneOffset(h - 36E5) || a.isSafari || (h -= 36E5)) : h = (new this.Date(e, k, m(n, 1), m(c, 0), m(d, 0), m(A, 0))).getTime();
          return h;
        },
        timezoneOffsetFunction: function() {
          var e = this,
              m = this.options,
              n = k.moment;
          if (!this.useUTC)
            return function(a) {
              return 6E4 * (new Date(a)).getTimezoneOffset();
            };
          if (m.timezone) {
            if (n)
              return function(a) {
                return 6E4 * -n.tz(a, m.timezone).utcOffset();
              };
            a.error(25);
          }
          return this.useUTC && m.getTimezoneOffset ? function(a) {
            return 6E4 * m.getTimezoneOffset(a);
          } : function() {
            return 6E4 * (e.timezoneOffset || 0);
          };
        },
        dateFormat: function(e, k, n) {
          if (!a.defined(k) || isNaN(k))
            return a.defaultOptions.lang.invalidDate || "";
          e = a.pick(e, "%Y-%m-%d %H:%M:%S");
          var c = this,
              d = new this.Date(k),
              m = this.get("Hours", d),
              h = this.get("Day", d),
              f = this.get("Date", d),
              b = this.get("Month", d),
              u = this.get("FullYear", d),
              q = a.defaultOptions.lang,
              H = q.weekdays,
              t = q.shortWeekdays,
              D = a.pad,
              d = a.extend({
                a: t ? t[h] : H[h].substr(0, 3),
                A: H[h],
                d: D(f),
                e: D(f, 2, " "),
                w: h,
                b: q.shortMonths[b],
                B: q.months[b],
                m: D(b + 1),
                y: u.toString().substr(2, 2),
                Y: u,
                H: D(m),
                k: m,
                I: D(m % 12 || 12),
                l: m % 12 || 12,
                M: D(c.get("Minutes", d)),
                p: 12 > m ? "AM" : "PM",
                P: 12 > m ? "am" : "pm",
                S: D(d.getSeconds()),
                L: D(Math.round(k % 1E3), 3)
              }, a.dateFormats);
          a.objectEach(d, function(a, b) {
            for (; -1 !== e.indexOf("%" + b); )
              e = e.replace("%" + b, "function" === typeof a ? a.call(c, k) : a);
          });
          return n ? e.substr(0, 1).toUpperCase() + e.substr(1) : e;
        },
        getTimeTicks: function(a, k, n, c) {
          var d = this,
              A = [],
              h = {},
              f,
              b = new d.Date(k),
              u = a.unitRange,
              q = a.count || 1,
              H;
          if (x(k)) {
            d.set("Milliseconds", b, u >= e.second ? 0 : q * Math.floor(d.get("Milliseconds", b) / q));
            u >= e.second && d.set("Seconds", b, u >= e.minute ? 0 : q * Math.floor(d.get("Seconds", b) / q));
            u >= e.minute && d.set("Minutes", b, u >= e.hour ? 0 : q * Math.floor(d.get("Minutes", b) / q));
            u >= e.hour && d.set("Hours", b, u >= e.day ? 0 : q * Math.floor(d.get("Hours", b) / q));
            u >= e.day && d.set("Date", b, u >= e.month ? 1 : q * Math.floor(d.get("Date", b) / q));
            u >= e.month && (d.set("Month", b, u >= e.year ? 0 : q * Math.floor(d.get("Month", b) / q)), f = d.get("FullYear", b));
            u >= e.year && d.set("FullYear", b, f - f % q);
            u === e.week && d.set("Date", b, d.get("Date", b) - d.get("Day", b) + m(c, 1));
            f = d.get("FullYear", b);
            c = d.get("Month", b);
            var t = d.get("Date", b),
                D = d.get("Hours", b);
            k = b.getTime();
            d.variableTimezone && (H = n - k > 4 * e.month || d.getTimezoneOffset(k) !== d.getTimezoneOffset(n));
            b = b.getTime();
            for (k = 1; b < n; )
              A.push(b), b = u === e.year ? d.makeTime(f + k * q, 0) : u === e.month ? d.makeTime(f, c + k * q) : !H || u !== e.day && u !== e.week ? H && u === e.hour && 1 < q ? d.makeTime(f, c, t, D + k * q) : b + u * q : d.makeTime(f, c, t + k * q * (u === e.day ? 1 : 7)), k++;
            A.push(b);
            u <= e.hour && 1E4 > A.length && E(A, function(a) {
              0 === a % 18E5 && "000000000" === d.dateFormat("%H%M%S%L", a) && (h[a] = "day");
            });
          }
          A.info = C(a, {
            higherRanks: h,
            totalRange: u * q
          });
          return A;
        }
      };
    })(K);
    (function(a) {
      var x = a.merge;
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
      a.setOptions = function(E) {
        a.defaultOptions = x(!0, a.defaultOptions, E);
        a.time.update(x(a.defaultOptions.global, a.defaultOptions.time), !1);
        return a.defaultOptions;
      };
      a.getOptions = function() {
        return a.defaultOptions;
      };
      a.defaultPlotOptions = a.defaultOptions.plotOptions;
      a.time = new a.Time(x(a.defaultOptions.global, a.defaultOptions.time));
      a.dateFormat = function(x, C, p) {
        return a.time.dateFormat(x, C, p);
      };
    })(K);
    (function(a) {
      var x = a.correctFloat,
          E = a.defined,
          C = a.destroyObjectProperties,
          p = a.isNumber,
          m = a.pick,
          e = a.deg2rad;
      a.Tick = function(a, e, m, n) {
        this.axis = a;
        this.pos = e;
        this.type = m || "";
        this.isNewLabel = this.isNew = !0;
        m || n || this.addLabel();
      };
      a.Tick.prototype = {
        addLabel: function() {
          var a = this.axis,
              e = a.options,
              t = a.chart,
              n = a.categories,
              c = a.names,
              d = this.pos,
              A = e.labels,
              h = a.tickPositions,
              f = d === h[0],
              b = d === h[h.length - 1],
              c = n ? m(n[d], c[d], d) : d,
              n = this.label,
              h = h.info,
              u;
          a.isDatetimeAxis && h && (u = e.dateTimeLabelFormats[h.higherRanks[d] || h.unitName]);
          this.isFirst = f;
          this.isLast = b;
          e = a.labelFormatter.call({
            axis: a,
            chart: t,
            isFirst: f,
            isLast: b,
            dateTimeLabelFormat: u,
            value: a.isLog ? x(a.lin2log(c)) : c,
            pos: d
          });
          if (E(n))
            n && n.attr({text: e});
          else {
            if (this.label = n = E(e) && A.enabled ? t.renderer.text(e, 0, 0, A.useHTML).add(a.labelGroup) : null)
              n.textPxLength = n.getBBox().width;
            this.rotation = 0;
          }
        },
        getLabelSize: function() {
          return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0;
        },
        handleOverflow: function(a) {
          var k = this.axis,
              t = k.options.labels,
              n = a.x,
              c = k.chart.chartWidth,
              d = k.chart.spacing,
              A = m(k.labelLeft, Math.min(k.pos, d[3])),
              d = m(k.labelRight, Math.max(k.isRadial ? 0 : k.pos + k.len, c - d[1])),
              h = this.label,
              f = this.rotation,
              b = {
                left: 0,
                center: .5,
                right: 1
              }[k.labelAlign || h.attr("align")],
              u = h.getBBox().width,
              q = k.getSlotWidth(),
              H = q,
              p = 1,
              D,
              F = {};
          if (f || !1 === t.overflow)
            0 > f && n - b * u < A ? D = Math.round(n / Math.cos(f * e) - A) : 0 < f && n + b * u > d && (D = Math.round((c - n) / Math.cos(f * e)));
          else if (c = n + (1 - b) * u, n - b * u < A ? H = a.x + H * (1 - b) - A : c > d && (H = d - a.x + H * b, p = -1), H = Math.min(q, H), H < q && "center" === k.labelAlign && (a.x += p * (q - H - b * (q - Math.min(u, H)))), u > H || k.autoRotation && (h.styles || {}).width)
            D = H;
          D && (F.width = D, (t.style || {}).textOverflow || (F.textOverflow = "ellipsis"), h.css(F));
        },
        getPosition: function(e, m, t, n) {
          var c = this.axis,
              d = c.chart,
              k = n && d.oldChartHeight || d.chartHeight;
          return {
            x: e ? a.correctFloat(c.translate(m + t, null, null, n) + c.transB) : c.left + c.offset + (c.opposite ? (n && d.oldChartWidth || d.chartWidth) - c.right - c.left : 0),
            y: e ? k - c.bottom + c.offset - (c.opposite ? c.height : 0) : a.correctFloat(k - c.translate(m + t, null, null, n) - c.transB)
          };
        },
        getLabelPosition: function(a, m, t, n, c, d, A, h) {
          var f = this.axis,
              b = f.transA,
              u = f.reversed,
              q = f.staggerLines,
              k = f.tickRotCorr || {
                x: 0,
                y: 0
              },
              p = c.y,
              D = n || f.reserveSpaceDefault ? 0 : -f.labelOffset * ("center" === f.labelAlign ? .5 : 1);
          E(p) || (p = 0 === f.side ? t.rotation ? -8 : -t.getBBox().height : 2 === f.side ? k.y + 8 : Math.cos(t.rotation * e) * (k.y - t.getBBox(!1, 0).height / 2));
          a = a + c.x + D + k.x - (d && n ? d * b * (u ? -1 : 1) : 0);
          m = m + p - (d && !n ? d * b * (u ? 1 : -1) : 0);
          q && (t = A / (h || 1) % q, f.opposite && (t = q - t - 1), m += f.labelOffset / q * t);
          return {
            x: a,
            y: Math.round(m)
          };
        },
        getMarkPath: function(a, e, m, n, c, d) {
          return d.crispLine(["M", a, e, "L", a + (c ? 0 : -m), e + (c ? m : 0)], n);
        },
        renderGridLine: function(a, e, m) {
          var n = this.axis,
              c = this.gridLine,
              d = {},
              k = this.pos,
              h = this.type,
              f = n.tickmarkOffset,
              b = n.chart.renderer;
          c || (h || (d.zIndex = 1), a && (d.opacity = 0), this.gridLine = c = b.path().attr(d).addClass("highcharts-" + (h ? h + "-" : "") + "grid-line").add(n.gridGroup));
          if (!a && c && (a = n.getPlotLinePath(k + f, c.strokeWidth() * m, a, !0)))
            c[this.isNew ? "attr" : "animate"]({
              d: a,
              opacity: e
            });
        },
        renderMark: function(a, e, m) {
          var n = this.axis,
              c = n.chart.renderer,
              d = this.type,
              k = n.tickSize(d ? d + "Tick" : "tick"),
              h = this.mark,
              f = !h,
              b = a.x;
          a = a.y;
          k && (n.opposite && (k[0] = -k[0]), f && (this.mark = h = c.path().addClass("highcharts-" + (d ? d + "-" : "") + "tick").add(n.axisGroup)), h[f ? "attr" : "animate"]({
            d: this.getMarkPath(b, a, k[0], h.strokeWidth() * m, n.horiz, c),
            opacity: e
          }));
        },
        renderLabel: function(a, e, t, n) {
          var c = this.axis,
              d = c.horiz,
              k = c.options,
              h = this.label,
              f = k.labels,
              b = f.step,
              c = c.tickmarkOffset,
              u = !0,
              q = a.x;
          a = a.y;
          h && p(q) && (h.xy = a = this.getLabelPosition(q, a, h, d, f, c, n, b), this.isFirst && !this.isLast && !m(k.showFirstLabel, 1) || this.isLast && !this.isFirst && !m(k.showLastLabel, 1) ? u = !1 : !d || f.step || f.rotation || e || 0 === t || this.handleOverflow(a), b && n % b && (u = !1), u && p(a.y) ? (a.opacity = t, h[this.isNewLabel ? "attr" : "animate"](a), this.isNewLabel = !1) : (h.attr("y", -9999), this.isNewLabel = !0));
        },
        render: function(e, p, t) {
          var n = this.axis,
              c = n.horiz,
              d = this.getPosition(c, this.pos, n.tickmarkOffset, p),
              k = d.x,
              h = d.y,
              n = c && k === n.pos + n.len || !c && h === n.pos ? -1 : 1;
          t = m(t, 1);
          this.isActive = !0;
          this.renderGridLine(p, t, n);
          this.renderMark(d, t, n);
          this.renderLabel(d, p, t, e);
          this.isNew = !1;
          a.fireEvent(this, "afterRender");
        },
        destroy: function() {
          C(this, this.axis);
        }
      };
    })(K);
    var U = function(a) {
      var x = a.addEvent,
          E = a.animObject,
          C = a.arrayMax,
          p = a.arrayMin,
          m = a.correctFloat,
          e = a.defaultOptions,
          k = a.defined,
          w = a.deg2rad,
          t = a.destroyObjectProperties,
          n = a.each,
          c = a.extend,
          d = a.fireEvent,
          A = a.format,
          h = a.getMagnitude,
          f = a.grep,
          b = a.inArray,
          u = a.isArray,
          q = a.isNumber,
          H = a.isString,
          M = a.merge,
          D = a.normalizeTickInterval,
          F = a.objectEach,
          z = a.pick,
          r = a.removeEvent,
          y = a.splat,
          G = a.syncTimeout,
          B = a.Tick,
          I = function() {
            this.init.apply(this, arguments);
          };
      a.extend(I.prototype, {
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
        init: function(a, v) {
          var g = v.isX,
              l = this;
          l.chart = a;
          l.horiz = a.inverted && !l.isZAxis ? !g : g;
          l.isXAxis = g;
          l.coll = l.coll || (g ? "xAxis" : "yAxis");
          l.opposite = v.opposite;
          l.side = v.side || (l.horiz ? l.opposite ? 0 : 2 : l.opposite ? 1 : 3);
          l.setOptions(v);
          var c = this.options,
              f = c.type;
          l.labelFormatter = c.labels.formatter || l.defaultLabelFormatter;
          l.userOptions = v;
          l.minPixelPadding = 0;
          l.reversed = c.reversed;
          l.visible = !1 !== c.visible;
          l.zoomEnabled = !1 !== c.zoomEnabled;
          l.hasNames = "category" === f || !0 === c.categories;
          l.categories = c.categories || l.hasNames;
          l.names || (l.names = [], l.names.keys = {});
          l.plotLinesAndBandsGroups = {};
          l.isLog = "logarithmic" === f;
          l.isDatetimeAxis = "datetime" === f;
          l.positiveValuesOnly = l.isLog && !l.allowNegativeLog;
          l.isLinked = k(c.linkedTo);
          l.ticks = {};
          l.labelEdge = [];
          l.minorTicks = {};
          l.plotLinesAndBands = [];
          l.alternateBands = {};
          l.len = 0;
          l.minRange = l.userMinRange = c.minRange || c.maxZoom;
          l.range = c.range;
          l.offset = c.offset || 0;
          l.stacks = {};
          l.oldStacks = {};
          l.stacksTouched = 0;
          l.max = null;
          l.min = null;
          l.crosshair = z(c.crosshair, y(a.options.tooltip.crosshairs)[g ? 0 : 1], !1);
          v = l.options.events;
          -1 === b(l, a.axes) && (g ? a.axes.splice(a.xAxis.length, 0, l) : a.axes.push(l), a[l.coll].push(l));
          l.series = l.series || [];
          a.inverted && !l.isZAxis && g && void 0 === l.reversed && (l.reversed = !0);
          F(v, function(a, g) {
            x(l, g, a);
          });
          l.lin2log = c.linearToLogConverter || l.lin2log;
          l.isLog && (l.val2lin = l.log2lin, l.lin2val = l.lin2log);
        },
        setOptions: function(a) {
          this.options = M(this.defaultOptions, "yAxis" === this.coll && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], M(e[this.coll], a));
        },
        defaultLabelFormatter: function() {
          var g = this.axis,
              b = this.value,
              c = g.chart.time,
              l = g.categories,
              f = this.dateTimeLabelFormat,
              h = e.lang,
              d = h.numericSymbols,
              h = h.numericSymbolMagnitude || 1E3,
              r = d && d.length,
              q,
              u = g.options.labels.format,
              g = g.isLog ? Math.abs(b) : g.tickInterval;
          if (u)
            q = A(u, this, c);
          else if (l)
            q = b;
          else if (f)
            q = c.dateFormat(f, b);
          else if (r && 1E3 <= g)
            for (; r-- && void 0 === q; )
              c = Math.pow(h, r + 1), g >= c && 0 === 10 * b % c && null !== d[r] && 0 !== b && (q = a.numberFormat(b / c, -1) + d[r]);
          void 0 === q && (q = 1E4 <= Math.abs(b) ? a.numberFormat(b, -1) : a.numberFormat(b, -1, void 0, ""));
          return q;
        },
        getSeriesExtremes: function() {
          var a = this,
              b = a.chart;
          a.hasVisibleSeries = !1;
          a.dataMin = a.dataMax = a.threshold = null;
          a.softThreshold = !a.isXAxis;
          a.buildStacks && a.buildStacks();
          n(a.series, function(g) {
            if (g.visible || !b.options.chart.ignoreHiddenSeries) {
              var l = g.options,
                  c = l.threshold,
                  v;
              a.hasVisibleSeries = !0;
              a.positiveValuesOnly && 0 >= c && (c = null);
              if (a.isXAxis)
                l = g.xData, l.length && (g = p(l), v = C(l), q(g) || g instanceof Date || (l = f(l, q), g = p(l), v = C(l)), l.length && (a.dataMin = Math.min(z(a.dataMin, l[0], g), g), a.dataMax = Math.max(z(a.dataMax, l[0], v), v)));
              else if (g.getExtremes(), v = g.dataMax, g = g.dataMin, k(g) && k(v) && (a.dataMin = Math.min(z(a.dataMin, g), g), a.dataMax = Math.max(z(a.dataMax, v), v)), k(c) && (a.threshold = c), !l.softThreshold || a.positiveValuesOnly)
                a.softThreshold = !1;
            }
          });
        },
        translate: function(a, b, c, l, f, h) {
          var g = this.linkedParent || this,
              v = 1,
              d = 0,
              r = l ? g.oldTransA : g.transA;
          l = l ? g.oldMin : g.min;
          var e = g.minPixelPadding;
          f = (g.isOrdinal || g.isBroken || g.isLog && f) && g.lin2val;
          r || (r = g.transA);
          c && (v *= -1, d = g.len);
          g.reversed && (v *= -1, d -= v * (g.sector || g.len));
          b ? (a = (a * v + d - e) / r + l, f && (a = g.lin2val(a))) : (f && (a = g.val2lin(a)), a = q(l) ? v * (a - l) * r + d + v * e + (q(h) ? r * h : 0) : void 0);
          return a;
        },
        toPixels: function(a, b) {
          return this.translate(a, !1, !this.horiz, null, !0) + (b ? 0 : this.pos);
        },
        toValue: function(a, b) {
          return this.translate(a - (b ? 0 : this.pos), !0, !this.horiz, null, !0);
        },
        getPlotLinePath: function(a, b, c, l, f) {
          var g = this.chart,
              v = this.left,
              h = this.top,
              d,
              r,
              e = c && g.oldChartHeight || g.chartHeight,
              u = c && g.oldChartWidth || g.chartWidth,
              n;
          d = this.transB;
          var y = function(a, g, b) {
            if (a < g || a > b)
              l ? a = Math.min(Math.max(g, a), b) : n = !0;
            return a;
          };
          f = z(f, this.translate(a, null, null, c));
          f = Math.min(Math.max(-1E5, f), 1E5);
          a = c = Math.round(f + d);
          d = r = Math.round(e - f - d);
          q(f) ? this.horiz ? (d = h, r = e - this.bottom, a = c = y(a, v, v + this.width)) : (a = v, c = u - this.right, d = r = y(d, h, h + this.height)) : (n = !0, l = !1);
          return n && !l ? null : g.renderer.crispLine(["M", a, d, "L", c, r], b || 1);
        },
        getLinearTickPositions: function(a, b, c) {
          var g,
              v = m(Math.floor(b / a) * a);
          c = m(Math.ceil(c / a) * a);
          var f = [],
              h;
          m(v + a) === v && (h = 20);
          if (this.single)
            return [b];
          for (b = v; b <= c; ) {
            f.push(b);
            b = m(b + a, h);
            if (b === g)
              break;
            g = b;
          }
          return f;
        },
        getMinorTickInterval: function() {
          var a = this.options;
          return !0 === a.minorTicks ? z(a.minorTickInterval, "auto") : !1 === a.minorTicks ? null : a.minorTickInterval;
        },
        getMinorTickPositions: function() {
          var a = this,
              b = a.options,
              c = a.tickPositions,
              l = a.minorTickInterval,
              f = [],
              h = a.pointRangePadding || 0,
              d = a.min - h,
              h = a.max + h,
              r = h - d;
          if (r && r / l < a.len / 3)
            if (a.isLog)
              n(this.paddedTicks, function(g, b, c) {
                b && f.push.apply(f, a.getLogTickPositions(l, c[b - 1], c[b], !0));
              });
            else if (a.isDatetimeAxis && "auto" === this.getMinorTickInterval())
              f = f.concat(a.getTimeTicks(a.normalizeTimeTickInterval(l), d, h, b.startOfWeek));
            else
              for (b = d + (c[0] - d) % l; b <= h && b !== f[0]; b += l)
                f.push(b);
          0 !== f.length && a.trimTicks(f);
          return f;
        },
        adjustForMinRange: function() {
          var a = this.options,
              b = this.min,
              c = this.max,
              l,
              f,
              h,
              d,
              r,
              q,
              e,
              u;
          this.isXAxis && void 0 === this.minRange && !this.isLog && (k(a.min) || k(a.max) ? this.minRange = null : (n(this.series, function(a) {
            q = a.xData;
            for (d = e = a.xIncrement ? 1 : q.length - 1; 0 < d; d--)
              if (r = q[d] - q[d - 1], void 0 === h || r < h)
                h = r;
          }), this.minRange = Math.min(5 * h, this.dataMax - this.dataMin)));
          c - b < this.minRange && (f = this.dataMax - this.dataMin >= this.minRange, u = this.minRange, l = (u - c + b) / 2, l = [b - l, z(a.min, b - l)], f && (l[2] = this.isLog ? this.log2lin(this.dataMin) : this.dataMin), b = C(l), c = [b + u, z(a.max, b + u)], f && (c[2] = this.isLog ? this.log2lin(this.dataMax) : this.dataMax), c = p(c), c - b < u && (l[0] = c - u, l[1] = z(a.min, c - u), b = C(l)));
          this.min = b;
          this.max = c;
        },
        getClosest: function() {
          var a;
          this.categories ? a = 1 : n(this.series, function(g) {
            var b = g.closestPointRange,
                l = g.visible || !g.chart.options.chart.ignoreHiddenSeries;
            !g.noSharedTooltip && k(b) && l && (a = k(a) ? Math.min(a, b) : b);
          });
          return a;
        },
        nameToX: function(a) {
          var g = u(this.categories),
              c = g ? this.categories : this.names,
              l = a.options.x,
              f;
          a.series.requireSorting = !1;
          k(l) || (l = !1 === this.options.uniqueNames ? a.series.autoIncrement() : g ? b(a.name, c) : z(c.keys[a.name], -1));
          -1 === l ? g || (f = c.length) : f = l;
          void 0 !== f && (this.names[f] = a.name, this.names.keys[a.name] = f);
          return f;
        },
        updateNames: function() {
          var g = this,
              b = this.names;
          0 < b.length && (n(a.keys(b.keys), function(a) {
            delete b.keys[a];
          }), b.length = 0, this.minRange = this.userMinRange, n(this.series || [], function(a) {
            a.xIncrement = null;
            if (!a.points || a.isDirtyData)
              a.processData(), a.generatePoints();
            n(a.points, function(b, c) {
              var l;
              b.options && (l = g.nameToX(b), void 0 !== l && l !== b.x && (b.x = l, a.xData[c] = l));
            });
          }));
        },
        setAxisTranslation: function(a) {
          var g = this,
              b = g.max - g.min,
              l = g.axisPointRange || 0,
              c,
              f = 0,
              h = 0,
              d = g.linkedParent,
              r = !!g.categories,
              q = g.transA,
              u = g.isXAxis;
          if (u || r || l)
            c = g.getClosest(), d ? (f = d.minPointOffset, h = d.pointRangePadding) : n(g.series, function(a) {
              var b = r ? 1 : u ? z(a.options.pointRange, c, 0) : g.axisPointRange || 0;
              a = a.options.pointPlacement;
              l = Math.max(l, b);
              g.single || (f = Math.max(f, H(a) ? 0 : b / 2), h = Math.max(h, "on" === a ? 0 : b));
            }), d = g.ordinalSlope && c ? g.ordinalSlope / c : 1, g.minPointOffset = f *= d, g.pointRangePadding = h *= d, g.pointRange = Math.min(l, b), u && (g.closestPointRange = c);
          a && (g.oldTransA = q);
          g.translationSlope = g.transA = q = g.options.staticScale || g.len / (b + h || 1);
          g.transB = g.horiz ? g.left : g.bottom;
          g.minPixelPadding = q * f;
        },
        minFromRange: function() {
          return this.max - this.range;
        },
        setTickInterval: function(g) {
          var b = this,
              c = b.chart,
              l = b.options,
              f = b.isLog,
              r = b.log2lin,
              u = b.isDatetimeAxis,
              e = b.isXAxis,
              y = b.isLinked,
              G = l.maxPadding,
              B = l.minPadding,
              F = l.tickInterval,
              H = l.tickPixelInterval,
              A = b.categories,
              I = b.threshold,
              t = b.softThreshold,
              p,
              w,
              M,
              x;
          u || A || y || this.getTickAmount();
          M = z(b.userMin, l.min);
          x = z(b.userMax, l.max);
          y ? (b.linkedParent = c[b.coll][l.linkedTo], c = b.linkedParent.getExtremes(), b.min = z(c.min, c.dataMin), b.max = z(c.max, c.dataMax), l.type !== b.linkedParent.options.type && a.error(11, 1)) : (!t && k(I) && (b.dataMin >= I ? (p = I, B = 0) : b.dataMax <= I && (w = I, G = 0)), b.min = z(M, p, b.dataMin), b.max = z(x, w, b.dataMax));
          f && (b.positiveValuesOnly && !g && 0 >= Math.min(b.min, z(b.dataMin, b.min)) && a.error(10, 1), b.min = m(r(b.min), 15), b.max = m(r(b.max), 15));
          b.range && k(b.max) && (b.userMin = b.min = M = Math.max(b.dataMin, b.minFromRange()), b.userMax = x = b.max, b.range = null);
          d(b, "foundExtremes");
          b.beforePadding && b.beforePadding();
          b.adjustForMinRange();
          !(A || b.axisPointRange || b.usePercentage || y) && k(b.min) && k(b.max) && (r = b.max - b.min) && (!k(M) && B && (b.min -= r * B), !k(x) && G && (b.max += r * G));
          q(l.softMin) && !q(b.userMin) && (b.min = Math.min(b.min, l.softMin));
          q(l.softMax) && !q(b.userMax) && (b.max = Math.max(b.max, l.softMax));
          q(l.floor) && (b.min = Math.max(b.min, l.floor));
          q(l.ceiling) && (b.max = Math.min(b.max, l.ceiling));
          t && k(b.dataMin) && (I = I || 0, !k(M) && b.min < I && b.dataMin >= I ? b.min = I : !k(x) && b.max > I && b.dataMax <= I && (b.max = I));
          b.tickInterval = b.min === b.max || void 0 === b.min || void 0 === b.max ? 1 : y && !F && H === b.linkedParent.options.tickPixelInterval ? F = b.linkedParent.tickInterval : z(F, this.tickAmount ? (b.max - b.min) / Math.max(this.tickAmount - 1, 1) : void 0, A ? 1 : (b.max - b.min) * H / Math.max(b.len, H));
          e && !g && n(b.series, function(a) {
            a.processData(b.min !== b.oldMin || b.max !== b.oldMax);
          });
          b.setAxisTranslation(!0);
          b.beforeSetTickPositions && b.beforeSetTickPositions();
          b.postProcessTickInterval && (b.tickInterval = b.postProcessTickInterval(b.tickInterval));
          b.pointRange && !F && (b.tickInterval = Math.max(b.pointRange, b.tickInterval));
          g = z(l.minTickInterval, b.isDatetimeAxis && b.closestPointRange);
          !F && b.tickInterval < g && (b.tickInterval = g);
          u || f || F || (b.tickInterval = D(b.tickInterval, null, h(b.tickInterval), z(l.allowDecimals, !(.5 < b.tickInterval && 5 > b.tickInterval && 1E3 < b.max && 9999 > b.max)), !!this.tickAmount));
          this.tickAmount || (b.tickInterval = b.unsquish());
          this.setTickPositions();
        },
        setTickPositions: function() {
          var a = this.options,
              b,
              c = a.tickPositions;
          b = this.getMinorTickInterval();
          var l = a.tickPositioner,
              f = a.startOnTick,
              h = a.endOnTick;
          this.tickmarkOffset = this.categories && "between" === a.tickmarkPlacement && 1 === this.tickInterval ? .5 : 0;
          this.minorTickInterval = "auto" === b && this.tickInterval ? this.tickInterval / 5 : b;
          this.single = this.min === this.max && k(this.min) && !this.tickAmount && (parseInt(this.min, 10) === this.min || !1 !== a.allowDecimals);
          this.tickPositions = b = c && c.slice();
          !b && (b = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, a.units), this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), b.length > this.len && (b = [b[0], b.pop()], b[0] === b[1] && (b.length = 1)), this.tickPositions = b, l && (l = l.apply(this, [this.min, this.max]))) && (this.tickPositions = b = l);
          this.paddedTicks = b.slice(0);
          this.trimTicks(b, f, h);
          this.isLinked || (this.single && 2 > b.length && (this.min -= .5, this.max += .5), c || l || this.adjustTickAmount());
        },
        trimTicks: function(a, b, c) {
          var g = a[0],
              f = a[a.length - 1],
              h = this.minPointOffset || 0;
          if (!this.isLinked) {
            if (b && -Infinity !== g)
              this.min = g;
            else
              for (; this.min - h > a[0]; )
                a.shift();
            if (c)
              this.max = f;
            else
              for (; this.max + h < a[a.length - 1]; )
                a.pop();
            0 === a.length && k(g) && !this.options.tickPositions && a.push((f + g) / 2);
          }
        },
        alignToOthers: function() {
          var a = {},
              b,
              c = this.options;
          !1 === this.chart.options.chart.alignTicks || !1 === c.alignTicks || this.isLog || n(this.chart[this.coll], function(g) {
            var l = g.options,
                l = [g.horiz ? l.left : l.top, l.width, l.height, l.pane].join();
            g.series.length && (a[l] ? b = !0 : a[l] = 1);
          });
          return b;
        },
        getTickAmount: function() {
          var a = this.options,
              b = a.tickAmount,
              c = a.tickPixelInterval;
          !k(a.tickInterval) && this.len < c && !this.isRadial && !this.isLog && a.startOnTick && a.endOnTick && (b = 2);
          !b && this.alignToOthers() && (b = Math.ceil(this.len / c) + 1);
          4 > b && (this.finalTickAmt = b, b = 5);
          this.tickAmount = b;
        },
        adjustTickAmount: function() {
          var a = this.tickInterval,
              b = this.tickPositions,
              c = this.tickAmount,
              l = this.finalTickAmt,
              f = b && b.length,
              h = z(this.threshold, this.softThreshold ? 0 : null);
          if (this.hasData()) {
            if (f < c) {
              for (; b.length < c; )
                b.length % 2 || this.min === h ? b.push(m(b[b.length - 1] + a)) : b.unshift(m(b[0] - a));
              this.transA *= (f - 1) / (c - 1);
              this.min = b[0];
              this.max = b[b.length - 1];
            } else
              f > c && (this.tickInterval *= 2, this.setTickPositions());
            if (k(l)) {
              for (a = c = b.length; a--; )
                (3 === l && 1 === a % 2 || 2 >= l && 0 < a && a < c - 1) && b.splice(a, 1);
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
          d(this, "afterSetScale");
        },
        setExtremes: function(a, b, f, l, h) {
          var g = this,
              r = g.chart;
          f = z(f, !0);
          n(g.series, function(a) {
            delete a.kdTree;
          });
          h = c(h, {
            min: a,
            max: b
          });
          d(g, "setExtremes", h, function() {
            g.userMin = a;
            g.userMax = b;
            g.eventArgs = h;
            f && r.redraw(l);
          });
        },
        zoom: function(a, b) {
          var g = this.dataMin,
              l = this.dataMax,
              c = this.options,
              f = Math.min(g, z(c.min, g)),
              c = Math.max(l, z(c.max, l));
          if (a !== this.min || b !== this.max)
            this.allowZoomOutside || (k(g) && (a < f && (a = f), a > c && (a = c)), k(l) && (b < f && (b = f), b > c && (b = c))), this.displayBtn = void 0 !== a || void 0 !== b, this.setExtremes(a, b, !1, void 0, {trigger: "zoom"});
          return !0;
        },
        setAxisSize: function() {
          var b = this.chart,
              c = this.options,
              f = c.offsets || [0, 0, 0, 0],
              l = this.horiz,
              h = this.width = Math.round(a.relativeLength(z(c.width, b.plotWidth - f[3] + f[1]), b.plotWidth)),
              d = this.height = Math.round(a.relativeLength(z(c.height, b.plotHeight - f[0] + f[2]), b.plotHeight)),
              r = this.top = Math.round(a.relativeLength(z(c.top, b.plotTop + f[0]), b.plotHeight, b.plotTop)),
              c = this.left = Math.round(a.relativeLength(z(c.left, b.plotLeft + f[3]), b.plotWidth, b.plotLeft));
          this.bottom = b.chartHeight - d - r;
          this.right = b.chartWidth - h - c;
          this.len = Math.max(l ? h : d, 0);
          this.pos = l ? c : r;
        },
        getExtremes: function() {
          var a = this.isLog,
              b = this.lin2log;
          return {
            min: a ? m(b(this.min)) : this.min,
            max: a ? m(b(this.max)) : this.max,
            dataMin: this.dataMin,
            dataMax: this.dataMax,
            userMin: this.userMin,
            userMax: this.userMax
          };
        },
        getThreshold: function(a) {
          var b = this.isLog,
              g = this.lin2log,
              l = b ? g(this.min) : this.min,
              b = b ? g(this.max) : this.max;
          null === a ? a = l : l > a ? a = l : b < a && (a = b);
          return this.translate(a, 0, 1, 0, 1);
        },
        autoLabelAlign: function(a) {
          a = (z(a, 0) - 90 * this.side + 720) % 360;
          return 15 < a && 165 > a ? "right" : 195 < a && 345 > a ? "left" : "center";
        },
        tickSize: function(a) {
          var b = this.options,
              g = b[a + "Length"],
              l = z(b[a + "Width"], "tick" === a && this.isXAxis ? 1 : 0);
          if (l && g)
            return "inside" === b[a + "Position"] && (g = -g), [g, l];
        },
        labelMetrics: function() {
          var a = this.tickPositions && this.tickPositions[0] || 0;
          return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[a] && this.ticks[a].label);
        },
        unsquish: function() {
          var a = this.options.labels,
              b = this.horiz,
              c = this.tickInterval,
              l = c,
              f = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / c),
              h,
              d = a.rotation,
              r = this.labelMetrics(),
              q,
              u = Number.MAX_VALUE,
              e,
              y = function(a) {
                a /= f || 1;
                a = 1 < a ? Math.ceil(a) : 1;
                return a * c;
              };
          b ? (e = !a.staggerLines && !a.step && (k(d) ? [d] : f < z(a.autoRotationLimit, 80) && a.autoRotation)) && n(e, function(a) {
            var b;
            if (a === d || a && -90 <= a && 90 >= a)
              q = y(Math.abs(r.h / Math.sin(w * a))), b = q + Math.abs(a / 360), b < u && (u = b, h = a, l = q);
          }) : a.step || (l = y(r.h));
          this.autoRotation = e;
          this.labelRotation = z(h, d);
          return l;
        },
        getSlotWidth: function() {
          var a = this.chart,
              b = this.horiz,
              c = this.options.labels,
              l = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1),
              f = a.margin[3];
          return b && 2 > (c.step || 0) && !c.rotation && (this.staggerLines || 1) * this.len / l || !b && (c.style && parseInt(c.style.width, 10) || f && f - a.spacing[3] || .33 * a.chartWidth);
        },
        renderUnsquish: function() {
          var a = this.chart,
              b = a.renderer,
              c = this.tickPositions,
              l = this.ticks,
              f = this.options.labels,
              h = this.horiz,
              d = this.getSlotWidth(),
              r = Math.max(1, Math.round(d - 2 * (f.padding || 5))),
              q = {},
              u = this.labelMetrics(),
              e = f.style && f.style.textOverflow,
              y,
              k,
              m = 0,
              G;
          H(f.rotation) || (q.rotation = f.rotation || 0);
          n(c, function(a) {
            (a = l[a]) && a.label && a.label.textPxLength > m && (m = a.label.textPxLength);
          });
          this.maxLabelLength = m;
          if (this.autoRotation)
            m > r && m > u.h ? q.rotation = this.labelRotation : this.labelRotation = 0;
          else if (d && (y = r, !e))
            for (k = "clip", r = c.length; !h && r--; )
              if (G = c[r], G = l[G].label)
                G.styles && "ellipsis" === G.styles.textOverflow ? G.css({textOverflow: "clip"}) : G.textPxLength > d && G.css({width: d + "px"}), G.getBBox().height > this.len / c.length - (u.h - u.f) && (G.specificTextOverflow = "ellipsis");
          q.rotation && (y = m > .5 * a.chartHeight ? .33 * a.chartHeight : a.chartHeight, e || (k = "ellipsis"));
          if (this.labelAlign = f.align || this.autoLabelAlign(this.labelRotation))
            q.align = this.labelAlign;
          n(c, function(a) {
            var b = (a = l[a]) && a.label;
            b && (b.attr(q), !y || f.style && f.style.width || !(y < b.textPxLength || "SPAN" === b.element.tagName) || b.css({
              width: y,
              textOverflow: b.specificTextOverflow || k
            }), delete b.specificTextOverflow, a.rotation = q.rotation);
          });
          this.tickRotCorr = b.rotCorr(u.b, this.labelRotation || 0, 0 !== this.side);
        },
        hasData: function() {
          return this.hasVisibleSeries || k(this.min) && k(this.max) && this.tickPositions && 0 < this.tickPositions.length;
        },
        addTitle: function(a) {
          var b = this.chart.renderer,
              g = this.horiz,
              l = this.opposite,
              c = this.options.title,
              f;
          this.axisTitle || ((f = c.textAlign) || (f = (g ? {
            low: "left",
            middle: "center",
            high: "right"
          } : {
            low: l ? "right" : "left",
            middle: "center",
            high: l ? "left" : "right"
          })[c.align]), this.axisTitle = b.text(c.text, 0, 0, c.useHTML).attr({
            zIndex: 7,
            rotation: c.rotation || 0,
            align: f
          }).addClass("highcharts-axis-title").add(this.axisGroup), this.axisTitle.isNew = !0);
          this.axisTitle.css({width: this.len});
          this.axisTitle[a ? "show" : "hide"](!0);
        },
        generateTick: function(a) {
          var b = this.ticks;
          b[a] ? b[a].addLabel() : b[a] = new B(this, a);
        },
        getOffset: function() {
          var a = this,
              b = a.chart,
              c = b.renderer,
              l = a.options,
              f = a.tickPositions,
              h = a.ticks,
              d = a.horiz,
              r = a.side,
              q = b.inverted && !a.isZAxis ? [1, 0, 3, 2][r] : r,
              u,
              e,
              y = 0,
              m,
              G = 0,
              B = l.title,
              D = l.labels,
              H = 0,
              I = b.axisOffset,
              b = b.clipOffset,
              A = [-1, 1, 1, -1][r],
              t = l.className,
              p = a.axisParent,
              w = this.tickSize("tick");
          u = a.hasData();
          a.showAxis = e = u || z(l.showEmpty, !0);
          a.staggerLines = a.horiz && D.staggerLines;
          a.axisGroup || (a.gridGroup = c.g("grid").attr({zIndex: l.gridZIndex || 1}).addClass("highcharts-" + this.coll.toLowerCase() + "-grid " + (t || "")).add(p), a.axisGroup = c.g("axis").attr({zIndex: l.zIndex || 2}).addClass("highcharts-" + this.coll.toLowerCase() + " " + (t || "")).add(p), a.labelGroup = c.g("axis-labels").attr({zIndex: D.zIndex || 7}).addClass("highcharts-" + a.coll.toLowerCase() + "-labels " + (t || "")).add(p));
          u || a.isLinked ? (n(f, function(b, g) {
            a.generateTick(b, g);
          }), a.renderUnsquish(), a.reserveSpaceDefault = 0 === r || 2 === r || {
            1: "left",
            3: "right"
          }[r] === a.labelAlign, z(D.reserveSpace, "center" === a.labelAlign ? !0 : null, a.reserveSpaceDefault) && n(f, function(a) {
            H = Math.max(h[a].getLabelSize(), H);
          }), a.staggerLines && (H *= a.staggerLines), a.labelOffset = H * (a.opposite ? -1 : 1)) : F(h, function(a, b) {
            a.destroy();
            delete h[b];
          });
          B && B.text && !1 !== B.enabled && (a.addTitle(e), e && !1 !== B.reserveSpace && (a.titleOffset = y = a.axisTitle.getBBox()[d ? "height" : "width"], m = B.offset, G = k(m) ? 0 : z(B.margin, d ? 5 : 10)));
          a.renderLine();
          a.offset = A * z(l.offset, I[r]);
          a.tickRotCorr = a.tickRotCorr || {
            x: 0,
            y: 0
          };
          c = 0 === r ? -a.labelMetrics().h : 2 === r ? a.tickRotCorr.y : 0;
          G = Math.abs(H) + G;
          H && (G = G - c + A * (d ? z(D.y, a.tickRotCorr.y + 8 * A) : D.x));
          a.axisTitleMargin = z(m, G);
          I[r] = Math.max(I[r], a.axisTitleMargin + y + A * a.offset, G, u && f.length && w ? w[0] + A * a.offset : 0);
          l = l.offset ? 0 : 2 * Math.floor(a.axisLine.strokeWidth() / 2);
          b[q] = Math.max(b[q], l);
        },
        getLinePath: function(a) {
          var b = this.chart,
              g = this.opposite,
              l = this.offset,
              c = this.horiz,
              f = this.left + (g ? this.width : 0) + l,
              l = b.chartHeight - this.bottom - (g ? this.height : 0) + l;
          g && (a *= -1);
          return b.renderer.crispLine(["M", c ? this.left : f, c ? l : this.top, "L", c ? b.chartWidth - this.right : f, c ? l : b.chartHeight - this.bottom], a);
        },
        renderLine: function() {
          this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup));
        },
        getTitlePosition: function() {
          var a = this.horiz,
              b = this.left,
              c = this.top,
              l = this.len,
              f = this.options.title,
              h = a ? b : c,
              r = this.opposite,
              d = this.offset,
              q = f.x || 0,
              u = f.y || 0,
              e = this.axisTitle,
              n = this.chart.renderer.fontMetrics(f.style && f.style.fontSize, e),
              e = Math.max(e.getBBox(null, 0).height - n.h - 1, 0),
              l = {
                low: h + (a ? 0 : l),
                middle: h + l / 2,
                high: h + (a ? l : 0)
              }[f.align],
              b = (a ? c + this.height : b) + (a ? 1 : -1) * (r ? -1 : 1) * this.axisTitleMargin + [-e, e, n.f, -e][this.side];
          return {
            x: a ? l + q : b + (r ? this.width : 0) + d + q,
            y: a ? b + u - (r ? this.height : 0) + d : l + u
          };
        },
        renderMinorTick: function(a) {
          var b = this.chart.hasRendered && q(this.oldMin),
              g = this.minorTicks;
          g[a] || (g[a] = new B(this, a, "minor"));
          b && g[a].isNew && g[a].render(null, !0);
          g[a].render(null, !1, 1);
        },
        renderTick: function(a, b) {
          var g = this.isLinked,
              l = this.ticks,
              c = this.chart.hasRendered && q(this.oldMin);
          if (!g || a >= this.min && a <= this.max)
            l[a] || (l[a] = new B(this, a)), c && l[a].isNew && l[a].render(b, !0, .1), l[a].render(b);
        },
        render: function() {
          var b = this,
              c = b.chart,
              f = b.options,
              l = b.isLog,
              h = b.lin2log,
              r = b.isLinked,
              d = b.tickPositions,
              u = b.axisTitle,
              e = b.ticks,
              y = b.minorTicks,
              k = b.alternateBands,
              m = f.stackLabels,
              D = f.alternateGridColor,
              H = b.tickmarkOffset,
              z = b.axisLine,
              I = b.showAxis,
              A = E(c.renderer.globalAnimation),
              t,
              p;
          b.labelEdge.length = 0;
          b.overlap = !1;
          n([e, y, k], function(a) {
            F(a, function(a) {
              a.isActive = !1;
            });
          });
          if (b.hasData() || r)
            b.minorTickInterval && !b.categories && n(b.getMinorTickPositions(), function(a) {
              b.renderMinorTick(a);
            }), d.length && (n(d, function(a, l) {
              b.renderTick(a, l);
            }), H && (0 === b.min || b.single) && (e[-1] || (e[-1] = new B(b, -1, null, !0)), e[-1].render(-1))), D && n(d, function(g, f) {
              p = void 0 !== d[f + 1] ? d[f + 1] + H : b.max - H;
              0 === f % 2 && g < b.max && p <= b.max + (c.polar ? -H : H) && (k[g] || (k[g] = new a.PlotLineOrBand(b)), t = g + H, k[g].options = {
                from: l ? h(t) : t,
                to: l ? h(p) : p,
                color: D
              }, k[g].render(), k[g].isActive = !0);
            }), b._addedPlotLB || (n((f.plotLines || []).concat(f.plotBands || []), function(a) {
              b.addPlotBandOrLine(a);
            }), b._addedPlotLB = !0);
          n([e, y, k], function(a) {
            var b,
                l = [],
                g = A.duration;
            F(a, function(a, b) {
              a.isActive || (a.render(b, !1, 0), a.isActive = !1, l.push(b));
            });
            G(function() {
              for (b = l.length; b--; )
                a[l[b]] && !a[l[b]].isActive && (a[l[b]].destroy(), delete a[l[b]]);
            }, a !== k && c.hasRendered && g ? g : 0);
          });
          z && (z[z.isPlaced ? "animate" : "attr"]({d: this.getLinePath(z.strokeWidth())}), z.isPlaced = !0, z[I ? "show" : "hide"](!0));
          u && I && (f = b.getTitlePosition(), q(f.y) ? (u[u.isNew ? "attr" : "animate"](f), u.isNew = !1) : (u.attr("y", -9999), u.isNew = !0));
          m && m.enabled && b.renderStackTotals();
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
              l = c.plotLinesAndBands,
              f;
          a || r(c);
          F(g, function(a, b) {
            t(a);
            g[b] = null;
          });
          n([c.ticks, c.minorTicks, c.alternateBands], function(a) {
            t(a);
          });
          if (l)
            for (a = l.length; a--; )
              l[a].destroy();
          n("stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross".split(" "), function(a) {
            c[a] && (c[a] = c[a].destroy());
          });
          for (f in c.plotLinesAndBandsGroups)
            c.plotLinesAndBandsGroups[f] = c.plotLinesAndBandsGroups[f].destroy();
          F(c, function(a, l) {
            -1 === b(l, c.keepProps) && delete c[l];
          });
        },
        drawCrosshair: function(a, b) {
          var c,
              l = this.crosshair,
              g = z(l.snap, !0),
              f,
              h = this.cross;
          a || (a = this.cross && this.cross.e);
          this.crosshair && !1 !== (k(b) || !g) ? (g ? k(b) && (f = this.isXAxis ? b.plotX : this.len - b.plotY) : f = a && (this.horiz ? a.chartX - this.pos : this.len - a.chartY + this.pos), k(f) && (c = this.getPlotLinePath(b && (this.isXAxis ? b.x : z(b.stackY, b.y)), null, null, null, f) || null), k(c) ? (b = this.categories && !this.isRadial, h || (this.cross = h = this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" + (b ? "category " : "thin ") + l.className).attr({zIndex: z(l.zIndex, 2)}).add()), h.show().attr({d: c}), b && !l.width && h.attr({"stroke-width": this.transA}), this.cross.e = a) : this.hideCrosshair()) : this.hideCrosshair();
        },
        hideCrosshair: function() {
          this.cross && this.cross.hide();
        }
      });
      return a.Axis = I;
    }(K);
    (function(a) {
      var x = a.Axis,
          E = a.getMagnitude,
          C = a.normalizeTickInterval,
          p = a.timeUnits;
      x.prototype.getTimeTicks = function() {
        return this.chart.time.getTimeTicks.apply(this.chart.time, arguments);
      };
      x.prototype.normalizeTimeTickInterval = function(a, e) {
        var k = e || [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second", [1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1, 2]], ["week", [1, 2]], ["month", [1, 2, 3, 4, 6]], ["year", null]];
        e = k[k.length - 1];
        var m = p[e[0]],
            t = e[1],
            n;
        for (n = 0; n < k.length && !(e = k[n], m = p[e[0]], t = e[1], k[n + 1] && a <= (m * t[t.length - 1] + p[k[n + 1][0]]) / 2); n++)
          ;
        m === p.year && a < 5 * m && (t = [1, 2, 5]);
        a = C(a / m, t, "year" === e[0] ? Math.max(E(a / m), 1) : 1);
        return {
          unitRange: m,
          count: a,
          unitName: e[0]
        };
      };
    })(K);
    (function(a) {
      var x = a.Axis,
          E = a.getMagnitude,
          C = a.map,
          p = a.normalizeTickInterval,
          m = a.pick;
      x.prototype.getLogTickPositions = function(a, k, w, t) {
        var e = this.options,
            c = this.len,
            d = this.lin2log,
            A = this.log2lin,
            h = [];
        t || (this._minorAutoInterval = null);
        if (.5 <= a)
          a = Math.round(a), h = this.getLinearTickPositions(a, k, w);
        else if (.08 <= a)
          for (var c = Math.floor(k),
              f,
              b,
              u,
              q,
              H,
              e = .3 < a ? [1, 2, 4] : .15 < a ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; c < w + 1 && !H; c++)
            for (b = e.length, f = 0; f < b && !H; f++)
              u = A(d(c) * e[f]), u > k && (!t || q <= w) && void 0 !== q && h.push(q), q > w && (H = !0), q = u;
        else
          k = d(k), w = d(w), a = t ? this.getMinorTickInterval() : e.tickInterval, a = m("auto" === a ? null : a, this._minorAutoInterval, e.tickPixelInterval / (t ? 5 : 1) * (w - k) / ((t ? c / this.tickPositions.length : c) || 1)), a = p(a, null, E(a)), h = C(this.getLinearTickPositions(a, k, w), A), t || (this._minorAutoInterval = a / 5);
        t || (this.tickInterval = a);
        return h;
      };
      x.prototype.log2lin = function(a) {
        return Math.log(a) / Math.LN10;
      };
      x.prototype.lin2log = function(a) {
        return Math.pow(10, a);
      };
    })(K);
    (function(a, x) {
      var E = a.arrayMax,
          C = a.arrayMin,
          p = a.defined,
          m = a.destroyObjectProperties,
          e = a.each,
          k = a.erase,
          w = a.merge,
          t = a.pick;
      a.PlotLineOrBand = function(a, c) {
        this.axis = a;
        c && (this.options = c, this.id = c.id);
      };
      a.PlotLineOrBand.prototype = {
        render: function() {
          var e = this,
              c = e.axis,
              d = c.horiz,
              k = e.options,
              h = k.label,
              f = e.label,
              b = k.to,
              u = k.from,
              q = k.value,
              m = p(u) && p(b),
              M = p(q),
              D = e.svgElem,
              F = !D,
              z = [],
              r = t(k.zIndex, 0),
              y = k.events,
              z = {"class": "highcharts-plot-" + (m ? "band " : "line ") + (k.className || "")},
              G = {},
              B = c.chart.renderer,
              I = m ? "bands" : "lines",
              g;
          g = c.log2lin;
          c.isLog && (u = g(u), b = g(b), q = g(q));
          G.zIndex = r;
          I += "-" + r;
          (g = c.plotLinesAndBandsGroups[I]) || (c.plotLinesAndBandsGroups[I] = g = B.g("plot-" + I).attr(G).add());
          F && (e.svgElem = D = B.path().attr(z).add(g));
          if (M)
            z = c.getPlotLinePath(q, D.strokeWidth());
          else if (m)
            z = c.getPlotBandPath(u, b, k);
          else
            return;
          F && z && z.length ? (D.attr({d: z}), y && a.objectEach(y, function(a, b) {
            D.on(b, function(a) {
              y[b].apply(e, [a]);
            });
          })) : D && (z ? (D.show(), D.animate({d: z})) : (D.hide(), f && (e.label = f = f.destroy())));
          h && p(h.text) && z && z.length && 0 < c.width && 0 < c.height && !z.flat ? (h = w({
            align: d && m && "center",
            x: d ? !m && 4 : 10,
            verticalAlign: !d && m && "middle",
            y: d ? m ? 16 : 10 : m ? 6 : -4,
            rotation: d && !m && 90
          }, h), this.renderLabel(h, z, m, r)) : f && f.hide();
          return e;
        },
        renderLabel: function(a, c, d, e) {
          var h = this.label,
              f = this.axis.chart.renderer;
          h || (h = {
            align: a.textAlign || a.align,
            rotation: a.rotation,
            "class": "highcharts-plot-" + (d ? "band" : "line") + "-label " + (a.className || "")
          }, h.zIndex = e, this.label = h = f.text(a.text, 0, 0, a.useHTML).attr(h).add());
          e = c.xBounds || [c[1], c[4], d ? c[6] : c[1]];
          c = c.yBounds || [c[2], c[5], d ? c[7] : c[2]];
          d = C(e);
          f = C(c);
          h.align(a, !1, {
            x: d,
            y: f,
            width: E(e) - d,
            height: E(c) - f
          });
          h.show();
        },
        destroy: function() {
          k(this.axis.plotLinesAndBands, this);
          delete this.axis;
          m(this);
        }
      };
      a.extend(x.prototype, {
        getPlotBandPath: function(a, c) {
          var d = this.getPlotLinePath(c, null, null, !0),
              e = this.getPlotLinePath(a, null, null, !0),
              h = [],
              f = this.horiz,
              b = 1,
              u;
          a = a < this.min && c < this.min || a > this.max && c > this.max;
          if (e && d)
            for (a && (u = e.toString() === d.toString(), b = 0), a = 0; a < e.length; a += 6)
              f && d[a + 1] === e[a + 1] ? (d[a + 1] += b, d[a + 4] += b) : f || d[a + 2] !== e[a + 2] || (d[a + 2] += b, d[a + 5] += b), h.push("M", e[a + 1], e[a + 2], "L", e[a + 4], e[a + 5], d[a + 4], d[a + 5], d[a + 1], d[a + 2], "z"), h.flat = u;
          return h;
        },
        addPlotBand: function(a) {
          return this.addPlotBandOrLine(a, "plotBands");
        },
        addPlotLine: function(a) {
          return this.addPlotBandOrLine(a, "plotLines");
        },
        addPlotBandOrLine: function(e, c) {
          var d = (new a.PlotLineOrBand(this, e)).render(),
              k = this.userOptions;
          d && (c && (k[c] = k[c] || [], k[c].push(e)), this.plotLinesAndBands.push(d));
          return d;
        },
        removePlotBandOrLine: function(a) {
          for (var c = this.plotLinesAndBands,
              d = this.options,
              m = this.userOptions,
              h = c.length; h--; )
            c[h].id === a && c[h].destroy();
          e([d.plotLines || [], m.plotLines || [], d.plotBands || [], m.plotBands || []], function(c) {
            for (h = c.length; h--; )
              c[h].id === a && k(c, c[h]);
          });
        },
        removePlotBand: function(a) {
          this.removePlotBandOrLine(a);
        },
        removePlotLine: function(a) {
          this.removePlotBandOrLine(a);
        }
      });
    })(K, U);
    (function(a) {
      var x = a.each,
          E = a.extend,
          C = a.format,
          p = a.isNumber,
          m = a.map,
          e = a.merge,
          k = a.pick,
          w = a.splat,
          t = a.syncTimeout,
          n = a.timeUnits;
      a.Tooltip = function() {
        this.init.apply(this, arguments);
      };
      a.Tooltip.prototype = {
        init: function(a, d) {
          this.chart = a;
          this.options = d;
          this.crosshairs = [];
          this.now = {
            x: 0,
            y: 0
          };
          this.isHidden = !0;
          this.split = d.split && !a.inverted;
          this.shared = d.shared || this.split;
        },
        cleanSplit: function(a) {
          x(this.chart.series, function(c) {
            var d = c && c.tt;
            d && (!d.isActive || a ? c.tt = d.destroy() : d.isActive = !1);
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
              d = this.options;
          this.label || (this.label = this.split ? a.g("tooltip") : a.label("", 0, 0, d.shape || "callout", null, null, d.useHTML, null, "tooltip").attr({
            padding: d.padding,
            r: d.borderRadius
          }), this.applyFilter(), this.label.addClass("highcharts-tooltip-" + this.chart.index), this.label.attr({zIndex: 8}).add());
          return this.label;
        },
        update: function(a) {
          this.destroy();
          e(!0, this.chart.options.tooltip.userOptions, a);
          this.init(this.chart, e(!0, this.options, a));
        },
        destroy: function() {
          this.label && (this.label = this.label.destroy());
          this.split && this.tt && (this.cleanSplit(this.chart, !0), this.tt = this.tt.destroy());
          clearTimeout(this.hideTimer);
          clearTimeout(this.tooltipTimeout);
        },
        move: function(a, d, e, h) {
          var c = this,
              b = c.now,
              u = !1 !== c.options.animation && !c.isHidden && (1 < Math.abs(a - b.x) || 1 < Math.abs(d - b.y)),
              q = c.followPointer || 1 < c.len;
          E(b, {
            x: u ? (2 * b.x + a) / 3 : a,
            y: u ? (b.y + d) / 2 : d,
            anchorX: q ? void 0 : u ? (2 * b.anchorX + e) / 3 : e,
            anchorY: q ? void 0 : u ? (b.anchorY + h) / 2 : h
          });
          c.getLabel().attr(b);
          u && (clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function() {
            c && c.move(a, d, e, h);
          }, 32));
        },
        hide: function(a) {
          var c = this;
          clearTimeout(this.hideTimer);
          a = k(a, this.options.hideDelay, 500);
          this.isHidden || (this.hideTimer = t(function() {
            c.getLabel()[a ? "fadeOut" : "hide"]();
            c.isHidden = !0;
          }, a));
        },
        getAnchor: function(a, d) {
          var c,
              h = this.chart,
              f = h.inverted,
              b = h.plotTop,
              e = h.plotLeft,
              q = 0,
              k = 0,
              n,
              D;
          a = w(a);
          c = a[0].tooltipPos;
          this.followPointer && d && (void 0 === d.chartX && (d = h.pointer.normalize(d)), c = [d.chartX - h.plotLeft, d.chartY - b]);
          c || (x(a, function(a) {
            n = a.series.yAxis;
            D = a.series.xAxis;
            q += a.plotX + (!f && D ? D.left - e : 0);
            k += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!f && n ? n.top - b : 0);
          }), q /= a.length, k /= a.length, c = [f ? h.plotWidth - k : q, this.shared && !f && 1 < a.length && d ? d.chartY - b : f ? h.plotHeight - q : k]);
          return m(c, Math.round);
        },
        getPosition: function(a, d, e) {
          var c = this.chart,
              f = this.distance,
              b = {},
              u = c.inverted && e.h || 0,
              q,
              m = ["y", c.chartHeight, d, e.plotY + c.plotTop, c.plotTop, c.plotTop + c.plotHeight],
              n = ["x", c.chartWidth, a, e.plotX + c.plotLeft, c.plotLeft, c.plotLeft + c.plotWidth],
              D = !this.followPointer && k(e.ttBelow, !c.inverted === !!e.negative),
              F = function(a, c, h, g, d, r) {
                var l = h < g - f,
                    e = g + f + h < c,
                    q = g - f - h;
                g += f;
                if (D && e)
                  b[a] = g;
                else if (!D && l)
                  b[a] = q;
                else if (l)
                  b[a] = Math.min(r - h, 0 > q - u ? q : q - u);
                else if (e)
                  b[a] = Math.max(d, g + u + h > c ? g : g + u);
                else
                  return !1;
              },
              z = function(a, c, h, g) {
                var d;
                g < f || g > c - f ? d = !1 : b[a] = g < h / 2 ? 1 : g > c - h / 2 ? c - h - 2 : g - h / 2;
                return d;
              },
              r = function(a) {
                var b = m;
                m = n;
                n = b;
                q = a;
              },
              y = function() {
                !1 !== F.apply(0, m) ? !1 !== z.apply(0, n) || q || (r(!0), y()) : q ? b.x = b.y = 0 : (r(!0), y());
              };
          (c.inverted || 1 < this.len) && r();
          y();
          return b;
        },
        defaultFormatter: function(a) {
          var c = this.points || w(this),
              e;
          e = [a.tooltipFooterHeaderFormatter(c[0])];
          e = e.concat(a.bodyFormatter(c));
          e.push(a.tooltipFooterHeaderFormatter(c[0], !0));
          return e;
        },
        refresh: function(a, d) {
          var c,
              h = this.options,
              f = a,
              b,
              e = {},
              q = [];
          c = h.formatter || this.defaultFormatter;
          var e = this.shared,
              m;
          h.enabled && (clearTimeout(this.hideTimer), this.followPointer = w(f)[0].series.tooltipOptions.followPointer, b = this.getAnchor(f, d), d = b[0], h = b[1], !e || f.series && f.series.noSharedTooltip ? e = f.getLabelConfig() : (x(f, function(a) {
            a.setState("hover");
            q.push(a.getLabelConfig());
          }), e = {
            x: f[0].category,
            y: f[0].y
          }, e.points = q, f = f[0]), this.len = q.length, e = c.call(e, this), m = f.series, this.distance = k(m.tooltipOptions.distance, 16), !1 === e ? this.hide() : (c = this.getLabel(), this.isHidden && c.attr({opacity: 1}).show(), this.split ? this.renderSplit(e, w(a)) : (c.css({width: this.chart.spacingBox.width}), c.attr({text: e && e.join ? e.join("") : e}), c.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-" + k(f.colorIndex, m.colorIndex)), this.updatePosition({
            plotX: d,
            plotY: h,
            negative: f.negative,
            ttBelow: f.ttBelow,
            h: b[2] || 0
          })), this.isHidden = !1));
        },
        renderSplit: function(c, d) {
          var e = this,
              h = [],
              f = this.chart,
              b = f.renderer,
              u = !0,
              q = this.options,
              m = 0,
              n = this.getLabel();
          a.isString(c) && (c = [!1, c]);
          x(c.slice(0, d.length + 1), function(a, c) {
            if (!1 !== a) {
              c = d[c - 1] || {
                isHeader: !0,
                plotX: d[0].plotX
              };
              var z = c.series || e,
                  r = z.tt,
                  y = "highcharts-color-" + k(c.colorIndex, (c.series || {}).colorIndex, "none");
              r || (z.tt = r = b.label(null, null, null, "callout", null, null, q.useHTML).addClass("highcharts-tooltip-box " + y).attr({
                padding: q.padding,
                r: q.borderRadius
              }).add(n));
              r.isActive = !0;
              r.attr({text: a});
              a = r.getBBox();
              y = a.width + r.strokeWidth();
              c.isHeader ? (m = a.height, y = Math.max(0, Math.min(c.plotX + f.plotLeft - y / 2, f.chartWidth - y))) : y = c.plotX + f.plotLeft - k(q.distance, 16) - y;
              0 > y && (u = !1);
              a = (c.series && c.series.yAxis && c.series.yAxis.pos) + (c.plotY || 0);
              a -= f.plotTop;
              h.push({
                target: c.isHeader ? f.plotHeight + m : a,
                rank: c.isHeader ? 1 : 0,
                size: z.tt.getBBox().height + 1,
                point: c,
                x: y,
                tt: r
              });
            }
          });
          this.cleanSplit();
          a.distribute(h, f.plotHeight + m);
          x(h, function(a) {
            var b = a.point,
                c = b.series;
            a.tt.attr({
              visibility: void 0 === a.pos ? "hidden" : "inherit",
              x: u || b.isHeader ? a.x : b.plotX + f.plotLeft + k(q.distance, 16),
              y: a.pos + f.plotTop,
              anchorX: b.isHeader ? b.plotX + f.plotLeft : b.plotX + c.xAxis.pos,
              anchorY: b.isHeader ? a.pos + f.plotTop - 15 : b.plotY + c.yAxis.pos
            });
          });
        },
        updatePosition: function(a) {
          var c = this.chart,
              e = this.getLabel(),
              e = (this.options.positioner || this.getPosition).call(this, e.width, e.height, a);
          this.move(Math.round(e.x), Math.round(e.y || 0), a.plotX + c.plotLeft, a.plotY + c.plotTop);
        },
        getDateFormat: function(a, d, e, h) {
          var c = this.chart.time,
              b = c.dateFormat("%m-%d %H:%M:%S.%L", d),
              u,
              q,
              k = {
                millisecond: 15,
                second: 12,
                minute: 9,
                hour: 6,
                day: 3
              },
              m = "millisecond";
          for (q in n) {
            if (a === n.week && +c.dateFormat("%w", d) === e && "00:00:00.000" === b.substr(6)) {
              q = "week";
              break;
            }
            if (n[q] > a) {
              q = m;
              break;
            }
            if (k[q] && b.substr(k[q]) !== "01-01 00:00:00.000".substr(k[q]))
              break;
            "week" !== q && (m = q);
          }
          q && (u = h[q]);
          return u;
        },
        getXDateFormat: function(a, d, e) {
          d = d.dateTimeLabelFormats;
          var c = e && e.closestPointRange;
          return (c ? this.getDateFormat(c, a.x, e.options.startOfWeek, d) : d.day) || d.year;
        },
        tooltipFooterHeaderFormatter: function(a, d) {
          d = d ? "footer" : "header";
          var c = a.series,
              h = c.tooltipOptions,
              f = h.xDateFormat,
              b = c.xAxis,
              e = b && "datetime" === b.options.type && p(a.key),
              q = h[d + "Format"];
          e && !f && (f = this.getXDateFormat(a, h, b));
          e && f && x(a.point && a.point.tooltipDateKeys || ["key"], function(a) {
            q = q.replace("{point." + a + "}", "{point." + a + ":" + f + "}");
          });
          return C(q, {
            point: a,
            series: c
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
      var x = a.addEvent,
          E = a.attr,
          C = a.charts,
          p = a.css,
          m = a.defined,
          e = a.each,
          k = a.extend,
          w = a.find,
          t = a.fireEvent,
          n = a.isNumber,
          c = a.isObject,
          d = a.offset,
          A = a.pick,
          h = a.splat,
          f = a.Tooltip;
      a.Pointer = function(a, c) {
        this.init(a, c);
      };
      a.Pointer.prototype = {
        init: function(a, c) {
          this.options = c;
          this.chart = a;
          this.runChartClick = c.chart.events && !!c.chart.events.click;
          this.pinchDown = [];
          this.lastValidTouch = {};
          f && (a.tooltip = new f(a, c.tooltip), this.followTouchMove = A(c.tooltip.followTouchMove, !0));
          this.setDOMEvents();
        },
        zoomOption: function(a) {
          var b = this.chart,
              c = b.options.chart,
              f = c.zoomType || "",
              b = b.inverted;
          /touch/.test(a.type) && (f = A(c.pinchType, f));
          this.zoomX = a = /x/.test(f);
          this.zoomY = f = /y/.test(f);
          this.zoomHor = a && !b || f && b;
          this.zoomVert = f && !b || a && b;
          this.hasZoom = a || f;
        },
        normalize: function(a, c) {
          var b;
          b = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] : a;
          c || (this.chartPosition = c = d(this.chart.container));
          return k(a, {
            chartX: Math.round(b.pageX - c.left),
            chartY: Math.round(b.pageY - c.top)
          });
        },
        getCoordinates: function(a) {
          var b = {
            xAxis: [],
            yAxis: []
          };
          e(this.chart.axes, function(c) {
            b[c.isXAxis ? "xAxis" : "yAxis"].push({
              axis: c,
              value: c.toValue(a[c.horiz ? "chartX" : "chartY"])
            });
          });
          return b;
        },
        findNearestKDPoint: function(a, f, h) {
          var b;
          e(a, function(a) {
            var d = !(a.noSharedTooltip && f) && 0 > a.options.findNearestPointBy.indexOf("y");
            a = a.searchPoint(h, d);
            if ((d = c(a, !0)) && !(d = !c(b, !0)))
              var d = b.distX - a.distX,
                  e = b.dist - a.dist,
                  q = (a.series.group && a.series.group.zIndex) - (b.series.group && b.series.group.zIndex),
                  d = 0 < (0 !== d && f ? d : 0 !== e ? e : 0 !== q ? q : b.series.index > a.series.index ? -1 : 1);
            d && (b = a);
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
              f = b.xAxis,
              b = b.yAxis,
              h = A(a.clientX, a.plotX);
          if (f && b)
            return c ? {
              chartX: f.len + f.pos - h,
              chartY: b.len + b.pos - a.plotY
            } : {
              chartX: h + f.pos,
              chartY: a.plotY + b.pos
            };
        },
        getHoverData: function(b, f, h, d, k, m, n) {
          var q,
              r = [],
              u = n && n.isBoosting;
          d = !(!d || !b);
          n = f && !f.stickyTracking ? [f] : a.grep(h, function(a) {
            return a.visible && !(!k && a.directTouch) && A(a.options.enableMouseTracking, !0) && a.stickyTracking;
          });
          f = (q = d ? b : this.findNearestKDPoint(n, k, m)) && q.series;
          q && (k && !f.noSharedTooltip ? (n = a.grep(h, function(a) {
            return a.visible && !(!k && a.directTouch) && A(a.options.enableMouseTracking, !0) && !a.noSharedTooltip;
          }), e(n, function(a) {
            var b = w(a.points, function(a) {
              return a.x === q.x && !a.isNull;
            });
            c(b) && (u && (b = a.getPoint(b)), r.push(b));
          })) : r.push(q));
          return {
            hoverPoint: q,
            hoverSeries: f,
            hoverPoints: r
          };
        },
        runPointActions: function(b, c) {
          var f = this.chart,
              h = f.tooltip && f.tooltip.options.enabled ? f.tooltip : void 0,
              d = h ? h.shared : !1,
              u = c || f.hoverPoint,
              k = u && u.series || f.hoverSeries,
              k = this.getHoverData(u, k, f.series, !!c || k && k.directTouch && this.isDirectTouch, d, b, {isBoosting: f.isBoosting}),
              m,
              u = k.hoverPoint;
          m = k.hoverPoints;
          c = (k = k.hoverSeries) && k.tooltipOptions.followPointer;
          d = d && k && !k.noSharedTooltip;
          if (u && (u !== f.hoverPoint || h && h.isHidden)) {
            e(f.hoverPoints || [], function(b) {
              -1 === a.inArray(b, m) && b.setState();
            });
            e(m || [], function(a) {
              a.setState("hover");
            });
            if (f.hoverSeries !== k)
              k.onMouseOver();
            f.hoverPoint && f.hoverPoint.firePointEvent("mouseOut");
            if (!u.series)
              return;
            u.firePointEvent("mouseOver");
            f.hoverPoints = m;
            f.hoverPoint = u;
            h && h.refresh(d ? m : u, b);
          } else
            c && h && !h.isHidden && (u = h.getAnchor([{}], b), h.updatePosition({
              plotX: u[0],
              plotY: u[1]
            }));
          this.unDocMouseMove || (this.unDocMouseMove = x(f.container.ownerDocument, "mousemove", function(b) {
            var c = C[a.hoverChartIndex];
            if (c)
              c.pointer.onDocumentMouseMove(b);
          }));
          e(f.axes, function(c) {
            var f = A(c.crosshair.snap, !0),
                h = f ? a.find(m, function(a) {
                  return a.series[c.coll] === c;
                }) : void 0;
            h || !f ? c.drawCrosshair(b, h) : c.hideCrosshair();
          });
        },
        reset: function(a, c) {
          var b = this.chart,
              f = b.hoverSeries,
              d = b.hoverPoint,
              u = b.hoverPoints,
              k = b.tooltip,
              m = k && k.shared ? u : d;
          a && m && e(h(m), function(b) {
            b.series.isCartesian && void 0 === b.plotX && (a = !1);
          });
          if (a)
            k && m && (k.refresh(m), d && (d.setState(d.state, !0), e(b.axes, function(a) {
              a.crosshair && a.drawCrosshair(null, d);
            })));
          else {
            if (d)
              d.onMouseOut();
            u && e(u, function(a) {
              a.setState();
            });
            if (f)
              f.onMouseOut();
            k && k.hide(c);
            this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove());
            e(b.axes, function(a) {
              a.hideCrosshair();
            });
            this.hoverX = b.hoverPoints = b.hoverPoint = null;
          }
        },
        scaleGroups: function(a, c) {
          var b = this.chart,
              f;
          e(b.series, function(h) {
            f = a || h.getPlotBox();
            h.xAxis && h.xAxis.zoomEnabled && h.group && (h.group.attr(f), h.markerGroup && (h.markerGroup.attr(f), h.markerGroup.clip(c ? b.clipRect : null)), h.dataLabelsGroup && h.dataLabelsGroup.attr(f));
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
              f = a.chartX,
              h = a.chartY,
              d = this.zoomHor,
              e = this.zoomVert,
              k = b.plotLeft,
              r = b.plotTop,
              m = b.plotWidth,
              n = b.plotHeight,
              B,
              I = this.selectionMarker,
              g = this.mouseDownX,
              v = this.mouseDownY,
              t = c.panKey && a[c.panKey + "Key"];
          I && I.touch || (f < k ? f = k : f > k + m && (f = k + m), h < r ? h = r : h > r + n && (h = r + n), this.hasDragged = Math.sqrt(Math.pow(g - f, 2) + Math.pow(v - h, 2)), 10 < this.hasDragged && (B = b.isInsidePlot(g - k, v - r), b.hasCartesianSeries && (this.zoomX || this.zoomY) && B && !t && !I && (this.selectionMarker = I = b.renderer.rect(k, r, d ? 1 : m, e ? 1 : n, 0).attr({
            "class": "highcharts-selection-marker",
            zIndex: 7
          }).add()), I && d && (f -= g, I.attr({
            width: Math.abs(f),
            x: (0 < f ? 0 : f) + g
          })), I && e && (f = h - v, I.attr({
            height: Math.abs(f),
            y: (0 < f ? 0 : f) + v
          })), B && !I && c.panning && b.pan(a, c.panning)));
        },
        drop: function(a) {
          var b = this,
              c = this.chart,
              f = this.hasPinched;
          if (this.selectionMarker) {
            var h = {
              originalEvent: a,
              xAxis: [],
              yAxis: []
            },
                d = this.selectionMarker,
                F = d.attr ? d.attr("x") : d.x,
                z = d.attr ? d.attr("y") : d.y,
                r = d.attr ? d.attr("width") : d.width,
                y = d.attr ? d.attr("height") : d.height,
                G;
            if (this.hasDragged || f)
              e(c.axes, function(c) {
                if (c.zoomEnabled && m(c.min) && (f || b[{
                  xAxis: "zoomX",
                  yAxis: "zoomY"
                }[c.coll]])) {
                  var d = c.horiz,
                      g = "touchend" === a.type ? c.minPixelPadding : 0,
                      e = c.toValue((d ? F : z) + g),
                      d = c.toValue((d ? F + r : z + y) - g);
                  h[c.coll].push({
                    axis: c,
                    min: Math.min(e, d),
                    max: Math.max(e, d)
                  });
                  G = !0;
                }
              }), G && t(c, "selection", h, function(a) {
                c.zoom(k(a, f ? {animation: !1} : null));
              });
            n(c.index) && (this.selectionMarker = this.selectionMarker.destroy());
            f && this.scaleGroups();
          }
          c && n(c.index) && (p(c.container, {cursor: c._cursor}), c.cancelClick = 10 < this.hasDragged, c.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = []);
        },
        onContainerMouseDown: function(a) {
          a = this.normalize(a);
          2 !== a.button && (this.zoomOption(a), a.preventDefault && a.preventDefault(), this.dragStart(a));
        },
        onDocumentMouseUp: function(b) {
          C[a.hoverChartIndex] && C[a.hoverChartIndex].pointer.drop(b);
        },
        onDocumentMouseMove: function(a) {
          var b = this.chart,
              c = this.chartPosition;
          a = this.normalize(a, c);
          !c || this.inClass(a.target, "highcharts-tracker") || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) || this.reset();
        },
        onContainerMouseLeave: function(b) {
          var c = C[a.hoverChartIndex];
          c && (b.relatedTarget || b.toElement) && (c.pointer.reset(), c.pointer.chartPosition = null);
        },
        onContainerMouseMove: function(b) {
          var c = this.chart;
          m(a.hoverChartIndex) && C[a.hoverChartIndex] && C[a.hoverChartIndex].mouseIsDown || (a.hoverChartIndex = c.index);
          b = this.normalize(b);
          b.returnValue = !1;
          "mousedown" === c.mouseIsDown && this.drag(b);
          !this.inClass(b.target, "highcharts-tracker") && !c.isInsidePlot(b.chartX - c.plotLeft, b.chartY - c.plotTop) || c.openMenu || this.runPointActions(b);
        },
        inClass: function(a, c) {
          for (var b; a; ) {
            if (b = E(a, "class")) {
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
              f = b.plotLeft,
              h = b.plotTop;
          a = this.normalize(a);
          b.cancelClick || (c && this.inClass(a.target, "highcharts-tracker") ? (t(c.series, "click", k(a, {point: c})), b.hoverPoint && c.firePointEvent("click", a)) : (k(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - f, a.chartY - h) && t(b, "click", a)));
        },
        setDOMEvents: function() {
          var b = this,
              c = b.chart.container,
              f = c.ownerDocument;
          c.onmousedown = function(a) {
            b.onContainerMouseDown(a);
          };
          c.onmousemove = function(a) {
            b.onContainerMouseMove(a);
          };
          c.onclick = function(a) {
            b.onContainerClick(a);
          };
          this.unbindContainerMouseLeave = x(c, "mouseleave", b.onContainerMouseLeave);
          a.unbindDocumentMouseUp || (a.unbindDocumentMouseUp = x(f, "mouseup", b.onDocumentMouseUp));
          a.hasTouch && (c.ontouchstart = function(a) {
            b.onContainerTouchStart(a);
          }, c.ontouchmove = function(a) {
            b.onContainerTouchMove(a);
          }, a.unbindDocumentTouchEnd || (a.unbindDocumentTouchEnd = x(f, "touchend", b.onDocumentTouchEnd)));
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
    })(K);
    (function(a) {
      var x = a.charts,
          E = a.each,
          C = a.extend,
          p = a.map,
          m = a.noop,
          e = a.pick;
      C(a.Pointer.prototype, {
        pinchTranslate: function(a, e, m, n, c, d) {
          this.zoomHor && this.pinchTranslateDirection(!0, a, e, m, n, c, d);
          this.zoomVert && this.pinchTranslateDirection(!1, a, e, m, n, c, d);
        },
        pinchTranslateDirection: function(a, e, m, n, c, d, p, h) {
          var f = this.chart,
              b = a ? "x" : "y",
              k = a ? "X" : "Y",
              q = "chart" + k,
              t = a ? "width" : "height",
              w = f["plot" + (a ? "Left" : "Top")],
              D,
              F,
              z = h || 1,
              r = f.inverted,
              y = f.bounds[a ? "h" : "v"],
              G = 1 === e.length,
              B = e[0][q],
              I = m[0][q],
              g = !G && e[1][q],
              v = !G && m[1][q],
              L;
          m = function() {
            !G && 20 < Math.abs(B - g) && (z = h || Math.abs(I - v) / Math.abs(B - g));
            F = (w - I) / z + B;
            D = f["plot" + (a ? "Width" : "Height")] / z;
          };
          m();
          e = F;
          e < y.min ? (e = y.min, L = !0) : e + D > y.max && (e = y.max - D, L = !0);
          L ? (I -= .8 * (I - p[b][0]), G || (v -= .8 * (v - p[b][1])), m()) : p[b] = [I, v];
          r || (d[b] = F - w, d[t] = D);
          d = r ? 1 / z : z;
          c[t] = D;
          c[b] = e;
          n[r ? a ? "scaleY" : "scaleX" : "scale" + k] = z;
          n["translate" + k] = d * w + (I - d * B);
        },
        pinch: function(a) {
          var k = this,
              t = k.chart,
              n = k.pinchDown,
              c = a.touches,
              d = c.length,
              A = k.lastValidTouch,
              h = k.hasZoom,
              f = k.selectionMarker,
              b = {},
              u = 1 === d && (k.inClass(a.target, "highcharts-tracker") && t.runTrackerClick || k.runChartClick),
              q = {};
          1 < d && (k.initiated = !0);
          h && k.initiated && !u && a.preventDefault();
          p(c, function(a) {
            return k.normalize(a);
          });
          "touchstart" === a.type ? (E(c, function(a, b) {
            n[b] = {
              chartX: a.chartX,
              chartY: a.chartY
            };
          }), A.x = [n[0].chartX, n[1] && n[1].chartX], A.y = [n[0].chartY, n[1] && n[1].chartY], E(t.axes, function(a) {
            if (a.zoomEnabled) {
              var b = t.bounds[a.horiz ? "h" : "v"],
                  c = a.minPixelPadding,
                  f = a.toPixels(e(a.options.min, a.dataMin)),
                  h = a.toPixels(e(a.options.max, a.dataMax)),
                  d = Math.max(f, h);
              b.min = Math.min(a.pos, Math.min(f, h) - c);
              b.max = Math.max(a.pos + a.len, d + c);
            }
          }), k.res = !0) : k.followTouchMove && 1 === d ? this.runPointActions(k.normalize(a)) : n.length && (f || (k.selectionMarker = f = C({
            destroy: m,
            touch: !0
          }, t.plotBox)), k.pinchTranslate(n, c, b, f, q, A), k.hasPinched = h, k.scaleGroups(b, q), k.res && (k.res = !1, this.reset(!1, 0)));
        },
        touch: function(k, m) {
          var p = this.chart,
              n,
              c;
          if (p.index !== a.hoverChartIndex)
            this.onContainerMouseLeave({relatedTarget: !0});
          a.hoverChartIndex = p.index;
          1 === k.touches.length ? (k = this.normalize(k), (c = p.isInsidePlot(k.chartX - p.plotLeft, k.chartY - p.plotTop)) && !p.openMenu ? (m && this.runPointActions(k), "touchmove" === k.type && (m = this.pinchDown, n = m[0] ? 4 <= Math.sqrt(Math.pow(m[0].chartX - k.chartX, 2) + Math.pow(m[0].chartY - k.chartY, 2)) : !1), e(n, !0) && this.pinch(k)) : m && this.reset()) : 2 === k.touches.length && this.pinch(k);
        },
        onContainerTouchStart: function(a) {
          this.zoomOption(a);
          this.touch(a, !0);
        },
        onContainerTouchMove: function(a) {
          this.touch(a);
        },
        onDocumentTouchEnd: function(e) {
          x[a.hoverChartIndex] && x[a.hoverChartIndex].pointer.drop(e);
        }
      });
    })(K);
    (function(a) {
      var x = a.addEvent,
          E = a.charts,
          C = a.css,
          p = a.doc,
          m = a.extend,
          e = a.noop,
          k = a.Pointer,
          w = a.removeEvent,
          t = a.win,
          n = a.wrap;
      if (!a.hasTouch && (t.PointerEvent || t.MSPointerEvent)) {
        var c = {},
            d = !!t.PointerEvent,
            A = function() {
              var f = [];
              f.item = function(a) {
                return this[a];
              };
              a.objectEach(c, function(a) {
                f.push({
                  pageX: a.pageX,
                  pageY: a.pageY,
                  target: a.target
                });
              });
              return f;
            },
            h = function(c, b, h, d) {
              "touch" !== c.pointerType && c.pointerType !== c.MSPOINTER_TYPE_TOUCH || !E[a.hoverChartIndex] || (d(c), d = E[a.hoverChartIndex].pointer, d[b]({
                type: h,
                target: c.currentTarget,
                preventDefault: e,
                touches: A()
              }));
            };
        m(k.prototype, {
          onContainerPointerDown: function(a) {
            h(a, "onContainerTouchStart", "touchstart", function(a) {
              c[a.pointerId] = {
                pageX: a.pageX,
                pageY: a.pageY,
                target: a.currentTarget
              };
            });
          },
          onContainerPointerMove: function(a) {
            h(a, "onContainerTouchMove", "touchmove", function(a) {
              c[a.pointerId] = {
                pageX: a.pageX,
                pageY: a.pageY
              };
              c[a.pointerId].target || (c[a.pointerId].target = a.currentTarget);
            });
          },
          onDocumentPointerUp: function(a) {
            h(a, "onDocumentTouchEnd", "touchend", function(a) {
              delete c[a.pointerId];
            });
          },
          batchMSEvents: function(a) {
            a(this.chart.container, d ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown);
            a(this.chart.container, d ? "pointermove" : "MSPointerMove", this.onContainerPointerMove);
            a(p, d ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp);
          }
        });
        n(k.prototype, "init", function(a, b, c) {
          a.call(this, b, c);
          this.hasZoom && C(b.container, {
            "-ms-touch-action": "none",
            "touch-action": "none"
          });
        });
        n(k.prototype, "setDOMEvents", function(a) {
          a.apply(this);
          (this.hasZoom || this.followTouchMove) && this.batchMSEvents(x);
        });
        n(k.prototype, "destroy", function(a) {
          this.batchMSEvents(w);
          a.call(this);
        });
      }
    })(K);
    (function(a) {
      var x = a.addEvent,
          E = a.css,
          C = a.discardElement,
          p = a.defined,
          m = a.each,
          e = a.isFirefox,
          k = a.marginNames,
          w = a.merge,
          t = a.pick,
          n = a.setAnimation,
          c = a.stableSort,
          d = a.win,
          A = a.wrap;
      a.Legend = function(a, c) {
        this.init(a, c);
      };
      a.Legend.prototype = {
        init: function(a, c) {
          this.chart = a;
          this.setOptions(c);
          c.enabled && (this.render(), x(this.chart, "endResize", function() {
            this.legend.positionCheckboxes();
          }));
        },
        setOptions: function(a) {
          var c = t(a.padding, 8);
          this.options = a;
          this.itemMarginTop = a.itemMarginTop || 0;
          this.padding = c;
          this.initialItemY = c - 5;
          this.itemHeight = this.maxItemWidth = 0;
          this.symbolWidth = t(a.symbolWidth, 16);
          this.pages = [];
        },
        update: function(a, c) {
          var b = this.chart;
          this.setOptions(w(!0, this.options, a));
          this.destroy();
          b.isDirtyLegend = b.isDirtyBox = !0;
          t(c, !0) && b.redraw();
        },
        colorizeItem: function(a, c) {
          a.legendGroup[c ? "removeClass" : "addClass"]("highcharts-legend-item-hidden");
        },
        positionItem: function(a) {
          var c = this.options,
              b = c.symbolPadding,
              c = !c.rtl,
              h = a._legendItemPos,
              d = h[0],
              h = h[1],
              e = a.checkbox;
          (a = a.legendGroup) && a.element && a.translate(c ? d : this.legendWidth - d - 2 * b - 4, h);
          e && (e.x = d, e.y = h);
        },
        destroyItem: function(a) {
          var c = a.checkbox;
          m(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function(b) {
            a[b] && (a[b] = a[b].destroy());
          });
          c && C(a.checkbox);
        },
        destroy: function() {
          function a(a) {
            this[a] && (this[a] = this[a].destroy());
          }
          m(this.getAllItems(), function(c) {
            m(["legendItem", "legendGroup"], a, c);
          });
          m("clipRect up down pager nav box title group".split(" "), a, this);
          this.display = null;
        },
        positionCheckboxes: function() {
          var a = this.group && this.group.alignAttr,
              c,
              b = this.clipHeight || this.legendHeight,
              d = this.titleHeight;
          a && (c = a.translateY, m(this.allItems, function(f) {
            var h = f.checkbox,
                e;
            h && (e = c + d + h.y + (this.scrollOffset || 0) + 3, E(h, {
              left: a.translateX + f.checkboxOffset + h.x - 20 + "px",
              top: e + "px",
              display: e > c - 6 && e < c + b - 6 ? "" : "none"
            }));
          }, this));
        },
        renderTitle: function() {
          var a = this.options,
              c = this.padding,
              b = a.title,
              d = 0;
          b.text && (this.title || (this.title = this.chart.renderer.label(b.text, c - 3, c - 4, null, null, null, a.useHTML, null, "legend-title").attr({zIndex: 1}).add(this.group)), a = this.title.getBBox(), d = a.height, this.offsetWidth = a.width, this.contentGroup.attr({translateY: d}));
          this.titleHeight = d;
        },
        setText: function(c) {
          var f = this.options;
          c.legendItem.attr({text: f.labelFormat ? a.format(f.labelFormat, c, this.chart.time) : f.labelFormatter.call(c)});
        },
        renderItem: function(a) {
          var c = this.chart,
              b = c.renderer,
              d = this.options,
              h = "horizontal" === d.layout,
              e = this.symbolWidth,
              k = d.symbolPadding,
              m = this.padding,
              n = h ? t(d.itemDistance, 20) : 0,
              p = !d.rtl,
              r = d.width,
              y = d.itemMarginBottom || 0,
              G = this.itemMarginTop,
              B = a.legendItem,
              I = !a.series,
              g = !I && a.series.drawLegendSymbol ? a.series : a,
              v = g.options,
              L = this.createCheckboxForItem && v && v.showCheckbox,
              v = e + k + n + (L ? 20 : 0),
              l = d.useHTML,
              J = a.options.className;
          B || (a.legendGroup = b.g("legend-item").addClass("highcharts-" + g.type + "-series highcharts-color-" + a.colorIndex + (J ? " " + J : "") + (I ? " highcharts-series-" + a.index : "")).attr({zIndex: 1}).add(this.scrollGroup), a.legendItem = B = b.text("", p ? e + k : -k, this.baseline || 0, l).attr({
            align: p ? "left" : "right",
            zIndex: 2
          }).add(a.legendGroup), this.baseline || (this.fontMetrics = b.fontMetrics(12, B), this.baseline = this.fontMetrics.f + 3 + G, B.attr("y", this.baseline)), this.symbolHeight = d.symbolHeight || this.fontMetrics.f, g.drawLegendSymbol(this, a), this.setItemEvents && this.setItemEvents(a, B, l), L && this.createCheckboxForItem(a));
          this.colorizeItem(a, a.visible);
          B.css({width: (d.itemWidth || d.width || c.spacingBox.width) - v});
          this.setText(a);
          b = B.getBBox();
          e = a.checkboxOffset = d.itemWidth || a.legendItemWidth || b.width + v;
          this.itemHeight = b = Math.round(a.legendItemHeight || b.height || this.symbolHeight);
          h && this.itemX - m + e > (r || c.spacingBox.width - 2 * m - d.x) && (this.itemX = m, this.itemY += G + this.lastLineHeight + y, this.lastLineHeight = 0);
          this.maxItemWidth = Math.max(this.maxItemWidth, e);
          this.lastItemY = G + this.itemY + y;
          this.lastLineHeight = Math.max(b, this.lastLineHeight);
          a._legendItemPos = [this.itemX, this.itemY];
          h ? this.itemX += e : (this.itemY += G + b + y, this.lastLineHeight = b);
          this.offsetWidth = r || Math.max((h ? this.itemX - m - (a.checkbox ? 0 : n) : e) + m, this.offsetWidth);
        },
        getAllItems: function() {
          var a = [];
          m(this.chart.series, function(c) {
            var b = c && c.options;
            c && t(b.showInLegend, p(b.linkedTo) ? !1 : void 0, !0) && (a = a.concat(c.legendItems || ("point" === b.legendType ? c.data : c)));
          });
          return a;
        },
        getAlignment: function() {
          var a = this.options;
          return a.floating ? "" : a.align.charAt(0) + a.verticalAlign.charAt(0) + a.layout.charAt(0);
        },
        adjustMargins: function(a, c) {
          var b = this.chart,
              f = this.options,
              d = this.getAlignment();
          d && m([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function(h, e) {
            h.test(d) && !p(a[e]) && (b[k[e]] = Math.max(b[k[e]], b.legend[(e + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][e] * f[e % 2 ? "x" : "y"] + t(f.margin, 12) + c[e] + (0 === e ? b.titleOffset + b.options.title.margin : 0)));
          });
        },
        render: function() {
          var a = this,
              f = a.chart,
              b = f.renderer,
              d = a.group,
              e,
              k,
              n,
              p,
              t = a.box,
              z = a.options,
              r = a.padding;
          a.itemX = r;
          a.itemY = a.initialItemY;
          a.offsetWidth = 0;
          a.lastItemY = 0;
          d || (a.group = d = b.g("legend").attr({zIndex: 7}).add(), a.contentGroup = b.g().attr({zIndex: 1}).add(d), a.scrollGroup = b.g().add(a.contentGroup));
          a.renderTitle();
          e = a.getAllItems();
          c(e, function(a, b) {
            return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0);
          });
          z.reversed && e.reverse();
          a.allItems = e;
          a.display = k = !!e.length;
          a.lastLineHeight = 0;
          m(e, function(b) {
            a.renderItem(b);
          });
          n = (z.width || a.offsetWidth) + r;
          p = a.lastItemY + a.lastLineHeight + a.titleHeight;
          p = a.handleOverflow(p);
          p += r;
          t || (a.box = t = b.rect().addClass("highcharts-legend-box").attr({r: z.borderRadius}).add(d), t.isNew = !0);
          0 < n && 0 < p && (t[t.isNew ? "attr" : "animate"](t.crisp.call({}, {
            x: 0,
            y: 0,
            width: n,
            height: p
          }, t.strokeWidth())), t.isNew = !1);
          t[k ? "show" : "hide"]();
          "none" === d.getStyle("display") && (n = p = 0);
          a.legendWidth = n;
          a.legendHeight = p;
          m(e, function(b) {
            a.positionItem(b);
          });
          k && (b = f.spacingBox, /(lth|ct|rth)/.test(a.getAlignment()) && (b = w(b, {y: b.y + f.titleOffset + f.options.title.margin})), d.align(w(z, {
            width: n,
            height: p
          }), !0, b));
          f.isResizing || this.positionCheckboxes();
        },
        handleOverflow: function(a) {
          var c = this,
              b = this.chart,
              d = b.renderer,
              e = this.options,
              h = e.y,
              k = this.padding,
              b = b.spacingBox.height + ("top" === e.verticalAlign ? -h : h) - k,
              h = e.maxHeight,
              n,
              p = this.clipRect,
              z = e.navigation,
              r = t(z.animation, !0),
              y = z.arrowSize || 12,
              G = this.nav,
              B = this.pages,
              I,
              g = this.allItems,
              v = function(a) {
                "number" === typeof a ? p.attr({height: a}) : p && (c.clipRect = p.destroy(), c.contentGroup.clip());
                c.contentGroup.div && (c.contentGroup.div.style.clip = a ? "rect(" + k + "px,9999px," + (k + a) + "px,0)" : "auto");
              };
          "horizontal" !== e.layout || "middle" === e.verticalAlign || e.floating || (b /= 2);
          h && (b = Math.min(b, h));
          B.length = 0;
          a > b && !1 !== z.enabled ? (this.clipHeight = n = Math.max(b - 20 - this.titleHeight - k, 0), this.currentPage = t(this.currentPage, 1), this.fullHeight = a, m(g, function(a, b) {
            var c = a._legendItemPos[1],
                l = Math.round(a.legendItem.getBBox().height),
                f = B.length;
            if (!f || c - B[f - 1] > n && (I || c) !== B[f - 1])
              B.push(I || c), f++;
            a.pageIx = f - 1;
            I && (g[b - 1].pageIx = f - 1);
            b === g.length - 1 && c + l - B[f - 1] > n && (B.push(c), a.pageIx = f);
            c !== I && (I = c);
          }), p || (p = c.clipRect = d.clipRect(0, k, 9999, 0), c.contentGroup.clip(p)), v(n), G || (this.nav = G = d.g().attr({zIndex: 1}).add(this.group), this.up = d.symbol("triangle", 0, 0, y, y).on("click", function() {
            c.scroll(-1, r);
          }).add(G), this.pager = d.text("", 15, 10).addClass("highcharts-legend-navigation").add(G), this.down = d.symbol("triangle-down", 0, 0, y, y).on("click", function() {
            c.scroll(1, r);
          }).add(G)), c.scroll(0), a = b) : G && (v(), this.nav = G.destroy(), this.scrollGroup.attr({translateY: 1}), this.clipHeight = 0);
          return a;
        },
        scroll: function(a, c) {
          var b = this.pages,
              f = b.length;
          a = this.currentPage + a;
          var d = this.clipHeight,
              e = this.pager,
              h = this.padding;
          a > f && (a = f);
          0 < a && (void 0 !== c && n(c, this.chart), this.nav.attr({
            translateX: h,
            translateY: d + this.padding + 7 + this.titleHeight,
            visibility: "visible"
          }), this.up.attr({"class": 1 === a ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"}), e.attr({text: a + "/" + f}), this.down.attr({
            x: 18 + this.pager.getBBox().width,
            "class": a === f ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
          }), this.scrollOffset = -b[a - 1] + this.initialItemY, this.scrollGroup.animate({translateY: this.scrollOffset}), this.currentPage = a, this.positionCheckboxes());
        }
      };
      a.LegendSymbolMixin = {
        drawRectangle: function(a, c) {
          var b = a.symbolHeight,
              f = a.options.squareSymbol;
          c.legendSymbol = this.chart.renderer.rect(f ? (a.symbolWidth - b) / 2 : 0, a.baseline - b + 1, f ? b : a.symbolWidth, b, t(a.options.symbolRadius, b / 2)).addClass("highcharts-point").attr({zIndex: 3}).add(c.legendGroup);
        },
        drawLineMarker: function(a) {
          var c = this.options.marker,
              b,
              d = a.symbolWidth,
              e = a.symbolHeight;
          b = e / 2;
          var h = this.chart.renderer,
              k = this.legendGroup;
          a = a.baseline - Math.round(.3 * a.fontMetrics.b);
          this.legendLine = h.path(["M", 0, a, "L", d, a]).addClass("highcharts-graph").attr({}).add(k);
          c && !1 !== c.enabled && (b = Math.min(t(c.radius, b), b), 0 === this.symbol.indexOf("url") && (c = w(c, {
            width: e,
            height: e
          }), b = 0), this.legendSymbol = c = h.symbol(this.symbol, d / 2 - b, a - b, 2 * b, 2 * b, c).addClass("highcharts-point").add(k), c.isMarker = !0);
        }
      };
      (/Trident\/7\.0/.test(d.navigator.userAgent) || e) && A(a.Legend.prototype, "positionItem", function(a, c) {
        var b = this,
            f = function() {
              c._legendItemPos && a.call(b, c);
            };
        f();
        setTimeout(f);
      });
    })(K);
    (function(a) {
      var x = a.addEvent,
          E = a.animObject,
          C = a.attr,
          p = a.doc,
          m = a.Axis,
          e = a.createElement,
          k = a.defaultOptions,
          w = a.discardElement,
          t = a.charts,
          n = a.defined,
          c = a.each,
          d = a.extend,
          A = a.find,
          h = a.fireEvent,
          f = a.grep,
          b = a.isNumber,
          u = a.isObject,
          q = a.isString,
          H = a.Legend,
          M = a.marginNames,
          D = a.merge,
          F = a.objectEach,
          z = a.Pointer,
          r = a.pick,
          y = a.pInt,
          G = a.removeEvent,
          B = a.seriesTypes,
          I = a.splat,
          g = a.syncTimeout,
          v = a.win,
          L = a.Chart = function() {
            this.getArgs.apply(this, arguments);
          };
      a.chart = function(a, b, c) {
        return new L(a, b, c);
      };
      d(L.prototype, {
        callbacks: [],
        getArgs: function() {
          var a = [].slice.call(arguments);
          if (q(a[0]) || a[0].nodeName)
            this.renderTo = a.shift();
          this.init(a[0], a[1]);
        },
        init: function(b, c) {
          var l,
              g,
              f = b.series,
              d = b.plotOptions || {};
          b.series = null;
          l = D(k, b);
          for (g in l.plotOptions)
            l.plotOptions[g].tooltip = d[g] && D(d[g].tooltip) || void 0;
          l.tooltip.userOptions = b.chart && b.chart.forExport && b.tooltip.userOptions || b.tooltip;
          l.series = b.series = f;
          this.userOptions = b;
          g = l.chart;
          f = g.events;
          this.margin = [];
          this.spacing = [];
          this.bounds = {
            h: {},
            v: {}
          };
          this.labelCollectors = [];
          this.callback = c;
          this.isResizing = 0;
          this.options = l;
          this.axes = [];
          this.series = [];
          this.time = b.time && a.keys(b.time).length ? new a.Time(b.time) : a.time;
          this.hasCartesianSeries = g.showAxes;
          var e = this;
          e.index = t.length;
          t.push(e);
          a.chartCount++;
          f && F(f, function(a, b) {
            x(e, b, a);
          });
          e.xAxis = [];
          e.yAxis = [];
          e.pointCount = e.colorCounter = e.symbolCounter = 0;
          e.firstRender();
        },
        initSeries: function(b) {
          var c = this.options.chart;
          (c = B[b.type || c.type || c.defaultSeriesType]) || a.error(17, !0);
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
          var g = c ? b : a;
          a = c ? a : b;
          return 0 <= g && g <= this.plotWidth && 0 <= a && a <= this.plotHeight;
        },
        redraw: function(b) {
          var g = this.axes,
              l = this.series,
              f = this.pointer,
              e = this.legend,
              r = this.isDirtyLegend,
              k,
              m,
              y = this.hasCartesianSeries,
              n = this.isDirtyBox,
              q,
              G = this.renderer,
              u = G.isHidden(),
              B = [];
          this.setResponsive && this.setResponsive(!1);
          a.setAnimation(b, this);
          u && this.temporaryDisplay();
          this.layOutTitles();
          for (b = l.length; b--; )
            if (q = l[b], q.options.stacking && (k = !0, q.isDirty)) {
              m = !0;
              break;
            }
          if (m)
            for (b = l.length; b--; )
              q = l[b], q.options.stacking && (q.isDirty = !0);
          c(l, function(a) {
            a.isDirty && "point" === a.options.legendType && (a.updateTotals && a.updateTotals(), r = !0);
            a.isDirtyData && h(a, "updatedData");
          });
          r && e.options.enabled && (e.render(), this.isDirtyLegend = !1);
          k && this.getStacks();
          y && c(g, function(a) {
            a.updateNames();
            a.setScale();
          });
          this.getMargins();
          y && (c(g, function(a) {
            a.isDirty && (n = !0);
          }), c(g, function(a) {
            var b = a.min + "," + a.max;
            a.extKey !== b && (a.extKey = b, B.push(function() {
              h(a, "afterSetExtremes", d(a.eventArgs, a.getExtremes()));
              delete a.eventArgs;
            }));
            (n || k) && a.redraw();
          }));
          n && this.drawChartBox();
          h(this, "predraw");
          c(l, function(a) {
            (n || a.isDirty) && a.visible && a.redraw();
            a.isDirtyData = !1;
          });
          f && f.reset(!0);
          G.draw();
          h(this, "redraw");
          h(this, "render");
          u && this.temporaryDisplay(!0);
          c(B, function(a) {
            a.call();
          });
        },
        get: function(a) {
          function b(b) {
            return b.id === a || b.options && b.options.id === a;
          }
          var c,
              g = this.series,
              l;
          c = A(this.axes, b) || A(this.series, b);
          for (l = 0; !c && l < g.length; l++)
            c = A(g[l].points || [], b);
          return c;
        },
        getAxes: function() {
          var a = this,
              b = this.options,
              g = b.xAxis = I(b.xAxis || {}),
              b = b.yAxis = I(b.yAxis || {});
          h(this, "beforeGetAxes");
          c(g, function(a, b) {
            a.index = b;
            a.isX = !0;
          });
          c(b, function(a, b) {
            a.index = b;
          });
          g = g.concat(b);
          c(g, function(b) {
            new m(a, b);
          });
        },
        getSelectedPoints: function() {
          var a = [];
          c(this.series, function(b) {
            a = a.concat(f(b.data || [], function(a) {
              return a.selected;
            }));
          });
          return a;
        },
        getSelectedSeries: function() {
          return f(this.series, function(a) {
            return a.selected;
          });
        },
        setTitle: function(a, b, g) {
          var l = this,
              f = l.options,
              d;
          d = f.title = D(f.title, a);
          f = f.subtitle = D(f.subtitle, b);
          c([["title", a, d], ["subtitle", b, f]], function(a, b) {
            var c = a[0],
                g = l[c],
                f = a[1];
            a = a[2];
            g && f && (l[c] = g = g.destroy());
            a && !g && (l[c] = l.renderer.text(a.text, 0, 0, a.useHTML).attr({
              align: a.align,
              "class": "highcharts-" + c,
              zIndex: a.zIndex || 4
            }).add(), l[c].update = function(a) {
              l.setTitle(!b && a, b && a);
            });
          });
          l.layOutTitles(g);
        },
        layOutTitles: function(a) {
          var b = 0,
              g,
              l = this.renderer,
              f = this.spacingBox;
          c(["title", "subtitle"], function(a) {
            var c = this[a],
                g = this.options[a];
            a = "title" === a ? -3 : g.verticalAlign ? 0 : b + 2;
            var e;
            c && (e = l.fontMetrics(e, c).b, c.css({width: (g.width || f.width + g.widthAdjust) + "px"}).align(d({y: a + e}, g), !1, "spacingBox"), g.floating || g.verticalAlign || (b = Math.ceil(b + c.getBBox(g.useHTML).height)));
          }, this);
          g = this.titleOffset !== b;
          this.titleOffset = b;
          !this.isDirtyBox && g && (this.isDirtyBox = g, this.hasRendered && r(a, !0) && this.isDirtyBox && this.redraw());
        },
        getChartSize: function() {
          var b = this.options.chart,
              c = b.width,
              b = b.height,
              g = this.renderTo;
          n(c) || (this.containerWidth = a.getStyle(g, "width"));
          n(b) || (this.containerHeight = a.getStyle(g, "height"));
          this.chartWidth = Math.max(0, c || this.containerWidth || 600);
          this.chartHeight = Math.max(0, a.relativeLength(b, this.chartWidth) || (1 < this.containerHeight ? this.containerHeight : 400));
        },
        temporaryDisplay: function(b) {
          var c = this.renderTo;
          if (b)
            for (; c && c.style; )
              c.hcOrigStyle && (a.css(c, c.hcOrigStyle), delete c.hcOrigStyle), c.hcOrigDetached && (p.body.removeChild(c), c.hcOrigDetached = !1), c = c.parentNode;
          else
            for (; c && c.style; ) {
              p.body.contains(c) || c.parentNode || (c.hcOrigDetached = !0, p.body.appendChild(c));
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
              if (c === p.body)
                break;
            }
        },
        setClassName: function(a) {
          this.container.className = "highcharts-container " + (a || "");
        },
        getContainer: function() {
          var c,
              g = this.options,
              f = g.chart,
              d,
              h;
          c = this.renderTo;
          var r = a.uniqueKey(),
              k;
          c || (this.renderTo = c = f.renderTo);
          q(c) && (this.renderTo = c = p.getElementById(c));
          c || a.error(13, !0);
          d = y(C(c, "data-highcharts-chart"));
          b(d) && t[d] && t[d].hasRendered && t[d].destroy();
          C(c, "data-highcharts-chart", this.index);
          c.innerHTML = "";
          f.skipClone || c.offsetWidth || this.temporaryDisplay();
          this.getChartSize();
          d = this.chartWidth;
          h = this.chartHeight;
          this.container = c = e("div", {id: r}, void 0, c);
          this._cursor = c.style.cursor;
          this.renderer = new (a[f.renderer] || a.Renderer)(c, d, h, null, f.forExport, g.exporting && g.exporting.allowHTML);
          this.setClassName(f.className);
          for (k in g.defs)
            this.renderer.definition(g.defs[k]);
          this.renderer.chartIndex = this.index;
        },
        getMargins: function(a) {
          var b = this.spacing,
              c = this.margin,
              g = this.titleOffset;
          this.resetMargins();
          g && !n(c[0]) && (this.plotTop = Math.max(this.plotTop, g + this.options.title.margin + b[0]));
          this.legend && this.legend.display && this.legend.adjustMargins(c, b);
          this.extraMargin && (this[this.extraMargin.type] = (this[this.extraMargin.type] || 0) + this.extraMargin.value);
          this.adjustPlotArea && this.adjustPlotArea();
          a || this.getAxisMargins();
        },
        getAxisMargins: function() {
          var a = this,
              b = a.axisOffset = [0, 0, 0, 0],
              g = a.margin;
          a.hasCartesianSeries && c(a.axes, function(a) {
            a.visible && a.getOffset();
          });
          c(M, function(c, f) {
            n(g[f]) || (a[c] += b[f]);
          });
          a.setChartSize();
        },
        reflow: function(b) {
          var c = this,
              f = c.options.chart,
              l = c.renderTo,
              d = n(f.width) && n(f.height),
              e = f.width || a.getStyle(l, "width"),
              f = f.height || a.getStyle(l, "height"),
              l = b ? b.target : v;
          if (!d && !c.isPrinting && e && f && (l === v || l === p)) {
            if (e !== c.containerWidth || f !== c.containerHeight)
              clearTimeout(c.reflowTimeout), c.reflowTimeout = g(function() {
                c.container && c.setSize(void 0, void 0, !1);
              }, b ? 100 : 0);
            c.containerWidth = e;
            c.containerHeight = f;
          }
        },
        initReflow: function() {
          var a = this,
              b;
          b = x(v, "resize", function(b) {
            a.reflow(b);
          });
          x(a, "destroy", b);
        },
        setSize: function(b, f, d) {
          var l = this,
              e = l.renderer;
          l.isResizing += 1;
          a.setAnimation(d, l);
          l.oldChartHeight = l.chartHeight;
          l.oldChartWidth = l.chartWidth;
          void 0 !== b && (l.options.chart.width = b);
          void 0 !== f && (l.options.chart.height = f);
          l.getChartSize();
          l.setChartSize(!0);
          e.setSize(l.chartWidth, l.chartHeight, d);
          c(l.axes, function(a) {
            a.isDirty = !0;
            a.setScale();
          });
          l.isDirtyLegend = !0;
          l.isDirtyBox = !0;
          l.layOutTitles();
          l.getMargins();
          l.redraw(d);
          l.oldChartHeight = null;
          h(l, "resize");
          g(function() {
            l && h(l, "endResize", null, function() {
              --l.isResizing;
            });
          }, E(void 0).duration);
        },
        setChartSize: function(a) {
          var b = this.inverted,
              g = this.renderer,
              f = this.chartWidth,
              l = this.chartHeight,
              d = this.options.chart,
              e = this.spacing,
              h = this.clipOffset,
              r,
              k,
              m,
              y;
          this.plotLeft = r = Math.round(this.plotLeft);
          this.plotTop = k = Math.round(this.plotTop);
          this.plotWidth = m = Math.max(0, Math.round(f - r - this.marginRight));
          this.plotHeight = y = Math.max(0, Math.round(l - k - this.marginBottom));
          this.plotSizeX = b ? y : m;
          this.plotSizeY = b ? m : y;
          this.plotBorderWidth = d.plotBorderWidth || 0;
          this.spacingBox = g.spacingBox = {
            x: e[3],
            y: e[0],
            width: f - e[3] - e[1],
            height: l - e[0] - e[2]
          };
          this.plotBox = g.plotBox = {
            x: r,
            y: k,
            width: m,
            height: y
          };
          f = 2 * Math.floor(this.plotBorderWidth / 2);
          b = Math.ceil(Math.max(f, h[3]) / 2);
          g = Math.ceil(Math.max(f, h[0]) / 2);
          this.clipBox = {
            x: b,
            y: g,
            width: Math.floor(this.plotSizeX - Math.max(f, h[1]) / 2 - b),
            height: Math.max(0, Math.floor(this.plotSizeY - Math.max(f, h[2]) / 2 - g))
          };
          a || c(this.axes, function(a) {
            a.setAxisSize();
            a.setAxisTranslation();
          });
        },
        resetMargins: function() {
          var a = this,
              b = a.options.chart;
          c(["margin", "spacing"], function(g) {
            var f = b[g],
                l = u(f) ? f : [f, f, f, f];
            c(["Top", "Right", "Bottom", "Left"], function(c, f) {
              a[g][f] = r(b[g + c], l[f]);
            });
          });
          c(M, function(b, c) {
            a[b] = r(a.margin[c], a.spacing[c]);
          });
          a.axisOffset = [0, 0, 0, 0];
          a.clipOffset = [0, 0, 0, 0];
        },
        drawChartBox: function() {
          var a = this.options.chart,
              b = this.renderer,
              c = this.chartWidth,
              g = this.chartHeight,
              f = this.chartBackground,
              d = this.plotBackground,
              e = this.plotBorder,
              r,
              k,
              m = this.plotLeft,
              y = this.plotTop,
              n = this.plotWidth,
              q = this.plotHeight,
              G = this.plotBox,
              u = this.clipRect,
              B = this.clipBox,
              v = "animate";
          f || (this.chartBackground = f = b.rect().addClass("highcharts-background").add(), v = "attr");
          r = k = f.strokeWidth();
          f[v]({
            x: k / 2,
            y: k / 2,
            width: c - k - r % 2,
            height: g - k - r % 2,
            r: a.borderRadius
          });
          v = "animate";
          d || (v = "attr", this.plotBackground = d = b.rect().addClass("highcharts-plot-background").add());
          d[v](G);
          u ? u.animate({
            width: B.width,
            height: B.height
          }) : this.clipRect = b.clipRect(B);
          v = "animate";
          e || (v = "attr", this.plotBorder = e = b.rect().addClass("highcharts-plot-border").attr({zIndex: 1}).add());
          e[v](e.crisp({
            x: m,
            y: y,
            width: n,
            height: q
          }, -e.strokeWidth()));
          this.isDirtyBox = !1;
          h(this, "afterDrawChartBox");
        },
        propFromSeries: function() {
          var a = this,
              b = a.options.chart,
              g,
              f = a.options.series,
              d,
              e;
          c(["inverted", "angular", "polar"], function(c) {
            g = B[b.type || b.defaultSeriesType];
            e = b[c] || g && g.prototype[c];
            for (d = f && f.length; !e && d--; )
              (g = B[f[d].type]) && g.prototype[c] && (e = !0);
            a[c] = e;
          });
        },
        linkSeries: function() {
          var a = this,
              b = a.series;
          c(b, function(a) {
            a.linkedSeries.length = 0;
          });
          c(b, function(b) {
            var c = b.options.linkedTo;
            q(c) && (c = ":previous" === c ? a.series[b.index - 1] : a.get(c)) && c.linkedParent !== b && (c.linkedSeries.push(b), b.linkedParent = c, b.visible = r(b.options.visible, c.options.visible, b.visible));
          });
        },
        renderSeries: function() {
          c(this.series, function(a) {
            a.translate();
            a.render();
          });
        },
        renderLabels: function() {
          var a = this,
              b = a.options.labels;
          b.items && c(b.items, function(c) {
            var g = d(b.style, c.style),
                f = y(g.left) + a.plotLeft,
                l = y(g.top) + a.plotTop + 12;
            delete g.left;
            delete g.top;
            a.renderer.text(c.html, f, l).attr({zIndex: 2}).css(g).add();
          });
        },
        render: function() {
          var a = this.axes,
              b = this.renderer,
              g = this.options,
              f,
              d,
              e;
          this.setTitle();
          this.legend = new H(this, g.legend);
          this.getStacks && this.getStacks();
          this.getMargins(!0);
          this.setChartSize();
          g = this.plotWidth;
          f = this.plotHeight = Math.max(this.plotHeight - 21, 0);
          c(a, function(a) {
            a.setScale();
          });
          this.getAxisMargins();
          d = 1.1 < g / this.plotWidth;
          e = 1.05 < f / this.plotHeight;
          if (d || e)
            c(a, function(a) {
              (a.horiz && d || !a.horiz && e) && a.setTickInterval(!0);
            }), this.getMargins();
          this.drawChartBox();
          this.hasCartesianSeries && c(a, function(a) {
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
            a.href && (v.location.href = a.href);
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
              g = b.axes,
              f = b.series,
              d = b.container,
              e,
              r = d && d.parentNode;
          h(b, "destroy");
          b.renderer.forExport ? a.erase(t, b) : t[b.index] = void 0;
          a.chartCount--;
          b.renderTo.removeAttribute("data-highcharts-chart");
          G(b);
          for (e = g.length; e--; )
            g[e] = g[e].destroy();
          this.scroller && this.scroller.destroy && this.scroller.destroy();
          for (e = f.length; e--; )
            f[e] = f[e].destroy();
          c("title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" "), function(a) {
            var c = b[a];
            c && c.destroy && (b[a] = c.destroy());
          });
          d && (d.innerHTML = "", G(d), r && w(d));
          F(b, function(a, c) {
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
            c(b.series || [], function(b) {
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
          c([this.callback].concat(this.callbacks), function(a) {
            a && void 0 !== this.index && a.apply(this, [this]);
          }, this);
          h(this, "load");
          h(this, "render");
          n(this.index) && !1 !== this.options.chart.reflow && this.initReflow();
          this.onload = null;
        }
      });
    })(K);
    (function(a) {
      var x,
          E = a.each,
          C = a.extend,
          p = a.erase,
          m = a.fireEvent,
          e = a.format,
          k = a.isArray,
          w = a.isNumber,
          t = a.pick,
          n = a.removeEvent;
      a.Point = x = function() {};
      a.Point.prototype = {
        init: function(a, d, e) {
          var c = a.chart.options.chart.colorCount;
          this.series = a;
          this.applyOptions(d, e);
          a.options.colorByPoint ? (d = a.colorCounter, a.colorCounter++, a.colorCounter === c && (a.colorCounter = 0)) : d = a.colorIndex;
          this.colorIndex = t(this.colorIndex, d);
          a.chart.pointCount++;
          m(this, "afterInit");
          return this;
        },
        applyOptions: function(a, d) {
          var c = this.series,
              e = c.options.pointValKey || c.pointValKey;
          a = x.prototype.optionsToObject.call(this, a);
          C(this, a);
          this.options = this.options ? C(this.options, a) : a;
          a.group && delete this.group;
          e && (this.y = this[e]);
          this.isNull = t(this.isValid && !this.isValid(), null === this.x || !w(this.y, !0));
          this.selected && (this.state = "select");
          "name" in this && void 0 === d && c.xAxis && c.xAxis.hasNames && (this.x = c.xAxis.nameToX(this));
          void 0 === this.x && c && (this.x = void 0 === d ? c.autoIncrement(this) : d);
          return this;
        },
        optionsToObject: function(a) {
          var c = {},
              e = this.series,
              h = e.options.keys,
              f = h || e.pointArrayMap || ["y"],
              b = f.length,
              m = 0,
              n = 0;
          if (w(a) || null === a)
            c[f[0]] = a;
          else if (k(a))
            for (!h && a.length > b && (e = typeof a[0], "string" === e ? c.name = a[0] : "number" === e && (c.x = a[0]), m++); n < b; )
              h && void 0 === a[m] || (c[f[n]] = a[m]), m++, n++;
          else
            "object" === typeof a && (c = a, a.dataLabels && (e._hasPointLabels = !0), a.marker && (e._hasPointMarkers = !0));
          return c;
        },
        getClassName: function() {
          return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" : "") + (this.isNull ? " highcharts-null-point" : "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "") + (this.zone && this.zone.className ? " " + this.zone.className.replace("highcharts-negative", "") : "");
        },
        getZone: function() {
          var a = this.series,
              d = a.zones,
              a = a.zoneAxis || "y",
              e = 0,
              h;
          for (h = d[e]; this[a] >= h.value; )
            h = d[++e];
          h && h.color && !this.options.color && (this.color = h.color);
          return h;
        },
        destroy: function() {
          var a = this.series.chart,
              d = a.hoverPoints,
              e;
          a.pointCount--;
          d && (this.setState(), p(d, this), d.length || (a.hoverPoints = null));
          if (this === a.hoverPoint)
            this.onMouseOut();
          if (this.graphic || this.dataLabel)
            n(this), this.destroyElements();
          this.legendItem && a.legend.destroyItem(this);
          for (e in this)
            this[e] = null;
        },
        destroyElements: function() {
          for (var a = ["graphic", "dataLabel", "dataLabelUpper", "connector", "shadowGroup"],
              d,
              e = 6; e--; )
            d = a[e], this[d] && (this[d] = this[d].destroy());
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
              k = c.tooltipOptions,
              h = t(k.valueDecimals, ""),
              f = k.valuePrefix || "",
              b = k.valueSuffix || "";
          E(c.pointArrayMap || ["y"], function(c) {
            c = "{point." + c;
            if (f || b)
              a = a.replace(c + "}", f + c + "}" + b);
            a = a.replace(c + "}", c + ":,." + h + "f}");
          });
          return e(a, {
            point: this,
            series: this.series
          }, c.chart.time);
        },
        firePointEvent: function(a, d, e) {
          var c = this,
              f = this.series.options;
          (f.point.events[a] || c.options && c.options.events && c.options.events[a]) && this.importEvents();
          "click" === a && f.allowPointSelect && (e = function(a) {
            c.select && c.select(null, a.ctrlKey || a.metaKey || a.shiftKey);
          });
          m(this, a, d, e);
        },
        visible: !0
      };
    })(K);
    (function(a) {
      var x = a.addEvent,
          E = a.animObject,
          C = a.arrayMax,
          p = a.arrayMin,
          m = a.correctFloat,
          e = a.defaultOptions,
          k = a.defined,
          w = a.each,
          t = a.erase,
          n = a.extend,
          c = a.fireEvent,
          d = a.grep,
          A = a.isArray,
          h = a.isNumber,
          f = a.isString,
          b = a.merge,
          u = a.objectEach,
          q = a.pick,
          H = a.removeEvent,
          M = a.splat,
          D = a.SVGElement,
          F = a.syncTimeout,
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
              f,
              d = a.series,
              g;
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
          f = b.events;
          u(f, function(a, b) {
            x(c, b, a);
          });
          if (f && f.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect)
            a.runTrackerClick = !0;
          c.getColor();
          c.getSymbol();
          w(c.parallelArrays, function(a) {
            c[a + "Data"] = [];
          });
          c.setData(b.data, !1);
          c.isCartesian && (a.hasCartesianSeries = !0);
          d.length && (g = d[d.length - 1]);
          c._i = q(g && g._i, -1) + 1;
          a.orderSeries(this.insert(d));
        },
        insert: function(a) {
          var b = this.options.index,
              c;
          if (h(b)) {
            for (c = a.length; c--; )
              if (b >= q(a[c].options.index, a[c]._i)) {
                a.splice(c + 1, 0, this);
                break;
              }
            -1 === c && a.unshift(this);
            c += 1;
          } else
            a.push(this);
          return q(c, a.length - 1);
        },
        bindAxes: function() {
          var b = this,
              c = b.options,
              f = b.chart,
              d;
          w(b.axisTypes || [], function(e) {
            w(f[e], function(a) {
              d = a.options;
              if (c[e] === d.index || void 0 !== c[e] && c[e] === d.id || void 0 === c[e] && 0 === d.index)
                b.insert(a.series), b[e] = a, a.isDirty = !0;
            });
            b[e] || b.optionalAxis === e || a.error(18, !0);
          });
        },
        updateParallelArrays: function(a, b) {
          var c = a.series,
              f = arguments,
              d = h(b) ? function(g) {
                var f = "y" === g && c.toYData ? c.toYData(a) : a[g];
                c[g + "Data"][b] = f;
              } : function(a) {
                Array.prototype[b].apply(c[a + "Data"], Array.prototype.slice.call(f, 2));
              };
          w(c.parallelArrays, d);
        },
        autoIncrement: function() {
          var a = this.options,
              b = this.xIncrement,
              c,
              f = a.pointIntervalUnit,
              d = this.chart.time,
              b = q(b, a.pointStart, 0);
          this.pointInterval = c = q(this.pointInterval, a.pointInterval, 1);
          f && (a = new d.Date(b), "day" === f ? d.set("Date", a, d.get("Date", a) + c) : "month" === f ? d.set("Month", a, d.get("Month", a) + c) : "year" === f && d.set("FullYear", a, d.get("FullYear", a) + c), c = a.getTime() - b);
          this.xIncrement = b + c;
          return b;
        },
        setOptions: function(a) {
          var c = this.chart,
              f = c.options,
              d = f.plotOptions,
              h = (c.userOptions || {}).plotOptions || {},
              g = d[this.type];
          this.userOptions = a;
          c = b(g, d.series, a);
          this.tooltipOptions = b(e.tooltip, e.plotOptions.series && e.plotOptions.series.tooltip, e.plotOptions[this.type].tooltip, f.tooltip.userOptions, d.series && d.series.tooltip, d[this.type].tooltip, a.tooltip);
          this.stickyTracking = q(a.stickyTracking, h[this.type] && h[this.type].stickyTracking, h.series && h.series.stickyTracking, this.tooltipOptions.shared && !this.noSharedTooltip ? !0 : c.stickyTracking);
          null === g.marker && delete c.marker;
          this.zoneAxis = c.zoneAxis;
          a = this.zones = (c.zones || []).slice();
          !c.negativeColor && !c.negativeFillColor || c.zones || a.push({
            value: c[this.zoneAxis + "Threshold"] || c.threshold || 0,
            className: "highcharts-negative"
          });
          a.length && k(a[a.length - 1].value) && a.push({});
          return c;
        },
        getName: function() {
          return this.name || "Series " + (this.index + 1);
        },
        getCyclic: function(a, b, c) {
          var f,
              d = this.chart,
              g = this.userOptions,
              e = a + "Index",
              h = a + "Counter",
              l = c ? c.length : q(d.options.chart[a + "Count"], d[a + "Count"]);
          b || (f = q(g[e], g["_" + e]), k(f) || (d.series.length || (d[h] = 0), g["_" + e] = f = d[h] % l, d[h] += 1), c && (b = c[f]));
          void 0 !== f && (this[e] = f);
          this[a] = b;
        },
        getColor: function() {
          this.getCyclic("color");
        },
        getSymbol: function() {
          this.getCyclic("symbol", this.options.marker.symbol, this.chart.options.symbols);
        },
        drawLegendSymbol: a.LegendSymbolMixin.drawLineMarker,
        setData: function(b, c, d, e) {
          var r = this,
              g = r.points,
              k = g && g.length || 0,
              m,
              l = r.options,
              n = r.chart,
              y = null,
              u = r.xAxis,
              p = l.turboThreshold,
              B = this.xData,
              z = this.yData,
              G = (m = r.pointArrayMap) && m.length;
          b = b || [];
          m = b.length;
          c = q(c, !0);
          if (!1 !== e && m && k === m && !r.cropped && !r.hasGroupedData && r.visible)
            w(b, function(a, b) {
              g[b].update && a !== l.data[b] && g[b].update(a, !1, null, !1);
            });
          else {
            r.xIncrement = null;
            r.colorCounter = 0;
            w(this.parallelArrays, function(a) {
              r[a + "Data"].length = 0;
            });
            if (p && m > p) {
              for (d = 0; null === y && d < m; )
                y = b[d], d++;
              if (h(y))
                for (d = 0; d < m; d++)
                  B[d] = this.autoIncrement(), z[d] = b[d];
              else if (A(y))
                if (G)
                  for (d = 0; d < m; d++)
                    y = b[d], B[d] = y[0], z[d] = y.slice(1, G + 1);
                else
                  for (d = 0; d < m; d++)
                    y = b[d], B[d] = y[0], z[d] = y[1];
              else
                a.error(12);
            } else
              for (d = 0; d < m; d++)
                void 0 !== b[d] && (y = {series: r}, r.pointClass.prototype.applyOptions.apply(y, [b[d]]), r.updateParallelArrays(y, d));
            z && f(z[0]) && a.error(14, !0);
            r.data = [];
            r.options.data = r.userOptions.data = b;
            for (d = k; d--; )
              g[d] && g[d].destroy && g[d].destroy();
            u && (u.minRange = u.userMinRange);
            r.isDirty = n.isDirtyBox = !0;
            r.isDirtyData = !!g;
            d = !1;
          }
          "point" === l.legendType && (this.processData(), this.generatePoints());
          c && n.redraw(d);
        },
        processData: function(b) {
          var c = this.xData,
              f = this.yData,
              d = c.length,
              e;
          e = 0;
          var g,
              h,
              r = this.xAxis,
              l,
              k = this.options;
          l = k.cropThreshold;
          var m = this.getExtremesFromAll || k.getExtremesFromAll,
              n = this.isCartesian,
              k = r && r.val2lin,
              q = r && r.isLog,
              u = this.requireSorting,
              p,
              z;
          if (n && !this.isDirty && !r.isDirty && !this.yAxis.isDirty && !b)
            return !1;
          r && (b = r.getExtremes(), p = b.min, z = b.max);
          if (n && this.sorted && !m && (!l || d > l || this.forceCrop))
            if (c[d - 1] < p || c[0] > z)
              c = [], f = [];
            else if (c[0] < p || c[d - 1] > z)
              e = this.cropData(this.xData, this.yData, p, z), c = e.xData, f = e.yData, e = e.start, g = !0;
          for (l = c.length || 1; --l; )
            d = q ? k(c[l]) - k(c[l - 1]) : c[l] - c[l - 1], 0 < d && (void 0 === h || d < h) ? h = d : 0 > d && u && (a.error(15), u = !1);
          this.cropped = g;
          this.cropStart = e;
          this.processedXData = c;
          this.processedYData = f;
          this.closestPointRange = h;
        },
        cropData: function(a, b, c, f) {
          var d = a.length,
              g = 0,
              e = d,
              h = q(this.cropShoulder, 1),
              l;
          for (l = 0; l < d; l++)
            if (a[l] >= c) {
              g = Math.max(0, l - h);
              break;
            }
          for (c = l; c < d; c++)
            if (a[c] > f) {
              e = c + h;
              break;
            }
          return {
            xData: a.slice(g, e),
            yData: b.slice(g, e),
            start: g,
            end: e
          };
        },
        generatePoints: function() {
          var a = this.options,
              b = a.data,
              c = this.data,
              f,
              d = this.processedXData,
              g = this.processedYData,
              e = this.pointClass,
              h = d.length,
              l = this.cropStart || 0,
              k,
              m = this.hasGroupedData,
              a = a.keys,
              n,
              q = [],
              u;
          c || m || (c = [], c.length = b.length, c = this.data = c);
          a && m && (this.options.keys = !1);
          for (u = 0; u < h; u++)
            k = l + u, m ? (n = (new e).init(this, [d[u]].concat(M(g[u]))), n.dataGroup = this.groupMap[u]) : (n = c[k]) || void 0 === b[k] || (c[k] = n = (new e).init(this, b[k], d[u])), n && (n.index = k, q[u] = n);
          this.options.keys = a;
          if (c && (h !== (f = c.length) || m))
            for (u = 0; u < f; u++)
              u !== l || m || (u += h), c[u] && (c[u].destroyElements(), c[u].plotX = void 0);
          this.data = c;
          this.points = q;
        },
        getExtremes: function(a) {
          var b = this.yAxis,
              c = this.processedXData,
              f,
              d = [],
              g = 0;
          f = this.xAxis.getExtremes();
          var e = f.min,
              r = f.max,
              l,
              k,
              m,
              n;
          a = a || this.stackedYData || this.processedYData || [];
          f = a.length;
          for (n = 0; n < f; n++)
            if (k = c[n], m = a[n], l = (h(m, !0) || A(m)) && (!b.positiveValuesOnly || m.length || 0 < m), k = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || (c[n + 1] || k) >= e && (c[n - 1] || k) <= r, l && k)
              if (l = m.length)
                for (; l--; )
                  "number" === typeof m[l] && (d[g++] = m[l]);
              else
                d[g++] = m;
          this.dataMin = p(d);
          this.dataMax = C(d);
        },
        translate: function() {
          this.processedXData || this.processData();
          this.generatePoints();
          var a = this.options,
              b = a.stacking,
              f = this.xAxis,
              d = f.categories,
              e = this.yAxis,
              g = this.points,
              n = g.length,
              u = !!this.modifyValue,
              l = a.pointPlacement,
              p = "between" === l || h(l),
              z = a.threshold,
              t = a.startFromThreshold ? z : 0,
              F,
              D,
              w,
              A,
              H = Number.MAX_VALUE;
          "between" === l && (l = .5);
          h(l) && (l *= q(a.pointRange || f.pointRange));
          for (a = 0; a < n; a++) {
            var x = g[a],
                M = x.x,
                C = x.y;
            D = x.low;
            var E = b && e.stacks[(this.negStacks && C < (t ? 0 : z) ? "-" : "") + this.stackKey],
                K;
            e.positiveValuesOnly && null !== C && 0 >= C && (x.isNull = !0);
            x.plotX = F = m(Math.min(Math.max(-1E5, f.translate(M, 0, 0, 0, 1, l, "flags" === this.type)), 1E5));
            b && this.visible && !x.isNull && E && E[M] && (A = this.getStackIndicator(A, M, this.index), K = E[M], C = K.points[A.key], D = C[0], C = C[1], D === t && A.key === E[M].base && (D = q(z, e.min)), e.positiveValuesOnly && 0 >= D && (D = null), x.total = x.stackTotal = K.total, x.percentage = K.total && x.y / K.total * 100, x.stackY = C, K.setOffset(this.pointXOffset || 0, this.barW || 0));
            x.yBottom = k(D) ? Math.min(Math.max(-1E5, e.translate(D, 0, 1, 0, 1)), 1E5) : null;
            u && (C = this.modifyValue(C, x));
            x.plotY = D = "number" === typeof C && Infinity !== C ? Math.min(Math.max(-1E5, e.translate(C, 0, 1, 0, 1)), 1E5) : void 0;
            x.isInside = void 0 !== D && 0 <= D && D <= e.len && 0 <= F && F <= f.len;
            x.clientX = p ? m(f.translate(M, 0, 0, 0, 1, l)) : F;
            x.negative = x.y < (z || 0);
            x.category = d && void 0 !== d[x.x] ? d[x.x] : x.x;
            x.isNull || (void 0 !== w && (H = Math.min(H, Math.abs(F - w))), w = F);
            x.zone = this.zones.length && x.getZone();
          }
          this.closestPointRangePx = H;
          c(this, "afterTranslate");
        },
        getValidPoints: function(a, b) {
          var c = this.chart;
          return d(a || this.points || [], function(a) {
            return b && !c.isInsidePlot(a.plotX, a.plotY, c.inverted) ? !1 : !a.isNull;
          });
        },
        setClip: function(a) {
          var b = this.chart,
              c = this.options,
              f = b.renderer,
              d = b.inverted,
              g = this.clipBox,
              e = g || b.clipBox,
              h = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, e.height, c.xAxis, c.yAxis].join(),
              l = b[h],
              k = b[h + "m"];
          l || (a && (e.width = 0, d && (e.x = b.plotSizeX), b[h + "m"] = k = f.clipRect(d ? b.plotSizeX + 99 : -99, d ? -b.plotLeft : -b.plotTop, 99, d ? b.chartWidth : b.chartHeight)), b[h] = l = f.clipRect(e), l.count = {length: 0});
          a && !l.count[this.index] && (l.count[this.index] = !0, l.count.length += 1);
          !1 !== c.clip && (this.group.clip(a || g ? l : b.clipRect), this.markerGroup.clip(k), this.sharedClipKey = h);
          a || (l.count[this.index] && (delete l.count[this.index], --l.count.length), 0 === l.count.length && h && b[h] && (g || (b[h] = b[h].destroy()), b[h + "m"] && (b[h + "m"] = b[h + "m"].destroy())));
        },
        animate: function(a) {
          var b = this.chart,
              c = E(this.options.animation),
              f;
          a ? this.setClip(c) : (f = this.sharedClipKey, (a = b[f]) && a.animate({
            width: b.plotSizeX,
            x: 0
          }, c), b[f + "m"] && b[f + "m"].animate({
            width: b.plotSizeX + 99,
            x: 0
          }, c), this.animate = null);
        },
        afterAnimate: function() {
          this.setClip();
          c(this, "afterAnimate");
          this.finishedAnimating = !0;
        },
        drawPoints: function() {
          var a = this.points,
              b = this.chart,
              c,
              f,
              d,
              g,
              e = this.options.marker,
              h,
              l,
              k,
              m = this[this.specialGroup] || this.markerGroup,
              n,
              u = q(e.enabled, this.xAxis.isRadial ? !0 : null, this.closestPointRangePx >= e.enabledThreshold * e.radius);
          if (!1 !== e.enabled || this._hasPointMarkers)
            for (c = 0; c < a.length; c++)
              f = a[c], g = f.graphic, h = f.marker || {}, l = !!f.marker, d = u && void 0 === h.enabled || h.enabled, k = f.isInside, d && !f.isNull ? (d = q(h.symbol, this.symbol), n = this.markerAttribs(f, f.selected && "select"), g ? g[k ? "show" : "hide"](!0).animate(n) : k && (0 < n.width || f.hasImage) && (f.graphic = g = b.renderer.symbol(d, n.x, n.y, n.width, n.height, l ? h : e).add(m)), g && g.addClass(f.getClassName(), !0)) : g && (f.graphic = g.destroy());
        },
        markerAttribs: function(a, b) {
          var c = this.options.marker,
              f = a.marker || {},
              d = f.symbol || c.symbol,
              g = q(f.radius, c.radius);
          b && (c = c.states[b], b = f.states && f.states[b], g = q(b && b.radius, c && c.radius, g + (c && c.radiusPlus || 0)));
          a.hasImage = d && 0 === d.indexOf("url");
          a.hasImage && (g = 0);
          a = {
            x: Math.floor(a.plotX) - g,
            y: a.plotY - g
          };
          g && (a.width = a.height = 2 * g);
          return a;
        },
        destroy: function() {
          var a = this,
              b = a.chart,
              f = /AppleWebKit\/533/.test(z.navigator.userAgent),
              d,
              e,
              g = a.data || [],
              h,
              k;
          c(a, "destroy");
          H(a);
          w(a.axisTypes || [], function(b) {
            (k = a[b]) && k.series && (t(k.series, a), k.isDirty = k.forceRedraw = !0);
          });
          a.legendItem && a.chart.legend.destroyItem(a);
          for (e = g.length; e--; )
            (h = g[e]) && h.destroy && h.destroy();
          a.points = null;
          clearTimeout(a.animationTimeout);
          u(a, function(a, b) {
            a instanceof D && !a.survive && (d = f && "group" === b ? "hide" : "destroy", a[d]());
          });
          b.hoverSeries === a && (b.hoverSeries = null);
          t(b.series, a);
          b.orderSeries();
          u(a, function(b, c) {
            delete a[c];
          });
        },
        getGraphPath: function(a, b, c) {
          var f = this,
              d = f.options,
              g = d.step,
              e,
              h = [],
              l = [],
              m;
          a = a || f.points;
          (e = a.reversed) && a.reverse();
          (g = {
            right: 1,
            center: 2
          }[g] || g && 3) && e && (g = 4 - g);
          !d.connectNulls || b || c || (a = this.getValidPoints(a));
          w(a, function(e, r) {
            var n = e.plotX,
                q = e.plotY,
                u = a[r - 1];
            (e.leftCliff || u && u.rightCliff) && !c && (m = !0);
            e.isNull && !k(b) && 0 < r ? m = !d.connectNulls : e.isNull && !b ? m = !0 : (0 === r || m ? r = ["M", e.plotX, e.plotY] : f.getPointSpline ? r = f.getPointSpline(a, e, r) : g ? (r = 1 === g ? ["L", u.plotX, q] : 2 === g ? ["L", (u.plotX + n) / 2, u.plotY, "L", (u.plotX + n) / 2, q] : ["L", n, u.plotY], r.push("L", n, q)) : r = ["L", n, q], l.push(e.x), g && l.push(e.x), h.push.apply(h, r), m = !1);
          });
          h.xMap = l;
          return f.graphPath = h;
        },
        drawGraph: function() {
          var a = this,
              b = (this.gappedPath || this.getGraphPath).call(this),
              c = [["graph", "highcharts-graph"]];
          w(this.zones, function(a, b) {
            c.push(["zone-graph-" + b, "highcharts-graph highcharts-zone-graph-" + b + " " + (a.className || "")]);
          });
          w(c, function(c, f) {
            f = c[0];
            var g = a[f];
            g ? (g.endX = a.preventGraphAnimation ? null : b.xMap, g.animate({d: b})) : b.length && (a[f] = a.chart.renderer.path(b).addClass(c[1]).attr({zIndex: 1}).add(a.group));
            g && (g.startX = b.xMap, g.isArea = b.isArea);
          });
        },
        applyZones: function() {
          var a = this,
              b = this.chart,
              c = b.renderer,
              f = this.zones,
              d,
              g,
              e = this.clips || [],
              h,
              l = this.graph,
              k = this.area,
              m = Math.max(b.chartWidth, b.chartHeight),
              n = this[(this.zoneAxis || "y") + "Axis"],
              u,
              p,
              z = b.inverted,
              t,
              D,
              F,
              A,
              H = !1;
          f.length && (l || k) && n && void 0 !== n.min && (p = n.reversed, t = n.horiz, l && l.hide(), k && k.hide(), u = n.getExtremes(), w(f, function(f, r) {
            d = p ? t ? b.plotWidth : 0 : t ? 0 : n.toPixels(u.min);
            d = Math.min(Math.max(q(g, d), 0), m);
            g = Math.min(Math.max(Math.round(n.toPixels(q(f.value, u.max), !0)), 0), m);
            H && (d = g = n.toPixels(u.max));
            D = Math.abs(d - g);
            F = Math.min(d, g);
            A = Math.max(d, g);
            n.isXAxis ? (h = {
              x: z ? A : F,
              y: 0,
              width: D,
              height: m
            }, t || (h.x = b.plotHeight - h.x)) : (h = {
              x: 0,
              y: z ? A : F,
              width: m,
              height: D
            }, t && (h.y = b.plotWidth - h.y));
            e[r] ? e[r].animate(h) : (e[r] = c.clipRect(h), l && a["zone-graph-" + r].clip(e[r]), k && a["zone-area-" + r].clip(e[r]));
            H = f.value > u.max;
          }), this.clips = e);
        },
        invertGroups: function(a) {
          function b() {
            w(["group", "markerGroup"], function(b) {
              c[b] && (f.renderer.isVML && c[b].attr({
                width: c.yAxis.len,
                height: c.xAxis.len
              }), c[b].width = c.yAxis.len, c[b].height = c.xAxis.len, c[b].invert(a));
            });
          }
          var c = this,
              f = c.chart,
              d;
          c.xAxis && (d = x(f, "resize", b), x(c, "destroy", d), b(a), c.invertGroups = b);
        },
        plotGroup: function(a, b, c, f, d) {
          var g = this[a],
              e = !g;
          e && (this[a] = g = this.chart.renderer.g().attr({zIndex: f || .1}).add(d));
          g.addClass("highcharts-" + b + " highcharts-series-" + this.index + " highcharts-" + this.type + "-series " + (k(this.colorIndex) ? "highcharts-color-" + this.colorIndex + " " : "") + (this.options.className || "") + (g.hasClass("highcharts-tracker") ? " highcharts-tracker" : ""), !0);
          g.attr({visibility: c})[e ? "attr" : "animate"](this.getPlotBox());
          return g;
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
              f,
              d = a.options,
              e = !!a.animate && b.renderer.isSVG && E(d.animation).duration,
              g = a.visible ? "inherit" : "hidden",
              h = d.zIndex,
              k = a.hasRendered,
              l = b.seriesGroup,
              m = b.inverted;
          f = a.plotGroup("group", "series", g, h, l);
          a.markerGroup = a.plotGroup("markerGroup", "markers", g, h, l);
          e && a.animate(!0);
          f.inverted = a.isCartesian ? m : !1;
          a.drawGraph && (a.drawGraph(), a.applyZones());
          a.drawDataLabels && a.drawDataLabels();
          a.visible && a.drawPoints();
          a.drawTracker && !1 !== a.options.enableMouseTracking && a.drawTracker();
          a.invertGroups(m);
          !1 === d.clip || a.sharedClipKey || k || f.clip(b.clipRect);
          e && a.animate();
          k || (a.animationTimeout = F(function() {
            a.afterAnimate();
          }, e));
          a.isDirty = !1;
          a.hasRendered = !0;
          c(a, "afterRender");
        },
        redraw: function() {
          var a = this.chart,
              b = this.isDirty || this.isDirtyData,
              c = this.group,
              f = this.xAxis,
              d = this.yAxis;
          c && (a.inverted && c.attr({
            width: a.plotWidth,
            height: a.plotHeight
          }), c.animate({
            translateX: q(f && f.left, a.plotLeft),
            translateY: q(d && d.top, a.plotTop)
          }));
          this.translate();
          this.render();
          b && delete this.kdTree;
        },
        kdAxisArray: ["clientX", "plotY"],
        searchPoint: function(a, b) {
          var c = this.xAxis,
              f = this.yAxis,
              d = this.chart.inverted;
          return this.searchKDTree({
            clientX: d ? c.len - a.chartY + c.pos : a.chartX - c.pos,
            plotY: d ? f.len - a.chartX + f.pos : a.chartY - f.pos
          }, b);
        },
        buildKDTree: function() {
          function a(c, f, d) {
            var g,
                e;
            if (e = c && c.length)
              return g = b.kdAxisArray[f % d], c.sort(function(a, b) {
                return a[g] - b[g];
              }), e = Math.floor(e / 2), {
                point: c[e],
                left: a(c.slice(0, e), f + 1, d),
                right: a(c.slice(e + 1), f + 1, d)
              };
          }
          this.buildingKdTree = !0;
          var b = this,
              c = -1 < b.options.findNearestPointBy.indexOf("y") ? 2 : 1;
          delete b.kdTree;
          F(function() {
            b.kdTree = a(b.getValidPoints(null, !b.directTouch), c, c);
            b.buildingKdTree = !1;
          }, b.options.kdNow ? 0 : 1);
        },
        searchKDTree: function(a, b) {
          function c(a, b, h, m) {
            var l = b.point,
                n = f.kdAxisArray[h % m],
                r,
                q,
                u = l;
            q = k(a[d]) && k(l[d]) ? Math.pow(a[d] - l[d], 2) : null;
            r = k(a[g]) && k(l[g]) ? Math.pow(a[g] - l[g], 2) : null;
            r = (q || 0) + (r || 0);
            l.dist = k(r) ? Math.sqrt(r) : Number.MAX_VALUE;
            l.distX = k(q) ? Math.sqrt(q) : Number.MAX_VALUE;
            n = a[n] - l[n];
            r = 0 > n ? "left" : "right";
            q = 0 > n ? "right" : "left";
            b[r] && (r = c(a, b[r], h + 1, m), u = r[e] < u[e] ? r : l);
            b[q] && Math.sqrt(n * n) < u[e] && (a = c(a, b[q], h + 1, m), u = a[e] < u[e] ? a : u);
            return u;
          }
          var f = this,
              d = this.kdAxisArray[0],
              g = this.kdAxisArray[1],
              e = b ? "distX" : "dist";
          b = -1 < f.options.findNearestPointBy.indexOf("y") ? 2 : 1;
          this.kdTree || this.buildingKdTree || this.buildKDTree();
          if (this.kdTree)
            return c(a, this.kdTree, b, b);
        }
      });
    })(K);
    (function(a) {
      var x = a.Axis,
          E = a.Chart,
          C = a.correctFloat,
          p = a.defined,
          m = a.destroyObjectProperties,
          e = a.each,
          k = a.format,
          w = a.objectEach,
          t = a.pick,
          n = a.Series;
      a.StackItem = function(a, d, e, h, f) {
        var b = a.chart.inverted;
        this.axis = a;
        this.isNegative = e;
        this.options = d;
        this.x = h;
        this.total = null;
        this.points = {};
        this.stack = f;
        this.rightCliff = this.leftCliff = 0;
        this.alignOptions = {
          align: d.align || (b ? e ? "left" : "right" : "center"),
          verticalAlign: d.verticalAlign || (b ? "middle" : e ? "bottom" : "top"),
          y: t(d.y, b ? 4 : e ? 14 : -6),
          x: t(d.x, b ? e ? -6 : 6 : 0)
        };
        this.textAlign = d.textAlign || (b ? e ? "right" : "left" : "center");
      };
      a.StackItem.prototype = {
        destroy: function() {
          m(this, this.axis);
        },
        render: function(a) {
          var c = this.axis.chart,
              e = this.options,
              h = e.format,
              h = h ? k(h, this, c.time) : e.formatter.call(this);
          this.label ? this.label.attr({
            text: h,
            visibility: "hidden"
          }) : this.label = c.renderer.text(h, null, null, e.useHTML).css(e.style).attr({
            align: this.textAlign,
            rotation: e.rotation,
            visibility: "hidden"
          }).add(a);
        },
        setOffset: function(a, d) {
          var c = this.axis,
              e = c.chart,
              f = c.translate(c.usePercentage ? 100 : this.total, 0, 0, 0, 1),
              c = c.translate(0),
              c = Math.abs(f - c);
          a = e.xAxis[0].translate(this.x) + a;
          f = this.getStackBox(e, this, a, f, d, c);
          if (d = this.label)
            d.align(this.alignOptions, null, f), f = d.alignAttr, d[!1 === this.options.crop || e.isInsidePlot(f.x, f.y) ? "show" : "hide"](!0);
        },
        getStackBox: function(a, d, e, h, f, b) {
          var c = d.axis.reversed,
              k = a.inverted;
          a = a.plotHeight;
          d = d.isNegative && !c || !d.isNegative && c;
          return {
            x: k ? d ? h : h - b : e,
            y: k ? a - e - f : d ? a - h - b : a - h,
            width: k ? b : f,
            height: k ? f : b
          };
        }
      };
      E.prototype.getStacks = function() {
        var a = this;
        e(a.yAxis, function(a) {
          a.stacks && a.hasVisibleSeries && (a.oldStacks = a.stacks);
        });
        e(a.series, function(c) {
          !c.options.stacking || !0 !== c.visible && !1 !== a.options.chart.ignoreHiddenSeries || (c.stackKey = c.type + t(c.options.stack, ""));
        });
      };
      x.prototype.buildStacks = function() {
        var a = this.series,
            d = t(this.options.reversedStacks, !0),
            e = a.length,
            h;
        if (!this.isXAxis) {
          this.usePercentage = !1;
          for (h = e; h--; )
            a[d ? h : e - h - 1].setStackedPoints();
          for (h = 0; h < e; h++)
            a[h].modifyStacks();
        }
      };
      x.prototype.renderStackTotals = function() {
        var a = this.chart,
            d = a.renderer,
            e = this.stacks,
            h = this.stackTotalGroup;
        h || (this.stackTotalGroup = h = d.g("stack-labels").attr({
          visibility: "visible",
          zIndex: 6
        }).add());
        h.translate(a.plotLeft, a.plotTop);
        w(e, function(a) {
          w(a, function(a) {
            a.render(h);
          });
        });
      };
      x.prototype.resetStacks = function() {
        var a = this,
            d = a.stacks;
        a.isXAxis || w(d, function(c) {
          w(c, function(d, f) {
            d.touched < a.stacksTouched ? (d.destroy(), delete c[f]) : (d.total = null, d.cumulative = null);
          });
        });
      };
      x.prototype.cleanStacks = function() {
        var a;
        this.isXAxis || (this.oldStacks && (a = this.stacks = this.oldStacks), w(a, function(a) {
          w(a, function(a) {
            a.cumulative = a.total;
          });
        }));
      };
      n.prototype.setStackedPoints = function() {
        if (this.options.stacking && (!0 === this.visible || !1 === this.chart.options.chart.ignoreHiddenSeries)) {
          var c = this.processedXData,
              d = this.processedYData,
              e = [],
              h = d.length,
              f = this.options,
              b = f.threshold,
              k = t(f.startFromThreshold && b, 0),
              m = f.stack,
              f = f.stacking,
              n = this.stackKey,
              w = "-" + n,
              D = this.negStacks,
              F = this.yAxis,
              z = F.stacks,
              r = F.oldStacks,
              y,
              G,
              B,
              I,
              g,
              v,
              x;
          F.stacksTouched += 1;
          for (g = 0; g < h; g++)
            v = c[g], x = d[g], y = this.getStackIndicator(y, v, this.index), I = y.key, B = (G = D && x < (k ? 0 : b)) ? w : n, z[B] || (z[B] = {}), z[B][v] || (r[B] && r[B][v] ? (z[B][v] = r[B][v], z[B][v].total = null) : z[B][v] = new a.StackItem(F, F.options.stackLabels, G, v, m)), B = z[B][v], null !== x ? (B.points[I] = B.points[this.index] = [t(B.cumulative, k)], p(B.cumulative) || (B.base = I), B.touched = F.stacksTouched, 0 < y.index && !1 === this.singleStacks && (B.points[I][0] = B.points[this.index + "," + v + ",0"][0])) : B.points[I] = B.points[this.index] = null, "percent" === f ? (G = G ? n : w, D && z[G] && z[G][v] ? (G = z[G][v], B.total = G.total = Math.max(G.total, B.total) + Math.abs(x) || 0) : B.total = C(B.total + (Math.abs(x) || 0))) : B.total = C(B.total + (x || 0)), B.cumulative = t(B.cumulative, k) + (x || 0), null !== x && (B.points[I].push(B.cumulative), e[g] = B.cumulative);
          "percent" === f && (F.usePercentage = !0);
          this.stackedYData = e;
          F.oldStacks = {};
        }
      };
      n.prototype.modifyStacks = function() {
        var a = this,
            d = a.stackKey,
            k = a.yAxis.stacks,
            h = a.processedXData,
            f,
            b = a.options.stacking;
        a[b + "Stacker"] && e([d, "-" + d], function(c) {
          for (var d = h.length,
              e,
              m; d--; )
            if (e = h[d], f = a.getStackIndicator(f, e, a.index, c), m = (e = k[c] && k[c][e]) && e.points[f.key])
              a[b + "Stacker"](m, e, d);
        });
      };
      n.prototype.percentStacker = function(a, d, e) {
        d = d.total ? 100 / d.total : 0;
        a[0] = C(a[0] * d);
        a[1] = C(a[1] * d);
        this.stackedYData[e] = a[1];
      };
      n.prototype.getStackIndicator = function(a, d, e, h) {
        !p(a) || a.x !== d || h && a.key !== h ? a = {
          x: d,
          index: 0,
          key: h
        } : a.index++;
        a.key = [e, d, a.index].join();
        return a;
      };
    })(K);
    (function(a) {
      var x = a.addEvent,
          E = a.Axis,
          C = a.createElement,
          p = a.css,
          m = a.defined,
          e = a.each,
          k = a.erase,
          w = a.extend,
          t = a.fireEvent,
          n = a.inArray,
          c = a.isNumber,
          d = a.isObject,
          A = a.isArray,
          h = a.merge,
          f = a.objectEach,
          b = a.pick,
          u = a.Point,
          q = a.Series,
          H = a.seriesTypes,
          M = a.setAnimation,
          D = a.splat;
      w(a.Chart.prototype, {
        addSeries: function(a, c, f) {
          var d,
              e = this;
          a && (c = b(c, !0), t(e, "addSeries", {options: a}, function() {
            d = e.initSeries(a);
            e.isDirtyLegend = !0;
            e.linkSeries();
            c && e.redraw(f);
          }));
          return d;
        },
        addAxis: function(a, c, f, d) {
          var e = c ? "xAxis" : "yAxis",
              k = this.options;
          a = h(a, {
            index: this[e].length,
            isX: c
          });
          c = new E(this, a);
          k[e] = D(k[e] || {});
          k[e].push(a);
          b(f, !0) && this.redraw(d);
          return c;
        },
        showLoading: function(a) {
          var b = this,
              c = b.options,
              f = b.loadingDiv,
              d = function() {
                f && p(f, {
                  left: b.plotLeft + "px",
                  top: b.plotTop + "px",
                  width: b.plotWidth + "px",
                  height: b.plotHeight + "px"
                });
              };
          f || (b.loadingDiv = f = C("div", {className: "highcharts-loading highcharts-loading-hidden"}, null, b.container), b.loadingSpan = C("span", {className: "highcharts-loading-inner"}, null, f), x(b, "redraw", d));
          f.className = "highcharts-loading";
          b.loadingSpan.innerHTML = a || c.lang.loading;
          b.loadingShown = !0;
          d();
        },
        hideLoading: function() {
          var a = this.loadingDiv;
          a && (a.className = "highcharts-loading highcharts-loading-hidden");
          this.loadingShown = !1;
        },
        propsRequireDirtyBox: "backgroundColor borderColor borderWidth margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
        propsRequireUpdateSeries: "chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" "),
        update: function(a, d, k) {
          var r = this,
              q = {
                credits: "addCredits",
                title: "setTitle",
                subtitle: "setSubtitle"
              },
              u = a.chart,
              p,
              g,
              t = [];
          if (u) {
            h(!0, r.options.chart, u);
            "className" in u && r.setClassName(u.className);
            if ("inverted" in u || "polar" in u)
              r.propFromSeries(), p = !0;
            "alignTicks" in u && (p = !0);
            f(u, function(a, b) {
              -1 !== n("chart." + b, r.propsRequireUpdateSeries) && (g = !0);
              -1 !== n(b, r.propsRequireDirtyBox) && (r.isDirtyBox = !0);
            });
          }
          a.plotOptions && h(!0, this.options.plotOptions, a.plotOptions);
          f(a, function(a, b) {
            if (r[b] && "function" === typeof r[b].update)
              r[b].update(a, !1);
            else if ("function" === typeof r[q[b]])
              r[q[b]](a);
            "chart" !== b && -1 !== n(b, r.propsRequireUpdateSeries) && (g = !0);
          });
          e("xAxis yAxis zAxis series colorAxis pane".split(" "), function(b) {
            a[b] && (e(D(a[b]), function(a, c) {
              (c = m(a.id) && r.get(a.id) || r[b][c]) && c.coll === b && (c.update(a, !1), k && (c.touched = !0));
              if (!c && k)
                if ("series" === b)
                  r.addSeries(a, !1).touched = !0;
                else if ("xAxis" === b || "yAxis" === b)
                  r.addAxis(a, "xAxis" === b, !1).touched = !0;
            }), k && e(r[b], function(a) {
              a.touched ? delete a.touched : t.push(a);
            }));
          });
          e(t, function(a) {
            a.remove(!1);
          });
          p && e(r.axes, function(a) {
            a.update({}, !1);
          });
          g && e(r.series, function(a) {
            a.update({}, !1);
          });
          a.loading && h(!0, r.options.loading, a.loading);
          p = u && u.width;
          u = u && u.height;
          c(p) && p !== r.chartWidth || c(u) && u !== r.chartHeight ? r.setSize(p, u) : b(d, !0) && r.redraw();
        },
        setSubtitle: function(a) {
          this.setTitle(void 0, a);
        }
      });
      w(u.prototype, {
        update: function(a, c, f, e) {
          function h() {
            k.applyOptions(a);
            null === k.y && g && (k.graphic = g.destroy());
            d(a, !0) && (g && g.element && a && a.marker && void 0 !== a.marker.symbol && (k.graphic = g.destroy()), a && a.dataLabels && k.dataLabel && (k.dataLabel = k.dataLabel.destroy()), k.connector && (k.connector = k.connector.destroy()));
            n = k.index;
            m.updateParallelArrays(k, n);
            l.data[n] = d(l.data[n], !0) || d(a, !0) ? k.options : a;
            m.isDirty = m.isDirtyData = !0;
            !m.fixedBox && m.hasCartesianSeries && (r.isDirtyBox = !0);
            "point" === l.legendType && (r.isDirtyLegend = !0);
            c && r.redraw(f);
          }
          var k = this,
              m = k.series,
              g = k.graphic,
              n,
              r = m.chart,
              l = m.options;
          c = b(c, !0);
          !1 === e ? h() : k.firePointEvent("update", {options: a}, h);
        },
        remove: function(a, b) {
          this.series.removePoint(n(this, this.series.data), a, b);
        }
      });
      w(q.prototype, {
        addPoint: function(a, c, f, d) {
          var e = this.options,
              h = this.data,
              k = this.chart,
              g = this.xAxis,
              g = g && g.hasNames && g.names,
              m = e.data,
              n,
              l,
              r = this.xData,
              q,
              u;
          c = b(c, !0);
          n = {series: this};
          this.pointClass.prototype.applyOptions.apply(n, [a]);
          u = n.x;
          q = r.length;
          if (this.requireSorting && u < r[q - 1])
            for (l = !0; q && r[q - 1] > u; )
              q--;
          this.updateParallelArrays(n, "splice", q, 0, 0);
          this.updateParallelArrays(n, q);
          g && n.name && (g[u] = n.name);
          m.splice(q, 0, a);
          l && (this.data.splice(q, 0, null), this.processData());
          "point" === e.legendType && this.generatePoints();
          f && (h[0] && h[0].remove ? h[0].remove(!1) : (h.shift(), this.updateParallelArrays(n, "shift"), m.shift()));
          this.isDirtyData = this.isDirty = !0;
          c && k.redraw(d);
        },
        removePoint: function(a, c, f) {
          var d = this,
              e = d.data,
              h = e[a],
              k = d.points,
              g = d.chart,
              m = function() {
                k && k.length === e.length && k.splice(a, 1);
                e.splice(a, 1);
                d.options.data.splice(a, 1);
                d.updateParallelArrays(h || {series: d}, "splice", a, 1);
                h && h.destroy();
                d.isDirty = !0;
                d.isDirtyData = !0;
                c && g.redraw();
              };
          M(f, g);
          c = b(c, !0);
          h ? h.firePointEvent("remove", null, m) : m();
        },
        remove: function(a, c, f) {
          function d() {
            e.destroy();
            h.isDirtyLegend = h.isDirtyBox = !0;
            h.linkSeries();
            b(a, !0) && h.redraw(c);
          }
          var e = this,
              h = e.chart;
          !1 !== f ? t(e, "remove", null, d) : d();
        },
        update: function(a, c) {
          var f = this,
              d = f.chart,
              k = f.userOptions,
              m = f.oldType || f.type,
              n = a.type || k.type || d.options.chart.type,
              g = H[m].prototype,
              q,
              u = ["group", "markerGroup", "dataLabelsGroup"],
              l = ["navigatorSeries", "baseSeries"],
              p = f.finishedAnimating && {animation: !1};
          if (Object.keys && "data" === Object.keys(a).toString())
            return this.setData(a.data, c);
          l = u.concat(l);
          e(l, function(a) {
            l[a] = f[a];
            delete f[a];
          });
          a = h(k, p, {
            index: f.index,
            pointStart: f.xData[0]
          }, {data: f.options.data}, a);
          f.remove(!1, null, !1);
          for (q in g)
            f[q] = void 0;
          w(f, H[n || m].prototype);
          e(l, function(a) {
            f[a] = l[a];
          });
          f.init(d, a);
          a.zIndex !== k.zIndex && e(u, function(b) {
            f[b] && f[b].attr({zIndex: a.zIndex});
          });
          f.oldType = m;
          d.linkSeries();
          b(c, !0) && d.redraw(!1);
        }
      });
      w(E.prototype, {
        update: function(a, c) {
          var f = this.chart;
          a = f.options[this.coll][this.options.index] = h(this.userOptions, a);
          this.destroy(!0);
          this.init(f, w(a, {events: void 0}));
          f.isDirtyBox = !0;
          b(c, !0) && f.redraw();
        },
        remove: function(a) {
          for (var c = this.chart,
              f = this.coll,
              d = this.series,
              h = d.length; h--; )
            d[h] && d[h].remove(!1);
          k(c.axes, this);
          k(c[f], this);
          A(c.options[f]) ? c.options[f].splice(this.options.index, 1) : delete c.options[f];
          e(c[f], function(a, b) {
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
    })(K);
    (function(a) {
      var x = a.each,
          E = a.map,
          C = a.pick,
          p = a.Series,
          m = a.seriesType;
      m("area", "line", {
        softThreshold: !1,
        threshold: 0
      }, {
        singleStacks: !1,
        getStackPoints: function(e) {
          var k = [],
              m = [],
              p = this.xAxis,
              n = this.yAxis,
              c = n.stacks[this.stackKey],
              d = {},
              A = this.index,
              h = n.series,
              f = h.length,
              b,
              u = C(n.options.reversedStacks, !0) ? 1 : -1,
              q;
          e = e || this.points;
          if (this.options.stacking) {
            for (q = 0; q < e.length; q++)
              e[q].leftNull = e[q].rightNull = null, d[e[q].x] = e[q];
            a.objectEach(c, function(a, b) {
              null !== a.total && m.push(b);
            });
            m.sort(function(a, b) {
              return a - b;
            });
            b = E(h, function() {
              return this.visible;
            });
            x(m, function(a, e) {
              var h = 0,
                  t,
                  z;
              if (d[a] && !d[a].isNull)
                k.push(d[a]), x([-1, 1], function(h) {
                  var k = 1 === h ? "rightNull" : "leftNull",
                      n = 0,
                      r = c[m[e + h]];
                  if (r)
                    for (q = A; 0 <= q && q < f; )
                      t = r.points[q], t || (q === A ? d[a][k] = !0 : b[q] && (z = c[a].points[q]) && (n -= z[1] - z[0])), q += u;
                  d[a][1 === h ? "rightCliff" : "leftCliff"] = n;
                });
              else {
                for (q = A; 0 <= q && q < f; ) {
                  if (t = c[a].points[q]) {
                    h = t[1];
                    break;
                  }
                  q += u;
                }
                h = n.translate(h, 0, 1, 0, 1);
                k.push({
                  isNull: !0,
                  plotX: p.translate(a, 0, 0, 0, 1),
                  x: a,
                  plotY: h,
                  yBottom: h
                });
              }
            });
          }
          return k;
        },
        getGraphPath: function(a) {
          var e = p.prototype.getGraphPath,
              m = this.options,
              t = m.stacking,
              n = this.yAxis,
              c,
              d,
              x = [],
              h = [],
              f = this.index,
              b,
              u = n.stacks[this.stackKey],
              q = m.threshold,
              H = n.getThreshold(m.threshold),
              M,
              m = m.connectNulls || "percent" === t,
              D = function(c, d, e) {
                var k = a[c];
                c = t && u[k.x].points[f];
                var m = k[e + "Null"] || 0;
                e = k[e + "Cliff"] || 0;
                var r,
                    p,
                    k = !0;
                e || m ? (r = (m ? c[0] : c[1]) + e, p = c[0] + e, k = !!m) : !t && a[d] && a[d].isNull && (r = p = q);
                void 0 !== r && (h.push({
                  plotX: b,
                  plotY: null === r ? H : n.getThreshold(r),
                  isNull: k,
                  isCliff: !0
                }), x.push({
                  plotX: b,
                  plotY: null === p ? H : n.getThreshold(p),
                  doCurve: !1
                }));
              };
          a = a || this.points;
          t && (a = this.getStackPoints(a));
          for (c = 0; c < a.length; c++)
            if (d = a[c].isNull, b = C(a[c].rectPlotX, a[c].plotX), M = C(a[c].yBottom, H), !d || m)
              m || D(c, c - 1, "left"), d && !t && m || (h.push(a[c]), x.push({
                x: c,
                plotX: b,
                plotY: M
              })), m || D(c, c + 1, "right");
          c = e.call(this, h, !0, !0);
          x.reversed = !0;
          d = e.call(this, x, !0, !0);
          d.length && (d[0] = "L");
          d = c.concat(d);
          e = e.call(this, h, !1, m);
          d.xMap = c.xMap;
          this.areaPath = d;
          return e;
        },
        drawGraph: function() {
          this.areaPath = [];
          p.prototype.drawGraph.apply(this);
          var a = this,
              k = this.areaPath,
              m = this.options,
              t = [["area", "highcharts-area"]];
          x(this.zones, function(a, c) {
            t.push(["zone-area-" + c, "highcharts-area highcharts-zone-area-" + c + " " + a.className]);
          });
          x(t, function(e) {
            var c = e[0],
                d = a[c];
            d ? (d.endX = a.preventGraphAnimation ? null : k.xMap, d.animate({d: k})) : (d = a[c] = a.chart.renderer.path(k).addClass(e[1]).attr({zIndex: 0}).add(a.group), d.isArea = !0);
            d.startX = k.xMap;
            d.shiftUnit = m.step ? 2 : 1;
          });
        },
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle
      });
    })(K);
    (function(a) {
      var x = a.pick;
      a = a.seriesType;
      a("spline", "line", {}, {getPointSpline: function(a, C, p) {
          var m = C.plotX,
              e = C.plotY,
              k = a[p - 1];
          p = a[p + 1];
          var w,
              t,
              n,
              c;
          if (k && !k.isNull && !1 !== k.doCurve && !C.isCliff && p && !p.isNull && !1 !== p.doCurve && !C.isCliff) {
            a = k.plotY;
            n = p.plotX;
            p = p.plotY;
            var d = 0;
            w = (1.5 * m + k.plotX) / 2.5;
            t = (1.5 * e + a) / 2.5;
            n = (1.5 * m + n) / 2.5;
            c = (1.5 * e + p) / 2.5;
            n !== w && (d = (c - t) * (n - m) / (n - w) + e - c);
            t += d;
            c += d;
            t > a && t > e ? (t = Math.max(a, e), c = 2 * e - t) : t < a && t < e && (t = Math.min(a, e), c = 2 * e - t);
            c > p && c > e ? (c = Math.max(p, e), t = 2 * e - c) : c < p && c < e && (c = Math.min(p, e), t = 2 * e - c);
            C.rightContX = n;
            C.rightContY = c;
          }
          C = ["C", x(k.rightContX, k.plotX), x(k.rightContY, k.plotY), x(w, m), x(t, e), m, e];
          k.rightContX = k.rightContY = null;
          return C;
        }});
    })(K);
    (function(a) {
      var x = a.seriesTypes.area.prototype,
          E = a.seriesType;
      E("areaspline", "spline", a.defaultPlotOptions.area, {
        getStackPoints: x.getStackPoints,
        getGraphPath: x.getGraphPath,
        drawGraph: x.drawGraph,
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle
      });
    })(K);
    (function(a) {
      var x = a.animObject,
          E = a.each,
          C = a.extend,
          p = a.isNumber,
          m = a.merge,
          e = a.pick,
          k = a.Series,
          w = a.seriesType,
          t = a.svg;
      w("column", "line", {
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
          k.prototype.init.apply(this, arguments);
          var a = this,
              c = a.chart;
          c.hasRendered && E(c.series, function(c) {
            c.type === a.type && (c.isDirty = !0);
          });
        },
        getColumnMetrics: function() {
          var a = this,
              c = a.options,
              d = a.xAxis,
              k = a.yAxis,
              h = d.reversed,
              f,
              b = {},
              m = 0;
          !1 === c.grouping ? m = 1 : E(a.chart.series, function(c) {
            var d = c.options,
                e = c.yAxis,
                h;
            c.type !== a.type || !c.visible && a.chart.options.chart.ignoreHiddenSeries || k.len !== e.len || k.pos !== e.pos || (d.stacking ? (f = c.stackKey, void 0 === b[f] && (b[f] = m++), h = b[f]) : !1 !== d.grouping && (h = m++), c.columnIndex = h);
          });
          var q = Math.min(Math.abs(d.transA) * (d.ordinalSlope || c.pointRange || d.closestPointRange || d.tickInterval || 1), d.len),
              p = q * c.groupPadding,
              t = (q - 2 * p) / (m || 1),
              c = Math.min(c.maxPointWidth || d.len, e(c.pointWidth, t * (1 - 2 * c.pointPadding)));
          a.columnMetrics = {
            width: c,
            offset: (t - c) / 2 + (p + ((a.columnIndex || 0) + (h ? 1 : 0)) * t - q / 2) * (h ? -1 : 1)
          };
          return a.columnMetrics;
        },
        crispCol: function(a, c, d, e) {
          var h = this.chart,
              f = this.borderWidth,
              b = -(f % 2 ? .5 : 0),
              f = f % 2 ? .5 : 1;
          h.inverted && h.renderer.isVML && (f += 1);
          this.options.crisp && (d = Math.round(a + d) + b, a = Math.round(a) + b, d -= a);
          e = Math.round(c + e) + f;
          b = .5 >= Math.abs(c) && .5 < e;
          c = Math.round(c) + f;
          e -= c;
          b && e && (--c, e += 1);
          return {
            x: a,
            y: c,
            width: d,
            height: e
          };
        },
        translate: function() {
          var a = this,
              c = a.chart,
              d = a.options,
              m = a.dense = 2 > a.closestPointRange * a.xAxis.transA,
              m = a.borderWidth = e(d.borderWidth, m ? 0 : 1),
              h = a.yAxis,
              f = d.threshold,
              b = a.translatedThreshold = h.getThreshold(f),
              u = e(d.minPointLength, 5),
              q = a.getColumnMetrics(),
              p = q.width,
              t = a.barW = Math.max(p, 1 + 2 * m),
              D = a.pointXOffset = q.offset;
          c.inverted && (b -= .5);
          d.pointPadding && (t = Math.ceil(t));
          k.prototype.translate.apply(a);
          E(a.points, function(d) {
            var k = e(d.yBottom, b),
                m = 999 + Math.abs(k),
                m = Math.min(Math.max(-m, d.plotY), h.len + m),
                n = d.plotX + D,
                q = t,
                w = Math.min(m, k),
                F,
                g = Math.max(m, k) - w;
            u && Math.abs(g) < u && (g = u, F = !h.reversed && !d.negative || h.reversed && d.negative, d.y === f && a.dataMax <= f && h.min < f && (F = !F), w = Math.abs(w - b) > u ? k - u : b - (F ? u : 0));
            d.barX = n;
            d.pointWidth = p;
            d.tooltipPos = c.inverted ? [h.len + h.pos - c.plotLeft - m, a.xAxis.len - n - q / 2, g] : [n + q / 2, m + h.pos - c.plotTop, g];
            d.shapeType = "rect";
            d.shapeArgs = a.crispCol.apply(a, d.isNull ? [n, b, q, 0] : [n, w, q, g]);
          });
        },
        getSymbol: a.noop,
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
        drawGraph: function() {
          this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data");
        },
        drawPoints: function() {
          var a = this,
              c = this.chart,
              d = a.options,
              e = c.renderer,
              h = d.animationLimit || 250,
              f;
          E(a.points, function(b) {
            var k = b.graphic;
            if (p(b.plotY) && null !== b.y) {
              f = b.shapeArgs;
              if (k)
                k[c.pointCount < h ? "animate" : "attr"](m(f));
              else
                b.graphic = k = e[b.shapeType](f).add(b.group || a.group);
              d.borderRadius && k.attr({r: d.borderRadius});
              k.addClass(b.getClassName(), !0);
            } else
              k && (b.graphic = k.destroy());
          });
        },
        animate: function(a) {
          var c = this,
              d = this.yAxis,
              e = c.options,
              h = this.chart.inverted,
              f = {},
              b = h ? "translateX" : "translateY",
              k;
          t && (a ? (f.scaleY = .001, a = Math.min(d.pos + d.len, Math.max(d.pos, d.toPixels(e.threshold))), h ? f.translateX = a - d.len : f.translateY = a, c.group.attr(f)) : (k = c.group.attr(b), c.group.animate({scaleY: 1}, C(x(c.options.animation), {step: function(a, e) {
              f[b] = k + e.pos * (d.pos - k);
              c.group.attr(f);
            }})), c.animate = null));
        },
        remove: function() {
          var a = this,
              c = a.chart;
          c.hasRendered && E(c.series, function(c) {
            c.type === a.type && (c.isDirty = !0);
          });
          k.prototype.remove.apply(a, arguments);
        }
      });
    })(K);
    (function(a) {
      a = a.seriesType;
      a("bar", "column", null, {inverted: !0});
    })(K);
    (function(a) {
      var x = a.Series;
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
          this.options.lineWidth && x.prototype.drawGraph.call(this);
        }
      });
    })(K);
    (function(a) {
      var x = a.deg2rad,
          E = a.isNumber,
          C = a.pick,
          p = a.relativeLength;
      a.CenteredSeriesMixin = {
        getCenter: function() {
          var a = this.options,
              e = this.chart,
              k = 2 * (a.slicedOffset || 0),
              w = e.plotWidth - 2 * k,
              e = e.plotHeight - 2 * k,
              t = a.center,
              t = [C(t[0], "50%"), C(t[1], "50%"), a.size || "100%", a.innerSize || 0],
              n = Math.min(w, e),
              c,
              d;
          for (c = 0; 4 > c; ++c)
            d = t[c], a = 2 > c || 2 === c && /%$/.test(d), t[c] = p(d, [w, e, n, t[2]][c]) + (a ? k : 0);
          t[3] > t[2] && (t[3] = t[2]);
          return t;
        },
        getStartAndEndRadians: function(a, e) {
          a = E(a) ? a : 0;
          e = E(e) && e > a && 360 > e - a ? e : a + 360;
          return {
            start: x * (a + -90),
            end: x * (e + -90)
          };
        }
      };
    })(K);
    (function(a) {
      var x = a.addEvent,
          E = a.CenteredSeriesMixin,
          C = a.defined,
          p = a.each,
          m = a.extend,
          e = E.getStartAndEndRadians,
          k = a.inArray,
          w = a.noop,
          t = a.pick,
          n = a.Point,
          c = a.Series,
          d = a.seriesType,
          A = a.setAnimation;
      d("pie", "line", {
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
          var c = this,
              b = c.points,
              d = c.startAngleRad;
          a || (p(b, function(a) {
            var b = a.graphic,
                f = a.shapeArgs;
            b && (b.attr({
              r: a.startR || c.center[3] / 2,
              start: d,
              end: d
            }), b.animate({
              r: f.r,
              start: f.start,
              end: f.end
            }, c.options.animation));
          }), c.animate = null);
        },
        updateTotals: function() {
          var a,
              c = 0,
              b = this.points,
              d = b.length,
              e,
              k = this.options.ignoreHiddenPoint;
          for (a = 0; a < d; a++)
            e = b[a], c += k && !e.visible ? 0 : e.isNull ? 0 : e.y;
          this.total = c;
          for (a = 0; a < d; a++)
            e = b[a], e.percentage = 0 < c && (e.visible || !k) ? e.y / c * 100 : 0, e.total = c;
        },
        generatePoints: function() {
          c.prototype.generatePoints.call(this);
          this.updateTotals();
        },
        translate: function(a) {
          this.generatePoints();
          var c = 0,
              b = this.options,
              d = b.slicedOffset,
              h = d + (b.borderWidth || 0),
              k,
              m,
              n,
              p = e(b.startAngle, b.endAngle),
              z = this.startAngleRad = p.start,
              p = (this.endAngleRad = p.end) - z,
              r = this.points,
              y,
              w = b.dataLabels.distance,
              b = b.ignoreHiddenPoint,
              x,
              A = r.length,
              g;
          a || (this.center = a = this.getCenter());
          this.getX = function(b, c, f) {
            n = Math.asin(Math.min((b - a[1]) / (a[2] / 2 + f.labelDistance), 1));
            return a[0] + (c ? -1 : 1) * Math.cos(n) * (a[2] / 2 + f.labelDistance);
          };
          for (x = 0; x < A; x++) {
            g = r[x];
            g.labelDistance = t(g.options.dataLabels && g.options.dataLabels.distance, w);
            this.maxLabelDistance = Math.max(this.maxLabelDistance || 0, g.labelDistance);
            k = z + c * p;
            if (!b || g.visible)
              c += g.percentage / 100;
            m = z + c * p;
            g.shapeType = "arc";
            g.shapeArgs = {
              x: a[0],
              y: a[1],
              r: a[2] / 2,
              innerR: a[3] / 2,
              start: Math.round(1E3 * k) / 1E3,
              end: Math.round(1E3 * m) / 1E3
            };
            n = (m + k) / 2;
            n > 1.5 * Math.PI ? n -= 2 * Math.PI : n < -Math.PI / 2 && (n += 2 * Math.PI);
            g.slicedTranslation = {
              translateX: Math.round(Math.cos(n) * d),
              translateY: Math.round(Math.sin(n) * d)
            };
            m = Math.cos(n) * a[2] / 2;
            y = Math.sin(n) * a[2] / 2;
            g.tooltipPos = [a[0] + .7 * m, a[1] + .7 * y];
            g.half = n < -Math.PI / 2 || n > Math.PI / 2 ? 1 : 0;
            g.angle = n;
            k = Math.min(h, g.labelDistance / 5);
            g.labelPos = [a[0] + m + Math.cos(n) * g.labelDistance, a[1] + y + Math.sin(n) * g.labelDistance, a[0] + m + Math.cos(n) * k, a[1] + y + Math.sin(n) * k, a[0] + m, a[1] + y, 0 > g.labelDistance ? "center" : g.half ? "right" : "left", n];
          }
        },
        drawGraph: null,
        drawPoints: function() {
          var a = this,
              c = a.chart.renderer,
              b,
              d,
              e;
          p(a.points, function(f) {
            d = f.graphic;
            f.isNull ? d && (f.graphic = d.destroy()) : (e = f.shapeArgs, b = f.getTranslate(), d ? d.setRadialReference(a.center).animate(m(e, b)) : (f.graphic = d = c[f.shapeType](e).setRadialReference(a.center).attr(b).add(a.group), f.visible || d.attr({visibility: "hidden"})), d.addClass(f.getClassName()));
          });
        },
        searchPoint: w,
        sortByAngle: function(a, c) {
          a.sort(function(a, f) {
            return void 0 !== a.angle && (f.angle - a.angle) * c;
          });
        },
        drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
        getCenter: E.getCenter,
        getSymbol: w
      }, {
        init: function() {
          n.prototype.init.apply(this, arguments);
          var a = this,
              c;
          a.name = t(a.name, "Slice");
          c = function(b) {
            a.slice("select" === b.type);
          };
          x(a, "select", c);
          x(a, "unselect", c);
          return a;
        },
        isValid: function() {
          return a.isNumber(this.y, !0) && 0 <= this.y;
        },
        setVisible: function(a, c) {
          var b = this,
              f = b.series,
              d = f.chart,
              e = f.options.ignoreHiddenPoint;
          c = t(c, e);
          a !== b.visible && (b.visible = b.options.visible = a = void 0 === a ? !b.visible : a, f.options.data[k(b, f.data)] = b.options, p(["graphic", "dataLabel", "connector", "shadowGroup"], function(c) {
            if (b[c])
              b[c][a ? "show" : "hide"](!0);
          }), b.legendItem && d.legend.colorizeItem(b, a), a || "hover" !== b.state || b.setState(""), e && (f.isDirty = !0), c && d.redraw());
        },
        slice: function(a, c, b) {
          var f = this.series;
          A(b, f.chart);
          t(c, !0);
          this.sliced = this.options.sliced = C(a) ? a : !this.sliced;
          f.options.data[k(this, f.data)] = this.options;
          this.graphic.animate(this.getTranslate());
        },
        getTranslate: function() {
          return this.sliced ? this.slicedTranslation : {
            translateX: 0,
            translateY: 0
          };
        },
        haloPath: function(a) {
          var c = this.shapeArgs;
          return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(c.x, c.y, c.r + a, c.r + a, {
            innerR: this.shapeArgs.r - 1,
            start: c.start,
            end: c.end
          });
        }
      });
    })(K);
    (function(a) {
      var x = a.addEvent,
          E = a.arrayMax,
          C = a.defined,
          p = a.each,
          m = a.extend,
          e = a.format,
          k = a.map,
          w = a.merge,
          t = a.noop,
          n = a.pick,
          c = a.relativeLength,
          d = a.Series,
          A = a.seriesTypes,
          h = a.stableSort;
      a.distribute = function(a, b) {
        function c(a, b) {
          return a.target - b.target;
        }
        var f,
            d = !0,
            e = a,
            m = [],
            t;
        t = 0;
        for (f = a.length; f--; )
          t += a[f].size;
        if (t > b) {
          h(a, function(a, b) {
            return (b.rank || 0) - (a.rank || 0);
          });
          for (t = f = 0; t <= b; )
            t += a[f].size, f++;
          m = a.splice(f - 1, a.length);
        }
        h(a, c);
        for (a = k(a, function(a) {
          return {
            size: a.size,
            targets: [a.target],
            align: n(a.align, .5)
          };
        }); d; ) {
          for (f = a.length; f--; )
            d = a[f], t = (Math.min.apply(0, d.targets) + Math.max.apply(0, d.targets)) / 2, d.pos = Math.min(Math.max(0, t - d.size * d.align), b - d.size);
          f = a.length;
          for (d = !1; f--; )
            0 < f && a[f - 1].pos + a[f - 1].size > a[f].pos && (a[f - 1].size += a[f].size, a[f - 1].targets = a[f - 1].targets.concat(a[f].targets), a[f - 1].align = .5, a[f - 1].pos + a[f - 1].size > b && (a[f - 1].pos = b - a[f - 1].size), a.splice(f, 1), d = !0);
        }
        f = 0;
        p(a, function(a) {
          var b = 0;
          p(a.targets, function() {
            e[f].pos = a.pos + b;
            b += e[f].size;
            f++;
          });
        });
        e.push.apply(e, m);
        h(e, c);
      };
      d.prototype.drawDataLabels = function() {
        function c(a, b) {
          var c = b.filter;
          return c ? (b = c.operator, a = a[c.property], c = c.value, "\x3e" === b && a > c || "\x3c" === b && a < c || "\x3e\x3d" === b && a >= c || "\x3c\x3d" === b && a <= c || "\x3d\x3d" === b && a == c || "\x3d\x3d\x3d" === b && a === c ? !0 : !1) : !0;
        }
        var b = this,
            d = b.chart,
            k = b.options,
            h = k.dataLabels,
            m = b.points,
            t,
            F,
            z = b.hasRendered || 0,
            r,
            y,
            G = n(h.defer, !!k.animation),
            B = d.renderer;
        if (h.enabled || b._hasPointLabels)
          b.dlProcessOptions && b.dlProcessOptions(h), y = b.plotGroup("dataLabelsGroup", "data-labels", G && !z ? "hidden" : "visible", h.zIndex || 6), G && (y.attr({opacity: +z}), z || x(b, "afterAnimate", function() {
            b.visible && y.show(!0);
            y[k.animation ? "animate" : "attr"]({opacity: 1}, {duration: 200});
          })), F = h, p(m, function(f) {
            var g,
                k = f.dataLabel,
                m,
                l,
                q = f.connector,
                p = !k,
                u;
            t = f.dlOptions || f.options && f.options.dataLabels;
            (g = n(t && t.enabled, F.enabled) && !f.isNull) && (g = !0 === c(f, t || h));
            g && (h = w(F, t), m = f.getLabelConfig(), u = h[f.formatPrefix + "Format"] || h.format, r = C(u) ? e(u, m, d.time) : (h[f.formatPrefix + "Formatter"] || h.formatter).call(m, h), m = h.rotation, l = {
              r: h.borderRadius || 0,
              rotation: m,
              padding: h.padding,
              zIndex: 1
            }, a.objectEach(l, function(a, b) {
              void 0 === a && delete l[b];
            }));
            !k || g && C(r) ? g && C(r) && (k ? l.text = r : (k = f.dataLabel = m ? B.text(r, 0, -9999).addClass("highcharts-data-label") : B.label(r, 0, -9999, h.shape, null, null, h.useHTML, null, "data-label"), k.addClass(" highcharts-data-label-color-" + f.colorIndex + " " + (h.className || "") + (h.useHTML ? "highcharts-tracker" : ""))), k.attr(l), k.added || k.add(y), b.alignDataLabel(f, k, h, null, p)) : (f.dataLabel = k = k.destroy(), q && (f.connector = q.destroy()));
          });
        a.fireEvent(this, "afterDrawDataLabels");
      };
      d.prototype.alignDataLabel = function(a, b, c, d, e) {
        var f = this.chart,
            k = f.inverted,
            h = n(a.dlBox && a.dlBox.centerX, a.plotX, -9999),
            q = n(a.plotY, -9999),
            r = b.getBBox(),
            p,
            u = c.rotation,
            t = c.align,
            w = this.visible && (a.series.forceDL || f.isInsidePlot(h, Math.round(q), k) || d && f.isInsidePlot(h, k ? d.x + 1 : d.y + d.height - 1, k)),
            g = "justify" === n(c.overflow, "justify");
        if (w && (p = f.renderer.fontMetrics(void 0, b).b, d = m({
          x: k ? this.yAxis.len - q : h,
          y: Math.round(k ? this.xAxis.len - h : q),
          width: 0,
          height: 0
        }, d), m(c, {
          width: r.width,
          height: r.height
        }), u ? (g = !1, h = f.renderer.rotCorr(p, u), h = {
          x: d.x + c.x + d.width / 2 + h.x,
          y: d.y + c.y + {
            top: 0,
            middle: .5,
            bottom: 1
          }[c.verticalAlign] * d.height
        }, b[e ? "attr" : "animate"](h).attr({align: t}), q = (u + 720) % 360, q = 180 < q && 360 > q, "left" === t ? h.y -= q ? r.height : 0 : "center" === t ? (h.x -= r.width / 2, h.y -= r.height / 2) : "right" === t && (h.x -= r.width, h.y -= q ? 0 : r.height)) : (b.align(c, null, d), h = b.alignAttr), g ? a.isLabelJustified = this.justifyDataLabel(b, c, h, r, d, e) : n(c.crop, !0) && (w = f.isInsidePlot(h.x, h.y) && f.isInsidePlot(h.x + r.width, h.y + r.height)), c.shape && !u))
          b[e ? "attr" : "animate"]({
            anchorX: k ? f.plotWidth - a.plotY : a.plotX,
            anchorY: k ? f.plotHeight - a.plotX : a.plotY
          });
        w || (b.attr({y: -9999}), b.placed = !1);
      };
      d.prototype.justifyDataLabel = function(a, b, c, d, e, h) {
        var f = this.chart,
            k = b.align,
            m = b.verticalAlign,
            n,
            q,
            p = a.box ? 0 : a.padding || 0;
        n = c.x + p;
        0 > n && ("right" === k ? b.align = "left" : b.x = -n, q = !0);
        n = c.x + d.width - p;
        n > f.plotWidth && ("left" === k ? b.align = "right" : b.x = f.plotWidth - n, q = !0);
        n = c.y + p;
        0 > n && ("bottom" === m ? b.verticalAlign = "top" : b.y = -n, q = !0);
        n = c.y + d.height - p;
        n > f.plotHeight && ("top" === m ? b.verticalAlign = "bottom" : b.y = f.plotHeight - n, q = !0);
        q && (a.placed = !h, a.align(b, null, e));
        return q;
      };
      A.pie && (A.pie.prototype.drawDataLabels = function() {
        var c = this,
            b = c.data,
            e,
            h = c.chart,
            k = c.options.dataLabels,
            m = n(k.connectorPadding, 10),
            t = n(k.connectorWidth, 1),
            w = h.plotWidth,
            z = h.plotHeight,
            r,
            y = c.center,
            x = y[2] / 2,
            B = y[1],
            A,
            g,
            v,
            L,
            l = [[], []],
            J,
            K,
            Q,
            P,
            O = [0, 0, 0, 0];
        c.visible && (k.enabled || c._hasPointLabels) && (p(b, function(a) {
          a.dataLabel && a.visible && a.dataLabel.shortened && (a.dataLabel.attr({width: "auto"}).css({
            width: "auto",
            textOverflow: "clip"
          }), a.dataLabel.shortened = !1);
        }), d.prototype.drawDataLabels.apply(c), p(b, function(a) {
          a.dataLabel && a.visible && (l[a.half].push(a), a.dataLabel._pos = null);
        }), p(l, function(b, f) {
          var d,
              l,
              r = b.length,
              q = [],
              t;
          if (r)
            for (c.sortByAngle(b, f - .5), 0 < c.maxLabelDistance && (d = Math.max(0, B - x - c.maxLabelDistance), l = Math.min(B + x + c.maxLabelDistance, h.plotHeight), p(b, function(a) {
              0 < a.labelDistance && a.dataLabel && (a.top = Math.max(0, B - x - a.labelDistance), a.bottom = Math.min(B + x + a.labelDistance, h.plotHeight), t = a.dataLabel.getBBox().height || 21, a.positionsIndex = q.push({
                target: a.labelPos[1] - a.top + t / 2,
                size: t,
                rank: a.y
              }) - 1);
            }), a.distribute(q, l + t - d)), P = 0; P < r; P++)
              e = b[P], l = e.positionsIndex, v = e.labelPos, A = e.dataLabel, Q = !1 === e.visible ? "hidden" : "inherit", K = d = v[1], q && C(q[l]) && (void 0 === q[l].pos ? Q = "hidden" : (L = q[l].size, K = e.top + q[l].pos)), delete e.positionIndex, J = k.justify ? y[0] + (f ? -1 : 1) * (x + e.labelDistance) : c.getX(K < e.top + 2 || K > e.bottom - 2 ? d : K, f, e), A._attr = {
                visibility: Q,
                align: v[6]
              }, A._pos = {
                x: J + k.x + ({
                  left: m,
                  right: -m
                }[v[6]] || 0),
                y: K + k.y - 10
              }, v.x = J, v.y = K, n(k.crop, !0) && (g = A.getBBox().width, d = null, J - g < m ? (d = Math.round(g - J + m), O[3] = Math.max(d, O[3])) : J + g > w - m && (d = Math.round(J + g - w + m), O[1] = Math.max(d, O[1])), 0 > K - L / 2 ? O[0] = Math.max(Math.round(-K + L / 2), O[0]) : K + L / 2 > z && (O[2] = Math.max(Math.round(K + L / 2 - z), O[2])), A.sideOverflow = d);
        }), 0 === E(O) || this.verifyDataLabelOverflow(O)) && (this.placeDataLabels(), t && p(this.points, function(a) {
          var b;
          r = a.connector;
          if ((A = a.dataLabel) && A._pos && a.visible && 0 < a.labelDistance) {
            Q = A._attr.visibility;
            if (b = !r)
              a.connector = r = h.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-" + a.colorIndex).add(c.dataLabelsGroup);
            r[b ? "attr" : "animate"]({d: c.connectorPath(a.labelPos)});
            r.attr("visibility", Q);
          } else
            r && (a.connector = r.destroy());
        }));
      }, A.pie.prototype.connectorPath = function(a) {
        var b = a.x,
            c = a.y;
        return n(this.options.dataLabels.softConnector, !0) ? ["M", b + ("left" === a[6] ? 5 : -5), c, "C", b, c, 2 * a[2] - a[4], 2 * a[3] - a[5], a[2], a[3], "L", a[4], a[5]] : ["M", b + ("left" === a[6] ? 5 : -5), c, "L", a[2], a[3], "L", a[4], a[5]];
      }, A.pie.prototype.placeDataLabels = function() {
        p(this.points, function(a) {
          var b = a.dataLabel;
          b && a.visible && ((a = b._pos) ? (b.sideOverflow && (b._attr.width = b.getBBox().width - b.sideOverflow, b.css({
            width: b._attr.width + "px",
            textOverflow: "ellipsis"
          }), b.shortened = !0), b.attr(b._attr), b[b.moved ? "animate" : "attr"](a), b.moved = !0) : b && b.attr({y: -9999}));
        }, this);
      }, A.pie.prototype.alignDataLabel = t, A.pie.prototype.verifyDataLabelOverflow = function(a) {
        var b = this.center,
            d = this.options,
            f = d.center,
            e = d.minSize || 80,
            h,
            k = null !== d.size;
        k || (null !== f[0] ? h = Math.max(b[2] - Math.max(a[1], a[3]), e) : (h = Math.max(b[2] - a[1] - a[3], e), b[0] += (a[3] - a[1]) / 2), null !== f[1] ? h = Math.max(Math.min(h, b[2] - Math.max(a[0], a[2])), e) : (h = Math.max(Math.min(h, b[2] - a[0] - a[2]), e), b[1] += (a[0] - a[2]) / 2), h < b[2] ? (b[2] = h, b[3] = Math.min(c(d.innerSize || 0, h), h), this.translate(b), this.drawDataLabels && this.drawDataLabels()) : k = !0);
        return k;
      });
      A.column && (A.column.prototype.alignDataLabel = function(a, b, c, e, h) {
        var f = this.chart.inverted,
            k = a.series,
            m = a.dlBox || a.shapeArgs,
            p = n(a.below, a.plotY > n(this.translatedThreshold, k.yAxis.len)),
            r = n(c.inside, !!this.options.stacking);
        m && (e = w(m), 0 > e.y && (e.height += e.y, e.y = 0), m = e.y + e.height - k.yAxis.len, 0 < m && (e.height -= m), f && (e = {
          x: k.yAxis.len - e.y - e.height,
          y: k.xAxis.len - e.x - e.width,
          width: e.height,
          height: e.width
        }), r || (f ? (e.x += p ? 0 : e.width, e.width = 0) : (e.y += p ? e.height : 0, e.height = 0)));
        c.align = n(c.align, !f || r ? "center" : p ? "right" : "left");
        c.verticalAlign = n(c.verticalAlign, f || r ? "middle" : p ? "top" : "bottom");
        d.prototype.alignDataLabel.call(this, a, b, c, e, h);
        a.isLabelJustified && a.contrastColor && a.dataLabel.css({color: a.contrastColor});
      });
    })(K);
    (function(a) {
      var x = a.Chart,
          E = a.each,
          C = a.objectEach,
          p = a.pick;
      a = a.addEvent;
      a(x.prototype, "render", function() {
        var a = [];
        E(this.labelCollectors || [], function(e) {
          a = a.concat(e());
        });
        E(this.yAxis || [], function(e) {
          e.options.stackLabels && !e.options.stackLabels.allowOverlap && C(e.stacks, function(e) {
            C(e, function(e) {
              a.push(e.label);
            });
          });
        });
        E(this.series || [], function(e) {
          var k = e.options.dataLabels,
              m = e.dataLabelCollections || ["dataLabel"];
          (k.enabled || e._hasPointLabels) && !k.allowOverlap && e.visible && E(m, function(k) {
            E(e.points, function(e) {
              e[k] && (e[k].labelrank = p(e.labelrank, e.shapeArgs && e.shapeArgs.height), a.push(e[k]));
            });
          });
        });
        this.hideOverlappingLabels(a);
      });
      x.prototype.hideOverlappingLabels = function(a) {
        var e = a.length,
            k,
            m,
            p,
            n,
            c,
            d,
            x,
            h,
            f,
            b = function(a, b, c, d, e, f, h, k) {
              return !(e > a + c || e + h < a || f > b + d || f + k < b);
            };
        for (m = 0; m < e; m++)
          if (k = a[m])
            k.oldOpacity = k.opacity, k.newOpacity = 1, k.width || (p = k.getBBox(), k.width = p.width, k.height = p.height);
        a.sort(function(a, b) {
          return (b.labelrank || 0) - (a.labelrank || 0);
        });
        for (m = 0; m < e; m++)
          for (p = a[m], k = m + 1; k < e; ++k)
            if (n = a[k], p && n && p !== n && p.placed && n.placed && 0 !== p.newOpacity && 0 !== n.newOpacity && (c = p.alignAttr, d = n.alignAttr, x = p.parentGroup, h = n.parentGroup, f = 2 * (p.box ? 0 : p.padding || 0), c = b(c.x + x.translateX, c.y + x.translateY, p.width - f, p.height - f, d.x + h.translateX, d.y + h.translateY, n.width - f, n.height - f)))
              (p.labelrank < n.labelrank ? p : n).newOpacity = 0;
        E(a, function(a) {
          var b,
              c;
          a && (c = a.newOpacity, a.oldOpacity !== c && a.placed && (c ? a.show(!0) : b = function() {
            a.hide();
          }, a.alignAttr.opacity = c, a[a.isOld ? "animate" : "attr"](a.alignAttr, null, b)), a.isOld = !0);
        });
      };
    })(K);
    (function(a) {
      var x = a.addEvent,
          E = a.Chart,
          C = a.createElement,
          p = a.css,
          m = a.defaultOptions,
          e = a.defaultPlotOptions,
          k = a.each,
          w = a.extend,
          t = a.fireEvent,
          n = a.hasTouch,
          c = a.inArray,
          d = a.isObject,
          A = a.Legend,
          h = a.merge,
          f = a.pick,
          b = a.Point,
          u = a.Series,
          q = a.seriesTypes,
          H = a.svg,
          K;
      K = a.TrackerMixin = {
        drawTrackerPoint: function() {
          var a = this,
              b = a.chart.pointer,
              c = function(a) {
                var c = b.getPointFromEvent(a);
                void 0 !== c && (b.isDirectTouch = !0, c.onMouseOver(a));
              };
          k(a.points, function(a) {
            a.graphic && (a.graphic.element.point = a);
            a.dataLabel && (a.dataLabel.div ? a.dataLabel.div.point = a : a.dataLabel.element.point = a);
          });
          a._hasTracking || (k(a.trackerGroups, function(d) {
            if (a[d] && (a[d].addClass("highcharts-tracker").on("mouseover", c).on("mouseout", function(a) {
              b.onTrackerMouseOut(a);
            }), n))
              a[d].on("touchstart", c);
          }), a._hasTracking = !0);
          t(this, "afterDrawTracker");
        },
        drawTrackerGraph: function() {
          var a = this,
              b = a.options.trackByArea,
              c = [].concat(b ? a.areaPath : a.graphPath),
              d = c.length,
              e = a.chart,
              f = e.pointer,
              h = e.renderer,
              m = e.options.tooltip.snap,
              g = a.tracker,
              p,
              q = function() {
                if (e.hoverSeries !== a)
                  a.onMouseOver();
              },
              l = "rgba(192,192,192," + (H ? .0001 : .002) + ")";
          if (d && !b)
            for (p = d + 1; p--; )
              "M" === c[p] && c.splice(p + 1, 0, c[p + 1] - m, c[p + 2], "L"), (p && "M" === c[p] || p === d) && c.splice(p, 0, "L", c[p - 2] + m, c[p - 1]);
          g ? g.attr({d: c}) : a.graph && (a.tracker = h.path(c).attr({
            "stroke-linejoin": "round",
            visibility: a.visible ? "visible" : "hidden",
            stroke: l,
            fill: b ? l : "none",
            "stroke-width": a.graph.strokeWidth() + (b ? 0 : 2 * m),
            zIndex: 2
          }).add(a.group), k([a.tracker, a.markerGroup], function(a) {
            a.addClass("highcharts-tracker").on("mouseover", q).on("mouseout", function(a) {
              f.onTrackerMouseOut(a);
            });
            if (n)
              a.on("touchstart", q);
          }));
          t(this, "afterDrawTracker");
        }
      };
      q.column && (q.column.prototype.drawTracker = K.drawTrackerPoint);
      q.pie && (q.pie.prototype.drawTracker = K.drawTrackerPoint);
      q.scatter && (q.scatter.prototype.drawTracker = K.drawTrackerPoint);
      w(A.prototype, {
        setItemEvents: function(a, c, d) {
          var e = this.chart.renderer.boxWrapper,
              f = "highcharts-legend-" + (a instanceof b ? "point" : "series") + "-active";
          (d ? c : a.legendGroup).on("mouseover", function() {
            a.setState("hover");
            e.addClass(f);
          }).on("mouseout", function() {
            e.removeClass(f);
            a.setState();
          }).on("click", function(b) {
            var c = function() {
              a.setVisible && a.setVisible();
            };
            e.removeClass(f);
            b = {browserEvent: b};
            a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : t(a, "legendItemClick", b, c);
          });
        },
        createCheckboxForItem: function(a) {
          a.checkbox = C("input", {
            type: "checkbox",
            checked: a.selected,
            defaultChecked: a.selected
          }, this.options.itemCheckboxStyle, this.chart.container);
          x(a.checkbox, "click", function(b) {
            t(a.series || a, "checkboxClick", {
              checked: b.target.checked,
              item: a
            }, function() {
              a.select();
            });
          });
        }
      });
      w(E.prototype, {
        showResetZoom: function() {
          function a() {
            b.zoomOut();
          }
          var b = this,
              c = m.lang,
              d = b.options.chart.resetZoomButton,
              e = d.theme,
              f = e.states,
              h = "chart" === d.relativeTo ? null : "plotBox";
          t(this, "beforeShowResetZoom", null, function() {
            b.resetZoomButton = b.renderer.button(c.resetZoom, null, null, a, e, f && f.hover).attr({
              align: d.position.align,
              title: c.resetZoomTitle
            }).addClass("highcharts-reset-zoom").add().align(d.position, !1, h);
          });
        },
        zoomOut: function() {
          var a = this;
          t(a, "selection", {resetSelection: !0}, function() {
            a.zoom();
          });
        },
        zoom: function(a) {
          var b,
              c = this.pointer,
              e = !1,
              h;
          !a || a.resetSelection ? (k(this.axes, function(a) {
            b = a.zoom();
          }), c.initiated = !1) : k(a.xAxis.concat(a.yAxis), function(a) {
            var d = a.axis;
            c[d.isXAxis ? "zoomX" : "zoomY"] && (b = d.zoom(a.min, a.max), d.displayBtn && (e = !0));
          });
          h = this.resetZoomButton;
          e && !h ? this.showResetZoom() : !e && d(h) && (this.resetZoomButton = h.destroy());
          b && this.redraw(f(this.options.chart.animation, a && a.animation, 100 > this.pointCount));
        },
        pan: function(a, b) {
          var c = this,
              d = c.hoverPoints,
              e;
          d && k(d, function(a) {
            a.setState();
          });
          k("xy" === b ? [1, 0] : [1], function(b) {
            b = c[b ? "xAxis" : "yAxis"][0];
            var d = b.horiz,
                f = a[d ? "chartX" : "chartY"],
                d = d ? "mouseDownX" : "mouseDownY",
                g = c[d],
                h = (b.pointRange || 0) / 2,
                k = b.getExtremes(),
                l = b.toValue(g - f, !0) + h,
                m = b.toValue(g + b.len - f, !0) - h,
                n = m < l,
                g = n ? m : l,
                l = n ? l : m,
                m = Math.min(k.dataMin, h ? k.min : b.toValue(b.toPixels(k.min) - b.minPixelPadding)),
                h = Math.max(k.dataMax, h ? k.max : b.toValue(b.toPixels(k.max) + b.minPixelPadding)),
                n = m - g;
            0 < n && (l += n, g = m);
            n = l - h;
            0 < n && (l = h, g -= n);
            b.series.length && g !== k.min && l !== k.max && (b.setExtremes(g, l, !1, !1, {trigger: "pan"}), e = !0);
            c[d] = f;
          });
          e && c.redraw(!1);
          p(c.container, {cursor: "move"});
        }
      });
      w(b.prototype, {
        select: function(a, b) {
          var d = this,
              e = d.series,
              h = e.chart;
          a = f(a, !d.selected);
          d.firePointEvent(a ? "select" : "unselect", {accumulate: b}, function() {
            d.selected = d.options.selected = a;
            e.options.data[c(d, e.data)] = d.options;
            d.setState(a && "select");
            b || k(h.getSelectedPoints(), function(a) {
              a.selected && a !== d && (a.selected = a.options.selected = !1, e.options.data[c(a, e.data)] = a.options, a.setState(""), a.firePointEvent("unselect"));
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
          k(a.hoverPoints || [], function(a) {
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
              x(b, c, a);
            });
            this.hasImportedEvents = !0;
          }
        },
        setState: function(a, b) {
          var c = Math.floor(this.plotX),
              d = this.plotY,
              h = this.series,
              k = h.options.states[a || "normal"] || {},
              m = e[h.type].marker && h.options.marker,
              n = m && !1 === m.enabled,
              g = m && m.states && m.states[a || "normal"] || {},
              p = !1 === g.enabled,
              q = h.stateMarkerGraphic,
              l = this.marker || {},
              u = h.chart,
              w = h.halo,
              x,
              A = m && h.markerAttribs;
          a = a || "";
          if (!(a === this.state && !b || this.selected && "select" !== a || !1 === k.enabled || a && (p || n && !1 === g.enabled) || a && l.states && l.states[a] && !1 === l.states[a].enabled)) {
            A && (x = h.markerAttribs(this, a));
            if (this.graphic)
              this.state && this.graphic.removeClass("highcharts-point-" + this.state), a && this.graphic.addClass("highcharts-point-" + a), x && this.graphic.animate(x, f(u.options.chart.animation, g.animation, m.animation)), q && q.hide();
            else {
              if (a && g)
                if (m = l.symbol || h.symbol, q && q.currentSymbol !== m && (q = q.destroy()), q)
                  q[b ? "animate" : "attr"]({
                    x: x.x,
                    y: x.y
                  });
                else
                  m && (h.stateMarkerGraphic = q = u.renderer.symbol(m, x.x, x.y, x.width, x.height).add(h.markerGroup), q.currentSymbol = m);
              q && (q[a && u.isInsidePlot(c, d, u.inverted) ? "show" : "hide"](), q.element.point = this);
            }
            (c = k.halo) && c.size ? (w || (h.halo = w = u.renderer.path().add((this.graphic || q).parentGroup)), w.show()[b ? "animate" : "attr"]({d: this.haloPath(c.size)}), w.attr({"class": "highcharts-halo highcharts-color-" + f(this.colorIndex, h.colorIndex)}), w.point = this) : w && w.point && w.point.haloPath && w.animate({d: w.point.haloPath(0)}, null, w.hide);
            this.state = a;
            t(this, "afterSetState");
          }
        },
        haloPath: function(a) {
          return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) - a, this.plotY - a, 2 * a, 2 * a);
        }
      });
      w(u.prototype, {
        onMouseOver: function() {
          var a = this.chart,
              b = a.hoverSeries;
          if (b && b !== this)
            b.onMouseOut();
          this.options.events.mouseOver && t(this, "mouseOver");
          this.setState("hover");
          a.hoverSeries = this;
        },
        onMouseOut: function() {
          var a = this.options,
              b = this.chart,
              c = b.tooltip,
              d = b.hoverPoint;
          b.hoverSeries = null;
          if (d)
            d.onMouseOut();
          this && a.events.mouseOut && t(this, "mouseOut");
          !c || this.stickyTracking || c.shared && !this.noSharedTooltip || c.hide();
          this.setState();
        },
        setState: function(a) {
          var b = this;
          a = a || "";
          b.state !== a && (k([b.group, b.markerGroup, b.dataLabelsGroup], function(c) {
            c && (b.state && c.removeClass("highcharts-series-" + b.state), a && c.addClass("highcharts-series-" + a));
          }), b.state = a);
        },
        setVisible: function(a, b) {
          var c = this,
              d = c.chart,
              e = c.legendItem,
              f,
              h = d.options.chart.ignoreHiddenSeries,
              m = c.visible;
          f = (c.visible = a = c.options.visible = c.userOptions.visible = void 0 === a ? !m : a) ? "show" : "hide";
          k(["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"], function(a) {
            if (c[a])
              c[a][f]();
          });
          if (d.hoverSeries === c || (d.hoverPoint && d.hoverPoint.series) === c)
            c.onMouseOut();
          e && d.legend.colorizeItem(c, a);
          c.isDirty = !0;
          c.options.stacking && k(d.series, function(a) {
            a.options.stacking && a.visible && (a.isDirty = !0);
          });
          k(c.linkedSeries, function(b) {
            b.setVisible(a, !1);
          });
          h && (d.isDirtyBox = !0);
          !1 !== b && d.redraw();
          t(c, f);
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
          t(this, a ? "select" : "unselect");
        },
        drawTracker: K.drawTrackerGraph
      });
    })(K);
    (function(a) {
      var x = a.Chart,
          E = a.each,
          C = a.inArray,
          p = a.isArray,
          m = a.isObject,
          e = a.pick,
          k = a.splat;
      x.prototype.setResponsive = function(e) {
        var k = this.options.responsive,
            m = [],
            c = this.currentResponsive;
        k && k.rules && E(k.rules, function(c) {
          void 0 === c._id && (c._id = a.uniqueKey());
          this.matchResponsiveRule(c, m, e);
        }, this);
        var d = a.merge.apply(0, a.map(m, function(c) {
          return a.find(k.rules, function(a) {
            return a._id === c;
          }).chartOptions;
        })),
            m = m.toString() || void 0;
        m !== (c && c.ruleIds) && (c && this.update(c.undoOptions, e), m ? (this.currentResponsive = {
          ruleIds: m,
          mergedOptions: d,
          undoOptions: this.currentOptions(d)
        }, this.update(d, e)) : this.currentResponsive = void 0);
      };
      x.prototype.matchResponsiveRule = function(a, k) {
        var m = a.condition;
        (m.callback || function() {
          return this.chartWidth <= e(m.maxWidth, Number.MAX_VALUE) && this.chartHeight <= e(m.maxHeight, Number.MAX_VALUE) && this.chartWidth >= e(m.minWidth, 0) && this.chartHeight >= e(m.minHeight, 0);
        }).call(this) && k.push(a._id);
      };
      x.prototype.currentOptions = function(e) {
        function t(c, d, e, h) {
          var f;
          a.objectEach(c, function(a, c) {
            if (!h && -1 < C(c, ["series", "xAxis", "yAxis"]))
              for (a = k(a), e[c] = [], f = 0; f < a.length; f++)
                d[c][f] && (e[c][f] = {}, t(a[f], d[c][f], e[c][f], h + 1));
            else
              m(a) ? (e[c] = p(a) ? [] : {}, t(a, d[c] || {}, e[c], h + 1)) : e[c] = d[c] || null;
          });
        }
        var n = {};
        t(e, this.options, n, 0);
        return n;
      };
    })(K);
    return K;
  });
})(require('process'));
