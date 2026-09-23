import api from '../../../services/api/api';

export const getMyMenusApi = async (): Promise<any> => {
    const response = await api.get('/menus/my-menus');
    return response.data;
};
