import { DotNet } from "@microsoft/dotnet-js-interop";
import { TestStringComplete } from "./utils"
import { openLoginDlg, messageDlg, closeDlg } from "./dialog";

Office.onReady(async (info) => {
    console.log(info);
    // Workaround for https://github.com/OfficeDev/office-js/issues/429
    // @ts-ignore
    delete history.pushState;
    // @ts-ignore
    delete history.replaceState;
});

export let blazorLib: DotNet.DotNetObject;

function assignNonNullProperties(source: any, target: any) {
    if (Object.values(target).some(value => value !== null)) {
        Object.keys(source).forEach(key => {
            if (source[key] !== null) {
                try {
                    target[key] = source[key];
                } catch { }
            }
        });
        return true;
    }
    return false;
}

function parseRangeAddress(address: string) {
    let m = address.match(/(?:'?([^']+)'?!)?(.+)/);
    let sheet: string|null = m ? m[1] : null;
    let cells: string|null = m ? m[2] : null;
    return { sheet, cells };
}

export const app = {
    init: (lib: DotNet.DotNetObject) => {
        blazorLib = lib;
    },
    initCommandPrompt: (id: string) => {
        let txt = document.getElementById(id) as HTMLInputElement;
        txt.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && event.shiftKey) {
                if (TestStringComplete(txt.value)) {
                    if (txt.value.trim()) {
                        blazorLib.invokeMethodAsync('PromptCommand');
                    }
                    //txt.style.height = '19px';
                    //txt.value = '';
                    event.preventDefault();
                }
            }
        });
    },
    openLoginDlg: (title: string, username: string) => {
        console.log(`Login: ${title}, ${username}`);
        openLoginDlg(title, username);
    },
    messageDlg: (notice: string) => {
        console.log(`Msg: ${notice}`);
        messageDlg(notice);
    },
    closeDlg: () => {
        console.log("Close Dialog");
        closeDlg();
    },
}

export const xl = {
    syncValues: async (key: string, values: any) => {
        let a = parseRangeAddress(key);
        let result = await Excel.run(async (ctx) => {
            const sh = a.sheet == null
                ? ctx.workbook.worksheets.getActiveWorksheet()
                : ctx.workbook.worksheets.getItem(a.sheet);
            const range = sh.getRange(a.cells!);
            range.values = values;
            await ctx.sync();
            range.load("values")
            await ctx.sync();
            return range.values;
        });
        return JSON.stringify(result);
    },
    syncRange: async (key: string, values: Excel.Range) => {
        let a = parseRangeAddress(key);
        let result = await Excel.run(async (ctx) => {
            const sh = a.sheet == null
                ? ctx.workbook.worksheets.getActiveWorksheet()
                : ctx.workbook.worksheets.getItem(a.sheet);
            const range = sh.getRange(a.cells!);
            if (assignNonNullProperties(values, range)) {
                await ctx.sync();
            }
            range.load();
            await ctx.sync();
            return range;
        });
        return JSON.stringify(result);
    },
    syncSheet: async (key: string, values: Excel.Worksheet) => {
        let result = await Excel.run(async (ctx) => {
            const sh = key == null
                ? ctx.workbook.worksheets.getActiveWorksheet()
                : ctx.workbook.worksheets.getItem(key);
            if (assignNonNullProperties(values, sh)) {
                await ctx.sync();
            }
            sh.load();
            await ctx.sync();
            return sh;
        });
        return result;
    },
}
