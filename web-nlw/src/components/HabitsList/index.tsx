import * as  Checkbox  from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import api from "../../api/api";

interface HabitsListProps{
	date: Date;
	onCompletedChanged: (completed: number) => void;
}

interface HabitsInfo{
	possibleHabits: Array<{
		id: string;
		title: string;
		createt_At: string;
	}>,
	completedHabits: string[],
}

export default function HabitsList({ date, onCompletedChanged }: HabitsListProps){

	const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

	useEffect(() => {
		api.get("/day", {
			params: {
				date: date.toISOString(),
			}
		}).then(response => {
			setHabitsInfo(response.data);
		}).catch(error => {
			console.log(error);
		});
	}, []);

	async function handleToggleHabbit(habitId: string){
		const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);

		await api.patch(`/habits/${habitId}/toggle`);

		let completedHabits: string[] = [];

		if(isHabitAlreadyCompleted){
			completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId);
		}else{
			completedHabits = [...habitsInfo!.completedHabits, habitId];
		}

		setHabitsInfo({
			possibleHabits: habitsInfo!.possibleHabits,
			completedHabits,
		});

		onCompletedChanged(completedHabits.length);
	}

	const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

	return(
		<div className="mt-6 flex flex-col gap-3">
			{habitsInfo?.possibleHabits.length === 0 ?
				<span className="text-white font-semibold text-xl leading-tight">Nenhum hábito registrado nesse dia</span>
				:
				habitsInfo?.possibleHabits.map(habit => {
					return(
						<Checkbox.Root className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed" key={habit.id} checked={habitsInfo.completedHabits.includes(habit.id)} disabled={isDateInPast} onCheckedChange={() => handleToggleHabbit(habit.id)}>
							<div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-violet-500 group-data-[state=checked]:border-violet-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
								<Checkbox.Indicator>
									<Check size={20} className="text-white"/>
								</Checkbox.Indicator>
							</div>
							<span className="text-white font-semibold text-xl leading-tight
							group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-500">{habit.title}</span>
						</Checkbox.Root>
					);
				})
			}

		</div>
	);
}