import { Application, CSSUtils, View } from '@nativescript/core';
import { ApplicationCommon } from '@nativescript/core/application';

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
    static setMode(mode, root?, autoRealTheme?) {
        if (!root) {
            root = Application.getRootView();
        }
        // we need to store even if root is undefined yet
        // it will be called again once root exists
        const oldMode = Theme.currentMode;
        Theme.currentMode = mode;
        Theme.rootView = root;
        if (!root || !mode) {
            return;
        }
        function addCssClass(rootView, cssClass) {
            CSSUtils.pushToSystemCssClasses(cssClass);
            rootView.cssClasses.add(cssClass);
        }

        function removeCssClass(rootView, cssClass) {
            CSSUtils.removeSystemCssClass(cssClass);
            rootView.cssClasses.delete(cssClass);
        }
        removeCssClass(root, Theme.Dark);
        removeCssClass(root, Theme.Light);
        if (oldMode) {
            removeCssClass(root, oldMode);
        }

        if (Theme.currentMode !== Theme.Auto) {
            addCssClass(root, Theme.currentMode);
            Application.setAutoSystemAppearanceChanged(false);
        }
        else {
            Application.setAutoSystemAppearanceChanged(true);
            // Reset to Auto system theme
            Application.systemAppearanceChanged(Theme.rootView, autoRealTheme || Application.systemAppearance());
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
const oldinitRootView = ApplicationCommon.prototype.initRootView;
ApplicationCommon.prototype.initRootView = function () {
    oldinitRootView.call(this, ...arguments);
    Theme.setMode(Theme.currentMode, Application.getRootView());
};
