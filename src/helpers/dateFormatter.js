function getWeekDayShort(dateobj) {
    return dateobj.toLocaleDateString('en-US', { weekday: 'short' });
}
function getWeekDayLong(dateobj) {
    return dateobj.toLocaleDateString('en-US', { weekday: 'long' });
}
function getMonthShort(dateobj) {
    return dateobj.toLocaleDateString('en-US', { month: 'short' });
}
function getDaySuffix(num) {
    if (9 < num < 19) return 'th';
    if (num % 10 === 1) return 'st';
    if (num % 10 === 2) return 'nd';
    if (num % 10 === 3) return 'rd';
    return 'th';
}

export default function dateFormatter(date) {
    if (!date) return "N/A";
    const d = new Date(date);
    if (! isFinite(d)) return "N/A";
    const now = new Date();

    const year = d.getUTCFullYear();
    const day = d.getUTCDate();

    var timeString = ("0" + d.getUTCHours()).slice(-2) + ":" +
        ("0" + d.getUTCMinutes()).slice(-2) + ":" +
        ("0" + d.getUTCSeconds()).slice(-2);

    if (now.getUTCFullYear() === year)
        return `${getMonthShort(d)} ${day}${getDaySuffix(day)}, ${getWeekDayShort(d)}, ${timeString}`

    var dateString = d.getUTCFullYear() + "/" +
        ("0" + (d.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + d.getUTCDate()).slice(-2) + " " +
        timeString;

    return dateString;
}