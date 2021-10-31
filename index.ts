import dotenv from 'dotenv';
import discordClientService from './service/DiscordClientService'
import Event from './model/Event';
import schedule from 'node-schedule';
import StringUtils from './util/StringUtils';
import StudentRepository from './repository/StudentRepository';
dotenv.config();

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

(async function() {
  await import('./service/DatabaseService');
  let events = await Event.getConfiguredEvents();
  events.forEach(event => discordClientService.on(event));
  discordClientService.init();
  schedule.scheduleJob(
    StringUtils.CRON_TWICE_IN_OCTOBER, 
    async () => await StudentRepository.updateStudentsData(true)
  );
})();
