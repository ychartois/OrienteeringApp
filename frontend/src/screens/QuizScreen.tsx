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
  Chip,
  ProgressBar,
  IconButton,
  withTheme
} from 'react-native-paper';
// Remove MaterialCommunityIcons import
import { QuizDifficulty, Symbol, QuizQuestion } from '../types';
import { 
  getAssetPath,
  getSymbolById, 
  generateQuizQuestions, 
  getAllSymbolTypes,
  shuffleArray,
  getAllSymbols,
  countAvailableSymbols
  // Remove getTotalSymbolCount and getSymbolCountByType imports
} from '../utils/assetUtils';

// Add local utility functions to avoid import issues
const countSymbolsByType = (type: string): number => {
  return getAllSymbols().filter(symbol => symbol.type === type).length;
};

const getTotalSymbolCount = (): number => {
  return getAllSymbols().length;
};

interface QuizScreenProps {
  navigation: any;
  theme: ReactNativePaper.Theme;
}

interface QuizScreenState {
  difficulty: QuizDifficulty;
  selectedTypes: string[];
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  isAnswerSubmitted: boolean;
  timeRemaining: number | null;
  timerInterval: NodeJS.Timeout | null;
  timeIsUp: boolean;
  loading: boolean;
  score: number;
  quizSetupComplete: boolean;
  quizCompleted: boolean;
  hasReducedQuestions?: boolean; // Added missing property
  insufficientSymbolsError?: boolean; // Added missing property
  availableSymbolCount?: number; // Added missing property
  requiredSymbolCount?: number; // Added missing property
}

class QuizScreen extends Component<QuizScreenProps, QuizScreenState> {
  constructor(props: QuizScreenProps) {
    super(props);
    this.state = {
      difficulty: QuizDifficulty.EASY,
      selectedTypes: [],
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      timeRemaining: null,
      timerInterval: null,
      timeIsUp: false,
      loading: false,
      score: 0,
      quizSetupComplete: false,
      quizCompleted: false
    };
  }
  
  componentWillUnmount() {
    this.clearTimer();
  }
  
  clearTimer = () => {
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
  };
  
  loadQuestions = async () => {
    const { difficulty, selectedTypes } = this.state;
    
    // Show loading indicator
    this.setState({ loading: true });
    
    try {
      // Convert difficulty to number for the API
      const difficultyLevel = 
        difficulty === QuizDifficulty.EASY ? 1 : 
        difficulty === QuizDifficulty.MEDIUM ? 2 : 3;
      
      // Set number of questions based on difficulty
      let questionCount = 10; // Easy
      if (difficulty === QuizDifficulty.MEDIUM) {
        questionCount = 15;
      } else if (difficulty === QuizDifficulty.HARD) {
        questionCount = 20;
      }
      
      // Determine complexities based on difficulty
      let complexities: number[] = [];
      if (difficultyLevel === 1) { // Easy
        complexities = [1]; // Only easy symbols
      } else if (difficultyLevel === 2) { // Medium
        complexities = [1, 2]; // Easy and medium symbols
      } else { // Hard
        complexities = [2, 3]; // Medium and hard symbols
      }
      
      // Check if we have enough symbols available before starting the quiz
      const availableSymbolCount = countAvailableSymbols(selectedTypes, complexities);
      
      // If not enough symbols, show error and don't start the quiz
      if (availableSymbolCount < questionCount) {
        // Show error message
        this.setState({
          loading: false,
          insufficientSymbolsError: true,
          availableSymbolCount,
          requiredSymbolCount: questionCount
        });
        return;
      }
      
      // Generate questions
      const questions = generateQuizQuestions(difficultyLevel, selectedTypes, questionCount);
      const shuffledQuestions = shuffleArray([...questions]);
      
      // Set state
      this.setState({
        questions: shuffledQuestions,
        insufficientSymbolsError: false,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        isAnswerSubmitted: false,
        timeRemaining: null,
        timerInterval: null,
        timeIsUp: false,
        loading: false,
        score: 0,
        quizSetupComplete: true,
        quizCompleted: false
      }, () => {
        // Start timer if applicable
        this.startTimer();
      });
    } catch (error) {
      console.error('Error loading questions:', error);
      this.setState({ loading: false });
    }
  };
  
