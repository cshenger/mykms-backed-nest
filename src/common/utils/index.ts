const crypto = require('crypto');

// 判断是不是空对象
export function isEmptyObject(obj) {
  for (var key in obj) {
    //返回false，不为空对象
    return false;
  }
  return true; //返回true，为空对象
}

// 分页函数
export function sqlPa(params) {
  let m = (params.current - 1) * params.pageSize;
  let n = params.pageSize;

  return {
    m,
    n
  }
}

// 计算分页
export function pages(params) {
  let limit = parseInt(params.pageSize);
  let offset = parseInt(params.current) * parseInt(params.pageSize) - parseInt(params.pageSize);

  return {
    start: offset,
    end: limit * parseInt(params.current)
  }
}

// md5加密
export function getMd5Data(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

// 合成查询条件
export function renderWhere(params, ary) {
  let where = {};
  ary.forEach(item => {
    if (!!params && params.hasOwnProperty(item) && params[item] != '') {
      where[item] = params[item];
    }
  });

  return where
}

// select like
export function selLike(where, name) {
  return `${name} like "%${where.hasOwnProperty(name) ? where[name] : ''}%"`;
}

module.exports = {
  isEmptyObject,
  sqlPa,
  getMd5Data,
  pages,
  renderWhere,
  selLike
}