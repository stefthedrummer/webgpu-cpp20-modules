

export abstract class Formatter {
    abstract apply(val: string): string;
    upper() { return new UpperCaseFormatter(this); }
    cap() { return new CapitalizeFormatter(this); }
    spell(...spellings: string[]) { return new SpellFormatter(this, spellings); }

};
export class BaseFormatter extends Formatter {
    apply(val: string): string {
        return val
            .replace(/-/g, '_')
            .replace(/^([0-9])/, '_$1');
    }
};
export class UpperCaseFormatter extends Formatter {
    constructor(protected readonly next: Formatter) { super(); }
    apply(val: string): string {
        return this.next.apply(val.toUpperCase());
    }
};
export class SpellFormatter extends Formatter {
    private readonly spellings: RegExp[]
    constructor(
        protected readonly next: Formatter,
        _spellings: string[]) {
        super();
        this.spellings = _spellings.map(s => new RegExp(s, "gi"));
    }
    apply(val: string): string {
        for (let s of this.spellings) {
            val = val.replace(s, s.source);
        }
        return this.next.apply(val);
    }
};
export class CapitalizeFormatter extends Formatter {
    constructor(protected readonly next: Formatter) { super(); }
    apply(val: string): string {
        const chars = [...val];
        let cap = true;
        for (let i = 0; i < chars.length; i++) {
            if (cap) {
                chars[i] = chars[i].toUpperCase();
            }
            cap = false;
            if (chars[i] == "-" || chars[i] == "_") {
                cap = true;
            }
        }
        return this.next.apply(chars.join(""));
    }
}

export function cppifyName(name: string) {
    return name[0].toUpperCase() + name.substring(1);
}