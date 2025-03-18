import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Chip from '@mui/material/Chip';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { fetchEmailLists } from 'src/redux/slice/emailSlice';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function DashboardTableFiltersResult({ filters, totalResults, onResetPage, sx }) {
  const dispatch = useDispatch();

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
    filters.setState({ status: 'all' });

  }, [filters, onResetPage]);
  
  const handleRemoveStatus = () => {
    onResetPage();
    filters.setState({ status: 'all' });
    dispatch(fetchEmailLists({
      type: "bulk"
    }))
  }

  const handleRemoveDate = () => {
    onResetPage();
    filters.setState({ status: 'all' });
    dispatch(fetchEmailLists({
      type: "bulk"
    }))
  }

  const handleReset = () => {
    handleRemoveKeyword()
    filters.setState({ status: 'all' });
    dispatch(fetchEmailLists({
      type: "bulk"
    }))
  }

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Status:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Date:"
        isShow={Boolean(filters.state.startDate && filters.state.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(filters.state.startDate, filters.state.endDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
