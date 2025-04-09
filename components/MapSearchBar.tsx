import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Search, X, MapPin } from 'lucide-react-native';
import { searchLocation } from '@/services/mapService';

interface MapSearchBarProps {
  onLocationSelected: (location: any) => void;
  theme: any;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ onLocationSelected, theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    Keyboard.dismiss();
    
    try {
      const results = await searchLocation(searchQuery);
      if (results.length > 0) {
        onLocationSelected(results[0]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleMyLocation = () => {
    onLocationSelected(null); // Null indicates to use current location
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Search color={theme.secondary} size={20} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Search location..."
          placeholderTextColor={theme.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <X color={theme.secondary} size={18} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <TouchableOpacity 
        style={[styles.locationButton, { backgroundColor: theme.primary }]}
        onPress={handleMyLocation}
      >
        {isSearching ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <MapPin color="white" size={20} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 23,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  locationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default MapSearchBar;
