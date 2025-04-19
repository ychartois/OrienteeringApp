import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, withTheme, Text } from 'react-native-paper';
import { Symbol } from '../types';
import { getAssetPath } from '../utils/assetUtils';
import columns from '../data/columns.json';

interface SymbolCardProps {
  symbol: Symbol;
  onPress: () => void;
  theme: ReactNativePaper.Theme;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ symbol, onPress, theme }) => {
  // Get column name based on column identifier
  const getColumnName = (column: string): string => {
    // Find the column in our columns data
    const columnData = columns.find(c => c.letter === column);
    return columnData ? columnData.name : '';
  };

  return (
    <Card 
      style={[styles.card, { backgroundColor: theme.colors.surface }]} 
      onPress={onPress}
    >
      <Card.Content style={styles.cardContent}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Image 
            source={{ uri: getAssetPath(symbol.image) }}
            style={styles.image} 
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
          <Title style={{ color: theme.colors.onSurface }}>{symbol.ref} - {symbol.name}</Title>
          {symbol.description && (
            <Paragraph style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={2}>
              {symbol.description}
            </Paragraph>
          )}
          {symbol.column && (
            <Text style={[styles.columnInfo, { color: theme.colors.primary }]}>
              {symbol.column} - {getColumnName(symbol.column)}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardContent: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  image: {
    width: 60,
    height: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  reference: {
    fontSize: 12,
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    marginBottom: 4,
  },
  columnInfo: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default withTheme(SymbolCard);
