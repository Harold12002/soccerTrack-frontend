import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
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
                    axios.get(`${BASE_URL}/results-with-stats`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);

                setUser(userResponse.data);
                
                // Safely process matches data
                const processedMatches = (matchesResponse.data?.results || []).map(match => ({
                    ...match,
                    statistics: Array.isArray(match.statistics) ? match.statistics : [],
                    home_team_name: match.home_team_name || 'Unknown Team',
                    away_team_name: match.away_team_name || 'Unknown Team',
                    home_goals: match.home_goals ?? 0,
                    away_goals: match.away_goals ?? 0,
                    match_date: match.match_date || new Date().toISOString()
                }));
                
                setMatches(processedMatches);
                setLoading(false);
            } catch (error) {
                console.error('Fetch error:', error);
                if (error.response?.status === 401) {
                    await AsyncStorage.removeItem('jwtToken');
                    router.replace('/');
                } else {
                    setError(error.response?.data?.message || error.message || 'Failed to load data');
                }
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderEventIcon = (eventType) => {
        switch(eventType) {
            case 'goal': return <MaterialIcons name="sports-soccer" size={16} color="green" />;
            case 'yellow_card': return <MaterialIcons name="warning" size={16} color="yellow" />;
            case 'red_card': return <MaterialIcons name="warning" size={16} color="red" />;
            case 'substitution': return <MaterialIcons name="swap-horiz" size={16} color="blue" />;
            case 'assist': return <MaterialIcons name="play-circle-outline" size={16} color="orange" />;
            default: return <MaterialIcons name="event" size={16} color="gray" />;
        }
    };

    const handleShowMore = () => {
        setVisibleMatches(prev => Math.min(prev + 10, matches.length));
    };

    const handleMatchPress = (match) => {
        try {
            // Create a safe match data object
            const matchData = {
                id: match.id,
                home_team_name: match.home_team_name,
                away_team_name: match.away_team_name,
                home_goals: match.home_goals,
                away_goals: match.away_goals,
                match_date: match.match_date,
                statistics: match.statistics.map(stat => ({
                    ...stat,
                    player_name: stat.player_name || 'Unknown Player',
                    minute: stat.minute || 0
                }))
            };

            router.push({
                pathname: '/match-details',
                params: { 
                    matchId: String(match.id),
                    matchData: JSON.stringify(matchData)
                }
            });
        } catch (err) {
            console.error('Navigation error:', err);
            alert('Failed to load match details');
        }
    };

    const formatMatchEvents = (stats) => {
        if (!Array.isArray(stats)) return [];
        
        return stats.map(stat => {
            const minute = stat.minute ? `${stat.minute}'` : '';
            const player = stat.player_name || 'Unknown Player';
            
            switch(stat.event_type) {
                case 'goal':
                    return {
                        ...stat,
                        displayText: `${player} ${minute}` + 
                            (stat.assisted_by_name ? ` (assist: ${stat.assisted_by_name})` : '')
                    };
                case 'assist':
                    return { ...stat, displayText: `Assist by ${player}` };
                case 'yellow_card':
                    return { ...stat, displayText: `Yellow card: ${player} ${minute}` };
                case 'red_card':
                    return { ...stat, displayText: `Red card: ${player} ${minute}` };
                case 'substitution':
                    return { 
                        ...stat, 
                        displayText: `Sub: ${player} ↔ ${stat.substituted_for_name || 'Unknown'}`
                    };
                default:
                    return { ...stat, displayText: `${stat.event_type}: ${player}` };
            }
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
                    onPress={() => window.location.reload()}
                >
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.leagueTitle}>Castle Lager Premier Soccer League</Text>
                <Text style={styles.seasonTitle}>2024/25 Season Results</Text>
            </View>

            <View style={styles.resultsContainer}>
                <ScrollView style={styles.matchesScroll} showsVerticalScrollIndicator={false}>
                    {matches.length === 0 ? (
                        <View style={styles.noMatchesContainer}>
                            <Text style={styles.noMatchesText}>No results available</Text>
                            <Text style={styles.noMatchesSubText}>Check back later for updated results</Text>
                        </View>
                    ) : (
                        <>
                            {matches.slice(0, visibleMatches).map((match) => {
                                const matchDate = new Date(match.match_date);
                                const dateOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
                                const timeOptions = { hour: '2-digit', minute: '2-digit' };
                                
                                return (
                                    <TouchableOpacity 
                                        key={match.id} 
                                        style={styles.matchCard}
                                        onPress={() => handleMatchPress(match)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.dateContainer}>
                                            <Text style={styles.dateText}>
                                                {matchDate.toLocaleDateString([], dateOptions)}
                                            </Text>
                                            <Text style={styles.timeText}>
                                                {matchDate.toLocaleTimeString([], timeOptions)}
                                            </Text>
                                        </View>

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

                                        {match.statistics.length > 0 && (
                                            <View style={styles.matchEvents}>
                                                <Text style={styles.eventsTitle}>Key Match Events:</Text>
                                                {formatMatchEvents(match.statistics)
                                                    .slice(0, 3)
                                                    .map((event, index) => (
                                                        <View key={`${match.id}-${index}`} style={styles.eventItem}>
                                                            {renderEventIcon(event.event_type)}
                                                            <Text style={styles.eventText} numberOfLines={1}>
                                                                {event.displayText}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                {match.statistics.length > 3 && (
                                                    <Text style={styles.moreEventsText}>
                                                        + {match.statistics.length - 3} more events
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}

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