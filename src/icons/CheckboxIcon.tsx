import { IconGeneral, IconGeneralProps } from './IconGeneral'

export const CheckboxIcon = (props: IconGeneralProps) => {
	return (
		<IconGeneral viewBox="0 0 18 18" size={18} {...props}>
			<rect
				x="0.5"
				y="0.5"
				width="17"
				height="17"
				rx="2.5"
				stroke="currentColor"
			/>
			<rect x="0.5" y="0.5" width="17" height="17" rx="2.5" fill="white" />
		</IconGeneral>
	)
}
