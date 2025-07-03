let generatedIDs = [];

        function generateRandomDigits(count) {
            let digits = '';
            for (let i = 0; i < count; i++) {
                digits += Math.floor(Math.random() * 10);
            }
            return digits;
        }

        function calculateLuhnChecksum(digits) {
            let sum = 0;
            let doubled = [];
            
            // Process each digit
            for (let i = 0; i < digits.length; i++) {
                let digit = parseInt(digits[i]);
                let position = i + 1; // 1-indexed position
                
                if (position % 2 === 0) { // Even position
                    let doubledDigit = digit * 2;
                    if (doubledDigit > 9) {
                        doubledDigit = doubledDigit % 9;
                    }
                    doubled.push(doubledDigit);
                    sum += doubledDigit;
                } else { // Odd position
                    doubled.push(digit);
                    sum += digit;
                }
            }
            
            return { sum, doubled };
        }

        function generateRandomDate() {
            let startYear = 1950;
            let endYear = 2005;
            let year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
            let month = Math.floor(Math.random() * 12) + 1;
            let day = Math.floor(Math.random() * 28) + 1; // Use 28 to avoid invalid dates
            
            return {
                year: year,
                month: month.toString().padStart(2, '0'),
                day: day.toString().padStart(2, '0')
            };
        }

        function generateGenderSequence(gender) {
            if (gender === 'female') {
                return Math.floor(Math.random() * 5000).toString().padStart(4, '0');
            } else if (gender === 'male') {
                return (Math.floor(Math.random() * 5000) + 5000).toString();
            } else {
                // Random gender
                return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            }
        }

        function getCitizenshipDigit(citizenship) {
            if (citizenship === 'citizen') return '0';
            if (citizenship === 'resident') return '2';
            return Math.random() < 0.8 ? '0' : '2'; // 80% citizens, 20% residents
        }

        function formatDateForID(dateString) {
            if (!dateString) return null;
            let date = new Date(dateString);
            let year = date.getFullYear().toString().slice(-2);
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');
            return { year, month, day };
        }

        function generateSAID() {
            // Get user preferences
            let genderPref = document.querySelector('input[name="gender"]:checked').value;
            let citizenshipPref = document.querySelector('input[name="citizenship"]:checked').value;
            let birthDateInput = document.getElementById('birthDate').value;
            
            // Generate date of birth
            let dateObj;
            if (birthDateInput) {
                dateObj = formatDateForID(birthDateInput);
            } else {
                dateObj = generateRandomDate();
            }
            
            let dateOfBirth = dateObj.year + dateObj.month + dateObj.day;
            
            // Generate gender sequence
            let genderSequence = generateGenderSequence(genderPref);
            
            // Generate citizenship status
            let citizenshipDigit = getCitizenshipDigit(citizenshipPref);
            
            // 12th digit (usually 8)
            let twelthDigit = '8';
            
            // Construct first 12 digits
            let first12 = dateOfBirth + genderSequence + citizenshipDigit + twelthDigit;
            
            // Calculate checksum using Luhn's algorithm
            for (let checksum = 0; checksum <= 9; checksum++) {
                let fullID = first12 + checksum;
                let { sum } = calculateLuhnChecksum(fullID);
                
                if (sum % 10 === 0) {
                    return fullID;
                }
            }
            
            // This shouldn't happen, but fallback
            return first12 + '0';
        }

        function parseIDComponents(id) {
            return {
                birthDate: id.substring(0, 6),
                year: '20' + id.substring(0, 2),
                month: id.substring(2, 4),
                day: id.substring(4, 6),
                genderSequence: id.substring(6, 10),
                gender: parseInt(id.substring(6, 10)) < 5000 ? 'Female' : 'Male',
                citizenship: id.substring(10, 11) === '0' ? 'SA Citizen' : 'Permanent Resident',
                unusedDigit: id.substring(11, 12),
                checksum: id.substring(12, 13)
            };
        }

        function displayIDBreakdown(id) {
            let components = parseIDComponents(id);
            
            let breakdownHtml = '';
            
            breakdownHtml += '<div class="breakdown-section">';
            breakdownHtml += '<div class="breakdown-title"><i class="fas fa-birthday-cake"></i> Date of Birth</div>';
            breakdownHtml += `<div class="breakdown-value">${components.birthDate} → ${components.day}/${components.month}/${components.year}</div>`;
            breakdownHtml += '<div class="breakdown-desc">Positions 1-6: Birth date in YYMMDD format</div>';
            breakdownHtml += '</div>';
            
            breakdownHtml += '<div class="breakdown-section">';
            breakdownHtml += '<div class="breakdown-title"><i class="fas fa-venus-mars"></i> Gender Sequence</div>';
            breakdownHtml += `<div class="breakdown-value">${components.genderSequence} → ${components.gender}</div>`;
            breakdownHtml += '<div class="breakdown-desc">Positions 7-10: 0000-4999 = Female, 5000-9999 = Male</div>';
            breakdownHtml += '</div>';
            
            breakdownHtml += '<div class="breakdown-section">';
            breakdownHtml += '<div class="breakdown-title"><i class="fas fa-flag"></i> Citizenship Status</div>';
            breakdownHtml += `<div class="breakdown-value">${id.substring(10, 11)} → ${components.citizenship}</div>`;
            breakdownHtml += '<div class="breakdown-desc">Position 11: 0 = SA Citizen, 2 = Permanent Resident</div>';
            breakdownHtml += '</div>';
            
            breakdownHtml += '<div class="breakdown-section">';
            breakdownHtml += '<div class="breakdown-title"><i class="fas fa-question-circle"></i> Unused Digit</div>';
            breakdownHtml += `<div class="breakdown-value">${components.unusedDigit}</div>`;
            breakdownHtml += '<div class="breakdown-desc">Position 12: Currently not used (usually 8)</div>';
            breakdownHtml += '</div>';
            
            breakdownHtml += '<div class="breakdown-section">';
            breakdownHtml += '<div class="breakdown-title"><i class="fas fa-check-circle"></i> Checksum Digit</div>';
            breakdownHtml += `<div class="breakdown-value">${components.checksum}</div>`;
            breakdownHtml += '<div class="breakdown-desc">Position 13: Calculated using Luhn\'s algorithm for validation</div>';
            breakdownHtml += '</div>';
            
            document.getElementById('idBreakdown').innerHTML = breakdownHtml;
        }

        function generateValidID() {
            return generateSAID();
        }

        function displayValidationSteps(id) {
            let { sum, doubled } = calculateLuhnChecksum(id);
            
            let stepsHtml = '';
            
            // Step 1: Show original digits
            stepsHtml += '<div class="step">';
            stepsHtml += '<div class="step-title"><i class="fas fa-calculator"></i> Step 1: Original ID</div>';
            stepsHtml += '<div class="digit-row">';
            for (let i = 0; i < id.length; i++) {
                stepsHtml += `<span>${id[i]}</span>`;
            }
            stepsHtml += '</div>';
            stepsHtml += '</div>';
            
            // Step 2: Show doubled even positions
            stepsHtml += '<div class="step">';
            stepsHtml += '<div class="step-title"><i class="fas fa-sync-alt"></i> Step 2: Process digits</div>';
            stepsHtml += '<div class="digit-row">';
            for (let i = 0; i < id.length; i++) {
                let position = i + 1;
                if (position % 2 === 0) {
                    let original = parseInt(id[i]);
                    let doubled_val = original * 2;
                    stepsHtml += `<span class="highlight">${doubled_val > 9 ? original + '×2=' + doubled_val + '→' + (doubled_val % 9) : original + '×2=' + doubled_val}</span>`;
                } else {
                    stepsHtml += `<span>${id[i]}</span>`;
                }
            }
            stepsHtml += '</div>';
            stepsHtml += '</div>';
            
            // Step 3: Show final digits after modulo 9
            stepsHtml += '<div class="step">';
            stepsHtml += '<div class="step-title"><i class="fas fa-plus-circle"></i> Step 3: Calculate sum</div>';
            stepsHtml += '<div class="digit-row">';
            stepsHtml += `Sum = ${doubled.join(' + ')} = ${sum}`;
            stepsHtml += '</div>';
            stepsHtml += '</div>';
            
            // Step 4: Show validation result
            stepsHtml += '<div class="step">';
            stepsHtml += '<div class="step-title"><i class="fas fa-check-double"></i> Step 4: Validate</div>';
            stepsHtml += '<div class="digit-row">';
            let remainder = sum % 10;
            stepsHtml += `${sum} % 10 = ${remainder}`;
            stepsHtml += `<br><span class="${remainder === 0 ? 'valid' : 'invalid'}">`;
            stepsHtml += remainder === 0 ? 'VALID ID' : 'INVALID ID';
            stepsHtml += '</span>';
            stepsHtml += '</div>';
            stepsHtml += '</div>';
            
            document.getElementById('validationSteps').innerHTML = stepsHtml;
        }

        function generateSingleID() {
            let id = generateValidID();
            document.getElementById('currentID').textContent = id;
            displayValidationSteps(id);
            displayIDBreakdown(id);
            
            // Add to generated list
            if (!generatedIDs.includes(id)) {
                generatedIDs.push(id);
                updateGeneratedList();
            }
        }

        function generateMultipleIDs() {
            let newIDs = [];
            for (let i = 0; i < 10; i++) {
                let id = generateValidID();
                if (!generatedIDs.includes(id) && !newIDs.includes(id)) {
                    newIDs.push(id);
                }
            }
            
            generatedIDs = generatedIDs.concat(newIDs);
            updateGeneratedList();
            
            if (newIDs.length > 0) {
                // Show the first new ID
                document.getElementById('currentID').textContent = newIDs[0];
                displayValidationSteps(newIDs[0]);
                displayIDBreakdown(newIDs[0]);
            }
        }

        function updateGeneratedList() {
            if (generatedIDs.length === 0) {
                document.getElementById('idList').innerHTML = `
                    <div class="generated-item">
                        <span>No IDs generated yet</span>
                        <span class="item-meta">Use buttons above to generate</span>
                    </div>
                `;
                return;
            }
            
            let listHtml = '';
            generatedIDs.forEach((id, index) => {
                let components = parseIDComponents(id);
                listHtml += `
                    <div class="generated-item" onclick="showID('${id}')">
                        <span>${id}</span>
                        <span class="item-meta">${components.gender}, ${components.citizenship}</span>
                    </div>
                `;
            });
            
            document.getElementById('idList').innerHTML = listHtml;
        }

        function showID(id) {
            document.getElementById('currentID').textContent = id;
            displayValidationSteps(id);
            displayIDBreakdown(id);
        }

        function clearResults() {
            generatedIDs = [];
            document.getElementById('currentID').textContent = '0000000000000';
            document.getElementById('idList').innerHTML = `
                <div class="generated-item">
                    <span>0000000000000</span>
                    <span class="item-meta">Click to generate IDs</span>
                </div>
            `;
            displayIDBreakdown('0000000000000');
            displayValidationSteps('0000000000000');
        }

        function clearBirthDate() {
            document.getElementById('birthDate').value = '';
        }

        // Initialize on page load
        window.onload = function() {
            generateSingleID();
        };