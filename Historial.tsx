import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const datosHistorial = [
  { id: "1", fecha: "12 de abril de 2025", cantidad: "350 L" },
  { id: "2", fecha: "10 de abril de 2025", cantidad: "420 L" },
  { id: "3", fecha: "7 de abril de 2025", cantidad: "280 L" },
  { id: "4", fecha: "4 de abril de 2025", cantidad: "310 L" },
  { id: "5", fecha: "1 de abril de 2025", cantidad: "390 L" },
];

export default function Historial() {
  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Ionicons name="rainy-outline" size={24} color="#00796b" />
      <View style={styles.itemContent}>
        <Text style={styles.fecha}>{item.fecha}</Text>
        <Text style={styles.cantidad}>{item.cantidad} captados</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de captaciones</Text>

      <FlatList
        data={datosHistorial}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f7fa",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 16,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    marginLeft: 12,
  },
  fecha: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#004d40",
  },
  cantidad: {
    fontSize: 14,
    color: "#00796b",
    marginTop: 4,
  },
});
