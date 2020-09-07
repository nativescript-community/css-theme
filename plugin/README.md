[![npm](https://img.shields.io/npm/v/@nativescript-community/csstheme.svg)](https://www.npmjs.com/package/@nativescript-community/csstheme)
[![npm](https://img.shields.io/npm/dt/@nativescript-community/csstheme.svg?label=npm%20downloads)](https://www.npmjs.com/package/@nativescript-community/csstheme)
[![GitHub forks](https://img.shields.io/github/forks/nativescript-community/csstheme.svg)](https://github.com/nativescript-community/csstheme/network)
[![GitHub stars](https://img.shields.io/github/stars/nativescript-community/csstheme.svg)](https://github.com/nativescript-community/csstheme/stargazers)

[![NPM](https://nodei.co/npm/@nativescript-community/csstheme.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/@nativescript-community/csstheme/)

## Installation

* `tns plugin add @nativescript-community/csstheme`

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