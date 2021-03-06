import { Set } from './Set';
import { ArrayList } from '../../list/mutable/ArrayList';
import { Sequence } from '../../base/Sequence';
import { Cloneable } from '../../../base/Cloneable';
import { EqualityComparator } from '../../../comparison/equality/EqualityComparator';
import { ReferenceEqualityComparator } from '../../../comparison/equality/ReferenceEqualityComparator';
import { MethodNotImplementedException } from '../../../exceptions/MethodNotImplementedException';
import { ReadOnlyCollectionBase } from '../../collection/readonly/ReadOnlyCollectionBase';
import { ReadOnlySet } from '../readonly/ReadOnlySet';

/**
 * @author Alex Chugaev
 * @since 0.0.1
 * @mutable
 */
export class ArraySet<T> extends ReadOnlyCollectionBase<T> implements Set<T>, Cloneable<ArraySet<T>> {
    private readonly _comparator: EqualityComparator<T>;
    private readonly _items: ArrayList<T> = new ArrayList();

    public get length(): number {
        return this._items.length;
    }

    public get comparator(): EqualityComparator<T> {
        return this._comparator;
    }

    public constructor(items?: Iterable<T>, comparator: EqualityComparator<T> = ReferenceEqualityComparator.get()) {
        super();
        this._comparator = comparator;

        if (items != null) {
            this.addAll(items);
        }
    }

    public add(item: T): boolean {
        return this._items.addIfAbsent(item, this.comparator);
    }

    public addAll(items: Iterable<T>): boolean {
        const oldLength: number = this.length;

        for (const item of items) {
            this._items.addIfAbsent(item, this.comparator);
        }

        return this.length > oldLength;
    }

    public clear(): boolean {
        return this._items.clear();
    }

    public clone(): ArraySet<T> {
        return new ArraySet(this, this.comparator);
    }

    public equals(other: ReadOnlySet<T>): boolean {
        return this.comparator === other.comparator && this.length === other.length && this.containsAll(other);
    }

    /**
     * Modifies the current set so that it contains only elements that are also in a specified collection.
     */
    public intersectWith(other: Iterable<T>): boolean {
        return this.removeBy(
            (ownItem: T): boolean => {
                for (const otherItem of other) {
                    if (this.comparator.equals(ownItem, otherItem)) {
                        return false;
                    }
                }

                return true;
            }
        );
    }

    public isProperSubsetOf(other: Sequence<T>): boolean {
        if (this.length >= other.length) {
            return false;
        }

        return this.isSubsetOf(other);
    }

    public isProperSupersetOf(other: Sequence<T>): boolean {
        if (this.length <= other.length) {
            return false;
        }

        return this.isSupersetOf(other);
    }

    public isSubsetOf(other: Sequence<T>): boolean {
        let isValidSubset: boolean = true;

        for (const ownItem of this) {
            let isCurrentItemInOtherSet: boolean = false;

            for (const otherItem of other) {
                if (this.comparator.equals(ownItem, otherItem)) {
                    isCurrentItemInOtherSet = true;

                    break;
                }
            }

            if (!isCurrentItemInOtherSet) {
                isValidSubset = false;

                break;
            }
        }

        return isValidSubset;
    }

    public isSupersetOf(other: Sequence<T>): boolean {
        let isValidSuperset: boolean = true;

        for (const ownItem of other) {
            let isOtherItemInCurrentSet: boolean = false;

            for (const currentItem of this) {
                if (this.comparator.equals(currentItem, ownItem)) {
                    isOtherItemInCurrentSet = true;

                    break;
                }
            }

            if (!isOtherItemInCurrentSet) {
                isValidSuperset = false;

                break;
            }
        }

        return isValidSuperset;
    }

    public overlaps(other: ReadOnlySet<T>): boolean {
        for (const ownItem of this) {
            for (const otherItem of other) {
                if (this.comparator.equals(ownItem, otherItem)) {
                    return true;
                }
            }
        }

        return false;
    }

    public remove(otherItem: T): boolean {
        return this._items.remove(otherItem, this.comparator);
    }

    public removeAll(items: Iterable<T>): boolean {
        return this._items.removeAll(items, this.comparator);
    }

    public removeBy(predicate: (item: T) => boolean): boolean {
        return this._items.removeBy(predicate);
    }

    public retainAll(items: Iterable<T>): boolean {
        return this._items.retainAll(items, this.comparator);
    }

    public setEquals(other: ReadOnlySet<T>): boolean {
        if (this.length !== other.length) {
            return false;
        }

        for (const otherItem of other) {
            if (!this.contains(otherItem)) {
                return false;
            }
        }

        for (const currentItem of this) {
            let currentItemInOtherCollection: boolean = false;

            for (const otherItem of other) {
                if (this.comparator.equals(currentItem, otherItem)) {
                    currentItemInOtherCollection = true;

                    break;
                }
            }

            if (!currentItemInOtherCollection) {
                return false;
            }
        }

        return true;
    }

    public symmetricExceptWith(other: Sequence<T>): boolean {
        let hasChanged: boolean = false;

        for (const otherItem of other) {
            if (this.contains(otherItem)) {
                if (this.remove(otherItem)) {
                    hasChanged = true;
                }
            } else {
                if (this.add(otherItem)) {
                    hasChanged = true;
                }
            }
        }

        return hasChanged;
    }

    public unionWith(other: Sequence<T>): boolean {
        // TODO: implement
        throw new MethodNotImplementedException('Method "unionWith" is not implemented yet');
    }

    public [Symbol.iterator](): Iterator<T> {
        return this._items[Symbol.iterator]();
    }
}
