﻿namespace Celin.Language.XL;

public record ValuesProperties<T>(
    IEnumerable<IEnumerable<T>>? xl = null,
    List<List<T>>? local = null)
{
    public ValuesProperties() : this(null, null) { }
}
public class ValuesObject<T> : BaseObject<ValuesProperties<T>>
{
    public ValuesObject<T> Set(string value)
    {
        var v = Values<T>.Parse(value);
        for (int row = 0; row < v.Count(); row++)
            for (int col = 0; col < v.ElementAt(row).Count(); col++)
                _local[row][col] = v.ElementAt(row).ElementAt(col);

        return this;
    }
    public T this[int row, int col]
    {
        get => _xl.ElementAt(row)!.ElementAt(col)!;
        set => _local[row][col] = value;
    }
    public override string Key => _address ?? string.Empty;
    public override ValuesProperties<T> Properties
    {
        get => new ValuesProperties<T>(xl: _xl);
        protected set => _xl = value.xl!;
    }
    public override ValuesProperties<T> LocalProperties
    {
        get => new ValuesProperties<T>(local: _local);
        protected set => _local = value.local ?? Init;
    }
    public (int Left, int Top, int Right, int Bottom) Dim { get; protected set; }
    List<List<T>> Init =>
        Enumerable.Range(0, Dim.Bottom - Dim.Top + 1)!
            .Select(_ => Enumerable.Range(0, Dim.Right - Dim.Left + 1)!
               .Select(_ => default(T)!)
               .ToList())
            .ToList();
    string _address;

    IEnumerable<IEnumerable<T>> _xl;
    List<List<T>> _local;
    public ValuesObject(
        string? address,
        IEnumerable<IEnumerable<T>>? xl,
        List<List<T>>? local)
    {
        _address = address ?? throw new NullReferenceException("null Range address!");
        _xl = xl ?? Enumerable.Empty<IEnumerable<T>>();
        Dim = RangeObject.Dim(_address);
        _local = local ?? Init;
    }
}
