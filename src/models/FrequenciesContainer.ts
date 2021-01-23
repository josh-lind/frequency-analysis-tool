import { DigraphFrequency } from "./DigraphFrequency";
import { SingleFrequency } from "./SingleFrequency";

export type FrequenciesContainer = {
    plainChar: SingleFrequency[],
    cipherChar?: SingleFrequency[],
    plainDi: DigraphFrequency[],
    cipherDi?: DigraphFrequency[],
    plainTri: SingleFrequency[],
    cipherTri?: SingleFrequency[],
}