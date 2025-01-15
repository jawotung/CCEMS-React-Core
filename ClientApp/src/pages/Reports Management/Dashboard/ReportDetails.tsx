import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Button,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import ReportDetailsService from "../../../services/ReportDetailsService";
import {
  PaginatedList,
  RecipientDTO,
  ReportDetailsDTO,
  ReportStatus,
} from "../../../models/reportDetailsDTOs";
import PaginationControls from "../../../components/Pagination/PaginationControls";
import Table from "../../../components/Table/Table";
import { FormattedDate } from "../../../utils/formatDate";
import ToastService from "../../../utils/toast";

// import Cookies from 'js-cookie';
// const Permission = Cookies.get('Permission') ?? "";
// const PermissionReportsWriteActionPlan = Permission.split(',').includes('"Permissions.Reports.Approval"')

interface ReportDetailsProps {
  formData: {
    sendToRecipients: RecipientDTO[];
  };
  onChange: (e: any) => void;
  onRecipientChange: (e: any, value: RecipientDTO[]) => void;
  onCCChange: (e: any, value: RecipientDTO[]) => void;
  handleSubmit: (e: any) => void;
  recipientsOptions: RecipientDTO[];
  selectedReceipients: RecipientDTO[];
  onCancel: () => void;
}

const ReportDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reportDetails, setReportDetails] = useState<ReportDetailsDTO | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [pagedResult, setPagedResult] = useState<PaginatedList>({
    data: [],
    pageIndex: 1,
    totalPages: 0,
    countData: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const [selectedRecipients, setSelectedRecipients] = useState<RecipientDTO[]>([]);

  const [recipientsOptions, setRecipientsOptions] = useState<RecipientDTO[]>([]);

  
  const [selectedCC, setSelectedCC] = useState<RecipientDTO[]>([]);

  const [CCOptions, setCCOptions] = useState<RecipientDTO[]>([]);

  const fetchRecipientOptions = async () => {
    try {
      const result = await ReportDetailsService.populateBranchRecipients(String(reportDetails?.selectedBranches));
      result.forEach((x: any) => {
        if (reportDetails?.toList?.includes(x.text)) {
            x.isSelected = true;
        }
      });
      console.log(result);
      setRecipientsOptions(result);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
 };

const fetchCCOptions = async () => {
  try {
    const result = await ReportDetailsService.populateBranchRecipients(String(reportDetails?.selectedBranches));
    //const filteredResult = result.filter(recipient => recipient.isSelected);
    result.forEach((x: any) => {
      if (reportDetails?.ccList?.includes(x.text)) {
          x.isSelected = true;
      }
    });
  setCCOptions(result);
  } catch (error) {
    console.error("Error fetching groups", error);
  }
};

 useEffect(() => {
  fetchRecipientOptions();
  fetchCCOptions();
}, [reportDetails]);


const onRecipientChange = (value: string[]) => {
  const selected = recipientsOptions.filter(recipient => value.includes(recipient.value));
  setSelectedRecipients(selected); // Update the selected recipients

  // Additional logic if needed
};

const onCCChange = (value: string[]) => {
  const selected = CCOptions.filter(recipient => value.includes(recipient.value));
  setSelectedCC(selected); // Update the selected recipients

  // Additional logic if needed
};


  const columns = [
    {
      label: "Actions", // New column for buttons
      render: (data: any) => (
        <>
          <a
            className="btn btn-sm btn-outline-secondary"
            href={`/ReportsManagement/BranchReply/${Number(id)}?refNo=${data.exceptionNo}`} // Dynamic link
          >
            Branch Reply
          </a>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => PulloutRequest(data.exceptionNo)}
          >
            Pullout request
          </button>
        </>
      ),
    },
    {
      label: "Reference No",
      render: (data: any) => (
        <a
          href={`/SubExceptions/${data.exceptionNo}`} // Dynamic link based on `exceptionNo`
          target="_blank" // Opens the link in a new tab
          style={{ color: "#007bff" }} // Inline style for Bootstrap blue color
        >
          {data.exceptionNo}
        </a>
      ),
    },
    { label: "Branch Code", accessor: "branchCode" },
    { label: "Branch Name", accessor: "branchName" },
    { label: "Area", accessor: "area" },
    { label: "Division", accessor: "division" },
    { label: "Transaction Date", accessor: "transactionDate" },
    { label: "Aging", accessor: "aging" },
    { label: "Aging Category", accessor: "agingCategory" },
    { label: "Process", accessor: "process" },
    { label: "Account No", accessor: "accountNo" },
    { label: "Account Name", accessor: "accountName" },
    { label: "Deviation", accessor: "deviation" },
    { label: "Risk Classification", accessor: "riskClassification" },
    { label: "Deviation Category", accessor: "deviationCategory" },
    { label: "Amount", accessor: "amount" },
    { label: "Employee Responsible", accessor: "personResponsible" },
    { label: "Other Employee Responsible", accessor: "otherPersonResponsible" },
    { label: "Remarks", accessor: "remarks" },
    { label: "Action Plan", accessor: "actionPlan" },
    { label: "Encoded By", accessor: "encodedBy" },
    { label: "Root Cause", accessor: "rootCause" },
    { label: "Exception Approver", accessor: "deviationApprover" },
  ];

  const handlePageChange = (newPage: number) => {
    setPagedResult({
      ...pagedResult,
      pageIndex: newPage,
    });
  };

  const Getlist = async () => {
    try {
      const result = await ReportDetailsService.getList(
        Number(id),
        pagedResult.pageIndex
      );

      setPagedResult({
        pageIndex: result.pageIndex,
        totalPages: result.totalPages,
        countData: result.countData,
        hasPreviousPage: result.hasPreviousPage,
        hasNextPage: result.hasNextPage,
        data: result.data,
      });
    } catch (error) {
      console.error("Error Getlist", error);
    }
  };
  const PulloutRequest = async (refno: string) => {
    try {
      const result = await ReportDetailsService.pulloutRequest(
        Number(id),
        refno
      );
      if (result.success) {
        const fileData = result.data;

        // Check if fileData is valid
        if (!fileData || !fileData.fileByte || fileData.fileByte.length === 0) {
          console.error("File byte data is empty or invalid");
          return;
        }

        // Decode base64 string to byte array
        const byteCharacters = atob(fileData.fileByte);
        const byteArray = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }

        // Create a Blob object from the byte array
        const blob = new Blob([byteArray], { type: fileData.contentType });

        // Create a download link
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileData.fileName;
        // Programmatically click the link to trigger the download
        link.click();

        // Clean up
        URL.revokeObjectURL(link.href);
        ToastService.success(result.data.message);
      } else {
        ToastService.error(result.data.message);
      }
    } catch (error) {
      console.error("Error PulloutRequest", error);
    }
  };
  const ExportDataFromDetails = async () => {
    try {
      const result = await ReportDetailsService.exportDataFromDetails(
        Number(id)
      );
      if (result.success) {
        const fileData = result.data;

        // Check if fileData is valid
        if (!fileData || !fileData.fileByte || fileData.fileByte.length === 0) {
          console.error("File byte data is empty or invalid");
          return;
        }

        // Decode base64 string to byte array
        const byteCharacters = atob(fileData.fileByte);
        const byteArray = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }

        // Create a Blob object from the byte array
        const blob = new Blob([byteArray], { type: fileData.contentType });

        // Create a download link
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileData.fileName;
        // Programmatically click the link to trigger the download
        link.click();

        // Clean up
        URL.revokeObjectURL(link.href);
        ToastService.success(result.data.message);
      } else {
        ToastService.error(result.data.message);
      }
    } catch (error) {
      console.error("Error PulloutRequest", error);
    }
  };
  useEffect(() => {
    Getlist();
  }, [pagedResult.pageIndex]);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const data = await ReportDetailsService.getReportDetails(Number(id));
        setReportDetails(data);
      } catch (error) {
        console.error("Error fetching report details:", error);
        setError("Failed to fetch report details.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          padding: 4,
          maxWidth: 800,
          margin: "auto",
          border: "1px solid #ddd",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          padding: 4,
          width: "100%",
          margin: "auto",
          border: "1px solid #ddd",
          borderRadius: 2,
        }}
      >
        {/* Details Section */}
        <Typography variant="h5" gutterBottom>
          Report Details
        </Typography>
        {reportDetails?.status === ReportStatus.Standby && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#e3f2fd",
                padding: 2,
                borderRadius: 1,
                border: "1px solid #90caf9",
              }}
            >
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                <strong>Note:</strong> Sending a report will require an approval by approving officer.
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  // Handle close action
                }}
              >
                &times;
              </Button>
            </Box>
          </Box>
        )}
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body2" fontWeight="bold">
              Category:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">
              {reportDetails?.reportCategoryName}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" fontWeight="bold">
              Coverage:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">
              {reportDetails?.reportCoverageName}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" fontWeight="bold">
              Sending Status:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">{reportDetails?.statusName}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" fontWeight="bold">
              Generated By:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">{reportDetails?.createdBy}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" fontWeight="bold">
              Date Generated:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">
              {reportDetails && reportDetails.dateGenerated
                ? FormattedDate(reportDetails.dateGenerated)
                : ""}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" fontWeight="bold">
              Branch Code:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">
              {reportDetails?.selectedBranches}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" fontWeight="bold">
              Branch Covered:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">
              {reportDetails?.selectedBranches}
            </Typography>
          </Grid>
          {reportDetails?.status === ReportStatus.Sent && (
            <>
              <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                  Date Sent:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {new Date(reportDetails?.dateSent ?? "").toLocaleDateString()}
                </Typography>
              </Grid>
            </>
          )}
          <Divider sx={{ border: "1px solid", borderColor: "black" }} />
          <Grid item xs={12}>
            <Typography variant="h5">Recipients</Typography>
          </Grid>
          {reportDetails?.statusName === "Standby" ? (
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  multiple
                  options={recipientsOptions}
                  getOptionLabel={(option) => option.value}
                  value={selectedRecipients}
                  onChange={(_event, newValue) =>
                    onRecipientChange(
                      newValue.map((recipient) => recipient.value)
                    )
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Send to" />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option.value} {...getTagProps({ index })} />
                    ))
                  }
                />
                <FormHelperText className="text-danger"></FormHelperText>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  multiple
                  options={CCOptions}
                  getOptionLabel={(option) => option.value}
                  value={selectedCC}
                  onChange={(_event, newValue) =>
                    onCCChange(
                      newValue.map((recipient) => recipient.value)
                    )
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="CC:" />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option.value} {...getTagProps({ index })} />
                    ))
                  }
                />
                <FormHelperText className="text-danger"></FormHelperText>
              </FormControl>
            </Grid>
          ) : (
            <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <Autocomplete
                  disabled
                  multiple
                  options={recipientsOptions}
                  getOptionLabel={(option) => option.value}
                  value={recipientsOptions.filter(x => x.isSelected)}
                  onChange={(_event, newValue) =>
                    onRecipientChange(newValue.map((recipient) => recipient.value))
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Send to" />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                    <Chip label={option.value} {...getTagProps({ index })} />
                    ))
                  }
                  />
                  <FormHelperText className="text-danger"></FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <Autocomplete
                  disabled
                  multiple
                  options={CCOptions}
                  getOptionLabel={(option) => option.value}
                  value={CCOptions.filter(x => x.isSelected)}
                  onChange={(_event, newValue) =>
                    onCCChange(newValue.map((recipient) => recipient.value))
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="CC to" />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                    <Chip label={option.value} {...getTagProps({ index })} />
                    ))
                  }
                  />
                  <FormHelperText className="text-danger"></FormHelperText>
                </FormControl>
            </Grid>
          )}

          {reportDetails?.statusName === "Standby" && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (confirm("Are you sure you want to proceed?")) {
                }
              }}
            >
              Send for Approval
            </Button>
          )}

          {reportDetails?.statusName === "PendingApproval" && (
            <>
              <Button
                variant="outlined"
                color="info"
                onClick={() => {
                  // Handle re-assign
                }}
              >
                Re-assign
              </Button>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  // Handle reject
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (confirm("Are you sure you want to proceed?")) {
                    // Handle approve
                  }
                }}
              >
                Approve
              </Button>
            </>
          )}
        </Grid>
      </Box>

      <Box
        sx={{
          padding: 4,
          width: "100%",
          margin: "auto",
          border: "1px solid #ddd",
          borderRadius: 2,
          marginTop: 4, // Add some spacing between the boxes
        }}
      >
        <Typography variant="h5" gutterBottom>
          Report Data Content
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={3} sm={2}>
            <Button
              type="button"
              onClick={ExportDataFromDetails}
              variant="outlined"
              size="large"
              fullWidth
              sx={{
                color: "green",
                borderColor: "green",
                "&:hover": {
                  backgroundColor: "rgba(0, 128, 0, 0.1)", // Light green background on hover
                  borderColor: "darkgreen",
                },
              }}
            >
              Export Data
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2"></Typography>
            <Box>
              <Table columns={columns} data={pagedResult.data} />
            </Box>
            <PaginationControls
              currentPage={pagedResult.pageIndex}
              totalPages={pagedResult.totalPages ?? 0}
              onPageChange={handlePageChange}
              totalItems={pagedResult.countData}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ReportDetails;
