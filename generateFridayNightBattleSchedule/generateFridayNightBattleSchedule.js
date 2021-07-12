const _ = require('lodash');

const MAX_NUMBER_OF_BANDS_PER_NIGHT = 7;

function generateFridayNightBattleSchedule(completedApplications, orderedShowcaseBands) {
    const appsWithoutShowcase = completedApplications.filter(app => !orderedShowcaseBands.includes(app.bandName));
    const getAvailableBandsForNight = (fridayNightChoice) => {
        return appsWithoutShowcase.filter(app => app.firstChoiceFridayNight.includes(fridayNightChoice));
    };

    const getShowcaseBand = (index) => completedApplications.find(app => app.bandName === orderedShowcaseBands[index]);

    const fullyAvailableBands = appsWithoutShowcase.filter(app => app.isBandAvailableOnAllFridays);

    const firstChoiceNightOne = orderedShowcaseBands.length === 4 ? [getShowcaseBand(0), ...getAvailableBandsForNight('23')] : getAvailableBandsForNight('23');
    const firstChoiceNightTwo = orderedShowcaseBands.length === 4 ? [getShowcaseBand(1), ...getAvailableBandsForNight('30')] : getAvailableBandsForNight('30');
    const firstChoiceNightThree = orderedShowcaseBands.length === 4 ? [getShowcaseBand(2), ...getAvailableBandsForNight('6')] : getAvailableBandsForNight('6');
    const firstChoiceNightFour = orderedShowcaseBands.length === 4 ? [getShowcaseBand(3), ...getAvailableBandsForNight('13')] : getAvailableBandsForNight('13');

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

    // Pass 1 - Move some first choices to second choices
    for (let night of nights) {
        const deepCopyBands = _.cloneDeep(night.bands);
        console.error(`Starting pass for night ${night.night}`);
        console.error(`StartingBandsOnNight: ${night.bands.length}`);
        if(night.bands.length <= MAX_NUMBER_OF_BANDS_PER_NIGHT){
            console.error(`${night.night} is not over scheduled so continuing.`);
            continue;
        }
        console.error('Bands currently scheduled: ', deepCopyBands);
        for (let band of deepCopyBands) {
            console.error(`BandName: ${band.bandName}`);
            console.error(`PreviouslyScheduledNight: ${night.night}`);
            if(orderedShowcaseBands.includes(band.bandName)){
                continue;
            }
            if (band.secondChoiceFridayNight !== '' && band.secondChoiceFridayNight !== undefined && band.firstChoiceFridayNight !== band.secondChoiceFridayNight) {
                const secondChoiceFridayNightNumber = Object.values(NIGHT_MAP).findIndex((i) => band.secondChoiceFridayNight.includes(i)) + 1;
                const secondChoiceNight = nights.find(night => night.night === secondChoiceFridayNightNumber);
                console.error(`BandsScheduledOnSecondChoice: ${secondChoiceNight.bands.length}; FirstNight: ${band.firstChoiceFridayNight}; SecondNight: ${band.secondChoiceFridayNight}`);
                if (secondChoiceNight.bands.length < MAX_NUMBER_OF_BANDS_PER_NIGHT) {
                    const indexOfBand = nights[night.night - 1].bands.findIndex((fi) => fi.bandName === band.bandName);
                    const bandToAdd = nights[night.night - 1].bands.splice(indexOfBand, 1);
                    console.error('BandToMove: ', JSON.stringify(bandToAdd));
                    nights[secondChoiceFridayNightNumber - 1].bands.push(bandToAdd[0]);
                }
            }
            if(night.bands.length === MAX_NUMBER_OF_BANDS_PER_NIGHT){
                console.error('Second choice night is full');
                break;
            }
        }
    }

    // // Pass 2 - Ensure no bands are on an unavailable night
    // for(let night of nights) {
    //     const deepCopyBands = _.cloneDeep(night.bands);
    //     let bandIndex = 0;
    //     for(let band of deepCopyBands){
    //         const dateOfFridayNight = NIGHT_MAP[night.night];
    //         if(band.unavailableFridayNights.includes(dateOfFridayNight)) {
    //             const bandToMove = night.bands.splice(bandIndex, 1);
    //         }
    //     }
    // }

    const schedule = {
        fridayNightOne: nights[0],
        fridayNightTwo: nights[1],
        fridayNightThree: nights[2],
        fridayNightFour: nights[3],
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