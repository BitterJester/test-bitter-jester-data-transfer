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

    // Pass 1 - Move some first choices to second choices
    for (let night of nights) {
        const deepCopyBands = _.cloneDeep(night.bands);
        let bandIndex = 0;
        console.error(`Starting pass for night ${night.night}`);
        console.error(`StartingBandsOnNight: ${night.bands.length}`);
        if(night.bands.length < 6){
            console.error(`${night.night} is not over scheduled so continuing.`);
            continue;
        }
        console.error('Bands currently scheduled: ', deepCopyBands);
        for (let band of deepCopyBands) {
            console.error(`BandName: ${band.bandName}`);
            console.error(`PreviouslyScheduledNight: ${night.night}`);
            if (band.secondChoiceFridayNight !== '' && band.secondChoiceFridayNight !== undefined && band.firstChoiceFridayNight !== band.secondChoiceFridayNight) {
                const secondChoiceFridayNightNumber = Object.values(NIGHT_MAP).findIndex((i) => band.secondChoiceFridayNight.includes(i)) + 1;
                const secondChoiceNight = nights.find(night => night.night === secondChoiceFridayNightNumber);
                console.error(`BandsScheduledOnSecondChoice: ${secondChoiceNight.bands.length}; FirstNight: ${band.firstChoiceFridayNight}; SecondNight: ${band.secondChoiceFridayNight}`);
                if (secondChoiceNight.bands.length < 6) {
                    const bandToAdd = nights[night.night].bands.splice(bandIndex, 1);
                    console.error('BandToMove: ', JSON.stringify(bandToAdd));
                    nights[secondChoiceFridayNightNumber - 1].bands.push(bandToAdd[0]);
                }
            }
            bandIndex++;
            if(night.bands.length === 6){
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