import { Application, CSSUtils, View } from '@nativescript/core';
import { setAutoSystemAppearanceChanged, systemAppearanceChanged } from '@nativescript/core/application';
import { ViewCommon } from '@nativescript/core/ui/core/view/view-common';

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
            setAutoSystemAppearanceChanged(false);
            Theme.rootView.className = classList.get();
        }
        else {
            setAutoSystemAppearanceChanged(true);
            // Reset to Auto system theme
            systemAppearanceChanged(Theme.rootView, Application.systemAppearance());
        }
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
const oldSetupAsRootView = ViewCommon.prototype._setupAsRootView;
ViewCommon.prototype._setupAsRootView = function () {
    oldSetupAsRootView.call(this, ...arguments);
    if(this === Application.getRootView()) {
        //ensure theme is applied on rootView
        Theme.setMode(Theme.currentMode, this);
    }
};
