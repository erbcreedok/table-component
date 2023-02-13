import React from 'react';
import { Meta, Story } from '@storybook/react';
import MaterialReactTable, {
  MaterialReactTableProps,
} from 'material-react-table';

import { Initiative } from './types/Initiative'
import { generateInitiatives } from './utils/generateInitiatives'
import { getInitiativeTableColumns } from './utils/getInititativeTableColumns'

const meta: Meta = {
  title: 'Prop Playground',
  component: MaterialReactTable,
};

export default meta;

const Template: Story<MaterialReactTableProps<Initiative>> = (
  args: MaterialReactTableProps<Initiative>,
) => <MaterialReactTable {...args} />;

export const Default = Template.bind({});

Default.args = {
  columns: getInitiativeTableColumns(),
  data: generateInitiatives(60),
} as MaterialReactTableProps<Initiative>;
