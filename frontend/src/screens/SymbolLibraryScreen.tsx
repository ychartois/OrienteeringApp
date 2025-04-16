import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Text, ActivityIndicator, Title, Divider, Button, Modal, Portal, IconButton, withTheme } from 'react-native-paper';
import SymbolCard from '../components/SymbolCard';
import { getAllSymbols, getAllSymbolTypes } from '../utils/assetUtils';
import { Symbol } from '../types';

interface SymbolLibraryScreenProps {
  navigation: any; // In a real app, we would use proper typing from react-navigation
  theme: ReactNativePaper.Theme; // Theme prop
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
    const { theme } = this.props;

    if (loading) {
      return (
        <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} animating={true} />
          <Text style={[styles.loadingText, { color: theme.colors.onBackground }]}>Loading symbols...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerContainer}>
          <Title style={[styles.header, { color: theme.colors.onBackground }]}>IOF Control Description Symbols</Title>
          <Divider />
          <View style={styles.quizButtonContainer}>
            <Button 
              mode="contained" 
              onPress={() => this.props.navigation.navigate('Quiz')}
              style={styles.quizButton}
              icon="play"
            >
              Take a Quiz
            </Button>
          </View>
        </View>
        
        <View style={styles.filterContainer}>
          <View style={styles.searchBarWrapper}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
            <IconButton
              icon="magnify" 
              size={20}
              iconColor={theme.colors.onSurfaceVariant}
              style={{ margin: 0, padding: 0 }}
            />
            <TextInput
              placeholder="Search symbols..."
              onChangeText={this.handleSearch}
              value={searchQuery}
              style={[styles.searchInput, { color: theme.colors.onSurface }]}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={[styles.clearButton, { backgroundColor: theme.colors.surfaceVariant }]}
                onPress={() => this.handleSearch('')}
              >
                <IconButton
                  icon="close"
                  size={16}
                  iconColor={theme.colors.onSurfaceVariant}
                  style={{ margin: 0, padding: 0 }}
                />
              </TouchableOpacity>
            )}
          </View>
          </View>
          
          <Button 
            mode="outlined" 
            onPress={this.toggleTypeMenu}
            style={styles.filterButton}
            labelStyle={styles.filterButtonLabel}
            icon="filter-variant"
          >
            {selectedType ? selectedType.replace(/_/g, ' ') : "Filter"}
          </Button>
          
          <Portal>
            <Modal 
              visible={typeMenuVisible} 
              onDismiss={this.toggleTypeMenu}
              contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Select Symbol Type</Text>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={this.toggleTypeMenu}
                  style={styles.closeButton}
                  iconColor={theme.colors.onSurface}
                />
              </View>
              
              <Divider style={styles.modalDivider} />
              
              <ScrollView style={styles.typeList}>
                <TouchableOpacity
                  style={[
                    styles.typeItem,
                    selectedType === null && [styles.selectedTypeItem, { backgroundColor: theme.colors.primaryContainer }]
                  ]}
                  onPress={() => this.handleTypeSelect(null)}
                >
                  <Text style={[
                    styles.typeText,
                    { color: theme.colors.onSurface },
                    selectedType === null && [styles.selectedTypeText, { color: theme.colors.primary }]
                  ]}>
                    All Types
                  </Text>
                  {selectedType === null && (
                    <IconButton
                      icon="check"
                      size={18}
                      iconColor={theme.colors.primary}
                      style={{ margin: 0 }}
                    />
                  )}
                </TouchableOpacity>
                
                <Divider />
                
                {symbolTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeItem,
                      selectedType === type && [styles.selectedTypeItem, { backgroundColor: theme.colors.primaryContainer }]
                    ]}
                    onPress={() => this.handleTypeSelect(type)}
                  >
                    <Text style={[
                      styles.typeText,
                      { color: theme.colors.onSurface },
                      selectedType === type && [styles.selectedTypeText, { color: theme.colors.primary }]
                    ]}>
                      {type.replace(/_/g, ' ')}
                    </Text>
                    {selectedType === type && (
                      <IconButton
                        icon="check"
                        size={18}
                        iconColor={theme.colors.primary}
                        style={{ margin: 0 }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Modal>
          </Portal>
        </View>
        
        <View style={styles.resultsCountContainer}>
          <Text style={[styles.resultsCount, { color: theme.colors.onSurfaceVariant }]}>
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
              theme={this.props.theme}
            />
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>No symbols found</Text>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    padding: 0,
    marginLeft: 8,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    margin: 0,
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
  },
  typeText: {
    fontSize: 16,
  },
  selectedTypeText: {
    fontWeight: 'bold',
  },
  resultsCountContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    fontSize: 14,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});

// Wrap the component with withTheme to provide the theme prop
export default withTheme(SymbolLibraryScreen);
