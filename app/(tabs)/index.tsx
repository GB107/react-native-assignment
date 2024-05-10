import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, TextInput, Alert } from 'react-native';
import xmlParser, { ElementCompact } from 'xml-js';
import RadioButton from './RadioButton';

interface Field {
  type: { _text: string };
  _attributes: { id: string };
  label: { _text: string };
  options?: {
    option: {
      _attributes: { id: string };
      value: { _text: string };
      label: { _text: string };
    } | {
      _attributes: { id: string };
      value: { _text: string };
      label: { _text: string };
    }[];
  };
}

export default function HomeScreen() {
  const [xmlInput, setXmlInput] = useState('');
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [dateInputs, setDateInputs] = useState<{ [id: string]: { day: string; month: string; year: string } }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const content = e.target.result as string;
          setXmlInput(content);
          renderForm(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleButton1Press = () => {
    const xmlContent = `
    <form>
      <field id="1">
        <type>text</type>
        <label>First Name:</label>
      </field>
      <field id="2">
        <type>text</type>
        <label>Last Name:</label>
      </field>
      <field id="3">
        <type>date</type>
        <label>Date of Birth:</label>
      </field>
      <field id="4">
        <type>radio</type>
        <label>Gender:</label>
        <options>
          <option id="male">
            <value>Male</value>
            <label>Male</label>
          </option>
          <option id="female">
            <value>Female</value>
            <label>Female</label>
          </option>
        </options>
      </field>
      <field id="5">
        <type>drawing</type>
        <label>Signature:</label>
      </field>
    </form>
  `;
    renderForm(xmlContent);
  };

  const handleButton2Press = () => {
    renderForm(xmlInput);
  };

  const renderForm = (xmlContent: string) => {
    try {
      const parsedXML = xmlParser.xml2js(xmlContent, { compact: true }) as ElementCompact;
      if (parsedXML && parsedXML.form && parsedXML.form.field) {
        const fields = Array.isArray(parsedXML.form.field) ? parsedXML.form.field : [parsedXML.form.field];
        setFormFields(fields);
      } else {
        throw new Error('Invalid XML format: Missing "form" or "field" elements');
      }
    } catch (error) {
      console.log('Error parsing XML:', error);
      Alert.alert('Error', 'Invalid XML format or missing XML elements');
    }
  };

  const renderFormField = (field: Field) => {
    switch (field.type._text) {
      case 'text':
        return (
          <TextInput
            key={field._attributes.id}
            style={styles.inputField}
            placeholder={field.label._text}
          />
        );
      case 'datetime':
        return (
          <View key={field._attributes.id}>
            <Text style={styles.label}>{field.label._text}</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={[styles.dateInput, styles.dateBlock]}
                placeholder="DD"
                maxLength={2}
                keyboardType="number-pad"
                onChangeText={(text) => handleDateInputChange(text, 'day', field._attributes.id)}
              />
              <Text style={styles.dateSeparator}>/</Text>
              <TextInput
                style={[styles.dateInput, styles.dateBlock]}
                placeholder="MM"
                maxLength={2}
                keyboardType="number-pad"
                onChangeText={(text) => handleDateInputChange(text, 'month', field._attributes.id)}
              />
              <Text style={styles.dateSeparator}>/</Text>
              <TextInput
                style={[styles.dateInput, styles.dateBlock]}
                placeholder="YYYY"
                maxLength={4}
                keyboardType="number-pad"
                onChangeText={(text) => handleDateInputChange(text, 'year', field._attributes.id)}
              />
            </View>
          </View>
        );
      case 'date':
        return (
          <View key={field._attributes.id}>
            <Text style={styles.label}>{field.label._text}</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={[styles.dateInput, styles.dateBlock]}
                placeholder="DD"
                maxLength={2}
                keyboardType="number-pad"
                onChangeText={(text) => handleDateInputChange(text, 'day', field._attributes.id)}
              />
              <Text style={styles.dateSeparator}>/</Text>
              <TextInput
                style={[styles.dateInput, styles.dateBlock]}
                placeholder="MM"
                maxLength={2}
                keyboardType="number-pad"
                onChangeText={(text) => handleDateInputChange(text, 'month', field._attributes.id)}
              />
              <Text style={styles.dateSeparator}>/</Text>
              <TextInput
                style={[styles.dateInput, styles.dateBlock]}
                placeholder="YYYY"
                maxLength={4}
                keyboardType="number-pad"
                onChangeText={(text) => handleDateInputChange(text, 'year', field._attributes.id)}
              />
            </View>
          </View>
        );
      case 'radio':
        return (
          <View key={field._attributes.id}>
            <Text style={styles.label}>{field.label._text}</Text>
            <View style={styles.radioContainer}>
              {field.options && field.options.option ? (
                Array.isArray(field.options.option) ? (
                  field.options.option.map((option: any) => (
                    <RadioButton
                      key={option._attributes.id}
                      label={option.label._text}
                      value={option.value._text}
                    />
                  ))
                ) : (
                  <RadioButton
                    key={field.options.option._attributes.id}
                    label={field.options.option.label._text}
                    value={field.options.option.value._text}
                  />
                )
              ) : (
                <Text>No options available</Text>
              )}
            </View>
          </View>
        );
        case 'drawing':
          return (
            <View key={field._attributes.id}>
              <Text style={styles.label}>{field.label._text}</Text>
              {/* Implement drawing component */}
              <TextInput
                style={styles.drawingField}
                placeholder="Draw here..."
                multiline
                // Implement drawing functionality
              />
            </View>
          );
      default:
        return null;
    }
  };

  const handleDateInputChange = (text: string, part: 'day' | 'month' | 'year', id: string) => {
    setDateInputs({
      ...dateInputs,
      [id]: {
        ...dateInputs[id],
        [part]: text,
      },
    });
  };

  return (
    <View style={styles.container}>
      <input type="file" accept=".xml,.txt" onChange={handleFileChange} style={styles.fileInput} />
      <Button title="Load Standard Form" onPress={handleButton1Press} />
      <Text style={styles.label}>Enter XML Input:</Text>
      <TextInput
        style={styles.xmlInput}
        multiline
        placeholder="Enter XML here"
        value={xmlInput}
        onChangeText={setXmlInput}
      />
      <View style={styles.formContainer}>
        {formFields.map((field) => renderFormField(field))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black',
  },
  label: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    color: 'white',
  },
  placeholderText: {
    color: 'white',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  fileInput: {
    marginBottom: 20,
  },
  xmlInput: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: 'darkgray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: 'white',
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'rgb(168 145 145);',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  inputField: {
    marginBottom: 10,
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'darkgray',
    borderRadius: 5,
    padding: 10,
    color: 'white',
  },
  drawingField: {
    marginBottom: 10,
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: 'darkgray',
    borderRadius: 5,
    padding: 10,
    color: 'white',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'darkgray',
    borderRadius: 5,
    padding: 10,
    color: 'white',
    textAlign: 'center',
  },
  dateBlock: {
    marginHorizontal: 5,
  },
  dateSeparator: {
    color: 'white',
    fontSize: 20,
    lineHeight: 40,
  },
  radioContainer: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

