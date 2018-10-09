package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.system.SysDepartmentConfig;

/**
 * 
 * @author 
 *
 */
public interface SysDepartmentConfigDao extends BaseDao<SysDepartmentConfig>{
	
	public SysDepartmentConfig findByDepCode(String depCode);
	public SysDepartmentConfig findByDepId(Long depId);
	public SysDepartmentConfig findByDepCode(String schemaCode,Long depId);
	
}