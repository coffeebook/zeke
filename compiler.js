(function() {
  var Code, call_bound_func, coffee, coffeecup, parser, skeleton, uglify, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  coffee = require('coffee-script');

  _ref = require('uglify-js'), uglify = _ref.uglify, parser = _ref.parser;

  coffeecup = null;

  exports.setup = function(cc) {
    return coffeecup = cc;
  };

  skeleton = 'var __cc = {\n  buffer: \'\'\n};\nvar text = function(txt) {\n  if (typeof txt === \'string\' || txt instanceof String) {\n    __cc.buffer += txt;\n  } else if (typeof txt === \'number\' || txt instanceof Number) {\n    __cc.buffer += txt.toString();\n  }\n};\nvar h = function(txt) {\n  var escaped;\n  if (typeof txt === \'string\' || txt instanceof String) {\n    escaped = txt.replace(/&/g, \'&amp;\')\n      .replace(/</g, \'&lt;\')\n      .replace(/>/g, \'&gt;\')\n      .replace(/"/g, \'&quot;\');\n  } else {\n    escaped = txt;\n  }\n  return escaped;\n};\n\nvar inline = function(f) {\n  var old_buffer, temp_buffer;\n  temp_buffer = "";\n  old_buffer = __cc.buffer;\n  __cc.buffer = temp_buffer;\n  f();\n  temp_buffer = __cc.buffer;\n  __cc.buffer = old_buffer;\n  return temp_buffer;\n};';

  call_bound_func = function(func) {
    return ['call', ['dot', func, 'call'], [['name', 'data']]];
  };

  Code = (function() {

    function Code(parent) {
      this.parent = parent;
      this.nodes = [];
      this.line = '';
    }

    Code.prototype.call = function(arg) {
      return ['stat', ['call', ['name', 'text'], [arg]]];
    };

    Code.prototype.append = function(str) {
      if (this.block != null) {
        return this.block.append(str);
      } else {
        return this.line += str;
      }
    };

    Code.prototype.flush = function() {
      if (this.block != null) {
        return this.block.flush();
      } else {
        this.merge_text(['string', this.line]);
        return this.line = '';
      }
    };

    Code.prototype.open_if = function(condition) {
      this.flush();
      if (this.block != null) {
        return this.block.open_if(condition);
      } else {
        this.block = new Code();
        return this.block.condition = condition;
      }
    };

    Code.prototype.close_if = function() {
      this.flush();
      if (this.block.block != null) {
        return this.block.close_if();
      } else {
        this.nodes.push(['if', this.block.condition, ['block', this.block.nodes]]);
        return delete this.block;
      }
    };

    Code.prototype.push = function(node) {
      this.flush();
      if (this.block != null) {
        return this.block.push(node);
      } else {
        return this.merge_text(node);
      }
    };

    Code.prototype.merge_text = function(arg) {
      var l, ok, oldArg, prev, _ref2, _ref3;
      if (arg[0] === 'binary' && arg[1] === '+') {
        this.merge_text(arg[2]);
        arg = arg[3];
      }
      if (l = this.nodes.length) {
        prev = this.nodes[l - 1];
        if (prev[0] === 'stat' && prev[1][0] === 'call' && prev[1][1][0] === 'name' && prev[1][1][1] === 'text') {
          oldArg = prev[1][2][0];
          ok = ['string', 'num'];
          if ((_ref2 = oldArg[0], __indexOf.call(ok, _ref2) >= 0) && (_ref3 = arg[0], __indexOf.call(ok, _ref3) >= 0)) {
            prev[1][2][0] = ['string', oldArg[1] + arg[1]];
            return;
          }
        }
      }
      return this.nodes.push(this.call(arg));
    };

    Code.prototype.get_nodes = function() {
      this.flush();
      if (this.parent[0] === 'stat') return ['splice', this.nodes];
      return call_bound_func(['function', null, [], this.nodes]);
    };

    return Code;

  })();

  exports.compile = function(source, hardcoded_locals, options) {
    var ast, code, compiled, escape, w;
    escape = function(node) {
      if (options.autoescape) return ['call', ['name', 'h'], [node]];
      return node;
    };
    ast = parser.parse(hardcoded_locals + ("(" + source + ").call(data);"));
    w = uglify.ast_walker();
    ast = w.with_walkers({
      call: function(expr, args) {
        var arg, classes, code, comment, condition, contents, doctype, escape_all, func, i, id, idx, name, node, render_attrs, _i, _j, _k, _len, _len2, _len3, _len4, _ref2, _ref3, _ref4;
        name = expr[1];
        if (name === 'doctype') {
          code = new Code(w.parent());
          if (args.length > 0) {
            doctype = args[0][1].toString();
            if (doctype in coffeecup.doctypes) {
              code.append(coffeecup.doctypes[doctype]);
            } else {
              throw new Error('Invalid doctype');
            }
          } else {
            code.append(coffeecup.doctypes["default"]);
          }
          return code.get_nodes();
        } else if (name === 'comment') {
          comment = args[0];
          code = new Code(w.parent());
          if (comment[0] === 'string') {
            code.append("<!--" + comment[1] + "-->");
          } else {
            code.append('<!--');
            code.push(escape(comment));
            code.append('-->');
          }
          return code.get_nodes();
        } else if (name === 'ie') {
          condition = args[0], contents = args[1];
          code = new Code(w.parent());
          if (condition[0] === 'string') {
            code.append("<!--[if " + condition[1] + "]>");
          } else {
            code.append('<!--[if ');
            code.push(escape(condition));
            code.append(']>');
          }
          code.push(call_bound_func(w.walk(contents)));
          code.append('<![endif]-->');
          return code.get_nodes();
        } else if (__indexOf.call(coffeecup.tags, name) >= 0 || (name === 'tag' || name === 'coffeescript')) {
          if (name === 'tag') name = args.shift()[1];
          if (name === 'coffeescript') {
            name = 'script';
            for (_i = 0, _len = args.length; _i < _len; _i++) {
              arg = args[_i];
              if ((_ref2 = arg[0]) !== 'string' && _ref2 !== 'object' && _ref2 !== 'function') {
                throw new Error('Invalid argument to coffeescript function');
              }
              if (arg[0] === 'string' && (args.length === 1 || arg !== args[0])) {
                arg[1] = coffee.compile(arg[1], {
                  bare: true
                });
              }
            }
          }
          code = new Code(w.parent());
          code.append("<" + name);
          for (_j = 0, _len2 = args.length; _j < _len2; _j++) {
            arg = args[_j];
            switch (arg[0]) {
              case 'function':
                if (name === 'script') {
                  func = uglify.gen_code(arg, {
                    beautify: true,
                    indent_level: 2
                  });
                  contents = ['string', "" + func + ".call(this);"];
                } else {
                  func = w.walk(arg);
                  _ref3 = func[3];
                  for (idx = 0, _len3 = _ref3.length; idx < _len3; idx++) {
                    node = _ref3[idx];
                    if (node[0] === 'return' && (node[1] != null) && node[1][0] !== 'string') {
                      func[3][idx][1] = escape(node[1]);
                    }
                  }
                  contents = call_bound_func(func);
                }
                break;
              case 'object':
                render_attrs = function(obj, prefix) {
                  var attr, key, value, varname, _k, _len4, _ref4, _ref5, _results;
                  if (prefix == null) prefix = '';
                  _results = [];
                  for (_k = 0, _len4 = obj.length; _k < _len4; _k++) {
                    attr = obj[_k];
                    key = attr[0];
                    value = attr[1];
                    if (value[0] === 'name' && value[1] === 'true') {
                      _results.push(code.append(" " + key + "=\"" + key + "\""));
                    } else if (value[0] === 'name' && ((_ref4 = value[1]) === 'undefined' || _ref4 === 'null' || _ref4 === 'false')) {
                      continue;
                    } else if ((_ref5 = value[0]) === 'name' || _ref5 === 'dot') {
                      varname = uglify.gen_code(value);
                      condition = "typeof " + varname + " !== 'undefined' && " + varname + " !== null && " + varname + " !== false";
                      code.open_if(parser.parse(condition)[1][0][1]);
                      code.append(" " + (prefix + key) + "=\"");
                      code.push(escape(value));
                      code.append('"');
                      _results.push(code.close_if());
                    } else if (value[0] === 'string') {
                      _results.push(code.append(" " + (prefix + key) + "=\"" + value[1] + "\""));
                    } else if (value[0] === 'function') {
                      func = uglify.gen_code(value).replace(/"/g, '&quot;');
                      _results.push(code.append(" " + (prefix + key) + "=\"" + func + ".call(this);\""));
                    } else if (value[0] === 'object') {
                      _results.push(render_attrs(value[1], prefix + key + '-'));
                    } else {
                      code.append(" " + (prefix + key) + "=\"");
                      code.push(escape(value));
                      _results.push(code.append('"'));
                    }
                  }
                  return _results;
                };
                render_attrs(arg[1]);
                break;
              case 'string':
                if (args.length > 1 && arg === args[0]) {
                  classes = [];
                  _ref4 = arg[1].split('.');
                  for (_k = 0, _len4 = _ref4.length; _k < _len4; _k++) {
                    i = _ref4[_k];
                    if (__indexOf.call(i, '#') >= 0) {
                      id = i.replace('#', '');
                    } else {
                      if (i !== '') classes.push(i);
                    }
                  }
                  if (id) code.append(" id=\"" + id + "\"");
                  if (classes.length > 0) {
                    code.append(" class=\"" + (classes.join(' ')) + "\"");
                  }
                } else {
                  arg[1] = arg[1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                  contents = arg;
                }
                break;
              case 'binary':
                escape_all = function(node) {
                  switch (node[0]) {
                    case 'binary':
                      node[2] = escape_all(node[2]);
                      node[3] = escape_all(node[3]);
                      return node;
                    case 'string':
                      return node;
                    case 'call':
                      return escape(node);
                    default:
                      return escape(node);
                  }
                };
                contents = escape_all(w.walk(arg));
                break;
              default:
                contents = escape(w.walk(arg));
            }
          }
          if (__indexOf.call(coffeecup.self_closing, name) >= 0) {
            code.append(' />');
          } else {
            code.append('>');
          }
          if (contents != null) code.push(contents);
          if (!(__indexOf.call(coffeecup.self_closing, name) >= 0)) {
            code.append("</" + name + ">");
          }
          return code.get_nodes();
        }
        return null;
      }
    }, function() {
      return w.walk(ast);
    });
    compiled = uglify.gen_code(ast, {
      beautify: true,
      indent_level: 2
    });
    code = skeleton + compiled + "return __cc.buffer;";
    return new Function('data', code);
  };

}).call(this);