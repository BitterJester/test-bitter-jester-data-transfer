const _ = require('lodash');

function generateFridayNightBattleSchedule(completedApplications){
    const fridayNightMap = {
        nightOne: 'Friday, June 5, 2020',
        nightTwo: 'Friday, June 12, 2020',
        nightThree: 'Friday, June 17, 2020',
        nightFour: 'Friday, June 24, 2020'
    };
    console.log(JSON.stringify(completedApplications));
    const firstChoices = completedApplications.map(app => {
        let nightIndex;
        Object.values(fridayNightMap).map((night, index) => {
            if(night === app.firstChoiceFridayNight){
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