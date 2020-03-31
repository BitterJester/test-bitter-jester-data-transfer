const generateFridayNightBattleSchedule = require('./generateFridayNightBattleSchedule');

describe('GenerateFridayNightBattleSchedule', () => {
    const createCompletedApplication = (bandName, firstChoiceFridayNight, secondChoiceFridayNight, bandAvailableOnAllFridays) => {
        return {
            bandName: bandName,
            firstChoiceFridayNight: firstChoiceFridayNight,
            secondChoiceFridayNight: secondChoiceFridayNight,
            isBandAvailableOnAllFridays: bandAvailableOnAllFridays
        };
    };

    const completedApplications = [
        (createCompletedApplication('band1', '5', '12', false)),
        (createCompletedApplication('band2', '12', '5', false)),
        (createCompletedApplication('band3', '', '', true))
    ];

    it('should give each band their first choice night', () => {
        const schedule = generateFridayNightBattleSchedule.generateFridayNightBattleSchedule(completedApplications);
        expect(schedule.nights[0].bands[0].bandName).toEqual('band1');
    });

    it('should give each band their first choice night', () => {
        const schedule = generateFridayNightBattleSchedule.generateFridayNightBattleSchedule(completedApplications);
        expect(schedule.nights[1].bands[0].bandName).toEqual('band2');
    });

    it('should give spread the rest of the bands evenly', () => {
        const schedule = generateFridayNightBattleSchedule.generateFridayNightBattleSchedule(completedApplications);
        expect(schedule.nights[2].bands[0].bandName).toEqual('band3');
    });
});