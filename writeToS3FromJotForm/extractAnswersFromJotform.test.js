const extractAnswersFromJotform = require("./extractAnswersFromJotforrm").extractAnswersFromJotform;

describe('extractAnswersFromJotform', () => {
    const buildApplication = (extraAnswers) => {
        const defaultAnswers = {
            answers: {
                '1': {
                    answer: 'answer1'
                },
                '2': {
                    answer: 'answer2'
                }
            }
        };

        if(extraAnswers){
            const answers = defaultAnswers.answers;
            return {answers: {...answers, ...extraAnswers}};
        }

        return defaultAnswers;
    };

    const extraAnswers = {
        '3': {
            answer: 'answer3'
        }
    };

    const applications = [
        buildApplication(),
        buildApplication(extraAnswers)
    ];

    const answerQuestionIdMap = {
        field1: '1',
        field2: '2',
        field3: '3'
    };

    const actual = extractAnswersFromJotform(applications, answerQuestionIdMap);

    it('should have field1 as answer1', () => {
        expect(actual[0].field1).toEqual('answer1');
    });

    it('should have field2 as answer2', () => {
        expect(actual[0].field2).toEqual('answer2');
    });

    it('should have field3 as answer3 for app2', () => {
        expect(actual[0].field3).toEqual('');
    });

    it('should have field1 as answer1 for app2', () => {
        expect(actual[1].field1).toEqual('answer1');
    });

    it('should have field2 as answer2 for app2', () => {
        expect(actual[1].field2).toEqual('answer2');
    });

    it('should have field3 as answer3 for app2', () => {
        expect(actual[1].field3).toEqual('answer3');
    });
});