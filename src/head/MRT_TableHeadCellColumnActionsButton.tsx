import React, { FC, MouseEvent, MouseEventHandler, ReactNode, useMemo, useState } from 'react'
import { MRT_ColumnActionMenu } from '../menus/MRT_ColumnActionMenu';
import type { MRT_Header, MRT_TableInstance } from '..';

type Props = {
  header: MRT_Header;
  table: MRT_TableInstance;
  disabled?: boolean
  children(props: {
    onClick: MouseEventHandler
  }): ReactNode
}

export const MRT_TableHeadCellColumnActionsButton: FC<Props> = ({
  header,
  table,
  children,
  disabled,
}) => {
  const {
    options: {
      localization,
    },
  } = table;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) return
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const props = useMemo(() => ({
    onClick: handleClick,
    'aria-label': localization.columnActions
  }), [])

  return (
    <>
      { children(props) }
      {anchorEl && (
        <MRT_ColumnActionMenu
          anchorEl={anchorEl}
          header={header}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      )}
    </>
  );
};
