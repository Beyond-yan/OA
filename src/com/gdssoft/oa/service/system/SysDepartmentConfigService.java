package com.gdssoft.oa.service.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.system.SysDepartmentConfig;

public interface SysDepartmentConfigService extends BaseService<SysDepartmentConfig>{
	
	public SysDepartmentConfig findByDepCode(String depCode);
	
	public SysDepartmentConfig findByDepId(Long depId);
	public SysDepartmentConfig findByDepCode(String schemaCode,Long depId);
	
}


