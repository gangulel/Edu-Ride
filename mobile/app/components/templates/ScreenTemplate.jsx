import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const ScreenTemplate = ({
    children,
    backgroundColor,
    statusBarStyle = 'dark-content',
    safeArea = true,
    style,
}) => {
    const theme = useTheme();
    const Container = safeArea ? SafeAreaView : View;
    return (
        <Container
            style={[
                styles.container,
                { backgroundColor: backgroundColor || theme.colors.background },
                style,
            ]}
        >
            <StatusBar barStyle={statusBarStyle} />
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default ScreenTemplate;