  handleChangeDifficulty = (newDifficulty: QuizDifficulty) => {
    this.setState({ difficulty: newDifficulty });
  };
  
  handleAnswerSelect = (value: string) => {
    this.setState({ selectedAnswer: value });
  };
  
  handleSubmitAnswer = () => {
    const { selectedAnswer, questions, currentQuestionIndex, score } = this.state;
    
    if (!selectedAnswer) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    this.setState({ 
      isAnswerSubmitted: true,
      score: isCorrect ? score + 1 : score
    });
    
    this.clearTimer();
  };
  
  handleTimeUp = () => {
    this.setState({ timeIsUp: true, isAnswerSubmitted: true });
    this.clearTimer();
  };
  
  handleNextQuestion = () => {
    const { currentQuestionIndex, questions } = this.state;
    
    if (currentQuestionIndex === questions.length - 1) {
      // Quiz completed
      this.setState({
        quizCompleted: true
      });
    } else {
      // Next question
      this.setState({
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedAnswer: null,
        isAnswerSubmitted: false,
        timeIsUp: false
      }, () => {
        this.startTimer();
      });
    }
  };
  
  handleRestartQuiz = () => {
    this.setState({
      quizSetupComplete: false,  // Go back to quiz setup screen to create a new quiz
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      timeRemaining: null,
      timerInterval: null,
      timeIsUp: false,
      loading: false,
      score: 0,
      quizCompleted: false
    });
  };
  
  toggleTypeSelection = (type: string) => {
    this.setState(prevState => {
      const isSelected = prevState.selectedTypes.includes(type);
      
      return {
        selectedTypes: isSelected
          ? prevState.selectedTypes.filter(t => t !== type)
          : [...prevState.selectedTypes, type]
      };
    });
  };
  
  clearTypeSelection = () => {
    this.setState({ selectedTypes: [] });
  };

  renderTypeSelector = () => {
    const { selectedTypes } = this.state;
    const { theme } = this.props;
    const allTypes = getAllSymbolTypes();
    const totalSymbolCount = getTotalSymbolCount();
    
    const renderIcon = (isSelected: boolean, size: number = 20) => (
      <IconButton
        icon={isSelected ? "check" : "plus"}
        size={size}
        iconColor={theme.colors.primary}
        style={{ margin: 0 }}
      />
    );
    
    return (
      <View style={styles.typeFilterContainer}>
        <Text style={[styles.filterLabel, { color: theme.colors.onBackground }]}>Filter by symbol types:</Text>
        
        <View style={styles.typeChipContainer}>
          {allTypes.map((type: string) => {
            const symbolCount = countSymbolsByType(type);
            return (
              <Chip
                key={type}
                selected={selectedTypes.includes(type)}
                onPress={() => this.toggleTypeSelection(type)}
                style={styles.typeChip}
                selectedColor={theme.colors.primary}
                avatar={renderIcon(selectedTypes.includes(type))}
              >
                {type.replace(/_/g, ' ')} ({symbolCount})
              </Chip>
            );
          })}
        </View>
        
        <View style={styles.filterActionsContainer}>
          <Button
            mode="outlined"
            onPress={this.clearTypeSelection}
            style={styles.clearButton}
            icon={({ size, color }) => (
              <IconButton
                icon="close"
                iconColor={color}
                size={size}
                style={{ margin: 0 }}
              />
            )}
          >
            Clear Selection
          </Button>
          
          <Text style={[styles.helperText, { color: theme.colors.onSurfaceVariant }]}>
            {selectedTypes.length === 0 
              ? `All symbol types will be included (${totalSymbolCount} symbols)` 
              : selectedTypes.length === 1
                ? `${selectedTypes.length} symbol type selected (${selectedTypes.map(t => countSymbolsByType(t)).reduce((a, b) => a + b, 0)} symbols)`
                : `${selectedTypes.length} symbol types selected (${selectedTypes.map(t => countSymbolsByType(t)).reduce((a, b) => a + b, 0)} symbols)`}
          </Text>
        </View>
      </View>
    );
  };

