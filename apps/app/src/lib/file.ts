export const generateFileID = async (filepath: string) => {
  // Convert filepath to BufferSource
  const encoder = new TextEncoder();
  const data = encoder.encode(filepath);

  // Hash the encoded string
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};

export const formatIntoFilename = (filename: string) => {
  return `${filename}.txt`;
};

export const formatIntoAutosaveFilename = (filename: string) => {
  return `autosave@${filename}.txt`;
};
