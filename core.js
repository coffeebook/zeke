var cache, coffee, coffeescript_helpers, elements, merge_elements, skeleton, zeke;
var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

coffee = require('coffee-script');

zeke = {};

zeke.doctypes = {
  'default': '<!DOCTYPE html>',
  '5': '<!DOCTYPE html>',
  'xml': '<?xml version="1.0" encoding="utf-8" ?>',
  'transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
  'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
  'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
  '1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
  'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
  'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">',
  'ce': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "ce-html-1.0-transitional.dtd">'
};

coffeescript_helpers = "var __slice = Array.prototype.slice;\nvar __hasProp = Object.prototype.hasOwnProperty;\nvar __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };\nvar __extends = function(child, parent) {\n  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }\n  function ctor() { this.constructor = child; }\n  ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype;\n  return child; };\nvar __indexOf = Array.prototype.indexOf || function(item) {\n  for (var i = 0, l = this.length; i < l; i++) {\n    if (this[i] === item) return i;\n  } return -1; };".replace(/\n/g, '');

elements = {
  regular: 'a abbr address article aside audio b bdi bdo blockquote body button\
 canvas caption cite code colgroup datalist dd del details dfn div dl dt em\
 fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup\
 html i iframe ins kbd label legend li map mark menu meter nav noscript object\
 ol optgroup option output p pre progress q rp rt ruby s samp script section\
 select small span strong style sub summary sup table tbody td textarea tfoot\
 th thead time title tr u ul video',
  svg: 'a altGlyph altGlyphDef altGlyphItem animate animateColor animateMotion\
 animateTransform circle clipPath color-profile cursor defs desc ellipse\
 feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix\
 feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB\
 feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology\
 feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence\
 filter font font-face font-face-format font-face-name font-face-src\
 font-face-uri foreignObject g glyph glyphRef hkern image line linearGradient\
 marker mask metadata missing-glyph mpath path pattern polygon polyline\
 radialGradient rect script set stop style svg symbol text textPath\
 title tref tspan use view vkern',
  "void": 'area base br col command embed hr img input keygen link meta param\
 source track wbr',
  obsolete: 'applet acronym bgsound dir frameset noframes isindex listing\
 nextid noembed plaintext rb strike xmp big blink center font marquee multicol\
 nobr spacer tt',
  obsolete_void: 'basefont frame'
};

merge_elements = function() {
  var a, args, element, result, _i, _j, _len, _len2, _ref;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  result = [];
  for (_i = 0, _len = args.length; _i < _len; _i++) {
    a = args[_i];
    _ref = elements[a].split(' ');
    for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
      element = _ref[_j];
      if (__indexOf.call(result, element) < 0) result.push(element);
    }
  }
  return result;
};

zeke.tags = merge_elements('regular', 'obsolete', 'void', 'obsolete_void', 'svg');

zeke.self_closing = merge_elements('void', 'obsolete_void');