  renderDifficultySelector = () => {
    const { difficulty } = this.state;
    const { theme } = this.props;
    
    const renderIcon = (iconName: string, size: number = 20) => (
      <IconButton
        icon={iconName}
        size={size}
        iconColor={theme.colors.primary}
        style={{ margin: 0 }}
      />
    );
    
    return (
      <View style={styles.difficultyContainer}>
        <Text style={[styles.difficultyLabel, { color: theme.colors.onBackground }]}>Difficulty:</Text>
        <View style={styles.chipContainer}>
          <Chip 
            selected={difficulty === QuizDifficulty.EASY}
            onPress={() => this.handleChangeDifficulty(QuizDifficulty.EASY)}
            style={[styles.chip, difficulty === QuizDifficulty.EASY && { backgroundColor: theme.colors.primaryContainer }]}
            selectedColor={theme.colors.primary}
          >
            Easy
          </Chip>
          <Chip 
            selected={difficulty === QuizDifficulty.MEDIUM}
            onPress={() => this.handleChangeDifficulty(QuizDifficulty.MEDIUM)}
            style={[styles.chip, difficulty === QuizDifficulty.MEDIUM && { backgroundColor: theme.colors.primaryContainer }]}
            selectedColor={theme.colors.primary}
          >
            Medium
          </Chip>
          <Chip 
            selected={difficulty === QuizDifficulty.HARD}
            onPress={() => this.handleChangeDifficulty(QuizDifficulty.HARD)}
            style={[styles.chip, difficulty === QuizDifficulty.HARD && { backgroundColor: theme.colors.primaryContainer }]}
            selectedColor={theme.colors.primary}
          >
            Hard
          </Chip>
        </View>
      </View>
    );
  };
  
  startTimer = () => {
    const { difficulty } = this.state;
    
    // No timer for Easy difficulty
    if (difficulty === QuizDifficulty.EASY) {
      this.setState({ timeRemaining: null });
      return;
    }
    
    // Set time based on difficulty
    const timeLimit = difficulty === QuizDifficulty.MEDIUM ? 30 : 15;
    this.setState({ timeRemaining: timeLimit });
    
    // Create interval to update timer
    const interval = setInterval(() => {
      this.setState(prevState => {
        if (prevState.timeRemaining === null) return { timeRemaining: null };
        
        const newTime = prevState.timeRemaining - 1;
        
        // Time's up
        if (newTime <= 0) {
          this.handleTimeUp();
          return { timeRemaining: 0 };
        }
        
        return { timeRemaining: newTime };
      });
    }, 1000);
    
    this.setState({ timerInterval: interval });
  };
  
