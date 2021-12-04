import * as p from "path";
import * as fs from "fs";
import * as os from "os";

const toComponentSymbolicName = function (grouId: string, bundleCode: string): string {
    return `${grouId}.component.bundle-${bundleCode}`;
}

const toProjectSymbolicName = function (grouId: string, bundleCode: string): string {
    return `${grouId}.project.bundle-${bundleCode}`;
}

const getManifestEntryPath = function () {
    return "META-INF/MANIFEST.MF";
}

const getVActTempDir = function(){
    const tmpDir = os.tmpdir();
    return p.resolve(tmpDir,"vact");
}

const getExportPath = function(pluginPath:string){
    return `${pluginPath}/out`;
}

export {
    toComponentSymbolicName,
    toProjectSymbolicName,
    getManifestEntryPath,
    getExportPath,
    getVActTempDir
}