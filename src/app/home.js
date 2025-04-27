import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles/HomeStyles.js'

export default function Home() {
    const [matches, setMatches] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const BASE_URL = 'http://10.250.7.6:8000';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');
                if (!token) {
                    router.replace('/');
                    return;
                }

                const [userResponse, matchesResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/user`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${BASE_URL}/fixtures/upcoming`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);

                setUser(userResponse.data);
                setMatches(matchesResponse.data?.upcoming || []);
                setLoading(false);
            } catch (error) {
                if (error.response?.status === 401) {
                    await AsyncStorage.removeItem('jwtToken');
                    router.replace('/');
                } else {
                    setError(error.response?.data?.message || error.message);
                }
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getDisplayDate = () => {
        if (matches.length === 0) return '';
        const firstMatchDate = matches[0].match_date;
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return new Date(firstMatchDate).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#8B0000" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.welcomeText}>
                    Welcome {user ? user.username : 'Fan'}!
                </Text>
            </View>

            {/* Matchday Section */}
            <View style={styles.matchdayContainer}>
                <Text style={styles.matchdayHeader}>Matchday Live</Text>
                <Text style={styles.matchdayDate}>{getDisplayDate()}</Text>

                {/* Matches List */}
                <ScrollView style={styles.matchesScroll}>
                    {matches.length === 0 ? (
                        <Text style={styles.noMatchesText}>No upcoming matches found</Text>
                    ) : (
                        matches.map((match) => (
                            <View key={match.id} style={styles.matchCard}>
                                <View style={styles.teamVsTimeContainer}>
                                    <Text style={styles.teamName}>{match.home_team_name}</Text>
                                    <Text style={styles.matchTimeBetweenTeams}>
                                        {new Date(match.match_date).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false
                                        })}
                                    </Text>
                                    <Text style={styles.teamName}>{match.away_team_name}</Text>
                                </View>
                                
                                <View style={styles.stadiumContainer}>
                                    <Text style={styles.stadiumText}>{match.venue}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* View All Fixtures */}
                <TouchableOpacity 
                    style={styles.viewAllButton}
                    onPress={() => router.push('/fixtures')}
                >
                    <Text style={styles.viewAllText}>View All Fixtures</Text>
                </TouchableOpacity>
            </View>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.push('/latest')}>
                    <Text style={styles.footerLinkText}>Latest</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/table')}>
                    <Text style={styles.footerLinkText}>Table</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/stats')}>
                    <Text style={styles.footerLinkText}>Stats</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/news')}>
                    <Text style={styles.footerLinkText}>News</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
