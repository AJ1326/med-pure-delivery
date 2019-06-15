'no use strict';
!(function(e) {
  function t(e, t) {
    var n = e,
      r = '';
    while (n) {
      var i = t[n];
      if (typeof i == 'string') return i + r;
      if (i) return i.location.replace(/\/*$/, '/') + (r || i.main || i.name);
      if (i === !1) return '';
      var s = n.lastIndexOf('/');
      if (s === -1) break;
      (r = n.substr(s) + r), (n = n.slice(0, s));
    }
    return e;
  }
  if (typeof e.window != 'undefined' && e.document) return;
  if (e.require && e.define) return;
  e.console ||
    ((e.console = function() {
      var e = Array.prototype.slice.call(arguments, 0);
      postMessage({ type: 'log', data: e });
    }),
    (e.console.error = e.console.warn = e.console.log = e.console.trace = e.console)),
    (e.window = e),
    (e.ace = e),
    (e.onerror = function(e, t, n, r, i) {
      postMessage({ type: 'error', data: { message: e, data: i.data, file: t, line: n, col: r, stack: i.stack } });
    }),
    (e.normalizeModule = function(t, n) {
      if (n.indexOf('!') !== -1) {
        var r = n.split('!');
        return e.normalizeModule(t, r[0]) + '!' + e.normalizeModule(t, r[1]);
      }
      if (n.charAt(0) == '.') {
        var i = t
          .split('/')
          .slice(0, -1)
          .join('/');
        n = (i ? i + '/' : '') + n;
        while (n.indexOf('.') !== -1 && s != n) {
          var s = n;
          n = n
            .replace(/^\.\//, '')
            .replace(/\/\.\//, '/')
            .replace(/[^\/]+\/\.\.\//, '');
        }
      }
      return n;
    }),
    (e.require = function(r, i) {
      i || ((i = r), (r = null));
      if (!i.charAt) throw new Error('worker.js require() accepts only (parentId, id) as arguments');
      i = e.normalizeModule(r, i);
      var s = e.require.modules[i];
      if (s) return s.initialized || ((s.initialized = !0), (s.exports = s.factory().exports)), s.exports;
      if (!e.require.tlns) return console.log('unable to load ' + i);
      var o = t(i, e.require.tlns);
      return (
        o.slice(-3) != '.js' && (o += '.js'),
        (e.require.id = i),
        (e.require.modules[i] = {}),
        importScripts(o),
        e.require(r, i)
      );
    }),
    (e.require.modules = {}),
    (e.require.tlns = {}),
    (e.define = function(t, n, r) {
      arguments.length == 2
        ? ((r = n), typeof t != 'string' && ((n = t), (t = e.require.id)))
        : arguments.length == 1 && ((r = t), (n = []), (t = e.require.id));
      if (typeof r != 'function') {
        e.require.modules[t] = { exports: r, initialized: !0 };
        return;
      }
      n.length || (n = ['require', 'exports', 'module']);
      var i = function(n) {
        return e.require(t, n);
      };
      e.require.modules[t] = {
        exports: {},
        factory: function() {
          var e = this,
            t = r.apply(
              this,
              n.map(function(t) {
                switch (t) {
                  case 'require':
                    return i;
                  case 'exports':
                    return e.exports;
                  case 'module':
                    return e;
                  default:
                    return i(t);
                }
              })
            );
          return t && (e.exports = t), e;
        }
      };
    }),
    (e.define.amd = {}),
    (require.tlns = {}),
    (e.initBaseUrls = function(t) {
      for (var n in t) require.tlns[n] = t[n];
    }),
    (e.initSender = function() {
      var n = e.require('ace/lib/event_emitter').EventEmitter,
        r = e.require('ace/lib/oop'),
        i = function() {};
      return (
        function() {
          r.implement(this, n),
            (this.callback = function(e, t) {
              postMessage({ type: 'call', id: t, data: e });
            }),
            (this.emit = function(e, t) {
              postMessage({ type: 'event', name: e, data: t });
            });
        }.call(i.prototype),
        new i()
      );
    });
  var n = (e.main = null),
    r = (e.sender = null);
  e.onmessage = function(t) {
    var i = t.data;
    if (i.event && r) r._signal(i.event, i.data);
    else if (i.command)
      if (n[i.command]) n[i.command].apply(n, i.args);
      else {
        if (!e[i.command]) throw new Error('Unknown command:' + i.command);
        e[i.command].apply(e, i.args);
      }
    else if (i.init) {
      e.initBaseUrls(i.tlns), require('ace/lib/es5-shim'), (r = e.sender = e.initSender());
      var s = require(i.module)[i.classname];
      n = e.main = new s(r);
    }
  };
})(this),
  define('ace/lib/oop', ['require', 'exports', 'module'], function(e, t, n) {
    'use strict';
    (t.inherits = function(e, t) {
      (e.super_ = t),
        (e.prototype = Object.create(t.prototype, {
          constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 }
        }));
    }),
      (t.mixin = function(e, t) {
        for (var n in t) e[n] = t[n];
        return e;
      }),
      (t.implement = function(e, n) {
        t.mixin(e, n);
      });
  }),
  define('ace/range', ['require', 'exports', 'module'], function(e, t, n) {
    'use strict';
    var r = function(e, t) {
        return e.row - t.row || e.column - t.column;
      },
      i = function(e, t, n, r) {
        (this.start = { row: e, column: t }), (this.end = { row: n, column: r });
      };
    (function() {
      (this.isEqual = function(e) {
        return (
          this.start.row === e.start.row &&
          this.end.row === e.end.row &&
          this.start.column === e.start.column &&
          this.end.column === e.end.column
        );
      }),
        (this.toString = function() {
          return (
            'Range: [' +
            this.start.row +
            '/' +
            this.start.column +
            '] -> [' +
            this.end.row +
            '/' +
            this.end.column +
            ']'
          );
        }),
        (this.contains = function(e, t) {
          return this.compare(e, t) == 0;
        }),
        (this.compareRange = function(e) {
          var t,
            n = e.end,
            r = e.start;
          return (
            (t = this.compare(n.row, n.column)),
            t == 1
              ? ((t = this.compare(r.row, r.column)), t == 1 ? 2 : t == 0 ? 1 : 0)
              : t == -1
              ? -2
              : ((t = this.compare(r.row, r.column)), t == -1 ? -1 : t == 1 ? 42 : 0)
          );
        }),
        (this.comparePoint = function(e) {
          return this.compare(e.row, e.column);
        }),
        (this.containsRange = function(e) {
          return this.comparePoint(e.start) == 0 && this.comparePoint(e.end) == 0;
        }),
        (this.intersects = function(e) {
          var t = this.compareRange(e);
          return t == -1 || t == 0 || t == 1;
        }),
        (this.isEnd = function(e, t) {
          return this.end.row == e && this.end.column == t;
        }),
        (this.isStart = function(e, t) {
          return this.start.row == e && this.start.column == t;
        }),
        (this.setStart = function(e, t) {
          typeof e == 'object'
            ? ((this.start.column = e.column), (this.start.row = e.row))
            : ((this.start.row = e), (this.start.column = t));
        }),
        (this.setEnd = function(e, t) {
          typeof e == 'object'
            ? ((this.end.column = e.column), (this.end.row = e.row))
            : ((this.end.row = e), (this.end.column = t));
        }),
        (this.inside = function(e, t) {
          return this.compare(e, t) == 0 ? (this.isEnd(e, t) || this.isStart(e, t) ? !1 : !0) : !1;
        }),
        (this.insideStart = function(e, t) {
          return this.compare(e, t) == 0 ? (this.isEnd(e, t) ? !1 : !0) : !1;
        }),
        (this.insideEnd = function(e, t) {
          return this.compare(e, t) == 0 ? (this.isStart(e, t) ? !1 : !0) : !1;
        }),
        (this.compare = function(e, t) {
          return !this.isMultiLine() && e === this.start.row
            ? t < this.start.column
              ? -1
              : t > this.end.column
              ? 1
              : 0
            : e < this.start.row
            ? -1
            : e > this.end.row
            ? 1
            : this.start.row === e
            ? t >= this.start.column
              ? 0
              : -1
            : this.end.row === e
            ? t <= this.end.column
              ? 0
              : 1
            : 0;
        }),
        (this.compareStart = function(e, t) {
          return this.start.row == e && this.start.column == t ? -1 : this.compare(e, t);
        }),
        (this.compareEnd = function(e, t) {
          return this.end.row == e && this.end.column == t ? 1 : this.compare(e, t);
        }),
        (this.compareInside = function(e, t) {
          return this.end.row == e && this.end.column == t
            ? 1
            : this.start.row == e && this.start.column == t
            ? -1
            : this.compare(e, t);
        }),
        (this.clipRows = function(e, t) {
          if (this.end.row > t) var n = { row: t + 1, column: 0 };
          else if (this.end.row < e) var n = { row: e, column: 0 };
          if (this.start.row > t) var r = { row: t + 1, column: 0 };
          else if (this.start.row < e) var r = { row: e, column: 0 };
          return i.fromPoints(r || this.start, n || this.end);
        }),
        (this.extend = function(e, t) {
          var n = this.compare(e, t);
          if (n == 0) return this;
          if (n == -1) var r = { row: e, column: t };
          else var s = { row: e, column: t };
          return i.fromPoints(r || this.start, s || this.end);
        }),
        (this.isEmpty = function() {
          return this.start.row === this.end.row && this.start.column === this.end.column;
        }),
        (this.isMultiLine = function() {
          return this.start.row !== this.end.row;
        }),
        (this.clone = function() {
          return i.fromPoints(this.start, this.end);
        }),
        (this.collapseRows = function() {
          return this.end.column == 0
            ? new i(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0)
            : new i(this.start.row, 0, this.end.row, 0);
        }),
        (this.toScreenRange = function(e) {
          var t = e.documentToScreenPosition(this.start),
            n = e.documentToScreenPosition(this.end);
          return new i(t.row, t.column, n.row, n.column);
        }),
        (this.moveBy = function(e, t) {
          (this.start.row += e), (this.start.column += t), (this.end.row += e), (this.end.column += t);
        });
    }.call(i.prototype),
      (i.fromPoints = function(e, t) {
        return new i(e.row, e.column, t.row, t.column);
      }),
      (i.comparePoints = r),
      (i.comparePoints = function(e, t) {
        return e.row - t.row || e.column - t.column;
      }),
      (t.Range = i));
  }),
  define('ace/apply_delta', ['require', 'exports', 'module'], function(e, t, n) {
    'use strict';
    function r(e, t) {
      throw (console.log('Invalid Delta:', e), 'Invalid Delta: ' + t);
    }
    function i(e, t) {
      return t.row >= 0 && t.row < e.length && t.column >= 0 && t.column <= e[t.row].length;
    }
    function s(e, t) {
      t.action != 'insert' && t.action != 'remove' && r(t, "delta.action must be 'insert' or 'remove'"),
        t.lines instanceof Array || r(t, 'delta.lines must be an Array'),
        (!t.start || !t.end) && r(t, 'delta.start/end must be an present');
      var n = t.start;
      i(e, t.start) || r(t, 'delta.start must be contained in document');
      var s = t.end;
      t.action == 'remove' && !i(e, s) && r(t, "delta.end must contained in document for 'remove' actions");
      var o = s.row - n.row,
        u = s.column - (o == 0 ? n.column : 0);
      (o != t.lines.length - 1 || t.lines[o].length != u) && r(t, 'delta.range must match delta lines');
    }
    t.applyDelta = function(e, t, n) {
      var r = t.start.row,
        i = t.start.column,
        s = e[r] || '';
      switch (t.action) {
        case 'insert':
          var o = t.lines;
          if (o.length === 1) e[r] = s.substring(0, i) + t.lines[0] + s.substring(i);
          else {
            var u = [r, 1].concat(t.lines);
            e.splice.apply(e, u), (e[r] = s.substring(0, i) + e[r]), (e[r + t.lines.length - 1] += s.substring(i));
          }
          break;
        case 'remove':
          var a = t.end.column,
            f = t.end.row;
          r === f
            ? (e[r] = s.substring(0, i) + s.substring(a))
            : e.splice(r, f - r + 1, s.substring(0, i) + e[f].substring(a));
      }
    };
  }),
  define('ace/lib/event_emitter', ['require', 'exports', 'module'], function(e, t, n) {
    'use strict';
    var r = {},
      i = function() {
        this.propagationStopped = !0;
      },
      s = function() {
        this.defaultPrevented = !0;
      };
    (r._emit = r._dispatchEvent = function(e, t) {
      this._eventRegistry || (this._eventRegistry = {}), this._defaultHandlers || (this._defaultHandlers = {});
      var n = this._eventRegistry[e] || [],
        r = this._defaultHandlers[e];
      if (!n.length && !r) return;
      if (typeof t != 'object' || !t) t = {};
      t.type || (t.type = e),
        t.stopPropagation || (t.stopPropagation = i),
        t.preventDefault || (t.preventDefault = s),
        (n = n.slice());
      for (var o = 0; o < n.length; o++) {
        n[o](t, this);
        if (t.propagationStopped) break;
      }
      if (r && !t.defaultPrevented) return r(t, this);
    }),
      (r._signal = function(e, t) {
        var n = (this._eventRegistry || {})[e];
        if (!n) return;
        n = n.slice();
        for (var r = 0; r < n.length; r++) n[r](t, this);
      }),
      (r.once = function(e, t) {
        var n = this;
        t &&
          this.addEventListener(e, function r() {
            n.removeEventListener(e, r), t.apply(null, arguments);
          });
      }),
      (r.setDefaultHandler = function(e, t) {
        var n = this._defaultHandlers;
        n || (n = this._defaultHandlers = { _disabled_: {} });
        if (n[e]) {
          var r = n[e],
            i = n._disabled_[e];
          i || (n._disabled_[e] = i = []), i.push(r);
          var s = i.indexOf(t);
          s != -1 && i.splice(s, 1);
        }
        n[e] = t;
      }),
      (r.removeDefaultHandler = function(e, t) {
        var n = this._defaultHandlers;
        if (!n) return;
        var r = n._disabled_[e];
        if (n[e] == t) {
          var i = n[e];
          r && this.setDefaultHandler(e, r.pop());
        } else if (r) {
          var s = r.indexOf(t);
          s != -1 && r.splice(s, 1);
        }
      }),
      (r.on = r.addEventListener = function(e, t, n) {
        this._eventRegistry = this._eventRegistry || {};
        var r = this._eventRegistry[e];
        return r || (r = this._eventRegistry[e] = []), r.indexOf(t) == -1 && r[n ? 'unshift' : 'push'](t), t;
      }),
      (r.off = r.removeListener = r.removeEventListener = function(e, t) {
        this._eventRegistry = this._eventRegistry || {};
        var n = this._eventRegistry[e];
        if (!n) return;
        var r = n.indexOf(t);
        r !== -1 && n.splice(r, 1);
      }),
      (r.removeAllListeners = function(e) {
        this._eventRegistry && (this._eventRegistry[e] = []);
      }),
      (t.EventEmitter = r);
  }),
  define('ace/anchor', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/lib/event_emitter'], function(e, t, n) {
    'use strict';
    var r = e('./lib/oop'),
      i = e('./lib/event_emitter').EventEmitter,
      s = (t.Anchor = function(e, t, n) {
        (this.$onChange = this.onChange.bind(this)),
          this.attach(e),
          typeof n == 'undefined' ? this.setPosition(t.row, t.column) : this.setPosition(t, n);
      });
    (function() {
      function e(e, t, n) {
        var r = n ? e.column <= t.column : e.column < t.column;
        return e.row < t.row || (e.row == t.row && r);
      }
      function t(t, n, r) {
        var i = t.action == 'insert',
          s = (i ? 1 : -1) * (t.end.row - t.start.row),
          o = (i ? 1 : -1) * (t.end.column - t.start.column),
          u = t.start,
          a = i ? u : t.end;
        return e(n, u, r)
          ? { row: n.row, column: n.column }
          : e(a, n, !r)
          ? { row: n.row + s, column: n.column + (n.row == a.row ? o : 0) }
          : { row: u.row, column: u.column };
      }
      r.implement(this, i),
        (this.getPosition = function() {
          return this.$clipPositionToDocument(this.row, this.column);
        }),
        (this.getDocument = function() {
          return this.document;
        }),
        (this.$insertRight = !1),
        (this.onChange = function(e) {
          if (e.start.row == e.end.row && e.start.row != this.row) return;
          if (e.start.row > this.row) return;
          var n = t(e, { row: this.row, column: this.column }, this.$insertRight);
          this.setPosition(n.row, n.column, !0);
        }),
        (this.setPosition = function(e, t, n) {
          var r;
          n ? (r = { row: e, column: t }) : (r = this.$clipPositionToDocument(e, t));
          if (this.row == r.row && this.column == r.column) return;
          var i = { row: this.row, column: this.column };
          (this.row = r.row), (this.column = r.column), this._signal('change', { old: i, value: r });
        }),
        (this.detach = function() {
          this.document.removeEventListener('change', this.$onChange);
        }),
        (this.attach = function(e) {
          (this.document = e || this.document), this.document.on('change', this.$onChange);
        }),
        (this.$clipPositionToDocument = function(e, t) {
          var n = {};
          return (
            e >= this.document.getLength()
              ? ((n.row = Math.max(0, this.document.getLength() - 1)), (n.column = this.document.getLine(n.row).length))
              : e < 0
              ? ((n.row = 0), (n.column = 0))
              : ((n.row = e), (n.column = Math.min(this.document.getLine(n.row).length, Math.max(0, t)))),
            t < 0 && (n.column = 0),
            n
          );
        });
    }.call(s.prototype));
  }),
  define('ace/document', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/apply_delta',
    'ace/lib/event_emitter',
    'ace/range',
    'ace/anchor'
  ], function(e, t, n) {
    'use strict';
    var r = e('./lib/oop'),
      i = e('./apply_delta').applyDelta,
      s = e('./lib/event_emitter').EventEmitter,
      o = e('./range').Range,
      u = e('./anchor').Anchor,
      a = function(e) {
        (this.$lines = ['']),
          e.length === 0
            ? (this.$lines = [''])
            : Array.isArray(e)
            ? this.insertMergedLines({ row: 0, column: 0 }, e)
            : this.insert({ row: 0, column: 0 }, e);
      };
    (function() {
      r.implement(this, s),
        (this.setValue = function(e) {
          var t = this.getLength() - 1;
          this.remove(new o(0, 0, t, this.getLine(t).length)), this.insert({ row: 0, column: 0 }, e);
        }),
        (this.getValue = function() {
          return this.getAllLines().join(this.getNewLineCharacter());
        }),
        (this.createAnchor = function(e, t) {
          return new u(this, e, t);
        }),
        'aaa'.split(/a/).length === 0
          ? (this.$split = function(e) {
              return e.replace(/\r\n|\r/g, '\n').split('\n');
            })
          : (this.$split = function(e) {
              return e.split(/\r\n|\r|\n/);
            }),
        (this.$detectNewLine = function(e) {
          var t = e.match(/^.*?(\r\n|\r|\n)/m);
          (this.$autoNewLine = t ? t[1] : '\n'), this._signal('changeNewLineMode');
        }),
        (this.getNewLineCharacter = function() {
          switch (this.$newLineMode) {
            case 'windows':
              return '\r\n';
            case 'unix':
              return '\n';
            default:
              return this.$autoNewLine || '\n';
          }
        }),
        (this.$autoNewLine = ''),
        (this.$newLineMode = 'auto'),
        (this.setNewLineMode = function(e) {
          if (this.$newLineMode === e) return;
          (this.$newLineMode = e), this._signal('changeNewLineMode');
        }),
        (this.getNewLineMode = function() {
          return this.$newLineMode;
        }),
        (this.isNewLine = function(e) {
          return e == '\r\n' || e == '\r' || e == '\n';
        }),
        (this.getLine = function(e) {
          return this.$lines[e] || '';
        }),
        (this.getLines = function(e, t) {
          return this.$lines.slice(e, t + 1);
        }),
        (this.getAllLines = function() {
          return this.getLines(0, this.getLength());
        }),
        (this.getLength = function() {
          return this.$lines.length;
        }),
        (this.getTextRange = function(e) {
          return this.getLinesForRange(e).join(this.getNewLineCharacter());
        }),
        (this.getLinesForRange = function(e) {
          var t;
          if (e.start.row === e.end.row) t = [this.getLine(e.start.row).substring(e.start.column, e.end.column)];
          else {
            (t = this.getLines(e.start.row, e.end.row)), (t[0] = (t[0] || '').substring(e.start.column));
            var n = t.length - 1;
            e.end.row - e.start.row == n && (t[n] = t[n].substring(0, e.end.column));
          }
          return t;
        }),
        (this.insertLines = function(e, t) {
          return (
            console.warn('Use of document.insertLines is deprecated. Use the insertFullLines method instead.'),
            this.insertFullLines(e, t)
          );
        }),
        (this.removeLines = function(e, t) {
          return (
            console.warn('Use of document.removeLines is deprecated. Use the removeFullLines method instead.'),
            this.removeFullLines(e, t)
          );
        }),
        (this.insertNewLine = function(e) {
          return (
            console.warn(
              "Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead."
            ),
            this.insertMergedLines(e, ['', ''])
          );
        }),
        (this.insert = function(e, t) {
          return this.getLength() <= 1 && this.$detectNewLine(t), this.insertMergedLines(e, this.$split(t));
        }),
        (this.insertInLine = function(e, t) {
          var n = this.clippedPos(e.row, e.column),
            r = this.pos(e.row, e.column + t.length);
          return this.applyDelta({ start: n, end: r, action: 'insert', lines: [t] }, !0), this.clonePos(r);
        }),
        (this.clippedPos = function(e, t) {
          var n = this.getLength();
          e === undefined ? (e = n) : e < 0 ? (e = 0) : e >= n && ((e = n - 1), (t = undefined));
          var r = this.getLine(e);
          return t == undefined && (t = r.length), (t = Math.min(Math.max(t, 0), r.length)), { row: e, column: t };
        }),
        (this.clonePos = function(e) {
          return { row: e.row, column: e.column };
        }),
        (this.pos = function(e, t) {
          return { row: e, column: t };
        }),
        (this.$clipPosition = function(e) {
          var t = this.getLength();
          return (
            e.row >= t
              ? ((e.row = Math.max(0, t - 1)), (e.column = this.getLine(t - 1).length))
              : ((e.row = Math.max(0, e.row)),
                (e.column = Math.min(Math.max(e.column, 0), this.getLine(e.row).length))),
            e
          );
        }),
        (this.insertFullLines = function(e, t) {
          e = Math.min(Math.max(e, 0), this.getLength());
          var n = 0;
          e < this.getLength()
            ? ((t = t.concat([''])), (n = 0))
            : ((t = [''].concat(t)), e--, (n = this.$lines[e].length)),
            this.insertMergedLines({ row: e, column: n }, t);
        }),
        (this.insertMergedLines = function(e, t) {
          var n = this.clippedPos(e.row, e.column),
            r = { row: n.row + t.length - 1, column: (t.length == 1 ? n.column : 0) + t[t.length - 1].length };
          return this.applyDelta({ start: n, end: r, action: 'insert', lines: t }), this.clonePos(r);
        }),
        (this.remove = function(e) {
          var t = this.clippedPos(e.start.row, e.start.column),
            n = this.clippedPos(e.end.row, e.end.column);
          return (
            this.applyDelta({ start: t, end: n, action: 'remove', lines: this.getLinesForRange({ start: t, end: n }) }),
            this.clonePos(t)
          );
        }),
        (this.removeInLine = function(e, t, n) {
          var r = this.clippedPos(e, t),
            i = this.clippedPos(e, n);
          return (
            this.applyDelta(
              { start: r, end: i, action: 'remove', lines: this.getLinesForRange({ start: r, end: i }) },
              !0
            ),
            this.clonePos(r)
          );
        }),
        (this.removeFullLines = function(e, t) {
          (e = Math.min(Math.max(0, e), this.getLength() - 1)), (t = Math.min(Math.max(0, t), this.getLength() - 1));
          var n = t == this.getLength() - 1 && e > 0,
            r = t < this.getLength() - 1,
            i = n ? e - 1 : e,
            s = n ? this.getLine(i).length : 0,
            u = r ? t + 1 : t,
            a = r ? 0 : this.getLine(u).length,
            f = new o(i, s, u, a),
            l = this.$lines.slice(e, t + 1);
          return this.applyDelta({ start: f.start, end: f.end, action: 'remove', lines: this.getLinesForRange(f) }), l;
        }),
        (this.removeNewLine = function(e) {
          e < this.getLength() - 1 &&
            e >= 0 &&
            this.applyDelta({
              start: this.pos(e, this.getLine(e).length),
              end: this.pos(e + 1, 0),
              action: 'remove',
              lines: ['', '']
            });
        }),
        (this.replace = function(e, t) {
          e instanceof o || (e = o.fromPoints(e.start, e.end));
          if (t.length === 0 && e.isEmpty()) return e.start;
          if (t == this.getTextRange(e)) return e.end;
          this.remove(e);
          var n;
          return t ? (n = this.insert(e.start, t)) : (n = e.start), n;
        }),
        (this.applyDeltas = function(e) {
          for (var t = 0; t < e.length; t++) this.applyDelta(e[t]);
        }),
        (this.revertDeltas = function(e) {
          for (var t = e.length - 1; t >= 0; t--) this.revertDelta(e[t]);
        }),
        (this.applyDelta = function(e, t) {
          var n = e.action == 'insert';
          if (n ? e.lines.length <= 1 && !e.lines[0] : !o.comparePoints(e.start, e.end)) return;
          n && e.lines.length > 2e4
            ? this.$splitAndapplyLargeDelta(e, 2e4)
            : (i(this.$lines, e, t), this._signal('change', e));
        }),
        (this.$splitAndapplyLargeDelta = function(e, t) {
          var n = e.lines,
            r = n.length - t + 1,
            i = e.start.row,
            s = e.start.column;
          for (var o = 0, u = 0; o < r; o = u) {
            u += t - 1;
            var a = n.slice(o, u);
            a.push(''),
              this.applyDelta(
                { start: this.pos(i + o, s), end: this.pos(i + u, (s = 0)), action: e.action, lines: a },
                !0
              );
          }
          (e.lines = n.slice(o)), (e.start.row = i + o), (e.start.column = s), this.applyDelta(e, !0);
        }),
        (this.revertDelta = function(e) {
          this.applyDelta({
            start: this.clonePos(e.start),
            end: this.clonePos(e.end),
            action: e.action == 'insert' ? 'remove' : 'insert',
            lines: e.lines.slice()
          });
        }),
        (this.indexToPosition = function(e, t) {
          var n = this.$lines || this.getAllLines(),
            r = this.getNewLineCharacter().length;
          for (var i = t || 0, s = n.length; i < s; i++) {
            e -= n[i].length + r;
            if (e < 0) return { row: i, column: e + n[i].length + r };
          }
          return { row: s - 1, column: e + n[s - 1].length + r };
        }),
        (this.positionToIndex = function(e, t) {
          var n = this.$lines || this.getAllLines(),
            r = this.getNewLineCharacter().length,
            i = 0,
            s = Math.min(e.row, n.length);
          for (var o = t || 0; o < s; ++o) i += n[o].length + r;
          return i + e.column;
        });
    }.call(a.prototype),
      (t.Document = a));
  }),
  define('ace/lib/lang', ['require', 'exports', 'module'], function(e, t, n) {
    'use strict';
    (t.last = function(e) {
      return e[e.length - 1];
    }),
      (t.stringReverse = function(e) {
        return e
          .split('')
          .reverse()
          .join('');
      }),
      (t.stringRepeat = function(e, t) {
        var n = '';
        while (t > 0) {
          t & 1 && (n += e);
          if ((t >>= 1)) e += e;
        }
        return n;
      });
    var r = /^\s\s*/,
      i = /\s\s*$/;
    (t.stringTrimLeft = function(e) {
      return e.replace(r, '');
    }),
      (t.stringTrimRight = function(e) {
        return e.replace(i, '');
      }),
      (t.copyObject = function(e) {
        var t = {};
        for (var n in e) t[n] = e[n];
        return t;
      }),
      (t.copyArray = function(e) {
        var t = [];
        for (var n = 0, r = e.length; n < r; n++)
          e[n] && typeof e[n] == 'object' ? (t[n] = this.copyObject(e[n])) : (t[n] = e[n]);
        return t;
      }),
      (t.deepCopy = function s(e) {
        if (typeof e != 'object' || !e) return e;
        var t;
        if (Array.isArray(e)) {
          t = [];
          for (var n = 0; n < e.length; n++) t[n] = s(e[n]);
          return t;
        }
        if (Object.prototype.toString.call(e) !== '[object Object]') return e;
        t = {};
        for (var n in e) t[n] = s(e[n]);
        return t;
      }),
      (t.arrayToMap = function(e) {
        var t = {};
        for (var n = 0; n < e.length; n++) t[e[n]] = 1;
        return t;
      }),
      (t.createMap = function(e) {
        var t = Object.create(null);
        for (var n in e) t[n] = e[n];
        return t;
      }),
      (t.arrayRemove = function(e, t) {
        for (var n = 0; n <= e.length; n++) t === e[n] && e.splice(n, 1);
      }),
      (t.escapeRegExp = function(e) {
        return e.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
      }),
      (t.escapeHTML = function(e) {
        return e
          .replace(/&/g, '&#38;')
          .replace(/"/g, '&#34;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&#60;');
      }),
      (t.getMatchOffsets = function(e, t) {
        var n = [];
        return (
          e.replace(t, function(e) {
            n.push({ offset: arguments[arguments.length - 2], length: e.length });
          }),
          n
        );
      }),
      (t.deferredCall = function(e) {
        var t = null,
          n = function() {
            (t = null), e();
          },
          r = function(e) {
            return r.cancel(), (t = setTimeout(n, e || 0)), r;
          };
        return (
          (r.schedule = r),
          (r.call = function() {
            return this.cancel(), e(), r;
          }),
          (r.cancel = function() {
            return clearTimeout(t), (t = null), r;
          }),
          (r.isPending = function() {
            return t;
          }),
          r
        );
      }),
      (t.delayedCall = function(e, t) {
        var n = null,
          r = function() {
            (n = null), e();
          },
          i = function(e) {
            n == null && (n = setTimeout(r, e || t));
          };
        return (
          (i.delay = function(e) {
            n && clearTimeout(n), (n = setTimeout(r, e || t));
          }),
          (i.schedule = i),
          (i.call = function() {
            this.cancel(), e();
          }),
          (i.cancel = function() {
            n && clearTimeout(n), (n = null);
          }),
          (i.isPending = function() {
            return n;
          }),
          i
        );
      });
  }),
  define('ace/worker/mirror', ['require', 'exports', 'module', 'ace/range', 'ace/document', 'ace/lib/lang'], function(
    e,
    t,
    n
  ) {
    'use strict';
    var r = e('../range').Range,
      i = e('../document').Document,
      s = e('../lib/lang'),
      o = (t.Mirror = function(e) {
        this.sender = e;
        var t = (this.doc = new i('')),
          n = (this.deferredUpdate = s.delayedCall(this.onUpdate.bind(this))),
          r = this;
        e.on('change', function(e) {
          var i = e.data;
          if (i[0].start) t.applyDeltas(i);
          else
            for (var s = 0; s < i.length; s += 2) {
              if (Array.isArray(i[s + 1])) var o = { action: 'insert', start: i[s], lines: i[s + 1] };
              else var o = { action: 'remove', start: i[s], end: i[s + 1] };
              t.applyDelta(o, !0);
            }
          if (r.$timeout) return n.schedule(r.$timeout);
          r.onUpdate();
        });
      });
    (function() {
      (this.$timeout = 500),
        (this.setTimeout = function(e) {
          this.$timeout = e;
        }),
        (this.setValue = function(e) {
          this.doc.setValue(e), this.deferredUpdate.schedule(this.$timeout);
        }),
        (this.getValue = function(e) {
          this.sender.callback(this.doc.getValue(), e);
        }),
        (this.onUpdate = function() {}),
        (this.isPending = function() {
          return this.deferredUpdate.isPending();
        });
    }.call(o.prototype));
  }),
  define('ace/mode/javascript/jshint', ['require', 'exports', 'module'], function(e, t, n) {
    n.exports = (function r(t, n, i) {
      function o(u, a) {
        if (!n[u]) {
          if (!t[u]) {
            var f = typeof e == 'function' && e;
            if (!a && f) return f(u, !0);
            if (s) return s(u, !0);
            var l = new Error("Cannot find module '" + u + "'");
            throw ((l.code = 'MODULE_NOT_FOUND'), l);
          }
          var c = (n[u] = { exports: {} });
          t[u][0].call(
            c.exports,
            function(e) {
              var n = t[u][1][e];
              return o(n ? n : e);
            },
            c,
            c.exports,
            r,
            t,
            n,
            i
          );
        }
        return n[u].exports;
      }
      var s = typeof e == 'function' && e;
      for (var u = 0; u < i.length; u++) o(i[u]);
      return o(i[0]);
    })(
      {
        '/node_modules/browserify/node_modules/events/events.js': [
          function(e, t, n) {
            function r() {
              (this._events = this._events || {}), (this._maxListeners = this._maxListeners || undefined);
            }
            function i(e) {
              return typeof e == 'function';
            }
            function s(e) {
              return typeof e == 'number';
            }
            function o(e) {
              return typeof e == 'object' && e !== null;
            }
            function u(e) {
              return e === void 0;
            }
            (t.exports = r),
              (r.EventEmitter = r),
              (r.prototype._events = undefined),
              (r.prototype._maxListeners = undefined),
              (r.defaultMaxListeners = 10),
              (r.prototype.setMaxListeners = function(e) {
                if (!s(e) || e < 0 || isNaN(e)) throw TypeError('n must be a positive number');
                return (this._maxListeners = e), this;
              }),
              (r.prototype.emit = function(e) {
                var t, n, r, s, a, f;
                this._events || (this._events = {});
                if (e === 'error')
                  if (!this._events.error || (o(this._events.error) && !this._events.error.length))
                    throw ((t = arguments[1]),
                    t instanceof Error ? t : TypeError('Uncaught, unspecified "error" event.'));
                n = this._events[e];
                if (u(n)) return !1;
                if (i(n))
                  switch (arguments.length) {
                    case 1:
                      n.call(this);
                      break;
                    case 2:
                      n.call(this, arguments[1]);
                      break;
                    case 3:
                      n.call(this, arguments[1], arguments[2]);
                      break;
                    default:
                      (r = arguments.length), (s = new Array(r - 1));
                      for (a = 1; a < r; a++) s[a - 1] = arguments[a];
                      n.apply(this, s);
                  }
                else if (o(n)) {
                  (r = arguments.length), (s = new Array(r - 1));
                  for (a = 1; a < r; a++) s[a - 1] = arguments[a];
                  (f = n.slice()), (r = f.length);
                  for (a = 0; a < r; a++) f[a].apply(this, s);
                }
                return !0;
              }),
              (r.prototype.addListener = function(e, t) {
                var n;
                if (!i(t)) throw TypeError('listener must be a function');
                this._events || (this._events = {}),
                  this._events.newListener && this.emit('newListener', e, i(t.listener) ? t.listener : t),
                  this._events[e]
                    ? o(this._events[e])
                      ? this._events[e].push(t)
                      : (this._events[e] = [this._events[e], t])
                    : (this._events[e] = t);
                if (o(this._events[e]) && !this._events[e].warned) {
                  var n;
                  u(this._maxListeners) ? (n = r.defaultMaxListeners) : (n = this._maxListeners),
                    n &&
                      n > 0 &&
                      this._events[e].length > n &&
                      ((this._events[e].warned = !0),
                      console.error(
                        '(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.',
                        this._events[e].length
                      ),
                      typeof console.trace == 'function' && console.trace());
                }
                return this;
              }),
              (r.prototype.on = r.prototype.addListener),
              (r.prototype.once = function(e, t) {
                function r() {
                  this.removeListener(e, r), n || ((n = !0), t.apply(this, arguments));
                }
                if (!i(t)) throw TypeError('listener must be a function');
                var n = !1;
                return (r.listener = t), this.on(e, r), this;
              }),
              (r.prototype.removeListener = function(e, t) {
                var n, r, s, u;
                if (!i(t)) throw TypeError('listener must be a function');
                if (!this._events || !this._events[e]) return this;
                (n = this._events[e]), (s = n.length), (r = -1);
                if (n === t || (i(n.listener) && n.listener === t))
                  delete this._events[e], this._events.removeListener && this.emit('removeListener', e, t);
                else if (o(n)) {
                  for (u = s; u-- > 0; )
                    if (n[u] === t || (n[u].listener && n[u].listener === t)) {
                      r = u;
                      break;
                    }
                  if (r < 0) return this;
                  n.length === 1 ? ((n.length = 0), delete this._events[e]) : n.splice(r, 1),
                    this._events.removeListener && this.emit('removeListener', e, t);
                }
                return this;
              }),
              (r.prototype.removeAllListeners = function(e) {
                var t, n;
                if (!this._events) return this;
                if (!this._events.removeListener)
                  return arguments.length === 0 ? (this._events = {}) : this._events[e] && delete this._events[e], this;
                if (arguments.length === 0) {
                  for (t in this._events) {
                    if (t === 'removeListener') continue;
                    this.removeAllListeners(t);
                  }
                  return this.removeAllListeners('removeListener'), (this._events = {}), this;
                }
                n = this._events[e];
                if (i(n)) this.removeListener(e, n);
                else while (n.length) this.removeListener(e, n[n.length - 1]);
                return delete this._events[e], this;
              }),
              (r.prototype.listeners = function(e) {
                var t;
                return (
                  !this._events || !this._events[e]
                    ? (t = [])
                    : i(this._events[e])
                    ? (t = [this._events[e]])
                    : (t = this._events[e].slice()),
                  t
                );
              }),
              (r.listenerCount = function(e, t) {
                var n;
                return !e._events || !e._events[t] ? (n = 0) : i(e._events[t]) ? (n = 1) : (n = e._events[t].length), n;
              });
          },
          {}
        ],
        '/node_modules/jshint/data/ascii-identifier-data.js': [
          function(e, t, n) {
            var r = [];
            for (var i = 0; i < 128; i++) r[i] = i === 36 || (i >= 65 && i <= 90) || i === 95 || (i >= 97 && i <= 122);
            var s = [];
            for (var i = 0; i < 128; i++) s[i] = r[i] || (i >= 48 && i <= 57);
            t.exports = { asciiIdentifierStartTable: r, asciiIdentifierPartTable: s };
          },
          {}
        ],
        '/node_modules/jshint/lodash.js': [
          function(e, t, n) {
            (function(e) {
              (function() {
                function $(e, t, n) {
                  var r = e.length,
                    i = n ? r : -1;
                  while (n ? i-- : ++i < r) if (t(e[i], i, e)) return i;
                  return -1;
                }
                function J(e, t, n) {
                  if (t !== t) return G(e, n);
                  var r = n - 1,
                    i = e.length;
                  while (++r < i) if (e[r] === t) return r;
                  return -1;
                }
                function K(e) {
                  return typeof e == 'function' || !1;
                }
                function Q(e) {
                  return typeof e == 'string' ? e : e == null ? '' : e + '';
                }
                function G(e, t, n) {
                  var r = e.length,
                    i = t + (n ? 0 : -1);
                  while (n ? i-- : ++i < r) {
                    var s = e[i];
                    if (s !== s) return i;
                  }
                  return -1;
                }
                function Y(e) {
                  return !!e && typeof e == 'object';
                }
                function Ct() {}
                function Lt(e, t) {
                  var n = -1,
                    r = e.length;
                  t || (t = Array(r));
                  while (++n < r) t[n] = e[n];
                  return t;
                }
                function At(e, t) {
                  var n = -1,
                    r = e.length;
                  while (++n < r) if (t(e[n], n, e) === !1) break;
                  return e;
                }
                function Ot(e, t) {
                  var n = -1,
                    r = e.length,
                    i = -1,
                    s = [];
                  while (++n < r) {
                    var o = e[n];
                    t(o, n, e) && (s[++i] = o);
                  }
                  return s;
                }
                function Mt(e, t) {
                  var n = -1,
                    r = e.length,
                    i = Array(r);
                  while (++n < r) i[n] = t(e[n], n, e);
                  return i;
                }
                function _t(e) {
                  var t = -1,
                    n = e.length,
                    r = wt;
                  while (++t < n) {
                    var i = e[t];
                    i > r && (r = i);
                  }
                  return r;
                }
                function Dt(e, t) {
                  var n = -1,
                    r = e.length;
                  while (++n < r) if (t(e[n], n, e)) return !0;
                  return !1;
                }
                function Pt(e, t, n) {
                  var i = rr(t);
                  lt.apply(i, bn(t));
                  var s = -1,
                    o = i.length;
                  while (++s < o) {
                    var u = i[s],
                      a = e[u],
                      f = n(a, t[u], u, e, t);
                    if ((f === f ? f !== a : a === a) || (a === r && !(u in e))) e[u] = f;
                  }
                  return e;
                }
                function Bt(e, t, n) {
                  n || (n = {});
                  var r = -1,
                    i = t.length;
                  while (++r < i) {
                    var s = t[r];
                    n[s] = e[s];
                  }
                  return n;
                }
                function jt(e, t, n) {
                  var i = typeof e;
                  return i == 'function'
                    ? t === r
                      ? e
                      : on(e, t, n)
                    : e == null
                    ? lr
                    : i == 'object'
                    ? Jt(e)
                    : t === r
                    ? cr(e)
                    : Kt(e, t);
                }
                function Ft(e, t, n, i, s, u, a) {
                  var f;
                  n && (f = s ? n(e, i, s) : n(e));
                  if (f !== r) return f;
                  if (!Jn(e)) return e;
                  var l = Xn(e);
                  if (l) {
                    f = wn(e);
                    if (!t) return Lt(e, f);
                  } else {
                    var h = rt.call(e),
                      p = h == c;
                    if (!(h == d || h == o || (p && !s))) return F[h] ? Sn(e, h, t) : s ? e : {};
                    f = En(p ? {} : e);
                    if (!t) return Ht(f, e);
                  }
                  u || (u = []), a || (a = []);
                  var v = u.length;
                  while (v--) if (u[v] == e) return a[v];
                  return (
                    u.push(e),
                    a.push(f),
                    (l ? At : zt)(e, function(r, i) {
                      f[i] = Ft(r, t, n, i, e, u, a);
                    }),
                    f
                  );
                }
                function qt(e, t) {
                  var n = [];
                  return (
                    It(e, function(e, r, i) {
                      t(e, r, i) && n.push(e);
                    }),
                    n
                  );
                }
                function Ut(e, t) {
                  return Rt(e, t, ir);
                }
                function zt(e, t) {
                  return Rt(e, t, rr);
                }
                function Wt(e, t, n) {
                  if (e == null) return;
                  n !== r && n in On(e) && (t = [n]);
                  var i = -1,
                    s = t.length;
                  while (e != null && ++i < s) var o = (e = e[t[i]]);
                  return o;
                }
                function Xt(e, t, n, r, i, s) {
                  if (e === t) return e !== 0 || 1 / e == 1 / t;
                  var o = typeof e,
                    u = typeof t;
                  return (o != 'function' && o != 'object' && u != 'function' && u != 'object') ||
                    e == null ||
                    t == null
                    ? e !== e && t !== t
                    : Vt(e, t, Xt, n, r, i, s);
                }
                function Vt(e, t, n, r, i, s, a) {
                  var f = Xn(e),
                    l = Xn(t),
                    c = u,
                    h = u;
                  f || ((c = rt.call(e)), c == o ? (c = d) : c != d && (f = Zn(e))),
                    l || ((h = rt.call(t)), h == o ? (h = d) : h != d && (l = Zn(t)));
                  var p = c == d,
                    v = h == d,
                    m = c == h;
                  if (m && !f && !p) return dn(e, t, c);
                  if (!i) {
                    var g = p && nt.call(e, '__wrapped__'),
                      y = v && nt.call(t, '__wrapped__');
                    if (g || y) return n(g ? e.value() : e, y ? t.value() : t, r, i, s, a);
                  }
                  if (!m) return !1;
                  s || (s = []), a || (a = []);
                  var b = s.length;
                  while (b--) if (s[b] == e) return a[b] == t;
                  s.push(e), a.push(t);
                  var w = (f ? pn : vn)(e, t, n, r, i, s, a);
                  return s.pop(), a.pop(), w;
                }
                function $t(e, t, n, i, s) {
                  var o = -1,
                    u = t.length,
                    a = !s;
                  while (++o < u) if (a && i[o] ? n[o] !== e[t[o]] : !(t[o] in e)) return !1;
                  o = -1;
                  while (++o < u) {
                    var f = t[o],
                      l = e[f],
                      c = n[o];
                    if (a && i[o]) var h = l !== r || f in e;
                    else (h = s ? s(l, c, f) : r), h === r && (h = Xt(c, l, s, !0));
                    if (!h) return !1;
                  }
                  return !0;
                }
                function Jt(e) {
                  var t = rr(e),
                    n = t.length;
                  if (!n) return fr(!0);
                  if (n == 1) {
                    var i = t[0],
                      s = e[i];
                    if (kn(s))
                      return function(e) {
                        return e == null ? !1 : e[i] === s && (s !== r || i in On(e));
                      };
                  }
                  var o = Array(n),
                    u = Array(n);
                  while (n--) (s = e[t[n]]), (o[n] = s), (u[n] = kn(s));
                  return function(e) {
                    return e != null && $t(On(e), t, o, u);
                  };
                }
                function Kt(e, t) {
                  var n = Xn(e),
                    i = Nn(e) && kn(t),
                    s = e + '';
                  return (
                    (e = Mn(e)),
                    function(o) {
                      if (o == null) return !1;
                      var u = s;
                      o = On(o);
                      if ((n || !i) && !(u in o)) {
                        o = e.length == 1 ? o : Wt(o, en(e, 0, -1));
                        if (o == null) return !1;
                        (u = Pn(e)), (o = On(o));
                      }
                      return o[u] === t ? t !== r || u in o : Xt(t, o[u], null, !0);
                    }
                  );
                }
                function Qt(e, t, n, i, s) {
                  if (!Jn(e)) return e;
                  var o = Cn(t.length) && (Xn(t) || Zn(t));
                  if (!o) {
                    var u = rr(t);
                    lt.apply(u, bn(t));
                  }
                  return (
                    At(u || t, function(a, f) {
                      u && ((f = a), (a = t[f]));
                      if (Y(a)) i || (i = []), s || (s = []), Gt(e, t, f, Qt, n, i, s);
                      else {
                        var l = e[f],
                          c = n ? n(l, a, f, e, t) : r,
                          h = c === r;
                        h && (c = a), (o || c !== r) && (h || (c === c ? c !== l : l === l)) && (e[f] = c);
                      }
                    }),
                    e
                  );
                }
                function Gt(e, t, n, i, s, o, u) {
                  var a = o.length,
                    f = t[n];
                  while (a--)
                    if (o[a] == f) {
                      e[n] = u[a];
                      return;
                    }
                  var l = e[n],
                    c = s ? s(l, f, n, e, t) : r,
                    h = c === r;
                  h &&
                    ((c = f),
                    Cn(f.length) && (Xn(f) || Zn(f))
                      ? (c = Xn(l) ? l : yn(l) ? Lt(l) : [])
                      : Gn(f) || Wn(f)
                      ? (c = Wn(l) ? er(l) : Gn(l) ? l : {})
                      : (h = !1)),
                    o.push(f),
                    u.push(c);
                  if (h) e[n] = i(c, f, s, o, u);
                  else if (c === c ? c !== l : l === l) e[n] = c;
                }
                function Yt(e) {
                  return function(t) {
                    return t == null ? r : t[e];
                  };
                }
                function Zt(e) {
                  var t = e + '';
                  return (
                    (e = Mn(e)),
                    function(n) {
                      return Wt(n, e, t);
                    }
                  );
                }
                function en(e, t, n) {
                  var i = -1,
                    s = e.length;
                  (t = t == null ? 0 : +t || 0),
                    t < 0 && (t = -t > s ? 0 : s + t),
                    (n = n === r || n > s ? s : +n || 0),
                    n < 0 && (n += s),
                    (s = t > n ? 0 : (n - t) >>> 0),
                    (t >>>= 0);
                  var o = Array(s);
                  while (++i < s) o[i] = e[i + t];
                  return o;
                }
                function tn(e, t) {
                  var n;
                  return (
                    It(e, function(e, r, i) {
                      return (n = t(e, r, i)), !n;
                    }),
                    !!n
                  );
                }
                function nn(e, t) {
                  var n = -1,
                    r = t.length,
                    i = Array(r);
                  while (++n < r) i[n] = e[t[n]];
                  return i;
                }
                function rn(e, t, n) {
                  var r = 0,
                    i = e ? e.length : r;
                  if (typeof t == 'number' && t === t && i <= xt) {
                    while (r < i) {
                      var s = (r + i) >>> 1,
                        o = e[s];
                      (n ? o <= t : o < t) ? (r = s + 1) : (i = s);
                    }
                    return i;
                  }
                  return sn(e, t, lr, n);
                }
                function sn(e, t, n, i) {
                  t = n(t);
                  var s = 0,
                    o = e ? e.length : 0,
                    u = t !== t,
                    a = t === r;
                  while (s < o) {
                    var f = ut((s + o) / 2),
                      l = n(e[f]),
                      c = l === l;
                    if (u) var h = c || i;
                    else a ? (h = c && (i || l !== r)) : (h = i ? l <= t : l < t);
                    h ? (s = f + 1) : (o = f);
                  }
                  return bt(o, St);
                }
                function on(e, t, n) {
                  if (typeof e != 'function') return lr;
                  if (t === r) return e;
                  switch (n) {
                    case 1:
                      return function(n) {
                        return e.call(t, n);
                      };
                    case 3:
                      return function(n, r, i) {
                        return e.call(t, n, r, i);
                      };
                    case 4:
                      return function(n, r, i, s) {
                        return e.call(t, n, r, i, s);
                      };
                    case 5:
                      return function(n, r, i, s, o) {
                        return e.call(t, n, r, i, s, o);
                      };
                  }
                  return function() {
                    return e.apply(t, arguments);
                  };
                }
                function un(e) {
                  return ot.call(e, 0);
                }
                function an(e) {
                  return Un(function(t, n) {
                    var r = -1,
                      i = t == null ? 0 : n.length,
                      s = i > 2 && n[i - 2],
                      o = i > 2 && n[2],
                      u = i > 1 && n[i - 1];
                    typeof s == 'function'
                      ? ((s = on(s, u, 5)), (i -= 2))
                      : ((s = typeof u == 'function' ? u : null), (i -= s ? 1 : 0)),
                      o && Tn(n[0], n[1], o) && ((s = i < 3 ? null : s), (i = 1));
                    while (++r < i) {
                      var a = n[r];
                      a && e(t, a, s);
                    }
                    return t;
                  });
                }
                function fn(e, t) {
                  return function(n, r) {
                    var i = n ? yn(n) : 0;
                    if (!Cn(i)) return e(n, r);
                    var s = t ? i : -1,
                      o = On(n);
                    while (t ? s-- : ++s < i) if (r(o[s], s, o) === !1) break;
                    return n;
                  };
                }
                function ln(e) {
                  return function(t, n, r) {
                    var i = On(t),
                      s = r(t),
                      o = s.length,
                      u = e ? o : -1;
                    while (e ? u-- : ++u < o) {
                      var a = s[u];
                      if (n(i[a], a, i) === !1) break;
                    }
                    return t;
                  };
                }
                function cn(e) {
                  return function(t, n, r) {
                    return !t || !t.length ? -1 : ((n = mn(n, r, 3)), $(t, n, e));
                  };
                }
                function hn(e, t) {
                  return function(n, i, s) {
                    return typeof i == 'function' && s === r && Xn(n) ? e(n, i) : t(n, on(i, s, 3));
                  };
                }
                function pn(e, t, n, i, s, o, u) {
                  var a = -1,
                    f = e.length,
                    l = t.length,
                    c = !0;
                  if (f != l && !(s && l > f)) return !1;
                  while (c && ++a < f) {
                    var h = e[a],
                      p = t[a];
                    (c = r), i && (c = s ? i(p, h, a) : i(h, p, a));
                    if (c === r)
                      if (s) {
                        var d = l;
                        while (d--) {
                          (p = t[d]), (c = (h && h === p) || n(h, p, i, s, o, u));
                          if (c) break;
                        }
                      } else c = (h && h === p) || n(h, p, i, s, o, u);
                  }
                  return !!c;
                }
                function dn(e, t, n) {
                  switch (n) {
                    case a:
                    case f:
                      return +e == +t;
                    case l:
                      return e.name == t.name && e.message == t.message;
                    case p:
                      return e != +e ? t != +t : e == 0 ? 1 / e == 1 / t : e == +t;
                    case v:
                    case g:
                      return e == t + '';
                  }
                  return !1;
                }
                function vn(e, t, n, i, s, o, u) {
                  var a = rr(e),
                    f = a.length,
                    l = rr(t),
                    c = l.length;
                  if (f != c && !s) return !1;
                  var h = s,
                    p = -1;
                  while (++p < f) {
                    var d = a[p],
                      v = s ? d in t : nt.call(t, d);
                    if (v) {
                      var m = e[d],
                        g = t[d];
                      (v = r),
                        i && (v = s ? i(g, m, d) : i(m, g, d)),
                        v === r && (v = (m && m === g) || n(m, g, i, s, o, u));
                    }
                    if (!v) return !1;
                    h || (h = d == 'constructor');
                  }
                  if (!h) {
                    var y = e.constructor,
                      b = t.constructor;
                    if (
                      y != b &&
                      'constructor' in e &&
                      'constructor' in t &&
                      !(typeof y == 'function' && y instanceof y && typeof b == 'function' && b instanceof b)
                    )
                      return !1;
                  }
                  return !0;
                }
                function mn(e, t, n) {
                  var r = Ct.callback || ar;
                  return (r = r === ar ? jt : r), n ? r(e, t, n) : r;
                }
                function gn(e, t, n) {
                  var r = Ct.indexOf || Dn;
                  return (r = r === Dn ? J : r), e ? r(e, t, n) : r;
                }
                function wn(e) {
                  var t = e.length,
                    n = new e.constructor(t);
                  return (
                    t && typeof e[0] == 'string' && nt.call(e, 'index') && ((n.index = e.index), (n.input = e.input)), n
                  );
                }
                function En(e) {
                  var t = e.constructor;
                  return (typeof t == 'function' && t instanceof t) || (t = Object), new t();
                }
                function Sn(e, t, n) {
                  var r = e.constructor;
                  switch (t) {
                    case b:
                      return un(e);
                    case a:
                    case f:
                      return new r(+e);
                    case w:
                    case E:
                    case S:
                    case x:
                    case T:
                    case N:
                    case C:
                    case k:
                    case L:
                      var i = e.buffer;
                      return new r(n ? un(i) : i, e.byteOffset, e.length);
                    case p:
                    case g:
                      return new r(e);
                    case v:
                      var s = new r(e.source, H.exec(e));
                      s.lastIndex = e.lastIndex;
                  }
                  return s;
                }
                function xn(e, t) {
                  return (e = +e), (t = t == null ? Nt : t), e > -1 && e % 1 == 0 && e < t;
                }
                function Tn(e, t, n) {
                  if (!Jn(n)) return !1;
                  var r = typeof t;
                  if (r == 'number')
                    var i = yn(n),
                      s = Cn(i) && xn(t, i);
                  else s = r == 'string' && t in n;
                  if (s) {
                    var o = n[t];
                    return e === e ? e === o : o !== o;
                  }
                  return !1;
                }
                function Nn(e, t) {
                  var n = typeof e;
                  if ((n == 'string' && O.test(e)) || n == 'number') return !0;
                  if (Xn(e)) return !1;
                  var r = !A.test(e);
                  return r || (t != null && e in On(t));
                }
                function Cn(e) {
                  return typeof e == 'number' && e > -1 && e % 1 == 0 && e <= Nt;
                }
                function kn(e) {
                  return e === e && (e === 0 ? 1 / e > 0 : !Jn(e));
                }
                function Ln(e) {
                  var t,
                    n = Ct.support;
                  if (
                    !Y(e) ||
                    rt.call(e) != d ||
                    (!nt.call(e, 'constructor') && ((t = e.constructor), typeof t == 'function' && !(t instanceof t)))
                  )
                    return !1;
                  var i;
                  return (
                    Ut(e, function(e, t) {
                      i = t;
                    }),
                    i === r || nt.call(e, i)
                  );
                }
                function An(e) {
                  var t = ir(e),
                    n = t.length,
                    r = n && e.length,
                    i = Ct.support,
                    s = r && Cn(r) && (Xn(e) || (i.nonEnumArgs && Wn(e))),
                    o = -1,
                    u = [];
                  while (++o < n) {
                    var a = t[o];
                    ((s && xn(a, r)) || nt.call(e, a)) && u.push(a);
                  }
                  return u;
                }
                function On(e) {
                  return Jn(e) ? e : Object(e);
                }
                function Mn(e) {
                  if (Xn(e)) return e;
                  var t = [];
                  return (
                    Q(e).replace(M, function(e, n, r, i) {
                      t.push(r ? i.replace(P, '$1') : n || e);
                    }),
                    t
                  );
                }
                function Dn(e, t, n) {
                  var r = e ? e.length : 0;
                  if (!r) return -1;
                  if (typeof n == 'number') n = n < 0 ? yt(r + n, 0) : n;
                  else if (n) {
                    var i = rn(e, t),
                      s = e[i];
                    return (t === t ? t === s : s !== s) ? i : -1;
                  }
                  return J(e, t, n || 0);
                }
                function Pn(e) {
                  var t = e ? e.length : 0;
                  return t ? e[t - 1] : r;
                }
                function Hn(e, t, n) {
                  var r = e ? e.length : 0;
                  return r ? (n && typeof n != 'number' && Tn(e, t, n) && ((t = 0), (n = r)), en(e, t, n)) : [];
                }
                function Bn(e) {
                  var t = -1,
                    n = (e && e.length && _t(Mt(e, yn))) >>> 0,
                    r = Array(n);
                  while (++t < n) r[t] = Mt(e, Yt(t));
                  return r;
                }
                function In(e, t, n, r) {
                  var i = e ? yn(e) : 0;
                  return (
                    Cn(i) || ((e = or(e)), (i = e.length)),
                    i
                      ? (typeof n != 'number' || (r && Tn(t, n, r)) ? (n = 0) : (n = n < 0 ? yt(i + n, 0) : n || 0),
                        typeof e == 'string' || (!Xn(e) && Yn(e)) ? n < i && e.indexOf(t, n) > -1 : gn(e, t, n) > -1)
                      : !1
                  );
                }
                function qn(e, t, n) {
                  var r = Xn(e) ? Ot : qt;
                  return (
                    (t = mn(t, n, 3)),
                    r(e, function(e, n, r) {
                      return !t(e, n, r);
                    })
                  );
                }
                function Rn(e, t, n) {
                  var i = Xn(e) ? Dt : tn;
                  n && Tn(e, t, n) && (t = null);
                  if (typeof t != 'function' || n !== r) t = mn(t, n, 3);
                  return i(e, t);
                }
                function Un(e, t) {
                  if (typeof e != 'function') throw new TypeError(s);
                  return (
                    (t = yt(t === r ? e.length - 1 : +t || 0, 0)),
                    function() {
                      var n = arguments,
                        r = -1,
                        i = yt(n.length - t, 0),
                        s = Array(i);
                      while (++r < i) s[r] = n[t + r];
                      switch (t) {
                        case 0:
                          return e.call(this, s);
                        case 1:
                          return e.call(this, n[0], s);
                        case 2:
                          return e.call(this, n[0], n[1], s);
                      }
                      var o = Array(t + 1);
                      r = -1;
                      while (++r < t) o[r] = n[r];
                      return (o[t] = s), e.apply(this, o);
                    }
                  );
                }
                function zn(e, t, n, r) {
                  return (
                    t && typeof t != 'boolean' && Tn(e, t, n)
                      ? (t = !1)
                      : typeof t == 'function' && ((r = n), (n = t), (t = !1)),
                    (n = typeof n == 'function' && on(n, r, 1)),
                    Ft(e, t, n)
                  );
                }
                function Wn(e) {
                  var t = Y(e) ? e.length : r;
                  return Cn(t) && rt.call(e) == o;
                }
                function Vn(e) {
                  if (e == null) return !0;
                  var t = yn(e);
                  return Cn(t) && (Xn(e) || Yn(e) || Wn(e) || (Y(e) && $n(e.splice))) ? !t : !rr(e).length;
                }
                function Jn(e) {
                  var t = typeof e;
                  return t == 'function' || (!!e && t == 'object');
                }
                function Kn(e) {
                  return e == null ? !1 : rt.call(e) == c ? it.test(tt.call(e)) : Y(e) && B.test(e);
                }
                function Qn(e) {
                  return typeof e == 'number' || (Y(e) && rt.call(e) == p);
                }
                function Yn(e) {
                  return typeof e == 'string' || (Y(e) && rt.call(e) == g);
                }
                function Zn(e) {
                  return Y(e) && Cn(e.length) && !!j[rt.call(e)];
                }
                function er(e) {
                  return Bt(e, ir(e));
                }
                function nr(e, t) {
                  if (e == null) return !1;
                  var n = nt.call(e, t);
                  return (
                    !n &&
                      !Nn(t) &&
                      ((t = Mn(t)),
                      (e = t.length == 1 ? e : Wt(e, en(t, 0, -1))),
                      (t = Pn(t)),
                      (n = e != null && nt.call(e, t))),
                    n
                  );
                }
                function ir(e) {
                  if (e == null) return [];
                  Jn(e) || (e = Object(e));
                  var t = e.length;
                  t = (t && Cn(t) && (Xn(e) || (kt.nonEnumArgs && Wn(e))) && t) || 0;
                  var n = e.constructor,
                    r = -1,
                    i = typeof n == 'function' && n.prototype === e,
                    s = Array(t),
                    o = t > 0;
                  while (++r < t) s[r] = r + '';
                  for (var u in e) (!o || !xn(u, t)) && (u != 'constructor' || (!i && !!nt.call(e, u))) && s.push(u);
                  return s;
                }
                function or(e) {
                  return nn(e, rr(e));
                }
                function ur(e) {
                  return (e = Q(e)), e && D.test(e) ? e.replace(_, '\\$&') : e;
                }
                function ar(e, t, n) {
                  return n && Tn(e, t, n) && (t = null), jt(e, t);
                }
                function fr(e) {
                  return function() {
                    return e;
                  };
                }
                function lr(e) {
                  return e;
                }
                function cr(e) {
                  return Nn(e) ? Yt(e) : Zt(e);
                }
                var r,
                  i = '3.7.0',
                  s = 'Expected a function',
                  o = '[object Arguments]',
                  u = '[object Array]',
                  a = '[object Boolean]',
                  f = '[object Date]',
                  l = '[object Error]',
                  c = '[object Function]',
                  h = '[object Map]',
                  p = '[object Number]',
                  d = '[object Object]',
                  v = '[object RegExp]',
                  m = '[object Set]',
                  g = '[object String]',
                  y = '[object WeakMap]',
                  b = '[object ArrayBuffer]',
                  w = '[object Float32Array]',
                  E = '[object Float64Array]',
                  S = '[object Int8Array]',
                  x = '[object Int16Array]',
                  T = '[object Int32Array]',
                  N = '[object Uint8Array]',
                  C = '[object Uint8ClampedArray]',
                  k = '[object Uint16Array]',
                  L = '[object Uint32Array]',
                  A = /\.|\[(?:[^[\]]+|(["'])(?:(?!\1)[^\n\\]|\\.)*?)\1\]/,
                  O = /^\w*$/,
                  M = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
                  _ = /[.*+?^${}()|[\]\/\\]/g,
                  D = RegExp(_.source),
                  P = /\\(\\)?/g,
                  H = /\w*$/,
                  B = /^\[object .+?Constructor\]$/,
                  j = {};
                (j[w] = j[E] = j[S] = j[x] = j[T] = j[N] = j[C] = j[k] = j[L] = !0),
                  (j[o] = j[u] = j[b] = j[a] = j[f] = j[l] = j[c] = j[h] = j[p] = j[d] = j[v] = j[m] = j[g] = j[
                    y
                  ] = !1);
                var F = {};
                (F[o] = F[u] = F[b] = F[a] = F[f] = F[w] = F[E] = F[S] = F[x] = F[T] = F[p] = F[d] = F[v] = F[g] = F[
                  N
                ] = F[C] = F[k] = F[L] = !0),
                  (F[l] = F[c] = F[h] = F[m] = F[y] = !1);
                var I = { function: !0, object: !0 },
                  q = I[typeof n] && n && !n.nodeType && n,
                  R = I[typeof t] && t && !t.nodeType && t,
                  U = q && R && typeof e == 'object' && e && e.Object && e,
                  z = I[typeof self] && self && self.Object && self,
                  W = I[typeof window] && window && window.Object && window,
                  X = R && R.exports === q && q,
                  V = U || (W !== (this && this.window) && W) || z || this,
                  Z = Array.prototype,
                  et = Object.prototype,
                  tt = Function.prototype.toString,
                  nt = et.hasOwnProperty,
                  rt = et.toString,
                  it = RegExp('^' + ur(rt).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'),
                  st = Kn((st = V.ArrayBuffer)) && st,
                  ot = Kn((ot = st && new st(0).slice)) && ot,
                  ut = Math.floor,
                  at = Kn((at = Object.getOwnPropertySymbols)) && at,
                  ft = Kn((ft = Object.getPrototypeOf)) && ft,
                  lt = Z.push,
                  ct = Kn((Object.preventExtensions = Object.preventExtensions)) && ct,
                  ht = et.propertyIsEnumerable,
                  pt = Kn((pt = V.Uint8Array)) && pt,
                  dt = (function() {
                    try {
                      var e = Kn((e = V.Float64Array)) && e,
                        t = new e(new st(10), 0, 1) && e;
                    } catch (n) {}
                    return t;
                  })(),
                  vt = (function() {
                    var e = { 1: 0 },
                      t = ct && Kn((t = Object.assign)) && t;
                    try {
                      t(ct(e), 'xo');
                    } catch (n) {}
                    return !e[1] && t;
                  })(),
                  mt = Kn((mt = Array.isArray)) && mt,
                  gt = Kn((gt = Object.keys)) && gt,
                  yt = Math.max,
                  bt = Math.min,
                  wt = Number.NEGATIVE_INFINITY,
                  Et = Math.pow(2, 32) - 1,
                  St = Et - 1,
                  xt = Et >>> 1,
                  Tt = dt ? dt.BYTES_PER_ELEMENT : 0,
                  Nt = Math.pow(2, 53) - 1,
                  kt = (Ct.support = {});
                (function(e) {
                  var t = function() {
                      this.x = e;
                    },
                    n = { 0: e, length: e },
                    r = [];
                  t.prototype = { valueOf: e, y: e };
                  for (var i in new t()) r.push(i);
                  (kt.funcDecomp = /\bthis\b/.test(function() {
                    return this;
                  })),
                    (kt.funcNames = typeof Function.name == 'string');
                  try {
                    kt.nonEnumArgs = !ht.call(arguments, 1);
                  } catch (s) {
                    kt.nonEnumArgs = !0;
                  }
                })(1, 0);
                var Ht =
                    vt ||
                    function(e, t) {
                      return t == null ? e : Bt(t, bn(t), Bt(t, rr(t), e));
                    },
                  It = fn(zt),
                  Rt = ln();
                ot ||
                  (un =
                    !st || !pt
                      ? fr(null)
                      : function(e) {
                          var t = e.byteLength,
                            n = dt ? ut(t / Tt) : 0,
                            r = n * Tt,
                            i = new st(t);
                          if (n) {
                            var s = new dt(i, 0, n);
                            s.set(new dt(e, 0, n));
                          }
                          return t != r && ((s = new pt(i, r)), s.set(new pt(e, r))), i;
                        });
                var yn = Yt('length'),
                  bn = at
                    ? function(e) {
                        return at(On(e));
                      }
                    : fr([]),
                  _n = cn(!0),
                  jn = Un(Bn),
                  Fn = hn(At, It),
                  Xn =
                    mt ||
                    function(e) {
                      return Y(e) && Cn(e.length) && rt.call(e) == u;
                    },
                  $n =
                    K(/x/) || (pt && !K(pt))
                      ? function(e) {
                          return rt.call(e) == c;
                        }
                      : K,
                  Gn = ft
                    ? function(e) {
                        if (!e || rt.call(e) != d) return !1;
                        var t = e.valueOf,
                          n = Kn(t) && (n = ft(t)) && ft(n);
                        return n ? e == n || ft(e) == n : Ln(e);
                      }
                    : Ln,
                  tr = an(function(e, t, n) {
                    return n ? Pt(e, t, n) : Ht(e, t);
                  }),
                  rr = gt
                    ? function(e) {
                        if (e)
                          var t = e.constructor,
                            n = e.length;
                        return (typeof t == 'function' && t.prototype === e) || (typeof e != 'function' && Cn(n))
                          ? An(e)
                          : Jn(e)
                          ? gt(e)
                          : [];
                      }
                    : An,
                  sr = an(Qt);
                (Ct.assign = tr),
                  (Ct.callback = ar),
                  (Ct.constant = fr),
                  (Ct.forEach = Fn),
                  (Ct.keys = rr),
                  (Ct.keysIn = ir),
                  (Ct.merge = sr),
                  (Ct.property = cr),
                  (Ct.reject = qn),
                  (Ct.restParam = Un),
                  (Ct.slice = Hn),
                  (Ct.toPlainObject = er),
                  (Ct.unzip = Bn),
                  (Ct.values = or),
                  (Ct.zip = jn),
                  (Ct.each = Fn),
                  (Ct.extend = tr),
                  (Ct.iteratee = ar),
                  (Ct.clone = zn),
                  (Ct.escapeRegExp = ur),
                  (Ct.findLastIndex = _n),
                  (Ct.has = nr),
                  (Ct.identity = lr),
                  (Ct.includes = In),
                  (Ct.indexOf = Dn),
                  (Ct.isArguments = Wn),
                  (Ct.isArray = Xn),
                  (Ct.isEmpty = Vn),
                  (Ct.isFunction = $n),
                  (Ct.isNative = Kn),
                  (Ct.isNumber = Qn),
                  (Ct.isObject = Jn),
                  (Ct.isPlainObject = Gn),
                  (Ct.isString = Yn),
                  (Ct.isTypedArray = Zn),
                  (Ct.last = Pn),
                  (Ct.some = Rn),
                  (Ct.any = Rn),
                  (Ct.contains = In),
                  (Ct.include = In),
                  (Ct.VERSION = i),
                  q && R ? (X ? ((R.exports = Ct)._ = Ct) : (q._ = Ct)) : (V._ = Ct);
              }.call(this));
            }.call(
              this,
              typeof global != 'undefined'
                ? global
                : typeof self != 'undefined'
                ? self
                : typeof window != 'undefined'
                ? window
                : {}
            ));
          },
          {}
        ],
        '/node_modules/jshint/src/jshint.js': [
          function(e, t, n) {
            var r = e('../lodash'),
              i = e('events'),
              s = e('./vars.js'),
              o = e('./messages.js'),
              u = e('./lex.js').Lexer,
              a = e('./reg.js'),
              f = e('./state.js').state,
              l = e('./style.js'),
              c = e('./options.js'),
              h = e('./scope-manager.js'),
              p = (function() {
                'use strict';
                function k(e, t) {
                  return (
                    (e = e.trim()),
                    /^[+-]W\d{3}$/g.test(e)
                      ? !0
                      : c.validNames.indexOf(e) === -1 && t.type !== 'jslint' && !r.has(c.removed, e)
                      ? (q('E001', t, e), !1)
                      : !0
                  );
                }
                function L(e) {
                  return Object.prototype.toString.call(e) === '[object String]';
                }
                function A(e, t) {
                  return e ? (!e.identifier || e.value !== t ? !1 : !0) : !1;
                }
                function O(e) {
                  if (!e.reserved) return !1;
                  var t = e.meta;
                  if (t && t.isFutureReservedWord && f.inES5()) {
                    if (!t.es5) return !1;
                    if (t.strictOnly && !f.option.strict && !f.isStrict()) return !1;
                    if (e.isProperty) return !1;
                  }
                  return !0;
                }
                function M(e, t) {
                  return e.replace(/\{([^{}]*)\}/g, function(e, n) {
                    var r = t[n];
                    return typeof r == 'string' || typeof r == 'number' ? r : e;
                  });
                }
                function D(e, t) {
                  Object.keys(t).forEach(function(n) {
                    if (r.has(p.blacklist, n)) return;
                    e[n] = t[n];
                  });
                }
                function P() {
                  if (f.option.enforceall) {
                    for (var e in c.bool.enforcing)
                      f.option[e] === undefined && !c.noenforceall[e] && (f.option[e] = !0);
                    for (var t in c.bool.relaxing) f.option[t] === undefined && (f.option[t] = !1);
                  }
                }
                function H() {
                  P(),
                    !f.option.esversion &&
                      !f.option.moz &&
                      (f.option.es3
                        ? (f.option.esversion = 3)
                        : f.option.esnext
                        ? (f.option.esversion = 6)
                        : (f.option.esversion = 5)),
                    f.inES5() && D(S, s.ecmaIdentifiers[5]),
                    f.inES6() && D(S, s.ecmaIdentifiers[6]),
                    f.option.module &&
                      (f.option.strict === !0 && (f.option.strict = 'global'),
                      f.inES6() || F('W134', f.tokens.next, 'module', 6)),
                    f.option.couch && D(S, s.couch),
                    f.option.qunit && D(S, s.qunit),
                    f.option.rhino && D(S, s.rhino),
                    f.option.shelljs && (D(S, s.shelljs), D(S, s.node)),
                    f.option.typed && D(S, s.typed),
                    f.option.phantom && (D(S, s.phantom), f.option.strict === !0 && (f.option.strict = 'global')),
                    f.option.prototypejs && D(S, s.prototypejs),
                    f.option.node &&
                      (D(S, s.node), D(S, s.typed), f.option.strict === !0 && (f.option.strict = 'global')),
                    f.option.devel && D(S, s.devel),
                    f.option.dojo && D(S, s.dojo),
                    f.option.browser && (D(S, s.browser), D(S, s.typed)),
                    f.option.browserify &&
                      (D(S, s.browser),
                      D(S, s.typed),
                      D(S, s.browserify),
                      f.option.strict === !0 && (f.option.strict = 'global')),
                    f.option.nonstandard && D(S, s.nonstandard),
                    f.option.jasmine && D(S, s.jasmine),
                    f.option.jquery && D(S, s.jquery),
                    f.option.mootools && D(S, s.mootools),
                    f.option.worker && D(S, s.worker),
                    f.option.wsh && D(S, s.wsh),
                    f.option.globalstrict && f.option.strict !== !1 && (f.option.strict = 'global'),
                    f.option.yui && D(S, s.yui),
                    f.option.mocha && D(S, s.mocha);
                }
                function B(e, t, n) {
                  var r = Math.floor((t / f.lines.length) * 100),
                    i = o.errors[e].desc;
                  throw {
                    name: 'JSHintError',
                    line: t,
                    character: n,
                    message: i + ' (' + r + '% scanned).',
                    raw: i,
                    code: e
                  };
                }
                function j() {
                  var e = f.ignoredLines;
                  if (r.isEmpty(e)) return;
                  p.errors = r.reject(p.errors, function(t) {
                    return e[t.line];
                  });
                }
                function F(e, t, n, r, i, s) {
                  var u, a, l, c;
                  if (/^W\d{3}$/.test(e)) {
                    if (f.ignored[e]) return;
                    c = o.warnings[e];
                  } else /E\d{3}/.test(e) ? (c = o.errors[e]) : /I\d{3}/.test(e) && (c = o.info[e]);
                  return (
                    (t = t || f.tokens.next || {}),
                    t.id === '(end)' && (t = f.tokens.curr),
                    (a = t.line || 0),
                    (u = t.from || 0),
                    (l = {
                      id: '(error)',
                      raw: c.desc,
                      code: c.code,
                      evidence: f.lines[a - 1] || '',
                      line: a,
                      character: u,
                      scope: p.scope,
                      a: n,
                      b: r,
                      c: i,
                      d: s
                    }),
                    (l.reason = M(c.desc, l)),
                    p.errors.push(l),
                    j(),
                    p.errors.length >= f.option.maxerr && B('E043', a, u),
                    l
                  );
                }
                function I(e, t, n, r, i, s, o) {
                  return F(e, { line: t, from: n }, r, i, s, o);
                }
                function q(e, t, n, r, i, s) {
                  F(e, t, n, r, i, s);
                }
                function R(e, t, n, r, i, s, o) {
                  return q(e, { line: t, from: n }, r, i, s, o);
                }
                function U(e, t) {
                  var n;
                  return (n = { id: '(internal)', elem: e, value: t }), p.internals.push(n), n;
                }
                function z() {
                  var e = f.tokens.next,
                    t = e.body.match(/(-\s+)?[^\s,:]+(?:\s*:\s*(-\s+)?[^\s,]+)?/g) || [],
                    i = {};
                  if (e.type === 'globals') {
                    t.forEach(function(n, r) {
                      n = n.split(':');
                      var s = (n[0] || '').trim(),
                        o = (n[1] || '').trim();
                      if (s === '-' || !s.length) {
                        if (r > 0 && r === t.length - 1) return;
                        q('E002', e);
                        return;
                      }
                      s.charAt(0) === '-'
                        ? ((s = s.slice(1)), (o = !1), (p.blacklist[s] = s), delete S[s])
                        : (i[s] = o === 'true');
                    }),
                      D(S, i);
                    for (var s in i) r.has(i, s) && (n[s] = e);
                  }
                  e.type === 'exported' &&
                    t.forEach(function(n, r) {
                      if (!n.length) {
                        if (r > 0 && r === t.length - 1) return;
                        q('E002', e);
                        return;
                      }
                      f.funct['(scope)'].addExported(n);
                    }),
                    e.type === 'members' &&
                      ((E = E || {}),
                      t.forEach(function(e) {
                        var t = e.charAt(0),
                          n = e.charAt(e.length - 1);
                        t === n && (t === '"' || t === "'") && (e = e.substr(1, e.length - 2).replace('\\"', '"')),
                          (E[e] = !1);
                      }));
                  var o = ['maxstatements', 'maxparams', 'maxdepth', 'maxcomplexity', 'maxerr', 'maxlen', 'indent'];
                  if (e.type === 'jshint' || e.type === 'jslint')
                    t.forEach(function(t) {
                      t = t.split(':');
                      var n = (t[0] || '').trim(),
                        i = (t[1] || '').trim();
                      if (!k(n, e)) return;
                      if (o.indexOf(n) >= 0) {
                        if (i !== 'false') {
                          i = +i;
                          if (typeof i != 'number' || !isFinite(i) || i <= 0 || Math.floor(i) !== i) {
                            q('E032', e, t[1].trim());
                            return;
                          }
                          f.option[n] = i;
                        } else f.option[n] = n === 'indent' ? 4 : !1;
                        return;
                      }
                      if (n === 'validthis') {
                        if (f.funct['(global)']) return void q('E009');
                        if (i !== 'true' && i !== 'false') return void q('E002', e);
                        f.option.validthis = i === 'true';
                        return;
                      }
                      if (n === 'quotmark') {
                        switch (i) {
                          case 'true':
                          case 'false':
                            f.option.quotmark = i === 'true';
                            break;
                          case 'double':
                          case 'single':
                            f.option.quotmark = i;
                            break;
                          default:
                            q('E002', e);
                        }
                        return;
                      }
                      if (n === 'shadow') {
                        switch (i) {
                          case 'true':
                            f.option.shadow = !0;
                            break;
                          case 'outer':
                            f.option.shadow = 'outer';
                            break;
                          case 'false':
                          case 'inner':
                            f.option.shadow = 'inner';
                            break;
                          default:
                            q('E002', e);
                        }
                        return;
                      }
                      if (n === 'unused') {
                        switch (i) {
                          case 'true':
                            f.option.unused = !0;
                            break;
                          case 'false':
                            f.option.unused = !1;
                            break;
                          case 'vars':
                          case 'strict':
                            f.option.unused = i;
                            break;
                          default:
                            q('E002', e);
                        }
                        return;
                      }
                      if (n === 'latedef') {
                        switch (i) {
                          case 'true':
                            f.option.latedef = !0;
                            break;
                          case 'false':
                            f.option.latedef = !1;
                            break;
                          case 'nofunc':
                            f.option.latedef = 'nofunc';
                            break;
                          default:
                            q('E002', e);
                        }
                        return;
                      }
                      if (n === 'ignore') {
                        switch (i) {
                          case 'line':
                            (f.ignoredLines[e.line] = !0), j();
                            break;
                          default:
                            q('E002', e);
                        }
                        return;
                      }
                      if (n === 'strict') {
                        switch (i) {
                          case 'true':
                            f.option.strict = !0;
                            break;
                          case 'false':
                            f.option.strict = !1;
                            break;
                          case 'func':
                          case 'global':
                          case 'implied':
                            f.option.strict = i;
                            break;
                          default:
                            q('E002', e);
                        }
                        return;
                      }
                      n === 'module' && (zt(f.funct) || q('E055', f.tokens.next, 'module'));
                      var s = { es3: 3, es5: 5, esnext: 6 };
                      if (r.has(s, n)) {
                        switch (i) {
                          case 'true':
                            (f.option.moz = !1), (f.option.esversion = s[n]);
                            break;
                          case 'false':
                            f.option.moz || (f.option.esversion = 5);
                            break;
                          default:
                            q('E002', e);
                        }
                        return;
                      }
                      if (n === 'esversion') {
                        switch (i) {
                          case '5':
                            f.inES5(!0) && F('I003');
                          case '3':
                          case '6':
                            (f.option.moz = !1), (f.option.esversion = +i);
                            break;
                          case '2015':
                            (f.option.moz = !1), (f.option.esversion = 6);
                            break;
                          default:
                            q('E002', e);
                        }
                        zt(f.funct) || q('E055', f.tokens.next, 'esversion');
                        return;
                      }
                      var u = /^([+-])(W\d{3})$/g.exec(n);
                      if (u) {
                        f.ignored[u[2]] = u[1] === '-';
                        return;
                      }
                      var a;
                      if (i === 'true' || i === 'false') {
                        e.type === 'jslint'
                          ? ((a = c.renamed[n] || n),
                            (f.option[a] = i === 'true'),
                            c.inverted[a] !== undefined && (f.option[a] = !f.option[a]))
                          : (f.option[n] = i === 'true'),
                          n === 'newcap' && (f.option['(explicitNewcap)'] = !0);
                        return;
                      }
                      q('E002', e);
                    }),
                      H();
                }
                function W(e) {
                  var t = e || 0,
                    n = y.length,
                    r;
                  if (t < n) return y[t];
                  while (n <= t) (r = y[n]), r || (r = y[n] = b.token()), (n += 1);
                  return !r && f.tokens.next.id === '(end)' ? f.tokens.next : r;
                }
                function X() {
                  var e = 0,
                    t;
                  do t = W(e++);
                  while (t.id === '(endline)');
                  return t;
                }
                function V(e, t) {
                  switch (f.tokens.curr.id) {
                    case '(number)':
                      f.tokens.next.id === '.' && F('W005', f.tokens.curr);
                      break;
                    case '-':
                      (f.tokens.next.id === '-' || f.tokens.next.id === '--') && F('W006');
                      break;
                    case '+':
                      (f.tokens.next.id === '+' || f.tokens.next.id === '++') && F('W007');
                  }
                  e &&
                    f.tokens.next.id !== e &&
                    (t
                      ? f.tokens.next.id === '(end)'
                        ? q('E019', t, t.id)
                        : q('E020', f.tokens.next, e, t.id, t.line, f.tokens.next.value)
                      : (f.tokens.next.type !== '(identifier)' || f.tokens.next.value !== e) &&
                        F('W116', f.tokens.next, e, f.tokens.next.value)),
                    (f.tokens.prev = f.tokens.curr),
                    (f.tokens.curr = f.tokens.next);
                  for (;;) {
                    (f.tokens.next = y.shift() || b.token()), f.tokens.next || B('E041', f.tokens.curr.line);
                    if (f.tokens.next.id === '(end)' || f.tokens.next.id === '(error)') return;
                    f.tokens.next.check && f.tokens.next.check();
                    if (f.tokens.next.isSpecial)
                      f.tokens.next.type === 'falls through' ? (f.tokens.curr.caseFallsThrough = !0) : z();
                    else if (f.tokens.next.id !== '(endline)') break;
                  }
                }
                function $(e) {
                  return e.infix || (!e.identifier && !e.template && !!e.led);
                }
                function J() {
                  var e = f.tokens.curr,
                    t = f.tokens.next;
                  return t.id === ';' || t.id === '}' || t.id === ':'
                    ? !0
                    : $(t) === $(e) || (e.id === 'yield' && f.inMoz())
                    ? e.line !== G(t)
                    : !1;
                }
                function K(e) {
                  return !e.left && e.arity !== 'unary';
                }
                function Q(e, t) {
                  var n,
                    i = !1,
                    s = !1,
                    o = !1;
                  f.nameStack.push(),
                    !t &&
                      f.tokens.next.value === 'let' &&
                      W(0).value === '(' &&
                      (f.inMoz() || F('W118', f.tokens.next, 'let expressions'),
                      (o = !0),
                      f.funct['(scope)'].stack(),
                      V('let'),
                      V('('),
                      f.tokens.prev.fud(),
                      V(')')),
                    f.tokens.next.id === '(end)' && q('E006', f.tokens.curr);
                  var u =
                    f.option.asi &&
                    f.tokens.prev.line !== G(f.tokens.curr) &&
                    r.contains([']', ')'], f.tokens.prev.id) &&
                    r.contains(['[', '('], f.tokens.curr.id);
                  u && F('W014', f.tokens.curr, f.tokens.curr.id),
                    V(),
                    t && ((f.funct['(verb)'] = f.tokens.curr.value), (f.tokens.curr.beginsStmt = !0));
                  if (t === !0 && f.tokens.curr.fud) n = f.tokens.curr.fud();
                  else {
                    f.tokens.curr.nud ? (n = f.tokens.curr.nud()) : q('E030', f.tokens.curr, f.tokens.curr.id);
                    while ((e < f.tokens.next.lbp || f.tokens.next.type === '(template)') && !J())
                      (i = f.tokens.curr.value === 'Array'),
                        (s = f.tokens.curr.value === 'Object'),
                        n &&
                          (n.value || (n.first && n.first.value)) &&
                          (n.value !== 'new' || (n.first && n.first.value && n.first.value === '.')) &&
                          ((i = !1), n.value !== f.tokens.curr.value && (s = !1)),
                        V(),
                        i && f.tokens.curr.id === '(' && f.tokens.next.id === ')' && F('W009', f.tokens.curr),
                        s && f.tokens.curr.id === '(' && f.tokens.next.id === ')' && F('W010', f.tokens.curr),
                        n && f.tokens.curr.led
                          ? (n = f.tokens.curr.led(n))
                          : q('E033', f.tokens.curr, f.tokens.curr.id);
                  }
                  return o && f.funct['(scope)'].unstack(), f.nameStack.pop(), n;
                }
                function G(e) {
                  return e.startLine || e.line;
                }
                function Y(e, t) {
                  (e = e || f.tokens.curr),
                    (t = t || f.tokens.next),
                    !f.option.laxbreak && e.line !== G(t) && F('W014', t, t.value);
                }
                function Z(e) {
                  (e = e || f.tokens.curr), e.line !== G(f.tokens.next) && F('E022', e, e.value);
                }
                function et(e, t) {
                  e.line !== G(t) &&
                    (f.option.laxcomma || (tt.first && (F('I001'), (tt.first = !1)), F('W014', e, t.value)));
                }
                function tt(e) {
                  (e = e || {}), e.peek ? et(f.tokens.prev, f.tokens.curr) : (et(f.tokens.curr, f.tokens.next), V(','));
                  if (f.tokens.next.identifier && (!e.property || !f.inES5()))
                    switch (f.tokens.next.value) {
                      case 'break':
                      case 'case':
                      case 'catch':
                      case 'continue':
                      case 'default':
                      case 'do':
                      case 'else':
                      case 'finally':
                      case 'for':
                      case 'if':
                      case 'in':
                      case 'instanceof':
                      case 'return':
                      case 'switch':
                      case 'throw':
                      case 'try':
                      case 'var':
                      case 'let':
                      case 'while':
                      case 'with':
                        return q('E024', f.tokens.next, f.tokens.next.value), !1;
                    }
                  if (f.tokens.next.type === '(punctuator)')
                    switch (f.tokens.next.value) {
                      case '}':
                      case ']':
                      case ',':
                        if (e.allowTrailing) return !0;
                      case ')':
                        return q('E024', f.tokens.next, f.tokens.next.value), !1;
                    }
                  return !0;
                }
                function nt(e, t) {
                  var n = f.syntax[e];
                  if (!n || typeof n != 'object') f.syntax[e] = n = { id: e, lbp: t, value: e };
                  return n;
                }
                function rt(e) {
                  var t = nt(e, 0);
                  return (t.delim = !0), t;
                }
                function it(e, t) {
                  var n = rt(e);
                  return (n.identifier = n.reserved = !0), (n.fud = t), n;
                }
                function st(e, t) {
                  var n = it(e, t);
                  return (n.block = !0), n;
                }
                function ot(e) {
                  var t = e.id.charAt(0);
                  if ((t >= 'a' && t <= 'z') || (t >= 'A' && t <= 'Z')) e.identifier = e.reserved = !0;
                  return e;
                }
                function ut(e, t) {
                  var n = nt(e, 150);
                  return (
                    ot(n),
                    (n.nud =
                      typeof t == 'function'
                        ? t
                        : function() {
                            (this.arity = 'unary'), (this.right = Q(150));
                            if (this.id === '++' || this.id === '--')
                              f.option.plusplus
                                ? F('W016', this, this.id)
                                : this.right &&
                                  (!this.right.identifier || O(this.right)) &&
                                  this.right.id !== '.' &&
                                  this.right.id !== '[' &&
                                  F('W017', this),
                                this.right && this.right.isMetaProperty
                                  ? q('E031', this)
                                  : this.right &&
                                    this.right.identifier &&
                                    f.funct['(scope)'].block.modify(this.right.value, this);
                            return this;
                          }),
                    n
                  );
                }
                function at(e, t) {
                  var n = rt(e);
                  return (n.type = e), (n.nud = t), n;
                }
                function ft(e, t) {
                  var n = at(e, t);
                  return (n.identifier = !0), (n.reserved = !0), n;
                }
                function lt(e, t) {
                  var n = at(
                    e,
                    (t && t.nud) ||
                      function() {
                        return this;
                      }
                  );
                  return (
                    (t = t || {}),
                    (t.isFutureReservedWord = !0),
                    (n.value = e),
                    (n.identifier = !0),
                    (n.reserved = !0),
                    (n.meta = t),
                    n
                  );
                }
                function ct(e, t) {
                  return ft(e, function() {
                    return typeof t == 'function' && t(this), this;
                  });
                }
                function ht(e, t, n, r) {
                  var i = nt(e, n);
                  return (
                    ot(i),
                    (i.infix = !0),
                    (i.led = function(i) {
                      return (
                        r || Y(f.tokens.prev, f.tokens.curr),
                        (e === 'in' || e === 'instanceof') && i.id === '!' && F('W018', i, '!'),
                        typeof t == 'function' ? t(i, this) : ((this.left = i), (this.right = Q(n)), this)
                      );
                    }),
                    i
                  );
                }
                function pt(e) {
                  var t = nt(e, 42);
                  return (
                    (t.led = function(e) {
                      return (
                        Y(f.tokens.prev, f.tokens.curr),
                        (this.left = e),
                        (this.right = Xt({ type: 'arrow', loneArg: e })),
                        this
                      );
                    }),
                    t
                  );
                }
                function dt(e, t) {
                  var n = nt(e, 100);
                  return (
                    (n.led = function(e) {
                      Y(f.tokens.prev, f.tokens.curr), (this.left = e);
                      var n = (this.right = Q(100));
                      return (
                        A(e, 'NaN') || A(n, 'NaN') ? F('W019', this) : t && t.apply(this, [e, n]),
                        (!e || !n) && B('E041', f.tokens.curr.line),
                        e.id === '!' && F('W018', e, '!'),
                        n.id === '!' && F('W018', n, '!'),
                        this
                      );
                    }),
                    n
                  );
                }
                function vt(e) {
                  return (
                    e &&
                    ((e.type === '(number)' && +e.value === 0) ||
                      (e.type === '(string)' && e.value === '') ||
                      (e.type === 'null' && !f.option.eqnull) ||
                      e.type === 'true' ||
                      e.type === 'false' ||
                      e.type === 'undefined')
                  );
                }
                function gt(e, t, n) {
                  var i;
                  return n.option.notypeof
                    ? !1
                    : !e || !t
                    ? !1
                    : ((i = n.inES6() ? mt.es6 : mt.es3),
                      t.type === '(identifier)' && t.value === 'typeof' && e.type === '(string)'
                        ? !r.contains(i, e.value)
                        : !1);
                }
                function yt(e, t) {
                  var n = !1;
                  return (
                    e.type === 'this' && t.funct['(context)'] === null
                      ? (n = !0)
                      : e.type === '(identifier)' &&
                        (t.option.node && e.value === 'global'
                          ? (n = !0)
                          : t.option.browser && (e.value === 'window' || e.value === 'document') && (n = !0)),
                    n
                  );
                }
                function bt(e) {
                  function n(e) {
                    if (typeof e != 'object') return;
                    return e.right === 'prototype' ? e : n(e.left);
                  }
                  function r(e) {
                    while (!e.identifier && typeof e.left == 'object') e = e.left;
                    if (e.identifier && t.indexOf(e.value) >= 0) return e.value;
                  }
                  var t = [
                      'Array',
                      'ArrayBuffer',
                      'Boolean',
                      'Collator',
                      'DataView',
                      'Date',
                      'DateTimeFormat',
                      'Error',
                      'EvalError',
                      'Float32Array',
                      'Float64Array',
                      'Function',
                      'Infinity',
                      'Intl',
                      'Int16Array',
                      'Int32Array',
                      'Int8Array',
                      'Iterator',
                      'Number',
                      'NumberFormat',
                      'Object',
                      'RangeError',
                      'ReferenceError',
                      'RegExp',
                      'StopIteration',
                      'String',
                      'SyntaxError',
                      'TypeError',
                      'Uint16Array',
                      'Uint32Array',
                      'Uint8Array',
                      'Uint8ClampedArray',
                      'URIError'
                    ],
                    i = n(e);
                  if (i) return r(i);
                }
                function wt(e, t, n) {
                  var r = n && n.allowDestructuring;
                  t = t || e;
                  if (f.option.freeze) {
                    var i = bt(e);
                    i && F('W121', e, i);
                  }
                  return (
                    e.identifier && !e.isMetaProperty && f.funct['(scope)'].block.reassign(e.value, e),
                    e.id === '.'
                      ? ((!e.left || (e.left.value === 'arguments' && !f.isStrict())) && F('E031', t),
                        f.nameStack.set(f.tokens.prev),
                        !0)
                      : e.id === '{' || e.id === '['
                      ? (r && f.tokens.curr.left.destructAssign
                          ? f.tokens.curr.left.destructAssign.forEach(function(e) {
                              e.id && f.funct['(scope)'].block.modify(e.id, e.token);
                            })
                          : e.id === '{' || !e.left
                          ? F('E031', t)
                          : e.left.value === 'arguments' && !f.isStrict() && F('E031', t),
                        e.id === '[' && f.nameStack.set(e.right),
                        !0)
                      : e.isMetaProperty
                      ? (q('E031', t), !0)
                      : e.identifier && !O(e)
                      ? (f.funct['(scope)'].labeltype(e.value) === 'exception' && F('W022', e), f.nameStack.set(e), !0)
                      : (e === f.syntax['function'] && F('W023', f.tokens.curr), !1)
                  );
                }
                function Et(e, t, n) {
                  var r = ht(
                    e,
                    typeof t == 'function'
                      ? t
                      : function(e, t) {
                          t.left = e;
                          if (e && wt(e, t, { allowDestructuring: !0 })) return (t.right = Q(10)), t;
                          q('E031', t);
                        },
                    n
                  );
                  return (r.exps = !0), (r.assign = !0), r;
                }
                function St(e, t, n) {
                  var r = nt(e, n);
                  return (
                    ot(r),
                    (r.led =
                      typeof t == 'function'
                        ? t
                        : function(e) {
                            return (
                              f.option.bitwise && F('W016', this, this.id), (this.left = e), (this.right = Q(n)), this
                            );
                          }),
                    r
                  );
                }
                function xt(e) {
                  return Et(
                    e,
                    function(e, t) {
                      f.option.bitwise && F('W016', t, t.id);
                      if (e && wt(e, t)) return (t.right = Q(10)), t;
                      q('E031', t);
                    },
                    20
                  );
                }
                function Tt(e) {
                  var t = nt(e, 150);
                  return (
                    (t.led = function(e) {
                      return (
                        f.option.plusplus
                          ? F('W016', this, this.id)
                          : (!e.identifier || O(e)) && e.id !== '.' && e.id !== '[' && F('W017', this),
                        e.isMetaProperty
                          ? q('E031', this)
                          : e && e.identifier && f.funct['(scope)'].block.modify(e.value, e),
                        (this.left = e),
                        this
                      );
                    }),
                    t
                  );
                }
                function Nt(e, t, n) {
                  if (!f.tokens.next.identifier) return;
                  n || V();
                  var r = f.tokens.curr,
                    i = f.tokens.curr.value;
                  return O(r)
                    ? t && f.inES5()
                      ? i
                      : e && i === 'undefined'
                      ? i
                      : (F('W024', f.tokens.curr, f.tokens.curr.id), i)
                    : i;
                }
                function Ct(e, t) {
                  var n = Nt(e, t, !1);
                  if (n) return n;
                  if (f.tokens.next.value === '...') {
                    f.inES6(!0) || F('W119', f.tokens.next, 'spread/rest operator', '6'), V();
                    if (pn(f.tokens.next, '...')) {
                      F('E024', f.tokens.next, '...');
                      while (pn(f.tokens.next, '...')) V();
                    }
                    if (!f.tokens.next.identifier) {
                      F('E024', f.tokens.curr, '...');
                      return;
                    }
                    return Ct(e, t);
                  }
                  q('E030', f.tokens.next, f.tokens.next.value), f.tokens.next.id !== ';' && V();
                }
                function kt(e) {
                  var t = 0,
                    n;
                  if (f.tokens.next.id !== ';' || e.inBracelessBlock) return;
                  for (;;) {
                    do (n = W(t)), (t += 1);
                    while (n.id !== '(end)' && n.id === '(comment)');
                    if (n.reach) return;
                    if (n.id !== '(endline)') {
                      if (n.id === 'function') {
                        f.option.latedef === !0 && F('W026', n);
                        break;
                      }
                      F('W027', n, n.value, e.value);
                      break;
                    }
                  }
                }
                function Lt() {
                  if (f.tokens.next.id !== ';') {
                    if (f.tokens.next.isUnclosed) return V();
                    var e = G(f.tokens.next) === f.tokens.curr.line && f.tokens.next.id !== '(end)',
                      t = pn(f.tokens.next, '}');
                    e && !t
                      ? R('E058', f.tokens.curr.line, f.tokens.curr.character)
                      : f.option.asi ||
                        (((t && !f.option.lastsemic) || !e) && I('W033', f.tokens.curr.line, f.tokens.curr.character));
                  } else V(';');
                }
                function At() {
                  var e = g,
                    t,
                    n = f.tokens.next,
                    r = !1;
                  if (n.id === ';') {
                    V(';');
                    return;
                  }
                  var i = O(n);
                  i && n.meta && n.meta.isFutureReservedWord && W().id === ':' && (F('W024', n, n.id), (i = !1)),
                    n.identifier &&
                      !i &&
                      W().id === ':' &&
                      (V(),
                      V(':'),
                      (r = !0),
                      f.funct['(scope)'].stack(),
                      f.funct['(scope)'].block.addBreakLabel(n.value, { token: f.tokens.curr }),
                      !f.tokens.next.labelled &&
                        f.tokens.next.value !== '{' &&
                        F('W028', f.tokens.next, n.value, f.tokens.next.value),
                      (f.tokens.next.label = n.value),
                      (n = f.tokens.next));
                  if (n.id === '{') {
                    var s = f.funct['(verb)'] === 'case' && f.tokens.curr.value === ':';
                    _t(!0, !0, !1, !1, s);
                    return;
                  }
                  return (
                    (t = Q(0, !0)),
                    t &&
                      (!t.identifier || t.value !== 'function') &&
                      (t.type !== '(punctuator)' || !t.left || !t.left.identifier || t.left.value !== 'function') &&
                      !f.isStrict() &&
                      f.option.strict === 'global' &&
                      F('E007'),
                    n.block ||
                      (!f.option.expr && (!t || !t.exps)
                        ? F('W030', f.tokens.curr)
                        : f.option.nonew && t && t.left && t.id === '(' && t.left.id === 'new' && F('W031', n),
                      Lt()),
                    (g = e),
                    r && f.funct['(scope)'].unstack(),
                    t
                  );
                }
                function Ot() {
                  var e = [],
                    t;
                  while (!f.tokens.next.reach && f.tokens.next.id !== '(end)')
                    f.tokens.next.id === ';'
                      ? ((t = W()), (!t || (t.id !== '(' && t.id !== '[')) && F('W032'), V(';'))
                      : e.push(At());
                  return e;
                }
                function Mt() {
                  var e, t, n;
                  while (f.tokens.next.id === '(string)') {
                    t = W(0);
                    if (t.id === '(endline)') {
                      e = 1;
                      do n = W(e++);
                      while (n.id === '(endline)');
                      if (n.id === ';') t = n;
                      else {
                        if (n.value === '[' || n.value === '.') break;
                        (!f.option.asi || n.value === '(') && F('W033', f.tokens.next);
                      }
                    } else {
                      if (t.id === '.' || t.id === '[') break;
                      t.id !== ';' && F('W033', t);
                    }
                    V();
                    var r = f.tokens.curr.value;
                    (f.directive[r] || (r === 'use strict' && f.option.strict === 'implied')) &&
                      F('W034', f.tokens.curr, r),
                      (f.directive[r] = !0),
                      t.id === ';' && V(';');
                  }
                  f.isStrict() && (f.option['(explicitNewcap)'] || (f.option.newcap = !0), (f.option.undef = !0));
                }
                function _t(e, t, n, i, s) {
                  var o,
                    u = m,
                    a = g,
                    l,
                    c,
                    h,
                    p;
                  (m = e), (c = f.tokens.next);
                  var d = f.funct['(metrics)'];
                  (d.nestedBlockDepth += 1), d.verifyMaxNestedBlockDepthPerFunction();
                  if (f.tokens.next.id === '{') {
                    V('{'), f.funct['(scope)'].stack(), (h = f.tokens.curr.line);
                    if (f.tokens.next.id !== '}') {
                      g += f.option.indent;
                      while (!e && f.tokens.next.from > g) g += f.option.indent;
                      if (n) {
                        l = {};
                        for (p in f.directive) r.has(f.directive, p) && (l[p] = f.directive[p]);
                        Mt(),
                          f.option.strict &&
                            f.funct['(context)']['(global)'] &&
                            !l['use strict'] &&
                            !f.isStrict() &&
                            F('E007');
                      }
                      (o = Ot()), (d.statementCount += o.length), (g -= f.option.indent);
                    }
                    V('}', c),
                      n && (f.funct['(scope)'].validateParams(), l && (f.directive = l)),
                      f.funct['(scope)'].unstack(),
                      (g = a);
                  } else if (!e)
                    if (n) {
                      f.funct['(scope)'].stack(),
                        (l = {}),
                        t && !i && !f.inMoz() && q('W118', f.tokens.curr, 'function closure expressions');
                      if (!t) for (p in f.directive) r.has(f.directive, p) && (l[p] = f.directive[p]);
                      Q(10),
                        f.option.strict &&
                          f.funct['(context)']['(global)'] &&
                          !l['use strict'] &&
                          !f.isStrict() &&
                          F('E007'),
                        f.funct['(scope)'].unstack();
                    } else q('E021', f.tokens.next, '{', f.tokens.next.value);
                  else
                    (f.funct['(noblockscopedvar)'] = f.tokens.next.id !== 'for'),
                      f.funct['(scope)'].stack(),
                      (!t || f.option.curly) && F('W116', f.tokens.next, '{', f.tokens.next.value),
                      (f.tokens.next.inBracelessBlock = !0),
                      (g += f.option.indent),
                      (o = [At()]),
                      (g -= f.option.indent),
                      f.funct['(scope)'].unstack(),
                      delete f.funct['(noblockscopedvar)'];
                  switch (f.funct['(verb)']) {
                    case 'break':
                    case 'continue':
                    case 'return':
                    case 'throw':
                      if (s) break;
                    default:
                      f.funct['(verb)'] = null;
                  }
                  return (
                    (m = u),
                    e && f.option.noempty && (!o || o.length === 0) && F('W035', f.tokens.prev),
                    (d.nestedBlockDepth -= 1),
                    o
                  );
                }
                function Dt(e) {
                  E && typeof E[e] != 'boolean' && F('W036', f.tokens.curr, e),
                    typeof w[e] == 'number' ? (w[e] += 1) : (w[e] = 1);
                }
                function Bt() {
                  var e = {};
                  (e.exps = !0), f.funct['(comparray)'].stack();
                  var t = !1;
                  return (
                    f.tokens.next.value !== 'for' &&
                      ((t = !0),
                      f.inMoz() || F('W116', f.tokens.next, 'for', f.tokens.next.value),
                      f.funct['(comparray)'].setState('use'),
                      (e.right = Q(10))),
                    V('for'),
                    f.tokens.next.value === 'each' && (V('each'), f.inMoz() || F('W118', f.tokens.curr, 'for each')),
                    V('('),
                    f.funct['(comparray)'].setState('define'),
                    (e.left = Q(130)),
                    r.contains(['in', 'of'], f.tokens.next.value) ? V() : q('E045', f.tokens.curr),
                    f.funct['(comparray)'].setState('generate'),
                    Q(10),
                    V(')'),
                    f.tokens.next.value === 'if' &&
                      (V('if'), V('('), f.funct['(comparray)'].setState('filter'), (e.filter = Q(10)), V(')')),
                    t || (f.funct['(comparray)'].setState('use'), (e.right = Q(10))),
                    V(']'),
                    f.funct['(comparray)'].unstack(),
                    e
                  );
                }
                function jt() {
                  return (
                    (f.funct['(statement)'] && f.funct['(statement)'].type === 'class') ||
                    (f.funct['(context)'] && f.funct['(context)']['(verb)'] === 'class')
                  );
                }
                function Ft(e) {
                  return e.identifier || e.id === '(string)' || e.id === '(number)';
                }
                function It(e) {
                  var t,
                    n = !0;
                  return (
                    typeof e == 'object' ? (t = e) : ((n = e), (t = Nt(!1, !0, n))),
                    t
                      ? typeof t == 'object' &&
                        (t.id === '(string)' || t.id === '(identifier)'
                          ? (t = t.value)
                          : t.id === '(number)' && (t = t.value.toString()))
                      : f.tokens.next.id === '(string)'
                      ? ((t = f.tokens.next.value), n || V())
                      : f.tokens.next.id === '(number)' && ((t = f.tokens.next.value.toString()), n || V()),
                    t === 'hasOwnProperty' && F('W001'),
                    t
                  );
                }
                function qt(e) {
                  function h(e) {
                    f.funct['(scope)'].addParam.apply(f.funct['(scope)'], e);
                  }
                  var t,
                    n = [],
                    i,
                    s = [],
                    o,
                    u = !1,
                    a = !1,
                    l = 0,
                    c = e && e.loneArg;
                  if (c && c.identifier === !0)
                    return f.funct['(scope)'].addParam(c.value, c), { arity: 1, params: [c.value] };
                  (t = f.tokens.next), (!e || !e.parsedOpening) && V('(');
                  if (f.tokens.next.id === ')') {
                    V(')');
                    return;
                  }
                  for (;;) {
                    l++;
                    var p = [];
                    if (r.contains(['{', '['], f.tokens.next.id)) {
                      s = Gt();
                      for (o in s) (o = s[o]), o.id && (n.push(o.id), p.push([o.id, o.token]));
                    } else {
                      pn(f.tokens.next, '...') && (a = !0), (i = Ct(!0));
                      if (i) n.push(i), p.push([i, f.tokens.curr]);
                      else while (!hn(f.tokens.next, [',', ')'])) V();
                    }
                    u && f.tokens.next.id !== '=' && q('W138', f.tokens.current),
                      f.tokens.next.id === '=' &&
                        (f.inES6() || F('W119', f.tokens.next, 'default parameters', '6'), V('='), (u = !0), Q(10)),
                      p.forEach(h);
                    if (f.tokens.next.id !== ',') return V(')', t), { arity: l, params: n };
                    a && F('W131', f.tokens.next), tt();
                  }
                }
                function Rt(e, t, n) {
                  var i = {
                    '(name)': e,
                    '(breakage)': 0,
                    '(loopage)': 0,
                    '(tokens)': {},
                    '(properties)': {},
                    '(catch)': !1,
                    '(global)': !1,
                    '(line)': null,
                    '(character)': null,
                    '(metrics)': null,
                    '(statement)': null,
                    '(context)': null,
                    '(scope)': null,
                    '(comparray)': null,
                    '(generator)': null,
                    '(arrow)': null,
                    '(params)': null
                  };
                  return (
                    t && r.extend(i, { '(line)': t.line, '(character)': t.character, '(metrics)': Vt(t) }),
                    r.extend(i, n),
                    i['(context)'] &&
                      ((i['(scope)'] = i['(context)']['(scope)']), (i['(comparray)'] = i['(context)']['(comparray)'])),
                    i
                  );
                }
                function Ut(e) {
                  return '(scope)' in e;
                }
                function zt(e) {
                  return e['(global)'] && !e['(verb)'];
                }
                function Wt(e) {
                  function i() {
                    if (f.tokens.curr.template && f.tokens.curr.tail && f.tokens.curr.context === t) return !0;
                    var e = f.tokens.next.template && f.tokens.next.tail && f.tokens.next.context === t;
                    return e && V(), e || f.tokens.next.isUnclosed;
                  }
                  var t = this.context,
                    n = this.noSubst,
                    r = this.depth;
                  if (!n) while (!i()) !f.tokens.next.template || f.tokens.next.depth > r ? Q(0) : V();
                  return { id: '(template)', type: '(template)', tag: e };
                }
                function Xt(e) {
                  var t,
                    n,
                    r,
                    i,
                    s,
                    o,
                    u,
                    a,
                    l = f.option,
                    c = f.ignored;
                  e &&
                    ((r = e.name),
                    (i = e.statement),
                    (s = e.classExprBinding),
                    (o = e.type === 'generator'),
                    (u = e.type === 'arrow'),
                    (a = e.ignoreLoopFunc)),
                    (f.option = Object.create(f.option)),
                    (f.ignored = Object.create(f.ignored)),
                    (f.funct = Rt(r || f.nameStack.infer(), f.tokens.next, {
                      '(statement)': i,
                      '(context)': f.funct,
                      '(arrow)': u,
                      '(generator)': o
                    })),
                    (t = f.funct),
                    (n = f.tokens.curr),
                    (n.funct = f.funct),
                    v.push(f.funct),
                    f.funct['(scope)'].stack('functionouter');
                  var h = r || s;
                  h && f.funct['(scope)'].block.add(h, s ? 'class' : 'function', f.tokens.curr, !1),
                    f.funct['(scope)'].stack('functionparams');
                  var p = qt(e);
                  return (
                    p
                      ? ((f.funct['(params)'] = p.params),
                        (f.funct['(metrics)'].arity = p.arity),
                        f.funct['(metrics)'].verifyMaxParametersPerFunction())
                      : (f.funct['(metrics)'].arity = 0),
                    u &&
                      (f.inES6(!0) || F('W119', f.tokens.curr, 'arrow function syntax (=>)', '6'),
                      e.loneArg || V('=>')),
                    _t(!1, !0, !0, u),
                    !f.option.noyield && o && f.funct['(generator)'] !== 'yielded' && F('W124', f.tokens.curr),
                    f.funct['(metrics)'].verifyMaxStatementsPerFunction(),
                    f.funct['(metrics)'].verifyMaxComplexityPerFunction(),
                    (f.funct['(unusedOption)'] = f.option.unused),
                    (f.option = l),
                    (f.ignored = c),
                    (f.funct['(last)'] = f.tokens.curr.line),
                    (f.funct['(lastcharacter)'] = f.tokens.curr.character),
                    f.funct['(scope)'].unstack(),
                    f.funct['(scope)'].unstack(),
                    (f.funct = f.funct['(context)']),
                    !a && !f.option.loopfunc && f.funct['(loopage)'] && t['(isCapturing)'] && F('W083', n),
                    t
                  );
                }
                function Vt(e) {
                  return {
                    statementCount: 0,
                    nestedBlockDepth: -1,
                    ComplexityCount: 1,
                    arity: 0,
                    verifyMaxStatementsPerFunction: function() {
                      f.option.maxstatements &&
                        this.statementCount > f.option.maxstatements &&
                        F('W071', e, this.statementCount);
                    },
                    verifyMaxParametersPerFunction: function() {
                      r.isNumber(f.option.maxparams) && this.arity > f.option.maxparams && F('W072', e, this.arity);
                    },
                    verifyMaxNestedBlockDepthPerFunction: function() {
                      f.option.maxdepth &&
                        this.nestedBlockDepth > 0 &&
                        this.nestedBlockDepth === f.option.maxdepth + 1 &&
                        F('W073', null, this.nestedBlockDepth);
                    },
                    verifyMaxComplexityPerFunction: function() {
                      var t = f.option.maxcomplexity,
                        n = this.ComplexityCount;
                      t && n > t && F('W074', e, n);
                    }
                  };
                }
                function $t() {
                  f.funct['(metrics)'].ComplexityCount += 1;
                }
                function Jt(e) {
                  var t, n;
                  e &&
                    ((t = e.id),
                    (n = e.paren),
                    t === ',' && (e = e.exprs[e.exprs.length - 1]) && ((t = e.id), (n = n || e.paren)));
                  switch (t) {
                    case '=':
                    case '+=':
                    case '-=':
                    case '*=':
                    case '%=':
                    case '&=':
                    case '|=':
                    case '^=':
                    case '/=':
                      !n && !f.option.boss && F('W084');
                  }
                }
                function Kt(e) {
                  if (f.inES5())
                    for (var t in e) e[t] && e[t].setterToken && !e[t].getterToken && F('W078', e[t].setterToken);
                }
                function Qt(e, t) {
                  if (pn(f.tokens.next, '.')) {
                    var n = f.tokens.curr.id;
                    V('.');
                    var r = Ct();
                    return (
                      (f.tokens.curr.isMetaProperty = !0), e !== r ? q('E057', f.tokens.prev, n, r) : t(), f.tokens.curr
                    );
                  }
                }
                function Gt(e) {
                  var t = e && e.assignment;
                  return (
                    f.inES6() ||
                      F('W104', f.tokens.curr, t ? 'destructuring assignment' : 'destructuring binding', '6'),
                    Yt(e)
                  );
                }
                function Yt(e) {
                  var t,
                    n = [],
                    r = e && e.openingParsed,
                    i = e && e.assignment,
                    s = i ? { assignment: i } : null,
                    o = r ? f.tokens.curr : f.tokens.next,
                    u = function() {
                      var e;
                      if (hn(f.tokens.next, ['[', '{'])) {
                        t = Yt(s);
                        for (var r in t) (r = t[r]), n.push({ id: r.id, token: r.token });
                      } else if (pn(f.tokens.next, ',')) n.push({ id: null, token: f.tokens.curr });
                      else {
                        if (!pn(f.tokens.next, '(')) {
                          var o = pn(f.tokens.next, '...');
                          if (i) {
                            var a = o ? W(0) : f.tokens.next;
                            a.identifier || F('E030', a, a.value);
                            var l = Q(155);
                            l && (wt(l), l.identifier && (e = l.value));
                          } else e = Ct();
                          return e && n.push({ id: e, token: f.tokens.curr }), o;
                        }
                        V('('), u(), V(')');
                      }
                      return !1;
                    },
                    a = function() {
                      var e;
                      pn(f.tokens.next, '[')
                        ? (V('['), Q(10), V(']'), V(':'), u())
                        : f.tokens.next.id === '(string)' || f.tokens.next.id === '(number)'
                        ? (V(), V(':'), u())
                        : ((e = Ct()),
                          pn(f.tokens.next, ':')
                            ? (V(':'), u())
                            : e && (i && wt(f.tokens.curr), n.push({ id: e, token: f.tokens.curr })));
                    };
                  if (pn(o, '[')) {
                    r || V('['), pn(f.tokens.next, ']') && F('W137', f.tokens.curr);
                    var l = !1;
                    while (!pn(f.tokens.next, ']'))
                      u() && !l && pn(f.tokens.next, ',') && (F('W130', f.tokens.next), (l = !0)),
                        pn(f.tokens.next, '=') &&
                          (pn(f.tokens.prev, '...') ? V(']') : V('='),
                          f.tokens.next.id === 'undefined' && F('W080', f.tokens.prev, f.tokens.prev.value),
                          Q(10)),
                        pn(f.tokens.next, ']') || V(',');
                    V(']');
                  } else if (pn(o, '{')) {
                    r || V('{'), pn(f.tokens.next, '}') && F('W137', f.tokens.curr);
                    while (!pn(f.tokens.next, '}')) {
                      a(),
                        pn(f.tokens.next, '=') &&
                          (V('='),
                          f.tokens.next.id === 'undefined' && F('W080', f.tokens.prev, f.tokens.prev.value),
                          Q(10));
                      if (!pn(f.tokens.next, '}')) {
                        V(',');
                        if (pn(f.tokens.next, '}')) break;
                      }
                    }
                    V('}');
                  }
                  return n;
                }
                function Zt(e, t) {
                  var n = t.first;
                  if (!n) return;
                  r.zip(e, Array.isArray(n) ? n : [n]).forEach(function(e) {
                    var t = e[0],
                      n = e[1];
                    t && n ? (t.first = n) : t && t.first && !n && F('W080', t.first, t.first.value);
                  });
                }
                function en(e, t, n) {
                  var i = n && n.prefix,
                    s = n && n.inexport,
                    o = e === 'let',
                    u = e === 'const',
                    a,
                    l,
                    c,
                    h;
                  f.inES6() || F('W104', f.tokens.curr, e, '6'),
                    o && f.tokens.next.value === '('
                      ? (f.inMoz() || F('W118', f.tokens.next, 'let block'),
                        V('('),
                        f.funct['(scope)'].stack(),
                        (h = !0))
                      : f.funct['(noblockscopedvar)'] && q('E048', f.tokens.curr, u ? 'Const' : 'Let'),
                    (t.first = []);
                  for (;;) {
                    var p = [];
                    r.contains(['{', '['], f.tokens.next.value)
                      ? ((a = Gt()), (l = !1))
                      : ((a = [{ id: Ct(), token: f.tokens.curr }]), (l = !0)),
                      !i && u && f.tokens.next.id !== '=' && F('E012', f.tokens.curr, f.tokens.curr.value);
                    for (var d in a)
                      a.hasOwnProperty(d) &&
                        ((d = a[d]),
                        f.funct['(scope)'].block.isGlobal() && S[d.id] === !1 && F('W079', d.token, d.id),
                        d.id &&
                          !f.funct['(noblockscopedvar)'] &&
                          (f.funct['(scope)'].addlabel(d.id, { type: e, token: d.token }),
                          p.push(d.token),
                          l && s && f.funct['(scope)'].setExported(d.token.value, d.token)));
                    f.tokens.next.id === '=' &&
                      (V('='),
                      !i && f.tokens.next.id === 'undefined' && F('W080', f.tokens.prev, f.tokens.prev.value),
                      !i &&
                        W(0).id === '=' &&
                        f.tokens.next.identifier &&
                        F('W120', f.tokens.next, f.tokens.next.value),
                      (c = Q(i ? 120 : 10)),
                      l ? (a[0].first = c) : Zt(p, c)),
                      (t.first = t.first.concat(p));
                    if (f.tokens.next.id !== ',') break;
                    tt();
                  }
                  return h && (V(')'), _t(!0, !0), (t.block = !0), f.funct['(scope)'].unstack()), t;
                }
                function sn(e) {
                  return (
                    f.inES6() || F('W104', f.tokens.curr, 'class', '6'),
                    e
                      ? ((this.name = Ct()),
                        f.funct['(scope)'].addlabel(this.name, { type: 'class', token: f.tokens.curr }))
                      : f.tokens.next.identifier && f.tokens.next.value !== 'extends'
                      ? ((this.name = Ct()), (this.namedExpr = !0))
                      : (this.name = f.nameStack.infer()),
                    on(this),
                    this
                  );
                }
                function on(e) {
                  var t = f.inClassBody;
                  f.tokens.next.value === 'extends' && (V('extends'), (e.heritage = Q(10))),
                    (f.inClassBody = !0),
                    V('{'),
                    (e.body = un(e)),
                    V('}'),
                    (f.inClassBody = t);
                }
                function un(e) {
                  var t,
                    n,
                    r,
                    i,
                    s = Object.create(null),
                    o = Object.create(null),
                    u;
                  for (var a = 0; f.tokens.next.id !== '}'; ++a) {
                    (t = f.tokens.next), (n = !1), (r = !1), (i = null);
                    if (t.id === ';') {
                      F('W032'), V(';');
                      continue;
                    }
                    t.id === '*' && ((r = !0), V('*'), (t = f.tokens.next));
                    if (t.id === '[') (t = cn()), (u = !0);
                    else {
                      if (!Ft(t)) {
                        F('W052', f.tokens.next, f.tokens.next.value || f.tokens.next.type), V();
                        continue;
                      }
                      V(), (u = !1);
                      if (t.identifier && t.value === 'static') {
                        pn(f.tokens.next, '*') && ((r = !0), V('*'));
                        if (Ft(f.tokens.next) || f.tokens.next.id === '[')
                          (u = f.tokens.next.id === '['),
                            (n = !0),
                            (t = f.tokens.next),
                            f.tokens.next.id === '[' ? (t = cn()) : V();
                      }
                      t.identifier &&
                        (t.value === 'get' || t.value === 'set') &&
                        (Ft(f.tokens.next) || f.tokens.next.id === '[') &&
                        ((u = f.tokens.next.id === '['),
                        (i = t),
                        (t = f.tokens.next),
                        f.tokens.next.id === '[' ? (t = cn()) : V());
                    }
                    if (!pn(f.tokens.next, '(')) {
                      q('E054', f.tokens.next, f.tokens.next.value);
                      while (f.tokens.next.id !== '}' && !pn(f.tokens.next, '(')) V();
                      f.tokens.next.value !== '(' && Xt({ statement: e });
                    }
                    u ||
                      (i
                        ? ln(i.value, n ? o : s, t.value, t, !0, n)
                        : (t.value === 'constructor' ? f.nameStack.set(e) : f.nameStack.set(t),
                          fn(n ? o : s, t.value, t, !0, n)));
                    if (i && t.value === 'constructor') {
                      var l = i.value === 'get' ? 'class getter method' : 'class setter method';
                      q('E049', t, l, 'constructor');
                    } else t.value === 'prototype' && q('E049', t, 'class method', 'prototype');
                    It(t),
                      Xt({ statement: e, type: r ? 'generator' : null, classExprBinding: e.namedExpr ? e.name : null });
                  }
                  Kt(s);
                }
                function fn(e, t, n, r, i) {
                  var s = ['key', 'class method', 'static class method'];
                  (s = s[(r || !1) + (i || !1)]),
                    n.identifier && (t = n.value),
                    e[t] && t !== '__proto__' ? F('W075', f.tokens.next, s, t) : (e[t] = Object.create(null)),
                    (e[t].basic = !0),
                    (e[t].basictkn = n);
                }
                function ln(e, t, n, r, i, s) {
                  var o = e === 'get' ? 'getterToken' : 'setterToken',
                    u = '';
                  i ? (s && (u += 'static '), (u += e + 'ter method')) : (u = 'key'),
                    (f.tokens.curr.accessorType = e),
                    f.nameStack.set(r),
                    t[n]
                      ? (t[n].basic || t[n][o]) && n !== '__proto__' && F('W075', f.tokens.next, u, n)
                      : (t[n] = Object.create(null)),
                    (t[n][o] = r);
                }
                function cn() {
                  V('['), f.inES6() || F('W119', f.tokens.curr, 'computed property names', '6');
                  var e = Q(10);
                  return V(']'), e;
                }
                function hn(e, t) {
                  return e.type === '(punctuator)' ? r.contains(t, e.value) : !1;
                }
                function pn(e, t) {
                  return e.type === '(punctuator)' && e.value === t;
                }
                function dn() {
                  var e = an();
                  e.notJson
                    ? (!f.inES6() && e.isDestAssign && F('W104', f.tokens.curr, 'destructuring assignment', '6'), Ot())
                    : ((f.option.laxbreak = !0), (f.jsonMode = !0), mn());
                }
                function mn() {
                  function e() {
                    var e = {},
                      t = f.tokens.next;
                    V('{');
                    if (f.tokens.next.id !== '}')
                      for (;;) {
                        if (f.tokens.next.id === '(end)') q('E026', f.tokens.next, t.line);
                        else {
                          if (f.tokens.next.id === '}') {
                            F('W094', f.tokens.curr);
                            break;
                          }
                          f.tokens.next.id === ','
                            ? q('E028', f.tokens.next)
                            : f.tokens.next.id !== '(string)' && F('W095', f.tokens.next, f.tokens.next.value);
                        }
                        e[f.tokens.next.value] === !0
                          ? F('W075', f.tokens.next, 'key', f.tokens.next.value)
                          : (f.tokens.next.value === '__proto__' && !f.option.proto) ||
                            (f.tokens.next.value === '__iterator__' && !f.option.iterator)
                          ? F('W096', f.tokens.next, f.tokens.next.value)
                          : (e[f.tokens.next.value] = !0),
                          V(),
                          V(':'),
                          mn();
                        if (f.tokens.next.id !== ',') break;
                        V(',');
                      }
                    V('}');
                  }
                  function t() {
                    var e = f.tokens.next;
                    V('[');
                    if (f.tokens.next.id !== ']')
                      for (;;) {
                        if (f.tokens.next.id === '(end)') q('E027', f.tokens.next, e.line);
                        else {
                          if (f.tokens.next.id === ']') {
                            F('W094', f.tokens.curr);
                            break;
                          }
                          f.tokens.next.id === ',' && q('E028', f.tokens.next);
                        }
                        mn();
                        if (f.tokens.next.id !== ',') break;
                        V(',');
                      }
                    V(']');
                  }
                  switch (f.tokens.next.id) {
                    case '{':
                      e();
                      break;
                    case '[':
                      t();
                      break;
                    case 'true':
                    case 'false':
                    case 'null':
                    case '(number)':
                    case '(string)':
                      V();
                      break;
                    case '-':
                      V('-'), V('(number)');
                      break;
                    default:
                      q('E003', f.tokens.next);
                  }
                }
                var e,
                  t = {
                    '<': !0,
                    '<=': !0,
                    '==': !0,
                    '===': !0,
                    '!==': !0,
                    '!=': !0,
                    '>': !0,
                    '>=': !0,
                    '+': !0,
                    '-': !0,
                    '*': !0,
                    '/': !0,
                    '%': !0
                  },
                  n,
                  d = ['closure', 'exception', 'global', 'label', 'outer', 'unused', 'var'],
                  v,
                  m,
                  g,
                  y,
                  b,
                  w,
                  E,
                  S,
                  x,
                  T,
                  N = [],
                  C = new i.EventEmitter(),
                  mt = {};
                (mt.legacy = ['xml', 'unknown']),
                  (mt.es3 = ['undefined', 'boolean', 'number', 'string', 'function', 'object']),
                  (mt.es3 = mt.es3.concat(mt.legacy)),
                  (mt.es6 = mt.es3.concat('symbol')),
                  at('(number)', function() {
                    return this;
                  }),
                  at('(string)', function() {
                    return this;
                  }),
                  (f.syntax['(identifier)'] = {
                    type: '(identifier)',
                    lbp: 0,
                    identifier: !0,
                    nud: function() {
                      var e = this.value;
                      return f.tokens.next.id === '=>'
                        ? this
                        : (f.funct['(comparray)'].check(e) || f.funct['(scope)'].block.use(e, f.tokens.curr), this);
                    },
                    led: function() {
                      q('E033', f.tokens.next, f.tokens.next.value);
                    }
                  });
                var Pt = { lbp: 0, identifier: !1, template: !0 };
                (f.syntax['(template)'] = r.extend({ type: '(template)', nud: Wt, led: Wt, noSubst: !1 }, Pt)),
                  (f.syntax['(template middle)'] = r.extend(
                    { type: '(template middle)', middle: !0, noSubst: !1 },
                    Pt
                  )),
                  (f.syntax['(template tail)'] = r.extend({ type: '(template tail)', tail: !0, noSubst: !1 }, Pt)),
                  (f.syntax['(no subst template)'] = r.extend(
                    { type: '(template)', nud: Wt, led: Wt, noSubst: !0, tail: !0 },
                    Pt
                  )),
                  at('(regexp)', function() {
                    return this;
                  }),
                  rt('(endline)'),
                  rt('(begin)'),
                  (rt('(end)').reach = !0),
                  (rt('(error)').reach = !0),
                  (rt('}').reach = !0),
                  rt(')'),
                  rt(']'),
                  (rt('"').reach = !0),
                  (rt("'").reach = !0),
                  rt(';'),
                  (rt(':').reach = !0),
                  rt('#'),
                  ft('else'),
                  (ft('case').reach = !0),
                  ft('catch'),
                  (ft('default').reach = !0),
                  ft('finally'),
                  ct('arguments', function(e) {
                    f.isStrict() && f.funct['(global)'] && F('E008', e);
                  }),
                  ct('eval'),
                  ct('false'),
                  ct('Infinity'),
                  ct('null'),
                  ct('this', function(e) {
                    f.isStrict() &&
                      !jt() &&
                      !f.option.validthis &&
                      ((f.funct['(statement)'] && f.funct['(name)'].charAt(0) > 'Z') || f.funct['(global)']) &&
                      F('W040', e);
                  }),
                  ct('true'),
                  ct('undefined'),
                  Et('=', 'assign', 20),
                  Et('+=', 'assignadd', 20),
                  Et('-=', 'assignsub', 20),
                  Et('*=', 'assignmult', 20),
                  (Et('/=', 'assigndiv', 20).nud = function() {
                    q('E014');
                  }),
                  Et('%=', 'assignmod', 20),
                  xt('&='),
                  xt('|='),
                  xt('^='),
                  xt('<<='),
                  xt('>>='),
                  xt('>>>='),
                  ht(
                    ',',
                    function(e, t) {
                      var n;
                      (t.exprs = [e]), f.option.nocomma && F('W127');
                      if (!tt({ peek: !0 })) return t;
                      for (;;) {
                        if (!(n = Q(10))) break;
                        t.exprs.push(n);
                        if (f.tokens.next.value !== ',' || !tt()) break;
                      }
                      return t;
                    },
                    10,
                    !0
                  ),
                  ht(
                    '?',
                    function(e, t) {
                      return $t(), (t.left = e), (t.right = Q(10)), V(':'), (t['else'] = Q(10)), t;
                    },
                    30
                  );
                var Ht = 40;
                ht(
                  '||',
                  function(e, t) {
                    return $t(), (t.left = e), (t.right = Q(Ht)), t;
                  },
                  Ht
                ),
                  ht('&&', 'and', 50),
                  St('|', 'bitor', 70),
                  St('^', 'bitxor', 80),
                  St('&', 'bitand', 90),
                  dt('==', function(e, t) {
                    var n = f.option.eqnull && ((e && e.value) === 'null' || (t && t.value) === 'null');
                    switch (!0) {
                      case !n && f.option.eqeqeq:
                        (this.from = this.character), F('W116', this, '===', '==');
                        break;
                      case vt(e):
                        F('W041', this, '===', e.value);
                        break;
                      case vt(t):
                        F('W041', this, '===', t.value);
                        break;
                      case gt(t, e, f):
                        F('W122', this, t.value);
                        break;
                      case gt(e, t, f):
                        F('W122', this, e.value);
                    }
                    return this;
                  }),
                  dt('===', function(e, t) {
                    return gt(t, e, f) ? F('W122', this, t.value) : gt(e, t, f) && F('W122', this, e.value), this;
                  }),
                  dt('!=', function(e, t) {
                    var n = f.option.eqnull && ((e && e.value) === 'null' || (t && t.value) === 'null');
                    return (
                      !n && f.option.eqeqeq
                        ? ((this.from = this.character), F('W116', this, '!==', '!='))
                        : vt(e)
                        ? F('W041', this, '!==', e.value)
                        : vt(t)
                        ? F('W041', this, '!==', t.value)
                        : gt(t, e, f)
                        ? F('W122', this, t.value)
                        : gt(e, t, f) && F('W122', this, e.value),
                      this
                    );
                  }),
                  dt('!==', function(e, t) {
                    return gt(t, e, f) ? F('W122', this, t.value) : gt(e, t, f) && F('W122', this, e.value), this;
                  }),
                  dt('<'),
                  dt('>'),
                  dt('<='),
                  dt('>='),
                  St('<<', 'shiftleft', 120),
                  St('>>', 'shiftright', 120),
                  St('>>>', 'shiftrightunsigned', 120),
                  ht('in', 'in', 120),
                  ht('instanceof', 'instanceof', 120),
                  ht(
                    '+',
                    function(e, t) {
                      var n;
                      return (
                        (t.left = e),
                        (t.right = n = Q(130)),
                        e && n && e.id === '(string)' && n.id === '(string)'
                          ? ((e.value += n.value),
                            (e.character = n.character),
                            !f.option.scripturl && a.javascriptURL.test(e.value) && F('W050', e),
                            e)
                          : t
                      );
                    },
                    130
                  ),
                  ut('+', 'num'),
                  ut('+++', function() {
                    return F('W007'), (this.arity = 'unary'), (this.right = Q(150)), this;
                  }),
                  ht(
                    '+++',
                    function(e) {
                      return F('W007'), (this.left = e), (this.right = Q(130)), this;
                    },
                    130
                  ),
                  ht('-', 'sub', 130),
                  ut('-', 'neg'),
                  ut('---', function() {
                    return F('W006'), (this.arity = 'unary'), (this.right = Q(150)), this;
                  }),
                  ht(
                    '---',
                    function(e) {
                      return F('W006'), (this.left = e), (this.right = Q(130)), this;
                    },
                    130
                  ),
                  ht('*', 'mult', 140),
                  ht('/', 'div', 140),
                  ht('%', 'mod', 140),
                  Tt('++'),
                  ut('++', 'preinc'),
                  (f.syntax['++'].exps = !0),
                  Tt('--'),
                  ut('--', 'predec'),
                  (f.syntax['--'].exps = !0),
                  (ut('delete', function() {
                    var e = Q(10);
                    return e
                      ? (e.id !== '.' && e.id !== '[' && F('W051'),
                        (this.first = e),
                        e.identifier && !f.isStrict() && (e.forgiveUndef = !0),
                        this)
                      : this;
                  }).exps = !0),
                  ut('~', function() {
                    return (
                      f.option.bitwise && F('W016', this, '~'), (this.arity = 'unary'), (this.right = Q(150)), this
                    );
                  }),
                  ut('...', function() {
                    return (
                      f.inES6(!0) || F('W119', this, 'spread/rest operator', '6'),
                      !f.tokens.next.identifier &&
                        f.tokens.next.type !== '(string)' &&
                        !hn(f.tokens.next, ['[', '(']) &&
                        q('E030', f.tokens.next, f.tokens.next.value),
                      Q(150),
                      this
                    );
                  }),
                  ut('!', function() {
                    return (
                      (this.arity = 'unary'),
                      (this.right = Q(150)),
                      this.right || B('E041', this.line || 0),
                      t[this.right.id] === !0 && F('W018', this, '!'),
                      this
                    );
                  }),
                  ut('typeof', function() {
                    var e = Q(150);
                    return (
                      (this.first = this.right = e),
                      e || B('E041', this.line || 0, this.character || 0),
                      e.identifier && (e.forgiveUndef = !0),
                      this
                    );
                  }),
                  ut('new', function() {
                    var e = Qt('target', function() {
                      f.inES6(!0) || F('W119', f.tokens.prev, 'new.target', '6');
                      var e,
                        t = f.funct;
                      while (t) {
                        e = !t['(global)'];
                        if (!t['(arrow)']) break;
                        t = t['(context)'];
                      }
                      e || F('W136', f.tokens.prev, 'new.target');
                    });
                    if (e) return e;
                    var t = Q(155),
                      n;
                    if (t && t.id !== 'function')
                      if (t.identifier) {
                        t['new'] = !0;
                        switch (t.value) {
                          case 'Number':
                          case 'String':
                          case 'Boolean':
                          case 'Math':
                          case 'JSON':
                            F('W053', f.tokens.prev, t.value);
                            break;
                          case 'Symbol':
                            f.inES6() && F('W053', f.tokens.prev, t.value);
                            break;
                          case 'Function':
                            f.option.evil || F('W054');
                            break;
                          case 'Date':
                          case 'RegExp':
                          case 'this':
                            break;
                          default:
                            t.id !== 'function' &&
                              ((n = t.value.substr(0, 1)),
                              f.option.newcap &&
                                (n < 'A' || n > 'Z') &&
                                !f.funct['(scope)'].isPredefined(t.value) &&
                                F('W055', f.tokens.curr));
                        }
                      } else t.id !== '.' && t.id !== '[' && t.id !== '(' && F('W056', f.tokens.curr);
                    else f.option.supernew || F('W057', this);
                    return (
                      f.tokens.next.id !== '(' && !f.option.supernew && F('W058', f.tokens.curr, f.tokens.curr.value),
                      (this.first = this.right = t),
                      this
                    );
                  }),
                  (f.syntax['new'].exps = !0),
                  (ut('void').exps = !0),
                  ht(
                    '.',
                    function(e, t) {
                      var n = Ct(!1, !0);
                      return (
                        typeof n == 'string' && Dt(n),
                        (t.left = e),
                        (t.right = n),
                        n && n === 'hasOwnProperty' && f.tokens.next.value === '=' && F('W001'),
                        !e || e.value !== 'arguments' || (n !== 'callee' && n !== 'caller')
                          ? !f.option.evil &&
                            e &&
                            e.value === 'document' &&
                            (n === 'write' || n === 'writeln') &&
                            F('W060', e)
                          : f.option.noarg
                          ? F('W059', e, n)
                          : f.isStrict() && q('E008'),
                        !f.option.evil && (n === 'eval' || n === 'execScript') && yt(e, f) && F('W061'),
                        t
                      );
                    },
                    160,
                    !0
                  ),
                  (ht(
                    '(',
                    function(e, t) {
                      f.option.immed && e && !e.immed && e.id === 'function' && F('W062');
                      var n = 0,
                        r = [];
                      e &&
                        e.type === '(identifier)' &&
                        e.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/) &&
                        'Array Number String Boolean Date Object Error Symbol'.indexOf(e.value) === -1 &&
                        (e.value === 'Math' ? F('W063', e) : f.option.newcap && F('W064', e));
                      if (f.tokens.next.id !== ')')
                        for (;;) {
                          (r[r.length] = Q(10)), (n += 1);
                          if (f.tokens.next.id !== ',') break;
                          tt();
                        }
                      return (
                        V(')'),
                        typeof e == 'object' &&
                          (!f.inES5() && e.value === 'parseInt' && n === 1 && F('W065', f.tokens.curr),
                          f.option.evil ||
                            (e.value === 'eval' || e.value === 'Function' || e.value === 'execScript'
                              ? (F('W061', e), r[0] && [0].id === '(string)' && U(e, r[0].value))
                              : !r[0] ||
                                r[0].id !== '(string)' ||
                                (e.value !== 'setTimeout' && e.value !== 'setInterval')
                              ? r[0] &&
                                r[0].id === '(string)' &&
                                e.value === '.' &&
                                e.left.value === 'window' &&
                                (e.right === 'setTimeout' || e.right === 'setInterval') &&
                                (F('W066', e), U(e, r[0].value))
                              : (F('W066', e), U(e, r[0].value))),
                          !e.identifier &&
                            e.id !== '.' &&
                            e.id !== '[' &&
                            e.id !== '=>' &&
                            e.id !== '(' &&
                            e.id !== '&&' &&
                            e.id !== '||' &&
                            e.id !== '?' &&
                            (!f.inES6() || !e['(name)']) &&
                            F('W067', t)),
                        (t.left = e),
                        t
                      );
                    },
                    155,
                    !0
                  ).exps = !0),
                  ut('(', function() {
                    var e = f.tokens.next,
                      t,
                      n = -1,
                      r,
                      i,
                      s,
                      o,
                      u = 1,
                      a = f.tokens.curr,
                      l = f.tokens.prev,
                      c = !f.option.singleGroups;
                    do e.value === '(' ? (u += 1) : e.value === ')' && (u -= 1), (n += 1), (t = e), (e = W(n));
                    while ((u !== 0 || t.value !== ')') && e.value !== ';' && e.type !== '(end)');
                    f.tokens.next.id === 'function' && (i = f.tokens.next.immed = !0);
                    if (e.value === '=>') return Xt({ type: 'arrow', parsedOpening: !0 });
                    var h = [];
                    if (f.tokens.next.id !== ')')
                      for (;;) {
                        h.push(Q(10));
                        if (f.tokens.next.id !== ',') break;
                        f.option.nocomma && F('W127'), tt();
                      }
                    V(')', this),
                      f.option.immed &&
                        h[0] &&
                        h[0].id === 'function' &&
                        f.tokens.next.id !== '(' &&
                        f.tokens.next.id !== '.' &&
                        f.tokens.next.id !== '[' &&
                        F('W068', this);
                    if (!h.length) return;
                    return (
                      h.length > 1
                        ? ((r = Object.create(f.syntax[','])),
                          (r.exprs = h),
                          (s = h[0]),
                          (o = h[h.length - 1]),
                          c || (c = l.assign || l.delim))
                        : ((r = s = o = h[0]),
                          c ||
                            (c =
                              (a.beginsStmt && (r.id === '{' || i || Ut(r))) ||
                              (i && (!J() || f.tokens.prev.id !== '}')) ||
                              (Ut(r) && !J()) ||
                              (r.id === '{' && l.id === '=>') ||
                              (r.type === '(number)' && pn(e, '.') && /^\d+$/.test(r.value)))),
                      r &&
                        (!c &&
                          (s.left || s.right || r.exprs) &&
                          (c = (!K(l) && s.lbp <= l.lbp) || (!J() && o.lbp < f.tokens.next.lbp)),
                        c || F('W126', a),
                        (r.paren = !0)),
                      r
                    );
                  }),
                  pt('=>'),
                  ht(
                    '[',
                    function(e, t) {
                      var n = Q(10),
                        r;
                      return (
                        n &&
                          n.type === '(string)' &&
                          (!f.option.evil && (n.value === 'eval' || n.value === 'execScript') && yt(e, f) && F('W061'),
                          Dt(n.value),
                          !f.option.sub &&
                            a.identifier.test(n.value) &&
                            ((r = f.syntax[n.value]), (!r || !O(r)) && F('W069', f.tokens.prev, n.value))),
                        V(']', t),
                        n && n.value === 'hasOwnProperty' && f.tokens.next.value === '=' && F('W001'),
                        (t.left = e),
                        (t.right = n),
                        t
                      );
                    },
                    160,
                    !0
                  ),
                  ut('[', function() {
                    var e = an();
                    if (e.isCompArray)
                      return !f.option.esnext && !f.inMoz() && F('W118', f.tokens.curr, 'array comprehension'), Bt();
                    if (e.isDestAssign) return (this.destructAssign = Gt({ openingParsed: !0, assignment: !0 })), this;
                    var t = f.tokens.curr.line !== G(f.tokens.next);
                    (this.first = []),
                      t &&
                        ((g += f.option.indent), f.tokens.next.from === g + f.option.indent && (g += f.option.indent));
                    while (f.tokens.next.id !== '(end)') {
                      while (f.tokens.next.id === ',') {
                        if (!f.option.elision) {
                          if (!!f.inES5()) {
                            F('W128');
                            do V(',');
                            while (f.tokens.next.id === ',');
                            continue;
                          }
                          F('W070');
                        }
                        V(',');
                      }
                      if (f.tokens.next.id === ']') break;
                      this.first.push(Q(10));
                      if (f.tokens.next.id !== ',') break;
                      tt({ allowTrailing: !0 });
                      if (f.tokens.next.id === ']' && !f.inES5()) {
                        F('W070', f.tokens.curr);
                        break;
                      }
                    }
                    return t && (g -= f.option.indent), V(']', this), this;
                  }),
                  (function(e) {
                    (e.nud = function() {
                      var e,
                        t,
                        n,
                        r,
                        i,
                        s = !1,
                        o,
                        u = Object.create(null);
                      (e = f.tokens.curr.line !== G(f.tokens.next)),
                        e &&
                          ((g += f.option.indent),
                          f.tokens.next.from === g + f.option.indent && (g += f.option.indent));
                      var a = an();
                      if (a.isDestAssign)
                        return (this.destructAssign = Gt({ openingParsed: !0, assignment: !0 })), this;
                      for (;;) {
                        if (f.tokens.next.id === '}') break;
                        o = f.tokens.next.value;
                        if (!f.tokens.next.identifier || (X().id !== ',' && X().id !== '}'))
                          if (W().id === ':' || (o !== 'get' && o !== 'set')) {
                            f.tokens.next.value === '*' && f.tokens.next.type === '(punctuator)'
                              ? (f.inES6() || F('W104', f.tokens.next, 'generator functions', '6'), V('*'), (s = !0))
                              : (s = !1);
                            if (f.tokens.next.id === '[') (n = cn()), f.nameStack.set(n);
                            else {
                              f.nameStack.set(f.tokens.next), (n = It()), fn(u, n, f.tokens.next);
                              if (typeof n != 'string') break;
                            }
                            f.tokens.next.value === '('
                              ? (f.inES6() || F('W104', f.tokens.curr, 'concise methods', '6'),
                                Xt({ type: s ? 'generator' : null }))
                              : (V(':'), Q(10));
                          } else
                            V(o),
                              f.inES5() || q('E034'),
                              (n = It()),
                              !n && !f.inES6() && q('E035'),
                              n && ln(o, u, n, f.tokens.curr),
                              (i = f.tokens.next),
                              (t = Xt()),
                              (r = t['(params)']),
                              o === 'get' && n && r
                                ? F('W076', i, r[0], n)
                                : o === 'set' && n && (!r || r.length !== 1) && F('W077', i, n);
                        else
                          f.inES6() || F('W104', f.tokens.next, 'object short notation', '6'),
                            (n = It(!0)),
                            fn(u, n, f.tokens.next),
                            Q(10);
                        Dt(n);
                        if (f.tokens.next.id !== ',') break;
                        tt({ allowTrailing: !0, property: !0 }),
                          f.tokens.next.id === ','
                            ? F('W070', f.tokens.curr)
                            : f.tokens.next.id === '}' && !f.inES5() && F('W070', f.tokens.curr);
                      }
                      return e && (g -= f.option.indent), V('}', this), Kt(u), this;
                    }),
                      (e.fud = function() {
                        q('E036', f.tokens.curr);
                      });
                  })(rt('{'));
                var tn = it('const', function(e) {
                  return en('const', this, e);
                });
                tn.exps = !0;
                var nn = it('let', function(e) {
                  return en('let', this, e);
                });
                nn.exps = !0;
                var rn = it('var', function(e) {
                  var t = e && e.prefix,
                    n = e && e.inexport,
                    i,
                    o,
                    u,
                    a = e && e.implied,
                    l = !e || !e.ignore;
                  this.first = [];
                  for (;;) {
                    var c = [];
                    r.contains(['{', '['], f.tokens.next.value)
                      ? ((i = Gt()), (o = !1))
                      : ((i = [{ id: Ct(), token: f.tokens.curr }]), (o = !0)),
                      (!t || !a) && l && f.option.varstmt && F('W132', this),
                      (this.first = this.first.concat(c));
                    for (var h in i)
                      i.hasOwnProperty(h) &&
                        ((h = i[h]),
                        !a &&
                          f.funct['(global)'] &&
                          (S[h.id] === !1
                            ? F('W079', h.token, h.id)
                            : f.option.futurehostile === !1 &&
                              ((!f.inES5() && s.ecmaIdentifiers[5][h.id] === !1) ||
                                (!f.inES6() && s.ecmaIdentifiers[6][h.id] === !1)) &&
                              F('W129', h.token, h.id)),
                        h.id &&
                          (a === 'for'
                            ? (f.funct['(scope)'].has(h.id) || (l && F('W088', h.token, h.id)),
                              f.funct['(scope)'].block.use(h.id, h.token))
                            : (f.funct['(scope)'].addlabel(h.id, { type: 'var', token: h.token }),
                              o && n && f.funct['(scope)'].setExported(h.id, h.token)),
                          c.push(h.token)));
                    f.tokens.next.id === '=' &&
                      (f.nameStack.set(f.tokens.curr),
                      V('='),
                      !t &&
                        l &&
                        !f.funct['(loopage)'] &&
                        f.tokens.next.id === 'undefined' &&
                        F('W080', f.tokens.prev, f.tokens.prev.value),
                      W(0).id === '=' &&
                        f.tokens.next.identifier &&
                        ((!t && l && !f.funct['(params)']) ||
                          f.funct['(params)'].indexOf(f.tokens.next.value) === -1) &&
                        F('W120', f.tokens.next, f.tokens.next.value),
                      (u = Q(t ? 120 : 10)),
                      o ? (i[0].first = u) : Zt(c, u));
                    if (f.tokens.next.id !== ',') break;
                    tt();
                  }
                  return this;
                });
                (rn.exps = !0),
                  st('class', function() {
                    return sn.call(this, !0);
                  }),
                  st('function', function(e) {
                    var t = e && e.inexport,
                      n = !1;
                    f.tokens.next.value === '*' &&
                      (V('*'), f.inES6({ strict: !0 }) ? (n = !0) : F('W119', f.tokens.curr, 'function*', '6')),
                      m && F('W082', f.tokens.curr);
                    var r = Nt();
                    return (
                      f.funct['(scope)'].addlabel(r, { type: 'function', token: f.tokens.curr }),
                      r === undefined ? F('W025') : t && f.funct['(scope)'].setExported(r, f.tokens.prev),
                      Xt({ name: r, statement: this, type: n ? 'generator' : null, ignoreLoopFunc: m }),
                      f.tokens.next.id === '(' && f.tokens.next.line === f.tokens.curr.line && q('E039'),
                      this
                    );
                  }),
                  ut('function', function() {
                    var e = !1;
                    f.tokens.next.value === '*' &&
                      (f.inES6() || F('W119', f.tokens.curr, 'function*', '6'), V('*'), (e = !0));
                    var t = Nt();
                    return Xt({ name: t, type: e ? 'generator' : null }), this;
                  }),
                  st('if', function() {
                    var e = f.tokens.next;
                    $t(), (f.condition = !0), V('(');
                    var t = Q(0);
                    Jt(t);
                    var n = null;
                    f.option.forin &&
                      f.forinifcheckneeded &&
                      ((f.forinifcheckneeded = !1),
                      (n = f.forinifchecks[f.forinifchecks.length - 1]),
                      t.type === '(punctuator)' && t.value === '!' ? (n.type = '(negative)') : (n.type = '(positive)')),
                      V(')', e),
                      (f.condition = !1);
                    var r = _t(!0, !0);
                    return (
                      n &&
                        n.type === '(negative)' &&
                        r &&
                        r[0] &&
                        r[0].type === '(identifier)' &&
                        r[0].value === 'continue' &&
                        (n.type = '(negative-with-continue)'),
                      f.tokens.next.id === 'else' &&
                        (V('else'), f.tokens.next.id === 'if' || f.tokens.next.id === 'switch' ? At() : _t(!0, !0)),
                      this
                    );
                  }),
                  st('try', function() {
                    function t() {
                      V('catch'), V('('), f.funct['(scope)'].stack('catchparams');
                      if (hn(f.tokens.next, ['[', '{'])) {
                        var e = Gt();
                        r.each(e, function(e) {
                          e.id && f.funct['(scope)'].addParam(e.id, e, 'exception');
                        });
                      } else
                        f.tokens.next.type !== '(identifier)'
                          ? F('E030', f.tokens.next, f.tokens.next.value)
                          : f.funct['(scope)'].addParam(Ct(), f.tokens.curr, 'exception');
                      f.tokens.next.value === 'if' &&
                        (f.inMoz() || F('W118', f.tokens.curr, 'catch filter'), V('if'), Q(0)),
                        V(')'),
                        _t(!1),
                        f.funct['(scope)'].unstack();
                    }
                    var e;
                    _t(!0);
                    while (f.tokens.next.id === 'catch')
                      $t(), e && !f.inMoz() && F('W118', f.tokens.next, 'multiple catch blocks'), t(), (e = !0);
                    if (f.tokens.next.id === 'finally') {
                      V('finally'), _t(!0);
                      return;
                    }
                    return e || q('E021', f.tokens.next, 'catch', f.tokens.next.value), this;
                  }),
                  (st('while', function() {
                    var e = f.tokens.next;
                    return (
                      (f.funct['(breakage)'] += 1),
                      (f.funct['(loopage)'] += 1),
                      $t(),
                      V('('),
                      Jt(Q(0)),
                      V(')', e),
                      _t(!0, !0),
                      (f.funct['(breakage)'] -= 1),
                      (f.funct['(loopage)'] -= 1),
                      this
                    );
                  }).labelled = !0),
                  st('with', function() {
                    var e = f.tokens.next;
                    return (
                      f.isStrict() ? q('E010', f.tokens.curr) : f.option.withstmt || F('W085', f.tokens.curr),
                      V('('),
                      Q(0),
                      V(')', e),
                      _t(!0, !0),
                      this
                    );
                  }),
                  (st('switch', function() {
                    var e = f.tokens.next,
                      t = !1,
                      n = !1;
                    (f.funct['(breakage)'] += 1),
                      V('('),
                      Jt(Q(0)),
                      V(')', e),
                      (e = f.tokens.next),
                      V('{'),
                      f.tokens.next.from === g && (n = !0),
                      n || (g += f.option.indent),
                      (this.cases = []);
                    for (;;)
                      switch (f.tokens.next.id) {
                        case 'case':
                          switch (f.funct['(verb)']) {
                            case 'yield':
                            case 'break':
                            case 'case':
                            case 'continue':
                            case 'return':
                            case 'switch':
                            case 'throw':
                              break;
                            default:
                              f.tokens.curr.caseFallsThrough || F('W086', f.tokens.curr, 'case');
                          }
                          V('case'), this.cases.push(Q(0)), $t(), (t = !0), V(':'), (f.funct['(verb)'] = 'case');
                          break;
                        case 'default':
                          switch (f.funct['(verb)']) {
                            case 'yield':
                            case 'break':
                            case 'continue':
                            case 'return':
                            case 'throw':
                              break;
                            default:
                              this.cases.length &&
                                (f.tokens.curr.caseFallsThrough || F('W086', f.tokens.curr, 'default'));
                          }
                          V('default'), (t = !0), V(':');
                          break;
                        case '}':
                          n || (g -= f.option.indent),
                            V('}', e),
                            (f.funct['(breakage)'] -= 1),
                            (f.funct['(verb)'] = undefined);
                          return;
                        case '(end)':
                          q('E023', f.tokens.next, '}');
                          return;
                        default:
                          g += f.option.indent;
                          if (t)
                            switch (f.tokens.curr.id) {
                              case ',':
                                q('E040');
                                return;
                              case ':':
                                (t = !1), Ot();
                                break;
                              default:
                                q('E025', f.tokens.curr);
                                return;
                            }
                          else {
                            if (f.tokens.curr.id !== ':') {
                              q('E021', f.tokens.next, 'case', f.tokens.next.value);
                              return;
                            }
                            V(':'), q('E024', f.tokens.curr, ':'), Ot();
                          }
                          g -= f.option.indent;
                      }
                    return this;
                  }).labelled = !0),
                  (it('debugger', function() {
                    return f.option.debug || F('W087', this), this;
                  }).exps = !0),
                  (function() {
                    var e = it('do', function() {
                      (f.funct['(breakage)'] += 1),
                        (f.funct['(loopage)'] += 1),
                        $t(),
                        (this.first = _t(!0, !0)),
                        V('while');
                      var e = f.tokens.next;
                      return (
                        V('('), Jt(Q(0)), V(')', e), (f.funct['(breakage)'] -= 1), (f.funct['(loopage)'] -= 1), this
                      );
                    });
                    (e.labelled = !0), (e.exps = !0);
                  })(),
                  (st('for', function() {
                    var e,
                      t = f.tokens.next,
                      n = !1,
                      i = null;
                    t.value === 'each' && ((i = t), V('each'), f.inMoz() || F('W118', f.tokens.curr, 'for each')),
                      $t(),
                      V('(');
                    var s,
                      o = 0,
                      u = ['in', 'of'],
                      a = 0,
                      l,
                      c;
                    hn(f.tokens.next, ['{', '[']) && ++a;
                    do {
                      (s = W(o)), ++o, hn(s, ['{', '[']) ? ++a : hn(s, ['}', ']']) && --a;
                      if (a < 0) break;
                      a === 0 && (!l && pn(s, ',') ? (l = s) : !c && pn(s, '=') && (c = s));
                    } while (a > 0 || (!r.contains(u, s.value) && s.value !== ';' && s.type !== '(end)'));
                    if (r.contains(u, s.value)) {
                      !f.inES6() && s.value === 'of' && F('W104', s, 'for of', '6');
                      var h = !c && !l;
                      c && q('W133', l, s.value, 'initializer is forbidden'),
                        l && q('W133', l, s.value, 'more than one ForBinding'),
                        f.tokens.next.id === 'var'
                          ? (V('var'), f.tokens.curr.fud({ prefix: !0 }))
                          : f.tokens.next.id === 'let' || f.tokens.next.id === 'const'
                          ? (V(f.tokens.next.id),
                            (n = !0),
                            f.funct['(scope)'].stack(),
                            f.tokens.curr.fud({ prefix: !0 }))
                          : Object.create(rn).fud({ prefix: !0, implied: 'for', ignore: !h }),
                        V(s.value),
                        Q(20),
                        V(')', t),
                        s.value === 'in' &&
                          f.option.forin &&
                          ((f.forinifcheckneeded = !0),
                          f.forinifchecks === undefined && (f.forinifchecks = []),
                          f.forinifchecks.push({ type: '(none)' })),
                        (f.funct['(breakage)'] += 1),
                        (f.funct['(loopage)'] += 1),
                        (e = _t(!0, !0));
                      if (s.value === 'in' && f.option.forin) {
                        if (f.forinifchecks && f.forinifchecks.length > 0) {
                          var p = f.forinifchecks.pop();
                          ((e && e.length > 0 && (typeof e[0] != 'object' || e[0].value !== 'if')) ||
                            (p.type === '(positive)' && e.length > 1) ||
                            p.type === '(negative)') &&
                            F('W089', this);
                        }
                        f.forinifcheckneeded = !1;
                      }
                      (f.funct['(breakage)'] -= 1), (f.funct['(loopage)'] -= 1);
                    } else {
                      i && q('E045', i);
                      if (f.tokens.next.id !== ';')
                        if (f.tokens.next.id === 'var') V('var'), f.tokens.curr.fud();
                        else if (f.tokens.next.id === 'let')
                          V('let'), (n = !0), f.funct['(scope)'].stack(), f.tokens.curr.fud();
                        else
                          for (;;) {
                            Q(0, 'for');
                            if (f.tokens.next.id !== ',') break;
                            l();
                          }
                      Z(f.tokens.curr),
                        V(';'),
                        (f.funct['(loopage)'] += 1),
                        f.tokens.next.id !== ';' && Jt(Q(0)),
                        Z(f.tokens.curr),
                        V(';'),
                        f.tokens.next.id === ';' && q('E021', f.tokens.next, ')', ';');
                      if (f.tokens.next.id !== ')')
                        for (;;) {
                          Q(0, 'for');
                          if (f.tokens.next.id !== ',') break;
                          l();
                        }
                      V(')', t),
                        (f.funct['(breakage)'] += 1),
                        _t(!0, !0),
                        (f.funct['(breakage)'] -= 1),
                        (f.funct['(loopage)'] -= 1);
                    }
                    return n && f.funct['(scope)'].unstack(), this;
                  }).labelled = !0),
                  (it('break', function() {
                    var e = f.tokens.next.value;
                    return (
                      f.option.asi || Z(this),
                      f.tokens.next.id !== ';' && !f.tokens.next.reach && f.tokens.curr.line === G(f.tokens.next)
                        ? (f.funct['(scope)'].funct.hasBreakLabel(e) || F('W090', f.tokens.next, e),
                          (this.first = f.tokens.next),
                          V())
                        : f.funct['(breakage)'] === 0 && F('W052', f.tokens.next, this.value),
                      kt(this),
                      this
                    );
                  }).exps = !0),
                  (it('continue', function() {
                    var e = f.tokens.next.value;
                    return (
                      f.funct['(breakage)'] === 0 && F('W052', f.tokens.next, this.value),
                      f.funct['(loopage)'] || F('W052', f.tokens.next, this.value),
                      f.option.asi || Z(this),
                      f.tokens.next.id !== ';' &&
                        !f.tokens.next.reach &&
                        f.tokens.curr.line === G(f.tokens.next) &&
                        (f.funct['(scope)'].funct.hasBreakLabel(e) || F('W090', f.tokens.next, e),
                        (this.first = f.tokens.next),
                        V()),
                      kt(this),
                      this
                    );
                  }).exps = !0),
                  (it('return', function() {
                    return (
                      this.line === G(f.tokens.next)
                        ? f.tokens.next.id !== ';' &&
                          !f.tokens.next.reach &&
                          ((this.first = Q(0)),
                          this.first &&
                            this.first.type === '(punctuator)' &&
                            this.first.value === '=' &&
                            !this.first.paren &&
                            !f.option.boss &&
                            I('W093', this.first.line, this.first.character))
                        : f.tokens.next.type === '(punctuator)' &&
                          ['[', '{', '+', '-'].indexOf(f.tokens.next.value) > -1 &&
                          Z(this),
                      kt(this),
                      this
                    );
                  }).exps = !0),
                  (function(e) {
                    (e.exps = !0), (e.lbp = 25);
                  })(
                    ut('yield', function() {
                      var e = f.tokens.prev;
                      f.inES6(!0) && !f.funct['(generator)']
                        ? ('(catch)' !== f.funct['(name)'] || !f.funct['(context)']['(generator)']) &&
                          q('E046', f.tokens.curr, 'yield')
                        : f.inES6() || F('W104', f.tokens.curr, 'yield', '6'),
                        (f.funct['(generator)'] = 'yielded');
                      var t = !1;
                      f.tokens.next.value === '*' && ((t = !0), V('*'));
                      if (this.line === G(f.tokens.next) || !f.inMoz()) {
                        if (
                          t ||
                          (f.tokens.next.id !== ';' && !f.option.asi && !f.tokens.next.reach && f.tokens.next.nud)
                        )
                          Y(f.tokens.curr, f.tokens.next),
                            (this.first = Q(10)),
                            this.first.type === '(punctuator)' &&
                              this.first.value === '=' &&
                              !this.first.paren &&
                              !f.option.boss &&
                              I('W093', this.first.line, this.first.character);
                        f.inMoz() &&
                          f.tokens.next.id !== ')' &&
                          (e.lbp > 30 || (!e.assign && !J()) || e.id === 'yield') &&
                          q('E050', this);
                      } else f.option.asi || Z(this);
                      return this;
                    })
                  ),
                  (it('throw', function() {
                    return Z(this), (this.first = Q(20)), kt(this), this;
                  }).exps = !0),
                  (it('import', function() {
                    f.inES6() || F('W119', f.tokens.curr, 'import', '6');
                    if (f.tokens.next.type === '(string)') return V('(string)'), this;
                    if (f.tokens.next.identifier) {
                      (this.name = Ct()),
                        f.funct['(scope)'].addlabel(this.name, { type: 'const', token: f.tokens.curr });
                      if (f.tokens.next.value !== ',') return V('from'), V('(string)'), this;
                      V(',');
                    }
                    if (f.tokens.next.id === '*')
                      V('*'),
                        V('as'),
                        f.tokens.next.identifier &&
                          ((this.name = Ct()),
                          f.funct['(scope)'].addlabel(this.name, { type: 'const', token: f.tokens.curr }));
                    else {
                      V('{');
                      for (;;) {
                        if (f.tokens.next.value === '}') {
                          V('}');
                          break;
                        }
                        var e;
                        f.tokens.next.type === 'default' ? ((e = 'default'), V('default')) : (e = Ct()),
                          f.tokens.next.value === 'as' && (V('as'), (e = Ct())),
                          f.funct['(scope)'].addlabel(e, { type: 'const', token: f.tokens.curr });
                        if (f.tokens.next.value !== ',') {
                          if (f.tokens.next.value === '}') {
                            V('}');
                            break;
                          }
                          q('E024', f.tokens.next, f.tokens.next.value);
                          break;
                        }
                        V(',');
                      }
                    }
                    return V('from'), V('(string)'), this;
                  }).exps = !0),
                  (it('export', function() {
                    var e = !0,
                      t,
                      n;
                    f.inES6() || (F('W119', f.tokens.curr, 'export', '6'), (e = !1)),
                      f.funct['(scope)'].block.isGlobal() || (q('E053', f.tokens.curr), (e = !1));
                    if (f.tokens.next.value === '*') return V('*'), V('from'), V('(string)'), this;
                    if (f.tokens.next.type === 'default') {
                      f.nameStack.set(f.tokens.next), V('default');
                      var r = f.tokens.next.id;
                      if (r === 'function' || r === 'class') this.block = !0;
                      return (
                        (t = W()),
                        Q(10),
                        (n = t.value),
                        this.block &&
                          (f.funct['(scope)'].addlabel(n, { type: r, token: t }), f.funct['(scope)'].setExported(n, t)),
                        this
                      );
                    }
                    if (f.tokens.next.value === '{') {
                      V('{');
                      var i = [];
                      for (;;) {
                        f.tokens.next.identifier || q('E030', f.tokens.next, f.tokens.next.value),
                          V(),
                          i.push(f.tokens.curr),
                          f.tokens.next.value === 'as' &&
                            (V('as'), f.tokens.next.identifier || q('E030', f.tokens.next, f.tokens.next.value), V());
                        if (f.tokens.next.value !== ',') {
                          if (f.tokens.next.value === '}') {
                            V('}');
                            break;
                          }
                          q('E024', f.tokens.next, f.tokens.next.value);
                          break;
                        }
                        V(',');
                      }
                      return (
                        f.tokens.next.value === 'from'
                          ? (V('from'), V('(string)'))
                          : e &&
                            i.forEach(function(e) {
                              f.funct['(scope)'].setExported(e.value, e);
                            }),
                        this
                      );
                    }
                    if (f.tokens.next.id === 'var') V('var'), f.tokens.curr.fud({ inexport: !0 });
                    else if (f.tokens.next.id === 'let') V('let'), f.tokens.curr.fud({ inexport: !0 });
                    else if (f.tokens.next.id === 'const') V('const'), f.tokens.curr.fud({ inexport: !0 });
                    else if (f.tokens.next.id === 'function')
                      (this.block = !0), V('function'), f.syntax['function'].fud({ inexport: !0 });
                    else if (f.tokens.next.id === 'class') {
                      (this.block = !0), V('class');
                      var s = f.tokens.next;
                      f.syntax['class'].fud(), f.funct['(scope)'].setExported(s.value, s);
                    } else q('E024', f.tokens.next, f.tokens.next.value);
                    return this;
                  }).exps = !0),
                  lt('abstract'),
                  lt('boolean'),
                  lt('byte'),
                  lt('char'),
                  lt('class', { es5: !0, nud: sn }),
                  lt('double'),
                  lt('enum', { es5: !0 }),
                  lt('export', { es5: !0 }),
                  lt('extends', { es5: !0 }),
                  lt('final'),
                  lt('float'),
                  lt('goto'),
                  lt('implements', { es5: !0, strictOnly: !0 }),
                  lt('import', { es5: !0 }),
                  lt('int'),
                  lt('interface', { es5: !0, strictOnly: !0 }),
                  lt('long'),
                  lt('native'),
                  lt('package', { es5: !0, strictOnly: !0 }),
                  lt('private', { es5: !0, strictOnly: !0 }),
                  lt('protected', { es5: !0, strictOnly: !0 }),
                  lt('public', { es5: !0, strictOnly: !0 }),
                  lt('short'),
                  lt('static', { es5: !0, strictOnly: !0 }),
                  lt('super', { es5: !0 }),
                  lt('synchronized'),
                  lt('transient'),
                  lt('volatile');
                var an = function() {
                    var e,
                      t,
                      n,
                      r = -1,
                      i = 0,
                      s = {};
                    hn(f.tokens.curr, ['[', '{']) && (i += 1);
                    do {
                      (n = r === -1 ? f.tokens.curr : e),
                        (e = r === -1 ? f.tokens.next : W(r)),
                        (t = W(r + 1)),
                        (r += 1),
                        hn(e, ['[', '{']) ? (i += 1) : hn(e, [']', '}']) && (i -= 1);
                      if (i === 1 && e.identifier && e.value === 'for' && !pn(n, '.')) {
                        (s.isCompArray = !0), (s.notJson = !0);
                        break;
                      }
                      if (i === 0 && hn(e, ['}', ']'])) {
                        if (t.value === '=') {
                          (s.isDestAssign = !0), (s.notJson = !0);
                          break;
                        }
                        if (t.value === '.') {
                          s.notJson = !0;
                          break;
                        }
                      }
                      pn(e, ';') && ((s.isBlock = !0), (s.notJson = !0));
                    } while (i > 0 && e.id !== '(end)');
                    return s;
                  },
                  vn = function() {
                    function i(e) {
                      var t = n.variables.filter(function(t) {
                        if (t.value === e) return (t.undef = !1), e;
                      }).length;
                      return t !== 0;
                    }
                    function s(e) {
                      var t = n.variables.filter(function(t) {
                        if (t.value === e && !t.undef) return t.unused === !0 && (t.unused = !1), e;
                      }).length;
                      return t === 0;
                    }
                    var e = function() {
                        (this.mode = 'use'), (this.variables = []);
                      },
                      t = [],
                      n;
                    return {
                      stack: function() {
                        (n = new e()), t.push(n);
                      },
                      unstack: function() {
                        n.variables.filter(function(e) {
                          e.unused && F('W098', e.token, e.raw_text || e.value),
                            e.undef && f.funct['(scope)'].block.use(e.value, e.token);
                        }),
                          t.splice(-1, 1),
                          (n = t[t.length - 1]);
                      },
                      setState: function(e) {
                        r.contains(['use', 'define', 'generate', 'filter'], e) && (n.mode = e);
                      },
                      check: function(e) {
                        if (!n) return;
                        return n && n.mode === 'use'
                          ? (s(e) &&
                              n.variables.push({
                                funct: f.funct,
                                token: f.tokens.curr,
                                value: e,
                                undef: !0,
                                unused: !1
                              }),
                            !0)
                          : n && n.mode === 'define'
                          ? (i(e) ||
                              n.variables.push({
                                funct: f.funct,
                                token: f.tokens.curr,
                                value: e,
                                undef: !1,
                                unused: !0
                              }),
                            !0)
                          : n && n.mode === 'generate'
                          ? (f.funct['(scope)'].block.use(e, f.tokens.curr), !0)
                          : n && n.mode === 'filter'
                          ? (s(e) && f.funct['(scope)'].block.use(e, f.tokens.curr), !0)
                          : !1;
                      }
                    };
                  },
                  gn = function(e) {
                    return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                  },
                  yn = function(t, i, o) {
                    function U(e, t) {
                      if (!e) return;
                      !Array.isArray(e) && typeof e == 'object' && (e = Object.keys(e)), e.forEach(t);
                    }
                    var a,
                      l,
                      c,
                      d,
                      A,
                      O,
                      M = {},
                      P = {};
                    (i = r.clone(i)),
                      f.reset(),
                      i && i.scope
                        ? (p.scope = i.scope)
                        : ((p.errors = []),
                          (p.undefs = []),
                          (p.internals = []),
                          (p.blacklist = {}),
                          (p.scope = '(main)')),
                      (S = Object.create(null)),
                      D(S, s.ecmaIdentifiers[3]),
                      D(S, s.reservedVars),
                      D(S, o || {}),
                      (n = Object.create(null));
                    var j = Object.create(null);
                    if (i) {
                      U(i.predef || null, function(e) {
                        var t, n;
                        e[0] === '-'
                          ? ((t = e.slice(1)), (p.blacklist[t] = t), delete S[t])
                          : ((n = Object.getOwnPropertyDescriptor(i.predef, e)), (S[e] = n ? n.value : !1));
                      }),
                        U(i.exported || null, function(e) {
                          j[e] = !0;
                        }),
                        delete i.predef,
                        delete i.exported,
                        (O = Object.keys(i));
                      for (c = 0; c < O.length; c++)
                        if (/^-W\d{3}$/g.test(O[c])) P[O[c].slice(1)] = !0;
                        else {
                          var z = O[c];
                          (M[z] = i[z]),
                            ((z === 'esversion' && i[z] === 5) || (z === 'es5' && i[z])) && F('I003'),
                            O[c] === 'newcap' && i[z] === !1 && (M['(explicitNewcap)'] = !0);
                        }
                    }
                    (f.option = M),
                      (f.ignored = P),
                      (f.option.indent = f.option.indent || 4),
                      (f.option.maxerr = f.option.maxerr || 50),
                      (g = 1);
                    var W = h(f, S, j, n);
                    W.on('warning', function(e) {
                      F.apply(null, [e.code, e.token].concat(e.data));
                    }),
                      W.on('error', function(e) {
                        q.apply(null, [e.code, e.token].concat(e.data));
                      }),
                      (f.funct = Rt('(global)', null, {
                        '(global)': !0,
                        '(scope)': W,
                        '(comparray)': vn(),
                        '(metrics)': Vt(f.tokens.next)
                      })),
                      (v = [f.funct]),
                      (T = []),
                      (x = null),
                      (w = {}),
                      (E = null),
                      (m = !1),
                      (y = []);
                    if (!L(t) && !Array.isArray(t)) return R('E004', 0), !1;
                    (e = {
                      get isJSON() {
                        return f.jsonMode;
                      },
                      getOption: function(e) {
                        return f.option[e] || null;
                      },
                      getCache: function(e) {
                        return f.cache[e];
                      },
                      setCache: function(e, t) {
                        f.cache[e] = t;
                      },
                      warn: function(e, t) {
                        I.apply(null, [e, t.line, t.char].concat(t.data));
                      },
                      on: function(e, t) {
                        e.split(' ').forEach(
                          function(e) {
                            C.on(e, t);
                          }.bind(this)
                        );
                      }
                    }),
                      C.removeAllListeners(),
                      (N || []).forEach(function(t) {
                        t(e);
                      }),
                      (f.tokens.prev = f.tokens.curr = f.tokens.next = f.syntax['(begin)']),
                      i &&
                        i.ignoreDelimiters &&
                        (Array.isArray(i.ignoreDelimiters) || (i.ignoreDelimiters = [i.ignoreDelimiters]),
                        i.ignoreDelimiters.forEach(function(e) {
                          if (!e.start || !e.end) return;
                          (d = gn(e.start) + '[\\s\\S]*?' + gn(e.end)),
                            (A = new RegExp(d, 'ig')),
                            (t = t.replace(A, function(e) {
                              return e.replace(/./g, ' ');
                            }));
                        })),
                      (b = new u(t)),
                      b.on('warning', function(e) {
                        I.apply(null, [e.code, e.line, e.character].concat(e.data));
                      }),
                      b.on('error', function(e) {
                        R.apply(null, [e.code, e.line, e.character].concat(e.data));
                      }),
                      b.on('fatal', function(e) {
                        B('E041', e.line, e.from);
                      }),
                      b.on('Identifier', function(e) {
                        C.emit('Identifier', e);
                      }),
                      b.on('String', function(e) {
                        C.emit('String', e);
                      }),
                      b.on('Number', function(e) {
                        C.emit('Number', e);
                      }),
                      b.start();
                    for (var X in i) r.has(i, X) && k(X, f.tokens.curr);
                    H(), D(S, o || {}), (tt.first = !0);
                    try {
                      V();
                      switch (f.tokens.next.id) {
                        case '{':
                        case '[':
                          dn();
                          break;
                        default:
                          Mt(),
                            f.directive['use strict'] && f.option.strict !== 'global' && F('W097', f.tokens.prev),
                            Ot();
                      }
                      f.tokens.next.id !== '(end)' && B('E041', f.tokens.curr.line), f.funct['(scope)'].unstack();
                    } catch ($) {
                      if (!$ || $.name !== 'JSHintError') throw $;
                      var J = f.tokens.next || {};
                      p.errors.push(
                        {
                          scope: '(main)',
                          raw: $.raw,
                          code: $.code,
                          reason: $.message,
                          line: $.line || J.line,
                          character: $.character || J.from
                        },
                        null
                      );
                    }
                    if (p.scope === '(main)') {
                      i = i || {};
                      for (a = 0; a < p.internals.length; a += 1)
                        (l = p.internals[a]), (i.scope = l.elem), yn(l.value, i, o);
                    }
                    return p.errors.length === 0;
                  };
                return (
                  (yn.addModule = function(e) {
                    N.push(e);
                  }),
                  yn.addModule(l.register),
                  (yn.data = function() {
                    var e = { functions: [], options: f.option },
                      t,
                      n,
                      r,
                      i,
                      s,
                      o;
                    yn.errors.length && (e.errors = yn.errors), f.jsonMode && (e.json = !0);
                    var u = f.funct['(scope)'].getImpliedGlobals();
                    u.length > 0 && (e.implieds = u),
                      T.length > 0 && (e.urls = T),
                      (o = f.funct['(scope)'].getUsedOrDefinedGlobals()),
                      o.length > 0 && (e.globals = o);
                    for (r = 1; r < v.length; r += 1) {
                      (n = v[r]), (t = {});
                      for (i = 0; i < d.length; i += 1) t[d[i]] = [];
                      for (i = 0; i < d.length; i += 1) t[d[i]].length === 0 && delete t[d[i]];
                      (t.name = n['(name)']),
                        (t.param = n['(params)']),
                        (t.line = n['(line)']),
                        (t.character = n['(character)']),
                        (t.last = n['(last)']),
                        (t.lastcharacter = n['(lastcharacter)']),
                        (t.metrics = {
                          complexity: n['(metrics)'].ComplexityCount,
                          parameters: n['(metrics)'].arity,
                          statements: n['(metrics)'].statementCount
                        }),
                        e.functions.push(t);
                    }
                    var a = f.funct['(scope)'].getUnuseds();
                    a.length > 0 && (e.unused = a);
                    for (s in w)
                      if (typeof w[s] == 'number') {
                        e.member = w;
                        break;
                      }
                    return e;
                  }),
                  (yn.jshint = yn),
                  yn
                );
              })();
            typeof n == 'object' && n && (n.JSHINT = p);
          },
          {
            '../lodash': '/node_modules/jshint/lodash.js',
            './lex.js': '/node_modules/jshint/src/lex.js',
            './messages.js': '/node_modules/jshint/src/messages.js',
            './options.js': '/node_modules/jshint/src/options.js',
            './reg.js': '/node_modules/jshint/src/reg.js',
            './scope-manager.js': '/node_modules/jshint/src/scope-manager.js',
            './state.js': '/node_modules/jshint/src/state.js',
            './style.js': '/node_modules/jshint/src/style.js',
            './vars.js': '/node_modules/jshint/src/vars.js',
            events: '/node_modules/browserify/node_modules/events/events.js'
          }
        ],
        '/node_modules/jshint/src/lex.js': [
          function(e, t, n) {
            'use strict';
            function h() {
              var e = [];
              return {
                push: function(t) {
                  e.push(t);
                },
                check: function() {
                  for (var t = 0; t < e.length; ++t) e[t]();
                  e.splice(0, e.length);
                }
              };
            }
            function p(e) {
              var t = e;
              typeof t == 'string' &&
                (t = t
                  .replace(/\r\n/g, '\n')
                  .replace(/\r/g, '\n')
                  .split('\n')),
                t[0] &&
                  t[0].substr(0, 2) === '#!' &&
                  (t[0].indexOf('node') !== -1 && (o.option.node = !0), (t[0] = '')),
                (this.emitter = new i.EventEmitter()),
                (this.source = e),
                this.setLines(t),
                (this.prereg = !0),
                (this.line = 0),
                (this.char = 1),
                (this.from = 1),
                (this.input = ''),
                (this.inComment = !1),
                (this.context = []),
                (this.templateStarts = []);
              for (var n = 0; n < o.option.indent; n += 1) o.tab += ' ';
              this.ignoreLinterErrors = !1;
            }
            var r = e('../lodash'),
              i = e('events'),
              s = e('./reg.js'),
              o = e('./state.js').state,
              u = e('../data/ascii-identifier-data.js'),
              a = u.asciiIdentifierStartTable,
              f = u.asciiIdentifierPartTable,
              l = {
                Identifier: 1,
                Punctuator: 2,
                NumericLiteral: 3,
                StringLiteral: 4,
                Comment: 5,
                Keyword: 6,
                NullLiteral: 7,
                BooleanLiteral: 8,
                RegExp: 9,
                TemplateHead: 10,
                TemplateMiddle: 11,
                TemplateTail: 12,
                NoSubstTemplate: 13
              },
              c = { Block: 1, Template: 2 };
            (p.prototype = {
              _lines: [],
              inContext: function(e) {
                return this.context.length > 0 && this.context[this.context.length - 1].type === e;
              },
              pushContext: function(e) {
                this.context.push({ type: e });
              },
              popContext: function() {
                return this.context.pop();
              },
              isContext: function(e) {
                return this.context.length > 0 && this.context[this.context.length - 1] === e;
              },
              currentContext: function() {
                return this.context.length > 0 && this.context[this.context.length - 1];
              },
              getLines: function() {
                return (this._lines = o.lines), this._lines;
              },
              setLines: function(e) {
                (this._lines = e), (o.lines = this._lines);
              },
              peek: function(e) {
                return this.input.charAt(e || 0);
              },
              skip: function(e) {
                (e = e || 1), (this.char += e), (this.input = this.input.slice(e));
              },
              on: function(e, t) {
                e.split(' ').forEach(
                  function(e) {
                    this.emitter.on(e, t);
                  }.bind(this)
                );
              },
              trigger: function() {
                this.emitter.emit.apply(this.emitter, Array.prototype.slice.call(arguments));
              },
              triggerAsync: function(e, t, n, r) {
                n.push(
                  function() {
                    r() && this.trigger(e, t);
                  }.bind(this)
                );
              },
              scanPunctuator: function() {
                var e = this.peek(),
                  t,
                  n,
                  r;
                switch (e) {
                  case '.':
                    if (/^[0-9]$/.test(this.peek(1))) return null;
                    if (this.peek(1) === '.' && this.peek(2) === '.') return { type: l.Punctuator, value: '...' };
                  case '(':
                  case ')':
                  case ';':
                  case ',':
                  case '[':
                  case ']':
                  case ':':
                  case '~':
                  case '?':
                    return { type: l.Punctuator, value: e };
                  case '{':
                    return this.pushContext(c.Block), { type: l.Punctuator, value: e };
                  case '}':
                    return this.inContext(c.Block) && this.popContext(), { type: l.Punctuator, value: e };
                  case '#':
                    return { type: l.Punctuator, value: e };
                  case '':
                    return null;
                }
                return (
                  (t = this.peek(1)),
                  (n = this.peek(2)),
                  (r = this.peek(3)),
                  e === '>' && t === '>' && n === '>' && r === '='
                    ? { type: l.Punctuator, value: '>>>=' }
                    : e === '=' && t === '=' && n === '='
                    ? { type: l.Punctuator, value: '===' }
                    : e === '!' && t === '=' && n === '='
                    ? { type: l.Punctuator, value: '!==' }
                    : e === '>' && t === '>' && n === '>'
                    ? { type: l.Punctuator, value: '>>>' }
                    : e === '<' && t === '<' && n === '='
                    ? { type: l.Punctuator, value: '<<=' }
                    : e === '>' && t === '>' && n === '='
                    ? { type: l.Punctuator, value: '>>=' }
                    : e === '=' && t === '>'
                    ? { type: l.Punctuator, value: e + t }
                    : e === t && '+-<>&|'.indexOf(e) >= 0
                    ? { type: l.Punctuator, value: e + t }
                    : '<>=!+-*%&|^'.indexOf(e) >= 0
                    ? t === '='
                      ? { type: l.Punctuator, value: e + t }
                      : { type: l.Punctuator, value: e }
                    : e === '/'
                    ? t === '='
                      ? { type: l.Punctuator, value: '/=' }
                      : { type: l.Punctuator, value: '/' }
                    : null
                );
              },
              scanComments: function() {
                function u(e, t, n) {
                  var r = ['jshint', 'jslint', 'members', 'member', 'globals', 'global', 'exported'],
                    i = !1,
                    u = e + t,
                    a = 'plain';
                  return (
                    (n = n || {}),
                    n.isMultiline && (u += '*/'),
                    (t = t.replace(/\n/g, ' ')),
                    e === '/*' && s.fallsThrough.test(t) && ((i = !0), (a = 'falls through')),
                    r.forEach(function(n) {
                      if (i) return;
                      if (e === '//' && n !== 'jshint') return;
                      t.charAt(n.length) === ' ' &&
                        t.substr(0, n.length) === n &&
                        ((i = !0), (e += n), (t = t.substr(n.length))),
                        !i &&
                          t.charAt(0) === ' ' &&
                          t.charAt(n.length + 1) === ' ' &&
                          t.substr(1, n.length) === n &&
                          ((i = !0), (e = e + ' ' + n), (t = t.substr(n.length + 1)));
                      if (!i) return;
                      switch (n) {
                        case 'member':
                          a = 'members';
                          break;
                        case 'global':
                          a = 'globals';
                          break;
                        default:
                          var r = t.split(':').map(function(e) {
                            return e.replace(/^\s+/, '').replace(/\s+$/, '');
                          });
                          if (r.length === 2)
                            switch (r[0]) {
                              case 'ignore':
                                switch (r[1]) {
                                  case 'start':
                                    (o.ignoringLinterErrors = !0), (i = !1);
                                    break;
                                  case 'end':
                                    (o.ignoringLinterErrors = !1), (i = !1);
                                }
                            }
                          a = n;
                      }
                    }),
                    {
                      type: l.Comment,
                      commentType: a,
                      value: u,
                      body: t,
                      isSpecial: i,
                      isMultiline: n.isMultiline || !1,
                      isMalformed: n.isMalformed || !1
                    }
                  );
                }
                var e = this.peek(),
                  t = this.peek(1),
                  n = this.input.substr(2),
                  r = this.line,
                  i = this.char,
                  o = this;
                if (e === '*' && t === '/')
                  return this.trigger('error', { code: 'E018', line: r, character: i }), this.skip(2), null;
                if (e !== '/' || (t !== '*' && t !== '/')) return null;
                if (t === '/') return this.skip(this.input.length), u('//', n);
                var a = '';
                if (t === '*') {
                  (this.inComment = !0), this.skip(2);
                  while (this.peek() !== '*' || this.peek(1) !== '/')
                    if (this.peek() === '') {
                      a += '\n';
                      if (!this.nextLine())
                        return (
                          this.trigger('error', { code: 'E017', line: r, character: i }),
                          (this.inComment = !1),
                          u('/*', a, { isMultiline: !0, isMalformed: !0 })
                        );
                    } else (a += this.peek()), this.skip();
                  return this.skip(2), (this.inComment = !1), u('/*', a, { isMultiline: !0 });
                }
              },
              scanKeyword: function() {
                var e = /^[a-zA-Z_$][a-zA-Z0-9_$]*/.exec(this.input),
                  t = [
                    'if',
                    'in',
                    'do',
                    'var',
                    'for',
                    'new',
                    'try',
                    'let',
                    'this',
                    'else',
                    'case',
                    'void',
                    'with',
                    'enum',
                    'while',
                    'break',
                    'catch',
                    'throw',
                    'const',
                    'yield',
                    'class',
                    'super',
                    'return',
                    'typeof',
                    'delete',
                    'switch',
                    'export',
                    'import',
                    'default',
                    'finally',
                    'extends',
                    'function',
                    'continue',
                    'debugger',
                    'instanceof'
                  ];
                return e && t.indexOf(e[0]) >= 0 ? { type: l.Keyword, value: e[0] } : null;
              },
              scanIdentifier: function() {
                function i(e) {
                  return e > 256;
                }
                function s(e) {
                  return e > 256;
                }
                function o(e) {
                  return /^[0-9a-fA-F]$/.test(e);
                }
                function p(e) {
                  return e.replace(/\\u([0-9a-fA-F]{4})/g, function(e, t) {
                    return String.fromCharCode(parseInt(t, 16));
                  });
                }
                var e = '',
                  t = 0,
                  n,
                  r,
                  u = function() {
                    t += 1;
                    if (this.peek(t) !== 'u') return null;
                    var e = this.peek(t + 1),
                      n = this.peek(t + 2),
                      r = this.peek(t + 3),
                      i = this.peek(t + 4),
                      u;
                    return o(e) && o(n) && o(r) && o(i)
                      ? ((u = parseInt(e + n + r + i, 16)), f[u] || s(u) ? ((t += 5), '\\u' + e + n + r + i) : null)
                      : null;
                  }.bind(this),
                  c = function() {
                    var e = this.peek(t),
                      n = e.charCodeAt(0);
                    return n === 92 ? u() : n < 128 ? (a[n] ? ((t += 1), e) : null) : i(n) ? ((t += 1), e) : null;
                  }.bind(this),
                  h = function() {
                    var e = this.peek(t),
                      n = e.charCodeAt(0);
                    return n === 92 ? u() : n < 128 ? (f[n] ? ((t += 1), e) : null) : s(n) ? ((t += 1), e) : null;
                  }.bind(this);
                r = c();
                if (r === null) return null;
                e = r;
                for (;;) {
                  r = h();
                  if (r === null) break;
                  e += r;
                }
                switch (e) {
                  case 'true':
                  case 'false':
                    n = l.BooleanLiteral;
                    break;
                  case 'null':
                    n = l.NullLiteral;
                    break;
                  default:
                    n = l.Identifier;
                }
                return { type: n, value: p(e), text: e, tokenLength: e.length };
              },
              scanNumericLiteral: function() {
                function f(e) {
                  return /^[0-9]$/.test(e);
                }
                function c(e) {
                  return /^[0-7]$/.test(e);
                }
                function h(e) {
                  return /^[01]$/.test(e);
                }
                function p(e) {
                  return /^[0-9a-fA-F]$/.test(e);
                }
                function d(e) {
                  return e === '$' || e === '_' || e === '\\' || (e >= 'a' && e <= 'z') || (e >= 'A' && e <= 'Z');
                }
                var e = 0,
                  t = '',
                  n = this.input.length,
                  r = this.peek(e),
                  i,
                  s = f,
                  u = 10,
                  a = !1;
                if (r !== '.' && !f(r)) return null;
                if (r !== '.') {
                  (t = this.peek(e)), (e += 1), (r = this.peek(e));
                  if (t === '0') {
                    if (r === 'x' || r === 'X') (s = p), (u = 16), (e += 1), (t += r);
                    if (r === 'o' || r === 'O')
                      (s = c),
                        (u = 8),
                        o.inES6(!0) ||
                          this.trigger('warning', {
                            code: 'W119',
                            line: this.line,
                            character: this.char,
                            data: ['Octal integer literal', '6']
                          }),
                        (e += 1),
                        (t += r);
                    if (r === 'b' || r === 'B')
                      (s = h),
                        (u = 2),
                        o.inES6(!0) ||
                          this.trigger('warning', {
                            code: 'W119',
                            line: this.line,
                            character: this.char,
                            data: ['Binary integer literal', '6']
                          }),
                        (e += 1),
                        (t += r);
                    c(r) && ((s = c), (u = 8), (a = !0), (i = !1), (e += 1), (t += r)),
                      !c(r) && f(r) && ((e += 1), (t += r));
                  }
                  while (e < n) {
                    r = this.peek(e);
                    if (a && f(r)) i = !0;
                    else if (!s(r)) break;
                    (t += r), (e += 1);
                  }
                  if (s !== f) {
                    if (!a && t.length <= 2) return { type: l.NumericLiteral, value: t, isMalformed: !0 };
                    if (e < n) {
                      r = this.peek(e);
                      if (d(r)) return null;
                    }
                    return { type: l.NumericLiteral, value: t, base: u, isLegacy: a, isMalformed: !1 };
                  }
                }
                if (r === '.') {
                  (t += r), (e += 1);
                  while (e < n) {
                    r = this.peek(e);
                    if (!f(r)) break;
                    (t += r), (e += 1);
                  }
                }
                if (r === 'e' || r === 'E') {
                  (t += r), (e += 1), (r = this.peek(e));
                  if (r === '+' || r === '-') (t += this.peek(e)), (e += 1);
                  r = this.peek(e);
                  if (!f(r)) return null;
                  (t += r), (e += 1);
                  while (e < n) {
                    r = this.peek(e);
                    if (!f(r)) break;
                    (t += r), (e += 1);
                  }
                }
                if (e < n) {
                  r = this.peek(e);
                  if (d(r)) return null;
                }
                return { type: l.NumericLiteral, value: t, base: u, isMalformed: !isFinite(t) };
              },
              scanEscapeSequence: function(e) {
                var t = !1,
                  n = 1;
                this.skip();
                var r = this.peek();
                switch (r) {
                  case "'":
                    this.triggerAsync(
                      'warning',
                      { code: 'W114', line: this.line, character: this.char, data: ["\\'"] },
                      e,
                      function() {
                        return o.jsonMode;
                      }
                    );
                    break;
                  case 'b':
                    r = '\\b';
                    break;
                  case 'f':
                    r = '\\f';
                    break;
                  case 'n':
                    r = '\\n';
                    break;
                  case 'r':
                    r = '\\r';
                    break;
                  case 't':
                    r = '\\t';
                    break;
                  case '0':
                    r = '\\0';
                    var i = parseInt(this.peek(1), 10);
                    this.triggerAsync(
                      'warning',
                      { code: 'W115', line: this.line, character: this.char },
                      e,
                      function() {
                        return i >= 0 && i <= 7 && o.isStrict();
                      }
                    );
                    break;
                  case 'u':
                    var s = this.input.substr(1, 4),
                      u = parseInt(s, 16);
                    isNaN(u) &&
                      this.trigger('warning', { code: 'W052', line: this.line, character: this.char, data: ['u' + s] }),
                      (r = String.fromCharCode(u)),
                      (n = 5);
                    break;
                  case 'v':
                    this.triggerAsync(
                      'warning',
                      { code: 'W114', line: this.line, character: this.char, data: ['\\v'] },
                      e,
                      function() {
                        return o.jsonMode;
                      }
                    ),
                      (r = '\x0b');
                    break;
                  case 'x':
                    var a = parseInt(this.input.substr(1, 2), 16);
                    this.triggerAsync(
                      'warning',
                      { code: 'W114', line: this.line, character: this.char, data: ['\\x-'] },
                      e,
                      function() {
                        return o.jsonMode;
                      }
                    ),
                      (r = String.fromCharCode(a)),
                      (n = 3);
                    break;
                  case '\\':
                    r = '\\\\';
                    break;
                  case '"':
                    r = '\\"';
                    break;
                  case '/':
                    break;
                  case '':
                    (t = !0), (r = '');
                }
                return { char: r, jump: n, allowNewLine: t };
              },
              scanTemplateLiteral: function(e) {
                var t,
                  n = '',
                  r,
                  i = this.line,
                  s = this.char,
                  u = this.templateStarts.length;
                if (!o.inES6(!0)) return null;
                if (this.peek() === '`')
                  (t = l.TemplateHead),
                    this.templateStarts.push({ line: this.line, char: this.char }),
                    (u = this.templateStarts.length),
                    this.skip(1),
                    this.pushContext(c.Template);
                else {
                  if (!this.inContext(c.Template) || this.peek() !== '}') return null;
                  t = l.TemplateMiddle;
                }
                while (this.peek() !== '`') {
                  while ((r = this.peek()) === '') {
                    n += '\n';
                    if (!this.nextLine()) {
                      var a = this.templateStarts.pop();
                      return (
                        this.trigger('error', { code: 'E052', line: a.line, character: a.char }),
                        {
                          type: t,
                          value: n,
                          startLine: i,
                          startChar: s,
                          isUnclosed: !0,
                          depth: u,
                          context: this.popContext()
                        }
                      );
                    }
                  }
                  if (r === '$' && this.peek(1) === '{')
                    return (
                      (n += '${'),
                      this.skip(2),
                      {
                        type: t,
                        value: n,
                        startLine: i,
                        startChar: s,
                        isUnclosed: !1,
                        depth: u,
                        context: this.currentContext()
                      }
                    );
                  if (r === '\\') {
                    var f = this.scanEscapeSequence(e);
                    (n += f.char), this.skip(f.jump);
                  } else r !== '`' && ((n += r), this.skip(1));
                }
                return (
                  (t = t === l.TemplateHead ? l.NoSubstTemplate : l.TemplateTail),
                  this.skip(1),
                  this.templateStarts.pop(),
                  {
                    type: t,
                    value: n,
                    startLine: i,
                    startChar: s,
                    isUnclosed: !1,
                    depth: u,
                    context: this.popContext()
                  }
                );
              },
              scanStringLiteral: function(e) {
                var t = this.peek();
                if (t !== '"' && t !== "'") return null;
                this.triggerAsync('warning', { code: 'W108', line: this.line, character: this.char }, e, function() {
                  return o.jsonMode && t !== '"';
                });
                var n = '',
                  r = this.line,
                  i = this.char,
                  s = !1;
                this.skip();
                while (this.peek() !== t)
                  if (this.peek() === '') {
                    s
                      ? ((s = !1),
                        this.triggerAsync(
                          'warning',
                          { code: 'W043', line: this.line, character: this.char },
                          e,
                          function() {
                            return !o.option.multistr;
                          }
                        ),
                        this.triggerAsync(
                          'warning',
                          { code: 'W042', line: this.line, character: this.char },
                          e,
                          function() {
                            return o.jsonMode && o.option.multistr;
                          }
                        ))
                      : this.trigger('warning', { code: 'W112', line: this.line, character: this.char });
                    if (!this.nextLine())
                      return (
                        this.trigger('error', { code: 'E029', line: r, character: i }),
                        { type: l.StringLiteral, value: n, startLine: r, startChar: i, isUnclosed: !0, quote: t }
                      );
                  } else {
                    s = !1;
                    var u = this.peek(),
                      a = 1;
                    u < ' ' &&
                      this.trigger('warning', {
                        code: 'W113',
                        line: this.line,
                        character: this.char,
                        data: ['<non-printable>']
                      });
                    if (u === '\\') {
                      var f = this.scanEscapeSequence(e);
                      (u = f.char), (a = f.jump), (s = f.allowNewLine);
                    }
                    (n += u), this.skip(a);
                  }
                return (
                  this.skip(), { type: l.StringLiteral, value: n, startLine: r, startChar: i, isUnclosed: !1, quote: t }
                );
              },
              scanRegExp: function() {
                var e = 0,
                  t = this.input.length,
                  n = this.peek(),
                  r = n,
                  i = '',
                  s = [],
                  o = !1,
                  u = !1,
                  a,
                  f = function() {
                    n < ' ' &&
                      ((o = !0), this.trigger('warning', { code: 'W048', line: this.line, character: this.char })),
                      n === '<' &&
                        ((o = !0),
                        this.trigger('warning', { code: 'W049', line: this.line, character: this.char, data: [n] }));
                  }.bind(this);
                if (!this.prereg || n !== '/') return null;
                (e += 1), (a = !1);
                while (e < t) {
                  (n = this.peek(e)), (r += n), (i += n);
                  if (u) {
                    n === ']' && (this.peek(e - 1) !== '\\' || this.peek(e - 2) === '\\') && (u = !1),
                      n === '\\' && ((e += 1), (n = this.peek(e)), (i += n), (r += n), f()),
                      (e += 1);
                    continue;
                  }
                  if (n === '\\') {
                    (e += 1), (n = this.peek(e)), (i += n), (r += n), f();
                    if (n === '/') {
                      e += 1;
                      continue;
                    }
                    if (n === '[') {
                      e += 1;
                      continue;
                    }
                  }
                  if (n === '[') {
                    (u = !0), (e += 1);
                    continue;
                  }
                  if (n === '/') {
                    (i = i.substr(0, i.length - 1)), (a = !0), (e += 1);
                    break;
                  }
                  e += 1;
                }
                if (!a)
                  return (
                    this.trigger('error', { code: 'E015', line: this.line, character: this.from }),
                    void this.trigger('fatal', { line: this.line, from: this.from })
                  );
                while (e < t) {
                  n = this.peek(e);
                  if (!/[gim]/.test(n)) break;
                  s.push(n), (r += n), (e += 1);
                }
                try {
                  new RegExp(i, s.join(''));
                } catch (c) {
                  (o = !0),
                    this.trigger('error', { code: 'E016', line: this.line, character: this.char, data: [c.message] });
                }
                return { type: l.RegExp, value: r, flags: s, isMalformed: o };
              },
              scanNonBreakingSpaces: function() {
                return o.option.nonbsp ? this.input.search(/(\u00A0)/) : -1;
              },
              scanUnsafeChars: function() {
                return this.input.search(s.unsafeChars);
              },
              next: function(e) {
                this.from = this.char;
                var t;
                if (/\s/.test(this.peek())) {
                  t = this.char;
                  while (/\s/.test(this.peek())) (this.from += 1), this.skip();
                }
                var n = this.scanComments() || this.scanStringLiteral(e) || this.scanTemplateLiteral(e);
                return n
                  ? n
                  : ((n =
                      this.scanRegExp() ||
                      this.scanPunctuator() ||
                      this.scanKeyword() ||
                      this.scanIdentifier() ||
                      this.scanNumericLiteral()),
                    n ? (this.skip(n.tokenLength || n.value.length), n) : null);
              },
              nextLine: function() {
                var e;
                if (this.line >= this.getLines().length) return !1;
                (this.input = this.getLines()[this.line]), (this.line += 1), (this.char = 1), (this.from = 1);
                var t = this.input.trim(),
                  n = function() {
                    return r.some(arguments, function(e) {
                      return t.indexOf(e) === 0;
                    });
                  },
                  i = function() {
                    return r.some(arguments, function(e) {
                      return t.indexOf(e, t.length - e.length) !== -1;
                    });
                  };
                this.ignoringLinterErrors === !0 &&
                  !n('/*', '//') &&
                  (!this.inComment || !i('*/')) &&
                  (this.input = ''),
                  (e = this.scanNonBreakingSpaces()),
                  e >= 0 && this.trigger('warning', { code: 'W125', line: this.line, character: e + 1 }),
                  (this.input = this.input.replace(/\t/g, o.tab)),
                  (e = this.scanUnsafeChars()),
                  e >= 0 && this.trigger('warning', { code: 'W100', line: this.line, character: e });
                if (!this.ignoringLinterErrors && o.option.maxlen && o.option.maxlen < this.input.length) {
                  var u = this.inComment || n.call(t, '//') || n.call(t, '/*'),
                    a = !u || !s.maxlenException.test(t);
                  a && this.trigger('warning', { code: 'W101', line: this.line, character: this.input.length });
                }
                return !0;
              },
              start: function() {
                this.nextLine();
              },
              token: function() {
                function n(e, t) {
                  if (!e.reserved) return !1;
                  var n = e.meta;
                  if (n && n.isFutureReservedWord && o.inES5()) {
                    if (!n.es5) return !1;
                    if (n.strictOnly && !o.option.strict && !o.isStrict()) return !1;
                    if (t) return !1;
                  }
                  return !0;
                }
                var e = h(),
                  t,
                  i = function(t, i, s, u) {
                    var a;
                    t !== '(endline)' && t !== '(end)' && (this.prereg = !1);
                    if (t === '(punctuator)') {
                      switch (i) {
                        case '.':
                        case ')':
                        case '~':
                        case '#':
                        case ']':
                        case '++':
                        case '--':
                          this.prereg = !1;
                          break;
                        default:
                          this.prereg = !0;
                      }
                      a = Object.create(o.syntax[i] || o.syntax['(error)']);
                    }
                    if (t === '(identifier)') {
                      if (i === 'return' || i === 'case' || i === 'typeof') this.prereg = !0;
                      r.has(o.syntax, i) &&
                        ((a = Object.create(o.syntax[i] || o.syntax['(error)'])),
                        n(a, s && t === '(identifier)') || (a = null));
                    }
                    return (
                      a || (a = Object.create(o.syntax[t])),
                      (a.identifier = t === '(identifier)'),
                      (a.type = a.type || t),
                      (a.value = i),
                      (a.line = this.line),
                      (a.character = this.char),
                      (a.from = this.from),
                      a.identifier && u && (a.raw_text = u.text || u.value),
                      u && u.startLine && u.startLine !== this.line && (a.startLine = u.startLine),
                      u && u.context && (a.context = u.context),
                      u && u.depth && (a.depth = u.depth),
                      u && u.isUnclosed && (a.isUnclosed = u.isUnclosed),
                      s && a.identifier && (a.isProperty = s),
                      (a.check = e.check),
                      a
                    );
                  }.bind(this);
                for (;;) {
                  if (!this.input.length)
                    return this.nextLine()
                      ? i('(endline)', '')
                      : this.exhausted
                      ? null
                      : ((this.exhausted = !0), i('(end)', ''));
                  t = this.next(e);
                  if (!t) {
                    this.input.length &&
                      (this.trigger('error', {
                        code: 'E024',
                        line: this.line,
                        character: this.char,
                        data: [this.peek()]
                      }),
                      (this.input = ''));
                    continue;
                  }
                  switch (t.type) {
                    case l.StringLiteral:
                      return (
                        this.triggerAsync(
                          'String',
                          {
                            line: this.line,
                            char: this.char,
                            from: this.from,
                            startLine: t.startLine,
                            startChar: t.startChar,
                            value: t.value,
                            quote: t.quote
                          },
                          e,
                          function() {
                            return !0;
                          }
                        ),
                        i('(string)', t.value, null, t)
                      );
                    case l.TemplateHead:
                      return (
                        this.trigger('TemplateHead', {
                          line: this.line,
                          char: this.char,
                          from: this.from,
                          startLine: t.startLine,
                          startChar: t.startChar,
                          value: t.value
                        }),
                        i('(template)', t.value, null, t)
                      );
                    case l.TemplateMiddle:
                      return (
                        this.trigger('TemplateMiddle', {
                          line: this.line,
                          char: this.char,
                          from: this.from,
                          startLine: t.startLine,
                          startChar: t.startChar,
                          value: t.value
                        }),
                        i('(template middle)', t.value, null, t)
                      );
                    case l.TemplateTail:
                      return (
                        this.trigger('TemplateTail', {
                          line: this.line,
                          char: this.char,
                          from: this.from,
                          startLine: t.startLine,
                          startChar: t.startChar,
                          value: t.value
                        }),
                        i('(template tail)', t.value, null, t)
                      );
                    case l.NoSubstTemplate:
                      return (
                        this.trigger('NoSubstTemplate', {
                          line: this.line,
                          char: this.char,
                          from: this.from,
                          startLine: t.startLine,
                          startChar: t.startChar,
                          value: t.value
                        }),
                        i('(no subst template)', t.value, null, t)
                      );
                    case l.Identifier:
                      this.triggerAsync(
                        'Identifier',
                        {
                          line: this.line,
                          char: this.char,
                          from: this.form,
                          name: t.value,
                          raw_name: t.text,
                          isProperty: o.tokens.curr.id === '.'
                        },
                        e,
                        function() {
                          return !0;
                        }
                      );
                    case l.Keyword:
                    case l.NullLiteral:
                    case l.BooleanLiteral:
                      return i('(identifier)', t.value, o.tokens.curr.id === '.', t);
                    case l.NumericLiteral:
                      return (
                        t.isMalformed &&
                          this.trigger('warning', {
                            code: 'W045',
                            line: this.line,
                            character: this.char,
                            data: [t.value]
                          }),
                        this.triggerAsync(
                          'warning',
                          { code: 'W114', line: this.line, character: this.char, data: ['0x-'] },
                          e,
                          function() {
                            return t.base === 16 && o.jsonMode;
                          }
                        ),
                        this.triggerAsync(
                          'warning',
                          { code: 'W115', line: this.line, character: this.char },
                          e,
                          function() {
                            return o.isStrict() && t.base === 8 && t.isLegacy;
                          }
                        ),
                        this.trigger('Number', {
                          line: this.line,
                          char: this.char,
                          from: this.from,
                          value: t.value,
                          base: t.base,
                          isMalformed: t.malformed
                        }),
                        i('(number)', t.value)
                      );
                    case l.RegExp:
                      return i('(regexp)', t.value);
                    case l.Comment:
                      o.tokens.curr.comment = !0;
                      if (t.isSpecial)
                        return {
                          id: '(comment)',
                          value: t.value,
                          body: t.body,
                          type: t.commentType,
                          isSpecial: t.isSpecial,
                          line: this.line,
                          character: this.char,
                          from: this.from
                        };
                      break;
                    case '':
                      break;
                    default:
                      return i('(punctuator)', t.value);
                  }
                }
              }
            }),
              (n.Lexer = p),
              (n.Context = c);
          },
          {
            '../data/ascii-identifier-data.js': '/node_modules/jshint/data/ascii-identifier-data.js',
            '../lodash': '/node_modules/jshint/lodash.js',
            './reg.js': '/node_modules/jshint/src/reg.js',
            './state.js': '/node_modules/jshint/src/state.js',
            events: '/node_modules/browserify/node_modules/events/events.js'
          }
        ],
        '/node_modules/jshint/src/messages.js': [
          function(e, t, n) {
            'use strict';
            var r = e('../lodash'),
              i = {
                E001: "Bad option: '{a}'.",
                E002: 'Bad option value.',
                E003: 'Expected a JSON value.',
                E004: 'Input is neither a string nor an array of strings.',
                E005: 'Input is empty.',
                E006: 'Unexpected early end of program.',
                E007: 'Missing "use strict" statement.',
                E008: 'Strict violation.',
                E009: "Option 'validthis' can't be used in a global scope.",
                E010: "'with' is not allowed in strict mode.",
                E011: "'{a}' has already been declared.",
                E012: "const '{a}' is initialized to 'undefined'.",
                E013: "Attempting to override '{a}' which is a constant.",
                E014: "A regular expression literal can be confused with '/='.",
                E015: 'Unclosed regular expression.',
                E016: 'Invalid regular expression.',
                E017: 'Unclosed comment.',
                E018: 'Unbegun comment.',
                E019: "Unmatched '{a}'.",
                E020: "Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
                E021: "Expected '{a}' and instead saw '{b}'.",
                E022: "Line breaking error '{a}'.",
                E023: "Missing '{a}'.",
                E024: "Unexpected '{a}'.",
                E025: "Missing ':' on a case clause.",
                E026: "Missing '}' to match '{' from line {a}.",
                E027: "Missing ']' to match '[' from line {a}.",
                E028: 'Illegal comma.',
                E029: 'Unclosed string.',
                E030: "Expected an identifier and instead saw '{a}'.",
                E031: 'Bad assignment.',
                E032: "Expected a small integer or 'false' and instead saw '{a}'.",
                E033: "Expected an operator and instead saw '{a}'.",
                E034: 'get/set are ES5 features.',
                E035: 'Missing property name.',
                E036: 'Expected to see a statement and instead saw a block.',
                E037: null,
                E038: null,
                E039: 'Function declarations are not invocable. Wrap the whole function invocation in parens.',
                E040: 'Each value should have its own case label.',
                E041: 'Unrecoverable syntax error.',
                E042: 'Stopping.',
                E043: 'Too many errors.',
                E044: null,
                E045: 'Invalid for each loop.',
                E046: 'A yield statement shall be within a generator function (with syntax: `function*`)',
                E047: null,
                E048: '{a} declaration not directly within block.',
                E049: "A {a} cannot be named '{b}'.",
                E050: 'Mozilla requires the yield expression to be parenthesized here.',
                E051: null,
                E052: 'Unclosed template literal.',
                E053: 'Export declaration must be in global scope.',
                E054: "Class properties must be methods. Expected '(' but instead saw '{a}'.",
                E055: "The '{a}' option cannot be set after any executable code.",
                E056: "'{a}' was used before it was declared, which is illegal for '{b}' variables.",
                E057: "Invalid meta property: '{a}.{b}'.",
                E058: 'Missing semicolon.'
              },
              s = {
                W001: "'hasOwnProperty' is a really bad name.",
                W002: "Value of '{a}' may be overwritten in IE 8 and earlier.",
                W003: "'{a}' was used before it was defined.",
                W004: "'{a}' is already defined.",
                W005: 'A dot following a number can be confused with a decimal point.',
                W006: 'Confusing minuses.',
                W007: 'Confusing plusses.',
                W008: "A leading decimal point can be confused with a dot: '{a}'.",
                W009: 'The array literal notation [] is preferable.',
                W010: 'The object literal notation {} is preferable.',
                W011: null,
                W012: null,
                W013: null,
                W014: "Bad line breaking before '{a}'.",
                W015: null,
                W016: "Unexpected use of '{a}'.",
                W017: 'Bad operand.',
                W018: "Confusing use of '{a}'.",
                W019: 'Use the isNaN function to compare with NaN.',
                W020: 'Read only.',
                W021:
                  "Reassignment of '{a}', which is is a {b}. Use 'var' or 'let' to declare bindings that may change.",
                W022: 'Do not assign to the exception parameter.',
                W023: 'Expected an identifier in an assignment and instead saw a function invocation.',
                W024: "Expected an identifier and instead saw '{a}' (a reserved word).",
                W025: 'Missing name in function declaration.',
                W026: 'Inner functions should be listed at the top of the outer function.',
                W027: "Unreachable '{a}' after '{b}'.",
                W028: "Label '{a}' on {b} statement.",
                W030: 'Expected an assignment or function call and instead saw an expression.',
                W031: "Do not use 'new' for side effects.",
                W032: 'Unnecessary semicolon.',
                W033: 'Missing semicolon.',
                W034: 'Unnecessary directive "{a}".',
                W035: 'Empty block.',
                W036: "Unexpected /*member '{a}'.",
                W037: "'{a}' is a statement label.",
                W038: "'{a}' used out of scope.",
                W039: "'{a}' is not allowed.",
                W040: 'Possible strict violation.',
                W041: "Use '{a}' to compare with '{b}'.",
                W042: 'Avoid EOL escaping.',
                W043: 'Bad escaping of EOL. Use option multistr if needed.',
                W044: 'Bad or unnecessary escaping.',
                W045: "Bad number '{a}'.",
                W046: "Don't use extra leading zeros '{a}'.",
                W047: "A trailing decimal point can be confused with a dot: '{a}'.",
                W048: 'Unexpected control character in regular expression.',
                W049: "Unexpected escaped character '{a}' in regular expression.",
                W050: 'JavaScript URL.',
                W051: 'Variables should not be deleted.',
                W052: "Unexpected '{a}'.",
                W053: 'Do not use {a} as a constructor.',
                W054: 'The Function constructor is a form of eval.',
                W055: 'A constructor name should start with an uppercase letter.',
                W056: 'Bad constructor.',
                W057: "Weird construction. Is 'new' necessary?",
                W058: "Missing '()' invoking a constructor.",
                W059: 'Avoid arguments.{a}.',
                W060: 'document.write can be a form of eval.',
                W061: 'eval can be harmful.',
                W062:
                  'Wrap an immediate function invocation in parens to assist the reader in understanding that the expression is the result of a function, and not the function itself.',
                W063: 'Math is not a function.',
                W064: "Missing 'new' prefix when invoking a constructor.",
                W065: 'Missing radix parameter.',
                W066: 'Implied eval. Consider passing a function instead of a string.',
                W067: 'Bad invocation.',
                W068: 'Wrapping non-IIFE function literals in parens is unnecessary.',
                W069: "['{a}'] is better written in dot notation.",
                W070: 'Extra comma. (it breaks older versions of IE)',
                W071: 'This function has too many statements. ({a})',
                W072: 'This function has too many parameters. ({a})',
                W073: 'Blocks are nested too deeply. ({a})',
                W074: "This function's cyclomatic complexity is too high. ({a})",
                W075: "Duplicate {a} '{b}'.",
                W076: "Unexpected parameter '{a}' in get {b} function.",
                W077: 'Expected a single parameter in set {a} function.',
                W078: 'Setter is defined without getter.',
                W079: "Redefinition of '{a}'.",
                W080: "It's not necessary to initialize '{a}' to 'undefined'.",
                W081: null,
                W082:
                  'Function declarations should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.',
                W083: "Don't make functions within a loop.",
                W084: 'Assignment in conditional expression',
                W085: "Don't use 'with'.",
                W086: "Expected a 'break' statement before '{a}'.",
                W087: "Forgotten 'debugger' statement?",
                W088: "Creating global 'for' variable. Should be 'for (var {a} ...'.",
                W089:
                  'The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.',
                W090: "'{a}' is not a statement label.",
                W091: null,
                W093: 'Did you mean to return a conditional instead of an assignment?',
                W094: 'Unexpected comma.',
                W095: 'Expected a string and instead saw {a}.',
                W096: "The '{a}' key may produce unexpected results.",
                W097: 'Use the function form of "use strict".',
                W098: "'{a}' is defined but never used.",
                W099: null,
                W100: 'This character may get silently deleted by one or more browsers.',
                W101: 'Line is too long.',
                W102: null,
                W103: "The '{a}' property is deprecated.",
                W104: "'{a}' is available in ES{b} (use 'esversion: {b}') or Mozilla JS extensions (use moz).",
                W105: "Unexpected {a} in '{b}'.",
                W106: "Identifier '{a}' is not in camel case.",
                W107: 'Script URL.',
                W108: 'Strings must use doublequote.',
                W109: 'Strings must use singlequote.',
                W110: 'Mixed double and single quotes.',
                W112: 'Unclosed string.',
                W113: 'Control character in string: {a}.',
                W114: 'Avoid {a}.',
                W115: 'Octal literals are not allowed in strict mode.',
                W116: "Expected '{a}' and instead saw '{b}'.",
                W117: "'{a}' is not defined.",
                W118: "'{a}' is only available in Mozilla JavaScript extensions (use moz option).",
                W119: "'{a}' is only available in ES{b} (use 'esversion: {b}').",
                W120: 'You might be leaking a variable ({a}) here.',
                W121: "Extending prototype of native object: '{a}'.",
                W122: "Invalid typeof value '{a}'",
                W123: "'{a}' is already defined in outer scope.",
                W124: 'A generator function shall contain a yield statement.',
                W125: 'This line contains non-breaking spaces: http://jshint.com/doc/options/#nonbsp',
                W126: 'Unnecessary grouping operator.',
                W127: 'Unexpected use of a comma operator.',
                W128: 'Empty array elements require elision=true.',
                W129:
                  "'{a}' is defined in a future version of JavaScript. Use a different variable name to avoid migration issues.",
                W130: 'Invalid element after rest element.',
                W131: 'Invalid parameter after rest parameter.',
                W132: '`var` declarations are forbidden. Use `let` or `const` instead.',
                W133: 'Invalid for-{a} loop left-hand-side: {b}.',
                W134: "The '{a}' option is only available when linting ECMAScript {b} code.",
                W135: '{a} may not be supported by non-browser environments.',
                W136: "'{a}' must be in function scope.",
                W137: 'Empty destructuring.',
                W138: 'Regular parameters should not come after default parameters.'
              },
              o = {
                I001: "Comma warnings can be turned off with 'laxcomma'.",
                I002: null,
                I003: 'ES5 option is now set per default'
              };
            (n.errors = {}),
              (n.warnings = {}),
              (n.info = {}),
              r.each(i, function(e, t) {
                n.errors[t] = { code: t, desc: e };
              }),
              r.each(s, function(e, t) {
                n.warnings[t] = { code: t, desc: e };
              }),
              r.each(o, function(e, t) {
                n.info[t] = { code: t, desc: e };
              });
          },
          { '../lodash': '/node_modules/jshint/lodash.js' }
        ],
        '/node_modules/jshint/src/name-stack.js': [
          function(e, t, n) {
            'use strict';
            function r() {
              this._stack = [];
            }
            Object.defineProperty(r.prototype, 'length', {
              get: function() {
                return this._stack.length;
              }
            }),
              (r.prototype.push = function() {
                this._stack.push(null);
              }),
              (r.prototype.pop = function() {
                this._stack.pop();
              }),
              (r.prototype.set = function(e) {
                this._stack[this.length - 1] = e;
              }),
              (r.prototype.infer = function() {
                var e = this._stack[this.length - 1],
                  t = '',
                  n;
                if (!e || e.type === 'class') e = this._stack[this.length - 2];
                return e
                  ? ((n = e.type),
                    n !== '(string)' && n !== '(number)' && n !== '(identifier)' && n !== 'default'
                      ? '(expression)'
                      : (e.accessorType && (t = e.accessorType + ' '), t + e.value))
                  : '(empty)';
              }),
              (t.exports = r);
          },
          {}
        ],
        '/node_modules/jshint/src/options.js': [
          function(e, t, n) {
            'use strict';
            (n.bool = {
              enforcing: {
                bitwise: !0,
                freeze: !0,
                camelcase: !0,
                curly: !0,
                eqeqeq: !0,
                futurehostile: !0,
                notypeof: !0,
                es3: !0,
                es5: !0,
                forin: !0,
                funcscope: !0,
                immed: !0,
                iterator: !0,
                newcap: !0,
                noarg: !0,
                nocomma: !0,
                noempty: !0,
                nonbsp: !0,
                nonew: !0,
                undef: !0,
                singleGroups: !1,
                varstmt: !1,
                enforceall: !1
              },
              relaxing: {
                asi: !0,
                multistr: !0,
                debug: !0,
                boss: !0,
                evil: !0,
                globalstrict: !0,
                plusplus: !0,
                proto: !0,
                scripturl: !0,
                sub: !0,
                supernew: !0,
                laxbreak: !0,
                laxcomma: !0,
                validthis: !0,
                withstmt: !0,
                moz: !0,
                noyield: !0,
                eqnull: !0,
                lastsemic: !0,
                loopfunc: !0,
                expr: !0,
                esnext: !0,
                elision: !0
              },
              environments: {
                mootools: !0,
                couch: !0,
                jasmine: !0,
                jquery: !0,
                node: !0,
                qunit: !0,
                rhino: !0,
                shelljs: !0,
                prototypejs: !0,
                yui: !0,
                mocha: !0,
                module: !0,
                wsh: !0,
                worker: !0,
                nonstandard: !0,
                browser: !0,
                browserify: !0,
                devel: !0,
                dojo: !0,
                typed: !0,
                phantom: !0
              },
              obsolete: { onecase: !0, regexp: !0, regexdash: !0 }
            }),
              (n.val = {
                maxlen: !1,
                indent: !1,
                maxerr: !1,
                predef: !1,
                globals: !1,
                quotmark: !1,
                scope: !1,
                maxstatements: !1,
                maxdepth: !1,
                maxparams: !1,
                maxcomplexity: !1,
                shadow: !1,
                strict: !0,
                unused: !0,
                latedef: !1,
                ignore: !1,
                ignoreDelimiters: !1,
                esversion: 5
              }),
              (n.inverted = {
                bitwise: !0,
                forin: !0,
                newcap: !0,
                plusplus: !0,
                regexp: !0,
                undef: !0,
                eqeqeq: !0,
                strict: !0
              }),
              (n.validNames = Object.keys(n.val)
                .concat(Object.keys(n.bool.relaxing))
                .concat(Object.keys(n.bool.enforcing))
                .concat(Object.keys(n.bool.obsolete))
                .concat(Object.keys(n.bool.environments))),
              (n.renamed = { eqeq: 'eqeqeq', windows: 'wsh', sloppy: 'strict' }),
              (n.removed = { nomen: !0, onevar: !0, passfail: !0, white: !0, gcl: !0, smarttabs: !0, trailing: !0 }),
              (n.noenforceall = { varstmt: !0, strict: !0 });
          },
          {}
        ],
        '/node_modules/jshint/src/reg.js': [
          function(e, t, n) {
            'use strict';
            (n.unsafeString = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i),
              (n.unsafeChars = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/),
              (n.needEsc = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/),
              (n.needEscGlobal = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g),
              (n.starSlash = /\*\//),
              (n.identifier = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/),
              (n.javascriptURL = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i),
              (n.fallsThrough = /^\s*falls?\sthrough\s*$/),
              (n.maxlenException = /^(?:(?:\/\/|\/\*|\*) ?)?[^ ]+$/);
          },
          {}
        ],
        '/node_modules/jshint/src/scope-manager.js': [
          function(e, t, n) {
            'use strict';
            var r = e('../lodash'),
              i = e('events'),
              s = {},
              o = function(e, t, n, o) {
                function f(e) {
                  (u = {
                    '(labels)': Object.create(null),
                    '(usages)': Object.create(null),
                    '(breakLabels)': Object.create(null),
                    '(parent)': u,
                    '(type)': e,
                    '(params)': e === 'functionparams' || e === 'catchparams' ? [] : null
                  }),
                    a.push(u);
                }
                function v(e, t) {
                  d.emit('warning', { code: e, token: t, data: r.slice(arguments, 2) });
                }
                function m(e, t) {
                  d.emit('warning', { code: e, token: t, data: r.slice(arguments, 2) });
                }
                function g(e) {
                  u['(usages)'][e] || (u['(usages)'][e] = { '(modified)': [], '(reassigned)': [], '(tokens)': [] });
                }
                function w() {
                  if (u['(type)'] === 'functionparams') {
                    E();
                    return;
                  }
                  var e = u['(labels)'];
                  for (var t in e)
                    e[t] && e[t]['(type)'] !== 'exception' && e[t]['(unused)'] && b(t, e[t]['(token)'], 'var');
                }
                function E() {
                  var t = u['(params)'];
                  if (!t) return;
                  var n = t.pop(),
                    r;
                  while (n) {
                    var i = u['(labels)'][n];
                    r = y(e.funct['(unusedOption)']);
                    if (n === 'undefined') return;
                    if (i['(unused)']) b(n, i['(token)'], 'param', e.funct['(unusedOption)']);
                    else if (r === 'last-param') return;
                    n = t.pop();
                  }
                }
                function S(e) {
                  for (var t = a.length - 1; t >= 0; --t) {
                    var n = a[t]['(labels)'];
                    if (n[e]) return n;
                  }
                }
                function x(e) {
                  for (var t = a.length - 1; t >= 0; t--) {
                    var n = a[t];
                    if (n['(usages)'][e]) return n['(usages)'][e];
                    if (n === l) break;
                  }
                  return !1;
                }
                function T(t, n) {
                  if (e.option.shadow !== 'outer') return;
                  var r = l['(type)'] === 'global',
                    i = u['(type)'] === 'functionparams',
                    s = !r;
                  for (var o = 0; o < a.length; o++) {
                    var f = a[o];
                    !i && a[o + 1] === l && (s = !1),
                      s && f['(labels)'][t] && v('W123', n, t),
                      f['(breakLabels)'][t] && v('W123', n, t);
                  }
                }
                function N(t, n, r) {
                  e.option.latedef &&
                    ((e.option.latedef === !0 && t === 'function') || t !== 'function') &&
                    v('W003', r, n);
                }
                var u,
                  a = [];
                f('global'), (u['(predefined)'] = t);
                var l = u,
                  c = Object.create(null),
                  h = Object.create(null),
                  p = [],
                  d = new i.EventEmitter(),
                  y = function(t) {
                    return t === undefined && (t = e.option.unused), t === !0 && (t = 'last-param'), t;
                  },
                  b = function(e, t, n, r) {
                    var i = t.line,
                      s = t.from,
                      o = t.raw_text || e;
                    r = y(r);
                    var u = { vars: ['var'], 'last-param': ['var', 'param'], strict: ['var', 'param', 'last-param'] };
                    r && u[r] && u[r].indexOf(n) !== -1 && v('W098', { line: i, from: s }, o),
                      (r || n === 'var') && p.push({ name: e, line: i, character: s });
                  },
                  C = {
                    on: function(e, t) {
                      e.split(' ').forEach(function(e) {
                        d.on(e, t);
                      });
                    },
                    isPredefined: function(e) {
                      return !this.has(e) && r.has(a[0]['(predefined)'], e);
                    },
                    stack: function(e) {
                      var t = u;
                      f(e),
                        !e &&
                          t['(type)'] === 'functionparams' &&
                          ((u['(isFuncBody)'] = !0), (u['(context)'] = l), (l = u));
                    },
                    unstack: function() {
                      var t = a.length > 1 ? a[a.length - 2] : null,
                        n = u === l,
                        i = u['(type)'] === 'functionparams',
                        f = u['(type)'] === 'functionouter',
                        p,
                        d,
                        g = u['(usages)'],
                        y = u['(labels)'],
                        E = Object.keys(g);
                      g.__proto__ && E.indexOf('__proto__') === -1 && E.push('__proto__');
                      for (p = 0; p < E.length; p++) {
                        var S = E[p],
                          x = g[S],
                          T = y[S];
                        if (T) {
                          var N = T['(type)'];
                          if (T['(useOutsideOfScope)'] && !e.option.funcscope) {
                            var C = x['(tokens)'];
                            if (C)
                              for (d = 0; d < C.length; d++)
                                T['(function)'] === C[d]['(function)'] && m('W038', C[d], S);
                          }
                          u['(labels)'][S]['(unused)'] = !1;
                          if (N === 'const' && x['(modified)'])
                            for (d = 0; d < x['(modified)'].length; d++) m('E013', x['(modified)'][d], S);
                          if ((N === 'function' || N === 'class') && x['(reassigned)'])
                            for (d = 0; d < x['(reassigned)'].length; d++) m('W021', x['(reassigned)'][d], S, N);
                          continue;
                        }
                        f && (e.funct['(isCapturing)'] = !0);
                        if (t)
                          if (!t['(usages)'][S])
                            (t['(usages)'][S] = x), n && (t['(usages)'][S]['(onlyUsedSubFunction)'] = !0);
                          else {
                            var k = t['(usages)'][S];
                            (k['(modified)'] = k['(modified)'].concat(x['(modified)'])),
                              (k['(tokens)'] = k['(tokens)'].concat(x['(tokens)'])),
                              (k['(reassigned)'] = k['(reassigned)'].concat(x['(reassigned)'])),
                              (k['(onlyUsedSubFunction)'] = !1);
                          }
                        else if (typeof u['(predefined)'][S] == 'boolean') {
                          delete o[S], (c[S] = s);
                          if (u['(predefined)'][S] === !1 && x['(reassigned)'])
                            for (d = 0; d < x['(reassigned)'].length; d++) v('W020', x['(reassigned)'][d]);
                        } else if (x['(tokens)'])
                          for (d = 0; d < x['(tokens)'].length; d++) {
                            var L = x['(tokens)'][d];
                            L.forgiveUndef ||
                              (e.option.undef && !L.ignoreUndef && v('W117', L, S),
                              h[S] ? h[S].line.push(L.line) : (h[S] = { name: S, line: [L.line] }));
                          }
                      }
                      t ||
                        Object.keys(o).forEach(function(e) {
                          b(e, o[e], 'var');
                        });
                      if (t && !n && !i && !f) {
                        var A = Object.keys(y);
                        for (p = 0; p < A.length; p++) {
                          var O = A[p];
                          !y[O]['(blockscoped)'] &&
                            y[O]['(type)'] !== 'exception' &&
                            !this.funct.has(O, { excludeCurrent: !0 }) &&
                            ((t['(labels)'][O] = y[O]),
                            l['(type)'] !== 'global' && (t['(labels)'][O]['(useOutsideOfScope)'] = !0),
                            delete y[O]);
                        }
                      }
                      w(),
                        a.pop(),
                        n &&
                          (l =
                            a[
                              r.findLastIndex(a, function(e) {
                                return e['(isFuncBody)'] || e['(type)'] === 'global';
                              })
                            ]),
                        (u = t);
                    },
                    addParam: function(t, n, i) {
                      i = i || 'param';
                      if (i === 'exception') {
                        var s = this.funct.labeltype(t);
                        s && s !== 'exception' && (e.option.node || v('W002', e.tokens.next, t));
                      }
                      r.has(u['(labels)'], t)
                        ? (u['(labels)'][t].duplicated = !0)
                        : (T(t, n, i),
                          (u['(labels)'][t] = { '(type)': i, '(token)': n, '(unused)': !0 }),
                          u['(params)'].push(t));
                      if (r.has(u['(usages)'], t)) {
                        var o = u['(usages)'][t];
                        o['(onlyUsedSubFunction)'] ? N(i, t, n) : v('E056', n, t, i);
                      }
                    },
                    validateParams: function() {
                      if (l['(type)'] === 'global') return;
                      var t = e.isStrict(),
                        n = l['(parent)'];
                      if (!n['(params)']) return;
                      n['(params)'].forEach(function(r) {
                        var i = n['(labels)'][r];
                        i &&
                          i.duplicated &&
                          (t ? v('E011', i['(token)'], r) : e.option.shadow !== !0 && v('W004', i['(token)'], r));
                      });
                    },
                    getUsedOrDefinedGlobals: function() {
                      var e = Object.keys(c);
                      return c.__proto__ === s && e.indexOf('__proto__') === -1 && e.push('__proto__'), e;
                    },
                    getImpliedGlobals: function() {
                      var e = r.values(h),
                        t = !1;
                      return (
                        h.__proto__ &&
                          ((t = e.some(function(e) {
                            return e.name === '__proto__';
                          })),
                          t || e.push(h.__proto__)),
                        e
                      );
                    },
                    getUnuseds: function() {
                      return p;
                    },
                    has: function(e) {
                      return Boolean(S(e));
                    },
                    labeltype: function(e) {
                      var t = S(e);
                      return t ? t[e]['(type)'] : null;
                    },
                    addExported: function(e) {
                      var t = a[0]['(labels)'];
                      if (r.has(o, e)) delete o[e];
                      else if (r.has(t, e)) t[e]['(unused)'] = !1;
                      else {
                        for (var i = 1; i < a.length; i++) {
                          var s = a[i];
                          if (!!s['(type)']) break;
                          if (r.has(s['(labels)'], e) && !s['(labels)'][e]['(blockscoped)']) {
                            s['(labels)'][e]['(unused)'] = !1;
                            return;
                          }
                        }
                        n[e] = !0;
                      }
                    },
                    setExported: function(e, t) {
                      this.block.use(e, t);
                    },
                    addlabel: function(t, i) {
                      var o = i.type,
                        a = i.token,
                        f = o === 'let' || o === 'const' || o === 'class',
                        h = (f ? u : l)['(type)'] === 'global' && r.has(n, t);
                      T(t, a, o);
                      if (f) {
                        var p = u['(labels)'][t];
                        !p && u === l && u['(type)'] !== 'global' && (p = !!l['(parent)']['(labels)'][t]);
                        if (!p && u['(usages)'][t]) {
                          var d = u['(usages)'][t];
                          d['(onlyUsedSubFunction)'] ? N(o, t, a) : v('E056', a, t, o);
                        }
                        p ? v('E011', a, t) : e.option.shadow === 'outer' && C.funct.has(t) && v('W004', a, t),
                          C.block.add(t, o, a, !h);
                      } else {
                        var m = C.funct.has(t);
                        !m && x(t) && N(o, t, a),
                          C.funct.has(t, { onlyBlockscoped: !0 })
                            ? v('E011', a, t)
                            : e.option.shadow !== !0 &&
                              m &&
                              t !== '__proto__' &&
                              l['(type)'] !== 'global' &&
                              v('W004', a, t),
                          C.funct.add(t, o, a, !h),
                          l['(type)'] === 'global' && (c[t] = s);
                      }
                    },
                    funct: {
                      labeltype: function(e, t) {
                        var n = t && t.onlyBlockscoped,
                          r = t && t.excludeParams,
                          i = a.length - (t && t.excludeCurrent ? 2 : 1);
                        for (var s = i; s >= 0; s--) {
                          var o = a[s];
                          if (o['(labels)'][e] && (!n || o['(labels)'][e]['(blockscoped)']))
                            return o['(labels)'][e]['(type)'];
                          var u = r ? a[s - 1] : o;
                          if (u && u['(type)'] === 'functionparams') return null;
                        }
                        return null;
                      },
                      hasBreakLabel: function(e) {
                        for (var t = a.length - 1; t >= 0; t--) {
                          var n = a[t];
                          if (n['(breakLabels)'][e]) return !0;
                          if (n['(type)'] === 'functionparams') return !1;
                        }
                        return !1;
                      },
                      has: function(e, t) {
                        return Boolean(this.labeltype(e, t));
                      },
                      add: function(e, t, n, r) {
                        u['(labels)'][e] = {
                          '(type)': t,
                          '(token)': n,
                          '(blockscoped)': !1,
                          '(function)': l,
                          '(unused)': r
                        };
                      }
                    },
                    block: {
                      isGlobal: function() {
                        return u['(type)'] === 'global';
                      },
                      use: function(t, n) {
                        var r = l['(parent)'];
                        r &&
                          r['(labels)'][t] &&
                          r['(labels)'][t]['(type)'] === 'param' &&
                          (C.funct.has(t, { excludeParams: !0, onlyBlockscoped: !0 }) ||
                            (r['(labels)'][t]['(unused)'] = !1)),
                          n && (e.ignored.W117 || e.option.undef === !1) && (n.ignoreUndef = !0),
                          g(t),
                          n && ((n['(function)'] = l), u['(usages)'][t]['(tokens)'].push(n));
                      },
                      reassign: function(e, t) {
                        this.modify(e, t), u['(usages)'][e]['(reassigned)'].push(t);
                      },
                      modify: function(e, t) {
                        g(e), u['(usages)'][e]['(modified)'].push(t);
                      },
                      add: function(e, t, n, r) {
                        u['(labels)'][e] = { '(type)': t, '(token)': n, '(blockscoped)': !0, '(unused)': r };
                      },
                      addBreakLabel: function(t, n) {
                        var r = n.token;
                        C.funct.hasBreakLabel(t)
                          ? v('E011', r, t)
                          : e.option.shadow === 'outer' && (C.funct.has(t) ? v('W004', r, t) : T(t, r)),
                          (u['(breakLabels)'][t] = r);
                      }
                    }
                  };
                return C;
              };
            t.exports = o;
          },
          {
            '../lodash': '/node_modules/jshint/lodash.js',
            events: '/node_modules/browserify/node_modules/events/events.js'
          }
        ],
        '/node_modules/jshint/src/state.js': [
          function(e, t, n) {
            'use strict';
            var r = e('./name-stack.js'),
              i = {
                syntax: {},
                isStrict: function() {
                  return (
                    this.directive['use strict'] ||
                    this.inClassBody ||
                    this.option.module ||
                    this.option.strict === 'implied'
                  );
                },
                inMoz: function() {
                  return this.option.moz;
                },
                inES6: function() {
                  return this.option.moz || this.option.esversion >= 6;
                },
                inES5: function(e) {
                  return e
                    ? (!this.option.esversion || this.option.esversion === 5) && !this.option.moz
                    : !this.option.esversion || this.option.esversion >= 5 || this.option.moz;
                },
                reset: function() {
                  (this.tokens = { prev: null, next: null, curr: null }),
                    (this.option = {}),
                    (this.funct = null),
                    (this.ignored = {}),
                    (this.directive = {}),
                    (this.jsonMode = !1),
                    (this.jsonWarnings = []),
                    (this.lines = []),
                    (this.tab = ''),
                    (this.cache = {}),
                    (this.ignoredLines = {}),
                    (this.forinifcheckneeded = !1),
                    (this.nameStack = new r()),
                    (this.inClassBody = !1);
                }
              };
            n.state = i;
          },
          { './name-stack.js': '/node_modules/jshint/src/name-stack.js' }
        ],
        '/node_modules/jshint/src/style.js': [
          function(e, t, n) {
            'use strict';
            n.register = function(e) {
              e.on('Identifier', function(n) {
                if (e.getOption('proto')) return;
                n.name === '__proto__' && e.warn('W103', { line: n.line, char: n.char, data: [n.name, '6'] });
              }),
                e.on('Identifier', function(n) {
                  if (e.getOption('iterator')) return;
                  n.name === '__iterator__' && e.warn('W103', { line: n.line, char: n.char, data: [n.name] });
                }),
                e.on('Identifier', function(n) {
                  if (!e.getOption('camelcase')) return;
                  n.name.replace(/^_+|_+$/g, '').indexOf('_') > -1 &&
                    !n.name.match(/^[A-Z0-9_]*$/) &&
                    e.warn('W106', { line: n.line, char: n.from, data: [n.name] });
                }),
                e.on('String', function(n) {
                  var r = e.getOption('quotmark'),
                    i;
                  if (!r) return;
                  r === 'single' && n.quote !== "'" && (i = 'W109'),
                    r === 'double' && n.quote !== '"' && (i = 'W108'),
                    r === !0 &&
                      (e.getCache('quotmark') || e.setCache('quotmark', n.quote),
                      e.getCache('quotmark') !== n.quote && (i = 'W110')),
                    i && e.warn(i, { line: n.line, char: n.char });
                }),
                e.on('Number', function(n) {
                  n.value.charAt(0) === '.' && e.warn('W008', { line: n.line, char: n.char, data: [n.value] }),
                    n.value.substr(n.value.length - 1) === '.' &&
                      e.warn('W047', { line: n.line, char: n.char, data: [n.value] }),
                    /^00+/.test(n.value) && e.warn('W046', { line: n.line, char: n.char, data: [n.value] });
                }),
                e.on('String', function(n) {
                  var r = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i;
                  if (e.getOption('scripturl')) return;
                  r.test(n.value) && e.warn('W107', { line: n.line, char: n.char });
                });
            };
          },
          {}
        ],
        '/node_modules/jshint/src/vars.js': [
          function(e, t, n) {
            'use strict';
            (n.reservedVars = { arguments: !1, NaN: !1 }),
              (n.ecmaIdentifiers = {
                3: {
                  Array: !1,
                  Boolean: !1,
                  Date: !1,
                  decodeURI: !1,
                  decodeURIComponent: !1,
                  encodeURI: !1,
                  encodeURIComponent: !1,
                  Error: !1,
                  eval: !1,
                  EvalError: !1,
                  Function: !1,
                  hasOwnProperty: !1,
                  isFinite: !1,
                  isNaN: !1,
                  Math: !1,
                  Number: !1,
                  Object: !1,
                  parseInt: !1,
                  parseFloat: !1,
                  RangeError: !1,
                  ReferenceError: !1,
                  RegExp: !1,
                  String: !1,
                  SyntaxError: !1,
                  TypeError: !1,
                  URIError: !1
                },
                5: { JSON: !1 },
                6: { Map: !1, Promise: !1, Proxy: !1, Reflect: !1, Set: !1, Symbol: !1, WeakMap: !1, WeakSet: !1 }
              }),
              (n.browser = {
                Audio: !1,
                Blob: !1,
                addEventListener: !1,
                applicationCache: !1,
                atob: !1,
                blur: !1,
                btoa: !1,
                cancelAnimationFrame: !1,
                CanvasGradient: !1,
                CanvasPattern: !1,
                CanvasRenderingContext2D: !1,
                CSS: !1,
                clearInterval: !1,
                clearTimeout: !1,
                close: !1,
                closed: !1,
                Comment: !1,
                CustomEvent: !1,
                DOMParser: !1,
                defaultStatus: !1,
                Document: !1,
                document: !1,
                DocumentFragment: !1,
                Element: !1,
                ElementTimeControl: !1,
                Event: !1,
                event: !1,
                fetch: !1,
                FileReader: !1,
                FormData: !1,
                focus: !1,
                frames: !1,
                getComputedStyle: !1,
                HTMLElement: !1,
                HTMLAnchorElement: !1,
                HTMLBaseElement: !1,
                HTMLBlockquoteElement: !1,
                HTMLBodyElement: !1,
                HTMLBRElement: !1,
                HTMLButtonElement: !1,
                HTMLCanvasElement: !1,
                HTMLCollection: !1,
                HTMLDirectoryElement: !1,
                HTMLDivElement: !1,
                HTMLDListElement: !1,
                HTMLFieldSetElement: !1,
                HTMLFontElement: !1,
                HTMLFormElement: !1,
                HTMLFrameElement: !1,
                HTMLFrameSetElement: !1,
                HTMLHeadElement: !1,
                HTMLHeadingElement: !1,
                HTMLHRElement: !1,
                HTMLHtmlElement: !1,
                HTMLIFrameElement: !1,
                HTMLImageElement: !1,
                HTMLInputElement: !1,
                HTMLIsIndexElement: !1,
                HTMLLabelElement: !1,
                HTMLLayerElement: !1,
                HTMLLegendElement: !1,
                HTMLLIElement: !1,
                HTMLLinkElement: !1,
                HTMLMapElement: !1,
                HTMLMenuElement: !1,
                HTMLMetaElement: !1,
                HTMLModElement: !1,
                HTMLObjectElement: !1,
                HTMLOListElement: !1,
                HTMLOptGroupElement: !1,
                HTMLOptionElement: !1,
                HTMLParagraphElement: !1,
                HTMLParamElement: !1,
                HTMLPreElement: !1,
                HTMLQuoteElement: !1,
                HTMLScriptElement: !1,
                HTMLSelectElement: !1,
                HTMLStyleElement: !1,
                HTMLTableCaptionElement: !1,
                HTMLTableCellElement: !1,
                HTMLTableColElement: !1,
                HTMLTableElement: !1,
                HTMLTableRowElement: !1,
                HTMLTableSectionElement: !1,
                HTMLTemplateElement: !1,
                HTMLTextAreaElement: !1,
                HTMLTitleElement: !1,
                HTMLUListElement: !1,
                HTMLVideoElement: !1,
                history: !1,
                Image: !1,
                Intl: !1,
                length: !1,
                localStorage: !1,
                location: !1,
                matchMedia: !1,
                MessageChannel: !1,
                MessageEvent: !1,
                MessagePort: !1,
                MouseEvent: !1,
                moveBy: !1,
                moveTo: !1,
                MutationObserver: !1,
                name: !1,
                Node: !1,
                NodeFilter: !1,
                NodeList: !1,
                Notification: !1,
                navigator: !1,
                onbeforeunload: !0,
                onblur: !0,
                onerror: !0,
                onfocus: !0,
                onload: !0,
                onresize: !0,
                onunload: !0,
                open: !1,
                openDatabase: !1,
                opener: !1,
                Option: !1,
                parent: !1,
                performance: !1,
                print: !1,
                Range: !1,
                requestAnimationFrame: !1,
                removeEventListener: !1,
                resizeBy: !1,
                resizeTo: !1,
                screen: !1,
                scroll: !1,
                scrollBy: !1,
                scrollTo: !1,
                sessionStorage: !1,
                setInterval: !1,
                setTimeout: !1,
                SharedWorker: !1,
                status: !1,
                SVGAElement: !1,
                SVGAltGlyphDefElement: !1,
                SVGAltGlyphElement: !1,
                SVGAltGlyphItemElement: !1,
                SVGAngle: !1,
                SVGAnimateColorElement: !1,
                SVGAnimateElement: !1,
                SVGAnimateMotionElement: !1,
                SVGAnimateTransformElement: !1,
                SVGAnimatedAngle: !1,
                SVGAnimatedBoolean: !1,
                SVGAnimatedEnumeration: !1,
                SVGAnimatedInteger: !1,
                SVGAnimatedLength: !1,
                SVGAnimatedLengthList: !1,
                SVGAnimatedNumber: !1,
                SVGAnimatedNumberList: !1,
                SVGAnimatedPathData: !1,
                SVGAnimatedPoints: !1,
                SVGAnimatedPreserveAspectRatio: !1,
                SVGAnimatedRect: !1,
                SVGAnimatedString: !1,
                SVGAnimatedTransformList: !1,
                SVGAnimationElement: !1,
                SVGCSSRule: !1,
                SVGCircleElement: !1,
                SVGClipPathElement: !1,
                SVGColor: !1,
                SVGColorProfileElement: !1,
                SVGColorProfileRule: !1,
                SVGComponentTransferFunctionElement: !1,
                SVGCursorElement: !1,
                SVGDefsElement: !1,
                SVGDescElement: !1,
                SVGDocument: !1,
                SVGElement: !1,
                SVGElementInstance: !1,
                SVGElementInstanceList: !1,
                SVGEllipseElement: !1,
                SVGExternalResourcesRequired: !1,
                SVGFEBlendElement: !1,
                SVGFEColorMatrixElement: !1,
                SVGFEComponentTransferElement: !1,
                SVGFECompositeElement: !1,
                SVGFEConvolveMatrixElement: !1,
                SVGFEDiffuseLightingElement: !1,
                SVGFEDisplacementMapElement: !1,
                SVGFEDistantLightElement: !1,
                SVGFEFloodElement: !1,
                SVGFEFuncAElement: !1,
                SVGFEFuncBElement: !1,
                SVGFEFuncGElement: !1,
                SVGFEFuncRElement: !1,
                SVGFEGaussianBlurElement: !1,
                SVGFEImageElement: !1,
                SVGFEMergeElement: !1,
                SVGFEMergeNodeElement: !1,
                SVGFEMorphologyElement: !1,
                SVGFEOffsetElement: !1,
                SVGFEPointLightElement: !1,
                SVGFESpecularLightingElement: !1,
                SVGFESpotLightElement: !1,
                SVGFETileElement: !1,
                SVGFETurbulenceElement: !1,
                SVGFilterElement: !1,
                SVGFilterPrimitiveStandardAttributes: !1,
                SVGFitToViewBox: !1,
                SVGFontElement: !1,
                SVGFontFaceElement: !1,
                SVGFontFaceFormatElement: !1,
                SVGFontFaceNameElement: !1,
                SVGFontFaceSrcElement: !1,
                SVGFontFaceUriElement: !1,
                SVGForeignObjectElement: !1,
                SVGGElement: !1,
                SVGGlyphElement: !1,
                SVGGlyphRefElement: !1,
                SVGGradientElement: !1,
                SVGHKernElement: !1,
                SVGICCColor: !1,
                SVGImageElement: !1,
                SVGLangSpace: !1,
                SVGLength: !1,
                SVGLengthList: !1,
                SVGLineElement: !1,
                SVGLinearGradientElement: !1,
                SVGLocatable: !1,
                SVGMPathElement: !1,
                SVGMarkerElement: !1,
                SVGMaskElement: !1,
                SVGMatrix: !1,
                SVGMetadataElement: !1,
                SVGMissingGlyphElement: !1,
                SVGNumber: !1,
                SVGNumberList: !1,
                SVGPaint: !1,
                SVGPathElement: !1,
                SVGPathSeg: !1,
                SVGPathSegArcAbs: !1,
                SVGPathSegArcRel: !1,
                SVGPathSegClosePath: !1,
                SVGPathSegCurvetoCubicAbs: !1,
                SVGPathSegCurvetoCubicRel: !1,
                SVGPathSegCurvetoCubicSmoothAbs: !1,
                SVGPathSegCurvetoCubicSmoothRel: !1,
                SVGPathSegCurvetoQuadraticAbs: !1,
                SVGPathSegCurvetoQuadraticRel: !1,
                SVGPathSegCurvetoQuadraticSmoothAbs: !1,
                SVGPathSegCurvetoQuadraticSmoothRel: !1,
                SVGPathSegLinetoAbs: !1,
                SVGPathSegLinetoHorizontalAbs: !1,
                SVGPathSegLinetoHorizontalRel: !1,
                SVGPathSegLinetoRel: !1,
                SVGPathSegLinetoVerticalAbs: !1,
                SVGPathSegLinetoVerticalRel: !1,
                SVGPathSegList: !1,
                SVGPathSegMovetoAbs: !1,
                SVGPathSegMovetoRel: !1,
                SVGPatternElement: !1,
                SVGPoint: !1,
                SVGPointList: !1,
                SVGPolygonElement: !1,
                SVGPolylineElement: !1,
                SVGPreserveAspectRatio: !1,
                SVGRadialGradientElement: !1,
                SVGRect: !1,
                SVGRectElement: !1,
                SVGRenderingIntent: !1,
                SVGSVGElement: !1,
                SVGScriptElement: !1,
                SVGSetElement: !1,
                SVGStopElement: !1,
                SVGStringList: !1,
                SVGStylable: !1,
                SVGStyleElement: !1,
                SVGSwitchElement: !1,
                SVGSymbolElement: !1,
                SVGTRefElement: !1,
                SVGTSpanElement: !1,
                SVGTests: !1,
                SVGTextContentElement: !1,
                SVGTextElement: !1,
                SVGTextPathElement: !1,
                SVGTextPositioningElement: !1,
                SVGTitleElement: !1,
                SVGTransform: !1,
                SVGTransformList: !1,
                SVGTransformable: !1,
                SVGURIReference: !1,
                SVGUnitTypes: !1,
                SVGUseElement: !1,
                SVGVKernElement: !1,
                SVGViewElement: !1,
                SVGViewSpec: !1,
                SVGZoomAndPan: !1,
                Text: !1,
                TextDecoder: !1,
                TextEncoder: !1,
                TimeEvent: !1,
                top: !1,
                URL: !1,
                WebGLActiveInfo: !1,
                WebGLBuffer: !1,
                WebGLContextEvent: !1,
                WebGLFramebuffer: !1,
                WebGLProgram: !1,
                WebGLRenderbuffer: !1,
                WebGLRenderingContext: !1,
                WebGLShader: !1,
                WebGLShaderPrecisionFormat: !1,
                WebGLTexture: !1,
                WebGLUniformLocation: !1,
                WebSocket: !1,
                window: !1,
                Window: !1,
                Worker: !1,
                XDomainRequest: !1,
                XMLHttpRequest: !1,
                XMLSerializer: !1,
                XPathEvaluator: !1,
                XPathException: !1,
                XPathExpression: !1,
                XPathNamespace: !1,
                XPathNSResolver: !1,
                XPathResult: !1
              }),
              (n.devel = { alert: !1, confirm: !1, console: !1, Debug: !1, opera: !1, prompt: !1 }),
              (n.worker = { importScripts: !0, postMessage: !0, self: !0, FileReaderSync: !0 }),
              (n.nonstandard = { escape: !1, unescape: !1 }),
              (n.couch = {
                require: !1,
                respond: !1,
                getRow: !1,
                emit: !1,
                send: !1,
                start: !1,
                sum: !1,
                log: !1,
                exports: !1,
                module: !1,
                provides: !1
              }),
              (n.node = {
                __filename: !1,
                __dirname: !1,
                GLOBAL: !1,
                global: !1,
                module: !1,
                require: !1,
                Buffer: !0,
                console: !0,
                exports: !0,
                process: !0,
                setTimeout: !0,
                clearTimeout: !0,
                setInterval: !0,
                clearInterval: !0,
                setImmediate: !0,
                clearImmediate: !0
              }),
              (n.browserify = {
                __filename: !1,
                __dirname: !1,
                global: !1,
                module: !1,
                require: !1,
                Buffer: !0,
                exports: !0,
                process: !0
              }),
              (n.phantom = { phantom: !0, require: !0, WebPage: !0, console: !0, exports: !0 }),
              (n.qunit = {
                asyncTest: !1,
                deepEqual: !1,
                equal: !1,
                expect: !1,
                module: !1,
                notDeepEqual: !1,
                notEqual: !1,
                notPropEqual: !1,
                notStrictEqual: !1,
                ok: !1,
                propEqual: !1,
                QUnit: !1,
                raises: !1,
                start: !1,
                stop: !1,
                strictEqual: !1,
                test: !1,
                throws: !1
              }),
              (n.rhino = {
                defineClass: !1,
                deserialize: !1,
                gc: !1,
                help: !1,
                importClass: !1,
                importPackage: !1,
                java: !1,
                load: !1,
                loadClass: !1,
                Packages: !1,
                print: !1,
                quit: !1,
                readFile: !1,
                readUrl: !1,
                runCommand: !1,
                seal: !1,
                serialize: !1,
                spawn: !1,
                sync: !1,
                toint32: !1,
                version: !1
              }),
              (n.shelljs = {
                target: !1,
                echo: !1,
                exit: !1,
                cd: !1,
                pwd: !1,
                ls: !1,
                find: !1,
                cp: !1,
                rm: !1,
                mv: !1,
                mkdir: !1,
                test: !1,
                cat: !1,
                sed: !1,
                grep: !1,
                which: !1,
                dirs: !1,
                pushd: !1,
                popd: !1,
                env: !1,
                exec: !1,
                chmod: !1,
                config: !1,
                error: !1,
                tempdir: !1
              }),
              (n.typed = {
                ArrayBuffer: !1,
                ArrayBufferView: !1,
                DataView: !1,
                Float32Array: !1,
                Float64Array: !1,
                Int16Array: !1,
                Int32Array: !1,
                Int8Array: !1,
                Uint16Array: !1,
                Uint32Array: !1,
                Uint8Array: !1,
                Uint8ClampedArray: !1
              }),
              (n.wsh = {
                ActiveXObject: !0,
                Enumerator: !0,
                GetObject: !0,
                ScriptEngine: !0,
                ScriptEngineBuildVersion: !0,
                ScriptEngineMajorVersion: !0,
                ScriptEngineMinorVersion: !0,
                VBArray: !0,
                WSH: !0,
                WScript: !0,
                XDomainRequest: !0
              }),
              (n.dojo = { dojo: !1, dijit: !1, dojox: !1, define: !1, require: !1 }),
              (n.jquery = { $: !1, jQuery: !1 }),
              (n.mootools = {
                $: !1,
                $$: !1,
                Asset: !1,
                Browser: !1,
                Chain: !1,
                Class: !1,
                Color: !1,
                Cookie: !1,
                Core: !1,
                Document: !1,
                DomReady: !1,
                DOMEvent: !1,
                DOMReady: !1,
                Drag: !1,
                Element: !1,
                Elements: !1,
                Event: !1,
                Events: !1,
                Fx: !1,
                Group: !1,
                Hash: !1,
                HtmlTable: !1,
                IFrame: !1,
                IframeShim: !1,
                InputValidator: !1,
                instanceOf: !1,
                Keyboard: !1,
                Locale: !1,
                Mask: !1,
                MooTools: !1,
                Native: !1,
                Options: !1,
                OverText: !1,
                Request: !1,
                Scroller: !1,
                Slick: !1,
                Slider: !1,
                Sortables: !1,
                Spinner: !1,
                Swiff: !1,
                Tips: !1,
                Type: !1,
                typeOf: !1,
                URI: !1,
                Window: !1
              }),
              (n.prototypejs = {
                $: !1,
                $$: !1,
                $A: !1,
                $F: !1,
                $H: !1,
                $R: !1,
                $break: !1,
                $continue: !1,
                $w: !1,
                Abstract: !1,
                Ajax: !1,
                Class: !1,
                Enumerable: !1,
                Element: !1,
                Event: !1,
                Field: !1,
                Form: !1,
                Hash: !1,
                Insertion: !1,
                ObjectRange: !1,
                PeriodicalExecuter: !1,
                Position: !1,
                Prototype: !1,
                Selector: !1,
                Template: !1,
                Toggle: !1,
                Try: !1,
                Autocompleter: !1,
                Builder: !1,
                Control: !1,
                Draggable: !1,
                Draggables: !1,
                Droppables: !1,
                Effect: !1,
                Sortable: !1,
                SortableObserver: !1,
                Sound: !1,
                Scriptaculous: !1
              }),
              (n.yui = { YUI: !1, Y: !1, YUI_config: !1 }),
              (n.mocha = {
                mocha: !1,
                describe: !1,
                xdescribe: !1,
                it: !1,
                xit: !1,
                context: !1,
                xcontext: !1,
                before: !1,
                after: !1,
                beforeEach: !1,
                afterEach: !1,
                suite: !1,
                test: !1,
                setup: !1,
                teardown: !1,
                suiteSetup: !1,
                suiteTeardown: !1
              }),
              (n.jasmine = {
                jasmine: !1,
                describe: !1,
                xdescribe: !1,
                it: !1,
                xit: !1,
                beforeEach: !1,
                afterEach: !1,
                setFixtures: !1,
                loadFixtures: !1,
                spyOn: !1,
                expect: !1,
                runs: !1,
                waitsFor: !1,
                waits: !1,
                beforeAll: !1,
                afterAll: !1,
                fail: !1,
                fdescribe: !1,
                fit: !1,
                pending: !1
              });
          },
          {}
        ]
      },
      {},
      ['/node_modules/jshint/src/jshint.js']
    );
  }),
  define('ace/mode/javascript_worker', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/worker/mirror',
    'ace/mode/javascript/jshint'
  ], function(require, exports, module) {
    'use strict';
    function startRegex(e) {
      return RegExp('^(' + e.join('|') + ')');
    }
    var oop = require('../lib/oop'),
      Mirror = require('../worker/mirror').Mirror,
      lint = require('./javascript/jshint').JSHINT,
      disabledWarningsRe = startRegex(["Bad for in variable '(.+)'.", 'Missing "use strict"']),
      errorsRe = startRegex([
        'Unexpected',
        'Expected ',
        'Confusing (plus|minus)',
        '\\{a\\} unterminated regular expression',
        'Unclosed ',
        'Unmatched ',
        'Unbegun comment',
        'Bad invocation',
        'Missing space after',
        'Missing operator at'
      ]),
      infoRe = startRegex([
        'Expected an assignment',
        'Bad escapement of EOL',
        'Unexpected comma',
        'Unexpected space',
        'Missing radix parameter.',
        'A leading decimal point can',
        "\\['{a}'\\] is better written in dot notation.",
        "'{a}' used out of scope"
      ]),
      JavaScriptWorker = (exports.JavaScriptWorker = function(e) {
        Mirror.call(this, e), this.setTimeout(500), this.setOptions();
      });
    oop.inherits(JavaScriptWorker, Mirror),
      function() {
        (this.setOptions = function(e) {
          (this.options = e || {
            esnext: !0,
            moz: !0,
            devel: !0,
            browser: !0,
            node: !0,
            laxcomma: !0,
            laxbreak: !0,
            lastsemic: !0,
            onevar: !1,
            passfail: !1,
            maxerr: 100,
            expr: !0,
            multistr: !0,
            globalstrict: !0
          }),
            this.doc.getValue() && this.deferredUpdate.schedule(100);
        }),
          (this.changeOptions = function(e) {
            oop.mixin(this.options, e), this.doc.getValue() && this.deferredUpdate.schedule(100);
          }),
          (this.isValidJS = function(str) {
            try {
              eval('throw 0;' + str);
            } catch (e) {
              if (e === 0) return !0;
            }
            return !1;
          }),
          (this.onUpdate = function() {
            var e = this.doc.getValue();
            e = e.replace(/^#!.*\n/, '\n');
            if (!e) return this.sender.emit('annotate', []);
            var t = [],
              n = this.isValidJS(e) ? 'warning' : 'error';
            lint(e, this.options, this.options.globals);
            var r = lint.errors,
              i = !1;
            for (var s = 0; s < r.length; s++) {
              var o = r[s];
              if (!o) continue;
              var u = o.raw,
                a = 'warning';
              if (u == 'Missing semicolon.') {
                var f = o.evidence.substr(o.character);
                (f = f.charAt(f.search(/\S/))),
                  n == 'error' && f && /[\w\d{(['"]/.test(f)
                    ? ((o.reason = 'Missing ";" before statement'), (a = 'error'))
                    : (a = 'info');
              } else {
                if (disabledWarningsRe.test(u)) continue;
                infoRe.test(u)
                  ? (a = 'info')
                  : errorsRe.test(u)
                  ? ((i = !0), (a = n))
                  : u == "'{a}' is not defined."
                  ? (a = 'warning')
                  : u == "'{a}' is defined but never used." && (a = 'info');
              }
              t.push({ row: o.line - 1, column: o.character - 1, text: o.reason, type: a, raw: u }), i;
            }
            this.sender.emit('annotate', t);
          });
      }.call(JavaScriptWorker.prototype);
  }),
  define('ace/lib/es5-shim', ['require', 'exports', 'module'], function(e, t, n) {
    function r() {}
    function w(e) {
      try {
        return Object.defineProperty(e, 'sentinel', {}), 'sentinel' in e;
      } catch (t) {}
    }
    function H(e) {
      return (
        (e = +e),
        e !== e ? (e = 0) : e !== 0 && e !== 1 / 0 && e !== -1 / 0 && (e = (e > 0 || -1) * Math.floor(Math.abs(e))),
        e
      );
    }
    function B(e) {
      var t = typeof e;
      return e === null || t === 'undefined' || t === 'boolean' || t === 'number' || t === 'string';
    }
    function j(e) {
      var t, n, r;
      if (B(e)) return e;
      n = e.valueOf;
      if (typeof n == 'function') {
        t = n.call(e);
        if (B(t)) return t;
      }
      r = e.toString;
      if (typeof r == 'function') {
        t = r.call(e);
        if (B(t)) return t;
      }
      throw new TypeError();
    }
    Function.prototype.bind ||
      (Function.prototype.bind = function(t) {
        var n = this;
        if (typeof n != 'function') throw new TypeError('Function.prototype.bind called on incompatible ' + n);
        var i = u.call(arguments, 1),
          s = function() {
            if (this instanceof s) {
              var e = n.apply(this, i.concat(u.call(arguments)));
              return Object(e) === e ? e : this;
            }
            return n.apply(t, i.concat(u.call(arguments)));
          };
        return n.prototype && ((r.prototype = n.prototype), (s.prototype = new r()), (r.prototype = null)), s;
      });
    var i = Function.prototype.call,
      s = Array.prototype,
      o = Object.prototype,
      u = s.slice,
      a = i.bind(o.toString),
      f = i.bind(o.hasOwnProperty),
      l,
      c,
      h,
      p,
      d;
    if ((d = f(o, '__defineGetter__')))
      (l = i.bind(o.__defineGetter__)),
        (c = i.bind(o.__defineSetter__)),
        (h = i.bind(o.__lookupGetter__)),
        (p = i.bind(o.__lookupSetter__));
    if ([1, 2].splice(0).length != 2)
      if (
        !(function() {
          function e(e) {
            var t = new Array(e + 2);
            return (t[0] = t[1] = 0), t;
          }
          var t = [],
            n;
          t.splice.apply(t, e(20)), t.splice.apply(t, e(26)), (n = t.length), t.splice(5, 0, 'XXX'), n + 1 == t.length;
          if (n + 1 == t.length) return !0;
        })()
      )
        Array.prototype.splice = function(e, t) {
          var n = this.length;
          e > 0 ? e > n && (e = n) : e == void 0 ? (e = 0) : e < 0 && (e = Math.max(n + e, 0)),
            e + t < n || (t = n - e);
          var r = this.slice(e, e + t),
            i = u.call(arguments, 2),
            s = i.length;
          if (e === n) s && this.push.apply(this, i);
          else {
            var o = Math.min(t, n - e),
              a = e + o,
              f = a + s - o,
              l = n - a,
              c = n - o;
            if (f < a) for (var h = 0; h < l; ++h) this[f + h] = this[a + h];
            else if (f > a) for (h = l; h--; ) this[f + h] = this[a + h];
            if (s && e === c) (this.length = c), this.push.apply(this, i);
            else {
              this.length = c + s;
              for (h = 0; h < s; ++h) this[e + h] = i[h];
            }
          }
          return r;
        };
      else {
        var v = Array.prototype.splice;
        Array.prototype.splice = function(e, t) {
          return arguments.length
            ? v.apply(this, [e === void 0 ? 0 : e, t === void 0 ? this.length - e : t].concat(u.call(arguments, 2)))
            : [];
        };
      }
    Array.isArray ||
      (Array.isArray = function(t) {
        return a(t) == '[object Array]';
      });
    var m = Object('a'),
      g = m[0] != 'a' || !(0 in m);
    Array.prototype.forEach ||
      (Array.prototype.forEach = function(t) {
        var n = F(this),
          r = g && a(this) == '[object String]' ? this.split('') : n,
          i = arguments[1],
          s = -1,
          o = r.length >>> 0;
        if (a(t) != '[object Function]') throw new TypeError();
        while (++s < o) s in r && t.call(i, r[s], s, n);
      }),
      Array.prototype.map ||
        (Array.prototype.map = function(t) {
          var n = F(this),
            r = g && a(this) == '[object String]' ? this.split('') : n,
            i = r.length >>> 0,
            s = Array(i),
            o = arguments[1];
          if (a(t) != '[object Function]') throw new TypeError(t + ' is not a function');
          for (var u = 0; u < i; u++) u in r && (s[u] = t.call(o, r[u], u, n));
          return s;
        }),
      Array.prototype.filter ||
        (Array.prototype.filter = function(t) {
          var n = F(this),
            r = g && a(this) == '[object String]' ? this.split('') : n,
            i = r.length >>> 0,
            s = [],
            o,
            u = arguments[1];
          if (a(t) != '[object Function]') throw new TypeError(t + ' is not a function');
          for (var f = 0; f < i; f++) f in r && ((o = r[f]), t.call(u, o, f, n) && s.push(o));
          return s;
        }),
      Array.prototype.every ||
        (Array.prototype.every = function(t) {
          var n = F(this),
            r = g && a(this) == '[object String]' ? this.split('') : n,
            i = r.length >>> 0,
            s = arguments[1];
          if (a(t) != '[object Function]') throw new TypeError(t + ' is not a function');
          for (var o = 0; o < i; o++) if (o in r && !t.call(s, r[o], o, n)) return !1;
          return !0;
        }),
      Array.prototype.some ||
        (Array.prototype.some = function(t) {
          var n = F(this),
            r = g && a(this) == '[object String]' ? this.split('') : n,
            i = r.length >>> 0,
            s = arguments[1];
          if (a(t) != '[object Function]') throw new TypeError(t + ' is not a function');
          for (var o = 0; o < i; o++) if (o in r && t.call(s, r[o], o, n)) return !0;
          return !1;
        }),
      Array.prototype.reduce ||
        (Array.prototype.reduce = function(t) {
          var n = F(this),
            r = g && a(this) == '[object String]' ? this.split('') : n,
            i = r.length >>> 0;
          if (a(t) != '[object Function]') throw new TypeError(t + ' is not a function');
          if (!i && arguments.length == 1) throw new TypeError('reduce of empty array with no initial value');
          var s = 0,
            o;
          if (arguments.length >= 2) o = arguments[1];
          else
            do {
              if (s in r) {
                o = r[s++];
                break;
              }
              if (++s >= i) throw new TypeError('reduce of empty array with no initial value');
            } while (!0);
          for (; s < i; s++) s in r && (o = t.call(void 0, o, r[s], s, n));
          return o;
        }),
      Array.prototype.reduceRight ||
        (Array.prototype.reduceRight = function(t) {
          var n = F(this),
            r = g && a(this) == '[object String]' ? this.split('') : n,
            i = r.length >>> 0;
          if (a(t) != '[object Function]') throw new TypeError(t + ' is not a function');
          if (!i && arguments.length == 1) throw new TypeError('reduceRight of empty array with no initial value');
          var s,
            o = i - 1;
          if (arguments.length >= 2) s = arguments[1];
          else
            do {
              if (o in r) {
                s = r[o--];
                break;
              }
              if (--o < 0) throw new TypeError('reduceRight of empty array with no initial value');
            } while (!0);
          do o in this && (s = t.call(void 0, s, r[o], o, n));
          while (o--);
          return s;
        });
    if (!Array.prototype.indexOf || [0, 1].indexOf(1, 2) != -1)
      Array.prototype.indexOf = function(t) {
        var n = g && a(this) == '[object String]' ? this.split('') : F(this),
          r = n.length >>> 0;
        if (!r) return -1;
        var i = 0;
        arguments.length > 1 && (i = H(arguments[1])), (i = i >= 0 ? i : Math.max(0, r + i));
        for (; i < r; i++) if (i in n && n[i] === t) return i;
        return -1;
      };
    if (!Array.prototype.lastIndexOf || [0, 1].lastIndexOf(0, -3) != -1)
      Array.prototype.lastIndexOf = function(t) {
        var n = g && a(this) == '[object String]' ? this.split('') : F(this),
          r = n.length >>> 0;
        if (!r) return -1;
        var i = r - 1;
        arguments.length > 1 && (i = Math.min(i, H(arguments[1]))), (i = i >= 0 ? i : r - Math.abs(i));
        for (; i >= 0; i--) if (i in n && t === n[i]) return i;
        return -1;
      };
    Object.getPrototypeOf ||
      (Object.getPrototypeOf = function(t) {
        return t.__proto__ || (t.constructor ? t.constructor.prototype : o);
      });
    if (!Object.getOwnPropertyDescriptor) {
      var y = 'Object.getOwnPropertyDescriptor called on a non-object: ';
      Object.getOwnPropertyDescriptor = function(t, n) {
        if ((typeof t != 'object' && typeof t != 'function') || t === null) throw new TypeError(y + t);
        if (!f(t, n)) return;
        var r, i, s;
        r = { enumerable: !0, configurable: !0 };
        if (d) {
          var u = t.__proto__;
          t.__proto__ = o;
          var i = h(t, n),
            s = p(t, n);
          t.__proto__ = u;
          if (i || s) return i && (r.get = i), s && (r.set = s), r;
        }
        return (r.value = t[n]), r;
      };
    }
    Object.getOwnPropertyNames ||
      (Object.getOwnPropertyNames = function(t) {
        return Object.keys(t);
      });
    if (!Object.create) {
      var b;
      Object.prototype.__proto__ === null
        ? (b = function() {
            return { __proto__: null };
          })
        : (b = function() {
            var e = {};
            for (var t in e) e[t] = null;
            return (
              (e.constructor = e.hasOwnProperty = e.propertyIsEnumerable = e.isPrototypeOf = e.toLocaleString = e.toString = e.valueOf = e.__proto__ = null),
              e
            );
          }),
        (Object.create = function(t, n) {
          var r;
          if (t === null) r = b();
          else {
            if (typeof t != 'object') throw new TypeError('typeof prototype[' + typeof t + "] != 'object'");
            var i = function() {};
            (i.prototype = t), (r = new i()), (r.__proto__ = t);
          }
          return n !== void 0 && Object.defineProperties(r, n), r;
        });
    }
    if (Object.defineProperty) {
      var E = w({}),
        S = typeof document == 'undefined' || w(document.createElement('div'));
      if (!E || !S) var x = Object.defineProperty;
    }
    if (!Object.defineProperty || x) {
      var T = 'Property description must be an object: ',
        N = 'Object.defineProperty called on non-object: ',
        C = 'getters & setters can not be defined on this javascript engine';
      Object.defineProperty = function(t, n, r) {
        if ((typeof t != 'object' && typeof t != 'function') || t === null) throw new TypeError(N + t);
        if ((typeof r != 'object' && typeof r != 'function') || r === null) throw new TypeError(T + r);
        if (x)
          try {
            return x.call(Object, t, n, r);
          } catch (i) {}
        if (f(r, 'value'))
          if (d && (h(t, n) || p(t, n))) {
            var s = t.__proto__;
            (t.__proto__ = o), delete t[n], (t[n] = r.value), (t.__proto__ = s);
          } else t[n] = r.value;
        else {
          if (!d) throw new TypeError(C);
          f(r, 'get') && l(t, n, r.get), f(r, 'set') && c(t, n, r.set);
        }
        return t;
      };
    }
    Object.defineProperties ||
      (Object.defineProperties = function(t, n) {
        for (var r in n) f(n, r) && Object.defineProperty(t, r, n[r]);
        return t;
      }),
      Object.seal ||
        (Object.seal = function(t) {
          return t;
        }),
      Object.freeze ||
        (Object.freeze = function(t) {
          return t;
        });
    try {
      Object.freeze(function() {});
    } catch (k) {
      Object.freeze = (function(t) {
        return function(n) {
          return typeof n == 'function' ? n : t(n);
        };
      })(Object.freeze);
    }
    Object.preventExtensions ||
      (Object.preventExtensions = function(t) {
        return t;
      }),
      Object.isSealed ||
        (Object.isSealed = function(t) {
          return !1;
        }),
      Object.isFrozen ||
        (Object.isFrozen = function(t) {
          return !1;
        }),
      Object.isExtensible ||
        (Object.isExtensible = function(t) {
          if (Object(t) === t) throw new TypeError();
          var n = '';
          while (f(t, n)) n += '?';
          t[n] = !0;
          var r = f(t, n);
          return delete t[n], r;
        });
    if (!Object.keys) {
      var L = !0,
        A = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        O = A.length;
      for (var M in { toString: null }) L = !1;
      Object.keys = function I(e) {
        if ((typeof e != 'object' && typeof e != 'function') || e === null)
          throw new TypeError('Object.keys called on a non-object');
        var I = [];
        for (var t in e) f(e, t) && I.push(t);
        if (L)
          for (var n = 0, r = O; n < r; n++) {
            var i = A[n];
            f(e, i) && I.push(i);
          }
        return I;
      };
    }
    Date.now ||
      (Date.now = function() {
        return new Date().getTime();
      });
    var _ =
      '	\n\x0b\f\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff';
    if (!String.prototype.trim || _.trim()) {
      _ = '[' + _ + ']';
      var D = new RegExp('^' + _ + _ + '*'),
        P = new RegExp(_ + _ + '*$');
      String.prototype.trim = function() {
        return String(this)
          .replace(D, '')
          .replace(P, '');
      };
    }
    var F = function(e) {
      if (e == null) throw new TypeError("can't convert " + e + ' to object');
      return Object(e);
    };
  });
