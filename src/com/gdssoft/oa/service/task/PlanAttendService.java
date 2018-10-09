package com.gdssoft.oa.service.task;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.model.task.PlanAttend;
import com.gdssoft.core.service.BaseService;

public interface PlanAttendService extends BaseService<PlanAttend>{
	public boolean deletePlanAttend(Long planId,Short isDep,Short isPrimary);
}


