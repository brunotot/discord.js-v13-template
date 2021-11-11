import DiscordJS from 'discord.js';
import { ChannelTypes } from 'discord.js/typings/enums';
import Command from '../model/Command';
import { CommandName } from '../model/CommandName';
import { Role } from '../model/Role';
import confirmationRepository from '../repository/ConfirmationRepository';
import studentDiscordUserRepository from '../repository/StudentDiscordUserRepository';
import studentRepository from '../repository/StudentRepository';
import discordClientService from '../service/DiscordClientService';
import EmbedUtils from '../util/EmbedUtils';

export default new Command(
  {
    name: CommandName.CODE,
    description: 'Potvrđuje korisnički identitet prema prosljeđenom potvrdnom kodu.',
    channelTypes: ChannelTypes.DM,
    options: [
      {
        name: 'confirm_code',
        description: 'Potvrdni kod (npr: yvqu52P3oAqHm9w)',
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
      }
    ]
  }, 
  async (interaction) => {
    let { options } = interaction;
    let { id: discordId } = interaction.user;
    let { member: discordMember } = interaction;
    let confirmCode = options.getString("confirm_code")!;
    let thisDiscordUser = discordClientService.memberToDiscordUserMapperFn(discordMember);

    await interaction.deferReply({});

    let sdu = await confirmationRepository.findOneByPredicate(o => o._id.discordId === discordId);
    if (!sdu) {
      let errorTitle = ':x: Greška :x:';
      let errorDescription = `Nista podnijeli TVZ mail.\nMorate prvo izvršiti naredbu "**/email**"`;
      let embed = EmbedUtils.buildErrorEmbed(errorTitle, errorDescription);
      interaction.editReply({ embeds: [embed] })
      return;
    }

    if (confirmCode !== sdu.confirmationCode) {
      let errorTitle = ':x: Krivi potvrdni kod :x:';
      let errorDescription = `Unijeli ste krivi potvrdni kod.\nMolimo Vas provjerite ponovo na "**${sdu._id.email}**"`;
      let embed = EmbedUtils.buildErrorEmbed(errorTitle, errorDescription);
      interaction.editReply({ embeds: [embed] })
      return;
    }

    let email = sdu._id.email;
    let student = await studentRepository.findById(email);
    let nickname = `${student?.ime} ${student?.prezime}`
    let role: Role = student?.studijData.redovni ? Role.REDOVNI : Role.IZVANREDNI;
    await discordClientService.setUserNickname(discordId, nickname);
    await discordClientService.setUserRole(discordId, role);
    await confirmationRepository.deleteById({
      discordId,
      email
    });
    await studentDiscordUserRepository.saveOrUpdate({
      _id: {
        discordId,
        email
      },
      discordUser: thisDiscordUser,
      student: student as any
    })

    let successTitle = ':white_check_mark: Uspješna verifikacija! :white_check_mark:';
    let successDescription = `Verificirani ste i imate ulogu: ${student?.studijData.redovni ? 'REDOVNI' : 'IZVANREDNI'}`;
    let embed = EmbedUtils.buildSuccessEmbed(successTitle, successDescription);
    interaction.editReply({ embeds: [embed] })
    return;
  }
)