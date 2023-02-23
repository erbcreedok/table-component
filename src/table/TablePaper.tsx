import React, { FC } from 'react';
import Paper from '@mui/material/Paper';
import { TopToolbar } from '../toolbar/TopToolbar';
import { BottomToolbar } from '../toolbar/BottomToolbar';
import { TableContainer } from './TableContainer';
import type { TableInstance } from '..';

interface Props {
  table: TableInstance;
}

export const TablePaper: FC<Props> = ({ table }) => {
  const {
    getState,
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      muiTablePaperProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
    refs: { tablePaperRef },
  } = table;
  const { isFullScreen } = getState();

  const tablePaperProps =
    muiTablePaperProps instanceof Function
      ? muiTablePaperProps({ table })
      : muiTablePaperProps;

  return (
    <Paper
      elevation={2}
      {...tablePaperProps}
      ref={(ref: HTMLDivElement) => {
        tablePaperRef.current = ref;
        if (tablePaperProps?.ref) {
          //@ts-ignore
          tablePaperProps.ref.current = ref;
        }
      }}
      sx={(theme) => ({
        transition: 'all 150ms ease-in-out',
        ...(tablePaperProps?.sx instanceof Function
          ? tablePaperProps?.sx(theme)
          : (tablePaperProps?.sx as any)),
      })}
      style={{
        ...tablePaperProps?.style,
        ...(isFullScreen
          ? {
              height: '100vh',
              margin: 0,
              maxHeight: '100vh',
              maxWidth: '100vw',
              padding: 0,
              width: '100vw',
            }
          : {}),
      }}
    >
      {enableTopToolbar &&
        (renderTopToolbar instanceof Function
          ? renderTopToolbar({ table })
          : renderTopToolbar ?? <TopToolbar table={table} />)}
      <TableContainer table={table} />
      {enableBottomToolbar &&
        (renderBottomToolbar instanceof Function
          ? renderBottomToolbar({ table })
          : renderBottomToolbar ?? <BottomToolbar table={table} />)}
    </Paper>
  );
};
