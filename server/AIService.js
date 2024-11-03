var AIService = {
  OVERALL_PROMPT: "You are a writing editor with 30 years of experience writing and editing written content. You write intriguing introductions that hook readers by providing clear value and peaking their interest. You use engaging language to spark curiosity, ensuring that the writing draws readers in from the start. Throughout the text, you maintain a focus on clarity and brevity, trimming excess words and sharpening arguments. Your writing is clear and approachable such that even an 8th grader can understand you. You do not like to make suggestions so you only make suggestions for edits if you are absolutely certain it will improve the quality of the writing.",

  getAISuggestions: function(text, writers, styles, operation) {
    if (operation === 'edit') {
      return this.generateSpecificEdits(text, writers, styles);
    }
    var OVERALL_PROMPT = "You are a writing editor with 30 years of experience writing and editing content.";
    var writersString = Array.isArray(writers) && writers.length > 0 ? writers.join(', ') : 'a professional writer';
    var stylesString = Array.isArray(styles) && styles.length > 0 ? styles.join(', ') : 'clear and concise';
    
    var prompt = '';
    switch (operation) {
      case 'edit':
        prompt = `Edit the following text in the style of ${writersString}, using ${stylesString} writing styles:\n\n${text}`;
        break;
      case 'rewrite':
        prompt = `Rewrite the following text in the style of ${writersString}, maintaining ${stylesString} writing styles. Provide exactly 3 different versions, each separated by "---":\n\n${text}`;
        break;
      case 'continue':
        prompt = `Continue the following text in the style of ${writersString}, maintaining ${stylesString} writing styles:\n\n${text}`;
        break;
      default:
        throw new Error('Invalid operation.');
    }

    var response = callOpenAI(prompt);
    
    if (operation === 'rewrite') {
      return response.split('---').map(function(item) {
        return item.trim();
      });
    } else {
      return response;
    }
  },

  generateSpecificEdits: function(text, writers, styles) {
    const fullContext = this.getDocumentContext();
    
    const prompt = `As a writing assistant, analyze the following text and suggest specific, targeted improvements. 
    Focus on individual words, phrases, or sentences that could be enhanced.
    For each suggestion, provide:
    1. The original text segment
    2. The suggested improvement
    3. A brief explanation of why this change improves the writing
    
    Full Document Context:
    "${fullContext}"
    
    Writing style preferences: ${styles.join(', ')}
    Writer influences: ${writers.join(', ')}
    
    Text to analyze: "${text}"
    
    Format your response as JSON with this structure:
    {
      "edits": [
        {
          "original": "text segment",
          "suggestion": "improved version",
          "explanation": "brief reason for change"
        }
      ]
    }`;

    try {
      const response = this.callOpenAI(prompt);
      const parsedResponse = JSON.parse(response.content);
      return {
        edits: parsedResponse.edits,
        metadata: response.metadata
      };
    } catch (error) {
      Logger.log('Error generating specific edits: ' + error);
      throw new Error('Failed to generate edit suggestions');
    }
  },

  callOpenAI: function(prompt, model = 'gpt-4', maxTokens = 500) {
    const startTime = new Date();
    
    var url = 'https://api.openai.com/v1/chat/completions';
    
    var payload = {
      'model': model,
      'messages': [
        {'role': 'system', 'content': 'You are a helpful assistant.'},
        {'role': 'user', 'content': prompt}
      ],
      'max_tokens': maxTokens
    };
    
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      'headers': {
        'Authorization': 'Bearer ' + this.getOpenAIApiKey()
      },
      'payload' : JSON.stringify(payload),
      'muteHttpExceptions': true,
      'timeout': 30000 // 30 seconds timeout
    };
    
    try {
      var response = UrlFetchApp.fetch(url, options);
      var data = JSON.parse(response.getContentText());
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenAI.');
      }
      
      // Calculate metadata
      const endTime = new Date();
      const duration = (endTime - startTime) / 1000; // in seconds
      const promptTokens = data.usage.prompt_tokens;
      const completionTokens = data.usage.completion_tokens;
      const totalTokens = data.usage.total_tokens;
      // GPT-4 pricing: $0.03/1K prompt tokens, $0.06/1K completion tokens
      const cost = ((promptTokens * 0.03) + (completionTokens * 0.06)) / 1000;
      
      return {
        content: data.choices[0].message.content.trim(),
        metadata: {
          model: model,
          duration: duration.toFixed(2),
          promptTokens,
          completionTokens,
          totalTokens,
          cost: cost.toFixed(4)
        }
      };
    } catch (error) {
      Logger.log('Error calling OpenAI API: ' + error);
      throw new Error('Failed to get a response from OpenAI. Please try again.');
    }
  },

  getOpenAIApiKey: function() {
    return PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  },

  getDocumentContext: function() {
    try {
      const doc = DocumentApp.getActiveDocument();
      const body = doc.getBody();
      const fullText = body.getText();
      
      // If text is very long, truncate to ~8000 characters
      if (fullText.length > 8000) {
        const midPoint = Math.floor(fullText.length / 2);
        const start = midPoint - 4000;
        const end = midPoint + 4000;
        return fullText.substring(start, end);
      }
      
      return fullText;
    } catch (error) {
      Logger.log('Error getting document context: ' + error);
      return '';
    }
  }

  // ... other AI-related methods ...
};

// Expose functions globally
function getAISuggestions(text, writers, styles, operation) {
  return AIService.getAISuggestions(text, writers, styles, operation);
}

function callOpenAI(prompt, model, maxTokens) {
  return AIService.callOpenAI(prompt, model, maxTokens);
}

function getOpenAIApiKey() {
  return AIService.getOpenAIApiKey();
}
