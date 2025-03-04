import { toast } from 'sonner';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { useRef, useState, useEffect } from 'react';

import {
  Box,
  Card,
  Button,
  Select,
  Divider,
  Tooltip,
  useTheme,
  MenuItem,
  TextField,
  CardHeader,
  Typography,
  InputLabel,
  FormControl,
  FormHelperText,
  InputAdornment,
} from '@mui/material';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const metadata = { title: `Time-Zone | ${CONFIG.site.name}` };

export default function Page() {
  const theme = useTheme();

  const searchInputRef = useRef(null);

  // Redux state

  
  // Local state
  const [selectedTimezone, setSelectedTimezone] = useState('America/Danmarkshavn');
  const [searchTerm, setSearchTerm] = useState('');


  // Get all available timezones using moment-timezone
  const timezones = moment.tz.names().map((tz) => ({
    value: tz,
    label: `(UTC ${moment.tz(tz).format('Z')}) ${tz.replace(/_/g, ' ')}`,
  }));

  // Fetch timezone on component mount




  const handleTimezoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTimezones = timezones.filter(
    (tz) => tz.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const SaveTimezone = ()=>{
    toast.success(`Timezone updated successfully.`, {
 
      style: {
        marginTop: '15px',
      },
    });
  }

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                <Tooltip
                  title="Choose the time zone for your account. All dates and times will align with this setting."
                  disableInteractive
                  arrow
                  placement="top"
                >
                  <span>Time Zone</span>
                </Tooltip>
              </Typography>
            }
            sx={{ mb: 3 }}
          />
          <Divider />
          <Box sx={{ p: 3 }}>
           

           

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="time-zone-select-label">Select Time Zone</InputLabel>

              <Select
                labelId="time-zone-select-label"
                id="time-zone-select"
                value={selectedTimezone}
                label="Select Time Zone"
                onChange={handleTimezoneChange}
              
                IconComponent={() => (
                  <Iconify width={24} icon="iconamoon:arrow-down-2-bold" sx={{ mr: 1 }} />
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      width: 250,
                      maxHeight: 450,
                    },
                  },
                }}
              >
                <Box sx={{ p: 2, position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search time zone..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    inputRef={searchInputRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:search-fill" width={24} height={24} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                {filteredTimezones.map((tz) => (
                  <MenuItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Select the time zone that matches your current location.{' '}
                <a
                  href="https://forum.pabbly.com/threads/how-to-set-your-time-zone-in-pabbly-hook.25576/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}
                >
                  Learn more
                </a>
              </FormHelperText>
            </FormControl>
            <Box>
              <Tooltip
                title="Click 'Save' to apply the selected time zone to your account"
                arrow
                placement="top"
              >
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                 
               onClick={SaveTimezone}
                    // startIcon={ <CircularProgress size={20} color="inherit" />}
                  >
                    Save
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Card>
      </Box>

    
    </>
  );
}
