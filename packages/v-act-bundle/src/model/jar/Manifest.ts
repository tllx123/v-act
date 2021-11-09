class Manifest{

    headers: {[propName:string]: string} = {};

    setHeader(name: string,value: string): void{
        this.headers[name] = value;
    }

    getHeaders(): {[propName: string]: string}{
        return this.headers;
    }

}

export default Manifest;