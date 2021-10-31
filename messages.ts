const messages = {
  ALREADY_VERIFIED: "Vec si verificiran!",
  WRONG_CONFIRM_CODE: "Krivi potvrdni kod!",
  NO_SUCH_STUDENT_MESSAGE: "Ne postoji student pod tim imenom!",
  VERIFICATION_UNSUCCESSFUL: "Verifikacija neuspjesna! Kontaktirajte admina.",
  MAIL_SENDING_TOO_FAST: "Prebrzo saljes kodove. Probaj ponovo kasnije.",
  USER_NOT_ON_SERVER_MESSAGE: "Nema te na serveru. Moras biti prisutan na serveru kako bi koristio bota!",
  MAIL_NO_INPUT: "Niste upisali svoj email! Upisite ga (!email pero@tvz.hr).",
  MAIL_TEXT_PREFIX: 'Vaš potvrdni kod je: ',
  MAIL_ERROR_PREFIX: "Error occurred while sending email: ",
  MAIL_SUCCESS_PREFIX: "Email successfully sent: ",
  MAIL_TITLE: 'TVZ discord potvrdni kod',
  MAIL_CONTENT_BEFORE_CONFIRM_CODE: "Vas potvrdni kod je: ",
  MAIL_CONTENT_AFTER_CONFIRM_CODE: "",
  MAIL_INVALID: "Nisi student TVZ-a!",
  HELP_MESSAGE: 
    "prefix: !\n" +
    "naredba: email [test@tvz.hr] -> za dohvacanje potvrdnog koda na mejl\n" + 
    "naredba: code [ABCDEFGHIJ] -> za unos koda i zavrsetak verifikacije",
  VERIFICATION_SUCCESSFUL: "Uspjesno si se verificirao/la!",
  INFO_MESSAGE_AFTER_MAIL_SEND: 
    "Poslali smo ti potvrdni kod na mail. Molimo te da ga ovdje upises u formatu:\n" +
    "```!code ABCDEFGHIJ```",
  WELCOME_MESSAGE: 
    "```Welcome to TVZ discord!\n\n" +
    "Za verifikaciju je potrebno sa vlastitim @tvz mailom poslati mail @Klara#5015 na klara.lovric@tvz.hr ili @1stReconAgent#8709 na antonio.persin@tvz.hr sa sljedećim podacima:\n\n" +
    "Ime i prezime (Pero Perić)\n" +
    "Discord account name (PeroPerić#1234)\n" +
    "Redovni/izvanredni\n\n" +
    "Oni će vam dodijeliti role za pristup serveru. Nakon toga pročitajte ostale informacije u #info kanalu.```",
}

export default messages;