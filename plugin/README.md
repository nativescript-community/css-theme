[![npm](https://img.shields.io/npm/v/@nativescript-community/css-theme.svg)](https://www.npmjs.com/package/@nativescript-community/css-theme)
[![npm](https://img.shields.io/npm/dt/@nativescript-community/css-theme.svg?label=npm%20downloads)](https://www.npmjs.com/package/@nativescript-community/css-theme)
[![GitHub forks](https://img.shields.io/github/forks/nativescript-community/css-theme.svg)](https://github.com/nativescript-community/css-theme/network)
[![GitHub stars](https://img.shields.io/github/stars/nativescript-community/css-theme.svg)](https://github.com/nativescript-community/css-theme/stargazers)

[![NPM](https://nodei.co/npm/@nativescript-community/css-theme.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/@nativescript-community/css-theme/)

## Installation

* `tns plugin add @nativescript-community/css-theme`

Be sure to run a new build after adding plugins to avoid any issues.

---

Plugin to get diverse device infos. This plugin caches results to make it faster.
```typescript
function isSimulator(): boolean;
function getAppId(): Promise<string>;
function getAppIdSync(): string;
function getVersionName(): Promise<string>;
function getVersionNameSync(): string;
function getAppName(): Promise<string>;
function getAppNameSync(): string;
function getBuildNumber(): Promise<number>;
function getBuildNumberSync(): number;
```