import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Text, ActivityIndicator, Title, Divider, Searchbar, Button, Menu } from 'react-native-paper';
import SymbolCard from '../components/SymbolCard';
import { getAllSymbols, getAllSymbolTypes } from '../utils/assetUtils';

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
  filteredSymbols: Symbol[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedType: string | null;
  typeMenuVisible: boolean;
}

// Get symbols and types from the utility functions
const appSymbols: Symbol[] = getAllSymbols();
const symbolTypes: string[] = getAllSymbolTypes();

class SymbolLibraryScreen extends Component<SymbolLibraryScreenProps, SymbolLibraryScreenState> {
  constructor(props: SymbolLibraryScreenProps) {
    super(props);
    this.state = {
      symbols: [],
      filteredSymbols: [],
      loading: true,
      error: null,
      searchQuery: '',
      selectedType: null,
      typeMenuVisible: false
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
      
        // Using local assets
        setTimeout(() => {
          this.setState({
            symbols: appSymbols,
            filteredSymbols: appSymbols,
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

  handleSearch = (query: string) => {
    this.setState({ searchQuery: query }, this.filterSymbols);
  };

  handleTypeSelect = (type: string | null) => {
    this.setState({ 
      selectedType: type,
      typeMenuVisible: false 
    }, this.filterSymbols);
  };

  toggleTypeMenu = () => {
    this.setState(prevState => ({
      typeMenuVisible: !prevState.typeMenuVisible
    }));
  };

  filterSymbols = () => {
    const { symbols, searchQuery, selectedType } = this.state;
    
    let filtered = symbols;
    
    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(symbol => 
        symbol.name.toLowerCase().includes(lowerCaseQuery) ||
        symbol.description?.toLowerCase().includes(lowerCaseQuery) ||
        symbol.ref.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(symbol => symbol.type === selectedType);
    }
    
    this.setState({ filteredSymbols: filtered });
  };

  handleSymbolPress = (symbol: Symbol) => {
    // Navigate to symbol detail screen
    // this.props.navigation.navigate('SymbolDetail', { symbol });
    console.log('Symbol pressed:', symbol.name);
  };

  render() {
    const { filteredSymbols, loading, error, searchQuery, selectedType, typeMenuVisible } = this.state;

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
        <View style={styles.headerContainer}>
          <Title style={styles.header}>IOF Control Description Symbols</Title>
          <Divider />
        </View>
        
        <View style={styles.filterContainer}>
          <Searchbar
            placeholder="Search symbols"
            onChangeText={this.handleSearch}
            value={searchQuery}
            style={styles.searchBar}
            icon={() => null}
          />
          
          <Menu
            visible={typeMenuVisible}
            onDismiss={this.toggleTypeMenu}
            anchor={
              <Button 
                mode="outlined" 
                onPress={this.toggleTypeMenu}
                style={styles.filterButton}
              >
                {selectedType || "All Types"}
              </Button>
            }
          >
            <Menu.Item 
              onPress={() => this.handleTypeSelect(null)} 
              title="All Types" 
            />
            <Divider />
            {symbolTypes.map(type => (
              <Menu.Item 
                key={type}
                onPress={() => this.handleTypeSelect(type)} 
                title={type} 
              />
            ))}
          </Menu>
        </View>
        
        <View style={styles.resultsCountContainer}>
          <Text style={styles.resultsCount}>
            {filteredSymbols.length} {filteredSymbols.length === 1 ? 'result' : 'results'} found
          </Text>
        </View>
        
        <FlatList
          data={filteredSymbols}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SymbolCard 
              symbol={item} 
              onPress={() => this.handleSymbolPress(item)}
            />
          )}
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    elevation: 0,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    minWidth: 120,
    backgroundColor: '#FFFFFF',
  },
  resultsCountContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
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
