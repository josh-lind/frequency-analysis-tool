import React from 'react'; // we need this to make JSX compile
import { FrequenciesContainer } from './models/FrequenciesContainer';
import './Frequencies.scss';
import { SingleFrequency } from './models/SingleFrequency';
import { DigraphFrequency } from './models/DigraphFrequency';

type FrequenciesProps = {
    container: FrequenciesContainer
}

const getPercent = (fr: number) => {
    if (fr === 1) return '100%';
    const num = (fr * 100).toFixed(1);
    return num + '%';
}

const getColorStyle = (fr: number, blue?: boolean) => {
    const bg = blue ? `rgba(153, 204, 255, ${fr})` : `rgba(255, 168, 78, ${fr})`;
    return {
        background: bg
    }
}

const letterRows = (freqs: SingleFrequency[], blue?: boolean) => {
    return freqs.map(singleFr => <tr key={singleFr.text}>
        <td style={getColorStyle(singleFr.frequency, blue)}>{singleFr.text}</td>
        <td style={getColorStyle(singleFr.frequency, blue)}>{getPercent(singleFr.frequency)}</td>
    </tr>)
};

const getTable = (title: string, subtitle: string, singleFrs: SingleFrequency[], blue?: boolean) => {
    return (
        <div className="table-div">
            <table className="singleTable">
                <tbody>
                    <tr>
                        <th colSpan={2} style={{maxWidth: '170px'}}>{title}</th>
                    </tr>
                    <tr>
                        <th>{subtitle}</th>
                        <th>Frequency</th>
                    </tr>
                    {letterRows(singleFrs, blue)}
                </tbody>
            </table>
        </div>
    )
}

const letterRowsDigraph = (freqs: DigraphFrequency[], blue?: boolean) => {
    return freqs.map(diFr => <tr key={diFr.text}>
        <td style={getColorStyle(diFr.frequency, blue)}>
            <div className="flex-inside-td">
                <div>{diFr.text}</div>
                <div>{getPercent(diFr.frequency)}</div>
            </div>
        </td>
        <td style={getColorStyle(diFr.revFrequency, blue)}>
            <div className="flex-inside-td">
                <div>{diFr.revText}</div>
                <div>{getPercent(diFr.revFrequency)}</div>
            </div>
        </td>
    </tr>)
};

const getTableWithReverse = (diFrs: DigraphFrequency[], title: string, blue?: boolean) => {
    return (
        <div className="table-div">
            <table className="singleTable">
                <tbody>
                    <tr>
                        <th colSpan={2} style={{maxWidth: '40px'}}>{title}</th>
                    </tr>
                    <tr>
                        <th>Digraph Fr</th>
                        <th>Reversed Fr</th>
                    </tr>
                    {letterRowsDigraph(diFrs, blue)}
                </tbody>
            </table>
        </div>
    )
}

const Frequencies = ({ container }: FrequenciesProps): JSX.Element => {
    return <>
        {getTable('Regular English Unigram Frequencies', 'Letter', container.plainChar)}
        {(container.cipherChar && container.cipherChar.length > 0) ? getTable('Ciphertext Unigram Frequencies', 'Letter', container.cipherChar, true) : null}
        {getTableWithReverse(container.plainDi, 'Regular English Digram Frequencies')}
        {(container.cipherDi && container.cipherDi.length > 0) ? getTableWithReverse(container.cipherDi, 'Ciphertext Digram Frequencies', true) : null}
        {getTable('Regular English Trigram Frequencies', 'Trigram', container.plainTri)}
        {(container.cipherTri && container.cipherTri.length > 0) ? getTable('Ciphertext Digram Frequencies', 'Trigram', container.cipherTri, true) : null}
    </>
}

export default Frequencies;