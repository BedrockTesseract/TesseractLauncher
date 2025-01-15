import { CollectionView } from './CollectionView';

interface Array<T> {
    toView(start: number, end: number): CollectionView<T>;
}