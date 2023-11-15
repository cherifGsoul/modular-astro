interface SessionInterface {
    entries(): Object
    get(name: string, theDefault: string | undefined): any
    has(name: string): boolean;
    set(name: string, value: any): void
    unset(name: string): void
    clear(): void
    hasChanged(): boolean;
    regenerate(): SessionInterface;

}