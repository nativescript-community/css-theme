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
    static currentRealMode: string;
    static rootView: View;

    static Light = 'light';
    static Dark = 'dark';
    static Auto = 'auto';
    static setMode(mode, root?, autoRealTheme?, triggerCssChange = true) {
        if (!root) {
            root = Application.getRootView();
            if (root && root.parent) {
                root = root.parent;
            }
        }
        // we need to store even if root is undefined yet
        // it will be called again once root exists
        const oldMode = Theme.currentMode;
        Theme.currentMode = mode;
        Theme.rootView = root;
        if (!root || !mode) {
            return;
        }
        const rootModalViews = root._getRootModalViews();
        function addCssClass(rootView, cssClass) {
            cssClass = `${CSSUtils.CLASS_PREFIX}${cssClass}`;
            CSSUtils.pushToSystemCssClasses(cssClass);
            rootView.cssClasses.add(cssClass);
            rootModalViews.forEach((rootModalView) => {
                rootModalView.cssClasses.add(cssClass);
            });
        }

        function removeCssClass(rootView, cssClass) {
            cssClass = `${CSSUtils.CLASS_PREFIX}${cssClass}`;
            CSSUtils.removeSystemCssClass(cssClass);
            rootView.cssClasses.delete(cssClass);
            rootModalViews.forEach((rootModalView) => {
                rootModalView.cssClasses.delete(cssClass);
            });
        }
        removeCssClass(root, Theme.Dark);
        removeCssClass(root, Theme.Light);
        if (oldMode) {
            removeCssClass(root, oldMode);
        }
        if (Theme.currentRealMode) {
            removeCssClass(root, Theme.currentRealMode);
        }

        if (Theme.currentMode !== Theme.Auto) {
            Theme.currentRealMode = Theme.currentMode;
            addCssClass(root, Theme.currentMode);
            Application.setAutoSystemAppearanceChanged(false);
        }
        else {
            Application.setAutoSystemAppearanceChanged(true);
            Theme.currentRealMode = autoRealTheme || Application.systemAppearance();
            // Reset to Auto system theme
            if (triggerCssChange) {
                Application.systemAppearanceChanged(Theme.rootView, Theme.currentRealMode as any);
            } else {
                addCssClass(root, Theme.currentRealMode);
            }
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
