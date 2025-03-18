import { useDispatch } from 'react-redux';

import { Box, Alert, Button, Typography } from '@mui/material';


export default function ChartAlert() {
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center verticall
        mb: 3,
        mt: 3,
        px: 3,
      }}
    >
      <Alert severity="success" variant="outlined" sx={{ width: '100%' }}>
        <Typography fontSize={14} fontWeight={600}>
          Email List Uploaded Successfully!
        </Typography>
      </Alert>
      <Button color="primary" variant='outlined' sx={{ mt: 3 }} onClick={() =>{}}>
        Start Verification
      </Button>
    </Box>
  );
}
