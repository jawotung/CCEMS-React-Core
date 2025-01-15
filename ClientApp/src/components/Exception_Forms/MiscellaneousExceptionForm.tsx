import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { ExceptionCodeDTO, MiscDTO } from "../../models/exceptionManagementDTOs";

interface MiscellaneousExceptionFormProps {
  formValues: MiscDTO;
  exceptionCodes: ExceptionCodeDTO[];
  category: string;
  onInputChange: (field: string, value: string | string[]) => void;
  // availableExceptionCodes: string[];
}

const MiscellaneousExceptionForm: React.FC<MiscellaneousExceptionFormProps> = ({
  formValues,
  exceptionCodes,
  category,
  onInputChange,
  // availableExceptionCodes,
}) => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Miscellaneous Exception Details
      </Typography>

      {/* Card Number */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Card Number."
          variant="outlined"
          fullWidth
          value={formValues.cardNo}
          onChange={(e) => onInputChange("cardNo", e.target.value)}
        />
      </Box>

      {/* Bank Cert Number */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Bank Cert Number"
          variant="outlined"
          fullWidth
          value={formValues.bankCertNo}
          onChange={(e) => onInputChange("bankCertNo", e.target.value)}
        />
      </Box>

      {/* DPAF Number */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="DPAF Number"
          variant="outlined"
          fullWidth
          value={formValues.dpafno}
          onChange={(e) => onInputChange("dpafno", e.target.value)}
        />
      </Box>

      {/* Amount */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          value={formValues.amount}
          onChange={(e) => onInputChange("amount", e.target.value)}
        />
      </Box>

      {/* Check Number */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Check Number"
          variant="outlined"
          fullWidth
          value={formValues.checkNo}
          onChange={(e) => onInputChange("checkNumber", e.target.value)}
        />
      </Box>

      {/* Account Number */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Account Number"
          variant="outlined"
          fullWidth
          value={formValues.glslaccountNo}
          onChange={(e) => onInputChange("accountNumber", e.target.value)}
        />
      </Box>

      {/* Account Name */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Account Name"
          variant="outlined"
          fullWidth
          value={formValues.glslaccountName}
          onChange={(e) => onInputChange("accountName", e.target.value)}
        />
      </Box>

      {/* Exception Code/s */}
      <FormControl fullWidth>
        <Autocomplete
          multiple
          options={exceptionCodes}
          getOptionLabel={(option) => option.name || option}
          value={Array.isArray(formValues.exceptionId) ? formValues.exceptionId : []}
          onChange={(_event, value) =>
            onInputChange('exceptionId', value.map(option => (option.name ? option.name : option)))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Exception Code/s"
              placeholder="Select exception codes"
              variant="outlined"
              fullWidth
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id || option}>
              {option.name || option}
            </li>
          )}
        />
      </FormControl>
    </Box>
  );
};

export default MiscellaneousExceptionForm;
