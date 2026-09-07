import React, { useState } from "react";
import { FlatList, Keyboard, StyleSheet, View } from "react-native";
import { List, Surface, TextInput } from "react-native-paper";

interface DestinationInputProps {
  label: string;
  value: string;
  onSelect: (item: string) => void;
  destinations: string[];
  isError: boolean;
  icon?: string;
}

const DestinationInput: React.FC<DestinationInputProps> = ({
  label,
  value,
  onSelect,
  destinations,
  isError = false,
  icon = "map-marker-outline",
}) => {
  const [results, setResults] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (text: string) => {
    onSelect(text);

    if (text.trim().length === 0) {
      setResults([]);
      return;
    }

    const filtered = destinations.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase()),
    );

    setResults(filtered);
  };

  const handleSelection = (item: string) => {
    onSelect(item);
    setResults([]);
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const clearInput = () => {
    onSelect("");
    setResults([]);
  };

  return (
    <View>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={handleSearch}
        onFocus={() => setIsFocused(true)}
        error={isError}
        left={<TextInput.Icon icon={icon} size={20} />}
        right={
          value.length > 0 ? (
            <TextInput.Icon icon="close-circle-outline" onPress={clearInput} />
          ) : null
        }
      />

      {isFocused && results.length > 0 && (
        <Surface style={styles.listSurface}>
          <FlatList
            data={results}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <List.Item title={item} onPress={() => handleSelection(item)} />
            )}
          />
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listSurface: {
    borderRadius: 4,
    marginTop: 2,
    maxHeight: 200,
  },
});

export default DestinationInput;
