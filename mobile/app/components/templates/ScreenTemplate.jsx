import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';

const ScreenTemplate = ({
    children,
    backgroundColor = '#F2F2F7',
    statusBarStyle = 'dark-content',
    safeArea = true,
    style,
}) => {
    const Container = safeArea ? SafeAreaView : View;

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
