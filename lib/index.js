'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var Apigen = (function () {
  function Apigen(props) {
    _classCallCheck(this, Apigen);

    props = props || {};
    this.__host = props.host;
    this._debug = _debug2['default']('apigen:' + (props.name || props.host));
  }

  Apigen.prototype.createEndpoint = function createEndpoint(args) {
    var _this = this;

    var apiFn = function apiFn(opts, cb) {
      var _args = args(opts);

      var method = _args.method;
      var path = _args.path;
      var body = _args.body;
      var url = _args.url;
      var attach = _args.attach;
      var statusCodes = _args.statusCodes;

      var otherOpts = _objectWithoutProperties(_args, ['method', 'path', 'body', 'url', 'attach', 'statusCodes']);

      var _method = method.toLowerCase();
      var action = _method === 'get' ? 'query' : 'send';
      var _url = url || '' + (url || _this.__host) + path;
      var req = _superagent2['default'][_method](_url);

      _this._debug('APIGEN[REQUEST]', _extends({}, args(opts)));

      if (attach) {
        attach.forEach(function (itm) {
          var fname = Object.keys(itm)[0];
          req.attach(fname, itm[fname]);
        });
      }

      req[action](_extends({}, body)).end(function (err, res) {

        var status = statusCodes[res.status] || statusCodes['default'];
        var _body = res.body || res.text;
        res.statusDescription = status;

        _this._debug('APIGEN[RESPONSE]:', res);

        if (err) {
          _this._debug('APIGEN[ERROR]:', err);
        }

        var _err = !res.ok ? new Error(status) : null;

        cb(_err, _body, res);
      });
    };

    if (args.name) {
      this[args.name] = apiFn;
    }
    return apiFn;
  };

  return Apigen;
})();

exports['default'] = Apigen;
module.exports = exports['default'];