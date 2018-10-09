package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysSchemaConfigDao;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.service.system.SysSchemaConfigService;

public class SysSchemaConfigServiceImpl extends BaseServiceImpl<SysSchemaConfig> implements SysSchemaConfigService{
	@SuppressWarnings("unused")
	private SysSchemaConfigDao dao;
	
	public SysSchemaConfigServiceImpl(SysSchemaConfigDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/**
	 * 根据schemaCode和siteId查询schema
	 */
	public SysSchemaConfig getDefaultSchema(String schemaCode){
		return dao.getDefaultSchema(schemaCode);
	}
	/**
	 * 根据用户默认schema
	 */
	public SysSchemaConfig getSchema(String schemaCode,Long siteId){
		return dao.getSchema(schemaCode, siteId);
	}
	
	/**
	 * 根据siteId查询schema
	 */
	public int getSizeBySite(Long siteId){
		return dao.getSizeBySite(siteId);
	}
	
	public void update(SysSchemaConfig schemaConfig){
		dao.update(schemaConfig);
	}
	/**
	 * 根据siteId查询schema
	 */
	public List<SysSchemaConfig> getDefaultSiteSchemas(){
		return dao.getDefaultSiteSchemas();
	}

}