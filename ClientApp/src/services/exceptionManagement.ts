import apiClient from './apiClient';

const ExceptionManagement = {

  async getExceptionsList(pageNumber: number = 1, pageSize: number = 10, searchTerm: string = '', status: number = 1) {
    try {
      const response = await apiClient.get('/ExceptionsMgmt/GetExceptionsList', {
        params: {
          pageNumber,
          pageSize,
          searchTerm,
          status
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getExceptionDetails(id: string = '') {
    try {
      const response = await apiClient.get('/ExceptionsMgmt/GetExceptionDetails', {
        params: {
          id
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  async getDeviationByClasification(classification: string) {
    try {
      const response = await apiClient.get(`/ExceptionsMgmt/GetDeviationByClasification/${classification}`);
      return response.data;

    } catch (error) {
      throw error;
    }

  },
    async deleteException(id: string = '', remarks: string = '') {
      try {
        const response = await apiClient.delete(`/ExceptionsMgmt/DeleteException/${id}`, {
          params: {
            remarks
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getForApprovalList(pageNumber: number = 1, pageSize: number = 10, searchString: string = '', status: number|null= null) {
      try {
        const response = await apiClient.get('/ExceptionsMgmt/GetExceptionsForApprovalList', {
          params: {
            pageNumber,
            pageSize, 
            searchString,
            status
          },
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    async approveException(refNo: string = '', remarks: string = '') {
      try {
        const response = await apiClient.put(`/ExceptionsMgmt/ApproveException/${refNo}?remarks=${remarks}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async rejectException(refNo: string = '', remarks: string = '') {
      try {
        const response = await apiClient.put(`/ExceptionsMgmt/RejectException/${refNo}?remarks=${remarks}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getExceptionForApprovalDetails(id: string = '') {
      try {
        const response = await apiClient.get('/ExceptionsMgmt/GetExceptionsForApprovalDetails', {
          params: {
            id
          },
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
}

export default ExceptionManagement;