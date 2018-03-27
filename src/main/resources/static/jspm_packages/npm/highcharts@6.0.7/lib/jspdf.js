/* */ 
"format cjs";
(function(process) {
  !function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.jspdf = e();
  }(this, function() {
    "use strict";
    var t = {};
    t["typeof"] = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
      return typeof t;
    } : function(t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    };
    var e = function(e) {
      function n(t) {
        var n = {};
        this.subscribe = function(t, e, r) {
          if ("function" != typeof e)
            return !1;
          n.hasOwnProperty(t) || (n[t] = {});
          var i = Math.random().toString(35);
          return n[t][i] = [e, !!r], i;
        }, this.unsubscribe = function(t) {
          for (var e in n)
            if (n[e][t])
              return delete n[e][t], !0;
          return !1;
        }, this.publish = function(r) {
          if (n.hasOwnProperty(r)) {
            var i = Array.prototype.slice.call(arguments, 1),
                o = [];
            for (var a in n[r]) {
              var s = n[r][a];
              try {
                s[0].apply(t, i);
              } catch (c) {
                e.console && console.error("jsPDF PubSub Error", c.message, c);
              }
              s[1] && o.push(a);
            }
            o.length && o.forEach(this.unsubscribe);
          }
        };
      }
      function o(u, l, h, f) {
        var d = {};
        "object" === ("undefined" == typeof u ? "undefined" : t["typeof"](u)) && (d = u, u = d.orientation, l = d.unit || l, h = d.format || h, f = d.compress || d.compressPdf || f), l = l || "mm", h = h || "a4", u = ("" + (u || "P")).toLowerCase();
        var p,
            m,
            g,
            w,
            y,
            v,
            b,
            x,
            k,
            S,
            C,
            A = (("" + h).toLowerCase(), !!f && "function" == typeof Uint8Array),
            q = d.textColor || "0 g",
            _ = d.drawColor || "0 G",
            P = d.fontSize || 16,
            T = d.lineHeight || 1.15,
            E = d.lineWidth || .200025,
            I = 2,
            O = !1,
            F = [],
            B = {},
            R = {},
            j = [],
            D = {},
            N = {},
            z = {},
            L = {},
            M = null,
            U = 0,
            H = [],
            W = [],
            X = [],
            V = [],
            Y = [],
            G = 0,
            J = 0,
            Q = 0,
            K = {},
            $ = {},
            Z = [],
            tt = {
              title: "",
              subject: "",
              author: "",
              keywords: "",
              creator: ""
            },
            et = {},
            nt = new n(et),
            rt = function(t) {
              return t.toFixed(2);
            },
            it = function(t) {
              return t.toFixed(3);
            },
            ot = function(t) {
              return ("0" + parseInt(t)).slice(-2);
            },
            at = function(t) {
              var e = "00" + t;
              return e.substr(e.length - 2);
            },
            st = function(t) {
              O ? H[g].push(t) : (Q += t.length + 1, V.push(t));
            },
            ct = function() {
              return I++, F[I] = Q, st(I + " 0 obj"), I;
            },
            ut = function() {
              var t = 2 * H.length + 1;
              t += Y.length;
              var e = {
                objId: t,
                content: ""
              };
              return Y.push(e), e;
            },
            lt = function() {
              return I++, F[I] = function() {
                return Q;
              }, I;
            },
            ht = function(t) {
              F[t] = Q;
            },
            ft = function(t) {
              st("stream"), st(t), st("endstream");
            },
            dt = function() {
              var t,
                  n,
                  r,
                  i,
                  s,
                  c,
                  u,
                  l,
                  h;
              for (u = e.adler32cs || o.adler32cs, A && "undefined" == typeof u && (A = !1), t = 1; U >= t; t++) {
                if (ct(), l = (b = X[t].width) * m, h = (x = X[t].height) * m, st("<</Type /Page"), st("/Parent 1 0 R"), st("/Resources 2 0 R"), st("/MediaBox [0 0 " + rt(l) + " " + rt(h) + "]"), nt.publish("putPage", {
                  pageNumber: t,
                  page: H[t]
                }), st("/Contents " + (I + 1) + " 0 R"), st(">>"), st("endobj"), n = H[t].join("\n"), n = new Rt(m, 0, 0, -m, 0, x).toString() + " cm\n" + n, ct(), A) {
                  for (r = [], i = n.length; i--; )
                    r[i] = n.charCodeAt(i);
                  c = u.from(n), s = new a(6), s.append(new Uint8Array(r)), n = s.flush(), r = new Uint8Array(n.length + 6), r.set(new Uint8Array([120, 156])), r.set(n, 2), r.set(new Uint8Array([255 & c, c >> 8 & 255, c >> 16 & 255, c >> 24 & 255]), n.length + 2), n = String.fromCharCode.apply(null, r), st("<</Length " + n.length + " /Filter [/FlateDecode]>>");
                } else
                  st("<</Length " + n.length + ">>");
                ft(n), st("endobj");
              }
              F[1] = Q, st("1 0 obj"), st("<</Type /Pages");
              var f = "/Kids [";
              for (i = 0; U > i; i++)
                f += 3 + 2 * i + " 0 R ";
              st(f + "]"), st("/Count " + U), st(">>"), st("endobj"), nt.publish("postPutPages");
            },
            pt = function(t) {
              t.objectNumber = ct(), st("<</BaseFont/" + t.PostScriptName + "/Type/Font"), "string" == typeof t.encoding && st("/Encoding/" + t.encoding), st("/Subtype/Type1>>"), st("endobj");
            },
            mt = function() {
              for (var t in B)
                B.hasOwnProperty(t) && pt(B[t]);
            },
            gt = function(t) {
              t.objectNumber = ct(), st("<<"), st("/Type /XObject"), st("/Subtype /Form"), st("/BBox [" + [rt(t.x), rt(t.y), rt(t.x + t.width), rt(t.y + t.height)].join(" ") + "]"), st("/Matrix [" + t.matrix.toString() + "]");
              var e = t.pages[1].join("\n");
              st("/Length " + e.length), st(">>"), ft(e), st("endobj");
            },
            wt = function() {
              for (var t in K)
                K.hasOwnProperty(t) && gt(K[t]);
            },
            yt = function(t, e) {
              var n,
                  r = [],
                  i = 1 / (e - 1);
              for (n = 0; 1 > n; n += i)
                r.push(n);
              if (r.push(1), 0 != t[0].offset) {
                var o = {
                  offset: 0,
                  color: t[0].color
                };
                t.unshift(o);
              }
              if (1 != t[t.length - 1].offset) {
                var a = {
                  offset: 1,
                  color: t[t.length - 1].color
                };
                t.push(a);
              }
              for (var s = "",
                  c = 0,
                  u = 0; u < r.length; u++) {
                for (n = r[u]; n > t[c + 1].offset; )
                  c++;
                var l = t[c].offset,
                    h = t[c + 1].offset,
                    f = (n - l) / (h - l),
                    d = t[c].color,
                    p = t[c + 1].color;
                s += at(Math.round((1 - f) * d[0] + f * p[0]).toString(16)) + at(Math.round((1 - f) * d[1] + f * p[1]).toString(16)) + at(Math.round((1 - f) * d[2] + f * p[2]).toString(16));
              }
              return s.trim();
            },
            vt = function(t, e) {
              e || (e = 21);
              var n = ct(),
                  r = yt(t.colors, e);
              st("<< /FunctionType 0"), st("/Domain [0.0 1.0]"), st("/Size [" + e + "]"), st("/BitsPerSample 8"), st("/Range [0.0 1.0 0.0 1.0 0.0 1.0]"), st("/Decode [0.0 1.0 0.0 1.0 0.0 1.0]"), st("/Length " + r.length), st("/Filter /ASCIIHexDecode"), st(">>"), ft(r), st("endobj"), t.objectNumber = ct(), st("<< /ShadingType " + t.type), st("/ColorSpace /DeviceRGB");
              var i = "/Coords [" + it(parseFloat(t.coords[0])) + " " + it(parseFloat(t.coords[1])) + " ";
              i += 2 === t.type ? it(parseFloat(t.coords[2])) + " " + it(parseFloat(t.coords[3])) : it(parseFloat(t.coords[2])) + " " + it(parseFloat(t.coords[3])) + " " + it(parseFloat(t.coords[4])) + " " + it(parseFloat(t.coords[5])), i += "]", st(i), t.matrix && st("/Matrix [" + t.matrix.toString() + "]"), st("/Function " + n + " 0 R"), st("/Extend [true true]"), st(">>"), st("endobj");
            },
            bt = function(t) {
              var e = ct();
              st("<<"), Pt(), st(">>"), st("endobj"), t.objectNumber = ct(), st("<< /Type /Pattern"), st("/PatternType 1"), st("/PaintType 1"), st("/TilingType 1"), st("/BBox [" + t.boundingBox.map(it).join(" ") + "]"), st("/XStep " + it(t.xStep)), st("/YStep " + it(t.yStep)), st("/Length " + t.stream.length), st("/Resources " + e + " 0 R"), t.matrix && st("/Matrix [" + t.matrix.toString() + "]"), st(">>"), ft(t.stream), st("endobj");
            },
            xt = function() {
              var t;
              for (t in D)
                D.hasOwnProperty(t) && (D[t] instanceof et.ShadingPattern ? vt(D[t]) : D[t] instanceof et.TilingPattern && bt(D[t]));
            },
            kt = function(t) {
              t.objectNumber = ct(), st("<<");
              for (var e in t)
                switch (e) {
                  case "opacity":
                    st("/ca " + rt(t[e]));
                }
              st(">>"), st("endobj");
            },
            St = function() {
              var t;
              for (t in z)
                z.hasOwnProperty(t) && kt(z[t]);
            },
            Ct = function() {
              for (var t in K)
                K.hasOwnProperty(t) && K[t].objectNumber >= 0 && st("/" + t + " " + K[t].objectNumber + " 0 R");
              nt.publish("putXobjectDict");
            },
            At = function() {
              for (var t in D)
                D.hasOwnProperty(t) && D[t] instanceof et.ShadingPattern && D[t].objectNumber >= 0 && st("/" + t + " " + D[t].objectNumber + " 0 R");
              nt.publish("putShadingPatternDict");
            },
            qt = function() {
              for (var t in D)
                D.hasOwnProperty(t) && D[t] instanceof et.TilingPattern && D[t].objectNumber >= 0 && st("/" + t + " " + D[t].objectNumber + " 0 R");
              nt.publish("putTilingPatternDict");
            },
            _t = function() {
              var t;
              for (t in z)
                z.hasOwnProperty(t) && z[t].objectNumber >= 0 && st("/" + t + " " + z[t].objectNumber + " 0 R");
              nt.publish("putGStateDict");
            },
            Pt = function() {
              st("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"), st("/Font <<");
              for (var t in B)
                B.hasOwnProperty(t) && st("/" + t + " " + B[t].objectNumber + " 0 R");
              st(">>"), st("/Shading <<"), At(), st(">>"), st("/Pattern <<"), qt(), st(">>"), st("/ExtGState <<"), _t(), st(">>"), st("/XObject <<"), Ct(), st(">>");
            },
            Tt = function() {
              mt(), St(), wt(), xt(), nt.publish("putResources"), F[2] = Q, st("2 0 obj"), st("<<"), Pt(), st(">>"), st("endobj"), nt.publish("postPutResources");
            },
            Et = function() {
              nt.publish("putAdditionalObjects");
              for (var t = 0; t < Y.length; t++) {
                var e = Y[t];
                F[e.objId] = Q, st(e.objId + " 0 obj"), st(e.content), st("endobj");
              }
              I += Y.length, nt.publish("postPutAdditionalObjects");
            },
            It = function(t, e, n) {
              R.hasOwnProperty(e) || (R[e] = {}), R[e][n] = t;
            },
            Ot = function(t, e, n, r) {
              var i = "F" + (Object.keys(B).length + 1).toString(10),
                  o = B[i] = {
                    id: i,
                    PostScriptName: t,
                    fontName: e,
                    fontStyle: n,
                    encoding: r,
                    metadata: {}
                  };
              return It(i, e, n), nt.publish("addFont", o), i;
            },
            Ft = function() {
              for (var t = "helvetica",
                  e = "times",
                  n = "courier",
                  r = "normal",
                  i = "bold",
                  o = "italic",
                  a = "bolditalic",
                  s = "StandardEncoding",
                  c = "zapfdingbats",
                  u = [["Helvetica", t, r], ["Helvetica-Bold", t, i], ["Helvetica-Oblique", t, o], ["Helvetica-BoldOblique", t, a], ["Courier", n, r], ["Courier-Bold", n, i], ["Courier-Oblique", n, o], ["Courier-BoldOblique", n, a], ["Times-Roman", e, r], ["Times-Bold", e, i], ["Times-Italic", e, o], ["Times-BoldItalic", e, a], ["ZapfDingbats", c]],
                  l = 0,
                  h = u.length; h > l; l++) {
                var f = Ot(u[l][0], u[l][1], u[l][2], s),
                    d = u[l][0].split("-");
                It(f, d[0], d[1] || "");
              }
              nt.publish("addFonts", {
                fonts: B,
                dictionary: R
              });
            },
            Bt = function(t, e) {
              return new Rt(t.a * e.a + t.b * e.c, t.a * e.b + t.b * e.d, t.c * e.a + t.d * e.c, t.c * e.b + t.d * e.d, t.e * e.a + t.f * e.c + e.e, t.e * e.b + t.f * e.d + e.f);
            },
            Rt = function(t, e, n, r, i, o) {
              this.a = t, this.b = e, this.c = n, this.d = r, this.e = i, this.f = o;
            };
        Rt.prototype = {toString: function() {
            return [it(this.a), it(this.b), it(this.c), it(this.d), it(this.e), it(this.f)].join(" ");
          }};
        var jt = new Rt(1, 0, 0, 1, 0, 0),
            Dt = function() {
              this.page = U, this.currentPage = g, this.pages = H.slice(0), this.pagedim = X.slice(0), this.pagesContext = W.slice(0), this.x = w, this.y = y, this.matrix = v, this.width = b, this.height = x, this.id = "", this.objectNumber = -1;
            };
        Dt.prototype = {restore: function() {
            U = this.page, g = this.currentPage, W = this.pagesContext, X = this.pagedim, H = this.pages, w = this.x, y = this.y, v = this.matrix, b = this.width, x = this.height;
          }};
        var Nt = function(t, e, n, r, i) {
          Z.push(new Dt), U = g = 0, H = [], w = t, y = e, v = i, Gt(n, r);
        },
            zt = function(t) {
              if (!$[t]) {
                var e = new Dt,
                    n = "Xo" + (Object.keys(K).length + 1).toString(10);
                e.id = n, $[t] = n, K[n] = e, nt.publish("addFormObject", e), Z.pop().restore();
              }
            },
            Lt = function(t, e) {
              if (!N[t]) {
                var n = e instanceof et.ShadingPattern ? "Sh" : "P",
                    r = n + (Object.keys(D).length + 1).toString(10);
                e.id = r, N[t] = r, D[r] = e, nt.publish("addPattern", e);
              }
            },
            Mt = function(t, e) {
              if (!t || !L[t]) {
                var n = !1;
                for (var r in z)
                  if (z.hasOwnProperty(r) && z[r].equals(e)) {
                    n = !0;
                    break;
                  }
                if (n)
                  e = z[r];
                else {
                  var i = "GS" + (Object.keys(z).length + 1).toString(10);
                  z[i] = e, e.id = i;
                }
                return t && (L[t] = e.id), nt.publish("addGState", e), e;
              }
            },
            Ut = function(t) {
              return t.foo = function() {
                try {
                  return t.apply(this, arguments);
                } catch (n) {
                  var r = n.stack || "";
                  ~r.indexOf(" at ") && (r = r.split(" at ")[1]);
                  var i = "Error in function " + r.split("\n")[0].split("<")[0] + ": " + n.message;
                  if (!e.console)
                    throw new Error(i);
                  e.console.error(i, n), e.alert && alert(i);
                }
              }, t.foo.bar = t, t.foo;
            },
            Ht = function(t, e) {
              var n,
                  r,
                  i,
                  o,
                  a,
                  s,
                  c,
                  u,
                  l;
              if (e = e || {}, i = e.sourceEncoding || "Unicode", a = e.outputEncoding, (e.autoencode || a) && B[p].metadata && B[p].metadata[i] && B[p].metadata[i].encoding && (o = B[p].metadata[i].encoding, !a && B[p].encoding && (a = B[p].encoding), !a && o.codePages && (a = o.codePages[0]), "string" == typeof a && (a = o[a]), a)) {
                for (c = !1, s = [], n = 0, r = t.length; r > n; n++)
                  u = a[t.charCodeAt(n)], u ? s.push(String.fromCharCode(u)) : s.push(t[n]), s[n].charCodeAt(0) >> 8 && (c = !0);
                t = s.join("");
              }
              for (n = t.length; void 0 === c && 0 !== n; )
                t.charCodeAt(n - 1) >> 8 && (c = !0), n--;
              if (!c)
                return t;
              for (s = e.noBOM ? [] : [254, 255], n = 0, r = t.length; r > n; n++) {
                if (u = t.charCodeAt(n), l = u >> 8, l >> 8)
                  throw new Error("Character at position " + n + " of string '" + t + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
                s.push(l), s.push(u - (l << 8));
              }
              return String.fromCharCode.apply(void 0, s);
            },
            Wt = function(t, e) {
              return Ht(t, e).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
            },
            Xt = function() {
              st("/Producer (jsPDF " + o.version + ")");
              for (var t in tt)
                tt.hasOwnProperty(t) && tt[t] && st("/" + t.substr(0, 1).toUpperCase() + t.substr(1) + " (" + Wt(tt[t]) + ")");
              var e = new Date,
                  n = e.getTimezoneOffset(),
                  r = 0 > n ? "+" : "-",
                  i = Math.floor(Math.abs(n / 60)),
                  a = Math.abs(n % 60),
                  s = [r, ot(i), "'", ot(a), "'"].join("");
              st(["/CreationDate (D:", e.getFullYear(), ot(e.getMonth() + 1), ot(e.getDate()), ot(e.getHours()), ot(e.getMinutes()), ot(e.getSeconds()), s, ")"].join(""));
            },
            Vt = function() {
              switch (st("/Type /Catalog"), st("/Pages 1 0 R"), S || (S = "fullwidth"), S) {
                case "fullwidth":
                  st("/OpenAction [3 0 R /FitH null]");
                  break;
                case "fullheight":
                  st("/OpenAction [3 0 R /FitV null]");
                  break;
                case "fullpage":
                  st("/OpenAction [3 0 R /Fit]");
                  break;
                case "original":
                  st("/OpenAction [3 0 R /XYZ null null 1]");
                  break;
                default:
                  var t = "" + S;
                  "%" === t.substr(t.length - 1) && (S = parseInt(S) / 100), "number" == typeof S && st("/OpenAction [3 0 R /XYZ null null " + rt(S) + "]");
              }
              switch (C || (C = "continuous"), C) {
                case "continuous":
                  st("/PageLayout /OneColumn");
                  break;
                case "single":
                  st("/PageLayout /SinglePage");
                  break;
                case "two":
                case "twoleft":
                  st("/PageLayout /TwoColumnLeft");
                  break;
                case "tworight":
                  st("/PageLayout /TwoColumnRight");
              }
              k && st("/PageMode /" + k), nt.publish("putCatalog");
            },
            Yt = function() {
              st("/Size " + (I + 1)), st("/Root " + I + " 0 R"), st("/Info " + (I - 1) + " 0 R");
            },
            Gt = function(t, e) {
              "string" == typeof e && e.toLowerCase();
              if ("string" == typeof t) {
                var n = t.toLowerCase();
                c.hasOwnProperty(n) && (t = c[n][0] / m, e = c[n][1] / m);
              }
              Array.isArray(t) && (e = t[1], t = t[0]), O = !0, H[++U] = [], X[U] = {
                width: Number(t) || b,
                height: Number(e) || x
              }, W[U] = {}, Kt(U);
            },
            Jt = function() {
              Gt.apply(this, arguments), st(rt(E) + " w"), st(_), 0 !== G && st(G + " J"), 0 !== J && st(J + " j"), nt.publish("addPage", {pageNumber: U});
            },
            Qt = function(t) {
              t > 0 && U >= t && (H.splice(t, 1), X.splice(t, 1), U--, g > U && (g = U), this.setPage(g));
            },
            Kt = function(t) {
              t > 0 && U >= t && (g = t, b = X[t].width, x = X[t].height);
            },
            $t = function(t, e) {
              var n;
              switch (t = void 0 !== t ? t : B[p].fontName, e = void 0 !== e ? e : B[p].fontStyle, void 0 !== t && (t = t.toLowerCase()), t) {
                case "sans-serif":
                case "verdana":
                case "arial":
                case "helvetica":
                  t = "helvetica";
                  break;
                case "fixed":
                case "monospace":
                case "terminal":
                case "courier":
                  t = "courier";
                  break;
                case "serif":
                case "cursive":
                case "fantasy":
                default:
                  t = "times";
              }
              try {
                n = R[t][e];
              } catch (r) {}
              return n || (n = R.times[e], null == n && (n = R.times.normal)), n;
            },
            Zt = function() {
              O = !1, I = 2, V = [], F = [], Y = [], st("%PDF-" + s), dt(), Et(), Tt(), ct(), st("<<"), Xt(), st(">>"), st("endobj"), ct(), st("<<"), Vt(), st(">>"), st("endobj");
              var t,
                  e = Q,
                  n = "0000000000";
              for (st("xref"), st("0 " + (I + 1)), st(n + " 65535 f "), t = 1; I >= t; t++) {
                var r = F[t];
                st("function" == typeof r ? (n + F[t]()).slice(-10) + " 00000 n " : (n + F[t]).slice(-10) + " 00000 n ");
              }
              return st("trailer"), st("<<"), Yt(), st(">>"), st("startxref"), st(e), st("%%EOF"), O = !0, V.join("\n");
            },
            te = function(t) {
              var e = "n";
              return "D" === t ? e = "S" : "F" === t ? e = "f" : "FD" === t || "DF" === t ? e = "B" : "f" !== t && "f*" !== t && "B" !== t && "B*" !== t || (e = t), e;
            },
            ee = function(t, e, n) {
              if (t = te(t), !e)
                return void st(t);
              n || (n = jt);
              var r = N[e],
                  i = D[r];
              if (i instanceof et.ShadingPattern)
                st("q"), st("W " + t), i.gState && et.setGState(i.gState), st(n.toString() + " cm"), st("/" + r + " sh"), st("Q");
              else if (i instanceof et.TilingPattern) {
                var o = new Rt(1, 0, 0, -1, 0, x);
                n.matrix && (o = Bt(n.matrix || jt, o), r = i.createClone(e, n.boundingBox, n.xStep, n.yStep, o).id), st("q"), st("/Pattern cs"), st("/" + r + " scn"), i.gState && et.setGState(i.gState), st(t), st("Q");
              }
            },
            ne = function() {
              for (var t = Zt(),
                  e = t.length,
                  n = new ArrayBuffer(e),
                  r = new Uint8Array(n); e--; )
                r[e] = t.charCodeAt(e);
              return n;
            },
            re = function() {
              return new Blob([ne()], {type: "application/pdf"});
            },
            ie = Ut(function(t, n) {
              var i = "dataur" === ("" + t).substr(0, 6) ? "data:application/pdf;base64," + btoa(Zt()) : 0;
              switch (t) {
                case void 0:
                  return Zt();
                case "save":
                  if (navigator.getUserMedia && (void 0 === e.URL || void 0 === e.URL.createObjectURL))
                    return et.output("dataurlnewwindow");
                  r(re(), n), "function" == typeof r.unload && e.setTimeout && setTimeout(r.unload, 911);
                  break;
                case "arraybuffer":
                  return ne();
                case "blob":
                  return re();
                case "bloburi":
                case "bloburl":
                  return e.URL && e.URL.createObjectURL(re()) || void 0;
                case "datauristring":
                case "dataurlstring":
                  return i;
                case "dataurlnewwindow":
                  var o = e.open(i);
                  if (o || "undefined" == typeof safari)
                    return o;
                case "datauri":
                case "dataurl":
                  return e.document.location.href = i;
                default:
                  throw new Error('Output type "' + t + '" is not supported.');
              }
            });
        switch (l) {
          case "pt":
            m = 1;
            break;
          case "mm":
            m = 72 / 25.4000508;
            break;
          case "cm":
            m = 72 / 2.54000508;
            break;
          case "in":
            m = 72;
            break;
          case "px":
            m = 96 / 72;
            break;
          case "pc":
            m = 12;
            break;
          case "em":
            m = 12;
            break;
          case "ex":
            m = 6;
            break;
          default:
            throw "Invalid unit: " + l;
        }
        et.internal = {
          pdfEscape: Wt,
          getStyle: te,
          getFont: function() {
            return B[$t.apply(et, arguments)];
          },
          getFontSize: function() {
            return P;
          },
          getLineHeight: function() {
            return P * T;
          },
          write: function(t) {
            st(1 === arguments.length ? t : Array.prototype.join.call(arguments, " "));
          },
          getCoordinateString: function(t) {
            return rt(t);
          },
          getVerticalCoordinateString: function(t) {
            return rt(t);
          },
          collections: {},
          newObject: ct,
          newAdditionalObject: ut,
          newObjectDeferred: lt,
          newObjectDeferredBegin: ht,
          putStream: ft,
          events: nt,
          scaleFactor: m,
          pageSize: {
            get width() {
              return b;
            },
            get height() {
              return x;
            }
          },
          output: function(t, e) {
            return ie(t, e);
          },
          getNumberOfPages: function() {
            return H.length - 1;
          },
          pages: H,
          out: st,
          f2: rt,
          getPageInfo: function(t) {
            var e = 2 * (t - 1) + 3;
            return {
              objId: e,
              pageNumber: t,
              pageContext: W[t]
            };
          },
          getCurrentPageInfo: function() {
            var t = 2 * (g - 1) + 3;
            return {
              objId: t,
              pageNumber: g,
              pageContext: W[g]
            };
          },
          getPDFVersion: function() {
            return s;
          }
        }, et.GState = function(e) {
          var n = "opacity";
          for (var r in e)
            e.hasOwnProperty(r) && n.indexOf(r) >= 0 && (this[r] = e[r]);
          this.id = "", this.objectNumber = -1, this.equals = function(e) {
            var n = "id,objectNumber,equals";
            if (!e || ("undefined" == typeof e ? "undefined" : t["typeof"](e)) !== t["typeof"](this))
              return !1;
            var r = 0;
            for (var i in this)
              if (!(n.indexOf(i) >= 0)) {
                if (this.hasOwnProperty(i) && !e.hasOwnProperty(i))
                  return !1;
                if (this[i] !== e[i])
                  return !1;
                r++;
              }
            for (var i in e)
              e.hasOwnProperty(i) && n.indexOf(i) < 0 && r--;
            return 0 === r;
          };
        }, et.addGState = function(t, e) {
          return Mt(t, e), this;
        }, et.addPage = function() {
          return Jt.apply(this, arguments), this;
        }, et.setPage = function() {
          return Kt.apply(this, arguments), this;
        }, et.insertPage = function(t) {
          return this.addPage(), this.movePage(g, t), this;
        }, et.movePage = function(t, e) {
          var n,
              r,
              i,
              o;
          if (t > e) {
            for (i = H[t], r = X[t], n = W[t], o = t; o > e; o--)
              H[o] = H[o - 1], X[o] = X[o - 1], W[o] = W[o - 1];
            H[e] = i, X[e] = r, W[e] = n, this.setPage(e);
          } else if (e > t) {
            for (i = H[t], r = X[t], n = W[t], o = t; e > o; o++)
              H[o] = H[o + 1], X[o] = X[o + 1], W[o] = W[o + 1];
            H[e] = i, X[e] = r, W[e] = n, this.setPage(e);
          }
          return this;
        }, et.deletePage = function() {
          return Qt.apply(this, arguments), this;
        }, et.setDisplayMode = function(t, e, n) {
          return S = t, C = e, k = n, this;
        }, et.saveGraphicsState = function() {
          return st("q"), j.push({
            key: p,
            size: P
          }), this;
        }, et.restoreGraphicsState = function() {
          st("Q");
          var t = j.pop();
          return p = t.key, P = t.size, M = null, this;
        }, et.setCurrentTransformationMatrix = function(t) {
          return st(t.toString() + " cm"), this;
        }, et.beginFormObject = function(t, e, n, r, i) {
          return Nt(t, e, n, r, i), this;
        }, et.endFormObject = function(t) {
          return zt(t), this;
        }, et.doFormObject = function(t, e) {
          var n = K[$[t]];
          return st("q"), st(e.toString() + " cm"), st("/" + n.id + " Do"), st("Q"), this;
        }, et.getFormObject = function(t) {
          var e = K[$[t]];
          return {
            x: e.x,
            y: e.y,
            width: e.width,
            height: e.height,
            matrix: e.matrix
          };
        }, et.Matrix = Rt, et.matrixMult = Bt, et.unitMatrix = jt;
        var oe = function(t, e) {
          this.gState = t, this.matrix = e, this.id = "", this.objectNumber = -1;
        };
        et.ShadingPattern = function(t, e, n, r, i) {
          this.type = "axial" === t ? 2 : 3, this.coords = e, this.colors = n, oe.call(this, r, i);
        }, et.TilingPattern = function(t, e, n, r, i) {
          this.boundingBox = t, this.xStep = e, this.yStep = n, this.stream = "", this.cloneIndex = 0, oe.call(this, r, i);
        }, et.TilingPattern.prototype = {createClone: function(t, e, n, r, i) {
            var o = new et.TilingPattern(e || this.boundingBox, n || this.xStep, r || this.yStep, this.gState, i || this.matrix);
            o.stream = this.stream;
            var a = t + "$$" + this.cloneIndex++ + "$$";
            return Lt(a, o), o;
          }}, et.addShadingPattern = function(t, e) {
          return Lt(t, e), this;
        }, et.beginTilingPattern = function(t) {
          Nt(t.boundingBox[0], t.boundingBox[1], t.boundingBox[2] - t.boundingBox[0], t.boundingBox[3] - t.boundingBox[1], t.matrix);
        }, et.endTilingPattern = function(t, e) {
          e.stream = H[g].join("\n"), Lt(t, e), nt.publish("endTilingPattern", e), Z.pop().restore();
        }, et.text = function(t, e, n, r, o, a) {
          function s(t) {
            return t = t.split("   ").join(Array(d.TabLen || 9).join(" ")), Wt(t, r);
          }
          if ("number" == typeof t) {
            var c = n;
            n = e, e = t, t = c;
          }
          "string" == typeof t && (t = t.match(/[\n\r]/) ? t.split(/\r\n|\r|\n/g) : [t]), "string" == typeof o && (a = o, o = null), "string" == typeof r && (a = r, r = null), "number" == typeof r && (o = r, r = null);
          var u;
          if (o && "number" == typeof o) {
            o *= Math.PI / 180;
            var l = Math.cos(o),
                h = Math.sin(o);
            o = new Rt(l, h, -h, l, 0, 0);
          } else
            o || (o = jt);
          r = r || {}, "noBOM" in r || (r.noBOM = !0), "autoencode" in r || (r.autoencode = !0);
          var f = "",
              p = this.internal.getCurrentPageInfo().pageContext;
          if (!0 === r.stroke ? p.lastTextWasStroke !== !0 && (f = "1 Tr\n", p.lastTextWasStroke = !0) : (p.lastTextWasStroke && (f = "0 Tr\n"), p.lastTextWasStroke = !1), "undefined" == typeof this._runningPageHeight && (this._runningPageHeight = 0), "string" == typeof t)
            t = s(t);
          else {
            if ("[object Array]" !== Object.prototype.toString.call(t))
              throw new Error('Type of text must be string or Array. "' + t + '" is not recognized.');
            for (var m = t.concat(),
                g = [],
                w = m.length; w--; )
              g.push(s(m.shift()));
            var y = Math.ceil((n - this._runningPageHeight) / (P * T));
            if (y >= 0 && y < g.length + 1, a) {
              var v,
                  b,
                  x,
                  k = P * T,
                  S = t.map(function(t) {
                    return this.getStringUnitWidth(t) * P;
                  }, this);
              if (x = Math.max.apply(Math, S), "center" === a)
                v = e - x / 2, e -= S[0] / 2;
              else {
                if ("right" !== a)
                  throw new Error('Unrecognized alignment option, use "center" or "right".');
                v = e - x, e -= S[0];
              }
              for (b = e, t = g[0] + ") Tj\n", i = 1, w = g.length; i < w; i++) {
                var C = x - S[i];
                "center" === a && (C /= 2), t += v - b + C + " -" + k + " Td (" + g[i], b = v + C, i < w - 1 && (t += ") Tj\n");
              }
            } else
              t = g.join(") Tj\nT* (");
          }
          var A;
          u || (A = rt(n));
          var q = new Rt(1, 0, 0, -1, e, A);
          o = Bt(q, o);
          var _ = o.toString() + " Tm";
          return st("BT\n" + P * T + " TL\n" + f + _ + "\n(" + t + ") Tj\nET"), u && this.text(u, e, n), this;
        }, et.lstext = function(t, e, n, r) {
          for (var i = 0,
              o = t.length; o > i; i++, e += r)
            this.text(t[i], e, n);
        }, et.line = function(t, e, n, r) {
          return this.lines([[n - t, r - e]], t, e, [1, 1], "D");
        }, et.clip = function() {
          st("W"), st("S");
        }, et.lines = function(t, e, n, r, i, o, a, s) {
          var c,
              u,
              l,
              h,
              f,
              d,
              p,
              m,
              g,
              w,
              y;
          if ("number" == typeof t) {
            var v = n;
            n = e, e = t, t = v;
          }
          for (r = r || [1, 1], st(it(e) + " " + it(n) + " m "), c = r[0], u = r[1], h = t.length, w = e, y = n, l = 0; h > l; l++)
            f = t[l], 2 === f.length ? (w = f[0] * c + w, y = f[1] * u + y, st(it(w) + " " + it(y) + " l")) : (d = f[0] * c + w, p = f[1] * u + y, m = f[2] * c + w, g = f[3] * u + y, w = f[4] * c + w, y = f[5] * u + y, st(it(d) + " " + it(p) + " " + it(m) + " " + it(g) + " " + it(w) + " " + it(y) + " c"));
          return o && st("h"), ee(i, a, s), this;
        }, et.path = function(t, e, n, r) {
          for (var i = 0; i < t.length; i++) {
            var o = t[i],
                a = o.c;
            switch (o.op) {
              case "m":
                st(it(a[0]) + " " + it(a[1]) + " m");
                break;
              case "l":
                st(it(a[0]) + " " + it(a[1]) + " l");
                break;
              case "c":
                st([it(a[0]), it(a[1]), it(a[2]), it(a[3]), it(a[4]), it(a[5]), "c"].join(" "));
                break;
              case "h":
                st("h");
            }
          }
          return ee(e, n, r), this;
        }, et.rect = function(t, e, n, r, i, o, a) {
          return st([rt(t), rt(e), rt(n), rt(-r), "re"].join(" ")), ee(i, o, a), this;
        }, et.triangle = function(t, e, n, r, i, o, a, s, c) {
          return this.lines([[n - t, r - e], [i - n, o - r], [t - i, e - o]], t, e, [1, 1], a, !0, s, c), this;
        }, et.roundedRect = function(t, e, n, r, i, o, a, s, c) {
          var u = 4 / 3 * (Math.SQRT2 - 1);
          return i = Math.min(i, .5 * n), o = Math.min(o, .5 * r), this.lines([[n - 2 * i, 0], [i * u, 0, i, o - o * u, i, o], [0, r - 2 * o], [0, o * u, -(i * u), o, -i, o], [-n + 2 * i, 0], [-(i * u), 0, -i, -(o * u), -i, -o], [0, -r + 2 * o], [0, -(o * u), i * u, -o, i, -o]], t + i, e, [1, 1], a, !0, s, c), this;
        }, et.ellipse = function(t, e, n, r, i, o, a) {
          var s = 4 / 3 * (Math.SQRT2 - 1) * n,
              c = 4 / 3 * (Math.SQRT2 - 1) * r;
          return st([rt(t + n), rt(e), "m", rt(t + n), rt(e - c), rt(t + s), rt(e - r), rt(t), rt(e - r), "c"].join(" ")), st([rt(t - s), rt(e - r), rt(t - n), rt(e - c), rt(t - n), rt(e), "c"].join(" ")), st([rt(t - n), rt(e + c), rt(t - s), rt(e + r), rt(t), rt(e + r), "c"].join(" ")), st([rt(t + s), rt(e + r), rt(t + n), rt(e + c), rt(t + n), rt(e), "c"].join(" ")), ee(i, o, a), this;
        }, et.circle = function(t, e, n, r, i, o) {
          return this.ellipse(t, e, n, n, r, i, o);
        }, et.setProperties = function(t) {
          for (var e in tt)
            tt.hasOwnProperty(e) && t[e] && (tt[e] = t[e]);
          return this;
        }, et.setFontSize = function(t) {
          return P = t, st("/" + p + " " + P + " Tf"), this;
        }, et.getFontSize = function() {
          return P;
        }, et.setFont = function(t, e) {
          return p = $t(t, e), st("/" + p + " " + P + " Tf"), this;
        }, et.setFontStyle = et.setFontType = function(t) {
          return p = $t(void 0, t), this;
        }, et.getFontList = function() {
          var t,
              e,
              n,
              r = {};
          for (t in R)
            if (R.hasOwnProperty(t)) {
              r[t] = n = [];
              for (e in R[t])
                R[t].hasOwnProperty(e) && n.push(e);
            }
          return r;
        }, et.addFont = function(t, e, n) {
          Ot(t, e, n, "StandardEncoding");
        }, et.setLineWidth = function(t) {
          return st(t.toFixed(2) + " w"), this;
        }, et.setDrawColor = function(t, e, n, r) {
          var i;
          return i = void 0 === e || void 0 === r && t === e === n ? "string" == typeof t ? t + " G" : rt(t / 255) + " G" : void 0 === r ? "string" == typeof t ? [t, e, n, "RG"].join(" ") : [rt(t / 255), rt(e / 255), rt(n / 255), "RG"].join(" ") : "string" == typeof t ? [t, e, n, r, "K"].join(" ") : [rt(t), rt(e), rt(n), rt(r), "K"].join(" "), st(i), this;
        }, et.setFillColor = function(e, n, r, i) {
          var o;
          return void 0 === n || void 0 === i && e === n === r ? o = "string" == typeof e ? e + " g" : rt(e / 255) + " g" : void 0 === i || "object" === ("undefined" == typeof i ? "undefined" : t["typeof"](i)) ? (o = "string" == typeof e ? [e, n, r, "rg"].join(" ") : [rt(e / 255), rt(n / 255), rt(r / 255), "rg"].join(" "), i && 0 === i.a && (o = ["255", "255", "255", "rg"].join(" "))) : o = "string" == typeof e ? [e, n, r, i, "k"].join(" ") : [rt(e), rt(n), rt(r), rt(i), "k"].join(" "), st(o), this;
        }, et.setTextColor = function(t, e, n) {
          if ("string" == typeof t && /^#[0-9A-Fa-f]{6}$/.test(t)) {
            var r = parseInt(t.substr(1), 16);
            t = r >> 16 & 255, e = r >> 8 & 255, n = 255 & r;
          }
          return q = 0 === t && 0 === e && 0 === n || "undefined" == typeof e ? it(t / 255) + " g" : [it(t / 255), it(e / 255), it(n / 255), "rg"].join(" "), st(q), this;
        }, et.setGState = function(t) {
          t = "string" == typeof t ? z[L[t]] : Mt(null, t), t.equals(M) || (st("/" + t.id + " gs"), M = t);
        }, et.CapJoinStyles = {
          0: 0,
          butt: 0,
          but: 0,
          miter: 0,
          1: 1,
          round: 1,
          rounded: 1,
          circle: 1,
          2: 2,
          projecting: 2,
          project: 2,
          square: 2,
          bevel: 2
        }, et.setLineCap = function(t) {
          var e = this.CapJoinStyles[t];
          if (void 0 === e)
            throw new Error("Line cap style of '" + t + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
          return G = e, st(e + " J"), this;
        }, et.setLineJoin = function(t) {
          var e = this.CapJoinStyles[t];
          if (void 0 === e)
            throw new Error("Line join style of '" + t + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
          return J = e, st(e + " j"), this;
        }, et.setLineMiterLimit = function(t) {
          return st(rt(t) + " M"), this;
        }, et.setLineDashPattern = function(t, e) {
          return st(["[" + (void 0 !== t[0] ? t[0] : ""), (void 0 !== t[1] ? t[1] : "") + "]", e, "d"].join(" ")), this;
        }, et.output = ie, et.save = function(t) {
          et.output("save", t);
        };
        for (var ae in o.API)
          o.API.hasOwnProperty(ae) && ("events" === ae && o.API.events.length ? !function(t, e) {
            var n,
                r,
                i;
            for (i = e.length - 1; -1 !== i; i--)
              n = e[i][0], r = e[i][1], t.subscribe.apply(t, [n].concat("function" == typeof r ? [r] : r));
          }(nt, o.API.events) : et[ae] = o.API[ae]);
        return Ft(), p = "F1", Jt(h, u), nt.publish("initialized"), et;
      }
      var s = "1.3",
          c = {
            a0: [2383.94, 3370.39],
            a1: [1683.78, 2383.94],
            a2: [1190.55, 1683.78],
            a3: [841.89, 1190.55],
            a4: [595.28, 841.89],
            a5: [419.53, 595.28],
            a6: [297.64, 419.53],
            a7: [209.76, 297.64],
            a8: [147.4, 209.76],
            a9: [104.88, 147.4],
            a10: [73.7, 104.88],
            b0: [2834.65, 4008.19],
            b1: [2004.09, 2834.65],
            b2: [1417.32, 2004.09],
            b3: [1000.63, 1417.32],
            b4: [708.66, 1000.63],
            b5: [498.9, 708.66],
            b6: [354.33, 498.9],
            b7: [249.45, 354.33],
            b8: [175.75, 249.45],
            b9: [124.72, 175.75],
            b10: [87.87, 124.72],
            c0: [2599.37, 3676.54],
            c1: [1836.85, 2599.37],
            c2: [1298.27, 1836.85],
            c3: [918.43, 1298.27],
            c4: [649.13, 918.43],
            c5: [459.21, 649.13],
            c6: [323.15, 459.21],
            c7: [229.61, 323.15],
            c8: [161.57, 229.61],
            c9: [113.39, 161.57],
            c10: [79.37, 113.39],
            dl: [311.81, 623.62],
            letter: [612, 792],
            "government-letter": [576, 756],
            legal: [612, 1008],
            "junior-legal": [576, 360],
            ledger: [1224, 792],
            tabloid: [792, 1224],
            "credit-card": [153, 243]
          };
      return o.API = {events: []}, o.version = "1.2.68 2017-07-18T14:26:07.334Z:minint-e5ltq7i\vasilcenko", "function" == typeof define && define.amd ? define("jsPDF", function() {
        return o;
      }) : "undefined" != typeof module && module.exports ? module.exports = o : e.jsPDF = o, o;
    }("undefined" != typeof self && self || "undefined" != typeof window && window || this);
    (window.AcroForm = function(t) {
      var n = window.AcroForm;
      n.scale = function(t) {
        return t * (r.internal.scaleFactor / 1);
      }, n.antiScale = function(t) {
        return 1 / r.internal.scaleFactor * t;
      };
      var r = {
        fields: [],
        xForms: [],
        acroFormDictionaryRoot: null,
        printedOut: !1,
        internal: null
      };
      e.API.acroformPlugin = r;
      var i = function() {
        for (var t in this.acroformPlugin.acroFormDictionaryRoot.Fields) {
          var e = this.acroformPlugin.acroFormDictionaryRoot.Fields[t];
          e.hasAnnotation && a.call(this, e);
        }
      },
          o = function() {
            if (this.acroformPlugin.acroFormDictionaryRoot)
              throw new Error("Exception while creating AcroformDictionary");
            this.acroformPlugin.acroFormDictionaryRoot = new n.AcroFormDictionary, this.acroformPlugin.internal = this.internal, this.acroformPlugin.acroFormDictionaryRoot._eventID = this.internal.events.subscribe("postPutResources", u), this.internal.events.subscribe("buildDocument", i), this.internal.events.subscribe("putCatalog", c), this.internal.events.subscribe("postPutPages", l);
          },
          a = function(t) {
            var n = {
              type: "reference",
              object: t
            };
            e.API.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push(n);
          },
          s = function(t) {
            this.acroformPlugin.printedOut && (this.acroformPlugin.printedOut = !1, this.acroformPlugin.acroFormDictionaryRoot = null), this.acroformPlugin.acroFormDictionaryRoot || o.call(this), this.acroformPlugin.acroFormDictionaryRoot.Fields.push(t);
          },
          c = function() {
            "undefined" != typeof this.acroformPlugin.acroFormDictionaryRoot ? this.internal.write("/AcroForm " + this.acroformPlugin.acroFormDictionaryRoot.objId + " 0 R") : console.log("Root missing...");
          },
          u = function() {
            this.internal.events.unsubscribe(this.acroformPlugin.acroFormDictionaryRoot._eventID), delete this.acroformPlugin.acroFormDictionaryRoot._eventID, this.acroformPlugin.printedOut = !0;
          },
          l = function(t) {
            var e = !t;
            t || (this.internal.newObjectDeferredBegin(this.acroformPlugin.acroFormDictionaryRoot.objId), this.internal.out(this.acroformPlugin.acroFormDictionaryRoot.getString()));
            var t = t || this.acroformPlugin.acroFormDictionaryRoot.Kids;
            for (var r in t) {
              var i = t[r],
                  o = i.Rect;
              i.Rect && (i.Rect = n.internal.calculateCoordinates.call(this, i.Rect)), this.internal.newObjectDeferredBegin(i.objId);
              var a = "";
              if (a += i.objId + " 0 obj\n", a += "<<\n" + i.getContent(), i.Rect = o, i.hasAppearanceStream && !i.appearanceStreamContent) {
                var s = n.internal.calculateAppearanceStream.call(this, i);
                a += "/AP << /N " + s + " >>\n", this.acroformPlugin.xForms.push(s);
              }
              if (i.appearanceStreamContent) {
                a += "/AP << ";
                for (var c in i.appearanceStreamContent) {
                  var u = i.appearanceStreamContent[c];
                  if (a += "/" + c + " ", a += "<< ", Object.keys(u).length >= 1 || Array.isArray(u))
                    for (var r in u) {
                      var l = u[r];
                      "function" == typeof l && (l = l.call(this, i)), a += "/" + r + " " + l + " ", this.acroformPlugin.xForms.indexOf(l) >= 0 || this.acroformPlugin.xForms.push(l);
                    }
                  else {
                    var l = u;
                    "function" == typeof l && (l = l.call(this, i)), a += "/" + r + " " + l + " \n", this.acroformPlugin.xForms.indexOf(l) >= 0 || this.acroformPlugin.xForms.push(l);
                  }
                  a += " >>\n";
                }
                a += ">>\n";
              }
              a += ">>\nendobj\n", this.internal.out(a);
            }
            e && h.call(this, this.acroformPlugin.xForms);
          },
          h = function(t) {
            for (var e in t) {
              var n = e,
                  r = t[e];
              this.internal.newObjectDeferredBegin(r && r.objId);
              var i = "";
              i += r ? r.getString() : "", this.internal.out(i), delete t[n];
            }
          };
      t.addField = function(t) {
        return t instanceof n.TextField ? d.call(this, t) : t instanceof n.ChoiceField ? p.call(this, t) : t instanceof n.Button ? f.call(this, t) : t instanceof n.ChildClass ? s.call(this, t) : t && s.call(this, t), this;
      };
      var f = function(t) {
        var t = t || new n.Field;
        t.FT = "/Btn";
        var e = t.Ff || 0;
        t.pushbutton && (e = n.internal.setBitPosition(e, 17), delete t.pushbutton), t.radio && (e = n.internal.setBitPosition(e, 16), delete t.radio), t.noToggleToOff && (e = n.internal.setBitPosition(e, 15)), t.Ff = e, s.call(this, t);
      },
          d = function(t) {
            var t = t || new n.Field;
            t.FT = "/Tx";
            var e = t.Ff || 0;
            t.multiline && (e = 4096 | e), t.password && (e = 8192 | e), t.fileSelect && (e |= 1 << 20), t.doNotSpellCheck && (e |= 1 << 22), t.doNotScroll && (e |= 1 << 23), t.Ff = t.Ff || e, s.call(this, t);
          },
          p = function(t) {
            var e = t || new n.Field;
            e.FT = "/Ch";
            var r = e.Ff || 0;
            e.combo && (r = n.internal.setBitPosition(r, 18), delete e.combo), e.edit && (r = n.internal.setBitPosition(r, 19), delete e.edit), e.sort && (r = n.internal.setBitPosition(r, 20), delete e.sort), e.multiSelect && this.internal.getPDFVersion() >= 1.4 && (r = n.internal.setBitPosition(r, 22), delete e.multiSelect), e.doNotSpellCheck && this.internal.getPDFVersion() >= 1.4 && (r = n.internal.setBitPosition(r, 23), delete e.doNotSpellCheck), e.Ff = r, s.call(this, e);
          };
    })(e.API);
    var n = window.AcroForm;
    n.internal = {}, n.createFormXObject = function(t) {
      var e = new n.FormXObject,
          r = n.Appearance.internal.getHeight(t) || 0,
          i = n.Appearance.internal.getWidth(t) || 0;
      return e.BBox = [0, 0, i, r], e;
    }, n.Appearance = {
      CheckBox: {
        createAppearanceStream: function() {
          var t = {
            N: {On: n.Appearance.CheckBox.YesNormal},
            D: {
              On: n.Appearance.CheckBox.YesPushDown,
              Off: n.Appearance.CheckBox.OffPushDown
            }
          };
          return t;
        },
        createMK: function() {
          return "<< /CA (3)>>";
        },
        YesPushDown: function(t) {
          var e = n.createFormXObject(t),
              r = "";
          t.Q = 1;
          var i = n.internal.calculateX(t, "3", "ZapfDingbats", 50);
          return r += "0.749023 g\n             0 0 " + n.Appearance.internal.getWidth(t) + " " + n.Appearance.internal.getHeight(t) + " re\n             f\n             BMC\n             q\n             0 0 1 rg\n             /F13 " + i.fontSize + " Tf 0 g\n             BT\n", r += i.text, r += "ET\n             Q\n             EMC\n", e.stream = r, e;
        },
        YesNormal: function(t) {
          var e = n.createFormXObject(t),
              r = "";
          t.Q = 1;
          var i = n.internal.calculateX(t, "3", "ZapfDingbats", .9 * n.Appearance.internal.getHeight(t));
          return r += "1 g\n0 0 " + n.Appearance.internal.getWidth(t) + " " + n.Appearance.internal.getHeight(t) + " re\nf\nq\n0 0 1 rg\n0 0 " + (n.Appearance.internal.getWidth(t) - 1) + " " + (n.Appearance.internal.getHeight(t) - 1) + " re\nW\nn\n0 g\nBT\n/F13 " + i.fontSize + " Tf 0 g\n", r += i.text, r += "ET\n             Q\n", e.stream = r, e;
        },
        OffPushDown: function(t) {
          var e = n.createFormXObject(t),
              r = "";
          return r += "0.749023 g\n            0 0 " + n.Appearance.internal.getWidth(t) + " " + n.Appearance.internal.getHeight(t) + " re\n            f\n", e.stream = r, e;
        }
      },
      RadioButton: {
        Circle: {
          createAppearanceStream: function(t) {
            var e = {
              D: {Off: n.Appearance.RadioButton.Circle.OffPushDown},
              N: {}
            };
            return e.N[t] = n.Appearance.RadioButton.Circle.YesNormal, e.D[t] = n.Appearance.RadioButton.Circle.YesPushDown, e;
          },
          createMK: function() {
            return "<< /CA (l)>>";
          },
          YesNormal: function(t) {
            var e = n.createFormXObject(t),
                r = "",
                i = n.Appearance.internal.getWidth(t) <= n.Appearance.internal.getHeight(t) ? n.Appearance.internal.getWidth(t) / 4 : n.Appearance.internal.getHeight(t) / 4;
            i *= .9;
            var o = n.Appearance.internal.Bezier_C;
            return r += "q\n1 0 0 1 " + n.Appearance.internal.getWidth(t) / 2 + " " + n.Appearance.internal.getHeight(t) / 2 + " cm\n" + i + " 0 m\n" + i + " " + i * o + " " + i * o + " " + i + " 0 " + i + " c\n-" + i * o + " " + i + " -" + i + " " + i * o + " -" + i + " 0 c\n-" + i + " -" + i * o + " -" + i * o + " -" + i + " 0 -" + i + " c\n" + i * o + " -" + i + " " + i + " -" + i * o + " " + i + " 0 c\nf\nQ\n", e.stream = r, e;
          },
          YesPushDown: function(t) {
            var e = n.createFormXObject(t),
                r = "",
                i = n.Appearance.internal.getWidth(t) <= n.Appearance.internal.getHeight(t) ? n.Appearance.internal.getWidth(t) / 4 : n.Appearance.internal.getHeight(t) / 4;
            i *= .9;
            var o = n.Appearance.internal.Bezier_C;
            return r += "0.749023 g\n            q\n           1 0 0 1 " + n.Appearance.internal.getWidth(t) / 2 + " " + n.Appearance.internal.getHeight(t) / 2 + " cm\n" + 2 * i + " 0 m\n" + 2 * i + " " + 2 * i * o + " " + 2 * i * o + " " + 2 * i + " 0 " + 2 * i + " c\n-" + 2 * i * o + " " + 2 * i + " -" + 2 * i + " " + 2 * i * o + " -" + 2 * i + " 0 c\n-" + 2 * i + " -" + 2 * i * o + " -" + 2 * i * o + " -" + 2 * i + " 0 -" + 2 * i + " c\n" + 2 * i * o + " -" + 2 * i + " " + 2 * i + " -" + 2 * i * o + " " + 2 * i + " 0 c\n            f\n            Q\n            0 g\n            q\n            1 0 0 1 " + n.Appearance.internal.getWidth(t) / 2 + " " + n.Appearance.internal.getHeight(t) / 2 + " cm\n" + i + " 0 m\n" + i + " " + i * o + " " + i * o + " " + i + " 0 " + i + " c\n-" + i * o + " " + i + " -" + i + " " + i * o + " -" + i + " 0 c\n-" + i + " -" + i * o + " -" + i * o + " -" + i + " 0 -" + i + " c\n" + i * o + " -" + i + " " + i + " -" + i * o + " " + i + " 0 c\n            f\n            Q\n", e.stream = r, e;
          },
          OffPushDown: function(t) {
            var e = n.createFormXObject(t),
                r = "",
                i = n.Appearance.internal.getWidth(t) <= n.Appearance.internal.getHeight(t) ? n.Appearance.internal.getWidth(t) / 4 : n.Appearance.internal.getHeight(t) / 4;
            i *= .9;
            var o = n.Appearance.internal.Bezier_C;
            return r += "0.749023 g\n            q\n 1 0 0 1 " + n.Appearance.internal.getWidth(t) / 2 + " " + n.Appearance.internal.getHeight(t) / 2 + " cm\n" + 2 * i + " 0 m\n" + 2 * i + " " + 2 * i * o + " " + 2 * i * o + " " + 2 * i + " 0 " + 2 * i + " c\n-" + 2 * i * o + " " + 2 * i + " -" + 2 * i + " " + 2 * i * o + " -" + 2 * i + " 0 c\n-" + 2 * i + " -" + 2 * i * o + " -" + 2 * i * o + " -" + 2 * i + " 0 -" + 2 * i + " c\n" + 2 * i * o + " -" + 2 * i + " " + 2 * i + " -" + 2 * i * o + " " + 2 * i + " 0 c\n            f\n            Q\n", e.stream = r, e;
          }
        },
        Cross: {
          createAppearanceStream: function(t) {
            var e = {
              D: {Off: n.Appearance.RadioButton.Cross.OffPushDown},
              N: {}
            };
            return e.N[t] = n.Appearance.RadioButton.Cross.YesNormal, e.D[t] = n.Appearance.RadioButton.Cross.YesPushDown, e;
          },
          createMK: function() {
            return "<< /CA (8)>>";
          },
          YesNormal: function(t) {
            var e = n.createFormXObject(t),
                r = "",
                i = n.Appearance.internal.calculateCross(t);
            return r += "q\n            1 1 " + (n.Appearance.internal.getWidth(t) - 2) + " " + (n.Appearance.internal.getHeight(t) - 2) + " re\n            W\n            n\n            " + i.x1.x + " " + i.x1.y + " m\n            " + i.x2.x + " " + i.x2.y + " l\n            " + i.x4.x + " " + i.x4.y + " m\n            " + i.x3.x + " " + i.x3.y + " l\n            s\n            Q\n", e.stream = r, e;
          },
          YesPushDown: function(t) {
            var e = n.createFormXObject(t),
                r = n.Appearance.internal.calculateCross(t),
                i = "";
            return i += "0.749023 g\n            0 0 " + n.Appearance.internal.getWidth(t) + " " + n.Appearance.internal.getHeight(t) + " re\n            f\n            q\n            1 1 " + (n.Appearance.internal.getWidth(t) - 2) + " " + (n.Appearance.internal.getHeight(t) - 2) + " re\n            W\n            n\n            " + r.x1.x + " " + r.x1.y + " m\n            " + r.x2.x + " " + r.x2.y + " l\n            " + r.x4.x + " " + r.x4.y + " m\n            " + r.x3.x + " " + r.x3.y + " l\n            s\n            Q\n", e.stream = i, e;
          },
          OffPushDown: function(t) {
            var e = n.createFormXObject(t),
                r = "";
            return r += "0.749023 g\n            0 0 " + n.Appearance.internal.getWidth(t) + " " + n.Appearance.internal.getHeight(t) + " re\n            f\n", e.stream = r, e;
          }
        }
      },
      createDefaultAppearanceStream: function(t) {
        var e = "";
        return e += "/Helv 12 Tf 0 g";
      }
    }, n.Appearance.internal = {
      Bezier_C: .551915024494,
      calculateCross: function(t) {
        var e = function(t, e) {
          return t > e ? e : t;
        },
            r = n.Appearance.internal.getWidth(t),
            i = n.Appearance.internal.getHeight(t),
            o = e(r, i),
            a = {
              x1: {
                x: (r - o) / 2,
                y: (i - o) / 2 + o
              },
              x2: {
                x: (r - o) / 2 + o,
                y: (i - o) / 2
              },
              x3: {
                x: (r - o) / 2,
                y: (i - o) / 2
              },
              x4: {
                x: (r - o) / 2 + o,
                y: (i - o) / 2 + o
              }
            };
        return a;
      }
    }, n.Appearance.internal.getWidth = function(t) {
      return t.Rect[2];
    }, n.Appearance.internal.getHeight = function(t) {
      return t.Rect[3];
    }, n.internal.inherit = function(t, e) {
      Object.create || function(t) {
        var e = function() {};
        return e.prototype = t, new e;
      };
      t.prototype = Object.create(e.prototype), t.prototype.constructor = t;
    }, n.internal.arrayToPdfArray = function(t) {
      if (Array.isArray(t)) {
        var e = " [";
        for (var n in t) {
          var r = t[n].toString();
          e += r, e += n < t.length - 1 ? " " : "";
        }
        return e += "]";
      }
    }, n.internal.toPdfString = function(t) {
      return t = t || "", 0 !== t.indexOf("(") && (t = "(" + t), ")" != t.substring(t.length - 1) && (t += "("), t;
    }, n.PDFObject = function() {
      var t;
      Object.defineProperty(this, "objId", {
        get: function() {
          return t || (this.internal ? t = this.internal.newObjectDeferred() : e.API.acroformPlugin.internal && (t = e.API.acroformPlugin.internal.newObjectDeferred())), t || console.log("Couldn't create Object ID"), t;
        },
        configurable: !1
      });
    }, n.PDFObject.prototype.toString = function() {
      return this.objId + " 0 R";
    }, n.PDFObject.prototype.getString = function() {
      var t = this.objId + " 0 obj\n<<",
          e = this.getContent();
      return t += e + ">>\n", this.stream && (t += "stream\n", t += this.stream, t += "endstream\n"), t += "endobj\n";
    }, n.PDFObject.prototype.getContent = function() {
      var t = function(t) {
        var e = "",
            r = Object.keys(t).filter(function(t) {
              return "content" != t && "appearanceStreamContent" != t && "_" != t.substring(0, 1);
            });
        for (var i in r) {
          var o = r[i],
              a = t[o];
          a && (e += Array.isArray(a) ? "/" + o + " " + n.internal.arrayToPdfArray(a) + "\n" : a instanceof n.PDFObject ? "/" + o + " " + a.objId + " 0 R\n" : "/" + o + " " + a + "\n");
        }
        return e;
      },
          e = "";
      return e += t(this);
    }, n.FormXObject = function() {
      n.PDFObject.call(this), this.Type = "/XObject", this.Subtype = "/Form", this.FormType = 1, this.BBox, this.Matrix, this.Resources = "2 0 R", this.PieceInfo;
      var t;
      Object.defineProperty(this, "Length", {
        enumerable: !0,
        get: function() {
          return void 0 !== t ? t.length : 0;
        }
      }), Object.defineProperty(this, "stream", {
        enumerable: !1,
        set: function(e) {
          t = e;
        },
        get: function() {
          return t ? t : null;
        }
      });
    }, n.internal.inherit(n.FormXObject, n.PDFObject), n.AcroFormDictionary = function() {
      n.PDFObject.call(this);
      var t = [];
      Object.defineProperty(this, "Kids", {
        enumerable: !1,
        configurable: !0,
        get: function() {
          return t.length > 0 ? t : void 0;
        }
      }), Object.defineProperty(this, "Fields", {
        enumerable: !0,
        configurable: !0,
        get: function() {
          return t;
        }
      }), this.DA;
    }, n.internal.inherit(n.AcroFormDictionary, n.PDFObject), n.Field = function() {
      n.PDFObject.call(this);
      var t;
      Object.defineProperty(this, "Rect", {
        enumerable: !0,
        configurable: !1,
        get: function() {
          if (t) {
            var e = t;
            return e;
          }
        },
        set: function(e) {
          t = e;
        }
      });
      var e = "";
      Object.defineProperty(this, "FT", {
        enumerable: !0,
        set: function(t) {
          e = t;
        },
        get: function() {
          return e;
        }
      });
      var r;
      Object.defineProperty(this, "T", {
        enumerable: !0,
        configurable: !1,
        set: function(t) {
          r = t;
        },
        get: function() {
          if (!r || r.length < 1) {
            if (this instanceof n.ChildClass)
              return;
            return "(FieldObject" + n.Field.FieldNum++ + ")";
          }
          return "(" == r.substring(0, 1) && r.substring(r.length - 1) ? r : "(" + r + ")";
        }
      });
      var i;
      Object.defineProperty(this, "DA", {
        enumerable: !0,
        get: function() {
          return i ? "(" + i + ")" : void 0;
        },
        set: function(t) {
          i = t;
        }
      });
      var o;
      Object.defineProperty(this, "DV", {
        enumerable: !0,
        configurable: !0,
        get: function() {
          return o ? o : void 0;
        },
        set: function(t) {
          o = t;
        }
      }), Object.defineProperty(this, "Type", {
        enumerable: !0,
        get: function() {
          return this.hasAnnotation ? "/Annot" : null;
        }
      }), Object.defineProperty(this, "Subtype", {
        enumerable: !0,
        get: function() {
          return this.hasAnnotation ? "/Widget" : null;
        }
      }), this.BG, Object.defineProperty(this, "hasAnnotation", {
        enumerable: !1,
        get: function() {
          return !!(this.Rect || this.BC || this.BG);
        }
      }), Object.defineProperty(this, "hasAppearanceStream", {
        enumerable: !1,
        configurable: !0,
        writable: !0
      });
    }, n.Field.FieldNum = 0, n.internal.inherit(n.Field, n.PDFObject), n.ChoiceField = function() {
      n.Field.call(this), this.FT = "/Ch", this.Opt = [], this.V = "()", this.TI = 0, this.combo = !1, Object.defineProperty(this, "edit", {
        enumerable: !0,
        set: function(t) {
          1 == t ? (this._edit = !0, this.combo = !0) : this._edit = !1;
        },
        get: function() {
          return this._edit ? this._edit : !1;
        },
        configurable: !1
      }), this.hasAppearanceStream = !0, Object.defineProperty(this, "V", {get: function() {
          n.internal.toPdfString();
        }});
    }, n.internal.inherit(n.ChoiceField, n.Field), window.ChoiceField = n.ChoiceField, n.ListBox = function() {
      n.ChoiceField.call(this);
    }, n.internal.inherit(n.ListBox, n.ChoiceField), window.ListBox = n.ListBox, n.ComboBox = function() {
      n.ListBox.call(this), this.combo = !0;
    }, n.internal.inherit(n.ComboBox, n.ListBox), window.ComboBox = n.ComboBox, n.EditBox = function() {
      n.ComboBox.call(this), this.edit = !0;
    }, n.internal.inherit(n.EditBox, n.ComboBox), window.EditBox = n.EditBox, n.Button = function() {
      n.Field.call(this), this.FT = "/Btn";
    }, n.internal.inherit(n.Button, n.Field), window.Button = n.Button, n.PushButton = function() {
      n.Button.call(this), this.pushbutton = !0;
    }, n.internal.inherit(n.PushButton, n.Button), window.PushButton = n.PushButton, n.RadioButton = function() {
      n.Button.call(this), this.radio = !0;
      var t = [];
      Object.defineProperty(this, "Kids", {
        enumerable: !0,
        get: function() {
          return t.length > 0 ? t : void 0;
        }
      }), Object.defineProperty(this, "__Kids", {get: function() {
          return t;
        }});
      var e;
      Object.defineProperty(this, "noToggleToOff", {
        enumerable: !1,
        get: function() {
          return e;
        },
        set: function(t) {
          e = t;
        }
      });
    }, n.internal.inherit(n.RadioButton, n.Button), window.RadioButton = n.RadioButton, n.ChildClass = function(t, e) {
      n.Field.call(this), this.Parent = t, this._AppearanceType = n.Appearance.RadioButton.Circle, this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(e), this.F = n.internal.setBitPosition(this.F, 3, 1), this.MK = this._AppearanceType.createMK(), this.AS = "/Off", this._Name = e;
    }, n.internal.inherit(n.ChildClass, n.Field), n.RadioButton.prototype.setAppearance = function(t) {
      if (!("createAppearanceStream" in t && "createMK" in t))
        return void console.log("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");
      for (var e in this.__Kids) {
        var n = this.__Kids[e];
        n.appearanceStreamContent = t.createAppearanceStream(n._Name), n.MK = t.createMK();
      }
    }, n.RadioButton.prototype.createOption = function(t) {
      var r = this,
          i = (this.__Kids.length, new n.ChildClass(r, t));
      return this.__Kids.push(i), e.API.addField(i), i;
    }, n.CheckBox = function() {
      Button.call(this), this.appearanceStreamContent = n.Appearance.CheckBox.createAppearanceStream(), this.MK = n.Appearance.CheckBox.createMK(), this.AS = "/On", this.V = "/On";
    }, n.internal.inherit(n.CheckBox, n.Button), window.CheckBox = n.CheckBox, n.TextField = function() {
      n.Field.call(this);
      var t;
      Object.defineProperty(this, "V", {
        get: function() {
          return t ? "(" + t + ")" : t;
        },
        enumerable: !0,
        set: function(e) {
          t = e;
        }
      });
      var e;
      Object.defineProperty(this, "DV", {
        get: function() {
          return e ? "(" + e + ")" : e;
        },
        enumerable: !0,
        set: function(t) {
          e = t;
        }
      });
      var r = !1;
      Object.defineProperty(this, "multiline", {
        enumerable: !1,
        get: function() {
          return r;
        },
        set: function(t) {
          r = t;
        }
      }), Object.defineProperty(this, "hasAppearanceStream", {
        enumerable: !1,
        get: function() {
          return this.V || this.DV;
        }
      });
    }, n.internal.inherit(n.TextField, n.Field), window.TextField = n.TextField, n.PasswordField = function() {
      TextField.call(this), Object.defineProperty(this, "password", {
        value: !0,
        enumerable: !1,
        configurable: !1,
        writable: !1
      });
    }, n.internal.inherit(n.PasswordField, n.TextField), window.PasswordField = n.PasswordField, n.internal.calculateFontSpace = function(t, e, r) {
      var r = r || "helvetica",
          i = n.internal.calculateFontSpace.canvas || (n.internal.calculateFontSpace.canvas = document.createElement("canvas")),
          o = i.getContext("2d");
      o.save();
      var a = e + " " + r;
      o.font = a;
      var s = o.measureText(t);
      o.fontcolor = "black";
      var o = i.getContext("2d");
      s.height = 1.5 * o.measureText("3").width, o.restore();
      s.width;
      return s;
    }, n.internal.calculateX = function(t, e, r, i) {
      var i = i || 12,
          r = r || "helvetica",
          o = {
            text: "",
            fontSize: ""
          };
      e = "(" == e.substr(0, 1) ? e.substr(1) : e, e = ")" == e.substr(e.length - 1) ? e.substr(0, e.length - 1) : e;
      var a = e.split(" "),
          s = i,
          c = 2,
          u = 2,
          l = n.Appearance.internal.getHeight(t) || 0;
      l = 0 > l ? -l : l;
      var h = n.Appearance.internal.getWidth(t) || 0;
      h = 0 > h ? -h : h;
      var f = function(t, e, i) {
        if (t + 1 < a.length) {
          var o = e + " " + a[t + 1],
              s = n.internal.calculateFontSpace(o, i + "px", r).width,
              c = h - 2 * u;
          return c >= s;
        }
        return !1;
      };
      s++;
      t: for (; ; ) {
        var e = "";
        s--;
        var d = n.internal.calculateFontSpace("3", s + "px", r).height,
            p = t.multiline ? l - s : (l - d) / 2;
        p += c;
        var m = -u,
            g = m,
            w = p,
            y = 0,
            v = 0,
            b = 0;
        if (0 == s) {
          s = 12, e = "(...) Tj\n", e += "% Width of Text: " + n.internal.calculateFontSpace(e, "1px").width + ", FieldWidth:" + h + "\n";
          break;
        }
        b = n.internal.calculateFontSpace(a[0] + " ", s + "px", r).width;
        var x = "",
            k = 0;
        for (var S in a) {
          x += a[S] + " ", x = " " == x.substr(x.length - 1) ? x.substr(0, x.length - 1) : x;
          var C = parseInt(S);
          b = n.internal.calculateFontSpace(x + " ", s + "px", r).width;
          var A = f(C, x, s),
              q = S >= a.length - 1;
          if (!A || q) {
            if (A || q) {
              if (q)
                v = C;
              else if (t.multiline && (d + c) * (k + 2) + c > l)
                continue t;
            } else {
              if (!t.multiline)
                continue t;
              if ((d + c) * (k + 2) + c > l)
                continue t;
              v = C;
            }
            for (var _ = "",
                P = y; v >= P; P++)
              _ += a[P] + " ";
            switch (_ = " " == _.substr(_.length - 1) ? _.substr(0, _.length - 1) : _, b = n.internal.calculateFontSpace(_, s + "px", r).width, t.Q) {
              case 2:
                m = h - b - u;
                break;
              case 1:
                m = (h - b) / 2;
                break;
              case 0:
              default:
                m = u;
            }
            e += m + " " + w + " Td\n", e += "(" + _ + ") Tj\n", e += -m + " 0 Td\n", w = -(s + c), g = m, b = 0, y = v + 1, k++, x = "";
          } else
            x += " ";
        }
        break;
      }
      return o.text = e, o.fontSize = s, o;
    }, n.internal.calculateAppearanceStream = function(t) {
      if (t.appearanceStreamContent)
        return t.appearanceStreamContent;
      if (t.V || t.DV) {
        var e = "",
            r = t.V || t.DV,
            i = n.internal.calculateX(t, r);
        e += "/Tx BMC\nq\n/F1 " + i.fontSize + " Tf\n1 0 0 1 0 0 Tm\n", e += "BT\n", e += i.text, e += "ET\n", e += "Q\nEMC\n";
        var o = new n.createFormXObject(t);
        o.stream = e;
        return o;
      }
    }, n.internal.calculateCoordinates = function(t, e, r, i) {
      var o = {};
      if (this.internal) {
        var a = function(t) {
          return t * this.internal.scaleFactor;
        };
        Array.isArray(t) ? (t[0] = n.scale(t[0]), t[1] = n.scale(t[1]), t[2] = n.scale(t[2]), t[3] = n.scale(t[3]), o.lowerLeft_X = 0 | t[0], o.lowerLeft_Y = a.call(this, this.internal.pageSize.height) - t[3] - t[1] | 0, o.upperRight_X = t[0] + t[2] | 0, o.upperRight_Y = a.call(this, this.internal.pageSize.height) - t[1] | 0) : (t = n.scale(t), e = n.scale(e), r = n.scale(r), i = n.scale(i), o.lowerLeft_X = 0 | t, o.lowerLeft_Y = this.internal.pageSize.height - e | 0, o.upperRight_X = t + r | 0, o.upperRight_Y = this.internal.pageSize.height - e + i | 0);
      } else
        Array.isArray(t) ? (o.lowerLeft_X = 0 | t[0], o.lowerLeft_Y = 0 | t[1], o.upperRight_X = t[0] + t[2] | 0, o.upperRight_Y = t[1] + t[3] | 0) : (o.lowerLeft_X = 0 | t, o.lowerLeft_Y = 0 | e, o.upperRight_X = t + r | 0, o.upperRight_Y = e + i | 0);
      return [o.lowerLeft_X, o.lowerLeft_Y, o.upperRight_X, o.upperRight_Y];
    }, n.internal.calculateColor = function(t, e, n) {
      var r = new Array(3);
      return r.r = 0 | t, r.g = 0 | e, r.b = 0 | n, r;
    }, n.internal.getBitPosition = function(t, e) {
      t = t || 0;
      var n = 1;
      return n <<= e - 1, t | n;
    }, n.internal.setBitPosition = function(t, e, n) {
      t = t || 0, n = n || 1;
      var r = 1;
      if (r <<= e - 1, 1 == n)
        var t = t | r;
      else
        var t = t & ~r;
      return t;
    }, function(t) {
      t.addHTML = function(t, e, n, r, i) {
        if ("undefined" == typeof html2canvas && "undefined" == typeof rasterizeHTML)
          throw new Error("You need either https://github.com/niklasvh/html2canvas or https://github.com/cburgmer/rasterizeHTML.js");
        "number" != typeof e && (r = e, i = n), "function" == typeof r && (i = r, r = null);
        var o = this.internal,
            a = o.scaleFactor,
            s = o.pageSize.width,
            c = o.pageSize.height;
        if (r = r || {}, r.onrendered = function(t) {
          e = parseInt(e) || 0, n = parseInt(n) || 0;
          var o = r.dim || {},
              u = o.h || 0,
              l = o.w || Math.min(s, t.width / a) - e,
              h = "JPEG";
          if (r.format && (h = r.format), t.height > c && r.pagesplit) {
            var f = function() {
              for (var r = 0; ; ) {
                var o = document.createElement("canvas");
                o.width = Math.min(s * a, t.width), o.height = Math.min(c * a, t.height - r);
                var u = o.getContext("2d");
                u.drawImage(t, 0, r, t.width, o.height, 0, 0, o.width, o.height);
                var f = [o, e, r ? 0 : n, o.width / a, o.height / a, h, null, "SLOW"];
                if (this.addImage.apply(this, f), r += o.height, r >= t.height)
                  break;
                this.addPage();
              }
              i(l, r, null, f);
            }.bind(this);
            if ("CANVAS" === t.nodeName) {
              var d = new Image;
              d.onload = f, d.src = t.toDataURL("image/png"), t = d;
            } else
              f();
          } else {
            var p = Math.random().toString(35),
                m = [t, e, n, l, u, h, p, "SLOW"];
            this.addImage.apply(this, m), i(l, u, p, m);
          }
        }.bind(this), "undefined" != typeof html2canvas && !r.rstz)
          return html2canvas(t, r);
        if ("undefined" != typeof rasterizeHTML) {
          var u = "drawDocument";
          return "string" == typeof t && (u = /^http/.test(t) ? "drawURL" : "drawHTML"), r.width = r.width || s * a, rasterizeHTML[u](t, void 0, r).then(function(t) {
            r.onrendered(t.image);
          }, function(t) {
            i(null, t);
          });
        }
        return null;
      };
    }(e.API), function(e) {
      var n = "addImage_",
          r = ["jpeg", "jpg", "png"],
          i = function k(t) {
            var e = this.internal.newObject(),
                n = this.internal.write,
                r = this.internal.putStream;
            if (t.n = e, n("<</Type /XObject"), n("/Subtype /Image"), n("/Width " + t.w), n("/Height " + t.h), t.cs === this.color_spaces.INDEXED ? n("/ColorSpace [/Indexed /DeviceRGB " + (t.pal.length / 3 - 1) + " " + ("smask" in t ? e + 2 : e + 1) + " 0 R]") : (n("/ColorSpace /" + t.cs), t.cs === this.color_spaces.DEVICE_CMYK && n("/Decode [1 0 1 0 1 0 1 0]")), n("/BitsPerComponent " + t.bpc), "f" in t && n("/Filter /" + t.f), "dp" in t && n("/DecodeParms <<" + t.dp + ">>"), "trns" in t && t.trns.constructor == Array) {
              for (var i = "",
                  o = 0,
                  a = t.trns.length; a > o; o++)
                i += t.trns[o] + " " + t.trns[o] + " ";
              n("/Mask [" + i + "]");
            }
            if ("smask" in t && n("/SMask " + (e + 1) + " 0 R"), n("/Length " + t.data.length + ">>"), r(t.data), n("endobj"), "smask" in t) {
              var s = "/Predictor 15 /Colors 1 /BitsPerComponent " + t.bpc + " /Columns " + t.w,
                  c = {
                    w: t.w,
                    h: t.h,
                    cs: "DeviceGray",
                    bpc: t.bpc,
                    dp: s,
                    data: t.smask
                  };
              "f" in t && (c.f = t.f), k.call(this, c);
            }
            t.cs === this.color_spaces.INDEXED && (this.internal.newObject(), n("<< /Length " + t.pal.length + ">>"), r(this.arrayBufferToBinaryString(new Uint8Array(t.pal))), n("endobj"));
          },
          o = function() {
            var t = this.internal.collections[n + "images"];
            for (var e in t)
              i.call(this, t[e]);
          },
          a = function() {
            var t,
                e = this.internal.collections[n + "images"],
                r = this.internal.write;
            for (var i in e)
              t = e[i], r("/I" + t.i, t.n, "0", "R");
          },
          s = function(t) {
            return t && "string" == typeof t && (t = t.toUpperCase()), t in e.image_compression ? t : e.image_compression.NONE;
          },
          c = function() {
            var t = this.internal.collections[n + "images"];
            return t || (this.internal.collections[n + "images"] = t = {}, this.internal.events.subscribe("putResources", o), this.internal.events.subscribe("putXobjectDict", a)), t;
          },
          u = function(t) {
            var e = 0;
            return t && (e = Object.keys ? Object.keys(t).length : function(t) {
              var e = 0;
              for (var n in t)
                t.hasOwnProperty(n) && e++;
              return e;
            }(t)), e;
          },
          l = function(t) {
            return "undefined" == typeof t || null === t;
          },
          h = function(t) {
            return "string" == typeof t && e.sHashCode(t);
          },
          f = function(t) {
            return -1 === r.indexOf(t);
          },
          d = function(t) {
            return "function" != typeof e["process" + t.toUpperCase()];
          },
          p = function(e) {
            return "object" === ("undefined" == typeof e ? "undefined" : t["typeof"](e)) && 1 === e.nodeType;
          },
          m = function(e, n, r) {
            if ("IMG" === e.nodeName && e.hasAttribute("src")) {
              var i = "" + e.getAttribute("src");
              if (!r && 0 === i.indexOf("data:image/"))
                return i;
              !n && /\.png(?:[?#].*)?$/i.test(i) && (n = "png");
            }
            if ("CANVAS" === e.nodeName)
              var o = e;
            else {
              var o = document.createElement("canvas");
              o.width = e.clientWidth || e.width, o.height = e.clientHeight || e.height;
              var a = o.getContext("2d");
              if (!a)
                throw "addImage requires canvas to be supported by browser.";
              if (r) {
                var s,
                    c,
                    u,
                    l,
                    h,
                    f,
                    d,
                    p,
                    m = Math.PI / 180;
                "object" === ("undefined" == typeof r ? "undefined" : t["typeof"](r)) && (s = r.x, c = r.y, u = r.bg, r = r.angle), p = r * m, l = Math.abs(Math.cos(p)), h = Math.abs(Math.sin(p)), f = o.width, d = o.height, o.width = d * h + f * l, o.height = d * l + f * h, isNaN(s) && (s = o.width / 2), isNaN(c) && (c = o.height / 2), a.clearRect(0, 0, o.width, o.height), a.fillStyle = u || "white", a.fillRect(0, 0, o.width, o.height), a.save(), a.translate(s, c), a.rotate(p), a.drawImage(e, -(f / 2), -(d / 2)), a.rotate(-p), a.translate(-s, -c), a.restore();
              } else
                a.drawImage(e, 0, 0, o.width, o.height);
            }
            return o.toDataURL("png" == ("" + n).toLowerCase() ? "image/png" : "image/jpeg");
          },
          g = function(t, e) {
            var n;
            if (e)
              for (var r in e)
                if (t === e[r].alias) {
                  n = e[r];
                  break;
                }
            return n;
          },
          w = function(t, e, n) {
            return t || e || (t = -96, e = -96), 0 > t && (t = -1 * n.w * 72 / t / this.internal.scaleFactor), 0 > e && (e = -1 * n.h * 72 / e / this.internal.scaleFactor), 0 === t && (t = e * n.w / n.h), 0 === e && (e = t * n.h / n.w), [t, e];
          },
          y = function(t, e, n, r, i, o, a) {
            var s = w.call(this, n, r, i),
                c = this.internal.getCoordinateString,
                u = this.internal.getVerticalCoordinateString;
            n = s[0], r = s[1], a[o] = i, this.internal.write("q", c(n), "0 0", c(-r), c(t), u(e + r), "cm /I" + i.i, "Do Q");
          };
      e.color_spaces = {
        DEVICE_RGB: "DeviceRGB",
        DEVICE_GRAY: "DeviceGray",
        DEVICE_CMYK: "DeviceCMYK",
        CAL_GREY: "CalGray",
        CAL_RGB: "CalRGB",
        LAB: "Lab",
        ICC_BASED: "ICCBased",
        INDEXED: "Indexed",
        PATTERN: "Pattern",
        SEPERATION: "Seperation",
        DEVICE_N: "DeviceN"
      }, e.decode = {
        DCT_DECODE: "DCTDecode",
        FLATE_DECODE: "FlateDecode",
        LZW_DECODE: "LZWDecode",
        JPX_DECODE: "JPXDecode",
        JBIG2_DECODE: "JBIG2Decode",
        ASCII85_DECODE: "ASCII85Decode",
        ASCII_HEX_DECODE: "ASCIIHexDecode",
        RUN_LENGTH_DECODE: "RunLengthDecode",
        CCITT_FAX_DECODE: "CCITTFaxDecode"
      }, e.image_compression = {
        NONE: "NONE",
        FAST: "FAST",
        MEDIUM: "MEDIUM",
        SLOW: "SLOW"
      }, e.sHashCode = function(t) {
        return Array.prototype.reduce && t.split("").reduce(function(t, e) {
          return t = (t << 5) - t + e.charCodeAt(0), t & t;
        }, 0);
      }, e.isString = function(t) {
        return "string" == typeof t;
      }, e.extractInfoFromBase64DataURI = function(t) {
        return /^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(t);
      }, e.supportsArrayBuffer = function() {
        return "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array;
      }, e.isArrayBuffer = function(t) {
        return this.supportsArrayBuffer() ? t instanceof ArrayBuffer : !1;
      }, e.isArrayBufferView = function(t) {
        return this.supportsArrayBuffer() ? "undefined" == typeof Uint32Array ? !1 : t instanceof Int8Array || t instanceof Uint8Array || "undefined" != typeof Uint8ClampedArray && t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array || t instanceof Float64Array : !1;
      }, e.binaryStringToUint8Array = function(t) {
        for (var e = t.length,
            n = new Uint8Array(e),
            r = 0; e > r; r++)
          n[r] = t.charCodeAt(r);
        return n;
      }, e.arrayBufferToBinaryString = function(t) {
        if ("TextDecoder" in window) {
          var e = new TextDecoder("ascii");
          return e.decode(t);
        }
        this.isArrayBuffer(t) && (t = new Uint8Array(t));
        for (var n = "",
            r = t.byteLength,
            i = 0; r > i; i++)
          n += String.fromCharCode(t[i]);
        return n;
      }, e.arrayBufferToBase64 = function(t) {
        for (var e,
            n,
            r,
            i,
            o,
            a = "",
            s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            c = new Uint8Array(t),
            u = c.byteLength,
            l = u % 3,
            h = u - l,
            f = 0; h > f; f += 3)
          o = c[f] << 16 | c[f + 1] << 8 | c[f + 2], e = (16515072 & o) >> 18, n = (258048 & o) >> 12, r = (4032 & o) >> 6, i = 63 & o, a += s[e] + s[n] + s[r] + s[i];
        return 1 == l ? (o = c[h], e = (252 & o) >> 2, n = (3 & o) << 4, a += s[e] + s[n] + "==") : 2 == l && (o = c[h] << 8 | c[h + 1], e = (64512 & o) >> 10, n = (1008 & o) >> 4, r = (15 & o) << 2, a += s[e] + s[n] + s[r] + "="), a;
      }, e.createImageInfo = function(t, e, n, r, i, o, a, s, c, u, l, h) {
        var f = {
          alias: s,
          w: e,
          h: n,
          cs: r,
          bpc: i,
          i: a,
          data: t
        };
        return o && (f.f = o), c && (f.dp = c), u && (f.trns = u), l && (f.pal = l), h && (f.smask = h), f;
      }, e.addImage = function(e, n, i, o, a, w, v, b, x) {
        if ("string" != typeof n) {
          var k = w;
          w = a, a = o, o = i, i = n, n = k;
        }
        if ("object" === ("undefined" == typeof e ? "undefined" : t["typeof"](e)) && !p(e) && "imageData" in e) {
          var S = e;
          e = S.imageData, n = S.format || n, i = S.x || i || 0, o = S.y || o || 0, a = S.w || a, w = S.h || w, v = S.alias || v, b = S.compression || b, x = S.rotation || S.angle || x;
        }
        if (isNaN(i) || isNaN(o))
          throw console.error("jsPDF.addImage: Invalid coordinates", arguments), new Error("Invalid coordinates passed to jsPDF.addImage");
        var C,
            A = c.call(this);
        if (!(C = g(e, A))) {
          var q;
          if (p(e) && (e = m(e, n, x)), l(v) && (v = h(e)), !(C = g(v, A))) {
            if (this.isString(e)) {
              var _ = this.extractInfoFromBase64DataURI(e);
              _ ? (n = _[2], e = atob(_[3])) : 137 === e.charCodeAt(0) && 80 === e.charCodeAt(1) && 78 === e.charCodeAt(2) && 71 === e.charCodeAt(3) && (n = "png");
            }
            if (n = (n || "JPEG").toLowerCase(), f(n))
              throw new Error("addImage currently only supports formats " + r + ", not '" + n + "'");
            if (d(n))
              throw new Error("please ensure that the plugin for '" + n + "' support is added");
            if (this.supportsArrayBuffer() && (e instanceof Uint8Array || (q = e, e = this.binaryStringToUint8Array(e))), C = this["process" + n.toUpperCase()](e, u(A), v, s(b), q), !C)
              throw new Error("An unkwown error occurred whilst processing the image");
          }
        }
        return y.call(this, i, o, a, w, C, C.i, A), this;
      };
      var v = function(t) {
        var e,
            n,
            r;
        if (255 === !t.charCodeAt(0) || 216 === !t.charCodeAt(1) || 255 === !t.charCodeAt(2) || 224 === !t.charCodeAt(3) || !t.charCodeAt(6) === "J".charCodeAt(0) || !t.charCodeAt(7) === "F".charCodeAt(0) || !t.charCodeAt(8) === "I".charCodeAt(0) || !t.charCodeAt(9) === "F".charCodeAt(0) || 0 === !t.charCodeAt(10))
          throw new Error("getJpegSize requires a binary string jpeg file");
        for (var i = 256 * t.charCodeAt(4) + t.charCodeAt(5),
            o = 4,
            a = t.length; a > o; ) {
          if (o += i, 255 !== t.charCodeAt(o))
            throw new Error("getJpegSize could not find the size of the image");
          if (192 === t.charCodeAt(o + 1) || 193 === t.charCodeAt(o + 1) || 194 === t.charCodeAt(o + 1) || 195 === t.charCodeAt(o + 1) || 196 === t.charCodeAt(o + 1) || 197 === t.charCodeAt(o + 1) || 198 === t.charCodeAt(o + 1) || 199 === t.charCodeAt(o + 1))
            return n = 256 * t.charCodeAt(o + 5) + t.charCodeAt(o + 6), e = 256 * t.charCodeAt(o + 7) + t.charCodeAt(o + 8), r = t.charCodeAt(o + 9), [e, n, r];
          o += 2, i = 256 * t.charCodeAt(o) + t.charCodeAt(o + 1);
        }
      },
          b = function(t) {
            var e = t[0] << 8 | t[1];
            if (65496 !== e)
              throw new Error("Supplied data is not a JPEG");
            for (var n,
                r,
                i,
                o,
                a = t.length,
                s = (t[4] << 8) + t[5],
                c = 4; a > c; ) {
              if (c += s, n = x(t, c), s = (n[2] << 8) + n[3], (192 === n[1] || 194 === n[1]) && 255 === n[0] && s > 7)
                return n = x(t, c + 5), r = (n[2] << 8) + n[3], i = (n[0] << 8) + n[1], o = n[4], {
                  width: r,
                  height: i,
                  numcomponents: o
                };
              c += 2;
            }
            throw new Error("getJpegSizeFromBytes could not find the size of the image");
          },
          x = function(t, e) {
            return t.subarray(e, e + 5);
          };
      e.processJPEG = function(t, e, n, r, i) {
        var o,
            a = this.color_spaces.DEVICE_RGB,
            s = this.decode.DCT_DECODE,
            c = 8;
        return this.isString(t) ? (o = v(t), this.createImageInfo(t, o[0], o[1], 1 == o[3] ? this.color_spaces.DEVICE_GRAY : a, c, s, e, n)) : (this.isArrayBuffer(t) && (t = new Uint8Array(t)), this.isArrayBufferView(t) ? (o = b(t), t = i || this.arrayBufferToBinaryString(t), this.createImageInfo(t, o.width, o.height, 1 == o.numcomponents ? this.color_spaces.DEVICE_GRAY : a, c, s, e, n)) : null);
      }, e.processJPG = function() {
        return this.processJPEG.apply(this, arguments);
      };
    }(e.API), function(t) {
      var n = {
        annotations: [],
        f2: function(t) {
          return t.toFixed(2);
        },
        notEmpty: function(t) {
          return "undefined" != typeof t && "" != t ? !0 : void 0;
        }
      };
      return e.API.annotationPlugin = n, e.API.events.push(["addPage", function(t) {
        this.annotationPlugin.annotations[t.pageNumber] = [];
      }]), t.events.push(["putPage", function(t) {
        for (var e = this.annotationPlugin.annotations[t.pageNumber],
            r = !1,
            i = 0; i < e.length && !r; i++) {
          var o = e[i];
          switch (o.type) {
            case "link":
              if (n.notEmpty(o.options.url) || n.notEmpty(o.options.pageNumber)) {
                r = !0;
                break;
              }
            case "reference":
            case "text":
            case "freetext":
              r = !0;
          }
        }
        if (0 != r) {
          this.internal.write("/Annots [");
          for (var a = this.annotationPlugin.f2,
              s = this.internal.scaleFactor,
              c = this.internal.pageSize.height,
              u = this.internal.getPageInfo(t.pageNumber),
              i = 0; i < e.length; i++) {
            var o = e[i];
            switch (o.type) {
              case "reference":
                this.internal.write(" " + o.object.objId + " 0 R ");
                break;
              case "text":
                var l = this.internal.newAdditionalObject(),
                    h = this.internal.newAdditionalObject(),
                    f = o.title || "Note",
                    d = "/Rect [" + a(o.bounds.x * s) + " " + a(c - (o.bounds.y + o.bounds.h) * s) + " " + a((o.bounds.x + o.bounds.w) * s) + " " + a((c - o.bounds.y) * s) + "] ";
                y = "<</Type /Annot /Subtype /Text " + d + "/Contents (" + o.contents + ")", y += " /Popup " + h.objId + " 0 R", y += " /P " + u.objId + " 0 R", y += " /T (" + f + ") >>", l.content = y;
                var p = l.objId + " 0 R",
                    m = 30,
                    d = "/Rect [" + a((o.bounds.x + m) * s) + " " + a(c - (o.bounds.y + o.bounds.h) * s) + " " + a((o.bounds.x + o.bounds.w + m) * s) + " " + a((c - o.bounds.y) * s) + "] ";
                y = "<</Type /Annot /Subtype /Popup " + d + " /Parent " + p, o.open && (y += " /Open true"), y += " >>", h.content = y, this.internal.write(l.objId, "0 R", h.objId, "0 R");
                break;
              case "freetext":
                var d = "/Rect [" + a(o.bounds.x * s) + " " + a((c - o.bounds.y) * s) + " " + a(o.bounds.x + o.bounds.w * s) + " " + a(c - (o.bounds.y + o.bounds.h) * s) + "] ",
                    g = o.color || "#000000";
                y = "<</Type /Annot /Subtype /FreeText " + d + "/Contents (" + o.contents + ")", y += " /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#" + g + ")", y += " /Border [0 0 0]", y += " >>", this.internal.write(y);
                break;
              case "link":
                if (o.options.name) {
                  var w = this.annotations._nameMap[o.options.name];
                  o.options.pageNumber = w.page, o.options.top = w.y;
                } else
                  o.options.top || (o.options.top = 0);
                var d = "/Rect [" + a(o.x * s) + " " + a((c - o.y) * s) + " " + a(o.x + o.w * s) + " " + a(c - (o.y + o.h) * s) + "] ",
                    y = "";
                if (o.options.url)
                  y = "<</Type /Annot /Subtype /Link " + d + "/Border [0 0 0] /A <</S /URI /URI (" + o.options.url + ") >>";
                else if (o.options.pageNumber) {
                  var t = this.internal.getPageInfo(o.options.pageNumber);
                  switch (y = "<</Type /Annot /Subtype /Link " + d + "/Border [0 0 0] /Dest [" + t.objId + " 0 R", o.options.magFactor = o.options.magFactor || "XYZ", o.options.magFactor) {
                    case "Fit":
                      y += " /Fit]";
                      break;
                    case "FitH":
                      y += " /FitH " + o.options.top + "]";
                      break;
                    case "FitV":
                      o.options.left = o.options.left || 0, y += " /FitV " + o.options.left + "]";
                      break;
                    case "XYZ":
                    default:
                      var v = a((c - o.options.top) * s);
                      o.options.left = o.options.left || 0, "undefined" == typeof o.options.zoom && (o.options.zoom = 0), y += " /XYZ " + o.options.left + " " + v + " " + o.options.zoom + "]";
                  }
                }
                "" != y && (y += " >>", this.internal.write(y));
            }
          }
          this.internal.write("]");
        }
      }]), t.createAnnotation = function(t) {
        switch (t.type) {
          case "link":
            this.link(t.bounds.x, t.bounds.y, t.bounds.w, t.bounds.h, t);
            break;
          case "text":
          case "freetext":
            this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push(t);
        }
      }, t.link = function(t, e, n, r, i) {
        this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push({
          x: t,
          y: e,
          w: n,
          h: r,
          options: i,
          type: "link"
        });
      }, t.link = function(t, e, n, r, i) {
        this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push({
          x: t,
          y: e,
          w: n,
          h: r,
          options: i,
          type: "link"
        });
      }, t.textWithLink = function(t, e, n, r) {
        var i = this.getTextWidth(t),
            o = this.internal.getLineHeight();
        return this.text(t, e, n), n += .2 * o, this.link(e, n - o, i, o, r), i;
      }, t.getTextWidth = function(t) {
        var e = this.internal.getFontSize(),
            n = this.getStringUnitWidth(t) * e / this.internal.scaleFactor;
        return n;
      }, t.getLineHeight = function() {
        return this.internal.getLineHeight();
      }, this;
    }(e.API), function(t) {
      t.autoPrint = function() {
        var t;
        return this.internal.events.subscribe("postPutResources", function() {
          t = this.internal.newObject(), this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj");
        }), this.internal.events.subscribe("putCatalog", function() {
          this.internal.write("/OpenAction " + t + " 0 R");
        }), this;
      };
    }(e.API), function(t) {
      return t.events.push(["initialized", function() {
        this.canvas.pdf = this;
      }]), t.canvas = {
        getContext: function(t) {
          return this.pdf.context2d;
        },
        style: {}
      }, Object.defineProperty(t.canvas, "width", {
        get: function() {
          return this._width;
        },
        set: function(t) {
          this._width = t, this.getContext("2d").pageWrapX = t + 1;
        }
      }), Object.defineProperty(t.canvas, "height", {
        get: function() {
          return this._height;
        },
        set: function(t) {
          this._height = t, this.getContext("2d").pageWrapY = t + 1;
        }
      }), this;
    }(e.API), function(t) {
      var e,
          n,
          r,
          i,
          o = 3,
          a = 13,
          s = {
            x: void 0,
            y: void 0,
            w: void 0,
            h: void 0,
            ln: void 0
          },
          c = 1,
          u = function(t, e, n, r, i) {
            s = {
              x: t,
              y: e,
              w: n,
              h: r,
              ln: i
            };
          },
          l = function() {
            return s;
          },
          h = {
            left: 0,
            top: 0,
            bottom: 0
          };
      t.setHeaderFunction = function(t) {
        i = t;
      }, t.getTextDimensions = function(t) {
        e = this.internal.getFont().fontName, n = this.table_font_size || this.internal.getFontSize(), r = this.internal.getFont().fontStyle;
        var i,
            o,
            a = 19.049976 / 25.4;
        o = document.createElement("font"), o.id = "jsPDFCell";
        try {
          o.style.fontStyle = r;
        } catch (s) {
          o.style.fontWeight = r;
        }
        o.style.fontName = e, o.style.fontSize = n + "pt";
        try {
          o.textContent = t;
        } catch (s) {
          o.innerText = t;
        }
        return document.body.appendChild(o), i = {
          w: (o.offsetWidth + 1) * a,
          h: (o.offsetHeight + 1) * a
        }, document.body.removeChild(o), i;
      }, t.cellAddPage = function() {
        var t = this.margins || h;
        this.addPage(), u(t.left, t.top, void 0, void 0), c += 1;
      }, t.cellInitialize = function() {
        s = {
          x: void 0,
          y: void 0,
          w: void 0,
          h: void 0,
          ln: void 0
        }, c = 1;
      }, t.cell = function(t, e, n, r, i, s, c) {
        var f = l(),
            d = !1;
        if (void 0 !== f.ln)
          if (f.ln === s)
            t = f.x + f.w, e = f.y;
          else {
            var p = this.margins || h;
            f.y + f.h + r + a >= this.internal.pageSize.height - p.bottom && (this.cellAddPage(), d = !0, this.printHeaders && this.tableHeaderRow && this.printHeaderRow(s, !0)), e = l().y + l().h, d && (e = a + 10);
          }
        if (void 0 !== i[0])
          if (this.printingHeaderRow ? this.rect(t, e, n, r, "FD") : this.rect(t, e, n, r), "right" === c) {
            i instanceof Array || (i = [i]);
            for (var m = 0; m < i.length; m++) {
              var g = i[m],
                  w = this.getStringUnitWidth(g) * this.internal.getFontSize();
              this.text(g, t + n - w - o, e + this.internal.getLineHeight() * (m + 1));
            }
          } else
            this.text(i, t + o, e + this.internal.getLineHeight());
        return u(t, e, n, r, s), this;
      }, t.arrayMax = function(t, e) {
        var n,
            r,
            i,
            o = t[0];
        for (n = 0, r = t.length; r > n; n += 1)
          i = t[n], e ? -1 === e(o, i) && (o = i) : i > o && (o = i);
        return o;
      }, t.table = function(e, n, r, i, o) {
        if (!r)
          throw "No data for PDF table";
        var a,
            u,
            l,
            f,
            d,
            p,
            m,
            g,
            w,
            y,
            v = [],
            b = [],
            x = {},
            k = {},
            S = [],
            C = [],
            A = !1,
            q = !0,
            _ = 12,
            P = h;
        if (P.width = this.internal.pageSize.width, o && (o.autoSize === !0 && (A = !0), o.printHeaders === !1 && (q = !1), o.fontSize && (_ = o.fontSize), o.css["font-size"] && (_ = 16 * o.css["font-size"]), o.margins && (P = o.margins)), this.lnMod = 0, s = {
          x: void 0,
          y: void 0,
          w: void 0,
          h: void 0,
          ln: void 0
        }, c = 1, this.printHeaders = q, this.margins = P, this.setFontSize(_), this.table_font_size = _, void 0 === i || null === i)
          v = Object.keys(r[0]);
        else if (i[0] && "string" != typeof i[0]) {
          var T = 19.049976 / 25.4;
          for (u = 0, l = i.length; l > u; u += 1)
            a = i[u], v.push(a.name), b.push(a.prompt), k[a.name] = a.width * T;
        } else
          v = i;
        if (A)
          for (y = function(t) {
            return t[a];
          }, u = 0, l = v.length; l > u; u += 1) {
            for (a = v[u], x[a] = r.map(y), S.push(this.getTextDimensions(b[u] || a).w), p = x[a], m = 0, f = p.length; f > m; m += 1)
              d = p[m], S.push(this.getTextDimensions(d).w);
            k[a] = t.arrayMax(S), S = [];
          }
        if (q) {
          var E = this.calculateLineHeight(v, k, b.length ? b : v);
          for (u = 0, l = v.length; l > u; u += 1)
            a = v[u], C.push([e, n, k[a], E, String(b.length ? b[u] : a)]);
          this.setTableHeaderRow(C), this.printHeaderRow(1, !1);
        }
        for (u = 0, l = r.length; l > u; u += 1) {
          var E;
          for (g = r[u], E = this.calculateLineHeight(v, k, g), m = 0, w = v.length; w > m; m += 1)
            a = v[m], this.cell(e, n, k[a], E, g[a], u + 2, a.align);
        }
        return this.lastCellPos = s, this.table_x = e, this.table_y = n, this;
      }, t.calculateLineHeight = function(t, e, n) {
        for (var r,
            i = 0,
            a = 0; a < t.length; a++) {
          r = t[a], n[r] = this.splitTextToSize(String(n[r]), e[r] - o);
          var s = this.internal.getLineHeight() * n[r].length + o;
          s > i && (i = s);
        }
        return i;
      }, t.setTableHeaderRow = function(t) {
        this.tableHeaderRow = t;
      }, t.printHeaderRow = function(t, e) {
        if (!this.tableHeaderRow)
          throw "Property tableHeaderRow does not exist.";
        var n,
            r,
            o,
            s;
        if (this.printingHeaderRow = !0, void 0 !== i) {
          var l = i(this, c);
          u(l[0], l[1], l[2], l[3], -1);
        }
        this.setFontStyle("bold");
        var h = [];
        for (o = 0, s = this.tableHeaderRow.length; s > o; o += 1)
          this.setFillColor(200, 200, 200), n = this.tableHeaderRow[o], e && (this.margins.top = a, n[1] = this.margins && this.margins.top || 0, h.push(n)), r = [].concat(n), this.cell.apply(this, r.concat(t));
        h.length > 0 && this.setTableHeaderRow(h), this.setFontStyle("normal"), this.printingHeaderRow = !1;
      };
    }(e.API), function(t) {
      function e() {
        this.fillStyle = "#000000", this.strokeStyle = "#000000", this.font = "12pt times", this.textBaseline = "alphabetic", this.lineWidth = 1, this.lineJoin = "miter", this.lineCap = "butt", this._translate = {
          x: 0,
          y: 0
        }, this.copy = function(t) {
          this.fillStyle = t.fillStyle, this.strokeStyle = t.strokeStyle, this.font = t.font, this.lineWidth = t.lineWidth, this.lineJoin = t.lineJoin, this.lineCap = t.lineCap, this.textBaseline = t.textBaseline, this._fontSize = t._fontSize, this._translate = {
            x: t._translate.x,
            y: t._translate.y
          };
        };
      }
      t.events.push(["initialized", function() {
        this.context2d.pdf = this, this.context2d.internal.pdf = this, this.context2d.ctx = new e, this.context2d.ctxStack = [], this.context2d.path = [];
      }]), t.context2d = {
        pageWrapXEnabled: !1,
        pageWrapYEnabled: !0,
        pageWrapX: 9999999,
        pageWrapY: 9999999,
        f2: function(t) {
          return t.toFixed(2);
        },
        fillRect: function(t, e, n, r) {
          t = this._wrapX(t), e = this._wrapY(e), this.pdf.rect(t, e, n, r, "f");
        },
        strokeRect: function(t, e, n, r) {
          t = this._wrapX(t), e = this._wrapY(e), this.pdf.rect(t, e, n, r, "s");
        },
        clearRect: function(t, e, n, r) {
          t = this._wrapX(t), e = this._wrapY(e), this.save(), this.setFillStyle("#ffffff"), this.pdf.rect(t, e, n, r, "f"), this.restore();
        },
        save: function() {
          this.ctx._fontSize = this.pdf.internal.getFontSize();
          var t = new e;
          t.copy(this.ctx), this.ctxStack.push(this.ctx), this.ctx = t;
        },
        restore: function() {
          this.ctx = this.ctxStack.pop(), this.setFillStyle(this.ctx.fillStyle), this.setStrokeStyle(this.ctx.strokeStyle), this.setFont(this.ctx.font), this.pdf.setFontSize(this.ctx._fontSize), this.setLineCap(this.ctx.lineCap), this.setLineWidth(this.ctx.lineWidth), this.setLineJoin(this.ctx.lineJoin);
        },
        beginPath: function() {
          this.path = [];
        },
        closePath: function() {
          this.path.push({type: "close"});
        },
        setFillStyle: function(t) {
          var e,
              n,
              r,
              i,
              a = this.internal.rxRgb.exec(t);
          null != a ? (e = parseInt(a[1]), n = parseInt(a[2]), r = parseInt(a[3])) : (a = this.internal.rxRgba.exec(t), null != a ? (e = parseInt(a[1]), n = parseInt(a[2]), r = parseInt(a[3]), i = parseInt(a[4])) : ("#" != t.charAt(0) && (t = o.colorNameToHex(t), t || (t = "#000000")), this.ctx.fillStyle = t, 4 === t.length ? (e = this.ctx.fillStyle.substring(1, 2), e += e, n = this.ctx.fillStyle.substring(2, 3), n += n, r = this.ctx.fillStyle.substring(3, 4), r += r) : (e = this.ctx.fillStyle.substring(1, 3), n = this.ctx.fillStyle.substring(3, 5), r = this.ctx.fillStyle.substring(5, 7)), e = parseInt(e, 16), n = parseInt(n, 16), r = parseInt(r, 16))), this.pdf.setFillColor(e, n, r, {a: i}), this.pdf.setTextColor(e, n, r, {a: i});
        },
        setStrokeStyle: function(t) {
          "#" != t.charAt(0) && (t = o.colorNameToHex(t), t || (t = "#000000")), this.ctx.strokeStyle = t;
          var e = this.ctx.strokeStyle.substring(1, 3);
          e = parseInt(e, 16);
          var n = this.ctx.strokeStyle.substring(3, 5);
          n = parseInt(n, 16);
          var r = this.ctx.strokeStyle.substring(5, 7);
          r = parseInt(r, 16), this.pdf.setDrawColor(e, n, r);
        },
        fillText: function(t, e, n, r) {
          e = this._wrapX(e), n = this._wrapY(n), this.pdf.text(t, e, this._getBaseline(n));
        },
        strokeText: function(t, e, n, r) {
          e = this._wrapX(e), n = this._wrapY(n), this.pdf.text(t, e, this._getBaseline(n), {stroke: !0});
        },
        setFont: function(t) {
          this.ctx.font = t;
          var e = /\s*(\w+)\s+(\w+)\s+(\w+)\s+([\d\.]+)(px|pt|em)\s+["']?(\w+)['"]?/;
          if (c = e.exec(t), null != c) {
            var n = c[1],
                r = (c[2], c[3]),
                i = c[4],
                o = c[5],
                a = c[6];
            i = "px" === o ? Math.floor(parseFloat(i)) : "em" === o ? Math.floor(parseFloat(i) * this.pdf.getFontSize()) : Math.floor(parseFloat(i)), this.pdf.setFontSize(i), "bold" === r || "700" === r ? this.pdf.setFontStyle("bold") : "italic" === n ? this.pdf.setFontStyle("italic") : this.pdf.setFontStyle("normal");
            var s = a;
            this.pdf.setFont(s, l);
          } else {
            var e = /(\d+)(pt|px|em)\s+(\w+)\s*(\w+)?/,
                c = e.exec(t);
            if (null != c) {
              var u = c[1],
                  s = (c[2], c[3]),
                  l = c[4];
              l || (l = "normal"), u = "em" === o ? Math.floor(parseFloat(i) * this.pdf.getFontSize()) : Math.floor(parseFloat(u)), this.pdf.setFontSize(u), this.pdf.setFont(s, l);
            }
          }
        },
        setTextBaseline: function(t) {
          this.ctx.textBaseline = t;
        },
        getTextBaseline: function() {
          return this.ctx.textBaseline;
        },
        setLineWidth: function(t) {
          this.ctx.lineWidth = t, this.pdf.setLineWidth(t);
        },
        setLineCap: function(t) {
          this.ctx.lineCap = t, this.pdf.setLineCap(t);
        },
        setLineJoin: function(t) {
          this.ctx.lineJon = t, this.pdf.setLineJoin(t);
        },
        moveTo: function(t, e) {
          t = this._wrapX(t), e = this._wrapY(e);
          var n = {
            type: "mt",
            x: t,
            y: e
          };
          this.path.push(n);
        },
        _wrapX: function(t) {
          return this.pageWrapXEnabled ? t % this.pageWrapX : t;
        },
        _wrapY: function(t) {
          return this.pageWrapYEnabled ? (this._gotoPage(this._page(t)), (t - this.lastBreak) % this.pageWrapY) : t;
        },
        lastBreak: 0,
        pageBreaks: [],
        _page: function(t) {
          if (this.pageWrapYEnabled) {
            this.lastBreak = 0;
            for (var e = 0,
                n = 0,
                r = 0; r < this.pageBreaks.length; r++)
              if (t >= this.pageBreaks[r]) {
                e++, 0 === this.lastBreak && n++;
                var i = this.pageBreaks[r] - this.lastBreak;
                this.lastBreak = this.pageBreaks[r];
                var o = Math.floor(i / this.pageWrapY);
                n += o;
              }
            if (0 === this.lastBreak) {
              var o = Math.floor(t / this.pageWrapY) + 1;
              n += o;
            }
            return n + e;
          }
          return this.pdf.internal.getCurrentPageInfo().pageNumber;
        },
        _gotoPage: function(t) {},
        lineTo: function(t, e) {
          t = this._wrapX(t), e = this._wrapY(e);
          var n = {
            type: "lt",
            x: t,
            y: e
          };
          this.path.push(n);
        },
        bezierCurveTo: function(t, e, n, r, i, o) {
          t = this._wrapX(t), e = this._wrapY(e), n = this._wrapX(n), r = this._wrapY(r), i = this._wrapX(i), o = this._wrapY(o);
          var a = {
            type: "bct",
            x1: t,
            y1: e,
            x2: n,
            y2: r,
            x: i,
            y: o
          };
          this.path.push(a);
        },
        quadraticCurveTo: function(t, e, n, r) {
          t = this._wrapX(t), e = this._wrapY(e), n = this._wrapX(n), r = this._wrapY(r);
          var i = {
            type: "qct",
            x1: t,
            y1: e,
            x: n,
            y: r
          };
          this.path.push(i);
        },
        arc: function(t, e, n, r, i, o) {
          t = this._wrapX(t), e = this._wrapY(e);
          var a = {
            type: "arc",
            x: t,
            y: e,
            radius: n,
            startAngle: r,
            endAngle: i,
            anticlockwise: o
          };
          this.path.push(a);
        },
        drawImage: function(t, e, n, r, i, o, a, s, c) {
          void 0 !== o && (e = o, n = a, r = s, i = c), e = this._wrapX(e), n = this._wrapY(n);
          var u,
              l = /data:image\/(\w+).*/i,
              h = l.exec(t);
          u = null != h ? h[1] : "png", this.pdf.addImage(t, u, e, n, r, i);
        },
        stroke: function() {
          for (var t,
              e = [],
              n = !1,
              r = 0; r < this.path.length; r++) {
            var i = this.path[r];
            switch (i.type) {
              case "mt":
                t = i, "undefined" != typeof t && (this.pdf.lines(e, t.x, t.y, null, "s"), e = []);
                break;
              case "lt":
                var o = [i.x - this.path[r - 1].x, i.y - this.path[r - 1].y];
                e.push(o);
                break;
              case "bct":
                var o = [i.x1 - this.path[r - 1].x, i.y1 - this.path[r - 1].y, i.x2 - this.path[r - 1].x, i.y2 - this.path[r - 1].y, i.x - this.path[r - 1].x, i.y - this.path[r - 1].y];
                e.push(o);
                break;
              case "qct":
                var a = this.path[r - 1].x + 2 / 3 * (i.x1 - this.path[r - 1].x),
                    s = this.path[r - 1].y + 2 / 3 * (i.y1 - this.path[r - 1].y),
                    c = i.x + 2 / 3 * (i.x1 - i.x),
                    u = i.y + 2 / 3 * (i.y1 - i.y),
                    l = i.x,
                    h = i.y,
                    o = [a - this.path[r - 1].x, s - this.path[r - 1].y, c - this.path[r - 1].x, u - this.path[r - 1].y, l - this.path[r - 1].x, h - this.path[r - 1].y];
                e.push(o);
                break;
              case "close":
                n = !0;
            }
          }
          "undefined" != typeof t && this.pdf.lines(e, t.x, t.y, null, "s", n);
          for (var r = 0; r < this.path.length; r++) {
            var i = this.path[r];
            switch (i.type) {
              case "arc":
                var t = 360 * i.startAngle / (2 * Math.PI),
                    f = 360 * i.endAngle / (2 * Math.PI);
                this.internal.arc(i.x, i.y, i.radius, t, f, i.anticlockwise, "s");
            }
          }
          this.path = [];
        },
        fill: function() {
          for (var t,
              e = [],
              n = 0; n < this.path.length; n++) {
            var r = this.path[n];
            switch (r.type) {
              case "mt":
                t = r, "undefined" != typeof t && (this.pdf.lines(e, t.x, t.y, null, "f"), e = []);
                break;
              case "lt":
                var i = [r.x - this.path[n - 1].x, r.y - this.path[n - 1].y];
                e.push(i);
                break;
              case "bct":
                var i = [r.x1 - this.path[n - 1].x, r.y1 - this.path[n - 1].y, r.x2 - this.path[n - 1].x, r.y2 - this.path[n - 1].y, r.x - this.path[n - 1].x, r.y - this.path[n - 1].y];
                e.push(i);
                break;
              case "qct":
                var o = this.path[n - 1].x + 2 / 3 * (r.x1 - this.path[n - 1].x),
                    a = this.path[n - 1].y + 2 / 3 * (r.y1 - this.path[n - 1].y),
                    s = r.x + 2 / 3 * (r.x1 - r.x),
                    c = r.y + 2 / 3 * (r.y1 - r.y),
                    u = r.x,
                    l = r.y,
                    i = [o - this.path[n - 1].x, a - this.path[n - 1].y, s - this.path[n - 1].x, c - this.path[n - 1].y, u - this.path[n - 1].x, l - this.path[n - 1].y];
                e.push(i);
            }
          }
          "undefined" != typeof t && this.pdf.lines(e, t.x, t.y, null, "f");
          for (var n = 0; n < this.path.length; n++) {
            var r = this.path[n];
            switch (r.type) {
              case "arc":
                var t = 360 * r.startAngle / (2 * Math.PI),
                    h = 360 * r.endAngle / (2 * Math.PI);
                this.internal.arc(r.x, r.y, r.radius, t, h, r.anticlockwise, "f");
                break;
              case "close":
                this.pdf.internal.out("h");
            }
          }
          this.path = [];
        },
        clip: function() {},
        translate: function(t, e) {
          this.ctx._translate = {
            x: t,
            y: e
          };
        },
        measureText: function(t) {
          var e = this.pdf;
          return {
            getWidth: function() {
              var n = e.internal.getFontSize(),
                  r = e.getStringUnitWidth(t) * n / e.internal.scaleFactor;
              return r;
            },
            get width() {
              return this.getWidth(t);
            }
          };
        },
        _getBaseline: function(t) {
          var e = parseInt(this.pdf.internal.getFontSize()),
              n = .25 * e;
          switch (this.ctx.textBaseline) {
            case "bottom":
              return t - n;
            case "top":
              return t + e;
            case "hanging":
              return t + e - n;
            case "middle":
              return t + e / 2 - n;
            case "ideographic":
              return t;
            case "alphabetic":
            default:
              return t;
          }
        }
      };
      var n = t.context2d;
      return Object.defineProperty(n, "fillStyle", {
        set: function(t) {
          this.setFillStyle(t);
        },
        get: function() {
          return this.ctx.fillStyle;
        }
      }), Object.defineProperty(n, "textBaseline", {
        set: function(t) {
          this.setTextBaseline(t);
        },
        get: function() {
          return this.getTextBaseline();
        }
      }), Object.defineProperty(n, "font", {
        set: function(t) {
          this.setFont(t);
        },
        get: function() {
          return this.getFont();
        }
      }), n.internal = {}, n.internal.rxRgb = /rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/, n.internal.rxRgba = /rgba\s*\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/, n.internal.arc = function(t, e, n, r, i, o, a) {
        for (var s = this.pdf.internal.scaleFactor,
            c = this.pdf.internal.pageSize.height,
            u = this.pdf.internal.f2,
            l = r * (Math.PI / 180),
            h = i * (Math.PI / 180),
            f = this.createArc(n, l, h, o),
            d = 0; d < f.length; d++) {
          var p = f[d];
          0 == d ? this.pdf.internal.out([u((p.x1 + t) * s), u((c - (p.y1 + e)) * s), "m", u((p.x2 + t) * s), u((c - (p.y2 + e)) * s), u((p.x3 + t) * s), u((c - (p.y3 + e)) * s), u((p.x4 + t) * s), u((c - (p.y4 + e)) * s), "c"].join(" ")) : this.pdf.internal.out([u((p.x2 + t) * s), u((c - (p.y2 + e)) * s), u((p.x3 + t) * s), u((c - (p.y3 + e)) * s), u((p.x4 + t) * s), u((c - (p.y4 + e)) * s), "c"].join(" "));
        }
        null !== a && this.pdf.internal.out(this.pdf.internal.getStyle(a));
      }, n.internal.createArc = function(t, e, n, r) {
        var i = 1e-5,
            o = 2 * Math.PI,
            a = e;
        (o > a || a > o) && (a %= o);
        var s = n;
        (o > s || s > o) && (s %= o);
        for (var c = [],
            u = Math.PI / 2,
            l = r ? -1 : 1,
            h = e,
            f = Math.min(o, Math.abs(s - a)); f > i; ) {
          var d = h + l * Math.min(f, u);
          c.push(this.createSmallArc(t, h, d)), f -= Math.abs(d - h), h = d;
        }
        return c;
      }, n.internal.createSmallArc = function(t, e, n) {
        var r = (n - e) / 2,
            i = t * Math.cos(r),
            o = t * Math.sin(r),
            a = i,
            s = -o,
            c = a * a + s * s,
            u = c + a * i + s * o,
            l = 4 / 3 * (Math.sqrt(2 * c * u) - u) / (a * o - s * i),
            h = a - l * s,
            f = s + l * a,
            d = h,
            p = -f,
            m = r + e,
            g = Math.cos(m),
            w = Math.sin(m);
        return {
          x1: t * Math.cos(e),
          y1: t * Math.sin(e),
          x2: h * g - f * w,
          y2: h * w + f * g,
          x3: d * g - p * w,
          y3: d * w + p * g,
          x4: t * Math.cos(n),
          y4: t * Math.sin(n)
        };
      }, this;
    }(e.API), function(e) {
      var n,
          r,
          i,
          a,
          s,
          c,
          u,
          l,
          h,
          f,
          d,
          p,
          m,
          g,
          w,
          y,
          v,
          b,
          x,
          k;
      n = function() {
        function t() {}
        return function(e) {
          return t.prototype = e, new t;
        };
      }(), f = function(t) {
        var e,
            n,
            r,
            i,
            o,
            a,
            s;
        for (n = 0, r = t.length, e = void 0, i = !1, a = !1; !i && n !== r; )
          e = t[n] = t[n].trimLeft(), e && (i = !0), n++;
        for (n = r - 1; r && !a && -1 !== n; )
          e = t[n] = t[n].trimRight(), e && (a = !0), n--;
        for (o = /\s+$/g, s = !0, n = 0; n !== r; )
          "\u2028" != t[n] && (e = t[n].replace(/\s+/g, " "), s && (e = e.trimLeft()), e && (s = o.test(e)), t[n] = e), n++;
        return t;
      }, d = function(t, e, n, r) {
        return this.pdf = t, this.x = e, this.y = n, this.settings = r, this.watchFunctions = [], this.init(), this;
      }, p = function(t) {
        var e,
            n,
            r;
        for (e = void 0, r = t.split(","), n = r.shift(); !e && n; )
          e = i[n.trim().toLowerCase()], n = r.shift();
        return e;
      }, m = function(t) {
        t = "auto" === t ? "0px" : t, t.indexOf("em") > -1 && !isNaN(Number(t.replace("em", ""))) && (t = 18.719 * Number(t.replace("em", "")) + "px"), t.indexOf("pt") > -1 && !isNaN(Number(t.replace("pt", ""))) && (t = 1.333 * Number(t.replace("pt", "")) + "px");
        var e,
            n,
            r;
        return n = void 0, e = 16, (r = g[t]) ? r : (r = {
          "xx-small": 9,
          "x-small": 11,
          small: 13,
          medium: 16,
          large: 19,
          "x-large": 23,
          "xx-large": 28,
          auto: 0
        }[{css_line_height_string: t}], r !== n ? g[t] = r / e : (r = parseFloat(t)) ? g[t] = r / e : (r = t.match(/([\d\.]+)(px)/), 3 === r.length ? g[t] = parseFloat(r[1]) / e : g[t] = 1));
      }, h = function(t) {
        var e,
            n,
            r;
        return r = function(t) {
          var e;
          return e = function(t) {
            return document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(t, null) : t.currentStyle ? t.currentStyle : t.style;
          }(t), function(t) {
            return t = t.replace(/-\D/g, function(t) {
              return t.charAt(1).toUpperCase();
            }), e[t];
          };
        }(t), e = {}, n = void 0, e["font-family"] = p(r("font-family")) || "times", e["font-style"] = a[r("font-style")] || "normal", e["text-align"] = s[r("text-align")] || "left", n = c[r("font-weight")] || "normal", "bold" === n && ("normal" === e["font-style"] ? e["font-style"] = n : e["font-style"] = n + e["font-style"]), e["font-size"] = m(r("font-size")) || 1, e["line-height"] = m(r("line-height")) || 1, e.display = "inline" === r("display") ? "inline" : "block", n = "block" === e.display, e["margin-top"] = n && m(r("margin-top")) || 0, e["margin-bottom"] = n && m(r("margin-bottom")) || 0, e["padding-top"] = n && m(r("padding-top")) || 0, e["padding-bottom"] = n && m(r("padding-bottom")) || 0, e["margin-left"] = n && m(r("margin-left")) || 0, e["margin-right"] = n && m(r("margin-right")) || 0, e["padding-left"] = n && m(r("padding-left")) || 0, e["padding-right"] = n && m(r("padding-right")) || 0, e["page-break-before"] = r("page-break-before") || "auto", e["float"] = u[r("cssFloat")] || "none", e.clear = l[r("clear")] || "none", e.color = r("color"), e;
      }, w = function(t, e, n) {
        var r,
            i,
            o,
            a,
            s;
        if (o = !1, i = void 0, a = void 0, s = void 0, r = n["#" + t.id])
          if ("function" == typeof r)
            o = r(t, e);
          else
            for (i = 0, a = r.length; !o && i !== a; )
              o = r[i](t, e), i++;
        if (r = n[t.nodeName], !o && r)
          if ("function" == typeof r)
            o = r(t, e);
          else
            for (i = 0, a = r.length; !o && i !== a; )
              o = r[i](t, e), i++;
        return o;
      }, k = function(t, e) {
        var n,
            r,
            i,
            o,
            a,
            s,
            c,
            u,
            l,
            h;
        for (n = [], r = [], i = 0, h = t.rows[0].cells.length, u = t.clientWidth; h > i; )
          l = t.rows[0].cells[i], r[i] = {
            name: l.textContent.toLowerCase().replace(/\s+/g, ""),
            prompt: l.textContent.replace(/\r?\n/g, ""),
            width: l.clientWidth / u * e.pdf.internal.pageSize.width
          }, i++;
        for (i = 1; i < t.rows.length; ) {
          for (s = t.rows[i], a = {}, o = 0; o < s.cells.length; )
            a[r[o].name] = s.cells[o].textContent.replace(/\r?\n/g, ""), o++;
          n.push(a), i++;
        }
        return c = {
          rows: n,
          headers: r
        };
      };
      var S = {
        SCRIPT: 1,
        STYLE: 1,
        NOSCRIPT: 1,
        OBJECT: 1,
        EMBED: 1,
        SELECT: 1
      },
          C = 1;
      r = function(e, i, o) {
        var a,
            s,
            c,
            u,
            l,
            f,
            d,
            p,
            m;
        for (s = e.childNodes, a = void 0, c = h(e), l = "block" === c.display, l && (i.setBlockBoundary(), i.setBlockStyle(c)), d = 19.049976 / 25.4, u = 0, f = s.length; f > u; ) {
          if (a = s[u], "object" === ("undefined" == typeof a ? "undefined" : t["typeof"](a))) {
            if (i.executeWatchFunctions(a), 1 === a.nodeType && "HEADER" === a.nodeName) {
              var g = a,
                  v = i.pdf.margins_doc.top;
              i.pdf.internal.events.subscribe("addPage", function(t) {
                i.y = v, r(g, i, o), i.pdf.margins_doc.top = i.y + 10, i.y += 10;
              }, !1);
            }
            if (8 === a.nodeType && "#comment" === a.nodeName)
              ~a.textContent.indexOf("ADD_PAGE") && (i.pdf.addPage(), i.y = i.pdf.margins_doc.top);
            else if (1 !== a.nodeType || S[a.nodeName])
              if (3 === a.nodeType) {
                var b = a.nodeValue;
                if (a.nodeValue && "LI" === a.parentNode.nodeName)
                  if ("OL" === a.parentNode.parentNode.nodeName)
                    b = C++ + ". " + b;
                  else {
                    var x = c["font-size"];
                    offsetX = (3 - .75 * x) * i.pdf.internal.scaleFactor, offsetY = .75 * x * i.pdf.internal.scaleFactor, radius = 1.74 * x / i.pdf.internal.scaleFactor, m = function(t, e) {
                      this.pdf.circle(t + offsetX, e + offsetY, radius, "FD");
                    };
                  }
                a.ownerDocument.body.contains(a) && i.addText(b, c);
              } else
                "string" == typeof a && i.addText(a, c);
            else {
              var A;
              if ("IMG" === a.nodeName) {
                var q = a.getAttribute("src");
                A = y[i.pdf.sHashCode(q) || q];
              }
              if (A) {
                i.pdf.internal.pageSize.height - i.pdf.margins_doc.bottom < i.y + a.height && i.y > i.pdf.margins_doc.top && (i.pdf.addPage(), i.y = i.pdf.margins_doc.top, i.executeWatchFunctions(a));
                var _ = h(a),
                    P = i.x,
                    T = 12 / i.pdf.internal.scaleFactor,
                    E = (_["margin-left"] + _["padding-left"]) * T,
                    I = (_["margin-right"] + _["padding-right"]) * T,
                    O = (_["margin-top"] + _["padding-top"]) * T,
                    F = (_["margin-bottom"] + _["padding-bottom"]) * T;
                P += void 0 !== _["float"] && "right" === _["float"] ? i.settings.width - a.width - I : E, i.pdf.addImage(A, P, i.y + O, a.width, a.height), A = void 0, "right" === _["float"] || "left" === _["float"] ? (i.watchFunctions.push(function(t, e, n, r) {
                  return i.y >= e ? (i.x += t, i.settings.width += n, !0) : r && 1 === r.nodeType && !S[r.nodeName] && i.x + r.width > i.pdf.margins_doc.left + i.pdf.margins_doc.width ? (i.x += t, i.y = e, i.settings.width += n, !0) : !1;
                }.bind(this, "left" === _["float"] ? -a.width - E - I : 0, i.y + a.height + O + F, a.width)), i.watchFunctions.push(function(t, e, n) {
                  return i.y < t && e === i.pdf.internal.getNumberOfPages() ? 1 === n.nodeType && "both" === h(n).clear ? (i.y = t, !0) : !1 : !0;
                }.bind(this, i.y + a.height, i.pdf.internal.getNumberOfPages())), i.settings.width -= a.width + E + I, "left" === _["float"] && (i.x += a.width + E + I)) : i.y += a.height + O + F;
              } else if ("TABLE" === a.nodeName)
                p = k(a, i), i.y += 10, i.pdf.table(i.x, i.y, p.rows, p.headers, {
                  autoSize: !1,
                  printHeaders: o.printHeaders,
                  margins: i.pdf.margins_doc,
                  css: h(a)
                }), i.y = i.pdf.lastCellPos.y + i.pdf.lastCellPos.h + 20;
              else if ("OL" === a.nodeName || "UL" === a.nodeName)
                C = 1, w(a, i, o) || r(a, i, o), i.y += 10;
              else if ("LI" === a.nodeName) {
                var B = i.x;
                i.x += 20 / i.pdf.internal.scaleFactor, i.y += 3, w(a, i, o) || r(a, i, o), i.x = B;
              } else
                "BR" === a.nodeName ? (i.y += c["font-size"] * i.pdf.internal.scaleFactor, i.addText("\u2028", n(c))) : w(a, i, o) || r(a, i, o);
            }
          }
          u++;
        }
        return o.outY = i.y, l ? i.setBlockBoundary(m) : void 0;
      }, y = {}, v = function(t, e, n, r) {
        function i() {
          e.pdf.internal.events.publish("imagesLoaded"), r(a);
        }
        function o(t, n, r) {
          if (t) {
            var o = new Image;
            a = ++u, o.crossOrigin = "", o.onerror = o.onload = function() {
              if (o.complete && (0 === o.src.indexOf("data:image/") && (o.width = n || o.width || 0, o.height = r || o.height || 0), o.width + o.height)) {
                var a = e.pdf.sHashCode(t) || t;
                y[a] = y[a] || o;
              }
              --u || i();
            }, o.src = t;
          }
        }
        for (var a,
            s = t.getElementsByTagName("img"),
            c = s.length,
            u = 0; c--; )
          o(s[c].getAttribute("src"), s[c].width, s[c].height);
        return u || i();
      }, b = function(t, e, n) {
        var i = t.getElementsByTagName("footer");
        if (i.length > 0) {
          i = i[0];
          var o = e.pdf.internal.write,
              a = e.y;
          e.pdf.internal.write = function() {}, r(i, e, n);
          var s = Math.ceil(e.y - a) + 5;
          e.y = a, e.pdf.internal.write = o, e.pdf.margins_doc.bottom += s;
          for (var c = function(t) {
            var o = void 0 !== t ? t.pageNumber : 1,
                a = e.y;
            e.y = e.pdf.internal.pageSize.height - e.pdf.margins_doc.bottom, e.pdf.margins_doc.bottom -= s;
            for (var c = i.getElementsByTagName("span"),
                u = 0; u < c.length; ++u)
              (" " + c[u].className + " ").replace(/[\n\t]/g, " ").indexOf(" pageCounter ") > -1 && (c[u].innerHTML = o), (" " + c[u].className + " ").replace(/[\n\t]/g, " ").indexOf(" totalPages ") > -1 && (c[u].innerHTML = "###jsPDFVarTotalPages###");
            r(i, e, n), e.pdf.margins_doc.bottom += s, e.y = a;
          },
              u = i.getElementsByTagName("span"),
              l = 0; l < u.length; ++l)
            (" " + u[l].className + " ").replace(/[\n\t]/g, " ").indexOf(" totalPages ") > -1 && e.pdf.internal.events.subscribe("htmlRenderingFinished", e.pdf.putTotalPages.bind(e.pdf, "###jsPDFVarTotalPages###"), !0);
          e.pdf.internal.events.subscribe("addPage", c, !1), c(), S.FOOTER = 1;
        }
      }, x = function(t, e, n, i, o, a) {
        if (!e)
          return !1;
        "string" == typeof e || e.parentNode || (e = "" + e.innerHTML), "string" == typeof e && (e = function(t) {
          var e,
              n,
              r,
              i;
          return r = "jsPDFhtmlText" + Date.now().toString() + (1e3 * Math.random()).toFixed(0), i = "position: absolute !important;clip: rect(1px 1px 1px 1px); /* IE6, IE7 */clip: rect(1px, 1px, 1px, 1px);padding:0 !important;border:0 !important;height: 1px !important;width: 1px !important; top:auto;left:-100px;overflow: hidden;", n = document.createElement("div"), n.style.cssText = i, n.innerHTML = '<iframe style="height:1px;width:1px" name="' + r + '" />', document.body.appendChild(n), e = window.frames[r], e.document.open(), e.document.writeln(t), e.document.close(), e.document.body;
        }(e.replace(/<\/?script[^>]*?>/gi, "")));
        var s,
            c = new d(t, n, i, o);
        return v.call(this, e, c, o.elementHandlers, function(t) {
          b(e, c, o.elementHandlers), r(e, c, o.elementHandlers), c.pdf.internal.events.publish("htmlRenderingFinished"), s = c.dispose(), "function" == typeof a ? a(s) : t && console.error("jsPDF Warning: rendering issues? provide a callback to fromHTML!");
        }), s || {
          x: c.x,
          y: c.y
        };
      }, d.prototype.init = function() {
        return this.paragraph = {
          text: [],
          style: []
        }, this.pdf.internal.write("q");
      }, d.prototype.dispose = function() {
        return this.pdf.internal.write("Q"), {
          x: this.x,
          y: this.y,
          ready: !0
        };
      }, d.prototype.executeWatchFunctions = function(t) {
        var e = !1,
            n = [];
        if (this.watchFunctions.length > 0) {
          for (var r = 0; r < this.watchFunctions.length; ++r)
            this.watchFunctions[r](t) === !0 ? e = !0 : n.push(this.watchFunctions[r]);
          this.watchFunctions = n;
        }
        return e;
      }, d.prototype.splitFragmentsIntoLines = function(t, e) {
        var r,
            i,
            o,
            a,
            s,
            c,
            u,
            l,
            h,
            f,
            d,
            p,
            m,
            g,
            w;
        for (i = 12, d = this.pdf.internal.scaleFactor, s = {}, o = void 0, f = void 0, a = void 0, c = void 0, w = void 0, h = void 0, l = void 0, u = void 0, p = [], m = [p], r = 0, g = this.settings.width; t.length; )
          if (c = t.shift(), w = e.shift(), c)
            if (o = w["font-family"], f = w["font-style"], a = s[o + f], a || (a = this.pdf.internal.getFont(o, f).metadata.Unicode, s[o + f] = a), h = {
              widths: a.widths,
              kerning: a.kerning,
              fontSize: w["font-size"] * i,
              textIndent: r
            }, l = this.pdf.getStringUnitWidth(c, h) * h.fontSize / d, "\u2028" == c)
              p = [], m.push(p);
            else if (r + l > g) {
              for (u = this.pdf.splitTextToSize(c, g, h), p.push([u.shift(), w]); u.length; )
                p = [[u.shift(), w]], m.push(p);
              r = this.pdf.getStringUnitWidth(p[0][0], h) * h.fontSize / d;
            } else
              p.push([c, w]), r += l;
        if (void 0 !== w["text-align"] && ("center" === w["text-align"] || "right" === w["text-align"] || "justify" === w["text-align"]))
          for (var y = 0; y < m.length; ++y) {
            var v = this.pdf.getStringUnitWidth(m[y][0][0], h) * h.fontSize / d;
            y > 0 && (m[y][0][1] = n(m[y][0][1]));
            var b = g - v;
            if ("right" === w["text-align"])
              m[y][0][1]["margin-left"] = b;
            else if ("center" === w["text-align"])
              m[y][0][1]["margin-left"] = b / 2;
            else if ("justify" === w["text-align"]) {
              var x = m[y][0][0].split(" ").length - 1;
              m[y][0][1]["word-spacing"] = b / x, y === m.length - 1 && (m[y][0][1]["word-spacing"] = 0);
            }
          }
        return m;
      }, d.prototype.RenderTextFragment = function(t, e) {
        var n,
            r,
            i;
        i = 0, n = 12, this.pdf.internal.pageSize.height - this.pdf.margins_doc.bottom < this.y + this.pdf.internal.getFontSize() && (this.pdf.internal.write("ET", "Q"), this.pdf.addPage(), this.y = this.pdf.margins_doc.top, this.pdf.internal.write("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), e.color, "Td"), i = Math.max(i, e["line-height"], e["font-size"]), this.pdf.internal.write(0, (-1 * n * i).toFixed(2), "Td")), r = this.pdf.internal.getFont(e["font-family"], e["font-style"]);
        var o = this.getPdfColor(e.color);
        o !== this.lastTextColor && (this.pdf.internal.write(o), this.lastTextColor = o), void 0 !== e["word-spacing"] && e["word-spacing"] > 0 && this.pdf.internal.write(e["word-spacing"].toFixed(2), "Tw"), this.pdf.internal.write("/" + r.id, (n * e["font-size"]).toFixed(2), "Tf", "(" + this.pdf.internal.pdfEscape(t) + ") Tj"), void 0 !== e["word-spacing"] && this.pdf.internal.write(0, "Tw");
      }, d.prototype.getPdfColor = function(t) {
        var e,
            n,
            r,
            i,
            a = /rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/,
            s = a.exec(t);
        if (null != s ? (n = parseInt(s[1]), r = parseInt(s[2]), i = parseInt(s[3])) : ("#" != t.charAt(0) && (t = o.colorNameToHex(t), t || (t = "#000000")), n = t.substring(1, 3), n = parseInt(n, 16), r = t.substring(3, 5), r = parseInt(r, 16), i = t.substring(5, 7), i = parseInt(i, 16)), "string" == typeof n && /^#[0-9A-Fa-f]{6}$/.test(n)) {
          var c = parseInt(n.substr(1), 16);
          n = c >> 16 & 255, r = c >> 8 & 255, i = 255 & c;
        }
        var u = this.f3;
        return e = 0 === n && 0 === r && 0 === i || "undefined" == typeof r ? u(n / 255) + " g" : [u(n / 255), u(r / 255), u(i / 255), "rg"].join(" ");
      }, d.prototype.f3 = function(t) {
        return t.toFixed(3);
      }, d.prototype.renderParagraph = function(t) {
        var e,
            n,
            r,
            i,
            o,
            a,
            s,
            c,
            u,
            l,
            h,
            d,
            p,
            m,
            g;
        if (i = f(this.paragraph.text), m = this.paragraph.style, e = this.paragraph.blockstyle, p = this.paragraph.priorblockstyle || {}, this.paragraph = {
          text: [],
          style: [],
          blockstyle: {},
          priorblockstyle: e
        }, i.join("").trim()) {
          c = this.splitFragmentsIntoLines(i, m), s = void 0, u = void 0, n = 12, r = n / this.pdf.internal.scaleFactor, this.priorMarginBottom = this.priorMarginBottom || 0, d = (Math.max((e["margin-top"] || 0) - this.priorMarginBottom, 0) + (e["padding-top"] || 0)) * r, h = ((e["margin-bottom"] || 0) + (e["padding-bottom"] || 0)) * r, this.priorMarginBottom = e["margin-bottom"] || 0, "always" === e["page-break-before"] && (this.pdf.addPage(), this.y = 0, d = ((e["margin-top"] || 0) + (e["padding-top"] || 0)) * r), l = this.pdf.internal.write, o = void 0, a = void 0, this.y += d, l("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
          for (var w = 0; c.length; ) {
            for (s = c.shift(), u = 0, o = 0, a = s.length; o !== a; )
              s[o][0].trim() && (u = Math.max(u, s[o][1]["line-height"], s[o][1]["font-size"]), g = 7 * s[o][1]["font-size"]), o++;
            var y = 0,
                v = 0;
            void 0 !== s[0][1]["margin-left"] && s[0][1]["margin-left"] > 0 && (v = this.pdf.internal.getCoordinateString(s[0][1]["margin-left"]), y = v - w, w = v);
            var b = Math.max(e["margin-left"] || 0, 0) * r;
            for (l(y + b, (-1 * n * u).toFixed(2), "Td"), o = 0, a = s.length; o !== a; )
              s[o][0] && this.RenderTextFragment(s[o][0], s[o][1]), o++;
            if (this.y += u * r, this.executeWatchFunctions(s[0][1]) && c.length > 0) {
              var x = [],
                  k = [];
              c.forEach(function(t) {
                for (var e = 0,
                    n = t.length; e !== n; )
                  t[e][0] && (x.push(t[e][0] + " "), k.push(t[e][1])), ++e;
              }), c = this.splitFragmentsIntoLines(f(x), k), l("ET", "Q"), l("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
            }
          }
          return t && "function" == typeof t && t.call(this, this.x - 9, this.y - g / 2), l("ET", "Q"), this.y += h;
        }
      }, d.prototype.setBlockBoundary = function(t) {
        return this.renderParagraph(t);
      }, d.prototype.setBlockStyle = function(t) {
        return this.paragraph.blockstyle = t;
      }, d.prototype.addText = function(t, e) {
        return this.paragraph.text.push(t), this.paragraph.style.push(e);
      }, i = {
        helvetica: "helvetica",
        "sans-serif": "helvetica",
        "times new roman": "times",
        serif: "times",
        times: "times",
        monospace: "courier",
        courier: "courier"
      }, c = {
        100: "normal",
        200: "normal",
        300: "normal",
        400: "normal",
        500: "bold",
        600: "bold",
        700: "bold",
        800: "bold",
        900: "bold",
        normal: "normal",
        bold: "bold",
        bolder: "bold",
        lighter: "normal"
      }, a = {
        normal: "normal",
        italic: "italic",
        oblique: "italic"
      }, s = {
        left: "left",
        right: "right",
        center: "center",
        justify: "justify"
      }, u = {
        none: "none",
        right: "right",
        left: "left"
      }, l = {
        none: "none",
        both: "both"
      }, g = {normal: 1}, e.fromHTML = function(t, e, n, r, i, o) {
        return this.margins_doc = o || {
          top: 0,
          bottom: 0
        }, r || (r = {}), r.elementHandlers || (r.elementHandlers = {}), x(this, t, isNaN(e) ? 4 : e, isNaN(n) ? 4 : n, r, i);
      };
    }(e.API), function(t) {
      var e,
          n,
          r;
      t.addJS = function(t) {
        return r = t, this.internal.events.subscribe("postPutResources", function(t) {
          e = this.internal.newObject(), this.internal.write("<< /Names [(EmbeddedJS) " + (e + 1) + " 0 R] >>", "endobj"), n = this.internal.newObject(), this.internal.write("<< /S /JavaScript /JS (", r, ") >>", "endobj");
        }), this.internal.events.subscribe("putCatalog", function() {
          void 0 !== e && void 0 !== n && this.internal.write("/Names <</JavaScript " + e + " 0 R>>");
        }), this;
      };
    }(e.API), function(t) {
      return t.events.push(["postPutResources", function() {
        var t = this,
            e = /^(\d+) 0 obj$/;
        if (this.outline.root.children.length > 0)
          for (var n = t.outline.render().split(/\r\n/),
              r = 0; r < n.length; r++) {
            var i = n[r],
                o = e.exec(i);
            if (null != o) {
              var a = o[1];
              t.internal.newObjectDeferredBegin(a);
            }
            t.internal.write(i);
          }
        if (this.outline.createNamedDestinations) {
          for (var s = this.internal.pages.length,
              c = [],
              r = 0; s > r; r++) {
            var u = t.internal.newObject();
            c.push(u);
            var l = t.internal.getPageInfo(r + 1);
            t.internal.write("<< /D[" + l.objId + " 0 R /XYZ null null null]>> endobj");
          }
          var h = t.internal.newObject();
          t.internal.write("<< /Names [ ");
          for (var r = 0; r < c.length; r++)
            t.internal.write("(page_" + (r + 1) + ")" + c[r] + " 0 R");
          t.internal.write(" ] >>", "endobj");
          t.internal.newObject();
          t.internal.write("<< /Dests " + h + " 0 R"), t.internal.write(">>", "endobj");
        }
      }]), t.events.push(["putCatalog", function() {
        var t = this;
        t.outline.root.children.length > 0 && (t.internal.write("/Outlines", this.outline.makeRef(this.outline.root)), this.outline.createNamedDestinations && t.internal.write("/Names " + namesOid + " 0 R"));
      }]), t.events.push(["initialized", function() {
        var t = this;
        t.outline = {
          createNamedDestinations: !1,
          root: {children: []}
        };
        t.outline.add = function(t, e, n) {
          var r = {
            title: e,
            options: n,
            children: []
          };
          return null == t && (t = this.root), t.children.push(r), r;
        }, t.outline.render = function() {
          return this.ctx = {}, this.ctx.val = "", this.ctx.pdf = t, this.genIds_r(this.root), this.renderRoot(this.root), this.renderItems(this.root), this.ctx.val;
        }, t.outline.genIds_r = function(e) {
          e.id = t.internal.newObjectDeferred();
          for (var n = 0; n < e.children.length; n++)
            this.genIds_r(e.children[n]);
        }, t.outline.renderRoot = function(t) {
          this.objStart(t), this.line("/Type /Outlines"), t.children.length > 0 && (this.line("/First " + this.makeRef(t.children[0])), this.line("/Last " + this.makeRef(t.children[t.children.length - 1]))), this.line("/Count " + this.count_r({count: 0}, t)), this.objEnd();
        }, t.outline.renderItems = function(e) {
          for (var n = 0; n < e.children.length; n++) {
            var r = e.children[n];
            this.objStart(r), this.line("/Title " + this.makeString(r.title)), this.line("/Parent " + this.makeRef(e)), n > 0 && this.line("/Prev " + this.makeRef(e.children[n - 1])), n < e.children.length - 1 && this.line("/Next " + this.makeRef(e.children[n + 1])), r.children.length > 0 && (this.line("/First " + this.makeRef(r.children[0])), this.line("/Last " + this.makeRef(r.children[r.children.length - 1])));
            var i = this.count = this.count_r({count: 0}, r);
            if (i > 0 && this.line("/Count " + i), r.options && r.options.pageNumber) {
              var o = t.internal.getPageInfo(r.options.pageNumber);
              this.line("/Dest [" + o.objId + " 0 R /XYZ 0 " + this.ctx.pdf.internal.pageSize.height + " 0]");
            }
            this.objEnd();
          }
          for (var n = 0; n < e.children.length; n++) {
            var r = e.children[n];
            this.renderItems(r);
          }
        }, t.outline.line = function(t) {
          this.ctx.val += t + "\r\n";
        }, t.outline.makeRef = function(t) {
          return t.id + " 0 R";
        }, t.outline.makeString = function(e) {
          return "(" + t.internal.pdfEscape(e) + ")";
        }, t.outline.objStart = function(t) {
          this.ctx.val += "\r\n" + t.id + " 0 obj\r\n<<\r\n";
        }, t.outline.objEnd = function(t) {
          this.ctx.val += ">> \r\nendobj\r\n";
        }, t.outline.count_r = function(t, e) {
          for (var n = 0; n < e.children.length; n++)
            t.count++, this.count_r(t, e.children[n]);
          return t.count;
        };
      }]), this;
    }(e.API), function(t) {
      var e = function() {
        return "function" != typeof PNG || "function" != typeof c;
      },
          n = function(e) {
            return e !== t.image_compression.NONE && r();
          },
          r = function() {
            var t = "function" == typeof a;
            if (!t)
              throw new Error("requires deflate.js for compression");
            return t;
          },
          i = function(e, n, r, i) {
            var c = 5,
                l = f;
            switch (i) {
              case t.image_compression.FAST:
                c = 3, l = h;
                break;
              case t.image_compression.MEDIUM:
                c = 6, l = d;
                break;
              case t.image_compression.SLOW:
                c = 9, l = p;
            }
            e = u(e, n, r, l);
            var m = new Uint8Array(o(c)),
                g = s(e),
                w = new a(c),
                y = w.append(e),
                v = w.flush(),
                b = m.length + y.length + v.length,
                x = new Uint8Array(b + 4);
            return x.set(m), x.set(y, m.length), x.set(v, m.length + y.length), x[b++] = g >>> 24 & 255, x[b++] = g >>> 16 & 255, x[b++] = g >>> 8 & 255, x[b++] = 255 & g, t.arrayBufferToBinaryString(x);
          },
          o = function(t, e) {
            var n = 8,
                r = Math.LOG2E * Math.log(32768) - 8,
                i = r << 4 | n,
                o = i << 8,
                a = Math.min(3, (e - 1 & 255) >> 1);
            return o |= a << 6, o |= 0, o += 31 - o % 31, [i, 255 & o & 255];
          },
          s = function(t, e) {
            for (var n,
                r = 1,
                i = 65535 & r,
                o = r >>> 16 & 65535,
                a = t.length,
                s = 0; a > 0; ) {
              n = a > e ? e : a, a -= n;
              do
                i += t[s++], o += i;
 while (--n);
              i %= 65521, o %= 65521;
            }
            return (o << 16 | i) >>> 0;
          },
          u = function(t, e, n, r) {
            for (var i,
                o,
                a,
                s = t.length / e,
                c = new Uint8Array(t.length + s),
                u = g(),
                l = 0; s > l; l++) {
              if (a = l * e, i = t.subarray(a, a + e), r)
                c.set(r(i, n, o), a + l);
              else {
                for (var h = 0,
                    f = u.length,
                    d = []; f > h; h++)
                  d[h] = u[h](i, n, o);
                var p = w(d.concat());
                c.set(d[p], a + l);
              }
              o = i;
            }
            return c;
          },
          l = function(t, e, n) {
            var r = Array.apply([], t);
            return r.unshift(0), r;
          },
          h = function(t, e, n) {
            var r,
                i = [],
                o = 0,
                a = t.length;
            for (i[0] = 1; a > o; o++)
              r = t[o - e] || 0, i[o + 1] = t[o] - r + 256 & 255;
            return i;
          },
          f = function(t, e, n) {
            var r,
                i = [],
                o = 0,
                a = t.length;
            for (i[0] = 2; a > o; o++)
              r = n && n[o] || 0, i[o + 1] = t[o] - r + 256 & 255;
            return i;
          },
          d = function(t, e, n) {
            var r,
                i,
                o = [],
                a = 0,
                s = t.length;
            for (o[0] = 3; s > a; a++)
              r = t[a - e] || 0, i = n && n[a] || 0, o[a + 1] = t[a] + 256 - (r + i >>> 1) & 255;
            return o;
          },
          p = function(t, e, n) {
            var r,
                i,
                o,
                a,
                s = [],
                c = 0,
                u = t.length;
            for (s[0] = 4; u > c; c++)
              r = t[c - e] || 0, i = n && n[c] || 0, o = n && n[c - e] || 0, a = m(r, i, o), s[c + 1] = t[c] - a + 256 & 255;
            return s;
          },
          m = function(t, e, n) {
            var r = t + e - n,
                i = Math.abs(r - t),
                o = Math.abs(r - e),
                a = Math.abs(r - n);
            return o >= i && a >= i ? t : a >= o ? e : n;
          },
          g = function() {
            return [l, h, f, d, p];
          },
          w = function(t) {
            for (var e,
                n,
                r,
                i = 0,
                o = t.length; o > i; )
              e = y(t[i].slice(1)), (n > e || !n) && (n = e, r = i), i++;
            return r;
          },
          y = function(t) {
            for (var e = 0,
                n = t.length,
                r = 0; n > e; )
              r += Math.abs(t[e++]);
            return r;
          };
      t.processPNG = function(t, r, o, a, s) {
        var c,
            u,
            l,
            h,
            f,
            d,
            p = this.color_spaces.DEVICE_RGB,
            m = this.decode.FLATE_DECODE,
            g = 8;
        if (this.isArrayBuffer(t) && (t = new Uint8Array(t)), this.isArrayBufferView(t)) {
          if (e())
            throw new Error("PNG support requires png.js and zlib.js");
          if (c = new PNG(t), t = c.imgData, g = c.bits, p = c.colorSpace, h = c.colors, -1 !== [4, 6].indexOf(c.colorType)) {
            if (8 === c.bits)
              for (var w,
                  y,
                  v = 32 == c.pixelBitlength ? new Uint32Array(c.decodePixels().buffer) : 16 == c.pixelBitlength ? new Uint16Array(c.decodePixels().buffer) : new Uint8Array(c.decodePixels().buffer),
                  b = v.length,
                  x = new Uint8Array(b * c.colors),
                  k = new Uint8Array(b),
                  S = c.pixelBitlength - c.bits,
                  C = 0,
                  A = 0; b > C; C++) {
                for (w = v[C], y = 0; S > y; )
                  x[A++] = w >>> y & 255, y += c.bits;
                k[C] = w >>> y & 255;
              }
            if (16 === c.bits) {
              for (var w,
                  v = new Uint32Array(c.decodePixels().buffer),
                  b = v.length,
                  x = new Uint8Array(b * (32 / c.pixelBitlength) * c.colors),
                  k = new Uint8Array(b * (32 / c.pixelBitlength)),
                  q = c.colors > 1,
                  C = 0,
                  A = 0,
                  _ = 0; b > C; )
                w = v[C++], x[A++] = w >>> 0 & 255, q && (x[A++] = w >>> 16 & 255, w = v[C++], x[A++] = w >>> 0 & 255), k[_++] = w >>> 16 & 255;
              g = 8;
            }
            n(a) ? (t = i(x, c.width * c.colors, c.colors, a), d = i(k, c.width, 1, a)) : (t = x, d = k, m = null);
          }
          if (3 === c.colorType && (p = this.color_spaces.INDEXED, f = c.palette, c.transparency.indexed)) {
            for (var P = c.transparency.indexed,
                T = 0,
                C = 0,
                b = P.length; b > C; ++C)
              T += P[C];
            if (T /= 255, T === b - 1 && -1 !== P.indexOf(0))
              l = [P.indexOf(0)];
            else if (T !== b) {
              for (var v = c.decodePixels(),
                  k = new Uint8Array(v.length),
                  C = 0,
                  b = v.length; b > C; C++)
                k[C] = P[v[C]];
              d = i(k, c.width, 1);
            }
          }
          return u = m === this.decode.FLATE_DECODE ? "/Predictor 15 /Colors " + h + " /BitsPerComponent " + g + " /Columns " + c.width : "/Colors " + h + " /BitsPerComponent " + g + " /Columns " + c.width, (this.isArrayBuffer(t) || this.isArrayBufferView(t)) && (t = this.arrayBufferToBinaryString(t)), (d && this.isArrayBuffer(d) || this.isArrayBufferView(d)) && (d = this.arrayBufferToBinaryString(d)), this.createImageInfo(t, c.width, c.height, p, g, m, r, o, u, l, f, d);
        }
        throw new Error("Unsupported PNG image data, try using JPEG instead.");
      };
    }(e.API), function(t) {
      t.autoPrint = function() {
        var t;
        return this.internal.events.subscribe("postPutResources", function() {
          t = this.internal.newObject(), this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj");
        }), this.internal.events.subscribe("putCatalog", function() {
          this.internal.write("/OpenAction " + t + " 0 R");
        }), this;
      };
    }(e.API), function(t) {
      var e = t.getCharWidthsArray = function(t, e) {
        e || (e = {});
        var n,
            r,
            i,
            o = e.widths ? e.widths : this.internal.getFont().metadata.Unicode.widths,
            a = o.fof ? o.fof : 1,
            s = e.kerning ? e.kerning : this.internal.getFont().metadata.Unicode.kerning,
            c = s.fof ? s.fof : 1,
            u = 0,
            l = o[0] || a,
            h = [];
        for (n = 0, r = t.length; r > n; n++)
          i = t.charCodeAt(n), h.push((o[i] || l) / a + (s[i] && s[i][u] || 0) / c), u = i;
        return h;
      },
          n = function(t) {
            for (var e = t.length,
                n = 0; e; )
              e--, n += t[e];
            return n;
          },
          r = t.getStringUnitWidth = function(t, r) {
            return n(e.call(this, t, r));
          },
          i = function(t, e, n, r) {
            for (var i = [],
                o = 0,
                a = t.length,
                s = 0; o !== a && s + e[o] < n; )
              s += e[o], o++;
            i.push(t.slice(0, o));
            var c = o;
            for (s = 0; o !== a; )
              s + e[o] > r && (i.push(t.slice(c, o)), s = 0, c = o), s += e[o], o++;
            return c !== o && i.push(t.slice(c, o)), i;
          },
          o = function(t, o, a) {
            a || (a = {});
            var s,
                c,
                u,
                l,
                h,
                f,
                d = [],
                p = [d],
                m = a.textIndent || 0,
                g = 0,
                w = 0,
                y = t.split(" "),
                v = e(" ", a)[0];
            if (f = -1 === a.lineIndent ? y[0].length + 2 : a.lineIndent || 0) {
              var b = Array(f).join(" "),
                  x = [];
              y.map(function(t) {
                t = t.split(/\s*\n/), t.length > 1 ? x = x.concat(t.map(function(t, e) {
                  return (e && t.length ? "\n" : "") + t;
                })) : x.push(t[0]);
              }), y = x, f = r(b, a);
            }
            for (u = 0, l = y.length; l > u; u++) {
              var k = 0;
              if (s = y[u], f && "\n" == s[0] && (s = s.substr(1), k = 1), c = e(s, a), w = n(c), m + g + w > o || k) {
                if (w > o) {
                  for (h = i(s, c, o - (m + g), o), d.push(h.shift()), d = [h.pop()]; h.length; )
                    p.push([h.shift()]);
                  w = n(c.slice(s.length - d[0].length));
                } else
                  d = [s];
                p.push(d), m = w + f, g = v;
              } else
                d.push(s), m += g + w, g = v;
            }
            if (f)
              var S = function(t, e) {
                return (e ? b : "") + t.join(" ");
              };
            else
              var S = function(t) {
                return t.join(" ");
              };
            return p.map(S);
          };
      t.splitTextToSize = function(t, e, n) {
        n || (n = {});
        var r,
            i = n.fontSize || this.internal.getFontSize(),
            a = function(t) {
              var e = {0: 1},
                  n = {};
              if (t.widths && t.kerning)
                return {
                  widths: t.widths,
                  kerning: t.kerning
                };
              var r = this.internal.getFont(t.fontName, t.fontStyle),
                  i = "Unicode";
              return r.metadata[i] ? {
                widths: r.metadata[i].widths || e,
                kerning: r.metadata[i].kerning || n
              } : {
                widths: e,
                kerning: n
              };
            }.call(this, n);
        r = Array.isArray(t) ? t : t.split(/\r?\n/);
        var s = 1 * this.internal.scaleFactor * e / i;
        a.textIndent = n.textIndent ? 1 * n.textIndent * this.internal.scaleFactor / i : 0, a.lineIndent = n.lineIndent;
        var c,
            u,
            l = [];
        for (c = 0, u = r.length; u > c; c++)
          l = l.concat(o(r[c], s, a));
        return l;
      };
    }(e.API), function(t) {
      var e = function(t) {
        for (var e = "0123456789abcdef",
            n = "klmnopqrstuvwxyz",
            r = {},
            i = 0; i < n.length; i++)
          r[n[i]] = e[i];
        var o,
            a,
            s,
            c,
            u,
            l = {},
            h = 1,
            f = l,
            d = [],
            p = "",
            m = "",
            g = t.length - 1;
        for (i = 1; i != g; )
          u = t[i], i += 1, "'" == u ? a ? (c = a.join(""), a = o) : a = [] : a ? a.push(u) : "{" == u ? (d.push([f, c]), f = {}, c = o) : "}" == u ? (s = d.pop(), s[0][s[1]] = f, c = o, f = s[0]) : "-" == u ? h = -1 : c === o ? r.hasOwnProperty(u) ? (p += r[u], c = parseInt(p, 16) * h, h = 1, p = "") : p += u : r.hasOwnProperty(u) ? (m += r[u], f[c] = parseInt(m, 16) * h, h = 1, c = o, m = "") : m += u;
        return l;
      },
          n = {
            codePages: ["WinAnsiEncoding"],
            WinAnsiEncoding: e("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")
          },
          r = {Unicode: {
              Courier: n,
              "Courier-Bold": n,
              "Courier-BoldOblique": n,
              "Courier-Oblique": n,
              Helvetica: n,
              "Helvetica-Bold": n,
              "Helvetica-BoldOblique": n,
              "Helvetica-Oblique": n,
              "Times-Roman": n,
              "Times-Bold": n,
              "Times-BoldItalic": n,
              "Times-Italic": n
            }},
          i = {Unicode: {
              "Courier-Oblique": e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
              "Times-BoldItalic": e("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),
              "Helvetica-Bold": e("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),
              Courier: e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
              "Courier-BoldOblique": e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
              "Times-Bold": e("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"),
              Helvetica: e("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),
              "Helvetica-BoldOblique": e("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),
              "Courier-Bold": e("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
              "Times-Italic": e("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),
              "Times-Roman": e("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),
              "Helvetica-Oblique": e("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
            }};
      t.events.push(["addFont", function(t) {
        var e,
            n,
            o,
            a = "Unicode";
        e = i[a][t.PostScriptName], e && (n = t.metadata[a] ? t.metadata[a] : t.metadata[a] = {}, n.widths = e.widths, n.kerning = e.kerning), o = r[a][t.PostScriptName], o && (n = t.metadata[a] ? t.metadata[a] : t.metadata[a] = {}, n.encoding = o, o.codePages && o.codePages.length && (t.encoding = o.codePages[0]));
      }]);
    }(e.API), function(t) {
      t.addSVG = function(t, e, n, r, i) {
        function o(t, e) {
          var n = e.createElement("style");
          n.type = "text/css", n.styleSheet ? n.styleSheet.cssText = t : n.appendChild(e.createTextNode(t)), e.getElementsByTagName("head")[0].appendChild(n);
        }
        function a(t) {
          var e = "childframe",
              n = t.createElement("iframe");
          return o(".jsPDF_sillysvg_iframe {display:none;position:absolute;}", t), n.name = e, n.setAttribute("width", 0), n.setAttribute("height", 0), n.setAttribute("frameborder", "0"), n.setAttribute("scrolling", "no"), n.setAttribute("seamless", "seamless"), n.setAttribute("class", "jsPDF_sillysvg_iframe"), t.body.appendChild(n), n;
        }
        function s(t, e) {
          var n = (e.contentWindow || e.contentDocument).document;
          return n.write(t), n.close(), n.getElementsByTagName("svg")[0];
        }
        function c(t) {
          for (var e = parseFloat(t[1]),
              n = parseFloat(t[2]),
              r = [],
              i = 3,
              o = t.length; o > i; )
            "c" === t[i] ? (r.push([parseFloat(t[i + 1]), parseFloat(t[i + 2]), parseFloat(t[i + 3]), parseFloat(t[i + 4]), parseFloat(t[i + 5]), parseFloat(t[i + 6])]), i += 7) : "l" === t[i] ? (r.push([parseFloat(t[i + 1]), parseFloat(t[i + 2])]), i += 3) : i += 1;
          return [e, n, r];
        }
        var u;
        if (e === u || n === u)
          throw new Error("addSVG needs values for 'x' and 'y'");
        var l = a(document),
            h = s(t, l),
            f = [1, 1],
            d = parseFloat(h.getAttribute("width")),
            p = parseFloat(h.getAttribute("height"));
        d && p && (r && i ? f = [r / d, i / p] : r ? f = [r / d, r / d] : i && (f = [i / p, i / p]));
        var m,
            g,
            w,
            y,
            v = h.childNodes;
        for (m = 0, g = v.length; g > m; m++)
          w = v[m], w.tagName && "PATH" === w.tagName.toUpperCase() && (y = c(w.getAttribute("d").split(" ")), y[0] = y[0] * f[0] + e, y[1] = y[1] * f[1] + n, this.lines.call(this, y[2], y[0], y[1], f));
        return this;
      };
    }(e.API), function(t) {
      t.putTotalPages = function(t) {
        for (var e = new RegExp(t, "g"),
            n = 1; n <= this.internal.getNumberOfPages(); n++)
          for (var r = 0; r < this.internal.pages[n].length; r++)
            this.internal.pages[n][r] = this.internal.pages[n][r].replace(e, this.internal.getNumberOfPages());
        return this;
      };
    }(e.API), function(t) {
      if (t.URL = t.URL || t.webkitURL, t.Blob && t.URL)
        try {
          return void new Blob;
        } catch (e) {}
      var n = t.BlobBuilder || t.WebKitBlobBuilder || t.MozBlobBuilder || function(t) {
        var e = function(t) {
          return Object.prototype.toString.call(t).match(/^\[object\s(.*)\]$/)[1];
        },
            n = function() {
              this.data = [];
            },
            r = function(t, e, n) {
              this.data = t, this.size = t.length, this.type = e, this.encoding = n;
            },
            i = n.prototype,
            o = r.prototype,
            a = t.FileReaderSync,
            s = function(t) {
              this.code = this[this.name = t];
            },
            c = "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "),
            u = c.length,
            l = t.URL || t.webkitURL || t,
            h = l.createObjectURL,
            f = l.revokeObjectURL,
            d = l,
            p = t.btoa,
            m = t.atob,
            g = t.ArrayBuffer,
            w = t.Uint8Array,
            y = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;
        for (r.fake = o.fake = !0; u--; )
          s.prototype[c[u]] = u + 1;
        return l.createObjectURL || (d = t.URL = function(t) {
          var e,
              n = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
          return n.href = t, "origin" in n || ("data:" === n.protocol.toLowerCase() ? n.origin = null : (e = t.match(y), n.origin = e && e[1])), n;
        }), d.createObjectURL = function(t) {
          var e,
              n = t.type;
          return null === n && (n = "application/octet-stream"), t instanceof r ? (e = "data:" + n, "base64" === t.encoding ? e + ";base64," + t.data : "URI" === t.encoding ? e + "," + decodeURIComponent(t.data) : p ? e + ";base64," + p(t.data) : e + "," + encodeURIComponent(t.data)) : h ? h.call(l, t) : void 0;
        }, d.revokeObjectURL = function(t) {
          "data:" !== t.substring(0, 5) && f && f.call(l, t);
        }, i.append = function(t) {
          var n = this.data;
          if (w && (t instanceof g || t instanceof w)) {
            for (var i = "",
                o = new w(t),
                c = 0,
                u = o.length; u > c; c++)
              i += String.fromCharCode(o[c]);
            n.push(i);
          } else if ("Blob" === e(t) || "File" === e(t)) {
            if (!a)
              throw new s("NOT_READABLE_ERR");
            var l = new a;
            n.push(l.readAsBinaryString(t));
          } else
            t instanceof r ? "base64" === t.encoding && m ? n.push(m(t.data)) : "URI" === t.encoding ? n.push(decodeURIComponent(t.data)) : "raw" === t.encoding && n.push(t.data) : ("string" != typeof t && (t += ""), n.push(unescape(encodeURIComponent(t))));
        }, i.getBlob = function(t) {
          return arguments.length || (t = null), new r(this.data.join(""), t, "raw");
        }, i.toString = function() {
          return "[object BlobBuilder]";
        }, o.slice = function(t, e, n) {
          var i = arguments.length;
          return 3 > i && (n = null), new r(this.data.slice(t, i > 1 ? e : this.data.length), n, this.encoding);
        }, o.toString = function() {
          return "[object Blob]";
        }, o.close = function() {
          this.size = 0, delete this.data;
        }, n;
      }(t);
      t.Blob = function(t, e) {
        var r = e ? e.type || "" : "",
            i = new n;
        if (t)
          for (var o = 0,
              a = t.length; a > o; o++)
            Uint8Array && t[o] instanceof Uint8Array ? i.append(t[o].buffer) : i.append(t[o]);
        var s = i.getBlob(r);
        return !s.slice && s.webkitSlice && (s.slice = s.webkitSlice), s;
      };
      var r = Object.getPrototypeOf || function(t) {
        return t.__proto__;
      };
      t.Blob.prototype = r(new t.Blob);
    }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content || this);
    var r = r || function(t) {
      if ("undefined" == typeof navigator || !/MSIE [1-9]\./.test(navigator.userAgent)) {
        var e = t.document,
            n = function() {
              return t.URL || t.webkitURL || t;
            },
            r = e.createElementNS("http://www.w3.org/1999/xhtml", "a"),
            i = "download" in r,
            o = function(t) {
              var e = new MouseEvent("click");
              t.dispatchEvent(e);
            },
            a = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent),
            s = t.webkitRequestFileSystem,
            c = t.requestFileSystem || s || t.mozRequestFileSystem,
            u = function(e) {
              (t.setImmediate || t.setTimeout)(function() {
                throw e;
              }, 0);
            },
            l = "application/octet-stream",
            h = 0,
            f = 500,
            d = function(e) {
              var r = function() {
                "string" == typeof e ? n().revokeObjectURL(e) : e.remove();
              };
              t.chrome ? r() : setTimeout(r, f);
            },
            p = function(t, e, n) {
              e = [].concat(e);
              for (var r = e.length; r--; ) {
                var i = t["on" + e[r]];
                if ("function" == typeof i)
                  try {
                    i.call(t, n || t);
                  } catch (o) {
                    u(o);
                  }
              }
            },
            m = function(t) {
              return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type) ? new Blob(["\ufeff", t], {type: t.type}) : t;
            },
            g = function(e, u, f) {
              f || (e = m(e));
              var g,
                  w,
                  y,
                  v = this,
                  b = e.type,
                  x = !1,
                  k = function() {
                    p(v, "writestart progress write writeend".split(" "));
                  },
                  S = function() {
                    if (w && a && "undefined" != typeof FileReader) {
                      var r = new FileReader;
                      return r.onloadend = function() {
                        var t = r.result;
                        w.location.href = "data:attachment/file" + t.slice(t.search(/[,;]/)), v.readyState = v.DONE, k();
                      }, r.readAsDataURL(e), void(v.readyState = v.INIT);
                    }
                    if (!x && g || (g = n().createObjectURL(e)), w)
                      w.location.href = g;
                    else {
                      var i = t.open(g, "_blank");
                      void 0 == i && a && (t.location.href = g);
                    }
                    v.readyState = v.DONE, k(), d(g);
                  },
                  C = function(t) {
                    return function() {
                      return v.readyState !== v.DONE ? t.apply(this, arguments) : void 0;
                    };
                  },
                  A = {
                    create: !0,
                    exclusive: !1
                  };
              return v.readyState = v.INIT, u || (u = "download"), i ? (g = n().createObjectURL(e), void setTimeout(function() {
                r.href = g, r.download = u, o(r), k(), d(g), v.readyState = v.DONE;
              })) : (t.chrome && b && b !== l && (y = e.slice || e.webkitSlice, e = y.call(e, 0, e.size, l), x = !0), s && "download" !== u && (u += ".download"), (b === l || s) && (w = t), c ? (h += e.size, void c(t.TEMPORARY, h, C(function(t) {
                t.root.getDirectory("saved", A, C(function(t) {
                  var n = function() {
                    t.getFile(u, A, C(function(t) {
                      t.createWriter(C(function(n) {
                        n.onwriteend = function(e) {
                          w.location.href = t.toURL(), v.readyState = v.DONE, p(v, "writeend", e), d(t);
                        }, n.onerror = function() {
                          var t = n.error;
                          t.code !== t.ABORT_ERR && S();
                        }, "writestart progress write abort".split(" ").forEach(function(t) {
                          n["on" + t] = v["on" + t];
                        }), n.write(e), v.abort = function() {
                          n.abort(), v.readyState = v.DONE;
                        }, v.readyState = v.WRITING;
                      }), S);
                    }), S);
                  };
                  t.getFile(u, {create: !1}, C(function(t) {
                    t.remove(), n();
                  }), C(function(t) {
                    t.code === t.NOT_FOUND_ERR ? n() : S();
                  }));
                }), S);
              }), S)) : void S());
            },
            w = g.prototype,
            y = function(t, e, n) {
              return new g(t, e, n);
            };
        return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function(t, e, n) {
          return n || (t = m(t)), navigator.msSaveOrOpenBlob(t, e || "download");
        } : (w.abort = function() {
          var t = this;
          t.readyState = t.DONE, p(t, "abort");
        }, w.readyState = w.INIT = 0, w.WRITING = 1, w.DONE = 2, w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null, y);
      }
    }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);
    "undefined" != typeof module && module.exports ? module.exports.saveAs = r : "undefined" != typeof define && null !== define && null != define.amd && define([], function() {
      return r;
    }), void function(t, e) {
      "object" == typeof module ? module.exports = e() : "function" == typeof define ? define(e) : t.adler32cs = e();
    }(e, function() {
      var t = "function" == typeof ArrayBuffer && "function" == typeof Uint8Array,
          e = null,
          n = function() {
            if (!t)
              return function() {
                return !1;
              };
            try {
              var n = {};
              "function" == typeof n.Buffer && (e = n.Buffer);
            } catch (r) {}
            return function(t) {
              return t instanceof ArrayBuffer || null !== e && t instanceof e;
            };
          }(),
          r = function() {
            return null !== e ? function(t) {
              return new e(t, "utf8").toString("binary");
            } : function(t) {
              return unescape(encodeURIComponent(t));
            };
          }(),
          i = 65521,
          o = function(t, e) {
            for (var n = 65535 & t,
                r = t >>> 16,
                o = 0,
                a = e.length; a > o; o++)
              n = (n + (255 & e.charCodeAt(o))) % i, r = (r + n) % i;
            return (r << 16 | n) >>> 0;
          },
          a = function(t, e) {
            for (var n = 65535 & t,
                r = t >>> 16,
                o = 0,
                a = e.length; a > o; o++)
              n = (n + e[o]) % i, r = (r + n) % i;
            return (r << 16 | n) >>> 0;
          },
          s = {},
          c = s.Adler32 = function() {
            var e = function(t) {
              if (!(this instanceof e))
                throw new TypeError("Constructor cannot called be as a function.");
              if (!isFinite(t = null == t ? 1 : +t))
                throw new Error("First arguments needs to be a finite number.");
              this.checksum = t >>> 0;
            },
                i = e.prototype = {};
            return i.constructor = e, e.from = function(t) {
              return t.prototype = i, t;
            }(function(t) {
              if (!(this instanceof e))
                throw new TypeError("Constructor cannot called be as a function.");
              if (null == t)
                throw new Error("First argument needs to be a string.");
              this.checksum = o(1, t.toString());
            }), e.fromUtf8 = function(t) {
              return t.prototype = i, t;
            }(function(t) {
              if (!(this instanceof e))
                throw new TypeError("Constructor cannot called be as a function.");
              if (null == t)
                throw new Error("First argument needs to be a string.");
              var n = r(t.toString());
              this.checksum = o(1, n);
            }), t && (e.fromBuffer = function(t) {
              return t.prototype = i, t;
            }(function(t) {
              if (!(this instanceof e))
                throw new TypeError("Constructor cannot called be as a function.");
              if (!n(t))
                throw new Error("First argument needs to be ArrayBuffer.");
              var r = new Uint8Array(t);
              return this.checksum = a(1, r);
            })), i.update = function(t) {
              if (null == t)
                throw new Error("First argument needs to be a string.");
              return t = t.toString(), this.checksum = o(this.checksum, t);
            }, i.updateUtf8 = function(t) {
              if (null == t)
                throw new Error("First argument needs to be a string.");
              var e = r(t.toString());
              return this.checksum = o(this.checksum, e);
            }, t && (i.updateBuffer = function(t) {
              if (!n(t))
                throw new Error("First argument needs to be ArrayBuffer.");
              var e = new Uint8Array(t);
              return this.checksum = a(this.checksum, e);
            }), i.clone = function() {
              return new c(this.checksum);
            }, e;
          }();
      return s.from = function(t) {
        if (null == t)
          throw new Error("First argument needs to be a string.");
        return o(1, t.toString());
      }, s.fromUtf8 = function(t) {
        if (null == t)
          throw new Error("First argument needs to be a string.");
        var e = r(t.toString());
        return o(1, e);
      }, t && (s.fromBuffer = function(t) {
        if (!n(t))
          throw new Error("First argument need to be ArrayBuffer.");
        var e = new Uint8Array(t);
        return a(1, e);
      }), s;
    });
    var o = {};
    o._colorsTable = {
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
      "indianred ": "#cd5c5c",
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
      wheat: "#f5deb3",
      white: "#ffffff",
      whitesmoke: "#f5f5f5",
      yellow: "#ffff00",
      yellowgreen: "#9acd32"
    }, o.colorNameToHex = function(t) {
      return t = t.toLowerCase(), "undefined" != typeof this._colorsTable[t] ? this._colorsTable[t] : !1;
    };
    var a = function(t) {
      function e() {
        function t(t) {
          var e,
              n,
              i,
              o,
              a,
              c,
              u = r.dyn_tree,
              l = r.stat_desc.static_tree,
              h = r.stat_desc.extra_bits,
              f = r.stat_desc.extra_base,
              p = r.stat_desc.max_length,
              m = 0;
          for (o = 0; s >= o; o++)
            t.bl_count[o] = 0;
          for (u[2 * t.heap[t.heap_max] + 1] = 0, e = t.heap_max + 1; d > e; e++)
            n = t.heap[e], o = u[2 * u[2 * n + 1] + 1] + 1, o > p && (o = p, m++), u[2 * n + 1] = o, n > r.max_code || (t.bl_count[o]++, a = 0, n >= f && (a = h[n - f]), c = u[2 * n], t.opt_len += c * (o + a), l && (t.static_len += c * (l[2 * n + 1] + a)));
          if (0 !== m) {
            do {
              for (o = p - 1; 0 === t.bl_count[o]; )
                o--;
              t.bl_count[o]--, t.bl_count[o + 1] += 2, t.bl_count[p]--, m -= 2;
            } while (m > 0);
            for (o = p; 0 !== o; o--)
              for (n = t.bl_count[o]; 0 !== n; )
                i = t.heap[--e], i > r.max_code || (u[2 * i + 1] != o && (t.opt_len += (o - u[2 * i + 1]) * u[2 * i], u[2 * i + 1] = o), n--);
          }
        }
        function e(t, e) {
          var n = 0;
          do
            n |= 1 & t, t >>>= 1, n <<= 1;
 while (--e > 0);
          return n >>> 1;
        }
        function n(t, n, r) {
          var i,
              o,
              a,
              c = [],
              u = 0;
          for (i = 1; s >= i; i++)
            c[i] = u = u + r[i - 1] << 1;
          for (o = 0; n >= o; o++)
            a = t[2 * o + 1], 0 !== a && (t[2 * o] = e(c[a]++, a));
        }
        var r = this;
        r.build_tree = function(e) {
          var i,
              o,
              a,
              s = r.dyn_tree,
              c = r.stat_desc.static_tree,
              u = r.stat_desc.elems,
              l = -1;
          for (e.heap_len = 0, e.heap_max = d, i = 0; u > i; i++)
            0 !== s[2 * i] ? (e.heap[++e.heap_len] = l = i, e.depth[i] = 0) : s[2 * i + 1] = 0;
          for (; e.heap_len < 2; )
            a = e.heap[++e.heap_len] = 2 > l ? ++l : 0, s[2 * a] = 1, e.depth[a] = 0, e.opt_len--, c && (e.static_len -= c[2 * a + 1]);
          for (r.max_code = l, i = Math.floor(e.heap_len / 2); i >= 1; i--)
            e.pqdownheap(s, i);
          a = u;
          do
            i = e.heap[1], e.heap[1] = e.heap[e.heap_len--], e.pqdownheap(s, 1), o = e.heap[1], e.heap[--e.heap_max] = i, e.heap[--e.heap_max] = o, s[2 * a] = s[2 * i] + s[2 * o], e.depth[a] = Math.max(e.depth[i], e.depth[o]) + 1, s[2 * i + 1] = s[2 * o + 1] = a, e.heap[1] = a++, e.pqdownheap(s, 1);
 while (e.heap_len >= 2);
          e.heap[--e.heap_max] = e.heap[1], t(e), n(s, r.max_code, e.bl_count);
        };
      }
      function n(t, e, n, r, i) {
        var o = this;
        o.static_tree = t, o.extra_bits = e, o.extra_base = n, o.elems = r, o.max_length = i;
      }
      function r(t, e, n, r, i) {
        var o = this;
        o.good_length = t, o.max_lazy = e, o.nice_length = n, o.max_chain = r, o.func = i;
      }
      function i(t, e, n, r) {
        var i = t[2 * e],
            o = t[2 * n];
        return o > i || i == o && r[e] <= r[n];
      }
      function o() {
        function t() {
          var t;
          for (Et = 2 * qt, Ot[Bt - 1] = 0, t = 0; Bt - 1 > t; t++)
            Ot[t] = 0;
          Yt = L[Gt].max_lazy, Qt = L[Gt].good_length, Kt = L[Gt].nice_length, Vt = L[Gt].max_chain, Ut = 0, Nt = 0, Wt = 0, zt = Xt = tt - 1, Mt = 0, Ft = 0;
        }
        function r() {
          var t;
          for (t = 0; f > t; t++)
            $t[2 * t] = 0;
          for (t = 0; c > t; t++)
            Zt[2 * t] = 0;
          for (t = 0; u > t; t++)
            te[2 * t] = 0;
          $t[2 * p] = 1, ee.opt_len = ee.static_len = 0, se = ue = 0;
        }
        function o() {
          ne.dyn_tree = $t, ne.stat_desc = n.static_l_desc, re.dyn_tree = Zt, re.stat_desc = n.static_d_desc, ie.dyn_tree = te, ie.stat_desc = n.static_bl_desc, he = 0, fe = 0, le = 8, r();
        }
        function a(t, e) {
          var n,
              r,
              i = -1,
              o = t[1],
              a = 0,
              s = 7,
              c = 4;
          for (0 === o && (s = 138, c = 3), t[2 * (e + 1) + 1] = 65535, n = 0; e >= n; n++)
            r = o, o = t[2 * (n + 1) + 1], ++a < s && r == o || (c > a ? te[2 * r] += a : 0 !== r ? (r != i && te[2 * r]++, te[2 * g]++) : 10 >= a ? te[2 * w]++ : te[2 * y]++, a = 0, i = r, 0 === o ? (s = 138, c = 3) : r == o ? (s = 6, c = 3) : (s = 7, c = 4));
        }
        function s() {
          var t;
          for (a($t, ne.max_code), a(Zt, re.max_code), ie.build_tree(ee), t = u - 1; t >= 3 && 0 === te[2 * e.bl_order[t] + 1]; t--)
            ;
          return ee.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
        }
        function l(t) {
          ee.pending_buf[ee.pending++] = t;
        }
        function d(t) {
          l(255 & t), l(t >>> 8 & 255);
        }
        function m(t) {
          l(t >> 8 & 255), l(255 & t & 255);
        }
        function B(t, e) {
          var n,
              r = e;
          fe > v - r ? (n = t, he |= n << fe & 65535, d(he), he = n >>> v - fe, fe += r - v) : (he |= t << fe & 65535, fe += r);
        }
        function rt(t, e) {
          var n = 2 * t;
          B(65535 & e[n], 65535 & e[n + 1]);
        }
        function it(t, e) {
          var n,
              r,
              i = -1,
              o = t[1],
              a = 0,
              s = 7,
              c = 4;
          for (0 === o && (s = 138, c = 3), n = 0; e >= n; n++)
            if (r = o, o = t[2 * (n + 1) + 1], !(++a < s && r == o)) {
              if (c > a) {
                do
                  rt(r, te);
 while (0 !== --a);
              } else
                0 !== r ? (r != i && (rt(r, te), a--), rt(g, te), B(a - 3, 2)) : 10 >= a ? (rt(w, te), B(a - 3, 3)) : (rt(y, te), B(a - 11, 7));
              a = 0, i = r, 0 === o ? (s = 138, c = 3) : r == o ? (s = 6, c = 3) : (s = 7, c = 4);
            }
        }
        function ot(t, n, r) {
          var i;
          for (B(t - 257, 5), B(n - 1, 5), B(r - 4, 4), i = 0; r > i; i++)
            B(te[2 * e.bl_order[i] + 1], 3);
          it($t, t - 1), it(Zt, n - 1);
        }
        function at() {
          16 == fe ? (d(he), he = 0, fe = 0) : fe >= 8 && (l(255 & he), he >>>= 8, fe -= 8);
        }
        function st() {
          B($ << 1, 3), rt(p, n.static_ltree), at(), 9 > 1 + le + 10 - fe && (B($ << 1, 3), rt(p, n.static_ltree), at()), le = 7;
        }
        function ct(t, n) {
          var r,
              i,
              o;
          if (ee.pending_buf[ce + 2 * se] = t >>> 8 & 255, ee.pending_buf[ce + 2 * se + 1] = 255 & t, ee.pending_buf[oe + se] = 255 & n, se++, 0 === t ? $t[2 * n]++ : (ue++, t--, $t[2 * (e._length_code[n] + h + 1)]++, Zt[2 * e.d_code(t)]++), 0 === (8191 & se) && Gt > 2) {
            for (r = 8 * se, i = Ut - Nt, o = 0; c > o; o++)
              r += Zt[2 * o] * (5 + e.extra_dbits[o]);
            if (r >>>= 3, ue < Math.floor(se / 2) && r < Math.floor(i / 2))
              return !0;
          }
          return se == ae - 1;
        }
        function ut(t, n) {
          var r,
              i,
              o,
              a,
              s = 0;
          if (0 !== se)
            do
              r = ee.pending_buf[ce + 2 * s] << 8 & 65280 | 255 & ee.pending_buf[ce + 2 * s + 1], i = 255 & ee.pending_buf[oe + s], s++, 0 === r ? rt(i, t) : (o = e._length_code[i], rt(o + h + 1, t), a = e.extra_lbits[o], 0 !== a && (i -= e.base_length[o], B(i, a)), r--, o = e.d_code(r), rt(o, n), a = e.extra_dbits[o], 0 !== a && (r -= e.base_dist[o], B(r, a)));
 while (se > s);
          rt(p, t), le = t[2 * p + 1];
        }
        function lt() {
          fe > 8 ? d(he) : fe > 0 && l(255 & he), he = 0, fe = 0;
        }
        function ht(t, e, n) {
          lt(), le = 8, n && (d(e), d(~e)), ee.pending_buf.set(Tt.subarray(t, t + e), ee.pending), ee.pending += e;
        }
        function ft(t, e, n) {
          B((K << 1) + (n ? 1 : 0), 3), ht(t, e, !0);
        }
        function dt(t, e, i) {
          var o,
              a,
              c = 0;
          Gt > 0 ? (ne.build_tree(ee), re.build_tree(ee), c = s(), o = ee.opt_len + 3 + 7 >>> 3, a = ee.static_len + 3 + 7 >>> 3, o >= a && (o = a)) : o = a = e + 5, o >= e + 4 && -1 != t ? ft(t, e, i) : a == o ? (B(($ << 1) + (i ? 1 : 0), 3), ut(n.static_ltree, n.static_dtree)) : (B((Z << 1) + (i ? 1 : 0), 3), ot(ne.max_code + 1, re.max_code + 1, c + 1), ut($t, Zt)), r(), i && lt();
        }
        function pt(t) {
          dt(Nt >= 0 ? Nt : -1, Ut - Nt, t), Nt = Ut, xt.flush_pending();
        }
        function mt() {
          var t,
              e,
              n,
              r;
          do {
            if (r = Et - Wt - Ut, 0 === r && 0 === Ut && 0 === Wt)
              r = qt;
            else if (-1 == r)
              r--;
            else if (Ut >= qt + qt - nt) {
              Tt.set(Tt.subarray(qt, qt + qt), 0), Ht -= qt, Ut -= qt, Nt -= qt, t = Bt, n = t;
              do
                e = 65535 & Ot[--n], Ot[n] = e >= qt ? e - qt : 0;
 while (0 !== --t);
              t = qt, n = t;
              do
                e = 65535 & It[--n], It[n] = e >= qt ? e - qt : 0;
 while (0 !== --t);
              r += qt;
            }
            if (0 === xt.avail_in)
              return;
            t = xt.read_buf(Tt, Ut + Wt, r), Wt += t, Wt >= tt && (Ft = 255 & Tt[Ut], Ft = (Ft << Dt ^ 255 & Tt[Ut + 1]) & jt);
          } while (nt > Wt && 0 !== xt.avail_in);
        }
        function gt(t) {
          var e,
              n = 65535;
          for (n > St - 5 && (n = St - 5); ; ) {
            if (1 >= Wt) {
              if (mt(), 0 === Wt && t == C)
                return U;
              if (0 === Wt)
                break;
            }
            if (Ut += Wt, Wt = 0, e = Nt + n, (0 === Ut || Ut >= e) && (Wt = Ut - e, Ut = e, pt(!1), 0 === xt.avail_out))
              return U;
            if (Ut - Nt >= qt - nt && (pt(!1), 0 === xt.avail_out))
              return U;
          }
          return pt(t == _), 0 === xt.avail_out ? t == _ ? W : U : t == _ ? X : H;
        }
        function wt(t) {
          var e,
              n,
              r = Vt,
              i = Ut,
              o = Xt,
              a = Ut > qt - nt ? Ut - (qt - nt) : 0,
              s = Kt,
              c = Pt,
              u = Ut + et,
              l = Tt[i + o - 1],
              h = Tt[i + o];
          Xt >= Qt && (r >>= 2), s > Wt && (s = Wt);
          do
            if (e = t, Tt[e + o] == h && Tt[e + o - 1] == l && Tt[e] == Tt[i] && Tt[++e] == Tt[i + 1]) {
              i += 2, e++;
              do
                ;
 while (Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && Tt[++i] == Tt[++e] && u > i);
              if (n = et - (u - i), i = u - et, n > o) {
                if (Ht = t, o = n, n >= s)
                  break;
                l = Tt[i + o - 1], h = Tt[i + o];
              }
            }
 while ((t = 65535 & It[t & c]) > a && 0 !== --r);
          return Wt >= o ? o : Wt;
        }
        function yt(t) {
          for (var e,
              n = 0; ; ) {
            if (nt > Wt) {
              if (mt(), nt > Wt && t == C)
                return U;
              if (0 === Wt)
                break;
            }
            if (Wt >= tt && (Ft = (Ft << Dt ^ 255 & Tt[Ut + (tt - 1)]) & jt, n = 65535 & Ot[Ft], It[Ut & Pt] = Ot[Ft], Ot[Ft] = Ut), 0 !== n && qt - nt >= (Ut - n & 65535) && Jt != k && (zt = wt(n)), zt >= tt)
              if (e = ct(Ut - Ht, zt - tt), Wt -= zt, Yt >= zt && Wt >= tt) {
                zt--;
                do
                  Ut++, Ft = (Ft << Dt ^ 255 & Tt[Ut + (tt - 1)]) & jt, n = 65535 & Ot[Ft], It[Ut & Pt] = Ot[Ft], Ot[Ft] = Ut;
 while (0 !== --zt);
                Ut++;
              } else
                Ut += zt, zt = 0, Ft = 255 & Tt[Ut], Ft = (Ft << Dt ^ 255 & Tt[Ut + 1]) & jt;
            else
              e = ct(0, 255 & Tt[Ut]), Wt--, Ut++;
            if (e && (pt(!1), 0 === xt.avail_out))
              return U;
          }
          return pt(t == _), 0 === xt.avail_out ? t == _ ? W : U : t == _ ? X : H;
        }
        function vt(t) {
          for (var e,
              n,
              r = 0; ; ) {
            if (nt > Wt) {
              if (mt(), nt > Wt && t == C)
                return U;
              if (0 === Wt)
                break;
            }
            if (Wt >= tt && (Ft = (Ft << Dt ^ 255 & Tt[Ut + (tt - 1)]) & jt, r = 65535 & Ot[Ft], It[Ut & Pt] = Ot[Ft], Ot[Ft] = Ut), Xt = zt, Lt = Ht, zt = tt - 1, 0 !== r && Yt > Xt && qt - nt >= (Ut - r & 65535) && (Jt != k && (zt = wt(r)), 5 >= zt && (Jt == x || zt == tt && Ut - Ht > 4096) && (zt = tt - 1)), Xt >= tt && Xt >= zt) {
              n = Ut + Wt - tt, e = ct(Ut - 1 - Lt, Xt - tt), Wt -= Xt - 1, Xt -= 2;
              do
                ++Ut <= n && (Ft = (Ft << Dt ^ 255 & Tt[Ut + (tt - 1)]) & jt, r = 65535 & Ot[Ft], It[Ut & Pt] = Ot[Ft], Ot[Ft] = Ut);
 while (0 !== --Xt);
              if (Mt = 0, zt = tt - 1, Ut++, e && (pt(!1), 0 === xt.avail_out))
                return U;
            } else if (0 !== Mt) {
              if (e = ct(0, 255 & Tt[Ut - 1]), e && pt(!1), Ut++, Wt--, 0 === xt.avail_out)
                return U;
            } else
              Mt = 1, Ut++, Wt--;
          }
          return 0 !== Mt && (e = ct(0, 255 & Tt[Ut - 1]), Mt = 0), pt(t == _), 0 === xt.avail_out ? t == _ ? W : U : t == _ ? X : H;
        }
        function bt(e) {
          return e.total_in = e.total_out = 0, e.msg = null, ee.pending = 0, ee.pending_out = 0, kt = G, At = C, o(), t(), P;
        }
        var xt,
            kt,
            St,
            Ct,
            At,
            qt,
            _t,
            Pt,
            Tt,
            Et,
            It,
            Ot,
            Ft,
            Bt,
            Rt,
            jt,
            Dt,
            Nt,
            zt,
            Lt,
            Mt,
            Ut,
            Ht,
            Wt,
            Xt,
            Vt,
            Yt,
            Gt,
            Jt,
            Qt,
            Kt,
            $t,
            Zt,
            te,
            ee = this,
            ne = new e,
            re = new e,
            ie = new e;
        ee.depth = [];
        var oe,
            ae,
            se,
            ce,
            ue,
            le,
            he,
            fe;
        ee.bl_count = [], ee.heap = [], $t = [], Zt = [], te = [], ee.pqdownheap = function(t, e) {
          for (var n = ee.heap,
              r = n[e],
              o = e << 1; o <= ee.heap_len && (o < ee.heap_len && i(t, n[o + 1], n[o], ee.depth) && o++, !i(t, r, n[o], ee.depth)); )
            n[e] = n[o], e = o, o <<= 1;
          n[e] = r;
        }, ee.deflateInit = function(t, e, n, r, i, o) {
          return r || (r = Q), i || (i = j), o || (o = S), t.msg = null, e == b && (e = 6), 1 > i || i > R || r != Q || 9 > n || n > 15 || 0 > e || e > 9 || 0 > o || o > k ? I : (t.dstate = ee, _t = n, qt = 1 << _t, Pt = qt - 1, Rt = i + 7, Bt = 1 << Rt, jt = Bt - 1, Dt = Math.floor((Rt + tt - 1) / tt), Tt = new Uint8Array(2 * qt), It = [], Ot = [], ae = 1 << i + 6, ee.pending_buf = new Uint8Array(4 * ae), St = 4 * ae, ce = Math.floor(ae / 2), oe = 3 * ae, Gt = e, Jt = o, Ct = 255 & r, bt(t));
        }, ee.deflateEnd = function() {
          return kt != Y && kt != G && kt != J ? I : (ee.pending_buf = null, Ot = null, It = null, Tt = null, ee.dstate = null, kt == G ? O : P);
        }, ee.deflateParams = function(t, e, n) {
          var r = P;
          return e == b && (e = 6), 0 > e || e > 9 || 0 > n || n > k ? I : (L[Gt].func != L[e].func && 0 !== t.total_in && (r = t.deflate(A)), Gt != e && (Gt = e, Yt = L[Gt].max_lazy, Qt = L[Gt].good_length, Kt = L[Gt].nice_length, Vt = L[Gt].max_chain), Jt = n, r);
        }, ee.deflateSetDictionary = function(t, e, n) {
          var r,
              i = n,
              o = 0;
          if (!e || kt != Y)
            return I;
          if (tt > i)
            return P;
          for (i > qt - nt && (i = qt - nt, o = n - i), Tt.set(e.subarray(o, o + i), 0), Ut = i, Nt = i, Ft = 255 & Tt[0], Ft = (Ft << Dt ^ 255 & Tt[1]) & jt, r = 0; i - tt >= r; r++)
            Ft = (Ft << Dt ^ 255 & Tt[r + (tt - 1)]) & jt, It[r & Pt] = Ot[Ft], Ot[Ft] = r;
          return P;
        }, ee.deflate = function(t, e) {
          var n,
              r,
              i,
              o,
              a;
          if (e > _ || 0 > e)
            return I;
          if (!t.next_out || !t.next_in && 0 !== t.avail_in || kt == J && e != _)
            return t.msg = M[E - I], I;
          if (0 === t.avail_out)
            return t.msg = M[E - F], F;
          if (xt = t, o = At, At = e, kt == Y && (r = Q + (_t - 8 << 4) << 8, i = (Gt - 1 & 255) >> 1, i > 3 && (i = 3), r |= i << 6, 0 !== Ut && (r |= V), r += 31 - r % 31, kt = G, m(r)), 0 !== ee.pending) {
            if (xt.flush_pending(), 0 === xt.avail_out)
              return At = -1, P;
          } else if (0 === xt.avail_in && o >= e && e != _)
            return xt.msg = M[E - F], F;
          if (kt == J && 0 !== xt.avail_in)
            return t.msg = M[E - F], F;
          if (0 !== xt.avail_in || 0 !== Wt || e != C && kt != J) {
            switch (a = -1, L[Gt].func) {
              case D:
                a = gt(e);
                break;
              case N:
                a = yt(e);
                break;
              case z:
                a = vt(e);
            }
            if (a != W && a != X || (kt = J), a == U || a == W)
              return 0 === xt.avail_out && (At = -1), P;
            if (a == H) {
              if (e == A)
                st();
              else if (ft(0, 0, !1), e == q)
                for (n = 0; Bt > n; n++)
                  Ot[n] = 0;
              if (xt.flush_pending(), 0 === xt.avail_out)
                return At = -1, P;
            }
          }
          return e != _ ? P : T;
        };
      }
      function a() {
        var t = this;
        t.next_in_index = 0, t.next_out_index = 0, t.avail_in = 0, t.total_in = 0, t.avail_out = 0, t.total_out = 0;
      }
      var s = 15,
          c = 30,
          u = 19,
          l = 29,
          h = 256,
          f = h + 1 + l,
          d = 2 * f + 1,
          p = 256,
          m = 7,
          g = 16,
          w = 17,
          y = 18,
          v = 16,
          b = -1,
          x = 1,
          k = 2,
          S = 0,
          C = 0,
          A = 1,
          q = 3,
          _ = 4,
          P = 0,
          T = 1,
          E = 2,
          I = -2,
          O = -3,
          F = -5,
          B = [0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 16, 17, 18, 18, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29];
      e._length_code = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28], e.base_length = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0], e.base_dist = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384, 24576], e.d_code = function(t) {
        return 256 > t ? B[t] : B[256 + (t >>> 7)];
      }, e.extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], e.extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], e.extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], e.bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], n.static_ltree = [12, 8, 140, 8, 76, 8, 204, 8, 44, 8, 172, 8, 108, 8, 236, 8, 28, 8, 156, 8, 92, 8, 220, 8, 60, 8, 188, 8, 124, 8, 252, 8, 2, 8, 130, 8, 66, 8, 194, 8, 34, 8, 162, 8, 98, 8, 226, 8, 18, 8, 146, 8, 82, 8, 210, 8, 50, 8, 178, 8, 114, 8, 242, 8, 10, 8, 138, 8, 74, 8, 202, 8, 42, 8, 170, 8, 106, 8, 234, 8, 26, 8, 154, 8, 90, 8, 218, 8, 58, 8, 186, 8, 122, 8, 250, 8, 6, 8, 134, 8, 70, 8, 198, 8, 38, 8, 166, 8, 102, 8, 230, 8, 22, 8, 150, 8, 86, 8, 214, 8, 54, 8, 182, 8, 118, 8, 246, 8, 14, 8, 142, 8, 78, 8, 206, 8, 46, 8, 174, 8, 110, 8, 238, 8, 30, 8, 158, 8, 94, 8, 222, 8, 62, 8, 190, 8, 126, 8, 254, 8, 1, 8, 129, 8, 65, 8, 193, 8, 33, 8, 161, 8, 97, 8, 225, 8, 17, 8, 145, 8, 81, 8, 209, 8, 49, 8, 177, 8, 113, 8, 241, 8, 9, 8, 137, 8, 73, 8, 201, 8, 41, 8, 169, 8, 105, 8, 233, 8, 25, 8, 153, 8, 89, 8, 217, 8, 57, 8, 185, 8, 121, 8, 249, 8, 5, 8, 133, 8, 69, 8, 197, 8, 37, 8, 165, 8, 101, 8, 229, 8, 21, 8, 149, 8, 85, 8, 213, 8, 53, 8, 181, 8, 117, 8, 245, 8, 13, 8, 141, 8, 77, 8, 205, 8, 45, 8, 173, 8, 109, 8, 237, 8, 29, 8, 157, 8, 93, 8, 221, 8, 61, 8, 189, 8, 125, 8, 253, 8, 19, 9, 275, 9, 147, 9, 403, 9, 83, 9, 339, 9, 211, 9, 467, 9, 51, 9, 307, 9, 179, 9, 435, 9, 115, 9, 371, 9, 243, 9, 499, 9, 11, 9, 267, 9, 139, 9, 395, 9, 75, 9, 331, 9, 203, 9, 459, 9, 43, 9, 299, 9, 171, 9, 427, 9, 107, 9, 363, 9, 235, 9, 491, 9, 27, 9, 283, 9, 155, 9, 411, 9, 91, 9, 347, 9, 219, 9, 475, 9, 59, 9, 315, 9, 187, 9, 443, 9, 123, 9, 379, 9, 251, 9, 507, 9, 7, 9, 263, 9, 135, 9, 391, 9, 71, 9, 327, 9, 199, 9, 455, 9, 39, 9, 295, 9, 167, 9, 423, 9, 103, 9, 359, 9, 231, 9, 487, 9, 23, 9, 279, 9, 151, 9, 407, 9, 87, 9, 343, 9, 215, 9, 471, 9, 55, 9, 311, 9, 183, 9, 439, 9, 119, 9, 375, 9, 247, 9, 503, 9, 15, 9, 271, 9, 143, 9, 399, 9, 79, 9, 335, 9, 207, 9, 463, 9, 47, 9, 303, 9, 175, 9, 431, 9, 111, 9, 367, 9, 239, 9, 495, 9, 31, 9, 287, 9, 159, 9, 415, 9, 95, 9, 351, 9, 223, 9, 479, 9, 63, 9, 319, 9, 191, 9, 447, 9, 127, 9, 383, 9, 255, 9, 511, 9, 0, 7, 64, 7, 32, 7, 96, 7, 16, 7, 80, 7, 48, 7, 112, 7, 8, 7, 72, 7, 40, 7, 104, 7, 24, 7, 88, 7, 56, 7, 120, 7, 4, 7, 68, 7, 36, 7, 100, 7, 20, 7, 84, 7, 52, 7, 116, 7, 3, 8, 131, 8, 67, 8, 195, 8, 35, 8, 163, 8, 99, 8, 227, 8], n.static_dtree = [0, 5, 16, 5, 8, 5, 24, 5, 4, 5, 20, 5, 12, 5, 28, 5, 2, 5, 18, 5, 10, 5, 26, 5, 6, 5, 22, 5, 14, 5, 30, 5, 1, 5, 17, 5, 9, 5, 25, 5, 5, 5, 21, 5, 13, 5, 29, 5, 3, 5, 19, 5, 11, 5, 27, 5, 7, 5, 23, 5], n.static_l_desc = new n(n.static_ltree, e.extra_lbits, h + 1, f, s), n.static_d_desc = new n(n.static_dtree, e.extra_dbits, 0, c, s), n.static_bl_desc = new n(null, e.extra_blbits, 0, u, m);
      var R = 9,
          j = 8,
          D = 0,
          N = 1,
          z = 2,
          L = [new r(0, 0, 0, 0, D), new r(4, 4, 8, 4, N), new r(4, 5, 16, 8, N), new r(4, 6, 32, 32, N), new r(4, 4, 16, 16, z), new r(8, 16, 32, 32, z), new r(8, 16, 128, 128, z), new r(8, 32, 128, 256, z), new r(32, 128, 258, 1024, z), new r(32, 258, 258, 4096, z)],
          M = ["need dictionary", "stream end", "", "", "stream error", "data error", "", "buffer error", "", ""],
          U = 0,
          H = 1,
          W = 2,
          X = 3,
          V = 32,
          Y = 42,
          G = 113,
          J = 666,
          Q = 8,
          K = 0,
          $ = 1,
          Z = 2,
          tt = 3,
          et = 258,
          nt = et + tt + 1;
      return a.prototype = {
        deflateInit: function(t, e) {
          var n = this;
          return n.dstate = new o, e || (e = s), n.dstate.deflateInit(n, t, e);
        },
        deflate: function(t) {
          var e = this;
          return e.dstate ? e.dstate.deflate(e, t) : I;
        },
        deflateEnd: function() {
          var t = this;
          if (!t.dstate)
            return I;
          var e = t.dstate.deflateEnd();
          return t.dstate = null, e;
        },
        deflateParams: function(t, e) {
          var n = this;
          return n.dstate ? n.dstate.deflateParams(n, t, e) : I;
        },
        deflateSetDictionary: function(t, e) {
          var n = this;
          return n.dstate ? n.dstate.deflateSetDictionary(n, t, e) : I;
        },
        read_buf: function(t, e, n) {
          var r = this,
              i = r.avail_in;
          return i > n && (i = n), 0 === i ? 0 : (r.avail_in -= i, t.set(r.next_in.subarray(r.next_in_index, r.next_in_index + i), e), r.next_in_index += i, r.total_in += i, i);
        },
        flush_pending: function() {
          var t = this,
              e = t.dstate.pending;
          e > t.avail_out && (e = t.avail_out), 0 !== e && (t.next_out.set(t.dstate.pending_buf.subarray(t.dstate.pending_out, t.dstate.pending_out + e), t.next_out_index), t.next_out_index += e, t.dstate.pending_out += e, t.total_out += e, t.avail_out -= e, t.dstate.pending -= e, 0 === t.dstate.pending && (t.dstate.pending_out = 0));
        }
      }, function(t) {
        var e = this,
            n = new a,
            r = 512,
            i = C,
            o = new Uint8Array(r);
        "undefined" == typeof t && (t = b), n.deflateInit(t), n.next_out = o, e.append = function(t, e) {
          var a,
              s,
              c = [],
              u = 0,
              l = 0,
              h = 0;
          if (t.length) {
            n.next_in_index = 0, n.next_in = t, n.avail_in = t.length;
            do {
              if (n.next_out_index = 0, n.avail_out = r, a = n.deflate(i), a != P)
                throw "deflating: " + n.msg;
              n.next_out_index && (n.next_out_index == r ? c.push(new Uint8Array(o)) : c.push(new Uint8Array(o.subarray(0, n.next_out_index)))), h += n.next_out_index, e && n.next_in_index > 0 && n.next_in_index != u && (e(n.next_in_index), u = n.next_in_index);
            } while (n.avail_in > 0 || 0 === n.avail_out);
            return s = new Uint8Array(h), c.forEach(function(t) {
              s.set(t, l), l += t.length;
            }), s;
          }
        }, e.flush = function() {
          var t,
              e,
              i = [],
              a = 0,
              s = 0;
          do {
            if (n.next_out_index = 0, n.avail_out = r, t = n.deflate(_), t != T && t != P)
              throw "deflating: " + n.msg;
            r - n.avail_out > 0 && i.push(new Uint8Array(o.subarray(0, n.next_out_index))), s += n.next_out_index;
          } while (n.avail_in > 0 || 0 === n.avail_out);
          return n.deflateEnd(), e = new Uint8Array(s), i.forEach(function(t) {
            e.set(t, a), a += t.length;
          }), e;
        };
      };
    }(this);
    (function(t, e, n, r, i, o, a) {
      function s(t, e, n, r) {
        return p(t, t, n, r, e).then(function(i) {
          I("Document cloned");
          var o = "[" + Wt + "='true']";
          t.querySelector(o).removeAttribute(Wt);
          var a = i.contentWindow,
              s = a.document.querySelector(o),
              u = "function" == typeof e.onclone ? Promise.resolve(e.onclone(a.document)) : Promise.resolve(!0);
          return u.then(function() {
            return c(s, i, e, n, r);
          });
        });
      }
      function c(t, n, r, i, o) {
        var a = n.contentWindow,
            s = new Bt(a.document),
            c = new T(r, s),
            d = z(t),
            p = "view" === r.type ? i : h(a.document),
            m = "view" === r.type ? o : f(a.document),
            g = new Ut(p, m, c, r, e),
            w = new M(t, g, s, c, r);
        return w.ready.then(function() {
          I("Finished rendering");
          var e;
          return e = "view" === r.type ? l(g.canvas, {
            width: g.canvas.width,
            height: g.canvas.height,
            top: 0,
            left: 0,
            x: 0,
            y: 0
          }) : t === a.document.body || t === a.document.documentElement || null != r.canvas ? g.canvas : l(g.canvas, {
            width: null != r.width ? r.width : d.width,
            height: null != r.height ? r.height : d.height,
            top: d.top,
            left: d.left,
            x: a.pageXOffset,
            y: a.pageYOffset
          }), u(n, r), e;
        });
      }
      function u(t, e) {
        e.removeContainer && (t.parentNode.removeChild(t), I("Cleaned up container"));
      }
      function l(t, n) {
        var r = e.createElement("canvas"),
            i = Math.min(t.width - 1, Math.max(0, n.left)),
            o = Math.min(t.width, Math.max(1, n.left + n.width)),
            a = Math.min(t.height - 1, Math.max(0, n.top)),
            s = Math.min(t.height, Math.max(1, n.top + n.height));
        return r.width = n.width, r.height = n.height, I("Cropping canvas at:", "left:", n.left, "top:", n.top, "width:", o - i, "height:", s - a), I("Resulting crop with width", n.width, "and height", n.height, " with x", i, "and y", a), r.getContext("2d").drawImage(t, i, a, o - i, s - a, n.x, n.y, o - i, s - a), r;
      }
      function h(t) {
        return Math.max(Math.max(t.body.scrollWidth, t.documentElement.scrollWidth), Math.max(t.body.offsetWidth, t.documentElement.offsetWidth), Math.max(t.body.clientWidth, t.documentElement.clientWidth));
      }
      function f(t) {
        return Math.max(Math.max(t.body.scrollHeight, t.documentElement.scrollHeight), Math.max(t.body.offsetHeight, t.documentElement.offsetHeight), Math.max(t.body.clientHeight, t.documentElement.clientHeight));
      }
      function d() {
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      }
      function p(t, e, n, r, i) {
        y(t);
        var o = t.documentElement.cloneNode(!0),
            a = e.createElement("iframe");
        return a.className = "html2canvas-container", a.style.visibility = "hidden", a.style.position = "fixed", a.style.left = "-10000px", a.style.top = "0px", a.style.border = "0", a.width = n, a.height = r, a.scrolling = "no", e.body.appendChild(a), new Promise(function(e) {
          var n = a.contentWindow.document;
          a.contentWindow.onload = a.onload = function() {
            var o = setInterval(function() {
              n.body.childNodes.length > 0 && (v(t, n), clearInterval(o), "view" === i.type && a.contentWindow.scrollTo(r, s), e(a));
            }, 50);
          };
          var r = t.defaultView.pageXOffset,
              s = t.defaultView.pageYOffset;
          n.open(), n.write("<!DOCTYPE html><html></html>"), m(t, r, s), n.replaceChild(i.javascriptEnabled === !0 ? n.adoptNode(o) : b(n.adoptNode(o)), n.documentElement), n.close();
        });
      }
      function m(t, e, n) {
        e === t.defaultView.pageXOffset && n === t.defaultView.pageYOffset || t.defaultView.scrollTo(e, n);
      }
      function g(e, n, r, i, o, a) {
        return new At(e, n, t.document).then(w(e)).then(function(t) {
          return p(t, r, i, o, a);
        });
      }
      function w(t) {
        return function(n) {
          var r,
              i = new DOMParser;
          try {
            r = i.parseFromString(n, "text/html");
          } catch (o) {
            I("DOMParser not supported, falling back to createHTMLDocument"), r = e.implementation.createHTMLDocument("");
            try {
              r.open(), r.write(n), r.close();
            } catch (a) {
              I("createHTMLDocument write not supported, falling back to document.body.innerHTML"), r.body.innerHTML = n;
            }
          }
          var s = r.querySelector("base");
          if (!s || !s.href.host) {
            var c = r.createElement("base");
            c.href = t, r.head.insertBefore(c, r.head.firstChild);
          }
          return r;
        };
      }
      function y(t) {
        [].slice.call(t.querySelectorAll("canvas"), 0).forEach(function(t) {
          t.setAttribute(Xt, "canvas-" + Vt++);
        });
      }
      function v(t, e) {
        [].slice.call(t.querySelectorAll("[" + Xt + "]"), 0).forEach(function(t) {
          try {
            var n = e.querySelector("[" + Xt + '="' + t.getAttribute(Xt) + '"]');
            n && (n.width = t.width, n.height = t.height, n.getContext("2d").putImageData(t.getContext("2d").getImageData(0, 0, t.width, t.height), 0, 0));
          } catch (r) {
            I("Unable to copy canvas content from", t, r);
          }
          t.removeAttribute(Xt);
        });
      }
      function b(t) {
        return [].slice.call(t.childNodes, 0).filter(x).forEach(function(e) {
          "SCRIPT" === e.tagName ? t.removeChild(e) : b(e);
        }), t;
      }
      function x(t) {
        return t.nodeType === Node.ELEMENT_NODE;
      }
      function k(t) {
        var n = e.createElement("a");
        return n.href = t, n.href = n.href, n;
      }
      function S(t) {
        if (this.src = t, I("DummyImageContainer for", t), !this.promise || !this.image) {
          I("Initiating DummyImageContainer"), S.prototype.image = new Image;
          var e = this.image;
          S.prototype.promise = new Promise(function(t, n) {
            e.onload = t, e.onerror = n, e.src = d(), e.complete === !0 && t(e);
          });
        }
      }
      function C(t, n) {
        var r,
            i,
            o = e.createElement("div"),
            a = e.createElement("img"),
            s = e.createElement("span"),
            c = "Hidden Text";
        o.style.visibility = "hidden", o.style.fontFamily = t, o.style.fontSize = n, o.style.margin = 0, o.style.padding = 0, e.body.appendChild(o), a.src = d(), a.width = 1, a.height = 1, a.style.margin = 0, a.style.padding = 0, a.style.verticalAlign = "baseline", s.style.fontFamily = t, s.style.fontSize = n, s.style.margin = 0, s.style.padding = 0, s.appendChild(e.createTextNode(c)), o.appendChild(s), o.appendChild(a), r = a.offsetTop - s.offsetTop + 1, o.removeChild(s), o.appendChild(e.createTextNode(c)), o.style.lineHeight = "normal", a.style.verticalAlign = "super", i = a.offsetTop - o.offsetTop + 1, e.body.removeChild(o), this.baseline = r, this.lineWidth = 1, this.middle = i;
      }
      function A() {
        this.data = {};
      }
      function q(t, e, n) {
        this.image = null, this.src = t;
        var r = this,
            i = z(t);
        this.promise = (e ? new Promise(function(e) {
          "about:blank" === t.contentWindow.document.URL || null == t.contentWindow.document.documentElement ? t.contentWindow.onload = t.onload = function() {
            e(t);
          } : e(t);
        }) : this.proxyLoad(n.proxy, i, n)).then(function(t) {
          return html2canvas(t.contentWindow.document.documentElement, {
            type: "view",
            width: t.width,
            height: t.height,
            proxy: n.proxy,
            javascriptEnabled: n.javascriptEnabled,
            removeContainer: n.removeContainer,
            allowTaint: n.allowTaint,
            imageTimeout: n.imageTimeout / 2
          });
        }).then(function(t) {
          return r.image = t;
        });
      }
      function _(t) {
        this.src = t.value, this.colorStops = [], this.type = null, this.x0 = .5, this.y0 = .5, this.x1 = .5, this.y1 = .5, this.promise = Promise.resolve(!0);
      }
      function P(t, e) {
        this.src = t, this.image = new Image;
        var n = this;
        this.tainted = null, this.promise = new Promise(function(r, i) {
          n.image.onload = r, n.image.onerror = i, e && (n.image.crossOrigin = "anonymous"), n.image.src = t, n.image.complete === !0 && r(n.image);
        });
      }
      function T(e, n) {
        this.link = null, this.options = e, this.support = n, this.origin = this.getOrigin(t.location.href);
      }
      function E(t) {
        _.apply(this, arguments), this.type = this.TYPES.LINEAR;
        var e = null === t.args[0].match(this.stepRegExp);
        e ? t.args[0].split(" ").reverse().forEach(function(t) {
          switch (t) {
            case "left":
              this.x0 = 0, this.x1 = 1;
              break;
            case "top":
              this.y0 = 0, this.y1 = 1;
              break;
            case "right":
              this.x0 = 1, this.x1 = 0;
              break;
            case "bottom":
              this.y0 = 1, this.y1 = 0;
              break;
            case "to":
              var e = this.y0,
                  n = this.x0;
              this.y0 = this.y1, this.x0 = this.x1, this.x1 = n, this.y1 = e;
          }
        }, this) : (this.y0 = 0, this.y1 = 1), this.colorStops = t.args.slice(e ? 1 : 0).map(function(t) {
          var e = t.match(this.stepRegExp);
          return {
            color: e[1],
            stop: "%" === e[3] ? e[2] / 100 : null
          };
        }, this), null === this.colorStops[0].stop && (this.colorStops[0].stop = 0), null === this.colorStops[this.colorStops.length - 1].stop && (this.colorStops[this.colorStops.length - 1].stop = 1), this.colorStops.forEach(function(t, e) {
          null === t.stop && this.colorStops.slice(e).some(function(n, r) {
            return null !== n.stop ? (t.stop = (n.stop - this.colorStops[e - 1].stop) / (r + 1) + this.colorStops[e - 1].stop, !0) : !1;
          }, this);
        }, this);
      }
      function I() {
        t.html2canvas.logging && t.console && t.console.log && Function.prototype.bind.call(t.console.log, t.console).apply(t.console, [Date.now() - t.html2canvas.start + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)));
      }
      function O(t, e) {
        this.node = t, this.parent = e, this.stack = null, this.bounds = null, this.borders = null, this.clip = [], this.backgroundClip = [], this.offsetBounds = null, this.visible = null, this.computedStyles = null, this.styles = {}, this.backgroundImages = null, this.transformData = null, this.transformMatrix = null, this.isPseudoElement = !1, this.opacity = null;
      }
      function F(t) {
        var e = t.options[t.selectedIndex || 0];
        return e ? e.text || "" : "";
      }
      function B(t) {
        return t && "matrix" === t[1] ? t[2].split(",").map(function(t) {
          return parseFloat(t.trim());
        }) : void 0;
      }
      function R(t) {
        return -1 !== t.toString().indexOf("%");
      }
      function j(t) {
        var e,
            n,
            r,
            i,
            o,
            a,
            s,
            c = " \r\n ",
            u = [],
            l = 0,
            h = 0,
            f = function() {
              e && ('"' === n.substr(0, 1) && (n = n.substr(1, n.length - 2)), n && s.push(n), "-" === e.substr(0, 1) && (i = e.indexOf("-", 1) + 1) > 0 && (r = e.substr(0, i), e = e.substr(i)), u.push({
                prefix: r,
                method: e.toLowerCase(),
                value: o,
                args: s,
                image: null
              })), s = [], e = r = n = o = "";
            };
        return s = [], e = r = n = o = "", t.split("").forEach(function(t) {
          if (!(0 === l && c.indexOf(t) > -1)) {
            switch (t) {
              case '"':
                a ? a === t && (a = null) : a = t;
                break;
              case "(":
                if (a)
                  break;
                if (0 === l)
                  return l = 1, void(o += t);
                h++;
                break;
              case ")":
                if (a)
                  break;
                if (1 === l) {
                  if (0 === h)
                    return l = 0, o += t, void f();
                  h--;
                }
                break;
              case ",":
                if (a)
                  break;
                if (0 === l)
                  return void f();
                if (1 === l && 0 === h && !e.match(/^url$/i))
                  return s.push(n), n = "", void(o += t);
            }
            o += t, 0 === l ? e += t : n += t;
          }
        }), f(), u;
      }
      function D(t) {
        return t.replace("px", "");
      }
      function N(t) {
        return parseFloat(t);
      }
      function z(t) {
        if (t.getBoundingClientRect) {
          var e = t.getBoundingClientRect(),
              n = null == t.offsetWidth ? e.width : t.offsetWidth;
          return {
            top: e.top,
            bottom: e.bottom || e.top + e.height,
            right: e.left + n,
            left: e.left,
            width: n,
            height: null == t.offsetHeight ? e.height : t.offsetHeight
          };
        }
        return {};
      }
      function L(t) {
        var e = t.offsetParent ? L(t.offsetParent) : {
          top: 0,
          left: 0
        };
        return {
          top: t.offsetTop + e.top,
          bottom: t.offsetTop + t.offsetHeight + e.top,
          right: t.offsetLeft + e.left + t.offsetWidth,
          left: t.offsetLeft + e.left,
          width: t.offsetWidth,
          height: t.offsetHeight
        };
      }
      function M(t, e, n, r, i) {
        I("Starting NodeParser"), this.renderer = e, this.options = i, this.range = null, this.support = n, this.renderQueue = [], this.stack = new Ft(!0, 1, t.ownerDocument, null);
        var o = new O(t, null);
        if (t === t.ownerDocument.documentElement) {
          var a = new O(this.renderer.isTransparent(o.css("backgroundColor")) ? t.ownerDocument.body : t.ownerDocument.documentElement, null);
          e.rectangle(0, 0, e.width, e.height, a.css("backgroundColor"));
        }
        o.visibile = o.isElementVisible(), this.createPseudoHideStyles(t.ownerDocument), this.disableAnimations(t.ownerDocument), this.nodes = bt([o].concat(this.getChildren(o)).filter(function(t) {
          return t.visible = t.isElementVisible();
        }).map(this.getPseudoElements, this)), this.fontMetrics = new A, I("Fetched nodes, total:", this.nodes.length), I("Calculate overflow clips"), this.calculateOverflowClips(), I("Start fetching images"), this.images = r.fetch(this.nodes.filter(ht)), this.ready = this.images.ready.then(gt(function() {
          return I("Images loaded, starting parsing"), I("Creating stacking contexts"), this.createStackingContexts(), I("Sorting stacking contexts"), this.sortStackingContexts(this.stack), this.parse(this.stack), I("Render queue created with " + this.renderQueue.length + " items"), new Promise(gt(function(t) {
            i.async ? "function" == typeof i.async ? i.async.call(this, this.renderQueue, t) : this.renderQueue.length > 0 ? (this.renderIndex = 0, this.asyncRenderer(this.renderQueue, t)) : t() : (this.renderQueue.forEach(this.paint, this), t());
          }, this));
        }, this));
      }
      function U(t) {
        return t.parent && t.parent.clip.length;
      }
      function H(t) {
        return t.replace(/(\-[a-z])/g, function(t) {
          return t.toUpperCase().replace("-", "");
        });
      }
      function W() {}
      function X(t, e, n, r) {
        return t.map(function(i, o) {
          if (i.width > 0) {
            var a = e.left,
                s = e.top,
                c = e.width,
                u = e.height - t[2].width;
            switch (o) {
              case 0:
                u = t[0].width, i.args = J({
                  c1: [a, s],
                  c2: [a + c, s],
                  c3: [a + c - t[1].width, s + u],
                  c4: [a + t[3].width, s + u]
                }, r[0], r[1], n.topLeftOuter, n.topLeftInner, n.topRightOuter, n.topRightInner);
                break;
              case 1:
                a = e.left + e.width - t[1].width, c = t[1].width, i.args = J({
                  c1: [a + c, s],
                  c2: [a + c, s + u + t[2].width],
                  c3: [a, s + u],
                  c4: [a, s + t[0].width]
                }, r[1], r[2], n.topRightOuter, n.topRightInner, n.bottomRightOuter, n.bottomRightInner);
                break;
              case 2:
                s = s + e.height - t[2].width, u = t[2].width, i.args = J({
                  c1: [a + c, s + u],
                  c2: [a, s + u],
                  c3: [a + t[3].width, s],
                  c4: [a + c - t[3].width, s]
                }, r[2], r[3], n.bottomRightOuter, n.bottomRightInner, n.bottomLeftOuter, n.bottomLeftInner);
                break;
              case 3:
                c = t[3].width, i.args = J({
                  c1: [a, s + u + t[2].width],
                  c2: [a, s],
                  c3: [a + c, s + t[0].width],
                  c4: [a + c, s + u]
                }, r[3], r[0], n.bottomLeftOuter, n.bottomLeftInner, n.topLeftOuter, n.topLeftInner);
            }
          }
          return i;
        });
      }
      function V(t, e, n, r) {
        var i = 4 * ((Math.sqrt(2) - 1) / 3),
            o = n * i,
            a = r * i,
            s = t + n,
            c = e + r;
        return {
          topLeft: G({
            x: t,
            y: c
          }, {
            x: t,
            y: c - a
          }, {
            x: s - o,
            y: e
          }, {
            x: s,
            y: e
          }),
          topRight: G({
            x: t,
            y: e
          }, {
            x: t + o,
            y: e
          }, {
            x: s,
            y: c - a
          }, {
            x: s,
            y: c
          }),
          bottomRight: G({
            x: s,
            y: e
          }, {
            x: s,
            y: e + a
          }, {
            x: t + o,
            y: c
          }, {
            x: t,
            y: c
          }),
          bottomLeft: G({
            x: s,
            y: c
          }, {
            x: s - o,
            y: c
          }, {
            x: t,
            y: e + a
          }, {
            x: t,
            y: e
          })
        };
      }
      function Y(t, e, n) {
        var r = t.left,
            i = t.top,
            o = t.width,
            a = t.height,
            s = e[0][0],
            c = e[0][1],
            u = e[1][0],
            l = e[1][1],
            h = e[2][0],
            f = e[2][1],
            d = e[3][0],
            p = e[3][1],
            m = o - u,
            g = a - f,
            w = o - h,
            y = a - p;
        return {
          topLeftOuter: V(r, i, s, c).topLeft.subdivide(.5),
          topLeftInner: V(r + n[3].width, i + n[0].width, Math.max(0, s - n[3].width), Math.max(0, c - n[0].width)).topLeft.subdivide(.5),
          topRightOuter: V(r + m, i, u, l).topRight.subdivide(.5),
          topRightInner: V(r + Math.min(m, o + n[3].width), i + n[0].width, m > o + n[3].width ? 0 : u - n[3].width, l - n[0].width).topRight.subdivide(.5),
          bottomRightOuter: V(r + w, i + g, h, f).bottomRight.subdivide(.5),
          bottomRightInner: V(r + Math.min(w, o - n[3].width), i + Math.min(g, a + n[0].width), Math.max(0, h - n[1].width), f - n[2].width).bottomRight.subdivide(.5),
          bottomLeftOuter: V(r, i + y, d, p).bottomLeft.subdivide(.5),
          bottomLeftInner: V(r + n[3].width, i + y, Math.max(0, d - n[3].width), p - n[2].width).bottomLeft.subdivide(.5)
        };
      }
      function G(t, e, n, r) {
        var i = function(t, e, n) {
          return {
            x: t.x + (e.x - t.x) * n,
            y: t.y + (e.y - t.y) * n
          };
        };
        return {
          start: t,
          startControl: e,
          endControl: n,
          end: r,
          subdivide: function(o) {
            var a = i(t, e, o),
                s = i(e, n, o),
                c = i(n, r, o),
                u = i(a, s, o),
                l = i(s, c, o),
                h = i(u, l, o);
            return [G(t, a, u, h), G(h, l, c, r)];
          },
          curveTo: function(t) {
            t.push(["bezierCurve", e.x, e.y, n.x, n.y, r.x, r.y]);
          },
          curveToReversed: function(r) {
            r.push(["bezierCurve", n.x, n.y, e.x, e.y, t.x, t.y]);
          }
        };
      }
      function J(t, e, n, r, i, o, a) {
        var s = [];
        return e[0] > 0 || e[1] > 0 ? (s.push(["line", r[1].start.x, r[1].start.y]), r[1].curveTo(s)) : s.push(["line", t.c1[0], t.c1[1]]), n[0] > 0 || n[1] > 0 ? (s.push(["line", o[0].start.x, o[0].start.y]), o[0].curveTo(s), s.push(["line", a[0].end.x, a[0].end.y]), a[0].curveToReversed(s)) : (s.push(["line", t.c2[0], t.c2[1]]), s.push(["line", t.c3[0], t.c3[1]])), e[0] > 0 || e[1] > 0 ? (s.push(["line", i[1].end.x, i[1].end.y]), i[1].curveToReversed(s)) : s.push(["line", t.c4[0], t.c4[1]]), s;
      }
      function Q(t, e, n, r, i, o, a) {
        e[0] > 0 || e[1] > 0 ? (t.push(["line", r[0].start.x, r[0].start.y]), r[0].curveTo(t), r[1].curveTo(t)) : t.push(["line", o, a]), (n[0] > 0 || n[1] > 0) && t.push(["line", i[0].start.x, i[0].start.y]);
      }
      function K(t) {
        return t.cssInt("zIndex") < 0;
      }
      function $(t) {
        return t.cssInt("zIndex") > 0;
      }
      function Z(t) {
        return 0 === t.cssInt("zIndex");
      }
      function tt(t) {
        return -1 !== ["inline", "inline-block", "inline-table"].indexOf(t.css("display"));
      }
      function et(t) {
        return t instanceof Ft;
      }
      function nt(t) {
        return t.node.data.trim().length > 0;
      }
      function rt(t) {
        return /^(normal|none|0px)$/.test(t.parent.css("letterSpacing"));
      }
      function it(t) {
        return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(e) {
          var n = t.css("border" + e + "Radius"),
              r = n.split(" ");
          return r.length <= 1 && (r[1] = r[0]), r.map(wt);
        });
      }
      function ot(t) {
        return t.nodeType === Node.TEXT_NODE || t.nodeType === Node.ELEMENT_NODE;
      }
      function at(t) {
        var e = t.css("position"),
            n = -1 !== ["absolute", "relative", "fixed"].indexOf(e) ? t.css("zIndex") : "auto";
        return "auto" !== n;
      }
      function st(t) {
        return "static" !== t.css("position");
      }
      function ct(t) {
        return "none" !== t.css("float");
      }
      function ut(t) {
        return -1 !== ["inline-block", "inline-table"].indexOf(t.css("display"));
      }
      function lt(t) {
        var e = this;
        return function() {
          return !t.apply(e, arguments);
        };
      }
      function ht(t) {
        return t.node.nodeType === Node.ELEMENT_NODE;
      }
      function ft(t) {
        return t.isPseudoElement === !0;
      }
      function dt(t) {
        return t.node.nodeType === Node.TEXT_NODE;
      }
      function pt(t) {
        return function(e, n) {
          return e.cssInt("zIndex") + t.indexOf(e) / t.length - (n.cssInt("zIndex") + t.indexOf(n) / t.length);
        };
      }
      function mt(t) {
        return t.getOpacity() < 1;
      }
      function gt(t, e) {
        return function() {
          return t.apply(e, arguments);
        };
      }
      function wt(t) {
        return parseInt(t, 10);
      }
      function yt(t) {
        return t.width;
      }
      function vt(t) {
        return t.node.nodeType !== Node.ELEMENT_NODE || -1 === ["SCRIPT", "HEAD", "TITLE", "OBJECT", "BR", "OPTION"].indexOf(t.node.nodeName);
      }
      function bt(t) {
        return [].concat.apply([], t);
      }
      function xt(t) {
        var e = t.substr(0, 1);
        return e === t.substr(t.length - 1) && e.match(/'|"/) ? t.substr(1, t.length - 2) : t;
      }
      function kt(e) {
        for (var n,
            r = [],
            i = 0,
            o = !1; e.length; )
          St(e[i]) === o ? (n = e.splice(0, i), n.length && r.push(t.html2canvas.punycode.ucs2.encode(n)), o = !o, i = 0) : i++, i >= e.length && (n = e.splice(0, i), n.length && r.push(t.html2canvas.punycode.ucs2.encode(n)));
        return r;
      }
      function St(t) {
        return -1 !== [32, 13, 10, 9, 45].indexOf(t);
      }
      function Ct(t) {
        return /[^\u0000-\u00ff]/.test(t);
      }
      function At(t, e, n) {
        var r = Pt(Gt),
            i = Tt(e, t, r);
        return Gt ? Mt(i) : _t(n, i, r).then(function(t) {
          return jt(t.content);
        });
      }
      function qt(t, e, n) {
        var r = Pt(Jt),
            i = Tt(e, t, r);
        return Jt ? Promise.resolve(i) : _t(n, i, r).then(function(t) {
          return "data:" + t.type + ";base64," + t.content;
        });
      }
      function _t(e, n, r) {
        return new Promise(function(i, o) {
          var a = e.createElement("script"),
              s = function() {
                delete t.html2canvas.proxy[r], e.body.removeChild(a);
              };
          t.html2canvas.proxy[r] = function(t) {
            s(), i(t);
          }, a.src = n, a.onerror = function(t) {
            s(), o(t);
          }, e.body.appendChild(a);
        });
      }
      function Pt(t) {
        return t ? "" : "html2canvas_" + Date.now() + "_" + ++Yt + "_" + Math.round(1e5 * Math.random());
      }
      function Tt(t, e, n) {
        return t + "?url=" + encodeURIComponent(e) + (n.length ? "&callback=html2canvas.proxy." + n : "");
      }
      function Et(t, n) {
        var r = (e.createElement("script"), e.createElement("a"));
        r.href = t, t = r.href, this.src = t, this.image = new Image;
        var i = this;
        this.promise = new Promise(function(r, o) {
          i.image.crossOrigin = "Anonymous", i.image.onload = r, i.image.onerror = o, new qt(t, n, e).then(function(t) {
            i.image.src = t;
          })["catch"](o);
        });
      }
      function It(t, e, n) {
        O.call(this, t, e), this.isPseudoElement = !0, this.before = ":before" === n;
      }
      function Ot(t, e, n, r, i) {
        this.width = t, this.height = e, this.images = n, this.options = r, this.document = i;
      }
      function Ft(t, e, n, r) {
        O.call(this, n, r), this.ownStacking = t, this.contexts = [], this.children = [], this.opacity = (this.parent ? this.parent.stack.opacity : 1) * e;
      }
      function Bt(t) {
        this.rangeBounds = this.testRangeBounds(t), this.cors = this.testCORS(), this.svg = this.testSVG();
      }
      function Rt(t) {
        this.src = t, this.image = null;
        var e = this;
        this.promise = this.hasFabric().then(function() {
          return e.isInline(t) ? Promise.resolve(e.inlineFormatting(t)) : Mt(t);
        }).then(function(t) {
          return new Promise(function(n) {
            html2canvas.fabric.loadSVGFromString(t, e.createCanvas.call(e, n));
          });
        });
      }
      function jt(t) {
        var e,
            n,
            r,
            i,
            o,
            a,
            s,
            c,
            u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            l = t.length,
            h = "";
        for (e = 0; l > e; e += 4)
          n = u.indexOf(t[e]), r = u.indexOf(t[e + 1]), i = u.indexOf(t[e + 2]), o = u.indexOf(t[e + 3]), a = n << 2 | r >> 4, s = (15 & r) << 4 | i >> 2, c = (3 & i) << 6 | o, h += 64 === i ? String.fromCharCode(a) : 64 === o || -1 === o ? String.fromCharCode(a, s) : String.fromCharCode(a, s, c);
        return h;
      }
      function Dt(t, e) {
        this.src = t, this.image = null;
        var n = this;
        this.promise = e ? new Promise(function(e, r) {
          n.image = new Image, n.image.onload = e, n.image.onerror = r, n.image.src = "data:image/svg+xml," + (new XMLSerializer).serializeToString(t), n.image.complete === !0 && e(n.image);
        }) : this.hasFabric().then(function() {
          return new Promise(function(e) {
            html2canvas.fabric.parseSVGDocument(t, n.createCanvas.call(n, e));
          });
        });
      }
      function Nt(t, e) {
        O.call(this, t, e);
      }
      function zt(t, e, n) {
        return t.length > 0 ? e + n.toUpperCase() : void 0;
      }
      function Lt(t) {
        _.apply(this, arguments), this.type = "linear" === t.args[0] ? this.TYPES.LINEAR : this.TYPES.RADIAL;
      }
      function Mt(t) {
        return new Promise(function(e, n) {
          var r = new XMLHttpRequest;
          r.open("GET", t), r.onload = function() {
            200 === r.status ? e(r.responseText) : n(new Error(r.statusText));
          }, r.onerror = function() {
            n(new Error("Network Error"));
          }, r.send();
        });
      }
      function Ut(t, e) {
        Ot.apply(this, arguments), this.canvas = this.options.canvas || this.document.createElement("canvas"), this.options.canvas || (this.canvas.width = t, this.canvas.height = e), this.ctx = this.canvas.getContext("2d"), this.options.background && this.rectangle(0, 0, t, e, this.options.background), this.taintCtx = this.document.createElement("canvas").getContext("2d"), this.ctx.textBaseline = "bottom", this.variables = {}, I("Initialized CanvasRenderer with size", t, "x", e);
      }
      function Ht(t) {
        return t.length > 0;
      }
      if (!function() {
        var n,
            r,
            o,
            a;
        !function() {
          var t = {},
              e = {};
          n = function(e, n, r) {
            t[e] = {
              deps: n,
              callback: r
            };
          }, a = o = r = function(n) {
            function i(t) {
              if ("." !== t.charAt(0))
                return t;
              for (var e = t.split("/"),
                  r = n.split("/").slice(0, -1),
                  i = 0,
                  o = e.length; o > i; i++) {
                var a = e[i];
                if (".." === a)
                  r.pop();
                else {
                  if ("." === a)
                    continue;
                  r.push(a);
                }
              }
              return r.join("/");
            }
            if (a._eak_seen = t, e[n])
              return e[n];
            if (e[n] = {}, !t[n])
              throw new Error("Could not find module " + n);
            for (var o,
                s = t[n],
                c = s.deps,
                u = s.callback,
                l = [],
                h = 0,
                f = c.length; f > h; h++)
              "exports" === c[h] ? l.push(o = {}) : l.push(r(i(c[h])));
            var d = u.apply(this, l);
            return e[n] = o || d;
          };
        }(), n("promise/all", ["./utils", "exports"], function(t, e) {
          function n(t) {
            var e = this;
            if (!r(t))
              throw new TypeError("You must pass an array to all.");
            return new e(function(e, n) {
              function r(t) {
                return function(e) {
                  o(t, e);
                };
              }
              function o(t, n) {
                s[t] = n, 0 === --c && e(s);
              }
              var a,
                  s = [],
                  c = t.length;
              0 === c && e([]);
              for (var u = 0; u < t.length; u++)
                a = t[u], a && i(a.then) ? a.then(r(u), n) : o(u, a);
            });
          }
          var r = t.isArray,
              i = t.isFunction;
          e.all = n;
        }), n("promise/asap", ["exports"], function(n) {
          function r() {
            return function() {
              process.nextTick(s);
            };
          }
          function o() {
            var t = 0,
                n = new h(s),
                r = e.createTextNode("");
            return n.observe(r, {characterData: !0}), function() {
              r.data = t = ++t % 2;
            };
          }
          function a() {
            return function() {
              f.setTimeout(s, 1);
            };
          }
          function s() {
            for (var t = 0; t < d.length; t++) {
              var e = d[t],
                  n = e[0],
                  r = e[1];
              n(r);
            }
            d = [];
          }
          function c(t, e) {
            var n = d.push([t, e]);
            1 === n && u();
          }
          var u,
              l = "undefined" != typeof t ? t : {},
              h = l.MutationObserver || l.WebKitMutationObserver,
              f = "undefined" != typeof i ? i : this,
              d = [];
          u = "undefined" != typeof process && "[object process]" === {}.toString.call(process) ? r() : h ? o() : a(), n.asap = c;
        }), n("promise/cast", ["exports"], function(t) {
          function e(t) {
            if (t && "object" == typeof t && t.constructor === this)
              return t;
            var e = this;
            return new e(function(e) {
              e(t);
            });
          }
          t.cast = e;
        }), n("promise/config", ["exports"], function(t) {
          function e(t, e) {
            return 2 !== arguments.length ? n[t] : void(n[t] = e);
          }
          var n = {instrument: !1};
          t.config = n, t.configure = e;
        }), n("promise/polyfill", ["./promise", "./utils", "exports"], function(e, n, r) {
          function i() {
            var e = "Promise" in t && "cast" in t.Promise && "resolve" in t.Promise && "reject" in t.Promise && "all" in t.Promise && "race" in t.Promise && function() {
              var e;
              return new t.Promise(function(t) {
                e = t;
              }), a(e);
            }();
            e || (t.Promise = o);
          }
          var o = e.Promise,
              a = n.isFunction;
          r.polyfill = i;
        }), n("promise/promise", ["./config", "./utils", "./cast", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function(t, e, n, r, i, o, a, s, c) {
          function u(t) {
            if (!k(t))
              throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
            if (!(this instanceof u))
              throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
            this._subscribers = [], l(t, this);
          }
          function l(t, e) {
            function n(t) {
              m(e, t);
            }
            function r(t) {
              w(e, t);
            }
            try {
              t(n, r);
            } catch (i) {
              r(i);
            }
          }
          function h(t, e, n, r) {
            var i,
                o,
                a,
                s,
                c = k(n);
            if (c)
              try {
                i = n(r), a = !0;
              } catch (u) {
                s = !0, o = u;
              }
            else
              i = r, a = !0;
            p(e, i) || (c && a ? m(e, i) : s ? w(e, o) : t === I ? m(e, i) : t === O && w(e, i));
          }
          function f(t, e, n, r) {
            var i = t._subscribers,
                o = i.length;
            i[o] = e, i[o + I] = n, i[o + O] = r;
          }
          function d(t, e) {
            for (var n,
                r,
                i = t._subscribers,
                o = t._detail,
                a = 0; a < i.length; a += 3)
              n = i[a], r = i[a + e], h(e, n, r, o);
            t._subscribers = null;
          }
          function p(t, e) {
            var n,
                r = null;
            try {
              if (t === e)
                throw new TypeError("A promises callback cannot return that same promise.");
              if (x(e) && (r = e.then, k(r)))
                return r.call(e, function(r) {
                  return n ? !0 : (n = !0, void(e !== r ? m(t, r) : g(t, r)));
                }, function(e) {
                  return n ? !0 : (n = !0, void w(t, e));
                }), !0;
            } catch (i) {
              return n ? !0 : (w(t, i), !0);
            }
            return !1;
          }
          function m(t, e) {
            t === e ? g(t, e) : p(t, e) || g(t, e);
          }
          function g(t, e) {
            t._state === T && (t._state = E, t._detail = e, b.async(y, t));
          }
          function w(t, e) {
            t._state === T && (t._state = E, t._detail = e, b.async(v, t));
          }
          function y(t) {
            d(t, t._state = I);
          }
          function v(t) {
            d(t, t._state = O);
          }
          var b = t.config,
              x = (t.configure, e.objectOrFunction),
              k = e.isFunction,
              S = (e.now, n.cast),
              C = r.all,
              A = i.race,
              q = o.resolve,
              _ = a.reject,
              P = s.asap;
          b.async = P;
          var T = void 0,
              E = 0,
              I = 1,
              O = 2;
          u.prototype = {
            constructor: u,
            _state: void 0,
            _detail: void 0,
            _subscribers: void 0,
            then: function(t, e) {
              var n = this,
                  r = new this.constructor(function() {});
              if (this._state) {
                var i = arguments;
                b.async(function() {
                  h(n._state, r, i[n._state - 1], n._detail);
                });
              } else
                f(this, r, t, e);
              return r;
            },
            "catch": function(t) {
              return this.then(null, t);
            }
          }, u.all = C, u.cast = S, u.race = A, u.resolve = q, u.reject = _, c.Promise = u;
        }), n("promise/race", ["./utils", "exports"], function(t, e) {
          function n(t) {
            var e = this;
            if (!r(t))
              throw new TypeError("You must pass an array to race.");
            return new e(function(e, n) {
              for (var r,
                  i = 0; i < t.length; i++)
                r = t[i], r && "function" == typeof r.then ? r.then(e, n) : e(r);
            });
          }
          var r = t.isArray;
          e.race = n;
        }), n("promise/reject", ["exports"], function(t) {
          function e(t) {
            var e = this;
            return new e(function(e, n) {
              n(t);
            });
          }
          t.reject = e;
        }), n("promise/resolve", ["exports"], function(t) {
          function e(t) {
            var e = this;
            return new e(function(e) {
              e(t);
            });
          }
          t.resolve = e;
        }), n("promise/utils", ["exports"], function(t) {
          function e(t) {
            return n(t) || "object" == typeof t && null !== t;
          }
          function n(t) {
            return "function" == typeof t;
          }
          function r(t) {
            return "[object Array]" === Object.prototype.toString.call(t);
          }
          var i = Date.now || function() {
            return (new Date).getTime();
          };
          t.objectOrFunction = e, t.isFunction = n, t.isArray = r, t.now = i;
        }), r("promise/polyfill").polyfill();
      }(), "function" != typeof Object.create || "function" != typeof e.createElement("canvas").getContext)
        return void(t.html2canvas = function() {
          return Promise.reject("No canvas support");
        });
      !function(t) {
        function e(t) {
          throw RangeError(B[t]);
        }
        function a(t, e) {
          for (var n = t.length,
              r = []; n--; )
            r[n] = e(t[n]);
          return r;
        }
        function s(t, e) {
          var n = t.split("@"),
              r = "";
          n.length > 1 && (r = n[0] + "@", t = n[1]);
          var i = t.split(F),
              o = a(i, e).join(".");
          return r + o;
        }
        function c(t) {
          for (var e,
              n,
              r = [],
              i = 0,
              o = t.length; o > i; )
            e = t.charCodeAt(i++), e >= 55296 && 56319 >= e && o > i ? (n = t.charCodeAt(i++), 56320 == (64512 & n) ? r.push(((1023 & e) << 10) + (1023 & n) + 65536) : (r.push(e), i--)) : r.push(e);
          return r;
        }
        function u(t) {
          return a(t, function(t) {
            var e = "";
            return t > 65535 && (t -= 65536, e += D(t >>> 10 & 1023 | 55296), t = 56320 | 1023 & t), e += D(t);
          }).join("");
        }
        function l(t) {
          return 10 > t - 48 ? t - 22 : 26 > t - 65 ? t - 65 : 26 > t - 97 ? t - 97 : S;
        }
        function h(t, e) {
          return t + 22 + 75 * (26 > t) - ((0 != e) << 5);
        }
        function f(t, e, n) {
          var r = 0;
          for (t = n ? j(t / _) : t >> 1, t += j(t / e); t > R * A >> 1; r += S)
            t = j(t / R);
          return j(r + (R + 1) * t / (t + q));
        }
        function d(t) {
          var n,
              r,
              i,
              o,
              a,
              s,
              c,
              h,
              d,
              p,
              m = [],
              g = t.length,
              w = 0,
              y = T,
              v = P;
          for (r = t.lastIndexOf(E), 0 > r && (r = 0), i = 0; r > i; ++i)
            t.charCodeAt(i) >= 128 && e("not-basic"), m.push(t.charCodeAt(i));
          for (o = r > 0 ? r + 1 : 0; g > o; ) {
            for (a = w, s = 1, c = S; o >= g && e("invalid-input"), h = l(t.charCodeAt(o++)), (h >= S || h > j((k - w) / s)) && e("overflow"), w += h * s, d = v >= c ? C : c >= v + A ? A : c - v, !(d > h); c += S)
              p = S - d, s > j(k / p) && e("overflow"), s *= p;
            n = m.length + 1, v = f(w - a, n, 0 == a), j(w / n) > k - y && e("overflow"), y += j(w / n), w %= n, m.splice(w++, 0, y);
          }
          return u(m);
        }
        function p(t) {
          var n,
              r,
              i,
              o,
              a,
              s,
              u,
              l,
              d,
              p,
              m,
              g,
              w,
              y,
              v,
              b = [];
          for (t = c(t), g = t.length, n = T, r = 0, a = P, s = 0; g > s; ++s)
            m = t[s], 128 > m && b.push(D(m));
          for (i = o = b.length, o && b.push(E); g > i; ) {
            for (u = k, s = 0; g > s; ++s)
              m = t[s], m >= n && u > m && (u = m);
            for (w = i + 1, u - n > j((k - r) / w) && e("overflow"), r += (u - n) * w, n = u, s = 0; g > s; ++s)
              if (m = t[s], n > m && ++r > k && e("overflow"), m == n) {
                for (l = r, d = S; p = a >= d ? C : d >= a + A ? A : d - a, !(p > l); d += S)
                  v = l - p, y = S - p, b.push(D(h(p + v % y, 0))), l = j(v / y);
                b.push(D(h(l, 0))), a = f(r, w, i == o), r = 0, ++i;
              }
            ++r, ++n;
          }
          return b.join("");
        }
        function m(t) {
          return s(t, function(t) {
            return I.test(t) ? d(t.slice(4).toLowerCase()) : t;
          });
        }
        function g(t) {
          return s(t, function(t) {
            return O.test(t) ? "xn--" + p(t) : t;
          });
        }
        var w = "object" == typeof r && r && !r.nodeType && r,
            y = "object" == typeof n && n && !n.nodeType && n,
            v = "object" == typeof i && i;
        v.global !== v && v.window !== v && v.self !== v || (t = v);
        var b,
            x,
            k = 2147483647,
            S = 36,
            C = 1,
            A = 26,
            q = 38,
            _ = 700,
            P = 72,
            T = 128,
            E = "-",
            I = /^xn--/,
            O = /[^\x20-\x7E]/,
            F = /[\x2E\u3002\uFF0E\uFF61]/g,
            B = {
              overflow: "Overflow: input needs wider integers to process",
              "not-basic": "Illegal input >= 0x80 (not a basic code point)",
              "invalid-input": "Invalid input"
            },
            R = S - C,
            j = Math.floor,
            D = String.fromCharCode;
        if (b = {
          version: "1.3.1",
          ucs2: {
            decode: c,
            encode: u
          },
          decode: d,
          encode: p,
          toASCII: g,
          toUnicode: m
        }, "function" == typeof o && "object" == typeof o.amd && o.amd)
          o("punycode", function() {
            return b;
          });
        else if (w && y)
          if (n.exports == w)
            y.exports = b;
          else
            for (x in b)
              b.hasOwnProperty(x) && (w[x] = b[x]);
        else
          t.punycode = b;
      }(this);
      var Wt = "data-html2canvas-node",
          Xt = "data-html2canvas-canvas-clone",
          Vt = 0;
      t.html2canvas = function(n, r) {
        if (r = r || {}, r.logging && (t.html2canvas.logging = !0, t.html2canvas.start = Date.now()), r.async = "undefined" == typeof r.async ? !0 : r.async, r.allowTaint = "undefined" == typeof r.allowTaint ? !1 : r.allowTaint, r.removeContainer = "undefined" == typeof r.removeContainer ? !0 : r.removeContainer, r.javascriptEnabled = "undefined" == typeof r.javascriptEnabled ? !1 : r.javascriptEnabled, r.imageTimeout = "undefined" == typeof r.imageTimeout ? 1e4 : r.imageTimeout, "string" == typeof n)
          return "string" != typeof r.proxy ? Promise.reject("Proxy must be used when rendering url") : g(k(n), r.proxy, e, t.innerWidth, t.innerHeight, r).then(function(e) {
            return c(e.contentWindow.document.documentElement, e, r, t.innerWidth, t.innerHeight);
          });
        var i = (n === a ? [e.documentElement] : n.length ? n : [n])[0];
        return i.setAttribute(Wt, "true"), s(i.ownerDocument, r, i.ownerDocument.defaultView.innerWidth, i.ownerDocument.defaultView.innerHeight).then(function(t) {
          return "function" == typeof r.onrendered && (I("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas"), r.onrendered(t)), t;
        });
      }, t.html2canvas.punycode = this.punycode, t.html2canvas.proxy = {}, A.prototype.getMetrics = function(t, e) {
        return this.data[t + "-" + e] === a && (this.data[t + "-" + e] = new C(t, e)), this.data[t + "-" + e];
      }, q.prototype.proxyLoad = function(t, e, n) {
        var r = this.src;
        return g(r.src, t, r.ownerDocument, e.width, e.height, n);
      }, _.prototype.TYPES = {
        LINEAR: 1,
        RADIAL: 2
      }, T.prototype.findImages = function(t) {
        var e = [];
        return t.reduce(function(t, e) {
          switch (e.node.nodeName) {
            case "IMG":
              return t.concat([{
                args: [e.node.src],
                method: "url"
              }]);
            case "svg":
            case "IFRAME":
              return t.concat([{
                args: [e.node],
                method: e.node.nodeName
              }]);
          }
          return t;
        }, []).forEach(this.addImage(e, this.loadImage), this), e;
      }, T.prototype.findBackgroundImage = function(t, e) {
        return e.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(t, this.loadImage), this), t;
      }, T.prototype.addImage = function(t, e) {
        return function(n) {
          n.args.forEach(function(r) {
            this.imageExists(t, r) || (t.splice(0, 0, e.call(this, n)), I("Added image #" + t.length, "string" == typeof r ? r.substring(0, 100) : r));
          }, this);
        };
      }, T.prototype.hasImageBackground = function(t) {
        return "none" !== t.method;
      }, T.prototype.loadImage = function(t) {
        if ("url" === t.method) {
          var e = t.args[0];
          return !this.isSVG(e) || this.support.svg || this.options.allowTaint ? e.match(/data:image\/.*;base64,/i) ? new P(e.replace(/url\(['"]{0,}|['"]{0,}\)$/gi, ""), !1) : this.isSameOrigin(e) || this.options.allowTaint === !0 || this.isSVG(e) ? new P(e, !1) : this.support.cors && !this.options.allowTaint && this.options.useCORS ? new P(e, !0) : this.options.proxy ? new Et(e, this.options.proxy) : new S(e) : new Rt(e);
        }
        return "linear-gradient" === t.method ? new E(t) : "gradient" === t.method ? new Lt(t) : "svg" === t.method ? new Dt(t.args[0], this.support.svg) : "IFRAME" === t.method ? new q(t.args[0], this.isSameOrigin(t.args[0].src), this.options) : new S(t);
      }, T.prototype.isSVG = function(t) {
        return "svg" === t.substring(t.length - 3).toLowerCase() || Rt.prototype.isInline(t);
      }, T.prototype.imageExists = function(t, e) {
        return t.some(function(t) {
          return t.src === e;
        });
      }, T.prototype.isSameOrigin = function(t) {
        return this.getOrigin(t) === this.origin;
      }, T.prototype.getOrigin = function(t) {
        var n = this.link || (this.link = e.createElement("a"));
        return n.href = t, n.href = n.href, n.protocol + n.hostname + n.port;
      }, T.prototype.getPromise = function(t) {
        return this.timeout(t, this.options.imageTimeout)["catch"](function() {
          var e = new S(t.src);
          return e.promise.then(function(e) {
            t.image = e;
          });
        });
      }, T.prototype.get = function(t) {
        var e = null;
        return this.images.some(function(n) {
          return (e = n).src === t;
        }) ? e : null;
      }, T.prototype.fetch = function(t) {
        return this.images = t.reduce(gt(this.findBackgroundImage, this), this.findImages(t)), this.images.forEach(function(t, e) {
          t.promise.then(function() {
            I("Succesfully loaded image #" + (e + 1), t);
          }, function(n) {
            I("Failed loading image #" + (e + 1), t, n);
          });
        }), this.ready = Promise.all(this.images.map(this.getPromise, this)), I("Finished searching images"), this;
      }, T.prototype.timeout = function(t, e) {
        var n;
        return Promise.race([t.promise, new Promise(function(r, i) {
          n = setTimeout(function() {
            I("Timed out loading image", t), i(t);
          }, e);
        })]).then(function(t) {
          return clearTimeout(n), t;
        });
      }, E.prototype = Object.create(_.prototype), E.prototype.stepRegExp = /((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/, O.prototype.cloneTo = function(t) {
        t.visible = this.visible, t.borders = this.borders, t.bounds = this.bounds, t.clip = this.clip, t.backgroundClip = this.backgroundClip, t.computedStyles = this.computedStyles, t.styles = this.styles, t.backgroundImages = this.backgroundImages, t.opacity = this.opacity;
      }, O.prototype.getOpacity = function() {
        return null === this.opacity ? this.opacity = this.cssFloat("opacity") : this.opacity;
      }, O.prototype.assignStack = function(t) {
        this.stack = t, t.children.push(this);
      }, O.prototype.isElementVisible = function() {
        return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible : "none" !== this.css("display") && "hidden" !== this.css("visibility") && !this.node.hasAttribute("data-html2canvas-ignore") && ("INPUT" !== this.node.nodeName || "hidden" !== this.node.getAttribute("type"));
      }, O.prototype.css = function(t) {
        return this.computedStyles || (this.computedStyles = this.isPseudoElement ? this.parent.computedStyle(this.before ? ":before" : ":after") : this.computedStyle(null)), this.styles[t] || (this.styles[t] = this.computedStyles[t]);
      }, O.prototype.prefixedCss = function(t) {
        var e = ["webkit", "moz", "ms", "o"],
            n = this.css(t);
        return n === a && e.some(function(e) {
          return n = this.css(e + t.substr(0, 1).toUpperCase() + t.substr(1)), n !== a;
        }, this), n === a ? null : n;
      }, O.prototype.computedStyle = function(t) {
        return this.node.ownerDocument.defaultView.getComputedStyle(this.node, t);
      }, O.prototype.cssInt = function(t) {
        var e = parseInt(this.css(t), 10);
        return isNaN(e) ? 0 : e;
      }, O.prototype.cssFloat = function(t) {
        var e = parseFloat(this.css(t));
        return isNaN(e) ? 0 : e;
      }, O.prototype.fontWeight = function() {
        var t = this.css("fontWeight");
        switch (parseInt(t, 10)) {
          case 401:
            t = "bold";
            break;
          case 400:
            t = "normal";
        }
        return t;
      }, O.prototype.parseClip = function() {
        var t = this.css("clip").match(this.CLIP);
        return t ? {
          top: parseInt(t[1], 10),
          right: parseInt(t[2], 10),
          bottom: parseInt(t[3], 10),
          left: parseInt(t[4], 10)
        } : null;
      }, O.prototype.parseBackgroundImages = function() {
        return this.backgroundImages || (this.backgroundImages = j(this.css("backgroundImage")));
      }, O.prototype.cssList = function(t, e) {
        var n = (this.css(t) || "").split(",");
        return n = n[e || 0] || n[0] || "auto", n = n.trim().split(" "), 1 === n.length && (n = [n[0], n[0]]), n;
      }, O.prototype.parseBackgroundSize = function(t, e, n) {
        var r,
            i,
            o = this.cssList("backgroundSize", n);
        if (R(o[0]))
          r = t.width * parseFloat(o[0]) / 100;
        else {
          if (/contain|cover/.test(o[0])) {
            var a = t.width / t.height,
                s = e.width / e.height;
            return s > a ^ "contain" === o[0] ? {
              width: t.height * s,
              height: t.height
            } : {
              width: t.width,
              height: t.width / s
            };
          }
          r = parseInt(o[0], 10);
        }
        return i = "auto" === o[0] && "auto" === o[1] ? e.height : "auto" === o[1] ? r / e.width * e.height : R(o[1]) ? t.height * parseFloat(o[1]) / 100 : parseInt(o[1], 10), "auto" === o[0] && (r = i / e.height * e.width), {
          width: r,
          height: i
        };
      }, O.prototype.parseBackgroundPosition = function(t, e, n, r) {
        var i,
            o,
            a = this.cssList("backgroundPosition", n);
        return i = R(a[0]) ? (t.width - (r || e).width) * (parseFloat(a[0]) / 100) : parseInt(a[0], 10), o = "auto" === a[1] ? i / e.width * e.height : R(a[1]) ? (t.height - (r || e).height) * parseFloat(a[1]) / 100 : parseInt(a[1], 10), "auto" === a[0] && (i = o / e.height * e.width), {
          left: i,
          top: o
        };
      }, O.prototype.parseBackgroundRepeat = function(t) {
        return this.cssList("backgroundRepeat", t)[0];
      }, O.prototype.parseTextShadows = function() {
        var t = this.css("textShadow"),
            e = [];
        if (t && "none" !== t)
          for (var n = t.match(this.TEXT_SHADOW_PROPERTY),
              r = 0; n && r < n.length; r++) {
            var i = n[r].match(this.TEXT_SHADOW_VALUES);
            e.push({
              color: i[0],
              offsetX: i[1] ? parseFloat(i[1].replace("px", "")) : 0,
              offsetY: i[2] ? parseFloat(i[2].replace("px", "")) : 0,
              blur: i[3] ? i[3].replace("px", "") : 0
            });
          }
        return e;
      }, O.prototype.parseTransform = function() {
        if (!this.transformData)
          if (this.hasTransform()) {
            var t = this.parseBounds(),
                e = this.prefixedCss("transformOrigin").split(" ").map(D).map(N);
            e[0] += t.left, e[1] += t.top, this.transformData = {
              origin: e,
              matrix: this.parseTransformMatrix()
            };
          } else
            this.transformData = {
              origin: [0, 0],
              matrix: [1, 0, 0, 1, 0, 0]
            };
        return this.transformData;
      }, O.prototype.parseTransformMatrix = function() {
        if (!this.transformMatrix) {
          var t = this.prefixedCss("transform"),
              e = t ? B(t.match(this.MATRIX_PROPERTY)) : null;
          this.transformMatrix = e ? e : [1, 0, 0, 1, 0, 0];
        }
        return this.transformMatrix;
      }, O.prototype.parseBounds = function() {
        return this.bounds || (this.bounds = this.hasTransform() ? L(this.node) : z(this.node));
      }, O.prototype.hasTransform = function() {
        return "1,0,0,1,0,0" !== this.parseTransformMatrix().join(",") || this.parent && this.parent.hasTransform();
      }, O.prototype.getValue = function() {
        var t = this.node.value || "";
        return t = "SELECT" === this.node.tagName ? F(this.node) : t, 0 === t.length ? this.node.placeholder || "" : t;
      }, O.prototype.MATRIX_PROPERTY = /(matrix)\((.+)\)/, O.prototype.TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g, O.prototype.TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g, O.prototype.CLIP = /^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/, M.prototype.calculateOverflowClips = function() {
        this.nodes.forEach(function(t) {
          if (ht(t)) {
            ft(t) && t.appendToDOM(), t.borders = this.parseBorders(t);
            var e = "hidden" === t.css("overflow") ? [t.borders.clip] : [],
                n = t.parseClip();
            n && -1 !== ["absolute", "fixed"].indexOf(t.css("position")) && e.push([["rect", t.bounds.left + n.left, t.bounds.top + n.top, n.right - n.left, n.bottom - n.top]]), t.clip = U(t) ? t.parent.clip.concat(e) : e, t.backgroundClip = "hidden" !== t.css("overflow") ? t.clip.concat([t.borders.clip]) : t.clip, ft(t) && t.cleanDOM();
          } else
            dt(t) && (t.clip = U(t) ? t.parent.clip : []);
          ft(t) || (t.bounds = null);
        }, this);
      }, M.prototype.asyncRenderer = function(t, e, n) {
        n = n || Date.now(), this.paint(t[this.renderIndex++]), t.length === this.renderIndex ? e() : n + 20 > Date.now() ? this.asyncRenderer(t, e, n) : setTimeout(gt(function() {
          this.asyncRenderer(t, e);
        }, this), 0);
      }, M.prototype.createPseudoHideStyles = function(t) {
        this.createStyles(t, "." + It.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ':before { content: "" !important; display: none !important; }.' + It.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER + ':after { content: "" !important; display: none !important; }');
      }, M.prototype.disableAnimations = function(t) {
        this.createStyles(t, "* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}");
      }, M.prototype.createStyles = function(t, e) {
        var n = t.createElement("style");
        n.innerHTML = e, t.body.appendChild(n);
      }, M.prototype.getPseudoElements = function(t) {
        var e = [[t]];
        if (t.node.nodeType === Node.ELEMENT_NODE) {
          var n = this.getPseudoElement(t, ":before"),
              r = this.getPseudoElement(t, ":after");
          n && e.push(n), r && e.push(r);
        }
        return bt(e);
      }, M.prototype.getPseudoElement = function(t, n) {
        var r = t.computedStyle(n);
        if (!r || !r.content || "none" === r.content || "-moz-alt-content" === r.content || "none" === r.display)
          return null;
        for (var i = xt(r.content),
            o = "url" === i.substr(0, 3),
            a = e.createElement(o ? "img" : "html2canvaspseudoelement"),
            s = new It(a, t, n),
            c = r.length - 1; c >= 0; c--) {
          var u = H(r.item(c));
          a.style[u] = r[u];
        }
        if (a.className = It.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + It.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER, o)
          return a.src = j(i)[0].args[0], [s];
        var l = e.createTextNode(i);
        return a.appendChild(l), [s, new Nt(l, s)];
      }, M.prototype.getChildren = function(t) {
        return bt([].filter.call(t.node.childNodes, ot).map(function(e) {
          var n = [e.nodeType === Node.TEXT_NODE ? new Nt(e, t) : new O(e, t)].filter(vt);
          return e.nodeType === Node.ELEMENT_NODE && n.length && "TEXTAREA" !== e.tagName ? n[0].isElementVisible() ? n.concat(this.getChildren(n[0])) : [] : n;
        }, this));
      }, M.prototype.newStackingContext = function(t, e) {
        var n = new Ft(e, t.getOpacity(), t.node, t.parent);
        t.cloneTo(n);
        var r = e ? n.getParentStack(this) : n.parent.stack;
        r.contexts.push(n), t.stack = n;
      }, M.prototype.createStackingContexts = function() {
        this.nodes.forEach(function(t) {
          ht(t) && (this.isRootElement(t) || mt(t) || at(t) || this.isBodyWithTransparentRoot(t) || t.hasTransform()) ? this.newStackingContext(t, !0) : ht(t) && (st(t) && Z(t) || ut(t) || ct(t)) ? this.newStackingContext(t, !1) : t.assignStack(t.parent.stack);
        }, this);
      }, M.prototype.isBodyWithTransparentRoot = function(t) {
        return "BODY" === t.node.nodeName && this.renderer.isTransparent(t.parent.css("backgroundColor"));
      }, M.prototype.isRootElement = function(t) {
        return null === t.parent;
      }, M.prototype.sortStackingContexts = function(t) {
        t.contexts.sort(pt(t.contexts.slice(0))), t.contexts.forEach(this.sortStackingContexts, this);
      }, M.prototype.parseTextBounds = function(t) {
        return function(e, n, r) {
          if ("none" !== t.parent.css("textDecoration").substr(0, 4) || 0 !== e.trim().length) {
            if (this.support.rangeBounds && !t.parent.hasTransform()) {
              var i = r.slice(0, n).join("").length;
              return this.getRangeBounds(t.node, i, e.length);
            }
            if (t.node && "string" == typeof t.node.data) {
              var o = t.node.splitText(e.length),
                  a = this.getWrapperBounds(t.node, t.parent.hasTransform());
              return t.node = o, a;
            }
          } else
            this.support.rangeBounds && !t.parent.hasTransform() || (t.node = t.node.splitText(e.length));
          return {};
        };
      }, M.prototype.getWrapperBounds = function(t, e) {
        var n = t.ownerDocument.createElement("html2canvaswrapper"),
            r = t.parentNode,
            i = t.cloneNode(!0);
        n.appendChild(t.cloneNode(!0)), r.replaceChild(n, t);
        var o = e ? L(n) : z(n);
        return r.replaceChild(i, n), o;
      }, M.prototype.getRangeBounds = function(t, e, n) {
        var r = this.range || (this.range = t.ownerDocument.createRange());
        return r.setStart(t, e), r.setEnd(t, e + n), r.getBoundingClientRect();
      }, M.prototype.parse = function(t) {
        var e = t.contexts.filter(K),
            n = t.children.filter(ht),
            r = n.filter(lt(ct)),
            i = r.filter(lt(st)).filter(lt(tt)),
            o = n.filter(lt(st)).filter(ct),
            a = r.filter(lt(st)).filter(tt),
            s = t.contexts.concat(r.filter(st)).filter(Z),
            c = t.children.filter(dt).filter(nt),
            u = t.contexts.filter($);
        e.concat(i).concat(o).concat(a).concat(s).concat(c).concat(u).forEach(function(t) {
          this.renderQueue.push(t), et(t) && (this.parse(t), this.renderQueue.push(new W));
        }, this);
      }, M.prototype.paint = function(t) {
        try {
          t instanceof W ? this.renderer.ctx.restore() : dt(t) ? (ft(t.parent) && t.parent.appendToDOM(), this.paintText(t), ft(t.parent) && t.parent.cleanDOM()) : this.paintNode(t);
        } catch (e) {
          I(e);
        }
      }, M.prototype.paintNode = function(t) {
        if (et(t) && (this.renderer.setOpacity(t.opacity), this.renderer.ctx.save(), t.hasTransform() && this.renderer.setTransform(t.parseTransform())), "INPUT" === t.node.nodeName && "checkbox" === t.node.type)
          this.paintCheckbox(t);
        else if ("INPUT" === t.node.nodeName && "radio" === t.node.type)
          this.paintRadio(t);
        else {
          if ("always" === t.css("page-break-before")) {
            var e = this.options.canvas.getContext("2d");
            "function" == typeof e._pageBreakAt && e._pageBreakAt(t.node.offsetTop);
          }
          this.paintElement(t);
        }
        if (t.node.getAttribute) {
          var n = t.node.getAttribute("name");
          if (null === n)
            var n = t.node.getAttribute("id");
          if (null !== n) {
            var r = this.options.canvas.annotations;
            r && r.setName(n, t.bounds);
          }
        }
      }, M.prototype.paintElement = function(t) {
        var e = t.parseBounds();
        this.renderer.clip(t.backgroundClip, function() {
          this.renderer.renderBackground(t, e, t.borders.borders.map(yt));
        }, this), this.renderer.clip(t.clip, function() {
          this.renderer.renderBorders(t.borders.borders);
        }, this), this.renderer.clip(t.backgroundClip, function() {
          switch (t.node.nodeName) {
            case "svg":
            case "IFRAME":
              var n = this.images.get(t.node);
              n ? this.renderer.renderImage(t, e, t.borders, n) : I("Error loading <" + t.node.nodeName + ">", t.node);
              break;
            case "IMG":
              var r = this.images.get(t.node.src);
              r ? this.renderer.renderImage(t, e, t.borders, r) : I("Error loading <img>", t.node.src);
              break;
            case "CANVAS":
              this.renderer.renderImage(t, e, t.borders, {image: t.node});
              break;
            case "SELECT":
            case "INPUT":
            case "TEXTAREA":
              this.paintFormValue(t);
          }
        }, this);
      }, M.prototype.paintCheckbox = function(t) {
        var e = t.parseBounds(),
            n = Math.min(e.width, e.height),
            r = {
              width: n - 1,
              height: n - 1,
              top: e.top,
              left: e.left
            },
            i = [3, 3],
            o = [i, i, i, i],
            a = [1, 1, 1, 1].map(function(t) {
              return {
                color: "#A5A5A5",
                width: t
              };
            }),
            s = Y(r, o, a);
        this.renderer.clip(t.backgroundClip, function() {
          this.renderer.rectangle(r.left + 1, r.top + 1, r.width - 2, r.height - 2, "#DEDEDE"), this.renderer.renderBorders(X(a, r, s, o)), t.node.checked && (this.renderer.font("#424242", "normal", "normal", "bold", n - 3 + "px", "arial"), this.renderer.text("✔", r.left + n / 6, r.top + n - 1));
        }, this);
      }, M.prototype.paintRadio = function(t) {
        var e = t.parseBounds(),
            n = Math.min(e.width, e.height) - 2;
        this.renderer.clip(t.backgroundClip, function() {
          this.renderer.circleStroke(e.left + 1, e.top + 1, n, "#DEDEDE", 1, "#A5A5A5"), t.node.checked && this.renderer.circle(Math.ceil(e.left + n / 4) + 1, Math.ceil(e.top + n / 4) + 1, Math.floor(n / 2), "#424242");
        }, this);
      }, M.prototype.paintFormValue = function(t) {
        if (t.getValue().length > 0) {
          var e = t.node.ownerDocument,
              n = e.createElement("html2canvaswrapper"),
              r = ["lineHeight", "textAlign", "fontFamily", "fontWeight", "fontSize", "color", "paddingLeft", "paddingTop", "paddingRight", "paddingBottom", "width", "height", "borderLeftStyle", "borderTopStyle", "borderLeftWidth", "borderTopWidth", "boxSizing", "whiteSpace", "wordWrap"];
          r.forEach(function(e) {
            try {
              n.style[e] = t.css(e);
            } catch (r) {
              I("html2canvas: Parse: Exception caught in renderFormValue: " + r.message);
            }
          });
          var i = t.parseBounds();
          n.style.position = "fixed", n.style.left = i.left + "px", n.style.top = i.top + "px", n.textContent = t.getValue(), e.body.appendChild(n), this.paintText(new Nt(n.firstChild, t)), e.body.removeChild(n);
        }
      }, M.prototype.paintText = function(e) {
        e.applyTextTransform();
        var n = t.html2canvas.punycode.ucs2.decode(e.node.data),
            r = this.options.letterRendering && !rt(e) || Ct(e.node.data) ? n.map(function(e) {
              return t.html2canvas.punycode.ucs2.encode([e]);
            }) : kt(n),
            i = e.parent.fontWeight(),
            o = e.parent.css("fontSize"),
            s = e.parent.css("fontFamily"),
            c = e.parent.parseTextShadows();
        this.renderer.font(e.parent.css("color"), e.parent.css("fontStyle"), e.parent.css("fontVariant"), i, o, s), c.length ? this.renderer.fontShadow(c[0].color, c[0].offsetX, c[0].offsetY, c[0].blur) : this.renderer.clearShadow(), this.renderer.clip(e.parent.clip, function() {
          r.map(this.parseTextBounds(e), this).forEach(function(t, n) {
            t && (t.left === a && (t.left = 0), t.bottom === a && (t.bottom = 0), this.renderer.text(r[n], t.left, t.bottom), this.renderTextDecoration(e.parent, t, this.fontMetrics.getMetrics(s, o)), 0 == n && "LI" === e.parent.node.nodeName && this.renderBullet(e, t), 0 == n && this.renderAnnotation(e.parent, t));
          }, this);
        }, this);
      }, M.prototype.generateListNumber = {
        listAlpha: function(t) {
          var e,
              n = "";
          do
            e = t % 26, n = String.fromCharCode(e + 64) + n, t /= 26;
 while (26 * t > 26);
          return n;
        },
        listRoman: function(t) {
          var e,
              n = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
              r = [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
              i = "",
              o = n.length;
          if (0 >= t || t >= 4e3)
            return t;
          for (e = 0; o > e; e += 1)
            for (; t >= r[e]; )
              t -= r[e], i += n[e];
          return i;
        }
      }, M.prototype.listItemText = function(t, e) {
        switch (t) {
          case "decimal-leading-zero":
            text = 1 === e.toString().length ? e = "0" + e.toString() : e.toString();
            break;
          case "upper-roman":
            text = this.generateListNumber.listRoman(e);
            break;
          case "lower-roman":
            text = this.generateListNumber.listRoman(e).toLowerCase();
            break;
          case "lower-alpha":
            text = this.generateListNumber.listAlpha(e).toLowerCase();
            break;
          case "upper-alpha":
            text = this.generateListNumber.listAlpha(e);
            break;
          case "decimal":
          default:
            text = e;
        }
        return text;
      }, M.prototype.renderBullet = function(t, e) {
        var n = t.parent.css("listStyleType");
        if ("none" !== n) {
          var r = e.top + (e.bottom - e.top) / 2,
              i = this.renderer.canvas.getContext("2d"),
              o = i.measureText("M").width,
              a = o / 4,
              s = .75 * o,
              c = e.left - s;
          switch (n) {
            case "decimal":
            case "decimal-leading-zero":
            case "upper-alpha":
            case "lower-alpha":
            case "upper-roman":
            case "lower-roman":
              var u = t.parent,
                  l = u.parent,
                  h = Array.prototype.slice.call(l.node.children),
                  f = h.indexOf(u.node) + 1,
                  d = this.listItemText(n, f);
              d += ".";
              var p = e.left - s;
              p -= i.measureText(d).width, i.fillText(d, p, e.bottom);
              break;
            case "square":
              var a = o / 3;
              c -= a, r -= a / 2, i.fillRect(c, r, a, a);
              break;
            case "circle":
              var a = o / 6;
              c -= a, i.beginPath(), i.arc(c, r, a, 0, 2 * Math.PI), i.closePath(), i.stroke();
              break;
            case "disc":
            default:
              var a = o / 6;
              c -= a, i.beginPath(), i.arc(c, r, a, 0, 2 * Math.PI), i.closePath(), i.fill();
          }
        }
      }, M.prototype.renderTextDecoration = function(t, e, n) {
        switch (t.css("textDecoration").split(" ")[0]) {
          case "underline":
            this.renderer.rectangle(e.left, Math.round(e.top + n.baseline + n.lineWidth), e.width, 1, t.css("color"));
            break;
          case "overline":
            this.renderer.rectangle(e.left, Math.round(e.top), e.width, 1, t.css("color"));
            break;
          case "line-through":
            this.renderer.rectangle(e.left, Math.ceil(e.top + n.middle + n.lineWidth), e.width, 1, t.css("color"));
        }
      }, M.prototype.renderAnnotation = function(t, e) {
        if ("A" === t.node.nodeName) {
          var n = t.node.getAttribute("href");
          if (n) {
            var r = this.options.canvas.annotations;
            r && r.createAnnotation(n, t.bounds);
          }
        }
      }, M.prototype.parseBorders = function(t) {
        var e = t.parseBounds(),
            n = it(t),
            r = ["Top", "Right", "Bottom", "Left"].map(function(e) {
              return {
                width: t.cssInt("border" + e + "Width"),
                color: t.css("border" + e + "Color"),
                args: null
              };
            }),
            i = Y(e, n, r);
        return {
          clip: this.parseBackgroundClip(t, i, r, n, e),
          borders: X(r, e, i, n)
        };
      }, M.prototype.parseBackgroundClip = function(t, e, n, r, i) {
        var o = t.css("backgroundClip"),
            a = [];
        switch (o) {
          case "content-box":
          case "padding-box":
            Q(a, r[0], r[1], e.topLeftInner, e.topRightInner, i.left + n[3].width, i.top + n[0].width), Q(a, r[1], r[2], e.topRightInner, e.bottomRightInner, i.left + i.width - n[1].width, i.top + n[0].width), Q(a, r[2], r[3], e.bottomRightInner, e.bottomLeftInner, i.left + i.width - n[1].width, i.top + i.height - n[2].width), Q(a, r[3], r[0], e.bottomLeftInner, e.topLeftInner, i.left + n[3].width, i.top + i.height - n[2].width);
            break;
          default:
            Q(a, r[0], r[1], e.topLeftOuter, e.topRightOuter, i.left, i.top), Q(a, r[1], r[2], e.topRightOuter, e.bottomRightOuter, i.left + i.width, i.top), Q(a, r[2], r[3], e.bottomRightOuter, e.bottomLeftOuter, i.left + i.width, i.top + i.height), Q(a, r[3], r[0], e.bottomLeftOuter, e.topLeftOuter, i.left, i.top + i.height);
        }
        return a;
      };
      var Yt = 0,
          Gt = "withCredentials" in new XMLHttpRequest,
          Jt = "crossOrigin" in new Image;
      It.prototype.cloneTo = function(t) {
        It.prototype.cloneTo.call(this, t), t.isPseudoElement = !0, t.before = this.before;
      }, It.prototype = Object.create(O.prototype), It.prototype.appendToDOM = function() {
        this.before ? this.parent.node.insertBefore(this.node, this.parent.node.firstChild) : this.parent.node.appendChild(this.node), this.parent.node.className += " " + this.getHideClass();
      }, It.prototype.cleanDOM = function() {
        this.node.parentNode.removeChild(this.node), this.parent.node.className = this.parent.node.className.replace(this.getHideClass(), "");
      }, It.prototype.getHideClass = function() {
        return this["PSEUDO_HIDE_ELEMENT_CLASS_" + (this.before ? "BEFORE" : "AFTER")];
      }, It.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before", It.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after", Ot.prototype.renderImage = function(t, e, n, r) {
        var i = t.cssInt("paddingLeft"),
            o = t.cssInt("paddingTop"),
            a = t.cssInt("paddingRight"),
            s = t.cssInt("paddingBottom"),
            c = n.borders,
            u = e.width - (c[1].width + c[3].width + i + a),
            l = e.height - (c[0].width + c[2].width + o + s);
        this.drawImage(r, 0, 0, r.image.width || u, r.image.height || l, e.left + i + c[3].width, e.top + o + c[0].width, u, l);
      }, Ot.prototype.renderBackground = function(t, e, n) {
        e.height > 0 && e.width > 0 && (this.renderBackgroundColor(t, e), this.renderBackgroundImage(t, e, n));
      }, Ot.prototype.renderBackgroundColor = function(t, e) {
        var n = t.css("backgroundColor");
        this.isTransparent(n) || this.rectangle(e.left, e.top, e.width, e.height, t.css("backgroundColor"));
      }, Ot.prototype.renderBorders = function(t) {
        t.forEach(this.renderBorder, this);
      }, Ot.prototype.renderBorder = function(t) {
        this.isTransparent(t.color) || null === t.args || this.drawShape(t.args, t.color);
      }, Ot.prototype.renderBackgroundImage = function(t, e, n) {
        var r = t.parseBackgroundImages();
        r.reverse().forEach(function(r, i, o) {
          switch (r.method) {
            case "url":
              var a = this.images.get(r.args[0]);
              a ? this.renderBackgroundRepeating(t, e, a, o.length - (i + 1), n) : I("Error loading background-image", r.args[0]);
              break;
            case "linear-gradient":
            case "gradient":
              var s = this.images.get(r.value);
              s ? this.renderBackgroundGradient(s, e, n) : I("Error loading background-image", r.args[0]);
              break;
            case "none":
              break;
            default:
              I("Unknown background-image type", r.args[0]);
          }
        }, this);
      }, Ot.prototype.renderBackgroundRepeating = function(t, e, n, r, i) {
        var o = t.parseBackgroundSize(e, n.image, r),
            a = t.parseBackgroundPosition(e, n.image, r, o),
            s = t.parseBackgroundRepeat(r);
        switch (s) {
          case "repeat-x":
          case "repeat no-repeat":
            this.backgroundRepeatShape(n, a, o, e, e.left + i[3], e.top + a.top + i[0], 99999, o.height, i);
            break;
          case "repeat-y":
          case "no-repeat repeat":
            this.backgroundRepeatShape(n, a, o, e, e.left + a.left + i[3], e.top + i[0], o.width, 99999, i);
            break;
          case "no-repeat":
            this.backgroundRepeatShape(n, a, o, e, e.left + a.left + i[3], e.top + a.top + i[0], o.width, o.height, i);
            break;
          default:
            this.renderBackgroundRepeat(n, a, o, {
              top: e.top,
              left: e.left
            }, i[3], i[0]);
        }
      }, Ot.prototype.isTransparent = function(t) {
        return !t || "transparent" === t || "rgba(0, 0, 0, 0)" === t;
      }, Ft.prototype = Object.create(O.prototype), Ft.prototype.getParentStack = function(t) {
        var e = this.parent ? this.parent.stack : null;
        return e ? e.ownStacking ? e : e.getParentStack(t) : t.stack;
      }, Bt.prototype.testRangeBounds = function(t) {
        var e,
            n,
            r,
            i,
            o = !1;
        return t.createRange && (e = t.createRange(), e.getBoundingClientRect && (n = t.createElement("boundtest"), n.style.height = "123px", n.style.display = "block", t.body.appendChild(n), e.selectNode(n), r = e.getBoundingClientRect(), i = r.height, 123 === i && (o = !0), t.body.removeChild(n))), o;
      }, Bt.prototype.testCORS = function() {
        return "undefined" != typeof(new Image).crossOrigin;
      }, Bt.prototype.testSVG = function() {
        var t = new Image,
            n = e.createElement("canvas"),
            r = n.getContext("2d");
        t.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
        try {
          r.drawImage(t, 0, 0), n.toDataURL();
        } catch (i) {
          return !1;
        }
        return !0;
      }, Rt.prototype.hasFabric = function() {
        return html2canvas.fabric ? Promise.resolve() : Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg"));
      }, Rt.prototype.inlineFormatting = function(t) {
        return /^data:image\/svg\+xml;base64,/.test(t) ? this.decode64(this.removeContentType(t)) : this.removeContentType(t);
      }, Rt.prototype.removeContentType = function(t) {
        return t.replace(/^data:image\/svg\+xml(;base64)?,/, "");
      }, Rt.prototype.isInline = function(t) {
        return /^data:image\/svg\+xml/i.test(t);
      }, Rt.prototype.createCanvas = function(t) {
        var e = this;
        return function(n, r) {
          var i = new html2canvas.fabric.StaticCanvas("c");
          e.image = i.lowerCanvasEl, i.setWidth(r.width).setHeight(r.height).add(html2canvas.fabric.util.groupSVGElements(n, r)).renderAll(), t(i.lowerCanvasEl);
        };
      }, Rt.prototype.decode64 = function(e) {
        return "function" == typeof t.atob ? t.atob(e) : jt(e);
      }, Dt.prototype = Object.create(Rt.prototype), Nt.prototype = Object.create(O.prototype), Nt.prototype.applyTextTransform = function() {
        this.node.data = this.transform(this.parent.css("textTransform"));
      }, Nt.prototype.transform = function(t) {
        var e = this.node.data;
        switch (t) {
          case "lowercase":
            return e.toLowerCase();
          case "capitalize":
            return e.replace(/(^|\s|:|-|\(|\))([a-z])/g, zt);
          case "uppercase":
            return e.toUpperCase();
          default:
            return e;
        }
      }, Lt.prototype = Object.create(_.prototype), Ut.prototype = Object.create(Ot.prototype), Ut.prototype.setFillStyle = function(t) {
        return this.ctx.fillStyle = t, this.ctx;
      }, Ut.prototype.rectangle = function(t, e, n, r, i) {
        this.setFillStyle(i).fillRect(t, e, n, r);
      }, Ut.prototype.circle = function(t, e, n, r) {
        this.setFillStyle(r), this.ctx.beginPath(), this.ctx.arc(t + n / 2, e + n / 2, n / 2, 0, 2 * Math.PI, !0), this.ctx.closePath(), this.ctx.fill();
      }, Ut.prototype.circleStroke = function(t, e, n, r, i, o) {
        this.circle(t, e, n, r), this.ctx.strokeStyle = o, this.ctx.stroke();
      }, Ut.prototype.drawShape = function(t, e) {
        this.shape(t), this.setFillStyle(e).fill();
      }, Ut.prototype.taints = function(t) {
        if (null === t.tainted) {
          this.taintCtx.drawImage(t.image, 0, 0);
          try {
            this.taintCtx.getImageData(0, 0, 1, 1), t.tainted = !1;
          } catch (n) {
            this.taintCtx = e.createElement("canvas").getContext("2d"), t.tainted = !0;
          }
        }
        return t.tainted;
      }, Ut.prototype.drawImage = function(t, e, n, r, i, o, a, s, c) {
        this.taints(t) && !this.options.allowTaint || this.ctx.drawImage(t.image, e, n, r, i, o, a, s, c);
      }, Ut.prototype.clip = function(t, e, n) {
        this.ctx.save(), t.filter(Ht).forEach(function(t) {
          this.shape(t).clip();
        }, this), e.call(n), this.ctx.restore();
      }, Ut.prototype.shape = function(t) {
        return this.ctx.beginPath(), t.forEach(function(t, e) {
          "rect" === t[0] ? this.ctx.rect.apply(this.ctx, t.slice(1)) : this.ctx[0 === e ? "moveTo" : t[0] + "To"].apply(this.ctx, t.slice(1));
        }, this), this.ctx.closePath(), this.ctx;
      }, Ut.prototype.font = function(t, e, n, r, i, o) {
        this.setFillStyle(t).font = [e, n, r, i, o].join(" ").split(",")[0];
      }, Ut.prototype.fontShadow = function(t, e, n, r) {
        this.setVariable("shadowColor", t).setVariable("shadowOffsetY", e).setVariable("shadowOffsetX", n).setVariable("shadowBlur", r);
      }, Ut.prototype.clearShadow = function() {
        this.setVariable("shadowColor", "rgba(0,0,0,0)");
      }, Ut.prototype.setOpacity = function(t) {
        this.ctx.globalAlpha = t;
      }, Ut.prototype.setTransform = function(t) {
        this.ctx.translate(t.origin[0], t.origin[1]), this.ctx.transform.apply(this.ctx, t.matrix), this.ctx.translate(-t.origin[0], -t.origin[1]);
      }, Ut.prototype.setVariable = function(t, e) {
        return this.variables[t] !== e && (this.variables[t] = this.ctx[t] = e), this;
      }, Ut.prototype.text = function(t, e, n) {
        this.ctx.fillText(t, e, n);
      }, Ut.prototype.backgroundRepeatShape = function(t, e, n, r, i, o, a, s, c) {
        var u = [["line", Math.round(i), Math.round(o)], ["line", Math.round(i + a), Math.round(o)], ["line", Math.round(i + a), Math.round(s + o)], ["line", Math.round(i), Math.round(s + o)]];
        this.clip([u], function() {
          this.renderBackgroundRepeat(t, e, n, r, c[3], c[0]);
        }, this);
      }, Ut.prototype.renderBackgroundRepeat = function(t, e, n, r, i, o) {
        var a = Math.round(r.left + e.left + i),
            s = Math.round(r.top + e.top + o);
        this.setFillStyle(this.ctx.createPattern(this.resizeImage(t, n), "repeat")), this.ctx.translate(a, s), this.ctx.fill(), this.ctx.translate(-a, -s);
      }, Ut.prototype.renderBackgroundGradient = function(t, e) {
        if (t instanceof E) {
          var n = this.ctx.createLinearGradient(e.left + e.width * t.x0, e.top + e.height * t.y0, e.left + e.width * t.x1, e.top + e.height * t.y1);
          t.colorStops.forEach(function(t) {
            n.addColorStop(t.stop, t.color);
          }), this.rectangle(e.left, e.top, e.width, e.height, n);
        }
      }, Ut.prototype.resizeImage = function(t, n) {
        var r = t.image;
        if (r.width === n.width && r.height === n.height)
          return r;
        var i,
            o = e.createElement("canvas");
        return o.width = n.width, o.height = n.height, i = o.getContext("2d"), i.drawImage(r, 0, 0, r.width, r.height, 0, 0, n.width, n.height), o;
      };
    }).call({}, window, document), function(t) {
      var e;
      e = function() {
        function e(t) {
          var e,
              n,
              r,
              i,
              o,
              a,
              s,
              c,
              u,
              l,
              h,
              f,
              d,
              p,
              m;
          for (this.data = t, this.pos = 8, this.palette = [], this.imgData = [], this.transparency = {}, this.animation = null, this.text = {}, a = null; ; ) {
            switch (e = this.readUInt32(), l = function() {
              var t,
                  e;
              for (e = [], s = t = 0; 4 > t; s = ++t)
                e.push(String.fromCharCode(this.data[this.pos++]));
              return e;
            }.call(this).join("")) {
              case "IHDR":
                this.width = this.readUInt32(), this.height = this.readUInt32(), this.bits = this.data[this.pos++], this.colorType = this.data[this.pos++], this.compressionMethod = this.data[this.pos++], this.filterMethod = this.data[this.pos++], this.interlaceMethod = this.data[this.pos++];
                break;
              case "acTL":
                this.animation = {
                  numFrames: this.readUInt32(),
                  numPlays: this.readUInt32() || 1 / 0,
                  frames: []
                };
                break;
              case "PLTE":
                this.palette = this.read(e);
                break;
              case "fcTL":
                a && this.animation.frames.push(a), this.pos += 4, a = {
                  width: this.readUInt32(),
                  height: this.readUInt32(),
                  xOffset: this.readUInt32(),
                  yOffset: this.readUInt32()
                }, o = this.readUInt16(), i = this.readUInt16() || 100, a.delay = 1e3 * o / i, a.disposeOp = this.data[this.pos++], a.blendOp = this.data[this.pos++], a.data = [];
                break;
              case "IDAT":
              case "fdAT":
                for ("fdAT" === l && (this.pos += 4, e -= 4), t = (null != a ? a.data : void 0) || this.imgData, s = d = 0; e >= 0 ? e > d : d > e; s = e >= 0 ? ++d : --d)
                  t.push(this.data[this.pos++]);
                break;
              case "tRNS":
                switch (this.transparency = {}, this.colorType) {
                  case 3:
                    if (r = this.palette.length / 3, this.transparency.indexed = this.read(e), this.transparency.indexed.length > r)
                      throw new Error("More transparent colors than palette size");
                    if (h = r - this.transparency.indexed.length, h > 0)
                      for (s = p = 0; h >= 0 ? h > p : p > h; s = h >= 0 ? ++p : --p)
                        this.transparency.indexed.push(255);
                    break;
                  case 0:
                    this.transparency.grayscale = this.read(e)[0];
                    break;
                  case 2:
                    this.transparency.rgb = this.read(e);
                }
                break;
              case "tEXt":
                f = this.read(e), c = f.indexOf(0), u = String.fromCharCode.apply(String, f.slice(0, c)), this.text[u] = String.fromCharCode.apply(String, f.slice(c + 1));
                break;
              case "IEND":
                return a && this.animation.frames.push(a), this.colors = function() {
                  switch (this.colorType) {
                    case 0:
                    case 3:
                    case 4:
                      return 1;
                    case 2:
                    case 6:
                      return 3;
                  }
                }.call(this), this.hasAlphaChannel = 4 === (m = this.colorType) || 6 === m, n = this.colors + (this.hasAlphaChannel ? 1 : 0), this.pixelBitlength = this.bits * n, this.colorSpace = function() {
                  switch (this.colors) {
                    case 1:
                      return "DeviceGray";
                    case 3:
                      return "DeviceRGB";
                  }
                }.call(this), void(this.imgData = new Uint8Array(this.imgData));
              default:
                this.pos += e;
            }
            if (this.pos += 4, this.pos > this.data.length)
              throw new Error("Incomplete or corrupt PNG file");
          }
        }
        var n,
            r,
            i,
            o,
            a,
            s,
            u,
            l;
        e.load = function(t, n, r) {
          var i;
          return "function" == typeof n && (r = n), i = new XMLHttpRequest, i.open("GET", t, !0), i.responseType = "arraybuffer", i.onload = function() {
            var t,
                o;
            return t = new Uint8Array(i.response || i.mozResponseArrayBuffer), o = new e(t), "function" == typeof(null != n ? n.getContext : void 0) && o.render(n), "function" == typeof r ? r(o) : void 0;
          }, i.send(null);
        }, o = 0, i = 1, a = 2, r = 0, n = 1, e.prototype.read = function(t) {
          var e,
              n,
              r;
          for (r = [], e = n = 0; t >= 0 ? t > n : n > t; e = t >= 0 ? ++n : --n)
            r.push(this.data[this.pos++]);
          return r;
        }, e.prototype.readUInt32 = function() {
          var t,
              e,
              n,
              r;
          return t = this.data[this.pos++] << 24, e = this.data[this.pos++] << 16, n = this.data[this.pos++] << 8, r = this.data[this.pos++], t | e | n | r;
        }, e.prototype.readUInt16 = function() {
          var t,
              e;
          return t = this.data[this.pos++] << 8, e = this.data[this.pos++], t | e;
        }, e.prototype.decodePixels = function(t) {
          var e,
              n,
              r,
              i,
              o,
              a,
              s,
              u,
              l,
              h,
              f,
              d,
              p,
              m,
              g,
              w,
              y,
              v,
              b,
              x,
              k,
              S,
              C;
          if (null == t && (t = this.imgData), 0 === t.length)
            return new Uint8Array(0);
          for (t = new c(t), t = t.getBytes(), d = this.pixelBitlength / 8, w = d * this.width, p = new Uint8Array(w * this.height), a = t.length, g = 0, m = 0, n = 0; a > m; ) {
            switch (t[m++]) {
              case 0:
                for (i = b = 0; w > b; i = b += 1)
                  p[n++] = t[m++];
                break;
              case 1:
                for (i = x = 0; w > x; i = x += 1)
                  e = t[m++], o = d > i ? 0 : p[n - d], p[n++] = (e + o) % 256;
                break;
              case 2:
                for (i = k = 0; w > k; i = k += 1)
                  e = t[m++], r = (i - i % d) / d, y = g && p[(g - 1) * w + r * d + i % d], p[n++] = (y + e) % 256;
                break;
              case 3:
                for (i = S = 0; w > S; i = S += 1)
                  e = t[m++], r = (i - i % d) / d, o = d > i ? 0 : p[n - d], y = g && p[(g - 1) * w + r * d + i % d], p[n++] = (e + Math.floor((o + y) / 2)) % 256;
                break;
              case 4:
                for (i = C = 0; w > C; i = C += 1)
                  e = t[m++], r = (i - i % d) / d, o = d > i ? 0 : p[n - d], 0 === g ? y = v = 0 : (y = p[(g - 1) * w + r * d + i % d], v = r && p[(g - 1) * w + (r - 1) * d + i % d]), s = o + y - v, u = Math.abs(s - o), h = Math.abs(s - y), f = Math.abs(s - v), l = h >= u && f >= u ? o : f >= h ? y : v, p[n++] = (e + l) % 256;
                break;
              default:
                throw new Error("Invalid filter algorithm: " + t[m - 1]);
            }
            g++;
          }
          return p;
        }, e.prototype.decodePalette = function() {
          var t,
              e,
              n,
              r,
              i,
              o,
              a,
              s,
              c,
              u;
          for (r = this.palette, a = this.transparency.indexed || [], o = new Uint8Array((a.length || 0) + r.length), i = 0, n = r.length, t = 0, e = s = 0, c = r.length; c > s; e = s += 3)
            o[i++] = r[e], o[i++] = r[e + 1], o[i++] = r[e + 2], o[i++] = null != (u = a[t++]) ? u : 255;
          return o;
        }, e.prototype.copyToImageData = function(t, e) {
          var n,
              r,
              i,
              o,
              a,
              s,
              c,
              u,
              l,
              h,
              f;
          if (r = this.colors, l = null, n = this.hasAlphaChannel, this.palette.length && (l = null != (f = this._decodedPalette) ? f : this._decodedPalette = this.decodePalette(), r = 4, n = !0), i = t.data || t, u = i.length, a = l || e, o = s = 0, 1 === r)
            for (; u > o; )
              c = l ? 4 * e[o / 4] : s, h = a[c++], i[o++] = h, i[o++] = h, i[o++] = h, i[o++] = n ? a[c++] : 255, s = c;
          else
            for (; u > o; )
              c = l ? 4 * e[o / 4] : s, i[o++] = a[c++], i[o++] = a[c++], i[o++] = a[c++], i[o++] = n ? a[c++] : 255, s = c;
        }, e.prototype.decode = function() {
          var t;
          return t = new Uint8Array(this.width * this.height * 4), this.copyToImageData(t, this.decodePixels()), t;
        };
        try {
          u = t.document.createElement("canvas"), l = u.getContext("2d");
        } catch (h) {
          return -1;
        }
        return s = function(t) {
          var e;
          return l.width = t.width, l.height = t.height, l.clearRect(0, 0, t.width, t.height), l.putImageData(t, 0, 0), e = new Image, e.src = u.toDataURL(), e;
        }, e.prototype.decodeFrames = function(t) {
          var e,
              n,
              r,
              i,
              o,
              a,
              c,
              u;
          if (this.animation) {
            for (c = this.animation.frames, u = [], n = o = 0, a = c.length; a > o; n = ++o)
              e = c[n], r = t.createImageData(e.width, e.height), i = this.decodePixels(new Uint8Array(e.data)), this.copyToImageData(r, i), e.imageData = r, u.push(e.image = s(r));
            return u;
          }
        }, e.prototype.renderFrame = function(t, e) {
          var n,
              o,
              s;
          return o = this.animation.frames, n = o[e], s = o[e - 1], 0 === e && t.clearRect(0, 0, this.width, this.height), (null != s ? s.disposeOp : void 0) === i ? t.clearRect(s.xOffset, s.yOffset, s.width, s.height) : (null != s ? s.disposeOp : void 0) === a && t.putImageData(s.imageData, s.xOffset, s.yOffset), n.blendOp === r && t.clearRect(n.xOffset, n.yOffset, n.width, n.height), t.drawImage(n.image, n.xOffset, n.yOffset);
        }, e.prototype.animate = function(t) {
          var e,
              n,
              r,
              i,
              o,
              a,
              s = this;
          return n = 0, a = this.animation, i = a.numFrames, r = a.frames, o = a.numPlays, (e = function() {
            var a,
                c;
            return a = n++ % i, c = r[a], s.renderFrame(t, a), i > 1 && o > n / i ? s.animation._timeout = setTimeout(e, c.delay) : void 0;
          })();
        }, e.prototype.stopAnimation = function() {
          var t;
          return clearTimeout(null != (t = this.animation) ? t._timeout : void 0);
        }, e.prototype.render = function(t) {
          var e,
              n;
          return t._png && t._png.stopAnimation(), t._png = this, t.width = this.width, t.height = this.height, e = t.getContext("2d"), this.animation ? (this.decodeFrames(e), this.animate(e)) : (n = e.createImageData(this.width, this.height), this.copyToImageData(n, this.decodePixels()), e.putImageData(n, 0, 0));
        }, e;
      }(), t.PNG = e;
    }("undefined" != typeof window && window || this);
    var s = function() {
      function t() {
        this.pos = 0, this.bufferLength = 0, this.eof = !1, this.buffer = null;
      }
      return t.prototype = {
        ensureBuffer: function(t) {
          var e = this.buffer,
              n = e ? e.byteLength : 0;
          if (n > t)
            return e;
          for (var r = 512; t > r; )
            r <<= 1;
          for (var i = new Uint8Array(r),
              o = 0; n > o; ++o)
            i[o] = e[o];
          return this.buffer = i;
        },
        getByte: function() {
          for (var t = this.pos; this.bufferLength <= t; ) {
            if (this.eof)
              return null;
            this.readBlock();
          }
          return this.buffer[this.pos++];
        },
        getBytes: function(t) {
          var e = this.pos;
          if (t) {
            this.ensureBuffer(e + t);
            for (var n = e + t; !this.eof && this.bufferLength < n; )
              this.readBlock();
            var r = this.bufferLength;
            n > r && (n = r);
          } else {
            for (; !this.eof; )
              this.readBlock();
            var n = this.bufferLength;
          }
          return this.pos = n, this.buffer.subarray(e, n);
        },
        lookChar: function() {
          for (var t = this.pos; this.bufferLength <= t; ) {
            if (this.eof)
              return null;
            this.readBlock();
          }
          return String.fromCharCode(this.buffer[this.pos]);
        },
        getChar: function() {
          for (var t = this.pos; this.bufferLength <= t; ) {
            if (this.eof)
              return null;
            this.readBlock();
          }
          return String.fromCharCode(this.buffer[this.pos++]);
        },
        makeSubStream: function(t, e, n) {
          for (var r = t + e; this.bufferLength <= r && !this.eof; )
            this.readBlock();
          return new Stream(this.buffer, t, e, n);
        },
        skip: function(t) {
          t || (t = 1), this.pos += t;
        },
        reset: function() {
          this.pos = 0;
        }
      }, t;
    }(),
        c = function() {
          function t(t) {
            throw new Error(t);
          }
          function e(e) {
            var n = 0,
                r = e[n++],
                i = e[n++];
            -1 != r && -1 != i || t("Invalid header in flate stream"), 8 != (15 & r) && t("Unknown compression method in flate stream"), ((r << 8) + i) % 31 != 0 && t("Bad FCHECK in flate stream"), 32 & i && t("FDICT bit set in flate stream"), this.bytes = e, this.bytesPos = n, this.codeSize = 0, this.codeBuf = 0, s.call(this);
          }
          if ("undefined" != typeof Uint32Array) {
            var n = new Uint32Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
                r = new Uint32Array([3, 4, 5, 6, 7, 8, 9, 10, 65547, 65549, 65551, 65553, 131091, 131095, 131099, 131103, 196643, 196651, 196659, 196667, 262211, 262227, 262243, 262259, 327811, 327843, 327875, 327907, 258, 258, 258]),
                i = new Uint32Array([1, 2, 3, 4, 65541, 65543, 131081, 131085, 196625, 196633, 262177, 262193, 327745, 327777, 393345, 393409, 459009, 459137, 524801, 525057, 590849, 591361, 657409, 658433, 724993, 727041, 794625, 798721, 868353, 876545]),
                o = [new Uint32Array([459008, 524368, 524304, 524568, 459024, 524400, 524336, 590016, 459016, 524384, 524320, 589984, 524288, 524416, 524352, 590048, 459012, 524376, 524312, 589968, 459028, 524408, 524344, 590032, 459020, 524392, 524328, 59e4, 524296, 524424, 524360, 590064, 459010, 524372, 524308, 524572, 459026, 524404, 524340, 590024, 459018, 524388, 524324, 589992, 524292, 524420, 524356, 590056, 459014, 524380, 524316, 589976, 459030, 524412, 524348, 590040, 459022, 524396, 524332, 590008, 524300, 524428, 524364, 590072, 459009, 524370, 524306, 524570, 459025, 524402, 524338, 590020, 459017, 524386, 524322, 589988, 524290, 524418, 524354, 590052, 459013, 524378, 524314, 589972, 459029, 524410, 524346, 590036, 459021, 524394, 524330, 590004, 524298, 524426, 524362, 590068, 459011, 524374, 524310, 524574, 459027, 524406, 524342, 590028, 459019, 524390, 524326, 589996, 524294, 524422, 524358, 590060, 459015, 524382, 524318, 589980, 459031, 524414, 524350, 590044, 459023, 524398, 524334, 590012, 524302, 524430, 524366, 590076, 459008, 524369, 524305, 524569, 459024, 524401, 524337, 590018, 459016, 524385, 524321, 589986, 524289, 524417, 524353, 590050, 459012, 524377, 524313, 589970, 459028, 524409, 524345, 590034, 459020, 524393, 524329, 590002, 524297, 524425, 524361, 590066, 459010, 524373, 524309, 524573, 459026, 524405, 524341, 590026, 459018, 524389, 524325, 589994, 524293, 524421, 524357, 590058, 459014, 524381, 524317, 589978, 459030, 524413, 524349, 590042, 459022, 524397, 524333, 590010, 524301, 524429, 524365, 590074, 459009, 524371, 524307, 524571, 459025, 524403, 524339, 590022, 459017, 524387, 524323, 589990, 524291, 524419, 524355, 590054, 459013, 524379, 524315, 589974, 459029, 524411, 524347, 590038, 459021, 524395, 524331, 590006, 524299, 524427, 524363, 590070, 459011, 524375, 524311, 524575, 459027, 524407, 524343, 590030, 459019, 524391, 524327, 589998, 524295, 524423, 524359, 590062, 459015, 524383, 524319, 589982, 459031, 524415, 524351, 590046, 459023, 524399, 524335, 590014, 524303, 524431, 524367, 590078, 459008, 524368, 524304, 524568, 459024, 524400, 524336, 590017, 459016, 524384, 524320, 589985, 524288, 524416, 524352, 590049, 459012, 524376, 524312, 589969, 459028, 524408, 524344, 590033, 459020, 524392, 524328, 590001, 524296, 524424, 524360, 590065, 459010, 524372, 524308, 524572, 459026, 524404, 524340, 590025, 459018, 524388, 524324, 589993, 524292, 524420, 524356, 590057, 459014, 524380, 524316, 589977, 459030, 524412, 524348, 590041, 459022, 524396, 524332, 590009, 524300, 524428, 524364, 590073, 459009, 524370, 524306, 524570, 459025, 524402, 524338, 590021, 459017, 524386, 524322, 589989, 524290, 524418, 524354, 590053, 459013, 524378, 524314, 589973, 459029, 524410, 524346, 590037, 459021, 524394, 524330, 590005, 524298, 524426, 524362, 590069, 459011, 524374, 524310, 524574, 459027, 524406, 524342, 590029, 459019, 524390, 524326, 589997, 524294, 524422, 524358, 590061, 459015, 524382, 524318, 589981, 459031, 524414, 524350, 590045, 459023, 524398, 524334, 590013, 524302, 524430, 524366, 590077, 459008, 524369, 524305, 524569, 459024, 524401, 524337, 590019, 459016, 524385, 524321, 589987, 524289, 524417, 524353, 590051, 459012, 524377, 524313, 589971, 459028, 524409, 524345, 590035, 459020, 524393, 524329, 590003, 524297, 524425, 524361, 590067, 459010, 524373, 524309, 524573, 459026, 524405, 524341, 590027, 459018, 524389, 524325, 589995, 524293, 524421, 524357, 590059, 459014, 524381, 524317, 589979, 459030, 524413, 524349, 590043, 459022, 524397, 524333, 590011, 524301, 524429, 524365, 590075, 459009, 524371, 524307, 524571, 459025, 524403, 524339, 590023, 459017, 524387, 524323, 589991, 524291, 524419, 524355, 590055, 459013, 524379, 524315, 589975, 459029, 524411, 524347, 590039, 459021, 524395, 524331, 590007, 524299, 524427, 524363, 590071, 459011, 524375, 524311, 524575, 459027, 524407, 524343, 590031, 459019, 524391, 524327, 589999, 524295, 524423, 524359, 590063, 459015, 524383, 524319, 589983, 459031, 524415, 524351, 590047, 459023, 524399, 524335, 590015, 524303, 524431, 524367, 590079]), 9],
                a = [new Uint32Array([327680, 327696, 327688, 327704, 327684, 327700, 327692, 327708, 327682, 327698, 327690, 327706, 327686, 327702, 327694, 0, 327681, 327697, 327689, 327705, 327685, 327701, 327693, 327709, 327683, 327699, 327691, 327707, 327687, 327703, 327695, 0]), 5];
            return e.prototype = Object.create(s.prototype), e.prototype.getBits = function(e) {
              for (var n,
                  r = this.codeSize,
                  i = this.codeBuf,
                  o = this.bytes,
                  a = this.bytesPos; e > r; )
                "undefined" == typeof(n = o[a++]) && t("Bad encoding in flate stream"), i |= n << r, r += 8;
              return n = i & (1 << e) - 1, this.codeBuf = i >> e, this.codeSize = r -= e, this.bytesPos = a, n;
            }, e.prototype.getCode = function(e) {
              for (var n = e[0],
                  r = e[1],
                  i = this.codeSize,
                  o = this.codeBuf,
                  a = this.bytes,
                  s = this.bytesPos; r > i; ) {
                var c;
                "undefined" == typeof(c = a[s++]) && t("Bad encoding in flate stream"), o |= c << i, i += 8;
              }
              var u = n[o & (1 << r) - 1],
                  l = u >> 16,
                  h = 65535 & u;
              return (0 == i || l > i || 0 == l) && t("Bad encoding in flate stream"), this.codeBuf = o >> l, this.codeSize = i - l, this.bytesPos = s, h;
            }, e.prototype.generateHuffmanTable = function(t) {
              for (var e = t.length,
                  n = 0,
                  r = 0; e > r; ++r)
                t[r] > n && (n = t[r]);
              for (var i = 1 << n,
                  o = new Uint32Array(i),
                  a = 1,
                  s = 0,
                  c = 2; n >= a; ++a, s <<= 1, c <<= 1)
                for (var u = 0; e > u; ++u)
                  if (t[u] == a) {
                    for (var l = 0,
                        h = s,
                        r = 0; a > r; ++r)
                      l = l << 1 | 1 & h, h >>= 1;
                    for (var r = l; i > r; r += c)
                      o[r] = a << 16 | u;
                    ++s;
                  }
              return [o, n];
            }, e.prototype.readBlock = function() {
              function e(t, e, n, r, i) {
                for (var o = t.getBits(n) + r; o-- > 0; )
                  e[S++] = i;
              }
              var s = this.getBits(3);
              if (1 & s && (this.eof = !0), s >>= 1, 0 == s) {
                var c,
                    u = this.bytes,
                    l = this.bytesPos;
                "undefined" == typeof(c = u[l++]) && t("Bad block header in flate stream");
                var h = c;
                "undefined" == typeof(c = u[l++]) && t("Bad block header in flate stream"), h |= c << 8, "undefined" == typeof(c = u[l++]) && t("Bad block header in flate stream");
                var f = c;
                "undefined" == typeof(c = u[l++]) && t("Bad block header in flate stream"), f |= c << 8, f != (65535 & ~h) && t("Bad uncompressed block length in flate stream"), this.codeBuf = 0, this.codeSize = 0;
                var d = this.bufferLength,
                    p = this.ensureBuffer(d + h),
                    m = d + h;
                this.bufferLength = m;
                for (var g = d; m > g; ++g) {
                  if ("undefined" == typeof(c = u[l++])) {
                    this.eof = !0;
                    break;
                  }
                  p[g] = c;
                }
                return void(this.bytesPos = l);
              }
              var w,
                  y;
              if (1 == s)
                w = o, y = a;
              else if (2 == s) {
                for (var v = this.getBits(5) + 257,
                    b = this.getBits(5) + 1,
                    x = this.getBits(4) + 4,
                    k = Array(n.length),
                    S = 0; x > S; )
                  k[n[S++]] = this.getBits(3);
                for (var C = this.generateHuffmanTable(k),
                    A = 0,
                    S = 0,
                    q = v + b,
                    _ = new Array(q); q > S; ) {
                  var P = this.getCode(C);
                  16 == P ? e(this, _, 2, 3, A) : 17 == P ? e(this, _, 3, 3, A = 0) : 18 == P ? e(this, _, 7, 11, A = 0) : _[S++] = A = P;
                }
                w = this.generateHuffmanTable(_.slice(0, v)), y = this.generateHuffmanTable(_.slice(v, q));
              } else
                t("Unknown block type in flate stream");
              for (var p = this.buffer,
                  T = p ? p.length : 0,
                  E = this.bufferLength; ; ) {
                var I = this.getCode(w);
                if (256 > I)
                  E + 1 >= T && (p = this.ensureBuffer(E + 1), T = p.length), p[E++] = I;
                else {
                  if (256 == I)
                    return void(this.bufferLength = E);
                  I -= 257, I = r[I];
                  var O = I >> 16;
                  O > 0 && (O = this.getBits(O));
                  var A = (65535 & I) + O;
                  I = this.getCode(y), I = i[I], O = I >> 16, O > 0 && (O = this.getBits(O));
                  var F = (65535 & I) + O;
                  E + A >= T && (p = this.ensureBuffer(E + A), T = p.length);
                  for (var B = 0; A > B; ++B, ++E)
                    p[E] = p[E - F];
                }
              }
            }, e;
          }
        }();
    !function(t) {
      var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      "undefined" == typeof t.btoa && (t.btoa = function(t) {
        var n,
            r,
            i,
            o,
            a,
            s,
            c,
            u,
            l = 0,
            h = 0,
            f = "",
            d = [];
        if (!t)
          return t;
        do
          n = t.charCodeAt(l++), r = t.charCodeAt(l++), i = t.charCodeAt(l++), u = n << 16 | r << 8 | i, o = u >> 18 & 63, a = u >> 12 & 63, s = u >> 6 & 63, c = 63 & u, d[h++] = e.charAt(o) + e.charAt(a) + e.charAt(s) + e.charAt(c);
 while (l < t.length);
        f = d.join("");
        var p = t.length % 3;
        return (p ? f.slice(0, p - 3) : f) + "===".slice(p || 3);
      }), "undefined" == typeof t.atob && (t.atob = function(t) {
        var n,
            r,
            i,
            o,
            a,
            s,
            c,
            u,
            l = 0,
            h = 0,
            f = "",
            d = [];
        if (!t)
          return t;
        t += "";
        do
          o = e.indexOf(t.charAt(l++)), a = e.indexOf(t.charAt(l++)), s = e.indexOf(t.charAt(l++)), c = e.indexOf(t.charAt(l++)), u = o << 18 | a << 12 | s << 6 | c, n = u >> 16 & 255, r = u >> 8 & 255, i = 255 & u, 64 == s ? d[h++] = String.fromCharCode(n) : 64 == c ? d[h++] = String.fromCharCode(n, r) : d[h++] = String.fromCharCode(n, r, i);
 while (l < t.length);
        return f = d.join("");
      }), Array.prototype.map || (Array.prototype.map = function(t) {
        if (void 0 === this || null === this || "function" != typeof t)
          throw new TypeError;
        for (var e = Object(this),
            n = e.length >>> 0,
            r = new Array(n),
            i = arguments.length > 1 ? arguments[1] : void 0,
            o = 0; n > o; o++)
          o in e && (r[o] = t.call(i, e[o], o, e));
        return r;
      }), Array.isArray || (Array.isArray = function(t) {
        return "[object Array]" === Object.prototype.toString.call(t);
      }), Array.prototype.forEach || (Array.prototype.forEach = function(t, e) {
        if (void 0 === this || null === this || "function" != typeof t)
          throw new TypeError;
        for (var n = Object(this),
            r = n.length >>> 0,
            i = 0; r > i; i++)
          i in n && t.call(e, n[i], i, n);
      }), Object.keys || (Object.keys = function() {
        var t = Object.prototype.hasOwnProperty,
            e = !{toString: null}.propertyIsEnumerable("toString"),
            n = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
            r = n.length;
        return function(i) {
          if ("object" != typeof i && ("function" != typeof i || null === i))
            throw new TypeError;
          var o,
              a,
              s = [];
          for (o in i)
            t.call(i, o) && s.push(o);
          if (e)
            for (a = 0; r > a; a++)
              t.call(i, n[a]) && s.push(n[a]);
          return s;
        };
      }()), String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
      }), String.prototype.trimLeft || (String.prototype.trimLeft = function() {
        return this.replace(/^\s+/g, "");
      }), String.prototype.trimRight || (String.prototype.trimRight = function() {
        return this.replace(/\s+$/g, "");
      });
    }("undefined" != typeof self && self || "undefined" != typeof window && window || this);
    var e = e;
    return e;
  });
})(require('process'));
