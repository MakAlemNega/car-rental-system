import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import axios from "axios";

export const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState("");

  const handleRequestOtp = async () => {
    try {
      // Change 'localhost' to '10.0.2.2' if on Android Emulator
      await axios.post("http://10.0.2.2:3001/auth/request-otp", {
        phoneNumber: phone,
      });
      navigation.navigate("Verify", { phone });
    } catch (error) {
      console.error("Login Error", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Car Rental Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone (+251...)"
        onChangeText={setPhone}
      />
      <Button title="Get OTP" onPress={handleRequestOtp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
});
