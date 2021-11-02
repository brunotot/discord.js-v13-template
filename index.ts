import dotenv from 'dotenv'; dotenv.config();
import discordClientService from './service/DiscordClientService'
import Event from './model/Event';
import schedule from 'node-schedule';
import StringUtils from './util/StringUtils';
import StudentRepository from './repository/StudentRepository';
import mailNotifierServiceFn from './service/MailNotifierService';
import DatabaseService from './service/DatabaseService';

(async function() {
  await DatabaseService();
  let events = await Event.getConfiguredEvents();
  events.forEach(event => discordClientService.on(event));
  discordClientService.init();
  schedule.scheduleJob(
    StringUtils.CRON_TWICE_IN_OCTOBER, 
    async () => await StudentRepository.updateStudentsData(true)
  );
  mailNotifierServiceFn();
})();
