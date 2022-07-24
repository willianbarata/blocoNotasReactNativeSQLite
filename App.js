import { FlatList,SafeAreaView, StatusBar, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NotaEditor from "./src/componentes/NotaEditor"
import { useEffect, useState } from "react"
import { Nota, Filtro } from './src/componentes/Nota'
import { Picker } from "@react-native-picker/picker"

import { buscaNotas, criaTabela, filtraCategoria } from "./src/services/Notas"
export default function App() {

  useEffect(()=> {
    criaTabela()
    mostraNotas()
  },[])

  const [notaSelecionada, setNotaSelecionada] = useState({})
  const [notas, setNotas] = useState([])
  const [categoria, setCategoria] = useState("Todos")

  async function mostraNotas(){
    console.log("MostraNotas")
    const todasNotas = await buscaNotas()
    setNotas(todasNotas)
    console.log(todasNotas)

    /* utilização do AsyncStorage
    const todasChaves = await AsyncStorage.getAllKeys()
    const todasNotas = await AsyncStorage.multiGet(todasChaves)
    setNotas(todasNotas)
    console.log(todasNotas)
    */
  }

  async function filtraLista(categSelect){
    setCategoria(categSelect)
    console.log(categSelect)
    if(categSelect == "Todos"){
      mostraNotas()
    }else{
      setNotas(await filtraCategoria(categSelect)) 
    }
  }

  return (
    <SafeAreaView style={estilos.container}>
      
      <Picker
            selectedValue={categoria}
            onValueChange={(categSelect) => filtraLista(categSelect)}>
          <Picker.Item label="Todos" value="Todos" />
          <Picker.Item label="Pessoal" value="Pessoal" />
          <Picker.Item label="Trabalho" value="Trabalho" />
          <Picker.Item label="Outros" value="Outros" />

       </Picker>
      <FlatList
        data={notas}
        renderItem={(nota) => <Nota {...nota}  setNotaSelecionada={setNotaSelecionada}/> }
        keyExtractor={nota => nota.id} />
      <NotaEditor mostraNotas={mostraNotas} notaSelecionada={notaSelecionada} setNotaSelecionada={setNotaSelecionada}/>
      <StatusBar/>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "stretch",
		justifyContent: "flex-start",
	},
})

