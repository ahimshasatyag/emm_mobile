import { Survey } from '../types/survey.types';

// Mock API for Survey Module
export const fetchSurveys = async (): Promise<Survey[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([]); // Return empty initially, hook will pull from Redux
        }, 1000);
    });
};

export const fetchSurveyById = async (id: string): Promise<Survey | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, 1000);
    });
};

export const createSurveyApi = async (survey: Survey): Promise<Survey> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ ...survey, id_survey: Math.random().toString(36).substr(2, 9) });
        }, 1000);
    });
};

export const updateSurveyApi = async (survey: Survey): Promise<Survey> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(survey);
        }, 1000);
    });
};
