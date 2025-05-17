export class ProductId {
    private readonly _value: number

    constructor(value:number) {
        if(!Number.isInteger(value) || value <= 0) {
            throw new Error('UserId must be a positive integer.')
        }

        this._value = value
    }

    public get value(): number {
        return this._value
    }

    public equals(other: ProductId): boolean {
        return other instanceof ProductId && this._value === other._value
    }

    public toString(): string {
        return this._value.toString()
    }
}