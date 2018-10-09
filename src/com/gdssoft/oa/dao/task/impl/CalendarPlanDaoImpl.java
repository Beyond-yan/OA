package com.gdssoft.oa.dao.task.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.dao.task.CalendarPlanDao;
import com.gdssoft.oa.model.task.CalendarPlan;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class CalendarPlanDaoImpl extends BaseDaoImpl<CalendarPlan> implements CalendarPlanDao{

	public CalendarPlanDaoImpl() {
		super(CalendarPlan.class);
	}
	
	/**
	 *取得当前的日常任务 
	 * @param userId
	 * @param pb
	 * @return
	 */
	public List<CalendarPlan> getTodayPlans(Long userId,PagingBean pb){
		String hql="from CalendarPlan cp where cp.userId=? and cp.startTime<=? and cp.endTime>=?";
		
		Date curDate=new Date();
		
		return findByHql(hql, new Object[]{userId,curDate,curDate}, pb);
	}
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.dao.task.CalendarPlanDao#getByPeriod(java.lang.Long, java.util.Date, java.util.Date)
	 */
	public List<CalendarPlan> getByPeriod(Long userId,Date startTime,Date endTime){
		String hql="from CalendarPlan cp where cp.userId=? and ((cp.startTime>=? and cp.startTime<=?) or (cp.endTime>=? and cp.endTime<=?)) order by cp.planId desc";
		return findByHql(hql,new Object[]{userId,startTime,endTime,startTime,endTime});
	}

	@Override
	public List showCalendarPlanByUserId(Long userId, PagingBean pb) {
		// TODO Auto-generated method stub
		ArrayList paramList = new ArrayList();
		StringBuffer hql = new StringBuffer("select vo from CalendarPlan vo where vo.userId=?");
		paramList.add(userId);
		hql.append(" order by planId desc");
		return findByHql(hql.toString(), paramList.toArray(), pb);
	}

}