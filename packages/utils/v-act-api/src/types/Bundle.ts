interface Bundle {
    /**
     * 构件id
     */
    id: string,
    /**
     * 构件编号
     */
    compCode: string,
    /**
     * 构件名称
     */
    compName: string,
    /**
     * 构件标识名称
     */
    symbolicName: string,
    /**
     * 所属仓库
     */
    libCode: string,
    /**
     * 创建时间
     */
    createTime: string,
    /**
     * 创建人
     */
    createOwnerCode: string,

    /**
     * 创建人
     */
    createOwnerName: string,

    /**
     * 最后修改时间
     */
    updateTime: string,
    /**
     * 最后修改人
     */
    updateOwnerCode: string,
    /**
 * 最后修改人
 */
    updateOwnerName: string,
    /**
     * 构件下载url
     */
    fileDownUrl: string
    /**
     * 额外信息
     */
    attributeExtendStr:string

    belongLib:string
}

export default Bundle;