'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceNodes = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _prismicDom = require('prismic-dom');

var _prismicDom2 = _interopRequireDefault(_prismicDom);

var _gatsbyNodeHelpers = require('gatsby-node-helpers');

var _gatsbyNodeHelpers2 = _interopRequireDefault(_gatsbyNodeHelpers);

var _pipe = require('lodash/fp/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createNodeHelpers = (0, _gatsbyNodeHelpers2.default)({ typePrefix: 'Prismic' }),
    createNodeFactory = _createNodeHelpers.createNodeFactory;

var sourceNodes = exports.sourceNodes = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2, _ref3) {
    var createNode = _ref2.boundActionCreators.createNode;
    var repositoryName = _ref3.repositoryName,
        accessToken = _ref3.accessToken;

    var _ref4, documents, createNodeFunction;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _fetch2.default)({ repositoryName: repositoryName, accessToken: accessToken });

          case 2:
            _ref4 = _context.sent;
            documents = _ref4.documents;
            createNodeFunction = {};

            documents.forEach(function (doc) {
              if (!_lodash2.default.findKey(createNodeFunction, doc.type)) {
                createNodeFunction[doc.type] = createNodeFactory(doc.type + "Document");
              }
            });
            documents.forEach(function (doc) {
              (0, _keys2.default)(doc.data).forEach(function (key) {
                if (_lodash2.default.findKey(doc.data[key], "type")) {
                  doc.data[key + "_html"] = _prismicDom2.default.RichText.asHtml(doc.data[key], {}, htmlSerializer);
                }
              });
              var newDoc = createNodeFunction[doc.type](doc);
              newDoc.id = doc.id;
              createNode(newDoc);
            });

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function sourceNodes(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var Elements = _prismicDom2.default.RichText.Elements;
var htmlSerializer = function htmlSerializer(element, content, children) {
  switch (element.type) {
    case Elements.heading1:
      return '<h1>' + children.join('') + '</h1>';
    case Elements.heading2:
      return '<h2>' + children.join('') + '</h2>';
    case Elements.heading3:
      return '<h3>' + children.join('') + '</h3>';
    case Elements.heading4:
      return '<h4>' + children.join('') + '</h4>';
    case Elements.heading5:
      return '<h5>' + children.join('') + '</h5>';
    case Elements.heading6:
      return '<h6>' + children.join('') + '</h6>';
    case Elements.paragraph:
      return '<p>' + children.join('') + '</p>';
    case Elements.preformatted:
      return '<pre>' + children.join('') + '</pre>';
    case Elements.strong:
      return '<strong>' + children.join('') + '</strong>';
    case Elements.em:
      return '<em>' + children.join('') + '</em>';
    case Elements.listItem:
      return '<li>' + children.join('') + '</li>';
    case Elements.oListItem:
      return '<li>' + children.join('') + '</li>';
    case Elements.list:
      return '<ul>' + children.join('') + '</ul>';
    case Elements.oList:
      return '<ol>' + children.join('') + '</ol>';
    case Elements.image:
      var linkUrl = element.linkTo ? _prismicDom2.default.Link.url(element.linkTo, module.exports.linkResolver) : null;
      var linkTarget = element.linkTo && element.linkTo.target ? 'target="' + element.linkTo.target + '" rel="noopener"' : '';
      var wrapperClassList = [element.label || '', 'block-img'];
      var img = '<img src="' + element.url + '" alt="' + (element.alt || '') + '" copyright="' + (element.copyright || '') + '">';
      return '\n        <p class="' + wrapperClassList.join(' ') + '">\n          ' + (linkUrl ? '<a ' + linkTarget + ' href="' + linkUrl + '">' + img + '</a>' : img) + '\n        </p>\n      ';
    case Elements.embed:
      return '\n        <div data-oembed="' + element.oembed.embed_url + '"\n          data-oembed-type="' + element.oembed.type + '"\n          data-oembed-provider="' + element.oembed.provider_name + '"\n        >\n          ' + element.oembed.html + '\n        </div>\n      ';
    case Elements.hyperlink:
      var target = element.data.target ? 'target="' + element.data.target + '" rel="noopener"' : '';
      var linkUrl = _prismicDom2.default.Link.url(element.data, module.exports.linkResolver);
      return '<a ' + target + ' href="' + linkUrl + '">' + children.join('') + '</a>';
    case Elements.label:
      var label = element.data.label ? ' class="' + element.data.label + '"' : '';
      return '<span ' + label + '>' + children.join('') + '</span>';
    case Elements.span:
      return content ? content.replace(/\n/g, "<br />") : '';
    default:
      return null;
  }
};