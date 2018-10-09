package com.gdssoft.oa.service.task.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.dao.task.PlanAttendDao;
import com.gdssoft.oa.model.task.PlanAttend;
import com.gdssoft.oa.service.task.PlanAttendService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class PlanAttendServiceImpl extends BaseServiceImpl<PlanAttend> implements PlanAttendService{
	private PlanAttendDao dao;
	
	public PlanAttendServiceImpl(PlanAttendDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public boolean deletePlanAttend(Long planId,Short isDep,Short isPrimary) {
		List<PlanAttend> list=dao.FindPlanAttend(planId,isDep,isPrimary);
		for(PlanAttend pa:list){
			dao.remove(pa.getAttendId());
		}
		return true;
	}

}