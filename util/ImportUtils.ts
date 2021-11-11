import path from 'path';
import fs from 'fs';

async function getConfiguredImports<T>(folderPath: string) {
  let configuredImports: T[] = [];
    const normalizedPathFolder = path.join(__dirname, folderPath);
    let importFiles = fs.readdirSync(normalizedPathFolder);
    for (let importFile of importFiles) {
      let importFileLocation = `${folderPath}/${importFile}`;
      const resultImport = await import(importFileLocation);
      let configuredImport = resultImport.default;
      configuredImports.push(configuredImport);
    }
    return configuredImports;
}

const ImportUtils = {
  getConfiguredImports
}

export default ImportUtils;