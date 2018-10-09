package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysDepartmentConfigDao;
import com.gdssoft.oa.model.system.SysDepartmentConfig;
import com.gdssoft.oa.service.system.SysDepartmentConfigService;

public class SysDepartmentConfigServiceImpl extends BaseServiceImpl<SysDepartmentConfig> implements SysDepartmentConfigService{
	@SuppressWarnings("unused")
	private SysDepartmentConfigDao dao;
	
	public SysDepartmentConfigServiceImpl(SysDepartmentConfigDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public SysDepartmentConfig findByDepCode(String depCode){
		return dao.findByDepCode(depCode);
	}
	
	public SysDepartmentConfig findByDepId(Long depId){
		return dao.findByDepId(depId);
	}
	
	public SysDepartmentConfig findByDepCode(String schemaCode,Long depId){
		return dao.findByDepCode( schemaCode, depId);
	}

}