enum Url {
    
    VSTORE_HOST = "http://vstore-service.yindangu.com",
    
    VSTORE_LOGIN_HOST = "http://vstore-login.yindangu.com",
    
    VSTORE_LOGIN_URL = "module-operation!executeOperation?operation=VLogin",
    
    VSTORE_DEPLOY_URL = "module-operation!executeOperation?operation=VStoreComponentDeploy",
    
    VSTORE_GET_COMPONENTS = "webapi/vstore_com_external_api/API_COMP_FindCompInstFiles",

    VTEAM_HOST = "http://team.yindangu.net",

    VTEAM_CHECK_TASK_BELONG = "webapi/vteam_project_store/API_CheckingUserBelongTask",

    VTEAM_GET_ENTERPRISE_INFO = "webapi/vteam_svn/API_GetEnterpriseInfo",

    VTEAM_GET_PROJECT_INFO = "webapi/vteam_project/API_GetProjectInfo",

    VTEAM_TASK_REF_URL = "webapi/vteam_task_rel_component/API_SaveTasksRefComponentLog",

    VTEAM_GET_PROJECTS = "webapi/vteam_platform/API_GetProjectInfoByAccount",
   
    VTEAM_GET_PROJECTNAME = "webapi/vteam_task_rel_component/API_GetProjectNameByLibCode"
}

export default Url;