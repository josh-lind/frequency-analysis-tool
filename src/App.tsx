import React from 'react';
import './App.scss';
import './index.scss';

type AppState = {
  unknownChar: string,
  userInput: string,
  cipherKey: TranslationChar[],
}

type TranslationChar = {
  plain: string,
  cipher: string
}

const numRows = 20;
const numCols = 45;

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
      cipherKey: startingCipherKey
    };

    this.updateUnknownChar = this.updateUnknownChar.bind(this);
    this.updateUserInput = this.updateUserInput.bind(this);
    this.getUnsolvedCTChars = this.getUnsolvedCTChars.bind(this);
    this.getTranslationWithBlanks = this.getTranslationWithBlanks.bind(this);
    this.getTranslationWithoutBlanks = this.getTranslationWithoutBlanks.bind(this);
    this.getLetterJsx = this.getLetterJsx.bind(this);
    this.updateTranslationChars = this.updateTranslationChars.bind(this);
  }

  updateUnknownChar(event: any) {
    const newChar = event.target.value;
    this.setState({ unknownChar: newChar });
  }

  updateUserInput(event: any) {
    const userInput = event.target.value;
    this.setState({userInput});
  }

  getUnsolvedCTChars(): string {
    return '';
  }

  getTranslationWithBlanks(): string {
    let text = this.state.userInput;
    this.state.cipherKey.forEach(keyChar => {
      if (keyChar.cipher) {
        text = text.replaceAll(keyChar.cipher, keyChar.plain);
      }
    });
    text = text.replaceAll(/[A-Z]/g, this.state.unknownChar);
    return text;
  }

  getTranslationWithoutBlanks(): string {
    let text = this.state.userInput;
    this.state.cipherKey.forEach(keyChar => {
      if (keyChar.cipher) {
        text = text.replaceAll(keyChar.cipher, keyChar.plain);
      }
    });
    return text;
  }

  getLetterJsx(tc: TranslationChar): JSX.Element {
    return <div style={{textAlign: 'center'}}>
      <div className="pt-letters">{tc.plain}</div>
      <div style={{margin: '0 2px'}}>
        <input type="text" key={tc.plain} value={tc.cipher} className="letter-input" 
          onChange={(event) => this.updateTranslationChars(event.target.value, tc)} />
      </div>
    </div>
  }

  updateTranslationChars(cipherChar: string, tc: TranslationChar) {
    const cipherKey = [...this.state.cipherKey];
    (cipherKey.find(x => x.plain === tc.plain) as TranslationChar).cipher = cipherChar;
    this.setState({cipherKey});
  }

  getMostCommonLetters() {
    return [
      {text: 'E', frequency: 1},
      {text: 'T', frequency: .757},
      {text: 'A', frequency: .675},
      {text: 'O', frequency: .639},
      {text: 'I', frequency: .609},
      {text: 'N', frequency: .578},
      {text: 'S', frequency: .522},
      {text: 'R', frequency: .5},
      {text: 'H', frequency: .492},
      {text: 'D', frequency: .359},
      {text: 'L', frequency: .331},
      {text: 'U', frequency: .239},
      {text: 'C', frequency: .225},
      {text: 'M', frequency: .217},
      {text: 'F', frequency: .191},
      {text: 'Y', frequency: .175},
      {text: 'W', frequency: .174},
      {text: 'G', frequency: .168},
      {text: 'P', frequency: .151},
      {text: 'B', frequency: .123},
      {text: 'V', frequency: .092},
      {text: 'K', frequency: .057},
      {text: 'X', frequency: .014},
      {text: 'Q', frequency: .009},
      {text: 'J', frequency: .008},
      {text: 'Z', frequency: .005},
    ]
  }

  render() {
    return (
      <div className="app">
        <div className="nav-bar container">
          <h2>Frequency Analysis Tool</h2>
        </div>
        <div className="container">
          <div className="frequencies-container">
            stuff
          </div>
          <div className="above-input-fields">
            <div>
              Unknown Letter:{' '}
              <input type="text" className="letter-input" value={this.state.unknownChar} onChange={this.updateUnknownChar} />
            </div>
            <div style={{marginLeft: '12px'}}>
              Remaining Ciphertext Letters: {this.getUnsolvedCTChars()}
            </div>
          </div>
          <div className="above-input-fields">
            {this.state.cipherKey.map(tc => this.getLetterJsx(tc))}
          </div>
          <div className="input-fields">
            <textarea value={this.state.userInput} onChange={this.updateUserInput} cols={numCols} rows={numRows}></textarea>
            <textarea value={this.getTranslationWithBlanks()} cols={numCols} rows={numRows}></textarea>
            <textarea value={this.getTranslationWithoutBlanks()} cols={numCols} rows={numRows}></textarea>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
