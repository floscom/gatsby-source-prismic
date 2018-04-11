import PrismicDOM from 'prismic-dom'
import createNodeHelpers from 'gatsby-node-helpers'
import pipe from 'lodash/fp/pipe'
import _ from 'lodash'
import fetchData from './fetch'

const { createNodeFactory } = createNodeHelpers({ typePrefix: `Prismic` })

function clear(data) {
    if(data === undefined || data === null) {
        return data
    }
    Object.keys(data).forEach((key) => {
    		if(Array.isArray(data[key])) {
        	data[key]= []
        } else if(typeof data[key] === "object") {
            data[key] = clear(data[key])
        } else {
            data[key] = undefined
        }
    })
    return data
}

export const sourceNodes = async (
    { boundActionCreators: { createNode } },
    { repositoryName, accessToken }
) => {
    const { documents } = await fetchData({ repositoryName, accessToken })
    var createNodeFunction = {}
    documents.forEach(doc => {
        if(!_.findKey(createNodeFunction, doc.type)) {
            createNodeFunction[doc.type] = createNodeFactory(doc.type + "Document")
        }
    })

    var template = {}
    documents.forEach(doc => {
        if(template[doc.type] === undefined) {
            template[doc.type] = {}
        }
        template[doc.type] = Object.assign(template[doc.type], doc);
    })

    Object.keys(template).forEach((key) => {
        var emptyData = JSON.parse(JSON.stringify(template[key]))
        template[key] = clear(emptyData)
    })

    documents.forEach(doc => {
        Object.keys(doc.data).forEach(key => {
            if(_.findKey(doc.data[key], "type")) {
                doc.data[key+"_html"] = PrismicDOM.RichText.asHtml(doc.data[key], {}, htmlSerializer)
            }
        })
        var mergedDoc = Object.assign(template[doc.type], doc);
        var newDoc = createNodeFunction[doc.type](mergedDoc)
        newDoc.id = doc.id
        createNode(newDoc)
    })
}

const Elements = PrismicDOM.RichText.Elements;
const htmlSerializer = function (element, content, children) {
  switch(element.type) {
    case Elements.heading1: return `<h1>${children.join('')}</h1>`;
    case Elements.heading2: return `<h2>${children.join('')}</h2>`;
    case Elements.heading3: return `<h3>${children.join('')}</h3>`;
    case Elements.heading4: return `<h4>${children.join('')}</h4>`;
    case Elements.heading5: return `<h5>${children.join('')}</h5>`;
    case Elements.heading6: return `<h6>${children.join('')}</h6>`;
    case Elements.paragraph: return `<p>${children.join('')}</p>`;
    case Elements.preformatted: return `<pre>${children.join('')}</pre>`;
    case Elements.strong: return `<strong>${children.join('')}</strong>`;
    case Elements.em: return `<em>${children.join('')}</em>`;
    case Elements.listItem: return `<li>${children.join('')}</li>`;
    case Elements.oListItem: return `<li>${children.join('')}</li>`;
    case Elements.list: return `<ul>${children.join('')}</ul>`;
    case Elements.oList: return `<ol>${children.join('')}</ol>`;
    case Elements.image:
      var linkUrl = element.linkTo ? PrismicDOM.Link.url(element.linkTo, module.exports.linkResolver) : null;
      var linkTarget = element.linkTo && element.linkTo.target ? `target="${element.linkTo.target}" rel="noopener"` : '';
      var wrapperClassList = [element.label || '', 'block-img'];
      var img = `<img src="${element.url}" alt="${element.alt || ''}" copyright="${element.copyright || ''}">`;
      return (`
        <p class="${wrapperClassList.join(' ')}">
          ${linkUrl ? `<a ${linkTarget} href="${linkUrl}">${img}</a>` : img}
        </p>
      `);
    case Elements.embed:
      return (`
        <div data-oembed="${element.oembed.embed_url}"
          data-oembed-type="${element.oembed.type}"
          data-oembed-provider="${element.oembed.provider_name}"
        >
          ${element.oembed.html}
        </div>
      `);
    case Elements.hyperlink:
      var target = element.data.target ? `target="${element.data.target}" rel="noopener"` : '';
      var linkUrl = PrismicDOM.Link.url(element.data, module.exports.linkResolver);
      return `<a ${target} href="${linkUrl}">${children.join('')}</a>`
    case Elements.label:
      var label = element.data.label ? ` class="${element.data.label}"` : '';
      return `<span ${label}>${children.join('')}</span>`;
    case Elements.span: return content ? content.replace(/\n/g, "<br />") : '';
    default: return null;
  }
};
