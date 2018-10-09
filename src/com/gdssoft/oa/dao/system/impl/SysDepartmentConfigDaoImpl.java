package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysDepartmentConfigDao;
import com.gdssoft.oa.model.system.SysDepartmentConfig;

@SuppressWarnings("unchecked")
public class SysDepartmentConfigDaoImpl extends BaseDaoImpl<SysDepartmentConfig> implements SysDepartmentConfigDao{

	public SysDepartmentConfigDaoImpl() {
		super(SysDepartmentConfig.class);
	}
	
	public SysDepartmentConfig findByDepCode(String depCode){
		String hql =" from SysDepartmentConfig sd where sd.depCode=:depCode";
		Query query = this.getSession().createQuery(hql).setParameter("depCode", depCode);
		List<SysDepartmentConfig> list = query.list();
		if(list.size()>0){
			return list.get(0);
		}else{
			return null;
		}
	}
	
	public SysDepartmentConfig findByDepId(Long depId){
		String hsql = "from SysDepartmentConfig sc where sc.depId=:depId";
		Query query = this.getSession().createQuery(hsql)
				.setParameter("depId", depId);
		List<SysDepartmentConfig> list = query.list();
		if(list.size()>0){
			return list.get(0);
		}else{
			return null;
		}
	}
	public SysDepartmentConfig findByDepCode(String schemaCode,Long depId){
		//String hql =" from SysDepartmentConfig sd where sd.depCode=:depCode";
		String hsql = "select a.* from sys_department_config a join sys_schema_config b on a.schema_id=b.id"
				+" where b.schema_code = :schemaCode and a.dep_id = :depId";
		Query query = this.getSession().createSQLQuery(hsql).addEntity(SysDepartmentConfig.class)
				.setParameter("schemaCode", schemaCode)
				.setParameter("depId", depId);
		List<SysDepartmentConfig> list = query.list();
		if(list.size()>0){
			return list.get(0);
		}else{
			return null;
		}
	}

}