package com.gdssoft.oa.action.mobile;

import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.task.CalendarPlan;
import com.gdssoft.oa.service.task.CalendarPlanService;

public class CalendarPlanAction extends BaseAction{
	@Resource
	private CalendarPlanService calendarPlanService;
	
	
	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		 
		//是否查看自己的任务列表,若Q_assignerId_L_EQ不为空，则代表是查看自己分配的任务
		if(getRequest().getParameter("Q_assignerId_L_EQ")==null){
			filter.addFilter("Q_userId_L_EQ", ContextUtil.getCurrentUserId().toString());
		}
		
		//只显示未完成
		filter.addFilter("Q_status_SN_EQ", "0");
		filter.addSorted("startTime", "desc");
		
		List<CalendarPlan> list= calendarPlanService.getAll(filter);		
		getRequest().setAttribute("cPlanList", list);
		listCount = list.size();
		getDateTime();
		return "list";
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		CalendarPlan calendarPlan=calendarPlanService.get(Long.valueOf(getRequest().getParameter("planId")));
		
		getRequest().setAttribute("calendarPlan", calendarPlan);
		getDateTime();
		return "detail";
	}
	
	/**
	 * 删除
	 * @return
	 */
	public String del(){		
		Long id= Long.parseLong(getRequest().getParameter("planId"));	
		calendarPlanService.remove(new Long(id));
		
		list();
		getDateTime();
		return "list";
	}
	
	/**
	 * 完成
	 * @return
	 */
	public String finish(){
		CalendarPlan calendarPlan=calendarPlanService.get(Long.valueOf(getRequest().getParameter("planId")));	
		calendarPlan.setStatus(CalendarPlan.STATUS_FINISHED);
		calendarPlanService.save(calendarPlan);
		list();
		getDateTime();
		return "list";
	}
	
	private void getDateTime(){
		java.util.Date date = new java.util.Date();
		java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyy年MM月dd日 hh:mm", java.util.Locale.CHINA);		
		footDateTime = format.format(date);
	}
	private String footDateTime;	
	private int listCount;
	
	
	public int getListCount() {
		return listCount;
	}

	public void setListCount(int listCount) {
		this.listCount = listCount;
	}

	public String getFootDateTime() {
		return footDateTime;
	}
	public void setFootDateTime(String footDateTime) {
		this.footDateTime = footDateTime;
	}
}
