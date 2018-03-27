/* */ 
(function(Buffer, process) {
  'use strict';
  (function(factory) {
    if (typeof module === 'object' && module.exports) {
      module.exports = factory;
    } else {
      factory(Highcharts);
    }
  }(function(Highcharts) {
    (function(H) {
      var win = H.win,
          doc = win.document,
          noop = function() {},
          Chart = H.Chart,
          Color = H.Color,
          Series = H.Series,
          seriesTypes = H.seriesTypes,
          each = H.each,
          extend = H.extend,
          addEvent = H.addEvent,
          fireEvent = H.fireEvent,
          grep = H.grep,
          isNumber = H.isNumber,
          merge = H.merge,
          pick = H.pick,
          wrap = H.wrap,
          plotOptions = H.getOptions().plotOptions,
          CHUNK_SIZE = 30000,
          mainCanvas = doc.createElement('canvas'),
          index,
          boostable = ['area', 'arearange', 'column', 'columnrange', 'bar', 'line', 'scatter', 'heatmap', 'bubble', 'treemap'],
          boostableMap = {};
      each(boostable, function(item) {
        boostableMap[item] = 1;
      });
      Color.prototype.names = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dodgerblue: '#1e90ff',
        feldspar: '#d19275',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgrey: '#d3d3d3',
        lightgreen: '#90ee90',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslateblue: '#8470ff',
        lightslategray: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370d8',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#d87093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        violetred: '#d02090',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32'
      };
      function patientMax() {
        var args = Array.prototype.slice.call(arguments),
            r = -Number.MAX_VALUE;
        each(args, function(t) {
          if (typeof t !== 'undefined' && t !== null && typeof t.length !== 'undefined') {
            if (t.length > 0) {
              r = t.length;
              return true;
            }
          }
        });
        return r;
      }
      function shouldForceChartSeriesBoosting(chart) {
        var sboostCount = 0,
            canBoostCount = 0,
            allowBoostForce = pick(chart.options.boost && chart.options.boost.allowForce, true),
            series;
        if (typeof chart.boostForceChartBoost !== 'undefined') {
          return chart.boostForceChartBoost;
        }
        if (chart.series.length > 1) {
          for (var i = 0; i < chart.series.length; i++) {
            series = chart.series[i];
            if (boostableMap[series.type]) {
              ++canBoostCount;
            }
            if (patientMax(series.processedXData, series.options.data, series.points) >= (series.options.boostThreshold || Number.MAX_VALUE)) {
              ++sboostCount;
            }
          }
        }
        chart.boostForceChartBoost = (allowBoostForce && canBoostCount === chart.series.length && sboostCount > 0) || sboostCount > 5;
        return chart.boostForceChartBoost;
      }
      Chart.prototype.isChartSeriesBoosting = function() {
        var isSeriesBoosting,
            threshold = pick(this.options.boost && this.options.boost.seriesThreshold, 50);
        isSeriesBoosting = threshold <= this.series.length || shouldForceChartSeriesBoosting(this);
        return isSeriesBoosting;
      };
      Chart.prototype.getBoostClipRect = function(target) {
        var clipBox = {
          x: this.plotLeft,
          y: this.plotTop,
          width: this.plotWidth,
          height: this.plotHeight
        };
        if (target === this) {
          each(this.yAxis, function(yAxis) {
            clipBox.y = Math.min(yAxis.pos, clipBox.y);
            clipBox.height = Math.max(yAxis.pos - this.plotTop + yAxis.len, clipBox.height);
          }, this);
        }
        return clipBox;
      };
      function GLShader(gl) {
        var vertShade = ['#version 100', 'precision highp float;', 'attribute vec4 aVertexPosition;', 'attribute vec4 aColor;', 'varying highp vec2 position;', 'varying highp vec4 vColor;', 'uniform mat4 uPMatrix;', 'uniform float pSize;', 'uniform float translatedThreshold;', 'uniform bool hasThreshold;', 'uniform bool skipTranslation;', 'uniform float plotHeight;', 'uniform float xAxisTrans;', 'uniform float xAxisMin;', 'uniform float xAxisMinPad;', 'uniform float xAxisPointRange;', 'uniform float xAxisLen;', 'uniform bool  xAxisPostTranslate;', 'uniform float xAxisOrdinalSlope;', 'uniform float xAxisOrdinalOffset;', 'uniform float xAxisPos;', 'uniform bool  xAxisCVSCoord;', 'uniform float yAxisTrans;', 'uniform float yAxisMin;', 'uniform float yAxisMinPad;', 'uniform float yAxisPointRange;', 'uniform float yAxisLen;', 'uniform bool  yAxisPostTranslate;', 'uniform float yAxisOrdinalSlope;', 'uniform float yAxisOrdinalOffset;', 'uniform float yAxisPos;', 'uniform bool  yAxisCVSCoord;', 'uniform bool  isBubble;', 'uniform bool  bubbleSizeByArea;', 'uniform float bubbleZMin;', 'uniform float bubbleZMax;', 'uniform float bubbleZThreshold;', 'uniform float bubbleMinSize;', 'uniform float bubbleMaxSize;', 'uniform bool  bubbleSizeAbs;', 'uniform bool  isInverted;', 'float bubbleRadius(){', 'float value = aVertexPosition.w;', 'float zMax = bubbleZMax;', 'float zMin = bubbleZMin;', 'float radius = 0.0;', 'float pos = 0.0;', 'float zRange = zMax - zMin;', 'if (bubbleSizeAbs){', 'value = value - bubbleZThreshold;', 'zMax = max(zMax - bubbleZThreshold, zMin - bubbleZThreshold);', 'zMin = 0.0;', '}', 'if (value < zMin){', 'radius = bubbleZMin / 2.0 - 1.0;', '} else {', 'pos = zRange > 0.0 ? (value - zMin) / zRange : 0.5;', 'if (bubbleSizeByArea && pos > 0.0){', 'pos = sqrt(pos);', '}', 'radius = ceil(bubbleMinSize + pos * (bubbleMaxSize - bubbleMinSize)) / 2.0;', '}', 'return radius * 2.0;', '}', 'float translate(float val,', 'float pointPlacement,', 'float localA,', 'float localMin,', 'float minPixelPadding,', 'float pointRange,', 'float len,', 'bool  cvsCoord', '){', 'float sign = 1.0;', 'float cvsOffset = 0.0;', 'if (cvsCoord) {', 'sign *= -1.0;', 'cvsOffset = len;', '}', 'return sign * (val - localMin) * localA + cvsOffset + ', '(sign * minPixelPadding);', '}', 'float xToPixels(float value){', 'if (skipTranslation){', 'return value;// + xAxisPos;', '}', 'return translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord);// + xAxisPos;', '}', 'float yToPixels(float value, float checkTreshold){', 'float v;', 'if (skipTranslation){', 'v = value;// + yAxisPos;', '} else {', 'v = translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord);// + yAxisPos;', 'if (v > plotHeight) {', 'v = plotHeight;', '}', '}', 'if (checkTreshold > 0.0 && hasThreshold) {', 'v = min(v, translatedThreshold);', '}', 'return v;', '}', 'void main(void) {', 'if (isBubble){', 'gl_PointSize = bubbleRadius();', '} else {', 'gl_PointSize = pSize;', '}', 'vColor = aColor;', 'if (isInverted) {', 'gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.y) + yAxisPos, yToPixels(aVertexPosition.x, aVertexPosition.z) + xAxisPos, 0.0, 1.0);', '} else {', 'gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x) + xAxisPos, yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, 0.0, 1.0);', '}', '}'].join('\n'),
            fragShade = ['precision highp float;', 'uniform vec4 fillColor;', 'varying highp vec2 position;', 'varying highp vec4 vColor;', 'uniform sampler2D uSampler;', 'uniform bool isCircle;', 'uniform bool hasColor;', 'void main(void) {', 'vec4 col = fillColor;', 'vec4 tcol;', 'if (hasColor) {', 'col = vColor;', '}', 'if (isCircle) {', 'tcol = texture2D(uSampler, gl_PointCoord.st);', 'col *= tcol;', 'if (tcol.r < 0.0) {', 'discard;', '} else {', 'gl_FragColor = col;', '}', '} else {', 'gl_FragColor = col;', '}', '}'].join('\n'),
            uLocations = {},
            shaderProgram,
            pUniform,
            psUniform,
            fillColorUniform,
            isBubbleUniform,
            bubbleSizeAbsUniform,
            bubbleSizeAreaUniform,
            skipTranslationUniform,
            isCircleUniform,
            isInverted,
            plotHeightUniform,
            uSamplerUniform;
        function stringToProgram(str, type) {
          var t = type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER,
              shader = gl.createShader(t);
          gl.shaderSource(shader, str);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return false;
          }
          return shader;
        }
        function createShader() {
          var v = stringToProgram(vertShade, 'vertex'),
              f = stringToProgram(fragShade, 'fragment');
          if (!v || !f) {
            shaderProgram = false;
            return false;
          }
          function uloc(n) {
            return gl.getUniformLocation(shaderProgram, n);
          }
          shaderProgram = gl.createProgram();
          gl.attachShader(shaderProgram, v);
          gl.attachShader(shaderProgram, f);
          gl.linkProgram(shaderProgram);
          gl.useProgram(shaderProgram);
          gl.bindAttribLocation(shaderProgram, 0, 'aVertexPosition');
          pUniform = uloc('uPMatrix');
          psUniform = uloc('pSize');
          fillColorUniform = uloc('fillColor');
          isBubbleUniform = uloc('isBubble');
          bubbleSizeAbsUniform = uloc('bubbleSizeAbs');
          bubbleSizeAreaUniform = uloc('bubbleSizeByArea');
          uSamplerUniform = uloc('uSampler');
          skipTranslationUniform = uloc('skipTranslation');
          isCircleUniform = uloc('isCircle');
          isInverted = uloc('isInverted');
          plotHeightUniform = uloc('plotHeight');
          return true;
        }
        function destroy() {
          if (gl) {
            if (shaderProgram) {
              gl.deleteProgram(shaderProgram);
              shaderProgram = false;
            }
          }
        }
        function bind() {
          gl.useProgram(shaderProgram);
        }
        function setUniform(name, val) {
          var u = uLocations[name] = uLocations[name] || gl.getUniformLocation(shaderProgram, name);
          gl.uniform1f(u, val);
        }
        function setTexture() {
          gl.uniform1i(uSamplerUniform, 0);
        }
        function setInverted(flag) {
          gl.uniform1i(isInverted, flag);
        }
        function setDrawAsCircle(flag) {
          gl.uniform1i(isCircleUniform, flag ? 1 : 0);
        }
        function setPlotHeight(n) {
          gl.uniform1f(plotHeightUniform, n);
        }
        function reset() {
          gl.uniform1i(isBubbleUniform, 0);
          gl.uniform1i(isCircleUniform, 0);
        }
        function setBubbleUniforms(series, zCalcMin, zCalcMax) {
          var seriesOptions = series.options,
              zMin = Number.MAX_VALUE,
              zMax = -Number.MAX_VALUE;
          if (series.type === 'bubble') {
            zMin = pick(seriesOptions.zMin, Math.min(zMin, Math.max(zCalcMin, seriesOptions.displayNegative === false ? seriesOptions.zThreshold : -Number.MAX_VALUE)));
            zMax = pick(seriesOptions.zMax, Math.max(zMax, zCalcMax));
            gl.uniform1i(isBubbleUniform, 1);
            gl.uniform1i(isCircleUniform, 1);
            gl.uniform1i(bubbleSizeAreaUniform, series.options.sizeBy !== 'width');
            gl.uniform1i(bubbleSizeAbsUniform, series.options.sizeByAbsoluteValue);
            setUniform('bubbleZMin', zMin);
            setUniform('bubbleZMax', zMax);
            setUniform('bubbleZThreshold', series.options.zThreshold);
            setUniform('bubbleMinSize', series.minPxSize);
            setUniform('bubbleMaxSize', series.maxPxSize);
          }
        }
        function setColor(color) {
          gl.uniform4f(fillColorUniform, color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, color[3]);
        }
        function setSkipTranslation(flag) {
          gl.uniform1i(skipTranslationUniform, flag === true ? 1 : 0);
        }
        function setPMatrix(m) {
          gl.uniformMatrix4fv(pUniform, false, m);
        }
        function setPointSize(p) {
          gl.uniform1f(psUniform, p);
        }
        function getProgram() {
          return shaderProgram;
        }
        if (gl) {
          createShader();
        }
        return {
          psUniform: function() {
            return psUniform;
          },
          pUniform: function() {
            return pUniform;
          },
          fillColorUniform: function() {
            return fillColorUniform;
          },
          setPlotHeight: setPlotHeight,
          setBubbleUniforms: setBubbleUniforms,
          bind: bind,
          program: getProgram,
          create: createShader,
          setUniform: setUniform,
          setPMatrix: setPMatrix,
          setColor: setColor,
          setPointSize: setPointSize,
          setSkipTranslation: setSkipTranslation,
          setTexture: setTexture,
          setDrawAsCircle: setDrawAsCircle,
          reset: reset,
          setInverted: setInverted,
          destroy: destroy
        };
      }
      function GLVertexBuffer(gl, shader, dataComponents) {
        var buffer = false,
            vertAttribute = false,
            components = dataComponents || 2,
            preAllocated = false,
            iterator = 0,
            data;
        function destroy() {
          if (buffer) {
            gl.deleteBuffer(buffer);
            buffer = false;
            vertAttribute = false;
          }
          iterator = 0;
          components = dataComponents || 2;
          data = [];
        }
        function build(dataIn, attrib, dataComponents) {
          var farray;
          data = dataIn || [];
          if ((!data || data.length === 0) && !preAllocated) {
            destroy();
            return false;
          }
          components = dataComponents || components;
          if (buffer) {
            gl.deleteBuffer(buffer);
          }
          if (!preAllocated) {
            farray = new Float32Array(data);
          }
          buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, preAllocated || farray, gl.STATIC_DRAW);
          vertAttribute = gl.getAttribLocation(shader.program(), attrib);
          gl.enableVertexAttribArray(vertAttribute);
          farray = false;
          return true;
        }
        function bind() {
          if (!buffer) {
            return false;
          }
          gl.vertexAttribPointer(vertAttribute, components, gl.FLOAT, false, 0, 0);
        }
        function render(from, to, drawMode) {
          var length = preAllocated ? preAllocated.length : data.length;
          if (!buffer) {
            return false;
          }
          if (!length) {
            return false;
          }
          if (!from || from > length || from < 0) {
            from = 0;
          }
          if (!to || to > length) {
            to = length;
          }
          drawMode = drawMode || 'points';
          gl.drawArrays(gl[drawMode.toUpperCase()], from / components, (to - from) / components);
          return true;
        }
        function push(x, y, a, b) {
          if (preAllocated) {
            preAllocated[++iterator] = x;
            preAllocated[++iterator] = y;
            preAllocated[++iterator] = a;
            preAllocated[++iterator] = b;
          }
        }
        function allocate(size) {
          size *= 4;
          iterator = -1;
          preAllocated = new Float32Array(size);
        }
        return {
          destroy: destroy,
          bind: bind,
          data: data,
          build: build,
          render: render,
          allocate: allocate,
          push: push
        };
      }
      function GLRenderer(postRenderCallback) {
        var shader = false,
            vbuffer = false,
            gl = false,
            width = 0,
            height = 0,
            data = false,
            markerData = false,
            textureIsReady = false,
            exports = {},
            isInited = false,
            series = [],
            circleTexture = doc.createElement('canvas'),
            circleCtx = circleTexture.getContext('2d'),
            circleTextureHandle,
            asBar = {
              'column': true,
              'columnrange': true,
              'bar': true,
              'area': true,
              'arearange': true
            },
            asCircle = {
              'scatter': true,
              'bubble': true
            },
            settings = {
              pointSize: 1,
              lineWidth: 1,
              fillColor: '#AA00AA',
              useAlpha: true,
              usePreallocated: false,
              useGPUTranslations: false,
              debug: {
                timeRendering: false,
                timeSeriesProcessing: false,
                timeSetup: false,
                timeBufferCopy: false,
                timeKDTree: false,
                showSkipSummary: false
              }
            };
        function setOptions(options) {
          merge(true, settings, options);
        }
        function seriesPointCount(series) {
          var isStacked,
              xData,
              s;
          if (series.isSeriesBoosting) {
            isStacked = !!series.options.stacking;
            xData = series.xData || series.options.xData || series.processedXData;
            s = (isStacked ? series.data : (xData || series.options.data)).length;
            if (series.type === 'treemap') {
              s *= 12;
            } else if (series.type === 'heatmap') {
              s *= 6;
            } else if (asBar[series.type]) {
              s *= 2;
            }
            return s;
          }
          return 0;
        }
        function allocateBuffer(chart) {
          var s = 0;
          if (!settings.usePreallocated) {
            return;
          }
          each(chart.series, function(series) {
            if (series.isSeriesBoosting) {
              s += seriesPointCount(series);
            }
          });
          vbuffer.allocate(s);
        }
        function allocateBufferForSingleSeries(series) {
          var s = 0;
          if (!settings.usePreallocated) {
            return;
          }
          if (series.isSeriesBoosting) {
            s = seriesPointCount(series);
          }
          vbuffer.allocate(s);
        }
        function orthoMatrix(width, height) {
          var near = 0,
              far = 1;
          return [2 / width, 0, 0, 0, 0, -(2 / height), 0, 0, 0, 0, -2 / (far - near), 0, -1, 1, -(far + near) / (far - near), 1];
        }
        function clear() {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        function getGL() {
          return gl;
        }
        function pushSeriesData(series, inst) {
          var isRange = series.pointArrayMap && series.pointArrayMap.join(',') === 'low,high',
              chart = series.chart,
              options = series.options,
              isStacked = !!options.stacking,
              rawData = options.data,
              xExtremes = series.xAxis.getExtremes(),
              xMin = xExtremes.min,
              xMax = xExtremes.max,
              yExtremes = series.yAxis.getExtremes(),
              yMin = yExtremes.min,
              yMax = yExtremes.max,
              xData = series.xData || options.xData || series.processedXData,
              yData = series.yData || options.yData || series.processedYData,
              zData = series.zData || options.zData || series.processedZData,
              yAxis = series.yAxis,
              xAxis = series.xAxis,
              plotHeight = series.chart.plotHeight,
              useRaw = !xData || xData.length === 0,
              connectNulls = options.connectNulls,
              maxVal,
              points = series.points || false,
              lastX = false,
              lastY = false,
              minVal,
              color,
              scolor,
              sdata = isStacked ? series.data : (xData || rawData),
              closestLeft = {
                x: -Number.MAX_VALUE,
                y: 0
              },
              closestRight = {
                x: Number.MIN_VALUE,
                y: 0
              },
              skipped = 0,
              cullXThreshold = 1,
              cullYThreshold = 1,
              x,
              y,
              d,
              z,
              i = -1,
              px = false,
              nx = false,
              low,
              chartDestroyed = typeof chart.index === 'undefined',
              nextInside = false,
              prevInside = false,
              pcolor = false,
              drawAsBar = asBar[series.type],
              isXInside = false,
              isYInside = true;
          if (options.boostData && options.boostData.length > 0) {
            return;
          }
          series.closestPointRangePx = Number.MAX_VALUE;
          function pushColor(color) {
            if (color) {
              inst.colorData.push(color[0]);
              inst.colorData.push(color[1]);
              inst.colorData.push(color[2]);
              inst.colorData.push(color[3]);
            }
          }
          function vertice(x, y, checkTreshold, pointSize, color) {
            pushColor(color);
            if (settings.usePreallocated) {
              vbuffer.push(x, y, checkTreshold ? 1 : 0, pointSize || 1);
            } else {
              data.push(x);
              data.push(y);
              data.push(checkTreshold ? 1 : 0);
              data.push(pointSize || 1);
            }
          }
          function closeSegment() {
            if (inst.segments.length) {
              inst.segments[inst.segments.length - 1].to = data.length;
            }
          }
          function beginSegment() {
            if (inst.segments.length && inst.segments[inst.segments.length - 1].from === data.length) {
              return;
            }
            closeSegment();
            inst.segments.push({from: data.length});
          }
          function pushRect(x, y, w, h, color) {
            pushColor(color);
            vertice(x + w, y);
            pushColor(color);
            vertice(x, y);
            pushColor(color);
            vertice(x, y + h);
            pushColor(color);
            vertice(x, y + h);
            pushColor(color);
            vertice(x + w, y + h);
            pushColor(color);
            vertice(x + w, y);
          }
          beginSegment();
          if (points && points.length > 0) {
            inst.skipTranslation = true;
            inst.drawMode = 'triangles';
            if (points[0].node && points[0].node.levelDynamic) {
              points.sort(function(a, b) {
                if (a.node) {
                  if (a.node.levelDynamic > b.node.levelDynamic) {
                    return 1;
                  } else if (a.node.levelDynamic < b.node.levelDynamic) {
                    return -1;
                  }
                }
                return 0;
              });
            }
            each(points, function(point) {
              var plotY = point.plotY,
                  shapeArgs,
                  swidth,
                  pointAttr;
              if (typeof plotY !== 'undefined' && !isNaN(plotY) && point.y !== null) {
                shapeArgs = point.shapeArgs;
                pointAttr = point.series.pointAttribs(point);
                swidth = pointAttr['stroke-width'] || 0;
                color = H.color(pointAttr.fill).rgba;
                color[0] /= 255.0;
                color[1] /= 255.0;
                color[2] /= 255.0;
                if (series.type === 'treemap') {
                  swidth = swidth || 1;
                  scolor = H.color(pointAttr.stroke).rgba;
                  scolor[0] /= 255.0;
                  scolor[1] /= 255.0;
                  scolor[2] /= 255.0;
                  pushRect(shapeArgs.x, shapeArgs.y, shapeArgs.width, shapeArgs.height, scolor);
                  swidth /= 2;
                }
                if (series.type === 'heatmap' && chart.inverted) {
                  shapeArgs.x = xAxis.len - shapeArgs.x;
                  shapeArgs.y = yAxis.len - shapeArgs.y;
                  shapeArgs.width = -shapeArgs.width;
                  shapeArgs.height = -shapeArgs.height;
                }
                pushRect(shapeArgs.x + swidth, shapeArgs.y + swidth, shapeArgs.width - (swidth * 2), shapeArgs.height - (swidth * 2), color);
              }
            });
            closeSegment();
            return;
          }
          while (i < sdata.length - 1) {
            d = sdata[++i];
            if (chartDestroyed) {
              break;
            }
            if (useRaw) {
              x = d[0];
              y = d[1];
              if (sdata[i + 1]) {
                nx = sdata[i + 1][0];
              }
              if (sdata[i - 1]) {
                px = sdata[i - 1][0];
              }
              if (d.length >= 3) {
                z = d[2];
                if (d[2] > inst.zMax) {
                  inst.zMax = d[2];
                }
                if (d[2] < inst.zMin) {
                  inst.zMin = d[2];
                }
              }
            } else {
              x = d;
              y = yData[i];
              if (sdata[i + 1]) {
                nx = sdata[i + 1];
              }
              if (sdata[i - 1]) {
                px = sdata[i - 1];
              }
              if (zData && zData.length) {
                z = zData[i];
                if (zData[i] > inst.zMax) {
                  inst.zMax = zData[i];
                }
                if (zData[i] < inst.zMin) {
                  inst.zMin = zData[i];
                }
              }
            }
            if (!connectNulls && (x === null || y === null)) {
              beginSegment();
              continue;
            }
            if (nx && nx >= xMin && nx <= xMax) {
              nextInside = true;
            }
            if (px && px >= xMin && px <= xMax) {
              prevInside = true;
            }
            if (isRange) {
              if (useRaw) {
                y = d.slice(1, 3);
              }
              low = y[0];
              y = y[1];
            } else if (isStacked) {
              x = d.x;
              y = d.stackY;
              low = y - d.y;
            }
            if (yMin !== null && typeof yMin !== 'undefined' && yMax !== null && typeof yMax !== 'undefined') {
              isYInside = y >= yMin && y <= yMax;
            }
            if (x > xMax && closestRight.x < xMax) {
              closestRight.x = x;
              closestRight.y = y;
            }
            if (x < xMin && closestLeft.x < xMin) {
              closestLeft.x = x;
              closestLeft.y = y;
            }
            if (y === null && connectNulls) {
              continue;
            }
            if (y === null || !isYInside) {
              beginSegment();
              continue;
            }
            if (x >= xMin && x <= xMax) {
              isXInside = true;
            }
            if (!isXInside && !nextInside && !prevInside) {
              continue;
            }
            if (!settings.useGPUTranslations) {
              inst.skipTranslation = true;
              x = xAxis.toPixels(x, true);
              y = yAxis.toPixels(y, true);
              if (y > plotHeight) {
                y = plotHeight;
              }
            }
            if (drawAsBar) {
              maxVal = y;
              minVal = low;
              if (low === false || typeof low === 'undefined') {
                if (y < 0) {
                  minVal = y;
                } else {
                  minVal = 0;
                }
              }
              if (!settings.useGPUTranslations) {
                minVal = yAxis.toPixels(minVal, true);
              }
              vertice(x, minVal, 0, 0, pcolor);
            }
            if (inst.hasMarkers) {
              if (lastX !== false) {
                series.closestPointRangePx = Math.min(series.closestPointRangePx, Math.abs(x - lastX));
              }
            }
            if (!settings.useGPUTranslations && !settings.usePreallocated && (lastX && x - lastX < cullXThreshold) && (lastY && Math.abs(y - lastY) < cullYThreshold)) {
              if (settings.debug.showSkipSummary) {
                ++skipped;
              }
              continue;
            }
            if (options.step) {
              vertice(x, lastY, 0, 2, pcolor);
            }
            vertice(x, y, 0, series.type === 'bubble' ? (z || 1) : 2, pcolor);
            lastX = x;
            lastY = y;
          }
          if (settings.debug.showSkipSummary) {
            console.log('skipped points:', skipped);
          }
          function pushSupplementPoint(point) {
            if (!settings.useGPUTranslations) {
              inst.skipTranslation = true;
              point.x = xAxis.toPixels(point.x, true);
              point.y = yAxis.toPixels(point.y, true);
            }
            vertice(point.x, point.y, 0, 2);
          }
          if (!lastX && connectNulls !== false && closestLeft > -Number.MAX_VALUE && closestRight < Number.MAX_VALUE) {
            pushSupplementPoint(closestLeft);
            pushSupplementPoint(closestRight);
          }
          closeSegment();
        }
        function pushSeries(s) {
          if (series.length > 0) {
            if (series[series.length - 1].hasMarkers) {
              series[series.length - 1].markerTo = markerData.length;
            }
          }
          if (settings.debug.timeSeriesProcessing) {
            console.time('building ' + s.type + ' series');
          }
          series.push({
            segments: [],
            markerFrom: markerData.length,
            colorData: [],
            series: s,
            zMin: Number.MAX_VALUE,
            zMax: -Number.MAX_VALUE,
            hasMarkers: s.options.marker ? s.options.marker.enabled !== false : false,
            showMarksers: true,
            drawMode: ({
              'area': 'lines',
              'arearange': 'lines',
              'areaspline': 'line_strip',
              'column': 'lines',
              'columnrange': 'lines',
              'bar': 'lines',
              'line': 'line_strip',
              'scatter': 'points',
              'heatmap': 'triangles',
              'treemap': 'triangles',
              'bubble': 'points'
            })[s.type] || 'line_strip'
          });
          pushSeriesData(s, series[series.length - 1]);
          if (settings.debug.timeSeriesProcessing) {
            console.timeEnd('building ' + s.type + ' series');
          }
        }
        function flush() {
          series = [];
          exports.data = data = [];
          markerData = [];
          if (vbuffer) {
            vbuffer.destroy();
          }
        }
        function setXAxis(axis) {
          if (!shader) {
            return;
          }
          shader.setUniform('xAxisTrans', axis.transA);
          shader.setUniform('xAxisMin', axis.min);
          shader.setUniform('xAxisMinPad', axis.minPixelPadding);
          shader.setUniform('xAxisPointRange', axis.pointRange);
          shader.setUniform('xAxisLen', axis.len);
          shader.setUniform('xAxisPos', axis.pos);
          shader.setUniform('xAxisCVSCoord', !axis.horiz);
        }
        function setYAxis(axis) {
          if (!shader) {
            return;
          }
          shader.setUniform('yAxisTrans', axis.transA);
          shader.setUniform('yAxisMin', axis.min);
          shader.setUniform('yAxisMinPad', axis.minPixelPadding);
          shader.setUniform('yAxisPointRange', axis.pointRange);
          shader.setUniform('yAxisLen', axis.len);
          shader.setUniform('yAxisPos', axis.pos);
          shader.setUniform('yAxisCVSCoord', !axis.horiz);
        }
        function setThreshold(has, translation) {
          shader.setUniform('hasThreshold', has);
          shader.setUniform('translatedThreshold', translation);
        }
        function render(chart) {
          if (chart) {
            if (!chart.chartHeight || !chart.chartWidth) {}
            width = chart.chartWidth || 800;
            height = chart.chartHeight || 400;
          } else {
            return false;
          }
          if (!gl || !width || !height) {
            return false;
          }
          if (settings.debug.timeRendering) {
            console.time('gl rendering');
          }
          gl.canvas.width = width;
          gl.canvas.height = height;
          shader.bind();
          gl.viewport(0, 0, width, height);
          shader.setPMatrix(orthoMatrix(width, height));
          shader.setPlotHeight(chart.plotHeight);
          if (settings.lineWidth > 1 && !H.isMS) {
            gl.lineWidth(settings.lineWidth);
          }
          vbuffer.build(exports.data, 'aVertexPosition', 4);
          vbuffer.bind();
          if (textureIsReady) {
            gl.bindTexture(gl.TEXTURE_2D, circleTextureHandle);
            shader.setTexture(circleTextureHandle);
          }
          shader.setInverted(chart.inverted);
          each(series, function(s, si) {
            var options = s.series.options,
                sindex,
                lineWidth = typeof options.lineWidth !== 'undefined' ? options.lineWidth : 1,
                threshold = options.threshold,
                hasThreshold = isNumber(threshold),
                yBottom = s.series.yAxis.getThreshold(threshold),
                translatedThreshold = yBottom,
                cbuffer,
                showMarkers = pick(options.marker ? options.marker.enabled : null, s.series.xAxis.isRadial ? true : null, s.series.closestPointRangePx > 2 * ((options.marker ? options.marker.radius : 10) || 10)),
                fillColor = (s.series.pointAttribs && s.series.pointAttribs().fill) || s.series.color,
                color;
            if (s.series.fillOpacity && options.fillOpacity) {
              fillColor = new Color(fillColor).setOpacity(pick(options.fillOpacity, 1.0)).get();
            }
            if (options.colorByPoint) {
              fillColor = s.series.chart.options.colors[si];
            }
            color = H.color(fillColor).rgba;
            if (!settings.useAlpha) {
              color[3] = 1.0;
            }
            if (s.drawMode === 'lines' && settings.useAlpha && color[3] < 1) {
              color[3] /= 10;
            }
            if (options.boostBlending === 'add') {
              gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
              gl.blendEquation(gl.FUNC_ADD);
            } else if (options.boostBlending === 'mult') {
              gl.blendFunc(gl.DST_COLOR, gl.ZERO);
            } else if (options.boostBlending === 'darken') {
              gl.blendFunc(gl.ONE, gl.ONE);
              gl.blendEquation(gl.FUNC_MIN);
            } else {
              gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            }
            shader.reset();
            if (s.colorData.length > 0) {
              shader.setUniform('hasColor', 1.0);
              cbuffer = GLVertexBuffer(gl, shader);
              cbuffer.build(s.colorData, 'aColor', 4);
              cbuffer.bind();
            }
            shader.setColor(color);
            setXAxis(s.series.xAxis);
            setYAxis(s.series.yAxis);
            setThreshold(hasThreshold, translatedThreshold);
            if (s.drawMode === 'points') {
              if (options.marker && options.marker.radius) {
                shader.setPointSize(options.marker.radius * 2.0);
              } else {
                shader.setPointSize(1);
              }
            }
            shader.setSkipTranslation(s.skipTranslation);
            if (s.series.type === 'bubble') {
              shader.setBubbleUniforms(s.series, s.zMin, s.zMax);
            }
            shader.setDrawAsCircle((asCircle[s.series.type] && textureIsReady) || false);
            if (lineWidth > 0 || s.drawMode !== 'line_strip') {
              for (sindex = 0; sindex < s.segments.length; sindex++) {
                vbuffer.render(s.segments[sindex].from, s.segments[sindex].to, s.drawMode);
              }
            }
            if (s.hasMarkers && showMarkers) {
              if (options.marker && options.marker.radius) {
                shader.setPointSize(options.marker.radius * 2.0);
              } else {
                shader.setPointSize(10);
              }
              shader.setDrawAsCircle(true);
              for (sindex = 0; sindex < s.segments.length; sindex++) {
                vbuffer.render(s.segments[sindex].from, s.segments[sindex].to, 'POINTS');
              }
            }
          });
          if (settings.debug.timeRendering) {
            console.timeEnd('gl rendering');
          }
          if (postRenderCallback) {
            postRenderCallback();
          }
          flush();
        }
        function renderWhenReady(chart) {
          clear();
          if (chart.renderer.forExport) {
            return render(chart);
          }
          if (isInited) {
            render(chart);
          } else {
            setTimeout(function() {
              renderWhenReady(chart);
            }, 1);
          }
        }
        function setSize(w, h) {
          if (width === w && h === h) {
            return;
          }
          width = w;
          height = h;
          shader.bind();
          shader.setPMatrix(orthoMatrix(width, height));
        }
        function init(canvas, noFlush) {
          var i = 0,
              contexts = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'];
          isInited = false;
          if (!canvas) {
            return false;
          }
          if (settings.debug.timeSetup) {
            console.time('gl setup');
          }
          for (; i < contexts.length; i++) {
            gl = canvas.getContext(contexts[i], {});
            if (gl) {
              break;
            }
          }
          if (gl) {
            if (!noFlush) {
              flush();
            }
          } else {
            return false;
          }
          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          gl.disable(gl.DEPTH_TEST);
          gl.depthFunc(gl.LESS);
          shader = GLShader(gl);
          vbuffer = GLVertexBuffer(gl, shader);
          textureIsReady = false;
          circleTextureHandle = gl.createTexture();
          circleTexture.width = 512;
          circleTexture.height = 512;
          circleCtx.mozImageSmoothingEnabled = false;
          circleCtx.webkitImageSmoothingEnabled = false;
          circleCtx.msImageSmoothingEnabled = false;
          circleCtx.imageSmoothingEnabled = false;
          circleCtx.strokeStyle = 'rgba(255, 255, 255, 0)';
          circleCtx.fillStyle = '#FFF';
          circleCtx.beginPath();
          circleCtx.arc(256, 256, 256, 0, 2 * Math.PI);
          circleCtx.stroke();
          circleCtx.fill();
          try {
            gl.bindTexture(gl.TEXTURE_2D, circleTextureHandle);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, circleTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);
            textureIsReady = true;
          } catch (e) {}
          isInited = true;
          if (settings.debug.timeSetup) {
            console.timeEnd('gl setup');
          }
          return true;
        }
        function valid() {
          return gl !== false;
        }
        function inited() {
          return isInited;
        }
        function destroy() {
          flush();
          vbuffer.destroy();
          shader.destroy();
          if (gl) {
            if (circleTextureHandle) {
              gl.deleteTexture(circleTextureHandle);
            }
            gl.canvas.width = 1;
            gl.canvas.height = 1;
          }
        }
        exports = {
          allocateBufferForSingleSeries: allocateBufferForSingleSeries,
          pushSeries: pushSeries,
          setSize: setSize,
          inited: inited,
          setThreshold: setThreshold,
          init: init,
          render: renderWhenReady,
          settings: settings,
          valid: valid,
          clear: clear,
          flush: flush,
          setXAxis: setXAxis,
          setYAxis: setYAxis,
          data: data,
          gl: getGL,
          allocateBuffer: allocateBuffer,
          destroy: destroy,
          setOptions: setOptions
        };
        return exports;
      }
      function createAndAttachRenderer(chart, series) {
        var width = chart.chartWidth,
            height = chart.chartHeight,
            target = chart,
            targetGroup = chart.seriesGroup || series.group,
            alpha = 1,
            foSupported = doc.implementation.hasFeature('www.http://w3.org/TR/SVG11/feature#Extensibility', '1.1');
        if (chart.isChartSeriesBoosting()) {
          target = chart;
        } else {
          target = series;
        }
        foSupported = false;
        if (!target.renderTarget) {
          target.canvas = mainCanvas;
          if (chart.renderer.forExport || !foSupported) {
            target.renderTarget = chart.renderer.image('', 0, 0, width, height).addClass('highcharts-boost-canvas').add(targetGroup);
            target.boostClear = function() {
              target.renderTarget.attr({href: ''});
            };
            target.boostCopy = function() {
              target.boostResizeTarget();
              target.renderTarget.attr({href: target.canvas.toDataURL('image/png')});
            };
          } else {
            target.renderTargetFo = chart.renderer.createElement('foreignObject').add(targetGroup);
            target.renderTarget = doc.createElement('canvas');
            target.renderTargetCtx = target.renderTarget.getContext('2d');
            target.renderTargetFo.element.appendChild(target.renderTarget);
            target.boostClear = function() {
              target.renderTarget.width = target.canvas.width;
              target.renderTarget.height = target.canvas.height;
            };
            target.boostCopy = function() {
              target.renderTarget.width = target.canvas.width;
              target.renderTarget.height = target.canvas.height;
              target.renderTargetCtx.drawImage(target.canvas, 0, 0);
            };
          }
          target.boostResizeTarget = function() {
            width = chart.chartWidth;
            height = chart.chartHeight;
            (target.renderTargetFo || target.renderTarget).attr({
              x: 0,
              y: 0,
              width: width,
              height: height
            }).css({
              pointerEvents: 'none',
              mixedBlendMode: 'normal',
              opacity: alpha
            });
            if (target instanceof H.Chart) {
              target.markerGroup.translate(chart.plotLeft, chart.plotTop);
            }
          };
          target.boostClipRect = chart.renderer.clipRect();
          (target.renderTargetFo || target.renderTarget).clip(target.boostClipRect);
          if (target instanceof H.Chart) {
            target.markerGroup = target.renderer.g().add(targetGroup);
            target.markerGroup.translate(series.xAxis.pos, series.yAxis.pos);
          }
        }
        target.canvas.width = width;
        target.canvas.height = height;
        target.boostClipRect.attr(chart.getBoostClipRect(target));
        target.boostResizeTarget();
        target.boostClear();
        if (!target.ogl) {
          target.ogl = GLRenderer(function() {
            if (target.ogl.settings.debug.timeBufferCopy) {
              console.time('buffer copy');
            }
            target.boostCopy();
            if (target.ogl.settings.debug.timeBufferCopy) {
              console.timeEnd('buffer copy');
            }
          });
          target.ogl.init(target.canvas);
          target.ogl.setOptions(chart.options.boost || {});
          if (target instanceof H.Chart) {
            target.ogl.allocateBuffer(chart);
          }
        }
        target.ogl.setSize(width, height);
        return target.ogl;
      }
      function renderIfNotSeriesBoosting(renderer, series, chart) {
        if (renderer && series.renderTarget && series.canvas && !(chart || series.chart).isChartSeriesBoosting()) {
          renderer.render(chart || series.chart);
        }
      }
      function allocateIfNotSeriesBoosting(renderer, series) {
        if (renderer && series.renderTarget && series.canvas && !series.chart.isChartSeriesBoosting()) {
          renderer.allocateBufferForSingleSeries(series);
        }
      }
      H.eachAsync = function(arr, fn, finalFunc, chunkSize, i, noTimeout) {
        i = i || 0;
        chunkSize = chunkSize || CHUNK_SIZE;
        var threshold = i + chunkSize,
            proceed = true;
        while (proceed && i < threshold && i < arr.length) {
          proceed = fn(arr[i], i);
          ++i;
        }
        if (proceed) {
          if (i < arr.length) {
            if (noTimeout) {
              H.eachAsync(arr, fn, finalFunc, chunkSize, i, noTimeout);
            } else if (win.requestAnimationFrame) {
              win.requestAnimationFrame(function() {
                H.eachAsync(arr, fn, finalFunc, chunkSize, i);
              });
            } else {
              setTimeout(function() {
                H.eachAsync(arr, fn, finalFunc, chunkSize, i);
              });
            }
          } else if (finalFunc) {
            finalFunc();
          }
        }
      };
      Series.prototype.getPoint = function(boostPoint) {
        var point = boostPoint,
            xData = this.xData || this.options.xData || this.processedXData || false;
        if (boostPoint && !(boostPoint instanceof this.pointClass)) {
          point = (new this.pointClass()).init(this, this.options.data[boostPoint.i], xData ? xData[boostPoint.i] : undefined);
          point.category = point.x;
          point.dist = boostPoint.dist;
          point.distX = boostPoint.distX;
          point.plotX = boostPoint.plotX;
          point.plotY = boostPoint.plotY;
          point.index = boostPoint.i;
        }
        return point;
      };
      wrap(Series.prototype, 'searchPoint', function(proceed) {
        return this.getPoint(proceed.apply(this, [].slice.call(arguments, 1)));
      });
      wrap(Series.prototype, 'destroy', function(proceed) {
        var series = this,
            chart = series.chart;
        if (chart.markerGroup === series.markerGroup) {
          series.markerGroup = null;
        }
        if (chart.hoverPoints) {
          chart.hoverPoints = grep(chart.hoverPoints, function(point) {
            return point.series === series;
          });
        }
        if (chart.hoverPoint && chart.hoverPoint.series === series) {
          chart.hoverPoint = null;
        }
        proceed.call(this);
      });
      wrap(Series.prototype, 'getExtremes', function(proceed) {
        if (!this.isSeriesBoosting || (!this.hasExtremes || !this.hasExtremes())) {
          return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
      });
      each(boostable, function(type) {
        if (plotOptions[type]) {
          plotOptions[type].boostThreshold = 5000;
          plotOptions[type].boostData = [];
          seriesTypes[type].prototype.fillOpacity = true;
        }
      });
      each(['translate', 'generatePoints', 'drawTracker', 'drawPoints', 'render'], function(method) {
        function branch(proceed) {
          var letItPass = this.options.stacking && (method === 'translate' || method === 'generatePoints'),
              enabled = pick((this.chart && this.chart.options && this.chart.options.boost && this.chart.options.boost.enabled), true);
          if (!this.isSeriesBoosting || letItPass || !enabled || this.type === 'heatmap' || this.type === 'treemap' || !boostableMap[this.type]) {
            proceed.call(this);
          } else if (this[method + 'Canvas']) {
            this[method + 'Canvas']();
          }
        }
        wrap(Series.prototype, method, branch);
        if (method === 'translate') {
          each(['column', 'bar', 'arearange', 'columnrange', 'heatmap', 'treemap'], function(type) {
            if (seriesTypes[type]) {
              wrap(seriesTypes[type].prototype, method, branch);
            }
          });
        }
      });
      wrap(Series.prototype, 'processData', function(proceed) {
        var series = this,
            dataToMeasure = this.options.data;
        function getSeriesBoosting(data) {
          return series.chart.isChartSeriesBoosting() || ((data ? data.length : 0) >= (series.options.boostThreshold || Number.MAX_VALUE));
        }
        if (boostableMap[this.type]) {
          if (!getSeriesBoosting(dataToMeasure) || this.type === 'heatmap' || this.type === 'treemap' || this.options.stacking || !this.hasExtremes || !this.hasExtremes(true)) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            dataToMeasure = this.processedXData;
          }
          this.isSeriesBoosting = getSeriesBoosting(dataToMeasure);
          if (this.isSeriesBoosting) {
            this.enterBoost();
          } else if (this.exitBoost) {
            this.exitBoost();
          }
        } else {
          proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
      });
      wrap(Series.prototype, 'setVisible', function(proceed, vis, redraw) {
        proceed.call(this, vis, redraw);
        if (this.visible === false && this.canvas && this.renderTarget) {
          if (this.ogl) {
            this.ogl.clear();
          }
          this.boostClear();
        }
      });
      Series.prototype.enterBoost = function() {
        this.alteredByBoost = [];
        each(['allowDG', 'directTouch', 'stickyTracking'], function(prop) {
          this.alteredByBoost.push({
            prop: prop,
            val: this[prop],
            own: this.hasOwnProperty(prop)
          });
        }, this);
        this.allowDG = false;
        this.directTouch = false;
        this.stickyTracking = true;
        this.animate = null;
        if (this.labelBySeries) {
          this.labelBySeries = this.labelBySeries.destroy();
        }
      };
      Series.prototype.exitBoost = function() {
        each(this.alteredByBoost || [], function(setting) {
          if (setting.own) {
            this[setting.prop] = setting.val;
          } else {
            delete this[setting.prop];
          }
        }, this);
        if (this.boostClear) {
          this.boostClear();
        }
      };
      Series.prototype.hasExtremes = function(checkX) {
        var options = this.options,
            data = options.data,
            xAxis = this.xAxis && this.xAxis.options,
            yAxis = this.yAxis && this.yAxis.options;
        return data.length > (options.boostThreshold || Number.MAX_VALUE) && isNumber(yAxis.min) && isNumber(yAxis.max) && (!checkX || (isNumber(xAxis.min) && isNumber(xAxis.max)));
      };
      Series.prototype.destroyGraphics = function() {
        var series = this,
            points = this.points,
            point,
            i;
        if (points) {
          for (i = 0; i < points.length; i = i + 1) {
            point = points[i];
            if (point && point.destroyElements) {
              point.destroyElements();
            }
          }
        }
        each(['graph', 'area', 'tracker'], function(prop) {
          if (series[prop]) {
            series[prop] = series[prop].destroy();
          }
        });
      };
      H.hasWebGLSupport = function() {
        var i = 0,
            canvas,
            contexts = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'],
            context = false;
        if (typeof win.WebGLRenderingContext !== 'undefined') {
          canvas = doc.createElement('canvas');
          for (; i < contexts.length; i++) {
            try {
              context = canvas.getContext(contexts[i]);
              if (typeof context !== 'undefined' && context !== null) {
                return true;
              }
            } catch (e) {}
          }
        }
        return false;
      };
      function pointDrawHandler(proceed) {
        var enabled = true,
            renderer;
        if (this.chart.options && this.chart.options.boost) {
          enabled = typeof this.chart.options.boost.enabled === 'undefined' ? true : this.chart.options.boost.enabled;
        }
        if (!enabled || !this.isSeriesBoosting) {
          return proceed.call(this);
        }
        this.chart.isBoosting = true;
        renderer = createAndAttachRenderer(this.chart, this);
        if (renderer) {
          allocateIfNotSeriesBoosting(renderer, this);
          renderer.pushSeries(this);
        }
        renderIfNotSeriesBoosting(renderer, this);
      }
      if (!H.hasWebGLSupport()) {
        if (typeof H.initCanvasBoost !== 'undefined') {
          H.initCanvasBoost();
        } else {
          H.error(26);
        }
      } else {
        H.extend(Series.prototype, {renderCanvas: function() {
            var series = this,
                options = series.options || {},
                renderer = false,
                chart = series.chart,
                xAxis = this.xAxis,
                yAxis = this.yAxis,
                xData = options.xData || series.processedXData,
                yData = options.yData || series.processedYData,
                rawData = options.data,
                xExtremes = xAxis.getExtremes(),
                xMin = xExtremes.min,
                xMax = xExtremes.max,
                yExtremes = yAxis.getExtremes(),
                yMin = yExtremes.min,
                yMax = yExtremes.max,
                pointTaken = {},
                lastClientX,
                sampling = !!series.sampling,
                points,
                enableMouseTracking = options.enableMouseTracking !== false,
                threshold = options.threshold,
                yBottom = yAxis.getThreshold(threshold),
                isRange = series.pointArrayMap && series.pointArrayMap.join(',') === 'low,high',
                isStacked = !!options.stacking,
                cropStart = series.cropStart || 0,
                requireSorting = series.requireSorting,
                useRaw = !xData,
                minVal,
                maxVal,
                minI,
                maxI,
                boostOptions,
                xDataFull = this.xData || this.options.xData || this.processedXData || false,
                addKDPoint = function(clientX, plotY, i) {
                  index = clientX + ',' + plotY;
                  if (enableMouseTracking && !pointTaken[index]) {
                    pointTaken[index] = true;
                    if (chart.inverted) {
                      clientX = xAxis.len - clientX;
                      plotY = yAxis.len - plotY;
                    }
                    points.push({
                      x: xDataFull ? xDataFull[cropStart + i] : false,
                      clientX: clientX,
                      plotX: clientX,
                      plotY: plotY,
                      i: cropStart + i
                    });
                  }
                };
            renderer = createAndAttachRenderer(chart, series);
            chart.isBoosting = true;
            boostOptions = renderer.settings;
            if (!this.visible) {
              return;
            }
            if (this.points || this.graph) {
              this.animate = null;
              this.destroyGraphics();
            }
            if (!chart.isChartSeriesBoosting()) {
              this.markerGroup = series.plotGroup('markerGroup', 'markers', true, 1, chart.seriesGroup);
            } else {
              this.markerGroup = chart.markerGroup;
              if (this.renderTarget) {
                this.renderTarget = this.renderTarget.destroy();
              }
            }
            points = this.points = [];
            series.buildKDTree = noop;
            if (renderer) {
              allocateIfNotSeriesBoosting(renderer, this);
              renderer.pushSeries(series);
              renderIfNotSeriesBoosting(renderer, this, chart);
            }
            function processPoint(d, i) {
              var x,
                  y,
                  clientX,
                  plotY,
                  isNull,
                  low = false,
                  chartDestroyed = typeof chart.index === 'undefined',
                  isYInside = true;
              if (!chartDestroyed) {
                if (useRaw) {
                  x = d[0];
                  y = d[1];
                } else {
                  x = d;
                  y = yData[i];
                }
                if (isRange) {
                  if (useRaw) {
                    y = d.slice(1, 3);
                  }
                  low = y[0];
                  y = y[1];
                } else if (isStacked) {
                  x = d.x;
                  y = d.stackY;
                  low = y - d.y;
                }
                isNull = y === null;
                if (!requireSorting) {
                  isYInside = y >= yMin && y <= yMax;
                }
                if (!isNull && x >= xMin && x <= xMax && isYInside) {
                  clientX = Math.ceil(xAxis.toPixels(x, true));
                  if (sampling) {
                    if (minI === undefined || clientX === lastClientX) {
                      if (!isRange) {
                        low = y;
                      }
                      if (maxI === undefined || y > maxVal) {
                        maxVal = y;
                        maxI = i;
                      }
                      if (minI === undefined || low < minVal) {
                        minVal = low;
                        minI = i;
                      }
                    }
                    if (clientX !== lastClientX) {
                      if (minI !== undefined) {
                        plotY = yAxis.toPixels(maxVal, true);
                        yBottom = yAxis.toPixels(minVal, true);
                        addKDPoint(clientX, plotY, maxI);
                        if (yBottom !== plotY) {
                          addKDPoint(clientX, yBottom, minI);
                        }
                      }
                      minI = maxI = undefined;
                      lastClientX = clientX;
                    }
                  } else {
                    plotY = Math.ceil(yAxis.toPixels(y, true));
                    addKDPoint(clientX, plotY, i);
                  }
                }
              }
              return !chartDestroyed;
            }
            function doneProcessing() {
              fireEvent(series, 'renderedCanvas');
              delete series.buildKDTree;
              series.buildKDTree();
              if (boostOptions.debug.timeKDTree) {
                console.timeEnd('kd tree building');
              }
            }
            if (!chart.renderer.forExport) {
              if (boostOptions.debug.timeKDTree) {
                console.time('kd tree building');
              }
              H.eachAsync(isStacked ? series.data : (xData || rawData), processPoint, doneProcessing);
            }
          }});
        each(['heatmap', 'treemap'], function(t) {
          if (seriesTypes[t]) {
            wrap(seriesTypes[t].prototype, 'drawPoints', pointDrawHandler);
          }
        });
        if (seriesTypes.bubble) {
          delete seriesTypes.bubble.prototype.buildKDTree;
          wrap(seriesTypes.bubble.prototype, 'markerAttribs', function(proceed) {
            if (this.isSeriesBoosting) {
              return false;
            }
            return proceed.apply(this, [].slice.call(arguments, 1));
          });
        }
        seriesTypes.scatter.prototype.fill = true;
        extend(seriesTypes.area.prototype, {
          fill: true,
          fillOpacity: true,
          sampling: true
        });
        extend(seriesTypes.column.prototype, {
          fill: true,
          sampling: true
        });
        H.Chart.prototype.callbacks.push(function(chart) {
          function canvasToSVG() {
            if (chart.ogl && chart.isChartSeriesBoosting()) {
              chart.ogl.render(chart);
            }
          }
          function preRender() {
            chart.boostForceChartBoost = undefined;
            chart.boostForceChartBoost = shouldForceChartSeriesBoosting(chart);
            chart.isBoosting = false;
            if (!chart.isChartSeriesBoosting() && chart.didBoost) {
              chart.didBoost = false;
            }
            if (chart.boostClear) {
              chart.boostClear();
            }
            if (chart.canvas && chart.ogl && chart.isChartSeriesBoosting()) {
              chart.didBoost = true;
              chart.ogl.allocateBuffer(chart);
            }
            if (chart.markerGroup && chart.xAxis && chart.xAxis.length > 0 && chart.yAxis && chart.yAxis.length > 0) {
              chart.markerGroup.translate(chart.xAxis[0].pos, chart.yAxis[0].pos);
            }
          }
          addEvent(chart, 'predraw', preRender);
          addEvent(chart, 'render', canvasToSVG);
        });
      }
    }(Highcharts));
  }));
})(require('buffer').Buffer, require('process'));
