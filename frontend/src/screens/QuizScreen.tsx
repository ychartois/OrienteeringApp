import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { 
  Text, 
  Title, 
  Button, 
  RadioButton, 
  Card, 
  Paragraph, 
  Divider,
  ActivityIndicator,
  Chip
} from 'react-native-paper';
import { 
  QuizQuestion, 
  QuizDifficulty, 
  getQuizQuestionsByDifficulty 
} from '../data/quizQuestions';
import { getSymbolById } from '../utils/assetUtils';

interface Symbol {
  id: string;
  ref: string;
  name: string;
  column: string;
  type: string;
  image: string;
  description?: string;
}

interface QuizScreenProps {
  navigation: any; // In a real app, we would use proper typing from react-navigation
  route: {
    params?: {
      difficulty?: QuizDifficulty;
    }
  };
}

interface QuizScreenState {
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  isAnswerSubmitted: boolean;
  score: number;
  quizCompleted: boolean;
  loading: boolean;
}

class QuizScreen extends Component<QuizScreenProps, QuizScreenState> {
  constructor(props: QuizScreenProps) {
    super(props);
    
    // Get difficulty from route params or default to EASY
    const difficulty = props.route.params?.difficulty || QuizDifficulty.EASY;
    
    this.state = {
      difficulty,
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      score: 0,
      quizCompleted: false,
      loading: true
    };
  }

  componentDidMount() {
    this.loadQuestions();
  }

  loadQuestions = () => {
    const { difficulty } = this.state;
    const questions = getQuizQuestionsByDifficulty(difficulty);
    
    // Shuffle questions
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    
    this.setState({
      questions: shuffledQuestions,
      loading: false
    });
  };

  handleAnswerSelect = (answer: string) => {
    if (!this.state.isAnswerSubmitted) {
      this.setState({ selectedAnswer: answer });
    }
  };

