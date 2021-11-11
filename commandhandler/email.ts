import DiscordJS from 'discord.js';
import { ChannelTypes } from 'discord.js/typings/enums';
import Command from '../model/Command';
import { CommandName } from '../model/CommandName';
import confirmationRepository from '../repository/ConfirmationRepository';
import studentDiscordUserRepository from '../repository/StudentDiscordUserRepository';
import studentRepository from '../repository/StudentRepository';
import { IConfirmation } from '../schema/Confirmation';
import discordClientService from '../service/DiscordClientService';
import EmbedUtils from '../util/EmbedUtils';
import MailUtils from '../util/MailUtils';
import StringUtils from '../util/StringUtils';

export default new Command(
  {
    name: CommandName.EMAIL,
    description: 'Šalje potvrdnu šifru na dani mail',
    channelTypes: ChannelTypes.DM,
    options: [
      {
        name: 'tvz_mail',
        description: 'TVZ Mail (npr: pperic@tvz.hr)',
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
      }
    ]
  }, 
  async (interaction) => {
    let { options } = interaction;
    let { id: discordId } = interaction.user;
    let { member: discordMember } = interaction;
    let inputEmail = options.getString("tvz_mail")!;

    let thisDiscordUser = discordClientService.memberToDiscordUserMapperFn(discordMember);
    let { verified, redovni } = thisDiscordUser;
    if (verified) {
      let successTitle = ':white_check_mark: Već ste verificirani :white_check_mark:';
      let successDescription = `Verificirani ste i imate ulogu: ${redovni ? 'REDOVNI' : 'IZVANREDNI'}`;
      let embed = EmbedUtils.buildSuccessEmbed(successTitle, successDescription);
      interaction.reply({ embeds: [embed] })
      return;
    }

    if (!inputEmail.endsWith("@tvz.hr")) {
      let errorTitle = ':no_entry: Validacija neuspješna :no_entry:';
      let errorDescription = `Unešeni mail "**${inputEmail}**" nije validan.\nTVZ mail mora biti formata: <korisničko_ime>@tvz.hr`;
      let embed = EmbedUtils.buildErrorEmbed(errorTitle, errorDescription);
      interaction.reply({ embeds: [embed] })
      return;
    }

    await interaction.deferReply();

    let student = await studentRepository.findById(inputEmail);
    if (!student) {
      let errorTitle = ':no_entry: Niste student TVZ-a :no_entry:';
      let errorDescription = `Unešeni mail "**${inputEmail}**" nije pronađen u bazi podataka TVZ studenata.`;
      let embed = EmbedUtils.buildErrorEmbed(errorTitle, errorDescription);
      interaction.editReply({ embeds: [embed] })
      return;
    }

    let studentDiscordUser = await studentDiscordUserRepository.findByEmail(inputEmail);
    if (studentDiscordUser) {
      let errorTitle = ':no_entry: Mail se već koristi :no_entry:';
      let errorDescription = `Unešeni mail "**${inputEmail}**" već postoji verificiran na korisniku ${studentDiscordUser.discordUser.nickname} (${studentDiscordUser.discordUser.fullUsername}).`;
      let embed = EmbedUtils.buildErrorEmbed(errorTitle, errorDescription);
      interaction.editReply({ embeds: [embed] })
      return;
    }

    let confirmationCode = StringUtils.getConfirmationCode();
    let confirmationEntity: IConfirmation = {
      _id: {
        discordId,
        email: inputEmail
      },
      confirmationCode
    }
    await confirmationRepository.saveOrUpdate(confirmationEntity);
    MailUtils.sendConfirmationCode(inputEmail, confirmationCode);
    let infoTitle = ':ballot_box_with_check: Poslan potvrdni kod na email :ballot_box_with_check:';
    let infoDescription = `Poslali smo potvrdni kod na "**${inputEmail}**".\nDobiveni potvrdni kod zalijepite na sljedećem koraku verifikacije unutar naredbe "**/code <potvrdni-kod>**"`;
    let embed = EmbedUtils.buildInfoEmbed(infoTitle, infoDescription);
    interaction.editReply({ embeds: [embed] });
  }
)