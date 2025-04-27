import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { styles } from './styles/StartUpStyles.js';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function StartUp() {
  const router = useRouter();

  const BASE_URL = 'http://10.250.7.6:8000';

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupTeam, setSignupTeam] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');



const handleLoginSubmit = async () => {
  if (!loginUsername || !loginPassword) {
    Alert.alert('Error', 'All fields are required.');
    return;
  }
  try {
    const res = await axios.post(`${BASE_URL}/login`, {
      username: loginUsername,
      password: loginPassword,
    });
    
    const { token } = res.data;
    
    // Store the token securely
    await AsyncStorage.setItem('jwtToken', token);
    
    Alert.alert('Success', 'Login successful!');
    
    // Immediate navigation without setTimeout
    router.replace('/home');
    
  } catch (err) {
    console.error('Login error:', err);
    Alert.alert('Error', err.response?.data?.message || 'Invalid Credentials');
  }
};
  const handleSignupSubmit = async () => {
    if (!signupUsername || !signupEmail || !signupTeam || !signupPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/register`, {
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
        {/* League Title */}
        <Text style={styles.leagueTitle}>Castle Lager Premier Soccer League</Text>
        
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
              placeholder="Team"
              placeholderTextColor="#999"
              value={signupTeam}
              onChangeText={setSignupTeam}
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