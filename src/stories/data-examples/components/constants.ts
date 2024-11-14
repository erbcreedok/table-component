import {
	getExpandingTeamMembers,
	getTeamMembers,
} from '../../utils/getTeamMembers'

export const CUSTOM_FIRST_ROW_MEMBERS = {
	none: [],
	'only team member': getTeamMembers(1, '0'),
	'team member with only child': getExpandingTeamMembers(1, '0', 1, 1),
}
export const CUSTOM_FIRST_ROW_MEMBERS_CONFIG = {
  control: { type: 'select' },
  defaultValue: 'none',
  description: '*** NOT A PROP *** defines custom first row for Teams Table Subtree',
  options: Object.keys(CUSTOM_FIRST_ROW_MEMBERS),
  mapping: CUSTOM_FIRST_ROW_MEMBERS,
}
