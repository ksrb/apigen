'use strict';

import request from 'superagent';
import Debug from 'debug';

class Apigen {
  constructor(props) {
    props = props || {};
    this.__host = props.host;
    this._debug = Debug(`apigen:${props.name || props.host}`);
  }

  createEndpoint(args) {
    let apiFn = (opts, cb) => {
      let {method, path, body, url, attach, statusCodes, ...otherOpts} = args(opts);

      let _method = method.toLowerCase();
      if (_method === 'delete'){
        _method = 'del';
      }

      let action = (_method === 'get') ? 'query' : 'send';
      let _url = url || `${url || this.__host}${path}`;
      let req = request[_method](_url);

      this._debug('APIGEN[REQUEST]', {...args(opts)});

      if (attach) {
        attach.forEach(itm => {
          let fname = Object.keys(itm)[0];
          req.attach(fname, itm[fname]);
        });
      }

      req[action]({...body})
        .end((err, res) => {

          let status = statusCodes[res.status] || statusCodes.default;
          let _body = res.body || res.text;
          res.statusDescription = status;

          this._debug('APIGEN[RESPONSE]:', res);

          if (err) {
            this._debug('APIGEN[ERROR]:', err);
          }

          let _err = (!res.ok) ? new Error(status) : null;

          cb(_err, _body, res);
        });
    };

    if (args.name) {
      this[args.name] = apiFn;
    }
    return apiFn;
  }
}

export default Apigen;

