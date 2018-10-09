package com.gdssoft.oa.dao.flow.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.flow.FormDefDao;
import com.gdssoft.oa.model.flow.FormDef;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class FormDefDaoImpl extends BaseDaoImpl<FormDef> implements FormDefDao{

	public FormDefDaoImpl() {
		super(FormDef.class);
	}

	@Override
	public List<FormDef> getByDeployId(String deployId) {
		String hql="from FormDef fd where deployId=?";
		return findByHql(hql, new Object[]{deployId});
	}
	
	/**
	 * 
	 * @param deployId
	 * @param activityName
	 * @return
	 */
	public FormDef getByDeployIdActivityName(String deployId,String activityName){
		String hql="from FormDef fd where fd.deployId=? and fd.activityName=?";
		return (FormDef)findUnique(hql, new Object[]{deployId,activityName});
	}
}