export interface VersionComponent {
    number: number;
    wildcard: boolean;
}

export class Version {
    static readonly zero = '0.0.0.0';
    static readonly wild = '*.*.*.*';

    major: VersionComponent;
    minor: VersionComponent;
    patch: VersionComponent;
    build: VersionComponent;

    constructor(major: VersionComponent, minor: VersionComponent, patch: VersionComponent, build: VersionComponent) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.build = build;
    }

    static fromString(version: string): Version {
        if (!Version.isValid(version))
            throw new Error(`Invalid version string: ${version}`);

        const [
            major = { number: 0, wildcard: false },
            minor = { number: 0, wildcard: false },
            patch = { number: 0, wildcard: false },
            build = { number: 0, wildcard: false }
        ] = version.split('.').map(v => (v === '*' ? { number: 0, wildcard: true } : { number: parseInt(v), wildcard: false }));
        return new Version(major, minor, patch, build);
    }

    static isValid(version: string): boolean {
        return /^(\d+|\*)\.(\d+|\*)\.(\d+|\*)\.(\d+|\*)$/.test(version);
    }

    static compare(a: Version, b: Version): number {
        return a.compare(b);
    }

    static compareStr(a: string, b: string): number {
        return Version.compare(Version.fromString(a), Version.fromString(b));
    }

    compare(b: Version): number {
        if (this.major.wildcard || b.major.wildcard) {
            return 0; 
        }
        if (this.major.number !== b.major.number) return this.major.number - b.major.number;
        if (this.minor.wildcard || b.minor.wildcard) {
            return 0; 
        }
        if (this.minor.number !== b.minor.number) return this.minor.number - b.minor.number;
        if (this.patch.wildcard || b.patch.wildcard) {
            return 0; 
        }
        if (this.patch.number !== b.patch.number) return this.patch.number - b.patch.number;
        if (this.build.wildcard || b.build.wildcard) {
            return 0; 
        }
        if (this.build.number !== b.build.number) return this.build.number - b.build.number;
        return 0;
    }

    toString(): string {
        return `${this.major.wildcard ? '*' : this.major.number}.${this.minor.wildcard ? '*' : this.minor.number}.${this.patch.wildcard ? '*' : this.patch.number}.${this.build.wildcard ? '*' : this.build.number}`;
    }

    getNumber(): number {
        return this.major.number * 1000000 + this.minor.number * 10000 + this.patch.number * 100 + this.build.number;
    }
}