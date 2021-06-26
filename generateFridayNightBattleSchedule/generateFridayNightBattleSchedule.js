const _ = require('lodash');

function generateFridayNightBattleSchedule(completedApplications, previousFridayNightSchedule) {
    const getAvailableBandsForNight = (fridayNightChoice) => {
        return completedApplications.filter(app => app.firstChoiceFridayNight.includes(fridayNightChoice));
    };

    const fullyAvailableBands = completedApplications.filter(app => app.isBandAvailableOnAllFridays);

    const firstChoiceNightOne = getAvailableBandsForNight('23');
    const firstChoiceNightTwo = getAvailableBandsForNight('30');
    const firstChoiceNightThree = getAvailableBandsForNight('6');
    const firstChoiceNightFour = getAvailableBandsForNight('13');

    const schedule = {
        fridayNightOne: {
            bands: firstChoiceNightOne,
            night: 1
        },
        fridayNightTwo: {
            bands: firstChoiceNightTwo,
            night: 2
        },
        fridayNightThree: {
            bands: firstChoiceNightThree,
            night: 3
        },
        fridayNightFour: {
            bands: firstChoiceNightFour,
            night: 4
        },
        nights: [
            {
                bands: firstChoiceNightOne,
                night: 1
            },
            {
                bands: firstChoiceNightTwo,
                night: 2
            },
            {
                bands: firstChoiceNightThree,
                night: 3
            },
            {
                bands: firstChoiceNightFour,
                night: 4
            }
        ],
        version: 'suggested'
    };

    function getSortedScheduleByLowestNumberOfBands() {
        return schedule.nights.sort((a, b) => a.bands.length < b.bands.length ? -1 : 1);
    }

    function getSortedScheduleByNight() {
        return schedule.nights.sort((a, b) => a.night < b.night ? -1 : 1);
    }

    while (fullyAvailableBands.length > 0) {
        const sortedByLowestNumberOfBands = getSortedScheduleByLowestNumberOfBands();
        schedule.nights.forEach(night => {
            if(sortedByLowestNumberOfBands[0].night === night.night) {
                night.bands.push(fullyAvailableBands.pop());
            }
        });
    }

    getSortedScheduleByNight();
    return schedule;
}

module.exports = {
    generateFridayNightBattleSchedule: generateFridayNightBattleSchedule
};