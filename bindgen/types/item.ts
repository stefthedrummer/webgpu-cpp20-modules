
export abstract class Item {

    constructor() {
    }

    generateCpp(srcCpp: string[]): void { }
    generateTs(srcTs: string[]): void { }
}
