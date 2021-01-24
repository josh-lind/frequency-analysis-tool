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

const getColorStyle = (fr: number, yellow?: boolean) => {
    const bg = yellow ? `rgba(255, 255, 0, ${fr})` : `rgba(0, 255, 0, ${fr})`;
    return {
        background: bg
    }
}

const letterRows = (freqs: SingleFrequency[], yellow?: boolean) => {
    return freqs.map(singleFr => <tr>
        <td style={getColorStyle(singleFr.frequency, yellow)}>{singleFr.text}</td>
        <td style={getColorStyle(singleFr.frequency, yellow)}>{getPercent(singleFr.frequency)}</td>
    </tr>)
};

const getTable = (title: string, subtitle: string, singleFrs: SingleFrequency[], yellow?: boolean) => {
    return (
        <div className="table-div">
            <table className="singleTable">
                <tbody>
                    <tr>
                        <th colSpan={2}>{title}</th>
                    </tr>
                    <tr>
                        <th>{subtitle}</th>
                        <th>Frequency</th>
                    </tr>
                    {letterRows(singleFrs, yellow)}
                </tbody>
            </table>
        </div>
    )
}

const letterRowsDigraph = (freqs: DigraphFrequency[], yellow?: boolean) => {
    return freqs.map(diFr => <tr>
        <td style={getColorStyle(diFr.frequency, yellow)}>
            <div className="flex-inside-td">
                <div>{diFr.text}</div>
                <div>{getPercent(diFr.frequency)}</div>
            </div>
        </td>
        <td style={getColorStyle(diFr.revFrequency, yellow)}>
            <div className="flex-inside-td">
                <div>{diFr.revText}</div>
                <div>{getPercent(diFr.revFrequency)}</div>
            </div>
        </td>
    </tr>)
};

const getTableWithReverse = (diFrs: DigraphFrequency[], yellow?: boolean) => {
    return (
        <div className="table-div">
            <table className="singleTable">
                <tbody>
                    <tr>
                        <th colSpan={2}>Common digraphs</th>
                    </tr>
                    <tr>
                        <th>Digraph Fr</th>
                        <th>Reversed Fr</th>
                    </tr>
                    {letterRowsDigraph(diFrs, yellow)}
                </tbody>
            </table>
        </div>
    )
}

const Frequencies = ({ container }: FrequenciesProps): JSX.Element => {
    return <>
        {getTable('Common letters', 'Letter', container.plainChar)}
        {(container.cipherChar && container.cipherChar.length > 0) ? getTable('Common letters', 'Letter', container.cipherChar, true) : null}
        {getTableWithReverse(container.plainDi)}
        {(container.cipherDi && container.cipherDi.length > 0) ? getTableWithReverse(container.cipherDi, true) : null}
        {getTable('Common trigraphs', 'Trigraph', container.plainTri)}
        {(container.cipherTri && container.cipherTri.length > 0) ? getTable('Common trigraphs', 'Trigraph', container.cipherTri, true) : null}
    </>
}

export default Frequencies;