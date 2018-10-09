package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.core.dao.BaseDao;

/**
 * 用户
 * @author 
 *
 */
public interface AppRoleDao extends BaseDao<AppRole>{
	public AppRole getByRoleName(String roleName);
	
	/**
	 * 获取安全认证的数据源
	 * @return
	 */
	public HashMap<String,Set<String>>getSecurityDataSource();
	
	public List<AppRole> findDepRole(long roleId,String path);
}
