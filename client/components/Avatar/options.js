module.exports = {
  categories: {
    skinColor: [
      { type: 'Tanned' },
      { type: 'Yellow' },
      { type: 'Pale' },
      { type: 'Light' },
      { type: 'Brown' },
      { type: 'DarkBrown' },
      { type: 'Black' }
    ],
    topType: [
      { type: 'NoHair' },
      { type: 'Eyepatch', disableAccessories: true },
      { type: 'Hat' },
      { type: 'Hijab', disableFacialHair: true, variations: [ 'hatColor' ] },
      { type: 'Turban', variations: [ 'hatColor' ] },
      { type: 'WinterHat1', variations: [ 'hatColor' ] },
      { type: 'WinterHat2', variations: [ 'hatColor' ] },
      { type: 'WinterHat3', variations: [ 'hatColor' ] },
      { type: 'WinterHat4', variations: [ 'hatColor' ] },
      { type: 'LongHairBigHair', variations: [ 'hairColor' ] },
      { type: 'LongHairBob', variations: [ 'hairColor' ] },
      { type: 'LongHairBun', variations: [ 'hairColor' ] },
      { type: 'LongHairCurly', variations: [ 'hairColor' ] },
      { type: 'LongHairCurvy', variations: [ 'hairColor' ] },
      { type: 'LongHairDreads', variations: [ 'hairColor' ] },
      { type: 'LongHairFrida' },
      { type: 'LongHairFro', variations: [ 'hairColor' ] },
      { type: 'LongHairFroBand', variations: [ 'hairColor' ] },
      { type: 'LongHairNotTooLong', variations: [ 'hairColor' ] },
      { type: 'LongHairShavedSides' },
      { type: 'LongHairMiaWallace', variations: [ 'hairColor' ] },
      { type: 'LongHairStraight', variations: [ 'hairColor' ] },
      { type: 'LongHairStraight2', variations: [ 'hairColor' ] },
      { type: 'LongHairStraightStrand', variations: [ 'hairColor' ] },
      { type: 'ShortHairDreads01', variations: [ 'hairColor' ] },
      { type: 'ShortHairDreads02', variations: [ 'hairColor' ] },
      { type: 'ShortHairFrizzle', variations: [ 'hairColor' ] },
      { type: 'ShortHairShaggyMullet', variations: [ 'hairColor' ] },
      { type: 'ShortHairShortCurly', variations: [ 'hairColor' ] },
      { type: 'ShortHairShortFlat', variations: [ 'hairColor' ] },
      { type: 'ShortHairShortRound', variations: [ 'hairColor' ] },
      { type: 'ShortHairShortWaved', variations: [ 'hairColor' ] },
      { type: 'ShortHairSides', variations: [ 'hairColor' ] },
      { type: 'ShortHairTheCaesar', variations: [ 'hairColor' ] },
      { type: 'ShortHairTheCaesarSidePart', variations: [ 'hairColor' ] }
    ],
    eyeType: [
      { type: 'Close' },
      { type: 'Cry' },
      { type: 'Default' },
      { type: 'Dizzy' },
      { type: 'EyeRoll' },
      { type: 'Happy' },
      { type: 'Hearts' },
      { type: 'Side' },
      { type: 'Squint' },
      { type: 'Surprised' },
      { type: 'Wink' },
      { type: 'WinkWacky' }
    ],
    eyebrowType: [
      { type: 'Angry' },
      { type: 'AngryNatural' },
      { type: 'Default' },
      { type: 'DefaultNatural' },
      { type: 'FlatNatural' },
      { type: 'RaisedExcited' },
      { type: 'RaisedExcitedNatural' },
      { type: 'SadConcerned' },
      { type: 'SadConcernedNatural' },
      { type: 'UnibrowNatural' },
      { type: 'UpDown' },
      { type: 'UpDownNatural' }
    ],
    accessoriesType: [
      { type: 'Blank' },
      { type: 'Kurt' },
      { type: 'Prescription01' },
      { type: 'Prescription02' },
      { type: 'Round' },
      { type: 'Sunglasses' },
      { type: 'Wayfarers' }
    ],
    mouthType: [
      { type: 'Concerned' },
      { type: 'Default' },
      { type: 'Disbelief' },
      { type: 'Eating' },
      { type: 'Grimace' },
      { type: 'Sad' },
      { type: 'ScreamOpen' },
      { type: 'Serious' },
      { type: 'Smile' },
      { type: 'Tongue' },
      { type: 'Twinkle' },
      { type: 'Vomit' }
    ],
    facialHairType: [
      { type: 'Blank', variations: [ 'facialHairColor' ] },
      { type: 'BeardMedium', variations: [ 'facialHairColor' ] },
      { type: 'BeardLight', variations: [ 'facialHairColor' ] },
      { type: 'BeardMajestic', variations: [ 'facialHairColor' ] },
      { type: 'Mask' },
      { type: 'MoustacheFancy', variations: [ 'facialHairColor' ] },
      { type: 'MoustacheMagnum', variations: [ 'facialHairColor' ] }
    ],
    clotheType: [
      { type: 'BlazerShirt' },
      { type: 'BlazerSweater' },
      { type: 'CollarSweater', variations: [ 'clotheColor' ] },
      { type: 'GraphicShirt', variations: [ 'graphicType', 'clotheColor' ] },
      { type: 'Hoodie', variations: [ 'clotheColor' ] },
      { type: 'Overall', variations: [ 'clotheColor' ] },
      { type: 'ShirtCrewNeck', variations: [ 'clotheColor' ] },
      { type: 'ShirtScoopNeck', variations: [ 'clotheColor' ] },
      { type: 'ShirtVNeck', variations: [ 'clotheColor' ] }
    ]
  },
  variations: {
    clotheColor: [
      { type: 'Black', color: '#262f33' },
      { type: 'Blue01', color: '#64c9ff' },
      { type: 'Blue02', color: '#5099e4' },
      { type: 'Blue03', color: '#25557c' },
      { type: 'Gray01', color: '#e6e6e6' },
      { type: 'Gray02', color: '#929598' },
      { type: 'Heather', color: '#3d4f5c' },
      { type: 'PastelBlue', color: '#b1e2ff' },
      { type: 'PastelGreen', color: '#a7ffc4' },
      { type: 'PastelOrange', color: '#ffdeb5' },
      { type: 'PastelRed', color: '#ffafb9' },
      { type: 'PastelYellow', color: '#ffffb1' },
      { type: 'Pink', color: '#ff488e' },
      { type: 'Red', color: '#ff5c5c' },
      { type: 'White', color: '#ffffff' }
    ],
    facialHairColor: [
      { type: 'Auburn', color: '#a55729' },
      { type: 'Black', color: '#2c1c18' },
      { type: 'Blonde', color: '#b58143' },
      { type: 'BlondeGolden', color: '#d6b370' },
      { type: 'Brown', color: '#724133' },
      { type: 'BrownDark', color: '#4a312c' },
      { type: 'Platinum', color: '#ecdcbf' },
      { type: 'Red', color: '#c93305' }
    ],
    graphicType: [
      { type: 'ExtraLife', requires: [ 'extralife_2020' ] },
      { type: 'GoldenController', requires: [ 'extralife_2020_team' ] },
      { type: 'PacMan', requires: [ 'pacman_top3' ] },
      { type: 'Galaga', requires: [ 'galaga_top3' ] },
      { type: 'DonkeyKong', requires: [ 'dkong_top3' ] },
      { type: 'HighScore', requires: [ 'dkong_tournament_winner', 'galaga_tournament_winner', 'pacman_tournament_winner' ] },
      { type: 'Pizza' },
      { type: 'Bat' },
      { type: 'Deer' },
      { type: 'Diamond' },
      { type: 'Hola' },
      { type: 'Resist' },
      { type: 'Bear' },
      { type: 'Skull' }
    ],
    hatColor: [
      { type: 'Black', color: '#262f33' },
      { type: 'Blue01', color: '#64c9ff' },
      { type: 'Blue02', color: '#5099e4' },
      { type: 'Blue03', color: '#25557c' },
      { type: 'Gray01', color: '#e6e6e6' },
      { type: 'Gray02', color: '#929598' },
      { type: 'Heather', color: '#3d4f5c' },
      { type: 'PastelBlue', color: '#b1e2ff' },
      { type: 'PastelGreen', color: '#a7ffc4' },
      { type: 'PastelOrange', color: '#ffdeb5' },
      { type: 'PastelRed', color: '#ffafb9' },
      { type: 'PastelYellow', color: '#ffffb1' },
      { type: 'Pink', color: '#ff488e' },
      { type: 'Red', color: '#ff5c5c' },
      { type: 'White', color: '#ffffff' }
    ],
    hairColor: [
      { type: 'Auburn', color: '#a55729' },
      { type: 'Black', color: '#2c1c18' },
      { type: 'Blonde', color: '#b58143' },
      { type: 'BlondeGolden', color: '#d6b370' },
      { type: 'Brown', color: '#724133' },
      { type: 'BrownDark', color: '#4a312c' },
      { type: 'PastelPink', color: '#f59797' },
      { type: 'Platinum', color: '#ecdcbf' },
      { type: 'Red', color: '#c93305' },
      { type: 'SilverGray', color: '#e8e1e1' }
    ]
  }
};
