import React, { useState } from "react";

// Mock data
const data = require("../data/mysteries.json");

function RosaryGuide() {
  const [currentMystery, setCurrentMystery] = useState(0);
  const [currentDecade, setCurrentDecade] = useState(0);
  const [hailMaryIndex, setHailMaryIndex] = useState(0);
  const [showGloryBe, setShowGloryBe] = useState(false); // State for Glory Be

  const mystery = data.mysteries[currentMystery];
  const decade = mystery.decades[currentDecade];
  const meditation = decade.meditations[hailMaryIndex];

  const nextHailMary = () => {
    if (showGloryBe) {
      // Finish Glory Be, transition to next phase
      setShowGloryBe(false); // Hide Glory Be
      if (currentDecade < mystery.decades.length - 1) {
        // Advance to the next decade
        setCurrentDecade((prev) => prev + 1);
        setHailMaryIndex(0); // Reset to first Hail Mary
      } else if (currentMystery < data.mysteries.length - 1) {
        // Advance to the next mystery
        setCurrentMystery((prev) => prev + 1);
        setCurrentDecade(0);
        setHailMaryIndex(0);
      }
    } else if (hailMaryIndex < 9) {
      // Increment Hail Mary index
      setHailMaryIndex((prev) => prev + 1);
    } else {
      // Trigger Glory Be
      setShowGloryBe(true);
    }
  };

  return (
    <div>
      <h1>{showGloryBe ? "Glory Be" : `${mystery.name} - ${decade.name}`}</h1>
      
      {showGloryBe ? (
        <p>Glory Be to the Father, and to the Son, and to the Holy Spirit...</p>
      ) : (
        <>
          <img src={`images/${decade.image}`} alt="decade" />
          <p>{meditation}</p>
          <p><strong>Hail Mary: </strong>Hail Mary, full of grace...</p>
        </>
      )}

      <button onClick={nextHailMary}>Next</button>
    </div>
  );
}

export default RosaryGuide;