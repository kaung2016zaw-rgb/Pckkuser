// keyboard.js - Laptop Keyboard Version for sale.html
document.addEventListener('DOMContentLoaded', function() {
    console.log('keyboard.js - LAPTOP KEYBOARD VERSION');
    
    // DOM Elements from sale.html
    const editNum1 = document.getElementById('editNum1');
    const editNum2 = document.getElementById('editNum2');
    const editNum3 = document.getElementById('editNum3');
    const textview = document.getElementById('textview');
    const buttonsScrollContainer = document.getElementById('buttonsScrollContainer');
    const checkboxButtons = document.querySelectorAll('.checkbox-btn');
    const cptBtn = document.getElementById('cptBtn');
    const originalEditArea = document.getElementById('originalEditArea');
    
    // State variables
    let reverseMode = false;
    let isSpecialMode = false;
    let specialType = '';
    let selectedTypes = new Set();
    let currentField = editNum1;
    
    // Special cases definitions
    const specialCases = {
        'R': [], // R is handled specially
        'အပါ': [0, 11, 22, 33, 44, 55, 66, 77, 88, 99],
        'ထိပ်': [], // Requires 1 digit input
        'ပိတ်': [], // Requires 1 digit input
        'ဘရိတ်': [], // Requires 1 digit input (sum of digits)
        'အပူး': [0, 11, 22, 33, 44, 55, 66, 77, 88, 99],
        'ပါဝါ': [5, 16, 27, 38, 49, 50, 61, 72, 83, 94],
        'နက္ခ': [7, 18, 24, 35, 42, 53, 69, 70, 81, 96],
        'အခွေ': [], // Requires multiple digits
        'ခွေပူး': [], // Requires multiple digits
        'K': [], // Requires 1 digit input
        'ညီကို': [1, 12, 23, 34, 45, 56, 67, 78, 89, 90],
        'ကိုညီ': [9, 10, 21, 32, 43, 54, 65, 76, 87, 98],
        'ညီကိုR': [1, 12, 23, 34, 45, 56, 67, 78, 89, 90, 9, 10, 21, 32, 43, 54, 65, 76, 87, 98],
        'စုံစုံ': [0, 2, 4, 6, 8, 20, 22, 24, 26, 28, 40, 42, 44, 46, 48, 60, 62, 64, 66, 68, 80, 82, 84, 86, 88],
        'မမ': [11, 13, 15, 17, 19, 31, 33, 35, 37, 39, 51, 53, 55, 57, 59, 71, 73, 75, 77, 79, 91, 93, 95, 97, 99],
        'စုံမ': [1, 3, 5, 7, 9, 21, 23, 25, 27, 29, 41, 43, 45, 47, 49, 61, 63, 65, 67, 69, 81, 83, 85, 87, 89],
        'မစုံ': [10, 12, 14, 16, 18, 30, 32, 34, 36, 38, 50, 52, 54, 56, 58, 70, 72, 74, 76, 78, 90, 92, 94, 96, 98],
        'စုံပူး': [0, 22, 44, 66, 88],
        'မပူး': [11, 33, 55, 77, 99],
        'စုံကပ်': [], // Requires 1 digit input
        'မကပ်': [], // Requires 1 digit input
        'စုံကပ်R': [], // Requires 1 digit input
        'မကပ်R': [], // Requires 1 digit input
        'ကပ်': [] // Requires 1 digit input
    };
    
    // Function keys mapping
    const functionKeys = {
        'F9': 'ထိပ်',
        'F8': 'ပိတ်',
        'F6': 'အပါ',
        'F7': 'အပူး',
        'F12': 'ဘရိတ်',
        'F11': 'ပါဝါ',
        'F10': 'နက္ခ'
    };
    
    // Initialize
    setupEventListeners();
    resetFields();
    
    function resetFields() {
        editNum1.value = '';
        editNum2.value = '';
        editNum3.value = '';
        editNum3.style.display = 'none'; // Hide reverse field initially
        textview.textContent = '-';
        
        reverseMode = false;
        isSpecialMode = false;
        specialType = '';
        selectedTypes.clear();
        
        // Reset checkbox buttons
        checkboxButtons.forEach(btn => {
            btn.classList.remove('checked');
        });
        
        // Reset textview styling
        textview.style.borderColor = '#3498db';
        textview.style.backgroundColor = 'white';
        
        // Set focus to first field
        setCurrentField(editNum1);
    }
    
    function setCurrentField(field) {
        currentField = field;
        
        // Remove highlights from all fields
        [editNum1, editNum2, editNum3].forEach(f => {
            f.style.borderColor = '#3498db';
            f.style.backgroundColor = 'white';
        });
        textview.style.borderColor = '#3498db';
        textview.style.backgroundColor = 'white';
        
        // Highlight current field
        field.style.borderColor = '#2ecc71';
        field.style.backgroundColor = '#e8f8f5';
        
        // Focus on input field
        if (field !== textview) {
            field.focus();
            field.select();
        }
    }
    
    function setupEventListeners() {
        // Input field focus events
        editNum1.addEventListener('focus', () => setCurrentField(editNum1));
        editNum2.addEventListener('focus', () => setCurrentField(editNum2));
        editNum3.addEventListener('focus', () => setCurrentField(editNum3));
        textview.addEventListener('click', () => setCurrentField(textview));
        
        // Input field keyboard events
        editNum1.addEventListener('keydown', handleKeyboardInput);
        editNum2.addEventListener('keydown', handleKeyboardInput);
        editNum3.addEventListener('keydown', handleKeyboardInput);
        
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
                setCurrentField(editNum1);
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
        // Function keys for special types
        if (functionKeys[e.key]) {
            e.preventDefault();
            handleFunctionKey(functionKeys[e.key]);
            return;
        }
        
        // Slash (/) key for R mode
        if (e.key === '/' && currentField === editNum2) {
            e.preventDefault();
            handleSlashKey();
            return;
        }
        
        // Backspace for delete
        if (e.key === 'Backspace' && currentField === textview) {
            e.preventDefault();
            handleDelete();
            return;
        }
        
        // Enter key processing
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEnterKey();
            return;
        }
    }
    
    function handleKeyboardInput(e) {
        // Only allow numbers and some special keys
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                            'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                            'Delete', 'Home', 'End'];
        
        if (!allowedKeys.includes(e.key) && 
            !(e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key)) &&
            !(e.key.length === 1 && /[0-9]/.test(e.key))) {
            e.preventDefault();
            return;
        }
        
        // Auto-advance logic for editNum1
        if (e.target === editNum1 && e.key.length === 1 && /[0-9]/.test(e.key)) {
            setTimeout(() => {
                if (shouldAutoAdvance(editNum1)) {
                    if (selectedTypes.size === 0) {
                        // Regular number - move to amount after 2 digits
                        if (editNum1.value.length >= 2) {
                            setCurrentField(editNum2);
                        }
                    } else {
                        // Special mode - check if needs digit
                        const needsDigit = needsDigitInput();
                        if (needsDigit) {
                            // For 1-digit special types
                            const maxLength = getMaxLengthForField(editNum1);
                            if (editNum1.value.length >= maxLength) {
                                setCurrentField(editNum2);
                            }
                        } else {
                            // For no-digit special types, number field might be empty or optional
                            if (editNum1.value.length >= 2) {
                                setCurrentField(editNum2);
                            }
                        }
                    }
                }
            }, 10);
        }
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
            setCurrentField(editNum1);
        } else {
            setCurrentField(editNum2);
        }
    }
    
    function handleSlashKey() {
        // Only allow / when in editNum2 field
        if (currentField !== editNum2) return;
        
        // Check if R is allowed (only for regular bets)
        if (selectedTypes.size > 0 && !selectedTypes.has('R')) {
            // Check if allowed types for R
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
        setCurrentField(editNum3);
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
            setCurrentField(editNum3);
        } else if (needsDigitInputForType(type)) {
            setCurrentField(editNum1);
        } else {
            setCurrentField(editNum2);
        }
    }
    
    function handleDelete() {
        if (currentField === textview) {
            // Clear selected types
            selectedTypes.clear();
            checkboxButtons.forEach(btn => {
                btn.classList.remove('checked');
            });
            updateTextView();
            editNum3.style.display = 'none';
            reverseMode = false;
            editNum3.value = '';
            return;
        }
        
        // For input fields, let default backspace handle it
    }
    
    function handleEnterKey() {
        // Process based on current field
        if (currentField === editNum1) {
            // Move to next field
            if (editNum1.value.length > 0) {
                setCurrentField(editNum2);
            }
        } else if (currentField === editNum2) {
            // Check if we should process or move to reverse
            if (reverseMode && editNum3.style.display !== 'none') {
                setCurrentField(editNum3);
            } else {
                // Process the bet
                processBet();
            }
        } else if (currentField === editNum3) {
            // Process the bet
            processBet();
        }
    }
    
    function processBet() {
        // Validate and process the bet
        if (!validateInputs()) {
            return;
        }
        
        // Get amount (multiply by 100 for unit)
        const unitAmount = parseInt(editNum2.value);
        const amount = unitAmount * 100;
        
        // Get reverse amount if exists
        let reverseAmount = amount;
        if (reverseMode && editNum3.value) {
            const reverseUnit = parseInt(editNum3.value);
            reverseAmount = reverseUnit * 100;
        }
        
        // Process based on selected types
        if (selectedTypes.size === 0) {
            // Regular bet
            processRegularBet(amount, reverseAmount);
        } else if (hasSpecialTypeWithoutDigit()) {
            processSpecialModeNoDigit(amount);
        } else if (hasSpecialTypeWithDigit()) {
            processSpecialModeWithDigit(amount, reverseAmount);
        } else {
            processRegularBet(amount, reverseAmount);
        }
        
        // Reset and focus on first field
        resetFields();
    }
    
    function validateInputs() {
        // Check number field
        if (editNum1.value === '') {
            if (needsDigitInput()) {
                alert('ဂဏန်းထည့်ပါ');
                setCurrentField(editNum1);
                return false;
            }
        } else {
            const num = parseInt(editNum1.value);
            if (isNaN(num)) {
                alert('ဂဏန်းမှားယွင်းနေပါသည်');
                setCurrentField(editNum1);
                return false;
            }
        }
        
        // Check amount field
        if (editNum2.value === '') {
            alert('ယူနစ်ထည့်ပါ');
            setCurrentField(editNum2);
            return false;
        }
        
        const unit = parseInt(editNum2.value);
        if (isNaN(unit) || unit < 1) {
            alert('ယူနစ်မှားယွင်းနေပါသည်');
            setCurrentField(editNum2);
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
                    setCurrentField(editNum3);
                    return false;
                }
            }
        }
        
        return true;
    }
    
    function processRegularBet(amount, reverseAmount) {
        const numberInput = editNum1.value;
        
        if (numberInput === '') {
            alert('ဂဏန်းထည့်ပါ');
            setCurrentField(editNum1);
            return;
        }
        
        const numbers = parseNumberInput(numberInput);
        if (numbers.length === 0) {
            alert('ဂဏန်းမှားယွင်းနေပါသည်');
            setCurrentField(editNum1);
            return;
        }
        
        if (!reverseMode) {
            // Regular bet without reverse
            numbers.forEach(num => {
                addSingleBetToGlobalArray(num, amount, 'Regular');
            });
        } else {
            // Regular bet with reverse
            numbers.forEach(num => {
                // Main bet
                addSingleBetToGlobalArray(num, amount, 'Reverse(M)');
                
                // Reverse bet
                const revNum = reverseNumber(num);
                if (revNum !== num) {
                    addSingleBetToGlobalArray(revNum, reverseAmount, 'Reverse(R)');
                }
            });
        }
    }
    
    function processSpecialModeNoDigit(amount) {
        const specialType = Array.from(selectedTypes).find(type => 
            ['အပူး', 'ပါဝါ', 'နက္ခ', 'ညီကို', 'ကိုညီ', 'ညီကိုR', 
             'စုံစုံ', 'မမ', 'စုံမ', 'မစုံ', 'စုံပူး', 'မပူး'].includes(type));
        
        if (specialType && specialCases[specialType]) {
            const numbers = specialCases[specialType];
            numbers.forEach(num => {
                addSingleBetToGlobalArray(num, amount, specialType);
            });
        }
    }
    
    function processSpecialModeWithDigit(amount, reverseAmount) {
        if (editNum1.value === '') {
            alert('ဂဏန်းထည့်ပါ');
            setCurrentField(editNum1);
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
                
                frontNumbers.forEach(num => {
                    addSingleBetToGlobalArray(num, amount, 'ထိပ်');
                });
                
                backNumbers.forEach(num => {
                    addSingleBetToGlobalArray(num, reverseAmount, 'ပိတ် (R)');
                });
                
                return;
            }
        } else if (specialType === 'ပိတ်') {
            if (!reverseMode) {
                numbers = generateBackNumbers(digit);
            } else {
                // Handle reverse for ပိတ်
                const backNumbers = generateBackNumbers(digit);
                const frontNumbers = generateFrontNumbers(digit);
                
                backNumbers.forEach(num => {
                    addSingleBetToGlobalArray(num, amount, 'ပိတ်');
                });
                
                frontNumbers.forEach(num => {
                    addSingleBetToGlobalArray(num, reverseAmount, 'ထိပ် (R)');
                });
                
                return;
            }
        } else if (specialType === 'ဘရိတ်') {
            numbers = generateBreakNumbers(digit);
        }
        
        if (numbers.length > 0) {
            const displayType = reverseMode ? specialType + ' (R)' : specialType;
            numbers.forEach(num => {
                addSingleBetToGlobalArray(num, amount, displayType);
            });
        }
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
    
    function needsDigitInput() {
        const specialTypes = Array.from(selectedTypes);
        const needsDigitTypes = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်'];
        
        return specialTypes.some(type => needsDigitTypes.includes(type));
    }
    
    function needsDigitInputForType(type) {
        const needsDigitTypes = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်', 'K', 
                                'စုံကပ်', 'မကပ်', 'စုံကပ်R', 'မကပ်R', 'ကပ်'];
        return needsDigitTypes.includes(type);
    }
    
    function hasSpecialTypeWithoutDigit() {
        const specialTypes = Array.from(selectedTypes);
        const noDigitTypes = ['အပူး', 'ပါဝါ', 'နက္ခ', 'ညီကို', 'ကိုညီ', 
                             'ညီကိုR', 'စုံစုံ', 'မမ', 'စုံမ', 'မစုံ', 
                             'စုံပူး', 'မပူး'];
        
        return specialTypes.some(type => noDigitTypes.includes(type));
    }
    
    function hasSpecialTypeWithDigit() {
        const specialTypes = Array.from(selectedTypes);
        const withDigitTypes = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်'];
        
        return specialTypes.some(type => withDigitTypes.includes(type));
    }
    
    function shouldAutoAdvance(field) {
        if (field !== editNum1) return false;
        
        if (selectedTypes.size === 0) {
            // Regular number - auto advance after 2 digits
            return field.value.length >= 2;
        } else if (needsDigitInput()) {
            // Special types needing 1 digit
            return field.value.length >= 1;
        }
        
        return false;
    }
    
    function getMaxLengthForField(field) {
        if (field === editNum1) {
            if (needsDigitInput()) {
                return 1; // For 1-digit special types
            } else {
                return 2; // Regular 2-digit numbers
            }
        }
        return 7; // For amount fields
    }
    
    // Helper functions for number generation (same as before)
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
    
    function addSingleBetToGlobalArray(num, amount, type) {
        // Use global bets array
        if (!window.bets) {
            window.bets = [];
            window.totalAmount = 0;
        }
        
        const newBet = {
            number: num,
            amount: amount,
            display: num.toString().padStart(2, '0'),
            type: type
        };
        
        window.bets.push(newBet);
        window.totalAmount += amount;
        
        // Update display
        updateDisplayDirectly();
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
    
    // Global delete function
    window.deleteGlobalBet = function(index) {
        if (!confirm('ဖျက်မှာသေချာပါသလား?')) return;
        
        if (window.bets && window.bets[index]) {
            const deleted = window.bets[index];
            window.totalAmount -= deleted.amount;
            window.bets.splice(index, 1);
            
            updateDisplayDirectly();
        }
    };
    
    console.log('Keyboard.js - Laptop Keyboard Version loaded successfully');
});
