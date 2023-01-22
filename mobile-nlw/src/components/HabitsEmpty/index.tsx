import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export default function HabitsEmpty(){

	const {navigate} = useNavigation();

	return(
		<Text className="text-zinc-500 text-base ml-3">
			Nenhum hábito registrado para esse dia! {" "}
			<Text className="text-violet-400 text-base underline active:text-violet-500" onPress={() => navigate("new")}>
				Cadastre um novo clicando aqui.
			</Text>
		</Text>
	);
}
