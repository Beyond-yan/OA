package com.gdssoft.oa.service.task.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.dao.task.WorkPlanDao;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.task.WorkPlan;
import com.gdssoft.oa.service.task.WorkPlanService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class WorkPlanServiceImpl extends BaseServiceImpl<WorkPlan> implements WorkPlanService{
	private WorkPlanDao dao;
	
	public WorkPlanServiceImpl(WorkPlanDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<WorkPlan> findByDepartment(WorkPlan workPlan,AppUser user, PagingBean pb) {
		return dao.findByDepartment(workPlan,user, pb);
	}

}