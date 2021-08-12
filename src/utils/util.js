/**
 * 工具函数封装
 */

export default {
  formateDate(date, rule) {
      
    if (typeof date === 'string') {
      date = new Date(date)
    }
    console.log(date, 'typeof date')
    let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
    const o = {
      'y+': date.getFullYear(),
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const val = `${o[k]}`
        // egExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串，以此类推，RegExp.$2，RegExp.$3，..RegExp.$99总共可以有99个匹配
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1)
      }
    }
    return fmt
  }
}