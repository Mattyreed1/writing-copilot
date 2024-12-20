var AIService = {
  OVERALL_PROMPT: "You are a writing editor with 30 years of experience writing and editing written content. You write intriguing introductions that hook readers by providing clear value and peaking their interest. You use engaging language to spark curiosity, ensuring that the writing draws readers in from the start. Throughout the text, you maintain a focus on clarity and brevity, trimming excess words and sharpening arguments. Your writing is clear and approachable such that even an 8th grader can understand you. You do not like to make suggestions so you only make suggestions for edits if you are absolutely certain it will improve the quality of the writing.",

  getAISuggestions: function(text, writers, styles, operation) {
    var writersString = Array.isArray(writers) && writers.length > 0 ? writers.join(', ') : 'a professional writer';
    var stylesString = Array.isArray(styles) && styles.length > 0 ? styles.join(', ') : 'clear and concise';
    
    switch (operation) {
      case 'edit':
        return this.generateSpecificEdits(text, writers, styles);
      case 'rewrite':
        const rewritePrompt = `Rewrite the following text in the style of ${writersString}, maintaining ${stylesString} writing styles. Provide exactly 3 different versions, each separated by "---":\n\n${text}`;
        const rewriteResponse = this.callOpenAI(rewritePrompt);
        return rewriteResponse.split('---').map(item => item.trim());
      case 'continue':
        const continuePrompt = `Continue the following text in the style of ${writersString}, maintaining ${stylesString} writing styles:\n\n${text}`;
        return this.callOpenAI(continuePrompt);
      default:
        throw new Error('Invalid operation.');
    }
  },

  generateSpecificEdits: function(text, writers, styles) {
    const fullContext = this.getDocumentContext();
    
    Logger.log('Starting generateSpecificEdits');
    
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
    
    IMPORTANT: Respond with ONLY the raw JSON data, without any markdown formatting or code blocks. Use this exact structure:
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
      Logger.log('Calling OpenAI API');
      const response = this.callOpenAI(prompt);
      Logger.log('OpenAI API call complete');
      
      Logger.log('Parsing response');
      // Remove any potential markdown code block syntax
      const cleanResponse = response.content.replace(/```json\n?|\n?```/g, '').trim();
      const parsedResponse = JSON.parse(cleanResponse);
      Logger.log('Response parsed successfully');
      
      return {
        edits: parsedResponse.edits,
        metadata: response.metadata
      };
    } catch (error) {
      Logger.log('Error generating specific edits: ' + error);
      throw new Error('Failed to generate edit suggestions');
    }
  },

  callOpenAI: function(prompt, model = 'gpt-3.5-turbo', maxTokens = 500) {
    const startTime = new Date();
    
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
      'method': 'post',
      'contentType': 'application/json',
      'headers': {
        'Authorization': 'Bearer ' + this.getOpenAIApiKey()
      },
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true,
      'timeout': 30000 // 30 seconds timeout
    };
    
    Logger.log('Starting OpenAI API call at ' + startTime);

    try {
      const apiStartTime = new Date();
      var response = UrlFetchApp.fetch(url, options);
      const apiEndTime = new Date();
      const apiDuration = (apiEndTime - apiStartTime) / 1000; // in seconds
      Logger.log('API call duration: ' + apiDuration + ' seconds');

      var data = JSON.parse(response.getContentText());
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenAI.');
      }
      
      // Calculate metadata
      const endTime = new Date();
      const totalDuration = (endTime - startTime) / 1000; // in seconds
      const promptTokens = data.usage.prompt_tokens;
      const completionTokens = data.usage.completion_tokens;
      const totalTokens = data.usage.total_tokens;
      // GPT-4 pricing: $0.03/1K prompt tokens, $0.06/1K completion tokens
      const cost = ((promptTokens * 0.03) + (completionTokens * 0.06)) / 1000;
      
      Logger.log('Total call duration: ' + totalDuration + ' seconds');
      
      return {
        content: data.choices[0].message.content.trim(),
        metadata: {
          model: model,
          duration: totalDuration.toFixed(2),
          apiDuration: apiDuration.toFixed(2),
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
