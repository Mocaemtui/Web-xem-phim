function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // normalize diacritics
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .trim();
}

module.exports = slugify;
