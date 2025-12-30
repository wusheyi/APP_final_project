import { StyleSheet } from 'react-native';

export const getLoginScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 5,
    },
    subtitle: {
        color: theme.colors.textSecondary,
        fontSize: 16,
        letterSpacing: 1,
    },
    formContainer: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputField: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 0,
        elevation: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
    },
    buttonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
    },
    footerText: {
        color: theme.colors.grey3,
    }
});
