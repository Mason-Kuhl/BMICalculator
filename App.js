import React, {Component, useState} from 'react';
import { Alert, TextInput, TouchableOpacity, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const keyHeight = '@MyApp:keyHeight';
const keyResults = '@MyApp:keyResults';

export default class App extends Component {
  state = {
    height: 0,
    weight: 0,
    results: '',
  };

  //componentWillMount() {
  constructor (props) {
    super (props);
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const height = await AsyncStorage.getItem(keyHeight);
      const results = await AsyncStorage.getItem(keyResults);
      this.setState({ height, results });
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onSave = async () => {
    const { height } = this.state;
    const { weight } = this.state;

    let bmi = (this.state.weight * 703) / (this.state.height * this.state.height);
    this.setState({
      results: 'Body Mass Index is ' + bmi.toFixed(1),
    });

    try {
      await AsyncStorage.setItem(keyHeight, this.state.height);
      await AsyncStorage.setItem(keyResults, this.state.results);
      Alert.alert('Saved', 'Successfully saved height');
    } catch (error) {
      Alert.alert('Error', 'There was an error while saving the data');
    }
  }

  render() {
    const { height, results } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Weight in Pounds"
            onChangeText={newText => this.setState({weight: newText})}
          />
          <TextInput 
            style={styles.input}
            onChangeText={height => this.setState({height: height})}
            value={height}
            placeholder="Height in Inches"
          />
          <TouchableOpacity onPress={this.onSave} style={styles.button}>
            <Text style={styles.buttonText}>Compute BMI</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.resultsContainer}>
          <Text style={styles.results}>{results}</Text>
        </View>
        <View style={styles.assessContainer}>
          <Text style={styles.assessHeader}>Assessing Your BMI</Text>
          <Text style={styles.assessContent}>Underweight: less than 18.5</Text>
          <Text style={styles.assessContent}>Healthy: 18.5 to 24.9</Text>
          <Text style={styles.assessContent}>Overweight: 25.0 to 29.9</Text>
          <Text style={styles.assessContent}>Obese: 30.0 or higher</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: '#fff',
    textAlign: 'center',
    padding: 25,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#ecf0f1',
    fontSize: 24,
    borderRadius: 3,
    height: 40,
    padding: 5,
    margin: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 3,
    marginBottom: 30,
    margin: 10,
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  assessHeader: {
    fontSize: 20,
    paddingLeft: 10,
  },
  assessContent: {
    fontSize: 20,
    paddingLeft: 30,
  },
  results: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 90,
  }
});
