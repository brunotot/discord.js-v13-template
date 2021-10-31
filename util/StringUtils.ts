const CROATIAN_LETTERS_MAP: any = {
  'è': 'č',
  '\x8E': 'Ž',
  'æ': 'ć',
  '\x9A': 'š',
  '\x8A': 'Š',
  '\x9E': 'ž',
  'Æ': 'Ć',
  'È': 'Č',
  'ð': 'đ'
}
const CRON_TWICE_IN_OCTOBER = '0 0 3 10,30 10 *'

const StringUtils = {
  CRON_TWICE_IN_OCTOBER,
  CROATIAN_LETTERS_MAP,

  getConfirmationCode: function(length: number = 15) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  decodeCroatian: (string = '') => !string ? '' : Object
    .keys(CROATIAN_LETTERS_MAP)
    .reduce(
      (accum, key) => accum.replace(
        new RegExp(key, 'g'), 
        CROATIAN_LETTERS_MAP[key]
      ), 
      string
    ),

  decodeEnglish: (string = '') => !string ? '' : string
    .replace('č', 'c')
    .replace('š', 's')
    .replace('ž', 'z')
    .replace('ć', 'c')
    .replace('đ', 'd')
    .replace('Č', 'C')
    .replace('Š', 'S')
    .replace('Ž', 'Z')
    .replace('Ć', 'C')
    .replace('Đ', 'D')
}

export default StringUtils;