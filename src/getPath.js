const _ = require('lodash');
var getPath = (node) => {

    var lang = node.lang.substring(0,2)
    var path = []
    var type = node.type

    var slug = _.first(node.slugs)
    if(node.uid !== undefined) {
        slug = node.uid
    }

    if(lang === "de") {
        if(type !== "front_page") {
            path.push(slug)
        } else {
            path.push("/")
        }
    } else {
        path.push(lang)
        path.push(slug)
    }

    return path.join("/")

}

module.exports = getPath
