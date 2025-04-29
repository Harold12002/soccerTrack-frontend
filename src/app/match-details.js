import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { styles } from './styles/MatchDetailsStyles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MatchDetails() {
    const { match } = useLocalSearchParams();
    const matchData = JSON.parse(match);
    const [stats, setStats] = useState([]); // Initialize as empty array
    const [loadingStats, setLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState(null);
    const BASE_URL = 'http://10.250.7.6:8000';

    // Safe date handling
    const matchDate = matchData.match_date ? new Date(matchData.match_date) : new Date();
    const fullDate = matchDate.toString() === 'Invalid Date' ? 'Date not available' : 
        matchDate.toLocaleDateString([], {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
    const time = matchDate.toString() === 'Invalid Date' ? '' : 
        matchDate.toLocaleTimeString([], {
            hour: '2-digit', 
            minute: '2-digit'
        });

    useEffect(() => {
        const fetchMatchStats = async () => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');
                if (!token) {
                    setStatsError('Authentication required');
                    return;
                }
                
                const response = await axios.get(`${BASE_URL}/matches/events${matchData.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                
                setStats(Array.isArray(response?.data) ? response.data : []);
                setStatsError(null);
            } catch (error) {
                console.error('Error fetching match stats:', error);
                setStatsError('Failed to load match statistics');
                setStats([]); 
            } finally {
                setLoadingStats(false);
            }
        };

        fetchMatchStats();
    }, [matchData.id]);

    // Safe grouping of stats
    const groupedStats = (stats || []).reduce((acc, stat) => {
        if (!stat?.event_type) return acc;
        
        if (!acc[stat.event_type]) {
            acc[stat.event_type] = [];
        }
        acc[stat.event_type].push(stat);
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Match Header */}
                <View style={styles.header}>
                    <Text style={styles.leagueTitle}>CASTLE LAGER PREMIER SOCCER LEAGUE</Text>
                    <Text style={styles.matchDate}>{fullDate}{time ? ` • ${time}` : ''}</Text>
                </View>

                {/* Teams and Score */}
                <View style={styles.scoreContainer}>
                    <View style={styles.teamContainer}>
                        <Text style={styles.teamName}>{matchData.home_team_name}</Text>
                        <Text style={styles.teamScore}>{matchData.home_goals}</Text>
                    </View>
                    
                    <View style={styles.vsContainer}>
                        <Text style={styles.vsText}>VS</Text>
                    </View>
                    
                    <View style={styles.teamContainer}>
                        <Text style={styles.teamName}>{matchData.away_team_name}</Text>
                        <Text style={styles.teamScore}>{matchData.away_goals}</Text>
                    </View>
                </View>

                {/* Match Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Venue:</Text>
                        <Text style={styles.detailValue}>{matchData.venue || 'Not specified'}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Attendance:</Text>
                        <Text style={styles.detailValue}>{matchData.attendance || 'Not specified'}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Referee:</Text>
                        <Text style={styles.detailValue}>{matchData.referee || 'Not specified'}</Text>
                    </View>
                </View>

                {/* Match Events */}
                {matchData.events && (
                    <View style={styles.eventsContainer}>
                        <Text style={styles.sectionTitle}>Match Events</Text>
                        {matchData.events.split('|').map((event, index) => (
                            <View key={index} style={styles.eventItem}>
                                <Text style={styles.eventText}>• {event.trim()}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Match Statistics */}
                {loadingStats ? (
                    <ActivityIndicator size="small" color="#8B0000" style={styles.loadingIndicator} />
                ) : statsError ? (
                    <Text style={styles.errorText}>{statsError}</Text>
                ) : (
                    <View style={styles.statsContainer}>
                        <Text style={styles.sectionTitle}>Match Statistics</Text>
                        
                        {Object.keys(groupedStats).length > 0 ? (
                            Object.entries(groupedStats).map(([eventType, events]) => (
                                <View key={eventType} style={styles.statGroup}>
                                    <Text style={styles.statGroupTitle}>
                                        {eventType.replace(/_/g, ' ').toUpperCase()}
                                    </Text>
                                    
                                    {events.map((event, index) => (
                                        <View key={index} style={styles.statItem}>
                                            <Text style={styles.statPlayer}>
                                                {event.player_name || 'Unknown player'} ({event.minute || '?'}')
                                            </Text>
                                            {event.assisted_by && (
                                                <Text style={styles.statAssist}>
                                                    Assisted by: {event.assisted_by}
                                                </Text>
                                            )}
                                            {event.substituted_for && (
                                                <Text style={styles.statSubstitution}>
                                                    Replaced: {event.substituted_for}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noStatsText}>No statistics available</Text>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}