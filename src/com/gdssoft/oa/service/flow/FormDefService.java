package com.gdssoft.oa.service.flow;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.flow.FormDef;
import com.gdssoft.core.service.BaseService;

public interface FormDefService extends BaseService<FormDef>{
	/**
	 * 取某流程对应的所有任务表单定义
	 * @param deployId
	 * @return
	 */
	public List<FormDef> getByDeployId(String deployId);
	
	/**
	 * 按流程定义ID及任务名称查找对应的表单定义
	 * @param deployId
	 * @param activityName
	 * @return
	 */
	public FormDef getByDeployIdActivityName(String deployId,String activityName);
}


