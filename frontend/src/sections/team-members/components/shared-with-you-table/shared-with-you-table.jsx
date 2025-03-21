import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import {
  Table,
  Tooltip,
  Divider,
  TableBody,
  CardHeader,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';

import { getTeamDetails } from 'src/redux/slice/userSlice';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { _sharedwithyou } from './_sharedwithyou';
import { SharedWithYouTeamMemberTableRow } from './shared-with-you-table-row';
import { SharedWithYouTeamMemberTableToolbar } from './shared-with-you-table-toolbar';
import { SharedWithYouTeamMemberTableFiltersResult } from './shared-with-you-table-filters-result';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'sno', label: 'S.No', width: 'flex', whiteSpace: 'nowrap', tooltip: 'Serial Number' },

  {
    id: 'asdfasfd',
    label: 'Shared On',
    width: '200',
    whiteSpace: 'nowrap',
    align: 'left',
    tooltip: 'Date and time when the folder was shared.',
  },
  {
    id: 'folders',
    label: 'Folders Shared By',
    width: '200',
    tooltip: 'Email address of the admin who has shared the folder(s) with you.',
  },
  {
    id: 'permission',
    label: 'Permission Type',
    align: 'left',
    width: '200',
    tooltip: 'Indicates the access level as read and write access.',
  },
  {
    id: 'shared_on',
    label: 'Access Folder',
    width: '400',
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip: 'You can access folder(s) shared with you.',
  },
  { id: '', width: 50 },
];

// ----------------------------------------------------------------------

export default function SharedWithYouTeamMemberTable({
  sx,
  icon,
  title,
  total,
  color = 'warning',
  ...other
}) {
  const theme = useTheme();

  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(_sharedwithyou);

  const filters = useSetState({
    email: '', // Initialize email filter state
    status: 'all',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!filters.state.email || filters.state.status !== 'all';

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

 

  /* Delete Success Snackbar */

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] = useState({});





  const handleCloseConfirmDelete = () => {
    setConfirmDelete(false);
  };

  const handleOpenConfirmDialog = (action) => {
    setConfirmDialogProps(action);
    setConfirmDelete(true);
  };

  const {userInfo} = useSelector((state) => state.user)

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTeamDetails())
  }, [dispatch])

  const { sharedWithMe = [] } = userInfo || {}

  // Modify these conditions at the top of your component
  const nofoldersShared = sharedWithMe.length === 0; // When no tasks exist at all
  const noSearchResults = dataFiltered.length === 0 && filters.state.email; // When search returns no results

  // const { DataStatus, DataError } = useSelector((state) => state.member);   /* Table CircularProgress loading */

  // LoadingButton
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {/* Table */}
      <Card
        sx={{
          boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.2)',
          mt: 3,
        }}
      >
         <CardHeader
          title={
            <Box>
              <Box sx={{ typography: 'subtitle2', fontSize: '18px', fontWeight: 600 }}>
                <Tooltip
                  title="View folder(s) that others have shared with you."
                  arrow
                  placement="top"
                >
                  <span>
                    Folders Shared With You
                    </span> 
                </Tooltip>
              </Box>
            </Box>
          }
          subheader="Access and manage folders shared with you. View shared details, permission types, and access folders easily."
          action={total && <Label color={color}>{total}</Label>}
          sx={{
            p: 3,
          }}
        />
        <Divider />

        <SharedWithYouTeamMemberTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          dateError={dateError}
          numSelected={table.selected.length}
          nofoldersShared={nofoldersShared} // Disabled When No Folders Shared
        />

        {canReset && (
          <SharedWithYouTeamMemberTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          {/* <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="Remove the selected access.">
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleOpenConfirmDialog({
                      onConfirm: () => handleDeleteRow(),
                    })
                  }
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          /> */}

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
              {/* Table CircularProgress loading */}
              {/* {DataStatus === 'loading' && ( */}
              {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                <CircularProgress />
              </Box> */}
              {/* )} */}
              <TableHeadCustom
                showCheckbox
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )
                }
              />
              {nofoldersShared ? (
                <TableNoData
                  title="No folders shared!"
                  subTitle="You don't have access to any shared folders."
                  learnMoreText="Learn more"
                  learnMoreLink="https://forum.pabbly.com/threads/how-do-add-team-members-in-pabbly-connect-account.5336/#post-25220"
                  // tooltipTitle=""
                  notFound
                />
              ) : noSearchResults ? (
                <TableNoData
                  title="Search Not Found!"
                  subTitle={
                    <span>
                      No results found for &#34;<strong>{filters.state.email}</strong>&#34;
                    </span>
                  }
                  notFound
                />
              ) : (
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <SharedWithYouTeamMemberTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() =>
                          handleOpenConfirmDialog({
                            onConfirm: () => handleDeleteRow(row.id),
                          })
                        }
                        serialNumber={table.page * table.rowsPerPage + index + 1}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData />
                </TableBody>
              )}
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          disabled={nofoldersShared} // Disabled When No Folders Shared
          page={table.page}
          dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>


    </>
  );
}

function applyFilter({ inputData, filters }) {
  const { email } = filters;

  // Filter by email (search)
  if (email) {
    inputData = inputData.filter((variable) =>
      variable.email.toLowerCase().includes(email.toLowerCase())
    );
  }

  return inputData;
}
