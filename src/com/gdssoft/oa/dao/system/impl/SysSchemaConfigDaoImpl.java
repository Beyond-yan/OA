package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.ArrayList;
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysSchemaConfigDao;
import com.gdssoft.oa.model.system.SysSchemaConfig;

@SuppressWarnings("unchecked")
public class SysSchemaConfigDaoImpl extends BaseDaoImpl<SysSchemaConfig> implements SysSchemaConfigDao{

	public SysSchemaConfigDaoImpl() {
		super(SysSchemaConfig.class);
	}
	
	/**
	 * 根据schemaCode和siteId查询schema
	 */
	public SysSchemaConfig getSchema(String schemaCode,Long siteId){
		String hsql = " from SysSchemaConfig sc where sc.schemaCode=:schemaCode and sc.sysOaSite.id=:siteId";
		Query query = this.getSession().createQuery(hsql).setParameter("schemaCode", schemaCode).setParameter("siteId", siteId);
		List<SysSchemaConfig> configList = query.list();
		if(configList.size()>0)
			return configList.get(0);
		return null;
	}
	/**
	 * 根据用户默认schema
	 */
	public SysSchemaConfig getDefaultSchema(String schemaCode){
		String hsql = "from SysSchemaConfig sc where sc.sysOaSite.ownerType=1 and sc.schemaCode=:schemaCode  ";
		Query query = this.getSession().createQuery(hsql).setParameter("schemaCode", schemaCode);
		List<SysSchemaConfig> configList = query.list();
		if(configList.size()>0)
			return configList.get(0);
		return null;
	}
	
	/**
	 * 根据siteId查询schema
	 */
	public int getSizeBySite(Long siteId){
		String hsql = "from SysSchemaConfig sc where sc.sysOaSite.id=:siteId";
		Query query = this.getSession().createQuery(hsql).setParameter("siteId", siteId);
		List<SysSchemaConfig> list = query.list();
		return list.size();
	}
	
	/**
	 * 根据siteId查询schema
	 */
	public List<SysSchemaConfig> getDefaultSiteSchemas(){
		String hsql = "from SysSchemaConfig sc where sc.sysOaSite.ownerType=1";
		Query query = this.getSession().createQuery(hsql);
		List<SysSchemaConfig> schemaList = query.list();
		return schemaList;
	}
	
	/**
	 * 更新表sys_schema_config
	 */
	public void update(SysSchemaConfig schemaConfig){
		String sql = "update "+ Constants.PUBLIC_SCHEMA_CODE+".SYS_SCHEMA_CONFIG  SET  SCHEMA_CODE=:schemaCode,"
				+ "SCHEMA_DESC=:schemaDesc" + ",SITE_ID=:siteId";
		sql += ",UPDATE_USER=:currentUser"
				+ ",UPDATE_DATE=sysdate WHERE id=:id";
		Query query = this.getSession().createSQLQuery(sql)
				.setParameter("schemaCode", schemaConfig.getSchemaCode())
				.setParameter("schemaDesc", schemaConfig.getSchemaDesc())
				.setParameter("siteId", schemaConfig.getSysOaSite().getId())
				.setParameter("currentUser", schemaConfig.getUpdateUser())
				.setParameter("id", schemaConfig.getId());
		query.executeUpdate();
	}

}