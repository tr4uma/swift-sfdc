module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/sax/lib/sax.js":
/*!*************************************!*\
  !*** ./node_modules/sax/lib/sax.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

;(function (sax) { // wrapper for non-node envs
  sax.parser = function (strict, opt) { return new SAXParser(strict, opt) }
  sax.SAXParser = SAXParser
  sax.SAXStream = SAXStream
  sax.createStream = createStream

  // When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
  // When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
  // since that's the earliest that a buffer overrun could occur.  This way, checks are
  // as rare as required, but as often as necessary to ensure never crossing this bound.
  // Furthermore, buffers are only tested at most once per write(), so passing a very
  // large string into write() might have undesirable effects, but this is manageable by
  // the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
  // edge case, result in creating at most one complete copy of the string passed in.
  // Set to Infinity to have unlimited buffers.
  sax.MAX_BUFFER_LENGTH = 64 * 1024

  var buffers = [
    'comment', 'sgmlDecl', 'textNode', 'tagName', 'doctype',
    'procInstName', 'procInstBody', 'entity', 'attribName',
    'attribValue', 'cdata', 'script'
  ]

  sax.EVENTS = [
    'text',
    'processinginstruction',
    'sgmldeclaration',
    'doctype',
    'comment',
    'opentagstart',
    'attribute',
    'opentag',
    'closetag',
    'opencdata',
    'cdata',
    'closecdata',
    'error',
    'end',
    'ready',
    'script',
    'opennamespace',
    'closenamespace'
  ]

  function SAXParser (strict, opt) {
    if (!(this instanceof SAXParser)) {
      return new SAXParser(strict, opt)
    }

    var parser = this
    clearBuffers(parser)
    parser.q = parser.c = ''
    parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH
    parser.opt = opt || {}
    parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags
    parser.looseCase = parser.opt.lowercase ? 'toLowerCase' : 'toUpperCase'
    parser.tags = []
    parser.closed = parser.closedRoot = parser.sawRoot = false
    parser.tag = parser.error = null
    parser.strict = !!strict
    parser.noscript = !!(strict || parser.opt.noscript)
    parser.state = S.BEGIN
    parser.strictEntities = parser.opt.strictEntities
    parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES)
    parser.attribList = []

    // namespaces form a prototype chain.
    // it always points at the current tag,
    // which protos to its parent tag.
    if (parser.opt.xmlns) {
      parser.ns = Object.create(rootNS)
    }

    // mostly just for error reporting
    parser.trackPosition = parser.opt.position !== false
    if (parser.trackPosition) {
      parser.position = parser.line = parser.column = 0
    }
    emit(parser, 'onready')
  }

  if (!Object.create) {
    Object.create = function (o) {
      function F () {}
      F.prototype = o
      var newf = new F()
      return newf
    }
  }

  if (!Object.keys) {
    Object.keys = function (o) {
      var a = []
      for (var i in o) if (o.hasOwnProperty(i)) a.push(i)
      return a
    }
  }

  function checkBufferLength (parser) {
    var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10)
    var maxActual = 0
    for (var i = 0, l = buffers.length; i < l; i++) {
      var len = parser[buffers[i]].length
      if (len > maxAllowed) {
        // Text/cdata nodes can get big, and since they're buffered,
        // we can get here under normal conditions.
        // Avoid issues by emitting the text node now,
        // so at least it won't get any bigger.
        switch (buffers[i]) {
          case 'textNode':
            closeText(parser)
            break

          case 'cdata':
            emitNode(parser, 'oncdata', parser.cdata)
            parser.cdata = ''
            break

          case 'script':
            emitNode(parser, 'onscript', parser.script)
            parser.script = ''
            break

          default:
            error(parser, 'Max buffer length exceeded: ' + buffers[i])
        }
      }
      maxActual = Math.max(maxActual, len)
    }
    // schedule the next check for the earliest possible buffer overrun.
    var m = sax.MAX_BUFFER_LENGTH - maxActual
    parser.bufferCheckPosition = m + parser.position
  }

  function clearBuffers (parser) {
    for (var i = 0, l = buffers.length; i < l; i++) {
      parser[buffers[i]] = ''
    }
  }

  function flushBuffers (parser) {
    closeText(parser)
    if (parser.cdata !== '') {
      emitNode(parser, 'oncdata', parser.cdata)
      parser.cdata = ''
    }
    if (parser.script !== '') {
      emitNode(parser, 'onscript', parser.script)
      parser.script = ''
    }
  }

  SAXParser.prototype = {
    end: function () { end(this) },
    write: write,
    resume: function () { this.error = null; return this },
    close: function () { return this.write(null) },
    flush: function () { flushBuffers(this) }
  }

  var Stream
  try {
    Stream = __webpack_require__(/*! stream */ "stream").Stream
  } catch (ex) {
    Stream = function () {}
  }

  var streamWraps = sax.EVENTS.filter(function (ev) {
    return ev !== 'error' && ev !== 'end'
  })

  function createStream (strict, opt) {
    return new SAXStream(strict, opt)
  }

  function SAXStream (strict, opt) {
    if (!(this instanceof SAXStream)) {
      return new SAXStream(strict, opt)
    }

    Stream.apply(this)

    this._parser = new SAXParser(strict, opt)
    this.writable = true
    this.readable = true

    var me = this

    this._parser.onend = function () {
      me.emit('end')
    }

    this._parser.onerror = function (er) {
      me.emit('error', er)

      // if didn't throw, then means error was handled.
      // go ahead and clear error, so we can write again.
      me._parser.error = null
    }

    this._decoder = null

    streamWraps.forEach(function (ev) {
      Object.defineProperty(me, 'on' + ev, {
        get: function () {
          return me._parser['on' + ev]
        },
        set: function (h) {
          if (!h) {
            me.removeAllListeners(ev)
            me._parser['on' + ev] = h
            return h
          }
          me.on(ev, h)
        },
        enumerable: true,
        configurable: false
      })
    })
  }

  SAXStream.prototype = Object.create(Stream.prototype, {
    constructor: {
      value: SAXStream
    }
  })

  SAXStream.prototype.write = function (data) {
    if (typeof Buffer === 'function' &&
      typeof Buffer.isBuffer === 'function' &&
      Buffer.isBuffer(data)) {
      if (!this._decoder) {
        var SD = __webpack_require__(/*! string_decoder */ "string_decoder").StringDecoder
        this._decoder = new SD('utf8')
      }
      data = this._decoder.write(data)
    }

    this._parser.write(data.toString())
    this.emit('data', data)
    return true
  }

  SAXStream.prototype.end = function (chunk) {
    if (chunk && chunk.length) {
      this.write(chunk)
    }
    this._parser.end()
    return true
  }

  SAXStream.prototype.on = function (ev, handler) {
    var me = this
    if (!me._parser['on' + ev] && streamWraps.indexOf(ev) !== -1) {
      me._parser['on' + ev] = function () {
        var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
        args.splice(0, 0, ev)
        me.emit.apply(me, args)
      }
    }

    return Stream.prototype.on.call(me, ev, handler)
  }

  // this really needs to be replaced with character classes.
  // XML allows all manner of ridiculous numbers and digits.
  var CDATA = '[CDATA['
  var DOCTYPE = 'DOCTYPE'
  var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace'
  var XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/'
  var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE }

  // http://www.w3.org/TR/REC-xml/#NT-NameStartChar
  // This implementation works on strings, a single character at a time
  // as such, it cannot ever support astral-plane characters (10000-EFFFF)
  // without a significant breaking change to either this  parser, or the
  // JavaScript language.  Implementation of an emoji-capable xml parser
  // is left as an exercise for the reader.
  var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/

  var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

  var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/
  var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

  function isWhitespace (c) {
    return c === ' ' || c === '\n' || c === '\r' || c === '\t'
  }

  function isQuote (c) {
    return c === '"' || c === '\''
  }

  function isAttribEnd (c) {
    return c === '>' || isWhitespace(c)
  }

  function isMatch (regex, c) {
    return regex.test(c)
  }

  function notMatch (regex, c) {
    return !isMatch(regex, c)
  }

  var S = 0
  sax.STATE = {
    BEGIN: S++, // leading byte order mark or whitespace
    BEGIN_WHITESPACE: S++, // leading whitespace
    TEXT: S++, // general stuff
    TEXT_ENTITY: S++, // &amp and such.
    OPEN_WAKA: S++, // <
    SGML_DECL: S++, // <!BLARG
    SGML_DECL_QUOTED: S++, // <!BLARG foo "bar
    DOCTYPE: S++, // <!DOCTYPE
    DOCTYPE_QUOTED: S++, // <!DOCTYPE "//blah
    DOCTYPE_DTD: S++, // <!DOCTYPE "//blah" [ ...
    DOCTYPE_DTD_QUOTED: S++, // <!DOCTYPE "//blah" [ "foo
    COMMENT_STARTING: S++, // <!-
    COMMENT: S++, // <!--
    COMMENT_ENDING: S++, // <!-- blah -
    COMMENT_ENDED: S++, // <!-- blah --
    CDATA: S++, // <![CDATA[ something
    CDATA_ENDING: S++, // ]
    CDATA_ENDING_2: S++, // ]]
    PROC_INST: S++, // <?hi
    PROC_INST_BODY: S++, // <?hi there
    PROC_INST_ENDING: S++, // <?hi "there" ?
    OPEN_TAG: S++, // <strong
    OPEN_TAG_SLASH: S++, // <strong /
    ATTRIB: S++, // <a
    ATTRIB_NAME: S++, // <a foo
    ATTRIB_NAME_SAW_WHITE: S++, // <a foo _
    ATTRIB_VALUE: S++, // <a foo=
    ATTRIB_VALUE_QUOTED: S++, // <a foo="bar
    ATTRIB_VALUE_CLOSED: S++, // <a foo="bar"
    ATTRIB_VALUE_UNQUOTED: S++, // <a foo=bar
    ATTRIB_VALUE_ENTITY_Q: S++, // <foo bar="&quot;"
    ATTRIB_VALUE_ENTITY_U: S++, // <foo bar=&quot
    CLOSE_TAG: S++, // </a
    CLOSE_TAG_SAW_WHITE: S++, // </a   >
    SCRIPT: S++, // <script> ...
    SCRIPT_ENDING: S++ // <script> ... <
  }

  sax.XML_ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'"
  }

  sax.ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'",
    'AElig': 198,
    'Aacute': 193,
    'Acirc': 194,
    'Agrave': 192,
    'Aring': 197,
    'Atilde': 195,
    'Auml': 196,
    'Ccedil': 199,
    'ETH': 208,
    'Eacute': 201,
    'Ecirc': 202,
    'Egrave': 200,
    'Euml': 203,
    'Iacute': 205,
    'Icirc': 206,
    'Igrave': 204,
    'Iuml': 207,
    'Ntilde': 209,
    'Oacute': 211,
    'Ocirc': 212,
    'Ograve': 210,
    'Oslash': 216,
    'Otilde': 213,
    'Ouml': 214,
    'THORN': 222,
    'Uacute': 218,
    'Ucirc': 219,
    'Ugrave': 217,
    'Uuml': 220,
    'Yacute': 221,
    'aacute': 225,
    'acirc': 226,
    'aelig': 230,
    'agrave': 224,
    'aring': 229,
    'atilde': 227,
    'auml': 228,
    'ccedil': 231,
    'eacute': 233,
    'ecirc': 234,
    'egrave': 232,
    'eth': 240,
    'euml': 235,
    'iacute': 237,
    'icirc': 238,
    'igrave': 236,
    'iuml': 239,
    'ntilde': 241,
    'oacute': 243,
    'ocirc': 244,
    'ograve': 242,
    'oslash': 248,
    'otilde': 245,
    'ouml': 246,
    'szlig': 223,
    'thorn': 254,
    'uacute': 250,
    'ucirc': 251,
    'ugrave': 249,
    'uuml': 252,
    'yacute': 253,
    'yuml': 255,
    'copy': 169,
    'reg': 174,
    'nbsp': 160,
    'iexcl': 161,
    'cent': 162,
    'pound': 163,
    'curren': 164,
    'yen': 165,
    'brvbar': 166,
    'sect': 167,
    'uml': 168,
    'ordf': 170,
    'laquo': 171,
    'not': 172,
    'shy': 173,
    'macr': 175,
    'deg': 176,
    'plusmn': 177,
    'sup1': 185,
    'sup2': 178,
    'sup3': 179,
    'acute': 180,
    'micro': 181,
    'para': 182,
    'middot': 183,
    'cedil': 184,
    'ordm': 186,
    'raquo': 187,
    'frac14': 188,
    'frac12': 189,
    'frac34': 190,
    'iquest': 191,
    'times': 215,
    'divide': 247,
    'OElig': 338,
    'oelig': 339,
    'Scaron': 352,
    'scaron': 353,
    'Yuml': 376,
    'fnof': 402,
    'circ': 710,
    'tilde': 732,
    'Alpha': 913,
    'Beta': 914,
    'Gamma': 915,
    'Delta': 916,
    'Epsilon': 917,
    'Zeta': 918,
    'Eta': 919,
    'Theta': 920,
    'Iota': 921,
    'Kappa': 922,
    'Lambda': 923,
    'Mu': 924,
    'Nu': 925,
    'Xi': 926,
    'Omicron': 927,
    'Pi': 928,
    'Rho': 929,
    'Sigma': 931,
    'Tau': 932,
    'Upsilon': 933,
    'Phi': 934,
    'Chi': 935,
    'Psi': 936,
    'Omega': 937,
    'alpha': 945,
    'beta': 946,
    'gamma': 947,
    'delta': 948,
    'epsilon': 949,
    'zeta': 950,
    'eta': 951,
    'theta': 952,
    'iota': 953,
    'kappa': 954,
    'lambda': 955,
    'mu': 956,
    'nu': 957,
    'xi': 958,
    'omicron': 959,
    'pi': 960,
    'rho': 961,
    'sigmaf': 962,
    'sigma': 963,
    'tau': 964,
    'upsilon': 965,
    'phi': 966,
    'chi': 967,
    'psi': 968,
    'omega': 969,
    'thetasym': 977,
    'upsih': 978,
    'piv': 982,
    'ensp': 8194,
    'emsp': 8195,
    'thinsp': 8201,
    'zwnj': 8204,
    'zwj': 8205,
    'lrm': 8206,
    'rlm': 8207,
    'ndash': 8211,
    'mdash': 8212,
    'lsquo': 8216,
    'rsquo': 8217,
    'sbquo': 8218,
    'ldquo': 8220,
    'rdquo': 8221,
    'bdquo': 8222,
    'dagger': 8224,
    'Dagger': 8225,
    'bull': 8226,
    'hellip': 8230,
    'permil': 8240,
    'prime': 8242,
    'Prime': 8243,
    'lsaquo': 8249,
    'rsaquo': 8250,
    'oline': 8254,
    'frasl': 8260,
    'euro': 8364,
    'image': 8465,
    'weierp': 8472,
    'real': 8476,
    'trade': 8482,
    'alefsym': 8501,
    'larr': 8592,
    'uarr': 8593,
    'rarr': 8594,
    'darr': 8595,
    'harr': 8596,
    'crarr': 8629,
    'lArr': 8656,
    'uArr': 8657,
    'rArr': 8658,
    'dArr': 8659,
    'hArr': 8660,
    'forall': 8704,
    'part': 8706,
    'exist': 8707,
    'empty': 8709,
    'nabla': 8711,
    'isin': 8712,
    'notin': 8713,
    'ni': 8715,
    'prod': 8719,
    'sum': 8721,
    'minus': 8722,
    'lowast': 8727,
    'radic': 8730,
    'prop': 8733,
    'infin': 8734,
    'ang': 8736,
    'and': 8743,
    'or': 8744,
    'cap': 8745,
    'cup': 8746,
    'int': 8747,
    'there4': 8756,
    'sim': 8764,
    'cong': 8773,
    'asymp': 8776,
    'ne': 8800,
    'equiv': 8801,
    'le': 8804,
    'ge': 8805,
    'sub': 8834,
    'sup': 8835,
    'nsub': 8836,
    'sube': 8838,
    'supe': 8839,
    'oplus': 8853,
    'otimes': 8855,
    'perp': 8869,
    'sdot': 8901,
    'lceil': 8968,
    'rceil': 8969,
    'lfloor': 8970,
    'rfloor': 8971,
    'lang': 9001,
    'rang': 9002,
    'loz': 9674,
    'spades': 9824,
    'clubs': 9827,
    'hearts': 9829,
    'diams': 9830
  }

  Object.keys(sax.ENTITIES).forEach(function (key) {
    var e = sax.ENTITIES[key]
    var s = typeof e === 'number' ? String.fromCharCode(e) : e
    sax.ENTITIES[key] = s
  })

  for (var s in sax.STATE) {
    sax.STATE[sax.STATE[s]] = s
  }

  // shorthand
  S = sax.STATE

  function emit (parser, event, data) {
    parser[event] && parser[event](data)
  }

  function emitNode (parser, nodeType, data) {
    if (parser.textNode) closeText(parser)
    emit(parser, nodeType, data)
  }

  function closeText (parser) {
    parser.textNode = textopts(parser.opt, parser.textNode)
    if (parser.textNode) emit(parser, 'ontext', parser.textNode)
    parser.textNode = ''
  }

  function textopts (opt, text) {
    if (opt.trim) text = text.trim()
    if (opt.normalize) text = text.replace(/\s+/g, ' ')
    return text
  }

  function error (parser, er) {
    closeText(parser)
    if (parser.trackPosition) {
      er += '\nLine: ' + parser.line +
        '\nColumn: ' + parser.column +
        '\nChar: ' + parser.c
    }
    er = new Error(er)
    parser.error = er
    emit(parser, 'onerror', er)
    return parser
  }

  function end (parser) {
    if (parser.sawRoot && !parser.closedRoot) strictFail(parser, 'Unclosed root tag')
    if ((parser.state !== S.BEGIN) &&
      (parser.state !== S.BEGIN_WHITESPACE) &&
      (parser.state !== S.TEXT)) {
      error(parser, 'Unexpected end')
    }
    closeText(parser)
    parser.c = ''
    parser.closed = true
    emit(parser, 'onend')
    SAXParser.call(parser, parser.strict, parser.opt)
    return parser
  }

  function strictFail (parser, message) {
    if (typeof parser !== 'object' || !(parser instanceof SAXParser)) {
      throw new Error('bad call to strictFail')
    }
    if (parser.strict) {
      error(parser, message)
    }
  }

  function newTag (parser) {
    if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]()
    var parent = parser.tags[parser.tags.length - 1] || parser
    var tag = parser.tag = { name: parser.tagName, attributes: {} }

    // will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
    if (parser.opt.xmlns) {
      tag.ns = parent.ns
    }
    parser.attribList.length = 0
    emitNode(parser, 'onopentagstart', tag)
  }

  function qname (name, attribute) {
    var i = name.indexOf(':')
    var qualName = i < 0 ? [ '', name ] : name.split(':')
    var prefix = qualName[0]
    var local = qualName[1]

    // <x "xmlns"="http://foo">
    if (attribute && name === 'xmlns') {
      prefix = 'xmlns'
      local = ''
    }

    return { prefix: prefix, local: local }
  }

  function attrib (parser) {
    if (!parser.strict) {
      parser.attribName = parser.attribName[parser.looseCase]()
    }

    if (parser.attribList.indexOf(parser.attribName) !== -1 ||
      parser.tag.attributes.hasOwnProperty(parser.attribName)) {
      parser.attribName = parser.attribValue = ''
      return
    }

    if (parser.opt.xmlns) {
      var qn = qname(parser.attribName, true)
      var prefix = qn.prefix
      var local = qn.local

      if (prefix === 'xmlns') {
        // namespace binding attribute. push the binding into scope
        if (local === 'xml' && parser.attribValue !== XML_NAMESPACE) {
          strictFail(parser,
            'xml: prefix must be bound to ' + XML_NAMESPACE + '\n' +
            'Actual: ' + parser.attribValue)
        } else if (local === 'xmlns' && parser.attribValue !== XMLNS_NAMESPACE) {
          strictFail(parser,
            'xmlns: prefix must be bound to ' + XMLNS_NAMESPACE + '\n' +
            'Actual: ' + parser.attribValue)
        } else {
          var tag = parser.tag
          var parent = parser.tags[parser.tags.length - 1] || parser
          if (tag.ns === parent.ns) {
            tag.ns = Object.create(parent.ns)
          }
          tag.ns[local] = parser.attribValue
        }
      }

      // defer onattribute events until all attributes have been seen
      // so any new bindings can take effect. preserve attribute order
      // so deferred events can be emitted in document order
      parser.attribList.push([parser.attribName, parser.attribValue])
    } else {
      // in non-xmlns mode, we can emit the event right away
      parser.tag.attributes[parser.attribName] = parser.attribValue
      emitNode(parser, 'onattribute', {
        name: parser.attribName,
        value: parser.attribValue
      })
    }

    parser.attribName = parser.attribValue = ''
  }

  function openTag (parser, selfClosing) {
    if (parser.opt.xmlns) {
      // emit namespace binding events
      var tag = parser.tag

      // add namespace info to tag
      var qn = qname(parser.tagName)
      tag.prefix = qn.prefix
      tag.local = qn.local
      tag.uri = tag.ns[qn.prefix] || ''

      if (tag.prefix && !tag.uri) {
        strictFail(parser, 'Unbound namespace prefix: ' +
          JSON.stringify(parser.tagName))
        tag.uri = qn.prefix
      }

      var parent = parser.tags[parser.tags.length - 1] || parser
      if (tag.ns && parent.ns !== tag.ns) {
        Object.keys(tag.ns).forEach(function (p) {
          emitNode(parser, 'onopennamespace', {
            prefix: p,
            uri: tag.ns[p]
          })
        })
      }

      // handle deferred onattribute events
      // Note: do not apply default ns to attributes:
      //   http://www.w3.org/TR/REC-xml-names/#defaulting
      for (var i = 0, l = parser.attribList.length; i < l; i++) {
        var nv = parser.attribList[i]
        var name = nv[0]
        var value = nv[1]
        var qualName = qname(name, true)
        var prefix = qualName.prefix
        var local = qualName.local
        var uri = prefix === '' ? '' : (tag.ns[prefix] || '')
        var a = {
          name: name,
          value: value,
          prefix: prefix,
          local: local,
          uri: uri
        }

        // if there's any attributes with an undefined namespace,
        // then fail on them now.
        if (prefix && prefix !== 'xmlns' && !uri) {
          strictFail(parser, 'Unbound namespace prefix: ' +
            JSON.stringify(prefix))
          a.uri = prefix
        }
        parser.tag.attributes[name] = a
        emitNode(parser, 'onattribute', a)
      }
      parser.attribList.length = 0
    }

    parser.tag.isSelfClosing = !!selfClosing

    // process the tag
    parser.sawRoot = true
    parser.tags.push(parser.tag)
    emitNode(parser, 'onopentag', parser.tag)
    if (!selfClosing) {
      // special case for <script> in non-strict mode.
      if (!parser.noscript && parser.tagName.toLowerCase() === 'script') {
        parser.state = S.SCRIPT
      } else {
        parser.state = S.TEXT
      }
      parser.tag = null
      parser.tagName = ''
    }
    parser.attribName = parser.attribValue = ''
    parser.attribList.length = 0
  }

  function closeTag (parser) {
    if (!parser.tagName) {
      strictFail(parser, 'Weird empty close tag.')
      parser.textNode += '</>'
      parser.state = S.TEXT
      return
    }

    if (parser.script) {
      if (parser.tagName !== 'script') {
        parser.script += '</' + parser.tagName + '>'
        parser.tagName = ''
        parser.state = S.SCRIPT
        return
      }
      emitNode(parser, 'onscript', parser.script)
      parser.script = ''
    }

    // first make sure that the closing tag actually exists.
    // <a><b></c></b></a> will close everything, otherwise.
    var t = parser.tags.length
    var tagName = parser.tagName
    if (!parser.strict) {
      tagName = tagName[parser.looseCase]()
    }
    var closeTo = tagName
    while (t--) {
      var close = parser.tags[t]
      if (close.name !== closeTo) {
        // fail the first time in strict mode
        strictFail(parser, 'Unexpected close tag')
      } else {
        break
      }
    }

    // didn't find it.  we already failed for strict, so just abort.
    if (t < 0) {
      strictFail(parser, 'Unmatched closing tag: ' + parser.tagName)
      parser.textNode += '</' + parser.tagName + '>'
      parser.state = S.TEXT
      return
    }
    parser.tagName = tagName
    var s = parser.tags.length
    while (s-- > t) {
      var tag = parser.tag = parser.tags.pop()
      parser.tagName = parser.tag.name
      emitNode(parser, 'onclosetag', parser.tagName)

      var x = {}
      for (var i in tag.ns) {
        x[i] = tag.ns[i]
      }

      var parent = parser.tags[parser.tags.length - 1] || parser
      if (parser.opt.xmlns && tag.ns !== parent.ns) {
        // remove namespace bindings introduced by tag
        Object.keys(tag.ns).forEach(function (p) {
          var n = tag.ns[p]
          emitNode(parser, 'onclosenamespace', { prefix: p, uri: n })
        })
      }
    }
    if (t === 0) parser.closedRoot = true
    parser.tagName = parser.attribValue = parser.attribName = ''
    parser.attribList.length = 0
    parser.state = S.TEXT
  }

  function parseEntity (parser) {
    var entity = parser.entity
    var entityLC = entity.toLowerCase()
    var num
    var numStr = ''

    if (parser.ENTITIES[entity]) {
      return parser.ENTITIES[entity]
    }
    if (parser.ENTITIES[entityLC]) {
      return parser.ENTITIES[entityLC]
    }
    entity = entityLC
    if (entity.charAt(0) === '#') {
      if (entity.charAt(1) === 'x') {
        entity = entity.slice(2)
        num = parseInt(entity, 16)
        numStr = num.toString(16)
      } else {
        entity = entity.slice(1)
        num = parseInt(entity, 10)
        numStr = num.toString(10)
      }
    }
    entity = entity.replace(/^0+/, '')
    if (isNaN(num) || numStr.toLowerCase() !== entity) {
      strictFail(parser, 'Invalid character entity')
      return '&' + parser.entity + ';'
    }

    return String.fromCodePoint(num)
  }

  function beginWhiteSpace (parser, c) {
    if (c === '<') {
      parser.state = S.OPEN_WAKA
      parser.startTagPosition = parser.position
    } else if (!isWhitespace(c)) {
      // have to process this as a text node.
      // weird, but happens.
      strictFail(parser, 'Non-whitespace before first tag.')
      parser.textNode = c
      parser.state = S.TEXT
    }
  }

  function charAt (chunk, i) {
    var result = ''
    if (i < chunk.length) {
      result = chunk.charAt(i)
    }
    return result
  }

  function write (chunk) {
    var parser = this
    if (this.error) {
      throw this.error
    }
    if (parser.closed) {
      return error(parser,
        'Cannot write after close. Assign an onready handler.')
    }
    if (chunk === null) {
      return end(parser)
    }
    if (typeof chunk === 'object') {
      chunk = chunk.toString()
    }
    var i = 0
    var c = ''
    while (true) {
      c = charAt(chunk, i++)
      parser.c = c

      if (!c) {
        break
      }

      if (parser.trackPosition) {
        parser.position++
        if (c === '\n') {
          parser.line++
          parser.column = 0
        } else {
          parser.column++
        }
      }

      switch (parser.state) {
        case S.BEGIN:
          parser.state = S.BEGIN_WHITESPACE
          if (c === '\uFEFF') {
            continue
          }
          beginWhiteSpace(parser, c)
          continue

        case S.BEGIN_WHITESPACE:
          beginWhiteSpace(parser, c)
          continue

        case S.TEXT:
          if (parser.sawRoot && !parser.closedRoot) {
            var starti = i - 1
            while (c && c !== '<' && c !== '&') {
              c = charAt(chunk, i++)
              if (c && parser.trackPosition) {
                parser.position++
                if (c === '\n') {
                  parser.line++
                  parser.column = 0
                } else {
                  parser.column++
                }
              }
            }
            parser.textNode += chunk.substring(starti, i - 1)
          }
          if (c === '<' && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
            parser.state = S.OPEN_WAKA
            parser.startTagPosition = parser.position
          } else {
            if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
              strictFail(parser, 'Text data outside of root node.')
            }
            if (c === '&') {
              parser.state = S.TEXT_ENTITY
            } else {
              parser.textNode += c
            }
          }
          continue

        case S.SCRIPT:
          // only non-strict
          if (c === '<') {
            parser.state = S.SCRIPT_ENDING
          } else {
            parser.script += c
          }
          continue

        case S.SCRIPT_ENDING:
          if (c === '/') {
            parser.state = S.CLOSE_TAG
          } else {
            parser.script += '<' + c
            parser.state = S.SCRIPT
          }
          continue

        case S.OPEN_WAKA:
          // either a /, ?, !, or text is coming next.
          if (c === '!') {
            parser.state = S.SGML_DECL
            parser.sgmlDecl = ''
          } else if (isWhitespace(c)) {
            // wait for it...
          } else if (isMatch(nameStart, c)) {
            parser.state = S.OPEN_TAG
            parser.tagName = c
          } else if (c === '/') {
            parser.state = S.CLOSE_TAG
            parser.tagName = ''
          } else if (c === '?') {
            parser.state = S.PROC_INST
            parser.procInstName = parser.procInstBody = ''
          } else {
            strictFail(parser, 'Unencoded <')
            // if there was some whitespace, then add that in.
            if (parser.startTagPosition + 1 < parser.position) {
              var pad = parser.position - parser.startTagPosition
              c = new Array(pad).join(' ') + c
            }
            parser.textNode += '<' + c
            parser.state = S.TEXT
          }
          continue

        case S.SGML_DECL:
          if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
            emitNode(parser, 'onopencdata')
            parser.state = S.CDATA
            parser.sgmlDecl = ''
            parser.cdata = ''
          } else if (parser.sgmlDecl + c === '--') {
            parser.state = S.COMMENT
            parser.comment = ''
            parser.sgmlDecl = ''
          } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
            parser.state = S.DOCTYPE
            if (parser.doctype || parser.sawRoot) {
              strictFail(parser,
                'Inappropriately located doctype declaration')
            }
            parser.doctype = ''
            parser.sgmlDecl = ''
          } else if (c === '>') {
            emitNode(parser, 'onsgmldeclaration', parser.sgmlDecl)
            parser.sgmlDecl = ''
            parser.state = S.TEXT
          } else if (isQuote(c)) {
            parser.state = S.SGML_DECL_QUOTED
            parser.sgmlDecl += c
          } else {
            parser.sgmlDecl += c
          }
          continue

        case S.SGML_DECL_QUOTED:
          if (c === parser.q) {
            parser.state = S.SGML_DECL
            parser.q = ''
          }
          parser.sgmlDecl += c
          continue

        case S.DOCTYPE:
          if (c === '>') {
            parser.state = S.TEXT
            emitNode(parser, 'ondoctype', parser.doctype)
            parser.doctype = true // just remember that we saw it.
          } else {
            parser.doctype += c
            if (c === '[') {
              parser.state = S.DOCTYPE_DTD
            } else if (isQuote(c)) {
              parser.state = S.DOCTYPE_QUOTED
              parser.q = c
            }
          }
          continue

        case S.DOCTYPE_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.q = ''
            parser.state = S.DOCTYPE
          }
          continue

        case S.DOCTYPE_DTD:
          parser.doctype += c
          if (c === ']') {
            parser.state = S.DOCTYPE
          } else if (isQuote(c)) {
            parser.state = S.DOCTYPE_DTD_QUOTED
            parser.q = c
          }
          continue

        case S.DOCTYPE_DTD_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.state = S.DOCTYPE_DTD
            parser.q = ''
          }
          continue

        case S.COMMENT:
          if (c === '-') {
            parser.state = S.COMMENT_ENDING
          } else {
            parser.comment += c
          }
          continue

        case S.COMMENT_ENDING:
          if (c === '-') {
            parser.state = S.COMMENT_ENDED
            parser.comment = textopts(parser.opt, parser.comment)
            if (parser.comment) {
              emitNode(parser, 'oncomment', parser.comment)
            }
            parser.comment = ''
          } else {
            parser.comment += '-' + c
            parser.state = S.COMMENT
          }
          continue

        case S.COMMENT_ENDED:
          if (c !== '>') {
            strictFail(parser, 'Malformed comment')
            // allow <!-- blah -- bloo --> in non-strict mode,
            // which is a comment of " blah -- bloo "
            parser.comment += '--' + c
            parser.state = S.COMMENT
          } else {
            parser.state = S.TEXT
          }
          continue

        case S.CDATA:
          if (c === ']') {
            parser.state = S.CDATA_ENDING
          } else {
            parser.cdata += c
          }
          continue

        case S.CDATA_ENDING:
          if (c === ']') {
            parser.state = S.CDATA_ENDING_2
          } else {
            parser.cdata += ']' + c
            parser.state = S.CDATA
          }
          continue

        case S.CDATA_ENDING_2:
          if (c === '>') {
            if (parser.cdata) {
              emitNode(parser, 'oncdata', parser.cdata)
            }
            emitNode(parser, 'onclosecdata')
            parser.cdata = ''
            parser.state = S.TEXT
          } else if (c === ']') {
            parser.cdata += ']'
          } else {
            parser.cdata += ']]' + c
            parser.state = S.CDATA
          }
          continue

        case S.PROC_INST:
          if (c === '?') {
            parser.state = S.PROC_INST_ENDING
          } else if (isWhitespace(c)) {
            parser.state = S.PROC_INST_BODY
          } else {
            parser.procInstName += c
          }
          continue

        case S.PROC_INST_BODY:
          if (!parser.procInstBody && isWhitespace(c)) {
            continue
          } else if (c === '?') {
            parser.state = S.PROC_INST_ENDING
          } else {
            parser.procInstBody += c
          }
          continue

        case S.PROC_INST_ENDING:
          if (c === '>') {
            emitNode(parser, 'onprocessinginstruction', {
              name: parser.procInstName,
              body: parser.procInstBody
            })
            parser.procInstName = parser.procInstBody = ''
            parser.state = S.TEXT
          } else {
            parser.procInstBody += '?' + c
            parser.state = S.PROC_INST_BODY
          }
          continue

        case S.OPEN_TAG:
          if (isMatch(nameBody, c)) {
            parser.tagName += c
          } else {
            newTag(parser)
            if (c === '>') {
              openTag(parser)
            } else if (c === '/') {
              parser.state = S.OPEN_TAG_SLASH
            } else {
              if (!isWhitespace(c)) {
                strictFail(parser, 'Invalid character in tag name')
              }
              parser.state = S.ATTRIB
            }
          }
          continue

        case S.OPEN_TAG_SLASH:
          if (c === '>') {
            openTag(parser, true)
            closeTag(parser)
          } else {
            strictFail(parser, 'Forward-slash in opening tag not followed by >')
            parser.state = S.ATTRIB
          }
          continue

        case S.ATTRIB:
          // haven't read the attribute name yet.
          if (isWhitespace(c)) {
            continue
          } else if (c === '>') {
            openTag(parser)
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH
          } else if (isMatch(nameStart, c)) {
            parser.attribName = c
            parser.attribValue = ''
            parser.state = S.ATTRIB_NAME
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_NAME:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE
          } else if (c === '>') {
            strictFail(parser, 'Attribute without value')
            parser.attribValue = parser.attribName
            attrib(parser)
            openTag(parser)
          } else if (isWhitespace(c)) {
            parser.state = S.ATTRIB_NAME_SAW_WHITE
          } else if (isMatch(nameBody, c)) {
            parser.attribName += c
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_NAME_SAW_WHITE:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE
          } else if (isWhitespace(c)) {
            continue
          } else {
            strictFail(parser, 'Attribute without value')
            parser.tag.attributes[parser.attribName] = ''
            parser.attribValue = ''
            emitNode(parser, 'onattribute', {
              name: parser.attribName,
              value: ''
            })
            parser.attribName = ''
            if (c === '>') {
              openTag(parser)
            } else if (isMatch(nameStart, c)) {
              parser.attribName = c
              parser.state = S.ATTRIB_NAME
            } else {
              strictFail(parser, 'Invalid attribute name')
              parser.state = S.ATTRIB
            }
          }
          continue

        case S.ATTRIB_VALUE:
          if (isWhitespace(c)) {
            continue
          } else if (isQuote(c)) {
            parser.q = c
            parser.state = S.ATTRIB_VALUE_QUOTED
          } else {
            strictFail(parser, 'Unquoted attribute value')
            parser.state = S.ATTRIB_VALUE_UNQUOTED
            parser.attribValue = c
          }
          continue

        case S.ATTRIB_VALUE_QUOTED:
          if (c !== parser.q) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_Q
            } else {
              parser.attribValue += c
            }
            continue
          }
          attrib(parser)
          parser.q = ''
          parser.state = S.ATTRIB_VALUE_CLOSED
          continue

        case S.ATTRIB_VALUE_CLOSED:
          if (isWhitespace(c)) {
            parser.state = S.ATTRIB
          } else if (c === '>') {
            openTag(parser)
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH
          } else if (isMatch(nameStart, c)) {
            strictFail(parser, 'No whitespace between attributes')
            parser.attribName = c
            parser.attribValue = ''
            parser.state = S.ATTRIB_NAME
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_VALUE_UNQUOTED:
          if (!isAttribEnd(c)) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_U
            } else {
              parser.attribValue += c
            }
            continue
          }
          attrib(parser)
          if (c === '>') {
            openTag(parser)
          } else {
            parser.state = S.ATTRIB
          }
          continue

        case S.CLOSE_TAG:
          if (!parser.tagName) {
            if (isWhitespace(c)) {
              continue
            } else if (notMatch(nameStart, c)) {
              if (parser.script) {
                parser.script += '</' + c
                parser.state = S.SCRIPT
              } else {
                strictFail(parser, 'Invalid tagname in closing tag.')
              }
            } else {
              parser.tagName = c
            }
          } else if (c === '>') {
            closeTag(parser)
          } else if (isMatch(nameBody, c)) {
            parser.tagName += c
          } else if (parser.script) {
            parser.script += '</' + parser.tagName
            parser.tagName = ''
            parser.state = S.SCRIPT
          } else {
            if (!isWhitespace(c)) {
              strictFail(parser, 'Invalid tagname in closing tag')
            }
            parser.state = S.CLOSE_TAG_SAW_WHITE
          }
          continue

        case S.CLOSE_TAG_SAW_WHITE:
          if (isWhitespace(c)) {
            continue
          }
          if (c === '>') {
            closeTag(parser)
          } else {
            strictFail(parser, 'Invalid characters in closing tag')
          }
          continue

        case S.TEXT_ENTITY:
        case S.ATTRIB_VALUE_ENTITY_Q:
        case S.ATTRIB_VALUE_ENTITY_U:
          var returnState
          var buffer
          switch (parser.state) {
            case S.TEXT_ENTITY:
              returnState = S.TEXT
              buffer = 'textNode'
              break

            case S.ATTRIB_VALUE_ENTITY_Q:
              returnState = S.ATTRIB_VALUE_QUOTED
              buffer = 'attribValue'
              break

            case S.ATTRIB_VALUE_ENTITY_U:
              returnState = S.ATTRIB_VALUE_UNQUOTED
              buffer = 'attribValue'
              break
          }

          if (c === ';') {
            parser[buffer] += parseEntity(parser)
            parser.entity = ''
            parser.state = returnState
          } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
            parser.entity += c
          } else {
            strictFail(parser, 'Invalid character in entity name')
            parser[buffer] += '&' + parser.entity + c
            parser.entity = ''
            parser.state = returnState
          }

          continue

        default:
          throw new Error(parser, 'Unknown state: ' + parser.state)
      }
    } // while

    if (parser.position >= parser.bufferCheckPosition) {
      checkBufferLength(parser)
    }
    return parser
  }

  /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
  /* istanbul ignore next */
  if (!String.fromCodePoint) {
    (function () {
      var stringFromCharCode = String.fromCharCode
      var floor = Math.floor
      var fromCodePoint = function () {
        var MAX_SIZE = 0x4000
        var codeUnits = []
        var highSurrogate
        var lowSurrogate
        var index = -1
        var length = arguments.length
        if (!length) {
          return ''
        }
        var result = ''
        while (++index < length) {
          var codePoint = Number(arguments[index])
          if (
            !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
            codePoint < 0 || // not a valid Unicode code point
            codePoint > 0x10FFFF || // not a valid Unicode code point
            floor(codePoint) !== codePoint // not an integer
          ) {
            throw RangeError('Invalid code point: ' + codePoint)
          }
          if (codePoint <= 0xFFFF) { // BMP code point
            codeUnits.push(codePoint)
          } else { // Astral code point; split in surrogate halves
            // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000
            highSurrogate = (codePoint >> 10) + 0xD800
            lowSurrogate = (codePoint % 0x400) + 0xDC00
            codeUnits.push(highSurrogate, lowSurrogate)
          }
          if (index + 1 === length || codeUnits.length > MAX_SIZE) {
            result += stringFromCharCode.apply(null, codeUnits)
            codeUnits.length = 0
          }
        }
        return result
      }
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(String, 'fromCodePoint', {
          value: fromCodePoint,
          configurable: true,
          writable: true
        })
      } else {
        String.fromCodePoint = fromCodePoint
      }
    }())
  }
})( false ? undefined : exports)


/***/ }),

/***/ "./node_modules/vscode-extension-telemetry/lib sync recursive ^.*\\/lib\\/Connection$":
/*!********************************************************************************!*\
  !*** ./node_modules/vscode-extension-telemetry/lib sync ^.*\/lib\/Connection$ ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/vscode-extension-telemetry/lib sync recursive ^.*\\/lib\\/Connection$";

/***/ }),

/***/ "./node_modules/vscode-extension-telemetry/lib sync recursive ^.*\\/lib\\/Pool$":
/*!**************************************************************************!*\
  !*** ./node_modules/vscode-extension-telemetry/lib sync ^.*\/lib\/Pool$ ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/vscode-extension-telemetry/lib sync recursive ^.*\\/lib\\/Pool$";

/***/ }),

/***/ "./node_modules/vscode-extension-telemetry/lib/telemetryReporter.node.min.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/vscode-extension-telemetry/lib/telemetryReporter.node.min.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var oS=Object.create;var Si=Object.defineProperty;var uS=Object.getOwnPropertyDescriptor;var cS=Object.getOwnPropertyNames,pf=Object.getOwnPropertySymbols,lS=Object.getPrototypeOf,ff=Object.prototype.hasOwnProperty,pS=Object.prototype.propertyIsEnumerable;var df=(e,t,r)=>t in e?Si(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,It=(e,t)=>{for(var r in t||(t={}))ff.call(t,r)&&df(e,r,t[r]);if(pf)for(var r of pf(t))pS.call(t,r)&&df(e,r,t[r]);return e};var hf=e=>Si(e,"__esModule",{value:!0});var l=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),fS=(e,t)=>{hf(e);for(var r in t)Si(e,r,{get:t[r],enumerable:!0})},dS=(e,t,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of cS(t))!ff.call(e,n)&&n!=="default"&&Si(e,n,{get:()=>t[n],enumerable:!(r=uS(t,n))||r.enumerable});return e},Ai=e=>dS(hf(Si(e!=null?oS(lS(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var ve=l((Kx,_f)=>{"use strict";var hS=function(){function e(){}return e.info=function(t){for(var r=[],n=1;n<arguments.length;n++)r[n-1]=arguments[n];e.enableDebug&&console.info(e.TAG+t,r)},e.warn=function(t){for(var r=[],n=1;n<arguments.length;n++)r[n-1]=arguments[n];e.disableWarnings||console.warn(e.TAG+t,r)},e.enableDebug=!1,e.disableWarnings=!1,e.disableErrors=!1,e.TAG="ApplicationInsights:",e}();_f.exports=hS});var Eu=l(Ft=>{"use strict";var an=Ft&&Ft.__assign||function(){return an=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},an.apply(this,arguments)};Object.defineProperty(Ft,"__esModule",{value:!0});Ft.AsyncScopeManager=Ft.OpenTelemetryScopeManagerWrapper=void 0;var vr=gr(),_S=__webpack_require__(/*! events */ "events"),vf=function(){function e(){}return e.prototype.active=function(){var t=this,r=vr.CorrelationContextManager.getCurrentContext();return an(an({},r),{getValue:function(n){return t._activeSymbol?n===t._activeSymbol?r:!1:(t._activeSymbol=n,r)},setValue:function(){}})},e.prototype.with=function(t,r){var n=t.parentSpanId,i=t.name,a=e._spanToContext(t,n,i);return vr.CorrelationContextManager.runWithContext(a,r)()},e.prototype.bind=function(t){return typeof t=="function"?vr.CorrelationContextManager.wrapCallback(t):(t instanceof _S.EventEmitter&&vr.CorrelationContextManager.wrapEmitter(t),t)},e.prototype.enable=function(){return vr.CorrelationContextManager.enable(),this},e.prototype.disable=function(){return vr.CorrelationContextManager.disable(),this},e._spanToContext=function(t,r,n){var i=r?"|"+t.spanContext().traceId+"."+r+".":t.spanContext().traceId,a=an(an({},t.spanContext()),{traceFlags:t.spanContext().traceFlags}),s=vr.CorrelationContextManager.spanToContextObject(a,i,n);return s},e}();Ft.OpenTelemetryScopeManagerWrapper=vf;Ft.AsyncScopeManager=new vf});var xf=l((I,wf)=>{I=wf.exports=N;var k;typeof process=="object"&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?k=function(){var e=Array.prototype.slice.call(arguments,0);e.unshift("SEMVER"),console.log.apply(console,e)}:k=function(){};I.SEMVER_SPEC_VERSION="2.0.0";var mu=256,Ma=Number.MAX_SAFE_INTEGER||9007199254740991,yu=16,B=I.re=[],_=I.src=[],O=0,sn=O++;_[sn]="0|[1-9]\\d*";var on=O++;_[on]="[0-9]+";var Tu=O++;_[Tu]="\\d*[a-zA-Z-][a-zA-Z0-9-]*";var gf=O++;_[gf]="("+_[sn]+")\\.("+_[sn]+")\\.("+_[sn]+")";var Ef=O++;_[Ef]="("+_[on]+")\\.("+_[on]+")\\.("+_[on]+")";var Su=O++;_[Su]="(?:"+_[sn]+"|"+_[Tu]+")";var Au=O++;_[Au]="(?:"+_[on]+"|"+_[Tu]+")";var Iu=O++;_[Iu]="(?:-("+_[Su]+"(?:\\."+_[Su]+")*))";var bu=O++;_[bu]="(?:-?("+_[Au]+"(?:\\."+_[Au]+")*))";var Cu=O++;_[Cu]="[0-9A-Za-z-]+";var bi=O++;_[bi]="(?:\\+("+_[Cu]+"(?:\\."+_[Cu]+")*))";var Ou=O++,mf="v?"+_[gf]+_[Iu]+"?"+_[bi]+"?";_[Ou]="^"+mf+"$";var Pu="[v=\\s]*"+_[Ef]+_[bu]+"?"+_[bi]+"?",Ru=O++;_[Ru]="^"+Pu+"$";var un=O++;_[un]="((?:<|>)?=?)";var La=O++;_[La]=_[on]+"|x|X|\\*";var qa=O++;_[qa]=_[sn]+"|x|X|\\*";var Er=O++;_[Er]="[v=\\s]*("+_[qa]+")(?:\\.("+_[qa]+")(?:\\.("+_[qa]+")(?:"+_[Iu]+")?"+_[bi]+"?)?)?";var cn=O++;_[cn]="[v=\\s]*("+_[La]+")(?:\\.("+_[La]+")(?:\\.("+_[La]+")(?:"+_[bu]+")?"+_[bi]+"?)?)?";var yf=O++;_[yf]="^"+_[un]+"\\s*"+_[Er]+"$";var Tf=O++;_[Tf]="^"+_[un]+"\\s*"+_[cn]+"$";var Sf=O++;_[Sf]="(?:^|[^\\d])(\\d{1,"+yu+"})(?:\\.(\\d{1,"+yu+"}))?(?:\\.(\\d{1,"+yu+"}))?(?:$|[^\\d])";var ja=O++;_[ja]="(?:~>?)";var ka=O++;_[ka]="(\\s*)"+_[ja]+"\\s+";B[ka]=new RegExp(_[ka],"g");var vS="$1~",Af=O++;_[Af]="^"+_[ja]+_[Er]+"$";var If=O++;_[If]="^"+_[ja]+_[cn]+"$";var Ha=O++;_[Ha]="(?:\\^)";var Ua=O++;_[Ua]="(\\s*)"+_[Ha]+"\\s+";B[Ua]=new RegExp(_[Ua],"g");var gS="$1^",bf=O++;_[bf]="^"+_[Ha]+_[Er]+"$";var Cf=O++;_[Cf]="^"+_[Ha]+_[cn]+"$";var Nu=O++;_[Nu]="^"+_[un]+"\\s*("+Pu+")$|^$";var Du=O++;_[Du]="^"+_[un]+"\\s*("+mf+")$|^$";var Ci=O++;_[Ci]="(\\s*)"+_[un]+"\\s*("+Pu+"|"+_[Er]+")";B[Ci]=new RegExp(_[Ci],"g");var ES="$1$2$3",Of=O++;_[Of]="^\\s*("+_[Er]+")\\s+-\\s+("+_[Er]+")\\s*$";var Pf=O++;_[Pf]="^\\s*("+_[cn]+")\\s+-\\s+("+_[cn]+")\\s*$";var Rf=O++;_[Rf]="(<|>)?=?\\s*\\*";for(Vt=0;Vt<O;Vt++)k(Vt,_[Vt]),B[Vt]||(B[Vt]=new RegExp(_[Vt]));var Vt;I.parse=mr;function mr(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof N)return e;if(typeof e!="string"||e.length>mu)return null;var r=t.loose?B[Ru]:B[Ou];if(!r.test(e))return null;try{return new N(e,t)}catch(n){return null}}I.valid=mS;function mS(e,t){var r=mr(e,t);return r?r.version:null}I.clean=yS;function yS(e,t){var r=mr(e.trim().replace(/^[=v]+/,""),t);return r?r.version:null}I.SemVer=N;function N(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof N){if(e.loose===t.loose)return e;e=e.version}else if(typeof e!="string")throw new TypeError("Invalid Version: "+e);if(e.length>mu)throw new TypeError("version is longer than "+mu+" characters");if(!(this instanceof N))return new N(e,t);k("SemVer",e,t),this.options=t,this.loose=!!t.loose;var r=e.trim().match(t.loose?B[Ru]:B[Ou]);if(!r)throw new TypeError("Invalid Version: "+e);if(this.raw=e,this.major=+r[1],this.minor=+r[2],this.patch=+r[3],this.major>Ma||this.major<0)throw new TypeError("Invalid major version");if(this.minor>Ma||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>Ma||this.patch<0)throw new TypeError("Invalid patch version");r[4]?this.prerelease=r[4].split(".").map(function(n){if(/^[0-9]+$/.test(n)){var i=+n;if(i>=0&&i<Ma)return i}return n}):this.prerelease=[],this.build=r[5]?r[5].split("."):[],this.format()}N.prototype.format=function(){return this.version=this.major+"."+this.minor+"."+this.patch,this.prerelease.length&&(this.version+="-"+this.prerelease.join(".")),this.version};N.prototype.toString=function(){return this.version};N.prototype.compare=function(e){return k("SemVer.compare",this.version,this.options,e),e instanceof N||(e=new N(e,this.options)),this.compareMain(e)||this.comparePre(e)};N.prototype.compareMain=function(e){return e instanceof N||(e=new N(e,this.options)),ln(this.major,e.major)||ln(this.minor,e.minor)||ln(this.patch,e.patch)};N.prototype.comparePre=function(e){if(e instanceof N||(e=new N(e,this.options)),this.prerelease.length&&!e.prerelease.length)return-1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;var t=0;do{var r=this.prerelease[t],n=e.prerelease[t];if(k("prerelease compare",t,r,n),r===void 0&&n===void 0)return 0;if(n===void 0)return 1;if(r===void 0)return-1;if(r===n)continue;return ln(r,n)}while(++t)};N.prototype.inc=function(e,t){switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",t);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",t);break;case"prepatch":this.prerelease.length=0,this.inc("patch",t),this.inc("pre",t);break;case"prerelease":this.prerelease.length===0&&this.inc("patch",t),this.inc("pre",t);break;case"major":(this.minor!==0||this.patch!==0||this.prerelease.length===0)&&this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":(this.patch!==0||this.prerelease.length===0)&&this.minor++,this.patch=0,this.prerelease=[];break;case"patch":this.prerelease.length===0&&this.patch++,this.prerelease=[];break;case"pre":if(this.prerelease.length===0)this.prerelease=[0];else{for(var r=this.prerelease.length;--r>=0;)typeof this.prerelease[r]=="number"&&(this.prerelease[r]++,r=-2);r===-1&&this.prerelease.push(0)}t&&(this.prerelease[0]===t?isNaN(this.prerelease[1])&&(this.prerelease=[t,0]):this.prerelease=[t,0]);break;default:throw new Error("invalid increment argument: "+e)}return this.format(),this.raw=this.version,this};I.inc=TS;function TS(e,t,r,n){typeof r=="string"&&(n=r,r=void 0);try{return new N(e,r).inc(t,n).version}catch(i){return null}}I.diff=SS;function SS(e,t){if(wu(e,t))return null;var r=mr(e),n=mr(t),i="";if(r.prerelease.length||n.prerelease.length){i="pre";var a="prerelease"}for(var s in r)if((s==="major"||s==="minor"||s==="patch")&&r[s]!==n[s])return i+s;return a}I.compareIdentifiers=ln;var Nf=/^[0-9]+$/;function ln(e,t){var r=Nf.test(e),n=Nf.test(t);return r&&n&&(e=+e,t=+t),e===t?0:r&&!n?-1:n&&!r?1:e<t?-1:1}I.rcompareIdentifiers=AS;function AS(e,t){return ln(t,e)}I.major=IS;function IS(e,t){return new N(e,t).major}I.minor=bS;function bS(e,t){return new N(e,t).minor}I.patch=CS;function CS(e,t){return new N(e,t).patch}I.compare=bt;function bt(e,t,r){return new N(e,r).compare(new N(t,r))}I.compareLoose=OS;function OS(e,t){return bt(e,t,!0)}I.rcompare=PS;function PS(e,t,r){return bt(t,e,r)}I.sort=RS;function RS(e,t){return e.sort(function(r,n){return I.compare(r,n,t)})}I.rsort=NS;function NS(e,t){return e.sort(function(r,n){return I.rcompare(r,n,t)})}I.gt=Oi;function Oi(e,t,r){return bt(e,t,r)>0}I.lt=Ba;function Ba(e,t,r){return bt(e,t,r)<0}I.eq=wu;function wu(e,t,r){return bt(e,t,r)===0}I.neq=Df;function Df(e,t,r){return bt(e,t,r)!==0}I.gte=xu;function xu(e,t,r){return bt(e,t,r)>=0}I.lte=Mu;function Mu(e,t,r){return bt(e,t,r)<=0}I.cmp=Ga;function Ga(e,t,r,n){switch(t){case"===":return typeof e=="object"&&(e=e.version),typeof r=="object"&&(r=r.version),e===r;case"!==":return typeof e=="object"&&(e=e.version),typeof r=="object"&&(r=r.version),e!==r;case"":case"=":case"==":return wu(e,r,n);case"!=":return Df(e,r,n);case">":return Oi(e,r,n);case">=":return xu(e,r,n);case"<":return Ba(e,r,n);case"<=":return Mu(e,r,n);default:throw new TypeError("Invalid operator: "+t)}}I.Comparator=$e;function $e(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof $e){if(e.loose===!!t.loose)return e;e=e.value}if(!(this instanceof $e))return new $e(e,t);k("comparator",e,t),this.options=t,this.loose=!!t.loose,this.parse(e),this.semver===Pi?this.value="":this.value=this.operator+this.semver.version,k("comp",this)}var Pi={};$e.prototype.parse=function(e){var t=this.options.loose?B[Nu]:B[Du],r=e.match(t);if(!r)throw new TypeError("Invalid comparator: "+e);this.operator=r[1],this.operator==="="&&(this.operator=""),r[2]?this.semver=new N(r[2],this.options.loose):this.semver=Pi};$e.prototype.toString=function(){return this.value};$e.prototype.test=function(e){return k("Comparator.test",e,this.options.loose),this.semver===Pi?!0:(typeof e=="string"&&(e=new N(e,this.options)),Ga(e,this.operator,this.semver,this.options))};$e.prototype.intersects=function(e,t){if(!(e instanceof $e))throw new TypeError("a Comparator is required");(!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1});var r;if(this.operator==="")return r=new Z(e.value,t),Fa(this.value,r,t);if(e.operator==="")return r=new Z(this.value,t),Fa(e.semver,r,t);var n=(this.operator===">="||this.operator===">")&&(e.operator===">="||e.operator===">"),i=(this.operator==="<="||this.operator==="<")&&(e.operator==="<="||e.operator==="<"),a=this.semver.version===e.semver.version,s=(this.operator===">="||this.operator==="<=")&&(e.operator===">="||e.operator==="<="),o=Ga(this.semver,"<",e.semver,t)&&(this.operator===">="||this.operator===">")&&(e.operator==="<="||e.operator==="<"),u=Ga(this.semver,">",e.semver,t)&&(this.operator==="<="||this.operator==="<")&&(e.operator===">="||e.operator===">");return n||i||a&&s||o||u};I.Range=Z;function Z(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof Z)return e.loose===!!t.loose&&e.includePrerelease===!!t.includePrerelease?e:new Z(e.raw,t);if(e instanceof $e)return new Z(e.value,t);if(!(this instanceof Z))return new Z(e,t);if(this.options=t,this.loose=!!t.loose,this.includePrerelease=!!t.includePrerelease,this.raw=e,this.set=e.split(/\s*\|\|\s*/).map(function(r){return this.parseRange(r.trim())},this).filter(function(r){return r.length}),!this.set.length)throw new TypeError("Invalid SemVer Range: "+e);this.format()}Z.prototype.format=function(){return this.range=this.set.map(function(e){return e.join(" ").trim()}).join("||").trim(),this.range};Z.prototype.toString=function(){return this.range};Z.prototype.parseRange=function(e){var t=this.options.loose;e=e.trim();var r=t?B[Pf]:B[Of];e=e.replace(r,US),k("hyphen replace",e),e=e.replace(B[Ci],ES),k("comparator trim",e,B[Ci]),e=e.replace(B[ka],vS),e=e.replace(B[Ua],gS),e=e.split(/\s+/).join(" ");var n=t?B[Nu]:B[Du],i=e.split(" ").map(function(a){return wS(a,this.options)},this).join(" ").split(/\s+/);return this.options.loose&&(i=i.filter(function(a){return!!a.match(n)})),i=i.map(function(a){return new $e(a,this.options)},this),i};Z.prototype.intersects=function(e,t){if(!(e instanceof Z))throw new TypeError("a Range is required");return this.set.some(function(r){return r.every(function(n){return e.set.some(function(i){return i.every(function(a){return n.intersects(a,t)})})})})};I.toComparators=DS;function DS(e,t){return new Z(e,t).set.map(function(r){return r.map(function(n){return n.value}).join(" ").trim().split(" ")})}function wS(e,t){return k("comp",e,t),e=LS(e,t),k("caret",e),e=xS(e,t),k("tildes",e),e=jS(e,t),k("xrange",e),e=HS(e,t),k("stars",e),e}function Re(e){return!e||e.toLowerCase()==="x"||e==="*"}function xS(e,t){return e.trim().split(/\s+/).map(function(r){return MS(r,t)}).join(" ")}function MS(e,t){var r=t.loose?B[If]:B[Af];return e.replace(r,function(n,i,a,s,o){k("tilde",e,n,i,a,s,o);var u;return Re(i)?u="":Re(a)?u=">="+i+".0.0 <"+(+i+1)+".0.0":Re(s)?u=">="+i+"."+a+".0 <"+i+"."+(+a+1)+".0":o?(k("replaceTilde pr",o),u=">="+i+"."+a+"."+s+"-"+o+" <"+i+"."+(+a+1)+".0"):u=">="+i+"."+a+"."+s+" <"+i+"."+(+a+1)+".0",k("tilde return",u),u})}function LS(e,t){return e.trim().split(/\s+/).map(function(r){return qS(r,t)}).join(" ")}function qS(e,t){k("caret",e,t);var r=t.loose?B[Cf]:B[bf];return e.replace(r,function(n,i,a,s,o){k("caret",e,n,i,a,s,o);var u;return Re(i)?u="":Re(a)?u=">="+i+".0.0 <"+(+i+1)+".0.0":Re(s)?i==="0"?u=">="+i+"."+a+".0 <"+i+"."+(+a+1)+".0":u=">="+i+"."+a+".0 <"+(+i+1)+".0.0":o?(k("replaceCaret pr",o),i==="0"?a==="0"?u=">="+i+"."+a+"."+s+"-"+o+" <"+i+"."+a+"."+(+s+1):u=">="+i+"."+a+"."+s+"-"+o+" <"+i+"."+(+a+1)+".0":u=">="+i+"."+a+"."+s+"-"+o+" <"+(+i+1)+".0.0"):(k("no pr"),i==="0"?a==="0"?u=">="+i+"."+a+"."+s+" <"+i+"."+a+"."+(+s+1):u=">="+i+"."+a+"."+s+" <"+i+"."+(+a+1)+".0":u=">="+i+"."+a+"."+s+" <"+(+i+1)+".0.0"),k("caret return",u),u})}function jS(e,t){return k("replaceXRanges",e,t),e.split(/\s+/).map(function(r){return kS(r,t)}).join(" ")}function kS(e,t){e=e.trim();var r=t.loose?B[Tf]:B[yf];return e.replace(r,function(n,i,a,s,o,u){k("xRange",e,n,i,a,s,o,u);var c=Re(a),p=c||Re(s),f=p||Re(o),d=f;return i==="="&&d&&(i=""),c?i===">"||i==="<"?n="<0.0.0":n="*":i&&d?(p&&(s=0),o=0,i===">"?(i=">=",p?(a=+a+1,s=0,o=0):(s=+s+1,o=0)):i==="<="&&(i="<",p?a=+a+1:s=+s+1),n=i+a+"."+s+"."+o):p?n=">="+a+".0.0 <"+(+a+1)+".0.0":f&&(n=">="+a+"."+s+".0 <"+a+"."+(+s+1)+".0"),k("xRange return",n),n})}function HS(e,t){return k("replaceStars",e,t),e.trim().replace(B[Rf],"")}function US(e,t,r,n,i,a,s,o,u,c,p,f,d){return Re(r)?t="":Re(n)?t=">="+r+".0.0":Re(i)?t=">="+r+"."+n+".0":t=">="+t,Re(u)?o="":Re(c)?o="<"+(+u+1)+".0.0":Re(p)?o="<"+u+"."+(+c+1)+".0":f?o="<="+u+"."+c+"."+p+"-"+f:o="<="+o,(t+" "+o).trim()}Z.prototype.test=function(e){if(!e)return!1;typeof e=="string"&&(e=new N(e,this.options));for(var t=0;t<this.set.length;t++)if(BS(this.set[t],e,this.options))return!0;return!1};function BS(e,t,r){for(var n=0;n<e.length;n++)if(!e[n].test(t))return!1;if(t.prerelease.length&&!r.includePrerelease){for(n=0;n<e.length;n++)if(k(e[n].semver),e[n].semver!==Pi&&e[n].semver.prerelease.length>0){var i=e[n].semver;if(i.major===t.major&&i.minor===t.minor&&i.patch===t.patch)return!0}return!1}return!0}I.satisfies=Fa;function Fa(e,t,r){try{t=new Z(t,r)}catch(n){return!1}return t.test(e)}I.maxSatisfying=GS;function GS(e,t,r){var n=null,i=null;try{var a=new Z(t,r)}catch(s){return null}return e.forEach(function(s){a.test(s)&&(!n||i.compare(s)===-1)&&(n=s,i=new N(n,r))}),n}I.minSatisfying=FS;function FS(e,t,r){var n=null,i=null;try{var a=new Z(t,r)}catch(s){return null}return e.forEach(function(s){a.test(s)&&(!n||i.compare(s)===1)&&(n=s,i=new N(n,r))}),n}I.minVersion=VS;function VS(e,t){e=new Z(e,t);var r=new N("0.0.0");if(e.test(r)||(r=new N("0.0.0-0"),e.test(r)))return r;r=null;for(var n=0;n<e.set.length;++n){var i=e.set[n];i.forEach(function(a){var s=new N(a.semver.version);switch(a.operator){case">":s.prerelease.length===0?s.patch++:s.prerelease.push(0),s.raw=s.format();case"":case">=":(!r||Oi(r,s))&&(r=s);break;case"<":case"<=":break;default:throw new Error("Unexpected operation: "+a.operator)}})}return r&&e.test(r)?r:null}I.validRange=$S;function $S(e,t){try{return new Z(e,t).range||"*"}catch(r){return null}}I.ltr=zS;function zS(e,t,r){return Lu(e,t,"<",r)}I.gtr=KS;function KS(e,t,r){return Lu(e,t,">",r)}I.outside=Lu;function Lu(e,t,r,n){e=new N(e,n),t=new Z(t,n);var i,a,s,o,u;switch(r){case">":i=Oi,a=Mu,s=Ba,o=">",u=">=";break;case"<":i=Ba,a=xu,s=Oi,o="<",u="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if(Fa(e,t,n))return!1;for(var c=0;c<t.set.length;++c){var p=t.set[c],f=null,d=null;if(p.forEach(function(h){h.semver===Pi&&(h=new $e(">=0.0.0")),f=f||h,d=d||h,i(h.semver,f.semver,n)?f=h:s(h.semver,d.semver,n)&&(d=h)}),f.operator===o||f.operator===u||(!d.operator||d.operator===o)&&a(e,d.semver))return!1;if(d.operator===u&&s(e,d.semver))return!1}return!0}I.prerelease=XS;function XS(e,t){var r=mr(e,t);return r&&r.prerelease.length?r.prerelease:null}I.intersects=YS;function YS(e,t,r){return e=new Z(e,r),t=new Z(t,r),e.intersects(t)}I.coerce=QS;function QS(e){if(e instanceof N)return e;if(typeof e!="string")return null;var t=e.match(B[Sf]);return t==null?null:mr(t[1]+"."+(t[2]||"0")+"."+(t[3]||"0"))}});var qu=l(Va=>{"use strict";Object.defineProperty(Va,"__esModule",{value:!0});Va.makePatchingRequire=void 0;var WS=__webpack_require__(/*! path */ "path"),ZS=xf(),Mf=__webpack_require__(/*! module */ "module"),JS=Object.keys(process.binding("natives")),Lf=Mf.prototype.require;function eA(e){var t={};return function(n){var i=Lf.apply(this,arguments);if(e[n]){var a=Mf._resolveFilename(n,this);if(t.hasOwnProperty(a))return t[a];var s=void 0;if(JS.indexOf(n)<0)try{s=Lf.call(this,WS.join(n,"package.json")).version}catch(d){return i}else s=process.version.substring(1);var o=s.indexOf("-");o>=0&&(s=s.substring(0,o));for(var u=i,c=0,p=e[n];c<p.length;c++){var f=p[c];ZS.satisfies(s,f.versionSpecifier)&&(u=f.patch(u,a))}return t[a]=u}return i}}Va.makePatchingRequire=eA});var qf=l((Qx,tA)=>{tA.exports={name:"diagnostic-channel",version:"1.0.0",main:"./dist/src/channel.js",types:"./dist/src/channel.d.ts",scripts:{build:"tsc",lint:"tslint -c tslint.json -p tsconfig.json",clean:"rimraf ./dist",test:"mocha ./dist/tests/**/*.js"},homepage:"https://github.com/Microsoft/node-diagnostic-channel",bugs:{url:"https://github.com/Microsoft/node-diagnostic-channel/issues"},repository:{type:"git",url:"https://github.com/Microsoft/node-diagnostic-channel.git"},description:"Provides a context-saving pub/sub channel to connect diagnostic event publishers and subscribers",dependencies:{semver:"^5.3.0"},devDependencies:{"@types/mocha":"^2.2.40","@types/node":"~8.0.0",mocha:"^3.2.0",rimraf:"^2.6.1",tslint:"^5.0.0",typescript:"4.1.2"},files:["dist/src/**/*.d.ts","dist/src/**/*.js","LICENSE","README.md","package.json"],license:"MIT"}});var ue=l(pn=>{"use strict";Object.defineProperty(pn,"__esModule",{value:!0});pn.channel=pn.makePatchingRequire=void 0;var rA=qu(),nA=qu();Object.defineProperty(pn,"makePatchingRequire",{enumerable:!0,get:function(){return nA.makePatchingRequire}});var jf=function(e){return!0},iA=function(){function e(){this.version=qf().version,this.subscribers={},this.contextPreservationFunction=function(t){return t},this.knownPatches={},this.currentlyPublishing=!1}return e.prototype.shouldPublish=function(t){var r=this.subscribers[t];return r?r.some(function(n){var i=n.filter;return!i||i(!1)}):!1},e.prototype.publish=function(t,r){if(!this.currentlyPublishing){var n=this.subscribers[t];if(n){var i={timestamp:Date.now(),data:r};this.currentlyPublishing=!0,n.forEach(function(a){var s=a.listener,o=a.filter;try{o&&o(!0)&&s(i)}catch(u){}}),this.currentlyPublishing=!1}}},e.prototype.subscribe=function(t,r,n){n===void 0&&(n=jf),this.subscribers[t]||(this.subscribers[t]=[]),this.subscribers[t].push({listener:r,filter:n})},e.prototype.unsubscribe=function(t,r,n){n===void 0&&(n=jf);var i=this.subscribers[t];if(i){for(var a=0;a<i.length;++a)if(i[a].listener===r&&i[a].filter===n)return i.splice(a,1),!0}return!1},e.prototype.reset=function(){var t=this;this.subscribers={},this.contextPreservationFunction=function(r){return r},Object.getOwnPropertyNames(this.knownPatches).forEach(function(r){return delete t.knownPatches[r]})},e.prototype.bindToContext=function(t){return this.contextPreservationFunction(t)},e.prototype.addContextPreservation=function(t){var r=this.contextPreservationFunction;this.contextPreservationFunction=function(n){return t(r(n))}},e.prototype.registerMonkeyPatch=function(t,r){this.knownPatches[t]||(this.knownPatches[t]=[]),this.knownPatches[t].push(r)},e.prototype.getPatchesObject=function(){return this.knownPatches},e}();global.diagnosticsSource||(global.diagnosticsSource=new iA,kf=__webpack_require__(/*! module */ "module"),kf.prototype.require=rA.makePatchingRequire(global.diagnosticsSource.getPatchesObject()));var kf;pn.channel=global.diagnosticsSource});var Uf=l(Hf=>{"use strict";Object.defineProperty(Hf,"__esModule",{value:!0})});var Bf=l($a=>{"use strict";Object.defineProperty($a,"__esModule",{value:!0});$a._globalThis=void 0;$a._globalThis=typeof globalThis=="object"?globalThis:global});var Gf=l(yr=>{"use strict";var aA=yr&&yr.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),sA=yr&&yr.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&aA(t,e,r)};Object.defineProperty(yr,"__esModule",{value:!0});sA(Bf(),yr)});var Ff=l(Tr=>{"use strict";var oA=Tr&&Tr.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),uA=Tr&&Tr.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&oA(t,e,r)};Object.defineProperty(Tr,"__esModule",{value:!0});uA(Gf(),Tr)});var ju=l(za=>{"use strict";Object.defineProperty(za,"__esModule",{value:!0});za.VERSION=void 0;za.VERSION="1.0.3"});var zf=l(fn=>{"use strict";Object.defineProperty(fn,"__esModule",{value:!0});fn.isCompatible=fn._makeCompatibilityCheck=void 0;var cA=ju(),Vf=/^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;function $f(e){var t=new Set([e]),r=new Set,n=e.match(Vf);if(!n)return function(){return!1};var i={major:+n[1],minor:+n[2],patch:+n[3],prerelease:n[4]};if(i.prerelease!=null)return function(u){return u===e};function a(o){return r.add(o),!1}function s(o){return t.add(o),!0}return function(u){if(t.has(u))return!0;if(r.has(u))return!1;var c=u.match(Vf);if(!c)return a(u);var p={major:+c[1],minor:+c[2],patch:+c[3],prerelease:c[4]};return p.prerelease!=null||i.major!==p.major?a(u):i.major===0?i.minor===p.minor&&i.patch<=p.patch?s(u):a(u):i.minor<=p.minor?s(u):a(u)}}fn._makeCompatibilityCheck=$f;fn.isCompatible=$f(cA.VERSION)});var dn=l($t=>{"use strict";Object.defineProperty($t,"__esModule",{value:!0});$t.unregisterGlobal=$t.getGlobal=$t.registerGlobal=void 0;var lA=Ff(),Ri=ju(),pA=zf(),fA=Ri.VERSION.split(".")[0],Ni=Symbol.for("opentelemetry.js.api."+fA),Di=lA._globalThis;function dA(e,t,r,n){var i;n===void 0&&(n=!1);var a=Di[Ni]=(i=Di[Ni])!==null&&i!==void 0?i:{version:Ri.VERSION};if(!n&&a[e]){var s=new Error("@opentelemetry/api: Attempted duplicate registration of API: "+e);return r.error(s.stack||s.message),!1}if(a.version!==Ri.VERSION){var s=new Error("@opentelemetry/api: All API registration versions must match");return r.error(s.stack||s.message),!1}return a[e]=t,r.debug("@opentelemetry/api: Registered a global for "+e+" v"+Ri.VERSION+"."),!0}$t.registerGlobal=dA;function hA(e){var t,r,n=(t=Di[Ni])===null||t===void 0?void 0:t.version;if(!(!n||!pA.isCompatible(n)))return(r=Di[Ni])===null||r===void 0?void 0:r[e]}$t.getGlobal=hA;function _A(e,t){t.debug("@opentelemetry/api: Unregistering a global for "+e+" v"+Ri.VERSION+".");var r=Di[Ni];r&&delete r[e]}$t.unregisterGlobal=_A});var Kf=l(Ka=>{"use strict";Object.defineProperty(Ka,"__esModule",{value:!0});Ka.DiagComponentLogger=void 0;var vA=dn(),gA=function(){function e(t){this._namespace=t.namespace||"DiagComponentLogger"}return e.prototype.debug=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return wi("debug",this._namespace,t)},e.prototype.error=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return wi("error",this._namespace,t)},e.prototype.info=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return wi("info",this._namespace,t)},e.prototype.warn=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return wi("warn",this._namespace,t)},e.prototype.verbose=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return wi("verbose",this._namespace,t)},e}();Ka.DiagComponentLogger=gA;function wi(e,t,r){var n=vA.getGlobal("diag");if(!!n)return r.unshift(t),n[e].apply(n,r)}});var Xa=l(xi=>{"use strict";Object.defineProperty(xi,"__esModule",{value:!0});xi.DiagLogLevel=void 0;var EA;(function(e){e[e.NONE=0]="NONE",e[e.ERROR=30]="ERROR",e[e.WARN=50]="WARN",e[e.INFO=60]="INFO",e[e.DEBUG=70]="DEBUG",e[e.VERBOSE=80]="VERBOSE",e[e.ALL=9999]="ALL"})(EA=xi.DiagLogLevel||(xi.DiagLogLevel={}))});var Xf=l(Ya=>{"use strict";Object.defineProperty(Ya,"__esModule",{value:!0});Ya.createLogLevelDiagLogger=void 0;var Ct=Xa();function mA(e,t){e<Ct.DiagLogLevel.NONE?e=Ct.DiagLogLevel.NONE:e>Ct.DiagLogLevel.ALL&&(e=Ct.DiagLogLevel.ALL),t=t||{};function r(n,i){var a=t[n];return typeof a=="function"&&e>=i?a.bind(t):function(){}}return{error:r("error",Ct.DiagLogLevel.ERROR),warn:r("warn",Ct.DiagLogLevel.WARN),info:r("info",Ct.DiagLogLevel.INFO),debug:r("debug",Ct.DiagLogLevel.DEBUG),verbose:r("verbose",Ct.DiagLogLevel.VERBOSE)}}Ya.createLogLevelDiagLogger=mA});var hn=l(Wa=>{"use strict";Object.defineProperty(Wa,"__esModule",{value:!0});Wa.DiagAPI=void 0;var yA=Kf(),TA=Xf(),SA=Xa(),Qa=dn(),AA="diag",IA=function(){function e(){function t(n){return function(){var i=Qa.getGlobal("diag");if(!!i)return i[n].apply(i,arguments)}}var r=this;r.setLogger=function(n,i){var a,s;if(i===void 0&&(i=SA.DiagLogLevel.INFO),n===r){var o=new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");return r.error((a=o.stack)!==null&&a!==void 0?a:o.message),!1}var u=Qa.getGlobal("diag"),c=TA.createLogLevelDiagLogger(i,n);if(u){var p=(s=new Error().stack)!==null&&s!==void 0?s:"<failed to generate stacktrace>";u.warn("Current logger will be overwritten from "+p),c.warn("Current logger will overwrite one already registered from "+p)}return Qa.registerGlobal("diag",c,r,!0)},r.disable=function(){Qa.unregisterGlobal(AA,r)},r.createComponentLogger=function(n){return new yA.DiagComponentLogger(n)},r.verbose=t("verbose"),r.debug=t("debug"),r.info=t("info"),r.warn=t("warn"),r.error=t("error")}return e.instance=function(){return this._instance||(this._instance=new e),this._instance},e}();Wa.DiagAPI=IA});var Yf=l(Za=>{"use strict";Object.defineProperty(Za,"__esModule",{value:!0});Za.BaggageImpl=void 0;var bA=function(){function e(t){this._entries=t?new Map(t):new Map}return e.prototype.getEntry=function(t){var r=this._entries.get(t);if(!!r)return Object.assign({},r)},e.prototype.getAllEntries=function(){return Array.from(this._entries.entries()).map(function(t){var r=t[0],n=t[1];return[r,n]})},e.prototype.setEntry=function(t,r){var n=new e(this._entries);return n._entries.set(t,r),n},e.prototype.removeEntry=function(t){var r=new e(this._entries);return r._entries.delete(t),r},e.prototype.removeEntries=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n=new e(this._entries),i=0,a=t;i<a.length;i++){var s=a[i];n._entries.delete(s)}return n},e.prototype.clear=function(){return new e},e}();Za.BaggageImpl=bA});var Qf=l(Ja=>{"use strict";Object.defineProperty(Ja,"__esModule",{value:!0});Ja.baggageEntryMetadataSymbol=void 0;Ja.baggageEntryMetadataSymbol=Symbol("BaggageEntryMetadata")});var ku=l(_n=>{"use strict";Object.defineProperty(_n,"__esModule",{value:!0});_n.baggageEntryMetadataFromString=_n.createBaggage=void 0;var CA=hn(),OA=Yf(),PA=Qf(),RA=CA.DiagAPI.instance();function NA(e){return e===void 0&&(e={}),new OA.BaggageImpl(new Map(Object.entries(e)))}_n.createBaggage=NA;function DA(e){return typeof e!="string"&&(RA.error("Cannot create baggage metadata from unknown type: "+typeof e),e=""),{__TYPE__:PA.baggageEntryMetadataSymbol,toString:function(){return e}}}_n.baggageEntryMetadataFromString=DA});var Zf=l(Wf=>{"use strict";Object.defineProperty(Wf,"__esModule",{value:!0})});var ed=l(Jf=>{"use strict";Object.defineProperty(Jf,"__esModule",{value:!0})});var td=l(es=>{"use strict";Object.defineProperty(es,"__esModule",{value:!0});es.DiagConsoleLogger=void 0;var Hu=[{n:"error",c:"error"},{n:"warn",c:"warn"},{n:"info",c:"info"},{n:"debug",c:"debug"},{n:"verbose",c:"trace"}],wA=function(){function e(){function t(n){return function(){var i=arguments;if(console){var a=console[n];if(typeof a!="function"&&(a=console.log),typeof a=="function")return a.apply(console,i)}}}for(var r=0;r<Hu.length;r++)this[Hu[r].n]=t(Hu[r].c)}return e}();es.DiagConsoleLogger=wA});var nd=l(zt=>{"use strict";var xA=zt&&zt.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),rd=zt&&zt.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&xA(t,e,r)};Object.defineProperty(zt,"__esModule",{value:!0});rd(td(),zt);rd(Xa(),zt)});var Uu=l(vn=>{"use strict";Object.defineProperty(vn,"__esModule",{value:!0});vn.defaultTextMapSetter=vn.defaultTextMapGetter=void 0;vn.defaultTextMapGetter={get:function(e,t){if(e!=null)return e[t]},keys:function(e){return e==null?[]:Object.keys(e)}};vn.defaultTextMapSetter={set:function(e,t,r){e!=null&&(e[t]=r)}}});var ad=l(id=>{"use strict";Object.defineProperty(id,"__esModule",{value:!0})});var od=l(sd=>{"use strict";Object.defineProperty(sd,"__esModule",{value:!0})});var Mi=l(gn=>{"use strict";Object.defineProperty(gn,"__esModule",{value:!0});gn.ROOT_CONTEXT=gn.createContextKey=void 0;function MA(e){return Symbol.for(e)}gn.createContextKey=MA;var LA=function(){function e(t){var r=this;r._currentContext=t?new Map(t):new Map,r.getValue=function(n){return r._currentContext.get(n)},r.setValue=function(n,i){var a=new e(r._currentContext);return a._currentContext.set(n,i),a},r.deleteValue=function(n){var i=new e(r._currentContext);return i._currentContext.delete(n),i}}return e}();gn.ROOT_CONTEXT=new LA});var ud=l(En=>{"use strict";var qA=En&&En.__spreadArray||function(e,t){for(var r=0,n=t.length,i=e.length;r<n;r++,i++)e[i]=t[r];return e};Object.defineProperty(En,"__esModule",{value:!0});En.NoopContextManager=void 0;var jA=Mi(),kA=function(){function e(){}return e.prototype.active=function(){return jA.ROOT_CONTEXT},e.prototype.with=function(t,r,n){for(var i=[],a=3;a<arguments.length;a++)i[a-3]=arguments[a];return r.call.apply(r,qA([n],i))},e.prototype.bind=function(t,r){return r},e.prototype.enable=function(){return this},e.prototype.disable=function(){return this},e}();En.NoopContextManager=kA});var Fu=l(mn=>{"use strict";var HA=mn&&mn.__spreadArray||function(e,t){for(var r=0,n=t.length,i=e.length;r<n;r++,i++)e[i]=t[r];return e};Object.defineProperty(mn,"__esModule",{value:!0});mn.ContextAPI=void 0;var UA=ud(),Bu=dn(),cd=hn(),Gu="context",BA=new UA.NoopContextManager,GA=function(){function e(){}return e.getInstance=function(){return this._instance||(this._instance=new e),this._instance},e.prototype.setGlobalContextManager=function(t){return Bu.registerGlobal(Gu,t,cd.DiagAPI.instance())},e.prototype.active=function(){return this._getContextManager().active()},e.prototype.with=function(t,r,n){for(var i,a=[],s=3;s<arguments.length;s++)a[s-3]=arguments[s];return(i=this._getContextManager()).with.apply(i,HA([t,r,n],a))},e.prototype.bind=function(t,r){return this._getContextManager().bind(t,r)},e.prototype._getContextManager=function(){return Bu.getGlobal(Gu)||BA},e.prototype.disable=function(){this._getContextManager().disable(),Bu.unregisterGlobal(Gu,cd.DiagAPI.instance())},e}();mn.ContextAPI=GA});var Vu=l(Li=>{"use strict";Object.defineProperty(Li,"__esModule",{value:!0});Li.TraceFlags=void 0;var FA;(function(e){e[e.NONE=0]="NONE",e[e.SAMPLED=1]="SAMPLED"})(FA=Li.TraceFlags||(Li.TraceFlags={}))});var ts=l(lt=>{"use strict";Object.defineProperty(lt,"__esModule",{value:!0});lt.INVALID_SPAN_CONTEXT=lt.INVALID_TRACEID=lt.INVALID_SPANID=void 0;var VA=Vu();lt.INVALID_SPANID="0000000000000000";lt.INVALID_TRACEID="00000000000000000000000000000000";lt.INVALID_SPAN_CONTEXT={traceId:lt.INVALID_TRACEID,spanId:lt.INVALID_SPANID,traceFlags:VA.TraceFlags.NONE}});var ns=l(rs=>{"use strict";Object.defineProperty(rs,"__esModule",{value:!0});rs.NonRecordingSpan=void 0;var $A=ts(),zA=function(){function e(t){t===void 0&&(t=$A.INVALID_SPAN_CONTEXT),this._spanContext=t}return e.prototype.spanContext=function(){return this._spanContext},e.prototype.setAttribute=function(t,r){return this},e.prototype.setAttributes=function(t){return this},e.prototype.addEvent=function(t,r){return this},e.prototype.setStatus=function(t){return this},e.prototype.updateName=function(t){return this},e.prototype.end=function(t){},e.prototype.isRecording=function(){return!1},e.prototype.recordException=function(t,r){},e}();rs.NonRecordingSpan=zA});var zu=l(ze=>{"use strict";Object.defineProperty(ze,"__esModule",{value:!0});ze.getSpanContext=ze.setSpanContext=ze.deleteSpan=ze.setSpan=ze.getSpan=void 0;var KA=Mi(),XA=ns(),$u=KA.createContextKey("OpenTelemetry Context Key SPAN");function ld(e){return e.getValue($u)||void 0}ze.getSpan=ld;function pd(e,t){return e.setValue($u,t)}ze.setSpan=pd;function YA(e){return e.deleteValue($u)}ze.deleteSpan=YA;function QA(e,t){return pd(e,new XA.NonRecordingSpan(t))}ze.setSpanContext=QA;function WA(e){var t;return(t=ld(e))===null||t===void 0?void 0:t.spanContext()}ze.getSpanContext=WA});var is=l(pt=>{"use strict";Object.defineProperty(pt,"__esModule",{value:!0});pt.wrapSpanContext=pt.isSpanContextValid=pt.isValidSpanId=pt.isValidTraceId=void 0;var fd=ts(),ZA=ns(),JA=/^([0-9a-f]{32})$/i,eI=/^[0-9a-f]{16}$/i;function dd(e){return JA.test(e)&&e!==fd.INVALID_TRACEID}pt.isValidTraceId=dd;function hd(e){return eI.test(e)&&e!==fd.INVALID_SPANID}pt.isValidSpanId=hd;function tI(e){return dd(e.traceId)&&hd(e.spanId)}pt.isSpanContextValid=tI;function rI(e){return new ZA.NonRecordingSpan(e)}pt.wrapSpanContext=rI});var Xu=l(as=>{"use strict";Object.defineProperty(as,"__esModule",{value:!0});as.NoopTracer=void 0;var nI=Fu(),_d=zu(),Ku=ns(),iI=is(),vd=nI.ContextAPI.getInstance(),aI=function(){function e(){}return e.prototype.startSpan=function(t,r,n){var i=Boolean(r==null?void 0:r.root);if(i)return new Ku.NonRecordingSpan;var a=n&&_d.getSpanContext(n);return sI(a)&&iI.isSpanContextValid(a)?new Ku.NonRecordingSpan(a):new Ku.NonRecordingSpan},e.prototype.startActiveSpan=function(t,r,n,i){var a,s,o;if(!(arguments.length<2)){arguments.length===2?o=r:arguments.length===3?(a=r,o=n):(a=r,s=n,o=i);var u=s!=null?s:vd.active(),c=this.startSpan(t,a,u),p=_d.setSpan(u,c);return vd.with(p,o,void 0,c)}},e}();as.NoopTracer=aI;function sI(e){return typeof e=="object"&&typeof e.spanId=="string"&&typeof e.traceId=="string"&&typeof e.traceFlags=="number"}});var Yu=l(ss=>{"use strict";Object.defineProperty(ss,"__esModule",{value:!0});ss.ProxyTracer=void 0;var oI=Xu(),uI=new oI.NoopTracer,cI=function(){function e(t,r,n){this._provider=t,this.name=r,this.version=n}return e.prototype.startSpan=function(t,r,n){return this._getTracer().startSpan(t,r,n)},e.prototype.startActiveSpan=function(t,r,n,i){var a=this._getTracer();return Reflect.apply(a.startActiveSpan,a,arguments)},e.prototype._getTracer=function(){if(this._delegate)return this._delegate;var t=this._provider.getDelegateTracer(this.name,this.version);return t?(this._delegate=t,this._delegate):uI},e}();ss.ProxyTracer=cI});var gd=l(os=>{"use strict";Object.defineProperty(os,"__esModule",{value:!0});os.NoopTracerProvider=void 0;var lI=Xu(),pI=function(){function e(){}return e.prototype.getTracer=function(t,r){return new lI.NoopTracer},e}();os.NoopTracerProvider=pI});var Qu=l(us=>{"use strict";Object.defineProperty(us,"__esModule",{value:!0});us.ProxyTracerProvider=void 0;var fI=Yu(),dI=gd(),hI=new dI.NoopTracerProvider,_I=function(){function e(){}return e.prototype.getTracer=function(t,r){var n;return(n=this.getDelegateTracer(t,r))!==null&&n!==void 0?n:new fI.ProxyTracer(this,t,r)},e.prototype.getDelegate=function(){var t;return(t=this._delegate)!==null&&t!==void 0?t:hI},e.prototype.setDelegate=function(t){this._delegate=t},e.prototype.getDelegateTracer=function(t,r){var n;return(n=this._delegate)===null||n===void 0?void 0:n.getTracer(t,r)},e}();us.ProxyTracerProvider=_I});var md=l(Ed=>{"use strict";Object.defineProperty(Ed,"__esModule",{value:!0})});var yd=l(qi=>{"use strict";Object.defineProperty(qi,"__esModule",{value:!0});qi.SamplingDecision=void 0;var vI;(function(e){e[e.NOT_RECORD=0]="NOT_RECORD",e[e.RECORD=1]="RECORD",e[e.RECORD_AND_SAMPLED=2]="RECORD_AND_SAMPLED"})(vI=qi.SamplingDecision||(qi.SamplingDecision={}))});var Sd=l(Td=>{"use strict";Object.defineProperty(Td,"__esModule",{value:!0})});var Ad=l(ji=>{"use strict";Object.defineProperty(ji,"__esModule",{value:!0});ji.SpanKind=void 0;var gI;(function(e){e[e.INTERNAL=0]="INTERNAL",e[e.SERVER=1]="SERVER",e[e.CLIENT=2]="CLIENT",e[e.PRODUCER=3]="PRODUCER",e[e.CONSUMER=4]="CONSUMER"})(gI=ji.SpanKind||(ji.SpanKind={}))});var bd=l(Id=>{"use strict";Object.defineProperty(Id,"__esModule",{value:!0})});var Od=l(Cd=>{"use strict";Object.defineProperty(Cd,"__esModule",{value:!0})});var Pd=l(ki=>{"use strict";Object.defineProperty(ki,"__esModule",{value:!0});ki.SpanStatusCode=void 0;var EI;(function(e){e[e.UNSET=0]="UNSET",e[e.OK=1]="OK",e[e.ERROR=2]="ERROR"})(EI=ki.SpanStatusCode||(ki.SpanStatusCode={}))});var Nd=l(Rd=>{"use strict";Object.defineProperty(Rd,"__esModule",{value:!0})});var wd=l(Dd=>{"use strict";Object.defineProperty(Dd,"__esModule",{value:!0})});var Md=l(xd=>{"use strict";Object.defineProperty(xd,"__esModule",{value:!0})});var qd=l(Ld=>{"use strict";Object.defineProperty(Ld,"__esModule",{value:!0})});var Ud=l(cs=>{"use strict";Object.defineProperty(cs,"__esModule",{value:!0});cs.TraceAPI=void 0;var Wu=dn(),jd=Qu(),kd=is(),Hi=zu(),Hd=hn(),Zu="trace",mI=function(){function e(){this._proxyTracerProvider=new jd.ProxyTracerProvider,this.wrapSpanContext=kd.wrapSpanContext,this.isSpanContextValid=kd.isSpanContextValid,this.deleteSpan=Hi.deleteSpan,this.getSpan=Hi.getSpan,this.getSpanContext=Hi.getSpanContext,this.setSpan=Hi.setSpan,this.setSpanContext=Hi.setSpanContext}return e.getInstance=function(){return this._instance||(this._instance=new e),this._instance},e.prototype.setGlobalTracerProvider=function(t){var r=Wu.registerGlobal(Zu,this._proxyTracerProvider,Hd.DiagAPI.instance());return r&&this._proxyTracerProvider.setDelegate(t),r},e.prototype.getTracerProvider=function(){return Wu.getGlobal(Zu)||this._proxyTracerProvider},e.prototype.getTracer=function(t,r){return this.getTracerProvider().getTracer(t,r)},e.prototype.disable=function(){Wu.unregisterGlobal(Zu,Hd.DiagAPI.instance()),this._proxyTracerProvider=new jd.ProxyTracerProvider},e}();cs.TraceAPI=mI});var Bd=l(ls=>{"use strict";Object.defineProperty(ls,"__esModule",{value:!0});ls.NoopTextMapPropagator=void 0;var yI=function(){function e(){}return e.prototype.inject=function(t,r){},e.prototype.extract=function(t,r){return t},e.prototype.fields=function(){return[]},e}();ls.NoopTextMapPropagator=yI});var Gd=l(Kt=>{"use strict";Object.defineProperty(Kt,"__esModule",{value:!0});Kt.deleteBaggage=Kt.setBaggage=Kt.getBaggage=void 0;var TI=Mi(),Ju=TI.createContextKey("OpenTelemetry Baggage Key");function SI(e){return e.getValue(Ju)||void 0}Kt.getBaggage=SI;function AI(e,t){return e.setValue(Ju,t)}Kt.setBaggage=AI;function II(e){return e.deleteValue(Ju)}Kt.deleteBaggage=II});var $d=l(ps=>{"use strict";Object.defineProperty(ps,"__esModule",{value:!0});ps.PropagationAPI=void 0;var ec=dn(),bI=Bd(),Fd=Uu(),tc=Gd(),CI=ku(),Vd=hn(),rc="propagation",OI=new bI.NoopTextMapPropagator,PI=function(){function e(){this.createBaggage=CI.createBaggage,this.getBaggage=tc.getBaggage,this.setBaggage=tc.setBaggage,this.deleteBaggage=tc.deleteBaggage}return e.getInstance=function(){return this._instance||(this._instance=new e),this._instance},e.prototype.setGlobalPropagator=function(t){return ec.registerGlobal(rc,t,Vd.DiagAPI.instance())},e.prototype.inject=function(t,r,n){return n===void 0&&(n=Fd.defaultTextMapSetter),this._getGlobalPropagator().inject(t,r,n)},e.prototype.extract=function(t,r,n){return n===void 0&&(n=Fd.defaultTextMapGetter),this._getGlobalPropagator().extract(t,r,n)},e.prototype.fields=function(){return this._getGlobalPropagator().fields()},e.prototype.disable=function(){ec.unregisterGlobal(rc,Vd.DiagAPI.instance())},e.prototype._getGlobalPropagator=function(){return ec.getGlobal(rc)||OI},e}();ps.PropagationAPI=PI});var z=l(y=>{"use strict";var RI=y&&y.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),ne=y&&y.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&RI(t,e,r)};Object.defineProperty(y,"__esModule",{value:!0});y.diag=y.propagation=y.trace=y.context=y.INVALID_SPAN_CONTEXT=y.INVALID_TRACEID=y.INVALID_SPANID=y.isValidSpanId=y.isValidTraceId=y.isSpanContextValid=y.baggageEntryMetadataFromString=void 0;ne(Uf(),y);var NI=ku();Object.defineProperty(y,"baggageEntryMetadataFromString",{enumerable:!0,get:function(){return NI.baggageEntryMetadataFromString}});ne(Zf(),y);ne(ed(),y);ne(nd(),y);ne(Uu(),y);ne(ad(),y);ne(od(),y);ne(Yu(),y);ne(Qu(),y);ne(md(),y);ne(yd(),y);ne(Sd(),y);ne(Ad(),y);ne(bd(),y);ne(Od(),y);ne(Pd(),y);ne(Vu(),y);ne(Nd(),y);ne(wd(),y);ne(Md(),y);var nc=is();Object.defineProperty(y,"isSpanContextValid",{enumerable:!0,get:function(){return nc.isSpanContextValid}});Object.defineProperty(y,"isValidTraceId",{enumerable:!0,get:function(){return nc.isValidTraceId}});Object.defineProperty(y,"isValidSpanId",{enumerable:!0,get:function(){return nc.isValidSpanId}});var ic=ts();Object.defineProperty(y,"INVALID_SPANID",{enumerable:!0,get:function(){return ic.INVALID_SPANID}});Object.defineProperty(y,"INVALID_TRACEID",{enumerable:!0,get:function(){return ic.INVALID_TRACEID}});Object.defineProperty(y,"INVALID_SPAN_CONTEXT",{enumerable:!0,get:function(){return ic.INVALID_SPAN_CONTEXT}});ne(Mi(),y);ne(qd(),y);var DI=Fu();y.context=DI.ContextAPI.getInstance();var wI=Ud();y.trace=wI.TraceAPI.getInstance();var xI=$d();y.propagation=xI.PropagationAPI.getInstance();var MI=hn();y.diag=MI.DiagAPI.instance();y.default={trace:y.trace,context:y.context,propagation:y.propagation,diag:y.diag}});var fs=l(Xt=>{"use strict";Object.defineProperty(Xt,"__esModule",{value:!0});Xt.isTracingSuppressed=Xt.unsuppressTracing=Xt.suppressTracing=void 0;var LI=z(),ac=LI.createContextKey("OpenTelemetry SDK Context Key SUPPRESS_TRACING");function qI(e){return e.setValue(ac,!0)}Xt.suppressTracing=qI;function jI(e){return e.deleteValue(ac)}Xt.unsuppressTracing=jI;function kI(e){return e.getValue(ac)===!0}Xt.isTracingSuppressed=kI});var sc=l(Ie=>{"use strict";Object.defineProperty(Ie,"__esModule",{value:!0});Ie.BAGGAGE_MAX_TOTAL_LENGTH=Ie.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS=Ie.BAGGAGE_MAX_NAME_VALUE_PAIRS=Ie.BAGGAGE_HEADER=Ie.BAGGAGE_ITEMS_SEPARATOR=Ie.BAGGAGE_PROPERTIES_SEPARATOR=Ie.BAGGAGE_KEY_PAIR_SEPARATOR=void 0;Ie.BAGGAGE_KEY_PAIR_SEPARATOR="=";Ie.BAGGAGE_PROPERTIES_SEPARATOR=";";Ie.BAGGAGE_ITEMS_SEPARATOR=",";Ie.BAGGAGE_HEADER="baggage";Ie.BAGGAGE_MAX_NAME_VALUE_PAIRS=180;Ie.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS=4096;Ie.BAGGAGE_MAX_TOTAL_LENGTH=8192});var oc=l(nt=>{"use strict";Object.defineProperty(nt,"__esModule",{value:!0});nt.parseKeyPairsIntoRecord=nt.parsePairKeyValue=nt.getKeyPairs=nt.serializeKeyPairs=void 0;var HI=z(),yn=sc(),UI=e=>e.reduce((t,r)=>{let n=`${t}${t!==""?yn.BAGGAGE_ITEMS_SEPARATOR:""}${r}`;return n.length>yn.BAGGAGE_MAX_TOTAL_LENGTH?t:n},"");nt.serializeKeyPairs=UI;var BI=e=>e.getAllEntries().map(([t,r])=>`${encodeURIComponent(t)}=${encodeURIComponent(r.value)}`);nt.getKeyPairs=BI;var GI=e=>{let t=e.split(yn.BAGGAGE_PROPERTIES_SEPARATOR);if(t.length<=0)return;let r=t.shift();if(!r)return;let n=r.split(yn.BAGGAGE_KEY_PAIR_SEPARATOR);if(n.length!==2)return;let i=decodeURIComponent(n[0].trim()),a=decodeURIComponent(n[1].trim()),s;return t.length>0&&(s=HI.baggageEntryMetadataFromString(t.join(yn.BAGGAGE_PROPERTIES_SEPARATOR))),{key:i,value:a,metadata:s}};nt.parsePairKeyValue=GI;var FI=e=>typeof e!="string"||e.length===0?{}:e.split(yn.BAGGAGE_ITEMS_SEPARATOR).map(t=>nt.parsePairKeyValue(t)).filter(t=>t!==void 0&&t.value.length>0).reduce((t,r)=>(t[r.key]=r.value,t),{});nt.parseKeyPairsIntoRecord=FI});var Kd=l(ds=>{"use strict";Object.defineProperty(ds,"__esModule",{value:!0});ds.HttpBaggagePropagator=void 0;var uc=z(),VI=fs(),Tn=sc(),cc=oc(),zd=class{inject(t,r,n){let i=uc.propagation.getBaggage(t);if(!i||VI.isTracingSuppressed(t))return;let a=cc.getKeyPairs(i).filter(o=>o.length<=Tn.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS).slice(0,Tn.BAGGAGE_MAX_NAME_VALUE_PAIRS),s=cc.serializeKeyPairs(a);s.length>0&&n.set(r,Tn.BAGGAGE_HEADER,s)}extract(t,r,n){let i=n.get(r,Tn.BAGGAGE_HEADER);if(!i)return t;let a={};return i.length===0||(i.split(Tn.BAGGAGE_ITEMS_SEPARATOR).forEach(o=>{let u=cc.parsePairKeyValue(o);if(u){let c={value:u.value};u.metadata&&(c.metadata=u.metadata),a[u.key]=c}}),Object.entries(a).length===0)?t:uc.propagation.setBaggage(t,uc.propagation.createBaggage(a))}fields(){return[Tn.BAGGAGE_HEADER]}};ds.HttpBaggagePropagator=zd});var Qd=l(Sn=>{"use strict";Object.defineProperty(Sn,"__esModule",{value:!0});Sn.isAttributeValue=Sn.sanitizeAttributes=void 0;function $I(e){let t={};if(e==null||typeof e!="object")return t;for(let[r,n]of Object.entries(e))Xd(n)&&(Array.isArray(n)?t[r]=n.slice():t[r]=n);return t}Sn.sanitizeAttributes=$I;function Xd(e){return e==null?!0:Array.isArray(e)?zI(e):Yd(e)}Sn.isAttributeValue=Xd;function zI(e){let t;for(let r of e)if(r!=null){if(!t){if(Yd(r)){t=typeof r;continue}return!1}if(typeof r!==t)return!1}return!0}function Yd(e){switch(typeof e){case"number":return!0;case"boolean":return!0;case"string":return!0}return!1}});var lc=l(hs=>{"use strict";Object.defineProperty(hs,"__esModule",{value:!0});hs.loggingErrorHandler=void 0;var KI=z();function XI(){return e=>{KI.diag.error(YI(e))}}hs.loggingErrorHandler=XI;function YI(e){return typeof e=="string"?e:JSON.stringify(QI(e))}function QI(e){let t={},r=e;for(;r!==null;)Object.getOwnPropertyNames(r).forEach(n=>{if(t[n])return;let i=r[n];i&&(t[n]=String(i))}),r=Object.getPrototypeOf(r);return t}});var pc=l(An=>{"use strict";Object.defineProperty(An,"__esModule",{value:!0});An.globalErrorHandler=An.setGlobalErrorHandler=void 0;var WI=lc(),Wd=WI.loggingErrorHandler();function ZI(e){Wd=e}An.setGlobalErrorHandler=ZI;var JI=e=>{try{Wd(e)}catch(t){}};An.globalErrorHandler=JI});var fc=l(Ui=>{"use strict";Object.defineProperty(Ui,"__esModule",{value:!0});Ui.TracesSamplerValues=void 0;var eb;(function(e){e.AlwaysOff="always_off",e.AlwaysOn="always_on",e.ParentBasedAlwaysOff="parentbased_always_off",e.ParentBasedAlwaysOn="parentbased_always_on",e.ParentBasedTraceIdRatio="parentbased_traceidratio",e.TraceIdRatio="traceidratio"})(eb=Ui.TracesSamplerValues||(Ui.TracesSamplerValues={}))});var dc=l(Sr=>{"use strict";Object.defineProperty(Sr,"__esModule",{value:!0});Sr.parseEnvironment=Sr.DEFAULT_ENVIRONMENT=void 0;var Yt=z(),tb=fc(),rb=",",nb=["OTEL_BSP_EXPORT_TIMEOUT","OTEL_BSP_MAX_EXPORT_BATCH_SIZE","OTEL_BSP_MAX_QUEUE_SIZE","OTEL_BSP_SCHEDULE_DELAY","OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT","OTEL_SPAN_EVENT_COUNT_LIMIT","OTEL_SPAN_LINK_COUNT_LIMIT"];function ib(e){return nb.indexOf(e)>-1}var ab=["OTEL_NO_PATCH_MODULES","OTEL_PROPAGATORS"];function sb(e){return ab.indexOf(e)>-1}Sr.DEFAULT_ENVIRONMENT={CONTAINER_NAME:"",ECS_CONTAINER_METADATA_URI_V4:"",ECS_CONTAINER_METADATA_URI:"",HOSTNAME:"",KUBERNETES_SERVICE_HOST:"",NAMESPACE:"",OTEL_BSP_EXPORT_TIMEOUT:3e4,OTEL_BSP_MAX_EXPORT_BATCH_SIZE:512,OTEL_BSP_MAX_QUEUE_SIZE:2048,OTEL_BSP_SCHEDULE_DELAY:5e3,OTEL_EXPORTER_JAEGER_AGENT_HOST:"",OTEL_EXPORTER_JAEGER_ENDPOINT:"",OTEL_EXPORTER_JAEGER_PASSWORD:"",OTEL_EXPORTER_JAEGER_USER:"",OTEL_EXPORTER_OTLP_ENDPOINT:"",OTEL_EXPORTER_OTLP_TRACES_ENDPOINT:"",OTEL_EXPORTER_OTLP_METRICS_ENDPOINT:"",OTEL_EXPORTER_OTLP_HEADERS:"",OTEL_EXPORTER_OTLP_TRACES_HEADERS:"",OTEL_EXPORTER_OTLP_METRICS_HEADERS:"",OTEL_EXPORTER_ZIPKIN_ENDPOINT:"http://localhost:9411/api/v2/spans",OTEL_LOG_LEVEL:Yt.DiagLogLevel.INFO,OTEL_NO_PATCH_MODULES:[],OTEL_PROPAGATORS:["tracecontext","baggage"],OTEL_RESOURCE_ATTRIBUTES:"",OTEL_SERVICE_NAME:"",OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT:128,OTEL_SPAN_EVENT_COUNT_LIMIT:128,OTEL_SPAN_LINK_COUNT_LIMIT:128,OTEL_TRACES_EXPORTER:"none",OTEL_TRACES_SAMPLER:tb.TracesSamplerValues.ParentBasedAlwaysOn,OTEL_TRACES_SAMPLER_ARG:""};function ob(e,t,r,n=-1/0,i=1/0){if(typeof r[e]!="undefined"){let a=Number(r[e]);isNaN(a)||(a<n?t[e]=n:a>i?t[e]=i:t[e]=a)}}function ub(e,t,r,n=rb){let i=r[e];typeof i=="string"&&(t[e]=i.split(n).map(a=>a.trim()))}var cb={ALL:Yt.DiagLogLevel.ALL,VERBOSE:Yt.DiagLogLevel.VERBOSE,DEBUG:Yt.DiagLogLevel.DEBUG,INFO:Yt.DiagLogLevel.INFO,WARN:Yt.DiagLogLevel.WARN,ERROR:Yt.DiagLogLevel.ERROR,NONE:Yt.DiagLogLevel.NONE};function lb(e,t,r){let n=r[e];if(typeof n=="string"){let i=cb[n.toUpperCase()];i!=null&&(t[e]=i)}}function pb(e){let t={};for(let r in Sr.DEFAULT_ENVIRONMENT){let n=r;switch(n){case"OTEL_LOG_LEVEL":lb(n,t,e);break;default:if(ib(n))ob(n,t,e);else if(sb(n))ub(n,t,e);else{let i=e[n];typeof i!="undefined"&&i!==null&&(t[n]=String(i))}}}return t}Sr.parseEnvironment=pb});var Jd=l(_s=>{"use strict";Object.defineProperty(_s,"__esModule",{value:!0});_s.getEnv=void 0;var fb=__webpack_require__(/*! os */ "os"),Zd=dc();function db(){let e=Zd.parseEnvironment(process.env);return Object.assign({HOSTNAME:fb.hostname()},Zd.DEFAULT_ENVIRONMENT,e)}_s.getEnv=db});var eh=l(vs=>{"use strict";Object.defineProperty(vs,"__esModule",{value:!0});vs.hexToBase64=void 0;function hb(e){let t=e.length,r="";for(let n=0;n<t;n+=2){let i=e.substring(n,n+2),a=parseInt(i,16);r+=String.fromCharCode(a)}return Buffer.from(r,"ascii").toString("base64")}vs.hexToBase64=hb});var ih=l(Es=>{"use strict";Object.defineProperty(Es,"__esModule",{value:!0});Es.RandomIdGenerator=void 0;var _b=8,th=16,rh=class{constructor(){this.generateTraceId=nh(th),this.generateSpanId=nh(_b)}};Es.RandomIdGenerator=rh;var gs=Buffer.allocUnsafe(th);function nh(e){return function(){for(let r=0;r<e/4;r++)gs.writeUInt32BE(Math.random()*2**32>>>0,r*4);for(let r=0;r<e&&!(gs[r]>0);r++)r===e-1&&(gs[e-1]=1);return gs.toString("hex",0,e)}}});var ah=l(ms=>{"use strict";Object.defineProperty(ms,"__esModule",{value:!0});ms.otperformance=void 0;var vb=__webpack_require__(/*! perf_hooks */ "perf_hooks");ms.otperformance=vb.performance});var Ts=l(ys=>{"use strict";Object.defineProperty(ys,"__esModule",{value:!0});ys.VERSION=void 0;ys.VERSION="0.23.0"});var sh=l(x=>{"use strict";Object.defineProperty(x,"__esModule",{value:!0});x.RpcGrpcStatusCodeValues=x.MessagingOperationValues=x.MessagingDestinationKindValues=x.HttpFlavorValues=x.NetTransportValues=x.FaasInvokedProviderValues=x.FaasDocumentOperationValues=x.FaasTriggerValues=x.DbCassandraConsistencyLevelValues=x.DbSystemValues=x.SemanticAttributes=void 0;x.SemanticAttributes={DB_SYSTEM:"db.system",DB_CONNECTION_STRING:"db.connection_string",DB_USER:"db.user",DB_JDBC_DRIVER_CLASSNAME:"db.jdbc.driver_classname",DB_NAME:"db.name",DB_STATEMENT:"db.statement",DB_OPERATION:"db.operation",DB_MSSQL_INSTANCE_NAME:"db.mssql.instance_name",DB_CASSANDRA_KEYSPACE:"db.cassandra.keyspace",DB_CASSANDRA_PAGE_SIZE:"db.cassandra.page_size",DB_CASSANDRA_CONSISTENCY_LEVEL:"db.cassandra.consistency_level",DB_CASSANDRA_TABLE:"db.cassandra.table",DB_CASSANDRA_IDEMPOTENCE:"db.cassandra.idempotence",DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT:"db.cassandra.speculative_execution_count",DB_CASSANDRA_COORDINATOR_ID:"db.cassandra.coordinator.id",DB_CASSANDRA_COORDINATOR_DC:"db.cassandra.coordinator.dc",DB_HBASE_NAMESPACE:"db.hbase.namespace",DB_REDIS_DATABASE_INDEX:"db.redis.database_index",DB_MONGODB_COLLECTION:"db.mongodb.collection",DB_SQL_TABLE:"db.sql.table",EXCEPTION_TYPE:"exception.type",EXCEPTION_MESSAGE:"exception.message",EXCEPTION_STACKTRACE:"exception.stacktrace",EXCEPTION_ESCAPED:"exception.escaped",FAAS_TRIGGER:"faas.trigger",FAAS_EXECUTION:"faas.execution",FAAS_DOCUMENT_COLLECTION:"faas.document.collection",FAAS_DOCUMENT_OPERATION:"faas.document.operation",FAAS_DOCUMENT_TIME:"faas.document.time",FAAS_DOCUMENT_NAME:"faas.document.name",FAAS_TIME:"faas.time",FAAS_CRON:"faas.cron",FAAS_COLDSTART:"faas.coldstart",FAAS_INVOKED_NAME:"faas.invoked_name",FAAS_INVOKED_PROVIDER:"faas.invoked_provider",FAAS_INVOKED_REGION:"faas.invoked_region",NET_TRANSPORT:"net.transport",NET_PEER_IP:"net.peer.ip",NET_PEER_PORT:"net.peer.port",NET_PEER_NAME:"net.peer.name",NET_HOST_IP:"net.host.ip",NET_HOST_PORT:"net.host.port",NET_HOST_NAME:"net.host.name",PEER_SERVICE:"peer.service",ENDUSER_ID:"enduser.id",ENDUSER_ROLE:"enduser.role",ENDUSER_SCOPE:"enduser.scope",THREAD_ID:"thread.id",THREAD_NAME:"thread.name",CODE_FUNCTION:"code.function",CODE_NAMESPACE:"code.namespace",CODE_FILEPATH:"code.filepath",CODE_LINENO:"code.lineno",HTTP_METHOD:"http.method",HTTP_URL:"http.url",HTTP_TARGET:"http.target",HTTP_HOST:"http.host",HTTP_SCHEME:"http.scheme",HTTP_STATUS_CODE:"http.status_code",HTTP_FLAVOR:"http.flavor",HTTP_USER_AGENT:"http.user_agent",HTTP_REQUEST_CONTENT_LENGTH:"http.request_content_length",HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED:"http.request_content_length_uncompressed",HTTP_RESPONSE_CONTENT_LENGTH:"http.response_content_length",HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED:"http.response_content_length_uncompressed",HTTP_SERVER_NAME:"http.server_name",HTTP_ROUTE:"http.route",HTTP_CLIENT_IP:"http.client_ip",AWS_DYNAMODB_TABLE_NAMES:"aws.dynamodb.table_names",AWS_DYNAMODB_CONSUMED_CAPACITY:"aws.dynamodb.consumed_capacity",AWS_DYNAMODB_ITEM_COLLECTION_METRICS:"aws.dynamodb.item_collection_metrics",AWS_DYNAMODB_PROVISIONED_READ_CAPACITY:"aws.dynamodb.provisioned_read_capacity",AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY:"aws.dynamodb.provisioned_write_capacity",AWS_DYNAMODB_CONSISTENT_READ:"aws.dynamodb.consistent_read",AWS_DYNAMODB_PROJECTION:"aws.dynamodb.projection",AWS_DYNAMODB_LIMIT:"aws.dynamodb.limit",AWS_DYNAMODB_ATTRIBUTES_TO_GET:"aws.dynamodb.attributes_to_get",AWS_DYNAMODB_INDEX_NAME:"aws.dynamodb.index_name",AWS_DYNAMODB_SELECT:"aws.dynamodb.select",AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES:"aws.dynamodb.global_secondary_indexes",AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES:"aws.dynamodb.local_secondary_indexes",AWS_DYNAMODB_EXCLUSIVE_START_TABLE:"aws.dynamodb.exclusive_start_table",AWS_DYNAMODB_TABLE_COUNT:"aws.dynamodb.table_count",AWS_DYNAMODB_SCAN_FORWARD:"aws.dynamodb.scan_forward",AWS_DYNAMODB_SEGMENT:"aws.dynamodb.segment",AWS_DYNAMODB_TOTAL_SEGMENTS:"aws.dynamodb.total_segments",AWS_DYNAMODB_COUNT:"aws.dynamodb.count",AWS_DYNAMODB_SCANNED_COUNT:"aws.dynamodb.scanned_count",AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS:"aws.dynamodb.attribute_definitions",AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES:"aws.dynamodb.global_secondary_index_updates",MESSAGING_SYSTEM:"messaging.system",MESSAGING_DESTINATION:"messaging.destination",MESSAGING_DESTINATION_KIND:"messaging.destination_kind",MESSAGING_TEMP_DESTINATION:"messaging.temp_destination",MESSAGING_PROTOCOL:"messaging.protocol",MESSAGING_PROTOCOL_VERSION:"messaging.protocol_version",MESSAGING_URL:"messaging.url",MESSAGING_MESSAGE_ID:"messaging.message_id",MESSAGING_CONVERSATION_ID:"messaging.conversation_id",MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES:"messaging.message_payload_size_bytes",MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES:"messaging.message_payload_compressed_size_bytes",MESSAGING_OPERATION:"messaging.operation",MESSAGING_RABBITMQ_ROUTING_KEY:"messaging.rabbitmq.routing_key",MESSAGING_KAFKA_MESSAGE_KEY:"messaging.kafka.message_key",MESSAGING_KAFKA_CONSUMER_GROUP:"messaging.kafka.consumer_group",MESSAGING_KAFKA_CLIENT_ID:"messaging.kafka.client_id",MESSAGING_KAFKA_PARTITION:"messaging.kafka.partition",MESSAGING_KAFKA_TOMBSTONE:"messaging.kafka.tombstone",RPC_SYSTEM:"rpc.system",RPC_SERVICE:"rpc.service",RPC_METHOD:"rpc.method",RPC_GRPC_STATUS_CODE:"rpc.grpc.status_code",RPC_JSONRPC_VERSION:"rpc.jsonrpc.version",RPC_JSONRPC_METHOD:"rpc.jsonrpc.method",RPC_JSONRPC_REQUEST_ID:"rpc.jsonrpc.request_id",RPC_JSONRPC_ERROR_CODE:"rpc.jsonrpc.error_code",RPC_JSONRPC_ERROR_MESSAGE:"rpc.jsonrpc.error_message"};var gb;(function(e){e.OTHER_SQL="other_sql",e.MSSQL="mssql",e.MYSQL="mysql",e.ORACLE="oracle",e.DB2="db2",e.POSTGRESQL="postgresql",e.REDSHIFT="redshift",e.HIVE="hive",e.CLOUDSCAPE="cloudscape",e.HSQLDB="hsqldb",e.PROGRESS="progress",e.MAXDB="maxdb",e.HANADB="hanadb",e.INGRES="ingres",e.FIRSTSQL="firstsql",e.EDB="edb",e.CACHE="cache",e.ADABAS="adabas",e.FIREBIRD="firebird",e.DERBY="derby",e.FILEMAKER="filemaker",e.INFORMIX="informix",e.INSTANTDB="instantdb",e.INTERBASE="interbase",e.MARIADB="mariadb",e.NETEZZA="netezza",e.PERVASIVE="pervasive",e.POINTBASE="pointbase",e.SQLITE="sqlite",e.SYBASE="sybase",e.TERADATA="teradata",e.VERTICA="vertica",e.H2="h2",e.COLDFUSION="coldfusion",e.CASSANDRA="cassandra",e.HBASE="hbase",e.MONGODB="mongodb",e.REDIS="redis",e.COUCHBASE="couchbase",e.COUCHDB="couchdb",e.COSMOSDB="cosmosdb",e.DYNAMODB="dynamodb",e.NEO4J="neo4j",e.GEODE="geode",e.ELASTICSEARCH="elasticsearch",e.MEMCACHED="memcached",e.COCKROACHDB="cockroachdb"})(gb=x.DbSystemValues||(x.DbSystemValues={}));var Eb;(function(e){e.ALL="all",e.EACH_QUORUM="each_quorum",e.QUORUM="quorum",e.LOCAL_QUORUM="local_quorum",e.ONE="one",e.TWO="two",e.THREE="three",e.LOCAL_ONE="local_one",e.ANY="any",e.SERIAL="serial",e.LOCAL_SERIAL="local_serial"})(Eb=x.DbCassandraConsistencyLevelValues||(x.DbCassandraConsistencyLevelValues={}));var mb;(function(e){e.DATASOURCE="datasource",e.HTTP="http",e.PUBSUB="pubsub",e.TIMER="timer",e.OTHER="other"})(mb=x.FaasTriggerValues||(x.FaasTriggerValues={}));var yb;(function(e){e.INSERT="insert",e.EDIT="edit",e.DELETE="delete"})(yb=x.FaasDocumentOperationValues||(x.FaasDocumentOperationValues={}));var Tb;(function(e){e.AWS="aws",e.AZURE="azure",e.GCP="gcp"})(Tb=x.FaasInvokedProviderValues||(x.FaasInvokedProviderValues={}));var Sb;(function(e){e.IP_TCP="ip_tcp",e.IP_UDP="ip_udp",e.IP="ip",e.UNIX="unix",e.PIPE="pipe",e.INPROC="inproc",e.OTHER="other"})(Sb=x.NetTransportValues||(x.NetTransportValues={}));var Ab;(function(e){e.HTTP_1_0="1.0",e.HTTP_1_1="1.1",e.HTTP_2_0="2.0",e.SPDY="SPDY",e.QUIC="QUIC"})(Ab=x.HttpFlavorValues||(x.HttpFlavorValues={}));var Ib;(function(e){e.QUEUE="queue",e.TOPIC="topic"})(Ib=x.MessagingDestinationKindValues||(x.MessagingDestinationKindValues={}));var bb;(function(e){e.RECEIVE="receive",e.PROCESS="process"})(bb=x.MessagingOperationValues||(x.MessagingOperationValues={}));var Cb;(function(e){e[e.OK=0]="OK",e[e.CANCELLED=1]="CANCELLED",e[e.UNKNOWN=2]="UNKNOWN",e[e.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",e[e.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",e[e.NOT_FOUND=5]="NOT_FOUND",e[e.ALREADY_EXISTS=6]="ALREADY_EXISTS",e[e.PERMISSION_DENIED=7]="PERMISSION_DENIED",e[e.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",e[e.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",e[e.ABORTED=10]="ABORTED",e[e.OUT_OF_RANGE=11]="OUT_OF_RANGE",e[e.UNIMPLEMENTED=12]="UNIMPLEMENTED",e[e.INTERNAL=13]="INTERNAL",e[e.UNAVAILABLE=14]="UNAVAILABLE",e[e.DATA_LOSS=15]="DATA_LOSS",e[e.UNAUTHENTICATED=16]="UNAUTHENTICATED"})(Cb=x.RpcGrpcStatusCodeValues||(x.RpcGrpcStatusCodeValues={}))});var oh=l(Ar=>{"use strict";var Ob=Ar&&Ar.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),Pb=Ar&&Ar.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&Ob(t,e,r)};Object.defineProperty(Ar,"__esModule",{value:!0});Pb(sh(),Ar)});var uh=l(ie=>{"use strict";Object.defineProperty(ie,"__esModule",{value:!0});ie.TelemetrySdkLanguageValues=ie.OsTypeValues=ie.HostArchValues=ie.AwsEcsLaunchtypeValues=ie.CloudPlatformValues=ie.CloudProviderValues=ie.ResourceAttributes=void 0;ie.ResourceAttributes={CLOUD_PROVIDER:"cloud.provider",CLOUD_ACCOUNT_ID:"cloud.account.id",CLOUD_REGION:"cloud.region",CLOUD_AVAILABILITY_ZONE:"cloud.availability_zone",CLOUD_PLATFORM:"cloud.platform",AWS_ECS_CONTAINER_ARN:"aws.ecs.container.arn",AWS_ECS_CLUSTER_ARN:"aws.ecs.cluster.arn",AWS_ECS_LAUNCHTYPE:"aws.ecs.launchtype",AWS_ECS_TASK_ARN:"aws.ecs.task.arn",AWS_ECS_TASK_FAMILY:"aws.ecs.task.family",AWS_ECS_TASK_REVISION:"aws.ecs.task.revision",AWS_EKS_CLUSTER_ARN:"aws.eks.cluster.arn",AWS_LOG_GROUP_NAMES:"aws.log.group.names",AWS_LOG_GROUP_ARNS:"aws.log.group.arns",AWS_LOG_STREAM_NAMES:"aws.log.stream.names",AWS_LOG_STREAM_ARNS:"aws.log.stream.arns",CONTAINER_NAME:"container.name",CONTAINER_ID:"container.id",CONTAINER_RUNTIME:"container.runtime",CONTAINER_IMAGE_NAME:"container.image.name",CONTAINER_IMAGE_TAG:"container.image.tag",DEPLOYMENT_ENVIRONMENT:"deployment.environment",DEVICE_ID:"device.id",DEVICE_MODEL_IDENTIFIER:"device.model.identifier",DEVICE_MODEL_NAME:"device.model.name",FAAS_NAME:"faas.name",FAAS_ID:"faas.id",FAAS_VERSION:"faas.version",FAAS_INSTANCE:"faas.instance",FAAS_MAX_MEMORY:"faas.max_memory",HOST_ID:"host.id",HOST_NAME:"host.name",HOST_TYPE:"host.type",HOST_ARCH:"host.arch",HOST_IMAGE_NAME:"host.image.name",HOST_IMAGE_ID:"host.image.id",HOST_IMAGE_VERSION:"host.image.version",K8S_CLUSTER_NAME:"k8s.cluster.name",K8S_NODE_NAME:"k8s.node.name",K8S_NODE_UID:"k8s.node.uid",K8S_NAMESPACE_NAME:"k8s.namespace.name",K8S_POD_UID:"k8s.pod.uid",K8S_POD_NAME:"k8s.pod.name",K8S_CONTAINER_NAME:"k8s.container.name",K8S_REPLICASET_UID:"k8s.replicaset.uid",K8S_REPLICASET_NAME:"k8s.replicaset.name",K8S_DEPLOYMENT_UID:"k8s.deployment.uid",K8S_DEPLOYMENT_NAME:"k8s.deployment.name",K8S_STATEFULSET_UID:"k8s.statefulset.uid",K8S_STATEFULSET_NAME:"k8s.statefulset.name",K8S_DAEMONSET_UID:"k8s.daemonset.uid",K8S_DAEMONSET_NAME:"k8s.daemonset.name",K8S_JOB_UID:"k8s.job.uid",K8S_JOB_NAME:"k8s.job.name",K8S_CRONJOB_UID:"k8s.cronjob.uid",K8S_CRONJOB_NAME:"k8s.cronjob.name",OS_TYPE:"os.type",OS_DESCRIPTION:"os.description",OS_NAME:"os.name",OS_VERSION:"os.version",PROCESS_PID:"process.pid",PROCESS_EXECUTABLE_NAME:"process.executable.name",PROCESS_EXECUTABLE_PATH:"process.executable.path",PROCESS_COMMAND:"process.command",PROCESS_COMMAND_LINE:"process.command_line",PROCESS_COMMAND_ARGS:"process.command_args",PROCESS_OWNER:"process.owner",PROCESS_RUNTIME_NAME:"process.runtime.name",PROCESS_RUNTIME_VERSION:"process.runtime.version",PROCESS_RUNTIME_DESCRIPTION:"process.runtime.description",SERVICE_NAME:"service.name",SERVICE_NAMESPACE:"service.namespace",SERVICE_INSTANCE_ID:"service.instance.id",SERVICE_VERSION:"service.version",TELEMETRY_SDK_NAME:"telemetry.sdk.name",TELEMETRY_SDK_LANGUAGE:"telemetry.sdk.language",TELEMETRY_SDK_VERSION:"telemetry.sdk.version",TELEMETRY_AUTO_VERSION:"telemetry.auto.version",WEBENGINE_NAME:"webengine.name",WEBENGINE_VERSION:"webengine.version",WEBENGINE_DESCRIPTION:"webengine.description"};var Rb;(function(e){e.AWS="aws",e.AZURE="azure",e.GCP="gcp"})(Rb=ie.CloudProviderValues||(ie.CloudProviderValues={}));var Nb;(function(e){e.AWS_EC2="aws_ec2",e.AWS_ECS="aws_ecs",e.AWS_EKS="aws_eks",e.AWS_LAMBDA="aws_lambda",e.AWS_ELASTIC_BEANSTALK="aws_elastic_beanstalk",e.AZURE_VM="azure_vm",e.AZURE_CONTAINER_INSTANCES="azure_container_instances",e.AZURE_AKS="azure_aks",e.AZURE_FUNCTIONS="azure_functions",e.AZURE_APP_SERVICE="azure_app_service",e.GCP_COMPUTE_ENGINE="gcp_compute_engine",e.GCP_CLOUD_RUN="gcp_cloud_run",e.GCP_KUBERNETES_ENGINE="gcp_kubernetes_engine",e.GCP_CLOUD_FUNCTIONS="gcp_cloud_functions",e.GCP_APP_ENGINE="gcp_app_engine"})(Nb=ie.CloudPlatformValues||(ie.CloudPlatformValues={}));var Db;(function(e){e.EC2="ec2",e.FARGATE="fargate"})(Db=ie.AwsEcsLaunchtypeValues||(ie.AwsEcsLaunchtypeValues={}));var wb;(function(e){e.AMD64="amd64",e.ARM32="arm32",e.ARM64="arm64",e.IA64="ia64",e.PPC32="ppc32",e.PPC64="ppc64",e.X86="x86"})(wb=ie.HostArchValues||(ie.HostArchValues={}));var xb;(function(e){e.WINDOWS="windows",e.LINUX="linux",e.DARWIN="darwin",e.FREEBSD="freebsd",e.NETBSD="netbsd",e.OPENBSD="openbsd",e.DRAGONFLYBSD="dragonflybsd",e.HPUX="hpux",e.AIX="aix",e.SOLARIS="solaris",e.Z_OS="z_os"})(xb=ie.OsTypeValues||(ie.OsTypeValues={}));var Mb;(function(e){e.CPP="cpp",e.DOTNET="dotnet",e.ERLANG="erlang",e.GO="go",e.JAVA="java",e.NODEJS="nodejs",e.PHP="php",e.PYTHON="python",e.RUBY="ruby",e.WEBJS="webjs"})(Mb=ie.TelemetrySdkLanguageValues||(ie.TelemetrySdkLanguageValues={}))});var ch=l(Ir=>{"use strict";var Lb=Ir&&Ir.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),qb=Ir&&Ir.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&Lb(t,e,r)};Object.defineProperty(Ir,"__esModule",{value:!0});qb(uh(),Ir)});var In=l(Qt=>{"use strict";var jb=Qt&&Qt.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),lh=Qt&&Qt.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&jb(t,e,r)};Object.defineProperty(Qt,"__esModule",{value:!0});lh(oh(),Qt);lh(ch(),Qt)});var ph=l(Ss=>{"use strict";Object.defineProperty(Ss,"__esModule",{value:!0});Ss.SDK_INFO=void 0;var kb=Ts(),Bi=In();Ss.SDK_INFO={[Bi.ResourceAttributes.TELEMETRY_SDK_NAME]:"opentelemetry",[Bi.ResourceAttributes.PROCESS_RUNTIME_NAME]:"node",[Bi.ResourceAttributes.TELEMETRY_SDK_LANGUAGE]:Bi.TelemetrySdkLanguageValues.NODEJS,[Bi.ResourceAttributes.TELEMETRY_SDK_VERSION]:kb.VERSION}});var fh=l(As=>{"use strict";Object.defineProperty(As,"__esModule",{value:!0});As.unrefTimer=void 0;function Hb(e){e.unref()}As.unrefTimer=Hb});var dh=l(Ke=>{"use strict";var Ub=Ke&&Ke.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),bn=Ke&&Ke.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&Ub(t,e,r)};Object.defineProperty(Ke,"__esModule",{value:!0});bn(Jd(),Ke);bn(eh(),Ke);bn(ih(),Ke);bn(ah(),Ke);bn(ph(),Ke);bn(fh(),Ke)});var hc=l(br=>{"use strict";var Bb=br&&br.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),Gb=br&&br.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&Bb(t,e,r)};Object.defineProperty(br,"__esModule",{value:!0});Gb(dh(),br)});var vh=l(pe=>{"use strict";Object.defineProperty(pe,"__esModule",{value:!0});pe.isTimeInput=pe.isTimeInputHrTime=pe.hrTimeToMicroseconds=pe.hrTimeToMilliseconds=pe.hrTimeToNanoseconds=pe.hrTimeToTimeStamp=pe.hrTimeDuration=pe.timeInputToHrTime=pe.hrTime=void 0;var _c=hc(),vc=9,Gi=Math.pow(10,vc);function Is(e){let t=e/1e3,r=Math.trunc(t),n=Number((t-r).toFixed(vc))*Gi;return[r,n]}function hh(){let e=_c.otperformance.timeOrigin;if(typeof e!="number"){let t=_c.otperformance;e=t.timing&&t.timing.fetchStart}return e}function _h(e){let t=Is(hh()),r=Is(typeof e=="number"?e:_c.otperformance.now()),n=t[0]+r[0],i=t[1]+r[1];return i>Gi&&(i-=Gi,n+=1),[n,i]}pe.hrTime=_h;function Fb(e){if(gc(e))return e;if(typeof e=="number")return e<hh()?_h(e):Is(e);if(e instanceof Date)return Is(e.getTime());throw TypeError("Invalid input type")}pe.timeInputToHrTime=Fb;function Vb(e,t){let r=t[0]-e[0],n=t[1]-e[1];return n<0&&(r-=1,n+=Gi),[r,n]}pe.hrTimeDuration=Vb;function $b(e){let t=vc,r=`${"0".repeat(t)}${e[1]}Z`,n=r.substr(r.length-t-1);return new Date(e[0]*1e3).toISOString().replace("000Z",n)}pe.hrTimeToTimeStamp=$b;function zb(e){return e[0]*Gi+e[1]}pe.hrTimeToNanoseconds=zb;function Kb(e){return Math.round(e[0]*1e3+e[1]/1e6)}pe.hrTimeToMilliseconds=Kb;function Xb(e){return Math.round(e[0]*1e6+e[1]/1e3)}pe.hrTimeToMicroseconds=Xb;function gc(e){return Array.isArray(e)&&e.length===2&&typeof e[0]=="number"&&typeof e[1]=="number"}pe.isTimeInputHrTime=gc;function Yb(e){return gc(e)||typeof e=="number"||e instanceof Date}pe.isTimeInput=Yb});var Eh=l(gh=>{"use strict";Object.defineProperty(gh,"__esModule",{value:!0})});var mh=l(Fi=>{"use strict";Object.defineProperty(Fi,"__esModule",{value:!0});Fi.ExportResultCode=void 0;var Qb;(function(e){e[e.SUCCESS=0]="SUCCESS",e[e.FAILED=1]="FAILED"})(Qb=Fi.ExportResultCode||(Fi.ExportResultCode={}))});var Sh=l(bs=>{"use strict";Object.defineProperty(bs,"__esModule",{value:!0});bs.CompositePropagator=void 0;var yh=z(),Th=class{constructor(t={}){var r;this._propagators=(r=t.propagators)!==null&&r!==void 0?r:[],this._fields=Array.from(new Set(this._propagators.map(n=>typeof n.fields=="function"?n.fields():[]).reduce((n,i)=>n.concat(i),[])))}inject(t,r,n){for(let i of this._propagators)try{i.inject(t,r,n)}catch(a){yh.diag.warn(`Failed to inject with ${i.constructor.name}. Err: ${a.message}`)}}extract(t,r,n){return this._propagators.reduce((i,a)=>{try{return a.extract(i,r,n)}catch(s){yh.diag.warn(`Failed to inject with ${a.constructor.name}. Err: ${s.message}`)}return i},t)}fields(){return this._fields.slice()}};bs.CompositePropagator=Th});var Ah=l(Cn=>{"use strict";Object.defineProperty(Cn,"__esModule",{value:!0});Cn.validateValue=Cn.validateKey=void 0;var Ec="[_0-9a-z-*/]",Wb=`[a-z]${Ec}{0,255}`,Zb=`[a-z0-9]${Ec}{0,240}@[a-z]${Ec}{0,13}`,Jb=new RegExp(`^(?:${Wb}|${Zb})$`),eC=/^[ -~]{0,255}[!-~]$/,tC=/,|=/;function rC(e){return Jb.test(e)}Cn.validateKey=rC;function nC(e){return eC.test(e)&&!tC.test(e)}Cn.validateValue=nC});var mc=l(Os=>{"use strict";Object.defineProperty(Os,"__esModule",{value:!0});Os.TraceState=void 0;var Ih=Ah(),bh=32,iC=512,Ch=",",Oh="=",Cs=class{constructor(t){this._internalState=new Map,t&&this._parse(t)}set(t,r){let n=this._clone();return n._internalState.has(t)&&n._internalState.delete(t),n._internalState.set(t,r),n}unset(t){let r=this._clone();return r._internalState.delete(t),r}get(t){return this._internalState.get(t)}serialize(){return this._keys().reduce((t,r)=>(t.push(r+Oh+this.get(r)),t),[]).join(Ch)}_parse(t){t.length>iC||(this._internalState=t.split(Ch).reverse().reduce((r,n)=>{let i=n.trim(),a=i.indexOf(Oh);if(a!==-1){let s=i.slice(0,a),o=i.slice(a+1,n.length);Ih.validateKey(s)&&Ih.validateValue(o)&&r.set(s,o)}return r},new Map),this._internalState.size>bh&&(this._internalState=new Map(Array.from(this._internalState.entries()).reverse().slice(0,bh))))}_keys(){return Array.from(this._internalState.keys()).reverse()}_clone(){let t=new Cs;return t._internalState=new Map(this._internalState),t}};Os.TraceState=Cs});var Nh=l(be=>{"use strict";Object.defineProperty(be,"__esModule",{value:!0});be.HttpTraceContextPropagator=be.parseTraceParent=be.TRACE_STATE_HEADER=be.TRACE_PARENT_HEADER=void 0;var Ps=z(),aC=fs(),sC=mc();be.TRACE_PARENT_HEADER="traceparent";be.TRACE_STATE_HEADER="tracestate";var oC="00",uC="(?!ff)[\\da-f]{2}",cC="(?![0]{32})[\\da-f]{32}",lC="(?![0]{16})[\\da-f]{16}",pC="[\\da-f]{2}",fC=new RegExp(`^\\s?(${uC})-(${cC})-(${lC})-(${pC})(-.*)?\\s?$`);function Ph(e){let t=fC.exec(e);return!t||t[1]==="00"&&t[5]?null:{traceId:t[2],spanId:t[3],traceFlags:parseInt(t[4],16)}}be.parseTraceParent=Ph;var Rh=class{inject(t,r,n){let i=Ps.trace.getSpanContext(t);if(!i||aC.isTracingSuppressed(t)||!Ps.isSpanContextValid(i))return;let a=`${oC}-${i.traceId}-${i.spanId}-0${Number(i.traceFlags||Ps.TraceFlags.NONE).toString(16)}`;n.set(r,be.TRACE_PARENT_HEADER,a),i.traceState&&n.set(r,be.TRACE_STATE_HEADER,i.traceState.serialize())}extract(t,r,n){let i=n.get(r,be.TRACE_PARENT_HEADER);if(!i)return t;let a=Array.isArray(i)?i[0]:i;if(typeof a!="string")return t;let s=Ph(a);if(!s)return t;s.isRemote=!0;let o=n.get(r,be.TRACE_STATE_HEADER);if(o){let u=Array.isArray(o)?o.join(","):o;s.traceState=new sC.TraceState(typeof u=="string"?u:void 0)}return Ps.trace.setSpanContext(t,s)}fields(){return[be.TRACE_PARENT_HEADER,be.TRACE_STATE_HEADER]}};be.HttpTraceContextPropagator=Rh});var wh=l(Dh=>{"use strict";Object.defineProperty(Dh,"__esModule",{value:!0})});var xh=l(it=>{"use strict";Object.defineProperty(it,"__esModule",{value:!0});it.getRPCMetadata=it.deleteRPCMetadata=it.setRPCMetadata=it.RPCType=void 0;var dC=z(),yc=dC.createContextKey("OpenTelemetry SDK Context Key RPC_METADATA"),hC;(function(e){e.HTTP="http"})(hC=it.RPCType||(it.RPCType={}));function _C(e,t){return e.setValue(yc,t)}it.setRPCMetadata=_C;function vC(e){return e.deleteValue(yc)}it.deleteRPCMetadata=vC;function gC(e){return e.getValue(yc)}it.getRPCMetadata=gC});var Tc=l(Rs=>{"use strict";Object.defineProperty(Rs,"__esModule",{value:!0});Rs.AlwaysOffSampler=void 0;var EC=z(),Mh=class{shouldSample(){return{decision:EC.SamplingDecision.NOT_RECORD}}toString(){return"AlwaysOffSampler"}};Rs.AlwaysOffSampler=Mh});var Sc=l(Ns=>{"use strict";Object.defineProperty(Ns,"__esModule",{value:!0});Ns.AlwaysOnSampler=void 0;var mC=z(),Lh=class{shouldSample(){return{decision:mC.SamplingDecision.RECORD_AND_SAMPLED}}toString(){return"AlwaysOnSampler"}};Ns.AlwaysOnSampler=Lh});var kh=l(ws=>{"use strict";Object.defineProperty(ws,"__esModule",{value:!0});ws.ParentBasedSampler=void 0;var Ds=z(),yC=pc(),qh=Tc(),Ac=Sc(),jh=class{constructor(t){var r,n,i,a;this._root=t.root,this._root||(yC.globalErrorHandler(new Error("ParentBasedSampler must have a root sampler configured")),this._root=new Ac.AlwaysOnSampler),this._remoteParentSampled=(r=t.remoteParentSampled)!==null&&r!==void 0?r:new Ac.AlwaysOnSampler,this._remoteParentNotSampled=(n=t.remoteParentNotSampled)!==null&&n!==void 0?n:new qh.AlwaysOffSampler,this._localParentSampled=(i=t.localParentSampled)!==null&&i!==void 0?i:new Ac.AlwaysOnSampler,this._localParentNotSampled=(a=t.localParentNotSampled)!==null&&a!==void 0?a:new qh.AlwaysOffSampler}shouldSample(t,r,n,i,a,s){let o=Ds.trace.getSpanContext(t);return!o||!Ds.isSpanContextValid(o)?this._root.shouldSample(t,r,n,i,a,s):o.isRemote?o.traceFlags&Ds.TraceFlags.SAMPLED?this._remoteParentSampled.shouldSample(t,r,n,i,a,s):this._remoteParentNotSampled.shouldSample(t,r,n,i,a,s):o.traceFlags&Ds.TraceFlags.SAMPLED?this._localParentSampled.shouldSample(t,r,n,i,a,s):this._localParentNotSampled.shouldSample(t,r,n,i,a,s)}toString(){return`ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`}};ws.ParentBasedSampler=jh});var Uh=l(xs=>{"use strict";Object.defineProperty(xs,"__esModule",{value:!0});xs.TraceIdRatioBasedSampler=void 0;var Ic=z(),Hh=class{constructor(t=0){this._ratio=t,this._ratio=this._normalize(t),this._upperBound=Math.floor(this._ratio*4294967295)}shouldSample(t,r){return{decision:Ic.isValidTraceId(r)&&this._accumulate(r)<this._upperBound?Ic.SamplingDecision.RECORD_AND_SAMPLED:Ic.SamplingDecision.NOT_RECORD}}toString(){return`TraceIdRatioBased{${this._ratio}}`}_normalize(t){return typeof t!="number"||isNaN(t)?0:t>=1?1:t<=0?0:t}_accumulate(t){let r=0;for(let n=0;n<t.length/8;n++){let i=n*8,a=parseInt(t.slice(i,i+8),16);r=(r^a)>>>0}return r}};xs.TraceIdRatioBasedSampler=Hh});var Gh=l(On=>{"use strict";Object.defineProperty(On,"__esModule",{value:!0});On.isUrlIgnored=On.urlMatches=void 0;function Bh(e,t){return typeof t=="string"?e===t:t.test(e)}On.urlMatches=Bh;function TC(e,t){if(!t)return!1;for(let r of t)if(Bh(e,r))return!0;return!1}On.isUrlIgnored=TC});var Fh=l(Ms=>{"use strict";Object.defineProperty(Ms,"__esModule",{value:!0});Ms.isWrapped=void 0;function SC(e){return typeof e=="function"&&typeof e.__original=="function"&&typeof e.__unwrap=="function"&&e.__wrapped===!0}Ms.isWrapped=SC});var Xe=l(M=>{"use strict";var AC=M&&M.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),Y=M&&M.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&AC(t,e,r)};Object.defineProperty(M,"__esModule",{value:!0});M.baggageUtils=void 0;Y(Kd(),M);Y(Qd(),M);Y(pc(),M);Y(lc(),M);Y(vh(),M);Y(Eh(),M);Y(mh(),M);Y(Ts(),M);M.baggageUtils=oc();Y(hc(),M);Y(Sh(),M);Y(Nh(),M);Y(wh(),M);Y(xh(),M);Y(Tc(),M);Y(Sc(),M);Y(kh(),M);Y(Uh(),M);Y(fs(),M);Y(mc(),M);Y(dc(),M);Y(fc(),M);Y(Gh(),M);Y(Fh(),M);Y(Ts(),M)});var Vh=l(Ls=>{"use strict";Object.defineProperty(Ls,"__esModule",{value:!0});Ls.ExceptionEventName=void 0;Ls.ExceptionEventName="exception"});var bc=l(qs=>{"use strict";Object.defineProperty(qs,"__esModule",{value:!0});qs.Span=void 0;var Wt=z(),ft=Xe(),Cr=In(),IC=Vh(),$h=class{constructor(t,r,n,i,a,s,o=[],u=ft.hrTime()){this.attributes={},this.links=[],this.events=[],this.status={code:Wt.SpanStatusCode.UNSET},this.endTime=[0,0],this._ended=!1,this._duration=[-1,-1],this.name=n,this._spanContext=i,this.parentSpanId=s,this.kind=a,this.links=o,this.startTime=ft.timeInputToHrTime(u),this.resource=t.resource,this.instrumentationLibrary=t.instrumentationLibrary,this._spanLimits=t.getSpanLimits(),this._spanProcessor=t.getActiveSpanProcessor(),this._spanProcessor.onStart(this,r)}spanContext(){return this._spanContext}setAttribute(t,r){return r==null||this._isSpanEnded()?this:t.length===0?(Wt.diag.warn(`Invalid attribute key: ${t}`),this):ft.isAttributeValue(r)?Object.keys(this.attributes).length>=this._spanLimits.attributeCountLimit&&!Object.prototype.hasOwnProperty.call(this.attributes,t)?this:(this.attributes[t]=r,this):(Wt.diag.warn(`Invalid attribute value set for key: ${t}`),this)}setAttributes(t){for(let[r,n]of Object.entries(t))this.setAttribute(r,n);return this}addEvent(t,r,n){return this._isSpanEnded()?this:(this.events.length>=this._spanLimits.eventCountLimit&&(Wt.diag.warn("Dropping extra events."),this.events.shift()),ft.isTimeInput(r)&&(typeof n=="undefined"&&(n=r),r=void 0),typeof n=="undefined"&&(n=ft.hrTime()),this.events.push({name:t,attributes:r,time:ft.timeInputToHrTime(n)}),this)}setStatus(t){return this._isSpanEnded()?this:(this.status=t,this)}updateName(t){return this._isSpanEnded()?this:(this.name=t,this)}end(t=ft.hrTime()){if(this._isSpanEnded()){Wt.diag.error("You can only call end() on a span once.");return}this._ended=!0,this.endTime=ft.timeInputToHrTime(t),this._duration=ft.hrTimeDuration(this.startTime,this.endTime),this._duration[0]<0&&Wt.diag.warn("Inconsistent start and end time, startTime > endTime",this.startTime,this.endTime),this._spanProcessor.onEnd(this)}isRecording(){return this._ended===!1}recordException(t,r=ft.hrTime()){let n={};typeof t=="string"?n[Cr.SemanticAttributes.EXCEPTION_MESSAGE]=t:t&&(t.code?n[Cr.SemanticAttributes.EXCEPTION_TYPE]=t.code.toString():t.name&&(n[Cr.SemanticAttributes.EXCEPTION_TYPE]=t.name),t.message&&(n[Cr.SemanticAttributes.EXCEPTION_MESSAGE]=t.message),t.stack&&(n[Cr.SemanticAttributes.EXCEPTION_STACKTRACE]=t.stack)),n[Cr.SemanticAttributes.EXCEPTION_TYPE]||n[Cr.SemanticAttributes.EXCEPTION_MESSAGE]?this.addEvent(IC.ExceptionEventName,n,r):Wt.diag.warn(`Failed to record an exception ${t}`)}get duration(){return this._duration}get ended(){return this._ended}_isSpanEnded(){return this._ended&&Wt.diag.warn("Can not execute the operation on ended Span {traceId: %s, spanId: %s}",this._spanContext.traceId,this._spanContext.spanId),this._ended}};qs.Span=$h});var Cc=l(Rn=>{"use strict";Object.defineProperty(Rn,"__esModule",{value:!0});Rn.buildSamplerFromEnv=Rn.DEFAULT_CONFIG=void 0;var js=z(),ae=Xe(),bC=ae.getEnv(),CC=ae.TracesSamplerValues.AlwaysOn;Rn.DEFAULT_CONFIG={sampler:zh(bC),forceFlushTimeoutMillis:3e4,spanLimits:{attributeCountLimit:ae.getEnv().OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT,linkCountLimit:ae.getEnv().OTEL_SPAN_LINK_COUNT_LIMIT,eventCountLimit:ae.getEnv().OTEL_SPAN_EVENT_COUNT_LIMIT}};function zh(e=ae.getEnv()){switch(e.OTEL_TRACES_SAMPLER){case ae.TracesSamplerValues.AlwaysOn:return new ae.AlwaysOnSampler;case ae.TracesSamplerValues.AlwaysOff:return new ae.AlwaysOffSampler;case ae.TracesSamplerValues.ParentBasedAlwaysOn:return new ae.ParentBasedSampler({root:new ae.AlwaysOnSampler});case ae.TracesSamplerValues.ParentBasedAlwaysOff:return new ae.ParentBasedSampler({root:new ae.AlwaysOffSampler});case ae.TracesSamplerValues.TraceIdRatio:return new ae.TraceIdRatioBasedSampler(Kh(e));case ae.TracesSamplerValues.ParentBasedTraceIdRatio:return new ae.ParentBasedSampler({root:new ae.TraceIdRatioBasedSampler(Kh(e))});default:return js.diag.error(`OTEL_TRACES_SAMPLER value "${e.OTEL_TRACES_SAMPLER} invalid, defaulting to ${CC}".`),new ae.AlwaysOnSampler}}Rn.buildSamplerFromEnv=zh;var Pn=1;function Kh(e){if(e.OTEL_TRACES_SAMPLER_ARG===void 0||e.OTEL_TRACES_SAMPLER_ARG==="")return js.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${Pn}.`),Pn;let t=Number(e.OTEL_TRACES_SAMPLER_ARG);return isNaN(t)?(js.diag.error(`OTEL_TRACES_SAMPLER_ARG=${e.OTEL_TRACES_SAMPLER_ARG} was given, but it is invalid, defaulting to ${Pn}.`),Pn):t<0||t>1?(js.diag.error(`OTEL_TRACES_SAMPLER_ARG=${e.OTEL_TRACES_SAMPLER_ARG} was given, but it is out of range ([0..1]), defaulting to ${Pn}.`),Pn):t}});var Xh=l(ks=>{"use strict";Object.defineProperty(ks,"__esModule",{value:!0});ks.mergeConfig=void 0;var Oc=Cc();function OC(e){let t={sampler:Oc.buildSamplerFromEnv()},r=Object.assign({},Oc.DEFAULT_CONFIG,t,e);return r.spanLimits=Object.assign({},Oc.DEFAULT_CONFIG.spanLimits,e.spanLimits||{}),r}ks.mergeConfig=OC});var Qh=l(Hs=>{"use strict";Object.defineProperty(Hs,"__esModule",{value:!0});Hs.Tracer=void 0;var ge=z(),Pc=Xe(),PC=bc(),RC=Xh(),Yh=class{constructor(t,r,n){this._tracerProvider=n;let i=RC.mergeConfig(r);this._sampler=i.sampler,this._spanLimits=i.spanLimits,this._idGenerator=r.idGenerator||new Pc.RandomIdGenerator,this.resource=n.resource,this.instrumentationLibrary=t}startSpan(t,r={},n=ge.context.active()){var i,a;if(Pc.isTracingSuppressed(n))return ge.diag.debug("Instrumentation suppressed, returning Noop Span"),ge.trace.wrapSpanContext(ge.INVALID_SPAN_CONTEXT);let s=NC(r,n),o=this._idGenerator.generateSpanId(),u,c,p;!s||!ge.trace.isSpanContextValid(s)?u=this._idGenerator.generateTraceId():(u=s.traceId,c=s.traceState,p=s.spanId);let f=(i=r.kind)!==null&&i!==void 0?i:ge.SpanKind.INTERNAL,d=(a=r.links)!==null&&a!==void 0?a:[],h=Pc.sanitizeAttributes(r.attributes),E=this._sampler.shouldSample(r.root?ge.trace.setSpanContext(n,ge.INVALID_SPAN_CONTEXT):n,u,t,f,h,d),S=E.decision===ge.SamplingDecision.RECORD_AND_SAMPLED?ge.TraceFlags.SAMPLED:ge.TraceFlags.NONE,j={traceId:u,spanId:o,traceFlags:S,traceState:c};if(E.decision===ge.SamplingDecision.NOT_RECORD)return ge.diag.debug("Recording is off, propagating context in a non-recording span"),ge.trace.wrapSpanContext(j);let oe=new PC.Span(this,n,t,j,f,p,d,r.startTime);return oe.setAttributes(Object.assign(h,E.attributes)),oe}startActiveSpan(t,r,n,i){let a,s,o;if(arguments.length<2)return;arguments.length===2?o=r:arguments.length===3?(a=r,o=n):(a=r,s=n,o=i);let u=s!=null?s:ge.context.active(),c=this.startSpan(t,a,u),p=ge.trace.setSpan(u,c);return ge.context.with(p,o,void 0,c)}getSpanLimits(){return this._spanLimits}getActiveSpanProcessor(){return this._tracerProvider.getActiveSpanProcessor()}};Hs.Tracer=Yh;function NC(e,t){if(!e.root)return ge.trace.getSpanContext(t)}});var Wh=l(Us=>{"use strict";Object.defineProperty(Us,"__esModule",{value:!0});Us.defaultServiceName=void 0;function DC(){return`unknown_service:${process.argv0}`}Us.defaultServiceName=DC});var Jh=l(Bs=>{"use strict";Object.defineProperty(Bs,"__esModule",{value:!0});Bs.detectResources=void 0;var Zh=Nc(),Rc=z(),wC=__webpack_require__(/*! util */ "util"),xC=async(e={})=>{let t=Object.assign(e),r=await Promise.all((t.detectors||[]).map(async n=>{try{let i=await n.detect(t);return Rc.diag.debug(`${n.constructor.name} found resource.`,i),i}catch(i){return Rc.diag.debug(`${n.constructor.name} failed: ${i.message}`),Zh.Resource.empty()}}));return MC(r),r.reduce((n,i)=>n.merge(i),Zh.Resource.empty())};Bs.detectResources=xC;var MC=e=>{e.forEach(t=>{if(Object.keys(t.attributes).length>0){let r=wC.inspect(t.attributes,{depth:2,breakLength:1/0,sorted:!0,compact:!1});Rc.diag.verbose(r)}})}});var t_=l(Gs=>{"use strict";Object.defineProperty(Gs,"__esModule",{value:!0});Gs.envDetector=void 0;var LC=z(),qC=Xe(),jC=In(),kC=Fs(),e_=class{constructor(){this._MAX_LENGTH=255,this._COMMA_SEPARATOR=",",this._LABEL_KEY_VALUE_SPLITTER="=",this._ERROR_MESSAGE_INVALID_CHARS="should be a ASCII string with a length greater than 0 and not exceed "+this._MAX_LENGTH+" characters.",this._ERROR_MESSAGE_INVALID_VALUE="should be a ASCII string with a length not exceed "+this._MAX_LENGTH+" characters."}async detect(t){let r={},n=qC.getEnv(),i=n.OTEL_RESOURCE_ATTRIBUTES,a=n.OTEL_SERVICE_NAME;if(i)try{let s=this._parseResourceAttributes(i);Object.assign(r,s)}catch(s){LC.diag.debug(`EnvDetector failed: ${s.message}`)}return a&&(r[jC.ResourceAttributes.SERVICE_NAME]=a),new kC.Resource(r)}_parseResourceAttributes(t){if(!t)return{};let r={},n=t.split(this._COMMA_SEPARATOR,-1);for(let i of n){let a=i.split(this._LABEL_KEY_VALUE_SPLITTER,-1);if(a.length!==2)continue;let[s,o]=a;if(s=s.trim(),o=o.trim().split('^"|"$').join(""),!this._isValidAndNotEmpty(s))throw new Error(`Attribute key ${this._ERROR_MESSAGE_INVALID_CHARS}`);if(!this._isValid(o))throw new Error(`Attribute value ${this._ERROR_MESSAGE_INVALID_VALUE}`);r[s]=o}return r}_isValid(t){return t.length<=this._MAX_LENGTH&&this._isPrintableString(t)}_isPrintableString(t){for(let r=0;r<t.length;r++){let n=t.charAt(r);if(n<=" "||n>="~")return!1}return!0}_isValidAndNotEmpty(t){return t.length>0&&this._isValid(t)}};Gs.envDetector=new e_});var i_=l(Vs=>{"use strict";Object.defineProperty(Vs,"__esModule",{value:!0});Vs.processDetector=void 0;var HC=z(),Zt=In(),r_=Fs(),n_=class{async detect(t){let r={[Zt.ResourceAttributes.PROCESS_PID]:process.pid,[Zt.ResourceAttributes.PROCESS_EXECUTABLE_NAME]:process.title||"",[Zt.ResourceAttributes.PROCESS_COMMAND]:process.argv[1]||"",[Zt.ResourceAttributes.PROCESS_COMMAND_LINE]:process.argv.join(" ")||""};return this._getResourceAttributes(r,t)}_getResourceAttributes(t,r){return t[Zt.ResourceAttributes.PROCESS_EXECUTABLE_NAME]===""||t[Zt.ResourceAttributes.PROCESS_EXECUTABLE_PATH]===""||t[Zt.ResourceAttributes.PROCESS_COMMAND]===""||t[Zt.ResourceAttributes.PROCESS_COMMAND_LINE]===""?(HC.diag.debug("ProcessDetector failed: Unable to find required process resources. "),r_.Resource.empty()):new r_.Resource(Object.assign({},t))}};Vs.processDetector=new n_});var s_=l(Jt=>{"use strict";var UC=Jt&&Jt.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),a_=Jt&&Jt.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&UC(t,e,r)};Object.defineProperty(Jt,"__esModule",{value:!0});a_(t_(),Jt);a_(i_(),Jt)});var o_=l(Ot=>{"use strict";var BC=Ot&&Ot.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),Dc=Ot&&Ot.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&BC(t,e,r)};Object.defineProperty(Ot,"__esModule",{value:!0});Dc(Wh(),Ot);Dc(Jh(),Ot);Dc(s_(),Ot)});var wc=l(Or=>{"use strict";var GC=Or&&Or.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),FC=Or&&Or.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&GC(t,e,r)};Object.defineProperty(Or,"__esModule",{value:!0});FC(o_(),Or)});var Nc=l($s=>{"use strict";Object.defineProperty($s,"__esModule",{value:!0});$s.Resource=void 0;var Pr=In(),xc=Xe(),VC=wc(),er=class{constructor(t){this.attributes=t}static empty(){return er.EMPTY}static default(){return new er({[Pr.ResourceAttributes.SERVICE_NAME]:VC.defaultServiceName(),[Pr.ResourceAttributes.TELEMETRY_SDK_LANGUAGE]:xc.SDK_INFO[Pr.ResourceAttributes.TELEMETRY_SDK_LANGUAGE],[Pr.ResourceAttributes.TELEMETRY_SDK_NAME]:xc.SDK_INFO[Pr.ResourceAttributes.TELEMETRY_SDK_NAME],[Pr.ResourceAttributes.TELEMETRY_SDK_VERSION]:xc.SDK_INFO[Pr.ResourceAttributes.TELEMETRY_SDK_VERSION]})}merge(t){if(!t||!Object.keys(t.attributes).length)return this;let r=Object.assign({},this.attributes,t.attributes);return new er(r)}};$s.Resource=er;er.EMPTY=new er({})});var c_=l(u_=>{"use strict";Object.defineProperty(u_,"__esModule",{value:!0})});var p_=l(l_=>{"use strict";Object.defineProperty(l_,"__esModule",{value:!0})});var Fs=l(dt=>{"use strict";var $C=dt&&dt.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),zs=dt&&dt.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&$C(t,e,r)};Object.defineProperty(dt,"__esModule",{value:!0});zs(Nc(),dt);zs(wc(),dt);zs(c_(),dt);zs(p_(),dt)});var d_=l(Ks=>{"use strict";Object.defineProperty(Ks,"__esModule",{value:!0});Ks.MultiSpanProcessor=void 0;var zC=Xe(),f_=class{constructor(t){this._spanProcessors=t}forceFlush(){let t=[];for(let r of this._spanProcessors)t.push(r.forceFlush());return new Promise(r=>{Promise.all(t).then(()=>{r()}).catch(n=>{zC.globalErrorHandler(n||new Error("MultiSpanProcessor: forceFlush failed")),r()})})}onStart(t,r){for(let n of this._spanProcessors)n.onStart(t,r)}onEnd(t){for(let r of this._spanProcessors)r.onEnd(t)}shutdown(){let t=[];for(let r of this._spanProcessors)t.push(r.shutdown());return new Promise((r,n)=>{Promise.all(t).then(()=>{r()},n)})}};Ks.MultiSpanProcessor=f_});var Mc=l(Xs=>{"use strict";Object.defineProperty(Xs,"__esModule",{value:!0});Xs.NoopSpanProcessor=void 0;var h_=class{onStart(t,r){}onEnd(t){}shutdown(){return Promise.resolve()}forceFlush(){return Promise.resolve()}};Xs.NoopSpanProcessor=h_});var F_=l((Xi,wn)=>{var KC=200,__="__lodash_hash_undefined__",XC=800,YC=16,v_=9007199254740991,g_="[object Arguments]",QC="[object Array]",WC="[object AsyncFunction]",ZC="[object Boolean]",JC="[object Date]",eO="[object Error]",E_="[object Function]",tO="[object GeneratorFunction]",rO="[object Map]",nO="[object Number]",iO="[object Null]",m_="[object Object]",aO="[object Proxy]",sO="[object RegExp]",oO="[object Set]",uO="[object String]",cO="[object Undefined]",lO="[object WeakMap]",pO="[object ArrayBuffer]",fO="[object DataView]",dO="[object Float32Array]",hO="[object Float64Array]",_O="[object Int8Array]",vO="[object Int16Array]",gO="[object Int32Array]",EO="[object Uint8Array]",mO="[object Uint8ClampedArray]",yO="[object Uint16Array]",TO="[object Uint32Array]",SO=/[\\^$.*+?()[\]{}|]/g,AO=/^\[object .+?Constructor\]$/,IO=/^(?:0|[1-9]\d*)$/,K={};K[dO]=K[hO]=K[_O]=K[vO]=K[gO]=K[EO]=K[mO]=K[yO]=K[TO]=!0;K[g_]=K[QC]=K[pO]=K[ZC]=K[fO]=K[JC]=K[eO]=K[E_]=K[rO]=K[nO]=K[m_]=K[sO]=K[oO]=K[uO]=K[lO]=!1;var y_=typeof global=="object"&&global&&global.Object===Object&&global,bO=typeof self=="object"&&self&&self.Object===Object&&self,Vi=y_||bO||Function("return this")(),T_=typeof Xi=="object"&&Xi&&!Xi.nodeType&&Xi,$i=T_&&typeof wn=="object"&&wn&&!wn.nodeType&&wn,S_=$i&&$i.exports===T_,Lc=S_&&y_.process,A_=function(){try{var e=$i&&$i.require&&$i.require("util").types;return e||Lc&&Lc.binding&&Lc.binding("util")}catch(t){}}(),I_=A_&&A_.isTypedArray;function CO(e,t,r){switch(r.length){case 0:return e.call(t);case 1:return e.call(t,r[0]);case 2:return e.call(t,r[0],r[1]);case 3:return e.call(t,r[0],r[1],r[2])}return e.apply(t,r)}function OO(e,t){for(var r=-1,n=Array(e);++r<e;)n[r]=t(r);return n}function PO(e){return function(t){return e(t)}}function RO(e,t){return e==null?void 0:e[t]}function NO(e,t){return function(r){return e(t(r))}}var DO=Array.prototype,wO=Function.prototype,Ys=Object.prototype,qc=Vi["__core-js_shared__"],Qs=wO.toString,Pt=Ys.hasOwnProperty,b_=function(){var e=/[^.]+$/.exec(qc&&qc.keys&&qc.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),C_=Ys.toString,xO=Qs.call(Object),MO=RegExp("^"+Qs.call(Pt).replace(SO,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Ws=S_?Vi.Buffer:void 0,O_=Vi.Symbol,P_=Vi.Uint8Array,R_=Ws?Ws.allocUnsafe:void 0,N_=NO(Object.getPrototypeOf,Object),D_=Object.create,LO=Ys.propertyIsEnumerable,qO=DO.splice,Rr=O_?O_.toStringTag:void 0,Zs=function(){try{var e=Hc(Object,"defineProperty");return e({},"",{}),e}catch(t){}}(),jO=Ws?Ws.isBuffer:void 0,w_=Math.max,kO=Date.now,x_=Hc(Vi,"Map"),zi=Hc(Object,"create"),HO=function(){function e(){}return function(t){if(!Dr(t))return{};if(D_)return D_(t);e.prototype=t;var r=new e;return e.prototype=void 0,r}}();function Nr(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function UO(){this.__data__=zi?zi(null):{},this.size=0}function BO(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}function GO(e){var t=this.__data__;if(zi){var r=t[e];return r===__?void 0:r}return Pt.call(t,e)?t[e]:void 0}function FO(e){var t=this.__data__;return zi?t[e]!==void 0:Pt.call(t,e)}function VO(e,t){var r=this.__data__;return this.size+=this.has(e)?0:1,r[e]=zi&&t===void 0?__:t,this}Nr.prototype.clear=UO;Nr.prototype.delete=BO;Nr.prototype.get=GO;Nr.prototype.has=FO;Nr.prototype.set=VO;function Rt(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function $O(){this.__data__=[],this.size=0}function zO(e){var t=this.__data__,r=Js(t,e);if(r<0)return!1;var n=t.length-1;return r==n?t.pop():qO.call(t,r,1),--this.size,!0}function KO(e){var t=this.__data__,r=Js(t,e);return r<0?void 0:t[r][1]}function XO(e){return Js(this.__data__,e)>-1}function YO(e,t){var r=this.__data__,n=Js(r,e);return n<0?(++this.size,r.push([e,t])):r[n][1]=t,this}Rt.prototype.clear=$O;Rt.prototype.delete=zO;Rt.prototype.get=KO;Rt.prototype.has=XO;Rt.prototype.set=YO;function Nn(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function QO(){this.size=0,this.__data__={hash:new Nr,map:new(x_||Rt),string:new Nr}}function WO(e){var t=to(this,e).delete(e);return this.size-=t?1:0,t}function ZO(e){return to(this,e).get(e)}function JO(e){return to(this,e).has(e)}function eP(e,t){var r=to(this,e),n=r.size;return r.set(e,t),this.size+=r.size==n?0:1,this}Nn.prototype.clear=QO;Nn.prototype.delete=WO;Nn.prototype.get=ZO;Nn.prototype.has=JO;Nn.prototype.set=eP;function Dn(e){var t=this.__data__=new Rt(e);this.size=t.size}function tP(){this.__data__=new Rt,this.size=0}function rP(e){var t=this.__data__,r=t.delete(e);return this.size=t.size,r}function nP(e){return this.__data__.get(e)}function iP(e){return this.__data__.has(e)}function aP(e,t){var r=this.__data__;if(r instanceof Rt){var n=r.__data__;if(!x_||n.length<KC-1)return n.push([e,t]),this.size=++r.size,this;r=this.__data__=new Nn(n)}return r.set(e,t),this.size=r.size,this}Dn.prototype.clear=tP;Dn.prototype.delete=rP;Dn.prototype.get=nP;Dn.prototype.has=iP;Dn.prototype.set=aP;function sP(e,t){var r=Gc(e),n=!r&&Bc(e),i=!r&&!n&&k_(e),a=!r&&!n&&!i&&U_(e),s=r||n||i||a,o=s?OO(e.length,String):[],u=o.length;for(var c in e)(t||Pt.call(e,c))&&!(s&&(c=="length"||i&&(c=="offset"||c=="parent")||a&&(c=="buffer"||c=="byteLength"||c=="byteOffset")||q_(c,u)))&&o.push(c);return o}function jc(e,t,r){(r!==void 0&&!ro(e[t],r)||r===void 0&&!(t in e))&&kc(e,t,r)}function oP(e,t,r){var n=e[t];(!(Pt.call(e,t)&&ro(n,r))||r===void 0&&!(t in e))&&kc(e,t,r)}function Js(e,t){for(var r=e.length;r--;)if(ro(e[r][0],t))return r;return-1}function kc(e,t,r){t=="__proto__"&&Zs?Zs(e,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):e[t]=r}var uP=TP();function eo(e){return e==null?e===void 0?cO:iO:Rr&&Rr in Object(e)?SP(e):PP(e)}function M_(e){return Ki(e)&&eo(e)==g_}function cP(e){if(!Dr(e)||CP(e))return!1;var t=Vc(e)?MO:AO;return t.test(wP(e))}function lP(e){return Ki(e)&&H_(e.length)&&!!K[eo(e)]}function pP(e){if(!Dr(e))return OP(e);var t=j_(e),r=[];for(var n in e)n=="constructor"&&(t||!Pt.call(e,n))||r.push(n);return r}function L_(e,t,r,n,i){e!==t&&uP(t,function(a,s){if(i||(i=new Dn),Dr(a))fP(e,t,s,r,L_,n,i);else{var o=n?n(Uc(e,s),a,s+"",e,t,i):void 0;o===void 0&&(o=a),jc(e,s,o)}},B_)}function fP(e,t,r,n,i,a,s){var o=Uc(e,r),u=Uc(t,r),c=s.get(u);if(c){jc(e,r,c);return}var p=a?a(o,u,r+"",e,t,s):void 0,f=p===void 0;if(f){var d=Gc(u),h=!d&&k_(u),E=!d&&!h&&U_(u);p=u,d||h||E?Gc(o)?p=o:xP(o)?p=EP(o):h?(f=!1,p=_P(u,!0)):E?(f=!1,p=gP(u,!0)):p=[]:MP(u)||Bc(u)?(p=o,Bc(o)?p=LP(o):(!Dr(o)||Vc(o))&&(p=AP(u))):f=!1}f&&(s.set(u,p),i(p,u,n,a,s),s.delete(u)),jc(e,r,p)}function dP(e,t){return NP(RP(e,t,G_),e+"")}var hP=Zs?function(e,t){return Zs(e,"toString",{configurable:!0,enumerable:!1,value:jP(t),writable:!0})}:G_;function _P(e,t){if(t)return e.slice();var r=e.length,n=R_?R_(r):new e.constructor(r);return e.copy(n),n}function vP(e){var t=new e.constructor(e.byteLength);return new P_(t).set(new P_(e)),t}function gP(e,t){var r=t?vP(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.length)}function EP(e,t){var r=-1,n=e.length;for(t||(t=Array(n));++r<n;)t[r]=e[r];return t}function mP(e,t,r,n){var i=!r;r||(r={});for(var a=-1,s=t.length;++a<s;){var o=t[a],u=n?n(r[o],e[o],o,r,e):void 0;u===void 0&&(u=e[o]),i?kc(r,o,u):oP(r,o,u)}return r}function yP(e){return dP(function(t,r){var n=-1,i=r.length,a=i>1?r[i-1]:void 0,s=i>2?r[2]:void 0;for(a=e.length>3&&typeof a=="function"?(i--,a):void 0,s&&IP(r[0],r[1],s)&&(a=i<3?void 0:a,i=1),t=Object(t);++n<i;){var o=r[n];o&&e(t,o,n,a)}return t})}function TP(e){return function(t,r,n){for(var i=-1,a=Object(t),s=n(t),o=s.length;o--;){var u=s[e?o:++i];if(r(a[u],u,a)===!1)break}return t}}function to(e,t){var r=e.__data__;return bP(t)?r[typeof t=="string"?"string":"hash"]:r.map}function Hc(e,t){var r=RO(e,t);return cP(r)?r:void 0}function SP(e){var t=Pt.call(e,Rr),r=e[Rr];try{e[Rr]=void 0;var n=!0}catch(a){}var i=C_.call(e);return n&&(t?e[Rr]=r:delete e[Rr]),i}function AP(e){return typeof e.constructor=="function"&&!j_(e)?HO(N_(e)):{}}function q_(e,t){var r=typeof e;return t=t==null?v_:t,!!t&&(r=="number"||r!="symbol"&&IO.test(e))&&e>-1&&e%1==0&&e<t}function IP(e,t,r){if(!Dr(r))return!1;var n=typeof t;return(n=="number"?Fc(r)&&q_(t,r.length):n=="string"&&t in r)?ro(r[t],e):!1}function bP(e){var t=typeof e;return t=="string"||t=="number"||t=="symbol"||t=="boolean"?e!=="__proto__":e===null}function CP(e){return!!b_&&b_ in e}function j_(e){var t=e&&e.constructor,r=typeof t=="function"&&t.prototype||Ys;return e===r}function OP(e){var t=[];if(e!=null)for(var r in Object(e))t.push(r);return t}function PP(e){return C_.call(e)}function RP(e,t,r){return t=w_(t===void 0?e.length-1:t,0),function(){for(var n=arguments,i=-1,a=w_(n.length-t,0),s=Array(a);++i<a;)s[i]=n[t+i];i=-1;for(var o=Array(t+1);++i<t;)o[i]=n[i];return o[t]=r(s),CO(e,this,o)}}function Uc(e,t){if(!(t==="constructor"&&typeof e[t]=="function")&&t!="__proto__")return e[t]}var NP=DP(hP);function DP(e){var t=0,r=0;return function(){var n=kO(),i=YC-(n-r);if(r=n,i>0){if(++t>=XC)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}function wP(e){if(e!=null){try{return Qs.call(e)}catch(t){}try{return e+""}catch(t){}}return""}function ro(e,t){return e===t||e!==e&&t!==t}var Bc=M_(function(){return arguments}())?M_:function(e){return Ki(e)&&Pt.call(e,"callee")&&!LO.call(e,"callee")},Gc=Array.isArray;function Fc(e){return e!=null&&H_(e.length)&&!Vc(e)}function xP(e){return Ki(e)&&Fc(e)}var k_=jO||kP;function Vc(e){if(!Dr(e))return!1;var t=eo(e);return t==E_||t==tO||t==WC||t==aO}function H_(e){return typeof e=="number"&&e>-1&&e%1==0&&e<=v_}function Dr(e){var t=typeof e;return e!=null&&(t=="object"||t=="function")}function Ki(e){return e!=null&&typeof e=="object"}function MP(e){if(!Ki(e)||eo(e)!=m_)return!1;var t=N_(e);if(t===null)return!0;var r=Pt.call(t,"constructor")&&t.constructor;return typeof r=="function"&&r instanceof r&&Qs.call(r)==xO}var U_=I_?PO(I_):lP;function LP(e){return mP(e,B_(e))}function B_(e){return Fc(e)?sP(e,!0):pP(e)}var qP=yP(function(e,t,r){L_(e,t,r)});function jP(e){return function(){return e}}function G_(e){return e}function kP(){return!1}wn.exports=qP});var z_=l(no=>{"use strict";Object.defineProperty(no,"__esModule",{value:!0});no.BatchSpanProcessorBase=void 0;var V_=z(),Yi=Xe(),$_=class{constructor(t,r){this._exporter=t,this._finishedSpans=[],this._isShutdown=!1,this._shuttingDownPromise=Promise.resolve();let n=Yi.getEnv();this._maxExportBatchSize=typeof(r==null?void 0:r.maxExportBatchSize)=="number"?r.maxExportBatchSize:n.OTEL_BSP_MAX_EXPORT_BATCH_SIZE,this._maxQueueSize=typeof(r==null?void 0:r.maxQueueSize)=="number"?r.maxQueueSize:n.OTEL_BSP_MAX_QUEUE_SIZE,this._scheduledDelayMillis=typeof(r==null?void 0:r.scheduledDelayMillis)=="number"?r.scheduledDelayMillis:n.OTEL_BSP_SCHEDULE_DELAY,this._exportTimeoutMillis=typeof(r==null?void 0:r.exportTimeoutMillis)=="number"?r.exportTimeoutMillis:n.OTEL_BSP_EXPORT_TIMEOUT}forceFlush(){return this._isShutdown?this._shuttingDownPromise:this._flushAll()}onStart(t){}onEnd(t){this._isShutdown||this._addToBuffer(t)}shutdown(){return this._isShutdown?this._shuttingDownPromise:(this._isShutdown=!0,this._shuttingDownPromise=new Promise((t,r)=>{Promise.resolve().then(()=>this.onShutdown()).then(()=>this._flushAll()).then(()=>this._exporter.shutdown()).then(t).catch(n=>{r(n)})}),this._shuttingDownPromise)}_addToBuffer(t){this._finishedSpans.length>=this._maxQueueSize||(this._finishedSpans.push(t),this._maybeStartTimer())}_flushAll(){return new Promise((t,r)=>{let n=[],i=Math.ceil(this._finishedSpans.length/this._maxExportBatchSize);for(let a=0,s=i;a<s;a++)n.push(this._flushOneBatch());Promise.all(n).then(()=>{t()}).catch(r)})}_flushOneBatch(){return this._clearTimer(),this._finishedSpans.length===0?Promise.resolve():new Promise((t,r)=>{let n=setTimeout(()=>{r(new Error("Timeout"))},this._exportTimeoutMillis);V_.context.with(Yi.suppressTracing(V_.context.active()),()=>{this._exporter.export(this._finishedSpans.splice(0,this._maxExportBatchSize),i=>{var a;clearTimeout(n),i.code===Yi.ExportResultCode.SUCCESS?t():r((a=i.error)!==null&&a!==void 0?a:new Error("BatchSpanProcessor: span export failed"))})})})}_maybeStartTimer(){this._timer===void 0&&(this._timer=setTimeout(()=>{this._flushOneBatch().then(()=>{this._finishedSpans.length>0&&(this._clearTimer(),this._maybeStartTimer())}).catch(t=>{Yi.globalErrorHandler(t)})},this._scheduledDelayMillis),Yi.unrefTimer(this._timer))}_clearTimer(){this._timer!==void 0&&(clearTimeout(this._timer),this._timer=void 0)}};no.BatchSpanProcessorBase=$_});var X_=l(io=>{"use strict";Object.defineProperty(io,"__esModule",{value:!0});io.BatchSpanProcessor=void 0;var HP=z_(),K_=class extends HP.BatchSpanProcessorBase{onShutdown(){}};io.BatchSpanProcessor=K_});var Y_=l(wr=>{"use strict";var UP=wr&&wr.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),BP=wr&&wr.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&UP(t,e,r)};Object.defineProperty(wr,"__esModule",{value:!0});BP(X_(),wr)});var $c=l(xr=>{"use strict";var GP=xr&&xr.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),FP=xr&&xr.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&GP(t,e,r)};Object.defineProperty(xr,"__esModule",{value:!0});FP(Y_(),xr)});var W_=l(Lr=>{"use strict";Object.defineProperty(Lr,"__esModule",{value:!0});Lr.BasicTracerProvider=Lr.ForceFlushState=void 0;var xn=z(),Qi=Xe(),Q_=Fs(),VP=zc(),$P=Cc(),zP=d_(),KP=Mc(),XP=F_(),YP=$c(),Mn;(function(e){e[e.resolved=0]="resolved",e[e.timeout=1]="timeout",e[e.error=2]="error",e[e.unresolved=3]="unresolved"})(Mn=Lr.ForceFlushState||(Lr.ForceFlushState={}));var Mr=class{constructor(t={}){var r;this._registeredSpanProcessors=[],this._tracers=new Map;let n=XP({},$P.DEFAULT_CONFIG,t);this.resource=(r=n.resource)!==null&&r!==void 0?r:Q_.Resource.empty(),this.resource=Q_.Resource.default().merge(this.resource),this._config=Object.assign({},n,{resource:this.resource});let i=this._buildExporterFromEnv();if(i!==void 0){let a=new YP.BatchSpanProcessor(i);this.activeSpanProcessor=a}else this.activeSpanProcessor=new KP.NoopSpanProcessor}getTracer(t,r){let n=`${t}@${r||""}`;return this._tracers.has(n)||this._tracers.set(n,new VP.Tracer({name:t,version:r},this._config,this)),this._tracers.get(n)}addSpanProcessor(t){this._registeredSpanProcessors.length===0&&this.activeSpanProcessor.shutdown().catch(r=>xn.diag.error("Error while trying to shutdown current span processor",r)),this._registeredSpanProcessors.push(t),this.activeSpanProcessor=new zP.MultiSpanProcessor(this._registeredSpanProcessors)}getActiveSpanProcessor(){return this.activeSpanProcessor}register(t={}){xn.trace.setGlobalTracerProvider(this),t.propagator===void 0&&(t.propagator=this._buildPropagatorFromEnv()),t.contextManager&&xn.context.setGlobalContextManager(t.contextManager),t.propagator&&xn.propagation.setGlobalPropagator(t.propagator)}forceFlush(){let t=this._config.forceFlushTimeoutMillis,r=this._registeredSpanProcessors.map(n=>new Promise(i=>{let a,s=setTimeout(()=>{i(new Error(`Span processor did not completed within timeout period of ${t} ms`)),a=Mn.timeout},t);n.forceFlush().then(()=>{clearTimeout(s),a!==Mn.timeout&&(a=Mn.resolved,i(a))}).catch(o=>{clearTimeout(s),a=Mn.error,i(o)})}));return new Promise((n,i)=>{Promise.all(r).then(a=>{let s=a.filter(o=>o!==Mn.resolved);s.length>0?i(s):n()}).catch(a=>i([a]))})}shutdown(){return this.activeSpanProcessor.shutdown()}_getPropagator(t){var r;return(r=Mr._registeredPropagators.get(t))===null||r===void 0?void 0:r()}_getSpanExporter(t){var r;return(r=Mr._registeredExporters.get(t))===null||r===void 0?void 0:r()}_buildPropagatorFromEnv(){let t=Array.from(new Set(Qi.getEnv().OTEL_PROPAGATORS)),n=t.map(i=>{let a=this._getPropagator(i);return a||xn.diag.warn(`Propagator "${i}" requested through environment variable is unavailable.`),a}).reduce((i,a)=>(a&&i.push(a),i),[]);if(n.length!==0)return t.length===1?n[0]:new Qi.CompositePropagator({propagators:n})}_buildExporterFromEnv(){let t=Qi.getEnv().OTEL_TRACES_EXPORTER;if(t==="none")return;let r=this._getSpanExporter(t);return r||xn.diag.error(`Exporter "${t}" requested through environment variable is unavailable.`),r}};Lr.BasicTracerProvider=Mr;Mr._registeredPropagators=new Map([["tracecontext",()=>new Qi.HttpTraceContextPropagator],["baggage",()=>new Qi.HttpBaggagePropagator]]);Mr._registeredExporters=new Map});var J_=l(ao=>{"use strict";Object.defineProperty(ao,"__esModule",{value:!0});ao.ConsoleSpanExporter=void 0;var Kc=Xe(),Z_=class{export(t,r){return this._sendSpans(t,r)}shutdown(){return this._sendSpans([]),Promise.resolve()}_exportInfo(t){return{traceId:t.spanContext().traceId,parentId:t.parentSpanId,name:t.name,id:t.spanContext().spanId,kind:t.kind,timestamp:Kc.hrTimeToMicroseconds(t.startTime),duration:Kc.hrTimeToMicroseconds(t.duration),attributes:t.attributes,status:t.status,events:t.events}}_sendSpans(t,r){for(let n of t)console.log(this._exportInfo(n));if(r)return r({code:Kc.ExportResultCode.SUCCESS})}};ao.ConsoleSpanExporter=Z_});var rv=l(so=>{"use strict";Object.defineProperty(so,"__esModule",{value:!0});so.InMemorySpanExporter=void 0;var ev=Xe(),tv=class{constructor(){this._finishedSpans=[],this._stopped=!1}export(t,r){if(this._stopped)return r({code:ev.ExportResultCode.FAILED,error:new Error("Exporter has been stopped")});this._finishedSpans.push(...t),setTimeout(()=>r({code:ev.ExportResultCode.SUCCESS}),0)}shutdown(){return this._stopped=!0,this._finishedSpans=[],Promise.resolve()}reset(){this._finishedSpans=[]}getFinishedSpans(){return this._finishedSpans}};so.InMemorySpanExporter=tv});var iv=l(nv=>{"use strict";Object.defineProperty(nv,"__esModule",{value:!0})});var ov=l(oo=>{"use strict";Object.defineProperty(oo,"__esModule",{value:!0});oo.SimpleSpanProcessor=void 0;var av=z(),Xc=Xe(),sv=class{constructor(t){this._exporter=t,this._isShutdown=!1,this._shuttingDownPromise=Promise.resolve()}forceFlush(){return Promise.resolve()}onStart(t){}onEnd(t){this._isShutdown||av.context.with(Xc.suppressTracing(av.context.active()),()=>{this._exporter.export([t],r=>{var n;r.code!==Xc.ExportResultCode.SUCCESS&&Xc.globalErrorHandler((n=r.error)!==null&&n!==void 0?n:new Error(`SimpleSpanProcessor: span export failed (status ${r})`))})})}shutdown(){return this._isShutdown?this._shuttingDownPromise:(this._isShutdown=!0,this._shuttingDownPromise=new Promise((t,r)=>{Promise.resolve().then(()=>this._exporter.shutdown()).then(t).catch(n=>{r(n)})}),this._shuttingDownPromise)}};oo.SimpleSpanProcessor=sv});var cv=l(uv=>{"use strict";Object.defineProperty(uv,"__esModule",{value:!0})});var pv=l(lv=>{"use strict";Object.defineProperty(lv,"__esModule",{value:!0})});var dv=l(fv=>{"use strict";Object.defineProperty(fv,"__esModule",{value:!0})});var _v=l(hv=>{"use strict";Object.defineProperty(hv,"__esModule",{value:!0})});var zc=l(he=>{"use strict";var QP=he&&he.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),Ue=he&&he.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&QP(t,e,r)};Object.defineProperty(he,"__esModule",{value:!0});Ue(Qh(),he);Ue(W_(),he);Ue($c(),he);Ue(J_(),he);Ue(rv(),he);Ue(iv(),he);Ue(ov(),he);Ue(cv(),he);Ue(Mc(),he);Ue(bc(),he);Ue(pv(),he);Ue(dv(),he);Ue(_v(),he)});var Ev=l(ht=>{"use strict";Object.defineProperty(ht,"__esModule",{value:!0});ht.enable=ht.azureCoreTracing=ht.AzureMonitorSymbol=void 0;var vv=ue();ht.AzureMonitorSymbol="Azure_Monitor_Tracer";var gv=!1,WP=function(e){if(gv)return e;try{var t=zc(),r=z(),n=new t.BasicTracerProvider,i=n.getTracer("applicationinsights tracer"),a=e.setTracer;e.setTracer=function(s){var o=s.startSpan;s.startSpan=function(u,c,p){var f=o.call(this,u,c,p),d=f.end;return f.end=function(){var h=d.apply(this,arguments);return vv.channel.publish("azure-coretracing",f),h},f},s[ht.AzureMonitorSymbol]=!0,a.call(this,s)},r.trace.getSpan(r.context.active()),e.setTracer(i),gv=!0}catch(s){}return e};ht.azureCoreTracing={versionSpecifier:">= 1.0.0 < 2.0.0",patch:WP};function ZP(){vv.channel.registerMonkeyPatch("@azure/core-tracing",ht.azureCoreTracing)}ht.enable=ZP});var yv=l(qr=>{"use strict";Object.defineProperty(qr,"__esModule",{value:!0});qr.enable=qr.bunyan=void 0;var mv=ue(),JP=function(e){var t=e.prototype._emit;return e.prototype._emit=function(r,n){var i=t.apply(this,arguments);if(!n){var a=i;a||(a=t.call(this,r,!0)),mv.channel.publish("bunyan",{level:r.level,result:a})}return i},e};qr.bunyan={versionSpecifier:">= 1.0.0 < 2.0.0",patch:JP};function eR(){mv.channel.registerMonkeyPatch("bunyan",qr.bunyan)}qr.enable=eR});var Sv=l(jr=>{"use strict";Object.defineProperty(jr,"__esModule",{value:!0});jr.enable=jr.console=void 0;var Yc=ue(),Tv=__webpack_require__(/*! stream */ "stream"),tR=function(e){var t=new Tv.Writable,r=new Tv.Writable;t.write=function(c){if(!c)return!0;var p=c.toString();return Yc.channel.publish("console",{message:p}),!0},r.write=function(c){if(!c)return!0;var p=c.toString();return Yc.channel.publish("console",{message:p,stderr:!0}),!0};for(var n=new e.Console(t,r),i=["log","info","warn","error","dir","time","timeEnd","trace","assert"],a=function(c){var p=e[c];p&&(e[c]=function(){if(n[c])try{n[c].apply(n,arguments)}catch(f){}return p.apply(e,arguments)})},s=0,o=i;s<o.length;s++){var u=o[s];a(u)}return e};jr.console={versionSpecifier:">= 4.0.0",patch:tR};function rR(){Yc.channel.registerMonkeyPatch("console",jr.console),__webpack_require__(/*! console */ "console")}jr.enable=rR});var Av=l(kr=>{"use strict";Object.defineProperty(kr,"__esModule",{value:!0});kr.enable=kr.mongoCore=void 0;var Qc=ue(),nR=function(e){var t=e.Server.prototype.connect;return e.Server.prototype.connect=function(){var n=t.apply(this,arguments),i=this.s.pool.write;this.s.pool.write=function(){var o=typeof arguments[1]=="function"?1:2;return typeof arguments[o]=="function"&&(arguments[o]=Qc.channel.bindToContext(arguments[o])),i.apply(this,arguments)};var a=this.s.pool.logout;return this.s.pool.logout=function(){return typeof arguments[1]=="function"&&(arguments[1]=Qc.channel.bindToContext(arguments[1])),a.apply(this,arguments)},n},e};kr.mongoCore={versionSpecifier:">= 2.0.0 < 4.0.0",patch:nR};function iR(){Qc.channel.registerMonkeyPatch("mongodb-core",kr.mongoCore)}kr.enable=iR});var Iv=l(Ne=>{"use strict";var Ln=Ne&&Ne.__assign||function(){return Ln=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},Ln.apply(this,arguments)};Object.defineProperty(Ne,"__esModule",{value:!0});Ne.enable=Ne.mongo330=Ne.mongo3=Ne.mongo2=void 0;var Ce=ue(),aR=function(e){var t=e.instrument({operationIdGenerator:{next:function(){return Ce.channel.bindToContext(function(n){return n()})}}}),r={};return t.on("started",function(n){r[n.requestId]||(r[n.requestId]=Ln(Ln({},n),{time:new Date}))}),t.on("succeeded",function(n){var i=r[n.requestId];i&&delete r[n.requestId],typeof n.operationId=="function"?n.operationId(function(){return Ce.channel.publish("mongodb",{startedData:i,event:n,succeeded:!0})}):Ce.channel.publish("mongodb",{startedData:i,event:n,succeeded:!0})}),t.on("failed",function(n){var i=r[n.requestId];i&&delete r[n.requestId],typeof n.operationId=="function"?n.operationId(function(){return Ce.channel.publish("mongodb",{startedData:i,event:n,succeeded:!1})}):Ce.channel.publish("mongodb",{startedData:i,event:n,succeeded:!1})}),e},sR=function(e){var t=e.instrument(),r={},n={};return t.on("started",function(i){r[i.requestId]||(n[i.requestId]=Ce.channel.bindToContext(function(a){return a()}),r[i.requestId]=Ln(Ln({},i),{time:new Date}))}),t.on("succeeded",function(i){var a=r[i.requestId];a&&delete r[i.requestId],typeof i=="object"&&typeof n[i.requestId]=="function"&&(n[i.requestId](function(){return Ce.channel.publish("mongodb",{startedData:a,event:i,succeeded:!0})}),delete n[i.requestId])}),t.on("failed",function(i){var a=r[i.requestId];a&&delete r[i.requestId],typeof i=="object"&&typeof n[i.requestId]=="function"&&(n[i.requestId](function(){return Ce.channel.publish("mongodb",{startedData:a,event:i,succeeded:!1})}),delete n[i.requestId])}),e},oR=function(e){var t=e.Server.prototype.connect;return e.Server.prototype.connect=function(){var n=t.apply(this,arguments),i=this.s.coreTopology.s.pool.write;this.s.coreTopology.s.pool.write=function(){var o=typeof arguments[1]=="function"?1:2;return typeof arguments[o]=="function"&&(arguments[o]=Ce.channel.bindToContext(arguments[o])),i.apply(this,arguments)};var a=this.s.coreTopology.s.pool.logout;return this.s.coreTopology.s.pool.logout=function(){return typeof arguments[1]=="function"&&(arguments[1]=Ce.channel.bindToContext(arguments[1])),a.apply(this,arguments)},n},e},uR=function(e){oR(e);var t=e.instrument(),r={},n={};return t.on("started",function(i){r[i.requestId]||(n[i.requestId]=Ce.channel.bindToContext(function(a){return a()}),r[i.requestId]=i)}),t.on("succeeded",function(i){var a=r[i.requestId];a&&delete r[i.requestId],typeof i=="object"&&typeof n[i.requestId]=="function"&&(n[i.requestId](function(){return Ce.channel.publish("mongodb",{startedData:a,event:i,succeeded:!0})}),delete n[i.requestId])}),t.on("failed",function(i){var a=r[i.requestId];a&&delete r[i.requestId],typeof i=="object"&&typeof n[i.requestId]=="function"&&(n[i.requestId](function(){return Ce.channel.publish("mongodb",{startedData:a,event:i,succeeded:!1})}),delete n[i.requestId])}),e};Ne.mongo2={versionSpecifier:">= 2.0.0 <= 3.0.5",patch:aR};Ne.mongo3={versionSpecifier:"> 3.0.5 < 3.3.0",patch:sR};Ne.mongo330={versionSpecifier:">= 3.3.0 < 4.0.0",patch:uR};function cR(){Ce.channel.registerMonkeyPatch("mongodb",Ne.mongo2),Ce.channel.registerMonkeyPatch("mongodb",Ne.mongo3),Ce.channel.registerMonkeyPatch("mongodb",Ne.mongo330)}Ne.enable=cR});var Cv=l(Hr=>{"use strict";Object.defineProperty(Hr,"__esModule",{value:!0});Hr.enable=Hr.mysql=void 0;var uo=ue(),bv=__webpack_require__(/*! path */ "path"),lR=function(e,t){var r=function(u,c){return function(p,f){var d=u[p];d&&(u[p]=function(){for(var E=arguments.length-1,S=arguments.length-1;S>=0;--S)if(typeof arguments[S]=="function"){E=S;break}else if(typeof arguments[S]!="undefined")break;var j=arguments[E],oe={result:null,startTime:null,startDate:null};typeof j=="function"&&(f?(oe.startTime=process.hrtime(),oe.startDate=new Date,arguments[E]=uo.channel.bindToContext(f(oe,j))):arguments[E]=uo.channel.bindToContext(j));var Ae=d.apply(this,arguments);return oe.result=Ae,Ae})}},n=function(u,c){return r(u.prototype,c+".prototype")},i=["connect","changeUser","ping","statistics","end"],a=__webpack_require__("./node_modules/vscode-extension-telemetry/lib sync recursive ^.*\\/lib\\/Connection$")(bv.dirname(t)+"/lib/Connection");i.forEach(function(u){return n(a,"Connection")(u)}),r(a,"Connection")("createQuery",function(u,c){return function(p){var f=process.hrtime(u.startTime),d=f[0]*1e3+f[1]/1e6|0;uo.channel.publish("mysql",{query:u.result,callbackArgs:arguments,err:p,duration:d,time:u.startDate}),c.apply(this,arguments)}});var s=["_enqueueCallback"],o=__webpack_require__("./node_modules/vscode-extension-telemetry/lib sync recursive ^.*\\/lib\\/Pool$")(bv.dirname(t)+"/lib/Pool");return s.forEach(function(u){return n(o,"Pool")(u)}),e};Hr.mysql={versionSpecifier:">= 2.0.0 < 3.0.0",patch:lR};function pR(){uo.channel.registerMonkeyPatch("mysql",Hr.mysql)}Hr.enable=pR});var Pv=l(Ur=>{"use strict";Object.defineProperty(Ur,"__esModule",{value:!0});Ur.enable=Ur.postgresPool1=void 0;var Ov=ue();function fR(e){var t=e.prototype.connect;return e.prototype.connect=function(n){return n&&(arguments[0]=Ov.channel.bindToContext(n)),t.apply(this,arguments)},e}Ur.postgresPool1={versionSpecifier:">= 1.0.0 < 3.0.0",patch:fR};function dR(){Ov.channel.registerMonkeyPatch("pg-pool",Ur.postgresPool1)}Ur.enable=dR});var Nv=l(_t=>{"use strict";Object.defineProperty(_t,"__esModule",{value:!0});_t.enable=_t.postgres7=_t.postgres6=void 0;var qn=ue(),Rv=__webpack_require__(/*! events */ "events");function hR(e,t){var r=e.Client.prototype.query,n="__diagnosticOriginalFunc";return e.Client.prototype.query=function(a,s,o){var u={query:{},database:{host:this.connectionParameters.host,port:this.connectionParameters.port},result:null,error:null,duration:0,time:new Date},c=process.hrtime(),p;function f(d){d&&d[n]&&(d=d[n]);var h=qn.channel.bindToContext(function(E,S){var j=process.hrtime(c);if(u.result=S&&{rowCount:S.rowCount,command:S.command},u.error=E,u.duration=Math.ceil(j[0]*1e3+j[1]/1e6),qn.channel.publish("postgres",u),E){if(d)return d.apply(this,arguments);p&&p instanceof Rv.EventEmitter&&p.emit("error",E)}else d&&d.apply(this,arguments)});try{return Object.defineProperty(h,n,{value:d}),h}catch(E){return d}}try{typeof a=="string"?s instanceof Array?(u.query.preparable={text:a,args:s},o=f(o)):(u.query.text=a,o?o=f(o):s=f(s)):(typeof a.name=="string"?u.query.plan=a.name:a.values instanceof Array?u.query.preparable={text:a.text,args:a.values}:u.query.text=a.text,o?o=f(o):s?s=f(s):a.callback=f(a.callback))}catch(d){return r.apply(this,arguments)}return arguments[0]=a,arguments[1]=s,arguments[2]=o,arguments.length=arguments.length>3?arguments.length:3,p=r.apply(this,arguments),p},e}function _R(e,t){var r=e.Client.prototype.query,n="__diagnosticOriginalFunc";return e.Client.prototype.query=function(a,s,o){var u=this,c=!!o,p={query:{},database:{host:this.connectionParameters.host,port:this.connectionParameters.port},result:null,error:null,duration:0,time:new Date},f=process.hrtime(),d;function h(E){E&&E[n]&&(E=E[n]);var S=qn.channel.bindToContext(function(j,oe){var Ae=process.hrtime(f);if(p.result=oe&&{rowCount:oe.rowCount,command:oe.command},p.error=j,p.duration=Math.ceil(Ae[0]*1e3+Ae[1]/1e6),qn.channel.publish("postgres",p),j){if(E)return E.apply(this,arguments);d&&d instanceof Rv.EventEmitter&&d.emit("error",j)}else E&&E.apply(this,arguments)});try{return Object.defineProperty(S,n,{value:E}),S}catch(j){return E}}try{typeof a=="string"?s instanceof Array?(p.query.preparable={text:a,args:s},c=typeof o=="function",o=c?h(o):o):(p.query.text=a,o?(c=typeof o=="function",o=c?h(o):o):(c=typeof s=="function",s=c?h(s):s)):(typeof a.name=="string"?p.query.plan=a.name:a.values instanceof Array?p.query.preparable={text:a.text,args:a.values}:p.query.text=a.text,o?(c=typeof o=="function",o=h(o)):s?(c=typeof s=="function",s=c?h(s):s):(c=typeof a.callback=="function",a.callback=c?h(a.callback):a.callback))}catch(E){return r.apply(this,arguments)}return arguments[0]=a,arguments[1]=s,arguments[2]=o,arguments.length=arguments.length>3?arguments.length:3,d=r.apply(this,arguments),c?d:d.then(function(E){return h()(void 0,E),new u._Promise(function(S,j){S(E)})}).catch(function(E){return h()(E,void 0),new u._Promise(function(S,j){j(E)})})},e}_t.postgres6={versionSpecifier:"6.*",patch:hR};_t.postgres7={versionSpecifier:">=7.* <=8.*",patch:_R};function vR(){qn.channel.registerMonkeyPatch("pg",_t.postgres6),qn.channel.registerMonkeyPatch("pg",_t.postgres7)}_t.enable=vR});var Dv=l(Br=>{"use strict";Object.defineProperty(Br,"__esModule",{value:!0});Br.enable=Br.redis=void 0;var Wc=ue(),gR=function(e){var t=e.RedisClient.prototype.internal_send_command;return e.RedisClient.prototype.internal_send_command=function(r){if(r){var n=r.callback;if(!n||!n.pubsubBound){var i=this.address,a=process.hrtime(),s=new Date;r.callback=Wc.channel.bindToContext(function(o,u){var c=process.hrtime(a),p=c[0]*1e3+c[1]/1e6|0;Wc.channel.publish("redis",{duration:p,address:i,commandObj:r,err:o,result:u,time:s}),typeof n=="function"&&n.apply(this,arguments)}),r.callback.pubsubBound=!0}}return t.call(this,r)},e};Br.redis={versionSpecifier:">= 2.0.0 < 4.0.0",patch:gR};function ER(){Wc.channel.registerMonkeyPatch("redis",Br.redis)}Br.enable=ER});var wv=l(Nt=>{"use strict";var co=Nt&&Nt.__assign||function(){return co=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},co.apply(this,arguments)};Object.defineProperty(Nt,"__esModule",{value:!0});Nt.enable=Nt.tedious=void 0;var Zc=ue(),mR=function(e){var t=e.Connection.prototype.makeRequest;return e.Connection.prototype.makeRequest=function(){function n(a){var s=process.hrtime(),o={query:{},database:{host:null,port:null},result:null,error:null,duration:0};return Zc.channel.bindToContext(function(u,c,p){var f=process.hrtime(s);o=co(co({},o),{database:{host:this.connection.config.server,port:this.connection.config.options.port},result:!u&&{rowCount:c,rows:p},query:{text:this.parametersByName.statement.value},error:u,duration:Math.ceil(f[0]*1e3+f[1]/1e6)}),Zc.channel.publish("tedious",o),a.call(this,u,c,p)})}var i=arguments[0];arguments[0].callback=n(i.callback),t.apply(this,arguments)},e};Nt.tedious={versionSpecifier:">= 6.0.0 < 9.0.0",patch:mR};function yR(){Zc.channel.registerMonkeyPatch("tedious",Nt.tedious)}Nt.enable=yR});var xv=l(Le=>{"use strict";var TR=Le&&Le.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),SR=Le&&Le.__rest||function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(r[n[i]]=e[n[i]]);return r};Object.defineProperty(Le,"__esModule",{value:!0});Le.enable=Le.winston2=Le.winston3=void 0;var lo=ue(),AR=function(e){var t=e.Logger.prototype.log,r,n=function(i,a,s){var o;return r===e.config.npm.levels?o="npm":r===e.config.syslog.levels?o="syslog":o="unknown",lo.channel.publish("winston",{level:i,message:a,meta:s,levelKind:o}),a};return e.Logger.prototype.log=function(){return r=this.levels,!this.filters||this.filters.length===0?this.filters=[n]:this.filters[this.filters.length-1]!==n&&(this.filters=this.filters.filter(function(a){return a!==n}),this.filters.push(n)),t.apply(this,arguments)},e},IR=function(e){var t=function(s,o){var u;return s.config.npm.levels[o]!=null?u="npm":s.config.syslog.levels[o]!=null?u="syslog":u="unknown",u},r=function(s){TR(o,s);function o(u,c){var p=s.call(this,c)||this;return p.winston=u,p}return o.prototype.log=function(u,c){var p=u.message,f=u.level,d=u.meta,h=SR(u,["message","level","meta"]);f=typeof Symbol.for=="function"?u[Symbol.for("level")]:f,p=u instanceof Error?u:p;var E=t(this.winston,f);d=d||{};for(var S in h)h.hasOwnProperty(S)&&(d[S]=h[S]);lo.channel.publish("winston",{message:p,level:f,levelKind:E,meta:d}),c()},o}(e.Transport);function n(){var s=arguments[0].levels||e.config.npm.levels,o;for(var u in s)s.hasOwnProperty(u)&&(o=o===void 0||s[u]>s[o]?u:o);this.add(new r(e,{level:o}))}var i=e.createLogger;e.createLogger=function(){var o=arguments[0].levels||e.config.npm.levels,u;for(var c in o)o.hasOwnProperty(c)&&(u=u===void 0||o[c]>o[u]?c:u);var p=i.apply(this,arguments);p.add(new r(e,{level:u}));var f=p.configure;return p.configure=function(){f.apply(this,arguments),n.apply(this,arguments)},p};var a=e.configure;return e.configure=function(){a.apply(this,arguments),n.apply(this,arguments)},e.add(new r(e)),e};Le.winston3={versionSpecifier:"3.x",patch:IR};Le.winston2={versionSpecifier:"2.x",patch:AR};function bR(){lo.channel.registerMonkeyPatch("winston",Le.winston2),lo.channel.registerMonkeyPatch("winston",Le.winston3)}Le.enable=bR});var $v=l($=>{"use strict";Object.defineProperty($,"__esModule",{value:!0});$.enable=$.tedious=$.pgPool=$.pg=$.winston=$.redis=$.mysql=$.mongodb=$.mongodbCore=$.console=$.bunyan=$.azuresdk=void 0;var Mv=Ev();$.azuresdk=Mv;var Lv=yv();$.bunyan=Lv;var qv=Sv();$.console=qv;var jv=Av();$.mongodbCore=jv;var kv=Iv();$.mongodb=kv;var Hv=Cv();$.mysql=Hv;var Uv=Pv();$.pgPool=Uv;var Bv=Nv();$.pg=Bv;var Gv=Dv();$.redis=Gv;var Fv=wv();$.tedious=Fv;var Vv=xv();$.winston=Vv;function CR(){Lv.enable(),qv.enable(),jv.enable(),kv.enable(),Hv.enable(),Bv.enable(),Uv.enable(),Gv.enable(),Vv.enable(),Mv.enable(),Fv.enable()}$.enable=CR});var ho=l(tr=>{"use strict";Object.defineProperty(tr,"__esModule",{value:!0});tr.registerContextPreservation=tr.IsInitialized=void 0;var OR=Eu(),Jc=ve();tr.IsInitialized=!process.env.APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL;var el="DiagnosticChannel";if(tr.IsInitialized){at=$v(),zv=process.env.APPLICATION_INSIGHTS_NO_PATCH_MODULES||"",po=zv.split(","),tl={bunyan:at.bunyan,console:at.console,mongodb:at.mongodb,mongodbCore:at.mongodbCore,mysql:at.mysql,redis:at.redis,pg:at.pg,pgPool:at.pgPool,winston:at.winston,azuresdk:at.azuresdk};for(fo in tl)po.indexOf(fo)===-1&&(tl[fo].enable(),Jc.info(el,"Subscribed to "+fo+" events"));po.length>0&&Jc.info(el,"Some modules will not be patched",po)}else Jc.info(el,"Not subscribing to dependency autocollection because APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL was set");var at,zv,po,tl,fo;function PR(e){if(!!tr.IsInitialized){var t=ue();t.channel.addContextPreservation(e),t.channel.spanContextPropagator=OR.AsyncScopeManager}}tr.registerContextPreservation=PR});var jn=l((Aq,Kv)=>{"use strict";Kv.exports={requestContextHeader:"request-context",requestContextSourceKey:"appId",requestContextTargetKey:"appId",requestIdHeader:"request-id",parentIdHeader:"x-ms-request-id",rootIdHeader:"x-ms-request-root-id",correlationContextHeader:"correlation-context",traceparentHeader:"traceparent",traceStateHeader:"tracestate"}});var Be=l((nl,Yv)=>{"use strict";var rr=nl&&nl.__assign||function(){return rr=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},rr.apply(this,arguments)},RR=__webpack_require__(/*! http */ "http"),Xv=__webpack_require__(/*! https */ "https"),rl=__webpack_require__(/*! url */ "url"),_o=__webpack_require__(/*! constants */ "constants"),Wi=ve(),kn=jn(),NR=function(){function e(){}return e.getCookie=function(t,r){var n="";if(t&&t.length&&typeof r=="string")for(var i=t+"=",a=r.split(";"),s=0;s<a.length;s++){var r=a[s];if(r=e.trim(r),r&&r.indexOf(i)===0){n=r.substring(i.length,a[s].length);break}}return n},e.trim=function(t){return typeof t=="string"?t.replace(/^\s+|\s+$/g,""):""},e.int32ArrayToBase64=function(t){var r=function(o,u){return String.fromCharCode(o>>u&255)},n=function(o){return r(o,24)+r(o,16)+r(o,8)+r(o,0)},i=t.map(n).join(""),a=Buffer.from?Buffer.from(i,"binary"):new Buffer(i,"binary"),s=a.toString("base64");return s.substr(0,s.indexOf("="))},e.random32=function(){return 4294967296*Math.random()|0},e.randomu32=function(){return e.random32()+2147483648},e.w3cTraceId=function(){for(var t=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"],r="",n,i=0;i<4;i++)n=e.random32(),r+=t[n&15]+t[n>>4&15]+t[n>>8&15]+t[n>>12&15]+t[n>>16&15]+t[n>>20&15]+t[n>>24&15]+t[n>>28&15];var a=t[8+Math.random()*4|0];return r.substr(0,8)+r.substr(9,4)+"4"+r.substr(13,3)+a+r.substr(16,3)+r.substr(19,12)},e.w3cSpanId=function(){return e.w3cTraceId().substring(16)},e.isValidW3CId=function(t){return t.length===32&&t!=="00000000000000000000000000000000"},e.isArray=function(t){return Object.prototype.toString.call(t)==="[object Array]"},e.isError=function(t){return t instanceof Error},e.isPrimitive=function(t){var r=typeof t;return r==="string"||r==="number"||r==="boolean"},e.isDate=function(t){return Object.prototype.toString.call(t)==="[object Date]"},e.msToTimeSpan=function(t){(isNaN(t)||t<0)&&(t=0);var r=(t/1e3%60).toFixed(7).replace(/0{0,4}$/,""),n=""+Math.floor(t/(1e3*60))%60,i=""+Math.floor(t/(1e3*60*60))%24,a=Math.floor(t/(1e3*60*60*24));r=r.indexOf(".")<2?"0"+r:r,n=n.length<2?"0"+n:n,i=i.length<2?"0"+i:i;var s=a>0?a+".":"";return s+i+":"+n+":"+r},e.extractError=function(t){var r=t;return{message:t.message,code:r.code||r.id||""}},e.extractObject=function(t){return t instanceof Error?e.extractError(t):typeof t.toJSON=="function"?t.toJSON():t},e.validateStringMap=function(t){if(typeof t!="object"){Wi.info("Invalid properties dropped from payload");return}var r={};for(var n in t){var i="",a=t[n],s=typeof a;if(e.isPrimitive(a))i=a.toString();else if(a===null||s==="undefined")i="";else if(s==="function"){Wi.info("key: "+n+" was function; will not serialize");continue}else{var o=e.isArray(a)?a:e.extractObject(a);try{e.isPrimitive(o)?i=o:i=JSON.stringify(o)}catch(u){i=a.constructor.name.toString()+" (Error: "+u.message+")",Wi.info("key: "+n+", could not be serialized")}}r[n]=i.substring(0,e.MAX_PROPERTY_LENGTH)}return r},e.canIncludeCorrelationHeader=function(t,r){var n=t&&t.config&&t.config.correlationHeaderExcludedDomains;if(!n||n.length==0||!r)return!0;for(var i=0;i<n.length;i++){var a=new RegExp(n[i].replace(/\./g,".").replace(/\*/g,".*"));if(a.test(rl.parse(r).hostname))return!1}return!0},e.getCorrelationContextTarget=function(t,r){var n=t.headers&&t.headers[kn.requestContextHeader];if(n)for(var i=n.split(","),a=0;a<i.length;++a){var s=i[a].split("=");if(s.length==2&&s[0]==r)return s[1]}},e.makeRequest=function(t,r,n,i){r&&r.indexOf("//")===0&&(r="https:"+r);var a=rl.parse(r),s=rr(rr({},n),{host:a.hostname,port:a.port,path:a.pathname}),o=void 0;if(a.protocol==="https:"&&(o=t.proxyHttpsUrl||void 0),a.protocol==="http:"&&(o=t.proxyHttpUrl||void 0),o){o.indexOf("//")===0&&(o="http:"+o);var u=rl.parse(o);u.protocol==="https:"?(Wi.info("Proxies that use HTTPS are not supported"),o=void 0):s=rr(rr({},s),{host:u.hostname,port:u.port||"80",path:r,headers:rr(rr({},s.headers),{Host:a.hostname})})}var c=a.protocol==="https:"&&!o;return c&&t.httpsAgent!==void 0?s.agent=t.httpsAgent:!c&&t.httpAgent!==void 0?s.agent=t.httpAgent:c&&(s.agent=e.tlsRestrictedAgent),c?Xv.request(s,i):RR.request(s,i)},e.safeIncludeCorrelationHeader=function(t,r,n){var i;if(typeof n=="string")i=n;else if(n instanceof Array)i=n.join(",");else if(n&&typeof n.toString=="function")try{i=n.toString()}catch(a){Wi.warn("Outgoing request-context header could not be read. Correlation of requests may be lost.",a,n)}i?e.addCorrelationIdHeaderFromString(t,r,i):r.setHeader(kn.requestContextHeader,kn.requestContextSourceKey+"="+t.config.correlationId)},e.dumpObj=function(t){var r=Object.prototype.toString.call(t),n="";return r==="[object Error]"?n="{ stack: '"+t.stack+"', message: '"+t.message+"', name: '"+t.name+"'":n=JSON.stringify(t),r+n},e.addCorrelationIdHeaderFromString=function(t,r,n){var i=n.split(","),a=kn.requestContextSourceKey+"=",s=i.some(function(o){return o.substring(0,a.length)===a});s||r.setHeader(kn.requestContextHeader,n+","+kn.requestContextSourceKey+"="+t.config.correlationId)},e.MAX_PROPERTY_LENGTH=8192,e.tlsRestrictedAgent=new Xv.Agent({keepAlive:!0,maxSockets:25,secureOptions:_o.SSL_OP_NO_SSLv2|_o.SSL_OP_NO_SSLv3|_o.SSL_OP_NO_TLSv1|_o.SSL_OP_NO_TLSv1_1}),e}();Yv.exports=NR});var Gr=l((Iq,Qv)=>{"use strict";var vo=Be(),il=ve(),DR=function(){function e(){}return e.queryCorrelationId=function(t,r){var n=t.profileQueryEndpoint+"/api/profiles/"+t.instrumentationKey+"/appId";if(e.completedLookups.hasOwnProperty(n)){r(e.completedLookups[n]);return}else if(e.pendingLookups[n]){e.pendingLookups[n].push(r);return}e.pendingLookups[n]=[r];var i=function(){if(!!e.pendingLookups[n]){var a={method:"GET",disableAppInsightsAutoCollection:!0};il.info(e.TAG,a);var s=vo.makeRequest(t,n,a,function(o){if(o.statusCode===200){var u="";o.setEncoding("utf-8"),o.on("data",function(c){u+=c}),o.on("end",function(){il.info(e.TAG,u);var c=e.correlationIdPrefix+u;e.completedLookups[n]=c,e.pendingLookups[n]&&e.pendingLookups[n].forEach(function(p){return p(c)}),delete e.pendingLookups[n]})}else o.statusCode>=400&&o.statusCode<500?(e.completedLookups[n]=void 0,delete e.pendingLookups[n]):setTimeout(i,t.correlationIdRetryIntervalMs)});s&&(s.on("error",function(o){il.warn(e.TAG,o)}),s.end())}};setTimeout(i,0)},e.cancelCorrelationIdQuery=function(t,r){var n=t.profileQueryEndpoint+"/api/profiles/"+t.instrumentationKey+"/appId",i=e.pendingLookups[n];i&&(e.pendingLookups[n]=i.filter(function(a){return a!=r}),e.pendingLookups[n].length==0&&delete e.pendingLookups[n])},e.generateRequestId=function(t){if(t){t=t[0]=="|"?t:"|"+t,t[t.length-1]!=="."&&(t+=".");var r=(e.currentRootId++).toString(16);return e.appendSuffix(t,r,"_")}else return e.generateRootId()},e.getRootId=function(t){var r=t.indexOf(".");r<0&&(r=t.length);var n=t[0]==="|"?1:0;return t.substring(n,r)},e.generateRootId=function(){return"|"+vo.w3cTraceId()+"."},e.appendSuffix=function(t,r,n){if(t.length+r.length<e.requestIdMaxLength)return t+r+n;var i=e.requestIdMaxLength-9;if(t.length>i)for(;i>1;--i){var a=t[i-1];if(a==="."||a==="_")break}if(i<=1)return e.generateRootId();for(r=vo.randomu32().toString(16);r.length<8;)r="0"+r;return t.substring(0,i)+r+"#"},e.TAG="CorrelationIdManager",e.correlationIdPrefix="cid-v1:",e.w3cEnabled=!0,e.pendingLookups={},e.completedLookups={},e.requestIdMaxLength=1024,e.currentRootId=vo.randomu32(),e}();Qv.exports=DR});var Zi=l((bq,Wv)=>{"use strict";var ye=Be(),wR=Gr(),xR=function(){function e(t,r){if(this.traceFlag=e.DEFAULT_TRACE_FLAG,this.version=e.DEFAULT_VERSION,t&&typeof t=="string")if(t.split(",").length>1)this.traceId=ye.w3cTraceId(),this.spanId=ye.w3cTraceId().substr(0,16);else{var n=t.trim().split("-"),i=n.length;i>=4?(this.version=n[0],this.traceId=n[1],this.spanId=n[2],this.traceFlag=n[3]):(this.traceId=ye.w3cTraceId(),this.spanId=ye.w3cTraceId().substr(0,16)),this.version.match(/^[0-9a-f]{2}$/g)||(this.version=e.DEFAULT_VERSION,this.traceId=ye.w3cTraceId()),this.version==="00"&&i!==4&&(this.traceId=ye.w3cTraceId(),this.spanId=ye.w3cTraceId().substr(0,16)),this.version==="ff"&&(this.version=e.DEFAULT_VERSION,this.traceId=ye.w3cTraceId(),this.spanId=ye.w3cTraceId().substr(0,16)),this.version.match(/^0[0-9a-f]$/g)||(this.version=e.DEFAULT_VERSION),this.traceFlag.match(/^[0-9a-f]{2}$/g)||(this.traceFlag=e.DEFAULT_TRACE_FLAG,this.traceId=ye.w3cTraceId()),e.isValidTraceId(this.traceId)||(this.traceId=ye.w3cTraceId()),e.isValidSpanId(this.spanId)||(this.spanId=ye.w3cTraceId().substr(0,16),this.traceId=ye.w3cTraceId()),this.parentId=this.getBackCompatRequestId()}else if(r){this.parentId=r.slice();var a=wR.getRootId(r);e.isValidTraceId(a)||(this.legacyRootId=a,a=ye.w3cTraceId()),r.indexOf("|")!==-1&&(r=r.substring(1+r.substring(0,r.length-1).lastIndexOf("."),r.length-1)),this.traceId=a,this.spanId=r}else this.traceId=ye.w3cTraceId(),this.spanId=ye.w3cTraceId().substr(0,16)}return e.isValidTraceId=function(t){return t.match(/^[0-9a-f]{32}$/)&&t!=="00000000000000000000000000000000"},e.isValidSpanId=function(t){return t.match(/^[0-9a-f]{16}$/)&&t!=="0000000000000000"},e.formatOpenTelemetryTraceFlags=function(t){var r="0"+t.toString(16);return r.substring(r.length-2)},e.prototype.getBackCompatRequestId=function(){return"|"+this.traceId+"."+this.spanId+"."},e.prototype.toString=function(){return this.version+"-"+this.traceId+"-"+this.spanId+"-"+this.traceFlag},e.prototype.updateSpanId=function(){this.spanId=ye.w3cTraceId().substr(0,16)},e.DEFAULT_TRACE_FLAG="01",e.DEFAULT_VERSION="00",e}();Wv.exports=xR});var al=l((Cq,Zv)=>{"use strict";var MR=function(){function e(t){this.fieldmap=[],!!t&&(this.fieldmap=this.parseHeader(t))}return e.prototype.toString=function(){var t=this.fieldmap;return!t||t.length==0?null:t.join(", ")},e.validateKeyChars=function(t){var r=t.split("@");if(r.length==2){var n=r[0].trim(),i=r[1].trim(),a=Boolean(n.match(/^[\ ]?[a-z0-9\*\-\_/]{1,241}$/)),s=Boolean(i.match(/^[\ ]?[a-z0-9\*\-\_/]{1,14}$/));return a&&s}else if(r.length==1)return Boolean(t.match(/^[\ ]?[a-z0-9\*\-\_/]{1,256}$/));return!1},e.prototype.parseHeader=function(t){var r=[],n={},i=t.split(",");if(i.length>32)return null;for(var a=0,s=i;a<s.length;a++){var o=s[a],u=o.trim();if(u.length!==0){var c=u.split("=");if(c.length!==2||!e.validateKeyChars(c[0])||n[c[0]])return null;n[c[0]]=!0,r.push(u)}}return r},e.strict=!0,e}();Zv.exports=MR});var Dt=l((Oq,Jv)=>{"use strict";var LR=function(){function e(){}return e}();Jv.exports=LR});var tg=l((sl,eg)=>{"use strict";var qR=sl&&sl.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),jR=Dt(),kR=function(e){qR(t,e);function t(){var r=e.call(this)||this;return r.ver=2,r.properties={},r.measurements={},r}return t}(jR);eg.exports=kR});var ol=l((Pq,rg)=>{"use strict";var HR=function(){function e(){}return e}();rg.exports=HR});var ig=l((Rq,ng)=>{"use strict";var UR=function(){function e(){this.applicationVersion="ai.application.ver",this.deviceId="ai.device.id",this.deviceLocale="ai.device.locale",this.deviceModel="ai.device.model",this.deviceOEMName="ai.device.oemName",this.deviceOSVersion="ai.device.osVersion",this.deviceType="ai.device.type",this.locationIp="ai.location.ip",this.operationId="ai.operation.id",this.operationName="ai.operation.name",this.operationParentId="ai.operation.parentId",this.operationSyntheticSource="ai.operation.syntheticSource",this.operationCorrelationVector="ai.operation.correlationVector",this.sessionId="ai.session.id",this.sessionIsFirst="ai.session.isFirst",this.userAccountId="ai.user.accountId",this.userId="ai.user.id",this.userAuthUserId="ai.user.authUserId",this.cloudRole="ai.cloud.role",this.cloudRoleInstance="ai.cloud.roleInstance",this.internalSdkVersion="ai.internal.sdkVersion",this.internalAgentVersion="ai.internal.agentVersion",this.internalNodeName="ai.internal.nodeName"}return e}();ng.exports=UR});var sg=l((ul,ag)=>{"use strict";var BR=ul&&ul.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),GR=ol(),FR=function(e){BR(t,e);function t(){return e.call(this)||this}return t}(GR);ag.exports=FR});var ll=l((Nq,og)=>{"use strict";var cl;(function(e){e[e.Measurement=0]="Measurement",e[e.Aggregation=1]="Aggregation"})(cl||(cl={}));og.exports=cl});var cg=l((Dq,ug)=>{"use strict";var VR=ll(),$R=function(){function e(){this.kind=VR.Measurement}return e}();ug.exports=$R});var pg=l((wq,lg)=>{"use strict";var zR=function(){function e(){this.ver=1,this.sampleRate=100,this.tags={}}return e}();lg.exports=zR});var fl=l((pl,fg)=>{"use strict";var KR=pl&&pl.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),XR=Dt(),YR=function(e){KR(t,e);function t(){var r=e.call(this)||this;return r.ver=2,r.properties={},r.measurements={},r}return t}(XR);fg.exports=YR});var hg=l((dl,dg)=>{"use strict";var QR=dl&&dl.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),WR=Dt(),ZR=function(e){QR(t,e);function t(){var r=e.call(this)||this;return r.ver=2,r.exceptions=[],r.properties={},r.measurements={},r}return t}(WR);dg.exports=ZR});var vg=l((xq,_g)=>{"use strict";var JR=function(){function e(){this.hasFullStack=!0,this.parsedStack=[]}return e}();_g.exports=JR});var Eg=l((hl,gg)=>{"use strict";var e0=hl&&hl.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),t0=Dt(),r0=function(e){e0(t,e);function t(){var r=e.call(this)||this;return r.ver=2,r.properties={},r}return t}(t0);gg.exports=r0});var yg=l((_l,mg)=>{"use strict";var n0=_l&&_l.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),i0=Dt(),a0=function(e){n0(t,e);function t(){var r=e.call(this)||this;return r.ver=2,r.metrics=[],r.properties={},r}return t}(i0);mg.exports=a0});var Sg=l((vl,Tg)=>{"use strict";var s0=vl&&vl.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),o0=fl(),u0=function(e){s0(t,e);function t(){var r=e.call(this)||this;return r.ver=2,r.properties={},r.measurements={},r}return t}(o0);Tg.exports=u0});var Ig=l((gl,Ag)=>{"use strict";var c0=gl&&gl.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),l0=Dt(),p0=function(e){c0(t,e);function t(){var r=e.call(this)||this;return r.ver=2,r.success=!0,r.properties={},r.measurements={},r}return t}(l0);Ag.exports=p0});var Cg=l((El,bg)=>{"use strict";var f0=El&&El.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),d0=Dt(),h0=function(e){f0(t,e);function t(){var r=e.call(this)||this;return r.ver=2,r.properties={},r.measurements={},r}return t}(d0);bg.exports=h0});var Pg=l((Mq,Og)=>{"use strict";var ml;(function(e){e[e.Verbose=0]="Verbose",e[e.Information=1]="Information",e[e.Warning=2]="Warning",e[e.Error=3]="Error",e[e.Critical=4]="Critical"})(ml||(ml={}));Og.exports=ml});var Ng=l((Lq,Rg)=>{"use strict";var _0=function(){function e(){}return e}();Rg.exports=_0});var yl=l(fe=>{"use strict";Object.defineProperty(fe,"__esModule",{value:!0});fe.AvailabilityData=tg();fe.Base=ol();fe.ContextTagKeys=ig();fe.Data=sg();fe.DataPoint=cg();fe.DataPointType=ll();fe.Domain=Dt();fe.Envelope=pg();fe.EventData=fl();fe.ExceptionData=hg();fe.ExceptionDetails=vg();fe.MessageData=Eg();fe.MetricData=yg();fe.PageViewData=Sg();fe.RemoteDependencyData=Ig();fe.RequestData=Cg();fe.SeverityLevel=Pg();fe.StackFrame=Ng()});var Dg=l(Hn=>{"use strict";Object.defineProperty(Hn,"__esModule",{value:!0});Hn.domainSupportsProperties=Hn.RemoteDependencyDataConstants=void 0;var Fr=yl(),v0=function(){function e(){}return e.TYPE_HTTP="Http",e.TYPE_AI="Http (tracked component)",e}();Hn.RemoteDependencyDataConstants=v0;function g0(e){return"properties"in e||e instanceof Fr.EventData||e instanceof Fr.ExceptionData||e instanceof Fr.MessageData||e instanceof Fr.MetricData||e instanceof Fr.PageViewData||e instanceof Fr.RemoteDependencyData||e instanceof Fr.RequestData}Hn.domainSupportsProperties=g0});var xg=l(wg=>{"use strict";Object.defineProperty(wg,"__esModule",{value:!0})});var Lg=l(Mg=>{"use strict";Object.defineProperty(Mg,"__esModule",{value:!0})});var jg=l(qg=>{"use strict";Object.defineProperty(qg,"__esModule",{value:!0})});var Hg=l(kg=>{"use strict";Object.defineProperty(kg,"__esModule",{value:!0})});var Bg=l(Ug=>{"use strict";Object.defineProperty(Ug,"__esModule",{value:!0})});var Fg=l(Gg=>{"use strict";Object.defineProperty(Gg,"__esModule",{value:!0})});var $g=l(Vg=>{"use strict";Object.defineProperty(Vg,"__esModule",{value:!0})});var Kg=l(zg=>{"use strict";Object.defineProperty(zg,"__esModule",{value:!0})});var Yg=l(Xg=>{"use strict";Object.defineProperty(Xg,"__esModule",{value:!0})});var Wg=l(Qg=>{"use strict";Object.defineProperty(Qg,"__esModule",{value:!0})});var Jg=l(Zg=>{"use strict";Object.defineProperty(Zg,"__esModule",{value:!0})});var tE=l(eE=>{"use strict";Object.defineProperty(eE,"__esModule",{value:!0})});var rE=l(st=>{"use strict";Object.defineProperty(st,"__esModule",{value:!0});st.TelemetryType=st.TelemetryTypeString=st.baseTypeToTelemetryType=st.telemetryTypeToBaseType=void 0;function E0(e){switch(e){case Te.Event:return"EventData";case Te.Exception:return"ExceptionData";case Te.Trace:return"MessageData";case Te.Metric:return"MetricData";case Te.Request:return"RequestData";case Te.Dependency:return"RemoteDependencyData";case Te.Availability:return"AvailabilityData";case Te.PageView:return"PageViewData"}}st.telemetryTypeToBaseType=E0;function m0(e){switch(e){case"EventData":return Te.Event;case"ExceptionData":return Te.Exception;case"MessageData":return Te.Trace;case"MetricData":return Te.Metric;case"RequestData":return Te.Request;case"RemoteDependencyData":return Te.Dependency;case"AvailabilityData":return Te.Availability;case"PageViewData":return Te.PageView}}st.baseTypeToTelemetryType=m0;st.TelemetryTypeString={Event:"EventData",Exception:"ExceptionData",Trace:"MessageData",Metric:"MetricData",Request:"RequestData",Dependency:"RemoteDependencyData",Availability:"AvailabilityData",PageView:"PageViewData"};var Te;(function(e){e[e.Event=0]="Event",e[e.Exception=1]="Exception",e[e.Trace=2]="Trace",e[e.Metric=3]="Metric",e[e.Request=4]="Request",e[e.Dependency=5]="Dependency",e[e.Availability=6]="Availability",e[e.PageView=7]="PageView"})(Te=st.TelemetryType||(st.TelemetryType={}))});var nE=l(_e=>{"use strict";var y0=_e&&_e.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),Ge=_e&&_e.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&y0(t,e,r)};Object.defineProperty(_e,"__esModule",{value:!0});Ge(xg(),_e);Ge(Lg(),_e);Ge(jg(),_e);Ge(Hg(),_e);Ge(Bg(),_e);Ge(Fg(),_e);Ge($g(),_e);Ge(Kg(),_e);Ge(Yg(),_e);Ge(Wg(),_e);Ge(Jg(),_e);Ge(tE(),_e);Ge(rE(),_e)});var aE=l(iE=>{"use strict";Object.defineProperty(iE,"__esModule",{value:!0})});var oE=l(sE=>{"use strict";Object.defineProperty(sE,"__esModule",{value:!0})});var cE=l(uE=>{"use strict";Object.defineProperty(uE,"__esModule",{value:!0})});var pE=l(lE=>{"use strict";Object.defineProperty(lE,"__esModule",{value:!0})});var dE=l(fE=>{"use strict";Object.defineProperty(fE,"__esModule",{value:!0})});var _E=l(hE=>{"use strict";Object.defineProperty(hE,"__esModule",{value:!0})});var gE=l(vE=>{"use strict";Object.defineProperty(vE,"__esModule",{value:!0})});var mE=l(EE=>{"use strict";Object.defineProperty(EE,"__esModule",{value:!0})});var yE=l(qe=>{"use strict";var T0=qe&&qe.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),nr=qe&&qe.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&T0(t,e,r)};Object.defineProperty(qe,"__esModule",{value:!0});nr(aE(),qe);nr(oE(),qe);nr(cE(),qe);nr(pE(),qe);nr(dE(),qe);nr(_E(),qe);nr(gE(),qe);nr(mE(),qe)});var De=l(vt=>{"use strict";var S0=vt&&vt.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),go=vt&&vt.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&S0(t,e,r)};Object.defineProperty(vt,"__esModule",{value:!0});go(Dg(),vt);go(yl(),vt);go(nE(),vt);go(yE(),vt)});var Tl=l((u1,TE)=>{"use strict";var A0=function(){function e(){}return e.prototype.getUrl=function(){return this.url},e.prototype.RequestParser=function(){this.startTime=+new Date},e.prototype._setStatus=function(t,r){var n=+new Date;this.duration=n-this.startTime,this.statusCode=t;var i=this.properties||{};if(r){if(typeof r=="string")i.error=r;else if(r instanceof Error)i.error=r.message;else if(typeof r=="object")for(var a in r)i[a]=r[a]&&r[a].toString&&r[a].toString()}this.properties=i},e.prototype._isSuccess=function(){return 0<this.statusCode&&this.statusCode<400},e}();TE.exports=A0});var Il=l((Al,AE)=>{"use strict";var I0=Al&&Al.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),Eo=__webpack_require__(/*! url */ "url"),b0=De(),SE=Be(),Fe=jn(),C0=Tl(),ir=Gr(),O0=al(),Sl=Zi(),P0=function(e){I0(t,e);function t(r,n){var i=e.call(this)||this;return r&&(i.method=r.method,i.url=i._getAbsoluteUrl(r),i.startTime=+new Date,i.socketRemoteAddress=r.socket&&r.socket.remoteAddress,i.parseHeaders(r,n),r.connection&&(i.connectionRemoteAddress=r.connection.remoteAddress,i.legacySocketRemoteAddress=r.connection.socket&&r.connection.socket.remoteAddress)),i}return t.prototype.onError=function(r,n){this._setStatus(void 0,r),n&&(this.duration=n)},t.prototype.onResponse=function(r,n){this._setStatus(r.statusCode,void 0),n&&(this.duration=n)},t.prototype.getRequestTelemetry=function(r){var n={id:this.requestId,name:this.method+" "+Eo.parse(this.url).pathname,url:this.url,source:this.sourceCorrelationId,duration:this.duration,resultCode:this.statusCode?this.statusCode.toString():null,success:this._isSuccess(),properties:this.properties};if(r&&r.time?n.time=r.time:this.startTime&&(n.time=new Date(this.startTime)),r){for(var i in r)n[i]||(n[i]=r[i]);if(r.properties)for(var i in r.properties)n.properties[i]=r.properties[i]}return n},t.prototype.getRequestTags=function(r){var n={};for(var i in r)n[i]=r[i];return n[t.keys.locationIp]=r[t.keys.locationIp]||this._getIp(),n[t.keys.sessionId]=r[t.keys.sessionId]||this._getId("ai_session"),n[t.keys.userId]=r[t.keys.userId]||this._getId("ai_user"),n[t.keys.userAuthUserId]=r[t.keys.userAuthUserId]||this._getId("ai_authUser"),n[t.keys.operationName]=this.getOperationName(r),n[t.keys.operationParentId]=this.getOperationParentId(r),n[t.keys.operationId]=this.getOperationId(r),n},t.prototype.getOperationId=function(r){return r[t.keys.operationId]||this.operationId},t.prototype.getOperationParentId=function(r){return r[t.keys.operationParentId]||this.parentId||this.getOperationId(r)},t.prototype.getOperationName=function(r){return r[t.keys.operationName]||this.method+" "+Eo.parse(this.url).pathname},t.prototype.getRequestId=function(){return this.requestId},t.prototype.getCorrelationContextHeader=function(){return this.correlationContextHeader},t.prototype.getTraceparent=function(){return this.traceparent},t.prototype.getTracestate=function(){return this.tracestate},t.prototype.getLegacyRootId=function(){return this.legacyRootId},t.prototype._getAbsoluteUrl=function(r){if(!r.headers)return r.url;var n=r.connection?r.connection.encrypted:null,i=Eo.parse(r.url),a=i.pathname,s=i.search,o=n||r.headers["x-forwarded-proto"]=="https"?"https":"http",u=Eo.format({protocol:o,host:r.headers.host,pathname:a,search:s});return u},t.prototype._getIp=function(){var r=/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,n=function(a){var s=r.exec(a);if(s)return s[0]},i=n(this.rawHeaders["x-forwarded-for"])||n(this.rawHeaders["x-client-ip"])||n(this.rawHeaders["x-real-ip"])||n(this.connectionRemoteAddress)||n(this.socketRemoteAddress)||n(this.legacySocketRemoteAddress);return!i&&this.connectionRemoteAddress&&this.connectionRemoteAddress.substr&&this.connectionRemoteAddress.substr(0,2)==="::"&&(i="127.0.0.1"),i},t.prototype._getId=function(r){var n=this.rawHeaders&&this.rawHeaders.cookie&&typeof this.rawHeaders.cookie=="string"&&this.rawHeaders.cookie||"",i=t.parseId(SE.getCookie(r,n));return i},t.prototype.setBackCompatFromThisTraceContext=function(){this.operationId=this.traceparent.traceId,this.traceparent.legacyRootId&&(this.legacyRootId=this.traceparent.legacyRootId),this.parentId=this.traceparent.parentId,this.traceparent.updateSpanId(),this.requestId=this.traceparent.getBackCompatRequestId()},t.prototype.parseHeaders=function(r,n){if(this.rawHeaders=r.headers||r.rawHeaders,this.userAgent=r.headers&&r.headers["user-agent"],this.sourceCorrelationId=SE.getCorrelationContextTarget(r,Fe.requestContextSourceKey),r.headers){var i=r.headers[Fe.traceStateHeader]?r.headers[Fe.traceStateHeader].toString():null,a=r.headers[Fe.traceparentHeader]?r.headers[Fe.traceparentHeader].toString():null,s=r.headers[Fe.requestIdHeader]?r.headers[Fe.requestIdHeader].toString():null,o=r.headers[Fe.parentIdHeader]?r.headers[Fe.parentIdHeader].toString():null,u=r.headers[Fe.rootIdHeader]?r.headers[Fe.rootIdHeader].toString():null;this.correlationContextHeader=r.headers[Fe.correlationContextHeader]?r.headers[Fe.correlationContextHeader].toString():null,ir.w3cEnabled&&(a||i)?(this.traceparent=new Sl(a?a.toString():null),this.tracestate=a&&i&&new O0(i?i.toString():null),this.setBackCompatFromThisTraceContext()):s?ir.w3cEnabled?(this.traceparent=new Sl(null,s),this.setBackCompatFromThisTraceContext()):(this.parentId=s,this.requestId=ir.generateRequestId(this.parentId),this.operationId=ir.getRootId(this.requestId)):ir.w3cEnabled?(this.traceparent=new Sl,this.traceparent.parentId=o,this.traceparent.legacyRootId=u||o,this.setBackCompatFromThisTraceContext()):(this.parentId=o,this.requestId=ir.generateRequestId(u||this.parentId),this.correlationContextHeader=null,this.operationId=ir.getRootId(this.requestId)),n&&(this.requestId=n,this.operationId=ir.getRootId(this.requestId))}},t.parseId=function(r){var n=r.split("|");return n.length>0?n[0]:""},t.keys=new b0.ContextTagKeys,t}(C0);AE.exports=P0});var UE=l((b,HE)=>{b=HE.exports=D;var H;typeof process=="object"&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?H=function(){var e=Array.prototype.slice.call(arguments,0);e.unshift("SEMVER"),console.log.apply(console,e)}:H=function(){};b.SEMVER_SPEC_VERSION="2.0.0";var bl=256,mo=Number.MAX_SAFE_INTEGER||9007199254740991,Cl=16,G=b.re=[],v=b.src=[],P=0,Un=P++;v[Un]="0|[1-9]\\d*";var Bn=P++;v[Bn]="[0-9]+";var Ol=P++;v[Ol]="\\d*[a-zA-Z-][a-zA-Z0-9-]*";var IE=P++;v[IE]="("+v[Un]+")\\.("+v[Un]+")\\.("+v[Un]+")";var bE=P++;v[bE]="("+v[Bn]+")\\.("+v[Bn]+")\\.("+v[Bn]+")";var Pl=P++;v[Pl]="(?:"+v[Un]+"|"+v[Ol]+")";var Rl=P++;v[Rl]="(?:"+v[Bn]+"|"+v[Ol]+")";var Nl=P++;v[Nl]="(?:-("+v[Pl]+"(?:\\."+v[Pl]+")*))";var Dl=P++;v[Dl]="(?:-?("+v[Rl]+"(?:\\."+v[Rl]+")*))";var wl=P++;v[wl]="[0-9A-Za-z-]+";var Ji=P++;v[Ji]="(?:\\+("+v[wl]+"(?:\\."+v[wl]+")*))";var xl=P++,CE="v?"+v[IE]+v[Nl]+"?"+v[Ji]+"?";v[xl]="^"+CE+"$";var Ml="[v=\\s]*"+v[bE]+v[Dl]+"?"+v[Ji]+"?",Ll=P++;v[Ll]="^"+Ml+"$";var Gn=P++;v[Gn]="((?:<|>)?=?)";var yo=P++;v[yo]=v[Bn]+"|x|X|\\*";var To=P++;v[To]=v[Un]+"|x|X|\\*";var Vr=P++;v[Vr]="[v=\\s]*("+v[To]+")(?:\\.("+v[To]+")(?:\\.("+v[To]+")(?:"+v[Nl]+")?"+v[Ji]+"?)?)?";var Fn=P++;v[Fn]="[v=\\s]*("+v[yo]+")(?:\\.("+v[yo]+")(?:\\.("+v[yo]+")(?:"+v[Dl]+")?"+v[Ji]+"?)?)?";var OE=P++;v[OE]="^"+v[Gn]+"\\s*"+v[Vr]+"$";var PE=P++;v[PE]="^"+v[Gn]+"\\s*"+v[Fn]+"$";var RE=P++;v[RE]="(?:^|[^\\d])(\\d{1,"+Cl+"})(?:\\.(\\d{1,"+Cl+"}))?(?:\\.(\\d{1,"+Cl+"}))?(?:$|[^\\d])";var So=P++;v[So]="(?:~>?)";var Ao=P++;v[Ao]="(\\s*)"+v[So]+"\\s+";G[Ao]=new RegExp(v[Ao],"g");var R0="$1~",NE=P++;v[NE]="^"+v[So]+v[Vr]+"$";var DE=P++;v[DE]="^"+v[So]+v[Fn]+"$";var Io=P++;v[Io]="(?:\\^)";var bo=P++;v[bo]="(\\s*)"+v[Io]+"\\s+";G[bo]=new RegExp(v[bo],"g");var N0="$1^",wE=P++;v[wE]="^"+v[Io]+v[Vr]+"$";var xE=P++;v[xE]="^"+v[Io]+v[Fn]+"$";var ql=P++;v[ql]="^"+v[Gn]+"\\s*("+Ml+")$|^$";var jl=P++;v[jl]="^"+v[Gn]+"\\s*("+CE+")$|^$";var ea=P++;v[ea]="(\\s*)"+v[Gn]+"\\s*("+Ml+"|"+v[Vr]+")";G[ea]=new RegExp(v[ea],"g");var D0="$1$2$3",ME=P++;v[ME]="^\\s*("+v[Vr]+")\\s+-\\s+("+v[Vr]+")\\s*$";var LE=P++;v[LE]="^\\s*("+v[Fn]+")\\s+-\\s+("+v[Fn]+")\\s*$";var qE=P++;v[qE]="(<|>)?=?\\s*\\*";for(ar=0;ar<P;ar++)H(ar,v[ar]),G[ar]||(G[ar]=new RegExp(v[ar]));var ar;b.parse=$r;function $r(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof D)return e;if(typeof e!="string"||e.length>bl)return null;var r=t.loose?G[Ll]:G[xl];if(!r.test(e))return null;try{return new D(e,t)}catch(n){return null}}b.valid=w0;function w0(e,t){var r=$r(e,t);return r?r.version:null}b.clean=x0;function x0(e,t){var r=$r(e.trim().replace(/^[=v]+/,""),t);return r?r.version:null}b.SemVer=D;function D(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof D){if(e.loose===t.loose)return e;e=e.version}else if(typeof e!="string")throw new TypeError("Invalid Version: "+e);if(e.length>bl)throw new TypeError("version is longer than "+bl+" characters");if(!(this instanceof D))return new D(e,t);H("SemVer",e,t),this.options=t,this.loose=!!t.loose;var r=e.trim().match(t.loose?G[Ll]:G[xl]);if(!r)throw new TypeError("Invalid Version: "+e);if(this.raw=e,this.major=+r[1],this.minor=+r[2],this.patch=+r[3],this.major>mo||this.major<0)throw new TypeError("Invalid major version");if(this.minor>mo||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>mo||this.patch<0)throw new TypeError("Invalid patch version");r[4]?this.prerelease=r[4].split(".").map(function(n){if(/^[0-9]+$/.test(n)){var i=+n;if(i>=0&&i<mo)return i}return n}):this.prerelease=[],this.build=r[5]?r[5].split("."):[],this.format()}D.prototype.format=function(){return this.version=this.major+"."+this.minor+"."+this.patch,this.prerelease.length&&(this.version+="-"+this.prerelease.join(".")),this.version};D.prototype.toString=function(){return this.version};D.prototype.compare=function(e){return H("SemVer.compare",this.version,this.options,e),e instanceof D||(e=new D(e,this.options)),this.compareMain(e)||this.comparePre(e)};D.prototype.compareMain=function(e){return e instanceof D||(e=new D(e,this.options)),Vn(this.major,e.major)||Vn(this.minor,e.minor)||Vn(this.patch,e.patch)};D.prototype.comparePre=function(e){if(e instanceof D||(e=new D(e,this.options)),this.prerelease.length&&!e.prerelease.length)return-1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;var t=0;do{var r=this.prerelease[t],n=e.prerelease[t];if(H("prerelease compare",t,r,n),r===void 0&&n===void 0)return 0;if(n===void 0)return 1;if(r===void 0)return-1;if(r===n)continue;return Vn(r,n)}while(++t)};D.prototype.inc=function(e,t){switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",t);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",t);break;case"prepatch":this.prerelease.length=0,this.inc("patch",t),this.inc("pre",t);break;case"prerelease":this.prerelease.length===0&&this.inc("patch",t),this.inc("pre",t);break;case"major":(this.minor!==0||this.patch!==0||this.prerelease.length===0)&&this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":(this.patch!==0||this.prerelease.length===0)&&this.minor++,this.patch=0,this.prerelease=[];break;case"patch":this.prerelease.length===0&&this.patch++,this.prerelease=[];break;case"pre":if(this.prerelease.length===0)this.prerelease=[0];else{for(var r=this.prerelease.length;--r>=0;)typeof this.prerelease[r]=="number"&&(this.prerelease[r]++,r=-2);r===-1&&this.prerelease.push(0)}t&&(this.prerelease[0]===t?isNaN(this.prerelease[1])&&(this.prerelease=[t,0]):this.prerelease=[t,0]);break;default:throw new Error("invalid increment argument: "+e)}return this.format(),this.raw=this.version,this};b.inc=M0;function M0(e,t,r,n){typeof r=="string"&&(n=r,r=void 0);try{return new D(e,r).inc(t,n).version}catch(i){return null}}b.diff=L0;function L0(e,t){if(kl(e,t))return null;var r=$r(e),n=$r(t),i="";if(r.prerelease.length||n.prerelease.length){i="pre";var a="prerelease"}for(var s in r)if((s==="major"||s==="minor"||s==="patch")&&r[s]!==n[s])return i+s;return a}b.compareIdentifiers=Vn;var jE=/^[0-9]+$/;function Vn(e,t){var r=jE.test(e),n=jE.test(t);return r&&n&&(e=+e,t=+t),e===t?0:r&&!n?-1:n&&!r?1:e<t?-1:1}b.rcompareIdentifiers=q0;function q0(e,t){return Vn(t,e)}b.major=j0;function j0(e,t){return new D(e,t).major}b.minor=k0;function k0(e,t){return new D(e,t).minor}b.patch=H0;function H0(e,t){return new D(e,t).patch}b.compare=wt;function wt(e,t,r){return new D(e,r).compare(new D(t,r))}b.compareLoose=U0;function U0(e,t){return wt(e,t,!0)}b.rcompare=B0;function B0(e,t,r){return wt(t,e,r)}b.sort=G0;function G0(e,t){return e.sort(function(r,n){return b.compare(r,n,t)})}b.rsort=F0;function F0(e,t){return e.sort(function(r,n){return b.rcompare(r,n,t)})}b.gt=ta;function ta(e,t,r){return wt(e,t,r)>0}b.lt=Co;function Co(e,t,r){return wt(e,t,r)<0}b.eq=kl;function kl(e,t,r){return wt(e,t,r)===0}b.neq=kE;function kE(e,t,r){return wt(e,t,r)!==0}b.gte=Hl;function Hl(e,t,r){return wt(e,t,r)>=0}b.lte=Ul;function Ul(e,t,r){return wt(e,t,r)<=0}b.cmp=Oo;function Oo(e,t,r,n){switch(t){case"===":return typeof e=="object"&&(e=e.version),typeof r=="object"&&(r=r.version),e===r;case"!==":return typeof e=="object"&&(e=e.version),typeof r=="object"&&(r=r.version),e!==r;case"":case"=":case"==":return kl(e,r,n);case"!=":return kE(e,r,n);case">":return ta(e,r,n);case">=":return Hl(e,r,n);case"<":return Co(e,r,n);case"<=":return Ul(e,r,n);default:throw new TypeError("Invalid operator: "+t)}}b.Comparator=Ye;function Ye(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof Ye){if(e.loose===!!t.loose)return e;e=e.value}if(!(this instanceof Ye))return new Ye(e,t);H("comparator",e,t),this.options=t,this.loose=!!t.loose,this.parse(e),this.semver===ra?this.value="":this.value=this.operator+this.semver.version,H("comp",this)}var ra={};Ye.prototype.parse=function(e){var t=this.options.loose?G[ql]:G[jl],r=e.match(t);if(!r)throw new TypeError("Invalid comparator: "+e);this.operator=r[1],this.operator==="="&&(this.operator=""),r[2]?this.semver=new D(r[2],this.options.loose):this.semver=ra};Ye.prototype.toString=function(){return this.value};Ye.prototype.test=function(e){return H("Comparator.test",e,this.options.loose),this.semver===ra?!0:(typeof e=="string"&&(e=new D(e,this.options)),Oo(e,this.operator,this.semver,this.options))};Ye.prototype.intersects=function(e,t){if(!(e instanceof Ye))throw new TypeError("a Comparator is required");(!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1});var r;if(this.operator==="")return r=new J(e.value,t),Po(this.value,r,t);if(e.operator==="")return r=new J(this.value,t),Po(e.semver,r,t);var n=(this.operator===">="||this.operator===">")&&(e.operator===">="||e.operator===">"),i=(this.operator==="<="||this.operator==="<")&&(e.operator==="<="||e.operator==="<"),a=this.semver.version===e.semver.version,s=(this.operator===">="||this.operator==="<=")&&(e.operator===">="||e.operator==="<="),o=Oo(this.semver,"<",e.semver,t)&&(this.operator===">="||this.operator===">")&&(e.operator==="<="||e.operator==="<"),u=Oo(this.semver,">",e.semver,t)&&(this.operator==="<="||this.operator==="<")&&(e.operator===">="||e.operator===">");return n||i||a&&s||o||u};b.Range=J;function J(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof J)return e.loose===!!t.loose&&e.includePrerelease===!!t.includePrerelease?e:new J(e.raw,t);if(e instanceof Ye)return new J(e.value,t);if(!(this instanceof J))return new J(e,t);if(this.options=t,this.loose=!!t.loose,this.includePrerelease=!!t.includePrerelease,this.raw=e,this.set=e.split(/\s*\|\|\s*/).map(function(r){return this.parseRange(r.trim())},this).filter(function(r){return r.length}),!this.set.length)throw new TypeError("Invalid SemVer Range: "+e);this.format()}J.prototype.format=function(){return this.range=this.set.map(function(e){return e.join(" ").trim()}).join("||").trim(),this.range};J.prototype.toString=function(){return this.range};J.prototype.parseRange=function(e){var t=this.options.loose;e=e.trim();var r=t?G[LE]:G[ME];e=e.replace(r,J0),H("hyphen replace",e),e=e.replace(G[ea],D0),H("comparator trim",e,G[ea]),e=e.replace(G[Ao],R0),e=e.replace(G[bo],N0),e=e.split(/\s+/).join(" ");var n=t?G[ql]:G[jl],i=e.split(" ").map(function(a){return $0(a,this.options)},this).join(" ").split(/\s+/);return this.options.loose&&(i=i.filter(function(a){return!!a.match(n)})),i=i.map(function(a){return new Ye(a,this.options)},this),i};J.prototype.intersects=function(e,t){if(!(e instanceof J))throw new TypeError("a Range is required");return this.set.some(function(r){return r.every(function(n){return e.set.some(function(i){return i.every(function(a){return n.intersects(a,t)})})})})};b.toComparators=V0;function V0(e,t){return new J(e,t).set.map(function(r){return r.map(function(n){return n.value}).join(" ").trim().split(" ")})}function $0(e,t){return H("comp",e,t),e=X0(e,t),H("caret",e),e=z0(e,t),H("tildes",e),e=Q0(e,t),H("xrange",e),e=Z0(e,t),H("stars",e),e}function we(e){return!e||e.toLowerCase()==="x"||e==="*"}function z0(e,t){return e.trim().split(/\s+/).map(function(r){return K0(r,t)}).join(" ")}function K0(e,t){var r=t.loose?G[DE]:G[NE];return e.replace(r,function(n,i,a,s,o){H("tilde",e,n,i,a,s,o);var u;return we(i)?u="":we(a)?u=">="+i+".0.0 <"+(+i+1)+".0.0":we(s)?u=">="+i+"."+a+".0 <"+i+"."+(+a+1)+".0":o?(H("replaceTilde pr",o),u=">="+i+"."+a+"."+s+"-"+o+" <"+i+"."+(+a+1)+".0"):u=">="+i+"."+a+"."+s+" <"+i+"."+(+a+1)+".0",H("tilde return",u),u})}function X0(e,t){return e.trim().split(/\s+/).map(function(r){return Y0(r,t)}).join(" ")}function Y0(e,t){H("caret",e,t);var r=t.loose?G[xE]:G[wE];return e.replace(r,function(n,i,a,s,o){H("caret",e,n,i,a,s,o);var u;return we(i)?u="":we(a)?u=">="+i+".0.0 <"+(+i+1)+".0.0":we(s)?i==="0"?u=">="+i+"."+a+".0 <"+i+"."+(+a+1)+".0":u=">="+i+"."+a+".0 <"+(+i+1)+".0.0":o?(H("replaceCaret pr",o),i==="0"?a==="0"?u=">="+i+"."+a+"."+s+"-"+o+" <"+i+"."+a+"."+(+s+1):u=">="+i+"."+a+"."+s+"-"+o+" <"+i+"."+(+a+1)+".0":u=">="+i+"."+a+"."+s+"-"+o+" <"+(+i+1)+".0.0"):(H("no pr"),i==="0"?a==="0"?u=">="+i+"."+a+"."+s+" <"+i+"."+a+"."+(+s+1):u=">="+i+"."+a+"."+s+" <"+i+"."+(+a+1)+".0":u=">="+i+"."+a+"."+s+" <"+(+i+1)+".0.0"),H("caret return",u),u})}function Q0(e,t){return H("replaceXRanges",e,t),e.split(/\s+/).map(function(r){return W0(r,t)}).join(" ")}function W0(e,t){e=e.trim();var r=t.loose?G[PE]:G[OE];return e.replace(r,function(n,i,a,s,o,u){H("xRange",e,n,i,a,s,o,u);var c=we(a),p=c||we(s),f=p||we(o),d=f;return i==="="&&d&&(i=""),c?i===">"||i==="<"?n="<0.0.0":n="*":i&&d?(p&&(s=0),o=0,i===">"?(i=">=",p?(a=+a+1,s=0,o=0):(s=+s+1,o=0)):i==="<="&&(i="<",p?a=+a+1:s=+s+1),n=i+a+"."+s+"."+o):p?n=">="+a+".0.0 <"+(+a+1)+".0.0":f&&(n=">="+a+"."+s+".0 <"+a+"."+(+s+1)+".0"),H("xRange return",n),n})}function Z0(e,t){return H("replaceStars",e,t),e.trim().replace(G[qE],"")}function J0(e,t,r,n,i,a,s,o,u,c,p,f,d){return we(r)?t="":we(n)?t=">="+r+".0.0":we(i)?t=">="+r+"."+n+".0":t=">="+t,we(u)?o="":we(c)?o="<"+(+u+1)+".0.0":we(p)?o="<"+u+"."+(+c+1)+".0":f?o="<="+u+"."+c+"."+p+"-"+f:o="<="+o,(t+" "+o).trim()}J.prototype.test=function(e){if(!e)return!1;typeof e=="string"&&(e=new D(e,this.options));for(var t=0;t<this.set.length;t++)if(eN(this.set[t],e,this.options))return!0;return!1};function eN(e,t,r){for(var n=0;n<e.length;n++)if(!e[n].test(t))return!1;if(t.prerelease.length&&!r.includePrerelease){for(n=0;n<e.length;n++)if(H(e[n].semver),e[n].semver!==ra&&e[n].semver.prerelease.length>0){var i=e[n].semver;if(i.major===t.major&&i.minor===t.minor&&i.patch===t.patch)return!0}return!1}return!0}b.satisfies=Po;function Po(e,t,r){try{t=new J(t,r)}catch(n){return!1}return t.test(e)}b.maxSatisfying=tN;function tN(e,t,r){var n=null,i=null;try{var a=new J(t,r)}catch(s){return null}return e.forEach(function(s){a.test(s)&&(!n||i.compare(s)===-1)&&(n=s,i=new D(n,r))}),n}b.minSatisfying=rN;function rN(e,t,r){var n=null,i=null;try{var a=new J(t,r)}catch(s){return null}return e.forEach(function(s){a.test(s)&&(!n||i.compare(s)===1)&&(n=s,i=new D(n,r))}),n}b.minVersion=nN;function nN(e,t){e=new J(e,t);var r=new D("0.0.0");if(e.test(r)||(r=new D("0.0.0-0"),e.test(r)))return r;r=null;for(var n=0;n<e.set.length;++n){var i=e.set[n];i.forEach(function(a){var s=new D(a.semver.version);switch(a.operator){case">":s.prerelease.length===0?s.patch++:s.prerelease.push(0),s.raw=s.format();case"":case">=":(!r||ta(r,s))&&(r=s);break;case"<":case"<=":break;default:throw new Error("Unexpected operation: "+a.operator)}})}return r&&e.test(r)?r:null}b.validRange=iN;function iN(e,t){try{return new J(e,t).range||"*"}catch(r){return null}}b.ltr=aN;function aN(e,t,r){return Bl(e,t,"<",r)}b.gtr=sN;function sN(e,t,r){return Bl(e,t,">",r)}b.outside=Bl;function Bl(e,t,r,n){e=new D(e,n),t=new J(t,n);var i,a,s,o,u;switch(r){case">":i=ta,a=Ul,s=Co,o=">",u=">=";break;case"<":i=Co,a=Hl,s=ta,o="<",u="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if(Po(e,t,n))return!1;for(var c=0;c<t.set.length;++c){var p=t.set[c],f=null,d=null;if(p.forEach(function(h){h.semver===ra&&(h=new Ye(">=0.0.0")),f=f||h,d=d||h,i(h.semver,f.semver,n)?f=h:s(h.semver,d.semver,n)&&(d=h)}),f.operator===o||f.operator===u||(!d.operator||d.operator===o)&&a(e,d.semver))return!1;if(d.operator===u&&s(e,d.semver))return!1}return!0}b.prerelease=oN;function oN(e,t){var r=$r(e,t);return r&&r.prerelease.length?r.prerelease:null}b.intersects=uN;function uN(e,t,r){return e=new J(e,r),t=new J(t,r),e.intersects(t)}b.coerce=cN;function cN(e){if(e instanceof D)return e;if(typeof e!="string")return null;var t=e.match(G[RE]);return t==null?null:$r(t[1]+"."+(t[2]||"0")+"."+(t[3]||"0"))}});var Ro=l((c1,FE)=>{"use strict";function Gl(e){return typeof e=="function"}var xe=console.error.bind(console);function na(e,t,r){var n=!!e[t]&&e.propertyIsEnumerable(t);Object.defineProperty(e,t,{configurable:!0,enumerable:n,writable:!0,value:r})}function ia(e){e&&e.logger&&(Gl(e.logger)?xe=e.logger:xe("new logger isn't a function, not replacing"))}function BE(e,t,r){if(!e||!e[t]){xe("no original function "+t+" to wrap");return}if(!r){xe("no wrapper function"),xe(new Error().stack);return}if(!Gl(e[t])||!Gl(r)){xe("original object and wrapper must be functions");return}var n=e[t],i=r(n,t);return na(i,"__original",n),na(i,"__unwrap",function(){e[t]===i&&na(e,t,n)}),na(i,"__wrapped",!0),na(e,t,i),i}function lN(e,t,r){if(e)Array.isArray(e)||(e=[e]);else{xe("must provide one or more modules to patch"),xe(new Error().stack);return}if(!(t&&Array.isArray(t))){xe("must provide one or more functions to wrap on modules");return}e.forEach(function(n){t.forEach(function(i){BE(n,i,r)})})}function GE(e,t){if(!e||!e[t]){xe("no function to unwrap."),xe(new Error().stack);return}if(!e[t].__unwrap)xe("no original to unwrap to -- has "+t+" already been unwrapped?");else return e[t].__unwrap()}function pN(e,t){if(e)Array.isArray(e)||(e=[e]);else{xe("must provide one or more modules to patch"),xe(new Error().stack);return}if(!(t&&Array.isArray(t))){xe("must provide one or more functions to unwrap on modules");return}e.forEach(function(r){t.forEach(function(n){GE(r,n)})})}ia.wrap=BE;ia.massWrap=lN;ia.unwrap=GE;ia.massUnwrap=pN;FE.exports=ia});var wo=l((l1,KE)=>{"use strict";var VE=Ro(),$n=VE.wrap,No=VE.unwrap,xt="wrap@before";function Do(e,t,r){var n=!!e[t]&&e.propertyIsEnumerable(t);Object.defineProperty(e,t,{configurable:!0,enumerable:n,writable:!0,value:r})}function fN(e,t){for(var r=t.length,n=0;n<r;n++){var i=t[n],a=e[xt];if(typeof a=="function")a(i);else if(Array.isArray(a))for(var s=a.length,o=0;o<s;o++)a[o](i)}}function $E(e,t){var r;return r=e._events&&e._events[t],Array.isArray(r)||(r?r=[r]:r=[]),r}function dN(e,t,r){var n=$E(e,t),i=n.filter(function(a){return r.indexOf(a)===-1});i.length>0&&fN(e,i)}function zE(e,t){if(!!e){var r=e;if(typeof e=="function")r=t(e);else if(Array.isArray(e)){r=[];for(var n=0;n<e.length;n++)r[n]=t(e[n])}return r}}KE.exports=function(t,r,n){if(!t||!t.on||!t.addListener||!t.removeListener||!t.emit)throw new Error("can only wrap real EEs");if(!r)throw new Error("must have function to run on listener addition");if(!n)throw new Error("must have function to wrap listeners when emitting");function i(s){return function(u,c){var p=$E(this,u).slice();try{var f=s.call(this,u,c);return dN(this,u,p),f}finally{this.on.__wrapped||$n(this,"on",i),this.addListener.__wrapped||$n(this,"addListener",i)}}}function a(s){return function(u){if(!this._events||!this._events[u])return s.apply(this,arguments);var c=this._events[u];function p(f){return function(){this._events[u]=c;try{return f.apply(this,arguments)}finally{c=this._events[u],this._events[u]=zE(c,n)}}}$n(this,"removeListener",p);try{return this._events[u]=zE(c,n),s.apply(this,arguments)}finally{No(this,"removeListener"),this._events[u]=c}}}t[xt]?typeof t[xt]=="function"?Do(t,xt,[t[xt],r]):Array.isArray(t[xt])&&t[xt].push(r):Do(t,xt,r),t.__wrapped||($n(t,"addListener",i),$n(t,"on",i),$n(t,"emit",a),Do(t,"__unwrap",function(){No(t,"addListener"),No(t,"on"),No(t,"emit"),delete t[xt],delete t.__wrapped}),Do(t,"__wrapped",!0))}});var WE=l((p1,QE)=>{"use strict";var L=__webpack_require__(/*! util */ "util"),Mt=__webpack_require__(/*! assert */ "assert"),hN=wo(),X=__webpack_require__(/*! async_hooks */ "async_hooks"),aa="cls@contexts",sa="error@context",ee=process.env.DEBUG_CLS_HOOKED,q=-1;QE.exports={getNamespace:XE,createNamespace:_N,destroyNamespace:YE,reset:vN,ERROR_SYMBOL:sa};function Qe(e){this.name=e,this.active=null,this._set=[],this.id=null,this._contexts=new Map,this._indent=0}Qe.prototype.set=function(t,r){if(!this.active)throw new Error("No context available. ns.run() or ns.bind() must be called first.");if(this.active[t]=r,ee){let n=" ".repeat(this._indent<0?0:this._indent);Q(n+"CONTEXT-SET KEY:"+t+"="+r+" in ns:"+this.name+" currentUid:"+q+" active:"+L.inspect(this.active,{showHidden:!0,depth:2,colors:!0}))}return r};Qe.prototype.get=function(t){if(!this.active){if(ee){let r=X.currentId(),n=X.triggerAsyncId(),i=" ".repeat(this._indent<0?0:this._indent);Q(`${i}CONTEXT-GETTING KEY NO ACTIVE NS: (${this.name}) ${t}=undefined currentUid:${q} asyncHooksCurrentId:${r} triggerId:${n} len:${this._set.length}`)}return}if(ee){let r=X.executionAsyncId(),n=X.triggerAsyncId(),i=" ".repeat(this._indent<0?0:this._indent);Q(i+"CONTEXT-GETTING KEY:"+t+"="+this.active[t]+" ("+this.name+") currentUid:"+q+" active:"+L.inspect(this.active,{showHidden:!0,depth:2,colors:!0})),Q(`${i}CONTEXT-GETTING KEY: (${this.name}) ${t}=${this.active[t]} currentUid:${q} asyncHooksCurrentId:${r} triggerId:${n} len:${this._set.length} active:${L.inspect(this.active)}`)}return this.active[t]};Qe.prototype.createContext=function(){let t=Object.create(this.active?this.active:Object.prototype);if(t._ns_name=this.name,t.id=q,ee){let r=X.executionAsyncId(),n=X.triggerAsyncId(),i=" ".repeat(this._indent<0?0:this._indent);Q(`${i}CONTEXT-CREATED Context: (${this.name}) currentUid:${q} asyncHooksCurrentId:${r} triggerId:${n} len:${this._set.length} context:${L.inspect(t,{showHidden:!0,depth:2,colors:!0})}`)}return t};Qe.prototype.run=function(t){let r=this.createContext();this.enter(r);try{if(ee){let n=X.triggerAsyncId(),i=X.executionAsyncId(),a=" ".repeat(this._indent<0?0:this._indent);Q(`${a}CONTEXT-RUN BEGIN: (${this.name}) currentUid:${q} triggerId:${n} asyncHooksCurrentId:${i} len:${this._set.length} context:${L.inspect(r)}`)}return t(r),r}catch(n){throw n&&(n[sa]=r),n}finally{if(ee){let n=X.triggerAsyncId(),i=X.executionAsyncId(),a=" ".repeat(this._indent<0?0:this._indent);Q(`${a}CONTEXT-RUN END: (${this.name}) currentUid:${q} triggerId:${n} asyncHooksCurrentId:${i} len:${this._set.length} ${L.inspect(r)}`)}this.exit(r)}};Qe.prototype.runAndReturn=function(t){let r;return this.run(function(n){r=t(n)}),r};Qe.prototype.runPromise=function(t){let r=this.createContext();this.enter(r);let n=t(r);if(!n||!n.then||!n.catch)throw new Error("fn must return a promise.");return ee&&Q("CONTEXT-runPromise BEFORE: ("+this.name+") currentUid:"+q+" len:"+this._set.length+" "+L.inspect(r)),n.then(i=>(ee&&Q("CONTEXT-runPromise AFTER then: ("+this.name+") currentUid:"+q+" len:"+this._set.length+" "+L.inspect(r)),this.exit(r),i)).catch(i=>{throw i[sa]=r,ee&&Q("CONTEXT-runPromise AFTER catch: ("+this.name+") currentUid:"+q+" len:"+this._set.length+" "+L.inspect(r)),this.exit(r),i})};Qe.prototype.bind=function(t,r){r||(this.active?r=this.active:r=this.createContext());let n=this;return function(){n.enter(r);try{return t.apply(this,arguments)}catch(a){throw a&&(a[sa]=r),a}finally{n.exit(r)}}};Qe.prototype.enter=function(t){if(Mt.ok(t,"context must be provided for entering"),ee){let r=X.executionAsyncId(),n=X.triggerAsyncId(),i=" ".repeat(this._indent<0?0:this._indent);Q(`${i}CONTEXT-ENTER: (${this.name}) currentUid:${q} triggerId:${n} asyncHooksCurrentId:${r} len:${this._set.length} ${L.inspect(t)}`)}this._set.push(this.active),this.active=t};Qe.prototype.exit=function(t){if(Mt.ok(t,"context must be provided for exiting"),ee){let n=X.executionAsyncId(),i=X.triggerAsyncId(),a=" ".repeat(this._indent<0?0:this._indent);Q(`${a}CONTEXT-EXIT: (${this.name}) currentUid:${q} triggerId:${i} asyncHooksCurrentId:${n} len:${this._set.length} ${L.inspect(t)}`)}if(this.active===t){Mt.ok(this._set.length,"can't remove top context"),this.active=this._set.pop();return}let r=this._set.lastIndexOf(t);r<0?(ee&&Q("??ERROR?? context exiting but not entered - ignoring: "+L.inspect(t)),Mt.ok(r>=0,`context not currently entered; can't exit. 
`+L.inspect(this)+`
`+L.inspect(t))):(Mt.ok(r,"can't remove top context"),this._set.splice(r,1))};Qe.prototype.bindEmitter=function(t){Mt.ok(t.on&&t.addListener&&t.emit,"can only bind real EEs");let r=this,n="context@"+this.name;function i(s){!s||(s[aa]||(s[aa]=Object.create(null)),s[aa][n]={namespace:r,context:r.active})}function a(s){if(!(s&&s[aa]))return s;let o=s,u=s[aa];return Object.keys(u).forEach(function(c){let p=u[c];o=p.namespace.bind(o,p.context)}),o}hN(t,i,a)};Qe.prototype.fromException=function(t){return t[sa]};function XE(e){return process.namespaces[e]}function _N(e){Mt.ok(e,"namespace must be given a name."),ee&&Q(`NS-CREATING NAMESPACE (${e})`);let t=new Qe(e);return t.id=q,X.createHook({init(n,i,a,s){if(q=X.executionAsyncId(),t.active){if(t._contexts.set(n,t.active),ee){let o=" ".repeat(t._indent<0?0:t._indent);Q(`${o}INIT [${i}] (${e}) asyncId:${n} currentUid:${q} triggerId:${a} active:${L.inspect(t.active,{showHidden:!0,depth:2,colors:!0})} resource:${s}`)}}else if(q===0){let o=X.triggerAsyncId(),u=t._contexts.get(o);if(u){if(t._contexts.set(n,u),ee){let c=" ".repeat(t._indent<0?0:t._indent);Q(`${c}INIT USING CONTEXT FROM TRIGGERID [${i}] (${e}) asyncId:${n} currentUid:${q} triggerId:${o} active:${L.inspect(t.active,{showHidden:!0,depth:2,colors:!0})} resource:${s}`)}}else if(ee){let c=" ".repeat(t._indent<0?0:t._indent);Q(`${c}INIT MISSING CONTEXT [${i}] (${e}) asyncId:${n} currentUid:${q} triggerId:${o} active:${L.inspect(t.active,{showHidden:!0,depth:2,colors:!0})} resource:${s}`)}}if(ee&&i==="PROMISE"){Q(L.inspect(s,{showHidden:!0}));let o=s.parentId,u=" ".repeat(t._indent<0?0:t._indent);Q(`${u}INIT RESOURCE-PROMISE [${i}] (${e}) parentId:${o} asyncId:${n} currentUid:${q} triggerId:${a} active:${L.inspect(t.active,{showHidden:!0,depth:2,colors:!0})} resource:${s}`)}},before(n){q=X.executionAsyncId();let i;if(i=t._contexts.get(n)||t._contexts.get(q),i){if(ee){let a=X.triggerAsyncId(),s=" ".repeat(t._indent<0?0:t._indent);Q(`${s}BEFORE (${e}) asyncId:${n} currentUid:${q} triggerId:${a} active:${L.inspect(t.active,{showHidden:!0,depth:2,colors:!0})} context:${L.inspect(i)}`),t._indent+=2}t.enter(i)}else if(ee){let a=X.triggerAsyncId(),s=" ".repeat(t._indent<0?0:t._indent);Q(`${s}BEFORE MISSING CONTEXT (${e}) asyncId:${n} currentUid:${q} triggerId:${a} active:${L.inspect(t.active,{showHidden:!0,depth:2,colors:!0})} namespace._contexts:${L.inspect(t._contexts,{showHidden:!0,depth:2,colors:!0})}`),t._indent+=2}},after(n){q=X.executionAsyncId();let i;if(i=t._contexts.get(n)||t._contexts.get(q),i){if(ee){let a=X.triggerAsyncId();t._indent-=2;let s=" ".repeat(t._indent<0?0:t._indent);Q(`${s}AFTER (${e}) asyncId:${n} currentUid:${q} triggerId:${a} active:${L.inspect(t.active,{showHidden:!0,depth:2,colors:!0})} context:${L.inspect(i)}`)}t.exit(i)}else if(ee){let a=X.triggerAsyncId();t._indent-=2;let s=" ".repeat(t._indent<0?0:t._indent);Q(`${s}AFTER MISSING CONTEXT (${e}) asyncId:${n} currentUid:${q} triggerId:${a} active:${L.inspect(t.active,{showHidden:!0,depth:2,colors:!0})} context:${L.inspect(i)}`)}},destroy(n){if(q=X.executionAsyncId(),ee){let i=X.triggerAsyncId(),a=" ".repeat(t._indent<0?0:t._indent);Q(`${a}DESTROY (${e}) currentUid:${q} asyncId:${n} triggerId:${i} active:${L.inspect(t.active,{showHidden:!0,depth:2,colors:!0})} context:${L.inspect(t._contexts.get(q))}`)}t._contexts.delete(n)}}).enable(),process.namespaces[e]=t,t}function YE(e){let t=XE(e);Mt.ok(t,`can't delete nonexistent namespace! "`+e+'"'),Mt.ok(t.id,"don't assign to process.namespaces directly! "+L.inspect(t)),process.namespaces[e]=null}function vN(){process.namespaces&&Object.keys(process.namespaces).forEach(function(e){YE(e)}),process.namespaces=Object.create(null)}process.namespaces={};function Q(...e){ee&&process._rawDebug(`${L.format(...e)}`)}});var JE=l((f1,ZE)=>{"use strict";function gN(){}ZE.exports=function(){let t=this._hooks,r=this._state,n=process.nextTick;process.nextTick=function(){if(!r.enabled)return n.apply(process,arguments);let i=new Array(arguments.length);for(let u=0;u<arguments.length;u++)i[u]=arguments[u];let a=i[0];if(typeof a!="function")throw new TypeError("callback is not a function");let s=new gN,o=--r.counter;return t.init.call(s,o,0,null,null),i[0]=function(){t.pre.call(s,o);let u=!0;try{a.apply(this,arguments),u=!1}finally{u&&process.listenerCount("uncaughtException")>0&&process.once("uncaughtException",function(){t.post.call(s,o,!0),t.destroy.call(null,o)})}t.post.call(s,o,!1),t.destroy.call(null,o)},n.apply(process,i)}}});var tm=l((d1,em)=>{"use strict";function EN(){}em.exports=function(){let t=this._hooks,r=this._state,n=global.Promise,i=n.prototype.then;n.prototype.then=u;function a(c,p,f,d){return typeof c!="function"?d?s(f):o(f):function(){t.pre.call(p,f);try{return c.apply(this,arguments)}finally{t.post.call(p,f,!1),t.destroy.call(null,f)}}}function s(c){return function(f){return t.destroy.call(null,c),f}}function o(c){return function(f){throw t.destroy.call(null,c),f}}function u(c,p){if(!r.enabled)return i.call(this,c,p);let f=new EN,d=--r.counter;return t.init.call(f,d,0,null,null),i.call(this,a(c,f,d,!0),a(p,f,d,!1))}}});var nm=l((h1,rm)=>{"use strict";var Ve=__webpack_require__(/*! timers */ "timers");function mN(){}function yN(){}function TN(){}var SN=new Map,AN=new Map,IN=new Map,Fl=null,Vl=!1;rm.exports=function(){$l(this._hooks,this._state,"setTimeout","clearTimeout",mN,SN,!0),$l(this._hooks,this._state,"setInterval","clearInterval",yN,AN,!1),$l(this._hooks,this._state,"setImmediate","clearImmediate",TN,IN,!0),global.setTimeout=Ve.setTimeout,global.setInterval=Ve.setInterval,global.setImmediate=Ve.setImmediate,global.clearTimeout=Ve.clearTimeout,global.clearInterval=Ve.clearInterval,global.clearImmediate=Ve.clearImmediate};function $l(e,t,r,n,i,a,s){let o=Ve[r],u=Ve[n];Ve[r]=function(){if(!t.enabled)return o.apply(Ve,arguments);let c=new Array(arguments.length);for(let E=0;E<arguments.length;E++)c[E]=arguments[E];let p=c[0];if(typeof p!="function")throw new TypeError('"callback" argument must be a function');let f=new i,d=--t.counter,h;return e.init.call(f,d,0,null,null),c[0]=function(){Fl=h,e.pre.call(f,d);let E=!0;try{p.apply(this,arguments),E=!1}finally{E&&process.listenerCount("uncaughtException")>0&&process.once("uncaughtException",function(){e.post.call(f,d,!0),a.delete(h),e.destroy.call(null,d)})}e.post.call(f,d,!1),Fl=null,(s||Vl)&&(Vl=!1,a.delete(h),e.destroy.call(null,d))},h=o.apply(Ve,c),a.set(h,d),h},Ve[n]=function(c){if(Fl===c&&c!==null)Vl=!0;else if(a.has(c)){let p=a.get(c);a.delete(c),e.destroy.call(null,p)}u.apply(Ve,arguments)}}});var zl=l((_1,bN)=>{bN.exports={name:"async-hook-jl",description:"Inspect the life of handle objects in node",version:"1.7.6",author:"Andreas Madsen <amwebdk@gmail.com>",main:"./index.js",scripts:{test:"node ./test/runner.js && eslint ."},repository:{type:"git",url:"git://github.com/jeff-lewis/async-hook-jl.git"},keywords:["async","async hooks","inspect","async wrap"],license:"MIT",dependencies:{"stack-chain":"^1.3.7"},devDependencies:{async:"1.5.x","cli-color":"1.1.x",eslint:"^3.4.0",endpoint:"0.4.x"},engines:{node:"^4.7 || >=6.9 || >=7.3"}}});var sm=l((v1,am)=>{"use strict";var oa=process.binding("async_wrap"),CN=oa.Providers.TIMERWRAP,im={nextTick:JE(),promise:tm(),timers:nm()},ua=new Set;function ON(){this.enabled=!1,this.counter=0}function Kl(){let e=this.initFns=[],t=this.preFns=[],r=this.postFns=[],n=this.destroyFns=[];this.init=function(i,a,s,o){if(a===CN){ua.add(i);return}for(let u of e)u(i,this,a,s,o)},this.pre=function(i){if(!ua.has(i))for(let a of t)a(i,this)},this.post=function(i,a){if(!ua.has(i))for(let s of r)s(i,this,a)},this.destroy=function(i){if(ua.has(i)){ua.delete(i);return}for(let a of n)a(i)}}Kl.prototype.add=function(e){e.init&&this.initFns.push(e.init),e.pre&&this.preFns.push(e.pre),e.post&&this.postFns.push(e.post),e.destroy&&this.destroyFns.push(e.destroy)};function xo(e,t){let r=e.indexOf(t);r!==-1&&e.splice(r,1)}Kl.prototype.remove=function(e){e.init&&xo(this.initFns,e.init),e.pre&&xo(this.preFns,e.pre),e.post&&xo(this.postFns,e.post),e.destroy&&xo(this.destroyFns,e.destroy)};function ca(){this._state=new ON,this._hooks=new Kl,this.version=zl().version,this.providers=oa.Providers;for(let e of Object.keys(im))im[e].call(this);process.env.hasOwnProperty("NODE_ASYNC_HOOK_WARNING")&&console.warn("warning: you are using async-hook-jl which is unstable."),oa.setupHooks({init:this._hooks.init,pre:this._hooks.pre,post:this._hooks.post,destroy:this._hooks.destroy})}am.exports=ca;ca.prototype.addHooks=function(e){this._hooks.add(e)};ca.prototype.removeHooks=function(e){this._hooks.remove(e)};ca.prototype.enable=function(){this._state.enabled=!0,oa.enable()};ca.prototype.disable=function(){this._state.enabled=!1,oa.disable()}});var Xl=l((g1,PN)=>{PN.exports={name:"stack-chain",description:"API for combining call site modifiers",version:"1.3.7",author:"Andreas Madsen <amwebdk@gmail.com>",scripts:{test:"tap ./test/simple"},repository:{type:"git",url:"git://github.com/AndreasMadsen/stack-chain.git"},keywords:["stack","chain","trace","call site","concat","format"],devDependencies:{tap:"2.x.x","uglify-js":"2.5.x"},license:"MIT"}});var um=l((E1,om)=>{function RN(e){try{return Error.prototype.toString.call(e)}catch(t){try{return"<error: "+t+">"}catch(r){return"<error>"}}}om.exports=function(t,r){var n=[];n.push(RN(t));for(var i=0;i<r.length;i++){var a=r[i],s;try{s=a.toString()}catch(o){try{s="<error: "+o+">"}catch(u){s="<error>"}}n.push("    at "+s)}return n.join(`
`)}});var fm=l((m1,pm)=>{var Mo=um();function cm(){this.extend=new la,this.filter=new la,this.format=new pa,this.version=Xl().version}var Yl=!1;cm.prototype.callSite=function e(t){t||(t={}),Yl=!0;var r={};Error.captureStackTrace(r,e);var n=r.stack;return Yl=!1,n=n.slice(t.slice||0),t.extend&&(n=this.extend._modify(r,n)),t.filter&&(n=this.filter._modify(r,n)),n};var sr=new cm;function la(){this._modifiers=[]}la.prototype._modify=function(e,t){for(var r=0,n=this._modifiers.length;r<n;r++)t=this._modifiers[r](e,t);return t};la.prototype.attach=function(e){this._modifiers.push(e)};la.prototype.deattach=function(e){var t=this._modifiers.indexOf(e);return t===-1?!1:(this._modifiers.splice(t,1),!0)};function pa(){this._formater=Mo,this._previous=void 0}pa.prototype.replace=function(e){e?this._formater=e:this.restore()};pa.prototype.restore=function(){this._formater=Mo,this._previous=void 0};pa.prototype._backup=function(){this._previous=this._formater};pa.prototype._roolback=function(){this._previous===Mo?this.replace(void 0):this.replace(this._previous),this._previous=void 0};Error.prepareStackTrace&&sr.format.replace(Error.prepareStackTrace);var Ql=!1;function lm(e,t){if(Yl)return t;if(Ql)return Mo(e,t);var r=t.concat();r=sr.extend._modify(e,r),r=sr.filter._modify(e,r),r=r.slice(0,Error.stackTraceLimit),Object.isExtensible(e)&&Object.getOwnPropertyDescriptor(e,"callSite")===void 0&&(e.callSite={original:t,mutated:r}),Ql=!0;var n=sr.format._formater(e,r);return Ql=!1,n}Object.defineProperty(Error,"prepareStackTrace",{get:function(){return lm},set:function(e){e===lm?sr.format._roolback():(sr.format._backup(),sr.format.replace(e))}});function NN(){return this.stack,this.callSite}Object.defineProperty(Error.prototype,"callSite",{get:NN,set:function(e){Object.defineProperty(this,"callSite",{value:e,writable:!0,configurable:!0})},configurable:!0});pm.exports=sr});var Zl=l((y1,Wl)=>{if(global._stackChain)if(global._stackChain.version===Xl().version)Wl.exports=global._stackChain;else throw new Error("Conflicting version of stack-chain found");else Wl.exports=global._stackChain=fm()});var dm=l((T1,Jl)=>{"use strict";var DN=sm();if(global._asyncHook)if(global._asyncHook.version===zl().version)Jl.exports=global._asyncHook;else throw new Error("Conflicting version of async-hook-jl found");else Zl().filter.attach(function(t,r){return r.filter(function(n){let i=n.getFileName();return!(i&&i.slice(0,__dirname.length)===__dirname)})}),Jl.exports=global._asyncHook=new DN});var mm=l((S1,Em)=>{"use strict";var ce=__webpack_require__(/*! util */ "util"),Lt=__webpack_require__(/*! assert */ "assert"),wN=wo(),zn=dm(),fa="cls@contexts",da="error@context",hm=[];for(let e in zn.providers)hm[zn.providers[e]]=e;var se=process.env.DEBUG_CLS_HOOKED,de=-1;Em.exports={getNamespace:_m,createNamespace:xN,destroyNamespace:vm,reset:MN,ERROR_SYMBOL:da};function We(e){this.name=e,this.active=null,this._set=[],this.id=null,this._contexts=new Map}We.prototype.set=function(t,r){if(!this.active)throw new Error("No context available. ns.run() or ns.bind() must be called first.");return se&&le("    SETTING KEY:"+t+"="+r+" in ns:"+this.name+" uid:"+de+" active:"+ce.inspect(this.active,!0)),this.active[t]=r,r};We.prototype.get=function(t){if(!this.active){se&&le("    GETTING KEY:"+t+"=undefined "+this.name+" uid:"+de+" active:"+ce.inspect(this.active,!0));return}return se&&le("    GETTING KEY:"+t+"="+this.active[t]+" "+this.name+" uid:"+de+" active:"+ce.inspect(this.active,!0)),this.active[t]};We.prototype.createContext=function(){se&&le("   CREATING Context: "+this.name+" uid:"+de+" len:"+this._set.length+"  active:"+ce.inspect(this.active,!0,2,!0));let t=Object.create(this.active?this.active:Object.prototype);return t._ns_name=this.name,t.id=de,se&&le("   CREATED Context: "+this.name+" uid:"+de+" len:"+this._set.length+"  context:"+ce.inspect(t,!0,2,!0)),t};We.prototype.run=function(t){let r=this.createContext();this.enter(r);try{return se&&le(" BEFORE RUN: "+this.name+" uid:"+de+" len:"+this._set.length+" "+ce.inspect(r)),t(r),r}catch(n){throw n&&(n[da]=r),n}finally{se&&le(" AFTER RUN: "+this.name+" uid:"+de+" len:"+this._set.length+" "+ce.inspect(r)),this.exit(r)}};We.prototype.runAndReturn=function(t){var r;return this.run(function(n){r=t(n)}),r};We.prototype.runPromise=function(t){let r=this.createContext();this.enter(r);let n=t(r);if(!n||!n.then||!n.catch)throw new Error("fn must return a promise.");return se&&le(" BEFORE runPromise: "+this.name+" uid:"+de+" len:"+this._set.length+" "+ce.inspect(r)),n.then(i=>(se&&le(" AFTER runPromise: "+this.name+" uid:"+de+" len:"+this._set.length+" "+ce.inspect(r)),this.exit(r),i)).catch(i=>{throw i[da]=r,se&&le(" AFTER runPromise: "+this.name+" uid:"+de+" len:"+this._set.length+" "+ce.inspect(r)),this.exit(r),i})};We.prototype.bind=function(t,r){r||(this.active?r=this.active:r=this.createContext());let n=this;return function(){n.enter(r);try{return t.apply(this,arguments)}catch(a){throw a&&(a[da]=r),a}finally{n.exit(r)}}};We.prototype.enter=function(t){Lt.ok(t,"context must be provided for entering"),se&&le("  ENTER "+this.name+" uid:"+de+" len:"+this._set.length+" context: "+ce.inspect(t)),this._set.push(this.active),this.active=t};We.prototype.exit=function(t){if(Lt.ok(t,"context must be provided for exiting"),se&&le("  EXIT "+this.name+" uid:"+de+" len:"+this._set.length+" context: "+ce.inspect(t)),this.active===t){Lt.ok(this._set.length,"can't remove top context"),this.active=this._set.pop();return}let r=this._set.lastIndexOf(t);r<0?(se&&le("??ERROR?? context exiting but not entered - ignoring: "+ce.inspect(t)),Lt.ok(r>=0,`context not currently entered; can't exit. 
`+ce.inspect(this)+`
`+ce.inspect(t))):(Lt.ok(r,"can't remove top context"),this._set.splice(r,1))};We.prototype.bindEmitter=function(t){Lt.ok(t.on&&t.addListener&&t.emit,"can only bind real EEs");let r=this,n="context@"+this.name;function i(s){!s||(s[fa]||(s[fa]=Object.create(null)),s[fa][n]={namespace:r,context:r.active})}function a(s){if(!(s&&s[fa]))return s;let o=s,u=s[fa];return Object.keys(u).forEach(function(c){let p=u[c];o=p.namespace.bind(o,p.context)}),o}wN(t,i,a)};We.prototype.fromException=function(t){return t[da]};function _m(e){return process.namespaces[e]}function xN(e){Lt.ok(e,"namespace must be given a name."),se&&le("CREATING NAMESPACE "+e);let t=new We(e);return t.id=de,zn.addHooks({init(r,n,i,a,s){de=r,a?(t._contexts.set(r,t._contexts.get(a)),se&&le("PARENTID: "+e+" uid:"+r+" parent:"+a+" provider:"+i)):t._contexts.set(de,t.active),se&&le("INIT "+e+" uid:"+r+" parent:"+a+" provider:"+hm[i]+" active:"+ce.inspect(t.active,!0))},pre(r,n){de=r;let i=t._contexts.get(r);i?(se&&le(" PRE "+e+" uid:"+r+" handle:"+Lo(n)+" context:"+ce.inspect(i)),t.enter(i)):se&&le(" PRE MISSING CONTEXT "+e+" uid:"+r+" handle:"+Lo(n))},post(r,n){de=r;let i=t._contexts.get(r);i?(se&&le(" POST "+e+" uid:"+r+" handle:"+Lo(n)+" context:"+ce.inspect(i)),t.exit(i)):se&&le(" POST MISSING CONTEXT "+e+" uid:"+r+" handle:"+Lo(n))},destroy(r){de=r,se&&le("DESTROY "+e+" uid:"+r+" context:"+ce.inspect(t._contexts.get(de))+" active:"+ce.inspect(t.active,!0)),t._contexts.delete(r)}}),process.namespaces[e]=t,t}function vm(e){let t=_m(e);Lt.ok(t,`can't delete nonexistent namespace! "`+e+'"'),Lt.ok(t.id,"don't assign to process.namespaces directly! "+ce.inspect(t)),process.namespaces[e]=null}function MN(){process.namespaces&&Object.keys(process.namespaces).forEach(function(e){vm(e)}),process.namespaces=Object.create(null)}process.namespaces={};zn._state&&!zn._state.enabled&&zn.enable();function le(e){process.env.DEBUG&&process._rawDebug(e)}function Lo(e){if(!e)return e;if(typeof e=="function")return e.name?e.name:(e.toString().trim().match(/^function\s*([^\s(]+)/)||[])[1];if(e.constructor&&e.constructor.name)return e.constructor.name}if(se){ep=Zl();for(gm in ep.filter._modifiers)ep.filter.deattach(gm)}var ep,gm});var ym=l((A1,tp)=>{"use strict";var LN=UE();process&&LN.gte(process.versions.node,"8.0.0")?tp.exports=WE():tp.exports=mm()});var jm=l((C,qm)=>{C=qm.exports=w;var U;typeof process=="object"&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?U=function(){var e=Array.prototype.slice.call(arguments,0);e.unshift("SEMVER"),console.log.apply(console,e)}:U=function(){};C.SEMVER_SPEC_VERSION="2.0.0";var rp=256,qo=Number.MAX_SAFE_INTEGER||9007199254740991,np=16,F=C.re=[],g=C.src=[],R=0,Kn=R++;g[Kn]="0|[1-9]\\d*";var Xn=R++;g[Xn]="[0-9]+";var ip=R++;g[ip]="\\d*[a-zA-Z-][a-zA-Z0-9-]*";var Tm=R++;g[Tm]="("+g[Kn]+")\\.("+g[Kn]+")\\.("+g[Kn]+")";var Sm=R++;g[Sm]="("+g[Xn]+")\\.("+g[Xn]+")\\.("+g[Xn]+")";var ap=R++;g[ap]="(?:"+g[Kn]+"|"+g[ip]+")";var sp=R++;g[sp]="(?:"+g[Xn]+"|"+g[ip]+")";var op=R++;g[op]="(?:-("+g[ap]+"(?:\\."+g[ap]+")*))";var up=R++;g[up]="(?:-?("+g[sp]+"(?:\\."+g[sp]+")*))";var cp=R++;g[cp]="[0-9A-Za-z-]+";var ha=R++;g[ha]="(?:\\+("+g[cp]+"(?:\\."+g[cp]+")*))";var lp=R++,Am="v?"+g[Tm]+g[op]+"?"+g[ha]+"?";g[lp]="^"+Am+"$";var pp="[v=\\s]*"+g[Sm]+g[up]+"?"+g[ha]+"?",fp=R++;g[fp]="^"+pp+"$";var Yn=R++;g[Yn]="((?:<|>)?=?)";var jo=R++;g[jo]=g[Xn]+"|x|X|\\*";var ko=R++;g[ko]=g[Kn]+"|x|X|\\*";var zr=R++;g[zr]="[v=\\s]*("+g[ko]+")(?:\\.("+g[ko]+")(?:\\.("+g[ko]+")(?:"+g[op]+")?"+g[ha]+"?)?)?";var Qn=R++;g[Qn]="[v=\\s]*("+g[jo]+")(?:\\.("+g[jo]+")(?:\\.("+g[jo]+")(?:"+g[up]+")?"+g[ha]+"?)?)?";var Im=R++;g[Im]="^"+g[Yn]+"\\s*"+g[zr]+"$";var bm=R++;g[bm]="^"+g[Yn]+"\\s*"+g[Qn]+"$";var Cm=R++;g[Cm]="(?:^|[^\\d])(\\d{1,"+np+"})(?:\\.(\\d{1,"+np+"}))?(?:\\.(\\d{1,"+np+"}))?(?:$|[^\\d])";var Ho=R++;g[Ho]="(?:~>?)";var Uo=R++;g[Uo]="(\\s*)"+g[Ho]+"\\s+";F[Uo]=new RegExp(g[Uo],"g");var qN="$1~",Om=R++;g[Om]="^"+g[Ho]+g[zr]+"$";var Pm=R++;g[Pm]="^"+g[Ho]+g[Qn]+"$";var Bo=R++;g[Bo]="(?:\\^)";var Go=R++;g[Go]="(\\s*)"+g[Bo]+"\\s+";F[Go]=new RegExp(g[Go],"g");var jN="$1^",Rm=R++;g[Rm]="^"+g[Bo]+g[zr]+"$";var Nm=R++;g[Nm]="^"+g[Bo]+g[Qn]+"$";var dp=R++;g[dp]="^"+g[Yn]+"\\s*("+pp+")$|^$";var hp=R++;g[hp]="^"+g[Yn]+"\\s*("+Am+")$|^$";var _a=R++;g[_a]="(\\s*)"+g[Yn]+"\\s*("+pp+"|"+g[zr]+")";F[_a]=new RegExp(g[_a],"g");var kN="$1$2$3",Dm=R++;g[Dm]="^\\s*("+g[zr]+")\\s+-\\s+("+g[zr]+")\\s*$";var wm=R++;g[wm]="^\\s*("+g[Qn]+")\\s+-\\s+("+g[Qn]+")\\s*$";var xm=R++;g[xm]="(<|>)?=?\\s*\\*";for(or=0;or<R;or++)U(or,g[or]),F[or]||(F[or]=new RegExp(g[or]));var or;C.parse=Kr;function Kr(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof w)return e;if(typeof e!="string"||e.length>rp)return null;var r=t.loose?F[fp]:F[lp];if(!r.test(e))return null;try{return new w(e,t)}catch(n){return null}}C.valid=HN;function HN(e,t){var r=Kr(e,t);return r?r.version:null}C.clean=UN;function UN(e,t){var r=Kr(e.trim().replace(/^[=v]+/,""),t);return r?r.version:null}C.SemVer=w;function w(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof w){if(e.loose===t.loose)return e;e=e.version}else if(typeof e!="string")throw new TypeError("Invalid Version: "+e);if(e.length>rp)throw new TypeError("version is longer than "+rp+" characters");if(!(this instanceof w))return new w(e,t);U("SemVer",e,t),this.options=t,this.loose=!!t.loose;var r=e.trim().match(t.loose?F[fp]:F[lp]);if(!r)throw new TypeError("Invalid Version: "+e);if(this.raw=e,this.major=+r[1],this.minor=+r[2],this.patch=+r[3],this.major>qo||this.major<0)throw new TypeError("Invalid major version");if(this.minor>qo||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>qo||this.patch<0)throw new TypeError("Invalid patch version");r[4]?this.prerelease=r[4].split(".").map(function(n){if(/^[0-9]+$/.test(n)){var i=+n;if(i>=0&&i<qo)return i}return n}):this.prerelease=[],this.build=r[5]?r[5].split("."):[],this.format()}w.prototype.format=function(){return this.version=this.major+"."+this.minor+"."+this.patch,this.prerelease.length&&(this.version+="-"+this.prerelease.join(".")),this.version};w.prototype.toString=function(){return this.version};w.prototype.compare=function(e){return U("SemVer.compare",this.version,this.options,e),e instanceof w||(e=new w(e,this.options)),this.compareMain(e)||this.comparePre(e)};w.prototype.compareMain=function(e){return e instanceof w||(e=new w(e,this.options)),Wn(this.major,e.major)||Wn(this.minor,e.minor)||Wn(this.patch,e.patch)};w.prototype.comparePre=function(e){if(e instanceof w||(e=new w(e,this.options)),this.prerelease.length&&!e.prerelease.length)return-1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;var t=0;do{var r=this.prerelease[t],n=e.prerelease[t];if(U("prerelease compare",t,r,n),r===void 0&&n===void 0)return 0;if(n===void 0)return 1;if(r===void 0)return-1;if(r===n)continue;return Wn(r,n)}while(++t)};w.prototype.inc=function(e,t){switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",t);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",t);break;case"prepatch":this.prerelease.length=0,this.inc("patch",t),this.inc("pre",t);break;case"prerelease":this.prerelease.length===0&&this.inc("patch",t),this.inc("pre",t);break;case"major":(this.minor!==0||this.patch!==0||this.prerelease.length===0)&&this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":(this.patch!==0||this.prerelease.length===0)&&this.minor++,this.patch=0,this.prerelease=[];break;case"patch":this.prerelease.length===0&&this.patch++,this.prerelease=[];break;case"pre":if(this.prerelease.length===0)this.prerelease=[0];else{for(var r=this.prerelease.length;--r>=0;)typeof this.prerelease[r]=="number"&&(this.prerelease[r]++,r=-2);r===-1&&this.prerelease.push(0)}t&&(this.prerelease[0]===t?isNaN(this.prerelease[1])&&(this.prerelease=[t,0]):this.prerelease=[t,0]);break;default:throw new Error("invalid increment argument: "+e)}return this.format(),this.raw=this.version,this};C.inc=BN;function BN(e,t,r,n){typeof r=="string"&&(n=r,r=void 0);try{return new w(e,r).inc(t,n).version}catch(i){return null}}C.diff=GN;function GN(e,t){if(_p(e,t))return null;var r=Kr(e),n=Kr(t),i="";if(r.prerelease.length||n.prerelease.length){i="pre";var a="prerelease"}for(var s in r)if((s==="major"||s==="minor"||s==="patch")&&r[s]!==n[s])return i+s;return a}C.compareIdentifiers=Wn;var Mm=/^[0-9]+$/;function Wn(e,t){var r=Mm.test(e),n=Mm.test(t);return r&&n&&(e=+e,t=+t),e===t?0:r&&!n?-1:n&&!r?1:e<t?-1:1}C.rcompareIdentifiers=FN;function FN(e,t){return Wn(t,e)}C.major=VN;function VN(e,t){return new w(e,t).major}C.minor=$N;function $N(e,t){return new w(e,t).minor}C.patch=zN;function zN(e,t){return new w(e,t).patch}C.compare=qt;function qt(e,t,r){return new w(e,r).compare(new w(t,r))}C.compareLoose=KN;function KN(e,t){return qt(e,t,!0)}C.rcompare=XN;function XN(e,t,r){return qt(t,e,r)}C.sort=YN;function YN(e,t){return e.sort(function(r,n){return C.compare(r,n,t)})}C.rsort=QN;function QN(e,t){return e.sort(function(r,n){return C.rcompare(r,n,t)})}C.gt=va;function va(e,t,r){return qt(e,t,r)>0}C.lt=Fo;function Fo(e,t,r){return qt(e,t,r)<0}C.eq=_p;function _p(e,t,r){return qt(e,t,r)===0}C.neq=Lm;function Lm(e,t,r){return qt(e,t,r)!==0}C.gte=vp;function vp(e,t,r){return qt(e,t,r)>=0}C.lte=gp;function gp(e,t,r){return qt(e,t,r)<=0}C.cmp=Vo;function Vo(e,t,r,n){switch(t){case"===":return typeof e=="object"&&(e=e.version),typeof r=="object"&&(r=r.version),e===r;case"!==":return typeof e=="object"&&(e=e.version),typeof r=="object"&&(r=r.version),e!==r;case"":case"=":case"==":return _p(e,r,n);case"!=":return Lm(e,r,n);case">":return va(e,r,n);case">=":return vp(e,r,n);case"<":return Fo(e,r,n);case"<=":return gp(e,r,n);default:throw new TypeError("Invalid operator: "+t)}}C.Comparator=Ze;function Ze(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof Ze){if(e.loose===!!t.loose)return e;e=e.value}if(!(this instanceof Ze))return new Ze(e,t);U("comparator",e,t),this.options=t,this.loose=!!t.loose,this.parse(e),this.semver===ga?this.value="":this.value=this.operator+this.semver.version,U("comp",this)}var ga={};Ze.prototype.parse=function(e){var t=this.options.loose?F[dp]:F[hp],r=e.match(t);if(!r)throw new TypeError("Invalid comparator: "+e);this.operator=r[1],this.operator==="="&&(this.operator=""),r[2]?this.semver=new w(r[2],this.options.loose):this.semver=ga};Ze.prototype.toString=function(){return this.value};Ze.prototype.test=function(e){return U("Comparator.test",e,this.options.loose),this.semver===ga?!0:(typeof e=="string"&&(e=new w(e,this.options)),Vo(e,this.operator,this.semver,this.options))};Ze.prototype.intersects=function(e,t){if(!(e instanceof Ze))throw new TypeError("a Comparator is required");(!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1});var r;if(this.operator==="")return r=new te(e.value,t),$o(this.value,r,t);if(e.operator==="")return r=new te(this.value,t),$o(e.semver,r,t);var n=(this.operator===">="||this.operator===">")&&(e.operator===">="||e.operator===">"),i=(this.operator==="<="||this.operator==="<")&&(e.operator==="<="||e.operator==="<"),a=this.semver.version===e.semver.version,s=(this.operator===">="||this.operator==="<=")&&(e.operator===">="||e.operator==="<="),o=Vo(this.semver,"<",e.semver,t)&&(this.operator===">="||this.operator===">")&&(e.operator==="<="||e.operator==="<"),u=Vo(this.semver,">",e.semver,t)&&(this.operator==="<="||this.operator==="<")&&(e.operator===">="||e.operator===">");return n||i||a&&s||o||u};C.Range=te;function te(e,t){if((!t||typeof t!="object")&&(t={loose:!!t,includePrerelease:!1}),e instanceof te)return e.loose===!!t.loose&&e.includePrerelease===!!t.includePrerelease?e:new te(e.raw,t);if(e instanceof Ze)return new te(e.value,t);if(!(this instanceof te))return new te(e,t);if(this.options=t,this.loose=!!t.loose,this.includePrerelease=!!t.includePrerelease,this.raw=e,this.set=e.split(/\s*\|\|\s*/).map(function(r){return this.parseRange(r.trim())},this).filter(function(r){return r.length}),!this.set.length)throw new TypeError("Invalid SemVer Range: "+e);this.format()}te.prototype.format=function(){return this.range=this.set.map(function(e){return e.join(" ").trim()}).join("||").trim(),this.range};te.prototype.toString=function(){return this.range};te.prototype.parseRange=function(e){var t=this.options.loose;e=e.trim();var r=t?F[wm]:F[Dm];e=e.replace(r,sD),U("hyphen replace",e),e=e.replace(F[_a],kN),U("comparator trim",e,F[_a]),e=e.replace(F[Uo],qN),e=e.replace(F[Go],jN),e=e.split(/\s+/).join(" ");var n=t?F[dp]:F[hp],i=e.split(" ").map(function(a){return ZN(a,this.options)},this).join(" ").split(/\s+/);return this.options.loose&&(i=i.filter(function(a){return!!a.match(n)})),i=i.map(function(a){return new Ze(a,this.options)},this),i};te.prototype.intersects=function(e,t){if(!(e instanceof te))throw new TypeError("a Range is required");return this.set.some(function(r){return r.every(function(n){return e.set.some(function(i){return i.every(function(a){return n.intersects(a,t)})})})})};C.toComparators=WN;function WN(e,t){return new te(e,t).set.map(function(r){return r.map(function(n){return n.value}).join(" ").trim().split(" ")})}function ZN(e,t){return U("comp",e,t),e=tD(e,t),U("caret",e),e=JN(e,t),U("tildes",e),e=nD(e,t),U("xrange",e),e=aD(e,t),U("stars",e),e}function Me(e){return!e||e.toLowerCase()==="x"||e==="*"}function JN(e,t){return e.trim().split(/\s+/).map(function(r){return eD(r,t)}).join(" ")}function eD(e,t){var r=t.loose?F[Pm]:F[Om];return e.replace(r,function(n,i,a,s,o){U("tilde",e,n,i,a,s,o);var u;return Me(i)?u="":Me(a)?u=">="+i+".0.0 <"+(+i+1)+".0.0":Me(s)?u=">="+i+"."+a+".0 <"+i+"."+(+a+1)+".0":o?(U("replaceTilde pr",o),u=">="+i+"."+a+"."+s+"-"+o+" <"+i+"."+(+a+1)+".0"):u=">="+i+"."+a+"."+s+" <"+i+"."+(+a+1)+".0",U("tilde return",u),u})}function tD(e,t){return e.trim().split(/\s+/).map(function(r){return rD(r,t)}).join(" ")}function rD(e,t){U("caret",e,t);var r=t.loose?F[Nm]:F[Rm];return e.replace(r,function(n,i,a,s,o){U("caret",e,n,i,a,s,o);var u;return Me(i)?u="":Me(a)?u=">="+i+".0.0 <"+(+i+1)+".0.0":Me(s)?i==="0"?u=">="+i+"."+a+".0 <"+i+"."+(+a+1)+".0":u=">="+i+"."+a+".0 <"+(+i+1)+".0.0":o?(U("replaceCaret pr",o),i==="0"?a==="0"?u=">="+i+"."+a+"."+s+"-"+o+" <"+i+"."+a+"."+(+s+1):u=">="+i+"."+a+"."+s+"-"+o+" <"+i+"."+(+a+1)+".0":u=">="+i+"."+a+"."+s+"-"+o+" <"+(+i+1)+".0.0"):(U("no pr"),i==="0"?a==="0"?u=">="+i+"."+a+"."+s+" <"+i+"."+a+"."+(+s+1):u=">="+i+"."+a+"."+s+" <"+i+"."+(+a+1)+".0":u=">="+i+"."+a+"."+s+" <"+(+i+1)+".0.0"),U("caret return",u),u})}function nD(e,t){return U("replaceXRanges",e,t),e.split(/\s+/).map(function(r){return iD(r,t)}).join(" ")}function iD(e,t){e=e.trim();var r=t.loose?F[bm]:F[Im];return e.replace(r,function(n,i,a,s,o,u){U("xRange",e,n,i,a,s,o,u);var c=Me(a),p=c||Me(s),f=p||Me(o),d=f;return i==="="&&d&&(i=""),c?i===">"||i==="<"?n="<0.0.0":n="*":i&&d?(p&&(s=0),o=0,i===">"?(i=">=",p?(a=+a+1,s=0,o=0):(s=+s+1,o=0)):i==="<="&&(i="<",p?a=+a+1:s=+s+1),n=i+a+"."+s+"."+o):p?n=">="+a+".0.0 <"+(+a+1)+".0.0":f&&(n=">="+a+"."+s+".0 <"+a+"."+(+s+1)+".0"),U("xRange return",n),n})}function aD(e,t){return U("replaceStars",e,t),e.trim().replace(F[xm],"")}function sD(e,t,r,n,i,a,s,o,u,c,p,f,d){return Me(r)?t="":Me(n)?t=">="+r+".0.0":Me(i)?t=">="+r+"."+n+".0":t=">="+t,Me(u)?o="":Me(c)?o="<"+(+u+1)+".0.0":Me(p)?o="<"+u+"."+(+c+1)+".0":f?o="<="+u+"."+c+"."+p+"-"+f:o="<="+o,(t+" "+o).trim()}te.prototype.test=function(e){if(!e)return!1;typeof e=="string"&&(e=new w(e,this.options));for(var t=0;t<this.set.length;t++)if(oD(this.set[t],e,this.options))return!0;return!1};function oD(e,t,r){for(var n=0;n<e.length;n++)if(!e[n].test(t))return!1;if(t.prerelease.length&&!r.includePrerelease){for(n=0;n<e.length;n++)if(U(e[n].semver),e[n].semver!==ga&&e[n].semver.prerelease.length>0){var i=e[n].semver;if(i.major===t.major&&i.minor===t.minor&&i.patch===t.patch)return!0}return!1}return!0}C.satisfies=$o;function $o(e,t,r){try{t=new te(t,r)}catch(n){return!1}return t.test(e)}C.maxSatisfying=uD;function uD(e,t,r){var n=null,i=null;try{var a=new te(t,r)}catch(s){return null}return e.forEach(function(s){a.test(s)&&(!n||i.compare(s)===-1)&&(n=s,i=new w(n,r))}),n}C.minSatisfying=cD;function cD(e,t,r){var n=null,i=null;try{var a=new te(t,r)}catch(s){return null}return e.forEach(function(s){a.test(s)&&(!n||i.compare(s)===1)&&(n=s,i=new w(n,r))}),n}C.minVersion=lD;function lD(e,t){e=new te(e,t);var r=new w("0.0.0");if(e.test(r)||(r=new w("0.0.0-0"),e.test(r)))return r;r=null;for(var n=0;n<e.set.length;++n){var i=e.set[n];i.forEach(function(a){var s=new w(a.semver.version);switch(a.operator){case">":s.prerelease.length===0?s.patch++:s.prerelease.push(0),s.raw=s.format();case"":case">=":(!r||va(r,s))&&(r=s);break;case"<":case"<=":break;default:throw new Error("Unexpected operation: "+a.operator)}})}return r&&e.test(r)?r:null}C.validRange=pD;function pD(e,t){try{return new te(e,t).range||"*"}catch(r){return null}}C.ltr=fD;function fD(e,t,r){return Ep(e,t,"<",r)}C.gtr=dD;function dD(e,t,r){return Ep(e,t,">",r)}C.outside=Ep;function Ep(e,t,r,n){e=new w(e,n),t=new te(t,n);var i,a,s,o,u;switch(r){case">":i=va,a=gp,s=Fo,o=">",u=">=";break;case"<":i=Fo,a=vp,s=va,o="<",u="<=";break;default:throw new TypeError('Must provide a hilo val of "<" or ">"')}if($o(e,t,n))return!1;for(var c=0;c<t.set.length;++c){var p=t.set[c],f=null,d=null;if(p.forEach(function(h){h.semver===ga&&(h=new Ze(">=0.0.0")),f=f||h,d=d||h,i(h.semver,f.semver,n)?f=h:s(h.semver,d.semver,n)&&(d=h)}),f.operator===o||f.operator===u||(!d.operator||d.operator===o)&&a(e,d.semver))return!1;if(d.operator===u&&s(e,d.semver))return!1}return!0}C.prerelease=hD;function hD(e,t){var r=Kr(e,t);return r&&r.prerelease.length?r.prerelease:null}C.intersects=_D;function _D(e,t,r){return e=new te(e,r),t=new te(t,r),e.intersects(t)}C.coerce=vD;function vD(e){if(e instanceof w)return e;if(typeof e!="string")return null;var t=e.match(F[Cm]);return t==null?null:Kr(t[1]+"."+(t[2]||"0")+"."+(t[3]||"0"))}});var Um=l((I1,Hm)=>{var gD=Ro().wrap,mp=1<<0,yp=1<<1,Tp=1<<2,zo=1<<3,V=[],ED=0,Oe=!1,ur=[],Zn,Sp;function Ap(e,t){var r=e.length,n=t.length,i=[];if(r===0&&n===0)return i;for(var a=0;a<r;a++)i[a]=e[a];if(n===0)return i;for(var s=0;s<n;s++){var o=!0;for(a=0;a<r;a++)if(e[a].uid===t[s].uid){o=!1;break}o&&i.push(t[s])}return i}process._fatalException?(Ko=!1,Zn=function(t){var r=V.length;if(Ko||r===0)return!1;var n=!1;Ko=!0;for(var i=0;i<r;++i){var a=V[i];if((a.flags&zo)!=0){var s=Jn&&Jn[a.uid];n=a.error(s,t)||n}}return Ko=!1,ur.length>0&&(V=ur.pop()),Jn=void 0,n&&!Oe},Sp=function(t,r,n){var i=[];Oe=!0;for(var a=0;a<n;++a){var s=r[a];if(i[s.uid]=s.data,(s.flags&mp)!=0){var o=s.create(s.data);o!==void 0&&(i[s.uid]=o)}}return Oe=!1,function(){Jn=i,ur.push(V),V=Ap(r,V),Oe=!0;for(var u=0;u<n;++u)(r[u].flags&yp)>0&&r[u].before(this,i[r[u].uid]);Oe=!1;var c=t.apply(this,arguments);for(Oe=!0,u=0;u<n;++u)(r[u].flags&Tp)>0&&r[u].after(this,i[r[u].uid]);return Oe=!1,V=ur.pop(),Jn=void 0,c}},gD(process,"_fatalException",function(e){return function(r){return Zn(r)||e(r)}})):(Ip=!1,Zn=function(t){if(Ip)throw t;for(var r=!1,n=V.length,i=0;i<n;++i){var a=V[i];(a.flags&zo)!=0&&(r=a.error(null,t)||r)}if(!r&&Oe)throw t},Sp=function(t,r,n){var i=[];Oe=!0;for(var a=0;a<n;++a){var s=r[a];if(i[s.uid]=s.data,(s.flags&mp)!=0){var o=s.create(s.data);o!==void 0&&(i[s.uid]=o)}}return Oe=!1,function(){var u=!1,c=!1;ur.push(V),V=Ap(r,V),Oe=!0;for(var p=0;p<n;++p)(r[p].flags&yp)>0&&r[p].before(this,i[r[p].uid]);Oe=!1;var f;try{f=t.apply(this,arguments)}catch(d){u=!0;for(var p=0;p<n;++p)if((V[p].flags&zo)!=0)try{c=V[p].error(i[r[p].uid],d)||c}catch(E){throw Ip=!0,E}if(!c)throw process.removeListener("uncaughtException",Zn),process._originalNextTick(function(){process.addListener("uncaughtException",Zn)}),d}finally{if(!u||c){for(Oe=!0,p=0;p<n;++p)(r[p].flags&Tp)>0&&r[p].after(this,i[r[p].uid]);Oe=!1}V=ur.pop()}return f}},process.addListener("uncaughtException",Zn));var Ko,Jn,Ip;function mD(e,t,r){Oe=!0;for(var n=0;n<r;++n){var i=t[n];i.create&&i.create(i.data)}return Oe=!1,function(){ur.push(V),V=Ap(t,V);var a=e.apply(this,arguments);return V=ur.pop(),a}}function yD(e){var t=V.length;if(t===0)return e;for(var r=V.slice(),n=0;n<t;++n)if(r[n].flags>0)return Sp(e,r,t);return mD(e,r,t)}function gt(e,t){typeof e.create=="function"&&(this.create=e.create,this.flags|=mp),typeof e.before=="function"&&(this.before=e.before,this.flags|=yp),typeof e.after=="function"&&(this.after=e.after,this.flags|=Tp),typeof e.error=="function"&&(this.error=e.error,this.flags|=zo),this.uid=++ED,this.data=t===void 0?null:t}gt.prototype.create=void 0;gt.prototype.before=void 0;gt.prototype.after=void 0;gt.prototype.error=void 0;gt.prototype.data=void 0;gt.prototype.uid=0;gt.prototype.flags=0;function km(e,t){if(typeof e!="object"||!e)throw new TypeError("callbacks argument must be an object");return e instanceof gt?e:new gt(e,t)}function TD(e,t){var r;e instanceof gt?r=e:r=km(e,t);for(var n=!1,i=0;i<V.length;i++)if(r===V[i]){n=!0;break}return n||V.push(r),r}function SD(e){for(var t=0;t<V.length;t++)if(e===V[t]){V.splice(t,1);break}}process.createAsyncListener=km;process.addAsyncListener=TD;process.removeAsyncListener=SD;Hm.exports=yD});var Gm=l((C1,Bm)=>{"use strict";Bm.exports=(e,t)=>class extends e{constructor(n){var i,a;super(o);var s=this;try{n.apply(i,a)}catch(u){a[1](u)}return s;function o(u,c){i=this,a=[p,f];function p(d){return t(s,!1),u(d)}function f(d){return t(s,!1),c(d)}}}}});var Ym=l(()=>{"use strict";if(process.addAsyncListener)throw new Error("Don't require polyfill unless needed");var Fm=Ro(),Xo=jm(),je=Fm.wrap,cr=Fm.massWrap,re=Um(),AD=__webpack_require__(/*! util */ "util"),ID=Xo.gte(process.version,"6.0.0"),bp=Xo.gte(process.version,"7.0.0"),bD=Xo.gte(process.version,"8.0.0"),CD=Xo.gte(process.version,"11.0.0"),Et=__webpack_require__(/*! net */ "net");bp&&!Et._normalizeArgs?Et._normalizeArgs=function(e){if(e.length===0)return[{},null];var t=e[0],r={};typeof t=="object"&&t!==null?r=t:DD(t)?r.path=t:(r.port=t,e.length>1&&typeof e[1]=="string"&&(r.host=e[1]));var n=e[e.length-1];return typeof n!="function"?[r,null]:[r,n]}:!bp&&!Et._normalizeConnectArgs&&(Et._normalizeConnectArgs=function(e){var t={};function r(i){return(i=Number(i))>=0?i:!1}typeof e[0]=="object"&&e[0]!==null?t=e[0]:typeof e[0]=="string"&&r(e[0])===!1?t.path=e[0]:(t.port=e[0],typeof e[1]=="string"&&(t.host=e[1]));var n=e[e.length-1];return typeof n=="function"?[t,n]:[t]});"_setUpListenHandle"in Et.Server.prototype?je(Et.Server.prototype,"_setUpListenHandle",Vm):je(Et.Server.prototype,"_listen2",Vm);function Vm(e){return function(){this.on("connection",function(t){t._handle&&(t._handle.onread=re(t._handle.onread))});try{return e.apply(this,arguments)}finally{this._handle&&this._handle.onconnection&&(this._handle.onconnection=re(this._handle.onconnection))}}}function $m(e){if(e&&e._handle){var t=e._handle;t._originalOnread||(t._originalOnread=t.onread),t.onread=re(t._originalOnread)}}je(Et.Socket.prototype,"connect",function(e){return function(){var t;bD&&Array.isArray(arguments[0])&&Object.getOwnPropertySymbols(arguments[0]).length>0?t=arguments[0]:t=bp?Et._normalizeArgs(arguments):Et._normalizeConnectArgs(arguments),t[1]&&(t[1]=re(t[1]));var r=e.apply(this,t);return $m(this),r}});var OD=__webpack_require__(/*! http */ "http");je(OD.Agent.prototype,"addRequest",function(e){return function(t){var r=t.onSocket;return t.onSocket=re(function(n){return $m(n),r.apply(this,arguments)}),e.apply(this,arguments)}});var Cp=__webpack_require__(/*! child_process */ "child_process");function zm(e){Array.isArray(e.stdio)&&e.stdio.forEach(function(t){t&&t._handle&&(t._handle.onread=re(t._handle.onread),je(t._handle,"close",Qo))}),e._handle&&(e._handle.onexit=re(e._handle.onexit))}Cp.ChildProcess?je(Cp.ChildProcess.prototype,"spawn",function(e){return function(){var t=e.apply(this,arguments);return zm(this),t}}):cr(Cp,["execFile","fork","spawn"],function(e){return function(){var t=e.apply(this,arguments);return zm(t),t}});process._fatalException||(process._originalNextTick=process.nextTick);var Op=[];process._nextDomainTick&&Op.push("_nextDomainTick");process._tickDomainCallback&&Op.push("_tickDomainCallback");cr(process,Op,mt);je(process,"nextTick",Qo);var Pp=["setTimeout","setInterval"];global.setImmediate&&Pp.push("setImmediate");var Km=__webpack_require__(/*! timers */ "timers"),PD=global.setTimeout===Km.setTimeout;cr(Km,Pp,Qo);PD&&cr(global,Pp,Qo);var Rp=__webpack_require__(/*! dns */ "dns");cr(Rp,["lookup","resolve","resolve4","resolve6","resolveCname","resolveMx","resolveNs","resolveTxt","resolveSrv","reverse"],mt);Rp.resolveNaptr&&je(Rp,"resolveNaptr",mt);var Xr=__webpack_require__(/*! fs */ "fs");cr(Xr,["watch","rename","truncate","chown","fchown","chmod","fchmod","stat","lstat","fstat","link","symlink","readlink","realpath","unlink","rmdir","mkdir","readdir","close","open","utimes","futimes","fsync","write","read","readFile","writeFile","appendFile","watchFile","unwatchFile","exists"],mt);Xr.lchown&&je(Xr,"lchown",mt);Xr.lchmod&&je(Xr,"lchmod",mt);Xr.ftruncate&&je(Xr,"ftruncate",mt);var Ea;try{Ea=__webpack_require__(/*! zlib */ "zlib")}catch(e){}Ea&&Ea.Deflate&&Ea.Deflate.prototype&&(Yr=Object.getPrototypeOf(Ea.Deflate.prototype),Yr._transform?je(Yr,"_transform",mt):Yr.write&&Yr.flush&&Yr.end&&cr(Yr,["write","flush","end"],mt));var Yr,Np;try{Np=__webpack_require__(/*! crypto */ "crypto")}catch(e){}Np&&(Dp=["pbkdf2","randomBytes"],CD||Dp.push("pseudoRandomBytes"),cr(Np,Dp,mt));var Dp,Yo=!!global.Promise&&Promise.toString()==="function Promise() { [native code] }"&&Promise.toString.toString()==="function toString() { [native code] }";Yo&&(Xm=process.addAsyncListener({create:function(){Yo=!1}}),global.Promise.resolve(!0).then(function(){Yo=!1}),process.removeAsyncListener(Xm));var Xm;Yo&&RD();function RD(){var e=global.Promise;function t(s){if(!(this instanceof t))return e(s);if(typeof s!="function")return new e(s);var o,u,c=new e(p);c.__proto__=t.prototype;try{s.apply(o,u)}catch(f){u[1](f)}return c;function p(f,d){o=this,u=[h,E];function h(S){return n(c,!1),f(S)}function E(S){return n(c,!1),d(S)}}}if(AD.inherits(t,e),je(e.prototype,"then",a),e.prototype.chain&&je(e.prototype,"chain",a),ID)global.Promise=Gm()(e,n);else{var r=["all","race","reject","resolve","accept","defer"];r.forEach(function(s){typeof e[s]=="function"&&(t[s]=e[s])}),global.Promise=t}function n(s,o){(!s.__asl_wrapper||o)&&(s.__asl_wrapper=re(i))}function i(s,o,u,c){var p;try{return p=o.call(s,u),{returnVal:p,error:!1}}catch(f){return{errorVal:f,error:!0}}finally{p instanceof e?c.__asl_wrapper=function(){var d=p.__asl_wrapper||i;return d.apply(this,arguments)}:n(c,!0)}}function a(s){return function(){var u=this,c=s.apply(u,Array.prototype.map.call(arguments,p));return c.__asl_wrapper=function(d,h,E,S){return u.__asl_wrapper?(u.__asl_wrapper(d,function(){},null,c),c.__asl_wrapper(d,h,E,S)):i(d,h,E,S)},c;function p(f){return typeof f!="function"?f:re(function(d){var h=(u.__asl_wrapper||i)(this,f,d,c);if(h.error)throw h.errorVal;return h.returnVal})}}}}function mt(e){var t=function(){var r,n=arguments.length-1;if(typeof arguments[n]=="function"){r=Array(arguments.length);for(var i=0;i<arguments.length-1;i++)r[i]=arguments[i];r[n]=re(arguments[n])}return e.apply(this,r||arguments)};switch(e.length){case 1:return function(r){return arguments.length!==1?t.apply(this,arguments):(typeof r=="function"&&(r=re(r)),e.call(this,r))};case 2:return function(r,n){return arguments.length!==2?t.apply(this,arguments):(typeof n=="function"&&(n=re(n)),e.call(this,r,n))};case 3:return function(r,n,i){return arguments.length!==3?t.apply(this,arguments):(typeof i=="function"&&(i=re(i)),e.call(this,r,n,i))};case 4:return function(r,n,i,a){return arguments.length!==4?t.apply(this,arguments):(typeof a=="function"&&(a=re(a)),e.call(this,r,n,i,a))};case 5:return function(r,n,i,a,s){return arguments.length!==5?t.apply(this,arguments):(typeof s=="function"&&(s=re(s)),e.call(this,r,n,i,a,s))};case 6:return function(r,n,i,a,s,o){return arguments.length!==6?t.apply(this,arguments):(typeof o=="function"&&(o=re(o)),e.call(this,r,n,i,a,s,o))};default:return t}}function Qo(e){var t=function(){var r;if(typeof arguments[0]=="function"){r=Array(arguments.length),r[0]=re(arguments[0]);for(var n=1;n<arguments.length;n++)r[n]=arguments[n]}return e.apply(this,r||arguments)};switch(e.length){case 1:return function(r){return arguments.length!==1?t.apply(this,arguments):(typeof r=="function"&&(r=re(r)),e.call(this,r))};case 2:return function(r,n){return arguments.length!==2?t.apply(this,arguments):(typeof r=="function"&&(r=re(r)),e.call(this,r,n))};case 3:return function(r,n,i){return arguments.length!==3?t.apply(this,arguments):(typeof r=="function"&&(r=re(r)),e.call(this,r,n,i))};case 4:return function(r,n,i,a){return arguments.length!==4?t.apply(this,arguments):(typeof r=="function"&&(r=re(r)),e.call(this,r,n,i,a))};case 5:return function(r,n,i,a,s){return arguments.length!==5?t.apply(this,arguments):(typeof r=="function"&&(r=re(r)),e.call(this,r,n,i,a,s))};case 6:return function(r,n,i,a,s,o){return arguments.length!==6?t.apply(this,arguments):(typeof r=="function"&&(r=re(r)),e.call(this,r,n,i,a,s,o))};default:return t}}function ND(e){return(e=Number(e))>=0?e:!1}function DD(e){return typeof e=="string"&&ND(e)===!1}});var ey=l((R1,Jm)=>{"use strict";var jt=__webpack_require__(/*! assert */ "assert"),wD=wo(),ma="cls@contexts",wp="error@context";process.addAsyncListener||Ym();function ot(e){this.name=e,this.active=null,this._set=[],this.id=null}ot.prototype.set=function(e,t){if(!this.active)throw new Error("No context available. ns.run() or ns.bind() must be called first.");return this.active[e]=t,t};ot.prototype.get=function(e){if(!!this.active)return this.active[e]};ot.prototype.createContext=function(){return Object.create(this.active)};ot.prototype.run=function(e){var t=this.createContext();this.enter(t);try{return e(t),t}catch(r){throw r&&(r[wp]=t),r}finally{this.exit(t)}};ot.prototype.runAndReturn=function(e){var t;return this.run(function(r){t=e(r)}),t};ot.prototype.bind=function(e,t){t||(this.active?t=this.active:t=this.createContext());var r=this;return function(){r.enter(t);try{return e.apply(this,arguments)}catch(n){throw n&&(n[wp]=t),n}finally{r.exit(t)}}};ot.prototype.enter=function(e){jt.ok(e,"context must be provided for entering"),this._set.push(this.active),this.active=e};ot.prototype.exit=function(e){if(jt.ok(e,"context must be provided for exiting"),this.active===e){jt.ok(this._set.length,"can't remove top context"),this.active=this._set.pop();return}var t=this._set.lastIndexOf(e);jt.ok(t>=0,"context not currently entered; can't exit"),jt.ok(t,"can't remove top context"),this._set.splice(t,1)};ot.prototype.bindEmitter=function(e){jt.ok(e.on&&e.addListener&&e.emit,"can only bind real EEs");var t=this,r="context@"+this.name;function n(a){!a||(a[ma]||(a[ma]=Object.create(null)),a[ma][r]={namespace:t,context:t.active})}function i(a){if(!(a&&a[ma]))return a;var s=a,o=a[ma];return Object.keys(o).forEach(function(u){var c=o[u];s=c.namespace.bind(s,c.context)}),s}wD(e,n,i)};ot.prototype.fromException=function(e){return e[wp]};function Qm(e){return process.namespaces[e]}function xD(e){jt.ok(e,"namespace must be given a name!");var t=new ot(e);return t.id=process.addAsyncListener({create:function(){return t.active},before:function(r,n){n&&t.enter(n)},after:function(r,n){n&&t.exit(n)},error:function(r){r&&t.exit(r)}}),process.namespaces[e]=t,t}function Wm(e){var t=Qm(e);jt.ok(t,"can't delete nonexistent namespace!"),jt.ok(t.id,"don't assign to process.namespaces directly!"),process.removeAsyncListener(t.id),process.namespaces[e]=null}function Zm(){process.namespaces&&Object.keys(process.namespaces).forEach(function(e){Wm(e)}),process.namespaces=Object.create(null)}process.namespaces||Zm();Jm.exports={getNamespace:Qm,createNamespace:xD,destroyNamespace:Wm,reset:Zm}});var gr=l(Wo=>{"use strict";Object.defineProperty(Wo,"__esModule",{value:!0});Wo.CorrelationContextManager=void 0;var ty=ve(),MD=ho(),ei=Zi(),xp=al(),ry=Il(),LD=function(){function e(){}return e.getCurrentContext=function(){if(!e.enabled)return null;var t=e.session.get(e.CONTEXT_NAME);return t===void 0?null:t},e.generateContextObject=function(t,r,n,i,a,s){return r=r||t,this.enabled?{operation:{name:n,id:t,parentId:r,traceparent:a,tracestate:s},customProperties:new qD(i)}:null},e.spanToContextObject=function(t,r,n){var i=new ei;return i.traceId=t.traceId,i.spanId=t.spanId,i.traceFlag=ei.formatOpenTelemetryTraceFlags(t.traceFlags)||ei.DEFAULT_TRACE_FLAG,i.parentId=r,e.generateContextObject(i.traceId,i.parentId,n,null,i)},e.runWithContext=function(t,r){var n;return e.enabled?e.session.bind(r,(n={},n[e.CONTEXT_NAME]=t,n))():r()},e.wrapEmitter=function(t){e.enabled&&e.session.bindEmitter(t)},e.wrapCallback=function(t,r){var n;return e.enabled?e.session.bind(t,r?(n={},n[e.CONTEXT_NAME]=r,n):void 0):t},e.enable=function(t){if(!this.enabled){if(!this.isNodeVersionCompatible()){this.enabled=!1;return}e.hasEverEnabled||(this.forceClsHooked=t,this.hasEverEnabled=!0,typeof this.cls=="undefined"&&(e.forceClsHooked===!0||e.forceClsHooked===void 0&&e.shouldUseClsHooked()?this.cls=ym():this.cls=ey()),e.session=this.cls.createNamespace("AI-CLS-Session"),MD.registerContextPreservation(function(r){return e.session.bind(r)})),this.enabled=!0}},e.startOperation=function(t,r){var n=t&&t.traceContext||null,i=t&&t.traceId?t:null,a=t&&t.headers;if(i){var s=new ei("00-"+i.traceId+"-"+i.spanId+"-01"),o=new xp(i.traceState?i.traceState.serialize():null),u=e.generateContextObject(i.traceId,"|"+i.traceId+"."+i.spanId+".",typeof r=="string"?r:"",void 0,s,o);return u}if(n){var s=new ei(n.traceparent),o=new xp(n.tracestate),c=typeof r=="object"?new ry(r):null,u=e.generateContextObject(s.traceId,s.parentId,typeof r=="string"?r:c.getOperationName({}),c&&c.getCorrelationContextHeader()||void 0,s,o);return u}if(a){var s=new ei(a.traceparent?a.traceparent.toString():null),o=new xp(a.tracestate?a.tracestate.toString():null),c=new ry(t),u=e.generateContextObject(s.traceId,s.parentId,c.getOperationName({}),c.getCorrelationContextHeader(),s,o);return u}return ty.warn("startOperation was called with invalid arguments",arguments),null},e.disable=function(){this.enabled=!1},e.reset=function(){e.hasEverEnabled&&(e.session=null,e.session=this.cls.createNamespace("AI-CLS-Session"))},e.isNodeVersionCompatible=function(){var t=process.versions.node.split(".");return parseInt(t[0])>3||parseInt(t[0])>2&&parseInt(t[1])>2},e.shouldUseClsHooked=function(){var t=process.versions.node.split(".");return parseInt(t[0])>8||parseInt(t[0])>=8&&parseInt(t[1])>=2},e.canUseClsHooked=function(){var t=process.versions.node.split("."),r=parseInt(t[0])>8||parseInt(t[0])>=8&&parseInt(t[1])>=0,n=parseInt(t[0])<8||parseInt(t[0])<=8&&parseInt(t[1])<2,i=parseInt(t[0])>4||parseInt(t[0])>=4&&parseInt(t[1])>=7;return!(r&&n)&&i},e.enabled=!1,e.hasEverEnabled=!1,e.forceClsHooked=void 0,e.CONTEXT_NAME="ApplicationInsights-Context",e}();Wo.CorrelationContextManager=LD;var qD=function(){function e(t){this.props=[],this.addHeaderData(t)}return e.prototype.addHeaderData=function(t){var r=t?t.split(", "):[];this.props=r.map(function(n){var i=n.split("=");return{key:i[0],value:i[1]}}).concat(this.props)},e.prototype.serializeToHeader=function(){return this.props.map(function(t){return t.key+"="+t.value}).join(", ")},e.prototype.getProperty=function(t){for(var r=0;r<this.props.length;++r){var n=this.props[r];if(n.key===t)return n.value}},e.prototype.setProperty=function(t,r){if(e.bannedCharacters.test(t)||e.bannedCharacters.test(r)){ty.warn("Correlation context property keys and values must not contain ',' or '='. setProperty was called with key: "+t+" and value: "+r);return}for(var n=0;n<this.props.length;++n){var i=this.props[n];if(i.key===t){i.value=r;return}}this.props.push({key:t,value:r})},e.bannedCharacters=/[,=]/,e}()});var iy=l(ti=>{"use strict";Object.defineProperty(ti,"__esModule",{value:!0});ti.dispose=ti.enable=void 0;var ny=De(),Mp=ue(),Qr=[],Lp=function(e){var t=e.data.message;Qr.forEach(function(r){t instanceof Error?r.trackException({exception:t}):(t.lastIndexOf(`
`)==t.length-1&&(t=t.substring(0,t.length-1)),r.trackTrace({message:t,severity:e.data.stderr?ny.SeverityLevel.Warning:ny.SeverityLevel.Information}))})};function jD(e,t){e?(Qr.length===0&&Mp.channel.subscribe("console",Lp),Qr.push(t)):(Qr=Qr.filter(function(r){return r!=t}),Qr.length===0&&Mp.channel.unsubscribe("console",Lp))}ti.enable=jD;function kD(){Mp.channel.unsubscribe("console",Lp),Qr=[]}ti.dispose=kD});var ay=l(ni=>{"use strict";Object.defineProperty(ni,"__esModule",{value:!0});ni.dispose=ni.enable=void 0;var ri=De(),qp=ue(),Wr=[],HD={10:ri.SeverityLevel.Verbose,20:ri.SeverityLevel.Verbose,30:ri.SeverityLevel.Information,40:ri.SeverityLevel.Warning,50:ri.SeverityLevel.Error,60:ri.SeverityLevel.Critical},jp=function(e){var t=e.data.result;Wr.forEach(function(r){var n=HD[e.data.level];t instanceof Error?r.trackException({exception:t}):r.trackTrace({message:t,severity:n})})};function UD(e,t){e?(Wr.length===0&&qp.channel.subscribe("bunyan",jp),Wr.push(t)):(Wr=Wr.filter(function(r){return r!=t}),Wr.length===0&&qp.channel.unsubscribe("bunyan",jp))}ni.enable=UD;function BD(){qp.channel.unsubscribe("bunyan",jp),Wr=[]}ni.dispose=BD});var sy=l(ii=>{"use strict";Object.defineProperty(ii,"__esModule",{value:!0});ii.dispose=ii.enable=void 0;var Se=De(),kp=ue(),Zr=[],GD={syslog:function(e){var t={emerg:Se.SeverityLevel.Critical,alert:Se.SeverityLevel.Critical,crit:Se.SeverityLevel.Critical,error:Se.SeverityLevel.Error,warning:Se.SeverityLevel.Warning,notice:Se.SeverityLevel.Information,info:Se.SeverityLevel.Information,debug:Se.SeverityLevel.Verbose};return t[e]===void 0?Se.SeverityLevel.Information:t[e]},npm:function(e){var t={error:Se.SeverityLevel.Error,warn:Se.SeverityLevel.Warning,info:Se.SeverityLevel.Information,verbose:Se.SeverityLevel.Verbose,debug:Se.SeverityLevel.Verbose,silly:Se.SeverityLevel.Verbose};return t[e]===void 0?Se.SeverityLevel.Information:t[e]},unknown:function(e){return Se.SeverityLevel.Information}},Hp=function(e){var t=e.data.message;Zr.forEach(function(r){if(t instanceof Error)r.trackException({exception:t,properties:e.data.meta});else{var n=GD[e.data.levelKind](e.data.level);r.trackTrace({message:t,severity:n,properties:e.data.meta})}})};function FD(e,t){e?(Zr.length===0&&kp.channel.subscribe("winston",Hp),Zr.push(t)):(Zr=Zr.filter(function(r){return r!=t}),Zr.length===0&&kp.channel.unsubscribe("winston",Hp))}ii.enable=FD;function VD(){kp.channel.unsubscribe("winston",Hp),Zr=[]}ii.dispose=VD});var uy=l((M1,oy)=>{"use strict";var $D=ho(),zD=function(){function e(t){if(e.INSTANCE)throw new Error("Console logging adapter tracking should be configured from the applicationInsights object");this._client=t,e.INSTANCE=this}return e.prototype.enable=function(t,r){$D.IsInitialized&&(iy().enable(t&&r,this._client),ay().enable(t,this._client),sy().enable(t,this._client))},e.prototype.isInitialized=function(){return this._isInitialized},e.prototype.dispose=function(){e.INSTANCE=null,this.enable(!1,!1)},e._methodNames=["debug","info","log","warn","error"],e}();oy.exports=zD});var ly=l((L1,cy)=>{"use strict";var KD=function(){function e(t){if(e.INSTANCE)throw new Error("Exception tracking should be configured from the applicationInsights object");e.INSTANCE=this,this._client=t;var r=process.versions.node.split(".");e._canUseUncaughtExceptionMonitor=parseInt(r[0])>13||parseInt(r[0])===13&&parseInt(r[1])>=7}return e.prototype.isInitialized=function(){return this._isInitialized},e.prototype.enable=function(t){var r=this;if(t){this._isInitialized=!0;var n=this;if(!this._exceptionListenerHandle){var i=function(a,s,o){o===void 0&&(o=new Error(e._FALLBACK_ERROR_MESSAGE)),r._client.trackException({exception:o}),r._client.flush({isAppCrashing:!0}),a&&s&&process.listeners(s).length===1&&(console.error(o),process.exit(1))};e._canUseUncaughtExceptionMonitor?(this._exceptionListenerHandle=i.bind(this,!1,void 0),process.on(e.UNCAUGHT_EXCEPTION_MONITOR_HANDLER_NAME,this._exceptionListenerHandle)):(this._exceptionListenerHandle=i.bind(this,!0,e.UNCAUGHT_EXCEPTION_HANDLER_NAME),this._rejectionListenerHandle=i.bind(this,!1,void 0),process.on(e.UNCAUGHT_EXCEPTION_HANDLER_NAME,this._exceptionListenerHandle),process.on(e.UNHANDLED_REJECTION_HANDLER_NAME,this._rejectionListenerHandle))}}else this._exceptionListenerHandle&&(e._canUseUncaughtExceptionMonitor?process.removeListener(e.UNCAUGHT_EXCEPTION_MONITOR_HANDLER_NAME,this._exceptionListenerHandle):(process.removeListener(e.UNCAUGHT_EXCEPTION_HANDLER_NAME,this._exceptionListenerHandle),process.removeListener(e.UNHANDLED_REJECTION_HANDLER_NAME,this._rejectionListenerHandle)),this._exceptionListenerHandle=void 0,this._rejectionListenerHandle=void 0,delete this._exceptionListenerHandle,delete this._rejectionListenerHandle)},e.prototype.dispose=function(){e.INSTANCE=null,this.enable(!1),this._isInitialized=!1},e.INSTANCE=null,e.UNCAUGHT_EXCEPTION_MONITOR_HANDLER_NAME="uncaughtExceptionMonitor",e.UNCAUGHT_EXCEPTION_HANDLER_NAME="uncaughtException",e.UNHANDLED_REJECTION_HANDLER_NAME="unhandledRejection",e._RETHROW_EXIT_MESSAGE="Application Insights Rethrow Exception Handler",e._FALLBACK_ERROR_MESSAGE="A promise was rejected without providing an error. Application Insights generated this error stack for you.",e._canUseUncaughtExceptionMonitor=!1,e}();cy.exports=KD});var kt=l(T=>{"use strict";var ut;Object.defineProperty(T,"__esModule",{value:!0});T.HeartBeatMetricName=T.DependencyTypeName=T.SpanAttribute=T.TelemetryTypeStringToQuickPulseDocumentType=T.TelemetryTypeStringToQuickPulseType=T.QuickPulseType=T.QuickPulseDocumentType=T.PerformanceToQuickPulseCounter=T.MetricId=T.PerformanceCounter=T.QuickPulseCounter=T.DEFAULT_LIVEMETRICS_HOST=T.DEFAULT_LIVEMETRICS_ENDPOINT=T.DEFAULT_BREEZE_ENDPOINT=void 0;T.DEFAULT_BREEZE_ENDPOINT="https://dc.services.visualstudio.com";T.DEFAULT_LIVEMETRICS_ENDPOINT="https://rt.services.visualstudio.com";T.DEFAULT_LIVEMETRICS_HOST="rt.services.visualstudio.com";var Pe;(function(e){e.COMMITTED_BYTES="\\Memory\\Committed Bytes",e.PROCESSOR_TIME="\\Processor(_Total)\\% Processor Time",e.REQUEST_RATE="\\ApplicationInsights\\Requests/Sec",e.REQUEST_FAILURE_RATE="\\ApplicationInsights\\Requests Failed/Sec",e.REQUEST_DURATION="\\ApplicationInsights\\Request Duration",e.DEPENDENCY_RATE="\\ApplicationInsights\\Dependency Calls/Sec",e.DEPENDENCY_FAILURE_RATE="\\ApplicationInsights\\Dependency Calls Failed/Sec",e.DEPENDENCY_DURATION="\\ApplicationInsights\\Dependency Call Duration",e.EXCEPTION_RATE="\\ApplicationInsights\\Exceptions/Sec"})(Pe=T.QuickPulseCounter||(T.QuickPulseCounter={}));var Zo;(function(e){e.PRIVATE_BYTES="\\Process(??APP_WIN32_PROC??)\\Private Bytes",e.AVAILABLE_BYTES="\\Memory\\Available Bytes",e.PROCESSOR_TIME="\\Processor(_Total)\\% Processor Time",e.PROCESS_TIME="\\Process(??APP_WIN32_PROC??)\\% Processor Time",e.REQUEST_RATE="\\ASP.NET Applications(??APP_W3SVC_PROC??)\\Requests/Sec",e.REQUEST_DURATION="\\ASP.NET Applications(??APP_W3SVC_PROC??)\\Request Execution Time"})(Zo=T.PerformanceCounter||(T.PerformanceCounter={}));var XD;(function(e){e.REQUESTS_DURATION="requests/duration",e.DEPENDENCIES_DURATION="dependencies/duration",e.EXCEPTIONS_COUNT="exceptions/count",e.TRACES_COUNT="traces/count"})(XD=T.MetricId||(T.MetricId={}));T.PerformanceToQuickPulseCounter=(ut={},ut[Zo.PROCESSOR_TIME]=Pe.PROCESSOR_TIME,ut[Zo.REQUEST_RATE]=Pe.REQUEST_RATE,ut[Zo.REQUEST_DURATION]=Pe.REQUEST_DURATION,ut[Pe.COMMITTED_BYTES]=Pe.COMMITTED_BYTES,ut[Pe.REQUEST_FAILURE_RATE]=Pe.REQUEST_FAILURE_RATE,ut[Pe.DEPENDENCY_RATE]=Pe.DEPENDENCY_RATE,ut[Pe.DEPENDENCY_FAILURE_RATE]=Pe.DEPENDENCY_FAILURE_RATE,ut[Pe.DEPENDENCY_DURATION]=Pe.DEPENDENCY_DURATION,ut[Pe.EXCEPTION_RATE]=Pe.EXCEPTION_RATE,ut);T.QuickPulseDocumentType={Event:"Event",Exception:"Exception",Trace:"Trace",Metric:"Metric",Request:"Request",Dependency:"RemoteDependency",Availability:"Availability",PageView:"PageView"};T.QuickPulseType={Event:"EventTelemetryDocument",Exception:"ExceptionTelemetryDocument",Trace:"TraceTelemetryDocument",Metric:"MetricTelemetryDocument",Request:"RequestTelemetryDocument",Dependency:"DependencyTelemetryDocument",Availability:"AvailabilityTelemetryDocument",PageView:"PageViewTelemetryDocument"};T.TelemetryTypeStringToQuickPulseType={EventData:T.QuickPulseType.Event,ExceptionData:T.QuickPulseType.Exception,MessageData:T.QuickPulseType.Trace,MetricData:T.QuickPulseType.Metric,RequestData:T.QuickPulseType.Request,RemoteDependencyData:T.QuickPulseType.Dependency,AvailabilityData:T.QuickPulseType.Availability,PageViewData:T.QuickPulseType.PageView};T.TelemetryTypeStringToQuickPulseDocumentType={EventData:T.QuickPulseDocumentType.Event,ExceptionData:T.QuickPulseDocumentType.Exception,MessageData:T.QuickPulseDocumentType.Trace,MetricData:T.QuickPulseDocumentType.Metric,RequestData:T.QuickPulseDocumentType.Request,RemoteDependencyData:T.QuickPulseDocumentType.Dependency,AvailabilityData:T.QuickPulseDocumentType.Availability,PageViewData:T.QuickPulseDocumentType.PageView};T.SpanAttribute={HttpHost:"http.host",HttpMethod:"http.method",HttpPort:"http.port",HttpStatusCode:"http.status_code",HttpUrl:"http.url",HttpUserAgent:"http.user_agent",GrpcMethod:"grpc.method",GrpcService:"rpc.service"};T.DependencyTypeName={Grpc:"GRPC",Http:"HTTP",InProc:"InProc"};T.HeartBeatMetricName="HeartBeat"});var eu=l((j1,py)=>{"use strict";var Jo=__webpack_require__(/*! os */ "os"),Je=kt(),YD=function(){function e(t,r,n){r===void 0&&(r=6e4),n===void 0&&(n=!1),this._lastIntervalRequestExecutionTime=0,this._lastIntervalDependencyExecutionTime=0,e.INSTANCE||(e.INSTANCE=this),this._isInitialized=!1,this._client=t,this._collectionInterval=r,this._enableLiveMetricsCounters=n}return e.prototype.enable=function(t,r){var n=this;this._isEnabled=t,this._isEnabled&&!this._isInitialized&&(this._isInitialized=!0),t?this._handle||(this._lastCpus=Jo.cpus(),this._lastRequests={totalRequestCount:e._totalRequestCount,totalFailedRequestCount:e._totalFailedRequestCount,time:+new Date},this._lastDependencies={totalDependencyCount:e._totalDependencyCount,totalFailedDependencyCount:e._totalFailedDependencyCount,time:+new Date},this._lastExceptions={totalExceptionCount:e._totalExceptionCount,time:+new Date},typeof process.cpuUsage=="function"&&(this._lastAppCpuUsage=process.cpuUsage()),this._lastHrtime=process.hrtime(),this._collectionInterval=r||this._collectionInterval,this._handle=setInterval(function(){return n.trackPerformance()},this._collectionInterval),this._handle.unref()):this._handle&&(clearInterval(this._handle),this._handle=void 0)},e.countRequest=function(t,r){var n;if(!!e.isEnabled()){if(typeof t=="string")n=+new Date("1970-01-01T"+t+"Z");else if(typeof t=="number")n=t;else return;e._intervalRequestExecutionTime+=n,r===!1&&e._totalFailedRequestCount++,e._totalRequestCount++}},e.countException=function(){e._totalExceptionCount++},e.countDependency=function(t,r){var n;if(!!e.isEnabled()){if(typeof t=="string")n=+new Date("1970-01-01T"+t+"Z");else if(typeof t=="number")n=t;else return;e._intervalDependencyExecutionTime+=n,r===!1&&e._totalFailedDependencyCount++,e._totalDependencyCount++}},e.prototype.isInitialized=function(){return this._isInitialized},e.isEnabled=function(){return e.INSTANCE&&e.INSTANCE._isEnabled},e.prototype.trackPerformance=function(){this._trackCpu(),this._trackMemory(),this._trackNetwork(),this._trackDependencyRate(),this._trackExceptionRate()},e.prototype._trackCpu=function(){var t=Jo.cpus();if(t&&t.length&&this._lastCpus&&t.length===this._lastCpus.length){for(var r=0,n=0,i=0,a=0,s=0,o=0;!!t&&o<t.length;o++){var u=t[o],c=this._lastCpus[o],p="% cpu("+o+") ",f=u.model,d=u.speed,h=u.times,E=c.times,S=h.user-E.user||0;r+=S;var j=h.sys-E.sys||0;n+=j;var oe=h.nice-E.nice||0;i+=oe;var Ae=h.idle-E.idle||0;a+=Ae;var At=h.irq-E.irq||0;s+=At}var tn=void 0;if(typeof process.cpuUsage=="function"){var Ti=process.cpuUsage(),rn=process.hrtime(),aS=Ti.user-this._lastAppCpuUsage.user+(Ti.system-this._lastAppCpuUsage.system)||0;if(typeof this._lastHrtime!="undefined"&&this._lastHrtime.length===2){var sS=(rn[0]-this._lastHrtime[0])*1e6+(rn[1]-this._lastHrtime[1])/1e3||0;tn=100*aS/(sS*t.length)}this._lastAppCpuUsage=Ti,this._lastHrtime=rn}var _u=r+n+i+a+s||1;this._client.trackMetric({name:Je.PerformanceCounter.PROCESSOR_TIME,value:(_u-a)/_u*100}),this._client.trackMetric({name:Je.PerformanceCounter.PROCESS_TIME,value:tn||r/_u*100})}this._lastCpus=t},e.prototype._trackMemory=function(){var t=Jo.freemem(),r=process.memoryUsage().rss,n=Jo.totalmem()-t;this._client.trackMetric({name:Je.PerformanceCounter.PRIVATE_BYTES,value:r}),this._client.trackMetric({name:Je.PerformanceCounter.AVAILABLE_BYTES,value:t}),this._enableLiveMetricsCounters&&this._client.trackMetric({name:Je.QuickPulseCounter.COMMITTED_BYTES,value:n})},e.prototype._trackNetwork=function(){var t=this._lastRequests,r={totalRequestCount:e._totalRequestCount,totalFailedRequestCount:e._totalFailedRequestCount,time:+new Date},n=r.totalRequestCount-t.totalRequestCount||0,i=r.totalFailedRequestCount-t.totalFailedRequestCount||0,a=r.time-t.time,s=a/1e3,o=(e._intervalRequestExecutionTime-this._lastIntervalRequestExecutionTime)/n||0;if(this._lastIntervalRequestExecutionTime=e._intervalRequestExecutionTime,a>0){var u=n/s,c=i/s;this._client.trackMetric({name:Je.PerformanceCounter.REQUEST_RATE,value:u}),(!this._enableLiveMetricsCounters||n>0)&&this._client.trackMetric({name:Je.PerformanceCounter.REQUEST_DURATION,value:o}),this._enableLiveMetricsCounters&&this._client.trackMetric({name:Je.QuickPulseCounter.REQUEST_FAILURE_RATE,value:c})}this._lastRequests=r},e.prototype._trackDependencyRate=function(){if(this._enableLiveMetricsCounters){var t=this._lastDependencies,r={totalDependencyCount:e._totalDependencyCount,totalFailedDependencyCount:e._totalFailedDependencyCount,time:+new Date},n=r.totalDependencyCount-t.totalDependencyCount||0,i=r.totalFailedDependencyCount-t.totalFailedDependencyCount||0,a=r.time-t.time,s=a/1e3,o=(e._intervalDependencyExecutionTime-this._lastIntervalDependencyExecutionTime)/n||0;if(this._lastIntervalDependencyExecutionTime=e._intervalDependencyExecutionTime,a>0){var u=n/s,c=i/s;this._client.trackMetric({name:Je.QuickPulseCounter.DEPENDENCY_RATE,value:u}),this._client.trackMetric({name:Je.QuickPulseCounter.DEPENDENCY_FAILURE_RATE,value:c}),(!this._enableLiveMetricsCounters||n>0)&&this._client.trackMetric({name:Je.QuickPulseCounter.DEPENDENCY_DURATION,value:o})}this._lastDependencies=r}},e.prototype._trackExceptionRate=function(){if(this._enableLiveMetricsCounters){var t=this._lastExceptions,r={totalExceptionCount:e._totalExceptionCount,time:+new Date},n=r.totalExceptionCount-t.totalExceptionCount||0,i=r.time-t.time,a=i/1e3;if(i>0){var s=n/a;this._client.trackMetric({name:Je.QuickPulseCounter.EXCEPTION_RATE,value:s})}this._lastExceptions=r}},e.prototype.dispose=function(){e.INSTANCE=null,this.enable(!1),this._isInitialized=!1},e._totalRequestCount=0,e._totalFailedRequestCount=0,e._totalDependencyCount=0,e._totalFailedDependencyCount=0,e._totalExceptionCount=0,e._intervalDependencyExecutionTime=0,e._intervalRequestExecutionTime=0,e}();py.exports=YD});var fy=l(tu=>{"use strict";Object.defineProperty(tu,"__esModule",{value:!0});tu.AggregatedMetricCounter=void 0;var QD=function(){function e(t){this.dimensions=t,this.totalCount=0,this.lastTotalCount=0,this.intervalExecutionTime=0,this.lastTime=+new Date,this.lastIntervalExecutionTime=0}return e}();tu.AggregatedMetricCounter=QD});var dy=l(ru=>{"use strict";Object.defineProperty(ru,"__esModule",{value:!0});ru.PreaggregatedMetricPropertyNames=void 0;ru.PreaggregatedMetricPropertyNames={cloudRoleInstance:"cloud/roleInstance",cloudRoleName:"cloud/roleName",operationSynthetic:"operation/synthetic",requestSuccess:"Request.Success",requestResultCode:"request/resultCode",dependencyType:"Dependency.Type",dependencyTarget:"dependency/target",dependencySuccess:"Dependency.Success",dependencyResultCode:"dependency/resultCode",traceSeverityLevel:"trace/severityLevel"}});var Bp=l((Up,hy)=>{"use strict";var nu=Up&&Up.__assign||function(){return nu=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},nu.apply(this,arguments)},iu=kt(),WD=fy(),ZD=dy(),JD=function(){function e(t,r){r===void 0&&(r=6e4),e.INSTANCE||(e.INSTANCE=this),this._isInitialized=!1,e._dependencyCountersCollection=[],e._requestCountersCollection=[],e._exceptionCountersCollection=[],e._traceCountersCollection=[],this._client=t,this._collectionInterval=r}return e.prototype.enable=function(t,r){var n=this;this._isEnabled=t,this._isEnabled&&!this._isInitialized&&(this._isInitialized=!0),t?this._handle||(this._collectionInterval=r||this._collectionInterval,this._handle=setInterval(function(){return n.trackPreAggregatedMetrics()},this._collectionInterval),this._handle.unref()):this._handle&&(clearInterval(this._handle),this._handle=void 0)},e.countException=function(t){if(!!e.isEnabled()){var r=e._getAggregatedCounter(t,this._exceptionCountersCollection);r.totalCount++}},e.countTrace=function(t){if(!!e.isEnabled()){var r=e._getAggregatedCounter(t,this._traceCountersCollection);r.totalCount++}},e.countRequest=function(t,r){if(!!e.isEnabled()){var n,i=e._getAggregatedCounter(r,this._requestCountersCollection);if(typeof t=="string")n=+new Date("1970-01-01T"+t+"Z");else if(typeof t=="number")n=t;else return;i.intervalExecutionTime+=n,i.totalCount++}},e.countDependency=function(t,r){if(!!e.isEnabled()){var n=e._getAggregatedCounter(r,this._dependencyCountersCollection),i;if(typeof t=="string")i=+new Date("1970-01-01T"+t+"Z");else if(typeof t=="number")i=t;else return;n.intervalExecutionTime+=i,n.totalCount++}},e.prototype.isInitialized=function(){return this._isInitialized},e.isEnabled=function(){return e.INSTANCE&&e.INSTANCE._isEnabled},e.prototype.trackPreAggregatedMetrics=function(){this._trackRequestMetrics(),this._trackDependencyMetrics(),this._trackExceptionMetrics(),this._trackTraceMetrics()},e._getAggregatedCounter=function(t,r){for(var n=!1,i=0;i<r.length;i++){if(t===r[i].dimensions)return r[i];if(Object.keys(t).length===Object.keys(r[i].dimensions).length){for(var a in t)if(t[a]!=r[i].dimensions[a]){n=!0;break}if(!n)return r[i];n=!1}}var s=new WD.AggregatedMetricCounter(t);return r.push(s),s},e.prototype._trackRequestMetrics=function(){for(var t=0;t<e._requestCountersCollection.length;t++){var r=e._requestCountersCollection[t];r.time=+new Date;var n=r.totalCount-r.lastTotalCount||0,i=r.time-r.lastTime,a=(r.intervalExecutionTime-r.lastIntervalExecutionTime)/n||0;r.lastIntervalExecutionTime=r.intervalExecutionTime,i>0&&n>0&&this._trackPreAggregatedMetric({name:"Server response time",dimensions:r.dimensions,value:a,count:n,aggregationInterval:i,metricType:iu.MetricId.REQUESTS_DURATION}),r.lastTotalCount=r.totalCount,r.lastTime=r.time}},e.prototype._trackDependencyMetrics=function(){for(var t=0;t<e._dependencyCountersCollection.length;t++){var r=e._dependencyCountersCollection[t];r.time=+new Date;var n=r.totalCount-r.lastTotalCount||0,i=r.time-r.lastTime,a=(r.intervalExecutionTime-r.lastIntervalExecutionTime)/n||0;r.lastIntervalExecutionTime=r.intervalExecutionTime,i>0&&n>0&&this._trackPreAggregatedMetric({name:"Dependency duration",dimensions:r.dimensions,value:a,count:n,aggregationInterval:i,metricType:iu.MetricId.DEPENDENCIES_DURATION}),r.lastTotalCount=r.totalCount,r.lastTime=r.time}},e.prototype._trackExceptionMetrics=function(){for(var t=0;t<e._exceptionCountersCollection.length;t++){var r=e._exceptionCountersCollection[t],n=r.totalCount-r.lastTotalCount||0,i=r.time-r.lastTime;this._trackPreAggregatedMetric({name:"Exceptions",dimensions:r.dimensions,value:n,count:n,aggregationInterval:i,metricType:iu.MetricId.EXCEPTIONS_COUNT}),r.lastTotalCount=r.totalCount,r.lastTime=r.time}},e.prototype._trackTraceMetrics=function(){for(var t=0;t<e._traceCountersCollection.length;t++){var r=e._traceCountersCollection[t],n=r.totalCount-r.lastTotalCount||0,i=r.time-r.lastTime;this._trackPreAggregatedMetric({name:"Traces",dimensions:r.dimensions,value:n,count:n,aggregationInterval:i,metricType:iu.MetricId.TRACES_COUNT}),r.lastTotalCount=r.totalCount,r.lastTime=r.time}},e.prototype._trackPreAggregatedMetric=function(t){var r={};for(var n in t.dimensions)r[ZD.PreaggregatedMetricPropertyNames[n]]=t.dimensions[n];r=nu(nu({},r),{"_MS.MetricId":t.metricType,"_MS.AggregationIntervalMs":String(t.aggregationInterval),"_MS.IsAutocollected":"True"});var i={name:t.name,value:t.value,count:t.count,properties:r,kind:"Aggregation"};this._client.trackMetric(i)},e.prototype.dispose=function(){e.INSTANCE=null,this.enable(!1),this._isInitialized=!1},e}();hy.exports=JD});var ya=l((U1,Ey)=>{"use strict";var Ht=__webpack_require__(/*! os */ "os"),_y=__webpack_require__(/*! fs */ "fs"),vy=__webpack_require__(/*! path */ "path"),ew=De(),gy=ve(),tw=function(){function e(t){this.keys=new ew.ContextTagKeys,this.tags={},this._loadApplicationContext(t),this._loadDeviceContext(),this._loadInternalContext()}return e.prototype._loadApplicationContext=function(t){if(t=t||vy.resolve(__dirname,"../../../../package.json"),!e.appVersion[t]){e.appVersion[t]="unknown";try{var r=JSON.parse(_y.readFileSync(t,"utf8"));r&&typeof r.version=="string"&&(e.appVersion[t]=r.version)}catch(n){gy.info("unable to read app version: ",n)}}this.tags[this.keys.applicationVersion]=e.appVersion[t]},e.prototype._loadDeviceContext=function(){this.tags[this.keys.deviceId]="",this.tags[this.keys.cloudRoleInstance]=Ht&&Ht.hostname(),this.tags[this.keys.deviceOSVersion]=Ht&&Ht.type()+" "+Ht.release(),this.tags[this.keys.cloudRole]=e.DefaultRoleName,this.tags["ai.device.osArchitecture"]=Ht&&Ht.arch(),this.tags["ai.device.osPlatform"]=Ht&&Ht.platform()},e.prototype._loadInternalContext=function(){var t=vy.resolve(__dirname,"../../package.json");if(!e.sdkVersion){e.sdkVersion="unknown";try{var r=JSON.parse(_y.readFileSync(t,"utf8"));r&&typeof r.version=="string"&&(e.sdkVersion=r.version)}catch(n){gy.info("unable to read app version: ",n)}}this.tags[this.keys.internalSdkVersion]="node:"+e.sdkVersion},e.DefaultRoleName="Web",e.appVersion={},e.sdkVersion=null,e}();Ey.exports=tw});var yy=l((Fp,my)=>{"use strict";var rw=Fp&&Fp.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),ct=__webpack_require__(/*! url */ "url"),Gp=De(),nw=Be(),iw=jn(),aw=Tl(),sw=Gr(),ow=function(e){rw(t,e);function t(r,n){var i=e.call(this)||this;return n&&n.method&&r&&(i.method=n.method,i.url=t._getUrlFromRequestOptions(r,n),i.startTime=+new Date),i}return t.prototype.onError=function(r){this._setStatus(void 0,r)},t.prototype.onResponse=function(r){this._setStatus(r.statusCode,void 0),this.correlationId=nw.getCorrelationContextTarget(r,iw.requestContextTargetKey)},t.prototype.getDependencyTelemetry=function(r,n){var i=ct.parse(this.url);i.search=void 0,i.hash=void 0;var a=this.method.toUpperCase()+" "+i.pathname,s=Gp.RemoteDependencyDataConstants.TYPE_HTTP,o=i.hostname;i.port&&(o+=":"+i.port),this.correlationId?(s=Gp.RemoteDependencyDataConstants.TYPE_AI,this.correlationId!==sw.correlationIdPrefix&&(o+=" | "+this.correlationId)):s=Gp.RemoteDependencyDataConstants.TYPE_HTTP;var u={id:n,name:a,data:this.url,duration:this.duration,success:this._isSuccess(),resultCode:this.statusCode?this.statusCode.toString():null,properties:this.properties||{},dependencyTypeName:s,target:o};if(r&&r.time?u.time=r.time:this.startTime&&(u.time=new Date(this.startTime)),r){for(var c in r)u[c]||(u[c]=r[c]);if(r.properties)for(var c in r.properties)u.properties[c]=r.properties[c]}return u},t._getUrlFromRequestOptions=function(r,n){if(typeof r=="string")if(r.indexOf("http://")===0||r.indexOf("https://")===0)r=ct.parse(r);else{var i=ct.parse(r);i.host==="443"?r=ct.parse("https://"+r):r=ct.parse("http://"+r)}else{if(r&&typeof ct.URL=="function"&&r instanceof ct.URL)return ct.format(r);var a=r;r={},a&&Object.keys(a).forEach(function(u){r[u]=a[u]})}if(r.path){var s=ct.parse(r.path);r.pathname=s.pathname,r.search=s.search}if(r.host&&r.port){var o=ct.parse("http://"+r.host);!o.port&&r.port&&(r.hostname=r.host,delete r.host)}return r.protocol=r.protocol||n.agent&&n.agent.protocol||n.protocol||void 0,r.hostname=r.hostname||"localhost",ct.format(r)},t}(aw);my.exports=ow});var Ty=l(ai=>{"use strict";var Ta=ai&&ai.__assign||function(){return Ta=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},Ta.apply(this,arguments)};Object.defineProperty(ai,"__esModule",{value:!0});ai.spanToTelemetryContract=void 0;var uw=z(),ke=kt();function Vp(e){var t=Ta({},e);return Object.keys(ke.SpanAttribute).forEach(function(r){delete t[r]}),t}function cw(e){var t="|"+e.spanContext().traceId+"."+e.spanContext().spanId+".",r=Math.round(e._duration[0]*1e3+e._duration[1]/1e6),n=e.attributes["peer.address"]?e.attributes["peer.address"].toString():"",i=e.attributes.component?e.attributes.component.toString():"",a=i.toUpperCase()===ke.DependencyTypeName.Http||!!e.attributes[ke.SpanAttribute.HttpUrl],s=i.toLowerCase()===ke.DependencyTypeName.Grpc;if(a){var o=e.attributes[ke.SpanAttribute.HttpMethod]||"GET",u=new URL(e.attributes[ke.SpanAttribute.HttpUrl].toString()),c=e.attributes[ke.SpanAttribute.HttpHost]||u.host,p=e.attributes[ke.SpanAttribute.HttpPort]||u.port||null,f=u.pathname||"/",d=o+" "+f,h=ke.DependencyTypeName.Http,E=p?(c+":"+p).toString():c.toString(),S=u.toString(),j=e.attributes[ke.SpanAttribute.HttpStatusCode]||e.status.code||0,oe=j<400;return{id:t,name:d,dependencyTypeName:h,target:E,data:S,success:oe,duration:r,url:S,resultCode:String(j),properties:Vp(e.attributes)}}else if(s){var o=e.attributes[ke.SpanAttribute.GrpcMethod]||"rpc",Ae=e.attributes[ke.SpanAttribute.GrpcService],At=Ae?o+" "+Ae:e.name;return{id:t,duration:r,name:At,target:Ae.toString(),data:Ae.toString()||At,url:Ae.toString()||At,dependencyTypeName:ke.DependencyTypeName.Grpc,resultCode:String(e.status.code||0),success:e.status.code===0,properties:Vp(e.attributes)}}else{var tn=e.name,Ti=e.links&&e.links.map(function(rn){return{operation_Id:rn.context.traceId,id:rn.context.spanId}});return{id:t,duration:r,name:tn,target:n,data:n||tn,url:n||tn,dependencyTypeName:e.kind===uw.SpanKind.INTERNAL?ke.DependencyTypeName.InProc:i||e.name,resultCode:String(e.status.code||0),success:e.status.code===0,properties:Ta(Ta({},Vp(e.attributes)),{"_MS.links":Ti||void 0})}}}ai.spanToTelemetryContract=cw});var Iy=l(lr=>{"use strict";Object.defineProperty(lr,"__esModule",{value:!0});lr.enable=lr.subscriber=void 0;var $p=z(),Sy=ue(),Ay=Zi(),lw=Ty(),pw=Eu(),si=[],fw=function(e){var t=e.data,r=lw.spanToTelemetryContract(t),n=t.spanContext(),i=new Ay;i.traceId=n.traceId,i.spanId=n.spanId,i.traceFlag=Ay.formatOpenTelemetryTraceFlags(n.traceFlags),i.parentId=t.parentSpanId?"|"+n.traceId+"."+t.parentSpanId+".":null,pw.AsyncScopeManager.with(t,function(){si.forEach(function(a){t.kind===$p.SpanKind.SERVER?a.trackRequest(r):(t.kind===$p.SpanKind.CLIENT||t.kind===$p.SpanKind.INTERNAL)&&a.trackDependency(r)})})};lr.subscriber=fw;function dw(e,t){e?(si.length===0&&Sy.channel.subscribe("azure-coretracing",lr.subscriber),si.push(t)):(si=si.filter(function(r){return r!=t}),si.length===0&&Sy.channel.unsubscribe("azure-coretracing",lr.subscriber))}lr.enable=dw});var Cy=l(pr=>{"use strict";Object.defineProperty(pr,"__esModule",{value:!0});pr.enable=pr.subscriber=void 0;var by=ue(),oi=[],hw=function(e){e.data.event.commandName!=="ismaster"&&oi.forEach(function(t){var r=e.data.startedData&&e.data.startedData.databaseName||"Unknown database";t.trackDependency({target:r,data:e.data.event.commandName,name:e.data.event.commandName,duration:e.data.event.duration,success:e.data.succeeded,resultCode:e.data.succeeded?"0":"1",time:e.data.startedData.time,dependencyTypeName:"mongodb"})})};pr.subscriber=hw;function _w(e,t){e?(oi.length===0&&by.channel.subscribe("mongodb",pr.subscriber),oi.push(t)):(oi=oi.filter(function(r){return r!=t}),oi.length===0&&by.channel.unsubscribe("mongodb",pr.subscriber))}pr.enable=_w});var Py=l(fr=>{"use strict";Object.defineProperty(fr,"__esModule",{value:!0});fr.enable=fr.subscriber=void 0;var Oy=ue(),ui=[],vw=function(e){ui.forEach(function(t){var r=e.data.query||{},n=r.sql||"Unknown query",i=!e.data.err,a=r._connection||{},s=a.config||{},o=s.socketPath?s.socketPath:(s.host||"localhost")+":"+s.port;t.trackDependency({target:o,data:n,name:n,duration:e.data.duration,success:i,resultCode:i?"0":"1",time:e.data.time,dependencyTypeName:"mysql"})})};fr.subscriber=vw;function gw(e,t){e?(ui.length===0&&Oy.channel.subscribe("mysql",fr.subscriber),ui.push(t)):(ui=ui.filter(function(r){return r!=t}),ui.length===0&&Oy.channel.unsubscribe("mysql",fr.subscriber))}fr.enable=gw});var Ny=l(dr=>{"use strict";Object.defineProperty(dr,"__esModule",{value:!0});dr.enable=dr.subscriber=void 0;var Ry=ue(),ci=[],Ew=function(e){ci.forEach(function(t){e.data.commandObj.command!=="info"&&t.trackDependency({target:e.data.address,name:e.data.commandObj.command,data:e.data.commandObj.command,duration:e.data.duration,success:!e.data.err,resultCode:e.data.err?"1":"0",time:e.data.time,dependencyTypeName:"redis"})})};dr.subscriber=Ew;function mw(e,t){e?(ci.length===0&&Ry.channel.subscribe("redis",dr.subscriber),ci.push(t)):(ci=ci.filter(function(r){return r!=t}),ci.length===0&&Ry.channel.unsubscribe("redis",dr.subscriber))}dr.enable=mw});var wy=l(hr=>{"use strict";Object.defineProperty(hr,"__esModule",{value:!0});hr.enable=hr.subscriber=void 0;var Dy=ue(),li=[],yw=function(e){li.forEach(function(t){var r=e.data.query,n=r.preparable&&r.preparable.text||r.plan||r.text||"unknown query",i=!e.data.error,a=e.data.database.host+":"+e.data.database.port;t.trackDependency({target:a,data:n,name:n,duration:e.data.duration,success:i,resultCode:i?"0":"1",time:e.data.time,dependencyTypeName:"postgres"})})};hr.subscriber=yw;function Tw(e,t){e?(li.length===0&&Dy.channel.subscribe("postgres",hr.subscriber),li.push(t)):(li=li.filter(function(r){return r!=t}),li.length===0&&Dy.channel.unsubscribe("postgres",hr.subscriber))}hr.enable=Tw});var di=l((Xp,qy)=>{"use strict";var au=Xp&&Xp.__spreadArrays||function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;for(var n=Array(e),i=0,t=0;t<r;t++)for(var a=arguments[t],s=0,o=a.length;s<o;s++,i++)n[i]=a[s];return n},pi=__webpack_require__(/*! http */ "http"),fi=__webpack_require__(/*! https */ "https"),zp=ve(),xy=Be(),_r=jn(),Sw=yy(),My=gr(),Ly=Gr(),Kp=Zi(),Aw=ho(),Iw=function(){function e(t){if(e.INSTANCE)throw new Error("Client request tracking should be configured from the applicationInsights object");e.INSTANCE=this,this._client=t}return e.prototype.enable=function(t){this._isEnabled=t,this._isEnabled&&!this._isInitialized&&this._initialize(),Aw.IsInitialized&&(Iy().enable(!0,this._client),Cy().enable(t,this._client),Py().enable(t,this._client),Ny().enable(t,this._client),wy().enable(t,this._client))},e.prototype.isInitialized=function(){return this._isInitialized},e.prototype._initialize=function(){var t=this;this._isInitialized=!0;var r=pi.request,n=fi.request,i=function(a,s){var o=!s[e.disableCollectionRequestOption]&&!a[e.alreadyAutoCollectedFlag];s.headers&&s.headers["user-agent"]&&s.headers["user-agent"].toString().indexOf("azsdk-js")!==-1&&(o=!1),a[e.alreadyAutoCollectedFlag]=!0,a&&s&&o&&(My.CorrelationContextManager.wrapEmitter(a),e.trackRequest(t._client,{options:s,request:a}))};pi.request=function(a){for(var s=[],o=1;o<arguments.length;o++)s[o-1]=arguments[o];var u=r.call.apply(r,au([pi,a],s));return i(u,a),u},fi.request=function(a){for(var s=[],o=1;o<arguments.length;o++)s[o-1]=arguments[o];var u=n.call.apply(n,au([fi,a],s));return i(u,a),u},pi.get=function(a){for(var s,o=[],u=1;u<arguments.length;u++)o[u-1]=arguments[u];var c=(s=pi.request).call.apply(s,au([pi,a],o));return c.end(),c},fi.get=function(a){for(var s,o=[],u=1;u<arguments.length;u++)o[u-1]=arguments[u];var c=(s=fi.request).call.apply(s,au([fi,a],o));return c.end(),c}},e.trackRequest=function(t,r){if(!r.options||!r.request||!t){zp.info("AutoCollectHttpDependencies.trackRequest was called with invalid parameters: ",!r.options,!r.request,!t);return}var n=new Sw(r.options,r.request),i=My.CorrelationContextManager.getCurrentContext(),a,s;if(i&&i.operation&&i.operation.traceparent&&Kp.isValidTraceId(i.operation.traceparent.traceId))i.operation.traceparent.updateSpanId(),a=i.operation.traceparent.getBackCompatRequestId();else if(Ly.w3cEnabled){var o=new Kp;s=o.toString(),a=o.getBackCompatRequestId()}else a=i&&i.operation&&i.operation.parentId+e.requestNumber+++".";if(xy.canIncludeCorrelationHeader(t,n.getUrl())&&r.request.getHeader&&r.request.setHeader&&t.config&&t.config.correlationId){var u=r.request.getHeader(_r.requestContextHeader);try{xy.safeIncludeCorrelationHeader(t,r.request,u)}catch(f){zp.warn("Request-Context header could not be set. Correlation of requests may be lost",f)}if(i&&i.operation)try{if(r.request.setHeader(_r.requestIdHeader,a),t.config.ignoreLegacyHeaders||(r.request.setHeader(_r.parentIdHeader,i.operation.id),r.request.setHeader(_r.rootIdHeader,a)),s||i.operation.traceparent)r.request.setHeader(_r.traceparentHeader,s||i.operation.traceparent.toString());else if(Ly.w3cEnabled){var o=new Kp().toString();r.request.setHeader(_r.traceparentHeader,o)}if(i.operation.tracestate){var c=i.operation.tracestate.toString();c&&r.request.setHeader(_r.traceStateHeader,c)}var p=i.customProperties.serializeToHeader();p&&r.request.setHeader(_r.correlationContextHeader,p)}catch(f){zp.warn("Correlation headers could not be set. Correlation of requests may be lost.",f)}}r.request.on&&(r.request.on("response",function(f){n.onResponse(f);var d=n.getDependencyTelemetry(r,a);d.contextObjects=d.contextObjects||{},d.contextObjects["http.RequestOptions"]=r.options,d.contextObjects["http.ClientRequest"]=r.request,d.contextObjects["http.ClientResponse"]=f,t.trackDependency(d)}),r.request.on("error",function(f){n.onError(f);var d=n.getDependencyTelemetry(r,a);d.contextObjects=d.contextObjects||{},d.contextObjects["http.RequestOptions"]=r.options,d.contextObjects["http.ClientRequest"]=r.request,d.contextObjects.Error=f,t.trackDependency(d)}),r.request.on("abort",function(){n.onError(new Error);var f=n.getDependencyTelemetry(r,a);f.contextObjects=f.contextObjects||{},f.contextObjects["http.RequestOptions"]=r.options,f.contextObjects["http.ClientRequest"]=r.request,t.trackDependency(f)}))},e.prototype.dispose=function(){e.INSTANCE=null,this.enable(!1),this._isInitialized=!1},e.disableCollectionRequestOption="disableAppInsightsAutoCollection",e.requestNumber=1,e.alreadyAutoCollectedFlag="_appInsightsAutoCollected",e}();qy.exports=Iw});var Hy=l((K1,ky)=>{"use strict";var bw=__webpack_require__(/*! os */ "os"),jy=kt(),Cw=Be(),Ow=ya(),Pw=di(),Rw="http://169.254.169.254/metadata/instance/compute",Nw="api-version=2017-12-01",Dw="format=json",ww="ENETUNREACH",xw=function(){function e(t){this._collectionInterval=9e5,this._vmData={},this._azInst_vmId="",this._azInst_subscriptionId="",this._azInst_osType="",e.INSTANCE||(e.INSTANCE=this),this._isInitialized=!1,this._client=t}return e.prototype.enable=function(t,r){var n=this;this._isEnabled=t,this._isEnabled&&!this._isInitialized&&(this._isInitialized=!0),t?this._handle||(this._handle=setInterval(function(){return n.trackHeartBeat(r,function(){})},this._collectionInterval),this._handle.unref()):this._handle&&(clearInterval(this._handle),this._handle=null)},e.prototype.isInitialized=function(){return this._isInitialized},e.isEnabled=function(){return e.INSTANCE&&e.INSTANCE._isEnabled},e.prototype.trackHeartBeat=function(t,r){var n=this,i=!1,a={},s=Ow.sdkVersion;a.sdk=s,a.osType=bw.type(),process.env.WEBSITE_SITE_NAME?(a.appSrv_SiteName=process.env.WEBSITE_SITE_NAME||"",a.appSrv_wsStamp=process.env.WEBSITE_HOME_STAMPNAME||"",a.appSrv_wsHost=process.env.WEBSITE_HOSTNAME||""):process.env.FUNCTIONS_WORKER_RUNTIME?a.azfunction_appId=process.env.WEBSITE_HOSTNAME:t&&(this._isVM===void 0?(i=!0,this._getAzureComputeMetadata(t,function(){n._isVM&&Object.keys(n._vmData).length>0&&(a.azInst_vmId=n._vmData.vmId||"",a.azInst_subscriptionId=n._vmData.subscriptionId||"",a.azInst_osType=n._vmData.osType||"",n._azInst_vmId=n._vmData.vmId||"",n._azInst_subscriptionId=n._vmData.subscriptionId||"",n._azInst_osType=n._vmData.osType||""),n._client.trackMetric({name:jy.HeartBeatMetricName,value:0,properties:a}),r()})):this._isVM&&(a.azInst_vmId=this._azInst_vmId,a.azInst_subscriptionId=this._azInst_subscriptionId,a.azInst_osType=this._azInst_osType)),i||(this._client.trackMetric({name:jy.HeartBeatMetricName,value:0,properties:a}),r())},e.prototype.dispose=function(){e.INSTANCE=null,this.enable(!1),this._isInitialized=!1},e.prototype._getAzureComputeMetadata=function(t,r){var n,i=this,a=Rw+"?"+Nw+"&"+Dw,s=(n={method:"GET"},n[Pw.disableCollectionRequestOption]=!0,n.headers={Metadata:"True"},n),o=Cw.makeRequest(t,a,s,function(u){if(u.statusCode===200){i._isVM=!0;var c="";u.on("data",function(p){c+=p}),u.on("end",function(){i._vmData=i._isJSON(c)?JSON.parse(c):{},r()})}else r()});o&&(o.on("error",function(u){u&&u.message&&u.message.indexOf(ww)>-1&&(i._isVM=!1),r()}),o.end())},e.prototype._isJSON=function(t){try{return JSON.parse(t)&&!!t}catch(r){return!1}},e}();ky.exports=xw});var Qp=l((X1,Vy)=>{"use strict";var Uy=__webpack_require__(/*! http */ "http"),By=__webpack_require__(/*! https */ "https"),Gy=ve(),Fy=Be(),Mw=jn(),Yp=Il(),Ut=gr(),Lw=eu(),qw=function(){function e(t){if(e.INSTANCE)throw new Error("Server request tracking should be configured from the applicationInsights object");e.INSTANCE=this,this._client=t}return e.prototype.enable=function(t){this._isEnabled=t,(this._isAutoCorrelating||this._isEnabled||Lw.isEnabled())&&!this._isInitialized&&(this.useAutoCorrelation(this._isAutoCorrelating),this._initialize())},e.prototype.useAutoCorrelation=function(t,r){t&&!this._isAutoCorrelating?Ut.CorrelationContextManager.enable(r):!t&&this._isAutoCorrelating&&Ut.CorrelationContextManager.disable(),this._isAutoCorrelating=t},e.prototype.isInitialized=function(){return this._isInitialized},e.prototype.isAutoCorrelating=function(){return this._isAutoCorrelating},e.prototype._generateCorrelationContext=function(t){if(!!this._isAutoCorrelating)return Ut.CorrelationContextManager.generateContextObject(t.getOperationId(this._client.context.tags),t.getRequestId(),t.getOperationName(this._client.context.tags),t.getCorrelationContextHeader(),t.getTraceparent(),t.getTracestate())},e.prototype._initialize=function(){var t=this;this._isInitialized=!0;var r=function(s){if(!!s){if(typeof s!="function")throw new Error("onRequest handler must be a function");return function(o,u){Ut.CorrelationContextManager.wrapEmitter(o),Ut.CorrelationContextManager.wrapEmitter(u);var c=o&&!o[e.alreadyAutoCollectedFlag];if(o&&c){var p=new Yp(o),f=t._generateCorrelationContext(p);Ut.CorrelationContextManager.runWithContext(f,function(){t._isEnabled&&(o[e.alreadyAutoCollectedFlag]=!0,e.trackRequest(t._client,{request:o,response:u},p)),typeof s=="function"&&s(o,u)})}else typeof s=="function"&&s(o,u)}}},n=function(s){var o=s.addListener.bind(s);s.addListener=function(u,c){switch(u){case"request":case"checkContinue":return o(u,r(c));default:return o(u,c)}},s.on=s.addListener},i=Uy.createServer;Uy.createServer=function(s,o){if(o&&typeof o=="function"){var u=i(s,r(o));return n(u),u}else{var u=i(r(s));return n(u),u}};var a=By.createServer;By.createServer=function(s,o){var u=a(s,r(o));return n(u),u}},e.trackRequestSync=function(t,r){if(!r.request||!r.response||!t){Gy.info("AutoCollectHttpRequests.trackRequestSync was called with invalid parameters: ",!r.request,!r.response,!t);return}e.addResponseCorrelationIdHeader(t,r.response);var n=Ut.CorrelationContextManager.getCurrentContext(),i=new Yp(r.request,n&&n.operation.parentId);n&&(n.operation.id=i.getOperationId(t.context.tags)||n.operation.id,n.operation.name=i.getOperationName(t.context.tags)||n.operation.name,n.operation.parentId=i.getRequestId()||n.operation.parentId,n.customProperties.addHeaderData(i.getCorrelationContextHeader())),e.endRequest(t,i,r,r.duration,r.error)},e.trackRequest=function(t,r,n){if(!r.request||!r.response||!t){Gy.info("AutoCollectHttpRequests.trackRequest was called with invalid parameters: ",!r.request,!r.response,!t);return}var i=Ut.CorrelationContextManager.getCurrentContext(),a=n||new Yp(r.request,i&&i.operation.parentId);Fy.canIncludeCorrelationHeader(t,a.getUrl())&&e.addResponseCorrelationIdHeader(t,r.response),i&&!n&&(i.operation.id=a.getOperationId(t.context.tags)||i.operation.id,i.operation.name=a.getOperationName(t.context.tags)||i.operation.name,i.operation.parentId=a.getOperationParentId(t.context.tags)||i.operation.parentId,i.customProperties.addHeaderData(a.getCorrelationContextHeader())),r.response.once&&r.response.once("finish",function(){e.endRequest(t,a,r,null,null)}),r.request.on&&r.request.on("error",function(s){e.endRequest(t,a,r,null,s)}),r.request.on&&r.request.on("aborted",function(){var s="The request has been aborted and the network socket has closed.";e.endRequest(t,a,r,null,s)})},e.addResponseCorrelationIdHeader=function(t,r){if(t.config&&t.config.correlationId&&r.getHeader&&r.setHeader&&!r.headersSent){var n=r.getHeader(Mw.requestContextHeader);Fy.safeIncludeCorrelationHeader(t,r,n)}},e.endRequest=function(t,r,n,i,a){a?r.onError(a,i):r.onResponse(n.response,i);var s=r.getRequestTelemetry(n);if(s.tagOverrides=r.getRequestTags(t.context.tags),n.tagOverrides)for(var o in n.tagOverrides)s.tagOverrides[o]=n.tagOverrides[o];var u=r.getLegacyRootId();u&&(s.properties.ai_legacyRootId=u),s.contextObjects=s.contextObjects||{},s.contextObjects["http.ServerRequest"]=n.request,s.contextObjects["http.ServerResponse"]=n.response,t.trackRequest(s)},e.prototype.dispose=function(){e.INSTANCE=null,this.enable(!1),this._isInitialized=!1,Ut.CorrelationContextManager.disable(),this._isAutoCorrelating=!1},e.alreadyAutoCollectedFlag="_appInsightsAutoCollected",e}();Vy.exports=qw});var Ky=l((Zp,zy)=>{"use strict";var et=Zp&&Zp.__assign||function(){return et=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},et.apply(this,arguments)},Wp=__webpack_require__(/*! os */ "os"),Jr=De(),$y=kt(),jw=Be(),kw=ve(),Hw=jw.w3cTraceId(),Uw=function(){function e(){}return e.createQuickPulseEnvelope=function(t,r,n,i){var a=Wp&&typeof Wp.hostname=="function"&&Wp.hostname()||"Unknown",s=i.tags&&i.keys&&i.keys.cloudRoleInstance&&i.tags[i.keys.cloudRoleInstance]||a,o=i.tags&&i.keys&&i.keys.cloudRole&&i.tags[i.keys.cloudRole]||null,u={Documents:r.length>0?r:null,InstrumentationKey:n.instrumentationKey||"",Metrics:t.length>0?t:null,InvariantVersion:1,Timestamp:"/Date("+Date.now()+")/",Version:i.tags[i.keys.internalSdkVersion],StreamId:Hw,MachineName:a,Instance:s,RoleName:o};return u},e.createQuickPulseMetric=function(t){var r;return r={Name:t.name,Value:t.value,Weight:t.count||1},r},e.telemetryEnvelopeToQuickPulseDocument=function(t){switch(t.data.baseType){case Jr.TelemetryTypeString.Event:return e.createQuickPulseEventDocument(t);case Jr.TelemetryTypeString.Exception:return e.createQuickPulseExceptionDocument(t);case Jr.TelemetryTypeString.Trace:return e.createQuickPulseTraceDocument(t);case Jr.TelemetryTypeString.Dependency:return e.createQuickPulseDependencyDocument(t);case Jr.TelemetryTypeString.Request:return e.createQuickPulseRequestDocument(t)}return null},e.createQuickPulseEventDocument=function(t){var r=e.createQuickPulseDocument(t),n=t.data.baseData.name,i=et(et({},r),{Name:n});return i},e.createQuickPulseTraceDocument=function(t){var r=e.createQuickPulseDocument(t),n=t.data.baseData.severityLevel||0,i=et(et({},r),{Message:t.data.baseData.message,SeverityLevel:Jr.SeverityLevel[n]});return i},e.createQuickPulseExceptionDocument=function(t){var r=e.createQuickPulseDocument(t),n=t.data.baseData.exceptions,i="",a="",s="";n&&n.length>0&&(n[0].parsedStack&&n[0].parsedStack.length>0?n[0].parsedStack.forEach(function(u){i+=u.assembly+`
`}):n[0].stack&&n[0].stack.length>0&&(i=n[0].stack),a=n[0].message,s=n[0].typeName);var o=et(et({},r),{Exception:i,ExceptionMessage:a,ExceptionType:s});return o},e.createQuickPulseRequestDocument=function(t){var r=e.createQuickPulseDocument(t),n=t.data.baseData,i=et(et({},r),{Name:n.name,Success:n.success,Duration:n.duration,ResponseCode:n.responseCode,OperationName:n.name});return i},e.createQuickPulseDependencyDocument=function(t){var r=e.createQuickPulseDocument(t),n=t.data.baseData,i=et(et({},r),{Name:n.name,Target:n.target,Success:n.success,Duration:n.duration,ResultCode:n.resultCode,CommandName:n.data,OperationName:r.OperationId,DependencyTypeName:n.type});return i},e.createQuickPulseDocument=function(t){var r,n,i,a;t.data.baseType?(n=$y.TelemetryTypeStringToQuickPulseType[t.data.baseType],r=$y.TelemetryTypeStringToQuickPulseDocumentType[t.data.baseType]):kw.warn("Document type invalid; not sending live metric document",t.data.baseType),i=t.tags[e.keys.operationId],a=e.aggregateProperties(t);var s={DocumentType:r,__type:n,OperationId:i,Version:"1.0",Properties:a};return s},e.aggregateProperties=function(t){var r=[],n=t.data.baseData.measurements||{};for(var i in n)if(n.hasOwnProperty(i)){var a=n[i],s={key:i,value:a};r.push(s)}var o=t.data.baseData.properties||{};for(var i in o)if(o.hasOwnProperty(i)){var a=o[i],s={key:i,value:a};r.push(s)}return r},e.keys=new Jr.ContextTagKeys,e}();zy.exports=Uw});var Yy=l((Y1,Xy)=>{"use strict";var Bw=function(){return(Date.now()+621355968e5)*1e4};Xy.exports={getTransmissionTime:Bw}});var eT=l((Sa,Jy)=>{"use strict";var Qy=Sa&&Sa.__awaiter||function(e,t,r,n){function i(a){return a instanceof r?a:new r(function(s){s(a)})}return new(r||(r=Promise))(function(a,s){function o(p){try{c(n.next(p))}catch(f){s(f)}}function u(p){try{c(n.throw(p))}catch(f){s(f)}}function c(p){p.done?a(p.value):i(p.value).then(o,u)}c((n=n.apply(e,t||[])).next())})},Wy=Sa&&Sa.__generator||function(e,t){var r={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]},n,i,a,s;return s={next:o(0),throw:o(1),return:o(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function o(c){return function(p){return u([c,p])}}function u(c){if(n)throw new TypeError("Generator is already executing.");for(;r;)try{if(n=1,i&&(a=c[0]&2?i.return:c[0]?i.throw||((a=i.return)&&a.call(i),0):i.next)&&!(a=a.call(i,c[1])).done)return a;switch(i=0,a&&(c=[c[0]&2,a.value]),c[0]){case 0:case 1:a=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,i=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(a=r.trys,!(a=a.length>0&&a[a.length-1])&&(c[0]===6||c[0]===2)){r=0;continue}if(c[0]===3&&(!a||c[1]>a[0]&&c[1]<a[3])){r.label=c[1];break}if(c[0]===6&&r.label<a[1]){r.label=a[1],a=c;break}if(a&&r.label<a[2]){r.label=a[2],r.ops.push(c);break}a[2]&&r.ops.pop(),r.trys.pop();continue}c=t.call(e,r)}catch(p){c=[6,p],i=0}finally{n=a=0}if(c[0]&5)throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}},Gw=__webpack_require__(/*! https */ "https"),Fw=di(),Zy=ve(),Vw=Yy(),$w=Be(),tt={method:"POST",time:"x-ms-qps-transmission-time",pollingIntervalHint:"x-ms-qps-service-polling-interval-hint",endpointRedirect:"x-ms-qps-service-endpoint-redirect",instanceName:"x-ms-qps-instance-name",streamId:"x-ms-qps-stream-id",machineName:"x-ms-qps-machine-name",roleName:"x-ms-qps-role-name",streamid:"x-ms-qps-stream-id",invariantVersion:"x-ms-qps-invariant-version",subscribed:"x-ms-qps-subscribed"},zw=function(){function e(t){this._config=t,this._consecutiveErrors=0}return e.prototype.ping=function(t,r,n){var i=[{name:tt.streamId,value:t.StreamId},{name:tt.machineName,value:t.MachineName},{name:tt.roleName,value:t.RoleName},{name:tt.instanceName,value:t.Instance},{name:tt.invariantVersion,value:t.InvariantVersion.toString()}];this._submitData(t,r,n,"ping",i)},e.prototype.post=function(t,r,n){return Qy(this,void 0,void 0,function(){return Wy(this,function(i){switch(i.label){case 0:return[4,this._submitData([t],r,n,"post")];case 1:return i.sent(),[2]}})})},e.prototype._submitData=function(t,r,n,i,a){return Qy(this,void 0,void 0,function(){var s,o,u,c,p,f=this;return Wy(this,function(d){return s=JSON.stringify(t),o=(c={},c[Fw.disableCollectionRequestOption]=!0,c.host=r&&r.length>0?r:this._config.quickPulseHost,c.method=tt.method,c.path="/QuickPulseService.svc/"+i+"?ikey="+this._config.instrumentationKey,c.headers=(p={Expect:"100-continue"},p[tt.time]=Vw.getTransmissionTime(),p["Content-Type"]="application/json",p["Content-Length"]=Buffer.byteLength(s),p),c),a&&a.length>0&&a.forEach(function(h){return o.headers[h.name]=h.value}),this._config.httpsAgent?o.agent=this._config.httpsAgent:o.agent=$w.tlsRestrictedAgent,u=Gw.request(o,function(h){if(h.statusCode==200){var E=h.headers[tt.subscribed]==="true",S=h.headers[tt.endpointRedirect]?h.headers[tt.endpointRedirect].toString():null,j=h.headers[tt.pollingIntervalHint]?parseInt(h.headers[tt.pollingIntervalHint].toString()):null;f._consecutiveErrors=0,n(E,h,S,j)}else f._onError("StatusCode:"+h.statusCode+" StatusMessage:"+h.statusMessage),n()}),u.on("error",function(h){f._onError(h),n()}),u.write(s),u.end(),[2]})})},e.prototype._onError=function(t){this._consecutiveErrors++;var r="Transient error connecting to the Live Metrics endpoint. This packet will not appear in your Live Metrics Stream. Error:";this._consecutiveErrors%e.MAX_QPS_FAILURES_BEFORE_WARN==0?(r="Live Metrics endpoint could not be reached "+this._consecutiveErrors+" consecutive times. Most recent error:",Zy.warn(e.TAG,r,t)):Zy.info(e.TAG,r,t)},e.TAG="QuickPulseSender",e.MAX_QPS_FAILURES_BEFORE_WARN=25,e}();Jy.exports=zw});var aT=l((Aa,iT)=>{"use strict";var tT=Aa&&Aa.__awaiter||function(e,t,r,n){function i(a){return a instanceof r?a:new r(function(s){s(a)})}return new(r||(r=Promise))(function(a,s){function o(p){try{c(n.next(p))}catch(f){s(f)}}function u(p){try{c(n.throw(p))}catch(f){s(f)}}function c(p){p.done?a(p.value):i(p.value).then(o,u)}c((n=n.apply(e,t||[])).next())})},rT=Aa&&Aa.__generator||function(e,t){var r={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]},n,i,a,s;return s={next:o(0),throw:o(1),return:o(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function o(c){return function(p){return u([c,p])}}function u(c){if(n)throw new TypeError("Generator is already executing.");for(;r;)try{if(n=1,i&&(a=c[0]&2?i.return:c[0]?i.throw||((a=i.return)&&a.call(i),0):i.next)&&!(a=a.call(i,c[1])).done)return a;switch(i=0,a&&(c=[c[0]&2,a.value]),c[0]){case 0:case 1:a=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,i=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(a=r.trys,!(a=a.length>0&&a[a.length-1])&&(c[0]===6||c[0]===2)){r=0;continue}if(c[0]===3&&(!a||c[1]>a[0]&&c[1]<a[3])){r.label=c[1];break}if(c[0]===6&&r.label<a[1]){r.label=a[1],a=c;break}if(a&&r.label<a[2]){r.label=a[2],r.ops.push(c);break}a[2]&&r.ops.pop(),r.trys.pop();continue}c=t.call(e,r)}catch(p){c=[6,p],i=0}finally{n=a=0}if(c[0]&5)throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}},nT=ve(),Jp=Ky(),Kw=eT(),Xw=kt(),Yw=ya(),Qw=function(){function e(t,r){this._isCollectingData=!1,this._lastSuccessTime=Date.now(),this._lastSendSucceeded=!0,this._metrics={},this._documents=[],this._collectors=[],this._redirectedHost=null,this._pollingIntervalHint=-1,this.config=t,this.context=r||new Yw,this._sender=new Kw(this.config),this._isEnabled=!1}return e.prototype.addCollector=function(t){this._collectors.push(t)},e.prototype.trackMetric=function(t){this._addMetric(t)},e.prototype.addDocument=function(t){var r=Jp.telemetryEnvelopeToQuickPulseDocument(t);r&&this._documents.push(r)},e.prototype.enable=function(t){t&&!this._isEnabled?(this._isEnabled=!0,this._goQuickPulse()):!t&&this._isEnabled&&(this._isEnabled=!1,clearTimeout(this._handle),this._handle=void 0)},e.prototype.enableCollectors=function(t){this._collectors.forEach(function(r){r.enable(t)})},e.prototype._addMetric=function(t){var r=t.value,n=t.count||1,i=Xw.PerformanceToQuickPulseCounter[t.name];i&&(this._metrics[i]?(this._metrics[i].Value=(this._metrics[i].Value*this._metrics[i].Weight+r*n)/(this._metrics[i].Weight+n),this._metrics[i].Weight+=n):(this._metrics[i]=Jp.createQuickPulseMetric(t),this._metrics[i].Name=i,this._metrics[i].Weight=1))},e.prototype._resetQuickPulseBuffer=function(){delete this._metrics,this._metrics={},this._documents.length=0},e.prototype._goQuickPulse=function(){return tT(this,void 0,void 0,function(){var t,r,n,i,a=this;return rT(this,function(s){switch(s.label){case 0:return t=Object.keys(this._metrics).map(function(o){return a._metrics[o]}),r=Jp.createQuickPulseEnvelope(t,this._documents.slice(),this.config,this.context),this._resetQuickPulseBuffer(),this._isCollectingData?[4,this._post(r)]:[3,2];case 1:return s.sent(),[3,3];case 2:this._ping(r),s.label=3;case 3:return n=this._pollingIntervalHint>0?this._pollingIntervalHint:e.PING_INTERVAL,i=this._isCollectingData?e.POST_INTERVAL:n,this._isCollectingData&&Date.now()-this._lastSuccessTime>=e.MAX_POST_WAIT_TIME&&!this._lastSendSucceeded?(this._isCollectingData=!1,i=e.FALLBACK_INTERVAL):!this._isCollectingData&&Date.now()-this._lastSuccessTime>=e.MAX_PING_WAIT_TIME&&!this._lastSendSucceeded&&(i=e.FALLBACK_INTERVAL),this._lastSendSucceeded=null,this._handle=setTimeout(this._goQuickPulse.bind(this),i),this._handle.unref(),[2]}})})},e.prototype._ping=function(t){this._sender.ping(t,this._redirectedHost,this._quickPulseDone.bind(this))},e.prototype._post=function(t){return tT(this,void 0,void 0,function(){return rT(this,function(r){switch(r.label){case 0:return[4,this._sender.post(t,this._redirectedHost,this._quickPulseDone.bind(this))];case 1:return r.sent(),[2]}})})},e.prototype._quickPulseDone=function(t,r,n,i){t!=null?(this._isCollectingData!==t&&(nT.info("Live Metrics sending data",t),this.enableCollectors(t)),this._isCollectingData=t,n&&n.length>0&&(this._redirectedHost=n,nT.info("Redirecting endpoint to: ",n)),i&&i>0&&(this._pollingIntervalHint=i),r&&r.statusCode<300&&r.statusCode>=200?(this._lastSuccessTime=Date.now(),this._lastSendSucceeded=!0):this._lastSendSucceeded=!1):this._lastSendSucceeded=!1},e.MAX_POST_WAIT_TIME=2e4,e.MAX_PING_WAIT_TIME=6e4,e.FALLBACK_INTERVAL=6e4,e.PING_INTERVAL=5e3,e.POST_INTERVAL=1e3,e}();iT.exports=Qw});var uT=l((Q1,oT)=>{"use strict";var sT=kt(),Ww=function(){function e(){}return e.parse=function(t){if(!t)return{};var r=t.split(e._FIELDS_SEPARATOR),n=r.reduce(function(a,s){var o=s.split(e._FIELD_KEY_VALUE_SEPARATOR);if(o.length===2){var u=o[0].toLowerCase(),c=o[1];a[u]=c}return a},{});if(Object.keys(n).length>0){if(n.endpointsuffix){var i=n.location?n.location+".":"";n.ingestionendpoint=n.ingestionendpoint||"https://"+i+"dc."+n.endpointsuffix,n.liveendpoint=n.liveendpoint||"https://"+i+"live."+n.endpointsuffix}n.ingestionendpoint=n.ingestionendpoint||sT.DEFAULT_BREEZE_ENDPOINT,n.liveendpoint=n.liveendpoint||sT.DEFAULT_LIVEMETRICS_ENDPOINT}return n},e._FIELDS_SEPARATOR=";",e._FIELD_KEY_VALUE_SEPARATOR="=",e}();oT.exports=Ww});var tf=l((Z1,pT)=>{"use strict";var ef=Gr(),cT=uT(),W1=ve(),lT=kt(),Zw=__webpack_require__(/*! url */ "url"),Jw=function(){function e(t){var r=this;this.endpointBase=lT.DEFAULT_BREEZE_ENDPOINT;var n=process.env[e.ENV_connectionString],i=cT.parse(t),a=cT.parse(n),s=!i.instrumentationkey&&Object.keys(i).length>0?null:t;this.instrumentationKey=i.instrumentationkey||s||a.instrumentationkey||e._getInstrumentationKey(),!e._validateInstrumentationKey(this.instrumentationKey),this.endpointUrl=(i.ingestionendpoint||a.ingestionendpoint||this.endpointBase)+"/v2.1/track",this.maxBatchSize=250,this.maxBatchIntervalMs=15e3,this.disableAppInsights=!1,this.samplingPercentage=100,this.correlationIdRetryIntervalMs=30*1e3,this.correlationHeaderExcludedDomains=["*.core.windows.net","*.core.chinacloudapi.cn","*.core.cloudapi.de","*.core.usgovcloudapi.net","*.core.microsoft.scloud","*.core.eaglex.ic.gov"],this.setCorrelationId=function(o){return r.correlationId=o},this.proxyHttpUrl=process.env[e.ENV_http_proxy]||void 0,this.proxyHttpsUrl=process.env[e.ENV_https_proxy]||void 0,this.httpAgent=void 0,this.httpsAgent=void 0,this.profileQueryEndpoint=i.ingestionendpoint||a.ingestionendpoint||process.env[e.ENV_profileQueryEndpoint]||this.endpointBase,this._quickPulseHost=i.liveendpoint||a.liveendpoint||process.env[e.ENV_quickPulseHost]||lT.DEFAULT_LIVEMETRICS_HOST,this._quickPulseHost.match(/^https?:\/\//)&&(this._quickPulseHost=Zw.parse(this._quickPulseHost).host)}return Object.defineProperty(e.prototype,"profileQueryEndpoint",{get:function(){return this._profileQueryEndpoint},set:function(t){ef.cancelCorrelationIdQuery(this,this.setCorrelationId),this._profileQueryEndpoint=t,this.correlationId=ef.correlationIdPrefix,ef.queryCorrelationId(this,this.setCorrelationId)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"quickPulseHost",{get:function(){return this._quickPulseHost},set:function(t){this._quickPulseHost=t},enumerable:!1,configurable:!0}),e._getInstrumentationKey=function(){var t=process.env[e.ENV_iKey]||process.env[e.ENV_azurePrefix+e.ENV_iKey]||process.env[e.legacy_ENV_iKey]||process.env[e.ENV_azurePrefix+e.legacy_ENV_iKey];if(!t||t=="")throw new Error("Instrumentation key not found, pass the key in the config to this method or set the key in the environment variable APPINSIGHTS_INSTRUMENTATIONKEY before starting the server");return t},e._validateInstrumentationKey=function(t){var r="^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",n=new RegExp(r);return n.test(t)},e.ENV_azurePrefix="APPSETTING_",e.ENV_iKey="APPINSIGHTS_INSTRUMENTATIONKEY",e.legacy_ENV_iKey="APPINSIGHTS_INSTRUMENTATION_KEY",e.ENV_profileQueryEndpoint="APPINSIGHTS_PROFILE_QUERY_ENDPOINT",e.ENV_quickPulseHost="APPINSIGHTS_QUICKPULSE_HOST",e.ENV_connectionString="APPLICATIONINSIGHTS_CONNECTION_STRING",e.ENV_nativeMetricsDisablers="APPLICATION_INSIGHTS_DISABLE_EXTENDED_METRIC",e.ENV_nativeMetricsDisableAll="APPLICATION_INSIGHTS_DISABLE_ALL_EXTENDED_METRICS",e.ENV_http_proxy="http_proxy",e.ENV_https_proxy="https_proxy",e}();pT.exports=Jw});var dT=l(hi=>{"use strict";var su=hi&&hi.__assign||function(){return su=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},su.apply(this,arguments)};Object.defineProperty(hi,"__esModule",{value:!0});hi.AutoCollectNativePerformance=void 0;var fT=tf(),Ia=ya(),ex=ve(),tx=function(){function e(t){this._disabledMetrics={},e.INSTANCE&&e.INSTANCE.dispose(),e.INSTANCE=this,this._client=t}return e.isNodeVersionCompatible=function(){var t=process.versions.node.split(".");return parseInt(t[0])>=6},e.prototype.enable=function(t,r,n){var i=this;if(r===void 0&&(r={}),n===void 0&&(n=6e4),!!e.isNodeVersionCompatible()){if(e._metricsAvailable==null&&t&&!this._isInitialized)try{var a=__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'applicationinsights-native-metrics'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));e._emitter=new a,e._metricsAvailable=!0,ex.info("Native metrics module successfully loaded!")}catch(s){e._metricsAvailable=!1;return}this._isEnabled=t,this._disabledMetrics=r,this._isEnabled&&!this._isInitialized&&(this._isInitialized=!0),this._isEnabled&&e._emitter?(e._emitter.enable(!0,n),this._handle||(this._handle=setInterval(function(){return i._trackNativeMetrics()},n),this._handle.unref())):e._emitter&&(e._emitter.enable(!1),this._handle&&(clearInterval(this._handle),this._handle=void 0))}},e.prototype.dispose=function(){this.enable(!1)},e.parseEnabled=function(t){var r=process.env[fT.ENV_nativeMetricsDisableAll],n=process.env[fT.ENV_nativeMetricsDisablers];if(r)return{isEnabled:!1,disabledMetrics:{}};if(n){var i=n.split(","),a={};if(i.length>0)for(var s=0,o=i;s<o.length;s++){var u=o[s];a[u]=!0}return typeof t=="object"?{isEnabled:!0,disabledMetrics:su(su({},t),a)}:{isEnabled:t,disabledMetrics:a}}return typeof t=="boolean"?{isEnabled:t,disabledMetrics:{}}:{isEnabled:!0,disabledMetrics:t}},e.prototype._trackNativeMetrics=function(){var t=!0;typeof this._isEnabled!="object"&&(t=this._isEnabled),t&&(this._trackGarbageCollection(),this._trackEventLoop(),this._trackHeapUsage())},e.prototype._trackGarbageCollection=function(){var t;if(!this._disabledMetrics.gc){var r=e._emitter.getGCData();for(var n in r){var i=r[n].metrics,a=n+" Garbage Collection Duration",s=Math.sqrt(i.sumSquares/i.count-Math.pow(i.total/i.count,2))||0;this._client.trackMetric({name:a,value:i.total,count:i.count,max:i.max,min:i.min,stdDev:s,tagOverrides:(t={},t[this._client.context.keys.internalSdkVersion]="node-nativeperf:"+Ia.sdkVersion,t)})}}},e.prototype._trackEventLoop=function(){var t;if(!this._disabledMetrics.loop){var r=e._emitter.getLoopData(),n=r.loopUsage;if(n.count!=0){var i="Event Loop CPU Time",a=Math.sqrt(n.sumSquares/n.count-Math.pow(n.total/n.count,2))||0;this._client.trackMetric({name:i,value:n.total,count:n.count,min:n.min,max:n.max,stdDev:a,tagOverrides:(t={},t[this._client.context.keys.internalSdkVersion]="node-nativeperf:"+Ia.sdkVersion,t)})}}},e.prototype._trackHeapUsage=function(){var t,r,n;if(!this._disabledMetrics.heap){var i=process.memoryUsage(),a=i.heapUsed,s=i.heapTotal,o=i.rss;this._client.trackMetric({name:"Memory Usage (Heap)",value:a,count:1,tagOverrides:(t={},t[this._client.context.keys.internalSdkVersion]="node-nativeperf:"+Ia.sdkVersion,t)}),this._client.trackMetric({name:"Memory Total (Heap)",value:s,count:1,tagOverrides:(r={},r[this._client.context.keys.internalSdkVersion]="node-nativeperf:"+Ia.sdkVersion,r)}),this._client.trackMetric({name:"Memory Usage (Non-Heap)",value:o-s,count:1,tagOverrides:(n={},n[this._client.context.keys.internalSdkVersion]="node-nativeperf:"+Ia.sdkVersion,n)})}},e}();hi.AutoCollectNativePerformance=tx});var _T=l((ej,hT)=>{"use strict";var rx=ve(),nx=function(){function e(t,r,n,i){this._buffer=[],this._lastSend=0,this._isDisabled=t,this._getBatchSize=r,this._getBatchIntervalMs=n,this._sender=i}return e.prototype.setUseDiskRetryCaching=function(t,r,n){this._sender.setDiskRetryMode(t,r,n)},e.prototype.send=function(t){var r=this;if(!this._isDisabled()){if(!t){rx.warn("Cannot send null/undefined telemetry");return}if(this._buffer.push(t),this._buffer.length>=this._getBatchSize()){this.triggerSend(!1);return}!this._timeoutHandle&&this._buffer.length>0&&(this._timeoutHandle=setTimeout(function(){r._timeoutHandle=null,r.triggerSend(!1)},this._getBatchIntervalMs()))}},e.prototype.triggerSend=function(t,r){var n=this._buffer.length<1;n||(t?(this._sender.saveOnCrash(this._buffer),typeof r=="function"&&r("data saved on crash")):this._sender.send(this._buffer,r)),this._lastSend=+new Date,this._buffer=[],clearTimeout(this._timeoutHandle),this._timeoutHandle=null,n&&typeof r=="function"&&r("no data to send")},e}();hT.exports=nx});var vT=l(ou=>{"use strict";Object.defineProperty(ou,"__esModule",{value:!0});ou.azureRoleEnvironmentTelemetryProcessor=void 0;function ix(e,t){process.env.WEBSITE_SITE_NAME&&(e.tags[t.keys.cloudRole]=process.env.WEBSITE_SITE_NAME)}ou.azureRoleEnvironmentTelemetryProcessor=ix});var mT=l(_i=>{"use strict";Object.defineProperty(_i,"__esModule",{value:!0});_i.getSamplingHashCode=_i.samplingTelemetryProcessor=void 0;var gT=De();function ax(e,t){var r=e.sampleRate,n=!1;return r==null||r>=100||e.data&&gT.TelemetryType.Metric===gT.baseTypeToTelemetryType(e.data.baseType)?!0:(t.correlationContext&&t.correlationContext.operation?n=ET(t.correlationContext.operation.id)<r:n=Math.random()*100<r,n)}_i.samplingTelemetryProcessor=ax;function ET(e){var t=-2147483648,r=2147483647,n=5381;if(!e)return 0;for(;e.length<8;)e=e+e;for(var i=0;i<e.length;i++)n=((n<<5)+n|0)+e.charCodeAt(i)|0;return n=n<=t?r:Math.abs(n),n/r*100}_i.getSamplingHashCode=ET});var yT=l(uu=>{"use strict";Object.defineProperty(uu,"__esModule",{value:!0});uu.performanceMetricsTelemetryProcessor=void 0;var rf=eu(),nf=De();function sx(e,t){switch(t&&t.addDocument(e),e.data.baseType){case nf.TelemetryTypeString.Exception:rf.countException();break;case nf.TelemetryTypeString.Request:var r=e.data.baseData;rf.countRequest(r.duration,r.success);break;case nf.TelemetryTypeString.Dependency:var n=e.data.baseData;rf.countDependency(n.duration,n.success);break}return!0}uu.performanceMetricsTelemetryProcessor=sx});var TT=l(vi=>{"use strict";var yt=vi&&vi.__assign||function(){return yt=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},yt.apply(this,arguments)};Object.defineProperty(vi,"__esModule",{value:!0});vi.preAggregatedMetricsTelemetryProcessor=void 0;var ox=De(),ba=Bp(),cu=De();function ux(e,t){if(ba.isEnabled())switch(e.data.baseType){case cu.TelemetryTypeString.Exception:var r=e.data.baseData;r.properties=yt(yt({},r.properties),{"_MS.ProcessedByMetricExtractors":"(Name:'Exceptions', Ver:'1.1')"});var n={cloudRoleInstance:e.tags[t.keys.cloudRoleInstance],cloudRoleName:e.tags[t.keys.cloudRole]};ba.countException(n);break;case cu.TelemetryTypeString.Trace:var i=e.data.baseData;i.properties=yt(yt({},i.properties),{"_MS.ProcessedByMetricExtractors":"(Name:'Traces', Ver:'1.1')"});var a={cloudRoleInstance:e.tags[t.keys.cloudRoleInstance],cloudRoleName:e.tags[t.keys.cloudRole],traceSeverityLevel:ox.SeverityLevel[i.severity]};ba.countTrace(a);break;case cu.TelemetryTypeString.Request:var s=e.data.baseData;s.properties=yt(yt({},s.properties),{"_MS.ProcessedByMetricExtractors":"(Name:'Requests', Ver:'1.1')"});var o={cloudRoleInstance:e.tags[t.keys.cloudRoleInstance],cloudRoleName:e.tags[t.keys.cloudRole],operationSynthetic:e.tags[t.keys.operationSyntheticSource],requestSuccess:s.success,requestResultCode:s.responseCode};ba.countRequest(s.duration,o);break;case cu.TelemetryTypeString.Dependency:var u=e.data.baseData;u.properties=yt(yt({},u.properties),{"_MS.ProcessedByMetricExtractors":"(Name:'Dependencies', Ver:'1.1')"});var c={cloudRoleInstance:e.tags[t.keys.cloudRoleInstance],cloudRoleName:e.tags[t.keys.cloudRole],operationSynthetic:e.tags[t.keys.operationSyntheticSource],dependencySuccess:u.success,dependencyType:u.type,dependencyTarget:u.target,dependencyResultCode:u.resultCode};ba.countDependency(u.duration,c);break}return!0}vi.preAggregatedMetricsTelemetryProcessor=ux});var ST=l(Tt=>{"use strict";var cx=Tt&&Tt.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),lu=Tt&&Tt.__exportStar||function(e,t){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(t,r)&&cx(t,e,r)};Object.defineProperty(Tt,"__esModule",{value:!0});lu(vT(),Tt);lu(mT(),Tt);lu(yT(),Tt);lu(TT(),Tt)});var bT=l((Ca,IT)=>{"use strict";var lx=Ca&&Ca.__awaiter||function(e,t,r,n){function i(a){return a instanceof r?a:new r(function(s){s(a)})}return new(r||(r=Promise))(function(a,s){function o(p){try{c(n.next(p))}catch(f){s(f)}}function u(p){try{c(n.throw(p))}catch(f){s(f)}}function c(p){p.done?a(p.value):i(p.value).then(o,u)}c((n=n.apply(e,t||[])).next())})},px=Ca&&Ca.__generator||function(e,t){var r={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]},n,i,a,s;return s={next:o(0),throw:o(1),return:o(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function o(c){return function(p){return u([c,p])}}function u(c){if(n)throw new TypeError("Generator is already executing.");for(;r;)try{if(n=1,i&&(a=c[0]&2?i.return:c[0]?i.throw||((a=i.return)&&a.call(i),0):i.next)&&!(a=a.call(i,c[1])).done)return a;switch(i=0,a&&(c=[c[0]&2,a.value]),c[0]){case 0:case 1:a=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,i=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(a=r.trys,!(a=a.length>0&&a[a.length-1])&&(c[0]===6||c[0]===2)){r=0;continue}if(c[0]===3&&(!a||c[1]>a[0]&&c[1]<a[3])){r.label=c[1];break}if(c[0]===6&&r.label<a[1]){r.label=a[1],a=c;break}if(a&&r.label<a[2]){r.label=a[2],r.ops.push(c);break}a[2]&&r.ops.pop(),r.trys.pop();continue}c=t.call(e,r)}catch(p){c=[6,p],i=0}finally{n=a=0}if(c[0]&5)throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}},Ee=__webpack_require__(/*! fs */ "fs"),AT=__webpack_require__(/*! os */ "os"),Bt=__webpack_require__(/*! path */ "path"),fx=__webpack_require__(/*! zlib */ "zlib"),gi=__webpack_require__(/*! child_process */ "child_process"),me=ve(),dx=di(),pu=Be(),hx=function(){function e(t,r,n){if(this._redirectedHost=null,this._config=t,this._onSuccess=r,this._onError=n,this._enableDiskRetryMode=!1,this._resendInterval=e.WAIT_BETWEEN_RESEND,this._maxBytesOnDisk=e.MAX_BYTES_ON_DISK,this._numConsecutiveFailures=0,this._numConsecutiveRedirects=0,this._resendTimer=null,this._fileCleanupTimer=null,this._tempDir=Bt.join(AT.tmpdir(),e.TEMPDIR_PREFIX+this._config.instrumentationKey),!e.OS_PROVIDES_FILE_PROTECTION)if(e.USE_ICACLS){try{e.OS_PROVIDES_FILE_PROTECTION=Ee.existsSync(e.ICACLS_PATH)}catch(i){}e.OS_PROVIDES_FILE_PROTECTION||me.warn(e.TAG,"Could not find ICACLS in expected location! This is necessary to use disk retry mode on Windows.")}else e.OS_PROVIDES_FILE_PROTECTION=!0}return e.prototype.setDiskRetryMode=function(t,r,n){var i=this;this._enableDiskRetryMode=e.OS_PROVIDES_FILE_PROTECTION&&t,typeof r=="number"&&r>=0&&(this._resendInterval=Math.floor(r)),typeof n=="number"&&n>=0&&(this._maxBytesOnDisk=Math.floor(n)),t&&!e.OS_PROVIDES_FILE_PROTECTION&&(this._enableDiskRetryMode=!1,me.warn(e.TAG,"Ignoring request to enable disk retry mode. Sufficient file protection capabilities were not detected.")),this._enableDiskRetryMode?this._fileCleanupTimer||(this._fileCleanupTimer=setTimeout(function(){i._fileCleanupTask()},e.CLEANUP_TIMEOUT),this._fileCleanupTimer.unref()):this._fileCleanupTimer&&clearTimeout(this._fileCleanupTimer)},e.prototype.send=function(t,r){return lx(this,void 0,void 0,function(){var n,i,a,s,o=this;return px(this,function(u){return t&&(n=this._redirectedHost||this._config.endpointUrl,i={method:"POST",withCredentials:!1,headers:{"Content-Type":"application/x-json-stream"}},a="",t.forEach(function(c){var p=o._stringify(c);typeof p=="string"&&(a+=p+`
`)}),a.length>0&&(a=a.substring(0,a.length-1)),s=Buffer.from?Buffer.from(a):new Buffer(a),fx.gzip(s,function(c,p){var f=p;c?(me.warn(c),f=s,i.headers["Content-Length"]=s.length.toString()):(i.headers["Content-Encoding"]="gzip",i.headers["Content-Length"]=p.length.toString()),me.info(e.TAG,i),i[dx.disableCollectionRequestOption]=!0;var d=function(E){E.setEncoding("utf-8");var S="";E.on("data",function(j){S+=j}),E.on("end",function(){if(o._numConsecutiveFailures=0,o._enableDiskRetryMode){if(E.statusCode===200)o._resendTimer||(o._resendTimer=setTimeout(function(){o._resendTimer=null,o._sendFirstFileOnDisk()},o._resendInterval),o._resendTimer.unref());else if(o._isRetriable(E.statusCode))try{var j=JSON.parse(S),oe=[];j.errors.forEach(function(At){o._isRetriable(At.statusCode)&&oe.push(t[At.index])}),oe.length>0&&o._storeToDisk(oe)}catch(At){o._storeToDisk(t)}}if(E.statusCode===307||E.statusCode===308)if(o._numConsecutiveRedirects++,o._numConsecutiveRedirects<10){var Ae=E.headers.location?E.headers.location.toString():null;Ae&&(o._redirectedHost=Ae,o.send(t,r))}else typeof r=="function"&&r("Error sending telemetry because of circular redirects.");else o._numConsecutiveRedirects=0,typeof r=="function"&&r(S),me.info(e.TAG,S),typeof o._onSuccess=="function"&&o._onSuccess(S)})},h=pu.makeRequest(o._config,n,i,d);h.on("error",function(E){if(o._numConsecutiveFailures++,!o._enableDiskRetryMode||o._numConsecutiveFailures>0&&o._numConsecutiveFailures%e.MAX_CONNECTION_FAILURES_BEFORE_WARN==0){var S="Ingestion endpoint could not be reached. This batch of telemetry items has been lost. Use Disk Retry Caching to enable resending of failed telemetry. Error:";o._enableDiskRetryMode&&(S="Ingestion endpoint could not be reached "+o._numConsecutiveFailures+" consecutive times. There may be resulting telemetry loss. Most recent error:"),me.warn(e.TAG,S,pu.dumpObj(E))}else{var S="Transient failure to reach ingestion endpoint. This batch of telemetry items will be retried. Error:";me.info(e.TAG,S,pu.dumpObj(E))}o._onErrorHelper(E),typeof r=="function"&&(E&&r(pu.dumpObj(E)),r("Error sending telemetry")),o._enableDiskRetryMode&&o._storeToDisk(t)}),h.write(f),h.end()})),[2]})})},e.prototype.saveOnCrash=function(t){this._enableDiskRetryMode&&this._storeToDiskSync(this._stringify(t))},e.prototype._isRetriable=function(t){return t===206||t===408||t===429||t===439||t===500||t===503},e.prototype._runICACLS=function(t,r){var n=gi.spawn(e.ICACLS_PATH,t,{windowsHide:!0});n.on("error",function(i){return r(i)}),n.on("close",function(i,a){return r(i===0?null:new Error("Setting ACL restrictions did not succeed (ICACLS returned code "+i+")"))})},e.prototype._runICACLSSync=function(t){if(gi.spawnSync){var r=gi.spawnSync(e.ICACLS_PATH,t,{windowsHide:!0});if(r.error)throw r.error;if(r.status!==0)throw new Error("Setting ACL restrictions did not succeed (ICACLS returned code "+r.status+")")}else throw new Error("Could not synchronously call ICACLS under current version of Node.js")},e.prototype._getACLIdentity=function(t){if(e.ACL_IDENTITY)return t(null,e.ACL_IDENTITY);var r=gi.spawn(e.POWERSHELL_PATH,["-Command","[System.Security.Principal.WindowsIdentity]::GetCurrent().Name"],{windowsHide:!0,stdio:["ignore","pipe","pipe"]}),n="";r.stdout.on("data",function(i){return n+=i}),r.on("error",function(i){return t(i,null)}),r.on("close",function(i,a){return e.ACL_IDENTITY=n&&n.trim(),t(i===0?null:new Error("Getting ACL identity did not succeed (PS returned code "+i+")"),e.ACL_IDENTITY)})},e.prototype._getACLIdentitySync=function(){if(e.ACL_IDENTITY)return e.ACL_IDENTITY;if(gi.spawnSync){var t=gi.spawnSync(e.POWERSHELL_PATH,["-Command","[System.Security.Principal.WindowsIdentity]::GetCurrent().Name"],{windowsHide:!0,stdio:["ignore","pipe","pipe"]});if(t.error)throw t.error;if(t.status!==0)throw new Error("Getting ACL identity did not succeed (PS returned code "+t.status+")");return e.ACL_IDENTITY=t.stdout&&t.stdout.toString().trim(),e.ACL_IDENTITY}else throw new Error("Could not synchronously get ACL identity under current version of Node.js")},e.prototype._getACLArguments=function(t,r){return[t,"/grant","*S-1-5-32-544:(OI)(CI)F","/grant",r+":(OI)(CI)F","/inheritance:r"]},e.prototype._applyACLRules=function(t,r){var n=this;if(!e.USE_ICACLS)return r(null);if(e.ACLED_DIRECTORIES[t]===void 0)e.ACLED_DIRECTORIES[t]=!1,this._getACLIdentity(function(i,a){if(i)return e.ACLED_DIRECTORIES[t]=!1,r(i);n._runICACLS(n._getACLArguments(t,a),function(s){return e.ACLED_DIRECTORIES[t]=!s,r(s)})});else return r(e.ACLED_DIRECTORIES[t]?null:new Error("Setting ACL restrictions did not succeed (cached result)"))},e.prototype._applyACLRulesSync=function(t){if(e.USE_ICACLS){if(e.ACLED_DIRECTORIES[t]===void 0){this._runICACLSSync(this._getACLArguments(t,this._getACLIdentitySync())),e.ACLED_DIRECTORIES[t]=!0;return}else if(!e.ACLED_DIRECTORIES[t])throw new Error("Setting ACL restrictions did not succeed (cached result)")}},e.prototype._confirmDirExists=function(t,r){var n=this;Ee.lstat(t,function(i,a){i&&i.code==="ENOENT"?Ee.mkdir(t,function(s){s&&s.code!=="EEXIST"?r(s):n._applyACLRules(t,r)}):!i&&a.isDirectory()?n._applyACLRules(t,r):r(i||new Error("Path existed but was not a directory"))})},e.prototype._getShallowDirectorySize=function(t,r){Ee.readdir(t,function(n,i){if(n)return r(n,-1);var a=null,s=0,o=0;if(i.length===0){r(null,0);return}for(var u=0;u<i.length;u++)Ee.stat(Bt.join(t,i[u]),function(c,p){o++,c?a=c:p.isFile()&&(s+=p.size),o===i.length&&(a?r(a,-1):r(a,s))})})},e.prototype._getShallowDirectorySizeSync=function(t){for(var r=Ee.readdirSync(t),n=0,i=0;i<r.length;i++)n+=Ee.statSync(Bt.join(t,r[i])).size;return n},e.prototype._storeToDisk=function(t){var r=this;me.info(e.TAG,"Checking existence of data storage directory: "+this._tempDir),this._confirmDirExists(this._tempDir,function(n){if(n){me.warn(e.TAG,"Error while checking/creating directory: "+(n&&n.message)),r._onErrorHelper(n);return}r._getShallowDirectorySize(r._tempDir,function(i,a){if(i||a<0){me.warn(e.TAG,"Error while checking directory size: "+(i&&i.message)),r._onErrorHelper(i);return}else if(a>r._maxBytesOnDisk){me.warn(e.TAG,"Not saving data due to max size limit being met. Directory size in bytes is: "+a);return}var s=new Date().getTime()+".ai.json",o=Bt.join(r._tempDir,s);me.info(e.TAG,"saving data to disk at: "+o),Ee.writeFile(o,r._stringify(t),{mode:384},function(u){return r._onErrorHelper(u)})})})},e.prototype._storeToDiskSync=function(t){try{me.info(e.TAG,"Checking existence of data storage directory: "+this._tempDir),Ee.existsSync(this._tempDir)||Ee.mkdirSync(this._tempDir),this._applyACLRulesSync(this._tempDir);var r=this._getShallowDirectorySizeSync(this._tempDir);if(r>this._maxBytesOnDisk){me.info(e.TAG,"Not saving data due to max size limit being met. Directory size in bytes is: "+r);return}var n=new Date().getTime()+".ai.json",i=Bt.join(this._tempDir,n);me.info(e.TAG,"saving data before crash to disk at: "+i),Ee.writeFileSync(i,t,{mode:384})}catch(a){me.warn(e.TAG,"Error while saving data to disk: "+(a&&a.message)),this._onErrorHelper(a)}},e.prototype._sendFirstFileOnDisk=function(){var t=this;Ee.exists(this._tempDir,function(r){r&&Ee.readdir(t._tempDir,function(n,i){if(n)t._onErrorHelper(n);else if(i=i.filter(function(o){return Bt.basename(o).indexOf(".ai.json")>-1}),i.length>0){var a=i[0],s=Bt.join(t._tempDir,a);Ee.readFile(s,function(o,u){o?t._onErrorHelper(o):Ee.unlink(s,function(c){if(c)t._onErrorHelper(c);else try{var p=JSON.parse(u.toString());t.send(p)}catch(f){me.warn("Failed to read persisted file",f)}})})}})})},e.prototype._onErrorHelper=function(t){typeof this._onError=="function"&&this._onError(t)},e.prototype._stringify=function(t){try{return JSON.stringify(t)}catch(r){me.warn("Failed to serialize payload",r,t)}},e.prototype._fileCleanupTask=function(){var t=this;Ee.exists(this._tempDir,function(r){r&&Ee.readdir(t._tempDir,function(n,i){n?t._onErrorHelper(n):(i=i.filter(function(a){return Bt.basename(a).indexOf(".ai.json")>-1}),i.length>0&&i.forEach(function(a){var s=new Date(parseInt(a.split(".ai.json")[0])),o=new Date(+new Date-e.FILE_RETEMPTION_PERIOD)>s;if(o){var u=Bt.join(t._tempDir,a);Ee.unlink(u,function(c){c&&t._onErrorHelper(c)})}}))})})},e.TAG="Sender",e.ICACLS_PATH=process.env.systemdrive+"/windows/system32/icacls.exe",e.POWERSHELL_PATH=process.env.systemdrive+"/windows/system32/windowspowershell/v1.0/powershell.exe",e.ACLED_DIRECTORIES={},e.ACL_IDENTITY=null,e.WAIT_BETWEEN_RESEND=60*1e3,e.MAX_BYTES_ON_DISK=50*1024*1024,e.MAX_CONNECTION_FAILURES_BEFORE_WARN=5,e.CLEANUP_TIMEOUT=60*60*1e3,e.FILE_RETEMPTION_PERIOD=7*24*60*60*1e3,e.TEMPDIR_PREFIX="appInsights-node",e.OS_PROVIDES_FILE_PROTECTION=!1,e.USE_ICACLS=AT.type()==="Windows_NT",e}();IT.exports=hx});var PT=l((sj,OT)=>{"use strict";var A=De(),rt=Be(),_x=gr(),vx=function(){function e(){}return e.createEnvelope=function(t,r,n,i,a){var s=null;switch(r){case A.TelemetryType.Trace:s=e.createTraceData(t);break;case A.TelemetryType.Dependency:s=e.createDependencyData(t);break;case A.TelemetryType.Event:s=e.createEventData(t);break;case A.TelemetryType.Exception:s=e.createExceptionData(t);break;case A.TelemetryType.Request:s=e.createRequestData(t);break;case A.TelemetryType.Metric:s=e.createMetricData(t);break;case A.TelemetryType.Availability:s=e.createAvailabilityData(t);break;case A.TelemetryType.PageView:s=e.createPageViewData(t);break}if(n&&A.domainSupportsProperties(s.baseData)){if(s&&s.baseData)if(!s.baseData.properties)s.baseData.properties=n;else for(var o in n)s.baseData.properties[o]||(s.baseData.properties[o]=n[o]);s.baseData.properties=rt.validateStringMap(s.baseData.properties)}var u=a&&a.instrumentationKey||"",c=new A.Envelope;return c.data=s,c.iKey=u,c.name="Microsoft.ApplicationInsights."+u.replace(/-/g,"")+"."+s.baseType.substr(0,s.baseType.length-4),c.tags=this.getTags(i,t.tagOverrides),c.time=new Date().toISOString(),c.ver=1,c.sampleRate=a?a.samplingPercentage:100,r===A.TelemetryType.Metric&&(c.sampleRate=100),c},e.createTraceData=function(t){var r=new A.MessageData;r.message=t.message,r.properties=t.properties,isNaN(t.severity)?r.severityLevel=A.SeverityLevel.Information:r.severityLevel=t.severity;var n=new A.Data;return n.baseType=A.telemetryTypeToBaseType(A.TelemetryType.Trace),n.baseData=r,n},e.createDependencyData=function(t){var r=new A.RemoteDependencyData;typeof t.name=="string"&&(r.name=t.name.length>1024?t.name.slice(0,1021)+"...":t.name),r.data=t.data,r.target=t.target,r.duration=rt.msToTimeSpan(t.duration),r.success=t.success,r.type=t.dependencyTypeName,r.properties=t.properties,r.resultCode=t.resultCode?t.resultCode+"":"",t.id?r.id=t.id:r.id=rt.w3cTraceId();var n=new A.Data;return n.baseType=A.telemetryTypeToBaseType(A.TelemetryType.Dependency),n.baseData=r,n},e.createEventData=function(t){var r=new A.EventData;r.name=t.name,r.properties=t.properties,r.measurements=t.measurements;var n=new A.Data;return n.baseType=A.telemetryTypeToBaseType(A.TelemetryType.Event),n.baseData=r,n},e.createExceptionData=function(t){var r=new A.ExceptionData;r.properties=t.properties,isNaN(t.severity)?r.severityLevel=A.SeverityLevel.Error:r.severityLevel=t.severity,r.measurements=t.measurements,r.exceptions=[];var n=t.exception.stack,i=new A.ExceptionDetails;i.message=t.exception.message,i.typeName=t.exception.name,i.parsedStack=this.parseStack(n),i.hasFullStack=rt.isArray(i.parsedStack)&&i.parsedStack.length>0,r.exceptions.push(i);var a=new A.Data;return a.baseType=A.telemetryTypeToBaseType(A.TelemetryType.Exception),a.baseData=r,a},e.createRequestData=function(t){var r=new A.RequestData;t.id?r.id=t.id:r.id=rt.w3cTraceId(),r.name=t.name,r.url=t.url,r.source=t.source,r.duration=rt.msToTimeSpan(t.duration),r.responseCode=t.resultCode?t.resultCode+"":"",r.success=t.success,r.properties=t.properties;var n=new A.Data;return n.baseType=A.telemetryTypeToBaseType(A.TelemetryType.Request),n.baseData=r,n},e.createMetricData=function(t){var r=new A.MetricData;r.metrics=[];var n=new A.DataPoint;n.count=isNaN(t.count)?1:t.count,n.kind=A.DataPointType.Aggregation,n.max=isNaN(t.max)?t.value:t.max,n.min=isNaN(t.min)?t.value:t.min,n.name=t.name,n.stdDev=isNaN(t.stdDev)?0:t.stdDev,n.value=t.value,r.metrics.push(n),r.properties=t.properties;var i=new A.Data;return i.baseType=A.telemetryTypeToBaseType(A.TelemetryType.Metric),i.baseData=r,i},e.createAvailabilityData=function(t){var r=new A.AvailabilityData;t.id?r.id=t.id:r.id=rt.w3cTraceId(),r.name=t.name,r.duration=rt.msToTimeSpan(t.duration),r.success=t.success,r.runLocation=t.runLocation,r.message=t.message,r.measurements=t.measurements,r.properties=t.properties;var n=new A.Data;return n.baseType=A.telemetryTypeToBaseType(A.TelemetryType.Availability),n.baseData=r,n},e.createPageViewData=function(t){var r=new A.PageViewData;r.name=t.name,r.duration=rt.msToTimeSpan(t.duration),r.url=t.url,r.measurements=t.measurements,r.properties=t.properties;var n=new A.Data;return n.baseType=A.telemetryTypeToBaseType(A.TelemetryType.PageView),n.baseData=r,n},e.getTags=function(t,r){var n=_x.CorrelationContextManager.getCurrentContext(),i={};if(t&&t.tags)for(var a in t.tags)i[a]=t.tags[a];if(r)for(var a in r)i[a]=r[a];return n&&(i[t.keys.operationId]=i[t.keys.operationId]||n.operation.id,i[t.keys.operationName]=i[t.keys.operationName]||n.operation.name,i[t.keys.operationParentId]=i[t.keys.operationParentId]||n.operation.parentId),i},e.parseStack=function(t){var r=void 0;if(typeof t=="string"){var n=t.split(`
`);r=[];for(var i=0,a=0,s=0;s<=n.length;s++){var o=n[s];if(CT.regex.test(o)){var u=new CT(n[s],i++);a+=u.sizeInBytes,r.push(u)}}var c=32*1024;if(a>c)for(var p=0,f=r.length-1,d=0,h=p,E=f;p<f;){var S=r[p].sizeInBytes,j=r[f].sizeInBytes;if(d+=S+j,d>c){var oe=E-h+1;r.splice(h,oe);break}h=p,E=f,p++,f--}}return r},e}(),CT=function(){function e(t,r){this.sizeInBytes=0,this.level=r,this.method="<no_method>",this.assembly=rt.trim(t);var n=t.match(e.regex);n&&n.length>=5&&(this.method=rt.trim(n[2])||this.method,this.fileName=rt.trim(n[4])||"<no_filename>",this.line=parseInt(n[5])||0),this.sizeInBytes+=this.method.length,this.sizeInBytes+=this.fileName.length,this.sizeInBytes+=this.assembly.length,this.sizeInBytes+=e.baseSize,this.sizeInBytes+=this.level.toString().length,this.sizeInBytes+=this.line.toString().length}return e.regex=/^(\s+at)?(.*?)(\@|\s\(|\s)([^\(\n]+):(\d+):(\d+)(\)?)$/,e.baseSize=58,e}();OT.exports=vx});var wT=l((oj,DT)=>{"use strict";var gx=__webpack_require__(/*! url */ "url"),Ex=tf(),mx=ya(),Gt=De(),yx=_T(),fu=ST(),RT=gr(),Tx=bT(),af=Be(),NT=ve(),Sx=PT(),Ax=function(){function e(t){this._telemetryProcessors=[],this._enableAzureProperties=!1;var r=new Ex(t);this.config=r,this.context=new mx,this.commonProperties={};var n=new Tx(this.config);this.channel=new yx(function(){return r.disableAppInsights},function(){return r.maxBatchSize},function(){return r.maxBatchIntervalMs},n)}return e.prototype.trackAvailability=function(t){this.track(t,Gt.TelemetryType.Availability)},e.prototype.trackPageView=function(t){this.track(t,Gt.TelemetryType.PageView)},e.prototype.trackTrace=function(t){this.track(t,Gt.TelemetryType.Trace)},e.prototype.trackMetric=function(t){this.track(t,Gt.TelemetryType.Metric)},e.prototype.trackException=function(t){t&&t.exception&&!af.isError(t.exception)&&(t.exception=new Error(t.exception.toString())),this.track(t,Gt.TelemetryType.Exception)},e.prototype.trackEvent=function(t){this.track(t,Gt.TelemetryType.Event)},e.prototype.trackRequest=function(t){this.track(t,Gt.TelemetryType.Request)},e.prototype.trackDependency=function(t){t&&!t.target&&t.data&&(t.target=gx.parse(t.data).host),this.track(t,Gt.TelemetryType.Dependency)},e.prototype.flush=function(t){this.channel.triggerSend(t?!!t.isAppCrashing:!1,t?t.callback:void 0)},e.prototype.track=function(t,r){if(t&&Gt.telemetryTypeToBaseType(r)){var n=Sx.createEnvelope(t,r,this.commonProperties,this.context,this.config);t.time&&(n.time=t.time.toISOString()),this._enableAzureProperties&&fu.azureRoleEnvironmentTelemetryProcessor(n,this.context);var i=this.runTelemetryProcessors(n,t.contextObjects);i=i&&fu.samplingTelemetryProcessor(n,{correlationContext:RT.CorrelationContextManager.getCurrentContext()}),fu.preAggregatedMetricsTelemetryProcessor(n,this.context),i&&(fu.performanceMetricsTelemetryProcessor(n,this.quickPulseClient),this.channel.send(n))}else NT.warn("track() requires telemetry object and telemetryType to be specified.")},e.prototype.setAutoPopulateAzureProperties=function(t){this._enableAzureProperties=t},e.prototype.addTelemetryProcessor=function(t){this._telemetryProcessors.push(t)},e.prototype.clearTelemetryProcessors=function(){this._telemetryProcessors=[]},e.prototype.runTelemetryProcessors=function(t,r){var n=!0,i=this._telemetryProcessors.length;if(i===0)return n;r=r||{},r.correlationContext=RT.CorrelationContextManager.getCurrentContext();for(var a=0;a<i;++a)try{var s=this._telemetryProcessors[a];if(s&&s.apply(null,[t,r])===!1){n=!1;break}}catch(o){n=!0,NT.warn("One of telemetry processors failed, telemetry item will be sent.",o,t)}return n&&(t&&t.tags&&(t.tags=af.validateStringMap(t.tags)),t&&t.data&&t.data.baseData&&t.data.baseData.properties&&(t.data.baseData.properties=af.validateStringMap(t.data.baseData.properties))),n},e}();DT.exports=Ax});var LT=l((sf,MT)=>{"use strict";var Ix=sf&&sf.__extends||function(){var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(n[a]=i[a])},e(t,r)};return function(t,r){e(t,r);function n(){this.constructor=t}t.prototype=r===null?Object.create(r):(n.prototype=r.prototype,new n)}}(),bx=wT(),xT=Qp(),Cx=di(),du=ve(),Ox=function(e){Ix(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.trackNodeHttpRequestSync=function(r){r&&r.request&&r.response&&r.duration?xT.trackRequestSync(this,r):du.warn("trackNodeHttpRequestSync requires NodeHttpRequestTelemetry object with request, response and duration specified.")},t.prototype.trackNodeHttpRequest=function(r){(r.duration||r.error)&&du.warn("trackNodeHttpRequest will ignore supplied duration and error parameters. These values are collected from the request and response objects."),r&&r.request&&r.response?xT.trackRequest(this,r):du.warn("trackNodeHttpRequest requires NodeHttpRequestTelemetry object with request and response specified.")},t.prototype.trackNodeHttpDependency=function(r){r&&r.request?Cx.trackRequest(this,r):du.warn("trackNodeHttpDependency requires NodeHttpDependencyTelemetry object with request specified.")},t}(bx);MT.exports=Ox});var jT=l(qT=>{"use strict";Object.defineProperty(qT,"__esModule",{value:!0})});var iS=l(m=>{"use strict";Object.defineProperty(m,"__esModule",{value:!0});m.dispose=m.Configuration=m.wrapWithCorrelationContext=m.startOperation=m.getCorrelationContext=m.start=m.setup=m.liveMetricsClient=m.defaultClient=m.DistributedTracingModes=void 0;var of=gr(),Px=uy(),Rx=ly(),kT=eu(),Nx=Bp(),Dx=Hy(),wx=di(),xx=Qp(),HT=Gr(),Oa=ve(),Mx=aT(),UT=dT();m.TelemetryClient=LT();m.Contracts=De();m.azureFunctionsTypes=jT();var BT;(function(e){e[e.AI=0]="AI",e[e.AI_AND_W3C=1]="AI_AND_W3C"})(BT=m.DistributedTracingModes||(m.DistributedTracingModes={}));var GT=!0,FT=!1,VT=!0,$T=!0,zT=!0,KT=!1,XT=!0,YT=!0,QT=!0,uf=!0,WT,hu=!1,ZT=!0,JT,eS=void 0,tS=void 0,Pa,Ra,Na,Da,wa,Ei,en,xa,St=!1,rS;function Lx(e){return m.defaultClient?Oa.info("The default client is already setup"):(m.defaultClient=new m.TelemetryClient(e),Pa=new Px(m.defaultClient),Ra=new Rx(m.defaultClient),Na=new kT(m.defaultClient),Da=new Nx(m.defaultClient),wa=new Dx(m.defaultClient),en=new xx(m.defaultClient),xa=new wx(m.defaultClient),Ei||(Ei=new UT.AutoCollectNativePerformance(m.defaultClient))),m.defaultClient&&m.defaultClient.channel&&m.defaultClient.channel.setUseDiskRetryCaching(QT,eS,tS),cf}m.setup=Lx;function nS(){return m.defaultClient?(St=!0,Pa.enable(GT,FT),Ra.enable(VT),Na.enable($T),Da.enable(zT),wa.enable(KT,m.defaultClient.config),Ei.enable(ZT,JT),en.useAutoCorrelation(uf,WT),en.enable(XT),xa.enable(YT),m.liveMetricsClient&&hu&&m.liveMetricsClient.enable(hu)):Oa.warn("Start cannot be called before setup"),cf}m.start=nS;function qx(){return uf?of.CorrelationContextManager.getCurrentContext():null}m.getCorrelationContext=qx;function jx(e,t){return of.CorrelationContextManager.startOperation(e,t)}m.startOperation=jx;function kx(e,t){return of.CorrelationContextManager.wrapCallback(e,t)}m.wrapWithCorrelationContext=kx;var cf=function(){function e(){}return e.setDistributedTracingMode=function(t){return HT.w3cEnabled=t===BT.AI_AND_W3C,e},e.setAutoCollectConsole=function(t,r){return r===void 0&&(r=!1),GT=t,FT=r,St&&Pa.enable(t,r),e},e.setAutoCollectExceptions=function(t){return VT=t,St&&Ra.enable(t),e},e.setAutoCollectPerformance=function(t,r){r===void 0&&(r=!0),$T=t;var n=UT.AutoCollectNativePerformance.parseEnabled(r);return ZT=n.isEnabled,JT=n.disabledMetrics,St&&(Na.enable(t),Ei.enable(n.isEnabled,n.disabledMetrics)),e},e.setAutoCollectPreAggregatedMetrics=function(t){return zT=t,St&&Da.enable(t),e},e.setAutoCollectHeartbeat=function(t){return KT=t,St&&wa.enable(t,m.defaultClient.config),e},e.setAutoCollectRequests=function(t){return XT=t,St&&en.enable(t),e},e.setAutoCollectDependencies=function(t){return YT=t,St&&xa.enable(t),e},e.setAutoDependencyCorrelation=function(t,r){return uf=t,WT=r,St&&en.useAutoCorrelation(t,r),e},e.setUseDiskRetryCaching=function(t,r,n){return QT=t,eS=r,tS=n,m.defaultClient&&m.defaultClient.channel&&m.defaultClient.channel.setUseDiskRetryCaching(t,r,n),e},e.setInternalLogging=function(t,r){return t===void 0&&(t=!1),r===void 0&&(r=!0),Oa.enableDebug=t,Oa.disableWarnings=!r,e},e.setSendLiveMetrics=function(t){return t===void 0&&(t=!1),m.defaultClient?(!m.liveMetricsClient&&t?(m.liveMetricsClient=new Mx(m.defaultClient.config,null),rS=new kT(m.liveMetricsClient,1e3,!0),m.liveMetricsClient.addCollector(rS),m.defaultClient.quickPulseClient=m.liveMetricsClient):m.liveMetricsClient&&m.liveMetricsClient.enable(t),hu=t,e):(Oa.warn("Live metrics client cannot be setup without the default client"),e)},e.start=nS,e}();m.Configuration=cf;function Hx(){HT.w3cEnabled=!0,m.defaultClient=null,St=!1,Pa&&Pa.dispose(),Ra&&Ra.dispose(),Na&&Na.dispose(),Da&&Da.dispose(),wa&&wa.dispose(),Ei&&Ei.dispose(),en&&en.dispose(),xa&&xa.dispose(),m.liveMetricsClient&&(m.liveMetricsClient.enable(!1),hu=!1,m.liveMetricsClient=void 0)}m.dispose=Hx});fS(exports,{default:()=>lf});var mi=Ai(__webpack_require__(/*! os */ "os")),yi=Ai(__webpack_require__(/*! vscode */ "vscode"));var W=Ai(__webpack_require__(/*! vscode */ "vscode"));var Ii=Ai(__webpack_require__(/*! vscode */ "vscode")),He;(function(r){r.ON="on",r.OFF="off"})(He||(He={}));function nn(){let e="telemetry",t="enableTelemetry";return Ii.env.isTelemetryEnabled!==void 0?Ii.env.isTelemetryEnabled?He.ON:He.OFF:Ii.workspace.getConfiguration(e).get(t)?He.ON:He.OFF}var vu=class{constructor(t,r,n,i,a){this.extensionId=t;this.extensionVersion=r;this.telemetryAppender=n;this.osShim=i;this.firstParty=!1;this.userOptIn=!1;this.errorOptIn=!1;this.disposables=[];this.firstParty=!!a,this.updateUserOptStatus(),W.env.onDidChangeTelemetryEnabled!==void 0?(this.disposables.push(W.env.onDidChangeTelemetryEnabled(()=>this.updateUserOptStatus())),this.disposables.push(W.workspace.onDidChangeConfiguration(()=>this.updateUserOptStatus()))):this.disposables.push(W.workspace.onDidChangeConfiguration(()=>this.updateUserOptStatus()))}updateUserOptStatus(){let t=nn();this.userOptIn=t===He.ON,this.errorOptIn=t===He.ON,(this.userOptIn||this.errorOptIn)&&this.telemetryAppender.instantiateAppender()}cleanRemoteName(t){if(!t)return"none";let r="other";return["ssh-remote","dev-container","attached-container","wsl","codespaces"].forEach(n=>{t.indexOf(`${n}+`)===0&&(r=n)}),r}get extension(){return this._extension===void 0&&(this._extension=W.extensions.getExtension(this.extensionId)),this._extension}cloneAndChange(t,r){if(t===null||typeof t!="object"||typeof r!="function")return t;let n={};for(let i in t)n[i]=r(i,t[i]);return n}shouldSendErrorTelemetry(){return this.errorOptIn===!1?!1:this.firstParty?this.cleanRemoteName(W.env.remoteName)!=="other"?!0:!(this.extension===void 0||this.extension.extensionKind===W.ExtensionKind.Workspace||W.env.uiKind===W.UIKind.Web):!0}getCommonProperties(){let t=Object.create(null);if(t["common.os"]=this.osShim.platform,t["common.nodeArch"]=this.osShim.architecture,t["common.platformversion"]=(this.osShim.release||"").replace(/^(\d+)(\.\d+)?(\.\d+)?(.*)/,"$1$2$3"),t["common.extname"]=this.extensionId,t["common.extversion"]=this.extensionVersion,W&&W.env){switch(t["common.vscodemachineid"]=W.env.machineId,t["common.vscodesessionid"]=W.env.sessionId,t["common.vscodeversion"]=W.version,t["common.isnewappinstall"]=W.env.isNewAppInstall?W.env.isNewAppInstall.toString():"false",t["common.product"]=W.env.appHost,W.env.uiKind){case W.UIKind.Web:t["common.uikind"]="web";break;case W.UIKind.Desktop:t["common.uikind"]="desktop";break;default:t["common.uikind"]="unknown"}t["common.remotename"]=this.cleanRemoteName(W.env.remoteName)}return t}anonymizeFilePaths(t,r){let n;if(t==null)return"";let i=[];W.env.appRoot!==""&&i.push(new RegExp(W.env.appRoot.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi")),this.extension&&i.push(new RegExp(this.extension.extensionPath.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"));let a=t;if(r){let s=[];for(let p of i)for(;(n=p.exec(t))&&n;)s.push([n.index,p.lastIndex]);let o=/^[\\/]?(node_modules|node_modules\.asar)[\\/]/,u=/(file:\/\/)?([a-zA-Z]:(\\\\|\\|\/)|(\\\\|\\|\/))?([\w-._]+(\\\\|\\|\/))+[\w-._]*/g,c=0;for(a="";(n=u.exec(t))&&n;)n[0]&&!o.test(n[0])&&s.every(([p,f])=>n.index<p||n.index>=f)&&(a+=t.substring(c,n.index)+"<REDACTED: user-file-path>",c=u.lastIndex);c<t.length&&(a+=t.substr(c))}for(let s of i)a=a.replace(s,"");return a}removePropertiesWithPossibleUserInfo(t){if(typeof t!="object")return;let r=Object.create(null);for(let n of Object.keys(t)){let i=t[n];if(!i)continue;let a=/@[a-zA-Z0-9-.]+/;/(key|token|sig|signature|password|passwd|pwd)[="':\s]/.test(i.toLowerCase())?r[n]="<REDACTED: secret>":a.test(i)?r[n]="<REDACTED: email>":r[n]=i}return r}sendTelemetryEvent(t,r,n){if(this.userOptIn&&t!==""){r=It(It({},r),this.getCommonProperties());let i=this.cloneAndChange(r,(a,s)=>this.anonymizeFilePaths(s,this.firstParty));this.telemetryAppender.logEvent(`${this.extensionId}/${t}`,{properties:this.removePropertiesWithPossibleUserInfo(i),measurements:n})}}sendRawTelemetryEvent(t,r,n){this.userOptIn&&t!==""&&(r=It(It({},r),this.getCommonProperties()),this.telemetryAppender.logEvent(`${this.extensionId}/${t}`,{properties:r,measurements:n}))}sendTelemetryErrorEvent(t,r,n,i){if(this.errorOptIn&&t!==""){r=It(It({},r),this.getCommonProperties());let a=this.cloneAndChange(r,(s,o)=>this.shouldSendErrorTelemetry()?this.anonymizeFilePaths(o,this.firstParty):i===void 0||i.indexOf(s)!==-1?"REDACTED":this.anonymizeFilePaths(o,this.firstParty));this.telemetryAppender.logEvent(`${this.extensionId}/${t}`,{properties:this.removePropertiesWithPossibleUserInfo(a),measurements:n})}}sendTelemetryException(t,r,n){if(this.shouldSendErrorTelemetry()&&this.errorOptIn&&t){r=It(It({},r),this.getCommonProperties());let i=this.cloneAndChange(r,(a,s)=>this.anonymizeFilePaths(s,this.firstParty));t.stack&&(t.stack=this.anonymizeFilePaths(t.stack,this.firstParty)),this.telemetryAppender.logException(t,{properties:this.removePropertiesWithPossibleUserInfo(i),measurements:n})}}dispose(){return this.telemetryAppender.flush(),Promise.all(this.disposables.map(t=>t.dispose()))}};var gu=class{constructor(t,r){this._isInstantiated=!1;this._eventQueue=[];this._exceptionQueue=[];this._clientFactory=r,this._key=t,nn()!==He.OFF&&this.instantiateAppender()}logEvent(t,r){if(!this._telemetryClient){!this._isInstantiated&&nn()===He.ON&&this._eventQueue.push({eventName:t,data:r});return}this._telemetryClient.logEvent(t,r)}logException(t,r){if(!this._telemetryClient){!this._isInstantiated&&nn()!==He.OFF&&this._exceptionQueue.push({exception:t,data:r});return}this._telemetryClient.logException(t,r)}async flush(){this._telemetryClient&&(await this._telemetryClient.flush(),this._telemetryClient=void 0)}_flushQueues(){this._eventQueue.forEach(({eventName:t,data:r})=>this.logEvent(t,r)),this._eventQueue=[],this._exceptionQueue.forEach(({exception:t,data:r})=>this.logException(t,r)),this._exceptionQueue=[]}instantiateAppender(){this._isInstantiated||this._clientFactory(this._key).then(t=>{this._telemetryClient=t,this._isInstantiated=!0,this._flushQueues()}).catch(t=>{console.error(t)})}};var Ux=async e=>{let t;try{process.env.APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL="1";let n=await Promise.resolve().then(()=>Ai(iS()));n.defaultClient?(t=new n.TelemetryClient(e),t.channel.setUseDiskRetryCaching(!0)):(n.setup(e).setAutoCollectRequests(!1).setAutoCollectPerformance(!1).setAutoCollectExceptions(!1).setAutoCollectDependencies(!1).setAutoDependencyCorrelation(!1).setAutoCollectConsole(!1).setAutoCollectHeartbeat(!1).setUseDiskRetryCaching(!0).start(),t=n.defaultClient),yi&&yi.env&&(t.context.tags[t.context.keys.userId]=yi.env.machineId,t.context.tags[t.context.keys.sessionId]=yi.env.sessionId,t.context.tags[t.context.keys.cloudRole]=yi.env.appName,t.context.tags[t.context.keys.cloudRoleInstance]=yi.env.appName),e&&e.indexOf("AIF-")===0&&(t.config.endpointUrl="https://vortex.data.microsoft.com/collect/v1")}catch(n){return Promise.reject(n)}return{logEvent:(n,i)=>{t==null||t.trackEvent({name:n,properties:i==null?void 0:i.properties,measurements:i==null?void 0:i.measurements})},logException:(n,i)=>{t==null||t.trackException({exception:n,properties:i==null?void 0:i.properties,measurements:i==null?void 0:i.measurements})},flush:async()=>{t==null||t.flush()}}},lf=class extends vu{constructor(t,r,n,i){let a=new gu(n,Ux);n&&n.indexOf("AIF-")===0&&(i=!0);super(t,r,a,{release:mi.release(),platform:mi.platform(),architecture:mi.arch()},i)}};0&&(false);

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./node_modules/xml2js/lib/bom.js":
/*!****************************************!*\
  !*** ./node_modules/xml2js/lib/bom.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  exports.stripBOM = function(str) {
    if (str[0] === '\uFEFF') {
      return str.substring(1);
    } else {
      return str;
    }
  };

}).call(this);


/***/ }),

/***/ "./node_modules/xml2js/lib/builder.js":
/*!********************************************!*\
  !*** ./node_modules/xml2js/lib/builder.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var builder, defaults, escapeCDATA, requiresCDATA, wrapCDATA,
    hasProp = {}.hasOwnProperty;

  builder = __webpack_require__(/*! xmlbuilder */ "./node_modules/xmlbuilder/lib/index.js");

  defaults = __webpack_require__(/*! ./defaults */ "./node_modules/xml2js/lib/defaults.js").defaults;

  requiresCDATA = function(entry) {
    return typeof entry === "string" && (entry.indexOf('&') >= 0 || entry.indexOf('>') >= 0 || entry.indexOf('<') >= 0);
  };

  wrapCDATA = function(entry) {
    return "<![CDATA[" + (escapeCDATA(entry)) + "]]>";
  };

  escapeCDATA = function(entry) {
    return entry.replace(']]>', ']]]]><![CDATA[>');
  };

  exports.Builder = (function() {
    function Builder(opts) {
      var key, ref, value;
      this.options = {};
      ref = defaults["0.2"];
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this.options[key] = value;
      }
      for (key in opts) {
        if (!hasProp.call(opts, key)) continue;
        value = opts[key];
        this.options[key] = value;
      }
    }

    Builder.prototype.buildObject = function(rootObj) {
      var attrkey, charkey, render, rootElement, rootName;
      attrkey = this.options.attrkey;
      charkey = this.options.charkey;
      if ((Object.keys(rootObj).length === 1) && (this.options.rootName === defaults['0.2'].rootName)) {
        rootName = Object.keys(rootObj)[0];
        rootObj = rootObj[rootName];
      } else {
        rootName = this.options.rootName;
      }
      render = (function(_this) {
        return function(element, obj) {
          var attr, child, entry, index, key, value;
          if (typeof obj !== 'object') {
            if (_this.options.cdata && requiresCDATA(obj)) {
              element.raw(wrapCDATA(obj));
            } else {
              element.txt(obj);
            }
          } else if (Array.isArray(obj)) {
            for (index in obj) {
              if (!hasProp.call(obj, index)) continue;
              child = obj[index];
              for (key in child) {
                entry = child[key];
                element = render(element.ele(key), entry).up();
              }
            }
          } else {
            for (key in obj) {
              if (!hasProp.call(obj, key)) continue;
              child = obj[key];
              if (key === attrkey) {
                if (typeof child === "object") {
                  for (attr in child) {
                    value = child[attr];
                    element = element.att(attr, value);
                  }
                }
              } else if (key === charkey) {
                if (_this.options.cdata && requiresCDATA(child)) {
                  element = element.raw(wrapCDATA(child));
                } else {
                  element = element.txt(child);
                }
              } else if (Array.isArray(child)) {
                for (index in child) {
                  if (!hasProp.call(child, index)) continue;
                  entry = child[index];
                  if (typeof entry === 'string') {
                    if (_this.options.cdata && requiresCDATA(entry)) {
                      element = element.ele(key).raw(wrapCDATA(entry)).up();
                    } else {
                      element = element.ele(key, entry).up();
                    }
                  } else {
                    element = render(element.ele(key), entry).up();
                  }
                }
              } else if (typeof child === "object") {
                element = render(element.ele(key), child).up();
              } else {
                if (typeof child === 'string' && _this.options.cdata && requiresCDATA(child)) {
                  element = element.ele(key).raw(wrapCDATA(child)).up();
                } else {
                  if (child == null) {
                    child = '';
                  }
                  element = element.ele(key, child.toString()).up();
                }
              }
            }
          }
          return element;
        };
      })(this);
      rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, {
        headless: this.options.headless,
        allowSurrogateChars: this.options.allowSurrogateChars
      });
      return render(rootElement, rootObj).end(this.options.renderOpts);
    };

    return Builder;

  })();

}).call(this);


/***/ }),

/***/ "./node_modules/xml2js/lib/defaults.js":
/*!*********************************************!*\
  !*** ./node_modules/xml2js/lib/defaults.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  exports.defaults = {
    "0.1": {
      explicitCharkey: false,
      trim: true,
      normalize: true,
      normalizeTags: false,
      attrkey: "@",
      charkey: "#",
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: false,
      explicitRoot: false,
      validator: null,
      xmlns: false,
      explicitChildren: false,
      childkey: '@@',
      charsAsChildren: false,
      includeWhiteChars: false,
      async: false,
      strict: true,
      attrNameProcessors: null,
      attrValueProcessors: null,
      tagNameProcessors: null,
      valueProcessors: null,
      emptyTag: ''
    },
    "0.2": {
      explicitCharkey: false,
      trim: false,
      normalize: false,
      normalizeTags: false,
      attrkey: "$",
      charkey: "_",
      explicitArray: true,
      ignoreAttrs: false,
      mergeAttrs: false,
      explicitRoot: true,
      validator: null,
      xmlns: false,
      explicitChildren: false,
      preserveChildrenOrder: false,
      childkey: '$$',
      charsAsChildren: false,
      includeWhiteChars: false,
      async: false,
      strict: true,
      attrNameProcessors: null,
      attrValueProcessors: null,
      tagNameProcessors: null,
      valueProcessors: null,
      rootName: 'root',
      xmldec: {
        'version': '1.0',
        'encoding': 'UTF-8',
        'standalone': true
      },
      doctype: null,
      renderOpts: {
        'pretty': true,
        'indent': '  ',
        'newline': '\n'
      },
      headless: false,
      chunkSize: 10000,
      emptyTag: '',
      cdata: false
    }
  };

}).call(this);


/***/ }),

/***/ "./node_modules/xml2js/lib/parser.js":
/*!*******************************************!*\
  !*** ./node_modules/xml2js/lib/parser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var bom, defaults, events, isEmpty, processItem, processors, sax, setImmediate,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  sax = __webpack_require__(/*! sax */ "./node_modules/sax/lib/sax.js");

  events = __webpack_require__(/*! events */ "events");

  bom = __webpack_require__(/*! ./bom */ "./node_modules/xml2js/lib/bom.js");

  processors = __webpack_require__(/*! ./processors */ "./node_modules/xml2js/lib/processors.js");

  setImmediate = __webpack_require__(/*! timers */ "timers").setImmediate;

  defaults = __webpack_require__(/*! ./defaults */ "./node_modules/xml2js/lib/defaults.js").defaults;

  isEmpty = function(thing) {
    return typeof thing === "object" && (thing != null) && Object.keys(thing).length === 0;
  };

  processItem = function(processors, item, key) {
    var i, len, process;
    for (i = 0, len = processors.length; i < len; i++) {
      process = processors[i];
      item = process(item, key);
    }
    return item;
  };

  exports.Parser = (function(superClass) {
    extend(Parser, superClass);

    function Parser(opts) {
      this.parseString = bind(this.parseString, this);
      this.reset = bind(this.reset, this);
      this.assignOrPush = bind(this.assignOrPush, this);
      this.processAsync = bind(this.processAsync, this);
      var key, ref, value;
      if (!(this instanceof exports.Parser)) {
        return new exports.Parser(opts);
      }
      this.options = {};
      ref = defaults["0.2"];
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this.options[key] = value;
      }
      for (key in opts) {
        if (!hasProp.call(opts, key)) continue;
        value = opts[key];
        this.options[key] = value;
      }
      if (this.options.xmlns) {
        this.options.xmlnskey = this.options.attrkey + "ns";
      }
      if (this.options.normalizeTags) {
        if (!this.options.tagNameProcessors) {
          this.options.tagNameProcessors = [];
        }
        this.options.tagNameProcessors.unshift(processors.normalize);
      }
      this.reset();
    }

    Parser.prototype.processAsync = function() {
      var chunk, err;
      try {
        if (this.remaining.length <= this.options.chunkSize) {
          chunk = this.remaining;
          this.remaining = '';
          this.saxParser = this.saxParser.write(chunk);
          return this.saxParser.close();
        } else {
          chunk = this.remaining.substr(0, this.options.chunkSize);
          this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
          this.saxParser = this.saxParser.write(chunk);
          return setImmediate(this.processAsync);
        }
      } catch (error1) {
        err = error1;
        if (!this.saxParser.errThrown) {
          this.saxParser.errThrown = true;
          return this.emit(err);
        }
      }
    };

    Parser.prototype.assignOrPush = function(obj, key, newValue) {
      if (!(key in obj)) {
        if (!this.options.explicitArray) {
          return obj[key] = newValue;
        } else {
          return obj[key] = [newValue];
        }
      } else {
        if (!(obj[key] instanceof Array)) {
          obj[key] = [obj[key]];
        }
        return obj[key].push(newValue);
      }
    };

    Parser.prototype.reset = function() {
      var attrkey, charkey, ontext, stack;
      this.removeAllListeners();
      this.saxParser = sax.parser(this.options.strict, {
        trim: false,
        normalize: false,
        xmlns: this.options.xmlns
      });
      this.saxParser.errThrown = false;
      this.saxParser.onerror = (function(_this) {
        return function(error) {
          _this.saxParser.resume();
          if (!_this.saxParser.errThrown) {
            _this.saxParser.errThrown = true;
            return _this.emit("error", error);
          }
        };
      })(this);
      this.saxParser.onend = (function(_this) {
        return function() {
          if (!_this.saxParser.ended) {
            _this.saxParser.ended = true;
            return _this.emit("end", _this.resultObject);
          }
        };
      })(this);
      this.saxParser.ended = false;
      this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
      this.resultObject = null;
      stack = [];
      attrkey = this.options.attrkey;
      charkey = this.options.charkey;
      this.saxParser.onopentag = (function(_this) {
        return function(node) {
          var key, newValue, obj, processedKey, ref;
          obj = {};
          obj[charkey] = "";
          if (!_this.options.ignoreAttrs) {
            ref = node.attributes;
            for (key in ref) {
              if (!hasProp.call(ref, key)) continue;
              if (!(attrkey in obj) && !_this.options.mergeAttrs) {
                obj[attrkey] = {};
              }
              newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key];
              processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
              if (_this.options.mergeAttrs) {
                _this.assignOrPush(obj, processedKey, newValue);
              } else {
                obj[attrkey][processedKey] = newValue;
              }
            }
          }
          obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node.name) : node.name;
          if (_this.options.xmlns) {
            obj[_this.options.xmlnskey] = {
              uri: node.uri,
              local: node.local
            };
          }
          return stack.push(obj);
        };
      })(this);
      this.saxParser.onclosetag = (function(_this) {
        return function() {
          var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s, xpath;
          obj = stack.pop();
          nodeName = obj["#name"];
          if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
            delete obj["#name"];
          }
          if (obj.cdata === true) {
            cdata = obj.cdata;
            delete obj.cdata;
          }
          s = stack[stack.length - 1];
          if (obj[charkey].match(/^\s*$/) && !cdata) {
            emptyStr = obj[charkey];
            delete obj[charkey];
          } else {
            if (_this.options.trim) {
              obj[charkey] = obj[charkey].trim();
            }
            if (_this.options.normalize) {
              obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
            }
            obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
            if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
              obj = obj[charkey];
            }
          }
          if (isEmpty(obj)) {
            obj = _this.options.emptyTag !== '' ? _this.options.emptyTag : emptyStr;
          }
          if (_this.options.validator != null) {
            xpath = "/" + ((function() {
              var i, len, results;
              results = [];
              for (i = 0, len = stack.length; i < len; i++) {
                node = stack[i];
                results.push(node["#name"]);
              }
              return results;
            })()).concat(nodeName).join("/");
            (function() {
              var err;
              try {
                return obj = _this.options.validator(xpath, s && s[nodeName], obj);
              } catch (error1) {
                err = error1;
                return _this.emit("error", err);
              }
            })();
          }
          if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === 'object') {
            if (!_this.options.preserveChildrenOrder) {
              node = {};
              if (_this.options.attrkey in obj) {
                node[_this.options.attrkey] = obj[_this.options.attrkey];
                delete obj[_this.options.attrkey];
              }
              if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
                node[_this.options.charkey] = obj[_this.options.charkey];
                delete obj[_this.options.charkey];
              }
              if (Object.getOwnPropertyNames(obj).length > 0) {
                node[_this.options.childkey] = obj;
              }
              obj = node;
            } else if (s) {
              s[_this.options.childkey] = s[_this.options.childkey] || [];
              objClone = {};
              for (key in obj) {
                if (!hasProp.call(obj, key)) continue;
                objClone[key] = obj[key];
              }
              s[_this.options.childkey].push(objClone);
              delete obj["#name"];
              if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                obj = obj[charkey];
              }
            }
          }
          if (stack.length > 0) {
            return _this.assignOrPush(s, nodeName, obj);
          } else {
            if (_this.options.explicitRoot) {
              old = obj;
              obj = {};
              obj[nodeName] = old;
            }
            _this.resultObject = obj;
            _this.saxParser.ended = true;
            return _this.emit("end", _this.resultObject);
          }
        };
      })(this);
      ontext = (function(_this) {
        return function(text) {
          var charChild, s;
          s = stack[stack.length - 1];
          if (s) {
            s[charkey] += text;
            if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, '').trim() !== '')) {
              s[_this.options.childkey] = s[_this.options.childkey] || [];
              charChild = {
                '#name': '__text__'
              };
              charChild[charkey] = text;
              if (_this.options.normalize) {
                charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
              }
              s[_this.options.childkey].push(charChild);
            }
            return s;
          }
        };
      })(this);
      this.saxParser.ontext = ontext;
      return this.saxParser.oncdata = (function(_this) {
        return function(text) {
          var s;
          s = ontext(text);
          if (s) {
            return s.cdata = true;
          }
        };
      })(this);
    };

    Parser.prototype.parseString = function(str, cb) {
      var err;
      if ((cb != null) && typeof cb === "function") {
        this.on("end", function(result) {
          this.reset();
          return cb(null, result);
        });
        this.on("error", function(err) {
          this.reset();
          return cb(err);
        });
      }
      try {
        str = str.toString();
        if (str.trim() === '') {
          this.emit("end", null);
          return true;
        }
        str = bom.stripBOM(str);
        if (this.options.async) {
          this.remaining = str;
          setImmediate(this.processAsync);
          return this.saxParser;
        }
        return this.saxParser.write(str).close();
      } catch (error1) {
        err = error1;
        if (!(this.saxParser.errThrown || this.saxParser.ended)) {
          this.emit('error', err);
          return this.saxParser.errThrown = true;
        } else if (this.saxParser.ended) {
          throw err;
        }
      }
    };

    return Parser;

  })(events.EventEmitter);

  exports.parseString = function(str, a, b) {
    var cb, options, parser;
    if (b != null) {
      if (typeof b === 'function') {
        cb = b;
      }
      if (typeof a === 'object') {
        options = a;
      }
    } else {
      if (typeof a === 'function') {
        cb = a;
      }
      options = {};
    }
    parser = new exports.Parser(options);
    return parser.parseString(str, cb);
  };

}).call(this);


/***/ }),

/***/ "./node_modules/xml2js/lib/processors.js":
/*!***********************************************!*\
  !*** ./node_modules/xml2js/lib/processors.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var prefixMatch;

  prefixMatch = new RegExp(/(?!xmlns)^.*:/);

  exports.normalize = function(str) {
    return str.toLowerCase();
  };

  exports.firstCharLowerCase = function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  };

  exports.stripPrefix = function(str) {
    return str.replace(prefixMatch, '');
  };

  exports.parseNumbers = function(str) {
    if (!isNaN(str)) {
      str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
    }
    return str;
  };

  exports.parseBooleans = function(str) {
    if (/^(?:true|false)$/i.test(str)) {
      str = str.toLowerCase() === 'true';
    }
    return str;
  };

}).call(this);


/***/ }),

/***/ "./node_modules/xml2js/lib/xml2js.js":
/*!*******************************************!*\
  !*** ./node_modules/xml2js/lib/xml2js.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var builder, defaults, parser, processors,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  defaults = __webpack_require__(/*! ./defaults */ "./node_modules/xml2js/lib/defaults.js");

  builder = __webpack_require__(/*! ./builder */ "./node_modules/xml2js/lib/builder.js");

  parser = __webpack_require__(/*! ./parser */ "./node_modules/xml2js/lib/parser.js");

  processors = __webpack_require__(/*! ./processors */ "./node_modules/xml2js/lib/processors.js");

  exports.defaults = defaults.defaults;

  exports.processors = processors;

  exports.ValidationError = (function(superClass) {
    extend(ValidationError, superClass);

    function ValidationError(message) {
      this.message = message;
    }

    return ValidationError;

  })(Error);

  exports.Builder = builder.Builder;

  exports.Parser = parser.Parser;

  exports.parseString = parser.parseString;

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/Utility.js":
/*!************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/Utility.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var assign, isArray, isEmpty, isFunction, isObject, isPlainObject,
    slice = [].slice,
    hasProp = {}.hasOwnProperty;

  assign = function() {
    var i, key, len, source, sources, target;
    target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (isFunction(Object.assign)) {
      Object.assign.apply(null, arguments);
    } else {
      for (i = 0, len = sources.length; i < len; i++) {
        source = sources[i];
        if (source != null) {
          for (key in source) {
            if (!hasProp.call(source, key)) continue;
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };

  isFunction = function(val) {
    return !!val && Object.prototype.toString.call(val) === '[object Function]';
  };

  isObject = function(val) {
    var ref;
    return !!val && ((ref = typeof val) === 'function' || ref === 'object');
  };

  isArray = function(val) {
    if (isFunction(Array.isArray)) {
      return Array.isArray(val);
    } else {
      return Object.prototype.toString.call(val) === '[object Array]';
    }
  };

  isEmpty = function(val) {
    var key;
    if (isArray(val)) {
      return !val.length;
    } else {
      for (key in val) {
        if (!hasProp.call(val, key)) continue;
        return false;
      }
      return true;
    }
  };

  isPlainObject = function(val) {
    var ctor, proto;
    return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && (typeof ctor === 'function') && (ctor instanceof ctor) && (Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object));
  };

  module.exports.assign = assign;

  module.exports.isFunction = isFunction;

  module.exports.isObject = isObject;

  module.exports.isArray = isArray;

  module.exports.isEmpty = isEmpty;

  module.exports.isPlainObject = isPlainObject;

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLAttribute.js":
/*!*****************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLAttribute.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLAttribute;

  module.exports = XMLAttribute = (function() {
    function XMLAttribute(parent, name, value) {
      this.options = parent.options;
      this.stringify = parent.stringify;
      if (name == null) {
        throw new Error("Missing attribute name of element " + parent.name);
      }
      if (value == null) {
        throw new Error("Missing attribute value for attribute " + name + " of element " + parent.name);
      }
      this.name = this.stringify.attName(name);
      this.value = this.stringify.attValue(value);
    }

    XMLAttribute.prototype.clone = function() {
      return Object.create(this);
    };

    XMLAttribute.prototype.toString = function(options) {
      return this.options.writer.set(options).attribute(this);
    };

    return XMLAttribute;

  })();

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLCData.js":
/*!*************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLCData.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLCData, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  module.exports = XMLCData = (function(superClass) {
    extend(XMLCData, superClass);

    function XMLCData(parent, text) {
      XMLCData.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing CDATA text");
      }
      this.text = this.stringify.cdata(text);
    }

    XMLCData.prototype.clone = function() {
      return Object.create(this);
    };

    XMLCData.prototype.toString = function(options) {
      return this.options.writer.set(options).cdata(this);
    };

    return XMLCData;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLComment.js":
/*!***************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLComment.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLComment, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  module.exports = XMLComment = (function(superClass) {
    extend(XMLComment, superClass);

    function XMLComment(parent, text) {
      XMLComment.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing comment text");
      }
      this.text = this.stringify.comment(text);
    }

    XMLComment.prototype.clone = function() {
      return Object.create(this);
    };

    XMLComment.prototype.toString = function(options) {
      return this.options.writer.set(options).comment(this);
    };

    return XMLComment;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLDTDAttList.js":
/*!******************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLDTDAttList.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDTDAttList, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  module.exports = XMLDTDAttList = (function(superClass) {
    extend(XMLDTDAttList, superClass);

    function XMLDTDAttList(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      XMLDTDAttList.__super__.constructor.call(this, parent);
      if (elementName == null) {
        throw new Error("Missing DTD element name");
      }
      if (attributeName == null) {
        throw new Error("Missing DTD attribute name");
      }
      if (!attributeType) {
        throw new Error("Missing DTD attribute type");
      }
      if (!defaultValueType) {
        throw new Error("Missing DTD attribute default");
      }
      if (defaultValueType.indexOf('#') !== 0) {
        defaultValueType = '#' + defaultValueType;
      }
      if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
        throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT");
      }
      if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
        throw new Error("Default value only applies to #FIXED or #DEFAULT");
      }
      this.elementName = this.stringify.eleName(elementName);
      this.attributeName = this.stringify.attName(attributeName);
      this.attributeType = this.stringify.dtdAttType(attributeType);
      this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
      this.defaultValueType = defaultValueType;
    }

    XMLDTDAttList.prototype.toString = function(options) {
      return this.options.writer.set(options).dtdAttList(this);
    };

    return XMLDTDAttList;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLDTDElement.js":
/*!******************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLDTDElement.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDTDElement, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  module.exports = XMLDTDElement = (function(superClass) {
    extend(XMLDTDElement, superClass);

    function XMLDTDElement(parent, name, value) {
      XMLDTDElement.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing DTD element name");
      }
      if (!value) {
        value = '(#PCDATA)';
      }
      if (Array.isArray(value)) {
        value = '(' + value.join(',') + ')';
      }
      this.name = this.stringify.eleName(name);
      this.value = this.stringify.dtdElementValue(value);
    }

    XMLDTDElement.prototype.toString = function(options) {
      return this.options.writer.set(options).dtdElement(this);
    };

    return XMLDTDElement;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLDTDEntity.js":
/*!*****************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLDTDEntity.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDTDEntity, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = __webpack_require__(/*! ./Utility */ "./node_modules/xmlbuilder/lib/Utility.js").isObject;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  module.exports = XMLDTDEntity = (function(superClass) {
    extend(XMLDTDEntity, superClass);

    function XMLDTDEntity(parent, pe, name, value) {
      XMLDTDEntity.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing entity name");
      }
      if (value == null) {
        throw new Error("Missing entity value");
      }
      this.pe = !!pe;
      this.name = this.stringify.eleName(name);
      if (!isObject(value)) {
        this.value = this.stringify.dtdEntityValue(value);
      } else {
        if (!value.pubID && !value.sysID) {
          throw new Error("Public and/or system identifiers are required for an external entity");
        }
        if (value.pubID && !value.sysID) {
          throw new Error("System identifier is required for a public external entity");
        }
        if (value.pubID != null) {
          this.pubID = this.stringify.dtdPubID(value.pubID);
        }
        if (value.sysID != null) {
          this.sysID = this.stringify.dtdSysID(value.sysID);
        }
        if (value.nData != null) {
          this.nData = this.stringify.dtdNData(value.nData);
        }
        if (this.pe && this.nData) {
          throw new Error("Notation declaration is not allowed in a parameter entity");
        }
      }
    }

    XMLDTDEntity.prototype.toString = function(options) {
      return this.options.writer.set(options).dtdEntity(this);
    };

    return XMLDTDEntity;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLDTDNotation.js":
/*!*******************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLDTDNotation.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDTDNotation, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  module.exports = XMLDTDNotation = (function(superClass) {
    extend(XMLDTDNotation, superClass);

    function XMLDTDNotation(parent, name, value) {
      XMLDTDNotation.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing notation name");
      }
      if (!value.pubID && !value.sysID) {
        throw new Error("Public or system identifiers are required for an external entity");
      }
      this.name = this.stringify.eleName(name);
      if (value.pubID != null) {
        this.pubID = this.stringify.dtdPubID(value.pubID);
      }
      if (value.sysID != null) {
        this.sysID = this.stringify.dtdSysID(value.sysID);
      }
    }

    XMLDTDNotation.prototype.toString = function(options) {
      return this.options.writer.set(options).dtdNotation(this);
    };

    return XMLDTDNotation;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLDeclaration.js":
/*!*******************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLDeclaration.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDeclaration, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = __webpack_require__(/*! ./Utility */ "./node_modules/xmlbuilder/lib/Utility.js").isObject;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  module.exports = XMLDeclaration = (function(superClass) {
    extend(XMLDeclaration, superClass);

    function XMLDeclaration(parent, version, encoding, standalone) {
      var ref;
      XMLDeclaration.__super__.constructor.call(this, parent);
      if (isObject(version)) {
        ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
      }
      if (!version) {
        version = '1.0';
      }
      this.version = this.stringify.xmlVersion(version);
      if (encoding != null) {
        this.encoding = this.stringify.xmlEncoding(encoding);
      }
      if (standalone != null) {
        this.standalone = this.stringify.xmlStandalone(standalone);
      }
    }

    XMLDeclaration.prototype.toString = function(options) {
      return this.options.writer.set(options).declaration(this);
    };

    return XMLDeclaration;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLDocType.js":
/*!***************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLDocType.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = __webpack_require__(/*! ./Utility */ "./node_modules/xmlbuilder/lib/Utility.js").isObject;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  XMLDTDAttList = __webpack_require__(/*! ./XMLDTDAttList */ "./node_modules/xmlbuilder/lib/XMLDTDAttList.js");

  XMLDTDEntity = __webpack_require__(/*! ./XMLDTDEntity */ "./node_modules/xmlbuilder/lib/XMLDTDEntity.js");

  XMLDTDElement = __webpack_require__(/*! ./XMLDTDElement */ "./node_modules/xmlbuilder/lib/XMLDTDElement.js");

  XMLDTDNotation = __webpack_require__(/*! ./XMLDTDNotation */ "./node_modules/xmlbuilder/lib/XMLDTDNotation.js");

  module.exports = XMLDocType = (function(superClass) {
    extend(XMLDocType, superClass);

    function XMLDocType(parent, pubID, sysID) {
      var ref, ref1;
      XMLDocType.__super__.constructor.call(this, parent);
      this.documentObject = parent;
      if (isObject(pubID)) {
        ref = pubID, pubID = ref.pubID, sysID = ref.sysID;
      }
      if (sysID == null) {
        ref1 = [pubID, sysID], sysID = ref1[0], pubID = ref1[1];
      }
      if (pubID != null) {
        this.pubID = this.stringify.dtdPubID(pubID);
      }
      if (sysID != null) {
        this.sysID = this.stringify.dtdSysID(sysID);
      }
    }

    XMLDocType.prototype.element = function(name, value) {
      var child;
      child = new XMLDTDElement(this, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      var child;
      child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.entity = function(name, value) {
      var child;
      child = new XMLDTDEntity(this, false, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.pEntity = function(name, value) {
      var child;
      child = new XMLDTDEntity(this, true, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.notation = function(name, value) {
      var child;
      child = new XMLDTDNotation(this, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.toString = function(options) {
      return this.options.writer.set(options).docType(this);
    };

    XMLDocType.prototype.ele = function(name, value) {
      return this.element(name, value);
    };

    XMLDocType.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
    };

    XMLDocType.prototype.ent = function(name, value) {
      return this.entity(name, value);
    };

    XMLDocType.prototype.pent = function(name, value) {
      return this.pEntity(name, value);
    };

    XMLDocType.prototype.not = function(name, value) {
      return this.notation(name, value);
    };

    XMLDocType.prototype.up = function() {
      return this.root() || this.documentObject;
    };

    return XMLDocType;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLDocument.js":
/*!****************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLDocument.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isPlainObject = __webpack_require__(/*! ./Utility */ "./node_modules/xmlbuilder/lib/Utility.js").isPlainObject;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  XMLStringifier = __webpack_require__(/*! ./XMLStringifier */ "./node_modules/xmlbuilder/lib/XMLStringifier.js");

  XMLStringWriter = __webpack_require__(/*! ./XMLStringWriter */ "./node_modules/xmlbuilder/lib/XMLStringWriter.js");

  module.exports = XMLDocument = (function(superClass) {
    extend(XMLDocument, superClass);

    function XMLDocument(options) {
      XMLDocument.__super__.constructor.call(this, null);
      options || (options = {});
      if (!options.writer) {
        options.writer = new XMLStringWriter();
      }
      this.options = options;
      this.stringify = new XMLStringifier(options);
      this.isDocument = true;
    }

    XMLDocument.prototype.end = function(writer) {
      var writerOptions;
      if (!writer) {
        writer = this.options.writer;
      } else if (isPlainObject(writer)) {
        writerOptions = writer;
        writer = this.options.writer.set(writerOptions);
      }
      return writer.document(this);
    };

    XMLDocument.prototype.toString = function(options) {
      return this.options.writer.set(options).document(this);
    };

    return XMLDocument;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLDocumentCB.js":
/*!******************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLDocumentCB.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, isFunction, isObject, isPlainObject, ref,
    hasProp = {}.hasOwnProperty;

  ref = __webpack_require__(/*! ./Utility */ "./node_modules/xmlbuilder/lib/Utility.js"), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject;

  XMLElement = __webpack_require__(/*! ./XMLElement */ "./node_modules/xmlbuilder/lib/XMLElement.js");

  XMLCData = __webpack_require__(/*! ./XMLCData */ "./node_modules/xmlbuilder/lib/XMLCData.js");

  XMLComment = __webpack_require__(/*! ./XMLComment */ "./node_modules/xmlbuilder/lib/XMLComment.js");

  XMLRaw = __webpack_require__(/*! ./XMLRaw */ "./node_modules/xmlbuilder/lib/XMLRaw.js");

  XMLText = __webpack_require__(/*! ./XMLText */ "./node_modules/xmlbuilder/lib/XMLText.js");

  XMLProcessingInstruction = __webpack_require__(/*! ./XMLProcessingInstruction */ "./node_modules/xmlbuilder/lib/XMLProcessingInstruction.js");

  XMLDeclaration = __webpack_require__(/*! ./XMLDeclaration */ "./node_modules/xmlbuilder/lib/XMLDeclaration.js");

  XMLDocType = __webpack_require__(/*! ./XMLDocType */ "./node_modules/xmlbuilder/lib/XMLDocType.js");

  XMLDTDAttList = __webpack_require__(/*! ./XMLDTDAttList */ "./node_modules/xmlbuilder/lib/XMLDTDAttList.js");

  XMLDTDEntity = __webpack_require__(/*! ./XMLDTDEntity */ "./node_modules/xmlbuilder/lib/XMLDTDEntity.js");

  XMLDTDElement = __webpack_require__(/*! ./XMLDTDElement */ "./node_modules/xmlbuilder/lib/XMLDTDElement.js");

  XMLDTDNotation = __webpack_require__(/*! ./XMLDTDNotation */ "./node_modules/xmlbuilder/lib/XMLDTDNotation.js");

  XMLAttribute = __webpack_require__(/*! ./XMLAttribute */ "./node_modules/xmlbuilder/lib/XMLAttribute.js");

  XMLStringifier = __webpack_require__(/*! ./XMLStringifier */ "./node_modules/xmlbuilder/lib/XMLStringifier.js");

  XMLStringWriter = __webpack_require__(/*! ./XMLStringWriter */ "./node_modules/xmlbuilder/lib/XMLStringWriter.js");

  module.exports = XMLDocumentCB = (function() {
    function XMLDocumentCB(options, onData, onEnd) {
      var writerOptions;
      options || (options = {});
      if (!options.writer) {
        options.writer = new XMLStringWriter(options);
      } else if (isPlainObject(options.writer)) {
        writerOptions = options.writer;
        options.writer = new XMLStringWriter(writerOptions);
      }
      this.options = options;
      this.writer = options.writer;
      this.stringify = new XMLStringifier(options);
      this.onDataCallback = onData || function() {};
      this.onEndCallback = onEnd || function() {};
      this.currentNode = null;
      this.currentLevel = -1;
      this.openTags = {};
      this.documentStarted = false;
      this.documentCompleted = false;
      this.root = null;
    }

    XMLDocumentCB.prototype.node = function(name, attributes, text) {
      var ref1;
      if (name == null) {
        throw new Error("Missing node name");
      }
      if (this.root && this.currentLevel === -1) {
        throw new Error("Document can only have one root node");
      }
      this.openCurrent();
      name = name.valueOf();
      if (attributes == null) {
        attributes = {};
      }
      attributes = attributes.valueOf();
      if (!isObject(attributes)) {
        ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
      }
      this.currentNode = new XMLElement(this, name, attributes);
      this.currentNode.children = false;
      this.currentLevel++;
      this.openTags[this.currentLevel] = this.currentNode;
      if (text != null) {
        this.text(text);
      }
      return this;
    };

    XMLDocumentCB.prototype.element = function(name, attributes, text) {
      if (this.currentNode && this.currentNode instanceof XMLDocType) {
        return this.dtdElement.apply(this, arguments);
      } else {
        return this.node(name, attributes, text);
      }
    };

    XMLDocumentCB.prototype.attribute = function(name, value) {
      var attName, attValue;
      if (!this.currentNode || this.currentNode.children) {
        throw new Error("att() can only be used immediately after an ele() call in callback mode");
      }
      if (name != null) {
        name = name.valueOf();
      }
      if (isObject(name)) {
        for (attName in name) {
          if (!hasProp.call(name, attName)) continue;
          attValue = name[attName];
          this.attribute(attName, attValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        if (!this.options.skipNullAttributes || (value != null)) {
          this.currentNode.attributes[name] = new XMLAttribute(this, name, value);
        }
      }
      return this;
    };

    XMLDocumentCB.prototype.text = function(value) {
      var node;
      this.openCurrent();
      node = new XMLText(this, value);
      this.onData(this.writer.text(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.cdata = function(value) {
      var node;
      this.openCurrent();
      node = new XMLCData(this, value);
      this.onData(this.writer.cdata(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.comment = function(value) {
      var node;
      this.openCurrent();
      node = new XMLComment(this, value);
      this.onData(this.writer.comment(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.raw = function(value) {
      var node;
      this.openCurrent();
      node = new XMLRaw(this, value);
      this.onData(this.writer.raw(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.instruction = function(target, value) {
      var i, insTarget, insValue, len, node;
      this.openCurrent();
      if (target != null) {
        target = target.valueOf();
      }
      if (value != null) {
        value = value.valueOf();
      }
      if (Array.isArray(target)) {
        for (i = 0, len = target.length; i < len; i++) {
          insTarget = target[i];
          this.instruction(insTarget);
        }
      } else if (isObject(target)) {
        for (insTarget in target) {
          if (!hasProp.call(target, insTarget)) continue;
          insValue = target[insTarget];
          this.instruction(insTarget, insValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        node = new XMLProcessingInstruction(this, target, value);
        this.onData(this.writer.processingInstruction(node, this.currentLevel + 1));
      }
      return this;
    };

    XMLDocumentCB.prototype.declaration = function(version, encoding, standalone) {
      var node;
      this.openCurrent();
      if (this.documentStarted) {
        throw new Error("declaration() must be the first node");
      }
      node = new XMLDeclaration(this, version, encoding, standalone);
      this.onData(this.writer.declaration(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.doctype = function(root, pubID, sysID) {
      this.openCurrent();
      if (root == null) {
        throw new Error("Missing root node name");
      }
      if (this.root) {
        throw new Error("dtd() must come before the root node");
      }
      this.currentNode = new XMLDocType(this, pubID, sysID);
      this.currentNode.rootNodeName = root;
      this.currentNode.children = false;
      this.currentLevel++;
      this.openTags[this.currentLevel] = this.currentNode;
      return this;
    };

    XMLDocumentCB.prototype.dtdElement = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDElement(this, name, value);
      this.onData(this.writer.dtdElement(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      var node;
      this.openCurrent();
      node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
      this.onData(this.writer.dtdAttList(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.entity = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDEntity(this, false, name, value);
      this.onData(this.writer.dtdEntity(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.pEntity = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDEntity(this, true, name, value);
      this.onData(this.writer.dtdEntity(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.notation = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDNotation(this, name, value);
      this.onData(this.writer.dtdNotation(node, this.currentLevel + 1));
      return this;
    };

    XMLDocumentCB.prototype.up = function() {
      if (this.currentLevel < 0) {
        throw new Error("The document node has no parent");
      }
      if (this.currentNode) {
        if (this.currentNode.children) {
          this.closeNode(this.currentNode);
        } else {
          this.openNode(this.currentNode);
        }
        this.currentNode = null;
      } else {
        this.closeNode(this.openTags[this.currentLevel]);
      }
      delete this.openTags[this.currentLevel];
      this.currentLevel--;
      return this;
    };

    XMLDocumentCB.prototype.end = function() {
      while (this.currentLevel >= 0) {
        this.up();
      }
      return this.onEnd();
    };

    XMLDocumentCB.prototype.openCurrent = function() {
      if (this.currentNode) {
        this.currentNode.children = true;
        return this.openNode(this.currentNode);
      }
    };

    XMLDocumentCB.prototype.openNode = function(node) {
      if (!node.isOpen) {
        if (!this.root && this.currentLevel === 0 && node instanceof XMLElement) {
          this.root = node;
        }
        this.onData(this.writer.openNode(node, this.currentLevel));
        return node.isOpen = true;
      }
    };

    XMLDocumentCB.prototype.closeNode = function(node) {
      if (!node.isClosed) {
        this.onData(this.writer.closeNode(node, this.currentLevel));
        return node.isClosed = true;
      }
    };

    XMLDocumentCB.prototype.onData = function(chunk) {
      this.documentStarted = true;
      return this.onDataCallback(chunk);
    };

    XMLDocumentCB.prototype.onEnd = function() {
      this.documentCompleted = true;
      return this.onEndCallback();
    };

    XMLDocumentCB.prototype.ele = function() {
      return this.element.apply(this, arguments);
    };

    XMLDocumentCB.prototype.nod = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLDocumentCB.prototype.txt = function(value) {
      return this.text(value);
    };

    XMLDocumentCB.prototype.dat = function(value) {
      return this.cdata(value);
    };

    XMLDocumentCB.prototype.com = function(value) {
      return this.comment(value);
    };

    XMLDocumentCB.prototype.ins = function(target, value) {
      return this.instruction(target, value);
    };

    XMLDocumentCB.prototype.dec = function(version, encoding, standalone) {
      return this.declaration(version, encoding, standalone);
    };

    XMLDocumentCB.prototype.dtd = function(root, pubID, sysID) {
      return this.doctype(root, pubID, sysID);
    };

    XMLDocumentCB.prototype.e = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLDocumentCB.prototype.n = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLDocumentCB.prototype.t = function(value) {
      return this.text(value);
    };

    XMLDocumentCB.prototype.d = function(value) {
      return this.cdata(value);
    };

    XMLDocumentCB.prototype.c = function(value) {
      return this.comment(value);
    };

    XMLDocumentCB.prototype.r = function(value) {
      return this.raw(value);
    };

    XMLDocumentCB.prototype.i = function(target, value) {
      return this.instruction(target, value);
    };

    XMLDocumentCB.prototype.att = function() {
      if (this.currentNode && this.currentNode instanceof XMLDocType) {
        return this.attList.apply(this, arguments);
      } else {
        return this.attribute.apply(this, arguments);
      }
    };

    XMLDocumentCB.prototype.a = function() {
      if (this.currentNode && this.currentNode instanceof XMLDocType) {
        return this.attList.apply(this, arguments);
      } else {
        return this.attribute.apply(this, arguments);
      }
    };

    XMLDocumentCB.prototype.ent = function(name, value) {
      return this.entity(name, value);
    };

    XMLDocumentCB.prototype.pent = function(name, value) {
      return this.pEntity(name, value);
    };

    XMLDocumentCB.prototype.not = function(name, value) {
      return this.notation(name, value);
    };

    return XMLDocumentCB;

  })();

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLElement.js":
/*!***************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLElement.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLAttribute, XMLElement, XMLNode, isFunction, isObject, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = __webpack_require__(/*! ./Utility */ "./node_modules/xmlbuilder/lib/Utility.js"), isObject = ref.isObject, isFunction = ref.isFunction;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  XMLAttribute = __webpack_require__(/*! ./XMLAttribute */ "./node_modules/xmlbuilder/lib/XMLAttribute.js");

  module.exports = XMLElement = (function(superClass) {
    extend(XMLElement, superClass);

    function XMLElement(parent, name, attributes) {
      XMLElement.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing element name");
      }
      this.name = this.stringify.eleName(name);
      this.attributes = {};
      if (attributes != null) {
        this.attribute(attributes);
      }
      if (parent.isDocument) {
        this.isRoot = true;
        this.documentObject = parent;
        parent.rootObject = this;
      }
    }

    XMLElement.prototype.clone = function() {
      var att, attName, clonedSelf, ref1;
      clonedSelf = Object.create(this);
      if (clonedSelf.isRoot) {
        clonedSelf.documentObject = null;
      }
      clonedSelf.attributes = {};
      ref1 = this.attributes;
      for (attName in ref1) {
        if (!hasProp.call(ref1, attName)) continue;
        att = ref1[attName];
        clonedSelf.attributes[attName] = att.clone();
      }
      clonedSelf.children = [];
      this.children.forEach(function(child) {
        var clonedChild;
        clonedChild = child.clone();
        clonedChild.parent = clonedSelf;
        return clonedSelf.children.push(clonedChild);
      });
      return clonedSelf;
    };

    XMLElement.prototype.attribute = function(name, value) {
      var attName, attValue;
      if (name != null) {
        name = name.valueOf();
      }
      if (isObject(name)) {
        for (attName in name) {
          if (!hasProp.call(name, attName)) continue;
          attValue = name[attName];
          this.attribute(attName, attValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        if (!this.options.skipNullAttributes || (value != null)) {
          this.attributes[name] = new XMLAttribute(this, name, value);
        }
      }
      return this;
    };

    XMLElement.prototype.removeAttribute = function(name) {
      var attName, i, len;
      if (name == null) {
        throw new Error("Missing attribute name");
      }
      name = name.valueOf();
      if (Array.isArray(name)) {
        for (i = 0, len = name.length; i < len; i++) {
          attName = name[i];
          delete this.attributes[attName];
        }
      } else {
        delete this.attributes[name];
      }
      return this;
    };

    XMLElement.prototype.toString = function(options) {
      return this.options.writer.set(options).element(this);
    };

    XMLElement.prototype.att = function(name, value) {
      return this.attribute(name, value);
    };

    XMLElement.prototype.a = function(name, value) {
      return this.attribute(name, value);
    };

    return XMLElement;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLNode.js":
/*!************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLNode.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLElement, XMLNode, XMLProcessingInstruction, XMLRaw, XMLText, isEmpty, isFunction, isObject, ref,
    hasProp = {}.hasOwnProperty;

  ref = __webpack_require__(/*! ./Utility */ "./node_modules/xmlbuilder/lib/Utility.js"), isObject = ref.isObject, isFunction = ref.isFunction, isEmpty = ref.isEmpty;

  XMLElement = null;

  XMLCData = null;

  XMLComment = null;

  XMLDeclaration = null;

  XMLDocType = null;

  XMLRaw = null;

  XMLText = null;

  XMLProcessingInstruction = null;

  module.exports = XMLNode = (function() {
    function XMLNode(parent) {
      this.parent = parent;
      if (this.parent) {
        this.options = this.parent.options;
        this.stringify = this.parent.stringify;
      }
      this.children = [];
      if (!XMLElement) {
        XMLElement = __webpack_require__(/*! ./XMLElement */ "./node_modules/xmlbuilder/lib/XMLElement.js");
        XMLCData = __webpack_require__(/*! ./XMLCData */ "./node_modules/xmlbuilder/lib/XMLCData.js");
        XMLComment = __webpack_require__(/*! ./XMLComment */ "./node_modules/xmlbuilder/lib/XMLComment.js");
        XMLDeclaration = __webpack_require__(/*! ./XMLDeclaration */ "./node_modules/xmlbuilder/lib/XMLDeclaration.js");
        XMLDocType = __webpack_require__(/*! ./XMLDocType */ "./node_modules/xmlbuilder/lib/XMLDocType.js");
        XMLRaw = __webpack_require__(/*! ./XMLRaw */ "./node_modules/xmlbuilder/lib/XMLRaw.js");
        XMLText = __webpack_require__(/*! ./XMLText */ "./node_modules/xmlbuilder/lib/XMLText.js");
        XMLProcessingInstruction = __webpack_require__(/*! ./XMLProcessingInstruction */ "./node_modules/xmlbuilder/lib/XMLProcessingInstruction.js");
      }
    }

    XMLNode.prototype.element = function(name, attributes, text) {
      var childNode, item, j, k, key, lastChild, len, len1, ref1, val;
      lastChild = null;
      if (attributes == null) {
        attributes = {};
      }
      attributes = attributes.valueOf();
      if (!isObject(attributes)) {
        ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
      }
      if (name != null) {
        name = name.valueOf();
      }
      if (Array.isArray(name)) {
        for (j = 0, len = name.length; j < len; j++) {
          item = name[j];
          lastChild = this.element(item);
        }
      } else if (isFunction(name)) {
        lastChild = this.element(name.apply());
      } else if (isObject(name)) {
        for (key in name) {
          if (!hasProp.call(name, key)) continue;
          val = name[key];
          if (isFunction(val)) {
            val = val.apply();
          }
          if ((isObject(val)) && (isEmpty(val))) {
            val = null;
          }
          if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
            lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
          } else if (!this.options.separateArrayItems && Array.isArray(val)) {
            for (k = 0, len1 = val.length; k < len1; k++) {
              item = val[k];
              childNode = {};
              childNode[key] = item;
              lastChild = this.element(childNode);
            }
          } else if (isObject(val)) {
            lastChild = this.element(key);
            lastChild.element(val);
          } else {
            lastChild = this.element(key, val);
          }
        }
      } else {
        if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
          lastChild = this.text(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
          lastChild = this.cdata(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
          lastChild = this.comment(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
          lastChild = this.raw(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
          lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
        } else {
          lastChild = this.node(name, attributes, text);
        }
      }
      if (lastChild == null) {
        throw new Error("Could not create any elements with: " + name);
      }
      return lastChild;
    };

    XMLNode.prototype.insertBefore = function(name, attributes, text) {
      var child, i, removed;
      if (this.isRoot) {
        throw new Error("Cannot insert elements at root level");
      }
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.element(name, attributes, text);
      Array.prototype.push.apply(this.parent.children, removed);
      return child;
    };

    XMLNode.prototype.insertAfter = function(name, attributes, text) {
      var child, i, removed;
      if (this.isRoot) {
        throw new Error("Cannot insert elements at root level");
      }
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.element(name, attributes, text);
      Array.prototype.push.apply(this.parent.children, removed);
      return child;
    };

    XMLNode.prototype.remove = function() {
      var i, ref1;
      if (this.isRoot) {
        throw new Error("Cannot remove the root element");
      }
      i = this.parent.children.indexOf(this);
      [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref1 = [])), ref1;
      return this.parent;
    };

    XMLNode.prototype.node = function(name, attributes, text) {
      var child, ref1;
      if (name != null) {
        name = name.valueOf();
      }
      attributes || (attributes = {});
      attributes = attributes.valueOf();
      if (!isObject(attributes)) {
        ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
      }
      child = new XMLElement(this, name, attributes);
      if (text != null) {
        child.text(text);
      }
      this.children.push(child);
      return child;
    };

    XMLNode.prototype.text = function(value) {
      var child;
      child = new XMLText(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.cdata = function(value) {
      var child;
      child = new XMLCData(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.comment = function(value) {
      var child;
      child = new XMLComment(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.commentBefore = function(value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.comment(value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.commentAfter = function(value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.comment(value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.raw = function(value) {
      var child;
      child = new XMLRaw(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.instruction = function(target, value) {
      var insTarget, insValue, instruction, j, len;
      if (target != null) {
        target = target.valueOf();
      }
      if (value != null) {
        value = value.valueOf();
      }
      if (Array.isArray(target)) {
        for (j = 0, len = target.length; j < len; j++) {
          insTarget = target[j];
          this.instruction(insTarget);
        }
      } else if (isObject(target)) {
        for (insTarget in target) {
          if (!hasProp.call(target, insTarget)) continue;
          insValue = target[insTarget];
          this.instruction(insTarget, insValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        instruction = new XMLProcessingInstruction(this, target, value);
        this.children.push(instruction);
      }
      return this;
    };

    XMLNode.prototype.instructionBefore = function(target, value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.instruction(target, value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.instructionAfter = function(target, value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.instruction(target, value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.declaration = function(version, encoding, standalone) {
      var doc, xmldec;
      doc = this.document();
      xmldec = new XMLDeclaration(doc, version, encoding, standalone);
      if (doc.children[0] instanceof XMLDeclaration) {
        doc.children[0] = xmldec;
      } else {
        doc.children.unshift(xmldec);
      }
      return doc.root() || doc;
    };

    XMLNode.prototype.doctype = function(pubID, sysID) {
      var child, doc, doctype, i, j, k, len, len1, ref1, ref2;
      doc = this.document();
      doctype = new XMLDocType(doc, pubID, sysID);
      ref1 = doc.children;
      for (i = j = 0, len = ref1.length; j < len; i = ++j) {
        child = ref1[i];
        if (child instanceof XMLDocType) {
          doc.children[i] = doctype;
          return doctype;
        }
      }
      ref2 = doc.children;
      for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
        child = ref2[i];
        if (child.isRoot) {
          doc.children.splice(i, 0, doctype);
          return doctype;
        }
      }
      doc.children.push(doctype);
      return doctype;
    };

    XMLNode.prototype.up = function() {
      if (this.isRoot) {
        throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
      }
      return this.parent;
    };

    XMLNode.prototype.root = function() {
      var node;
      node = this;
      while (node) {
        if (node.isDocument) {
          return node.rootObject;
        } else if (node.isRoot) {
          return node;
        } else {
          node = node.parent;
        }
      }
    };

    XMLNode.prototype.document = function() {
      var node;
      node = this;
      while (node) {
        if (node.isDocument) {
          return node;
        } else {
          node = node.parent;
        }
      }
    };

    XMLNode.prototype.end = function(options) {
      return this.document().end(options);
    };

    XMLNode.prototype.prev = function() {
      var i;
      i = this.parent.children.indexOf(this);
      if (i < 1) {
        throw new Error("Already at the first node");
      }
      return this.parent.children[i - 1];
    };

    XMLNode.prototype.next = function() {
      var i;
      i = this.parent.children.indexOf(this);
      if (i === -1 || i === this.parent.children.length - 1) {
        throw new Error("Already at the last node");
      }
      return this.parent.children[i + 1];
    };

    XMLNode.prototype.importDocument = function(doc) {
      var clonedRoot;
      clonedRoot = doc.root().clone();
      clonedRoot.parent = this;
      clonedRoot.isRoot = false;
      this.children.push(clonedRoot);
      return this;
    };

    XMLNode.prototype.ele = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLNode.prototype.nod = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLNode.prototype.txt = function(value) {
      return this.text(value);
    };

    XMLNode.prototype.dat = function(value) {
      return this.cdata(value);
    };

    XMLNode.prototype.com = function(value) {
      return this.comment(value);
    };

    XMLNode.prototype.ins = function(target, value) {
      return this.instruction(target, value);
    };

    XMLNode.prototype.doc = function() {
      return this.document();
    };

    XMLNode.prototype.dec = function(version, encoding, standalone) {
      return this.declaration(version, encoding, standalone);
    };

    XMLNode.prototype.dtd = function(pubID, sysID) {
      return this.doctype(pubID, sysID);
    };

    XMLNode.prototype.e = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLNode.prototype.n = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLNode.prototype.t = function(value) {
      return this.text(value);
    };

    XMLNode.prototype.d = function(value) {
      return this.cdata(value);
    };

    XMLNode.prototype.c = function(value) {
      return this.comment(value);
    };

    XMLNode.prototype.r = function(value) {
      return this.raw(value);
    };

    XMLNode.prototype.i = function(target, value) {
      return this.instruction(target, value);
    };

    XMLNode.prototype.u = function() {
      return this.up();
    };

    XMLNode.prototype.importXMLBuilder = function(doc) {
      return this.importDocument(doc);
    };

    return XMLNode;

  })();

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLProcessingInstruction.js":
/*!*****************************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLProcessingInstruction.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLNode, XMLProcessingInstruction,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  module.exports = XMLProcessingInstruction = (function(superClass) {
    extend(XMLProcessingInstruction, superClass);

    function XMLProcessingInstruction(parent, target, value) {
      XMLProcessingInstruction.__super__.constructor.call(this, parent);
      if (target == null) {
        throw new Error("Missing instruction target");
      }
      this.target = this.stringify.insTarget(target);
      if (value) {
        this.value = this.stringify.insValue(value);
      }
    }

    XMLProcessingInstruction.prototype.clone = function() {
      return Object.create(this);
    };

    XMLProcessingInstruction.prototype.toString = function(options) {
      return this.options.writer.set(options).processingInstruction(this);
    };

    return XMLProcessingInstruction;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLRaw.js":
/*!***********************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLRaw.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLNode, XMLRaw,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  module.exports = XMLRaw = (function(superClass) {
    extend(XMLRaw, superClass);

    function XMLRaw(parent, text) {
      XMLRaw.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing raw text");
      }
      this.value = this.stringify.raw(text);
    }

    XMLRaw.prototype.clone = function() {
      return Object.create(this);
    };

    XMLRaw.prototype.toString = function(options) {
      return this.options.writer.set(options).raw(this);
    };

    return XMLRaw;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLStreamWriter.js":
/*!********************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLStreamWriter.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStreamWriter, XMLText, XMLWriterBase,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLDeclaration = __webpack_require__(/*! ./XMLDeclaration */ "./node_modules/xmlbuilder/lib/XMLDeclaration.js");

  XMLDocType = __webpack_require__(/*! ./XMLDocType */ "./node_modules/xmlbuilder/lib/XMLDocType.js");

  XMLCData = __webpack_require__(/*! ./XMLCData */ "./node_modules/xmlbuilder/lib/XMLCData.js");

  XMLComment = __webpack_require__(/*! ./XMLComment */ "./node_modules/xmlbuilder/lib/XMLComment.js");

  XMLElement = __webpack_require__(/*! ./XMLElement */ "./node_modules/xmlbuilder/lib/XMLElement.js");

  XMLRaw = __webpack_require__(/*! ./XMLRaw */ "./node_modules/xmlbuilder/lib/XMLRaw.js");

  XMLText = __webpack_require__(/*! ./XMLText */ "./node_modules/xmlbuilder/lib/XMLText.js");

  XMLProcessingInstruction = __webpack_require__(/*! ./XMLProcessingInstruction */ "./node_modules/xmlbuilder/lib/XMLProcessingInstruction.js");

  XMLDTDAttList = __webpack_require__(/*! ./XMLDTDAttList */ "./node_modules/xmlbuilder/lib/XMLDTDAttList.js");

  XMLDTDElement = __webpack_require__(/*! ./XMLDTDElement */ "./node_modules/xmlbuilder/lib/XMLDTDElement.js");

  XMLDTDEntity = __webpack_require__(/*! ./XMLDTDEntity */ "./node_modules/xmlbuilder/lib/XMLDTDEntity.js");

  XMLDTDNotation = __webpack_require__(/*! ./XMLDTDNotation */ "./node_modules/xmlbuilder/lib/XMLDTDNotation.js");

  XMLWriterBase = __webpack_require__(/*! ./XMLWriterBase */ "./node_modules/xmlbuilder/lib/XMLWriterBase.js");

  module.exports = XMLStreamWriter = (function(superClass) {
    extend(XMLStreamWriter, superClass);

    function XMLStreamWriter(stream, options) {
      XMLStreamWriter.__super__.constructor.call(this, options);
      this.stream = stream;
    }

    XMLStreamWriter.prototype.document = function(doc) {
      var child, i, j, len, len1, ref, ref1, results;
      ref = doc.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        child.isLastRootNode = false;
      }
      doc.children[doc.children.length - 1].isLastRootNode = true;
      ref1 = doc.children;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        child = ref1[j];
        switch (false) {
          case !(child instanceof XMLDeclaration):
            results.push(this.declaration(child));
            break;
          case !(child instanceof XMLDocType):
            results.push(this.docType(child));
            break;
          case !(child instanceof XMLComment):
            results.push(this.comment(child));
            break;
          case !(child instanceof XMLProcessingInstruction):
            results.push(this.processingInstruction(child));
            break;
          default:
            results.push(this.element(child));
        }
      }
      return results;
    };

    XMLStreamWriter.prototype.attribute = function(att) {
      return this.stream.write(' ' + att.name + '="' + att.value + '"');
    };

    XMLStreamWriter.prototype.cdata = function(node, level) {
      return this.stream.write(this.space(level) + '<![CDATA[' + node.text + ']]>' + this.endline(node));
    };

    XMLStreamWriter.prototype.comment = function(node, level) {
      return this.stream.write(this.space(level) + '<!-- ' + node.text + ' -->' + this.endline(node));
    };

    XMLStreamWriter.prototype.declaration = function(node, level) {
      this.stream.write(this.space(level));
      this.stream.write('<?xml version="' + node.version + '"');
      if (node.encoding != null) {
        this.stream.write(' encoding="' + node.encoding + '"');
      }
      if (node.standalone != null) {
        this.stream.write(' standalone="' + node.standalone + '"');
      }
      this.stream.write(this.spacebeforeslash + '?>');
      return this.stream.write(this.endline(node));
    };

    XMLStreamWriter.prototype.docType = function(node, level) {
      var child, i, len, ref;
      level || (level = 0);
      this.stream.write(this.space(level));
      this.stream.write('<!DOCTYPE ' + node.root().name);
      if (node.pubID && node.sysID) {
        this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
      } else if (node.sysID) {
        this.stream.write(' SYSTEM "' + node.sysID + '"');
      }
      if (node.children.length > 0) {
        this.stream.write(' [');
        this.stream.write(this.endline(node));
        ref = node.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          switch (false) {
            case !(child instanceof XMLDTDAttList):
              this.dtdAttList(child, level + 1);
              break;
            case !(child instanceof XMLDTDElement):
              this.dtdElement(child, level + 1);
              break;
            case !(child instanceof XMLDTDEntity):
              this.dtdEntity(child, level + 1);
              break;
            case !(child instanceof XMLDTDNotation):
              this.dtdNotation(child, level + 1);
              break;
            case !(child instanceof XMLCData):
              this.cdata(child, level + 1);
              break;
            case !(child instanceof XMLComment):
              this.comment(child, level + 1);
              break;
            case !(child instanceof XMLProcessingInstruction):
              this.processingInstruction(child, level + 1);
              break;
            default:
              throw new Error("Unknown DTD node type: " + child.constructor.name);
          }
        }
        this.stream.write(']');
      }
      this.stream.write(this.spacebeforeslash + '>');
      return this.stream.write(this.endline(node));
    };

    XMLStreamWriter.prototype.element = function(node, level) {
      var att, child, i, len, name, ref, ref1, space;
      level || (level = 0);
      space = this.space(level);
      this.stream.write(space + '<' + node.name);
      ref = node.attributes;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        att = ref[name];
        this.attribute(att);
      }
      if (node.children.length === 0 || node.children.every(function(e) {
        return e.value === '';
      })) {
        if (this.allowEmpty) {
          this.stream.write('></' + node.name + '>');
        } else {
          this.stream.write(this.spacebeforeslash + '/>');
        }
      } else if (this.pretty && node.children.length === 1 && (node.children[0].value != null)) {
        this.stream.write('>');
        this.stream.write(node.children[0].value);
        this.stream.write('</' + node.name + '>');
      } else {
        this.stream.write('>' + this.newline);
        ref1 = node.children;
        for (i = 0, len = ref1.length; i < len; i++) {
          child = ref1[i];
          switch (false) {
            case !(child instanceof XMLCData):
              this.cdata(child, level + 1);
              break;
            case !(child instanceof XMLComment):
              this.comment(child, level + 1);
              break;
            case !(child instanceof XMLElement):
              this.element(child, level + 1);
              break;
            case !(child instanceof XMLRaw):
              this.raw(child, level + 1);
              break;
            case !(child instanceof XMLText):
              this.text(child, level + 1);
              break;
            case !(child instanceof XMLProcessingInstruction):
              this.processingInstruction(child, level + 1);
              break;
            default:
              throw new Error("Unknown XML node type: " + child.constructor.name);
          }
        }
        this.stream.write(space + '</' + node.name + '>');
      }
      return this.stream.write(this.endline(node));
    };

    XMLStreamWriter.prototype.processingInstruction = function(node, level) {
      this.stream.write(this.space(level) + '<?' + node.target);
      if (node.value) {
        this.stream.write(' ' + node.value);
      }
      return this.stream.write(this.spacebeforeslash + '?>' + this.endline(node));
    };

    XMLStreamWriter.prototype.raw = function(node, level) {
      return this.stream.write(this.space(level) + node.value + this.endline(node));
    };

    XMLStreamWriter.prototype.text = function(node, level) {
      return this.stream.write(this.space(level) + node.value + this.endline(node));
    };

    XMLStreamWriter.prototype.dtdAttList = function(node, level) {
      this.stream.write(this.space(level) + '<!ATTLIST ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType);
      if (node.defaultValueType !== '#DEFAULT') {
        this.stream.write(' ' + node.defaultValueType);
      }
      if (node.defaultValue) {
        this.stream.write(' "' + node.defaultValue + '"');
      }
      return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
    };

    XMLStreamWriter.prototype.dtdElement = function(node, level) {
      this.stream.write(this.space(level) + '<!ELEMENT ' + node.name + ' ' + node.value);
      return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
    };

    XMLStreamWriter.prototype.dtdEntity = function(node, level) {
      this.stream.write(this.space(level) + '<!ENTITY');
      if (node.pe) {
        this.stream.write(' %');
      }
      this.stream.write(' ' + node.name);
      if (node.value) {
        this.stream.write(' "' + node.value + '"');
      } else {
        if (node.pubID && node.sysID) {
          this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
        } else if (node.sysID) {
          this.stream.write(' SYSTEM "' + node.sysID + '"');
        }
        if (node.nData) {
          this.stream.write(' NDATA ' + node.nData);
        }
      }
      return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
    };

    XMLStreamWriter.prototype.dtdNotation = function(node, level) {
      this.stream.write(this.space(level) + '<!NOTATION ' + node.name);
      if (node.pubID && node.sysID) {
        this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
      } else if (node.pubID) {
        this.stream.write(' PUBLIC "' + node.pubID + '"');
      } else if (node.sysID) {
        this.stream.write(' SYSTEM "' + node.sysID + '"');
      }
      return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
    };

    XMLStreamWriter.prototype.endline = function(node) {
      if (!node.isLastRootNode) {
        return this.newline;
      } else {
        return '';
      }
    };

    return XMLStreamWriter;

  })(XMLWriterBase);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLStringWriter.js":
/*!********************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLStringWriter.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLText, XMLWriterBase,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLDeclaration = __webpack_require__(/*! ./XMLDeclaration */ "./node_modules/xmlbuilder/lib/XMLDeclaration.js");

  XMLDocType = __webpack_require__(/*! ./XMLDocType */ "./node_modules/xmlbuilder/lib/XMLDocType.js");

  XMLCData = __webpack_require__(/*! ./XMLCData */ "./node_modules/xmlbuilder/lib/XMLCData.js");

  XMLComment = __webpack_require__(/*! ./XMLComment */ "./node_modules/xmlbuilder/lib/XMLComment.js");

  XMLElement = __webpack_require__(/*! ./XMLElement */ "./node_modules/xmlbuilder/lib/XMLElement.js");

  XMLRaw = __webpack_require__(/*! ./XMLRaw */ "./node_modules/xmlbuilder/lib/XMLRaw.js");

  XMLText = __webpack_require__(/*! ./XMLText */ "./node_modules/xmlbuilder/lib/XMLText.js");

  XMLProcessingInstruction = __webpack_require__(/*! ./XMLProcessingInstruction */ "./node_modules/xmlbuilder/lib/XMLProcessingInstruction.js");

  XMLDTDAttList = __webpack_require__(/*! ./XMLDTDAttList */ "./node_modules/xmlbuilder/lib/XMLDTDAttList.js");

  XMLDTDElement = __webpack_require__(/*! ./XMLDTDElement */ "./node_modules/xmlbuilder/lib/XMLDTDElement.js");

  XMLDTDEntity = __webpack_require__(/*! ./XMLDTDEntity */ "./node_modules/xmlbuilder/lib/XMLDTDEntity.js");

  XMLDTDNotation = __webpack_require__(/*! ./XMLDTDNotation */ "./node_modules/xmlbuilder/lib/XMLDTDNotation.js");

  XMLWriterBase = __webpack_require__(/*! ./XMLWriterBase */ "./node_modules/xmlbuilder/lib/XMLWriterBase.js");

  module.exports = XMLStringWriter = (function(superClass) {
    extend(XMLStringWriter, superClass);

    function XMLStringWriter(options) {
      XMLStringWriter.__super__.constructor.call(this, options);
    }

    XMLStringWriter.prototype.document = function(doc) {
      var child, i, len, r, ref;
      this.textispresent = false;
      r = '';
      ref = doc.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        r += (function() {
          switch (false) {
            case !(child instanceof XMLDeclaration):
              return this.declaration(child);
            case !(child instanceof XMLDocType):
              return this.docType(child);
            case !(child instanceof XMLComment):
              return this.comment(child);
            case !(child instanceof XMLProcessingInstruction):
              return this.processingInstruction(child);
            default:
              return this.element(child, 0);
          }
        }).call(this);
      }
      if (this.pretty && r.slice(-this.newline.length) === this.newline) {
        r = r.slice(0, -this.newline.length);
      }
      return r;
    };

    XMLStringWriter.prototype.attribute = function(att) {
      return ' ' + att.name + '="' + att.value + '"';
    };

    XMLStringWriter.prototype.cdata = function(node, level) {
      return this.space(level) + '<![CDATA[' + node.text + ']]>' + this.newline;
    };

    XMLStringWriter.prototype.comment = function(node, level) {
      return this.space(level) + '<!-- ' + node.text + ' -->' + this.newline;
    };

    XMLStringWriter.prototype.declaration = function(node, level) {
      var r;
      r = this.space(level);
      r += '<?xml version="' + node.version + '"';
      if (node.encoding != null) {
        r += ' encoding="' + node.encoding + '"';
      }
      if (node.standalone != null) {
        r += ' standalone="' + node.standalone + '"';
      }
      r += this.spacebeforeslash + '?>';
      r += this.newline;
      return r;
    };

    XMLStringWriter.prototype.docType = function(node, level) {
      var child, i, len, r, ref;
      level || (level = 0);
      r = this.space(level);
      r += '<!DOCTYPE ' + node.root().name;
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      if (node.children.length > 0) {
        r += ' [';
        r += this.newline;
        ref = node.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          r += (function() {
            switch (false) {
              case !(child instanceof XMLDTDAttList):
                return this.dtdAttList(child, level + 1);
              case !(child instanceof XMLDTDElement):
                return this.dtdElement(child, level + 1);
              case !(child instanceof XMLDTDEntity):
                return this.dtdEntity(child, level + 1);
              case !(child instanceof XMLDTDNotation):
                return this.dtdNotation(child, level + 1);
              case !(child instanceof XMLCData):
                return this.cdata(child, level + 1);
              case !(child instanceof XMLComment):
                return this.comment(child, level + 1);
              case !(child instanceof XMLProcessingInstruction):
                return this.processingInstruction(child, level + 1);
              default:
                throw new Error("Unknown DTD node type: " + child.constructor.name);
            }
          }).call(this);
        }
        r += ']';
      }
      r += this.spacebeforeslash + '>';
      r += this.newline;
      return r;
    };

    XMLStringWriter.prototype.element = function(node, level) {
      var att, child, i, j, len, len1, name, r, ref, ref1, ref2, space, textispresentwasset;
      level || (level = 0);
      textispresentwasset = false;
      if (this.textispresent) {
        this.newline = '';
        this.pretty = false;
      } else {
        this.newline = this.newlinedefault;
        this.pretty = this.prettydefault;
      }
      space = this.space(level);
      r = '';
      r += space + '<' + node.name;
      ref = node.attributes;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        att = ref[name];
        r += this.attribute(att);
      }
      if (node.children.length === 0 || node.children.every(function(e) {
        return e.value === '';
      })) {
        if (this.allowEmpty) {
          r += '></' + node.name + '>' + this.newline;
        } else {
          r += this.spacebeforeslash + '/>' + this.newline;
        }
      } else if (this.pretty && node.children.length === 1 && (node.children[0].value != null)) {
        r += '>';
        r += node.children[0].value;
        r += '</' + node.name + '>' + this.newline;
      } else {
        if (this.dontprettytextnodes) {
          ref1 = node.children;
          for (i = 0, len = ref1.length; i < len; i++) {
            child = ref1[i];
            if (child.value != null) {
              this.textispresent++;
              textispresentwasset = true;
              break;
            }
          }
        }
        if (this.textispresent) {
          this.newline = '';
          this.pretty = false;
          space = this.space(level);
        }
        r += '>' + this.newline;
        ref2 = node.children;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          child = ref2[j];
          r += (function() {
            switch (false) {
              case !(child instanceof XMLCData):
                return this.cdata(child, level + 1);
              case !(child instanceof XMLComment):
                return this.comment(child, level + 1);
              case !(child instanceof XMLElement):
                return this.element(child, level + 1);
              case !(child instanceof XMLRaw):
                return this.raw(child, level + 1);
              case !(child instanceof XMLText):
                return this.text(child, level + 1);
              case !(child instanceof XMLProcessingInstruction):
                return this.processingInstruction(child, level + 1);
              default:
                throw new Error("Unknown XML node type: " + child.constructor.name);
            }
          }).call(this);
        }
        if (textispresentwasset) {
          this.textispresent--;
        }
        if (!this.textispresent) {
          this.newline = this.newlinedefault;
          this.pretty = this.prettydefault;
        }
        r += space + '</' + node.name + '>' + this.newline;
      }
      return r;
    };

    XMLStringWriter.prototype.processingInstruction = function(node, level) {
      var r;
      r = this.space(level) + '<?' + node.target;
      if (node.value) {
        r += ' ' + node.value;
      }
      r += this.spacebeforeslash + '?>' + this.newline;
      return r;
    };

    XMLStringWriter.prototype.raw = function(node, level) {
      return this.space(level) + node.value + this.newline;
    };

    XMLStringWriter.prototype.text = function(node, level) {
      return this.space(level) + node.value + this.newline;
    };

    XMLStringWriter.prototype.dtdAttList = function(node, level) {
      var r;
      r = this.space(level) + '<!ATTLIST ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType;
      if (node.defaultValueType !== '#DEFAULT') {
        r += ' ' + node.defaultValueType;
      }
      if (node.defaultValue) {
        r += ' "' + node.defaultValue + '"';
      }
      r += this.spacebeforeslash + '>' + this.newline;
      return r;
    };

    XMLStringWriter.prototype.dtdElement = function(node, level) {
      return this.space(level) + '<!ELEMENT ' + node.name + ' ' + node.value + this.spacebeforeslash + '>' + this.newline;
    };

    XMLStringWriter.prototype.dtdEntity = function(node, level) {
      var r;
      r = this.space(level) + '<!ENTITY';
      if (node.pe) {
        r += ' %';
      }
      r += ' ' + node.name;
      if (node.value) {
        r += ' "' + node.value + '"';
      } else {
        if (node.pubID && node.sysID) {
          r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
        } else if (node.sysID) {
          r += ' SYSTEM "' + node.sysID + '"';
        }
        if (node.nData) {
          r += ' NDATA ' + node.nData;
        }
      }
      r += this.spacebeforeslash + '>' + this.newline;
      return r;
    };

    XMLStringWriter.prototype.dtdNotation = function(node, level) {
      var r;
      r = this.space(level) + '<!NOTATION ' + node.name;
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.pubID) {
        r += ' PUBLIC "' + node.pubID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      r += this.spacebeforeslash + '>' + this.newline;
      return r;
    };

    XMLStringWriter.prototype.openNode = function(node, level) {
      var att, name, r, ref;
      level || (level = 0);
      if (node instanceof XMLElement) {
        r = this.space(level) + '<' + node.name;
        ref = node.attributes;
        for (name in ref) {
          if (!hasProp.call(ref, name)) continue;
          att = ref[name];
          r += this.attribute(att);
        }
        r += (node.children ? '>' : '/>') + this.newline;
        return r;
      } else {
        r = this.space(level) + '<!DOCTYPE ' + node.rootNodeName;
        if (node.pubID && node.sysID) {
          r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
        } else if (node.sysID) {
          r += ' SYSTEM "' + node.sysID + '"';
        }
        r += (node.children ? ' [' : '>') + this.newline;
        return r;
      }
    };

    XMLStringWriter.prototype.closeNode = function(node, level) {
      level || (level = 0);
      switch (false) {
        case !(node instanceof XMLElement):
          return this.space(level) + '</' + node.name + '>' + this.newline;
        case !(node instanceof XMLDocType):
          return this.space(level) + ']>' + this.newline;
      }
    };

    return XMLStringWriter;

  })(XMLWriterBase);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLStringifier.js":
/*!*******************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLStringifier.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLStringifier,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    hasProp = {}.hasOwnProperty;

  module.exports = XMLStringifier = (function() {
    function XMLStringifier(options) {
      this.assertLegalChar = bind(this.assertLegalChar, this);
      var key, ref, value;
      options || (options = {});
      this.noDoubleEncoding = options.noDoubleEncoding;
      ref = options.stringify || {};
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this[key] = value;
      }
    }

    XMLStringifier.prototype.eleName = function(val) {
      val = '' + val || '';
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.eleText = function(val) {
      val = '' + val || '';
      return this.assertLegalChar(this.elEscape(val));
    };

    XMLStringifier.prototype.cdata = function(val) {
      val = '' + val || '';
      val = val.replace(']]>', ']]]]><![CDATA[>');
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.comment = function(val) {
      val = '' + val || '';
      if (val.match(/--/)) {
        throw new Error("Comment text cannot contain double-hypen: " + val);
      }
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.raw = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.attName = function(val) {
      return val = '' + val || '';
    };

    XMLStringifier.prototype.attValue = function(val) {
      val = '' + val || '';
      return this.attEscape(val);
    };

    XMLStringifier.prototype.insTarget = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.insValue = function(val) {
      val = '' + val || '';
      if (val.match(/\?>/)) {
        throw new Error("Invalid processing instruction value: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlVersion = function(val) {
      val = '' + val || '';
      if (!val.match(/1\.[0-9]+/)) {
        throw new Error("Invalid version number: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlEncoding = function(val) {
      val = '' + val || '';
      if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
        throw new Error("Invalid encoding: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlStandalone = function(val) {
      if (val) {
        return "yes";
      } else {
        return "no";
      }
    };

    XMLStringifier.prototype.dtdPubID = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdSysID = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdElementValue = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdAttType = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdAttDefault = function(val) {
      if (val != null) {
        return '' + val || '';
      } else {
        return val;
      }
    };

    XMLStringifier.prototype.dtdEntityValue = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.dtdNData = function(val) {
      return '' + val || '';
    };

    XMLStringifier.prototype.convertAttKey = '@';

    XMLStringifier.prototype.convertPIKey = '?';

    XMLStringifier.prototype.convertTextKey = '#text';

    XMLStringifier.prototype.convertCDataKey = '#cdata';

    XMLStringifier.prototype.convertCommentKey = '#comment';

    XMLStringifier.prototype.convertRawKey = '#raw';

    XMLStringifier.prototype.assertLegalChar = function(str) {
      var res;
      res = str.match(/[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/);
      if (res) {
        throw new Error("Invalid character in string: " + str + " at index " + res.index);
      }
      return str;
    };

    XMLStringifier.prototype.elEscape = function(str) {
      var ampregex;
      ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
      return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
    };

    XMLStringifier.prototype.attEscape = function(str) {
      var ampregex;
      ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
      return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
    };

    return XMLStringifier;

  })();

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLText.js":
/*!************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLText.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLNode, XMLText,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(/*! ./XMLNode */ "./node_modules/xmlbuilder/lib/XMLNode.js");

  module.exports = XMLText = (function(superClass) {
    extend(XMLText, superClass);

    function XMLText(parent, text) {
      XMLText.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing element text");
      }
      this.value = this.stringify.eleText(text);
    }

    XMLText.prototype.clone = function() {
      return Object.create(this);
    };

    XMLText.prototype.toString = function(options) {
      return this.options.writer.set(options).text(this);
    };

    return XMLText;

  })(XMLNode);

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/XMLWriterBase.js":
/*!******************************************************!*\
  !*** ./node_modules/xmlbuilder/lib/XMLWriterBase.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLWriterBase,
    hasProp = {}.hasOwnProperty;

  module.exports = XMLWriterBase = (function() {
    function XMLWriterBase(options) {
      var key, ref, ref1, ref2, ref3, ref4, ref5, ref6, value;
      options || (options = {});
      this.pretty = options.pretty || false;
      this.allowEmpty = (ref = options.allowEmpty) != null ? ref : false;
      if (this.pretty) {
        this.indent = (ref1 = options.indent) != null ? ref1 : '  ';
        this.newline = (ref2 = options.newline) != null ? ref2 : '\n';
        this.offset = (ref3 = options.offset) != null ? ref3 : 0;
        this.dontprettytextnodes = (ref4 = options.dontprettytextnodes) != null ? ref4 : 0;
      } else {
        this.indent = '';
        this.newline = '';
        this.offset = 0;
        this.dontprettytextnodes = 0;
      }
      this.spacebeforeslash = (ref5 = options.spacebeforeslash) != null ? ref5 : '';
      if (this.spacebeforeslash === true) {
        this.spacebeforeslash = ' ';
      }
      this.newlinedefault = this.newline;
      this.prettydefault = this.pretty;
      ref6 = options.writer || {};
      for (key in ref6) {
        if (!hasProp.call(ref6, key)) continue;
        value = ref6[key];
        this[key] = value;
      }
    }

    XMLWriterBase.prototype.set = function(options) {
      var key, ref, value;
      options || (options = {});
      if ("pretty" in options) {
        this.pretty = options.pretty;
      }
      if ("allowEmpty" in options) {
        this.allowEmpty = options.allowEmpty;
      }
      if (this.pretty) {
        this.indent = "indent" in options ? options.indent : '  ';
        this.newline = "newline" in options ? options.newline : '\n';
        this.offset = "offset" in options ? options.offset : 0;
        this.dontprettytextnodes = "dontprettytextnodes" in options ? options.dontprettytextnodes : 0;
      } else {
        this.indent = '';
        this.newline = '';
        this.offset = 0;
        this.dontprettytextnodes = 0;
      }
      this.spacebeforeslash = "spacebeforeslash" in options ? options.spacebeforeslash : '';
      if (this.spacebeforeslash === true) {
        this.spacebeforeslash = ' ';
      }
      this.newlinedefault = this.newline;
      this.prettydefault = this.pretty;
      ref = options.writer || {};
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this[key] = value;
      }
      return this;
    };

    XMLWriterBase.prototype.space = function(level) {
      var indent;
      if (this.pretty) {
        indent = (level || 0) + this.offset + 1;
        if (indent > 0) {
          return new Array(indent).join(this.indent);
        } else {
          return '';
        }
      } else {
        return '';
      }
    };

    return XMLWriterBase;

  })();

}).call(this);


/***/ }),

/***/ "./node_modules/xmlbuilder/lib/index.js":
/*!**********************************************!*\
  !*** ./node_modules/xmlbuilder/lib/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;

  ref = __webpack_require__(/*! ./Utility */ "./node_modules/xmlbuilder/lib/Utility.js"), assign = ref.assign, isFunction = ref.isFunction;

  XMLDocument = __webpack_require__(/*! ./XMLDocument */ "./node_modules/xmlbuilder/lib/XMLDocument.js");

  XMLDocumentCB = __webpack_require__(/*! ./XMLDocumentCB */ "./node_modules/xmlbuilder/lib/XMLDocumentCB.js");

  XMLStringWriter = __webpack_require__(/*! ./XMLStringWriter */ "./node_modules/xmlbuilder/lib/XMLStringWriter.js");

  XMLStreamWriter = __webpack_require__(/*! ./XMLStreamWriter */ "./node_modules/xmlbuilder/lib/XMLStreamWriter.js");

  module.exports.create = function(name, xmldec, doctype, options) {
    var doc, root;
    if (name == null) {
      throw new Error("Root element needs a name");
    }
    options = assign({}, xmldec, doctype, options);
    doc = new XMLDocument(options);
    root = doc.element(name);
    if (!options.headless) {
      doc.declaration(options);
      if ((options.pubID != null) || (options.sysID != null)) {
        doc.doctype(options);
      }
    }
    return root;
  };

  module.exports.begin = function(options, onData, onEnd) {
    var ref1;
    if (isFunction(options)) {
      ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
      options = {};
    }
    if (onData) {
      return new XMLDocumentCB(options, onData, onEnd);
    } else {
      return new XMLDocument(options);
    }
  };

  module.exports.stringWriter = function(options) {
    return new XMLStringWriter(options);
  };

  module.exports.streamWriter = function(stream, options) {
    return new XMLStreamWriter(stream, options);
  };

}).call(this);


/***/ }),

/***/ "./src/commands/builders/SObjectFieldBuilders.ts":
/*!*******************************************************!*\
  !*** ./src/commands/builders/SObjectFieldBuilders.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SObjectFieldTemplates = __webpack_require__(/*! ../metadatamanagement/sObjects/structures/SObjectFieldTemplates */ "./src/commands/metadatamanagement/sObjects/structures/SObjectFieldTemplates.ts");
const Prompts_1 = __webpack_require__(/*! ./prompts/Prompts */ "./src/commands/builders/prompts/Prompts.ts");
function checkboxBuilder(forbiddenApiNames, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let label = yield Prompts_1.default.fields.label();
                let apiName = yield Prompts_1.default.fields.apiName(label, forbiddenApiNames);
                let required = yield Prompts_1.default.fields.isRequired();
                let defaultValue = yield Prompts_1.default.fields.defaultValue([{ label: 'False', value: false }, { label: 'True', value: true }]);
                resolve(new SObjectFieldTemplates.Checkbox(apiName, label, required, defaultValue));
            }
            catch (err) {
                reject('Field Creation Aborted');
            }
        }));
    });
}
function textBuilder(forbiddenApiNames, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let label = yield Prompts_1.default.fields.label();
                let apiName = yield Prompts_1.default.fields.apiName(label, forbiddenApiNames);
                let length = yield Prompts_1.default.fields.stringLength(1, 255, 255);
                let required = yield Prompts_1.default.fields.isRequired();
                let externalId = yield Prompts_1.default.fields.isExternalId();
                let unique = yield Prompts_1.default.fields.isUnique();
                resolve(new SObjectFieldTemplates.Text(apiName, label, externalId, required, length, unique));
            }
            catch (err) {
                reject('Field Creation Aborted');
            }
        }));
    });
}
function emailBuilder(forbiddenApiNames, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let label = yield Prompts_1.default.fields.label();
                let apiName = yield Prompts_1.default.fields.apiName(label, forbiddenApiNames);
                let required = yield Prompts_1.default.fields.isRequired();
                let externalId = yield Prompts_1.default.fields.isExternalId();
                let unique = yield Prompts_1.default.fields.isUnique();
                resolve(new SObjectFieldTemplates.Email(apiName, label, externalId, required, unique));
            }
            catch (err) {
                reject('Field Creation Aborted');
            }
        }));
    });
}
function dateBuilder(forbiddenApiNames, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let label = yield Prompts_1.default.fields.label();
                let apiName = yield Prompts_1.default.fields.apiName(label, forbiddenApiNames);
                let required = yield Prompts_1.default.fields.isRequired();
                let externalId = yield Prompts_1.default.fields.isExternalId();
                resolve(new SObjectFieldTemplates.Date(apiName, label, externalId, required));
            }
            catch (err) {
                reject('Field Creation Aborted');
            }
        }));
    });
}
function datetimeBuilder(forbiddenApiNames, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let label = yield Prompts_1.default.fields.label();
                let apiName = yield Prompts_1.default.fields.apiName(label, forbiddenApiNames);
                let required = yield Prompts_1.default.fields.isRequired();
                let externalId = yield Prompts_1.default.fields.isExternalId();
                resolve(new SObjectFieldTemplates.DateTime(apiName, label, externalId, required));
            }
            catch (err) {
                reject('Field Creation Aborted');
            }
        }));
    });
}
function phoneBuilder(forbiddenApiNames, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let label = yield Prompts_1.default.fields.label();
                let apiName = yield Prompts_1.default.fields.apiName(label, forbiddenApiNames);
                let required = yield Prompts_1.default.fields.isRequired();
                let externalId = yield Prompts_1.default.fields.isExternalId();
                resolve(new SObjectFieldTemplates.Phone(apiName, label, externalId, required));
            }
            catch (err) {
                reject('Field Creation Aborted');
            }
        }));
    });
}
function textAreaBuilder(forbiddenApiNames, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let label = yield Prompts_1.default.fields.label();
                let apiName = yield Prompts_1.default.fields.apiName(label, forbiddenApiNames);
                let required = yield Prompts_1.default.fields.isRequired();
                let externalId = false;
                resolve(new SObjectFieldTemplates.TextArea(apiName, label, externalId, required));
            }
            catch (err) {
                reject('Field Creation Aborted');
            }
        }));
    });
}
function longTextAreaBuilder(forbiddenApiNames, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let label = yield Prompts_1.default.fields.label();
                let apiName = yield Prompts_1.default.fields.apiName(label, forbiddenApiNames);
                let length = yield Prompts_1.default.fields.stringLength(256, 131072, 32768);
                let required = yield Prompts_1.default.fields.isRequired();
                let externalId = false;
                resolve(new SObjectFieldTemplates.LongTextArea(apiName, label, externalId, required, length));
            }
            catch (err) {
                reject('Field Creation Aborted');
            }
        }));
    });
}
function numberBuilder(forbiddenApiNames, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let label = yield Prompts_1.default.fields.label();
                let apiName = yield Prompts_1.default.fields.apiName(label, forbiddenApiNames);
                let [precision, scale] = yield Prompts_1.default.fields.precisionAndScale();
                let required = yield Prompts_1.default.fields.isRequired();
                let externalId = yield Prompts_1.default.fields.isExternalId();
                let unique = yield Prompts_1.default.fields.isUnique();
                resolve(new SObjectFieldTemplates.Number(apiName, label, externalId, required, unique, precision, scale));
            }
            catch (err) {
                reject('Field Creation Aborted');
            }
        }));
    });
}
function lookupBuilder(forbiddenApiNames, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let label = yield Prompts_1.default.fields.label();
                let apiName = yield Prompts_1.default.fields.apiName(label, forbiddenApiNames);
                let required = yield Prompts_1.default.fields.isRequired();
                let referenceTo = yield Prompts_1.default.fields.lookupTarget(availableSObjectsList);
                let relationshipLabel = yield Prompts_1.default.fields.relationshipLabel();
                let relationshipName = yield Prompts_1.default.fields.relationshipApiName(relationshipLabel);
                resolve(new SObjectFieldTemplates.Lookup(apiName, label, required, referenceTo, relationshipLabel, relationshipName));
            }
            catch (err) {
                reject('Field Creation Aborted');
            }
        }));
    });
}
exports.default = { Checkbox: checkboxBuilder, Text: textBuilder, Email: emailBuilder, Date: dateBuilder, DateTime: datetimeBuilder, Phone: phoneBuilder, TextArea: textAreaBuilder, LongTextArea: longTextAreaBuilder, Number: numberBuilder, Lookup: lookupBuilder };


/***/ }),

/***/ "./src/commands/builders/prompts/Prompts.ts":
/*!**************************************************!*\
  !*** ./src/commands/builders/prompts/Prompts.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Fields_1 = __webpack_require__(/*! ./types/Fields */ "./src/commands/builders/prompts/types/Fields.ts");
const Profiles_1 = __webpack_require__(/*! ./types/Profiles */ "./src/commands/builders/prompts/types/Profiles.ts");
const SObjects_1 = __webpack_require__(/*! ./types/SObjects */ "./src/commands/builders/prompts/types/SObjects.ts");
const Utils_1 = __webpack_require__(/*! ./types/Utils */ "./src/commands/builders/prompts/types/Utils.ts");
exports.default = {
    fields: Fields_1.default,
    profiles: Profiles_1.default,
    sObjects: SObjects_1.default,
    utils: Utils_1.default
};


/***/ }),

/***/ "./src/commands/builders/prompts/types/Fields.ts":
/*!*******************************************************!*\
  !*** ./src/commands/builders/prompts/types/Fields.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
function promptForFieldLabel() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const fieldName = yield vscode.window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: 'Insert Field Label',
                validateInput: (value) => {
                    return value.length > 40 || value.length < 1 ? 'Field Labels cannot exceed 40 characters' : undefined;
                }
            });
            fieldName ? resolve(fieldName) : reject('Field Creation Aborted');
        }));
    });
}
function promptForRequiredField() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const required = yield vscode.window.showQuickPick([{ label: 'False', value: false }, { label: 'True', value: true }], { ignoreFocusOut: true, placeHolder: 'Is the field Required?' });
            required ? resolve(required.value) : reject('Field Creation Aborted');
        }));
    });
}
function promptForFieldApiName(label, forbiddenApiNames) {
    return __awaiter(this, void 0, void 0, function* () {
        //Removing spaces and accented characters and appending __c
        const escaped = label.normalize('NFD').replace(/[\u0300-\u036f]|\s*/g, '') + '__c';
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const fieldName = yield vscode.window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: 'Insert Field ApiName',
                value: escaped,
                valueSelection: [0, escaped.length - 3],
                prompt: 'Only normal letters and underscores are allowed. Must end with \'__c\'',
                validateInput: (value) => {
                    if (!(/^[[a-zA-Z0-9_]{1,40}(?<!_)__c$/.test(value))) {
                        return 'Invalid Api Name. Must only use Uppercase or Lowercase Letters, numbers, underscores (\'_\') and terminate with \'__c\'.';
                    }
                    if (forbiddenApiNames.indexOf(value) !== -1) {
                        return 'Another Field with the same Api Name already exists on the object.';
                    }
                    return undefined;
                }
            });
            fieldName ? resolve(fieldName) : reject('Field Creation Aborted');
        }));
    });
}
function promptForStringLength(minLength, maxLength, defaultValue) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(`^[0-9]{${minLength.toString().length},${maxLength.toString().length}}$`);
            const fieldLength = yield vscode.window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: 'Insert Field Maximum Length',
                value: defaultValue.toString(),
                valueSelection: [0, defaultValue.toString().length],
                prompt: `Insert a number between ${minLength} and ${maxLength}`,
                validateInput: (value) => {
                    if (!(regex.test(value)) || Number(value) > maxLength || Number(value) < minLength) {
                        return `Only a number between ${minLength} and ${maxLength} is allowed.`;
                    }
                    return undefined;
                }
            });
            fieldLength ? resolve(fieldLength) : reject('Field Creation Aborted');
        }));
    });
}
function promptForExternalIdField() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const isExternalId = yield vscode.window.showQuickPick([{ label: 'False', value: false }, { label: 'True', value: true }], { ignoreFocusOut: true, placeHolder: 'Is the field an External ID?' });
            isExternalId ? resolve(isExternalId.value) : reject('Field Creation Aborted');
        }));
    });
}
function promptForUniqueField() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const isUnique = yield vscode.window.showQuickPick([{ label: 'False', value: false }, { label: 'True', value: true }], { ignoreFocusOut: true, placeHolder: 'Is the field Unique?' });
            isUnique ? resolve(isUnique.value) : reject('Field Creation Aborted');
        }));
    });
}
function promptForDefaultValue(possibleValues) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const defaultValue = yield vscode.window.showQuickPick(possibleValues, { ignoreFocusOut: true, placeHolder: 'What\s the default value of the field?' });
            defaultValue ? resolve(defaultValue.value) : reject('Field Creation Aborted');
        }));
    });
}
function promptForPrecisionAndScale() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(`^[0-9]{1,2},[0-9]{1,2}$`);
            const precisionAndScale = yield vscode.window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: 'Insert Field Precision and Scale, separated by comma',
                value: '18,0',
                valueSelection: [0, 2],
                prompt: 'Format is: [Number of digits to the left of the decimal point],[Number of digits to the right of the decimal point]',
                validateInput: (value) => {
                    let [precision, scale] = value.split(',');
                    if (!(regex.test(value)) || Number(precision) + Number(scale) > 18) {
                        return 'Up to 18 digits are allowed, divided amongst digits to the left of the decimal point and digits to its right, in the format [digits to the left],[digits to the right]. i.e: 16,2';
                    }
                    return undefined;
                }
            });
            if (precisionAndScale) {
                let [precision, scale] = precisionAndScale.split(',');
                resolve([Number(precision), Number(scale)]);
            }
            else {
                reject('Field Creation Aborted');
            }
        }));
    });
}
function promptForLookupTarget(availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const pickedSObj = yield vscode.window.showQuickPick(availableSObjectsList.map(obj => {
                return { label: obj, value: obj };
            }), { ignoreFocusOut: true, placeHolder: 'Relationship target SObject?' });
            pickedSObj ? resolve(pickedSObj.value) : reject('Field Creation Aborted');
        }));
    });
}
function promptForRelationshipLabel() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const relLabel = yield vscode.window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: 'Insert Child Relationship Label',
                validateInput: (value) => {
                    return value.length > 40 || value.length < 1 ? 'Child Relationship Label cannot exceed 40 characters' : undefined;
                }
            });
            relLabel ? resolve(relLabel) : reject('Field Creation Aborted');
        }));
    });
}
function promptForRelationshipApiName(label) {
    return __awaiter(this, void 0, void 0, function* () {
        const escaped = label.normalize('NFD').replace(/[\u0300-\u036f]|\s*/g, '');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const relApiName = yield vscode.window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: 'Insert Child Relationship Api Name',
                value: escaped,
                valueSelection: [0, escaped.length - 1],
                prompt: 'Only normal letters and underscores are allowed.',
                validateInput: (value) => {
                    if (!(/^[[a-zA-Z0-9_]{3,40}(?<!_)$/.test(value))) {
                        return 'Invalid Api Name. Must only use Uppercase or Lowercase Letters, numbers, underscores (\'_\') and cannot exceed 40 characters';
                    }
                    return undefined;
                }
            });
            relApiName ? resolve(relApiName) : reject('Field Creation Aborted');
        }));
    });
}
exports.default = {
    defaultValue: promptForDefaultValue,
    isUnique: promptForUniqueField,
    isExternalId: promptForExternalIdField,
    stringLength: promptForStringLength,
    apiName: promptForFieldApiName,
    isRequired: promptForRequiredField,
    label: promptForFieldLabel,
    precisionAndScale: promptForPrecisionAndScale,
    lookupTarget: promptForLookupTarget,
    relationshipLabel: promptForRelationshipLabel,
    relationshipApiName: promptForRelationshipApiName
};


/***/ }),

/***/ "./src/commands/builders/prompts/types/Profiles.ts":
/*!*********************************************************!*\
  !*** ./src/commands/builders/prompts/types/Profiles.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const ProfileUserPermission_1 = __webpack_require__(/*! ../../../metadatamanagement/profiles/structures/ProfileUserPermission */ "./src/commands/metadatamanagement/profiles/structures/ProfileUserPermission.ts");
function pickOne(profiles) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield vscode.window.showQuickPick(profiles, { ignoreFocusOut: true, placeHolder: 'Select the Profile you want to define Apex Class Access' });
            if (res !== undefined) {
                resolve(res);
            }
            else {
                reject('Profiles Configuration Aborted');
            }
        }));
    });
}
function pickMany(profiles, preselected = []) {
    return __awaiter(this, void 0, void 0, function* () {
        let selected = preselected || [];
        const profilesOptions = profiles.map(prof => {
            return Object.assign({}, prof, { picked: selected.includes(prof.label) });
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield vscode.window.showQuickPick(profilesOptions, { ignoreFocusOut: true, placeHolder: 'Select all Profiles you want to add fields visibility after creation by default.', canPickMany: true });
            if (res !== undefined) {
                res.forEach((element) => {
                    delete element.picked;
                });
                resolve(res);
            }
            else {
                reject('Profiles Configuration Aborted');
            }
        }));
    });
}
function pickUserPermission() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield vscode.window.showQuickPick(Object.keys(ProfileUserPermission_1.default), { ignoreFocusOut: true, placeHolder: 'Select the User Permission you want to check on all profiles' });
            if (res !== undefined) {
                resolve(res);
            }
            else {
                reject('User Permission choice Aborted');
            }
        }));
    });
}
exports.default = {
    pickOne,
    pickMany,
    pickUserPermission
};


/***/ }),

/***/ "./src/commands/builders/prompts/types/SObjects.ts":
/*!*********************************************************!*\
  !*** ./src/commands/builders/prompts/types/SObjects.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
function pickSObjectType(sObjectDefinitions) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield vscode.window.showQuickPick(sObjectDefinitions, { ignoreFocusOut: true, placeHolder: 'Select an SObject Type' });
            if (res !== undefined) {
                resolve(res);
            }
            else {
                reject('SObject Selection Aborted');
            }
        }));
    });
}
exports.default = {
    pickOne: pickSObjectType
};


/***/ }),

/***/ "./src/commands/builders/prompts/types/Utils.ts":
/*!******************************************************!*\
  !*** ./src/commands/builders/prompts/types/Utils.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
function askConfirmation() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield vscode.window.showQuickPick([{ label: 'Yes', value: true }, { label: 'No', value: false }], { ignoreFocusOut: true, placeHolder: 'Are you sure?' });
            confirmed ? resolve(confirmed.value) : reject('Operation Aborted');
        }));
    });
}
exports.default = {
    confirmation: askConfirmation
};


/***/ }),

/***/ "./src/commands/configure-cross-profile-user-permission.ts":
/*!*****************************************************************!*\
  !*** ./src/commands/configure-cross-profile-user-permission.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const ProfileFilesManager_1 = __webpack_require__(/*! ./metadatamanagement/profiles/ProfileFilesManager */ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts");
const Prompts_1 = __webpack_require__(/*! ./builders/prompts/Prompts */ "./src/commands/builders/prompts/Prompts.ts");
const monitor_1 = __webpack_require__(/*! ../monitoring/monitor */ "./src/monitoring/monitor.ts");
function configureProfilesForPermission(profileMetas, permission) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = profileMetas.map(prof => {
            let picked = false;
            let found = undefined;
            if (prof.meta.Profile.userPermissions) {
                found = prof.meta.Profile.userPermissions.find((perm) => {
                    return perm.name === permission;
                });
                if (found && found.enabled) {
                    picked = true;
                }
            }
            return {
                label: prof.name,
                picked,
                description: `(${picked ? 'Enabled on profile' : (found ? 'Disabled on profile' : 'Not in profile')})`
            };
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield vscode.window.showQuickPick(options, { ignoreFocusOut: true, placeHolder: `Select all Profiles you want to enable permission ${permission}.`, canPickMany: true });
            if (res !== undefined) {
                resolve(res.map((el) => el.label));
            }
            else {
                reject('Profiles Configuration Aborted');
            }
        }));
    });
}
/**
 * The behaviour is: we check the files and pre-select the enabled ones.
 * Then we show the user the entire list and prompt for selection
 * In the end, we turn off all the permissions already contained in the profile metadata file,
 * turning then on the selected ones and adding the missing ones
 * No disabled new permission is added
 */
function configureProfilesUserPermission() {
    return __awaiter(this, void 0, void 0, function* () {
        monitor_1.default.getInstance().sendEvent('configureProfilesUserPermission');
        try {
            const permission = yield Prompts_1.default.profiles.pickUserPermission();
            const profiles = ProfileFilesManager_1.default.getObjectsFromMetaData();
            const unpackedProfileMetas = yield Promise.all(profiles.map((prof) => __awaiter(this, void 0, void 0, function* () {
                return {
                    name: prof.label,
                    meta: yield ProfileFilesManager_1.default.readProfileDefinitionFile(prof)
                };
            })));
            const selectedProfiles = yield configureProfilesForPermission(unpackedProfileMetas, permission);
            yield Promise.all(profiles.map((prof) => __awaiter(this, void 0, void 0, function* () {
                yield ProfileFilesManager_1.default.updateProfileSinglePermission(prof, permission, selectedProfiles.includes(prof.label));
            })));
            vscode.window.showInformationMessage(`Updated user permissions for ${permission} on all profiles`);
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
            monitor_1.default.getInstance().sendError('configureProfilesUserPermission', { message: err.message, name: err.name, stackTrace: err.stack });
            console.log(err);
        }
    });
}
exports.default = configureProfilesUserPermission;


/***/ }),

/***/ "./src/commands/configure-default-fields-profiles.ts":
/*!***********************************************************!*\
  !*** ./src/commands/configure-default-fields-profiles.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_manager_1 = __webpack_require__(/*! ../config/config-manager */ "./src/config/config-manager.ts");
const vscode = __webpack_require__(/*! vscode */ "vscode");
const ProfileFilesManager_1 = __webpack_require__(/*! ./metadatamanagement/profiles/ProfileFilesManager */ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts");
const Prompts_1 = __webpack_require__(/*! ./builders/prompts/Prompts */ "./src/commands/builders/prompts/Prompts.ts");
const monitor_1 = __webpack_require__(/*! ../monitoring/monitor */ "./src/monitoring/monitor.ts");
function configureDefaultFieldsProfiles() {
    return __awaiter(this, void 0, void 0, function* () {
        monitor_1.default.getInstance().sendEvent('configureDefaultFieldsProfiles');
        try {
            const profiles = ProfileFilesManager_1.default.getObjectsFromMetaData();
            let preselected = [];
            if (config_manager_1.default.getInstance().getConfig().defaultProfiles !== undefined) {
                let stored = config_manager_1.default.getInstance().getConfig().defaultProfiles || [];
                preselected = stored.map(el => el.label);
            }
            const selectedProfiles = yield Prompts_1.default.profiles.pickMany(profiles, preselected);
            config_manager_1.default.getInstance().getConfig().defaultProfiles = selectedProfiles;
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
            monitor_1.default.getInstance().sendError('configureDefaultFieldsProfiles', { message: err.message, name: err.name, stackTrace: err.stack });
            console.log(err);
        }
    });
}
exports.default = configureDefaultFieldsProfiles;


/***/ }),

/***/ "./src/commands/configure-profiles-apex-classes.ts":
/*!*********************************************************!*\
  !*** ./src/commands/configure-profiles-apex-classes.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const ProfileFilesManager_1 = __webpack_require__(/*! ./metadatamanagement/profiles/ProfileFilesManager */ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts");
const apexClassesFileManager_1 = __webpack_require__(/*! ./metadatamanagement/apexClasses/apexClassesFileManager */ "./src/commands/metadatamanagement/apexClasses/apexClassesFileManager.ts");
const ProfileFilesManager_2 = __webpack_require__(/*! ./metadatamanagement/profiles/ProfileFilesManager */ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts");
const Prompts_1 = __webpack_require__(/*! ./builders/prompts/Prompts */ "./src/commands/builders/prompts/Prompts.ts");
const monitor_1 = __webpack_require__(/*! ../monitoring/monitor */ "./src/monitoring/monitor.ts");
function configureClassAccessForProfile(profile, classes, preselectedClasses) {
    return __awaiter(this, void 0, void 0, function* () {
        const classesOptions = classes.map(cls => {
            return Object.assign({}, cls, { picked: preselectedClasses.includes(cls.label) });
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield vscode.window.showQuickPick(classesOptions, { ignoreFocusOut: true, placeHolder: `Select all Apex Classes you want to add access to profile ${profile}.`, canPickMany: true });
            if (res !== undefined) {
                // res.forEach((element: { picked: boolean }) => {
                //   delete element.picked
                // })
                resolve(res);
            }
            else {
                reject('Profiles Configuration Aborted');
            }
        }));
    });
}
function configureProfilesApexClasses() {
    return __awaiter(this, void 0, void 0, function* () {
        monitor_1.default.getInstance().sendEvent('configureProfilesApexClasses');
        try {
            const profiles = ProfileFilesManager_1.default.getObjectsFromMetaData();
            const selectedProfile = yield Prompts_1.default.profiles.pickOne(profiles);
            const unpackedProfile = yield ProfileFilesManager_1.default.readProfileDefinitionFile(selectedProfile);
            const availableApexClasses = yield apexClassesFileManager_1.default.getObjectsFromMetaData();
            const selectedApexClasses = yield configureClassAccessForProfile(selectedProfile.label, availableApexClasses, unpackedProfile.Profile.classAccesses.filter((cls) => cls.enabled).map((classAccess) => classAccess.apexClass));
            const selectedApexClassesNames = selectedApexClasses.map((cls) => cls.label);
            ProfileFilesManager_2.default.updateProfilesApexClassesAccess(selectedProfile, selectedApexClassesNames);
            vscode.window.showInformationMessage(`Updated classes access on profile ${selectedProfile.label}`);
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
            monitor_1.default.getInstance().sendError('configureProfilesApexClasses', { message: err.message, name: err.name, stackTrace: err.stack });
            console.log(err);
        }
    });
}
exports.default = configureProfilesApexClasses;


/***/ }),

/***/ "./src/commands/configure-profiles-apex-pages.ts":
/*!*******************************************************!*\
  !*** ./src/commands/configure-profiles-apex-pages.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const ProfileFilesManager_1 = __webpack_require__(/*! ./metadatamanagement/profiles/ProfileFilesManager */ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts");
const apexPagesFileManager_1 = __webpack_require__(/*! ./metadatamanagement/apexPages/apexPagesFileManager */ "./src/commands/metadatamanagement/apexPages/apexPagesFileManager.ts");
const ProfileFilesManager_2 = __webpack_require__(/*! ./metadatamanagement/profiles/ProfileFilesManager */ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts");
const Prompts_1 = __webpack_require__(/*! ./builders/prompts/Prompts */ "./src/commands/builders/prompts/Prompts.ts");
const monitor_1 = __webpack_require__(/*! ../monitoring/monitor */ "./src/monitoring/monitor.ts");
function configureClassAccessForProfile(profile, classes, preselectedPages) {
    return __awaiter(this, void 0, void 0, function* () {
        const pagesOptions = classes.map(cls => {
            return Object.assign({}, cls, { picked: preselectedPages.includes(cls.label) });
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield vscode.window.showQuickPick(pagesOptions, { ignoreFocusOut: true, placeHolder: `Select all Apex Classes you want to add access to profile ${profile}.`, canPickMany: true });
            if (res !== undefined) {
                // res.forEach((element: { picked: boolean }) => {
                //   delete element.picked
                // })
                resolve(res);
            }
            else {
                reject('Profiles Configuration Aborted');
            }
        }));
    });
}
function configureProfilesApexPages() {
    return __awaiter(this, void 0, void 0, function* () {
        monitor_1.default.getInstance().sendEvent('configureProfilesApexPages');
        try {
            const profiles = ProfileFilesManager_1.default.getObjectsFromMetaData();
            const selectedProfile = yield Prompts_1.default.profiles.pickOne(profiles);
            const unpackedProfile = yield ProfileFilesManager_1.default.readProfileDefinitionFile(selectedProfile);
            const availableApexPages = yield apexPagesFileManager_1.default.getObjectsFromMetaData();
            const selectedApexPages = yield configureClassAccessForProfile(selectedProfile.label, availableApexPages, unpackedProfile.Profile.pageAccesses.filter((cls) => cls.enabled).map((pageAccess) => pageAccess.apexPage));
            const selectedApexPagesNames = selectedApexPages.map((page) => page.label);
            ProfileFilesManager_2.default.updateProfilesApexPagesAccess(selectedProfile, selectedApexPagesNames);
            vscode.window.showInformationMessage(`Updated Visualforce pages access on profile ${selectedProfile.label}`);
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
            monitor_1.default.getInstance().sendError('configureProfilesApexPages', { message: err.message, name: err.name, stackTrace: err.stack });
            console.log(err);
        }
    });
}
exports.default = configureProfilesApexPages;


/***/ }),

/***/ "./src/commands/configure-profiles-fls.ts":
/*!************************************************!*\
  !*** ./src/commands/configure-profiles-fls.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const ProfileFilesManager_1 = __webpack_require__(/*! ./metadatamanagement/profiles/ProfileFilesManager */ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts");
const ProfileFilesManager_2 = __webpack_require__(/*! ./metadatamanagement/profiles/ProfileFilesManager */ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts");
const Prompts_1 = __webpack_require__(/*! ./builders/prompts/Prompts */ "./src/commands/builders/prompts/Prompts.ts");
const SObjectFilesManager_1 = __webpack_require__(/*! ./metadatamanagement/sObjects/SObjectFilesManager */ "./src/commands/metadatamanagement/sObjects/SObjectFilesManager.ts");
const SObjectType_1 = __webpack_require__(/*! ./metadatamanagement/sObjects/structures/SObjectType */ "./src/commands/metadatamanagement/sObjects/structures/SObjectType.ts");
const AccessType_1 = __webpack_require__(/*! ./metadatamanagement/profiles/structures/AccessType */ "./src/commands/metadatamanagement/profiles/structures/AccessType.ts");
const monitor_1 = __webpack_require__(/*! ../monitoring/monitor */ "./src/monitoring/monitor.ts");
function configureFLSForProfileAndSObject(profileName, sObjectName, objectDefinition, unpackedProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (objectDefinition.CustomObject.fields) {
                const filteredSelectedObjFields = objectDefinition.CustomObject.fields.filter((field) => {
                    return field.fullName.endsWith('__c') && !field.required;
                });
                const fieldPermissions = unpackedProfile.Profile.fieldPermissions;
                const mappedPermissions = fieldPermissions.reduce((acc, current) => {
                    if (current.field.startsWith(sObjectName)) {
                        acc[current.field] = current;
                    }
                    return acc;
                }, {});
                const options = filteredSelectedObjFields.map((field) => {
                    let opt = {
                        label: field.fullName,
                        description: '',
                        detail: '',
                        field: {
                            editable: false,
                            field: field,
                            readable: false
                        }
                    };
                    opt.field.field = field;
                    if (mappedPermissions[`${sObjectName}.${field.fullName}`]) {
                        let perm = mappedPermissions[`${sObjectName}.${field.fullName}`];
                        opt.description += perm.editable ? '✏️' : (perm.readable ? '👀' : '❌');
                        opt.detail += perm.editable ? 'EDITABLE' : (perm.readable ? 'READABLE' : 'NO ACCESS');
                    }
                    else {
                        opt.description = '🤷‍';
                        opt.detail = 'NOT IN PROFILE';
                    }
                    return opt;
                });
                const res = yield vscode.window.showQuickPick(options, { ignoreFocusOut: true, placeHolder: `Select ${sObjectName} field you want to edit FLS for profile ${profileName}.`, matchOnDetail: true });
                if (res !== undefined) {
                    resolve(res.field.field);
                }
                else {
                    reject('Profiles FLS Configuration Aborted');
                }
            }
            else {
                reject(`No Fields were found for the SObject ${sObjectName}`);
            }
        }));
    });
}
function configureFLSForField(field, profileName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let options = [
                {
                    label: 'READABLE',
                    description: '👀',
                    perm: AccessType_1.default.read
                },
                {
                    label: 'EDITABLE',
                    description: '✏️',
                    perm: AccessType_1.default.edit
                },
                {
                    label: 'NO ACCESS',
                    description: '❌',
                    perm: AccessType_1.default.none
                },
            ];
            const res = yield vscode.window.showQuickPick(options, { ignoreFocusOut: true, placeHolder: `Select ${field} access level for profile ${profileName}.` });
            if (res !== undefined) {
                resolve(res.perm);
            }
            else {
                reject('Profiles FLS Configuration Aborted');
            }
        }));
    });
}
function configureProfilesFLS() {
    return __awaiter(this, void 0, void 0, function* () {
        monitor_1.default.getInstance().sendEvent('configureProfilesFLS');
        try {
            const profiles = ProfileFilesManager_1.default.getObjectsFromMetaData();
            const selectedProfile = yield Prompts_1.default.profiles.pickOne(profiles);
            const unpackedProfile = yield ProfileFilesManager_1.default.readProfileDefinitionFile(selectedProfile);
            const SObjectFiles = yield SObjectFilesManager_1.default.getObjectsFromMetaData();
            // Filtering out custom metadata
            const pickedSObject = yield Prompts_1.default.sObjects.pickOne(SObjectFiles.filter((sObj) => sObj.sObjectType === SObjectType_1.SObjectType.SObject));
            const objectDefinition = yield SObjectFilesManager_1.default.readSObjectDefinitionFile(pickedSObject);
            const pickedField = yield configureFLSForProfileAndSObject(selectedProfile.label, pickedSObject.label, objectDefinition, unpackedProfile);
            const permission = yield configureFLSForField(pickedField.fullName, selectedProfile.label);
            ProfileFilesManager_2.default.updateProfilesVisibilityForField([selectedProfile], [{ sObject: pickedSObject, fields: [pickedField] }], permission);
            vscode.window.showInformationMessage(`Updated FLS on profile ${selectedProfile.label} for ${pickedSObject.label}.${pickedField.fullName}`);
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
            monitor_1.default.getInstance().sendError('configureProfilesFLS', { message: err.message, name: err.name, stackTrace: err.stack });
            console.log(err);
        }
    });
}
exports.default = configureProfilesFLS;


/***/ }),

/***/ "./src/commands/configure-profiles-user-permissions.ts":
/*!*************************************************************!*\
  !*** ./src/commands/configure-profiles-user-permissions.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const ProfileFilesManager_1 = __webpack_require__(/*! ./metadatamanagement/profiles/ProfileFilesManager */ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts");
const Prompts_1 = __webpack_require__(/*! ./builders/prompts/Prompts */ "./src/commands/builders/prompts/Prompts.ts");
const ProfileUserPermission_1 = __webpack_require__(/*! ./metadatamanagement/profiles/structures/ProfileUserPermission */ "./src/commands/metadatamanagement/profiles/structures/ProfileUserPermission.ts");
const monitor_1 = __webpack_require__(/*! ../monitoring/monitor */ "./src/monitoring/monitor.ts");
function configureUserPermissions(profile, userPermissions, preselectedPermissionsMap) {
    return __awaiter(this, void 0, void 0, function* () {
        const permissionOptions = userPermissions.map(perm => {
            let picked = preselectedPermissionsMap[perm] && preselectedPermissionsMap[perm].enabled;
            let found = !!preselectedPermissionsMap[perm];
            return { label: perm, picked, description: `(${picked ? 'Enabled on profile' : (found ? 'Disabled on profile' : 'Not in profile')})` };
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield vscode.window.showQuickPick(permissionOptions, { ignoreFocusOut: true, placeHolder: `Select all user permissions for profile ${profile}.`, canPickMany: true });
            if (res !== undefined) {
                // res.forEach((element: { picked: boolean }) => {
                //   delete element.picked
                // })
                resolve(res);
            }
            else {
                reject('Profile User Permission Configuration Aborted');
            }
        }));
    });
}
/**
 * The behaviour is: we check the files and pre-select the enabled ones.
 * Then we show the user the entire list and prompt for selection
 * In the end, we turn off all the permissions already contained in the profile metadata file,
 * turning then on the selected ones and adding the missing ones
 * No disabled new permission is added
 */
function configureProfilesUserPermissions() {
    return __awaiter(this, void 0, void 0, function* () {
        monitor_1.default.getInstance().sendEvent('configureProfilesUserPermissions');
        try {
            const profiles = ProfileFilesManager_1.default.getObjectsFromMetaData();
            const selectedProfile = yield Prompts_1.default.profiles.pickOne(profiles);
            const unpackedProfile = yield ProfileFilesManager_1.default.readProfileDefinitionFile(selectedProfile);
            const userPermissions = unpackedProfile.Profile.userPermissions;
            const mappedPermissions = userPermissions.reduce((acc, current) => {
                acc[current.name] = current;
                return acc;
            }, {});
            const enabledPermissions = ((yield configureUserPermissions(selectedProfile.label, Object.keys(ProfileUserPermission_1.default), mappedPermissions)) || []).map((el) => el.label);
            ProfileFilesManager_1.default.updateProfilesUserPermissions(selectedProfile, enabledPermissions);
            vscode.window.showInformationMessage(`Updated user permissions on profile ${selectedProfile.label}`);
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
            monitor_1.default.getInstance().sendError('configureProfilesUserPermissions', { message: err.message, name: err.name, stackTrace: err.stack });
            console.log(err);
        }
    });
}
exports.default = configureProfilesUserPermissions;


/***/ }),

/***/ "./src/commands/create-field.ts":
/*!**************************************!*\
  !*** ./src/commands/create-field.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const SObjectFieldType_1 = __webpack_require__(/*! ./metadatamanagement/sObjects/structures/SObjectFieldType */ "./src/commands/metadatamanagement/sObjects/structures/SObjectFieldType.ts");
const SObjectFieldBuilders_1 = __webpack_require__(/*! ./builders/SObjectFieldBuilders */ "./src/commands/builders/SObjectFieldBuilders.ts");
const SObjectFilesManager_1 = __webpack_require__(/*! ./metadatamanagement/sObjects/SObjectFilesManager */ "./src/commands/metadatamanagement/sObjects/SObjectFilesManager.ts");
const ProfileFilesManager_1 = __webpack_require__(/*! ./metadatamanagement/profiles/ProfileFilesManager */ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts");
const config_manager_1 = __webpack_require__(/*! ../config/config-manager */ "./src/config/config-manager.ts");
const AccessType_1 = __webpack_require__(/*! ./metadatamanagement/profiles/structures/AccessType */ "./src/commands/metadatamanagement/profiles/structures/AccessType.ts");
const utils_1 = __webpack_require__(/*! ./metadatamanagement/utils */ "./src/commands/metadatamanagement/utils.ts");
const Prompts_1 = __webpack_require__(/*! ./builders/prompts/Prompts */ "./src/commands/builders/prompts/Prompts.ts");
const SObjectType_1 = __webpack_require__(/*! ./metadatamanagement/sObjects/structures/SObjectType */ "./src/commands/metadatamanagement/sObjects/structures/SObjectType.ts");
const monitor_1 = __webpack_require__(/*! ../monitoring/monitor */ "./src/monitoring/monitor.ts");
// SFDC Metadata types selection
function pickSObjectType(sObjectDefinitions) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield vscode.window.showQuickPick(sObjectDefinitions, { ignoreFocusOut: true, placeHolder: 'Select an SObject Type' });
        return res;
    });
}
function fieldCreationWizard(otherFields, availableSObjectsList) {
    return __awaiter(this, void 0, void 0, function* () {
        let forbiddenApiNames = otherFields.map(field => field.fullName);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pickedFieldType = yield pickSObjectFieldType();
                let obj = yield SObjectFieldBuilders_1.default[pickedFieldType](forbiddenApiNames, availableSObjectsList);
                obj.isNew = true;
                resolve(obj);
            }
            catch (err) {
                reject(err);
            }
        }));
    });
}
function pickSObjectFieldType() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield vscode.window.showQuickPick(Object.keys(SObjectFieldType_1.default).map(el => { return { label: el, value: el }; }), { ignoreFocusOut: true, placeHolder: 'Select a Field Type' });
            res !== undefined ? resolve(res.value) : reject('Field Creation Aborted');
        }));
    });
}
// Main functionality
function createField() {
    return __awaiter(this, void 0, void 0, function* () {
        monitor_1.default.getInstance().sendEvent('createField');
        try {
            const SObjectFiles = yield SObjectFilesManager_1.default.getObjectsFromMetaData();
            const pickedSObject = yield Prompts_1.default.sObjects.pickOne(SObjectFiles);
            const objectDefinition = yield SObjectFilesManager_1.default.readSObjectDefinitionFile(pickedSObject);
            const sObjectFieldDefinition = yield fieldCreationWizard(objectDefinition.CustomObject.fields, SObjectFiles.map(file => file.label));
            objectDefinition.CustomObject.fields.push(sObjectFieldDefinition);
            objectDefinition.CustomObject.fields.sort((a, b) => utils_1.default.sortItemsByField(a, b, 'fullName'));
            yield SObjectFilesManager_1.default.writeSObjectDefinitionFile(pickedSObject, objectDefinition);
            if (pickedSObject.sObjectType === SObjectType_1.SObjectType.SObject) {
                ProfileFilesManager_1.default.updateProfilesVisibilityForField(config_manager_1.default.getInstance().getConfig().defaultProfiles || [], [{ sObject: pickedSObject, fields: [sObjectFieldDefinition] }], AccessType_1.default.edit);
            }
            vscode.window.showInformationMessage(`Field '${sObjectFieldDefinition.fullName}' was created on SObject ${pickedSObject.label} and enabled as editable for profiles: ${(config_manager_1.default.getInstance().getConfig().defaultProfiles || []).map(p => p.label)}`);
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
            monitor_1.default.getInstance().sendError('createField', { message: err.message, name: err.name, stackTrace: err.stack });
            console.log(err);
        }
    });
}
exports.default = createField;


/***/ }),

/***/ "./src/commands/index.ts":
/*!*******************************!*\
  !*** ./src/commands/index.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const create_field_1 = __webpack_require__(/*! ./create-field */ "./src/commands/create-field.ts");
const configure_default_fields_profiles_1 = __webpack_require__(/*! ./configure-default-fields-profiles */ "./src/commands/configure-default-fields-profiles.ts");
const configure_profiles_apex_classes_1 = __webpack_require__(/*! ./configure-profiles-apex-classes */ "./src/commands/configure-profiles-apex-classes.ts");
const configure_profiles_apex_pages_1 = __webpack_require__(/*! ./configure-profiles-apex-pages */ "./src/commands/configure-profiles-apex-pages.ts");
const configure_profiles_user_permissions_1 = __webpack_require__(/*! ./configure-profiles-user-permissions */ "./src/commands/configure-profiles-user-permissions.ts");
const configure_cross_profile_user_permission_1 = __webpack_require__(/*! ./configure-cross-profile-user-permission */ "./src/commands/configure-cross-profile-user-permission.ts");
const configure_profiles_fls_1 = __webpack_require__(/*! ./configure-profiles-fls */ "./src/commands/configure-profiles-fls.ts");
const reset_config_1 = __webpack_require__(/*! ./reset-config */ "./src/commands/reset-config.ts");
const reload_config_1 = __webpack_require__(/*! ./reload-config */ "./src/commands/reload-config.ts");
exports.default = {
    createField: create_field_1.default,
    configureDefaultFieldsProfiles: configure_default_fields_profiles_1.default,
    configureProfilesApexClasses: configure_profiles_apex_classes_1.default,
    configureProfilesApexPages: configure_profiles_apex_pages_1.default,
    configureProfilesUserPermissions: configure_profiles_user_permissions_1.default,
    configureCrossProfileUserPermission: configure_cross_profile_user_permission_1.default,
    configureProfilesFLS: configure_profiles_fls_1.default,
    resetConfig: reset_config_1.default,
    reloadConfig: reload_config_1.default
};


/***/ }),

/***/ "./src/commands/metadatamanagement/apexClasses/apexClassesFileManager.ts":
/*!*******************************************************************************!*\
  !*** ./src/commands/metadatamanagement/apexClasses/apexClassesFileManager.ts ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ApexClassFile_1 = __webpack_require__(/*! ./structures/ApexClassFile */ "./src/commands/metadatamanagement/apexClasses/structures/ApexClassFile.ts");
const path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
const config_manager_1 = __webpack_require__(/*! ../../../config/config-manager */ "./src/config/config-manager.ts");
exports.default = {
    getObjectsFromMetaData: function () {
        const p = path.join(config_manager_1.default.getInstance().getVSCodeRoot(), config_manager_1.default.getInstance().retrieveBackwardCompatibleRootFolder(), 'classes');
        const files = fs.readdirSync(p);
        if (files.length === 0) {
            throw Error('No Apex Class definition file was found in folder ' + p);
        }
        return this.generateSObjectDefinitions(files, p);
    },
    generateSObjectDefinitions: function (fileNames, path) {
        return fileNames.filter(el => el.endsWith('.cls')).map(filename => new ApexClassFile_1.default(filename, path));
    }
};


/***/ }),

/***/ "./src/commands/metadatamanagement/apexClasses/structures/ApexClassFile.ts":
/*!*********************************************************************************!*\
  !*** ./src/commands/metadatamanagement/apexClasses/structures/ApexClassFile.ts ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ApexClassFile {
    constructor(fileName, folder) {
        this.label = fileName.split('.')[0]; //filename without the extension since saleforce names files like the objects
        this.fileName = fileName; //filename, e.g.: Account.object
        this.folder = folder; //Should be src/objects
        this.extension = fileName.split('.')[1]; //Should be .cls for salefsorce sobject metadata definition files
    }
}
exports.default = ApexClassFile;


/***/ }),

/***/ "./src/commands/metadatamanagement/apexPages/apexPagesFileManager.ts":
/*!***************************************************************************!*\
  !*** ./src/commands/metadatamanagement/apexPages/apexPagesFileManager.ts ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ApexPageFile_1 = __webpack_require__(/*! ./structures/ApexPageFile */ "./src/commands/metadatamanagement/apexPages/structures/ApexPageFile.ts");
const path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
const config_manager_1 = __webpack_require__(/*! ../../../config/config-manager */ "./src/config/config-manager.ts");
exports.default = {
    getObjectsFromMetaData: function () {
        const p = path.join(config_manager_1.default.getInstance().getVSCodeRoot(), config_manager_1.default.getInstance().retrieveBackwardCompatibleRootFolder(), 'pages');
        const files = fs.readdirSync(p);
        if (files.length === 0) {
            throw Error('No Visualforce Page definition file was found in folder ' + p);
        }
        return this.generateSObjectDefinitions(files, p);
    },
    generateSObjectDefinitions: function (fileNames, path) {
        return fileNames.filter(el => el.endsWith('.page')).map(filename => new ApexPageFile_1.default(filename, path));
    }
};


/***/ }),

/***/ "./src/commands/metadatamanagement/apexPages/structures/ApexPageFile.ts":
/*!******************************************************************************!*\
  !*** ./src/commands/metadatamanagement/apexPages/structures/ApexPageFile.ts ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ApexPageFile {
    constructor(fileName, folder) {
        this.label = fileName.split('.')[0]; //filename without the extension since saleforce names files like the objects
        this.fileName = fileName; //filename, e.g.: Account.object
        this.folder = folder; //Should be src/pages
        this.extension = fileName.split('.')[1]; //Should be .page for salefsorce sobject metadata definition files
    }
}
exports.default = ApexPageFile;


/***/ }),

/***/ "./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts":
/*!*************************************************************************!*\
  !*** ./src/commands/metadatamanagement/profiles/ProfileFilesManager.ts ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProfileFile_1 = __webpack_require__(/*! ./structures/ProfileFile */ "./src/commands/metadatamanagement/profiles/structures/ProfileFile.ts");
const path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
const xml2js = __webpack_require__(/*! xml2js */ "./node_modules/xml2js/lib/xml2js.js");
const processors_1 = __webpack_require__(/*! xml2js/lib/processors */ "./node_modules/xml2js/lib/processors.js");
const AccessType_1 = __webpack_require__(/*! ./structures/AccessType */ "./src/commands/metadatamanagement/profiles/structures/AccessType.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/commands/metadatamanagement/utils.ts");
const config_manager_1 = __webpack_require__(/*! ../../../config/config-manager */ "./src/config/config-manager.ts");
exports.default = {
    getObjectsFromMetaData: function () {
        const p = path.join(config_manager_1.default.getInstance().getVSCodeRoot(), config_manager_1.default.getInstance().retrieveBackwardCompatibleRootFolder(), 'profiles');
        const files = fs.readdirSync(p);
        if (files.length === 0) {
            throw Error('No Profile definition file was found in folder ' + p);
        }
        return this.generateProfilesDefinitions(files, p);
    },
    generateProfilesDefinitions: function (fileNames, path) {
        return fileNames.map(filename => new ProfileFile_1.default(filename, path));
    },
    readProfileDefinitionFile: function (objDef) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const filePath = path.join(objDef.folder.toString(), objDef.fileName);
                const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
                const xmlParser = new xml2js.Parser({ explicitArray: false, valueProcessors: [processors_1.parseBooleans] });
                try {
                    const parsedFile = yield new Promise((resolve, reject) => {
                        xmlParser.parseString(fileContent, (err, result) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(result);
                            }
                        });
                    });
                    resolve(parsedFile);
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    },
    writeProfileDefinitionFile: function (fileNamePath, stuffToWrite) {
        const builder = new xml2js.Builder({ xmldec: { standalone: undefined, encoding: 'UTF-8', version: '1.0' }, renderOpts: { pretty: true, indent: '    ', newline: '\n' } });
        //Probably there's a bug in the builder class
        const xml = builder.buildObject(stuffToWrite);
        //130 is the number of characters of the first two lines containing header + root object definition
        let escaped = xml.substr(0, 130) + xml.substr(130, xml.length - 130).replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        fs.writeFileSync(fileNamePath.toString(), escaped, 'utf8');
    },
    updateProfilesVisibilityForField: function (profiles, fieldsInfos, accessType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                profiles.forEach((profileFile) => __awaiter(this, void 0, void 0, function* () {
                    const prof = yield this.readProfileDefinitionFile(profileFile);
                    const mappedFields = prof.Profile.fieldPermissions.reduce((acc, curr) => {
                        acc[curr.field] = curr;
                        return acc;
                    }, {});
                    fieldsInfos.forEach(fieldInfo => {
                        fieldInfo.fields.forEach(fieldMeta => {
                            let currField = `${fieldInfo.sObject.label}.${fieldMeta.fullName}`;
                            console.log(currField);
                            if (!mappedFields[currField]) {
                                prof.Profile.fieldPermissions.push({
                                    readable: accessType !== AccessType_1.default.none,
                                    field: `${fieldInfo.sObject.label}.${fieldMeta.fullName}`,
                                    editable: accessType === AccessType_1.default.edit
                                });
                            }
                            else {
                                mappedFields[currField].readable = accessType !== AccessType_1.default.none;
                                mappedFields[currField].editable = accessType === AccessType_1.default.edit;
                            }
                        });
                    });
                    prof.Profile.fieldPermissions.sort((a, b) => utils_1.default.sortItemsByField(a, b, 'field'));
                    this.writeProfileDefinitionFile(path.join(profileFile.folder.toString(), profileFile.fileName), prof);
                }));
            }
            catch (err) {
                throw Error(`Error updating field-level security for profiles: ${profiles.map(prf => prf.label)}`);
            }
        });
    },
    updateProfilesApexClassesAccess: function (profile, enabledClasses) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prof = yield this.readProfileDefinitionFile(profile);
                prof.Profile.classAccesses.forEach((classAccess) => {
                    classAccess.enabled = enabledClasses.includes(classAccess.apexClass);
                });
                prof.Profile.classAccesses.sort((a, b) => utils_1.default.sortItemsByField(a, b, 'apexClass'));
                this.writeProfileDefinitionFile(path.join(profile.folder.toString(), profile.fileName), prof);
            }
            catch (err) {
                throw Error(`Error updating Apex Class Access for profile: ${profile.label}`);
            }
        });
    },
    updateProfilesApexPagesAccess: function (profile, enabledPages) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prof = yield this.readProfileDefinitionFile(profile);
                prof.Profile.pageAccesses.forEach((pageAccess) => {
                    pageAccess.enabled = enabledPages.includes(pageAccess.apexPage);
                });
                prof.Profile.pageAccesses.sort((a, b) => utils_1.default.sortItemsByField(a, b, 'apexPage'));
                this.writeProfileDefinitionFile(path.join(profile.folder.toString(), profile.fileName), prof);
            }
            catch (err) {
                throw Error(`Error updating Visualforce Page Access for profile: ${profile.label}`);
            }
        });
    },
    /**
     * The behaviour is: we check the files and pre-selected the enabled ones.
     * Then we show the user the entire list and we allow him/her to select the enabled ones
     * In the end, we turn everything off, turning then on the selected ones and adding the missing ones in
     * the original file
     */
    updateProfilesUserPermissions: function (profile, enabledPermissions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prof = yield this.readProfileDefinitionFile(profile);
                const userPermissions = prof.Profile.userPermissions;
                const mappedPermissions = userPermissions.reduce((acc, current) => {
                    acc[current.name] = current;
                    return acc;
                }, {});
                //Turn off the ones which are already in the profile metadata file
                userPermissions.forEach(perm => {
                    perm.enabled = false;
                });
                //Turning on the selected ones, adding the missing ones in the file
                enabledPermissions.forEach((permission) => {
                    if (mappedPermissions[permission]) {
                        mappedPermissions[permission].enabled = true;
                    }
                    else {
                        userPermissions.push({ enabled: true, name: permission });
                    }
                });
                userPermissions.sort((a, b) => utils_1.default.sortItemsByField(a, b, 'name'));
                prof.Profile.userPermissions = userPermissions;
                this.writeProfileDefinitionFile(path.join(profile.folder.toString(), profile.fileName), prof);
            }
            catch (err) {
                throw Error(`Error updating Visualforce Page Access for profile: ${profile.label}`);
            }
        });
    },
    updateProfileSinglePermission: function (profile, permission, enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prof = yield this.readProfileDefinitionFile(profile);
                const userPermissions = prof.Profile.userPermissions;
                let perm = userPermissions.find((perm) => perm.name === permission);
                if (perm) {
                    perm.enabled = enabled;
                }
                else if (perm === undefined && enabled) {
                    perm = { enabled: true, name: permission };
                    userPermissions.push(perm);
                }
                userPermissions.sort((a, b) => utils_1.default.sortItemsByField(a, b, 'name'));
                prof.Profile.userPermissions = userPermissions;
                this.writeProfileDefinitionFile(path.join(profile.folder.toString(), profile.fileName), prof);
            }
            catch (err) {
                throw Error(`Error updating Visualforce Page Access for profile: ${profile.label}`);
            }
        });
    }
};


/***/ }),

/***/ "./src/commands/metadatamanagement/profiles/structures/AccessType.ts":
/*!***************************************************************************!*\
  !*** ./src/commands/metadatamanagement/profiles/structures/AccessType.ts ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AccessType;
(function (AccessType) {
    AccessType[AccessType["none"] = 0] = "none";
    AccessType[AccessType["read"] = 1] = "read";
    AccessType[AccessType["edit"] = 2] = "edit";
})(AccessType || (AccessType = {}));
exports.default = AccessType;


/***/ }),

/***/ "./src/commands/metadatamanagement/profiles/structures/MetadataStructure.ts":
/*!**********************************************************************************!*\
  !*** ./src/commands/metadatamanagement/profiles/structures/MetadataStructure.ts ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Fetched by retrieving salesforce admin profiles.
 * Might miss some
 * Probably depending on the API version
 */
var MetadataStructure;
(function (MetadataStructure) {
    MetadataStructure["SF_Original"] = "Original";
    MetadataStructure["SF_SFDX"] = "SFDX";
})(MetadataStructure || (MetadataStructure = {}));
exports.default = MetadataStructure;


/***/ }),

/***/ "./src/commands/metadatamanagement/profiles/structures/ProfileFile.ts":
/*!****************************************************************************!*\
  !*** ./src/commands/metadatamanagement/profiles/structures/ProfileFile.ts ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ProfileFile {
    constructor(fileName, folder) {
        this.label = fileName.split('.')[0]; //filename without the extension since saleforce names files like the profiles
        this.fileName = fileName; //filename, e.g.: Account.profile
        this.folder = folder; //Should be src/profiles
        this.extension = fileName.split('.')[1]; //Should be .profile for salefsorce sobject metadata definition files
    }
}
exports.default = ProfileFile;


/***/ }),

/***/ "./src/commands/metadatamanagement/profiles/structures/ProfileUserPermission.ts":
/*!**************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/profiles/structures/ProfileUserPermission.ts ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Fetched by retrieving salesforce admin profiles.
 * Might miss some
 * Probably depending on the API version
 */
var ProfileUserPermission;
(function (ProfileUserPermission) {
    ProfileUserPermission["ActivateContract"] = "ActivateContract";
    ProfileUserPermission["ActivateOrder"] = "ActivateOrder";
    ProfileUserPermission["ActivitiesAccess"] = "ActivitiesAccess";
    ProfileUserPermission["AddDirectMessageMembers"] = "AddDirectMessageMembers";
    ProfileUserPermission["ApexRestServices"] = "ApexRestServices";
    ProfileUserPermission["ApiEnabled"] = "ApiEnabled";
    ProfileUserPermission["ApproveContract"] = "ApproveContract";
    ProfileUserPermission["AssignPermissionSets"] = "AssignPermissionSets";
    ProfileUserPermission["AssignTopics"] = "AssignTopics";
    ProfileUserPermission["AuthorApex"] = "AuthorApex";
    ProfileUserPermission["BulkApiHardDelete"] = "BulkApiHardDelete";
    ProfileUserPermission["BulkMacrosAllowed"] = "BulkMacrosAllowed";
    ProfileUserPermission["CanInsertFeedSystemFields"] = "CanInsertFeedSystemFields";
    ProfileUserPermission["CanUseNewDashboardBuilder"] = "CanUseNewDashboardBuilder";
    ProfileUserPermission["CanVerifyComment"] = "CanVerifyComment";
    ProfileUserPermission["ChangeDashboardColors"] = "ChangeDashboardColors";
    ProfileUserPermission["ChatterEditOwnPost"] = "ChatterEditOwnPost";
    ProfileUserPermission["ChatterEditOwnRecordPost"] = "ChatterEditOwnRecordPost";
    ProfileUserPermission["ChatterFileLink"] = "ChatterFileLink";
    ProfileUserPermission["ChatterInternalUser"] = "ChatterInternalUser";
    ProfileUserPermission["ChatterInviteExternalUsers"] = "ChatterInviteExternalUsers";
    ProfileUserPermission["ChatterOwnGroups"] = "ChatterOwnGroups";
    ProfileUserPermission["ConnectOrgToEnvironmentHub"] = "ConnectOrgToEnvironmentHub";
    ProfileUserPermission["ContentAdministrator"] = "ContentAdministrator";
    ProfileUserPermission["ContentWorkspaces"] = "ContentWorkspaces";
    ProfileUserPermission["ConvertLeads"] = "ConvertLeads";
    ProfileUserPermission["CreateAuditFields"] = "CreateAuditFields";
    ProfileUserPermission["CreateCustomizeDashboards"] = "CreateCustomizeDashboards";
    ProfileUserPermission["CreateCustomizeFilters"] = "CreateCustomizeFilters";
    ProfileUserPermission["CreateCustomizeReports"] = "CreateCustomizeReports";
    ProfileUserPermission["CreateDashboardFolders"] = "CreateDashboardFolders";
    ProfileUserPermission["CreatePackaging"] = "CreatePackaging";
    ProfileUserPermission["CreateReportFolders"] = "CreateReportFolders";
    ProfileUserPermission["CreateTopics"] = "CreateTopics";
    ProfileUserPermission["CreateWorkBadgeDefinition"] = "CreateWorkBadgeDefinition";
    ProfileUserPermission["CreateWorkspaces"] = "CreateWorkspaces";
    ProfileUserPermission["CustomizeApplication"] = "CustomizeApplication";
    ProfileUserPermission["DataExport"] = "DataExport";
    ProfileUserPermission["DelegatedTwoFactor"] = "DelegatedTwoFactor";
    ProfileUserPermission["DeleteActivatedContract"] = "DeleteActivatedContract";
    ProfileUserPermission["DeleteTopics"] = "DeleteTopics";
    ProfileUserPermission["DistributeFromPersWksp"] = "DistributeFromPersWksp";
    ProfileUserPermission["EditActivatedOrders"] = "EditActivatedOrders";
    ProfileUserPermission["EditBrandTemplates"] = "EditBrandTemplates";
    ProfileUserPermission["EditCaseComments"] = "EditCaseComments";
    ProfileUserPermission["EditEvent"] = "EditEvent";
    ProfileUserPermission["EditHtmlTemplates"] = "EditHtmlTemplates";
    ProfileUserPermission["EditMyDashboards"] = "EditMyDashboards";
    ProfileUserPermission["EditMyReports"] = "EditMyReports";
    ProfileUserPermission["EditOppLineItemUnitPrice"] = "EditOppLineItemUnitPrice";
    ProfileUserPermission["EditPublicDocuments"] = "EditPublicDocuments";
    ProfileUserPermission["EditPublicFilters"] = "EditPublicFilters";
    ProfileUserPermission["EditPublicTemplates"] = "EditPublicTemplates";
    ProfileUserPermission["EditReadonlyFields"] = "EditReadonlyFields";
    ProfileUserPermission["EditTask"] = "EditTask";
    ProfileUserPermission["EditTopics"] = "EditTopics";
    ProfileUserPermission["EmailMass"] = "EmailMass";
    ProfileUserPermission["EmailSingle"] = "EmailSingle";
    ProfileUserPermission["EnableNotifications"] = "EnableNotifications";
    ProfileUserPermission["ExportReport"] = "ExportReport";
    ProfileUserPermission["GiveRecognitionBadge"] = "GiveRecognitionBadge";
    ProfileUserPermission["ImportCustomObjects"] = "ImportCustomObjects";
    ProfileUserPermission["ImportLeads"] = "ImportLeads";
    ProfileUserPermission["ImportPersonal"] = "ImportPersonal";
    ProfileUserPermission["InboundMigrationToolsUser"] = "InboundMigrationToolsUser";
    ProfileUserPermission["InstallPackaging"] = "InstallPackaging";
    ProfileUserPermission["LightningConsoleAllowedForUser"] = "LightningConsoleAllowedForUser";
    ProfileUserPermission["LightningExperienceUser"] = "LightningExperienceUser";
    ProfileUserPermission["ListEmailSend"] = "ListEmailSend";
    ProfileUserPermission["ManageAnalyticSnapshots"] = "ManageAnalyticSnapshots";
    ProfileUserPermission["ManageAuthProviders"] = "ManageAuthProviders";
    ProfileUserPermission["ManageBusinessHourHolidays"] = "ManageBusinessHourHolidays";
    ProfileUserPermission["ManageCallCenters"] = "ManageCallCenters";
    ProfileUserPermission["ManageCases"] = "ManageCases";
    ProfileUserPermission["ManageCategories"] = "ManageCategories";
    ProfileUserPermission["ManageCertificates"] = "ManageCertificates";
    ProfileUserPermission["ManageContentPermissions"] = "ManageContentPermissions";
    ProfileUserPermission["ManageContentProperties"] = "ManageContentProperties";
    ProfileUserPermission["ManageContentTypes"] = "ManageContentTypes";
    ProfileUserPermission["ManageCssUsers"] = "ManageCssUsers";
    ProfileUserPermission["ManageCustomPermissions"] = "ManageCustomPermissions";
    ProfileUserPermission["ManageCustomReportTypes"] = "ManageCustomReportTypes";
    ProfileUserPermission["ManageDashbdsInPubFolders"] = "ManageDashbdsInPubFolders";
    ProfileUserPermission["ManageDataCategories"] = "ManageDataCategories";
    ProfileUserPermission["ManageDataIntegrations"] = "ManageDataIntegrations";
    ProfileUserPermission["ManageDynamicDashboards"] = "ManageDynamicDashboards";
    ProfileUserPermission["ManageEmailClientConfig"] = "ManageEmailClientConfig";
    ProfileUserPermission["ManageExchangeConfig"] = "ManageExchangeConfig";
    ProfileUserPermission["ManageHealthCheck"] = "ManageHealthCheck";
    ProfileUserPermission["ManageInteraction"] = "ManageInteraction";
    ProfileUserPermission["ManageInternalUsers"] = "ManageInternalUsers";
    ProfileUserPermission["ManageIpAddresses"] = "ManageIpAddresses";
    ProfileUserPermission["ManageLeads"] = "ManageLeads";
    ProfileUserPermission["ManageLoginAccessPolicies"] = "ManageLoginAccessPolicies";
    ProfileUserPermission["ManageMobile"] = "ManageMobile";
    ProfileUserPermission["ManageNetworks"] = "ManageNetworks";
    ProfileUserPermission["ManagePackageLicenses"] = "ManagePackageLicenses";
    ProfileUserPermission["ManagePartners"] = "ManagePartners";
    ProfileUserPermission["ManagePasswordPolicies"] = "ManagePasswordPolicies";
    ProfileUserPermission["ManageProfilesPermissionsets"] = "ManageProfilesPermissionsets";
    ProfileUserPermission["ManagePvtRptsAndDashbds"] = "ManagePvtRptsAndDashbds";
    ProfileUserPermission["ManageQuotas"] = "ManageQuotas";
    ProfileUserPermission["ManageRemoteAccess"] = "ManageRemoteAccess";
    ProfileUserPermission["ManageReportsInPubFolders"] = "ManageReportsInPubFolders";
    ProfileUserPermission["ManageRoles"] = "ManageRoles";
    ProfileUserPermission["ManageSharing"] = "ManageSharing";
    ProfileUserPermission["ManageSolutions"] = "ManageSolutions";
    ProfileUserPermission["ManageSynonyms"] = "ManageSynonyms";
    ProfileUserPermission["ManageTranslation"] = "ManageTranslation";
    ProfileUserPermission["ManageUnlistedGroups"] = "ManageUnlistedGroups";
    ProfileUserPermission["ManageUsers"] = "ManageUsers";
    ProfileUserPermission["MergeTopics"] = "MergeTopics";
    ProfileUserPermission["ModerateChatter"] = "ModerateChatter";
    ProfileUserPermission["ModifyAllData"] = "ModifyAllData";
    ProfileUserPermission["ModifyMetadata"] = "ModifyMetadata";
    ProfileUserPermission["NewReportBuilder"] = "NewReportBuilder";
    ProfileUserPermission["OutboundMigrationToolsUser"] = "OutboundMigrationToolsUser";
    ProfileUserPermission["OverrideForecasts"] = "OverrideForecasts";
    ProfileUserPermission["Packaging2"] = "Packaging2";
    ProfileUserPermission["PublishPackaging"] = "PublishPackaging";
    ProfileUserPermission["RemoveDirectMessageMembers"] = "RemoveDirectMessageMembers";
    ProfileUserPermission["ResetPasswords"] = "ResetPasswords";
    ProfileUserPermission["RunFlow"] = "RunFlow";
    ProfileUserPermission["RunReports"] = "RunReports";
    ProfileUserPermission["ScheduleJob"] = "ScheduleJob";
    ProfileUserPermission["ScheduleReports"] = "ScheduleReports";
    ProfileUserPermission["SelectFilesFromSalesforce"] = "SelectFilesFromSalesforce";
    ProfileUserPermission["SendSitRequests"] = "SendSitRequests";
    ProfileUserPermission["ShowCompanyNameAsUserBadge"] = "ShowCompanyNameAsUserBadge";
    ProfileUserPermission["SolutionImport"] = "SolutionImport";
    ProfileUserPermission["SubmitMacrosAllowed"] = "SubmitMacrosAllowed";
    ProfileUserPermission["SubscribeDashboardToOtherUsers"] = "SubscribeDashboardToOtherUsers";
    ProfileUserPermission["SubscribeReportToOtherUsers"] = "SubscribeReportToOtherUsers";
    ProfileUserPermission["SubscribeReportsRunAsUser"] = "SubscribeReportsRunAsUser";
    ProfileUserPermission["SubscribeToLightningDashboards"] = "SubscribeToLightningDashboards";
    ProfileUserPermission["SubscribeToLightningReports"] = "SubscribeToLightningReports";
    ProfileUserPermission["TransactionalEmailSend"] = "TransactionalEmailSend";
    ProfileUserPermission["TransferAnyCase"] = "TransferAnyCase";
    ProfileUserPermission["TransferAnyEntity"] = "TransferAnyEntity";
    ProfileUserPermission["TransferAnyLead"] = "TransferAnyLead";
    ProfileUserPermission["UpdateWithInactiveOwner"] = "UpdateWithInactiveOwner";
    ProfileUserPermission["UseTeamReassignWizards"] = "UseTeamReassignWizards";
    ProfileUserPermission["UseWebLink"] = "UseWebLink";
    ProfileUserPermission["ViewAllData"] = "ViewAllData";
    ProfileUserPermission["ViewAllForecasts"] = "ViewAllForecasts";
    ProfileUserPermission["ViewAllUsers"] = "ViewAllUsers";
    ProfileUserPermission["ViewDataAssessment"] = "ViewDataAssessment";
    ProfileUserPermission["ViewDataCategories"] = "ViewDataCategories";
    ProfileUserPermission["ViewEventLogFiles"] = "ViewEventLogFiles";
    ProfileUserPermission["ViewHealthCheck"] = "ViewHealthCheck";
    ProfileUserPermission["ViewHelpLink"] = "ViewHelpLink";
    ProfileUserPermission["ViewMyTeamsDashboards"] = "ViewMyTeamsDashboards";
    ProfileUserPermission["ViewPublicDashboards"] = "ViewPublicDashboards";
    ProfileUserPermission["ViewPublicReports"] = "ViewPublicReports";
    ProfileUserPermission["ViewRoles"] = "ViewRoles";
    ProfileUserPermission["ViewSetup"] = "ViewSetup";
})(ProfileUserPermission || (ProfileUserPermission = {}));
exports.default = ProfileUserPermission;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/SObjectFilesManager.ts":
/*!*************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/SObjectFilesManager.ts ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SObjectFile_1 = __webpack_require__(/*! ./structures/SObjectFile */ "./src/commands/metadatamanagement/sObjects/structures/SObjectFile.ts");
const path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
const xml2js = __webpack_require__(/*! xml2js */ "./node_modules/xml2js/lib/xml2js.js");
const processors_1 = __webpack_require__(/*! xml2js/lib/processors */ "./node_modules/xml2js/lib/processors.js");
const config_manager_1 = __webpack_require__(/*! ../../../config/config-manager */ "./src/config/config-manager.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/commands/metadatamanagement/utils.ts");
exports.default = {
    getObjectsFromMetaData: function () {
        const p = path.join(config_manager_1.default.getInstance().getVSCodeRoot(), config_manager_1.default.getInstance().retrieveBackwardCompatibleRootFolder(), 'objects');
        const files = fs.readdirSync(p, { withFileTypes: true });
        if (files.length === 0) {
            throw Error('No SObject definition file was found in folder ' + p);
        }
        return this.generateSObjectDefinitions(files, p);
    },
    generateSObjectDefinitions: function (files, path) {
        return files.map(file => new SObjectFile_1.default(file, path));
    },
    readSObjectDefinitionFile: function (objDef) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const filePath = path.join(objDef.folder.toString(), objDef.fileName);
                if (!objDef.isDirectory) {
                    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
                    const xmlParser = new xml2js.Parser({ explicitArray: false, valueProcessors: [processors_1.parseBooleans] });
                    try {
                        const parsedFile = yield new Promise((resolve, reject) => {
                            xmlParser.parseString(fileContent, (err, result) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(result);
                                }
                            });
                        });
                        resolve(parsedFile);
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                else {
                    const fields = fs.readdirSync(path.join(filePath, 'fields'));
                    let objDef = { CustomObject: { fields: [] } }; //fake SObject definition cause we only care about fields
                    const fieldsArr = yield Promise.all(fields.map(field => {
                        return new Promise((resolve, reject) => {
                            const fileContent = fs.readFileSync(path.join(filePath, 'fields', field), { encoding: 'utf-8' });
                            const xmlParser = new xml2js.Parser({ explicitArray: false, valueProcessors: [processors_1.parseBooleans] });
                            try {
                                const parsedFile = xmlParser.parseString(fileContent, (err, result) => {
                                    console.log(result);
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(result.CustomField);
                                    }
                                });
                            }
                            catch (err) {
                                reject(err);
                            }
                        });
                    }));
                    objDef.CustomObject.fields = fieldsArr;
                    objDef.CustomObject.fields.sort((a, b) => utils_1.default.sortItemsByField(a, b, 'fullName'));
                    resolve(objDef);
                }
            }));
        });
    },
    writeSObjectDefinitionFile: function (sObjFile, stuffToWrite) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (!sObjFile.isDirectory) {
                    try {
                        const fileNamePath = path.join(sObjFile.folder.toString(), sObjFile.fileName);
                        const builder = new xml2js.Builder({ xmldec: { standalone: undefined, encoding: 'UTF-8', version: '1.0' } });
                        //Probably there's a bug in the builder class
                        const xml = builder.buildObject(stuffToWrite);
                        //130 is the number of characters of the first two lines containing header + root object definition
                        let escaped = xml.substr(0, 130) + xml.substr(130, xml.length - 130).replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                        fs.writeFileSync(fileNamePath.toString(), escaped, 'utf8');
                        resolve();
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                else {
                    let fieldsToAdd = stuffToWrite.CustomObject.fields.filter((el) => el.isNew);
                    yield Promise.all(fieldsToAdd.map((fieldToAdd) => {
                        return new Promise((resolve, reject) => {
                            try {
                                const fileNamePath = path.join(sObjFile.folder.toString(), sObjFile.fileName, 'fields', `${fieldToAdd.fullName}.field-meta.xml`);
                                const builder = new xml2js.Builder({ xmldec: { standalone: undefined, encoding: 'UTF-8', version: '1.0' }, renderOpts: { pretty: true, indent: '    ', newline: '\n' } });
                                delete fieldToAdd.isNew;
                                fieldToAdd['$'] = { xmlns: 'http://soap.sforce.com/2006/04/metadata' };
                                let fieldObj = { CustomField: fieldToAdd };
                                const xml = builder.buildObject(fieldObj);
                                fs.writeFileSync(fileNamePath.toString(), xml, 'utf8');
                                resolve(true);
                            }
                            catch (err) {
                                reject(false);
                            }
                        });
                    }));
                    resolve();
                }
            }));
        });
    }
};


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/SObjectFieldTemplates.ts":
/*!**************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/SObjectFieldTemplates.ts ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Text_1 = __webpack_require__(/*! ./field-templates/Text */ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Text.ts");
exports.Text = Text_1.default;
const Checkbox_1 = __webpack_require__(/*! ./field-templates/Checkbox */ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Checkbox.ts");
exports.Checkbox = Checkbox_1.default;
const Email_1 = __webpack_require__(/*! ./field-templates/Email */ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Email.ts");
exports.Email = Email_1.default;
const Date_1 = __webpack_require__(/*! ./field-templates/Date */ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Date.ts");
exports.Date = Date_1.default;
const Date_2 = __webpack_require__(/*! ./field-templates/Date */ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Date.ts");
exports.DateTime = Date_2.default;
const Phone_1 = __webpack_require__(/*! ./field-templates/Phone */ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Phone.ts");
exports.Phone = Phone_1.default;
const TextArea_1 = __webpack_require__(/*! ./field-templates/TextArea */ "./src/commands/metadatamanagement/sObjects/structures/field-templates/TextArea.ts");
exports.TextArea = TextArea_1.default;
const LongTextArea_1 = __webpack_require__(/*! ./field-templates/LongTextArea */ "./src/commands/metadatamanagement/sObjects/structures/field-templates/LongTextArea.ts");
exports.LongTextArea = LongTextArea_1.default;
const Number_1 = __webpack_require__(/*! ./field-templates/Number */ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Number.ts");
exports.Number = Number_1.default;
const Lookup_1 = __webpack_require__(/*! ./field-templates/Lookup */ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Lookup.ts");
exports.Lookup = Lookup_1.default;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/SObjectFieldType.ts":
/*!*********************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/SObjectFieldType.ts ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SObjectFieldType;
(function (SObjectFieldType) {
    SObjectFieldType["Checkbox"] = "Checkbox";
    //Picklist = 'Picklist',
    SObjectFieldType["Number"] = "Number";
    SObjectFieldType["Email"] = "Email";
    SObjectFieldType["Text"] = "Text";
    SObjectFieldType["Lookup"] = "Lookup";
    SObjectFieldType["LongTextArea"] = "LongTextArea";
    SObjectFieldType["Date"] = "Date";
    //MultiselectPicklist = 'MultiselectPicklist',
    SObjectFieldType["DateTime"] = "DateTime";
    SObjectFieldType["TextArea"] = "TextArea";
    SObjectFieldType["Phone"] = "Phone";
    //Summary = 'Summary',
    //Hierarchy = 'Hierarchy',
    //AutoNumber = 'AutoNumber',
    //Percent = 'Percent'
})(SObjectFieldType || (SObjectFieldType = {}));
exports.default = SObjectFieldType;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/SObjectFile.ts":
/*!****************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/SObjectFile.ts ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SObjectType_1 = __webpack_require__(/*! ./SObjectType */ "./src/commands/metadatamanagement/sObjects/structures/SObjectType.ts");
class SObjectFile {
    constructor(file, folder) {
        let fileName = file.name;
        this.label = fileName.split('.')[0]; //filename without the extension since saleforce names files like the objects
        this.fileName = fileName; //filename, e.g.: Account.object
        this.folder = folder; //depends on project structure
        this.isDirectory = file.isDirectory();
        this.extension = fileName.split('.')[1]; //Should be .object for salefsorce sobject metadata definition files
        this.sObjectType = this.label.endsWith('__mdt') ? SObjectType_1.SObjectType.CustomMetadata : SObjectType_1.SObjectType.SObject;
    }
}
exports.default = SObjectFile;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/SObjectType.ts":
/*!****************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/SObjectType.ts ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SObjectType;
(function (SObjectType) {
    SObjectType[SObjectType["SObject"] = 0] = "SObject";
    SObjectType[SObjectType["CustomMetadata"] = 1] = "CustomMetadata";
})(SObjectType = exports.SObjectType || (exports.SObjectType = {}));


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Checkbox.ts":
/*!*****************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/field-templates/Checkbox.ts ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Checkbox {
    constructor(fullName, label, required, defaultValue) {
        this.fullName = fullName;
        this.externalId = false;
        this.label = label;
        this.type = 'Checkbox';
        this.required = required;
        this.defaultValue = defaultValue;
    }
}
exports.default = Checkbox;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Date.ts":
/*!*************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/field-templates/Date.ts ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Date {
    constructor(fullName, label, externalId, required) {
        this.fullName = fullName;
        this.externalId = externalId;
        this.label = label;
        this.type = 'Date';
        this.required = required;
    }
}
exports.default = Date;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Email.ts":
/*!**************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/field-templates/Email.ts ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Email {
    constructor(fullName, label, externalId, required, unique) {
        this.fullName = fullName;
        this.externalId = externalId;
        if (this.externalId) {
            this.caseSensitive = false;
        }
        this.label = label;
        this.type = 'Email';
        this.required = required;
        this.unique = unique;
    }
}
exports.default = Email;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/field-templates/LongTextArea.ts":
/*!*********************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/field-templates/LongTextArea.ts ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class LongTextArea {
    constructor(fullName, label, externalId, required, length) {
        this.fullName = fullName;
        this.externalId = externalId;
        this.label = label;
        this.type = 'LongTextArea';
        this.required = required;
        this.length = length;
        this.visibleLines = '3';
    }
}
exports.default = LongTextArea;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Lookup.ts":
/*!***************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/field-templates/Lookup.ts ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Lookup {
    constructor(fullName, label, required, referenceTo, relationshipLabel, relationshipName) {
        this.fullName = fullName;
        this.externalId = false;
        this.label = label;
        this.type = 'Lookup';
        this.required = required;
        this.deleteConstraint = 'setNull';
        this.referenceTo = referenceTo;
        this.relationshipLabel = relationshipLabel;
        this.relationshipName = relationshipName;
    }
}
exports.default = Lookup;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Number.ts":
/*!***************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/field-templates/Number.ts ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Number {
    constructor(fullName, label, externalId, required, unique, precision, scale) {
        this.fullName = fullName;
        this.externalId = externalId;
        this.label = label;
        this.type = 'Number';
        this.required = required;
        this.unique = unique;
        this.precision = precision;
        this.scale = scale;
    }
}
exports.default = Number;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Phone.ts":
/*!**************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/field-templates/Phone.ts ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Phone {
    constructor(fullName, label, externalId, required) {
        this.fullName = fullName;
        this.externalId = externalId;
        if (this.externalId) {
            this.caseSensitive = true;
        }
        this.label = label;
        this.type = 'Phone';
        this.required = required;
    }
}
exports.default = Phone;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/field-templates/Text.ts":
/*!*************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/field-templates/Text.ts ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Text {
    constructor(fullName, label, externalId, required, length, unique) {
        this.fullName = fullName;
        this.externalId = externalId;
        if (this.externalId) {
            this.caseSensitive = true;
        }
        this.label = label;
        this.type = 'Text';
        this.required = required;
        this.length = length;
        this.unique = unique;
    }
}
exports.default = Text;


/***/ }),

/***/ "./src/commands/metadatamanagement/sObjects/structures/field-templates/TextArea.ts":
/*!*****************************************************************************************!*\
  !*** ./src/commands/metadatamanagement/sObjects/structures/field-templates/TextArea.ts ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class TextArea {
    constructor(fullName, label, externalId, required) {
        this.fullName = fullName;
        this.externalId = externalId;
        this.label = label;
        this.type = 'TextArea';
        this.required = required;
    }
}
exports.default = TextArea;


/***/ }),

/***/ "./src/commands/metadatamanagement/utils.ts":
/*!**************************************************!*\
  !*** ./src/commands/metadatamanagement/utils.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    sortItemsByField: (a, b, fieldName) => {
        if (a[fieldName] > b[fieldName]) {
            return 1;
        }
        else if (a[fieldName] < b[fieldName]) {
            return -1;
        }
        return 0;
    }
};


/***/ }),

/***/ "./src/commands/reload-config.ts":
/*!***************************************!*\
  !*** ./src/commands/reload-config.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const monitor_1 = __webpack_require__(/*! ../monitoring/monitor */ "./src/monitoring/monitor.ts");
const config_manager_1 = __webpack_require__(/*! ../config/config-manager */ "./src/config/config-manager.ts");
const Prompts_1 = __webpack_require__(/*! ./builders/prompts/Prompts */ "./src/commands/builders/prompts/Prompts.ts");
// Main functionality
function reloadConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        monitor_1.default.getInstance().sendEvent('reloadConfig');
        try {
            let result = yield Prompts_1.default.utils.confirmation();
            config_manager_1.default.getInstance().reloadConfig();
            vscode.window.showInformationMessage(`Configuration file was reloaded.`);
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
            monitor_1.default.getInstance().sendError('reloadConfig', { message: err.message, name: err.name, stackTrace: err.stack });
            console.log(err);
        }
    });
}
exports.default = reloadConfig;


/***/ }),

/***/ "./src/commands/reset-config.ts":
/*!**************************************!*\
  !*** ./src/commands/reset-config.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const monitor_1 = __webpack_require__(/*! ../monitoring/monitor */ "./src/monitoring/monitor.ts");
const config_manager_1 = __webpack_require__(/*! ../config/config-manager */ "./src/config/config-manager.ts");
const Prompts_1 = __webpack_require__(/*! ./builders/prompts/Prompts */ "./src/commands/builders/prompts/Prompts.ts");
// Main functionality
function resetConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        monitor_1.default.getInstance().sendEvent('resetConfig');
        try {
            let result = yield Prompts_1.default.utils.confirmation();
            config_manager_1.default.getInstance().resetToDefault();
            vscode.window.showInformationMessage(`Configuration file was reset to default.`);
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
            monitor_1.default.getInstance().sendError('resetConfig', { message: err.message, name: err.name, stackTrace: err.stack });
            console.log(err);
        }
    });
}
exports.default = resetConfig;


/***/ }),

/***/ "./src/config/config-manager.ts":
/*!**************************************!*\
  !*** ./src/config/config-manager.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __webpack_require__(/*! ./config */ "./src/config/config.ts");
const path = __webpack_require__(/*! path */ "path");
const vscode = __webpack_require__(/*! vscode */ "vscode");
const fs = __webpack_require__(/*! fs */ "fs");
const MetadataStructure_1 = __webpack_require__(/*! ../commands/metadatamanagement/profiles/structures/MetadataStructure */ "./src/commands/metadatamanagement/profiles/structures/MetadataStructure.ts");
class ConfigManager {
    constructor() {
        this.getCfgPath = () => path.join(this.getVSCodeRoot(), '.swift-sfdc.json');
        this._currentConfig = undefined;
        this.init();
    }
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new ConfigManager();
        }
        return this.instance;
    }
    retrieveBackwardCompatibleRootFolder() {
        let projRoot = this.getConfig().sfRootFolder;
        if (!projRoot) {
            if (this.autodiscoverProjectStructure() === MetadataStructure_1.default.SF_Original) {
                this.setAntProjectStructure(this.getConfig());
            }
            else {
                this.setSFDXProjectStructure(this.getConfig());
            }
        }
        projRoot = this.getConfig().sfRootFolder;
        return projRoot;
    }
    setSFDXProjectStructure(config) {
        config.sfRootFolder = './force-app/main/default';
        config.metadataStructure = MetadataStructure_1.default.SF_SFDX;
        config.packageLocation = './manifest/';
    }
    setAntProjectStructure(config) {
        config.sfRootFolder = 'src';
        config.metadataStructure = MetadataStructure_1.default.SF_Original;
        config.packageLocation = './';
    }
    getConfig() {
        return this._currentConfig;
    }
    readConfig() {
        if (this.getVSCodeRoot() && fs.existsSync(this.getCfgPath())) {
            const storedCfg = fs.readFileSync(this.getCfgPath(), 'utf8');
            const cfg = JSON.parse(storedCfg);
            return cfg;
        }
        return undefined;
    }
    autodiscoverProjectStructure() {
        console.log('Autodiscoverying Project Structure..');
        let projStructure = MetadataStructure_1.default.SF_SFDX; //defaulting to new structure
        if (fs.existsSync(`${this.getVSCodeRoot()}/src/package.xml`)) {
            projStructure = MetadataStructure_1.default.SF_Original;
        }
        console.log(`Configured ${projStructure} project structure`);
        return projStructure;
    }
    storeConfig(config) {
        try {
            console.log('Storing configuration..');
            fs.writeFileSync(this.getCfgPath(), JSON.stringify(config));
            return true;
        }
        catch (err) {
            return false;
        }
    }
    setConfig(config) {
        try {
            const handler = {
                get(target, property) {
                    return target[property];
                },
                set(target, property, value) {
                    target[property] = value;
                    return ConfigManager.getInstance().storeConfig(target);
                }
            };
            this._currentConfig = new Proxy(config, handler);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    init() {
        console.log('Initializing configuration..');
        if (this._currentConfig === undefined) {
            let config = this.readConfig();
            if (config === undefined) {
                console.log('Configuration not found, generating a new one');
                config = new config_1.default();
                if (this.autodiscoverProjectStructure() === MetadataStructure_1.default.SF_Original) {
                    this.setAntProjectStructure(config);
                }
                else {
                    this.setSFDXProjectStructure(config);
                }
            }
            this.setConfig(config);
            this.storeConfig(this._currentConfig);
        }
    }
    resetToDefault() {
        console.log('Resetting config to default');
        this.setConfig(new config_1.default());
        this.storeConfig(this._currentConfig);
    }
    reloadConfig() {
        let config = this.readConfig();
        if (config === undefined) {
            console.log('Configuration not found, generating a new one');
            config = new config_1.default();
        }
        this.setConfig(config);
        this.storeConfig(this._currentConfig);
    }
    getVSCodeRoot() {
        return vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.path;
    }
}
exports.default = ConfigManager;


/***/ }),

/***/ "./src/config/config.ts":
/*!******************************!*\
  !*** ./src/config/config.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const MetadataStructure_1 = __webpack_require__(/*! ../commands/metadatamanagement/profiles/structures/MetadataStructure */ "./src/commands/metadatamanagement/profiles/structures/MetadataStructure.ts");
class SwiftSfdcConfiguration {
    constructor() {
        this.defaultProfiles = undefined;
        this.metadataStructure = MetadataStructure_1.default.SF_SFDX;
        this.packageLocation = './manifest/';
        this.sfRootFolder = './force-app/main/default';
    }
}
exports.default = SwiftSfdcConfiguration;


/***/ }),

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __webpack_require__(/*! vscode */ "vscode");
const commands_1 = __webpack_require__(/*! ./commands */ "./src/commands/index.ts");
const config_manager_1 = __webpack_require__(/*! ./config/config-manager */ "./src/config/config-manager.ts");
const monitor_1 = __webpack_require__(/*! ./monitoring/monitor */ "./src/monitoring/monitor.ts");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Managing configuration...');
    const cfgMgr = config_manager_1.default.getInstance();
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.createField', commands_1.default.createField));
    context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureDefaultFieldsProfiles', commands_1.default.configureDefaultFieldsProfiles));
    context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureProfilesApexClasses', commands_1.default.configureProfilesApexClasses));
    context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureProfilesApexPages', commands_1.default.configureProfilesApexPages));
    context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureProfilesUserPermissions', commands_1.default.configureProfilesUserPermissions));
    context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureCrossProfileUserPermission', commands_1.default.configureCrossProfileUserPermission));
    context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.configureProfilesFLS', commands_1.default.configureProfilesFLS));
    context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.resetConfig', commands_1.default.resetConfig));
    context.subscriptions.push(vscode.commands.registerCommand('SwiftSfdc.reloadConfig', commands_1.default.reloadConfig));
    vscode.commands.executeCommand('setContext', 'swift-sfdc-active', true);
    monitor_1.default.getInstance().init(context);
    monitor_1.default.getInstance().sendEvent('init');
    console.log('Congratulations, your extension "swift-sfdc" is now active!');
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    monitor_1.default.getInstance().dispose();
}
exports.deactivate = deactivate;


/***/ }),

/***/ "./src/monitoring/monitor.ts":
/*!***********************************!*\
  !*** ./src/monitoring/monitor.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const vscode_extension_telemetry_1 = __webpack_require__(/*! vscode-extension-telemetry */ "./node_modules/vscode-extension-telemetry/lib/telemetryReporter.node.min.js");
const fesTa = Buffer.from('NDk1ZjYzOTItNzE1NC00MjNkLThlYzYtMDNhYmRmNjcyMDA3', 'base64').toString();
class Monitor {
    constructor() {
        this.monitor = undefined;
    }
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new Monitor();
        }
        return this.instance;
    }
    init(context) {
        const extensionId = 'tr4uma.swift-sfdc';
        const extension = vscode.extensions.getExtension(extensionId);
        const extensionVersion = extension.packageJSON.version;
        this.monitor = new vscode_extension_telemetry_1.default(extensionId, extensionVersion, fesTa);
        context.subscriptions.push(this.monitor);
    }
    sendEvent(tag, properties, measurements) {
        try {
            if (this.monitor) {
                this.monitor.sendTelemetryEvent(tag, properties, measurements);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    sendError(tag, properties, measurements) {
        try {
            if (this.monitor) {
                this.monitor.sendTelemetryErrorEvent(tag, properties, measurements);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    dispose() {
        try {
            if (this.monitor) {
                this.monitor.dispose();
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Monitor;


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ "async_hooks":
/*!******************************!*\
  !*** external "async_hooks" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("async_hooks");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "console":
/*!**************************!*\
  !*** external "console" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("console");

/***/ }),

/***/ "constants":
/*!****************************!*\
  !*** external "constants" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("constants");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "module":
/*!*************************!*\
  !*** external "module" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("module");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "perf_hooks":
/*!*****************************!*\
  !*** external "perf_hooks" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("perf_hooks");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("string_decoder");

/***/ }),

/***/ "timers":
/*!*************************!*\
  !*** external "timers" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("timers");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

/******/ });
//# sourceMappingURL=extension.js.map