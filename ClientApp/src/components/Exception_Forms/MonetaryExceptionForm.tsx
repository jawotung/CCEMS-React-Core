import React from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Autocomplete,
} from '@mui/material';
import { ExceptionCodeDTO, MonetaryDTO } from '../../models/exceptionManagementDTOs';

interface MonetaryExceptionFormProps {
  formValues: MonetaryDTO;
  onInputChange: (field: string, value: string | string[]) => void;
  exceptionCodes: ExceptionCodeDTO[];
  currencies?: string[];
}

const MonetaryExceptionForm: React.FC<MonetaryExceptionFormProps> = ({
  formValues,
  onInputChange,
  exceptionCodes,
  currencies = ['PHP', 'USD', 'EUR', 'YEN'],
}) => {
  const handleValidate = async () => {
    // Validation logic
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        mt: 5,
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Monetary Exception Details
      </Typography>

      {/* BDS User ID and Sequence No with Validate Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <TextField
          label="BDS User ID"
          variant="outlined"
          fullWidth
          value={formValues.id}
          onChange={(e) => onInputChange('bdsUserId', e.target.value)}
        />
        <TextField
          label="Sequence No"
          variant="outlined"
          fullWidth
          value={formValues.sequenceNo}
          onChange={(e) => onInputChange('sequenceNo', e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleValidate}>
          Validate
        </Button>
      </Box>

      {/* Transaction Code and Description */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Transaction Code"
          variant="outlined"
          fullWidth
          value={formValues.transCode}
          onChange={(e) => onInputChange('transactionCode', e.target.value)}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Transaction Description"
          variant="outlined"
          fullWidth
          value={formValues.transDescription}
          onChange={(e) =>
            onInputChange('transactionDescription', e.target.value)
          }
        />
      </Box>

      {/* Credit Account Details */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Credit Account/GL Reference Number"
          variant="outlined"
          fullWidth
          value={formValues.creditAccountNo}
          onChange={(e) => onInputChange('creditReference', e.target.value)}
        />
        <TextField
          label="Credit Account/GL Account Name"
          variant="outlined"
          fullWidth
          value={formValues.creditAccountName}
          onChange={(e) =>
            onInputChange('creditAccountName', e.target.value)
          }
        />
      </Box>

      {/* Debit Account Details */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Debit Account/GL Reference Number"
          variant="outlined"
          fullWidth
          value={formValues.debitAccountNo}
          onChange={(e) => onInputChange('debitReference', e.target.value)}
        />
        <TextField
          label="Debit Account/GL Account Name"
          variant="outlined"
          fullWidth
          value={formValues.debitAccountName}
          onChange={(e) => onInputChange('debitAccountName', e.target.value)}
        />
      </Box>

      {/* Amount and Currency */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          value={formValues.amount}
          onChange={(e) => onInputChange('amount', e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel id="currency-label">Currency</InputLabel>
          <Select
            labelId="currency-label"
            label="Currency"
            value={formValues.currency}
            onChange={(e) => onInputChange('currency', e.target.value as string)}
          >
            <MenuItem value="">
              <em>-- Select --</em>
            </MenuItem>
            {currencies.map((currency, index) => (
              <MenuItem key={index} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Exception Code */}



      <FormControl fullWidth sx={{ mb: 2 }}>

        {/* <InputLabel id="exception-code-label">Exception Code/s</InputLabel>
        <TextField
          label="Exception Code/s"
          value={Array.isArray(formValues.exceptionId) ? formValues.exceptionId.join(', ') : ''}
          onChange={(e) => onInputChange('exceptionCode', e.target.value.split(',').map(code => code.trim()))}
          variant="outlined"
          fullWidth
        /> */}

        <Autocomplete
          multiple
          options={exceptionCodes} // Replace with the options for exception codes
          getOptionLabel={(option) => option.name || option} // Customize to match your data structure
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

export default MonetaryExceptionForm;
