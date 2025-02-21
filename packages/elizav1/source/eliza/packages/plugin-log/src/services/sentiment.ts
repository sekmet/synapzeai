import * as fs from 'fs';
import * as path from 'node:path';

/**
 * Loads a sentiment lexicon from a text file.
 * Each line in the file should be in the format: <score><whitespace><word>
 *
 * @param filePath - The path to the lexicon file.
 * @returns An object mapping words to their sentiment scores.
 */
function loadSentimentLexicon(filePath: string): { [word: string]: number } {
  const data = fs.readFileSync(filePath, 'utf8');
  const lexicon: { [word: string]: number } = {};
  const lines = data.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue; // skip empty lines
    // Split the line by whitespace. The first part is the score, the second the word.
    const [scoreStr, word] = trimmedLine.split(/\s+/);
    lexicon[word] = parseFloat(scoreStr);
  }
  return lexicon;
}

/**
 * Analyzes the sentiment of a given text using a lexicon loaded from a file.
 * This function uses a weighted lexicon, checks for negations, intensifiers,
 * and punctuation-based emphasis to compute a sentiment score.
 *
 * @param text - The text to analyze.
 * @param lexiconFilePath - The file path to the sentiment lexicon.
 * @returns The overall sentiment: 'positive', 'neutral', or 'negative'.
 */
export function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const lexiconDir = '/home/sekmet/DEVELOPMENT/HACKATHONS/GOLDENAI-HACK/MANTLE-AGENTS/eliza/packages/plugin-log/src/services';
  //path.join(process.cwd(), 'packages', 'plugin-log', 'src', 'services');
  const lexiconFilePath = `${lexiconDir}/lexicon.txt`;
  // Load the sentiment lexicon from the provided file.
  const sentimentLexicon = loadSentimentLexicon(lexiconFilePath);

  // Negation words that reverse sentiment polarity.
  const negationWords = ['not', "n't", 'never', 'no'];

  // Intensifiers that amplify (or sometimes dampen) sentiment.
  const intensifiers: { [word: string]: number } = {
    'very': 1.5,
    'extremely': 2.0,
    'absolutely': 2.0,
    'really': 1.2,
    'so': 1.3,
    'quite': 1.2,
    'somewhat': 0.8,
    'slightly': 0.8,
  };

  // Tokenize the text while preserving punctuation that might influence sentiment.
  const tokens = text
    .toLowerCase()
    .replace(/([.,!?;])/g, ' $1 ')
    .split(/\s+/)
    .filter(Boolean);

  let score = 0;

  // Process each token.
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (sentimentLexicon.hasOwnProperty(token)) {
      let wordScore = sentimentLexicon[token];
      let multiplier = 1;

      // Look back over the previous three tokens for negations and intensifiers.
      for (let j = Math.max(0, i - 3); j < i; j++) {
        const prevToken = tokens[j];
        if (negationWords.includes(prevToken)) {
          multiplier *= -1;
        }
        if (intensifiers.hasOwnProperty(prevToken)) {
          multiplier *= intensifiers[prevToken];
        }
      }

      // Check if the word is immediately followed by an exclamation mark.
      if (i < tokens.length - 1 && tokens[i + 1] === '!') {
        multiplier *= 1.5;
      }

      score += wordScore * multiplier;
    }
  }

  // Define thresholds for sentiment classification.
  if (score > 0.5) {
    return 'positive';
  } else if (score < -0.5) {
    return 'negative';
  } else {
    return 'neutral';
  }
}
