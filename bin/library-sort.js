/**
	{
		"api": 1,
		"name": "Library Sort",
		"description": "Sort lines alphabetically while ignoring leading 'The' as sort key",
		"author": "Claude",
		"icon": "textformat.alt",
		"tags": "sort,alphabetical,the,lines"
	}
**/

function main(state) {
  const text = state.text;
  
  if (!text.trim()) {
    state.postError("No text to sort");
    return;
  }
  
  const lines = text.split('\n');
  
  // Sort lines, ignoring leading "The " for comparison
  const sortedLines = lines.sort((a, b) => {
    // Remove leading "The " (case insensitive) for sorting comparison
    const aNormalized = a.replace(/^the\s+/i, '');
    const bNormalized = b.replace(/^the\s+/i, '');
    
    return aNormalized.localeCompare(bNormalized, undefined, { 
      sensitivity: 'base',
      numeric: true 
    });
  });
  
  state.text = sortedLines.join('\n');
}
