package com.gdssoft.oa.dao.system.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysUserAllDao;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.model.system.SysUserAll;

@SuppressWarnings("unchecked")
public class SysUserAllDaoImpl extends BaseDaoImpl<SysUserAll> implements
		SysUserAllDao {

	public SysUserAllDaoImpl() {
		super(SysUserAll.class);
	}

	@Override
	public SysUserAll findByUserName(String username) {
		String hql = "from SysUserAll au where au.userName =?";
		Object[] params = { username.toLowerCase() };
		List<SysUserAll> list = findByHql(hql, params);
		SysUserAll user = null;
		if (list.size() != 0) {
			user = list.get(0);
		}
		return user;
	}

	public SysSchemaConfig findSchemaByUserName(String username) {
		String hsql = "select b.* from oa_common.sys_user_all a , oa_common.sys_schema_config b where a.user_name =:username  AND a.schema_id = b.ID";
		Query q = getSession().createSQLQuery(hsql)
				.addEntity(SysSchemaConfig.class)
				.setParameter("username", username);
		List<SysSchemaConfig> list = q.list();
		SysSchemaConfig sysSchemaConfig = null;
		if (list.size() > 0) {
			sysSchemaConfig = list.get(0);
		}
		return sysSchemaConfig;
	}

	public void delUserByUserName(String userName) {
		SysUserAll userAll = findByUserName(userName);
		this.remove(userAll);
	}

}