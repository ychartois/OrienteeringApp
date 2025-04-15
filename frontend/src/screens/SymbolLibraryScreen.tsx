import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Text, ActivityIndicator, Title, Divider, Button, Modal, Portal } from 'react-native-paper';
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
    
    let filtered = [...symbols];
    
    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(symbol => 
        symbol.name.toLowerCase().includes(lowerCaseQuery) ||
        symbol.description?.toLowerCase().includes(lowerCaseQuery) ||
        symbol.ref.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Filter by type - only if a type is selected
    if (selectedType !== null) {
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
          <View style={styles.quizButtonContainer}>
            <Button 
              mode="contained" 
              onPress={() => this.props.navigation.navigate('Quiz')}
              style={styles.quizButton}
              color="#007BFF"
            >
              Take a Quiz
            </Button>
          </View>
        </View>
        
        <View style={styles.filterContainer}>
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                placeholder="Search symbols..."
                onChangeText={this.handleSearch}
                value={searchQuery}
                style={styles.searchInput}
                placeholderTextColor="#888"
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => this.handleSearch('')}
                >
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <Button 
            mode="contained" 
            onPress={this.toggleTypeMenu}
            style={styles.filterButton}
            labelStyle={styles.filterButtonLabel}
            color="#007BFF"
          >
            {selectedType ? selectedType.replace(/_/g, ' ') : "Filter"}
          </Button>
          
          <Portal>
            <Modal 
              visible={typeMenuVisible} 
              onDismiss={this.toggleTypeMenu}
              contentContainerStyle={styles.modalContainer}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Symbol Type</Text>
                <TouchableOpacity onPress={this.toggleTypeMenu} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <Divider style={styles.modalDivider} />
              
              <ScrollView style={styles.typeList}>
                <TouchableOpacity
                  style={[
                    styles.typeItem,
                    selectedType === null && styles.selectedTypeItem
                  ]}
                  onPress={() => this.handleTypeSelect(null)}
                >
                  <Text style={[
                    styles.typeText,
                    selectedType === null && styles.selectedTypeText
                  ]}>
                    All Types
                  </Text>
                  {selectedType === null && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </TouchableOpacity>
                
                <Divider />
                
                {symbolTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeItem,
                      selectedType === type && styles.selectedTypeItem
                    ]}
                    onPress={() => this.handleTypeSelect(type)}
                  >
                    <Text style={[
                      styles.typeText,
                      selectedType === type && styles.selectedTypeText
                    ]}>
                      {type.replace(/_/g, ' ')}
                    </Text>
                    {selectedType === type && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Modal>
          </Portal>
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
  quizButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  quizButton: {
    width: '80%',
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 10,
  },
  searchBarWrapper: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    padding: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  filterButton: {
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  filterButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    maxHeight: '70%',
    elevation: 5,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalDivider: {
    height: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  typeList: {
    maxHeight: 400,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  selectedTypeItem: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
  typeText: {
    fontSize: 16,
  },
  selectedTypeText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  checkIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginRight: 10,
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
