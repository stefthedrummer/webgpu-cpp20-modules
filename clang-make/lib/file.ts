import * as fs from "fs";
import { path2QualifiedName } from "./meta";

export class FileInfo {

    private static TimeStamp_Lazy = Number.NaN;
    private static TimeStamp_NotExists = Number.NEGATIVE_INFINITY;

    private _timeStamp = FileInfo.TimeStamp_Lazy;

    private constructor(
        public readonly asString: string,
        public readonly dir: string,
        public readonly name: string,
        public readonly extension: string
    ) { }

    static create(fileDir: string, fileName: string, fileExtension: string) {
        return new FileInfo(
            `${fileDir}/${fileName}.${fileExtension}`,
            fileDir,
            fileName,
            fileExtension);
    }

    static parse(path: string) {
        const indexOfSlash = path.lastIndexOf('/');
        const file = (indexOfSlash != -1) ? path.substring(indexOfSlash + 1) : path;
        const fileDir = (indexOfSlash != -1) ? path.substring(0, indexOfSlash) : ".";
        const indexOfDot = file.lastIndexOf('.');

        const fileName = (indexOfDot != -1) ? file.substring(0, indexOfDot) : "?";
        const fileExtension = (indexOfDot != -1) ? file.substring(indexOfDot + 1) : "?";

        return new FileInfo(
            path,
            fileDir,
            fileName,
            fileExtension);
    }

    get exists() {
        return this.timeStamp != FileInfo.TimeStamp_NotExists;
    }

    get textContent() {
        return fs.readFileSync(this.asString).toString();
    }

    get timeStamp() {
        if (Number.isNaN(this._timeStamp))
            this.refreshTimeStamp();
        return this._timeStamp;
    }

    get qualifiedName() {
        return `${path2QualifiedName(this.dir)}.${this.name}`;
    }

    refreshTimeStamp() {
        return this._timeStamp = fs.existsSync(this.asString) ? fs.statSync(this.asString).mtimeMs : FileInfo.TimeStamp_NotExists;
    }

    save(textContent: string) {
        fs.writeFileSync(this.asString, textContent);
    }

    mkdir() {
        fs.mkdirSync(this.dir, {
            recursive: true
        });
    }
}