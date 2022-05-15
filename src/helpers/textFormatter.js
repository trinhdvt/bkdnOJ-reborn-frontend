function parseTime(time) {
    if (isNaN(time)) return "N/A";
    return `${time.toFixed(1)} s`
}
function parseMem(mem) {
    if (isNaN(mem)) return "N/A";
    return `${mem} KB`;
}

export {
    parseTime, parseMem,
}