import baseApi from '../../../../utils/api/baseAPI';

export const VehicleApi = {
    // Get all vehicles with filtering and pagination
    getVehicles: async (params = {}) => {
        try {
            const response = await baseApi.get('/Vehicles', params, false); // No auth for vehicles
            return { success: true, data: response };
        } catch (error) {
            return baseApi.handleError(error);
        }
    },

    // Get vehicle detail by ID
    getVehicleDetail: async (vehicleId) => {
        try {
            const response = await baseApi.get(`/Vehicles/${vehicleId}`, {}, false);
            return { success: true, data: response };
        } catch (error) {
            return baseApi.handleError(error);
        }
    },

    // Compare vehicles
    compareVehicles: async (vehicleIds) => {
        try {
            const response = await baseApi.post('/Vehicles/compare', vehicleIds, false);
            return { success: true, data: response };
        } catch (error) {
            return baseApi.handleError(error);
        }
    },

    // Get available configurations for a vehicle
    getVehicleConfigs: async (vehicleId) => {
        try {
            const response = await baseApi.get(`/Vehicles/${vehicleId}/configs`, {}, false);
            return { success: true, data: response };
        } catch (error) {
            return baseApi.handleError(error);
        }
    }
};

export default VehicleApi;