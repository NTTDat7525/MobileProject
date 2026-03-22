import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import Input from "@/components/ui/Input"
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import Button from "@/components/ui/Button";
import Axios from "axios";
import { useState } from "react";
import { useRouter } from "expo-router";

const API_BASE_URL = 'http://192.168.1.9:5001/api';

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateInput = () => {
    // Kiểm tra các trường bắt buộc
    if (!username.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập');
      return false;
    }

    if (username.trim().length < 3) {
      Alert.alert('Lỗi', 'Tên đăng nhập phải có ít nhất 3 ký tự');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return false;
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }

    if (!firstName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên');
      return false;
    }

    if (!lastName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (!confirmPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng xác nhận mật khẩu');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    try {
      const res = await Axios.post(`${API_BASE_URL}/auth/signup`, {
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password: password,
      });

      Alert.alert(
        'Thành công',
        'Tài khoản đã được tạo!\nVui lòng đăng nhập để tiếp tục',
        [
          {
            text: 'OK',
            onPress: () => {
              // Xóa form
              setUsername('');
              setEmail('');
              setFirstName('');
              setLastName('');
              setPassword('');
              setConfirmPassword('');
              // Điều hướng tới signin
              router.replace('/screens/Signin');
            }
          }
        ]
      );
    } catch (err) {
      console.log('Sign up error:', err);
      
      let errorMessage = 'Lỗi server. Vui lòng thử lại.';

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Vui lòng kiểm tra thông tin đầu vào';
        } else if (err.response.status === 409) {
          errorMessage = 'Tên đăng nhập hoặc email đã tồn tại';
        } else if (err.response.status === 500) {
          errorMessage = 'Lỗi server. Vui lòng thử lại sau';
        }
      } else if (err.request) {
        errorMessage = 'Không thể kết nối đến server. Kiểm tra kết nối mạng.';
      }

      Alert.alert('Lỗi đăng ký', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View>
        <Input
          label="Username"
          placeholder="Enter your username"
          iconName="user"
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          iconName="envelope"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <Input
          label="First Name"
          placeholder="Enter your first name"
          iconName="id-card"
          value={firstName}
          onChangeText={setFirstName}
          editable={!loading}
        />

        <Input
          label="Last Name"
          placeholder="Enter your last name"
          iconName="id-card"
          value={lastName}
          onChangeText={setLastName}
          editable={!loading}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          iconName="lock"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          iconName="lock"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />

        <Button
          title={loading ? "Creating account..." : "Create Account"}
          onPress={onSubmit}
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          disabled={loading}
        />

        {loading && (
          <ActivityIndicator 
            size="small" 
            color="#FFA26B" 
            style={styles.loader}
          />
        )}

        <Text style={styles.orText}>or continue with</Text>

        <GoogleSignInButton />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#FFA26B",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loader: {
    marginTop: 8,
  },
  orText: {
    textAlign: "center",
    color: "#bbb",
    marginVertical: 20,
    fontSize: 13,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});