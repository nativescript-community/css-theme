import * as appCommon from '@nativescript/core/application/application-common';
import { Application, CSSUtils, View } from '@nativescript/core';
import * as viewCommon from '@nativescript/core/ui/core/view/view-common';

const removeClass = CSSUtils.removeSystemCssClass;

const whiteSpaceRegExp = /\s+/;


export class ClassList {
    list: Set<string>;
    constructor(className) {
        this.list = new Set();

        (className || '').split(whiteSpaceRegExp).forEach((v) => v && this.list.add(v));
    }

    add(...classes) {
        classes.forEach((v) => this.list.add(v));

        return this;
    }

    remove(...classes) {
        classes.forEach((v) => this.list.delete(v));

        return this;
    }

    get() {
        return Array.from(this.list).join(' ');
    }
}

export class Theme {
    static currentMode: string;
    static rootView: View;

    static Light = 'ns-light';
    static Dark = 'ns-dark';
    static Auto = 'auto';
    static setMode(mode, root?) {
        if (!root) {
            root = Application.getRootView();
        }
        // we need to store even if root is undefined yet
        // it will be called again once root exists
        Theme.currentMode = mode;
        Theme.rootView = root;
        if (!root || !mode) {
            return;
        }

        const classList = new ClassList(Theme.rootView.className);
        classList.remove(Theme.Light, Theme.Dark);
        if (Theme.currentMode !== Theme.Auto) {
            removeClass(Theme.Light);
            removeClass(Theme.Dark);
            classList.add(Theme.currentMode);
            appCommon.setAutoSystemAppearanceChanged(false);
        }
        else {
            appCommon.setAutoSystemAppearanceChanged(true);
            // Reset to Auto system theme
            setTimeout(appCommon.systemAppearanceChanged.bind(this, Theme.rootView, Application.systemAppearance()));
        }
        Theme.rootView.className = classList.get();
    }

    static toggleDarkMode(isDark) {
        if (isDark === undefined) {
            const mode =
                Theme.currentMode === Theme.Auto && Application.systemAppearance
                    ? `ns-${Application.systemAppearance()}`
                    : Theme.getMode();

            Theme.setMode(mode === Theme.Light ? Theme.Dark : Theme.Light);

            return;
        }

        Theme.setMode(isDark ? Theme.Dark : Theme.Light);
    }

    static getMode() {
        const root = Application.getRootView();

        return Theme.currentMode || (((root && root.className) || '').indexOf(Theme.Dark) !== -1 ? Theme.Dark : Theme.Light);
    }
}

export default Theme;

// Where the magic happens
const oldSetupAsRootView = viewCommon.ViewCommon.prototype._setupAsRootView;
viewCommon.ViewCommon.prototype._setupAsRootView = function () {
    oldSetupAsRootView.call(this, ...arguments);
    Theme.setMode(Theme.currentMode, this);
};
