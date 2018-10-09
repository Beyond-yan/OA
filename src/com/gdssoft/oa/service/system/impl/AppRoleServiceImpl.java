package com.gdssoft.oa.service.system.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.Map;
import java.util.Set;
import java.util.HashMap;

import com.gdssoft.oa.dao.system.AppRoleDao;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.service.system.AppRoleService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class AppRoleServiceImpl extends BaseServiceImpl<AppRole> implements AppRoleService{
	private AppRoleDao dao;
	
	public AppRoleServiceImpl(AppRoleDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public AppRole getByRoleName(String roleName){
		return dao.getByRoleName(roleName);
	}
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.service.system.AppRoleService#getSecurityDataSource()
	 */
	public HashMap<String,Set<String>>getSecurityDataSource(){
		return dao.getSecurityDataSource();
	}

}
