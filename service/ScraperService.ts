import cliProgress from 'cli-progress';
import { IStudent } from '../schema/Student';
import { buildStudijData, IStudijData, StudijData } from '../schema/StudijData';
import RequestService from './RequestService';

const STUDIJ_SELECTION_BUTTONS_SELECTOR = '#studijSel .btn-group-vertical .btn-group button';
const STARTING_URL = '/studijelo';
const KOLEGIJ_DROPDOWN_OPTIONS_SELECTOR = '#e1 option';
const STUDENT_PODACI_TABLE_SELECTOR = '#podaci tbody tr';
const INDEX_JMBAG = 2;
const INDEX_IME = 4;
const INDEX_PREZIME = 3;
const INDEX_EMAIL = 6;
const INDEX_TELEFON = 7;

const ScraperService = {
  getStudijIds: async (): Promise<{[key: string]:string}> => {
    let $ = await RequestService.doPost(STARTING_URL);
    let $studijSelectionButtons = $(STUDIJ_SELECTION_BUTTONS_SELECTOR)
    let $studijSelectionButtonsArray = Array.from($studijSelectionButtons);
    let studijIdsMap: {[key: string]:string} = {};
    $studijSelectionButtonsArray.forEach(o => {
      let firstChild = o.children[0] as any;
      let onclickString = o.attribs.onclick;
      let indexOfQueryParamStart = onclickString.indexOf('?TVZ=');
      let startSubstring = "window.location.href='";
      let studijId = onclickString.substring(startSubstring.length + 1, indexOfQueryParamStart);
      let text = firstChild.data;
      studijIdsMap[studijId] = text;
    });
    return studijIdsMap;
  },
  getKolegijiPerStudij: async (studijIdsMap: {[key: string]: string} = {}): Promise<{[key: string]: {studijName: string, urls: string[]}}> => {
    let kolegijiPerStudij: {[key: string]: {studijName: string, urls: string[]}} = {};
    let studijIds = Object.keys(studijIdsMap);
    for (let studijId of studijIds) {
      let studijName = studijIdsMap[studijId];
      let urls: string[] = [];

      let relativeUrl = `/${studijId}`;
      let $ = await RequestService.doPost(relativeUrl);
      let $kolegijOptions = $(KOLEGIJ_DROPDOWN_OPTIONS_SELECTOR);
      let $kolegijOptionsArray = Array.from($kolegijOptions);
      let $kolegijOptionsArrayNormalized = $kolegijOptionsArray.slice(1);
      let kolegijOptionIds = $kolegijOptionsArrayNormalized.map(o => o.attribs.value);
      kolegijOptionIds.forEach(kolegijId => urls.push(`/${studijId}/predmet/${kolegijId}`));

      kolegijiPerStudij[studijId] = {
        studijName,
        urls
      }
    }
    return kolegijiPerStudij;
  },
  getStudentsArray: async (kolegijiPerStudij: {[key: string]: {studijName: string, urls: string[]}}) => {
    let studentsMap: {[key: string]: IStudent} = {};
    let i = 1;

    let kolegijLength = Object.keys(kolegijiPerStudij).reduce(
      (accum, studijId) => accum + kolegijiPerStudij[studijId].urls.length, 
      0
    );

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(kolegijLength, i);

    for (let studijId in kolegijiPerStudij) {
      for (let kolegijUrl of kolegijiPerStudij[studijId].urls) {
        let $ = await RequestService.executeUntilProceed(async () => await RequestService.doPost(kolegijUrl, {supporttype: 'prij'}));
        let $studentPodaciTable = $(STUDENT_PODACI_TABLE_SELECTOR);
        let studentPodaciTableArray = Array.from($studentPodaciTable);
        let studijName = kolegijiPerStudij[studijId].studijName;
        for (let studentPodaci of studentPodaciTableArray) {
          let tableRowChildren = (studentPodaci as any).children;
          let jmbag = tableRowChildren[INDEX_JMBAG].children[0]?.data;
          let ime = tableRowChildren[INDEX_IME].children[0]?.data;
          let prezime = tableRowChildren[INDEX_PREZIME].children[0]?.data;
          let studijData: IStudijData;
          if (!(studijId in StudijData)) {
            console.log(`${studijId}:${studijName} ne postoji u StudijData objektu. Koristiti ce se buildStudijData()`);
            studijData = buildStudijData(studijName);
          } else {
            studijData = StudijData[studijId]
          }
          let email = tableRowChildren[INDEX_EMAIL].children[0]?.data;
          let telefon = tableRowChildren[INDEX_TELEFON].children[0]?.data || '';
          let student: IStudent = { jmbag, ime, prezime, studijData, _id: email, telefon };
          studentsMap[jmbag] = student;
        }
        progressBar.update(i);
        i++;
      }
    }

    progressBar.stop();
    return Object.values(studentsMap);
  }
}

export default ScraperService;