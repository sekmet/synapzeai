import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Loads a sentiment lexicon from a text file.
 * Each line should be in the format: <score><whitespace><word>
 *
 * Example file content:
 *   0.984   loves
 *   0.984   inspirational
 *   0.969   amazing
 *   0.969   peaceful
 *
 * @param filePath - Path to the lexicon file.
 * @returns An object mapping words to their sentiment scores.
 */
function loadSentimentLexicon(filePath: string): { [word: string]: number } {
    const lexicon: { [word: string]: number } = {};
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue; // Skip empty lines
      // Split the line by whitespace; first token is score, second is word.
      const [scoreStr, word] = trimmedLine.split(/\s+/);
      if (scoreStr && word) {
        lexicon[word] = parseFloat(scoreStr);
      }
    }
    return lexicon;
  }

/**
 * Computes a Customer Satisfaction (CSAT) score on a 0–5 scale from a text message
 * using a Level 3 lexicon-based sentiment analysis approach.
 *
 * This function loads a sentiment lexicon from a file and then:
 * - Tokenizes the text (preserving punctuation).
 * - For each sentiment word, it looks back up to three tokens for negations and intensifiers.
 * - It checks if the sentiment word is immediately followed by an exclamation mark.
 * - The modified sentiment scores are averaged and then mapped to a CSAT score (0 = very negative, 5 = very positive).
 *
 * @param text - The text message to analyze.
 * @param lexiconFilePath - The path to the sentiment lexicon file.
 * @returns A CSAT score on a scale from 0 to 5.
 */
export function getCustomerSatisfactionScore(text: string): number {
    const lexiconDir = '/home/sekmet/DEVELOPMENT/HACKATHONS/GOLDENAI-HACK/MANTLE-AGENTS/eliza/packages/plugin-log/src/services';
    //path.join(process.cwd(), 'packages', 'plugin-log', 'src', 'services');
    const lexiconFilePath = `${lexiconDir}/lexicon.txt`;
    // Load the sentiment lexicon.
    const sentimentLexicon = loadSentimentLexicon(lexiconFilePath);

    // Define negation words and intensifiers.
    const negationWords = ['not', "n't", 'never', 'no'];
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

    // Tokenize the text: convert to lowercase and insert spaces around punctuation.
    const tokens = text
      .toLowerCase()
      .replace(/([.,!?;])/g, ' $1 ')
      .split(/\s+/)
      .filter(Boolean);

    let weightedSum = 0;
    let sentimentCount = 0;

    // Process each token.
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (sentimentLexicon.hasOwnProperty(token)) {
        const baseScore = sentimentLexicon[token];
        let multiplier = 1;

        // Look back over up to three preceding tokens for negations and intensifiers.
        for (let j = Math.max(0, i - 3); j < i; j++) {
          const prevToken = tokens[j];
          if (negationWords.includes(prevToken)) {
            multiplier *= -1; // Flip the sentiment polarity.
          }
          if (intensifiers.hasOwnProperty(prevToken)) {
            multiplier *= intensifiers[prevToken]; // Apply amplification or dampening.
          }
        }

        // Check if the sentiment word is immediately followed by an exclamation mark.
        if (i < tokens.length - 1 && tokens[i + 1] === '!') {
          multiplier *= 1.5;
        }

        // Compute the modified sentiment for this token.
        const modifiedScore = baseScore * multiplier;
        weightedSum += modifiedScore;
        sentimentCount++;
      }
    }

    // If no sentiment words are found, return a neutral CSAT score.
    if (sentimentCount === 0) {
      return 2.5;
    }

    // Average the sentiment scores.
    let averageSentiment = weightedSum / sentimentCount;

    // Clamp the average sentiment to the range [-1, 1].
    if (averageSentiment > 1) averageSentiment = 1;
    if (averageSentiment < -1) averageSentiment = -1;

    // Map the average sentiment (-1 to 1) to a CSAT score (0 to 5).
    // -1 maps to 0, 0 maps to 2.5, and 1 maps to 5.
    const csatScore = (averageSentiment + 1) * 2.5;

    // Return the score rounded to one decimal place.
    return Math.round(csatScore * 10) / 10;
  }
