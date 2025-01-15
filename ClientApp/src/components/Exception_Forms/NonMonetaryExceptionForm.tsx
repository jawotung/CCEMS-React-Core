import React from "react";
import { Button, TextField, Typography, Box, Autocomplete, FormControl } from "@mui/material";
import { ExceptionCodeDTO, NonMonetaryDTO } from "../../models/exceptionManagementDTOs";

interface MonetaryExceptionFormProps {
  formValues: NonMonetaryDTO;
  onInputChange: (field: string, value: string | string[]) => void;
  exceptionCodes: ExceptionCodeDTO[];
  currencies?: string[];
}

const NonMonetaryExceptionForm: React.FC<MonetaryExceptionFormProps> = ({
  formValues,
  onInputChange,
  exceptionCodes,
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
        Non-Monetary Exception Details
      </Typography>

      {/* CIF Number Field with Button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <TextField
          label="CIF Number"
          variant="outlined"
          fullWidth
          value={formValues.cifnumber}
          onChange={(e) => onInputChange("cifNumber", e.target.value)}
        />
        <Button variant="contained" color="primary" sx={{ whiteSpace: "nowrap" }}>
          Validate
        </Button>
      </Box>

      {/* Customer Name Field */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Customer Name"
          variant="outlined"
          fullWidth
          value={formValues.customerName}
          onChange={(e) => onInputChange("customerName", e.target.value)}
        />
      </Box>

      {/* Customer Account Number Field */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Customer Account Number"
          variant="outlined"
          fullWidth
          value={formValues.customerAccountNo}
          onChange={(e) => onInputChange("customerAccountNumber", e.target.value)}
        />
      </Box>

      {/* Exception Code Field */}
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

export default NonMonetaryExceptionForm;
