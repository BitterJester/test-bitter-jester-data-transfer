const _ = require('lodash');

function generateFridayNightBattleSchedule(completedApplications){
    const fridayNightMap = {
        nightOne: '5',
        nightTwo: '12',
        nightThree: '19',
        nightFour: '26'
    };

    const firstChoices = completedApplications.map(app => {
        let nightIndex;

        Object.values(fridayNightMap).forEach((night, index) => {
            if(app.firstChoiceFridayNight.includes(night)){
                nightIndex = index;
            }

        });
        return {
            bandName: app.bandName,
            firstChoiceFridayNight: Object.keys(fridayNightMap)[nightIndex]
        };
    });

    const groupedApplicationsByFirstChoice = _.groupBy(firstChoices, 'firstChoiceFridayNight');

    return {
        fridayNightOne: groupedApplicationsByFirstChoice.nightOne,
        fridayNightTwo: groupedApplicationsByFirstChoice.nightTwo,
        fridayNightThree: groupedApplicationsByFirstChoice.nightThree,
        fridayNightFour: groupedApplicationsByFirstChoice.nightFour
    };
}

module.exports = {
    generateFridayNightBattleSchedule: generateFridayNightBattleSchedule
}