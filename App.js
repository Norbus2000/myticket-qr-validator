import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const isValid = (ticket) => {
    async function makeRequest() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/bticket/qrcode/" + ticket
        );

        console.log("status code: ", response.status); // 👉️ 200

        if (!response.ok) {
          console.log(response);
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (err) {
        console.log(err);
      }
    }

    makeRequest();
  };

  const handleBarCodeScanned = ({ data }) => {
    console.log("====================================");
    console.log(isValid(data));
    console.log("====================================");
    if (isValid(data) == 200) {
      alert("ok");
    } else {
      alert("nem ok");
    }
  };

  if (hasPermission === null) {
    return <Text>Kerem adjon hozzaferest a kamerahoz</Text>;
  }
  if (hasPermission === false) {
    return <Text>Kerem adjon hozzaferest a kamerahoz</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
