import React, { Suspense } from 'react';
import Dynamsoft from 'dwt';

const DWTUserInterface = React.lazy(() => import('./DWTUserInterface'));

export default class DWT extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.features) {
            this.features = 0;
            this.props.features.map((value) => {
                if (this.featureSet[value]) this.features += this.featureSet[value];
                return this.features;
            });
            this.initialStatus = this.features - (this.features & 0b11100011);
        }
        this.state = {
            startTime: (new Date()).getTime(),
            unSupportedEnv: false,
            dwt: null,
            /** status
             * 0:  "Initializing..."
             * 1:  "Core Ready..." (scan)
             * 2:  "Camera Ready..."
             * 32: "BarcodeReader Ready..."
             * 64: "OCR engine Ready..."
             * 128:"Uploader Ready..."
             */
            status: this.initialStatus,
            selected: [],
            buffer: {
                updated: false,
                count: 0,
                current: -1
            },
            zones: [],
            runtimeInfo: {
                curImageTimeStamp: null,
                showAbleWidth: 0,
                showAbleHeight: 0,
                ImageWidth: 0,
                ImageHeight: 0
            },
        };
    }
    featureSet = { scan: 0b1, camera: 0b10, load: 0b100, save: 0b1000, upload: 0b10000, barcode: 0b100000, ocr: 0b1000000, uploader: 0b10000000 };
    features = 0b11111111;
    initialStatus = 0;
    DWObject = null;
    containerId = 'dwtcontrolContainer';
    width = 585;
    height = 513;
    modulizeInstallJS() {
        let _DWT_Reconnect = Dynamsoft.DWT_Reconnect;
        Dynamsoft.DWT_Reconnect = (...args) => _DWT_Reconnect.call({ Dynamsoft: Dynamsoft }, ...args);
        let __show_install_dialog = Dynamsoft._show_install_dialog;
        Dynamsoft._show_install_dialog = (...args) => __show_install_dialog.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainOldPluginNotAllowedCallback = Dynamsoft.OnWebTwainOldPluginNotAllowedCallback;
        Dynamsoft.OnWebTwainOldPluginNotAllowedCallback = (...args) => _OnWebTwainOldPluginNotAllowedCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainNeedUpgradeCallback = Dynamsoft.OnWebTwainNeedUpgradeCallback;
        Dynamsoft.OnWebTwainNeedUpgradeCallback = (...args) => _OnWebTwainNeedUpgradeCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainPostExecuteCallback = Dynamsoft.OnWebTwainPostExecuteCallback;
        Dynamsoft.OnWebTwainPostExecuteCallback = (...args) => _OnWebTwainPostExecuteCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnRemoteWebTwainNotFoundCallback = Dynamsoft.OnRemoteWebTwainNotFoundCallback;
        Dynamsoft.OnRemoteWebTwainNotFoundCallback = (...args) => _OnRemoteWebTwainNotFoundCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnRemoteWebTwainNeedUpgradeCallback = Dynamsoft.OnRemoteWebTwainNeedUpgradeCallback;
        Dynamsoft.OnRemoteWebTwainNeedUpgradeCallback = (...args) => _OnRemoteWebTwainNeedUpgradeCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTWAINDllDownloadFailure = Dynamsoft.OnWebTWAINDllDownloadFailure;
        Dynamsoft.OnWebTWAINDllDownloadFailure = (...args) => _OnWebTWAINDllDownloadFailure.call({ Dynamsoft: Dynamsoft }, ...args);
    }
    componentDidMount() {
		var _this = this;
		Dynamsoft.Ready(function(){
			if (!Dynamsoft.Lib.env.bWin || !Dynamsoft.Lib.product.bHTML5Edition) {
               // _this.setState({ unSupportedEnv: true });
                _this.featureSet = { scan: 0b1, load: 0b100, save: 0b1000, upload: 0b10000, uploader: 0b10000000 };
                _this.features = 0b10011101;
                _this.initialStatus = 0;
            }
            if (_this.DWObject === null)
                _this.loadDWT(true);
		});
    }
    loadDWT(UseService) {
        Dynamsoft.DWT.ResourcesPath = "/dwt-resources";
		//Dynamsoft.DWT.ProductKey = 't0115QAEAAG4ZLRXuCh2kEtr2Ver08iSpktpaiUYFcDEDGe5xBl6F4JMR4GuXWgZXtGOMwOZUYTvhYg8YlLlbB2wGYtfGTpYr3zI+NxdzdP+Q6c8TaB55YhlqNjCNmb1p6j/446kROlO6m5HCRAsaneEE18hB+A==';
		//Dynamsoft.DWT.ProductKey = 't0197AgYAADr+LGhmn4rCzSaFLK2C0v9++K9EPglSFRZj5u7MBx3J8Uvm0dxo4zjKD5+HUeVGnsYObFTr7jI04F4tSZBffxfBHKH6Vp87LctotYhWUUQrZbR8qkUipmiW/Q/z1GkOM9DNgG4HZAPEAks6B6Cv1/TEA+gB6gDq5SAecLmKVP9gC0gcW8b+deqPWycLOPV9p+2Ud5xSwMlHztQgv9QUY1rtsABiT84OoAfoJSDrpXZqEBwBeoCegDYi1AzNH4f+OKc=';
        // Dynamsoft.DWT.ProductKey = 't0115QAEAAJ62OLlvlSl1+K195RZ/9ssujriEp0bf5nAsiIOmTLH2iE2V5T2jvCA59ylWEjaHHR7S97PxjhaZR/UZ0s72y5rt7DI+mcYcwz9lxnoCl2eeWIYuezDNmf3W1H/wx1PLBlO6zkhhYgwws3gBLgRAug==';
        //Dynamsoft.DWT.ProductKey = 't0194AgYAAI6Lo3nXDWDS5qiPKrW+QBcZxk7l44OUDdE2c9LjiMcWBJ7U++cI/ioWgiqfsxZ0IxWS+Ns7srY3CO3SCS730b2CQ4XiXbyutMqjtSxaQxYt82h1V4tIjNXM/z+MQ6cxGoB2AmzdICvAFJjb2QHfcmmPHiAPMAcwrwd6wOksjusv7COTfnXWH5dOZXDa8840Kc84mcGpW84YkCqG4hdn288A052zAeQBdgpwOdQOAcEekAfYAYACVVv1BwJxM5Y=';
        //Dynamsoft.DWT.ProductKey ='t0194AgYAAE9Qo4OWOU+6To29cl3051eNzKv2TO0d+xNfHJcMcqtDz8pTT6S6UHAJ3g8eGesd6DG30J+rAQ97NU0eENh/Q6EGplZXz+pxpmUZrYpoZUW0KKPlVa3Zexy20/ev/1PHOUzAZwS0HJAFQA5M5WyAbzOXBw+gB8gB5NUADzhcxX7/advI5G+d/bdTJws4db8zT8o9ThRw8pIzBuQVQzHE1fYTgPzkrAB6gA4BzD+1XUBsC9ADtANMBBHwA0flMMw=';
        Dynamsoft.DWT.ProductKey = process.env.NEXT_PUBLIC_PRODUCT_KEY;
        let innerLoad = (UseService) => {
            this.innerLoadDWT(UseService)
                .then(
                    _DWObject => {
                        this.DWObject = _DWObject;
                        if (this.DWObject.Viewer.bind(document.getElementById(this.containerId))) {
							this.DWObject.Viewer.width = this.width;
							this.DWObject.Viewer.height = this.height;
                            this.DWObject.Viewer.setViewMode(1, 1);
							this.DWObject.Viewer.show();
                            this.handleStatusChange(1);
                            this.setState({
                                dwt: this.DWObject
                            });
                            //this.DWObject = this.state.dwt;
                            if (this.DWObject) {
                                /**
                                 * NOTE: RemoveAll doesn't trigger bitmapchanged nor OnTopImageInTheViewChanged!!
                                 */
                                this.DWObject.RegisterEvent("OnBitmapChanged", (changedIndex, changeType) => this.handleBufferChange(changedIndex, changeType));
                                this.DWObject.Viewer.on("topPageChanged", (index, bByScrollBar) => { 
									if (bByScrollBar || this.DWObject.isUsingActiveX()){
										this.go(index);
									}
								});
                                this.DWObject.RegisterEvent("OnPostTransfer", () => this.handleBufferChange());
                                this.DWObject.RegisterEvent("OnPostLoad", () => this.handleBufferChange());
								this.DWObject.RegisterEvent("OnBufferChanged", (e) => {
                                    if(e.action === 'shift' && e.currentId !==  -1){
                                        this.handleBufferChange()
                                    }
                                });
                                this.DWObject.RegisterEvent("OnPostAllTransfers", () => this.DWObject.CloseSource());
                                this.DWObject.Viewer.on('pageAreaSelected', (nImageIndex, rect) => {
                                    if (rect.length > 0) {
										let currentRect = rect[rect.length - 1];
										let oldZones = this.state.zones;
										if(rect.length === 1)
											oldZones = [];
										oldZones.push({ x: currentRect.x, y: currentRect.y, width: currentRect.width, height: currentRect.height });
										this.setState({ zones: oldZones });
									}
                                });
                                this.DWObject.Viewer.on('pageAreaUnselected', () => this.setState({ zones: [] }));
								this.DWObject.Viewer.on("click", () => { 
									this.handleBufferChange();
								});
                                if (Dynamsoft.Lib.env.bWin)
                                    this.DWObject.MouseShape = false;
                                this.handleBufferChange();
                            }
                        }
                    },
                    err => {
                        console.log(err);
                    }
                );
        };
        /**
        * ConnectToTheService is overwritten here for smoother install process.
        */
        Dynamsoft.DWT.ConnectToTheService = () => {
            innerLoad(UseService);
        };
        innerLoad(UseService);
    }
    innerLoadDWT(UseService) {
        return new Promise((res, rej) => {   

			if (UseService !== undefined)
				Dynamsoft.DWT.UseLocalService = UseService;
			this.modulizeInstallJS();
			let dwtInitialConfig = {
				WebTwainId: "dwtObject"
			};
			Dynamsoft.DWT.CreateDWTObjectEx(
				dwtInitialConfig,
				(_DWObject) => {
					res(_DWObject);
				},
				(errorString) => {
					rej(errorString)
				}
			);
        });
    }
    go(index) {
        this.DWObject.CurrentImageIndexInBuffer = index;
        this.handleBufferChange();
    }
    handleBufferChange(changedIndex, changeType) {
        let _updated = false;
        if (changeType === 4) {// Modified
            _updated = true;
        }
		
        let selection = this.DWObject.SelectedImagesIndices;
        this.setState({
            //zones: [],
            selected: selection,
            buffer: {
                updated: _updated,
                current: this.DWObject.CurrentImageIndexInBuffer,
                count: this.DWObject.HowManyImagesInBuffer
            }
        }, () => {
            if (this.state.buffer.count > 0) {
                this.setState({
                    runtimeInfo: {
                        curImageTimeStamp: (new Date()).getTime(),
                        showAbleWidth: (this.DWObject.HowManyImagesInBuffer > 1 ? this.width - 12 : this.width) -4,
                        showAbleHeight: this.height - 4,
                        ImageWidth: this.DWObject.GetImageWidth(this.state.buffer.current),
                        ImageHeight: this.DWObject.GetImageHeight(this.state.buffer.current)
                    }
                });
            }
        });
    }
    handleStatusChange(value) {
        this.setState((state) => { return { status: state.status + value } });
    }
    handleViewerSizeChange(viewSize) {
        this.width = viewSize.width;
        this.height = viewSize.height;
    }
    render() {
        return (
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <DWTUserInterface
                        setUploadedFile={this.props.setUploadedFile}
                        Dynamsoft={Dynamsoft}
                        features={this.features}
                        containerId={this.containerId}
                        startTime={this.state.startTime}
                        dwt={this.state.dwt}
                        status={this.state.status}
                        buffer={this.state.buffer}
                        selected={this.state.selected}
                        zones={this.state.zones}
                        runtimeInfo={this.state.runtimeInfo}
                        handleViewerSizeChange={(viewSize) => this.handleViewerSizeChange(viewSize)}
                        handleStatusChange={(value) => this.handleStatusChange(value)}
                        handleBufferChange={() => this.handleBufferChange()}
                    /></Suspense>
            </div>
        );
    }
}
