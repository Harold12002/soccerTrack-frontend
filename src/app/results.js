import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles/ResultsStyles.js'; 

export default function Results() {
    const [matches, setMatches] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleMatches, setVisibleMatches] = useState(10);
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
                    axios.get(`${BASE_URL}/all-results`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);

                setUser(userResponse.data);
                setMatches(matchesResponse.data?.results || []);
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
        setVisibleMatches((prev) => prev + 10);
    };

    const handleMatchPress = (match) => {
        router.push({
            pathname: '/match-details',
            params: { match: JSON.stringify(match) }
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#8B0000" />
                <Text style={styles.loadingText}>Loading results...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => router.replace('/results')}
                >
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with League Title */}
            <View style={styles.header}>
                <Text style={styles.leagueTitle}>Castle Lager Premier Soccer League</Text>
                <Text style={styles.seasonTitle}>2024/25 Season Results</Text>
            </View>

            {/* Results Section */}
            <View style={styles.resultsContainer}>
                <ScrollView 
                    style={styles.matchesScroll}
                    showsVerticalScrollIndicator={false}
                >
                    {matches.length === 0 ? (
                        <View style={styles.noMatchesContainer}>
                            <Text style={styles.noMatchesText}>No results available</Text>
                            <Text style={styles.noMatchesSubText}>Check back later for updated results</Text>
                        </View>
                    ) : (
                        <>
                            {matches.slice(0, visibleMatches).map((match) => {
                                const matchDate = new Date(match.match_date);
                                const fullDate = matchDate.toLocaleDateString([], {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                });
                                const time = matchDate.toLocaleTimeString([], {
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                });

                                return (
                                    <TouchableOpacity 
                                        key={match.id} 
                                        style={styles.matchCard}
                                        onPress={() => handleMatchPress(match)}
                                        activeOpacity={0.8}
                                    >
                                        {/* Match Date */}
                                        <View style={styles.dateContainer}>
                                            <Text style={styles.dateText}>{fullDate}</Text>
                                            <Text style={styles.timeText}>{time}</Text>
                                        </View>

                                        {/* Teams and Score */}
                                        <View style={styles.teamsContainer}>
                                            <View style={styles.teamContainer}>
                                                <Text style={styles.teamName} numberOfLines={1}>
                                                    {match.home_team_name}
                                                </Text>
                                                <Text style={styles.teamScore}>{match.home_goals}</Text>
                                            </View>
                                            
                                            <Text style={styles.vsText}>vs</Text>
                                            
                                            <View style={styles.teamContainer}>
                                                <Text style={styles.teamScore}>{match.away_goals}</Text>
                                                <Text style={styles.teamName} numberOfLines={1}>
                                                    {match.away_team_name}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Match Events Preview */}
                                        {match.events && (
                                            <View style={styles.matchEvents}>
                                                <Text style={styles.eventsTitle}>Match Events:</Text>
                                                {match.events.split('|').slice(0, 2).map((event, index) => (
                                                    <Text key={index} style={styles.eventText}>
                                                        • {event.trim()}
                                                    </Text>
                                                ))}
                                                {match.events.split('|').length > 2 && (
                                                    <Text style={styles.moreEventsText}>+ {match.events.split('|').length - 2} more events</Text>
                                                )}
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}

                            {/* Show More Button */}
                            {visibleMatches < matches.length && (
                                <TouchableOpacity 
                                    onPress={handleShowMore} 
                                    style={styles.showMoreButton}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.showMoreText}>Load More Results</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </ScrollView>
            </View>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                {['Home', 'Table', 'Stats', 'News'].map((item) => (
                    <TouchableOpacity 
                        key={item}
                        onPress={() => router.push(`/${item.toLowerCase()}`)}
                        style={styles.footerItem}
                    >
                        <Text style={styles.footerLinkText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}