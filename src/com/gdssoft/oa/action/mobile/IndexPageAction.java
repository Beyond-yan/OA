package com.gdssoft.oa.action.mobile;

import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.personal.Addressbook;
import com.gdssoft.oa.model.task.CalendarPlan;
import com.gdssoft.oa.service.personal.AddressbookService;
import com.gdssoft.oa.service.task.CalendarPlanService;



public class IndexPageAction extends BaseAction{
	

	@Resource(name="flowTaskService")
	private com.gdssoft.oa.service.flow.TaskService flowTaskService; //cxt20110726
	@Resource
	private CalendarPlanService calendarPlanService;//cxt20110726
	@Resource
	private AddressbookService addressbookService;
	
	
	private short fileAmount; //cxt20110726
	private short calendarPlanAmount;
	private short addressbookAmount;
	private String footDateTime;
	
	
	public String getFootDateTime() {
		return footDateTime;
	}
	public void setFootDateTime(String footDateTime) {
		this.footDateTime = footDateTime;
	}

	public short getFileAmount() {
		return fileAmount;
	}

	public void setFileAmount(short fileAmount) {
		this.fileAmount = fileAmount;
	}

	
	
	public short getCalendarPlanAmount() {
		return calendarPlanAmount;
	}

	public void setCalendarPlanAmount(short calendarPlanAmount) {
		this.calendarPlanAmount = calendarPlanAmount;
	}

	public short getAddressbookAmount() {
		return addressbookAmount;
	}

	public void setAddressbookAmount(short addressbookAmount) {
		this.addressbookAmount = addressbookAmount;
	}

	public String getListSize(){			
		getFileSize();
		listCalendarPlan();
		listMobileAddressbook();
		dateTime();
		
		return SUCCESS;
	}
	
	private void dateTime(){		
		java.util.Date date = new java.util.Date();
		java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyy年MM月dd日 hh:mm", java.util.Locale.CHINA);		
		footDateTime = format.format(date);
	}
	
	private void getFileSize(){
		//PagingBean pb= getInitPagingBean();		
		PagingBean pb = new PagingBean(0, 99999);
		//List<TaskInfo> tasks=flowTaskService.getTaskInfosByUserId(ContextUtil.getCurrentUserId().toString(),pb);
		List<TaskInfo> tasks=flowTaskService.getTaskInfosForFileByUserId(ContextUtil.getCurrentUserId().toString(),pb);		
		fileAmount=(short)tasks.size();		
		List<TaskInfo> tasks2 = tasks;
		if(tasks.size()>=5){
			tasks2 = tasks.subList(0, 5);
		}
		getRequest().setAttribute("taskList", tasks2);
	}
	
	
	/**
	 * 我的日程显示列表
	 */
	private void listCalendarPlan(){		
		QueryFilter filter=new QueryFilter(getRequest());		 
		//是否查看自己的任务列表,若Q_assignerId_L_EQ不为空，则代表是查看自己分配的任务
		if(getRequest().getParameter("Q_assignerId_L_EQ")==null){
			filter.addFilter("Q_userId_L_EQ", ContextUtil.getCurrentUserId().toString());
		}		
		//只显示未完成
		filter.addFilter("Q_status_SN_EQ", "0");
		filter.addSorted("startTime", "desc");		
		List<CalendarPlan> list= calendarPlanService.getAll(filter);		
		calendarPlanAmount=(short)filter.getPagingBean().getTotalItems();		
		System.out.println("----------calendarPlanAmount----------------"+calendarPlanAmount);		
	}
	
	/**
	 * 通讯录显示列表
	 */
	private void listMobileAddressbook(){		
		QueryFilter filter=new QueryFilter(getRequest());		
		if(getRequest().getParameter("personName") != null){
			filter.addFilter("Q_personName_S_LK", getRequest().getParameter("personName"));
		}
		if(getRequest().getParameter("department") != null){
			filter.addFilter("Q_department_S_LK", getRequest().getParameter("department"));
		}
		List<Addressbook> list= addressbookService.getAll(filter);		
		addressbookAmount=(short)filter.getPagingBean().getTotalItems();		
	}
	
}
