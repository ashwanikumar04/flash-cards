/*jslint node: true */
var dateTimeUtil = function() {
    var dateFormat = {};
    var setMoment = function setMoment() {
        var moment = require('moment-timezone');
        this.moment = moment;
        moment().format();
        this.dateFormat = "dddd, MMMM Do YYYY, h:mm:ss a";
    };
    setMoment();
    var getMoment = function getMoment() {
        return this.moment();
    };
    var getCurrentTimeUTC = function getCurrentTimeUTC() {
        return this.moment().utc();
    };

    var getCurrentTimeIndian = function getCurrentTimeIndian() {
        return this.getCurrentTimeUTC().tz('Asia/Kolkata');
    };
    var getEPOCHTime = function getEPOCHTime() {
        return this.getCurrentTimeUTC().unix();
    };
    var getIndianEPOCHTime = function getIndianEPOCHTime() {
        return this.getCurrentTimeIndian().unix();
    };

    var getDateFromEpoch = function getDateFromEpoch(epochTime) {
        return this.moment.unix(epochTime);
    };

    var getIndianDateFromEpoch = function getIndianDateFromEpoch(epochTime) {
        return this.getDateFromEpoch(epochTime).tz('Asia/Kolkata');
    };
    var addSecondsUTC = function addSecondsUTC(seconds) {
        return this.getCurrentTimeUTC().add(seconds, 'seconds');
    };
    var addSeconds = function addSeconds(seconds) {
        return this.getCurrentTimeIndian().add(seconds, 'seconds').unix();
    };
    var getEpochTimeFromDate = function getEpochTimeFromDate(date) {
        return this.moment(date).unix();
    };
    var currentMonth = function() {
        var year = this.moment().utc().get('year');
        var month = this.moment().utc().get('month');
        var startDate = this.moment([year, month]);
        // Clone the value before .endOf()
        var endDate = this.moment(startDate).endOf('month');
        return {
            startDate: startDate,
            endDate: endDate
        };
    };
    var addDaysToCurrent = function addDaysToCurrent(days) {
        return this.getCurrentTimeUTC().add(days, "days");
    };
    var minusDaysToCurrent = function minusDaysToCurrent(days) {
        return this.getCurrentTimeUTC().subtract(days, "days");
    };
    return {
        setMoment: setMoment,
        dateFormat: dateFormat,
        getCurrentTimeUTC: getCurrentTimeUTC,
        getCurrentTimeIndian: getCurrentTimeIndian,
        getEPOCHTime: getEPOCHTime,
        getIndianEPOCHTime: getIndianEPOCHTime,
        getDateFromEpoch: getDateFromEpoch,
        getIndianDateFromEpoch: getIndianDateFromEpoch,
        addSeconds: addSeconds,
        getEpochTimeFromDate: getEpochTimeFromDate,
        currentMonth: currentMonth,
        addSecondsUTC: addSecondsUTC,
        addDaysToCurrent: addDaysToCurrent,
        minusDaysToCurrent: minusDaysToCurrent,
        getMoment: getMoment
    };
};

module.exports = dateTimeUtil();