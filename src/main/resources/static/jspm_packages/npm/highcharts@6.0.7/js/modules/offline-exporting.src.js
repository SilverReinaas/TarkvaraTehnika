/* */ 
(function(process) {
  'use strict';
  (function(factory) {
    if (typeof module === 'object' && module.exports) {
      module.exports = factory;
    } else {
      factory(Highcharts);
    }
  }(function(Highcharts) {
    (function(Highcharts) {
      var merge = Highcharts.merge,
          win = Highcharts.win,
          nav = win.navigator,
          doc = win.document,
          each = Highcharts.each,
          domurl = win.URL || win.webkitURL || win,
          isMSBrowser = /Edge\/|Trident\/|MSIE /.test(nav.userAgent),
          isEdgeBrowser = /Edge\/\d+/.test(nav.userAgent),
          loadEventDeferDelay = isMSBrowser ? 150 : 0;
      Highcharts.CanVGRenderer = {};
      function getScript(scriptLocation, callback) {
        var head = doc.getElementsByTagName('head')[0],
            script = doc.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptLocation;
        script.onload = callback;
        script.onerror = function() {
          Highcharts.error('Error loading script ' + scriptLocation);
        };
        head.appendChild(script);
      }
      Highcharts.dataURLtoBlob = function(dataURL) {
        if (win.atob && win.ArrayBuffer && win.Uint8Array && win.Blob && domurl.createObjectURL) {
          var parts = dataURL.match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/),
              binStr = win.atob(parts[3]),
              buf = new win.ArrayBuffer(binStr.length),
              binary = new win.Uint8Array(buf),
              blob;
          for (var i = 0; i < binary.length; ++i) {
            binary[i] = binStr.charCodeAt(i);
          }
          blob = new win.Blob([binary], {'type': parts[1]});
          return domurl.createObjectURL(blob);
        }
      };
      Highcharts.downloadURL = function(dataURL, filename) {
        var a = doc.createElement('a'),
            windowRef;
        if (typeof dataURL !== 'string' && !(dataURL instanceof String) && nav.msSaveOrOpenBlob) {
          nav.msSaveOrOpenBlob(dataURL, filename);
          return;
        }
        if (isEdgeBrowser || dataURL.length > 2000000) {
          dataURL = Highcharts.dataURLtoBlob(dataURL);
          if (!dataURL) {
            throw 'Data URL length limit reached';
          }
        }
        if (a.download !== undefined) {
          a.href = dataURL;
          a.download = filename;
          doc.body.appendChild(a);
          a.click();
          doc.body.removeChild(a);
        } else {
          try {
            windowRef = win.open(dataURL, 'chart');
            if (windowRef === undefined || windowRef === null) {
              throw 'Failed to open window';
            }
          } catch (e) {
            win.location.href = dataURL;
          }
        }
      };
      Highcharts.svgToDataUrl = function(svg) {
        var webKit = (nav.userAgent.indexOf('WebKit') > -1 && nav.userAgent.indexOf('Chrome') < 0);
        try {
          if (!webKit && nav.userAgent.toLowerCase().indexOf('firefox') < 0) {
            return domurl.createObjectURL(new win.Blob([svg], {type: 'image/svg+xml;charset-utf-16'}));
          }
        } catch (e) {}
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
      };
      Highcharts.imageToDataUrl = function(imageURL, imageType, callbackArgs, scale, successCallback, taintedCallback, noCanvasSupportCallback, failedLoadCallback, finallyCallback) {
        var img = new win.Image(),
            taintedHandler,
            loadHandler = function() {
              setTimeout(function() {
                var canvas = doc.createElement('canvas'),
                    ctx = canvas.getContext && canvas.getContext('2d'),
                    dataURL;
                try {
                  if (!ctx) {
                    noCanvasSupportCallback(imageURL, imageType, callbackArgs, scale);
                  } else {
                    canvas.height = img.height * scale;
                    canvas.width = img.width * scale;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    try {
                      dataURL = canvas.toDataURL(imageType);
                      successCallback(dataURL, imageType, callbackArgs, scale);
                    } catch (e) {
                      taintedHandler(imageURL, imageType, callbackArgs, scale);
                    }
                  }
                } finally {
                  if (finallyCallback) {
                    finallyCallback(imageURL, imageType, callbackArgs, scale);
                  }
                }
              }, loadEventDeferDelay);
            },
            errorHandler = function() {
              failedLoadCallback(imageURL, imageType, callbackArgs, scale);
              if (finallyCallback) {
                finallyCallback(imageURL, imageType, callbackArgs, scale);
              }
            };
        taintedHandler = function() {
          img = new win.Image();
          taintedHandler = taintedCallback;
          img.crossOrigin = 'Anonymous';
          img.onload = loadHandler;
          img.onerror = errorHandler;
          img.src = imageURL;
        };
        img.onload = loadHandler;
        img.onerror = errorHandler;
        img.src = imageURL;
      };
      Highcharts.downloadSVGLocal = function(svg, options, failCallback, successCallback) {
        var svgurl,
            blob,
            objectURLRevoke = true,
            finallyHandler,
            libURL = options.libURL || Highcharts.getOptions().exporting.libURL,
            dummySVGContainer = doc.createElement('div'),
            imageType = options.type || 'image/png',
            filename = ((options.filename || 'chart') + '.' + (imageType === 'image/svg+xml' ? 'svg' : imageType.split('/')[1])),
            scale = options.scale || 1;
        libURL = libURL.slice(-1) !== '/' ? libURL + '/' : libURL;
        function svgToPdf(svgElement, margin) {
          var width = svgElement.width.baseVal.value + 2 * margin,
              height = svgElement.height.baseVal.value + 2 * margin,
              pdf = new win.jsPDF('l', 'pt', [width, height]);
          each(svgElement.querySelectorAll('*[visibility="hidden"]'), function(node) {
            node.parentNode.removeChild(node);
          });
          win.svg2pdf(svgElement, pdf, {removeInvalid: true});
          return pdf.output('datauristring');
        }
        function downloadPDF() {
          dummySVGContainer.innerHTML = svg;
          var textElements = dummySVGContainer.getElementsByTagName('text'),
              titleElements,
              svgData,
              setStylePropertyFromParents = function(el, propName) {
                var curParent = el;
                while (curParent && curParent !== dummySVGContainer) {
                  if (curParent.style[propName]) {
                    el.style[propName] = curParent.style[propName];
                    break;
                  }
                  curParent = curParent.parentNode;
                }
              };
          each(textElements, function(el) {
            each(['font-family', 'font-size'], function(property) {
              setStylePropertyFromParents(el, property);
            });
            el.style['font-family'] = (el.style['font-family'] && el.style['font-family'].split(' ').splice(-1));
            titleElements = el.getElementsByTagName('title');
            each(titleElements, function(titleElement) {
              el.removeChild(titleElement);
            });
          });
          svgData = svgToPdf(dummySVGContainer.firstChild, 0);
          try {
            Highcharts.downloadURL(svgData, filename);
            if (successCallback) {
              successCallback();
            }
          } catch (e) {
            failCallback();
          }
        }
        if (imageType === 'image/svg+xml') {
          try {
            if (nav.msSaveOrOpenBlob) {
              blob = new MSBlobBuilder();
              blob.append(svg);
              svgurl = blob.getBlob('image/svg+xml');
            } else {
              svgurl = Highcharts.svgToDataUrl(svg);
            }
            Highcharts.downloadURL(svgurl, filename);
            if (successCallback) {
              successCallback();
            }
          } catch (e) {
            failCallback();
          }
        } else if (imageType === 'application/pdf') {
          if (win.jsPDF && win.svg2pdf) {
            downloadPDF();
          } else {
            objectURLRevoke = true;
            getScript(libURL + 'jspdf.js', function() {
              getScript(libURL + 'svg2pdf.js', function() {
                downloadPDF();
              });
            });
          }
        } else {
          svgurl = Highcharts.svgToDataUrl(svg);
          finallyHandler = function() {
            try {
              domurl.revokeObjectURL(svgurl);
            } catch (e) {}
          };
          Highcharts.imageToDataUrl(svgurl, imageType, {}, scale, function(imageURL) {
            try {
              Highcharts.downloadURL(imageURL, filename);
              if (successCallback) {
                successCallback();
              }
            } catch (e) {
              failCallback();
            }
          }, function() {
            var canvas = doc.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                imageWidth = svg.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * scale,
                imageHeight = svg.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * scale,
                downloadWithCanVG = function() {
                  ctx.drawSvg(svg, 0, 0, imageWidth, imageHeight);
                  try {
                    Highcharts.downloadURL(nav.msSaveOrOpenBlob ? canvas.msToBlob() : canvas.toDataURL(imageType), filename);
                    if (successCallback) {
                      successCallback();
                    }
                  } catch (e) {
                    failCallback();
                  } finally {
                    finallyHandler();
                  }
                };
            canvas.width = imageWidth;
            canvas.height = imageHeight;
            if (win.canvg) {
              downloadWithCanVG();
            } else {
              objectURLRevoke = true;
              getScript(libURL + 'rgbcolor.js', function() {
                getScript(libURL + 'canvg.js', function() {
                  downloadWithCanVG();
                });
              });
            }
          }, failCallback, failCallback, function() {
            if (objectURLRevoke) {
              finallyHandler();
            }
          });
        }
      };
      Highcharts.Chart.prototype.getSVGForLocalExport = function(options, chartOptions, failCallback, successCallback) {
        var chart = this,
            images,
            imagesEmbedded = 0,
            chartCopyContainer,
            chartCopyOptions,
            el,
            i,
            l,
            sanitize = function(svg) {
              return chart.sanitizeSVG(svg, chartCopyOptions);
            },
            embeddedSuccess = function(imageURL, imageType, callbackArgs) {
              ++imagesEmbedded;
              callbackArgs.imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageURL);
              if (imagesEmbedded === images.length) {
                successCallback(sanitize(chartCopyContainer.innerHTML));
              }
            };
        Highcharts.wrap(Highcharts.Chart.prototype, 'getChartHTML', function(proceed) {
          var ret = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
          chartCopyOptions = this.options;
          chartCopyContainer = this.container.cloneNode(true);
          return ret;
        });
        chart.getSVGForExport(options, chartOptions);
        images = chartCopyContainer.getElementsByTagName('image');
        try {
          if (!images.length) {
            successCallback(sanitize(chartCopyContainer.innerHTML));
            return;
          }
          for (i = 0, l = images.length; i < l; ++i) {
            el = images[i];
            Highcharts.imageToDataUrl(el.getAttributeNS('http://www.w3.org/1999/xlink', 'href'), 'image/png', {imageElement: el}, options.scale, embeddedSuccess, failCallback, failCallback, failCallback);
          }
        } catch (e) {
          failCallback();
        }
      };
      Highcharts.Chart.prototype.exportChartLocal = function(exportingOptions, chartOptions) {
        var chart = this,
            options = Highcharts.merge(chart.options.exporting, exportingOptions),
            fallbackToExportServer = function() {
              if (options.fallbackToExportServer === false) {
                if (options.error) {
                  options.error(options);
                } else {
                  throw 'Fallback to export server disabled';
                }
              } else {
                chart.exportChart(options);
              }
            },
            svgSuccess = function(svg) {
              if (svg.indexOf('<foreignObject') > -1 && options.type !== 'image/svg+xml') {
                fallbackToExportServer();
              } else {
                Highcharts.downloadSVGLocal(svg, options, fallbackToExportServer);
              }
            };
        if (isMSBrowser) {
          Highcharts.SVGRenderer.prototype.inlineWhitelist = [/^blockSize/, /^border/, /^caretColor/, /^color/, /^columnRule/, /^columnRuleColor/, /^cssFloat/, /^cursor/, /^fill$/, /^fillOpacity/, /^font/, /^inlineSize/, /^length/, /^lineHeight/, /^opacity/, /^outline/, /^parentRule/, /^rx$/, /^ry$/, /^stroke/, /^textAlign/, /^textAnchor/, /^textDecoration/, /^transform/, /^vectorEffect/, /^visibility/, /^x$/, /^y$/];
        }
        if ((isMSBrowser && (options.type === 'application/pdf' || chart.container.getElementsByTagName('image').length && options.type !== 'image/svg+xml')) || (options.type === 'application/pdf' && chart.container.getElementsByTagName('image').length)) {
          fallbackToExportServer();
          return;
        }
        chart.getSVGForLocalExport(options, chartOptions, fallbackToExportServer, svgSuccess);
      };
      merge(true, Highcharts.getOptions().exporting, {
        libURL: 'https://code.highcharts.com/6.0.7/lib/',
        menuItemDefinitions: {
          downloadPNG: {
            textKey: 'downloadPNG',
            onclick: function() {
              this.exportChartLocal();
            }
          },
          downloadJPEG: {
            textKey: 'downloadJPEG',
            onclick: function() {
              this.exportChartLocal({type: 'image/jpeg'});
            }
          },
          downloadSVG: {
            textKey: 'downloadSVG',
            onclick: function() {
              this.exportChartLocal({type: 'image/svg+xml'});
            }
          },
          downloadPDF: {
            textKey: 'downloadPDF',
            onclick: function() {
              this.exportChartLocal({type: 'application/pdf'});
            }
          }
        }
      });
    }(Highcharts));
  }));
})(require('process'));
