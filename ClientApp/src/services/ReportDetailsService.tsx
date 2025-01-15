import apiClient from "./apiClient";

const ReportDetailsService = {
  async getReportDetails(id: number) {
    try {
      const response = await apiClient.get(`/ReportDetails/GetReport/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching report details:", error);
      throw new Error("Failed to fetch report details.");
    }
  },

  async getList(id: number, page: number) {
    try {
      const response = await apiClient.get(`/ReportDetails/getList/${id}`, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching report details:", error);
      throw new Error("Failed to fetch report details.");
    }
  },
  async pulloutRequest(id: number, refno: string) {
    try {
      const response = await apiClient.get(`/ReportDetails/PulloutRequest/${id}`, {
        params: { refno },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching report details:", error);
      throw new Error("Failed to fetch pullout request.");
    }
  },
  async exportDataFromDetails(id: number) {
    try {
      const response = await apiClient.get(`/ReportDetails/ExportDataFromDetails/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching report details:", error);
      throw new Error("Failed to fetch pullout request.");
    }
  },

 async populateBranchRecipients(brCode: string): Promise<any> {
  try {
    const response = await apiClient.get('/ReportDetails/PopulateBranchRecipients', {
      params: { selected: 'selected', brCode },
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error fetching branch recipients:", error.message || error);
    throw new Error("Failed to fetch branch recipients.");
  }
},

async populateSelectedRecipients(brCode: string): Promise<any> {
  try {
    const response = await apiClient.get('/ReportDetails/PopulateBranchRecipients', {
      params: { selected: 'selected', brCode },
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error fetching branch recipients:", error.message || error);
    throw new Error("Failed to fetch branch recipients.");
  }
}

};

export default ReportDetailsService;
