﻿using BlazorState;

namespace Celin.XL.Sharp;

public partial class AppState : State<AppState>
{
    public bool Busy { get; set; }
    public IAction? NextAction { get; set; }
    public string? Command { get; set; }
    public List<string> History { get; } = new List<string>();
    public string? CommandError { get; set; }
    public override void Initialize() { }
}
