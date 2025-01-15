import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import userService from '../../../services/userService';
import EmployeeService from '../../../services/employeeService';
import GroupService from '../../../services/groupService';
import { GroupDTO } from '../../../models/groupDTOs';
import MonetaryExceptionForm from '../../../components/Exception_Forms/MonetaryExceptionForm';
import { ExceptionCodeDTO, MiscDTO, MonetaryDTO, NonMonetaryDTO } from '../../../models/exceptionManagementDTOs';
import NonMonetaryExceptionForm from '../../../components/Exception_Forms/NonMonetaryExceptionForm';
import ExceptionManagement from '../../../services/exceptionManagement';
import MiscellaneousExceptionForm from '../../../components/Exception_Forms/MiscellaneousExceptionForm';


const AddException: React.FC = () => {
  const [branchOption, setBranchOption] = useState<GroupDTO[]>();
  const [exceptionCodes, setExceptionCodes] = useState<ExceptionCodeDTO[]>();
  const [monetaryFormValues, setMonetaryFormValues] = useState<MonetaryDTO>({} as MonetaryDTO);
  const [nonMonetaryFormValues, setNonMonetaryFormValues] = useState<NonMonetaryDTO>({} as NonMonetaryDTO);
  const [miscFormValues, setMiscFormValues] = useState<MiscDTO>({} as MiscDTO);
  const [formValues, setFormValues] = useState({
    employeeID: '',
    employeeName: '',
    branchName: '',
    branchCode: 0,
    division: '',
    area: '',
    transactionDate: '',
    transactionType: '',
    category: '',
    rootCause: '',
    exceptionApprover: '',
    agingCategory: 0,
    employeeResponsible: '',
    otherEmployeesResponsible: '',
    remarks: '',
    redFlag: false,
    exceptionCodes: [],
    miscs: [],
    monetaries: [],
    nonMonetaries: [],
    actionPlans: [],
    selectedExCodes: [],
    subExceptionItems: [],
    request: '',
    approvalRemarks: '',
  });

  type Errors = {
    employeeId: string;
    transactionType: string;
    rootCause: string;
    branchName: string;
    branchCode: string;
    division: string;
    category: string;
    area: string;
    exceptionApprover: string;
    agingCategory: string;
    employeeResponsible: string;
    otherEmployeesResponsible: string;
    remarks: string;
    [key: string]: string;

  };

  const [errors, setErrors] = useState<Errors>({
    employeeId: '',
    transactionType: '',
    category: '',
    rootCause: '',
    branchName: '',
    branchCode: '',
    division: '',
    area: '',
    exceptionApprover: '',
    agingCategory: '',
    employeeResponsible: '',
    otherEmployeesResponsible: '',
    remarks: '',
  });

  const handleMoneratryInputChange = (field: keyof Errors, value: any) => {
    setMonetaryFormValues({
      ...monetaryFormValues,
      [field]: value,
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' }); // Clear the error on input change
    }
  };

  const handleNonMoneratryInputChange = (field: keyof Errors, value: any) => {
    setNonMonetaryFormValues({
      ...nonMonetaryFormValues,
      [field]: value,
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' }); // Clear the error on input change
    }
  };

  const handleMiscInputChange = (field: keyof Errors, value: any) => {
    setMiscFormValues({
      ...miscFormValues,
      [field]: value,
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' }); // Clear the error on input change
    }
  };
  const handleInputChange = async (field: keyof Errors, value: any) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });

    const exceptionData = await ExceptionManagement.getDeviationByClasification(formValues.transactionType);
    setExceptionCodes(exceptionData);

    if (errors[field]) {
      setErrors({ ...errors, [field]: '' }); // Clear the error on input change
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: any = {};
    if (!formValues.employeeID) {
      newErrors.employeeId = 'Employee ID is required.';
      valid = false;
    }
    if (!formValues.transactionType.trim()) {
      newErrors.transactionType = 'Transaction Type is required.';
      valid = false;
    }
    if (!formValues.rootCause) {
      newErrors.rootCause = 'Root Cause is required.';
      valid = false;
    }
    if (!formValues.branchName.trim()) {
      newErrors.branchName = 'Branch Name is required.';
      valid = false;
    }
    if (!formValues.branchCode) {
      newErrors.branchCode = 'Branch Code is required.';
      valid = false;
    }
    if (!formValues.division.trim()) {
      newErrors.division = 'Division is required.';
      valid = false;
    }
    if (!formValues.area.trim()) {
      newErrors.area = 'Area is required.';
      valid = false;
    }
    if (!formValues.exceptionApprover.trim()) {
      newErrors.exceptionApprover = 'Exception Approver is required.';
      valid = false;
    }
    if (!formValues.agingCategory) {
      newErrors.agingCategory = 'Aging Category is required.';
      valid = false;
    }
    if (!formValues.employeeResponsible.trim()) {
      newErrors.employeeResponsible = 'Employee Responsible is required.';
      valid = false;
    }
    if (!formValues.otherEmployeesResponsible.trim()) {
      newErrors.otherEmployeesResponsible = 'Other Employees Responsible is required.';
      valid = false;
    }
    if (!formValues.remarks.trim()) {
      newErrors.remarks = 'Remarks are required.';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form Submitted:', formValues);
    } else {
      console.log('Validation failed.');
    }
  };

  const handleReset = () => {
    setFormValues({
      employeeID: '',
      employeeName: '',
      branchName: '',
      branchCode: 0,
      division: '',
      area: '',
      transactionDate: '',
      transactionType: '',
      category: '',
      rootCause: '',
      exceptionApprover: '',
      agingCategory: 0,
      employeeResponsible: '',
      otherEmployeesResponsible: '',
      remarks: '',
      redFlag: false,
      exceptionCodes: [],
      miscs: [],
      monetaries: [],
      nonMonetaries: [],
      actionPlans: [],
      selectedExCodes: [],
      subExceptionItems: [],
      request: '',
      approvalRemarks: ''
    });
    handleClearErrors();
  };

  const handleClearErrors = () => {
    setErrors({
      employeeId: '',
      transactionType: '',
      rootCause: '',
      category: '',
      branchName: '',
      branchCode: '',
      division: '',
      area: '',
      exceptionApprover: '',
      agingCategory: '',
      employeeResponsible: '',
      otherEmployeesResponsible: '',
      remarks: '',
      exceptionCodes: '',
      miscs: '',
      monetaries: '',
      nonMonetaries: '',
      actionPlans: '',
      selectedExCodes: '',
      subExceptionItems: '',
      request: '',
      approvalRemarks: ''

    });
  }


  const getBranchIds = async (employeeId: any) => {
    try {
      const result = await userService.getUserById(employeeId);

      if (result.success) {
        // const branches: string[] = result.data.map((branch: BranchAccessDTO) => branch.branchId);

        const userData = result.data;

        const branchIds = userData.branchAccesses.map((branch: any) => branch.branchId);

        return branchIds;

      } else {
        console.log("error in getting user branch id's")
        return [];
      }
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }


  const onBranchOptionChange = async (branchId: any) => {
    const result = await GroupService.getGroupById(branchId);

    if (result.success) {
      const branchDetails = result.data;
      setFormValues({
        ...formValues,
        // branchName: branchDetails.name,
        branchCode: branchDetails.code,
        division: branchDetails.division,
        area: branchDetails.area,
      });
    } else {
      console.log("Error in getting branch details");
    }
  };

  const handleValidate = async (employeeId: string) => {
    handleClearErrors();

    try {
      const result = await EmployeeService.getEmployeeById(employeeId);

      if (result.success) {

        const branchIds = await getBranchIds(employeeId);
        const branchAccesses = await GroupService.getBranchDetails(branchIds);

        setBranchOption(branchAccesses);

        console.log(branchOption)

        const fullName = `${result.data.firstName} ${result.data.middleName} ${result.data.lastName}`;
        setFormValues({ ...formValues, employeeName: fullName, employeeResponsible: fullName });
      } else {
        setBranchOption([])
        setErrors({ ...errors, employeeId: 'Employee ID is invalid.' });
      }
    } catch (error) {
      setErrors({ ...errors, employeeId: 'Error validating employee ID.' });
    }
  };

  return (
    <Box display="flex">
      <Box width="50%">
        <Typography variant="h5" mb={2} textAlign={'center'}>
          Information
        </Typography>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Employee ID"
              fullWidth
              value={formValues.employeeID}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              error={!!errors.employeeId}
              helperText={errors.employeeId}
            />
          </Grid>
          <Grid item xs={12} sm={6} mt={1}>
            <Button variant="contained" fullWidth onClick={() => handleValidate(formValues.employeeID)}>
              Validate
            </Button>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Employee Name"
              fullWidth
              value={formValues.employeeName}
              onChange={(e) => handleInputChange('employeeName', e.target.value)}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Branch Name</Typography>
            <Select
              displayEmpty
              fullWidth
              value={formValues.branchName ? [formValues.branchName] : []}
              onChange={(e) => {
                handleInputChange('branchName', e.target.value);
                onBranchOptionChange(e.target.value);
              }}
              error={!!errors.branchName}
            >
              <MenuItem value="">-- Select Branch --</MenuItem>
              {branchOption && branchOption.map((branch: GroupDTO) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
            {errors.branchName && (
              <Typography color="error" variant="caption">
                {errors.branchName}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6} mt={'22px'}>
            <TextField
              label="Branch Code"
              fullWidth
              value={formValues.branchCode}
              onChange={(e) => handleInputChange('branchCode', e.target.value)}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Division"
              fullWidth
              value={formValues.division}
              onChange={(e) => handleInputChange('division', e.target.value)}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Area"
              fullWidth
              value={formValues.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle1">Transaction Type</Typography>
            <Select
              displayEmpty
              fullWidth
              value={formValues.transactionType}
              onChange={(e) => handleInputChange('transactionType', e.target.value)}
              error={!!errors.transactionType}
            >
              <MenuItem value="">-- Select Transaction --</MenuItem>
              <MenuItem value="Monetary">Monetary</MenuItem>
              <MenuItem value="Non-Monetary">Non-Monetary</MenuItem>
              <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
              {/* Add transaction type options here */}
            </Select>
            {errors.transactionType && (
              <Typography color="error" variant="caption">
                {errors.transactionType}
              </Typography>
            )}
          </Grid>


          {formValues.transactionType === "Miscellaneous" && (

            <Grid item xs={12} sm={12}>
              <Typography variant="subtitle1">Category</Typography>
              <Select
                displayEmpty
                fullWidth
                value={formValues.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                error={!!errors.transactionType}
              >
                <MenuItem value="">-- Select Type --</MenuItem>
                <MenuItem value="1">EMV</MenuItem>
                <MenuItem value="2">Bank Certification</MenuItem>
                <MenuItem value="3">General Ledger</MenuItem>
                <MenuItem value="4">Deposit Pick-up Authorization Form</MenuItem>
                <MenuItem value="5">Due From Local Banks</MenuItem>
                <MenuItem value="6">BDS Reports</MenuItem>
                <MenuItem value="7">Other Clearing Deficiencies</MenuItem>
                <MenuItem value="8">Checkbook</MenuItem>
                <MenuItem value="9">New Account Tagging</MenuItem>
                <MenuItem value="10">Surprise Count</MenuItem>
                <MenuItem value="11">Official Receipt</MenuItem>
              </Select>
              {errors.transactionType && (
                <Typography color="error" variant="caption">
                  {errors.transactionType}
                </Typography>
              )}
            </Grid>


          )}


          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Root Cause</Typography>
            <Select
              displayEmpty
              fullWidth
              value={formValues.rootCause}
              onChange={(e) => handleInputChange('rootCause', e.target.value)}
              error={!!errors.rootCause}
            >
              <MenuItem value="">-- Select Root Cause --</MenuItem>
              <MenuItem value="1">Employee Lapse</MenuItem>
              <MenuItem value="2">Business Decision</MenuItem>
            </Select>
            {errors.rootCause && (
              <Typography color="error" variant="caption">
                {errors.rootCause}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6} mt={'22px'}>
            <TextField
              label="Exception Approver"
              fullWidth
              value={formValues.exceptionApprover}
              disabled = {formValues.rootCause === '1'}
              onChange={(e) => handleInputChange('exceptionApprover', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Typography variant="subtitle1">Aging Category</Typography>
            <Select
              displayEmpty
              fullWidth
              value={formValues.agingCategory}
              onChange={(e) => handleInputChange('rootCause', e.target.value)}
              error={!!errors.agingCategory}
            >
              <MenuItem value="">-- Select Aging Category --</MenuItem>
              {/* Add root cause options here */}
            </Select>
            {errors.agingCategory && (
              <Typography color="error" variant="caption">
                {errors.agingCategory}
              </Typography>
            )}
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              label="Aging Category"
              fullWidth
              value={formValues.agingCategory}
              onChange={(e) => handleInputChange('agingCategory', e.target.value)}
            />
          </Grid> */}
          <Grid item xs={12} sm={12}>
            <TextField
              label="Employee Responsible"
              fullWidth
              value={formValues.employeeResponsible}
              onChange={(e) => handleInputChange('employeeResponsible', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Other Employee's Responsible"
              fullWidth
              value={formValues.otherEmployeesResponsible}
              onChange={(e) => handleInputChange('otherEmployeesResponsible', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              multiline
              rows={4}
              fullWidth
              value={formValues.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.redFlag}
                  onChange={(e) => handleInputChange('redFlag', e.target.checked)}
                />
              }
              label="Red Flag"
            />
          </Grid>



          <Grid item xs={12} sm={6}>
            <Button variant="outlined" fullWidth onClick={handleReset}>
              Reset
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="success" fullWidth onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box width="50%" ml={10}>
        {/* <Typography variant="h5" mb={2} textAlign={'center'}>
          Information
        </Typography> */}

        {formValues.transactionType === "Monetary" && (
          <MonetaryExceptionForm
            formValues={monetaryFormValues}
            onInputChange={handleMoneratryInputChange}
            exceptionCodes={exceptionCodes || []}
          />
        )}

        {formValues.transactionType === "Non-Monetary" && (
          <NonMonetaryExceptionForm
            formValues={nonMonetaryFormValues}
            onInputChange={handleNonMoneratryInputChange}
            exceptionCodes={exceptionCodes || []}
          />
        )}

        {formValues.transactionType === "Miscellaneous" && (
          <MiscellaneousExceptionForm
            formValues={miscFormValues}
            category={formValues.category}
            onInputChange={handleMiscInputChange}
            exceptionCodes={exceptionCodes || []}
          />
        )}

        <Divider />



      </Box>
    </Box>
  );
};

export default AddException;
