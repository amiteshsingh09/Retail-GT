import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';

export const CustomPicker = ({ selectedValue, onValueChange, options, placeholder , enabled }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOptionSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={styles.optionButton}
      onPress={() => handleOptionSelect(item.value)}
    >
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerText}>
          {selectedValue ? options.find(option => option.value === selectedValue)?.label : placeholder}
        </Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={renderOption}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  pickerText: {
    color: '#333333',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  optionButton: {
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  closeText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default CustomPicker;











































