import React from 'react';
import Box from '@mui/material/Box';
import { FullScreenToggleButton } from '../buttons/FullScreenToggleButton';
import { ShowHideColumnsButton } from '../buttons/ShowHideColumnsButton';
import { ToggleFiltersButton } from '../buttons/ToggleFiltersButton';
import { ToggleGlobalFilterButton } from '../buttons/ToggleGlobalFilterButton';
import type { TableInstance } from '..';

interface Props<TData extends Record<string, any> = {}> {
  table: TableInstance<TData>;
}

export const ToolbarInternalButtons = <
  TData extends Record<string, any> = {},
>({
  table,
}: Props<TData>) => {
  const {
    options: {
      enableColumnFilters,
      enableColumnOrdering,
      enableFilters,
      enableFullScreenToggle,
      enableGlobalFilter,
      enableHiding,
      enablePinning,
      initialState,
      renderToolbarInternalActions,
    },
  } = table;

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        zIndex: 3,
      }}
    >
      {renderToolbarInternalActions?.({
        table,
      }) ?? (
        <>
          {enableFilters &&
            enableGlobalFilter &&
            !initialState?.showGlobalFilter && (
              <ToggleGlobalFilterButton table={table} />
            )}
          {enableFilters && enableColumnFilters && (
            <ToggleFiltersButton table={table} />
          )}
          {(enableHiding || enableColumnOrdering || enablePinning) && (
            <ShowHideColumnsButton table={table} />
          )}
          {enableFullScreenToggle && (
            <FullScreenToggleButton table={table} />
          )}
        </>
      )}
    </Box>
  );
};
