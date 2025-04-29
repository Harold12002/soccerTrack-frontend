import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const isSmallScreen = width < 400; // Mobile breakpoint
const isLandscape = width > height;

export const styles = StyleSheet.create({
    // Main container
    container: {
        flex: 1,
        backgroundColor: "#121212", // Dark background
        paddingHorizontal: isSmallScreen ? 4 : 8,
    },

    // Header section
    header: {
        paddingVertical: isSmallScreen ? 12 : 16,
        paddingHorizontal: 8,
        backgroundColor: "#8B0000", // Castle Lager red
        marginBottom: 8,
        borderRadius: 4,
        elevation: 2,
    },
    leagueTitle: {
        color: "#fff",
        fontSize: isLandscape ? 18 : isSmallScreen ? 16 : 18,
        fontWeight: "800",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    seasonTitle: {
        color: "#f0f0f0",
        fontSize: isLandscape ? 14 : isSmallScreen ? 12 : 14,
        textAlign: "center",
        marginTop: 4,
        opacity: 0.9,
    },

    // Table header row
    tableHeader: {
        flexDirection: "row",
        paddingVertical: isSmallScreen ? 10 : 12,
        backgroundColor: "#1E1E1E", // Dark header
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        marginBottom: 2,
    },
    headerCell: {
        fontWeight: "700",
        fontSize: isSmallScreen ? 10 : 12,
        color: "#fff",
        textAlign: "center",
    },

    // Team rows
    teamRow: {
        flexDirection: "row",
        paddingVertical: isSmallScreen ? 8 : 10,
        backgroundColor: "#1A1A1A", // Slightly lighter than background
        marginBottom: 2,
        borderRadius: 2,
        alignItems: "center",
    },
    cell: {
        fontSize: isSmallScreen ? 12 : 14,
        color: "#fff",
        textAlign: "center",
    },

    // Specific column styles
    positionCell: {
        width: isLandscape ? 36 : isSmallScreen ? 28 : 32,
        fontWeight: "700",
    },
    teamCell: {
        flex: isLandscape ? 2.5 : 3,
        textAlign: "left",
        paddingLeft: 8,
        fontSize: isSmallScreen ? 12 : 14,
        fontWeight: "500",
    },
    matchesCell: { width: isSmallScreen ? 26 : 30 },
    winsCell: { width: isSmallScreen ? 26 : 30 },
    drawsCell: { width: isSmallScreen ? 26 : 30 },
    lossesCell: { width: isSmallScreen ? 26 : 30 },
    gfCell: { width: isSmallScreen ? 26 : 30 },
    gaCell: { width: isSmallScreen ? 26 : 30 },
    gdCell: {
        width: isSmallScreen ? 34 : 40,
        fontWeight: "600",
    },
    pointsCell: {
        width: isSmallScreen ? 34 : 40,
        fontWeight: "700",
        color: "#FFD700", // Gold for points
    },
    formCell: {
        width: isLandscape ? 110 : isSmallScreen ? 80 : 100,
    },

    // Form icons container
    formContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingHorizontal: 4,
    },
    formIcon: {
        marginHorizontal: 1,
    },

    // Position highlights
    championsLeague: {
        backgroundColor: "rgba(0, 150, 0, 0.25)", // Green tint
    },
    confederationCup: {
        backgroundColor: "rgba(0, 100, 200, 0.25)", // Blue tint
    },
    relegation: {
        backgroundColor: "rgba(200, 0, 0, 0.25)", // Red tint
    },

    // Legend section
    legendContainer: {
        flexDirection: isSmallScreen ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#1E1E1E",
        marginTop: 12,
        borderRadius: 4,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        margin: isSmallScreen ? 4 : 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: "#252525",
    },
    legendColor: {
        width: 14,
        height: 14,
        marginRight: 8,
        borderRadius: 7,
    },
    legendText: {
        fontSize: isSmallScreen ? 11 : 12,
        color: "#ddd",
    },

    // Loading and error states
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
    },
    loadingText: {
        marginTop: 12,
        color: "#8B0000",
        fontSize: 14,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#FF4444",
        marginBottom: 20,
        textAlign: "center",
        fontSize: 14,
    },
    retryButton: {
        backgroundColor: "#8B0000",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 6,
    },
    retryText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },

    // Utility classes
    textCenter: {
        textAlign: "center",
    },
    textBold: {
        fontWeight: "700",
    },
});
