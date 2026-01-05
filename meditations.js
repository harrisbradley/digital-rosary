// ========== MEDITATIONS FOR HAIL MARY PRAYERS ==========
// 📿 Short meditations (4-10 words) for each Hail Mary of every mystery
// Each mystery has 10 unique meditations (one for each Hail Mary in the decade)
// Total: 20 mysteries × 10 Hail Marys = 200 meditations

const MEDITATIONS = {
  Joyful: {
    'The Annunciation': [
      'Meditation for Hail Mary 1',  // Replace with 4-10 word meditation
      'Meditation for Hail Mary 2',  // Replace with 4-10 word meditation
      'Meditation for Hail Mary 3',  // Replace with 4-10 word meditation
      'Meditation for Hail Mary 4',  // Replace with 4-10 word meditation
      'Meditation for Hail Mary 5',  // Replace with 4-10 word meditation
      'Meditation for Hail Mary 6',  // Replace with 4-10 word meditation
      'Meditation for Hail Mary 7',  // Replace with 4-10 word meditation
      'Meditation for Hail Mary 8',  // Replace with 4-10 word meditation
      'Meditation for Hail Mary 9',  // Replace with 4-10 word meditation
      'Meditation for Hail Mary 10'  // Replace with 4-10 word meditation
    ],
    'The Visitation': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Nativity': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Presentation': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Finding in the Temple': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ]
  },
  Sorrowful: {
    'The Agony in the Garden': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Scourging at the Pillar': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Crowning with Thorns': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Carrying of the Cross': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Crucifixion': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ]
  },
  Glorious: {
    'The Resurrection': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Ascension': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Descent of the Holy Spirit': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Assumption': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Coronation of Mary': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ]
  },
  Luminous: {
    'The Baptism of the Lord': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Wedding at Cana': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Proclamation of the Kingdom': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Transfiguration': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ],
    'The Institution of the Eucharist': [
      'Meditation for Hail Mary 1',
      'Meditation for Hail Mary 2',
      'Meditation for Hail Mary 3',
      'Meditation for Hail Mary 4',
      'Meditation for Hail Mary 5',
      'Meditation for Hail Mary 6',
      'Meditation for Hail Mary 7',
      'Meditation for Hail Mary 8',
      'Meditation for Hail Mary 9',
      'Meditation for Hail Mary 10'
    ]
  }
};

