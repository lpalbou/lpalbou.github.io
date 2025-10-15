const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');
        
        console.log('🔍 ANALYZING SPECIFIC SECTIONS IN DARK THEME');
        console.log('==============================================\n');
        
        // Toggle to dark mode
        await page.click('#theme-toggle');
        await page.waitForTimeout(1000); // Wait for theme transition
        
        // Take screenshot of dark mode
        await page.screenshot({ 
            path: 'dark-sections-analysis.png', 
            fullPage: true 
        });
        
        // Analyze specific problematic sections
        const sectionAnalysis = await page.evaluate(() => {
            function getContrastRatio(color1, color2) {
                function getLuminance(r, g, b) {
                    const [rs, gs, bs] = [r, g, b].map(c => {
                        c = c / 255;
                        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                    });
                    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
                }
                
                function parseColor(color) {
                    const div = document.createElement('div');
                    div.style.color = color;
                    document.body.appendChild(div);
                    const computed = getComputedStyle(div).color;
                    document.body.removeChild(div);
                    
                    const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                    return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
                }
                
                const [r1, g1, b1] = parseColor(color1);
                const [r2, g2, b2] = parseColor(color2);
                
                const l1 = getLuminance(r1, g1, b1);
                const l2 = getLuminance(r2, g2, b2);
                
                const lighter = Math.max(l1, l2);
                const darker = Math.min(l1, l2);
                
                return (lighter + 0.05) / (darker + 0.05);
            }
            
            const results = [];
            
            // 1. Research & Publications Section
            console.log('Analyzing Research & Publications section...');
            const researchSection = document.querySelector('#research');
            if (researchSection) {
                const sectionBg = getComputedStyle(researchSection).backgroundColor;
                
                // Check research items
                const researchItems = researchSection.querySelectorAll('.research-item, .detail-item');
                researchItems.forEach((item, i) => {
                    const itemBg = getComputedStyle(item).backgroundColor;
                    const title = item.querySelector('h3, h4');
                    const text = item.querySelector('p');
                    
                    if (title) {
                        const titleColor = getComputedStyle(title).color;
                        results.push({
                            section: 'Research & Publications',
                            element: `Research item ${i + 1} title`,
                            background: itemBg,
                            color: titleColor,
                            contrast: getContrastRatio(titleColor, itemBg).toFixed(2),
                            wcagAA: getContrastRatio(titleColor, itemBg) >= 4.5 ? '✅' : '❌'
                        });
                    }
                    
                    if (text) {
                        const textColor = getComputedStyle(text).color;
                        results.push({
                            section: 'Research & Publications',
                            element: `Research item ${i + 1} text`,
                            background: itemBg,
                            color: textColor,
                            contrast: getContrastRatio(textColor, itemBg).toFixed(2),
                            wcagAA: getContrastRatio(textColor, itemBg) >= 4.5 ? '✅' : '❌'
                        });
                    }
                });
            }
            
            // 2. Featured Projects Section
            console.log('Analyzing Featured Projects section...');
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
                const projectCards = projectsSection.querySelectorAll('.project-card, .detail-item');
                projectCards.forEach((card, i) => {
                    const cardBg = getComputedStyle(card).backgroundColor;
                    const title = card.querySelector('h3, h4');
                    const text = card.querySelector('p');
                    
                    if (title) {
                        const titleColor = getComputedStyle(title).color;
                        results.push({
                            section: 'Featured Projects',
                            element: `Project ${i + 1} title`,
                            background: cardBg,
                            color: titleColor,
                            contrast: getContrastRatio(titleColor, cardBg).toFixed(2),
                            wcagAA: getContrastRatio(titleColor, cardBg) >= 4.5 ? '✅' : '❌'
                        });
                    }
                    
                    if (text) {
                        const textColor = getComputedStyle(text).color;
                        results.push({
                            section: 'Featured Projects',
                            element: `Project ${i + 1} text`,
                            background: cardBg,
                            color: textColor,
                            contrast: getContrastRatio(textColor, cardBg).toFixed(2),
                            wcagAA: getContrastRatio(textColor, cardBg) >= 4.5 ? '✅' : '❌'
                        });
                    }
                });
            }
            
            // 3. Contact Form Section
            console.log('Analyzing Contact Form section...');
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const form = contactSection.querySelector('form');
                if (form) {
                    const formBg = getComputedStyle(form).backgroundColor;
                    
                    // Check form labels
                    const labels = form.querySelectorAll('label');
                    labels.forEach((label, i) => {
                        const labelColor = getComputedStyle(label).color;
                        results.push({
                            section: 'Contact Form',
                            element: `Label ${i + 1}`,
                            background: formBg,
                            color: labelColor,
                            contrast: getContrastRatio(labelColor, formBg).toFixed(2),
                            wcagAA: getContrastRatio(labelColor, formBg) >= 4.5 ? '✅' : '❌'
                        });
                    });
                    
                    // Check form inputs
                    const inputs = form.querySelectorAll('input, textarea');
                    inputs.forEach((input, i) => {
                        const inputBg = getComputedStyle(input).backgroundColor;
                        const inputColor = getComputedStyle(input).color;
                        const placeholder = input.getAttribute('placeholder');
                        
                        results.push({
                            section: 'Contact Form',
                            element: `Input ${i + 1} (${placeholder || input.type})`,
                            background: inputBg,
                            color: inputColor,
                            contrast: getContrastRatio(inputColor, inputBg).toFixed(2),
                            wcagAA: getContrastRatio(inputColor, inputBg) >= 4.5 ? '✅' : '❌'
                        });
                    });
                    
                    // Check submit button
                    const submitBtn = form.querySelector('button[type="submit"], .btn');
                    if (submitBtn) {
                        const btnBg = getComputedStyle(submitBtn).backgroundColor;
                        const btnColor = getComputedStyle(submitBtn).color;
                        results.push({
                            section: 'Contact Form',
                            element: 'Submit button',
                            background: btnBg,
                            color: btnColor,
                            contrast: getContrastRatio(btnColor, btnBg).toFixed(2),
                            wcagAA: getContrastRatio(btnColor, btnBg) >= 4.5 ? '✅' : '❌'
                        });
                    }
                }
            }
            
            return results;
        });
        
        // Display results grouped by section
        console.log('CONTRAST ANALYSIS BY SECTION:');
        console.log('WCAG AA requires 4.5:1 for normal text\n');
        
        const sections = ['Research & Publications', 'Featured Projects', 'Contact Form'];
        
        sections.forEach(sectionName => {
            const sectionResults = sectionAnalysis.filter(r => r.section === sectionName);
            if (sectionResults.length > 0) {
                console.log(`📚 ${sectionName.toUpperCase()}:`);
                sectionResults.forEach(result => {
                    console.log(`  ${result.element}:`);
                    console.log(`    Contrast: ${result.contrast}:1 ${result.wcagAA}`);
                    console.log(`    Colors: ${result.color} on ${result.background}`);
                });
                console.log('');
            }
        });
        
        // Identify all failing elements
        const failingElements = sectionAnalysis.filter(r => r.wcagAA === '❌');
        if (failingElements.length > 0) {
            console.log('🚨 ELEMENTS FAILING WCAG AA CONTRAST:');
            failingElements.forEach(el => {
                console.log(`  - ${el.section}: ${el.element} (${el.contrast}:1)`);
            });
            console.log('');
        }
        
        // Check for specific styling issues
        const stylingIssues = await page.evaluate(() => {
            const issues = [];
            
            // Check if sections have proper dark theme backgrounds
            const sections = ['#research', '#projects', '#contact'];
            sections.forEach(selector => {
                const section = document.querySelector(selector);
                if (section) {
                    const bg = getComputedStyle(section).backgroundColor;
                    const color = getComputedStyle(section).color;
                    
                    // Check if background is too light for dark theme
                    if (bg.includes('255, 255, 255') || bg.includes('248, 250, 252')) {
                        issues.push(`${selector}: Using light background in dark theme (${bg})`);
                    }
                    
                    // Check if text color is too dark for dark theme
                    if (color.includes('51, 65, 85') || color.includes('30, 41, 59')) {
                        issues.push(`${selector}: Using dark text in dark theme (${color})`);
                    }
                }
            });
            
            // Check form styling specifically
            const form = document.querySelector('#contact form');
            if (form) {
                const formBg = getComputedStyle(form).backgroundColor;
                const inputs = form.querySelectorAll('input, textarea');
                
                inputs.forEach((input, i) => {
                    const inputBg = getComputedStyle(input).backgroundColor;
                    const inputColor = getComputedStyle(input).color;
                    const borderColor = getComputedStyle(input).borderColor;
                    
                    if (inputBg.includes('255, 255, 255')) {
                        issues.push(`Form input ${i + 1}: White background in dark theme`);
                    }
                    if (inputColor.includes('51, 65, 85')) {
                        issues.push(`Form input ${i + 1}: Dark text in dark theme`);
                    }
                });
            }
            
            return issues;
        });
        
        if (stylingIssues.length > 0) {
            console.log('⚠️ DARK THEME STYLING ISSUES:');
            stylingIssues.forEach(issue => {
                console.log(`  - ${issue}`);
            });
            console.log('');
        }
        
        // Scroll to each problematic section and take focused screenshots
        console.log('📸 Taking focused screenshots of problematic sections...');
        
        // Research section
        await page.locator('#research').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await page.screenshot({ 
            path: 'research-section-dark.png',
            clip: await page.locator('#research').boundingBox()
        });
        
        // Projects section
        await page.locator('#projects').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await page.screenshot({ 
            path: 'projects-section-dark.png',
            clip: await page.locator('#projects').boundingBox()
        });
        
        // Contact section
        await page.locator('#contact').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await page.screenshot({ 
            path: 'contact-section-dark.png',
            clip: await page.locator('#contact').boundingBox()
        });
        
        console.log('📊 ANALYSIS COMPLETE');
        console.log('Screenshots saved:');
        console.log('  - dark-sections-analysis.png (full page)');
        console.log('  - research-section-dark.png');
        console.log('  - projects-section-dark.png');
        console.log('  - contact-section-dark.png');
        
    } catch (error) {
        console.error('Error during analysis:', error);
    } finally {
        await browser.close();
    }
})();
