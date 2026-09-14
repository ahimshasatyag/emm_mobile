import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Survey } from '../types/survey.types';
import { surveyApi } from '../api/surveyApi';

interface SurveyState {
    surveys: Survey[];
    currentSurvey: any | null;
    supportData: any | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: SurveyState = {
    surveys: [],
    currentSurvey: null,
    supportData: null,
    isLoading: false,
    error: null,
};

export const fetchSurveys = createAsyncThunk(
    'survey/fetchSurveys',
    async (_, { rejectWithValue }) => {
        try {
            return await surveyApi.fetchSurveys();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch surveys');
        }
    }
);

export const fetchSurveySupportData = createAsyncThunk(
    'survey/fetchSupportData',
    async (id_so: string | undefined, { rejectWithValue }) => {
        try {
            return await surveyApi.getSupportData(id_so);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch support data');
        }
    }
);

export const getSurveyById = createAsyncThunk(
    'survey/getSurveyById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await surveyApi.getSurveyById(id);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get Survey');
        }
    }
);

export const createSurvey = createAsyncThunk(
    'survey/createSurvey',
    async (data: any, { rejectWithValue }) => {
        try {
            return await surveyApi.createSurvey(data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create Survey');
        }
    }
);

export const updateSurvey = createAsyncThunk(
    'survey/updateSurvey',
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            return await surveyApi.updateSurvey(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update Survey');
        }
    }
);

const surveySlice = createSlice({
    name: 'survey',
    initialState,
    reducers: {
        clearCurrentSurvey: (state) => {
            state.currentSurvey = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Surveys
            .addCase(fetchSurveys.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSurveys.fulfilled, (state, action) => {
                state.isLoading = false;
                state.surveys = action.payload;
            })
            .addCase(fetchSurveys.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Support Data
            .addCase(fetchSurveySupportData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSurveySupportData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.supportData = action.payload;
            })
            .addCase(fetchSurveySupportData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Get by ID
            .addCase(getSurveyById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getSurveyById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentSurvey = action.payload;
            })
            .addCase(getSurveyById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Create Survey
            .addCase(createSurvey.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createSurvey.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.surveys.unshift(action.payload); // Server return not full survey sometimes, best to refetch
            })
            .addCase(createSurvey.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Update Survey
            .addCase(updateSurvey.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateSurvey.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updateSurvey.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearCurrentSurvey, clearError } = surveySlice.actions;
export default surveySlice.reducer;
