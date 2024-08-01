﻿using System.Text;
using System.Text.RegularExpressions;

namespace Celin.Language.XL;

public record RangeProperties(
string? address = null,
int? cellCount = null,
int? columnCount = null,
bool? columnHidden = null,
int? columnIndex = null,
IEnumerable<IEnumerable<object>>? formulas = null,
bool? hasSpill = null,
decimal? height = null,
bool? hidden = null,
bool? isEntireColumn = null,
bool? isEntireRow = null,
IEnumerable<IEnumerable<string>>? numberFormat = null,
int? rowCount = null,
bool? rowHidden = null,
int? rowIndex = null,
string? style = null,
IEnumerable<IEnumerable<string>>? text = null,
IEnumerable<IEnumerable<object>>? values = null,
IEnumerable<IEnumerable<string>>? valueTypes = null);

public delegate Task SetRangeValueAsync((string? sheet, string? cells, string? name) address, IEnumerable<IEnumerable<object?>> values);
public delegate Task<IEnumerable<IEnumerable<object?>>> GetRangeValueAsync((string? sheet, string? cells, string? name) address);

public class RangeObject : BaseObject<RangeProperties>
{
    public override string Key => _xl.address ?? _local.address ?? string.Empty;
    public override RangeProperties Properties
    {
        get => _xl;
        set => _xl = value;
    }
    public override RangeProperties LocalProperties => _local;
    public static SetRangeValueAsync SetRangeValue { get; set; } = null!;
    public static GetRangeValueAsync GetRangeValue { get; set; } = null!;
    public RangeObject Sheet(string sheet)
    {
        _sheet = sheet;
        return this;
    }
    public RangeObject Cells(string cells)
    {
        _cells = cells.ToUpper();
        return this;
    }
    public RangeObject Resize(int deltaRows, int deltaColumns)
    {
        var m = CELLREF.Match(_cells ?? throw new ArgumentNullException(nameof(Cells)));
        if (m.Success)
        {
            int row = int.Parse(
                string.IsNullOrEmpty(m.Groups[4].Value)
                ? m.Groups[2].Value : m.Groups[4].Value)
                + deltaRows;
            int col = ColumnToNumber(
                string.IsNullOrEmpty(m.Groups[3].Value)
                ? m.Groups[1].Value : m.Groups[3].Value)
                + deltaColumns;
            _cells = $"{m.Groups[1].Value}{m.Groups[2].Value}:{NumberToColumn(col)}{row}";
        }
        else
            throw new ArgumentException($"Invalid Cell Reference: {_cells}");

        return this;
    }
    public RangeObject Name(string name)
    {
        _name = name;
        return this;
    }
    public async Task<IEnumerable<IEnumerable<object?>>> GetValueAsync()
        => await GetRangeValue((_sheet, _cells, _name));
    public async Task SetValueAsync(IEnumerable<IEnumerable<object?>> value) =>
        await SetRangeValue((_sheet,
            AdjustCells(_cells, value.Count(),
                value.FirstOrDefault()?.Count() ?? 0), _name), value);
    public async Task SetValueAsync(string value)
        => await SetValueAsync(value.ToMatrix());
    public override string ToString()
        => _name == null
        ? $"{_sheet}!{_cells}"
        : _name;
    public static (int Left, int Top, int Right, int Bottom) ToRef(string cells)
    {
        var m = CELLREF.Match(cells ?? throw new ArgumentNullException(nameof(Cells)));
        int left = ColumnToNumber(m.Groups[1].Value);
        int top = int.Parse(m.Groups[2].Value);
        int right = string.IsNullOrEmpty(m.Groups[3].Value)
            ? left : ColumnToNumber(m.Groups[3].Value);
        int bottom = string.IsNullOrEmpty(m.Groups[4].Value)
            ? top : int.Parse(m.Groups[4].Value);
        return (left, top, right, bottom);
    }
    static string AdjustCells(string? cells, int rows, int cols)
    {
        var m = CELLREF.Match(cells ?? throw new ArgumentNullException(nameof(Cells)));
        if (m.Success)
        {
            if (!string.IsNullOrEmpty(m.Groups[3].Value))
                return cells;
            int startCol = ColumnToNumber(m.Groups[1].Value);
            int startRow = int.Parse(m.Groups[2].Value);
            return $"{m.Groups[1].Value}{m.Groups[2].Value}:{NumberToColumn(startCol + cols - 1)}{startRow + rows - 1}";
        }
        else
            throw new ArgumentException($"Invalid Cell Reference: {cells}");
    }
    static string NumberToColumn(int number)
    {
        StringBuilder column = new StringBuilder();

        while (number > 0)
        {
            number--; // Adjust number to 0-indexed
            column.Insert(0, (char)('A' + number % 26));
            number /= 26;
        }

        return column.ToString();
    }
    static int ColumnToNumber(string column)
    {
        int number = 0;
        for (int i = 0; i < column.Length; i++)
        {
            number *= 26;
            number += column[i] - 'A' + 1;
        }
        return number;
    }
    static readonly Regex CELLREF = new Regex(@"([a-zA-Z]+)(\d+)(?::([a-zA-Z]+)(\d+))?");
    string? _cells;
    string? _sheet;
    string? _name;
    RangeProperties _local;
    RangeProperties _xl;
    RangeObject(string address)
    {
        _xl = new RangeProperties();
        _local = new RangeProperties(address: address);
    }
    public static RangeObject Range(string address)
        => new(address);
}