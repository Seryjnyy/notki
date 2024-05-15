export const formatIntoFilename = (filename: string) => {
  return `${filename}.txt`;
};

export const formatIntoAutosaveFilename = (filename: string) => {
  return `autosave@${filename}.txt`;
};
