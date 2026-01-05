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
      'Jesus rises from the dead the third day',
      'His Soul is rejoined to His Body',
      'His Body is transformed and glorified',
      'He conquers sin and death.',
      'He confounds His enemies.',
      'He appears to His holy Mother.',
      'He shows Himself to St. Mary Magdalene.',
      'He appears to His disciples.',
      'He shows His Wounds to St. Thomas.',
      'He teaches us to lead a new life - a life that is according to the teachings of our faith.'
    ],
    'The Ascension': [
      'Jesus appears to our Lady and His disciples on Mount Olivet.',
      'He gives them His last instructions',
      'He sends them to preach to the whole world.',
      'He lifts up His Hands and blesses them.',
      'He ascends into heaver',
      'The Angels welcome their King.',
      'He sits at the right hand of Hist Father.',
      'He is our Advocate in heaven.',
      'He prepares a place for us there.',
      'He teaches us to hope for heaven, and to desire heavenly things.'
    ],
    'The Descent of the Holy Spirit': [
      'Mary and the Apostles prepare for the coming of the Holy Spirit.',
      'Jesus sends the Holy Spirit on the day of Pentecost.',
      'A mighty wind fills the house.',
      'Fiery tougues rest on Mary and the Apostles.',
      'They are all filled with the Holy Spirit.',
      'They speak with divers tongues.',
      'Men of all nations are gathered to hear them.',
      'Filled with zeal, the Apostles preach to them.',
      'Three thousand souls are added to the Church.',
      'The Holy Spirit fills our souls with grace.'
    ],
    'The Assumption': [
      'Mary dies.',
      'The Apostles are gathered around her.',
      'The third day her soul is reunited to her body.',
      'Our Lord takes His Mother to heaven.',
      'The Angels come forth to meet her.',
      'The Father receives His beloved daughter.',
      'The Son welcomes His Mother to His kingdom.',
      'The Holy Spirit receives His spouse.',
      'She is exalted to the highest place in heaven.',
      'She is the Mother and Advocate of of Christians.'
    ],
    'The Coronation of Mary': [
      'God gives to Mary the rewards of her holy life.',
      'Mary is received in heaven by the Holy Trinity.',
      'She is crowned for her unshaken faith.',
      'She is crowned for her firm hope.',
      'She is crowned for her ardent love of God.',
      'She is crowned for her deep humility.',
      'She is crowned for her boundless charity',
      'She is crowned for her patience.',
      'She is crowned for her perserverance.',
      'She is the Mediatrix of all Graces.'
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

