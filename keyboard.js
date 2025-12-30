
// keyboard.js - Modified for sale.html with original a3.js integration
// FIXED VERSION A: Complete rewrite with B code logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('keyboard.js - VERSION A WITH B LOGIC');
    
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
    
    // State variables
    let reverseMode = false;
    let selectedTypes = new Set();
    
    // Special cases definitions (from B code)
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
        // Input field events
        editNum1.addEventListener('focus', () => {
            editNum1.select();
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
        
        // Prevent non-numeric input
        editNum1.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        editNum2.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        editNum3.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        // Checkbox buttons (like B code)
        checkboxButtons.forEach(button => {
            button.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                
                // Clear all selections first (like B code)
                selectedTypes.clear();
                checkboxButtons.forEach(btn => {
                    btn.classList.remove('checked');
                });
                
                // Add the selected type
                selectedTypes.add(type);
                this.classList.add('checked');
                
                updateTextView();
                
                // Clear number field for special types that don't need digits
                const noDigitTypes = ['အပူး', 'ပါဝါ', 'နက္ခ', 'ညီကို', 'ကိုညီ', 'ညီကိုR',
                                     'စုံစုံ', 'မမ', 'စုံမ', 'မစုံ', 'စုံပူး', 'မပူး'];
                
                if (noDigitTypes.includes(type)) {
                    // Like B code: clear number field and focus on amount
                    editNum1.value = '';
                    editNum2.focus();
                    editNum2.select();
                } 
                // Special types that need 1 digit
                else if (['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်', 'စုံကပ်', 'မကပ်', 'စုံကပ်R', 'မကပ်R'].includes(type)) {
                    // Clear number field for 1-digit types
                    editNum1.value = '';
                    editNum1.focus();
                    editNum1.select();
                }
                // Combo modes
                else if (type === 'အခွေ' || type === 'ခွေပူး') {
                    // Clear number field for combo modes
                    editNum1.value = '';
                    editNum1.focus();
                    editNum1.select();
                }
                // R mode
                else if (type === 'R') {
                    // Only allow R for ထိပ် and ပိတ်
                    if (!selectedTypes.has('ထိပ်') && !selectedTypes.has('ပိတ်')) {
                        alert('R ကို ထိပ်နှင့် ပိတ်နှင့်သာ အသုံးပြုနိုင်ပါသည်');
                        selectedTypes.delete('R');
                        this.classList.remove('checked');
                        updateTextView();
                        return;
                    }
                    
                    // Show reverse field
                    editNum3.style.display = 'block';
                    reverseMode = true;
                    editNum3.focus();
                    editNum3.select();
                }
                // K button
                else if (type === 'K') {
                    editNum1.value = '';
                    editNum1.focus();
                    editNum1.select();
                }
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
        
        // Global keyboard shortcuts with function keys
        document.addEventListener('keydown', handleGlobalKeyboard);
    }
    
    function handleGlobalKeyboard(e) {
        // Enter key processing
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEnterKey();
            return;
        }
        
        // Slash (/) key for R mode (like B code)
        if (e.key === '/' && (document.activeElement === editNum2 || document.activeElement === editNum3)) {
            e.preventDefault();
            
            // Only allow / for R if ထိပ် or ပိတ် is selected
            const allowedTypes = ['ထိပ်', 'ပိတ်'];
            const hasAllowedType = Array.from(selectedTypes).some(type => allowedTypes.includes(type));
            
            if (!hasAllowedType) {
                alert('/ ကို ထိပ် သို့ ပိတ်ရွေးထားမှသာ အသုံးပြုနိုင်ပါသည်');
                return;
            }
            
            handleSlashKey();
            return;
        }
        
        // Backspace for delete
        if (e.key === 'Backspace' && document.activeElement === textview) {
            e.preventDefault();
            handleDelete();
            return;
        }
        
        // Function keys mapping (like B code but with F1-F5)
        const functionKeys = {
            'F9': 'ထိပ်',
            'F8': 'ပိတ်',
            'F6': 'အပါ',
            'F7': 'အပူး',
            'F12': 'ဘရိတ်',
            'F11': 'ပါဝါ',
            'F10': 'နက္ခ',
            'F1': 'စုံပူး',
            'F2': 'မပူး',
            'F3': 'စုံစုံ',
            'F4': 'မမ',
            'F5': 'ညီကိုR'
        };
        
        if (functionKeys[e.key]) {
            e.preventDefault();
            handleFunctionKey(functionKeys[e.key]);
            return;
        }
        
        // Number input handling - FIXED with overwrite logic
        if (e.key.length === 1 && /[0-9]/.test(e.key)) {
            e.preventDefault();
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
    
    // FIXED FUNCTION: Number input with proper overwrite logic
    function handleNumberInput(digit) {
        const activeElement = document.activeElement;
        
        // Special types that need 1 digit (ထိပ်၊ ပိတ်၊ အပါ၊ etc.)
        const oneDigitTypes = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်', 'စုံကပ်', 'မကပ်', 'စုံကပ်R', 'မကပ်R', 'ကပ်', 'K'];
        const hasOneDigitType = Array.from(selectedTypes).some(type => oneDigitTypes.includes(type));
        
        if (activeElement === editNum1) {
            // Check if it's a 1-digit type
            if (hasOneDigitType) {
                // Always overwrite for 1-digit types
                editNum1.value = digit;
                
                // Auto move to amount field after 1 digit
                setTimeout(() => {
                    editNum2.focus();
                    editNum2.select();
                }, 50);
            }
            // Check if it's combo mode
            else if (selectedTypes.has('အခွေ') || selectedTypes.has('ခွေပူး')) {
                // Append for combo modes
                editNum1.value += digit;
                // NO AUTO MOVE - wait for Enter (like B code)
            }
            // Regular 2-digit number
            else {
                const currentValue = editNum1.value;
                
                if (currentValue.length === 0) {
                    // First digit
                    editNum1.value = digit;
                } else if (currentValue.length === 1) {
                    // Second digit
                    editNum1.value = currentValue + digit;
                    // NO AUTO MOVE - wait for Enter
                } else {
                    // Already has 2 digits - overwrite with new digit
                    editNum1.value = digit;
                }
            }
        } 
        else if (activeElement === editNum2) {
            // Amount field - just add the digit (like B code)
            editNum2.value += digit;
        }
        else if (activeElement === editNum3) {
            // Reverse amount field - just add the digit (like B code)
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
    
    function handleFunctionKey(type) {
        // Clear all selections first (like B code)
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
        
        // Set focus based on type (like B code)
        const needsDigit = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်', 'စုံကပ်', 'မကပ်', 'စုံကပ်R', 'မကပ်R', 'ကပ်'].includes(type);
        const noDigitTypes = ['အပူး', 'ပါဝါ', 'နက္ခ', 'ညီကို', 'ကိုညီ', 'ညီကိုR',
                             'စုံစုံ', 'မမ', 'စုံမ', 'မစုံ', 'စုံပူး', 'မပူး'];
        
        if (needsDigit) {
            editNum1.value = ''; // Clear number field
            editNum1.focus();
            editNum1.select();
        } else if (noDigitTypes.includes(type)) {
            editNum1.value = ''; // Clear number field (like B code)
            editNum2.focus();
            editNum2.select();
        }
    }
    
    function handleSlashKey() {
        // Check if R is allowed
        const allowedTypes = ['ထိပ်', 'ပိတ်'];
        const hasAllowedType = Array.from(selectedTypes).some(type => allowedTypes.includes(type));
        
        if (!hasAllowedType) {
            alert('/ ကို ထိပ် သို့ ပိတ်ရွေးထားမှသာ အသုံးပြုနိုင်ပါသည်');
            return;
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
    
    function handleDelete() {
        // Clear selected types (like B code)
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
        
        // Get amount (multiply by 100 for unit)
        const unitAmount = parseInt(editNum2.value);
        const amount = unitAmount * 100;
        
        // Get reverse amount if exists
        let reverseAmount = amount;
        if (reverseMode && editNum3.value) {
            const reverseUnit = parseInt(editNum3.value);
            reverseAmount = reverseUnit * 100;
        }
        
        // Process based on selected types (like B code logic)
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
        // Special types that don't need digit
        const noDigitTypes = ['အပူး', 'ပါဝါ', 'နက္ခ', 'ညီကို', 'ကိုညီ', 'ညီကိုR',
                             'စုံစုံ', 'မမ', 'စုံမ', 'မစုံ', 'စုံပူး', 'မပူး'];
        const hasNoDigitType = Array.from(selectedTypes).some(type => noDigitTypes.includes(type));
        
        // Special types that need 1 digit
        const oneDigitTypes = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်', 'စုံကပ်', 'မကပ်', 'စုံကပ်R', 'မကပ်R', 'ကပ်'];
        const hasOneDigitType = Array.from(selectedTypes).some(type => oneDigitTypes.includes(type));
        
        // Combo modes
        const isComboMode = selectedTypes.has('အခွေ') || selectedTypes.has('ခွေပူး');
        
        // Check number field
        if (editNum1.value === '') {
            if (hasOneDigitType || isComboMode) {
                if (hasOneDigitType) {
                    alert('ဂဏန်းထည့်ပါ (တစ်လုံး)');
                } else if (isComboMode) {
                    alert('ဂဏန်းထည့်ပါ (နှစ်လုံး သို့ အထက်)');
                }
                editNum1.focus();
                editNum1.select();
                return false;
            } else if (!hasNoDigitType && selectedTypes.size === 0) {
                // Regular bet needs number
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
            
            // Validate for 1-digit types
            if (hasOneDigitType) {
                if (num < 0 || num > 9) {
                    alert('ဂဏန်းမှားယွင်းနေပါသည် (0-9)');
                    editNum1.focus();
                    editNum1.select();
                    return false;
                }
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
        // Find the special type from selectedTypes
        let specialType = '';
        for (const type of selectedTypes) {
            if (specialCases[type]) {
                specialType = type;
                break;
            }
        }
        
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
        
        // Find the special type from selectedTypes
        let specialType = '';
        const specialTypes = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်', 'စုံကပ်', 'မကပ်', 'စုံကပ်R', 'မကပ်R', 'ကပ်'];
        for (const type of selectedTypes) {
            if (specialTypes.includes(type)) {
                specialType = type;
                break;
            }
        }
        
        let numbers = [];
        
        if (specialType === 'အပါ') {
            numbers = generateApalNumbers(digit);
        } else if (specialType === 'ထိပ်') {
            if (!reverseMode) {
                numbers = generateFrontNumbers(digit);
            } else {
                // Handle reverse for ထိပ် (like B code)
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
                // Handle reverse for ပိတ် (like B code)
                const backNumbers = generateBackNumbers(digit);
                const frontNumbers = generateFrontNumbers(digit);
                
                addBetsToA3Array(backNumbers, amount, 'ပိတ်');
                addBetsToA3Array(frontNumbers, reverseAmount, 'ထိပ် (R)');
                return;
            }
        } else if (specialType === 'ဘရိတ်') {
            numbers = generateBreakNumbers(digit);
        } else if (specialType === 'စုံကပ်') {
            numbers = generateEvenKhatNumbers(digit);
        } else if (specialType === 'မကပ်') {
            numbers = generateOddKhatNumbers(digit);
        } else if (specialType === 'စုံကပ်R') {
            numbers = generateEvenKhatRNumbers(digit);
        } else if (specialType === 'မကပ်R') {
            numbers = generateOddKhatRNumbers(digit);
        } else if (specialType === 'ကပ်') {
            numbers = generateKhatNumbers(digit);
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
    
    function hasSpecialTypeWithoutDigit() {
        const specialTypes = Array.from(selectedTypes);
        const noDigitTypes = ['အပူး', 'ပါဝါ', 'နက္ခ', 'ညီကို', 'ကိုညီ', 'ညီကိုR',
                             'စုံစုံ', 'မမ', 'စုံမ', 'မစုံ', 'စုံပူး', 'မပူး'];
        
        return specialTypes.some(type => noDigitTypes.includes(type));
    }
    
    function hasSpecialTypeWithDigit() {
        const specialTypes = Array.from(selectedTypes);
        const withDigitTypes = ['အပါ', 'ထိပ်', 'ပိတ်', 'ဘရိတ်', 'စုံကပ်', 'မကပ်', 'စုံကပ်R', 'မကပ်R', 'ကပ်'];
        
        return specialTypes.some(type => withDigitTypes.includes(type));
    }
    
    // Number generation functions (from B code)
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
    
    function generateEvenKhatNumbers(digit) {
        const numbers = [];
        const evenDigits = [0, 2, 4, 6, 8];
        for (const evenDigit of evenDigits) {
            numbers.push(parseInt(digit.toString() + evenDigit.toString()));
        }
        return numbers;
    }
    
    function generateOddKhatNumbers(digit) {
        const numbers = [];
        const oddDigits = [1, 3, 5, 7, 9];
        for (const oddDigit of oddDigits) {
            numbers.push(parseInt(digit.toString() + oddDigit.toString()));
        }
        return numbers;
    }
    
    function generateEvenKhatRNumbers(digit) {
        const numbers = [];
        const evenDigits = [0, 2, 4, 6, 8];
        for (const evenDigit of evenDigits) {
            numbers.push(parseInt(digit.toString() + evenDigit.toString()));
            numbers.push(parseInt(evenDigit.toString() + digit.toString()));
        }
        return [...new Set(numbers)];
    }
    
    function generateOddKhatRNumbers(digit) {
        const numbers = [];
        const oddDigits = [1, 3, 5, 7, 9];
        for (const oddDigit of oddDigits) {
            numbers.push(parseInt(digit.toString() + oddDigit.toString()));
            numbers.push(parseInt(oddDigit.toString() + digit.toString()));
        }
        return [...new Set(numbers)];
    }
    
    function generateKhatNumbers(digit) {
        const numbers = [];
        for (let i = 0; i <= 9; i++) {
            numbers.push(parseInt(digit.toString() + i.toString()));
            numbers.push(parseInt(i.toString() + digit.toString()));
        }
        return [...new Set(numbers)];
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
    
    // ORIGINAL ARRAY INTEGRATION (unchanged from A code)
    function addBetsToA3Array(numbers, amount, type) {
        numbers.forEach(num => {
            addSingleBetToA3Array(num, amount, type);
        });
    }
    
    function addSingleBetToA3Array(num, amount, type) {
        // Get or create global bets array
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
        
        // Update display
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
            setTimeout(() => {
                listView.scrollTop = listView.scrollHeight;
            }, 100);
        }
    }
    
    // Global delete function
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
    
    console.log('Keyboard.js - Version A with B logic loaded successfully');
});
