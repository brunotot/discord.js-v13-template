import mongoose from "mongoose";
import { Smjer } from "../model/Smjer";

export interface IStudijData {
  latest: boolean;
  redovni: boolean;
  preddiplomski: boolean;
  smjer: Smjer;
}

export const StudijData: { [key: string]: IStudijData; } = {
  studijelo: {latest: true, redovni: true, preddiplomski: true, smjer: Smjer.ELEKTROTEHNIKA},
  studijgra: {latest: true, redovni: true, preddiplomski: true, smjer: Smjer.GRADITELJSTVO},
  studijinf: {latest: true, redovni: true, preddiplomski: true, smjer: Smjer.INFORMATIKA},
  studijmeh: {latest: true, redovni: true, preddiplomski: true, smjer: Smjer.MEHATRONIKA},
  studijrac: {latest: true, redovni: true, preddiplomski: true, smjer: Smjer.RAČUNARSTVO},
  studijielo: {latest: true, redovni: false, preddiplomski: true, smjer: Smjer.ELEKTROTEHNIKA},
  studijigra: {latest: true, redovni: false, preddiplomski: true, smjer: Smjer.GRADITELJSTVO},
  studijiinf: {latest: true, redovni: false, preddiplomski: true, smjer: Smjer.INFORMATIKA},
  studijimeh: {latest: true, redovni: false, preddiplomski: true, smjer: Smjer.MEHATRONIKA},
  studijirac: {latest: true, redovni: false, preddiplomski: true, smjer: Smjer.RAČUNARSTVO},
  studijistro: {latest: true, redovni: false, preddiplomski: true, smjer: Smjer.STROJARSTVO},
  studijspecelo: {latest: false, redovni: true, preddiplomski: false, smjer: Smjer.ELEKTROTEHNIKA},
  studijspecgra: {latest: false, redovni: true, preddiplomski: false, smjer: Smjer.GRADITELJSTVO},
  studijspecinf: {latest: false, redovni: true, preddiplomski: false, smjer: Smjer.INFORMATIKA},
  studijspecelo1: {latest: true, redovni: true, preddiplomski: false, smjer: Smjer.ELEKTROTEHNIKA},
  studijspecgra1: {latest: true, redovni: true, preddiplomski: false, smjer: Smjer.GRADITELJSTVO},
  studijspecinf1: {latest: true, redovni: true, preddiplomski: false, smjer: Smjer.INFORMATIKA},
  studijspecrac1: {latest: true, redovni: true, preddiplomski: false, smjer: Smjer.RAČUNARSTVO},
  studijispecelo1: {latest: true, redovni: false, preddiplomski: false, smjer: Smjer.ELEKTROTEHNIKA},
  studijispecgra1: {latest: true, redovni: false, preddiplomski: false, smjer: Smjer.GRADITELJSTVO},
  studijispecinf1: {latest: true, redovni: false, preddiplomski: false, smjer: Smjer.INFORMATIKA},
  studijispecrac1: {latest: true, redovni: false, preddiplomski: false, smjer: Smjer.RAČUNARSTVO},
  studijispecdig: {latest: true, redovni: false, preddiplomski: false, smjer: Smjer.DIGITALNA_EKONOMIJA},
  studijispecsig: {latest: true, redovni: false, preddiplomski: false, smjer: Smjer.INFORMACIJSKA_SIGURNOST},
  studijstro: {latest: true, redovni: true, preddiplomski: true, smjer: Smjer.STROJARSTVO},
  studijispecstro: {latest: true, redovni: false, preddiplomski: false, smjer: Smjer.STROJARSTVO},
  studijspecstro: {latest: true, redovni: true, preddiplomski: false, smjer: Smjer.STROJARSTVO},
  studijISPECSIGEN: {latest: true, redovni: true, preddiplomski: false, smjer: Smjer.INFORMACIJSKA_SIGURNOST}
}

export const StudijDataSchema = new mongoose.Schema({
  latest: {type: Boolean, required: true},
  redovni: {type: Boolean, required: true},
  preddiplomski: {type: Boolean, required: true},
  smjer: {
    type: String,
    enum: Object.values(Smjer),
    required: true
  }
});

export function buildStudijData(studijName: string): IStudijData {
  let studijNameUppercase = studijName.toUpperCase();

  let latest = !studijNameUppercase.includes("STARI");
  let redovni = !studijNameUppercase.includes("IZVANREDNI");
  let preddiplomski = !studijNameUppercase.includes("SPECIJALISTIČKI") || !studijNameUppercase.includes("INFORMATION SECURITY");
  
  let smjer: Smjer = Smjer.INFORMACIJSKA_SIGURNOST;
  if (studijNameUppercase.includes("ELEKTROTEHNIK")) smjer = Smjer.ELEKTROTEHNIKA
  else if (studijNameUppercase.includes("GRADITELJSTV")) smjer = Smjer.GRADITELJSTVO
  else if (studijNameUppercase.includes("MEHATRONIK")) smjer = Smjer.MEHATRONIKA
  else if (studijNameUppercase.includes("STROJARSTV")) smjer = Smjer.STROJARSTVO
  else if (studijNameUppercase.includes("SMJER RAČUNARSTVO") || studijNameUppercase.includes("RAČUNARSTVO")) smjer = Smjer.INFORMATIKA
  else if (studijNameUppercase.includes("INFORMATIK")) smjer = Smjer.INFORMATIKA
  else if (studijNameUppercase.includes("DIGITALNE EKONOMIJE")) smjer = Smjer.DIGITALNA_EKONOMIJA

  return {
    latest,
    redovni,
    preddiplomski,
    smjer
  }
}