package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.model.system.SysUserAll;

/**
 * 
 * @author 
 *
 */
public interface SysUserAllDao extends BaseDao<SysUserAll>{
	
	public SysUserAll findByUserName(String username);
	
	public SysSchemaConfig findSchemaByUserName(String username);
	
	public void delUserByUserName(String userName);
}