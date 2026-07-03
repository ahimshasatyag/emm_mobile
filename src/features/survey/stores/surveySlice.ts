import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Survey } from '../types/survey.types';
import { mockSurveys } from '../data/survey.data';

interface SurveyState {
    surveys: Survey[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SurveyState = {
    surveys: mockSurveys,
    isLoading: false,
    error: null,
};

const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        setSurveys: (state, action: PayloadAction<Survey[]>) => {
            state.surveys = action.payload;
        },
        addSurvey: (state, action: PayloadAction<Survey>) => {
            state.surveys.push(action.payload);
        },
        updateSurvey: (state, action: PayloadAction<Survey>) => {
            const index = state.surveys.findIndex(s => s.id_survey === action.payload.id_survey);
            if (index !== -1) {
                state.surveys[index] = action.payload;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const { setSurveys, addSurvey, updateSurvey, setLoading, setError } = surveySlice.actions;
export default surveySlice.reducer;
