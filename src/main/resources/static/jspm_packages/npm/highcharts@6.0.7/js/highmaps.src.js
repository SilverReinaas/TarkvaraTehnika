/* */ 
(function(process) {
  'use strict';
  (function(root, factory) {
    if (typeof module === 'object' && module.exports) {
      module.exports = root.document ? factory(root) : factory;
    } else {
      root.Highcharts = factory(root);
    }
  }(typeof window !== 'undefined' ? window : this, function(win) {
    var Highcharts = (function() {
      var glob = typeof win === 'undefined' ? window : win,
          doc = glob.document,
          SVG_NS = 'http://www.w3.org/2000/svg',
          userAgent = (glob.navigator && glob.navigator.userAgent) || '',
          svg = (doc && doc.createElementNS && !!doc.createElementNS(SVG_NS, 'svg').createSVGRect),
          isMS = /(edge|msie|trident)/i.test(userAgent) && !glob.opera,
          isFirefox = userAgent.indexOf('Firefox') !== -1,
          isChrome = userAgent.indexOf('Chrome') !== -1,
          hasBidiBug = (isFirefox && parseInt(userAgent.split('Firefox/')[1], 10) < 4);
      var Highcharts = glob.Highcharts ? glob.Highcharts.error(16, true) : {
        product: 'Highmaps',
        version: '6.0.7',
        deg2rad: Math.PI * 2 / 360,
        doc: doc,
        hasBidiBug: hasBidiBug,
        hasTouch: doc && doc.documentElement.ontouchstart !== undefined,
        isMS: isMS,
        isWebKit: userAgent.indexOf('AppleWebKit') !== -1,
        isFirefox: isFirefox,
        isChrome: isChrome,
        isSafari: !isChrome && userAgent.indexOf('Safari') !== -1,
        isTouchDevice: /(Mobile|Android|Windows Phone)/.test(userAgent),
        SVG_NS: SVG_NS,
        chartCount: 0,
        seriesTypes: {},
        symbolSizes: {},
        svg: svg,
        win: glob,
        marginNames: ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'],
        noop: function() {
          return undefined;
        },
        charts: []
      };
      return Highcharts;
    }());
    (function(H) {
      H.timers = [];
      var charts = H.charts,
          doc = H.doc,
          win = H.win;
      H.error = function(code, stop) {
        var msg = H.isNumber(code) ? 'Highcharts error #' + code + ': www.highcharts.com/errors/' + code : code;
        if (stop) {
          throw new Error(msg);
        }
        if (win.console) {
          console.log(msg);
        }
      };
      H.Fx = function(elem, options, prop) {
        this.options = options;
        this.elem = elem;
        this.prop = prop;
      };
      H.Fx.prototype = {
        dSetter: function() {
          var start = this.paths[0],
              end = this.paths[1],
              ret = [],
              now = this.now,
              i = start.length,
              startVal;
          if (now === 1) {
            ret = this.toD;
          } else if (i === end.length && now < 1) {
            while (i--) {
              startVal = parseFloat(start[i]);
              ret[i] = isNaN(startVal) ? end[i] : now * (parseFloat(end[i] - startVal)) + startVal;
            }
          } else {
            ret = end;
          }
          this.elem.attr('d', ret, null, true);
        },
        update: function() {
          var elem = this.elem,
              prop = this.prop,
              now = this.now,
              step = this.options.step;
          if (this[prop + 'Setter']) {
            this[prop + 'Setter']();
          } else if (elem.attr) {
            if (elem.element) {
              elem.attr(prop, now, null, true);
            }
          } else {
            elem.style[prop] = now + this.unit;
          }
          if (step) {
            step.call(elem, now, this);
          }
        },
        run: function(from, to, unit) {
          var self = this,
              options = self.options,
              timer = function(gotoEnd) {
                return timer.stopped ? false : self.step(gotoEnd);
              },
              requestAnimationFrame = win.requestAnimationFrame || function(step) {
                setTimeout(step, 13);
              },
              step = function() {
                for (var i = 0; i < H.timers.length; i++) {
                  if (!H.timers[i]()) {
                    H.timers.splice(i--, 1);
                  }
                }
                if (H.timers.length) {
                  requestAnimationFrame(step);
                }
              };
          if (from === to) {
            delete options.curAnim[this.prop];
            if (options.complete && H.keys(options.curAnim).length === 0) {
              options.complete.call(this.elem);
            }
          } else {
            this.startTime = +new Date();
            this.start = from;
            this.end = to;
            this.unit = unit;
            this.now = this.start;
            this.pos = 0;
            timer.elem = this.elem;
            timer.prop = this.prop;
            if (timer() && H.timers.push(timer) === 1) {
              requestAnimationFrame(step);
            }
          }
        },
        step: function(gotoEnd) {
          var t = +new Date(),
              ret,
              done,
              options = this.options,
              elem = this.elem,
              complete = options.complete,
              duration = options.duration,
              curAnim = options.curAnim;
          if (elem.attr && !elem.element) {
            ret = false;
          } else if (gotoEnd || t >= duration + this.startTime) {
            this.now = this.end;
            this.pos = 1;
            this.update();
            curAnim[this.prop] = true;
            done = true;
            H.objectEach(curAnim, function(val) {
              if (val !== true) {
                done = false;
              }
            });
            if (done && complete) {
              complete.call(elem);
            }
            ret = false;
          } else {
            this.pos = options.easing((t - this.startTime) / duration);
            this.now = this.start + ((this.end - this.start) * this.pos);
            this.update();
            ret = true;
          }
          return ret;
        },
        initPath: function(elem, fromD, toD) {
          fromD = fromD || '';
          var shift,
              startX = elem.startX,
              endX = elem.endX,
              bezier = fromD.indexOf('C') > -1,
              numParams = bezier ? 7 : 3,
              fullLength,
              slice,
              i,
              start = fromD.split(' '),
              end = toD.slice(),
              isArea = elem.isArea,
              positionFactor = isArea ? 2 : 1,
              reverse;
          function sixify(arr) {
            var isOperator,
                nextIsOperator;
            i = arr.length;
            while (i--) {
              isOperator = arr[i] === 'M' || arr[i] === 'L';
              nextIsOperator = /[a-zA-Z]/.test(arr[i + 3]);
              if (isOperator && nextIsOperator) {
                arr.splice(i + 1, 0, arr[i + 1], arr[i + 2], arr[i + 1], arr[i + 2]);
              }
            }
          }
          function insertSlice(arr, subArr, index) {
            [].splice.apply(arr, [index, 0].concat(subArr));
          }
          function prepend(arr, other) {
            while (arr.length < fullLength) {
              arr[0] = other[fullLength - arr.length];
              insertSlice(arr, arr.slice(0, numParams), 0);
              if (isArea) {
                insertSlice(arr, arr.slice(arr.length - numParams), arr.length);
                i--;
              }
            }
            arr[0] = 'M';
          }
          function append(arr, other) {
            var i = (fullLength - arr.length) / numParams;
            while (i > 0 && i--) {
              slice = arr.slice().splice((arr.length / positionFactor) - numParams, numParams * positionFactor);
              slice[0] = other[fullLength - numParams - (i * numParams)];
              if (bezier) {
                slice[numParams - 6] = slice[numParams - 2];
                slice[numParams - 5] = slice[numParams - 1];
              }
              insertSlice(arr, slice, arr.length / positionFactor);
              if (isArea) {
                i--;
              }
            }
          }
          if (bezier) {
            sixify(start);
            sixify(end);
          }
          if (startX && endX) {
            for (i = 0; i < startX.length; i++) {
              if (startX[i] === endX[0]) {
                shift = i;
                break;
              } else if (startX[0] === endX[endX.length - startX.length + i]) {
                shift = i;
                reverse = true;
                break;
              }
            }
            if (shift === undefined) {
              start = [];
            }
          }
          if (start.length && H.isNumber(shift)) {
            fullLength = end.length + shift * positionFactor * numParams;
            if (!reverse) {
              prepend(end, start);
              append(start, end);
            } else {
              prepend(start, end);
              append(end, start);
            }
          }
          return [start, end];
        }
      };
      H.Fx.prototype.fillSetter = H.Fx.prototype.strokeSetter = function() {
        this.elem.attr(this.prop, H.color(this.start).tweenTo(H.color(this.end), this.pos), null, true);
      };
      H.merge = function() {
        var i,
            args = arguments,
            len,
            ret = {},
            doCopy = function(copy, original) {
              if (typeof copy !== 'object') {
                copy = {};
              }
              H.objectEach(original, function(value, key) {
                if (H.isObject(value, true) && !H.isClass(value) && !H.isDOMElement(value)) {
                  copy[key] = doCopy(copy[key] || {}, value);
                } else {
                  copy[key] = original[key];
                }
              });
              return copy;
            };
        if (args[0] === true) {
          ret = args[1];
          args = Array.prototype.slice.call(args, 2);
        }
        len = args.length;
        for (i = 0; i < len; i++) {
          ret = doCopy(ret, args[i]);
        }
        return ret;
      };
      H.pInt = function(s, mag) {
        return parseInt(s, mag || 10);
      };
      H.isString = function(s) {
        return typeof s === 'string';
      };
      H.isArray = function(obj) {
        var str = Object.prototype.toString.call(obj);
        return str === '[object Array]' || str === '[object Array Iterator]';
      };
      H.isObject = function(obj, strict) {
        return !!obj && typeof obj === 'object' && (!strict || !H.isArray(obj));
      };
      H.isDOMElement = function(obj) {
        return H.isObject(obj) && typeof obj.nodeType === 'number';
      };
      H.isClass = function(obj) {
        var c = obj && obj.constructor;
        return !!(H.isObject(obj, true) && !H.isDOMElement(obj) && (c && c.name && c.name !== 'Object'));
      };
      H.isNumber = function(n) {
        return typeof n === 'number' && !isNaN(n) && n < Infinity && n > -Infinity;
      };
      H.erase = function(arr, item) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === item) {
            arr.splice(i, 1);
            break;
          }
        }
      };
      H.defined = function(obj) {
        return obj !== undefined && obj !== null;
      };
      H.attr = function(elem, prop, value) {
        var ret;
        if (H.isString(prop)) {
          if (H.defined(value)) {
            elem.setAttribute(prop, value);
          } else if (elem && elem.getAttribute) {
            ret = elem.getAttribute(prop);
          }
        } else if (H.defined(prop) && H.isObject(prop)) {
          H.objectEach(prop, function(val, key) {
            elem.setAttribute(key, val);
          });
        }
        return ret;
      };
      H.splat = function(obj) {
        return H.isArray(obj) ? obj : [obj];
      };
      H.syncTimeout = function(fn, delay, context) {
        if (delay) {
          return setTimeout(fn, delay, context);
        }
        fn.call(0, context);
      };
      H.extend = function(a, b) {
        var n;
        if (!a) {
          a = {};
        }
        for (n in b) {
          a[n] = b[n];
        }
        return a;
      };
      H.pick = function() {
        var args = arguments,
            i,
            arg,
            length = args.length;
        for (i = 0; i < length; i++) {
          arg = args[i];
          if (arg !== undefined && arg !== null) {
            return arg;
          }
        }
      };
      H.css = function(el, styles) {
        if (H.isMS && !H.svg) {
          if (styles && styles.opacity !== undefined) {
            styles.filter = 'alpha(opacity=' + (styles.opacity * 100) + ')';
          }
        }
        H.extend(el.style, styles);
      };
      H.createElement = function(tag, attribs, styles, parent, nopad) {
        var el = doc.createElement(tag),
            css = H.css;
        if (attribs) {
          H.extend(el, attribs);
        }
        if (nopad) {
          css(el, {
            padding: 0,
            border: 'none',
            margin: 0
          });
        }
        if (styles) {
          css(el, styles);
        }
        if (parent) {
          parent.appendChild(el);
        }
        return el;
      };
      H.extendClass = function(parent, members) {
        var object = function() {};
        object.prototype = new parent();
        H.extend(object.prototype, members);
        return object;
      };
      H.pad = function(number, length, padder) {
        return new Array((length || 2) + 1 - String(number).length).join(padder || 0) + number;
      };
      H.relativeLength = function(value, base, offset) {
        return (/%$/).test(value) ? (base * parseFloat(value) / 100) + (offset || 0) : parseFloat(value);
      };
      H.wrap = function(obj, method, func) {
        var proceed = obj[method];
        obj[method] = function() {
          var args = Array.prototype.slice.call(arguments),
              outerArgs = arguments,
              ctx = this,
              ret;
          ctx.proceed = function() {
            proceed.apply(ctx, arguments.length ? arguments : outerArgs);
          };
          args.unshift(proceed);
          ret = func.apply(this, args);
          ctx.proceed = null;
          return ret;
        };
      };
      H.formatSingle = function(format, val, time) {
        var floatRegex = /f$/,
            decRegex = /\.([0-9])/,
            lang = H.defaultOptions.lang,
            decimals;
        if (floatRegex.test(format)) {
          decimals = format.match(decRegex);
          decimals = decimals ? decimals[1] : -1;
          if (val !== null) {
            val = H.numberFormat(val, decimals, lang.decimalPoint, format.indexOf(',') > -1 ? lang.thousandsSep : '');
          }
        } else {
          val = (time || H.time).dateFormat(format, val);
        }
        return val;
      };
      H.format = function(str, ctx, time) {
        var splitter = '{',
            isInside = false,
            segment,
            valueAndFormat,
            path,
            i,
            len,
            ret = [],
            val,
            index;
        while (str) {
          index = str.indexOf(splitter);
          if (index === -1) {
            break;
          }
          segment = str.slice(0, index);
          if (isInside) {
            valueAndFormat = segment.split(':');
            path = valueAndFormat.shift().split('.');
            len = path.length;
            val = ctx;
            for (i = 0; i < len; i++) {
              if (val) {
                val = val[path[i]];
              }
            }
            if (valueAndFormat.length) {
              val = H.formatSingle(valueAndFormat.join(':'), val, time);
            }
            ret.push(val);
          } else {
            ret.push(segment);
          }
          str = str.slice(index + 1);
          isInside = !isInside;
          splitter = isInside ? '}' : '{';
        }
        ret.push(str);
        return ret.join('');
      };
      H.getMagnitude = function(num) {
        return Math.pow(10, Math.floor(Math.log(num) / Math.LN10));
      };
      H.normalizeTickInterval = function(interval, multiples, magnitude, allowDecimals, hasTickAmount) {
        var normalized,
            i,
            retInterval = interval;
        magnitude = H.pick(magnitude, 1);
        normalized = interval / magnitude;
        if (!multiples) {
          multiples = hasTickAmount ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10];
          if (allowDecimals === false) {
            if (magnitude === 1) {
              multiples = H.grep(multiples, function(num) {
                return num % 1 === 0;
              });
            } else if (magnitude <= 0.1) {
              multiples = [1 / magnitude];
            }
          }
        }
        for (i = 0; i < multiples.length; i++) {
          retInterval = multiples[i];
          if ((hasTickAmount && retInterval * magnitude >= interval) || (!hasTickAmount && (normalized <= (multiples[i] + (multiples[i + 1] || multiples[i])) / 2))) {
            break;
          }
        }
        retInterval = H.correctFloat(retInterval * magnitude, -Math.round(Math.log(0.001) / Math.LN10));
        return retInterval;
      };
      H.stableSort = function(arr, sortFunction) {
        var length = arr.length,
            sortValue,
            i;
        for (i = 0; i < length; i++) {
          arr[i].safeI = i;
        }
        arr.sort(function(a, b) {
          sortValue = sortFunction(a, b);
          return sortValue === 0 ? a.safeI - b.safeI : sortValue;
        });
        for (i = 0; i < length; i++) {
          delete arr[i].safeI;
        }
      };
      H.arrayMin = function(data) {
        var i = data.length,
            min = data[0];
        while (i--) {
          if (data[i] < min) {
            min = data[i];
          }
        }
        return min;
      };
      H.arrayMax = function(data) {
        var i = data.length,
            max = data[0];
        while (i--) {
          if (data[i] > max) {
            max = data[i];
          }
        }
        return max;
      };
      H.destroyObjectProperties = function(obj, except) {
        H.objectEach(obj, function(val, n) {
          if (val && val !== except && val.destroy) {
            val.destroy();
          }
          delete obj[n];
        });
      };
      H.discardElement = function(element) {
        var garbageBin = H.garbageBin;
        if (!garbageBin) {
          garbageBin = H.createElement('div');
        }
        if (element) {
          garbageBin.appendChild(element);
        }
        garbageBin.innerHTML = '';
      };
      H.correctFloat = function(num, prec) {
        return parseFloat(num.toPrecision(prec || 14));
      };
      H.setAnimation = function(animation, chart) {
        chart.renderer.globalAnimation = H.pick(animation, chart.options.chart.animation, true);
      };
      H.animObject = function(animation) {
        return H.isObject(animation) ? H.merge(animation) : {duration: animation ? 500 : 0};
      };
      H.timeUnits = {
        millisecond: 1,
        second: 1000,
        minute: 60000,
        hour: 3600000,
        day: 24 * 3600000,
        week: 7 * 24 * 3600000,
        month: 28 * 24 * 3600000,
        year: 364 * 24 * 3600000
      };
      H.numberFormat = function(number, decimals, decimalPoint, thousandsSep) {
        number = +number || 0;
        decimals = +decimals;
        var lang = H.defaultOptions.lang,
            origDec = (number.toString().split('.')[1] || '').split('e')[0].length,
            strinteger,
            thousands,
            ret,
            roundedNumber,
            exponent = number.toString().split('e'),
            fractionDigits;
        if (decimals === -1) {
          decimals = Math.min(origDec, 20);
        } else if (!H.isNumber(decimals)) {
          decimals = 2;
        } else if (decimals && exponent[1] && exponent[1] < 0) {
          fractionDigits = decimals + +exponent[1];
          if (fractionDigits >= 0) {
            exponent[0] = (+exponent[0]).toExponential(fractionDigits).split('e')[0];
            decimals = fractionDigits;
          } else {
            exponent[0] = exponent[0].split('.')[0] || 0;
            if (decimals < 20) {
              number = (exponent[0] * Math.pow(10, exponent[1])).toFixed(decimals);
            } else {
              number = 0;
            }
            exponent[1] = 0;
          }
        }
        roundedNumber = (Math.abs(exponent[1] ? exponent[0] : number) + Math.pow(10, -Math.max(decimals, origDec) - 1)).toFixed(decimals);
        strinteger = String(H.pInt(roundedNumber));
        thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;
        decimalPoint = H.pick(decimalPoint, lang.decimalPoint);
        thousandsSep = H.pick(thousandsSep, lang.thousandsSep);
        ret = number < 0 ? '-' : '';
        ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';
        ret += strinteger.substr(thousands).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);
        if (decimals) {
          ret += decimalPoint + roundedNumber.slice(-decimals);
        }
        if (exponent[1] && +ret !== 0) {
          ret += 'e' + exponent[1];
        }
        return ret;
      };
      Math.easeInOutSine = function(pos) {
        return -0.5 * (Math.cos(Math.PI * pos) - 1);
      };
      H.getStyle = function(el, prop, toInt) {
        var style;
        if (prop === 'width') {
          return Math.min(el.offsetWidth, el.scrollWidth) - H.getStyle(el, 'padding-left') - H.getStyle(el, 'padding-right');
        } else if (prop === 'height') {
          return Math.min(el.offsetHeight, el.scrollHeight) - H.getStyle(el, 'padding-top') - H.getStyle(el, 'padding-bottom');
        }
        if (!win.getComputedStyle) {
          H.error(27, true);
        }
        style = win.getComputedStyle(el, undefined);
        if (style) {
          style = style.getPropertyValue(prop);
          if (H.pick(toInt, prop !== 'opacity')) {
            style = H.pInt(style);
          }
        }
        return style;
      };
      H.inArray = function(item, arr) {
        return (H.indexOfPolyfill || Array.prototype.indexOf).call(arr, item);
      };
      H.grep = function(arr, callback) {
        return (H.filterPolyfill || Array.prototype.filter).call(arr, callback);
      };
      H.find = Array.prototype.find ? function(arr, callback) {
        return arr.find(callback);
      } : function(arr, fn) {
        var i,
            length = arr.length;
        for (i = 0; i < length; i++) {
          if (fn(arr[i], i)) {
            return arr[i];
          }
        }
      };
      H.map = function(arr, fn) {
        var results = [],
            i = 0,
            len = arr.length;
        for (; i < len; i++) {
          results[i] = fn.call(arr[i], arr[i], i, arr);
        }
        return results;
      };
      H.keys = function(obj) {
        return (H.keysPolyfill || Object.keys).call(undefined, obj);
      };
      H.reduce = function(arr, func, initialValue) {
        return (H.reducePolyfill || Array.prototype.reduce).call(arr, func, initialValue);
      };
      H.offset = function(el) {
        var docElem = doc.documentElement,
            box = el.parentElement ? el.getBoundingClientRect() : {
              top: 0,
              left: 0
            };
        return {
          top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
          left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
        };
      };
      H.stop = function(el, prop) {
        var i = H.timers.length;
        while (i--) {
          if (H.timers[i].elem === el && (!prop || prop === H.timers[i].prop)) {
            H.timers[i].stopped = true;
          }
        }
      };
      H.each = function(arr, fn, ctx) {
        return (H.forEachPolyfill || Array.prototype.forEach).call(arr, fn, ctx);
      };
      H.objectEach = function(obj, fn, ctx) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            fn.call(ctx, obj[key], key, obj);
          }
        }
      };
      H.isPrototype = function(obj) {
        return (obj === H.Axis.prototype || obj === H.Chart.prototype || obj === H.Point.prototype || obj === H.Series.prototype || obj === H.Tick.prototype);
      };
      H.addEvent = function(el, type, fn) {
        var events,
            collectionName,
            addEventListener = el.addEventListener || H.addEventListenerPolyfill;
        collectionName = H.isPrototype(el) ? 'protoEvents' : 'hcEvents';
        events = el[collectionName] = el[collectionName] || {};
        if (addEventListener) {
          addEventListener.call(el, type, fn, false);
        }
        if (!events[type]) {
          events[type] = [];
        }
        events[type].push(fn);
        return function() {
          H.removeEvent(el, type, fn);
        };
      };
      H.removeEvent = function(el, type, fn) {
        var events,
            index;
        function removeOneEvent(type, fn) {
          var removeEventListener = el.removeEventListener || H.removeEventListenerPolyfill;
          if (removeEventListener) {
            removeEventListener.call(el, type, fn, false);
          }
        }
        function removeAllEvents(eventCollection) {
          var types,
              len;
          if (!el.nodeName) {
            return;
          }
          if (type) {
            types = {};
            types[type] = true;
          } else {
            types = eventCollection;
          }
          H.objectEach(types, function(val, n) {
            if (eventCollection[n]) {
              len = eventCollection[n].length;
              while (len--) {
                removeOneEvent(n, eventCollection[n][len]);
              }
            }
          });
        }
        H.each(['protoEvents', 'hcEvents'], function(coll) {
          var eventCollection = el[coll];
          if (eventCollection) {
            if (type) {
              events = eventCollection[type] || [];
              if (fn) {
                index = H.inArray(fn, events);
                if (index > -1) {
                  events.splice(index, 1);
                  eventCollection[type] = events;
                }
                removeOneEvent(type, fn);
              } else {
                removeAllEvents(eventCollection);
                eventCollection[type] = [];
              }
            } else {
              removeAllEvents(eventCollection);
              el[coll] = {};
            }
          }
        });
      };
      H.fireEvent = function(el, type, eventArguments, defaultFunction) {
        var e,
            events,
            len,
            i,
            fn;
        eventArguments = eventArguments || {};
        if (doc.createEvent && (el.dispatchEvent || el.fireEvent)) {
          e = doc.createEvent('Events');
          e.initEvent(type, true, true);
          H.extend(e, eventArguments);
          if (el.dispatchEvent) {
            el.dispatchEvent(e);
          } else {
            el.fireEvent(type, e);
          }
        } else {
          H.each(['protoEvents', 'hcEvents'], function(coll) {
            if (el[coll]) {
              events = el[coll][type] || [];
              len = events.length;
              if (!eventArguments.target) {
                H.extend(eventArguments, {
                  preventDefault: function() {
                    eventArguments.defaultPrevented = true;
                  },
                  target: el,
                  type: type
                });
              }
              for (i = 0; i < len; i++) {
                fn = events[i];
                if (fn && fn.call(el, eventArguments) === false) {
                  eventArguments.preventDefault();
                }
              }
            }
          });
        }
        if (defaultFunction && !eventArguments.defaultPrevented) {
          defaultFunction(eventArguments);
        }
      };
      H.animate = function(el, params, opt) {
        var start,
            unit = '',
            end,
            fx,
            args;
        if (!H.isObject(opt)) {
          args = arguments;
          opt = {
            duration: args[2],
            easing: args[3],
            complete: args[4]
          };
        }
        if (!H.isNumber(opt.duration)) {
          opt.duration = 400;
        }
        opt.easing = typeof opt.easing === 'function' ? opt.easing : (Math[opt.easing] || Math.easeInOutSine);
        opt.curAnim = H.merge(params);
        H.objectEach(params, function(val, prop) {
          H.stop(el, prop);
          fx = new H.Fx(el, opt, prop);
          end = null;
          if (prop === 'd') {
            fx.paths = fx.initPath(el, el.d, params.d);
            fx.toD = params.d;
            start = 0;
            end = 1;
          } else if (el.attr) {
            start = el.attr(prop);
          } else {
            start = parseFloat(H.getStyle(el, prop)) || 0;
            if (prop !== 'opacity') {
              unit = 'px';
            }
          }
          if (!end) {
            end = val;
          }
          if (end && end.match && end.match('px')) {
            end = end.replace(/px/g, '');
          }
          fx.run(start, end, unit);
        });
      };
      H.seriesType = function(type, parent, options, props, pointProps) {
        var defaultOptions = H.getOptions(),
            seriesTypes = H.seriesTypes;
        defaultOptions.plotOptions[type] = H.merge(defaultOptions.plotOptions[parent], options);
        seriesTypes[type] = H.extendClass(seriesTypes[parent] || function() {}, props);
        seriesTypes[type].prototype.type = type;
        if (pointProps) {
          seriesTypes[type].prototype.pointClass = H.extendClass(H.Point, pointProps);
        }
        return seriesTypes[type];
      };
      H.uniqueKey = (function() {
        var uniqueKeyHash = Math.random().toString(36).substring(2, 9),
            idCounter = 0;
        return function() {
          return 'highcharts-' + uniqueKeyHash + '-' + idCounter++;
        };
      }());
      if (win.jQuery) {
        win.jQuery.fn.highcharts = function() {
          var args = [].slice.call(arguments);
          if (this[0]) {
            if (args[0]) {
              new H[H.isString(args[0]) ? args.shift() : 'Chart'](this[0], args[0], args[1]);
              return this;
            }
            return charts[H.attr(this[0], 'data-highcharts-chart')];
          }
        };
      }
    }(Highcharts));
    (function(H) {
      var each = H.each,
          isNumber = H.isNumber,
          map = H.map,
          merge = H.merge,
          pInt = H.pInt;
      H.Color = function(input) {
        if (!(this instanceof H.Color)) {
          return new H.Color(input);
        }
        this.init(input);
      };
      H.Color.prototype = {
        parsers: [{
          regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
          parse: function(result) {
            return [pInt(result[1]), pInt(result[2]), pInt(result[3]), parseFloat(result[4], 10)];
          }
        }, {
          regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
          parse: function(result) {
            return [pInt(result[1]), pInt(result[2]), pInt(result[3]), 1];
          }
        }],
        names: {
          none: 'rgba(255,255,255,0)',
          white: '#ffffff',
          black: '#000000'
        },
        init: function(input) {
          var result,
              rgba,
              i,
              parser,
              len;
          this.input = input = this.names[input && input.toLowerCase ? input.toLowerCase() : ''] || input;
          if (input && input.stops) {
            this.stops = map(input.stops, function(stop) {
              return new H.Color(stop[1]);
            });
          } else {
            if (input && input.charAt && input.charAt() === '#') {
              len = input.length;
              input = parseInt(input.substr(1), 16);
              if (len === 7) {
                rgba = [(input & 0xFF0000) >> 16, (input & 0xFF00) >> 8, (input & 0xFF), 1];
              } else if (len === 4) {
                rgba = [((input & 0xF00) >> 4) | (input & 0xF00) >> 8, ((input & 0xF0) >> 4) | (input & 0xF0), ((input & 0xF) << 4) | (input & 0xF), 1];
              }
            }
            if (!rgba) {
              i = this.parsers.length;
              while (i-- && !rgba) {
                parser = this.parsers[i];
                result = parser.regex.exec(input);
                if (result) {
                  rgba = parser.parse(result);
                }
              }
            }
          }
          this.rgba = rgba || [];
        },
        get: function(format) {
          var input = this.input,
              rgba = this.rgba,
              ret;
          if (this.stops) {
            ret = merge(input);
            ret.stops = [].concat(ret.stops);
            each(this.stops, function(stop, i) {
              ret.stops[i] = [ret.stops[i][0], stop.get(format)];
            });
          } else if (rgba && isNumber(rgba[0])) {
            if (format === 'rgb' || (!format && rgba[3] === 1)) {
              ret = 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
            } else if (format === 'a') {
              ret = rgba[3];
            } else {
              ret = 'rgba(' + rgba.join(',') + ')';
            }
          } else {
            ret = input;
          }
          return ret;
        },
        brighten: function(alpha) {
          var i,
              rgba = this.rgba;
          if (this.stops) {
            each(this.stops, function(stop) {
              stop.brighten(alpha);
            });
          } else if (isNumber(alpha) && alpha !== 0) {
            for (i = 0; i < 3; i++) {
              rgba[i] += pInt(alpha * 255);
              if (rgba[i] < 0) {
                rgba[i] = 0;
              }
              if (rgba[i] > 255) {
                rgba[i] = 255;
              }
            }
          }
          return this;
        },
        setOpacity: function(alpha) {
          this.rgba[3] = alpha;
          return this;
        },
        tweenTo: function(to, pos) {
          var fromRgba = this.rgba,
              toRgba = to.rgba,
              hasAlpha,
              ret;
          if (!toRgba.length || !fromRgba || !fromRgba.length) {
            ret = to.input || 'none';
          } else {
            hasAlpha = (toRgba[3] !== 1 || fromRgba[3] !== 1);
            ret = (hasAlpha ? 'rgba(' : 'rgb(') + Math.round(toRgba[0] + (fromRgba[0] - toRgba[0]) * (1 - pos)) + ',' + Math.round(toRgba[1] + (fromRgba[1] - toRgba[1]) * (1 - pos)) + ',' + Math.round(toRgba[2] + (fromRgba[2] - toRgba[2]) * (1 - pos)) + (hasAlpha ? (',' + (toRgba[3] + (fromRgba[3] - toRgba[3]) * (1 - pos))) : '') + ')';
          }
          return ret;
        }
      };
      H.color = function(input) {
        return new H.Color(input);
      };
    }(Highcharts));
    (function(Highcharts) {
      var H = Highcharts,
          defined = H.defined,
          each = H.each,
          extend = H.extend,
          merge = H.merge,
          pick = H.pick,
          timeUnits = H.timeUnits,
          win = H.win;
      Highcharts.Time = function(options) {
        this.update(options, false);
      };
      Highcharts.Time.prototype = {
        defaultOptions: {},
        update: function(options) {
          var useUTC = pick(options && options.useUTC, true),
              time = this;
          this.options = options = merge(true, this.options || {}, options);
          this.Date = options.Date || win.Date;
          this.useUTC = useUTC;
          this.timezoneOffset = useUTC && options.timezoneOffset;
          this.getTimezoneOffset = this.timezoneOffsetFunction();
          this.variableTimezone = !!(!useUTC || options.getTimezoneOffset || options.timezone);
          if (this.variableTimezone || this.timezoneOffset) {
            this.get = function(unit, date) {
              var realMs = date.getTime(),
                  ms = realMs - time.getTimezoneOffset(date),
                  ret;
              date.setTime(ms);
              ret = date['getUTC' + unit]();
              date.setTime(realMs);
              return ret;
            };
            this.set = function(unit, date, value) {
              var ms,
                  offset,
                  newOffset;
              if (H.inArray(unit, ['Milliseconds', 'Seconds', 'Minutes']) !== -1) {
                date['set' + unit](value);
              } else {
                offset = time.getTimezoneOffset(date);
                ms = date.getTime() - offset;
                date.setTime(ms);
                date['setUTC' + unit](value);
                newOffset = time.getTimezoneOffset(date);
                ms = date.getTime() + newOffset;
                date.setTime(ms);
              }
            };
          } else if (useUTC) {
            this.get = function(unit, date) {
              return date['getUTC' + unit]();
            };
            this.set = function(unit, date, value) {
              return date['setUTC' + unit](value);
            };
          } else {
            this.get = function(unit, date) {
              return date['get' + unit]();
            };
            this.set = function(unit, date, value) {
              return date['set' + unit](value);
            };
          }
        },
        makeTime: function(year, month, date, hours, minutes, seconds) {
          var d,
              offset,
              newOffset;
          if (this.useUTC) {
            d = this.Date.UTC.apply(0, arguments);
            offset = this.getTimezoneOffset(d);
            d += offset;
            newOffset = this.getTimezoneOffset(d);
            if (offset !== newOffset) {
              d += newOffset - offset;
            } else if (offset - 36e5 === this.getTimezoneOffset(d - 36e5) && !H.isSafari) {
              d -= 36e5;
            }
          } else {
            d = new this.Date(year, month, pick(date, 1), pick(hours, 0), pick(minutes, 0), pick(seconds, 0)).getTime();
          }
          return d;
        },
        timezoneOffsetFunction: function() {
          var time = this,
              options = this.options,
              moment = win.moment;
          if (!this.useUTC) {
            return function(timestamp) {
              return new Date(timestamp).getTimezoneOffset() * 60000;
            };
          }
          if (options.timezone) {
            if (!moment) {
              H.error(25);
            } else {
              return function(timestamp) {
                return -moment.tz(timestamp, options.timezone).utcOffset() * 60000;
              };
            }
          }
          if (this.useUTC && options.getTimezoneOffset) {
            return function(timestamp) {
              return options.getTimezoneOffset(timestamp) * 60000;
            };
          }
          return function() {
            return (time.timezoneOffset || 0) * 60000;
          };
        },
        dateFormat: function(format, timestamp, capitalize) {
          if (!H.defined(timestamp) || isNaN(timestamp)) {
            return H.defaultOptions.lang.invalidDate || '';
          }
          format = H.pick(format, '%Y-%m-%d %H:%M:%S');
          var time = this,
              date = new this.Date(timestamp),
              hours = this.get('Hours', date),
              day = this.get('Day', date),
              dayOfMonth = this.get('Date', date),
              month = this.get('Month', date),
              fullYear = this.get('FullYear', date),
              lang = H.defaultOptions.lang,
              langWeekdays = lang.weekdays,
              shortWeekdays = lang.shortWeekdays,
              pad = H.pad,
              replacements = H.extend({
                'a': shortWeekdays ? shortWeekdays[day] : langWeekdays[day].substr(0, 3),
                'A': langWeekdays[day],
                'd': pad(dayOfMonth),
                'e': pad(dayOfMonth, 2, ' '),
                'w': day,
                'b': lang.shortMonths[month],
                'B': lang.months[month],
                'm': pad(month + 1),
                'y': fullYear.toString().substr(2, 2),
                'Y': fullYear,
                'H': pad(hours),
                'k': hours,
                'I': pad((hours % 12) || 12),
                'l': (hours % 12) || 12,
                'M': pad(time.get('Minutes', date)),
                'p': hours < 12 ? 'AM' : 'PM',
                'P': hours < 12 ? 'am' : 'pm',
                'S': pad(date.getSeconds()),
                'L': pad(Math.round(timestamp % 1000), 3)
              }, H.dateFormats);
          H.objectEach(replacements, function(val, key) {
            while (format.indexOf('%' + key) !== -1) {
              format = format.replace('%' + key, typeof val === 'function' ? val.call(time, timestamp) : val);
            }
          });
          return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
        },
        getTimeTicks: function(normalizedInterval, min, max, startOfWeek) {
          var time = this,
              Date = time.Date,
              tickPositions = [],
              i,
              higherRanks = {},
              minYear,
              minDate = new Date(min),
              interval = normalizedInterval.unitRange,
              count = normalizedInterval.count || 1,
              variableDayLength;
          if (defined(min)) {
            time.set('Milliseconds', minDate, interval >= timeUnits.second ? 0 : count * Math.floor(time.get('Milliseconds', minDate) / count));
            if (interval >= timeUnits.second) {
              time.set('Seconds', minDate, interval >= timeUnits.minute ? 0 : count * Math.floor(time.get('Seconds', minDate) / count));
            }
            if (interval >= timeUnits.minute) {
              time.set('Minutes', minDate, interval >= timeUnits.hour ? 0 : count * Math.floor(time.get('Minutes', minDate) / count));
            }
            if (interval >= timeUnits.hour) {
              time.set('Hours', minDate, interval >= timeUnits.day ? 0 : count * Math.floor(time.get('Hours', minDate) / count));
            }
            if (interval >= timeUnits.day) {
              time.set('Date', minDate, interval >= timeUnits.month ? 1 : count * Math.floor(time.get('Date', minDate) / count));
            }
            if (interval >= timeUnits.month) {
              time.set('Month', minDate, interval >= timeUnits.year ? 0 : count * Math.floor(time.get('Month', minDate) / count));
              minYear = time.get('FullYear', minDate);
            }
            if (interval >= timeUnits.year) {
              minYear -= minYear % count;
              time.set('FullYear', minDate, minYear);
            }
            if (interval === timeUnits.week) {
              time.set('Date', minDate, (time.get('Date', minDate) - time.get('Day', minDate) + pick(startOfWeek, 1)));
            }
            minYear = time.get('FullYear', minDate);
            var minMonth = time.get('Month', minDate),
                minDateDate = time.get('Date', minDate),
                minHours = time.get('Hours', minDate);
            min = minDate.getTime();
            if (time.variableTimezone) {
              variableDayLength = (max - min > 4 * timeUnits.month || time.getTimezoneOffset(min) !== time.getTimezoneOffset(max));
            }
            var t = minDate.getTime();
            i = 1;
            while (t < max) {
              tickPositions.push(t);
              if (interval === timeUnits.year) {
                t = time.makeTime(minYear + i * count, 0);
              } else if (interval === timeUnits.month) {
                t = time.makeTime(minYear, minMonth + i * count);
              } else if (variableDayLength && (interval === timeUnits.day || interval === timeUnits.week)) {
                t = time.makeTime(minYear, minMonth, minDateDate + i * count * (interval === timeUnits.day ? 1 : 7));
              } else if (variableDayLength && interval === timeUnits.hour && count > 1) {
                t = time.makeTime(minYear, minMonth, minDateDate, minHours + i * count);
              } else {
                t += interval * count;
              }
              i++;
            }
            tickPositions.push(t);
            if (interval <= timeUnits.hour && tickPositions.length < 10000) {
              each(tickPositions, function(t) {
                if (t % 1800000 === 0 && time.dateFormat('%H%M%S%L', t) === '000000000') {
                  higherRanks[t] = 'day';
                }
              });
            }
          }
          tickPositions.info = extend(normalizedInterval, {
            higherRanks: higherRanks,
            totalRange: interval * count
          });
          return tickPositions;
        }
      };
    }(Highcharts));
    (function(H) {
      var color = H.color,
          isTouchDevice = H.isTouchDevice,
          merge = H.merge,
          svg = H.svg;
      H.defaultOptions = {
        symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
        lang: {
          loading: 'Loading...',
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          decimalPoint: '.',
          numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],
          resetZoom: 'Reset zoom',
          resetZoomTitle: 'Reset zoom level 1:1',
          thousandsSep: ' '
        },
        global: {},
        time: H.Time.prototype.defaultOptions,
        chart: {
          borderRadius: 0,
          colorCount: 10,
          defaultSeriesType: 'line',
          ignoreHiddenSeries: true,
          spacing: [10, 10, 15, 10],
          resetZoomButton: {
            theme: {zIndex: 6},
            position: {
              align: 'right',
              x: -10,
              y: 10
            }
          },
          width: null,
          height: null
        },
        title: {
          text: 'Chart title',
          align: 'center',
          margin: 15,
          widthAdjust: -44
        },
        subtitle: {
          text: '',
          align: 'center',
          widthAdjust: -44
        },
        plotOptions: {},
        labels: {style: {
            position: 'absolute',
            color: '#333333'
          }},
        legend: {
          enabled: true,
          align: 'center',
          layout: 'horizontal',
          labelFormatter: function() {
            return this.name;
          },
          borderColor: '#999999',
          borderRadius: 0,
          navigation: {},
          itemCheckboxStyle: {
            position: 'absolute',
            width: '13px',
            height: '13px'
          },
          squareSymbol: true,
          symbolPadding: 5,
          verticalAlign: 'bottom',
          x: 0,
          y: 0,
          title: {}
        },
        loading: {},
        tooltip: {
          enabled: true,
          animation: svg,
          borderRadius: 3,
          dateTimeLabelFormats: {
            millisecond: '%A, %b %e, %H:%M:%S.%L',
            second: '%A, %b %e, %H:%M:%S',
            minute: '%A, %b %e, %H:%M',
            hour: '%A, %b %e, %H:%M',
            day: '%A, %b %e, %Y',
            week: 'Week from %A, %b %e, %Y',
            month: '%B %Y',
            year: '%Y'
          },
          footerFormat: '',
          padding: 8,
          snap: isTouchDevice ? 25 : 10,
          headerFormat: '<span class="highcharts-header">{point.key}</span><br/>',
          pointFormat: '<span class="highcharts-color-{point.colorIndex}">' + '\u25CF</span> {series.name}: <span class="highcharts-strong">' + '{point.y}</span><br/>'
        },
        credits: {
          enabled: true,
          href: 'http://www.highcharts.com',
          position: {
            align: 'right',
            x: -10,
            verticalAlign: 'bottom',
            y: -5
          },
          text: 'Highcharts.com'
        }
      };
      H.setOptions = function(options) {
        H.defaultOptions = merge(true, H.defaultOptions, options);
        H.time.update(merge(H.defaultOptions.global, H.defaultOptions.time), false);
        return H.defaultOptions;
      };
      H.getOptions = function() {
        return H.defaultOptions;
      };
      H.defaultPlotOptions = H.defaultOptions.plotOptions;
      H.time = new H.Time(merge(H.defaultOptions.global, H.defaultOptions.time));
      H.dateFormat = function(format, timestamp, capitalize) {
        return H.time.dateFormat(format, timestamp, capitalize);
      };
    }(Highcharts));
    (function(H) {
      var SVGElement,
          SVGRenderer,
          addEvent = H.addEvent,
          animate = H.animate,
          attr = H.attr,
          charts = H.charts,
          color = H.color,
          css = H.css,
          createElement = H.createElement,
          defined = H.defined,
          deg2rad = H.deg2rad,
          destroyObjectProperties = H.destroyObjectProperties,
          doc = H.doc,
          each = H.each,
          extend = H.extend,
          erase = H.erase,
          grep = H.grep,
          hasTouch = H.hasTouch,
          inArray = H.inArray,
          isArray = H.isArray,
          isFirefox = H.isFirefox,
          isMS = H.isMS,
          isObject = H.isObject,
          isString = H.isString,
          isWebKit = H.isWebKit,
          merge = H.merge,
          noop = H.noop,
          objectEach = H.objectEach,
          pick = H.pick,
          pInt = H.pInt,
          removeEvent = H.removeEvent,
          splat = H.splat,
          stop = H.stop,
          svg = H.svg,
          SVG_NS = H.SVG_NS,
          symbolSizes = H.symbolSizes,
          win = H.win;
      SVGElement = H.SVGElement = function() {
        return this;
      };
      extend(SVGElement.prototype, {
        opacity: 1,
        SVG_NS: SVG_NS,
        textProps: ['direction', 'fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'color', 'lineHeight', 'width', 'textAlign', 'textDecoration', 'textOverflow', 'textOutline'],
        init: function(renderer, nodeName) {
          this.element = nodeName === 'span' ? createElement(nodeName) : doc.createElementNS(this.SVG_NS, nodeName);
          this.renderer = renderer;
        },
        animate: function(params, options, complete) {
          var animOptions = H.animObject(pick(options, this.renderer.globalAnimation, true));
          if (animOptions.duration !== 0) {
            if (complete) {
              animOptions.complete = complete;
            }
            animate(this, params, animOptions);
          } else {
            this.attr(params, null, complete);
            if (animOptions.step) {
              animOptions.step.call(this);
            }
          }
          return this;
        },
        colorGradient: function(color, prop, elem) {
          var renderer = this.renderer,
              colorObject,
              gradName,
              gradAttr,
              radAttr,
              gradients,
              gradientObject,
              stops,
              stopColor,
              stopOpacity,
              radialReference,
              id,
              key = [],
              value;
          if (color.radialGradient) {
            gradName = 'radialGradient';
          } else if (color.linearGradient) {
            gradName = 'linearGradient';
          }
          if (gradName) {
            gradAttr = color[gradName];
            gradients = renderer.gradients;
            stops = color.stops;
            radialReference = elem.radialReference;
            if (isArray(gradAttr)) {
              color[gradName] = gradAttr = {
                x1: gradAttr[0],
                y1: gradAttr[1],
                x2: gradAttr[2],
                y2: gradAttr[3],
                gradientUnits: 'userSpaceOnUse'
              };
            }
            if (gradName === 'radialGradient' && radialReference && !defined(gradAttr.gradientUnits)) {
              radAttr = gradAttr;
              gradAttr = merge(gradAttr, renderer.getRadialAttr(radialReference, radAttr), {gradientUnits: 'userSpaceOnUse'});
            }
            objectEach(gradAttr, function(val, n) {
              if (n !== 'id') {
                key.push(n, val);
              }
            });
            objectEach(stops, function(val) {
              key.push(val);
            });
            key = key.join(',');
            if (gradients[key]) {
              id = gradients[key].attr('id');
            } else {
              gradAttr.id = id = H.uniqueKey();
              gradients[key] = gradientObject = renderer.createElement(gradName).attr(gradAttr).add(renderer.defs);
              gradientObject.radAttr = radAttr;
              gradientObject.stops = [];
              each(stops, function(stop) {
                var stopObject;
                if (stop[1].indexOf('rgba') === 0) {
                  colorObject = H.color(stop[1]);
                  stopColor = colorObject.get('rgb');
                  stopOpacity = colorObject.get('a');
                } else {
                  stopColor = stop[1];
                  stopOpacity = 1;
                }
                stopObject = renderer.createElement('stop').attr({
                  offset: stop[0],
                  'stop-color': stopColor,
                  'stop-opacity': stopOpacity
                }).add(gradientObject);
                gradientObject.stops.push(stopObject);
              });
            }
            value = 'url(' + renderer.url + '#' + id + ')';
            elem.setAttribute(prop, value);
            elem.gradient = key;
            color.toString = function() {
              return value;
            };
          }
        },
        applyTextOutline: function(textOutline) {
          var elem = this.element,
              tspans,
              tspan,
              hasContrast = textOutline.indexOf('contrast') !== -1,
              styles = {},
              color,
              strokeWidth,
              firstRealChild,
              i;
          if (hasContrast) {
            styles.textOutline = textOutline = textOutline.replace(/contrast/g, this.renderer.getContrast(elem.style.fill));
          }
          textOutline = textOutline.split(' ');
          color = textOutline[textOutline.length - 1];
          strokeWidth = textOutline[0];
          if (strokeWidth && strokeWidth !== 'none' && H.svg) {
            this.fakeTS = true;
            tspans = [].slice.call(elem.getElementsByTagName('tspan'));
            this.ySetter = this.xSetter;
            strokeWidth = strokeWidth.replace(/(^[\d\.]+)(.*?)$/g, function(match, digit, unit) {
              return (2 * digit) + unit;
            });
            i = tspans.length;
            while (i--) {
              tspan = tspans[i];
              if (tspan.getAttribute('class') === 'highcharts-text-outline') {
                erase(tspans, elem.removeChild(tspan));
              }
            }
            firstRealChild = elem.firstChild;
            each(tspans, function(tspan, y) {
              var clone;
              if (y === 0) {
                tspan.setAttribute('x', elem.getAttribute('x'));
                y = elem.getAttribute('y');
                tspan.setAttribute('y', y || 0);
                if (y === null) {
                  elem.setAttribute('y', 0);
                }
              }
              clone = tspan.cloneNode(1);
              attr(clone, {
                'class': 'highcharts-text-outline',
                'fill': color,
                'stroke': color,
                'stroke-width': strokeWidth,
                'stroke-linejoin': 'round'
              });
              elem.insertBefore(clone, firstRealChild);
            });
          }
        },
        attr: function(hash, val, complete, continueAnimation) {
          var key,
              element = this.element,
              hasSetSymbolSize,
              ret = this,
              skipAttr,
              setter;
          if (typeof hash === 'string' && val !== undefined) {
            key = hash;
            hash = {};
            hash[key] = val;
          }
          if (typeof hash === 'string') {
            ret = (this[hash + 'Getter'] || this._defaultGetter).call(this, hash, element);
          } else {
            objectEach(hash, function eachAttribute(val, key) {
              skipAttr = false;
              if (!continueAnimation) {
                stop(this, key);
              }
              if (this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)$/.test(key)) {
                if (!hasSetSymbolSize) {
                  this.symbolAttr(hash);
                  hasSetSymbolSize = true;
                }
                skipAttr = true;
              }
              if (this.rotation && (key === 'x' || key === 'y')) {
                this.doTransform = true;
              }
              if (!skipAttr) {
                setter = this[key + 'Setter'] || this._defaultSetter;
                setter.call(this, val, key, element);
              }
            }, this);
            this.afterSetters();
          }
          if (complete) {
            complete.call(this);
          }
          return ret;
        },
        afterSetters: function() {
          if (this.doTransform) {
            this.updateTransform();
            this.doTransform = false;
          }
        },
        addClass: function(className, replace) {
          var currentClassName = this.attr('class') || '';
          if (currentClassName.indexOf(className) === -1) {
            if (!replace) {
              className = (currentClassName + (currentClassName ? ' ' : '') + className).replace('  ', ' ');
            }
            this.attr('class', className);
          }
          return this;
        },
        hasClass: function(className) {
          return inArray(className, (this.attr('class') || '').split(' ')) !== -1;
        },
        removeClass: function(className) {
          return this.attr('class', (this.attr('class') || '').replace(className, ''));
        },
        symbolAttr: function(hash) {
          var wrapper = this;
          each(['x', 'y', 'r', 'start', 'end', 'width', 'height', 'innerR', 'anchorX', 'anchorY'], function(key) {
            wrapper[key] = pick(hash[key], wrapper[key]);
          });
          wrapper.attr({d: wrapper.renderer.symbols[wrapper.symbolName](wrapper.x, wrapper.y, wrapper.width, wrapper.height, wrapper)});
        },
        clip: function(clipRect) {
          return this.attr('clip-path', clipRect ? 'url(' + this.renderer.url + '#' + clipRect.id + ')' : 'none');
        },
        crisp: function(rect, strokeWidth) {
          var wrapper = this,
              normalizer;
          strokeWidth = strokeWidth || rect.strokeWidth || 0;
          normalizer = Math.round(strokeWidth) % 2 / 2;
          rect.x = Math.floor(rect.x || wrapper.x || 0) + normalizer;
          rect.y = Math.floor(rect.y || wrapper.y || 0) + normalizer;
          rect.width = Math.floor((rect.width || wrapper.width || 0) - 2 * normalizer);
          rect.height = Math.floor((rect.height || wrapper.height || 0) - 2 * normalizer);
          if (defined(rect.strokeWidth)) {
            rect.strokeWidth = strokeWidth;
          }
          return rect;
        },
        css: function(styles) {
          var oldStyles = this.styles,
              newStyles = {},
              elem = this.element,
              textWidth,
              serializedCss = '',
              hyphenate,
              hasNew = !oldStyles,
              svgPseudoProps = ['textOutline', 'textOverflow', 'width'];
          if (styles && styles.color) {
            styles.fill = styles.color;
          }
          if (oldStyles) {
            objectEach(styles, function(style, n) {
              if (style !== oldStyles[n]) {
                newStyles[n] = style;
                hasNew = true;
              }
            });
          }
          if (hasNew) {
            if (oldStyles) {
              styles = extend(oldStyles, newStyles);
            }
            textWidth = this.textWidth = (styles && styles.width && styles.width !== 'auto' && elem.nodeName.toLowerCase() === 'text' && pInt(styles.width));
            this.styles = styles;
            if (textWidth && (!svg && this.renderer.forExport)) {
              delete styles.width;
            }
            if (elem.namespaceURI === this.SVG_NS) {
              hyphenate = function(a, b) {
                return '-' + b.toLowerCase();
              };
              objectEach(styles, function(style, n) {
                if (inArray(n, svgPseudoProps) === -1) {
                  serializedCss += n.replace(/([A-Z])/g, hyphenate) + ':' + style + ';';
                }
              });
              if (serializedCss) {
                attr(elem, 'style', serializedCss);
              }
            } else {
              css(elem, styles);
            }
            if (this.added) {
              if (this.element.nodeName === 'text') {
                this.renderer.buildText(this);
              }
              if (styles && styles.textOutline) {
                this.applyTextOutline(styles.textOutline);
              }
            }
          }
          return this;
        },
        getStyle: function(prop) {
          return win.getComputedStyle(this.element || this, '').getPropertyValue(prop);
        },
        strokeWidth: function() {
          var val = this.getStyle('stroke-width'),
              ret,
              dummy;
          if (val.indexOf('px') === val.length - 2) {
            ret = pInt(val);
          } else {
            dummy = doc.createElementNS(SVG_NS, 'rect');
            attr(dummy, {
              'width': val,
              'stroke-width': 0
            });
            this.element.parentNode.appendChild(dummy);
            ret = dummy.getBBox().width;
            dummy.parentNode.removeChild(dummy);
          }
          return ret;
        },
        on: function(eventType, handler) {
          var svgElement = this,
              element = svgElement.element;
          if (hasTouch && eventType === 'click') {
            element.ontouchstart = function(e) {
              svgElement.touchEventFired = Date.now();
              e.preventDefault();
              handler.call(element, e);
            };
            element.onclick = function(e) {
              if (win.navigator.userAgent.indexOf('Android') === -1 || Date.now() - (svgElement.touchEventFired || 0) > 1100) {
                handler.call(element, e);
              }
            };
          } else {
            element['on' + eventType] = handler;
          }
          return this;
        },
        setRadialReference: function(coordinates) {
          var existingGradient = this.renderer.gradients[this.element.gradient];
          this.element.radialReference = coordinates;
          if (existingGradient && existingGradient.radAttr) {
            existingGradient.animate(this.renderer.getRadialAttr(coordinates, existingGradient.radAttr));
          }
          return this;
        },
        translate: function(x, y) {
          return this.attr({
            translateX: x,
            translateY: y
          });
        },
        invert: function(inverted) {
          var wrapper = this;
          wrapper.inverted = inverted;
          wrapper.updateTransform();
          return wrapper;
        },
        updateTransform: function() {
          var wrapper = this,
              translateX = wrapper.translateX || 0,
              translateY = wrapper.translateY || 0,
              scaleX = wrapper.scaleX,
              scaleY = wrapper.scaleY,
              inverted = wrapper.inverted,
              rotation = wrapper.rotation,
              matrix = wrapper.matrix,
              element = wrapper.element,
              transform;
          if (inverted) {
            translateX += wrapper.width;
            translateY += wrapper.height;
          }
          transform = ['translate(' + translateX + ',' + translateY + ')'];
          if (defined(matrix)) {
            transform.push('matrix(' + matrix.join(',') + ')');
          }
          if (inverted) {
            transform.push('rotate(90) scale(-1,1)');
          } else if (rotation) {
            transform.push('rotate(' + rotation + ' ' + pick(this.rotationOriginX, element.getAttribute('x'), 0) + ' ' + pick(this.rotationOriginY, element.getAttribute('y') || 0) + ')');
          }
          if (defined(scaleX) || defined(scaleY)) {
            transform.push('scale(' + pick(scaleX, 1) + ' ' + pick(scaleY, 1) + ')');
          }
          if (transform.length) {
            element.setAttribute('transform', transform.join(' '));
          }
        },
        toFront: function() {
          var element = this.element;
          element.parentNode.appendChild(element);
          return this;
        },
        align: function(alignOptions, alignByTranslate, box) {
          var align,
              vAlign,
              x,
              y,
              attribs = {},
              alignTo,
              renderer = this.renderer,
              alignedObjects = renderer.alignedObjects,
              alignFactor,
              vAlignFactor;
          if (alignOptions) {
            this.alignOptions = alignOptions;
            this.alignByTranslate = alignByTranslate;
            if (!box || isString(box)) {
              this.alignTo = alignTo = box || 'renderer';
              erase(alignedObjects, this);
              alignedObjects.push(this);
              box = null;
            }
          } else {
            alignOptions = this.alignOptions;
            alignByTranslate = this.alignByTranslate;
            alignTo = this.alignTo;
          }
          box = pick(box, renderer[alignTo], renderer);
          align = alignOptions.align;
          vAlign = alignOptions.verticalAlign;
          x = (box.x || 0) + (alignOptions.x || 0);
          y = (box.y || 0) + (alignOptions.y || 0);
          if (align === 'right') {
            alignFactor = 1;
          } else if (align === 'center') {
            alignFactor = 2;
          }
          if (alignFactor) {
            x += (box.width - (alignOptions.width || 0)) / alignFactor;
          }
          attribs[alignByTranslate ? 'translateX' : 'x'] = Math.round(x);
          if (vAlign === 'bottom') {
            vAlignFactor = 1;
          } else if (vAlign === 'middle') {
            vAlignFactor = 2;
          }
          if (vAlignFactor) {
            y += (box.height - (alignOptions.height || 0)) / vAlignFactor;
          }
          attribs[alignByTranslate ? 'translateY' : 'y'] = Math.round(y);
          this[this.placed ? 'animate' : 'attr'](attribs);
          this.placed = true;
          this.alignAttr = attribs;
          return this;
        },
        getBBox: function(reload, rot) {
          var wrapper = this,
              bBox,
              renderer = wrapper.renderer,
              width,
              height,
              rotation,
              rad,
              element = wrapper.element,
              styles = wrapper.styles,
              fontSize,
              textStr = wrapper.textStr,
              toggleTextShadowShim,
              cache = renderer.cache,
              cacheKeys = renderer.cacheKeys,
              cacheKey;
          rotation = pick(rot, wrapper.rotation);
          rad = rotation * deg2rad;
          fontSize = element && SVGElement.prototype.getStyle.call(element, 'font-size');
          if (defined(textStr)) {
            cacheKey = textStr.toString();
            if (cacheKey.indexOf('<') === -1) {
              cacheKey = cacheKey.replace(/[0-9]/g, '0');
            }
            cacheKey += ['', rotation || 0, fontSize, styles && styles.width, styles && styles.textOverflow].join(',');
          }
          if (cacheKey && !reload) {
            bBox = cache[cacheKey];
          }
          if (!bBox) {
            if (element.namespaceURI === wrapper.SVG_NS || renderer.forExport) {
              try {
                toggleTextShadowShim = this.fakeTS && function(display) {
                  each(element.querySelectorAll('.highcharts-text-outline'), function(tspan) {
                    tspan.style.display = display;
                  });
                };
                if (toggleTextShadowShim) {
                  toggleTextShadowShim('none');
                }
                bBox = element.getBBox ? extend({}, element.getBBox()) : {
                  width: element.offsetWidth,
                  height: element.offsetHeight
                };
                if (toggleTextShadowShim) {
                  toggleTextShadowShim('');
                }
              } catch (e) {}
              if (!bBox || bBox.width < 0) {
                bBox = {
                  width: 0,
                  height: 0
                };
              }
            } else {
              bBox = wrapper.htmlGetBBox();
            }
            if (renderer.isSVG) {
              width = bBox.width;
              height = bBox.height;
              if (styles && styles.fontSize === '11px' && Math.round(height) === 17) {
                bBox.height = height = 14;
              }
              if (rotation) {
                bBox.width = Math.abs(height * Math.sin(rad)) + Math.abs(width * Math.cos(rad));
                bBox.height = Math.abs(height * Math.cos(rad)) + Math.abs(width * Math.sin(rad));
              }
            }
            if (cacheKey && bBox.height > 0) {
              while (cacheKeys.length > 250) {
                delete cache[cacheKeys.shift()];
              }
              if (!cache[cacheKey]) {
                cacheKeys.push(cacheKey);
              }
              cache[cacheKey] = bBox;
            }
          }
          return bBox;
        },
        show: function(inherit) {
          return this.attr({visibility: inherit ? 'inherit' : 'visible'});
        },
        hide: function() {
          return this.attr({visibility: 'hidden'});
        },
        fadeOut: function(duration) {
          var elemWrapper = this;
          elemWrapper.animate({opacity: 0}, {
            duration: duration || 150,
            complete: function() {
              elemWrapper.attr({y: -9999});
            }
          });
        },
        add: function(parent) {
          var renderer = this.renderer,
              element = this.element,
              inserted;
          if (parent) {
            this.parentGroup = parent;
          }
          this.parentInverted = parent && parent.inverted;
          if (this.textStr !== undefined) {
            renderer.buildText(this);
          }
          this.added = true;
          if (!parent || parent.handleZ || this.zIndex) {
            inserted = this.zIndexSetter();
          }
          if (!inserted) {
            (parent ? parent.element : renderer.box).appendChild(element);
          }
          if (this.onAdd) {
            this.onAdd();
          }
          return this;
        },
        safeRemoveChild: function(element) {
          var parentNode = element.parentNode;
          if (parentNode) {
            parentNode.removeChild(element);
          }
        },
        destroy: function() {
          var wrapper = this,
              element = wrapper.element || {},
              parentToClean = wrapper.renderer.isSVG && element.nodeName === 'SPAN' && wrapper.parentGroup,
              grandParent,
              ownerSVGElement = element.ownerSVGElement,
              i,
              clipPath = wrapper.clipPath;
          element.onclick = element.onmouseout = element.onmouseover = element.onmousemove = element.point = null;
          stop(wrapper);
          if (clipPath && ownerSVGElement) {
            each(ownerSVGElement.querySelectorAll('[clip-path],[CLIP-PATH]'), function(el) {
              var clipPathAttr = el.getAttribute('clip-path'),
                  clipPathId = clipPath.element.id;
              if (clipPathAttr.indexOf('(#' + clipPathId + ')') > -1 || clipPathAttr.indexOf('("#' + clipPathId + '")') > -1) {
                el.removeAttribute('clip-path');
              }
            });
            wrapper.clipPath = clipPath.destroy();
          }
          if (wrapper.stops) {
            for (i = 0; i < wrapper.stops.length; i++) {
              wrapper.stops[i] = wrapper.stops[i].destroy();
            }
            wrapper.stops = null;
          }
          wrapper.safeRemoveChild(element);
          while (parentToClean && parentToClean.div && parentToClean.div.childNodes.length === 0) {
            grandParent = parentToClean.parentGroup;
            wrapper.safeRemoveChild(parentToClean.div);
            delete parentToClean.div;
            parentToClean = grandParent;
          }
          if (wrapper.alignTo) {
            erase(wrapper.renderer.alignedObjects, wrapper);
          }
          objectEach(wrapper, function(val, key) {
            delete wrapper[key];
          });
          return null;
        },
        xGetter: function(key) {
          if (this.element.nodeName === 'circle') {
            if (key === 'x') {
              key = 'cx';
            } else if (key === 'y') {
              key = 'cy';
            }
          }
          return this._defaultGetter(key);
        },
        _defaultGetter: function(key) {
          var ret = pick(this[key + 'Value'], this[key], this.element ? this.element.getAttribute(key) : null, 0);
          if (/^[\-0-9\.]+$/.test(ret)) {
            ret = parseFloat(ret);
          }
          return ret;
        },
        dSetter: function(value, key, element) {
          if (value && value.join) {
            value = value.join(' ');
          }
          if (/(NaN| {2}|^$)/.test(value)) {
            value = 'M 0 0';
          }
          if (this[key] !== value) {
            element.setAttribute(key, value);
            this[key] = value;
          }
        },
        alignSetter: function(value) {
          var convert = {
            left: 'start',
            center: 'middle',
            right: 'end'
          };
          this.alignValue = value;
          this.element.setAttribute('text-anchor', convert[value]);
        },
        opacitySetter: function(value, key, element) {
          this[key] = value;
          element.setAttribute(key, value);
        },
        titleSetter: function(value) {
          var titleNode = this.element.getElementsByTagName('title')[0];
          if (!titleNode) {
            titleNode = doc.createElementNS(this.SVG_NS, 'title');
            this.element.appendChild(titleNode);
          }
          if (titleNode.firstChild) {
            titleNode.removeChild(titleNode.firstChild);
          }
          titleNode.appendChild(doc.createTextNode((String(pick(value), '')).replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')));
        },
        textSetter: function(value) {
          if (value !== this.textStr) {
            delete this.bBox;
            this.textStr = value;
            if (this.added) {
              this.renderer.buildText(this);
            }
          }
        },
        fillSetter: function(value, key, element) {
          if (typeof value === 'string') {
            element.setAttribute(key, value);
          } else if (value) {
            this.colorGradient(value, key, element);
          }
        },
        visibilitySetter: function(value, key, element) {
          if (value === 'inherit') {
            element.removeAttribute(key);
          } else if (this[key] !== value) {
            element.setAttribute(key, value);
          }
          this[key] = value;
        },
        zIndexSetter: function(value, key) {
          var renderer = this.renderer,
              parentGroup = this.parentGroup,
              parentWrapper = parentGroup || renderer,
              parentNode = parentWrapper.element || renderer.box,
              childNodes,
              otherElement,
              otherZIndex,
              element = this.element,
              inserted,
              undefinedOtherZIndex,
              svgParent = parentNode === renderer.box,
              run = this.added,
              i;
          if (defined(value)) {
            element.zIndex = value;
            value = +value;
            if (this[key] === value) {
              run = false;
            }
            this[key] = value;
          }
          if (run) {
            value = this.zIndex;
            if (value && parentGroup) {
              parentGroup.handleZ = true;
            }
            childNodes = parentNode.childNodes;
            for (i = childNodes.length - 1; i >= 0 && !inserted; i--) {
              otherElement = childNodes[i];
              otherZIndex = otherElement.zIndex;
              undefinedOtherZIndex = !defined(otherZIndex);
              if (otherElement !== element) {
                if ((value < 0 && undefinedOtherZIndex && !svgParent && !i)) {
                  parentNode.insertBefore(element, childNodes[i]);
                  inserted = true;
                } else if (pInt(otherZIndex) <= value || (undefinedOtherZIndex && (!defined(value) || value >= 0))) {
                  parentNode.insertBefore(element, childNodes[i + 1] || null);
                  inserted = true;
                }
              }
            }
            if (!inserted) {
              parentNode.insertBefore(element, childNodes[svgParent ? 3 : 0] || null);
              inserted = true;
            }
          }
          return inserted;
        },
        _defaultSetter: function(value, key, element) {
          element.setAttribute(key, value);
        }
      });
      SVGElement.prototype.yGetter = SVGElement.prototype.xGetter;
      SVGElement.prototype.translateXSetter = SVGElement.prototype.translateYSetter = SVGElement.prototype.rotationSetter = SVGElement.prototype.verticalAlignSetter = SVGElement.prototype.rotationOriginXSetter = SVGElement.prototype.rotationOriginYSetter = SVGElement.prototype.scaleXSetter = SVGElement.prototype.scaleYSetter = SVGElement.prototype.matrixSetter = function(value, key) {
        this[key] = value;
        this.doTransform = true;
      };
      SVGRenderer = H.SVGRenderer = function() {
        this.init.apply(this, arguments);
      };
      extend(SVGRenderer.prototype, {
        Element: SVGElement,
        SVG_NS: SVG_NS,
        init: function(container, width, height, style, forExport, allowHTML) {
          var renderer = this,
              boxWrapper,
              element,
              desc;
          boxWrapper = renderer.createElement('svg').attr({
            'version': '1.1',
            'class': 'highcharts-root'
          });
          element = boxWrapper.element;
          container.appendChild(element);
          attr(container, 'dir', 'ltr');
          if (container.innerHTML.indexOf('xmlns') === -1) {
            attr(element, 'xmlns', this.SVG_NS);
          }
          renderer.isSVG = true;
          this.box = element;
          this.boxWrapper = boxWrapper;
          renderer.alignedObjects = [];
          this.url = ((isFirefox || isWebKit) && doc.getElementsByTagName('base').length) ? win.location.href.replace(/#.*?$/, '').replace(/<[^>]*>/g, '').replace(/([\('\)])/g, '\\$1').replace(/ /g, '%20') : '';
          desc = this.createElement('desc').add();
          desc.element.appendChild(doc.createTextNode('Created with Highmaps 6.0.7'));
          renderer.defs = this.createElement('defs').add();
          renderer.allowHTML = allowHTML;
          renderer.forExport = forExport;
          renderer.gradients = {};
          renderer.cache = {};
          renderer.cacheKeys = [];
          renderer.imgCount = 0;
          renderer.setSize(width, height, false);
          var subPixelFix,
              rect;
          if (isFirefox && container.getBoundingClientRect) {
            subPixelFix = function() {
              css(container, {
                left: 0,
                top: 0
              });
              rect = container.getBoundingClientRect();
              css(container, {
                left: (Math.ceil(rect.left) - rect.left) + 'px',
                top: (Math.ceil(rect.top) - rect.top) + 'px'
              });
            };
            subPixelFix();
            renderer.unSubPixelFix = addEvent(win, 'resize', subPixelFix);
          }
        },
        definition: function(def) {
          var ren = this;
          function recurse(config, parent) {
            var ret;
            each(splat(config), function(item) {
              var node = ren.createElement(item.tagName),
                  attr = {};
              objectEach(item, function(val, key) {
                if (key !== 'tagName' && key !== 'children' && key !== 'textContent') {
                  attr[key] = val;
                }
              });
              node.attr(attr);
              node.add(parent || ren.defs);
              if (item.textContent) {
                node.element.appendChild(doc.createTextNode(item.textContent));
              }
              recurse(item.children || [], node);
              ret = node;
            });
            return ret;
          }
          return recurse(def);
        },
        isHidden: function() {
          return !this.boxWrapper.getBBox().width;
        },
        destroy: function() {
          var renderer = this,
              rendererDefs = renderer.defs;
          renderer.box = null;
          renderer.boxWrapper = renderer.boxWrapper.destroy();
          destroyObjectProperties(renderer.gradients || {});
          renderer.gradients = null;
          if (rendererDefs) {
            renderer.defs = rendererDefs.destroy();
          }
          if (renderer.unSubPixelFix) {
            renderer.unSubPixelFix();
          }
          renderer.alignedObjects = null;
          return null;
        },
        createElement: function(nodeName) {
          var wrapper = new this.Element();
          wrapper.init(this, nodeName);
          return wrapper;
        },
        draw: noop,
        getRadialAttr: function(radialReference, gradAttr) {
          return {
            cx: (radialReference[0] - radialReference[2] / 2) + gradAttr.cx * radialReference[2],
            cy: (radialReference[1] - radialReference[2] / 2) + gradAttr.cy * radialReference[2],
            r: gradAttr.r * radialReference[2]
          };
        },
        getSpanWidth: function(wrapper) {
          return wrapper.getBBox(true).width;
        },
        applyEllipsis: function(wrapper, tspan, text, width) {
          var renderer = this,
              rotation = wrapper.rotation,
              str = text,
              currentIndex,
              minIndex = 0,
              maxIndex = text.length,
              updateTSpan = function(s) {
                tspan.removeChild(tspan.firstChild);
                if (s) {
                  tspan.appendChild(doc.createTextNode(s));
                }
              },
              actualWidth,
              wasTooLong;
          wrapper.rotation = 0;
          actualWidth = renderer.getSpanWidth(wrapper, tspan);
          wasTooLong = actualWidth > width;
          if (wasTooLong) {
            while (minIndex <= maxIndex) {
              currentIndex = Math.ceil((minIndex + maxIndex) / 2);
              str = text.substring(0, currentIndex) + '\u2026';
              updateTSpan(str);
              actualWidth = renderer.getSpanWidth(wrapper, tspan);
              if (minIndex === maxIndex) {
                minIndex = maxIndex + 1;
              } else if (actualWidth > width) {
                maxIndex = currentIndex - 1;
              } else {
                minIndex = currentIndex;
              }
            }
            if (maxIndex === 0) {
              updateTSpan('');
            }
          }
          wrapper.rotation = rotation;
          return wasTooLong;
        },
        escapes: {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        },
        buildText: function(wrapper) {
          var textNode = wrapper.element,
              renderer = this,
              forExport = renderer.forExport,
              textStr = pick(wrapper.textStr, '').toString(),
              hasMarkup = textStr.indexOf('<') !== -1,
              lines,
              childNodes = textNode.childNodes,
              clsRegex,
              styleRegex,
              hrefRegex,
              wasTooLong,
              parentX = attr(textNode, 'x'),
              textStyles = wrapper.styles,
              width = wrapper.textWidth,
              textLineHeight = textStyles && textStyles.lineHeight,
              textOutline = textStyles && textStyles.textOutline,
              ellipsis = textStyles && textStyles.textOverflow === 'ellipsis',
              noWrap = textStyles && textStyles.whiteSpace === 'nowrap',
              fontSize = textStyles && textStyles.fontSize,
              textCache,
              isSubsequentLine,
              i = childNodes.length,
              tempParent = width && !wrapper.added && this.box,
              getLineHeight = function(tspan) {
                var fontSizeStyle;
                return textLineHeight ? pInt(textLineHeight) : renderer.fontMetrics(fontSizeStyle, tspan.getAttribute('style') ? tspan : textNode).h;
              },
              unescapeEntities = function(inputStr, except) {
                objectEach(renderer.escapes, function(value, key) {
                  if (!except || inArray(value, except) === -1) {
                    inputStr = inputStr.toString().replace(new RegExp(value, 'g'), key);
                  }
                });
                return inputStr;
              };
          textCache = [textStr, ellipsis, noWrap, textLineHeight, textOutline, fontSize, width].join(',');
          if (textCache === wrapper.textCache) {
            return;
          }
          wrapper.textCache = textCache;
          while (i--) {
            textNode.removeChild(childNodes[i]);
          }
          if (!hasMarkup && !textOutline && !ellipsis && !width && textStr.indexOf(' ') === -1) {
            textNode.appendChild(doc.createTextNode(unescapeEntities(textStr)));
          } else {
            clsRegex = /<.*class="([^"]+)".*>/;
            styleRegex = /<.*style="([^"]+)".*>/;
            hrefRegex = /<.*href="([^"]+)".*>/;
            if (tempParent) {
              tempParent.appendChild(textNode);
            }
            if (hasMarkup) {
              lines = textStr.replace(/<(b|strong)>/g, '<span class="highcharts-strong">').replace(/<(i|em)>/g, '<span class="highcharts-emphasized">').replace(/<a/g, '<span').replace(/<\/(b|strong|i|em|a)>/g, '</span>').split(/<br.*?>/g);
            } else {
              lines = [textStr];
            }
            lines = grep(lines, function(line) {
              return line !== '';
            });
            each(lines, function buildTextLines(line, lineNo) {
              var spans,
                  spanNo = 0;
              line = line.replace(/^\s+|\s+$/g, '').replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||');
              spans = line.split('|||');
              each(spans, function buildTextSpans(span) {
                if (span !== '' || spans.length === 1) {
                  var attributes = {},
                      tspan = doc.createElementNS(renderer.SVG_NS, 'tspan'),
                      spanCls,
                      spanStyle;
                  if (clsRegex.test(span)) {
                    spanCls = span.match(clsRegex)[1];
                    attr(tspan, 'class', spanCls);
                  }
                  if (styleRegex.test(span)) {
                    spanStyle = span.match(styleRegex)[1].replace(/(;| |^)color([ :])/, '$1fill$2');
                    attr(tspan, 'style', spanStyle);
                  }
                  if (hrefRegex.test(span) && !forExport) {
                    attr(tspan, 'onclick', 'location.href=\"' + span.match(hrefRegex)[1] + '\"');
                    attr(tspan, 'class', 'highcharts-anchor');
                  }
                  span = unescapeEntities(span.replace(/<[a-zA-Z\/](.|\n)*?>/g, '') || ' ');
                  if (span !== ' ') {
                    tspan.appendChild(doc.createTextNode(span));
                    if (!spanNo) {
                      if (lineNo && parentX !== null) {
                        attributes.x = parentX;
                      }
                    } else {
                      attributes.dx = 0;
                    }
                    attr(tspan, attributes);
                    textNode.appendChild(tspan);
                    if (!spanNo && isSubsequentLine) {
                      if (!svg && forExport) {
                        css(tspan, {display: 'block'});
                      }
                      attr(tspan, 'dy', getLineHeight(tspan));
                    }
                    if (width) {
                      var words = span.replace(/([^\^])-/g, '$1- ').split(' '),
                          hasWhiteSpace = (spans.length > 1 || lineNo || (words.length > 1 && !noWrap)),
                          tooLong,
                          rest = [],
                          actualWidth,
                          dy = getLineHeight(tspan),
                          rotation = wrapper.rotation;
                      if (ellipsis) {
                        wasTooLong = renderer.applyEllipsis(wrapper, tspan, span, width);
                      }
                      while (!ellipsis && hasWhiteSpace && (words.length || rest.length)) {
                        wrapper.rotation = 0;
                        actualWidth = renderer.getSpanWidth(wrapper, tspan);
                        tooLong = actualWidth > width;
                        if (wasTooLong === undefined) {
                          wasTooLong = tooLong;
                        }
                        if (!tooLong || words.length === 1) {
                          words = rest;
                          rest = [];
                          if (words.length && !noWrap) {
                            tspan = doc.createElementNS(SVG_NS, 'tspan');
                            attr(tspan, {
                              dy: dy,
                              x: parentX
                            });
                            if (spanStyle) {
                              attr(tspan, 'style', spanStyle);
                            }
                            textNode.appendChild(tspan);
                          }
                          if (actualWidth > width) {
                            width = actualWidth;
                          }
                        } else {
                          tspan.removeChild(tspan.firstChild);
                          rest.unshift(words.pop());
                        }
                        if (words.length) {
                          tspan.appendChild(doc.createTextNode(words.join(' ').replace(/- /g, '-')));
                        }
                      }
                      wrapper.rotation = rotation;
                    }
                    spanNo++;
                  }
                }
              });
              isSubsequentLine = (isSubsequentLine || textNode.childNodes.length);
            });
            if (wasTooLong) {
              wrapper.attr('title', unescapeEntities(wrapper.textStr, ['&lt;', '&gt;']));
            }
            if (tempParent) {
              tempParent.removeChild(textNode);
            }
            if (textOutline && wrapper.applyTextOutline) {
              wrapper.applyTextOutline(textOutline);
            }
          }
        },
        getContrast: function(rgba) {
          rgba = color(rgba).rgba;
          return rgba[0] + rgba[1] + rgba[2] > 2 * 255 ? '#000000' : '#FFFFFF';
        },
        button: function(text, x, y, callback, normalState, hoverState, pressedState, disabledState, shape) {
          var label = this.label(text, x, y, shape, null, null, null, null, 'button'),
              curState = 0;
          label.attr(merge({
            'padding': 8,
            'r': 2
          }, normalState));
          addEvent(label.element, isMS ? 'mouseover' : 'mouseenter', function() {
            if (curState !== 3) {
              label.setState(1);
            }
          });
          addEvent(label.element, isMS ? 'mouseout' : 'mouseleave', function() {
            if (curState !== 3) {
              label.setState(curState);
            }
          });
          label.setState = function(state) {
            if (state !== 1) {
              label.state = curState = state;
            }
            label.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass('highcharts-button-' + ['normal', 'hover', 'pressed', 'disabled'][state || 0]);
          };
          return label.on('click', function(e) {
            if (curState !== 3) {
              callback.call(label, e);
            }
          });
        },
        crispLine: function(points, width) {
          if (points[1] === points[4]) {
            points[1] = points[4] = Math.round(points[1]) - (width % 2 / 2);
          }
          if (points[2] === points[5]) {
            points[2] = points[5] = Math.round(points[2]) + (width % 2 / 2);
          }
          return points;
        },
        path: function(path) {
          var attribs = {};
          if (isArray(path)) {
            attribs.d = path;
          } else if (isObject(path)) {
            extend(attribs, path);
          }
          return this.createElement('path').attr(attribs);
        },
        circle: function(x, y, r) {
          var attribs = isObject(x) ? x : {
            x: x,
            y: y,
            r: r
          },
              wrapper = this.createElement('circle');
          wrapper.xSetter = wrapper.ySetter = function(value, key, element) {
            element.setAttribute('c' + key, value);
          };
          return wrapper.attr(attribs);
        },
        arc: function(x, y, r, innerR, start, end) {
          var arc,
              options;
          if (isObject(x)) {
            options = x;
            y = options.y;
            r = options.r;
            innerR = options.innerR;
            start = options.start;
            end = options.end;
            x = options.x;
          } else {
            options = {
              innerR: innerR,
              start: start,
              end: end
            };
          }
          arc = this.symbol('arc', x, y, r, r, options);
          arc.r = r;
          return arc;
        },
        rect: function(x, y, width, height, r, strokeWidth) {
          r = isObject(x) ? x.r : r;
          var wrapper = this.createElement('rect'),
              attribs = isObject(x) ? x : x === undefined ? {} : {
                x: x,
                y: y,
                width: Math.max(width, 0),
                height: Math.max(height, 0)
              };
          if (r) {
            attribs.r = r;
          }
          wrapper.rSetter = function(value, key, element) {
            attr(element, {
              rx: value,
              ry: value
            });
          };
          return wrapper.attr(attribs);
        },
        setSize: function(width, height, animate) {
          var renderer = this,
              alignedObjects = renderer.alignedObjects,
              i = alignedObjects.length;
          renderer.width = width;
          renderer.height = height;
          renderer.boxWrapper.animate({
            width: width,
            height: height
          }, {
            step: function() {
              this.attr({viewBox: '0 0 ' + this.attr('width') + ' ' + this.attr('height')});
            },
            duration: pick(animate, true) ? undefined : 0
          });
          while (i--) {
            alignedObjects[i].align();
          }
        },
        g: function(name) {
          var elem = this.createElement('g');
          return name ? elem.attr({'class': 'highcharts-' + name}) : elem;
        },
        image: function(src, x, y, width, height) {
          var attribs = {preserveAspectRatio: 'none'},
              elemWrapper;
          if (arguments.length > 1) {
            extend(attribs, {
              x: x,
              y: y,
              width: width,
              height: height
            });
          }
          elemWrapper = this.createElement('image').attr(attribs);
          if (elemWrapper.element.setAttributeNS) {
            elemWrapper.element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);
          } else {
            elemWrapper.element.setAttribute('hc-svg-href', src);
          }
          return elemWrapper;
        },
        symbol: function(symbol, x, y, width, height, options) {
          var ren = this,
              obj,
              imageRegex = /^url\((.*?)\)$/,
              isImage = imageRegex.test(symbol),
              sym = !isImage && (this.symbols[symbol] ? symbol : 'circle'),
              symbolFn = sym && this.symbols[sym],
              path = defined(x) && symbolFn && symbolFn.call(this.symbols, Math.round(x), Math.round(y), width, height, options),
              imageSrc,
              centerImage;
          if (symbolFn) {
            obj = this.path(path);
            extend(obj, {
              symbolName: sym,
              x: x,
              y: y,
              width: width,
              height: height
            });
            if (options) {
              extend(obj, options);
            }
          } else if (isImage) {
            imageSrc = symbol.match(imageRegex)[1];
            obj = this.image(imageSrc);
            obj.imgwidth = pick(symbolSizes[imageSrc] && symbolSizes[imageSrc].width, options && options.width);
            obj.imgheight = pick(symbolSizes[imageSrc] && symbolSizes[imageSrc].height, options && options.height);
            centerImage = function() {
              obj.attr({
                width: obj.width,
                height: obj.height
              });
            };
            each(['width', 'height'], function(key) {
              obj[key + 'Setter'] = function(value, key) {
                var attribs = {},
                    imgSize = this['img' + key],
                    trans = key === 'width' ? 'translateX' : 'translateY';
                this[key] = value;
                if (defined(imgSize)) {
                  if (this.element) {
                    this.element.setAttribute(key, imgSize);
                  }
                  if (!this.alignByTranslate) {
                    attribs[trans] = ((this[key] || 0) - imgSize) / 2;
                    this.attr(attribs);
                  }
                }
              };
            });
            if (defined(x)) {
              obj.attr({
                x: x,
                y: y
              });
            }
            obj.isImg = true;
            if (defined(obj.imgwidth) && defined(obj.imgheight)) {
              centerImage();
            } else {
              obj.attr({
                width: 0,
                height: 0
              });
              createElement('img', {
                onload: function() {
                  var chart = charts[ren.chartIndex];
                  if (this.width === 0) {
                    css(this, {
                      position: 'absolute',
                      top: '-999em'
                    });
                    doc.body.appendChild(this);
                  }
                  symbolSizes[imageSrc] = {
                    width: this.width,
                    height: this.height
                  };
                  obj.imgwidth = this.width;
                  obj.imgheight = this.height;
                  if (obj.element) {
                    centerImage();
                  }
                  if (this.parentNode) {
                    this.parentNode.removeChild(this);
                  }
                  ren.imgCount--;
                  if (!ren.imgCount && chart && chart.onload) {
                    chart.onload();
                  }
                },
                src: imageSrc
              });
              this.imgCount++;
            }
          }
          return obj;
        },
        symbols: {
          'circle': function(x, y, w, h) {
            return this.arc(x + w / 2, y + h / 2, w / 2, h / 2, {
              start: 0,
              end: Math.PI * 2,
              open: false
            });
          },
          'square': function(x, y, w, h) {
            return ['M', x, y, 'L', x + w, y, x + w, y + h, x, y + h, 'Z'];
          },
          'triangle': function(x, y, w, h) {
            return ['M', x + w / 2, y, 'L', x + w, y + h, x, y + h, 'Z'];
          },
          'triangle-down': function(x, y, w, h) {
            return ['M', x, y, 'L', x + w, y, x + w / 2, y + h, 'Z'];
          },
          'diamond': function(x, y, w, h) {
            return ['M', x + w / 2, y, 'L', x + w, y + h / 2, x + w / 2, y + h, x, y + h / 2, 'Z'];
          },
          'arc': function(x, y, w, h, options) {
            var start = options.start,
                rx = options.r || w,
                ry = options.r || h || w,
                proximity = 0.001,
                fullCircle = Math.abs(options.end - options.start - 2 * Math.PI) < proximity,
                end = options.end - proximity,
                innerRadius = options.innerR,
                open = pick(options.open, fullCircle),
                cosStart = Math.cos(start),
                sinStart = Math.sin(start),
                cosEnd = Math.cos(end),
                sinEnd = Math.sin(end),
                longArc = options.end - start - Math.PI < proximity ? 0 : 1,
                arc;
            arc = ['M', x + rx * cosStart, y + ry * sinStart, 'A', rx, ry, 0, longArc, 1, x + rx * cosEnd, y + ry * sinEnd];
            if (defined(innerRadius)) {
              arc.push(open ? 'M' : 'L', x + innerRadius * cosEnd, y + innerRadius * sinEnd, 'A', innerRadius, innerRadius, 0, longArc, 0, x + innerRadius * cosStart, y + innerRadius * sinStart);
            }
            arc.push(open ? '' : 'Z');
            return arc;
          },
          callout: function(x, y, w, h, options) {
            var arrowLength = 6,
                halfDistance = 6,
                r = Math.min((options && options.r) || 0, w, h),
                safeDistance = r + halfDistance,
                anchorX = options && options.anchorX,
                anchorY = options && options.anchorY,
                path;
            path = ['M', x + r, y, 'L', x + w - r, y, 'C', x + w, y, x + w, y, x + w, y + r, 'L', x + w, y + h - r, 'C', x + w, y + h, x + w, y + h, x + w - r, y + h, 'L', x + r, y + h, 'C', x, y + h, x, y + h, x, y + h - r, 'L', x, y + r, 'C', x, y, x, y, x + r, y];
            if (anchorX && anchorX > w) {
              if (anchorY > y + safeDistance && anchorY < y + h - safeDistance) {
                path.splice(13, 3, 'L', x + w, anchorY - halfDistance, x + w + arrowLength, anchorY, x + w, anchorY + halfDistance, x + w, y + h - r);
              } else {
                path.splice(13, 3, 'L', x + w, h / 2, anchorX, anchorY, x + w, h / 2, x + w, y + h - r);
              }
            } else if (anchorX && anchorX < 0) {
              if (anchorY > y + safeDistance && anchorY < y + h - safeDistance) {
                path.splice(33, 3, 'L', x, anchorY + halfDistance, x - arrowLength, anchorY, x, anchorY - halfDistance, x, y + r);
              } else {
                path.splice(33, 3, 'L', x, h / 2, anchorX, anchorY, x, h / 2, x, y + r);
              }
            } else if (anchorY && anchorY > h && anchorX > x + safeDistance && anchorX < x + w - safeDistance) {
              path.splice(23, 3, 'L', anchorX + halfDistance, y + h, anchorX, y + h + arrowLength, anchorX - halfDistance, y + h, x + r, y + h);
            } else if (anchorY && anchorY < 0 && anchorX > x + safeDistance && anchorX < x + w - safeDistance) {
              path.splice(3, 3, 'L', anchorX - halfDistance, y, anchorX, y - arrowLength, anchorX + halfDistance, y, w - r, y);
            }
            return path;
          }
        },
        clipRect: function(x, y, width, height) {
          var wrapper,
              id = H.uniqueKey(),
              clipPath = this.createElement('clipPath').attr({id: id}).add(this.defs);
          wrapper = this.rect(x, y, width, height, 0).add(clipPath);
          wrapper.id = id;
          wrapper.clipPath = clipPath;
          wrapper.count = 0;
          return wrapper;
        },
        text: function(str, x, y, useHTML) {
          var renderer = this,
              wrapper,
              attribs = {};
          if (useHTML && (renderer.allowHTML || !renderer.forExport)) {
            return renderer.html(str, x, y);
          }
          attribs.x = Math.round(x || 0);
          if (y) {
            attribs.y = Math.round(y);
          }
          if (str || str === 0) {
            attribs.text = str;
          }
          wrapper = renderer.createElement('text').attr(attribs);
          if (!useHTML) {
            wrapper.xSetter = function(value, key, element) {
              var tspans = element.getElementsByTagName('tspan'),
                  tspan,
                  parentVal = element.getAttribute(key),
                  i;
              for (i = 0; i < tspans.length; i++) {
                tspan = tspans[i];
                if (tspan.getAttribute(key) === parentVal) {
                  tspan.setAttribute(key, value);
                }
              }
              element.setAttribute(key, value);
            };
          }
          return wrapper;
        },
        fontMetrics: function(fontSize, elem) {
          var lineHeight,
              baseline;
          fontSize = elem && SVGElement.prototype.getStyle.call(elem, 'font-size');
          if (/px/.test(fontSize)) {
            fontSize = pInt(fontSize);
          } else if (/em/.test(fontSize)) {
            fontSize = parseFloat(fontSize) * (elem ? this.fontMetrics(null, elem.parentNode).f : 16);
          } else {
            fontSize = 12;
          }
          lineHeight = fontSize < 24 ? fontSize + 3 : Math.round(fontSize * 1.2);
          baseline = Math.round(lineHeight * 0.8);
          return {
            h: lineHeight,
            b: baseline,
            f: fontSize
          };
        },
        rotCorr: function(baseline, rotation, alterY) {
          var y = baseline;
          if (rotation && alterY) {
            y = Math.max(y * Math.cos(rotation * deg2rad), 4);
          }
          return {
            x: (-baseline / 3) * Math.sin(rotation * deg2rad),
            y: y
          };
        },
        label: function(str, x, y, shape, anchorX, anchorY, useHTML, baseline, className) {
          var renderer = this,
              wrapper = renderer.g(className !== 'button' && 'label'),
              text = wrapper.text = renderer.text('', 0, 0, useHTML).attr({zIndex: 1}),
              box,
              bBox,
              alignFactor = 0,
              padding = 3,
              paddingLeft = 0,
              width,
              height,
              wrapperX,
              wrapperY,
              textAlign,
              deferredAttr = {},
              strokeWidth,
              baselineOffset,
              hasBGImage = /^url\((.*?)\)$/.test(shape),
              needsBox = hasBGImage,
              getCrispAdjust,
              updateBoxSize,
              updateTextPadding,
              boxAttr;
          if (className) {
            wrapper.addClass('highcharts-' + className);
          }
          needsBox = true;
          getCrispAdjust = function() {
            return box.strokeWidth() % 2 / 2;
          };
          updateBoxSize = function() {
            var style = text.element.style,
                crispAdjust,
                attribs = {};
            bBox = ((width === undefined || height === undefined || textAlign) && defined(text.textStr) && text.getBBox());
            wrapper.width = ((width || bBox.width || 0) + 2 * padding + paddingLeft);
            wrapper.height = (height || bBox.height || 0) + 2 * padding;
            baselineOffset = padding + renderer.fontMetrics(style && style.fontSize, text).b;
            if (needsBox) {
              if (!box) {
                wrapper.box = box = renderer.symbols[shape] || hasBGImage ? renderer.symbol(shape) : renderer.rect();
                box.addClass((className === 'button' ? '' : 'highcharts-label-box') + (className ? ' highcharts-' + className + '-box' : ''));
                box.add(wrapper);
                crispAdjust = getCrispAdjust();
                attribs.x = crispAdjust;
                attribs.y = (baseline ? -baselineOffset : 0) + crispAdjust;
              }
              attribs.width = Math.round(wrapper.width);
              attribs.height = Math.round(wrapper.height);
              box.attr(extend(attribs, deferredAttr));
              deferredAttr = {};
            }
          };
          updateTextPadding = function() {
            var textX = paddingLeft + padding,
                textY;
            textY = baseline ? 0 : baselineOffset;
            if (defined(width) && bBox && (textAlign === 'center' || textAlign === 'right')) {
              textX += {
                center: 0.5,
                right: 1
              }[textAlign] * (width - bBox.width);
            }
            if (textX !== text.x || textY !== text.y) {
              text.attr('x', textX);
              if (textY !== undefined) {
                text.attr('y', textY);
              }
            }
            text.x = textX;
            text.y = textY;
          };
          boxAttr = function(key, value) {
            if (box) {
              box.attr(key, value);
            } else {
              deferredAttr[key] = value;
            }
          };
          wrapper.onAdd = function() {
            text.add(wrapper);
            wrapper.attr({
              text: (str || str === 0) ? str : '',
              x: x,
              y: y
            });
            if (box && defined(anchorX)) {
              wrapper.attr({
                anchorX: anchorX,
                anchorY: anchorY
              });
            }
          };
          wrapper.widthSetter = function(value) {
            width = H.isNumber(value) ? value : null;
          };
          wrapper.heightSetter = function(value) {
            height = value;
          };
          wrapper['text-alignSetter'] = function(value) {
            textAlign = value;
          };
          wrapper.paddingSetter = function(value) {
            if (defined(value) && value !== padding) {
              padding = wrapper.padding = value;
              updateTextPadding();
            }
          };
          wrapper.paddingLeftSetter = function(value) {
            if (defined(value) && value !== paddingLeft) {
              paddingLeft = value;
              updateTextPadding();
            }
          };
          wrapper.alignSetter = function(value) {
            value = {
              left: 0,
              center: 0.5,
              right: 1
            }[value];
            if (value !== alignFactor) {
              alignFactor = value;
              if (bBox) {
                wrapper.attr({x: wrapperX});
              }
            }
          };
          wrapper.textSetter = function(value) {
            if (value !== undefined) {
              text.textSetter(value);
            }
            updateBoxSize();
            updateTextPadding();
          };
          wrapper['stroke-widthSetter'] = function(value, key) {
            if (value) {
              needsBox = true;
            }
            strokeWidth = this['stroke-width'] = value;
            boxAttr(key, value);
          };
          wrapper.rSetter = function(value, key) {
            boxAttr(key, value);
          };
          wrapper.anchorXSetter = function(value, key) {
            anchorX = wrapper.anchorX = value;
            boxAttr(key, Math.round(value) - getCrispAdjust() - wrapperX);
          };
          wrapper.anchorYSetter = function(value, key) {
            anchorY = wrapper.anchorY = value;
            boxAttr(key, value - wrapperY);
          };
          wrapper.xSetter = function(value) {
            wrapper.x = value;
            if (alignFactor) {
              value -= alignFactor * ((width || bBox.width) + 2 * padding);
            }
            wrapperX = Math.round(value);
            wrapper.attr('translateX', wrapperX);
          };
          wrapper.ySetter = function(value) {
            wrapperY = wrapper.y = Math.round(value);
            wrapper.attr('translateY', wrapperY);
          };
          var baseCss = wrapper.css;
          return extend(wrapper, {
            css: function(styles) {
              if (styles) {
                var textStyles = {};
                styles = merge(styles);
                each(wrapper.textProps, function(prop) {
                  if (styles[prop] !== undefined) {
                    textStyles[prop] = styles[prop];
                    delete styles[prop];
                  }
                });
                text.css(textStyles);
              }
              return baseCss.call(wrapper, styles);
            },
            getBBox: function() {
              return {
                width: bBox.width + 2 * padding,
                height: bBox.height + 2 * padding,
                x: bBox.x - padding,
                y: bBox.y - padding
              };
            },
            destroy: function() {
              removeEvent(wrapper.element, 'mouseenter');
              removeEvent(wrapper.element, 'mouseleave');
              if (text) {
                text = text.destroy();
              }
              if (box) {
                box = box.destroy();
              }
              SVGElement.prototype.destroy.call(wrapper);
              wrapper = renderer = updateBoxSize = updateTextPadding = boxAttr = null;
            }
          });
        }
      });
      H.Renderer = SVGRenderer;
    }(Highcharts));
    (function(H) {
      var attr = H.attr,
          createElement = H.createElement,
          css = H.css,
          defined = H.defined,
          each = H.each,
          extend = H.extend,
          isFirefox = H.isFirefox,
          isMS = H.isMS,
          isWebKit = H.isWebKit,
          pick = H.pick,
          pInt = H.pInt,
          SVGElement = H.SVGElement,
          SVGRenderer = H.SVGRenderer,
          win = H.win,
          wrap = H.wrap;
      extend(SVGElement.prototype, {
        htmlCss: function(styles) {
          var wrapper = this,
              element = wrapper.element,
              textWidth = styles && element.tagName === 'SPAN' && styles.width;
          if (textWidth) {
            delete styles.width;
            wrapper.textWidth = textWidth;
            wrapper.updateTransform();
          }
          if (styles && styles.textOverflow === 'ellipsis') {
            styles.whiteSpace = 'nowrap';
            styles.overflow = 'hidden';
          }
          wrapper.styles = extend(wrapper.styles, styles);
          css(wrapper.element, styles);
          return wrapper;
        },
        htmlGetBBox: function() {
          var wrapper = this,
              element = wrapper.element;
          return {
            x: element.offsetLeft,
            y: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight
          };
        },
        htmlUpdateTransform: function() {
          if (!this.added) {
            this.alignOnAdd = true;
            return;
          }
          var wrapper = this,
              renderer = wrapper.renderer,
              elem = wrapper.element,
              translateX = wrapper.translateX || 0,
              translateY = wrapper.translateY || 0,
              x = wrapper.x || 0,
              y = wrapper.y || 0,
              align = wrapper.textAlign || 'left',
              alignCorrection = {
                left: 0,
                center: 0.5,
                right: 1
              }[align],
              styles = wrapper.styles,
              whiteSpace = styles && styles.whiteSpace;
          function getTextPxLength() {
            css(elem, {
              width: '',
              whiteSpace: whiteSpace || 'nowrap'
            });
            return elem.offsetWidth;
          }
          css(elem, {
            marginLeft: translateX,
            marginTop: translateY
          });
          if (wrapper.inverted) {
            each(elem.childNodes, function(child) {
              renderer.invertChild(child, elem);
            });
          }
          if (elem.tagName === 'SPAN') {
            var rotation = wrapper.rotation,
                baseline,
                textWidth = wrapper.textWidth && pInt(wrapper.textWidth),
                currentTextTransform = [rotation, align, elem.innerHTML, wrapper.textWidth, wrapper.textAlign].join(',');
            if (textWidth !== wrapper.oldTextWidth && ((textWidth > wrapper.oldTextWidth) || (wrapper.textPxLength || getTextPxLength()) > textWidth) && /[ \-]/.test(elem.textContent || elem.innerText)) {
              css(elem, {
                width: textWidth + 'px',
                display: 'block',
                whiteSpace: whiteSpace || 'normal'
              });
              wrapper.oldTextWidth = textWidth;
            }
            if (currentTextTransform !== wrapper.cTT) {
              baseline = renderer.fontMetrics(elem.style.fontSize).b;
              if (defined(rotation) && rotation !== (wrapper.oldRotation || 0)) {
                wrapper.setSpanRotation(rotation, alignCorrection, baseline);
              }
              wrapper.getSpanCorrection(wrapper.textPxLength || elem.offsetWidth, baseline, alignCorrection, rotation, align);
            }
            css(elem, {
              left: (x + (wrapper.xCorr || 0)) + 'px',
              top: (y + (wrapper.yCorr || 0)) + 'px'
            });
            wrapper.cTT = currentTextTransform;
            wrapper.oldRotation = rotation;
          }
        },
        setSpanRotation: function(rotation, alignCorrection, baseline) {
          var rotationStyle = {},
              cssTransformKey = this.renderer.getTransformKey();
          rotationStyle[cssTransformKey] = rotationStyle.transform = 'rotate(' + rotation + 'deg)';
          rotationStyle[cssTransformKey + (isFirefox ? 'Origin' : '-origin')] = rotationStyle.transformOrigin = (alignCorrection * 100) + '% ' + baseline + 'px';
          css(this.element, rotationStyle);
        },
        getSpanCorrection: function(width, baseline, alignCorrection) {
          this.xCorr = -width * alignCorrection;
          this.yCorr = -baseline;
        }
      });
      extend(SVGRenderer.prototype, {
        getTransformKey: function() {
          return isMS && !/Edge/.test(win.navigator.userAgent) ? '-ms-transform' : isWebKit ? '-webkit-transform' : isFirefox ? 'MozTransform' : win.opera ? '-o-transform' : '';
        },
        html: function(str, x, y) {
          var wrapper = this.createElement('span'),
              element = wrapper.element,
              renderer = wrapper.renderer,
              isSVG = renderer.isSVG,
              addSetters = function(element, style) {
                each(['opacity', 'visibility'], function(prop) {
                  wrap(element, prop + 'Setter', function(proceed, value, key, elem) {
                    proceed.call(this, value, key, elem);
                    style[key] = value;
                  });
                });
              };
          wrapper.textSetter = function(value) {
            if (value !== element.innerHTML) {
              delete this.bBox;
            }
            this.textStr = value;
            element.innerHTML = pick(value, '');
            wrapper.doTransform = true;
          };
          if (isSVG) {
            addSetters(wrapper, wrapper.element.style);
          }
          wrapper.xSetter = wrapper.ySetter = wrapper.alignSetter = wrapper.rotationSetter = function(value, key) {
            if (key === 'align') {
              key = 'textAlign';
            }
            wrapper[key] = value;
            wrapper.doTransform = true;
          };
          wrapper.afterSetters = function() {
            if (this.doTransform) {
              this.htmlUpdateTransform();
              this.doTransform = false;
            }
          };
          wrapper.attr({
            text: str,
            x: Math.round(x),
            y: Math.round(y)
          }).css({position: 'absolute'});
          element.style.whiteSpace = 'nowrap';
          wrapper.css = wrapper.htmlCss;
          if (isSVG) {
            wrapper.add = function(svgGroupWrapper) {
              var htmlGroup,
                  container = renderer.box.parentNode,
                  parentGroup,
                  parents = [];
              this.parentGroup = svgGroupWrapper;
              if (svgGroupWrapper) {
                htmlGroup = svgGroupWrapper.div;
                if (!htmlGroup) {
                  parentGroup = svgGroupWrapper;
                  while (parentGroup) {
                    parents.push(parentGroup);
                    parentGroup = parentGroup.parentGroup;
                  }
                  each(parents.reverse(), function(parentGroup) {
                    var htmlGroupStyle,
                        cls = attr(parentGroup.element, 'class');
                    function translateSetter(value, key) {
                      parentGroup[key] = value;
                      if (key === 'translateX') {
                        htmlGroupStyle.left = value + 'px';
                      } else {
                        htmlGroupStyle.top = value + 'px';
                      }
                      parentGroup.doTransform = true;
                    }
                    if (cls) {
                      cls = {className: cls};
                    }
                    htmlGroup = parentGroup.div = parentGroup.div || createElement('div', cls, {
                      position: 'absolute',
                      left: (parentGroup.translateX || 0) + 'px',
                      top: (parentGroup.translateY || 0) + 'px',
                      display: parentGroup.display,
                      opacity: parentGroup.opacity,
                      pointerEvents: (parentGroup.styles && parentGroup.styles.pointerEvents)
                    }, htmlGroup || container);
                    htmlGroupStyle = htmlGroup.style;
                    extend(parentGroup, {
                      classSetter: (function(htmlGroup) {
                        return function(value) {
                          this.element.setAttribute('class', value);
                          htmlGroup.className = value;
                        };
                      }(htmlGroup)),
                      on: function() {
                        if (parents[0].div) {
                          wrapper.on.apply({element: parents[0].div}, arguments);
                        }
                        return parentGroup;
                      },
                      translateXSetter: translateSetter,
                      translateYSetter: translateSetter
                    });
                    addSetters(parentGroup, htmlGroupStyle);
                  });
                }
              } else {
                htmlGroup = container;
              }
              htmlGroup.appendChild(element);
              wrapper.added = true;
              if (wrapper.alignOnAdd) {
                wrapper.htmlUpdateTransform();
              }
              return wrapper;
            };
          }
          return wrapper;
        }
      });
    }(Highcharts));
    (function(H) {
      var correctFloat = H.correctFloat,
          defined = H.defined,
          destroyObjectProperties = H.destroyObjectProperties,
          isNumber = H.isNumber,
          merge = H.merge,
          pick = H.pick,
          deg2rad = H.deg2rad;
      H.Tick = function(axis, pos, type, noLabel) {
        this.axis = axis;
        this.pos = pos;
        this.type = type || '';
        this.isNew = true;
        this.isNewLabel = true;
        if (!type && !noLabel) {
          this.addLabel();
        }
      };
      H.Tick.prototype = {
        addLabel: function() {
          var tick = this,
              axis = tick.axis,
              options = axis.options,
              chart = axis.chart,
              categories = axis.categories,
              names = axis.names,
              pos = tick.pos,
              labelOptions = options.labels,
              str,
              tickPositions = axis.tickPositions,
              isFirst = pos === tickPositions[0],
              isLast = pos === tickPositions[tickPositions.length - 1],
              value = categories ? pick(categories[pos], names[pos], pos) : pos,
              label = tick.label,
              tickPositionInfo = tickPositions.info,
              dateTimeLabelFormat;
          if (axis.isDatetimeAxis && tickPositionInfo) {
            dateTimeLabelFormat = options.dateTimeLabelFormats[tickPositionInfo.higherRanks[pos] || tickPositionInfo.unitName];
          }
          tick.isFirst = isFirst;
          tick.isLast = isLast;
          str = axis.labelFormatter.call({
            axis: axis,
            chart: chart,
            isFirst: isFirst,
            isLast: isLast,
            dateTimeLabelFormat: dateTimeLabelFormat,
            value: axis.isLog ? correctFloat(axis.lin2log(value)) : value,
            pos: pos
          });
          if (!defined(label)) {
            tick.label = label = defined(str) && labelOptions.enabled ? chart.renderer.text(str, 0, 0, labelOptions.useHTML).add(axis.labelGroup) : null;
            if (label) {
              label.textPxLength = label.getBBox().width;
            }
            tick.rotation = 0;
          } else if (label) {
            label.attr({text: str});
          }
        },
        getLabelSize: function() {
          return this.label ? this.label.getBBox()[this.axis.horiz ? 'height' : 'width'] : 0;
        },
        handleOverflow: function(xy) {
          var axis = this.axis,
              labelOptions = axis.options.labels,
              pxPos = xy.x,
              chartWidth = axis.chart.chartWidth,
              spacing = axis.chart.spacing,
              leftBound = pick(axis.labelLeft, Math.min(axis.pos, spacing[3])),
              rightBound = pick(axis.labelRight, Math.max(!axis.isRadial ? axis.pos + axis.len : 0, chartWidth - spacing[1])),
              label = this.label,
              rotation = this.rotation,
              factor = {
                left: 0,
                center: 0.5,
                right: 1
              }[axis.labelAlign || label.attr('align')],
              labelWidth = label.getBBox().width,
              slotWidth = axis.getSlotWidth(),
              modifiedSlotWidth = slotWidth,
              xCorrection = factor,
              goRight = 1,
              leftPos,
              rightPos,
              textWidth,
              css = {};
          if (!rotation && labelOptions.overflow !== false) {
            leftPos = pxPos - factor * labelWidth;
            rightPos = pxPos + (1 - factor) * labelWidth;
            if (leftPos < leftBound) {
              modifiedSlotWidth = xy.x + modifiedSlotWidth * (1 - factor) - leftBound;
            } else if (rightPos > rightBound) {
              modifiedSlotWidth = rightBound - xy.x + modifiedSlotWidth * factor;
              goRight = -1;
            }
            modifiedSlotWidth = Math.min(slotWidth, modifiedSlotWidth);
            if (modifiedSlotWidth < slotWidth && axis.labelAlign === 'center') {
              xy.x += (goRight * (slotWidth - modifiedSlotWidth - xCorrection * (slotWidth - Math.min(labelWidth, modifiedSlotWidth))));
            }
            if (labelWidth > modifiedSlotWidth || (axis.autoRotation && (label.styles || {}).width)) {
              textWidth = modifiedSlotWidth;
            }
          } else if (rotation < 0 && pxPos - factor * labelWidth < leftBound) {
            textWidth = Math.round(pxPos / Math.cos(rotation * deg2rad) - leftBound);
          } else if (rotation > 0 && pxPos + factor * labelWidth > rightBound) {
            textWidth = Math.round((chartWidth - pxPos) / Math.cos(rotation * deg2rad));
          }
          if (textWidth) {
            css.width = textWidth;
            if (!(labelOptions.style || {}).textOverflow) {
              css.textOverflow = 'ellipsis';
            }
            label.css(css);
          }
        },
        getPosition: function(horiz, pos, tickmarkOffset, old) {
          var axis = this.axis,
              chart = axis.chart,
              cHeight = (old && chart.oldChartHeight) || chart.chartHeight;
          return {
            x: horiz ? H.correctFloat(axis.translate(pos + tickmarkOffset, null, null, old) + axis.transB) : (axis.left + axis.offset + (axis.opposite ? (((old && chart.oldChartWidth) || chart.chartWidth) - axis.right - axis.left) : 0)),
            y: horiz ? (cHeight - axis.bottom + axis.offset - (axis.opposite ? axis.height : 0)) : H.correctFloat(cHeight - axis.translate(pos + tickmarkOffset, null, null, old) - axis.transB)
          };
        },
        getLabelPosition: function(x, y, label, horiz, labelOptions, tickmarkOffset, index, step) {
          var axis = this.axis,
              transA = axis.transA,
              reversed = axis.reversed,
              staggerLines = axis.staggerLines,
              rotCorr = axis.tickRotCorr || {
                x: 0,
                y: 0
              },
              yOffset = labelOptions.y,
              labelOffsetCorrection = (!horiz && !axis.reserveSpaceDefault ? -axis.labelOffset * (axis.labelAlign === 'center' ? 0.5 : 1) : 0),
              line;
          if (!defined(yOffset)) {
            if (axis.side === 0) {
              yOffset = label.rotation ? -8 : -label.getBBox().height;
            } else if (axis.side === 2) {
              yOffset = rotCorr.y + 8;
            } else {
              yOffset = Math.cos(label.rotation * deg2rad) * (rotCorr.y - label.getBBox(false, 0).height / 2);
            }
          }
          x = x + labelOptions.x + labelOffsetCorrection + rotCorr.x - (tickmarkOffset && horiz ? tickmarkOffset * transA * (reversed ? -1 : 1) : 0);
          y = y + yOffset - (tickmarkOffset && !horiz ? tickmarkOffset * transA * (reversed ? 1 : -1) : 0);
          if (staggerLines) {
            line = (index / (step || 1) % staggerLines);
            if (axis.opposite) {
              line = staggerLines - line - 1;
            }
            y += line * (axis.labelOffset / staggerLines);
          }
          return {
            x: x,
            y: Math.round(y)
          };
        },
        getMarkPath: function(x, y, tickLength, tickWidth, horiz, renderer) {
          return renderer.crispLine(['M', x, y, 'L', x + (horiz ? 0 : -tickLength), y + (horiz ? tickLength : 0)], tickWidth);
        },
        renderGridLine: function(old, opacity, reverseCrisp) {
          var tick = this,
              axis = tick.axis,
              options = axis.options,
              gridLine = tick.gridLine,
              gridLinePath,
              attribs = {},
              pos = tick.pos,
              type = tick.type,
              tickmarkOffset = axis.tickmarkOffset,
              renderer = axis.chart.renderer;
          if (!gridLine) {
            if (!type) {
              attribs.zIndex = 1;
            }
            if (old) {
              attribs.opacity = 0;
            }
            tick.gridLine = gridLine = renderer.path().attr(attribs).addClass('highcharts-' + (type ? type + '-' : '') + 'grid-line').add(axis.gridGroup);
          }
          if (!old && gridLine) {
            gridLinePath = axis.getPlotLinePath(pos + tickmarkOffset, gridLine.strokeWidth() * reverseCrisp, old, true);
            if (gridLinePath) {
              gridLine[tick.isNew ? 'attr' : 'animate']({
                d: gridLinePath,
                opacity: opacity
              });
            }
          }
        },
        renderMark: function(xy, opacity, reverseCrisp) {
          var tick = this,
              axis = tick.axis,
              options = axis.options,
              renderer = axis.chart.renderer,
              type = tick.type,
              tickPrefix = type ? type + 'Tick' : 'tick',
              tickSize = axis.tickSize(tickPrefix),
              mark = tick.mark,
              isNewMark = !mark,
              x = xy.x,
              y = xy.y;
          if (tickSize) {
            if (axis.opposite) {
              tickSize[0] = -tickSize[0];
            }
            if (isNewMark) {
              tick.mark = mark = renderer.path().addClass('highcharts-' + (type ? type + '-' : '') + 'tick').add(axis.axisGroup);
            }
            mark[isNewMark ? 'attr' : 'animate']({
              d: tick.getMarkPath(x, y, tickSize[0], mark.strokeWidth() * reverseCrisp, axis.horiz, renderer),
              opacity: opacity
            });
          }
        },
        renderLabel: function(xy, old, opacity, index) {
          var tick = this,
              axis = tick.axis,
              horiz = axis.horiz,
              options = axis.options,
              label = tick.label,
              labelOptions = options.labels,
              step = labelOptions.step,
              tickmarkOffset = axis.tickmarkOffset,
              show = true,
              x = xy.x,
              y = xy.y;
          if (label && isNumber(x)) {
            label.xy = xy = tick.getLabelPosition(x, y, label, horiz, labelOptions, tickmarkOffset, index, step);
            if ((tick.isFirst && !tick.isLast && !pick(options.showFirstLabel, 1)) || (tick.isLast && !tick.isFirst && !pick(options.showLastLabel, 1))) {
              show = false;
            } else if (horiz && !labelOptions.step && !labelOptions.rotation && !old && opacity !== 0) {
              tick.handleOverflow(xy);
            }
            if (step && index % step) {
              show = false;
            }
            if (show && isNumber(xy.y)) {
              xy.opacity = opacity;
              label[tick.isNewLabel ? 'attr' : 'animate'](xy);
              tick.isNewLabel = false;
            } else {
              label.attr('y', -9999);
              tick.isNewLabel = true;
            }
          }
        },
        render: function(index, old, opacity) {
          var tick = this,
              axis = tick.axis,
              horiz = axis.horiz,
              pos = tick.pos,
              tickmarkOffset = axis.tickmarkOffset,
              xy = tick.getPosition(horiz, pos, tickmarkOffset, old),
              x = xy.x,
              y = xy.y,
              reverseCrisp = ((horiz && x === axis.pos + axis.len) || (!horiz && y === axis.pos)) ? -1 : 1;
          opacity = pick(opacity, 1);
          this.isActive = true;
          this.renderGridLine(old, opacity, reverseCrisp);
          this.renderMark(xy, opacity, reverseCrisp);
          this.renderLabel(xy, old, opacity, index);
          tick.isNew = false;
          H.fireEvent(this, 'afterRender');
        },
        destroy: function() {
          destroyObjectProperties(this, this.axis);
        }
      };
    }(Highcharts));
    var Axis = (function(H) {
      var addEvent = H.addEvent,
          animObject = H.animObject,
          arrayMax = H.arrayMax,
          arrayMin = H.arrayMin,
          color = H.color,
          correctFloat = H.correctFloat,
          defaultOptions = H.defaultOptions,
          defined = H.defined,
          deg2rad = H.deg2rad,
          destroyObjectProperties = H.destroyObjectProperties,
          each = H.each,
          extend = H.extend,
          fireEvent = H.fireEvent,
          format = H.format,
          getMagnitude = H.getMagnitude,
          grep = H.grep,
          inArray = H.inArray,
          isArray = H.isArray,
          isNumber = H.isNumber,
          isString = H.isString,
          merge = H.merge,
          normalizeTickInterval = H.normalizeTickInterval,
          objectEach = H.objectEach,
          pick = H.pick,
          removeEvent = H.removeEvent,
          splat = H.splat,
          syncTimeout = H.syncTimeout,
          Tick = H.Tick;
      var Axis = function() {
        this.init.apply(this, arguments);
      };
      H.extend(Axis.prototype, {
        defaultOptions: {
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%e. %b',
            week: '%e. %b',
            month: '%b \'%y',
            year: '%Y'
          },
          endOnTick: false,
          labels: {
            enabled: true,
            x: 0
          },
          maxPadding: 0.01,
          minorTickLength: 2,
          minorTickPosition: 'outside',
          minPadding: 0.01,
          startOfWeek: 1,
          startOnTick: false,
          tickLength: 10,
          tickmarkPlacement: 'between',
          tickPixelInterval: 100,
          tickPosition: 'outside',
          title: {align: 'middle'},
          type: 'linear'
        },
        defaultYAxisOptions: {
          endOnTick: true,
          tickPixelInterval: 72,
          showLastLabel: true,
          labels: {x: -8},
          maxPadding: 0.05,
          minPadding: 0.05,
          startOnTick: true,
          title: {
            rotation: 270,
            text: 'Values'
          },
          stackLabels: {
            allowOverlap: false,
            enabled: false,
            formatter: function() {
              return H.numberFormat(this.total, -1);
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
        init: function(chart, userOptions) {
          var isXAxis = userOptions.isX,
              axis = this;
          axis.chart = chart;
          axis.horiz = chart.inverted && !axis.isZAxis ? !isXAxis : isXAxis;
          axis.isXAxis = isXAxis;
          axis.coll = axis.coll || (isXAxis ? 'xAxis' : 'yAxis');
          axis.opposite = userOptions.opposite;
          axis.side = userOptions.side || (axis.horiz ? (axis.opposite ? 0 : 2) : (axis.opposite ? 1 : 3));
          axis.setOptions(userOptions);
          var options = this.options,
              type = options.type,
              isDatetimeAxis = type === 'datetime';
          axis.labelFormatter = options.labels.formatter || axis.defaultLabelFormatter;
          axis.userOptions = userOptions;
          axis.minPixelPadding = 0;
          axis.reversed = options.reversed;
          axis.visible = options.visible !== false;
          axis.zoomEnabled = options.zoomEnabled !== false;
          axis.hasNames = type === 'category' || options.categories === true;
          axis.categories = options.categories || axis.hasNames;
          if (!axis.names) {
            axis.names = [];
            axis.names.keys = {};
          }
          axis.plotLinesAndBandsGroups = {};
          axis.isLog = type === 'logarithmic';
          axis.isDatetimeAxis = isDatetimeAxis;
          axis.positiveValuesOnly = axis.isLog && !axis.allowNegativeLog;
          axis.isLinked = defined(options.linkedTo);
          axis.ticks = {};
          axis.labelEdge = [];
          axis.minorTicks = {};
          axis.plotLinesAndBands = [];
          axis.alternateBands = {};
          axis.len = 0;
          axis.minRange = axis.userMinRange = options.minRange || options.maxZoom;
          axis.range = options.range;
          axis.offset = options.offset || 0;
          axis.stacks = {};
          axis.oldStacks = {};
          axis.stacksTouched = 0;
          axis.max = null;
          axis.min = null;
          axis.crosshair = pick(options.crosshair, splat(chart.options.tooltip.crosshairs)[isXAxis ? 0 : 1], false);
          var events = axis.options.events;
          if (inArray(axis, chart.axes) === -1) {
            if (isXAxis) {
              chart.axes.splice(chart.xAxis.length, 0, axis);
            } else {
              chart.axes.push(axis);
            }
            chart[axis.coll].push(axis);
          }
          axis.series = axis.series || [];
          if (chart.inverted && !axis.isZAxis && isXAxis && axis.reversed === undefined) {
            axis.reversed = true;
          }
          objectEach(events, function(event, eventType) {
            addEvent(axis, eventType, event);
          });
          axis.lin2log = options.linearToLogConverter || axis.lin2log;
          if (axis.isLog) {
            axis.val2lin = axis.log2lin;
            axis.lin2val = axis.lin2log;
          }
        },
        setOptions: function(userOptions) {
          this.options = merge(this.defaultOptions, this.coll === 'yAxis' && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], merge(defaultOptions[this.coll], userOptions));
        },
        defaultLabelFormatter: function() {
          var axis = this.axis,
              value = this.value,
              time = axis.chart.time,
              categories = axis.categories,
              dateTimeLabelFormat = this.dateTimeLabelFormat,
              lang = defaultOptions.lang,
              numericSymbols = lang.numericSymbols,
              numSymMagnitude = lang.numericSymbolMagnitude || 1000,
              i = numericSymbols && numericSymbols.length,
              multi,
              ret,
              formatOption = axis.options.labels.format,
              numericSymbolDetector = axis.isLog ? Math.abs(value) : axis.tickInterval;
          if (formatOption) {
            ret = format(formatOption, this, time);
          } else if (categories) {
            ret = value;
          } else if (dateTimeLabelFormat) {
            ret = time.dateFormat(dateTimeLabelFormat, value);
          } else if (i && numericSymbolDetector >= 1000) {
            while (i-- && ret === undefined) {
              multi = Math.pow(numSymMagnitude, i + 1);
              if (numericSymbolDetector >= multi && (value * 10) % multi === 0 && numericSymbols[i] !== null && value !== 0) {
                ret = H.numberFormat(value / multi, -1) + numericSymbols[i];
              }
            }
          }
          if (ret === undefined) {
            if (Math.abs(value) >= 10000) {
              ret = H.numberFormat(value, -1);
            } else {
              ret = H.numberFormat(value, -1, undefined, '');
            }
          }
          return ret;
        },
        getSeriesExtremes: function() {
          var axis = this,
              chart = axis.chart;
          axis.hasVisibleSeries = false;
          axis.dataMin = axis.dataMax = axis.threshold = null;
          axis.softThreshold = !axis.isXAxis;
          if (axis.buildStacks) {
            axis.buildStacks();
          }
          each(axis.series, function(series) {
            if (series.visible || !chart.options.chart.ignoreHiddenSeries) {
              var seriesOptions = series.options,
                  xData,
                  threshold = seriesOptions.threshold,
                  seriesDataMin,
                  seriesDataMax;
              axis.hasVisibleSeries = true;
              if (axis.positiveValuesOnly && threshold <= 0) {
                threshold = null;
              }
              if (axis.isXAxis) {
                xData = series.xData;
                if (xData.length) {
                  seriesDataMin = arrayMin(xData);
                  seriesDataMax = arrayMax(xData);
                  if (!isNumber(seriesDataMin) && !(seriesDataMin instanceof Date)) {
                    xData = grep(xData, isNumber);
                    seriesDataMin = arrayMin(xData);
                    seriesDataMax = arrayMax(xData);
                  }
                  if (xData.length) {
                    axis.dataMin = Math.min(pick(axis.dataMin, xData[0], seriesDataMin), seriesDataMin);
                    axis.dataMax = Math.max(pick(axis.dataMax, xData[0], seriesDataMax), seriesDataMax);
                  }
                }
              } else {
                series.getExtremes();
                seriesDataMax = series.dataMax;
                seriesDataMin = series.dataMin;
                if (defined(seriesDataMin) && defined(seriesDataMax)) {
                  axis.dataMin = Math.min(pick(axis.dataMin, seriesDataMin), seriesDataMin);
                  axis.dataMax = Math.max(pick(axis.dataMax, seriesDataMax), seriesDataMax);
                }
                if (defined(threshold)) {
                  axis.threshold = threshold;
                }
                if (!seriesOptions.softThreshold || axis.positiveValuesOnly) {
                  axis.softThreshold = false;
                }
              }
            }
          });
        },
        translate: function(val, backwards, cvsCoord, old, handleLog, pointPlacement) {
          var axis = this.linkedParent || this,
              sign = 1,
              cvsOffset = 0,
              localA = old ? axis.oldTransA : axis.transA,
              localMin = old ? axis.oldMin : axis.min,
              returnValue,
              minPixelPadding = axis.minPixelPadding,
              doPostTranslate = (axis.isOrdinal || axis.isBroken || (axis.isLog && handleLog)) && axis.lin2val;
          if (!localA) {
            localA = axis.transA;
          }
          if (cvsCoord) {
            sign *= -1;
            cvsOffset = axis.len;
          }
          if (axis.reversed) {
            sign *= -1;
            cvsOffset -= sign * (axis.sector || axis.len);
          }
          if (backwards) {
            val = val * sign + cvsOffset;
            val -= minPixelPadding;
            returnValue = val / localA + localMin;
            if (doPostTranslate) {
              returnValue = axis.lin2val(returnValue);
            }
          } else {
            if (doPostTranslate) {
              val = axis.val2lin(val);
            }
            returnValue = isNumber(localMin) ? (sign * (val - localMin) * localA + cvsOffset + (sign * minPixelPadding) + (isNumber(pointPlacement) ? localA * pointPlacement : 0)) : undefined;
          }
          return returnValue;
        },
        toPixels: function(value, paneCoordinates) {
          return this.translate(value, false, !this.horiz, null, true) + (paneCoordinates ? 0 : this.pos);
        },
        toValue: function(pixel, paneCoordinates) {
          return this.translate(pixel - (paneCoordinates ? 0 : this.pos), true, !this.horiz, null, true);
        },
        getPlotLinePath: function(value, lineWidth, old, force, translatedValue) {
          var axis = this,
              chart = axis.chart,
              axisLeft = axis.left,
              axisTop = axis.top,
              x1,
              y1,
              x2,
              y2,
              cHeight = (old && chart.oldChartHeight) || chart.chartHeight,
              cWidth = (old && chart.oldChartWidth) || chart.chartWidth,
              skip,
              transB = axis.transB,
              between = function(x, a, b) {
                if (x < a || x > b) {
                  if (force) {
                    x = Math.min(Math.max(a, x), b);
                  } else {
                    skip = true;
                  }
                }
                return x;
              };
          translatedValue = pick(translatedValue, axis.translate(value, null, null, old));
          translatedValue = Math.min(Math.max(-1e5, translatedValue), 1e5);
          x1 = x2 = Math.round(translatedValue + transB);
          y1 = y2 = Math.round(cHeight - translatedValue - transB);
          if (!isNumber(translatedValue)) {
            skip = true;
            force = false;
          } else if (axis.horiz) {
            y1 = axisTop;
            y2 = cHeight - axis.bottom;
            x1 = x2 = between(x1, axisLeft, axisLeft + axis.width);
          } else {
            x1 = axisLeft;
            x2 = cWidth - axis.right;
            y1 = y2 = between(y1, axisTop, axisTop + axis.height);
          }
          return skip && !force ? null : chart.renderer.crispLine(['M', x1, y1, 'L', x2, y2], lineWidth || 1);
        },
        getLinearTickPositions: function(tickInterval, min, max) {
          var pos,
              lastPos,
              roundedMin = correctFloat(Math.floor(min / tickInterval) * tickInterval),
              roundedMax = correctFloat(Math.ceil(max / tickInterval) * tickInterval),
              tickPositions = [],
              precision;
          if (correctFloat(roundedMin + tickInterval) === roundedMin) {
            precision = 20;
          }
          if (this.single) {
            return [min];
          }
          pos = roundedMin;
          while (pos <= roundedMax) {
            tickPositions.push(pos);
            pos = correctFloat(pos + tickInterval, precision);
            if (pos === lastPos) {
              break;
            }
            lastPos = pos;
          }
          return tickPositions;
        },
        getMinorTickInterval: function() {
          var options = this.options;
          if (options.minorTicks === true) {
            return pick(options.minorTickInterval, 'auto');
          }
          if (options.minorTicks === false) {
            return null;
          }
          return options.minorTickInterval;
        },
        getMinorTickPositions: function() {
          var axis = this,
              options = axis.options,
              tickPositions = axis.tickPositions,
              minorTickInterval = axis.minorTickInterval,
              minorTickPositions = [],
              pos,
              pointRangePadding = axis.pointRangePadding || 0,
              min = axis.min - pointRangePadding,
              max = axis.max + pointRangePadding,
              range = max - min;
          if (range && range / minorTickInterval < axis.len / 3) {
            if (axis.isLog) {
              each(this.paddedTicks, function(pos, i, paddedTicks) {
                if (i) {
                  minorTickPositions.push.apply(minorTickPositions, axis.getLogTickPositions(minorTickInterval, paddedTicks[i - 1], paddedTicks[i], true));
                }
              });
            } else if (axis.isDatetimeAxis && this.getMinorTickInterval() === 'auto') {
              minorTickPositions = minorTickPositions.concat(axis.getTimeTicks(axis.normalizeTimeTickInterval(minorTickInterval), min, max, options.startOfWeek));
            } else {
              for (pos = min + (tickPositions[0] - min) % minorTickInterval; pos <= max; pos += minorTickInterval) {
                if (pos === minorTickPositions[0]) {
                  break;
                }
                minorTickPositions.push(pos);
              }
            }
          }
          if (minorTickPositions.length !== 0) {
            axis.trimTicks(minorTickPositions);
          }
          return minorTickPositions;
        },
        adjustForMinRange: function() {
          var axis = this,
              options = axis.options,
              min = axis.min,
              max = axis.max,
              zoomOffset,
              spaceAvailable,
              closestDataRange,
              i,
              distance,
              xData,
              loopLength,
              minArgs,
              maxArgs,
              minRange;
          if (axis.isXAxis && axis.minRange === undefined && !axis.isLog) {
            if (defined(options.min) || defined(options.max)) {
              axis.minRange = null;
            } else {
              each(axis.series, function(series) {
                xData = series.xData;
                loopLength = series.xIncrement ? 1 : xData.length - 1;
                for (i = loopLength; i > 0; i--) {
                  distance = xData[i] - xData[i - 1];
                  if (closestDataRange === undefined || distance < closestDataRange) {
                    closestDataRange = distance;
                  }
                }
              });
              axis.minRange = Math.min(closestDataRange * 5, axis.dataMax - axis.dataMin);
            }
          }
          if (max - min < axis.minRange) {
            spaceAvailable = axis.dataMax - axis.dataMin >= axis.minRange;
            minRange = axis.minRange;
            zoomOffset = (minRange - max + min) / 2;
            minArgs = [min - zoomOffset, pick(options.min, min - zoomOffset)];
            if (spaceAvailable) {
              minArgs[2] = axis.isLog ? axis.log2lin(axis.dataMin) : axis.dataMin;
            }
            min = arrayMax(minArgs);
            maxArgs = [min + minRange, pick(options.max, min + minRange)];
            if (spaceAvailable) {
              maxArgs[2] = axis.isLog ? axis.log2lin(axis.dataMax) : axis.dataMax;
            }
            max = arrayMin(maxArgs);
            if (max - min < minRange) {
              minArgs[0] = max - minRange;
              minArgs[1] = pick(options.min, max - minRange);
              min = arrayMax(minArgs);
            }
          }
          axis.min = min;
          axis.max = max;
        },
        getClosest: function() {
          var ret;
          if (this.categories) {
            ret = 1;
          } else {
            each(this.series, function(series) {
              var seriesClosest = series.closestPointRange,
                  visible = series.visible || !series.chart.options.chart.ignoreHiddenSeries;
              if (!series.noSharedTooltip && defined(seriesClosest) && visible) {
                ret = defined(ret) ? Math.min(ret, seriesClosest) : seriesClosest;
              }
            });
          }
          return ret;
        },
        nameToX: function(point) {
          var explicitCategories = isArray(this.categories),
              names = explicitCategories ? this.categories : this.names,
              nameX = point.options.x,
              x;
          point.series.requireSorting = false;
          if (!defined(nameX)) {
            nameX = this.options.uniqueNames === false ? point.series.autoIncrement() : (explicitCategories ? inArray(point.name, names) : pick(names.keys[point.name], -1));
          }
          if (nameX === -1) {
            if (!explicitCategories) {
              x = names.length;
            }
          } else {
            x = nameX;
          }
          if (x !== undefined) {
            this.names[x] = point.name;
            this.names.keys[point.name] = x;
          }
          return x;
        },
        updateNames: function() {
          var axis = this,
              names = this.names,
              i = names.length;
          if (i > 0) {
            each(H.keys(names.keys), function(key) {
              delete names.keys[key];
            });
            names.length = 0;
            this.minRange = this.userMinRange;
            each(this.series || [], function(series) {
              series.xIncrement = null;
              if (!series.points || series.isDirtyData) {
                series.processData();
                series.generatePoints();
              }
              each(series.points, function(point, i) {
                var x;
                if (point.options) {
                  x = axis.nameToX(point);
                  if (x !== undefined && x !== point.x) {
                    point.x = x;
                    series.xData[i] = x;
                  }
                }
              });
            });
          }
        },
        setAxisTranslation: function(saveOld) {
          var axis = this,
              range = axis.max - axis.min,
              pointRange = axis.axisPointRange || 0,
              closestPointRange,
              minPointOffset = 0,
              pointRangePadding = 0,
              linkedParent = axis.linkedParent,
              ordinalCorrection,
              hasCategories = !!axis.categories,
              transA = axis.transA,
              isXAxis = axis.isXAxis;
          if (isXAxis || hasCategories || pointRange) {
            closestPointRange = axis.getClosest();
            if (linkedParent) {
              minPointOffset = linkedParent.minPointOffset;
              pointRangePadding = linkedParent.pointRangePadding;
            } else {
              each(axis.series, function(series) {
                var seriesPointRange = hasCategories ? 1 : (isXAxis ? pick(series.options.pointRange, closestPointRange, 0) : (axis.axisPointRange || 0)),
                    pointPlacement = series.options.pointPlacement;
                pointRange = Math.max(pointRange, seriesPointRange);
                if (!axis.single) {
                  minPointOffset = Math.max(minPointOffset, isString(pointPlacement) ? 0 : seriesPointRange / 2);
                  pointRangePadding = Math.max(pointRangePadding, pointPlacement === 'on' ? 0 : seriesPointRange);
                }
              });
            }
            ordinalCorrection = axis.ordinalSlope && closestPointRange ? axis.ordinalSlope / closestPointRange : 1;
            axis.minPointOffset = minPointOffset = minPointOffset * ordinalCorrection;
            axis.pointRangePadding = pointRangePadding = pointRangePadding * ordinalCorrection;
            axis.pointRange = Math.min(pointRange, range);
            if (isXAxis) {
              axis.closestPointRange = closestPointRange;
            }
          }
          if (saveOld) {
            axis.oldTransA = transA;
          }
          axis.translationSlope = axis.transA = transA = axis.options.staticScale || axis.len / ((range + pointRangePadding) || 1);
          axis.transB = axis.horiz ? axis.left : axis.bottom;
          axis.minPixelPadding = transA * minPointOffset;
        },
        minFromRange: function() {
          return this.max - this.range;
        },
        setTickInterval: function(secondPass) {
          var axis = this,
              chart = axis.chart,
              options = axis.options,
              isLog = axis.isLog,
              log2lin = axis.log2lin,
              isDatetimeAxis = axis.isDatetimeAxis,
              isXAxis = axis.isXAxis,
              isLinked = axis.isLinked,
              maxPadding = options.maxPadding,
              minPadding = options.minPadding,
              length,
              linkedParentExtremes,
              tickIntervalOption = options.tickInterval,
              minTickInterval,
              tickPixelIntervalOption = options.tickPixelInterval,
              categories = axis.categories,
              threshold = axis.threshold,
              softThreshold = axis.softThreshold,
              thresholdMin,
              thresholdMax,
              hardMin,
              hardMax;
          if (!isDatetimeAxis && !categories && !isLinked) {
            this.getTickAmount();
          }
          hardMin = pick(axis.userMin, options.min);
          hardMax = pick(axis.userMax, options.max);
          if (isLinked) {
            axis.linkedParent = chart[axis.coll][options.linkedTo];
            linkedParentExtremes = axis.linkedParent.getExtremes();
            axis.min = pick(linkedParentExtremes.min, linkedParentExtremes.dataMin);
            axis.max = pick(linkedParentExtremes.max, linkedParentExtremes.dataMax);
            if (options.type !== axis.linkedParent.options.type) {
              H.error(11, 1);
            }
          } else {
            if (!softThreshold && defined(threshold)) {
              if (axis.dataMin >= threshold) {
                thresholdMin = threshold;
                minPadding = 0;
              } else if (axis.dataMax <= threshold) {
                thresholdMax = threshold;
                maxPadding = 0;
              }
            }
            axis.min = pick(hardMin, thresholdMin, axis.dataMin);
            axis.max = pick(hardMax, thresholdMax, axis.dataMax);
          }
          if (isLog) {
            if (axis.positiveValuesOnly && !secondPass && Math.min(axis.min, pick(axis.dataMin, axis.min)) <= 0) {
              H.error(10, 1);
            }
            axis.min = correctFloat(log2lin(axis.min), 15);
            axis.max = correctFloat(log2lin(axis.max), 15);
          }
          if (axis.range && defined(axis.max)) {
            axis.userMin = axis.min = hardMin = Math.max(axis.dataMin, axis.minFromRange());
            axis.userMax = hardMax = axis.max;
            axis.range = null;
          }
          fireEvent(axis, 'foundExtremes');
          if (axis.beforePadding) {
            axis.beforePadding();
          }
          axis.adjustForMinRange();
          if (!categories && !axis.axisPointRange && !axis.usePercentage && !isLinked && defined(axis.min) && defined(axis.max)) {
            length = axis.max - axis.min;
            if (length) {
              if (!defined(hardMin) && minPadding) {
                axis.min -= length * minPadding;
              }
              if (!defined(hardMax) && maxPadding) {
                axis.max += length * maxPadding;
              }
            }
          }
          if (isNumber(options.softMin) && !isNumber(axis.userMin)) {
            axis.min = Math.min(axis.min, options.softMin);
          }
          if (isNumber(options.softMax) && !isNumber(axis.userMax)) {
            axis.max = Math.max(axis.max, options.softMax);
          }
          if (isNumber(options.floor)) {
            axis.min = Math.max(axis.min, options.floor);
          }
          if (isNumber(options.ceiling)) {
            axis.max = Math.min(axis.max, options.ceiling);
          }
          if (softThreshold && defined(axis.dataMin)) {
            threshold = threshold || 0;
            if (!defined(hardMin) && axis.min < threshold && axis.dataMin >= threshold) {
              axis.min = threshold;
            } else if (!defined(hardMax) && axis.max > threshold && axis.dataMax <= threshold) {
              axis.max = threshold;
            }
          }
          if (axis.min === axis.max || axis.min === undefined || axis.max === undefined) {
            axis.tickInterval = 1;
          } else if (isLinked && !tickIntervalOption && tickPixelIntervalOption === axis.linkedParent.options.tickPixelInterval) {
            axis.tickInterval = tickIntervalOption = axis.linkedParent.tickInterval;
          } else {
            axis.tickInterval = pick(tickIntervalOption, this.tickAmount ? ((axis.max - axis.min) / Math.max(this.tickAmount - 1, 1)) : undefined, categories ? 1 : (axis.max - axis.min) * tickPixelIntervalOption / Math.max(axis.len, tickPixelIntervalOption));
          }
          if (isXAxis && !secondPass) {
            each(axis.series, function(series) {
              series.processData(axis.min !== axis.oldMin || axis.max !== axis.oldMax);
            });
          }
          axis.setAxisTranslation(true);
          if (axis.beforeSetTickPositions) {
            axis.beforeSetTickPositions();
          }
          if (axis.postProcessTickInterval) {
            axis.tickInterval = axis.postProcessTickInterval(axis.tickInterval);
          }
          if (axis.pointRange && !tickIntervalOption) {
            axis.tickInterval = Math.max(axis.pointRange, axis.tickInterval);
          }
          minTickInterval = pick(options.minTickInterval, axis.isDatetimeAxis && axis.closestPointRange);
          if (!tickIntervalOption && axis.tickInterval < minTickInterval) {
            axis.tickInterval = minTickInterval;
          }
          if (!isDatetimeAxis && !isLog && !tickIntervalOption) {
            axis.tickInterval = normalizeTickInterval(axis.tickInterval, null, getMagnitude(axis.tickInterval), pick(options.allowDecimals, !(axis.tickInterval > 0.5 && axis.tickInterval < 5 && axis.max > 1000 && axis.max < 9999)), !!this.tickAmount);
          }
          if (!this.tickAmount) {
            axis.tickInterval = axis.unsquish();
          }
          this.setTickPositions();
        },
        setTickPositions: function() {
          var options = this.options,
              tickPositions,
              tickPositionsOption = options.tickPositions,
              minorTickIntervalOption = this.getMinorTickInterval(),
              tickPositioner = options.tickPositioner,
              startOnTick = options.startOnTick,
              endOnTick = options.endOnTick;
          this.tickmarkOffset = (this.categories && options.tickmarkPlacement === 'between' && this.tickInterval === 1) ? 0.5 : 0;
          this.minorTickInterval = minorTickIntervalOption === 'auto' && this.tickInterval ? this.tickInterval / 5 : minorTickIntervalOption;
          this.single = this.min === this.max && defined(this.min) && !this.tickAmount && (parseInt(this.min, 10) === this.min || options.allowDecimals !== false);
          this.tickPositions = tickPositions = tickPositionsOption && tickPositionsOption.slice();
          if (!tickPositions) {
            if (this.isDatetimeAxis) {
              tickPositions = this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, options.units), this.min, this.max, options.startOfWeek, this.ordinalPositions, this.closestPointRange, true);
            } else if (this.isLog) {
              tickPositions = this.getLogTickPositions(this.tickInterval, this.min, this.max);
            } else {
              tickPositions = this.getLinearTickPositions(this.tickInterval, this.min, this.max);
            }
            if (tickPositions.length > this.len) {
              tickPositions = [tickPositions[0], tickPositions.pop()];
              if (tickPositions[0] === tickPositions[1]) {
                tickPositions.length = 1;
              }
            }
            this.tickPositions = tickPositions;
            if (tickPositioner) {
              tickPositioner = tickPositioner.apply(this, [this.min, this.max]);
              if (tickPositioner) {
                this.tickPositions = tickPositions = tickPositioner;
              }
            }
          }
          this.paddedTicks = tickPositions.slice(0);
          this.trimTicks(tickPositions, startOnTick, endOnTick);
          if (!this.isLinked) {
            if (this.single && tickPositions.length < 2) {
              this.min -= 0.5;
              this.max += 0.5;
            }
            if (!tickPositionsOption && !tickPositioner) {
              this.adjustTickAmount();
            }
          }
        },
        trimTicks: function(tickPositions, startOnTick, endOnTick) {
          var roundedMin = tickPositions[0],
              roundedMax = tickPositions[tickPositions.length - 1],
              minPointOffset = this.minPointOffset || 0;
          if (!this.isLinked) {
            if (startOnTick && roundedMin !== -Infinity) {
              this.min = roundedMin;
            } else {
              while (this.min - minPointOffset > tickPositions[0]) {
                tickPositions.shift();
              }
            }
            if (endOnTick) {
              this.max = roundedMax;
            } else {
              while (this.max + minPointOffset < tickPositions[tickPositions.length - 1]) {
                tickPositions.pop();
              }
            }
            if (tickPositions.length === 0 && defined(roundedMin) && !this.options.tickPositions) {
              tickPositions.push((roundedMax + roundedMin) / 2);
            }
          }
        },
        alignToOthers: function() {
          var others = {},
              hasOther,
              options = this.options;
          if (this.chart.options.chart.alignTicks !== false && options.alignTicks !== false && !this.isLog) {
            each(this.chart[this.coll], function(axis) {
              var otherOptions = axis.options,
                  horiz = axis.horiz,
                  key = [horiz ? otherOptions.left : otherOptions.top, otherOptions.width, otherOptions.height, otherOptions.pane].join(',');
              if (axis.series.length) {
                if (others[key]) {
                  hasOther = true;
                } else {
                  others[key] = 1;
                }
              }
            });
          }
          return hasOther;
        },
        getTickAmount: function() {
          var options = this.options,
              tickAmount = options.tickAmount,
              tickPixelInterval = options.tickPixelInterval;
          if (!defined(options.tickInterval) && this.len < tickPixelInterval && !this.isRadial && !this.isLog && options.startOnTick && options.endOnTick) {
            tickAmount = 2;
          }
          if (!tickAmount && this.alignToOthers()) {
            tickAmount = Math.ceil(this.len / tickPixelInterval) + 1;
          }
          if (tickAmount < 4) {
            this.finalTickAmt = tickAmount;
            tickAmount = 5;
          }
          this.tickAmount = tickAmount;
        },
        adjustTickAmount: function() {
          var tickInterval = this.tickInterval,
              tickPositions = this.tickPositions,
              tickAmount = this.tickAmount,
              finalTickAmt = this.finalTickAmt,
              currentTickAmount = tickPositions && tickPositions.length,
              threshold = pick(this.threshold, this.softThreshold ? 0 : null),
              i,
              len;
          if (this.hasData()) {
            if (currentTickAmount < tickAmount) {
              while (tickPositions.length < tickAmount) {
                if (tickPositions.length % 2 || this.min === threshold) {
                  tickPositions.push(correctFloat(tickPositions[tickPositions.length - 1] + tickInterval));
                } else {
                  tickPositions.unshift(correctFloat(tickPositions[0] - tickInterval));
                }
              }
              this.transA *= (currentTickAmount - 1) / (tickAmount - 1);
              this.min = tickPositions[0];
              this.max = tickPositions[tickPositions.length - 1];
            } else if (currentTickAmount > tickAmount) {
              this.tickInterval *= 2;
              this.setTickPositions();
            }
            if (defined(finalTickAmt)) {
              i = len = tickPositions.length;
              while (i--) {
                if ((finalTickAmt === 3 && i % 2 === 1) || (finalTickAmt <= 2 && i > 0 && i < len - 1)) {
                  tickPositions.splice(i, 1);
                }
              }
              this.finalTickAmt = undefined;
            }
          }
        },
        setScale: function() {
          var axis = this,
              isDirtyData,
              isDirtyAxisLength;
          axis.oldMin = axis.min;
          axis.oldMax = axis.max;
          axis.oldAxisLength = axis.len;
          axis.setAxisSize();
          isDirtyAxisLength = axis.len !== axis.oldAxisLength;
          each(axis.series, function(series) {
            if (series.isDirtyData || series.isDirty || series.xAxis.isDirty) {
              isDirtyData = true;
            }
          });
          if (isDirtyAxisLength || isDirtyData || axis.isLinked || axis.forceRedraw || axis.userMin !== axis.oldUserMin || axis.userMax !== axis.oldUserMax || axis.alignToOthers()) {
            if (axis.resetStacks) {
              axis.resetStacks();
            }
            axis.forceRedraw = false;
            axis.getSeriesExtremes();
            axis.setTickInterval();
            axis.oldUserMin = axis.userMin;
            axis.oldUserMax = axis.userMax;
            if (!axis.isDirty) {
              axis.isDirty = isDirtyAxisLength || axis.min !== axis.oldMin || axis.max !== axis.oldMax;
            }
          } else if (axis.cleanStacks) {
            axis.cleanStacks();
          }
          fireEvent(this, 'afterSetScale');
        },
        setExtremes: function(newMin, newMax, redraw, animation, eventArguments) {
          var axis = this,
              chart = axis.chart;
          redraw = pick(redraw, true);
          each(axis.series, function(serie) {
            delete serie.kdTree;
          });
          eventArguments = extend(eventArguments, {
            min: newMin,
            max: newMax
          });
          fireEvent(axis, 'setExtremes', eventArguments, function() {
            axis.userMin = newMin;
            axis.userMax = newMax;
            axis.eventArgs = eventArguments;
            if (redraw) {
              chart.redraw(animation);
            }
          });
        },
        zoom: function(newMin, newMax) {
          var dataMin = this.dataMin,
              dataMax = this.dataMax,
              options = this.options,
              min = Math.min(dataMin, pick(options.min, dataMin)),
              max = Math.max(dataMax, pick(options.max, dataMax));
          if (newMin !== this.min || newMax !== this.max) {
            if (!this.allowZoomOutside) {
              if (defined(dataMin)) {
                if (newMin < min) {
                  newMin = min;
                }
                if (newMin > max) {
                  newMin = max;
                }
              }
              if (defined(dataMax)) {
                if (newMax < min) {
                  newMax = min;
                }
                if (newMax > max) {
                  newMax = max;
                }
              }
            }
            this.displayBtn = newMin !== undefined || newMax !== undefined;
            this.setExtremes(newMin, newMax, false, undefined, {trigger: 'zoom'});
          }
          return true;
        },
        setAxisSize: function() {
          var chart = this.chart,
              options = this.options,
              offsets = options.offsets || [0, 0, 0, 0],
              horiz = this.horiz,
              width = this.width = Math.round(H.relativeLength(pick(options.width, chart.plotWidth - offsets[3] + offsets[1]), chart.plotWidth)),
              height = this.height = Math.round(H.relativeLength(pick(options.height, chart.plotHeight - offsets[0] + offsets[2]), chart.plotHeight)),
              top = this.top = Math.round(H.relativeLength(pick(options.top, chart.plotTop + offsets[0]), chart.plotHeight, chart.plotTop)),
              left = this.left = Math.round(H.relativeLength(pick(options.left, chart.plotLeft + offsets[3]), chart.plotWidth, chart.plotLeft));
          this.bottom = chart.chartHeight - height - top;
          this.right = chart.chartWidth - width - left;
          this.len = Math.max(horiz ? width : height, 0);
          this.pos = horiz ? left : top;
        },
        getExtremes: function() {
          var axis = this,
              isLog = axis.isLog,
              lin2log = axis.lin2log;
          return {
            min: isLog ? correctFloat(lin2log(axis.min)) : axis.min,
            max: isLog ? correctFloat(lin2log(axis.max)) : axis.max,
            dataMin: axis.dataMin,
            dataMax: axis.dataMax,
            userMin: axis.userMin,
            userMax: axis.userMax
          };
        },
        getThreshold: function(threshold) {
          var axis = this,
              isLog = axis.isLog,
              lin2log = axis.lin2log,
              realMin = isLog ? lin2log(axis.min) : axis.min,
              realMax = isLog ? lin2log(axis.max) : axis.max;
          if (threshold === null) {
            threshold = realMin;
          } else if (realMin > threshold) {
            threshold = realMin;
          } else if (realMax < threshold) {
            threshold = realMax;
          }
          return axis.translate(threshold, 0, 1, 0, 1);
        },
        autoLabelAlign: function(rotation) {
          var ret,
              angle = (pick(rotation, 0) - (this.side * 90) + 720) % 360;
          if (angle > 15 && angle < 165) {
            ret = 'right';
          } else if (angle > 195 && angle < 345) {
            ret = 'left';
          } else {
            ret = 'center';
          }
          return ret;
        },
        tickSize: function(prefix) {
          var options = this.options,
              tickLength = options[prefix + 'Length'],
              tickWidth = pick(options[prefix + 'Width'], prefix === 'tick' && this.isXAxis ? 1 : 0);
          if (tickWidth && tickLength) {
            if (options[prefix + 'Position'] === 'inside') {
              tickLength = -tickLength;
            }
            return [tickLength, tickWidth];
          }
        },
        labelMetrics: function() {
          var index = this.tickPositions && this.tickPositions[0] || 0;
          return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[index] && this.ticks[index].label);
        },
        unsquish: function() {
          var labelOptions = this.options.labels,
              horiz = this.horiz,
              tickInterval = this.tickInterval,
              newTickInterval = tickInterval,
              slotSize = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / tickInterval),
              rotation,
              rotationOption = labelOptions.rotation,
              labelMetrics = this.labelMetrics(),
              step,
              bestScore = Number.MAX_VALUE,
              autoRotation,
              getStep = function(spaceNeeded) {
                var step = spaceNeeded / (slotSize || 1);
                step = step > 1 ? Math.ceil(step) : 1;
                return step * tickInterval;
              };
          if (horiz) {
            autoRotation = !labelOptions.staggerLines && !labelOptions.step && (defined(rotationOption) ? [rotationOption] : slotSize < pick(labelOptions.autoRotationLimit, 80) && labelOptions.autoRotation);
            if (autoRotation) {
              each(autoRotation, function(rot) {
                var score;
                if (rot === rotationOption || (rot && rot >= -90 && rot <= 90)) {
                  step = getStep(Math.abs(labelMetrics.h / Math.sin(deg2rad * rot)));
                  score = step + Math.abs(rot / 360);
                  if (score < bestScore) {
                    bestScore = score;
                    rotation = rot;
                    newTickInterval = step;
                  }
                }
              });
            }
          } else if (!labelOptions.step) {
            newTickInterval = getStep(labelMetrics.h);
          }
          this.autoRotation = autoRotation;
          this.labelRotation = pick(rotation, rotationOption);
          return newTickInterval;
        },
        getSlotWidth: function() {
          var chart = this.chart,
              horiz = this.horiz,
              labelOptions = this.options.labels,
              slotCount = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1),
              marginLeft = chart.margin[3];
          return (horiz && (labelOptions.step || 0) < 2 && !labelOptions.rotation && ((this.staggerLines || 1) * this.len) / slotCount) || (!horiz && ((labelOptions.style && parseInt(labelOptions.style.width, 10)) || (marginLeft && (marginLeft - chart.spacing[3])) || chart.chartWidth * 0.33));
        },
        renderUnsquish: function() {
          var chart = this.chart,
              renderer = chart.renderer,
              tickPositions = this.tickPositions,
              ticks = this.ticks,
              labelOptions = this.options.labels,
              horiz = this.horiz,
              slotWidth = this.getSlotWidth(),
              innerWidth = Math.max(1, Math.round(slotWidth - 2 * (labelOptions.padding || 5))),
              attr = {},
              labelMetrics = this.labelMetrics(),
              textOverflowOption = labelOptions.style && labelOptions.style.textOverflow,
              commonWidth,
              commonTextOverflow,
              maxLabelLength = 0,
              label,
              i,
              pos;
          if (!isString(labelOptions.rotation)) {
            attr.rotation = labelOptions.rotation || 0;
          }
          each(tickPositions, function(tick) {
            tick = ticks[tick];
            if (tick && tick.label && tick.label.textPxLength > maxLabelLength) {
              maxLabelLength = tick.label.textPxLength;
            }
          });
          this.maxLabelLength = maxLabelLength;
          if (this.autoRotation) {
            if (maxLabelLength > innerWidth && maxLabelLength > labelMetrics.h) {
              attr.rotation = this.labelRotation;
            } else {
              this.labelRotation = 0;
            }
          } else if (slotWidth) {
            commonWidth = innerWidth;
            if (!textOverflowOption) {
              commonTextOverflow = 'clip';
              i = tickPositions.length;
              while (!horiz && i--) {
                pos = tickPositions[i];
                label = ticks[pos].label;
                if (label) {
                  if (label.styles && label.styles.textOverflow === 'ellipsis') {
                    label.css({textOverflow: 'clip'});
                  } else if (label.textPxLength > slotWidth) {
                    label.css({width: slotWidth + 'px'});
                  }
                  if (label.getBBox().height > (this.len / tickPositions.length - (labelMetrics.h - labelMetrics.f))) {
                    label.specificTextOverflow = 'ellipsis';
                  }
                }
              }
            }
          }
          if (attr.rotation) {
            commonWidth = (maxLabelLength > chart.chartHeight * 0.5 ? chart.chartHeight * 0.33 : chart.chartHeight);
            if (!textOverflowOption) {
              commonTextOverflow = 'ellipsis';
            }
          }
          this.labelAlign = labelOptions.align || this.autoLabelAlign(this.labelRotation);
          if (this.labelAlign) {
            attr.align = this.labelAlign;
          }
          each(tickPositions, function(pos) {
            var tick = ticks[pos],
                label = tick && tick.label;
            if (label) {
              label.attr(attr);
              if (commonWidth && !(labelOptions.style && labelOptions.style.width) && (commonWidth < label.textPxLength || label.element.tagName === 'SPAN')) {
                label.css({
                  width: commonWidth,
                  textOverflow: (label.specificTextOverflow || commonTextOverflow)
                });
              }
              delete label.specificTextOverflow;
              tick.rotation = attr.rotation;
            }
          });
          this.tickRotCorr = renderer.rotCorr(labelMetrics.b, this.labelRotation || 0, this.side !== 0);
        },
        hasData: function() {
          return (this.hasVisibleSeries || (defined(this.min) && defined(this.max) && this.tickPositions && this.tickPositions.length > 0));
        },
        addTitle: function(display) {
          var axis = this,
              renderer = axis.chart.renderer,
              horiz = axis.horiz,
              opposite = axis.opposite,
              options = axis.options,
              axisTitleOptions = options.title,
              textAlign;
          if (!axis.axisTitle) {
            textAlign = axisTitleOptions.textAlign;
            if (!textAlign) {
              textAlign = (horiz ? {
                low: 'left',
                middle: 'center',
                high: 'right'
              } : {
                low: opposite ? 'right' : 'left',
                middle: 'center',
                high: opposite ? 'left' : 'right'
              })[axisTitleOptions.align];
            }
            axis.axisTitle = renderer.text(axisTitleOptions.text, 0, 0, axisTitleOptions.useHTML).attr({
              zIndex: 7,
              rotation: axisTitleOptions.rotation || 0,
              align: textAlign
            }).addClass('highcharts-axis-title').add(axis.axisGroup);
            axis.axisTitle.isNew = true;
          }
          axis.axisTitle.css({width: axis.len});
          axis.axisTitle[display ? 'show' : 'hide'](true);
        },
        generateTick: function(pos) {
          var ticks = this.ticks;
          if (!ticks[pos]) {
            ticks[pos] = new Tick(this, pos);
          } else {
            ticks[pos].addLabel();
          }
        },
        getOffset: function() {
          var axis = this,
              chart = axis.chart,
              renderer = chart.renderer,
              options = axis.options,
              tickPositions = axis.tickPositions,
              ticks = axis.ticks,
              horiz = axis.horiz,
              side = axis.side,
              invertedSide = chart.inverted && !axis.isZAxis ? [1, 0, 3, 2][side] : side,
              hasData,
              showAxis,
              titleOffset = 0,
              titleOffsetOption,
              titleMargin = 0,
              axisTitleOptions = options.title,
              labelOptions = options.labels,
              labelOffset = 0,
              labelOffsetPadded,
              axisOffset = chart.axisOffset,
              clipOffset = chart.clipOffset,
              clip,
              directionFactor = [-1, 1, 1, -1][side],
              className = options.className,
              axisParent = axis.axisParent,
              lineHeightCorrection,
              tickSize = this.tickSize('tick');
          hasData = axis.hasData();
          axis.showAxis = showAxis = hasData || pick(options.showEmpty, true);
          axis.staggerLines = axis.horiz && labelOptions.staggerLines;
          if (!axis.axisGroup) {
            axis.gridGroup = renderer.g('grid').attr({zIndex: options.gridZIndex || 1}).addClass('highcharts-' + this.coll.toLowerCase() + '-grid ' + (className || '')).add(axisParent);
            axis.axisGroup = renderer.g('axis').attr({zIndex: options.zIndex || 2}).addClass('highcharts-' + this.coll.toLowerCase() + ' ' + (className || '')).add(axisParent);
            axis.labelGroup = renderer.g('axis-labels').attr({zIndex: labelOptions.zIndex || 7}).addClass('highcharts-' + axis.coll.toLowerCase() + '-labels ' + (className || '')).add(axisParent);
          }
          if (hasData || axis.isLinked) {
            each(tickPositions, function(pos, i) {
              axis.generateTick(pos, i);
            });
            axis.renderUnsquish();
            axis.reserveSpaceDefault = (side === 0 || side === 2 || {
              1: 'left',
              3: 'right'
            }[side] === axis.labelAlign);
            if (pick(labelOptions.reserveSpace, axis.labelAlign === 'center' ? true : null, axis.reserveSpaceDefault)) {
              each(tickPositions, function(pos) {
                labelOffset = Math.max(ticks[pos].getLabelSize(), labelOffset);
              });
            }
            if (axis.staggerLines) {
              labelOffset *= axis.staggerLines;
            }
            axis.labelOffset = labelOffset * (axis.opposite ? -1 : 1);
          } else {
            objectEach(ticks, function(tick, n) {
              tick.destroy();
              delete ticks[n];
            });
          }
          if (axisTitleOptions && axisTitleOptions.text && axisTitleOptions.enabled !== false) {
            axis.addTitle(showAxis);
            if (showAxis && axisTitleOptions.reserveSpace !== false) {
              axis.titleOffset = titleOffset = axis.axisTitle.getBBox()[horiz ? 'height' : 'width'];
              titleOffsetOption = axisTitleOptions.offset;
              titleMargin = defined(titleOffsetOption) ? 0 : pick(axisTitleOptions.margin, horiz ? 5 : 10);
            }
          }
          axis.renderLine();
          axis.offset = directionFactor * pick(options.offset, axisOffset[side]);
          axis.tickRotCorr = axis.tickRotCorr || {
            x: 0,
            y: 0
          };
          if (side === 0) {
            lineHeightCorrection = -axis.labelMetrics().h;
          } else if (side === 2) {
            lineHeightCorrection = axis.tickRotCorr.y;
          } else {
            lineHeightCorrection = 0;
          }
          labelOffsetPadded = Math.abs(labelOffset) + titleMargin;
          if (labelOffset) {
            labelOffsetPadded -= lineHeightCorrection;
            labelOffsetPadded += directionFactor * (horiz ? pick(labelOptions.y, axis.tickRotCorr.y + directionFactor * 8) : labelOptions.x);
          }
          axis.axisTitleMargin = pick(titleOffsetOption, labelOffsetPadded);
          axisOffset[side] = Math.max(axisOffset[side], axis.axisTitleMargin + titleOffset + directionFactor * axis.offset, labelOffsetPadded, hasData && tickPositions.length && tickSize ? tickSize[0] + directionFactor * axis.offset : 0);
          clip = options.offset ? 0 : Math.floor(axis.axisLine.strokeWidth() / 2) * 2;
          clipOffset[invertedSide] = Math.max(clipOffset[invertedSide], clip);
        },
        getLinePath: function(lineWidth) {
          var chart = this.chart,
              opposite = this.opposite,
              offset = this.offset,
              horiz = this.horiz,
              lineLeft = this.left + (opposite ? this.width : 0) + offset,
              lineTop = chart.chartHeight - this.bottom - (opposite ? this.height : 0) + offset;
          if (opposite) {
            lineWidth *= -1;
          }
          return chart.renderer.crispLine(['M', horiz ? this.left : lineLeft, horiz ? lineTop : this.top, 'L', horiz ? chart.chartWidth - this.right : lineLeft, horiz ? lineTop : chart.chartHeight - this.bottom], lineWidth);
        },
        renderLine: function() {
          if (!this.axisLine) {
            this.axisLine = this.chart.renderer.path().addClass('highcharts-axis-line').add(this.axisGroup);
          }
        },
        getTitlePosition: function() {
          var horiz = this.horiz,
              axisLeft = this.left,
              axisTop = this.top,
              axisLength = this.len,
              axisTitleOptions = this.options.title,
              margin = horiz ? axisLeft : axisTop,
              opposite = this.opposite,
              offset = this.offset,
              xOption = axisTitleOptions.x || 0,
              yOption = axisTitleOptions.y || 0,
              axisTitle = this.axisTitle,
              fontMetrics = this.chart.renderer.fontMetrics(axisTitleOptions.style && axisTitleOptions.style.fontSize, axisTitle),
              textHeightOvershoot = Math.max(axisTitle.getBBox(null, 0).height - fontMetrics.h - 1, 0),
              alongAxis = {
                low: margin + (horiz ? 0 : axisLength),
                middle: margin + axisLength / 2,
                high: margin + (horiz ? axisLength : 0)
              }[axisTitleOptions.align],
              offAxis = (horiz ? axisTop + this.height : axisLeft) + (horiz ? 1 : -1) * (opposite ? -1 : 1) * this.axisTitleMargin + [-textHeightOvershoot, textHeightOvershoot, fontMetrics.f, -textHeightOvershoot][this.side];
          return {
            x: horiz ? alongAxis + xOption : offAxis + (opposite ? this.width : 0) + offset + xOption,
            y: horiz ? offAxis + yOption - (opposite ? this.height : 0) + offset : alongAxis + yOption
          };
        },
        renderMinorTick: function(pos) {
          var slideInTicks = this.chart.hasRendered && isNumber(this.oldMin),
              minorTicks = this.minorTicks;
          if (!minorTicks[pos]) {
            minorTicks[pos] = new Tick(this, pos, 'minor');
          }
          if (slideInTicks && minorTicks[pos].isNew) {
            minorTicks[pos].render(null, true);
          }
          minorTicks[pos].render(null, false, 1);
        },
        renderTick: function(pos, i) {
          var isLinked = this.isLinked,
              ticks = this.ticks,
              slideInTicks = this.chart.hasRendered && isNumber(this.oldMin);
          if (!isLinked || (pos >= this.min && pos <= this.max)) {
            if (!ticks[pos]) {
              ticks[pos] = new Tick(this, pos);
            }
            if (slideInTicks && ticks[pos].isNew) {
              ticks[pos].render(i, true, 0.1);
            }
            ticks[pos].render(i);
          }
        },
        render: function() {
          var axis = this,
              chart = axis.chart,
              renderer = chart.renderer,
              options = axis.options,
              isLog = axis.isLog,
              lin2log = axis.lin2log,
              isLinked = axis.isLinked,
              tickPositions = axis.tickPositions,
              axisTitle = axis.axisTitle,
              ticks = axis.ticks,
              minorTicks = axis.minorTicks,
              alternateBands = axis.alternateBands,
              stackLabelOptions = options.stackLabels,
              alternateGridColor = options.alternateGridColor,
              tickmarkOffset = axis.tickmarkOffset,
              axisLine = axis.axisLine,
              showAxis = axis.showAxis,
              animation = animObject(renderer.globalAnimation),
              from,
              to;
          axis.labelEdge.length = 0;
          axis.overlap = false;
          each([ticks, minorTicks, alternateBands], function(coll) {
            objectEach(coll, function(tick) {
              tick.isActive = false;
            });
          });
          if (axis.hasData() || isLinked) {
            if (axis.minorTickInterval && !axis.categories) {
              each(axis.getMinorTickPositions(), function(pos) {
                axis.renderMinorTick(pos);
              });
            }
            if (tickPositions.length) {
              each(tickPositions, function(pos, i) {
                axis.renderTick(pos, i);
              });
              if (tickmarkOffset && (axis.min === 0 || axis.single)) {
                if (!ticks[-1]) {
                  ticks[-1] = new Tick(axis, -1, null, true);
                }
                ticks[-1].render(-1);
              }
            }
            if (alternateGridColor) {
              each(tickPositions, function(pos, i) {
                to = tickPositions[i + 1] !== undefined ? tickPositions[i + 1] + tickmarkOffset : axis.max - tickmarkOffset;
                if (i % 2 === 0 && pos < axis.max && to <= axis.max + (chart.polar ? -tickmarkOffset : tickmarkOffset)) {
                  if (!alternateBands[pos]) {
                    alternateBands[pos] = new H.PlotLineOrBand(axis);
                  }
                  from = pos + tickmarkOffset;
                  alternateBands[pos].options = {
                    from: isLog ? lin2log(from) : from,
                    to: isLog ? lin2log(to) : to,
                    color: alternateGridColor
                  };
                  alternateBands[pos].render();
                  alternateBands[pos].isActive = true;
                }
              });
            }
            if (!axis._addedPlotLB) {
              each((options.plotLines || []).concat(options.plotBands || []), function(plotLineOptions) {
                axis.addPlotBandOrLine(plotLineOptions);
              });
              axis._addedPlotLB = true;
            }
          }
          each([ticks, minorTicks, alternateBands], function(coll) {
            var i,
                forDestruction = [],
                delay = animation.duration,
                destroyInactiveItems = function() {
                  i = forDestruction.length;
                  while (i--) {
                    if (coll[forDestruction[i]] && !coll[forDestruction[i]].isActive) {
                      coll[forDestruction[i]].destroy();
                      delete coll[forDestruction[i]];
                    }
                  }
                };
            objectEach(coll, function(tick, pos) {
              if (!tick.isActive) {
                tick.render(pos, false, 0);
                tick.isActive = false;
                forDestruction.push(pos);
              }
            });
            syncTimeout(destroyInactiveItems, coll === alternateBands || !chart.hasRendered || !delay ? 0 : delay);
          });
          if (axisLine) {
            axisLine[axisLine.isPlaced ? 'animate' : 'attr']({d: this.getLinePath(axisLine.strokeWidth())});
            axisLine.isPlaced = true;
            axisLine[showAxis ? 'show' : 'hide'](true);
          }
          if (axisTitle && showAxis) {
            var titleXy = axis.getTitlePosition();
            if (isNumber(titleXy.y)) {
              axisTitle[axisTitle.isNew ? 'attr' : 'animate'](titleXy);
              axisTitle.isNew = false;
            } else {
              axisTitle.attr('y', -9999);
              axisTitle.isNew = true;
            }
          }
          if (stackLabelOptions && stackLabelOptions.enabled) {
            axis.renderStackTotals();
          }
          axis.isDirty = false;
        },
        redraw: function() {
          if (this.visible) {
            this.render();
            each(this.plotLinesAndBands, function(plotLine) {
              plotLine.render();
            });
          }
          each(this.series, function(series) {
            series.isDirty = true;
          });
        },
        keepProps: ['extKey', 'hcEvents', 'names', 'series', 'userMax', 'userMin'],
        destroy: function(keepEvents) {
          var axis = this,
              stacks = axis.stacks,
              plotLinesAndBands = axis.plotLinesAndBands,
              plotGroup,
              i;
          if (!keepEvents) {
            removeEvent(axis);
          }
          objectEach(stacks, function(stack, stackKey) {
            destroyObjectProperties(stack);
            stacks[stackKey] = null;
          });
          each([axis.ticks, axis.minorTicks, axis.alternateBands], function(coll) {
            destroyObjectProperties(coll);
          });
          if (plotLinesAndBands) {
            i = plotLinesAndBands.length;
            while (i--) {
              plotLinesAndBands[i].destroy();
            }
          }
          each(['stackTotalGroup', 'axisLine', 'axisTitle', 'axisGroup', 'gridGroup', 'labelGroup', 'cross'], function(prop) {
            if (axis[prop]) {
              axis[prop] = axis[prop].destroy();
            }
          });
          for (plotGroup in axis.plotLinesAndBandsGroups) {
            axis.plotLinesAndBandsGroups[plotGroup] = axis.plotLinesAndBandsGroups[plotGroup].destroy();
          }
          objectEach(axis, function(val, key) {
            if (inArray(key, axis.keepProps) === -1) {
              delete axis[key];
            }
          });
        },
        drawCrosshair: function(e, point) {
          var path,
              options = this.crosshair,
              snap = pick(options.snap, true),
              pos,
              categorized,
              graphic = this.cross;
          if (!e) {
            e = this.cross && this.cross.e;
          }
          if (!this.crosshair || ((defined(point) || !snap) === false)) {
            this.hideCrosshair();
          } else {
            if (!snap) {
              pos = e && (this.horiz ? e.chartX - this.pos : this.len - e.chartY + this.pos);
            } else if (defined(point)) {
              pos = this.isXAxis ? point.plotX : this.len - point.plotY;
            }
            if (defined(pos)) {
              path = this.getPlotLinePath(point && (this.isXAxis ? point.x : pick(point.stackY, point.y)), null, null, null, pos) || null;
            }
            if (!defined(path)) {
              this.hideCrosshair();
              return;
            }
            categorized = this.categories && !this.isRadial;
            if (!graphic) {
              this.cross = graphic = this.chart.renderer.path().addClass('highcharts-crosshair highcharts-crosshair-' + (categorized ? 'category ' : 'thin ') + options.className).attr({zIndex: pick(options.zIndex, 2)}).add();
            }
            graphic.show().attr({d: path});
            if (categorized && !options.width) {
              graphic.attr({'stroke-width': this.transA});
            }
            this.cross.e = e;
          }
        },
        hideCrosshair: function() {
          if (this.cross) {
            this.cross.hide();
          }
        }
      });
      H.Axis = Axis;
      return Axis;
    }(Highcharts));
    (function(H) {
      var Axis = H.Axis,
          getMagnitude = H.getMagnitude,
          map = H.map,
          normalizeTickInterval = H.normalizeTickInterval,
          pick = H.pick;
      Axis.prototype.getLogTickPositions = function(interval, min, max, minor) {
        var axis = this,
            options = axis.options,
            axisLength = axis.len,
            lin2log = axis.lin2log,
            log2lin = axis.log2lin,
            positions = [];
        if (!minor) {
          axis._minorAutoInterval = null;
        }
        if (interval >= 0.5) {
          interval = Math.round(interval);
          positions = axis.getLinearTickPositions(interval, min, max);
        } else if (interval >= 0.08) {
          var roundedMin = Math.floor(min),
              intermediate,
              i,
              j,
              len,
              pos,
              lastPos,
              break2;
          if (interval > 0.3) {
            intermediate = [1, 2, 4];
          } else if (interval > 0.15) {
            intermediate = [1, 2, 4, 6, 8];
          } else {
            intermediate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          }
          for (i = roundedMin; i < max + 1 && !break2; i++) {
            len = intermediate.length;
            for (j = 0; j < len && !break2; j++) {
              pos = log2lin(lin2log(i) * intermediate[j]);
              if (pos > min && (!minor || lastPos <= max) && lastPos !== undefined) {
                positions.push(lastPos);
              }
              if (lastPos > max) {
                break2 = true;
              }
              lastPos = pos;
            }
          }
        } else {
          var realMin = lin2log(min),
              realMax = lin2log(max),
              tickIntervalOption = minor ? this.getMinorTickInterval() : options.tickInterval,
              filteredTickIntervalOption = tickIntervalOption === 'auto' ? null : tickIntervalOption,
              tickPixelIntervalOption = options.tickPixelInterval / (minor ? 5 : 1),
              totalPixelLength = minor ? axisLength / axis.tickPositions.length : axisLength;
          interval = pick(filteredTickIntervalOption, axis._minorAutoInterval, (realMax - realMin) * tickPixelIntervalOption / (totalPixelLength || 1));
          interval = normalizeTickInterval(interval, null, getMagnitude(interval));
          positions = map(axis.getLinearTickPositions(interval, realMin, realMax), log2lin);
          if (!minor) {
            axis._minorAutoInterval = interval / 5;
          }
        }
        if (!minor) {
          axis.tickInterval = interval;
        }
        return positions;
      };
      Axis.prototype.log2lin = function(num) {
        return Math.log(num) / Math.LN10;
      };
      Axis.prototype.lin2log = function(num) {
        return Math.pow(10, num);
      };
    }(Highcharts));
    (function(H, Axis) {
      var arrayMax = H.arrayMax,
          arrayMin = H.arrayMin,
          defined = H.defined,
          destroyObjectProperties = H.destroyObjectProperties,
          each = H.each,
          erase = H.erase,
          merge = H.merge,
          pick = H.pick;
      H.PlotLineOrBand = function(axis, options) {
        this.axis = axis;
        if (options) {
          this.options = options;
          this.id = options.id;
        }
      };
      H.PlotLineOrBand.prototype = {
        render: function() {
          var plotLine = this,
              axis = plotLine.axis,
              horiz = axis.horiz,
              options = plotLine.options,
              optionsLabel = options.label,
              label = plotLine.label,
              to = options.to,
              from = options.from,
              value = options.value,
              isBand = defined(from) && defined(to),
              isLine = defined(value),
              svgElem = plotLine.svgElem,
              isNew = !svgElem,
              path = [],
              color = options.color,
              zIndex = pick(options.zIndex, 0),
              events = options.events,
              attribs = {'class': 'highcharts-plot-' + (isBand ? 'band ' : 'line ') + (options.className || '')},
              groupAttribs = {},
              renderer = axis.chart.renderer,
              groupName = isBand ? 'bands' : 'lines',
              group,
              log2lin = axis.log2lin;
          if (axis.isLog) {
            from = log2lin(from);
            to = log2lin(to);
            value = log2lin(value);
          }
          groupAttribs.zIndex = zIndex;
          groupName += '-' + zIndex;
          group = axis.plotLinesAndBandsGroups[groupName];
          if (!group) {
            axis.plotLinesAndBandsGroups[groupName] = group = renderer.g('plot-' + groupName).attr(groupAttribs).add();
          }
          if (isNew) {
            plotLine.svgElem = svgElem = renderer.path().attr(attribs).add(group);
          }
          if (isLine) {
            path = axis.getPlotLinePath(value, svgElem.strokeWidth());
          } else if (isBand) {
            path = axis.getPlotBandPath(from, to, options);
          } else {
            return;
          }
          if (isNew && path && path.length) {
            svgElem.attr({d: path});
            if (events) {
              H.objectEach(events, function(event, eventType) {
                svgElem.on(eventType, function(e) {
                  events[eventType].apply(plotLine, [e]);
                });
              });
            }
          } else if (svgElem) {
            if (path) {
              svgElem.show();
              svgElem.animate({d: path});
            } else {
              svgElem.hide();
              if (label) {
                plotLine.label = label = label.destroy();
              }
            }
          }
          if (optionsLabel && defined(optionsLabel.text) && path && path.length && axis.width > 0 && axis.height > 0 && !path.flat) {
            optionsLabel = merge({
              align: horiz && isBand && 'center',
              x: horiz ? !isBand && 4 : 10,
              verticalAlign: !horiz && isBand && 'middle',
              y: horiz ? isBand ? 16 : 10 : isBand ? 6 : -4,
              rotation: horiz && !isBand && 90
            }, optionsLabel);
            this.renderLabel(optionsLabel, path, isBand, zIndex);
          } else if (label) {
            label.hide();
          }
          return plotLine;
        },
        renderLabel: function(optionsLabel, path, isBand, zIndex) {
          var plotLine = this,
              label = plotLine.label,
              renderer = plotLine.axis.chart.renderer,
              attribs,
              xBounds,
              yBounds,
              x,
              y;
          if (!label) {
            attribs = {
              align: optionsLabel.textAlign || optionsLabel.align,
              rotation: optionsLabel.rotation,
              'class': 'highcharts-plot-' + (isBand ? 'band' : 'line') + '-label ' + (optionsLabel.className || '')
            };
            attribs.zIndex = zIndex;
            plotLine.label = label = renderer.text(optionsLabel.text, 0, 0, optionsLabel.useHTML).attr(attribs).add();
          }
          xBounds = path.xBounds || [path[1], path[4], (isBand ? path[6] : path[1])];
          yBounds = path.yBounds || [path[2], path[5], (isBand ? path[7] : path[2])];
          x = arrayMin(xBounds);
          y = arrayMin(yBounds);
          label.align(optionsLabel, false, {
            x: x,
            y: y,
            width: arrayMax(xBounds) - x,
            height: arrayMax(yBounds) - y
          });
          label.show();
        },
        destroy: function() {
          erase(this.axis.plotLinesAndBands, this);
          delete this.axis;
          destroyObjectProperties(this);
        }
      };
      H.extend(Axis.prototype, {
        getPlotBandPath: function(from, to) {
          var toPath = this.getPlotLinePath(to, null, null, true),
              path = this.getPlotLinePath(from, null, null, true),
              result = [],
              i,
              horiz = this.horiz,
              plus = 1,
              flat,
              outside = (from < this.min && to < this.min) || (from > this.max && to > this.max);
          if (path && toPath) {
            if (outside) {
              flat = path.toString() === toPath.toString();
              plus = 0;
            }
            for (i = 0; i < path.length; i += 6) {
              if (horiz && toPath[i + 1] === path[i + 1]) {
                toPath[i + 1] += plus;
                toPath[i + 4] += plus;
              } else if (!horiz && toPath[i + 2] === path[i + 2]) {
                toPath[i + 2] += plus;
                toPath[i + 5] += plus;
              }
              result.push('M', path[i + 1], path[i + 2], 'L', path[i + 4], path[i + 5], toPath[i + 4], toPath[i + 5], toPath[i + 1], toPath[i + 2], 'z');
              result.flat = flat;
            }
          } else {
            path = null;
          }
          return result;
        },
        addPlotBand: function(options) {
          return this.addPlotBandOrLine(options, 'plotBands');
        },
        addPlotLine: function(options) {
          return this.addPlotBandOrLine(options, 'plotLines');
        },
        addPlotBandOrLine: function(options, coll) {
          var obj = new H.PlotLineOrBand(this, options).render(),
              userOptions = this.userOptions;
          if (obj) {
            if (coll) {
              userOptions[coll] = userOptions[coll] || [];
              userOptions[coll].push(options);
            }
            this.plotLinesAndBands.push(obj);
          }
          return obj;
        },
        removePlotBandOrLine: function(id) {
          var plotLinesAndBands = this.plotLinesAndBands,
              options = this.options,
              userOptions = this.userOptions,
              i = plotLinesAndBands.length;
          while (i--) {
            if (plotLinesAndBands[i].id === id) {
              plotLinesAndBands[i].destroy();
            }
          }
          each([options.plotLines || [], userOptions.plotLines || [], options.plotBands || [], userOptions.plotBands || []], function(arr) {
            i = arr.length;
            while (i--) {
              if (arr[i].id === id) {
                erase(arr, arr[i]);
              }
            }
          });
        },
        removePlotBand: function(id) {
          this.removePlotBandOrLine(id);
        },
        removePlotLine: function(id) {
          this.removePlotBandOrLine(id);
        }
      });
    }(Highcharts, Axis));
    (function(H) {
      var each = H.each,
          extend = H.extend,
          format = H.format,
          isNumber = H.isNumber,
          map = H.map,
          merge = H.merge,
          pick = H.pick,
          splat = H.splat,
          syncTimeout = H.syncTimeout,
          timeUnits = H.timeUnits;
      H.Tooltip = function() {
        this.init.apply(this, arguments);
      };
      H.Tooltip.prototype = {
        init: function(chart, options) {
          this.chart = chart;
          this.options = options;
          this.crosshairs = [];
          this.now = {
            x: 0,
            y: 0
          };
          this.isHidden = true;
          this.split = options.split && !chart.inverted;
          this.shared = options.shared || this.split;
        },
        cleanSplit: function(force) {
          each(this.chart.series, function(series) {
            var tt = series && series.tt;
            if (tt) {
              if (!tt.isActive || force) {
                series.tt = tt.destroy();
              } else {
                tt.isActive = false;
              }
            }
          });
        },
        applyFilter: function() {
          var chart = this.chart;
          chart.renderer.definition({
            tagName: 'filter',
            id: 'drop-shadow-' + chart.index,
            opacity: 0.5,
            children: [{
              tagName: 'feGaussianBlur',
              in: 'SourceAlpha',
              stdDeviation: 1
            }, {
              tagName: 'feOffset',
              dx: 1,
              dy: 1
            }, {
              tagName: 'feComponentTransfer',
              children: [{
                tagName: 'feFuncA',
                type: 'linear',
                slope: 0.3
              }]
            }, {
              tagName: 'feMerge',
              children: [{tagName: 'feMergeNode'}, {
                tagName: 'feMergeNode',
                in: 'SourceGraphic'
              }]
            }]
          });
          chart.renderer.definition({
            tagName: 'style',
            textContent: '.highcharts-tooltip-' + chart.index + '{' + 'filter:url(#drop-shadow-' + chart.index + ')' + '}'
          });
        },
        getLabel: function() {
          var renderer = this.chart.renderer,
              options = this.options;
          if (!this.label) {
            if (this.split) {
              this.label = renderer.g('tooltip');
            } else {
              this.label = renderer.label('', 0, 0, options.shape || 'callout', null, null, options.useHTML, null, 'tooltip').attr({
                padding: options.padding,
                r: options.borderRadius
              });
            }
            this.applyFilter();
            this.label.addClass('highcharts-tooltip-' + this.chart.index);
            this.label.attr({zIndex: 8}).add();
          }
          return this.label;
        },
        update: function(options) {
          this.destroy();
          merge(true, this.chart.options.tooltip.userOptions, options);
          this.init(this.chart, merge(true, this.options, options));
        },
        destroy: function() {
          if (this.label) {
            this.label = this.label.destroy();
          }
          if (this.split && this.tt) {
            this.cleanSplit(this.chart, true);
            this.tt = this.tt.destroy();
          }
          clearTimeout(this.hideTimer);
          clearTimeout(this.tooltipTimeout);
        },
        move: function(x, y, anchorX, anchorY) {
          var tooltip = this,
              now = tooltip.now,
              animate = tooltip.options.animation !== false && !tooltip.isHidden && (Math.abs(x - now.x) > 1 || Math.abs(y - now.y) > 1),
              skipAnchor = tooltip.followPointer || tooltip.len > 1;
          extend(now, {
            x: animate ? (2 * now.x + x) / 3 : x,
            y: animate ? (now.y + y) / 2 : y,
            anchorX: skipAnchor ? undefined : animate ? (2 * now.anchorX + anchorX) / 3 : anchorX,
            anchorY: skipAnchor ? undefined : animate ? (now.anchorY + anchorY) / 2 : anchorY
          });
          tooltip.getLabel().attr(now);
          if (animate) {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = setTimeout(function() {
              if (tooltip) {
                tooltip.move(x, y, anchorX, anchorY);
              }
            }, 32);
          }
        },
        hide: function(delay) {
          var tooltip = this;
          clearTimeout(this.hideTimer);
          delay = pick(delay, this.options.hideDelay, 500);
          if (!this.isHidden) {
            this.hideTimer = syncTimeout(function() {
              tooltip.getLabel()[delay ? 'fadeOut' : 'hide']();
              tooltip.isHidden = true;
            }, delay);
          }
        },
        getAnchor: function(points, mouseEvent) {
          var ret,
              chart = this.chart,
              inverted = chart.inverted,
              plotTop = chart.plotTop,
              plotLeft = chart.plotLeft,
              plotX = 0,
              plotY = 0,
              yAxis,
              xAxis;
          points = splat(points);
          ret = points[0].tooltipPos;
          if (this.followPointer && mouseEvent) {
            if (mouseEvent.chartX === undefined) {
              mouseEvent = chart.pointer.normalize(mouseEvent);
            }
            ret = [mouseEvent.chartX - chart.plotLeft, mouseEvent.chartY - plotTop];
          }
          if (!ret) {
            each(points, function(point) {
              yAxis = point.series.yAxis;
              xAxis = point.series.xAxis;
              plotX += point.plotX + (!inverted && xAxis ? xAxis.left - plotLeft : 0);
              plotY += (point.plotLow ? (point.plotLow + point.plotHigh) / 2 : point.plotY) + (!inverted && yAxis ? yAxis.top - plotTop : 0);
            });
            plotX /= points.length;
            plotY /= points.length;
            ret = [inverted ? chart.plotWidth - plotY : plotX, this.shared && !inverted && points.length > 1 && mouseEvent ? mouseEvent.chartY - plotTop : inverted ? chart.plotHeight - plotX : plotY];
          }
          return map(ret, Math.round);
        },
        getPosition: function(boxWidth, boxHeight, point) {
          var chart = this.chart,
              distance = this.distance,
              ret = {},
              h = (chart.inverted && point.h) || 0,
              swapped,
              first = ['y', chart.chartHeight, boxHeight, point.plotY + chart.plotTop, chart.plotTop, chart.plotTop + chart.plotHeight],
              second = ['x', chart.chartWidth, boxWidth, point.plotX + chart.plotLeft, chart.plotLeft, chart.plotLeft + chart.plotWidth],
              preferFarSide = !this.followPointer && pick(point.ttBelow, !chart.inverted === !!point.negative),
              firstDimension = function(dim, outerSize, innerSize, point, min, max) {
                var roomLeft = innerSize < point - distance,
                    roomRight = point + distance + innerSize < outerSize,
                    alignedLeft = point - distance - innerSize,
                    alignedRight = point + distance;
                if (preferFarSide && roomRight) {
                  ret[dim] = alignedRight;
                } else if (!preferFarSide && roomLeft) {
                  ret[dim] = alignedLeft;
                } else if (roomLeft) {
                  ret[dim] = Math.min(max - innerSize, alignedLeft - h < 0 ? alignedLeft : alignedLeft - h);
                } else if (roomRight) {
                  ret[dim] = Math.max(min, alignedRight + h + innerSize > outerSize ? alignedRight : alignedRight + h);
                } else {
                  return false;
                }
              },
              secondDimension = function(dim, outerSize, innerSize, point) {
                var retVal;
                if (point < distance || point > outerSize - distance) {
                  retVal = false;
                } else if (point < innerSize / 2) {
                  ret[dim] = 1;
                } else if (point > outerSize - innerSize / 2) {
                  ret[dim] = outerSize - innerSize - 2;
                } else {
                  ret[dim] = point - innerSize / 2;
                }
                return retVal;
              },
              swap = function(count) {
                var temp = first;
                first = second;
                second = temp;
                swapped = count;
              },
              run = function() {
                if (firstDimension.apply(0, first) !== false) {
                  if (secondDimension.apply(0, second) === false && !swapped) {
                    swap(true);
                    run();
                  }
                } else if (!swapped) {
                  swap(true);
                  run();
                } else {
                  ret.x = ret.y = 0;
                }
              };
          if (chart.inverted || this.len > 1) {
            swap();
          }
          run();
          return ret;
        },
        defaultFormatter: function(tooltip) {
          var items = this.points || splat(this),
              s;
          s = [tooltip.tooltipFooterHeaderFormatter(items[0])];
          s = s.concat(tooltip.bodyFormatter(items));
          s.push(tooltip.tooltipFooterHeaderFormatter(items[0], true));
          return s;
        },
        refresh: function(pointOrPoints, mouseEvent) {
          var tooltip = this,
              label,
              options = tooltip.options,
              x,
              y,
              point = pointOrPoints,
              anchor,
              textConfig = {},
              text,
              pointConfig = [],
              formatter = options.formatter || tooltip.defaultFormatter,
              shared = tooltip.shared,
              currentSeries;
          if (!options.enabled) {
            return;
          }
          clearTimeout(this.hideTimer);
          tooltip.followPointer = splat(point)[0].series.tooltipOptions.followPointer;
          anchor = tooltip.getAnchor(point, mouseEvent);
          x = anchor[0];
          y = anchor[1];
          if (shared && !(point.series && point.series.noSharedTooltip)) {
            each(point, function(item) {
              item.setState('hover');
              pointConfig.push(item.getLabelConfig());
            });
            textConfig = {
              x: point[0].category,
              y: point[0].y
            };
            textConfig.points = pointConfig;
            point = point[0];
          } else {
            textConfig = point.getLabelConfig();
          }
          this.len = pointConfig.length;
          text = formatter.call(textConfig, tooltip);
          currentSeries = point.series;
          this.distance = pick(currentSeries.tooltipOptions.distance, 16);
          if (text === false) {
            this.hide();
          } else {
            label = tooltip.getLabel();
            if (tooltip.isHidden) {
              label.attr({opacity: 1}).show();
            }
            if (tooltip.split) {
              this.renderSplit(text, splat(pointOrPoints));
            } else {
              label.css({width: this.chart.spacingBox.width});
              label.attr({text: text && text.join ? text.join('') : text});
              label.removeClass(/highcharts-color-[\d]+/g).addClass('highcharts-color-' + pick(point.colorIndex, currentSeries.colorIndex));
              tooltip.updatePosition({
                plotX: x,
                plotY: y,
                negative: point.negative,
                ttBelow: point.ttBelow,
                h: anchor[2] || 0
              });
            }
            this.isHidden = false;
          }
        },
        renderSplit: function(labels, points) {
          var tooltip = this,
              boxes = [],
              chart = this.chart,
              ren = chart.renderer,
              rightAligned = true,
              options = this.options,
              headerHeight = 0,
              tooltipLabel = this.getLabel();
          if (H.isString(labels)) {
            labels = [false, labels];
          }
          each(labels.slice(0, points.length + 1), function(str, i) {
            if (str !== false) {
              var point = points[i - 1] || {
                isHeader: true,
                plotX: points[0].plotX
              },
                  owner = point.series || tooltip,
                  tt = owner.tt,
                  series = point.series || {},
                  colorClass = 'highcharts-color-' + pick(point.colorIndex, series.colorIndex, 'none'),
                  target,
                  x,
                  bBox,
                  boxWidth;
              if (!tt) {
                owner.tt = tt = ren.label(null, null, null, 'callout', null, null, options.useHTML).addClass('highcharts-tooltip-box ' + colorClass).attr({
                  'padding': options.padding,
                  'r': options.borderRadius
                }).add(tooltipLabel);
              }
              tt.isActive = true;
              tt.attr({text: str});
              bBox = tt.getBBox();
              boxWidth = bBox.width + tt.strokeWidth();
              if (point.isHeader) {
                headerHeight = bBox.height;
                x = Math.max(0, Math.min(point.plotX + chart.plotLeft - boxWidth / 2, chart.chartWidth - boxWidth));
              } else {
                x = point.plotX + chart.plotLeft - pick(options.distance, 16) - boxWidth;
              }
              if (x < 0) {
                rightAligned = false;
              }
              target = (point.series && point.series.yAxis && point.series.yAxis.pos) + (point.plotY || 0);
              target -= chart.plotTop;
              boxes.push({
                target: point.isHeader ? chart.plotHeight + headerHeight : target,
                rank: point.isHeader ? 1 : 0,
                size: owner.tt.getBBox().height + 1,
                point: point,
                x: x,
                tt: tt
              });
            }
          });
          this.cleanSplit();
          H.distribute(boxes, chart.plotHeight + headerHeight);
          each(boxes, function(box) {
            var point = box.point,
                series = point.series;
            box.tt.attr({
              visibility: box.pos === undefined ? 'hidden' : 'inherit',
              x: (rightAligned || point.isHeader ? box.x : point.plotX + chart.plotLeft + pick(options.distance, 16)),
              y: box.pos + chart.plotTop,
              anchorX: point.isHeader ? point.plotX + chart.plotLeft : point.plotX + series.xAxis.pos,
              anchorY: point.isHeader ? box.pos + chart.plotTop - 15 : point.plotY + series.yAxis.pos
            });
          });
        },
        updatePosition: function(point) {
          var chart = this.chart,
              label = this.getLabel(),
              pos = (this.options.positioner || this.getPosition).call(this, label.width, label.height, point);
          this.move(Math.round(pos.x), Math.round(pos.y || 0), point.plotX + chart.plotLeft, point.plotY + chart.plotTop);
        },
        getDateFormat: function(range, date, startOfWeek, dateTimeLabelFormats) {
          var time = this.chart.time,
              dateStr = time.dateFormat('%m-%d %H:%M:%S.%L', date),
              format,
              n,
              blank = '01-01 00:00:00.000',
              strpos = {
                millisecond: 15,
                second: 12,
                minute: 9,
                hour: 6,
                day: 3
              },
              lastN = 'millisecond';
          for (n in timeUnits) {
            if (range === timeUnits.week && +time.dateFormat('%w', date) === startOfWeek && dateStr.substr(6) === blank.substr(6)) {
              n = 'week';
              break;
            }
            if (timeUnits[n] > range) {
              n = lastN;
              break;
            }
            if (strpos[n] && dateStr.substr(strpos[n]) !== blank.substr(strpos[n])) {
              break;
            }
            if (n !== 'week') {
              lastN = n;
            }
          }
          if (n) {
            format = dateTimeLabelFormats[n];
          }
          return format;
        },
        getXDateFormat: function(point, options, xAxis) {
          var xDateFormat,
              dateTimeLabelFormats = options.dateTimeLabelFormats,
              closestPointRange = xAxis && xAxis.closestPointRange;
          if (closestPointRange) {
            xDateFormat = this.getDateFormat(closestPointRange, point.x, xAxis.options.startOfWeek, dateTimeLabelFormats);
          } else {
            xDateFormat = dateTimeLabelFormats.day;
          }
          return xDateFormat || dateTimeLabelFormats.year;
        },
        tooltipFooterHeaderFormatter: function(labelConfig, isFooter) {
          var footOrHead = isFooter ? 'footer' : 'header',
              series = labelConfig.series,
              tooltipOptions = series.tooltipOptions,
              xDateFormat = tooltipOptions.xDateFormat,
              xAxis = series.xAxis,
              isDateTime = (xAxis && xAxis.options.type === 'datetime' && isNumber(labelConfig.key)),
              formatString = tooltipOptions[footOrHead + 'Format'];
          if (isDateTime && !xDateFormat) {
            xDateFormat = this.getXDateFormat(labelConfig, tooltipOptions, xAxis);
          }
          if (isDateTime && xDateFormat) {
            each((labelConfig.point && labelConfig.point.tooltipDateKeys) || ['key'], function(key) {
              formatString = formatString.replace('{point.' + key + '}', '{point.' + key + ':' + xDateFormat + '}');
            });
          }
          return format(formatString, {
            point: labelConfig,
            series: series
          }, this.chart.time);
        },
        bodyFormatter: function(items) {
          return map(items, function(item) {
            var tooltipOptions = item.series.tooltipOptions;
            return (tooltipOptions[(item.point.formatPrefix || 'point') + 'Formatter'] || item.point.tooltipFormatter).call(item.point, tooltipOptions[(item.point.formatPrefix || 'point') + 'Format']);
          });
        }
      };
    }(Highcharts));
    (function(Highcharts) {
      var H = Highcharts,
          addEvent = H.addEvent,
          attr = H.attr,
          charts = H.charts,
          color = H.color,
          css = H.css,
          defined = H.defined,
          each = H.each,
          extend = H.extend,
          find = H.find,
          fireEvent = H.fireEvent,
          isNumber = H.isNumber,
          isObject = H.isObject,
          offset = H.offset,
          pick = H.pick,
          splat = H.splat,
          Tooltip = H.Tooltip;
      Highcharts.Pointer = function(chart, options) {
        this.init(chart, options);
      };
      Highcharts.Pointer.prototype = {
        init: function(chart, options) {
          this.options = options;
          this.chart = chart;
          this.runChartClick = options.chart.events && !!options.chart.events.click;
          this.pinchDown = [];
          this.lastValidTouch = {};
          if (Tooltip) {
            chart.tooltip = new Tooltip(chart, options.tooltip);
            this.followTouchMove = pick(options.tooltip.followTouchMove, true);
          }
          this.setDOMEvents();
        },
        zoomOption: function(e) {
          var chart = this.chart,
              options = chart.options.chart,
              zoomType = options.zoomType || '',
              inverted = chart.inverted,
              zoomX,
              zoomY;
          if (/touch/.test(e.type)) {
            zoomType = pick(options.pinchType, zoomType);
          }
          this.zoomX = zoomX = /x/.test(zoomType);
          this.zoomY = zoomY = /y/.test(zoomType);
          this.zoomHor = (zoomX && !inverted) || (zoomY && inverted);
          this.zoomVert = (zoomY && !inverted) || (zoomX && inverted);
          this.hasZoom = zoomX || zoomY;
        },
        normalize: function(e, chartPosition) {
          var ePos;
          ePos = e.touches ? (e.touches.length ? e.touches.item(0) : e.changedTouches[0]) : e;
          if (!chartPosition) {
            this.chartPosition = chartPosition = offset(this.chart.container);
          }
          return extend(e, {
            chartX: Math.round(ePos.pageX - chartPosition.left),
            chartY: Math.round(ePos.pageY - chartPosition.top)
          });
        },
        getCoordinates: function(e) {
          var coordinates = {
            xAxis: [],
            yAxis: []
          };
          each(this.chart.axes, function(axis) {
            coordinates[axis.isXAxis ? 'xAxis' : 'yAxis'].push({
              axis: axis,
              value: axis.toValue(e[axis.horiz ? 'chartX' : 'chartY'])
            });
          });
          return coordinates;
        },
        findNearestKDPoint: function(series, shared, coordinates) {
          var closest,
              sort = function(p1, p2) {
                var isCloserX = p1.distX - p2.distX,
                    isCloser = p1.dist - p2.dist,
                    isAbove = (p2.series.group && p2.series.group.zIndex) - (p1.series.group && p1.series.group.zIndex),
                    result;
                if (isCloserX !== 0 && shared) {
                  result = isCloserX;
                } else if (isCloser !== 0) {
                  result = isCloser;
                } else if (isAbove !== 0) {
                  result = isAbove;
                } else {
                  result = p1.series.index > p2.series.index ? -1 : 1;
                }
                return result;
              };
          each(series, function(s) {
            var noSharedTooltip = s.noSharedTooltip && shared,
                compareX = (!noSharedTooltip && s.options.findNearestPointBy.indexOf('y') < 0),
                point = s.searchPoint(coordinates, compareX);
            if (isObject(point, true) && (!isObject(closest, true) || (sort(closest, point) > 0))) {
              closest = point;
            }
          });
          return closest;
        },
        getPointFromEvent: function(e) {
          var target = e.target,
              point;
          while (target && !point) {
            point = target.point;
            target = target.parentNode;
          }
          return point;
        },
        getChartCoordinatesFromPoint: function(point, inverted) {
          var series = point.series,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              plotX = pick(point.clientX, point.plotX);
          if (xAxis && yAxis) {
            return inverted ? {
              chartX: xAxis.len + xAxis.pos - plotX,
              chartY: yAxis.len + yAxis.pos - point.plotY
            } : {
              chartX: plotX + xAxis.pos,
              chartY: point.plotY + yAxis.pos
            };
          }
        },
        getHoverData: function(existingHoverPoint, existingHoverSeries, series, isDirectTouch, shared, coordinates, params) {
          var hoverPoint,
              hoverPoints = [],
              hoverSeries = existingHoverSeries,
              isBoosting = params && params.isBoosting,
              useExisting = !!(isDirectTouch && existingHoverPoint),
              notSticky = hoverSeries && !hoverSeries.stickyTracking,
              filter = function(s) {
                return (s.visible && !(!shared && s.directTouch) && pick(s.options.enableMouseTracking, true));
              },
              searchSeries = notSticky ? [hoverSeries] : H.grep(series, function(s) {
                return filter(s) && s.stickyTracking;
              });
          hoverPoint = useExisting ? existingHoverPoint : this.findNearestKDPoint(searchSeries, shared, coordinates);
          hoverSeries = hoverPoint && hoverPoint.series;
          if (hoverPoint) {
            if (shared && !hoverSeries.noSharedTooltip) {
              searchSeries = H.grep(series, function(s) {
                return filter(s) && !s.noSharedTooltip;
              });
              each(searchSeries, function(s) {
                var point = find(s.points, function(p) {
                  return p.x === hoverPoint.x && !p.isNull;
                });
                if (isObject(point)) {
                  if (isBoosting) {
                    point = s.getPoint(point);
                  }
                  hoverPoints.push(point);
                }
              });
            } else {
              hoverPoints.push(hoverPoint);
            }
          }
          return {
            hoverPoint: hoverPoint,
            hoverSeries: hoverSeries,
            hoverPoints: hoverPoints
          };
        },
        runPointActions: function(e, p) {
          var pointer = this,
              chart = pointer.chart,
              series = chart.series,
              tooltip = chart.tooltip && chart.tooltip.options.enabled ? chart.tooltip : undefined,
              shared = tooltip ? tooltip.shared : false,
              hoverPoint = p || chart.hoverPoint,
              hoverSeries = hoverPoint && hoverPoint.series || chart.hoverSeries,
              isDirectTouch = !!p || ((hoverSeries && hoverSeries.directTouch) && pointer.isDirectTouch),
              hoverData = this.getHoverData(hoverPoint, hoverSeries, series, isDirectTouch, shared, e, {isBoosting: chart.isBoosting}),
              useSharedTooltip,
              followPointer,
              anchor,
              points;
          hoverPoint = hoverData.hoverPoint;
          points = hoverData.hoverPoints;
          hoverSeries = hoverData.hoverSeries;
          followPointer = hoverSeries && hoverSeries.tooltipOptions.followPointer;
          useSharedTooltip = (shared && hoverSeries && !hoverSeries.noSharedTooltip);
          if (hoverPoint && (hoverPoint !== chart.hoverPoint || (tooltip && tooltip.isHidden))) {
            each(chart.hoverPoints || [], function(p) {
              if (H.inArray(p, points) === -1) {
                p.setState();
              }
            });
            each(points || [], function(p) {
              p.setState('hover');
            });
            if (chart.hoverSeries !== hoverSeries) {
              hoverSeries.onMouseOver();
            }
            if (chart.hoverPoint) {
              chart.hoverPoint.firePointEvent('mouseOut');
            }
            if (!hoverPoint.series) {
              return;
            }
            hoverPoint.firePointEvent('mouseOver');
            chart.hoverPoints = points;
            chart.hoverPoint = hoverPoint;
            if (tooltip) {
              tooltip.refresh(useSharedTooltip ? points : hoverPoint, e);
            }
          } else if (followPointer && tooltip && !tooltip.isHidden) {
            anchor = tooltip.getAnchor([{}], e);
            tooltip.updatePosition({
              plotX: anchor[0],
              plotY: anchor[1]
            });
          }
          if (!pointer.unDocMouseMove) {
            pointer.unDocMouseMove = addEvent(chart.container.ownerDocument, 'mousemove', function(e) {
              var chart = charts[H.hoverChartIndex];
              if (chart) {
                chart.pointer.onDocumentMouseMove(e);
              }
            });
          }
          each(chart.axes, function drawAxisCrosshair(axis) {
            var snap = pick(axis.crosshair.snap, true),
                point = !snap ? undefined : H.find(points, function(p) {
                  return p.series[axis.coll] === axis;
                });
            if (point || !snap) {
              axis.drawCrosshair(e, point);
            } else {
              axis.hideCrosshair();
            }
          });
        },
        reset: function(allowMove, delay) {
          var pointer = this,
              chart = pointer.chart,
              hoverSeries = chart.hoverSeries,
              hoverPoint = chart.hoverPoint,
              hoverPoints = chart.hoverPoints,
              tooltip = chart.tooltip,
              tooltipPoints = tooltip && tooltip.shared ? hoverPoints : hoverPoint;
          if (allowMove && tooltipPoints) {
            each(splat(tooltipPoints), function(point) {
              if (point.series.isCartesian && point.plotX === undefined) {
                allowMove = false;
              }
            });
          }
          if (allowMove) {
            if (tooltip && tooltipPoints) {
              tooltip.refresh(tooltipPoints);
              if (hoverPoint) {
                hoverPoint.setState(hoverPoint.state, true);
                each(chart.axes, function(axis) {
                  if (axis.crosshair) {
                    axis.drawCrosshair(null, hoverPoint);
                  }
                });
              }
            }
          } else {
            if (hoverPoint) {
              hoverPoint.onMouseOut();
            }
            if (hoverPoints) {
              each(hoverPoints, function(point) {
                point.setState();
              });
            }
            if (hoverSeries) {
              hoverSeries.onMouseOut();
            }
            if (tooltip) {
              tooltip.hide(delay);
            }
            if (pointer.unDocMouseMove) {
              pointer.unDocMouseMove = pointer.unDocMouseMove();
            }
            each(chart.axes, function(axis) {
              axis.hideCrosshair();
            });
            pointer.hoverX = chart.hoverPoints = chart.hoverPoint = null;
          }
        },
        scaleGroups: function(attribs, clip) {
          var chart = this.chart,
              seriesAttribs;
          each(chart.series, function(series) {
            seriesAttribs = attribs || series.getPlotBox();
            if (series.xAxis && series.xAxis.zoomEnabled && series.group) {
              series.group.attr(seriesAttribs);
              if (series.markerGroup) {
                series.markerGroup.attr(seriesAttribs);
                series.markerGroup.clip(clip ? chart.clipRect : null);
              }
              if (series.dataLabelsGroup) {
                series.dataLabelsGroup.attr(seriesAttribs);
              }
            }
          });
          chart.clipRect.attr(clip || chart.clipBox);
        },
        dragStart: function(e) {
          var chart = this.chart;
          chart.mouseIsDown = e.type;
          chart.cancelClick = false;
          chart.mouseDownX = this.mouseDownX = e.chartX;
          chart.mouseDownY = this.mouseDownY = e.chartY;
        },
        drag: function(e) {
          var chart = this.chart,
              chartOptions = chart.options.chart,
              chartX = e.chartX,
              chartY = e.chartY,
              zoomHor = this.zoomHor,
              zoomVert = this.zoomVert,
              plotLeft = chart.plotLeft,
              plotTop = chart.plotTop,
              plotWidth = chart.plotWidth,
              plotHeight = chart.plotHeight,
              clickedInside,
              size,
              selectionMarker = this.selectionMarker,
              mouseDownX = this.mouseDownX,
              mouseDownY = this.mouseDownY,
              panKey = chartOptions.panKey && e[chartOptions.panKey + 'Key'];
          if (selectionMarker && selectionMarker.touch) {
            return;
          }
          if (chartX < plotLeft) {
            chartX = plotLeft;
          } else if (chartX > plotLeft + plotWidth) {
            chartX = plotLeft + plotWidth;
          }
          if (chartY < plotTop) {
            chartY = plotTop;
          } else if (chartY > plotTop + plotHeight) {
            chartY = plotTop + plotHeight;
          }
          this.hasDragged = Math.sqrt(Math.pow(mouseDownX - chartX, 2) + Math.pow(mouseDownY - chartY, 2));
          if (this.hasDragged > 10) {
            clickedInside = chart.isInsidePlot(mouseDownX - plotLeft, mouseDownY - plotTop);
            if (chart.hasCartesianSeries && (this.zoomX || this.zoomY) && clickedInside && !panKey) {
              if (!selectionMarker) {
                this.selectionMarker = selectionMarker = chart.renderer.rect(plotLeft, plotTop, zoomHor ? 1 : plotWidth, zoomVert ? 1 : plotHeight, 0).attr({
                  'class': 'highcharts-selection-marker',
                  'zIndex': 7
                }).add();
              }
            }
            if (selectionMarker && zoomHor) {
              size = chartX - mouseDownX;
              selectionMarker.attr({
                width: Math.abs(size),
                x: (size > 0 ? 0 : size) + mouseDownX
              });
            }
            if (selectionMarker && zoomVert) {
              size = chartY - mouseDownY;
              selectionMarker.attr({
                height: Math.abs(size),
                y: (size > 0 ? 0 : size) + mouseDownY
              });
            }
            if (clickedInside && !selectionMarker && chartOptions.panning) {
              chart.pan(e, chartOptions.panning);
            }
          }
        },
        drop: function(e) {
          var pointer = this,
              chart = this.chart,
              hasPinched = this.hasPinched;
          if (this.selectionMarker) {
            var selectionData = {
              originalEvent: e,
              xAxis: [],
              yAxis: []
            },
                selectionBox = this.selectionMarker,
                selectionLeft = selectionBox.attr ? selectionBox.attr('x') : selectionBox.x,
                selectionTop = selectionBox.attr ? selectionBox.attr('y') : selectionBox.y,
                selectionWidth = selectionBox.attr ? selectionBox.attr('width') : selectionBox.width,
                selectionHeight = selectionBox.attr ? selectionBox.attr('height') : selectionBox.height,
                runZoom;
            if (this.hasDragged || hasPinched) {
              each(chart.axes, function(axis) {
                if (axis.zoomEnabled && defined(axis.min) && (hasPinched || pointer[{
                  xAxis: 'zoomX',
                  yAxis: 'zoomY'
                }[axis.coll]])) {
                  var horiz = axis.horiz,
                      minPixelPadding = e.type === 'touchend' ? axis.minPixelPadding : 0,
                      selectionMin = axis.toValue((horiz ? selectionLeft : selectionTop) + minPixelPadding),
                      selectionMax = axis.toValue((horiz ? selectionLeft + selectionWidth : selectionTop + selectionHeight) - minPixelPadding);
                  selectionData[axis.coll].push({
                    axis: axis,
                    min: Math.min(selectionMin, selectionMax),
                    max: Math.max(selectionMin, selectionMax)
                  });
                  runZoom = true;
                }
              });
              if (runZoom) {
                fireEvent(chart, 'selection', selectionData, function(args) {
                  chart.zoom(extend(args, hasPinched ? {animation: false} : null));
                });
              }
            }
            if (isNumber(chart.index)) {
              this.selectionMarker = this.selectionMarker.destroy();
            }
            if (hasPinched) {
              this.scaleGroups();
            }
          }
          if (chart && isNumber(chart.index)) {
            css(chart.container, {cursor: chart._cursor});
            chart.cancelClick = this.hasDragged > 10;
            chart.mouseIsDown = this.hasDragged = this.hasPinched = false;
            this.pinchDown = [];
          }
        },
        onContainerMouseDown: function(e) {
          e = this.normalize(e);
          if (e.button !== 2) {
            this.zoomOption(e);
            if (e.preventDefault) {
              e.preventDefault();
            }
            this.dragStart(e);
          }
        },
        onDocumentMouseUp: function(e) {
          if (charts[H.hoverChartIndex]) {
            charts[H.hoverChartIndex].pointer.drop(e);
          }
        },
        onDocumentMouseMove: function(e) {
          var chart = this.chart,
              chartPosition = this.chartPosition;
          e = this.normalize(e, chartPosition);
          if (chartPosition && !this.inClass(e.target, 'highcharts-tracker') && !chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
            this.reset();
          }
        },
        onContainerMouseLeave: function(e) {
          var chart = charts[H.hoverChartIndex];
          if (chart && (e.relatedTarget || e.toElement)) {
            chart.pointer.reset();
            chart.pointer.chartPosition = null;
          }
        },
        onContainerMouseMove: function(e) {
          var chart = this.chart;
          if (!defined(H.hoverChartIndex) || !charts[H.hoverChartIndex] || !charts[H.hoverChartIndex].mouseIsDown) {
            H.hoverChartIndex = chart.index;
          }
          e = this.normalize(e);
          e.returnValue = false;
          if (chart.mouseIsDown === 'mousedown') {
            this.drag(e);
          }
          if ((this.inClass(e.target, 'highcharts-tracker') || chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) && !chart.openMenu) {
            this.runPointActions(e);
          }
        },
        inClass: function(element, className) {
          var elemClassName;
          while (element) {
            elemClassName = attr(element, 'class');
            if (elemClassName) {
              if (elemClassName.indexOf(className) !== -1) {
                return true;
              }
              if (elemClassName.indexOf('highcharts-container') !== -1) {
                return false;
              }
            }
            element = element.parentNode;
          }
        },
        onTrackerMouseOut: function(e) {
          var series = this.chart.hoverSeries,
              relatedTarget = e.relatedTarget || e.toElement;
          this.isDirectTouch = false;
          if (series && relatedTarget && !series.stickyTracking && !this.inClass(relatedTarget, 'highcharts-tooltip') && (!this.inClass(relatedTarget, 'highcharts-series-' + series.index) || !this.inClass(relatedTarget, 'highcharts-tracker'))) {
            series.onMouseOut();
          }
        },
        onContainerClick: function(e) {
          var chart = this.chart,
              hoverPoint = chart.hoverPoint,
              plotLeft = chart.plotLeft,
              plotTop = chart.plotTop;
          e = this.normalize(e);
          if (!chart.cancelClick) {
            if (hoverPoint && this.inClass(e.target, 'highcharts-tracker')) {
              fireEvent(hoverPoint.series, 'click', extend(e, {point: hoverPoint}));
              if (chart.hoverPoint) {
                hoverPoint.firePointEvent('click', e);
              }
            } else {
              extend(e, this.getCoordinates(e));
              if (chart.isInsidePlot(e.chartX - plotLeft, e.chartY - plotTop)) {
                fireEvent(chart, 'click', e);
              }
            }
          }
        },
        setDOMEvents: function() {
          var pointer = this,
              container = pointer.chart.container,
              ownerDoc = container.ownerDocument;
          container.onmousedown = function(e) {
            pointer.onContainerMouseDown(e);
          };
          container.onmousemove = function(e) {
            pointer.onContainerMouseMove(e);
          };
          container.onclick = function(e) {
            pointer.onContainerClick(e);
          };
          this.unbindContainerMouseLeave = addEvent(container, 'mouseleave', pointer.onContainerMouseLeave);
          if (!H.unbindDocumentMouseUp) {
            H.unbindDocumentMouseUp = addEvent(ownerDoc, 'mouseup', pointer.onDocumentMouseUp);
          }
          if (H.hasTouch) {
            container.ontouchstart = function(e) {
              pointer.onContainerTouchStart(e);
            };
            container.ontouchmove = function(e) {
              pointer.onContainerTouchMove(e);
            };
            if (!H.unbindDocumentTouchEnd) {
              H.unbindDocumentTouchEnd = addEvent(ownerDoc, 'touchend', pointer.onDocumentTouchEnd);
            }
          }
        },
        destroy: function() {
          var pointer = this;
          if (pointer.unDocMouseMove) {
            pointer.unDocMouseMove();
          }
          this.unbindContainerMouseLeave();
          if (!H.chartCount) {
            if (H.unbindDocumentMouseUp) {
              H.unbindDocumentMouseUp = H.unbindDocumentMouseUp();
            }
            if (H.unbindDocumentTouchEnd) {
              H.unbindDocumentTouchEnd = H.unbindDocumentTouchEnd();
            }
          }
          clearInterval(pointer.tooltipTimeout);
          H.objectEach(pointer, function(val, prop) {
            pointer[prop] = null;
          });
        }
      };
    }(Highcharts));
    (function(H) {
      var charts = H.charts,
          each = H.each,
          extend = H.extend,
          map = H.map,
          noop = H.noop,
          pick = H.pick,
          Pointer = H.Pointer;
      extend(Pointer.prototype, {
        pinchTranslate: function(pinchDown, touches, transform, selectionMarker, clip, lastValidTouch) {
          if (this.zoomHor) {
            this.pinchTranslateDirection(true, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
          }
          if (this.zoomVert) {
            this.pinchTranslateDirection(false, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
          }
        },
        pinchTranslateDirection: function(horiz, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch, forcedScale) {
          var chart = this.chart,
              xy = horiz ? 'x' : 'y',
              XY = horiz ? 'X' : 'Y',
              sChartXY = 'chart' + XY,
              wh = horiz ? 'width' : 'height',
              plotLeftTop = chart['plot' + (horiz ? 'Left' : 'Top')],
              selectionWH,
              selectionXY,
              clipXY,
              scale = forcedScale || 1,
              inverted = chart.inverted,
              bounds = chart.bounds[horiz ? 'h' : 'v'],
              singleTouch = pinchDown.length === 1,
              touch0Start = pinchDown[0][sChartXY],
              touch0Now = touches[0][sChartXY],
              touch1Start = !singleTouch && pinchDown[1][sChartXY],
              touch1Now = !singleTouch && touches[1][sChartXY],
              outOfBounds,
              transformScale,
              scaleKey,
              setScale = function() {
                if (!singleTouch && Math.abs(touch0Start - touch1Start) > 20) {
                  scale = forcedScale || Math.abs(touch0Now - touch1Now) / Math.abs(touch0Start - touch1Start);
                }
                clipXY = ((plotLeftTop - touch0Now) / scale) + touch0Start;
                selectionWH = chart['plot' + (horiz ? 'Width' : 'Height')] / scale;
              };
          setScale();
          selectionXY = clipXY;
          if (selectionXY < bounds.min) {
            selectionXY = bounds.min;
            outOfBounds = true;
          } else if (selectionXY + selectionWH > bounds.max) {
            selectionXY = bounds.max - selectionWH;
            outOfBounds = true;
          }
          if (outOfBounds) {
            touch0Now -= 0.8 * (touch0Now - lastValidTouch[xy][0]);
            if (!singleTouch) {
              touch1Now -= 0.8 * (touch1Now - lastValidTouch[xy][1]);
            }
            setScale();
          } else {
            lastValidTouch[xy] = [touch0Now, touch1Now];
          }
          if (!inverted) {
            clip[xy] = clipXY - plotLeftTop;
            clip[wh] = selectionWH;
          }
          scaleKey = inverted ? (horiz ? 'scaleY' : 'scaleX') : 'scale' + XY;
          transformScale = inverted ? 1 / scale : scale;
          selectionMarker[wh] = selectionWH;
          selectionMarker[xy] = selectionXY;
          transform[scaleKey] = scale;
          transform['translate' + XY] = (transformScale * plotLeftTop) + (touch0Now - (transformScale * touch0Start));
        },
        pinch: function(e) {
          var self = this,
              chart = self.chart,
              pinchDown = self.pinchDown,
              touches = e.touches,
              touchesLength = touches.length,
              lastValidTouch = self.lastValidTouch,
              hasZoom = self.hasZoom,
              selectionMarker = self.selectionMarker,
              transform = {},
              fireClickEvent = touchesLength === 1 && ((self.inClass(e.target, 'highcharts-tracker') && chart.runTrackerClick) || self.runChartClick),
              clip = {};
          if (touchesLength > 1) {
            self.initiated = true;
          }
          if (hasZoom && self.initiated && !fireClickEvent) {
            e.preventDefault();
          }
          map(touches, function(e) {
            return self.normalize(e);
          });
          if (e.type === 'touchstart') {
            each(touches, function(e, i) {
              pinchDown[i] = {
                chartX: e.chartX,
                chartY: e.chartY
              };
            });
            lastValidTouch.x = [pinchDown[0].chartX, pinchDown[1] && pinchDown[1].chartX];
            lastValidTouch.y = [pinchDown[0].chartY, pinchDown[1] && pinchDown[1].chartY];
            each(chart.axes, function(axis) {
              if (axis.zoomEnabled) {
                var bounds = chart.bounds[axis.horiz ? 'h' : 'v'],
                    minPixelPadding = axis.minPixelPadding,
                    min = axis.toPixels(pick(axis.options.min, axis.dataMin)),
                    max = axis.toPixels(pick(axis.options.max, axis.dataMax)),
                    absMin = Math.min(min, max),
                    absMax = Math.max(min, max);
                bounds.min = Math.min(axis.pos, absMin - minPixelPadding);
                bounds.max = Math.max(axis.pos + axis.len, absMax + minPixelPadding);
              }
            });
            self.res = true;
          } else if (self.followTouchMove && touchesLength === 1) {
            this.runPointActions(self.normalize(e));
          } else if (pinchDown.length) {
            if (!selectionMarker) {
              self.selectionMarker = selectionMarker = extend({
                destroy: noop,
                touch: true
              }, chart.plotBox);
            }
            self.pinchTranslate(pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
            self.hasPinched = hasZoom;
            self.scaleGroups(transform, clip);
            if (self.res) {
              self.res = false;
              this.reset(false, 0);
            }
          }
        },
        touch: function(e, start) {
          var chart = this.chart,
              hasMoved,
              pinchDown,
              isInside;
          if (chart.index !== H.hoverChartIndex) {
            this.onContainerMouseLeave({relatedTarget: true});
          }
          H.hoverChartIndex = chart.index;
          if (e.touches.length === 1) {
            e = this.normalize(e);
            isInside = chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop);
            if (isInside && !chart.openMenu) {
              if (start) {
                this.runPointActions(e);
              }
              if (e.type === 'touchmove') {
                pinchDown = this.pinchDown;
                hasMoved = pinchDown[0] ? Math.sqrt(Math.pow(pinchDown[0].chartX - e.chartX, 2) + Math.pow(pinchDown[0].chartY - e.chartY, 2)) >= 4 : false;
              }
              if (pick(hasMoved, true)) {
                this.pinch(e);
              }
            } else if (start) {
              this.reset();
            }
          } else if (e.touches.length === 2) {
            this.pinch(e);
          }
        },
        onContainerTouchStart: function(e) {
          this.zoomOption(e);
          this.touch(e, true);
        },
        onContainerTouchMove: function(e) {
          this.touch(e);
        },
        onDocumentTouchEnd: function(e) {
          if (charts[H.hoverChartIndex]) {
            charts[H.hoverChartIndex].pointer.drop(e);
          }
        }
      });
    }(Highcharts));
    (function(H) {
      var addEvent = H.addEvent,
          charts = H.charts,
          css = H.css,
          doc = H.doc,
          extend = H.extend,
          hasTouch = H.hasTouch,
          noop = H.noop,
          Pointer = H.Pointer,
          removeEvent = H.removeEvent,
          win = H.win,
          wrap = H.wrap;
      if (!hasTouch && (win.PointerEvent || win.MSPointerEvent)) {
        var touches = {},
            hasPointerEvent = !!win.PointerEvent,
            getWebkitTouches = function() {
              var fake = [];
              fake.item = function(i) {
                return this[i];
              };
              H.objectEach(touches, function(touch) {
                fake.push({
                  pageX: touch.pageX,
                  pageY: touch.pageY,
                  target: touch.target
                });
              });
              return fake;
            },
            translateMSPointer = function(e, method, wktype, func) {
              var p;
              if ((e.pointerType === 'touch' || e.pointerType === e.MSPOINTER_TYPE_TOUCH) && charts[H.hoverChartIndex]) {
                func(e);
                p = charts[H.hoverChartIndex].pointer;
                p[method]({
                  type: wktype,
                  target: e.currentTarget,
                  preventDefault: noop,
                  touches: getWebkitTouches()
                });
              }
            };
        extend(Pointer.prototype, {
          onContainerPointerDown: function(e) {
            translateMSPointer(e, 'onContainerTouchStart', 'touchstart', function(e) {
              touches[e.pointerId] = {
                pageX: e.pageX,
                pageY: e.pageY,
                target: e.currentTarget
              };
            });
          },
          onContainerPointerMove: function(e) {
            translateMSPointer(e, 'onContainerTouchMove', 'touchmove', function(e) {
              touches[e.pointerId] = {
                pageX: e.pageX,
                pageY: e.pageY
              };
              if (!touches[e.pointerId].target) {
                touches[e.pointerId].target = e.currentTarget;
              }
            });
          },
          onDocumentPointerUp: function(e) {
            translateMSPointer(e, 'onDocumentTouchEnd', 'touchend', function(e) {
              delete touches[e.pointerId];
            });
          },
          batchMSEvents: function(fn) {
            fn(this.chart.container, hasPointerEvent ? 'pointerdown' : 'MSPointerDown', this.onContainerPointerDown);
            fn(this.chart.container, hasPointerEvent ? 'pointermove' : 'MSPointerMove', this.onContainerPointerMove);
            fn(doc, hasPointerEvent ? 'pointerup' : 'MSPointerUp', this.onDocumentPointerUp);
          }
        });
        wrap(Pointer.prototype, 'init', function(proceed, chart, options) {
          proceed.call(this, chart, options);
          if (this.hasZoom) {
            css(chart.container, {
              '-ms-touch-action': 'none',
              'touch-action': 'none'
            });
          }
        });
        wrap(Pointer.prototype, 'setDOMEvents', function(proceed) {
          proceed.apply(this);
          if (this.hasZoom || this.followTouchMove) {
            this.batchMSEvents(addEvent);
          }
        });
        wrap(Pointer.prototype, 'destroy', function(proceed) {
          this.batchMSEvents(removeEvent);
          proceed.call(this);
        });
      }
    }(Highcharts));
    (function(Highcharts) {
      var H = Highcharts,
          addEvent = H.addEvent,
          css = H.css,
          discardElement = H.discardElement,
          defined = H.defined,
          each = H.each,
          isFirefox = H.isFirefox,
          marginNames = H.marginNames,
          merge = H.merge,
          pick = H.pick,
          setAnimation = H.setAnimation,
          stableSort = H.stableSort,
          win = H.win,
          wrap = H.wrap;
      Highcharts.Legend = function(chart, options) {
        this.init(chart, options);
      };
      Highcharts.Legend.prototype = {
        init: function(chart, options) {
          this.chart = chart;
          this.setOptions(options);
          if (options.enabled) {
            this.render();
            addEvent(this.chart, 'endResize', function() {
              this.legend.positionCheckboxes();
            });
          }
        },
        setOptions: function(options) {
          var padding = pick(options.padding, 8);
          this.options = options;
          this.itemMarginTop = options.itemMarginTop || 0;
          this.padding = padding;
          this.initialItemY = padding - 5;
          this.maxItemWidth = 0;
          this.itemHeight = 0;
          this.symbolWidth = pick(options.symbolWidth, 16);
          this.pages = [];
        },
        update: function(options, redraw) {
          var chart = this.chart;
          this.setOptions(merge(true, this.options, options));
          this.destroy();
          chart.isDirtyLegend = chart.isDirtyBox = true;
          if (pick(redraw, true)) {
            chart.redraw();
          }
        },
        colorizeItem: function(item, visible) {
          item.legendGroup[visible ? 'removeClass' : 'addClass']('highcharts-legend-item-hidden');
        },
        positionItem: function(item) {
          var legend = this,
              options = legend.options,
              symbolPadding = options.symbolPadding,
              ltr = !options.rtl,
              legendItemPos = item._legendItemPos,
              itemX = legendItemPos[0],
              itemY = legendItemPos[1],
              checkbox = item.checkbox,
              legendGroup = item.legendGroup;
          if (legendGroup && legendGroup.element) {
            legendGroup.translate(ltr ? itemX : legend.legendWidth - itemX - 2 * symbolPadding - 4, itemY);
          }
          if (checkbox) {
            checkbox.x = itemX;
            checkbox.y = itemY;
          }
        },
        destroyItem: function(item) {
          var checkbox = item.checkbox;
          each(['legendItem', 'legendLine', 'legendSymbol', 'legendGroup'], function(key) {
            if (item[key]) {
              item[key] = item[key].destroy();
            }
          });
          if (checkbox) {
            discardElement(item.checkbox);
          }
        },
        destroy: function() {
          function destroyItems(key) {
            if (this[key]) {
              this[key] = this[key].destroy();
            }
          }
          each(this.getAllItems(), function(item) {
            each(['legendItem', 'legendGroup'], destroyItems, item);
          });
          each(['clipRect', 'up', 'down', 'pager', 'nav', 'box', 'title', 'group'], destroyItems, this);
          this.display = null;
        },
        positionCheckboxes: function() {
          var alignAttr = this.group && this.group.alignAttr,
              translateY,
              clipHeight = this.clipHeight || this.legendHeight,
              titleHeight = this.titleHeight;
          if (alignAttr) {
            translateY = alignAttr.translateY;
            each(this.allItems, function(item) {
              var checkbox = item.checkbox,
                  top;
              if (checkbox) {
                top = translateY + titleHeight + checkbox.y + (this.scrollOffset || 0) + 3;
                css(checkbox, {
                  left: (alignAttr.translateX + item.checkboxOffset + checkbox.x - 20) + 'px',
                  top: top + 'px',
                  display: top > translateY - 6 && top < translateY + clipHeight - 6 ? '' : 'none'
                });
              }
            }, this);
          }
        },
        renderTitle: function() {
          var options = this.options,
              padding = this.padding,
              titleOptions = options.title,
              titleHeight = 0,
              bBox;
          if (titleOptions.text) {
            if (!this.title) {
              this.title = this.chart.renderer.label(titleOptions.text, padding - 3, padding - 4, null, null, null, options.useHTML, null, 'legend-title').attr({zIndex: 1}).add(this.group);
            }
            bBox = this.title.getBBox();
            titleHeight = bBox.height;
            this.offsetWidth = bBox.width;
            this.contentGroup.attr({translateY: titleHeight});
          }
          this.titleHeight = titleHeight;
        },
        setText: function(item) {
          var options = this.options;
          item.legendItem.attr({text: options.labelFormat ? H.format(options.labelFormat, item, this.chart.time) : options.labelFormatter.call(item)});
        },
        renderItem: function(item) {
          var legend = this,
              chart = legend.chart,
              renderer = chart.renderer,
              options = legend.options,
              horizontal = options.layout === 'horizontal',
              symbolWidth = legend.symbolWidth,
              symbolPadding = options.symbolPadding,
              padding = legend.padding,
              itemDistance = horizontal ? pick(options.itemDistance, 20) : 0,
              ltr = !options.rtl,
              itemHeight,
              widthOption = options.width,
              itemMarginBottom = options.itemMarginBottom || 0,
              itemMarginTop = legend.itemMarginTop,
              bBox,
              itemWidth,
              li = item.legendItem,
              isSeries = !item.series,
              series = !isSeries && item.series.drawLegendSymbol ? item.series : item,
              seriesOptions = series.options,
              showCheckbox = legend.createCheckboxForItem && seriesOptions && seriesOptions.showCheckbox,
              itemExtraWidth = symbolWidth + symbolPadding + itemDistance + (showCheckbox ? 20 : 0),
              useHTML = options.useHTML,
              fontSize = 12,
              itemClassName = item.options.className;
          if (!li) {
            item.legendGroup = renderer.g('legend-item').addClass('highcharts-' + series.type + '-series ' + 'highcharts-color-' + item.colorIndex + (itemClassName ? ' ' + itemClassName : '') + (isSeries ? ' highcharts-series-' + item.index : '')).attr({zIndex: 1}).add(legend.scrollGroup);
            item.legendItem = li = renderer.text('', ltr ? symbolWidth + symbolPadding : -symbolPadding, legend.baseline || 0, useHTML).attr({
              align: ltr ? 'left' : 'right',
              zIndex: 2
            }).add(item.legendGroup);
            if (!legend.baseline) {
              legend.fontMetrics = renderer.fontMetrics(fontSize, li);
              legend.baseline = legend.fontMetrics.f + 3 + itemMarginTop;
              li.attr('y', legend.baseline);
            }
            legend.symbolHeight = options.symbolHeight || legend.fontMetrics.f;
            series.drawLegendSymbol(legend, item);
            if (legend.setItemEvents) {
              legend.setItemEvents(item, li, useHTML);
            }
            if (showCheckbox) {
              legend.createCheckboxForItem(item);
            }
          }
          legend.colorizeItem(item, item.visible);
          li.css({width: (options.itemWidth || options.width || chart.spacingBox.width) - itemExtraWidth});
          legend.setText(item);
          bBox = li.getBBox();
          itemWidth = item.checkboxOffset = options.itemWidth || item.legendItemWidth || bBox.width + itemExtraWidth;
          legend.itemHeight = itemHeight = Math.round(item.legendItemHeight || bBox.height || legend.symbolHeight);
          if (horizontal && legend.itemX - padding + itemWidth > (widthOption || (chart.spacingBox.width - 2 * padding - options.x))) {
            legend.itemX = padding;
            legend.itemY += itemMarginTop + legend.lastLineHeight + itemMarginBottom;
            legend.lastLineHeight = 0;
          }
          legend.maxItemWidth = Math.max(legend.maxItemWidth, itemWidth);
          legend.lastItemY = itemMarginTop + legend.itemY + itemMarginBottom;
          legend.lastLineHeight = Math.max(itemHeight, legend.lastLineHeight);
          item._legendItemPos = [legend.itemX, legend.itemY];
          if (horizontal) {
            legend.itemX += itemWidth;
          } else {
            legend.itemY += itemMarginTop + itemHeight + itemMarginBottom;
            legend.lastLineHeight = itemHeight;
          }
          legend.offsetWidth = widthOption || Math.max((horizontal ? legend.itemX - padding - (item.checkbox ? 0 : itemDistance) : itemWidth) + padding, legend.offsetWidth);
        },
        getAllItems: function() {
          var allItems = [];
          each(this.chart.series, function(series) {
            var seriesOptions = series && series.options;
            if (series && pick(seriesOptions.showInLegend, !defined(seriesOptions.linkedTo) ? undefined : false, true)) {
              allItems = allItems.concat(series.legendItems || (seriesOptions.legendType === 'point' ? series.data : series));
            }
          });
          return allItems;
        },
        getAlignment: function() {
          var options = this.options;
          return options.floating ? '' : (options.align.charAt(0) + options.verticalAlign.charAt(0) + options.layout.charAt(0));
        },
        adjustMargins: function(margin, spacing) {
          var chart = this.chart,
              options = this.options,
              alignment = this.getAlignment();
          if (alignment) {
            each([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function(alignments, side) {
              if (alignments.test(alignment) && !defined(margin[side])) {
                chart[marginNames[side]] = Math.max(chart[marginNames[side]], (chart.legend[(side + 1) % 2 ? 'legendHeight' : 'legendWidth'] + [1, -1, -1, 1][side] * options[(side % 2) ? 'x' : 'y'] + pick(options.margin, 12) + spacing[side] + (side === 0 ? chart.titleOffset + chart.options.title.margin : 0)));
              }
            });
          }
        },
        render: function() {
          var legend = this,
              chart = legend.chart,
              renderer = chart.renderer,
              legendGroup = legend.group,
              allItems,
              display,
              legendWidth,
              legendHeight,
              box = legend.box,
              options = legend.options,
              padding = legend.padding,
              alignTo;
          legend.itemX = padding;
          legend.itemY = legend.initialItemY;
          legend.offsetWidth = 0;
          legend.lastItemY = 0;
          if (!legendGroup) {
            legend.group = legendGroup = renderer.g('legend').attr({zIndex: 7}).add();
            legend.contentGroup = renderer.g().attr({zIndex: 1}).add(legendGroup);
            legend.scrollGroup = renderer.g().add(legend.contentGroup);
          }
          legend.renderTitle();
          allItems = legend.getAllItems();
          stableSort(allItems, function(a, b) {
            return ((a.options && a.options.legendIndex) || 0) - ((b.options && b.options.legendIndex) || 0);
          });
          if (options.reversed) {
            allItems.reverse();
          }
          legend.allItems = allItems;
          legend.display = display = !!allItems.length;
          legend.lastLineHeight = 0;
          each(allItems, function(item) {
            legend.renderItem(item);
          });
          legendWidth = (options.width || legend.offsetWidth) + padding;
          legendHeight = legend.lastItemY + legend.lastLineHeight + legend.titleHeight;
          legendHeight = legend.handleOverflow(legendHeight);
          legendHeight += padding;
          if (!box) {
            legend.box = box = renderer.rect().addClass('highcharts-legend-box').attr({r: options.borderRadius}).add(legendGroup);
            box.isNew = true;
          }
          if (legendWidth > 0 && legendHeight > 0) {
            box[box.isNew ? 'attr' : 'animate'](box.crisp.call({}, {
              x: 0,
              y: 0,
              width: legendWidth,
              height: legendHeight
            }, box.strokeWidth()));
            box.isNew = false;
          }
          box[display ? 'show' : 'hide']();
          if (legendGroup.getStyle('display') === 'none') {
            legendWidth = legendHeight = 0;
          }
          legend.legendWidth = legendWidth;
          legend.legendHeight = legendHeight;
          each(allItems, function(item) {
            legend.positionItem(item);
          });
          if (display) {
            alignTo = chart.spacingBox;
            if (/(lth|ct|rth)/.test(legend.getAlignment())) {
              alignTo = merge(alignTo, {y: alignTo.y + chart.titleOffset + chart.options.title.margin});
            }
            legendGroup.align(merge(options, {
              width: legendWidth,
              height: legendHeight
            }), true, alignTo);
          }
          if (!chart.isResizing) {
            this.positionCheckboxes();
          }
        },
        handleOverflow: function(legendHeight) {
          var legend = this,
              chart = this.chart,
              renderer = chart.renderer,
              options = this.options,
              optionsY = options.y,
              alignTop = options.verticalAlign === 'top',
              padding = this.padding,
              spaceHeight = chart.spacingBox.height + (alignTop ? -optionsY : optionsY) - padding,
              maxHeight = options.maxHeight,
              clipHeight,
              clipRect = this.clipRect,
              navOptions = options.navigation,
              animation = pick(navOptions.animation, true),
              arrowSize = navOptions.arrowSize || 12,
              nav = this.nav,
              pages = this.pages,
              lastY,
              allItems = this.allItems,
              clipToHeight = function(height) {
                if (typeof height === 'number') {
                  clipRect.attr({height: height});
                } else if (clipRect) {
                  legend.clipRect = clipRect.destroy();
                  legend.contentGroup.clip();
                }
                if (legend.contentGroup.div) {
                  legend.contentGroup.div.style.clip = height ? 'rect(' + padding + 'px,9999px,' + (padding + height) + 'px,0)' : 'auto';
                }
              };
          if (options.layout === 'horizontal' && options.verticalAlign !== 'middle' && !options.floating) {
            spaceHeight /= 2;
          }
          if (maxHeight) {
            spaceHeight = Math.min(spaceHeight, maxHeight);
          }
          pages.length = 0;
          if (legendHeight > spaceHeight && navOptions.enabled !== false) {
            this.clipHeight = clipHeight = Math.max(spaceHeight - 20 - this.titleHeight - padding, 0);
            this.currentPage = pick(this.currentPage, 1);
            this.fullHeight = legendHeight;
            each(allItems, function(item, i) {
              var y = item._legendItemPos[1],
                  h = Math.round(item.legendItem.getBBox().height),
                  len = pages.length;
              if (!len || (y - pages[len - 1] > clipHeight && (lastY || y) !== pages[len - 1])) {
                pages.push(lastY || y);
                len++;
              }
              item.pageIx = len - 1;
              if (lastY) {
                allItems[i - 1].pageIx = len - 1;
              }
              if (i === allItems.length - 1 && y + h - pages[len - 1] > clipHeight) {
                pages.push(y);
                item.pageIx = len;
              }
              if (y !== lastY) {
                lastY = y;
              }
            });
            if (!clipRect) {
              clipRect = legend.clipRect = renderer.clipRect(0, padding, 9999, 0);
              legend.contentGroup.clip(clipRect);
            }
            clipToHeight(clipHeight);
            if (!nav) {
              this.nav = nav = renderer.g().attr({zIndex: 1}).add(this.group);
              this.up = renderer.symbol('triangle', 0, 0, arrowSize, arrowSize).on('click', function() {
                legend.scroll(-1, animation);
              }).add(nav);
              this.pager = renderer.text('', 15, 10).addClass('highcharts-legend-navigation').add(nav);
              this.down = renderer.symbol('triangle-down', 0, 0, arrowSize, arrowSize).on('click', function() {
                legend.scroll(1, animation);
              }).add(nav);
            }
            legend.scroll(0);
            legendHeight = spaceHeight;
          } else if (nav) {
            clipToHeight();
            this.nav = nav.destroy();
            this.scrollGroup.attr({translateY: 1});
            this.clipHeight = 0;
          }
          return legendHeight;
        },
        scroll: function(scrollBy, animation) {
          var pages = this.pages,
              pageCount = pages.length,
              currentPage = this.currentPage + scrollBy,
              clipHeight = this.clipHeight,
              navOptions = this.options.navigation,
              pager = this.pager,
              padding = this.padding;
          if (currentPage > pageCount) {
            currentPage = pageCount;
          }
          if (currentPage > 0) {
            if (animation !== undefined) {
              setAnimation(animation, this.chart);
            }
            this.nav.attr({
              translateX: padding,
              translateY: clipHeight + this.padding + 7 + this.titleHeight,
              visibility: 'visible'
            });
            this.up.attr({'class': currentPage === 1 ? 'highcharts-legend-nav-inactive' : 'highcharts-legend-nav-active'});
            pager.attr({text: currentPage + '/' + pageCount});
            this.down.attr({
              'x': 18 + this.pager.getBBox().width,
              'class': currentPage === pageCount ? 'highcharts-legend-nav-inactive' : 'highcharts-legend-nav-active'
            });
            this.scrollOffset = -pages[currentPage - 1] + this.initialItemY;
            this.scrollGroup.animate({translateY: this.scrollOffset});
            this.currentPage = currentPage;
            this.positionCheckboxes();
          }
        }
      };
      H.LegendSymbolMixin = {
        drawRectangle: function(legend, item) {
          var options = legend.options,
              symbolHeight = legend.symbolHeight,
              square = options.squareSymbol,
              symbolWidth = square ? symbolHeight : legend.symbolWidth;
          item.legendSymbol = this.chart.renderer.rect(square ? (legend.symbolWidth - symbolHeight) / 2 : 0, legend.baseline - symbolHeight + 1, symbolWidth, symbolHeight, pick(legend.options.symbolRadius, symbolHeight / 2)).addClass('highcharts-point').attr({zIndex: 3}).add(item.legendGroup);
        },
        drawLineMarker: function(legend) {
          var options = this.options,
              markerOptions = options.marker,
              radius,
              legendSymbol,
              symbolWidth = legend.symbolWidth,
              symbolHeight = legend.symbolHeight,
              generalRadius = symbolHeight / 2,
              renderer = this.chart.renderer,
              legendItemGroup = this.legendGroup,
              verticalCenter = legend.baseline - Math.round(legend.fontMetrics.b * 0.3),
              attr = {};
          this.legendLine = renderer.path(['M', 0, verticalCenter, 'L', symbolWidth, verticalCenter]).addClass('highcharts-graph').attr(attr).add(legendItemGroup);
          if (markerOptions && markerOptions.enabled !== false) {
            radius = Math.min(pick(markerOptions.radius, generalRadius), generalRadius);
            if (this.symbol.indexOf('url') === 0) {
              markerOptions = merge(markerOptions, {
                width: symbolHeight,
                height: symbolHeight
              });
              radius = 0;
            }
            this.legendSymbol = legendSymbol = renderer.symbol(this.symbol, (symbolWidth / 2) - radius, verticalCenter - radius, 2 * radius, 2 * radius, markerOptions).addClass('highcharts-point').add(legendItemGroup);
            legendSymbol.isMarker = true;
          }
        }
      };
      if (/Trident\/7\.0/.test(win.navigator.userAgent) || isFirefox) {
        wrap(Highcharts.Legend.prototype, 'positionItem', function(proceed, item) {
          var legend = this,
              runPositionItem = function() {
                if (item._legendItemPos) {
                  proceed.call(legend, item);
                }
              };
          runPositionItem();
          setTimeout(runPositionItem);
        });
      }
    }(Highcharts));
    (function(H) {
      var addEvent = H.addEvent,
          animate = H.animate,
          animObject = H.animObject,
          attr = H.attr,
          doc = H.doc,
          Axis = H.Axis,
          createElement = H.createElement,
          defaultOptions = H.defaultOptions,
          discardElement = H.discardElement,
          charts = H.charts,
          css = H.css,
          defined = H.defined,
          each = H.each,
          extend = H.extend,
          find = H.find,
          fireEvent = H.fireEvent,
          grep = H.grep,
          isNumber = H.isNumber,
          isObject = H.isObject,
          isString = H.isString,
          Legend = H.Legend,
          marginNames = H.marginNames,
          merge = H.merge,
          objectEach = H.objectEach,
          Pointer = H.Pointer,
          pick = H.pick,
          pInt = H.pInt,
          removeEvent = H.removeEvent,
          seriesTypes = H.seriesTypes,
          splat = H.splat,
          syncTimeout = H.syncTimeout,
          win = H.win;
      var Chart = H.Chart = function() {
        this.getArgs.apply(this, arguments);
      };
      H.chart = function(a, b, c) {
        return new Chart(a, b, c);
      };
      extend(Chart.prototype, {
        callbacks: [],
        getArgs: function() {
          var args = [].slice.call(arguments);
          if (isString(args[0]) || args[0].nodeName) {
            this.renderTo = args.shift();
          }
          this.init(args[0], args[1]);
        },
        init: function(userOptions, callback) {
          var options,
              type,
              seriesOptions = userOptions.series,
              userPlotOptions = userOptions.plotOptions || {};
          userOptions.series = null;
          options = merge(defaultOptions, userOptions);
          for (type in options.plotOptions) {
            options.plotOptions[type].tooltip = (userPlotOptions[type] && merge(userPlotOptions[type].tooltip)) || undefined;
          }
          options.tooltip.userOptions = (userOptions.chart && userOptions.chart.forExport && userOptions.tooltip.userOptions) || userOptions.tooltip;
          options.series = userOptions.series = seriesOptions;
          this.userOptions = userOptions;
          var optionsChart = options.chart;
          var chartEvents = optionsChart.events;
          this.margin = [];
          this.spacing = [];
          this.bounds = {
            h: {},
            v: {}
          };
          this.labelCollectors = [];
          this.callback = callback;
          this.isResizing = 0;
          this.options = options;
          this.axes = [];
          this.series = [];
          this.time = userOptions.time && H.keys(userOptions.time).length ? new H.Time(userOptions.time) : H.time;
          this.hasCartesianSeries = optionsChart.showAxes;
          var chart = this;
          chart.index = charts.length;
          charts.push(chart);
          H.chartCount++;
          if (chartEvents) {
            objectEach(chartEvents, function(event, eventType) {
              addEvent(chart, eventType, event);
            });
          }
          chart.xAxis = [];
          chart.yAxis = [];
          chart.pointCount = chart.colorCounter = chart.symbolCounter = 0;
          chart.firstRender();
        },
        initSeries: function(options) {
          var chart = this,
              optionsChart = chart.options.chart,
              type = (options.type || optionsChart.type || optionsChart.defaultSeriesType),
              series,
              Constr = seriesTypes[type];
          if (!Constr) {
            H.error(17, true);
          }
          series = new Constr();
          series.init(this, options);
          return series;
        },
        orderSeries: function(fromIndex) {
          var series = this.series,
              i = fromIndex || 0;
          for (; i < series.length; i++) {
            if (series[i]) {
              series[i].index = i;
              series[i].name = series[i].getName();
            }
          }
        },
        isInsidePlot: function(plotX, plotY, inverted) {
          var x = inverted ? plotY : plotX,
              y = inverted ? plotX : plotY;
          return x >= 0 && x <= this.plotWidth && y >= 0 && y <= this.plotHeight;
        },
        redraw: function(animation) {
          var chart = this,
              axes = chart.axes,
              series = chart.series,
              pointer = chart.pointer,
              legend = chart.legend,
              redrawLegend = chart.isDirtyLegend,
              hasStackedSeries,
              hasDirtyStacks,
              hasCartesianSeries = chart.hasCartesianSeries,
              isDirtyBox = chart.isDirtyBox,
              i,
              serie,
              renderer = chart.renderer,
              isHiddenChart = renderer.isHidden(),
              afterRedraw = [];
          if (chart.setResponsive) {
            chart.setResponsive(false);
          }
          H.setAnimation(animation, chart);
          if (isHiddenChart) {
            chart.temporaryDisplay();
          }
          chart.layOutTitles();
          i = series.length;
          while (i--) {
            serie = series[i];
            if (serie.options.stacking) {
              hasStackedSeries = true;
              if (serie.isDirty) {
                hasDirtyStacks = true;
                break;
              }
            }
          }
          if (hasDirtyStacks) {
            i = series.length;
            while (i--) {
              serie = series[i];
              if (serie.options.stacking) {
                serie.isDirty = true;
              }
            }
          }
          each(series, function(serie) {
            if (serie.isDirty) {
              if (serie.options.legendType === 'point') {
                if (serie.updateTotals) {
                  serie.updateTotals();
                }
                redrawLegend = true;
              }
            }
            if (serie.isDirtyData) {
              fireEvent(serie, 'updatedData');
            }
          });
          if (redrawLegend && legend.options.enabled) {
            legend.render();
            chart.isDirtyLegend = false;
          }
          if (hasStackedSeries) {
            chart.getStacks();
          }
          if (hasCartesianSeries) {
            each(axes, function(axis) {
              axis.updateNames();
              axis.setScale();
            });
          }
          chart.getMargins();
          if (hasCartesianSeries) {
            each(axes, function(axis) {
              if (axis.isDirty) {
                isDirtyBox = true;
              }
            });
            each(axes, function(axis) {
              var key = axis.min + ',' + axis.max;
              if (axis.extKey !== key) {
                axis.extKey = key;
                afterRedraw.push(function() {
                  fireEvent(axis, 'afterSetExtremes', extend(axis.eventArgs, axis.getExtremes()));
                  delete axis.eventArgs;
                });
              }
              if (isDirtyBox || hasStackedSeries) {
                axis.redraw();
              }
            });
          }
          if (isDirtyBox) {
            chart.drawChartBox();
          }
          fireEvent(chart, 'predraw');
          each(series, function(serie) {
            if ((isDirtyBox || serie.isDirty) && serie.visible) {
              serie.redraw();
            }
            serie.isDirtyData = false;
          });
          if (pointer) {
            pointer.reset(true);
          }
          renderer.draw();
          fireEvent(chart, 'redraw');
          fireEvent(chart, 'render');
          if (isHiddenChart) {
            chart.temporaryDisplay(true);
          }
          each(afterRedraw, function(callback) {
            callback.call();
          });
        },
        get: function(id) {
          var ret,
              series = this.series,
              i;
          function itemById(item) {
            return item.id === id || (item.options && item.options.id === id);
          }
          ret = find(this.axes, itemById) || find(this.series, itemById);
          for (i = 0; !ret && i < series.length; i++) {
            ret = find(series[i].points || [], itemById);
          }
          return ret;
        },
        getAxes: function() {
          var chart = this,
              options = this.options,
              xAxisOptions = options.xAxis = splat(options.xAxis || {}),
              yAxisOptions = options.yAxis = splat(options.yAxis || {}),
              optionsArray;
          fireEvent(this, 'beforeGetAxes');
          each(xAxisOptions, function(axis, i) {
            axis.index = i;
            axis.isX = true;
          });
          each(yAxisOptions, function(axis, i) {
            axis.index = i;
          });
          optionsArray = xAxisOptions.concat(yAxisOptions);
          each(optionsArray, function(axisOptions) {
            new Axis(chart, axisOptions);
          });
        },
        getSelectedPoints: function() {
          var points = [];
          each(this.series, function(serie) {
            points = points.concat(grep(serie.data || [], function(point) {
              return point.selected;
            }));
          });
          return points;
        },
        getSelectedSeries: function() {
          return grep(this.series, function(serie) {
            return serie.selected;
          });
        },
        setTitle: function(titleOptions, subtitleOptions, redraw) {
          var chart = this,
              options = chart.options,
              chartTitleOptions,
              chartSubtitleOptions;
          chartTitleOptions = options.title = merge(options.title, titleOptions);
          chartSubtitleOptions = options.subtitle = merge(options.subtitle, subtitleOptions);
          each([['title', titleOptions, chartTitleOptions], ['subtitle', subtitleOptions, chartSubtitleOptions]], function(arr, i) {
            var name = arr[0],
                title = chart[name],
                titleOptions = arr[1],
                chartTitleOptions = arr[2];
            if (title && titleOptions) {
              chart[name] = title = title.destroy();
            }
            if (chartTitleOptions && !title) {
              chart[name] = chart.renderer.text(chartTitleOptions.text, 0, 0, chartTitleOptions.useHTML).attr({
                align: chartTitleOptions.align,
                'class': 'highcharts-' + name,
                zIndex: chartTitleOptions.zIndex || 4
              }).add();
              chart[name].update = function(o) {
                chart.setTitle(!i && o, i && o);
              };
            }
          });
          chart.layOutTitles(redraw);
        },
        layOutTitles: function(redraw) {
          var titleOffset = 0,
              requiresDirtyBox,
              renderer = this.renderer,
              spacingBox = this.spacingBox;
          each(['title', 'subtitle'], function(key) {
            var title = this[key],
                titleOptions = this.options[key],
                offset = key === 'title' ? -3 : titleOptions.verticalAlign ? 0 : titleOffset + 2,
                titleSize;
            if (title) {
              titleSize = renderer.fontMetrics(titleSize, title).b;
              title.css({width: (titleOptions.width || spacingBox.width + titleOptions.widthAdjust) + 'px'}).align(extend({y: offset + titleSize}, titleOptions), false, 'spacingBox');
              if (!titleOptions.floating && !titleOptions.verticalAlign) {
                titleOffset = Math.ceil(titleOffset + title.getBBox(titleOptions.useHTML).height);
              }
            }
          }, this);
          requiresDirtyBox = this.titleOffset !== titleOffset;
          this.titleOffset = titleOffset;
          if (!this.isDirtyBox && requiresDirtyBox) {
            this.isDirtyBox = requiresDirtyBox;
            if (this.hasRendered && pick(redraw, true) && this.isDirtyBox) {
              this.redraw();
            }
          }
        },
        getChartSize: function() {
          var chart = this,
              optionsChart = chart.options.chart,
              widthOption = optionsChart.width,
              heightOption = optionsChart.height,
              renderTo = chart.renderTo;
          if (!defined(widthOption)) {
            chart.containerWidth = H.getStyle(renderTo, 'width');
          }
          if (!defined(heightOption)) {
            chart.containerHeight = H.getStyle(renderTo, 'height');
          }
          chart.chartWidth = Math.max(0, widthOption || chart.containerWidth || 600);
          chart.chartHeight = Math.max(0, H.relativeLength(heightOption, chart.chartWidth) || (chart.containerHeight > 1 ? chart.containerHeight : 400));
        },
        temporaryDisplay: function(revert) {
          var node = this.renderTo,
              tempStyle;
          if (!revert) {
            while (node && node.style) {
              if (!doc.body.contains(node) && !node.parentNode) {
                node.hcOrigDetached = true;
                doc.body.appendChild(node);
              }
              if (H.getStyle(node, 'display', false) === 'none' || node.hcOricDetached) {
                node.hcOrigStyle = {
                  display: node.style.display,
                  height: node.style.height,
                  overflow: node.style.overflow
                };
                tempStyle = {
                  display: 'block',
                  overflow: 'hidden'
                };
                if (node !== this.renderTo) {
                  tempStyle.height = 0;
                }
                H.css(node, tempStyle);
                if (!node.offsetWidth) {
                  node.style.setProperty('display', 'block', 'important');
                }
              }
              node = node.parentNode;
              if (node === doc.body) {
                break;
              }
            }
          } else {
            while (node && node.style) {
              if (node.hcOrigStyle) {
                H.css(node, node.hcOrigStyle);
                delete node.hcOrigStyle;
              }
              if (node.hcOrigDetached) {
                doc.body.removeChild(node);
                node.hcOrigDetached = false;
              }
              node = node.parentNode;
            }
          }
        },
        setClassName: function(className) {
          this.container.className = 'highcharts-container ' + (className || '');
        },
        getContainer: function() {
          var chart = this,
              container,
              options = chart.options,
              optionsChart = options.chart,
              chartWidth,
              chartHeight,
              renderTo = chart.renderTo,
              indexAttrName = 'data-highcharts-chart',
              oldChartIndex,
              Ren,
              containerId = H.uniqueKey(),
              containerStyle,
              key;
          if (!renderTo) {
            chart.renderTo = renderTo = optionsChart.renderTo;
          }
          if (isString(renderTo)) {
            chart.renderTo = renderTo = doc.getElementById(renderTo);
          }
          if (!renderTo) {
            H.error(13, true);
          }
          oldChartIndex = pInt(attr(renderTo, indexAttrName));
          if (isNumber(oldChartIndex) && charts[oldChartIndex] && charts[oldChartIndex].hasRendered) {
            charts[oldChartIndex].destroy();
          }
          attr(renderTo, indexAttrName, chart.index);
          renderTo.innerHTML = '';
          if (!optionsChart.skipClone && !renderTo.offsetWidth) {
            chart.temporaryDisplay();
          }
          chart.getChartSize();
          chartWidth = chart.chartWidth;
          chartHeight = chart.chartHeight;
          container = createElement('div', {id: containerId}, containerStyle, renderTo);
          chart.container = container;
          chart._cursor = container.style.cursor;
          Ren = H[optionsChart.renderer] || H.Renderer;
          chart.renderer = new Ren(container, chartWidth, chartHeight, null, optionsChart.forExport, options.exporting && options.exporting.allowHTML);
          chart.setClassName(optionsChart.className);
          for (key in options.defs) {
            this.renderer.definition(options.defs[key]);
          }
          chart.renderer.chartIndex = chart.index;
        },
        getMargins: function(skipAxes) {
          var chart = this,
              spacing = chart.spacing,
              margin = chart.margin,
              titleOffset = chart.titleOffset;
          chart.resetMargins();
          if (titleOffset && !defined(margin[0])) {
            chart.plotTop = Math.max(chart.plotTop, titleOffset + chart.options.title.margin + spacing[0]);
          }
          if (chart.legend && chart.legend.display) {
            chart.legend.adjustMargins(margin, spacing);
          }
          if (chart.extraMargin) {
            chart[chart.extraMargin.type] = (chart[chart.extraMargin.type] || 0) + chart.extraMargin.value;
          }
          if (chart.adjustPlotArea) {
            chart.adjustPlotArea();
          }
          if (!skipAxes) {
            this.getAxisMargins();
          }
        },
        getAxisMargins: function() {
          var chart = this,
              axisOffset = chart.axisOffset = [0, 0, 0, 0],
              margin = chart.margin;
          if (chart.hasCartesianSeries) {
            each(chart.axes, function(axis) {
              if (axis.visible) {
                axis.getOffset();
              }
            });
          }
          each(marginNames, function(m, side) {
            if (!defined(margin[side])) {
              chart[m] += axisOffset[side];
            }
          });
          chart.setChartSize();
        },
        reflow: function(e) {
          var chart = this,
              optionsChart = chart.options.chart,
              renderTo = chart.renderTo,
              hasUserSize = (defined(optionsChart.width) && defined(optionsChart.height)),
              width = optionsChart.width || H.getStyle(renderTo, 'width'),
              height = optionsChart.height || H.getStyle(renderTo, 'height'),
              target = e ? e.target : win;
          if (!hasUserSize && !chart.isPrinting && width && height && (target === win || target === doc)) {
            if (width !== chart.containerWidth || height !== chart.containerHeight) {
              clearTimeout(chart.reflowTimeout);
              chart.reflowTimeout = syncTimeout(function() {
                if (chart.container) {
                  chart.setSize(undefined, undefined, false);
                }
              }, e ? 100 : 0);
            }
            chart.containerWidth = width;
            chart.containerHeight = height;
          }
        },
        initReflow: function() {
          var chart = this,
              unbind;
          unbind = addEvent(win, 'resize', function(e) {
            chart.reflow(e);
          });
          addEvent(chart, 'destroy', unbind);
        },
        setSize: function(width, height, animation) {
          var chart = this,
              renderer = chart.renderer,
              globalAnimation;
          chart.isResizing += 1;
          H.setAnimation(animation, chart);
          chart.oldChartHeight = chart.chartHeight;
          chart.oldChartWidth = chart.chartWidth;
          if (width !== undefined) {
            chart.options.chart.width = width;
          }
          if (height !== undefined) {
            chart.options.chart.height = height;
          }
          chart.getChartSize();
          chart.setChartSize(true);
          renderer.setSize(chart.chartWidth, chart.chartHeight, animation);
          each(chart.axes, function(axis) {
            axis.isDirty = true;
            axis.setScale();
          });
          chart.isDirtyLegend = true;
          chart.isDirtyBox = true;
          chart.layOutTitles();
          chart.getMargins();
          chart.redraw(animation);
          chart.oldChartHeight = null;
          fireEvent(chart, 'resize');
          syncTimeout(function() {
            if (chart) {
              fireEvent(chart, 'endResize', null, function() {
                chart.isResizing -= 1;
              });
            }
          }, animObject(globalAnimation).duration);
        },
        setChartSize: function(skipAxes) {
          var chart = this,
              inverted = chart.inverted,
              renderer = chart.renderer,
              chartWidth = chart.chartWidth,
              chartHeight = chart.chartHeight,
              optionsChart = chart.options.chart,
              spacing = chart.spacing,
              clipOffset = chart.clipOffset,
              clipX,
              clipY,
              plotLeft,
              plotTop,
              plotWidth,
              plotHeight,
              plotBorderWidth;
          chart.plotLeft = plotLeft = Math.round(chart.plotLeft);
          chart.plotTop = plotTop = Math.round(chart.plotTop);
          chart.plotWidth = plotWidth = Math.max(0, Math.round(chartWidth - plotLeft - chart.marginRight));
          chart.plotHeight = plotHeight = Math.max(0, Math.round(chartHeight - plotTop - chart.marginBottom));
          chart.plotSizeX = inverted ? plotHeight : plotWidth;
          chart.plotSizeY = inverted ? plotWidth : plotHeight;
          chart.plotBorderWidth = optionsChart.plotBorderWidth || 0;
          chart.spacingBox = renderer.spacingBox = {
            x: spacing[3],
            y: spacing[0],
            width: chartWidth - spacing[3] - spacing[1],
            height: chartHeight - spacing[0] - spacing[2]
          };
          chart.plotBox = renderer.plotBox = {
            x: plotLeft,
            y: plotTop,
            width: plotWidth,
            height: plotHeight
          };
          plotBorderWidth = 2 * Math.floor(chart.plotBorderWidth / 2);
          clipX = Math.ceil(Math.max(plotBorderWidth, clipOffset[3]) / 2);
          clipY = Math.ceil(Math.max(plotBorderWidth, clipOffset[0]) / 2);
          chart.clipBox = {
            x: clipX,
            y: clipY,
            width: Math.floor(chart.plotSizeX - Math.max(plotBorderWidth, clipOffset[1]) / 2 - clipX),
            height: Math.max(0, Math.floor(chart.plotSizeY - Math.max(plotBorderWidth, clipOffset[2]) / 2 - clipY))
          };
          if (!skipAxes) {
            each(chart.axes, function(axis) {
              axis.setAxisSize();
              axis.setAxisTranslation();
            });
          }
        },
        resetMargins: function() {
          var chart = this,
              chartOptions = chart.options.chart;
          each(['margin', 'spacing'], function splashArrays(target) {
            var value = chartOptions[target],
                values = isObject(value) ? value : [value, value, value, value];
            each(['Top', 'Right', 'Bottom', 'Left'], function(sideName, side) {
              chart[target][side] = pick(chartOptions[target + sideName], values[side]);
            });
          });
          each(marginNames, function(m, side) {
            chart[m] = pick(chart.margin[side], chart.spacing[side]);
          });
          chart.axisOffset = [0, 0, 0, 0];
          chart.clipOffset = [0, 0, 0, 0];
        },
        drawChartBox: function() {
          var chart = this,
              optionsChart = chart.options.chart,
              renderer = chart.renderer,
              chartWidth = chart.chartWidth,
              chartHeight = chart.chartHeight,
              chartBackground = chart.chartBackground,
              plotBackground = chart.plotBackground,
              plotBorder = chart.plotBorder,
              chartBorderWidth,
              mgn,
              bgAttr,
              plotLeft = chart.plotLeft,
              plotTop = chart.plotTop,
              plotWidth = chart.plotWidth,
              plotHeight = chart.plotHeight,
              plotBox = chart.plotBox,
              clipRect = chart.clipRect,
              clipBox = chart.clipBox,
              verb = 'animate';
          if (!chartBackground) {
            chart.chartBackground = chartBackground = renderer.rect().addClass('highcharts-background').add();
            verb = 'attr';
          }
          chartBorderWidth = mgn = chartBackground.strokeWidth();
          chartBackground[verb]({
            x: mgn / 2,
            y: mgn / 2,
            width: chartWidth - mgn - chartBorderWidth % 2,
            height: chartHeight - mgn - chartBorderWidth % 2,
            r: optionsChart.borderRadius
          });
          verb = 'animate';
          if (!plotBackground) {
            verb = 'attr';
            chart.plotBackground = plotBackground = renderer.rect().addClass('highcharts-plot-background').add();
          }
          plotBackground[verb](plotBox);
          if (!clipRect) {
            chart.clipRect = renderer.clipRect(clipBox);
          } else {
            clipRect.animate({
              width: clipBox.width,
              height: clipBox.height
            });
          }
          verb = 'animate';
          if (!plotBorder) {
            verb = 'attr';
            chart.plotBorder = plotBorder = renderer.rect().addClass('highcharts-plot-border').attr({zIndex: 1}).add();
          }
          plotBorder[verb](plotBorder.crisp({
            x: plotLeft,
            y: plotTop,
            width: plotWidth,
            height: plotHeight
          }, -plotBorder.strokeWidth()));
          chart.isDirtyBox = false;
          fireEvent(this, 'afterDrawChartBox');
        },
        propFromSeries: function() {
          var chart = this,
              optionsChart = chart.options.chart,
              klass,
              seriesOptions = chart.options.series,
              i,
              value;
          each(['inverted', 'angular', 'polar'], function(key) {
            klass = seriesTypes[optionsChart.type || optionsChart.defaultSeriesType];
            value = optionsChart[key] || (klass && klass.prototype[key]);
            i = seriesOptions && seriesOptions.length;
            while (!value && i--) {
              klass = seriesTypes[seriesOptions[i].type];
              if (klass && klass.prototype[key]) {
                value = true;
              }
            }
            chart[key] = value;
          });
        },
        linkSeries: function() {
          var chart = this,
              chartSeries = chart.series;
          each(chartSeries, function(series) {
            series.linkedSeries.length = 0;
          });
          each(chartSeries, function(series) {
            var linkedTo = series.options.linkedTo;
            if (isString(linkedTo)) {
              if (linkedTo === ':previous') {
                linkedTo = chart.series[series.index - 1];
              } else {
                linkedTo = chart.get(linkedTo);
              }
              if (linkedTo && linkedTo.linkedParent !== series) {
                linkedTo.linkedSeries.push(series);
                series.linkedParent = linkedTo;
                series.visible = pick(series.options.visible, linkedTo.options.visible, series.visible);
              }
            }
          });
        },
        renderSeries: function() {
          each(this.series, function(serie) {
            serie.translate();
            serie.render();
          });
        },
        renderLabels: function() {
          var chart = this,
              labels = chart.options.labels;
          if (labels.items) {
            each(labels.items, function(label) {
              var style = extend(labels.style, label.style),
                  x = pInt(style.left) + chart.plotLeft,
                  y = pInt(style.top) + chart.plotTop + 12;
              delete style.left;
              delete style.top;
              chart.renderer.text(label.html, x, y).attr({zIndex: 2}).css(style).add();
            });
          }
        },
        render: function() {
          var chart = this,
              axes = chart.axes,
              renderer = chart.renderer,
              options = chart.options,
              tempWidth,
              tempHeight,
              redoHorizontal,
              redoVertical;
          chart.setTitle();
          chart.legend = new Legend(chart, options.legend);
          if (chart.getStacks) {
            chart.getStacks();
          }
          chart.getMargins(true);
          chart.setChartSize();
          tempWidth = chart.plotWidth;
          tempHeight = chart.plotHeight = Math.max(chart.plotHeight - 21, 0);
          each(axes, function(axis) {
            axis.setScale();
          });
          chart.getAxisMargins();
          redoHorizontal = tempWidth / chart.plotWidth > 1.1;
          redoVertical = tempHeight / chart.plotHeight > 1.05;
          if (redoHorizontal || redoVertical) {
            each(axes, function(axis) {
              if ((axis.horiz && redoHorizontal) || (!axis.horiz && redoVertical)) {
                axis.setTickInterval(true);
              }
            });
            chart.getMargins();
          }
          chart.drawChartBox();
          if (chart.hasCartesianSeries) {
            each(axes, function(axis) {
              if (axis.visible) {
                axis.render();
              }
            });
          }
          if (!chart.seriesGroup) {
            chart.seriesGroup = renderer.g('series-group').attr({zIndex: 3}).add();
          }
          chart.renderSeries();
          chart.renderLabels();
          chart.addCredits();
          if (chart.setResponsive) {
            chart.setResponsive();
          }
          chart.hasRendered = true;
        },
        addCredits: function(credits) {
          var chart = this;
          credits = merge(true, this.options.credits, credits);
          if (credits.enabled && !this.credits) {
            this.credits = this.renderer.text(credits.text + (this.mapCredits || ''), 0, 0).addClass('highcharts-credits').on('click', function() {
              if (credits.href) {
                win.location.href = credits.href;
              }
            }).attr({
              align: credits.position.align,
              zIndex: 8
            }).add().align(credits.position);
            this.credits.update = function(options) {
              chart.credits = chart.credits.destroy();
              chart.addCredits(options);
            };
          }
        },
        destroy: function() {
          var chart = this,
              axes = chart.axes,
              series = chart.series,
              container = chart.container,
              i,
              parentNode = container && container.parentNode;
          fireEvent(chart, 'destroy');
          if (chart.renderer.forExport) {
            H.erase(charts, chart);
          } else {
            charts[chart.index] = undefined;
          }
          H.chartCount--;
          chart.renderTo.removeAttribute('data-highcharts-chart');
          removeEvent(chart);
          i = axes.length;
          while (i--) {
            axes[i] = axes[i].destroy();
          }
          if (this.scroller && this.scroller.destroy) {
            this.scroller.destroy();
          }
          i = series.length;
          while (i--) {
            series[i] = series[i].destroy();
          }
          each(['title', 'subtitle', 'chartBackground', 'plotBackground', 'plotBGImage', 'plotBorder', 'seriesGroup', 'clipRect', 'credits', 'pointer', 'rangeSelector', 'legend', 'resetZoomButton', 'tooltip', 'renderer'], function(name) {
            var prop = chart[name];
            if (prop && prop.destroy) {
              chart[name] = prop.destroy();
            }
          });
          if (container) {
            container.innerHTML = '';
            removeEvent(container);
            if (parentNode) {
              discardElement(container);
            }
          }
          objectEach(chart, function(val, key) {
            delete chart[key];
          });
        },
        firstRender: function() {
          var chart = this,
              options = chart.options;
          if (chart.isReadyToRender && !chart.isReadyToRender()) {
            return;
          }
          chart.getContainer();
          fireEvent(chart, 'init');
          chart.resetMargins();
          chart.setChartSize();
          chart.propFromSeries();
          chart.getAxes();
          each(options.series || [], function(serieOptions) {
            chart.initSeries(serieOptions);
          });
          chart.linkSeries();
          fireEvent(chart, 'beforeRender');
          if (Pointer) {
            chart.pointer = new Pointer(chart, options);
          }
          chart.render();
          if (!chart.renderer.imgCount && chart.onload) {
            chart.onload();
          }
          chart.temporaryDisplay(true);
        },
        onload: function() {
          each([this.callback].concat(this.callbacks), function(fn) {
            if (fn && this.index !== undefined) {
              fn.apply(this, [this]);
            }
          }, this);
          fireEvent(this, 'load');
          fireEvent(this, 'render');
          if (defined(this.index) && this.options.chart.reflow !== false) {
            this.initReflow();
          }
          this.onload = null;
        }
      });
    }(Highcharts));
    (function(Highcharts) {
      var Point,
          H = Highcharts,
          each = H.each,
          extend = H.extend,
          erase = H.erase,
          fireEvent = H.fireEvent,
          format = H.format,
          isArray = H.isArray,
          isNumber = H.isNumber,
          pick = H.pick,
          removeEvent = H.removeEvent;
      Highcharts.Point = Point = function() {};
      Highcharts.Point.prototype = {
        init: function(series, options, x) {
          var point = this,
              colors,
              colorCount = series.chart.options.chart.colorCount,
              colorIndex;
          point.series = series;
          point.applyOptions(options, x);
          if (series.options.colorByPoint) {
            colorIndex = series.colorCounter;
            series.colorCounter++;
            if (series.colorCounter === colorCount) {
              series.colorCounter = 0;
            }
          } else {
            colorIndex = series.colorIndex;
          }
          point.colorIndex = pick(point.colorIndex, colorIndex);
          series.chart.pointCount++;
          fireEvent(point, 'afterInit');
          return point;
        },
        applyOptions: function(options, x) {
          var point = this,
              series = point.series,
              pointValKey = series.options.pointValKey || series.pointValKey;
          options = Point.prototype.optionsToObject.call(this, options);
          extend(point, options);
          point.options = point.options ? extend(point.options, options) : options;
          if (options.group) {
            delete point.group;
          }
          if (pointValKey) {
            point.y = point[pointValKey];
          }
          point.isNull = pick(point.isValid && !point.isValid(), point.x === null || !isNumber(point.y, true));
          if (point.selected) {
            point.state = 'select';
          }
          if ('name' in point && x === undefined && series.xAxis && series.xAxis.hasNames) {
            point.x = series.xAxis.nameToX(point);
          }
          if (point.x === undefined && series) {
            if (x === undefined) {
              point.x = series.autoIncrement(point);
            } else {
              point.x = x;
            }
          }
          return point;
        },
        optionsToObject: function(options) {
          var ret = {},
              series = this.series,
              keys = series.options.keys,
              pointArrayMap = keys || series.pointArrayMap || ['y'],
              valueCount = pointArrayMap.length,
              firstItemType,
              i = 0,
              j = 0;
          if (isNumber(options) || options === null) {
            ret[pointArrayMap[0]] = options;
          } else if (isArray(options)) {
            if (!keys && options.length > valueCount) {
              firstItemType = typeof options[0];
              if (firstItemType === 'string') {
                ret.name = options[0];
              } else if (firstItemType === 'number') {
                ret.x = options[0];
              }
              i++;
            }
            while (j < valueCount) {
              if (!keys || options[i] !== undefined) {
                ret[pointArrayMap[j]] = options[i];
              }
              i++;
              j++;
            }
          } else if (typeof options === 'object') {
            ret = options;
            if (options.dataLabels) {
              series._hasPointLabels = true;
            }
            if (options.marker) {
              series._hasPointMarkers = true;
            }
          }
          return ret;
        },
        getClassName: function() {
          return 'highcharts-point' + (this.selected ? ' highcharts-point-select' : '') + (this.negative ? ' highcharts-negative' : '') + (this.isNull ? ' highcharts-null-point' : '') + (this.colorIndex !== undefined ? ' highcharts-color-' + this.colorIndex : '') + (this.options.className ? ' ' + this.options.className : '') + (this.zone && this.zone.className ? ' ' + this.zone.className.replace('highcharts-negative', '') : '');
        },
        getZone: function() {
          var series = this.series,
              zones = series.zones,
              zoneAxis = series.zoneAxis || 'y',
              i = 0,
              zone;
          zone = zones[i];
          while (this[zoneAxis] >= zone.value) {
            zone = zones[++i];
          }
          if (zone && zone.color && !this.options.color) {
            this.color = zone.color;
          }
          return zone;
        },
        destroy: function() {
          var point = this,
              series = point.series,
              chart = series.chart,
              hoverPoints = chart.hoverPoints,
              prop;
          chart.pointCount--;
          if (hoverPoints) {
            point.setState();
            erase(hoverPoints, point);
            if (!hoverPoints.length) {
              chart.hoverPoints = null;
            }
          }
          if (point === chart.hoverPoint) {
            point.onMouseOut();
          }
          if (point.graphic || point.dataLabel) {
            removeEvent(point);
            point.destroyElements();
          }
          if (point.legendItem) {
            chart.legend.destroyItem(point);
          }
          for (prop in point) {
            point[prop] = null;
          }
        },
        destroyElements: function() {
          var point = this,
              props = ['graphic', 'dataLabel', 'dataLabelUpper', 'connector', 'shadowGroup'],
              prop,
              i = 6;
          while (i--) {
            prop = props[i];
            if (point[prop]) {
              point[prop] = point[prop].destroy();
            }
          }
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
        tooltipFormatter: function(pointFormat) {
          var series = this.series,
              seriesTooltipOptions = series.tooltipOptions,
              valueDecimals = pick(seriesTooltipOptions.valueDecimals, ''),
              valuePrefix = seriesTooltipOptions.valuePrefix || '',
              valueSuffix = seriesTooltipOptions.valueSuffix || '';
          each(series.pointArrayMap || ['y'], function(key) {
            key = '{point.' + key;
            if (valuePrefix || valueSuffix) {
              pointFormat = pointFormat.replace(key + '}', valuePrefix + key + '}' + valueSuffix);
            }
            pointFormat = pointFormat.replace(key + '}', key + ':,.' + valueDecimals + 'f}');
          });
          return format(pointFormat, {
            point: this,
            series: this.series
          }, series.chart.time);
        },
        firePointEvent: function(eventType, eventArgs, defaultFunction) {
          var point = this,
              series = this.series,
              seriesOptions = series.options;
          if (seriesOptions.point.events[eventType] || (point.options && point.options.events && point.options.events[eventType])) {
            this.importEvents();
          }
          if (eventType === 'click' && seriesOptions.allowPointSelect) {
            defaultFunction = function(event) {
              if (point.select) {
                point.select(null, event.ctrlKey || event.metaKey || event.shiftKey);
              }
            };
          }
          fireEvent(this, eventType, eventArgs, defaultFunction);
        },
        visible: true
      };
    }(Highcharts));
    (function(H) {
      var addEvent = H.addEvent,
          animObject = H.animObject,
          arrayMax = H.arrayMax,
          arrayMin = H.arrayMin,
          correctFloat = H.correctFloat,
          defaultOptions = H.defaultOptions,
          defaultPlotOptions = H.defaultPlotOptions,
          defined = H.defined,
          each = H.each,
          erase = H.erase,
          extend = H.extend,
          fireEvent = H.fireEvent,
          grep = H.grep,
          isArray = H.isArray,
          isNumber = H.isNumber,
          isString = H.isString,
          LegendSymbolMixin = H.LegendSymbolMixin,
          merge = H.merge,
          objectEach = H.objectEach,
          pick = H.pick,
          Point = H.Point,
          removeEvent = H.removeEvent,
          splat = H.splat,
          SVGElement = H.SVGElement,
          syncTimeout = H.syncTimeout,
          win = H.win;
      H.Series = H.seriesType('line', null, {
        allowPointSelect: false,
        showCheckbox: false,
        animation: {duration: 1000},
        events: {},
        marker: {
          enabledThreshold: 2,
          radius: 4,
          states: {
            normal: {animation: true},
            hover: {
              animation: {duration: 50},
              enabled: true,
              radiusPlus: 2
            }
          }
        },
        point: {events: {}},
        dataLabels: {
          align: 'center',
          formatter: function() {
            return this.y === null ? '' : H.numberFormat(this.y, -1);
          },
          verticalAlign: 'bottom',
          x: 0,
          y: 0,
          padding: 5
        },
        cropThreshold: 300,
        pointRange: 0,
        softThreshold: true,
        states: {
          normal: {animation: true},
          hover: {
            animation: {duration: 50},
            lineWidthPlus: 1,
            marker: {},
            halo: {size: 10}
          },
          select: {marker: {}}
        },
        stickyTracking: true,
        turboThreshold: 1000,
        findNearestPointBy: 'x'
      }, {
        isCartesian: true,
        pointClass: Point,
        sorted: true,
        requireSorting: true,
        directTouch: false,
        axisTypes: ['xAxis', 'yAxis'],
        colorCounter: 0,
        parallelArrays: ['x', 'y'],
        coll: 'series',
        init: function(chart, options) {
          var series = this,
              events,
              chartSeries = chart.series,
              lastSeries;
          series.chart = chart;
          series.options = options = series.setOptions(options);
          series.linkedSeries = [];
          series.bindAxes();
          extend(series, {
            name: options.name,
            state: '',
            visible: options.visible !== false,
            selected: options.selected === true
          });
          events = options.events;
          objectEach(events, function(event, eventType) {
            addEvent(series, eventType, event);
          });
          if ((events && events.click) || (options.point && options.point.events && options.point.events.click) || options.allowPointSelect) {
            chart.runTrackerClick = true;
          }
          series.getColor();
          series.getSymbol();
          each(series.parallelArrays, function(key) {
            series[key + 'Data'] = [];
          });
          series.setData(options.data, false);
          if (series.isCartesian) {
            chart.hasCartesianSeries = true;
          }
          if (chartSeries.length) {
            lastSeries = chartSeries[chartSeries.length - 1];
          }
          series._i = pick(lastSeries && lastSeries._i, -1) + 1;
          chart.orderSeries(this.insert(chartSeries));
        },
        insert: function(collection) {
          var indexOption = this.options.index,
              i;
          if (isNumber(indexOption)) {
            i = collection.length;
            while (i--) {
              if (indexOption >= pick(collection[i].options.index, collection[i]._i)) {
                collection.splice(i + 1, 0, this);
                break;
              }
            }
            if (i === -1) {
              collection.unshift(this);
            }
            i = i + 1;
          } else {
            collection.push(this);
          }
          return pick(i, collection.length - 1);
        },
        bindAxes: function() {
          var series = this,
              seriesOptions = series.options,
              chart = series.chart,
              axisOptions;
          each(series.axisTypes || [], function(AXIS) {
            each(chart[AXIS], function(axis) {
              axisOptions = axis.options;
              if (seriesOptions[AXIS] === axisOptions.index || (seriesOptions[AXIS] !== undefined && seriesOptions[AXIS] === axisOptions.id) || (seriesOptions[AXIS] === undefined && axisOptions.index === 0)) {
                series.insert(axis.series);
                series[AXIS] = axis;
                axis.isDirty = true;
              }
            });
            if (!series[AXIS] && series.optionalAxis !== AXIS) {
              H.error(18, true);
            }
          });
        },
        updateParallelArrays: function(point, i) {
          var series = point.series,
              args = arguments,
              fn = isNumber(i) ? function(key) {
                var val = key === 'y' && series.toYData ? series.toYData(point) : point[key];
                series[key + 'Data'][i] = val;
              } : function(key) {
                Array.prototype[i].apply(series[key + 'Data'], Array.prototype.slice.call(args, 2));
              };
          each(series.parallelArrays, fn);
        },
        autoIncrement: function() {
          var options = this.options,
              xIncrement = this.xIncrement,
              date,
              pointInterval,
              pointIntervalUnit = options.pointIntervalUnit,
              time = this.chart.time;
          xIncrement = pick(xIncrement, options.pointStart, 0);
          this.pointInterval = pointInterval = pick(this.pointInterval, options.pointInterval, 1);
          if (pointIntervalUnit) {
            date = new time.Date(xIncrement);
            if (pointIntervalUnit === 'day') {
              time.set('Date', date, time.get('Date', date) + pointInterval);
            } else if (pointIntervalUnit === 'month') {
              time.set('Month', date, time.get('Month', date) + pointInterval);
            } else if (pointIntervalUnit === 'year') {
              time.set('FullYear', date, time.get('FullYear', date) + pointInterval);
            }
            pointInterval = date.getTime() - xIncrement;
          }
          this.xIncrement = xIncrement + pointInterval;
          return xIncrement;
        },
        setOptions: function(itemOptions) {
          var chart = this.chart,
              chartOptions = chart.options,
              plotOptions = chartOptions.plotOptions,
              userOptions = chart.userOptions || {},
              userPlotOptions = userOptions.plotOptions || {},
              typeOptions = plotOptions[this.type],
              options,
              zones;
          this.userOptions = itemOptions;
          options = merge(typeOptions, plotOptions.series, itemOptions);
          this.tooltipOptions = merge(defaultOptions.tooltip, defaultOptions.plotOptions.series && defaultOptions.plotOptions.series.tooltip, defaultOptions.plotOptions[this.type].tooltip, chartOptions.tooltip.userOptions, plotOptions.series && plotOptions.series.tooltip, plotOptions[this.type].tooltip, itemOptions.tooltip);
          this.stickyTracking = pick(itemOptions.stickyTracking, userPlotOptions[this.type] && userPlotOptions[this.type].stickyTracking, userPlotOptions.series && userPlotOptions.series.stickyTracking, (this.tooltipOptions.shared && !this.noSharedTooltip ? true : options.stickyTracking));
          if (typeOptions.marker === null) {
            delete options.marker;
          }
          this.zoneAxis = options.zoneAxis;
          zones = this.zones = (options.zones || []).slice();
          if ((options.negativeColor || options.negativeFillColor) && !options.zones) {
            zones.push({
              value: options[this.zoneAxis + 'Threshold'] || options.threshold || 0,
              className: 'highcharts-negative'
            });
          }
          if (zones.length) {
            if (defined(zones[zones.length - 1].value)) {
              zones.push({});
            }
          }
          return options;
        },
        getName: function() {
          return this.name || 'Series ' + (this.index + 1);
        },
        getCyclic: function(prop, value, defaults) {
          var i,
              chart = this.chart,
              userOptions = this.userOptions,
              indexName = prop + 'Index',
              counterName = prop + 'Counter',
              len = defaults ? defaults.length : pick(chart.options.chart[prop + 'Count'], chart[prop + 'Count']),
              setting;
          if (!value) {
            setting = pick(userOptions[indexName], userOptions['_' + indexName]);
            if (defined(setting)) {
              i = setting;
            } else {
              if (!chart.series.length) {
                chart[counterName] = 0;
              }
              userOptions['_' + indexName] = i = chart[counterName] % len;
              chart[counterName] += 1;
            }
            if (defaults) {
              value = defaults[i];
            }
          }
          if (i !== undefined) {
            this[indexName] = i;
          }
          this[prop] = value;
        },
        getColor: function() {
          this.getCyclic('color');
        },
        getSymbol: function() {
          var seriesMarkerOption = this.options.marker;
          this.getCyclic('symbol', seriesMarkerOption.symbol, this.chart.options.symbols);
        },
        drawLegendSymbol: LegendSymbolMixin.drawLineMarker,
        setData: function(data, redraw, animation, updatePoints) {
          var series = this,
              oldData = series.points,
              oldDataLength = (oldData && oldData.length) || 0,
              dataLength,
              options = series.options,
              chart = series.chart,
              firstPoint = null,
              xAxis = series.xAxis,
              i,
              turboThreshold = options.turboThreshold,
              pt,
              xData = this.xData,
              yData = this.yData,
              pointArrayMap = series.pointArrayMap,
              valueCount = pointArrayMap && pointArrayMap.length;
          data = data || [];
          dataLength = data.length;
          redraw = pick(redraw, true);
          if (updatePoints !== false && dataLength && oldDataLength === dataLength && !series.cropped && !series.hasGroupedData && series.visible) {
            each(data, function(point, i) {
              if (oldData[i].update && point !== options.data[i]) {
                oldData[i].update(point, false, null, false);
              }
            });
          } else {
            series.xIncrement = null;
            series.colorCounter = 0;
            each(this.parallelArrays, function(key) {
              series[key + 'Data'].length = 0;
            });
            if (turboThreshold && dataLength > turboThreshold) {
              i = 0;
              while (firstPoint === null && i < dataLength) {
                firstPoint = data[i];
                i++;
              }
              if (isNumber(firstPoint)) {
                for (i = 0; i < dataLength; i++) {
                  xData[i] = this.autoIncrement();
                  yData[i] = data[i];
                }
              } else if (isArray(firstPoint)) {
                if (valueCount) {
                  for (i = 0; i < dataLength; i++) {
                    pt = data[i];
                    xData[i] = pt[0];
                    yData[i] = pt.slice(1, valueCount + 1);
                  }
                } else {
                  for (i = 0; i < dataLength; i++) {
                    pt = data[i];
                    xData[i] = pt[0];
                    yData[i] = pt[1];
                  }
                }
              } else {
                H.error(12);
              }
            } else {
              for (i = 0; i < dataLength; i++) {
                if (data[i] !== undefined) {
                  pt = {series: series};
                  series.pointClass.prototype.applyOptions.apply(pt, [data[i]]);
                  series.updateParallelArrays(pt, i);
                }
              }
            }
            if (yData && isString(yData[0])) {
              H.error(14, true);
            }
            series.data = [];
            series.options.data = series.userOptions.data = data;
            i = oldDataLength;
            while (i--) {
              if (oldData[i] && oldData[i].destroy) {
                oldData[i].destroy();
              }
            }
            if (xAxis) {
              xAxis.minRange = xAxis.userMinRange;
            }
            series.isDirty = chart.isDirtyBox = true;
            series.isDirtyData = !!oldData;
            animation = false;
          }
          if (options.legendType === 'point') {
            this.processData();
            this.generatePoints();
          }
          if (redraw) {
            chart.redraw(animation);
          }
        },
        processData: function(force) {
          var series = this,
              processedXData = series.xData,
              processedYData = series.yData,
              dataLength = processedXData.length,
              croppedData,
              cropStart = 0,
              cropped,
              distance,
              closestPointRange,
              xAxis = series.xAxis,
              i,
              options = series.options,
              cropThreshold = options.cropThreshold,
              getExtremesFromAll = series.getExtremesFromAll || options.getExtremesFromAll,
              isCartesian = series.isCartesian,
              xExtremes,
              val2lin = xAxis && xAxis.val2lin,
              isLog = xAxis && xAxis.isLog,
              throwOnUnsorted = series.requireSorting,
              min,
              max;
          if (isCartesian && !series.isDirty && !xAxis.isDirty && !series.yAxis.isDirty && !force) {
            return false;
          }
          if (xAxis) {
            xExtremes = xAxis.getExtremes();
            min = xExtremes.min;
            max = xExtremes.max;
          }
          if (isCartesian && series.sorted && !getExtremesFromAll && (!cropThreshold || dataLength > cropThreshold || series.forceCrop)) {
            if (processedXData[dataLength - 1] < min || processedXData[0] > max) {
              processedXData = [];
              processedYData = [];
            } else if (processedXData[0] < min || processedXData[dataLength - 1] > max) {
              croppedData = this.cropData(series.xData, series.yData, min, max);
              processedXData = croppedData.xData;
              processedYData = croppedData.yData;
              cropStart = croppedData.start;
              cropped = true;
            }
          }
          i = processedXData.length || 1;
          while (--i) {
            distance = isLog ? val2lin(processedXData[i]) - val2lin(processedXData[i - 1]) : processedXData[i] - processedXData[i - 1];
            if (distance > 0 && (closestPointRange === undefined || distance < closestPointRange)) {
              closestPointRange = distance;
            } else if (distance < 0 && throwOnUnsorted) {
              H.error(15);
              throwOnUnsorted = false;
            }
          }
          series.cropped = cropped;
          series.cropStart = cropStart;
          series.processedXData = processedXData;
          series.processedYData = processedYData;
          series.closestPointRange = closestPointRange;
        },
        cropData: function(xData, yData, min, max) {
          var dataLength = xData.length,
              cropStart = 0,
              cropEnd = dataLength,
              cropShoulder = pick(this.cropShoulder, 1),
              i,
              j;
          for (i = 0; i < dataLength; i++) {
            if (xData[i] >= min) {
              cropStart = Math.max(0, i - cropShoulder);
              break;
            }
          }
          for (j = i; j < dataLength; j++) {
            if (xData[j] > max) {
              cropEnd = j + cropShoulder;
              break;
            }
          }
          return {
            xData: xData.slice(cropStart, cropEnd),
            yData: yData.slice(cropStart, cropEnd),
            start: cropStart,
            end: cropEnd
          };
        },
        generatePoints: function() {
          var series = this,
              options = series.options,
              dataOptions = options.data,
              data = series.data,
              dataLength,
              processedXData = series.processedXData,
              processedYData = series.processedYData,
              PointClass = series.pointClass,
              processedDataLength = processedXData.length,
              cropStart = series.cropStart || 0,
              cursor,
              hasGroupedData = series.hasGroupedData,
              keys = options.keys,
              point,
              points = [],
              i;
          if (!data && !hasGroupedData) {
            var arr = [];
            arr.length = dataOptions.length;
            data = series.data = arr;
          }
          if (keys && hasGroupedData) {
            series.options.keys = false;
          }
          for (i = 0; i < processedDataLength; i++) {
            cursor = cropStart + i;
            if (!hasGroupedData) {
              point = data[cursor];
              if (!point && dataOptions[cursor] !== undefined) {
                data[cursor] = point = (new PointClass()).init(series, dataOptions[cursor], processedXData[i]);
              }
            } else {
              point = (new PointClass()).init(series, [processedXData[i]].concat(splat(processedYData[i])));
              point.dataGroup = series.groupMap[i];
            }
            if (point) {
              point.index = cursor;
              points[i] = point;
            }
          }
          series.options.keys = keys;
          if (data && (processedDataLength !== (dataLength = data.length) || hasGroupedData)) {
            for (i = 0; i < dataLength; i++) {
              if (i === cropStart && !hasGroupedData) {
                i += processedDataLength;
              }
              if (data[i]) {
                data[i].destroyElements();
                data[i].plotX = undefined;
              }
            }
          }
          series.data = data;
          series.points = points;
        },
        getExtremes: function(yData) {
          var xAxis = this.xAxis,
              yAxis = this.yAxis,
              xData = this.processedXData,
              yDataLength,
              activeYData = [],
              activeCounter = 0,
              xExtremes = xAxis.getExtremes(),
              xMin = xExtremes.min,
              xMax = xExtremes.max,
              validValue,
              withinRange,
              x,
              y,
              i,
              j;
          yData = yData || this.stackedYData || this.processedYData || [];
          yDataLength = yData.length;
          for (i = 0; i < yDataLength; i++) {
            x = xData[i];
            y = yData[i];
            validValue = (isNumber(y, true) || isArray(y)) && (!yAxis.positiveValuesOnly || (y.length || y > 0));
            withinRange = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || ((xData[i + 1] || x) >= xMin && (xData[i - 1] || x) <= xMax);
            if (validValue && withinRange) {
              j = y.length;
              if (j) {
                while (j--) {
                  if (typeof y[j] === 'number') {
                    activeYData[activeCounter++] = y[j];
                  }
                }
              } else {
                activeYData[activeCounter++] = y;
              }
            }
          }
          this.dataMin = arrayMin(activeYData);
          this.dataMax = arrayMax(activeYData);
        },
        translate: function() {
          if (!this.processedXData) {
            this.processData();
          }
          this.generatePoints();
          var series = this,
              options = series.options,
              stacking = options.stacking,
              xAxis = series.xAxis,
              categories = xAxis.categories,
              yAxis = series.yAxis,
              points = series.points,
              dataLength = points.length,
              hasModifyValue = !!series.modifyValue,
              i,
              pointPlacement = options.pointPlacement,
              dynamicallyPlaced = pointPlacement === 'between' || isNumber(pointPlacement),
              threshold = options.threshold,
              stackThreshold = options.startFromThreshold ? threshold : 0,
              plotX,
              plotY,
              lastPlotX,
              stackIndicator,
              closestPointRangePx = Number.MAX_VALUE;
          function limitedRange(val) {
            return Math.min(Math.max(-1e5, val), 1e5);
          }
          if (pointPlacement === 'between') {
            pointPlacement = 0.5;
          }
          if (isNumber(pointPlacement)) {
            pointPlacement *= pick(options.pointRange || xAxis.pointRange);
          }
          for (i = 0; i < dataLength; i++) {
            var point = points[i],
                xValue = point.x,
                yValue = point.y,
                yBottom = point.low,
                stack = stacking && yAxis.stacks[(series.negStacks && yValue < (stackThreshold ? 0 : threshold) ? '-' : '') + series.stackKey],
                pointStack,
                stackValues;
            if (yAxis.positiveValuesOnly && yValue !== null && yValue <= 0) {
              point.isNull = true;
            }
            point.plotX = plotX = correctFloat(limitedRange(xAxis.translate(xValue, 0, 0, 0, 1, pointPlacement, this.type === 'flags')));
            if (stacking && series.visible && !point.isNull && stack && stack[xValue]) {
              stackIndicator = series.getStackIndicator(stackIndicator, xValue, series.index);
              pointStack = stack[xValue];
              stackValues = pointStack.points[stackIndicator.key];
              yBottom = stackValues[0];
              yValue = stackValues[1];
              if (yBottom === stackThreshold && stackIndicator.key === stack[xValue].base) {
                yBottom = pick(threshold, yAxis.min);
              }
              if (yAxis.positiveValuesOnly && yBottom <= 0) {
                yBottom = null;
              }
              point.total = point.stackTotal = pointStack.total;
              point.percentage = pointStack.total && (point.y / pointStack.total * 100);
              point.stackY = yValue;
              pointStack.setOffset(series.pointXOffset || 0, series.barW || 0);
            }
            point.yBottom = defined(yBottom) ? limitedRange(yAxis.translate(yBottom, 0, 1, 0, 1)) : null;
            if (hasModifyValue) {
              yValue = series.modifyValue(yValue, point);
            }
            point.plotY = plotY = (typeof yValue === 'number' && yValue !== Infinity) ? limitedRange(yAxis.translate(yValue, 0, 1, 0, 1)) : undefined;
            point.isInside = plotY !== undefined && plotY >= 0 && plotY <= yAxis.len && plotX >= 0 && plotX <= xAxis.len;
            point.clientX = dynamicallyPlaced ? correctFloat(xAxis.translate(xValue, 0, 0, 0, 1, pointPlacement)) : plotX;
            point.negative = point.y < (threshold || 0);
            point.category = categories && categories[point.x] !== undefined ? categories[point.x] : point.x;
            if (!point.isNull) {
              if (lastPlotX !== undefined) {
                closestPointRangePx = Math.min(closestPointRangePx, Math.abs(plotX - lastPlotX));
              }
              lastPlotX = plotX;
            }
            point.zone = this.zones.length && point.getZone();
          }
          series.closestPointRangePx = closestPointRangePx;
          fireEvent(this, 'afterTranslate');
        },
        getValidPoints: function(points, insideOnly) {
          var chart = this.chart;
          return grep(points || this.points || [], function isValidPoint(point) {
            if (insideOnly && !chart.isInsidePlot(point.plotX, point.plotY, chart.inverted)) {
              return false;
            }
            return !point.isNull;
          });
        },
        setClip: function(animation) {
          var chart = this.chart,
              options = this.options,
              renderer = chart.renderer,
              inverted = chart.inverted,
              seriesClipBox = this.clipBox,
              clipBox = seriesClipBox || chart.clipBox,
              sharedClipKey = this.sharedClipKey || ['_sharedClip', animation && animation.duration, animation && animation.easing, clipBox.height, options.xAxis, options.yAxis].join(','),
              clipRect = chart[sharedClipKey],
              markerClipRect = chart[sharedClipKey + 'm'];
          if (!clipRect) {
            if (animation) {
              clipBox.width = 0;
              if (inverted) {
                clipBox.x = chart.plotSizeX;
              }
              chart[sharedClipKey + 'm'] = markerClipRect = renderer.clipRect(inverted ? chart.plotSizeX + 99 : -99, inverted ? -chart.plotLeft : -chart.plotTop, 99, inverted ? chart.chartWidth : chart.chartHeight);
            }
            chart[sharedClipKey] = clipRect = renderer.clipRect(clipBox);
            clipRect.count = {length: 0};
          }
          if (animation) {
            if (!clipRect.count[this.index]) {
              clipRect.count[this.index] = true;
              clipRect.count.length += 1;
            }
          }
          if (options.clip !== false) {
            this.group.clip(animation || seriesClipBox ? clipRect : chart.clipRect);
            this.markerGroup.clip(markerClipRect);
            this.sharedClipKey = sharedClipKey;
          }
          if (!animation) {
            if (clipRect.count[this.index]) {
              delete clipRect.count[this.index];
              clipRect.count.length -= 1;
            }
            if (clipRect.count.length === 0 && sharedClipKey && chart[sharedClipKey]) {
              if (!seriesClipBox) {
                chart[sharedClipKey] = chart[sharedClipKey].destroy();
              }
              if (chart[sharedClipKey + 'm']) {
                chart[sharedClipKey + 'm'] = chart[sharedClipKey + 'm'].destroy();
              }
            }
          }
        },
        animate: function(init) {
          var series = this,
              chart = series.chart,
              clipRect,
              animation = animObject(series.options.animation),
              sharedClipKey;
          if (init) {
            series.setClip(animation);
          } else {
            sharedClipKey = this.sharedClipKey;
            clipRect = chart[sharedClipKey];
            if (clipRect) {
              clipRect.animate({
                width: chart.plotSizeX,
                x: 0
              }, animation);
            }
            if (chart[sharedClipKey + 'm']) {
              chart[sharedClipKey + 'm'].animate({
                width: chart.plotSizeX + 99,
                x: 0
              }, animation);
            }
            series.animate = null;
          }
        },
        afterAnimate: function() {
          this.setClip();
          fireEvent(this, 'afterAnimate');
          this.finishedAnimating = true;
        },
        drawPoints: function() {
          var series = this,
              points = series.points,
              chart = series.chart,
              i,
              point,
              symbol,
              graphic,
              options = series.options,
              seriesMarkerOptions = options.marker,
              pointMarkerOptions,
              hasPointMarker,
              enabled,
              isInside,
              markerGroup = series[series.specialGroup] || series.markerGroup,
              xAxis = series.xAxis,
              markerAttribs,
              globallyEnabled = pick(seriesMarkerOptions.enabled, xAxis.isRadial ? true : null, series.closestPointRangePx >= (seriesMarkerOptions.enabledThreshold * seriesMarkerOptions.radius));
          if (seriesMarkerOptions.enabled !== false || series._hasPointMarkers) {
            for (i = 0; i < points.length; i++) {
              point = points[i];
              graphic = point.graphic;
              pointMarkerOptions = point.marker || {};
              hasPointMarker = !!point.marker;
              enabled = (globallyEnabled && pointMarkerOptions.enabled === undefined) || pointMarkerOptions.enabled;
              isInside = point.isInside;
              if (enabled && !point.isNull) {
                symbol = pick(pointMarkerOptions.symbol, series.symbol);
                markerAttribs = series.markerAttribs(point, point.selected && 'select');
                if (graphic) {
                  graphic[isInside ? 'show' : 'hide'](true).animate(markerAttribs);
                } else if (isInside && (markerAttribs.width > 0 || point.hasImage)) {
                  point.graphic = graphic = chart.renderer.symbol(symbol, markerAttribs.x, markerAttribs.y, markerAttribs.width, markerAttribs.height, hasPointMarker ? pointMarkerOptions : seriesMarkerOptions).add(markerGroup);
                }
                if (graphic) {
                  graphic.addClass(point.getClassName(), true);
                }
              } else if (graphic) {
                point.graphic = graphic.destroy();
              }
            }
          }
        },
        markerAttribs: function(point, state) {
          var seriesMarkerOptions = this.options.marker,
              seriesStateOptions,
              pointMarkerOptions = point.marker || {},
              symbol = pointMarkerOptions.symbol || seriesMarkerOptions.symbol,
              pointStateOptions,
              radius = pick(pointMarkerOptions.radius, seriesMarkerOptions.radius),
              attribs;
          if (state) {
            seriesStateOptions = seriesMarkerOptions.states[state];
            pointStateOptions = pointMarkerOptions.states && pointMarkerOptions.states[state];
            radius = pick(pointStateOptions && pointStateOptions.radius, seriesStateOptions && seriesStateOptions.radius, radius + (seriesStateOptions && seriesStateOptions.radiusPlus || 0));
          }
          point.hasImage = symbol && symbol.indexOf('url') === 0;
          if (point.hasImage) {
            radius = 0;
          }
          attribs = {
            x: Math.floor(point.plotX) - radius,
            y: point.plotY - radius
          };
          if (radius) {
            attribs.width = attribs.height = 2 * radius;
          }
          return attribs;
        },
        destroy: function() {
          var series = this,
              chart = series.chart,
              issue134 = /AppleWebKit\/533/.test(win.navigator.userAgent),
              destroy,
              i,
              data = series.data || [],
              point,
              axis;
          fireEvent(series, 'destroy');
          removeEvent(series);
          each(series.axisTypes || [], function(AXIS) {
            axis = series[AXIS];
            if (axis && axis.series) {
              erase(axis.series, series);
              axis.isDirty = axis.forceRedraw = true;
            }
          });
          if (series.legendItem) {
            series.chart.legend.destroyItem(series);
          }
          i = data.length;
          while (i--) {
            point = data[i];
            if (point && point.destroy) {
              point.destroy();
            }
          }
          series.points = null;
          clearTimeout(series.animationTimeout);
          objectEach(series, function(val, prop) {
            if (val instanceof SVGElement && !val.survive) {
              destroy = issue134 && prop === 'group' ? 'hide' : 'destroy';
              val[destroy]();
            }
          });
          if (chart.hoverSeries === series) {
            chart.hoverSeries = null;
          }
          erase(chart.series, series);
          chart.orderSeries();
          objectEach(series, function(val, prop) {
            delete series[prop];
          });
        },
        getGraphPath: function(points, nullsAsZeroes, connectCliffs) {
          var series = this,
              options = series.options,
              step = options.step,
              reversed,
              graphPath = [],
              xMap = [],
              gap;
          points = points || series.points;
          reversed = points.reversed;
          if (reversed) {
            points.reverse();
          }
          step = {
            right: 1,
            center: 2
          }[step] || (step && 3);
          if (step && reversed) {
            step = 4 - step;
          }
          if (options.connectNulls && !nullsAsZeroes && !connectCliffs) {
            points = this.getValidPoints(points);
          }
          each(points, function(point, i) {
            var plotX = point.plotX,
                plotY = point.plotY,
                lastPoint = points[i - 1],
                pathToPoint;
            if ((point.leftCliff || (lastPoint && lastPoint.rightCliff)) && !connectCliffs) {
              gap = true;
            }
            if (point.isNull && !defined(nullsAsZeroes) && i > 0) {
              gap = !options.connectNulls;
            } else if (point.isNull && !nullsAsZeroes) {
              gap = true;
            } else {
              if (i === 0 || gap) {
                pathToPoint = ['M', point.plotX, point.plotY];
              } else if (series.getPointSpline) {
                pathToPoint = series.getPointSpline(points, point, i);
              } else if (step) {
                if (step === 1) {
                  pathToPoint = ['L', lastPoint.plotX, plotY];
                } else if (step === 2) {
                  pathToPoint = ['L', (lastPoint.plotX + plotX) / 2, lastPoint.plotY, 'L', (lastPoint.plotX + plotX) / 2, plotY];
                } else {
                  pathToPoint = ['L', plotX, lastPoint.plotY];
                }
                pathToPoint.push('L', plotX, plotY);
              } else {
                pathToPoint = ['L', plotX, plotY];
              }
              xMap.push(point.x);
              if (step) {
                xMap.push(point.x);
              }
              graphPath.push.apply(graphPath, pathToPoint);
              gap = false;
            }
          });
          graphPath.xMap = xMap;
          series.graphPath = graphPath;
          return graphPath;
        },
        drawGraph: function() {
          var series = this,
              options = this.options,
              graphPath = (this.gappedPath || this.getGraphPath).call(this),
              props = [['graph', 'highcharts-graph']];
          each(this.zones, function(zone, i) {
            props.push(['zone-graph-' + i, 'highcharts-graph highcharts-zone-graph-' + i + ' ' + (zone.className || '')]);
          });
          each(props, function(prop, i) {
            var graphKey = prop[0],
                graph = series[graphKey],
                attribs;
            if (graph) {
              graph.endX = series.preventGraphAnimation ? null : graphPath.xMap;
              graph.animate({d: graphPath});
            } else if (graphPath.length) {
              series[graphKey] = series.chart.renderer.path(graphPath).addClass(prop[1]).attr({zIndex: 1}).add(series.group);
            }
            if (graph) {
              graph.startX = graphPath.xMap;
              graph.isArea = graphPath.isArea;
            }
          });
        },
        applyZones: function() {
          var series = this,
              chart = this.chart,
              renderer = chart.renderer,
              zones = this.zones,
              translatedFrom,
              translatedTo,
              clips = this.clips || [],
              clipAttr,
              graph = this.graph,
              area = this.area,
              chartSizeMax = Math.max(chart.chartWidth, chart.chartHeight),
              axis = this[(this.zoneAxis || 'y') + 'Axis'],
              extremes,
              reversed,
              inverted = chart.inverted,
              horiz,
              pxRange,
              pxPosMin,
              pxPosMax,
              ignoreZones = false;
          if (zones.length && (graph || area) && axis && axis.min !== undefined) {
            reversed = axis.reversed;
            horiz = axis.horiz;
            if (graph) {
              graph.hide();
            }
            if (area) {
              area.hide();
            }
            extremes = axis.getExtremes();
            each(zones, function(threshold, i) {
              translatedFrom = reversed ? (horiz ? chart.plotWidth : 0) : (horiz ? 0 : axis.toPixels(extremes.min));
              translatedFrom = Math.min(Math.max(pick(translatedTo, translatedFrom), 0), chartSizeMax);
              translatedTo = Math.min(Math.max(Math.round(axis.toPixels(pick(threshold.value, extremes.max), true)), 0), chartSizeMax);
              if (ignoreZones) {
                translatedFrom = translatedTo = axis.toPixels(extremes.max);
              }
              pxRange = Math.abs(translatedFrom - translatedTo);
              pxPosMin = Math.min(translatedFrom, translatedTo);
              pxPosMax = Math.max(translatedFrom, translatedTo);
              if (axis.isXAxis) {
                clipAttr = {
                  x: inverted ? pxPosMax : pxPosMin,
                  y: 0,
                  width: pxRange,
                  height: chartSizeMax
                };
                if (!horiz) {
                  clipAttr.x = chart.plotHeight - clipAttr.x;
                }
              } else {
                clipAttr = {
                  x: 0,
                  y: inverted ? pxPosMax : pxPosMin,
                  width: chartSizeMax,
                  height: pxRange
                };
                if (horiz) {
                  clipAttr.y = chart.plotWidth - clipAttr.y;
                }
              }
              if (clips[i]) {
                clips[i].animate(clipAttr);
              } else {
                clips[i] = renderer.clipRect(clipAttr);
                if (graph) {
                  series['zone-graph-' + i].clip(clips[i]);
                }
                if (area) {
                  series['zone-area-' + i].clip(clips[i]);
                }
              }
              ignoreZones = threshold.value > extremes.max;
            });
            this.clips = clips;
          }
        },
        invertGroups: function(inverted) {
          var series = this,
              chart = series.chart,
              remover;
          function setInvert() {
            each(['group', 'markerGroup'], function(groupName) {
              if (series[groupName]) {
                if (chart.renderer.isVML) {
                  series[groupName].attr({
                    width: series.yAxis.len,
                    height: series.xAxis.len
                  });
                }
                series[groupName].width = series.yAxis.len;
                series[groupName].height = series.xAxis.len;
                series[groupName].invert(inverted);
              }
            });
          }
          if (!series.xAxis) {
            return;
          }
          remover = addEvent(chart, 'resize', setInvert);
          addEvent(series, 'destroy', remover);
          setInvert(inverted);
          series.invertGroups = setInvert;
        },
        plotGroup: function(prop, name, visibility, zIndex, parent) {
          var group = this[prop],
              isNew = !group;
          if (isNew) {
            this[prop] = group = this.chart.renderer.g().attr({zIndex: zIndex || 0.1}).add(parent);
          }
          group.addClass(('highcharts-' + name + ' highcharts-series-' + this.index + ' highcharts-' + this.type + '-series ' + (defined(this.colorIndex) ? 'highcharts-color-' + this.colorIndex + ' ' : '') + (this.options.className || '') + (group.hasClass('highcharts-tracker') ? ' highcharts-tracker' : '')), true);
          group.attr({visibility: visibility})[isNew ? 'attr' : 'animate'](this.getPlotBox());
          return group;
        },
        getPlotBox: function() {
          var chart = this.chart,
              xAxis = this.xAxis,
              yAxis = this.yAxis;
          if (chart.inverted) {
            xAxis = yAxis;
            yAxis = this.xAxis;
          }
          return {
            translateX: xAxis ? xAxis.left : chart.plotLeft,
            translateY: yAxis ? yAxis.top : chart.plotTop,
            scaleX: 1,
            scaleY: 1
          };
        },
        render: function() {
          var series = this,
              chart = series.chart,
              group,
              options = series.options,
              animDuration = (!!series.animate && chart.renderer.isSVG && animObject(options.animation).duration),
              visibility = series.visible ? 'inherit' : 'hidden',
              zIndex = options.zIndex,
              hasRendered = series.hasRendered,
              chartSeriesGroup = chart.seriesGroup,
              inverted = chart.inverted;
          group = series.plotGroup('group', 'series', visibility, zIndex, chartSeriesGroup);
          series.markerGroup = series.plotGroup('markerGroup', 'markers', visibility, zIndex, chartSeriesGroup);
          if (animDuration) {
            series.animate(true);
          }
          group.inverted = series.isCartesian ? inverted : false;
          if (series.drawGraph) {
            series.drawGraph();
            series.applyZones();
          }
          if (series.drawDataLabels) {
            series.drawDataLabels();
          }
          if (series.visible) {
            series.drawPoints();
          }
          if (series.drawTracker && series.options.enableMouseTracking !== false) {
            series.drawTracker();
          }
          series.invertGroups(inverted);
          if (options.clip !== false && !series.sharedClipKey && !hasRendered) {
            group.clip(chart.clipRect);
          }
          if (animDuration) {
            series.animate();
          }
          if (!hasRendered) {
            series.animationTimeout = syncTimeout(function() {
              series.afterAnimate();
            }, animDuration);
          }
          series.isDirty = false;
          series.hasRendered = true;
          fireEvent(series, 'afterRender');
        },
        redraw: function() {
          var series = this,
              chart = series.chart,
              wasDirty = series.isDirty || series.isDirtyData,
              group = series.group,
              xAxis = series.xAxis,
              yAxis = series.yAxis;
          if (group) {
            if (chart.inverted) {
              group.attr({
                width: chart.plotWidth,
                height: chart.plotHeight
              });
            }
            group.animate({
              translateX: pick(xAxis && xAxis.left, chart.plotLeft),
              translateY: pick(yAxis && yAxis.top, chart.plotTop)
            });
          }
          series.translate();
          series.render();
          if (wasDirty) {
            delete this.kdTree;
          }
        },
        kdAxisArray: ['clientX', 'plotY'],
        searchPoint: function(e, compareX) {
          var series = this,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              inverted = series.chart.inverted;
          return this.searchKDTree({
            clientX: inverted ? xAxis.len - e.chartY + xAxis.pos : e.chartX - xAxis.pos,
            plotY: inverted ? yAxis.len - e.chartX + yAxis.pos : e.chartY - yAxis.pos
          }, compareX);
        },
        buildKDTree: function() {
          this.buildingKdTree = true;
          var series = this,
              dimensions = series.options.findNearestPointBy.indexOf('y') > -1 ? 2 : 1;
          function _kdtree(points, depth, dimensions) {
            var axis,
                median,
                length = points && points.length;
            if (length) {
              axis = series.kdAxisArray[depth % dimensions];
              points.sort(function(a, b) {
                return a[axis] - b[axis];
              });
              median = Math.floor(length / 2);
              return {
                point: points[median],
                left: _kdtree(points.slice(0, median), depth + 1, dimensions),
                right: _kdtree(points.slice(median + 1), depth + 1, dimensions)
              };
            }
          }
          function startRecursive() {
            series.kdTree = _kdtree(series.getValidPoints(null, !series.directTouch), dimensions, dimensions);
            series.buildingKdTree = false;
          }
          delete series.kdTree;
          syncTimeout(startRecursive, series.options.kdNow ? 0 : 1);
        },
        searchKDTree: function(point, compareX) {
          var series = this,
              kdX = this.kdAxisArray[0],
              kdY = this.kdAxisArray[1],
              kdComparer = compareX ? 'distX' : 'dist',
              kdDimensions = series.options.findNearestPointBy.indexOf('y') > -1 ? 2 : 1;
          function setDistance(p1, p2) {
            var x = (defined(p1[kdX]) && defined(p2[kdX])) ? Math.pow(p1[kdX] - p2[kdX], 2) : null,
                y = (defined(p1[kdY]) && defined(p2[kdY])) ? Math.pow(p1[kdY] - p2[kdY], 2) : null,
                r = (x || 0) + (y || 0);
            p2.dist = defined(r) ? Math.sqrt(r) : Number.MAX_VALUE;
            p2.distX = defined(x) ? Math.sqrt(x) : Number.MAX_VALUE;
          }
          function _search(search, tree, depth, dimensions) {
            var point = tree.point,
                axis = series.kdAxisArray[depth % dimensions],
                tdist,
                sideA,
                sideB,
                ret = point,
                nPoint1,
                nPoint2;
            setDistance(search, point);
            tdist = search[axis] - point[axis];
            sideA = tdist < 0 ? 'left' : 'right';
            sideB = tdist < 0 ? 'right' : 'left';
            if (tree[sideA]) {
              nPoint1 = _search(search, tree[sideA], depth + 1, dimensions);
              ret = (nPoint1[kdComparer] < ret[kdComparer] ? nPoint1 : point);
            }
            if (tree[sideB]) {
              if (Math.sqrt(tdist * tdist) < ret[kdComparer]) {
                nPoint2 = _search(search, tree[sideB], depth + 1, dimensions);
                ret = nPoint2[kdComparer] < ret[kdComparer] ? nPoint2 : ret;
              }
            }
            return ret;
          }
          if (!this.kdTree && !this.buildingKdTree) {
            this.buildKDTree();
          }
          if (this.kdTree) {
            return _search(point, this.kdTree, kdDimensions, kdDimensions);
          }
        }
      });
    }(Highcharts));
    (function(H) {
      var addEvent = H.addEvent,
          animate = H.animate,
          Axis = H.Axis,
          Chart = H.Chart,
          createElement = H.createElement,
          css = H.css,
          defined = H.defined,
          each = H.each,
          erase = H.erase,
          extend = H.extend,
          fireEvent = H.fireEvent,
          inArray = H.inArray,
          isNumber = H.isNumber,
          isObject = H.isObject,
          isArray = H.isArray,
          merge = H.merge,
          objectEach = H.objectEach,
          pick = H.pick,
          Point = H.Point,
          Series = H.Series,
          seriesTypes = H.seriesTypes,
          setAnimation = H.setAnimation,
          splat = H.splat;
      extend(Chart.prototype, {
        addSeries: function(options, redraw, animation) {
          var series,
              chart = this;
          if (options) {
            redraw = pick(redraw, true);
            fireEvent(chart, 'addSeries', {options: options}, function() {
              series = chart.initSeries(options);
              chart.isDirtyLegend = true;
              chart.linkSeries();
              if (redraw) {
                chart.redraw(animation);
              }
            });
          }
          return series;
        },
        addAxis: function(options, isX, redraw, animation) {
          var key = isX ? 'xAxis' : 'yAxis',
              chartOptions = this.options,
              userOptions = merge(options, {
                index: this[key].length,
                isX: isX
              }),
              axis;
          axis = new Axis(this, userOptions);
          chartOptions[key] = splat(chartOptions[key] || {});
          chartOptions[key].push(userOptions);
          if (pick(redraw, true)) {
            this.redraw(animation);
          }
          return axis;
        },
        showLoading: function(str) {
          var chart = this,
              options = chart.options,
              loadingDiv = chart.loadingDiv,
              loadingOptions = options.loading,
              setLoadingSize = function() {
                if (loadingDiv) {
                  css(loadingDiv, {
                    left: chart.plotLeft + 'px',
                    top: chart.plotTop + 'px',
                    width: chart.plotWidth + 'px',
                    height: chart.plotHeight + 'px'
                  });
                }
              };
          if (!loadingDiv) {
            chart.loadingDiv = loadingDiv = createElement('div', {className: 'highcharts-loading highcharts-loading-hidden'}, null, chart.container);
            chart.loadingSpan = createElement('span', {className: 'highcharts-loading-inner'}, null, loadingDiv);
            addEvent(chart, 'redraw', setLoadingSize);
          }
          loadingDiv.className = 'highcharts-loading';
          chart.loadingSpan.innerHTML = str || options.lang.loading;
          chart.loadingShown = true;
          setLoadingSize();
        },
        hideLoading: function() {
          var options = this.options,
              loadingDiv = this.loadingDiv;
          if (loadingDiv) {
            loadingDiv.className = 'highcharts-loading highcharts-loading-hidden';
          }
          this.loadingShown = false;
        },
        propsRequireDirtyBox: ['backgroundColor', 'borderColor', 'borderWidth', 'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'spacing', 'spacingTop', 'spacingRight', 'spacingBottom', 'spacingLeft', 'borderRadius', 'plotBackgroundColor', 'plotBackgroundImage', 'plotBorderColor', 'plotBorderWidth', 'plotShadow', 'shadow'],
        propsRequireUpdateSeries: ['chart.inverted', 'chart.polar', 'chart.ignoreHiddenSeries', 'chart.type', 'colors', 'plotOptions', 'time', 'tooltip'],
        update: function(options, redraw, oneToOne) {
          var chart = this,
              adders = {
                credits: 'addCredits',
                title: 'setTitle',
                subtitle: 'setSubtitle'
              },
              optionsChart = options.chart,
              updateAllAxes,
              updateAllSeries,
              newWidth,
              newHeight,
              itemsForRemoval = [];
          if (optionsChart) {
            merge(true, chart.options.chart, optionsChart);
            if ('className' in optionsChart) {
              chart.setClassName(optionsChart.className);
            }
            if ('inverted' in optionsChart || 'polar' in optionsChart) {
              chart.propFromSeries();
              updateAllAxes = true;
            }
            if ('alignTicks' in optionsChart) {
              updateAllAxes = true;
            }
            objectEach(optionsChart, function(val, key) {
              if (inArray('chart.' + key, chart.propsRequireUpdateSeries) !== -1) {
                updateAllSeries = true;
              }
              if (inArray(key, chart.propsRequireDirtyBox) !== -1) {
                chart.isDirtyBox = true;
              }
            });
          }
          if (options.plotOptions) {
            merge(true, this.options.plotOptions, options.plotOptions);
          }
          objectEach(options, function(val, key) {
            if (chart[key] && typeof chart[key].update === 'function') {
              chart[key].update(val, false);
            } else if (typeof chart[adders[key]] === 'function') {
              chart[adders[key]](val);
            }
            if (key !== 'chart' && inArray(key, chart.propsRequireUpdateSeries) !== -1) {
              updateAllSeries = true;
            }
          });
          each(['xAxis', 'yAxis', 'zAxis', 'series', 'colorAxis', 'pane'], function(coll) {
            if (options[coll]) {
              each(splat(options[coll]), function(newOptions, i) {
                var item = (defined(newOptions.id) && chart.get(newOptions.id)) || chart[coll][i];
                if (item && item.coll === coll) {
                  item.update(newOptions, false);
                  if (oneToOne) {
                    item.touched = true;
                  }
                }
                if (!item && oneToOne) {
                  if (coll === 'series') {
                    chart.addSeries(newOptions, false).touched = true;
                  } else if (coll === 'xAxis' || coll === 'yAxis') {
                    chart.addAxis(newOptions, coll === 'xAxis', false).touched = true;
                  }
                }
              });
              if (oneToOne) {
                each(chart[coll], function(item) {
                  if (!item.touched) {
                    itemsForRemoval.push(item);
                  } else {
                    delete item.touched;
                  }
                });
              }
            }
          });
          each(itemsForRemoval, function(item) {
            item.remove(false);
          });
          if (updateAllAxes) {
            each(chart.axes, function(axis) {
              axis.update({}, false);
            });
          }
          if (updateAllSeries) {
            each(chart.series, function(series) {
              series.update({}, false);
            });
          }
          if (options.loading) {
            merge(true, chart.options.loading, options.loading);
          }
          newWidth = optionsChart && optionsChart.width;
          newHeight = optionsChart && optionsChart.height;
          if ((isNumber(newWidth) && newWidth !== chart.chartWidth) || (isNumber(newHeight) && newHeight !== chart.chartHeight)) {
            chart.setSize(newWidth, newHeight);
          } else if (pick(redraw, true)) {
            chart.redraw();
          }
        },
        setSubtitle: function(options) {
          this.setTitle(undefined, options);
        }
      });
      extend(Point.prototype, {
        update: function(options, redraw, animation, runEvent) {
          var point = this,
              series = point.series,
              graphic = point.graphic,
              i,
              chart = series.chart,
              seriesOptions = series.options;
          redraw = pick(redraw, true);
          function update() {
            point.applyOptions(options);
            if (point.y === null && graphic) {
              point.graphic = graphic.destroy();
            }
            if (isObject(options, true)) {
              if (graphic && graphic.element) {
                if (options && options.marker && options.marker.symbol !== undefined) {
                  point.graphic = graphic.destroy();
                }
              }
              if (options && options.dataLabels && point.dataLabel) {
                point.dataLabel = point.dataLabel.destroy();
              }
              if (point.connector) {
                point.connector = point.connector.destroy();
              }
            }
            i = point.index;
            series.updateParallelArrays(point, i);
            seriesOptions.data[i] = (isObject(seriesOptions.data[i], true) || isObject(options, true)) ? point.options : options;
            series.isDirty = series.isDirtyData = true;
            if (!series.fixedBox && series.hasCartesianSeries) {
              chart.isDirtyBox = true;
            }
            if (seriesOptions.legendType === 'point') {
              chart.isDirtyLegend = true;
            }
            if (redraw) {
              chart.redraw(animation);
            }
          }
          if (runEvent === false) {
            update();
          } else {
            point.firePointEvent('update', {options: options}, update);
          }
        },
        remove: function(redraw, animation) {
          this.series.removePoint(inArray(this, this.series.data), redraw, animation);
        }
      });
      extend(Series.prototype, {
        addPoint: function(options, redraw, shift, animation) {
          var series = this,
              seriesOptions = series.options,
              data = series.data,
              chart = series.chart,
              xAxis = series.xAxis,
              names = xAxis && xAxis.hasNames && xAxis.names,
              dataOptions = seriesOptions.data,
              point,
              isInTheMiddle,
              xData = series.xData,
              i,
              x;
          redraw = pick(redraw, true);
          point = {series: series};
          series.pointClass.prototype.applyOptions.apply(point, [options]);
          x = point.x;
          i = xData.length;
          if (series.requireSorting && x < xData[i - 1]) {
            isInTheMiddle = true;
            while (i && xData[i - 1] > x) {
              i--;
            }
          }
          series.updateParallelArrays(point, 'splice', i, 0, 0);
          series.updateParallelArrays(point, i);
          if (names && point.name) {
            names[x] = point.name;
          }
          dataOptions.splice(i, 0, options);
          if (isInTheMiddle) {
            series.data.splice(i, 0, null);
            series.processData();
          }
          if (seriesOptions.legendType === 'point') {
            series.generatePoints();
          }
          if (shift) {
            if (data[0] && data[0].remove) {
              data[0].remove(false);
            } else {
              data.shift();
              series.updateParallelArrays(point, 'shift');
              dataOptions.shift();
            }
          }
          series.isDirty = true;
          series.isDirtyData = true;
          if (redraw) {
            chart.redraw(animation);
          }
        },
        removePoint: function(i, redraw, animation) {
          var series = this,
              data = series.data,
              point = data[i],
              points = series.points,
              chart = series.chart,
              remove = function() {
                if (points && points.length === data.length) {
                  points.splice(i, 1);
                }
                data.splice(i, 1);
                series.options.data.splice(i, 1);
                series.updateParallelArrays(point || {series: series}, 'splice', i, 1);
                if (point) {
                  point.destroy();
                }
                series.isDirty = true;
                series.isDirtyData = true;
                if (redraw) {
                  chart.redraw();
                }
              };
          setAnimation(animation, chart);
          redraw = pick(redraw, true);
          if (point) {
            point.firePointEvent('remove', null, remove);
          } else {
            remove();
          }
        },
        remove: function(redraw, animation, withEvent) {
          var series = this,
              chart = series.chart;
          function remove() {
            series.destroy();
            chart.isDirtyLegend = chart.isDirtyBox = true;
            chart.linkSeries();
            if (pick(redraw, true)) {
              chart.redraw(animation);
            }
          }
          if (withEvent !== false) {
            fireEvent(series, 'remove', null, remove);
          } else {
            remove();
          }
        },
        update: function(newOptions, redraw) {
          var series = this,
              chart = series.chart,
              oldOptions = series.userOptions,
              oldType = series.oldType || series.type,
              newType = newOptions.type || oldOptions.type || chart.options.chart.type,
              proto = seriesTypes[oldType].prototype,
              n,
              groups = ['group', 'markerGroup', 'dataLabelsGroup'],
              preserve = ['navigatorSeries', 'baseSeries'],
              animation = series.finishedAnimating && {animation: false};
          if (Object.keys && Object.keys(newOptions).toString() === 'data') {
            return this.setData(newOptions.data, redraw);
          }
          preserve = groups.concat(preserve);
          each(preserve, function(prop) {
            preserve[prop] = series[prop];
            delete series[prop];
          });
          newOptions = merge(oldOptions, animation, {
            index: series.index,
            pointStart: series.xData[0]
          }, {data: series.options.data}, newOptions);
          series.remove(false, null, false);
          for (n in proto) {
            series[n] = undefined;
          }
          extend(series, seriesTypes[newType || oldType].prototype);
          each(preserve, function(prop) {
            series[prop] = preserve[prop];
          });
          series.init(chart, newOptions);
          if (newOptions.zIndex !== oldOptions.zIndex) {
            each(groups, function(groupName) {
              if (series[groupName]) {
                series[groupName].attr({zIndex: newOptions.zIndex});
              }
            });
          }
          series.oldType = oldType;
          chart.linkSeries();
          if (pick(redraw, true)) {
            chart.redraw(false);
          }
        }
      });
      extend(Axis.prototype, {
        update: function(options, redraw) {
          var chart = this.chart;
          options = chart.options[this.coll][this.options.index] = merge(this.userOptions, options);
          this.destroy(true);
          this.init(chart, extend(options, {events: undefined}));
          chart.isDirtyBox = true;
          if (pick(redraw, true)) {
            chart.redraw();
          }
        },
        remove: function(redraw) {
          var chart = this.chart,
              key = this.coll,
              axisSeries = this.series,
              i = axisSeries.length;
          while (i--) {
            if (axisSeries[i]) {
              axisSeries[i].remove(false);
            }
          }
          erase(chart.axes, this);
          erase(chart[key], this);
          if (isArray(chart.options[key])) {
            chart.options[key].splice(this.options.index, 1);
          } else {
            delete chart.options[key];
          }
          each(chart[key], function(axis, i) {
            axis.options.index = i;
          });
          this.destroy();
          chart.isDirtyBox = true;
          if (pick(redraw, true)) {
            chart.redraw();
          }
        },
        setTitle: function(titleOptions, redraw) {
          this.update({title: titleOptions}, redraw);
        },
        setCategories: function(categories, redraw) {
          this.update({categories: categories}, redraw);
        }
      });
    }(Highcharts));
    (function(H) {
      var animObject = H.animObject,
          color = H.color,
          each = H.each,
          extend = H.extend,
          isNumber = H.isNumber,
          LegendSymbolMixin = H.LegendSymbolMixin,
          merge = H.merge,
          noop = H.noop,
          pick = H.pick,
          Series = H.Series,
          seriesType = H.seriesType,
          svg = H.svg;
      seriesType('column', 'line', {
        borderRadius: 0,
        crisp: true,
        groupPadding: 0.2,
        marker: null,
        pointPadding: 0.1,
        minPointLength: 0,
        cropThreshold: 50,
        pointRange: null,
        states: {hover: {halo: false}},
        dataLabels: {
          align: null,
          verticalAlign: null,
          y: null
        },
        softThreshold: false,
        startFromThreshold: true,
        stickyTracking: false,
        tooltip: {distance: 6},
        threshold: 0
      }, {
        cropShoulder: 0,
        directTouch: true,
        trackerGroups: ['group', 'dataLabelsGroup'],
        negStacks: true,
        init: function() {
          Series.prototype.init.apply(this, arguments);
          var series = this,
              chart = series.chart;
          if (chart.hasRendered) {
            each(chart.series, function(otherSeries) {
              if (otherSeries.type === series.type) {
                otherSeries.isDirty = true;
              }
            });
          }
        },
        getColumnMetrics: function() {
          var series = this,
              options = series.options,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              reversedXAxis = xAxis.reversed,
              stackKey,
              stackGroups = {},
              columnCount = 0;
          if (options.grouping === false) {
            columnCount = 1;
          } else {
            each(series.chart.series, function(otherSeries) {
              var otherOptions = otherSeries.options,
                  otherYAxis = otherSeries.yAxis,
                  columnIndex;
              if (otherSeries.type === series.type && (otherSeries.visible || !series.chart.options.chart.ignoreHiddenSeries) && yAxis.len === otherYAxis.len && yAxis.pos === otherYAxis.pos) {
                if (otherOptions.stacking) {
                  stackKey = otherSeries.stackKey;
                  if (stackGroups[stackKey] === undefined) {
                    stackGroups[stackKey] = columnCount++;
                  }
                  columnIndex = stackGroups[stackKey];
                } else if (otherOptions.grouping !== false) {
                  columnIndex = columnCount++;
                }
                otherSeries.columnIndex = columnIndex;
              }
            });
          }
          var categoryWidth = Math.min(Math.abs(xAxis.transA) * (xAxis.ordinalSlope || options.pointRange || xAxis.closestPointRange || xAxis.tickInterval || 1), xAxis.len),
              groupPadding = categoryWidth * options.groupPadding,
              groupWidth = categoryWidth - 2 * groupPadding,
              pointOffsetWidth = groupWidth / (columnCount || 1),
              pointWidth = Math.min(options.maxPointWidth || xAxis.len, pick(options.pointWidth, pointOffsetWidth * (1 - 2 * options.pointPadding))),
              pointPadding = (pointOffsetWidth - pointWidth) / 2,
              colIndex = (series.columnIndex || 0) + (reversedXAxis ? 1 : 0),
              pointXOffset = pointPadding + (groupPadding + colIndex * pointOffsetWidth - (categoryWidth / 2)) * (reversedXAxis ? -1 : 1);
          series.columnMetrics = {
            width: pointWidth,
            offset: pointXOffset
          };
          return series.columnMetrics;
        },
        crispCol: function(x, y, w, h) {
          var chart = this.chart,
              borderWidth = this.borderWidth,
              xCrisp = -(borderWidth % 2 ? 0.5 : 0),
              yCrisp = borderWidth % 2 ? 0.5 : 1,
              right,
              bottom,
              fromTop;
          if (chart.inverted && chart.renderer.isVML) {
            yCrisp += 1;
          }
          if (this.options.crisp) {
            right = Math.round(x + w) + xCrisp;
            x = Math.round(x) + xCrisp;
            w = right - x;
          }
          bottom = Math.round(y + h) + yCrisp;
          fromTop = Math.abs(y) <= 0.5 && bottom > 0.5;
          y = Math.round(y) + yCrisp;
          h = bottom - y;
          if (fromTop && h) {
            y -= 1;
            h += 1;
          }
          return {
            x: x,
            y: y,
            width: w,
            height: h
          };
        },
        translate: function() {
          var series = this,
              chart = series.chart,
              options = series.options,
              dense = series.dense = series.closestPointRange * series.xAxis.transA < 2,
              borderWidth = series.borderWidth = pick(options.borderWidth, dense ? 0 : 1),
              yAxis = series.yAxis,
              threshold = options.threshold,
              translatedThreshold = series.translatedThreshold = yAxis.getThreshold(threshold),
              minPointLength = pick(options.minPointLength, 5),
              metrics = series.getColumnMetrics(),
              pointWidth = metrics.width,
              seriesBarW = series.barW = Math.max(pointWidth, 1 + 2 * borderWidth),
              pointXOffset = series.pointXOffset = metrics.offset;
          if (chart.inverted) {
            translatedThreshold -= 0.5;
          }
          if (options.pointPadding) {
            seriesBarW = Math.ceil(seriesBarW);
          }
          Series.prototype.translate.apply(series);
          each(series.points, function(point) {
            var yBottom = pick(point.yBottom, translatedThreshold),
                safeDistance = 999 + Math.abs(yBottom),
                plotY = Math.min(Math.max(-safeDistance, point.plotY), yAxis.len + safeDistance),
                barX = point.plotX + pointXOffset,
                barW = seriesBarW,
                barY = Math.min(plotY, yBottom),
                up,
                barH = Math.max(plotY, yBottom) - barY;
            if (minPointLength && Math.abs(barH) < minPointLength) {
              barH = minPointLength;
              up = (!yAxis.reversed && !point.negative) || (yAxis.reversed && point.negative);
              if (point.y === threshold && series.dataMax <= threshold && yAxis.min < threshold) {
                up = !up;
              }
              barY = Math.abs(barY - translatedThreshold) > minPointLength ? yBottom - minPointLength : translatedThreshold - (up ? minPointLength : 0);
            }
            point.barX = barX;
            point.pointWidth = pointWidth;
            point.tooltipPos = chart.inverted ? [yAxis.len + yAxis.pos - chart.plotLeft - plotY, series.xAxis.len - barX - barW / 2, barH] : [barX + barW / 2, plotY + yAxis.pos - chart.plotTop, barH];
            point.shapeType = 'rect';
            point.shapeArgs = series.crispCol.apply(series, point.isNull ? [barX, translatedThreshold, barW, 0] : [barX, barY, barW, barH]);
          });
        },
        getSymbol: noop,
        drawLegendSymbol: LegendSymbolMixin.drawRectangle,
        drawGraph: function() {
          this.group[this.dense ? 'addClass' : 'removeClass']('highcharts-dense-data');
        },
        drawPoints: function() {
          var series = this,
              chart = this.chart,
              options = series.options,
              renderer = chart.renderer,
              animationLimit = options.animationLimit || 250,
              shapeArgs;
          each(series.points, function(point) {
            var plotY = point.plotY,
                graphic = point.graphic;
            if (isNumber(plotY) && point.y !== null) {
              shapeArgs = point.shapeArgs;
              if (graphic) {
                graphic[chart.pointCount < animationLimit ? 'animate' : 'attr'](merge(shapeArgs));
              } else {
                point.graphic = graphic = renderer[point.shapeType](shapeArgs).add(point.group || series.group);
              }
              if (options.borderRadius) {
                graphic.attr({r: options.borderRadius});
              }
              graphic.addClass(point.getClassName(), true);
            } else if (graphic) {
              point.graphic = graphic.destroy();
            }
          });
        },
        animate: function(init) {
          var series = this,
              yAxis = this.yAxis,
              options = series.options,
              inverted = this.chart.inverted,
              attr = {},
              translateProp = inverted ? 'translateX' : 'translateY',
              translateStart,
              translatedThreshold;
          if (svg) {
            if (init) {
              attr.scaleY = 0.001;
              translatedThreshold = Math.min(yAxis.pos + yAxis.len, Math.max(yAxis.pos, yAxis.toPixels(options.threshold)));
              if (inverted) {
                attr.translateX = translatedThreshold - yAxis.len;
              } else {
                attr.translateY = translatedThreshold;
              }
              series.group.attr(attr);
            } else {
              translateStart = series.group.attr(translateProp);
              series.group.animate({scaleY: 1}, extend(animObject(series.options.animation), {step: function(val, fx) {
                  attr[translateProp] = translateStart + fx.pos * (yAxis.pos - translateStart);
                  series.group.attr(attr);
                }}));
              series.animate = null;
            }
          }
        },
        remove: function() {
          var series = this,
              chart = series.chart;
          if (chart.hasRendered) {
            each(chart.series, function(otherSeries) {
              if (otherSeries.type === series.type) {
                otherSeries.isDirty = true;
              }
            });
          }
          Series.prototype.remove.apply(series, arguments);
        }
      });
    }(Highcharts));
    (function(H) {
      var Series = H.Series,
          seriesType = H.seriesType;
      seriesType('scatter', 'line', {
        lineWidth: 0,
        findNearestPointBy: 'xy',
        marker: {enabled: true},
        tooltip: {
          headerFormat: '<span class="highcharts-color-{point.colorIndex}">\u25CF</span> ' + '<span class="highcharts-header"> {series.name}</span><br/>',
          pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>'
        }
      }, {
        sorted: false,
        requireSorting: false,
        noSharedTooltip: true,
        trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
        takeOrdinalPosition: false,
        drawGraph: function() {
          if (this.options.lineWidth) {
            Series.prototype.drawGraph.call(this);
          }
        }
      });
    }(Highcharts));
    (function(H) {
      var addEvent = H.addEvent,
          arrayMax = H.arrayMax,
          defined = H.defined,
          each = H.each,
          extend = H.extend,
          format = H.format,
          map = H.map,
          merge = H.merge,
          noop = H.noop,
          pick = H.pick,
          relativeLength = H.relativeLength,
          Series = H.Series,
          seriesTypes = H.seriesTypes,
          stableSort = H.stableSort;
      H.distribute = function(boxes, len) {
        var i,
            overlapping = true,
            origBoxes = boxes,
            restBoxes = [],
            box,
            target,
            total = 0;
        function sortByTarget(a, b) {
          return a.target - b.target;
        }
        i = boxes.length;
        while (i--) {
          total += boxes[i].size;
        }
        if (total > len) {
          stableSort(boxes, function(a, b) {
            return (b.rank || 0) - (a.rank || 0);
          });
          i = 0;
          total = 0;
          while (total <= len) {
            total += boxes[i].size;
            i++;
          }
          restBoxes = boxes.splice(i - 1, boxes.length);
        }
        stableSort(boxes, sortByTarget);
        boxes = map(boxes, function(box) {
          return {
            size: box.size,
            targets: [box.target],
            align: pick(box.align, 0.5)
          };
        });
        while (overlapping) {
          i = boxes.length;
          while (i--) {
            box = boxes[i];
            target = (Math.min.apply(0, box.targets) + Math.max.apply(0, box.targets)) / 2;
            box.pos = Math.min(Math.max(0, target - box.size * box.align), len - box.size);
          }
          i = boxes.length;
          overlapping = false;
          while (i--) {
            if (i > 0 && boxes[i - 1].pos + boxes[i - 1].size > boxes[i].pos) {
              boxes[i - 1].size += boxes[i].size;
              boxes[i - 1].targets = boxes[i - 1].targets.concat(boxes[i].targets);
              boxes[i - 1].align = 0.5;
              if (boxes[i - 1].pos + boxes[i - 1].size > len) {
                boxes[i - 1].pos = len - boxes[i - 1].size;
              }
              boxes.splice(i, 1);
              overlapping = true;
            }
          }
        }
        i = 0;
        each(boxes, function(box) {
          var posInCompositeBox = 0;
          each(box.targets, function() {
            origBoxes[i].pos = box.pos + posInCompositeBox;
            posInCompositeBox += origBoxes[i].size;
            i++;
          });
        });
        origBoxes.push.apply(origBoxes, restBoxes);
        stableSort(origBoxes, sortByTarget);
      };
      Series.prototype.drawDataLabels = function() {
        var series = this,
            chart = series.chart,
            seriesOptions = series.options,
            options = seriesOptions.dataLabels,
            points = series.points,
            pointOptions,
            generalOptions,
            hasRendered = series.hasRendered || 0,
            str,
            dataLabelsGroup,
            defer = pick(options.defer, !!seriesOptions.animation),
            renderer = chart.renderer;
        function applyFilter(point, options) {
          var filter = options.filter,
              op,
              prop,
              val;
          if (filter) {
            op = filter.operator;
            prop = point[filter.property];
            val = filter.value;
            if ((op === '>' && prop > val) || (op === '<' && prop < val) || (op === '>=' && prop >= val) || (op === '<=' && prop <= val) || (op === '==' && prop == val) || (op === '===' && prop === val)) {
              return true;
            }
            return false;
          }
          return true;
        }
        if (options.enabled || series._hasPointLabels) {
          if (series.dlProcessOptions) {
            series.dlProcessOptions(options);
          }
          dataLabelsGroup = series.plotGroup('dataLabelsGroup', 'data-labels', defer && !hasRendered ? 'hidden' : 'visible', options.zIndex || 6);
          if (defer) {
            dataLabelsGroup.attr({opacity: +hasRendered});
            if (!hasRendered) {
              addEvent(series, 'afterAnimate', function() {
                if (series.visible) {
                  dataLabelsGroup.show(true);
                }
                dataLabelsGroup[seriesOptions.animation ? 'animate' : 'attr']({opacity: 1}, {duration: 200});
              });
            }
          }
          generalOptions = options;
          each(points, function(point) {
            var enabled,
                dataLabel = point.dataLabel,
                labelConfig,
                attr,
                rotation,
                connector = point.connector,
                isNew = !dataLabel,
                style,
                formatString;
            pointOptions = point.dlOptions || (point.options && point.options.dataLabels);
            enabled = pick(pointOptions && pointOptions.enabled, generalOptions.enabled) && !point.isNull;
            if (enabled) {
              enabled = applyFilter(point, pointOptions || options) === true;
            }
            if (enabled) {
              options = merge(generalOptions, pointOptions);
              labelConfig = point.getLabelConfig();
              formatString = (options[point.formatPrefix + 'Format'] || options.format);
              str = defined(formatString) ? format(formatString, labelConfig, chart.time) : (options[point.formatPrefix + 'Formatter'] || options.formatter).call(labelConfig, options);
              style = options.style;
              rotation = options.rotation;
              attr = {
                r: options.borderRadius || 0,
                rotation: rotation,
                padding: options.padding,
                zIndex: 1
              };
              H.objectEach(attr, function(val, name) {
                if (val === undefined) {
                  delete attr[name];
                }
              });
            }
            if (dataLabel && (!enabled || !defined(str))) {
              point.dataLabel = dataLabel = dataLabel.destroy();
              if (connector) {
                point.connector = connector.destroy();
              }
            } else if (enabled && defined(str)) {
              if (!dataLabel) {
                dataLabel = point.dataLabel = rotation ? renderer.text(str, 0, -9999).addClass('highcharts-data-label') : renderer.label(str, 0, -9999, options.shape, null, null, options.useHTML, null, 'data-label');
                dataLabel.addClass(' highcharts-data-label-color-' + point.colorIndex + ' ' + (options.className || '') + (options.useHTML ? 'highcharts-tracker' : ''));
              } else {
                attr.text = str;
              }
              dataLabel.attr(attr);
              if (!dataLabel.added) {
                dataLabel.add(dataLabelsGroup);
              }
              series.alignDataLabel(point, dataLabel, options, null, isNew);
            }
          });
        }
        H.fireEvent(this, 'afterDrawDataLabels');
      };
      Series.prototype.alignDataLabel = function(point, dataLabel, options, alignTo, isNew) {
        var chart = this.chart,
            inverted = chart.inverted,
            plotX = pick(point.dlBox && point.dlBox.centerX, point.plotX, -9999),
            plotY = pick(point.plotY, -9999),
            bBox = dataLabel.getBBox(),
            fontSize,
            baseline,
            rotation = options.rotation,
            normRotation,
            negRotation,
            align = options.align,
            rotCorr,
            visible = this.visible && (point.series.forceDL || chart.isInsidePlot(plotX, Math.round(plotY), inverted) || (alignTo && chart.isInsidePlot(plotX, inverted ? alignTo.x + 1 : alignTo.y + alignTo.height - 1, inverted))),
            alignAttr,
            justify = pick(options.overflow, 'justify') === 'justify';
        if (visible) {
          baseline = chart.renderer.fontMetrics(fontSize, dataLabel).b;
          alignTo = extend({
            x: inverted ? this.yAxis.len - plotY : plotX,
            y: Math.round(inverted ? this.xAxis.len - plotX : plotY),
            width: 0,
            height: 0
          }, alignTo);
          extend(options, {
            width: bBox.width,
            height: bBox.height
          });
          if (rotation) {
            justify = false;
            rotCorr = chart.renderer.rotCorr(baseline, rotation);
            alignAttr = {
              x: alignTo.x + options.x + alignTo.width / 2 + rotCorr.x,
              y: (alignTo.y + options.y + {
                top: 0,
                middle: 0.5,
                bottom: 1
              }[options.verticalAlign] * alignTo.height)
            };
            dataLabel[isNew ? 'attr' : 'animate'](alignAttr).attr({align: align});
            normRotation = (rotation + 720) % 360;
            negRotation = normRotation > 180 && normRotation < 360;
            if (align === 'left') {
              alignAttr.y -= negRotation ? bBox.height : 0;
            } else if (align === 'center') {
              alignAttr.x -= bBox.width / 2;
              alignAttr.y -= bBox.height / 2;
            } else if (align === 'right') {
              alignAttr.x -= bBox.width;
              alignAttr.y -= negRotation ? 0 : bBox.height;
            }
          } else {
            dataLabel.align(options, null, alignTo);
            alignAttr = dataLabel.alignAttr;
          }
          if (justify) {
            point.isLabelJustified = this.justifyDataLabel(dataLabel, options, alignAttr, bBox, alignTo, isNew);
          } else if (pick(options.crop, true)) {
            visible = chart.isInsidePlot(alignAttr.x, alignAttr.y) && chart.isInsidePlot(alignAttr.x + bBox.width, alignAttr.y + bBox.height);
          }
          if (options.shape && !rotation) {
            dataLabel[isNew ? 'attr' : 'animate']({
              anchorX: inverted ? chart.plotWidth - point.plotY : point.plotX,
              anchorY: inverted ? chart.plotHeight - point.plotX : point.plotY
            });
          }
        }
        if (!visible) {
          dataLabel.attr({y: -9999});
          dataLabel.placed = false;
        }
      };
      Series.prototype.justifyDataLabel = function(dataLabel, options, alignAttr, bBox, alignTo, isNew) {
        var chart = this.chart,
            align = options.align,
            verticalAlign = options.verticalAlign,
            off,
            justified,
            padding = dataLabel.box ? 0 : (dataLabel.padding || 0);
        off = alignAttr.x + padding;
        if (off < 0) {
          if (align === 'right') {
            options.align = 'left';
          } else {
            options.x = -off;
          }
          justified = true;
        }
        off = alignAttr.x + bBox.width - padding;
        if (off > chart.plotWidth) {
          if (align === 'left') {
            options.align = 'right';
          } else {
            options.x = chart.plotWidth - off;
          }
          justified = true;
        }
        off = alignAttr.y + padding;
        if (off < 0) {
          if (verticalAlign === 'bottom') {
            options.verticalAlign = 'top';
          } else {
            options.y = -off;
          }
          justified = true;
        }
        off = alignAttr.y + bBox.height - padding;
        if (off > chart.plotHeight) {
          if (verticalAlign === 'top') {
            options.verticalAlign = 'bottom';
          } else {
            options.y = chart.plotHeight - off;
          }
          justified = true;
        }
        if (justified) {
          dataLabel.placed = !isNew;
          dataLabel.align(options, null, alignTo);
        }
        return justified;
      };
      if (seriesTypes.pie) {
        seriesTypes.pie.prototype.drawDataLabels = function() {
          var series = this,
              data = series.data,
              point,
              chart = series.chart,
              options = series.options.dataLabels,
              connectorPadding = pick(options.connectorPadding, 10),
              connectorWidth = pick(options.connectorWidth, 1),
              plotWidth = chart.plotWidth,
              plotHeight = chart.plotHeight,
              connector,
              seriesCenter = series.center,
              radius = seriesCenter[2] / 2,
              centerY = seriesCenter[1],
              dataLabel,
              dataLabelWidth,
              labelPos,
              labelHeight,
              halves = [[], []],
              x,
              y,
              visibility,
              j,
              overflow = [0, 0, 0, 0];
          if (!series.visible || (!options.enabled && !series._hasPointLabels)) {
            return;
          }
          each(data, function(point) {
            if (point.dataLabel && point.visible && point.dataLabel.shortened) {
              point.dataLabel.attr({width: 'auto'}).css({
                width: 'auto',
                textOverflow: 'clip'
              });
              point.dataLabel.shortened = false;
            }
          });
          Series.prototype.drawDataLabels.apply(series);
          each(data, function(point) {
            if (point.dataLabel && point.visible) {
              halves[point.half].push(point);
              point.dataLabel._pos = null;
            }
          });
          each(halves, function(points, i) {
            var top,
                bottom,
                length = points.length,
                positions = [],
                naturalY,
                sideOverflow,
                positionsIndex,
                size;
            if (!length) {
              return;
            }
            series.sortByAngle(points, i - 0.5);
            if (series.maxLabelDistance > 0) {
              top = Math.max(0, centerY - radius - series.maxLabelDistance);
              bottom = Math.min(centerY + radius + series.maxLabelDistance, chart.plotHeight);
              each(points, function(point) {
                if (point.labelDistance > 0 && point.dataLabel) {
                  point.top = Math.max(0, centerY - radius - point.labelDistance);
                  point.bottom = Math.min(centerY + radius + point.labelDistance, chart.plotHeight);
                  size = point.dataLabel.getBBox().height || 21;
                  point.positionsIndex = positions.push({
                    target: point.labelPos[1] - point.top + size / 2,
                    size: size,
                    rank: point.y
                  }) - 1;
                }
              });
              H.distribute(positions, bottom + size - top);
            }
            for (j = 0; j < length; j++) {
              point = points[j];
              positionsIndex = point.positionsIndex;
              labelPos = point.labelPos;
              dataLabel = point.dataLabel;
              visibility = point.visible === false ? 'hidden' : 'inherit';
              naturalY = labelPos[1];
              y = naturalY;
              if (positions && defined(positions[positionsIndex])) {
                if (positions[positionsIndex].pos === undefined) {
                  visibility = 'hidden';
                } else {
                  labelHeight = positions[positionsIndex].size;
                  y = point.top + positions[positionsIndex].pos;
                }
              }
              delete point.positionIndex;
              if (options.justify) {
                x = seriesCenter[0] + (i ? -1 : 1) * (radius + point.labelDistance);
              } else {
                x = series.getX(y < point.top + 2 || y > point.bottom - 2 ? naturalY : y, i, point);
              }
              dataLabel._attr = {
                visibility: visibility,
                align: labelPos[6]
              };
              dataLabel._pos = {
                x: (x + options.x + ({
                  left: connectorPadding,
                  right: -connectorPadding
                }[labelPos[6]] || 0)),
                y: y + options.y - 10
              };
              labelPos.x = x;
              labelPos.y = y;
              if (pick(options.crop, true)) {
                dataLabelWidth = dataLabel.getBBox().width;
                sideOverflow = null;
                if (x - dataLabelWidth < connectorPadding) {
                  sideOverflow = Math.round(dataLabelWidth - x + connectorPadding);
                  overflow[3] = Math.max(sideOverflow, overflow[3]);
                } else if (x + dataLabelWidth > plotWidth - connectorPadding) {
                  sideOverflow = Math.round(x + dataLabelWidth - plotWidth + connectorPadding);
                  overflow[1] = Math.max(sideOverflow, overflow[1]);
                }
                if (y - labelHeight / 2 < 0) {
                  overflow[0] = Math.max(Math.round(-y + labelHeight / 2), overflow[0]);
                } else if (y + labelHeight / 2 > plotHeight) {
                  overflow[2] = Math.max(Math.round(y + labelHeight / 2 - plotHeight), overflow[2]);
                }
                dataLabel.sideOverflow = sideOverflow;
              }
            }
          });
          if (arrayMax(overflow) === 0 || this.verifyDataLabelOverflow(overflow)) {
            this.placeDataLabels();
            if (connectorWidth) {
              each(this.points, function(point) {
                var isNew;
                connector = point.connector;
                dataLabel = point.dataLabel;
                if (dataLabel && dataLabel._pos && point.visible && point.labelDistance > 0) {
                  visibility = dataLabel._attr.visibility;
                  isNew = !connector;
                  if (isNew) {
                    point.connector = connector = chart.renderer.path().addClass('highcharts-data-label-connector ' + ' highcharts-color-' + point.colorIndex).add(series.dataLabelsGroup);
                  }
                  connector[isNew ? 'attr' : 'animate']({d: series.connectorPath(point.labelPos)});
                  connector.attr('visibility', visibility);
                } else if (connector) {
                  point.connector = connector.destroy();
                }
              });
            }
          }
        };
        seriesTypes.pie.prototype.connectorPath = function(labelPos) {
          var x = labelPos.x,
              y = labelPos.y;
          return pick(this.options.dataLabels.softConnector, true) ? ['M', x + (labelPos[6] === 'left' ? 5 : -5), y, 'C', x, y, 2 * labelPos[2] - labelPos[4], 2 * labelPos[3] - labelPos[5], labelPos[2], labelPos[3], 'L', labelPos[4], labelPos[5]] : ['M', x + (labelPos[6] === 'left' ? 5 : -5), y, 'L', labelPos[2], labelPos[3], 'L', labelPos[4], labelPos[5]];
        };
        seriesTypes.pie.prototype.placeDataLabels = function() {
          each(this.points, function(point) {
            var dataLabel = point.dataLabel,
                _pos;
            if (dataLabel && point.visible) {
              _pos = dataLabel._pos;
              if (_pos) {
                if (dataLabel.sideOverflow) {
                  dataLabel._attr.width = dataLabel.getBBox().width - dataLabel.sideOverflow;
                  dataLabel.css({
                    width: dataLabel._attr.width + 'px',
                    textOverflow: 'ellipsis'
                  });
                  dataLabel.shortened = true;
                }
                dataLabel.attr(dataLabel._attr);
                dataLabel[dataLabel.moved ? 'animate' : 'attr'](_pos);
                dataLabel.moved = true;
              } else if (dataLabel) {
                dataLabel.attr({y: -9999});
              }
            }
          }, this);
        };
        seriesTypes.pie.prototype.alignDataLabel = noop;
        seriesTypes.pie.prototype.verifyDataLabelOverflow = function(overflow) {
          var center = this.center,
              options = this.options,
              centerOption = options.center,
              minSize = options.minSize || 80,
              newSize = minSize,
              ret = options.size !== null;
          if (!ret) {
            if (centerOption[0] !== null) {
              newSize = Math.max(center[2] - Math.max(overflow[1], overflow[3]), minSize);
            } else {
              newSize = Math.max(center[2] - overflow[1] - overflow[3], minSize);
              center[0] += (overflow[3] - overflow[1]) / 2;
            }
            if (centerOption[1] !== null) {
              newSize = Math.max(Math.min(newSize, center[2] - Math.max(overflow[0], overflow[2])), minSize);
            } else {
              newSize = Math.max(Math.min(newSize, center[2] - overflow[0] - overflow[2]), minSize);
              center[1] += (overflow[0] - overflow[2]) / 2;
            }
            if (newSize < center[2]) {
              center[2] = newSize;
              center[3] = Math.min(relativeLength(options.innerSize || 0, newSize), newSize);
              this.translate(center);
              if (this.drawDataLabels) {
                this.drawDataLabels();
              }
            } else {
              ret = true;
            }
          }
          return ret;
        };
      }
      if (seriesTypes.column) {
        seriesTypes.column.prototype.alignDataLabel = function(point, dataLabel, options, alignTo, isNew) {
          var inverted = this.chart.inverted,
              series = point.series,
              dlBox = point.dlBox || point.shapeArgs,
              below = pick(point.below, point.plotY > pick(this.translatedThreshold, series.yAxis.len)),
              inside = pick(options.inside, !!this.options.stacking),
              overshoot;
          if (dlBox) {
            alignTo = merge(dlBox);
            if (alignTo.y < 0) {
              alignTo.height += alignTo.y;
              alignTo.y = 0;
            }
            overshoot = alignTo.y + alignTo.height - series.yAxis.len;
            if (overshoot > 0) {
              alignTo.height -= overshoot;
            }
            if (inverted) {
              alignTo = {
                x: series.yAxis.len - alignTo.y - alignTo.height,
                y: series.xAxis.len - alignTo.x - alignTo.width,
                width: alignTo.height,
                height: alignTo.width
              };
            }
            if (!inside) {
              if (inverted) {
                alignTo.x += below ? 0 : alignTo.width;
                alignTo.width = 0;
              } else {
                alignTo.y += below ? alignTo.height : 0;
                alignTo.height = 0;
              }
            }
          }
          options.align = pick(options.align, !inverted || inside ? 'center' : below ? 'right' : 'left');
          options.verticalAlign = pick(options.verticalAlign, inverted || inside ? 'middle' : below ? 'top' : 'bottom');
          Series.prototype.alignDataLabel.call(this, point, dataLabel, options, alignTo, isNew);
          if (point.isLabelJustified && point.contrastColor) {
            point.dataLabel.css({color: point.contrastColor});
          }
        };
      }
    }(Highcharts));
    (function(H) {
      var Chart = H.Chart,
          each = H.each,
          objectEach = H.objectEach,
          pick = H.pick,
          addEvent = H.addEvent;
      addEvent(Chart.prototype, 'render', function collectAndHide() {
        var labels = [];
        each(this.labelCollectors || [], function(collector) {
          labels = labels.concat(collector());
        });
        each(this.yAxis || [], function(yAxis) {
          if (yAxis.options.stackLabels && !yAxis.options.stackLabels.allowOverlap) {
            objectEach(yAxis.stacks, function(stack) {
              objectEach(stack, function(stackItem) {
                labels.push(stackItem.label);
              });
            });
          }
        });
        each(this.series || [], function(series) {
          var dlOptions = series.options.dataLabels,
              collections = series.dataLabelCollections || ['dataLabel'];
          if ((dlOptions.enabled || series._hasPointLabels) && !dlOptions.allowOverlap && series.visible) {
            each(collections, function(coll) {
              each(series.points, function(point) {
                if (point[coll]) {
                  point[coll].labelrank = pick(point.labelrank, point.shapeArgs && point.shapeArgs.height);
                  labels.push(point[coll]);
                }
              });
            });
          }
        });
        this.hideOverlappingLabels(labels);
      });
      Chart.prototype.hideOverlappingLabels = function(labels) {
        var len = labels.length,
            label,
            i,
            j,
            label1,
            label2,
            isIntersecting,
            pos1,
            pos2,
            parent1,
            parent2,
            padding,
            bBox,
            intersectRect = function(x1, y1, w1, h1, x2, y2, w2, h2) {
              return !(x2 > x1 + w1 || x2 + w2 < x1 || y2 > y1 + h1 || y2 + h2 < y1);
            };
        for (i = 0; i < len; i++) {
          label = labels[i];
          if (label) {
            label.oldOpacity = label.opacity;
            label.newOpacity = 1;
            if (!label.width) {
              bBox = label.getBBox();
              label.width = bBox.width;
              label.height = bBox.height;
            }
          }
        }
        labels.sort(function(a, b) {
          return (b.labelrank || 0) - (a.labelrank || 0);
        });
        for (i = 0; i < len; i++) {
          label1 = labels[i];
          for (j = i + 1; j < len; ++j) {
            label2 = labels[j];
            if (label1 && label2 && label1 !== label2 && label1.placed && label2.placed && label1.newOpacity !== 0 && label2.newOpacity !== 0) {
              pos1 = label1.alignAttr;
              pos2 = label2.alignAttr;
              parent1 = label1.parentGroup;
              parent2 = label2.parentGroup;
              padding = 2 * (label1.box ? 0 : (label1.padding || 0));
              isIntersecting = intersectRect(pos1.x + parent1.translateX, pos1.y + parent1.translateY, label1.width - padding, label1.height - padding, pos2.x + parent2.translateX, pos2.y + parent2.translateY, label2.width - padding, label2.height - padding);
              if (isIntersecting) {
                (label1.labelrank < label2.labelrank ? label1 : label2).newOpacity = 0;
              }
            }
          }
        }
        each(labels, function(label) {
          var complete,
              newOpacity;
          if (label) {
            newOpacity = label.newOpacity;
            if (label.oldOpacity !== newOpacity && label.placed) {
              if (newOpacity) {
                label.show(true);
              } else {
                complete = function() {
                  label.hide();
                };
              }
              label.alignAttr.opacity = newOpacity;
              label[label.isOld ? 'animate' : 'attr'](label.alignAttr, null, complete);
            }
            label.isOld = true;
          }
        });
      };
    }(Highcharts));
    (function(H) {
      var addEvent = H.addEvent,
          Chart = H.Chart,
          createElement = H.createElement,
          css = H.css,
          defaultOptions = H.defaultOptions,
          defaultPlotOptions = H.defaultPlotOptions,
          each = H.each,
          extend = H.extend,
          fireEvent = H.fireEvent,
          hasTouch = H.hasTouch,
          inArray = H.inArray,
          isObject = H.isObject,
          Legend = H.Legend,
          merge = H.merge,
          pick = H.pick,
          Point = H.Point,
          Series = H.Series,
          seriesTypes = H.seriesTypes,
          svg = H.svg,
          TrackerMixin;
      TrackerMixin = H.TrackerMixin = {
        drawTrackerPoint: function() {
          var series = this,
              chart = series.chart,
              pointer = chart.pointer,
              onMouseOver = function(e) {
                var point = pointer.getPointFromEvent(e);
                if (point !== undefined) {
                  pointer.isDirectTouch = true;
                  point.onMouseOver(e);
                }
              };
          each(series.points, function(point) {
            if (point.graphic) {
              point.graphic.element.point = point;
            }
            if (point.dataLabel) {
              if (point.dataLabel.div) {
                point.dataLabel.div.point = point;
              } else {
                point.dataLabel.element.point = point;
              }
            }
          });
          if (!series._hasTracking) {
            each(series.trackerGroups, function(key) {
              if (series[key]) {
                series[key].addClass('highcharts-tracker').on('mouseover', onMouseOver).on('mouseout', function(e) {
                  pointer.onTrackerMouseOut(e);
                });
                if (hasTouch) {
                  series[key].on('touchstart', onMouseOver);
                }
              }
            });
            series._hasTracking = true;
          }
          fireEvent(this, 'afterDrawTracker');
        },
        drawTrackerGraph: function() {
          var series = this,
              options = series.options,
              trackByArea = options.trackByArea,
              trackerPath = [].concat(trackByArea ? series.areaPath : series.graphPath),
              trackerPathLength = trackerPath.length,
              chart = series.chart,
              pointer = chart.pointer,
              renderer = chart.renderer,
              snap = chart.options.tooltip.snap,
              tracker = series.tracker,
              i,
              onMouseOver = function() {
                if (chart.hoverSeries !== series) {
                  series.onMouseOver();
                }
              },
              TRACKER_FILL = 'rgba(192,192,192,' + (svg ? 0.0001 : 0.002) + ')';
          if (trackerPathLength && !trackByArea) {
            i = trackerPathLength + 1;
            while (i--) {
              if (trackerPath[i] === 'M') {
                trackerPath.splice(i + 1, 0, trackerPath[i + 1] - snap, trackerPath[i + 2], 'L');
              }
              if ((i && trackerPath[i] === 'M') || i === trackerPathLength) {
                trackerPath.splice(i, 0, 'L', trackerPath[i - 2] + snap, trackerPath[i - 1]);
              }
            }
          }
          if (tracker) {
            tracker.attr({d: trackerPath});
          } else if (series.graph) {
            series.tracker = renderer.path(trackerPath).attr({
              'stroke-linejoin': 'round',
              visibility: series.visible ? 'visible' : 'hidden',
              stroke: TRACKER_FILL,
              fill: trackByArea ? TRACKER_FILL : 'none',
              'stroke-width': series.graph.strokeWidth() + (trackByArea ? 0 : 2 * snap),
              zIndex: 2
            }).add(series.group);
            each([series.tracker, series.markerGroup], function(tracker) {
              tracker.addClass('highcharts-tracker').on('mouseover', onMouseOver).on('mouseout', function(e) {
                pointer.onTrackerMouseOut(e);
              });
              if (hasTouch) {
                tracker.on('touchstart', onMouseOver);
              }
            });
          }
          fireEvent(this, 'afterDrawTracker');
        }
      };
      if (seriesTypes.column) {
        seriesTypes.column.prototype.drawTracker = TrackerMixin.drawTrackerPoint;
      }
      if (seriesTypes.pie) {
        seriesTypes.pie.prototype.drawTracker = TrackerMixin.drawTrackerPoint;
      }
      if (seriesTypes.scatter) {
        seriesTypes.scatter.prototype.drawTracker = TrackerMixin.drawTrackerPoint;
      }
      extend(Legend.prototype, {
        setItemEvents: function(item, legendItem, useHTML) {
          var legend = this,
              boxWrapper = legend.chart.renderer.boxWrapper,
              activeClass = 'highcharts-legend-' + (item instanceof Point ? 'point' : 'series') + '-active';
          (useHTML ? legendItem : item.legendGroup).on('mouseover', function() {
            item.setState('hover');
            boxWrapper.addClass(activeClass);
          }).on('mouseout', function() {
            boxWrapper.removeClass(activeClass);
            item.setState();
          }).on('click', function(event) {
            var strLegendItemClick = 'legendItemClick',
                fnLegendItemClick = function() {
                  if (item.setVisible) {
                    item.setVisible();
                  }
                };
            boxWrapper.removeClass(activeClass);
            event = {browserEvent: event};
            if (item.firePointEvent) {
              item.firePointEvent(strLegendItemClick, event, fnLegendItemClick);
            } else {
              fireEvent(item, strLegendItemClick, event, fnLegendItemClick);
            }
          });
        },
        createCheckboxForItem: function(item) {
          var legend = this;
          item.checkbox = createElement('input', {
            type: 'checkbox',
            checked: item.selected,
            defaultChecked: item.selected
          }, legend.options.itemCheckboxStyle, legend.chart.container);
          addEvent(item.checkbox, 'click', function(event) {
            var target = event.target;
            fireEvent(item.series || item, 'checkboxClick', {
              checked: target.checked,
              item: item
            }, function() {
              item.select();
            });
          });
        }
      });
      extend(Chart.prototype, {
        showResetZoom: function() {
          var chart = this,
              lang = defaultOptions.lang,
              btnOptions = chart.options.chart.resetZoomButton,
              theme = btnOptions.theme,
              states = theme.states,
              alignTo = btnOptions.relativeTo === 'chart' ? null : 'plotBox';
          function zoomOut() {
            chart.zoomOut();
          }
          fireEvent(this, 'beforeShowResetZoom', null, function() {
            chart.resetZoomButton = chart.renderer.button(lang.resetZoom, null, null, zoomOut, theme, states && states.hover).attr({
              align: btnOptions.position.align,
              title: lang.resetZoomTitle
            }).addClass('highcharts-reset-zoom').add().align(btnOptions.position, false, alignTo);
          });
        },
        zoomOut: function() {
          var chart = this;
          fireEvent(chart, 'selection', {resetSelection: true}, function() {
            chart.zoom();
          });
        },
        zoom: function(event) {
          var chart = this,
              hasZoomed,
              pointer = chart.pointer,
              displayButton = false,
              resetZoomButton;
          if (!event || event.resetSelection) {
            each(chart.axes, function(axis) {
              hasZoomed = axis.zoom();
            });
            pointer.initiated = false;
          } else {
            each(event.xAxis.concat(event.yAxis), function(axisData) {
              var axis = axisData.axis,
                  isXAxis = axis.isXAxis;
              if (pointer[isXAxis ? 'zoomX' : 'zoomY']) {
                hasZoomed = axis.zoom(axisData.min, axisData.max);
                if (axis.displayBtn) {
                  displayButton = true;
                }
              }
            });
          }
          resetZoomButton = chart.resetZoomButton;
          if (displayButton && !resetZoomButton) {
            chart.showResetZoom();
          } else if (!displayButton && isObject(resetZoomButton)) {
            chart.resetZoomButton = resetZoomButton.destroy();
          }
          if (hasZoomed) {
            chart.redraw(pick(chart.options.chart.animation, event && event.animation, chart.pointCount < 100));
          }
        },
        pan: function(e, panning) {
          var chart = this,
              hoverPoints = chart.hoverPoints,
              doRedraw;
          if (hoverPoints) {
            each(hoverPoints, function(point) {
              point.setState();
            });
          }
          each(panning === 'xy' ? [1, 0] : [1], function(isX) {
            var axis = chart[isX ? 'xAxis' : 'yAxis'][0],
                horiz = axis.horiz,
                mousePos = e[horiz ? 'chartX' : 'chartY'],
                mouseDown = horiz ? 'mouseDownX' : 'mouseDownY',
                startPos = chart[mouseDown],
                halfPointRange = (axis.pointRange || 0) / 2,
                extremes = axis.getExtremes(),
                panMin = axis.toValue(startPos - mousePos, true) + halfPointRange,
                panMax = axis.toValue(startPos + axis.len - mousePos, true) - halfPointRange,
                flipped = panMax < panMin,
                newMin = flipped ? panMax : panMin,
                newMax = flipped ? panMin : panMax,
                paddedMin = Math.min(extremes.dataMin, halfPointRange ? extremes.min : axis.toValue(axis.toPixels(extremes.min) - axis.minPixelPadding)),
                paddedMax = Math.max(extremes.dataMax, halfPointRange ? extremes.max : axis.toValue(axis.toPixels(extremes.max) + axis.minPixelPadding)),
                spill;
            spill = paddedMin - newMin;
            if (spill > 0) {
              newMax += spill;
              newMin = paddedMin;
            }
            spill = newMax - paddedMax;
            if (spill > 0) {
              newMax = paddedMax;
              newMin -= spill;
            }
            if (axis.series.length && newMin !== extremes.min && newMax !== extremes.max) {
              axis.setExtremes(newMin, newMax, false, false, {trigger: 'pan'});
              doRedraw = true;
            }
            chart[mouseDown] = mousePos;
          });
          if (doRedraw) {
            chart.redraw(false);
          }
          css(chart.container, {cursor: 'move'});
        }
      });
      extend(Point.prototype, {
        select: function(selected, accumulate) {
          var point = this,
              series = point.series,
              chart = series.chart;
          selected = pick(selected, !point.selected);
          point.firePointEvent(selected ? 'select' : 'unselect', {accumulate: accumulate}, function() {
            point.selected = point.options.selected = selected;
            series.options.data[inArray(point, series.data)] = point.options;
            point.setState(selected && 'select');
            if (!accumulate) {
              each(chart.getSelectedPoints(), function(loopPoint) {
                if (loopPoint.selected && loopPoint !== point) {
                  loopPoint.selected = loopPoint.options.selected = false;
                  series.options.data[inArray(loopPoint, series.data)] = loopPoint.options;
                  loopPoint.setState('');
                  loopPoint.firePointEvent('unselect');
                }
              });
            }
          });
        },
        onMouseOver: function(e) {
          var point = this,
              series = point.series,
              chart = series.chart,
              pointer = chart.pointer;
          e = e ? pointer.normalize(e) : pointer.getChartCoordinatesFromPoint(point, chart.inverted);
          pointer.runPointActions(e, point);
        },
        onMouseOut: function() {
          var point = this,
              chart = point.series.chart;
          point.firePointEvent('mouseOut');
          each(chart.hoverPoints || [], function(p) {
            p.setState();
          });
          chart.hoverPoints = chart.hoverPoint = null;
        },
        importEvents: function() {
          if (!this.hasImportedEvents) {
            var point = this,
                options = merge(point.series.options.point, point.options),
                events = options.events;
            point.events = events;
            H.objectEach(events, function(event, eventType) {
              addEvent(point, eventType, event);
            });
            this.hasImportedEvents = true;
          }
        },
        setState: function(state, move) {
          var point = this,
              plotX = Math.floor(point.plotX),
              plotY = point.plotY,
              series = point.series,
              stateOptions = series.options.states[state || 'normal'] || {},
              markerOptions = defaultPlotOptions[series.type].marker && series.options.marker,
              normalDisabled = markerOptions && markerOptions.enabled === false,
              markerStateOptions = (markerOptions && markerOptions.states && markerOptions.states[state || 'normal']) || {},
              stateDisabled = markerStateOptions.enabled === false,
              stateMarkerGraphic = series.stateMarkerGraphic,
              pointMarker = point.marker || {},
              chart = series.chart,
              halo = series.halo,
              haloOptions,
              markerAttribs,
              hasMarkers = markerOptions && series.markerAttribs,
              newSymbol;
          state = state || '';
          if ((state === point.state && !move) || (point.selected && state !== 'select') || (stateOptions.enabled === false) || (state && (stateDisabled || (normalDisabled && markerStateOptions.enabled === false))) || (state && pointMarker.states && pointMarker.states[state] && pointMarker.states[state].enabled === false)) {
            return;
          }
          if (hasMarkers) {
            markerAttribs = series.markerAttribs(point, state);
          }
          if (point.graphic) {
            if (point.state) {
              point.graphic.removeClass('highcharts-point-' + point.state);
            }
            if (state) {
              point.graphic.addClass('highcharts-point-' + state);
            }
            if (markerAttribs) {
              point.graphic.animate(markerAttribs, pick(chart.options.chart.animation, markerStateOptions.animation, markerOptions.animation));
            }
            if (stateMarkerGraphic) {
              stateMarkerGraphic.hide();
            }
          } else {
            if (state && markerStateOptions) {
              newSymbol = pointMarker.symbol || series.symbol;
              if (stateMarkerGraphic && stateMarkerGraphic.currentSymbol !== newSymbol) {
                stateMarkerGraphic = stateMarkerGraphic.destroy();
              }
              if (!stateMarkerGraphic) {
                if (newSymbol) {
                  series.stateMarkerGraphic = stateMarkerGraphic = chart.renderer.symbol(newSymbol, markerAttribs.x, markerAttribs.y, markerAttribs.width, markerAttribs.height).add(series.markerGroup);
                  stateMarkerGraphic.currentSymbol = newSymbol;
                }
              } else {
                stateMarkerGraphic[move ? 'animate' : 'attr']({
                  x: markerAttribs.x,
                  y: markerAttribs.y
                });
              }
            }
            if (stateMarkerGraphic) {
              stateMarkerGraphic[state && chart.isInsidePlot(plotX, plotY, chart.inverted) ? 'show' : 'hide']();
              stateMarkerGraphic.element.point = point;
            }
          }
          haloOptions = stateOptions.halo;
          if (haloOptions && haloOptions.size) {
            if (!halo) {
              series.halo = halo = chart.renderer.path().add((point.graphic || stateMarkerGraphic).parentGroup);
            }
            halo.show()[move ? 'animate' : 'attr']({d: point.haloPath(haloOptions.size)});
            halo.attr({'class': 'highcharts-halo highcharts-color-' + pick(point.colorIndex, series.colorIndex)});
            halo.point = point;
          } else if (halo && halo.point && halo.point.haloPath) {
            halo.animate({d: halo.point.haloPath(0)}, null, halo.hide);
          }
          point.state = state;
          fireEvent(point, 'afterSetState');
        },
        haloPath: function(size) {
          var series = this.series,
              chart = series.chart;
          return chart.renderer.symbols.circle(Math.floor(this.plotX) - size, this.plotY - size, size * 2, size * 2);
        }
      });
      extend(Series.prototype, {
        onMouseOver: function() {
          var series = this,
              chart = series.chart,
              hoverSeries = chart.hoverSeries;
          if (hoverSeries && hoverSeries !== series) {
            hoverSeries.onMouseOut();
          }
          if (series.options.events.mouseOver) {
            fireEvent(series, 'mouseOver');
          }
          series.setState('hover');
          chart.hoverSeries = series;
        },
        onMouseOut: function() {
          var series = this,
              options = series.options,
              chart = series.chart,
              tooltip = chart.tooltip,
              hoverPoint = chart.hoverPoint;
          chart.hoverSeries = null;
          if (hoverPoint) {
            hoverPoint.onMouseOut();
          }
          if (series && options.events.mouseOut) {
            fireEvent(series, 'mouseOut');
          }
          if (tooltip && !series.stickyTracking && (!tooltip.shared || series.noSharedTooltip)) {
            tooltip.hide();
          }
          series.setState();
        },
        setState: function(state) {
          var series = this,
              options = series.options,
              graph = series.graph,
              stateOptions = options.states,
              lineWidth = options.lineWidth,
              attribs,
              i = 0;
          state = state || '';
          if (series.state !== state) {
            each([series.group, series.markerGroup, series.dataLabelsGroup], function(group) {
              if (group) {
                if (series.state) {
                  group.removeClass('highcharts-series-' + series.state);
                }
                if (state) {
                  group.addClass('highcharts-series-' + state);
                }
              }
            });
            series.state = state;
          }
        },
        setVisible: function(vis, redraw) {
          var series = this,
              chart = series.chart,
              legendItem = series.legendItem,
              showOrHide,
              ignoreHiddenSeries = chart.options.chart.ignoreHiddenSeries,
              oldVisibility = series.visible;
          series.visible = vis = series.options.visible = series.userOptions.visible = vis === undefined ? !oldVisibility : vis;
          showOrHide = vis ? 'show' : 'hide';
          each(['group', 'dataLabelsGroup', 'markerGroup', 'tracker', 'tt'], function(key) {
            if (series[key]) {
              series[key][showOrHide]();
            }
          });
          if (chart.hoverSeries === series || (chart.hoverPoint && chart.hoverPoint.series) === series) {
            series.onMouseOut();
          }
          if (legendItem) {
            chart.legend.colorizeItem(series, vis);
          }
          series.isDirty = true;
          if (series.options.stacking) {
            each(chart.series, function(otherSeries) {
              if (otherSeries.options.stacking && otherSeries.visible) {
                otherSeries.isDirty = true;
              }
            });
          }
          each(series.linkedSeries, function(otherSeries) {
            otherSeries.setVisible(vis, false);
          });
          if (ignoreHiddenSeries) {
            chart.isDirtyBox = true;
          }
          if (redraw !== false) {
            chart.redraw();
          }
          fireEvent(series, showOrHide);
        },
        show: function() {
          this.setVisible(true);
        },
        hide: function() {
          this.setVisible(false);
        },
        select: function(selected) {
          var series = this;
          series.selected = selected = (selected === undefined) ? !series.selected : selected;
          if (series.checkbox) {
            series.checkbox.checked = selected;
          }
          fireEvent(series, selected ? 'select' : 'unselect');
        },
        drawTracker: TrackerMixin.drawTrackerGraph
      });
    }(Highcharts));
    (function(H) {
      var Chart = H.Chart,
          each = H.each,
          inArray = H.inArray,
          isArray = H.isArray,
          isObject = H.isObject,
          pick = H.pick,
          splat = H.splat;
      Chart.prototype.setResponsive = function(redraw) {
        var options = this.options.responsive,
            ruleIds = [],
            currentResponsive = this.currentResponsive,
            currentRuleIds;
        if (options && options.rules) {
          each(options.rules, function(rule) {
            if (rule._id === undefined) {
              rule._id = H.uniqueKey();
            }
            this.matchResponsiveRule(rule, ruleIds, redraw);
          }, this);
        }
        var mergedOptions = H.merge.apply(0, H.map(ruleIds, function(ruleId) {
          return H.find(options.rules, function(rule) {
            return rule._id === ruleId;
          }).chartOptions;
        }));
        ruleIds = ruleIds.toString() || undefined;
        currentRuleIds = currentResponsive && currentResponsive.ruleIds;
        if (ruleIds !== currentRuleIds) {
          if (currentResponsive) {
            this.update(currentResponsive.undoOptions, redraw);
          }
          if (ruleIds) {
            this.currentResponsive = {
              ruleIds: ruleIds,
              mergedOptions: mergedOptions,
              undoOptions: this.currentOptions(mergedOptions)
            };
            this.update(mergedOptions, redraw);
          } else {
            this.currentResponsive = undefined;
          }
        }
      };
      Chart.prototype.matchResponsiveRule = function(rule, matches) {
        var condition = rule.condition,
            fn = condition.callback || function() {
              return (this.chartWidth <= pick(condition.maxWidth, Number.MAX_VALUE) && this.chartHeight <= pick(condition.maxHeight, Number.MAX_VALUE) && this.chartWidth >= pick(condition.minWidth, 0) && this.chartHeight >= pick(condition.minHeight, 0));
            };
        if (fn.call(this)) {
          matches.push(rule._id);
        }
      };
      Chart.prototype.currentOptions = function(options) {
        var ret = {};
        function getCurrent(options, curr, ret, depth) {
          var i;
          H.objectEach(options, function(val, key) {
            if (!depth && inArray(key, ['series', 'xAxis', 'yAxis']) > -1) {
              val = splat(val);
              ret[key] = [];
              for (i = 0; i < val.length; i++) {
                if (curr[key][i]) {
                  ret[key][i] = {};
                  getCurrent(val[i], curr[key][i], ret[key][i], depth + 1);
                }
              }
            } else if (isObject(val)) {
              ret[key] = isArray(val) ? [] : {};
              getCurrent(val, curr[key] || {}, ret[key], depth + 1);
            } else {
              ret[key] = curr[key] || null;
            }
          });
        }
        getCurrent(options, this.options, ret, 0);
        return ret;
      };
    }(Highcharts));
    (function(H) {
      var Axis = H.Axis,
          each = H.each,
          pick = H.pick,
          wrap = H.wrap;
      wrap(Axis.prototype, 'getSeriesExtremes', function(proceed) {
        var isXAxis = this.isXAxis,
            dataMin,
            dataMax,
            xData = [],
            useMapGeometry;
        if (isXAxis) {
          each(this.series, function(series, i) {
            if (series.useMapGeometry) {
              xData[i] = series.xData;
              series.xData = [];
            }
          });
        }
        proceed.call(this);
        if (isXAxis) {
          dataMin = pick(this.dataMin, Number.MAX_VALUE);
          dataMax = pick(this.dataMax, -Number.MAX_VALUE);
          each(this.series, function(series, i) {
            if (series.useMapGeometry) {
              dataMin = Math.min(dataMin, pick(series.minX, dataMin));
              dataMax = Math.max(dataMax, pick(series.maxX, dataMax));
              series.xData = xData[i];
              useMapGeometry = true;
            }
          });
          if (useMapGeometry) {
            this.dataMin = dataMin;
            this.dataMax = dataMax;
          }
        }
      });
      wrap(Axis.prototype, 'setAxisTranslation', function(proceed) {
        var chart = this.chart,
            mapRatio,
            plotRatio = chart.plotWidth / chart.plotHeight,
            adjustedAxisLength,
            xAxis = chart.xAxis[0],
            padAxis,
            fixTo,
            fixDiff,
            preserveAspectRatio;
        proceed.call(this);
        if (this.coll === 'yAxis' && xAxis.transA !== undefined) {
          each(this.series, function(series) {
            if (series.preserveAspectRatio) {
              preserveAspectRatio = true;
            }
          });
        }
        if (preserveAspectRatio) {
          this.transA = xAxis.transA = Math.min(this.transA, xAxis.transA);
          mapRatio = plotRatio / ((xAxis.max - xAxis.min) / (this.max - this.min));
          padAxis = mapRatio < 1 ? this : xAxis;
          adjustedAxisLength = (padAxis.max - padAxis.min) * padAxis.transA;
          padAxis.pixelPadding = padAxis.len - adjustedAxisLength;
          padAxis.minPixelPadding = padAxis.pixelPadding / 2;
          fixTo = padAxis.fixTo;
          if (fixTo) {
            fixDiff = fixTo[1] - padAxis.toValue(fixTo[0], true);
            fixDiff *= padAxis.transA;
            if (Math.abs(fixDiff) > padAxis.minPixelPadding || (padAxis.min === padAxis.dataMin && padAxis.max === padAxis.dataMax)) {
              fixDiff = 0;
            }
            padAxis.minPixelPadding -= fixDiff;
          }
        }
      });
      wrap(Axis.prototype, 'render', function(proceed) {
        proceed.call(this);
        this.fixTo = null;
      });
    }(Highcharts));
    (function(H) {
      var Axis = H.Axis,
          Chart = H.Chart,
          color = H.color,
          ColorAxis,
          each = H.each,
          extend = H.extend,
          isNumber = H.isNumber,
          Legend = H.Legend,
          LegendSymbolMixin = H.LegendSymbolMixin,
          noop = H.noop,
          merge = H.merge,
          pick = H.pick,
          wrap = H.wrap;
      if (!H.ColorAxis) {
        ColorAxis = H.ColorAxis = function() {
          this.init.apply(this, arguments);
        };
        extend(ColorAxis.prototype, Axis.prototype);
        extend(ColorAxis.prototype, {
          defaultColorAxisOptions: {
            lineWidth: 0,
            minPadding: 0,
            maxPadding: 0,
            gridLineWidth: 1,
            tickPixelInterval: 72,
            startOnTick: true,
            endOnTick: true,
            offset: 0,
            marker: {
              animation: {duration: 50},
              width: 0.01
            },
            labels: {
              overflow: 'justify',
              rotation: 0
            },
            minColor: '#e6ebf5',
            maxColor: '#003399',
            tickLength: 5,
            showInLegend: true
          },
          keepProps: ['legendGroup', 'legendItemHeight', 'legendItemWidth', 'legendItem', 'legendSymbol'].concat(Axis.prototype.keepProps),
          init: function(chart, userOptions) {
            var horiz = chart.options.legend.layout !== 'vertical',
                options;
            this.coll = 'colorAxis';
            options = merge(this.defaultColorAxisOptions, {
              side: horiz ? 2 : 1,
              reversed: !horiz
            }, userOptions, {
              opposite: !horiz,
              showEmpty: false,
              title: null,
              visible: chart.options.legend.enabled
            });
            Axis.prototype.init.call(this, chart, options);
            if (userOptions.dataClasses) {
              this.initDataClasses(userOptions);
            }
            this.initStops();
            this.horiz = horiz;
            this.zoomEnabled = false;
            this.defaultLegendLength = 200;
          },
          initDataClasses: function(userOptions) {
            var chart = this.chart,
                dataClasses,
                colorCounter = 0,
                colorCount = chart.options.chart.colorCount,
                options = this.options,
                len = userOptions.dataClasses.length;
            this.dataClasses = dataClasses = [];
            this.legendItems = [];
            each(userOptions.dataClasses, function(dataClass, i) {
              var colors;
              dataClass = merge(dataClass);
              dataClasses.push(dataClass);
              if (options.dataClassColor === 'category') {
                dataClass.colorIndex = colorCounter;
                colorCounter++;
                if (colorCounter === colorCount) {
                  colorCounter = 0;
                }
              } else {
                dataClass.color = color(options.minColor).tweenTo(color(options.maxColor), len < 2 ? 0.5 : i / (len - 1));
              }
            });
          },
          setTickPositions: function() {
            if (!this.dataClasses) {
              return Axis.prototype.setTickPositions.call(this);
            }
          },
          initStops: function() {
            this.stops = this.options.stops || [[0, this.options.minColor], [1, this.options.maxColor]];
            each(this.stops, function(stop) {
              stop.color = color(stop[1]);
            });
          },
          setOptions: function(userOptions) {
            Axis.prototype.setOptions.call(this, userOptions);
            this.options.crosshair = this.options.marker;
          },
          setAxisSize: function() {
            var symbol = this.legendSymbol,
                chart = this.chart,
                legendOptions = chart.options.legend || {},
                x,
                y,
                width,
                height;
            if (symbol) {
              this.left = x = symbol.attr('x');
              this.top = y = symbol.attr('y');
              this.width = width = symbol.attr('width');
              this.height = height = symbol.attr('height');
              this.right = chart.chartWidth - x - width;
              this.bottom = chart.chartHeight - y - height;
              this.len = this.horiz ? width : height;
              this.pos = this.horiz ? x : y;
            } else {
              this.len = (this.horiz ? legendOptions.symbolWidth : legendOptions.symbolHeight) || this.defaultLegendLength;
            }
          },
          normalizedValue: function(value) {
            if (this.isLog) {
              value = this.val2lin(value);
            }
            return 1 - ((this.max - value) / ((this.max - this.min) || 1));
          },
          toColor: function(value, point) {
            var pos,
                stops = this.stops,
                from,
                to,
                color,
                dataClasses = this.dataClasses,
                dataClass,
                i;
            if (dataClasses) {
              i = dataClasses.length;
              while (i--) {
                dataClass = dataClasses[i];
                from = dataClass.from;
                to = dataClass.to;
                if ((from === undefined || value >= from) && (to === undefined || value <= to)) {
                  if (point) {
                    point.dataClass = i;
                    point.colorIndex = dataClass.colorIndex;
                  }
                  break;
                }
              }
            } else {
              pos = this.normalizedValue(value);
              i = stops.length;
              while (i--) {
                if (pos > stops[i][0]) {
                  break;
                }
              }
              from = stops[i] || stops[i + 1];
              to = stops[i + 1] || from;
              pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);
              color = from.color.tweenTo(to.color, pos);
            }
            return color;
          },
          getOffset: function() {
            var group = this.legendGroup,
                sideOffset = this.chart.axisOffset[this.side];
            if (group) {
              this.axisParent = group;
              Axis.prototype.getOffset.call(this);
              if (!this.added) {
                this.added = true;
                this.labelLeft = 0;
                this.labelRight = this.width;
              }
              this.chart.axisOffset[this.side] = sideOffset;
            }
          },
          setLegendColor: function() {
            var grad,
                horiz = this.horiz,
                reversed = this.reversed,
                one = reversed ? 1 : 0,
                zero = reversed ? 0 : 1;
            grad = horiz ? [one, 0, zero, 0] : [0, zero, 0, one];
            this.legendColor = {
              linearGradient: {
                x1: grad[0],
                y1: grad[1],
                x2: grad[2],
                y2: grad[3]
              },
              stops: this.stops
            };
          },
          drawLegendSymbol: function(legend, item) {
            var padding = legend.padding,
                legendOptions = legend.options,
                horiz = this.horiz,
                width = pick(legendOptions.symbolWidth, horiz ? this.defaultLegendLength : 12),
                height = pick(legendOptions.symbolHeight, horiz ? 12 : this.defaultLegendLength),
                labelPadding = pick(legendOptions.labelPadding, horiz ? 16 : 30),
                itemDistance = pick(legendOptions.itemDistance, 10);
            this.setLegendColor();
            item.legendSymbol = this.chart.renderer.rect(0, legend.baseline - 11, width, height).attr({zIndex: 1}).add(item.legendGroup);
            this.legendItemWidth = width + padding + (horiz ? itemDistance : labelPadding);
            this.legendItemHeight = height + padding + (horiz ? labelPadding : 0);
          },
          setState: function(state) {
            each(this.series, function(series) {
              series.setState(state);
            });
          },
          visible: true,
          setVisible: noop,
          getSeriesExtremes: function() {
            var series = this.series,
                i = series.length;
            this.dataMin = Infinity;
            this.dataMax = -Infinity;
            while (i--) {
              if (series[i].valueMin !== undefined) {
                this.dataMin = Math.min(this.dataMin, series[i].valueMin);
                this.dataMax = Math.max(this.dataMax, series[i].valueMax);
              }
            }
          },
          drawCrosshair: function(e, point) {
            var plotX = point && point.plotX,
                plotY = point && point.plotY,
                crossPos,
                axisPos = this.pos,
                axisLen = this.len;
            if (point) {
              crossPos = this.toPixels(point[point.series.colorKey]);
              if (crossPos < axisPos) {
                crossPos = axisPos - 2;
              } else if (crossPos > axisPos + axisLen) {
                crossPos = axisPos + axisLen + 2;
              }
              point.plotX = crossPos;
              point.plotY = this.len - crossPos;
              Axis.prototype.drawCrosshair.call(this, e, point);
              point.plotX = plotX;
              point.plotY = plotY;
              if (this.cross && !this.cross.addedToColorAxis && this.legendGroup) {
                this.cross.addClass('highcharts-coloraxis-marker').add(this.legendGroup);
                this.cross.addedToColorAxis = true;
              }
            }
          },
          getPlotLinePath: function(a, b, c, d, pos) {
            return isNumber(pos) ? (this.horiz ? ['M', pos - 4, this.top - 6, 'L', pos + 4, this.top - 6, pos, this.top, 'Z'] : ['M', this.left, pos, 'L', this.left - 6, pos + 6, this.left - 6, pos - 6, 'Z']) : Axis.prototype.getPlotLinePath.call(this, a, b, c, d);
          },
          update: function(newOptions, redraw) {
            var chart = this.chart,
                legend = chart.legend;
            each(this.series, function(series) {
              series.isDirtyData = true;
            });
            if (newOptions.dataClasses && legend.allItems) {
              each(legend.allItems, function(item) {
                if (item.isDataClass && item.legendGroup) {
                  item.legendGroup.destroy();
                }
              });
              chart.isDirtyLegend = true;
            }
            chart.options[this.coll] = merge(this.userOptions, newOptions);
            Axis.prototype.update.call(this, newOptions, redraw);
            if (this.legendItem) {
              this.setLegendColor();
              legend.colorizeItem(this, true);
            }
          },
          remove: function() {
            if (this.legendItem) {
              this.chart.legend.destroyItem(this);
            }
            Axis.prototype.remove.call(this);
          },
          getDataClassLegendSymbols: function() {
            var axis = this,
                chart = this.chart,
                legendItems = this.legendItems,
                legendOptions = chart.options.legend,
                valueDecimals = legendOptions.valueDecimals,
                valueSuffix = legendOptions.valueSuffix || '',
                name;
            if (!legendItems.length) {
              each(this.dataClasses, function(dataClass, i) {
                var vis = true,
                    from = dataClass.from,
                    to = dataClass.to;
                name = '';
                if (from === undefined) {
                  name = '< ';
                } else if (to === undefined) {
                  name = '> ';
                }
                if (from !== undefined) {
                  name += H.numberFormat(from, valueDecimals) + valueSuffix;
                }
                if (from !== undefined && to !== undefined) {
                  name += ' - ';
                }
                if (to !== undefined) {
                  name += H.numberFormat(to, valueDecimals) + valueSuffix;
                }
                legendItems.push(extend({
                  chart: chart,
                  name: name,
                  options: {},
                  drawLegendSymbol: LegendSymbolMixin.drawRectangle,
                  visible: true,
                  setState: noop,
                  isDataClass: true,
                  setVisible: function() {
                    vis = this.visible = !vis;
                    each(axis.series, function(series) {
                      each(series.points, function(point) {
                        if (point.dataClass === i) {
                          point.setVisible(vis);
                        }
                      });
                    });
                    chart.legend.colorizeItem(this, vis);
                  }
                }, dataClass));
              });
            }
            return legendItems;
          },
          name: ''
        });
        each(['fill', 'stroke'], function(prop) {
          H.Fx.prototype[prop + 'Setter'] = function() {
            this.elem.attr(prop, color(this.start).tweenTo(color(this.end), this.pos), null, true);
          };
        });
        wrap(Chart.prototype, 'getAxes', function(proceed) {
          var options = this.options,
              colorAxisOptions = options.colorAxis;
          proceed.call(this);
          this.colorAxis = [];
          if (colorAxisOptions) {
            new ColorAxis(this, colorAxisOptions);
          }
        });
        wrap(Legend.prototype, 'getAllItems', function(proceed) {
          var allItems = [],
              colorAxis = this.chart.colorAxis[0];
          if (colorAxis && colorAxis.options) {
            if (colorAxis.options.showInLegend) {
              if (colorAxis.options.dataClasses) {
                allItems = allItems.concat(colorAxis.getDataClassLegendSymbols());
              } else {
                allItems.push(colorAxis);
              }
            }
            each(colorAxis.series, function(series) {
              series.options.showInLegend = false;
            });
          }
          return allItems.concat(proceed.call(this));
        });
        wrap(Legend.prototype, 'colorizeItem', function(proceed, item, visible) {
          proceed.call(this, item, visible);
          if (visible && item.legendColor) {
            item.legendSymbol.attr({fill: item.legendColor});
          }
        });
        wrap(Legend.prototype, 'update', function(proceed) {
          proceed.apply(this, [].slice.call(arguments, 1));
          if (this.chart.colorAxis[0]) {
            this.chart.colorAxis[0].update({}, arguments[2]);
          }
        });
      }
    }(Highcharts));
    (function(H) {
      var defined = H.defined,
          each = H.each,
          noop = H.noop,
          seriesTypes = H.seriesTypes;
      H.colorPointMixin = {
        isValid: function() {
          return (this.value !== null && this.value !== Infinity && this.value !== -Infinity);
        },
        setVisible: function(vis) {
          var point = this,
              method = vis ? 'show' : 'hide';
          each(['graphic', 'dataLabel'], function(key) {
            if (point[key]) {
              point[key][method]();
            }
          });
        },
        setState: function(state) {
          H.Point.prototype.setState.call(this, state);
          if (this.graphic) {
            this.graphic.attr({zIndex: state === 'hover' ? 1 : 0});
          }
        }
      };
      H.colorSeriesMixin = {
        pointArrayMap: ['value'],
        axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
        optionalAxis: 'colorAxis',
        trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
        getSymbol: noop,
        parallelArrays: ['x', 'y', 'value'],
        colorKey: 'value',
        translateColors: function() {
          var series = this,
              nullColor = this.options.nullColor,
              colorAxis = this.colorAxis,
              colorKey = this.colorKey;
          each(this.data, function(point) {
            var value = point[colorKey],
                color;
            color = point.options.color || (point.isNull ? nullColor : (colorAxis && value !== undefined) ? colorAxis.toColor(value, point) : point.color || series.color);
            if (color) {
              point.color = color;
            }
          });
        },
        colorAttribs: function(point) {
          var ret = {};
          if (defined(point.color)) {
            ret[this.colorProp || 'fill'] = point.color;
          }
          return ret;
        }
      };
    }(Highcharts));
    (function(H) {
      var addEvent = H.addEvent,
          Chart = H.Chart,
          doc = H.doc,
          each = H.each,
          extend = H.extend,
          merge = H.merge,
          pick = H.pick,
          wrap = H.wrap;
      function stopEvent(e) {
        if (e) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          if (e.stopPropagation) {
            e.stopPropagation();
          }
          e.cancelBubble = true;
        }
      }
      function MapNavigation(chart) {
        this.init(chart);
      }
      MapNavigation.prototype.init = function(chart) {
        this.chart = chart;
        chart.mapNavButtons = [];
      };
      MapNavigation.prototype.update = function(options) {
        var chart = this.chart,
            o = chart.options.mapNavigation,
            buttonOptions,
            attr,
            states,
            hoverStates,
            selectStates,
            outerHandler = function(e) {
              this.handler.call(chart, e);
              stopEvent(e);
            },
            mapNavButtons = chart.mapNavButtons;
        if (options) {
          o = chart.options.mapNavigation = merge(chart.options.mapNavigation, options);
        }
        while (mapNavButtons.length) {
          mapNavButtons.pop().destroy();
        }
        if (pick(o.enableButtons, o.enabled) && !chart.renderer.forExport) {
          H.objectEach(o.buttons, function(button, n) {
            buttonOptions = merge(o.buttonOptions, button);
            button = chart.renderer.button(buttonOptions.text, 0, 0, outerHandler, attr, hoverStates, selectStates, 0, n === 'zoomIn' ? 'topbutton' : 'bottombutton').addClass('highcharts-map-navigation').attr({
              width: buttonOptions.width,
              height: buttonOptions.height,
              title: chart.options.lang[n],
              padding: buttonOptions.padding,
              zIndex: 5
            }).add();
            button.handler = buttonOptions.onclick;
            button.align(extend(buttonOptions, {
              width: button.width,
              height: 2 * button.height
            }), null, buttonOptions.alignTo);
            addEvent(button.element, 'dblclick', stopEvent);
            mapNavButtons.push(button);
          });
        }
        this.updateEvents(o);
      };
      MapNavigation.prototype.updateEvents = function(options) {
        var chart = this.chart;
        if (pick(options.enableDoubleClickZoom, options.enabled) || options.enableDoubleClickZoomTo) {
          this.unbindDblClick = this.unbindDblClick || addEvent(chart.container, 'dblclick', function(e) {
            chart.pointer.onContainerDblClick(e);
          });
        } else if (this.unbindDblClick) {
          this.unbindDblClick = this.unbindDblClick();
        }
        if (pick(options.enableMouseWheelZoom, options.enabled)) {
          this.unbindMouseWheel = this.unbindMouseWheel || addEvent(chart.container, doc.onmousewheel === undefined ? 'DOMMouseScroll' : 'mousewheel', function(e) {
            chart.pointer.onContainerMouseWheel(e);
            stopEvent(e);
            return false;
          });
        } else if (this.unbindMouseWheel) {
          this.unbindMouseWheel = this.unbindMouseWheel();
        }
      };
      extend(Chart.prototype, {
        fitToBox: function(inner, outer) {
          each([['x', 'width'], ['y', 'height']], function(dim) {
            var pos = dim[0],
                size = dim[1];
            if (inner[pos] + inner[size] > outer[pos] + outer[size]) {
              if (inner[size] > outer[size]) {
                inner[size] = outer[size];
                inner[pos] = outer[pos];
              } else {
                inner[pos] = outer[pos] + outer[size] - inner[size];
              }
            }
            if (inner[size] > outer[size]) {
              inner[size] = outer[size];
            }
            if (inner[pos] < outer[pos]) {
              inner[pos] = outer[pos];
            }
          });
          return inner;
        },
        mapZoom: function(howMuch, centerXArg, centerYArg, mouseX, mouseY) {
          var chart = this,
              xAxis = chart.xAxis[0],
              xRange = xAxis.max - xAxis.min,
              centerX = pick(centerXArg, xAxis.min + xRange / 2),
              newXRange = xRange * howMuch,
              yAxis = chart.yAxis[0],
              yRange = yAxis.max - yAxis.min,
              centerY = pick(centerYArg, yAxis.min + yRange / 2),
              newYRange = yRange * howMuch,
              fixToX = mouseX ? ((mouseX - xAxis.pos) / xAxis.len) : 0.5,
              fixToY = mouseY ? ((mouseY - yAxis.pos) / yAxis.len) : 0.5,
              newXMin = centerX - newXRange * fixToX,
              newYMin = centerY - newYRange * fixToY,
              newExt = chart.fitToBox({
                x: newXMin,
                y: newYMin,
                width: newXRange,
                height: newYRange
              }, {
                x: xAxis.dataMin,
                y: yAxis.dataMin,
                width: xAxis.dataMax - xAxis.dataMin,
                height: yAxis.dataMax - yAxis.dataMin
              }),
              zoomOut = newExt.x <= xAxis.dataMin && newExt.width >= xAxis.dataMax - xAxis.dataMin && newExt.y <= yAxis.dataMin && newExt.height >= yAxis.dataMax - yAxis.dataMin;
          if (mouseX) {
            xAxis.fixTo = [mouseX - xAxis.pos, centerXArg];
          }
          if (mouseY) {
            yAxis.fixTo = [mouseY - yAxis.pos, centerYArg];
          }
          if (howMuch !== undefined && !zoomOut) {
            xAxis.setExtremes(newExt.x, newExt.x + newExt.width, false);
            yAxis.setExtremes(newExt.y, newExt.y + newExt.height, false);
          } else {
            xAxis.setExtremes(undefined, undefined, false);
            yAxis.setExtremes(undefined, undefined, false);
          }
          chart.redraw();
        }
      });
      wrap(Chart.prototype, 'render', function(proceed) {
        this.mapNavigation = new MapNavigation(this);
        this.mapNavigation.update();
        proceed.call(this);
      });
    }(Highcharts));
    (function(H) {
      var extend = H.extend,
          pick = H.pick,
          Pointer = H.Pointer,
          wrap = H.wrap;
      extend(Pointer.prototype, {
        onContainerDblClick: function(e) {
          var chart = this.chart;
          e = this.normalize(e);
          if (chart.options.mapNavigation.enableDoubleClickZoomTo) {
            if (chart.pointer.inClass(e.target, 'highcharts-tracker') && chart.hoverPoint) {
              chart.hoverPoint.zoomTo();
            }
          } else if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
            chart.mapZoom(0.5, chart.xAxis[0].toValue(e.chartX), chart.yAxis[0].toValue(e.chartY), e.chartX, e.chartY);
          }
        },
        onContainerMouseWheel: function(e) {
          var chart = this.chart,
              delta;
          e = this.normalize(e);
          delta = e.detail || -(e.wheelDelta / 120);
          if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
            chart.mapZoom(Math.pow(chart.options.mapNavigation.mouseWheelSensitivity, delta), chart.xAxis[0].toValue(e.chartX), chart.yAxis[0].toValue(e.chartY), e.chartX, e.chartY);
          }
        }
      });
      wrap(Pointer.prototype, 'zoomOption', function(proceed) {
        var mapNavigation = this.chart.options.mapNavigation;
        if (pick(mapNavigation.enableTouchZoom, mapNavigation.enabled)) {
          this.chart.options.chart.pinchType = 'xy';
        }
        proceed.apply(this, [].slice.call(arguments, 1));
      });
      wrap(Pointer.prototype, 'pinchTranslate', function(proceed, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch) {
        var xBigger;
        proceed.call(this, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch);
        if (this.chart.options.chart.type === 'map' && this.hasZoom) {
          xBigger = transform.scaleX > transform.scaleY;
          this.pinchTranslateDirection(!xBigger, pinchDown, touches, transform, selectionMarker, clip, lastValidTouch, xBigger ? transform.scaleX : transform.scaleY);
        }
      });
    }(Highcharts));
    (function(H) {
      var colorPointMixin = H.colorPointMixin,
          colorSeriesMixin = H.colorSeriesMixin,
          doc = H.doc,
          each = H.each,
          extend = H.extend,
          isNumber = H.isNumber,
          LegendSymbolMixin = H.LegendSymbolMixin,
          map = H.map,
          merge = H.merge,
          noop = H.noop,
          pick = H.pick,
          isArray = H.isArray,
          Point = H.Point,
          Series = H.Series,
          seriesType = H.seriesType,
          seriesTypes = H.seriesTypes,
          splat = H.splat;
      var supportsVectorEffect = doc.documentElement.style.vectorEffect !== undefined;
      seriesType('map', 'scatter', {
        allAreas: true,
        animation: false,
        nullColor: '#f7f7f7',
        borderColor: '#cccccc',
        borderWidth: 1,
        marker: null,
        stickyTracking: false,
        joinBy: 'hc-key',
        dataLabels: {
          formatter: function() {
            return this.point.value;
          },
          inside: true,
          verticalAlign: 'middle',
          crop: false,
          overflow: false,
          padding: 0
        },
        turboThreshold: 0,
        tooltip: {
          followPointer: true,
          pointFormat: '{point.name}: {point.value}<br/>'
        },
        states: {
          normal: {animation: true},
          hover: {
            halo: null,
            brightness: 0.2
          },
          select: {color: '#cccccc'}
        }
      }, merge(colorSeriesMixin, {
        type: 'map',
        getExtremesFromAll: true,
        useMapGeometry: true,
        forceDL: true,
        searchPoint: noop,
        directTouch: true,
        preserveAspectRatio: true,
        pointArrayMap: ['value'],
        getBox: function(paths) {
          var MAX_VALUE = Number.MAX_VALUE,
              maxX = -MAX_VALUE,
              minX = MAX_VALUE,
              maxY = -MAX_VALUE,
              minY = MAX_VALUE,
              minRange = MAX_VALUE,
              xAxis = this.xAxis,
              yAxis = this.yAxis,
              hasBox;
          each(paths || [], function(point) {
            if (point.path) {
              if (typeof point.path === 'string') {
                point.path = H.splitPath(point.path);
              }
              var path = point.path || [],
                  i = path.length,
                  even = false,
                  pointMaxX = -MAX_VALUE,
                  pointMinX = MAX_VALUE,
                  pointMaxY = -MAX_VALUE,
                  pointMinY = MAX_VALUE,
                  properties = point.properties;
              if (!point._foundBox) {
                while (i--) {
                  if (isNumber(path[i])) {
                    if (even) {
                      pointMaxX = Math.max(pointMaxX, path[i]);
                      pointMinX = Math.min(pointMinX, path[i]);
                    } else {
                      pointMaxY = Math.max(pointMaxY, path[i]);
                      pointMinY = Math.min(pointMinY, path[i]);
                    }
                    even = !even;
                  }
                }
                point._midX = pointMinX + (pointMaxX - pointMinX) * pick(point.middleX, properties && properties['hc-middle-x'], 0.5);
                point._midY = pointMinY + (pointMaxY - pointMinY) * pick(point.middleY, properties && properties['hc-middle-y'], 0.5);
                point._maxX = pointMaxX;
                point._minX = pointMinX;
                point._maxY = pointMaxY;
                point._minY = pointMinY;
                point.labelrank = pick(point.labelrank, (pointMaxX - pointMinX) * (pointMaxY - pointMinY));
                point._foundBox = true;
              }
              maxX = Math.max(maxX, point._maxX);
              minX = Math.min(minX, point._minX);
              maxY = Math.max(maxY, point._maxY);
              minY = Math.min(minY, point._minY);
              minRange = Math.min(point._maxX - point._minX, point._maxY - point._minY, minRange);
              hasBox = true;
            }
          });
          if (hasBox) {
            this.minY = Math.min(minY, pick(this.minY, MAX_VALUE));
            this.maxY = Math.max(maxY, pick(this.maxY, -MAX_VALUE));
            this.minX = Math.min(minX, pick(this.minX, MAX_VALUE));
            this.maxX = Math.max(maxX, pick(this.maxX, -MAX_VALUE));
            if (xAxis && xAxis.options.minRange === undefined) {
              xAxis.minRange = Math.min(5 * minRange, (this.maxX - this.minX) / 5, xAxis.minRange || MAX_VALUE);
            }
            if (yAxis && yAxis.options.minRange === undefined) {
              yAxis.minRange = Math.min(5 * minRange, (this.maxY - this.minY) / 5, yAxis.minRange || MAX_VALUE);
            }
          }
        },
        getExtremes: function() {
          Series.prototype.getExtremes.call(this, this.valueData);
          if (this.chart.hasRendered && this.isDirtyData) {
            this.getBox(this.options.data);
          }
          this.valueMin = this.dataMin;
          this.valueMax = this.dataMax;
          this.dataMin = this.minY;
          this.dataMax = this.maxY;
        },
        translatePath: function(path) {
          var series = this,
              even = false,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              xMin = xAxis.min,
              xTransA = xAxis.transA,
              xMinPixelPadding = xAxis.minPixelPadding,
              yMin = yAxis.min,
              yTransA = yAxis.transA,
              yMinPixelPadding = yAxis.minPixelPadding,
              i,
              ret = [];
          if (path) {
            i = path.length;
            while (i--) {
              if (isNumber(path[i])) {
                ret[i] = even ? (path[i] - xMin) * xTransA + xMinPixelPadding : (path[i] - yMin) * yTransA + yMinPixelPadding;
                even = !even;
              } else {
                ret[i] = path[i];
              }
            }
          }
          return ret;
        },
        setData: function(data, redraw, animation, updatePoints) {
          var options = this.options,
              chartOptions = this.chart.options.chart,
              globalMapData = chartOptions && chartOptions.map,
              mapData = options.mapData,
              joinBy = options.joinBy,
              joinByNull = joinBy === null,
              pointArrayMap = options.keys || this.pointArrayMap,
              dataUsed = [],
              mapMap = {},
              mapPoint,
              mapTransforms = this.chart.mapTransforms,
              props,
              i;
          if (!mapData && globalMapData) {
            mapData = typeof globalMapData === 'string' ? H.maps[globalMapData] : globalMapData;
          }
          if (joinByNull) {
            joinBy = '_i';
          }
          joinBy = this.joinBy = splat(joinBy);
          if (!joinBy[1]) {
            joinBy[1] = joinBy[0];
          }
          if (data) {
            each(data, function(val, i) {
              var ix = 0;
              if (isNumber(val)) {
                data[i] = {value: val};
              } else if (isArray(val)) {
                data[i] = {};
                if (!options.keys && val.length > pointArrayMap.length && typeof val[0] === 'string') {
                  data[i]['hc-key'] = val[0];
                  ++ix;
                }
                for (var j = 0; j < pointArrayMap.length; ++j, ++ix) {
                  if (pointArrayMap[j]) {
                    data[i][pointArrayMap[j]] = val[ix];
                  }
                }
              }
              if (joinByNull) {
                data[i]._i = i;
              }
            });
          }
          this.getBox(data);
          this.chart.mapTransforms = mapTransforms = chartOptions && chartOptions.mapTransforms || mapData && mapData['hc-transform'] || mapTransforms;
          if (mapTransforms) {
            H.objectEach(mapTransforms, function(transform) {
              if (transform.rotation) {
                transform.cosAngle = Math.cos(transform.rotation);
                transform.sinAngle = Math.sin(transform.rotation);
              }
            });
          }
          if (mapData) {
            if (mapData.type === 'FeatureCollection') {
              this.mapTitle = mapData.title;
              mapData = H.geojson(mapData, this.type, this);
            }
            this.mapData = mapData;
            this.mapMap = {};
            for (i = 0; i < mapData.length; i++) {
              mapPoint = mapData[i];
              props = mapPoint.properties;
              mapPoint._i = i;
              if (joinBy[0] && props && props[joinBy[0]]) {
                mapPoint[joinBy[0]] = props[joinBy[0]];
              }
              mapMap[mapPoint[joinBy[0]]] = mapPoint;
            }
            this.mapMap = mapMap;
            if (data && joinBy[1]) {
              each(data, function(point) {
                if (mapMap[point[joinBy[1]]]) {
                  dataUsed.push(mapMap[point[joinBy[1]]]);
                }
              });
            }
            if (options.allAreas) {
              this.getBox(mapData);
              data = data || [];
              if (joinBy[1]) {
                each(data, function(point) {
                  dataUsed.push(point[joinBy[1]]);
                });
              }
              dataUsed = '|' + map(dataUsed, function(point) {
                return point && point[joinBy[0]];
              }).join('|') + '|';
              each(mapData, function(mapPoint) {
                if (!joinBy[0] || dataUsed.indexOf('|' + mapPoint[joinBy[0]] + '|') === -1) {
                  data.push(merge(mapPoint, {value: null}));
                  updatePoints = false;
                }
              });
            } else {
              this.getBox(dataUsed);
            }
          }
          Series.prototype.setData.call(this, data, redraw, animation, updatePoints);
        },
        drawGraph: noop,
        drawDataLabels: noop,
        doFullTranslate: function() {
          return this.isDirtyData || this.chart.isResizing || this.chart.renderer.isVML || !this.baseTrans;
        },
        translate: function() {
          var series = this,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              doFullTranslate = series.doFullTranslate();
          series.generatePoints();
          each(series.data, function(point) {
            point.plotX = xAxis.toPixels(point._midX, true);
            point.plotY = yAxis.toPixels(point._midY, true);
            if (doFullTranslate) {
              point.shapeType = 'path';
              point.shapeArgs = {d: series.translatePath(point.path)};
            }
          });
          series.translateColors();
        },
        pointAttribs: function(point, state) {
          var attr;
          attr = this.colorAttribs(point);
          if (supportsVectorEffect) {
            attr['vector-effect'] = 'non-scaling-stroke';
          } else {
            attr['stroke-width'] = 'inherit';
          }
          return attr;
        },
        drawPoints: function() {
          var series = this,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              group = series.group,
              chart = series.chart,
              renderer = chart.renderer,
              scaleX,
              scaleY,
              translateX,
              translateY,
              baseTrans = this.baseTrans,
              transformGroup,
              startTranslateX,
              startTranslateY,
              startScaleX,
              startScaleY;
          if (!series.transformGroup) {
            series.transformGroup = renderer.g().attr({
              scaleX: 1,
              scaleY: 1
            }).add(group);
            series.transformGroup.survive = true;
          }
          if (series.doFullTranslate()) {
            series.group = series.transformGroup;
            seriesTypes.column.prototype.drawPoints.apply(series);
            series.group = group;
            each(series.points, function(point) {
              if (point.graphic) {
                if (point.name) {
                  point.graphic.addClass('highcharts-name-' + point.name.replace(/ /g, '-').toLowerCase());
                }
                if (point.properties && point.properties['hc-key']) {
                  point.graphic.addClass('highcharts-key-' + point.properties['hc-key'].toLowerCase());
                }
                point.graphic.css(series.pointAttribs(point, point.selected && 'select'));
              }
            });
            this.baseTrans = {
              originX: xAxis.min - xAxis.minPixelPadding / xAxis.transA,
              originY: yAxis.min - yAxis.minPixelPadding / yAxis.transA + (yAxis.reversed ? 0 : yAxis.len / yAxis.transA),
              transAX: xAxis.transA,
              transAY: yAxis.transA
            };
            this.transformGroup.animate({
              translateX: 0,
              translateY: 0,
              scaleX: 1,
              scaleY: 1
            });
          } else {
            scaleX = xAxis.transA / baseTrans.transAX;
            scaleY = yAxis.transA / baseTrans.transAY;
            translateX = xAxis.toPixels(baseTrans.originX, true);
            translateY = yAxis.toPixels(baseTrans.originY, true);
            if (scaleX > 0.99 && scaleX < 1.01 && scaleY > 0.99 && scaleY < 1.01) {
              scaleX = 1;
              scaleY = 1;
              translateX = Math.round(translateX);
              translateY = Math.round(translateY);
            }
            transformGroup = this.transformGroup;
            if (chart.renderer.globalAnimation) {
              startTranslateX = transformGroup.attr('translateX');
              startTranslateY = transformGroup.attr('translateY');
              startScaleX = transformGroup.attr('scaleX');
              startScaleY = transformGroup.attr('scaleY');
              transformGroup.attr({animator: 0}).animate({animator: 1}, {step: function(now, fx) {
                  transformGroup.attr({
                    translateX: startTranslateX + (translateX - startTranslateX) * fx.pos,
                    translateY: startTranslateY + (translateY - startTranslateY) * fx.pos,
                    scaleX: startScaleX + (scaleX - startScaleX) * fx.pos,
                    scaleY: startScaleY + (scaleY - startScaleY) * fx.pos
                  });
                }});
            } else {
              transformGroup.attr({
                translateX: translateX,
                translateY: translateY,
                scaleX: scaleX,
                scaleY: scaleY
              });
            }
          }
          if (!supportsVectorEffect) {
            series.group.element.setAttribute('stroke-width', series.options[(series.pointAttrToOptions && series.pointAttrToOptions['stroke-width']) || 'borderWidth'] / (scaleX || 1));
          }
          this.drawMapDataLabels();
        },
        drawMapDataLabels: function() {
          Series.prototype.drawDataLabels.call(this);
          if (this.dataLabelsGroup) {
            this.dataLabelsGroup.clip(this.chart.clipRect);
          }
        },
        render: function() {
          var series = this,
              render = Series.prototype.render;
          if (series.chart.renderer.isVML && series.data.length > 3000) {
            setTimeout(function() {
              render.call(series);
            });
          } else {
            render.call(series);
          }
        },
        animate: function(init) {
          var chart = this.chart,
              animation = this.options.animation,
              group = this.group,
              xAxis = this.xAxis,
              yAxis = this.yAxis,
              left = xAxis.pos,
              top = yAxis.pos;
          if (chart.renderer.isSVG) {
            if (animation === true) {
              animation = {duration: 1000};
            }
            if (init) {
              group.attr({
                translateX: left + xAxis.len / 2,
                translateY: top + yAxis.len / 2,
                scaleX: 0.001,
                scaleY: 0.001
              });
            } else {
              group.animate({
                translateX: left,
                translateY: top,
                scaleX: 1,
                scaleY: 1
              }, animation);
              this.animate = null;
            }
          }
        },
        animateDrilldown: function(init) {
          var toBox = this.chart.plotBox,
              level = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
              fromBox = level.bBox,
              animationOptions = this.chart.options.drilldown.animation,
              scale;
          if (!init) {
            scale = Math.min(fromBox.width / toBox.width, fromBox.height / toBox.height);
            level.shapeArgs = {
              scaleX: scale,
              scaleY: scale,
              translateX: fromBox.x,
              translateY: fromBox.y
            };
            each(this.points, function(point) {
              if (point.graphic) {
                point.graphic.attr(level.shapeArgs).animate({
                  scaleX: 1,
                  scaleY: 1,
                  translateX: 0,
                  translateY: 0
                }, animationOptions);
              }
            });
            this.animate = null;
          }
        },
        drawLegendSymbol: LegendSymbolMixin.drawRectangle,
        animateDrillupFrom: function(level) {
          seriesTypes.column.prototype.animateDrillupFrom.call(this, level);
        },
        animateDrillupTo: function(init) {
          seriesTypes.column.prototype.animateDrillupTo.call(this, init);
        }
      }), extend({
        applyOptions: function(options, x) {
          var point = Point.prototype.applyOptions.call(this, options, x),
              series = this.series,
              joinBy = series.joinBy,
              mapPoint;
          if (series.mapData) {
            mapPoint = point[joinBy[1]] !== undefined && series.mapMap[point[joinBy[1]]];
            if (mapPoint) {
              if (series.xyFromShape) {
                point.x = mapPoint._midX;
                point.y = mapPoint._midY;
              }
              extend(point, mapPoint);
            } else {
              point.value = point.value || null;
            }
          }
          return point;
        },
        onMouseOver: function(e) {
          clearTimeout(this.colorInterval);
          if (this.value !== null || this.series.options.nullInteraction) {
            Point.prototype.onMouseOver.call(this, e);
          } else {
            this.series.onMouseOut(e);
          }
        },
        zoomTo: function() {
          var point = this,
              series = point.series;
          series.xAxis.setExtremes(point._minX, point._maxX, false);
          series.yAxis.setExtremes(point._minY, point._maxY, false);
          series.chart.redraw();
        }
      }, colorPointMixin));
    }(Highcharts));
    (function(H) {
      var seriesType = H.seriesType,
          seriesTypes = H.seriesTypes;
      seriesType('mapline', 'map', {}, {
        type: 'mapline',
        colorProp: 'stroke',
        drawLegendSymbol: seriesTypes.line.prototype.drawLegendSymbol
      });
    }(Highcharts));
    (function(H) {
      var merge = H.merge,
          Point = H.Point,
          seriesType = H.seriesType;
      seriesType('mappoint', 'scatter', {dataLabels: {
          enabled: true,
          formatter: function() {
            return this.point.name;
          },
          crop: false,
          defer: false,
          overflow: false,
          style: {color: '#000000'}
        }}, {
        type: 'mappoint',
        forceDL: true
      }, {applyOptions: function(options, x) {
          var mergedOptions = (options.lat !== undefined && options.lon !== undefined ? merge(options, this.series.chart.fromLatLonToPoint(options)) : options);
          return Point.prototype.applyOptions.call(this, mergedOptions, x);
        }});
    }(Highcharts));
    (function(H) {
      var arrayMax = H.arrayMax,
          arrayMin = H.arrayMin,
          Axis = H.Axis,
          color = H.color,
          each = H.each,
          isNumber = H.isNumber,
          noop = H.noop,
          pick = H.pick,
          pInt = H.pInt,
          Point = H.Point,
          Series = H.Series,
          seriesType = H.seriesType,
          seriesTypes = H.seriesTypes;
      seriesType('bubble', 'scatter', {
        dataLabels: {
          formatter: function() {
            return this.point.z;
          },
          inside: true,
          verticalAlign: 'middle'
        },
        marker: {
          radius: null,
          states: {hover: {radiusPlus: 0}},
          symbol: 'circle'
        },
        minSize: 8,
        maxSize: '20%',
        softThreshold: false,
        states: {hover: {halo: {size: 5}}},
        tooltip: {pointFormat: '({point.x}, {point.y}), Size: {point.z}'},
        turboThreshold: 0,
        zThreshold: 0,
        zoneAxis: 'z'
      }, {
        pointArrayMap: ['y', 'z'],
        parallelArrays: ['x', 'y', 'z'],
        trackerGroups: ['group', 'dataLabelsGroup'],
        specialGroup: 'group',
        bubblePadding: true,
        zoneAxis: 'z',
        directTouch: true,
        getRadii: function(zMin, zMax, minSize, maxSize) {
          var len,
              i,
              pos,
              zData = this.zData,
              radii = [],
              options = this.options,
              sizeByArea = options.sizeBy !== 'width',
              zThreshold = options.zThreshold,
              zRange = zMax - zMin,
              value,
              radius;
          for (i = 0, len = zData.length; i < len; i++) {
            value = zData[i];
            if (options.sizeByAbsoluteValue && value !== null) {
              value = Math.abs(value - zThreshold);
              zMax = Math.max(zMax - zThreshold, Math.abs(zMin - zThreshold));
              zMin = 0;
            }
            if (value === null) {
              radius = null;
            } else if (value < zMin) {
              radius = minSize / 2 - 1;
            } else {
              pos = zRange > 0 ? (value - zMin) / zRange : 0.5;
              if (sizeByArea && pos >= 0) {
                pos = Math.sqrt(pos);
              }
              radius = Math.ceil(minSize + pos * (maxSize - minSize)) / 2;
            }
            radii.push(radius);
          }
          this.radii = radii;
        },
        animate: function(init) {
          var animation = this.options.animation;
          if (!init) {
            each(this.points, function(point) {
              var graphic = point.graphic,
                  animationTarget;
              if (graphic && graphic.width) {
                animationTarget = {
                  x: graphic.x,
                  y: graphic.y,
                  width: graphic.width,
                  height: graphic.height
                };
                graphic.attr({
                  x: point.plotX,
                  y: point.plotY,
                  width: 1,
                  height: 1
                });
                graphic.animate(animationTarget, animation);
              }
            });
            this.animate = null;
          }
        },
        translate: function() {
          var i,
              data = this.data,
              point,
              radius,
              radii = this.radii;
          seriesTypes.scatter.prototype.translate.call(this);
          i = data.length;
          while (i--) {
            point = data[i];
            radius = radii ? radii[i] : 0;
            if (isNumber(radius) && radius >= this.minPxSize / 2) {
              point.marker = H.extend(point.marker, {
                radius: radius,
                width: 2 * radius,
                height: 2 * radius
              });
              point.dlBox = {
                x: point.plotX - radius,
                y: point.plotY - radius,
                width: 2 * radius,
                height: 2 * radius
              };
            } else {
              point.shapeArgs = point.plotY = point.dlBox = undefined;
            }
          }
        },
        alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
        buildKDTree: noop,
        applyZones: noop
      }, {
        haloPath: function(size) {
          return Point.prototype.haloPath.call(this, size === 0 ? 0 : (this.marker ? this.marker.radius || 0 : 0) + size);
        },
        ttBelow: false
      });
      Axis.prototype.beforePadding = function() {
        var axis = this,
            axisLength = this.len,
            chart = this.chart,
            pxMin = 0,
            pxMax = axisLength,
            isXAxis = this.isXAxis,
            dataKey = isXAxis ? 'xData' : 'yData',
            min = this.min,
            extremes = {},
            smallestSize = Math.min(chart.plotWidth, chart.plotHeight),
            zMin = Number.MAX_VALUE,
            zMax = -Number.MAX_VALUE,
            range = this.max - min,
            transA = axisLength / range,
            activeSeries = [];
        each(this.series, function(series) {
          var seriesOptions = series.options,
              zData;
          if (series.bubblePadding && (series.visible || !chart.options.chart.ignoreHiddenSeries)) {
            axis.allowZoomOutside = true;
            activeSeries.push(series);
            if (isXAxis) {
              each(['minSize', 'maxSize'], function(prop) {
                var length = seriesOptions[prop],
                    isPercent = /%$/.test(length);
                length = pInt(length);
                extremes[prop] = isPercent ? smallestSize * length / 100 : length;
              });
              series.minPxSize = extremes.minSize;
              series.maxPxSize = Math.max(extremes.maxSize, extremes.minSize);
              zData = series.zData;
              if (zData.length) {
                zMin = pick(seriesOptions.zMin, Math.min(zMin, Math.max(arrayMin(zData), seriesOptions.displayNegative === false ? seriesOptions.zThreshold : -Number.MAX_VALUE)));
                zMax = pick(seriesOptions.zMax, Math.max(zMax, arrayMax(zData)));
              }
            }
          }
        });
        each(activeSeries, function(series) {
          var data = series[dataKey],
              i = data.length,
              radius;
          if (isXAxis) {
            series.getRadii(zMin, zMax, series.minPxSize, series.maxPxSize);
          }
          if (range > 0) {
            while (i--) {
              if (isNumber(data[i]) && axis.dataMin <= data[i] && data[i] <= axis.dataMax) {
                radius = series.radii[i];
                pxMin = Math.min(((data[i] - min) * transA) - radius, pxMin);
                pxMax = Math.max(((data[i] - min) * transA) + radius, pxMax);
              }
            }
          }
        });
        if (activeSeries.length && range > 0 && !this.isLog) {
          pxMax -= axisLength;
          transA *= (axisLength + pxMin - pxMax) / axisLength;
          each([['min', 'userMin', pxMin], ['max', 'userMax', pxMax]], function(keys) {
            if (pick(axis.options[keys[0]], axis[keys[1]]) === undefined) {
              axis[keys[0]] += keys[2] / transA;
            }
          });
        }
      };
    }(Highcharts));
    (function(H) {
      var merge = H.merge,
          Point = H.Point,
          seriesType = H.seriesType,
          seriesTypes = H.seriesTypes;
      if (seriesTypes.bubble) {
        seriesType('mapbubble', 'bubble', {
          animationLimit: 500,
          tooltip: {pointFormat: '{point.name}: {point.z}'}
        }, {
          xyFromShape: true,
          type: 'mapbubble',
          pointArrayMap: ['z'],
          getMapData: seriesTypes.map.prototype.getMapData,
          getBox: seriesTypes.map.prototype.getBox,
          setData: seriesTypes.map.prototype.setData
        }, {
          applyOptions: function(options, x) {
            var point;
            if (options && options.lat !== undefined && options.lon !== undefined) {
              point = Point.prototype.applyOptions.call(this, merge(options, this.series.chart.fromLatLonToPoint(options)), x);
            } else {
              point = seriesTypes.map.prototype.pointClass.prototype.applyOptions.call(this, options, x);
            }
            return point;
          },
          isValid: function() {
            return typeof this.z === 'number';
          },
          ttBelow: false
        });
      }
    }(Highcharts));
    (function(H) {
      var colorPointMixin = H.colorPointMixin,
          colorSeriesMixin = H.colorSeriesMixin,
          each = H.each,
          LegendSymbolMixin = H.LegendSymbolMixin,
          merge = H.merge,
          noop = H.noop,
          pick = H.pick,
          Series = H.Series,
          seriesType = H.seriesType,
          seriesTypes = H.seriesTypes;
      seriesType('heatmap', 'scatter', {
        animation: false,
        borderWidth: 0,
        dataLabels: {
          formatter: function() {
            return this.point.value;
          },
          inside: true,
          verticalAlign: 'middle',
          crop: false,
          overflow: false,
          padding: 0
        },
        marker: null,
        pointRange: null,
        tooltip: {pointFormat: '{point.x}, {point.y}: {point.value}<br/>'},
        states: {hover: {
            halo: false,
            brightness: 0.2
          }}
      }, merge(colorSeriesMixin, {
        pointArrayMap: ['y', 'value'],
        hasPointSpecificOptions: true,
        getExtremesFromAll: true,
        directTouch: true,
        init: function() {
          var options;
          seriesTypes.scatter.prototype.init.apply(this, arguments);
          options = this.options;
          options.pointRange = pick(options.pointRange, options.colsize || 1);
          this.yAxis.axisPointRange = options.rowsize || 1;
        },
        translate: function() {
          var series = this,
              options = series.options,
              xAxis = series.xAxis,
              yAxis = series.yAxis,
              seriesPointPadding = options.pointPadding || 0,
              between = function(x, a, b) {
                return Math.min(Math.max(a, x), b);
              };
          series.generatePoints();
          each(series.points, function(point) {
            var xPad = (options.colsize || 1) / 2,
                yPad = (options.rowsize || 1) / 2,
                x1 = between(Math.round(xAxis.len - xAxis.translate(point.x - xPad, 0, 1, 0, 1)), -xAxis.len, 2 * xAxis.len),
                x2 = between(Math.round(xAxis.len - xAxis.translate(point.x + xPad, 0, 1, 0, 1)), -xAxis.len, 2 * xAxis.len),
                y1 = between(Math.round(yAxis.translate(point.y - yPad, 0, 1, 0, 1)), -yAxis.len, 2 * yAxis.len),
                y2 = between(Math.round(yAxis.translate(point.y + yPad, 0, 1, 0, 1)), -yAxis.len, 2 * yAxis.len),
                pointPadding = pick(point.pointPadding, seriesPointPadding);
            point.plotX = point.clientX = (x1 + x2) / 2;
            point.plotY = (y1 + y2) / 2;
            point.shapeType = 'rect';
            point.shapeArgs = {
              x: Math.min(x1, x2) + pointPadding,
              y: Math.min(y1, y2) + pointPadding,
              width: Math.abs(x2 - x1) - pointPadding * 2,
              height: Math.abs(y2 - y1) - pointPadding * 2
            };
          });
          series.translateColors();
        },
        drawPoints: function() {
          seriesTypes.column.prototype.drawPoints.call(this);
          each(this.points, function(point) {
            point.graphic.css(this.colorAttribs(point));
          }, this);
        },
        animate: noop,
        getBox: noop,
        drawLegendSymbol: LegendSymbolMixin.drawRectangle,
        alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
        getExtremes: function() {
          Series.prototype.getExtremes.call(this, this.valueData);
          this.valueMin = this.dataMin;
          this.valueMax = this.dataMax;
          Series.prototype.getExtremes.call(this);
        }
      }), H.extend({haloPath: function(size) {
          if (!size) {
            return [];
          }
          var rect = this.shapeArgs;
          return ['M', rect.x - size, rect.y - size, 'L', rect.x - size, rect.y + rect.height + size, rect.x + rect.width + size, rect.y + rect.height + size, rect.x + rect.width + size, rect.y - size, 'Z'];
        }}, colorPointMixin));
    }(Highcharts));
    (function(H) {
      var Chart = H.Chart,
          each = H.each,
          extend = H.extend,
          format = H.format,
          merge = H.merge,
          win = H.win,
          wrap = H.wrap;
      function pointInPolygon(point, polygon) {
        var i,
            j,
            rel1,
            rel2,
            c = false,
            x = point.x,
            y = point.y;
        for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          rel1 = polygon[i][1] > y;
          rel2 = polygon[j][1] > y;
          if (rel1 !== rel2 && (x < (polygon[j][0] - polygon[i][0]) * (y - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0])) {
            c = !c;
          }
        }
        return c;
      }
      Chart.prototype.transformFromLatLon = function(latLon, transform) {
        if (win.proj4 === undefined) {
          H.error(21);
          return {
            x: 0,
            y: null
          };
        }
        var projected = win.proj4(transform.crs, [latLon.lon, latLon.lat]),
            cosAngle = transform.cosAngle || (transform.rotation && Math.cos(transform.rotation)),
            sinAngle = transform.sinAngle || (transform.rotation && Math.sin(transform.rotation)),
            rotated = transform.rotation ? [projected[0] * cosAngle + projected[1] * sinAngle, -projected[0] * sinAngle + projected[1] * cosAngle] : projected;
        return {
          x: ((rotated[0] - (transform.xoffset || 0)) * (transform.scale || 1) + (transform.xpan || 0)) * (transform.jsonres || 1) + (transform.jsonmarginX || 0),
          y: (((transform.yoffset || 0) - rotated[1]) * (transform.scale || 1) + (transform.ypan || 0)) * (transform.jsonres || 1) - (transform.jsonmarginY || 0)
        };
      };
      Chart.prototype.transformToLatLon = function(point, transform) {
        if (win.proj4 === undefined) {
          H.error(21);
          return;
        }
        var normalized = {
          x: ((point.x - (transform.jsonmarginX || 0)) / (transform.jsonres || 1) - (transform.xpan || 0)) / (transform.scale || 1) + (transform.xoffset || 0),
          y: ((-point.y - (transform.jsonmarginY || 0)) / (transform.jsonres || 1) + (transform.ypan || 0)) / (transform.scale || 1) + (transform.yoffset || 0)
        },
            cosAngle = transform.cosAngle || (transform.rotation && Math.cos(transform.rotation)),
            sinAngle = transform.sinAngle || (transform.rotation && Math.sin(transform.rotation)),
            projected = win.proj4(transform.crs, 'WGS84', transform.rotation ? {
              x: normalized.x * cosAngle + normalized.y * -sinAngle,
              y: normalized.x * sinAngle + normalized.y * cosAngle
            } : normalized);
        return {
          lat: projected.y,
          lon: projected.x
        };
      };
      Chart.prototype.fromPointToLatLon = function(point) {
        var transforms = this.mapTransforms,
            transform;
        if (!transforms) {
          H.error(22);
          return;
        }
        for (transform in transforms) {
          if (transforms.hasOwnProperty(transform) && transforms[transform].hitZone && pointInPolygon({
            x: point.x,
            y: -point.y
          }, transforms[transform].hitZone.coordinates[0])) {
            return this.transformToLatLon(point, transforms[transform]);
          }
        }
        return this.transformToLatLon(point, transforms['default']);
      };
      Chart.prototype.fromLatLonToPoint = function(latLon) {
        var transforms = this.mapTransforms,
            transform,
            coords;
        if (!transforms) {
          H.error(22);
          return {
            x: 0,
            y: null
          };
        }
        for (transform in transforms) {
          if (transforms.hasOwnProperty(transform) && transforms[transform].hitZone) {
            coords = this.transformFromLatLon(latLon, transforms[transform]);
            if (pointInPolygon({
              x: coords.x,
              y: -coords.y
            }, transforms[transform].hitZone.coordinates[0])) {
              return coords;
            }
          }
        }
        return this.transformFromLatLon(latLon, transforms['default']);
      };
      H.geojson = function(geojson, hType, series) {
        var mapData = [],
            path = [],
            polygonToPath = function(polygon) {
              var i,
                  len = polygon.length;
              path.push('M');
              for (i = 0; i < len; i++) {
                if (i === 1) {
                  path.push('L');
                }
                path.push(polygon[i][0], -polygon[i][1]);
              }
            };
        hType = hType || 'map';
        each(geojson.features, function(feature) {
          var geometry = feature.geometry,
              type = geometry.type,
              coordinates = geometry.coordinates,
              properties = feature.properties,
              point;
          path = [];
          if (hType === 'map' || hType === 'mapbubble') {
            if (type === 'Polygon') {
              each(coordinates, polygonToPath);
              path.push('Z');
            } else if (type === 'MultiPolygon') {
              each(coordinates, function(items) {
                each(items, polygonToPath);
              });
              path.push('Z');
            }
            if (path.length) {
              point = {path: path};
            }
          } else if (hType === 'mapline') {
            if (type === 'LineString') {
              polygonToPath(coordinates);
            } else if (type === 'MultiLineString') {
              each(coordinates, polygonToPath);
            }
            if (path.length) {
              point = {path: path};
            }
          } else if (hType === 'mappoint') {
            if (type === 'Point') {
              point = {
                x: coordinates[0],
                y: -coordinates[1]
              };
            }
          }
          if (point) {
            mapData.push(extend(point, {
              name: properties.name || properties.NAME,
              properties: properties
            }));
          }
        });
        if (series && geojson.copyrightShort) {
          series.chart.mapCredits = format(series.chart.options.credits.mapText, {geojson: geojson});
          series.chart.mapCreditsFull = format(series.chart.options.credits.mapTextFull, {geojson: geojson});
        }
        return mapData;
      };
      wrap(Chart.prototype, 'addCredits', function(proceed, credits) {
        credits = merge(true, this.options.credits, credits);
        if (this.mapCredits) {
          credits.href = null;
        }
        proceed.call(this, credits);
        if (this.credits && this.mapCreditsFull) {
          this.credits.attr({title: this.mapCreditsFull});
        }
      });
    }(Highcharts));
    (function(H) {
      var Chart = H.Chart,
          defaultOptions = H.defaultOptions,
          each = H.each,
          extend = H.extend,
          merge = H.merge,
          pick = H.pick,
          Renderer = H.Renderer,
          SVGRenderer = H.SVGRenderer,
          VMLRenderer = H.VMLRenderer;
      extend(defaultOptions.lang, {
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out'
      });
      defaultOptions.mapNavigation = {
        buttonOptions: {
          alignTo: 'plotBox',
          align: 'left',
          verticalAlign: 'top',
          x: 0,
          width: 18,
          height: 18,
          padding: 5
        },
        buttons: {
          zoomIn: {
            onclick: function() {
              this.mapZoom(0.5);
            },
            text: '+',
            y: 0
          },
          zoomOut: {
            onclick: function() {
              this.mapZoom(2);
            },
            text: '-',
            y: 28
          }
        },
        mouseWheelSensitivity: 1.1
      };
      H.splitPath = function(path) {
        var i;
        path = path.replace(/([A-Za-z])/g, ' $1 ');
        path = path.replace(/^\s*/, '').replace(/\s*$/, '');
        path = path.split(/[ ,]+/);
        for (i = 0; i < path.length; i++) {
          if (!/[a-zA-Z]/.test(path[i])) {
            path[i] = parseFloat(path[i]);
          }
        }
        return path;
      };
      H.maps = {};
      function selectiveRoundedRect(x, y, w, h, rTopLeft, rTopRight, rBottomRight, rBottomLeft) {
        return ['M', x + rTopLeft, y, 'L', x + w - rTopRight, y, 'C', x + w - rTopRight / 2, y, x + w, y + rTopRight / 2, x + w, y + rTopRight, 'L', x + w, y + h - rBottomRight, 'C', x + w, y + h - rBottomRight / 2, x + w - rBottomRight / 2, y + h, x + w - rBottomRight, y + h, 'L', x + rBottomLeft, y + h, 'C', x + rBottomLeft / 2, y + h, x, y + h - rBottomLeft / 2, x, y + h - rBottomLeft, 'L', x, y + rTopLeft, 'C', x, y + rTopLeft / 2, x + rTopLeft / 2, y, x + rTopLeft, y, 'Z'];
      }
      SVGRenderer.prototype.symbols.topbutton = function(x, y, w, h, attr) {
        return selectiveRoundedRect(x - 1, y - 1, w, h, attr.r, attr.r, 0, 0);
      };
      SVGRenderer.prototype.symbols.bottombutton = function(x, y, w, h, attr) {
        return selectiveRoundedRect(x - 1, y - 1, w, h, 0, 0, attr.r, attr.r);
      };
      if (Renderer === VMLRenderer) {
        each(['topbutton', 'bottombutton'], function(shape) {
          VMLRenderer.prototype.symbols[shape] = SVGRenderer.prototype.symbols[shape];
        });
      }
      H.Map = H.mapChart = function(a, b, c) {
        var hasRenderToArg = typeof a === 'string' || a.nodeName,
            options = arguments[hasRenderToArg ? 1 : 0],
            hiddenAxis = {
              endOnTick: false,
              visible: false,
              minPadding: 0,
              maxPadding: 0,
              startOnTick: false
            },
            seriesOptions,
            defaultCreditsOptions = H.getOptions().credits;
        seriesOptions = options.series;
        options.series = null;
        options = merge({
          chart: {
            panning: 'xy',
            type: 'map'
          },
          credits: {
            mapText: pick(defaultCreditsOptions.mapText, ' \u00a9 <a href="{geojson.copyrightUrl}">' + '{geojson.copyrightShort}</a>'),
            mapTextFull: pick(defaultCreditsOptions.mapTextFull, '{geojson.copyright}')
          },
          tooltip: {followTouchMove: false},
          xAxis: hiddenAxis,
          yAxis: merge(hiddenAxis, {reversed: true})
        }, options, {chart: {
            inverted: false,
            alignTicks: false
          }});
        options.series = seriesOptions;
        return hasRenderToArg ? new Chart(a, options, c) : new Chart(options, b);
      };
    }(Highcharts));
    (function() {}());
    return Highcharts;
  }));
})(require('process'));
