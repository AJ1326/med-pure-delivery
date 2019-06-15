define('ace/mode/ada_highlight_rules', [
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
      var e =
          'abort|else|new|return|abs|elsif|not|reverse|abstract|end|null|accept|entry|select|access|exception|of|separate|aliased|exit|or|some|all|others|subtype|and|for|out|synchronized|array|function|overriding|at|tagged|generic|package|task|begin|goto|pragma|terminate|body|private|then|if|procedure|type|case|in|protected|constant|interface|until||is|raise|use|declare|range|delay|limited|record|when|delta|loop|rem|while|digits|renames|with|do|mod|requeue|xor',
        t = 'true|false|null',
        n = 'count|min|max|avg|sum|rank|now|coalesce|main',
        r = this.createKeywordMapper({ 'support.function': n, keyword: e, 'constant.language': t }, 'identifier', !0);
      this.$rules = {
        start: [
          { token: 'comment', regex: '--.*$' },
          { token: 'string', regex: '".*?"' },
          { token: 'string', regex: "'.*?'" },
          { token: 'constant.numeric', regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b' },
          { token: r, regex: '[a-zA-Z_$][a-zA-Z0-9_$]*\\b' },
          { token: 'keyword.operator', regex: '\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|=' },
          { token: 'paren.lparen', regex: '[\\(]' },
          { token: 'paren.rparen', regex: '[\\)]' },
          { token: 'text', regex: '\\s+' }
        ]
      };
    };
  r.inherits(s, i), (t.AdaHighlightRules = s);
}),
  define('ace/mode/ada', [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/ada_highlight_rules'
  ], function(e, t, n) {
    'use strict';
    var r = e('../lib/oop'),
      i = e('./text').Mode,
      s = e('./ada_highlight_rules').AdaHighlightRules,
      o = function() {
        (this.HighlightRules = s), (this.$behaviour = this.$defaultBehaviour);
      };
    r.inherits(o, i),
      function() {
        (this.lineCommentStart = '--'), (this.$id = 'ace/mode/ada');
      }.call(o.prototype),
      (t.Mode = o);
  });
(function() {
  window.require(['ace/mode/ada'], function(m) {
    if (typeof module == 'object' && typeof exports == 'object' && module) {
      module.exports = m;
    }
  });
})();
