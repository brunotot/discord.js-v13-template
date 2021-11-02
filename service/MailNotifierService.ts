import { MessageEmbed } from 'discord.js';
import notifier from 'mail-notifier';
import EmbedUtils from '../util/EmbedUtils';
import NotificationUtils from '../util/NotificationUtils';
import discordClientService from './DiscordClientService';

const NEW_NOTIFICATION_FLAG = 'Nova vijest na stranicama tvz.hr';
const TVZ_WEBADMIN_MAIL = 'webadmin@tvz.hr';
const TITLE_FLAG = 'Naslov:';
const TEXT_FLAG = 'Tekst:';
const DATE_CREATED_FLAG = 'Datum objave:';
const DATE_ENDING_FLAG = 'Datum trajanja vijesti:';
const KOLEGIJ_FLAG = 'Mjesto:';

const imap = {
  user: `${process.env.MOJTVZ_USERNAME}@tvz.hr`,
  password: `${process.env.MOJTVZ_PASSWORD}`,
  host: "outlook.office365.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

export default function() {
  notifier(imap)
    .on('mail', async mail => {
      let { text: mailText, from: senders } = mail;
      if (senders.length > 0) {
        let senderAddress: string = senders[0].address;
        if (senderAddress === TVZ_WEBADMIN_MAIL && mailText.includes(NEW_NOTIFICATION_FLAG)) {
          let decodedText: string = NotificationUtils.decodeNotificationText(mailText);
          let title: string = decodedText.substring(NEW_NOTIFICATION_FLAG.length + TITLE_FLAG.length + 1, decodedText.indexOf(TEXT_FLAG)).trim();
          let text: string = decodedText.substring(decodedText.indexOf(TEXT_FLAG) + TEXT_FLAG.length, decodedText.indexOf(DATE_CREATED_FLAG)).trim();
          let dateCreatedString: string = decodedText.substring(decodedText.indexOf(DATE_CREATED_FLAG) + DATE_CREATED_FLAG.length, decodedText.indexOf(DATE_ENDING_FLAG) - 2).trim();
          let dateEndingString: string = decodedText.substring(decodedText.indexOf(DATE_ENDING_FLAG) + DATE_ENDING_FLAG.length, decodedText.indexOf(KOLEGIJ_FLAG)).trim();
          let kolegij: string = decodedText.substring(decodedText.indexOf(KOLEGIJ_FLAG) + KOLEGIJ_FLAG.length + 1).trim();
          text = text.replace(NotificationUtils.getGlobalRegex("\n"), ' ');
          kolegij = kolegij.replace(NotificationUtils.getGlobalRegex("\n"), ' ');
          let dateCreated: {dateAsString: string, date: Date} = NotificationUtils.convertTvzDateDisplayToJavascriptDate(dateCreatedString, true);
          let dateEnding: {dateAsString: string, date: Date} = NotificationUtils.convertTvzDateDisplayToJavascriptDate(dateEndingString, false);

          let discordChannelNameGroups: {newValue: string, originalValue: string}[] = NotificationUtils.extractDiscordChannelNamesFromKolegijString(kolegij);
          for (let discordChannelNameGroup of discordChannelNameGroups) {
            let { originalValue: originalKolegijName, newValue: discordChannelName } = discordChannelNameGroup;
            let textChannel = discordClientService.getChannelByName(discordChannelName);
            if (textChannel) {
              let kolegijId = NotificationUtils.getKeyByValue(NotificationUtils.kolegijiNamesMap, discordChannelName);
              let url = `https://moj.tvz.hr/studijrac/predmet/${kolegijId}`;
              let embed: MessageEmbed = EmbedUtils.buildInfoEmbed(title, text)
                .setAuthor(originalKolegijName, undefined, url)
                .addField('Datum stvaranja obavijesti', dateCreated.dateAsString, true)
                .addField('Datum isteka obavijesti', dateEnding.dateAsString, true)
                .setURL(url)
              await discordClientService.sendNotification(textChannel, embed)
            } else {
              console.log("Nije moguce pronaci kanal pod nazivom: " + discordChannelName);
            }
          }
        }
      }
    })
    .start();
}