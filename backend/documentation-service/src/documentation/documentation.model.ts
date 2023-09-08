export class Attachment {
    id: number;
    name: string;
    malfunctions: Malfunction[]
}

export class Malfunction {
    id: number;
    name: string;
    causesAndSilutions: CauseAndSolution[]
}

export class CauseAndSolution {
    id: number;
    reason: string;
    solution: string;
}