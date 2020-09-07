import * as appCommon from '@nativescript/core/application/application-common';
import { Application, CSSUtils, View } from '@nativescript/core';
// import { ViewCommon, _rootModalViews } from '@nativescript/core/ui/core/view/view-common';
import * as viewCommon from '@nativescript/core/ui/core/view/view-common';
// import { removeCssClass, removeFromRootViewCssClasses } from '@nativescript/core/css/system-classes';
import { Device, Screen } from '@nativescript/core/platform';
import * as frame from '@nativescript/core/ui/frame';

const removeClass = CSSUtils.removeSystemCssClass;

const display = Screen.mainScreen;
const whiteSpaceRegExp = /\s+/;
const platformClass = `ns-${global.isAndroid ? 'android' : 'ios'}`;
const sdkVersionClass = Device.sdkVersion.replace('.', '-');

let started = false;

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
    static setMode(mode, root = Application.getRootView()) {
        Theme.currentMode = mode;
        Theme.rootView = root;

        if (!root || !mode) {
            return;
        }

        const classList = new ClassList(Theme.rootView.className);

        classList.remove(Theme.Light, Theme.Dark);
        // classList.remove(Theme.currentMode);
        classList.add(Theme.currentMode);

        if (Theme.currentMode !== Theme.Auto) {
            // removeClass(Theme.Light);
            // removeClass(Theme.Dark);
        } else {
            // Reset to Auto system theme
            setTimeout(appCommon.systemAppearanceChanged.bind(this, Theme.rootView, Application.systemAppearance()));
        }

        Theme.rootView.className = classList.get();
    }

    static toggleMode(isDark) {
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

// Disable SystemAppearance changes if Theme.currentMode is not auto
const oldSystemAppearanceChanged = appCommon.systemAppearanceChanged;

if (oldSystemAppearanceChanged) {
    (appCommon as any).systemAppearanceChanged = function () {
        if (Theme.currentMode === Theme.Auto) {
            oldSystemAppearanceChanged.call(this, ...arguments);
        }
    };
}

// Make sure to substitute systemAppearance method too, as some plugins call it directly
const oldSystemAppearance = Application.systemAppearance;

if (oldSystemAppearance) {
    Application.systemAppearance = function () {
        if (Theme.currentMode === Theme.Auto) {
            return oldSystemAppearance.call(this, ...arguments);
        }

        return Theme.currentMode.substr(3);
    };
}

/* Deprecated root class setters, now available in core modules */
function updateRootClasses(orientation, root = Application.getRootView(), classes: string[] | Set<string> = []) {
    const classList = new ClassList(root.className);

    classList.remove('ns-portrait', 'ns-landscape', 'ns-unknown', ...classes).add(`ns-${orientation}`, ...classes);

    root.className = classList.get();
}

function handleOrientation({ newValue: orientation }) {
    updateRootClasses(orientation);

    if (viewCommon._rootModalViews.length) {
        const classList = new ClassList(Application.getRootView().className);

        viewCommon._rootModalViews.forEach((view) =>
            updateRootClasses(orientation, view as View, classList.add('ns-modal').list)
        );
    }
}

function getOrientation() {
    return display.heightDIPs > display.widthDIPs ? 'portrait' : 'landscape';
}

const rootModalTrap = {
    defineProperty(target, key, desc) {
        if (desc && 'value' in desc) {
            target[key] = desc.value;

            if (desc.value instanceof frame.Frame) {
                const classList = new ClassList(Application.getRootView().className);

                updateRootClasses(getOrientation(), desc.value, classList.add('ns-modal').list);
            }
        }

        return target;
    },
};

Application.on(Application.displayedEvent, () => {
    const root = Application.getRootView();

    // Bail out if no root view or root classes already set (pre 6.1).
    if (!root || root.cssClasses.has('ns-root')) {
        // Add ns-{platform}-{sdkVersion} classes
        if (root) {
            root.className = new ClassList(root.className).add(`${platformClass}__${sdkVersionClass}`).get();
        }

        return;
    }

    // Get notified when a modal is created.
    (viewCommon as any)._rootModalViews = new Proxy(viewCommon._rootModalViews, rootModalTrap);

    root.className = new ClassList(root.className).add('ns-root', platformClass, `ns-${Device.deviceType.toLowerCase()}`).get();

    if (!started) {
        handleOrientation({ newValue: getOrientation() });
        Application.on(Application.orientationChangedEvent, handleOrientation);
        started = true;
    }
});
