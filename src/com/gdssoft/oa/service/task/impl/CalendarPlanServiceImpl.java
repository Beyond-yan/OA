package com.gdssoft.oa.service.task.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.dao.task.CalendarPlanDao;
import com.gdssoft.oa.model.task.CalendarPlan;
import com.gdssoft.oa.service.task.CalendarPlanService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class CalendarPlanServiceImpl extends BaseServiceImpl<CalendarPlan> implements CalendarPlanService{
	private CalendarPlanDao dao;
	
	public CalendarPlanServiceImpl(CalendarPlanDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/**
	 * 今日常务
	 * @param userId
	 * @param pb
	 * @return
	 */
	public List<CalendarPlan> getTodayPlans(Long userId,PagingBean pb){
		return dao.getTodayPlans(userId, pb);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.service.task.CalendarPlanService#getByPeriod(java.lang.Long, java.util.Date, java.util.Date)
	 */
	public List<CalendarPlan> getByPeriod(Long userId,Date startTime,Date endTime){
		return dao.getByPeriod(userId, startTime, endTime);
	}

	@Override
	public List showCalendarPlanByUserId(Long userId, PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.showCalendarPlanByUserId(userId, pb);
	}

}