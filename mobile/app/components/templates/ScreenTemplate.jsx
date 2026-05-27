import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenTemplate = ({
    children,
    backgroundColor = '#F2F2F7',
    statusBarStyle = 'dark-content',
    safeArea = true,
    style,
}) => {
    // Only apply top safe area inset — the bottom is handled by ParentBottomNav/DriverBottomNav
    const Container = safeArea
        ? (props) => <SafeAreaView edges={['top']} {...props} />
        : View;

    return (
        <Container style={[styles.container, { backgroundColor }, style]}>
            <StatusBar barStyle={statusBarStyle} />
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ScreenTemplate;
