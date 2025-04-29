import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles/FixtureStyles.js';

export default function Home() {
    const [matches, setMatches] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleMatches, setVisibleMatches] = useState(9);
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
                    axios.get(`${BASE_URL}/all-fixtures`, {
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

    const handleShowMore = () => {
        setVisibleMatches((prev) => prev + 9);
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
           
        {/* League Title */}
        <Text style={styles.leagueTitle}>Castle Lager Premier Soccer League</Text>
        
            {/* Matchday Section */}
            <View style={styles.matchdayContainer}>
                <Text style={styles.matchdayHeader}>2024/25 Fixture Schedule</Text>

                {/* Matches List */}
                <ScrollView style={styles.matchesScroll}>
                    {matches.length === 0 ? (
                        <Text style={styles.noMatchesText}>No upcoming matches found</Text>
                    ) : (
                        <>
                            {matches.slice(0, visibleMatches).map((match) => {
                                const matchDate = new Date(match.match_date);
                                const matchTime = matchDate.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false
                                });
                                const fullDate = matchDate.toLocaleDateString([], {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                });

                                return (
                                    <View key={match.id} style={styles.matchCard}>
                                        <View style={styles.teamVsTimeContainer}>
                                            <Text style={styles.teamName}>{match.home_team_name}</Text>
                                            <Text style={styles.matchTimeBetweenTeams}>{matchTime}</Text>
                                            <Text style={styles.teamName}>{match.away_team_name}</Text>
                                        </View>

                                        <View style={styles.stadiumContainer}>
                                            <Text style={styles.stadiumText}>
                                                {match.venue} | {fullDate}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}

                            {/* Show More button */}
                            {visibleMatches < matches.length && (
                                <TouchableOpacity onPress={handleShowMore} style={styles.showMoreButton}>
                                    <Text style={styles.showMoreText}>Show More</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </ScrollView>
            </View>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.push('/home')}>
                    <Text style={styles.footerLinkText}>Home</Text>
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
