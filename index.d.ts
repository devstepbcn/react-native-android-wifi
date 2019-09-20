declare const wifi: {
    isEnabled: (isEnabled: Function) => void;
    setEnabled: (enabled: boolean) => void;
    findAndConnect: (ssid: string, password: string, ssidFound: Function) => void;
    disconnect: () => void;
    getSSID: (callback: Function) => void;
    getBSSID: (callback: Function) => void;
    loadWifiList: (successCallback: Function, errorCallback: Function) => void;
    connectionStatus: (connectionStatusResult: Function) => void;
    getCurrentSignalStrength: (callback: Function) => void;
    getFrequency: (callback: Function) => void;
    getIP: (callback: Function) => void;
    getDhcpServerAddress: (callback: Function) => void;
    isRemoveWifiNetwork: (ssid: string, callback: Function) => void;
    reScanAndLoadWifiList: (successCallback: Function, errorCallback: Function) => void;
    forceWifiUsage: (useWifi: boolean) => void;
    connectionStatusOfBoundNetwork: (connectionStatusResult: Function) => void;
    connectToHiddenNetwork: (ssid: string, password: string, networkAdded: Function) => void;
}

export default wifi;
