// ========== ROSARY VISUALIZATION ==========
// This module handles the visual rosary progress indicator

(function() {
  'use strict';

  // Map each step index to a bead/element in the rosary
  // Returns {type, decade, beadIndex} or null
  // Based on image: Cross → First large (Our Father) → 3 small (Hail Mary) → Second large (Glory Be) → Centerpiece
  function mapStepToBead(stepIdx) {
    if (stepIdx === 0) return {type: 'cross'}; // Sign of the Cross
    if (stepIdx === 1) return {type: 'cross'}; // Apostles' Creed - Step 1 points to cross
    if (stepIdx === 2) return {type: 'intro', bead: 'ourFather'}; // Our Father (Intro) - first large bead above cross
    if (stepIdx === 3) return {type: 'intro', bead: 'hailMary', count: 3}; // 3× Hail Mary - three small beads
    if (stepIdx === 4) return {type: 'intro', bead: 'gloryBe'}; // Glory Be - second large bead above the 3 small beads
    
    // Step 5: Announce the Mystery - maps to centerpiece
    if (stepIdx === 5) return {type: 'centerpiece'};
    
    // Decades start at step 5 (but step 5 is the centerpiece, so first decade Our Father is step 6)
    const decadeStartIdx = 5;
    const stepsPerDecade = 14; // Announce + Our Father + 10 Hail Marys + Glory Be + Fatima
    const decadeIdx = Math.floor((stepIdx - decadeStartIdx) / stepsPerDecade);
    
    if (decadeIdx < 0 || decadeIdx >= 5) return null; // Only 5 decades
    
    const stepInDecade = (stepIdx - decadeStartIdx) % stepsPerDecade;
    
    if (stepInDecade === 0) return {type: 'centerpiece'}; // Announce Mystery maps to centerpiece
    if (stepInDecade === 1) return {type: 'decade', decade: decadeIdx, bead: 'ourFather'};
    if (stepInDecade >= 2 && stepInDecade <= 11) return {type: 'decade', decade: decadeIdx, bead: 'hailMary', index: stepInDecade - 2};
    if (stepInDecade === 12) return {type: 'decade', decade: decadeIdx, bead: 'gloryBe'};
    if (stepInDecade === 13) return {type: 'decade', decade: decadeIdx, bead: 'fatima'};
    
    return null;
  }
  
  // Check if a bead represents the current step (for highlighting)
  function isCurrentStepBead(beadInfo, currentStepIdx) {
    if (!beadInfo) return false;
    const currentBead = mapStepToBead(currentStepIdx);
    if (!currentBead) return false;
    
    // Check if this bead matches the current step's bead
    if (beadInfo.type === 'cross' && currentBead.type === 'cross') return true;
    if (beadInfo.type === 'centerpiece' && currentBead.type === 'centerpiece') return true;
    
    if (beadInfo.type === 'intro' && currentBead.type === 'intro') {
      if (beadInfo.bead === currentBead.bead) {
        // For Hail Mary, check if index matches (if applicable)
        if (beadInfo.bead === 'hailMary') {
          const beadIdx = beadInfo.index || 0;
          const currentIdx = currentBead.index || 0;
          // If current step has a count (3× Hail Mary), color all 3 beads as current
          if (currentBead.count) return true;
          return beadIdx === currentIdx;
        }
        return true;
      }
    }
    
    if (beadInfo.type === 'decade' && currentBead.type === 'decade') {
      if (beadInfo.decade === currentBead.decade && beadInfo.bead === currentBead.bead) {
        // For Hail Mary, check if index matches
        if (beadInfo.bead === 'hailMary') {
          const beadIdx = beadInfo.index || 0;
          const currentIdx = currentBead.index || 0;
          return beadIdx === currentIdx;
        }
        return true;
      }
    }
    
    return false;
  }
  
  // Check if a bead should be colored based on current step
  // Colors all beads that represent steps <= currentStepIdx
  function shouldColorBead(beadInfo, currentStepIdx) {
    if (!beadInfo || currentStepIdx < 0) return false;
    
    // Check each step up to and including current step
    for (let i = 0; i <= currentStepIdx; i++) {
      const stepBead = mapStepToBead(i);
      if (!stepBead) continue;
      
      // Cross - color if we've reached step 0 or 1 (both map to cross)
      if (beadInfo.type === 'cross' && stepBead.type === 'cross') return true;
      
      // Intro beads - match exact bead type
      if (beadInfo.type === 'intro' && stepBead.type === 'intro') {
        // Our Father intro (step 2) - maps to ourFather bead (first large bead above cross), color once step 2 is reached
        if (beadInfo.bead === 'ourFather' && stepBead.bead === 'ourFather' && i >= 2) return true;
        
        // 3× Hail Mary intro (step 3) - color all 3 small beads when step 3 is reached
        if (beadInfo.bead === 'hailMary' && stepBead.bead === 'hailMary' && stepBead.count && i >= 3) {
          return true; // Color all 3 Hail Mary beads once step 3 is reached or passed
        }
        
        // Glory Be intro (step 4) - maps to gloryBe bead (second large bead above the 3 small beads), color once step 4 is reached
        if (beadInfo.bead === 'gloryBe' && stepBead.bead === 'gloryBe' && i >= 4) return true;
      }
      
      // Centerpiece - color if we've reached step 5 (Announce Mystery)
      if (beadInfo.type === 'centerpiece' && stepBead.type === 'centerpiece' && i >= 5) return true;
      
      // Decade beads
      if (beadInfo.type === 'decade' && stepBead.type === 'decade') {
        // If we're past this decade, color it
        if (beadInfo.decade < stepBead.decade) return true;
        
        // If we're in the same decade
        if (beadInfo.decade === stepBead.decade) {
          // Our Father beads
          if (beadInfo.bead === 'ourFather' && stepBead.bead === 'ourFather') return true;
          
          // Hail Mary beads
          if (beadInfo.bead === 'hailMary' && stepBead.bead === 'hailMary') {
            const beadIdx = beadInfo.index || 0;
            const stepIdx = stepBead.index || 0;
            // Color if this bead's index <= the step's index
            // Step indices for Hail Marys are 2-11 (10 beads), bead indices are 0-9
            if (beadIdx <= stepIdx) return true;
          }
          
          // Glory Be beads
          if (beadInfo.bead === 'gloryBe' && stepBead.bead === 'gloryBe') return true;
          
          // Fatima Prayer beads
          if (beadInfo.bead === 'fatima' && stepBead.bead === 'fatima') return true;
        }
      }
    }
    
    return false;
  }
  
  // Render the visual rosary SVG - matches traditional rosary structure
  function renderRosary(stepIndex, guideLength, targetElement) {
    if (!targetElement) return;
    
    // SVG dimensions - wider to accommodate oval shape
    const width = 320;
    const height = 380;
    const centerX = width / 2;
    
    // Colors from the image description
    const uncoloredColor = '#e5e7eb'; // Light gray
    const uncoloredOutline = '#9ca3af'; // Darker gray
    const coloredColor = '#1862A8'; // Primary blue when colored (completed)
    const currentColor = '#dc2626'; // Red for current step
    const chainColor = '#9ca3af';
    const crossFill = '#ffd700'; // Yellow
    const crossOutline = '#000000'; // Black
    
    // Oval loop dimensions (elongated horizontally)
    const ovalCenterY = 140; // Position oval loop higher
    const ovalRadiusX = 120; // Horizontal radius
    const ovalRadiusY = 75;  // Vertical radius (smaller = more elongated)
    
    // Drop section dimensions
    const dropStartY = ovalCenterY + ovalRadiusY; // Bottom of oval
    const starY = dropStartY + 25; // Star centerpiece
    const starSize = 12;
    
    // Intro beads positions (below star)
    const introBeadStartY = starY + 25;
    const beadSpacing = 14;
    const largeBeadRadius = 7;
    const smallBeadRadius = 5;
    
    // Cross position (at bottom)
    const crossY = height - 40;
    const crossSize = 20;
    
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;">`;
    
    // Draw oval loop path (the main rosary loop) - flipped horizontally
    // Path direction reversed to match horizontal flip
    const ovalPath = `M ${centerX} ${ovalCenterY - ovalRadiusY} A ${ovalRadiusX} ${ovalRadiusY} 0 0 0 ${centerX - ovalRadiusX} ${ovalCenterY} A ${ovalRadiusX} ${ovalRadiusY} 0 0 0 ${centerX} ${ovalCenterY + ovalRadiusY} A ${ovalRadiusX} ${ovalRadiusY} 0 0 0 ${centerX + ovalRadiusX} ${ovalCenterY} A ${ovalRadiusX} ${ovalRadiusY} 0 0 0 ${centerX} ${ovalCenterY - ovalRadiusY} Z`;
    svg += `<path d="${ovalPath}" fill="none" stroke="${chainColor}" stroke-width="1.5" opacity="0.4"/>`;
    
    // Draw 5 decades around the oval loop (55 beads total: 5 large + 50 small)
    // Position decades evenly around the oval
    const numDecades = 5;
    const beadsPerDecade = 11; // 1 Our Father + 10 Hail Marys
    const totalBeads = 55;
    
    // Rotation angle: Align the break between last Hail Mary and next Our Father with bottom (where star connects)
    // Each decade spans 72 degrees (2π/5). The breaks between decades are at multiples of 72 degrees.
    // Rotate so a break point (between last Hail Mary of one decade and Our Father of next) is at the bottom.
    // Bottom is at Math.PI/2 in standard coordinates. We want a break point there.
    // The breaks occur at the boundaries between decades. Rotate by Math.PI/2 to position break at bottom.
    // Adjusted: Rotated counter-clockwise 4 degrees from base position
    const rotationOffset = Math.PI / 2 + (6 * Math.PI / 180); // 4 degrees counter-clockwise from base
    
    for (let d = 0; d < numDecades; d++) {
      // Calculate angle around the oval for this decade
      // Flip horizontally by negating cosine, rotate so break aligns with bottom
      let decadeAngle = (d / numDecades) * Math.PI * 2 + rotationOffset;
      // Flip horizontally: negate the angle's cosine component
      const decadeCenterX = centerX - Math.cos(decadeAngle) * ovalRadiusX; // Negate for horizontal flip
      const decadeCenterY = ovalCenterY + Math.sin(decadeAngle) * ovalRadiusY;
      
      // Our Father bead (larger) at the start of each decade
      // Skip OF-1 (Our Father bead from Decade 1)
      if (d !== 0) {
        const ofBead = {type: 'decade', decade: d, bead: 'ourFather'};
        const isOFCurrent = isCurrentStepBead(ofBead, stepIndex);
        const isOFColored = shouldColorBead(ofBead, stepIndex);
        const ofColor = isOFCurrent ? currentColor : (isOFColored ? coloredColor : uncoloredColor);
        const ofOutline = isOFCurrent ? currentColor : (isOFColored ? coloredColor : uncoloredOutline);
        svg += `<circle cx="${decadeCenterX}" cy="${decadeCenterY}" r="${largeBeadRadius}" fill="${ofColor}" stroke="${ofOutline}" stroke-width="1.5"/>`;
      }
      
      // 10 Hail Mary beads (smaller) following the Our Father bead
      // Position them in an arc following the oval curve
      for (let h = 0; h < 10; h++) {
        // Spread beads along the oval curve
        const beadOffsetAngle = (h / 9) * (Math.PI * 2 / numDecades) * 0.8;
        const beadAngle = decadeAngle + beadOffsetAngle;
        const beadX = centerX - Math.cos(beadAngle) * ovalRadiusX; // Negate for horizontal flip
        const beadY = ovalCenterY + Math.sin(beadAngle) * ovalRadiusY;
        
        const hmBead = {type: 'decade', decade: d, bead: 'hailMary', index: h};
        const isHMCurrent = isCurrentStepBead(hmBead, stepIndex);
        const isHMColored = shouldColorBead(hmBead, stepIndex);
        const hmColor = isHMCurrent ? currentColor : (isHMColored ? coloredColor : uncoloredColor);
        const hmOutline = isHMCurrent ? currentColor : (isHMColored ? coloredColor : uncoloredOutline);
        svg += `<circle cx="${beadX}" cy="${beadY}" r="${smallBeadRadius}" fill="${hmColor}" stroke="${hmOutline}" stroke-width="1.5"/>`;
      }
    }
    
    // Draw drop section: connection from oval to centerpiece
    svg += `<line x1="${centerX}" y1="${dropStartY}" x2="${centerX}" y2="${starY}" stroke="${chainColor}" stroke-width="1.5" opacity="0.4"/>`;
    
    // Draw star centerpiece (five-pointed star)
    const centerpieceBead = {type: 'centerpiece'};
    const isCenterpieceCurrent = isCurrentStepBead(centerpieceBead, stepIndex);
    const isCenterpieceColored = shouldColorBead(centerpieceBead, stepIndex);
    const starColor = isCenterpieceCurrent ? currentColor : (isCenterpieceColored ? coloredColor : uncoloredColor);
    const starOutline = isCenterpieceCurrent ? currentColor : (isCenterpieceColored ? coloredColor : uncoloredOutline);
    
    // Create five-pointed star path
    let starPath = '';
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const r = (i % 2 === 0) ? starSize : starSize * 0.4;
      const x = centerX + Math.cos(angle) * r;
      const y = starY + Math.sin(angle) * r;
      starPath += (i === 0 ? 'M' : 'L') + ` ${x} ${y}`;
    }
    starPath += ' Z';
    svg += `<path d="${starPath}" fill="${starColor}" stroke="${starOutline}" stroke-width="1.5"/>`;
    
    // Draw intro section below star: 1 large, 3 small, 1 large
    // Order from top to bottom: Glory Be → 3 Hail Marys → Our Father → Cross
    let currentY = introBeadStartY;
    
    // First large bead (closest to star) - Glory Be (Step 4)
    const introGloryBead = {type: 'intro', bead: 'gloryBe'};
    const isIntroGloryCurrent = isCurrentStepBead(introGloryBead, stepIndex);
    const isIntroGloryColored = shouldColorBead(introGloryBead, stepIndex);
    const introGloryColor = isIntroGloryCurrent ? currentColor : (isIntroGloryColored ? coloredColor : uncoloredColor);
    const introGloryOutline = isIntroGloryCurrent ? currentColor : (isIntroGloryColored ? coloredColor : uncoloredOutline);
    svg += `<line x1="${centerX}" y1="${starY + starSize}" x2="${centerX}" y2="${currentY}" stroke="${chainColor}" stroke-width="1.5" opacity="0.4"/>`;
    svg += `<circle cx="${centerX}" cy="${currentY}" r="${largeBeadRadius}" fill="${introGloryColor}" stroke="${introGloryOutline}" stroke-width="1.5"/>`;
    currentY += largeBeadRadius + beadSpacing;
    
    // 3 small beads (Hail Marys) - Step 3
    for (let i = 0; i < 3; i++) {
      svg += `<line x1="${centerX}" y1="${currentY - beadSpacing + (i === 0 ? largeBeadRadius : smallBeadRadius)}" x2="${centerX}" y2="${currentY}" stroke="${chainColor}" stroke-width="1.5" opacity="0.4"/>`;
      const hailMaryBead = {type: 'intro', bead: 'hailMary', index: i};
      const isHMCurrent = isCurrentStepBead(hailMaryBead, stepIndex);
      const isHMColored = shouldColorBead(hailMaryBead, stepIndex);
      const hmColor = isHMCurrent ? currentColor : (isHMColored ? coloredColor : uncoloredColor);
      const hmOutline = isHMCurrent ? currentColor : (isHMColored ? coloredColor : uncoloredOutline);
      svg += `<circle cx="${centerX}" cy="${currentY}" r="${smallBeadRadius}" fill="${hmColor}" stroke="${hmOutline}" stroke-width="1.5"/>`;
      currentY += smallBeadRadius + beadSpacing;
    }
    
    // Last large bead (closest to cross) - Our Father (Step 2)
    svg += `<line x1="${centerX}" y1="${currentY - beadSpacing + smallBeadRadius}" x2="${centerX}" y2="${currentY}" stroke="${chainColor}" stroke-width="1.5" opacity="0.4"/>`;
    const introOFBead = {type: 'intro', bead: 'ourFather'};
    const isIntroOFCurrent = isCurrentStepBead(introOFBead, stepIndex);
    const isIntroOFColored = shouldColorBead(introOFBead, stepIndex);
    const introOFColor = isIntroOFCurrent ? currentColor : (isIntroOFColored ? coloredColor : uncoloredColor);
    const introOFOutline = isIntroOFCurrent ? currentColor : (isIntroOFColored ? coloredColor : uncoloredOutline);
    svg += `<circle cx="${centerX}" cy="${currentY}" r="${largeBeadRadius}" fill="${introOFColor}" stroke="${introOFOutline}" stroke-width="1.5"/>`;
    const lastBeadBottom = currentY + largeBeadRadius;
    
    // Draw connection from last intro bead to cross - make sure cross is below the bead
    const crossTop = lastBeadBottom + 20; // Add space between last bead and cross
    const actualCrossY = crossTop + crossSize / 2;
    svg += `<line x1="${centerX}" y1="${lastBeadBottom}" x2="${centerX}" y2="${crossTop}" stroke="${chainColor}" stroke-width="1.5" opacity="0.4"/>`;
    
    // Draw cross at bottom (yellow with black outline) - position it below the last bead
    const crossBeadInfo = {type: 'cross'};
    const isCrossCurrent = isCurrentStepBead(crossBeadInfo, stepIndex);
    const isCrossColored = shouldColorBead(crossBeadInfo, stepIndex);
    // Keep cross yellow, but outline can change color if current (red) or colored (blue)
    const crossOutlineColor = isCrossCurrent ? currentColor : (isCrossColored ? coloredColor : crossOutline);
    // Draw outline first (black/colored)
    svg += `<line x1="${centerX}" y1="${actualCrossY - crossSize/2}" x2="${centerX}" y2="${actualCrossY + crossSize/2}" stroke="${crossOutlineColor}" stroke-width="3" stroke-linecap="round"/>`;
    svg += `<line x1="${centerX - crossSize/2}" y1="${actualCrossY}" x2="${centerX + crossSize/2}" y2="${actualCrossY}" stroke="${crossOutlineColor}" stroke-width="3" stroke-linecap="round"/>`;
    // Draw yellow fill on top
    svg += `<line x1="${centerX}" y1="${actualCrossY - crossSize/2}" x2="${centerX}" y2="${actualCrossY + crossSize/2}" stroke="${crossFill}" stroke-width="2" stroke-linecap="round"/>`;
    svg += `<line x1="${centerX - crossSize/2}" y1="${actualCrossY}" x2="${centerX + crossSize/2}" y2="${actualCrossY}" stroke="${crossFill}" stroke-width="2" stroke-linecap="round"/>`;
    
    svg += `</svg>`;
    
    targetElement.innerHTML = svg;
  }
  
  // Export the renderRosary function for use in other scripts
  window.RosaryVisualizer = {
    render: renderRosary
  };
  
})();

