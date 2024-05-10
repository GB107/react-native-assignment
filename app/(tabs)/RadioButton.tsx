import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface RadioButtonProps {
  value: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({ value }) => {
  const [selected, setSelected] = React.useState(false);

  const toggleSelection = () => {
    setSelected(!selected);
  };

  return (
    <TouchableOpacity onPress={toggleSelection}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: selected ? 'blue' : 'black',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selected && (
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: 'blue',
              }}
            />
          )}
        </View>
        <Text style={{ marginLeft: 8 }}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
