import cheerio, { CheerioAPI } from 'cheerio';
import axios from 'axios';
import StringUtils from '../util/StringUtils';

const MOJTVZ_CONTEXT_URI = 'https://moj.tvz.hr';
const AUTH_DATA = {
  login: process.env.MOJTVZ_USERNAME,
  passwd: process.env.MOJTVZ_PASSWORD
}

const executeUntilProceed = async (asyncFn: Function): Promise<any> => {
  try {
    return await asyncFn();
  } catch (e) {
    return await executeUntilProceed(asyncFn);
  }
}

const RequestService = {
  doPost: async (relativeUrl: string, data: any = {}): Promise<CheerioAPI> => {
    let dataWithAuth = {...AUTH_DATA, ...data};
    let urlSearchParams = new URLSearchParams(dataWithAuth);
    let formData = urlSearchParams.toString();
    let fullUrl = `${MOJTVZ_CONTEXT_URI}${relativeUrl}`;
    let response = await axios.request({
      method: 'POST',
      url: fullUrl,
      data: formData,
      responseEncoding: 'binary'
    } as any)
    let utf8DataString = response.data.toString('UTF-8');
    let normalizedDataString = StringUtils.decodeCroatian(utf8DataString);
    return cheerio.load(normalizedDataString);
  },
  executeUntilProceed
}

export default RequestService;