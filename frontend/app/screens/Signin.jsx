import { View, StyleSheet, StatusBar, Text, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import SigninForm from "@/components/SigninForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.9:5001/api';

export default function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        // Jika sudah login, cek role dan redirect
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          const userRole = user.role || 'user';
          if (userRole === 'admin' || userRole === 'Admin') {
            router.replace('/admin');
          } else {
            router.replace('/user');
          }
        }
      }
    } catch (error) {
      console.log('Error checking login status:', error);
    }
  };

  const validateInput = () => {
    if (!username.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
      return false;
    }
    return true;
  };

  const onsubmit = async () => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    try {
      const res = await Axios.post(`${API_BASE_URL}/auth/signin`, {
        username: username.trim().toLowerCase(),
        password,
      });

      if (res.data && res.data.accessToken) {
        await AsyncStorage.setItem('accessToken', res.data.accessToken);
        
        if (res.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
          
          // Redirect dựa vào role
          const userRole = res.data.user.role || 'user';
          if (userRole === 'admin' || userRole === 'Admin') {
            router.replace('/admin');
          } else {
            router.replace('/user');
          }
        }

        Alert.alert('Thành công', `Chào mừng ${res.data.user?.displayName || 'bạn'}!`);
        
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      console.log('Login error:', err);
      
      let errorMessage = 'Lỗi server. Vui lòng thử lại.';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Tên đăng nhập hoặc mật khẩu không chính xác';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Vui lòng kiểm tra thông tin đăng nhập';
        } else if (err.response.status === 500) {
          errorMessage = 'Lỗi server. Vui lòng thử lại sau';
        }
      } else if (err.request) {
        // Gửi request nhưng không nhận được phản hồi
        errorMessage = 'Không thể kết nối đến server. Kiểm tra kết nối mạng.';
      }
      
      Alert.alert('Lỗi đăng nhập', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS==="ios"?"padding":"height"} style={{flex:1}}>
      <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue booking</Text>
      </View>
      <SigninForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onSubmit={onsubmit}
        loading={loading}
      />

      <Text style={styles.bottomText}>Don't have an account?{" "}
                  <Text style = {styles.linkText} onPress={() => router.push("/screens/Signup")}>Sign Up.</Text>
            </Text>

    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 6,
    marginBottom: 30,
  },

    bottomText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
    color: "#666",
  },
  linkText: {
    color: "#FFA26B",
    fontWeight: "600",
  },
});
