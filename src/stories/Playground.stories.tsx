import React from 'react';
import { Meta, Story } from '@storybook/react';
import TableComponent, {
  TableComponentProps,
  DEFAULT_PRESETS
} from '../';

import { Initiative } from './types/Initiative'
import { generateInitiatives } from './utils/generateInitiatives'
import { getInitiativeTableColumns } from './utils/getInititativeTableColumns'

const meta: Meta = {
  title: 'Prop Playground',
  component: TableComponent,
  args: {
    onGetDefaultPresets: () => DEFAULT_PRESETS,
  },
};

export default meta;

const Template: Story<TableComponentProps<Initiative>> = (
  args: TableComponentProps<Initiative>,
) => <TableComponent {...args} />;

export const Default = Template.bind({});

Default.args = {
  columns: getInitiativeTableColumns(),
  data: generateInitiatives(60),
} as TableComponentProps<Initiative>;
