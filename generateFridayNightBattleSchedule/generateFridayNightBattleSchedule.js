const _ = require('lodash');

function generateFridayNightBattleSchedule(completedApplications) {
    const getAvailableBandsForNight = (fridayNightChoice) => {
        return completedApplications.filter(app => app.firstChoiceFridayNight.includes(fridayNightChoice));
    };

    const fullyAvailableBands = completedApplications.filter(app => app.isBandAvailableOnAllFridays);

    const firstChoiceNightOne = getAvailableBandsForNight('23');
    const firstChoiceNightTwo = getAvailableBandsForNight('30');
    const firstChoiceNightThree = getAvailableBandsForNight('6');
    const firstChoiceNightFour = getAvailableBandsForNight('13');

    const NIGHT_MAP = {
        1: '23',
        2: '30',
        3: '6',
        4: '13'
    }

    const nights = [
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
    ];

    for (let night of nights) {
        const deepCopyBands = _.cloneDeep(night.bands);
        for (let band of deepCopyBands) {
            if (night.bands.length <= 6) {
                continue;
            }
            if (band.secondChoiceFridayNight !== '' && band.secondChoiceFridayNight !== undefined) {
                const nightNumber = Object.values(NIGHT_MAP).findIndex((i) => band.secondChoiceFridayNight.includes(i)) + 1;
                console.error(nightNumber);
                const secondChoiceNight = nights.find(night => night.night === nightNumber);
                console.error(secondChoiceNight);
                if (secondChoiceNight.bands.length < 6) {
                    const bandToAdd = night.bands.splice(nightNumber - 1, 1);
                    night[nightNumber - 1].bands.push(bandToAdd[0]);
                }
            }
        }
    }

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
        nights,
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
            if (sortedByLowestNumberOfBands[0].night === night.night) {
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