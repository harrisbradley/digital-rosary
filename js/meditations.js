// ========== MEDITATIONS FOR HAIL MARY PRAYERS ==========
// 📿 Short meditations (4-10 words) for each Hail Mary of every mystery
// Each mystery has 10 unique meditations (one for each Hail Mary in the decade)
// Total: 20 mysteries × 10 Hail Marys = 200 meditations

const MEDITATIONS = {
  Joyful: {
    'The Annunciation': [
      'The Eternal Father decrees that His Son shall become Man.',  
      'Mary is chosen to be His Mother.',  
      'The Angel Gabriel is sent to her.',  
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
      'She goes promptly to fulfill His will.',  
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
      'Mary and Joseph return seeking Him.',  
      'They seek Him three days.',  
      'Joseph and Mary are profoundly saddened.',  
      'They find Him in the Temple.',  
      'Their hearts are full of joy and happiness!',  
      'He is seated among the Doctors',  
      'Jesus teaches us to love the service of God.'  
    ]
  },
  Sorrowful: {
    'The Agony in the Garden': [
      'Jesus goes to the garden with His Apostles.',
      'He is sorrowful even unto death.',
      'He bids His Apostles to watch and pray.',
      'He goes apart to pray to His Father.',
      'He prays prostrate on the ground.',
      'He resigns His Will to the Will of His Father.',
      'He finds His Apostles fast asleep.  Their spirit is willing but their flesh is weak.',
      'He is bathed in a sweat of blood.',
      'An Angel strengthens Him.',
      'Jesus teaches us to seek help in prayer and patience in sufferings.'
    ], 
    'The Scourging at the Pillar': [
      'The Jews clamor for the death of our Lord.',
      'Pilate condemns Him to be scourged.',
      'He is given up to the Roman soldiery.',
      'They strip Him of His garments',
      'They tie Him to a column.',
      'They violently scourge Him.',
      'His Flesh is bruised and torn.',
      'His Blood flows in torrents to the ground.',
      'His whole Body is one great wound.',
      'He teaches us to mortify our sinful bodies.'
    ],
    'The Crowning with Thorns': [
      'The soldiers plait a crown of thorns.',
      'They place it on our Lord\'s head.',
      'His Head is pierced with the thorns.',
      'They clothe Him with a purple robe.',
      'A reed is placed in His Hand.',
      'They kneel in mockery before Him.',
      'They say, "Hail, King of the Jews!"',
      'They strike Him and spit upon Him.',
      'Pilate says to the people, "Behold your King!"',
      'Jesus teaches us to bear shame with courage'
    ],
    'The Carrying of the Cross': [
      'Pilate condemns our Lord to death.',
      'The Cross is laid upon our Lord.',
      'He receives it with joy.',
      'He sets forth on His way to Calvary.',
      'He falls several times under the Cross.',
      'He meets His holy Mother.',
      'Simon helps Him to bear the Cross.',
      'Veronica wipes His face.',
      'He speaks to the women of Jerusalem.',
      'He teaches us to bear our crosses with patience'
    ],
    'The Crucifixion': [
      'Our Lord is nailed to the Cross.',
      'He is placed between two thieves.',
      'He is mocked by His enemies.',
      'He prays for them.',
      'He forgives the penitent thief.',
      'Mary and John and the holy women stand by the Cross.',
      'Jesus gives us Mary to be our Mother',
      'He commends His Soul to His Father\'s hands.',
      'He dies for our salvation.',
      'He teaches us to sacrifice ourselves generously for His sake.'
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
      'Fiery tongues rest on Mary and the Apostles.',
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
      'She is the Mother and Advocate of Christians.'
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
      'She is crowned for her perseverance.',
      'She is the Mediatrix of all Graces.'
    ]
  },
  Luminous: {
    'The Baptism of the Lord': [
      'John is baptizing in the Jordan proclaiming a baptism of repentance.',
      '“I am the voice of one crying in the desert, make straight the way of the Lord.”',
      'One mightier than I is coming after me.',
      '“I have baptized you with water, He will baptize you with the Holy Spirit.”',
      'Seeing Jesus, John exclaims: “Behold the Lamb of God.”',
      'Against protests of his unworthiness, John baptizes Jesus in the Jordan.',
      'After Jesus’ baptism a voice from Heaven: “This is my beloved Son in whom I am well pleased.”',
      'The Spirit descends upon Jesus in the form of a dove.',
      'In this heavenly manifestation is instituted the sacrament of baptism.',
      'The divine Trinity is manifested: the voice of the Father is heard as the Spirit descends upon the Son.'
    ],
    'The Wedding at Cana': [
      'Jesus, His Mother and disciples were invited to a wedding in Cana.',
      'During the wedding feast the wine ran short.',
      'Mary turned to Jesus: “They have no wine.”',
      'Jesus replied: “What would you have Me do? My hour has not yet come.”',
      'Mary said to the waiters: “Do whatever He tells you.”',
      'There were six stone water jars, each holding fifteen to twenty gallons.',
      'Jesus bids the waiters to fill the jars with water, and then draw some out and take it to the chief steward.',
      'The chief steward said to the groom: “Every man serves the good wine first… but you have saved the good wine until now.”',
      'At Mary’s request, Jesus worked His first miracle.',
      'By His presence, Christian marriage was raised to the dignity of a Sacrament.'
    ],
    'The Proclamation of the Kingdom': [
      '“Repent, for the kingdom of God is at hand.”',
      '“My kingdom is not of this world.”',
      '“Unless a man be born again of water and the Spirit, he cannot enter the kingdom of heaven.”',
      '“Whoever does not accept the kingdom of God as a little child will not enter into it.”',
      '“I have come to call sinners, not the just.”',
      '“Love your enemies, pray for those who persecute you.”',
      '“Blessed are the poor in spirit, for theirs is the kingdom of heaven.”',
      '“Blessed are they who hunger and thirst for justice, for they shall be satisfied.”',
      '“Blessed are they who suffer persecution for justice’ sake, for theirs is the kingdom of heaven.”',
      '“You are Peter, and upon this rock I will build My church… I will give you the keys of the kingdom of heaven.”'
    ],
    'The Transfiguration': [
      'Jesus took Peter, James and John up a high mountain to pray.',
      'Jesus was transfigured before them.',
      '“His face became as dazzling as the sun, his clothes as radiant as light.”',
      'This was to fortify their faith to withstand the coming tragedy of the Passion.',
      'Jesus foresaw the ‘scandal of the cross,’ and prepared them for it by this manifestation of His glory.',
      'Moses and Elias (representing the Law and the prophets of the Old Testament) were conversing with Jesus about His Passion.',
      '“Do not think I have come to destroy the Law or the Prophets… but to fulfill them.”',
      'From a cloud came a voice: “This is my beloved Son, listen to Him.”',
      'Jesus admonishes them not to tell the vision to anyone until the Son of Man rises from the dead.',
      'We too will behold the transfigured Jesus on the Last Day.'
    ],
    'The Institution of the Eucharist': [
      'I have eagerly desired to eat this Passover with you before I suffer.',
      'Jesus took bread, blessed it: “Take and eat, this is My Body.”',
      'Taking the wine: “This cup is the new covenant in my Blood, shed for you.”',
      'At that eucharistic meal, Jesus celebrated the first Mass.',
      'At every Mass the sacrifice of Calvary is made present.',
      'At the Last Supper Jesus instituted the sacrament of Holy Orders to perpetuate this sacrifice.',
      '“Whoever eats my flesh and drinks my blood remains in me and I in him.”',
      'The Eucharist is a sacrifice inasmuch as it is offered up, and a sacrament inasmuch as it is received.',
      'In the Mass we offer ourselves to God, and God gives himself to us.',
      'The Mass will be fruitful in the measure of our surrender to the Father.'
    ]
  }
};

