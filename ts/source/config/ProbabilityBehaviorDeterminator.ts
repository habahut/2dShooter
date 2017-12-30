export interface ProbabilityBehaviorDeterminator {
    probabilityToBehavior(enumValue: string, probability: number): any;
}
