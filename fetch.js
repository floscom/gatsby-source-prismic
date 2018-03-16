'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var pagedGet = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(client) {
    var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var page = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var pageSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 100;
    var aggregatedResponse = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var mergedOptions, response;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mergedOptions = (0, _assign2.default)({
              lang: '*'
            }, options);
            _context2.next = 3;
            return client.query(query, (0, _extends3.default)({}, mergedOptions, {
              page: page,
              pageSize: pageSize
            }));

          case 3:
            response = _context2.sent;


            if (!aggregatedResponse) {
              aggregatedResponse = response.results;
            } else {
              aggregatedResponse = aggregatedResponse.concat(response.results);
            }

            if (!(page * pageSize < response.total_results_size)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', pagedGet(client, query, options, page + 1, pageSize, aggregatedResponse));

          case 7:
            return _context2.abrupt('return', aggregatedResponse);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function pagedGet(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var _prismicJavascript = require('prismic-javascript');

var _prismicJavascript2 = _interopRequireDefault(_prismicJavascript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var repositoryName = _ref2.repositoryName,
        accessToken = _ref2.accessToken;
    var apiEndpoint, client, documents;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.time(' Fetch Prismic data');
            console.log('Starting to fetch all data from Prismic');

            apiEndpoint = 'https://' + repositoryName + '.prismic.io/api/v2';
            _context.next = 5;
            return _prismicJavascript2.default.getApi(apiEndpoint, { accessToken: accessToken });

          case 5:
            client = _context.sent;
            _context.next = 8;
            return pagedGet(client);

          case 8:
            documents = _context.sent;


            console.timeEnd(' Fetch Prismic data');

            return _context.abrupt('return', {
              documents: documents
            });

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();