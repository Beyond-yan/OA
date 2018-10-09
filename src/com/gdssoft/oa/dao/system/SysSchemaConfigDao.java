package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.system.SysSchemaConfig;

/**
 * 
 * @author 
 *
 */
public interface SysSchemaConfigDao extends BaseDao<SysSchemaConfig>{
	/**
	 * 根据schemaCode和siteId查询schema
	 */
	public SysSchemaConfig getDefaultSchema(String schemaCode);
	/**
	 * 根据用户默认schema
	 */
	public SysSchemaConfig getSchema(String schemaCode,Long siteId);
	
	public int getSizeBySite(Long siteId);//根据siteId查询schema
	
	public void update(SysSchemaConfig schemaConfig);
	
	/**
	 * 根据siteId查询schema
	 */
	public List<SysSchemaConfig> getDefaultSiteSchemas();
}