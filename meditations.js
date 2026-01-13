// ========== MEDITATIONS FOR HAIL MARY PRAYERS ==========
// 📿 Short meditations (4-10 words) for each Hail Mary of every mystery
// Each mystery has 10 unique meditations (one for each Hail Mary in the decade)
// Total: 20 mysteries × 10 Hail Marys = 200 meditations

const MEDITATIONS = {
  Joyful: {
    'The Annunciation': [
      'The Eternal Father decrees that His Son shall become Man.',  
      'Mary is chosen to be His Mother.',  
      'The Angle Gabriel is sent to her.',  
      'He salutes her, "Hail, full of grace!"',  
      'He tells her she is to be the Mother of our Lord.',  
      'Mary answers, "How shall this be?"',  
      'The Angel says, "The Holy Ghost shall come upon thee."',  
      'Mary replies, "Behold the handmaid of the Lord."',  
      'Our Lord becomes Man.',  
      'Let us learn humility from Jesus and Mary.'  
    ],
    'The Visitation': [
      'Our Lord inspires His Mother to visit her cousin Elizabeth.',  
      'She goes promply to fulfill His will.',  
      'She crosses the hill-country in haste.',  
      'She greets her cousin Elizabeth.',  
      'St. Elizabeth is filled with the Holy Spirit.',  
      'She says, "Blessed art thou among women."',  
      'St. John the Baptist is sanctified before his birth.',  
      'Mary sings her song of praise.',  
      'She remains three months serving her cousin.',  
      'Jesus and Mary teach us charity to our neighbor.'   
    ],
    'The Nativity': [
      'Mary and Joseph come to Bethlehem.',  
      'They take refuge in a poor stable.',  
      'There our Lord is born.',  
      'His Mother wraps Him in swaddling clothes.',  
      'She lays Him in a manger.',  
      'An Angel announces His Birth to the Shepherds.',  
      'The Angels sing glory to God in the highest.',  
      'The Shepherds adore our Lord.',  
      'The Magi are guided to Him by a star.',  
      'Our Lord teaches us poverty and detachment.'  
    ],
    'The Presentation': [
      'Mary takes her Son to the Temple.',  
      'She presents Him to His Eternal Father.',  
      'She offers a pair of turtle doves for Him.',  
      'She fulfills exactly all the commands of the Law.',  
      'Jesus offers Himself to His Father.',  
      'Simeon takes our Lord into his arms.',  
      'He thanks God for the sight of Jesus.',  
      'He prophesies our Lord\'s Exaltation.',  
      'He foretells our Lady\'s sorrows.',  
      'Jesus and Mary teach us obedience.'  
    ],
    'The Finding in the Temple': [
      'Jesus goes with Mary and Joseph to Jerusalem.',  
      'When they return after the Feast, Jesus remains.',  
      'He stays in the Temple.',  
      'Mary and Joseph returns seeking Him.',  
      'They seek Him three days.',  
      'Joseph and Mary are profoundly saddened.',  
      'They find Him in the Temple.',  
      'Their hearts are full of joy and happiness!',  
      'He is seated amonst the Doctors',  
      'Jesus teaches us to love the service of God.'  
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
      'He ascends into heaven.',
      'The Angels welcome their King.',
      'He sits at the right hand of His Father.',
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

