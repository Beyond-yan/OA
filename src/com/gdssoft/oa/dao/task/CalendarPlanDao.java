package com.gdssoft.oa.dao.task;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.model.task.CalendarPlan;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 
 * @author 
 *
 */
public interface CalendarPlanDao extends BaseDao<CalendarPlan>{
	/**
	 * 今日常务
	 * @param userId
	 * @param pb
	 * @return
	 */
	public List<CalendarPlan> getTodayPlans(Long userId,PagingBean pb);
	
	/**
	 * 取得某用户某时间内的所有任务
	 * @param userId
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public List<CalendarPlan> getByPeriod(Long userId,Date startTime,Date endTime);
	/**
	 * 取得当前登录用户的日程列表
	 * @param userId
	 * @param pb
	 * @return
	 */
	public List showCalendarPlanByUserId(Long userId,PagingBean pb);
}