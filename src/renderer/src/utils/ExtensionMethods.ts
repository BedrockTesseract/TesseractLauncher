import { CollectionView } from './CollectionView';

Array.prototype.toView = function<T>(start: number, end: number): CollectionView<T> {
    return CollectionView.fromRange(this, start, end);
}