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
  Icon
} from 'react-native-paper';
import { QuizDifficulty } from '../data/quizQuestions';
import { 
  getSymbolById, 
  generateQuizQuestions, 
  getAllSymbolTypes,
  shuffleArray
} from '../utils/assetUtils';

interface Symbol {
  id: string;
  ref: string;
  name: string;
  column: string;
  type: string;
  image: string;
  description?: string;
  complexity?: number;
}

interface QuizQuestion {
  id: string;
  symbolId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: number | QuizDifficulty;
  explanation?: string;
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
  selectedTypes: string[];
  quizSetupComplete: boolean;
  timeRemaining: number | null;
  timerInterval: NodeJS.Timeout | null;
  timeIsUp: boolean;
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
      loading: true,
      selectedTypes: [],
      quizSetupComplete: false,
      timeRemaining: null,
      timerInterval: null,
      timeIsUp: false
    };
  }

  componentDidMount() {
    // Just set loading to false, don't load questions yet
    this.setState({ loading: false });
  }

  loadQuestions = () => {
    const { difficulty, selectedTypes } = this.state;
    
    // Convert difficulty enum to number
    let difficultyNumber = 1; // Default to Easy
    if (difficulty === QuizDifficulty.MEDIUM) {
      difficultyNumber = 2;
    } else if (difficulty === QuizDifficulty.HARD) {
      difficultyNumber = 3;
    }
    
    // Generate questions based on difficulty and selected types
    const questions = generateQuizQuestions(difficultyNumber, selectedTypes);
    
    this.setState({
      questions,
      loading: false,
      quizSetupComplete: true
    }, () => {
      // Start timer if needed
      this.startTimer();
    });
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
  
  handleTimeUp = () => {
    // Clear interval
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
    
    // Mark question as incorrect and show correct answer
    this.setState({
      isAnswerSubmitted: true,
      timeIsUp: true
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
    const { currentQuestionIndex, questions, timerInterval } = this.state;
    const nextIndex = currentQuestionIndex + 1;
    
    // Clear current timer if exists
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    if (nextIndex < questions.length) {
      this.setState({
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        isAnswerSubmitted: false,
        timeIsUp: false,
        timerInterval: null
      }, () => {
        // Start new timer for next question
        this.startTimer();
      });
    } else {
      this.setState({ 
        quizCompleted: true,
        timerInterval: null
      });
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
    const allTypes = getAllSymbolTypes();
    
    return (
      <View style={styles.typeFilterContainer}>
        <Text style={styles.filterLabel}>Filter by symbol types:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScrollView}>
          <View style={styles.typeChipContainer}>
            {allTypes.map((type: string) => (
              <Chip
                key={type}
                selected={selectedTypes.includes(type)}
                onPress={() => this.toggleTypeSelection(type)}
                style={styles.typeChip}
                selectedColor="#0066CC"
              >
                {type.replace(/_/g, ' ')}
              </Chip>
            ))}
          </View>
        </ScrollView>
        
        <View style={styles.filterActionsContainer}>
          <Button
            mode="outlined"
            onPress={this.clearTypeSelection}
            style={styles.clearButton}
            icon="close-circle-outline"
          >
            Clear Selection
          </Button>
          
          <Text style={styles.helperText}>
            {selectedTypes.length === 0 
              ? "All symbol types will be included" 
              : `${selectedTypes.length} symbol type${selectedTypes.length === 1 ? '' : 's'} selected`}
          </Text>
        </View>
      </View>
    );
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
  
  renderTimer = () => {
    const { timeRemaining, difficulty } = this.state;
    
    if (difficulty === QuizDifficulty.EASY || timeRemaining === null) {
      return null;
    }
    
    // Calculate color based on time remaining
    const dangerThreshold = difficulty === QuizDifficulty.MEDIUM ? 7 : 5;
    const warningThreshold = difficulty === QuizDifficulty.MEDIUM ? 15 : 7;
    
    let timerColor = '#28a745'; // Green
    if (timeRemaining <= dangerThreshold) {
      timerColor = '#dc3545'; // Red
    } else if (timeRemaining <= warningThreshold) {
      timerColor = '#ffc107'; // Yellow
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
      timeIsUp
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
        
        {this.renderTimer()}
        
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        
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
      timeLimit = '60 seconds per question';
    } else if (difficulty === QuizDifficulty.HARD) {
      timeLimit = '20 seconds per question';
    }
    
    return (
      <View style={styles.resultsContainer}>
        <Title style={styles.resultsTitle}>Quiz Results</Title>
        
        <Card style={styles.resultsCard}>
          <Card.Content>
            <Text style={styles.scoreText}>
              Your Score: {score} / {questions.length} ({percentage}%)
            </Text>
            
            <Text style={styles.difficultyText}>Difficulty: {difficulty}</Text>
            
            <Text style={styles.quizInfoText}>
              Questions: {questions.length} of {expectedQuestionCount} expected
            </Text>
            
            <Text style={styles.quizInfoText}>
              Time Limit: {timeLimit}
            </Text>
            
            {selectedTypes.length > 0 && (
              <Text style={styles.quizInfoText}>
                Symbol Types: {selectedTypes.map(t => t.replace(/_/g, ' ')).join(', ')}
              </Text>
            )}
            
            <Paragraph style={styles.resultMessage}>{resultMessage}</Paragraph>
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
    const { loading, quizCompleted, quizSetupComplete } = this.state;
    
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
        
        {!quizSetupComplete && (
          <View style={styles.setupContainer}>
            {this.renderDifficultySelector()}
            {this.renderTypeSelector()}
            
            <Button
              mode="contained"
              onPress={this.loadQuestions}
              style={styles.startButton}
              icon="play-circle"
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
  selectedChip: {
    backgroundColor: '#0066CC',
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
  typeChipContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  typeChip: {
    marginRight: 8,
  },
  filterActionsContainer: {
    marginTop: 8,
  },
  clearButton: {
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
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
