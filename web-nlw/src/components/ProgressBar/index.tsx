interface ProgressBarProps{
	progress: number
}

export default function ProgressBar({ progress }: ProgressBarProps){

	return(
		<div className="h-2 rounded-xl bgzin w-full mt-4">
			<div role="progressbar" aria-label="Progresso de hábitos completados nesse dia"
				aria-valuenow={progress} className="h-3 rounded-xl bg-violet-600" style={{width: `${progress}%`}}/>
		</div>
	);
}