  renderTimer = () => {
    const { timeRemaining, difficulty } = this.state;
    const { theme } = this.props;
    
    if (difficulty === QuizDifficulty.EASY || timeRemaining === null) {
      return null;
    }
    
    // Calculate color based on time remaining
    const dangerThreshold = difficulty === QuizDifficulty.MEDIUM ? 7 : 5;
    const warningThreshold = difficulty === QuizDifficulty.MEDIUM ? 15 : 7;
    
    // Use custom warning color since it's not in MD3 theme by default
    const warningColor = '#ffc107'; // Amber
    
    let timerColor = theme.colors.primary; // Default
    if (timeRemaining <= dangerThreshold) {
      timerColor = theme.colors.error;
    } else if (timeRemaining <= warningThreshold) {
      timerColor = warningColor;
    }
    
    // Calculate progress percentage
    const maxTime = difficulty === QuizDifficulty.MEDIUM ? 30 : 15;
    const progress = timeRemaining / maxTime;
    
    return (
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: timerColor }]}>
          Time remaining: {timeRemaining}s
        </Text>
        <ProgressBar 
          progress={progress} 
          color={timerColor} 
          style={styles.timerBar} 
        />
      </View>
    );
  };

  renderQuestion = () => {
    const { 
      questions, 
      currentQuestionIndex, 
      selectedAnswer, 
      isAnswerSubmitted,
      timeIsUp,
      hasReducedQuestions,
      difficulty
    } = this.state;
    const { theme } = this.props;
    
    if (questions.length === 0) {
      return (
        <Text style={[styles.noQuestionsText, { color: theme.colors.onBackground }]}>
          No questions available for this difficulty level.
        </Text>
      );
    }
    
    // Get expected question count
    let expectedQuestionCount = 10; // Default for Easy
    if (difficulty === QuizDifficulty.MEDIUM) {
      expectedQuestionCount = 15;
    } else if (difficulty === QuizDifficulty.HARD) {
      expectedQuestionCount = 20;
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const symbol = getSymbolById(currentQuestion.symbolId);
    
    if (!symbol) {
      return (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Symbol not found for this question.
        </Text>
      );
    }
    
    return (
      <View style={styles.questionContainer}>
        <Text style={[styles.questionCounter, { color: theme.colors.onSurfaceVariant }]}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        
        {hasReducedQuestions && (
          <Text style={[styles.warningText, { color: '#ffc107' /* Amber color for warning */ }]}>
            Only {questions.length} of {expectedQuestionCount} questions available for the selected filters.
          </Text>
        )}
        
        <View style={styles.symbolContainer}>
          <Image 
            source={{ uri: getAssetPath(symbol.image) }} 
            style={[styles.symbolImage, { backgroundColor: theme.colors.surface }]} 
            resizeMode="contain"
          />
        </View>
        
        {this.renderTimer()}
        
        <Text style={[styles.questionText, { color: theme.colors.onBackground }]}>
          {currentQuestion.question}
        </Text>
        
        <RadioButton.Group
          onValueChange={this.handleAnswerSelect}
          value={selectedAnswer || ''}
        >
          {currentQuestion.options.map((option: string, index: number) => (
            <View key={index} style={styles.optionContainer}>
              <RadioButton.Item
                label={option}
                value={option}
                disabled={isAnswerSubmitted || timeIsUp}
                status={
                  isAnswerSubmitted
                    ? option === currentQuestion.correctAnswer
                      ? 'checked'
                      : selectedAnswer === option
                        ? 'unchecked'
                        : 'unchecked'
                    : 'unchecked'
                }
                labelStyle={[
                  { color: theme.colors.onSurface },
                  isAnswerSubmitted
                    ? option === currentQuestion.correctAnswer
                      ? [styles.correctAnswer, { color: theme.colors.primary }]
                      : selectedAnswer === option
                        ? [styles.incorrectAnswer, { color: theme.colors.error }]
                        : {}
                    : {}
                ]}
                color={theme.colors.primary}
                uncheckedColor={theme.colors.onSurfaceVariant}
              />
            </View>
          ))}
        </RadioButton.Group>
        
        {isAnswerSubmitted && (
          <Card style={[styles.explanationCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Content>
              <Paragraph style={[styles.explanationText, { color: theme.colors.onSurfaceVariant }]}>
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
              icon="check"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={this.handleNextQuestion}
              style={styles.button}
              icon={currentQuestionIndex === questions.length - 1 ? "flag-checkered" : "arrow-right"}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          )}
        </View>
      </View>
    );
  };

  renderResults = () => {
    const { score, questions, difficulty, selectedTypes } = this.state;
    const { theme } = this.props;
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
    
    // Get question count based on difficulty
    let expectedQuestionCount = 10; // Default for Easy
    if (difficulty === QuizDifficulty.MEDIUM) {
      expectedQuestionCount = 15;
    } else if (difficulty === QuizDifficulty.HARD) {
      expectedQuestionCount = 20;
    }
    
    // Get time limit based on difficulty
    let timeLimit = 'Unlimited';
    if (difficulty === QuizDifficulty.MEDIUM) {
      timeLimit = '30 seconds per question';
    } else if (difficulty === QuizDifficulty.HARD) {
      timeLimit = '15 seconds per question';
    }
    
    return (
      <View style={styles.resultsContainer}>
        <Title style={[styles.resultsTitle, { color: theme.colors.onBackground }]}>Quiz Results</Title>
        
        <Card style={[styles.resultsCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.scoreText, { color: theme.colors.onBackground }]}>
              Your Score: {score} / {questions.length} ({percentage}%)
            </Text>
            
            <Text style={[styles.difficultyText, { color: theme.colors.onSurfaceVariant }]}>
              Difficulty: {difficulty}
            </Text>
            
            <Text style={[styles.quizInfoText, { color: theme.colors.onSurfaceVariant }]}>
              Questions: {questions.length} of {expectedQuestionCount} expected
            </Text>
            
            <Text style={[styles.quizInfoText, { color: theme.colors.onSurfaceVariant }]}>
              Time Limit: {timeLimit}
            </Text>
            
            {selectedTypes.length > 0 && (
              <Text style={[styles.quizInfoText, { color: theme.colors.onSurfaceVariant }]}>
                Symbol Types: {selectedTypes.map(t => t.replace(/_/g, ' ')).join(', ')}
              </Text>
            )}
            
            <Paragraph style={[styles.resultMessage, { color: theme.colors.onBackground }]}>
              {resultMessage}
            </Paragraph>
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={this.handleRestartQuiz}
            style={styles.button}
            icon="refresh"
          >
            New Quiz
          </Button>
          <Button
            mode="outlined"
            onPress={() => this.setState({ quizSetupComplete: false })}
            style={styles.button}
            icon="cog"
          >
            Change Settings
          </Button>
          <Button
            mode="outlined"
            onPress={() => this.props.navigation.navigate('SymbolLibrary')}
            style={[styles.button, styles.secondaryButton]}
            icon="book-open-variant"
          >
            Back to Symbol Library
          </Button>
        </View>
      </View>
    );
  };

  render() {
    const { loading, quizCompleted, quizSetupComplete, insufficientSymbolsError, availableSymbolCount, requiredSymbolCount } = this.state;
    const { theme } = this.props;
    
    if (loading) {
      return (
        <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} animating={true} />
          <Text style={[styles.loadingText, { color: theme.colors.onBackground }]}>Loading quiz questions...</Text>
        </View>
      );
    }
    
    if (insufficientSymbolsError) {
      return (
        <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Not enough symbols available to start the quiz. Available: {availableSymbolCount}, Required: {requiredSymbolCount}.
          </Text>
          <Button
            mode="contained"
            onPress={() => this.setState({ insufficientSymbolsError: false })}
            style={styles.button}
            icon="arrow-left"
          >
            Back to Settings
          </Button>
        </View>
      );
    }
    
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerContainer}>
          <Title style={[styles.header, { color: theme.colors.onBackground }]}>Symbol Quiz</Title>
          <Divider />
        </View>
        
        {!quizSetupComplete && (
          <View style={styles.setupContainer}>
            {this.renderDifficultySelector()}
            {this.renderTypeSelector()}
            
            <Button
              mode="contained"
              onPress={this.loadQuestions}
              style={styles.startButton}
              icon="play"
            >
              Start Quiz
            </Button>
          </View>
        )}
        
        {quizSetupComplete && (
          quizCompleted ? this.renderResults() : this.renderQuestion()
        )}
      </ScrollView>
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
  setupContainer: {
    padding: 16,
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
  typeFilterContainer: {
    padding: 16,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeScrollView: {
    marginBottom: 8,
  },
  typeScrollViewContent: {
    paddingRight: 16,
  },
  typeChipContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    flexWrap: 'wrap',
  },
  typeChip: {
    marginRight: 8,
    marginBottom: 8, // Add bottom margin to create spacing between lines
  },
  filterActionsContainer: {
    marginTop: 8,
  },
  clearButton: {
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    marginBottom: 8,
  },
  startButton: {
    marginTop: 16,
  },
  timerContainer: {
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  timerBar: {
    height: 6,
    borderRadius: 3,
  },
  questionContainer: {
    padding: 16,
  },
  questionCounter: {
    fontSize: 14,
    marginBottom: 16,
  },
  symbolContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  symbolImage: {
    width: 120,
    height: 120,
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
    fontWeight: 'bold',
  },
  incorrectAnswer: {
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
  resultsCard: {
    marginBottom: 16,
  },
  quizInfoText: {
    fontSize: 14,
    marginBottom: 8,
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
    textAlign: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  warningText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default withTheme(QuizScreen);
