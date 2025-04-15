import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Title, Divider } from 'react-native-paper';
import SymbolCard from '../components/SymbolCard';

interface Symbol {
  id: string;
  ref: string;
  name: string;
  column: string;
  type: string;
  image: string;
  description?: string;
}

interface SymbolLibraryScreenProps {
  navigation: any; // In a real app, we would use proper typing from react-navigation
}

interface SymbolLibraryScreenState {
  symbols: Symbol[];
  loading: boolean;
  error: string | null;
}

// Mock data for development - would be replaced with API calls
const mockSymbols: Symbol[] = [
  {
    id: '1',
    ref: '1.2',
    name: 'Spur',
    column: 'Column D',
    type: 'Landforms',
    image: 'https://placeholder.com/assets/Column_D-Landforms-1.2-Spur.png',
    description: 'A contour projection or "nose" rising from the surrounding ground.'
  },
  {
    id: '2',
    ref: '3.1',
    name: 'Lake',
    column: 'Column D',
    type: 'Water Features',
    image: 'https://placeholder.com/assets/Column_D-Water_Features-3.1-Lake.png',
    description: 'A body of water.'
  },
  {
    id: '3',
    ref: '4.9',
    name: 'Prominent tree',
    column: 'Column D',
    type: 'Vegetation',
    image: 'https://placeholder.com/assets/Column_D-Vegetation-4.9-Prominent_tree.png',
    description: 'A notable or distinctive tree.'
  }
];

class SymbolLibraryScreen extends Component<SymbolLibraryScreenProps, SymbolLibraryScreenState> {
  constructor(props: SymbolLibraryScreenProps) {
    super(props);
    this.state = {
      symbols: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    // Simulate API call
    this.fetchSymbols();
  }

  fetchSymbols = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('api/symbols');
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        this.setState({
          symbols: mockSymbols,
          loading: false
        });
      }, 1000);
    } catch (err) {
      this.setState({
        error: 'Failed to fetch symbols',
        loading: false
      });
    }
  };

  handleSymbolPress = (symbol: Symbol) => {
    // Navigate to symbol detail screen
    // this.props.navigation.navigate('SymbolDetail', { symbol });
    console.log('Symbol pressed:', symbol.name);
  };

  render() {
    const { symbols, loading, error } = this.state;

    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0066CC" animating={true} />
          <Text style={styles.loadingText}>Loading symbols...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={symbols}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SymbolCard 
              symbol={item} 
              onPress={() => this.handleSymbolPress(item)}
            />
          )}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Title style={styles.header}>IOF Control Description Symbols</Title>
              <Divider />
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No symbols found</Text>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default SymbolLibraryScreen;
