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
  rowInPage,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { _teammember } from './_teammember';
import { SharedbyYouTeamMemberTableRow } from './team-member-table-row';
import { SharedbyYouTeamMemberTableToolbar } from './team-member-table-toolbar';
import { SharedbyYouTeamMemberTableFiltersResult } from './team-member-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'sno', label: 'S.No', width: 'flex', whiteSpace: 'nowrap', tooltip: 'Serial Number' },

  {
    id: 'asdfasfddas',
    label: 'Shared On',
    width: '400',
    whiteSpace: 'nowrap',
    align: 'left',
    tooltip: 'Date and time when the folder was shared.',
  },
  {
    id: 'team_member_email',
    label: 'Team Member Email',
    width: '250',
    tooltip: 'Email address of the team member with whom the folder is shared.',
  },
  {
    id: 'permission',
    label: 'Permission Type',
    align: 'right',
    width: '200',
    tooltip: 'Indicates the access level as read and write access.',
  },

  { id: '', width: 50 },
];

// ----------------------------------------------------------------------

export default function SharedbyYouTeamMemberTable({
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
  const [tableData, setTableData] = useState(_teammember);

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

  const handleOpenConfirmDialog = (action) => {
  };

  // Modify these conditions at the top of your component
  const nomemberAdded = tableData.length === 0; // When no tasks exist at all
  const noSearchResults = dataFiltered.length === 0 && filters.state.email; // When search returns no results

  // LoadingButton
  const {userInfo} = useSelector((state) => state.user)

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTeamDetails())
  }, [dispatch])


  const { teamMembers = [] } = userInfo || {};
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
                  title="Add team members and share folder(s) access with them."
                  arrow
                  placement="top"
                >
                   <span>Team Members</span>
                </Tooltip>
              </Box>
            </Box>
          }
          subheader="View and manage team members with assigned permissions. Add new members, filter access, and update roles efficiently."
          action={total && <Label color={color}>{total}</Label>}
          sx={{
            p: 3,
          }}
        />
        <Divider />

        <SharedbyYouTeamMemberTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          dateError={dateError}
          numSelected={table.selected.length}
          nomemberAdded={nomemberAdded}
        />

        {canReset && (
          <SharedbyYouTeamMemberTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'}>
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
              {nomemberAdded ? (
                <TableNoData
                  title="No team members added!"
                  subTitle="You have not added any team members yet. You can add a team member and share access to folders with them."
                  learnMoreText="Learn more"
                  learnMoreLink="https://forum.pabbly.com/threads/how-do-add-team-members-in-pabbly-connect-account.5336/#post-25220"
                  // tooltipTitle="Buy agency tasks plan to assign agency tasks to other Pabbly Connect accounts."
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
                  {teamMembers
                    .map((row, index) => (
                      <SharedbyYouTeamMemberTableRow
                        key={row._id}
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

                  <TableNoData />
                </TableBody>
              )}
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          disabled={nomemberAdded} // Disabled When No Team Members Added
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
