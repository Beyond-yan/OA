package com.gdssoft.oa.service.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/

import java.util.HashMap;
import java.util.Set;

import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.core.service.BaseService;

public interface AppRoleService extends BaseService<AppRole>{
	public AppRole getByRoleName(String roleName);
	
	/**
	 * 获取安全认证的数据源
	 * @return
	 */
	public HashMap<String,Set<String>>getSecurityDataSource();
}
