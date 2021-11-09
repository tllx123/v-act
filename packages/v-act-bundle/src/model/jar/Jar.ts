import JarResource from "./JarResource";
import Manifest from "./Manifest";

class Jar{

    manifest: Manifest = new Manifest();

    resources: Array<JarResource> = [];

    getManifest(){
        return this.manifest;
    }

    getResources(): Array<JarResource>{
        return this.resources;
    }

    appendResource(resource: JarResource): void{
        this.resources.push(resource);
    }

}

export default Jar;