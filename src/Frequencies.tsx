import React from 'react'; // we need this to make JSX compile
import { FrequenciesContainer } from './models/FrequenciesContainer';
import './Frequencies.scss';
import { SingleFrequency } from './models/SingleFrequency';

type FrequenciesProps = {
    container: FrequenciesContainer
}

const getPercent = (fr: number) => {
    if (fr == 1) return '100%';
    const num = (fr * 100).toFixed(1);
    return num + '%';
}

const getGreenStyle = (fr: number) => {
    return {
        background: `rgba(0, 255, 0, ${fr})`
    }
}

const letterRow = (freqs: SingleFrequency[]) => {
    return freqs.map(singleFr => <tr>
        <td style={getGreenStyle(singleFr.frequency)}>{singleFr.text}</td>
        <td style={getGreenStyle(singleFr.frequency)}>{getPercent(singleFr.frequency)}</td>
    </tr>)
};

const Frequencies = ({ container }: FrequenciesProps): JSX.Element => {
    return <>
    <div className="table-div">
        <table className="singleTable">
            <tbody>
                <tr>
                    <th colSpan={2}>Most common letters</th>
                </tr>
                <tr>
                    <th>Letter</th>
                    <th>Frequency</th>
                </tr>
                {letterRow(container.plainChar)}
            </tbody>
        </table>
    </div>
    <div className="table-div">
        <table className="singleTable">
            <tbody>
                <tr>
                    <th colSpan={2}>Most common trigrams</th>
                </tr>
                <tr>
                    <th>Letter</th>
                    <th>Frequency</th>
                </tr>
                {letterRow(container.plainTri)}
            </tbody>
        </table>
    </div>
    </>
}

export default Frequencies;