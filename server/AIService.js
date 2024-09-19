const OVERALL_PROMPT = "You are a writing editor with 30 years of experience writing and editing written content. You write intriguing introductions that hook readers by providing clear value and peaking their interest. You use engaging language to spark curiosity, ensuring that the writing draws readers in from the start. Throughout the text, you maintain a focus on clarity and brevity, trimming excess words and sharpening arguments. Your writing is clear and approachable such that even an 8th grader can understand you.";

function getAISuggestions(text, writers, styles, operation) {
  var writersString = writers.join(', ');
  var stylesString = styles.join(', ');
  
  var prompt = '';
  switch(operation) {
    case 'edit':
      prompt = `Edit the following text in the style of ${writersString}, using ${stylesString} writing styles. Provide the edited version and a brief explanation of the changes:\n\n${text}`;
      break;
    case 'rewrite':
      prompt = `Rewrite the following text in the style of ${writersString}, maintaining ${stylesString} writing styles. Provide 3 different versions:\n\n${text}`;
      break;
    case 'continue':
      prompt = `Continue the following text in the style of ${writersString}, maintaining ${stylesString} writing styles. Add approximately 100 words:\n\n${text}`;
      break;
    default:
      return 'Invalid operation';
  }

  return callOpenAI(prompt);
}

// Store your API key securely. In a real-world scenario, use PropertiesService or other secure methods.
function getOpenAIApiKey() {
  return PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
}

function callOpenAI(prompt, model = 'gpt-4', maxTokens = 150) {
  var url = 'https://api.openai.com/v1/chat/completions';
  
  var payload = {
    'model': model,
    'messages': [
      {'role': 'system', 'content': OVERALL_PROMPT},
      {'role': 'user', 'content': prompt}
    ],
    'max_tokens': maxTokens
  };
  
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + getOpenAIApiKey()
    },
    'payload' : JSON.stringify(payload)
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = response.getContentText();
    var data = JSON.parse(json);
    return data.choices[0].message.content.trim();
  } catch(error) {
    Logger.log('Error calling OpenAI API: ' + error);
    return null;
  }
}

// ... other AI-related functions

function getSelectedText() {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  if (selection) {
    var elements = selection.getSelectedElements();
    return elements.map(e => e.getElement().asText().getText()).join('\n');
  }
  return '';
}
