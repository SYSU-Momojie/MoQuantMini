const ignoreCaseContains = (source, target) => {
  if (!source || !target) {
    return false;
  }
  return source.toLowerCase().indexOf(target.toLowerCase()) > -1;
}

module.exports = {
  ignoreCaseContains
}