package com.gdssoft.oa.dao.task;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.task.WorkPlan;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 
 * @author 
 *
 */
public interface WorkPlanDao extends BaseDao<WorkPlan>{
	
	/**
	 * 查找部门分配的计划
	 */
	public List<WorkPlan> findByDepartment(WorkPlan workPlan,AppUser user,PagingBean pb);
}