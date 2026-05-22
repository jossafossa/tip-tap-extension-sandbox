export const atWordStart = (regex: RegExp): RegExp =>
  new RegExp(`(?<=^|\\s)${regex.source}`, regex.flags);
