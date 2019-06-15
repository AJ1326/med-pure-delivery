define('ace/snippets/vala', ['require', 'exports', 'module'], function(e, t, n) {
  'use strict';
  (t.snippets = [
    { content: 'case ${1:condition}:\n	$0\n	break;\n', name: 'case', scope: 'vala', tabTrigger: 'case' },
    {
      content:
        '/**\n * ${6}\n */\n${1:public} class ${2:MethodName}${3: : GLib.Object} {\n\n	/**\n	 * ${7}\n	 */\n	public ${2}(${4}) {\n		${5}\n	}\n\n	$0\n}',
      name: 'class',
      scope: 'vala',
      tabTrigger: 'class'
    },
    { content: '(${1}) => {\n	${0}\n}\n', name: 'closure', scope: 'vala', tabTrigger: '=>' },
    { content: '/*\n * $0\n */', name: 'Comment (multiline)', scope: 'vala', tabTrigger: '/*' },
    {
      content: 'Console.WriteLine($1);\n$0',
      name: 'Console.WriteLine (writeline)',
      scope: 'vala',
      tabTrigger: 'writeline'
    },
    { content: '[DBus(name = "$0")]', name: 'DBus annotation', scope: 'vala', tabTrigger: '[DBus' },
    { content: 'delegate ${1:void} ${2:DelegateName}($0);', name: 'delegate', scope: 'vala', tabTrigger: 'delegate' },
    { content: 'do {\n	$0\n} while ($1);\n', name: 'do while', scope: 'vala', tabTrigger: 'dowhile' },
    { content: '/**\n * $0\n */', name: 'DocBlock', scope: 'vala', tabTrigger: '/**' },
    { content: 'else if ($1) {\n	$0\n}\n', name: 'else if (elseif)', scope: 'vala', tabTrigger: 'elseif' },
    { content: 'else {\n	$0\n}', name: 'else', scope: 'vala', tabTrigger: 'else' },
    { content: 'enum {$1:EnumName} {\n	$0\n}', name: 'enum', scope: 'vala', tabTrigger: 'enum' },
    {
      content: 'public errordomain ${1:Error} {\n	$0\n}',
      name: 'error domain',
      scope: 'vala',
      tabTrigger: 'errordomain'
    },
    { content: 'for ($1;$2;$3) {\n	$0\n}', name: 'for', scope: 'vala', tabTrigger: 'for' },
    { content: 'foreach ($1 in $2) {\n	$0\n}', name: 'foreach', scope: 'vala', tabTrigger: 'foreach' },
    { content: 'Gee.ArrayList<${1:G}>($0);', name: 'Gee.ArrayList', scope: 'vala', tabTrigger: 'ArrayList' },
    { content: 'Gee.HashMap<${1:K},${2:V}>($0);', name: 'Gee.HashMap', scope: 'vala', tabTrigger: 'HashMap' },
    { content: 'Gee.HashSet<${1:G}>($0);', name: 'Gee.HashSet', scope: 'vala', tabTrigger: 'HashSet' },
    { content: 'if ($1) {\n	$0\n}', name: 'if', scope: 'vala', tabTrigger: 'if' },
    {
      content: 'interface ${1:InterfaceName}{$2: : SuperInterface} {\n	$0\n}',
      name: 'interface',
      scope: 'vala',
      tabTrigger: 'interface'
    },
    {
      content: 'public static int main(string [] argv) {\n	${0}\n	return 0;\n}',
      name: 'Main function',
      scope: 'vala',
      tabTrigger: 'main'
    },
    { content: 'namespace $1 {\n	$0\n}\n', name: 'namespace (ns)', scope: 'vala', tabTrigger: 'ns' },
    { content: 'stdout.printf($0);', name: 'printf', scope: 'vala', tabTrigger: 'printf' },
    {
      content: '${1:public} ${2:Type} ${3:Name} {\n	set {\n		$0\n	}\n	get {\n\n	}\n}',
      name: 'property (prop)',
      scope: 'vala',
      tabTrigger: 'prop'
    },
    {
      content: '${1:public} ${2:Type} ${3:Name} {\n	get {\n		$0\n	}\n}',
      name: 'read-only property (roprop)',
      scope: 'vala',
      tabTrigger: 'roprop'
    },
    { content: '@"${1:\\$var}"', name: 'String template (@)', scope: 'vala', tabTrigger: '@' },
    { content: 'struct ${1:StructName} {\n	$0\n}', name: 'struct', scope: 'vala', tabTrigger: 'struct' },
    { content: 'switch ($1) {\n	$0\n}', name: 'switch', scope: 'vala', tabTrigger: 'switch' },
    { content: 'try {\n	$2\n} catch (${1:Error} e) {\n	$0\n}', name: 'try/catch', scope: 'vala', tabTrigger: 'try' },
    { content: '"""$0""";', name: 'Verbatim string (""")', scope: 'vala', tabTrigger: 'verbatim' },
    { content: 'while ($1) {\n	$0\n}', name: 'while', scope: 'vala', tabTrigger: 'while' }
  ]),
    (t.scope = '');
});
(function() {
  window.require(['ace/snippets/vala'], function(m) {
    if (typeof module == 'object' && typeof exports == 'object' && module) {
      module.exports = m;
    }
  });
})();
