const config = require('./config.js');

// 剔除对象的一些字段
let Omit = function (o, keys) {
  if (!keys) {
    return o;
  }
  let _keys = Object.keys(o);
  let result = {};
  let ignore = typeof keys === 'string' ? [keys] : keys;
  _keys.forEach((v) => {
    if (ignore.indexOf(v) === -1) {
      result[v] = o[v];
    }
  })
  return result;
}

// 获取随机字符串
const GetKey = function (type, length) {
  let _type = type || 26; //26纯英文，36英文数字混合
  let _length = length || 4;
  let s = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  let result = '';
  for (let i = 0; i < _length; i++) {
    let c = s[Math.floor(Math.random() * (_type))].toString();
    Math.random() > 0.5 && (c = c.toUpperCase());
    result += c;
  }
  return result;
}

/**
 * 获取树的根节点列表
 * @param {Array} l 数据源
 */
const root = function (l) {
  let result = [];
  let left = [];
  l.forEach((v, i) => {
    if (!v.parentKey) {
      result.push({
        _id: v._id,
        title: v.text,
        value: v.key,
        key: v.key,
        icon: v.icon,
        ico: v.ico,
        color: v.color,
        children: []
      });
    } else {
      left.push({
        _id: v._id,
        title: v.text,
        value: v.key,
        key: v.key,
        icon: v.icon,
        ico: v.ico,
        color: v.color,
        children: [],
        parentKey: v.parentKey
      })
    }
  })
  return [result, left];
}
/**
 * 递归
 * @param {Array} root 
 * @param {Array} left 
 */
const loop = function (root, left) {
  root.forEach((v, i) => {
    const r = find(left, v.value);
    const f = r[0];
    const s = r[1];
    root[i].children = [...f];
    if (f.length > 0 && s.length > 0) {
      loop(f, s);
    }
  })
}
/**
 * 根据k获取数据的children列表
 * @param {Array} l 数据
 * @param {String} k parentKey 指向值
 */
const find = function (l, k) {
  let result = [];
  let left = [];
  l.forEach((v, i) => {
    if (v.parentKey === k) {
      result.push(v);
    } else {
      left.push(v);
    }
  })
  return [result, left];
}

const SSRParse = function(template, context) {
  // const activeTab = this.state.activeTab; // TODO 根据不同框架和文件类型生成代码
  let page = template.toString();
  // 匹配 <ssr></ssr> 形式模板
  let $ = page.match(/<ssr[^>]*>(?:.|[\r\n])*?<\/ssr>/g);

  /**
   * 从model中获取带点参数的最终值
   * @param {String} _v 模板字符串中的值  
   * @param {Object} _model model域数据
   */
  let layered = function (_v, _model) {
    if (_v.indexOf('.') === -1) {
      return _model[_v] || _model;
    } else {
      let a = _v.split('.');
      let k = a[0];
      a.shift();
      return layered(a.join('.'), _model[k]);
    }
  }

  let did = function (s, context) {
    const f = new Function('data', s)
    return f(context)
  }

  // 遍历获取到的模板字符串数组
  $.forEach(function (v, i, a) {
    let _v = v.replace(/<ssr>|<\/ssr>/g, '').trim();
    let _r = did(_v, context);
    page = page.replace(v, _r);
  })

  return page;
};

module.exports = {
  Omit,
  GetKey,
  Tree: {
    root,
    find,
    loop
  },
  SSRParse
}