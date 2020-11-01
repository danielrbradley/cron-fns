"use strict";
exports.__esModule = true;
exports.next = void 0;
function parseCron(input) {
    throw new Error("Not implemented"); // TODO
}
function findNext(current, schedule) {
    if (!schedule || schedule.length === 0) {
        return [current, false];
    }
    for (var _i = 0, schedule_1 = schedule; _i < schedule_1.length; _i++) {
        var n = schedule_1[_i];
        if (n >= current) {
            return [n, false];
        }
    }
    return [schedule[0], true];
}
/** @returns Boolean indicating if we've moved to a new day */
function moveToNextValidTime(current, schedule) {
    var _a = findNext(current.getSeconds(), schedule.second), second = _a[0], carryMinute = _a[1];
    if (!carryMinute) {
        current.setSeconds(second);
        return false;
    }
    var _b = findNext(current.getMinutes() + 1, schedule.minute), minute = _b[0], carryHour = _b[1];
    if (!carryHour) {
        current.setMinutes(minute, second);
        return false;
    }
    var _c = findNext(current.getHours() + 1, schedule.hour), hour = _c[0], carryDay = _c[1];
    current.setHours(hour, minute, second);
    return carryDay;
}
function isDateValid(current, schedule) {
    return ((!schedule.year || schedule.year.indexOf(current.getFullYear()) > -1) &&
        (!schedule.month || schedule.month.indexOf(current.getMonth()) > -1) &&
        (!schedule.dayOfMonth ||
            schedule.dayOfMonth.indexOf(current.getDate()) > -1) &&
        (!schedule.dayOfWeek || schedule.dayOfWeek.indexOf(current.getDay()) > -1));
}
/** @returns Boolean indicating if we've found a next possible day */
function moveToNextPossibleDate(current, schedule) {
    var _a;
    var initialYear = current.getFullYear();
    var _b = findNext(initialYear, schedule.year), year = _b[0], yearNotFound = _b[1];
    if (!yearNotFound)
        return false;
    if (year !== initialYear) {
        current.setFullYear(year, 0, 1);
    }
    var _c = findNext(current.getDate(), schedule.dayOfMonth), date = _c[0], carryMonth = _c[1];
    if (!carryMonth) {
        current.setDate(date);
        return true;
    }
    var _d = findNext(current.getMonth() + 1, schedule.month), month = _d[0], carryYear = _d[1];
    if (!carryYear) {
        current.setMonth(month, date);
        return true;
    }
    _a = findNext(current.getHours() + 1, schedule.hour), year = _a[0], yearNotFound = _a[1];
    if (yearNotFound)
        return false;
    current.setFullYear(year, month, date);
    return true;
}
/** @returns 0 if unchanged, 1 if changed, -1 if unavailable */
function moveToNextValidDate(current, schedule) {
    var isValid = isDateValid(current, schedule);
    if (isValid)
        return 0;
    do {
        if (!moveToNextPossibleDate(current, schedule)) {
            return -1;
        }
    } while (!isDateValid(current, schedule));
    return 1;
}
exports.next = function (schedule, from) {
    var parsedSchedule = typeof schedule === "string" ? parseCron(schedule) : schedule;
    var date = new Date(from.getTime());
    switch (moveToNextValidDate(date, parsedSchedule)) {
        case -1:
            return undefined;
        case 0:
            date.setSeconds(date.getSeconds() + 1, 0);
            break;
        case 1:
            date.setHours(0, 0, 0, 0);
            break;
    }
    var carryDay = moveToNextValidTime(date, parsedSchedule);
    if (!carryDay) {
        return date;
    }
    if (moveToNextValidDate(date, parsedSchedule) === -1) {
        return undefined;
    }
    return date;
};
//# sourceMappingURL=index.js.map