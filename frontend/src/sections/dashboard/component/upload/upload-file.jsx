import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import React, { useState, forwardRef, useImperativeHandle } from 'react';

import { Box, TextField } from '@mui/material';

import { uploadBulkEmails } from 'src/redux/slice/emailSlice';

import FileUpload from 'src/components/upload/upload';


const UploadComponent = forwardRef(({ setAlertState, onUploadSuccess }, ref) => {
  const [emailListName, setListName] = useState('');
  const [listNameError, setListNameError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const dispatch = useDispatch();

 

  const uploadBulkEmail = async () => {
    if (!emailListName.trim()) {
      setListNameError(true);
      toast.error('Please enter a valid list name.');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a CSV file to upload.');
      return;
    }

    try {
      const result = await dispatch(uploadBulkEmails({ file: selectedFile, emailListName })).unwrap();
      onUploadSuccess();
    } catch (error) {
      toast.error(`Upload failed: ${error}`);
    }
  };

  const handleListNameChange = (event) => {
    const { value } = event.target;
    setListName(value);

    if (value.trim() !== '') {
      setListNameError(false);
    } else {
      setListNameError(true);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleListNameBlur = () => {
    if (emailListName.trim() === '') {
      setListNameError(true);
    }
  };

   // Expose uploadBulkEmail function to parent
   useImperativeHandle(ref, () => ({
    uploadBulkEmail
  }));

  return (
    <Box>
      <Box>
        <TextField
          label="Email List Name"
          fullWidth
          value={emailListName}
          onChange={handleListNameChange}
          onBlur={handleListNameBlur}
          placeholder="Enter the name of the email list here"
          error={listNameError}
          helperText={
            <span>
              {listNameError ? (
                'Email list name is required'
              ) : (
                <>
                  Enter the name of the email list here.{' '}

                </>
              )}
            </span>
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
            mb: '24px',
          }}
        />

        <FileUpload
          uploadInformation="Upload File OR Drag and Drop file here (Only CSV files allowed). Download Sample File here."
          allowedFileTypes={['text/csv']}
          fileName="sample_csv.csv"
          fileErrorMessage="Upload Error: Please ensure you upload a valid CSV file. You can download a sample file here."
          setAlertState={setAlertState}
          onSampleFileClick={() => {}}
          onFileUpload={handleFileSelect}
          selectedFile={selectedFile}
        />
      </Box>
    </Box>
  );
});

export default UploadComponent;
