import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';

interface Symbol {
  ref: string;
  name: string;
  column: string;
  type: string;
  image: string;
  description?: string;
}

interface SymbolCardProps {
  symbol: Symbol;
  onPress?: () => void;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ symbol, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: symbol.image }} 
            style={styles.image} 
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.reference}>{symbol.ref}</Text>
          <Title>{symbol.name}</Title>
          <Text style={styles.type}>{symbol.type}</Text>
          {symbol.description && (
            <Paragraph numberOfLines={2}>
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
    backgroundColor: '#F5F5F5',
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
    color: '#666',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
});

export default SymbolCard;
