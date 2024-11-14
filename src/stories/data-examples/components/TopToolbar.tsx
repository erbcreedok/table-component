import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import type { Theme } from '@mui/material/styles'
import { lighten } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import React, { Fragment } from 'react'
import type { TableData, TableInstance } from '../../..'
import { IconsColor } from '../../../components/styles'
import { GroupIcon } from '../../../icons/GroupIcon'
import { TableToolbar } from '../../../TableToolbar'
import { SortedAscIcon } from './SortedAscIcon'
import { SortedDescIcon } from './SortedDescIcon'

export const commonToolbarStyles = ({ theme }: { theme: Theme }) => ({
	alignItems: 'flex-start',
	backgroundColor: lighten(theme.palette.background.default, 0.04),
	backgroundImage: 'none',
	display: 'grid',
	flexWrap: 'wrap-reverse',
	minHeight: '3.5rem',
	overflow: 'hidden',
	p: '0 !important',
	transition: 'all 150ms ease-in-out',
	zIndex: 1,
})

interface Props<TData = TableData> {
  table: TableInstance<TData>;
}

export const TopToolbar = ({
  table,
}: Props) => {
  const {
    getState,
    options: {
      muiTopToolbarProps,
      muiToolbarAlertBannerChipProps,
    },
    refs: { topToolbarRef },
  } = table;

  const { isFullScreen, grouping, sorting } = getState();

  const chipProps =
    muiToolbarAlertBannerChipProps instanceof Function
      ? muiToolbarAlertBannerChipProps({ table })
      : muiToolbarAlertBannerChipProps;

  const toolbarProps =
    muiTopToolbarProps instanceof Function
      ? muiTopToolbarProps({ table })
      : muiTopToolbarProps;

  const groupedBy =
    grouping.length > 0 ? (
      <>
        {grouping.map((columnId, index) => (
          <Fragment key={`${index}-${columnId}-group`}>
            <Chip
              icon={<GroupIcon htmlColor={IconsColor.default} />}
              variant="outlined"
              style={{ backgroundColor: '#F5F6FA', height: '28px' }}
              label={table.getColumn(columnId).columnDef.header}
              // onDelete={() => table.getColumn(columnId).toggleGrouping()}
              {...chipProps}
            />
          </Fragment>
        ))}
      </>
    ) : null;

  const sortedBy =
    sorting.length > 0 ? (
      <>
        {sorting.map((columnSort, index) => (
          <Fragment key={`${index}-${columnSort.id}-sort`}>
            <Chip
              icon={columnSort.desc ? <SortedDescIcon htmlColor={IconsColor.default} /> : <SortedAscIcon htmlColor={IconsColor.default} />}
              variant="outlined"
              style={{ backgroundColor: '#F5F6FA', height: '28px' }}
              label={table.getColumn(columnSort.id).columnDef.header}
              // onDelete={() => table.getColumn(columnId).toggleGrouping()}
              {...chipProps}
            />
          </Fragment>
        ))}
      </>
    ) : null;
  return (
    <>
      <Box sx={{ height: 54 }} display="flex" justifyContent="flex-end">
        {<TableToolbar table={table} />}
      </Box>
      <Toolbar
        variant="dense"
        {...toolbarProps}
        ref={(ref: HTMLDivElement) => {
          topToolbarRef.current = ref;
          if (toolbarProps?.ref) {
            // @ts-ignore
            toolbarProps.ref.current = ref;
          }
        }}
        sx={(theme) =>
        ({
          position: isFullScreen ? 'sticky' : undefined,
          height: 48,
          borderTop: 1,
          borderBottom: 1,
          borderColor: '#E1E3EB',
          verticalAlign: 'middle',
          top: isFullScreen ? '0' : undefined,
          ...commonToolbarStyles({ theme }),
          ...(toolbarProps?.sx instanceof Function
            ? toolbarProps.sx(theme)
            : (toolbarProps?.sx as any)),
        } as any)
        }
      >
        <Box
          sx={{
            alignItems: 'flex-start',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'space-between',
            p: '0.5rem',
            position: 'relative',
            right: 0,
            top: 5,
            width: '100%',
          }}
        >
          <Stack direction="row" spacing={1}>
            {groupedBy}
            {sortedBy}
          </Stack>
          {/* {renderTopToolbarCustomActions?.({ table }) ?? <span />} */}
        </Box>
      </Toolbar>
    </>
  );
};
