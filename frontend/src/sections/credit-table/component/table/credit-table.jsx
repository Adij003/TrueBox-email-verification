import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Divider, CardHeader, Typography } from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

import { fIsBetween } from 'src/utils/format-time';

import { fetchCredits } from 'src/redux/slice/creditSlice';
import { fetchEmailLists } from 'src/redux/slice/emailSlice';

import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { CreditTableRow } from './credit-table-row';
import { CreditTableToolbar } from './credit-table-toolbar';
import { CreditTableFiltersResult } from './credit-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {
    id: 'statusdate',
    label: 'Status/Date',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'View the verification type and the date/time it occurred.',
  },

  {
    id: 'verificationsummary',
    label: 'Verification Summary',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'View whether a bulk email list or a single email address was verified.',
  },
  {
    id: 'credits',
    label: 'Credits',
    width: 'flex',
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip: 'View the email credits usage and allocation details.',
  },
];

// ----------------------------------------------------------------------

export function CreditTable() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const { emailLists, pagination, } = useSelector((state) => state.emailVerification);

  const { totalItems } = pagination;
  
  const filters = useSetState({
    name: '',
    status: 'all',
  });
  const dispatch = useDispatch();

  const dataFiltered = applyFilter({
    inputData: emailLists,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  useEffect(() => {
    dispatch(fetchEmailLists({
      page: table.page + 1,
      limit: table.rowsPerPage,
      status: 'completed'
    }));
    dispatch(fetchCredits())
  }, [dispatch, table.page, table.rowsPerPage]);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilterApply = (selectedFilter) => {
    if(selectedFilter.selectedstatus === 'all'){
      return dispatch(fetchEmailLists({
        page: table.page + 1,
        limit: table.rowsPerPage,
        status: 'completed'
      }))
    }
    return dispatch(fetchEmailLists({
      type: selectedFilter.selectedstatus,
      page: table.page + 1,
      limit: table.rowsPerPage,
      status: 'completed'
    }))
  }
  
  let timeout;
  const handleSearch = (search) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      dispatch(fetchEmailLists({
        page: table.page + 1,
        limit: table.rowsPerPage,
        status: 'completed',
        search: search?.search|| ""  
      }));
    }, 600);
  };

  const handleRefresh = () => {
    dispatch(fetchEmailLists({ 
      status: 'completed',
      skip: 5,
      limit: table.rowsPerPage,
    }))
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box display="inline-block">
            <Typography variant="h6">Email Verification Logs</Typography>
          </Box>
        }
        sx={{ pb: 3 }}
        subheader="View all email verification activities, including type, date, summary, and credit usage. Use filters or search to find specific logs."
      />
      <Divider />

      <CreditTableToolbar filters={filters} onResetPage={table.onResetPage} onApplyFilter={handleFilterApply} onApplySearch={handleSearch} onRefresh={handleRefresh} />

      {canReset && (
        <CreditTableFiltersResult
          filters={filters}
          totalResults={emailLists.length}
          onResetPage={table.onResetPage}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              showCheckbox={false}
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

            <TableBody>
              {emailLists
                .map((row, index) => (
                  <CreditTableRow
                    key={index}
                    row={row}
                    selected={table.selected.includes(row.id)}
                  />
                ))}
              
              {emailLists.length === 0 &&
                <TableNoData
                  title="Not Data Found"
                  description="No data found in the table"
                  notFound={notFound}
                />
             }
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      <TablePaginationCustom
        page={table.page}
        count={totalItems}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  let filteredData = inputData;

  // Filter by message (name)
  if (name) {

    filteredData = filteredData.filter(
      (order) => order.message && order.message.toLowerCase().includes(name.toLowerCase()) ||
        order.folder && order.folder.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter by status
  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.credits === status);
  }

  // Filter by date range
  if (!dateError) {
    if (startDate && endDate) {
      filteredData = filteredData.filter((order) =>
        fIsBetween(new Date(order.dateCreatedOn), startDate, endDate)
      );
    }
  }

  return filteredData;
}
