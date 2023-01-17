interface HabitProps{
    completed: number;

}

export default function Habit({ completed }: HabitProps){
	return(
		<div className="bg-black w-10 h-10 text-cyan-800">{completed}</div>
	);
}
