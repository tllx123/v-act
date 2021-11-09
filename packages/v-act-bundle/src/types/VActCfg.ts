enum NpmClient{
    npm = "npm",
    yarn = "yarn"
}

enum DependencyType{
    local = "local",
    vstore = "vstore"
}

interface Dependency{
    vactName: string,
    type: DependencyType,
    path?: string,
    libCode?: string, 
    symbolicName?: string
}

interface Theme{
    title: string,
    code: string,
    value: string,
    namespace?: string,
    desc?: string
}

interface I18N{
    title: string,
    code: string,
    value: string,
    namespace?: string,
    desc?: string
}

interface VActCfg{

    npmClient?: NpmClient,

    theme?: Array<Theme>,

    i18n?: Array<I18N>,

    dependencies?: Array<Dependency>

}

export default VActCfg;

export {
    VActCfg,
    NpmClient,
    Theme,
    Dependency,
    DependencyType
}