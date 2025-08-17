const textarea = document.getElementById('textarea');
const lineNumbersEle = document.getElementById('line-numbers');

const displayLineNumbers = () => {
    const lineNumbers = calculateLineNumbers();
    lineNumbersEle.innerHTML = Array.from({
        length: lineNumbers.length
    }, (_, i) => `<div>${lineNumbers[i] || '&nbsp;'}</div>`).join('');
};

const textareaStyles = window.getComputedStyle(textarea);
[
    'fontFamily',
    'fontSize',
    'fontWeight',
    'letterSpacing',
    'lineHeight',
    'padding',
].forEach((property) => {
    lineNumbersEle.style[property] = textareaStyles[property];
});

const calculateNumLines = (str) => {
};

const calculateLineNumbers = () => {
    const lines = textarea.value.split('\n');
    const numLines = lines.map((line) => calculateNumLines(line));

    let lineNumbers = [];
    let i = 1;
    while (numLines.length > 0) {
        const numLinesOfSentence = numLines.shift();
        lineNumbers.push(i);
        if (numLinesOfSentence > 1) {
            Array(numLinesOfSentence - 1)
                .fill('')
                .forEach((_) => lineNumbers.push(''));
        }
        i++;
    }

    return lineNumbers;
};

textarea.addEventListener('scroll', () => {
    lineNumbersEle.scrollTop = textarea.scrollTop;
});

textarea.addEventListener('input', () => {
    displayLineNumbers();
});

const ro = new ResizeObserver(() => {
    const rect = textarea.getBoundingClientRect();
    lineNumbersEle.style.height = `${rect.height}px`;
    displayLineNumbers();
});
ro.observe(textarea);

function openHTMLFile(file_path) {
	window.location.href = file_path;
}

// updateEditor();
displayLineNumbers();