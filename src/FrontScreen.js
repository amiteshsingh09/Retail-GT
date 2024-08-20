import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Animatable from 'react-native-animatable';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

export const FrontScreen = ({ navigation }) => {
    const logoRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const prepare = async () => {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await SplashScreen.hideAsync();
            if (logoRef.current) logoRef.current.fadeOut(1800);
            if (textRef.current) textRef.current.fadeOut(1800);
            setTimeout(() => navigation.replace('Login'), 1800);
        };

        prepare();
    }, []);

    return (
        <>
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
                <Animatable.View
                    animation="slideInDown"
                    duration={1000}
                    style={styles.greenSection}
                >
                    <Animatable.View
                        ref={logoRef}
                        animation="zoomIn"
                        duration={1500}
                        style={styles.logoContainer}
                    >
                        <Image
                            source={require('../assets/Logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </Animatable.View>

                    <Animatable.View
                        ref={textRef}
                        animation="fadeInUp"
                        duration={1500}
                        delay={500}
                        style={styles.textContainer}
                    >
                        <Text style={styles.text}>
                            Welcome to IB Retail Force
                        </Text>
                    </Animatable.View>
                </Animatable.View>


                <Animatable.View
                    animation="slideInUp"
                    duration={1000}
                    style={styles.yellowSection}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFDE59',
    },
    greenSection: {
        flex: 3,
        backgroundColor: '#008751',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 50,
    },
    yellowSection: {
        flex: 1,
        backgroundColor: '#FFDE59',
        transform: [{ skewY: '-5deg' }],
        marginTop: -height * 0.05,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
    }, textContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },

});










