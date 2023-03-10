import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView, Alert } from "react-native";
import HabitDay, { DAY_SIZE } from "../../components/HabitDay";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

import api from "../../api/api";
import { generateDatesFromYeaerBeginning } from "../../utils/generate-dates-from-year-beginning";
import dayjs from "dayjs";

const weekDays = [ "D", "S", "T", "Q", "Q", "S", "S"];
const dateFromYearStart = generateDatesFromYeaerBeginning();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - dateFromYearStart.length;

type SummaryProps = Array<{
	id: string;
	date: Date;
	amount: number;
	completed: number;
}>

export default function Home(){

	const [loading, setLoading] = useState(true);
	const [summary, setSummary] = useState<SummaryProps | null>(null);
	const { navigate } = useNavigation();

	async function getData(){
		try{
			setLoading(true);
			const response = await api.get("/summary");
			setSummary(response.data);
		}catch(error){
			Alert.alert("Ops", "Não foi possível carregar seus hábitos.");
			console.log(error);
		} finally{
			setLoading(false);
		}
	}

	useFocusEffect (useCallback(() => {
		getData();
	}, []));

	if(loading){
		return(
			<Loading/>
		);
	}

	return(
		<View className="flex-1 bg-background px-8 pt-16">
			<Header/>
			<View className="flex-row mt-6 mb-2">
				{weekDays.map((weekDay, i) => (
					<Text key={`${weekDay}-${i}`} className="text-zinc-400 text-xl font-bold text-center mx-1" style={{width: DAY_SIZE}}>
						{weekDay}
					</Text>
				))}
			</View>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
				{ summary &&
				<View className="flex-row flex-wrap">
					{
						dateFromYearStart.map(date => {

							const dayWithHabits = summary.find(day => {
								return dayjs(date).isSame(day.date, "day");
							});

							return(
								<HabitDay key={date.toISOString()}
									onPress={() => navigate("habit", {date: date.toISOString()})}
									date={date} amountOfHabits={dayWithHabits?.amount} amountCompleted={dayWithHabits?.completed}/>
							);
						})
					}

					{
						amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill}).map((_, index) => (
							<View key={index} className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
								style={{width: DAY_SIZE, height: DAY_SIZE}}/>
						))
					}
				</View>
				}
			</ScrollView>
		</View>
	);
}
