/// <reference types='vite/client' />

interface Array<T> {
    toView(start: number, end: number): CollectionView<T>;
}