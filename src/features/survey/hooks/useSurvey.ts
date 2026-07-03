import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import { Survey } from '../types/survey.types';
import { setLoading, setError, addSurvey, updateSurvey } from '../stores/surveySlice';
import { createSurveyApi, updateSurveyApi } from '../api/surveyApi';

export const useSurvey = () => {
    const dispatch = useDispatch();
    const { surveys, isLoading, error } = useSelector((state: RootState) => state.survey);

    const loadSurveys = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            // In a real app we'd fetch from API and dispatch setSurveys
            // Here we just use the initial state dummy data
            dispatch(setError(null));
        } catch (err: any) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const getSurvey = useCallback((id: string) => {
        return surveys.find((s) => s.id_survey === id);
    }, [surveys]);

    const createNewSurvey = async (survey: Survey) => {
        dispatch(setLoading(true));
        try {
            const newSurvey = await createSurveyApi(survey);
            dispatch(addSurvey(newSurvey));
            return newSurvey;
        } catch (err: any) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const modifySurvey = async (survey: Survey) => {
        dispatch(setLoading(true));
        try {
            const updatedSurvey = await updateSurveyApi(survey);
            dispatch(updateSurvey(updatedSurvey));
            return updatedSurvey;
        } catch (err: any) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        surveys,
        isLoading,
        error,
        loadSurveys,
        getSurvey,
        createNewSurvey,
        modifySurvey
    };
};
