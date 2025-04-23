// src/styles/globalStyles.js

import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: theme.colors.background,
                padding: theme.spacing.lg,
                justifyContent: 'center',
        },
        title: {
                fontSize: theme.fonts.sizes.xl,
                fontFamily: theme.fonts.bold,
                color: theme.colors.text,
                marginBottom: theme.spacing.lg,
                textAlign: 'center',
        },
        input: {
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                padding: theme.spacing.md,
                borderRadius: 8,
                fontSize: theme.fonts.sizes.md,
                marginBottom: theme.spacing.md,
                color: theme.colors.text,
        },
        button: {
                backgroundColor: theme.colors.primary,
                paddingVertical: theme.spacing.md,
                borderRadius: 8,
                alignItems: 'center',
        },
        buttonText: {
                color: '#fff',
                fontSize: theme.fonts.sizes.md,
                fontFamily: theme.fonts.bold,
        },
        link: {
                marginTop: theme.spacing.md,
                textAlign: 'center',
                color: theme.colors.primary,
                fontSize: theme.fonts.sizes.md,
        },
});
