﻿using BlazorState;
using Celin.Language.XL;
using Celin.XL.Sharp.Services;
using MediatR;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.JSInterop;
using static Celin.XL.Sharp.AppState;
using static MudBlazor.Icons.Material;

namespace Celin.XL.Sharp;

public class JsService
{
    readonly string LIB = "lib";
#pragma warning disable CS8981 // The type name only contains lower-cased ascii characters. Such names may become reserved for the language.
    #region app
    enum app
    {
        init,
        initCommandPrompt,
        openLoginDlg,
        openEditorDlg,
        messageDlg,
        closeDlg,
    }
    string App(app f) => $"{LIB}.{nameof(app)}.{f:g}";
    public ValueTask Init()
        => _js.InvokeVoidAsync(App(app.init), _ref);
    public ValueTask InitCommandPrompt(string id)
        => _js.InvokeVoidAsync(App(app.initCommandPrompt), id);
    public ValueTask Login(string title, string? user)
        => _js.InvokeVoidAsync(App(app.openLoginDlg), title, user);
    public ValueTask Editor(string key, string title, string content)
        => _js.InvokeVoidAsync(App(app.openEditorDlg), key, title, content);
    public ValueTask MessageDlg(string msg)
        => _js.InvokeVoidAsync(App(app.messageDlg), msg);
    public ValueTask CloseDlg()
        => _js.InvokeVoidAsync(App(app.closeDlg));
    #endregion
    #region Excel
    enum xl
    {
        syncSheet,
        syncRange,
        syncList,
    }
    string XL(xl f) => $"{LIB}.{nameof(xl)}.{f:g}";
    public ValueTask<ListProperties<object?>> syncList(string? key, ListProperties<object?> values, params string[] pars)
        => _js.InvokeAsync<ListProperties<object?>>(XL(xl.syncList), key, pars[0], values.Local);
    public ValueTask<RangeProperties> syncRange(string? key, RangeProperties values, params string[] pars)
        => _js.InvokeAsync<RangeProperties>(XL(xl.syncRange), key, values);
    public ValueTask<SheetProperties> syncSheet(string? key, SheetProperties values, params string[] pars)
        => _js.InvokeAsync<SheetProperties>(XL(xl.syncSheet), key, values);
    #endregion
    #region invokables
    [JSInvokable]
    public void PromptCommand()
        => _mediator.Send(new PromptCommandAction());
    [JSInvokable]
    public async void UpdateDoc(string key, string doc)
    {
        try
        {
            _sharp.Validate(doc!);
            await CloseDlg();
            var script = _scripts.Scripts[key];
            script.Doc = doc;
            _scripts.SaveScript(key, script);
        }
        catch (Exception ex)
        {
            await MessageDlg(ex.Message);
        }

    }
    [JSInvokable]
    public void Authenticate(string username, string password)
        => _mediator.Send(new AuthenticateAction { Username = username, Password = password });
    [JSInvokable]
    public void CancelDlg()
        => _mediator.Send(new CancelDialogAction());
    #endregion
#pragma warning restore CS8981 // The type name only contains lower-cased ascii characters. Such names may become reserved for the language.

    readonly IJSRuntime _js;
    readonly IMediator _mediator;
    readonly ScriptService _scripts;
    readonly SharpService _sharp;
    readonly DotNetObjectReference<JsService> _ref;
    readonly IStore Store;
    AppState State => Store.GetState<AppState>();
    public JsService(IJSRuntime js, ScriptService scripts, SharpService sharp, IMediator mediator, IStore store)
    {
        _js = js;
        _scripts = scripts;
        _sharp = sharp;
        _mediator = mediator;
        _ref = DotNetObjectReference.Create(this);
        Store = store;

        BaseObject<ListProperties<object?>>.SyncAsyncDelegate = syncList;
        BaseObject<RangeProperties>.SyncAsyncDelegate = syncRange;
        BaseObject<SheetProperties>.SyncAsyncDelegate = syncSheet;
    }
}
