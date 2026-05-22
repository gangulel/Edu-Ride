import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenTemplate from './ScreenTemplate';
import { ParentBottomNav } from '../organisms';

const TabScreenTemplate = ({
    children,
    backgroundColor = '#F2F2F7',
    showBottomNav = true,
    style,
}) => {
    return (
        <ScreenTemplate backgroundColor={backgroundColor} style={style}>
            <View style={styles.content}>
                {children}
            </View>
            {showBottomNav && <ParentBottomNav />}
        </ScreenTemplate>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
});

export default TabScreenTemplate;
