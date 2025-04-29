import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles/TableStyles.js';

export default function LeagueTable() {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BASE_URL = 'http://10.250.7.6:8000';

   const fetchStandings = async () => {
    try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await axios.get(`${BASE_URL}/standings`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Check for 'Standings' with capital S
        let standingsData = [];
        
        if (Array.isArray(response.data?.Standings)) {
            standingsData = response.data.Standings;
        } else if (Array.isArray(response.data)) {
            standingsData = response.data;
        } else {
            throw new Error('Invalid standings data format');
        }

        // Sort the standings
        const sortedStandings = standingsData.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
            return b.goals_for - a.goals_for;
        });

        setStandings(sortedStandings.map((team, index) => ({
            ...team,
            position: index + 1,
            form: typeof team.form === 'string' ? team.form.split('') : []
        })));
        setError(null);
    } catch (error) {
        console.error('Error fetching standings:', error);
        setError(error.message || 'Failed to load standings');
        setStandings([]);
    } finally {
        setLoading(false);
    }
};
    useEffect(() => {
        fetchStandings();
    }, []);

    const renderFormIcon = (result) => {
        switch(result) {
            case 'W': return <MaterialIcons name="sports-soccer" size={16} color="green" />;
            case 'D': return <MaterialIcons name="remove" size={16} color="orange" />;
            case 'L': return <MaterialIcons name="close" size={16} color="red" />;
            default: return <MaterialIcons name="help" size={16} color="gray" />;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B0000" />
                <Text style={styles.loadingText}>Loading league table...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => {
                        setLoading(true);
                        setError(null);
                        fetchStandings();
                    }}
                >
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.leagueTitle}>CASTLE LAGER PREMIER SOCCER LEAGUE</Text>
                <Text style={styles.seasonTitle}>2024/25 Season Standings</Text>
            </View>

            <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.positionCell]}>#</Text>
                <Text style={[styles.headerCell, styles.teamCell]}>TEAM</Text>
                <Text style={[styles.headerCell, styles.matchesCell]}>MP</Text>
                <Text style={[styles.headerCell, styles.winsCell]}>W</Text>
                <Text style={[styles.headerCell, styles.drawsCell]}>D</Text>
                <Text style={[styles.headerCell, styles.lossesCell]}>L</Text>
                <Text style={[styles.headerCell, styles.gfCell]}>GF</Text>
                <Text style={[styles.headerCell, styles.gaCell]}>GA</Text>
                <Text style={[styles.headerCell, styles.gdCell]}>GD</Text>
                <Text style={[styles.headerCell, styles.pointsCell]}>PTS</Text>
                <Text style={[styles.headerCell, styles.formCell]}>FORM</Text>
            </View>

            <ScrollView>
                {standings.map((team) => (
                    <View key={team.team_id} style={styles.teamRow}>
                        <Text style={[
                            styles.cell, 
                            styles.positionCell,
                            team.position <= 4 && styles.championsLeague,
                            team.position > 4 && team.position <= 8 && styles.confederationCup,
                            team.position >= standings.length - 2 && styles.relegation
                        ]}>
                            {team.position}
                        </Text>
                        
                        <Text style={[styles.cell, styles.teamCell]} numberOfLines={1}>
                            {team.team_name}
                        </Text>
                        
                        <Text style={[styles.cell, styles.matchesCell]}>{team.matches_played || 0}</Text>
                        <Text style={[styles.cell, styles.winsCell]}>{team.wins || 0}</Text>
                        <Text style={[styles.cell, styles.drawsCell]}>{team.draws || 0}</Text>
                        <Text style={[styles.cell, styles.lossesCell]}>{team.losses || 0}</Text>
                        <Text style={[styles.cell, styles.gfCell]}>{team.goals_for || 0}</Text>
                        <Text style={[styles.cell, styles.gaCell]}>{team.goals_against || 0}</Text>
                        <Text style={[styles.cell, styles.gdCell]}>
                            {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference || 0}
                        </Text>
                        <Text style={[styles.cell, styles.pointsCell]}>{team.points || 0}</Text>
                        
                        <View style={[styles.cell, styles.formCell]}>
                            <View style={styles.formContainer}>
                                {team.form.slice(0, 5).map((result, i) => (
                                    <View key={i} style={styles.formIcon}>
                                        {renderFormIcon(result)}
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, styles.championsLeague]} />
                    <Text style={styles.legendText}>CAF Champions League</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, styles.confederationCup]} />
                    <Text style={styles.legendText}>CAF Confederation Cup</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, styles.relegation]} />
                    <Text style={styles.legendText}>Relegation Zone</Text>
                </View>
            </View>
        </View>
    );
}
