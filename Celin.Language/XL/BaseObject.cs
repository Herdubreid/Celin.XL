﻿using System.Text.Json.Serialization;

namespace Celin.Language.XL;

[JsonDerivedType(typeof(SheetProperties), nameof(SheetProperties))]
[JsonDerivedType(typeof(RangeProperties), nameof(RangeProperties))]
[JsonDerivedType(typeof(FormatProperties), nameof(FormatProperties))]
[JsonDerivedType(typeof(FillProperties), nameof(FillProperties))]
[JsonDerivedType(typeof(FontProperties), nameof(FontProperties))]
public record BaseProperties(string? Id = null)
{
    public BaseProperties() : this(Id: null) { }
}

public delegate ValueTask<T> SyncAsyncDelegate<T>(string? key, T values, params string[] pars);
public abstract class BaseObject<T>
    where T : new()
{
    public abstract string? Key { get; }
    public virtual string[] Params => [];
    public abstract T Properties { get; protected set; }
    public abstract T LocalProperties { get; set; }
    public static SyncAsyncDelegate<T> SyncAsyncDelegate { get; set; } = null!;
    public async Task Sync()
    {
        Properties = await SyncAsyncDelegate(Key, LocalProperties, Params);
        LocalProperties = new();
    }
}