skeleton = function(data) {
  var coffeescript, comment, doctype, h, ie, inline, tag, text, __cc, _ref, _ref2;
  if (data == null) data = {};
  if ((_ref = data.format) == null) data.format = false;
  if ((_ref2 = data.autoescape) == null) data.autoescape = false;
  __cc = {
    buffer: [],
    esc: function(txt) {
      if (data.autoescape) {
        return h(txt);
      } else {
        return txt.toString();
      }
    },
    tabs: 0,
    repeat: function(string, count) {
      return Array(count + 1).join(string);
    },
    indent: function() {
      if (data.format) return text(this.repeat('  ', this.tabs));
    },
    tag: function(name, args) {
      var combo, i, _i, _len;
      combo = [name];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        i = args[_i];
        combo.push(i);
      }
      return tag.apply(data, combo);
    },
    render_idclass: function(str) {
      var c, classes, i, id, _i, _j, _len, _len2, _ref3;
      classes = [];
      _ref3 = str.split('.');
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        i = _ref3[_i];
        if (__indexOf.call(i, '#') >= 0) {
          id = i.replace('#', '');
        } else {
          if (i !== '') classes.push(i);
        }
      }
      if (id) text(" id=\"" + id + "\"");
      if (classes.length > 0) {
        text(" class=\"");
        for (_j = 0, _len2 = classes.length; _j < _len2; _j++) {
          c = classes[_j];
          if (c !== classes[0]) text(' ');
          text(c);
        }
        return text('"');
      }
    },
    render_attrs: function(obj, prefix) {
      var k, v, _results;
      if (prefix == null) prefix = '';
      _results = [];
      for (k in obj) {
        v = obj[k];
        if (typeof v === 'boolean' && v) v = k;
        if (typeof v === 'function') v = "(" + v + ").call(this);";
        if (typeof v === 'object' && !(v instanceof Array)) {
          _results.push(this.render_attrs(v, prefix + k + '-'));
        } else if (v) {
          _results.push(text(" " + (prefix + k) + "=\"" + (this.esc(v)) + "\""));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    render_contents: function(contents, safe) {
      var result;
      if (safe == null) safe = false;
      switch (typeof contents) {
        case 'string':
        case 'number':
        case 'boolean':
          return text(safe ? contents : this.esc(contents));
        case 'function':
          if (data.format) text('\n');
          this.tabs++;
          result = contents.call(data);
          if (typeof result === 'string') {
            this.indent();
            text(safe ? result : this.esc(result));
            if (data.format) text('\n');
          }
          this.tabs--;
          return this.indent();
      }
    },
    render_tag: function(name, idclass, attrs, contents) {
      this.indent();
      text("<" + name);
      if (idclass) this.render_idclass(idclass);
      if (attrs) this.render_attrs(attrs);
      if (__indexOf.call(this.self_closing, name) >= 0) {
        text(' />');
        if (data.format) text('\n');
      } else {
        text('>');
        this.render_contents(contents);
        text("</" + name + ">");
        if (data.format) text('\n');
      }
      return null;
    }
  };
  tag = function() {
    var a, args, attrs, contents, idclass, name, _i, _len;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      a = args[_i];
      switch (typeof a) {
        case 'function':
          contents = a;
          break;
        case 'object':
          attrs = a;
          break;
        case 'number':
        case 'boolean':
          contents = a;
          break;
        case 'string':
          if (args.length === 1) {
            contents = a;
          } else {
            if (a === args[0]) {
              idclass = a;
            } else {
              contents = a;
            }
          }
      }
    }
    return __cc.render_tag(name, idclass, attrs, contents);
  };
  inline = function(f) {
    var old_buffer, temp_buffer;
    temp_buffer = "";
    old_buffer = __cc.buffer;
    __cc.buffer = temp_buffer;
    f();
    temp_buffer = __cc.buffer;
    __cc.buffer = old_buffer;
    return temp_buffer;
  };
  h = function(txt) {
    return txt.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  doctype = function(type) {
    if (type == null) type = 'default';
    text(__cc.doctypes[type]);
    if (data.format) return text('\n');
  };
  text = function(txt) {
    __cc.buffer.push(txt.toString());
    return null;
  };
  comment = function(cmt) {
    text("<!--" + cmt + "-->");
    if (data.format) return text('\n');
  };
  coffeescript = function(param) {
    switch (typeof param) {
      case 'function':
        return script("" + __cc.coffeescript_helpers + "(" + param + ").call(this);");
      case 'string':
        return script({
          type: 'text/coffeescript'
        }, function() {
          return param;
        });
      case 'object':
        param.type = 'text/coffeescript';
        return script(param);
    }
  };
  ie = function(condition, contents) {
    __cc.indent();
    text("<!--[if " + condition + "]>");
    __cc.render_contents(contents);
    text("<![endif]-->");
    if (data.format) return text('\n');
  };
  return null;
};

skeleton = skeleton.toString().replace(/function\s*\(.*\)\s*\{/, '').replace(/return null;\s*\}$/, '');

skeleton = coffeescript_helpers + skeleton;

zeke.helpers = {};

zeke.requireStatements = "";

zeke.compile = function(template, options) {
  var code, hardcoded_locals, hc, t, tag_functions, tags_used, _i, _j, _len, _len2, _ref;
  if (options == null) options = {};
  if (typeof template === 'function') {
    template = template.toString();
  } else if (typeof template === 'string' && (coffee != null)) {
    template = coffee.compile(template, {
      bare: true
    });
    template = "function(){" + template + "}";
  }
  hardcoded_locals = '';
  hc = function(obj) {
    var k, v, _results;
    _results = [];
    for (k in obj) {
      v = obj[k];
      if (typeof v === 'function') {
        _results.push(hardcoded_locals += "var " + k + " = function(){return (" + v + ").apply(data, arguments);};");
      } else if (typeof v === 'object') {
        _results.push(hc(v));
      } else {
        _results.push(hardcoded_locals += "var " + k + " = " + (JSON.stringify(v)) + ";");
      }
    }
    return _results;
  };
  if (zeke.helpers != null) hc(zeke.helpers);
  if (options.hardcode != null) hc(options.hardcode);
  tag_functions = '';
  tags_used = [];
  _ref = zeke.tags;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    t = _ref[_i];
    if (template.indexOf(t) > -1 || hardcoded_locals.indexOf(t) > -1) {
      tags_used.push(t);
    }
  }
  tag_functions += "var " + (tags_used.join(',')) + ";";
  for (_j = 0, _len2 = tags_used.length; _j < _len2; _j++) {
    t = tags_used[_j];
    tag_functions += "" + t + " = function(){return __cc.tag('" + t + "', arguments);};";
  }
  code = zeke.requireStatements + tag_functions + hardcoded_locals + skeleton;
  code += "__cc.doctypes = " + (JSON.stringify(zeke.doctypes)) + ";";
  code += "__cc.coffeescript_helpers = " + (JSON.stringify(coffeescript_helpers)) + ";";
  code += "__cc.self_closing = " + (JSON.stringify(zeke.self_closing)) + ";";
  code += "(" + template + ").call(data);";
  code += "return __cc.buffer.join('');";
  return new Function('data', code);
};

cache = {};

zeke.modules = {};

zeke.render = function(template, data, options) {
  var k, tpl, v;
  if (data == null) data = {};
  if (options == null) options = {};
  for (k in options) {
    v = options[k];
    data[k] = v;
  }
  tpl = zeke.compile(template, data);
  return tpl(data);
};

exports.attach = function(options) {
  this.helpers = zeke.helpers;
  this.compile = zeke.compile;
  this.render = zeke.render;
  this.addModule = function(name, value) {
    return zeke.requireStatements += "var " + name + " = require('" + value + "');";
  };
  return this.initialized = false;
};

exports.init = function(done) {
  this.initialized = true;
  return done();
};
