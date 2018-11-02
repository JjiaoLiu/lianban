import {addrMap} from "../assets/js/addr";

const addrMapString = JSON.stringify(addrMap);

export function codeFilter(value) {
  var pattern = '"code":"' + value + '","region":"[\u4e00-\u9fa5]+"';
  var reg = new RegExp(pattern);
  var result = reg.exec(addrMapString);
  if (result) {
    return JSON.parse('{' + result[0] + '}').region
  }
  return ""
}
