import { ColorResolvable, MessageEmbed } from "discord.js";

const WARNING_COLOR = '#f0ad4e';
const PRIMARY_COLOR = '#0275d8';
const INFO_COLOR = '#5bc0de';
const SUCCESS_COLOR = '#5cb85c';
const DANGER_COLOR = '#d9534f';
const THUMBNAIL_URL = 'https://i.ibb.co/47fWK53/TVZ-background-365.png';

function buildEmbed(color: ColorResolvable, thumbnailUrl: string, title: string, description: string): MessageEmbed {
  return new MessageEmbed()
    .setColor(color)
    .setThumbnail(thumbnailUrl)
    .setTitle(title)
    .setDescription(description);

}

function buildErrorEmbed(title: string, description: string): MessageEmbed {
  return buildEmbed(DANGER_COLOR, THUMBNAIL_URL, title, description);
}

function buildSuccessEmbed(title: string, description: string): MessageEmbed {
  return buildEmbed(SUCCESS_COLOR, THUMBNAIL_URL, title, description);
}

function buildInfoEmbed(title: string, description: string): MessageEmbed {
  return buildEmbed(INFO_COLOR, THUMBNAIL_URL, title, description);
}


const EmbedUtils = {
  buildEmbed,
  buildErrorEmbed,
  buildSuccessEmbed,
  buildInfoEmbed
}

export default EmbedUtils;