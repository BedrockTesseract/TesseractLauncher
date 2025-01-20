export default class Library<T extends string> {
    public static load<T extends typeof import('')>(module: string) {
        return window.require(module) as T;
    }
}