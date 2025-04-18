import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, withTheme } from 'react-native-paper';
import { Symbol } from '../types';

interface SymbolCardProps {
  symbol: Symbol;
  onPress: () => void;
  theme: ReactNativePaper.Theme;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ symbol, onPress, theme }) => {
  return (
    <Card 
      style={[styles.card, { backgroundColor: theme.colors.surface }]} 
      onPress={onPress}
    >
      <Card.Content style={styles.cardContent}>
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Image 
            source={
              symbol.image.startsWith('http') 
                ? { uri: symbol.image } 
                : { uri: window.location && window.location.pathname.includes('OrienteeringApp')
                    ? `/OrienteeringApp${symbol.image.replace('../../assets', '/assets')}`
                    : symbol.image.replace('../../assets', '/assets') }
            }
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
});

export default withTheme(SymbolCard);
