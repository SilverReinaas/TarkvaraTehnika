/* */ 
(function(process) {
  (function(w) {
    "object" === typeof module && module.exports ? module.exports = w : w(Highcharts);
  })(function(w) {
    (function(b) {
      var q = b.deg2rad,
          v = b.isNumber,
          r = b.pick,
          k = b.relativeLength;
      b.CenteredSeriesMixin = {
        getCenter: function() {
          var b = this.options,
              m = this.chart,
              n = 2 * (b.slicedOffset || 0),
              a = m.plotWidth - 2 * n,
              m = m.plotHeight - 2 * n,
              c = b.center,
              c = [r(c[0], "50%"), r(c[1], "50%"), b.size || "100%", b.innerSize || 0],
              l = Math.min(a, m),
              g,
              d;
          for (g = 0; 4 > g; ++g)
            d = c[g], b = 2 > g || 2 === g && /%$/.test(d), c[g] = k(d, [a, m, l, c[2]][g]) + (b ? n : 0);
          c[3] > c[2] && (c[3] = c[2]);
          return c;
        },
        getStartAndEndRadians: function(b, m) {
          b = v(b) ? b : 0;
          m = v(m) && m > b && 360 > m - b ? m : b + 360;
          return {
            start: q * (b + -90),
            end: q * (m + -90)
          };
        }
      };
    })(w);
    (function(b) {
      function q(b, a) {
        this.init(b, a);
      }
      var v = b.CenteredSeriesMixin,
          r = b.each,
          k = b.extend,
          f = b.merge,
          m = b.splat;
      k(q.prototype, {
        coll: "pane",
        init: function(b, a) {
          this.chart = a;
          this.background = [];
          a.pane.push(this);
          this.setOptions(b);
        },
        setOptions: function(b) {
          this.options = f(this.defaultOptions, this.chart.angular ? {background: {}} : void 0, b);
        },
        render: function() {
          var b = this.options,
              a = this.options.background,
              c = this.chart.renderer;
          this.group || (this.group = c.g("pane-group").attr({zIndex: b.zIndex || 0}).add());
          this.updateCenter();
          if (a)
            for (a = m(a), b = Math.max(a.length, this.background.length || 0), c = 0; c < b; c++)
              a[c] && this.axis ? this.renderBackground(f(this.defaultBackgroundOptions, a[c]), c) : this.background[c] && (this.background[c] = this.background[c].destroy(), this.background.splice(c, 1));
        },
        renderBackground: function(b, a) {
          var c = "animate";
          this.background[a] || (this.background[a] = this.chart.renderer.path().add(this.group), c = "attr");
          this.background[a][c]({d: this.axis.getPlotBandPath(b.from, b.to, b)}).attr({"class": "highcharts-pane " + (b.className || "")});
        },
        defaultOptions: {
          center: ["50%", "50%"],
          size: "85%",
          startAngle: 0
        },
        defaultBackgroundOptions: {
          shape: "circle",
          from: -Number.MAX_VALUE,
          innerRadius: 0,
          to: Number.MAX_VALUE,
          outerRadius: "105%"
        },
        updateCenter: function(b) {
          this.center = (b || this.axis || {}).center = v.getCenter.call(this);
        },
        update: function(b, a) {
          f(!0, this.options, b);
          this.setOptions(this.options);
          this.render();
          r(this.chart.axes, function(c) {
            c.pane === this && (c.pane = null, c.update({}, a));
          }, this);
        }
      });
      b.Pane = q;
    })(w);
    (function(b) {
      var q = b.each,
          v = b.extend,
          r = b.map,
          k = b.merge,
          f = b.noop,
          m = b.pick,
          n = b.pInt,
          a = b.wrap,
          c,
          l,
          g = b.Axis.prototype,
          d = b.Tick.prototype;
      b.radialAxisExtended || (b.radialAxisExtended = !0, c = {
        getOffset: f,
        redraw: function() {
          this.isDirty = !1;
        },
        render: function() {
          this.isDirty = !1;
        },
        setScale: f,
        setCategories: f,
        setTitle: f
      }, l = {
        defaultRadialGaugeOptions: {
          labels: {
            align: "center",
            x: 0,
            y: null
          },
          minorGridLineWidth: 0,
          minorTickInterval: "auto",
          minorTickLength: 10,
          minorTickPosition: "inside",
          minorTickWidth: 1,
          tickLength: 10,
          tickPosition: "inside",
          tickWidth: 2,
          title: {rotation: 0},
          zIndex: 2
        },
        defaultRadialXOptions: {
          gridLineWidth: 1,
          labels: {
            align: null,
            distance: 15,
            x: 0,
            y: null,
            style: {textOverflow: "none"}
          },
          maxPadding: 0,
          minPadding: 0,
          showLastLabel: !1,
          tickLength: 0
        },
        defaultRadialYOptions: {
          gridLineInterpolation: "circle",
          labels: {
            align: "right",
            x: -3,
            y: -2
          },
          showLastLabel: !1,
          title: {
            x: 4,
            text: null,
            rotation: 90
          }
        },
        setOptions: function(a) {
          a = this.options = k(this.defaultOptions, this.defaultRadialOptions, a);
          a.plotBands || (a.plotBands = []);
        },
        getOffset: function() {
          g.getOffset.call(this);
          this.chart.axisOffset[this.side] = 0;
        },
        getLinePath: function(a, c) {
          a = this.center;
          var e = this.chart,
              d = m(c, a[2] / 2 - this.offset);
          this.isCircular || void 0 !== c ? (c = this.chart.renderer.symbols.arc(this.left + a[0], this.top + a[1], d, d, {
            start: this.startAngleRad,
            end: this.endAngleRad,
            open: !0,
            innerR: 0
          }), c.xBounds = [this.left + a[0]], c.yBounds = [this.top + a[1] - d]) : (c = this.postTranslate(this.angleRad, d), c = ["M", a[0] + e.plotLeft, a[1] + e.plotTop, "L", c.x, c.y]);
          return c;
        },
        setAxisTranslation: function() {
          g.setAxisTranslation.call(this);
          this.center && (this.transA = this.isCircular ? (this.endAngleRad - this.startAngleRad) / (this.max - this.min || 1) : this.center[2] / 2 / (this.max - this.min || 1), this.minPixelPadding = this.isXAxis ? this.transA * this.minPointOffset : 0);
        },
        beforeSetTickPositions: function() {
          if (this.autoConnect = this.isCircular && void 0 === m(this.userMax, this.options.max) && this.endAngleRad - this.startAngleRad === 2 * Math.PI)
            this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0;
        },
        setAxisSize: function() {
          g.setAxisSize.call(this);
          this.isRadial && (this.pane.updateCenter(this), this.isCircular && (this.sector = this.endAngleRad - this.startAngleRad), this.len = this.width = this.height = this.center[2] * m(this.sector, 1) / 2);
        },
        getPosition: function(a, c) {
          return this.postTranslate(this.isCircular ? this.translate(a) : this.angleRad, m(this.isCircular ? c : this.translate(a), this.center[2] / 2) - this.offset);
        },
        postTranslate: function(a, c) {
          var e = this.chart,
              d = this.center;
          a = this.startAngleRad + a;
          return {
            x: e.plotLeft + d[0] + Math.cos(a) * c,
            y: e.plotTop + d[1] + Math.sin(a) * c
          };
        },
        getPlotBandPath: function(a, c, d) {
          var e = this.center,
              b = this.startAngleRad,
              l = e[2] / 2,
              g = [m(d.outerRadius, "100%"), d.innerRadius, m(d.thickness, 10)],
              p = Math.min(this.offset, 0),
              u = /%$/,
              f,
              k = this.isCircular;
          "polygon" === this.options.gridLineInterpolation ? e = this.getPlotLinePath(a).concat(this.getPlotLinePath(c, !0)) : (a = Math.max(a, this.min), c = Math.min(c, this.max), k || (g[0] = this.translate(a), g[1] = this.translate(c)), g = r(g, function(a) {
            u.test(a) && (a = n(a, 10) * l / 100);
            return a;
          }), "circle" !== d.shape && k ? (a = b + this.translate(a), c = b + this.translate(c)) : (a = -Math.PI / 2, c = 1.5 * Math.PI, f = !0), g[0] -= p, g[2] -= p, e = this.chart.renderer.symbols.arc(this.left + e[0], this.top + e[1], g[0], g[0], {
            start: Math.min(a, c),
            end: Math.max(a, c),
            innerR: m(g[1], g[0] - g[2]),
            open: f
          }));
          return e;
        },
        getPlotLinePath: function(a, c) {
          var e = this,
              d = e.center,
              b = e.chart,
              l = e.getPosition(a),
              g,
              u,
              f;
          e.isCircular ? f = ["M", d[0] + b.plotLeft, d[1] + b.plotTop, "L", l.x, l.y] : "circle" === e.options.gridLineInterpolation ? (a = e.translate(a)) && (f = e.getLinePath(0, a)) : (q(b.xAxis, function(a) {
            a.pane === e.pane && (g = a);
          }), f = [], a = e.translate(a), d = g.tickPositions, g.autoConnect && (d = d.concat([d[0]])), c && (d = [].concat(d).reverse()), q(d, function(c, e) {
            u = g.getPosition(c, a);
            f.push(e ? "L" : "M", u.x, u.y);
          }));
          return f;
        },
        getTitlePosition: function() {
          var a = this.center,
              c = this.chart,
              d = this.options.title;
          return {
            x: c.plotLeft + a[0] + (d.x || 0),
            y: c.plotTop + a[1] - {
              high: .5,
              middle: .25,
              low: 0
            }[d.align] * a[2] + (d.y || 0)
          };
        }
      }, a(g, "init", function(a, d, b) {
        var e = d.angular,
            g = d.polar,
            p = b.isX,
            u = e && p,
            f,
            C = d.options,
            n = b.pane || 0,
            q = this.pane = d.pane && d.pane[n],
            n = q && q.options;
        if (e) {
          if (v(this, u ? c : l), f = !p)
            this.defaultRadialOptions = this.defaultRadialGaugeOptions;
        } else
          g && (v(this, l), this.defaultRadialOptions = (f = p) ? this.defaultRadialXOptions : k(this.defaultYAxisOptions, this.defaultRadialYOptions));
        e || g ? (this.isRadial = !0, d.inverted = !1, C.chart.zoomType = null) : this.isRadial = !1;
        q && f && (q.axis = this);
        a.call(this, d, b);
        !u && q && (e || g) && (a = this.options, this.angleRad = (a.angle || 0) * Math.PI / 180, this.startAngleRad = (n.startAngle - 90) * Math.PI / 180, this.endAngleRad = (m(n.endAngle, n.startAngle + 360) - 90) * Math.PI / 180, this.offset = a.offset || 0, this.isCircular = f);
      }), a(g, "autoLabelAlign", function(a) {
        if (!this.isRadial)
          return a.apply(this, [].slice.call(arguments, 1));
      }), a(d, "getPosition", function(a, c, d, b, g) {
        var e = this.axis;
        return e.getPosition ? e.getPosition(d) : a.call(this, c, d, b, g);
      }), a(d, "getLabelPosition", function(a, c, d, b, g, l, f, n, k) {
        var e = this.axis,
            p = l.y,
            u = 20,
            h = l.align,
            t = (e.translate(this.pos) + e.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360;
        e.isRadial ? (a = e.getPosition(this.pos, e.center[2] / 2 + m(l.distance, -25)), "auto" === l.rotation ? b.attr({rotation: t}) : null === p && (p = e.chart.renderer.fontMetrics(b.styles.fontSize).b - b.getBBox().height / 2), null === h && (e.isCircular ? (this.label.getBBox().width > e.len * e.tickInterval / (e.max - e.min) && (u = 0), h = t > u && t < 180 - u ? "left" : t > 180 + u && t < 360 - u ? "right" : "center") : h = "center", b.attr({align: h})), a.x += l.x, a.y += p) : a = a.call(this, c, d, b, g, l, f, n, k);
        return a;
      }), a(d, "getMarkPath", function(a, c, d, b, g, l, f) {
        var e = this.axis;
        e.isRadial ? (a = e.getPosition(this.pos, e.center[2] / 2 + b), c = ["M", c, d, "L", a.x, a.y]) : c = a.call(this, c, d, b, g, l, f);
        return c;
      }));
    })(w);
    (function(b) {
      var q = b.each,
          v = b.pick,
          r = b.defined,
          k = b.seriesType,
          f = b.seriesTypes,
          m = b.Series.prototype,
          n = b.Point.prototype;
      k("arearange", "area", {
        threshold: null,
        tooltip: {pointFormat: '\x3cspan class\x3d"highcharts-color-{series.colorIndex}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e'},
        trackByArea: !0,
        dataLabels: {
          align: null,
          verticalAlign: null,
          xLow: 0,
          xHigh: 0,
          yLow: 0,
          yHigh: 0
        }
      }, {
        pointArrayMap: ["low", "high"],
        dataLabelCollections: ["dataLabel", "dataLabelUpper"],
        toYData: function(a) {
          return [a.low, a.high];
        },
        pointValKey: "low",
        deferTranslatePolar: !0,
        highToXY: function(a) {
          var c = this.chart,
              b = this.xAxis.postTranslate(a.rectPlotX, this.yAxis.len - a.plotHigh);
          a.plotHighX = b.x - c.plotLeft;
          a.plotHigh = b.y - c.plotTop;
          a.plotLowX = a.plotX;
        },
        translate: function() {
          var a = this,
              c = a.yAxis,
              b = !!a.modifyValue;
          f.area.prototype.translate.apply(a);
          q(a.points, function(g) {
            var d = g.low,
                e = g.high,
                l = g.plotY;
            null === e || null === d ? (g.isNull = !0, g.plotY = null) : (g.plotLow = l, g.plotHigh = c.translate(b ? a.modifyValue(e, g) : e, 0, 1, 0, 1), b && (g.yBottom = g.plotHigh));
          });
          this.chart.polar && q(this.points, function(c) {
            a.highToXY(c);
            c.tooltipPos = [(c.plotHighX + c.plotLowX) / 2, (c.plotHigh + c.plotLow) / 2];
          });
        },
        getGraphPath: function(a) {
          var c = [],
              b = [],
              g,
              d = f.area.prototype.getGraphPath,
              e,
              u,
              p;
          p = this.options;
          var h = this.chart.polar && !1 !== p.connectEnds,
              x = p.connectNulls,
              t = p.step;
          a = a || this.points;
          for (g = a.length; g--; )
            e = a[g], e.isNull || h || x || a[g + 1] && !a[g + 1].isNull || b.push({
              plotX: e.plotX,
              plotY: e.plotY,
              doCurve: !1
            }), u = {
              polarPlotY: e.polarPlotY,
              rectPlotX: e.rectPlotX,
              yBottom: e.yBottom,
              plotX: v(e.plotHighX, e.plotX),
              plotY: e.plotHigh,
              isNull: e.isNull
            }, b.push(u), c.push(u), e.isNull || h || x || a[g - 1] && !a[g - 1].isNull || b.push({
              plotX: e.plotX,
              plotY: e.plotY,
              doCurve: !1
            });
          a = d.call(this, a);
          t && (!0 === t && (t = "left"), p.step = {
            left: "right",
            center: "center",
            right: "left"
          }[t]);
          c = d.call(this, c);
          b = d.call(this, b);
          p.step = t;
          p = [].concat(a, c);
          this.chart.polar || "M" !== b[0] || (b[0] = "L");
          this.graphPath = p;
          this.areaPath = a.concat(b);
          p.isArea = !0;
          p.xMap = a.xMap;
          this.areaPath.xMap = a.xMap;
          return p;
        },
        drawDataLabels: function() {
          var a = this.data,
              c = a.length,
              b,
              g = [],
              d = this.options.dataLabels,
              e = d.align,
              u = d.verticalAlign,
              p = d.inside,
              h,
              f,
              t = this.chart.inverted;
          if (d.enabled || this._hasPointLabels) {
            for (b = c; b--; )
              if (h = a[b])
                f = p ? h.plotHigh < h.plotLow : h.plotHigh > h.plotLow, h.y = h.high, h._plotY = h.plotY, h.plotY = h.plotHigh, g[b] = h.dataLabel, h.dataLabel = h.dataLabelUpper, h.below = f, t ? e || (d.align = f ? "right" : "left") : u || (d.verticalAlign = f ? "top" : "bottom"), d.x = d.xHigh, d.y = d.yHigh;
            m.drawDataLabels && m.drawDataLabels.apply(this, arguments);
            for (b = c; b--; )
              if (h = a[b])
                f = p ? h.plotHigh < h.plotLow : h.plotHigh > h.plotLow, h.dataLabelUpper = h.dataLabel, h.dataLabel = g[b], h.y = h.low, h.plotY = h._plotY, h.below = !f, t ? e || (d.align = f ? "left" : "right") : u || (d.verticalAlign = f ? "bottom" : "top"), d.x = d.xLow, d.y = d.yLow;
            m.drawDataLabels && m.drawDataLabels.apply(this, arguments);
          }
          d.align = e;
          d.verticalAlign = u;
        },
        alignDataLabel: function() {
          f.column.prototype.alignDataLabel.apply(this, arguments);
        },
        drawPoints: function() {
          var a = this.points.length,
              c,
              b;
          m.drawPoints.apply(this, arguments);
          for (b = 0; b < a; )
            c = this.points[b], c.lowerGraphic = c.graphic, c.graphic = c.upperGraphic, c._plotY = c.plotY, c._plotX = c.plotX, c.plotY = c.plotHigh, r(c.plotHighX) && (c.plotX = c.plotHighX), c._isInside = c.isInside, this.chart.polar || (c.isInside = c.isTopInside = void 0 !== c.plotY && 0 <= c.plotY && c.plotY <= this.yAxis.len && 0 <= c.plotX && c.plotX <= this.xAxis.len), b++;
          m.drawPoints.apply(this, arguments);
          for (b = 0; b < a; )
            c = this.points[b], c.upperGraphic = c.graphic, c.graphic = c.lowerGraphic, c.isInside = c._isInside, c.plotY = c._plotY, c.plotX = c._plotX, b++;
        },
        setStackedPoints: b.noop
      }, {
        setState: function() {
          var a = this.state,
              c = this.series,
              b = c.chart.polar;
          r(this.plotHigh) || (this.plotHigh = c.yAxis.toPixels(this.high, !0));
          r(this.plotLow) || (this.plotLow = this.plotY = c.yAxis.toPixels(this.low, !0));
          c.stateMarkerGraphic && (c.lowerStateMarkerGraphic = c.stateMarkerGraphic, c.stateMarkerGraphic = c.upperStateMarkerGraphic);
          this.graphic = this.upperGraphic;
          this.plotY = this.plotHigh;
          b && (this.plotX = this.plotHighX);
          n.setState.apply(this, arguments);
          this.state = a;
          this.plotY = this.plotLow;
          this.graphic = this.lowerGraphic;
          b && (this.plotX = this.plotLowX);
          c.stateMarkerGraphic && (c.upperStateMarkerGraphic = c.stateMarkerGraphic, c.stateMarkerGraphic = c.lowerStateMarkerGraphic, c.lowerStateMarkerGraphic = void 0);
          n.setState.apply(this, arguments);
        },
        haloPath: function() {
          var a = this.series.chart.polar,
              c = [];
          this.plotY = this.plotLow;
          a && (this.plotX = this.plotLowX);
          this.isInside && (c = n.haloPath.apply(this, arguments));
          this.plotY = this.plotHigh;
          a && (this.plotX = this.plotHighX);
          this.isTopInside && (c = c.concat(n.haloPath.apply(this, arguments)));
          return c;
        },
        destroyElements: function() {
          q(["lowerGraphic", "upperGraphic"], function(a) {
            this[a] && (this[a] = this[a].destroy());
          }, this);
          this.graphic = null;
          return n.destroyElements.apply(this, arguments);
        }
      });
    })(w);
    (function(b) {
      var q = b.seriesType;
      q("areasplinerange", "arearange", null, {getPointSpline: b.seriesTypes.spline.prototype.getPointSpline});
    })(w);
    (function(b) {
      var q = b.defaultPlotOptions,
          v = b.each,
          r = b.merge,
          k = b.noop,
          f = b.pick,
          m = b.seriesType,
          n = b.seriesTypes.column.prototype;
      m("columnrange", "arearange", r(q.column, q.arearange, {
        pointRange: null,
        marker: null,
        states: {hover: {halo: !1}}
      }), {
        translate: function() {
          var a = this,
              c = a.yAxis,
              b = a.xAxis,
              g = b.startAngleRad,
              d,
              e = a.chart,
              u = a.xAxis.isRadial,
              p = Math.max(e.chartWidth, e.chartHeight) + 999,
              h;
          n.translate.apply(a);
          v(a.points, function(l) {
            var t = l.shapeArgs,
                m = a.options.minPointLength,
                n,
                k;
            l.plotHigh = h = Math.min(Math.max(-p, c.translate(l.high, 0, 1, 0, 1)), p);
            l.plotLow = Math.min(Math.max(-p, l.plotY), p);
            k = h;
            n = f(l.rectPlotY, l.plotY) - h;
            Math.abs(n) < m ? (m -= n, n += m, k -= m / 2) : 0 > n && (n *= -1, k -= n);
            u ? (d = l.barX + g, l.shapeType = "path", l.shapeArgs = {d: a.polarArc(k + n, k, d, d + l.pointWidth)}) : (t.height = n, t.y = k, l.tooltipPos = e.inverted ? [c.len + c.pos - e.plotLeft - k - n / 2, b.len + b.pos - e.plotTop - t.x - t.width / 2, n] : [b.left - e.plotLeft + t.x + t.width / 2, c.pos - e.plotTop + k + n / 2, n]);
          });
        },
        directTouch: !0,
        trackerGroups: ["group", "dataLabelsGroup"],
        drawGraph: k,
        getSymbol: k,
        crispCol: n.crispCol,
        drawPoints: n.drawPoints,
        drawTracker: n.drawTracker,
        getColumnMetrics: n.getColumnMetrics,
        pointAttribs: n.pointAttribs,
        animate: function() {
          return n.animate.apply(this, arguments);
        },
        polarArc: function() {
          return n.polarArc.apply(this, arguments);
        },
        translate3dPoints: function() {
          return n.translate3dPoints.apply(this, arguments);
        },
        translate3dShapes: function() {
          return n.translate3dShapes.apply(this, arguments);
        }
      }, {setState: n.pointClass.prototype.setState});
    })(w);
    (function(b) {
      var q = b.each,
          v = b.isNumber,
          r = b.merge,
          k = b.pick,
          f = b.pInt,
          m = b.Series,
          n = b.seriesType,
          a = b.TrackerMixin;
      n("gauge", "line", {
        dataLabels: {
          enabled: !0,
          defer: !1,
          y: 15,
          borderRadius: 3,
          crop: !1,
          verticalAlign: "top",
          zIndex: 2
        },
        dial: {},
        pivot: {},
        tooltip: {headerFormat: ""},
        showInLegend: !1
      }, {
        angular: !0,
        directTouch: !0,
        drawGraph: b.noop,
        fixedBox: !0,
        forceDL: !0,
        noSharedTooltip: !0,
        trackerGroups: ["group", "dataLabelsGroup"],
        translate: function() {
          var a = this.yAxis,
              b = this.options,
              g = a.center;
          this.generatePoints();
          q(this.points, function(c) {
            var d = r(b.dial, c.dial),
                l = f(k(d.radius, 80)) * g[2] / 200,
                p = f(k(d.baseLength, 70)) * l / 100,
                h = f(k(d.rearLength, 10)) * l / 100,
                n = d.baseWidth || 3,
                t = d.topWidth || 1,
                m = b.overshoot,
                q = a.startAngleRad + a.translate(c.y, null, null, null, !0);
            v(m) ? (m = m / 180 * Math.PI, q = Math.max(a.startAngleRad - m, Math.min(a.endAngleRad + m, q))) : !1 === b.wrap && (q = Math.max(a.startAngleRad, Math.min(a.endAngleRad, q)));
            q = 180 * q / Math.PI;
            c.shapeType = "path";
            c.shapeArgs = {
              d: d.path || ["M", -h, -n / 2, "L", p, -n / 2, l, -t / 2, l, t / 2, p, n / 2, -h, n / 2, "z"],
              translateX: g[0],
              translateY: g[1],
              rotation: q
            };
            c.plotX = g[0];
            c.plotY = g[1];
          });
        },
        drawPoints: function() {
          var a = this,
              b = a.yAxis.center,
              g = a.pivot,
              d = a.options,
              e = d.pivot,
              u = a.chart.renderer;
          q(a.points, function(c) {
            var b = c.graphic,
                e = c.shapeArgs,
                g = e.d;
            r(d.dial, c.dial);
            b ? (b.animate(e), e.d = g) : c.graphic = u[c.shapeType](e).attr({
              rotation: e.rotation,
              zIndex: 1
            }).addClass("highcharts-dial").add(a.group);
          });
          g ? g.animate({
            translateX: b[0],
            translateY: b[1]
          }) : a.pivot = u.circle(0, 0, k(e.radius, 5)).attr({zIndex: 2}).addClass("highcharts-pivot").translate(b[0], b[1]).add(a.group);
        },
        animate: function(a) {
          var c = this;
          a || (q(c.points, function(a) {
            var b = a.graphic;
            b && (b.attr({rotation: 180 * c.yAxis.startAngleRad / Math.PI}), b.animate({rotation: a.shapeArgs.rotation}, c.options.animation));
          }), c.animate = null);
        },
        render: function() {
          this.group = this.plotGroup("group", "series", this.visible ? "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup);
          m.prototype.render.call(this);
          this.group.clip(this.chart.clipRect);
        },
        setData: function(a, b) {
          m.prototype.setData.call(this, a, !1);
          this.processData();
          this.generatePoints();
          k(b, !0) && this.chart.redraw();
        },
        drawTracker: a && a.drawTrackerPoint
      }, {setState: function(a) {
          this.state = a;
        }});
    })(w);
    (function(b) {
      var q = b.each,
          v = b.noop,
          r = b.seriesType,
          k = b.seriesTypes;
      r("boxplot", "column", {
        threshold: null,
        tooltip: {pointFormat: '\x3cspan class\x3d"highcharts-color-{point.colorIndex}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eMaximum: {point.high}\x3cbr/\x3eUpper quartile: {point.q3}\x3cbr/\x3eMedian: {point.median}\x3cbr/\x3eLower quartile: {point.q1}\x3cbr/\x3eMinimum: {point.low}\x3cbr/\x3e'},
        whiskerLength: "50%"
      }, {
        pointArrayMap: ["low", "q1", "median", "q3", "high"],
        toYData: function(b) {
          return [b.low, b.q1, b.median, b.q3, b.high];
        },
        pointValKey: "high",
        drawDataLabels: v,
        translate: function() {
          var b = this.yAxis,
              m = this.pointArrayMap;
          k.column.prototype.translate.apply(this);
          q(this.points, function(f) {
            q(m, function(a) {
              null !== f[a] && (f[a + "Plot"] = b.translate(f[a], 0, 1, 0, 1));
            });
          });
        },
        drawPoints: function() {
          var b = this,
              m = b.chart.renderer,
              n,
              a,
              c,
              l,
              g,
              d,
              e = 0,
              u,
              p,
              h,
              k,
              t = !1 !== b.doQuartiles,
              r,
              v = b.options.whiskerLength;
          q(b.points, function(f) {
            var q = f.graphic,
                x = q ? "animate" : "attr",
                E = f.shapeArgs;
            void 0 !== f.plotY && (u = E.width, p = Math.floor(E.x), h = p + u, k = Math.round(u / 2), n = Math.floor(t ? f.q1Plot : f.lowPlot), a = Math.floor(t ? f.q3Plot : f.lowPlot), c = Math.floor(f.highPlot), l = Math.floor(f.lowPlot), q || (f.graphic = q = m.g("point").add(b.group), f.stem = m.path().addClass("highcharts-boxplot-stem").add(q), v && (f.whiskers = m.path().addClass("highcharts-boxplot-whisker").add(q)), t && (f.box = m.path(void 0).addClass("highcharts-boxplot-box").add(q)), f.medianShape = m.path(void 0).addClass("highcharts-boxplot-median").add(q)), d = f.stem.strokeWidth() % 2 / 2, e = p + k + d, f.stem[x]({d: ["M", e, a, "L", e, c, "M", e, n, "L", e, l]}), t && (d = f.box.strokeWidth() % 2 / 2, n = Math.floor(n) + d, a = Math.floor(a) + d, p += d, h += d, f.box[x]({d: ["M", p, a, "L", p, n, "L", h, n, "L", h, a, "L", p, a, "z"]})), v && (d = f.whiskers.strokeWidth() % 2 / 2, c += d, l += d, r = /%$/.test(v) ? k * parseFloat(v) / 100 : v / 2, f.whiskers[x]({d: ["M", e - r, c, "L", e + r, c, "M", e - r, l, "L", e + r, l]})), g = Math.round(f.medianPlot), d = f.medianShape.strokeWidth() % 2 / 2, g += d, f.medianShape[x]({d: ["M", p, g, "L", h, g]}));
          });
        },
        setStackedPoints: v
      });
    })(w);
    (function(b) {
      var q = b.each,
          v = b.noop,
          r = b.seriesType,
          k = b.seriesTypes;
      r("errorbar", "boxplot", {
        grouping: !1,
        linkedTo: ":previous",
        tooltip: {pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e'},
        whiskerWidth: null
      }, {
        type: "errorbar",
        pointArrayMap: ["low", "high"],
        toYData: function(b) {
          return [b.low, b.high];
        },
        pointValKey: "high",
        doQuartiles: !1,
        drawDataLabels: k.arearange ? function() {
          var b = this.pointValKey;
          k.arearange.prototype.drawDataLabels.call(this);
          q(this.data, function(f) {
            f.y = f[b];
          });
        } : v,
        getColumnMetrics: function() {
          return this.linkedParent && this.linkedParent.columnMetrics || k.column.prototype.getColumnMetrics.call(this);
        }
      });
    })(w);
    (function(b) {
      var q = b.correctFloat,
          v = b.isNumber,
          r = b.pick,
          k = b.Point,
          f = b.Series,
          m = b.seriesType,
          n = b.seriesTypes;
      m("waterfall", "column", {dataLabels: {inside: !0}}, {
        pointValKey: "y",
        translate: function() {
          var a = this.options,
              c = this.yAxis,
              b,
              g,
              d,
              e,
              f,
              p,
              h,
              k,
              t,
              m,
              v = r(a.minPointLength, 5),
              w = v / 2,
              z = a.threshold,
              A = a.stacking,
              y;
          n.column.prototype.translate.apply(this);
          k = t = z;
          g = this.points;
          b = 0;
          for (a = g.length; b < a; b++)
            d = g[b], h = this.processedYData[b], e = d.shapeArgs, f = A && c.stacks[(this.negStacks && h < z ? "-" : "") + this.stackKey], y = this.getStackIndicator(y, d.x, this.index), m = r(f && f[d.x].points[y.key], [0, h]), d.isSum ? d.y = q(h) : d.isIntermediateSum && (d.y = q(h - t)), p = Math.max(k, k + d.y) + m[0], e.y = c.translate(p, 0, 1, 0, 1), d.isSum ? (e.y = c.translate(m[1], 0, 1, 0, 1), e.height = Math.min(c.translate(m[0], 0, 1, 0, 1), c.len) - e.y) : d.isIntermediateSum ? (e.y = c.translate(m[1], 0, 1, 0, 1), e.height = Math.min(c.translate(t, 0, 1, 0, 1), c.len) - e.y, t = m[1]) : (e.height = 0 < h ? c.translate(k, 0, 1, 0, 1) - e.y : c.translate(k, 0, 1, 0, 1) - c.translate(k - h, 0, 1, 0, 1), k += f && f[d.x] ? f[d.x].total : h), 0 > e.height && (e.y += e.height, e.height *= -1), d.plotY = e.y = Math.round(e.y) - this.borderWidth % 2 / 2, e.height = Math.max(Math.round(e.height), .001), d.yBottom = e.y + e.height, e.height <= v && !d.isNull ? (e.height = v, e.y -= w, d.plotY = e.y, d.minPointLengthOffset = 0 > d.y ? -w : w) : d.minPointLengthOffset = 0, e = d.plotY + (d.negative ? e.height : 0), this.chart.inverted ? d.tooltipPos[0] = c.len - e : d.tooltipPos[1] = e;
        },
        processData: function(a) {
          var c = this.yData,
              b = this.options.data,
              g,
              d = c.length,
              e,
              u,
              p,
              h,
              k,
              t;
          u = e = p = h = this.options.threshold || 0;
          for (t = 0; t < d; t++)
            k = c[t], g = b && b[t] ? b[t] : {}, "sum" === k || g.isSum ? c[t] = q(u) : "intermediateSum" === k || g.isIntermediateSum ? c[t] = q(e) : (u += k, e += k), p = Math.min(u, p), h = Math.max(u, h);
          f.prototype.processData.call(this, a);
          this.options.stacking || (this.dataMin = p, this.dataMax = h);
        },
        toYData: function(a) {
          return a.isSum ? 0 === a.x ? null : "sum" : a.isIntermediateSum ? 0 === a.x ? null : "intermediateSum" : a.y;
        },
        getGraphPath: function() {
          return ["M", 0, 0];
        },
        getCrispPath: function() {
          var a = this.data,
              c = a.length,
              b = this.graph.strokeWidth() + this.borderWidth,
              b = Math.round(b) % 2 / 2,
              g = this.xAxis.reversed,
              d = this.yAxis.reversed,
              e = [],
              f,
              p,
              h;
          for (h = 1; h < c; h++) {
            p = a[h].shapeArgs;
            f = a[h - 1].shapeArgs;
            p = ["M", f.x + (g ? 0 : f.width), f.y + a[h - 1].minPointLengthOffset + b, "L", p.x + (g ? f.width : 0), f.y + a[h - 1].minPointLengthOffset + b];
            if (0 > a[h - 1].y && !d || 0 < a[h - 1].y && d)
              p[2] += f.height, p[5] += f.height;
            e = e.concat(p);
          }
          return e;
        },
        drawGraph: function() {
          f.prototype.drawGraph.call(this);
          this.graph.attr({d: this.getCrispPath()});
        },
        setStackedPoints: function() {
          var a = this.options,
              b,
              l;
          f.prototype.setStackedPoints.apply(this, arguments);
          b = this.stackedYData ? this.stackedYData.length : 0;
          for (l = 1; l < b; l++)
            a.data[l].isSum || a.data[l].isIntermediateSum || (this.stackedYData[l] += this.stackedYData[l - 1]);
        },
        getExtremes: function() {
          if (this.options.stacking)
            return f.prototype.getExtremes.apply(this, arguments);
        }
      }, {
        getClassName: function() {
          var a = k.prototype.getClassName.call(this);
          this.isSum ? a += " highcharts-sum" : this.isIntermediateSum && (a += " highcharts-intermediate-sum");
          return a;
        },
        isValid: function() {
          return v(this.y, !0) || this.isSum || this.isIntermediateSum;
        }
      });
    })(w);
    (function(b) {
      var q = b.Series,
          v = b.seriesType,
          r = b.seriesTypes;
      v("polygon", "scatter", {
        marker: {
          enabled: !1,
          states: {hover: {enabled: !1}}
        },
        stickyTracking: !1,
        tooltip: {
          followPointer: !0,
          pointFormat: ""
        },
        trackByArea: !0
      }, {
        type: "polygon",
        getGraphPath: function() {
          for (var b = q.prototype.getGraphPath.call(this),
              f = b.length + 1; f--; )
            (f === b.length || "M" === b[f]) && 0 < f && b.splice(f, 0, "z");
          return this.areaPath = b;
        },
        drawGraph: function() {
          r.area.prototype.drawGraph.call(this);
        },
        drawLegendSymbol: b.LegendSymbolMixin.drawRectangle,
        drawTracker: q.prototype.drawTracker,
        setStackedPoints: b.noop
      });
    })(w);
    (function(b) {
      var q = b.arrayMax,
          v = b.arrayMin,
          r = b.Axis,
          k = b.each,
          f = b.isNumber,
          m = b.noop,
          n = b.pick,
          a = b.pInt,
          c = b.Point,
          l = b.seriesType,
          g = b.seriesTypes;
      l("bubble", "scatter", {
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
        getRadii: function(a, b, c, g) {
          var d,
              e,
              f,
              p = this.zData,
              l = [],
              u = this.options,
              k = "width" !== u.sizeBy,
              m = u.zThreshold,
              n = b - a;
          e = 0;
          for (d = p.length; e < d; e++)
            f = p[e], u.sizeByAbsoluteValue && null !== f && (f = Math.abs(f - m), b = Math.max(b - m, Math.abs(a - m)), a = 0), null === f ? f = null : f < a ? f = c / 2 - 1 : (f = 0 < n ? (f - a) / n : .5, k && 0 <= f && (f = Math.sqrt(f)), f = Math.ceil(c + f * (g - c)) / 2), l.push(f);
          this.radii = l;
        },
        animate: function(a) {
          var b = this.options.animation;
          a || (k(this.points, function(a) {
            var c = a.graphic,
                d;
            c && c.width && (d = {
              x: c.x,
              y: c.y,
              width: c.width,
              height: c.height
            }, c.attr({
              x: a.plotX,
              y: a.plotY,
              width: 1,
              height: 1
            }), c.animate(d, b));
          }), this.animate = null);
        },
        translate: function() {
          var a,
              c = this.data,
              l,
              p,
              h = this.radii;
          g.scatter.prototype.translate.call(this);
          for (a = c.length; a--; )
            l = c[a], p = h ? h[a] : 0, f(p) && p >= this.minPxSize / 2 ? (l.marker = b.extend(l.marker, {
              radius: p,
              width: 2 * p,
              height: 2 * p
            }), l.dlBox = {
              x: l.plotX - p,
              y: l.plotY - p,
              width: 2 * p,
              height: 2 * p
            }) : l.shapeArgs = l.plotY = l.dlBox = void 0;
        },
        alignDataLabel: g.column.prototype.alignDataLabel,
        buildKDTree: m,
        applyZones: m
      }, {
        haloPath: function(a) {
          return c.prototype.haloPath.call(this, 0 === a ? 0 : (this.marker ? this.marker.radius || 0 : 0) + a);
        },
        ttBelow: !1
      });
      r.prototype.beforePadding = function() {
        var b = this,
            c = this.len,
            g = this.chart,
            l = 0,
            h = c,
            m = this.isXAxis,
            t = m ? "xData" : "yData",
            r = this.min,
            w = {},
            C = Math.min(g.plotWidth, g.plotHeight),
            z = Number.MAX_VALUE,
            A = -Number.MAX_VALUE,
            y = this.max - r,
            B = c / y,
            D = [];
        k(this.series, function(c) {
          var d = c.options;
          !c.bubblePadding || !c.visible && g.options.chart.ignoreHiddenSeries || (b.allowZoomOutside = !0, D.push(c), m && (k(["minSize", "maxSize"], function(c) {
            var b = d[c],
                e = /%$/.test(b),
                b = a(b);
            w[c] = e ? C * b / 100 : b;
          }), c.minPxSize = w.minSize, c.maxPxSize = Math.max(w.maxSize, w.minSize), c = c.zData, c.length && (z = n(d.zMin, Math.min(z, Math.max(v(c), !1 === d.displayNegative ? d.zThreshold : -Number.MAX_VALUE))), A = n(d.zMax, Math.max(A, q(c))))));
        });
        k(D, function(a) {
          var c = a[t],
              d = c.length,
              e;
          m && a.getRadii(z, A, a.minPxSize, a.maxPxSize);
          if (0 < y)
            for (; d--; )
              f(c[d]) && b.dataMin <= c[d] && c[d] <= b.dataMax && (e = a.radii[d], l = Math.min((c[d] - r) * B - e, l), h = Math.max((c[d] - r) * B + e, h));
        });
        D.length && 0 < y && !this.isLog && (h -= c, B *= (c + l - h) / c, k([["min", "userMin", l], ["max", "userMax", h]], function(a) {
          void 0 === n(b.options[a[0]], b[a[1]]) && (b[a[0]] += a[2] / B);
        }));
      };
    })(w);
    (function(b) {
      var q = b.each,
          v = b.pick,
          r = b.seriesTypes,
          k = b.wrap,
          f = b.Series.prototype,
          m = b.Pointer.prototype;
      if (!b.polarExtended) {
        b.polarExtended = !0;
        f.searchPointByAngle = function(a) {
          var c = this.chart,
              b = this.xAxis.pane.center;
          return this.searchKDTree({clientX: 180 + -180 / Math.PI * Math.atan2(a.chartX - b[0] - c.plotLeft, a.chartY - b[1] - c.plotTop)});
        };
        f.getConnectors = function(a, c, b, g) {
          var d,
              e,
              f,
              l,
              h,
              m,
              k,
              n;
          e = g ? 1 : 0;
          d = 0 <= c && c <= a.length - 1 ? c : 0 > c ? a.length - 1 + c : 0;
          c = 0 > d - 1 ? a.length - (1 + e) : d - 1;
          e = d + 1 > a.length - 1 ? e : d + 1;
          f = a[c];
          e = a[e];
          l = f.plotX;
          f = f.plotY;
          h = e.plotX;
          m = e.plotY;
          e = a[d].plotX;
          d = a[d].plotY;
          l = (1.5 * e + l) / 2.5;
          f = (1.5 * d + f) / 2.5;
          h = (1.5 * e + h) / 2.5;
          k = (1.5 * d + m) / 2.5;
          m = Math.sqrt(Math.pow(l - e, 2) + Math.pow(f - d, 2));
          n = Math.sqrt(Math.pow(h - e, 2) + Math.pow(k - d, 2));
          l = Math.atan2(f - d, l - e);
          k = Math.PI / 2 + (l + Math.atan2(k - d, h - e)) / 2;
          Math.abs(l - k) > Math.PI / 2 && (k -= Math.PI);
          l = e + Math.cos(k) * m;
          f = d + Math.sin(k) * m;
          h = e + Math.cos(Math.PI + k) * n;
          k = d + Math.sin(Math.PI + k) * n;
          e = {
            rightContX: h,
            rightContY: k,
            leftContX: l,
            leftContY: f,
            plotX: e,
            plotY: d
          };
          b && (e.prevPointCont = this.getConnectors(a, c, !1, g));
          return e;
        };
        k(f, "buildKDTree", function(a) {
          this.chart.polar && (this.kdByAngle ? this.searchPoint = this.searchPointByAngle : this.options.findNearestPointBy = "xy");
          a.apply(this);
        });
        f.toXY = function(a) {
          var c,
              b = this.chart,
              g = a.plotX;
          c = a.plotY;
          a.rectPlotX = g;
          a.rectPlotY = c;
          c = this.xAxis.postTranslate(a.plotX, this.yAxis.len - c);
          a.plotX = a.polarPlotX = c.x - b.plotLeft;
          a.plotY = a.polarPlotY = c.y - b.plotTop;
          this.kdByAngle ? (b = (g / Math.PI * 180 + this.xAxis.pane.options.startAngle) % 360, 0 > b && (b += 360), a.clientX = b) : a.clientX = a.plotX;
        };
        r.spline && (k(r.spline.prototype, "getPointSpline", function(a, b, f, g) {
          this.chart.polar ? g ? (a = this.getConnectors(b, g, !0, this.connectEnds), a = ["C", a.prevPointCont.rightContX, a.prevPointCont.rightContY, a.leftContX, a.leftContY, a.plotX, a.plotY]) : a = ["M", f.plotX, f.plotY] : a = a.call(this, b, f, g);
          return a;
        }), r.areasplinerange && (r.areasplinerange.prototype.getPointSpline = r.spline.prototype.getPointSpline));
        b.addEvent(f, "afterTranslate", function() {
          var a = this.chart,
              c,
              f;
          if (a.polar) {
            this.kdByAngle = a.tooltip && a.tooltip.shared;
            if (!this.preventPostTranslate)
              for (c = this.points, f = c.length; f--; )
                this.toXY(c[f]);
            this.hasClipCircleSetter || (this.hasClipCircleSetter = !!b.addEvent(this, "afterRender", function() {
              var c;
              a.polar && (c = this.yAxis.center, this.group.clip(a.renderer.clipCircle(c[0], c[1], c[2] / 2)), this.setClip = b.noop);
            }));
          }
        });
        k(f, "getGraphPath", function(a, b) {
          var c = this,
              f,
              d,
              e;
          if (this.chart.polar) {
            b = b || this.points;
            for (f = 0; f < b.length; f++)
              if (!b[f].isNull) {
                d = f;
                break;
              }
            !1 !== this.options.connectEnds && void 0 !== d && (this.connectEnds = !0, b.splice(b.length, 0, b[d]), e = !0);
            q(b, function(a) {
              void 0 === a.polarPlotY && c.toXY(a);
            });
          }
          f = a.apply(this, [].slice.call(arguments, 1));
          e && b.pop();
          return f;
        });
        var n = function(a, b) {
          var c = this.chart,
              f = this.options.animation,
              d = this.group,
              e = this.markerGroup,
              k = this.xAxis.center,
              m = c.plotLeft,
              h = c.plotTop;
          c.polar ? c.renderer.isSVG && (!0 === f && (f = {}), b ? (a = {
            translateX: k[0] + m,
            translateY: k[1] + h,
            scaleX: .001,
            scaleY: .001
          }, d.attr(a), e && e.attr(a)) : (a = {
            translateX: m,
            translateY: h,
            scaleX: 1,
            scaleY: 1
          }, d.animate(a, f), e && e.animate(a, f), this.animate = null)) : a.call(this, b);
        };
        k(f, "animate", n);
        r.column && (r = r.column.prototype, r.polarArc = function(a, b, f, g) {
          var c = this.xAxis.center,
              e = this.yAxis.len;
          return this.chart.renderer.symbols.arc(c[0], c[1], e - b, null, {
            start: f,
            end: g,
            innerR: e - v(a, e)
          });
        }, k(r, "animate", n), k(r, "translate", function(a) {
          var b = this.xAxis,
              f = b.startAngleRad,
              g,
              d,
              e;
          this.preventPostTranslate = !0;
          a.call(this);
          if (b.isRadial)
            for (g = this.points, e = g.length; e--; )
              d = g[e], a = d.barX + f, d.shapeType = "path", d.shapeArgs = {d: this.polarArc(d.yBottom, d.plotY, a, a + d.pointWidth)}, this.toXY(d), d.tooltipPos = [d.plotX, d.plotY], d.ttBelow = d.plotY > b.center[1];
        }), k(r, "alignDataLabel", function(a, b, l, g, d, e) {
          this.chart.polar ? (a = b.rectPlotX / Math.PI * 180, null === g.align && (g.align = 20 < a && 160 > a ? "left" : 200 < a && 340 > a ? "right" : "center"), null === g.verticalAlign && (g.verticalAlign = 45 > a || 315 < a ? "bottom" : 135 < a && 225 > a ? "top" : "middle"), f.alignDataLabel.call(this, b, l, g, d, e)) : a.call(this, b, l, g, d, e);
        }));
        k(m, "getCoordinates", function(a, b) {
          var c = this.chart,
              f = {
                xAxis: [],
                yAxis: []
              };
          c.polar ? q(c.axes, function(a) {
            var d = a.isXAxis,
                g = a.center,
                l = b.chartX - g[0] - c.plotLeft,
                g = b.chartY - g[1] - c.plotTop;
            f[d ? "xAxis" : "yAxis"].push({
              axis: a,
              value: a.translate(d ? Math.PI - Math.atan2(l, g) : Math.sqrt(Math.pow(l, 2) + Math.pow(g, 2)), !0)
            });
          }) : f = a.call(this, b);
          return f;
        });
        b.SVGRenderer.prototype.clipCircle = function(a, c, f) {
          var g = b.uniqueKey(),
              d = this.createElement("clipPath").attr({id: g}).add(this.defs);
          a = this.circle(a, c, f).add(d);
          a.id = g;
          a.clipPath = d;
          return a;
        };
        b.addEvent(b.Chart.prototype, "beforeGetAxes", function() {
          this.pane || (this.pane = []);
          q(b.splat(this.options.pane), function(a) {
            new b.Pane(a, this);
          }, this);
        });
        b.addEvent(b.Chart.prototype, "afterDrawChartBox", function() {
          q(this.pane, function(a) {
            a.render();
          });
        });
        k(b.Chart.prototype, "get", function(a, c) {
          return b.find(this.pane, function(a) {
            return a.options.id === c;
          }) || a.call(this, c);
        });
      }
    })(w);
  });
})(require('process'));
