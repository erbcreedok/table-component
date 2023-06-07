import { IconGeneral, IconGeneralProps } from './IconGeneral'

export const CheckboxCheckedIcon = (props: IconGeneralProps) => {
	return (
		<IconGeneral viewBox="0 0 18 18" size={18} {...props}>
			<rect width="18" height="18" rx="3" fill="currentColor" />
			<path d="M4 9L8 13L15 5" stroke="white" strokeWidth="2" />
		</IconGeneral>
	)
}
