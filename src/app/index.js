import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Picker } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function StartUp() {
  const router = useRouter();

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupTeam, setSignupTeam] = useState(''); // 
  const [signupPassword, setSignupPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  const handleLoginSubmit = async () => {
    if (!loginUsername || !loginPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    try {
      const res = await axios.post('/login', {
        username: loginUsername,
        password: loginPassword,
      });
      const { token } = res.data;
      Alert.alert('Success', 'Login successful!');
      setTimeout(() => {
        router.replace('/home');
      }, 800);
    } catch (err) {
      Alert.alert('Error', 'Invalid Credentials');
    }
  };

  const handleSignupSubmit = async () => {
    if (!signupUsername || !signupEmail || !signupTeam || !signupPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    try {
      const res = await axios.post('/register', {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
        team: signupTeam,
      });
      const { token } = res.data;
      Alert.alert('Success', 'Signup successful!');
      setTimeout(() => {
        router.replace('/home');
      }, 800);
    } catch (err) {
      Alert.alert('Error', 'Signup failed. Try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'login' && styles.activeTab]}
            onPress={() => setActiveTab('login')}
          >
            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'signup' && styles.activeTab]}
            onPress={() => setActiveTab('signup')}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Login Form */}
        {activeTab === 'login' && (
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Welcome Back</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              value={loginUsername}
              onChangeText={setLoginUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLoginSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Create Account</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              value={signupUsername}
              onChangeText={setSignupUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={signupEmail}
              onChangeText={setSignupEmail}
              keyboardType="email-address"
            />
      
              <TextInput
              style={styles.input}
              placeholder='Team'
              placeholderTextColor={'#999'}
                value={signupTeam}
                onChange={setSignupTeam}
                keyboardType='team'
                />
         
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={signupPassword}
              onChangeText={setSignupPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignupSubmit}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#d32f2f',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  pickerContainer: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
  },
  button: {
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});