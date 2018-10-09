package com.gdssoft.oa.service.flow.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.flow.FormDefDao;
import com.gdssoft.oa.model.flow.FormDef;
import com.gdssoft.oa.service.flow.FormDefService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class FormDefServiceImpl extends BaseServiceImpl<FormDef> implements FormDefService{
	private FormDefDao dao;
	
	public FormDefServiceImpl(FormDefDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.service.flow.FormDefService#getByDeployId(java.lang.String)
	 */
	public List<FormDef> getByDeployId(String deployId){
		return dao.getByDeployId(deployId);
	}
	
	/**
	 * 按流程定义ID及任务名称查找对应的表单定义
	 * @param deployId
	 * @param activityName
	 * @return
	 */
	public FormDef getByDeployIdActivityName(String deployId,String activityName){
		return dao.getByDeployIdActivityName(deployId, activityName);
	}

}