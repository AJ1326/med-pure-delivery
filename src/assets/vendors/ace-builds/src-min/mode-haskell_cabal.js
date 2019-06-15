define('ace/mode/haskell_cabal_highlight_rules', [
  'require',
  'exports',
  'module',
  'ace/lib/oop',
  'ace/mode/text_highlight_rules'
], function(e, t, n) {
  'use strict';
  var r = e('../lib/oop'),
    i = e('./text_highlight_rules').TextHighlightRules,
    s = function() {
      this.$rules = {
        start: [
          { token: 'comment', regex: '^\\s*--.*$' },
          { token: ['keyword'], regex: /^(\s*\w.*?)(:(?:\s+|$))/ },
          { token: 'constant.numeric', regex: /[\d_]+(?:(?:[\.\d_]*)?)/ },
          { token: 'constant.language.boolean', regex: '(?:true|false|TRUE|FALSE|True|False|yes|no)\\b' },
          { token: 'markup.heading', regex: /^(\w.*)$/ }
        ]
      };
    };
  r.inherits(s, i), (t.CabalHighlightRules = s);
}),
  define('ace/mode/folding/haskell_cabal', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/folding/fold_mode',
    'ace/range'
  ], function(e, t, n) {
    'use strict';
    var r = e('../../lib/oop'),
      i = e('./fold_mode').FoldMode,
      s = e('../../range').Range,
      o = (t.FoldMode = function() {});
    r.inherits(o, i),
      function() {
        (this.isHeading = function(e, t) {
          var n = 'markup.heading',
            r = e.getTokens(t)[0];
          return t == 0 || (r && r.type.lastIndexOf(n, 0) === 0);
        }),
          (this.getFoldWidget = function(e, t, n) {
            if (this.isHeading(e, n)) return 'start';
            if (t === 'markbeginend' && !/^\s*$/.test(e.getLine(n))) {
              var r = e.getLength();
              while (++n < r) if (!/^\s*$/.test(e.getLine(n))) break;
              if (n == r || this.isHeading(e, n)) return 'end';
            }
            return '';
          }),
          (this.getFoldWidgetRange = function(e, t, n) {
            var r = e.getLine(n),
              i = r.length,
              o = e.getLength(),
              u = n,
              a = n;
            if (this.isHeading(e, n)) {
              while (++n < o)
                if (this.isHeading(e, n)) {
                  n--;
                  break;
                }
              a = n;
              if (a > u) while (a > u && /^\s*$/.test(e.getLine(a))) a--;
              if (a > u) {
                var f = e.getLine(a).length;
                return new s(u, i, a, f);
              }
            } else if (this.getFoldWidget(e, t, n) === 'end') {
              var a = n,
                f = e.getLine(a).length;
              while (--n >= 0) if (this.isHeading(e, n)) break;
              var r = e.getLine(n),
                i = r.length;
              return new s(n, i, a, f);
            }
          });
      }.call(o.prototype);
  }),
  define('ace/mode/haskell_cabal', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/haskell_cabal_highlight_rules',
    'ace/mode/folding/haskell_cabal'
  ], function(e, t, n) {
    'use strict';
    var r = e('../lib/oop'),
      i = e('./text').Mode,
      s = e('./haskell_cabal_highlight_rules').CabalHighlightRules,
      o = e('./folding/haskell_cabal').FoldMode,
      u = function() {
        (this.HighlightRules = s), (this.foldingRules = new o()), (this.$behaviour = this.$defaultBehaviour);
      };
    r.inherits(u, i),
      function() {
        (this.lineCommentStart = '--'), (this.blockComment = null), (this.$id = 'ace/mode/haskell_cabal');
      }.call(u.prototype),
      (t.Mode = u);
  });
(function() {
  window.require(['ace/mode/haskell_cabal'], function(m) {
    if (typeof module == 'object' && typeof exports == 'object' && module) {
      module.exports = m;
    }
  });
})();
