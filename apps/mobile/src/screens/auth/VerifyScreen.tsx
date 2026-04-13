import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// 1. Define the shape of your Backend response
interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    role: string;
  };
  message: string;
}

export const VerifyScreen = ({ route }: any) => {
  const { phone } = route.params;
  const [otp, setOtp] = useState("");
  const { setToken, setUser } = useAuth();

  const handleVerify = async () => {
    try {
      // 2. Pass the <AuthResponse> interface to the axios post call
      const response = await axios.post<AuthResponse>(
        "http://10.0.2.2:3001/auth/verify-otp",
        {
          phoneNumber: phone,
          otp: otp,
        },
      );

      // Now response.data.access_token is recognized!
      setToken(response.data.access_token);
      setUser(response.data.user);

      Alert.alert("Success", "You are logged in.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Invalid OTP or connection issue.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit Code"
        keyboardType="numeric"
        onChangeText={setOtp}
        value={otp} // Good practice to make it a controlled component
      />
      <Button title="Verify & Login" onPress={handleVerify} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlign: "center",
    fontSize: 20,
  },
});
