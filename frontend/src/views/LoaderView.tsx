function LoaderView(props: { additionalClasses?: string, additionalSpinnerClasses?: string } | undefined) {
	return (
		<div className={`${'spinner spinner-large h-4 w-4 scale-[0.55]'} ${props?.additionalClasses ?? ""}`} >
			<div className="spinner-container">
                <div className={`spinner-nib spinner-nib-1 ${props?.additionalSpinnerClasses ?? ""}`}></div>
                <div className={`spinner-nib spinner-nib-2 ${props?.additionalSpinnerClasses ?? ""}`}></div>
                <div className={`spinner-nib spinner-nib-3 ${props?.additionalSpinnerClasses ?? ""}`}></div>
                <div className={`spinner-nib spinner-nib-4 ${props?.additionalSpinnerClasses ?? ""}`}></div>
                <div className={`spinner-nib spinner-nib-5 ${props?.additionalSpinnerClasses ?? ""}`}></div>
                <div className={`spinner-nib spinner-nib-6 ${props?.additionalSpinnerClasses ?? ""}`}></div>
                <div className={`spinner-nib spinner-nib-7 ${props?.additionalSpinnerClasses ?? ""}`}></div>
                <div className={`spinner-nib spinner-nib-8 ${props?.additionalSpinnerClasses ?? ""}`}></div>
			</div>
		</div>
	)
}

export default LoaderView
