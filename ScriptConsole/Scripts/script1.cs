﻿using Celin;
using System;
using System.Text.Json;
using System.Threading.Tasks;

Console.WriteLine("Starting...");

var x = Range.Cells("a1:*");
var m = "[E,2],[3],[,5]".ToMatrix();
var s = m.FirstOrDefault().FirstOrDefault();
Console.WriteLine($"String: {s}");
Console.WriteLine(m.ToMatrix());
Console.WriteLine(m.ToList());
Console.WriteLine(m.ToSingle());

var rq = await Query($"f0101 (an8,alph) all(at1={m.ToSingle()})")
    .RunAsync();
await Range.Cells("d2").SetValueAsync(rq.GridRows);

Console.WriteLine(rq.FormResponse.currentApp);
var v = await Range.Cells("d2:e101").GetValueAsync();
Console.WriteLine(v.ToMatrix());
/*
Console.WriteLine(rq.DynamicRows);
var rs = await E1.RequestAsync<F0101>(rq);
// Simplify the return parameter
var d = rs.fs_DATABROWSE_F0101.data.gridData;
// Dump the query result
Console.WriteLine("Returned {0} records, there are {1}more.", d.summary.records, d.summary.moreRecords ? string.Empty : "no ");
// Note that the 'r' variable is now dynamic
foreach (dynamic r in d.rowset)
{
    // Now we can access the members without concrete class!
    Console.WriteLine("{0,8} {1}", r[0], r[1]);
}

//LogDebug(JsonSerializer.Serialize(rq, new JsonSerializerOptions { WriteIndented = true }));
//LogInformation("Waiting...");
//await Task.Delay(5000);
Console.WriteLine("Done");
*/