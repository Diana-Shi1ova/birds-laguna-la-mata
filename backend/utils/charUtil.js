const charMap = {
  a: "aáàäâã",
  e: "eéèëê",
  i: "iíìïî",
  o: "oóòöôõ",
  u: "uúùüû",
  n: "nñ",
  c: "cç"
};


function toGroup(char) {
  const lower = char.toLowerCase();

  for (const [base, variants] of Object.entries(charMap)) {
    if (variants.includes(lower)) {
      return `[${variants}]`;
    }
  }

  return char;
}


function createFlexibleRegex(input) {
  return input
    .split("")
    .map(toGroup)
    .join("");
}

module.exports = {
    createFlexibleRegex
}