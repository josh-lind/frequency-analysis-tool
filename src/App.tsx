import React from 'react';
import './App.scss';
import './index.scss';
import { FrequenciesContainer } from './models/FrequenciesContainer';
import Frequencies from './Frequencies';
import { SingleFrequency } from './models/SingleFrequency';
import { DigraphFrequency } from './models/DigraphFrequency';
import logoWithText from './assets/osu-32px-horiz.png';

type AppState = {
  unknownChar: string,
  userInput: string,
  translationWithBlanks: string,
  translationWithoutBlanks: string,
  cipherKey: TranslationChar[],
  frequencies: FrequenciesContainer,
  remainingCTChars: string
}

type TranslationChar = {
  plain: string,
  cipher: string
}

const numRows = 20;
const numCols = 45;
let timeoutsRunning = 0;
let timeoutsRunning2 = 0;

const startingCipherKey = [
  { plain: 'a', cipher: '' },
  { plain: 'b', cipher: '' },
  { plain: 'c', cipher: '' },
  { plain: 'd', cipher: '' },
  { plain: 'e', cipher: '' },
  { plain: 'f', cipher: '' },
  { plain: 'g', cipher: '' },
  { plain: 'h', cipher: '' },
  { plain: 'i', cipher: '' },
  { plain: 'j', cipher: '' },
  { plain: 'k', cipher: '' },
  { plain: 'l', cipher: '' },
  { plain: 'm', cipher: '' },
  { plain: 'n', cipher: '' },
  { plain: 'o', cipher: '' },
  { plain: 'p', cipher: '' },
  { plain: 'q', cipher: '' },
  { plain: 'r', cipher: '' },
  { plain: 's', cipher: '' },
  { plain: 't', cipher: '' },
  { plain: 'u', cipher: '' },
  { plain: 'v', cipher: '' },
  { plain: 'w', cipher: '' },
  { plain: 'x', cipher: '' },
  { plain: 'y', cipher: '' },
  { plain: 'z', cipher: '' }
];

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      unknownChar: '.',
      userInput: '',
      translationWithBlanks: '',
      translationWithoutBlanks: '',
      cipherKey: startingCipherKey,
      frequencies: {
        plainChar: this.getMostCommonLetters(),
        plainDi: this.getMostCommonDigrams(),
        plainTri: this.getMostCommonTrigrams()
      },
      remainingCTChars: ''
    };

    this.updateUnknownChar = this.updateUnknownChar.bind(this);
    this.updateUserInput = this.updateUserInput.bind(this);
    this.getUnsolvedCTChars = this.getUnsolvedCTChars.bind(this);
    this.updateRemainingCTChars = this.updateRemainingCTChars.bind(this);
    this.updateTranslationWithBlanks = this.updateTranslationWithBlanks.bind(this);
    this.updateTranslationWithoutBlanks = this.updateTranslationWithoutBlanks.bind(this);
    this.getLetterJsx = this.getLetterJsx.bind(this);
    this.updateTranslationChars = this.updateTranslationChars.bind(this);
    this.updateCipherFrequencies = this.updateCipherFrequencies.bind(this);
  }

  updateUnknownChar(event: any) {
    const newChar = event.target.value;
    this.setState({ unknownChar: newChar });

    timeoutsRunning2++;
    setTimeout(() => {
      timeoutsRunning2--;
      if (timeoutsRunning2 === 0) {
        this.updateTranslationWithBlanks();
        this.updateTranslationWithoutBlanks();
        this.updateRemainingCTChars();
      }
    }, 1000);
  }

  updateUserInput(event: any) {
    const userInput = event.target.value;
    this.setState({ userInput });

    timeoutsRunning++;
    setTimeout(() => {
      timeoutsRunning--;
      if (timeoutsRunning === 0) {
        this.updateCipherFrequencies();
        this.updateTranslationWithBlanks();
        this.updateTranslationWithoutBlanks();
        this.updateRemainingCTChars();
      }
    }, 1000);
  }

  updateCipherFrequencies() {
    const text = this.state.userInput;
    if (text.length < 10) return;
    const frequencies = { ...this.state.frequencies };
    frequencies.cipherChar = this.getCipherSingleFrs(text);
    frequencies.cipherDi = this.getCipherDiFrs(text);
    frequencies.cipherTri = this.getCipherTriFrs(text);
    this.setState({ frequencies });
  }

  getCipherSingleFrs(text: string): SingleFrequency[] {
    const dict: any = {};
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (dict[ch]) dict[ch]++;
      else dict[ch] = 1;
    }
    const sfs: SingleFrequency[] = [];
    for (const field in dict) {
      sfs.push({ text: field, frequency: dict[field] });
    }
    sfs.sort((a, b) => b.frequency - a.frequency);
    const max = sfs[0].frequency;
    sfs.forEach(el => el.frequency /= max);
    return sfs;
  }

  getCipherDiFrs(text: string): DigraphFrequency[] {
    const dict: any = {};
    for (let i = 0; i < text.length - 1; i++) {
      const ch = text.substr(i, 2);
      if (dict[ch]) dict[ch]++;
      else dict[ch] = 1;
    }
    let dfArr: DigraphFrequency[] = [];
    for (const field in dict) {
      const revText = field.split("").reverse().join("");
      const revFrequency = dict[revText] ? dict[revText] : 0;
      dfArr.push({ text: field, frequency: dict[field], revText, revFrequency });
    }
    dfArr.sort((a, b) => b.frequency - a.frequency);
    dfArr = dfArr.slice(0, 25);
    const max = dfArr[0].frequency;
    dfArr.forEach(el => {
      el.frequency /= max;
      el.revFrequency /= max;
    });
    return dfArr;
  }

  getCipherTriFrs(text: string): SingleFrequency[] {
    const dict: any = {};
    for (let i = 0; i < text.length - 2; i++) {
      const str = text.substr(i, 3);
      if (dict[str]) dict[str]++;
      else dict[str] = 1;
    }
    let sfArr: SingleFrequency[] = [];
    for (const field in dict) {
      sfArr.push({ text: field, frequency: dict[field] });
    }
    sfArr.sort((a, b) => b.frequency - a.frequency);
    sfArr = sfArr.slice(0, 25);
    const max = sfArr[0].frequency;
    sfArr.forEach(el => el.frequency /= max);
    return sfArr;
  }

  getUnsolvedCTChars(): string {
    return '';
  }

  updateRemainingCTChars() {
    const text = this.state.userInput;
    let remainingCTChars;
    if (!text) {
      remainingCTChars = '';
    } else {
      const uniqueChars: any = {};
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (!uniqueChars[ch]) uniqueChars[ch] = 1;
      }
      let chars: string[] = [];
      for (const prop in uniqueChars) {
        chars.push(prop);
      }
      this.state.cipherKey.forEach(key => {
        chars = chars.filter(x => x !== key.cipher);
      });
      chars = chars.sort();
      remainingCTChars = chars.join(' ');
    }

    this.setState({remainingCTChars});
  }

  updateTranslationWithBlanks() {
    let text = this.state.userInput;
    this.state.cipherKey.forEach(keyChar => {
      if (keyChar.cipher) {
        text = text.replaceAll(keyChar.cipher, keyChar.plain);
      }
    });
    text = text.replaceAll(/[A-Z]/g, this.state.unknownChar);
    this.setState({ translationWithBlanks: text });
  }

  updateTranslationWithoutBlanks() {
    let text = this.state.userInput;
    this.state.cipherKey.forEach(keyChar => {
      if (keyChar.cipher) {
        text = text.replaceAll(keyChar.cipher, keyChar.plain);
      }
    });
    this.setState({ translationWithoutBlanks: text });
  }

  getLetterJsx(tc: TranslationChar): JSX.Element {
    return <div style={{ textAlign: 'center' }} key={tc.plain}>
      <div className="pt-letters">{tc.plain}</div>
      <div style={{ margin: '0 2px' }}>
        <input type="text" key={tc.plain} value={tc.cipher} className="letter-input"
          onChange={(event) => this.updateTranslationChars(event.target.value, tc)} />
      </div>
    </div>
  }

  updateTranslationChars(cipherChar: string, tc: TranslationChar) {
    const cipherKey = [...this.state.cipherKey];
    (cipherKey.find(x => x.plain === tc.plain) as TranslationChar).cipher = cipherChar;
    this.setState({ cipherKey });

    timeoutsRunning2++;
    setTimeout(() => {
      timeoutsRunning2--;
      if (timeoutsRunning2 === 0) {
        this.updateTranslationWithBlanks();
        this.updateTranslationWithoutBlanks();
        this.updateRemainingCTChars();
      }
    }, 1000);
  }

  render() {
    return (
      <div className="app">
        <div className="nav-bar">
          <div className="container">
            <div className="nav-flex">
              <div style={{ fontSize: '1.2em' }}><b>OSU.</b>EDU</div>
              <div><a href="http://rumkin.com/tools/cipher/manipulate.php" style={{marginRight: '1.5em'}}>External Text Manipulator</a> Site created by MRVK OLQG</div>
            </div>
          </div>
        </div>
        <div className="header container">
          <h1 style={{ margin: '0' }}>Frequency Analysis Tool</h1>
          <img src={logoWithText} alt="OSU Logo" />
        </div>
        <div className="container" style={{ marginBottom: '2em' }}>
          <div className="frequencies-container">
            <p style={{ fontSize: '.8em', margin: '12px 0 0' }}>*All percentages listed below refer to relative frequencies</p>
            <p style={{ fontSize: '.8em', margin: '0 0 4px' }}>*Green tables refer to actual frequency, yellow refer to calculated</p>
            <Frequencies container={this.state.frequencies} />
          </div>
          <div className="above-input-fields">
            <div>
              Unknown Letter:{' '}
              <input type="text" className="letter-input" value={this.state.unknownChar} onChange={this.updateUnknownChar} />
            </div>
            <div style={{marginLeft: '12px'}}>
              Remaining Ciphertext Letters: <span className="code">{this.state.remainingCTChars}</span>
            </div>
          </div>
          <div className="above-input-fields">
            {this.state.cipherKey.map(tc => this.getLetterJsx(tc))}
          </div>
          <div className="input-fields">
            <textarea value={this.state.userInput} onChange={this.updateUserInput} cols={numCols} rows={numRows}></textarea>
            <textarea readOnly value={this.state.translationWithBlanks} cols={numCols} rows={numRows}></textarea>
            <textarea readOnly value={this.state.translationWithoutBlanks} cols={numCols} rows={numRows}></textarea>
          </div>
        </div>
      </div>
    )
  }

  getMostCommonLetters() {
    return [
      { text: 'E', frequency: 1 },
      { text: 'T', frequency: .757 },
      { text: 'A', frequency: .675 },
      { text: 'O', frequency: .639 },
      { text: 'I', frequency: .609 },
      { text: 'N', frequency: .578 },
      { text: 'S', frequency: .522 },
      { text: 'R', frequency: .5 },
      { text: 'H', frequency: .492 },
      { text: 'D', frequency: .359 },
      { text: 'L', frequency: .331 },
      { text: 'U', frequency: .239 },
      { text: 'C', frequency: .225 },
      { text: 'M', frequency: .217 },
      { text: 'F', frequency: .191 },
      { text: 'Y', frequency: .175 },
      { text: 'W', frequency: .174 },
      { text: 'G', frequency: .168 },
      { text: 'P', frequency: .151 },
      { text: 'B', frequency: .123 },
      { text: 'V', frequency: .092 },
      { text: 'K', frequency: .057 },
      { text: 'X', frequency: .014 },
      { text: 'Q', frequency: .009 },
      { text: 'J', frequency: .008 },
      { text: 'Z', frequency: .005 },
    ]
  }

  getMostCommonDigrams() {
    return [
      { text: 'TH', frequency: 1, revText: 'HT', revFrequency: .097 },
      { text: 'HE', frequency: .93, revText: 'EH', revFrequency: .101 },
      { text: 'ER', frequency: .582, revText: 'RE', revFrequency: .442 },
      { text: 'IN', frequency: .553, revText: 'NI', revFrequency: .097 },
      { text: 'AN', frequency: .528, revText: 'NA', revFrequency: .119 },
      { text: 'RE', frequency: .582, revText: 'ER', revFrequency: .442 },
      { text: 'ND', frequency: .403, revText: 'DN', revFrequency: .037 },
      { text: 'ED', frequency: .402, revText: 'DE', revFrequency: .182 },
      { text: 'ES', frequency: .368, revText: 'SE', revFrequency: .225 },
      { text: 'EN', frequency: .359, revText: 'NE', revFrequency: .202 },
      { text: 'HA', frequency: .358, revText: 'AH', revFrequency: .013 },
      { text: 'ON', frequency: .341, revText: 'NO', revFrequency: .182 },
      { text: 'TO', frequency: .339, revText: 'OT', revFrequency: .168 },
      { text: 'EA', frequency: .338, revText: 'AE', revFrequency: .001 },
      { text: 'OU', frequency: .336, revText: 'UO', revFrequency: .003 },
      { text: 'NT', frequency: .329, revText: 'TN', revFrequency: .017 },
      { text: 'AT', frequency: .327, revText: 'TA', revFrequency: .169 },
      { text: 'ST', frequency: .324, revText: 'TS', revFrequency: .103 },
      { text: 'HI', frequency: .299, revText: 'IH', revFrequency: .015 },
      { text: 'IT', frequency: .288, revText: 'TI', revFrequency: .25 },
      { text: 'IS', frequency: .28, revText: 'SI', revFrequency: .161 },
      { text: 'AS', frequency: .275, revText: 'SA', revFrequency: .196 },
      { text: 'NG', frequency: .272, revText: 'GN', revFrequency: .011 },
      { text: 'OR', frequency: .269, revText: 'RO', revFrequency: .184 },
      { text: 'ET', frequency: .263, revText: 'TE', revFrequency: .255 },
    ]
  }

  getMostCommonTrigrams() {
    return [
      { text: 'THE', frequency: 1 },
      { text: 'AND', frequency: .464 },
      { text: 'ING', frequency: .337 },
      { text: 'HER', frequency: .31 },
      { text: 'THA', frequency: .224 },
      { text: 'ERE', frequency: .21 },
      { text: 'HIS', frequency: .199 },
      { text: 'HAT', frequency: .187 },
      { text: 'ENT', frequency: .171 },
      { text: 'NTH', frequency: .17 },
      { text: 'DTH', frequency: .161 },
      { text: 'ETH', frequency: .157 },
      { text: 'FOR', frequency: .154 },
      { text: 'YOU', frequency: .153 },
      { text: 'ITH', frequency: .15 },
      { text: 'WAS', frequency: .147 },
      { text: 'INT', frequency: .14 },
      { text: 'THI', frequency: .138 },
      { text: 'SHE', frequency: .136 },
      { text: 'OTH', frequency: .135 },
      { text: 'TER', frequency: .131 },
      { text: 'WIT', frequency: .13 },
      { text: 'HES', frequency: .13 },
      { text: 'ION', frequency: .128 },
      { text: 'VER', frequency: .125 },
    ]
  }

}

export default App;
