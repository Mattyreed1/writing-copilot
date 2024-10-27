var AIService = {
  OVERALL_PROMPT: "You are a writing editor with 30 years of experience writing and editing written content. You write intriguing introductions that hook readers by providing clear value and peaking their interest. You use engaging language to spark curiosity, ensuring that the writing draws readers in from the start. Throughout the text, you maintain a focus on clarity and brevity, trimming excess words and sharpening arguments. Your writing is clear and approachable such that even an 8th grader can understand you.",

  getAISuggestions: function(text, writers, styles, operation) {
    var writersString = Array.isArray(writers) ? writers.join(', ') : writers;
    var stylesString = Array.isArray(styles) ? styles.join(', ') : styles;
    
    var prompt = '';
    switch(operation) {
      case 'edit':
        prompt = `Suggest specific edits for the following text in the style of ${writersString}, using ${stylesString} writing styles. Provide the edits and a brief explanation of why you suggest the changes:\n\n${text}`;
        break;
      case 'rewrite':
        prompt = `Rewrite the following text in the style of ${writersString}, maintaining ${stylesString} writing styles. Provide 3 different versions:\n\n${text}`;
        break;
      case 'continue':
        prompt = `Continue the following text in the style of ${writersString}, maintaining ${stylesString} writing styles. Add approximately 100 words:\n\n${text}`;
        break;
      default:
        return `Error: Invalid operation '${operation}'. Please use 'edit', 'rewrite', or 'continue'.`;
    }
  
    try {
      return this.callOpenAI(prompt);
    } catch (error) {
      Logger.log('Error in getAISuggestions: ' + error);
      return 'An error occurred while processing your request. Please try again.';
    }
  },

  callOpenAI: function(prompt, model = 'gpt-4', maxTokens = 500) {
    var url = 'https://api.openai.com/v1/chat/completions';
    
    var payload = {
      'model': model,
      'messages': [
        {'role': 'system', 'content': this.OVERALL_PROMPT},
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
      var statusCode = response.getResponseCode();
      var json = response.getContentText();
      
      if (statusCode !== 200) {
        throw new Error(`HTTP ${statusCode}: ${json}`);
      }
      
      var data = JSON.parse(json);
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No choices returned from OpenAI');
      }
      return data.choices[0].message.content.trim();
    } catch(error) {
      Logger.log('Error calling OpenAI API: ' + error);
      throw new Error('Failed to get a response from OpenAI. Please try again.');
    }
  },

  getOpenAIApiKey: function() {
    return PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
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
