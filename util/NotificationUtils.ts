const TVZ_NOTIFICATION_LETTERS_MAP: { [key: string]: string } = {
  '&nbsp;': ' ',
  'Å¾': 'ž',
  'Ä‡': 'ć',
  'Ä ': 'č',
  'è': 'č',
  'Å¡': 'š',
  'Ä‘': 'đ'
}

const kolegijiNamesMap = {
  '200101': 'administracija-računalnih-mreža',
  '147088': 'administriranje-unix-sustava',
  '154952': 'algoritmi-i-strukture-podataka',
  '154954': 'arhitektura-računala',
  '85250': 'baze-podataka',
  '223318': 'duboko-učenje',
  '84849': 'engleski-jezik-za-računarstvo',
  '154955': 'fizika',
  '143073': 'kineziološka-kultura-i',
  '143075': 'kineziološka-kultura-ii',
  '143076': 'kineziološka-kultura-iii',
  '143077': 'kineziološka-kultura-iv',
  '22742': 'matematika-i',
  '22730': 'matematika-ii',
  '200086': 'metodologija-poslovnih-procesa',
  '200082': 'metodologija-stručnog-i-istraživačkog-rada',
  '22720': 'mrežne-usluge',
  '212894': 'napredne-baze-podataka',
  '212735': 'napredne-tehnike-programiranja',
  '152537': 'napredne-teme-računalnih-mreža',
  '156035': 'napredno-javascript-programiranje',
  '142130': 'napredno-programiranje-u-jeziku-python',
  '22722': 'nekonvencionalni-računalni-postupci',
  '81892': 'objektno-orijentirano-programiranje',
  '195334': 'oblikovanje-e-literature',
  '83677': 'oblikovanje-web-stranica',
  '22735': 'operacijski-sustavi',
  '154957': 'osnove-elektrotehnike-i-elektronike',
  '111724': 'otvorene-platforme-za-razvoj-ugrađenih-sustava',
  '85204': 'poslovni-engleski-jezik-za-računarstvo',
  '154959': 'primjena-računala',
  '154960': 'programiranje',
  '154961': 'programiranje-u-jeziku-java',
  '75220': 'programiranje-web-aplikacija',
  '22698': 'računala-za-nadzor-i-upravljanje-tehnickim-procesima',
  '154963': 'računalne-mreže',
  '111519': 'razvoj-aplikacija-na-android-platformi',
  '148934': 'razvoj-računalnih-igara',
  '111517': 'razvoj-web-aplikacija-u-asp.net-mvc-tehnologiji',
  '194673': 'sigurnost-računalnih-sustava',
  '200090': 'stručna-praksa',
  '63200': 'uvod-u-unix-sustave',
  '212892': 'uvod-u-web-tehnologije',
  '155826': 'vjerojatnost-i-statistika',
  '75223': 'web-aplikacije-u-javi',
  '200088': 'završni-rad',
}

function getIndicesOfSubstring (searchKeyword: string, str: string): number[] {
  let startingIndices = [];
  let indexOccurence = str.indexOf(searchKeyword, 0);

  while (indexOccurence >= 0) {
      startingIndices.push(indexOccurence);
      indexOccurence = str.indexOf(searchKeyword, indexOccurence + 1);
  }
  
  return startingIndices;
}

function extractDiscordChannelNamesFromKolegijString(kolegij: string): {newValue: string, originalValue: string}[] {
  let namesMap: {[key: string]: string} = {};
  let indicesRedovni: number[] = getIndicesOfSubstring(" (rac)", kolegij);
  let indicesIzvanredni: number[] = getIndicesOfSubstring(" (irac)", kolegij);
  let indices = [...indicesRedovni, ...indicesIzvanredni];
  for (let endIndex of indices) {
    let sub = kolegij.substring(0, endIndex);
    let startIndex = sub.lastIndexOf(') ') + 2;
    if (startIndex === 1) startIndex = 0;
    let originalValue = kolegij.substring(startIndex, endIndex);
    let newValue = originalValue
      .replace(getGlobalRegex('-'), '')
      .replace(getGlobalRegex(' '), '-')
      .toLowerCase();
    namesMap[newValue] = originalValue;
  }
  return Object.entries(namesMap).map(([newValue, originalValue]) => ({newValue, originalValue}));
}

function getKeyByValue(object: {[key: string]: string}, value: string): string {
  return Object.keys(object).find(key => object[key] === value) || '';
}

function convertTvzDateDisplayToJavascriptDate(dateString: string, isDateCreated: boolean): {dateAsString: string, date: Date} {
  const zeroPad = (num: number) => String(num).padStart(2, '0')
  let dateRegex = /(\.|, |:)/g;
  let dateStringSplit = dateString.split(dateRegex);
  let dd: number = Number(dateStringSplit[isDateCreated ? 0 : 2]);
  let originalMm: number = Number(dateStringSplit[isDateCreated ? 2 : 0]);
  let mm = originalMm - 1;
  let yyyy: number = Number(dateStringSplit[4]);
  let HH: number = Number(dateStringSplit[6]);
  let MM: number = Number(dateStringSplit[8]);
  let date = new Date(yyyy, mm, dd, HH, MM);
  let dateAsString: string = `${zeroPad(dd)}.${zeroPad(originalMm)}.${zeroPad(yyyy)} ${zeroPad(HH)}:${zeroPad(MM)}h`;
  return {date, dateAsString};
}

function getGlobalRegex(regexString: string) {
  return new RegExp(regexString, 'g');
}

function decodeNotificationText(text: string) {
  return !text ? '' : Object
    .keys(TVZ_NOTIFICATION_LETTERS_MAP)
    .reduce(
      (accum, key) => accum.replace(
        new RegExp(key, 'g'), 
        TVZ_NOTIFICATION_LETTERS_MAP[key]
      ), 
      text
    )
    .replace(/ +(?= )/g, '')
}

const NotificationUtils = {
  kolegijiNamesMap,
  decodeNotificationText,
  getGlobalRegex,
  getIndicesOfSubstring,
  extractDiscordChannelNamesFromKolegijString,
  getKeyByValue,
  convertTvzDateDisplayToJavascriptDate
}

export default NotificationUtils;