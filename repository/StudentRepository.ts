import Student, { IStudent } from "../schema/Student";
import ScraperService from "../service/ScraperService";
import StringUtils from "../util/StringUtils";
import BaseRepository from "./BaseRepository";

class StudentRepository extends BaseRepository<IStudent, String> {
  constructor() {
    super(Student);
  }

  /**
   * Updates MongoDB Student collection with fresh data from moj.tvz.hr
   * If force is true or current number of students in collection is 0 - execution 
   * of the function takes a maximum of 30 minutes. Otherwise execution is instant.
   * @param force true, if refresh should happen even if data already exists
   */
  updateStudentsData: (force?: boolean) => Promise<void> = async (force: boolean = false) => {
    if (force || await this.countAll() === 0) {
      await this.removeAll();
      let dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + 30);
      let hh = dateNow.getHours();
      let mm = dateNow.getMinutes();
      console.log(`Fetching data from moj.tvz.hr.\nExecution is estimated to finish around ${hh}:${mm}h`);
      let studijIds = await ScraperService.getStudijIds(); // 500 ms
      let kolegijiPerStudij = await ScraperService.getKolegijiPerStudij(studijIds); // 15 s
      let students: IStudent[] = await ScraperService.getStudentsArray(kolegijiPerStudij); // 1560 s
      await this.saveOrUpdate(students) // 15 s
    }
  }

  findStudentByDiscordNickname: (nickname: string) => Promise<{student: IStudent, duplicate: boolean} | null> = async (nickname: string = '') => {
    let nicknameNormalized = StringUtils.decodeEnglish(nickname).toLowerCase();
    let matches = await this.findByPredicate((s: IStudent) => {
      let studentNickname =  StringUtils.decodeEnglish(s.ime + ' ' + s.prezime).toLowerCase();
      return studentNickname === nicknameNormalized;
    });
    if (matches.length === 0) return null;
    let duplicate: boolean = false;
    if (matches.length > 1) duplicate = true;;
    return { student: matches[0], duplicate };
  }
}

export default new StudentRepository();