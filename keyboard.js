// keyboard.js - Modified for sale.html with original a3.js integration
// FIXED: Number input now overwrites instead of appending
document.addEventListener('DOMContentLoaded', function() {
    console.log('keyboard.js - ORIGINAL STYLE WITH A3.JS INTEGRATION (FIXED OVERWRITE)');
    
    // DOM Elements from sale.html
    const editNum1 = document.getElementById('editNum1');
    const editNum2 = document.getElementById('editNum2');
    const editNum3 = document.getElementById('editNum3');
    const textview = document.getElementById('textview');
    const buttonsScrollContainer = document.getElementById('buttonsScrollContainer');
    const checkboxButtons = document.querySelectorAll('.checkbox-btn');
    const cptBtn = document.getElementById('cptBtn');
    const originalEditArea = document.getElementById('originalEditArea');
    const betList = document.getElementById('betList');
    const listView = document.querySelector('.list-view');
    
    // State variables (same as original keyboard.js)
    let reverseMode = false;
    let isSpecialMode = false;
    let specialType = '';
    let isComboMode = false;
    let comboType = '';
    let selectedTypes = new Set();
    
    // Special cases definitions (same as original keyboard.js)
    const specialCases = {
        'အပူး': [0, 11, 22, 33, 44, 55, 66, 77, 88, 99],
        'ပါဝါ': [5, 16, 27, 38, 49, 50, 61, 72, 83, 94],
        'နက္ခ': [7, 18, 24, 35, 42, 53, 69, 70, 81, 96],
        'ညီကို': [1, 12, 23, 34, 45, 56, 67, 78, 89, 90],
        'ကိုညီ': [9, 10, 21, 32, 43, 54, 65, 76, 87, 98],
        'ညီကိုR': [1, 12, 23, 34, 45, 56, 67, 78, 89, 90, 9, 10, 21, 32, 43, 54, 65, 76, 87, 98],
        'စုံစုံ': [0, 2, 4, 6, 8, 20, 22, 24, 26, 28, 40, 42, 44, 46, 48, 60, 62, 64, 66, 68, 80, 82, 84, 86, 88],
        'မမ': [11, 13, 15, 17, 19, 31, 33, 35, 37, 39, 51, 53, 55, 57, 59, 71, 73, 75, 77, 79, 91, 93, 95, 97, 99],
        'စုံမ': [1, 3, 5, 7, 9, 21, 23, 25, 27, 29, 41, 43, 45, 47, 49, 61, 63, 65, 67, 69, 81, 83, 85, 87, 89],
        'မစုံ': [10, 12, 14, 16, 18, 30, 32, 34, 36, 38, 50, 52, 54, 56, 58, 70, 72, 74, 76, 78, 90, 92, 94, 96, 98],
        'စုံပူး': [0, 22, 44, 66, 88],
        'မပူး': [11, 33, 55, 77, 99]
    };
    
    // Initialize
    setupEventListeners();
    resetFields();
    
    function resetFields() {
        editNum1.value = '';
        editNum2.value = '';
        editNum3.value = '';
        editNum3.style.display = 'none';
        textview.textContent = '-';
        
        reverseMode = false;
        isSpecialMode = false;
        specialType = '';
        isComboMode = false;
        comboType = '';
        selectedTypes.clear();
        
        // Reset checkbox buttons
        checkboxButtons.forEach(btn => {
            btn.classList.remove('checked');
        });
        
        // Reset textview styling
        textview.style.borderColor = '#3498db';
        textview.style.backgroundColor = 'white';
        
        // Set focus to first field
        editNum1.focus();
        editNum1.select();
    }
    
    function updateTextView() {
        if (selectedTypes.size === 0) {
            textview.textContent = '-';
            textview.style.borderColor = '#3498db';
            textview.style.backgroundColor = 'white';
        } else {
            const typesArray = Array.from(selectedTypes);
            textview.textContent = typesArray.join('/');
            textview.style.borderColor = '#2ecc71';
            textview.style.backgroundColor = '#e8f8f5';
        }
    }
    
    function setupEventListeners() {
        // Input field events - FIXED: Auto select on focus
        editNum1.addEventListener('focus', () => {
            editNum1.select();
            // Ensure only numbers can be entered
            editNum1.setAttribute('inputmode', 'numeric');
        });
        editNum2.addEventListener('focus', () => {
            editNum2.select();
            editNum2.setAttribute('inputmode', 'numeric');
        });
        editNum3.addEventListener('focus', () => {
            editNum3.select();
            editNum3.setAttribute('inputmode', 'numeric');
        });
        
        // Prevent non-numeric input in all input fields
        editNum1.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        editNum2.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        editNum3.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        // Checkbox buttons
        checkboxButtons.forEach(button => {
            button.addEventListener('click', function() {
                handleCheckboxButton(this);
            });
        });
        
        // CPT button toggle
        cptBtn.addEventListener('click', function() {
            const inputFrame = document.getElementById('inputFrame');
            
            if (buttonsScrollContainer.style.display === 'none' || buttonsScrollContainer.style.display === '') {
                // Switch to keyboard view
                cptBtn.textContent = 'CopyPate';
                inputFrame.style.display = 'block';
                buttonsScrollContainer.style.display = 'block';
                originalEditArea.style.display = 'none';
                editNum1.focus();
                editNum1.select();
            } else {
                // Switch to textarea view
                cptBtn.textContent = 'Keyboard';
                inputFrame.style.display = 'none';
                buttonsScrollContainer.style.display = 'none';
                originalEditArea.style.display = 'flex';
            }
        });
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', handleGlobalKeyboard);
    }
    
    function handleGlobalKeyboard(e) {
        // Enter key processing - ORIGINAL LOGIC
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEnterKey();
            return;
        }
        
        // Slash (/) key for R mode
        if (e.key === '/' && (document.activeElement === editNum2 || document.activeElement === editNum3)) {
            e.preventDefault();
            handleSlashKey();
            return;
        }
        
        // Backspace for delete when focus is on textview
        if (e.key === 'Backspace' && document.activeElement === textview) {
            e.preventDefault();
            handleDelete();
            return;
        }
        
        // Function keys for special types
        const functionKeys = {
            'F9': 'ထိပ်',
            'F8': 'ပိတ်',
            'F6': 'အပါ',
            'F7': 'အပူး',
            'F12': 'ဘရိတ်',
            'F11': 'ပါဝါ',
            'F10': 'နက္ခ'
        };
        
        if (functionKeys[e.key]) {
            e.preventDefault();
            handleFunctionKey(functionKeys[e.key]);
            return;
        }
        
        // Number input handling - FIXED: Overwrites instead of appends
        if (e.key.length === 1 && /[0-9]/.test(e.key)) {
            e.preventDefault(); // Prevent default to avoid double input
            handleNumberInput(e.key);
            return;
        }
        
        // Backspace handling for input fields
        if (e.key === 'Backspace' && 
            (document.activeElement === editNum1 || 
             document.activeElement === editNum2 || 
             document.activeElement === editNum3)) {
            e.preventDefault();
            handleBackspaceInInput();
            return;
        }
    }
    
 // FIXED FUNCTION: Number input with manual Enter to move
function handleNumberInput(digit) {
    const activeElement = document.activeElement;
    
    if (activeElement === editNum1) {
        const maxLength = getMaxLengthForField(editNum1);
        const currentValue = editNum1.value;
        
        // Check current field type and length
        if (currentValue.length === 0) {
            // First digit
            editNum1.value = digit;
        } else if (currentValue.length === 1) {
            // Second digit - append
            editNum1.value = currentValue + digit;
            // NO AUTO MOVE - wait for Enter
        } else if (currentValue.length >= 2) {
            // Already has 2+ digits - overwrite with first digit
            editNum1.value = digit;
        }
    } 
    else if (activeElement === editNum2) {
        // Amount field - append digits (no limit)
        editNum2.value += digit;
    }
    else if (activeElement === editNum3) {
        // Reverse amount field - append digits (no limit)
        editNum3.value += digit;
    }
}
    
    function handleBackspaceInInput() {
        const activeElement = document.activeElement;
        
        if (activeElement === editNum1) {
            editNum1.value = '';
            editNum1.select();
        } 
        else if (activeElement === editNum2) {
            editNum2.value = '';
            editNum2.select();
        }
        else if (activeElement === editNum3) {
            editNum3.value = '';
            editNum3.select();
        }
    }
    
    function getMaxLengthForField(field) {
        if (field === editNum1) {
            if (selectedTypes.has('အခွေ') || selectedTypes.has('ခွေပူး')) {
                return 10; // For combo modes
            } else if (selectedTypes.has('အပါ') || selectedTypes.has('ထိပ်') || 
                      selectedTypes.has('ပိတ်') || selectedTypes.has('ဘရိတ်')) {
                return 1; // For 1-digit special types
            } else {
                return 2; // Regular 2-digit numbers
            }
        }
        return 7; // For amount fields
    }
    
    function handleFunctionKey(type) {
        // Clear all selections first
        selectedTypes.clear();
        checkboxButtons.forEach(btn => {
            btn.classList.remove('checked');
        });
        
        // Add the selected type
        selectedTypes.add(type);
        const button = document.querySelector(`[data-type="${type}"]`);
        if (button) {
            button.classList.add('checked');
        }
        
        updateTextView();
        
        // Set focus based on type
        const needsDigit = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်'].includes(type);
        if (needsDigit) {
            editNum1.focus();
            editNum1.select();
        } else {
            editNum2.focus();
            editNum2.select();
        }
    }
    
    function handleSlashKey() {
        // Check if R is allowed
        if (selectedTypes.size > 0 && !selectedTypes.has('R')) {
            const allowedWithR = ['ထိပ်', 'ပိတ်'];
            const hasAllowedType = Array.from(selectedTypes).some(type => allowedWithR.includes(type));
            
            if (!hasAllowedType) {
                alert('R ကို ထိပ်နှင့် ပိတ်နှင့်သာ အသုံးပြုနိုင်ပါသည်');
                return;
            }
        }
        
        // Toggle R mode
        if (!selectedTypes.has('R')) {
            selectedTypes.add('R');
            const rButton = document.querySelector('[data-type="R"]');
            if (rButton) {
                rButton.classList.add('checked');
            }
            updateTextView();
        }
        
        // Show reverse amount field
        editNum3.style.display = 'block';
        reverseMode = true;
        editNum3.focus();
        editNum3.select();
    }
    
    function handleCheckboxButton(button) {
        const type = button.getAttribute('data-type');
        
        // Toggle selection
        if (button.classList.contains('checked')) {
            button.classList.remove('checked');
            selectedTypes.delete(type);
            
            // If R was unchecked, hide reverse field
            if (type === 'R') {
                editNum3.style.display = 'none';
                reverseMode = false;
                editNum3.value = '';
            }
        } else {
            // If it's R, remove other R-related types
            if (type === 'R') {
                ['R', 'ညီကိုR', 'စုံကပ်R', 'မကပ်R'].forEach(t => {
                    if (selectedTypes.has(t)) {
                        selectedTypes.delete(t);
                        document.querySelector(`[data-type="${t}"]`)?.classList.remove('checked');
                    }
                });
                
                // Show reverse field
                editNum3.style.display = 'block';
                reverseMode = true;
            }
            
            button.classList.add('checked');
            selectedTypes.add(type);
        }
        
        updateTextView();
        
        // Auto-set focus based on selection
        if (type === 'R') {
            editNum3.focus();
            editNum3.select();
        } else if (needsDigitInputForType(type)) {
            editNum1.focus();
            editNum1.select();
        } else {
            editNum2.focus();
            editNum2.select();
        }
    }
    
    function handleDelete() {
        // Clear selected types
        selectedTypes.clear();
        checkboxButtons.forEach(btn => {
            btn.classList.remove('checked');
        });
        updateTextView();
        editNum3.style.display = 'none';
        reverseMode = false;
        editNum3.value = '';
        editNum1.focus();
        editNum1.select();
    }
    
    function handleEnterKey() {
        const activeElement = document.activeElement;
        
        if (activeElement === editNum1) {
            // Move to amount field if number is entered
            if (editNum1.value.length > 0) {
                editNum2.focus();
                editNum2.select();
            }
        } 
        else if (activeElement === editNum2) {
            // Check if we should process or move to reverse
            if (reverseMode && editNum3.style.display !== 'none') {
                editNum3.focus();
                editNum3.select();
            } else {
                // Process the bet
                processOKButton();
            }
        }
        else if (activeElement === editNum3) {
            // Process the bet
            processOKButton();
        }
    }
    
    function processOKButton() {
        // Validate inputs
        if (!validateInputs()) {
            return;
        }
        
        // Get amount (multiply by 100 for unit) - ORIGINAL LOGIC
        const unitAmount = parseInt(editNum2.value);
        const amount = unitAmount * 100;
        
        // Get reverse amount if exists
        let reverseAmount = amount;
        if (reverseMode && editNum3.value) {
            const reverseUnit = parseInt(editNum3.value);
            reverseAmount = reverseUnit * 100;
        }
        
        // Process based on selected types
        if (selectedTypes.has('အခွေ') || selectedTypes.has('ခွေပူး')) {
            processComboMode(amount);
        } else if (hasSpecialTypeWithoutDigit()) {
            processSpecialModeNoDigit(amount);
        } else if (hasSpecialTypeWithDigit()) {
            processSpecialModeWithDigit(amount, reverseAmount);
        } else {
            processRegularBet(amount, reverseAmount);
        }
        
        // Reset and focus on first field
        resetFields();
        autoScrollToListView();
    }
    
    function validateInputs() {
        // Check number field
        if (editNum1.value === '') {
            if (needsDigitInput()) {
                alert('ဂဏန်းထည့်ပါ');
                editNum1.focus();
                editNum1.select();
                return false;
            }
        } else {
            const num = parseInt(editNum1.value);
            if (isNaN(num)) {
                alert('ဂဏန်းမှားယွင်းနေပါသည်');
                editNum1.focus();
                editNum1.select();
                return false;
            }
        }
        
        // Check amount field
        if (editNum2.value === '') {
            alert('ယူနစ်ထည့်ပါ');
            editNum2.focus();
            editNum2.select();
            return false;
        }
        
        const unit = parseInt(editNum2.value);
        if (isNaN(unit) || unit < 1) {
            alert('ယူနစ်မှားယွင်းနေပါသည်');
            editNum2.focus();
            editNum2.select();
            return false;
        }
        
        // Check reverse amount if in R mode
        if (reverseMode && editNum3.style.display !== 'none') {
            if (editNum3.value === '') {
                // Use main amount if reverse amount not specified
                editNum3.value = editNum2.value;
            } else {
                const reverseUnit = parseInt(editNum3.value);
                if (isNaN(reverseUnit) || reverseUnit < 1) {
                    alert('အာယူနစ်မှားယွင်းနေပါသည်');
                    editNum3.focus();
                    editNum3.select();
                    return false;
                }
            }
        }
        
        return true;
    }
    
    function processComboMode(amount) {
        const digitsStr = editNum1.value;
        const comboType = selectedTypes.has('အခွေ') ? 'အခွေ' : 'ခွေပူး';
        
        let numbers;
        if (comboType === 'အခွေ') {
            numbers = generateAhkwayNumbers(digitsStr);
        } else {
            numbers = generateKhwayPhuNumbers(digitsStr);
        }
        
        if (numbers && numbers.length > 0) {
            addBetsToA3Array(numbers, amount, comboType);
        }
    }
    
    function processSpecialModeNoDigit(amount) {
        const specialType = Array.from(selectedTypes).find(type => 
            ['အပူး', 'ပါဝါ', 'နက္ခ', 'ညီကို', 'ကိုညီ', 'ညီကိုR',
             'စုံစုံ', 'မမ', 'စုံမ', 'မစုံ', 'စုံပူး', 'မပူး'].includes(type));
        
        if (specialType && specialCases[specialType]) {
            const numbers = specialCases[specialType];
            addBetsToA3Array(numbers, amount, specialType);
        }
    }
    
    function processSpecialModeWithDigit(amount, reverseAmount) {
        if (editNum1.value === '') {
            alert('ဂဏန်းထည့်ပါ');
            editNum1.focus();
            editNum1.select();
            return;
        }
        
        const digit = parseInt(editNum1.value);
        const specialType = Array.from(selectedTypes).find(type => 
            ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်'].includes(type));
        
        let numbers = [];
        
        if (specialType === 'အပါ') {
            numbers = generateApalNumbers(digit);
        } else if (specialType === 'ထိပ်') {
            if (!reverseMode) {
                numbers = generateFrontNumbers(digit);
            } else {
                // Handle reverse for ထိပ်
                const frontNumbers = generateFrontNumbers(digit);
                const backNumbers = generateBackNumbers(digit);
                
                addBetsToA3Array(frontNumbers, amount, 'ထိပ်');
                addBetsToA3Array(backNumbers, reverseAmount, 'ပိတ် (R)');
                return;
            }
        } else if (specialType === 'ပိတ်') {
            if (!reverseMode) {
                numbers = generateBackNumbers(digit);
            } else {
                // Handle reverse for ပိတ်
                const backNumbers = generateBackNumbers(digit);
                const frontNumbers = generateFrontNumbers(digit);
                
                addBetsToA3Array(backNumbers, amount, 'ပိတ်');
                addBetsToA3Array(frontNumbers, reverseAmount, 'ထိပ် (R)');
                return;
            }
        } else if (specialType === 'ဘရိတ်') {
            numbers = generateBreakNumbers(digit);
        }
        
        if (numbers.length > 0) {
            const displayType = reverseMode ? specialType + ' (R)' : specialType;
            addBetsToA3Array(numbers, amount, displayType);
        }
    }
    
    function processRegularBet(amount, reverseAmount) {
        const numberInput = editNum1.value;
        
        if (numberInput === '') {
            alert('ဂဏန်းထည့်ပါ');
            editNum1.focus();
            editNum1.select();
            return;
        }
        
        const numbers = parseNumberInput(numberInput);
        if (numbers.length === 0) {
            alert('ဂဏန်းမှားယွင်းနေပါသည်');
            editNum1.focus();
            editNum1.select();
            return;
        }
        
        if (!reverseMode) {
            // Regular bet without reverse
            addBetsToA3Array(numbers, amount, 'Regular');
        } else {
            // Regular bet with reverse
            addBetsToA3Array(numbers, amount, 'Reverse(M)');
            
            // Add reverse bets
            const reverseNumbers = numbers.map(num => reverseNumber(num));
            addBetsToA3Array(reverseNumbers, reverseAmount, 'Reverse(R)');
        }
    }
    
    function needsDigitInput() {
        const specialTypes = Array.from(selectedTypes);
        const needsDigitTypes = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်', 'အခွေ', 'ခွေပူး'];
        
        return specialTypes.some(type => needsDigitTypes.includes(type));
    }
    
    function needsDigitInputForType(type) {
        const needsDigitTypes = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်', 'အခွေ', 'ခွေပူး'];
        return needsDigitTypes.includes(type);
    }
    
    function hasSpecialTypeWithoutDigit() {
        const specialTypes = Array.from(selectedTypes);
        const noDigitTypes = ['အပူး', 'ပါဝါ', 'နက္ခ', 'ညီကို', 'ကိုညီ', 'ညီကိုR',
                             'စုံစုံ', 'မမ', 'စုံမ', 'မစုံ', 'စုံပူး', 'မပူး'];
        
        return specialTypes.some(type => noDigitTypes.includes(type));
    }
    
    function hasSpecialTypeWithDigit() {
        const specialTypes = Array.from(selectedTypes);
        const withDigitTypes = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်'];
        
        return specialTypes.some(type => withDigitTypes.includes(type));
    }
    
    // Number generation functions (ORIGINAL FROM keyboard.js)
    function generateFrontNumbers(digit) {
        const numbers = [];
        for (let i = 0; i <= 9; i++) {
            numbers.push(parseInt(digit.toString() + i.toString()));
        }
        return numbers;
    }
    
    function generateBackNumbers(digit) {
        const numbers = [];
        for (let i = 0; i <= 9; i++) {
            numbers.push(parseInt(i.toString() + digit.toString()));
        }
        return numbers;
    }
    
    function generateBreakNumbers(digit) {
        const numbers = [];
        for (let n = 0; n <= 99; n++) {
            const tens = Math.floor(n / 10);
            const units = n % 10;
            const sum = tens + units;
            if (sum % 10 === digit) {
                numbers.push(n);
            }
        }
        return numbers;
    }
    
    function generateApalNumbers(digit) {
        const numbers = [];
        const digitStr = digit.toString();
        for (let n = 0; n <= 99; n++) {
            const numStr = n.toString().padStart(2, '0');
            if (numStr.includes(digitStr)) {
                numbers.push(n);
            }
        }
        return numbers;
    }
    
    function generateCombinationsFromArray(arr, k) {
        const combinations = [];
        
        function combine(start, current) {
            if (current.length === k) {
                combinations.push([...current]);
                return;
            }
            
            for (let i = start; i < arr.length; i++) {
                current.push(arr[i]);
                combine(i + 1, current);
                current.pop();
            }
        }
        
        combine(0, []);
        return combinations;
    }
    
    function generateAhkwayNumbers(digitsStr) {
        const numbers = new Set();
        const digits = digitsStr.split('');
        
        const combos = generateCombinationsFromArray(digits, 2);
        
        combos.forEach(combo => {
            const num1 = parseInt(combo[0] + combo[1]);
            const num2 = parseInt(combo[1] + combo[0]);
            numbers.add(num1);
            numbers.add(num2);
        });
        
        return Array.from(numbers);
    }
    
    function generateKhwayPhuNumbers(digitsStr) {
        const numbers = new Set();
        const digits = digitsStr.split('');
        
        const combos = generateCombinationsFromArray(digits, 2);
        
        combos.forEach(combo => {
            const num1 = parseInt(combo[0] + combo[1]);
            const num2 = parseInt(combo[1] + combo[0]);
            numbers.add(num1);
            numbers.add(num2);
        });
        
        const uniqueDigits = [...new Set(digits)];
        uniqueDigits.forEach(digit => {
            const doubleNum = parseInt(digit + digit);
            numbers.add(doubleNum);
        });
        
        return Array.from(numbers);
    }
    
    function parseNumberInput(input) {
        const numbers = [];
        const cleanInput = input.replace(/[^0-9\/\-]/g, '');
        
        if (cleanInput.includes('/') || cleanInput.includes('-')) {
            const parts = cleanInput.split(/[\/\-]/);
            parts.forEach(part => {
                if (part.length === 1 || part.length === 2) {
                    const num = parseInt(part);
                    if (!isNaN(num) && num >= 0 && num <= 99) {
                        numbers.push(num);
                    }
                }
            });
        } else {
            if (input.length === 1 || input.length === 2) {
                const num = parseInt(input);
                if (!isNaN(num) && num >= 0 && num <= 99) {
                    numbers.push(num);
                }
            }
        }
        
        return numbers;
    }
    
    function reverseNumber(n) {
        const s = n.toString().padStart(2, '0');
        return parseInt(s.split('').reverse().join(''));
    }
    
    // ORIGINAL ARRAY INTEGRATION FROM keyboard.js
    function addBetsToA3Array(numbers, amount, type) {
        numbers.forEach(num => {
            addSingleBetToA3Array(num, amount, type);
        });
    }
    
    function addSingleBetToA3Array(num, amount, type) {
        // Get or create global bets array - ORIGINAL LOGIC FROM keyboard.js
        let targetBets;
        let targetTotal;
        
        // Check if a3.js variables exist
        if (typeof bets !== 'undefined') {
            // Use a3.js local variables
            targetBets = bets;
            targetTotal = totalAmount;
        } else if (window.bets) {
            // Use window variables
            targetBets = window.bets;
            targetTotal = window.totalAmount;
        } else {
            // Create new
            targetBets = [];
            targetTotal = 0;
            window.bets = targetBets;
            window.totalAmount = targetTotal;
        }
        
        const newBet = {
            number: num,
            amount: amount,
            display: num.toString().padStart(2, '0'),
            type: type
        };
        
        targetBets.push(newBet);
        targetTotal += amount;
        
        // Update both a3.js and window variables
        if (typeof bets !== 'undefined') {
            bets = targetBets;
            totalAmount = targetTotal;
        }
        
        window.bets = targetBets;
        window.totalAmount = targetTotal;
        
        // Update display - ORIGINAL LOGIC
        if (typeof updateDisplay === 'function') {
            updateDisplay();
        } else {
            updateDisplayDirectly();
        }
    }
    
    function updateDisplayDirectly() {
        const betList = document.getElementById('betList');
        const totalDisplay = document.getElementById('totalAmount');
        const countDisplay = document.getElementById('listCount');
        
        if (!betList || !totalDisplay || !countDisplay) return;
        
        const currentBets = window.bets || [];
        const currentTotal = window.totalAmount || 0;
        
        if (currentBets.length === 0) {
            betList.innerHTML = '<div class="empty-message">လောင်းကြေးမရှိသေးပါ</div>';
        } else {
            let html = '';
            currentBets.forEach((bet, index) => {
                html += `
                <div class="bet-item">
                    <div class="bet-number">${bet.display}</div>
                    <div class="bet-amount">${bet.amount.toLocaleString()}</div>
                    <div class="bet-type">${bet.type}</div>
                    <button class="delete-btn" onclick="deleteGlobalBet(${index})">ဖျက်</button>
                </div>
                `;
            });
            betList.innerHTML = html;
        }
        
        totalDisplay.textContent = currentTotal.toLocaleString();
        countDisplay.textContent = currentBets.length;
    }
    
    function autoScrollToListView() {
        if (listView) {
            // Wait a bit for the DOM to update
            setTimeout(() => {
                listView.scrollTop = listView.scrollHeight;
            }, 100);
        }
    }
    
    // Global delete function - ORIGINAL FROM keyboard.js
    window.deleteGlobalBet = function(index) {
        if (!confirm('ဖျက်မှာသေချာပါသလား?')) return;
        
        if (window.bets && window.bets[index]) {
            const deleted = window.bets[index];
            window.totalAmount -= deleted.amount;
            window.bets.splice(index, 1);
            
            // Update a3.js if exists
            if (typeof bets !== 'undefined') {
                bets = window.bets;
                totalAmount = window.totalAmount;
            }
            
            // Update display
            if (typeof updateDisplay === 'function') {
                updateDisplay();
            } else {
                updateDisplayDirectly();
            }
        }
    };
    
    console.log('Keyboard.js - Original style with a3.js integration loaded successfully (Fixed Overwrite)');
});
