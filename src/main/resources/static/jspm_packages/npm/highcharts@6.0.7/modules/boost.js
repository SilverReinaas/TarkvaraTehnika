/* */ 
(function(process) {
  (function(A) {
    "object" === typeof module && module.exports ? module.exports = A : A(Highcharts);
  })(function(A) {
    (function(h) {
      function A() {
        var a = Array.prototype.slice.call(arguments),
            d = -Number.MAX_VALUE;
        p(a, function(a) {
          if ("undefined" !== typeof a && null !== a && "undefined" !== typeof a.length && 0 < a.length)
            return d = a.length, !0;
        });
        return d;
      }
      function N(a) {
        var d = 0,
            c = 0,
            f = G(a.options.boost && a.options.boost.allowForce, !0),
            b;
        if ("undefined" !== typeof a.boostForceChartBoost)
          return a.boostForceChartBoost;
        if (1 < a.series.length)
          for (var k = 0; k < a.series.length; k++)
            b = a.series[k], J[b.type] && ++c, A(b.processedXData, b.options.data, b.points) >= (b.options.boostThreshold || Number.MAX_VALUE) && ++d;
        a.boostForceChartBoost = f && c === a.series.length && 0 < d || 5 < d;
        return a.boostForceChartBoost;
      }
      function ka(a) {
        function d(b, e) {
          e = a.createShader("vertex" === e ? a.VERTEX_SHADER : a.FRAGMENT_SHADER);
          a.shaderSource(e, b);
          a.compileShader(e);
          return a.getShaderParameter(e, a.COMPILE_STATUS) ? e : !1;
        }
        function c() {
          function b(b) {
            return a.getUniformLocation(k, b);
          }
          var c = d("#version 100\nprecision highp float;\nattribute vec4 aVertexPosition;\nattribute vec4 aColor;\nvarying highp vec2 position;\nvarying highp vec4 vColor;\nuniform mat4 uPMatrix;\nuniform float pSize;\nuniform float translatedThreshold;\nuniform bool hasThreshold;\nuniform bool skipTranslation;\nuniform float plotHeight;\nuniform float xAxisTrans;\nuniform float xAxisMin;\nuniform float xAxisMinPad;\nuniform float xAxisPointRange;\nuniform float xAxisLen;\nuniform bool  xAxisPostTranslate;\nuniform float xAxisOrdinalSlope;\nuniform float xAxisOrdinalOffset;\nuniform float xAxisPos;\nuniform bool  xAxisCVSCoord;\nuniform float yAxisTrans;\nuniform float yAxisMin;\nuniform float yAxisMinPad;\nuniform float yAxisPointRange;\nuniform float yAxisLen;\nuniform bool  yAxisPostTranslate;\nuniform float yAxisOrdinalSlope;\nuniform float yAxisOrdinalOffset;\nuniform float yAxisPos;\nuniform bool  yAxisCVSCoord;\nuniform bool  isBubble;\nuniform bool  bubbleSizeByArea;\nuniform float bubbleZMin;\nuniform float bubbleZMax;\nuniform float bubbleZThreshold;\nuniform float bubbleMinSize;\nuniform float bubbleMaxSize;\nuniform bool  bubbleSizeAbs;\nuniform bool  isInverted;\nfloat bubbleRadius(){\nfloat value \x3d aVertexPosition.w;\nfloat zMax \x3d bubbleZMax;\nfloat zMin \x3d bubbleZMin;\nfloat radius \x3d 0.0;\nfloat pos \x3d 0.0;\nfloat zRange \x3d zMax - zMin;\nif (bubbleSizeAbs){\nvalue \x3d value - bubbleZThreshold;\nzMax \x3d max(zMax - bubbleZThreshold, zMin - bubbleZThreshold);\nzMin \x3d 0.0;\n}\nif (value \x3c zMin){\nradius \x3d bubbleZMin / 2.0 - 1.0;\n} else {\npos \x3d zRange \x3e 0.0 ? (value - zMin) / zRange : 0.5;\nif (bubbleSizeByArea \x26\x26 pos \x3e 0.0){\npos \x3d sqrt(pos);\n}\nradius \x3d ceil(bubbleMinSize + pos * (bubbleMaxSize - bubbleMinSize)) / 2.0;\n}\nreturn radius * 2.0;\n}\nfloat translate(float val,\nfloat pointPlacement,\nfloat localA,\nfloat localMin,\nfloat minPixelPadding,\nfloat pointRange,\nfloat len,\nbool  cvsCoord\n){\nfloat sign \x3d 1.0;\nfloat cvsOffset \x3d 0.0;\nif (cvsCoord) {\nsign *\x3d -1.0;\ncvsOffset \x3d len;\n}\nreturn sign * (val - localMin) * localA + cvsOffset + \n(sign * minPixelPadding);\n}\nfloat xToPixels(float value){\nif (skipTranslation){\nreturn value;// + xAxisPos;\n}\nreturn translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord);// + xAxisPos;\n}\nfloat yToPixels(float value, float checkTreshold){\nfloat v;\nif (skipTranslation){\nv \x3d value;// + yAxisPos;\n} else {\nv \x3d translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord);// + yAxisPos;\nif (v \x3e plotHeight) {\nv \x3d plotHeight;\n}\n}\nif (checkTreshold \x3e 0.0 \x26\x26 hasThreshold) {\nv \x3d min(v, translatedThreshold);\n}\nreturn v;\n}\nvoid main(void) {\nif (isBubble){\ngl_PointSize \x3d bubbleRadius();\n} else {\ngl_PointSize \x3d pSize;\n}\nvColor \x3d aColor;\nif (isInverted) {\ngl_Position \x3d uPMatrix * vec4(xToPixels(aVertexPosition.y) + yAxisPos, yToPixels(aVertexPosition.x, aVertexPosition.z) + xAxisPos, 0.0, 1.0);\n} else {\ngl_Position \x3d uPMatrix * vec4(xToPixels(aVertexPosition.x) + xAxisPos, yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, 0.0, 1.0);\n}\n}", "vertex"),
              f = d("precision highp float;\nuniform vec4 fillColor;\nvarying highp vec2 position;\nvarying highp vec4 vColor;\nuniform sampler2D uSampler;\nuniform bool isCircle;\nuniform bool hasColor;\nvoid main(void) {\nvec4 col \x3d fillColor;\nvec4 tcol;\nif (hasColor) {\ncol \x3d vColor;\n}\nif (isCircle) {\ntcol \x3d texture2D(uSampler, gl_PointCoord.st);\ncol *\x3d tcol;\nif (tcol.r \x3c 0.0) {\ndiscard;\n} else {\ngl_FragColor \x3d col;\n}\n} else {\ngl_FragColor \x3d col;\n}\n}", "fragment");
          if (!c || !f)
            return k = !1;
          k = a.createProgram();
          a.attachShader(k, c);
          a.attachShader(k, f);
          a.linkProgram(k);
          a.useProgram(k);
          a.bindAttribLocation(k, 0, "aVertexPosition");
          h = b("uPMatrix");
          m = b("pSize");
          Q = b("fillColor");
          n = b("isBubble");
          g = b("bubbleSizeAbs");
          C = b("bubbleSizeByArea");
          v = b("uSampler");
          e = b("skipTranslation");
          x = b("isCircle");
          p = b("isInverted");
          E = b("plotHeight");
          return !0;
        }
        function f(e, c) {
          e = b[e] = b[e] || a.getUniformLocation(k, e);
          a.uniform1f(e, c);
        }
        var b = {},
            k,
            h,
            m,
            Q,
            n,
            g,
            C,
            e,
            x,
            p,
            E,
            v;
        a && c();
        return {
          psUniform: function() {
            return m;
          },
          pUniform: function() {
            return h;
          },
          fillColorUniform: function() {
            return Q;
          },
          setPlotHeight: function(b) {
            a.uniform1f(E, b);
          },
          setBubbleUniforms: function(b, e, c) {
            var d = b.options,
                k = Number.MAX_VALUE,
                h = -Number.MAX_VALUE;
            "bubble" === b.type && (k = G(d.zMin, Math.min(k, Math.max(e, !1 === d.displayNegative ? d.zThreshold : -Number.MAX_VALUE))), h = G(d.zMax, Math.max(h, c)), a.uniform1i(n, 1), a.uniform1i(x, 1), a.uniform1i(C, "width" !== b.options.sizeBy), a.uniform1i(g, b.options.sizeByAbsoluteValue), f("bubbleZMin", k), f("bubbleZMax", h), f("bubbleZThreshold", b.options.zThreshold), f("bubbleMinSize", b.minPxSize), f("bubbleMaxSize", b.maxPxSize));
          },
          bind: function() {
            a.useProgram(k);
          },
          program: function() {
            return k;
          },
          create: c,
          setUniform: f,
          setPMatrix: function(b) {
            a.uniformMatrix4fv(h, !1, b);
          },
          setColor: function(b) {
            a.uniform4f(Q, b[0] / 255, b[1] / 255, b[2] / 255, b[3]);
          },
          setPointSize: function(b) {
            a.uniform1f(m, b);
          },
          setSkipTranslation: function(b) {
            a.uniform1i(e, !0 === b ? 1 : 0);
          },
          setTexture: function() {
            a.uniform1i(v, 0);
          },
          setDrawAsCircle: function(b) {
            a.uniform1i(x, b ? 1 : 0);
          },
          reset: function() {
            a.uniform1i(n, 0);
            a.uniform1i(x, 0);
          },
          setInverted: function(b) {
            a.uniform1i(p, b);
          },
          destroy: function() {
            a && k && (a.deleteProgram(k), k = !1);
          }
        };
      }
      function ba(a, d, c) {
        function f() {
          b && (a.deleteBuffer(b), k = b = !1);
          p = 0;
          h = c || 2;
          n = [];
        }
        var b = !1,
            k = !1,
            h = c || 2,
            m = !1,
            p = 0,
            n;
        return {
          destroy: f,
          bind: function() {
            if (!b)
              return !1;
            a.vertexAttribPointer(k, h, a.FLOAT, !1, 0, 0);
          },
          data: n,
          build: function(c, C, e) {
            var g;
            n = c || [];
            if (!(n && 0 !== n.length || m))
              return f(), !1;
            h = e || h;
            b && a.deleteBuffer(b);
            m || (g = new Float32Array(n));
            b = a.createBuffer();
            a.bindBuffer(a.ARRAY_BUFFER, b);
            a.bufferData(a.ARRAY_BUFFER, m || g, a.STATIC_DRAW);
            k = a.getAttribLocation(d.program(), C);
            a.enableVertexAttribArray(k);
            return !0;
          },
          render: function(c, d, e) {
            var f = m ? m.length : n.length;
            if (!b || !f)
              return !1;
            if (!c || c > f || 0 > c)
              c = 0;
            if (!d || d > f)
              d = f;
            a.drawArrays(a[(e || "points").toUpperCase()], c / h, (d - c) / h);
            return !0;
          },
          allocate: function(a) {
            p = -1;
            m = new Float32Array(4 * a);
          },
          push: function(a, b, e, c) {
            m && (m[++p] = a, m[++p] = b, m[++p] = e, m[++p] = c);
          }
        };
      }
      function la(a) {
        function d(a) {
          var b,
              e;
          return a.isSeriesBoosting ? (b = !!a.options.stacking, e = a.xData || a.options.xData || a.processedXData, b = (b ? a.data : e || a.options.data).length, "treemap" === a.type ? b *= 12 : "heatmap" === a.type ? b *= 6 : J[a.type] && (b *= 2), b) : 0;
        }
        function c() {
          e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT);
        }
        function f(a, b) {
          function e(a) {
            a && (b.colorData.push(a[0]), b.colorData.push(a[1]), b.colorData.push(a[2]), b.colorData.push(a[3]));
          }
          function c(a, b, c, d, f) {
            e(f);
            q.usePreallocated ? C.push(a, b, c ? 1 : 0, d || 1) : (E.push(a), E.push(b), E.push(c ? 1 : 0), E.push(d || 1));
          }
          function d() {
            b.segments.length && (b.segments[b.segments.length - 1].to = E.length);
          }
          function f() {
            b.segments.length && b.segments[b.segments.length - 1].from === E.length || (d(), b.segments.push({from: E.length}));
          }
          function F(a, b, d, f, F) {
            e(F);
            c(a + d, b);
            e(F);
            c(a, b);
            e(F);
            c(a, b + f);
            e(F);
            c(a, b + f);
            e(F);
            c(a + d, b + f);
            e(F);
            c(a + d, b);
          }
          function O(a) {
            q.useGPUTranslations || (b.skipTranslation = !0, a.x = G.toPixels(a.x, !0), a.y = aa.toPixels(a.y, !0));
            c(a.x, a.y, 0, 2);
          }
          var g = a.pointArrayMap && "low,high" === a.pointArrayMap.join(","),
              k = a.chart,
              m = a.options,
              v = !!m.stacking,
              l = m.data,
              n = a.xAxis.getExtremes(),
              x = n.min,
              n = n.max,
              w = a.yAxis.getExtremes(),
              y = w.min,
              w = w.max,
              u = a.xData || m.xData || a.processedXData,
              A = a.yData || m.yData || a.processedYData,
              B = a.zData || m.zData || a.processedZData,
              aa = a.yAxis,
              G = a.xAxis,
              V = a.chart.plotHeight,
              M = !u || 0 === u.length,
              U = m.connectNulls,
              r = a.points || !1,
              I = !1,
              Q = !1,
              z,
              R,
              S,
              l = v ? a.data : u || l,
              u = {
                x: -Number.MAX_VALUE,
                y: 0
              },
              H = {
                x: Number.MIN_VALUE,
                y: 0
              },
              K = 0,
              t,
              L,
              D = -1,
              X = !1,
              Y = !1,
              Z,
              P = "undefined" === typeof k.index,
              W = !1,
              N = !1,
              ba = J[a.type],
              T = !1,
              ca = !0;
          if (!(m.boostData && 0 < m.boostData.length)) {
            a.closestPointRangePx = Number.MAX_VALUE;
            f();
            if (r && 0 < r.length)
              b.skipTranslation = !0, b.drawMode = "triangles", r[0].node && r[0].node.levelDynamic && r.sort(function(a, b) {
                if (a.node) {
                  if (a.node.levelDynamic > b.node.levelDynamic)
                    return 1;
                  if (a.node.levelDynamic < b.node.levelDynamic)
                    return -1;
                }
                return 0;
              }), p(r, function(b) {
                var c = b.plotY,
                    e;
                "undefined" === typeof c || isNaN(c) || null === b.y || (c = b.shapeArgs, e = b.series.pointAttribs(b), b = e["stroke-width"] || 0, R = h.color(e.fill).rgba, R[0] /= 255, R[1] /= 255, R[2] /= 255, "treemap" === a.type && (b = b || 1, S = h.color(e.stroke).rgba, S[0] /= 255, S[1] /= 255, S[2] /= 255, F(c.x, c.y, c.width, c.height, S), b /= 2), "heatmap" === a.type && k.inverted && (c.x = G.len - c.x, c.y = aa.len - c.y, c.width = -c.width, c.height = -c.height), F(c.x + b, c.y + b, c.width - 2 * b, c.height - 2 * b, R));
              });
            else {
              for (; D < l.length - 1; ) {
                z = l[++D];
                if (P)
                  break;
                M ? (r = z[0], t = z[1], l[D + 1] && (Y = l[D + 1][0]), l[D - 1] && (X = l[D - 1][0]), 3 <= z.length && (L = z[2], z[2] > b.zMax && (b.zMax = z[2]), z[2] < b.zMin && (b.zMin = z[2]))) : (r = z, t = A[D], l[D + 1] && (Y = l[D + 1]), l[D - 1] && (X = l[D - 1]), B && B.length && (L = B[D], B[D] > b.zMax && (b.zMax = B[D]), B[D] < b.zMin && (b.zMin = B[D])));
                if (U || null !== r && null !== t) {
                  if (Y && Y >= x && Y <= n && (W = !0), X && X >= x && X <= n && (N = !0), g ? (M && (t = z.slice(1, 3)), Z = t[0], t = t[1]) : v && (r = z.x, t = z.stackY, Z = t - z.y), null !== y && "undefined" !== typeof y && null !== w && "undefined" !== typeof w && (ca = t >= y && t <= w), r > n && H.x < n && (H.x = r, H.y = t), r < x && u.x < x && (u.x = r, u.y = t), null !== t || !U)
                    if (null !== t && ca) {
                      if (r >= x && r <= n && (T = !0), T || W || N) {
                        q.useGPUTranslations || (b.skipTranslation = !0, r = G.toPixels(r, !0), t = aa.toPixels(t, !0), t > V && (t = V));
                        if (ba) {
                          z = Z;
                          if (!1 === Z || "undefined" === typeof Z)
                            z = 0 > t ? t : 0;
                          q.useGPUTranslations || (z = aa.toPixels(z, !0));
                          c(r, z, 0, 0, !1);
                        }
                        b.hasMarkers && !1 !== I && (a.closestPointRangePx = Math.min(a.closestPointRangePx, Math.abs(r - I)));
                        !q.useGPUTranslations && !q.usePreallocated && I && 1 > r - I && Q && 1 > Math.abs(t - Q) ? q.debug.showSkipSummary && ++K : (m.step && c(r, Q, 0, 2, !1), c(r, t, 0, "bubble" === a.type ? L || 1 : 2, !1), I = r, Q = t);
                      }
                    } else
                      f();
                } else
                  f();
              }
              q.debug.showSkipSummary && console.log("skipped points:", K);
              !I && !1 !== U && u > -Number.MAX_VALUE && H < Number.MAX_VALUE && (O(u), O(H));
            }
            d();
          }
        }
        function b() {
          w = [];
          U.data = E = [];
          V = [];
          C && C.destroy();
        }
        function k(a) {
          g && (g.setUniform("xAxisTrans", a.transA), g.setUniform("xAxisMin", a.min), g.setUniform("xAxisMinPad", a.minPixelPadding), g.setUniform("xAxisPointRange", a.pointRange), g.setUniform("xAxisLen", a.len), g.setUniform("xAxisPos", a.pos), g.setUniform("xAxisCVSCoord", !a.horiz));
        }
        function v(a) {
          g && (g.setUniform("yAxisTrans", a.transA), g.setUniform("yAxisMin", a.min), g.setUniform("yAxisMinPad", a.minPixelPadding), g.setUniform("yAxisPointRange", a.pointRange), g.setUniform("yAxisLen", a.len), g.setUniform("yAxisPos", a.pos), g.setUniform("yAxisCVSCoord", !a.horiz));
        }
        function m(a, b) {
          g.setUniform("hasThreshold", a);
          g.setUniform("translatedThreshold", b);
        }
        function y(c) {
          if (c)
            x = c.chartWidth || 800, l = c.chartHeight || 400;
          else
            return !1;
          if (!e || !x || !l)
            return !1;
          q.debug.timeRendering && console.time("gl rendering");
          e.canvas.width = x;
          e.canvas.height = l;
          g.bind();
          e.viewport(0, 0, x, l);
          g.setPMatrix([2 / x, 0, 0, 0, 0, -(2 / l), 0, 0, 0, 0, -2, 0, -1, 1, -1, 1]);
          g.setPlotHeight(c.plotHeight);
          1 < q.lineWidth && !h.isMS && e.lineWidth(q.lineWidth);
          C.build(U.data, "aVertexPosition", 4);
          C.bind();
          A && (e.bindTexture(e.TEXTURE_2D, B), g.setTexture(B));
          g.setInverted(c.inverted);
          p(w, function(a, b) {
            var c = a.series.options,
                d;
            d = "undefined" !== typeof c.lineWidth ? c.lineWidth : 1;
            var f = c.threshold,
                F = K(f),
                l = a.series.yAxis.getThreshold(f),
                f = G(c.marker ? c.marker.enabled : null, a.series.xAxis.isRadial ? !0 : null, a.series.closestPointRangePx > 2 * ((c.marker ? c.marker.radius : 10) || 10)),
                n = a.series.pointAttribs && a.series.pointAttribs().fill || a.series.color;
            a.series.fillOpacity && c.fillOpacity && (n = (new T(n)).setOpacity(G(c.fillOpacity, 1)).get());
            c.colorByPoint && (n = a.series.chart.options.colors[b]);
            n = h.color(n).rgba;
            q.useAlpha || (n[3] = 1);
            "lines" === a.drawMode && q.useAlpha && 1 > n[3] && (n[3] /= 10);
            "add" === c.boostBlending ? (e.blendFunc(e.SRC_ALPHA, e.ONE), e.blendEquation(e.FUNC_ADD)) : "mult" === c.boostBlending ? e.blendFunc(e.DST_COLOR, e.ZERO) : "darken" === c.boostBlending ? (e.blendFunc(e.ONE, e.ONE), e.blendEquation(e.FUNC_MIN)) : e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
            g.reset();
            0 < a.colorData.length && (g.setUniform("hasColor", 1), b = ba(e, g), b.build(a.colorData, "aColor", 4), b.bind());
            g.setColor(n);
            k(a.series.xAxis);
            v(a.series.yAxis);
            m(F, l);
            "points" === a.drawMode && (c.marker && c.marker.radius ? g.setPointSize(2 * c.marker.radius) : g.setPointSize(1));
            g.setSkipTranslation(a.skipTranslation);
            "bubble" === a.series.type && g.setBubbleUniforms(a.series, a.zMin, a.zMax);
            g.setDrawAsCircle(H[a.series.type] && A || !1);
            if (0 < d || "line_strip" !== a.drawMode)
              for (d = 0; d < a.segments.length; d++)
                C.render(a.segments[d].from, a.segments[d].to, a.drawMode);
            if (a.hasMarkers && f)
              for (c.marker && c.marker.radius ? g.setPointSize(2 * c.marker.radius) : g.setPointSize(10), g.setDrawAsCircle(!0), d = 0; d < a.segments.length; d++)
                C.render(a.segments[d].from, a.segments[d].to, "POINTS");
          });
          q.debug.timeRendering && console.timeEnd("gl rendering");
          a && a();
          b();
        }
        function n(a) {
          c();
          if (a.renderer.forExport)
            return y(a);
          I ? y(a) : setTimeout(function() {
            n(a);
          }, 1);
        }
        var g = !1,
            C = !1,
            e = !1,
            x = 0,
            l = 0,
            E = !1,
            V = !1,
            A = !1,
            U = {},
            I = !1,
            w = [],
            M = L.createElement("canvas"),
            u = M.getContext("2d"),
            B,
            J = {
              column: !0,
              columnrange: !0,
              bar: !0,
              area: !0,
              arearange: !0
            },
            H = {
              scatter: !0,
              bubble: !0
            },
            q = {
              pointSize: 1,
              lineWidth: 1,
              fillColor: "#AA00AA",
              useAlpha: !0,
              usePreallocated: !1,
              useGPUTranslations: !1,
              debug: {
                timeRendering: !1,
                timeSeriesProcessing: !1,
                timeSetup: !1,
                timeBufferCopy: !1,
                timeKDTree: !1,
                showSkipSummary: !1
              }
            };
        return U = {
          allocateBufferForSingleSeries: function(a) {
            var b = 0;
            q.usePreallocated && (a.isSeriesBoosting && (b = d(a)), C.allocate(b));
          },
          pushSeries: function(a) {
            0 < w.length && w[w.length - 1].hasMarkers && (w[w.length - 1].markerTo = V.length);
            q.debug.timeSeriesProcessing && console.time("building " + a.type + " series");
            w.push({
              segments: [],
              markerFrom: V.length,
              colorData: [],
              series: a,
              zMin: Number.MAX_VALUE,
              zMax: -Number.MAX_VALUE,
              hasMarkers: a.options.marker ? !1 !== a.options.marker.enabled : !1,
              showMarksers: !0,
              drawMode: {
                area: "lines",
                arearange: "lines",
                areaspline: "line_strip",
                column: "lines",
                columnrange: "lines",
                bar: "lines",
                line: "line_strip",
                scatter: "points",
                heatmap: "triangles",
                treemap: "triangles",
                bubble: "points"
              }[a.type] || "line_strip"
            });
            f(a, w[w.length - 1]);
            q.debug.timeSeriesProcessing && console.timeEnd("building " + a.type + " series");
          },
          setSize: function(a, b) {
            if (x !== a || b !== b)
              x = a, l = b, g.bind(), g.setPMatrix([2 / x, 0, 0, 0, 0, -(2 / l), 0, 0, 0, 0, -2, 0, -1, 1, -1, 1]);
          },
          inited: function() {
            return I;
          },
          setThreshold: m,
          init: function(a, c) {
            var d = 0,
                f = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];
            I = !1;
            if (!a)
              return !1;
            for (q.debug.timeSetup && console.time("gl setup"); d < f.length && !(e = a.getContext(f[d], {})); d++)
              ;
            if (e)
              c || b();
            else
              return !1;
            e.enable(e.BLEND);
            e.blendFunc(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA);
            e.disable(e.DEPTH_TEST);
            e.depthFunc(e.LESS);
            g = ka(e);
            C = ba(e, g);
            A = !1;
            B = e.createTexture();
            M.width = 512;
            M.height = 512;
            u.mozImageSmoothingEnabled = !1;
            u.webkitImageSmoothingEnabled = !1;
            u.msImageSmoothingEnabled = !1;
            u.imageSmoothingEnabled = !1;
            u.strokeStyle = "rgba(255, 255, 255, 0)";
            u.fillStyle = "#FFF";
            u.beginPath();
            u.arc(256, 256, 256, 0, 2 * Math.PI);
            u.stroke();
            u.fill();
            try {
              e.bindTexture(e.TEXTURE_2D, B), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, M), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.bindTexture(e.TEXTURE_2D, null), A = !0;
            } catch (sa) {}
            I = !0;
            q.debug.timeSetup && console.timeEnd("gl setup");
            return !0;
          },
          render: n,
          settings: q,
          valid: function() {
            return !1 !== e;
          },
          clear: c,
          flush: b,
          setXAxis: k,
          setYAxis: v,
          data: E,
          gl: function() {
            return e;
          },
          allocateBuffer: function(a) {
            var b = 0;
            q.usePreallocated && (p(a.series, function(a) {
              a.isSeriesBoosting && (b += d(a));
            }), C.allocate(b));
          },
          destroy: function() {
            b();
            C.destroy();
            g.destroy();
            e && (B && e.deleteTexture(B), e.canvas.width = 1, e.canvas.height = 1);
          },
          setOptions: function(a) {
            ma(!0, q, a);
          }
        };
      }
      function da(a, d) {
        var c = a.chartWidth,
            f = a.chartHeight,
            b = a,
            k = a.seriesGroup || d.group,
            l = L.implementation.hasFeature("www.http://w3.org/TR/SVG11/feature#Extensibility", "1.1"),
            b = a.isChartSeriesBoosting() ? a : d,
            l = !1;
        b.renderTarget || (b.canvas = na, a.renderer.forExport || !l ? (b.renderTarget = a.renderer.image("", 0, 0, c, f).addClass("highcharts-boost-canvas").add(k), b.boostClear = function() {
          b.renderTarget.attr({href: ""});
        }, b.boostCopy = function() {
          b.boostResizeTarget();
          b.renderTarget.attr({href: b.canvas.toDataURL("image/png")});
        }) : (b.renderTargetFo = a.renderer.createElement("foreignObject").add(k), b.renderTarget = L.createElement("canvas"), b.renderTargetCtx = b.renderTarget.getContext("2d"), b.renderTargetFo.element.appendChild(b.renderTarget), b.boostClear = function() {
          b.renderTarget.width = b.canvas.width;
          b.renderTarget.height = b.canvas.height;
        }, b.boostCopy = function() {
          b.renderTarget.width = b.canvas.width;
          b.renderTarget.height = b.canvas.height;
          b.renderTargetCtx.drawImage(b.canvas, 0, 0);
        }), b.boostResizeTarget = function() {
          c = a.chartWidth;
          f = a.chartHeight;
          (b.renderTargetFo || b.renderTarget).attr({
            x: 0,
            y: 0,
            width: c,
            height: f
          }).css({
            pointerEvents: "none",
            mixedBlendMode: "normal",
            opacity: 1
          });
          b instanceof h.Chart && b.markerGroup.translate(a.plotLeft, a.plotTop);
        }, b.boostClipRect = a.renderer.clipRect(), (b.renderTargetFo || b.renderTarget).clip(b.boostClipRect), b instanceof h.Chart && (b.markerGroup = b.renderer.g().add(k), b.markerGroup.translate(d.xAxis.pos, d.yAxis.pos)));
        b.canvas.width = c;
        b.canvas.height = f;
        b.boostClipRect.attr(a.getBoostClipRect(b));
        b.boostResizeTarget();
        b.boostClear();
        b.ogl || (b.ogl = la(function() {
          b.ogl.settings.debug.timeBufferCopy && console.time("buffer copy");
          b.boostCopy();
          b.ogl.settings.debug.timeBufferCopy && console.timeEnd("buffer copy");
        }), b.ogl.init(b.canvas), b.ogl.setOptions(a.options.boost || {}), b instanceof h.Chart && b.ogl.allocateBuffer(a));
        b.ogl.setSize(c, f);
        return b.ogl;
      }
      function ea(a, d, c) {
        a && d.renderTarget && d.canvas && !(c || d.chart).isChartSeriesBoosting() && a.render(c || d.chart);
      }
      function fa(a, d) {
        a && d.renderTarget && d.canvas && !d.chart.isChartSeriesBoosting() && a.allocateBufferForSingleSeries(d);
      }
      function oa(a) {
        var d = !0;
        this.chart.options && this.chart.options.boost && (d = "undefined" === typeof this.chart.options.boost.enabled ? !0 : this.chart.options.boost.enabled);
        if (!d || !this.isSeriesBoosting)
          return a.call(this);
        this.chart.isBoosting = !0;
        if (a = da(this.chart, this))
          fa(a, this), a.pushSeries(this);
        ea(a, this);
      }
      var H = h.win,
          L = H.document,
          pa = function() {},
          ga = h.Chart,
          T = h.Color,
          v = h.Series,
          y = h.seriesTypes,
          p = h.each,
          ha = h.extend,
          ia = h.addEvent,
          qa = h.fireEvent,
          ra = h.grep,
          K = h.isNumber,
          ma = h.merge,
          G = h.pick,
          l = h.wrap,
          P = h.getOptions().plotOptions,
          na = L.createElement("canvas"),
          W,
          ja = "area arearange column columnrange bar line scatter heatmap bubble treemap".split(" "),
          J = {};
      p(ja, function(a) {
        J[a] = 1;
      });
      T.prototype.names = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dodgerblue: "#1e90ff",
        feldspar: "#d19275",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgrey: "#d3d3d3",
        lightgreen: "#90ee90",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslateblue: "#8470ff",
        lightslategray: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370d8",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#d87093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        violetred: "#d02090",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
      };
      ga.prototype.isChartSeriesBoosting = function() {
        return G(this.options.boost && this.options.boost.seriesThreshold, 50) <= this.series.length || N(this);
      };
      ga.prototype.getBoostClipRect = function(a) {
        var d = {
          x: this.plotLeft,
          y: this.plotTop,
          width: this.plotWidth,
          height: this.plotHeight
        };
        a === this && p(this.yAxis, function(a) {
          d.y = Math.min(a.pos, d.y);
          d.height = Math.max(a.pos - this.plotTop + a.len, d.height);
        }, this);
        return d;
      };
      h.eachAsync = function(a, d, c, f, b, k) {
        b = b || 0;
        f = f || 3E4;
        for (var l = b + f,
            m = !0; m && b < l && b < a.length; )
          m = d(a[b], b), ++b;
        m && (b < a.length ? k ? h.eachAsync(a, d, c, f, b, k) : H.requestAnimationFrame ? H.requestAnimationFrame(function() {
          h.eachAsync(a, d, c, f, b);
        }) : setTimeout(function() {
          h.eachAsync(a, d, c, f, b);
        }) : c && c());
      };
      v.prototype.getPoint = function(a) {
        var d = a,
            c = this.xData || this.options.xData || this.processedXData || !1;
        !a || a instanceof this.pointClass || (d = (new this.pointClass).init(this, this.options.data[a.i], c ? c[a.i] : void 0), d.category = d.x, d.dist = a.dist, d.distX = a.distX, d.plotX = a.plotX, d.plotY = a.plotY, d.index = a.i);
        return d;
      };
      l(v.prototype, "searchPoint", function(a) {
        return this.getPoint(a.apply(this, [].slice.call(arguments, 1)));
      });
      l(v.prototype, "destroy", function(a) {
        var d = this,
            c = d.chart;
        c.markerGroup === d.markerGroup && (d.markerGroup = null);
        c.hoverPoints && (c.hoverPoints = ra(c.hoverPoints, function(a) {
          return a.series === d;
        }));
        c.hoverPoint && c.hoverPoint.series === d && (c.hoverPoint = null);
        a.call(this);
      });
      l(v.prototype, "getExtremes", function(a) {
        if (!this.isSeriesBoosting || !this.hasExtremes || !this.hasExtremes())
          return a.apply(this, Array.prototype.slice.call(arguments, 1));
      });
      p(ja, function(a) {
        P[a] && (P[a].boostThreshold = 5E3, P[a].boostData = [], y[a].prototype.fillOpacity = !0);
      });
      p(["translate", "generatePoints", "drawTracker", "drawPoints", "render"], function(a) {
        function d(c) {
          var d = this.options.stacking && ("translate" === a || "generatePoints" === a),
              b = G(this.chart && this.chart.options && this.chart.options.boost && this.chart.options.boost.enabled, !0);
          if (!this.isSeriesBoosting || d || !b || "heatmap" === this.type || "treemap" === this.type || !J[this.type])
            c.call(this);
          else if (this[a + "Canvas"])
            this[a + "Canvas"]();
        }
        l(v.prototype, a, d);
        "translate" === a && p("column bar arearange columnrange heatmap treemap".split(" "), function(c) {
          y[c] && l(y[c].prototype, a, d);
        });
      });
      l(v.prototype, "processData", function(a) {
        function d(a) {
          return c.chart.isChartSeriesBoosting() || (a ? a.length : 0) >= (c.options.boostThreshold || Number.MAX_VALUE);
        }
        var c = this,
            f = this.options.data;
        J[this.type] ? (d(f) && "heatmap" !== this.type && "treemap" !== this.type && !this.options.stacking && this.hasExtremes && this.hasExtremes(!0) || (a.apply(this, Array.prototype.slice.call(arguments, 1)), f = this.processedXData), (this.isSeriesBoosting = d(f)) ? this.enterBoost() : this.exitBoost && this.exitBoost()) : a.apply(this, Array.prototype.slice.call(arguments, 1));
      });
      l(v.prototype, "setVisible", function(a, d, c) {
        a.call(this, d, c);
        !1 === this.visible && this.canvas && this.renderTarget && (this.ogl && this.ogl.clear(), this.boostClear());
      });
      v.prototype.enterBoost = function() {
        this.alteredByBoost = [];
        p(["allowDG", "directTouch", "stickyTracking"], function(a) {
          this.alteredByBoost.push({
            prop: a,
            val: this[a],
            own: this.hasOwnProperty(a)
          });
        }, this);
        this.directTouch = this.allowDG = !1;
        this.stickyTracking = !0;
        this.animate = null;
        this.labelBySeries && (this.labelBySeries = this.labelBySeries.destroy());
      };
      v.prototype.exitBoost = function() {
        p(this.alteredByBoost || [], function(a) {
          a.own ? this[a.prop] = a.val : delete this[a.prop];
        }, this);
        this.boostClear && this.boostClear();
      };
      v.prototype.hasExtremes = function(a) {
        var d = this.options,
            c = this.xAxis && this.xAxis.options,
            f = this.yAxis && this.yAxis.options;
        return d.data.length > (d.boostThreshold || Number.MAX_VALUE) && K(f.min) && K(f.max) && (!a || K(c.min) && K(c.max));
      };
      v.prototype.destroyGraphics = function() {
        var a = this,
            d = this.points,
            c,
            f;
        if (d)
          for (f = 0; f < d.length; f += 1)
            (c = d[f]) && c.destroyElements && c.destroyElements();
        p(["graph", "area", "tracker"], function(b) {
          a[b] && (a[b] = a[b].destroy());
        });
      };
      h.hasWebGLSupport = function() {
        var a = 0,
            d,
            c = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            f = !1;
        if ("undefined" !== typeof H.WebGLRenderingContext)
          for (d = L.createElement("canvas"); a < c.length; a++)
            try {
              if (f = d.getContext(c[a]), "undefined" !== typeof f && null !== f)
                return !0;
            } catch (b) {}
        return !1;
      };
      h.hasWebGLSupport() ? (h.extend(v.prototype, {renderCanvas: function() {
          function a(a, b) {
            var c,
                d,
                f = !1,
                g = "undefined" === typeof k.index,
                h = !0;
            if (!g && (K ? (c = a[0], d = a[1]) : (c = a, d = n[b]), M ? (K && (d = a.slice(1, 3)), f = d[0], d = d[1]) : u && (c = a.x, d = a.stackY, f = d - a.y), L || (h = d >= x && d <= y), null !== d && c >= v && c <= e && h))
              if (a = Math.ceil(l.toPixels(c, !0)), H) {
                if (void 0 === O || a === A) {
                  M || (f = d);
                  if (void 0 === J || d > F)
                    F = d, J = b;
                  if (void 0 === O || f < q)
                    q = f, O = b;
                }
                a !== A && (void 0 !== O && (d = m.toPixels(F, !0), w = m.toPixels(q, !0), P(a, d, J), w !== d && P(a, w, O)), O = J = void 0, A = a);
              } else
                d = Math.ceil(m.toPixels(d, !0)), P(a, d, b);
            return !g;
          }
          function d() {
            qa(c, "renderedCanvas");
            delete c.buildKDTree;
            c.buildKDTree();
            N.debug.timeKDTree && console.timeEnd("kd tree building");
          }
          var c = this,
              f = c.options || {},
              b = !1,
              k = c.chart,
              l = this.xAxis,
              m = this.yAxis,
              p = f.xData || c.processedXData,
              n = f.yData || c.processedYData,
              g = f.data,
              b = l.getExtremes(),
              v = b.min,
              e = b.max,
              b = m.getExtremes(),
              x = b.min,
              y = b.max,
              E = {},
              A,
              H = !!c.sampling,
              G,
              I = !1 !== f.enableMouseTracking,
              w = m.getThreshold(f.threshold),
              M = c.pointArrayMap && "low,high" === c.pointArrayMap.join(","),
              u = !!f.stacking,
              B = c.cropStart || 0,
              L = c.requireSorting,
              K = !p,
              q,
              F,
              O,
              J,
              N,
              T = this.xData || this.options.xData || this.processedXData || !1,
              P = function(a, b, c) {
                W = a + "," + b;
                I && !E[W] && (E[W] = !0, k.inverted && (a = l.len - a, b = m.len - b), G.push({
                  x: T ? T[B + c] : !1,
                  clientX: a,
                  plotX: a,
                  plotY: b,
                  i: B + c
                }));
              },
              b = da(k, c);
          k.isBoosting = !0;
          N = b.settings;
          if (this.visible) {
            if (this.points || this.graph)
              this.animate = null, this.destroyGraphics();
            k.isChartSeriesBoosting() ? (this.markerGroup = k.markerGroup, this.renderTarget && (this.renderTarget = this.renderTarget.destroy())) : this.markerGroup = c.plotGroup("markerGroup", "markers", !0, 1, k.seriesGroup);
            G = this.points = [];
            c.buildKDTree = pa;
            b && (fa(b, this), b.pushSeries(c), ea(b, this, k));
            k.renderer.forExport || (N.debug.timeKDTree && console.time("kd tree building"), h.eachAsync(u ? c.data : p || g, a, d));
          }
        }}), p(["heatmap", "treemap"], function(a) {
        y[a] && l(y[a].prototype, "drawPoints", oa);
      }), y.bubble && (delete y.bubble.prototype.buildKDTree, l(y.bubble.prototype, "markerAttribs", function(a) {
        return this.isSeriesBoosting ? !1 : a.apply(this, [].slice.call(arguments, 1));
      })), y.scatter.prototype.fill = !0, ha(y.area.prototype, {
        fill: !0,
        fillOpacity: !0,
        sampling: !0
      }), ha(y.column.prototype, {
        fill: !0,
        sampling: !0
      }), h.Chart.prototype.callbacks.push(function(a) {
        ia(a, "predraw", function() {
          a.boostForceChartBoost = void 0;
          a.boostForceChartBoost = N(a);
          a.isBoosting = !1;
          !a.isChartSeriesBoosting() && a.didBoost && (a.didBoost = !1);
          a.boostClear && a.boostClear();
          a.canvas && a.ogl && a.isChartSeriesBoosting() && (a.didBoost = !0, a.ogl.allocateBuffer(a));
          a.markerGroup && a.xAxis && 0 < a.xAxis.length && a.yAxis && 0 < a.yAxis.length && a.markerGroup.translate(a.xAxis[0].pos, a.yAxis[0].pos);
        });
        ia(a, "render", function() {
          a.ogl && a.isChartSeriesBoosting() && a.ogl.render(a);
        });
      })) : "undefined" !== typeof h.initCanvasBoost ? h.initCanvasBoost() : h.error(26);
    })(A);
  });
})(require('process'));
