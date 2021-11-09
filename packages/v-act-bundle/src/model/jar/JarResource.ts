import {Buffer} from "buffer";

interface JarResource{

    entryPath: string;

    getEntryPath(): string;

    getContent(): Promise<Buffer>;

}

export default JarResource;