  handleSubmitAnswer = () => {
    const { selectedAnswer, questions, currentQuestionIndex, score } = this.state;
    
    if (selectedAnswer) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      
      this.setState({
        isAnswerSubmitted: true,
        score: isCorrect ? score + 1 : score
      });
    }
  };

  handleNextQuestion = () => {
    const { currentQuestionIndex, questions } = this.state;
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      this.setState({
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        isAnswerSubmitted: false
      });
    } else {
      this.setState({ quizCompleted: true });
    }
  };

  handleRestartQuiz = () => {
    this.setState({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      score: 0,
      quizCompleted: false,
      loading: true
    }, this.loadQuestions);
  };

  handleChangeDifficulty = (difficulty: QuizDifficulty) => {
    this.setState({
      difficulty,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      score: 0,
      quizCompleted: false,
      loading: true
    }, this.loadQuestions);
  };

  renderDifficultySelector = () => {
    const { difficulty } = this.state;
    
    return (
      <View style={styles.difficultyContainer}>
        <Text style={styles.difficultyLabel}>Difficulty:</Text>
        <View style={styles.chipContainer}>
          <Chip 
            selected={difficulty === QuizDifficulty.EASY}
            onPress={() => this.handleChangeDifficulty(QuizDifficulty.EASY)}
            style={[styles.chip, difficulty === QuizDifficulty.EASY && styles.selectedChip]}
          >
            Easy
          </Chip>
          <Chip 
            selected={difficulty === QuizDifficulty.MEDIUM}
            onPress={() => this.handleChangeDifficulty(QuizDifficulty.MEDIUM)}
            style={[styles.chip, difficulty === QuizDifficulty.MEDIUM && styles.selectedChip]}
          >
            Medium
          </Chip>
          <Chip 
            selected={difficulty === QuizDifficulty.HARD}
            onPress={() => this.handleChangeDifficulty(QuizDifficulty.HARD)}
            style={[styles.chip, difficulty === QuizDifficulty.HARD && styles.selectedChip]}
          >
            Hard
          </Chip>
        </View>
      </View>
    );
  };

  renderQuestion = () => {
    const { 
      questions, 
      currentQuestionIndex, 
      selectedAnswer, 
      isAnswerSubmitted 
    } = this.state;
    
    if (questions.length === 0) {
      return (
        <Text style={styles.noQuestionsText}>
          No questions available for this difficulty level.
        </Text>
      );
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const symbol = getSymbolById(currentQuestion.symbolId);
    
    if (!symbol) {
      return (
        <Text style={styles.errorText}>
          Symbol not found for this question.
        </Text>
      );
    }
    
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        
        <View style={styles.symbolContainer}>
          <Image 
            source={
              symbol.image.startsWith('http') 
                ? { uri: symbol.image } 
                : { uri: symbol.image.replace('../../assets', '/assets') }
            } 
            style={styles.symbolImage} 
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        
        <RadioButton.Group
          onValueChange={this.handleAnswerSelect}
          value={selectedAnswer || ''}
        >
          {currentQuestion.options.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <RadioButton.Item
                label={option}
                value={option}
                disabled={isAnswerSubmitted}
                status={
                  isAnswerSubmitted
                    ? option === currentQuestion.correctAnswer
                      ? 'checked'
                      : selectedAnswer === option
                        ? 'unchecked'
                        : 'unchecked'
                    : 'unchecked'
                }
                labelStyle={
                  isAnswerSubmitted
                    ? option === currentQuestion.correctAnswer
                      ? styles.correctAnswer
                      : selectedAnswer === option
                        ? styles.incorrectAnswer
                        : {}
                    : {}
                }
              />
            </View>
          ))}
        </RadioButton.Group>
        
        {isAnswerSubmitted && (
          <Card style={styles.explanationCard}>
            <Card.Content>
              <Paragraph style={styles.explanationText}>
                {currentQuestion.explanation || 'No explanation available.'}
              </Paragraph>
            </Card.Content>
          </Card>
        )}
        
        <View style={styles.buttonContainer}>
          {!isAnswerSubmitted ? (
            <Button
              mode="contained"
              onPress={this.handleSubmitAnswer}
              disabled={!selectedAnswer}
              style={styles.button}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={this.handleNextQuestion}
              style={styles.button}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          )}
        </View>
      </View>
    );
  };

  renderResults = () => {
    const { score, questions, difficulty } = this.state;
    const percentage = Math.round((score / questions.length) * 100);
    
    let resultMessage = '';
    if (percentage >= 80) {
      resultMessage = 'Excellent! You have a great understanding of orienteering symbols!';
    } else if (percentage >= 60) {
      resultMessage = 'Good job! You have a solid understanding of orienteering symbols.';
    } else if (percentage >= 40) {
      resultMessage = 'Not bad! Keep practicing to improve your knowledge.';
    } else {
      resultMessage = 'Keep practicing! Orienteering symbols take time to learn.';
    }
    
    return (
      <View style={styles.resultsContainer}>
        <Title style={styles.resultsTitle}>Quiz Results</Title>
        <Text style={styles.difficultyText}>Difficulty: {difficulty}</Text>
        <Text style={styles.scoreText}>
          Your Score: {score} / {questions.length} ({percentage}%)
        </Text>
        <Paragraph style={styles.resultMessage}>{resultMessage}</Paragraph>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={this.handleRestartQuiz}
            style={styles.button}
          >
            Restart Quiz
          </Button>
          <Button
            mode="outlined"
            onPress={() => this.props.navigation.navigate('SymbolLibrary')}
            style={[styles.button, styles.secondaryButton]}
          >
            Back to Symbol Library
          </Button>
        </View>
      </View>
    );
  };

  render() {
    const { loading, quizCompleted } = this.state;
    
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0066CC" animating={true} />
          <Text style={styles.loadingText}>Loading quiz questions...</Text>
        </View>
      );
    }
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Title style={styles.header}>Symbol Quiz</Title>
          <Divider />
        </View>
        
        {this.renderDifficultySelector()}
        
        {quizCompleted ? this.renderResults() : this.renderQuestion()}
      </ScrollView>
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
  difficultyContainer: {
    padding: 16,
    marginBottom: 8,
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#0066CC',
  },
  questionContainer: {
    padding: 16,
  },
  questionCounter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  symbolContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  symbolImage: {
    width: 120,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionContainer: {
    marginBottom: 8,
  },
  correctAnswer: {
    color: 'green',
    fontWeight: 'bold',
  },
  incorrectAnswer: {
    color: 'red',
    textDecorationLine: 'line-through',
  },
  explanationCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  explanationText: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  resultsContainer: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  difficultyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultMessage: {
    fontSize: 16,
    marginBottom: 24,
  },
  noQuestionsText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default QuizScreen;
