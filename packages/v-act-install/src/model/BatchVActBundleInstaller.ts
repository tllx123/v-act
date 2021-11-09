import VActBundleInstaller from "./VActBundleSearcher";

class BatchVActBundleInstaller {

    installers: Array<VActBundleInstaller> = [];

    constructor(installers: Array<VActBundleInstaller>) {
        this.installers = installers;
    }

    install(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                let last: VActBundleInstaller;
                for (let index = 0; index < this.installers.length; index++) {
                    const installer = this.installers[index];
                    if (index + 1 < this.installers.length) {
                        installer.install().then(this.installers[index + 1].install);
                    }
                    last = installer;
                }
                last.install().then(() => {
                    resolve()
                }).catch(err => {
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

}

export default BatchVActBundleInstaller;