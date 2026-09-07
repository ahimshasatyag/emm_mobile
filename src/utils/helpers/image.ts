import api from '../../services/api/api';

/**
 * Returns the absolute URL for an uploaded AFS image.
 * It uses the configured axios baseURL, stripping out the '/api' suffix if present,
 * and appends the path to the assets.
 */
export const getAfsImageUrl = (imageName: string | null | undefined): string => {
    if (!imageName) return '';
    
    // Extract base URL from api config (e.g. "http://192.168.1.127:8001")
    let baseUrl = api.defaults.baseURL || 'http://192.168.1.127:8001';
    
    // Remove trailing /api or /api/ if it exists
    baseUrl = baseUrl.replace(/\/api\/?$/, '');
    
    return `${baseUrl}/assets/upload/afs/${imageName}`;
};
