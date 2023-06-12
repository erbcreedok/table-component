import { IconGeneral, IconGeneralProps } from './IconGeneral'

export const CheckboxIcon = (props: IconGeneralProps) => {
	return (
		// icon is cropped at right and bottom borders, so we need to add 0.5 to width and height
		<IconGeneral viewBox="0 0 18.5 18.5" size={18} {...props}>
			<rect
				x="0.5"
				y="0.5"
				width="17"
				height="17"
				rx="2.5"
				strokeWidth="0.5"
				stroke="currentColor"
				fill="white"
			/>
		</IconGeneral>
	)
}
