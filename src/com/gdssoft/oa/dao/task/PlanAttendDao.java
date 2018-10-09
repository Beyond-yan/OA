package com.gdssoft.oa.dao.task;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.task.PlanAttend;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface PlanAttendDao extends BaseDao<PlanAttend>{
	/**
	 * 根据ID来查找参与人
	 * @param planId
	 * @return
	 */
	public List<PlanAttend> FindPlanAttend(Long planId,Short isDep,Short isPrimary);
}