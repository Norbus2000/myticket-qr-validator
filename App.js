import { Modal, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Button, ListItem, Icon } from "@rneui/base";
export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [open, setOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [valid, setValid] = useState(false);

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
        if (!response.ok) {
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
    isValid(data);
    setEventDetails(data);
    setScanned(true);
    setOpen(true);
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
          onBarCodeScanned={scanned ? false : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <Modal
        transparent
        visible={open}
        onRequestClose={() => {
          setOpen(false);
          setScanned(false);
        }}
      >
        {scanned && (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.view}>
                <Button
                  type="clear"
                  icon={<Icon name="close" type="material" color="red" />}
                  onPress={() => {
                    setOpen(false);
                    setScanned(false);
                  }}
                />
                <View >
                  <ListItem>
                    <ListItem.Content>
                      <ListItem.Title>asd</ListItem.Title>
                      <ListItem.Title>asd</ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                </View>
              </View>
            </View>
          </View>
        )}
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: 5,
    margin: 5,
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    padding: 10,
  },
  listTitle: {
    paddingTop: 3,
  },
  view: { justifyContent: "center", padding: 5, margin: 5 },
  icon: { padding: 10 },
  button: {
    marginTop: 10,
  },
});
