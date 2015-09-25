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
        .end((res) => {
          this._debug('APIGEN[RESPONSE]:', res);
          let status = statusCodes[res.status] || statusCodes.default;
          let err = (!res.ok) ? new Error(status) : null;
          let _body = res.body || res.text;
          cb(err, _body);
        });
    };

    if (args.name) {
      this[args.name] = apiFn;
    }
    return apiFn;
  }
}

export default Apigen;

