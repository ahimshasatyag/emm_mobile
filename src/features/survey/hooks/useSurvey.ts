import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores';
import { 
    fetchSurveys, 
    fetchSurveySupportData,
    getSurveyById,
    createSurvey,
    updateSurvey,
    clearCurrentSurvey,
    clearError
} from '../stores/surveySlice';
import { surveyApi } from '../api/surveyApi';

export const useSurvey = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { surveys, currentSurvey, supportData, isLoading, error } = useSelector((state: RootState) => state.survey);

    const loadSurveys = useCallback(async () => {
        return await dispatch(fetchSurveys()).unwrap();
    }, [dispatch]);

    const loadSupportData = useCallback(async (id_so?: string) => {
        return await dispatch(fetchSurveySupportData(id_so)).unwrap();
    }, [dispatch]);

    const loadSurveyDetail = useCallback(async (id: string) => {
        return await dispatch(getSurveyById(id)).unwrap();
    }, [dispatch]);

    const createNewSurvey = useCallback(async (data: any) => {
        return await dispatch(createSurvey(data)).unwrap();
    }, [dispatch]);

    const modifySurvey = useCallback(async (id: string, data: any) => {
        return await dispatch(updateSurvey({ id, data })).unwrap();
    }, [dispatch]);

    const resetCurrent = useCallback(() => {
        dispatch(clearCurrentSurvey());
    }, [dispatch]);

    const dismissError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Extra Actions (can be called directly via API without changing Redux state, or you can add them to Redux later)
    const handleCancelSurvey = useCallback(async (id: string) => {
        return await surveyApi.cancelSurvey(id);
    }, []);

    const handleConfirmSurvey = useCallback(async (id: string) => {
        return await surveyApi.confirmSurvey(id);
    }, []);

    const handleUpdateAfs = useCallback(async (id: string, data: any) => {
        return await surveyApi.updateAfs(id, data);
    }, []);

    const handleUpdateGudang = useCallback(async (id: string, data: any) => {
        return await surveyApi.updateGudang(id, data);
    }, []);

    return {
        surveys,
        currentSurvey,
        supportData,
        isLoading,
        error,
        loadSurveys,
        loadSupportData,
        loadSurveyDetail,
        createNewSurvey,
        modifySurvey,
        resetCurrent,
        dismissError,
        cancelSurvey: handleCancelSurvey,
        confirmSurvey: handleConfirmSurvey,
        updateAfs: handleUpdateAfs,
        updateGudang: handleUpdateGudang
    };
};
